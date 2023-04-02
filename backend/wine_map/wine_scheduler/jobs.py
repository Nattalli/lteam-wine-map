from wine_map.models import Wine, WineOfTheDay


def wine_of_the_day_generator():
    wine = Wine.objects.order_by("?").first()
    if not WineOfTheDay.objects.all():
        WineOfTheDay.objects.create(wine=wine)
    else:
        WineOfTheDay.objects.all().update(wine=wine)
