# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-28 18:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('django_comments', '0003_add_submit_date_index'),
        ('picture_comments', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='PictureComment',
        ),
        migrations.CreateModel(
            name='PictureComment',
            fields=[
                ('comment_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='django_comments.Comment')),
            ],
            options={
                'proxy': False,
            },
            bases=('django_comments.comment',),
        ),
    ]
