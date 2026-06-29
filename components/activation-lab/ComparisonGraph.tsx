"use client";

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

export default function ComparisonGraph({
  data,
}: Props) {
  return (
    <div className="glass-card p-6 mt-8">
      

      <div className="w-full h-125 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="x"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
            />

            <Tooltip />
            <Legend />
<Line
             type="monotone"
              dataKey="linear"
              name="Linear"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
              />

            <Line
              type="monotone"
              dataKey="binarystep"
              name="Binary Step"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
            />
            <Line

              type="monotone"
              dataKey="relu"
              name="ReLU"
              stroke="#a855f7"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="sigmoid"
              name="Sigmoid"
              stroke="#ec4899"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="tanh"
              name="Tanh"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="leakyrelu"
              name="Leaky ReLU"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
            />
             <Line
              type="monotone"
              dataKey="elu"
              name="ELU"
              stroke="#facc15"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="swish"
              name="Swish"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="gelu"
              name="GELU"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="softmax"
              name="Softmax"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}