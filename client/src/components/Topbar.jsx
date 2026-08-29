import { useLocation, Link } from "react-router-dom";
import { Cloud } from "lucide-react";
import { getAuthUser } from "../services/api";

const routeMeta = {
  "/dashboard": {
    title: "Security Operations Dashboard",
    tag: "SOC DASHBOARD",
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

  const displayName = user.full_name || user.username || localStorage.getItem("username") || "Operator";
  const initial = displayName.charAt(0).toUpperCase();
  const activeProvider = (user.preferred_cloud_provider || user.active_cloud_provider || "local").toUpperCase();

  return (
    <header className="dashboard-header">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p className="dashboard-tag">
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00f0ff", display: "inline-block" }} />
            {meta.tag}
          </p>

          <span style={{ color: "#334155", fontSize: "12px" }}>•</span>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0, 230, 153, 0.1)",
              border: "1px solid rgba(0, 230, 153, 0.25)",
              padding: "2px 8px",
              borderRadius: "999px",
              fontSize: "11px",
              color: "#00e699",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00e699", boxShadow: "0 0 6px #00e699" }} />
            ZERO DRIFT
          </div>
        </div>

        <h1 className="dashboard-title">
          {title || meta.title}
        </h1>

        <p className="dashboard-description">
          {description || meta.desc}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Quick Cloud Switcher Pill */}
        <Link
          to="/storage"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(13, 21, 39, 0.6)",
            border: "1px solid rgba(0, 240, 255, 0.2)",
            padding: "8px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            color: "#94a3b8",
            transition: "all 0.2s ease",
          }}
        >
          <Cloud size={14} color="#00f0ff" />
          <span>TARGET:</span>
          <strong style={{ color: "#00f0ff" }}>{activeProvider}</strong>
        </Link>

        {/* User Avatar */}
        <Link
          to="/profile"
          className="dashboard-user"
          style={{
            textDecoration: "none",
            transition: "transform 0.2s ease",
          }}
        >
          <div className="user-avatar">
            {initial}
          </div>

          <div>
            <h4>{displayName}</h4>
            <span>{user.organization || "Root Operator"}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
