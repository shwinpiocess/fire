# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Script',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('NAME', models.CharField(max_length=512)),
                ('appId', models.IntegerField()),
                ('TYPE', models.IntegerField(default=1, choices=[(1, b'shell'), (2, b'bat'), (3, b'perl'), (4, b'python')])),
                ('isPublic', models.IntegerField(default=0)),
                ('content', models.TextField()),
                ('creater', models.CharField(max_length=128)),
                ('createTime', models.DateTimeField(auto_now_add=True)),
                ('lastModifyUser', models.CharField(max_length=128)),
                ('lastModifyTime', models.DateTimeField(auto_now=True)),
                ('isCCScript', models.IntegerField(default=0)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('taskId', models.IntegerField()),
                ('appId', models.IntegerField()),
                ('name', models.CharField(max_length=512)),
                ('type', models.IntegerField(choices=[(1, b'\xe6\x89\xa7\xe8\xa1\x8c\xe8\x84\x9a\xe6\x9c\xac'), (2, b'\xe4\xbc\xa0\xe8\xbe\x93\xe6\x96\x87\xe4\xbb\xb6'), (3, b'\xe6\x96\x87\xe6\x9c\xac\xe9\x80\x9a\xe7\x9f\xa5')])),
                ('ord', models.IntegerField()),
                ('blockOrd', models.IntegerField(null=True, blank=True)),
                ('blockName', models.CharField(max_length=512, null=True, blank=True)),
                ('account', models.CharField(max_length=128, null=True, blank=True)),
                ('serverSetId', models.IntegerField(null=True, blank=True)),
                ('ipList', models.TextField(null=True, blank=True)),
                ('scriptId', models.IntegerField(null=True, blank=True)),
                ('scriptParam', models.TextField(null=True, blank=True)),
                ('scriptTimeout', models.IntegerField(null=True, blank=True)),
                ('fileSource', models.TextField(null=True, blank=True)),
                ('fileTargetPath', models.CharField(max_length=256, null=True, blank=True)),
                ('fileSpeedLimit', models.IntegerField(null=True, blank=True)),
                ('text', models.CharField(max_length=256, null=True, blank=True)),
                ('creater', models.CharField(max_length=128)),
                ('createTime', models.DateTimeField(auto_now_add=True)),
                ('lastModifyUser', models.CharField(max_length=128)),
                ('lastModifyTime', models.DateTimeField(auto_now=True)),
                ('isPause', models.IntegerField(default=0)),
                ('ccScriptId', models.IntegerField(null=True, blank=True)),
                ('paramType', models.IntegerField(default=1, null=True, blank=True)),
                ('ccScriptParam', models.TextField(null=True, blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Stepinstance',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('stepId', models.IntegerField()),
                ('taskInstanceId', models.IntegerField()),
                ('appId', models.IntegerField()),
                ('name', models.CharField(max_length=512)),
                ('type', models.IntegerField()),
                ('ord', models.IntegerField()),
                ('blockOrd', models.IntegerField(null=True, blank=True)),
                ('blockName', models.CharField(max_length=512, null=True, blank=True)),
                ('account', models.CharField(max_length=256, null=True, blank=True)),
                ('ipList', models.TextField(null=True, blank=True)),
                ('badIpList', models.TextField(null=True, blank=True)),
                ('scriptContent', models.TextField(null=True, blank=True)),
                ('scriptType', models.IntegerField(null=True, blank=True)),
                ('scriptParam', models.TextField(null=True, blank=True)),
                ('scriptTimeout', models.IntegerField(null=True, blank=True)),
                ('fileSource', models.TextField(null=True, blank=True)),
                ('fileTargetPath', models.CharField(max_length=256, null=True, blank=True)),
                ('fileSpeedLimit', models.IntegerField(null=True, blank=True)),
                ('text', models.CharField(max_length=256, null=True, blank=True)),
                ('operator', models.CharField(max_length=128, null=True, blank=True)),
                ('status', models.IntegerField()),
                ('retryCount', models.IntegerField()),
                ('startTime', models.DateTimeField(null=True, blank=True)),
                ('endTime', models.DateTimeField(null=True, blank=True)),
                ('totalTime', models.FloatField(null=True, blank=True)),
                ('totalIPNum', models.IntegerField(null=True, blank=True)),
                ('badIPNum', models.IntegerField(null=True, blank=True)),
                ('runIPNum', models.IntegerField(null=True, blank=True)),
                ('failIPNum', models.IntegerField(null=True, blank=True)),
                ('successIPNum', models.IntegerField(null=True, blank=True)),
                ('createTime', models.DateTimeField(auto_now_add=True)),
                ('isPause', models.IntegerField(null=True, blank=True)),
                ('isUseCCFileParam', models.IntegerField(null=True, blank=True)),
                ('playTaskName', models.CharField(max_length=256)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='StepInstanceEvent',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('event', models.CharField(max_length=100, choices=[(b'runner_on_failed', b'Host Failed'), (b'runner_on_ok', b'Host OK'), (b'runner_on_error', b'Host Failure'), (b'runner_on_skipped', b'Host Skipped'), (b'runner_on_unreachable', b'Host Unreachable'), (b'runner_on_no_hosts', b'No Hosts Remaining'), (b'runner_on_async_poll', b'Host Polling'), (b'runner_on_async_ok', b'Host Async OK'), (b'runner_on_async_failed', b'Host Async Failure'), (b'runner_on_file_diff', b'File Difference'), (b'playbook_on_start', b'Playbook Started'), (b'playbook_on_notify', b'Running Handlers'), (b'playbook_on_no_hosts_matched', b'No Hosts Matched'), (b'playbook_on_no_hosts_remaining', b'No Hosts Remaining'), (b'playbook_on_task_start', b'Task Started'), (b'playbook_on_vars_prompt', b'Variables Prompted'), (b'playbook_on_setup', b'Gathering Facts'), (b'playbook_on_import_for_host', b'internal: on Import for Host'), (b'playbook_on_not_import_for_host', b'internal: on Not Import for Host'), (b'playbook_on_play_start', b'Play Started'), (b'playbook_on_stats', b'Playbook Complete')])),
                ('event_data', jsonfield.fields.JSONField(default={}, blank=True)),
                ('succeed', models.BooleanField(default=True, editable=False)),
                ('changed', models.BooleanField(default=False, editable=False)),
                ('host_name', models.CharField(default=b'', max_length=1024, editable=False)),
                ('play', models.CharField(default=b'', max_length=1024, editable=False)),
                ('role', models.CharField(default=b'', max_length=1024, editable=False)),
                ('task', models.CharField(default=b'', max_length=1024, editable=False)),
                ('created', models.DateTimeField(default=None, verbose_name=b'\xe5\x88\x9b\xe5\xbb\xba\xe6\x97\xb6\xe9\x97\xb4', editable=False)),
                ('modified', models.DateTimeField(default=None, verbose_name=b'\xe4\xbf\xae\xe6\x94\xb9\xe6\x97\xb6\xe9\x97\xb4', editable=False)),
            ],
            options={
                'ordering': ('pk',),
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=512)),
                ('appId', models.IntegerField()),
                ('account', models.CharField(max_length=128, null=True, blank=True)),
                ('serverSetId', models.IntegerField(null=True, blank=True)),
                ('ipList', models.CharField(max_length=512, null=True, blank=True)),
                ('creater', models.CharField(max_length=128)),
                ('createTime', models.DateTimeField(auto_now_add=True)),
                ('lastModifyUser', models.CharField(max_length=128)),
                ('lastModifyTime', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Taskinstance',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('taskId', models.IntegerField()),
                ('appId', models.IntegerField()),
                ('name', models.CharField(max_length=512)),
                ('operator', models.CharField(max_length=128, null=True, blank=True)),
                ('startWay', models.IntegerField(null=True, blank=True)),
                ('currentStepId', models.IntegerField(null=True, blank=True)),
                ('status', models.IntegerField()),
                ('startTime', models.DateTimeField(null=True, blank=True)),
                ('endTime', models.DateTimeField(null=True, blank=True)),
                ('totalTime', models.FloatField(null=True, blank=True)),
                ('createTime', models.DateTimeField(auto_now_add=True)),
                ('mobileTaskId', models.IntegerField(null=True, blank=True)),
                ('job_args', models.TextField(default=b'', editable=False, blank=True)),
                ('job_cwd', models.CharField(default=b'', max_length=1024, editable=False, blank=True)),
                ('job_env', jsonfield.fields.JSONField(default={}, editable=False, blank=True)),
                ('job_explanation', models.TextField(default=b'', editable=False, blank=True)),
                ('start_args', models.TextField(default=b'', editable=False, blank=True)),
                ('result_stdout_text', models.TextField(default=b'', editable=False, blank=True)),
                ('result_stdout_file', models.TextField(default=b'', editable=False, blank=True)),
                ('result_traceback', models.TextField(default=b'', editable=False, blank=True)),
                ('celery_task_id', models.CharField(default=b'', max_length=100, editable=False, blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]