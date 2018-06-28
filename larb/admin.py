from django.contrib import admin
from larb.models import UserProfile, Post

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
	list_display = ('user',)
	list_display_links = ('user',)
	search_fields = ['user__username']
	exclude = ['location']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
	list_display = ('user','text','pictures')
	list_display_links = ('user',)
	search_fields = ['user__username']   