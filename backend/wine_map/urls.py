from django.urls import path

from .views import WineListView, WineDetailView, CategoriesView

urlpatterns = [
    path("", WineListView.as_view(), name="wine-list"),
    path("<int:id>/", WineDetailView.as_view(), name="wine-detail"),
    path("categories/", CategoriesView.as_view(), name="categories")
]

app_name = "webhooks"
