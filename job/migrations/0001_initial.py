# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Script',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=512)),
                ('app_id', models.IntegerField()),
                ('type', models.IntegerField(default=1, choices=[(1, b'shell'), (2, b'bat'), (3, b'perl'), (4, b'python')])),
                ('is_public', models.IntegerField()),
                ('content', models.TextField()),
                ('creater', models.CharField(max_length=128)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modifier', models.CharField(max_length=128)),
                ('modified', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
