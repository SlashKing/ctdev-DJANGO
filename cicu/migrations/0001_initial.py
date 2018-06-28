# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFile',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('creation_date', models.DateTimeField(verbose_name='creation date', auto_now_add=True)),
                ('file', models.FileField(upload_to='ajax_uploads/', verbose_name='file')),
            ],
            options={
                'verbose_name': 'uploaded file',
                'ordering': ('id',),
                'verbose_name_plural': 'uploaded files',
            },
            bases=(models.Model,),
        ),
    ]
