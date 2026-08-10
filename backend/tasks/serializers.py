
from django.utils import timezone
from rest_framework import serializers

from accounts.models import User

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(
        source="assigned_to.username",
        read_only=True,
    )

    created_by_username = serializers.CharField(
        source="created_by.username",
        read_only=True,
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "assigned_to",
            "assigned_to_username",
            "created_by",
            "created_by_username",
            "priority",
            "status",
            "deadline",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_by",
            "created_by_username",
            "assigned_to_username",
            "created_at",
            "updated_at",
        ]

    def validate_assigned_to(self, value):
        if value.role != User.Role.EMPLOYEE:
            raise serializers.ValidationError(
                "Tasks can only be assigned to employees."
            )

        if not value.is_active:
            raise serializers.ValidationError(
                "Cannot assign a task to an inactive employee."
            )

        return value

    def validate_deadline(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError(
                "Deadline must be in the future."
            )

        return value