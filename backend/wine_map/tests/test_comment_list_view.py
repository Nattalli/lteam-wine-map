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
from wine_map.serializers import CommentSerializer


def wine_comments_list_page_url(wine_id: int) -> str:
    return reverse("wines:comment-list", args=[wine_id])


class CommentsListApiViewTest(TestCase):
    def setUp(self) -> None:
        self.user = sample_user()
        self.country = sample_country()
        self.brand = sample_brand()
        self.wine = sample_wine(country=self.country, brand=self.brand)

        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_get_list_of_comments_when_there_is_no_comments(self) -> None:
        comments = Comment.objects.filter(wine_id=self.wine.id)
        serializer = CommentSerializer(comments, many=True)
        response = self.client.get(wine_comments_list_page_url(self.wine.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_list_of_comments(self) -> None:
        sample_comment(self.wine, self.user)
        sample_comment(self.wine, self.user)

        comments = Comment.objects.order_by("-timestamp")
        serializer = CommentSerializer(comments, many=True)
        response = self.client.get(wine_comments_list_page_url(self.wine.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
