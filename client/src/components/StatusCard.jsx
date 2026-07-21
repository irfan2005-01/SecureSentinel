import {
  FiCheckCircle,
  FiAlertTriangle,
  FiFileText,
  FiHash,
} from "react-icons/fi";

function StatusCard({ result }) {
  if (!result) return null;

  const verified = result.status === "Verified";

  return (
    <div className={`card status-card ${verified ? "success" : "danger"}`}>
      <div className="status-header">
        {verified ? (
          <FiCheckCircle className="status-big-icon success-icon" />
        ) : (
          <FiAlertTriangle className="status-big-icon danger-icon" />
        )}

        <div>
          <p className="section-label">
            Verification Result
          </p>

          <h2>
            {verified ? "Verified" : "Tampered"}
          </h2>
        </div>
      </div>

      <div className="status-grid">

        <div className="status-box">
          <FiFileText />

          <div>
            <span>File</span>
            <h4>{result.filename}</h4>
          </div>
        </div>

        <div className="status-box">
          <FiHash />

          <div>
            <span>Status</span>
            <h4>{result.status}</h4>
          </div>
        </div>

      </div>

      <div className="hash-card">

        <p>SHA-256</p>

        <code>
          {result.sha256}
        </code>

      </div>

      <div
        className={
          verified
            ? "message success-message"
            : "message danger-message"
        }
      >
        {result.message}
      </div>
    </div>
  );
}

export default StatusCard;