from django.template import RequestContext
from django.shortcuts import render, render_to_response, redirect
from django.core.urlresolvers import reverse, reverse_lazy
from django.contrib.sites.models import Site
from django.http import (HttpResponseRedirect, Http404,
                         HttpResponsePermanentRedirect,
                         HttpResponse)
from django.shortcuts import get_object_or_404
from django.views.generic.base import TemplateResponseMixin, View, TemplateView
from django.views.generic.edit import FormView
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.debug import sensitive_post_parameters
from django.utils.decorators import method_decorator
from django.utils.encoding import force_str
from larb.forms import ContactForm, PostForm, UserProfileForm, ProfileImageForm
from larb.models import Post, User, UserProfile
from django.core.mail import send_mail
from PIL import Image as PImage
from endless_pagination.decorators import page_template
from hashtags.utils import link_hashtags_to_model, notify_on_mention
from django.conf import settings
from cicu.models import UploadedFile
from django.shortcuts import get_object_or_404
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import requires_csrf_token, csrf_exempt
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
import json
#from django.contrib.gis.geos import fromstr
from django.contrib.gis.measure import D
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from rest_auth.registration.views import SocialLoginView

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    
def _ajax_response(request, response, form=None):
    if request.is_ajax():
        if (isinstance(response, HttpResponseRedirect)
                or isinstance(response, HttpResponsePermanentRedirect)):
            redirect_to = response['Location']
        else:
            redirect_to = None
        response = get_adapter().ajax_response(request,
                                               response,
                                               form=form,
                                               redirect_to=redirect_to)
    return response
@login_required
@cache_page(0)
@page_template('larb/_index.html')    
def index(request, template="larb/index.html", extra_context=None):
	pnt = request.user.profile.location
	if request.GET.get('local'):
		local = request.GET.get('local')
	else:
		local= None
	posts = None
	if local=='True' and request.is_ajax():
		posts = Post.objects.filter(user__profile__is_private = False, 
									user__profile__location__distance_lte=(
										pnt, D(km=250))).order_by('-pub_date').distinct()[:1200]
	else:
		posts = Post.objects.filter(user__profile__is_private = False).order_by('-pub_date').distinct()[:1200]
	context = {
		'posts': posts,
	}

	if extra_context is not None:
		context.update(extra_context)
	return render(request, template, context)

@cache_page(60*60*60)
def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            send_mail(
                cd['subject'],
                cd['message'],
                cd.get('email', 'noreply@herb2curb.com'),
                ['support@herb2curb.com'],
            )
            return HttpResponseRedirect('/contact/thanks/')
    else:
        form = ContactForm()
    return render(request, 'larb/contact_form.html', {'form': form})
          
@cache_page(0)                                 
@login_required
@page_template('account/_profile.html')
def profile(request, username='',
			template='account/profile.html',
			extra_context=None):
		user = None	
		if username == "":
			user = User.objects.get(username=request.user.username)
		else:
			user = User.objects.get(username=username)

		if request.method == 'POST':
			form = PostForm(
				data=request.POST,
				files=request.FILES,
			)
			if form.is_valid():
				post = form.save(commit=False)
				# Check for image
				picture = request.POST.get('picture')
				if picture != '':
					picture = UploadedFile.objects.get(pk=int(picture,0))
					post.picture = picture
				post.pub_date = timezone.now()
				post.user = request.user
				post.save()
				try:
					UploadedFile.objects.get(pk=int(picture,0)).delete()
				except:
					pass
				link_hashtags_to_model(post.text, post, user)
				notify_on_mention(post.text, post, user)
				return redirect('./')
		context = {
			'posts': Post.objects.filter(user = user).order_by('-pub_date').distinct()[:500],
			'form': PostForm(),
			'user_sub':user,
		}
		if extra_context is not None:
			context.update(extra_context)
		return render(request, template, context)
@cache_page(0)
@login_required
def edit_profile_image(request,
	template='larb/settings.html',
	extra_context=None):
	user = None	
	user = request.user

	if request.method == 'POST':
		try:
			u = UserProfile.objects.get(user=user)
			form = ProfileImageForm(
				data=request.POST, 
				files=request.FILES,
				instance=u
			)
		except ObjectDoesNotExist:
			form = ProfileImageForm(
				data=request.POST,
				files=request.FILES,
			)
		if form.is_valid():
			profile = form.save(commit=False)
			# Check for image
			user = request.user
			profile_image = request.POST.get('profile_image')
			
			if profile_image != "":
				try:
					profile_image = UploadedFile.objects.get(file=profile_image[7:])
				except UploadedFile.DoesNotExist:
					profile_image = UploadedFile.objects.get(pk=int(profile_image,0))
				profile.profile_image = profile_image
			profile.user = user
			profile.save()
			update_session_auth_hash(request, request.user)
		if extra_context is not None:
			context.update(extra_context)
		return redirect('./')
	else:
		try:
			u = UserProfile.objects.get(user=request.user)
			form = ProfileImageForm(instance=u)
		except ObjectDoesNotExist:
			form = ProfileImageForm(request.FILES)
		context = {
			'form': form,
			'user_sub':request.user,
		}
	
		if extra_context is not None:
			context.update(extra_context)
		return render(request, template, context)		
@cache_page(0)
@login_required
def edit_profile(request,
	template='larb/settings.html',
	extra_context=None):
	user = None	
	user = request.user

	if request.method == 'POST':
		try:
			u = UserProfile.objects.get(user=user)
			form = UserProfileForm(
				data=request.POST, 
				files=request.FILES,
				instance=u
			)
		except ObjectDoesNotExist:
			form = UserProfileForm(
				data=request.POST,
				files=request.FILES,
			)
		if form.is_valid():
			profile = form.save(commit=False)
			# Check for image
			user = request.user
			cover_image = request.POST.get('cover_image')
			if cover_image != "":
				try:
					cover_image = UploadedFile.objects.get(file=cover_image[7:])
				except UploadedFile.DoesNotExist:
					cover_image = UploadedFile.objects.get(pk=int(cover_image,0))
				profile.cover_image = cover_image	 
			profile.user = user
			profile.save()
			update_session_auth_hash(request, request.user)
		if extra_context is not None:
			context.update(extra_context)
		return redirect('./')
	else:
		try:
			u = UserProfile.objects.get(user=request.user)
			form = UserProfileForm(instance=u)
		except ObjectDoesNotExist:
			form = UserProfileForm(request.FILES)
		context = {
			'form': form,
			'user_sub':request.user,
		}
	
		if extra_context is not None:
			context.update(extra_context)
		return render(request, template, context)
		
@cache_page(60*12)                                 
@login_required
def post_detail(request,post=None,
			template='larb/post_detail.html'):
		context = {
			'post': Post.objects.select_related('user','uploaded_file').get(pk = int(post)),
			}
		return render(request, template, context)

@csrf_exempt
@requires_csrf_token                               
@login_required
def post_remove(request,post=None):
		if request.is_ajax():
			post = Post.objects.get(pk = int(post))
			post.delete()
			return HttpResponse(request)
		else:
			return json.dumps({'message':'Must be an ajax call!'})

@cache_page(60*12)   
def terms_of_use(request,
			template='larb/terms.html',context=None):
		return render(request, template, context)
				