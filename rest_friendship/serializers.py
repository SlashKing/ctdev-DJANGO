from __future__ import unicode_literals, print_function
from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from friendship.models import FriendshipRequest, Follow, Friend
from .utils import import_from_string
from larb.models import UserProfile
from cicu.models import UploadedFile, ProfilePicture
from secretballot.models import Vote

config = apps.get_app_config('rest_friendship')


class UploadedFileSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    ext = serializers.SerializerMethodField()

    def get_thumbnail_url(self, obj):
        return obj.get_thumbnail_picture_url()

    def get_file(self, obj):
        return obj.get_file_url()

    def get_ext(self,obj):
        return obj.extension

    class Meta:
        model = UploadedFile
        fields = ('id', 'file', 'ext', 'thumbnail_url',)


class ProfilePictureSerializer(UploadedFileSerializer):
    class Meta(UploadedFileSerializer.Meta):
        model = ProfilePicture
        fields = ('id', 'file', 'thumbnail_url', 'priority', 'active')


class UserProfileSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    swipe = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField(required=False)
    images = serializers.SerializerMethodField(required=False)

    class Meta:
        model = UserProfile
        fields = ('id',
                  'about_me',
                  'interested_in',
                  'cover_image_url',
                  'user_type',
                  'rel_status',
                  'gender',
                  'profile_image',
                  'distance',
                  'age',
                  'distance',
                  'is_private',
                  'date_of_birth',
                  'has_accepted_tos',
                  'content_type',
                  'images',
                  'swipe',
                  'location')

    def get_location(self,obj):
        return obj.lat_long

    def get_content_type(self, obj):
        return obj.content_type_id()

    def get_images(self, obj):
        return ProfilePictureSerializer(obj.images.filter(priority__gt=0), many=True).data

    def get_age(self, obj):
        return obj.age()

    def get_profile_image(self, obj):
        return obj.profile_image_url()

    def get_swipe(self, obj):
        """
            -check for other user's vote when we retrieve profile
            -return vote in the serializer data
            -we use this to update React state according to whether the user
                super liked or just liked the user.
        """
        if 'request' in self.context:
            from django.db.models import Q
            vote = Vote.objects.filter(Q(
                vote__gt=0,
                content_type_id=ContentType.objects.get_for_model(obj).id,
                object_id=self.context['request'].user.profile.id,
                token=obj.id))
            if len(vote) > 0:
                return vote[0].vote
        return 0

    def get_distance(self, obj):
        """
            Return distance from user
            slight adjustment must be made because Django
            provides a random useless measurement value.
            The adjustment is a ratio between the distance returned
            via the GeoDjango model distance query (which is pretty accurate)
            and the distance value returned between two points which is
            executed below in the distance parameter
            returned value is in kilometers(km)*
        """
        request_location = None
        if 'request' in self.context:
            if self.context['request'].user.profile.location is not None:
                request_location = self.context['request'].user.profile.location.wkt

        if request_location is not None and obj.location is not None:
            distance = UserProfile.objects.raw("select id, " +
                                               "round(CAST(ST_Distance_Sphere(ST_GeomFromText(" +
                                               "'" + request_location +
                                               "',4326), ST_GeomFromText('" +
                                               obj.location.wkt + "',4326))/1000 AS numeric),2)" +
                                               " AS distance_km from user_profile WHERE id=" +
                                               str(obj.pk) + ";")

            return int(distance[0].distance_km)

        return 0

    def get_cover_image_url(self, obj):
        """
            Return the URL for the user's Facebook icon if the user is logged in via Facebook,
            otherwise return the user's Gravatar URL
        """
        return obj.cover_image_url()


from rest_framework.validators import UniqueValidator


class CurrentUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        max_length=30,
        validators=[UniqueValidator(queryset=get_user_model().objects.all())]
    )
    profile = UserProfileSerializer()

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'notifications', 'profile',)


class UserSerializer(serializers.ModelSerializer):
    # rest framework doesn't carry over unique validators automatically
    username = serializers.CharField(
        max_length=30,
        validators=[UniqueValidator(queryset=get_user_model().objects.all())]
    )
    profile = serializers.SerializerMethodField()
    are_friends = serializers.SerializerMethodField()
    request_sent = serializers.SerializerMethodField()
    request_received = serializers.SerializerMethodField()
    request_rejected = serializers.SerializerMethodField()
    notifications_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    def get_profile(self, obj):
        if 'request' in self.context:
            return UserProfileSerializer(obj.profile, many=False, context=self.context).data
        else:
            return UserProfileSerializer(obj.profile, many=False, context={'profile': {obj}}).data

    def get_notifications_count(self, obj):
        if 'profile' in self.context:
            return self.context['profile']['user'].notifications.unread().count()
        if 'request' in self.context:
            if 'request_user' in self.context:
                return self.context['request_user'].notifications.unread().count()
            else:
                return self.context['request'].user.notifications.unread().count()
        return 0

    def get_is_following(self, obj):
        if 'request' in self.context:
            if 'request_user' in self.context:
                return Follow.objects.follows(self.context['request_user'], obj)
            else:
                return Follow.objects.follows(self.context['request'].user, obj)
        return False

    def get_are_friends(self, obj):
        if 'request' in self.context:
            if 'request_user' in self.context:
                return Friend.objects.are_friends(self.context['request_user'], obj)
            else:
                return Friend.objects.are_friends(self.context['request'].user, obj)
        else:
            return False

    def get_request_sent(self, obj):
        if 'request' in self.context:
            if 'request_user' in self.context:
                friend_r = True if FriendshipRequest.objects.filter(from_user=self.context['request_user'],
                                                                    to_user=obj) else False
            else:
                friend_r = True if FriendshipRequest.objects.filter(from_user=self.context['request'].user,
                                                                    to_user=obj) else False
        else:
            return False

        return friend_r

    def get_request_rejected(self, obj):
        if 'request' in self.context:
            if 'request_user' in self.context:
                friend_r = True if FriendshipRequest.objects.filter(from_user=self.context['request_user'], to_user=obj,
                                                                    rejected__isnull=False) else False
            else:
                friend_r = True if FriendshipRequest.objects.filter(from_user=self.context['request'].user, to_user=obj,
                                                                    rejected__isnull=False) else False
        else:
            return False
        return friend_r

    def get_request_received(self, obj):
        if 'request' in self.context:
            if 'request_user' in self.context:
                friend_r = True if FriendshipRequest.objects.filter(from_user=obj,
                                                                    to_user=self.context['request_user']) else False
            else:
                friend_r = True if FriendshipRequest.objects.filter(from_user=self.context['request'].user,
                                                                    to_user=obj, ) else False
        else:
            return False
        return friend_r

    class Meta:

        model = get_user_model()
        fields = (
        'id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'profile', 'are_friends', 'request_sent',
        'request_received', 'request_rejected', 'is_following', 'notifications_count')


class FriendSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'first_name', 'last_name', 'profile')


class ExtendedFriendSerializer(serializers.ModelSerializer):
    from_user = serializers.SerializerMethodField()
    to_user = serializers.SerializerMethodField()

    def get_from_user(self, obj):
        request = self.context['request']
        return UserSerializer(obj.from_user, context={'request': request}, many=False).data

    def get_to_user(self, obj):
        request = self.context['request']
        return UserSerializer(obj.from_user, context={'request': request}, many=False).data

    # to_user = UserSerializer()
    class Meta:
        model = Friend
        fields = ('id', 'to_user', 'from_user',)


class FriendshipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendshipRequest
        fields = ('id', 'from_user', 'to_user', 'message', 'created', 'rejected', 'viewed')


class FollowSerializer(serializers.ModelSerializer):
    followee = UserSerializer(
        many=False,
        read_only=True
    )
    follower = UserSerializer(
        many=False,
        read_only=True
    )

    class Meta:
        model = Follow
        fields = ('followee', 'follower', 'created')


def get_user_serializer():
    return import_from_string(config.user_serializer, 'USER_SERIALIZER')
