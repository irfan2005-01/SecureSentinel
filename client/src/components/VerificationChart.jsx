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
} from "recharts";

function VerificationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const res = await api.get("/analytics");
      setData(res.data.chart);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <p className="section-label">
            Analytics
          </p>

          <h2>Verification Activity</h2>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            stroke="#222"
            vertical={false}
          />

          <XAxis
    dataKey="upload"
            stroke="#777"
          />

          <YAxis
            stroke="#777"
            allowDecimals={false}
          />

          <Tooltip
    contentStyle={{
        background: "#111",
        border: "1px solid #333",
        borderRadius: "12px",
        color: "#fff",
    }}
/>

        <Line
    type="monotone"
    dataKey="uploads"
    stroke="#ffffff"
    strokeWidth={4}
    dot={{
        r: 5,
        fill: "#fff",
    }}
    activeDot={{
        r: 8,
    }}
/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VerificationChart;