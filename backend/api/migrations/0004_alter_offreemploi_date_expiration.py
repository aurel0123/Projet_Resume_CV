# Generated by Django 5.1.4 on 2025-02-12 13:47

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_offreemploi_tag'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offreemploi',
            name='date_expiration',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True),
        ),
    ]
