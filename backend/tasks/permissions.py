

from rest_framework.permissions import (
    BasePermission,
    SAFE_METHODS,
)


class TaskPermission(BasePermission):

    message = (
        "You do not have permission to perform "
        "this task operation."
    )

    def has_permission(self, request, view):

        user = request.user

        print("\n========================================")
        print("TASK PERMISSION CHECK")
        print("METHOD:", request.method)
        print("USER ID:", getattr(user, "id", None))
        print("USERNAME:", getattr(user, "username", None))
        print("ROLE:", getattr(user, "role", None))
        print(
            "AUTHENTICATED:",
            getattr(user, "is_authenticated", False),
        )
        print(
            "IS STAFF:",
            getattr(user, "is_staff", False),
        )
        print(
            "IS SUPERUSER:",
            getattr(user, "is_superuser", False),
        )
        print("========================================\n")

        if not user or not user.is_authenticated:
            print("RESULT: DENIED - NOT AUTHENTICATED")
            return False

        if user.role == "ADMIN":
            print("RESULT: ALLOWED - ADMIN")
            return True

        if user.role == "EMPLOYEE":

            if request.method in SAFE_METHODS:
                print("RESULT: ALLOWED - EMPLOYEE SAFE METHOD")
                return True

            if request.method in ("PUT", "PATCH"):
                print("RESULT: ALLOWED - EMPLOYEE UPDATE")
                return True

            print("RESULT: DENIED - EMPLOYEE WRITE")
            return False

        print("RESULT: DENIED - UNKNOWN ROLE")
        return False

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):

        user = request.user

        if user.role == "ADMIN":
            return True

        if user.role != "EMPLOYEE":
            return False

        if obj.assigned_to != user:
            return False

        if request.method in SAFE_METHODS:
            return True

        if request.method in ("PUT", "PATCH"):
            return True

        return False