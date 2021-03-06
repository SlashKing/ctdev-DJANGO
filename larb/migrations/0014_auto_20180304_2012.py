# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-03-05 04:12
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('larb', '0013_auto_20180117_1641'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='isApproved',
            field=models.BooleanField(default=False, verbose_name='Approved to use app in region'),
        ),
        migrations.AlterField(
            model_name='post',
            name='pub_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 3, 5, 4, 12, 5, 556771, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='date_of_birth',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 3, 5, 4, 12, 5, 559309, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='gender',
            field=models.CharField(choices=[('MA', 'Male'), ('FM', 'Female'), ('TR', 'Transexual')], default='FM', max_length=2),
        ),
    ]
