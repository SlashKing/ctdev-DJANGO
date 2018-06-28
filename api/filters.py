from django_filters.filterset import FilterSet
from django_filters.filters import CharFilter
from larb.models import Post, UserProfile

from rest_framework import generics



class PostFilter(FilterSet):

    user = CharFilter(name="user__username")

    class Meta:

        model = Post
        fields = ['user', 'text','pub_date']
        
class UserProfileFilter(FilterSet):

	class Meta:

		model = UserProfile

		fields = ['gender',]