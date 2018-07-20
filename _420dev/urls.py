from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
import django.contrib.auth.views
from friendship import urls
from hashtags import urls
from picture_comments import urls
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from rest_friendship import urls
from api.views import UploadedFileViewSet, NotificationViewSet, UserProfileViewSet, UserViewSet, PostViewSet, \
    CommentViewSet, VoteViewSet, HashTagViewSet, HashTaggedItemViewSet
from chat.views import MessageViewSet, GroupMessageViewSet, GroupChatUserListView, RoomViewSet#, GroupRoomViewSet
from larb.views import FacebookLogin
from django.views.generic.base import RedirectView
from django.contrib.auth.views import PasswordResetConfirmView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

# Routers provide an easy way of automatically determining the URL conf.
router = DefaultRouter()
#router.register(r'g_rooms', GroupRoomViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'g_messages', GroupMessageViewSet)
router.register(r'uploaded_files', UploadedFileViewSet)
router.register(r'user_profiles', UserProfileViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'users', UserViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'hashtags', HashTagViewSet)
router.register(r'likes', VoteViewSet)
router.register(r'hashtagged_items', HashTaggedItemViewSet)
# import dal
# urlpatterns = patterns('',
# url(r'^chat/$', include('chat.urls')),
# )
admin.autodiscover()

urlpatterns = [
    url(r'^admin/login/', RedirectView.as_view(url=settings.LOGIN_URL, permanent=True, query_string=True)),
    url(r'^admin/', admin.site.urls),
    # Must place all urls before wagtail
    url(r'^feedback/', include('feedback_form.urls')),
    # url(r'^weed/find/', include('search.urls')),
    # url(r'^weed/autocomplete/', include('dal.urls')),
    # url(r'^weed/notifications/', include('notifications.urls')),
    # url(r'^weed/ajax-upload/', include('cicu.urls')),
    # url(r'^weed/likes/', include('likes.urls')),
    url(r'^accounts/logout/$', django.contrib.auth.views.logout, name='logout'),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^', include('friendship.urls')),
    # url(r'^weed/comments/', include('picture_comments.urls')),
    # url(r'^weed/hashtags/', include('hashtags.urls')),
    url(r'^api/', include(router.urls)),
    url(r'^api/groupchatusers', GroupChatUserListView.as_view(),name='groupchatuser-serializer'),
    url(r'^rest/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/', include('rest_friendship.urls')),
    url(r'^api/', include('rest_flag.urls')),
    url(r'^rest-auth/reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/facebook/$', FacebookLogin.as_view(), name='fb_login'),
    url(r'^obtain-auth-token/$', obtain_auth_token),
    url(r'^auth-jwt/', obtain_jwt_token),
    url(r'^auth-jwt-refresh/', refresh_jwt_token),
    url(r'^auth-jwt-verify/', verify_jwt_token),
    url(r'^', include('larb.urls')),
    #### IMPORTANT!!! needs to be last, catch all used to send all other requests to React
]
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.contrib.staticfiles import views

if settings.DEBUG:
    urlpatterns += [
        url(r'^static/(?P<path>.*)$', views.serve),
    ]
