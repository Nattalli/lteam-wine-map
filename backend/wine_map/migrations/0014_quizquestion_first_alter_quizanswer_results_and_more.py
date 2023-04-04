# Generated by Django 4.1.4 on 2023-04-02 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("wine_map", "0013_quizquestion_quizanswer"),
    ]

    operations = [
        migrations.AddField(
            model_name="quizquestion",
            name="first",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="quizanswer",
            name="results",
            field=models.ManyToManyField(blank=True, to="wine_map.wine"),
        ),
        migrations.AddConstraint(
            model_name="quizquestion",
            constraint=models.UniqueConstraint(
                condition=models.Q(("first", True)),
                fields=("first",),
                name="unique_first_question",
            ),
        ),
    ]
