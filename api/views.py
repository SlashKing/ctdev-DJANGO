from django.contrib.auth.models import User
from larb.models import *
from chat.models import UserReport
from picture_comments.models import PictureComment
from picture_comments.forms import PictureCommentForm
from hashtags.models import *
from friendship.models import *
from api.serializers import *
from notifications.models import Notification
from rest_friendship.serializers import CurrentUserSerializer, UserProfileSerializer, ProfilePictureSerializer
from api.filters import *
from api.permissions import *
from _420dev.settings import MEDIA_URL
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import detail_route, list_route
from django.db.models import Q
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from cicu.utils import get_thumb_from_file_name
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from hashtags.utils import link_hashtags_to_model, notify_on_mention
from cicu.models import UploadedFile, ProfilePicture, upload_to
from django.conf import settings
import base64
from django.core.files.base import ContentFile
from PIL import Image
from lbc_rest_auth.serializers import LBCJWTTokenSerializer
from rest_auth.utils import jwt_encode
from django.utils.translation import ugettext_lazy as _
from django.core.files.storage import default_storage as storage
from cicu.serializers import FileUploadSerializer, ProfilePrioritySerializer

try:
    from django.utils import simplejson
except:
    import simplejson


class UploadedFileViewSet(viewsets.ModelViewSet):
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        content_type = self.request.query_params.get('content_type', None)
        content_object = self.request.query_params.get('content_object', None)
        params = Q()
        if content_type is None:
            content_type = ContentType.objects.get_for_model(self.request.user)
            if user_id is not None:
                params &= Q(object_pk=user_id) & Q(content_type_id=content_type.id)
            else:
                params &= Q(object_pk=self.request.user.id) & Q(content_type_id=content_type.id)
        else:
            if content_object is not None:
                params &= Q(object_pk=content_object) & Q(content_type_id=content_type)
            else:
                if user_id is not None:
                    params &= Q(user__id=user_id)
        self.queryset = UploadedFile.objects.filter(params)
        return self.queryset

    def create(self, request):
        """
        Creates a uploaded file

        POST data:
        - object_pk
        - type (optional) defaults to user_profile which is a profile image
        	*** Notes:
        		-> uses the app_label to find content_type, so the app can use identifiable strings as passed data
        - file (base64)
        - filename
        """
        user = User.objects.get(id=request.user.id)
        type = request.data.get('type', 'userprofile')
        app_label = request.data.get('label', 'larb')

        content_type = ContentType.objects.get(app_label=app_label, model=type)
        object_id = request.data.get('object_pk', user.id)
        object = content_type.get_object_for_this_type(pk=object_id)

        if object is not None:
            img_data = request.data.get('file', None)
            filename = request.data.get('filename', None)

            # imgData += "=="
            img_data = base64.b64decode(img_data)

            file_path = MEDIA_URL.replace('/', '') + '/' + upload_to(request, filename)
            directory = os.path.dirname(file_path)
            if not storage.exists(directory):
                os.makedirs(directory)
            with storage.open(file_path, "wb") as fh:
                fh.write(img_data)
            try:
                uploaded_file = None
                current_serializer = ProfilePictureSerializer
                if isinstance(object, UserProfile):
                    priority = request.data.get('priority', 1)
                    active = request.data.get('active', True)
                    uploaded_file = ProfilePicture.objects.create(
                        content_object=object,
                        file=ContentFile(img_data, name=filename),
                        user=request.user,
                        priority=priority,
                        active=active)
                else:
                    current_serializer = UploadedFileSerializer
                    uploaded_file = UploadedFile.objects.create(
                        content_object=object,
                        file=ContentFile(img_data, name=filename),
                        user=request.user)

                uploaded_file.save()
                self.serializer = current_serializer(uploaded_file, context={'request': request})
            except:
                return Response(str(_('There was an error creating the uploaded file')), status.HTTP_400_BAD_REQUEST)

            return Response(self.serializer.data, status.HTTP_201_CREATED)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.none()
    serializer_class = NotificationSerializer
    serializer = NotificationSerializer

    def get_queryset(self):
        filter = self.request.query_params.get('filter')
        if filter is not None:
            self.queryset = self.request.user.notifications.all()  # .filter(deleted=False)
        else:
            self.queryset = self.request.user.notifications.all()  # .filter(deleted=False)
        return self.queryset

    @list_route(methods=['GET'])
    def unread(self, request):
        self.queryset = request.user.notifications.unread()
        page = self.paginate_queryset(self.queryset)
        if page is not None:
            serializer = NotificationSerializer(page, context={'request': request}, many=True)
            return self.get_paginated_response(page)
        return Response(NotificationSerializer(self.queryset, many=True, context={'request': request}).data)

    @list_route(methods=['POST'])
    def mark_all_as_read(self, request):
        request.user.notifications.mark_all_as_read()
        return Response(self.queryset)

    @detail_route(methods=['POST'])
    def mark_as_read(self, request, pk=None):
        notification = get_object_or_404(
            Notification, recipient=request.user, id=pk)
        notification.mark_as_read()
        # request.user.notifications.mark_as_read(request.user.notifications.filter(id=pk))
        return Response(self.queryset)

    @detail_route(methods=['POST'])
    def mark_as_unread(self, request, pk=None):
        notification = get_object_or_404(
            Notification, recipient=request.user, id=pk)
        notification.mark_as_unread()
        # request.user.notifications.mark_as_read(request.user.notifications.filter(id=pk))
        return Response(self.queryset)

    @detail_route(methods=['POST'])
    def mark_as_deleted(self, request, pk=None):
        notification = get_object_or_404(
            Notification, recipient=request.user, id=pk)
        notification.deleted = True
        notification.save()
        return Response(self.queryset)

    @detail_route(methods=['POST'])
    def mark_as_undeleted(self, request, pk=None):
        notification = get_object_or_404(
            Notification, recipient=request.user, id=pk)
        notification.deleted = False
        notification.save()
        return Response(self.queryset)

    @method_decorator(cache_page(0))
    def dispatch(self, *args, **kwargs):
        return super(NotificationViewSet, self).dispatch(*args, **kwargs)

    def get_serializer_context(self):
        context = super(NotificationViewSet, self).get_serializer_context()
        context.update({'request': self.request})
        return context


# ViewSets define the view behavior.
class UserProfileViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet):
    queryset = UserProfile.objects.all()

    serializer_class = UserProfileSerializer
    permission_classes = (ProfileOwnerOrStaff,)

    def retrieve(self, request, pk=None):
        """ get requested user profile """
        if pk == 'i':
            return Response(UserProfileSerializer(request.user.profile, context={'request': request}).data)
        return super(UserProfileViewSet, self).retrieve(request, pk)

    def get_queryset(self):
        pnt = self.request.user.profile.location
        queryset = self.queryset
        username = self.request.query_params.get('username')
        gender = self.request.query_params.get('gender')
        distance = self.request.query_params.get('distance')
        limit = self.request.query_params.get('limit')
        if gender is not None and distance is not None and pnt is not None:
            if gender.upper() == "BI" or gender == "":
                queryset = UserProfile.objects.order_by(
                    'user__username').filter(
                    is_private=False,
                    location__distance_lte=(pnt, D(km=int(distance))))
            else:
                queryset = UserProfile.objects.order_by(
                    'user__username').filter(
                    is_private=False,
                    gender=gender.upper(),
                    location__distance_lte=(pnt, D(km=int(distance))))
        if username is not None:
            queryset = UserProfile.objects.filter(user__username=username)
        return queryset

    def partial_update(self, request, pk=None):
        super(UserProfileViewSet, self).partial_update(request, pk)
        try:
            obj = get_object_or_404(UserProfile, pk=pk)
        except:
            raise serializers.ValidationError(str(_(u"Invalid primary key data")))
        if int(pk) is int(request.user.profile.pk) or request.user.is_staff:
            validated_data = request.data
            profile = self.get_object()
            cover_image = validated_data.get('cover_image', None)
            profile_image = validated_data.get('profile_image', None)
            latitude = validated_data.get('latitude', None)
            longitude = validated_data.get('longitude', None)
            if cover_image is not None:
                profile.cover_image = UploadedFile.objects.get(id=cover_image)
            if profile_image is not None:
                profile.profile_image = UploadedFile.objects.get(id=profile_image)
            if latitude is not None and longitude is not None:
                profile.location = profile.get_location(latitude, longitude)
            profile.save()
            serializer = self.get_serializer(data=request.data, context={'request': request}, partial=True)
            if serializer.is_valid():
                data = {'user': profile.user, 'token': jwt_encode(profile.user)}
                return Response(LBCJWTTokenSerializer(data).data)
            else:
                return Response({"error": serializer.errors})
        else:
            raise serializers.ValidationError(u"You can't alter other user's account information. Nice try though")

    @list_route(methods=['POST'])
    def switch_priority(self, request):
        """
        can either switch the
        """
        # try:
        serializer = ProfilePrioritySerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            switching = serializer.validated_data.get('switching', False)
            if not switching:
                UploadedFile.objects.upload(request.user, serializer.validated_data, request.user.profile)

            return_data = UserSerializer(request.user, context={'request': request}).data
            return_data.update({'success': str(_('Priority of profile image was switched successfully!'))})

            return Response(
                return_data,
                status.HTTP_201_CREATED
            )

        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    @list_route(methods=['POST'])
    def add_profile_picture(self, request):
        """
        Creates a profile picture
        """
        # try:

        serializer = FileUploadSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            UploadedFile.objects.upload(request.user, serializer.validated_data, request.user.profile)

            return_data = UserSerializer(request.user, context={'request': request}).data
            return_data.update({'success': str(_('Profile picture was added successfully!'))})

            return Response(
                return_data,
                status.HTTP_201_CREATED
            )
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    @list_route(methods=['POST'])
    def add_cover_picture(self, request):
        """
        Creates a cover image
        """
        # try:

        serializer = FileUploadSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            return_data = UserSerializer(request.user, context={'request': request}).data
            return_data.update({'success': str(_('Cover picture was added successfully!'))})
            return Response(
                return_data,
                status.HTTP_201_CREATED
            )
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    @detail_route(methods=["POST"])
    def delete_votes(self, request, pk=None):
        if int(pk) is int(request.user.pk) or request.user.is_staff:
            Vote.objects.filter(
                Q(Q(token=pk) | Q(object_id=self.get_object().id)) & Q(
                    content_type=ContentType.objects.get_for_model(UserProfile))
            ).delete()

            return Response({
                'success': str(_('All of your swipes were deleted'))
            })
        else:
            raise serializers.PermissionDenied(u"You can't alter other user's account information. Nice try though")

    @method_decorator(cache_page(0))
    def dispatch(self, *args, **kwargs):
        return super(UserProfileViewSet, self).dispatch(*args, **kwargs)


from django.db.models import F
from django.contrib.gis.db.models.functions import Distance


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        filter = self.request.query_params.get('filter', None)
        username = self.request.query_params.get('username', None)
        if username is not None:
            self.queryset = User.objects.filter(username=username)
            return self.queryset
        if filter is None:
            from django.contrib.gis.measure import D
            request_user = self.get_serializer_context()['request'].user
            profile = request_user.profile
            pnt = profile.location
            int_params = Q()
            """ 
                Verify that both parties are interested in each other's gender
                AND the request user is interested in the other user's gender
                THEN exclude any users that have already been voted on by, or is, the request user
                THEN annotate distance field to sort users, nearest to farthest (ASC)
                
            """
            int_params &= Q(
                profile__location__distance_lte=(pnt, D(km=40000)),
                profile__interested_in__contains=[profile.gender],
                profile__gender__in=profile.interested_in
            )
            self.queryset = User.objects.select_related(
                'profile'
            ).filter(
                int_params
            ).exclude(
                Q(
                    profile__votes__token=request_user.profile.id,
                    profile__votes__object_id=F("profile__id")
                ) | Q(id=request_user.id)
            ).annotate(
                distance=Distance('profile__location', request_user.profile.location)
            ).order_by('distance').distinct()
        else:
            # set filter to something stupid because icontains returns all objects when empty string
            # gets passed into the function
            if len(filter) < 3:
                filter = '_S@S@X#$#$@'
            self.queryset = User.objects.filter(username__icontains=filter).order_by('username')

        return self.queryset

    def retrieve(self, request, pk=None):
        # get current logged in user if at all, will use to authenticate React.js #
        if pk == 'i':
            return Response(CurrentUserSerializer(request.user, context={'request': request}).data)
        return super(UserViewSet, self).retrieve(request, pk)

    @detail_route(methods=['post'])
    def report(self, request, pk=None):
        from chat.engine.serializers import UserReportSerializer
        try:
            request.data.update({'reporter': request.user.id, 'reportee': pk})
            report = UserReportSerializer(data=request.data)
            if report.is_valid():
                report.save()
                return Response({'success': str(_(
                    'We treat your privacy and security seriously; we will be investigating this report promptly. You may be contacted for further discussion.'
                    ))
                })
            return Response({'errors': report.errors})
        except:
            return Response({'error': str(_(
                'We encountered an error when trying to create the user report in the database. The dev team has been notified.'))})

    #@list_route(methods=['post'])
    #def upload(self, request):
    #    img_data = request.data.get('file')
    #    filename = request.data.get('filename')
    #    # imgData += "=="
    #    img_data = base64.b64decode(img_data)
#
    #    filepath = MEDIA_URL.replace('/', '') + '/' + upload_to(request, filename)
    #    directory = os.path.dirname(filepath)
    #    if not os.path.exists(directory):
    #        os.makedirs(directory)
    #    with open(filepath, "wb") as fh:
    #        fh.write(img_data)
    #    try:
    #        uploaded_file = UploadedFile.objects.create(content_object=request.user,
    #                                                    file=ContentFile(img_data, name=filename),
    #                                                    user=request.user)
    #    except ValidationError:
    #        return serializers.ValidationError(_('There was an error creating the cover image'))
#
    #    uploaded_file.save()
    #    user_profile = UserProfile.objects.get(user=request.user)
    #    user_profile.cover_image = uploaded_file
    #    user_profile.save()
    #    # pick an image file you have in the working directory
    #    # (or give full path name)
    #    img = Image.open(uploaded_file.file.path, mode='r')
    #    # get the image's width and height in pixels
    #    width, height = img.size
    #    img.close()
    #    data = [{
    #        'path': uploaded_file.file.url,
    #        'id': uploaded_file.id,
    #        'width': width,
    #        'height': height,
    #    }]
#
    #    return Response(simplejson.dumps(data))

    def partial_update(self, request, pk=None):

        try:
            get_object_or_404(User, pk=pk)
        except:
            raise serializers.ValidationError(_(u"Invalid primary key data"), code=status.HTTP_400_BAD_REQUEST)

        if int(pk) is int(request.user.pk) or request.user.is_staff:
            serializer = self.get_serializer(data=request.data, partial=True)

            if serializer.is_valid():
                super(UserViewSet, self).partial_update(request, pk)
                data = {'user': self.get_object(), 'token': jwt_encode(self.get_object())}
                return Response(LBCJWTTokenSerializer(data).data)
            else:
                return Response(serializer.errors)
        else:
            raise serializers.ValidationError(_(u"You can't alter other user's account information. Nice try though"))

    @method_decorator(cache_page(0))
    def dispatch(self, *args, **kwargs):
        return super(UserViewSet, self).dispatch(*args, **kwargs)


from django.contrib.gis.measure import D


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.none()
    serializer_class = PostSerializer

    # permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        filter = self.request.query_params.get('filter', None)
        if filter is not None:
            # raw query to check whether the filter appears in any of the comments for the post
            query = "SELECT * FROM(SELECT DISTINCT ON(user_post.id) user_post.id,user_post.pub_date," \
                    "user_post.text,user_post.user_id FROM user_post FULL OUTER JOIN django_comments " \
                    "ON (user_post.id = django_comments.object_pk::integer) WHERE user_post.text LIKE %s" \
                    "OR django_comments.comment LIKE %s)user_post ORDER BY user_post.pub_date DESC"
            # this is ugly because django adds an apostrophe to the outside of string
            # and each % must be escaped with another %

            # just return empty set when the query is less than 3 characters to avoid
            # nasty error that comes when you put a,s,d,g,f,as,sd,as, etc. (because of % character being placed in front
            # 	it gets treated as a parameter for the raw query) --- YUCK #####
            if len(filter) <= 2:
                return Post.objects.none()
            queryset = Post.objects.raw(query, ["%%" + filter + "%%", "%%" + filter + "%%"])

            # return a list here to add the count() function - required by DRF
            return list(queryset)
        else:
            self.queryset = Post.objects.all()
            pnt = self.request.user.profile.location
            username = self.request.query_params.get('username', None)
            local = self.request.query_params.get('local', False)
            params = Q()
            params &= Q(user__profile__is_private=False)
            if username is not None:
                params &= Q(user__username=username)
            if local:
                params &= Q(user__profile__location__distance_lte=(pnt, D(km=500)))
            self.queryset = Post.objects.filter(params).order_by('-pub_date').select_related('user').distinct()
            return self.queryset

    def destroy(self, request, pk, *args, **kwargs):
        """
        deletes a post

        Forced to create this because of django rest framework conflicting with the delete process
        """

        post = Post.objects.get(pk=pk)
        pictures = UploadedFile.objects.filter(
            Q(object_pk=post.id) & Q(content_type_id_id=ContentType.objects.get_for_model(Post).id))
        if pictures is not None:
            for p in pictures:
                thumbnail_file_path = get_thumb_from_file_name(p.file.name)
                storage.delete(thumbnail_file_path) if storage.exists(thumbnail_file_path) else None
                if storage.exists(p.file.path):
                    p.file.delete(save=False)
        try:
            post.delete()
            return Response({'response': str(_('Your post was deleted successfully.'))})
        except:
            return Response({
                'error': str(_('Post cannot be deleted at this time. Sorry for the inconvenience, our dev team has been notified of the issue'))})
        # super(PostViewSet, self).destroy(request, *args, **kwargs)

    def create(self, request):
        """
        Creates a new post

        POST data:
        - text
        - pictures
        """
        user = request.user
        post = None
        # return Response(json.dumps(request.FILES))
        my_data = {
            'text': request.data.get('text', '')
        }
        # my_data.append(request.data['filename'])
        # my_data.append(request.data['object_content_type'])
        if request.method == 'POST':
            serializer = PostSerializer(
                data=my_data
            )
            if serializer.is_valid():
                post = serializer.save(user=request.user, pub_date=timezone.now())

                UploadedFile.objects.upload(request.user, request.data, post)

                link_hashtags_to_model(post.text, post, user)
                notify_on_mention(post.text, post, user)

                return Response(
                    PostSerializer(post, context={'request': request}).data,
                    status.HTTP_201_CREATED
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    @method_decorator(cache_page(0))
    def dispatch(self, *args, **kwargs):
        return super(PostViewSet, self).dispatch(*args, **kwargs)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = PictureComment.objects.all()
    serializer_class = CommentSerializer

    ## check content_type and object_pk for int before passing ##
    def get_queryset(self):
        queryset = PictureComment.objects.all()
        username = self.request.query_params.get('username', None)
        content_type = self.request.query_params.get('content_type', None)
        content_object = self.request.query_params.get('content_object', None)
        if username is not None:
            queryset = queryset.filter(user__username=username)
        if content_type is not None:
            queryset = queryset.filter(content_type=content_type)
        if content_object is not None:
            queryset = queryset.filter(object_pk=content_object)
        return queryset.order_by('-submit_date')

    def create(self, request):
        """
        Creates a new comment

        POST data:
        - object_pk
        - picture (UploadedFile id)
        - content_type
        - content_type_id
        - target_object
        - security_hash
        - timestamp
        - comment
        """
        user = User.objects.get(username=request.user.username)
        post = Post.objects.get(id=request.data.get('object_pk'))
        comment = None
        if request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                comment = serializer.save(site_id=1, content_object=post, user=request.user)
                # Check for image
                picture = request.data.get('picture', '')
                if picture != '':
                    picture = UploadedFile.objects.get(pk=picture)
                    comment.picture = picture
                comment.timestamp = timezone.now()
                comment.save()

                link_hashtags_to_model(comment.comment, comment, user)
                notify_on_mention(comment.comment, comment, user)
                return Response(
                    CommentSerializer(comment, context={'request': request}).data,
                    status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_serializer_context(self):
        context = super(PostViewSet, self).get_serializer_context()
        context.update({'request': self.request})
        return context

    @method_decorator(cache_page(0))
    def dispatch(self, *args, **kwargs):
        return super(CommentViewSet, self).dispatch(*args, **kwargs)


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()  # return no likes if no query params
    serializer_class = VoteSerializer

    @method_decorator(cache_page(0))
    def dispatch(self, *args, **kwargs):
        return super(VoteViewSet, self).dispatch(*args, **kwargs)

    def get_list_queryset(self):
        return Vote.objects.all()

    def get_queryset(self):
        queryset = Vote.objects.all()
        user = self.request.query_params.get('user', None)
        content_type = self.request.query_params.get('content_type', None)
        content_object = self.request.query_params.get('content_object', None)
        params = Q()
        if user is not None:
            params &= Q(token=user)
        if content_type is not None:
            params &= Q(content_type_id=content_type)
        if content_object is not None:
            params &= Q(object_id=content_object)
        if len(params) > 0:
            return Vote.objects.filter(params)
        else:
            return super(VoteViewSet, self).get_queryset()

    @list_route(methods=["POST"])
    def swipe(self, request):
        self.serializer_class = SwipeSerializer
        return super(VoteViewSet, self).create(request)

    @detail_route(methods=["POST"])
    def unmatch(self, request, pk=None):
        """
        Set the vote to -1 so the user doesn't show up in results again until their swipe are deleted

        :param request:
        :param pk:
        :return :
        """
        try:
            vote = Vote.objects.get(
                Q(token=request.user.id) &
                Q(content_type=ContentType.objects.get_for_model(UserProfile)) &
                Q(object_id=pk))
            vote.vote = -1
            vote.save()
        except Vote.DoesNotExist:
            return Response({'error': str(_('Sorry, that match does not exist'))})
        return Response({'response': str(_('Successfully unmatched'))})




class HashTagViewSet(viewsets.ModelViewSet):
    queryset = HashTag.objects.all()
    serializer_class = HashTagSerializer

    def get_queryset(self):
        queryset = self.queryset
        filter = self.request.query_params.get('filter', None)
        if filter is not None:
            queryset = queryset.filter(name__icontains=filter)
        return queryset


class HashTaggedItemViewSet(viewsets.ModelViewSet):
    queryset = HashTagged_Item.objects.all()
    serializer_class = HashTaggedItemSerializer
