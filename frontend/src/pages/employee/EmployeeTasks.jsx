

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../../api/axios";
import "./EmployeeTasks.css";

function EmployeeTasks() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const [tasksResponse, submissionsResponse] =
                await Promise.all([
                    apiClient.get("/tasks/"),
                    apiClient.get("/task-submissions/"),
                ]);

            console.log(
                "MY TASKS RESPONSE:",
                tasksResponse.data
            );

            console.log(
                "MY SUBMISSIONS RESPONSE:",
                submissionsResponse.data
            );

            let taskData = [];

            if (Array.isArray(tasksResponse.data)) {
                taskData = tasksResponse.data;
            } else if (
                Array.isArray(tasksResponse.data.results)
            ) {
                taskData = tasksResponse.data.results;
            }

            let submissionData = [];

            if (Array.isArray(submissionsResponse.data)) {
                submissionData =
                    submissionsResponse.data;
            } else if (
                Array.isArray(
                    submissionsResponse.data.results
                )
            ) {
                submissionData =
                    submissionsResponse.data.results;
            }

            setTasks(taskData);
            setSubmissions(submissionData);

        } catch (error) {
            console.error(
                "MY TASKS ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                    "Unable to load your tasks."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const updateTaskStatus = async (
        taskId,
        status
    ) => {
        try {
            console.log(
                "UPDATING TASK:",
                taskId,
                status
            );

            const response =
                await apiClient.patch(
                    `/tasks/${taskId}/`,
                    {
                        status: status,
                    }
                );

            console.log(
                "TASK UPDATE RESPONSE:",
                response.data
            );

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

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            const serverError =
                error.response?.data;

            let message =
                "Unable to update task.";

            if (serverError?.detail) {
                message =
                    serverError.detail;
            } else if (
                serverError?.status
            ) {
                message =
                    Array.isArray(
                        serverError.status
                    )
                        ? serverError.status.join(
                              ", "
                          )
                        : serverError.status;
            } else if (
                typeof serverError === "object" &&
                serverError !== null
            ) {
                message =
                    JSON.stringify(
                        serverError
                    );
            }

            alert(message);
        }
    };

    const getNextStatus = (status) => {
        if (status === "NOT_STARTED") {
            return "IN_PROGRESS";
        }

        if (status === "IN_PROGRESS") {
            return "COMPLETED";
        }

        return null;
    };

    const getStatusLabel = (status) => {
        const labels = {
            NOT_STARTED: "Not Started",
            IN_PROGRESS: "In Progress",
            COMPLETED: "Completed",
            APPROVED: "Approved",
            REJECTED: "Rejected",
        };

        return labels[status] || status;
    };

    const getPriorityLabel = (priority) => {
        const labels = {
            LOW: "Low",
            MEDIUM: "Medium",
            HIGH: "High",
            URGENT: "Urgent",
        };

        return labels[priority] || priority;
    };

    const getSubmissionForTask = (taskId) => {
        return submissions.find(
            (submission) =>
                Number(submission.task) ===
                Number(taskId)
        );
    };

    const getFileUrl = (file) => {
        if (!file) {
            return null;
        }

        if (
            file.startsWith("http://") ||
            file.startsWith("https://")
        ) {
            return file;
        }

        return `http://127.0.0.1:8000${
            file.startsWith("/")
                ? file
                : `/${file}`
        }`;
    };

    if (loading) {
        return (
            <div className="tasks-page">

                <div className="tasks-header">

                    <p className="tasks-label">
                        Employee Workspace
                    </p>

                    <h1>
                        My Tasks
                    </h1>

                    <p>
                        Loading your assigned
                        tasks...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="tasks-page">

                <div className="tasks-header">

                    <p className="tasks-label">
                        Employee Workspace
                    </p>

                    <h1>
                        My Tasks
                    </h1>

                </div>

                <div className="tasks-error">

                    <h2>
                        Unable to load tasks
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadTasks}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="tasks-page">

            <div className="tasks-header">

                <div>

                    <p className="tasks-label">
                        Employee Workspace
                    </p>

                    <h1>
                        My Tasks
                    </h1>

                    <p>
                        View and manage your
                        assigned work.
                    </p>

                </div>

                <div className="task-count">
                    {tasks.length} Task
                    {tasks.length !== 1
                        ? "s"
                        : ""}
                </div>

            </div>

            {tasks.length === 0 ? (

                <div className="empty-tasks">

                    <div className="empty-icon">
                        ✓
                    </div>

                    <h2>
                        No tasks assigned
                    </h2>

                    <p>
                        You currently have no
                        tasks assigned to you.
                    </p>

                    <button
                        type="button"
                        onClick={loadTasks}
                    >
                        Refresh
                    </button>

                </div>

            ) : (

                <div className="tasks-list">

                    {tasks.map((task) => {

                        const nextStatus =
                            getNextStatus(
                                task.status
                            );

                        const submission =
                            getSubmissionForTask(
                                task.id
                            );

                        const submittedFile =
                            getFileUrl(
                                submission?.file
                            );

                        return (
                            <div
                                className="task-card"
                                key={task.id}
                            >

                                <div className="task-card-top">

                                    <div>

                                        <h2>
                                            {task.title}
                                        </h2>

                                        <p className="task-description">
                                            {task.description ||
                                                "No description provided."}
                                        </p>

                                    </div>

                                    <span
                                        className={`task-status status-${(
                                            task.status ||
                                            ""
                                        ).toLowerCase()}`}
                                    >
                                        {getStatusLabel(
                                            task.status
                                        )}
                                    </span>

                                </div>

                                <div className="task-details">

                                    <div className="task-detail">

                                        <span>
                                            Priority
                                        </span>

                                        <strong
                                            className={`priority-${(
                                                task.priority ||
                                                ""
                                            ).toLowerCase()}`}
                                        >
                                            {getPriorityLabel(
                                                task.priority
                                            )}
                                        </strong>

                                    </div>

                                    <div className="task-detail">

                                        <span>
                                            Deadline
                                        </span>

                                        <strong>
                                            {task.deadline
                                                ? new Date(
                                                      task.deadline
                                                  ).toLocaleString()
                                                : "--"}
                                        </strong>

                                    </div>

                                    <div className="task-detail">

                                        <span>
                                            Assigned To
                                        </span>

                                        <strong>
                                            {task.assigned_to_username ||
                                                "You"}
                                        </strong>

                                    </div>

                                </div>

                                {submission && (
                                    <div className="submission-info">

                                        <div className="submission-info-header">

                                            <h3>
                                                Your Submission
                                            </h3>

                                            <span
                                                className={`submission-status submission-${(
                                                    submission.review_status ||
                                                    "pending"
                                                ).toLowerCase()}`}
                                            >
                                                {getStatusLabel(
                                                    submission.review_status
                                                )}
                                            </span>

                                        </div>

                                        {submission.description && (
                                            <div className="employee-submission-description">

                                                <strong>
                                                    Your Description
                                                </strong>

                                                <p>
                                                    {
                                                        submission.description
                                                    }
                                                </p>

                                            </div>
                                        )}

                                        {submittedFile && (
                                            <div className="employee-submission-file">

                                                <a
                                                    href={
                                                        submittedFile
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View Submitted PDF
                                                </a>

                                            </div>
                                        )}

                                        {submission.review_status ===
                                            "PENDING" && (
                                            <div className="pending-review-message">
                                                ⏳ Your work is
                                                waiting for admin
                                                review.
                                            </div>
                                        )}

                                        {submission.review_status ===
                                            "APPROVED" && (
                                            <div className="approved-review-message">

                                                <strong>
                                                    ✓ Work
                                                    Approved
                                                </strong>

                                                <p>
                                                    {submission.feedback ||
                                                        "Your work has been approved by admin."}
                                                </p>

                                                {submission.reviewed_by_username && (
                                                    <small>
                                                        Reviewed
                                                        by{" "}
                                                        {
                                                            submission.reviewed_by_username
                                                        }
                                                    </small>
                                                )}

                                            </div>
                                        )}

                                        {submission.review_status ===
                                            "REJECTED" && (
                                            <div className="rejected-review-message">

                                                <strong>
                                                    ✕ Work
                                                    Rejected
                                                </strong>

                                                <p>
                                                    {submission.feedback ||
                                                        "Your work was rejected by admin."}
                                                </p>

                                                {submission.reviewed_by_username && (
                                                    <small>
                                                        Reviewed
                                                        by{" "}
                                                        {
                                                            submission.reviewed_by_username
                                                        }
                                                    </small>
                                                )}

                                            </div>
                                        )}

                                    </div>
                                )}

                                <div className="task-actions">

                                    {nextStatus && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateTaskStatus(
                                                    task.id,
                                                    nextStatus
                                                )
                                            }
                                        >
                                            {nextStatus ===
                                            "IN_PROGRESS"
                                                ? "Start Task"
                                                : "Mark Completed"}
                                        </button>
                                    )}

                                    {task.status ===
                                        "COMPLETED" &&
                                        !submission && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/employee/tasks/${task.id}/submit`
                                                )
                                            }
                                        >
                                            Submit Work
                                        </button>
                                    )}

                                    {task.status ===
                                        "COMPLETED" &&
                                        submission && (
                                        <span className="completed-message">
                                            ✓ Work submitted.
                                            Waiting for
                                            admin review.
                                        </span>
                                    )}

                                    {task.status ===
                                        "APPROVED" && (
                                        <span className="approved-message">
                                            ✓ Task approved
                                            by admin.
                                        </span>
                                    )}

                                    {task.status ===
                                        "REJECTED" && (
                                        <>
                                            <span className="rejected-message">
                                                Task rejected
                                                by admin.
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/employee/tasks/${task.id}/submit`
                                                    )
                                                }
                                            >
                                                Resubmit Work
                                            </button>
                                        </>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default EmployeeTasks;