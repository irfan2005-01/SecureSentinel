import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  HardDrive,
  ShieldCheck,
  FileSpreadsheet,
  Bell,
  Cloud,
  User,
  LogOut,
  Shield,
  Activity,
} from "lucide-react";
import { clearAuthSession, getAuthUser } from "../services/api";

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "File Vault",
    path: "/files",
    icon: <HardDrive size={18} />,
  },
  {
    name: "Integrity Audit",
    path: "/verify",
    icon: <ShieldCheck size={18} />,
  },
  {
    name: "Audit Trail",
    path: "/logs",
    icon: <FileSpreadsheet size={18} />,
  },
  {
    name: "Threat Alerts",
    path: "/alerts",
    icon: <Bell size={18} />,
  },
  {
    name: "Cloud Storage",
    path: "/storage",
    icon: <Cloud size={18} />,
  },
  {
    name: "Operator Profile",
    path: "/profile",
    icon: <User size={18} />,
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const user = getAuthUser() || {};
  const activeProvider = (user.preferred_cloud_provider || user.active_cloud_provider || "local").toUpperCase();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <div className="logo-circle">
            <Shield size={22} color="#050811" />
          </div>
          <div>
            <h2>SecureSentinel</h2>
            <span>ENTERPRISE SOC</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        {/* Active Storage Driver Status */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={14} color="#00e699" />
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>STORAGE:</span>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#00f0ff",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {activeProvider}
          </span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
