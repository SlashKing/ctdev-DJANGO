from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

CRISPY_TEMPLATE_PACK = getattr(settings, 'CRISPY_TEMPLATE_PACK', 'bootstrap')

PICTURE_COMMENTS_REPLACE_ADMIN = getattr(settings, "PICTURE_COMMENTS_REPLACE_ADMIN", True)

PICTURE_COMMENTS_USE_EMAIL_NOTIFICATION = getattr(settings, 'PICTURE_COMMENTS_USE_EMAIL_NOTIFICATION', False)  # enable by default
PICTURE_COMMENTS_CLOSE_AFTER_DAYS = getattr(settings, 'PICTURE_COMMENTS_CLOSE_AFTER_DAYS', None)
PICTURE_COMMENTS_MODERATE_AFTER_DAYS = getattr(settings, 'PICTURE_COMMENTS_MODERATE_AFTER_DAYS', None)

PICTURE_COMMENTS_EXCLUDE_FIELDS = getattr(settings, 'PICTURE_COMMENTS_EXCLUDE_FIELDS', ()) or ()


if PICTURE_COMMENTS_EXCLUDE_FIELDS:
    # The exclude option only works when our form is used.
    # Allow derived packages to inherit our form class too.
    if not hasattr(settings, 'COMMENTS_APP') or settings.COMMENTS_APP == 'comments':
        raise ImproperlyConfigured("To use 'PICTURE_COMMENTS_EXCLUDE_FIELDS', also specify: COMMENTS_APP = 'picture_comments'")