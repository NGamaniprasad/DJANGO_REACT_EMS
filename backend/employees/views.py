


from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdminOrReadOnly

from .models import Employee
from .serializers import EmployeeSerializer


User = get_user_model()


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    Employee management API.
    """

    queryset = Employee.objects.select_related(
        "user",
    ).all()

    serializer_class = EmployeeSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminOrReadOnly,
    ]

    filterset_fields = [
        "department",
        "designation",
        "user__is_active",
    ]

    search_fields = [
        "employee_id",
        "phone",
        "department",
        "designation",
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__email",
    ]

    ordering_fields = [
        "employee_id",
        "joining_date",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "employee_id",
    ]

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.request.user.role == "ADMIN":
            return queryset

        return queryset.filter(
            user=self.request.user,
        )

    def get_permissions(self):
        if self.action == "me":
            return [
                IsAuthenticated(),
            ]

        return [
            IsAuthenticated(),
            IsAdminOrReadOnly(),
        ]

    @transaction.atomic
    def create(self, request, *args, **kwargs):

        if request.user.role != "ADMIN":
            return Response(
                {
                    "detail": (
                        "Only admins can create "
                        "employees."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        data = request.data.copy()

        username = data.get("username")
        password = data.get("password")
        employee_id = data.get("employee_id")

        if not username:
            return Response(
                {"detail": "Username is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not password:
            return Response(
                {
                    "detail": (
                        "Temporary password is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not employee_id:
            return Response(
                {
                    "detail": "Employee ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(
            username=username
        ).exists():
            return Response(
                {
                    "detail": (
                        "A user with this username "
                        "already exists."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Employee.objects.filter(
            employee_id=employee_id
        ).exists():
            return Response(
                {
                    "detail": (
                        "An employee with this ID "
                        "already exists."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=data.get("email", ""),
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
        )

        user.role = "EMPLOYEE"

        user.save(
            update_fields=["role"]
        )

        employee = Employee.objects.create(
            user=user,
            employee_id=employee_id,
            phone=data.get("phone", ""),
            department=data.get(
                "department",
                "",
            ),
            designation=data.get(
                "designation",
                "",
            ),
            joining_date=data.get(
                "joining_date"
            ),
            date_of_birth=data.get(
                "date_of_birth"
            ),
            address=data.get(
                "address",
                "",
            ),
        )

        serializer = self.get_serializer(
            employee
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="me",
    )
    def me(self, request):

        if request.user.role != "EMPLOYEE":
            return Response(
                {
                    "detail": (
                        "This endpoint is only "
                        "for employees."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            employee = Employee.objects.select_related(
                "user"
            ).get(
                user=request.user
            )

        except Employee.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "Employee profile not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            employee
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="activate",
    )
    def activate(self, request, pk=None):

        if request.user.role != "ADMIN":
            return Response(
                {
                    "detail": (
                        "Only admins can activate "
                        "employees."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        employee = self.get_object()

        employee.user.is_active = True

        employee.user.save(
            update_fields=["is_active"]
        )

        return Response(
            {
                "message": (
                    "Employee activated successfully."
                )
            }
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="deactivate",
    )
    def deactivate(self, request, pk=None):

        if request.user.role != "ADMIN":
            return Response(
                {
                    "detail": (
                        "Only admins can deactivate "
                        "employees."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        employee = self.get_object()

        if employee.user == request.user:
            return Response(
                {
                    "detail": (
                        "You cannot deactivate "
                        "your own admin account."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee.user.is_active = False

        employee.user.save(
            update_fields=["is_active"]
        )

        return Response(
            {
                "message": (
                    "Employee deactivated successfully."
                )
            }
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="reset-password",
    )
    def reset_password(
        self,
        request,
        pk=None,
    ):

        if request.user.role != "ADMIN":
            return Response(
                {
                    "detail": (
                        "Only admins can reset "
                        "employee passwords."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        employee = self.get_object()

        new_password = request.data.get(
            "password"
        )

        if not new_password:
            return Response(
                {
                    "detail": (
                        "New password is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {
                    "detail": (
                        "Password must contain at "
                        "least 8 characters."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee.user.set_password(
            new_password
        )

        employee.user.save(
            update_fields=["password"]
        )

        return Response(
            {
                "message": (
                    "Employee password reset "
                    "successfully."
                )
            }
        )