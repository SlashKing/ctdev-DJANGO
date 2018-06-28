import factory


class ChatUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'chat.ChatUser'

    username = 'alice'


class RoomFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'chat.Room'

    @factory.post_generation
    def users(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for user in extracted:
                self.users.add(user)


class MessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'chat.Message'

    room = factory.SubFactory(RoomFactory)
    user = factory.SubFactory(ChatUserFactory)
    content = 'Cause I had something to do, something to say'


"""
class GroupChatUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'chat.GroupChatUser'

    username = 'alice'


class GroupRoomFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'chat.GroupRoom'

    @factory.post_generation
    def users(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for user in extracted:
                self.users.add(user)


class GroupMessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'chat.Message'

    room = factory.SubFactory(GroupRoomFactory)
    user = factory.SubFactory(GroupChatUserFactory)
    content = 'Cause I had something to do, something to say'


class UserReportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'chat.UserReport'


class JoinRequestFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'chat.JoinRequest'
"""
##TODO: FINISH WRITING TESTS!