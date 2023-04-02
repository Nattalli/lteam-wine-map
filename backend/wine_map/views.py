from dataclasses import dataclass

from drf_spectacular.utils import extend_schema
from rest_framework import generics, exceptions, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from . import parsers
from .filters import WineFilter
from .models import Country, Brand, Wine, Comment
from .permissions import IsCommentAuthor
from .serializers import (
    CategoriesSerializer,
    WineSerializer,
    CommentSerializer,
    WineInShopSerializer,
)


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
        return Comment.objects.filter(wine_id=wine_id).order_by("-timestamp")


class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated, IsCommentAuthor]


class CommentUpdateView(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated, IsCommentAuthor]


class FavouriteWinesUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def update(self, request: Request, *args: tuple, **kwargs: dict) -> Response:
        wine = get_object_or_404(Wine, pk=self.kwargs["wine_id"])
        user = request.user
        if user.favourite_wines.contains(wine):
            user.favourite_wines.remove(wine)
        else:
            user.favourite_wines.add(wine)
        serializer = WineSerializer(wine)

        return Response(serializer.data)


class FavouriteWinesClearView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def update(self, request: Request, *args: tuple, **kwargs: dict) -> Response:
        request.user.favourite_wines.clear()

        return Response()


class FavouriteWines(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, *args: tuple, **kwargs: dict) -> Response:
        user_id = request.user.id
        wines = Wine.objects.filter(in_favourites_of__id=user_id)
        serializer = WineSerializer(wines, many=True)

        return Response(serializer.data)


class WineInShopsView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        responses={
            status.HTTP_200_OK: WineInShopSerializer(many=True),
            status.HTTP_404_NOT_FOUND: None,
        }
    )
    def get(self, request: Request, wine_id: int) -> Response:
        try:
            wine = Wine.objects.get(pk=wine_id)
        except Wine.DoesNotExist:
            raise exceptions.NotFound(detail="Wine dose not exist")
        parsed_shops = parsers.parse_all(wine.name)
        serializer = WineInShopSerializer(parsed_shops, many=True)
        return Response(serializer.data)
