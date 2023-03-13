from django.urls import path
from .views import WineListView, WineDetailView


urlpatterns = [
    path("", WineListView.as_view(), name="wine-list"),
    path("<int:id>/", WineDetailView.as_view(), name="wine_detail"),
]

app_name = "webhooks"
