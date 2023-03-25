from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import gettext as _
from import_export.admin import ImportExportModelAdmin

from .models import (
    Wine,
    Brand,
    Country,
    Comment,
    WineAdditionalInfo,
)
from .resources import WineResource


@admin.register(Wine)
class ProductUserAdmin(ImportExportModelAdmin):
    resource_class = WineResource


admin.site.register(Brand)
admin.site.register(Country)
admin.site.register(Comment)
admin.site.register(WineAdditionalInfo)
