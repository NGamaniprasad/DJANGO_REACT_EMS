


from django.db import transaction
from django.contrib.auth import get_user_model

from rest_framework import serializers

from accounts.utils import (
    generate_employee_id,
    generate_temporary_password,
)

from .models import Employee


User = get_user_model()


class EmployeeSerializer(serializers.ModelSerializer):

    # =========================================================
    # USER INFORMATION
    # =========================================================

    user_id = serializers.IntegerField(
        source="user.id",
        read_only=True,
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True,
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True,
    )

    is_active = serializers.BooleanField(
        source="user.is_active",
        read_only=True,
    )

    # =========================================================
    # META
    # =========================================================

    class Meta:
        model = Employee

        fields = [
            "id",

            # IMPORTANT:
            # This is the User ID used by Task.assigned_to
            "user_id",

            "employee_id",

            "username",
            "email",
            "first_name",
            "last_name",

            "phone",
            "department",
            "designation",
            "joining_date",
            "date_of_birth",
            "address",
            "profile_image",
            "is_active",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user_id",
            "employee_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "created_at",
            "updated_at",
        ]


class EmployeeCreateSerializer(
    serializers.ModelSerializer
):

    username = serializers.CharField(
        write_only=True,
        required=True,
    )

    email = serializers.EmailField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    first_name = serializers.CharField(
        write_only=True,
        required=True,
    )

    last_name = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = Employee

        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "department",
            "designation",
            "joining_date",
            "date_of_birth",
            "address",
        ]

    def validate_username(self, value):

        if User.objects.filter(
            username=value
        ).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        return value

    @transaction.atomic
    def create(self, validated_data):

        username = validated_data.pop(
            "username"
        )

        email = validated_data.pop(
            "email",
            "",
        )

        first_name = validated_data.pop(
            "first_name"
        )

        last_name = validated_data.pop(
            "last_name",
            "",
        )

        employee_id = generate_employee_id()

        temporary_password = (
            generate_temporary_password()
        )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=temporary_password,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.EMPLOYEE,
        )

        employee = Employee.objects.create(
            user=user,
            employee_id=employee_id,
            **validated_data,
        )

        employee._temporary_password = (
            temporary_password
        )

        return employee