from typing import OrderedDict

from import_export import resources
from import_export.results import RowResult

from .models import Wine, Brand, Country


class WineResource(resources.ModelResource):
    class Meta:
        model = Wine
        skip_unchanged = True
        report_skipped = False
        import_id_fields = ("name", "brand")
        fields = (
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
        use_bulk = True

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.processed = set()
        self.country_cache = {}
        self.brand_cache = {}

    def before_import_row(self, row: OrderedDict, **kwargs: dict) -> None:
        self.ensure_country_created(row)
        self.ensure_brand_created(row)

    def after_import_row(self, row: OrderedDict, row_result: RowResult,
                         row_number: int = None, **kwargs) -> None:
        self.processed.add((row["name"], row["brand"]))

    def skip_row(self, instance: Wine, original: Wine, row: OrderedDict,
                 import_validation_errors: bool = None) -> bool:
        if not instance.name.strip():
            return True
        if (instance.name, instance.brand_id) in self.processed:
            return True
        return super().skip_row(instance, original, row, import_validation_errors)

    def ensure_country_created(self, row: OrderedDict) -> None:
        country_name = row["country"].strip()
        if not country_name:
            row["country"] = None
            return
        if country_name not in self.country_cache:
            country, _ = Country.objects.get_or_create(name=country_name)
            self.country_cache[country_name] = country.id
        row["country"] = self.country_cache[country_name]

    def ensure_brand_created(self, row: OrderedDict) -> None:
        brand_name = row["brand"].strip()
        if not brand_name:
            row["brand"] = None
            return
        if brand_name not in self.brand_cache:
            brand, _ = Brand.objects.get_or_create(name=brand_name)
            self.brand_cache[brand_name] = brand.id
        row["brand"] = self.brand_cache[brand_name]
