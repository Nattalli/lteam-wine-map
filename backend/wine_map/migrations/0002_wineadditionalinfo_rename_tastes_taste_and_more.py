# Generated by Django 4.1.4 on 2023-03-07 01:53

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("wine_map", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="WineAdditionalInfo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                (
                    "price",
                    models.FloatField(
                        verbose_name=django.core.validators.MinValueValidator(0.0)
                    ),
                ),
                ("url", models.URLField(max_length=255)),
            ],
        ),
        migrations.RenameModel(
            old_name="Tastes",
            new_name="Taste",
        ),
        migrations.RenameField(
            model_name="wine",
            old_name="tastes",
            new_name="taste",
        ),
        migrations.AlterField(
            model_name="comment",
            name="author",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="comments",
                to="wine_map.user",
            ),
        ),
        migrations.AlterField(
            model_name="comment",
            name="wine",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="comments",
                to="wine_map.wine",
            ),
        ),
        migrations.AlterField(
            model_name="wine",
            name="brand",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="brand",
                to="wine_map.brand",
            ),
        ),
        migrations.AlterField(
            model_name="wine",
            name="percent_of_alcohol",
            field=models.FloatField(
                default=0.0,
                validators=[
                    django.core.validators.MinValueValidator(0.0),
                    django.core.validators.MaxValueValidator(100.0),
                ],
            ),
        ),
        migrations.AlterField(
            model_name="wine",
            name="wine_type",
            field=models.CharField(
                choices=[("red", "Red"), ("white", "White"), ("rose", "Rosé")],
                max_length=5,
            ),
        ),
        migrations.DeleteModel(
            name="WineInfo",
        ),
        migrations.AddField(
            model_name="wineadditionalinfo",
            name="wine",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="wine_map.wine"
            ),
        ),
    ]
