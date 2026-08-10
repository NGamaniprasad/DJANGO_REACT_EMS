import {
    Link,
    Outlet,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./ProtectedLayout.css";

function ProtectedLayout({ user }) {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            navigate("/login", {
                replace: true,
            });
        }
    };

    return (
        <div className="protected-layout">

            <aside className="sidebar">

                <div className="sidebar-logo">
                    <h2>Gamani</h2>
                    <span>Solutions</span>
                </div>

                <div className="sidebar-user">

                    <div className="user-avatar">
                        {(user?.first_name ||
                            user?.username ||
                            "U")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {user?.first_name ||
                                user?.username ||
                                "Employee"}
                        </strong>

                        <small>
                            Employee
                        </small>
                    </div>

                </div>

                <nav className="sidebar-nav">

                    <Link
                        to="/employee/dashboard"
                        className="sidebar-link"
                    >
                        <span>▣</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/employee/profile"
                        className="sidebar-link"
                    >
                        <span>◉</span>
                        My Profile
                    </Link>

                    <Link
                        to="/employee/tasks"
                        className="sidebar-link"
                    >
                        <span>✓</span>
                        My Tasks
                    </Link>

                    <Link
                        to="/employee/attendance"
                        className="sidebar-link"
                    >
                        <span>◷</span>
                        Attendance
                    </Link>

                    <Link
                        to="/employee/salary"
                        className="sidebar-link"
                    >
                        <span>₹</span>
                        Salary
                    </Link>

                    <Link
                        to="/employee/notifications"
                        className="sidebar-link"
                    >
                        <span>●</span>
                        Notifications
                    </Link>

                </nav>

                <div className="sidebar-footer">

                    <p>
                        Employee Work
                    </p>

                    <span>
                        Management System
                    </span>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </aside>

            <div className="main-area">

                <header className="top-header">

                    <div>
                        <h1>
                            Employee Workspace
                        </h1>

                        <p>
                            Welcome back,{" "}
                            {user?.first_name ||
                                user?.username ||
                                "Employee"}
                        </p>
                    </div>

                    <div className="header-user">

                        <div className="header-avatar">
                            {(user?.first_name ||
                                user?.username ||
                                "U")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {user?.first_name ||
                                    user?.username ||
                                    "Employee"}
                            </strong>

                            <small>
                                Employee
                            </small>
                        </div>

                    </div>

                </header>

                <main className="page-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default ProtectedLayout;