# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='HashTag',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('name', models.TextField(max_length=50)),
            ],
            options={
                'verbose_name_plural': 'Hashtags',
                'verbose_name': 'Hashtag',
                'db_table': 'hashtag',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HashTagged_Item',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('object_id', models.PositiveIntegerField()),
                ('content_type', models.ForeignKey(on_delete=models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('hashtag', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='hashtagged_items', to='hashtags.HashTag')),
                ('user', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='hashtag_users', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Hashtagged Items',
                'verbose_name': 'Hashtagged Item',
                'db_table': 'hashtagged_item',
            },
            bases=(models.Model,),
        ),
    ]
