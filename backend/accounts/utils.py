from django.db import transaction

from employees.models import Employee


def generate_employee_id():
    last_employee = (
        Employee.objects
        .order_by("-id")
        .first()
    )

    if last_employee is None:
        number = 1
    else:
        try:
            number = (
                int(
                    last_employee.employee_id
                    .replace("EMP", "")
                )
                + 1
            )
        except ValueError:
            number = last_employee.id + 1

    return f"EMP{number:04d}"



import secrets
import string


def generate_temporary_password(length=12):
    alphabet = (
        string.ascii_letters
        + string.digits
        + "!@#$%^&*"
    )

    return "".join(
        secrets.choice(alphabet)
        for _ in range(length)
    )