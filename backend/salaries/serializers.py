


#WORKING


from rest_framework import serializers

from .models import SalaryRecord


class SalaryRecordSerializer(
    serializers.ModelSerializer
):

    employee_id = serializers.CharField(
        source="employee.employee_id",
        read_only=True,
    )

    class Meta:
        model = SalaryRecord

        fields = [
            "id",
            "employee",
            "employee_id",
            "salary_month",
            "base_salary",
            "performance_bonus",
            "deductions",
            "net_salary",
            "notes",
            "created_by",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "employee_id",
            "created_by",
            "created_at",
            "updated_at",
        ]