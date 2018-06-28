from django.contrib import admin
from hashtags.models import HashTag, HashTagged_Item

class HashtagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class HashtaggedItemAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {'fields': ('hashtag',)}),
        ('Content object', {'fields': ('content_type', 'object_id')}),
    )
    list_display = ('hashtag', 'content_type', 'object_id', 'content_object')
    list_filter = ('content_type',)
    search_fields = ('hashtag', 'content_type', 'object_id')

    def content_object(self, obj):
        try:
            url = obj.content_object.get_absolute_url()
        except AttributeError:
            return obj.content_object
        return '<a href="%s">%s</a>' % (url, obj.content_object)
    content_object.allow_tags = True

admin.site.register(HashTag, HashtagAdmin)
admin.site.register(HashTagged_Item, HashtaggedItemAdmin)