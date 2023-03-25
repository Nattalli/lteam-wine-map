# Generated by Django 4.1.4 on 2023-03-25 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("wine_map", "0009_alter_wine_pairs_with_alter_wine_tastes"),
    ]

    operations = [
        migrations.AlterField(
            model_name="wine",
            name="sweetness",
            field=models.CharField(
                blank=True,
                choices=[
                    ("брют", "брют"),
                    ("напівсолодке", "напівсолодке"),
                    ("напівсухе", "напівсухе"),
                    ("солодке", "солодке"),
                    ("сухе", "сухе"),
                ],
                max_length=127,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="wine",
            name="wine_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("червоне", "червоне"),
                    ("біле", "біле"),
                    ("рожеве", "рожеве"),
                ],
                max_length=127,
                null=True,
            ),
        ),
    ]
