# Generated by Django 4.1.4 on 2023-04-09 16:21

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("wine_map", "0013_wineoftheday"),
    ]

    operations = [
        migrations.AddField(
            model_name="wineoftheday",
            name="date",
            field=models.DateField(default=datetime.date(2023, 4, 9)),
        ),
    ]
