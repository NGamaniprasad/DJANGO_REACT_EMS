import { useEffect, useState } from "react";

import apiClient from "../../api/axios";

function EmployeeSalary() {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSalaries();
    }, []);

    const fetchSalaries = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiClient.get(
                "/salaries/my/"
            );

            console.log(
                "Employee salary response:",
                response.data
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setSalaries(data);
        } catch (error) {
            console.error(
                "Salary fetch error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load salary information."
            );
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    Loading salary information...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            <div style={styles.header}>
                <div>
                    <p style={styles.label}>
                        EMPLOYEE PAYROLL
                    </p>

                    <h1 style={styles.title}>
                        My Salary
                    </h1>

                    <p style={styles.description}>
                        View your monthly salary
                        records and payment details.
                    </p>
                </div>
            </div>

            {salaries.length === 0 ? (
                <div style={styles.card}>
                    <h3>
                        No salary records
                    </h3>

                    <p>
                        Your salary information will
                        appear here once it is added
                        by the administrator.
                    </p>
                </div>
            ) : (
                <div style={styles.list}>

                    {salaries.map((salary) => (
                        <div
                            key={salary.id}
                            style={styles.salaryCard}
                        >

                            <div style={styles.topRow}>

                                <div>
                                    <span style={styles.smallLabel}>
                                        SALARY MONTH
                                    </span>

                                    <h2 style={styles.month}>
                                        {formatMonth(
                                            salary.salary_month
                                        )}
                                    </h2>
                                </div>

                                <div style={styles.netSalary}>
                                    <span style={styles.smallLabel}>
                                        NET SALARY
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            salary.net_salary
                                        )}
                                    </strong>
                                </div>

                            </div>

                            <div style={styles.details}>

                                <div style={styles.detail}>
                                    <span>
                                        Base Salary
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            salary.base_salary
                                        )}
                                    </strong>
                                </div>

                                <div style={styles.detail}>
                                    <span>
                                        Performance Bonus
                                    </span>

                                    <strong style={styles.bonus}>
                                        +
                                        {formatCurrency(
                                            salary.performance_bonus
                                        )}
                                    </strong>
                                </div>

                                <div style={styles.detail}>
                                    <span>
                                        Deductions
                                    </span>

                                    <strong style={styles.deduction}>
                                        -
                                        {formatCurrency(
                                            salary.deductions
                                        )}
                                    </strong>
                                </div>

                            </div>

                            {salary.notes && (
                                <div style={styles.notes}>
                                    <strong>
                                        Notes
                                    </strong>

                                    <p>
                                        {salary.notes}
                                    </p>
                                </div>
                            )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

const styles = {
    container: {
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    header: {
        marginBottom: "25px",
    },

    label: {
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "1px",
        marginBottom: "8px",
    },

    title: {
        margin: "0 0 8px",
        fontSize: "32px",
    },

    description: {
        margin: 0,
        color: "#64748b",
    },

    list: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },

    card: {
        padding: "30px",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
    },

    salaryCard: {
        background: "#ffffff",
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
        padding: "28px",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
    },

    topRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px",
    },

    smallLabel: {
        display: "block",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "1px",
        color: "#64748b",
        marginBottom: "7px",
    },

    month: {
        margin: 0,
        fontSize: "24px",
    },

    netSalary: {
        textAlign: "right",
    },

    details: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        gap: "15px",
    },

    detail: {
        padding: "18px",
        background: "#f8fafc",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    bonus: {
        fontSize: "18px",
    },

    deduction: {
        fontSize: "18px",
    },

    notes: {
        marginTop: "20px",
        paddingTop: "20px",
        borderTop: "1px solid #e2e8f0",
    },

    error: {
        padding: "20px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "12px",
    },
};

export default EmployeeSalary;