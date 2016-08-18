# -*- coding: utf-8 -*-
import os
import json
import base64
import hashlib

from django.db import models
from django.conf import settings

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
        print NAME
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
        Step.objects.exclude(id__in=step_ids).delete()
            
        step_objs = []
        step_update_objs = []
        for step in steps:
            step['taskId'] = self.id
            step['appId'] = self.appId
            print 'self.id', self.id
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
        print "kwargs", kwargs
        if self.stepNum == 0:
            return '作业没有步骤'

        stepId_list = []
        stepIds = kwargs.pop('stepIds')
        if stepIds:
            stepId_list = [int(item) for item in stepIds.split(',')]

        kwargs['status'] = 1
        task_instance = Taskinstance.objects.create(**kwargs)
        print '开始创建实例的步骤'

        step_instance_result = []
        for step in self.steps:
            for stepId in stepId_list:
                if step.id == stepId:
                    step_instance_kwargs = {'stepId': step.id, 'taskInstanceId': task_instance.id}
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
        return self.taskId

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
    totalIPNum = models.IntegerField(blank=True, null=True)
    badIPNum = models.IntegerField(blank=True, null=True)
    runIPNum = models.IntegerField(blank=True, null=True)
    failIPNum = models.IntegerField(blank=True, null=True)
    successIPNum = models.IntegerField(blank=True, null=True)
    createTime = models.DateTimeField(auto_now_add=True)
    isPause = models.IntegerField(blank=True, null=True)
    # companyId = models.IntegerField()
    isUseCCFileParam = models.IntegerField(blank=True, null=True)

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
            return '- hosts: group%s\n  user: %s\n  tasks:\n    - name: %s\n      script: %s %s\n' %(self.id, self.account, task_name, script_file, self.scriptParam)
        elif self.type == TYPE_FILE:
            file_source = json.loads(self.fileSource)
            src = file_source[0].get('file')
            #return '    - name: %s\n      copy: src=%s dest=%s\n' %(task_name, src, self.fileTargetPath)
            return '- hosts: group%s\n  user: %s\n  tasks:\n    - name: %s\n      copy: %s %s\n' %(self.id, self.account, task_name, src, self.fileTargetPath)
