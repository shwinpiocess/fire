# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0008_auto_20160817_1341'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskinstance',
            name='celery_task_id',
            field=models.CharField(default=b'', max_length=100, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='taskinstance',
            name='job_args',
            field=models.TextField(default=b'', editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='taskinstance',
            name='job_cwd',
            field=models.CharField(default=b'', max_length=1024, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='taskinstance',
            name='job_env',
            field=jsonfield.fields.JSONField(default={}, editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='taskinstance',
            name='job_explanation',
            field=models.TextField(default=b'', editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='taskinstance',
            name='result_stdout_file',
            field=models.TextField(default=b'', editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='taskinstance',
            name='result_stdout_text',
            field=models.TextField(default=b'', editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='taskinstance',
            name='result_traceback',
            field=models.TextField(default=b'', editable=False, blank=True),
        ),
        migrations.AddField(
            model_name='taskinstance',
            name='start_args',
            field=models.TextField(default=b'', editable=False, blank=True),
        ),
    ]
