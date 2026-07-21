import { useEffect, useState } from "react";
import {
  FiDatabase,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
} from "react-icons/fi";
import api from "../services/api";

function Stats() {
  const [stats, setStats] = useState({
    total_files: 0,
    verified: 0,
    tampered: 0,
    risk: "Low",
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const cards = [
    {
      title: "Total Files",
      value: stats.total_files,
      subtitle: "Stored in database",
      icon: <FiDatabase />,
    },
    {
      title: "Verified",
      value: stats.verified,
      subtitle: "Integrity confirmed",
      icon: <FiCheckCircle />,
    },
    {
      title: "Threats",
      value: stats.tampered,
      subtitle: "Tampered files",
      icon: <FiAlertTriangle />,
    },
    {
      title: "Risk Score",
      value: stats.risk,
      subtitle: "Current system status",
      icon: <FiShield />,
    },
  ];

  return (
    <section className="stats-grid">
      {cards.map((card) => (
        <div className="metric-card" key={card.title}>
          <div className="metric-top">
            <span className="metric-title">
              {card.title}
            </span>

            <div className="metric-icon">
              {card.icon}
            </div>
          </div>

          <h2 className="metric-value">
            {card.value}
          </h2>

          <p className="metric-subtitle">
            {card.subtitle}
          </p>
        </div>
      ))}
    </section>
  );
}

export default Stats;