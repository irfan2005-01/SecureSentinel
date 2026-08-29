import {


  FileText,
  Hash,
  HelpCircle,
  XCircle,
  Cloud,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

function StatusCard({ result }) {
  if (!result) return null;

  const isVerified = result.status === "Verified";
  const isTampered = result.status === "Tampered";
  // isNotFound
  const isError = result.status === "Error";

  let statusClass = "info";
  let statusIcon = <HelpCircle className="status-big-icon warning-icon" color="#f59e0b" size={32} />;
  let statusHeading = "Unregistered Vault Signature";

  if (isVerified) {
    statusClass = "success";
    statusIcon = <ShieldCheck className="status-big-icon success-icon" color="#00e699" size={32} />;
    statusHeading = "Cryptographically Verified";
  } else if (isTampered) {
    statusClass = "danger";
    statusIcon = <ShieldAlert className="status-big-icon danger-icon" color="#ff3366" size={32} />;
    statusHeading = "SECURITY ALERT: Signature Tampering Detected!";
  } else if (isError) {
    statusClass = "danger";
    statusIcon = <XCircle className="status-big-icon danger-icon" color="#ff3366" size={32} />;
    statusHeading = "Verification Error";
  }

  return (
    <div className={`card status-card ${statusClass}`} style={{ marginTop: "24px" }}>
      <div className="status-header">
        {statusIcon}
        <div>
          <p className="section-label">CRYPTOGRAPHIC INTEGRITY AUDIT</p>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#fff", margin: "2px 0 0 0" }}>
            {statusHeading}
          </h2>
        </div>
      </div>

      <div className="status-grid">
        <div className="status-box">
          <FileText size={18} color="#00f0ff" />
          <div>
            <span>File Name</span>
            <h4>{result.filename || "Unknown"}</h4>
          </div>
        </div>

        <div className="status-box">
          <Hash size={18} color="#a855f7" />
          <div>
            <span>Integrity Status</span>
            <h4 style={{
              color: isVerified ? "#00e699" : isTampered ? "#ff3366" : "#f59e0b",
              fontWeight: "700",
            }}>
              {result.status}
            </h4>
          </div>
        </div>

        {result.storage_provider && (
          <div className="status-box">
            <Cloud size={18} color="#00f0ff" />
            <div>
              <span>Storage Driver</span>
              <h4 style={{ textTransform: "uppercase" }}>{result.storage_provider}</h4>
            </div>
          </div>
        )}
      </div>

      <div className="hash-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>
            CALCULATED SHA-256 (TESTED ARTIFACT)
          </span>
          <small style={{ color: "#64748b" }}>256-bit Cryptographic Checksum</small>
        </div>
        <code>{result.sha256 || "N/A"}</code>
      </div>

      {result.expected_sha256 && isTampered && (
        <div className="hash-card" style={{ borderColor: "#ff3366", background: "rgba(255, 51, 102, 0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "#ff3366", fontWeight: "700", textTransform: "uppercase" }}>
              EXPECTED VAULT BASELINE (STORED SIGNATURE)
            </span>
            <small style={{ color: "#ff3366" }}>MISMATCH DETECTED</small>
          </div>
          <code style={{ color: "#ff3366" }}>{result.expected_sha256}</code>
        </div>
      )}

      <div className={`message ${isVerified ? "success-message" : isTampered ? "danger-message" : "warning-message"}`}>
        {result.message}
      </div>
    </div>
  );
}

export default StatusCard;
