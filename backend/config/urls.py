from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
path(
    "api/auth/",
    include("accounts.urls"),
),

    path(
        "api/",
        include("employees.urls"),
    ),

    path(
        "api/",
        include("tasks.urls"),
    ),

    path(
        "api/",
        include("attendance.urls"),
    ),

    path(
        "api/",
        include("breaks.urls"),
    ),

    path(
        "api/",
        include("work_reviews.urls"),
    ),

    path(
        "api/",
        include("salaries.urls"),
    ),

    path(
        "api/",
        include("notifications.urls"),
    ),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )