# Generated by Django 4.1 on 2022-10-11 17:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='whole_data',
            name='data',
            field=models.TextField(null=True),
        ),
    ]
