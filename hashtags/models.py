import os
from django.contrib.auth.models import User 
from django.db import models	
from django.utils.timezone import now as timezone_now
from django.contrib.contenttypes.fields import GenericForeignKey,GenericRelation
from django.contrib.contenttypes.models import ContentType


class HashTag(models.Model):
	name = models.TextField(max_length=50, blank=False, null=False)
	
	def __str__(self):
		return "#%s" % self.name
	class Meta:
		db_table = 'hashtag'
		verbose_name = 'Hashtag'
		verbose_name_plural = 'Hashtags'	

	def get_absolute_url(self):
		return ('hashtag', None, {'hashtag': str(self.name)})
	get_absolute_url = models.permalink(get_absolute_url)
    
class HashTagged_Item(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hashtag_users')
	hashtag = models.ForeignKey(HashTag, on_delete=models.CASCADE, related_name='hashtag_hashtagged_items')
	content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
	object_id = models.PositiveIntegerField()
	content_object = GenericForeignKey('content_type', 'object_id')
	def __str__(self):
		return "%s hashtagged #%s (%s)" % (self.user.username,self.hashtag.name,self.content_object)

	class Meta:
		db_table = 'hashtagged_item'
		verbose_name = 'Hashtagged Item'
		verbose_name_plural = 'Hashtagged Items'