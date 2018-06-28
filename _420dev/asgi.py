"""
ASGI config for _420django project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""
import os
import channels.asgi

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "_420dev.settings")
channel_layer = channels.asgi.get_channel_layer()
