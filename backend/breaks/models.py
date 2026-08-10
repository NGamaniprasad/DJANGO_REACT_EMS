from django.db import models

# Create your models here.
from django.db import models

from attendance.models import Attendance


class Break(models.Model):
    attendance = models.ForeignKey(
        Attendance,
        on_delete=models.CASCADE,
        related_name="breaks",
    )

    break_start = models.DateTimeField()
    break_end = models.DateTimeField(null=True, blank=True)

    duration_seconds = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-break_start"]

    def __str__(self):
        return (
            f"{self.attendance.employee.employee_id} - "
            f"{self.break_start}"
        )