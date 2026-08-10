from rest_framework import serializers

from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):

    employee_id = serializers.CharField(
        source="employee.employee_id",
        read_only=True,
    )

    employee_name = serializers.CharField(
        source="employee.user.get_full_name",
        read_only=True,
    )

    class Meta:

        model = Attendance

        fields = [
            "id",
            "employee",
            "employee_id",
            "employee_name",
            "attendance_date",
            "clock_in",
            "clock_out",
            "total_work_seconds",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "employee_id",
            "employee_name",
            "total_work_seconds",
            "created_at",
            "updated_at",
        ]