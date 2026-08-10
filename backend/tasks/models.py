

from django.conf import settings
from django.db import models


class Task(models.Model):

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"
        URGENT = "URGENT", "Urgent"

    class Status(models.TextChoices):
        NOT_STARTED = "NOT_STARTED", "Not Started"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    title = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="assigned_tasks",
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_tasks",
    )

    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NOT_STARTED,
    )

    deadline = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["deadline"]

        indexes = [
            models.Index(
                fields=["assigned_to", "status"]
            ),
            models.Index(
                fields=["deadline"]
            ),
            models.Index(
                fields=["priority"]
            ),
        ]

    def __str__(self):
        return self.title


class TaskSubmission(models.Model):

    class ReviewStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="task_submissions",
    )

    description = models.TextField(
        blank=True
    )

    file = models.FileField(
        upload_to="task_submissions/%Y/%m/%d/",
        blank=True,
        null=True,
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="reviewed_task_submissions",
        blank=True,
        null=True,
    )

    reviewed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    review_status = models.CharField(
        max_length=20,
        choices=ReviewStatus.choices,
        default=ReviewStatus.PENDING,
    )

    feedback = models.TextField(
        blank=True
    )

    class Meta:
        ordering = ["-submitted_at"]

        indexes = [
            models.Index(
                fields=["task", "review_status"]
            ),
            models.Index(
                fields=["submitted_by", "submitted_at"]
            ),
        ]

    def __str__(self):
        return (
            f"{self.task.title} - "
            f"{self.submitted_by.username}"
        )