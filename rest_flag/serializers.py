import re

from rest_framework import serializers
from rest_framework.reverse import reverse_lazy

from rest_auth.app_settings import UserDetailsSerializer

from .models import *


class ReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reason


class FlagSerializer(serializers.Serializer):
    app_model = serializers.CharField(required=False, max_length=50)
    object_id = serializers.IntegerField()

    comment = serializers.CharField(max_length=300, required=False)
    reason_id = serializers.IntegerField(required=False)

    def validate_app_model(self, attrs, source=None):
        """ check format as 'appname.modelname' """

        value = attrs
        #if not re.match(r'^\w+\.\w+$', value):

        #    raise serializers.ValidationError("wrong format, use 'appname.modelname' ")
        return attrs

    def validate(self, attrs):
        if attrs.get('comment') or attrs.get('reason_id') :
            return attrs
        raise serializers.ValidationError("need to define either reason or comment")


class FlagModelSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    flags = serializers.SerializerMethodField()


    def get_flags(self, obj):
        return FlagInstanceSerializer(obj.flags.all(), context={'request': self.context.get('request')}, many=True).data

    def get_status(self, obj):
        return obj.get_status_display()

    class Meta:
        model = Flag
        fields = ('status','reviewed', 'reviewer', 'flags')

class FlagInstanceSerializer(serializers.ModelSerializer):
    #flag = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return UserDetailsSerializer(obj.user, context={'request': self.context.get('request')} ).data

    #def get_flag(self, obj):
    #    return FlagModelSerializer(obj.flag,context={'request': self.context.get('request')} ).data

    class Meta:
        model = FlagInstance
        fields = ( 'user', 'comment', 'reason')#'flag',)