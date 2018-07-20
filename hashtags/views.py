from django.template import loader, RequestContext
from django.db.models import Q
from django.shortcuts import render, render_to_response, redirect
from django.urls import reverse, reverse_lazy
from django.contrib.sites.models import Site
from django.http import (HttpResponseRedirect, Http404,
                         HttpResponsePermanentRedirect,
                         HttpResponse)
from django.shortcuts import get_object_or_404
from django.views.generic.base import TemplateResponseMixin, View, TemplateView
from django.views.generic.edit import FormView
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.debug import sensitive_post_parameters
from django.utils.decorators import method_decorator
from PIL import Image as PImage
from endless_pagination.decorators import page_template
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.contenttypes.models import ContentType
from hashtags.models import HashTag, HashTagged_Item
from larb.models import Post
@page_template('hashtags/partials/_hashtag_index.html')
def hashtag_index(request,
			template='hashtags/hashtag_index.html',
			extra_context=None):
	context = {
			'hashtags': HashTag.objects.all().distinct()[:200]
		}
	
	if extra_context is not None:
			context.update(extra_context)
	
	return render(request, template, context)

@page_template('hashtags/partials/_hashtagged_item_list.html')
def hashtagged_item_list(request, hashtag,
                         template="hashtags/hashtagged_item_list.html",
                         extra_context={}):
	try:
		hashtag = HashTag.objects.get(name=hashtag)
	except ObjectDoesNotExist:
		raise Http404("Hashtag %s doesn't exist." % hashtag)
	queryset = Post.objects.filter(
		text__icontains=hashtag,user__profile__is_private = False).order_by(
		'-pub_date').distinct()[:120]
	context = {
		'hashtag' : hashtag,
		'posts' : queryset,
	}

	if len(queryset) == 0:
		raise Http404
	if extra_context is not None:
			context.update(extra_context)
	return render(request,template,context)
