



#WORKING

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdminRole

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):

    serializer_class = NotificationSerializer

    def get_queryset(self):

        if self.request.user.role == "ADMIN":
            return Notification.objects.select_related(
                "recipient",
                "sender",
            ).all().order_by("-created_at")

        return Notification.objects.select_related(
            "recipient",
            "sender",
        ).filter(
            recipient_id=self.request.user.id
        ).order_by("-created_at")

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve",
            "my",
            "unread_count",
            "mark_read",
            "mark_all_read",
        ]:
            return [IsAuthenticated()]

        return [
            IsAuthenticated(),
            IsAdminRole(),
        ]

    def perform_create(self, serializer):
        serializer.save(
            sender=self.request.user
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="my",
    )
    def my(self, request):

        notifications = Notification.objects.select_related(
            "recipient",
            "sender",
        ).filter(
            recipient_id=request.user.id
        ).order_by("-created_at")

        serializer = self.get_serializer(
            notifications,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="unread-count",
    )
    def unread_count(self, request):

        count = Notification.objects.filter(
            recipient_id=request.user.id,
            is_read=False,
        ).count()

        return Response({
            "count": count
        })

    @action(
        detail=True,
        methods=["post"],
        url_path="mark-read",
    )
    def mark_read(self, request, pk=None):

        notification = Notification.objects.filter(
            id=pk,
            recipient_id=request.user.id,
        ).first()

        if not notification:
            return Response(
                {
                    "detail": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.is_read = True
        notification.save(
            update_fields=["is_read"]
        )

        return Response({
            "message": "Notification marked as read."
        })

    @action(
        detail=False,
        methods=["post"],
        url_path="mark-all-read",
    )
    def mark_all_read(self, request):

        updated = Notification.objects.filter(
            recipient_id=request.user.id,
            is_read=False,
        ).update(
            is_read=True
        )

        return Response({
            "message": "All notifications marked as read.",
            "updated": updated,
        })

    def destroy(self, request, *args, **kwargs):

        if request.user.role != "ADMIN":
            return Response(
                {
                    "detail": (
                        "Only admins can delete "
                        "notifications."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().destroy(
            request,
            *args,
            **kwargs,
        )