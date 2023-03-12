from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from authentication.views import SignUpUserAPIView, UserDetailsAPIView


urlpatterns = [
    path("sign-up/", SignUpUserAPIView.as_view(), name="sign_up_user"),
    path("log-in/", TokenObtainPairView.as_view(), name="log_in_user"),
    path("user/", UserDetailsAPIView.as_view(), name="user_details"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]
