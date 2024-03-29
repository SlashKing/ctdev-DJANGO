# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-22 17:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('cicu', '0006_uploadedfile_content_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='uploadedfile',
            name='content_type',
        ),
        migrations.AddField(
            model_name='uploadedfile',
            name='content_type_id',
            field=models.ForeignKey(default=38, on_delete=django.db.models.deletion.CASCADE, related_name='content_type_set_for_uploadedfile', to='contenttypes.ContentType', verbose_name='content type'),
        ),
        migrations.AddField(
            model_name='uploadedfile',
            name='object_pk',
            field=models.PositiveIntegerField(default=77),
        ),
    ]
