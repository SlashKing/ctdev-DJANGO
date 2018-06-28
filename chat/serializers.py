from .models import Message, GroupMessage, Room, GroupRoom, ChatUser, GroupChatUser, UserReport, JoinRequest
from rest_framework.serializers import *
from rest_friendship.serializers import UserSerializer, FriendSerializer, UserProfileSerializer, UploadedFileSerializer
from chat.engine.utils import timestamp
from django.conf import settings


class MessageSerializer(ModelSerializer):
    user = SerializerMethodField()
    roomId = SerializerMethodField()
    timestamp = SerializerMethodField()
    image = SerializerMethodField()
    video = SerializerMethodField()
    has_flagged = SerializerMethodField()

    def get_image(self, obj):
        if obj.file is not None:
            return obj.file.get_file_url() if obj.file.extension in settings.IMAGE_MIME_TYPES else None
        return None

    def get_video(self, obj):
        if obj.file is not None:
            return obj.file.get_file_url() if obj.file.extension in settings.VIDEO_MIME_TYPES else None
        return None

    def get_timestamp(self, obj):
        return timestamp(obj.timestamp)

    def get_roomId(self, obj):
        return obj.room_id

    def get_user(self, obj):
        return FriendSerializer(obj.user, context={'request_user': self.context['request']}).data

    def get_has_flagged(self, obj):
        return obj.has_flagged(self.context.get('request').user)

    class Meta:
        model = Message
        fields = ('id', 'user', 'roomId', 'content', 'image', 'video', 'timestamp', 'has_flagged')


class GroupMessageSerializer(MessageSerializer):
    class Meta:
        model = GroupMessage
        fields = MessageSerializer.Meta.fields


class ChatUserSerializer(ModelSerializer):
    #user = SerializerMethodField()
    id = SerializerMethodField()
    username = SerializerMethodField()
    first_name = SerializerMethodField()
    last_name = SerializerMethodField()
    profile = SerializerMethodField()
    active = SerializerMethodField()

    def get_id(self, obj):
        return obj.user.id

    def get_username(self, obj):
        return obj.user.username

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name

    def get_profile(self, obj):
        return UserProfileSerializer(obj.user.profile, context={'request':self.context['request']}).data

    def get_active(self, obj):
        return obj.active
    """
    def get_user(self, obj):
        data = UserSerializer(obj.user).data
        data.update({'silenced': obj.silenced, 'blocked': obj.blocked})
        return data
    """
    class Meta:
        model = ChatUser
        fields = ('id', 'username', 'first_name', 'last_name', 'profile', 'active', 'silenced', 'blocked')


class GroupChatUserSerializer(ChatUserSerializer):
    """
    def get_user(self, obj):
        data = super(self.__class__, self).get_user(obj)
        data.update({'admin': obj.admin})
        return data
    """
    class Meta:
        model = GroupChatUser
        fields = ChatUserSerializer.Meta.fields + ('admin',)


class RoomSerializer(ModelSerializer):
    messages = SerializerMethodField()
    name = SerializerMethodField()
    users = SerializerMethodField()
    user_serializer = ChatUserSerializer
    msg_serializer = MessageSerializer

    def get_name(self, obj):
        return obj.name(self.context['request'].user.username)

    def get_users(self, obj):
        return self.user_serializer(
            obj.users.through.objects.filter(
                room__id=obj.id).exclude(
                user=self.context['request'].user
            ), context={'request':self.context['request']}, many=True).data

    def get_messages(self, obj):
        return self.msg_serializer(
            obj.messages.order_by('-timestamp').distinct()[:20],
            context={'request': self.context['request']},
            many=True).data

    class Meta:
        model = Room
        fields = ('id', 'messages', 'users', 'name', 'active')


class JoinRequestSerializer(ModelSerializer):
    requester = SerializerMethodField()
    requested = SerializerMethodField()
    rejected = SerializerMethodField()
    viewed = SerializerMethodField()

    def get_requester(self, obj):
        return UserSerializer(obj.requester, context={'request':self.context.get('request',None)}).data

    def get_requested(self, obj):
        return UserSerializer(obj.requester, context={'request':self.context.get('request',None)}).data

    def get_rejected(self, obj):
        return True if obj.rejected is not None else False

    def get_viewed(self, obj):
        return True if obj.viewed is not None else False

    class Meta:
        model = JoinRequest
        fields = ('requester', 'requested', 'rejected', 'viewed')


class GroupRoomSerializer(RoomSerializer):
    location = SerializerMethodField()
    join_requests = SerializerMethodField()
    user_serializer = GroupChatUserSerializer
    msg_serializer = GroupMessageSerializer

    def get_join_requests(self, obj):
        return JoinRequestSerializer(
            obj.join_requests.all(),
            context={'request':self.context['request']},
            many=True).data

    def get_location(self, obj):
        return obj.lat_long

    def get_users(self, obj):
        return GroupChatUserSerializer(
            obj.users.through.objects.filter(room=obj),
            context={'request':self.context['request']},
            many=True).data

    def get_messages(self, obj):
        return self.msg_serializer(
            obj.g_messages.order_by('-timestamp').distinct()[:20],
            context={'request': self.context['request']},
            many=True).data

    class Meta:
        model = GroupRoom
        fields = RoomSerializer.Meta.fields + ('private', 'location', 'join_requests')


class UserReportSerializer(ModelSerializer):
    class Meta:
        model = UserReport
        fields = ('reporter','reportee','comment','report_type','timestamp')