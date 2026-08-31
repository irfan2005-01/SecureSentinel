import { useLocation, Link } from "react-router-dom";
import { Cloud, Radio, Menu } from "lucide-react";
import { SentinelIcon } from "./Logo";
import { getAuthUser } from "../services/api";

const routeMeta = {
  "/dashboard": {
    title: "Security Operations Dashboard",
    tag: "SOC TELEMETRY",
    desc: "Real-time cryptographic file integrity monitoring and threat analysis",
  },
  "/files": {
    title: "Vault File Ingestion & Records",
    tag: "VAULT STORAGE",
    desc: "Stream and anchor binary assets across multi-cloud drivers with SHA-256 baselines",
  },
  "/upload": {
    title: "Vault File Ingestion & Records",
    tag: "VAULT STORAGE",
    desc: "Stream and anchor binary assets across multi-cloud drivers with SHA-256 baselines",
  },
  "/verify": {
    title: "Integrity Audit & Verification",
    tag: "SIGNATURE AUDIT",
    desc: "Test file content against baseline SHA-256 signatures to detect tampering",
  },
  "/verification": {
    title: "Integrity Audit & Verification",
    tag: "SIGNATURE AUDIT",
    desc: "Test file content against baseline SHA-256 signatures to detect tampering",
  },
  "/logs": {
    title: "Immutable Audit Trail",
    tag: "AUDIT LOGS",
    desc: "Comprehensive log of all ingestion, verification, and configuration events",
  },
  "/alerts": {
    title: "Security Incident Response",
    tag: "INCIDENT MANAGEMENT",
    desc: "Real-time threat alerts on tampered or corrupted files",
  },
  "/storage": {
    title: "Multi-Cloud Storage Hub",
    tag: "INFRASTRUCTURE",
    desc: "Configure and test AWS S3, Google Cloud, Azure Blob, or Local Vault drivers",
  },
  "/profile": {
    title: "Operator Profile & Credentials",
    tag: "IDENTITY & ACCESS",
    desc: "Manage security credentials, personnel metadata, and session policies",
  },
};

function Topbar({ title, description }) {
  const location = useLocation();
  const user = getAuthUser() || {};
  const meta = routeMeta[location.pathname] || {
    title: title || "Security Operations Center",
    tag: "SECURESENTINEL",
    desc: description || "Cryptographic file integrity and vault monitoring platform",
  };

  const displayName = user.full_name || user.username || localStorage.getItem("username") || "Operator-042";
  const initial = displayName.charAt(0).toUpperCase();
  const activeProvider = (user.preferred_cloud_provider || user.active_cloud_provider || "local").toUpperCase();

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  return (
    <>
      {/* Sticky Mobile Nav Strip (Visible only on <1024px) */}
      <div className="mobile-nav-strip">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={handleToggleSidebar}
            title="Open Menu Drawer"
            style={{ display: "flex" }}
          >
            <Menu size={20} />
          </button>

          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <SentinelIcon size={24} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: "14px", color: "var(--primary)", letterSpacing: "1px" }}>
              SENTINEL
            </span>
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            to="/storage"
            style={{
              fontSize: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--primary)",
              border: "1px solid var(--outline-variant)",
              padding: "3px 7px",
              background: "var(--surface-lowest)",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Cloud size={11} /> {activeProvider}
          </Link>

          <Link to="/profile" className="user-avatar" style={{ width: "28px", height: "28px", fontSize: "12px", textDecoration: "none" }}>
            {initial}
          </Link>
        </div>
      </div>

      <header className="dashboard-header">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p className="dashboard-tag">
            <span style={{ width: "6px", height: "6px", background: "var(--primary)", display: "inline-block" }} />
            {meta.tag}
          </p>

          <span style={{ color: "var(--outline-variant)", fontSize: "12px" }}>•</span>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--surface-lowest)",
              border: "1px solid var(--outline-variant)",
              padding: "2px 8px",
              fontSize: "10px",
              color: "var(--secondary)",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: "700",
            }}
          >
            <span style={{ width: "6px", height: "6px", background: "var(--secondary)", display: "inline-block" }} />
            [■] ZERO DRIFT
          </div>

          <span
            style={{
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--on-surface-variant)",
            }}
            className="animate-pulse"
          >
            SCANNING NODE_08...
          </span>
        </div>

        <h1 className="dashboard-title">
          {title || meta.title}
        </h1>

        <p className="dashboard-description">
          {description || meta.desc}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Quick Cloud Switcher Pill */}
        <Link
          to="/storage"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--surface-container)",
            border: "1px solid var(--outline-variant)",
            padding: "6px 12px",
            fontSize: "11px",
            color: "var(--on-surface-variant)",
            fontFamily: "'JetBrains Mono', monospace",
            transition: "all 0.2s ease",
          }}
        >
          <Cloud size={13} color="var(--primary)" />
          <span>TARGET:</span>
          <strong style={{ color: "var(--primary)" }}>{activeProvider}</strong>
        </Link>

        {/* User Badge */}
        <Link
          to="/profile"
          className="dashboard-user"
          style={{
            textDecoration: "none",
            transition: "background 0.2s ease",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--on-surface)" }}>
              {displayName}
            </div>
            <div style={{ fontSize: "10px", color: "var(--primary)", fontFamily: "'JetBrains Mono', monospace" }}>
              SEC-ADMIN
            </div>
          </div>

          <div className="user-avatar">
            {initial}
          </div>
        </Link>
      </div>
    </header>
  </>
  );
}

export default Topbar;


