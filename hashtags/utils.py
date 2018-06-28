import re
import json
import urllib
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.utils.encoding import force_str, force_text, force_bytes
from hashtags.models import HashTag, HashTagged_Item
from picture_comments.models import PictureComment
#from larb.models import Post
from notifications.signals import notify
from notifications.models import Notification

mention_pattern = re.compile(r'[@]+([-_a-zA-Z0-9]+)')
hashtag_pattern = re.compile(r'[#]+([-_a-zA-Z0-9]+)')

def notify_on_mention(text, object, user):
	# parsing text looking for mentions (@) to be linked with the object
	# user should always exist
	# TODO : fail-safe perhaps in case a user deletes their profile 
	#        at the exact moment that they are mentioned?	
	user = User.objects.get(id=user.id)
	mention_list = []
	for username in mention_pattern.findall(force_str(text)):
		mention_list.append(username)
	
	for mention in mention_list:
		# make sure the recipient exists first, else continue the loop
		# TODO: create front-end search mechanism for users when they start a word with (@)
		try:
			recipient = User.objects.get(username=mention)
			verb = ''
			if isinstance(object, PictureComment):
				verb = u'mentioned you in a comment'
				#content_object = Post.objects.get(id=object.object_pk)
			else:
				verb = u'mentioned you in a post'
				#content_object = object
			notify.send(user, recipient=recipient, verb=verb,
                action_object=object, description=u'', target=recipient)
		except ObjectDoesNotExist:
			continue
def notify_on_friend_request(friend_request):
	# parsing text looking for mentions (@) to be linked with the object	
	# TODO : fail-safe perhaps in case a user deletes their profile 
	#        at the exact moment that they are mentioned?	
	user = User.objects.get(id=friend_request.from_user.id)
	verb = u'wants to be friends'
	notify.send(friend_request.from_user, recipient=friend_request.to_user, verb=verb,
		action_object=None, description=u'', target=friend_request.to_user)	
def notify_on_friend_accepted(friend_request):
	# parsing text looking for mentions (@) to be linked with the object	
	user = User.objects.get(id=friend_request.from_user.id)
	verb = u'and you are now friends'
	notify.send(friend_request.from_user, recipient=friend_request.to_user, verb=verb,
		action_object=None, description=u'', target=friend_request.to_user)
	notify.send(friend_request.to_user, recipient=friend_request.from_user, verb=verb,
		action_object=None, description=u'', target=friend_request.from_user)		

def urlize_mentions(text):
	"""
	Converts m in plain text into clickable links.
	For example, if value of ``text`` is "This is a #test.", the output will be::
		This is a
		<a href="[reversed url for profile(request, mention='test')]">
		#test</a>.
	Note that if the value of ``text`` already contains HTML markup, things
	won't work as expected. Prefer use this with plain text.
	"""
	def repl(m):
		mention = m.group(1)
		url = reverse('profile', kwargs={'username':mention})
		return '<a class="lo-green" href="%s">@%s</a>' % (url, mention)
	return mention_pattern.sub(repl, force_str(text))


def link_hashtags_to_model(text, object, user):
	# parsing text looking for hashtags to be linked with the object	
	user = User.objects.get(id=user.id)
	hashtag_list = []
	for hname in hashtag_pattern.findall(force_str(text)):
		hashtag, created = HashTag.objects.get_or_create(name=hname)
		if created:
			hashtag.save()
		hashtag_list.append(hashtag)			
	# linking object to the new hashtags
	#ct=ContentType.objects.get_for_model(object)
	for hashtag in hashtag_list:
		object_tag = object.tags.filter(id=hashtag__id)
		if object_tag is None:
			object.tags.add(hashtag)
			

def urlize_hashtags(text):
	"""
	Converts hashtags in plain text into clickable links.
	For example, if value of ``text`` is "This is a #test.", the output will be::
		This is a
		<a href="[reversed url for hashtagged_item_list(request, hashtag='test')]">
		#test</a>.
	Note that if the value of ``text`` already contains HTML markup, things
	won't work as expected. Prefer use this with plain text.
	"""
	def repl(m):
		hashtag = m.group(1)
		url = reverse('hashtagged_item_list', kwargs={'hashtag': hashtag})
		return '<a class="lo-yellow" href="%s">&#035;%s</a>' % (url, hashtag)
	return hashtag_pattern.sub(repl, force_str(text))