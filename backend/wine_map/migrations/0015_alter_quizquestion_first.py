# Generated by Django 4.1.4 on 2023-04-02 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("wine_map", "0014_quizquestion_first_alter_quizanswer_results_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="quizquestion",
            name="first",
            field=models.BooleanField(default=False),
        ),
    ]
