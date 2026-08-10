import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../../api/axios";
import "./EmployeeTaskSubmission.css";

function EmployeeTaskSubmission() {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        setError("");
        setSuccess("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (
            selectedFile.type !== "application/pdf" &&
            !selectedFile.name.toLowerCase().endsWith(".pdf")
        ) {
            setFile(null);
            setError("Only PDF files are allowed.");
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!description.trim()) {
            setError("Please enter a description about your work.");
            return;
        }

        if (!file) {
            setError("Please select a PDF file.");
            return;
        }

        const formData = new FormData();

        formData.append("task", taskId);
        formData.append(
            "description",
            description.trim()
        );
        formData.append("file", file);

        try {
            setLoading(true);

            console.log("SUBMITTING TASK:", taskId);
            console.log("DESCRIPTION:", description);
            console.log("PDF FILE:", file);

            const response = await apiClient.post(
                "/task-submissions/",
                formData
            );

            console.log(
                "SUBMISSION RESPONSE:",
                response.data
            );

            setSuccess(
                "Work submitted successfully. Waiting for admin review."
            );

            setFile(null);
            setDescription("");

            setTimeout(() => {
                navigate("/employee/tasks");
            }, 1500);

        } catch (error) {
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

            const data =
                error.response?.data;

            if (data?.detail) {
                setError(data.detail);
            } else if (data?.file) {
                setError(
                    Array.isArray(data.file)
                        ? data.file[0]
                        : data.file
                );
            } else if (data?.task) {
                setError(
                    Array.isArray(data.task)
                        ? data.task[0]
                        : data.task
                );
            } else if (data?.description) {
                setError(
                    Array.isArray(data.description)
                        ? data.description[0]
                        : data.description
                );
            } else if (data?.non_field_errors) {
                setError(
                    Array.isArray(data.non_field_errors)
                        ? data.non_field_errors[0]
                        : data.non_field_errors
                );
            } else {
                setError(
                    "Unable to submit your work."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-submission-page">

            <div className="employee-submission-header">

                <p className="submission-label">
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

            <div className="submission-card">

                <div className="task-info">

                    <span>
                        Task ID
                    </span>

                    <strong>
                        #{taskId}
                    </strong>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Work Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Describe the work you completed..."
                            rows="6"
                            required
                        />

                    </div>

                    <div className="file-section">

                        <label htmlFor="submission-file">
                            Upload Completed Work
                        </label>

                        <p className="file-help">
                            Only PDF files are accepted.
                        </p>

                        <input
                            id="submission-file"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handleFileChange}
                        />

                    </div>

                    {file && (
                        <div className="selected-file">

                            <strong>
                                Selected File
                            </strong>

                            <span>
                                {file.name}
                            </span>

                            <small>
                                {(file.size / 1024 / 1024).toFixed(2)}
                                {" MB"}
                            </small>

                        </div>
                    )}

                    {error && (
                        <div className="submission-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="submission-success">
                            {success}
                        </div>
                    )}

                    <div className="submission-actions">

                        <button
                            type="button"
                            className="cancel-button"
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
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Uploading..."
                                : "Submit Work"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EmployeeTaskSubmission;