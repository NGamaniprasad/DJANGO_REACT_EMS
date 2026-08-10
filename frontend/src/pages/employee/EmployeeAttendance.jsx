import { useEffect, useState } from "react";

import apiClient from "../../api/axios";
import "./EmployeeAttendance.css";


function EmployeeAttendance() {

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // TODAY DATE
    // =====================================================

    const getTodayDate = () => {

        const now = new Date();

        const year = now.getFullYear();

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    // =====================================================
    // LOAD ATTENDANCE
    // =====================================================

    const loadAttendance = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await apiClient.get(
                    "/attendance/my-attendance/"
                );

            console.log(
                "MY ATTENDANCE:",
                response.data
            );

            const records =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.attendance || [];

            setAttendance(records);

        } catch (error) {

            console.error(
                "ATTENDANCE ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to load attendance."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadAttendance();

    }, []);


    // =====================================================
    // CLOCK IN
    // =====================================================

    const clockIn = async () => {

        try {

            setProcessing(true);
            setError("");

            const response =
                await apiClient.post(
                    "/attendance/clock-in/"
                );

            console.log(
                "CLOCK IN:",
                response.data
            );

            alert(
                response.data?.message ||
                "Clock-in successful."
            );

            await loadAttendance();

        } catch (error) {

            console.error(
                "CLOCK IN ERROR:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to clock in."
            );

        } finally {

            setProcessing(false);

        }
    };


    // =====================================================
    // CLOCK OUT
    // =====================================================

    const clockOut = async () => {

        try {

            setProcessing(true);
            setError("");

            const response =
                await apiClient.post(
                    "/attendance/clock-out/"
                );

            console.log(
                "CLOCK OUT:",
                response.data
            );

            alert(
                response.data?.message ||
                "Clock-out successful."
            );

            await loadAttendance();

        } catch (error) {

            console.error(
                "CLOCK OUT ERROR:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to clock out."
            );

        } finally {

            setProcessing(false);

        }
    };


    // =====================================================
    // FORMAT TIME
    // =====================================================

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


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "--";
        }

        return new Date(
            `${value}T00:00:00`
        ).toLocaleDateString(
            [],
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =====================================================
    // FORMAT WORKING TIME
    // =====================================================

    const formatWorkingTime = (seconds) => {

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


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="attendance-page">

                <div className="attendance-header">

                    <p className="attendance-label">
                        Employee Workspace
                    </p>

                    <h1>
                        Attendance
                    </h1>

                    <p>
                        Loading your attendance...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="attendance-page">

                <div className="attendance-header">

                    <p className="attendance-label">
                        Employee Workspace
                    </p>

                    <h1>
                        Attendance
                    </h1>

                </div>


                <div className="attendance-error">

                    <h2>
                        Unable to load attendance
                    </h2>

                    <p>
                        {error}
                    </p>

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


    // =====================================================
    // TODAY RECORD
    // =====================================================

    const todayDate =
        getTodayDate();

    const today =
        attendance.find(
            (record) =>
                record.attendance_date ===
                todayDate
        );


    const hasClockedIn =
        Boolean(today?.clock_in);


    const hasClockedOut =
        Boolean(today?.clock_out);


    // =====================================================
    // PREVIOUS RECORDS
    // =====================================================

    const previousRecords =
        attendance.filter(
            (record) =>
                record.attendance_date !==
                todayDate
        );


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="attendance-page">


            {/* HEADER */}

            <div className="attendance-header">

                <div>

                    <p className="attendance-label">
                        Employee Workspace
                    </p>

                    <h1>
                        Attendance
                    </h1>

                    <p>
                        Track your daily working
                        hours and attendance.
                    </p>

                </div>

            </div>


            {/* TODAY */}

            <div className="attendance-section">

                <div className="attendance-section-header">

                    <div>

                        <h2>
                            Today's Attendance
                        </h2>

                        <p>
                            {new Date().toLocaleDateString(
                                [],
                                {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}
                        </p>

                    </div>


                    <span
                        className={`attendance-status ${
                            hasClockedOut
                                ? "completed"
                                : hasClockedIn
                                ? "working"
                                : "not-started"
                        }`}
                    >

                        {hasClockedOut
                            ? "Completed"
                            : hasClockedIn
                            ? "Working"
                            : "Not Started"}

                    </span>

                </div>


                <div className="attendance-today-grid">


                    {/* CLOCK IN */}

                    <div className="attendance-card">

                        <span>
                            Clock In
                        </span>

                        <strong>
                            {formatTime(
                                today?.clock_in
                            )}
                        </strong>

                    </div>


                    {/* CLOCK OUT */}

                    <div className="attendance-card">

                        <span>
                            Clock Out
                        </span>

                        <strong>
                            {formatTime(
                                today?.clock_out
                            )}
                        </strong>

                    </div>


                    {/* WORKING TIME */}

                    <div className="attendance-card">

                        <span>
                            Working Time
                        </span>

                        <strong>
                            {formatWorkingTime(
                                today?.total_work_seconds
                            )}
                        </strong>

                    </div>

                </div>


                {/* CLOCK IN BUTTON */}

                {!hasClockedIn && (

                    <button
                        type="button"
                        className="clock-in-button"
                        onClick={clockIn}
                        disabled={processing}
                    >

                        {processing
                            ? "Processing..."
                            : "Clock In"}

                    </button>

                )}


                {/* CLOCK OUT BUTTON */}

                {hasClockedIn &&
                    !hasClockedOut && (

                        <button
                            type="button"
                            className="clock-out-button"
                            onClick={clockOut}
                            disabled={processing}
                        >

                            {processing
                                ? "Processing..."
                                : "Clock Out"}

                        </button>
                    )}


                {/* COMPLETED */}

                {hasClockedOut && (

                    <div className="completed-message">

                        ✓ Today's attendance
                        is complete.

                    </div>
                )}

            </div>


            {/* HISTORY */}

            <div className="attendance-section">

                <div className="attendance-section-header">

                    <div>

                        <h2>
                            Attendance History
                        </h2>

                        <p>
                            Your previous attendance
                            records.
                        </p>

                    </div>


                    <span className="record-count">

                        {previousRecords.length} Record
                        {previousRecords.length !== 1
                            ? "s"
                            : ""}

                    </span>

                </div>


                {previousRecords.length === 0 ? (

                    <div className="empty-attendance">

                        <div className="empty-icon">
                            ✓
                        </div>

                        <h3>
                            No previous attendance
                        </h3>

                        <p>
                            Your previous attendance
                            records will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="attendance-table-wrapper">

                        <table className="attendance-table">

                            <thead>

                                <tr>

                                    <th>
                                        Date
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

                                {previousRecords.map(
                                    (record) => (

                                        <tr
                                            key={
                                                record.id
                                            }
                                        >

                                            <td>
                                                {formatDate(
                                                    record.attendance_date
                                                )}
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
                                                {formatWorkingTime(
                                                    record.total_work_seconds
                                                )}
                                            </td>

                                            <td>

                                                <span
                                                    className={`history-status status-${(
                                                        record.status ||
                                                        ""
                                                    ).toLowerCase()}`}
                                                >

                                                    {record.status ||
                                                        "Unknown"}

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


export default EmployeeAttendance;