# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-27 18:54
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0015_auto_20180626_0150'),
    ]

    operations = [
        migrations.AddField(
            model_name='joinrequest',
            name='message',
            field=models.TextField(blank=True, default='', max_length=500),
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 27, 18, 54, 2, 481231, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 27, 18, 54, 2, 481231, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 27, 18, 54, 2, 481231, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 27, 18, 54, 2, 481231, tzinfo=utc), null=True),
        ),
    ]
