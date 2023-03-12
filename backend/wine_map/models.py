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

    def __str__(self) -> str:
        return self.username


class Wine(models.Model):
    WINE_TYPES = [
        ("red", "Червоне"),
        ("white", "Біле"),
        ("rose", "Рожеве"),
    ]
    WINE_SWEETNESS = [
        ("brut", "брют"),
        ("semi-sweet", "напівсолодке"),
        ("semi-dry", "напівсухе"),
        ("sweet", "солодке"),
        ("dry", "сухе")
    ]

    name = models.CharField(max_length=255)
    brand = models.ForeignKey("Brand", on_delete=models.CASCADE, related_name="brand")
    wine_type = models.CharField(choices=WINE_TYPES, max_length=5, null=True, blank=True)
    country = models.ForeignKey("Country", on_delete=models.CASCADE, null=True, blank=True)
    sweetness = models.CharField(max_length=10, choices=WINE_SWEETNESS, null=True, blank=True)
    tastes = models.CharField(max_length=512, null=True, blank=True)
    pairs_with = models.CharField(max_length=512, null=True, blank=True)
    percent_of_alcohol = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
                                           default=0.0, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name}"


class Brand(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class Country(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class Comment(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    wine = models.ForeignKey("Wine", on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="comments"
    )
    content = models.TextField()

    def __str__(self) -> str:
        return f"{self.author} on {self.wine}"


class WineAdditionalInfo(models.Model):
    wine = models.ForeignKey("Wine", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.FloatField(MinValueValidator(0.0))
    url = models.URLField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name} for {self.wine}"
