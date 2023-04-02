from authentication.views import SignUpUserAPIView, ChangePasswordView
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("sign-up/", SignUpUserAPIView.as_view(), name="sign_up_user"),
    path("log-in/", TokenObtainPairView.as_view(), name="log_in_user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]

app_name = "authentication"
