import os
from django.contrib.auth.models import User
from django.db import models
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount
from django.utils.timezone import now as timezone_now
from django.contrib.contenttypes.fields import GenericForeignKey,GenericRelation
from django.contrib.contenttypes.models import ContentType
from PIL import Image
from django.core.files import File
from django.core.files.storage import default_storage as storage
import hashlib
from picture_comments.models import PictureComment
from hashtags.models import HashTagged_Item, HashTag
import secretballot
from cicu.models import UploadedFile
from django.contrib.gis.db.models import PointField
from .countries import *
from .states import *
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
	picture = models.ForeignKey(UploadedFile, blank=True, null=True, on_delete=models.SET_NULL)
	comments_set = GenericRelation(PictureComment)
	#hashtagged_posts = GenericForeignKey('content_type','object_id')
	def __str__(self):
		return "%s posted %s on %s" % (self.user, self.text, self.pub_date)


	class Meta:
		db_table = 'user_post'
		verbose_name = 'post'
		verbose_name_plural = 'posts'


	def save(self, *args, **kwargs):
		super(Post, self).save(*args, **kwargs)
		# generate thumbnail picture version
		if self.picture is not None:
			self.create_thumbnail()

	def delete(self, *args, **kwargs):
		super(Post, self).delete(*args, **kwargs)
		if self.picture != None:
			self.picture.file.delete()
	delete.alters_data = True
    
	def get_absolute_url(self):
		return ('post_detail', None, {'post': str(self.pk)})
	get_absolute_url = models.permalink(get_absolute_url)
    
	def create_thumbnail(self):
		if not self.picture.file:
			return ''
		else:
			try:	
				file_path = self.picture.file.path
				filename_base, filename_ext = os.path.splitext(file_path)
				f = open(file_path, 'rb')
				f.seek(0)
				image = Image.open(f)
				if image.format == 'JPEG':
					thumbnail_file_path = '%s_thumbnail.jpg' % filename_base
				elif image.format == 'PNG':
					thumbnail_file_path = '%s_thumbnail.png' % filename_base
				elif image.format == 'GIF':
					thumbnail_file_path = '%s_thumbnail.gif' % filename_base
				else:
					thumbnail_file_path = '%s_thumbnail.jpg' % filename_base
				if storage.exists(thumbnail_file_path):
					# if thumbnail version exists, return its url path
					return 'exists'
				# resize the original image and
				# return URL path of the thumbnail version
				width, height = image.size
				thumbnail_size = 75, 75

				if width > height:
					delta = width - height
					left = int(delta/2)
					upper = 0
					right = height + left
					lower = height
				else:
					delta = height - width
					left = 0
					upper = int(delta/2)
					right = width
					lower = width + upper
				image = image.crop((left, upper, right, lower))
				image = image.resize(thumbnail_size, Image.ANTIALIAS)
				f_mob = open(thumbnail_file_path, 'wb')
				if not image.mode == "RGB":
					image.convert("RGB")
				if image.format == 'JPEG':
					image.save(f_mob,'JPEG')
				elif image.format == 'PNG':
					image.save(f_mob,'PNG')
				elif image.format == 'GIF':
					image.save(f_mob,'GIF')
				else:
					image.save(f_mob,'JPEG')
				f_mob.close()
				image.close()
				return 'success'
			except:
				return 'error'
			
	def get_thumbnail_picture_url(self):
		if not self.picture.file:
			return ''
		file_path = self.picture.file.path
		f = open(file_path, 'rb')
		f.seek(0)
		image = Image.open(f)
		file_name = self.picture.file.name
		filename_base, filename_ext = os.path.splitext(file_name)
		if image.format == 'JPEG':
			thumbnail_file_path = '%s_thumbnail.jpg' % filename_base
		elif image.format == 'PNG':
			thumbnail_file_path = '%s_thumbnail.png' % filename_base
		elif image.format == 'GIF':
			thumbnail_file_path = '%s_thumbnail.gif' % filename_base
		else:
			thumbnail_file_path = '%s_thumbnail.jpg' % filename_base
		f.close()
		image.close()
		if storage.exists(thumbnail_file_path):
			# if thumbnail version exists, return its URL path
			return storage.url(thumbnail_file_path)
		# return original as a fallback
		return self.picture.file.url

secretballot.enable_voting_on(Post)		

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
		defaults = {'min_value': self.min_value, 'max_value':self.max_value}
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
	BI = 'BI'
	GENDER_CHOICES = (
		(MALE, 'Male'),
		(FEMALE, 'Female'),
	)
	INT_CHOICES = (
		(MALE, 'Male'),
		(FEMALE, 'Female'),
		(BI, 'Bi-Sexual'),
		)
	user = models.OneToOneField(User, related_name='profile')
	profile_image = models.ForeignKey(UploadedFile, blank=True, null=True, default='', on_delete=models.SET_NULL, related_name='profile_image')
	cover_image = models.ForeignKey(UploadedFile, blank=True, null=True, default='', on_delete=models.SET_NULL, related_name='cover_image')
	about_me = models.TextField(null=True, blank=True)
	date_of_birth = models.DateField(blank=True, null=False, default=timezone_now())
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
	location = PointField(srid=4326, null=True, blank=True)
	interested_in = models.CharField(max_length=2,
                              choices=INT_CHOICES,
                              default=BI)
	maxdistance = models.SmallIntegerField(validators=[MaxValueValidator(2500), MinValueValidator(1)],
		blank=True,default=250)
    
	def __str__(self):
		return "%s's profile" % self.user

	class Meta:
		db_table = 'user_profile'
		verbose_name = 'user profile'
		verbose_name_plural = 'user profiles'
	
	def profile_image_url(self):
		"""
		Return the URL for the user's Facebook icon if the user is logged in via Facebook,
		otherwise return the user's Gravatar URL
		"""
		fb_uid = SocialAccount.objects.filter(user_id=self.user.id, provider='facebook')
		
		if len(fb_uid):
			return "http://graph.facebook.com/{}/picture?width=125&height=125".format(fb_uid[0].uid)
		elif self.user.profile.profile_image is not None:
			return self.user.profile.profile_image.file.url
		else:
			return "http://www.gravatar.com/avatar/{}?s=125".format(
				hashlib.md5(self.user.email.encode('utf-8')).hexdigest())
		
	def cover_image_url(self):
		"""
		Return the URL for the user's Facebook icon if the user is logged in via Facebook,
		otherwise return the user's Gravatar URL
		"""
		if self.user.profile.cover_image is not None:
			return self.user.profile.cover_image.file.url
		else:
			return "http://420withme.com/media/users/cover/none.jpg"
            
	def account_verified(self):
		"""
		If the user is logged in and has verified hisser email address, return True,
		otherwise return False
		"""
		result = EmailAddress.objects.filter(email=self.user.email)
		if len(result):
			return result[0].verified
		return False


User.profile = property(lambda u: UserProfile.objects.get_or_create(user=u)[0])

