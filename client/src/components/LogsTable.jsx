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
        return <UploadCloud size={15} color="var(--primary)" />;
      case "VERIFY":
        return <ShieldCheck size={15} color="var(--secondary)" />;
      case "DELETE":
        return <Trash2 size={15} color="var(--error)" />;
      case "CONFIG_UPDATE":
        return <Sliders size={15} color="var(--primary)" />;
      default:
        return <ShieldCheck size={15} color="var(--on-surface-variant)" />;
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "verified" || s === "success") {
      return (
        <span className="status verified">
          <CheckCircle2 size={11} /> {status}
        </span>
      );
    } else if (s === "tampered") {
      return (
        <span className="status tampered">
          <AlertTriangle size={11} /> {status}
        </span>
      );
    } else if (s === "not found") {
      return (
        <span className="status warning" style={{ background: "rgba(243, 190, 101, 0.15)", color: "var(--primary)", border: "1px solid var(--outline-variant)" }}>
          <HelpCircle size={11} /> {status}
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
    <div className="card">
      <div className="logs-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p className="section-label">FORENSIC REGISTRY</p>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
            Immutable Audit Trail
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)", padding: "6px 12px" }}>
          <Search size={14} color="var(--on-surface-variant)" />
          <input
            type="text"
            placeholder="Search logs, actions, SHA hashes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              color: "var(--on-surface)",
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              width: "240px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "30px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
          QUERYING CRYPTOGRAPHIC AUDIT LOGS...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
          NO AUDIT LOGS MATCHING SEARCH QUERY.
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
                  <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--on-surface)", margin: 0 }}>
                    {log.filename || "System Event"}
                  </h4>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "3px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'JetBrains Mono', monospace" }}>
                      <Clock size={10} />
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Just now"}
                    </span>
                    {log.details && (
                      <small style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
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

