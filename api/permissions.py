from rest_framework import permissions


class SafeMethodsOnlyPermission(permissions.BasePermission):
    """Only can access non-destructive methods (like GET and HEAD)"""

    def has_permission(self, request, view):
        return self.has_object_permission(request, view)

    def has_object_permission(self, request, view, obj=None):
        return request.method in permissions.SAFE_METHODS


class UserOwnerOrStaff(SafeMethodsOnlyPermission):
    def has_object_permission(self, request, view, obj=None):
        can_edit = True
        if obj is not None:
            can_edit = request.user.id == obj.id or request.user.is_staff
        return can_edit or super(UserOwnerOrStaff, self).has_object_permission(request, view, obj)


class ProfileOwnerOrStaff(SafeMethodsOnlyPermission):
    def has_object_permission(self, request, view, obj=None):
        can_edit = True
        if obj is not None:
            can_edit = request.user.id == obj.user.id or request.user.is_staff

        return can_edit or super(ProfileOwnerOrStaff, self).has_object_permission(request, view, obj)


class LikeOwnerOrStaff(SafeMethodsOnlyPermission):
    def has_object_permission(self, request, view, obj=None):
        can_edit = True
        if obj is not None:
            can_edit = request.user.id is obj.token or request.user.is_staff
        return can_edit or super(LikeOwnerOrStaff, self).has_object_permission(request, view, obj)


class NotificationOwnerOrStaff(SafeMethodsOnlyPermission):
    def has_object_permission(self, request, view, obj=None):
        can_edit = True
        if obj is not None:
            can_edit = request.user.id is obj.actor_object_id or request.user.is_staff
        return can_edit or super(NotificationOwnerOrStaff, self).has_object_permission(request, view, obj)


class CommentOwnerOrStaff(SafeMethodsOnlyPermission):
    def has_object_permission(self, request, view, obj=None):
        can_edit = True
        if obj is not None:
            can_edit = request.user.id is obj.actor_object_id or request.user.is_staff
        return can_edit or super(CommentOwnerOrStaff, self).has_object_permission(request, view, obj)


class PostAuthorCanEditPermission(SafeMethodsOnlyPermission):
    """Allow everyone to list or view, but only the other can modify existing instances"""

    def has_object_permission(self, request, view, obj=None):
        if obj is None:
            # Either a list or a create, we already check for authentication with JWT authorization
            # thus, if we got this far, the user can create new posts
            can_edit = True
        else:
            can_edit = request.user == obj.user
        return can_edit or super(PostAuthorCanEditPermission, self).has_object_permission(request, view, obj)
