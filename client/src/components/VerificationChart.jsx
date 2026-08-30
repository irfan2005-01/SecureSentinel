import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Cloud } from "lucide-react";

function VerificationChart() {
  const [data, setData] = useState([]);
  const [providerDist, setProviderDist] = useState({});
  const [timeframe, setTimeframe] = useState("7d"); // '24h' | '7d' | '30d'

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  async function loadAnalytics() {
    try {
      const res = await api.get("/api/analytics/analytics");
      if (res.data?.chart) {
        setData(res.data.chart);
      }
      if (res.data?.provider_distribution) {
        setProviderDist(res.data.provider_distribution);
      }
    } catch (err) {
      console.error("Failed to load analytics data", err);
    }
  }

  return (
    <div className="card">
      <div
        className="chart-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div>
          <p className="section-label">TIMELINE METRICS</p>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
            Verification Activity & Threat Velocity
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Timeframe selector pills */}
          <div
            style={{
              background: "var(--surface-lowest)",
              border: "1px solid var(--outline-variant)",
              padding: "2px",
              display: "flex",
              gap: "2px",
            }}
          >
            {["24h", "7d", "30d"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  background: timeframe === tf ? "var(--primary-container)" : "transparent",
                  color: timeframe === tf ? "var(--on-primary-container)" : "var(--on-surface-variant)",
                  padding: "3px 8px",
                  fontSize: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase",
                }}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Provider badges */}
          <div style={{ display: "flex", gap: "6px" }}>
            {Object.entries(providerDist).map(([prov, count]) => (
              <span
                key={prov}
                style={{
                  background: "var(--surface-lowest)",
                  padding: "3px 8px",
                  fontSize: "10px",
                  color: "var(--on-surface-variant)",
                  border: "1px solid var(--outline-variant)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <Cloud size={11} color="var(--primary)" />
                <strong style={{ color: "var(--primary)", textTransform: "uppercase" }}>{prov}</strong>: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(79, 69, 55, 0.2)" vertical={false} />
          <XAxis dataKey="upload" stroke="var(--on-surface-variant)" fontSize={11} tickLine={false} fontFamily="'JetBrains Mono', monospace" />
          <YAxis stroke="var(--on-surface-variant)" allowDecimals={false} fontSize={11} tickLine={false} fontFamily="'JetBrains Mono', monospace" />
          <Tooltip
            contentStyle={{
              background: "var(--surface-container)",
              border: "1px solid var(--outline-variant)",
              color: "var(--on-surface)",
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "10px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}
          />
          <Line
            type="monotone"
            name="Ingested Files"
            dataKey="uploads"
            stroke="#f3be65"
            strokeWidth={2}
            dot={{ r: 3, fill: "#f3be65", strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            name="Verified Passes"
            dataKey="verifications"
            stroke="#8cd7a5"
            strokeWidth={2}
            dot={{ r: 3, fill: "#8cd7a5", strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            name="Tamper Alerts"
            dataKey="threats"
            stroke="#ff887c"
            strokeWidth={2}
            dot={{ r: 3, fill: "#ff887c", strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VerificationChart;

