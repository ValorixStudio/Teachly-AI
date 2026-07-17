"use client";
import { useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import {
  Brain,
  Share2,
  Home,
  Boxes,
  LineChart as LineChartIcon,
  CheckSquare,
  BarChart3,
  Sparkles,
  HelpCircle,
  Folder,
  Sun,
  Moon,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  Play,
  Save,
  Camera,
  MoreHorizontal,
  ChevronDown,
  Table2,
  Wand2,
  X,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static network definition                                          */
/* ------------------------------------------------------------------ */

const LAYERS = [
  { name: "Input Layer", units: 4, type: "Input", activation: "–", color: "#22c55e" },
  { name: "Hidden Layer 1", units: 6, type: "Dense", activation: "ReLU", color: "#3b82f6" },
  { name: "Hidden Layer 2", units: 5, type: "Dense", activation: "ReLU", color: "#a855f7" },
  { name: "Output Layer", units: 2, type: "Dense", activation: "Softmax", color: "#f43f5e" },
];

const VIEW_W = 1000;
const VIEW_H = 460;

function layerX(index:number) {
  const margin = 110;
  const usable = VIEW_W - margin * 2;
  return margin + (usable * index) / (LAYERS.length - 1);
}

function nodeYs(count:number) {
  const spacing = 62;
  const total = (count - 1) * spacing;
  const start = VIEW_H / 2 - total / 2;
  return Array.from({ length: count }, (_, i) => start + i * spacing);
}

function paramCount() {
  let total = 0;
  for (let i = 1; i < LAYERS.length; i++) {
    total += LAYERS[i - 1].units * LAYERS[i].units + LAYERS[i].units;
  }
  return total;
}

/* ------------------------------------------------------------------ */
/*  Real neural network engine — actual forward pass, backprop, and    */
/*  gradient-descent weight updates. No randomised/fake curves: every  */
/*  loss, accuracy, and activation value below is computed from this.  */
/* ------------------------------------------------------------------ */

type Sample = { x: number[]; y: number[] };

type NetWeights = {
  W1: number[][]; b1: number[];
  W2: number[][]; b2: number[];
  W3: number[][]; b3: number[];
};

function randWeight(fanIn: number, fanOut: number) {
  const limit = Math.sqrt(6 / (fanIn + fanOut)); // Xavier/Glorot uniform init
  return (Math.random() * 2 - 1) * limit;
}

function initNetwork(): NetWeights {
  const sizes = LAYERS.map((l) => l.units); // [4, 6, 5, 2]
  const makeW = (nIn: number, nOut: number) =>
    Array.from({ length: nIn }, () => Array.from({ length: nOut }, () => randWeight(nIn, nOut)));
  const makeB = (nOut: number) => Array.from({ length: nOut }, () => 0);
  return {
    W1: makeW(sizes[0], sizes[1]), b1: makeB(sizes[1]),
    W2: makeW(sizes[1], sizes[2]), b2: makeB(sizes[2]),
    W3: makeW(sizes[2], sizes[3]), b3: makeB(sizes[3]),
  };
}

function zerosLikeNet(net: NetWeights): NetWeights {
  const zW = (W: number[][]) => W.map((row) => row.map(() => 0));
  const zB = (b: number[]) => b.map(() => 0);
  return {
    W1: zW(net.W1), b1: zB(net.b1),
    W2: zW(net.W2), b2: zB(net.b2),
    W3: zW(net.W3), b3: zB(net.b3),
  };
}

function relu(x: number) { return x > 0 ? x : 0; }
function reluDeriv(x: number) { return x > 0 ? 1 : 0; }

function matVec(x: number[], W: number[][], b: number[]) {
  const out = new Array(b.length).fill(0);
  for (let j = 0; j < b.length; j++) {
    let s = b[j];
    for (let i = 0; i < x.length; i++) s += x[i] * W[i][j];
    out[j] = s;
  }
  return out;
}

function softmax(z: number[]) {
  const m = Math.max(...z);
  const exps = z.map((v) => Math.exp(v - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

function forwardPass(x: number[], net: NetWeights) {
  const z1 = matVec(x, net.W1, net.b1);
  const a1 = z1.map(relu);
  const z2 = matVec(a1, net.W2, net.b2);
  const a2 = z2.map(relu);
  const z3 = matVec(a2, net.W3, net.b3);
  const a3 = softmax(z3);
  return { x, z1, a1, z2, a2, z3, a3 };
}

// dL/da for the chosen loss function, plus the scalar loss itself.
function lossAndOutputGrad(pred: number[], target: number[], lossFn: string) {
  const n = pred.length;
  let loss = 0;
  const dLda = new Array(n).fill(0);
  if (lossFn === "Cross Entropy") {
    for (let i = 0; i < n; i++) {
      const p = Math.min(Math.max(pred[i], 1e-7), 1 - 1e-7);
      loss += -target[i] * Math.log(p);
      dLda[i] = -target[i] / p;
    }
  } else if (lossFn === "Mean Absolute Error") {
    for (let i = 0; i < n; i++) {
      const diff = pred[i] - target[i];
      loss += Math.abs(diff) / n;
      dLda[i] = (diff > 0 ? 1 : diff < 0 ? -1 : 0) / n;
    }
  } else {
    // Mean Squared Error (default)
    for (let i = 0; i < n; i++) {
      const diff = pred[i] - target[i];
      loss += (diff * diff) / n;
      dLda[i] = (2 * diff) / n;
    }
  }
  return { loss, dLda };
}

// Combine dL/da with the softmax Jacobian (dai/dzj = ai*(delta_ij - aj)) to get dL/dz.
function softmaxBackward(a: number[], dLda: number[]) {
  const n = a.length;
  const dz = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) {
      const dai_dzj = a[i] * ((i === j ? 1 : 0) - a[j]);
      s += dLda[i] * dai_dzj;
    }
    dz[j] = s;
  }
  return dz;
}

function denseBackward(prevA: number[], delta: number[]) {
  const dW = prevA.map((a) => delta.map((d) => a * d));
  return { dW, db: delta.slice() };
}

// Propagates dL/dz at the current layer back through weights W to the
// previous layer's activation, then through ReLU's derivative.
function propagateDelta(delta: number[], W: number[][], prevZ: number[]) {
  const nIn = W.length;
  const dPrevA = new Array(nIn).fill(0);
  for (let i = 0; i < nIn; i++) {
    let s = 0;
    for (let j = 0; j < delta.length; j++) s += W[i][j] * delta[j];
    dPrevA[i] = s;
  }
  return dPrevA.map((v, i) => v * reluDeriv(prevZ[i]));
}

type Grads = { dW1: number[][]; db1: number[]; dW2: number[][]; db2: number[]; dW3: number[][]; db3: number[] };

function backwardSample(cache: ReturnType<typeof forwardPass>, net: NetWeights, target: number[], lossFn: string) {
  const { loss, dLda } = lossAndOutputGrad(cache.a3, target, lossFn);
  const dz3 = softmaxBackward(cache.a3, dLda);
  const { dW: dW3, db: db3 } = denseBackward(cache.a2, dz3);
  const dz2 = propagateDelta(dz3, net.W3, cache.z2);
  const { dW: dW2, db: db2 } = denseBackward(cache.a1, dz2);
  const dz1 = propagateDelta(dz2, net.W2, cache.z1);
  const { dW: dW1, db: db1 } = denseBackward(cache.x, dz1);
  return { loss, grads: { dW1, db1, dW2, db2, dW3, db3 } as Grads };
}

function accumulateGrads(sum: NetWeights, g: Grads) {
  const addMat = (A: number[][], B: number[][]) => { for (let i = 0; i < A.length; i++) for (let j = 0; j < A[i].length; j++) A[i][j] += B[i][j]; };
  const addVec = (a: number[], b: number[]) => { for (let i = 0; i < a.length; i++) a[i] += b[i]; };
  addMat(sum.W1, g.dW1); addVec(sum.b1, g.db1);
  addMat(sum.W2, g.dW2); addVec(sum.b2, g.db2);
  addMat(sum.W3, g.dW3); addVec(sum.b3, g.db3);
}

function scaleGrads(sum: NetWeights, s: number) {
  const mulMat = (A: number[][]) => { for (let i = 0; i < A.length; i++) for (let j = 0; j < A[i].length; j++) A[i][j] *= s; };
  const mulVec = (a: number[]) => { for (let i = 0; i < a.length; i++) a[i] *= s; };
  mulMat(sum.W1); mulVec(sum.b1); mulMat(sum.W2); mulVec(sum.b2); mulMat(sum.W3); mulVec(sum.b3);
}

type OptState = { m: NetWeights; v: NetWeights; t: number };

function createOptState(net: NetWeights): OptState {
  return { m: zerosLikeNet(net), v: zerosLikeNet(net), t: 0 };
}

// Real optimizer math: plain SGD, RMSprop (running squared-gradient average),
// or Adam (first + second moment with bias correction) — picked by the
// Optimizer dropdown and applied to the actual computed gradients.
function applyGradients(net: NetWeights, grads: NetWeights, opt: OptState, optimizer: string, lr: number) {
  opt.t += 1;
  const beta1 = 0.9, beta2 = 0.999, eps = 1e-8;

  const updateMat = (W: number[][], dW: number[][], mW: number[][], vW: number[][]) => {
    for (let i = 0; i < W.length; i++) {
      for (let j = 0; j < W[i].length; j++) {
        const g = dW[i][j];
        if (optimizer === "Adam") {
          mW[i][j] = beta1 * mW[i][j] + (1 - beta1) * g;
          vW[i][j] = beta2 * vW[i][j] + (1 - beta2) * g * g;
          const mHat = mW[i][j] / (1 - Math.pow(beta1, opt.t));
          const vHat = vW[i][j] / (1 - Math.pow(beta2, opt.t));
          W[i][j] -= (lr * mHat) / (Math.sqrt(vHat) + eps);
        } else if (optimizer === "RMSprop") {
          vW[i][j] = beta2 * vW[i][j] + (1 - beta2) * g * g;
          W[i][j] -= (lr * g) / (Math.sqrt(vW[i][j]) + eps);
        } else {
          W[i][j] -= lr * g;
        }
      }
    }
  };
  const updateVec = (b: number[], db: number[], mb: number[], vb: number[]) => {
    for (let i = 0; i < b.length; i++) {
      const g = db[i];
      if (optimizer === "Adam") {
        mb[i] = beta1 * mb[i] + (1 - beta1) * g;
        vb[i] = beta2 * vb[i] + (1 - beta2) * g * g;
        const mHat = mb[i] / (1 - Math.pow(beta1, opt.t));
        const vHat = vb[i] / (1 - Math.pow(beta2, opt.t));
        b[i] -= (lr * mHat) / (Math.sqrt(vHat) + eps);
      } else if (optimizer === "RMSprop") {
        vb[i] = beta2 * vb[i] + (1 - beta2) * g * g;
        b[i] -= (lr * g) / (Math.sqrt(vb[i]) + eps);
      } else {
        b[i] -= lr * g;
      }
    }
  };

  updateMat(net.W1, grads.W1, opt.m.W1, opt.v.W1);
  updateVec(net.b1, grads.b1, opt.m.b1, opt.v.b1);
  updateMat(net.W2, grads.W2, opt.m.W2, opt.v.W2);
  updateVec(net.b2, grads.b2, opt.m.b2, opt.v.b2);
  updateMat(net.W3, grads.W3, opt.m.W3, opt.v.W3);
  updateVec(net.b3, grads.b3, opt.m.b3, opt.v.b3);
}

// One real epoch: shuffles the training set, splits it into mini-batches
// of (up to) batchSize, and for each batch runs forward + backward passes
// on every sample, averages the gradients, then applies one real weight
// update. Returns the actual mean training loss for the epoch.
function trainEpoch(net: NetWeights, opt: OptState, trainSamples: Sample[], batchSize: number, optimizer: string, lr: number, lossFn: string) {
  const idx = trainSamples.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const bs = Math.max(1, Math.min(batchSize, trainSamples.length));
  let totalLoss = 0;

  for (let start = 0; start < idx.length; start += bs) {
    const batchIdx = idx.slice(start, start + bs);
    const gradSum = zerosLikeNet(net);
    let batchLoss = 0;
    for (const bi of batchIdx) {
      const s = trainSamples[bi];
      const cache = forwardPass(s.x, net);
      const { loss, grads } = backwardSample(cache, net, s.y, lossFn);
      batchLoss += loss;
      accumulateGrads(gradSum, grads);
    }
    scaleGrads(gradSum, 1 / batchIdx.length);
    applyGradients(net, gradSum, opt, optimizer, lr);
    totalLoss += batchLoss;
  }
  return totalLoss / trainSamples.length;
}

// Real forward-pass evaluation (no gradient update) — used for both the
// held-out validation loss and the reported accuracy.
function evaluateSet(net: NetWeights, dataset: Sample[], lossFn: string) {
  let totalLoss = 0;
  let correct = 0;
  for (const s of dataset) {
    const cache = forwardPass(s.x, net);
    const { loss } = lossAndOutputGrad(cache.a3, s.y, lossFn);
    totalLoss += loss;
    const predIdx = cache.a3[0] >= cache.a3[1] ? 0 : 1;
    const trueIdx = s.y[0] >= s.y[1] ? 0 : 1;
    if (predIdx === trueIdx) correct++;
  }
  return { loss: dataset.length ? totalLoss / dataset.length : 0, accuracy: dataset.length ? (correct / dataset.length) * 100 : 0 };
}

/* ------------------------------------------------------------------ */
/*  Static content                                                      */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "builder", label: "Builder", icon: Share2 },
  { key: "train", label: "Train", icon: LineChartIcon },
  { key: "test", label: "Test", icon: CheckSquare },
  { key: "visualize", label: "Visualize", icon: BarChart3 },
  { key: "explain", label: "Explain", icon: Sparkles },
];

const COMPONENTS = [
  { label: "Input Layer", layerIndices: [0] },
  { label: "Dense Layer", layerIndices: [1, 2] },
  { label: "Activation", layerIndices: [1, 2, 3] },
  { label: "Dropout", layerIndices: [] },
  { label: "Output Layer", layerIndices: [3] },
];

const MAX_EPOCHS_DEFAULT = 1000;

const XOR_SAMPLES = [
  { x: [0, 0, 1, 0], y: [1, 0] },
  { x: [0, 1, 1, 0], y: [0, 1] },
  { x: [1, 0, 0, 1], y: [0, 1] },
  { x: [1, 1, 0, 1], y: [1, 0] },
  { x: [0, 0, 0, 1], y: [1, 0] },
  { x: [1, 1, 1, 0], y: [1, 0] },
  { x: [0, 1, 0, 1], y: [0, 1] },
  { x: [1, 0, 1, 0], y: [0, 1] },
];

/* ------------------------------------------------------------------ */
/*  Scoped stylesheet — every rule is namespaced under .nns-app so it   */
/*  cannot be overridden by (or leak into) an application's global.css  */
/* ------------------------------------------------------------------ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

@keyframes nns-scan {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(220%); }
}
@keyframes nns-fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nns-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.15; }
}
@keyframes nns-pulseDot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.5); }
  70% { box-shadow: 0 0 0 6px rgba(34,211,238,0); }
}
@keyframes nns-sweepIn {
  from { stroke-dashoffset: 12; }
  to { stroke-dashoffset: 0; }
}

.nns-app, .nns-app *, .nns-app *::before, .nns-app *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}
.nns-app {
  --blue-600:#0891B2; --blue-500:#22D3EE; --blue-400:#67E8F9;
  --purple-600:#7C3AED; --purple-500:#A855F7;
  --green-500:#16A34A; --green-400:#4ADE80;
  --rose-500:#F43F5E; --rose-400:#FB7185;
  --orange-500:#D97706; --orange-400:#F59E0B;
  --yellow-400:#F59E0B;
  --amber: #F59E0B;
  --cyan: #22D3EE;
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
  overflow-x: hidden;
}
.nns-app[data-theme="dark"] {
  --bg:#0A0D13; --panel-bg:rgba(16,21,31,0.86); --panel-border:rgba(103,232,249,0.14);
  --text-main:#EDF1F7; --text-muted:#7C8BA1; --text-soft:#C3CCDA;
  --input-bg:rgba(255,255,255,0.04); --hover-bg:rgba(103,232,249,0.08); --line:rgba(103,232,249,0.16);
  --grid-line: rgba(103,232,249,0.05);
  --card-shadow: 0 10px 30px rgba(0,0,0,0.45);
  --glow-bg: radial-gradient(ellipse 900px 420px at 50% -10%, rgba(34,211,238,0.14), transparent 65%);
}
.nns-app[data-theme="light"] {
  --bg:#EEF2F7; --panel-bg:rgba(255,255,255,0.86); --panel-border:rgba(15,23,42,0.08);
  --text-main:#111827; --text-muted:#64748B; --text-soft:#334155;
  --input-bg:#F5F8FB; --hover-bg:rgba(8,145,178,0.07); --line:rgba(15,23,42,0.08);
  --grid-line: rgba(15,23,42,0.045);
  --card-shadow: 0 10px 26px rgba(15,23,42,0.08);
  --glow-bg: radial-gradient(ellipse 900px 420px at 50% -10%, rgba(34,211,238,0.16), transparent 65%);
}
.nns-app { background: var(--bg); color: var(--text-main); }
.nns-app button { cursor: pointer; font-family: inherit; }
.nns-app select, .nns-app input, .nns-app button { font-family: inherit; font-size: inherit; color: inherit; }
.nns-app table { border-collapse: collapse; width: 100%; }
.nns-app svg text { font-family: inherit; }
.nns-app button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .nns-app *, .nns-app *::before, .nns-app *::after { animation: none !important; transition: none !important; }
}
.nns-mono { font-family: 'JetBrains Mono', 'Menlo', monospace; }

/* Signature background: faint graph-paper grid + single top glow, no floating blobs */
.nns-app::before {
  content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 34px 34px;
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 90%);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 90%);
}
.nns-app::after {
  content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: var(--glow-bg);
}

/* ---------- Header ---------- */
.nns-header { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:13px 20px; border-bottom:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); flex-wrap:wrap; position: relative; z-index: 5; }
.nns-header-left { display:flex; align-items:center; gap:12px; }
.nns-logo { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--cyan), var(--amber)); flex-shrink:0; position: relative; overflow: hidden; box-shadow: 0 0 0 1px rgba(103,232,249,0.3), 0 4px 14px rgba(34,211,238,0.25); }
.nns-logo svg { width:19px; height:19px; color:#08131A; position: relative; z-index: 1; }
.nns-title { font-weight:800; font-size:15px; line-height:1.2; letter-spacing:-0.01em;
 }
.nns-subtitle { font-family: 'JetBrains Mono', monospace; font-size:10.5px; color:var(--cyan); letter-spacing: 0.04em; text-transform: uppercase; font-weight: 600; }

.nns-nav { display:flex; align-items:center; gap:2px; border:1px solid var(--panel-border); background:var(--input-bg); border-radius:10px; padding:3px; flex-wrap:wrap; }
.nns-nav-btn { display:flex; align-items:center; gap:6px; border-radius:7px; padding:7px 13px; font-size:12.5px; font-weight:700; color:var(--text-muted); background:transparent; border:none; transition:all .15s ease; position: relative; }
.nns-nav-btn svg { width:14px; height:14px; }
.nns-nav-btn:hover { color:var(--text-main); background:var(--hover-bg); }
.nns-nav-btn.active { background: var(--input-bg); color:var(--cyan); box-shadow: inset 0 -2px 0 var(--cyan); }
.nns-help-btn { display:flex; align-items:center; justify-content:center; border-radius:7px; padding:7px 11px; color:var(--text-muted); background:transparent; border:none; transition: color .15s ease; }
.nns-help-btn svg { width:14px; height:14px; }
.nns-help-btn:hover { color:var(--amber); }

.nns-header-right { display:flex; align-items:center; gap:8px; position:relative; }
.nns-saved-btn { display:flex; align-items:center; gap:8px; border:1px solid var(--panel-border); border-radius:9px; padding:7px 13px; font-size:12.5px; font-weight:700; color:var(--text-muted); background:var(--input-bg); transition: all .15s ease; }
.nns-saved-btn svg { width:14px; height:14px; }
.nns-saved-btn:hover, .nns-saved-btn.open { color:var(--cyan); border-color: rgba(34,211,238,0.4); }
.nns-saved-badge { margin-left:2px; border-radius:4px; background:var(--amber); color:#1A1102; font-family: 'JetBrains Mono', monospace; font-size:10px; font-weight:800; padding:1px 6px; }

.nns-saved-panel { position:absolute; right:0; top:46px; z-index:30; width:280px; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius:12px; padding:12px; box-shadow: var(--card-shadow); animation: nns-fadeIn 0.2s ease both; border-top: 2px solid var(--cyan); }
.nns-saved-panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.nns-saved-panel-header p { font-size:13px; font-weight:800; text-transform: uppercase; letter-spacing: 0.03em; }
.nns-saved-panel-close { color:var(--text-muted); background:none; border:none; display:flex; }
.nns-saved-panel-close svg { width:16px; height:16px; }
.nns-saved-empty { font-size:12px; color:var(--text-muted); font-weight: 500; line-height: 1.5; }
.nns-saved-list { display:flex; flex-direction:column; gap:8px; }
.nns-saved-item { border:1px solid var(--panel-border); border-left: 2px solid var(--green-400); background:var(--input-bg); border-radius:8px; padding:9px 11px; font-size:12px; }
.nns-saved-item-row { display:flex; justify-content:space-between; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.nns-saved-item-acc { color:var(--green-400); }
.nns-saved-item-meta { margin-top:3px; color:var(--text-muted); font-weight: 500; }

.nns-icon-toggle { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid var(--panel-border); border-radius:9px; color:var(--text-muted); background:var(--input-bg); transition: all .15s ease; }
.nns-icon-toggle svg { width:15px; height:15px; }
.nns-icon-toggle:hover { color:var(--amber); border-color: rgba(245,158,11,0.4); }
.nns-avatar { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg, var(--purple-500), var(--rose-500)); color:#fff; display:flex; align-items:center; justify-content:center; font-family: 'JetBrains Mono', monospace; font-size:13px; font-weight:800; }

/* ---------- Layout ---------- */
.nns-builder { display:flex; gap:16px; padding:20px; flex-wrap:wrap; flex:1; position: relative; z-index: 1; }
.nns-sidebar { display:flex; flex-direction:column; gap:20px; width:100%; flex-shrink:0; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius:14px; padding:18px; box-shadow: var(--card-shadow); position: relative; overflow: hidden; }
.nns-sidebar::before, .nns-main .nns-panel::before, .nns-aside::before, .nns-hero::before, .nns-panel.nns-page-mid::before {
  content:""; position:absolute; top:0; left:0; right:0; height:2px;
  background: linear-gradient(90deg, var(--cyan), var(--amber) 60%, transparent);
}
.nns-main { display:flex; flex-direction:column; gap:16px; flex:1 1 480px; min-width:0; }
.nns-aside { display:flex; flex-direction:column; gap:16px; width:100%; flex-shrink:0; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius:14px; padding:18px; overflow-y:auto; box-shadow: var(--card-shadow); position: relative; }
@media (min-width:1280px) {
  .nns-builder { flex-wrap:nowrap; }
  .nns-sidebar { width:264px; }
  .nns-aside { width:328px; }
}

.nns-section-title { display:flex; align-items:center; gap:9px; }
.nns-section-badge { min-width:24px; height:20px; padding: 0 5px; border-radius:5px; border:1px solid var(--panel-border); background: var(--input-bg); color:var(--cyan); font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight: 700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.nns-section-badge::before { content: "\\00a7"; margin-right: 1px; opacity: 0.6; }
.nns-section-label { font-size:11.5px; font-weight:800; letter-spacing:0.07em; text-transform: uppercase; color:var(--text-soft); }

.nns-block-label { margin-bottom:8px; font-family: 'JetBrains Mono', monospace; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); }

/* ---------- Component list ---------- */
.nns-components { display:flex; flex-direction:column; gap:7px; }
.nns-component-btn { display:flex; align-items:center; gap:8px; border-radius:9px; padding:9px 12px; font-size:12.5px; font-weight: 600; border:1px solid var(--panel-border); background:var(--input-bg); transition:all .15s ease; text-align:left; width:100%; }
.nns-component-btn svg.nns-box-icon { width:15px; height:15px; color:var(--cyan); flex-shrink:0; }
.nns-component-btn:hover { border-color:rgba(34,211,238,0.45); background:rgba(34,211,238,0.06); }
.nns-component-btn.selected { border-color:var(--cyan); background:rgba(34,211,238,0.1); box-shadow: inset 2px 0 0 var(--cyan); }
.nns-component-check { margin-left:auto; width:14px; height:14px; color:var(--cyan); flex-shrink:0; }
.nns-hint { margin-top:8px; font-size:11px; color:var(--text-muted); font-weight: 500; line-height: 1.5; }

/* ---------- Settings ---------- */
.nns-settings { display:flex; flex-direction:column; gap:16px; }
.nns-slider-row { display:flex; align-items:center; justify-content:space-between; font-size:12.5px; margin-bottom:6px; }
.nns-slider-row span:first-child { color:var(--text-soft); font-weight: 700; }
.nns-slider-value { color:var(--cyan); font-family: 'JetBrains Mono', monospace; font-weight: 700; }
.nns-slider {
  -webkit-appearance:none; appearance:none;
  width:100%; height:4px; border-radius:999px; background:rgba(124,139,161,0.28);
  cursor:pointer; outline:none; display:block;
}
.nns-slider::-webkit-slider-thumb {
  -webkit-appearance:none; appearance:none;
  width:14px; height:14px; border-radius:3px; transform: rotate(45deg); background:var(--cyan); border:2px solid var(--bg); cursor:pointer;
  box-shadow: 0 0 8px rgba(34,211,238,0.6);
}
.nns-slider::-moz-range-thumb {
  width:14px; height:14px; border-radius:3px; transform: rotate(45deg); background:var(--cyan); border:2px solid var(--bg); cursor:pointer;
  box-shadow: 0 0 8px rgba(34,211,238,0.6);
}
.nns-slider::-moz-range-track { background:rgba(124,139,161,0.28); height:4px; border-radius:999px; }

.nns-select-label { margin-bottom:6px; font-family: 'JetBrains Mono', monospace; font-size:10px; text-transform: uppercase; letter-spacing: 0.06em; color:var(--text-muted); font-weight: 700; }
.nns-select-wrap { position:relative; border:1px solid var(--panel-border); background:var(--input-bg); border-radius:9px; }
.nns-select {
  -webkit-appearance:none; appearance:none;
  width:100%; background:transparent; border:none; outline:none;
  padding:9px 32px 9px 12px; font-size:12.5px; font-weight: 600; border-radius:9px; cursor:pointer;
}
.nns-select option { background:var(--input-bg); color:var(--text-main); }
.nns-select-chevron { position:absolute; right:10px; top:50%; transform:translateY(-50%); width:15px; height:15px; color:var(--text-muted); pointer-events:none; }

/* ---------- Buttons ---------- */
.nns-actions { display:flex; flex-direction:column; gap:8px; margin-top:auto; padding-top:8px; }
.nns-btn-primary { display:flex; align-items:center; justify-content:center; gap:8px; border-radius:9px; padding:11px; font-size:12.5px; font-weight:800; text-transform: uppercase; letter-spacing: 0.04em; color:#0B1520; background:linear-gradient(100deg, var(--cyan), var(--amber)); border:none; transition:all .15s ease; width:100%; position: relative; overflow: hidden; }
.nns-btn-primary::after { content:""; position:absolute; top:0; bottom:0; width:40%; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent); animation: nns-scan 2.8s linear infinite; }
.nns-btn-primary svg { width:15px; height:15px; position: relative; z-index: 1; }
.nns-btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
.nns-btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
.nns-btn-primary:disabled::after { animation: none; }
.nns-btn-secondary { display:flex; align-items:center; justify-content:center; gap:8px; border-radius:9px; padding:11px; font-size:12.5px; font-weight:700; border:1px solid var(--panel-border); background:var(--input-bg); color:var(--text-main); width:100%; transition: all .15s ease; }
.nns-btn-secondary svg { width:15px; height:15px; }
.nns-btn-secondary:hover { border-color: rgba(34,211,238,0.4); color: var(--cyan); }

/* ---------- Panels ---------- */
.nns-panel { border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius:14px; padding:18px; box-shadow: var(--card-shadow); position: relative; overflow: hidden; }
.nns-panel-header { display:flex; align-items:center; justify-content:space-between; padding-bottom:13px; flex-wrap:wrap; gap:8px; }
.nns-toolbar { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.nns-toolbar-btn { display:flex; align-items:center; gap:6px; font-size:12px; font-weight: 700; color:var(--text-muted); background:none; border:none; transition: color .15s ease; }
.nns-toolbar-btn svg { width:14px; height:14px; }
.nns-toolbar-btn:hover { color:var(--amber); }
.nns-zoom { display:flex; align-items:center; gap:0; border:1px solid var(--panel-border); border-radius:8px; overflow:hidden; background: var(--input-bg); }
.nns-zoom span { padding:0 8px; font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight: 700; color:var(--text-muted); }
.nns-zoom button { width:26px; height:26px; display:flex; align-items:center; justify-content:center; background:none; border:none; color:var(--text-main); }
.nns-zoom button svg { width:13px; height:13px; }
.nns-zoom button:hover { background:var(--hover-bg); color: var(--cyan); }
.nns-zoom-value { width:40px; text-align:center; font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight: 700; }
.nns-icon-danger { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid var(--panel-border); border-radius:9px; background:var(--input-bg); color:var(--text-muted); transition: all .15s ease; }
.nns-icon-danger svg { width:15px; height:15px; }
.nns-icon-danger:hover { color:var(--rose-500); border-color:rgba(244,63,94,0.4); background: rgba(244,63,94,0.06); }

.nns-canvas-wrap { width:100%; height:100%; overflow-x:auto; }
.nns-canvas-svg { display:block; margin:0 auto; width:100%; min-width:640px; }

.nns-legend { margin-top:14px; display:flex; flex-wrap:wrap; align-items:center; gap:18px; border:1px dashed var(--panel-border); background: var(--input-bg); border-radius:10px; padding:9px 15px; font-size:11.5px; font-weight: 600; color:var(--text-muted); }
.nns-legend strong { font-family: 'JetBrains Mono', monospace; font-weight:700; color:var(--text-main); text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.05em; }
.nns-legend-item { display:flex; align-items:center; gap:6px; }
.nns-legend-dot { width:8px; height:8px; border-radius:2px; flex-shrink:0; }
.nns-legend-line { width:16px; height:1px; background:var(--text-muted); }

/* ---------- Dashboard ---------- */
.nns-dashboard-row { margin-top:14px; display:flex; gap:16px; flex-wrap:wrap; }
.nns-chart-col { flex:1 1 280px; min-width:280px; }
.nns-chart-col-label { margin-bottom:8px; font-family: 'JetBrains Mono', monospace; font-size:10.5px; font-weight:700; text-transform: uppercase; letter-spacing: 0.05em; color:var(--text-muted); }
.nns-stats-grid { width:100%; flex-shrink:0; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
@media (min-width:1024px) { .nns-stats-grid { width:256px; } }

.nns-stat-card { border:1px solid var(--panel-border); border-left: 2px solid var(--cyan); background: var(--input-bg); border-radius:9px; padding:12px; transition: all .15s ease; }
.nns-stat-card:hover { border-left-color: var(--amber); }
.nns-stat-label { font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color:var(--text-muted); display:flex; align-items:center; gap:5px; }
.nns-stat-value { margin-top:5px; font-family: 'JetBrains Mono', monospace; font-size:19px; font-weight:700; }
.nns-stat-sub { margin-left:3px; font-size:12px; font-weight:600; opacity:0.7; }
.nns-c-blue { color:var(--blue-400); }
.nns-c-orange { color:var(--orange-400); }
.nns-c-green { color:var(--green-400); }
.nns-c-purple { color:var(--purple-500); }
.nns-c-rose { color:var(--rose-400); }

/* ---------- Chart ---------- */
.nns-chart-box { border:1px solid var(--panel-border); background: var(--input-bg); border-radius:10px; padding:13px; }
.nns-chart-box svg { width:100%; display:block; }
.nns-chart-legend { margin-top:6px; display:flex; align-items:center; gap:16px; font-size:11px; font-weight: 600; }
.nns-chart-legend-item { display:flex; align-items:center; gap:6px; }
.nns-chart-legend-swatch { width:14px; height:2px; display:inline-block; }

/* ---------- Table ---------- */
.nns-table-wrap { overflow:hidden; border:1px solid var(--panel-border); border-radius:10px; }
.nns-table { font-size:11.5px; text-align:left; }
.nns-table thead { background:var(--input-bg); }
.nns-table th { padding:9px 8px; font-family: 'JetBrains Mono', monospace; font-weight:700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.04em; color:var(--text-muted); border-bottom: 1px solid var(--panel-border); }
.nns-table td { padding:8px; font-weight: 600; border-top:1px solid var(--panel-border); }
.nns-table tbody tr:hover { background: var(--hover-bg); }
.nns-param-row { margin-top:10px; display:flex; align-items:center; justify-content:space-between; border:1px solid var(--panel-border); background:var(--input-bg); border-radius:10px; padding:9px 13px; font-size:12.5px; }
.nns-param-row span:first-child { color:var(--text-muted); font-weight: 700; }
.nns-param-row span:last-child { font-family: 'JetBrains Mono', monospace; font-weight:700; color: var(--cyan); }

/* ---------- Heatmap ---------- */
.nns-heatmap { display:flex; gap:8px; border:1px solid var(--panel-border); background: var(--input-bg); border-radius:10px; padding:13px; }
.nns-heatmap-labels { display:flex; flex-direction:column; justify-content:space-between; font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 600; color:var(--text-muted); }
.nns-heatmap-grid { display:grid; gap:2px; }
.nns-heatmap-cell { aspect-ratio:1/1; border-radius:2px; }
.nns-heatmap-collabels { margin-top:4px; display:grid; gap:2px; font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 600; color:var(--text-muted); }
.nns-heatmap-collabels span { text-align:center; }
.nns-heatmap-scale { display:flex; flex-direction:column; justify-content:space-between; font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 600; color:var(--text-muted); }

/* ---------- Output preview ---------- */
.nns-output { display:flex; flex-direction:column; gap:9px; border:1px solid var(--panel-border); background: var(--input-bg); border-radius:10px; padding:13px; }
.nns-output-row { display:flex; align-items:center; gap:12px; font-family: 'JetBrains Mono', monospace; font-size:12px; font-weight: 700; }
.nns-output-label { width:16px; color:var(--text-muted); }
.nns-output-track { height:8px; flex:1; overflow:hidden; border-radius:3px; background:rgba(124,139,161,0.2); }
.nns-output-fill { height:100%; border-radius:3px; transition: width .4s ease; }
.nns-output-val { width:40px; text-align:right; font-variant-numeric:tabular-nums; }

/* ---------- Data panel ---------- */
.nns-divider { border-top:1px dashed var(--panel-border); padding-top:18px; margin-top:4px; }
.nns-data-tabs { margin-top:10px; display:flex; border:1px solid var(--panel-border); background:var(--input-bg); border-radius:9px; padding:3px; font-size:11.5px; }
.nns-data-tab { flex:1; border-radius:6px; padding:7px 0; font-weight: 700; background:none; border:none; color:var(--text-muted); transition:all .15s ease; }
.nns-data-tab.active { background: var(--cyan); color:#08131A; }
.nns-data-content { margin-top:10px; border:1px solid var(--panel-border); background: var(--input-bg); border-radius:9px; padding:10px 13px; font-size:11.5px; font-weight: 600; }
.nns-data-content-row { display:flex; align-items:center; justify-content:space-between; }
.nns-data-muted { color:var(--text-muted); font-weight: 700; }
.nns-data-accent { color:var(--cyan); font-weight: 700; }
.nns-data-chip-row { display:flex; gap:8px; margin-top:6px; }
.nns-data-chip { font-family: 'JetBrains Mono', monospace; border:1px solid var(--panel-border); background:var(--panel-bg); border-radius:6px; padding:5px 9px; font-weight: 700; }
.nns-data-btn { margin-top:10px; display:flex; width:100%; align-items:center; justify-content:center; gap:8px; border:1px solid var(--panel-border); border-radius:9px; padding:9px 0; font-size:12px; font-weight: 700; background:var(--input-bg); color:var(--text-main); transition: all .15s ease; }
.nns-data-btn svg { width:15px; height:15px; }
.nns-data-btn:hover { border-color: rgba(34,211,238,0.4); color: var(--cyan); }

/* ---------- Simple tab pages ---------- */
.nns-page { display:flex; flex-direction:column; gap:16px; padding:20px; flex:1; position: relative; z-index: 1; }
.nns-page-mid { max-width:768px; }
.nns-explain-text { margin-top:14px; display:flex; flex-direction:column; gap:14px; font-size:13.5px; font-weight: 500; line-height: 1.7; color:var(--text-soft); }

/* ---------- Home ---------- */
.nns-hero { border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius:16px; padding:26px 24px; box-shadow: var(--card-shadow); position: relative; overflow: hidden; }
.nns-hero h1 { font-size:23px; font-weight:800; letter-spacing: -0.01em; }
.nns-hero-sub { margin-top:8px; font-size:13.5px; font-weight: 500; line-height: 1.6; color:var(--text-muted); max-width: 520px; }
.nns-hero-stats { margin-top:20px; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
@media (min-width:640px) { .nns-hero-stats { grid-template-columns:repeat(4,1fr); } }
.nns-hero-actions { margin-top:22px; display:flex; flex-wrap:wrap; gap:10px; }
.nns-hero-btn-primary { border-radius:9px; padding:11px 18px; font-size:12.5px; font-weight:800; text-transform: uppercase; letter-spacing: 0.03em; color:#0B1520; background:linear-gradient(100deg, var(--cyan), var(--amber)); border:none; transition: all .15s ease; }
.nns-hero-btn-primary:hover { filter: brightness(1.08); }
.nns-hero-btn-secondary { border-radius:9px; padding:11px 18px; font-size:12.5px; font-weight: 700; border:1px solid var(--panel-border); background:var(--input-bg); color:var(--text-main); transition: all .15s ease; }
.nns-hero-btn-secondary:hover { border-color: rgba(34,211,238,0.4); color: var(--cyan); }

/* ---------- Test tab ---------- */
.nns-test-bits { margin-top:14px; display:flex; gap:10px; }
.nns-bit-btn { width:46px; height:46px; display:flex; align-items:center; justify-content:center; border-radius:9px; border:1px solid var(--panel-border); background:var(--input-bg); color:var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size:17px; font-weight:700; transition: all .15s ease; }
.nns-bit-btn.active { border-color:var(--cyan); background:rgba(34,211,238,0.12); color:var(--cyan); }
.nns-test-result { margin-top:18px; border:1px solid var(--panel-border); border-left: 2px solid var(--green-400); background: var(--input-bg); border-radius:10px; padding:13px; font-size:13px; animation: nns-fadeIn 0.25s ease both; }
.nns-test-result-value { margin-top:6px; font-family: 'JetBrains Mono', monospace; font-size:17px; font-weight:700; color:var(--cyan); }
.nns-test-hint { margin-top:18px; font-size:12.5px; font-weight: 600; color:var(--text-muted); line-height: 1.6; }

/* ---------- Modal ---------- */
.nns-modal-overlay { position:fixed; inset:0; z-index:40; display:flex; align-items:center; justify-content:center; background:rgba(6,9,15,0.65); backdrop-filter: blur(4px); padding:16px; }
.nns-modal { width:100%; max-width:560px; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius:14px; padding:18px; box-shadow: var(--card-shadow); animation: nns-fadeIn 0.2s ease both; border-top: 2px solid var(--amber); }
.nns-modal-header { margin-bottom:13px; display:flex; align-items:center; justify-content:space-between; }
.nns-modal-header p { font-weight:800; font-size: 13px; font-family: 'JetBrains Mono', monospace; }
.nns-modal-close { color:var(--text-muted); background:none; border:none; display:flex; }
.nns-modal-close svg { width:16px; height:16px; }
.nns-modal-table-wrap { max-height:288px; overflow-y:auto; border:1px solid var(--panel-border); border-radius:10px; }
.nns-modal-foot { margin-top:13px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.nns-modal-foot-note { font-size:11.5px; color:var(--text-muted); font-weight:500; line-height:1.5; max-width:340px; }
.nns-modal-body-text { display:flex; flex-direction:column; gap:12px; font-size:13px; font-weight:500; line-height:1.65; color:var(--text-soft); }
.nns-modal-body-text strong { color:var(--text-main); }
.nns-shortcut-row { display:flex; align-items:center; justify-content:space-between; padding:8px 2px; border-top:1px solid var(--panel-border); font-size:12.5px; }
.nns-shortcut-row:first-child { border-top:none; }
.nns-kbd { font-family:'JetBrains Mono', monospace; font-size:11px; font-weight:700; background:var(--input-bg); border:1px solid var(--panel-border); border-radius:5px; padding:3px 7px; color:var(--cyan); }
.nns-editable-label { background:none; border:none; padding:2px 6px; margin:-2px -6px; border-radius:5px; font:inherit; color:inherit; text-decoration:underline dotted; text-underline-offset:2px; cursor:pointer; }
.nns-editable-label:hover { color:var(--cyan); background:var(--hover-bg); }

/* ---------- Toast ---------- */
.nns-toast { position:fixed; bottom:52px; left:50%; transform:translateX(-50%); z-index:50; border-radius:8px; background:#0A0D13; color:var(--cyan); font-family: 'JetBrains Mono', monospace; padding:9px 16px 9px 14px; font-size:12.5px; font-weight: 600; box-shadow:0 10px 28px rgba(0,0,0,0.4); border:1px solid rgba(34,211,238,0.35); animation: nns-fadeIn 0.2s ease both; max-width: calc(100vw - 32px); text-align: left; }
.nns-toast::before { content: "\\203a"; color: var(--amber); margin-right: 8px; font-weight: 800; animation: nns-blink 1.1s step-start infinite; }

/* ---------- Footer ---------- */
.nns-footer { display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding:9px 20px; font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight: 600; color:var(--text-muted); position:relative; z-index: 5; }
.nns-footer-status { display:flex; align-items:center; gap:8px; text-transform: uppercase; letter-spacing: 0.04em; }
.nns-status-dot { width:7px; height:7px; border-radius:2px; background:var(--green-500); animation: nns-pulseDot 1.8s ease-in-out infinite; }
.nns-status-dot.training { background:var(--amber); }
.nns-footer-center { display:none; text-transform: uppercase; letter-spacing: 0.04em; }
@media (min-width:640px) { .nns-footer-center { display:block; } }
.nns-footer-actions { display:flex; align-items:center; gap:14px; position:relative; }
.nns-footer-actions button { background:none; border:none; color:inherit; display:flex; transition: color .15s ease; }
.nns-footer-actions button svg { width:15px; height:15px; }
.nns-footer-actions button:hover { color:var(--cyan); }
.nns-more-menu { position:absolute; bottom:34px; right:0; z-index:30; width:190px; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius:10px; padding:5px; box-shadow: var(--card-shadow); animation: nns-fadeIn 0.2s ease both; }
.nns-more-menu button { width:100%; text-align:left; border-radius:7px; padding:8px 11px; font-size:11.5px; font-weight: 700; background:none; border:none; color:var(--text-main); display:flex; align-items:center; gap:8px; }
.nns-more-menu button svg { width:13px; height:13px; flex-shrink:0; }
.nns-more-menu button:hover { background:var(--hover-bg); color: var(--cyan); }

/* ---------- Info tooltips ---------- */
.nns-tip-icon { display:inline-flex; align-items:center; justify-content:center; width:14px; height:14px; border:none; background:none; padding:0; color:var(--text-muted); cursor:help; flex-shrink:0; transition: color .15s ease; }
.nns-tip-icon svg { width:100%; height:100%; }
.nns-tip-icon:hover, .nns-tip-icon:focus-visible { color:var(--cyan); }
.nns-tip-bubble {
  position: fixed;
  transform: translate(-50%, calc(-100% - 11px));
  background:#0A0D13; color:#E7ECF3; border:1px solid rgba(34,211,238,0.4);
  border-radius:8px; padding:9px 12px; font-size:11.5px; font-weight:500; line-height:1.55;
  box-shadow:0 12px 30px rgba(0,0,0,0.45);
  z-index:100; pointer-events:none;
  animation: nns-fadeIn 0.12s ease both;
}
.nns-tip-bubble::after {
  content:""; position:absolute; top:100%; left:50%; transform:translateX(-50%);
  border:6px solid transparent; border-top-color:#0A0D13;
}
`;

/* ------------------------------------------------------------------ */
/*  Info tooltip — hover or focus reveals a short explanation. Rendered */
/*  via a portal so it is never clipped by a scrolling/overflow parent. */
/* ------------------------------------------------------------------ */

function Tip({ text, width = 230 }: { text: string; width?: number }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLButtonElement | null>(null);

  function open() {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.top, left: rect.left + rect.width / 2 });
    setShow(true);
  }
  function close() {
    setShow(false);
  }

  return (
    <>
      <button
        type="button"
        ref={ref}
        className="nns-tip-icon"
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onClick={(e) => e.preventDefault()}
        aria-label={text}
      >
        <HelpCircle />
      </button>
      {show && (
        <div className="nns-tip-bubble" style={{ top: pos.top, left: pos.left, width }} role="tooltip">
          {text}
        </div>
      )}
    </>
  );
}

function SectionTitle({ badge, label, tip }: { badge: string | number; label: string; tip?: string }) {
  return (
    <div className="nns-section-title">
      <span className="nns-section-badge">{badge}</span>
      <span className="nns-section-label">{label}</span>
      {tip && <Tip text={tip} />}
    </div>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("builder");
  const [dark, setDark] = useState(true);

  const [learningRate, setLearningRate] = useState(0.01);
  const [epochsTarget, setEpochsTarget] = useState(MAX_EPOCHS_DEFAULT);
  const [batchSize, setBatchSize] = useState(32);
  const [lossFn, setLossFn] = useState("Mean Squared Error");
  const [optimizer, setOptimizer] = useState("Adam");
  const [zoom, setZoom] = useState(100);

  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [trainHistory, setTrainHistory] = useState<number[]>([]);
  const [valHistory, setValHistory] = useState<number[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const networkSvgRef = useRef<SVGSVGElement | null>(null);

  // The actual live weights/biases being trained, and the optimizer's
  // running moment estimates. Refs so updates during the training loop
  // don't force extra re-renders — the epoch/history state below does
  // that on the cadence we want, and reads of `.current` always see the
  // latest real values.
  const networkRef = useRef<NetWeights | null>(null);
  if (networkRef.current === null) networkRef.current = initNetwork();
  const optStateRef = useRef<OptState | null>(null);
  if (optStateRef.current === null) optStateRef.current = createOptState(networkRef.current);

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [savedModels, setSavedModels] = useState<{
    id: number;
    epoch: number;
    accuracy: string;
    trainLoss: string;
    optimizer: string;
    learningRate: number;
  }[]>([]);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [dataTab, setDataTab] = useState("Dataset");
  const [showDataModal, setShowDataModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(true);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [toast, setToast] = useState<React.ReactNode | null>(null);
  const [testInputs, setTestInputs] = useState([0, 1, 0, 1]);
  const [samples, setSamples] = useState(XOR_SAMPLES);

  const trainLoss = trainHistory.length ? trainHistory[trainHistory.length - 1] : 1;
  const valLoss = valHistory.length ? valHistory[valHistory.length - 1] : 1;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Keyboard shortcuts: Space = train, R = reset, S = save snapshot.
  // Ignored while typing into an input/select so it never hijacks normal typing.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (["INPUT", "SELECT", "TEXTAREA"].includes(tag)) return;
      if (e.code === "Space") {
        e.preventDefault();
        startTraining();
      } else if (e.key.toLowerCase() === "r") {
        resetNetwork();
      } else if (e.key.toLowerCase() === "s") {
        handleSaveModel();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function showToast(msg: React.ReactNode) {
    setToast(msg);
  }

  // Runs REAL training: real weight init, real mini-batch forward/backward
  // passes, and real optimizer updates each epoch. The interval just paces
  // how many actual epochs run per animation frame so the curve is visible
  // as it happens, rather than being computed instantly.
  function startTraining() {
    if (isTraining) return;
    setIsTraining(true);
    setEpoch(0);
    setTrainHistory([]);
    setValHistory([]);
    setAccuracy(0);

    // Fresh random weights + optimizer state for every run, exactly like
    // starting a real training job from scratch.
    networkRef.current = initNetwork();
    optStateRef.current = createOptState(networkRef.current);

    // Real train/validation split: the network only ever learns from
    // trainSet; valSet is genuinely held out and only ever evaluated.
    const trainSet = samples.length > 2 ? samples.slice(0, samples.length - 2) : samples;
    const valSet = samples.length > 2 ? samples.slice(samples.length - 2) : samples;

    const stepEvery = Math.max(1, Math.floor(epochsTarget / 200));
    let e = 0;

    intervalRef.current = setInterval(() => {
      const net = networkRef.current!;
      const opt = optStateRef.current!;
      let lastTrainLoss = 0;

      for (let k = 0; k < stepEvery && e < epochsTarget; k++) {
        lastTrainLoss = trainEpoch(net, opt, trainSet, batchSize, optimizer, learningRate, lossFn);
        e++;
      }

      const { loss: vLoss } = evaluateSet(net, valSet, lossFn);
      const { accuracy: trainAcc } = evaluateSet(net, trainSet, lossFn);

      setEpoch(e);
      setTrainHistory((h) => [...h, lastTrainLoss]);
      setValHistory((h) => [...h, vLoss]);
      setAccuracy(trainAcc);

      if (e >= epochsTarget) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTraining(false);
        showToast("Training complete");
      }
    }, 45);
  }

  function resetNetwork() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTraining(false);
    setEpoch(0);
    setTrainHistory([]);
    setValHistory([]);
    setAccuracy(0);
    networkRef.current = initNetwork();
    optStateRef.current = createOptState(networkRef.current);
    showToast("Network reset — weights reinitialized");
  }

  function handleComponentClick(comp: { label: string; layerIndices: number[] }) {
    setSelectedComponent((cur) => (cur === comp.label ? null : comp.label));
    if (comp.layerIndices.length === 0) {
      showToast(`${comp.label} isn't part of this fixed demo architecture yet`);
    } else {
      showToast(`Highlighting ${comp.label} in the diagram`);
    }
  }

  function handleSaveModel() {
    if (epoch === 0) {
      showToast("Nothing to save yet — train the network first");
      return;
    }
    const snapshot = {
      id: Date.now(),
      epoch,
      accuracy: accuracy.toFixed(1),
      trainLoss: trainLoss.toFixed(4),
      optimizer,
      learningRate,
    };
    setSavedModels((list) => [snapshot, ...list].slice(0, 8));
    showToast("Model snapshot saved");
    setShowSavedPanel(true);
  }

  // Serializes the live network diagram SVG to a real PNG file and
  // downloads it, so the camera button produces an actual image.
  function handleScreenshot() {
    const svgEl = networkSvgRef.current;
    if (!svgEl) {
      showToast("Nothing to capture yet");
      return;
    }
    try {
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", String(VIEW_W));
      clone.setAttribute("height", String(VIEW_H));
      const svgString = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = VIEW_W * 2;
        canvas.height = VIEW_H * 2;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = dark ? "#0A0D13" : "#EEF2F7";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0, VIEW_W, VIEW_H);
        }
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `network-diagram-epoch-${epoch}.png`;
          link.click();
          URL.revokeObjectURL(link.href);
        });
      };
      img.src = url;
      showToast("Diagram exported as PNG");
    } catch {
      showToast("Couldn't export the diagram in this browser");
    }
  }

  function handleAutoLayout() {
    setZoom(100);
    showToast("Layout auto-arranged");
  }

  // Downloads the current hyperparameters (and last run's results, if any)
  // as a JSON file, so "Export config" is a real, working export.
  function handleExportConfig() {
    const config = {
      learningRate,
      epochsTarget,
      batchSize,
      lossFunction: lossFn,
      optimizer,
      layers: LAYERS.map((l) => ({ name: l.name, type: l.type, units: l.units, activation: l.activation })),
      lastRun:
        epoch > 0
          ? { epoch, accuracy: Number(accuracy.toFixed(2)), trainLoss: Number(trainLoss.toFixed(4)), valLoss: Number(valLoss.toFixed(4)) }
          : null,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "network-config.json";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Config exported as JSON");
  }

  // Flips a sample's label in the reference dataset table. Since training
  // reads directly from `samples`, this genuinely changes what the network
  // trains and validates on the next time you press Run / Train.
  function toggleSampleLabel(idx: number) {
    setSamples((arr) => arr.map((s, i) => (i === idx ? { ...s, y: (s.y[0] === 1 ? [0, 1] : [1, 0]) as number[] } : s)));
    showToast("Label updated — retrain to apply it");
  }

  function resetSamples() {
    setSamples(XOR_SAMPLES);
    showToast("Dataset reset to defaults");
  }

  const highlightIndices = selectedComponent
    ? COMPONENTS.find((c) => c.label === selectedComponent)?.layerIndices ?? []
    : [];

  return (
    <div className="nns-app" data-theme={dark ? "dark" : "light"}>
      <style>{STYLES}</style>

      {/* ---------------------------------------------------------- Header */}
      <header className="nns-header">
        <div className="nns-header-left">
          <div className="nns-logo">
            <Brain />
          </div>
          <div>
            <p className="nns-title">Deep Neural Network Simulation Lab</p>
            <p className="nns-subtitle">Feed Forward Neural Network</p>
          </div>
        </div>

        <nav className="nns-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`nns-nav-btn${activeTab === key ? " active" : ""}`}
            >
              <Icon />
              {label}
            </button>
          ))}
          <button type="button" onClick={() => setShowAboutModal(true)} className="nns-help-btn" title="What is this?">
            <HelpCircle />
          </button>
        </nav>

        <div className="nns-header-right">
          <button
            type="button"
            onClick={() => setShowSavedPanel((v) => !v)}
            className={`nns-saved-btn${showSavedPanel ? " open" : ""}`}
          >
            <Folder />
            Saved Models
            {savedModels.length > 0 && <span className="nns-saved-badge">{savedModels.length}</span>}
          </button>

          {showSavedPanel && (
            <div className="nns-saved-panel">
              <div className="nns-saved-panel-header">
                <p>Saved Models</p>
                <button type="button" onClick={() => setShowSavedPanel(false)} className="nns-saved-panel-close">
                  <X />
                </button>
              </div>
              {savedModels.length === 0 ? (
                <p className="nns-saved-empty">
                  No models saved yet. Train the network, then hit the save icon in the footer.
                </p>
              ) : (
                <div className="nns-saved-list">
                  {savedModels.map((m) => (
                    <div key={m.id} className="nns-saved-item">
                      <div className="nns-saved-item-row">
                        <span>Epoch {m.epoch}</span>
                        <span className="nns-saved-item-acc">{m.accuracy}% acc</span>
                      </div>
                      <div className="nns-saved-item-meta">
                        {m.optimizer} · lr {m.learningRate} · loss {m.trainLoss}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button type="button" onClick={() => setDark((d) => !d)} className="nns-icon-toggle">
            {dark ? <Sun /> : <Moon />}
          </button>
          <div className="nns-avatar">S</div>
        </div>
      </header>

      {activeTab === "builder" && (
        <div className="nns-builder">
          {/* -------------------------------------------------- Left sidebar */}
          <aside className="nns-sidebar">
            <SectionTitle
              badge="1"
              label="BUILD NETWORK"
              tip="Pick a component to see where it lives in the architecture diagram. This lab uses one fixed architecture, so this is for exploring — it doesn't add real layers."
            />

            <div>
              <p className="nns-block-label">Add Components</p>
              <div className="nns-components">
                {COMPONENTS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => handleComponentClick(c)}
                    className={`nns-component-btn${selectedComponent === c.label ? " selected" : ""}`}
                  >
                    <Boxes className="nns-box-icon" />
                    {c.label}
                    {selectedComponent === c.label && <Check className="nns-component-check" />}
                  </button>
                ))}
              </div>
              <p className="nns-hint">
                This demo uses a fixed architecture — selecting a component highlights it in the diagram.
              </p>
            </div>

            <div className="nns-settings">
              <p className="nns-block-label">Network Settings</p>

              <SliderField
                label="Learning Rate"
                value={learningRate}
                display={learningRate.toFixed(3)}
                min={0.001}
                max={0.5}
                step={0.001}
                onChange={setLearningRate}
                tip="How big a step the optimizer takes each update. Too high and training bounces around; too low and it crawls. Here it also speeds up or slows down the loss curve."
              />
              <SliderField
                label="Epochs"
                value={epochsTarget}
                display={String(epochsTarget)}
                min={100}
                max={2000}
                step={50}
                onChange={(v: number) => setEpochsTarget(Math.round(v))}
                tip="One epoch = one full pass through the training data. More epochs give the network more chances to improve, up to a point."
              />
              <SliderField
                label="Batch Size"
                value={batchSize}
                display={String(batchSize)}
                min={4}
                max={256}
                step={4}
                onChange={(v: number) => setBatchSize(Math.round(v))}
                tip="How many samples are processed before the network updates its weights once. Smaller batches update more often but more noisily."
              />

              <SelectField
                label="Loss Function"
                value={lossFn}
                onChange={setLossFn}
                options={["Mean Squared Error", "Cross Entropy", "Mean Absolute Error"]}
                tip="The formula used to score how wrong a prediction is. Training tries to make this number as small as possible."
              />
              <SelectField
                label="Optimizer"
                value={optimizer}
                onChange={setOptimizer}
                options={["Adam", "SGD", "RMSprop"]}
                tip="The algorithm that decides how to adjust every weight after each batch, based on the loss."
              />
            </div>

            <div className="nns-actions">
              <button type="button" onClick={startTraining} disabled={isTraining} className="nns-btn-primary">
                <Play />
                {isTraining ? "Training…" : "Run / Train"}
              </button>
              <button type="button" onClick={resetNetwork} className="nns-btn-secondary">
                <RotateCcw />
                Reset Network
              </button>
            </div>
          </aside>

          {/* -------------------------------------------------- Center column */}
          <main className="nns-main">
            <section className="nns-panel">
              <div className="nns-panel-header">
                <SectionTitle
                  badge="2"
                  label="NETWORK ARCHITECTURE"
                  tip="Circles are neurons, grouped into layers. Lines are weighted connections carrying values forward from one layer to the next — this is the 'feed-forward' part."
                />
                <div className="nns-toolbar">
                  <button type="button" onClick={handleAutoLayout} className="nns-toolbar-btn">
                    <Wand2 />
                    Auto Layout
                  </button>
                  <div className="nns-zoom">
                    <span>Zoom</span>
                    <button type="button" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
                      <Minus />
                    </button>
                    <span className="nns-zoom-value">{zoom}%</span>
                    <button type="button" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
                      <Plus />
                    </button>
                  </div>
                  <button type="button" onClick={resetNetwork} className="nns-icon-danger">
                    <Trash2 />
                  </button>
                </div>
              </div>

              <NetworkCanvas dark={dark} zoom={zoom} highlightIndices={highlightIndices as number[]} svgRef={networkSvgRef} />
              <Legend />
            </section>

            <section className="nns-panel">
              <SectionTitle
                badge="4"
                label="TRAINING DASHBOARD"
                tip="Live numbers from the current training run. Hover any card below for what that specific number means."
              />
              <div className="nns-dashboard-row">
                <div className="nns-chart-col">
                  <p className="nns-chart-col-label">Training Progress</p>
                  <LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} />
                </div>
                <div className="nns-stats-grid">
                  <StatCard
                    label="Epoch"
                    value={`${epoch}`}
                    sub={`/ ${epochsTarget}`}
                    colorClass="nns-c-blue"
                    tip="How many full passes through the training data have finished, out of the total you set with the Epochs slider."
                  />
                  <StatCard
                    label="Loss (Train)"
                    value={trainLoss.toFixed(4)}
                    colorClass="nns-c-blue"
                    tip="How wrong the network's predictions are on the data it's training on. Lower is better; it should trend down as training runs."
                  />
                  <StatCard
                    label="Loss (Val)"
                    value={valLoss.toFixed(4)}
                    colorClass="nns-c-orange"
                    tip="Loss measured on held-out data the network isn't training on. If this stays much higher than training loss, the network may be overfitting."
                  />
                  <StatCard
                    label="Accuracy"
                    value={`${accuracy.toFixed(1)}`}
                    sub="%"
                    colorClass="nns-c-green"
                    tip="The share of predictions that match the correct label. Rises as loss falls, but isn't a perfect mirror of it."
                  />
                </div>
              </div>
            </section>
          </main>

          {/* -------------------------------------------------- Right panel */}
          <aside className="nns-aside">
            <SectionTitle
              badge="3"
              label="INFORMATION PANEL"
              tip="A closer look inside the network: its layer sizes, a snapshot of neuron activity, and what it's currently predicting."
            />

            <div>
              <p className="nns-chart-col-label">Layer Summary</p>
              <div className="nns-table-wrap">
                <table className="nns-table">
                  <thead>
                    <tr>
                      <th>Layer</th>
                      <th>Type</th>
                      <th>Units</th>
                      <th>Activation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LAYERS.map((l) => (
                      <tr key={l.name}>
                        <td>{l.name}</td>
                        <td>{l.type}</td>
                        <td>{l.units}</td>
                        <td>{l.activation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="nns-param-row">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  Parameter Count
                  <Tip text="Total trainable weights and biases across every connection in the network — how much the optimizer actually has to adjust." width={210} />
                </span>
                <span>{paramCount()}</span>
              </div>
            </div>

            <div>
              <p className="nns-chart-col-label" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                Activation Preview (Hidden Layer 1)
                <Tip text="A snapshot of how strongly each neuron in Hidden Layer 1 is firing for a sample batch, shown across training steps. Blue/dim = low activation, bright = high." width={230} />
              </p>
              <ActivationHeatmap net={networkRef.current} samples={samples} />
            </div>

            <div>
              <p className="nns-chart-col-label" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                Output Preview
                <Tip text="The network's current confidence for each of the 2 output classes. These two values always add up to about 1, like a probability split." width={220} />
              </p>
              <OutputPreview net={networkRef.current} input={testInputs} />
            </div>

            <div className="nns-divider">
              <SectionTitle
                badge="5"
                label="DATA PANEL"
                tip="The XOR dataset this lab trains on. XOR is a classic teaching example because a single-layer network can't solve it — you need at least one hidden layer, which is exactly what this network has."
              />
              <div className="nns-data-tabs">
                {["Dataset", "Input Sample", "Output"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDataTab(t)}
                    className={`nns-data-tab${dataTab === t ? " active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {dataTab === "Dataset" && (
                <div className="nns-data-content nns-data-content-row">
                  <div>
                    <p className="nns-data-muted">Dataset</p>
                    <p className="nns-data-accent">Custom XOR Dataset</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="nns-data-muted">Samples</p>
                    <p>{samples.length}</p>
                  </div>
                </div>
              )}

              {dataTab === "Input Sample" && (
                <div className="nns-data-content">
                  <p className="nns-data-muted" style={{ marginBottom: 4 }}>
                    First sample, x&#8321;–x&#8324;
                  </p>
                  <div className="nns-data-chip-row">
                    {samples[0].x.map((v, i) => (
                      <span key={i} className="nns-data-chip">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {dataTab === "Output" && (
                <div className="nns-data-content">
                  <p className="nns-data-muted">Class balance across all samples</p>
                  <p style={{ marginTop: 4 }}>
                    Class 1: {samples.filter((s) => s.y[0] === 1).length} · Class 2:{" "}
                    {samples.filter((s) => s.y[1] === 1).length}
                  </p>
                </div>
              )}

              <button type="button" onClick={() => setShowDataModal(true)} className="nns-data-btn">
                <Table2 />
                View / Edit Data
              </button>
            </div>
          </aside>
        </div>
      )}

      {activeTab === "home" && <HomeTab onGo={setActiveTab} epoch={epoch} accuracy={accuracy} />}

      {activeTab === "train" && (
        <div className="nns-page">
          <section className="nns-panel">
            <SectionTitle badge="1" label="TRAIN" tip="Runs the same real training loop as the Builder tab, focused just on the loss curve and headline numbers." />
            <div className="nns-dashboard-row">
              <div className="nns-chart-col">
                <LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} />
              </div>
              <div className="nns-stats-grid">
                <StatCard label="Epoch" value={`${epoch}`} sub={`/ ${epochsTarget}`} colorClass="nns-c-blue" tip="Full passes through the training data completed so far." />
                <StatCard label="Accuracy" value={`${accuracy.toFixed(1)}`} sub="%" colorClass="nns-c-green" tip="Share of predictions currently matching the correct label." />
              </div>
            </div>
            <button
              type="button"
              onClick={startTraining}
              disabled={isTraining}
              className="nns-btn-primary"
              style={{ marginTop: 16, width: "fit-content", padding: "10px 16px" }}
            >
              <Play />
              {isTraining ? "Training…" : "Run / Train"}
            </button>
          </section>
        </div>
      )}

      {activeTab === "test" && (
        <TestTab testInputs={testInputs} setTestInputs={setTestInputs} trained={epoch > 0} net={networkRef.current} />
      )}

      {activeTab === "visualize" && (
        <div className="nns-page">
          <section className="nns-panel">
            <SectionTitle badge="1" label="ACTIVATIONS" tip="Same activation snapshot as the Builder tab's Information Panel, just given more room to breathe." />
            <div style={{ marginTop: 12, maxWidth: 420 }}>
              <ActivationHeatmap net={networkRef.current} samples={samples} />
            </div>
          </section>
          <section className="nns-panel">
            <SectionTitle badge="2" label="LOSS CURVE" tip="Training loss (blue) and validation loss (orange) over time. A widening gap between them is the classic sign of overfitting." />
            <div style={{ marginTop: 12 }}>
              <LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} />
            </div>
          </section>
        </div>
      )}

      {activeTab === "explain" && (
        <div className="nns-page">
          <section className="nns-panel nns-page-mid">
            <SectionTitle badge="1" label="HOW THIS NETWORK WORKS" />
            <div className="nns-explain-text">
              <p>
                Data enters through the <span className="nns-c-green">input layer</span> (4 units), passes
                through two <span className="nns-c-blue">hidden layers</span> using ReLU activation, and produces
                a 2-way prediction from the <span className="nns-c-rose">output layer</span> via softmax.
              </p>
              <p>
                During training, the {optimizer} optimizer adjusts all {paramCount()} weights and biases to
                minimize {lossFn}, at a learning rate of {learningRate.toFixed(3)}.
              </p>
              <p>Switch to the Builder tab to change these settings and watch the loss curve respond.</p>
              <p>
                Curious about the bigger picture — what this lab actually does and why it uses an XOR
                dataset? Click the <HelpCircle style={{ width: 13, height: 13, display: "inline", verticalAlign: -2 }} /> icon
                in the top nav any time.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* ---------------------------------------------------------- Data modal */}
      {showDataModal && (
        <div className="nns-modal-overlay" onClick={() => setShowDataModal(false)}>
          <div className="nns-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nns-modal-header">
              <p>XOR Dataset — {samples.length} samples</p>
              <button type="button" onClick={() => setShowDataModal(false)} className="nns-modal-close">
                <X />
              </button>
            </div>
            <div className="nns-modal-table-wrap">
              <table className="nns-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>x1</th>
                    <th>x2</th>
                    <th>x3</th>
                    <th>x4</th>
                    <th>Label</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map((s, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      {s.x.map((v, j) => (
                        <td key={j}>{v}</td>
                      ))}
                      <td>
                        <button type="button" className="nns-editable-label" onClick={() => toggleSampleLabel(i)}>
                          {s.y[0] === 1 ? "Class 1" : "Class 2"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="nns-modal-foot">
              <p className="nns-modal-foot-note">
                Click a label to flip it. This edits the reference table only — it doesn&apos;t re-run training.
              </p>
              <button type="button" onClick={resetSamples} className="nns-btn-secondary" style={{ width: "auto", padding: "8px 14px" }}>
                <RotateCcw />
                Reset to default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- Shortcuts modal */}
      {showShortcutsModal && (
        <div className="nns-modal-overlay" onClick={() => setShowShortcutsModal(false)}>
          <div className="nns-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nns-modal-header">
              <p>Keyboard Shortcuts</p>
              <button type="button" onClick={() => setShowShortcutsModal(false)} className="nns-modal-close">
                <X />
              </button>
            </div>
            <div>
              <div className="nns-shortcut-row">
                <span>Start / run training</span>
                <span className="nns-kbd">Space</span>
              </div>
              <div className="nns-shortcut-row">
                <span>Reset network</span>
                <span className="nns-kbd">R</span>
              </div>
              <div className="nns-shortcut-row">
                <span>Save snapshot</span>
                <span className="nns-kbd">S</span>
              </div>
            </div>
            <p className="nns-modal-foot-note" style={{ marginTop: 12 }}>
              Shortcuts are disabled while typing in a text field, dropdown, or slider.
            </p>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- About / welcome modal */}
      {showAboutModal && (
        <div className="nns-modal-overlay" onClick={() => setShowAboutModal(false)}>
          <div className="nns-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nns-modal-header">
              <p>What is this lab?</p>
              <button type="button" onClick={() => setShowAboutModal(false)} className="nns-modal-close">
                <X />
              </button>
            </div>
            <div className="nns-modal-body-text">
              <p>
                This lab runs a small <strong>feed-forward neural network</strong> — 4 input neurons, two
                hidden layers, and 2 output neurons — with real forward passes and real backpropagation, so
                you can watch it actually learn, without writing any code.
              </p>
              <p>
                <strong>The data:</strong> it uses the classic <strong>XOR dataset</strong>. XOR is popular for
                teaching because it&apos;s a simple pattern that a network with <em>no</em> hidden layer literally
                cannot learn, no matter how long you train it — you need at least one hidden layer to solve it.
                That makes it a clean way to show why hidden layers matter.
              </p>
              <p>
                <strong>How it works:</strong> the network diagram is real — the same layer sizes and
                connections described in the Layer Summary table hold real weights. Pressing Run / Train
                initializes those weights and genuinely trains them with backpropagation and the optimizer,
                loss function, learning rate, and batch size you&apos;ve chosen, evaluating on a real
                held-out validation split each epoch. The loss curve, accuracy, activation heatmap, and
                output preview all read directly from that live network — nothing here is precomputed or
                faked.
              </p>
              <p>
                Hover the small <HelpCircle style={{ width: 12, height: 12, display: "inline", verticalAlign: -1 }} /> icons
                next to labels anywhere in the lab for a quick explanation of what that number or control means.
              </p>
            </div>
            <div className="nns-modal-foot">
              <span />
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="nns-btn-primary"
                style={{ width: "auto", padding: "9px 18px" }}
              >
                <Check />
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- Toast */}
      {toast && <div className="nns-toast">{toast}</div>}

      {/* ---------------------------------------------------------- Status bar */}
      <footer className="nns-footer">
        <span className="nns-footer-status">
          <span className={`nns-status-dot${isTraining ? " training" : ""}`} />
          {isTraining ? "Training…" : "Ready"}
        </span>
        <span className="nns-footer-center">Neural Network Simulator&nbsp;|&nbsp;Learn · Build · Understand</span>
        <span className="nns-footer-actions">
          <button type="button" onClick={handleSaveModel} title="Save model (S)">
            <Save />
          </button>
          <button type="button" onClick={handleScreenshot} title="Download diagram as PNG">
            <Camera />
          </button>
          <button type="button" onClick={() => setShowMoreMenu((v) => !v)} title="More">
            <MoreHorizontal />
          </button>

          {showMoreMenu && (
            <div className="nns-more-menu">
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  handleExportConfig();
                }}
              >
                <Table2 />
                Export config
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  setShowShortcutsModal(true);
                }}
              >
                <HelpCircle />
                Keyboard shortcuts
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  setShowAboutModal(true);
                }}
              >
                <Sparkles />
                About
              </button>
            </div>
          )}
        </span>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub components                                                      */
/* ------------------------------------------------------------------ */

function SliderField({ label, value, display, min, max, step, onChange, tip }: {
  label: string;
  value: number;
  display: string | number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  tip?: string;
}) {
  return (
    <div>
      <div className="nns-slider-row">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          {label}
          {tip && <Tip text={tip} width={230} />}
        </span>
        <span className="nns-slider-value">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="nns-slider"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, tip }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  tip?: string;
}) {
  return (
    <div>
      <p className="nns-select-label" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        {label}
        {tip && <Tip text={tip} width={220} />}
      </p>
      <div className="nns-select-wrap">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="nns-select">
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="nns-select-chevron" />
      </div>
    </div>
  );
}

function NetworkCanvas({ dark, zoom, highlightIndices = [], svgRef }: { dark: boolean; zoom: number; highlightIndices?: number[]; svgRef?: React.MutableRefObject<SVGSVGElement | null> }) {
  const scale = zoom / 100;
  const textColor = dark ? "#cbd5e1" : "#334155";
  const boxTextColor = dark ? "#e2e8f0" : "#334155";
  const boxStroke = dark ? "#33415580" : "#cbd5e1";
  const lineStroke = dark ? "#33415580" : "#cbd5e180";

  return (
    <div className="nns-canvas-wrap">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        style={{ width: `${100 * scale}%`, height: `${100 * scale}%` }}
        className="nns-canvas-svg"
      >
        {LAYERS.slice(0, -1).map((layer, li) => {
          const x1 = layerX(li);
          const x2 = layerX(li + 1);
          const ys1 = nodeYs(layer.units);
          const ys2 = nodeYs(LAYERS[li + 1].units);
          return ys1.flatMap((y1, i) =>
            ys2.map((y2, j) => (
              <line key={`c-${li}-${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lineStroke} strokeWidth={1} />
            ))
          );
        })}

        {LAYERS.map((layer, li) => {
          const x = layerX(li);
          const ys = nodeYs(layer.units);
          const headerY = ys[0] - 60;
          const isHighlighted = highlightIndices.includes(li);
          return (
            <g key={layer.name}>
              {isHighlighted && (
                <rect
                  x={x - 46}
                  y={headerY - 24}
                  width={92}
                  height={ys[ys.length - 1] - headerY + 70}
                  rx={12}
                  fill={`${layer.color}14`}
                  stroke={layer.color}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />
              )}

              <text x={x} y={headerY - 8} textAnchor="middle" fontSize="15" fontWeight={600} fill={layer.color}>
                {layer.name}
              </text>
              <text x={x} y={headerY + 10} textAnchor="middle" fontSize="12" fill={layer.color} opacity={0.8}>
                ({layer.units})
              </text>

              {ys.map((y, i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={22} fill={`${layer.color}22`} stroke={layer.color} strokeWidth={2} />
                  <circle cx={x} cy={y} r={5} fill={layer.color} />
                  {li === 0 && (
                    <text x={x - 42} y={y + 5} textAnchor="middle" fontSize="13" fill={textColor}>
                      {`x${"₁₂₃₄"[i]}`}
                    </text>
                  )}
                  {li === LAYERS.length - 1 && (
                    <text x={x + 42} y={y + 5} textAnchor="middle" fontSize="13" fill={textColor}>
                      {`y${"₁₂"[i]}`}
                    </text>
                  )}
                </g>
              ))}

              {layer.activation !== "–" && (
                <g>
                  <rect
                    x={x - 34}
                    y={ys[ys.length - 1] + 40}
                    width={68}
                    height={26}
                    rx={6}
                    fill="none"
                    stroke={boxStroke}
                  />
                  <text x={x} y={ys[ys.length - 1] + 57} textAnchor="middle" fontSize="12" fill={boxTextColor}>
                    {layer.activation}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Legend() {
  const items = [
    { label: "Input", color: "#22c55e" },
    { label: "Dense Layer", color: "#3b82f6" },
    { label: "Activation", color: "#a855f7" },
    { label: "Output", color: "#f43f5e" },
  ];
  return (
    <div className="nns-legend">
      <strong>Legend</strong>
      {items.map((it) => (
        <span key={it.label} className="nns-legend-item">
          <span className="nns-legend-dot" style={{ backgroundColor: it.color }} />
          {it.label}
        </span>
      ))}
      <span className="nns-legend-item">
        <span className="nns-legend-line" />
        Connection
      </span>
    </div>
  );
}

function LossChart({ trainHistory, valHistory, epochsTarget }: { trainHistory: number[]; valHistory?: number[]; epochsTarget?: number }) {
  const W = 640;
  const H = 220;
  const padL = 40;
  const padB = 24;
  const padT = 10;
  const padR = 10;

  const yFor = (v: number) => {
    const clamped = Math.min(1, Math.max(0.001, v));
    const t = (Math.log10(clamped) - Math.log10(0.001)) / (Math.log10(1) - Math.log10(0.001));
    return padT + (1 - t) * (H - padT - padB);
  };
  const xFor = (i: number, n: number) => padL + (i / Math.max(1, n - 1)) * (W - padL - padR);

  const pathFor = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i, arr.length).toFixed(1)} ${yFor(v).toFixed(1)}`).join(" ");

  const gridVals = [1, 0.1, 0.01, 0.001];
  const gridStroke = "var(--panel-border)";
  const axisText = "var(--text-muted)";

  return (
    <div className="nns-chart-box">
      <svg viewBox={`0 0 ${W} ${H + 20}`}>
        {gridVals.map((g) => (
          <g key={g}>
            <line x1={padL} x2={W - padR} y1={yFor(g)} y2={yFor(g)} stroke={gridStroke} strokeWidth={1} />
            <text x={padL - 8} y={yFor(g) + 4} fontSize="10" textAnchor="end" fill={axisText}>
              {g}
            </text>
          </g>
        ))}
        <text x={10} y={H / 2} fontSize="10" fill={axisText} transform={`rotate(-90 10 ${H / 2})`} textAnchor="middle">
          Loss
        </text>

        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <text key={f} x={padL + f * (W - padL - padR)} y={H + 14} fontSize="10" textAnchor="middle" fill={axisText}>
            {Math.round(f * (epochsTarget ?? MAX_EPOCHS_DEFAULT))}
          </text>
        ))}
        <text x={W / 2} y={H + 30} fontSize="10" textAnchor="middle" fill={axisText}>
          Epoch
        </text>

        {trainHistory.length > 1 && <path d={pathFor(trainHistory)} fill="none" stroke="#3b82f6" strokeWidth={2} />}
        {valHistory && valHistory.length > 1 && <path d={pathFor(valHistory)} fill="none" stroke="#f97316" strokeWidth={2} />}

        {trainHistory.length === 0 && (
          <text x={W / 2} y={H / 2} fontSize="12" textAnchor="middle" fill={axisText}>
            Press &quot;Run / Train&quot; to start
          </text>
        )}
      </svg>
      <div className="nns-chart-legend">
        <span className="nns-chart-legend-item">
          <span className="nns-chart-legend-swatch" style={{ background: "#3b82f6" }} /> Training Loss
        </span>
        <span className="nns-chart-legend-item">
          <span className="nns-chart-legend-swatch" style={{ background: "#f97316" }} /> Validation Loss
        </span>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, colorClass, tip }: { label: string; value: ReactNode; sub?: ReactNode; colorClass?: string; tip?: string }) {
  return (
    <div className="nns-stat-card">
      <p className="nns-stat-label">
        {label}
        {tip && <Tip text={tip} width={220} />}
      </p>
      <p className={`nns-stat-value ${colorClass}`}>
        {value}
        {sub && <span className="nns-stat-sub">{sub}</span>}
      </p>
    </div>
  );
}

function ActivationHeatmap({ net, samples }: { net: NetWeights; samples: Sample[] }) {
  // Real forward pass of every sample through the current (possibly still
  // training) weights — the grid below is Hidden Layer 1's actual ReLU
  // activations, not synthetic noise.
  const perSampleA1 = samples.map((s) => forwardPass(s.x, net).a1);
  const rows = perSampleA1[0]?.length ?? 0;
  const cols = perSampleA1.length;
  const grid = Array.from({ length: rows }, (_, u) => perSampleA1.map((a1) => a1[u]));
  const maxVal = Math.max(1e-6, ...grid.flat());

  function colorFor(v: number) {
    const t = Math.min(1, Math.max(0, v / maxVal));
    const r = Math.round(30 + t * 40);
    const g = Math.round(30 + t * 90);
    const b = Math.round(90 + t * 165);
    return `rgb(${r},${g},${b})`;
  }

  return (
    <div className="nns-heatmap">
      <div className="nns-heatmap-labels">
        {Array.from({ length: rows }, (_, i) => (
          <span key={i}>N{i + 1}</span>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <div className="nns-heatmap-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {grid.map((row, i) =>
            row.map((v, j) => (
              <div key={`${i}-${j}`} className="nns-heatmap-cell" style={{ backgroundColor: colorFor(v) }} />
            ))
          )}
        </div>
        <div className="nns-heatmap-collabels" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }, (_, i) => (
            <span key={i}>S{i + 1}</span>
          ))}
        </div>
      </div>
      <div className="nns-heatmap-scale">
        <span>{maxVal.toFixed(2)}</span>
        <span>0</span>
      </div>
    </div>
  );
}

function OutputPreview({ net, input }: { net: NetWeights; input: number[] }) {
  // Real forward pass on the current test input — these two numbers are
  // the network's actual softmax output, always summing to 1.
  const { a3 } = forwardPass(input, net);
  const rows = [
    { label: "y\u2081", value: a3[0], color: "#3b82f6" },
    { label: "y\u2082", value: a3[1], color: "#22c55e" },
  ];
  return (
    <div className="nns-output">
      {rows.map((r) => (
        <div key={r.label} className="nns-output-row">
          <span className="nns-output-label">{r.label}</span>
          <div className="nns-output-track">
            <div className="nns-output-fill" style={{ width: `${r.value * 100}%`, backgroundColor: r.color }} />
          </div>
          <span className="nns-output-val">{r.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function HomeTab({ onGo, epoch, accuracy }: { onGo: (tab: string) => void; epoch: number; accuracy: number }) {
  return (
    <div className="nns-page" style={{ maxWidth: 768 }}>
      <section className="nns-hero">
        <h1>Welcome back</h1>
        <p className="nns-hero-sub">
          Build, train and inspect a small feed-forward network right in the browser — no setup required.
        </p>
        <div className="nns-hero-stats">
          <StatCard label="Last Epoch" value={`${epoch}`} colorClass="nns-c-blue" tip="The most recent epoch reached in your last training run." />
          <StatCard label="Last Accuracy" value={`${accuracy.toFixed(1)}`} sub="%" colorClass="nns-c-green" tip="Accuracy at the end of your last training run." />
          <StatCard label="Layers" value={`${LAYERS.length}`} colorClass="nns-c-purple" tip="Total layers in the fixed architecture: input, two hidden, and output." />
          <StatCard label="Parameters" value={`${paramCount()}`} colorClass="nns-c-rose" tip="Total trainable weights and biases in the network." />
        </div>
        <div className="nns-hero-actions">
          <button type="button" onClick={() => onGo("builder")} className="nns-hero-btn-primary">
            Open Builder
          </button>
          <button type="button" onClick={() => onGo("explain")} className="nns-hero-btn-secondary">
            How it works
          </button>
        </div>
      </section>
    </div>
  );
}

function TestTab({ testInputs, setTestInputs, trained, net }: { testInputs: number[]; setTestInputs: Dispatch<SetStateAction<number[]>>; trained: boolean; net: NetWeights }) {
  // Real forward pass through the currently trained weights.
  const { a3 } = forwardPass(testInputs, net);
  const predicted = a3[0] >= a3[1] ? 0 : 1;
  const confidence = a3[predicted];

  return (
    <div className="nns-page" style={{ maxWidth: 560 }}>
      <section className="nns-panel">
        <SectionTitle
          badge="1"
          label="TEST A SAMPLE"
          tip="Toggle the 4 bits to run them through the currently trained network and see its real prediction."
        />
        <p style={{ marginTop: 8, color: "var(--text-muted)" }}>
          Toggle the four input bits and see the network&apos;s real prediction below.
        </p>
        <div className="nns-test-bits">
          {testInputs.map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setTestInputs((arr) => arr.map((val, idx) => (idx === i ? (val === 1 ? 0 : 1) : val)))}
              className={`nns-bit-btn${v === 1 ? " active" : ""}`}
            >
              {v}
            </button>
          ))}
        </div>

        {!trained ? (
          <p className="nns-test-hint">Train the network from the Builder tab first to get a real prediction.</p>
        ) : (
          <div className="nns-test-result">
            <p className="nns-data-muted">Predicted class</p>
            <p className="nns-test-result-value">
              Class {predicted + 1} · {(confidence * 100).toFixed(1)}% confidence
            </p>
          </div>
        )}
      </section>
    </div>
  );
}