# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0007_stepinstance_taskinstance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stepinstance',
            name='createTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
