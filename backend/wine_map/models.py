from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator


class User(AbstractUser):
    favourite_wines = models.ManyToManyField("Wine")
    groups = models.ManyToManyField("auth.Group", related_name="wine_map_users")
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="wine_map_users",
        blank=True,
    )


class Wine(models.Model):
    WINE_TYPES = [
        ("red", "Red"),
        ("white", "White"),
        ("rose", "Rosé"),
    ]

    name = models.CharField(max_length=255)
    brand = models.ForeignKey("Brand", on_delete=models.CASCADE, related_name="brand")
    wine_type = models.CharField(choices=WINE_TYPES, max_length=5)
    country = models.ForeignKey("Country", on_delete=models.CASCADE)
    sweetness = models.ManyToManyField("Sweetness")
    taste = models.ManyToManyField("Taste")
    pairs_with = models.ManyToManyField("DishCategory")
    year = models.IntegerField()
    percent_of_alcohol = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], default=0.0
    )


class Brand(models.Model):
    name = models.CharField(max_length=255)


class Sweetness(models.Model):
    name = models.CharField(max_length=255)


class Taste(models.Model):
    name = models.CharField(max_length=255)


class DishCategory(models.Model):
    name = models.CharField(max_length=255)


class Country(models.Model):
    name = models.CharField(max_length=255)


class Comment(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    wine = models.ForeignKey(
        "Wine", on_delete=models.CASCADE, related_name="comments"
    )
    author = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="comments"
    )
    content = models.TextField()


class WineAdditionalInfo(models.Model):
    wine = models.ForeignKey("Wine", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.FloatField(MinValueValidator(0.0))
    url = models.URLField(max_length=255)
