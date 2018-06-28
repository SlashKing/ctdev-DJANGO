from django.contrib import admin
from . import models


class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ('content_object', 'requester', 'requested')


class MessageAdmin(admin.ModelAdmin):
    list_display = ('room', 'user', 'timestamp')


class RoomAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'active', 'title')


class GroupRoomAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'active', 'title')


class GroupMessageAdmin(admin.ModelAdmin):
    list_display = ('room', 'user', 'timestamp')


class ChatUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'date_joined', 'blocked', 'silenced')


class GroupChatUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'date_joined', 'blocked', 'silenced')


admin.site.register(models.JoinRequest, JoinRequestAdmin)
admin.site.register(models.Message, MessageAdmin)
admin.site.register(models.GroupMessage, GroupMessageAdmin)
admin.site.register(models.Room, RoomAdmin)
admin.site.register(models.GroupRoom, GroupRoomAdmin)
admin.site.register(models.ChatUser, ChatUserAdmin)
admin.site.register(models.GroupChatUser, GroupChatUserAdmin)
