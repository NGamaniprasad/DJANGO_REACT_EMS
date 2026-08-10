


//WORKING


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./EmployeeDashboard.css";

import apiClient from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const summaryCards = [
    {
        title: "Total Tasks",
        value: "0",
        description: "Assigned to you",
        icon: "✓",
        color: "blue",
    },
    {
        title: "Pending Tasks",
        value: "0",
        description: "Need your attention",
        icon: "◷",
        color: "orange",
    },
    {
        title: "Completed Tasks",
        value: "0",
        description: "Completed successfully",
        icon: "✓",
        color: "green",
    },
];

function EmployeeDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);

    const [salary, setSalary] = useState(null);
    const [salaryLoading, setSalaryLoading] = useState(true);

    const [employeeLoading, setEmployeeLoading] =
        useState(true);

    const [salaryError, setSalaryError] =
        useState("");

    const firstName =
        employee?.first_name ||
        user?.first_name ||
        "Employee";

    const employeeId =
        employee?.employee_id ||
        "";

    useEffect(() => {
        fetchEmployee();
        fetchLatestSalary();
    }, []);

    const fetchEmployee = async () => {
        try {
            const response = await apiClient.get(
                "/employees/me/"
            );

            setEmployee(response.data);
        } catch (error) {
            console.error(
                "Employee profile fetch error:",
                error
            );
        } finally {
            setEmployeeLoading(false);
        }
    };

    const fetchLatestSalary = async () => {
        try {
            setSalaryLoading(true);
            setSalaryError("");

            /*
             * IMPORTANT:
             *
             * Your backend endpoint should be:
             *
             * GET /api/salary/my-salary/
             *
             * If your VITE_API_BASE_URL already ends
             * with /api, this becomes:
             *
             * /salary/my-salary/
             */
            const response = await apiClient.get(
               /* "/salary/my-salary/"  */
               "/salaries/my/"
            );

            const data = Array.isArray(
                response.data
            )
                ? response.data
                : response.data.results || [];

            if (data.length > 0) {
                setSalary(data[0]);
            } else {
                setSalary(null);
            }
        } catch (error) {
            console.error(
                "Salary fetch error:",
                error
            );

            console.error(
                "Salary response:",
                error.response?.data
            );

            setSalary(null);

            setSalaryError(
                error.response?.data?.detail ||
                "Unable to load salary."
            );
        } finally {
            setSalaryLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
            }
        ).format(Number(value) || 0);
    };

    const formatMonth = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric",
            }
        );
    };

    return (
        <div className="employee-dashboard">

            {/* =========================
                WELCOME
            ========================= */}

            <section className="dashboard-welcome">

                <div>

                    <p className="welcome-label">
                        Employee Workspace
                    </p>

                    <h2>
                        Welcome back,{" "}
                        {firstName} 👋
                    </h2>

                    <p>
                        Here's an overview of
                        your work for today.
                    </p>

                    {!employeeLoading &&
                        employeeId && (
                            <p>
                                Employee ID:{" "}
                                <strong>
                                    {employeeId}
                                </strong>
                            </p>
                        )}

                </div>

            </section>


            {/* =========================
                SUMMARY
            ========================= */}

            <section className="dashboard-summary">

                {summaryCards.map(
                    (card) => (

                        <div
                            key={card.title}
                            className="summary-card"
                        >

                            <div
                                className={`summary-icon ${card.color}`}
                            >
                                {card.icon}
                            </div>

                            <div className="summary-content">

                                <span>
                                    {card.title}
                                </span>

                                <strong>
                                    {card.value}
                                </strong>

                                <small>
                                    {
                                        card.description
                                    }
                                </small>

                            </div>

                        </div>

                    )
                )}

            </section>


            {/* =========================
                ATTENDANCE + QUICK ACTIONS
            ========================= */}

            <section className="dashboard-grid">

                <div className="dashboard-panel attendance-panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Today's Attendance
                            </h3>

                            <p>
                                Your attendance
                                status
                            </p>

                        </div>

                        <span className="status-badge">
                            Not Clocked In
                        </span>

                    </div>


                    <div className="attendance-content">

                        <div className="attendance-item">

                            <span>
                                Clock In
                            </span>

                            <strong>
                                --
                            </strong>

                        </div>


                        <div className="attendance-item">

                            <span>
                                Clock Out
                            </span>

                            <strong>
                                --
                            </strong>

                        </div>


                        <div className="attendance-item">

                            <span>
                                Working Hours
                            </span>

                            <strong>
                                0h 0m
                            </strong>

                        </div>

                    </div>

                </div>


                <div className="dashboard-panel quick-panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Quick Actions
                            </h3>

                            <p>
                                Common employee
                                actions
                            </p>

                        </div>

                    </div>


                    <div className="quick-actions">

                        <button
                            type="button"
                            className="quick-action"
                        >

                            <span>
                                ◷
                            </span>

                            <div>

                                <strong>
                                    Clock In
                                </strong>

                                <small>
                                    Start your
                                    workday
                                </small>

                            </div>

                        </button>


                        <button
                            type="button"
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/employee/tasks"
                                )
                            }
                        >

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    View Tasks
                                </strong>

                                <small>
                                    Check assigned
                                    tasks
                                </small>

                            </div>

                        </button>

                    </div>

                </div>

            </section>


            {/* =========================
                SALARY
            ========================= */}

            <section className="dashboard-panel employee-salary-panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Latest Salary
                        </h3>

                        <p>
                            Your most recent
                            salary record
                        </p>

                    </div>


                    <button
                        type="button"
                        className="view-all-button"
                        onClick={() =>
                            navigate(
                                "/employee/salary"
                            )
                        }
                    >
                        View Salary
                    </button>

                </div>


                {salaryLoading ? (

                    <div className="salary-dashboard-empty">

                        <p>
                            Loading salary...
                        </p>

                    </div>

                ) : salaryError ? (

                    <div className="salary-dashboard-empty">

                        <div className="empty-state-icon">
                            !
                        </div>

                        <h4>
                            Salary unavailable
                        </h4>

                        <p>
                            {salaryError}
                        </p>

                    </div>

                ) : salary ? (

                    <div className="employee-salary-content">

                        {/* NET SALARY */}

                        <div className="employee-salary-main">

                            <span>
                                {formatMonth(
                                    salary.salary_month
                                )}
                            </span>

                            <strong>
                                {formatCurrency(
                                    salary.net_salary
                                )}
                            </strong>

                            <small>
                                Net Salary
                            </small>

                        </div>


                        {/* SALARY DETAILS */}

                        <div className="employee-salary-details">

                            <div>

                                <span>
                                    Base Salary
                                </span>

                                <strong>
                                    {formatCurrency(
                                        salary.base_salary
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Bonus
                                </span>

                                <strong className="salary-bonus">
                                    +
                                    {formatCurrency(
                                        salary.performance_bonus
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Deductions
                                </span>

                                <strong className="salary-deduction">
                                    -
                                    {formatCurrency(
                                        salary.deductions
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="salary-dashboard-empty">

                        <div className="empty-state-icon">
                            ₹
                        </div>

                        <h4>
                            No salary record yet
                        </h4>

                        <p>
                            Your salary information
                            will appear here once
                            it is added by the
                            administrator.
                        </p>

                    </div>

                )}

            </section>


            {/* =========================
                RECENT TASKS
            ========================= */}

            <section className="dashboard-panel tasks-panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Recent Tasks
                        </h3>

                        <p>
                            Your latest assigned
                            work
                        </p>

                    </div>


                    <button
                        type="button"
                        className="view-all-button"
                        onClick={() =>
                            navigate(
                                "/employee/tasks"
                            )
                        }
                    >
                        View All
                    </button>

                </div>


                <div className="empty-state">

                    <div className="empty-state-icon">
                        ✓
                    </div>

                    <h4>
                        No tasks yet
                    </h4>

                    <p>
                        Your assigned tasks
                        will appear here.
                    </p>

                </div>

            </section>

        </div>
    );
}

export default EmployeeDashboard;