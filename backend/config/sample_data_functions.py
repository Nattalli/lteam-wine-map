from django.contrib.auth import get_user_model
from wine_map.models import Wine, Country, Brand, Comment


def sample_user(**params) -> get_user_model():
    defaults = {
        "first_name": "first_name",
        "last_name": "last_name",
        "username": "username",
        "email": "test@test.com",
        "password": "testpassword123",
        "is_active": True,
    }
    defaults.update(params)

    return get_user_model().objects.create_user(**defaults)


def sample_wine(brand: Brand, country: Country, **params) -> Wine:
    defaults = {
        "name": "Test wine",
        "wine_type": "red",
        "sweetness": "sweet",
        "image_url": "https://test-image.com",
    }
    defaults.update(params)

    return Wine.objects.create(country=country, brand=brand, **defaults)


def sample_country(**params) -> Country:
    defaults = {"name": "Ukraine"}
    defaults.update(params)

    return Country.objects.create(**defaults)


def sample_brand(**params) -> Brand:
    defaults = {"name": "Test brand name"}
    defaults.update(params)

    return Brand.objects.create(**defaults)


def sample_comment(wine: Wine, author: get_user_model(), **params) -> Comment:
    defaults = {"content": "Test comment"}
    defaults.update(params)

    return Comment.objects.create(wine=wine, author=author, **defaults)
