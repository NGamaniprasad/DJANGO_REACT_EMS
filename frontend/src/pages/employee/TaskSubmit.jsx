import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../../api/axios";
import "./TaskSubmit.css";

function TaskSubmit() {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        setError("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (
            selectedFile.type !== "application/pdf" &&
            !selectedFile.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {
            setFile(null);
            event.target.value = "";
            setError("Only PDF files are accepted.");
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!description.trim()) {
            setError(
                "Please describe the work you completed."
            );
            return;
        }

        if (!file) {
            setError(
                "Please upload a PDF file."
            );
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "task",
                taskId
            );

            formData.append(
                "description",
                description.trim()
            );

            formData.append(
                "file",
                file
            );

            console.log(
                "================================"
            );

            console.log(
                "SUBMITTING TASK"
            );

            console.log(
                "TASK ID:",
                taskId
            );

            console.log(
                "DESCRIPTION:",
                description.trim()
            );

            console.log(
                "FILE:",
                file.name
            );

            console.log(
                "FILE TYPE:",
                file.type
            );

            console.log(
                "FILE SIZE:",
                file.size
            );

            console.log(
                "================================"
            );

            const response =
                await apiClient.post(
                    "/tasks/task-submissions/",
                    formData
                );

            console.log(
                "SUBMISSION SUCCESS:",
                response.data
            );

            alert(
                "Work submitted successfully. Waiting for admin review."
            );

            navigate(
                "/employee/tasks",
                {
                    replace: true,
                }
            );

        } catch (error) {
            console.error(
                "================================"
            );

            console.error(
                "SUBMISSION ERROR:",
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

            console.error(
                "================================"
            );

            const data =
                error.response?.data;

            let message =
                "Unable to submit your work.";

            if (data?.detail) {
                message =
                    Array.isArray(data.detail)
                        ? data.detail.join(" ")
                        : data.detail;
            } else if (data?.file) {
                message =
                    Array.isArray(data.file)
                        ? data.file.join(" ")
                        : data.file;
            } else if (data?.description) {
                message =
                    Array.isArray(data.description)
                        ? data.description.join(" ")
                        : data.description;
            } else if (data?.task) {
                message =
                    Array.isArray(data.task)
                        ? data.task.join(" ")
                        : data.task;
            } else if (data?.non_field_errors) {
                message =
                    Array.isArray(
                        data.non_field_errors
                    )
                        ? data.non_field_errors.join(" ")
                        : data.non_field_errors;
            } else if (
                data &&
                typeof data === "object"
            ) {
                message = Object.entries(data)
                    .map(
                        ([field, value]) => {
                            const text =
                                Array.isArray(value)
                                    ? value.join(" ")
                                    : String(value);

                            return `${field}: ${text}`;
                        }
                    )
                    .join(" | ");
            } else if (error.message) {
                message =
                    error.message;
            }

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="submit-page">

            <div className="submit-header">

                <p className="submit-label">
                    Employee Workspace
                </p>

                <h1>
                    Submit Work
                </h1>

                <p>
                    Upload your completed work
                    for admin review.
                </p>

            </div>

            <div className="submit-card">

                <div className="task-info">

                    <span>
                        Task ID
                    </span>

                    <strong>
                        #{taskId}
                    </strong>

                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="description">
                            About Your Work
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Describe the work you completed..."
                            rows="7"
                            required
                        />

                        <small>
                            Explain clearly what you
                            completed for this task.
                        </small>

                    </div>

                    <div className="form-group">

                        <label htmlFor="file">
                            Upload Completed Work
                        </label>

                        <input
                            id="file"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={
                                handleFileChange
                            }
                            required
                        />

                        <small>
                            Only PDF files are accepted.
                        </small>

                        {file && (
                            <div className="selected-file">
                                Selected file:{" "}
                                <strong>
                                    {file.name}
                                </strong>
                            </div>
                        )}

                    </div>

                    {error && (
                        <div className="submit-error">
                            {error}
                        </div>
                    )}

                    <div className="submit-actions">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/employee/tasks"
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit Work"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default TaskSubmit;