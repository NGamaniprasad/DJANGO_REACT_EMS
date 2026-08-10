from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task, TaskSubmission


User = get_user_model()


class AdminDashboardView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        if request.user.role != "ADMIN":
            return Response(
                {
                    "detail": (
                        "Only administrators can access "
                        "the dashboard."
                    )
                },
                status=403,
            )

        data = {
            "employees": User.objects.filter(
                role="EMPLOYEE"
            ).count(),

            "total_tasks": Task.objects.count(),

            "not_started_tasks": Task.objects.filter(
                status=Task.Status.NOT_STARTED
            ).count(),

            "in_progress_tasks": Task.objects.filter(
                status=Task.Status.IN_PROGRESS
            ).count(),

            "completed_tasks": Task.objects.filter(
                status=Task.Status.COMPLETED
            ).count(),

            "approved_tasks": Task.objects.filter(
                status=Task.Status.APPROVED
            ).count(),

            "rejected_tasks": Task.objects.filter(
                status=Task.Status.REJECTED
            ).count(),

            "pending_submissions": TaskSubmission.objects.filter(
                review_status=TaskSubmission.ReviewStatus.PENDING
            ).count(),

            "approved_submissions": TaskSubmission.objects.filter(
                review_status=TaskSubmission.ReviewStatus.APPROVED
            ).count(),

            "rejected_submissions": TaskSubmission.objects.filter(
                review_status=TaskSubmission.ReviewStatus.REJECTED
            ).count(),
        }

        return Response(data)