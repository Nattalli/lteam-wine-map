import os


INSTALLED_APPS = [
    "wine_map.apps.WineMapConfig",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "corsheaders",
    "django_rest_passwordreset",
    "rest_framework",
    "rest_framework_simplejwt",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}

SECRET_KEY="dlkswjlmJNDHBSK"
