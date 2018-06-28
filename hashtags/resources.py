from django.contrib.auth.models import User
from tastypie.contrib.contenttypes.fields import GenericForeignKeyField
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.resources import ModelResource
from larb.models import UserProfile, Post, Like, \
			HashTag, HashTagged_Item
from friendship.models import Friend, FriendshipRequest, \
			Follow


class UserResource(ModelResource):
	
	class Meta:
		queryset = User.objects.all().order_by('username')
		resource_name = 'user'
		fields = ['username', 'first_name', 'last_name']
		authorization = Authorization()

	def facebook_login(self, request, **kwargs):
		self.method_check(request, allowed=['post'])

		data = self.deserialize(request, request.raw_post_data, format=request.META.get('CONTENT_TYPE', 'application/json'))

		access_token = data.get('access_token', '')

		from allauth.socialaccount import providers
		from allauth.socialaccount.models import SocialLogin, SocialToken, SocialApp
		from allauth.socialaccount.providers.facebook.views import fb_complete_login
		from allauth.socialaccount.helpers import complete_social_login
		try:
			app = SocialApp.objects.get(provider="facebook")
			token = SocialToken(app=app,
								token=access_token)
			login = fb_complete_login(app, token)
			login.token = token
			login.state = SocialLogin.state_from_request(request)
			ret = complete_social_login(request, login)

			#if we get here we've succeeded
			return self.create_response(request, {
					'success': True,
					'username': request.user.username,
					'user_id': request.user.pk,
					'api_key': request.user.api_key.key,
					} ) 
		except:
			# FIXME: Catch only what is needed
			return self.create_response(request, {
					'success': False,
					'reason': "Bad Access Token",
					}, HttpForbidden ) 

class UserProfileResource(ModelResource):


	user = fields.ForeignKey(UserResource, "user", full=True)
	
	
	class Meta:
		queryset = UserProfile.objects.all().order_by('user__username')
		resource_name = 'user_profile'
		fields = ['user__username', 'user__first_name', 'user__last_name', 'date_of_birth','about_me','gender','rel_status','is_private']
		authorization = Authorization()
        
class HashTagResource(ModelResource):

    class Meta:
        resource_name = 'hashtag'
        queryset = HashTag.objects.all().order_by('name')


 
class PostResource(ModelResource):


	user = fields.ForeignKey(UserResource, "user", full=True)
	
	
	class Meta:
		queryset = Post.objects.all().order_by('-pub_date')
		resource_name = 'post'
		fields = ['text','picture','user__username','pub_date']
		authorization = Authorization()
		

class LikeResource(ModelResource):


	user = fields.ForeignKey(UserResource, "user", full=True)
	
	
	class Meta:
		queryset = Like.objects.all()
		resource_name = 'like'
		fields = ['content_type','content_object','user']
		authorization = Authorization()
		
class HashTagged_ItemResource(ModelResource):

	user = fields.ForeignKey(UserResource, "user", full=True)
	
	content_object = GenericForeignKeyField({
		HashTag: HashTagResource,
		User: UserResource
	}, 'content_object')

	class Meta:
		resource_name = 'hashtagged_item'
		queryset = HashTagged_Item.objects.all()
       