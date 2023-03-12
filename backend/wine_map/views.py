from rest_framework import generics
from rest_framework.pagination import LimitOffsetPagination

from .models import Wine
from .serializers import WineSerializer


class WinePagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100


class WineListView(generics.ListAPIView):
    queryset = (Wine.objects
                .select_related("country", "brand")
                .prefetch_related("sweetness", "tastes", "pairs_with"))
    serializer_class = WineSerializer
    pagination_class = WinePagination


class WineDetailView(generics.RetrieveAPIView):
    queryset = (Wine.objects
                .select_related("country", "brand")
                .prefetch_related("sweetness", "tastes", "pairs_with"))
    serializer_class = WineSerializer
    lookup_field = "id"
