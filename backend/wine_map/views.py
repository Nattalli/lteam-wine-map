from rest_framework import generics
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated

from .models import Wine, Comment
from .permissions import IsCommentAuthor
from .serializers import WineSerializer, CommentSerializer


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