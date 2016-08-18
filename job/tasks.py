# -*- coding: utf-8 -*-

import os
import re
import json
import uuid
import stat
import time
import codecs
import shutil
import logging
import tempfile
import traceback
from distutils.version import LooseVersion as Version

from django.conf import settings
from django.db import transaction, DatabaseError
from django.utils import timezone

import pexpect
from celery import Task

from .models import Taskinstance
from .utils import get_ansible_version, get_ssh_version


HIDDEN_PASSWORD = '**********'
OPENSSH_KEY_ERROR = u"It looks like you're trying to use a private key in OpenSSH format, which isn't supported by the installed version of OpenSSH on this Tower instance. Try upgrading OpenSSH or providing your private key in an different format. "
logger = logging.getLogger('job.tasks')


class BaseTask(Task):
    name = None
    model = None
    abstract = True

    def update_model(self, pk, _attempt=0, **updates):
        """更新model的给定字段"""
        output_replacements = updates.pop('output_replacements', None) or []
        try:
            with transaction.atomic():
                instance = self.model.objects.get(pk=pk)
                if updates:
                    update_fields = []
                    for field, value in updates.items():
                        if field in ('result_stdout', 'result_traceback'):
                            for srch, repl in output_replacements:
                                value = value.replace(srch, repl)

                        setattr(instance, field, value)
                        update_fields.append(field)

                    instance.save(update_fields=update_fields)
                return instance
        except DatabaseError as e:
            logger.debug('Database error updating %s, retrying in 5 seconds (retry #%d): %s', self.model._meta.object_name, _attempt + 1, e)
            if _attempt < 5:
                time.sleep(5)
                return self.update_model(pk, _attempt=(_attempt + 1), output_replacements=output_replacements, **updates)
            logger.error('Failed to update %s after %d retries.', self.model._meta.object_name, _attempt)

        return

    def signal_finished(self, pk):
        pass

    def get_path_to(self, *args):
        """
        Return absolute path relative to this file.
        """
        return os.path.abspath(os.path.join(os.path.dirname(__file__), *args))

    def build_private_data(self, job, **kwargs):
        """
        Return SSH private key data (only if stored in DB as ssh_key_data).
        Return structure is a dict of the form:
        """
        pass


    def build_private_data_dir(self, instance, **kwargs):
        """
        Create a temporary directory for job-related files.
        """
        path = tempfile.mkdtemp(prefix='fire_job_')
        os.chmod(path, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)
        return path

    def build_private_data_files(self, instance, **kwargs):
        """
        Create a temporary files containing the private data.
        Returns a dictionary with keys from build_private_data
        (i.e. 'credential', 'cloud_credential', 'network_credential') and values the file path.
        """
        private_data = self.build_private_data(instance, **kwargs)
        private_data_files = {}
        if private_data is not None:
            ssh_ver = get_ssh_version()
            ssh_too_old = True if ssh_ver == 'unknown' else Version(ssh_ver) < Version('6.0')
            openssh_keys_supported = ssh_ver != 'unknown' and Version(ssh_ver) >= Version('6.5')
            for name, data in private_data.iteritems():
                if 'OPENSSH PRIVATE KEY' in data and not openssh_keys_supported:
                    raise RuntimeError(OPENSSH_KEY_ERROR)

            for name, data in private_data.iteritems():
                if 'OPENSSH PRIVATE KEY' in data and not data.endswith('\n'):
                    data += '\n'
                if name in ('credential', 'network_credential', 'scm_credential', 'ad_hoc_credential') and not ssh_too_old:
                    path = os.path.join(kwargs.get('private_data_dir', tempfile.gettempdir()), name)
                    self.open_fifo_write(path, data)
                else:
                    handle, path = tempfile.mkstemp(dir=kwargs.get('private_data_dir', None))
                    f = os.fdopen(handle, 'w')
                    f.write(data)
                    f.close()
                    os.chmod(path, stat.S_IRUSR | stat.S_IWUSR)
                private_data_files[name] = path

        return private_data_files

    def open_fifo_write(self, path, data):
        """open_fifo_write opens the fifo named pipe in a new thread.
        This blocks until the the calls to ssh-agent/ssh-add have read the
        credential information from the pipe.
        """
        os.mkfifo(path, 384)
        thread.start_new_thread(lambda p, d: open(p, 'w').write(d), (path, data))

    def build_passwords(self, instance, **kwargs):
        """
        Build a dictionary of passwords for responding to prompts.
        """
        return {'yes': 'yes',
         'no': 'no',
         '': ''}

    def add_ansible_venv(self, env):
        if settings.ANSIBLE_USE_VENV:
            env['VIRTUAL_ENV'] = settings.ANSIBLE_VENV_PATH
            env['PATH'] = os.path.join(settings.ANSIBLE_VENV_PATH, 'bin') + ':' + env['PATH']
            venv_libdir = os.path.join(settings.ANSIBLE_VENV_PATH, 'lib')
            env.pop('PYTHONPATH', None)
            for python_ver in ['python2.7', 'python2.6']:
                if os.path.isdir(os.path.join(venv_libdir, python_ver)):
                    env['PYTHONPATH'] = os.path.join(venv_libdir, python_ver, 'site-packages') + ':'
                    break

        return env

    def add_tower_venv(self, env):
        if settings.TOWER_USE_VENV:
            env['VIRTUAL_ENV'] = settings.TOWER_VENV_PATH
            env['PATH'] = os.path.join(settings.TOWER_VENV_PATH, 'bin') + ':' + env['PATH']
        return env

    def build_env(self, instance, **kwargs):
        """
        Build environment dictionary for ansible-playbook.
        """
        env = dict(os.environ.items())
        for attr in dir(settings):
            if attr == attr.upper() and attr.startswith('ANSIBLE_'):
                env[attr] = str(getattr(settings, attr))

        #for key, value in settings.FIRE_TASK_ENV.items():
        #    env[key] = str(value)

        #if self.should_use_proot(instance, **kwargs):
        #    env['PROOT_TMP_DIR'] = tower_settings.AWX_PROOT_BASE_PATH
        return env

    def build_safe_env(self, instance, **kwargs):
        """
        Build environment dictionary, hiding potentially sensitive information
        such as passwords or keys.
        """
        hidden_re = re.compile('API|TOKEN|KEY|SECRET|PASS', re.I)
        urlpass_re = re.compile('^.*?://.?:(.*?)@.*?$')
        env = self.build_env(instance, **kwargs)
        for k, v in env.items():
            if k in ('REST_API_URL', 'AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_ID'):
                continue
            elif k.startswith('ANSIBLE_'):
                continue
            elif hidden_re.search(k):
                env[k] = HIDDEN_PASSWORD
            elif type(v) == str and urlpass_re.match(v):
                env[k] = urlpass_re.sub(HIDDEN_PASSWORD, v)

        return env

    def args2cmdline(self, *args):
        return ' '.join([ pipes.quote(a) for a in args ])

    def get_ssh_key_path(self, instance, **kwargs):
        """
        Return the path to the SSH key file, if present.
        """
        return ''

    def wrap_args_with_ssh_agent(self, args, ssh_key_path, ssh_auth_sock = None):
        if ssh_key_path:
            cmd = ' && '.join([self.args2cmdline('ssh-add', ssh_key_path), self.args2cmdline('rm', '-f', ssh_key_path), self.args2cmdline(*args)])
            args = ['ssh-agent']
            if ssh_auth_sock:
                args.extend(['-a', ssh_auth_sock])
            args.extend(['sh', '-c', cmd])
        return args

    def should_use_proot(self, instance, **kwargs):
        """
        Return whether this task should use proot.
        """
        return False

    def build_args(self, instance, **kwargs):
        raise NotImplementedError

    def build_safe_args(self, instance, **kwargs):
        return self.build_args(instance, **kwargs)

    def build_cwd(self, instance, **kwargs):
        raise NotImplementedError

    def build_output_replacements(self, instance, **kwargs):
        return []

    def get_idle_timeout(self):
        return None

    def get_password_prompts(self):
        """
        Return a dictionary where keys are strings or regular expressions for
        prompts, and values are password lookup keys (keys that are returned
        from build_passwords).
        """
        return OrderedDict()

    def run_pexpect(self, instance, args, cwd, env, passwords, stdout_handle, output_replacements = None):
        """
        Run the given command using pexpect to capture output and provide
        passwords when requested.
        """
        logfile = stdout_handle
        logfile_pos = logfile.tell()
        #if hasattr(instance, 'extra_vars_dict') and 'PEXPECT_SLEEP' in instance.extra_vars_dict:
        #    pexpect_sleep = int(instance.extra_vars_dict['PEXPECT_SLEEP'])
        #elif 'PEXPECT_SLEEP' in os.environ:
        #    pexpect_sleep = int(os.environ['PEXPECT_SLEEP'])
        #else:
        #    pexpect_sleep = None
        #if pexpect_sleep is not None:
        #    logger.info('Suspending Job Execution for QA Work')
        #    time.sleep(pexpect_sleep)
        child = pexpect.spawnu(args[0], args[1:], cwd=cwd, env=env)
        child.logfile_read = logfile
        canceled = False
        last_stdout_update = time.time()
        idle_timeout = self.get_idle_timeout()
        expect_list = []
        expect_passwords = {}
        pexpect_timeout = getattr(settings, 'PEXPECT_TIMEOUT', 5)
        #for n, item in enumerate(self.get_password_prompts().items()):
        #    expect_list.append(item[0])
        #    expect_passwords[n] = passwords.get(item[1], '') or ''

        expect_list.extend([pexpect.TIMEOUT, pexpect.EOF])
        instance = self.update_model(instance.pk, status=2, output_replacements=output_replacements)
        while child.isalive():
            result_id = child.expect(expect_list, timeout=pexpect_timeout)
            if result_id in expect_passwords:
                child.sendline(expect_passwords[result_id])
            if logfile_pos != logfile.tell():
                logfile_pos = logfile.tell()
                last_stdout_update = time.time()
            instance = self.update_model(instance.pk)
            #if instance.cancel_flag:
            #    try:
            #        if tower_settings.AWX_PROOT_ENABLED and self.should_use_proot(instance):
            #            if not psutil:
            #                os.kill(child.pid, signal.SIGKILL)
            #            else:
            #                try:
            #                    main_proc = psutil.Process(pid=child.pid)
            #                    if hasattr(main_proc, 'children'):
            #                        child_procs = main_proc.children(recursive=True)
            #                    else:
            #                        child_procs = main_proc.get_children(recursive=True)
            #                    for child_proc in child_procs:
            #                        os.kill(child_proc.pid, signal.SIGKILL)

            #                    os.kill(main_proc.pid, signal.SIGKILL)
            #                except TypeError:
            #                    os.kill(child.pid, signal.SIGKILL)

            #        else:
            #            os.kill(child.pid, signal.SIGTERM)
            #        time.sleep(3)
            #        canceled = True
            #    except OSError:
            #        logger.warn('Attempted to cancel already finished job, ignoring')

            if idle_timeout and time.time() - last_stdout_update > idle_timeout:
                child.close(True)
                canceled = True

        if canceled:
            return (12, child.exitstatus)
        elif child.exitstatus == 0:
            return (3, child.exitstatus)
        else:
            return (4, child.exitstatus)

    def pre_run_hook(self, instance, **kwargs):
        """
        Hook for any steps to run before the job/task starts
        """
        pass

    def post_run_hook(self, instance, **kwargs):
        """
        Hook for any steps to run after job/task is complete.
        """
        pass

    def run(self, pk, **kwargs):
        """运行任务并捕获输出结果"""
        instance = self.update_model(pk, status=2, startTime=timezone.now(), celery_task_id=self.request.id)
        status, rc, tb = (4, None, '')
        output_replacements = []
        try:
            self.pre_run_hook(instance, **kwargs)
            if instance.status != 2:
                instance = self.update_model(pk)
                status = instance.status
                raise RuntimeError('not starting %s task' % instance.status)
            kwargs['ansible_version'] = get_ansible_version()
            kwargs['private_data_dir'] = self.build_private_data_dir(instance, **kwargs)
            kwargs['private_data_files'] = self.build_private_data_files(instance, **kwargs)
            #kwargs['passwords'] = self.build_passwords(instance, **kwargs)
            kwargs['passwords'] = ''
            args = self.build_args(instance, **kwargs)
            logger.info("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaargs")
            logger.info(args)
            logger.info("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeend")
            safe_args = self.build_safe_args(instance, **kwargs)
            output_replacements = self.build_output_replacements(instance, **kwargs)
            cwd = self.build_cwd(instance, **kwargs)
            env = self.build_env(instance, **kwargs)
            safe_env = self.build_safe_env(instance, **kwargs)
            if not os.path.exists(settings.JOBOUTPUT_ROOT):
                os.makedirs(settings.JOBOUTPUT_ROOT)
            stdout_filename = os.path.join(settings.JOBOUTPUT_ROOT, '%d-%s.out' % (pk, str(uuid.uuid1())))
            stdout_handle = codecs.open(stdout_filename, 'w', encoding='utf-8')
            if self.should_use_proot(instance, **kwargs):
                if not check_proot_installed():
                    raise RuntimeError('proot is not installed')
                kwargs['proot_temp_dir'] = build_proot_temp_dir()
                args = wrap_args_with_proot(args, cwd, **kwargs)
                safe_args = wrap_args_with_proot(safe_args, cwd, **kwargs)
            ssh_key_path = self.get_ssh_key_path(instance, **kwargs)
            if ssh_key_path:
                ssh_auth_sock = os.path.join(kwargs['private_data_dir'], 'ssh_auth.sock')
                args = self.wrap_args_with_ssh_agent(args, ssh_key_path, ssh_auth_sock)
                safe_args = self.wrap_args_with_ssh_agent(safe_args, ssh_key_path, ssh_auth_sock)
            instance = self.update_model(pk, job_args=json.dumps(safe_args), job_cwd=cwd, job_env=safe_env, result_stdout_file=stdout_filename)
            status, rc = self.run_pexpect(instance, args, cwd, env, kwargs['passwords'], stdout_handle)
        except Exception:
            if status != 12:
                tb = traceback.format_exc()
        finally:
            if kwargs.get('private_data_dir', ''):
                try:
                    shutil.rmtree(kwargs['private_data_dir'], True)
                except OSError:
                    pass

            if kwargs.get('proot_temp_dir', ''):
                try:
                    shutil.rmtree(kwargs['proot_temp_dir'], True)
                except OSError:
                    pass

            try:
                stdout_handle.flush()
                stdout_handle.close()
            except Exception:
                pass

        instance = self.update_model(pk, status=status, result_traceback=tb, output_replacements=output_replacements)
        self.post_run_hook(instance, **kwargs)
        #instance.socketio_emit_status(status)
        if status != 3 and not hasattr(settings, 'CELERY_UNIT_TEST'):
            if status == 12:
                raise Exception('Task %s(pk:%s) was canceled (rc=%s)' % (str(self.model.__class__), str(pk), str(rc)))
            else:
                raise Exception('Task %s(pk:%s) encountered an error (rc=%s)' % (str(self.model.__class__), str(pk), str(rc)))
        if not hasattr(settings, 'CELERY_UNIT_TEST'):
            self.signal_finished(pk)
        return


class RunJob(BaseTask):
    """Celery task to run a job using ansible-playbook."""
    name = 'fire.job.tasks.run_job'
    model = Taskinstance

    def build_private_data(self, job, **kwargs):
        """
        Returns a dict of the form
        dict['credential'] = <credential_decrypted_ssh_key_data>
        dict['cloud_credential'] = <cloud_credential_decrypted_ssh_key_data>
        dict['network_credential'] = <network_credential_decrypted_ssh_key_data>
        """
        #job_credentials = ['credential', 'cloud_credential', 'network_credential']
        private_data = {}
        #for cred_name in job_credentials:
        #    credential = getattr(job, cred_name, None)
        #    if credential:
        #        if credential.ssh_key_data not in (None, ''):
        #            private_data[cred_name] = decrypt_field(credential, 'ssh_key_data') or ''

        #if job.cloud_credential and job.cloud_credential.kind == 'openstack':
        #    credential = job.cloud_credential
        #    openstack_auth = dict(auth_url=credential.host, username=credential.username, password=decrypt_field(credential, 'password'), project_name=credential.project)
        #    if credential.domain not in (None, ''):
        #        openstack_auth['domain_name'] = credential.domain
        #    openstack_data = {'clouds': {'devstack': {'auth': openstack_auth}}}
        #    private_data['cloud_credential'] = yaml.safe_dump(openstack_data, default_flow_style=False, allow_unicode=True)
        return private_data

    def build_passwords(self, job, **kwargs):
        """
        Build a dictionary of passwords for SSH private key, SSH user, sudo/su
        and ansible-vault.
        """
        passwords = super(RunJob, self).build_passwords(job, **kwargs)
        creds = job.credential
        if creds:
            for field in ('ssh_key_unlock', 'ssh_password', 'become_password', 'vault_password'):
                if field == 'ssh_password':
                    value = kwargs.get(field, decrypt_field(creds, 'password'))
                else:
                    value = kwargs.get(field, decrypt_field(creds, field))
                if value not in ('', 'ASK'):
                    passwords[field] = value

        return passwords

    def build_env(self, job, **kwargs):
        """
        Build environment dictionary for ansible-playbook.
        """
        plugin_dir = self.get_path_to('..', 'plugins', 'callback')
        plugin_dirs = [plugin_dir]
        #if hasattr(tower_settings, 'AWX_ANSIBLE_CALLBACK_PLUGINS') and tower_settings.AWX_ANSIBLE_CALLBACK_PLUGINS:
        #    plugin_dirs.append(tower_settings.AWX_ANSIBLE_CALLBACK_PLUGINS)
        plugin_path = ':'.join(plugin_dirs)
        env = super(RunJob, self).build_env(job, **kwargs)
        #env = self.add_ansible_venv(env)
        env['JOB_ID'] = str(job.pk)
        env['INVENTORY_ID'] = str(job.pk)
        env['ANSIBLE_CALLBACK_PLUGINS'] = plugin_path
        env['INVENTORY_URL'] = settings.INVENTORY_URL
        #env['REST_API_TOKEN'] = job.task_auth_token or ''
        #env['CALLBACK_CONSUMER_PORT'] = str(settings.CALLBACK_CONSUMER_PORT)
        if getattr(settings, 'JOB_CALLBACK_DEBUG', False):
            env['JOB_CALLBACK_DEBUG'] = '2'
        elif settings.DEBUG:
            env['JOB_CALLBACK_DEBUG'] = '1'
        cp_dir = os.path.join(kwargs['private_data_dir'], 'cp')
        if not os.path.exists(cp_dir):
            os.mkdir(cp_dir, 448)
        env['ANSIBLE_SSH_CONTROL_PATH'] = os.path.join(cp_dir, 'ansible-ssh-%%h-%%p-%%r')
        #env['INVENTORY_HOSTVARS'] = str(True)
        #cloud_cred = job.cloud_credential
        #if cloud_cred and cloud_cred.kind == 'aws':
        #    env['AWS_ACCESS_KEY'] = cloud_cred.username
        #    env['AWS_SECRET_KEY'] = decrypt_field(cloud_cred, 'password')
        #    if len(cloud_cred.security_token) > 0:
        #        env['AWS_SECURITY_TOKEN'] = decrypt_field(cloud_cred, 'security_token')
        #elif cloud_cred and cloud_cred.kind == 'rax':
        #    env['RAX_USERNAME'] = cloud_cred.username
        #    env['RAX_API_KEY'] = decrypt_field(cloud_cred, 'password')
        #    env['CLOUD_VERIFY_SSL'] = str(False)
        #elif cloud_cred and cloud_cred.kind == 'gce':
        #    env['GCE_EMAIL'] = cloud_cred.username
        #    env['GCE_PROJECT'] = cloud_cred.project
        #    env['GCE_PEM_FILE_PATH'] = kwargs.get('private_data_files', {}).get('cloud_credential', '')
        #elif cloud_cred and cloud_cred.kind == 'azure':
        #    env['AZURE_SUBSCRIPTION_ID'] = cloud_cred.username
        #    env['AZURE_CERT_PATH'] = kwargs.get('private_data_files', {}).get('cloud_credential', '')
        #elif cloud_cred and cloud_cred.kind == 'azure_rm':
        #    if len(cloud_cred.client) and len(cloud_cred.tenant):
        #        env['AZURE_CLIENT_ID'] = cloud_cred.client
        #        env['AZURE_SECRET'] = decrypt_field(cloud_cred, 'secret')
        #        env['AZURE_TENANT'] = cloud_cred.tenant
        #        env['AZURE_SUBSCRIPTION_ID'] = cloud_cred.subscription
        #    else:
        #        env['AZURE_SUBSCRIPTION_ID'] = cloud_cred.subscription
        #        env['AZURE_AD_USER'] = cloud_cred.username
        #        env['AZURE_PASSWORD'] = decrypt_field(cloud_cred, 'password')
        #elif cloud_cred and cloud_cred.kind == 'vmware':
        #    env['VMWARE_USER'] = cloud_cred.username
        #    env['VMWARE_PASSWORD'] = decrypt_field(cloud_cred, 'password')
        #    env['VMWARE_HOST'] = cloud_cred.host
        #elif cloud_cred and cloud_cred.kind == 'openstack':
        #    env['OS_CLIENT_CONFIG_FILE'] = kwargs.get('private_data_files', {}).get('cloud_credential', '')
        #network_cred = job.network_credential
        #if network_cred:
        #    env['ANSIBLE_NET_USERNAME'] = network_cred.username
        #    env['ANSIBLE_NET_PASSWORD'] = decrypt_field(network_cred, 'password')
        #    authorize = network_cred.authorize
        #    env['ANSIBLE_NET_AUTHORIZE'] = unicode(int(authorize))
        #    if authorize:
        #        env['ANSIBLE_NET_AUTHORIZE_PASSWORD'] = decrypt_field(network_cred, 'authorize_password')
        #if job.job_type == PERM_INVENTORY_SCAN:
        #    env['ANSIBLE_LIBRARY'] = self.get_path_to('..', 'plugins', 'library')
        #    env['ANSIBLE_CACHE_PLUGINS'] = self.get_path_to('..', 'plugins', 'fact_caching')
        #    env['ANSIBLE_CACHE_PLUGIN'] = 'tower'
        #    env['ANSIBLE_CACHE_PLUGIN_CONNECTION'] = 'tcp://127.0.0.1:%s' % str(settings.FACT_CACHE_PORT)
        return env

    def build_args(self, job, **kwargs):
        """
        Build command line argument list for running ansible-playbook,
        optionally using ssh-agent for public/private key authentication.
        """
        #creds = job.credential
        #ssh_username, become_username, become_method = ('', '', '')
        #if creds:
        #    ssh_username = kwargs.get('username', creds.username)
        #    become_method = kwargs.get('become_method', creds.become_method)
        #    become_username = kwargs.get('become_username', creds.become_username)
        #else:
        #    become_method = None
        #    become_username = ''
        #ssh_username = ssh_username or 'root'
        inventory_script = self.get_path_to('..', 'plugins', 'inventory', 'awxrest.py')
        args = ['ansible-playbook', '-i', inventory_script]
        #if job.job_type == 'check':
        #    args.append('--check')
        ##args.extend(['-u', ssh_username])
        #if 'ssh_password' in kwargs.get('passwords', {}):
        #    args.append('--ask-pass')
        #try:
        #    if Version(kwargs['ansible_version']) < Version('1.9'):
        #        if become_method and become_method == 'sudo' and become_username != '':
        #            args.extend(['-U', become_username])
        #        if become_method and become_method == 'sudo' and 'become_password' in kwargs.get('passwords', {}):
        #            args.append('--ask-sudo-pass')
        #        if become_method and become_method == 'su' and become_username != '':
        #            args.extend(['-R', become_username])
        #        if become_method and become_method == 'su' and 'become_password' in kwargs.get('passwords', {}):
        #            args.append('--ask-su-pass')
        #    else:
        #        if job.become_enabled:
        #            args.append('--become')
        #        if become_method:
        #            args.extend(['--become-method', become_method])
        #        if become_username:
        #            args.extend(['--become-user', become_username])
        #        if 'become_password' in kwargs.get('passwords', {}):
        #            args.append('--ask-become-pass')
        #except ValueError:
        #    pass

        #if 'vault_password' in kwargs.get('passwords', {}):
        #    args.append('--ask-vault-pass')
        #if job.forks:
        #    args.append('--forks=%d' % job.forks)
        #if job.force_handlers:
        #    args.append('--force-handlers')
        #if job.limit:
        #    args.extend(['-l', job.limit])
        #if job.verbosity:
        #    args.append('-%s' % ('v' * min(5, job.verbosity)))
        #if job.job_tags:
        #    args.extend(['-t', job.job_tags])
        #if job.skip_tags:
        #    args.append('--skip-tags=%s' % job.skip_tags)
        #if job.start_at_task:
        #    args.append('--start-at-task=%s' % job.start_at_task)
        #extra_vars = {'tower_job_id': job.pk,
        # 'tower_job_launch_type': job.launch_type}
        #if job.job_template:
        #    extra_vars.update({'tower_job_template_id': job.job_template.pk,
        #     'tower_job_template_name': job.job_template.name})
        #if job.created_by:
        #    extra_vars.update({'tower_user_id': job.created_by.pk,
        #     'tower_user_name': job.created_by.username})
        #if job.extra_vars_dict:
        #    if kwargs.get('display', False) and job.job_template and job.job_template.survey_enabled:
        #        extra_vars.update(json.loads(job.display_extra_vars()))
        #    else:
        #        extra_vars.update(job.extra_vars_dict)
        #args.extend(['-e', json.dumps(extra_vars)])
        #if job.project is None and job.job_type == PERM_INVENTORY_SCAN:
        #    args.append('scan_facts.yml')
        #else:
        #    args.append(job.playbook)
        args.append(job.playbook)
        return args

    def build_safe_args(self, job, **kwargs):
        return self.build_args(job, display=True, **kwargs)

    def build_cwd(self, job, **kwargs):
        #if job.project is None and job.job_type == PERM_INVENTORY_SCAN:
        #    return self.get_path_to('..', 'playbooks')
        #else:
        #    cwd = job.project.get_project_path()
        #    if not cwd:
        #        root = settings.PROJECTS_ROOT
        #        raise RuntimeError('project local_path %s cannot be found in %s' % (job.project.local_path, root))
        #    return cwd
        return settings.PROJECTS_ROOT

    def get_idle_timeout(self):
        return getattr(settings, 'JOB_RUN_IDLE_TIMEOUT', None)

    def get_password_prompts(self):
        d = super(RunJob, self).get_password_prompts()
        d[re.compile('^Enter passphrase for .*:\\s*?$', re.M)] = 'ssh_key_unlock'
        d[re.compile('^Bad passphrase, try again for .*:\\s*?$', re.M)] = ''
        d[re.compile('^sudo password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^SUDO password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^su password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^SU password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^PBRUN password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^pbrun password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^PFEXEC password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^pfexec password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^RUNAS password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^runas password.*:\\s*?$', re.M)] = 'become_password'
        d[re.compile('^SSH password:\\s*?$', re.M)] = 'ssh_password'
        d[re.compile('^Password:\\s*?$', re.M)] = 'ssh_password'
        d[re.compile('^Vault password:\\s*?$', re.M)] = 'vault_password'
        return d

    def get_ssh_key_path(self, instance, **kwargs):
        """
        If using an SSH key, return the path for use by ssh-agent.
        """
        private_data_files = kwargs.get('private_data_files', {})
        if 'credential' in private_data_files:
            return private_data_files.get('credential')
        if 'network_credential' in private_data_files:
            return private_data_files.get('network_credential')
        return ''

    def should_use_proot(self, instance, **kwargs):
        """
        Return whether this task should use proot.
        """
        #return getattr(tower_settings, 'AWX_PROOT_ENABLED', False)
        return False

    def post_run_hook(self, job, **kwargs):
        """
        Hook for actions to run after job/task has completed.
        """
        pass
        #super(RunJob, self).post_run_hook(job, **kwargs)
        #try:
        #    inventory = job.inventory
        #except Inventory.DoesNotExist:
        #    pass
        #else:
        #    update_inventory_computed_fields.delay(inventory.id, True)

        #if not settings.CALLBACK_CONSUMER_PORT:
        #    for job_event in job.job_events.order_by('pk'):
        #        job_event.save(post_process=True)
