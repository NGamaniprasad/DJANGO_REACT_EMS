import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/employee/dashboard",
    icon: "▦",
  },
  {
    label: "My Tasks",
    path: "/employee/tasks",
    icon: "✓",
  },
  {
    label: "Attendance",
    path: "/employee/attendance",
    icon: "◷",
  },
  {
    label: "Salary",
    path: "/employee/salary",
    icon: "₹",
  },
  {
    label: "Notifications",
    path: "/employee/notifications",
    icon: "●",
  },
  {
    label: "Profile",
    path: "/employee/profile",
    icon: "◎",
  },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          role="presentation"
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">G</div>

          <div>
            <h2>Gamani</h2>
            <span>Solutions</span>
          </div>
        </div>

        <nav className="sidebar-navigation">
          <p className="navigation-title">
            WORKSPACE
          </p>

          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "sidebar-link-active" : ""
                }`
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;