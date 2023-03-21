from dataclasses import dataclass

from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import WineFilter
from .models import Country, Brand, Wine, Comment
from .permissions import IsCommentAuthor
from .serializers import CategoriesSerializer, WineSerializer, CommentSerializer


class WinePagination(LimitOffsetPagination):
    default_limit = 12
    max_limit = 100


class WineListView(generics.ListAPIView):
    queryset = Wine.objects.select_related("country", "brand")
    serializer_class = WineSerializer
    pagination_class = WinePagination
    permission_classes = [AllowAny]
    filterset_class = WineFilter


class WineDetailView(generics.RetrieveAPIView):
    queryset = Wine.objects.select_related("country", "brand")
    serializer_class = WineSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class CategoriesView(APIView):
    @dataclass
    class Categories:
        countries: list[Country]
        brands: list[Brand]
        wine_types: list[str]
        sweetness: list[str]

    @extend_schema(request=None, responses=CategoriesSerializer)
    def get(self, request: Request) -> Response:
        """Returns a dict of categories"""
        categories = self.get_categories()
        serializer = CategoriesSerializer(categories)
        return Response(serializer.data)

    def get_categories(self) -> Categories:
        countries = Country.objects.all()
        brands = Brand.objects.all()
        wine_types = [wine_type for _, wine_type in Wine.WINE_TYPES]
        sweetness = [sweetness for _, sweetness in Wine.WINE_SWEETNESS]
        return self.Categories(countries, brands, wine_types, sweetness)


class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: CommentSerializer):
        wine_id = self.kwargs["wine_id"]
        wine = Wine.objects.get(id=wine_id)
        serializer.save(author=self.request.user, wine=wine)


class CommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        wine_id = self.kwargs["wine_id"]
        return Comment.objects.filter(wine_id=wine_id)


class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated, IsCommentAuthor]


class CommentUpdateView(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated, IsCommentAuthor]
