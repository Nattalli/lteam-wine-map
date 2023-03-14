from rest_framework.permissions import AllowAny
from .serializers import SignUpSerializer
from rest_framework import generics


class SignUpUserAPIView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer

