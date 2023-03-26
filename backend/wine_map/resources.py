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

    @staticmethod
    def ensure_country_created(row: OrderedDict) -> None:
        country_name = row["country"].strip()
        if not country_name:
            country = None
        else:
            country, _ = Country.objects.get_or_create(name=country_name)
            country = country.id
        row["country"] = country

    @staticmethod
    def ensure_brand_created(row: OrderedDict) -> None:
        brand_name = row["brand"].strip()
        if not brand_name:
            brand = None
        else:
            brand, _ = Brand.objects.get_or_create(name=brand_name)
            brand = brand.id
        row["brand"] = brand
