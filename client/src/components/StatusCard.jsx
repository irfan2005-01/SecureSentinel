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
  const isError = result.status === "Error";

  let statusClass = "info";
  let statusIcon = <HelpCircle className="status-big-icon" color="var(--primary)" size={28} />;
  let statusHeading = "Unregistered Vault Signature";

  if (isVerified) {
    statusClass = "success";
    statusIcon = <ShieldCheck className="status-big-icon success-icon" color="var(--secondary)" size={28} />;
    statusHeading = "Cryptographically Verified Baseline";
  } else if (isTampered) {
    statusClass = "danger";
    statusIcon = <ShieldAlert className="status-big-icon danger-icon" color="var(--error)" size={28} />;
    statusHeading = "SECURITY ALERT: Signature Divergence Detected!";
  } else if (isError) {
    statusClass = "danger";
    statusIcon = <XCircle className="status-big-icon danger-icon" color="var(--error)" size={28} />;
    statusHeading = "Verification Protocol Error";
  }

  return (
    <div className={`card status-card ${statusClass}`} style={{ marginTop: "20px" }}>
      <div className="status-header">
        {statusIcon}
        <div>
          <p className="section-label">CRYPTOGRAPHIC INTEGRITY AUDIT</p>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--on-surface)", margin: "2px 0 0 0" }}>
            {statusHeading}
          </h2>
        </div>
      </div>

      <div className="status-grid">
        <div className="status-box">
          <FileText size={16} color="var(--primary)" />
          <div>
            <span>File Name</span>
            <h4>{result.filename || "Unknown"}</h4>
          </div>
        </div>

        <div className="status-box">
          <Hash size={16} color="var(--primary)" />
          <div>
            <span>Integrity Status</span>
            <h4 style={{
              color: isVerified ? "var(--secondary)" : isTampered ? "var(--error)" : "var(--primary)",
              fontWeight: "700",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {isVerified ? "[■] VERIFIED" : isTampered ? "[▲] TAMPERED" : "[?] UNREGISTERED"}
            </h4>
          </div>
        </div>

        {result.storage_provider && (
          <div className="status-box">
            <Cloud size={16} color="var(--primary)" />
            <div>
              <span>Storage Driver</span>
              <h4 style={{ textTransform: "uppercase" }}>{result.storage_provider}</h4>
            </div>
          </div>
        )}
      </div>

      <div className="hash-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
            CALCULATED SHA-256 (TESTED ARTIFACT)
          </span>
          <small style={{ color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>256-bit Digest</small>
        </div>
        <code>{result.sha256 || "N/A"}</code>
      </div>

      {result.expected_sha256 && isTampered && (
        <div className="hash-card" style={{ borderColor: "var(--error)", background: "rgba(255, 180, 171, 0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "var(--error)", fontWeight: "700", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
              EXPECTED VAULT BASELINE (STORED SIGNATURE)
            </span>
            <small style={{ color: "var(--error)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>[DIVERGENCE]</small>
          </div>
          <code style={{ color: "var(--error)" }}>{result.expected_sha256}</code>
        </div>
      )}

      <div className={`message ${isVerified ? "success-message" : isTampered ? "danger-message" : "warning-message"}`}>
        {result.message}
      </div>
    </div>
  );
}

export default StatusCard;

