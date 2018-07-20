# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hashtags', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hashtagged_item',
            name='hashtag',
            field=models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='hashtag_hashtagged_items', to='hashtags.HashTag'),
            preserve_default=True,
        ),
    ]
