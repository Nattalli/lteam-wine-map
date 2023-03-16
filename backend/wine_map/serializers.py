from rest_framework import serializers

from .models import Wine, Brand, Country, Comment


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


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    wine = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = "__all__"