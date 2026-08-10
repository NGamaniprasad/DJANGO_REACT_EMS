from django.urls import path
from rest_framework.routers import DefaultRouter

from .dashboard_views import AdminDashboardView
from .employee_dashboard_views import EmployeeDashboardView
from .views import (
    TaskViewSet,
    TaskSubmissionViewSet,
)


router = DefaultRouter()

router.register(
    "tasks",
    TaskViewSet,
    basename="task",
)

router.register(
    "task-submissions",
    TaskSubmissionViewSet,
    basename="task-submission",
)


urlpatterns = [
    path(
        "dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard",
    ),
    path(
        "employee-dashboard/",
        EmployeeDashboardView.as_view(),
        name="employee-dashboard",
    ),
]

urlpatterns += router.urls