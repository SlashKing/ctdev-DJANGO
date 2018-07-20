from django.db.models import Manager
from .queries import BaseRoomQuerySet

class BaseRoomManager(Manager):
    def get_queryset(self):
        return BaseRoomQuerySet(self.model, using=self._db)

    def rooms(self, user=None):
        if user is None:
            return self.get_queryset().rooms()
        return self.get_queryset().rooms(user)

    def by_user(self, user=None):
        return self.get_queryset().by_user(user)

    def by_active(self, active=True):
        return self.get_queryset().by_active(active)

    def by_id(self, id=None):
        return self.get_queryset().by_id(id)

    def pre_messages(self, ):
        return self.get_queryset().pre_messages()

    def pre_chat_users(self, user=None):
        return self.get_queryset().pre_chat_users(user)

    def prefetch(self, user=None):
        return self.get_queryset().prefetch(user)


class GroupRoomManager(BaseRoomManager):
    def get_queryset(self):
        from .queries import GroupRoomQuerySet
        """ Must pass through the altered QuerySet on init"""
        return GroupRoomQuerySet(self.model, using=self._db)

    def pre_chat_users(self):
        return self.get_queryset().pre_chat_users()

    def pre_join_requests(self):
        return self.get_queryset().pre_join_requests()

    def pre_messages(self):
        return self.get_queryset().pre_messages()

    def by_private(self, private=False):
        return self.get_queryset().by_private(private)

    def prefetch(self):
        return self.get_queryset().prefetch()

