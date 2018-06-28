import warnings
from django_comments.moderation import CommentModerator, moderator
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ImproperlyConfigured
from django.utils.encoding import smart_str
from picture_comments import appsettings

from urllib.parse import urljoin  # Python 3


__all__ = (
    'PictureCommentModerator',
    'moderate_model',
    'get_model_moderator',
    'comments_are_open',
    'comments_are_moderated',
)


class PictureCommentModerator(CommentModerator):
    """
    Moderation policy for picture-comments.
    """
    auto_close_field = None
    auto_moderate_field = None
    enable_field = None

    close_after = appsettings.PICTURE_COMMENTS_CLOSE_AFTER_DAYS
    moderate_after = appsettings.PICTURE_COMMENTS_MODERATE_AFTER_DAYS
    email_notification = False   # Using signals instead


    def allow(self, comment, content_object, request):
        """
        Determine whether a given comment is allowed to be posted on a given object.

        Returns ``True`` if the comment should be allowed, ``False`` otherwise.
        """
        # Parent class check
        if not super(PictureCommentModerator, self).allow(comment, content_object, request):
            return False



    def moderate(self, comment, content_object, request):
        """
        Determine whether a given comment on a given object should be allowed to show up immediately,
        or should be marked non-public and await approval.

        Returns ``True`` if the comment should be moderated (marked non-public), ``False`` otherwise.
        """
        # Parent class check
        if super(PictureCommentModerator, self).moderate(comment, content_object, request):
            return True


def moderate_model(ParentModel, publication_date_field=None, enable_comments_field=None):
    """
    Register a parent model (e.g. ``Blog`` or ``Article``) that should receive comment moderation.

    :param ParentModel: The parent model, e.g. a ``Blog`` or ``Article`` model.
    :param publication_date_field: The field name of a :class:`~django.db.models.DateTimeField` in the parent model which stores the publication date.
    :type publication_date_field: str
    :param enable_comments_field: The field name of a :class:`~django.db.models.BooleanField` in the parent model which stores the whether comments are enabled.
    :type enable_comments_field: str
    """
    attrs = {
        'auto_close_field': publication_date_field,
        'auto_moderate_field': publication_date_field,
        'enable_field': enable_comments_field,
    }
    ModerationClass = type(ParentModel.__name__ + 'Moderator', (PictureCommentModerator,), attrs)
    moderator.register(ParentModel, ModerationClass)


def get_model_moderator(model):
    """
    Return the moderator class that is registered with a content object.
    If there is no associated moderator with a class, None is returned.

    :param model: The Django model registered with :func:`moderate_model`
    :type model: :class:`~django.db.models.Model`
    :return: The moderator class which holds the moderation policies.
    :rtype: :class:`~django.contrib.comments.moderation.CommentModerator`
    """
    try:
        return moderator._registry[model]
    except KeyError:
        return None


def comments_are_open(content_object):
    """
    Return whether comments are still open for a given target object.
    """
    moderator = get_model_moderator(content_object.__class__)
    if moderator is None:
        return True

    # Check the 'enable_field', 'auto_close_field' and 'close_after',
    # by reusing the basic Django policies.
    return CommentModerator.allow(moderator, None, content_object, None)


def comments_are_moderated(content_object):
    """
    Return whether comments are moderated for a given target object.
    """
    moderator = get_model_moderator(content_object.__class__)
    if moderator is None:
        return False

    # Check the 'auto_moderate_field', 'moderate_after',
    # by reusing the basic Django policies.
    return CommentModerator.moderate(moderator, None, content_object, None)