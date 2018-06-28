import os
from django.contrib.contenttypes.models import ContentType
from larb.models import Post, UserProfile

def upload_to(instance, filename):
	filename_base, filename_ext = os.path.splitext(filename)
	if isinstance(instance.content_type, Post):
		return 'users/posts/%s/%s%s%s' % (
			instance.user.username,
			timezone_now().strftime("%Y/%m/"),
			filename_base.lower(),
			filename_ext.lower(),
		)
	elif isinstance(instance.content_type, UserProfile):
		return 'users/cover/%s/%s%s%s' % (
			instance.user.username,
			timezone_now().strftime("%Y/%m/"),
			filename_base.lower(),
			filename_ext.lower(),
		)
	return ''
	
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