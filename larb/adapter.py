from django.conf import settings
from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):

	def is_open_for_signup(self, request):
		"""
		Checks whether or not the site is open for signups.
		
		Test whether user lives in approved zone
		using the user's IP to determine locat
		"""
		return True
	def save_user(self, request, user, form, commit=False):
		data = form.cleaned_data
		print(data)
		user.username = data.get('username')
		user.email = data.get('email')
		user.first_name = data.get('first_name','')
		user.last_name = data.get('last_name','')
		if 'password1' in data:
			user.set_password(data['password1'])
		else:
			user.set_unusable_password()
		self.populate_username(request, user)
		if commit:
			user.save()
		return user