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
from wine_map.models import Wine
from wine_map.serializers import WineSerializer

WINE_LIST_URL = reverse("wines:wine-list")


class WineListApiViewTest(TestCase):
    def setUp(self) -> None:
        self.user = sample_user()
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_get_list_of_wines_when_there_is_no_wines(self) -> None:
        wines = Wine.objects.all()
        serializer = WineSerializer(wines, many=True)
        response = self.client.get(WINE_LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)
        self.assertEqual(response.data["results"], serializer.data)

    def test_get_list_of_wines_with_wines(self) -> None:
        self.country = sample_country()
        self.brand = sample_brand()
        sample_wine(country=self.country, brand=self.brand)
        sample_wine(name="New test wine", country=self.country, brand=self.brand)

        wines = Wine.objects.all()
        serializer = WineSerializer(wines, many=True)
        response = self.client.get(WINE_LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)
        self.assertEqual(response.data["results"], serializer.data)
