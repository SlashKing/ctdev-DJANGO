from notifications.signals import notify
from django.utils.translation import ugettext_lazy as _

def is_int_or_user(user=None):
    from django.contrib.auth import get_user_model
    if isinstance(user, get_user_model()):
         return True, get_user_model()
    elif isinstance(user, int):
        return True, int
    return False, None


def normalize_lat_long(location=None):
    latitude = 0
    longitude = 0
    if location is not None:
        latitude = location.x
        longitude = location.y
    return {
        'latitude': latitude,
        'longitude': longitude
    }


def notify_on_join_request(join_request):
    verb = _(u'%s has summoned you to a new group!' % join_request.requester.username)

    notify.send(
        join_request.requester, # actor
        recipient=join_request.requested,
        verb=verb,
        action_object=join_request,
        description=u'',
        target=join_request.content_object # room
    )

def notify_on_message(message):
    """
    Send notification to all users in the room except the sender of the message

    :param message:
    :return:
    """
    user = message.user
    for u in message.room.users.exclude(username=user.username):
        notify.send(
            user,
            recipient=u,
            verb=_(u'%s has sent a message' % user.username),
            action_object=message,
            description=u'',
            target=message.room,
        )


def notify_on_user_leaving_room(instance, user, other_user):
    notify.send(
        user,
        recipient=other_user,
        verb=_(u'%s has left the building' % user.username),
        action_object=instance.room,
        description=u'',
        target=instance.room
    )

def _notify_room_rejection(join_request, room, sender, recipient, verb):
        notify.send(
            sender,
            recipient=recipient,
            verb=verb,
            action_object=join_request,
            description=u'',
            target=room
        )

#from django.utils import timezone, timesince
def notify_on_user_rejecting_request(join_request):
    if join_request.rejected is not None:
        # should we save a rejected boolean flag instead if
        # instance.rejected
        if join_request.admin:
            verb = _(u'%s has rejected your request to join your room.' % join_request.requester.username)

            # notify all admins, not just the one that sent the request
            users = instance.join_request.groupchatuser_set.filter(admin=instance.admin)   #|Q(activated=True)

            # user wasn't activated, request was sent but rejected, notify
            [_notify_room_rejection(join_request, join_request.content_object, join_request.requester, u, verb) for u in users ]

        else:
            verb = _(u'%s rejected your request to join their room.' % join_request.requested.username)

            _notify_room_rejection(join_request, join_request.content_object, join_request.requester, join_request.requested, verb)

def _notify_on_user_blocked(user, recipient, room, verb):
    notify.send(
        user.user, # FIXME:the actor is the user being blocked at the moment, but should be the user blocking
        recipient=recipient,
        verb=verb,
        action_object=user, # group chat user
        description=u'',
        target=room
    )

def notify_on_friend_request(friend_request):
    # parsing text looking for mentions (@) to be linked with the object
    # user = User.objects.get(id=friend_request.from_user.id)
    verb = u'wants to be friends'
    notify.send(friend_request.from_user, recipient=friend_request.to_user, verb=verb,
                action_object=friend_request, description=u'', target=friend_request.to_user)


def notify_on_friend_accepted(friend_request):
    # user = User.objects.get(id=friend_request.from_user.id)
    verb = u'and you are now friends'
    notify.send(friend_request.from_user, recipient=friend_request.to_user, verb=verb,
                action_object=friend_request, description=u'', target=friend_request.to_user)
    notify.send(friend_request.to_user, recipient=friend_request.from_user, verb=verb,
                action_object=friend_request, description=u'', target=friend_request.from_user)

def notify_on_user_blocked(user):
    if user.date_blocked is not None:
        """
            this is a poor design for user blocking... maybe because we have several admins, we keep track of the last user that blocked, and unblocked... 
            could also move this signal to the model class and connect it to the save() method and pass the user as a signal parameter
            #TODO: blocked_by and unblocked_by for public rooms
            #TODO: split private and public group rooms into two models PublicRoom(BaseRoom) PrivateRoom(BaseRoom) to separate business logic
        """
        # notify other users in the chat that someone was blocked
        verb = _(u'%s was blocked in a room you''re in' % user.user.username)

        users = user.room.groupchatuser_set.exclude(user__username=user.user.username)   #|Q(activated=True)

        # user wasn't activated, request was sent but rejected, notify
        [ _notify_on_user_blocked(user, u.user, user.room, verb) for u in users ]

        # switch the verb, send a notification to the user that they were blocked

        _notify_on_user_blocked(user, user.user, user.room, _(u'You were blocked in a room you''re in'))
