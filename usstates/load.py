import os
from django.contrib.gis.utils import LayerMapping
from .models import UsStates

usstates_mapping = {
    'state' : 'STATE',
    'name' : 'NAME',
    'fips' : 'FIPS',
    'lon' : 'LON',
    'lat' : 'LAT',
    'geom' : 'MULTIPOLYGON',
}
print(os.path.abspath(os.path.join(os.path.dirname(__file__), 'data/s_16de14.shp')))
usstates_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data/s_16de14.shp'))
def __init__():
    run()
def run(verbose=True):
    lm = LayerMapping(UsStates, usstates_shp, usstates_mapping,
                      transform=False, encoding='iso-8859-1')

    lm.save(strict=True, verbose=verbose)