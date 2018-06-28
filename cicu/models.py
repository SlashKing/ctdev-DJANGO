import os
import magic
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils.timezone import now as timezone_now
from cicu.utils import upload_to, get_thumb_from_file_name, resize_and_crop_thumb
from PIL import Image
from django.conf import settings
from django.core.files.storage import default_storage as storage
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.db.models.signals import pre_delete
from django.dispatch import receiver

import base64


def validate_file_type(self):
    file_type = magic.from_buffer(self.file.read(1024), mime=True)
    # Raise validation error if uploaded file is not an acceptable form of media
    if file_type not in settings.IMAGE_MIME_TYPES and file_type not in settings.VIDEO_MIME_TYPES:
        raise ValidationError('File type not supported. JPEG, PNG, GIF or MP4 recommended.')


class FileManager(models.Manager):
    """
    Manager for uploading files
    :param request:
    :param obj:
    TODO: add rest auth route for models on init instead? All about those DRY principles baby
    """
    def create_from_obj(self, user=None, data=None, obj=None, param_obj=None, many=False):
        img_data = param_obj['file']
        filename = param_obj['filename']
        priority = param_obj.get('priority', None)
        active = param_obj.get('active', False)
        # Try to base64 decode the data url.
        #try:
        #    img_data = base64.b64decode(img_data)
        #except:
        #    raise ValidationError(_('Not a valid file'))
        try:
            uploaded_file = UploadedFile.objects.create(
                content_object=obj,
                file=ContentFile(img_data, name=filename),
                user=user) if priority is None else \
                ProfilePicture.objects.create(
                    content_object=obj,
                    file=ContentFile(img_data, name=filename),
                    user=user,
                    priority=priority,
                    active=active
                )
            if not many:
                obj.file = uploaded_file
                obj.save()
        except Exception:
            # delete object if there is an error creating the file
            #obj.delete()
            raise ValueError(_('There was a problem saving the file to the database. Please try again later!'))

    def create_from_data_param(self, user=None, data=None, obj=None, param='', many=False):
        if many:
            if param in data:
                for p in data.get(param, []):
                    self.create_from_obj(user, data, obj, p)
        else:
            if param in data and data.get(param, None) is not None:
                param_obj = data.get(param, None)
                return self.create_from_obj(user, data, obj, param_obj)

    def upload(self, user=None, data=None, obj=None):
        self.create_from_data_param(user, data, obj, 'picture')
        self.create_from_data_param(user, data, obj, 'video')
        self.create_from_data_param(user, data, obj, 'pictures', True)


class UploadedFile(models.Model):
    creation_date = models.DateTimeField(_('creation date'), auto_now_add=True)
    content_type_id = models.ForeignKey(ContentType,
                                        verbose_name=_('content type'),
                                        related_name="content_type_set_for_%(class)s",
                                        on_delete=models.CASCADE,default=38)
    content_object = GenericForeignKey('content_type_id', 'object_pk')
    object_pk = models.PositiveIntegerField(default=77)
    file = models.FileField(_('file'), validators=[validate_file_type], upload_to=upload_to)
    user = models.ForeignKey(User, related_name="uploaded_files")
    objects = FileManager()

    class Meta:
        ordering = ('id',)
        verbose_name = _('uploaded file')
        verbose_name_plural = _('uploaded files')

    def __str__(self):
        return "%s" % self.file

    def delete(self, *args, **kwargs):
        super(UploadedFile, self).delete(*args, **kwargs)
    delete.alters_data = True
    
    def save(self, *args, **kwargs):
        super(UploadedFile, self).save(*args, **kwargs)
        # sanity check if thumbnail exists
        # Need this just in case we save any other data on the UploadedFile after initial create
        # This will create the thumbnail on create
        if not storage.exists(get_thumb_from_file_name(self.file.name)):
            file_type = magic.from_buffer(self.file.read(1024), mime=True)
            if file_type in settings.IMAGE_MIME_TYPES:
                self.create_thumbnail()
                # python-magic doesn't close the file
                self.file.close()

    @property
    def extension(self):
        name, extension = os.path.splitext(self.file.name)
        return extension

    def get_file_url(self):
        file = self.file
        return "".join(["http://", get_current_site(1).domain, storage.url(file.name)])

    def get_thumbnail_picture_url(self):
        if self is None or not self.file:
            return ''

        thumbnail_file_path = get_thumb_from_file_name(self.file.name)

        # try:
        if storage.exists(thumbnail_file_path):
           # if thumbnail version exists, return its URL path
            return "".join(["http://", get_current_site(1).domain, storage.url(thumbnail_file_path)])
        # except:
            # return original as a fallback
        # return self.file.path
      
    def create_thumbnail(self):
        if not self.file or self.file is '':
            self.delete()
            pass
        else:
            return resize_and_crop_thumb(self.file.name, get_current_site(1).domain)


class ProfilePicture(UploadedFile):
    priority = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=False)

    class Meta:
        ordering = ('priority',)
        verbose_name = _('Profile Picture')
        verbose_name_plural = _('Profile Pictures')

@receiver(pre_delete, sender=UploadedFile, dispatch_uid='uploaded_file_pre_delete_signal')
def delete_files(sender, instance, using, **kwargs):
    if instance.file:
        thumbnail = get_thumb_from_file_name(instance.file.name)
        if thumbnail is not '':
            # TODO: slightly different for S3 storage
            path = os.path.join(settings.MEDIA_ROOT, thumbnail)
            try:
                os.remove(path)
            except FileNotFoundError:
                pass

        instance.file.delete(save=False)