from rest_framework.request import Request
from rest_framework.permissions import BasePermission
from rest_framework.viewsets import ViewSet

from .models import Comment


class IsCommentAuthor(BasePermission):
    def has_object_permission(
        self, request: Request, view: ViewSet, obj: Comment
    ) -> bool:
        return obj.author == request.user
