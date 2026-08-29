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
    <div className="card alerts-card">
      <div className="alerts-header">
        <div>
          <p className="section-label">INCIDENT MANAGEMENT</p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>
            Active Security Incidents & Tamper Alerts
          </h2>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Scanning cryptographic registers...
        </div>
      ) : alerts.length === 0 ? (
        <div className="empty-alerts" style={{ textAlign: "center", padding: "48px 20px" }}>
          <ShieldCheck size={48} color="#00e699" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "6px" }}>All Vault Signatures Intact</h3>
          <p style={{ color: "#94a3b8", fontSize: "14px", maxWidth: "500px", margin: "0 auto" }}>
            Zero cryptographic signature mismatches or tampering anomalies detected across any cloud storage providers.
          </p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className="alert-item" style={{ borderLeft: "4px solid #ff3366" }}>
              <div className="alert-left">
                <div className="alert-icon" style={{ background: "rgba(255, 51, 102, 0.15)", color: "#ff3366" }}>
                  <ShieldAlert size={18} color="#ff3366" />
                </div>

                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 }}>
                    {alert.filename || "Unregistered File Signature"}
                  </h4>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={10} />
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : "Recent"}
                    </span>
                    {alert.details && (
                      <small style={{ color: "#ff3366", fontSize: "11px" }}>
                        • {alert.details}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <span className="status tampered">
                <AlertTriangle size={12} /> {alert.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsTable;
