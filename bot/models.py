from django.db import models
from django.contrib.postgres.fields import ArrayField

class GameState(models.Model):
    user_id = models.BigIntegerField(unique=True)
    answers = ArrayField(models.CharField(max_length=200), default=list)
    questions = ArrayField(models.JSONField(), default=list)
    total_questions = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    help_used = models.BooleanField(default=False)
