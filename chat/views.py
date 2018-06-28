from django.http import HttpResponse
from django.shortcuts import render
from .models import Message, GroupMessage
from .serializers import MessageSerializer, GroupMessageSerializer
from cicu.models import UploadedFile
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.utils.timezone import now
from rest_framework.decorators import detail_route, list_route
from cicu.serializers import FileUploadSerializer
from django.utils.translation import ugettext_lazy as _

def index(request):
    return render(request, 'chat/index.html')


def robots(request):
    """`robot.txt <http://www.robotstxt.org>`_"""
    return HttpResponse('User-agent: *\nDisallow: /')

#class ChatUserViewSet(ModelViewSet):
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
        self.queryset = self.serializer_class.Meta.model.objects.filter(params)
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

class GroupMessageViewSet(MessageViewSet):
    queryset = GroupMessage.objects.none()
    serializer_class = GroupMessageSerializer

from rest_flag import add_flagging_routes
add_flagging_routes(MessageViewSet)
add_flagging_routes(GroupMessageViewSet)
