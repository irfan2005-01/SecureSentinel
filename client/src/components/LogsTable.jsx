import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiUpload,
  FiShield,
} from "react-icons/fi";

import api from "../services/api";
import SearchBar from "./SearchBar";

function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const res = await api.get("/logs");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const filteredLogs = logs.filter((log) =>
    log.filename.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (action) => {
    switch (action) {
      case "UPLOAD":
        return <FiUpload />;
      case "VERIFY":
        return <FiShield />;
      default:
        return <FiShield />;
    }
  };

  return (
    <div className="card logs-card">

      <div className="logs-header">
        <div>
          <p className="section-label">
            Audit
          </p>

          <h2>Audit Logs</h2>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="logs-list">

        {filteredLogs.map((log) => (
          <div
            className="log-item"
            key={log.id}
          >
            <div className="log-left">

              <div className="log-icon">
                {getIcon(log.action)}
              </div>

              <div>

                <h4>{log.filename}</h4>

                <span>
                  {new Date(
                    log.timestamp
                  ).toLocaleString()}
                </span>

              </div>

            </div>

            <div className="log-right">

              <span className="action-badge">
                {log.action}
              </span>

              <span
                className={
                  log.status === "Verified"
                    ? "status verified"
                    : log.status === "Tampered"
                    ? "status tampered"
                    : "status"
                }
              >
                {log.status === "Verified" ? (
                  <FiCheckCircle />
                ) : (
                  <FiAlertTriangle />
                )}

                {log.status}
              </span>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default LogsTable;