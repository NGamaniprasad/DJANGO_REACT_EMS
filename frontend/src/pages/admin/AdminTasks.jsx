

//working

import { useEffect, useState } from "react";

import apiClient from "../../api/axios";
import "./AdminTasks.css";

function AdminTasks() {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assigned_to: "",
        priority: "MEDIUM",
        deadline: "",
    });

    // =========================================================
    // LOAD TASKS
    // =========================================================

    const loadTasks = async () => {
        try {
            const response = await apiClient.get(
                "/tasks/"
            );

            console.log(
                "TASKS RESPONSE:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setTasks(response.data);
            } else if (
                Array.isArray(response.data?.results)
            ) {
                setTasks(response.data.results);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error(
                "TASK LOAD ERROR:",
                error
            );

            console.error(
                "TASK SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load tasks."
            );
        }
    };

    // =========================================================
    // LOAD EMPLOYEES
    // =========================================================

    const loadEmployees = async () => {
        try {
            const response = await apiClient.get(
                "/employees/"
            );

            console.log(
                "EMPLOYEES RESPONSE:",
                response.data
            );

            let employeeList = [];

            if (Array.isArray(response.data)) {
                employeeList = response.data;
            } else if (
                Array.isArray(response.data?.results)
            ) {
                employeeList =
                    response.data.results;
            }

            console.log(
                "EMPLOYEE LIST:",
                employeeList
            );

            // Show exactly what is coming from backend
            employeeList.forEach((employee) => {
                console.log(
                    "EMPLOYEE:",
                    {
                        employee_table_id:
                            employee.id,

                        user_id:
                            employee.user_id,

                        employee_id:
                            employee.employee_id,

                        username:
                            employee.username,

                        first_name:
                            employee.first_name,

                        last_name:
                            employee.last_name,

                        is_active:
                            employee.is_active,
                    }
                );
            });

            // Only active employees can receive tasks
            const activeEmployees =
                employeeList.filter(
                    (employee) =>
                        employee.is_active !== false
                );

            setEmployees(activeEmployees);

        } catch (error) {
            console.error(
                "EMPLOYEE LOAD ERROR:",
                error
            );

            console.error(
                "EMPLOYEE SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load employees."
            );
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                await Promise.all([
                    loadTasks(),
                    loadEmployees(),
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        console.log(
            "FORM CHANGE:",
            name,
            value
        );

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            assigned_to: "",
            priority: "MEDIUM",
            deadline: "",
        });

        setEditingTask(null);
        setShowForm(false);
    };

    // =========================================================
    // ERROR MESSAGE HELPER
    // =========================================================

    const showServerError = (
        error,
        defaultMessage
    ) => {
        console.error(
            "SERVER ERROR:",
            error.response?.data
        );

        const serverError =
            error.response?.data;

        if (
            typeof serverError === "object" &&
            serverError !== null
        ) {
            const messages =
                Object.entries(serverError)
                    .map(
                        ([key, value]) => {
                            if (
                                Array.isArray(
                                    value
                                )
                            ) {
                                return `${key}: ${value.join(
                                    ", "
                                )}`;
                            }

                            if (
                                typeof value ===
                                    "object" &&
                                value !== null
                            ) {
                                return `${key}: ${JSON.stringify(
                                    value
                                )}`;
                            }

                            return `${key}: ${value}`;
                        }
                    )
                    .join("\n");

            alert(
                messages ||
                defaultMessage
            );

            return;
        }

        alert(
            serverError ||
            defaultMessage
        );
    };

    // =========================================================
    // CREATE TASK
    // =========================================================

    const createTask = async () => {
        if (!formData.title.trim()) {
            alert(
                "Task title is required."
            );
            return;
        }

        if (!formData.assigned_to) {
            alert(
                "Please select an employee."
            );
            return;
        }

        if (!formData.deadline) {
            alert(
                "Please select a deadline."
            );
            return;
        }

        try {
            setSaving(true);

            /*
             * IMPORTANT
             *
             * assigned_to MUST be the User ID.
             *
             * EmployeeSerializer now returns:
             *
             * employee.id       = Employee table ID
             * employee.user_id  = User table ID
             *
             * Task.assigned_to is a ForeignKey to User.
             *
             * Therefore the select stores employee.user_id.
             */

            const requestData = {
                title:
                    formData.title.trim(),

                description:
                    formData.description.trim(),

                assigned_to:
                    Number(
                        formData.assigned_to
                    ),

                priority:
                    formData.priority,

                deadline:
                    new Date(
                        formData.deadline
                    ).toISOString(),
            };

            console.log(
                "CREATE TASK REQUEST:",
                requestData
            );

            const response =
                await apiClient.post(
                    "/tasks/",
                    requestData
                );

            console.log(
                "TASK CREATED:",
                response.data
            );

            alert(
                "Task created successfully."
            );

            resetForm();

            await loadTasks();

        } catch (error) {
            console.error(
                "CREATE TASK ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            showServerError(
                error,
                "Unable to create task."
            );

        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // EDIT TASK
    // =========================================================

    const startEdit = (task) => {
        console.log(
            "EDIT TASK:",
            task
        );

        setEditingTask(task);

        const localDeadline =
            task.deadline
                ? new Date(
                      task.deadline
                  )
                      .toISOString()
                      .slice(0, 16)
                : "";

        setFormData({
            title:
                task.title || "",

            description:
                task.description || "",

            /*
             * TaskSerializer returns assigned_to
             * as the User ID.
             */
            assigned_to:
                task.assigned_to || "",

            priority:
                task.priority || "MEDIUM",

            deadline:
                localDeadline,
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // UPDATE TASK
    // =========================================================

    const updateTask = async () => {
        if (!editingTask) {
            return;
        }

        if (!formData.title.trim()) {
            alert(
                "Task title is required."
            );
            return;
        }

        if (!formData.assigned_to) {
            alert(
                "Please select an employee."
            );
            return;
        }

        if (!formData.deadline) {
            alert(
                "Please select a deadline."
            );
            return;
        }

        try {
            setSaving(true);

            const requestData = {
                title:
                    formData.title.trim(),

                description:
                    formData.description.trim(),

                assigned_to:
                    Number(
                        formData.assigned_to
                    ),

                priority:
                    formData.priority,

                deadline:
                    new Date(
                        formData.deadline
                    ).toISOString(),
            };

            console.log(
                "UPDATE TASK REQUEST:",
                requestData
            );

            const response =
                await apiClient.patch(
                    `/tasks/${editingTask.id}/`,
                    requestData
                );

            console.log(
                "TASK UPDATED:",
                response.data
            );

            alert(
                "Task updated successfully."
            );

            resetForm();

            await loadTasks();

        } catch (error) {
            console.error(
                "UPDATE TASK ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            showServerError(
                error,
                "Unable to update task."
            );

        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE TASK
    // =========================================================

    const deleteTask = async (task) => {
        const confirmed =
            window.confirm(
                `Delete "${task.title}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            await apiClient.delete(
                `/tasks/${task.id}/`
            );

            alert(
                "Task deleted successfully."
            );

            await loadTasks();

        } catch (error) {
            console.error(
                "DELETE TASK ERROR:",
                error
            );

            console.error(
                "SERVER:",
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                "Unable to delete task."
            );
        }
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (value) => {
        if (!value) {
            return "--";
        }

        return new Date(
            value
        ).toLocaleString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // =========================================================
    // STATUS LABEL
    // =========================================================

    const getStatusLabel = (status) => {
        const labels = {
            NOT_STARTED:
                "Not Started",

            IN_PROGRESS:
                "In Progress",

            COMPLETED:
                "Completed",

            APPROVED:
                "Approved",

            REJECTED:
                "Rejected",
        };

        return (
            labels[status] ||
            status
        );
    };

    // =========================================================
    // PRIORITY LABEL
    // =========================================================

    const getPriorityLabel = (priority) => {
        const labels = {
            LOW: "Low",
            MEDIUM: "Medium",
            HIGH: "High",
            URGENT: "Urgent",
        };

        return (
            labels[priority] ||
            priority
        );
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="admin-tasks-page">
                <div className="admin-tasks-header">
                    <p className="admin-tasks-label">
                        Admin Workspace
                    </p>

                    <h1>
                        Tasks
                    </h1>

                    <p>
                        Loading tasks and
                        employees...
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div className="admin-tasks-page">

            {/* HEADER */}

            <div className="admin-tasks-header">

                <div>
                    <p className="admin-tasks-label">
                        Admin Workspace
                    </p>

                    <h1>
                        Manage Tasks
                    </h1>

                    <p>
                        Create, assign and
                        manage employee
                        tasks.
                    </p>
                </div>

                <button
                    type="button"
                    className="create-task-button"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm
                        ? "Close"
                        : "+ Create Task"}
                </button>

            </div>

            {/* ERROR */}

            {error && (
                <div className="admin-tasks-error">
                    {error}
                </div>
            )}

            {/* EMPLOYEE COUNT DEBUG */}

            {showForm &&
                employees.length === 0 && (
                    <div className="admin-tasks-error">
                        No active employees are
                        available for task
                        assignment.
                    </div>
                )}

            {/* FORM */}

            {showForm && (
                <div className="task-form-card">

                    <div className="task-form-header">

                        <div>
                            <p className="admin-tasks-label">
                                {editingTask
                                    ? "Edit Task"
                                    : "New Task"}
                            </p>

                            <h2>
                                {editingTask
                                    ? "Update Task"
                                    : "Create New Task"}
                            </h2>
                        </div>

                    </div>

                    <div className="task-form">

                        {/* TITLE */}

                        <div className="form-group">

                            <label>
                                Task Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter task title"
                            />

                        </div>

                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Describe the task..."
                                rows="4"
                            />

                        </div>

                        {/* EMPLOYEE + PRIORITY */}

                        <div className="form-grid">

                            {/* EMPLOYEE */}

                            <div className="form-group">

                                <label>
                                    Assign Employee
                                </label>

                                <select
                                    name="assigned_to"
                                    value={
                                        formData.assigned_to
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select employee
                                    </option>

                                    {employees.map(
                                        (
                                            employee
                                        ) => (
                                            <option
                                                key={
                                                    employee.user_id
                                                }
                                                value={
                                                    employee.user_id
                                                }
                                            >
                                                {employee.first_name ||
                                                employee.last_name
                                                    ? `${employee.first_name || ""} ${employee.last_name || ""}`.trim()
                                                    : employee.username}

                                                {" - "}

                                                {
                                                    employee.employee_id
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* PRIORITY */}

                            <div className="form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={
                                        formData.priority
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="LOW">
                                        Low
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                    <option value="URGENT">
                                        Urgent
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* DEADLINE */}

                        <div className="form-group">

                            <label>
                                Deadline
                            </label>

                            <input
                                type="datetime-local"
                                name="deadline"
                                value={
                                    formData.deadline
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        {/* ACTIONS */}

                        <div className="task-form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={
                                    resetForm
                                }
                                disabled={
                                    saving
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="save-task-button"
                                onClick={
                                    editingTask
                                        ? updateTask
                                        : createTask
                                }
                                disabled={
                                    saving ||
                                    employees.length ===
                                        0
                                }
                            >
                                {saving
                                    ? "Saving..."
                                    : editingTask
                                    ? "Update Task"
                                    : "Create Task"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* TASK SUMMARY */}

            <div className="task-summary">

                <div className="summary-card">
                    <span>
                        Total Tasks
                    </span>

                    <strong>
                        {tasks.length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        Not Started
                    </span>

                    <strong>
                        {
                            tasks.filter(
                                (task) =>
                                    task.status ===
                                    "NOT_STARTED"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        In Progress
                    </span>

                    <strong>
                        {
                            tasks.filter(
                                (task) =>
                                    task.status ===
                                    "IN_PROGRESS"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        Completed
                    </span>

                    <strong>
                        {
                            tasks.filter(
                                (task) =>
                                    task.status ===
                                    "COMPLETED"
                            ).length
                        }
                    </strong>
                </div>

            </div>

            {/* TASK LIST */}

            <div className="tasks-section">

                <div className="tasks-section-header">

                    <div>
                        <h2>
                            All Tasks
                        </h2>

                        <p>
                            Manage employee
                            assignments and
                            task progress.
                        </p>
                    </div>

                    <span className="task-count">
                        {tasks.length} Task
                        {tasks.length !== 1
                            ? "s"
                            : ""}
                    </span>

                </div>

                {tasks.length === 0 ? (

                    <div className="empty-tasks">

                        <div className="empty-icon">
                            ✓
                        </div>

                        <h3>
                            No tasks created
                        </h3>

                        <p>
                            Create your first
                            task and assign it
                            to an employee.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setShowForm(
                                    true
                                )
                            }
                        >
                            Create Task
                        </button>

                    </div>

                ) : (

                    <div className="tasks-table-wrapper">

                        <table className="tasks-table">

                            <thead>

                                <tr>

                                    <th>
                                        Task
                                    </th>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Priority
                                    </th>

                                    <th>
                                        Deadline
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

                                {tasks.map(
                                    (task) => (
                                        <tr
                                            key={
                                                task.id
                                            }
                                        >

                                            <td>

                                                <div className="task-title">
                                                    {
                                                        task.title
                                                    }
                                                </div>

                                                {task.description && (
                                                    <div className="task-description">
                                                        {
                                                            task.description
                                                        }
                                                    </div>
                                                )}

                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        task.assigned_to_username ||
                                                        "--"
                                                    }
                                                </strong>

                                            </td>

                                            <td>

                                                <span
                                                    className={`priority-badge priority-${(
                                                        task.priority ||
                                                        ""
                                                    ).toLowerCase()}`}
                                                >
                                                    {getPriorityLabel(
                                                        task.priority
                                                    )}
                                                </span>

                                            </td>

                                            <td>
                                                {formatDate(
                                                    task.deadline
                                                )}
                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge status-${(
                                                        task.status ||
                                                        ""
                                                    ).toLowerCase()}`}
                                                >
                                                    {getStatusLabel(
                                                        task.status
                                                    )}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="task-actions">

                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() =>
                                                            startEdit(
                                                                task
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteTask(
                                                                task
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

export default AdminTasks;