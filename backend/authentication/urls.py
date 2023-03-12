from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from authentication.views import SignUpUserAPIView


urlpatterns = [
    path("sign-up/", SignUpUserAPIView.as_view(), name="sign_up_user"),
    path("log-in/", TokenObtainPairView.as_view(), name="log_in_user"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
