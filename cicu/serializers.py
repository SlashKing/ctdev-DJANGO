from .models import UploadedFile, ProfilePicture
from .utils import has_b64, validate_b64
from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _
import base64


class FileUploadSerializer(serializers.Serializer):
    picture = serializers.SerializerMethodField()

    def get_picture(self, obj):
        return self.context.get('request', []).data.get('picture', [])

    def validate(self, data):
        """
        """
        initial_data = self.initial_data
        picture = initial_data.get('picture', None)
        pictures = initial_data.get('pictures', None)
        video = initial_data.get('video', None)
        if picture is not None or pictures is not None or video is not None:
            if picture is not None:
                if not has_b64(picture):
                    raise serializers.ValidationError(_("Base64 cannot be empty."))
                initial_data['picture']['file'] = validate_b64(picture.get('file'))

            if pictures is not None:
                if not isinstance(pictures, list):
                    raise serializers.ValidationError(_("Pictures must be in an array"))

                for index, p in enumerate(pictures):
                    if not has_b64(p):
                        del pictures[index]

                if len(pictures) is 0:
                    raise serializers.ValidationError(_("All of the images in the array had invalid base64 data."))

                initial_data['pictures'] = pictures

            if video is not None:
                if not has_b64(video):
                    raise serializers.ValidationError(_("Base64 cannot be empty."))
                initial_data['video']['file'] = validate_b64(video.get('file'))

        if picture is None and pictures is None and video is None:
            raise serializers.ValidationError(
                _("File uploads must specify either picture, pictures, or video parameters"))

        return initial_data


class ProfilePrioritySerializer(serializers.Serializer):
    picture = serializers.SerializerMethodField()
    image_to_switch = serializers.SerializerMethodField()

    def get_picture(self, obj):
        return self.context.get('request', []).data.get('picture', [])

    def get_image_to_switch(self, obj):
        return self.context.get('request', []).data.get('image_to_switch', None)

    def validate(self, data):
        """
        """
        initial_data = self.initial_data
        image = initial_data.get('picture', None)
        image_to_switch = initial_data.get('image_to_switch', None)
        if image is None:
            raise serializers.ValidationError(_('You must have the image parameter in the data'))
        if image_to_switch is not None:
            try:

                image = ProfilePicture.objects.get(id=image.get('id',0))

                try:
                    image_to_switch = ProfilePicture.objects.get(id=image_to_switch.get('id',0))

                    before_priority = image.priority

                    image.priority = image_to_switch.priority
                    image_to_switch.priority = before_priority

                    image.save()
                    image_to_switch.save()

                    del before_priority
                    initial_data['switching'] = True

                except ProfilePicture.DoesNotExist:
                    raise serializers.ValidationError(_('Invalid primary key for image_to_switch was sent.'))

            except ProfilePicture.DoesNotExist:
                raise serializers.ValidationError(_('Invalid primary key for image was sent.'))

        else:
            if not has_b64(image):
                raise serializers.ValidationError(_("Base64 cannot be empty."))

            initial_data['picture']['file'] = validate_b64(image.get('file'))


        return initial_data
