



import { useEffect, useState } from "react";

import apiClient from "../../api/axios";

import "./EmployeeProfile.css";

function EmployeeProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiClient.get(
                "/employees/me/"
            );

            console.log(
                "EMPLOYEE PROFILE RESPONSE:",
                response.data
            );

            setProfile(response.data);

        } catch (error) {
            console.error(
                "EMPLOYEE PROFILE ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load employee profile."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-header">
                    <p className="profile-label">
                        Employee Workspace
                    </p>

                    <h1>My Profile</h1>
                </div>

                <div className="profile-card error-card">
                    <h2>
                        Unable to load employee profile
                    </h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={loadProfile}
                        className="retry-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    const fullName = [
        profile.first_name,
        profile.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    const displayName =
        fullName ||
        profile.username ||
        "Employee";

    return (
        <div className="profile-page">

            <div className="profile-header">

                <p className="profile-label">
                    Employee Workspace
                </p>

                <h1>My Profile</h1>

                <p>
                    View your employee information.
                </p>

            </div>


            <div className="profile-card">

                <div className="profile-top">

                    <div className="profile-avatar">
                        {(
                            profile.first_name ||
                            profile.username ||
                            "U"
                        )
                            .charAt(0)
                            .toUpperCase()}
                    </div>


                    <div className="profile-name">

                        <h2>
                            {displayName}
                        </h2>

                        <p>
                            {profile.designation ||
                                "Employee"}
                        </p>

                        <span className="employee-id">
                            {profile.employee_id ||
                                "--"}
                        </span>

                    </div>

                </div>


                <div className="profile-grid">

                    <div className="profile-field">
                        <label>
                            Employee ID
                        </label>

                        <strong>
                            {profile.employee_id ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            Username
                        </label>

                        <strong>
                            {profile.username ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            First Name
                        </label>

                        <strong>
                            {profile.first_name ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            Last Name
                        </label>

                        <strong>
                            {profile.last_name ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            Email
                        </label>

                        <strong>
                            {profile.email ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            Phone
                        </label>

                        <strong>
                            {profile.phone ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            Department
                        </label>

                        <strong>
                            {profile.department ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            Designation
                        </label>

                        <strong>
                            {profile.designation ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            Joining Date
                        </label>

                        <strong>
                            {profile.joining_date ||
                                "--"}
                        </strong>
                    </div>


                    <div className="profile-field">
                        <label>
                            Date of Birth
                        </label>

                        <strong>
                            {profile.date_of_birth ||
                                "--"}
                        </strong>
                    </div>

                </div>


                <div className="profile-address">

                    <label>
                        Address
                    </label>

                    <p>
                        {profile.address ||
                            "No address provided."}
                    </p>

                </div>


                <div className="profile-status">

                    <span
                        className={
                            profile.is_active
                                ? "active"
                                : "inactive"
                        }
                    >
                        {profile.is_active
                            ? "Active"
                            : "Inactive"}
                    </span>

                </div>

            </div>

        </div>
    );
}

export default EmployeeProfile;