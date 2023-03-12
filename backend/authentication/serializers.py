from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("email", "password", "first_name", "last_name")
        extra_kwargs = {
            "email": {"required": True},
            "password": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True}
        }

    def create(self, validated_data: dict) -> get_user_model():
        user = User.objects.create(
            username=validated_data["email"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("email", "first_name", "last_name")
