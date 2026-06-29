"use client";

interface Props {
  x: number; w: number; b: number;
  setX: (v: number) => void;
  setW: (v: number) => void;
  setB: (v: number) => void;
}

const FIELDS = [
  { key: "x" as const, label: "Input (x)",   emoji: "🔢", color: "#4CC9F0" },
  { key: "w" as const, label: "Weight (w)",  emoji: "⚖️",  color: "#9B5DE5" },
  { key: "b" as const, label: "Bias (b)",    emoji: "➕", color: "#FF6B9D" },
];

export default function InputPanel({ x, w, b, setX, setW, setB }: Props) {
  const values   = { x, w, b };
  const setters  = { x: setX, w: setW, b: setB };

  return (
    <div className="glass-card p-6">
      <h2 className="card-title text-xl font-bold mb-4">🔬 Tweak the Neuron</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {FIELDS.map(({ key, label, emoji, color }) => (
          <div key={key}>
            <label className="input-label" style={{ color }}>
              {emoji} {label}
            </label>
            <input
              type="number"
              value={values[key]}
              onChange={(e) => setters[key](Number(e.target.value))}
              step={key === "w" ? 0.1 : 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}