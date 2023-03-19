from django_filters import FilterSet, CharFilter, MultipleChoiceFilter
from django_filters.widgets import QueryArrayWidget

from wine_map.models import Wine


class WineFilter(FilterSet):
    brand = CharFilter("brand__name", "in", widget=QueryArrayWidget, max_length=255)
    country = CharFilter("country__name", "in", widget=QueryArrayWidget, max_length=255)
    wine_type = MultipleChoiceFilter(choices=Wine.WINE_TYPES)
    sweetness = MultipleChoiceFilter(choices=Wine.WINE_SWEETNESS)

    class Meta:
        model = Wine
        fields = ["brand", "wine_type", "sweetness", "country"]
