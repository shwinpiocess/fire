# -*- coding: utf-8 -*-

from django.db import models

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
    """script models"""
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
    name = models.CharField(max_length=512)
    appId = models.IntegerField()
    type = models.IntegerField(choices=TYPE_CHOICES, default=TYPE_SHELL)
    is_public = models.BooleanField(default=False)
    content = models.TextField()
    creater = models.CharField(max_length=128)
    created = models.DateTimeField(auto_now_add=True)
    modifier = models.CharField(max_length=128)
    modified = models.DateTimeField(auto_now=True)


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

    def set_steps(self, steps):
        step_objs = []
        step_update_objs = []
        for step in steps:
            step['taskId'] = self.id
            step['appId'] = self.appId
            print 'self.id', self.id
            stepId = step.pop('stepId')
            if stepId > 0:
                step['id'] = stepId
                step_update_objs.append(step)
            else:
                if int(step['type']) == TYPE_SCRIPT:
                    step.pop('scriptContent')
                    step.pop('scriptType')
                step_objs.append(Step(**step))
        Step.objects.bulk_create(step_objs)

        for s in step_update_objs:
            pk = s.pop('id')
            Step.objects.filter(pk=pk).update(**s)
        

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
            stepId_list = stepIds.split(',')

        Taskinstance.objects.create(**kwargs)
        print '开始创建实例的步骤'


class Taskinstance(BaseModel):
    """ task instance models"""
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


class Step(BaseModel):
    """task step models"""
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
    isPause = models.BooleanField(default=False)
    # companyId = models.IntegerField(db_column='companyId')
    ccScriptId = models.IntegerField(blank=True, null=True)
    paramType = models.IntegerField(blank=True, null=True)
    ccScriptParam = models.TextField(blank=True, null=True)

    def set_taskId(self, task):
        self.taskId = task.id

    def get_taskId(self):
        return self.taskId

    task = property(get_taskId, set_taskId)

    # def save(self, *args, **kwargs):
    #     task = kwargs.pop('task')
    #     self.set_taskId(task)
    #     super(Step, self).save(*args, **kwargs)
        

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
    createTime = models.DateTimeField()
    isPause = models.IntegerField(blank=True, null=True)
    # companyId = models.IntegerField()
    isUseCCFileParam = models.IntegerField(blank=True, null=True)