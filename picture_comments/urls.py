from django.conf.urls import url, include
from picture_comments import views
urlpatterns = [
    url(r'^post/ajax/$', views.post_comment_ajax, name='comments-post-comment-ajax'),
    url(r'', include('django_comments.urls')),
]