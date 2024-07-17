from django.db import models

# Create your models here.
class OutlookFile(models.Model):
    id = models.CharField(max_length=100, primary_key=True, unique=True)
    path = models.CharField(max_length=100)