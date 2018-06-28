from __future__ import absolute_import

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount import app_settings
from allauth.account import app_settings as account_settings
from allauth.account.adapter import get_adapter as get_account_adapter
from allauth.account.app_settings import EmailVerificationMethod
from allauth.account.utils import user_email, user_field, user_username
from allauth.compat import is_authenticated, reverse
from allauth.socialaccount.models import SocialAccount
from allauth.utils import (
    deserialize_instance,
    email_address_exists,
    import_attribute,
    serialize_instance,
    valid_email_or_none,
)
from larb.utils import id_generator


class LBCFacebookAdapter(DefaultSocialAccountAdapter):

    error_messages = {
        'email_taken':
        _("An account already exists with this e-mail address."
          " Please sign in to that account first, then connect"
          " your %s account.")
    }

    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a
        social provider, but before the login is actually processed
        (and before the pre_social_login signal is emitted).

        You can use this hook to intervene, e.g. abort the login by
        raising an ImmediateHttpResponse

        Why both an adapter hook and the signal? Intervening in
        e.g. the flow from within a signal handler is bad -- multiple
        handlers may be active and are executed in undetermined order.
        """
		
        pass

    def authentication_error(self,
                             request,
                             provider_id,
                             error=None,
                             exception=None,
                             extra_context=None):
        """
        Invoked when there is an error in the authentication cycle. In this
        case, pre_social_login will not be reached.

        You can use this hook to intervene, e.g. redirect to an
        educational flow by raising an ImmediateHttpResponse.
        """
        pass

    def new_user(self, request, sociallogin):
        """
        Instantiates a new User instance.
        """
        print('new_user')
        return get_account_adapter().new_user(request)

    def save_user(self, request, sociallogin, form=None):
        """
        Saves a newly signed up social login. In case of auto-signup,
        the signup form is not available.
        """
        u = sociallogin.user
        u.set_unusable_password()
        print('save user', form, u.email, self, request)
        # saves the social account, token, and user instance
        # automatically generates user profile, 
        sociallogin.save(request)
        return u

    def populate_user(self,
                      request,
                      sociallogin,
                      data):
        """
        Hook that can be used to further populate the user instance.

        For convenience, we populate several common fields.

        Note that the user instance being populated represents a
        suggested User instance that represents the social user that is
        in the process of being logged in.

        The User instance need not be completely valid and conflict
        free. For example, verifying whether or not the username
        already exists, is not a responsibility.
        """
		
        """
           if the username is empty, this is because there is no account 
           in the db for this account or social account.
           	
           Default Username: First and Last Name
        """
        print('my populate', sociallogin.user, data)
        print(sociallogin.user.username)   
        #get_account_adapter().populate_username(request, sociallogin.user)
        
        username = None
        sociallogin.user.username = '{0}{1}_{2}'.format(
            data.get('first_name'),
            data.get('last_name'),
            id_generator()# to avoid same named users if their first and last name match
        )
        #sociallogin.user.is_active = False

        sociallogin.user.first_name = data.get('first_name')
        sociallogin.user.last_name = data.get('last_name')
        email = data.get('email')
        
        # set a random facebook email that they can change later
        # this is a sort of work around for logging in for the first time on mobile
        # where we can't redirect to a sign up form before committing the user instance
        
        
        sociallogin.user.email = '{0}@facebook.com'.format(sociallogin.user.username)
        
        name = data.get('name')
        user = sociallogin.user
        return user


    def is_auto_signup_allowed(self, request, sociallogin):
        # If email is specified, check for duplicate and if so, no auto signup.
        auto_signup = app_settings.AUTO_SIGNUP
        if auto_signup:
            email = user_email(sociallogin.user)
            # Let's check if auto_signup is really possible...
            if email:
                if account_settings.UNIQUE_EMAIL:
                    if email_address_exists(email):
                        # Oops, another user already has this address.
                        # We cannot simply connect this social account
                        # to the existing user. Reason is that the
                        # email adress may not be verified, meaning,
                        # the user may be a hacker that has added your
                        # email address to their account in the hope
                        # that you fall in their trap.  We cannot
                        # check on 'email_address.verified' either,
                        # because 'email_address' is not guaranteed to
                        # be verified.
                        auto_signup = False
                        # FIXME: We redirect to signup form -- user will
                        # see email address conflict only after posting
                        # whereas we detected it here already.
            elif app_settings.EMAIL_REQUIRED:
                # Nope, email is required and we don't have it yet...
                auto_signup = False
        return auto_signup

    def is_open_for_signup(self, request, sociallogin):
        """
        Checks whether or not the site is open for signups.

        Next to simply returning True/False you can also intervene the
        regular flow by raising an ImmediateHttpResponse
        """
        return get_account_adapter(request).is_open_for_signup(request)

    def get_signup_form_initial_data(self, sociallogin):
        user = sociallogin.user
        initial = {
            'email': user_email(user) or '',
            'username': user_username(user) or '',
            'first_name': user_field(user, 'first_name') or '',
            'last_name': user_field(user, 'last_name') or ''}
        return initial

    def deserialize_instance(self, model, data):
        return deserialize_instance(model, data)

    def serialize_instance(self, instance):
        return serialize_instance(instance)
