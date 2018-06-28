from django.contrib import admin
from django.core.urlresolvers import reverse

from rest_flag.models import Flag, Reason, FlagInstance, CONTENT_APPROVED, \
    CONTENT_REJECTED, REVIEW
from datetime import datetime


class FlagAdmin(admin.ModelAdmin):
    list_filter = ('status',)
    list_display = ('status', 'link', 'created',
        'reviewer', 'reviewed', 'num_flags')

    actions = ['review', 'approve', 'reject']
    actions_on_bottom = True

    def num_flags(self, obj):
        return obj.flags.all().count()

    def link(self, obj):
        """give an admin link"""
        try:
#             import pdb;pdb.set_trace()
            link = u'<a href="%s">%s</a>' % (reverse("admin:%s_%s_change" % (obj.content_object._meta.app_label,
                                                                             obj.content_object._meta.object_name.lower()),
                                                     args=(obj.content_object.id,)),
                                             obj.content_object)
            return link
        except TypeError:
            return
    link.allow_tags = True

    def review(self, request, queryset):
        for obj in queryset:
            obj.status = REVIEW
            obj.reviewer = request.user
            obj.reviewed = datetime.now()
            obj.save()
    review.short_description = "Set content to be reviewed further. (Block access until further revision)"

    def approve(self, request, queryset):
        for obj in queryset:
            obj.status = CONTENT_APPROVED
            obj.reviewer = request.user
            obj.reviewed = datetime.now()
            obj.save()
    approve.short_description = "Approve content on selected flags. (Save content)"

    def reject(self, request, queryset):
        for obj in queryset:
            obj.status = CONTENT_REJECTED
            obj.reviewer = request.user
            obj.reviewed = datetime.now()
            obj.save()
    reject.short_description = "Reject content on selected flags. (Delete content)"

    def get_actions(self, request):
        actions = super(FlagAdmin, self).get_actions(request)
        del actions['delete_selected']
        return actions


class ReasonAdmin(admin.ModelAdmin):
    list_display = ('title', 'comment')


class FlagInstanceAdmin(admin.ModelAdmin):
    list_filter = ('flag__content_type', )
    list_display = ('content_type', 'user', 'link', 'reason', 'created')

    def content_type(self, obj):
        return obj.flag.content_type
    content_type.admin_order_field = 'flag__content_type'

    def created(self, obj):
        return obj.flag.created
    created.admin_order_field = 'flag__created'

    def link(self, obj):
        """give an admin link"""
        try:
            #             import pdb;pdb.set_trace()
            link = u'<a href="%s">%s</a>' % (reverse("admin:%s_%s_change" % (obj.flag.content_object._meta.app_label,
                                                                             obj.flag.content_object._meta.object_name.lower()),
                                                     args=(obj.flag.content_object.id,)),
                                             obj.flag.content_object)
            return link
        except TypeError:
            return

    link.allow_tags = True

admin.site.register(Flag, FlagAdmin)
admin.site.register(FlagInstance, FlagInstanceAdmin)
admin.site.register(Reason, ReasonAdmin)
