# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0005_auto_20160816_1620'),
    ]

    operations = [
        migrations.RenameField(
            model_name='script',
            old_name='app_id',
            new_name='appId',
        ),
    ]
