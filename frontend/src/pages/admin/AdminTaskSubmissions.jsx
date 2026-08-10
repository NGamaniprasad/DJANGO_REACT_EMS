
import { useEffect, useState } from "react";

import apiClient from "../../api/axios";
import "./AdminTaskSubmissions.css";

function AdminTaskSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [reviewingId, setReviewingId] = useState(null);
    const [feedbacks, setFeedbacks] = useState({});

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiClient.get(
                "/task-submissions/"
            );

            console.log(
                "TASK SUBMISSIONS:",
                response.data
            );

            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else if (
                Array.isArray(response.data.results)
            ) {
                setSubmissions(
                    response.data.results
                );
            } else {
                setSubmissions([]);
            }
        } catch (error) {
            console.error(
                "SUBMISSIONS ERROR:",
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
                    "Unable to load task submissions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
    }, []);

    const handleFeedbackChange = (
        submissionId,
        value
    ) => {
        setFeedbacks((previous) => ({
            ...previous,
            [submissionId]: value,
        }));
    };

    const reviewSubmission = async (
        submissionId,
        reviewStatus
    ) => {
        try {
            setReviewingId(submissionId);

            const feedback =
                feedbacks[submissionId] || "";

            console.log(
                "REVIEW SUBMISSION ID:",
                submissionId
            );

            console.log(
                "REVIEW STATUS:",
                reviewStatus
            );

            console.log(
                "FEEDBACK:",
                feedback
            );

            const response =
                await apiClient.patch(
                    `/task-submissions/${submissionId}/`,
                    {
                        review_status:
                            reviewStatus,
                        feedback:
                            feedback,
                    }
                );

            console.log(
                "REVIEW SUCCESS:",
                response.data
            );

            setFeedbacks((previous) => {
                const updated = {
                    ...previous,
                };

                delete updated[
                    submissionId
                ];

                return updated;
            });

            await loadSubmissions();

            alert(
                reviewStatus === "APPROVED"
                    ? "Task approved successfully."
                    : "Task rejected successfully."
            );

        } catch (error) {
            console.error(
                "REVIEW ERROR:",
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
                "Unable to review submission.";

            if (serverError?.detail) {
                message =
                    Array.isArray(
                        serverError.detail
                    )
                        ? serverError.detail.join(
                              " "
                          )
                        : serverError.detail;
            } else if (
                serverError &&
                typeof serverError ===
                    "object"
            ) {
                message = Object.entries(
                    serverError
                )
                    .map(
                        ([field, value]) => {
                            const text =
                                Array.isArray(
                                    value
                                )
                                    ? value.join(
                                          " "
                                      )
                                    : String(
                                          value
                                      );

                            return `${field}: ${text}`;
                        }
                    )
                    .join(" | ");
            }

            alert(message);
        } finally {
            setReviewingId(null);
        }
    };

    const getReviewLabel = (status) => {
        const labels = {
            PENDING: "Pending",
            APPROVED: "Approved",
            REJECTED: "Rejected",
        };

        return (
            labels[status] || "Unknown"
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
            <div className="admin-submissions-page">
                <div className="admin-submissions-header">
                    <p className="admin-submissions-label">
                        Admin Workspace
                    </p>

                    <h1>
                        Task Submissions
                    </h1>

                    <p>
                        Loading employee
                        submissions...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-submissions-page">
                <div className="admin-submissions-header">
                    <p className="admin-submissions-label">
                        Admin Workspace
                    </p>

                    <h1>
                        Task Submissions
                    </h1>
                </div>

                <div className="submissions-error">
                    <h2>
                        Unable to load
                        submissions
                    </h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={
                            loadSubmissions
                        }
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-submissions-page">

            <div className="admin-submissions-header">

                <div>
                    <p className="admin-submissions-label">
                        Admin Workspace
                    </p>

                    <h1>
                        Task Submissions
                    </h1>

                    <p>
                        Review work submitted
                        by employees.
                    </p>
                </div>

                <div className="submission-count">
                    {submissions.length}{" "}
                    Submission
                    {submissions.length !==
                    1
                        ? "s"
                        : ""}
                </div>

            </div>

            {submissions.length === 0 ? (

                <div className="empty-submissions">

                    <div className="empty-submission-icon">
                        ✓
                    </div>

                    <h2>
                        No submissions
                    </h2>

                    <p>
                        Employees have not
                        submitted any work
                        yet.
                    </p>

                </div>

            ) : (

                <div className="submissions-list">

                    {submissions.map(
                        (submission) => {

                            const submissionFeedback =
                                feedbacks[
                                    submission.id
                                ] || "";

                            const isReviewing =
                                reviewingId ===
                                submission.id;

                            const fileUrl =
                                getFileUrl(
                                    submission.file
                                );

                            return (
                                <div
                                    className="submission-card"
                                    key={
                                        submission.id
                                    }
                                >

                                    <div className="submission-top">

                                        <div>

                                            <p className="submission-label">
                                                Task
                                            </p>

                                            <h2>
                                                {submission.task_title ||
                                                    "Untitled Task"}
                                            </h2>

                                            <p className="submitted-by">
                                                Submitted by:{" "}
                                                <strong>
                                                    {
                                                        submission.submitted_by_username
                                                    }
                                                </strong>
                                            </p>

                                        </div>

                                        <span
                                            className={`review-status status-${(
                                                submission.review_status ||
                                                "pending"
                                            ).toLowerCase()}`}
                                        >
                                            {getReviewLabel(
                                                submission.review_status
                                            )}
                                        </span>

                                    </div>

                                    <div className="submission-description">

                                        <strong>
                                            Employee
                                            Description
                                        </strong>

                                        <p>
                                            {submission.description ||
                                                "No description provided."}
                                        </p>

                                    </div>

                                    {fileUrl && (
                                        <div className="submission-file">

                                            <a
                                                href={
                                                    fileUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Uploaded
                                                PDF
                                            </a>

                                        </div>
                                    )}

                                    {submission.review_status ===
                                        "PENDING" && (

                                        <div className="review-section">

                                            <label
                                                htmlFor={`feedback-${submission.id}`}
                                            >
                                                Feedback
                                            </label>

                                            <textarea
                                                id={`feedback-${submission.id}`}
                                                value={
                                                    submissionFeedback
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleFeedbackChange(
                                                        submission.id,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Enter feedback for the employee..."
                                                rows={4}
                                                disabled={
                                                    isReviewing
                                                }
                                            />

                                            <div className="review-actions">

                                                <button
                                                    type="button"
                                                    className="approve-button"
                                                    disabled={
                                                        isReviewing
                                                    }
                                                    onClick={() =>
                                                        reviewSubmission(
                                                            submission.id,
                                                            "APPROVED"
                                                        )
                                                    }
                                                >
                                                    {isReviewing
                                                        ? "Processing..."
                                                        : "Approve"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="reject-button"
                                                    disabled={
                                                        isReviewing
                                                    }
                                                    onClick={() =>
                                                        reviewSubmission(
                                                            submission.id,
                                                            "REJECTED"
                                                        )
                                                    }
                                                >
                                                    {isReviewing
                                                        ? "Processing..."
                                                        : "Reject"}
                                                </button>

                                            </div>

                                        </div>
                                    )}

                                    {submission.review_status !==
                                        "PENDING" && (

                                        <div className="review-result">

                                            <strong>
                                                Review
                                                Feedback
                                            </strong>

                                            <p>
                                                {submission.feedback ||
                                                    "No feedback provided."}
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
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
}

export default AdminTaskSubmissions;