

#WORKING


from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdminRole

from .models import SalaryRecord
from .serializers import SalaryRecordSerializer


class SalaryRecordViewSet(viewsets.ModelViewSet):

    queryset = (
        SalaryRecord.objects
        .select_related(
            "employee",
            "employee__user",
            "created_by",
        )
        .all()
    )

    serializer_class = SalaryRecordSerializer

    filterset_fields = [
        "employee",
        "salary_month",
    ]

    search_fields = [
        "employee__employee_id",
        "employee__user__username",
        "employee__user__first_name",
        "employee__user__last_name",
    ]

    ordering_fields = [
        "salary_month",
        "base_salary",
        "performance_bonus",
        "deductions",
        "net_salary",
    ]

    ordering = [
        "-salary_month",
    ]

    def get_permissions(self):

        # Employee can access their own salary
        if self.action == "my":
            return [
                IsAuthenticated(),
            ]

        # Everything else is admin-only
        return [
            IsAuthenticated(),
            IsAdminRole(),
        ]

    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="my",
    )
    def my(self, request):

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
            employee = request.user.employee_profile

        except Exception:
            return Response(
                {
                    "detail": (
                        "Employee profile not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        salaries = (
            SalaryRecord.objects
            .select_related(
                "employee",
                "employee__user",
                "created_by",
            )
            .filter(
                employee=employee
            )
            .order_by(
                "-salary_month"
            )
        )

        serializer = self.get_serializer(
            salaries,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )