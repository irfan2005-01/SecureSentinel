import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  ShieldCheck,
  HelpCircle,
  Clock,
  Activity,
} from "lucide-react";
import api from "../services/api";

function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentLogs();
  }, []);

  async function fetchRecentLogs() {
    try {
      const res = await api.get("/api/analytics/logs?limit=5");
      setActivities(res.data || []);
    } catch (err) {
      console.error("Failed to load recent activity", err);
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (ts) => {
    if (!ts) return "Just now";
    const date = new Date(ts);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="card activity-card">
      <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <p className="section-label">FORENSIC STREAM</p>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0 }}>
            Recent Activity
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#00e699", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
          <Activity size={14} className="animate-pulse-glow" /> LIVE
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>Connecting to stream...</div>
      ) : activities.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>No recent audit events recorded.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {activities.slice(0, 5).map((item) => {
            const isSuccess = item.status === "Verified" || item.status === "Success";
            const isTampered = item.status === "Tampered";

            return (
              <div className="activity-item" key={item.id}>
                <div className="activity-left">
                  <div className="file-icon" style={{ background: item.action === "UPLOAD" ? "rgba(0, 240, 255, 0.1)" : "rgba(168, 85, 247, 0.1)" }}>
                    {item.action === "UPLOAD" ? (
                      <UploadCloud size={16} color="#00f0ff" />
                    ) : (
                      <ShieldCheck size={16} color="#a855f7" />
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#fff", margin: 0 }}>
                      {item.filename || item.action}
                    </h4>
                    <span style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <Clock size={10} /> {formatTime(item.timestamp)}
                    </span>
                  </div>
                </div>

                <span
                  className={
                    isSuccess ? "status verified" : isTampered ? "status tampered" : "status"
                  }
                  style={{ fontSize: "11px", padding: "3px 10px" }}
                >
                  {isSuccess ? (
                    <CheckCircle2 size={12} />
                  ) : isTampered ? (
                    <AlertTriangle size={12} />
                  ) : (
                    <HelpCircle size={12} />
                  )}
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
