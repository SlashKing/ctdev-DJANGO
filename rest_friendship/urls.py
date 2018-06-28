# -*- coding: utf-8 -*-
from __future__ import unicode_literals


from .views import FriendViewSet, FriendshipRequestViewSet, FollowViewSet

from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'friends', FriendViewSet, base_name='friends')
router.register(r'friendrequests', FriendshipRequestViewSet, base_name='friendrequests')
router.register(r'follows', FollowViewSet, base_name='follows')
urlpatterns = router.urls
