import os
from datetime import datetime, timedelta
from django.utils.timesince import timesince
from django.utils.timezone import utc, now
from django.contrib.contenttypes.models import ContentType
from larb.models import Post, UserProfile
from PIL import Image
import string
import random


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def timesince_threshold(value, days=2):
    """
    return timesince(<value>) if value is more than <days> old. Return value otherwise
    """
    _now = now().replace(tzinfo=utc)
    if (_now - value) < timedelta(days=days):
        return timesince(value)
    else:
        return value.strftime('%c')


timesince_threshold.is_safe = False


def upload_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    if isinstance(instance.content_type, Post):
        return 'users/posts/%s/%s%s%s' % (
            instance.user.username,
            now().strftime("%Y/%m/"),
            filename_base.lower(),
            filename_ext.lower(),
        )
    elif isinstance(instance.content_type, UserProfile):
        return 'users/cover/%s/%s%s%s' % (
            instance.user.username,
            now().strftime("%Y/%m/"),
            filename_base.lower(),
            filename_ext.lower(),
        )
    return ''


def test_region(country, state):
    """ Function: test_region
        Description:test whether the app can be used in the country and state provided in the profile
        updates UserProfile.isApproved
        :return boolean:
    """
    from .countries import COUNTRY_CODES
    from .states import STATE_CODES
    # check for approved regions
    if country in COUNTRY_CODES:
        if country is 'US':  # if US check if it's legal in the state
            if state is not None:  # check if null
                if not state in STATE_CODES:  # is it legal in the state
                    return False
        return True
    else:
        return False


PRIVATE_IPS_PREFIX = ('10.', '172.', '192.',)


def get_client_ip(request):
    """get the client ip from the request
    """
    remote_address = request.META.get('REMOTE_ADDR')
    # set the default value of the ip to be the REMOTE_ADDR if available
    # else None
    ip = remote_address
    # try to get the first non-proxy ip (not a private ip) from the
    # HTTP_X_FORWARDED_FOR
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        proxies = x_forwarded_for.split(',')
        # remove the private ips from the beginning
        while (len(proxies) > 0 and
               proxies[0].startswith(PRIVATE_IPS_PREFIX)):
            proxies.pop(0)
        # take the first ip which is not a private one (of a proxy)
        if len(proxies) > 0:
            ip = proxies[0]
    print(ip)
    if ip == "127.0.0.1" or "localhost":
        return "google.com"
    else:
        return ip


def test_format(image):
    thumbnail_file_path = None
    if image.format == 'JPEG':
        thumbnail_file_path = '%s_thumbnail.jpg' % filename_base
    elif image.format == 'PNG':
        thumbnail_file_path = '%s_thumbnail.png' % filename_base
    elif image.format == 'GIF':
        thumbnail_file_path = '%s_thumbnail.gif' % filename_base
    else:
        thumbnail_file_path = '%s_thumbnail.jpg' % filename_base
    return thumbnail_file_path


def get_content_type(content_type):
    if isinstance(content_type, ContentType):
        pass
    elif isinstance(content_type, ModelBase):
        content_type = ContentType.objects.get_for_model(content_type)
    elif isinstance(content_type, basestring) and '.' in content_type:
        app, modelname = content_type.split('.')
        content_type = ContentType.objects.get(app_label=app, model__iexact=modelname)
    else:
        raise ValueError('content_type must be an instance of ContentType, a model, or "app.modelname" string')

    return content_type
