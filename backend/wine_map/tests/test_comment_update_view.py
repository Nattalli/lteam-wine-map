from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from config.sample_data_functions import (
    sample_user,
    sample_wine,
    sample_country,
    sample_brand,
    sample_comment,
)
from wine_map.models import Comment


def wine_update_comment_url(wine_id: int, comment_id: int) -> str:
    return reverse("wines:comment-update", args=[wine_id, comment_id])


class UnauthenticatedUpdateCommentViewSetTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()

    def test_auth_required(self) -> None:
        self.country = sample_country()
        self.brand = sample_brand()
        self.wine = sample_wine(country=self.country, brand=self.brand)
        self.comment = sample_comment(self.wine, sample_user())
        response = self.client.patch(
            wine_update_comment_url(self.wine.id, self.comment.id),
            data={"content": "Changed comment"},
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class NotAuthorUpdateCommentViewSetTests(TestCase):
    def setUp(self) -> None:
        self.user = sample_user()
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_auth_required(self) -> None:
        self.country = sample_country()
        self.brand = sample_brand()
        self.wine = sample_wine(country=self.country, brand=self.brand)
        self.comment = sample_comment(
            self.wine, sample_user(email="new_email@gmail.com", username="test_new")
        )
        response = self.client.post(
            wine_update_comment_url(self.wine.id, self.comment.id),
            data={"content": "Changed comment"},
        )

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class CommentUpdateApiViewTest(TestCase):
    def setUp(self) -> None:
        self.user = sample_user()
        self.country = sample_country()
        self.brand = sample_brand()
        self.wine = sample_wine(country=self.country, brand=self.brand)
        self.comment = sample_comment(self.wine, self.user)

        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_success_comment_update(self):
        response = self.client.patch(
            wine_update_comment_url(self.wine.id, self.comment.id),
            data={"content": "Changed comment"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            Comment.objects.get(id=self.comment.id).content, "Changed comment"
        )
