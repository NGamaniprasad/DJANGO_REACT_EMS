

from rest_framework.routers import DefaultRouter

from .views import BreakViewSet


router = DefaultRouter()

router.register(
    "breaks",
    BreakViewSet,
    basename="break",
)

urlpatterns = router.urls