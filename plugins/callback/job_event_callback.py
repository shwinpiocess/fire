import datetime
import glob
import json
import logging
import os
import pwd
import urlparse
import re
from copy import deepcopy

# Requests
import requests

# ZeroMQ
import zmq

import psutil


CENSOR_FIELD_WHITELIST = [
    'msg',
    'failed',
    'changed',
    'results',
    #'start',
    #'end',
    #'delta',
    #'cmd',
    '_ansible_no_log',
    #'rc',
    'failed_when_result',
    'skipped',
    'skip_reason',
]

def censor(obj, no_log=False):
    if not isinstance(obj, dict):
        if no_log:
            return "the output has been hidden due to the fact that 'no_log: true' was specified for this result"
        return obj
    if obj.get('_ansible_no_log', no_log):
        new_obj = {}
        for k in CENSOR_FIELD_WHITELIST:
            if k in obj:
                new_obj[k] = obj[k]
            if k == 'cmd' and k in obj:
                if isinstance(obj['cmd'], list):
                    obj['cmd'] = ' '.join(obj['cmd'])
                if re.search(r'\s', obj['cmd']):
                    new_obj['cmd'] = re.sub(r'^(([^\s\\]|\\\s)+).*$',
                                            r'\1 <censored>',
                                            obj['cmd'])
        new_obj['censored'] = "the output has been hidden due to the fact that 'no_log: true' was specified for this result"
        obj = new_obj
    if 'results' in obj:
        if isinstance(obj['results'], list):
            for i in xrange(len(obj['results'])):
                obj['results'][i] = censor(obj['results'][i], obj.get('_ansible_no_log', no_log))
        elif obj.get('_ansible_no_log', False):
            obj['results'] = "the output has been hidden due to the fact that 'no_log: true' was specified for this result"
    return obj

f = file('/tmp/aaaaaa.txt', 'wa+')
class BaseCallbackModule(object):
    '''
    Callback module for logging ansible-playbook job events via the REST API.
    '''

    def __init__(self):
        self.url = os.getenv('EVENT_URL', '')
        self._init_logging()
        self.counter = 0

    def _init_logging(self):
        try:
            self.job_callback_debug = int(os.getenv('JOB_CALLBACK_DEBUG', '0'))
        except ValueError:
            self.job_callback_debug = 0
        self.logger = logging.getLogger('job.plugins.callback.job_event_callback')
        if self.job_callback_debug >= 2:
            f.write('111111111111')
            self.logger.setLevel(logging.DEBUG)
        elif self.job_callback_debug >= 1:
            f.write('2222222222222222')
            self.logger.setLevel(logging.INFO)
        else:
            f.write('333333333333333')
            self.logger.setLevel(logging.WARNING)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(levelname)-8s %(process)-8d %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.logger.propagate = False


    def _post_rest_api_event(self, event, event_data):
        data = json.dumps({
            'event': event,
            'event_data': event_data,
        })
        headers = {'content-type': 'application/json'}
        response = requests.post(self.url, data=data, headers=headers)
        f.write(response.text)
        response.raise_for_status()

    def _log_event(self, event, **event_data):
        if 'res' in event_data:
            event_data['res'] = censor(deepcopy(event_data['res']))
            #event_data['res'] = event_data

        self._post_rest_api_event(event, event_data)

    def on_any(self, *args, **kwargs):
        pass

    def runner_on_failed(self, host, res, ignore_errors=False):
        self._log_event('runner_on_failed', host=host, res=res,
                        ignore_errors=ignore_errors)

    def v2_runner_on_failed(self, result, ignore_errors=False):
        event_is_loop = result._task.loop if hasattr(result._task, 'loop') else None
        self._log_event('runner_on_failed', host=result._host.name,
                        res=result._result, task=result._task,
                        ignore_errors=ignore_errors, event_loop=event_is_loop)

    def runner_on_ok(self, host, res):
        self._log_event('runner_on_ok', host=host, res=res)

    def v2_runner_on_ok(self, result):
        event_is_loop = result._task.loop if hasattr(result._task, 'loop') else None
        self._log_event('runner_on_ok', host=result._host.name,
                        task=result._task, res=result._result,
                        event_loop=event_is_loop)

    def runner_on_error(self, host, msg):
        self._log_event('runner_on_error', host=host, msg=msg)

    def v2_runner_on_error(self, result):
        pass # Currently not implemented in v2

    def runner_on_skipped(self, host, item=None):
        self._log_event('runner_on_skipped', host=host, item=item)

    def v2_runner_on_skipped(self, result):
        event_is_loop = result._task.loop if hasattr(result._task, 'loop') else None
        self._log_event('runner_on_skipped', host=result._host.name,
                        task=result._task, event_loop=event_is_loop)

    def runner_on_unreachable(self, host, res):
        self._log_event('runner_on_unreachable', host=host, res=res)

    def v2_runner_on_unreachable(self, result):
        self._log_event('runner_on_unreachable', host=result._host.name,
                        task=result._task, res=result._result)

    def runner_on_no_hosts(self):
        self._log_event('runner_on_no_hosts')

    def v2_runner_on_no_hosts(self, task):
        self._log_event('runner_on_no_hosts', task=task)

    # V2 does not use the _on_async callbacks (yet).

    def runner_on_async_poll(self, host, res, jid, clock):
        self._log_event('runner_on_async_poll', host=host, res=res, jid=jid,
                        clock=clock)

    def runner_on_async_ok(self, host, res, jid):
        self._log_event('runner_on_async_ok', host=host, res=res, jid=jid)

    def runner_on_async_failed(self, host, res, jid):
        self._log_event('runner_on_async_failed', host=host, res=res, jid=jid)

    def runner_on_file_diff(self, host, diff):
        self._log_event('runner_on_file_diff', host=host, diff=diff)

    def v2_runner_on_file_diff(self, result, diff):
        self._log_event('runner_on_file_diff', host=result._host.name,
                        task=result._task, diff=diff)

    def v2_runner_item_on_ok(self, result):
        self._log_event('runner_item_on_ok', res=result._result, host=result._host.name,
                        task=result._task)

    def v2_runner_item_on_failed(self, result):
        self._log_event('runner_item_on_failed', res=result._result, host=result._host.name,
                        task=result._task)

    def v2_runner_item_on_skipped(self, result):
        self._log_event('runner_item_on_skipped', res=result._result, host=result._host.name,
                        task=result._task)

    @staticmethod
    def terminate_ssh_control_masters():
        # Determine if control persist is being used and if any open sockets
        # exist after running the playbook.
        cp_path = os.environ.get('ANSIBLE_SSH_CONTROL_PATH', '')
        if not cp_path:
            return
        cp_dir = os.path.dirname(cp_path)
        if not os.path.exists(cp_dir):
            return
        cp_pattern = os.path.join(cp_dir, 'ansible-ssh-*')
        cp_files = glob.glob(cp_pattern)
        if not cp_files:
            return

        # Attempt to find any running control master processes.
        username = pwd.getpwuid(os.getuid())[0]
        ssh_cm_procs = []
        for proc in psutil.process_iter():
            try:
                pname = proc.name()
                pcmdline = proc.cmdline()
                pusername = proc.username()
            except psutil.NoSuchProcess:
                continue
            if pusername != username:
                continue
            if pname != 'ssh':
                continue
            for cp_file in cp_files:
                if pcmdline and cp_file in pcmdline[0]:
                    ssh_cm_procs.append(proc)
                    break

        # Terminate then kill control master processes.  Workaround older
        # version of psutil that may not have wait_procs implemented.
        for proc in ssh_cm_procs:
            proc.terminate()
        procs_gone, procs_alive = psutil.wait_procs(ssh_cm_procs, timeout=5)
        for proc in procs_alive:
            proc.kill()


class JobCallbackModule(BaseCallbackModule):
    '''
    Callback module for logging ansible-playbook job events via the REST API.
    '''

    # These events should never have an associated play.
    EVENTS_WITHOUT_PLAY = [
        'playbook_on_start',
        'playbook_on_stats',
    ]
    # These events should never have an associated task.
    EVENTS_WITHOUT_TASK = EVENTS_WITHOUT_PLAY + [
        'playbook_on_setup',
        'playbook_on_notify',
        'playbook_on_import_for_host',
        'playbook_on_not_import_for_host',
        'playbook_on_no_hosts_matched',
        'playbook_on_no_hosts_remaining',
    ]

    def __init__(self):
        self.job_id = int(os.getenv('JOB_ID', '0'))
        super(JobCallbackModule, self).__init__()

    def _log_event(self, event, **event_data):
        play = getattr(self, 'play', None)
        play_name = getattr(play, 'name', '')
        if play_name and event not in self.EVENTS_WITHOUT_PLAY:
            event_data['play'] = play_name
        task = event_data.pop('task', None) or getattr(self, 'task', None)
        task_name = None
        role_name = None
        if task:
            if hasattr(task, 'get_name'):
                # in v2, the get_name() method creates the name
                task_name = task.get_name()
            else:
                # v1 datastructure
                task_name = getattr(task, 'name', '')
            if hasattr(task, '_role') and task._role:
                # v2 datastructure
                role_name = task._role._role_name
            else:
                # v1 datastructure
                role_name = getattr(task, 'role_name', '')
        if task_name and event not in self.EVENTS_WITHOUT_TASK:
            event_data['task'] = task_name
        if role_name and event not in self.EVENTS_WITHOUT_TASK:
            event_data['role'] = role_name
        super(JobCallbackModule, self)._log_event(event, **event_data)

    def playbook_on_start(self):
        self._log_event('playbook_on_start')

    def v2_playbook_on_start(self, playbook):
        # NOTE: the playbook parameter was added late in Ansible 2.0 development
        #       so we don't currently utilize but could later.
        self.playbook_on_start()

    def playbook_on_notify(self, host, handler):
        self._log_event('playbook_on_notify', host=host, handler=handler)

    def v2_playbook_on_notify(self, result, handler):
        self._log_event('playbook_on_notify', host=result._host.name,
                        task=result._task, handler=handler)

    def playbook_on_no_hosts_matched(self):
        self._log_event('playbook_on_no_hosts_matched')

    def v2_playbook_on_no_hosts_matched(self):
        # since there is no task/play info, this is currently identical
        # to the v1 callback which does the same thing
        self.playbook_on_no_hosts_matched()

    def playbook_on_no_hosts_remaining(self):
        self._log_event('playbook_on_no_hosts_remaining')

    def v2_playbook_on_no_hosts_remaining(self):
        # since there is no task/play info, this is currently identical
        # to the v1 callback which does the same thing
        self.playbook_on_no_hosts_remaining()

    def playbook_on_task_start(self, name, is_conditional):
        self._log_event('playbook_on_task_start', name=name,
                        is_conditional=is_conditional)

    def v2_playbook_on_task_start(self, task, is_conditional):
        self._log_event('playbook_on_task_start', task=task,
                        name=task.get_name(), is_conditional=is_conditional)

    def v2_playbook_on_cleanup_task_start(self, task):
        # re-using playbook_on_task_start event here for this v2-specific
        # event, though we may consider any changes necessary to distinguish
        # this from a normal task
        self._log_event('playbook_on_task_start', task=task,
                        name=task.get_name())

    def playbook_on_vars_prompt(self, varname, private=True, prompt=None,
                                encrypt=None, confirm=False, salt_size=None,
                                salt=None, default=None):
        self._log_event('playbook_on_vars_prompt', varname=varname,
                        private=private, prompt=prompt, encrypt=encrypt,
                        confirm=confirm, salt_size=salt_size, salt=salt,
                        default=default)

    def v2_playbook_on_vars_prompt(self, varname, private=True, prompt=None,
                                   encrypt=None, confirm=False, salt_size=None,
                                   salt=None, default=None):
        pass # not currently used in v2 (yet)

    def playbook_on_setup(self):
        self._log_event('playbook_on_setup')

    def v2_playbook_on_setup(self):
        pass # not currently used in v2 (yet)

    def playbook_on_import_for_host(self, host, imported_file):
        # don't care about recording this one
        # self._log_event('playbook_on_import_for_host', host=host,
        #                imported_file=imported_file)
        pass

    def v2_playbook_on_import_for_host(self, result, imported_file):
        pass # not currently used in v2 (yet)

    def playbook_on_not_import_for_host(self, host, missing_file):
        # don't care about recording this one
        #self._log_event('playbook_on_not_import_for_host', host=host,
        #                missing_file=missing_file)
        pass

    def v2_playbook_on_not_import_for_host(self, result, missing_file):
        pass # not currently used in v2 (yet)

    def playbook_on_play_start(self, name):
        # Only play name is passed via callback, get host pattern from the play.
        pattern = getattr(getattr(self, 'play', None), 'hosts', name)
        self._log_event('playbook_on_play_start', name=name, pattern=pattern)

    def v2_playbook_on_play_start(self, play):
        setattr(self, 'play', play)
        # Ansible 2.0.0.2 doesn't default .name to hosts like it did in 1.9.4,
        # though that default will likely return in a future version of Ansible.
        if (not hasattr(play, 'name') or not play.name) and hasattr(play, 'hosts'):
            if isinstance(play.hosts, list):
                play.name = ','.join(play.hosts)
            else:
                play.name = play.hosts
        self._log_event('playbook_on_play_start', name=play.name,
                        pattern=play.hosts)

    def playbook_on_stats(self, stats):
        d = {}
        for attr in ('changed', 'dark', 'failures', 'ok', 'processed', 'skipped'):
            d[attr] = getattr(stats, attr)
        self._log_event('playbook_on_stats', **d)
        self.terminate_ssh_control_masters()

    def v2_playbook_on_stats(self, stats):
        self.playbook_on_stats(stats)

    def v2_playbook_on_include(self, included_file):
        self._log_event('playbook_on_include', included_file=included_file)

class AdHocCommandCallbackModule(BaseCallbackModule):
    '''
    Callback module for logging ansible ad hoc events via ZMQ or the REST API.
    '''

    def __init__(self):
        self.ad_hoc_command_id = int(os.getenv('AD_HOC_COMMAND_ID', '0'))
        self.rest_api_path = '/api/v1/ad_hoc_commands/%d/events/' % self.ad_hoc_command_id
        self.skipped_hosts = set()
        super(AdHocCommandCallbackModule, self).__init__()

    def _log_event(self, event, **event_data):
        # Ignore task for ad hoc commands (with v2).
        event_data.pop('task', None)
        super(AdHocCommandCallbackModule, self)._log_event(event, **event_data)

    def runner_on_file_diff(self, host, diff):
        pass # Ignore file diff for ad hoc commands.

    def runner_on_ok(self, host, res):
        # When running in check mode using a module that does not support check
        # mode, Ansible v1.9 will call runner_on_skipped followed by
        # runner_on_ok for the same host; only capture the skipped event and
        # ignore the ok event.
        if host not in self.skipped_hosts:
            super(AdHocCommandCallbackModule, self).runner_on_ok(host, res)

    def runner_on_skipped(self, host, item=None):
        super(AdHocCommandCallbackModule, self).runner_on_skipped(host, item)
        self.skipped_hosts.add(host)

if os.getenv('JOB_ID', ''):
    CallbackModule = JobCallbackModule
elif os.getenv('AD_HOC_COMMAND_ID', ''):
    CallbackModule = AdHocCommandCallbackModule

