# Generated by Django 5.1.4 on 2025-02-16 13:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_offreemploi_adresse_offreemploi_hidesalary_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='offreemploi',
            name='adresse',
        ),
    ]
