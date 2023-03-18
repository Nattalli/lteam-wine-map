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
from wine_map.serializers import WineSerializer


def wine_detail_page_url(wine_id: int) -> str:
    return reverse("wines:wine-detail", args=[wine_id])


class WineListApiViewTest(TestCase):
    def setUp(self) -> None:
        self.user = sample_user()

        self.country = sample_country()
        self.brand = sample_brand()
        self.wine = sample_wine(country=self.country, brand=self.brand)

        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_get_existed_wine_detailed_page(self) -> None:
        serializer = WineSerializer(self.wine, many=False)
        response = self.client.get(wine_detail_page_url(self.wine.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_non_existed_wine_detailed_page(self) -> None:
        response = self.client.get(wine_detail_page_url(3))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
