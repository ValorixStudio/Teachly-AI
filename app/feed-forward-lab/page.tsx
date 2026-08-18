"use client";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
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
  Download,
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

function seededRandom(seed:number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ------------------------------------------------------------------ */
/*  Static content                                                      */
/* ------------------------------------------------------------------ */

type TabKey = "home" | "builder" | "train" | "test" | "visualize" | "explain";

interface ComponentItem {
  label: string;
  layerIndices: number[];
}

interface SavedModel {
  id: number;
  epoch: number;
  accuracy: string;
  trainLoss: string;
  optimizer: string;
  learningRate: number;
  lossFn: string;
  batchSize: number;
}

const NAV_ITEMS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "builder", label: "Builder", icon: Share2 },
  { key: "train", label: "Train", icon: LineChartIcon },
  { key: "test", label: "Test", icon: CheckSquare },
  { key: "visualize", label: "Visualize", icon: BarChart3 },
  { key: "explain", label: "Explain", icon: Sparkles },
];

const COMPONENTS: ComponentItem[] = [
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
.nns-saved-item-download { margin-top:8px; display:flex; align-items:center; justify-content:center; gap:6px; width:100%; border:1px solid var(--panel-border); border-radius:7px; padding:6px 0; font-size:11px; font-weight:700; background:var(--panel-bg); color:var(--cyan); transition: all .15s ease; }
.nns-saved-item-download svg { width:13px; height:13px; }
.nns-saved-item-download:hover { border-color: rgba(34,211,238,0.5); background: rgba(34,211,238,0.08); }

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
.nns-stat-label { font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color:var(--text-muted); }
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

/* ---------- Toast ---------- */
.nns-toast { position:fixed; bottom:52px; left:50%; transform:translateX(-50%); z-index:50; border-radius:8px; background:#0A0D13; color:var(--cyan); font-family: 'JetBrains Mono', monospace; padding:9px 16px 9px 14px; font-size:12.5px; font-weight: 600; box-shadow:0 10px 28px rgba(0,0,0,0.4); border:1px solid rgba(34,211,238,0.35); animation: nns-fadeIn 0.2s ease both; }
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
.nns-more-menu button { width:100%; text-align:left; border-radius:7px; padding:8px 11px; font-size:11.5px; font-weight: 700; background:none; border:none; color:var(--text-main); }
.nns-more-menu button:hover { background:var(--hover-bg); color: var(--cyan); }
`;

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("builder");
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

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [dataTab, setDataTab] = useState("Dataset");
  const [showDataModal, setShowDataModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [testInputs, setTestInputs] = useState<number[]>([0, 1, 0, 1]);

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

  function showToast(msg: string) {
    setToast(msg);
  }

  function startTraining() {
    if (isTraining) return;
    setIsTraining(true);
    setEpoch(0);
    setTrainHistory([]);
    setValHistory([]);
    setAccuracy(0);

    const rand = seededRandom(42);
    const stepEvery = Math.max(1, Math.floor(epochsTarget / 200));
    let e = 0;

    intervalRef.current = setInterval(() => {
      e += stepEvery;
      if (e >= epochsTarget) e = epochsTarget;

      const progress = e / epochsTarget;
      const noise = (rand() - 0.5) * 0.02 * (1 - progress);
      const speed = 4 + learningRate * 60 + (optimizer === "Adam" ? 1.5 : optimizer === "RMSprop" ? 1 : 0.3);
      const tLoss = Math.max(0.002, 0.9 * Math.exp(-speed * progress) + 0.003 + noise);
      const vLoss = Math.max(0.003, tLoss * 1.4 + Math.abs(noise) * 1.5 + 0.002);
      const acc = Math.min(99.6, 100 * (1 - Math.exp(-5.5 * progress)) - rand() * 1.2);

      setEpoch(e);
      setTrainHistory((h) => [...h, tLoss]);
      setValHistory((h) => [...h, vLoss]);
      setAccuracy(Math.max(0, acc));

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
    showToast("Network reset");
  }

  function handleComponentClick(comp: ComponentItem) {
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
      lossFn,
      batchSize,
    };
    setSavedModels((list) => [snapshot, ...list].slice(0, 8));
    showToast("Model snapshot saved");
    setShowSavedPanel(true);
  }

  function buildModelExport(model: SavedModel) {
    // Deterministic pseudo-weights derived from the snapshot id, so every
    // export of the same saved model is reproducible.
    const rand = seededRandom(model.id % 1000000);
    const layerParams = [];
    for (let i = 1; i < LAYERS.length; i++) {
      const inUnits = LAYERS[i - 1].units;
      const outUnits = LAYERS[i].units;
      const weights = Array.from({ length: outUnits }, () =>
        Array.from({ length: inUnits }, () => Number(((rand() * 2 - 1) * 0.8).toFixed(4)))
      );
      const biases = Array.from({ length: outUnits }, () => Number(((rand() * 2 - 1) * 0.3).toFixed(4)));
      layerParams.push({
        layer: LAYERS[i].name,
        fromLayer: LAYERS[i - 1].name,
        activation: LAYERS[i].activation,
        inputUnits: inUnits,
        outputUnits: outUnits,
        weights,
        biases,
      });
    }

    return {
      modelName: "Neural Network Simulation Lab — Feed Forward Neural Network",
      exportedAt: new Date().toISOString(),
      architecture: LAYERS.map((l) => ({
        name: l.name,
        type: l.type,
        units: l.units,
        activation: l.activation,
      })),
      hyperparameters: {
        optimizer: model.optimizer,
        learningRate: model.learningRate,
        lossFunction: model.lossFn,
        batchSize: model.batchSize,
      },
      trainingSummary: {
        epoch: model.epoch,
        accuracy: `${model.accuracy}%`,
        trainLoss: model.trainLoss,
      },
      parameterCount: paramCount(),
      layers: layerParams,
    };
  }

  function handleDownloadModel(model: SavedModel) {
    const exportData = buildModelExport(model);
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `neural-network-model-epoch-${model.epoch}-${model.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Model downloaded");
  }

  function handleDownloadCurrentModel() {
    if (epoch === 0) {
      showToast("Nothing to download yet — train the network first");
      return;
    }
    const liveModel: SavedModel = {
      id: Date.now(),
      epoch,
      accuracy: accuracy.toFixed(1),
      trainLoss: trainLoss.toFixed(4),
      optimizer,
      learningRate,
      lossFn,
      batchSize,
    };
    handleDownloadModel(liveModel);
  }

  function handleScreenshot() {
    showToast("Snapshot of the diagram captured");
  }

  function handleAutoLayout() {
    setZoom(100);
    showToast("Layout auto-arranged");
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
            <p className="nns-title">Neural Network Simulation Lab</p>
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
          <button
            type="button"
            onClick={() => showToast("Feed-forward networks pass inputs layer by layer to produce an output.")}
            className="nns-help-btn"
          >
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
                      <button
                        type="button"
                        onClick={() => handleDownloadModel(m)}
                        className="nns-saved-item-download"
                      >
                        <Download />
                        Download Model
                      </button>
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
            <div className="nns-section-title">
              <span className="nns-section-badge">1</span>
              <span className="nns-section-label">BUILD NETWORK</span>
            </div>

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
              />
              <SliderField
                label="Epochs"
                value={epochsTarget}
                display={String(epochsTarget)}
                min={100}
                max={2000}
                step={50}
                onChange={(v) => setEpochsTarget(Math.round(v))}
              />
              <SliderField
                label="Batch Size"
                value={batchSize}
                display={String(batchSize)}
                min={4}
                max={256}
                step={4}
                onChange={(v) => setBatchSize(Math.round(v))}
              />

              <SelectField
                label="Loss Function"
                value={lossFn}
                onChange={setLossFn}
                options={["Mean Squared Error", "Cross Entropy", "Mean Absolute Error"]}
              />
              <SelectField
                label="Optimizer"
                value={optimizer}
                onChange={setOptimizer}
                options={["Adam", "SGD", "RMSprop"]}
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
                <div className="nns-section-title">
                  <span className="nns-section-badge">2</span>
                  <span className="nns-section-label">NETWORK ARCHITECTURE</span>
                </div>
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

              <NetworkCanvas dark={dark} zoom={zoom} highlightIndices={highlightIndices} />
              <Legend />
            </section>

            <section className="nns-panel">
              <div className="nns-section-title">
                <span className="nns-section-badge">4</span>
                <span className="nns-section-label">TRAINING DASHBOARD</span>
              </div>
              <div className="nns-dashboard-row">
                <div className="nns-chart-col">
                  <p className="nns-chart-col-label">Training Progress</p>
                  <LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} />
                </div>
                <div className="nns-stats-grid">
                  <StatCard label="Epoch" value={`${epoch}`} sub={`/ ${epochsTarget}`} colorClass="nns-c-blue" />
                  <StatCard label="Loss (Train)" value={trainLoss.toFixed(4)} colorClass="nns-c-blue" />
                  <StatCard label="Loss (Val)" value={valLoss.toFixed(4)} colorClass="nns-c-orange" />
                  <StatCard label="Accuracy" value={`${accuracy.toFixed(1)}`} sub="%" colorClass="nns-c-green" />
                </div>
              </div>
            </section>
          </main>

          {/* -------------------------------------------------- Right panel */}
          <aside className="nns-aside">
            <div className="nns-section-title">
              <span className="nns-section-badge">3</span>
              <span className="nns-section-label">INFORMATION PANEL</span>
            </div>

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
                <span>Parameter Count</span>
                <span>{paramCount()}</span>
              </div>
            </div>

            <div>
              <p className="nns-chart-col-label">Activation Preview (Hidden Layer 1)</p>
              <ActivationHeatmap rows={LAYERS[1].units} epoch={epoch} />
            </div>

            <div>
              <p className="nns-chart-col-label">Output Preview</p>
              <OutputPreview accuracy={accuracy} />
            </div>

            <div className="nns-divider">
              <div className="nns-section-title">
                <span className="nns-section-badge">5</span>
                <span className="nns-section-label">DATA PANEL</span>
              </div>
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
                    <p>{XOR_SAMPLES.length}</p>
                  </div>
                </div>
              )}

              {dataTab === "Input Sample" && (
                <div className="nns-data-content">
                  <p className="nns-data-muted" style={{ marginBottom: 4 }}>
                    First sample, x&#8321;–x&#8324;
                  </p>
                  <div className="nns-data-chip-row">
                    {XOR_SAMPLES[0].x.map((v, i) => (
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
                    Class 1: {XOR_SAMPLES.filter((s) => s.y[0] === 1).length} · Class 2:{" "}
                    {XOR_SAMPLES.filter((s) => s.y[1] === 1).length}
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
            <div className="nns-section-title">
              <span className="nns-section-badge">1</span>
              <span className="nns-section-label">TRAIN</span>
            </div>
            <div className="nns-dashboard-row">
              <div className="nns-chart-col">
                <LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} />
              </div>
              <div className="nns-stats-grid">
                <StatCard label="Epoch" value={`${epoch}`} sub={`/ ${epochsTarget}`} colorClass="nns-c-blue" />
                <StatCard label="Accuracy" value={`${accuracy.toFixed(1)}`} sub="%" colorClass="nns-c-green" />
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
        <TestTab testInputs={testInputs} setTestInputs={setTestInputs} trained={epoch > 0} accuracy={accuracy} />
      )}

      {activeTab === "visualize" && (
        <div className="nns-page">
          <section className="nns-panel">
            <div className="nns-section-title">
              <span className="nns-section-badge">1</span>
              <span className="nns-section-label">ACTIVATIONS</span>
            </div>
            <div style={{ marginTop: 12, maxWidth: 420 }}>
              <ActivationHeatmap rows={LAYERS[1].units} epoch={epoch} />
            </div>
          </section>
          <section className="nns-panel">
            <div className="nns-section-title">
              <span className="nns-section-badge">2</span>
              <span className="nns-section-label">LOSS CURVE</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} />
            </div>
          </section>
        </div>
      )}

      {activeTab === "explain" && (
        <div className="nns-page">
          <section className="nns-panel nns-page-mid">
            <div className="nns-section-title">
              <span className="nns-section-badge">1</span>
              <span className="nns-section-label">HOW THIS NETWORK WORKS</span>
            </div>
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
            </div>
          </section>
        </div>
      )}

      {/* ---------------------------------------------------------- Data modal */}
      {showDataModal && (
        <div className="nns-modal-overlay" onClick={() => setShowDataModal(false)}>
          <div className="nns-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nns-modal-header">
              <p>XOR Dataset — {XOR_SAMPLES.length} samples</p>
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
                  {XOR_SAMPLES.map((s, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      {s.x.map((v, j) => (
                        <td key={j}>{v}</td>
                      ))}
                      <td>{s.y[0] === 1 ? "Class 1" : "Class 2"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          <button type="button" onClick={handleSaveModel} title="Save model">
            <Save />
          </button>
          <button type="button" onClick={handleDownloadCurrentModel} title="Download trained model">
            <Download />
          </button>
          <button type="button" onClick={handleScreenshot} title="Screenshot">
            <Camera />
          </button>
          <button type="button" onClick={() => setShowMoreMenu((v) => !v)} title="More">
            <MoreHorizontal />
          </button>

          {showMoreMenu && (
            <div className="nns-more-menu">
              {["Export config", "Keyboard shortcuts", "About"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    showToast(`${item} — coming soon`);
                  }}
                >
                  {item}
                </button>
              ))}
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

function SliderField({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="nns-slider-row">
        <span>{label}</span>
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="nns-select-label">{label}</p>
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

function NetworkCanvas({
  dark,
  zoom,
  highlightIndices = [],
}: {
  dark: boolean;
  zoom: number;
  highlightIndices?: number[];
}) {
  const scale = zoom / 100;
  const textColor = dark ? "#cbd5e1" : "#334155";
  const boxTextColor = dark ? "#e2e8f0" : "#334155";
  const boxStroke = dark ? "#33415580" : "#cbd5e1";
  const lineStroke = dark ? "#33415580" : "#cbd5e180";

  return (
    <div className="nns-canvas-wrap">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: `${100 * scale}% height: ${100 * scale}%` }} className="nns-canvas-svg">
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

function LossChart({
  trainHistory,
  valHistory,
  epochsTarget,
}: {
  trainHistory: number[];
  valHistory: number[];
  epochsTarget: number;
}) {
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
            {Math.round(f * epochsTarget)}
          </text>
        ))}
        <text x={W / 2} y={H + 30} fontSize="10" textAnchor="middle" fill={axisText}>
          Epoch
        </text>

        {trainHistory.length > 1 && <path d={pathFor(trainHistory)} fill="none" stroke="#3b82f6" strokeWidth={2} />}
        {valHistory.length > 1 && <path d={pathFor(valHistory)} fill="none" stroke="#f97316" strokeWidth={2} />}

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

function StatCard({
  label,
  value,
  sub,
  colorClass,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  colorClass: string;
}) {
  return (
    <div className="nns-stat-card">
      <p className="nns-stat-label">{label}</p>
      <p className={`nns-stat-value ${colorClass}`}>
        {value}
        {sub && <span className="nns-stat-sub">{sub}</span>}
      </p>
    </div>
  );
}

function ActivationHeatmap({ rows, epoch }: { rows: number; epoch: number }) {
  const cols = 8;
  const rand = seededRandom(epoch + 7);
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => rand() * 2 - 1));

  function colorFor(v: number) {
    const t = (v + 1) / 2;
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
        <span>1.0</span>
        <span>0</span>
        <span>-1.0</span>
      </div>
    </div>
  );
}

function OutputPreview({ accuracy }: { accuracy: number }) {
  const confidence = 0.5 + Math.min(0.45, accuracy / 220);
  const y1 = confidence;
  const y2 = 1 - confidence;
  const rows = [
    { label: "y\u2081", value: y1, color: "#3b82f6" },
    { label: "y\u2082", value: y2, color: "#22c55e" },
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

function HomeTab({
  onGo,
  epoch,
  accuracy,
}: {
  onGo: (tab: TabKey) => void;
  epoch: number;
  accuracy: number;
}) {
  return (
    <div className="nns-page" style={{ maxWidth: 768 }}>
      <section className="nns-hero">
        <h1>Welcome back</h1>
        <p className="nns-hero-sub">
          Build, train and inspect a small feed-forward network right in the browser — no setup required.
        </p>
        <div className="nns-hero-stats">
          <StatCard label="Last Epoch" value={`${epoch}`} colorClass="nns-c-blue" />
          <StatCard label="Last Accuracy" value={`${accuracy.toFixed(1)}`} sub="%" colorClass="nns-c-green" />
          <StatCard label="Layers" value={`${LAYERS.length}`} colorClass="nns-c-purple" />
          <StatCard label="Parameters" value={`${paramCount()}`} colorClass="nns-c-rose" />
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

function TestTab({
  testInputs,
  setTestInputs,
  trained,
  accuracy,
}: {
  testInputs: number[];
  setTestInputs: Dispatch<SetStateAction<number[]>>;
  trained: boolean;
  accuracy: number;
}) {
  const confidence = trained ? 0.5 + Math.min(0.45, accuracy / 220) : 0.5;
  const predicted = testInputs[0] === testInputs[1] ? 0 : 1;

  return (
    <div className="nns-page" style={{ maxWidth: 560 }}>
      <section className="nns-panel">
        <div className="nns-section-title">
          <span className="nns-section-badge">1</span>
          <span className="nns-section-label">TEST A SAMPLE</span>
        </div>
        <p style={{ marginTop: 8, color: "var(--text-muted)" }}>
          Toggle the four input bits and see the (simulated) prediction below.
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