from django import forms
from django.core.files.images import get_image_dimensions
from django.contrib.auth.models import User
from larb.models import UserProfile
from larb.models import Post
from cicu.widgets import CicuUploaderInput

class PostForm(forms.ModelForm):
	class Meta:
		model = Post
		fields = ['text', 'picture']
		cicuOptions = {
            #'ratioWidth': '500',       #fix-width ratio, default 0
            #'ratioHeight':'500',       #fix-height ratio , default 0
            'sizeWarning': 'False',    #if True the crop selection have to respect minimal ratio size defined above. Default 'False'
        }
		widgets = {
			'text': forms.Textarea(
				attrs={
					'id': 'post-text',
					'required': True,
					'placeholder': 'Share Something Dude...',
					'class':'form-control',
					'style':'height:43px;',
				}
			),
			'picture': CicuUploaderInput(options=cicuOptions)
		}

class GeneralProfileForm(forms.ModelForm):
	class Meta:
		model = UserProfile
		fields = ['about_me','date_of_birth','user_type','rel_status','gender','country','state','is_private',]
		widgets = {
			'about_me': forms.Textarea(
				attrs={'id': 'about-me', 'placeholder': 'Tell us about yourself...'}
			),
			'is_private': forms.CheckboxInput(attrs={'class': 'drop-shadow-lt'}),
			'date_of_birth':forms.DateInput(attrs={'class': 'datepicker'}),
		}
		
class UserProfileForm(forms.ModelForm):
	class Meta:
		model = UserProfile
		exclude = ['user','about_me','profile_image','date_of_birth','cover_image','post_code','country','state','location','address','website','company']
		widgets = {
			'about_me': forms.Textarea(
				attrs={'id': 'about-me', 'placeholder': 'Tell us about yourself...'}
			),
			'is_private': forms.CheckboxInput(attrs={'class': 'drop-shadow-lt'}),
		}

class ProfileImageForm(forms.ModelForm):
	class Meta:
		model = UserProfile
		fields = ['profile_image',]
		cicuOptions = {
            'ratioWidth': '600',       #fix-width ratio, default 0
            'ratioHeight':'600',       #fix-height ratio , default 0
            'sizeWarning': 'False',    #if True the crop selection have to respect minimal ratio size defined above. Default 'False'
        }
		widgets = {
			'profile_image': CicuUploaderInput(options=cicuOptions),
		}

class CoverImageForm(forms.ModelForm):
	class Meta:
		model = UserProfile
		fields = ['cover_image',]
		cicuOptions = {
            'ratioWidth': '540',       #fix-width ratio, default 0
            'ratioHeight':'210',       #fix-height ratio , default 0
            'sizeWarning': 'False',    #if True the crop selection have to respect minimal ratio size defined above. Default 'False'
        }
		widgets = {
			'cover_image': CicuUploaderInput(options=cicuOptions),
		}
		
class ContactForm(forms.Form):
    subject = forms.CharField(widget=forms.Textarea(
    			attrs={'required': True}
    			),
    			max_length=100
    		)
    email = forms.EmailField(widget=forms.EmailInput(
    			attrs={'required': True}
    			),)
    message = forms.CharField(widget=forms.Textarea)

class SignupForm(UserProfileForm):
	def __init__(self, *args, **kwargs):
		super(SignupForm, self).__init__(*args, **kwargs)
		if hasattr(self, 'sociallogin'):
			if 'gender' in self.sociallogin.account.extra_data:
				if self.sociallogin.account.extra_data['gender'] == 'male':
					self.initial['gender'] = 'MA'
				elif self.sociallogin.account.extra_data['gender'] == 'female':
					self.initial['gender'] = 'FM'
			if 'birthday' in self.sociallogin.account.extra_data:
				self.initial['date_of_birth'] = self.sociallogin.account.extra_data['birthday']

	def raise_disapproved_region(self):
		raise forms.ValidationError(
				("So sorry! We have detected that you are in a region"
					" that does not condone Marijuana for Medicinal or"
					" Recreational use. This violates our terms; soon enough!"))
            
	def signup(self, request, user):
		from django.contrib.gis.geos import fromstr 
		from world.models import WorldBorder
		from usstates.models import UsStates
		
		profile = UserProfile()
		profile.user = user
		profile.is_18_or_older = self.cleaned_data['is_18_or_older']
		profile.gender = self.cleaned_data['gender']
		profile.has_accepted_tos = self.cleaned_data['has_accepted_tos']
		profile.is_private = self.cleaned_data['is_private']
		profile.rel_status = self.cleaned_data['rel_status']
		
		"""
		Because Marijuana is illegal in several regions
		I have compiled a list of approved countries and states
		within those countries where the substance is used in either
		a recreational or medicinal capacity regulated under jurisdictional 
		laws.
		
		[LOGIC]
		if user hasn't allowed geolocation
			use django.GeoIP to determine country then city
			if country and state all good
				register and sign up
				continue
			else
				die
		"""
		
		if request.POST['startLat'] == '0' and request.POST['startLon'] == '0':
			ip = None
			from django.contrib.gis.geoip import GeoIP
			from .countries import COUNTRY_CODES
			from.states import STATE_CODES
			g = GeoIP()
			ip = request.META['REMOTE_ADDR']
			g = g.city(ip)
			g2 = GeoIP()
			g2 = g2.geos(ip).wkt
			if g['country_code'] is 'US':
				if g['region'] in STATE_CODES:
					profile.country = g['country_code']
					profile.state = g['region']
					profile.post_code = g['postal_code']
					profile.location = fromstr(g2)
					profile.save()
					user.save()
				else:
					raise_disapproved_region(self)
			else:
				if g['country_code'] in COUNTRY_CODES:
					profile.country = g['country_code']
					profile.state = None
					profile.post_code = g['postal_code']
					profile.location = fromstr(g2)
					profile.save()
					user.save()
				else:
					raise_disapproved_region(self)
					
		else:
			longLat = fromstr('POINT(' + request.POST['startLon'] + ' ' + 
									request.POST['startLat']+ ')')
			g = WorldBorder.objects.get(mpoly__intersects=longLat)
			l = UsStates.objects.get(geom__intersects=longLat)
			if g.iso2 is 'US':
				if l.state in STATE_CODES:
					profile.country = g.region
					profile.state = l.state
					profile.location = longLat
					profile.save()
					user.save()
				else:
					raise_disapproved_region(self)
			else:
				if g.iso2 in COUNTRY_CODES:
					profile.country = g.region
					profile.state = None
					profile.location = longLat
					profile.save()
					user.save()
				else:
					raise_disapproved_region(self)
    
