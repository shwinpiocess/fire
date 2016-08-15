# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0003_step_task'),
    ]

    operations = [
        migrations.AlterField(
            model_name='step',
            name='is_pause',
            field=models.BooleanField(default=False),
        ),
    ]
