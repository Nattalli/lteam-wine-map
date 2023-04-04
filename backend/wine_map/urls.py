from django.urls import path, include

from .views import (
    WineListView,
    WineDetailView,
    CategoriesView,
    CommentCreateView,
    CommentListView,
    CommentDeleteView,
    CommentUpdateView,
    FavouriteWinesUpdateView,
    FavouriteWinesClearView,
    FavouriteWines,
    WineInShopsView,
    QuizQuestionView,
    QuizStartView,
)

comments = [
    path("", CommentListView.as_view(), name="comment-list"),
    path("create/", CommentCreateView.as_view(), name="comment-create"),
    path("delete/<int:id>/", CommentDeleteView.as_view(), name="comment-delete"),
    path("update/<int:id>/", CommentUpdateView.as_view(), name="comment-update"),
]

quiz = [
    path("start/", QuizStartView.as_view(), name="quiz-start"),
    path("questions/<int:pk>/", QuizQuestionView.as_view(), name="quiz-question")
]

favourites = [
    path("<int:wine_id>/", FavouriteWinesUpdateView.as_view(),
         name="update_favourites"),
    path("clear/", FavouriteWinesClearView.as_view(), name="clear_favourites"),
    path("", FavouriteWines.as_view(), name="retrieve_wines")
]

urlpatterns = [
    path("", WineListView.as_view(), name="wine-list"),
    path("<int:id>/", WineDetailView.as_view(), name="wine-detail"),
    path("favourites/", include(favourites)),
    path("categories/", CategoriesView.as_view(), name="categories"),
    path("<int:wine_id>/comments/", include(comments)),
    path("<int:wine_id>/prices/", WineInShopsView.as_view(), name="wine-prices"),
    path("quiz/", include(quiz))
]

app_name = "wines"
