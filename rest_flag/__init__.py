__version__ = '0.0.'
def enable_flagging_on(cls, manager_name='objects',
                     flag_name='flag', flag_count_name='flag_count', flag_relation_name='flag_relation',
                     remove_flag_name='remove_flag', add_flag_name='add_flag', has_flagged_name='has_flagged',
                     remove_flag_instances_name='remove_flag_instances', base_manager=None):
    from django.contrib.contenttypes.fields import GenericRelation
    from django.db.models import Q
    from rest_flag.models import Flag
    from rest_flag.utils import flag as flag_util

    def flag(self):
        return getattr(self, flag_relation_name).all()[0] if not getattr(self, flag_relation_name).count() is 0 else None

    def add_flag(self, user=None, ip=None, comment=None):
        return flag_util(self, user, ip, comment)

    def remove_flag(self):
        a_flag = getattr(self, flag_name)
        if a_flag is None:
            return []
        return a_flag.delete()

    def remove_flag_instances(self, user=None):
        a_flag = getattr(self, flag_name)
        if a_flag is None:
            return []
        if user is None:
            return a_flag.flags.all().delete()
        return a_flag.flags.filter(user=user).delete()

    def has_flagged(self, user=None):
        """
        Determine whether the request User has flagged the content object

        :param self:
        :param user: <User>
        :return: boolean
        """
        if user is None or self.flag is None:
            return False
        if self.flag.flags.filter(user=user).exists():
            return True
        return False


    # gets added to the class as a property, not under this name
    def get_total(self):
        a_flag = getattr(self, flag_name)
        return a_flag.flags.count() if not a_flag is None else 0

    cls.add_to_class(flag_relation_name, GenericRelation(Flag))
    cls.add_to_class(flag_count_name, property(get_total))
    cls.add_to_class(flag_name, property(flag))
    cls.add_to_class(has_flagged_name, has_flagged)
    cls.add_to_class(add_flag_name, add_flag)
    cls.add_to_class(remove_flag_name, remove_flag)
    cls.add_to_class(remove_flag_instances_name, remove_flag_instances)
    setattr(cls, '_flagging_enabled', True)

def add_flagging_routes(cls):
    from django.shortcuts import get_object_or_404
    from django.contrib.contenttypes.models import ContentType
    from rest_flag.api import CreateFlag
    from rest_flag.models import Flag, FlagInstance
    from rest_framework.decorators import list_route, detail_route
    from rest_framework.response import Response
    from rest_framework import status
    from django.utils.translation import ugettext_lazy as _

    @detail_route(methods=['post'])
    def add_flag(self, request, pk=None, *args, **kwargs):
        return CreateFlag.post(self, request, self.get_object())

    @detail_route(methods=['post'])
    def remove_flag(self, request, pk=None, *args, **kwargs):
        obj = self.get_object()
        queryset = []
        if obj.has_flagged(user=request.user) or (request.user.is_staff and obj.flag is not None):
            if request.user.is_staff:
                queryset = obj.remove_flag()
                return Response({'success': queryset})
            if obj.flag_count is 1:
                queryset = obj.remove_flag()
                return Response({'success': queryset})
            queryset = obj.remove_flag_instances(user=request.user)
            return Response({'success': queryset})
        return Response({'error': _('There is no flag associated with this object')}, status=status.HTTP_404_NOT_FOUND)

    @detail_route(methods=['post'])
    def remove_flag_instances(self, request, pk=None, *args, **kwargs):
        obj = self.get_object()
        queryset = []
        if obj.has_flagged(user=request.user) or (request.user.is_staff and obj.flag is not None):
            if request.user.is_staff:
                queryset = obj.remove_flag()
                return Response({'success': queryset})
            if obj.flag_count > 0 and obj.flag_count is 1:
                # you are the only one that flagged; delete the Flag
                queryset = obj.remove_flag()
            queryset = obj.remove_flag_instances(user=request.user)
            return Response({'success': queryset})
        return Response({'error': _('There is no flag associated with this object')}, status=status.HTTP_404_NOT_FOUND)


    setattr(cls, "add_flag", add_flag)
    setattr(cls, "remove_flag", remove_flag)
    setattr(cls, "remove_flag_instances", remove_flag_instances)