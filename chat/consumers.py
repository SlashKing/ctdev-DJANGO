from channels.sessions import channel_session
from channels.handler import AsgiRequest
from channels.auth import http_session_user, channel_session_user, channel_session_user_from_http
from .engine import ChatEngine
from .decorators import jwt_request_parameter,jwt_user_from_session
from channels.sessions import channel_session

"""
    Essentially, we get the JWT token from the query string of the request and authenticate the user.
    We use channels built in channel_session decorator to generate a new session, then assign the appropriate session
    based on the reply channel. The token is saved in the session and used to authenticate further requests and return 
    the appropriate user to be accessed by message.user in our consumers
"""


@channel_session
@jwt_request_parameter
def ws_connect(message):
    message.reply_channel.send({'accept': True})
    message.channel_session['rooms'] = []
    message.channel_session['group_rooms'] = []
    message.channel_session.save()


@channel_session
@jwt_user_from_session
def ws_message(message):
    ChatEngine.dispatch(message)


@channel_session
def ws_disconnect(message):
    message.channel_session.delete()
    ChatEngine(message).disconnect()
