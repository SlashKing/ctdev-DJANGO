from django.conf.urls import url
#from .views import FlagView
from .api import CreateFlag, RetrieveReason, FlagViewSet
from rest_framework.routers import DefaultRouter


#urlpatterns = patterns('',
#    url('^$', FlagView.as_view(), name='rest_flag'),
#)


# api url
urlpatterns =[
    url(r'^flag/create$', CreateFlag.as_view(), name='api_create_flag'),
    url(r'^flag/reason$', RetrieveReason.as_view(), name='api_retrieve_reason')
]
