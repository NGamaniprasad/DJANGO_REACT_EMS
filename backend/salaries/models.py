


#WORKING


from django.conf import settings
from django.db import models

from employees.models import Employee


class SalaryRecord(models.Model):

    employee = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="salary_records",
    )

    salary_month = models.DateField()

    base_salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    performance_bonus = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    deductions = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    net_salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    notes = models.TextField(
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_salary_records",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-salary_month"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "employee",
                    "salary_month",
                ],
                name="unique_employee_salary_month",
            )
        ]

        indexes = [
            models.Index(
                fields=[
                    "employee",
                    "salary_month",
                ]
            ),
        ]

    def __str__(self):
        return (
            f"{self.employee.employee_id} - "
            f"{self.salary_month}"
        )