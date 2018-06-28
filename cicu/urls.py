from django.conf.urls import url
from .views import upload, crop

urlpatterns = [
    url(r'^$', upload, name='ajax-upload'),
    url(r'^crop/$', crop, name='cicu-crop'),
]
