# Generated by Django 2.0.7 on 2018-07-09 23:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rest_flag', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flaginstance',
            name='reason',
            field=models.ForeignKey(default=1, null=True, on_delete=django.db.models.deletion.CASCADE, to='rest_flag.Reason'),
        ),
    ]
