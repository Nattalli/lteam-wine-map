from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from config.sample_data_functions import (
    sample_user,
    sample_wine,
    sample_country,
    sample_brand,
)
from wine_map.models import Comment


def wine_comments_create_page_url(wine_id: int) -> str:
    return reverse("wines:comment-create", args=[wine_id])


class UnauthenticatedCommentCreationViewSetTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()

    def test_auth_required(self) -> None:
        self.country = sample_country()
        self.brand = sample_brand()
        self.wine = sample_wine(country=self.country, brand=self.brand)
        response = self.client.post(
            wine_comments_create_page_url(self.wine.id), data={"content": "New comment"}
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentCreateApiViewTest(TestCase):
    def setUp(self) -> None:
        self.user = sample_user()
        self.country = sample_country()
        self.brand = sample_brand()
        self.wine = sample_wine(country=self.country, brand=self.brand)

        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_success_comment_creation(self):
        response = self.client.post(
            wine_comments_create_page_url(self.wine.id), data={"content": "New comment"}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)

    def test_success_comments_creation(self):
        response = self.client.post(
            wine_comments_create_page_url(self.wine.id), data={"content": "New comment"}
        )
        response_second = self.client.post(
            wine_comments_create_page_url(self.wine.id),
            data={"content": "One more comment"},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_second.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)
