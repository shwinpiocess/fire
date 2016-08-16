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
        print 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        step_objs = []
        for step in steps:
            step['task'] = self
            step['taskId'] = self.id
            step['appId'] = self.appId
            print 'self.id', self.id
            step.pop('stepId')
            if int(step['type']) == TYPE_SCRIPT:
                step.pop('scriptContent')
                step.pop('scriptType')
            step_objs.append(Step(**step))
        Step.objects.bulk_create(step_objs)
        print 'cccccccccccccccddddddddddddddddddd'
        

    def get_steps(self):
        return Step.objects.filter(taskId=self.id)

    steps = property(get_steps, set_steps)

    # def save(self, *args, **kwargs):
    #     print 'bbbbbbbbbbbbbbbbbbbbbb'
    #     super(Task, self).save(*args, **kwargs)
    #     print 'cccccccccccccccccccc'
    #     steps = kwargs.pop(steps)
    #     self.set_steps(steps)


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

    def save(self, *args, **kwargs):
        task = kwargs.pop('task')
        self.set_taskId(task)
        super(Step, self).save(*args, **kwargs)
        
