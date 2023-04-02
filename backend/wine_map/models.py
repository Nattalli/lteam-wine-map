from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Wine(models.Model):
    WINE_TYPES = [
        ("червоне", "червоне"),
        ("біле", "біле"),
        ("рожеве", "рожеве"),
    ]
    WINE_SWEETNESS = [
        ("брют", "брют"),
        ("напівсолодке", "напівсолодке"),
        ("напівсухе", "напівсухе"),
        ("солодке", "солодке"),
        ("сухе", "сухе"),
    ]

    name = models.CharField(max_length=255)
    brand = models.ForeignKey(
        "Brand", on_delete=models.CASCADE, related_name="brand", null=True, blank=True
    )
    wine_type = models.CharField(
        choices=WINE_TYPES, max_length=127, null=True, blank=True
    )
    country = models.ForeignKey(
        "Country", on_delete=models.CASCADE, null=True, blank=True
    )
    sweetness = models.CharField(
        max_length=127, choices=WINE_SWEETNESS, null=True, blank=True
    )
    tastes = models.CharField(max_length=1027, null=True, blank=True)
    pairs_with = models.CharField(max_length=1027, null=True, blank=True)
    percent_of_alcohol = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        default=0.0,
        null=True,
        blank=True,
    )
    region = models.CharField(max_length=255, null=True, blank=True)
    image_url = models.URLField(max_length=255)
    in_favourites_of = models.ManyToManyField(
        get_user_model(), related_name="favourite_wines"
    )

    def __str__(self) -> str:
        return f"{self.name}"


class Brand(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class Country(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name_plural = "Countries"

    def __str__(self) -> str:
        return self.name


class Comment(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    wine = models.ForeignKey("Wine", on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="comments"
    )
    content = models.TextField()

    def __str__(self) -> str:
        return f"{self.author} on {self.wine}"


class WineAdditionalInfo(models.Model):
    wine = models.ForeignKey("Wine", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.FloatField(MinValueValidator(0.0))
    url = models.URLField(max_length=255)

    class Meta:
        verbose_name_plural = "Wine additional info"

    def __str__(self) -> str:
        return f"{self.name} for {self.wine}"


class QuizQuestion(models.Model):
    text = models.TextField(null=False, blank=False)
    first = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["first"],
                condition=models.Q(first=True),
                name="unique_first_question"
            ),
        ]

    def __str__(self):
        return self.text


class QuizAnswer(models.Model):
    text = models.TextField(null=False, blank=False)
    for_question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE,
                                     null=False, blank=True, related_name="answers")
    next_question = models.ForeignKey(QuizQuestion, on_delete=models.SET_NULL,
                                      related_name="parent_answers", null=True,
                                      blank=True)
    results = models.ManyToManyField(Wine, blank=True)

    def __str__(self):
        return f'"{self.text}" for "{self.for_question}"'
