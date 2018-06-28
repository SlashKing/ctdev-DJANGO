from django.conf.urls import url

from larb import views

urlpatterns = [
     url(r'^$', views.index, name='index'),
     url(r'^contact/$', views.contact, name='contact'),
     url(r'^terms/$', views.terms_of_use, name='terms'),
     #url(r'^post/(?P<post>\d+)/$', views.post_detail, name="post_detail"),
     #url(r'^post/remove/(?P<post>\d+)/$', views.post_remove, name="post_remove"),
     url(r"^profile/$", views.profile, name="profile"),
     url(r'^profile/(?P<username>\w+)/$', 
                       views.profile,
                       name='profile'),
     url(r'^(?:.*)/?/?/$', views.index),
     #url(r'^accounts/edit/$', 
     #                  views.edit_profile,
     #                  name='edit_profile'),  
     #url(r'^accounts/image/$', 
     #                  views.edit_profile_image,
     #                  name='edit_profile_image'),
     #url(r"^lat_long_ip/$", views.lat_long_ip, name="lat_long_ip"),                  
]