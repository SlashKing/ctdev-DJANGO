import os, uuid
from django.contrib.contenttypes.models import ContentType
from django.utils.timezone import now as timezone_now
from django.db.models.base import ModelBase
from PIL import Image
from django.core.files.storage import default_storage as storage
from django.utils.translation import ugettext_lazy as _
from rest_framework.serializers import ValidationError
import base64

def upload_to(instance, filename):
    filename_base, filename_ext = os.path.splitext(filename)
    filename = u'%s-%s' % (uuid.uuid4().hex, filename_base)
    start = 'users/'
    if isinstance(instance, str):
        content_type = instance.data.get('object_content_type')
        if content_type is "post":
            start = 'posts/'
    file_path = start + '%s/%s%s%s' % (
        instance.user.username,
        timezone_now().strftime("%Y/%m/"),
        filename.lower(),
        filename_ext.lower()
    )
    return file_path


def has_b64(param):
    if param.get('file', "") is "":
        return False
    return True


def validate_b64(data):
    try:
        data = base64.b64decode(data)
        return data
    except:
        raise ValidationError(_('Not a valid file, could not decode base64 data.'))


def get_content_type(content_type):
    if isinstance(content_type, ContentType):
        pass
    elif isinstance(content_type, ModelBase):
        content_type = ContentType.objects.get_for_model(content_type)
    elif isinstance(content_type, str) and '.' in content_type:
        app, modelname = content_type.split('.')
        content_type = ContentType.objects.get(app_label=app, model__iexact=modelname)
    else:
        raise ValueError('content_type must be an instance of ContentType, a model, or "app.modelname" string')

    return content_type


def get_thumb_from_file_name(file_name):
    filename_base, filename_ext = os.path.splitext(file_name)
    return '%s_thumbnail%s' % (filename_base, filename_ext.lower())


def resize_and_crop_thumb(file_name, domain):
    """
    :param file_name:
    :param domain:
    :return url:
    """
    try:
        f = storage.open(file_name, 'rb')
        f.seek(0)
        image = Image.open(f)
        thumbnail_file_path = get_thumb_from_file_name(file_name)
        if storage.exists(thumbnail_file_path):
            # if thumbnail version exists, return its url path
            return thumbnail_file_path
        # resize the original image and
        # return URL path of the thumbnail version
        width, height = image.size
        thumbnail_size = 75, 75

        if width > height:
            delta = width - height
            left = int(delta / 2)
            upper = 0
            right = height + left
            lower = height
        else:
            delta = height - width
            left = 0
            upper = int(delta / 2)
            right = width
            lower = width + upper
        image = image.crop((left, upper, right, lower))
        image = image.resize(thumbnail_size, Image.ANTIALIAS)
        f_mob = storage.open(thumbnail_file_path, 'wb')

        if not image.mode == "RGB":
            image.convert("RGB")
        if image.format != 'JPEG':
            image.save(f_mob, image.format)
        else:
            image.save(f_mob, 'JPEG')
        f_mob.close()
        image.close()
        # if thumbnail version exists, return its URL path
        return "".join(["http://", domain, storage.url(thumbnail_file_path)])
    except ValueError:
        raise ValueError(_('error creating thumbnail'))  # TODO: should log the exception
