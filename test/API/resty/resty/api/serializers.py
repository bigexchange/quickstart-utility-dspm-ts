from rest_framework import serializers
from api.models import OutlookFile

class OutlookFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutlookFile
        fields = ['id', 'path']