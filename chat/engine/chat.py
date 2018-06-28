from channels import Group, DEFAULT_CHANNEL_LAYER, channel_layers
from chat.models import ChatUser, Message, Room, GroupRoom, GroupChatUser, JoinRequest
from django.contrib.auth.models import User
from django.db.models import Q, F, ProtectedError
from django.apps import apps
from django.contrib.gis.geos import fromstr
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from . import constants
from .base import ActionEngine
from .utils import timestamp
from chat.serializers import RoomSerializer, GroupRoomSerializer, GroupMessageSerializer, MessageSerializer
from rest_friendship.serializers import FriendSerializer, ExtendedFriendSerializer
from friendship.models import Friend
from django.db.utils import IntegrityError

class MyDict(dict):
    pass


class ChatEngine(ActionEngine):

    def get_control_channel(self, username=None):
        # Current control channel name, unless told to return `user`'s
        # control channel
        if username is None:
            username = self.message.user.username
        return 'control.{0}'.format(username)

    def get_room_channel(self, room, room_id):
        if isinstance(room, Room):
            return 'room.{0}'.format(room_id)
        return self.get_group_room_channel(room_id)

    def get_group_room_channel(self, room_id):
        return 'group_room.{0}'.format(room_id)

    def _discard_room_channels(self, username):
        # Discard the channel from all the room groups
        for room in Room.objects.filter(users__username=username).distinct():
            self.SET_ROOM_INACTIVE({'roomId': room.id})
            Group(self.get_room_channel(room, room.id)).discard(
                self.message.reply_channel
            )
        self._discard_group_room_channels(username)

    def _discard_group_room_channels(self, username):
        for g_room in GroupRoom.objects.filter(users__username=username).distinct():
            Group(self.get_group_room_channel(g_room.id)).discard(
                self.message.reply_channel
            )

    def disconnect(self):
        username = self.message.channel_session['user']
        # Discard the channel from the control group
        Group(self.get_control_channel(username)).discard(
            self.message.reply_channel
        )
        self._discard_room_channels(username)

    def _get_user_and_name(self):
        """
            :return: Two variables <User> user and <str> username
        """
        return self.message.user, self.message.user.username

    def _check_user_type(self, action):
        """
        :param action:
        :return object from model and id:

        :description: default to standard ChatUser
        or else use apps.get_model and a passed uModel to return correct chat room model
        """

        user_model = 'chat.ChatUser' if 'uModel' not in action else 'chat.%s' % action['uModel']
        return apps.get_model(user_model)

    def _check_room_type(self, action):
        """
        :param action:
        :return object from model and id:

        :description: default to standard Room
        or else use apps.get_model and a passed rModel to return correct chat room model
        """

        room_model = 'chat.Room' if 'rModel' not in action else 'chat.%s' % action['rModel']
        return apps.get_model(room_model)

    def _check_message_type(self, action):
        """
        :param action:
        :return object from model and id:

        :description: default to standard Message
        or else use apps.get_model and a passed model to return correct chat room model
        """

        message_model = 'chat.Message' if 'mModel' not in action else 'chat.%s' % action['mModel']
        return apps.get_model(message_model)

    def _room_serializer_by_type(self, cls):
        if isinstance(cls, Room):
            return RoomSerializer
        return GroupRoomSerializer

    def _message_serializer_by_type(self, cls):
        if isinstance(cls, Message):
            return MessageSerializer
        return GroupMessageSerializer

    def _add_users_to_channel(self, room, username=None):

        # Pre-create a room channel
        room_channel = self.get_room_channel(room, room.id)
        self.add(room_channel)

        if username:
            other_user = room.channel_name(username)

            # Attach the other users' open socket channels to the room
            other_channels = channel_layers[DEFAULT_CHANNEL_LAYER].group_channels(
                self.get_control_channel(other_user)
            )
            for channel in other_channels:
                Group(room_channel).add(channel)

    def CHAT_LOGIN(self, action):
        # Authentication is handled at the request level
        user, username = self._get_user_and_name()
        # Add this websocket to the user's control channel group
        control = self.get_control_channel()
        self.add(control)

        # Echo back the LOGIN to the client
        self.send({
            'type': constants.CHAT_LOGIN_SUCCESS,
            'user': username
        })

        # Send the room list back to the user
        request = MyDict()
        request.user = user

        # Get a list of rooms to display on the screen on load
        # Each room can have several users
        rooms = Room.objects.filter(Q(users=user) & Q(active=True)).distinct()
        group_rooms = GroupRoom.objects.filter(Q(users=user) & Q(active=True)).distinct()
        friends = ExtendedFriendSerializer(
            Friend.objects.select_related(
                'to_user').filter(
                to_user=user),
            context={'request': request},
            many=True).data

        # Send rooms to client
        self.send({
            'type': constants.RECEIVE_ROOMS,
            'friends': friends,
            'rooms': RoomSerializer(rooms, context={'request': request}, many=True).data,
            'group_rooms': GroupRoomSerializer(group_rooms, context={'request': request}, many=True).data,
        })

        # Broadcast the user's joining
        for room in rooms:
            self._add_users_to_channel(room)

        for g_room in group_rooms:
            # Pre-create a room channel
            g_room_channel = self.get_room_channel(g_room, g_room.id)
            self.add(g_room_channel)
            other_user = g_room.channel_name(g_room.id)
            # Attach the other users' open socket channels to the room
            other_channels = channel_layers[DEFAULT_CHANNEL_LAYER].group_channels(
                self.get_control_channel(other_user)
            )
            for channel in other_channels:
                Group(g_room_channel).add(channel)


    def REQUEST_TO_JOIN(self,action):
        requested = action.get('requested',None)
        requester= self.message.user.id
        message = action.get('message','')

        if requested is not None:
            try:
                room = GroupRoom.objects.get(id=room_id)
                room.add_join_request(
                    requester_id=requester,
                    requested_id=requested,
                    message=message
                )

                request = MyDict()
                request.user = self.message.user

                self.send({
                    'type': constants.REQUEST_TO_JOIN_SUCCESS,
                    'room': self._room_serializer_by_type(room)(
                                room, context={'request': request}).data,
                    'success': _('Request to join the room was successfully received by server.')
                })
            except IntegrityError as e:
                self.send({
                    'type': constants.REQUEST_TO_JOIN_FAILURE,
                    'error': _(str(e))
                })
            except GroupRoom.DoesNotExist:
                self.send({
                    'type': constants.REQUEST_TO_JOIN_FAILURE,
                    'error': _('Error validating roomId. Object with that roomId does not exist')
                })
        else:
            self.send({
                'type': constants.REQUEST_TO_JOIN_FAILURE,
                'error': _('Error validating roomId. It was missing from the request data.')
            })


    def ACCEPT_JOIN_REQUEST(self,action):
        room_id = action.get('roomId',None)
        user_id = self.message.user.id

        if room_id is not None:
            try:
                room = GroupRoom.objects.get(id=room_id)
                try:
                    join_request = room.join_requests.get(requested__id=user_id)
                    join_request.accept()

                    request = MyDict()
                    request.user = self.message.user

                    self.send({
                        'type': constants.ACCEPT_JOIN_REQUEST_SUCCESS,
                        'room': self._room_serializer_by_type(room)(
                                    room, context={'request': request}).data,
                        'success': _('Request to join the room was rejected.')
                    })
                except JoinRequest.DoesNotExist:
                    self.send({
                        'type': constants.ACCEPT_JOIN_REQUEST_FAILURE,
                        'error': _('Error validating roomId. Object with that roomId does not exist')
                    })
            except GroupRoom.DoesNotExist:
                self.send({
                    'type': constants.ACCEPT_JOIN_REQUEST_FAILURE,
                    'error': _('Error validating roomId. Object with that roomId does not exist')
                })
        else:
            self.send({
                'type': constants.ACCEPT_JOIN_REQUEST_FAILURE,
                'error': _('Error validating roomId. It was missing from the request data.')
            })


    def REJECT_JOIN_REQUEST(self,action):
        room_id = action.get('roomId',None)
        user_id = self.message.user.id

        if room_id is not None:
            try:
                room = GroupRoom.objects.get(id=room_id)
                try:
                    join_request = room.join_requests.get(requested__id=user_id)
                    join_request.reject()

                    request = MyDict()
                    request.user = self.message.user

                    self.send({
                        'type': constants.ACCEPT_JOIN_REQUEST_SUCCESS,
                        'room': self._room_serializer_by_type(room)(
                                    room, context={'request': request}).data,
                        'success': _('Request to join the room was rejected.')
                    })
                except JoinRequest.DoesNotExist:
                    self.send({
                        'type': constants.ACCEPT_JOIN_REQUEST_FAILURE,
                        'error': _('Error validating roomId. Object with that roomId does not exist.')
                    })
            except GroupRoom.DoesNotExist:
                self.send({
                    'type': constants.ACCEPT_JOIN_REQUEST_FAILURE,
                    'error': _('Error validating roomId. Object with that roomId does not exist.')
                })
        else:
            self.send({
                'type': constants.ACCEPT_JOIN_REQUEST_FAILURE,
                'error': _('Error validating roomId. It was missing from the request data.')
            })


    def CREATE_MEET_MAP_ROOM(self, action):
        request = MyDict()
        request.user = self.message.user
        #try:
        r_model = self._check_room_type(action)
        print(action)
        room = r_model()
        # group rooms have a location attribute that we set
        if 'location' in action:
            location = action['location']
            room.location = fromstr("POINT({0} {1})".format(
                location.get('longitude', 0),
                location.get('latitude', 0)
                )
            )
        room.active = True
        room.save()
        users = room.add_users([self.message.user.id])
        users[0].set_admin(True)
        if 'users' in action:
            users = []
            requests = []
            for u in action['users']:
                try:
                    this_user = User.objects.get(id=u)
                    join_request = JoinRequest(
                        content_object=room,
                        requester=user,
                        requested=this_user
                    )
                    requests.append(join_request)
                    users.append(u)
                except User.DoesNotExist:
                    continue
            # add the user to the group but set to active until the user accepts or rejects
            room.add_users(users, activated=False)
            JoinRequest.objects.bulk_create(requests)
        self._add_users_to_channel(room)

        # Send the room back to the user that opened a new chat window for UI purposes
        # TODO: send notification to premium users that another user opened a chat window with you
        self.send({
            'type': constants.CREATE_MEET_MAP_ROOM_SUCCESS,
            'success': str(_('Room was successfully created!')),
            'room': self._room_serializer_by_type(room)(
                room, context={'request': request}).data
        })
        #except Exception as error:
        #    print(error)
#
        #    self.send({
        #        'type': constants.CREATE_MEET_MAP_ROOM_FAILURE,
        #        'error': str(error),
        #        'room': self._room_serializer_by_type(room)(
        #            room, context={'request': request}).data
        #    })

    def CREATE_CHAT_ROOM(self, action):
        """
            CREATE_CHAT_ROOM
            :param : action['user']:
        """
        try:
            # # if there isn't create; a new one, otherwise return the room

            r_model = self._check_room_type(action)

            user = self.message.user
            users = []
            querysets = []
            room_type = self._check_room_type(action)
            room = None
            queryset = room_type.objects.filter(users=user).distinct()

            if 'users' in action:
                for u in action['users']:
                    users.append(u)
                querysets.append(room_type.objects.filter(users__in=[users]).distinct())
            users.append(user.id)
            # Ugly but it works, we have compiled a list of querysets for the users that are to be added to the room
            # and use intersection to get the room we are trying to get.
            # FIXME: this will break with group rooms as it could return several results depending whether the same users are carrying multiple simiultaneous chats. RIP
            room = queryset.intersection(*querysets)

            if room.count() is 0:
                room = room_type()
                # group rooms have a location attribute that we set
                if 'location' in action:
                    room.location = fromstr("POINT({0} {1})".format(
                        action['location'].longitude,
                        action['location'].latitude)
                )

                room.add_users(users)

                self._add_users_to_channel(room)

            else:
                room = room[0] #return the first, and should be only room

            room.active = True
            room.save()

            request = MyDict()
            request.user = user
            # Send the room back to the user that opened a new chat window for UI purposes
            # TODO: send notification to premium users that another user opened a chat window with you
            self.send({
                'type': constants.CREATE_CHAT_ROOM_SUCCESS,
                'room': self._room_serializer_by_type(room)(
                    room, context={'request': request}).data,
                'rModel': action.get('rModel', r_model.__name__)
            })

            # send the room to all remaining users in the chat to be consumed by Redux
            for uu in room.users.exclude(username=user.username):
                room_channel = self.get_room_channel(room, room.id)
                request.user = uu
                self.send_to_group(room_channel, {
                    'type': constants.CREATE_CHAT_ROOM_SUCCESS,
                    'room': self._room_serializer_by_type(room)(
                        room, context={'request': request}).data,
                    'rModel': action.get('rModel', r_model.__name__)
                })
        except Exception as error:
            print(error)
            self.send({
                'type': constants.CREATE_CHAT_ROOM_FAILURE,
                'error': 'Could not create chat room'})



    def BLOCK_USER(self, action):
        """

        :param action: ['roomId','userId']
        :return: ['roomId','userId'] or error text
        """
        room_id = action['roomId']
        user_id = action['userId']
        user_type = self._check_user_type(action)
        try:
            user_to_block = user_type.objects.get(Q(room_id=room_id)&Q(user_id=user_id))
            user_to_block.block()
            message = {
                'type': constants.BLOCK_USER_SUCCESS,
                'roomId': room_id,
                'userId': user_id
            }
            self.send(message)
            self.send_to_group(self.get_control_channel(user_to_block.user.username), message)
        except user_type.DoesNotExist:
            self.send({
                'type': constants.BLOCK_USER_FAILURE,
                'roomId': room_id,
                'error': _('The user you are trying to block does not exist')
            })


    def UNBLOCK_USER(self, action):
        """

        :param action: ['roomId','userId']
        :return: ['roomId','userId'] or error text
        """
        room_id = action['roomId']
        user_id = action['userId']
        user_type = self._check_user_type(action)
        try:
            user_to_unblock = user_type.objects.get(Q(room_id=room_id)&Q(user_id=user_id))
            user_to_unblock.unblock()
            message = {
                'type': constants.UNBLOCK_USER_SUCCESS,
                'roomId': room_id,
                'userId': user_id
            }
            self.send(message)
            self.send_to_group(self.get_control_channel(user_to_unblock.user.username), message)
        except user_type.DoesNotExist:
            self.send({
                'type': constants.UNBLOCK_USER_FAILURE,
                'roomId': room_id,
                'error': _('The user you are trying to unblock does not exist')
            })



    def DELETE_CHAT_ROOM(self, action):
        """
        DELETE_CHAT_ROOM

        Uses: user unmatches someone

        :param action:
        :return: roomId
        """
        # delete the room and send the deletion back to the websocket clients to remove from UI if necessary
        roomId = action['roomId']
        room_type = self._check_room_type(action)
        try:
            room = room_type.objects.get(pk=roomId)
            room.delete()

            for user in room.users:
                self.send_to_group(self.get_control_channel(user.username), {
                    'type': constants.DELETE_CHAT_ROOM_SUCCESS,
                    'roomId': roomId
                })
        except room_type.DoesNotExist: # room does not exist
            self.send({
                'type': constants.DELETE_CHAT_ROOM_FAILURE,
                'roomId': roomId,
                'error': _('The room you are trying to delete does not exist. Holy Twilight Zone.')
            })
        except ProtectedError: # protected foreign key reference restricting deletion
            self.send({
                'type': constants.DELETE_CHAT_ROOM_FAILURE,
                'roomId': roomId,
                'error': _('The room cannot be deleted at this time.')
            })

    """ 
        CLOSE_CHAT_ROOM
        params : action['roomId'] (target room id)
    """

    def CLOSE_CHAT_ROOM(self, action):
        # set room to inactive and relay it to the other user
        roomId = action['roomId']
        room = self._check_room_type(action).objects.get(pk=roomId)
        room.active = False
        room.save()
        other_users = room.users.exclude(username=self.message.user.username)

        for user in other_users:
            self.send_to_group(self.get_control_channel(user.username), {
                'type': constants.CLOSE_CHAT_ROOM,
                'roomId': roomId
            })


    def SET_ALL_ROOMS_INACTIVE(self, action):
        username = self.message.channel_session['user']
        r_model = self._check_room_type(action)
        Room.objects.select_for_update().filter(users__username=username).update(active=False)
        rooms = Room.objects.filter(users__username=username)
        for room in rooms:
            for user in room.users.exclude(username=username):
                room_channel = self.get_room_channel(room, room.id)
                self.send_to_group(room_channel, {
                    'type': constants.SET_ALL_ROOMS_INACTIVE_SUCCESS,
                    'roomId': room.id,
                    'rModel': action.get('rModel', r_model.__name__)
                })

    """ 
    SET_ROOM_INACTIVE
    params : action['roomId'] (target room id)
    """

    def SET_ROOM_INACTIVE(self, action):
        username = self.message.channel_session['user']
        room_id = action['roomId']
        r_model = self._check_room_type(action)
        room = r_model.objects.get(id=room_id)
        #room.active = False
        #room.save()
        for user in room.users.exclude(username=username):
            room_channel = self.get_room_channel(room, room_id)
            self.send_to_group(room_channel, {
                'type': constants.SET_ROOM_CONTENT,
                'roomId': room_id,
                'rModel': action.get('rModel', r_model.__name__)
            })

            self.send_to_group(room_channel, {
                'type': constants.SET_ROOM_INACTIVE,
                'active': False,
                'roomId': room_id,
                'user': username,
                'rModel': action.get('rModel', r_model.__name__)
            })

    """ 
        SET_ROOM_ACTIVE
        params : action['roomId'] (target room id)
    """

    def SET_ROOM_ACTIVE(self, action):
        username = self.message.channel_session['user']  # action['user']
        room_id = action['roomId']
        r_model = self._check_room_type(action)
        room = r_model.objects.get(id=room_id)
        room.active = True
        room.save()
        for user in room.users.exclude(username=username):
            room_channel = self.get_room_channel(room, room_id)
            self.send_to_group(room_channel, {
                'type': constants.SET_ROOM_ACTIVE,
                'active': True,
                'roomId': room_id,
                'user': username,
                'rModel': action.get('rModel', r_model.__name__)
            })

    """ 
        SET_ROOM_IS_TYPING
        params : action['roomId'] (target room id)
    """

    def SET_ROOM_IS_TYPING(self, action):
        username = self.message.user.username
        roomId = action['roomId']
        r_model = self._check_room_type(action)
        room = r_model.objects.get(id=roomId)
        for user in room.users.exclude(username=username):
            room_channel = self.get_control_channel(user.username)
            self.send_to_group(room_channel, {
                'type': constants.SET_ROOM_CONTENT,
                'roomId': roomId,
                'rModel': action.get('rModel', r_model.__name__)
            })

            self.send_to_group(room_channel, {
                'type': constants.SET_ROOM_IS_TYPING,
                'isTyping': action['isTyping'],
                'roomId': roomId,
                'rModel': action.get('rModel', r_model.__name__)
            })

    def SEND_MESSAGE(self, action):
        user, username = self._get_user_and_name()

        """
        SEND_MESSAGE
        :param  action['roomId']: (target room id) *required
        :param action['rModel']: (roomModel) default to chat.Room
        
        TODO: Check that the user is a member of that room (prevent
        cross posting into rooms they lack membership to)
        """
        room_type = self._check_room_type(action)
        room = room_type.objects.get(id=action['roomId'])
        room.active = True
        room.save()
        room_user = None
        try:
            # Gets appropriate user class by using the through attribute on room.users
            # This is required because chat users are inherited from a base model to help with writing DRY methods
            room_user = room.users.through.objects.get(user__username=username, room=room)
        except room.users.through.DoesNotExist:
            room_user = room.users.through.objects.create(user=user, room=room)
        #try:
        room_user.last_activity = timezone.now()
        room_user.save()

        m_model = self._check_message_type(action)

        # If the message has a file, we create it using the Django API instead of sending the data over websoocket
        #   TODO: In the future, we could potentially deliver the the video files in chunks and assemble the data on the
        #   TODO: client's device, and send through the websocket. Hmmm, must do more research into user to user stream
        # The client will have received the message id after a successful file upload.
        # Now, we can retrieve the message and dispatch to the recipients, otherwise we create the message with the
        #   message provided.
        message = m_model.objects.get(id=action.get('id', 0)) if 'id' in action else m_model.objects.create(
                user=room_user.user,
                room=room,
                content=action['content'],
            )

        # Broadcast the message to all users that belong to the room
        request = MyDict()
        for u in room.users.all():
            request.user = u
            room_channel = self.get_control_channel(u.username)
            self.send_to_group(room_channel, {
                'type': constants.RECEIVE_MESSAGES,
                'message': self._message_serializer_by_type(m_model)(message, context={'request': request}).data
            })
        #except Exception as error:
            #print(error)  #TODO send error back to client of user sending the message

    def REQUEST_MESSAGES(self, action, offset=0, limit=20):
        """
        :param action: { roomId, user, lastMessageId, firstMessageId }
        :param offset:
        :param limit:

        """

        # latest_id, room
        # offset and limit to handle fetching older messages

        params = Q()
        username = ''
        user = {}
        m_model = self._check_message_type(action)
        if 'roomId' in action:
            params &= Q(room_id=action['roomId'])
        if 'user' in action:
            username = action['user']
            params &= Q(room__users__username=username)
        if 'lastMessageId' in action:
            if action['lastMessageId'] is not 0:
                # Any messages that occured at or later than time of lastMessage
                prior = m_model.objects.get(id=action['lastMessageId'])
                params &= Q(timestamp__lt=prior.timestamp)
        if 'firstMessageId' in action:
            # Any messages that occured before the than time of lastMessage
            prior = m_model.objects.get(id=action['firstMessageId'])
            params &= Q(timestamp__lt=prior.timestamp)

        messages = m_model.objects.filter(
            params
        ).select_related(
            'user'
        ).order_by('-timestamp')[offset:offset + limit]

        # if the messages query does not return anything, set end var to True so the client knows to stop requesting
        end = False
        if not len(messages):
            end = True

        # fake request object that contains user,
        # this is because the serializers requires context['request'] with 'user'
        request = MyDict()
        request.user = self.message.user

        self.send({
            'type': constants.RECEIVE_MESSAGES,
            'roomId': action['roomId'],
            'end': end,
            'messages': self._message_serializer_by_type(m_model)(
                messages,
                context={'request': request},
                many=True).data
        })
