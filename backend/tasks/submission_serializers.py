


from django.utils import timezone
from rest_framework import serializers

from .models import Task, TaskSubmission


class TaskSubmissionSerializer(serializers.ModelSerializer):

    task_title = serializers.CharField(
        source="task.title",
        read_only=True,
    )

    submitted_by_username = serializers.CharField(
        source="submitted_by.username",
        read_only=True,
    )

    reviewed_by_username = serializers.CharField(
        source="reviewed_by.username",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = TaskSubmission

        fields = [
            "id",
            "task",
            "task_title",
            "submitted_by",
            "submitted_by_username",
            "description",
            "file",
            "submitted_at",
            "reviewed_by",
            "reviewed_by_username",
            "reviewed_at",
            "review_status",
            "feedback",
        ]

        read_only_fields = [
            "id",
            "submitted_by",
            "submitted_by_username",
            "submitted_at",
            "reviewed_by",
            "reviewed_by_username",
            "reviewed_at",
        ]

    def validate_task(self, task):
        request = self.context.get("request")

        if not request:
            return task

        user = request.user

        if user.role == "EMPLOYEE":

            if task.assigned_to != user:
                raise serializers.ValidationError(
                    "You can only submit work for tasks assigned to you."
                )

            if task.status not in [
                Task.Status.IN_PROGRESS,
                Task.Status.COMPLETED,
            ]:
                raise serializers.ValidationError(
                    "Work can only be submitted for a task "
                    "that is in progress or completed."
                )

        return task

    def validate_review_status(self, value):
        request = self.context.get("request")

        if not request:
            return value

        if request.user.role != "ADMIN":
            raise serializers.ValidationError(
                "Only administrators can change review status."
            )

        allowed_statuses = [
            TaskSubmission.ReviewStatus.PENDING,
            TaskSubmission.ReviewStatus.APPROVED,
            TaskSubmission.ReviewStatus.REJECTED,
        ]

        if value not in allowed_statuses:
            raise serializers.ValidationError(
                "Invalid review status."
            )

        return value

    def update(self, instance, validated_data):

        request = self.context.get("request")

        if not request:
            return super().update(
                instance,
                validated_data,
            )

        user = request.user

        # ====================================================
        # ADMIN REVIEW
        # ====================================================

        if user.role == "ADMIN":

            review_status = validated_data.get(
                "review_status",
                instance.review_status,
            )

            feedback = validated_data.get(
                "feedback",
                instance.feedback,
            )

            instance.review_status = review_status
            instance.feedback = feedback

            instance.reviewed_by = user
            instance.reviewed_at = timezone.now()

            instance.save(
                update_fields=[
                    "review_status",
                    "feedback",
                    "reviewed_by",
                    "reviewed_at",
                ]
            )

            # ================================================
            # UPDATE TASK STATUS
            # ================================================

            task = instance.task

            if (
                review_status
                == TaskSubmission.ReviewStatus.APPROVED
            ):
                task.status = Task.Status.APPROVED

            elif (
                review_status
                == TaskSubmission.ReviewStatus.REJECTED
            ):
                task.status = Task.Status.REJECTED

            elif (
                review_status
                == TaskSubmission.ReviewStatus.PENDING
            ):
                task.status = Task.Status.IN_PROGRESS

            task.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            return instance

        # ====================================================
        # NON ADMIN
        # ====================================================

        return super().update(
            instance,
            validated_data,
        )