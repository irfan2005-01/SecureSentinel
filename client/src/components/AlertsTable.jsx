import { useEffect, useState } from "react";
import { FiAlertTriangle, FiShield } from "react-icons/fi";
import api from "../services/api";

function AlertsTable() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="card alerts-card">

      <div className="alerts-header">
        <div>
          <p className="section-label">
            Security
          </p>

          <h2>Security Alerts</h2>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-alerts">

          <FiShield className="empty-icon" />

          <h3>No Security Alerts</h3>

          <p>
            Your system is secure. No tampered files detected.
          </p>

        </div>
      ) : (
        <div className="alerts-list">

          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="alert-item"
            >
              <div className="alert-left">

                <div className="alert-icon">
                  <FiAlertTriangle />
                </div>

                <div>

                  <h4>{alert.filename}</h4>

                  <span>
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>

                </div>

              </div>

              <span className="status tampered">
                <FiAlertTriangle />
                {alert.status}
              </span>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AlertsTable;