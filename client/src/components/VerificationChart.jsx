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
    <div className="card chart-card">
      <div
        className="chart-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div>
          <p className="section-label">TIMELINE METRICS</p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>
            Verification Activity & Threat Velocity
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Timeframe selector pills */}
          <div
            style={{
              background: "#080c18",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "3px",
              display: "flex",
              gap: "2px",
            }}
          >
            {["24h", "7d", "30d"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  background: timeframe === tf ? "rgba(0, 240, 255, 0.15)" : "transparent",
                  color: timeframe === tf ? "#00f0ff" : "#64748b",
                  border: timeframe === tf ? "1px solid rgba(0, 240, 255, 0.3)" : "1px solid transparent",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "11px",
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
                  background: "#080c18",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "#94a3b8",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Cloud size={12} color="#00f0ff" />
                <strong style={{ color: "#00f0ff", textTransform: "uppercase" }}>{prov}</strong>: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
          <XAxis dataKey="upload" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" allowDecimals={false} fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "rgba(10, 15, 29, 0.95)",
              border: "1px solid rgba(0, 240, 255, 0.2)",
              borderRadius: "12px",
              color: "#fff",
              boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
              backdropFilter: "blur(12px)",
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "14px", fontSize: "12px" }}
          />
          <Line
            type="monotone"
            name="Ingested Files"
            dataKey="uploads"
            stroke="#00f0ff"
            strokeWidth={3}
            dot={{ r: 4, fill: "#00f0ff", strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            name="Verified Passes"
            dataKey="verifications"
            stroke="#00e699"
            strokeWidth={3}
            dot={{ r: 4, fill: "#00e699", strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            name="Tamper Alerts"
            dataKey="threats"
            stroke="#ff3366"
            strokeWidth={2}
            dot={{ r: 4, fill: "#ff3366", strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VerificationChart;
