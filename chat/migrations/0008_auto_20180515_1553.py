# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-05-15 22:53
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('cicu', '0010_auto_20180515_1553'),
        ('chat', '0007_auto_20180506_1822'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupmessage',
            name='file',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='cicu.UploadedFile'),
        ),
        migrations.AddField(
            model_name='message',
            name='file',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='cicu.UploadedFile'),
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 5, 15, 22, 53, 43, 888762, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 5, 15, 22, 53, 43, 888762, tzinfo=utc)),
        ),
    ]