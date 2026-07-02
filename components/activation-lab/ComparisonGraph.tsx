"use client";

import { useState } from "react";
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

interface ComparisonDataPoint {
  x: number;
  linear: number;
  binarystep: number;
  relu: number;
  sigmoid: number;
  tanh: number;
  leakyrelu: number;
  elu: number;
  swish: number;
  gelu: number;
  //softmax: any;
}

interface Props {
  data: ComparisonDataPoint[];
}

const LINES = [
  { key: "linear", name: "Linear", color: "#f97316" },
  { key: "binarystep", name: "Binary Step", color: "#ef4444" },
  { key: "relu", name: "ReLU", color: "#a855f7" },
  { key: "sigmoid", name: "Sigmoid", color: "#ec4899" },
  { key: "tanh", name: "Tanh", color: "#06b6d4" },
  { key: "leakyrelu", name: "Leaky ReLU", color: "#22c55e" },
  { key: "elu", name: "ELU", color: "#facc15" },
  { key: "swish", name: "Swish", color: "#3b82f6" },
  { key: "gelu", name: "GELU", color: "#8b5cf6" },
  // { key: "softmax", name: "Softmax", color: "#14b8a6" },
];

export default function ComparisonGraph({ data }: Props) {
  // null = show all, otherwise only the selected key is shown
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleLegendClick = (key: string) => {
    setActiveKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="glass-card p-6 mt-8">
      <div className="w-full h-125 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="x" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Legend
              onClick={(e) => handleLegendClick(e.dataKey as string)}
              wrapperStyle={{ cursor: "pointer" }}
              formatter={(value, entry: any) => {
                const isActive =
                  activeKey === null || activeKey === entry.dataKey;
                return (
                  <span
                    style={{
                      color: isActive ? entry.color : "#475569",
                      fontWeight: activeKey === entry.dataKey ? 700 : 400,
                    }}
                  >
                    {value}
                  </span>
                );
              }}
            />

            {LINES.map(({ key, name, color }) => {
              if (activeKey !== null && activeKey !== key) return null;
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={name}
                  stroke={color}
                  strokeWidth={3}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {activeKey && (
        <button
          onClick={() => setActiveKey(null)}
          className="mt-3 text-sm text-slate-400 hover:text-slate-200 underline"
        >
          Show all functions
        </button>
      )}
    </div>
  );
}