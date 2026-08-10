

#WORKING


from rest_framework.routers import DefaultRouter

from .views import SalaryRecordViewSet


router = DefaultRouter()

router.register(
    "salaries",
    SalaryRecordViewSet,
    basename="salary",
)

urlpatterns = router.urls