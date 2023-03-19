from rest_framework import serializers

from .models import Wine, Brand, Country


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["name"]


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["name"]


class WineSerializer(serializers.ModelSerializer):
    brand = BrandSerializer()
    country = CountrySerializer()

    class Meta:
        model = Wine
        fields = "__all__"


class CategoriesSerializer(serializers.Serializer):
    countries = CountrySerializer(many=True)
    brands = BrandSerializer(many=True)
