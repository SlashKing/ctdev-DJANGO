# Generated by Django 2.0.7 on 2018-07-09 23:10

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0017_auto_20180629_1243'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='grouproom',
            managers=[
                ('through_objects', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 7, 9, 23, 10, 26, 866057, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='chatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 7, 9, 23, 10, 26, 866057, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2018, 7, 9, 23, 10, 26, 866057, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='groupchatuser',
            name='last_activity',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2018, 7, 9, 23, 10, 26, 866057, tzinfo=utc), null=True),
        ),
        migrations.AlterField(
            model_name='groupmessage',
            name='file',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='cicu.UploadedFile'),
        ),
        migrations.AlterField(
            model_name='grouproom',
            name='users',
            field=models.ManyToManyField(related_name='group_rooms', through='chat.GroupChatUser', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='joinrequest',
            name='requested',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='received_join_requests', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='joinrequest',
            name='requester',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sent_join_requests', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='message',
            name='file',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='cicu.UploadedFile'),
        ),
        migrations.AlterField(
            model_name='room',
            name='users',
            field=models.ManyToManyField(related_name='rooms', through='chat.ChatUser', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userreport',
            name='reportee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reports_against', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userreport',
            name='reporter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reported_users', to=settings.AUTH_USER_MODEL),
        ),
    ]
