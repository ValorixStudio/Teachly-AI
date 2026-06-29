"use client";

import { useMemo, useState } from "react";

import ActivationSelector from "@/components/activation-lab/ActivationSelector";
import FormulaCard from "@/components/activation-lab/FormulaCard";
import PropertiesCard from "@/components/activation-lab/PropertiesCard";
import ActivationGraph from "@/components/activation-lab/ActivationGraph";
import ComparisonGraph from "@/components/activation-lab/ComparisonGraph";

import { applyActivation, ActivationType } from "@/lib/activation-lab/activations";
import { properties } from "@/lib/activation-lab/properties";

// ── Types ──────────────────────────────────────────────────────────────────
interface NeuronInput {
  id: number;
  x: number;
  w: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function calcLinearOutput(inputs: NeuronInput[], b: number): number {
  return inputs.reduce((sum, inp) => sum + inp.w * inp.x, 0) + b;
}

/** Build a human-readable formula string for the current inputs */
function buildFormulaString(inputs: NeuronInput[], b: number): string {
  if (inputs.length === 1) {
    return `z = w·x + b`;
  }
  const terms = inputs.map((_, i) => `w${subscript(i + 1)}x${subscript(i + 1)}`).join(" + ");
  return `z = ${terms} + b`;
}

function buildComputedString(inputs: NeuronInput[], b: number, z: number): string {
  const terms = inputs
    .map((inp) => `(${inp.w} × ${inp.x})`)
    .join(" + ");
  return `z = ${terms} + ${b} = ${z.toFixed(4)}`;
}

function subscript(n: number): string {
  const map: Record<string, string> = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃",
    "4": "₄", "5": "₅", "6": "₆", "7": "₇",
    "8": "₈", "9": "₉",
  };
  return String(n)
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
}

// ── Formulas that adapt to input count ────────────────────────────────────
function getAdaptedFormula(activation: ActivationType, inputCount: number): {
  general: string;
  activation: string;
  note: string;
} {
  const zDef =
    inputCount === 1
      ? "z = wx + b"
      : `z = ${Array.from({ length: inputCount }, (_, i) => `w${subscript(i + 1)}x${subscript(i + 1)}`).join(" + ")} + b`;

  const activationFormulas: Record<ActivationType, string> = {
    relu: "a = max(0, z)",
    sigmoid: "a = 1 / (1 + e⁻ᶻ)",
    tanh: "a = (eᶻ - e⁻ᶻ) / (eᶻ + e⁻ᶻ)",
    binarystep: "a = 1 if z ≥ 0, else 0",
    leakyrelu: "a = max(0.01z, z)",
    elu: "a = z if z > 0, else α(eᶻ - 1)",
    swish: "a = z · σ(z)",
    gelu: "a ≈ 0.5z · (1 + tanh(√(2/π)(z + 0.044715z³)))",
  };

  return {
    general: zDef,
    activation: activationFormulas[activation],
    note:
      inputCount > 1
        ? `Each input xᵢ has its own learnable weight wᵢ. The neuron computes a weighted sum of all ${inputCount} inputs before applying the activation.`
        : "A single input x is multiplied by weight w and bias b is added.",
  };
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<NeuronInput[]>([
    { id: 1, x: 2, w: 0.5 },
  ]);
  const [b, setB] = useState(1);
  const [activation, setActivation] = useState<ActivationType>("relu");

  const linearOutput = calcLinearOutput(inputs, b);
  const activatedOutput = applyActivation(linearOutput, activation);
  const activationLabel =
    activation.charAt(0).toUpperCase() + activation.slice(1);
  const adaptedFormula = getAdaptedFormula(activation, inputs.length);

  // ── Input helpers ────────────────────────────────────────────────────────
  function addInput() {
    if (inputs.length >= 6) return;
    setInputs((prev) => [
      ...prev,
      { id: Date.now(), x: 1, w: 0.5 },
    ]);
  }

  function removeInput(id: number) {
    if (inputs.length <= 1) return;
    setInputs((prev) => prev.filter((inp) => inp.id !== id));
  }

  function updateInput(
    id: number,
    field: "x" | "w",
    raw: string
  ) {
    const val = raw === "" || raw === "-" ? 0 : parseFloat(raw);
    setInputs((prev) =>
      prev.map((inp) =>
        inp.id === id ? { ...inp, [field]: isNaN(val) ? 0 : val } : inp
      )
    );
  }

  // ── Graph data ────────────────────────────────────────────────────────────
  // For graphs we sweep x₁ (first input), keeping others fixed
  const graphData = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => {
      const xVal = parseFloat((-10 + i * 0.1).toFixed(2));
      const z =
        inputs[0].w * xVal +
        inputs.slice(1).reduce((s, inp) => s + inp.w * inp.x, 0) +
        b;
      return { x: xVal, y: applyActivation(z, activation) };
    });
  }, [activation, inputs, b]);

  const comparisonData = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => {
      const xVal = parseFloat((-10 + i * 0.1).toFixed(2));
      const z =
        inputs[0].w * xVal +
        inputs.slice(1).reduce((s, inp) => s + inp.w * inp.x, 0) +
        b;
      return {
        x: xVal,
        linear: z,
        binarystep: applyActivation(z, "binarystep"),
        relu: applyActivation(z, "relu"),
        sigmoid: applyActivation(z, "sigmoid"),
        tanh: applyActivation(z, "tanh"),
        leakyrelu: applyActivation(z, "leakyrelu"),
        elu: applyActivation(z, "elu"),
        swish: applyActivation(z, "swish"),
        gelu: applyActivation(z, "gelu"),
      };
    });
  }, [inputs, b]);

  // ── SVG wiring heights ────────────────────────────────────────────────────
  const INPUT_BOX_H = 90; // approx px per input row
  const svgH = inputs.length * INPUT_BOX_H;
  const midY = svgH / 2;

  return (
    <main>
      {/* ── HERO ── */}
      <div className="text-center mb-8">
        <h1 className="gradient-text text-5xl font-black mb-3 leading-tight">
          Activation Function
          <br />
          Learning Lab
        </h1>
        <div className="text-center mb-8">
          Learn how neurons think, how activation functions work, and explore
          neural networks through fun visual experiments.
        </div>
      </div>
      <br />

      {/* ── PROGRESS BAR ── */}
      <div className="max-w-xxl mx-auto mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            🧠 Build Neuron
          </span>
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            ⚡ Explore Activations
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: step === 0 ? "50%" : "100%" }}
          />
        </div>
      </div>
      <br />

      {/* ── STEP TABS ── */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setStep(0)}
          className={`step-tab ${step === 0 ? "active-orange" : ""}`}
        >
          🧠 Step 1
        </button>
        <button
          onClick={() => setStep(1)}
          className={`step-tab ${step === 1 ? "active-blue" : ""}`}
        >
          ⚡ Step 2
        </button>
      </div>
      <br />

      {/* ════════════════════════
          STEP 1 — Build Neuron
          ════════════════════════ */}
      {step === 0 && (
        <section>
          <h2 className="section-title text-3xl font-black mb-6">
            🧠 Build Your Neuron
          </h2>
          <br />

          {/* ── Multi-input controls ─────────────────────────────────── */}
          <div className="glass-card p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <p className="info-card-title">
                Inputs &amp; Weights
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({inputs.length} input{inputs.length > 1 ? "s" : ""})
                </span>
               
              </p>
              <div className="flex gap-2">
                <button
                  onClick={addInput}
                  disabled={inputs.length >= 6}
                  className="flex items-center gap-1 rounded-xxl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-bold text-white shadow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  + Add Input
                </button>
              </div>
            </div>

            {/* Input rows */}
            <div className="space-y-3">
              {inputs.map((inp, idx) => (
                <div
                  key={inp.id}
                  className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3"
                >
                   <br></br>
                  {/* Label badge */}
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-500 text-white text-xs font-black shrink-0">
                    x{subscript(idx + 1)}
                  </span>
 <br></br>
                  <div className="flex flex-1 gap-4 flex-wrap">
                    
                    <div className="flex flex-col gap-1 min-w-[100px]">
                      <label className="text-xs font-bold text-gray-500">
                        Input x{subscript(idx + 1)}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={inp.x}
                        onChange={(e) =>
                          updateInput(inp.id, "x", e.target.value)
                        }
                        className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1 min-w-[100px]">
                      <label className="text-xs font-bold text-gray-500">
                        Weight w{subscript(idx + 1)}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={inp.w}
                        onChange={(e) =>
                          updateInput(inp.id, "w", e.target.value)
                        }
                        className="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>

                    {/* Contribution chip */}
                    <div className="flex items-end pb-1">
                      <span className="rounded-lg bg-white border border-gray-200 px-3 py-2 text-xs font-mono text-gray-600">
                        w{subscript(idx + 1)}·x{subscript(idx + 1)} ={" "}
                        <span className="font-bold text-violet-600">
                          {(inp.w * inp.x).toFixed(3)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  {inputs.length > 1 && (
                    <button
                      onClick={() => removeInput(inp.id)}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 font-bold text-sm transition-all"
                      title={`Remove input ${idx + 1}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
<br></br>
            {/* Bias row */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-9 py-3">
             <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-400 text-white text-xs font-black shrink-0">
                b
              </span>
              
              <div className="flex flex-col gap-1 min-w-[100px]">
                <label className="text-xs font-bold text-gray-500">
                  Bias (b)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={b}
                  onChange={(e) =>
                    setB(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)
                  }
                  className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {inputs.length > 1 && (
              <p className="mt-3 text-xs text-gray-400 italic">
                💡 Tip: graphs sweep x₁ while keeping other inputs fixed at
                their current values.
              </p>
            )}
          </div>
          <br />
         
          {/* ── Neuron flow diagram ───────────────────────────────────── */}
          <div className="glass-card p-7 mb-5">
            <div className="neuron-flow">
              {/* Inputs column */}
              <div className="flow-inputs">
                {inputs.map((inp, idx) => (
                  <div key={inp.id} className="flow-input-box">
                    <span className="input-label">
                      x{subscript(idx + 1)} = {inp.x},{" "}
                      w{subscript(idx + 1)} = {inp.w}
                    </span>
                    <div className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-mono font-semibold text-violet-700">
                      {(inp.w * inp.x).toFixed(3)}
                    </div>
                  </div>
                ))}
                {/* Bias */}
                <div className="flow-input-box">
                  <span className="input-label">Bias (b)</span>
                  <div className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-mono font-semibold text-orange-600">
                    {b}
                  </div>
                </div>
              </div>

              {/* SVG wiring */}
              <svg
                className="flow-connector"
                width="56"
                height={svgH + INPUT_BOX_H}
                viewBox={`0 0 56 ${svgH + INPUT_BOX_H}`}
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="flowArrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M2 1L8 5L2 9" />
                  </marker>
                </defs>
                {/* Lines from each input row */}
                {Array.from({ length: inputs.length + 1 }, (_, i) => {
                  const y = (i + 0.5) * INPUT_BOX_H;
                  return (
                    <g key={i}>
                      <line x1="0" y1={y} x2="30" y2={y} stroke="#a78bfa" strokeWidth="2" />
                    </g>
                  );
                })}
                {/* Vertical trunk */}
                <line
                  x1="30"
                  y1={0.5 * INPUT_BOX_H}
                  x2="30"
                  y2={(inputs.length + 0.5) * INPUT_BOX_H}
                  stroke="#a78bfa"
                  strokeWidth="2"
                />
                {/* Arrow to Σ */}
                <line
                  x1="30"
                  y1={midY}
                  x2="56"
                  y2={midY}
                  stroke="#a78bfa"
                  strokeWidth="2"
                  markerEnd="url(#flowArrow)"
                />
              </svg>

              {/* Σ node */}
              <div className="flow-node">
                <span className="flow-node-symbol">
                  Weighted Sum
                  <br />Σ
                </span>
                <span className="flow-node-value">
                  {linearOutput.toFixed(2)}
                </span>
              </div>

              <span className="flow-arrow">➜</span>

              {/* Activation node */}
              <div className="flow-node flow-node-activation">
                <span className="flow-node-label">
                  Activation Function
                  <br />({activationLabel})
                </span>
                <span className="flow-node-value">
                  {activatedOutput.toFixed(4)}
                </span>
              </div>

              <span className="flow-arrow">➜</span>

              {/* Output node */}
              <div className="flow-node flow-node-output">
                <span className="flow-node-label">Output</span>
                <span className="flow-node-value">
                  {activatedOutput.toFixed(4)}
                </span>
              </div>

              <div className="info-card">
                <img
                  src="/neuron.png"
                  alt="Neuron Flow"
                  className="w-full rounded-xl border-2 border-yellow-200 mb-4"
                />
                <p>
                  Refer this to understand the flow of data through a neuron.
                  Adjust the inputs, weights, and bias values to see how they
                  affect the output after applying the selected activation
                  function.
                </p>
              </div>
            </div>

            {/* ── Live formula display ───────────────────────────────── */}
            <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-7">
              <br></br>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
                Live Formula
              </p>
             
              <p className="font-mono text-indigo-800 text-sm font-semibold mb-1">
                {adaptedFormula.general}
              </p>
              <p className="font-mono text-indigo-600 text-sm mb-2">
                {adaptedFormula.activation}
              </p>
              <p className="text-xs text-indigo-400 mb-3">
                {adaptedFormula.note}
              </p>
              <div className="rounded-xl bg-white border border-indigo-100 px-4 py-7 font-mono text-sm text-gray-700">
                 <br></br>

                <span className="text-gray-400">Computed: </span>
                {buildComputedString(inputs, b, linearOutput)}
                  
              </div>
               <br></br>

              <div className="rounded-xl bg-white border border-indigo-100 px-4 py-2 font-mono text-sm text-gray-700 mt-2">
                <span className="text-gray-400">Activated: </span>
                a = {activationLabel}({linearOutput.toFixed(4)}) ={" "}
                <span className="font-bold text-violet-600">
                  {activatedOutput.toFixed(4)}
                </span>
              </div>
            </div>

            <p className="flow-formula mt-4">
              {inputs.length === 1
                ? "z = wx + b  ➜  a = f(z)"
                : `z = ${inputs.map((_, i) => `w${subscript(i + 1)}x${subscript(i + 1)}`).join(" + ")} + b  ➜  a = f(z)`}
            </p>
          </div>
          <br />

          {/* Activation selector */}
          <div className="glass-card p-6 mb-5">
            <p className="info-card-title mb-2">Activation function</p>
            <ActivationSelector
              activation={activation}
              setActivation={setActivation}
            />
          </div>
          <br />

          {/* Formula + properties */}
          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="info-card">
              <p className="info-card-title">{activationLabel}</p>
              {/* Inline adapted formula card instead of static FormulaCard */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Linear Combination
                  </p>
                  <p className="font-mono text-sm text-gray-700">
                    {adaptedFormula.general}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Activation
                  </p>
                  <p className="font-mono text-sm text-gray-700">
                    {adaptedFormula.activation}
                  </p>
                </div>
                {inputs.length > 1 && (
                  <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
                    <p className="text-xs text-violet-600">
                      {adaptedFormula.note}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card">
              <p className="info-card-title">Properties</p>
              <PropertiesCard data={properties[activation]} />
            </div>
          </div>
          <br />

          {/* Next button */}
          <div className="flex justify-end mt-8">
            <button className="btn-next" onClick={() => setStep(1)}>
              Next: Explore Activations ➜
            </button>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          STEP 2 — Explore Activation Functions
          ═══════════════════════════════════ */}
      {step === 1 && (
        <section>
          <h2 className="section-title text-3xl font-black mb-6">
            ⚡ Explore Activation Functions
          </h2>
          <br />

          {inputs.length > 1 && (
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-700">
              <strong>📊 Note:</strong> Graphs sweep x₁ across −10 → 10 while
              x₂{inputs.length > 2 ? "…" : ""} and bias are fixed at their
              current values.
            </div>
          )}

          <div className="glass-card p-6 mb-5">
            <h3 className="card-title text-lg font-bold mb-6">
              Activation Curve — {activationLabel}
            </h3>
            <br />
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Graph */}
              <div className="xl:col-span-3">
                <ActivationGraph data={graphData} />
              </div>

              {/* Side Panel */}
              <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5 h-fit">
                <br />
                <h4 className="text-lg font-bold text-violet-700 mb-5">
                  📖 How to Read This Graph
                </h4>
<br></br>
                <div className="rounded-xl bg-white p-4 shadow-sm border mb-5">
                  <div className="text-center space-y-3">
                    <div>
                      <br />
                      <div className="font-bold text-blue-600">
                        Linear Output (z)
                      </div>
                      
                      <div className="text-xs text-gray-500">X-axis</div>
                      
                    </div>
                    <div className="text-2xl text-violet-500">↓</div>
                    <div className="font-semibold text-violet-700">
                      Activation Function
                    </div>
                    <div className="text-2xl text-violet-500">↓</div>
                    <div>
                      <div className="font-bold text-pink-600">
                        Activated Output (a)
                      </div>
                      <div className="text-xs text-gray-500">Y-axis</div>
                    </div>
                    <br />
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                   <br></br>
                  <div className="rounded-lg bg-blue-100 p-3">
                   
                    <div className="font-semibold text-blue-700">X-axis</div>
                    <p className="text-gray-700 mt-1">
                      Represents the neuron&apos;s{" "}
                      <strong>linear output (z)</strong> before any activation
                      is applied.
                    </p>
                  </div>
                   <br></br>
                  <div className="rounded-lg bg-pink-100 p-3">
                    <div className="font-semibold text-pink-700">Y-axis</div>
                    <p className="text-gray-700 mt-1">
                      Represents the <strong>activated output (a)</strong> after
                      applying the selected activation function.
                    </p>
                  </div>
                </div>
 <br></br>
                <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <div className="font-semibold mb-3">Formula</div>
                  <div className="text-center font-mono text-xs">
                    <div>{adaptedFormula.general}</div>
                    <div className="my-2 text-gray-400">↓</div>
                    <div>a = f(z)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />

          {/* Comparison graph */}
          <div className="glass-card p-6">
            <h3 className="card-title text-lg font-bold mb-4">
              All Functions Compared
            </h3>
            <br />
            <ComparisonGraph data={comparisonData} />
          </div>
          <br />

          {/* Nav buttons */}
          <div className="flex justify-between items-center mt-8">
            <button className="btn-back" onClick={() => setStep(0)}>
              ⬅ Back
            </button>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 px-6 py-4 border-2 border-yellow-300 shadow-lg">
              <br />
              <br />
              <span className="text-4xl">🏆</span>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Hurray! You Did It! 🎉
              </span>
              <span className="text-4xl">🎊</span>
              <br />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}