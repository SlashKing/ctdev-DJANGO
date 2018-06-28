from django_comments.forms import CommentForm
from django.core.exceptions import ImproperlyConfigured
from picture_comments import appsettings
from picture_comments.models import PictureComment
from django.contrib.contenttypes.models import ContentType


base_class = CommentForm


class PictureCommentForm(base_class):
    """
    The comment form, applies various settings.
    """
    def __init__(self, *args, **kwargs):
        super(PictureCommentForm, self).__init__(*args, **kwargs)

        # Remove fields from the form.
        # This has to be done in the constructor, because the ThreadedCommentForm
        # inserts the title field in the __init__, instead of the static form definition.
        for name in appsettings.PICTURE_COMMENTS_EXCLUDE_FIELDS:
            try:
                self.fields.pop(name)
            except KeyError:
                raise ImproperlyConfigured("Field name '{0}' in PICTURE_COMMENTS_EXCLUDE_FIELDS is invalid, it does not exist in the comment form.")

    def save(self, commit=False):
        data= self.data
        #return data
        comment = PictureComment(site_id=1,object_pk=data['object_pk'],comment=data['comment'], content_type=ContentType.objects.get(id=data['content_type_id']))
        return comment
    def get_comment_create_data(self):
        # Fake form data for excluded fields, so there are no KeyError exceptions
        for name in appsettings.PICTURE_COMMENTS_EXCLUDE_FIELDS:
            self.cleaned_data[name] = ""

        data = super(PictureCommentForm, self).get_comment_create_data()
        return data
