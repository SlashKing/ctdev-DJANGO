from rest_friendship.serializers import UserSerializer
from django.contrib.auth.models import User, AnonymousUser
from rest_framework_jwt.settings import api_settings

jwt_decode_handler = api_settings.JWT_DECODE_HANDLER


def jwt_response_payload_handler(token, user=None, request=None):
    """

    Custom JWT response payload handler.
    This function controls the custom payload after login or token refresh. This data is returned through the web API.
    """
    req = None
    print('jwt_response_payload_handler ', user)
    # Here you can use other serializers or custom logic, it's up to you!
    if isinstance(user, AnonymousUser):
        user = User.objects.get(id=user.id)
        req = {'profile': {'user': user}}
    else:
        req = {'request': request}
    return {
        'token_decoded': jwt_decode_handler(token),
        'token': token,
        'user': UserSerializer(user, context=req).data

    }
