

from django.contrib.auth import update_session_auth_hash

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    UserSerializer,
)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data[
            "user"
        ]

        employee = (
            serializer.validated_data
            .get("employee")
        )

        response_data = {
            "access": serializer.validated_data[
                "access"
            ],
            "refresh": serializer.validated_data[
                "refresh"
            ],
            "user": UserSerializer(user).data,
        }

        if employee:
            response_data["employee"] = {
                "id": employee.id,
                "employee_id": employee.employee_id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": employee.phone,
                "department": employee.department,
                "designation": employee.designation,
            }

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "data": response_data,
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        print(
            "CURRENT USER:",
            user.id,
            user.username,
            user.first_name,
            user.last_name,
        )

        employee_data = None

        if hasattr(
            user,
            "employee_profile"
        ):
            employee = user.employee_profile

            employee_data = {
                "id": employee.id,
                "employee_id": employee.employee_id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": employee.phone,
                "department": employee.department,
                "designation": employee.designation,
            }

        return Response(
            {
                "success": True,
                "data": {
                    "user": UserSerializer(
                        user
                    ).data,
                    "employee": employee_data,
                },
            }
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get(
            "refresh"
        )

        if not refresh_token:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Refresh token is required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(
                refresh_token
            )

            token.blacklist()

        except TokenError:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Invalid refresh token."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Logout successful.",
            },
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={
                "request": request
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = request.user

        user.set_password(
            serializer.validated_data[
                "new_password"
            ]
        )

        user.save(
            update_fields=["password"]
        )

        update_session_auth_hash(
            request,
            user,
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Password changed successfully."
                ),
            },
            status=status.HTTP_200_OK,
        )