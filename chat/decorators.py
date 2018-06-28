from functools import wraps
from json import loads, dumps

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

from channels.handler import AsgiRequest
from channels import Channel
from rest_framework_jwt.utils import jwt_decode_handler, jwt_get_user_id_from_payload_handler

def _close_reply_channel(message):
    message.reply_channel.send({'close': True})


def authenticate(token):
    """
    Tries to authenticate user based on the supplied token. It also checks
    the token structure and validity.
    Based on jwt_auth.JSONWebTokenAuthMixin.authenticate
    """
    try:
        payload = jwt_decode_handler(token)
    except jwt.ExpiredSignature:
        msg = 'Signature has expired.'
        raise exceptions.AuthenticationFailed(msg)
    except jwt.DecodeError:
        msg = 'Error decoding signature.'
        raise exceptions.AuthenticationFailed(msg)

    user = authenticate_credentials(payload)

    return user


def authenticate_credentials(payload):
    """
    Returns the user associated with the token payload.
    Based on jwt_auth.JSONWebTokenAuthMixin.authenticate_credentials
    """
    try:
        user_id = jwt_get_user_id_from_payload_handler(payload)

        if user_id:
            user = get_user_model().objects.get(pk=user_id, is_active=True)
        else:
            msg = 'Invalid payload'
            raise exceptions.AuthenticationFailed(msg)
    except ObjectDoesNotExist:
        msg = 'Invalid signature'
        raise exceptions.AuthenticationFailed(msg)

    return user


def jwt_request_parameter(func):
    """
    Checks the presence of a "token" request parameter and tries to
    authenticate the user based on its content.
    """
    @wraps(func)
    def inner(message, *args, **kwargs):
        # Taken from channels.session.http_session
        try:
            if "method" not in message.content:
                message.content['method'] = "FAKE"
            request = AsgiRequest(message)
        except Exception as e:
            raise ValueError("Cannot parse HTTP message - are you sure this is a HTTP consumer? %s" % e)
        token = request.GET.get("token", None)
        if token is None:
            _close_reply_channel(message)
            raise ValueError("Missing token request parameter. Closing channel.")

        user = authenticate(token)

        message.channel_session['token'] = token
        message.channel_session['user'] = user.username
        message.channel_session.save()
        message.user = user

        return func(message, *args, **kwargs)
    return inner


def jwt_user_from_session(func):
    """
    Checks the presence of a "token" field on the message's text field and
    tries to authenticate the user based on its content.
    """
    @wraps(func)
    def inner(message, *args, **kwargs):
        channel_session = message.channel_session
        if not 'user' in message.channel_session:
            _close_reply_channel(message)
            raise ValueError("No user attached to this session. Closing channel.")

        try:
            message_text_json = loads(message.content['text'])
        except ValueError:
            _close_reply_channel(message)
            raise

        message.token = channel_session['token']
        user = authenticate(message.token)

        message.user = user
        message.text = dumps(message_text_json)

        return func(message, *args, **kwargs)
    return inner
