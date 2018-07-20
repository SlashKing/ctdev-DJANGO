from django.contrib.gis.db.models import FloatField, CharField, MultiPolygonField, Model

class UsStates(Model):
    state = CharField(max_length=2)
    name = CharField(max_length=24)
    fips = CharField(max_length=2)
    lon = FloatField()
    lat = FloatField()
    geom = MultiPolygonField(srid=4326)
    
    # Returns the string representation of the model.
    def __str__(self):              # __unicode__ on Python 2
        return self.name
