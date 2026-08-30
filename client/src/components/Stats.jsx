import { useEffect, useState } from "react";
import {
  HardDrive,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

function Stats() {
  const [stats, setStats] = useState({
    total_files: 0,
    verified: 0,
    tampered: 0,
    risk: "Low",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await api.get("/api/analytics/stats");
      setStats(res.data || {});
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Protected Vault Files",
      value: stats.total_files,
      subtitle: "Active cryptographic baselines",
      icon: <HardDrive size={18} color="var(--primary)" />,
      color: "var(--primary)",
    },
    {
      title: "Integrity Verified",
      value: stats.verified,
      subtitle: "Deterministic matches confirmed",
      icon: <ShieldCheck size={18} color="var(--secondary)" />,
      color: "var(--secondary)",
    },
    {
      title: "Tamper Threats",
      value: stats.tampered,
      subtitle: "Mismatched signature alerts",
      icon: <ShieldAlert size={18} color="var(--error)" />,
      color: stats.tampered > 0 ? "var(--error)" : "var(--on-surface-variant)",
    },
    {
      title: "Dynamic Threat Level",
      value: stats.risk === "Low" ? "ZERO DRIFT" : stats.risk.toUpperCase(),
      subtitle: stats.risk === "Low" ? "Optimal zero-drift status" : "Elevated threat response active",
      icon: <AlertTriangle size={18} color={stats.risk === "Low" ? "var(--secondary)" : "var(--primary)"} />,
      color: stats.risk === "Low" ? "var(--secondary)" : "var(--primary)",
    },
  ];

  return (
    <section className="stats-grid">
      {cards.map((card) => (
        <div className="metric-card" key={card.title}>
          <div className="metric-top">
            <span className="metric-title">{card.title}</span>
            <div className="metric-icon">{card.icon}</div>
          </div>

          <h2 className="metric-value" style={{ color: card.color }}>
            {loading ? "..." : card.value}
          </h2>

          <p className="metric-subtitle">{card.subtitle}</p>
        </div>
      ))}
    </section>
  );
}

export default Stats;

