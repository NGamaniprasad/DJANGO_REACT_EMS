from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from attendance.models import Attendance
from employees.models import Employee

from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):

    queryset = Attendance.objects.select_related(
        "employee",
        "employee__user",
    ).all()

    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        ADMIN:
            Can see all attendance.

        EMPLOYEE:
            Can see only their own attendance.
        """

        queryset = super().get_queryset()

        if self.request.user.role == "ADMIN":
            return queryset

        return queryset.filter(
            employee__user=self.request.user
        )

    # =========================================================
    # CLOCK IN
    # =========================================================

    @action(
        detail=False,
        methods=["post"],
        url_path="clock-in",
    )
    def clock_in(self, request):

        if request.user.role != "EMPLOYEE":
            return Response(
                {
                    "detail": "Only employees can clock in."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        today = timezone.localdate()

        try:
            employee = Employee.objects.get(
                user=request.user
            )
        except Employee.DoesNotExist:

            return Response(
                {
                    "detail": "Employee profile not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        attendance, created = Attendance.objects.get_or_create(
            employee=employee,
            attendance_date=today,
            defaults={
                "clock_in": timezone.now(),
                "status": Attendance.Status.PRESENT,
            },
        )

        # Already clocked in
        if not created and attendance.clock_in:

            return Response(
                {
                    "detail": "You have already clocked in today."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Existing record without clock-in
        if not attendance.clock_in:

            attendance.clock_in = timezone.now()
            attendance.status = Attendance.Status.PRESENT

            attendance.save(
                update_fields=[
                    "clock_in",
                    "status",
                    "updated_at",
                ]
            )

        return Response(
            {
                "success": True,
                "message": "Clock-in successful.",
                "attendance": AttendanceSerializer(
                    attendance,
                    context={"request": request},
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

    # =========================================================
    # CLOCK OUT
    # =========================================================

    @action(
        detail=False,
        methods=["post"],
        url_path="clock-out",
    )
    def clock_out(self, request):

        if request.user.role != "EMPLOYEE":
            return Response(
                {
                    "detail": "Only employees can clock out."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        today = timezone.localdate()

        try:
            attendance = Attendance.objects.get(
                employee__user=request.user,
                attendance_date=today,
            )

        except Attendance.DoesNotExist:

            return Response(
                {
                    "detail": "You must clock in before clocking out."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # No clock-in
        if not attendance.clock_in:

            return Response(
                {
                    "detail": "You must clock in before clocking out."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Already clocked out
        if attendance.clock_out:

            return Response(
                {
                    "detail": "You have already clocked out today."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Current clock-out time
        clock_out_time = timezone.now()

        # Calculate working seconds
        total_seconds = int(
            (
                clock_out_time -
                attendance.clock_in
            ).total_seconds()
        )

        # Safety check
        if total_seconds < 0:
            total_seconds = 0

        attendance.clock_out = clock_out_time
        attendance.total_work_seconds = total_seconds

        # Determine attendance status
        total_hours = total_seconds / 3600

        if total_hours < 4:
            attendance.status = Attendance.Status.HALF_DAY
        else:
            attendance.status = Attendance.Status.PRESENT

        attendance.save(
            update_fields=[
                "clock_out",
                "total_work_seconds",
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Clock-out successful.",
                "attendance": AttendanceSerializer(
                    attendance,
                    context={"request": request},
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    # =========================================================
    # MY ATTENDANCE
    # =========================================================

    @action(
        detail=False,
        methods=["get"],
        url_path="my-attendance",
    )
    def my_attendance(self, request):

        if request.user.role != "EMPLOYEE":

            return Response(
                {
                    "detail": "Only employees can view this."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset = self.get_queryset()

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(
            {
                "success": True,
                "attendance": serializer.data,
            }
        )

    # =========================================================
    # TODAY - ADMIN
    # =========================================================

    @action(
        detail=False,
        methods=["get"],
        url_path="today",
    )
    def today(self, request):

        if request.user.role != "ADMIN":

            return Response(
                {
                    "detail": (
                        "Administrator access is required "
                        "for this operation."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        today = timezone.localdate()

        queryset = self.get_queryset().filter(
            attendance_date=today
        )

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(
            {
                "success": True,
                "attendance": serializer.data,
            }
        )