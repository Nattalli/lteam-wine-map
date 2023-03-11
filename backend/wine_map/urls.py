from django.urls import path
from .views import WineList, WineDetail


urlpatterns = [
    path("wine/", WineList.as_view(), name="wine-list"),
    path("wine/<int:pk>/", WineDetail.as_view(), name="wine-detail"),
]

app_name = "webhooks"
