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
    <div className="card">
      <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div>
          <p className="section-label">FORENSIC STREAM</p>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
            Recent Activity
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--secondary)", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700" }}>
          <Activity size={12} className="animate-pulse" /> [■] LIVE
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
          CONNECTING TO STREAM...
        </div>
      ) : activities.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
          NO AUDIT EVENTS RECORDED.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {activities.slice(0, 5).map((item) => {
            const isSuccess = item.status === "Verified" || item.status === "Success";
            const isTampered = item.status === "Tampered";

            return (
              <div className="activity-item" key={item.id}>
                <div className="activity-left">
                  <div className="file-icon" style={{ background: "var(--surface-container-highest)", color: "var(--primary)" }}>
                    {item.action === "UPLOAD" ? (
                      <UploadCloud size={15} />
                    ) : (
                      <ShieldCheck size={15} />
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: "12px", fontWeight: "600", color: "var(--on-surface)", margin: 0 }}>
                      {item.filename || item.action}
                    </h4>
                    <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px", fontFamily: "'JetBrains Mono', monospace" }}>
                      <Clock size={10} /> {formatTime(item.timestamp)}
                    </span>
                  </div>
                </div>

                <span
                  className={
                    isSuccess ? "status verified" : isTampered ? "status tampered" : "status"
                  }
                  style={{ fontSize: "10px", padding: "2px 8px" }}
                >
                  {isSuccess ? (
                    <CheckCircle2 size={11} />
                  ) : isTampered ? (
                    <AlertTriangle size={11} />
                  ) : (
                    <HelpCircle size={11} />
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

