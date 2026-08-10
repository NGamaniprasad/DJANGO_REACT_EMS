

import { useEffect, useState } from "react";

import apiClient from "../../api/axios";
import "./AdminNotifications.css";

function AdminNotifications() {
    const [employees, setEmployees] = useState([]);

    const [loadingEmployees, setLoadingEmployees] =
        useState(true);

    const [posting, setPosting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        recipient: "",
        title: "",
        message: "",
        notification_type: "ANNOUNCEMENT",
    });


    /* ================================ */
    /* LOAD EMPLOYEES */
    /* ================================ */

    useEffect(() => {
        fetchEmployees();
    }, []);


    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            setError("");

            const response = await apiClient.get(
                "/employees/"
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setEmployees(data);

        } catch (error) {
            console.error(
                "Employee fetch error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load employees."
            );

        } finally {
            setLoadingEmployees(false);
        }
    };


    /* ================================ */
    /* HANDLE INPUT */
    /* ================================ */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    /* ================================ */
    /* POST NOTIFICATION */
    /* ================================ */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.recipient) {
            setError(
                "Please select an employee."
            );
            return;
        }

        if (!formData.title.trim()) {
            setError(
                "Please enter a notification title."
            );
            return;
        }

        if (!formData.message.trim()) {
            setError(
                "Please enter a notification message."
            );
            return;
        }

        try {
            setPosting(true);

            await apiClient.post(
                "/notifications/",
                {
                    recipient: Number(
                        formData.recipient
                    ),

                    title: formData.title.trim(),

                    message: formData.message.trim(),

                    notification_type:
                        formData.notification_type,
                }
            );

            setSuccess(
                "Notification posted successfully."
            );

            setFormData({
                recipient: "",
                title: "",
                message: "",
                notification_type:
                    "ANNOUNCEMENT",
            });

        } catch (error) {
            console.error(
                "Notification post error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to post notification."
            );

        } finally {
            setPosting(false);
        }
    };


    /* ================================ */
    /* EMPLOYEE NAME */
    /* ================================ */

    const getEmployeeName = (employee) => {
        if (employee.first_name) {
            return `${employee.first_name} ${
                employee.last_name || ""
            }`.trim();
        }

        return (
            employee.username ||
            employee.employee_id ||
            `Employee ${employee.id}`
        );
    };


    return (
        <div className="admin-notifications-page">

            <div className="admin-notifications-header">

                <div>
                    <p className="admin-notifications-label">
                        ADMINISTRATION
                    </p>

                    <h1>
                        Post Notification
                    </h1>

                    <p>
                        Send announcements and
                        important updates to employees.
                    </p>
                </div>

            </div>


            <div className="notification-form-card">

                <form
                    onSubmit={handleSubmit}
                    className="notification-form"
                >

                    {/* EMPLOYEE */}

                    <div className="form-group">

                        <label htmlFor="recipient">
                            Select Employee
                        </label>

                        <select
                            id="recipient"
                            name="recipient"
                            value={formData.recipient}
                            onChange={handleChange}
                            disabled={
                                loadingEmployees ||
                                posting
                            }
                        >

                            <option value="">
                                {loadingEmployees
                                    ? "Loading employees..."
                                    : "Select an employee"}
                            </option>

                            {employees.map(
                                (employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {getEmployeeName(
                                            employee
                                        )}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* NOTIFICATION TYPE */}

                    <div className="form-group">

                        <label htmlFor="notification_type">
                            Notification Type
                        </label>

                        <select
                            id="notification_type"
                            name="notification_type"
                            value={
                                formData.notification_type
                            }
                            onChange={handleChange}
                            disabled={posting}
                        >

                            <option value="ANNOUNCEMENT">
                                Announcement
                            </option>

                            <option value="TASK">
                                Task
                            </option>

                            <option value="ATTENDANCE">
                                Attendance
                            </option>

                            <option value="SALARY">
                                Salary
                            </option>

                            <option value="WORK_REVIEW">
                                Work Review
                            </option>

                            <option value="SYSTEM">
                                System
                            </option>

                        </select>

                    </div>


                    {/* TITLE */}

                    <div className="form-group">

                        <label htmlFor="title">
                            Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Enter notification title"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={posting}
                            maxLength={255}
                        />

                    </div>


                    {/* MESSAGE */}

                    <div className="form-group">

                        <label htmlFor="message">
                            Message
                        </label>

                        <textarea
                            id="message"
                            name="message"
                            placeholder="Write your notification message..."
                            value={formData.message}
                            onChange={handleChange}
                            disabled={posting}
                            rows={7}
                        />

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="notification-error">
                            {error}
                        </div>
                    )}


                    {/* SUCCESS */}

                    {success && (
                        <div className="notification-success">
                            {success}
                        </div>
                    )}


                    {/* BUTTON */}

                    <div className="notification-form-actions">

                        <button
                            type="submit"
                            className="notification-submit-button"
                            disabled={posting}
                        >
                            {posting
                                ? "Posting..."
                                : "Post Notification"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AdminNotifications;