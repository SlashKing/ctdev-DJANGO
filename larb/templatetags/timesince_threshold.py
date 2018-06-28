from datetime import datetime, timedelta
from django import template
from django.utils.timesince import timesince
from django.utils.timezone import utc, now

register = template.Library()

@register.filter
def timesince_threshold(value, days=2):
    """
    return timesince(<value>) if value is more than <days> old. Return value otherwise
    """
    _now = now().replace(tzinfo=utc)
    if (_now - value) < timedelta(days=days):
        return timesince(value)
    else:
        return value
timesince_threshold.is_safe = False
