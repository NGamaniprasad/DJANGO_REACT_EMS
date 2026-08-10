import { useEffect, useState } from "react";

import apiClient from "../../api/axios";
import "./AdminEmployees.css";

function AdminEmployees() {
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const [showCreate, setShowCreate] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [resetEmployee, setResetEmployee] = useState(null);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        employee_id: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        department: "",
        designation: "",
        joining_date: "",
        date_of_birth: "",
        address: "",
    });

    const [newPassword, setNewPassword] = useState("");

    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiClient.get(
                "/employees/"
            );

            console.log(
                "EMPLOYEES RESPONSE:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setEmployees(response.data);
            } else if (
                Array.isArray(response.data.results)
            ) {
                setEmployees(response.data.results);
            } else {
                setEmployees([]);
            }
        } catch (error) {
            console.error(
                "EMPLOYEES ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load employees."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            username: "",
            password: "",
            employee_id: "",
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            department: "",
            designation: "",
            joining_date: "",
            date_of_birth: "",
            address: "",
        });
    };

    const createEmployee = async (event) => {
        event.preventDefault();

        try {
            setProcessing(true);
            setError("");

            await apiClient.post(
                "/employees/",
                formData
            );

            alert(
                "Employee account created successfully."
            );

            setShowCreate(false);
            resetForm();

            await loadEmployees();
        } catch (error) {
            console.error(
                "CREATE EMPLOYEE ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            const serverError =
                error.response?.data;

            let message =
                "Unable to create employee.";

            if (serverError?.detail) {
                message = serverError.detail;
            } else if (
                typeof serverError === "object"
            ) {
                message = Object.entries(
                    serverError
                )
                    .map(
                        ([field, value]) =>
                            `${field}: ${
                                Array.isArray(value)
                                    ? value.join(", ")
                                    : value
                            }`
                    )
                    .join("\n");
            }

            alert(message);
        } finally {
            setProcessing(false);
        }
    };

    const editEmployee = async (event) => {
        event.preventDefault();

        if (!editingEmployee) {
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const response =
                await apiClient.patch(
                    `/employees/${editingEmployee.id}/`,
                    {
                        phone: formData.phone,
                        department:
                            formData.department,
                        designation:
                            formData.designation,
                        joining_date:
                            formData.joining_date ||
                            null,
                        date_of_birth:
                            formData.date_of_birth ||
                            null,
                        address:
                            formData.address,
                    }
                );

            console.log(
                "UPDATED EMPLOYEE:",
                response.data
            );

            alert(
                "Employee updated successfully."
            );

            setEditingEmployee(null);
            resetForm();

            await loadEmployees();
        } catch (error) {
            console.error(
                "UPDATE EMPLOYEE ERROR:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to update employee."
            );
        } finally {
            setProcessing(false);
        }
    };

    const openEdit = (employee) => {
        setEditingEmployee(employee);

        setFormData({
            username:
                employee.username || "",
            password: "",
            employee_id:
                employee.employee_id || "",
            email:
                employee.email || "",
            first_name:
                employee.first_name || "",
            last_name:
                employee.last_name || "",
            phone:
                employee.phone || "",
            department:
                employee.department || "",
            designation:
                employee.designation || "",
            joining_date:
                employee.joining_date || "",
            date_of_birth:
                employee.date_of_birth || "",
            address:
                employee.address || "",
        });
    };

    const activateEmployee = async (employee) => {
        try {
            setProcessing(true);

            await apiClient.post(
                `/employees/${employee.id}/activate/`
            );

            alert(
                "Employee activated successfully."
            );

            await loadEmployees();
        } catch (error) {
            console.error(
                "ACTIVATE ERROR:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to activate employee."
            );
        } finally {
            setProcessing(false);
        }
    };

    const deactivateEmployee = async (employee) => {
        const confirmed = window.confirm(
            `Deactivate ${employee.first_name} ${employee.last_name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessing(true);

            await apiClient.post(
                `/employees/${employee.id}/deactivate/`
            );

            alert(
                "Employee deactivated successfully."
            );

            await loadEmployees();
        } catch (error) {
            console.error(
                "DEACTIVATE ERROR:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to deactivate employee."
            );
        } finally {
            setProcessing(false);
        }
    };

    const resetPassword = async (event) => {
        event.preventDefault();

        if (!resetEmployee) {
            return;
        }

        if (newPassword.length < 8) {
            alert(
                "Password must contain at least 8 characters."
            );
            return;
        }

        try {
            setProcessing(true);

            await apiClient.post(
                `/employees/${resetEmployee.id}/reset-password/`,
                {
                    password: newPassword,
                }
            );

            alert(
                "Employee password reset successfully."
            );

            setResetEmployee(null);
            setNewPassword("");
        } catch (error) {
            console.error(
                "RESET PASSWORD ERROR:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to reset password."
            );
        } finally {
            setProcessing(false);
        }
    };

    const filteredEmployees =
        employees.filter((employee) => {
            const searchText =
                search.toLowerCase().trim();

            if (!searchText) {
                return true;
            }

            return (
                employee.employee_id
                    ?.toLowerCase()
                    .includes(searchText) ||
                employee.username
                    ?.toLowerCase()
                    .includes(searchText) ||
                employee.first_name
                    ?.toLowerCase()
                    .includes(searchText) ||
                employee.last_name
                    ?.toLowerCase()
                    .includes(searchText) ||
                employee.department
                    ?.toLowerCase()
                    .includes(searchText) ||
                employee.designation
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });

    if (loading) {
        return (
            <div className="admin-employees-page">
                <div className="admin-employees-header">
                    <p className="admin-label">
                        Admin Workspace
                    </p>

                    <h1>
                        Employee Management
                    </h1>

                    <p>
                        Loading employee accounts...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-employees-page">

            <div className="admin-employees-header">

                <div>
                    <p className="admin-label">
                        Admin Workspace
                    </p>

                    <h1>
                        Employee Management
                    </h1>

                    <p>
                        Manage employee accounts,
                        access and profiles.
                    </p>
                </div>

                <button
                    type="button"
                    className="add-employee-button"
                    onClick={() => {
                        resetForm();
                        setEditingEmployee(null);
                        setShowCreate(true);
                    }}
                >
                    + Add Employee
                </button>

            </div>

            {error && (
                <div className="employee-error">
                    {error}
                </div>
            )}

            <div className="employee-toolbar">

                <input
                    type="text"
                    placeholder="Search employee..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <span>
                    {filteredEmployees.length} Employee
                    {filteredEmployees.length !== 1
                        ? "s"
                        : ""}
                </span>

            </div>

            <div className="employee-table-card">

                {filteredEmployees.length === 0 ? (
                    <div className="empty-employees">
                        <h2>
                            No employees found
                        </h2>

                        <p>
                            Create an employee account
                            to get started.
                        </p>
                    </div>
                ) : (
                    <div className="employee-table-wrapper">

                        <table className="employee-table">

                            <thead>
                                <tr>
                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Employee ID
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Designation
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredEmployees.map(
                                    (employee) => (
                                        <tr
                                            key={
                                                employee.id
                                            }
                                        >

                                            <td>
                                                <div className="employee-name">
                                                    <strong>
                                                        {
                                                            employee.first_name
                                                        }{" "}
                                                        {
                                                            employee.last_name
                                                        }
                                                    </strong>

                                                    <span>
                                                        @
                                                        {
                                                            employee.username
                                                        }
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {
                                                    employee.employee_id
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.department ||
                                                    "--"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.designation ||
                                                    "--"
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        employee.is_active
                                                            ? "employee-status active"
                                                            : "employee-status inactive"
                                                    }
                                                >
                                                    {employee.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td>

                                                <div className="employee-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                employee
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setResetEmployee(
                                                                employee
                                                            );
                                                            setNewPassword(
                                                                ""
                                                            );
                                                        }}
                                                    >
                                                        Reset Password
                                                    </button>

                                                    {employee.is_active ? (
                                                        <button
                                                            type="button"
                                                            className="danger-button"
                                                            disabled={
                                                                processing
                                                            }
                                                            onClick={() =>
                                                                deactivateEmployee(
                                                                    employee
                                                                )
                                                            }
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="success-button"
                                                            disabled={
                                                                processing
                                                            }
                                                            onClick={() =>
                                                                activateEmployee(
                                                                    employee
                                                                )
                                                            }
                                                        >
                                                            Activate
                                                        </button>
                                                    )}

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {(showCreate ||
                editingEmployee) && (
                <div className="employee-modal-overlay">

                    <div className="employee-modal">

                        <div className="modal-header">

                            <div>
                                <p className="admin-label">
                                    Employee Account
                                </p>

                                <h2>
                                    {editingEmployee
                                        ? "Edit Employee"
                                        : "Create Employee"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => {
                                    setShowCreate(false);
                                    setEditingEmployee(null);
                                    resetForm();
                                }}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={
                                editingEmployee
                                    ? editEmployee
                                    : createEmployee
                            }
                        >

                            {!editingEmployee && (
                                <>
                                    <div className="form-row">

                                        <div className="form-group">
                                            <label>
                                                Username
                                            </label>

                                            <input
                                                name="username"
                                                value={
                                                    formData.username
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Employee ID
                                            </label>

                                            <input
                                                name="employee_id"
                                                value={
                                                    formData.employee_id
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="EMP0002"
                                                required
                                            />
                                        </div>

                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Temporary Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            minLength={8}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-row">

                                <div className="form-group">
                                    <label>
                                        First Name
                                    </label>

                                    <input
                                        name="first_name"
                                        value={
                                            formData.first_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        disabled={
                                            Boolean(
                                                editingEmployee
                                            )
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Last Name
                                    </label>

                                    <input
                                        name="last_name"
                                        value={
                                            formData.last_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            Boolean(
                                                editingEmployee
                                            )
                                        }
                                    />
                                </div>

                            </div>

                            {!editingEmployee && (
                                <div className="form-group">
                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>
                            )}

                            <div className="form-row">

                                <div className="form-group">
                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Department
                                    </label>

                                    <input
                                        name="department"
                                        value={
                                            formData.department
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>

                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>
                                        Designation
                                    </label>

                                    <input
                                        name="designation"
                                        value={
                                            formData.designation
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Joining Date
                                    </label>

                                    <input
                                        type="date"
                                        name="joining_date"
                                        value={
                                            formData.joining_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>

                            </div>

                            <div className="form-group">
                                <label>
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={
                                        formData.date_of_birth
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    rows="3"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreate(false);
                                        setEditingEmployee(null);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Saving..."
                                        : editingEmployee
                                        ? "Save Changes"
                                        : "Create Employee"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {resetEmployee && (
                <div className="employee-modal-overlay">

                    <div className="employee-modal small-modal">

                        <div className="modal-header">

                            <div>
                                <p className="admin-label">
                                    Security
                                </p>

                                <h2>
                                    Reset Password
                                </h2>

                                <p>
                                    {
                                        resetEmployee.first_name
                                    }{" "}
                                    {
                                        resetEmployee.last_name
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => {
                                    setResetEmployee(null);
                                    setNewPassword("");
                                }}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={resetPassword}
                        >

                            <div className="form-group">
                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(
                                            event.target.value
                                        )
                                    }
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setResetEmployee(null);
                                        setNewPassword("");
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Resetting..."
                                        : "Reset Password"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminEmployees;