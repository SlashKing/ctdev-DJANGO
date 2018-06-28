# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cicu', '0003_auto_20150413_0714'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='uploadedfile',
            name='content_type',
        ),
        migrations.RemoveField(
            model_name='uploadedfile',
            name='object_id',
        ),
    ]
