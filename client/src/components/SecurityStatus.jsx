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
      icon: <Server size={15} color="var(--primary)" />,
      title: "API Engine",
      value: "[■] ONLINE",
      statusClass: "security-online",
    },
    {
      icon: <Database size={15} color="var(--primary)" />,
      title: "Database Vault",
      value: health.database === "Connected" ? "[■] CONNECTED" : "[▲] DISCONNECTED",
      statusClass: health.database === "Connected" ? "security-online" : "security-offline",
    },
    {
      icon: <Cloud size={15} color="var(--primary)" />,
      title: "Storage Driver",
      value: `[■] ${health.active_storage || "LOCAL"}`,
      statusClass: health.storage_status === "Connected" ? "security-online" : "security-offline",
    },
    {
      icon: <ShieldCheck size={15} color={risk === "Low" ? "var(--secondary)" : "var(--primary)"} />,
      title: "Threat Level",
      value: risk === "Low" ? "[■] ZERO DRIFT" : `[▲] ${risk.toUpperCase()}`,
      statusClass: risk === "Low" ? "security-online" : risk === "Medium" ? "security-warning" : "security-offline",
    },
    {
      icon: <Cpu size={15} color="var(--primary)" />,
      title: "PDP Engine",
      value: "[■] ACTIVE",
      statusClass: "security-online",
    },
  ];

  return (
    <div className="card">
      <p className="section-label">SYSTEM DIAGNOSTICS</p>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--on-surface)", margin: "0 0 14px 0" }}>
        Engine Health & Metrics
      </h2>

      <div>
        {items.map((item) => (
          <div key={item.title} className="security-item">
            <div className="security-left">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", background: "var(--surface-container-highest)", border: "1px solid var(--outline-variant)" }}>
                {item.icon}
              </div>
              <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>{item.title}</span>
            </div>

            <span className={item.statusClass} style={{ fontSize: "11px" }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SecurityStatus;

