from dataclasses import dataclass

from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.request import Request
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Wine, Country, Brand
from .serializers import WineSerializer, CategoriesSerializer


class WinePagination(LimitOffsetPagination):
    default_limit = 12
    max_limit = 100


class WineListView(generics.ListAPIView):
    queryset = Wine.objects.select_related("country", "brand")
    serializer_class = WineSerializer
    pagination_class = WinePagination


class WineDetailView(generics.RetrieveAPIView):
    queryset = Wine.objects.select_related("country", "brand")
    serializer_class = WineSerializer
    lookup_field = "id"


class CategoriesView(APIView):
    @dataclass
    class Categories:
        countries: list[Country]
        brands: list[Brand]

    @extend_schema(request=None, responses=CategoriesSerializer)
    def get(self, request: Request) -> Response:
        """Returns a dict of categories"""
        categories = self.get_categories()
        serializer = CategoriesSerializer(categories)
        return Response(serializer.data)

    def get_categories(self) -> Categories:
        countries = Country.objects.all()
        brands = Brand.objects.all()
        return self.Categories(countries, brands)
