


from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from attendance.models import Attendance
from .models import Break
from .serializers import BreakSerializer


class BreakViewSet(viewsets.ModelViewSet):
    queryset = Break.objects.select_related(
        "attendance",
        "attendance__employee",
        "attendance__employee__user",
    ).all()

    serializer_class = BreakSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    filterset_fields = [
        "attendance",
    ]

    search_fields = [
        "attendance__employee__employee_id",
        "attendance__employee__user__username",
    ]

    ordering_fields = [
        "break_start",
        "break_end",
        "created_at",
    ]

    ordering = ["-break_start"]

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.request.user.role == "ADMIN":
            return queryset

        return queryset.filter(
            attendance__employee__user=self.request.user
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="start",
    )
    def start_break(self, request):
        if request.user.role != "EMPLOYEE":
            return Response(
                {
                    "detail": (
                        "Only employees can "
                        "start a break."
                    )
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
                    "detail": (
                        "You must clock in before "
                        "starting a break."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not attendance.clock_in:
            return Response(
                {
                    "detail": (
                        "You must clock in before "
                        "starting a break."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if attendance.clock_out:
            return Response(
                {
                    "detail": (
                        "You have already clocked "
                        "out today."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        active_break = Break.objects.filter(
            attendance=attendance,
            break_end__isnull=True,
        ).first()

        if active_break:
            return Response(
                {
                    "detail": (
                        "You already have an "
                        "active break."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        break_record = Break.objects.create(
            attendance=attendance,
            break_start=timezone.now(),
        )

        return Response(
            {
                "message": "Break started successfully.",
                "break": BreakSerializer(
                    break_record
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="end",
    )
    def end_break(self, request):
        if request.user.role != "EMPLOYEE":
            return Response(
                {
                    "detail": (
                        "Only employees can "
                        "end a break."
                    )
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
                    "detail": (
                        "Today's attendance "
                        "record was not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        active_break = Break.objects.filter(
            attendance=attendance,
            break_end__isnull=True,
        ).first()

        if not active_break:
            return Response(
                {
                    "detail": (
                        "You do not have an "
                        "active break."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        break_end = timezone.now()

        active_break.break_end = break_end

        active_break.duration_seconds = int(
            (
                break_end
                - active_break.break_start
            ).total_seconds()
        )

        active_break.save()

        return Response(
            {
                "message": "Break ended successfully.",
                "break": BreakSerializer(
                    active_break
                ).data,
            }
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="my-breaks",
    )
    def my_breaks(self, request):
        if request.user.role != "EMPLOYEE":
            return Response(
                {
                    "detail": (
                        "Only employees can "
                        "view their breaks."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset = self.get_queryset()

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)

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
                        "Only admins can view "
                        "today's break records."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        today = timezone.localdate()

        queryset = self.queryset.filter(
            attendance__attendance_date=today
        )

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)