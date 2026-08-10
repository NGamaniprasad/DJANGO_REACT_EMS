import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const pageTitles = {
  "/employee/dashboard": "Dashboard",
  "/employee/tasks": "My Tasks",
  "/employee/attendance": "Attendance",
  "/employee/salary": "Salary",
  "/employee/notifications": "Notifications",
  "/employee/profile": "Profile",
};

function Navbar({ onMenuClick, user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle =
    pageTitles[location.pathname] || "Employee Portal";

  const displayName =
    user?.first_name ||
    user?.username ||
    "Employee";

  const initials = displayName
    .charAt(0)
    .toUpperCase();

  const handleProfileClick = () => {
    navigate("/employee/profile");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        <div>
          <h1 className="navbar-title">
            {pageTitle}
          </h1>

          <p className="navbar-subtitle">
            Employee Workspace
          </p>
        </div>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
          onClick={() =>
            navigate("/employee/notifications")
          }
        >
          🔔
        </button>

        <button
          type="button"
          className="profile-button"
          onClick={handleProfileClick}
        >
          <span className="profile-avatar">
            {initials}
          </span>

          <span className="profile-info">
            <strong>{displayName}</strong>
            <small>Employee</small>
          </span>

          <span className="profile-arrow">
            ▼
          </span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;