# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0002_auto_20160815_1416'),
    ]

    operations = [
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('task_id', models.IntegerField()),
                ('app_id', models.IntegerField()),
                ('name', models.CharField(max_length=512)),
                ('type', models.IntegerField()),
                ('order', models.IntegerField()),
                ('blockord', models.IntegerField(null=True, blank=True)),
                ('blockname', models.CharField(max_length=512, null=True, blank=True)),
                ('account', models.CharField(max_length=128, null=True, blank=True)),
                ('serverset_id', models.IntegerField(null=True, blank=True)),
                ('iplist', models.TextField(null=True, blank=True)),
                ('script_id', models.IntegerField(null=True, blank=True)),
                ('script_param', models.TextField(null=True, blank=True)),
                ('script_timeout', models.IntegerField(null=True, blank=True)),
                ('file_source', models.TextField(null=True, blank=True)),
                ('file_targetpath', models.CharField(max_length=256, null=True, blank=True)),
                ('files_peedlimit', models.IntegerField(null=True, blank=True)),
                ('text', models.CharField(max_length=256, null=True, blank=True)),
                ('creater', models.CharField(max_length=128)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modifier', models.CharField(max_length=128)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('is_pause', models.IntegerField(null=True, db_column=b'isPause', blank=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=512)),
                ('app_id', models.IntegerField()),
                ('account', models.CharField(max_length=128, null=True, blank=True)),
                ('serverset_id', models.IntegerField(null=True, blank=True)),
                ('iplist', models.CharField(max_length=512, null=True, blank=True)),
                ('creater', models.CharField(max_length=128)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modifier', models.CharField(max_length=128)),
                ('modified', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
