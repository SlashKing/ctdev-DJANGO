from django.contrib.gis.db.models import MultiPolygonField, FloatField, CharField, IntegerField, Model

class WorldBorder(Model):
    # Regular Django fields corresponding to the attributes in the
    # world borders shapefile.
    name = CharField(max_length=50)
    area = IntegerField()
    pop2005 = IntegerField('Population 2005')
    fips = CharField('FIPS Code', max_length=2)
    iso2 = CharField('2 Digit ISO', max_length=2)
    iso3 = CharField('3 Digit ISO', max_length=3)
    un = IntegerField('United Nations Code')
    region = IntegerField('Region Code')
    subregion = IntegerField('Sub-Region Code')
    lon = FloatField()
    lat = FloatField()

    # GeoDjango-specific: a geometry field (MultiPolygonField), and
    # overriding the default manager with a GeoManager instance.
    mpoly = MultiPolygonField()

    # Returns the string representation of the model.
    def __str__(self):              # __unicode__ on Python 2
        return self.name