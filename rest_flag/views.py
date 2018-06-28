from django.http import HttpResponseRedirect, HttpResponseBadRequest
from django.views.generic.base import View
from rest_flag import utils
from rest_flag.forms import FlagForm

class FlagView(View):
    
    def post(self, request):
        form = FlagForm(request.POST)

        if not form.is_valid():
            return HttpResponseBadRequest()

        user = None
        if request.user.is_authenticated():
            user = request.user

        utils.flag(form.cleaned_data['object'], user, request.META['REMOTE_ADDR'],
            form.cleaned_data['comment'])

        if 'next' in request.GET:
            return HttpResponseRedirect(request.GET.get('next'))
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
