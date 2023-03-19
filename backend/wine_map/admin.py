from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import gettext as _
from import_export.admin import ImportExportModelAdmin

from .models import (
    User,
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


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Define admin model for custom User model with no email field."""

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    list_display = ("email", "first_name", "last_name", "is_staff")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)
