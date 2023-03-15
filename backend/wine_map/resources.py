from typing import OrderedDict

from import_export import resources

from .models import Wine, Brand, Country


class WineResource(resources.ModelResource):
    class Meta:
        model = Wine
        skip_unchanged = True
        report_skipped = False
        import_id_fields = ("name",)
        fields = (
            "id",
            "name",
            "image_url",
            "wine_type",
            "country",
            "sweetness",
            "tastes",
            "pairs_with",
            "brand",
            "percent_of_alcohol",
            "region",
        )

    def before_import_row(self, row: OrderedDict, **kwargs: dict) -> None:
        row["country"] = (
            Country.objects.get_or_create(name=row["country"])[0].id
            if row["country"]
            else None
        )
        row["brand"] = (
            Brand.objects.get_or_create(name=row["brand"])[0].id
            if row["country"]
            else None
        )
