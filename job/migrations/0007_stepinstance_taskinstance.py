# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0006_auto_20160816_1630'),
    ]

    operations = [
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
                ('createTime', models.DateTimeField()),
                ('isPause', models.IntegerField(null=True, blank=True)),
                ('isUseCCFileParam', models.IntegerField(null=True, blank=True)),
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
            ],
            options={
                'abstract': False,
            },
        ),
    ]
