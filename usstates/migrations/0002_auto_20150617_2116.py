# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('usstates', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usstates',
            name='geom',
            field=django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326),
            preserve_default=True,
        ),
    ]
