# -*- coding: utf-8 -*-
import os
import json
import base64
import hashlib
import datetime

from django.db import models
from django.conf import settings
from django.utils import timezone

from jsonfield import JSONField

from .constant import *


class BaseModel(models.Model):

    class Meta:
        abstract = True

    def __unicode__(self):
        if hasattr(self, 'name'):
            return u'%s-%s' % (self.name, self.id)
        else:
            return u'%s-%s' %(self._meta.verbose_name, self.id)


class Account(BaseModel):
    account = models.CharField(max_length=255)
    appId = models.IntegerField()
    creater = models.CharField(max_length=128)
    createTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('account', 'appId'),)



class Script(BaseModel):
    """script models
    NAME 名称,
    appId 开发商id,
    TYPE 类型:1(shell脚本)、2(bat脚本)、3(perl脚本)、4(python脚本), 默认: 1
    isPublic 是否公共脚本,0.否 1.是', 默认: 0
    content 脚本内容',
    creater 创建人,
    createTime 创建时间',
    lastModifyUser 最后修改人,
    lastModifyTime 最后修改时间,
    isCCScript 1.是  0.否', 默认 0
    """
    TYPE_SHELL = 1
    TYPE_BAT = 2
    TYPE_PERL = 3
    TYPE_PYTHON = 4

    TYPE_CHOICES = (
        (TYPE_SHELL, 'shell'),
        (TYPE_BAT, 'bat'),
        (TYPE_PERL, 'perl'),
        (TYPE_PYTHON, 'python'),
    )
    NAME = models.CharField(max_length=512)
    appId = models.IntegerField()
    TYPE = models.IntegerField(choices=TYPE_CHOICES, default=TYPE_SHELL)
    isPublic = models.IntegerField(default=0)
    content = models.TextField()
    creater = models.CharField(max_length=128)
    createTime = models.DateTimeField(auto_now_add=True)
    lastModifyUser = models.CharField(max_length=128)
    lastModifyTime = models.DateTimeField(auto_now=True)
    isCCScript = models.IntegerField(default=0)



class Task(BaseModel):
    """task models"""
    name = models.CharField(max_length=512)
    appId = models.IntegerField()
    account = models.CharField(max_length=128, blank=True, null=True)
    serverSetId = models.IntegerField(blank=True, null=True)
    ipList = models.CharField(max_length=512, blank=True, null=True)
    creater = models.CharField(max_length=128)
    createTime = models.DateTimeField(auto_now_add=True)
    lastModifyUser = models.CharField(max_length=128)
    lastModifyTime = models.DateTimeField(auto_now=True)

    def update_or_create_script(self, **kwargs):
        NAME = kwargs['NAME']
        script = Script.objects.filter(NAME=NAME)
        if script:
            kwargs.pop('NAME')
            script.update(**kwargs)
            return script[0].id
        return Script.objects.create(**kwargs).id

    def set_steps(self, steps):
        """更新task的步骤信息
        1. 步骤在库中不存在，新建
        2. 步骤在库中存在，但是在本次提交中不存在，删除
        3、步骤在库中和本次提交中都存在，更新
        """
        step_ids = []
        for step in steps:
            step_ids.append(step['stepId'])
        Step.objects.filter(taskId=self.id).exclude(id__in=step_ids).delete()
            
        step_objs = []
        step_update_objs = []
        for step in steps:
            step['taskId'] = self.id
            step['appId'] = self.appId
            stepId = step.pop('stepId')
            if int(step['type']) == TYPE_SCRIPT:
                kwargs = {}
                kwargs['NAME'] = step['name']
                kwargs['content'] = step.pop('scriptContent')
                kwargs['TYPE'] = step.pop('scriptType')
                kwargs['appId'] = self.appId
                kwargs['creater'] = self.creater
                kwargs['lastModifyUser'] = self.creater
                step['scriptId'] = self.update_or_create_script(**kwargs)
                if stepId > 0:
                    Step.objects.filter(pk=stepId).update(**step)
                else:
                    Step.objects.create(**step)

            if int(step['type']) == TYPE_FILE:
                if stepId > 0:
                    Step.objects.filter(pk=stepId).update(**step)
                else:
                    Step.objects.create(**step)
        

    def get_steps(self):
        return Step.objects.filter(taskId=self.id)

    steps = property(get_steps, set_steps)

    @property
    def stepNum(self):
        return self.steps.count()

    def create_task_instance(self, **kwargs):
        """根据当前作业模板生成一个作业实例"""
        if self.stepNum == 0:
            return '作业没有步骤'

        stepId_list = []
        stepIds = kwargs.pop('stepIds')
        if stepIds:
            stepId_list = [int(item) for item in stepIds.split(',')]

        kwargs['status'] = 1
        task_instance = Taskinstance.objects.create(**kwargs)

        step_instance_result = []
        for step in self.steps:
            for stepId in stepId_list:
                if step.id == stepId:
                    tmp = u"%s%s" % (task_instance.id, step.name)
                    play_task_name = settings.PLAYBOOK_PREFIX + hashlib.md5(tmp.encode('utf-8')).hexdigest()
                    step_instance_kwargs = {'stepId': step.id, 'taskInstanceId': task_instance.id, 'playTaskName': play_task_name}
                    result = step.create_step_instance(**step_instance_kwargs)
                    step_instance_result.append(result)

        if not all(step_instance_result):
            return False

        return task_instance





class Taskinstance(BaseModel):
    """ task instance models"""
    # startWay: 1.页面执行、2.API调用、3.定时执行
    # status 1.未执行、2.正在执行、3.执行成功、
    #        4.执行失败、5.跳过、6.忽略错误、
    #        7.等待用户、8.手动结束、9.状态异常、
    #        10.步骤强制终止中、11.步骤强制终止成功、12.步骤强制终止失败'
    taskId = models.IntegerField()
    appId = models.IntegerField()
    name = models.CharField(max_length=512)
    operator = models.CharField(max_length=128, blank=True, null=True)
    startWay = models.IntegerField(blank=True, null=True)
    currentStepId = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()
    startTime = models.DateTimeField(blank=True, null=True)
    endTime = models.DateTimeField(blank=True, null=True)
    totalTime = models.FloatField(blank=True, null=True)
    createTime = models.DateTimeField(auto_now_add=True)
    mobileTaskId = models.IntegerField(blank=True, null=True)
    job_args = models.TextField(blank=True, default='', editable=False)
    job_cwd = models.CharField(max_length=1024, blank=True, default='', editable=False)
    job_env = JSONField(blank=True, default={}, editable=False)
    job_explanation = models.TextField(blank=True, default='', editable=False)
    start_args = models.TextField(blank=True, default='', editable=False)
    result_stdout_text = models.TextField(blank=True, default='', editable=False)
    result_stdout_file = models.TextField(blank=True, default='', editable=False)
    result_traceback = models.TextField(blank=True, default='', editable=False)
    celery_task_id = models.CharField(max_length=100, blank=True, default='', editable=False)

    def save(self, *args, **kwargs):
        update_fields = kwargs.get('update_fields', [])
        if self.startTime and self.endTime:
            totalTime = self.endTime - self.startTime
            elapsed_time = 0.0
            if totalTime.days > 0:
                elapsed_time += 3600.0 * totalTime.days
            if totalTime.seconds > 0:
                elapsed_time += totalTime.seconds
            if totalTime.microseconds > 0:
                elapsed_time += totalTime.microseconds / 1000000.0
            self.totalTime = elapsed_time
            if 'totalTime' not in update_fields:
                update_fields.append('totalTime')
        super(Taskinstance, self).save(*args, **kwargs)

    @property
    def blocks(self):
        """用于页面展示的block数据格式"""
        max_block = 1
        for step in self.steps:
            if step.blockOrd > max_block:
                max_block = step.blockOrd
        # 
        blocks = []
        for i in xrange(1, max_block + 1):
            block = {}
            s = []
            for step in self.steps:
                if step.blockOrd == i:
                    ipList = step.ipList
                    ips = [item.split(':')[-1] for item in ipList.split(',')]
                    #ipListStatus = []
                    #for ip in ips:
                    #    ipListStatus.append({
                    #        "valid": 1,
                    #        "source": 3,
                    #        "alived": 1,
                    #        # "name": "host14",
                    #        "ip": ip
                    #    })
                    s.append({
                        "badIPNum": step.badIPNum,
                        "createTime": timezone.localtime(step.createTime).strftime('%Y-%m-%d %H:%M:%S'),
                        "isPause": step.isPause,
                        "appId": step.appId,
                        "stepInstanceId": step.id,
                        "ord": step.ord,
                        "type": step.type,
                        "endTime": timezone.localtime(step.endTime).strftime('%Y-%m-%d %H:%M:%S') if step.endTime else None,
                        "startTime": timezone.localtime(step.startTime).strftime('%Y-%m-%d %H:%M:%S') if step.startTime else None,
                        "totalIPNum": step.totalIPNum,
                        "retryCount": step.retryCount,
                        "name": step.name,
                        "stepId": step.stepId,
                        "failIPNum": step.failIPNum,
                        "taskInstanceId": step.taskInstanceId,
                        "text": step.text,
                        "successIPNum": step.successIPNum,
                        "status": step.status,
                        "operationList": [],
                        "blockName": step.blockName,
                        "blockOrd": step.blockOrd,
                        "operator": step.operator,
                        "isUseCCFileParam": step.isUseCCFileParam,
                        "account": step.account,
                        "runIPNum": step.runIPNum,
                        #"companyId": 672,
                        "totalTime": step.totalTime if step.totalTime else 0
                    })

            if s:
                block['blockOrd'] = i
                block['blockName'] = s[0]['blockName']
                block['type'] = s[0]['type']
                block['stepInstances'] = s
                blocks.append(block)
        return blocks

    @property
    def inventory(self):
        inventory = {}
        for step in self.steps:
            group = "group%s" % step.id
            inventory[group] = [item.split(':')[-1] for item in step.ipList.split(',')]
        return inventory

    @property
    def steps(self):
        return Stepinstance.objects.filter(taskInstanceId=self.id)

    @property
    def can_start(self):
        """判断任务是否处于能够启动的状态"""
        # return self.status == 
        return True

    def _get_task_class(self):
        from .tasks import RunJob
        return RunJob
    
    def start(self, error_callback, success_callback, **kwargs):
        """通过Celery运行任务"""
        task_class = self._get_task_class()
        if not self.can_start:
            return False
        else:
            opts = {}
            task_class().apply_async((self.pk,), opts, link_error=error_callback, link=success_callback)
            return True

    def signal_start(self, **kwargs):
        """通知Celery调度系统开始执行该任务！"""
        return self.start(None, None, **kwargs)

    @property
    def playbook(self):
        """生成用于ansible-playbook执行使用的playbook文件"""
        if not os.path.exists(settings.PROJECTS_ROOT):
            os.mkdir(settings.PROJECTS_ROOT)
        yaml_file = os.path.join(settings.PROJECTS_ROOT, self.celery_task_id.replace('-', ''))
        f = file(yaml_file, 'wb')
        #f.write('---\n- hosts: all\n  user: qqdz\n  gather_facts: false\n  tasks:\n\n')
        for step in self.steps:
            f.write(step.task_yaml)
            f.write('\n')
        f.close()
        return yaml_file


class Step(BaseModel):
    """task step models"""
    # type 步骤类型：1、执行脚本，2、传输文件，3、文本通知
    # isPause 是否需要暂停，1.需要暂停、0.不需要暂停，默认：0。
    # paramType 执行脚本入口参数类型 1.字符串入口参数  2.CC数据文件传参 默认: 1
    TYPE_SCRIPT = 1
    TYPE_FILE = 2
    TYPE_TEXT = 3

    TYPE_CHOICES = (
        (TYPE_SCRIPT, '执行脚本'),
        (TYPE_FILE, '传输文件'),
        (TYPE_TEXT, '文本通知'),
    )
    taskId = models.IntegerField()
    appId = models.IntegerField()
    name = models.CharField(max_length=512)
    type = models.IntegerField(choices=TYPE_CHOICES)
    ord = models.IntegerField()
    blockOrd = models.IntegerField(blank=True, null=True)
    blockName = models.CharField(max_length=512, blank=True, null=True)
    account = models.CharField(max_length=128, blank=True, null=True)
    serverSetId = models.IntegerField(blank=True, null=True)
    ipList = models.TextField(blank=True, null=True)
    scriptId = models.IntegerField(blank=True, null=True)
    scriptParam = models.TextField(blank=True, null=True)
    scriptTimeout = models.IntegerField(blank=True, null=True)
    fileSource = models.TextField(blank=True, null=True)
    fileTargetPath = models.CharField(max_length=256, blank=True, null=True)
    fileSpeedLimit = models.IntegerField(blank=True, null=True)
    text = models.CharField(max_length=256, blank=True, null=True)
    creater = models.CharField(max_length=128)
    createTime = models.DateTimeField(auto_now_add=True)
    lastModifyUser = models.CharField(max_length=128)
    lastModifyTime = models.DateTimeField(auto_now=True)
    isPause = models.IntegerField(default=0)
    # companyId = models.IntegerField(db_column='companyId')
    ccScriptId = models.IntegerField(blank=True, null=True)
    paramType = models.IntegerField(blank=True, null=True, default=1)
    ccScriptParam = models.TextField(blank=True, null=True)

    def set_taskId(self, task):
        self.taskId = task.id

    def get_taskId(self):
        return Task.objects.get(id=self.taskId)

    task = property(get_taskId, set_taskId)

    @property
    def script(self):
        if self.scriptId > 0:
            return Script.objects.get(pk=self.scriptId)

    # def save(self, *args, **kwargs):
    #     task = kwargs.pop('task')
    #     self.set_taskId(task)
    #     super(Step, self).save(*args, **kwargs)

    def _get_step_instance_class(self):
        return Stepinstance

    def _get_step_instance_field_names(self):
        return [
            'stepId',
            'taskInstanceId',
            'playTaskName',
            'appId',
            'name',
            'type',
            'ord',
            'blockOrd',
            'blockName',
            'account',
            'ipList',
            'scriptId',
            'scriptParam',
            'scriptTimeout',
            'fileSource',
            'fileTargetPath',
            'fileSpeedLimit',
            'text',
            'isPause',
        ]

    def _update_step_instance_kwargs(self, **kwargs):
        """更新用于创建step instance的参数"""
        if self.script:
            kwargs['scriptContent'] = self.script.content
            kwargs['scriptType'] = self.script.TYPE
        kwargs.pop('scriptId')
        kwargs['status'] = 1
        kwargs['retryCount'] = 0
        return kwargs

    def create_step_instance(self, **kwargs):
        """根据当前步骤生成step instance"""
        step_instance_class = self._get_step_instance_class()

        create_kwargs = {}
        for field_name in self._get_step_instance_field_names():
            print 'field_name', field_name
            if hasattr(self, field_name):
                create_kwargs[field_name] = getattr(self, field_name)
            elif field_name in kwargs:
                create_kwargs[field_name] = kwargs[field_name]

        new_kwargs = self._update_step_instance_kwargs(**create_kwargs)
        step_instance = step_instance_class(**new_kwargs)
        step_instance.save()
        return True

        

class Stepinstance(BaseModel):
    stepId = models.IntegerField()
    taskInstanceId = models.IntegerField()
    appId = models.IntegerField()
    name = models.CharField(max_length=512)
    type = models.IntegerField()
    ord = models.IntegerField()
    blockOrd = models.IntegerField(blank=True, null=True)
    blockName = models.CharField(max_length=512, blank=True, null=True)
    account = models.CharField(max_length=256, blank=True, null=True)
    ipList = models.TextField(blank=True, null=True)
    badIpList = models.TextField(blank=True, null=True)
    scriptContent = models.TextField(blank=True, null=True)
    scriptType = models.IntegerField(blank=True, null=True)
    scriptParam = models.TextField(blank=True, null=True)
    scriptTimeout = models.IntegerField(blank=True, null=True)
    fileSource = models.TextField(blank=True, null=True)
    fileTargetPath = models.CharField(max_length=256, blank=True, null=True)
    fileSpeedLimit = models.IntegerField(blank=True, null=True)
    text = models.CharField(max_length=256, blank=True, null=True)
    operator = models.CharField(max_length=128, blank=True, null=True)
    status = models.IntegerField()
    retryCount = models.IntegerField()
    startTime = models.DateTimeField(blank=True, null=True)
    endTime = models.DateTimeField(blank=True, null=True)
    totalTime = models.FloatField(blank=True, null=True)
    totalIPNum = models.IntegerField(blank=True, null=True, default=0)
    badIPNum = models.IntegerField(blank=True, null=True, default=0)
    runIPNum = models.IntegerField(blank=True, null=True)
    failIPNum = models.IntegerField(blank=True, null=True, default=0)
    successIPNum = models.IntegerField(blank=True, null=True, default=0)
    createTime = models.DateTimeField(auto_now_add=True)
    isPause = models.IntegerField(blank=True, null=True)
    # companyId = models.IntegerField()
    isUseCCFileParam = models.IntegerField(blank=True, null=True)
    # playTaskName字段是本步骤在playbook中的task name, 值为taskInstanceId+name的md5
    playTaskName = models.CharField(max_length=256)

    def _caculate_elapsed_time(self):
        elapsed_time = 0.0
        if self.startTime and self.endTime:
            print 'jjjjjjjjjjjjjjjjjjjjjjjjj'
            totalTime = self.endTime - self.startTime
            if totalTime.days > 0:
                elapsed_time += 3600.0 * totalTime.days
            if totalTime.seconds > 0:
                elapsed_time += totalTime.seconds
            if totalTime.microseconds > 0:
                elapsed_time += totalTime.microseconds / 1000000.0
        return elapsed_time

    def save(self, *args, **kwargs):
        update_fields = kwargs.get('update_fields', [])

        if self.startTime and self.endTime:
            totalTime = self.endTime - self.startTime
            elapsed_time = 0.0
            if totalTime.days > 0:
                elapsed_time += 3600.0 * totalTime.days
            if totalTime.seconds > 0:
                elapsed_time += totalTime.seconds
            if totalTime.microseconds > 0:
                elapsed_time += totalTime.microseconds / 1000000.0
            self.totalTime = elapsed_time

            if 'totalTime' not in update_fields:
                update_fields.append('totalTime')

        self.totalIPNum = len(self.ipList.split(','))
        if 'totalIPNum' not in update_fields:
            update_fields.append('totalIPNum')

        self.runIPNum = len(self.ipList.split(','))
        if 'runIPNum' not in update_fields:
            update_fields.append('runIPNum')

        super(Stepinstance, self).save(*args, **kwargs)

    def _generate_task_name(self):
        return hashlib.md5(self.name.encode('utf-8')).hexdigest()

    def _build_script_file(self):
        """生成步骤类型为执行脚本的步骤执行所用的的脚本文件
        """
        PROJECTS_ROOT = settings.PROJECTS_ROOT
        if not os.path.exists(PROJECTS_ROOT):
            os.mkdir(PROJECTS_ROOT)

        # TODO: 将脚本文件名定义为脚本名+脚本版本.脚本类型
        script_name = u'%s.%s' % (self.name, self.scriptType)
        script_file = os.path.join(PROJECTS_ROOT, hashlib.md5(script_name.encode('utf-8')).hexdigest())
        script_content = base64.decodestring(self.scriptContent)
        with open(script_file, 'wb') as f:
            f.write(script_content)

        return script_file

    @property
    def task_yaml(self):
        """生成每个步骤对应的yaml文件中一个单独task的内容"""
        task_name = self._generate_task_name()
        if self.type == TYPE_SCRIPT:
            script_file = self._build_script_file()
            return '- hosts: group%s\n  gather_facts: no\n  user: %s\n  name: %s\n  tasks:\n    - name: %s\n      script: %s %s\n' %(self.id, self.account, self.playTaskName, self.playTaskName, script_file, self.scriptParam)
        elif self.type == TYPE_FILE:
            file_source = json.loads(self.fileSource)
            src = file_source[0].get('file')
            ipList = file_source[0].get('ipList')
            if ipList:
            #return '    - name: %s\n      copy: src=%s dest=%s\n' %(task_name, src, self.fileTargetPath)
                return '- hosts: group%s\n  gather_facts: no\n  user: %s\n  name: %s\n  tasks:\n    - name: %s\n      get_url: url=http://%s%s dest=%s\n' %(self.id, self.account, self.playTaskName, self.playTaskName, ipList.split(':')[-1], src, self.fileTargetPath)
            return '- hosts: group%s\n  gather_facts: no\n  user: %s\n  name: %s\n  tasks:\n    - name: %s\n      copy: %s %s\n' %(self.id, self.account, self.playTaskName, self.playTaskName, src, self.fileTargetPath)


class StepInstanceEvent(BaseModel):
    """step instance event models"""
    EVENT_TYPES = [
        (3, 'runner_on_failed', 'Host Failed', True),
        (3, 'runner_on_ok', 'Host OK', False),
        (3, 'runner_on_error', 'Host Failure', True),
        (3, 'runner_on_skipped', 'Host Skipped', False),
        (3, 'runner_on_unreachable', 'Host Unreachable', True),
        (3, 'runner_on_no_hosts', 'No Hosts Remaining', False),
        (3, 'runner_on_async_poll', 'Host Polling', False),
        (3, 'runner_on_async_ok', 'Host Async OK', False),
        (3, 'runner_on_async_failed', 'Host Async Failure', True),
        (3, 'runner_on_file_diff', 'File Difference', False),
        (0, 'playbook_on_start', 'Playbook Started', False),
        (2, 'playbook_on_notify', 'Running Handlers',False),
        (2, 'playbook_on_no_hosts_matched', 'No Hosts Matched', False),
        (2, 'playbook_on_no_hosts_remaining', 'No Hosts Remaining', False),
        (2, 'playbook_on_task_start', 'Task Started', False),
        (1, 'playbook_on_vars_prompt', 'Variables Prompted', False),
        (2, 'playbook_on_setup', 'Gathering Facts', False),
        (2, 'playbook_on_import_for_host', 'internal: on Import for Host', False),
        (2, 'playbook_on_not_import_for_host', 'internal: on Not Import for Host', False),
        (1, 'playbook_on_play_start', 'Play Started', False),
        (1, 'playbook_on_stats', 'Playbook Complete', False)
    ]
    FAILED_EVENTS = [ x[1] for x in EVENT_TYPES if x[3] ]
    EVENT_CHOICES = [ (x[1], x[2]) for x in EVENT_TYPES ]
    LEVEL_FOR_EVENT = dict([ (x[1], x[0]) for x in EVENT_TYPES ])
    UPDATE_HOST_EVENTS = ['runner_on_failed', 'runner_on_ok', 'runner_on_error', 'runner_on_unreachable']

    class Meta:
        ordering = ('pk',)

    name = models.CharField(max_length=256)
    event = models.CharField(max_length=100, choices=EVENT_CHOICES)
    event_data = JSONField(blank=True, default={})
    succeed = models.BooleanField(default=True, editable=False)
    changed = models.BooleanField(default=False, editable=False)
    host_name = models.CharField(max_length=1024, default='', editable=False)
    play = models.CharField(max_length=1024, default='', editable=False)
    role = models.CharField(max_length=1024, default='', editable=False)
    task = models.CharField(max_length=1024, default='', editable=False)
    created = models.DateTimeField('创建时间', default=None, editable=False)
    modified = models.DateTimeField('修改时间', default=None, editable=False)


    def save(self, *args, **kwargs):
        update_fields = kwargs.get('update_fields', [])
        res = self.event_data.get('res', None)
        if self.event == 'runner_on_async_ok':
            try:
                if res.get('failed', False) or res.get('rc', 0) != 0:
                    self.event = 'runner_on_async_failed'
            except (AttributeError, TypeError):
                pass

        if self.event in self.FAILED_EVENTS:
            if not self.event_data.get('ignore_errors', False):
                self.succeed = False
                if 'succeed' not in update_fields:
                    update_fields.append('succeed')
        if isinstance(res, dict) and res.get('changed', False):
            self.changed = True
            if 'changed' not in update_fields:
                update_fields.append('changed')
        if self.event == 'playbook_on_stats':
            try:
                failures_dict = self.event_data.get('failures', {})
                dark_dict = self.event_data.get('dark', {})
                self.succeed = bool(sum(failures_dict.values()) + sum(dark_dict.values()))
                if 'succeed' not in update_fields:
                    update_fields.append('succeed')
                changed_dict = self.event_data.get('changed', {})
                self.changed = bool(sum(changed_dict.values()))
                if 'changed' not in update_fields:
                    update_fields.append('changed')
            except (AttributeError, TypeError):
                pass

        self.play = self.event_data.get('play', '').strip()
        if 'play' not in update_fields:
            update_fields.append('play')
        self.task = self.event_data.get('task', '').strip()
        if 'task' not in update_fields:
            update_fields.append('task')
        self.role = self.event_data.get('role', '').strip()
        if 'role' not in update_fields:
            update_fields.append('role')
        self.host_name = self.event_data.get('host', '').strip()
        if 'host_name' not in update_fields:
            update_fields.append('host_name')

        if not self.pk and not self.created:
            self.created = timezone.now()
            if 'created' not in update_fields:
                update_fields.append('created')
        if 'modified' not in update_fields or not self.modified:
            self.modified = timezone.now()
            update_fields.append('modified')
        super(StepInstanceEvent, self).save(*args, **kwargs)
        if self.event in self.UPDATE_HOST_EVENTS:
            self.update_step_host_number()

    def update_step_host_number(self):
        """更新步骤中的主机数"""
        for item in Stepinstance.objects.filter(playTaskName=self.task):
            if self.event == 'runner_on_unreachable':
                item.badIPNum += 1
            elif self.event == 'runner_on_failed':
                item.failIPNum += 1
            elif self.event == 'runner_on_ok':
                item.successIPNum += 1
            item.save()
