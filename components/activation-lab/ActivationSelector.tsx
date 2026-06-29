"use client";

import { ActivationType } from "@/lib/activation-lab/activations";

interface Props {
  activation: ActivationType;
  setActivation: (value: ActivationType) => void;
}

const OPTIONS: { value: ActivationType; label: string; icon: string; desc: string }[] = [
{
    value: "linear",
    label: "Linear",
    icon: "📏",
    desc: "Returns the input exactly as it is. Commonly used in the output layer for regression tasks."
  },
   {
    value: "binarystep",
    label: "Binary Step",
    icon: "🚦",
    desc: "Outputs 0 for negative values and 1 for positive values. Used in early perceptrons."
  },


  { value: "relu",      label: "ReLU",       icon: "⚡", desc: "If the value is negative → it becomes 0; if the value is positive → it stays the same." },
  { value: "sigmoid",   label: "Sigmoid",    icon: "📈", desc: "Squashes any value into a range between 0 and 1. Often used to represent probabilities."
 },
  { value: "tanh",      label: "Tanh",       icon: "〰️", desc: "Squashes values into a range between -1 and +1. Negative inputs stay negative, positive inputs stay positive." },
  { value: "leakyrelu", label: "Leaky ReLU", icon: "🔧", desc: "Value is positive → it stays the same; value is negative → instead of making it 0, it becomes a very small number" },
    {
    value: "elu",
    label: "ELU",
    icon: "🌊",
    desc: "Similar to ReLU, but negative values become smooth exponential values instead of zero."
  },
  {
    value: "swish",
    label: "Swish",
    icon: "🌀",
    desc: "Multiplies the input by its sigmoid value, creating a smooth activation used in modern neural networks."
  },
  {
    value: "gelu",
    label: "GELU",
    icon: "🧠",
    desc: "Smoothly weights inputs based on probability. Widely used in Transformers and Large Language Models."
  },
 
];

export default function ActivationSelector({ activation, setActivation }: Props) {
  const selected = OPTIONS.find((o) => o.value === activation)!;

  return (
    <div className="glass-card p-6">
      <h2 className="card-title text-xl font-bold mb-4">
        ✨ Select Activation Function
      </h2>

      {/* Icon pill grid — centered */}
      <div className="activation-grid">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActivation(opt.value)}
            className={`act-pill${activation === opt.value ? " selected" : ""}`}
          >
            <span className="act-pill-icon">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Description bubble */}
      <div style={{
        marginTop: "1rem",
        padding: "12px 16px",
        borderRadius: "16px",
        background: "#FFF8E7",
        border: "2px solid #FFE08A",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#6B7280",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <span style={{ fontSize: "1.25rem" }}>{selected.icon}</span>
        {selected.desc}
      </div>
    </div>
  );
}