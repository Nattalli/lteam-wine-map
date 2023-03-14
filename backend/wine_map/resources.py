from import_export import resources

from .models import Wine


class WineResource(resources.ModelResource):
    class Meta:
        model = Wine
        skip_unchanged = True
        report_skipped = False
        fields = (
            "name",
            "wine_type",
            "country",
            "sweetness",
            "tastes",
            "pairs_with",
            "brand",
            "percent_of_alcohol",
            "region",
        )
