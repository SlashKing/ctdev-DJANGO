# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-04 15:41
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0009_auto_20180604_0118'),
    ]

    operations = [
        migrations.AddField(
            model_name='userreport',
            name='reporter',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='reporter', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 4, 15, 41, 39, 812821, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 4, 15, 41, 39, 812821, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 4, 15, 41, 39, 812821, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 4, 15, 41, 39, 812821, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='userreport',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reportee', to=settings.AUTH_USER_MODEL),
        ),
    ]
