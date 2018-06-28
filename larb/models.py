import os
from django.contrib.auth.models import User
from django.db import models
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount
from django.utils.timezone import now as timezone_now
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.files import File
import hashlib
from picture_comments.models import PictureComment
from hashtags.models import HashTagged_Item, HashTag
from hashtags.utils import link_hashtags_to_model, notify_on_mention
from notifications.models import Notification
import secretballot
from cicu.models import UploadedFile, ProfilePicture
from django.contrib.gis.db.models import PointField, GeoManager
from .countries import *
from .states import *
from django.db.models import Q
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.postgres.fields import ArrayField


class PictureMixin(object):
    @property
    def uploaded_file(self):
        try:
            ajax_file = UploadedFile.objects.get(pk=self.id)
        except UploadedFile.DoesNotExist:
            return None
        return ajax_file


class Post(models.Model, PictureMixin):
    user = models.ForeignKey(User)
    pub_date = models.DateTimeField(default=timezone_now())
    text = models.TextField()
    notifications = GenericRelation(Notification, content_type_field='action_object_content_type_id',
                                    object_id_field='action_object_object_id')
    pictures = GenericRelation(UploadedFile, content_type_field='content_type_id', object_id_field='object_pk')
    comments_set = GenericRelation(PictureComment,
                                   content_type_field='content_type',
                                   object_id_field='object_pk',
                                   )
    tags = models.ManyToManyField(HashTag)

    def __str__(self):
        return "%s posted %s on %s" % (self.user, self.text, self.pub_date)

    class Meta:
        db_table = 'user_post'
        verbose_name = 'post'
        verbose_name_plural = 'posts'

    def save(self, *args, **kwargs):
        # first must save the object before we can use the many_to_many field
        super(Post, self).save(*args, **kwargs)
        link_hashtags_to_model(self.text, self, self.user)
        notify_on_mention(self.text, self, self.user)
        # generate thumbnail picture version
        if self.pictures is not None:
            for p in self.pictures.all():
                p.create_thumbnail()

    def delete(self, *args, **kwargs):

        super(Post, self).delete(*args, **kwargs)

    delete.alters_data = True

    def get_absolute_url(self):
        return ('post_detail', None, {'post': str(self.pk)})

    get_absolute_url = models.permalink(get_absolute_url)


# @receiver(pre_delete,sender=Post, dispatch_uid='post_delete_post')
# def pre_delete_post(sender,instance,using,**kwargs):
# notification objects relating to the post must be deleted
# --> all post notifications use action_object_object_id as a base
# notices = Notification.objects.filter(action_object_object_id=instance.id)
# for n in notices:
#	n.delete()
# for p in instance.pictures:
#	p.delete()

from django.core.validators import MaxValueValidator, MinValueValidator


class IntegerRangeField(models.IntegerField):
    def __init__(self, verbose_name=None, name=None, min_value=None, max_value=None, **kwargs):
        self.min_value, self.max_value = min_value, max_value
        validators = []
        if isinstance(max_value, int):
            validators.append(MaxValueValidator(max_value))
        if isinstance(min_value, int):
            validators.append(MinValueValidator(min_value))
        models.IntegerField.__init__(
            self,
            verbose_name,
            name,
            validators=validators,
            **kwargs
        )

    def formfield(self, **kwargs):
        defaults = {'min_value': self.min_value, 'max_value': self.max_value}
        defaults.update(kwargs)
        return super(IntegerRangeField, self).formfield(**defaults)


class UserProfile(models.Model, PictureMixin):
    PATIENT = 'MP'
    CONNOISSEUR = 'CN'
    BUSINESS = 'BS'
    DOCTOR = 'DR'
    DISPENSARY = 'DS'
    USER_CHOICES = (
        (PATIENT, 'Medical Patient'),
        (CONNOISSEUR, 'Connoisseur'),
        (BUSINESS, 'Business'),
        (DOCTOR, 'Doctor'),
        (DISPENSARY, 'Dispensary'),
    )

    SINGLE = 'SI'
    MARRIED = 'MA'
    DATING = 'DA'
    LOOKING = 'JL'
    COMPLICATED = 'IC'
    ENGAGED = 'EN'
    SEPARATED = 'SE'
    WIDOWED = 'WI'
    REL_STATUS_CHOICES = (
        (SINGLE, 'Single'),
        (MARRIED, 'Married'),
        (DATING, 'In Relationship'),
        (LOOKING, 'Just Looking'),
        (ENGAGED, 'Engaged'),
        (SEPARATED, 'Separated'),
        (WIDOWED, 'Widowed'),
    )
    MALE = 'MA'
    FEMALE = 'FM'
    TRANS = 'TR'
    BI = 'BI'
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (TRANS, 'Transexual'),
    )
    INT_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (BI, 'Bi-Sexual'),
    )
    user = models.OneToOneField(User, related_name='profile')
    images = GenericRelation(ProfilePicture, related_query_name='profile', content_type_field='content_type_id', object_id_field='object_pk')
    profile_image = models.ForeignKey(
        ProfilePicture, blank=True, null=True, default='', on_delete=models.CASCADE, related_name='profile_image')
    cover_image = models.ForeignKey(
        UploadedFile, blank=True, null=True, default='', on_delete=models.CASCADE, related_name='cover_image')
    about_me = models.TextField(null=True, blank=True)
    date_of_birth = models.DateTimeField(blank=True, null=False, default=timezone_now())
    user_type = models.CharField(max_length=2,
                                 choices=USER_CHOICES,
                                 default=PATIENT)
    rel_status = models.CharField(max_length=2,
                                  choices=REL_STATUS_CHOICES,
                                  default=SINGLE)
    gender = models.CharField(max_length=2,
                              choices=GENDER_CHOICES,
                              default=FEMALE)
    address = models.CharField(max_length=200, default="")
    country = models.CharField(choices=COUNTRIES,
                               verbose_name='Country',
                               max_length=50,
                               default=CANADA)
    state = models.CharField(choices=STATES,
                             verbose_name='State',
                             max_length=50,
                             blank=True,
                             null=True,
                             default=None)
    post_code = models.CharField(verbose_name="Postal Code", max_length=12, default="")
    website = models.URLField("Website", blank=True)
    company = models.CharField(max_length=50, blank=True)
    has_accepted_tos = models.BooleanField(default=False, verbose_name='Accept site terms')
    is_18_or_older = models.BooleanField(default=False, verbose_name='I am at least 18 years old')
    is_private = models.BooleanField('Privacy', default=False)
    isApproved = models.BooleanField('Approved to use app in region', default=False)
    location = PointField(srid=4326, null=True, blank=True)
    interested_in = ArrayField(models.CharField(max_length=8,
                                                default=BI, choices=GENDER_CHOICES), default=[TRANS], size=3)

    maxdistance = models.SmallIntegerField(validators=[MaxValueValidator(2500), MinValueValidator(1)],
                                           blank=True, default=250)
    objects = GeoManager()

    def __str__(self):
        return "%s's profile" % self.user

    class Meta:
        db_table = 'user_profile'
        verbose_name = 'user profile'
        verbose_name_plural = 'user profiles'

    def active_profile_images(self, user=None):
        return ProfilePicture.objects.filter(Q(user=user) & Q(priority__gt=0))

    def profile_image_url(self):
        """
        Return the URL for the user's Facebook icon if the user is logged in via Facebook,
        otherwise return the user's Gravatar URL
        """
        fb_uid = SocialAccount.objects.filter(user_id=self.user.id, provider='facebook')

        if len(fb_uid):
            return "http://graph.facebook.com/{}/picture?width=125&height=125".format(fb_uid[0].uid)
        elif self.user.profile.profile_image is not None:
            return "".join(["http://", get_current_site(1).domain, self.user.profile.profile_image.file.url])
        else:
            return "http://www.gravatar.com/avatar/{}?s=125".format(
                hashlib.md5(self.user.email.encode('utf-8')).hexdigest())

    def cover_image_url(self):
        """
        Return the URL for the user's Facebook icon if the user is logged in via Facebook,
        otherwise return the user's Gravatar URL
        """
        if self.user.profile.cover_image is not None:
            return "".join(["http://", get_current_site(1).domain, self.user.profile.cover_image.file.url])
        else:
            return "".join(["http://", get_current_site(1).domain, "/media/users/cover/none.jpg"])

    def account_verified(self):
        """
        If the user is logged in and has verified hisser email address, return True,
        otherwise return False
        """
        result = EmailAddress.objects.filter(email=self.user.email)
        if len(result):
            return result[0].verified
        return False

    def age(self):
        """
        get age of user
        """

        from datetime import date

        born = self.user.profile.date_of_birth
        today = date.today()
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

    def content_type_id(self):
        return ContentType.objects.get_for_model(self).id

    @property
    def lat_long(self):
        latitude = 0
        longitude = 0
        if self.location is not None:
            latitude = self.location.x
            longitude = self.location.y
        return {
            'latitude': latitude,
            'longitude': longitude
        }

    @staticmethod
    def get_location(latitude, longitude):
        from django.contrib.gis.geos import fromstr
        return fromstr("POINT({0} {1})".format(latitude, longitude), srid=4326)


secretballot.enable_voting_on(Post)
secretballot.enable_voting_on(UserProfile)

User.profile = property(lambda u: UserProfile.objects.get_or_create(user=u)[0])
