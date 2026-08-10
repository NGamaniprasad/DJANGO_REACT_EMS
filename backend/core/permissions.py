from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    message = "Administrator access is required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsEmployeeRole(BasePermission):
    message = "Employee access is required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "EMPLOYEE"
        )


class IsAdminOrReadOnly(BasePermission):
    message = "Administrator access is required for this operation."

    def has_permission(self, request, view):
        if not (
            request.user
            and request.user.is_authenticated
        ):
            return False

        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True

        return request.user.role == "ADMIN"