

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginType, setLoginType] = useState("EMPLOYEE");

    const [formData, setFormData] = useState({
        employee_id: "",
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleLoginTypeChange = (type) => {
        setLoginType(type);
        setError("");

        setFormData({
            employee_id: "",
            username: "",
            password: "",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            console.log("LOGIN FORM:", formData);

            const user = await login(
                formData.employee_id.trim(),
                formData.username.trim(),
                formData.password
            );

            console.log("LOGIN SUCCESS USER:", user);

            if (!user) {
                throw new Error(
                    "User information was not received."
                );
            }

            if (loginType === "EMPLOYEE") {
                if (user.role !== "EMPLOYEE") {
                    setError(
                        "This account is not an employee account."
                    );
                    return;
                }

                navigate("/employee/dashboard", {
                    replace: true,
                });

                return;
            }

            if (loginType === "ADMIN") {
                if (user.role !== "ADMIN") {
                    setError(
                        "This account is not an administrator account."
                    );
                    return;
                }

                navigate("/admin/dashboard", {
                    replace: true,
                });

                return;
            }

        } catch (requestError) {
            console.error(
                "LOGIN ERROR:",
                requestError
            );

            console.error(
                "SERVER RESPONSE:",
                requestError.response?.data
            );

            let message = "Login failed.";

            const data = requestError.response?.data;

            if (
                data?.errors?.non_field_errors?.length
            ) {
                message =
                    data.errors.non_field_errors[0];
            } else if (
                data?.non_field_errors?.length
            ) {
                message =
                    data.non_field_errors[0];
            } else if (data?.detail) {
                message = data.detail;
            } else if (data?.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            } else if (requestError.message) {
                message = requestError.message;
            }

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                fontFamily: "Arial, sans-serif",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <header
                style={{
                    background: "#ffffff",
                    padding: "20px 60px",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            color: "#1e3a8a",
                        }}
                    >
                        Gamani Solutions
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 0",
                            color: "#64748b",
                            fontSize: "14px",
                        }}
                    >
                        Employee Work Management System
                    </p>
                </div>

                <nav
                    style={{
                        display: "flex",
                        gap: "25px",
                    }}
                >
                    <Link
                        to="/about"
                        style={{
                            color: "#475569",
                            textDecoration: "none",
                        }}
                    >
                        About
                    </Link>

                    <Link
                        to="/contact"
                        style={{
                            color: "#475569",
                            textDecoration: "none",
                        }}
                    >
                        Contact
                    </Link>

                    <Link
                        to="/terms"
                        style={{
                            color: "#475569",
                            textDecoration: "none",
                        }}
                    >
                        Terms of Use
                    </Link>
                </nav>
            </header>

            <main
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "50px 20px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "430px",
                        background: "#ffffff",
                        padding: "40px",
                        borderRadius: "16px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "30px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                handleLoginTypeChange(
                                    "EMPLOYEE"
                                )
                            }
                            style={{
                                flex: 1,
                                padding: "11px",
                                borderRadius: "8px",
                                border:
                                    loginType === "EMPLOYEE"
                                        ? "2px solid #2563eb"
                                        : "1px solid #cbd5e1",
                                background:
                                    loginType === "EMPLOYEE"
                                        ? "#eff6ff"
                                        : "#ffffff",
                                color:
                                    loginType === "EMPLOYEE"
                                        ? "#2563eb"
                                        : "#475569",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Employee Login
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleLoginTypeChange(
                                    "ADMIN"
                                )
                            }
                            style={{
                                flex: 1,
                                padding: "11px",
                                borderRadius: "8px",
                                border:
                                    loginType === "ADMIN"
                                        ? "2px solid #7c3aed"
                                        : "1px solid #cbd5e1",
                                background:
                                    loginType === "ADMIN"
                                        ? "#f5f3ff"
                                        : "#ffffff",
                                color:
                                    loginType === "ADMIN"
                                        ? "#7c3aed"
                                        : "#475569",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Admin Login
                        </button>
                    </div>

                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "30px",
                        }}
                    >
                        <h1
                            style={{
                                margin: 0,
                                color: "#1e293b",
                            }}
                        >
                            {loginType === "EMPLOYEE"
                                ? "Employee Login"
                                : "Admin Login"}
                        </h1>

                        <p
                            style={{
                                color: "#64748b",
                                marginTop: "10px",
                            }}
                        >
                            {loginType === "EMPLOYEE"
                                ? "Sign in to your workspace"
                                : "Sign in to administrator workspace"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {loginType === "EMPLOYEE" && (
                            <div
                                style={{
                                    marginBottom: "18px",
                                }}
                            >
                                <label
                                    htmlFor="employee_id"
                                    style={{
                                        display: "block",
                                        marginBottom: "7px",
                                        fontWeight: "600",
                                        color: "#334155",
                                    }}
                                >
                                    Employee ID
                                </label>

                                <input
                                    id="employee_id"
                                    name="employee_id"
                                    type="text"
                                    value={
                                        formData.employee_id
                                    }
                                    onChange={handleChange}
                                    placeholder="EM0001"
                                    required
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "12px",
                                        border:
                                            "1px solid #cbd5e1",
                                        borderRadius: "8px",
                                        fontSize: "15px",
                                    }}
                                />
                            </div>
                        )}

                        <div
                            style={{
                                marginBottom: "18px",
                            }}
                        >
                            <label
                                htmlFor="username"
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontWeight: "600",
                                    color: "#334155",
                                }}
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder={
                                    loginType === "EMPLOYEE"
                                        ? "rahul"
                                        : "admin"
                                }
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "12px",
                                    border:
                                        "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginBottom: "20px",
                            }}
                        >
                            <label
                                htmlFor="password"
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontWeight: "600",
                                    color: "#334155",
                                }}
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "12px",
                                    border:
                                        "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                }}
                            />
                        </div>

                        {error && (
                            <div
                                style={{
                                    background: "#fee2e2",
                                    color: "#b91c1c",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    marginBottom: "18px",
                                    fontSize: "14px",
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "13px",
                                border: "none",
                                borderRadius: "8px",
                                background: loading
                                    ? "#94a3b8"
                                    : loginType === "ADMIN"
                                    ? "#7c3aed"
                                    : "#2563eb",
                                color: "#ffffff",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                            }}
                        >
                            {loading
                                ? "Signing in..."
                                : loginType === "ADMIN"
                                ? "Admin Sign In"
                                : "Sign In"}
                        </button>
                    </form>
                </div>
            </main>

            <footer
                style={{
                    background: "#0f172a",
                    color: "#cbd5e1",
                    padding: "22px 40px",
                    textAlign: "center",
                }}
            >
                © {new Date().getFullYear()} Gamani Solutions.
                All rights reserved.
            </footer>
        </div>
    );
}

export default Login;