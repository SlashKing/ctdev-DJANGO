from rest_auth.serializers import JWTSerializer
from django.conf import settings
from rest_framework import serializers
from larb.models import UserProfile
from rest_friendship.serializers import UserSerializer
from rest_auth.utils import import_callable
from rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth.models import AnonymousUser

from rest_framework_jwt.settings import api_settings

jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email


class LBCRegisterSerializer(RegisterSerializer):
    birthday = serializers.DateField(format=settings.DATETIME_FORMAT, input_formats=None)
    latitude = serializers.CharField(required=True, write_only=True)
    longitude = serializers.CharField(required=True, write_only=True)

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'birthday': self.validated_data.get('birthday', ''),
            'password1': self.validated_data.get('password1', ''),
            'latitude': self.validated_data.get('latitude', ''),
            'longitude': self.validated_data.get('longitude', ''),
            'email': self.validated_data.get('email', ''),
        }

    def save(self, request):
        from django.contrib.gis.geoip2 import GeoIP2
        from django.contrib.gis.geos import fromstr, Point
        from datetime import datetime
        from larb.utils import get_client_ip, test_region
        g = GeoIP2()

        # ip from request META
        ip = get_client_ip(request)

        # city from GeoIP object
        city = g.city(ip)
        # update the country and state to check whether user is approved later
        ####  g['country_code'] ex. CA (Canada) g['region'] { ie. : US State, ex. : TX (Texas) } ####

        country = city.get('country_code')
        state = city.get('region')
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user = adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.save()
        profile = UserProfile.objects.get(pk=user.profile.id)
        location = fromstr('POINT(' + self.cleaned_data['longitude'] + ' ' + self.cleaned_data['latitude'] + ')')
        profile.has_accepted_tos = True
        profile.country = country
        profile.state = state
        profile.city = city
        profile.date_of_birth = self.cleaned_data['birthday']
        now = datetime.now()
        if profile.date_of_birth.year <= now.year - 18:
            if profile.date_of_birth.year is not now.year - 18:
                profile.is_18_or_older = True
            else:
                if profile.date_of_birth.month <= now.month and profile.date_of_birth.day <= now.day:
                    profile.is_18_or_older = True
        profile.isApproved = test_region(country, state)
        profile.location = location
        profile.save()
        user.save()
        print(profile.is_18_or_older)
        print(user.profile.location)
        return user


class LBCJWTTokenSerializer(JWTSerializer):
    """
	Serializer for JWT authentication.
	"""

    token_dec = serializers.SerializerMethodField()
    is_new = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_token_dec(self, obj):
        return jwt_decode_handler(obj['token'])

    def get_is_new(self, obj):
        """
			hacks for now a user would only have a birthday of the current day (age 0) if they tried
			to login through the mobile app before they complete the signup form.
			
			FIXME -> we could just save a boolean in the database determining whether the user updated
					 their birthday to confirm their age and email. 
		"""
        from datetime import date

        born = obj['user'].profile.date_of_birth
        today = date.today()
        if today.year - born.year - ((today.month, today.day) < (born.month, born.day)) <= 0:
            return True
        else:
            return False

    def get_user(self, obj):
        """
		Required to allow using custom USER_DETAILS_SERIALIZER in
		JWTSerializer. Defining it here to avoid circular imports
		"""
        req = None
        user = obj['user']
        req = {'profile': {'user': user}}
        user_data = UserSerializer(user).data
        return user_data
