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


class QuizAnswerInline(admin.TabularInline):
    fk_name = "for_question"
    model = QuizAnswer
    extra = 0


class QuizQuestionAdmin(admin.ModelAdmin):
    inlines = [
        QuizAnswerInline,
    ]


admin.site.register(Brand)
admin.site.register(Country)
admin.site.register(Comment)
admin.site.register(WineAdditionalInfo)
admin.site.register(QuizQuestion, QuizQuestionAdmin)
admin.site.register(QuizAnswer)
