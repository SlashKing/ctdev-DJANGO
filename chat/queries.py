from django.db.models import QuerySet, Prefetch, F, Q, Count, IntegerField, CharField, Case, When, Value
from django.db.models.functions import Cast
from .utils import is_int_or_user
from django.contrib.contenttypes.models import ContentType
from notifications.models import Notification
from django.apps import apps


class BaseNotificationQuerySet(QuerySet):
    def annotate_notifications(self, user=None, unread=True):
        """
        :param user (optional) DEFAULT None:
        :param unread (optional) DEFAULT True:
        :return:
        """
        if user is not None:
            room = self.annotate(
                notifications_count=Count(
                    Case(
                        When(
                            Q(users__notifications__unread=unread) &
                            Q(users__notifications__recipient_id=str(user))&
                            Q(users__notifications__target_content_type=ContentType.objects.get_for_model(self.model)) &
                            Q(users__notifications__target_object_id=Cast(F('id'), CharField()),
                        ), then=Value(1)),
                        output_field=IntegerField()
                    ) ,distinct = True
                )
            )
            return room

        return self


#print(sorted(Notification.objects.aggregate(testing=Sum(Case(When(Q(timestamp__lte=date.today()),then=Value(0)), output_field= IntegerField())),testing2=Sum(Case(When(Q(timestamp__lte=date.today()),then=Cast('public',IntegerField())), output_field= IntegerField()))).items(), key=itemgetter(1)))

class JoinRequestQuerySet(BaseNotificationQuerySet):
    pass


class BaseRoomQuerySet(BaseNotificationQuerySet):
    def rooms(self, user=None):
        """
            :param user <int | User>:

            :return QuerySet[self.users.through<ChatUser | GroupChatUser>] or self.users.through<<ChatUser | GroupChatUser>:
        """
        if user is None:
            return self.filter(active=True)
        bool, user_type = is_int_or_user(user)
        params = Q()
        if bool:
            params &= Q(users=user)
        else:
            # not an int or user passed, return self
            return self
        if isinstance(user, list):
            for u in user:
                params &= Q(users=u)
        return self.filter(params)

    def mark_messages_viewed(self, user=None):
        """Mark as read any unread messages in the current queryset.

        Optionally, filter these by user first.
        """
        qs = self.viewed(False)
        if user:
            qs = qs.filter(recipient=sender)

        return qs.update(unread=False)

    def users_by_admin_status(self, admin=True):
        return self.filter(users__admin=admin)

    def viewed(self, viewed=True):
        """
        filter by rooms have read and unread messages
        :param viewed:
        :return:
        """
        return self.filter(messages__viewed__isnull=not viewed)

    def by_user(self, user=None):
        return self.filter(users=user)

    def by_active(self, active=True):
        return self.filter(active=active)

    def by_id(self, id=None):
        return self.filter(id=id)

    def pre_chat_users(self, user=None):
        return self.prefetch_related(
            Prefetch(
                'chatuser_set',
                queryset=apps.get_model('chat.ChatUser').objects.select_related('user__profile',
                                                                                'user__profile__profile_image').exclude(
                    user=user),
                to_attr='chatusers'
            )
        )

    def pre_messages(self):
        return self.prefetch_related(
            Prefetch(
                'messages',
                queryset=apps.get_model('chat.Message').objects.select_related('user__profile',
                                                                               'user__profile__profile_image',
                                                                               'room').order_by('-timestamp'),
                to_attr='m_messages'
            )
        )

    def prefetch(self, user=None):
        return self.prefetch_related(
            Prefetch(
                'chatuser_set',
                queryset=apps.get_model('chat.ChatUser').objects.select_related('user__profile',
                                                                                'user__profile__profile_image').exclude(
                    user=user),
                to_attr='chatusers'
            )
        ).prefetch_related(
            Prefetch(
                'messages',
                queryset=apps.get_model('chat.Message').objects.select_related('user__profile',
                                                                               'user__profile__profile_image',
                                                                               'room').order_by('-timestamp'),
                to_attr='m_messages'
            )
        ).distinct()


class GroupRoomQuerySet(BaseRoomQuerySet):
    def by_private(self, private=False):
        return self.filter(private=private)

    def pre_chat_users(self):
        return self.prefetch_related(
            Prefetch(
                'groupchatuser_set',
                queryset=apps.get_model('chat.GroupChatUser').objects.select_related('user__profile',
                                                                                     'user__profile__profile_image').order_by
                ('-admin'),
                to_attr='chatusers'
            )
        )

    def pre_messages(self):
        return self.prefetch_related(
            Prefetch(
                'g_messages',
                queryset=apps.get_model('chat.GroupMessage').objects.select_related(
                    'user__profile', 'user__profile__profile_image').order_by('-timestamp').prefetch_related(
                    'user__profile__images'
                ),
                to_attr='gg_messages'
            )
        )

    def pre_join_requests(self):
        return self.prefetch_related(
            Prefetch(
                'join_requests',
                queryset=apps.get_model('chat.JoinRequest').objects.select_related('requested__profile',
                                                                                   'requester__profile',
                                                                                   'requester__profile__profile_image',
                                                                                   'requested__profile__profile_image'),
                to_attr='join_requests_cache'
            )
        )

    def prefetch(self):
        # TODO: prefetch .users? or revoke the field from the query because we retrieve them in the groupchatuser_set...
        return self.prefetch_related(
            Prefetch(
                'join_requests',
                queryset=apps.get_model('chat.JoinRequest').objects.select_related('requested__profile',
                                                                                   'requester__profile',
                                                                                   'requester__profile__profile_image',
                                                                                   'requested__profile__profile_image'),
                to_attr='join_requests_cache'
            ),
            Prefetch(
                'groupchatuser_set',
                queryset=apps.get_model('chat.GroupChatUser').objects.select_related('user__profile',
                                                                                     'user__profile__profile_image').order_by
                ('-admin'),
                to_attr='chatusers'
            ),
            # 'users',
            Prefetch(
                'g_messages',
                queryset=apps.get_model('chat.GroupMessage').objects.select_related(
                    'user__profile', 'user__profile__profile_image').order_by('-timestamp').prefetch_related(
                    'user__profile__images'
                ),
                to_attr='gg_messages'
            )
        ).distinct()
