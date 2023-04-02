from urllib.request import Request

from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import SignUpSerializer, ChangePasswordSerializer


class SignUpUserAPIView(CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """

    serializer_class = ChangePasswordSerializer
    model = get_user_model()
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset: QuerySet = None) -> get_user_model():
        return self.request.user

    def update(self, request: Request, *args: tuple, **kwargs) -> Response:
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            first_password = serializer.data.get("first_password")
            second_password = serializer.data.get("second_password")
            if first_password == second_password:
                self.object.set_password(first_password)
                self.object.save()

                return Response(status=status.HTTP_200_OK)
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Passwords should be equal."},
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
