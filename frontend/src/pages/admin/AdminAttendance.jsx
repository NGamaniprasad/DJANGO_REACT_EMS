import { useEffect, useState } from "react";

import apiClient from "../../api/axios";
import "./AdminAttendance.css";

function AdminAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiClient.get(
                "/attendance/today/"
            );

            console.log(
                "TODAY ATTENDANCE:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setAttendance(response.data);
            } else if (
                Array.isArray(response.data?.attendance)
            ) {
                setAttendance(response.data.attendance);
            } else {
                setAttendance([]);
            }
        } catch (error) {
            console.error(
                "ADMIN ATTENDANCE ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load attendance."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    const formatTime = (value) => {
        if (!value) {
            return "--";
        }

        return new Date(value).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const formatDuration = (seconds) => {
        const totalSeconds =
            Number(seconds) || 0;

        const hours = Math.floor(
            totalSeconds / 3600
        );

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        return `${hours}h ${minutes}m`;
    };

    const getStatusClass = (status) => {
        if (!status) {
            return "unknown";
        }

        return String(status)
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    if (loading) {
        return (
            <div className="admin-attendance-page">
                <div className="admin-attendance-header">
                    <p className="admin-attendance-label">
                        Admin Workspace
                    </p>

                    <h1>Attendance</h1>

                    <p>
                        Loading today's attendance...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-attendance-page">
                <div className="admin-attendance-header">
                    <p className="admin-attendance-label">
                        Admin Workspace
                    </p>

                    <h1>Attendance</h1>
                </div>

                <div className="admin-attendance-error">
                    <h2>
                        Unable to load attendance
                    </h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={loadAttendance}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const presentCount =
        attendance.filter(
            (record) =>
                record.status === "PRESENT"
        ).length;

    const absentCount =
        attendance.filter(
            (record) =>
                record.status === "ABSENT"
        ).length;

    const halfDayCount =
        attendance.filter(
            (record) =>
                record.status === "HALF_DAY"
        ).length;

    return (
        <div className="admin-attendance-page">

            <div className="admin-attendance-header">

                <div>
                    <p className="admin-attendance-label">
                        Admin Workspace
                    </p>

                    <h1>Attendance</h1>

                    <p>
                        Monitor today's employee
                        attendance.
                    </p>
                </div>

                <button
                    type="button"
                    className="attendance-refresh-button"
                    onClick={loadAttendance}
                >
                    Refresh
                </button>

            </div>


            {/* SUMMARY */}

            <div className="attendance-summary">

                <div className="summary-card">
                    <span>Total Records</span>

                    <strong>
                        {attendance.length}
                    </strong>
                </div>

                <div className="summary-card present">
                    <span>Present</span>

                    <strong>
                        {presentCount}
                    </strong>
                </div>

                <div className="summary-card absent">
                    <span>Absent</span>

                    <strong>
                        {absentCount}
                    </strong>
                </div>

                <div className="summary-card half-day">
                    <span>Half Day</span>

                    <strong>
                        {halfDayCount}
                    </strong>
                </div>

            </div>


            {/* TABLE */}

            <div className="admin-attendance-section">

                <div className="section-heading">

                    <div>
                        <h2>
                            Today's Attendance
                        </h2>

                        <p>
                            Employee clock-in and
                            clock-out records.
                        </p>
                    </div>

                    <span className="record-count">
                        {attendance.length} Records
                    </span>

                </div>


                {attendance.length === 0 ? (

                    <div className="empty-admin-attendance">

                        <div className="empty-icon">
                            ✓
                        </div>

                        <h3>
                            No attendance records
                        </h3>

                        <p>
                            No employees have
                            recorded attendance
                            today.
                        </p>

                    </div>

                ) : (

                    <div className="admin-attendance-table-wrapper">

                        <table className="admin-attendance-table">

                            <thead>
                                <tr>
                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Employee ID
                                    </th>

                                    <th>
                                        Clock In
                                    </th>

                                    <th>
                                        Clock Out
                                    </th>

                                    <th>
                                        Working Time
                                    </th>

                                    <th>
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {attendance.map(
                                    (record) => (
                                        <tr
                                            key={
                                                record.id
                                            }
                                        >

                                            <td>
                                                <strong>
                                                    {
                                                        record.employee_name ||
                                                        "Unknown"
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    record.employee_id ||
                                                    "--"
                                                }
                                            </td>

                                            <td>
                                                {formatTime(
                                                    record.clock_in
                                                )}
                                            </td>

                                            <td>
                                                {formatTime(
                                                    record.clock_out
                                                )}
                                            </td>

                                            <td>
                                                {formatDuration(
                                                    record.total_work_seconds
                                                )}
                                            </td>

                                            <td>

                                                <span
                                                    className={`admin-status status-${getStatusClass(
                                                        record.status
                                                    )}`}
                                                >
                                                    {
                                                        record.status ||
                                                        "Unknown"
                                                    }
                                                </span>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminAttendance;