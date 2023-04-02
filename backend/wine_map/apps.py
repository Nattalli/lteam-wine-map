from django.apps import AppConfig


class WineMapConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "wine_map"

    def ready(self):
        from wine_map.wine_scheduler import updater
        updater.start()
