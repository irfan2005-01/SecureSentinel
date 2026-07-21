import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUpload,
  FiShield,
  FiFileText,
  FiBell,
  FiUser,
} from "react-icons/fi";

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FiHome />,
  },
  {
    name: "Upload",
    path: "/upload",
    icon: <FiUpload />,
  },
  {
    name: "Verify",
    path: "/verify",
    icon: <FiShield />,
  },
  {
    name: "Audit Logs",
    path: "/logs",
    icon: <FiFileText />,
  },
  {
    name: "Alerts",
    path: "/alerts",
    icon: <FiBell />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <FiUser />,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-circle">S</div>

        <div>
          <h2>SecureSentinel</h2>
          <span>Enterprise Security</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            {item.name}
          </NavLink>
        ))}
      </nav>

     <div className="sidebar-footer">

  <button
    className="logout-btn"
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    }}
  >
    Logout
  </button>

  <p>v1.0</p>

</div>
    </aside>
  );
}

export default Sidebar;