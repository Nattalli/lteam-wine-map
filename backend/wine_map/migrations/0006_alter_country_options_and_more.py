# Generated by Django 4.1.4 on 2023-03-14 20:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("wine_map", "0005_wine_image_url"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="country",
            options={"verbose_name_plural": "Countries"},
        ),
        migrations.AlterModelOptions(
            name="wineadditionalinfo",
            options={"verbose_name_plural": "Wine additional info"},
        ),
    ]