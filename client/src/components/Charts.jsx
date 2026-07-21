import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import api from "../services/api";

const COLORS = ["#22c55e", "#ef4444"];

function Charts() {
  const [stats, setStats] = useState({
    verified: 0,
    tampered: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await api.get("/stats");
    setStats(res.data);
  }

  const data = [
    {
      name: "Verified",
      value: stats.verified,
    },
    {
      name: "Tampered",
      value: stats.tampered,
    },
  ];

  return (
    <div className="card">
      <h2>Security Overview</h2>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={120}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;