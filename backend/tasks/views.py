from django.utils import timezone

from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import (
    FormParser,
    MultiPartParser,
    JSONParser,
)
from rest_framework.permissions import IsAuthenticated

from .models import Task, TaskSubmission
from .permissions import TaskPermission
from .serializers import TaskSerializer
from .submission_serializers import TaskSubmissionSerializer


# ============================================================
# TASK VIEWSET
# ============================================================

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    permission_classes = [
        IsAuthenticated,
        TaskPermission,
    ]

    filterset_fields = [
        "status",
        "priority",
        "assigned_to",
    ]

    search_fields = [
        "title",
        "description",
        "assigned_to__username",
    ]

    ordering_fields = [
        "deadline",
        "priority",
        "created_at",
        "status",
    ]

    ordering = ["deadline"]

    def get_queryset(self):
        user = self.request.user

        queryset = Task.objects.select_related(
            "assigned_to",
            "created_by",
        )

        if user.role == "ADMIN":
            return queryset.all()

        return queryset.filter(
            assigned_to=user
        )

    def perform_create(self, serializer):
        if self.request.user.role != "ADMIN":
            raise PermissionDenied(
                "Only administrators can create tasks."
            )

        serializer.save(
            created_by=self.request.user
        )

    def perform_update(self, serializer):
        user = self.request.user

        # Admin can update everything
        if user.role == "ADMIN":
            serializer.save()
            return

        task = self.get_object()

        if task.assigned_to != user:
            raise PermissionDenied(
                "You can only update your own tasks."
            )

        # Employee can only update status
        allowed_fields = {
            "status",
        }

        submitted_fields = set(
            self.request.data.keys()
        )

        unauthorized_fields = (
            submitted_fields - allowed_fields
        )

        if unauthorized_fields:
            raise PermissionDenied(
                "Employees can only update task status."
            )

        if task.status == Task.Status.APPROVED:
            raise PermissionDenied(
                "Approved tasks cannot be modified."
            )

        serializer.save()

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "ADMIN":
            raise PermissionDenied(
                "Only administrators can delete tasks."
            )

        return super().destroy(
            request,
            *args,
            **kwargs,
        )


# ============================================================
# TASK SUBMISSION VIEWSET
# ============================================================


class TaskSubmissionViewSet(viewsets.ModelViewSet):

    serializer_class = TaskSubmissionSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    filterset_fields = [
        "task",
        "review_status",
        "submitted_by",
    ]

    search_fields = [
        "task__title",
        "submitted_by__username",
        "description",
        "feedback",
    ]

    ordering_fields = [
        "submitted_at",
        "reviewed_at",
        "review_status",
    ]

    ordering = [
        "-submitted_at",
    ]

    def get_queryset(self):

        user = self.request.user

        queryset = TaskSubmission.objects.select_related(
            "task",
            "submitted_by",
            "reviewed_by",
        )

        # ADMIN
        if user.role == "ADMIN":
            return queryset.all()

        # EMPLOYEE
        return queryset.filter(
            submitted_by=user
        )

    def perform_create(self, serializer):

        user = self.request.user

        if user.role != "EMPLOYEE":
            raise PermissionDenied(
                "Only employees can submit completed work."
            )

        serializer.save(
            submitted_by=user
        )

    def perform_update(self, serializer):

        user = self.request.user

        # Only ADMIN can approve/reject
        if user.role != "ADMIN":
            raise PermissionDenied(
                "Only administrators can review submissions."
            )

        serializer.save()

    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "ADMIN":
            raise PermissionDenied(
                "Only administrators can delete submissions."
            )

        return super().destroy(
            request,
            *args,
            **kwargs,
        )