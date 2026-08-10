from django.contrib.auth.models import UserManager as DjangoUserManager


class UserManager(DjangoUserManager):
    def create_superuser(
        self,
        username,
        email=None,
        password=None,
        **extra_fields,
    ):
        extra_fields.setdefault("role", "ADMIN")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return super().create_superuser(
            username=username,
            email=email,
            password=password,
            **extra_fields,
        )