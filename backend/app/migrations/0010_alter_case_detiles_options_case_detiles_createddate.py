# Generated by Django 4.1 on 2023-02-12 16:16

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_pdf_table_data'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='case_detiles',
            options={'get_latest_by': 'id'},
        ),
        migrations.AddField(
            model_name='case_detiles',
            name='CreatedDate',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
