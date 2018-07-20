# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('cicu', '0004_auto_20150413_1827'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadedfile',
            name='user',
            field=models.ForeignKey(on_delete=models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
