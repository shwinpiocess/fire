# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0004_auto_20160815_2243'),
    ]

    operations = [
        migrations.RenameField(
            model_name='step',
            old_name='app_id',
            new_name='appId',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='blockname',
            new_name='blockName',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='blockord',
            new_name='blockOrd',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='files_peedlimit',
            new_name='ccScriptId',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='file_source',
            new_name='ccScriptParam',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='created',
            new_name='createTime',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='iplist',
            new_name='fileSource',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='script_id',
            new_name='fileSpeedLimit',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='file_targetpath',
            new_name='fileTargetPath',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='script_param',
            new_name='ipList',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='is_pause',
            new_name='isPause',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='modified',
            new_name='lastModifyTime',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='modifier',
            new_name='lastModifyUser',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='order',
            new_name='ord',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='script_timeout',
            new_name='paramType',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='serverset_id',
            new_name='scriptId',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='task_id',
            new_name='taskId',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='app_id',
            new_name='appId',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='created',
            new_name='createTime',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='iplist',
            new_name='ipList',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='modified',
            new_name='lastModifyTime',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='modifier',
            new_name='lastModifyUser',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='serverset_id',
            new_name='serverSetId',
        ),
        migrations.AddField(
            model_name='step',
            name='scriptParam',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='step',
            name='scriptTimeout',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='step',
            name='serverSetId',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='step',
            name='type',
            field=models.IntegerField(choices=[(1, b'\xe6\x89\xa7\xe8\xa1\x8c\xe8\x84\x9a\xe6\x9c\xac'), (2, b'\xe4\xbc\xa0\xe8\xbe\x93\xe6\x96\x87\xe4\xbb\xb6'), (3, b'\xe6\x96\x87\xe6\x9c\xac\xe9\x80\x9a\xe7\x9f\xa5')]),
        ),
    ]
