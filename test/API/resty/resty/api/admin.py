from django.contrib import admin
from api.models import OutlookFile


@admin.register(OutlookFile)
class OutlookFileAdmin(admin.ModelAdmin):
    fields = ['id', 'path']