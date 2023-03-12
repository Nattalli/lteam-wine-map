from rest_framework.permissions import AllowAny
from .serializers import SignUpSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.contrib.auth import get_user_model
from rest_framework.request import Request
from rest_framework.response import Response
from typing import Any
from rest_framework_simplejwt.tokens import AccessToken


class SignUpUserAPIView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer


class UserDetailsAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request: Request, *args: dict[str, Any],
                 **kwargs: dict[str, Any]) -> Response:
        token = request.headers["Authorization"][7:]
        access_token_obj = AccessToken(token)
        user_id = access_token_obj["user_id"]
        user = get_user_model().objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)
