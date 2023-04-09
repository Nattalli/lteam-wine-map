from django_filters import (
    FilterSet,
    MultipleChoiceFilter,
    ModelMultipleChoiceFilter,
)

from wine_map.models import Wine, Brand, Country


class WineFilter(FilterSet):
    brand = ModelMultipleChoiceFilter(
        queryset=Brand.objects,
        field_name="brand__name",
        to_field_name="name",
    )
    country = ModelMultipleChoiceFilter(
        queryset=Country.objects,
        field_name="country__name",
        to_field_name="name",
    )
    wine_type = MultipleChoiceFilter(choices=Wine.WINE_TYPES)
    sweetness = MultipleChoiceFilter(choices=Wine.WINE_SWEETNESS)

    class Meta:
        model = Wine
        fields = ["brand", "wine_type", "sweetness", "country"]
