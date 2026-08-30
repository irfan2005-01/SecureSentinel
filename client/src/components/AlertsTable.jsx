import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, Clock, ShieldAlert } from "lucide-react";
import api from "../services/api";

function AlertsTable() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    setLoading(true);
    try {
      const res = await api.get("/api/analytics/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Failed to load security alerts", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="alerts-header">
        <div>
          <p className="section-label">INCIDENT MANAGEMENT</p>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
            Active Security Incidents & Tamper Alerts
          </h2>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "30px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
          SCANNING CRYPTOGRAPHIC REGISTERS...
        </div>
      ) : alerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <ShieldCheck size={40} color="var(--secondary)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "16px", color: "var(--on-surface)", marginBottom: "4px" }}>All Vault Signatures Intact</h3>
          <p style={{ color: "var(--on-surface-variant)", fontSize: "13px", maxWidth: "500px", margin: "0 auto" }}>
            Zero cryptographic signature mismatches or tampering anomalies detected across multi-cloud storage targets.
          </p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className="alert-item" style={{ borderLeft: "3px solid var(--error)" }}>
              <div className="alert-left">
                <div className="alert-icon" style={{ background: "rgba(255, 180, 171, 0.15)", color: "var(--error)" }}>
                  <ShieldAlert size={16} color="var(--error)" />
                </div>

                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--on-surface)", margin: 0 }}>
                    {alert.filename || "Unregistered File Signature"}
                  </h4>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'JetBrains Mono', monospace" }}>
                      <Clock size={10} />
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : "Recent"}
                    </span>
                    {alert.details && (
                      <small style={{ color: "var(--error)", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
                        • {alert.details}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <span className="status tampered">
                <AlertTriangle size={11} /> {alert.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsTable;

