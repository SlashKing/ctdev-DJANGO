# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-19 22:50
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0011_auto_20180604_0843'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='groupmessage',
            name='flag',
        ),
        migrations.RemoveField(
            model_name='groupmessage',
            name='flag_priority',
        ),
        migrations.RemoveField(
            model_name='groupmessage',
            name='flag_reason',
        ),
        migrations.RemoveField(
            model_name='message',
            name='flag',
        ),
        migrations.RemoveField(
            model_name='message',
            name='flag_priority',
        ),
        migrations.RemoveField(
            model_name='message',
            name='flag_reason',
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 19, 22, 50, 19, 453669, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 19, 22, 50, 19, 453669, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 19, 22, 50, 19, 453669, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 19, 22, 50, 19, 453669, tzinfo=utc), null=True),
        ),
    ]
