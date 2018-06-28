from django import forms
from django.core.files.images import get_image_dimensions
from django.contrib.auth.models import User
from larb.models import UserProfile
from larb.models import Post
from cicu.widgets import CicuUploaderInput
# doing this for Postal Code --- might be useful?? a bit overkill
from django.contrib.gis.geoip2 import GeoIP2
from django.contrib.gis.geos import fromstr
from .utils import get_client_ip, test_region

class PostForm(forms.ModelForm):
	class Meta:
		model = Post
		fields = ['text']
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
			)
		}

class GeneralProfileForm(forms.ModelForm):
	class Meta:
		model = UserProfile
		fields = ['about_me','date_of_birth','user_type','rel_status','gender','country','state','is_private','is_18_or_older','has_accepted_tos']
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

class SignupForm(GeneralProfileForm):
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
	"""
	 Might not need this ValidationError as all users will be allowed to sign up, but the site will be locked out if 
	 they are in a disapproved region based on their location
	"""
	def raise_disapproved_region(self):
		raise forms.ValidationError(
				("So sorry! We have detected that you are in a region"
					" that does not condone Marijuana for Medicinal or"
					" Recreational use. This violates our terms; soon enough!"))
	def signup(self, request, user):
		
		location = None
		post_code = None
		
		
		
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
		sLat = request.POST['startLat']
		sLon = request.POST['startLon']
		# init GeoIP()
		g = GeoIP2()
		
		# ip from request META
		ip = get_client_ip(request)
		
		# city from GeoIP object
		city = g.city(ip)
		# update the country and state to check whether user is approved later
		####  g['country_code'] ex. CA (Canada) g['region'] { ie. : US State, ex. : TX (Texas) } ####
			
		country = city.get('country_code')
		state = city.get('region')
		
		
		
		"""
			application needs to know the user's current location to know whether it can be used in that region
			least accurate, based on REMOTE_ADDR, a proxy could spoof it's location.
			
		"""
		if sLat == '0' and sLon == '0':
			
			# use geos to get wkt so we can use fromstr() to get location from POINT object
			# TODO: write test cases for geos(ip)
			location = fromstr(g.geos(ip).wkt)
			
		else: # much more accurate, using the browser's navigator method
			
			# create a POINT object from a string
			location = fromstr('POINT(' + sLon + ' ' + sLat + ')')
		
		# commit the user
		user.save()
		
		# update profile
		chosen_country = request.POST['country']
		chosen_state = request.POST['state']
		
		user.profile.is_18_or_older = self.cleaned_data['is_18_or_older']
		user.profile.gender = self.cleaned_data['gender']
		user.profile.has_accepted_tos = self.cleaned_data['has_accepted_tos']
		user.profile.is_private = self.cleaned_data['is_private']
		user.profile.rel_status = self.cleaned_data['rel_status']
		
		# update the country
		user.profile.country = chosen_country
		
		# if the country is US update the profile.state
		# could add other countries later if needed
		if country is 'US' : user.profile.state = chosen_state
		
		# update post_code and location in current scope
		user.profile.post_code = city.get('postal_code')
		
		# test and set approved regions
		user.profile.isApproved = test_region(country,state)
		user.profile.location = location
		user.save()