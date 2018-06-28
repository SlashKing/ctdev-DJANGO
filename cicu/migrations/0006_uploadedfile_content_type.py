# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-22 17:46
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('cicu', '0005_auto_20150420_0329'),
    ]

    operations = [
        migrations.AddField(
            model_name='uploadedfile',
            name='content_type',
            field=models.ForeignKey(default=38, on_delete=django.db.models.deletion.CASCADE, related_name='content_type_set_for_uploadedfile', to='contenttypes.ContentType', verbose_name='content type'),
            preserve_default=False,
        ),
    ]
