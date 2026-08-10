import { useEffect, useState } from "react";

import apiClient from "../../api/axios";
import "./EmployeeNotifications.css";

function EmployeeNotifications() {
    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [markingAll, setMarkingAll] =
        useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        setError("");

        try {
            const response =
                await apiClient.get(
                    "/notifications/my/"
                );

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

            setNotifications(data);
        } catch (error) {
            console.error(
                "Notification fetch error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (
        notificationId
    ) => {
        try {
            await apiClient.post(
                `/notifications/${notificationId}/mark-read/`
            );

            setNotifications(
                (previous) =>
                    previous.map(
                        (notification) =>
                            notification.id ===
                            notificationId
                                ? {
                                      ...notification,
                                      is_read: true,
                                  }
                                : notification
                    )
            );
        } catch (error) {
            console.error(
                "Mark notification error:",
                error
            );
        }
    };

    const markAllAsRead = async () => {
        setMarkingAll(true);

        try {
            await apiClient.post(
                "/notifications/mark-all-read/"
            );

            setNotifications(
                (previous) =>
                    previous.map(
                        (notification) => ({
                            ...notification,
                            is_read: true,
                        })
                    )
            );
        } catch (error) {
            console.error(
                "Mark all notifications error:",
                error
            );
        } finally {
            setMarkingAll(false);
        }
    };

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.is_read
        ).length;

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "ANNOUNCEMENT":
                return "📢";

            case "TASK":
                return "✓";

            case "ATTENDANCE":
                return "◷";

            case "SALARY":
                return "₹";

            case "WORK_REVIEW":
                return "★";

            default:
                return "🔔";
        }
    };

    return (
        <div className="employee-notifications-page">

            <div className="notifications-header">

                <div>
                    <p className="notifications-label">
                        EMPLOYEE WORKSPACE
                    </p>

                    <h1>
                        Notifications
                    </h1>

                    <p className="notifications-description">
                        Stay updated with the
                        latest information from
                        your organization.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        className="mark-all-button"
                        onClick={
                            markAllAsRead
                        }
                        disabled={
                            markingAll
                        }
                    >
                        {markingAll
                            ? "Marking..."
                            : "Mark all as read"}
                    </button>
                )}

            </div>

            {error && (
                <div className="notification-error">
                    {error}
                </div>
            )}

            <div className="notification-summary">

                <div>
                    <span>
                        TOTAL
                    </span>

                    <strong>
                        {notifications.length}
                    </strong>
                </div>

                <div>
                    <span>
                        UNREAD
                    </span>

                    <strong>
                        {unreadCount}
                    </strong>
                </div>

            </div>

            {loading ? (
                <div className="notification-empty">
                    <div className="notification-loader" />

                    <p>
                        Loading notifications...
                    </p>
                </div>
            ) : notifications.length ===
              0 ? (
                <div className="notification-empty">

                    <div className="notification-empty-icon">
                        🔔
                    </div>

                    <h3>
                        No notifications
                    </h3>

                    <p>
                        You don't have any
                        notifications yet.
                    </p>

                </div>
            ) : (
                <div className="notification-list">

                    {notifications.map(
                        (notification) => (
                            <div
                                key={
                                    notification.id
                                }
                                className={`notification-card ${
                                    notification.is_read
                                        ? "read"
                                        : "unread"
                                }`}
                            >

                                <div className="notification-icon">
                                    {getNotificationIcon(
                                        notification.notification_type
                                    )}
                                </div>

                                <div className="notification-content">

                                    <div className="notification-top">

                                        <div>
                                            <h3>
                                                {
                                                    notification.title
                                                }
                                            </h3>

                                            <span
                                                className={`notification-type ${notification.notification_type?.toLowerCase()}`}
                                            >
                                                {
                                                    notification.notification_type
                                                }
                                            </span>
                                        </div>

                                        {!notification.is_read && (
                                            <span className="unread-dot" />
                                        )}

                                    </div>

                                    <p>
                                        {
                                            notification.message
                                        }
                                    </p>

                                    <div className="notification-footer">

                                        <span>
                                            {
                                                notification.sender_name ||
                                                "System"
                                            }
                                        </span>

                                        <span>
                                            {formatDate(
                                                notification.created_at
                                            )}
                                        </span>

                                    </div>

                                </div>

                                {!notification.is_read && (
                                    <button
                                        type="button"
                                        className="notification-read-button"
                                        onClick={() =>
                                            markAsRead(
                                                notification.id
                                            )
                                        }
                                    >
                                        Mark as read
                                    </button>
                                )}

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default EmployeeNotifications;