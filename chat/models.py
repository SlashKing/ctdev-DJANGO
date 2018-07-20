from django.db import models
from django.db.utils import IntegrityError
from django.utils import timezone
from django.db.models.signals import post_delete, post_save, post_init
from django.contrib.auth import get_user_model
from django.contrib.gis.db.models import PointField
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext_lazy as _
from django.db.models import F, Prefetch
from .queries import BaseRoomQuerySet, GroupRoomQuerySet

from cicu.models import UploadedFile

from rest_flag.models import Flag, FlagInstance
from rest_flag import enable_flagging_on

from .utils import normalize_lat_long, is_int_or_user


class JoinRequest(models.Model):
    object_id = models.PositiveIntegerField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    content_object = GenericForeignKey("content_type", "object_id")

    admin = models.BooleanField(default=False)
    message = models.TextField(max_length=500, default='', blank=True)
    created = models.DateTimeField(auto_now_add=True)
    rejected = models.DateTimeField(null=True, blank=True)
    viewed = models.DateTimeField(null=True, blank=True)

    requested = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='received_join_requests', null=True)
    requester = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='sent_join_requests', null=True)

    class Meta:
        verbose_name = _('Join Request')
        verbose_name_plural = _('Join Requests')
        unique_together = [ 'object_id', 'content_type', 'requester', 'requested' ]

    def accept(self):
        """ Accept this join request """
        # add users to the room
        qs = GroupRoom.objects.filter(id=self.object_id).first().add_users([self.requested.id], activated=True)
        if not self.admin: #TODO: move to post_delete signal
            # update all the join requests sent to the various admins
            self.requester.sent_join_requests.filter(
                object_id=self.object_id
            ).delete()
        # delete the requests associated
        self.delete()

        # return QuerySet[GroupChatUser]
        return qs

    def reject(self):
        self.rejected = timezone.now()
        self.save()

        # update all the join requests sent to the various admins
        self.requester.sent_join_requests.filter(
            object_id=self.object_id
        ).update(rejected=timezone.now())
        #room = GroupRoom.objects.filter(id=self.object_id).first()
        #qs = room.remove_users([self.requested.id])
        #print(qs)
        return qs

    def cancel(self):
        # first delete the chat user associated with the join request
        # we delete the chat user that is not admin
        # logic:
        #   if admin: delete the person that was requested to join, else delete the person requesting
        id = self.requested.id if self.admin else self.requester.id
        GroupChatUser.objects.filter(room_id=self.object_id, user_id=id).delete()

        #delete the request
        self.delete()

        return True

    def mark_viewed(self):
        self.viewed = timezone.now()
        self.save()
        return True

    @property
    def is_viewed(self):
        return True if self.viewed is not None else False

    @property
    def is_rejected(self):
        return True if self.rejected is not None else False


class BaseRoom(models.Model):

    # we model more generally to allow multi-user rooms
    users = models.ManyToManyField(get_user_model(), related_name='rooms', through='ChatUser', through_fields=('room', 'user'))
    active = models.BooleanField(default=True)
    # This will let users rename the title of the room
    last_activity = models.DateTimeField(default=timezone.now())
    title = models.TextField(default='')
    join_requests = GenericRelation(JoinRequest)
    objects = BaseRoomQuerySet().as_manager()
    through_objects = BaseRoomQuerySet().as_manager()

    def set_last_activity(self, commit=True):
        self.last_activity = timezone.now()
        if commit:
            self.save()

    def add_users(self, users=[], activated=None):
        qs = []
        defaults = {}
        # we use the activated keyword argument to determine if it's a group chat
        # a user is created so they are added to the websocket channel to listen to updates on their join request status
        # TODO: separate logic for each room type, this could get long and ugly eventually, right now it's manageable
        if activated is not None:
            defaults['activated'] = activated

        for user in users:
            try:
                # if is User model
                if isinstance(user, get_user_model()):
                    instance, created = self.users.through.objects.get_or_create(user=user, room=self, defaults=defaults)
                # if is integer (id)
                elif isinstance(user, int):
                    instance, created = self.users.through.objects.get_or_create(user_id=user, room=self, defaults=defaults)
                else:
                    # ignore the addition of users that aren't by User model or id
                    raise TypeError(_("Users can only be added by id or User object"))

                if not created:
                    if activated is not None: # only use this when group rooms, we MUST pass activated when adding group users
                        instance.set_activated(activated)

                qs.append(instance)
            except IntegrityError: # User id doesn't exist, just skip and continue
                pass
        return qs

    def remove_users(self, users):
        for user in users:
            int_or_user, _type = is_int_or_user(user)
            print(int_or_user, _type)
            if int_or_user:
                try:
                    user_to_delete = None
                    if isinstance(user, int):
                        user_to_delete = self.users.through.objects.get(user_id=user, room=self)
                    elif isinstance(user, get_user_model()):
                        user_to_delete = self.users.through.objects.get(user=user, room=self)
                    user_to_delete.delete()
                except self.users.through.DoesNotExist:
                    pass
            else:
                # ignore the addition of users that aren't by User model or id
                raise TypeError(_("Users can only be added by id or User object"))

    def remove_rooms(self, rooms):
        """
        :param rooms: Array
        :return boolean:
        """
        for room in rooms:
            try:
                assert isinstance(room, int), 'You must pass an integer as room ids to this function.'
                r = self.__class__.objects.get(pk=room)
                r.delete()
                return True
            except self.__class__.DoesNotExist:
                return False
    def name(self, current_username):
        """
        :param current_username: string
        :return channel_name: string
        """
        the_string = []
        # return title if it's set
        if self.title is not '':
            # add the title if it's empty, else break from loop
            if len(the_string) is 0:
                the_string.append(self.title)
        else:
            for index, user in enumerate(self.users.exclude(username=current_username)):
                if index == 4:
                    break
                # if user has set first name, use it
                if user.first_name is not '' or None:
                    # if user has set last name, use last initial
                    if user.last_name is not '' or None:
                        the_string.append('{0} {1}'.format(user.first_name, user.last_name))
                    else:
                        the_string.append(user.first_name)
                else:
                    the_string.append(user.username)
        return ' - '.join(item for item in the_string)

    def channel_name(self, current_username):
        """
        :param current_username: string
        :return other_username: string
        """
        for user in self.users.exclude(username=current_username):
            return user.username

    def __str__(self):
        return '-'.join(
            x[0] for x in self.users.order_by('id').values_list('username')
        )

    def set_active(self, active=True, commit=True):
        self.active = active
        if commit:
            self.save()

    class Meta:
        abstract = True


class Room(BaseRoom):
    pass


class UserReport(models.Model):
    reporter = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='reported_users')
    reportee = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='reports_against')
    timestamp = models.DateTimeField(db_index=True, default=timezone.now)

    SEXUAL_HARASSMENT = 'SH'
    ABUSIVE_CHAT = 'AC'
    UNSOLICITED_NUDITY = 'UN'
    SPAM = 'SP'
    OTHER = 'OT'

    REPORT_CHOICES = (
        (SEXUAL_HARASSMENT, _('Sexual Harassment')),
        (ABUSIVE_CHAT, _('Abusive Chat')),
        (UNSOLICITED_NUDITY, _('Unsolicited Nudity')),
        (SPAM, _('Spam')),
        (OTHER, _('Other'))
    )

    report_type = models.CharField(max_length=2,
                                   choices=REPORT_CHOICES,
                                   default=OTHER)
    comment = models.TextField(blank=True, null=True, default='')


class BaseMessage(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    file = models.ForeignKey(UploadedFile, on_delete=models.SET_NULL, blank=True, null=True)
    timestamp = models.DateTimeField(db_index=True, default=timezone.now)
    content = models.TextField(null=True, blank=True, default='')
    flag_relation = GenericRelation(Flag)

    # Allows us to override fields of this class
    class Meta:
        abstract = True

    def __str__(self):
        return '{0} at {1}'.format(self.user, self.timestamp)


    def create_message_with_file(self, room=None, user=None, file=None):
        """
        create_message_with_file
        :param room: (Room or GroupRoom)
        :param user: (User)
        :param file: (UploadedFile)

        :description Create message with file:
        """
        self.objects.create(room=room, user=user, file=file)

    def send_message(self, room=None, user=None):
        """
        send_message
        :param room: (Room or GroupRoom)
        :param user: (User)

        :description Create message with passed in room and user:
        """
        self.objects.create(room=room, user=user)


class Message(BaseMessage):
    pass


class GroupRoom(BaseRoom):
    """ GroupRoom extends Room

    REASONING FOR DUPLICATION:
    1) Helps to distribute the data and decouple each chat application
    """
    users = models.ManyToManyField(get_user_model(), related_name='group_rooms',  through='GroupChatUser', through_fields=('room', 'user','admin','silenced', 'active'))
    expiry = models.DateTimeField(default=None, blank=True, null=True)
    private = models.BooleanField(default=False)
    location = PointField(srid=4326, null=True, blank=True)
    through_objects = GroupRoomQuerySet().as_manager()
    def channel_name(self, room_id=None):
        """

        :param room_id: integer
        :return :
        """
        return room_id if room_id is not None else self.id

    def add_join_request(self, requester=None, requested=None, admin=False, message=None):
        jr = JoinRequest.objects.get_or_create(requester_id=requester,
                                               requested_id=requested,
                                               admin=admin,
                                               message=message,
                                               content_object=self)
        return jr

    @property
    def lat_long(self):
        return normalize_lat_long(self.location)

    @property
    def expired(self):
        return False

    def add_admin_user(self, user=None, users=None):
        if users is not None and len(users) > 0:
            return self.users.through.objects.filter(id__in=users).update(admin=True)
        if user is not None:
            instance, created = self.users.through.objects.get_or_create(user_id=user, admin=True, room=self)
            return instance
        raise ValidationError(_('Either a single user id or array of user ids must be sent as parameters'))

class GroupMessage(BaseMessage):
    room = models.ForeignKey(GroupRoom, on_delete=models.CASCADE, related_name='g_messages')


class BaseChatUser(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    date_joined = models.DateTimeField(null=False, default=timezone.now())
    date_blocked = models.DateTimeField(null=True, blank=True)
    last_activity = models.DateTimeField(null=True, blank=True, default=timezone.now())
    silenced = models.BooleanField(default=False)

    class Meta:
        abstract = True
        unique_together = ['room', 'user']

    def block(self):
        self.date_blocked = timezone.now()
        self.save()

    def unblock(self):
        self.date_blocked = None
        self.save()

    @property
    def blocked(self):
        return True if self.date_blocked is not None else False

    @property
    def active(self):
        return (timezone.now() - self.last_activity).seconds < 20 if self.last_activity is not None else False

class ChatUser(BaseChatUser):
    pass

class GroupChatUser(BaseChatUser):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    room = models.ForeignKey(GroupRoom, on_delete=models.CASCADE)
    admin = models.BooleanField(default=False)
    activated = models.BooleanField(default=False)

    def set_activated(self, activated=False):
        self.activated = activated
        self.save()

    def set_admin(self, admin=True):
        self.admin = admin
        self.save()

    def delete(self, user=None, *args, **kwargs):
        super(GroupChatUser, self).delete(*args, **kwargs)

    @property
    def location(self):
        return normalize_lat_long(self.location)

enable_flagging_on(Message)
enable_flagging_on(GroupMessage)