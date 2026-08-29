import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  ShieldCheck,
  Trash2,
  Sliders,
  HelpCircle,
  Clock,
  Search,
} from "lucide-react";
import api from "../services/api";

function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const res = await api.get("/api/analytics/logs");
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    const filename = (log.filename || "").toLowerCase();
    const action = (log.action || "").toLowerCase();
    const details = (log.details || "").toLowerCase();
    const status = (log.status || "").toLowerCase();
    return filename.includes(q) || action.includes(q) || details.includes(q) || status.includes(q);
  });

  const getActionIcon = (action) => {
    switch (action?.toUpperCase()) {
      case "UPLOAD":
        return <UploadCloud size={16} color="#00f0ff" />;
      case "VERIFY":
        return <ShieldCheck size={16} color="#a855f7" />;
      case "DELETE":
        return <Trash2 size={16} color="#ff3366" />;
      case "CONFIG_UPDATE":
        return <Sliders size={16} color="#f59e0b" />;
      default:
        return <ShieldCheck size={16} color="#94a3b8" />;
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "verified" || s === "success") {
      return (
        <span className="status verified">
          <CheckCircle2 size={12} /> {status}
        </span>
      );
    } else if (s === "tampered") {
      return (
        <span className="status tampered">
          <AlertTriangle size={12} /> {status}
        </span>
      );
    } else if (s === "not found") {
      return (
        <span className="status warning" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
          <HelpCircle size={12} /> {status}
        </span>
      );
    }
    return (
      <span className="status">
        {status}
      </span>
    );
  };

  return (
    <div className="card logs-card">
      <div className="logs-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p className="section-label">FORENSIC REGISTRY</p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>
            Immutable Audit Trail
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#080c18", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "8px 14px" }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search filenames, actions, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              color: "#fff",
              fontSize: "13px",
              width: "220px",
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Querying cryptographic audit logs...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          No audit logs matching search query.
        </div>
      ) : (
        <div className="logs-list">
          {filteredLogs.map((log) => (
            <div className="log-item" key={log.id}>
              <div className="log-left">
                <div className="log-icon">
                  {getActionIcon(log.action)}
                </div>

                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 }}>
                    {log.filename || "System Event"}
                  </h4>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={10} />
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Just now"}
                    </span>
                    {log.details && (
                      <small style={{ color: "#94a3b8", fontSize: "11px" }}>
                        • {log.details}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="log-right" style={{ display: "flex", alignItems: "center" }}>
                <span className="action-badge">
                  {log.action}
                </span>
                {getStatusBadge(log.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LogsTable;
