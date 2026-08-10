
#WORKING

from rest_framework import serializers

from .models import Notification


class NotificationSerializer(
    serializers.ModelSerializer
):

    sender_name = serializers.SerializerMethodField()

    recipient_username = serializers.CharField(
        source="recipient.username",
        read_only=True,
    )

    class Meta:
        model = Notification

        fields = [
            "id",
            "recipient",
            "recipient_username",
            "sender",
            "sender_name",
            "title",
            "message",
            "notification_type",
            "is_read",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "sender",
            "sender_name",
            "recipient_username",
            "created_at",
        ]

    def get_sender_name(self, obj):

        if not obj.sender:
            return "System"

        full_name = obj.sender.get_full_name()

        if full_name:
            return full_name

        if obj.sender.username:
            return obj.sender.username

        return "System"