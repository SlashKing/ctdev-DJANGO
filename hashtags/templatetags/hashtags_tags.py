"""

To access Hashtags template tags in a template, use the {% load %}

tag::

    {% load hashtags_tags %}
    
"""

from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe
register = template.Library()

def urlize_hashtags(value):
	"""
	Converts hashtags in plain text into clickable links.
	For example::
		{{ value|urlize_hashtags }}
	If value is "This is a #test.", the output will be "This is a
	<a href="[reversed url for hashtagged_item_list(request, hashtag='test')]">#test</a>.".
	Note that if ``urlize_hashtags`` is applied to text that already contains
	HTML markup, things won't work as expected. Prefer apply this filter to
	plain text.
	"""
	from hashtags.utils import urlize_hashtags	
	return mark_safe(urlize_hashtags(value))
urlize_hashtags.is_safe = True
urlize_hashtags = stringfilter(urlize_hashtags)

register.filter(urlize_hashtags)

def urlize_mentions(value):
	"""
	Converts mentions in plain text into clickable links.
	For example::
		{{ value|urlize_mentions }}
	"""
	from hashtags.utils import urlize_mentions	
	return mark_safe(urlize_mentions(value))
urlize_mentions.is_safe = True
urlize_mentions = stringfilter(urlize_mentions)

register.filter(urlize_mentions)