# Generated by Django 4.1 on 2022-12-15 04:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_set_project_detils'),
    ]

    operations = [
        migrations.CreateModel(
            name='Set_folder_detils',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('setFolderName', models.CharField(max_length=255, null=True)),
                ('type', models.CharField(max_length=255, null=True)),
                ('orgid', models.CharField(max_length=255, null=True)),
            ],
        ),
    ]
