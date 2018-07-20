from django.db.models.signals import post_save, post_delete

from .utils import notify_on_join_request, notify_on_message, notify_on_user_leaving_room, notify_on_user_rejecting_request, notify_on_friend_accepted, notify_on_friend_request
from .models import JoinRequest, Message, GroupMessage, Room, GroupRoom, GroupChatUser
from notifications.models import Notification
from friendship.models import Friend, FriendshipRequest
from friendship.signals import friendship_request_accepted, friendship_request_created

from secretballot.models import Vote

from django.contrib.contenttypes.models import ContentType
from django.dispatch import receiver


def _filter_by_action_object(id=None, sender=None):
    return Notification.objects.filter(
        action_object_object_id=id,
        action_object_content_type=ContentType.objects.get_for_model(sender))

def _filter_by_target(id=None, sender=None):
    return Notification.objects.filter(
        target_object_id=id,
        target_content_type=ContentType.objects.get_for_model(sender))

@receiver(friendship_request_accepted, sender=FriendshipRequest)
def notify_on_friend_request_accepted(sender, instance, **kwargs):
    notify_on_friend_accepted(instance)

@receiver(friendship_request_created, sender=FriendshipRequest)
def notify_on_friend_request_created(sender, instance, **kwargs):
    notify_on_friend_request(instance)

@receiver(post_save, sender=JoinRequest)
def send_join_request_notification(sender, instance, created, **kwargs):
    if created:
        # TODO: this won't occur with meet map rooms because we call bulk_create, should override bulk_create or create join_requests individually
        notify_on_join_request(instance)
    else:
        notify_on_user_rejecting_request(instance)


@receiver(post_delete, sender=JoinRequest)
def join_request_post_delete(sender, instance, **kwargs):
    try:
        _filter_by_action_object(instance.id, sender).delete()
    except:
        pass


@receiver(post_save, sender=Message)
def message_post_save(sender, instance, created, **kwargs):
    if created:
        instance.room.set_last_activity()
        notify_on_message(instance)


@receiver(post_delete, sender=Message)
def message_on_delete(sender, instance, **kwargs):
    try:
        _filter_by_action_object(instance.id, sender).delete()
    except:
        pass # instance.save() raise ProtectedError? to recuperate the deleted message


@receiver(post_save, sender=GroupMessage)
def send_group_message_notification(sender, instance, created, **kwargs):
    if created:
        instance.room.set_last_activity()
        notify_on_message(instance)


@receiver(post_delete, sender=GroupMessage)
def group_message_on_delete(sender, instance, **kwargs):
    try:
        _filter_by_action_object(instance.id, sender).delete()
    except:
        pass
# Not sure this is really necessary since we create join requests and the users at the same time
#@receiver(post_save, sender=GroupChatUser)
#def group_chat_user_post_save(sender, instance, created, **kwargs):
#    if created:
#        notify_on_user_created(sender, instance)

@receiver(post_delete, sender=GroupChatUser)
def group_chat_user_post_delete(sender, instance, **kwargs):
    current_user = instance.user
    for u in instance.room.groupchatuser_set.exclude(user__username=current_user.username):
        if u.is_activated:
            if instance.is_activated:
                notify_on_user_leaving_room(instance, current_user, u)
        continue

@receiver(post_delete, sender=Room)
def remove_room_notifications_on_delete(sender, instance, **kwargs):
    try:
        _filter_by_target(instance.id, sender).delete()
    except:
        pass



@receiver(post_delete, sender=GroupRoom)
def remove_group_room_notifications_on_delete(sender, instance, **kwargs):
    try:
        _filter_by_target(instance.id, sender).delete()
    except:
        pass
