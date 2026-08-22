



import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import ProtectedLayout from "../components/layout/ProtectedLayout";

import Login from "../pages/auth/Login";

import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import TermsOfUse from "../pages/public/TermsOfUse";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEmployees from "../pages/admin/AdminEmployees";
import AdminTasks from "../pages/admin/AdminTasks";
import AdminAttendance from "../pages/admin/AdminAttendance";
import AdminTaskSubmissions from "../pages/admin/AdminTaskSubmissions";
import AdminSalaries from "../pages/admin/AdminSalaries";
import AdminNotifications from "../pages/admin/AdminNotifications";

import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeProfile from "../pages/employee/EmployeeProfile";
import EmployeeTasks from "../pages/employee/EmployeeTasks";
import EmployeeTaskSubmission from "../pages/employee/EmployeeTaskSubmission";
import EmployeeAttendance from "../pages/employee/EmployeeAttendance";
import EmployeeSalary from "../pages/employee/EmployeeSalary";
import EmployeeNotifications from "../pages/employee/EmployeeNotifications";
import Unauthorized from "../pages/Unauthorized";

/* ================================= */
/* PROTECTED ROUTE */
/* ================================= */

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}


/* ================================= */
/* EMPLOYEE LAYOUT */
/* ================================= */

function EmployeeLayout() {
    const { user } = useAuth();

    if (user?.role !== "EMPLOYEE") {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (
        <ProtectedLayout user={user} />
    );
}


/* ================================= */
/* ADMIN ROUTE */
/* ================================= */

function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user.role !== "ADMIN") {
    return (
        <Navigate
            to="/unauthorized"
            replace
        />
    );
}

    return children;
}


/* ================================= */
/* COMING SOON */
/* ================================= */

function ComingSoon({ title }) {
    return (
        <div
            style={{
                padding: "40px",
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
            }}
        >
            <h2>{title}</h2>

            <p>
                This module is currently
                under development.
            </p>
        </div>
    );
}


/* ================================= */
/* APP ROUTES */
/* ================================= */

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ========================= */}
                {/* PUBLIC ROUTES */}
                {/* ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/terms"
                    element={<TermsOfUse />}
                />


                {/* ========================= */}
                {/* EMPLOYEE ROUTES */}
                {/* ========================= */}

                <Route
                    element={
                        <ProtectedRoute>
                            <EmployeeLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/employee/dashboard"
                        element={
                            <EmployeeDashboard />
                        }
                    />

                    <Route
                        path="/employee/profile"
                        element={
                            <EmployeeProfile />
                        }
                    />

                    <Route
                        path="/employee/tasks"
                        element={
                            <EmployeeTasks />
                        }
                    />

                    <Route
                        path="/employee/tasks/:taskId/submit"
                        element={
                            <EmployeeTaskSubmission />
                        }
                    />

                    <Route
                        path="/employee/attendance"
                        element={
                            <EmployeeAttendance />
                        }
                    />

                    {/* IMPORTANT:
                        These must be /employee/...
                        because Sidebar uses these paths.
                    */}

                    <Route
                        path="/employee/salary"
                        element={
                            <EmployeeSalary />
                        }
                    />

                    <Route
                        path="/employee/notifications"
                        element={
                            <EmployeeNotifications />
                        }
                    />

                </Route>


                {/* ========================= */}
                {/* ADMIN ROUTES */}
                {/* ========================= */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/task-submissions"
                    element={
                        <AdminRoute>
                            <AdminTaskSubmissions />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/tasks"
                    element={
                        <AdminRoute>
                            <AdminTasks />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/employees"
                    element={
                        <AdminRoute>
                            <AdminEmployees />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/attendance"
                    element={
                        <AdminRoute>
                            <AdminAttendance />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/salaries"
                    element={
                        <AdminRoute>
                            <AdminSalaries />
                        </AdminRoute>
                    }
                />

                {/* IMPORTANT:
                    THIS WAS MISSING
                */}

                <Route
                    path="/admin/notifications"
                    element={
                        <AdminRoute>
                            <AdminNotifications />
                        </AdminRoute>
                    }
                />

<Route
    path="/unauthorized"
    element={<Unauthorized />}
/>
                {/* ========================= */}
                {/* UNKNOWN ROUTE */}
                {/* ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;