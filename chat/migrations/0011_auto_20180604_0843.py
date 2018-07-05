# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-04 15:43
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0010_auto_20180604_0841'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userreport',
            old_name='user',
            new_name='reportee',
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 4, 15, 43, 40, 686480, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 4, 15, 43, 40, 686480, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 4, 15, 43, 40, 686480, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 4, 15, 43, 40, 686480, tzinfo=utc), null=True),
        ),
    ]