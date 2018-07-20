from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class ChatEngineConfig(AppConfig):
    name = 'chat.engine'
    verbose_name = _('chat engine')

    def ready(self):
        from chat import serializers