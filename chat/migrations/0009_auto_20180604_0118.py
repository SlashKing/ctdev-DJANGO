# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-04 08:18
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0008_auto_20180515_1553'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('report_type', models.CharField(choices=[('SH', 'Sexual Harassment'), ('AC', 'Abusive Chat'), ('UN', 'Unsolicited Nudity'), ('SP', 'Spam'), ('OT', 'Other')], default='OT', max_length=2)),
                ('comment', models.TextField(blank=True, default='', null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 4, 8, 18, 14, 464643, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 4, 8, 18, 14, 464643, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 6, 4, 8, 18, 14, 464643, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 6, 4, 8, 18, 14, 464643, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='groupmessage',
            name='content',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='content',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]
