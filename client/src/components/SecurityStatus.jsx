import { useEffect, useState } from "react";
import { Server, Database, Cloud, ShieldCheck, Cpu } from "lucide-react";
import api from "../services/api";

function SecurityStatus() {
  const [health, setHealth] = useState({
    api: "Online",
    database: "Connected",
    active_storage: "LOCAL",
    storage_status: "Connected",
    monitoring: "Active",
  });
  const [risk, setRisk] = useState("Low");

  useEffect(() => {
    fetchHealthAndRisk();
  }, []);

  async function fetchHealthAndRisk() {
    try {
      const [healthRes, statsRes] = await Promise.all([
        api.get("/api/analytics/health"),
        api.get("/api/analytics/stats"),
      ]);
      if (healthRes.data) setHealth(healthRes.data);
      if (statsRes.data?.risk) setRisk(statsRes.data.risk);
    } catch (err) {
      console.error("Health check failed", err);
    }
  }

  const items = [
    {
      icon: <Server size={16} color="#00f0ff" />,
      title: "API Engine",
      value: health.api || "Online",
      statusClass: "security-online",
    },
    {
      icon: <Database size={16} color="#00e699" />,
      title: "Database Vault",
      value: health.database || "Connected",
      statusClass: health.database === "Connected" ? "security-online" : "security-offline",
    },
    {
      icon: <Cloud size={16} color="#38bdf8" />,
      title: "Storage Driver",
      value: health.active_storage || "LOCAL",
      statusClass: health.storage_status === "Connected" ? "security-online" : "security-offline",
    },
    {
      icon: <ShieldCheck size={16} color={risk === "Low" ? "#00e699" : "#f59e0b"} />,
      title: "Threat Level",
      value: risk,
      statusClass: risk === "Low" ? "security-online" : risk === "Medium" ? "security-warning" : "security-offline",
    },
    {
      icon: <Cpu size={16} color="#a855f7" />,
      title: "PDP Watcher",
      value: health.monitoring || "Active",
      statusClass: "security-online",
    },
  ];

  return (
    <div className="card security-card">
      <p className="section-label">SYSTEM DIAGNOSTICS</p>
      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: "0 0 16px 0" }}>
        Engine Health & Metrics
      </h2>

      <div>
        {items.map((item) => (
          <div key={item.title} className="security-item">
            <div className="security-left">
              <div className="security-icon" style={{ background: "rgba(255, 255, 255, 0.04)" }}>
                {item.icon}
              </div>
              <span>{item.title}</span>
            </div>

            <span className={item.statusClass}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SecurityStatus;
