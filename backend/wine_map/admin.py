from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import (
    Wine,
    Brand,
    Country,
    Comment,
    WineAdditionalInfo,
    QuizQuestion,
    QuizAnswer,
)
from .resources import WineResource


@admin.register(Wine)
class ProductUserAdmin(ImportExportModelAdmin):
    resource_class = WineResource


admin.site.register(Brand)
admin.site.register(Country)
admin.site.register(Comment)
admin.site.register(WineAdditionalInfo)
admin.site.register(QuizQuestion)
admin.site.register(QuizAnswer)
