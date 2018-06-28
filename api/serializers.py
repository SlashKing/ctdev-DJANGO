from larb.models import *
from picture_comments.models import PictureComment
from hashtags.models import *
from friendship.models import *
from secretballot.models import *
from likes.utils import can_vote
from notifications.models import Notification
from larb.utils import timesince_threshold
from rest_framework import routers, serializers
from rest_friendship.serializers import UserSerializer, UploadedFileSerializer
from django.contrib.auth import get_user_model
from picture_comments.forms import PictureCommentForm


class TaggedObjectRelatedField(serializers.RelatedField):
    """

    A custom field to use for the `tagged_object` generic relationship.

    """

    def to_representation(self, value):
        """
        Serialize tagged objects to a simple textual representation.
        """
        if isinstance(value.content_object, Post):
            serializer = PostSerializer(value.content_object)
        elif isinstance(value.content_object, PictureComment):
            serializer = serializers.CommentSerializer(many=True)
        else:
            raise Exception('Unexpected type of tagged object')
        return serializer.data


class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = ('__all__')


class CommentSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        super(CommentSerializer, self).__init__(*args, **kwargs)

    content_type = serializers.SerializerMethodField()
    this_content_type = serializers.SerializerMethodField()
    content_object_image = serializers.ReadOnlyField(source="content_object.picture.get_thumbnail_picture_url")
    user = UserSerializer(required=False)
    timesince_threshold = serializers.SerializerMethodField()
    can_vote = serializers.SerializerMethodField()
    picture = UploadedFileSerializer(required=False)
    security_data = serializers.SerializerMethodField()

    def get_content_type(self, obj):
        ct = None
        if obj.content_object is not None:
            ct = ContentType.objects.get_for_model(obj.content_object)
        return ContentTypeSerializer(ct).data

    def get_this_content_type(self, obj):
        ct = ContentType.objects.get_for_model(PictureComment)
        return ContentTypeSerializer(ct).data

    def get_security_data(self, obj):
        form = PictureCommentForm(obj)
        data = form.generate_security_data()
        return data['security_hash'] + '|' + data['timestamp']

    def get_can_vote(self, obj):
        request = self.context['request']
        return can_vote(obj, request.user, request)

    def get_timesince_threshold(self, obj):
        return timesince_threshold(obj.submit_date)

    class Meta:
        model = PictureComment
        fields = (
        'id', 'object_pk', 'content_type', 'content_object_image', 'this_content_type', 'comment', 'security_data',
        'vote_total', 'user', 'timesince_threshold', 'can_vote', 'picture')


from rest_auth.serializers import UserDetailsSerializer


class LocationSerializer(UserDetailsSerializer):
    location = serializers.CharField(source="userprofile.location")

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('location',)

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('userprofile', {})
        location = profile_data.get('location')
        instance = super(UserSerializer, self).update(instance, validated_data)

        ### get location from string ###
        ### used when sent from mobile ###

        from django.contrib.gis.geos import fromstr

        ### update user's location ###
        ### !IMPORTANT! ###

        profile = instance.userprofile
        if profile_data and location:
            profile.location = fromstr(location)
            profile.save()
        return instance


class SimplePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('__all__')


class PostSerializer(serializers.ModelSerializer):
    this_content_type = serializers.SerializerMethodField()
    content_type_name = serializers.SerializerMethodField()
    content_type_app_label = serializers.SerializerMethodField()
    timesince_post = serializers.SerializerMethodField()
    user = UserSerializer(required=False)
    pictures = UploadedFileSerializer(required=False, many=True)
    comments_set = CommentSerializer(many=True, read_only=True)
    can_vote = serializers.SerializerMethodField()
    security_data = serializers.SerializerMethodField()

    def get_this_content_type(self, obj):
        ct = None
        ct = ContentType.objects.get_for_model(Post)
        return ContentTypeSerializer(ct).data

    def get_security_data(self, obj):
        form = PictureCommentForm(obj)
        data = form.generate_security_data()
        return data['security_hash'] + '|' + data['timestamp']

    def get_content_type_name(self, obj):
        return format(obj.__class__.__name__).lower()

    def get_content_type_app_label(self, obj):
        return obj._meta.app_label

    def get_can_vote(self, obj):
        request = self.context['request']
        return can_vote(obj, request.user, request)

    def get_timesince_post(self, obj):
        return timesince_threshold(obj.pub_date)

    class Meta:
        model = Post

        fields = ('id', 'text', 'user', 'pub_date', 'pictures', 'security_data', 'comments_set', 'this_content_type',
                  'vote_total', 'timesince_post', 'can_vote', 'content_type_name', 'content_type_app_label')


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('id', 'vote', 'token', 'object_id', 'content_type')


class SwipeSerializer(serializers.ModelSerializer):
    matched = serializers.SerializerMethodField()
    mega_match = serializers.SerializerMethodField()

    def _check_match(self, obj, is_mega=False):
        vote_to_match = 2 if is_mega else 1
        if 'request' in self.context:
            try:
                other_vote = Vote.objects.get(
                    Q(token=obj.object_id) &
                    Q(object_id=self.context['request'].user.profile.id) &
                    Q(content_type=ContentType.objects.get_for_model(UserProfile))
                )
                if other_vote.vote is vote_to_match:
                    return True
                return False
            except Vote.DoesNotExist:
                return False
        return False

    def get_matched(self, obj):
        return self._check_match(obj)

    def get_mega_match(self, obj):
        return self._check_match(obj, True)

    class Meta:
        model = Vote
        fields = VoteSerializer.Meta.fields + ('matched', 'mega_match')


class GenericNotificationRelatedField(serializers.RelatedField):

    def to_representation(self, value):
        if isinstance(value, Post):
            serializer = PostSerializer(value, context={'request': self['request']})
        if isinstance(value, PictureComment):
            serializer = CommentSerializer(value, context={'request': self['request']})
        if isinstance(value, get_user_model()):
            serializer = UserSerializer(value, context={'request': self.request['request']})

        return serializer.data


class NotificationSerializer(serializers.ModelSerializer):
    actor = UserSerializer(get_user_model(), read_only=True)
    action_object = serializers.SerializerMethodField()
    unread = serializers.BooleanField(read_only=True)
    deleted = serializers.BooleanField(read_only=True)
    target = serializers.SerializerMethodField()
    content_object = serializers.SerializerMethodField()

    def get_content_object(self, value):
        self.serializer = None
        if hasattr(value.action_object, 'content_object'):
            return PostSerializer(value.action_object.content_object, context={'request': self.context['request']}).data
        else:
            return self.serializer

    def get_target(self, value):
        serializer = None
        if isinstance(value.target, Post):
            serializer = PostSerializer(value.target, context={'request': self.context['request']})
        if isinstance(value.target, PictureComment):
            serializer = CommentSerializer(value.target, context={'request': self.context['request']})
        if isinstance(value.target, get_user_model()):
            serializer = UserSerializer(value.target, context={'request': self.context['request']})

        return serializer.data

    def get_action_object(self, value):
        self.serializer = None
        if value.action_object is not None:
            if isinstance(value.action_object, Post):
                self.serializer = PostSerializer(value.action_object, context={'request': self.context['request']})
            if isinstance(value.action_object, get_user_model()):
                self.serializer = UserSerializer(value.action_object, context={'request': self.context['request']})
            if isinstance(value.action_object, PictureComment):
                self.serializer = CommentSerializer(value.action_object, context={'request': self.context['request']})
            return self.serializer.data
        else:
            return self.serializer

    class Meta:
        model = Notification
        fields = (
            'id', 'timesince', 'actor', 'actor_object_id', 'action_object', 'unread', 'deleted', 'target',
            'content_object', 'verb')


class FriendSerializer(serializers.ModelSerializer):
    to_user = UserSerializer(required=True)

    class Meta:
        model = Friend
        fields = ('to_user',)


class HashTaggedItemSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)
    content_object = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = HashTagged_Item

        fields = ('hashtag', 'user', 'content_object')


class HashTagSerializer(serializers.ModelSerializer):
    # hashtagged_items = HashTaggedItemSerializer(many=True,read_only=True)

    class Meta:
        model = HashTag

        fields = ('name',)
