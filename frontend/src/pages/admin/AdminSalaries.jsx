import { useEffect, useMemo, useState } from "react";

import apiClient from "../../api/axios";
import "./AdminSalaries.css";

function AdminSalaries() {
    const [salaries, setSalaries] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        employee: "",
        salary_month: "",
        base_salary: "",
        performance_bonus: "",
        deductions: "",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            const [salaryResponse, employeeResponse] =
                await Promise.all([
                    apiClient.get("/salaries/"),
                    apiClient.get("/employees/"),
                ]);

            setSalaries(
                Array.isArray(salaryResponse.data)
                    ? salaryResponse.data
                    : salaryResponse.data.results || []
            );

            setEmployees(
                Array.isArray(employeeResponse.data)
                    ? employeeResponse.data
                    : employeeResponse.data.results || []
            );
        } catch (err) {
            console.error("Salary fetch error:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to load salary information."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            employee: "",
            salary_month: "",
            base_salary: "",
            performance_bonus: "",
            deductions: "",
            notes: "",
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const calculatedNetSalary = useMemo(() => {
        const base = Number(formData.base_salary) || 0;
        const bonus = Number(formData.performance_bonus) || 0;
        const deductions = Number(formData.deductions) || 0;

        return base + bonus - deductions;
    }, [
        formData.base_salary,
        formData.performance_bonus,
        formData.deductions,
    ]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);
    };

    const formatMonth = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
        });
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(
            (item) => String(item.id) === String(employeeId)
        );

        if (!employee) {
            return "Unknown Employee";
        }

        const firstName =
            employee.user?.first_name ||
            employee.first_name ||
            "";

        const lastName =
            employee.user?.last_name ||
            employee.last_name ||
            "";

        const fullName = `${firstName} ${lastName}`.trim();

        return (
            fullName ||
            employee.user?.username ||
            employee.username ||
            employee.employee_id ||
            "Employee"
        );
    };

    const getEmployeeId = (employee) => {
        return (
            employee.employee_id ||
            employee.user?.username ||
            employee.username ||
            `EMP-${employee.id}`
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.employee) {
            setError("Please select an employee.");
            return;
        }

        if (!formData.salary_month) {
            setError("Please select a salary month.");
            return;
        }

        if (!formData.base_salary) {
            setError("Please enter the base salary.");
            return;
        }

        if (calculatedNetSalary < 0) {
            setError("Net salary cannot be negative.");
            return;
        }

        setSaving(true);

        const payload = {
            employee: Number(formData.employee),
            salary_month: `${formData.salary_month}-01`,
            base_salary: Number(formData.base_salary),
            performance_bonus:
                Number(formData.performance_bonus) || 0,
            deductions:
                Number(formData.deductions) || 0,
            net_salary: calculatedNetSalary,
            notes: formData.notes,
        };

        try {
            if (editingId) {
                await apiClient.put(
                    `/salaries/${editingId}/`,
                    payload
                );

                setSuccess("Salary record updated successfully.");
            } else {
                await apiClient.post(
                    "/salaries/",
                    payload
                );

                setSuccess("Salary record created successfully.");
            }

            resetForm();
            await fetchData();
        } catch (err) {
            console.error("Salary save error:", err);

            const responseData = err.response?.data;

            if (typeof responseData === "object") {
                const messages = Object.entries(responseData)
                    .map(([field, message]) => {
                        const text = Array.isArray(message)
                            ? message.join(", ")
                            : message;

                        return `${field}: ${text}`;
                    })
                    .join(" | ");

                setError(
                    messages ||
                    "Failed to save salary record."
                );
            } else {
                setError(
                    "Failed to save salary record."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (salary) => {
        const salaryMonth = salary.salary_month
            ? salary.salary_month.substring(0, 7)
            : "";

        setFormData({
            employee: salary.employee
                ? String(salary.employee)
                : "",
            salary_month: salaryMonth,
            base_salary: salary.base_salary || "",
            performance_bonus:
                salary.performance_bonus || "",
            deductions: salary.deductions || "",
            notes: salary.notes || "",
        });

        setEditingId(salary.id);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (salary) => {
        const employeeName =
            salary.employee_id ||
            getEmployeeName(salary.employee);

        const confirmed = window.confirm(
            `Are you sure you want to delete the salary record for ${employeeName} for ${formatMonth(
                salary.salary_month
            )}?`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await apiClient.delete(
                `/salaries/${salary.id}/`
            );

            setSuccess(
                "Salary record deleted successfully."
            );

            await fetchData();
        } catch (err) {
            console.error("Salary delete error:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to delete salary record."
            );
        }
    };

    const filteredSalaries = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase();

        return salaries.filter((salary) => {
            const employeeName =
                getEmployeeName(salary.employee)
                    .toLowerCase();

            const employeeId =
                String(salary.employee_id || "")
                    .toLowerCase();

            const salaryMonth =
                String(salary.salary_month || "")
                    .toLowerCase();

            const matchesSearch =
                !searchValue ||
                employeeName.includes(searchValue) ||
                employeeId.includes(searchValue) ||
                salaryMonth.includes(searchValue);

            const matchesMonth =
                !monthFilter ||
                salaryMonth.startsWith(monthFilter);

            return (
                matchesSearch &&
                matchesMonth
            );
        });
    }, [
        salaries,
        employees,
        search,
        monthFilter,
    ]);

    const totalNetSalary = useMemo(() => {
        return filteredSalaries.reduce(
            (total, salary) =>
                total + Number(salary.net_salary || 0),
            0
        );
    }, [filteredSalaries]);

    const totalBaseSalary = useMemo(() => {
        return filteredSalaries.reduce(
            (total, salary) =>
                total + Number(salary.base_salary || 0),
            0
        );
    }, [filteredSalaries]);

    const totalDeductions = useMemo(() => {
        return filteredSalaries.reduce(
            (total, salary) =>
                total + Number(salary.deductions || 0),
            0
        );
    }, [filteredSalaries]);

    return (
        <div className="admin-salaries-page">
            <div className="admin-salaries-header">
                <div>
                    <p className="admin-salaries-label">
                        ADMINISTRATION
                    </p>

                    <h1>
                        Salaries
                    </h1>

                    <p className="admin-salaries-description">
                        Manage employee salaries,
                        bonuses, deductions and
                        monthly payroll records.
                    </p>
                </div>

                <button
                    type="button"
                    className="salary-primary-button"
                    onClick={() => {
                        setError("");
                        setSuccess("");

                        setEditingId(null);

                        setFormData({
                            employee: "",
                            salary_month: "",
                            base_salary: "",
                            performance_bonus: "",
                            deductions: "",
                            notes: "",
                        });

                        setShowForm(true);
                    }}
                >
                    + Add Salary
                </button>
            </div>

            {error && (
                <div className="salary-alert salary-alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="salary-alert salary-alert-success">
                    {success}
                </div>
            )}

            {showForm && (
                <div className="salary-form-card">
                    <div className="salary-form-header">
                        <div>
                            <p className="salary-form-label">
                                {editingId
                                    ? "UPDATE RECORD"
                                    : "NEW RECORD"}
                            </p>

                            <h2>
                                {editingId
                                    ? "Edit Salary"
                                    : "Add Salary"}
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="salary-close-button"
                            onClick={resetForm}
                        >
                            ×
                        </button>
                    </div>

                    <form
                        className="salary-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="salary-form-grid">
                            <div className="salary-field">
                                <label>
                                    Employee
                                </label>

                                <select
                                    name="employee"
                                    value={
                                        formData.employee
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select employee
                                    </option>

                                    {employees.map(
                                        (employee) => (
                                            <option
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.id
                                                }
                                            >
                                                {getEmployeeId(
                                                    employee
                                                )}{" "}
                                                -{" "}
                                                {getEmployeeName(
                                                    employee.id
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="salary-field">
                                <label>
                                    Salary Month
                                </label>

                                <input
                                    type="month"
                                    name="salary_month"
                                    value={
                                        formData.salary_month
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="salary-field">
                                <label>
                                    Base Salary
                                </label>

                                <input
                                    type="number"
                                    name="base_salary"
                                    value={
                                        formData.base_salary
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div className="salary-field">
                                <label>
                                    Performance Bonus
                                </label>

                                <input
                                    type="number"
                                    name="performance_bonus"
                                    value={
                                        formData.performance_bonus
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="salary-field">
                                <label>
                                    Deductions
                                </label>

                                <input
                                    type="number"
                                    name="deductions"
                                    value={
                                        formData.deductions
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="salary-field">
                                <label>
                                    Net Salary
                                </label>

                                <div className="salary-calculated">
                                    {formatCurrency(
                                        calculatedNetSalary
                                    )}
                                </div>
                            </div>

                            <div className="salary-field salary-field-full">
                                <label>
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={
                                        formData.notes
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="4"
                                    placeholder="Add salary notes..."
                                />
                            </div>
                        </div>

                        <div className="salary-form-actions">
                            <button
                                type="button"
                                className="salary-secondary-button"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="salary-primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Salary"
                                    : "Save Salary"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="salary-summary-grid">
                <div className="salary-summary-card">
                    <span>
                        TOTAL RECORDS
                    </span>

                    <strong>
                        {filteredSalaries.length}
                    </strong>
                </div>

                <div className="salary-summary-card">
                    <span>
                        BASE SALARY
                    </span>

                    <strong>
                        {formatCurrency(
                            totalBaseSalary
                        )}
                    </strong>
                </div>

                <div className="salary-summary-card">
                    <span>
                        DEDUCTIONS
                    </span>

                    <strong>
                        {formatCurrency(
                            totalDeductions
                        )}
                    </strong>
                </div>

                <div className="salary-summary-card salary-summary-highlight">
                    <span>
                        NET PAYROLL
                    </span>

                    <strong>
                        {formatCurrency(
                            totalNetSalary
                        )}
                    </strong>
                </div>
            </div>

            <div className="salary-list-card">
                <div className="salary-list-header">
                    <div>
                        <p className="salary-list-label">
                            PAYROLL RECORDS
                        </p>

                        <h2>
                            Employee Salaries
                        </h2>
                    </div>

                    <div className="salary-filters">
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                        <input
                            type="month"
                            value={monthFilter}
                            onChange={(event) =>
                                setMonthFilter(
                                    event.target.value
                                )
                            }
                        />

                        {(search ||
                            monthFilter) && (
                            <button
                                type="button"
                                className="salary-clear-button"
                                onClick={() => {
                                    setSearch("");
                                    setMonthFilter("");
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="salary-empty-state">
                        <div className="salary-loader" />
                        <p>
                            Loading salary records...
                        </p>
                    </div>
                ) : filteredSalaries.length ===
                  0 ? (
                    <div className="salary-empty-state">
                        <div className="salary-empty-icon">
                            ₹
                        </div>

                        <h3>
                            No salary records
                        </h3>

                        <p>
                            Add a salary record to
                            get started.
                        </p>
                    </div>
                ) : (
                    <div className="salary-table-wrapper">
                        <table className="salary-table">
                            <thead>
                                <tr>
                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Month
                                    </th>

                                    <th>
                                        Base Salary
                                    </th>

                                    <th>
                                        Bonus
                                    </th>

                                    <th>
                                        Deductions
                                    </th>

                                    <th>
                                        Net Salary
                                    </th>

                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSalaries.map(
                                    (salary) => (
                                        <tr
                                            key={
                                                salary.id
                                            }
                                        >
                                            <td>
                                                <div className="salary-employee">
                                                    <div className="salary-avatar">
                                                        {getEmployeeName(
                                                            salary.employee
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {getEmployeeName(
                                                                salary.employee
                                                            )}
                                                        </strong>

                                                        <span>
                                                            {
                                                                salary.employee_id
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {formatMonth(
                                                    salary.salary_month
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    salary.base_salary
                                                )}
                                            </td>

                                            <td className="salary-positive">
                                                +
                                                {formatCurrency(
                                                    salary.performance_bonus
                                                )}
                                            </td>

                                            <td className="salary-negative">
                                                -
                                                {formatCurrency(
                                                    salary.deductions
                                                )}
                                            </td>

                                            <td>
                                                <strong className="salary-net">
                                                    {formatCurrency(
                                                        salary.net_salary
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                <div className="salary-actions">
                                                    <button
                                                        type="button"
                                                        className="salary-edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                salary
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="salary-delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                salary
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
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
        </div>
    );
}

export default AdminSalaries;