from django.urls import path, include

from .views import (
    WineListView,
    WineDetailView,
    CategoriesView,
    CommentCreateView,
    CommentListView,
    CommentDeleteView,
    CommentUpdateView,
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
    path("questions/<int:pk>", QuizQuestionView.as_view(), name="quiz-question")
]

urlpatterns = [
    path("", WineListView.as_view(), name="wine-list"),
    path("<int:id>/", WineDetailView.as_view(), name="wine-detail"),
    path("categories/", CategoriesView.as_view(), name="categories"),
    path("<int:wine_id>/comments/", include(comments)),
    path("<int:wine_id>/prices/", WineInShopsView.as_view(), name="wine-prices"),
    path("quiz/", include(quiz))
]

app_name = "wines"
