# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0009_auto_20160817_1014'),
    ]

    operations = [
        migrations.RenameField(
            model_name='script',
            old_name='name',
            new_name='NAME',
        ),
        migrations.RenameField(
            model_name='script',
            old_name='type',
            new_name='TYPE',
        ),
        migrations.RenameField(
            model_name='script',
            old_name='created',
            new_name='createTime',
        ),
        migrations.RenameField(
            model_name='script',
            old_name='modified',
            new_name='lastModifyTime',
        ),
        migrations.RenameField(
            model_name='script',
            old_name='modifier',
            new_name='lastModifyUser',
        ),
        migrations.RemoveField(
            model_name='script',
            name='is_public',
        ),
        migrations.AddField(
            model_name='script',
            name='isCCScript',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='script',
            name='isPublic',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='step',
            name='isPause',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='step',
            name='paramType',
            field=models.IntegerField(default=1, null=True, blank=True),
        ),
    ]
