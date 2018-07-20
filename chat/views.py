from django.http import HttpResponse
from django.shortcuts import render
from django.db.models import Q, Prefetch
# from django.db import connection
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.utils.timezone import now
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.utils.translation import ugettext_lazy as _

from .models import Message, GroupMessage, GroupChatUser, GroupRoom, Room, ChatUser
from .serializers import MessageSerializer, GroupMessageSerializer, ReducedUserSerializer, SimpleRoomSerializer, SimpleGroupRoomSerializer
from cicu.models import UploadedFile
from cicu.serializers import FileUploadSerializer
from notifications.models import Notification

from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import detail_route, list_route, action

import itertools

def index(request):
    return render(request, 'chat/index.html')


def robots(request):
    """`robot.txt <http://www.robotstxt.org>`_"""
    return HttpResponse('User-agent: *\nDisallow: /')


class GroupChatUserListView(ListAPIView):
    queryset = GroupChatUser.objects.none()
    serializer_class = ReducedUserSerializer

    @method_decorator(cache_page(0))
    def list(self, request, *args, **kwargs):
        return super(GroupChatUserListView, self).list(request, *args, **kwargs)

    def get_queryset(self):
        room_id = self.request.query_params.get('r_id', None)
        print(room_id)
        try:
            room_id = int(room_id)
        except Exception as e:
            raise ValidationError({'error': str(_('Invalid room id sent as parameter.'))})

        if room_id is not None:
            users = []
            user_ids = []
            queryset = self.request.user.rooms.only('id').exclude(Q(users=self.request.user)&Q(chatuser__date_blocked__isnull=False)).prefetch_related(
                Prefetch(
                    'chatuser_set',
                    queryset=ChatUser.objects.exclude(user_id=self.request.user.id),
                    to_attr='chatusers'
                )
            ).distinct()
            print(self.request.user.rooms.only('id').exclude(Q(users=self.request.user)&Q(chatuser__date_blocked__isnull=False)).query)
            if room_id > 0:
                group_room_exists = GroupRoom.objects.filter(id=room_id).exists()
                if group_room_exists:
                    for r in queryset:
                        for u in r.chatusers:
                            already_in_group = GroupChatUser.objects.filter(room_id=room_id, user_id=u.user_id).exists()
                            if not already_in_group:
                                user_ids.append(u.user_id)
                                users.append(u)
            else:
                # we use 0 as the roomId to fetch all the potential people to add to the room,
                # if they have matched or become friends, their room is created
                # TODO: filter people who have blocked as the rooms aren't deleted in case they wish to unblock the user and continue chatting
                for q in queryset:
                    for u in q.chatusers:
                        users.append(u)
            return users
        raise ValidationError({'error': str(_('r_id is a required query parameter'))})


class RoomViewSet(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = SimpleRoomSerializer

    #def get_queryset(self):
    #    room_id = self.request.query_params.get('r_id', None)
    #    user_id = self.request.query_params.get('u_id', None)
    #    params = Q()
    #    if room_id or user_id:
    #        if room_id is not None:
    #            params &= Q(id=room_id)
    #        if user_id is not None:
    #            params &= Q(users__in=[user_id])
    #        self.queryset = self.serializer_class.Meta.model.through_objects.filter(params).annotate_notifications(user_id).prefetch().distinct()
    #    return self.queryset

    @action(methods=['POST'], detail=True)
    def mark_notifications_read(self, request, pk=None):
        #TODO staff or current user validation
        obj= self.get_object()
        room = obj

        # get all room notifications
        queryset = self.request.user.notifications.filter(
            recipient=self.request.user,
            target_object_id=room.id,
            target_content_type=ContentType.objects.get_for_model(self.serializer_class.Meta.model)
        )

        #try:
        queryset.mark_all_as_read()

        return Response({'success' : _('All notifications for room have been marked as read.'),
                             'roomId': room.id
                            })
        #except:
        #    raise ValidationError({'error' : _('Oops! There was an error deleting the notifications for the room')})


class GroupRoomViewSet(RoomViewSet):
    queryset = GroupRoom.objects.all()
    serializer_class = SimpleGroupRoomSerializer





class MessageViewSet(ModelViewSet):
    queryset = Message.objects.none()
    serializer_class = MessageSerializer

    def get_queryset(self):
        message_id = self.request.query_params.get('m_id', None)
        room_id = self.request.query_params.get('r_id', None)
        user_id = self.request.query_params.get('u_id', None)
        params = Q()
        if message_id is None:
            if room_id is not None:
                params &= Q(room__id=room_id)
            if user_id is not None:
                params &= Q(user__id=user_id)
        else:
            params &= Q(id=message_id)
        self.queryset = self.serializer_class.Meta.model.objects.filter(params).select_related('room', 'user',
                                                                                               'user__profile')
        return self.queryset

    def create(self, request):
        my_data = {
            'content': request.data.get('content', ''),
            'room_id': request.data.get('room_id', None),
            'video': request.data.get('video', None),
            'picture': request.data.get('picture', None)
        }
        if request.method == 'POST':
            serializer = self.serializer_class(
                data=my_data
            )
            if serializer.is_valid():
                file_serializer = FileUploadSerializer(data=request.data, context={'request': request})
                if file_serializer.is_valid():
                    message = serializer.save(
                        user=request.user,
                        room_id=my_data['room_id'],
                        content=my_data['content'],
                    )
                    file_serializer.validated_data['room_id'] = my_data['room_id']
                    file_serializer.validated_data['content'] = my_data['content']
                    UploadedFile.objects.upload(request.user, file_serializer.validated_data, message)
                    return_data = self.serializer_class(message, context={'request': request}).data
                    return_data.update({'success': _('The message was successfully sent!')})
                    return Response(
                        return_data,
                        status.HTTP_201_CREATED
                    )
                # File couldn't be validated #
                return Response(
                    file_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(methods=['POST'], detail=True)
    def mark_as_read(self, request, pk=None):
        obj = self.get_object()
        room = obj.room
        notification = request.user.notifications.filter(
            recipient=self.request.user,
            action_object_object_id=obj.id,
            action_object_content_type=ContentType.objects.get_for_model(self.obj._meta.model),
            target_object_id=room.id,
            target_content_type=ContentType.objects.get_for_model(obj.room)
        ).first()
        if notification:
            notification.mark_as_read()
        else:
            return Response({ 'error': _('Message notification not found') },
                            status=status.HTTP_404_NOT_FOUND)
        return Response({
            # should have access to the message id in react to access the room to update anything UI related
            'success': _('Marked message notification read.')})

class GroupMessageViewSet(MessageViewSet):
    queryset = GroupMessage.objects.none()
    serializer_class = GroupMessageSerializer


from rest_flag import add_flagging_routes

add_flagging_routes(MessageViewSet)
add_flagging_routes(GroupMessageViewSet)
