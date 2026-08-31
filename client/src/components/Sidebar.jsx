import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  X,
} from "lucide-react";
import { SentinelIcon } from "./Logo";
import { clearAuthSession, getAuthUser } from "../services/api";

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={17} />,
  },
  {
    name: "File Vault",
    path: "/files",
    icon: <HardDrive size={17} />,
  },
  {
    name: "Integrity Audit",
    path: "/verify",
    icon: <ShieldCheck size={17} />,
  },
  {
    name: "Audit Trail",
    path: "/logs",
    icon: <FileSpreadsheet size={17} />,
  },
  {
    name: "Threat Alerts",
    path: "/alerts",
    icon: <Bell size={17} />,
  },
  {
    name: "Cloud Storage",
    path: "/storage",
    icon: <Cloud size={17} />,
  },
  {
    name: "Operator Profile",
    path: "/profile",
    icon: <User size={17} />,
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = getAuthUser() || {};
  const activeProvider = (user.preferred_cloud_provider || user.active_cloud_provider || "local").toUpperCase();

  // Handle mobile drawer events and close on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    window.addEventListener("close-mobile-sidebar", handleClose);

    return () => {
      window.removeEventListener("toggle-mobile-sidebar", handleToggle);
      window.removeEventListener("close-mobile-sidebar", handleClose);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div>
          <div
            className="sidebar-logo"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
              onClick={() => navigate("/dashboard")}
            >
              <div style={{ filter: "drop-shadow(0 0 6px rgba(243, 190, 101, 0.3))" }}>
                <SentinelIcon size={30} />
              </div>
              <div>
                <h2>SENTINEL</h2>
                <span>SEC-OPS v4.2</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              className="sidebar-close-btn"
              onClick={() => setMobileOpen(false)}
              title="Close Menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

      <div className="sidebar-footer">
        {/* Active Storage Driver Status */}
        <div
          style={{
            background: "var(--surface-lowest)",
            border: "1px solid var(--outline-variant)",
            padding: "8px 12px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Activity size={13} color="var(--secondary)" />
            <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace" }}>
              PROVIDER:
            </span>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "var(--primary)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {activeProvider}
          </span>
        </div>

        {/* System Stable Telemetry Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--secondary)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            fontWeight: "700",
            marginBottom: "12px",
            padding: "6px 10px",
            background: "var(--surface-lowest)",
            border: "1px solid var(--outline-variant)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              background: "var(--secondary)",
              display: "inline-block",
            }}
          />
          <span>[■] STABLE (0 DRIFT)</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
      </aside>
    </>
  );
}

export default Sidebar;


