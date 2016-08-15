# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='script',
            name='is_public',
            field=models.BooleanField(default=False),
        ),
    ]
