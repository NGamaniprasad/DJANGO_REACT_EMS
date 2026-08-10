

from rest_framework import serializers

from .models import Break


class BreakSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(
        source="attendance.employee.employee_id",
        read_only=True,
    )

    class Meta:
        model = Break
        fields = [
            "id",
            "attendance",
            "employee_id",
            "break_start",
            "break_end",
            "duration_seconds",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "employee_id",
            "duration_seconds",
            "created_at",
            "updated_at",
        ]