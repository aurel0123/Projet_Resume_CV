# Generated by Django 5.1.4 on 2025-02-12 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_offreemploi_mots_cles_offreemploi_tag'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offreemploi',
            name='tag',
            field=models.TextField(blank=True, help_text='Séparer les tags par des virgules', null=True),
        ),
    ]
