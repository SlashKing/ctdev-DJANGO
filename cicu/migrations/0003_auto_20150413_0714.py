# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cicu', '0002_auto_20150413_0619'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadedfile',
            name='content_type',
            field=models.ForeignKey(to='contenttypes.ContentType'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='uploadedfile',
            name='object_id',
            field=models.PositiveIntegerField(),
            preserve_default=True,
        ),
    ]
