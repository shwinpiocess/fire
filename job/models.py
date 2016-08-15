from django.db import models


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
    app_id = models.IntegerField()
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
    app_id = models.IntegerField()
    account = models.CharField(max_length=128, blank=True, null=True)
    serverset_id = models.IntegerField(blank=True, null=True)
    iplist = models.CharField(max_length=512, blank=True, null=True)
    creater = models.CharField(max_length=128)
    created = models.DateTimeField(auto_now_add=True)
    modifier = models.CharField(max_length=128)
    modified = models.DateTimeField(auto_now=True)


class Step(BaseModel):
    """task step models"""
    task_id = models.IntegerField()
    app_id = models.IntegerField()
    name = models.CharField(max_length=512)
    type = models.IntegerField()
    order = models.IntegerField()
    blockord = models.IntegerField(blank=True, null=True)
    blockname = models.CharField(max_length=512, blank=True, null=True)
    account = models.CharField(max_length=128, blank=True, null=True)
    serverset_id = models.IntegerField(blank=True, null=True)
    iplist = models.TextField(blank=True, null=True)
    script_id = models.IntegerField(blank=True, null=True)
    script_param = models.TextField(blank=True, null=True)
    script_timeout = models.IntegerField(blank=True, null=True)
    file_source = models.TextField(blank=True, null=True)
    file_targetpath = models.CharField(max_length=256, blank=True, null=True)
    files_peedlimit = models.IntegerField(blank=True, null=True)
    text = models.CharField(max_length=256, blank=True, null=True)
    creater = models.CharField(max_length=128)
    created = models.DateTimeField(auto_now_add=True)
    modifier = models.CharField(max_length=128)
    modified = models.DateTimeField(auto_now=True)
    is_pause = models.BooleanField(default=False)
    # companyid = models.IntegerField(db_column='companyId')
    # ccscriptid = models.IntegerField(db_column='ccScriptId', blank=True, null=True)
    # paramtype = models.IntegerField(db_column='paramType', blank=True, null=True)
    # ccscriptparam = models.TextField(db_column='ccScriptParam', blank=True, null=True)

