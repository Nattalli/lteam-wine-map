from django.contrib import admin
from .models import (
    User,
    Wine,
    Brand,
    Sweetness,
    Taste,
    DishCategory,
    Country,
    Comment,
    WineAdditionalInfo,
)

admin.site.register(User)
admin.site.register(Brand)
admin.site.register(Wine)
admin.site.register(Sweetness)
admin.site.register(Taste)
admin.site.register(DishCategory)
admin.site.register(Country)
admin.site.register(Comment)
admin.site.register(WineAdditionalInfo)
