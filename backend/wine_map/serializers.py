from rest_framework import serializers
from .models import Wine, Brand, Country, Sweetness, Taste, DishCategory


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["name"]


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["name"]


class SweetnessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sweetness
        fields = ["name"]


class TasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Taste
        fields = ["name"]


class DishCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DishCategory
        fields = ["name"]


class WineSerializer(serializers.ModelSerializer):
    brand = BrandSerializer()
    country = CountrySerializer()
    sweetness = SweetnessSerializer(many=True)
    tastes = TasteSerializer(many=True)
    pairs_with = DishCategorySerializer(many=True)

    class Meta:
        model = Wine
        fields = "__all__"
