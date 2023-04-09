from rest_framework import serializers

from .models import Wine, Brand, Country, Comment, QuizQuestion, QuizAnswer


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
    wine_types = serializers.ListField(child=serializers.CharField(max_length=127))
    sweetness = serializers.ListField(child=serializers.CharField(max_length=127))


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    wine = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = "__all__"


class WineInShopSerializer(serializers.Serializer):
    shop_name = serializers.CharField()
    min_price = serializers.FloatField()
    max_price = serializers.FloatField()
    url = serializers.URLField()


class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAnswer
        fields = ["id", "text", "next_question", "results"]


class QuizQuestionSerializer(serializers.ModelSerializer):
    answers = QuizAnswerSerializer(many=True)

    class Meta:
        model = QuizQuestion
        fields = ["id", "text", "answers"]
