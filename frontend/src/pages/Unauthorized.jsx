import { Link } from "react-router-dom";

function Unauthorized() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <h1>403</h1>

            <h2>Unauthorized Access</h2>

            <p>
                You do not have permission to access this page.
            </p>

            <Link to="/login">
                Go to Login
            </Link>
        </div>
    );
}

export default Unauthorized;