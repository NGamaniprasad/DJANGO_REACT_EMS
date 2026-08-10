from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task, TaskSubmission


class EmployeeDashboardView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        user = request.user

        if user.role != "EMPLOYEE":
            return Response(
                {
                    "detail": (
                        "Only employees can access "
                        "the employee dashboard."
                    )
                },
                status=403,
            )

        tasks = Task.objects.filter(
            assigned_to=user
        )

        submissions = TaskSubmission.objects.filter(
            submitted_by=user
        )

        data = {
            "tasks": {
                "total": tasks.count(),

                "not_started": tasks.filter(
                    status=Task.Status.NOT_STARTED
                ).count(),

                "in_progress": tasks.filter(
                    status=Task.Status.IN_PROGRESS
                ).count(),

                "completed": tasks.filter(
                    status=Task.Status.COMPLETED
                ).count(),

                "approved": tasks.filter(
                    status=Task.Status.APPROVED
                ).count(),

                "rejected": tasks.filter(
                    status=Task.Status.REJECTED
                ).count(),
            },

            "submissions": {
                "total": submissions.count(),

                "pending": submissions.filter(
                    review_status=(
                        TaskSubmission.ReviewStatus.PENDING
                    )
                ).count(),

                "approved": submissions.filter(
                    review_status=(
                        TaskSubmission.ReviewStatus.APPROVED
                    )
                ).count(),

                "rejected": submissions.filter(
                    review_status=(
                        TaskSubmission.ReviewStatus.REJECTED
                    )
                ).count(),
            },
        }

        return Response(data)