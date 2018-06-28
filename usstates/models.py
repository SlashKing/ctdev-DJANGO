from django.contrib.gis.db import models

class UsStates(models.Model):
    state = models.CharField(max_length=2)
    name = models.CharField(max_length=24)
    fips = models.CharField(max_length=2)
    lon = models.FloatField()
    lat = models.FloatField()
    geom = models.MultiPolygonField(srid=4326)
    objects = models.GeoManager()
    
    # Returns the string representation of the model.
    def __str__(self):              # __unicode__ on Python 2
        return self.name
