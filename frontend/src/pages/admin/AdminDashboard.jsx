
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const cards = [
        {
            title: "Employees",
            description: "Manage employee accounts",
            path: "/admin/employees",
        },
        {
            title: "Tasks",
            description: "Create and assign employee tasks",
            path: "/admin/tasks",
        },
        {
            title: "Task Submissions",
            description: "Review employee submitted work",
            path: "/admin/task-submissions",
        },
        {
            title: "Attendance",
            description: "Monitor employee attendance",
            path: "/admin/attendance",
        },
        {
            title: "Salaries",
            description: "Manage employee salaries and payroll",
            path: "/admin/salaries",
        },
        {
            title: "Notifications",
            description: "Post announcements and notifications",
            path: "/admin/notifications",
        },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                padding: "40px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        marginBottom: "35px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "20px",
                    }}
                >
                    <div>
                        <p
                            style={{
                                margin: 0,
                                color: "#2563eb",
                                fontSize: "14px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                            }}
                        >
                            Gamani Solutions
                        </p>

                        <h1
                            style={{
                                margin: "8px 0",
                                color: "#0f172a",
                                fontSize: "32px",
                                fontWeight: "700",
                            }}
                        >
                            Admin Dashboard
                        </h1>

                        <p
                            style={{
                                margin: 0,
                                color: "#64748b",
                                fontSize: "16px",
                            }}
                        >
                            Manage employees, tasks, submissions,
                            attendance, salaries and notifications
                            from one place.
                        </p>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "11px 18px",
                            background: "#ffffff",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            borderRadius: "9px",
                            fontWeight: "700",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Logout
                    </button>
                </div>

                {/* Dashboard Cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(230px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            onClick={() =>
                                navigate(card.path)
                            }
                            style={{
                                background: "#ffffff",
                                padding: "25px",
                                borderRadius: "14px",
                                border: "1px solid #e2e8f0",
                                cursor: "pointer",
                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-3px)";

                                e.currentTarget.style.boxShadow =
                                    "0 10px 25px rgba(15, 23, 42, 0.08)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";

                                e.currentTarget.style.boxShadow =
                                    "none";
                            }}
                        >
                            <h3
                                style={{
                                    margin: "0 0 8px",
                                    color: "#0f172a",
                                    fontSize: "18px",
                                }}
                            >
                                {card.title}
                            </h3>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#64748b",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                }}
                            >
                                {card.description}
                            </p>

                            <div
                                style={{
                                    marginTop: "18px",
                                    color: "#2563eb",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                }}
                            >
                                Open →
                            </div>
                        </div>
                    ))}
                </div>

                {/* Admin Actions */}
                <div
                    style={{
                        marginTop: "30px",
                        background: "#ffffff",
                        padding: "25px",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <h2
                        style={{
                            margin: "0 0 8px",
                            color: "#0f172a",
                            fontSize: "21px",
                        }}
                    >
                        Admin Actions
                    </h2>

                    <p
                        style={{
                            margin: "0 0 20px",
                            color: "#64748b",
                            fontSize: "14px",
                        }}
                    >
                        Quickly access frequently used
                        administration tools.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/task-submissions"
                                )
                            }
                            style={{
                                padding: "12px 18px",
                                background: "#2563eb",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Review Task Submissions
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/employees"
                                )
                            }
                            style={{
                                padding: "12px 18px",
                                background: "#0f172a",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Manage Employees
                        </button>

                        <button
                            onClick={() =>
                                navigate("/admin/tasks")
                            }
                            style={{
                                padding: "12px 18px",
                                background: "#ffffff",
                                color: "#0f172a",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Manage Tasks
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/attendance"
                                )
                            }
                            style={{
                                padding: "12px 18px",
                                background: "#ffffff",
                                color: "#0f172a",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            View Attendance
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/salaries"
                                )
                            }
                            style={{
                                padding: "12px 18px",
                                background: "#ffffff",
                                color: "#0f172a",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Manage Salaries
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/notifications"
                                )
                            }
                            style={{
                                padding: "12px 18px",
                                background: "#ffffff",
                                color: "#0f172a",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Post Notification
                        </button>
                    </div>
                </div>

                {/* Quick Management */}
                <div
                    style={{
                        marginTop: "30px",
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {/* Salary */}
                    <div
                        style={{
                            background: "#ffffff",
                            padding: "24px",
                            borderRadius: "14px",
                            border: "1px solid #e2e8f0",
                        }}
                    >
                        <h3
                            style={{
                                margin: "0 0 8px",
                                color: "#0f172a",
                                fontSize: "18px",
                            }}
                        >
                            Salary Management
                        </h3>

                        <p
                            style={{
                                margin: "0 0 18px",
                                color: "#64748b",
                                fontSize: "14px",
                                lineHeight: "1.5",
                            }}
                        >
                            Create monthly salary records,
                            bonuses and deductions for
                            employees.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/salaries"
                                )
                            }
                            style={{
                                padding: "10px 16px",
                                background: "#0f172a",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Manage Salaries →
                        </button>
                    </div>

                    {/* Notifications */}
                    <div
                        style={{
                            background: "#ffffff",
                            padding: "24px",
                            borderRadius: "14px",
                            border: "1px solid #e2e8f0",
                        }}
                    >
                        <h3
                            style={{
                                margin: "0 0 8px",
                                color: "#0f172a",
                                fontSize: "18px",
                            }}
                        >
                            Notifications
                        </h3>

                        <p
                            style={{
                                margin: "0 0 18px",
                                color: "#64748b",
                                fontSize: "14px",
                                lineHeight: "1.5",
                            }}
                        >
                            Post important announcements
                            and updates for employees.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/notifications"
                                )
                            }
                            style={{
                                padding: "10px 16px",
                                background: "#2563eb",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Post Notification →
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "40px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e2e8f0",
                        color: "#94a3b8",
                        fontSize: "13px",
                    }}
                >
                    © {new Date().getFullYear()} Gamani
                    Solutions. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

