# -*- coding: utf-8 -*-
from __future__ import unicode_literals, print_function

from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import detail_route, list_route
from friendship.models import Follow, Friend, FriendshipRequest
from friendship.exceptions import AlreadyExistsError, AlreadyFriendsError
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from api.serializers import FriendSerializer, UserSerializer
from django.db.models import Q
from chat.utils import notify_on_friend_request, notify_on_friend_accepted

from .serializers import get_user_serializer, FriendshipRequestSerializer, FollowSerializer


class FriendViewSet(viewsets.ModelViewSet):
	"""
	ViewSet for Friend model
	"""
	queryset = Friend.objects.none()
	model = get_user_model
	serializer_class = FriendSerializer
	def get_queryset(self):
		filter = self.request.query_params.get('filter', '')
		if filter is not '':
			self.queryset = Friend.objects.filter(
				Q(from_user__id=self.request.user.id) & 
				Q(to_user__username__icontains=filter))
			#return self.queryset
		#self.queryset = Friend.objects.friends(user=self.request.user)
		#self.serializer_class = get_user_serializer()
		return self.queryset
	#def list(self, request):
	#	super(FriendViewSet,self).list(request)
	#	serializer = self.serializer_class(self.queryset, many=True, context={'request':request})				
	#	return Response(serializer.data)
	#	#return Response([])
	
	@list_route()
	def requests(self, request):
		friend_requests = Friend.objects.unrejected_requests(user=request.user)
		return Response(FriendshipRequestSerializer(friend_requests, many=True).data)
	
	@list_route()
	def sent_requests(self, request):
		friend_requests = Friend.objects.sent_requests(user=request.user)
		return Response(FriendshipRequestSerializer(friend_requests, many=True).data)
	
	@list_route()
	def rejected_requests(self, request):
		friend_requests = Friend.objects.rejected_requests(user=request.user)
		return Response(FriendshipRequestSerializer(friend_requests, many=True).data)
	
	def create(self, request):
		"""
		Creates a friend request
		
		POST data:
		- user_id
		- message
		"""
		friend_obj = Friend.objects.add_friend(
			request.user,                                                     # The sender
			get_object_or_404(get_user_model(), pk=request.data['user_id']),  # The recipient
			message=request.data['message']
		)
		notify_on_friend_request(friend_obj)
		return Response(
			FriendshipRequestSerializer(friend_obj, context={'request':request}).data,
			status.HTTP_201_CREATED
		)

	@detail_route(methods=['post'])
	def remove(self, request, pk=None):
		friend = get_object_or_404(get_user_model(), pk=pk)
		if(Friend.objects.remove_friend(request.user, friend)):
			return Response(
				{
					'response':'You are no longer friends with %s. That\'s a shame; hope you can patch things up!' % friend.username,
					'to_user': pk,
				},
				status.HTTP_204_NO_CONTENT
			)
		else:
			return Response({
				'response':'You are already friends with %s. Right on! Something probably went wrong on our end; sorry about that!}' %
					friend.username},
				status.HTTP_200_OK)

	@method_decorator(cache_page(0))
	def dispatch(self, *args, **kwargs):
		return super(FriendViewSet, self).dispatch(*args, **kwargs)
class FriendshipRequestViewSet(viewsets.ViewSet):
	"""
	ViewSet for FriendshipRequest model
	"""

	@detail_route()
	def requests(self, request, pk=None):
		friend_requests = Friend.objects.unrejected_requests(user=get_object_or_404(get_user_model(), pk=pk))
		return Response(FriendshipRequestSerializer(friend_requests, many=True, context={'request':request}).data)
	
	@detail_route()
	def sent_requests(self, request, pk=None):
		friend_request = Friend.objects.sent_requests(user=get_object_or_404(get_user_model(), pk=pk))
		return Response(FriendshipRequestSerializer(friend_requests, many=True, context={'request':request}).data)	
	
	@detail_route()
	def sent_request(self, request, pk=None):
		friend_request = get_object_or_404(FriendshipRequest, pk=FriendshipRequest.objects.filter(from_user__id=request.user.id, to_user__id=pk))
		return Response(FriendshipRequestSerializer(friend_request, context={'request':request}).data)
	
	@detail_route()
	def received_request(self, request, pk=None):
		friend_request = get_object_or_404(FriendshipRequest, pk=FriendshipRequest.objects.filter(to_user__id=request.user.id, from_user__id=pk))
		return Response(FriendshipRequestSerializer(friend_request, context={'request':request}).data)
		
	@detail_route()
	def rejected_requests(self, request, pk=None):
		friend_requests = Friend.objects.rejected_requests(user=get_object_or_404(get_user_model(), pk=pk))
		return Response(FriendshipRequestSerializer(friend_requests, many=True, context={'request':request}).data)

	@detail_route(methods=['post'])
	def accept(self, request, pk=None):
		friendship_request = get_object_or_404(FriendshipRequest, pk=pk)
		friendship_request.accept()
		notify_on_friend_accepted(friendship_request)
		return Response(
			FriendshipRequestSerializer(friendship_request, context={'request':request}).data,
			status.HTTP_206_PARTIAL_CONTENT
		)
	@detail_route(methods=['post'])
	def reject(self, request, pk=None):
		friendship_request = get_object_or_404(FriendshipRequest, pk=pk)
		friendship_request.reject()
		return Response(
			FriendshipRequestSerializer(friendship_request, context={'request':request}).data,
			status.HTTP_206_PARTIAL_CONTENT
		)
	@detail_route(methods=['post'])
	def cancel(self, request, pk=None):
		friendship_request = get_object_or_404(FriendshipRequest, pk=pk)
		response = friendship_request.cancel()
		return Response(
			{'friend_request_deleted': response},
			status.HTTP_204_NO_CONTENT
		)	
	@detail_route(methods=['post'])
	def mark_viewed(self, request, pk=None):
		friendship_request = get_object_or_404(FriendshipRequest, pk=pk)
		friendship_request.mark_viewed()
		return Response(
			FriendshipRequestSerializer(friendship_request, context={'request':request}).data,
			status.HTTP_206_PARTIAL_CONTENT
		)
	@method_decorator(cache_page(0))
	def dispatch(self, *args, **kwargs):
		return super(FriendshipRequestViewSet, self).dispatch(*args, **kwargs)

	
class FollowViewSet(viewsets.ModelViewSet):
	"""
	ViewSet for Follow model
	"""
	queryset=Follow.objects.none()
	serializer_class = FollowSerializer
	def list(self, request):
		follows = Follow.objects.filter(followee=request.user)
		serializer = self.serializer_class(follows, many=True,context={'request':request})
		return Response(serializer.data)
	@detail_route(methods=['post'])
	def remove_follow(self, request, pk=None):
		followee = get_object_or_404(get_user_model(), pk=pk)
		if(Follow.objects.remove_follower(request.user, followee)):
			return Response(
				{'response: Stopped following %s' % followee.username},
				status.HTTP_201_CREATED
			)
		else:
			return Response({'response':'You weren''t following %s; we have been notified of the error.}' % followee.username},status.HTTP_201_CREATED)
		
	@detail_route()
	def following(self, request, pk=None):
		followers = Follow.objects.following(get_object_or_404(get_user_model(), pk=pk))
		serializer = get_user_serializer()	
		return Response(serializer(followers, many=True, context={'request':request}).data)
	@detail_route()
	def followers(self, request, pk=None):
		followers = Follow.objects.followers(get_object_or_404(get_user_model(), pk=pk))
		serializer = get_user_serializer()
		return Response(serializer(followers, many=True, context={'request':request}).data)
	@list_route()
	def my_following(self, request):
		filter = request.query_params.get('filter_text', '')
		if filter is not '':
			# set filter to something stupid because icontains returns all objects when empty string
			# gets passed into the function
			#if filter is '':
			#	filter = '_S@S@X#$#$@'
			self.queryset = Follow.objects.filter(
				Q(follower__id=request.user.id) & 
				Q(followee__username__icontains=filter))
			
			self.serializer_class = FollowSerializer
		else:
			self.queryset = Follow.objects.following(request.user)
			self.serializer_class = get_user_serializer()
		page = self.paginate_queryset(self.queryset)
		if page is not None:
			self.serializer_class = self.serializer_class(page, context={'request':request},many=True)
			return self.get_paginated_response(self.serializer_class.data)
		return Response(self.serializer_class(self.queryset, many=True, context={'request':request}).data)	
	@list_route()
	def my_followers(self, request):
		queryset = self.queryset
		filter = request.query_params.get('filter_text', None)
		if filter is not None:
			# set filter to something stupid because icontains returns all objects when empty string
			# gets passed into the function
			if filter is '':
				filter = '_S@S@X#$#$@'
			queryset = Follow.objects.filter(
				Q(followee__id=request.user.id) & 
				Q(follower__username__icontains=filter))
			serializer = FollowSerializer
		#else:
		#	queryset = Follow.objects.followers(request.user)
		#	serializer = get_user_serializer()
		
		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = serializer(page, context={'request':request},many=True)
			return self.get_paginated_response(serializer.data)
		return Response(serializer(queryset, many=True, context={'request':request}).data)	
	@detail_route(methods=['post'])
	def follow(self, request, pk=None):
		followee = get_object_or_404(get_user_model(), pk=pk)
		try:
			follow = Follow.objects.add_follower(follower=request.user, followee=followee)
			return Response(
				FollowSerializer(follow, context={'request':request}).data,
				status.HTTP_201_CREATED
			)
		except AlreadyExistsError as e:
			follow = Follow.objects.add_follower(follower=request.user, followee=followee)
			return Response(
				FollowSerializer(follow, context={'request':request}).data,
				status.HTTP_409_CONFLICT
			)
		