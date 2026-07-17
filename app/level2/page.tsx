"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  TreePine,
  TreeDeciduous,
  Bird,
  Fish,
  PawPrint,
  Leaf,
  Feather,
  Waves,
  Footprints,
  Sparkles,
  Trophy,
  Award,
  Star,
  Undo2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lock,
  ChevronRight,
  Volume2,
  VolumeX,
  Flower2,
  Wind,
  PartyPopper,
  Home,
  HelpCircle,
  Wand2,
} from "lucide-react";

/* ================================================================== */
/*  Domain data                                                        */
/* ================================================================== */

type Attrs = { legs: number; canFly: boolean; livesInWater: boolean };
type Species = Attrs & { name: string };

// The single source of truth for "what is the right answer" everywhere in
// the game. This IS the decision tree the student rebuilds, expressed as
// code: Can Fly? -> Bird. Else, Lives in Water? -> No: Mammal.
// Yes: Legs? -> 0: Fish, 2: Bird, 4: Amphibian.
function classify(a: Attrs): "Bird" | "Mammal" | "Fish" | "Amphibian" {
  if (a.canFly) return "Bird";
  if (!a.livesInWater) return "Mammal";
  if (a.legs === 0) return "Fish";
  if (a.legs === 2) return "Bird";
  return "Amphibian";
}

const CLASS_ICON: Record<string, typeof Bird> = {
  Bird, Mammal: PawPrint, Fish, Amphibian: Leaf,
};
const CLASS_COLOR: Record<string, string> = {
  Bird: "var(--teal)", Mammal: "var(--amber)", Fish: "var(--sky)", Amphibian: "var(--leaf)",
};

const BASE_ANIMALS: Species[] = [
  { name: "Dog", legs: 4, canFly: false, livesInWater: false },
  { name: "Duck", legs: 2, canFly: true, livesInWater: true },
  { name: "Cat", legs: 4, canFly: false, livesInWater: false },
  { name: "Fish", legs: 0, canFly: false, livesInWater: true },
  { name: "Penguin", legs: 2, canFly: false, livesInWater: true },
  { name: "Frog", legs: 4, canFly: false, livesInWater: true },
];

const CH4_ANIMALS: Species[] = [
  { name: "Eagle", legs: 2, canFly: true, livesInWater: false },
  { name: "Cow", legs: 4, canFly: false, livesInWater: false },
  { name: "Trout", legs: 0, canFly: false, livesInWater: true },
  { name: "Salamander", legs: 4, canFly: false, livesInWater: true },
];

const MYSTERY_ANIMALS: Species[] = [
  { name: "Falcon", legs: 2, canFly: true, livesInWater: false },
  { name: "Shark", legs: 0, canFly: false, livesInWater: true },
  { name: "Horse", legs: 4, canFly: false, livesInWater: false },
  { name: "Newt", legs: 4, canFly: false, livesInWater: true },
  { name: "Parrot", legs: 2, canFly: true, livesInWater: false },
  { name: "Goldfish", legs: 0, canFly: false, livesInWater: true },
  { name: "Rabbit", legs: 4, canFly: false, livesInWater: false },
  { name: "Puffin", legs: 2, canFly: false, livesInWater: true },
  { name: "Axolotl", legs: 4, canFly: false, livesInWater: true },
  { name: "Wolf", legs: 4, canFly: false, livesInWater: false },
];

const CLASS_OPTIONS = ["Mammal", "Bird", "Fish", "Amphibian"] as const;

type Badge = { id: string; label: string; desc: string; icon: typeof Trophy };
const BADGES: Badge[] = [
  { id: "first-split", label: "First Split", desc: "Chose the AI's very first question", icon: Sparkles },
  { id: "smart-decision", label: "Smart Decision", desc: "Cleanly separated a mixed branch", icon: Star },
  { id: "tree-builder", label: "Tree Builder", desc: "Grew a fully pure decision tree", icon: TreePine },
  { id: "perfect-prediction", label: "Perfect Prediction", desc: "Classified every new animal, no mistakes", icon: Wand2 },
  { id: "forest-guardian", label: "Forest Guardian", desc: "Restored the entire AI Forest", icon: Award },
];

/* ================================================================== */
/*  Stylesheet — scoped under .mfa-app                                 */
/* ================================================================== */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

@keyframes mfa-drift { 0% { transform: translate(0,0); } 50% { transform: translate(6px,-10px); } 100% { transform: translate(0,0); } }
@keyframes mfa-firefly { 0%,100% { opacity: .15; transform: translateY(0) scale(1); } 50% { opacity: .95; transform: translateY(-14px) scale(1.15); } }
@keyframes mfa-fly { 0% { transform: translate(-10vw, 0); } 100% { transform: translate(110vw, -40px); } }
@keyframes mfa-fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mfa-pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
@keyframes mfa-grow { from { stroke-dashoffset: 220; } to { stroke-dashoffset: 0; } }
@keyframes mfa-bloomIn { from { transform: scale(0) rotate(-25deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
@keyframes mfa-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
@keyframes mfa-spin-slow { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes mfa-pulseRing { 0% { box-shadow: 0 0 0 0 rgba(34,211,238,.45); } 70% { box-shadow: 0 0 0 10px rgba(34,211,238,0); } 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0); } }
@keyframes mfa-sway { 0%,100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
@keyframes mfa-confetti { 0% { transform: translateY(-10vh) rotate(0); opacity: 1; } 100% { transform: translateY(110vh) rotate(540deg); opacity: 0; } }

.mfa-app, .mfa-app *, .mfa-app *::before, .mfa-app *::after {
  box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent;
}
.mfa-app {
  --bg-deep:#07160F; --bg-mid:#0D2A1B; --bg-hi:#123723;
  --panel: rgba(233,255,240,0.055); --panel-strong: rgba(233,255,240,0.09); --panel-border: rgba(180,255,210,0.14);
  --ink:#F2FBF4; --muted:#93B4A1; --soft:#C7E4D3;
  --amber:#F5B942; --amber-soft:#FFDD8A;
  --leaf:#4ADE80; --leaf-deep:#16A34A;
  --sky:#38BDF8; --teal:#2DD4BF; --violet:#A78BFA; --rose:#FB7185;
  --dry:#8A6B4A;
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--ink);
  width: 100%; min-height: 100vh; position: relative; overflow-x: hidden;
  background: radial-gradient(ellipse 1100px 700px at 20% -10%, rgba(45,212,191,0.16), transparent 60%),
              radial-gradient(ellipse 900px 600px at 100% 10%, rgba(245,185,66,0.10), transparent 55%),
              linear-gradient(180deg, var(--bg-deep), var(--bg-mid) 45%, var(--bg-hi));
}
.mfa-display { font-family: 'Baloo 2', 'Nunito', sans-serif; }
.mfa-mono { font-family: 'JetBrains Mono', monospace; }
.mfa-app button { cursor: pointer; font-family: inherit; color: inherit; }
.mfa-app button:disabled { cursor: not-allowed; opacity: .55; }
.mfa-app button:focus-visible, .mfa-app a:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  .mfa-app *, .mfa-app *::before, .mfa-app *::after { animation: none !important; transition: none !important; }
}

/* ---------- Ambient scene ---------- */
.mfa-scene { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.mfa-firefly { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: var(--amber-soft);
  box-shadow: 0 0 8px 2px rgba(255,221,138,0.8); animation: mfa-firefly ease-in-out infinite; }
.mfa-bird { position: absolute; opacity: .55; color: var(--soft); animation: mfa-fly linear infinite; }
.mfa-ground-glow { position: absolute; left: 0; right: 0; bottom: -10%; height: 260px;
  background: radial-gradient(ellipse 60% 100% at 50% 100%, rgba(74,222,128,0.14), transparent 70%); }

/* ---------- Layout ---------- */
.mfa-shell { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 20px 20px 80px; }
.mfa-header { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap: wrap; padding: 14px 20px;
  border-radius: 20px; background: var(--panel); border: 1px solid var(--panel-border); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.mfa-brand { display:flex; align-items:center; gap:10px; }
.mfa-brand-icon { width: 38px; height: 38px; border-radius: 12px; display:flex; align-items:center; justify-content:center;
  background: linear-gradient(135deg, var(--leaf-deep), var(--teal)); color: #04150C; box-shadow: 0 6px 18px rgba(45,212,191,0.35); flex-shrink: 0; }
.mfa-brand-title { font-family: 'Baloo 2'; font-weight: 700; font-size: 17px; line-height: 1.1; }
.mfa-brand-sub { font-size: 11.5px; color: var(--muted); letter-spacing: .04em; text-transform: uppercase; }
.mfa-header-right { display:flex; align-items:center; gap: 10px; }
.mfa-icon-btn { width: 38px; height: 38px; border-radius: 12px; background: var(--panel-strong); border: 1px solid var(--panel-border);
  display:flex; align-items:center; justify-content:center; color: var(--soft); transition: transform .15s ease, background .15s ease; }
.mfa-icon-btn:hover { transform: translateY(-1px); background: rgba(233,255,240,0.13); }

/* ---------- Progress tracker ---------- */
.mfa-tracker { display:flex; align-items:center; gap: 6px; margin: 22px 0 26px; }
.mfa-tracker-step { flex: 1; display:flex; align-items:center; gap: 6px; }
.mfa-tracker-node { width: 34px; height: 34px; border-radius: 50%; display:flex; align-items:center; justify-content:center;
  font-family:'Baloo 2'; font-weight:700; font-size: 13px; flex-shrink:0; border: 2px solid var(--panel-border);
  background: var(--panel-strong); color: var(--muted); transition: all .25s ease; }
.mfa-tracker-node.done { background: linear-gradient(135deg, var(--leaf-deep), var(--teal)); color:#04150C; border-color: transparent; }
.mfa-tracker-node.active { border-color: var(--amber); color: var(--amber-soft); box-shadow: 0 0 0 4px rgba(245,185,66,0.18); }
.mfa-tracker-line { flex:1; height: 3px; border-radius: 3px; background: var(--panel-border); overflow:hidden; }
.mfa-tracker-line-fill { height: 100%; background: linear-gradient(90deg, var(--leaf-deep), var(--teal)); transition: width .4s ease; }
.mfa-tracker-label { display:none; }
@media (min-width: 760px) {
  .mfa-tracker-label { display:block; font-size: 10.5px; color: var(--muted); position:absolute; margin-top: 44px; width: 90px; text-align:center; left:50%; transform: translateX(-50%); }
  .mfa-tracker-node { position: relative; }
}

/* ---------- Badges shelf ---------- */
.mfa-badges { display:flex; gap: 8px; flex-wrap: wrap; }
.mfa-badge { width: 34px; height: 34px; border-radius: 10px; display:flex; align-items:center; justify-content:center;
  background: var(--panel-strong); border: 1px solid var(--panel-border); color: var(--dry); position: relative; }
.mfa-badge.unlocked { color: #1a1200; background: linear-gradient(135deg, var(--amber), var(--amber-soft)); border-color: transparent;
  box-shadow: 0 4px 14px rgba(245,185,66,0.4); animation: mfa-pop .4s ease; }
.mfa-badge .mfa-tip { display:none; }

/* ---------- Chapter panel ---------- */
.mfa-panel { border-radius: 26px; background: var(--panel); border: 1px solid var(--panel-border); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  padding: 28px; margin-bottom: 22px; animation: mfa-fadeUp .5s ease; box-shadow: 0 20px 50px rgba(0,0,0,0.25); }
.mfa-eyebrow { display:inline-flex; align-items:center; gap:7px; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  color: var(--amber-soft); background: rgba(245,185,66,0.12); border: 1px solid rgba(245,185,66,0.28); padding: 5px 12px; border-radius: 999px; margin-bottom: 14px; }
.mfa-h1 { font-family: 'Baloo 2'; font-weight: 800; font-size: clamp(22px, 3.4vw, 32px); line-height: 1.15; margin-bottom: 8px; }
.mfa-lead { color: var(--soft); font-size: 15px; line-height: 1.6; max-width: 62ch; margin-bottom: 20px; }

/* ---------- Table (Ch1) ---------- */
.mfa-table-wrap { overflow-x: auto; border-radius: 16px; border: 1px solid var(--panel-border); }
.mfa-table { width: 100%; border-collapse: collapse; min-width: 560px; }
.mfa-table th { text-align: left; font-size: 11.5px; letter-spacing:.06em; text-transform: uppercase; color: var(--muted);
  padding: 12px 14px; background: rgba(233,255,240,0.05); border-bottom: 1px solid var(--panel-border); }
.mfa-table td { padding: 11px 14px; font-size: 14px; border-bottom: 1px solid rgba(233,255,240,0.05); }
.mfa-table tr:last-child td { border-bottom: none; }
.mfa-table-name { display:flex; align-items:center; gap: 8px; font-weight: 700; }
.mfa-pill { display:inline-flex; align-items:center; gap:5px; padding: 3px 9px; border-radius: 999px; font-size: 12.5px; font-weight: 700; }
.mfa-pill-yes { background: rgba(45,212,191,0.16); color: var(--teal); }
.mfa-pill-no { background: rgba(148,163,184,0.14); color: var(--muted); }
.mfa-class-chip { display:inline-flex; align-items:center; gap:6px; font-weight: 800; font-family:'Baloo 2'; }

/* ---------- Choice grid ---------- */
.mfa-choice-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr)); gap: 12px; margin: 18px 0; }
.mfa-choice-card { text-align:left; padding: 16px; border-radius: 16px; background: var(--panel-strong); border: 1.5px solid var(--panel-border);
  display:flex; flex-direction: column; gap: 10px; transition: transform .15s ease, border-color .15s ease, background .15s ease; }
.mfa-choice-card:hover:not(:disabled) { transform: translateY(-3px); border-color: rgba(45,212,191,0.4); }
.mfa-choice-card.correct { border-color: var(--leaf); background: rgba(74,222,128,0.14); }
.mfa-choice-card.wrong { border-color: var(--rose); background: rgba(251,113,133,0.12); animation: mfa-shake .35s ease; }
.mfa-choice-icon { width: 36px; height: 36px; border-radius: 11px; display:flex; align-items:center; justify-content:center;
  background: rgba(45,212,191,0.14); color: var(--teal); }
.mfa-choice-label { font-family:'Baloo 2'; font-weight: 700; font-size: 15px; }

/* ---------- Feedback banner ---------- */
.mfa-feedback { display:flex; gap: 10px; align-items:flex-start; padding: 14px 16px; border-radius: 14px; margin: 6px 0 18px;
  font-size: 14px; line-height: 1.55; animation: mfa-fadeUp .3s ease; }
.mfa-feedback.good { background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.3); color: var(--leaf); }
.mfa-feedback.bad { background: rgba(251,113,133,0.1); border: 1px solid rgba(251,113,133,0.28); color: #FFB4BE; }
.mfa-feedback.info { background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.28); color: #BEE8FB; }
.mfa-feedback b { color: var(--ink); }

/* ---------- Buttons ---------- */
.mfa-btn { display:inline-flex; align-items:center; gap: 8px; padding: 12px 20px; border-radius: 14px; border: none;
  font-family:'Baloo 2'; font-weight: 700; font-size: 14.5px; transition: transform .15s ease, box-shadow .15s ease; }
.mfa-btn-primary { background: linear-gradient(135deg, var(--leaf-deep), var(--teal)); color: #04150C; box-shadow: 0 10px 24px rgba(45,212,191,0.3); }
.mfa-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(45,212,191,0.42); }
.mfa-btn-ghost { background: var(--panel-strong); border: 1px solid var(--panel-border); color: var(--soft); }
.mfa-btn-ghost:hover:not(:disabled) { background: rgba(233,255,240,0.13); }
.mfa-btn-amber { background: linear-gradient(135deg, var(--amber), var(--amber-soft)); color: #1a1200; box-shadow: 0 10px 24px rgba(245,185,66,0.3); }
.mfa-btn-row { display:flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }

/* ---------- Purity meter ---------- */
.mfa-purity { margin: 18px 0; }
.mfa-purity-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 6px; }
.mfa-purity-label { font-size: 12.5px; color: var(--muted); text-transform: uppercase; letter-spacing:.05em; font-weight:700; }
.mfa-purity-val { font-family:'JetBrains Mono'; font-weight: 700; font-size: 18px; color: var(--leaf); }
.mfa-purity-track { height: 14px; border-radius: 999px; background: rgba(233,255,240,0.08); border: 1px solid var(--panel-border); overflow:hidden; }
.mfa-purity-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--amber), var(--leaf), var(--teal)); transition: width .6s cubic-bezier(.4,0,.2,1); }

/* ---------- Decision tree ---------- */
.mfa-tree-wrap { position: relative; width: 100%; overflow-x: auto; padding: 6px 0 10px; }
.mfa-tree-canvas { position: relative; width: 100%; min-width: 640px; height: 430px; }
.mfa-tree-svg { position:absolute; inset:0; width:100%; height:100%; }
.mfa-tree-edge { fill:none; stroke: rgba(233,255,240,0.18); stroke-width: 2.5; stroke-linecap: round; transition: stroke .3s ease; }
.mfa-tree-edge.active { stroke: var(--teal); stroke-width: 3; filter: drop-shadow(0 0 4px rgba(45,212,191,0.6)); }
.mfa-tree-edge.grown { stroke-dasharray: 220; animation: mfa-grow .7s ease forwards; }
.mfa-tree-node { position: absolute; transform: translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; gap: 6px;
  padding: 10px 14px; border-radius: 16px; background: var(--panel-strong); border: 1.5px solid var(--panel-border); min-width: 108px;
  text-align:center; animation: mfa-pop .4s ease; }
.mfa-tree-node.question { border-color: rgba(245,185,66,0.45); background: rgba(245,185,66,0.1); }
.mfa-tree-node.active-q { box-shadow: 0 0 0 4px rgba(245,185,66,0.25); animation: mfa-pulseRing 1.8s infinite, mfa-pop .4s ease; }
.mfa-tree-node.leaf.bloom { border-color: rgba(74,222,128,0.5); background: rgba(74,222,128,0.12); }
.mfa-tree-node.leaf.dry { border-color: rgba(138,107,74,0.6); background: rgba(138,107,74,0.14); filter: saturate(.6); }
.mfa-tree-node-title { font-family:'Baloo 2'; font-weight: 700; font-size: 13px; }
.mfa-tree-node-sub { font-size: 10.5px; color: var(--muted); }
.mfa-tree-placeholder { position:absolute; transform: translate(-50%,-50%); width: 40px; height:40px; border-radius: 50%;
  border: 2px dashed var(--panel-border); display:flex; align-items:center; justify-content:center; color: var(--muted); }
.mfa-edge-tag { position:absolute; transform: translate(-50%,-50%); font-size: 10.5px; font-weight: 700; color: var(--soft);
  background: var(--bg-mid); padding: 1px 7px; border-radius: 999px; border: 1px solid var(--panel-border); }

/* ---------- Attribute chips (predict flows) ---------- */
.mfa-attrs { display:flex; gap: 10px; flex-wrap: wrap; margin: 14px 0; }
.mfa-attr-chip { display:flex; align-items:center; gap: 7px; padding: 9px 14px; border-radius: 12px; background: var(--panel-strong);
  border: 1px solid var(--panel-border); font-size: 13.5px; font-weight: 600; }
.mfa-attr-chip svg { color: var(--teal); }

/* ---------- Mystery / class picker ---------- */
.mfa-class-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(120px,1fr)); gap: 10px; margin: 16px 0; }
.mfa-class-card { display:flex; flex-direction:column; align-items:center; gap:8px; padding: 16px 10px; border-radius: 16px;
  background: var(--panel-strong); border: 1.5px solid var(--panel-border); font-family:'Baloo 2'; font-weight:700; }
.mfa-class-card:hover:not(:disabled) { transform: translateY(-3px); border-color: rgba(45,212,191,0.4); }
.mfa-class-card.correct { border-color: var(--leaf); background: rgba(74,222,128,0.16); }
.mfa-class-card.wrong { border-color: var(--rose); background: rgba(251,113,133,0.14); animation: mfa-shake .35s ease; }

/* ---------- Forest restoration ---------- */
.mfa-forest-stage { position: relative; height: 200px; border-radius: 20px; overflow: hidden; margin: 18px 0;
  background: linear-gradient(180deg, rgba(45,212,191,0.08), rgba(74,222,128,0.05)); border: 1px solid var(--panel-border); }
.mfa-forest-row { position:absolute; bottom: 10px; left: 0; right: 0; display:flex; justify-content: space-evenly; align-items:flex-end; }
.mfa-forest-tree { color: var(--dry); transition: color .5s ease, transform .5s ease; animation: mfa-sway 5s ease-in-out infinite; }
.mfa-forest-tree.grown { color: var(--leaf-deep); transform: scale(1.15); }
.mfa-forest-flower { position:absolute; bottom: 6px; color: var(--rose); opacity:0; transition: opacity .5s ease, transform .5s ease; }
.mfa-forest-flower.show { opacity: 1; animation: mfa-bloomIn .5s ease; }
.mfa-forest-pct { position:absolute; top: 12px; right: 16px; font-family:'JetBrains Mono'; font-weight: 700; font-size: 26px; color: var(--leaf); }

/* ---------- Mini gallery (mystery dots) ---------- */
.mfa-dot-row { display:flex; gap: 6px; flex-wrap:wrap; margin-bottom: 14px; }
.mfa-dot { width: 26px; height: 26px; border-radius: 8px; display:flex; align-items:center; justify-content:center;
  background: var(--panel-strong); border: 1px solid var(--panel-border); font-size: 11px; font-weight: 700; color: var(--muted); }
.mfa-dot.done-correct { background: linear-gradient(135deg, var(--leaf-deep), var(--teal)); color:#04150C; border-color: transparent; }
.mfa-dot.done-wrong { background: rgba(251,113,133,0.25); color:#FFB4BE; border-color: rgba(251,113,133,0.4); }
.mfa-dot.active { border-color: var(--amber); }

/* ---------- Certificate ---------- */
.mfa-cert { position: relative; border-radius: 28px; padding: 40px 32px; text-align:center; overflow:hidden;
  background: linear-gradient(160deg, rgba(245,185,66,0.14), rgba(74,222,128,0.08) 60%, rgba(45,212,191,0.1));
  border: 1.5px solid rgba(245,185,66,0.35); }
.mfa-cert-ring { width: 88px; height: 88px; border-radius: 50%; margin: 0 auto 16px; display:flex; align-items:center; justify-content:center;
  background: linear-gradient(135deg, var(--amber), var(--amber-soft)); color:#1a1200; box-shadow: 0 12px 34px rgba(245,185,66,0.4); animation: mfa-pop .5s ease; }
.mfa-cert-title { font-family:'Baloo 2'; font-weight:800; font-size: clamp(24px,4vw,34px); margin-bottom: 6px; }
.mfa-cert-sub { color: var(--soft); max-width: 52ch; margin: 0 auto 24px; line-height: 1.6; }
.mfa-cert-stats { display:grid; grid-template-columns: repeat(auto-fit,minmax(120px,1fr)); gap: 12px; margin-bottom: 24px; }
.mfa-cert-stat { background: rgba(7,22,15,0.35); border: 1px solid var(--panel-border); border-radius: 16px; padding: 14px; }
.mfa-cert-stat-val { font-family:'JetBrains Mono'; font-weight:700; font-size: 22px; color: var(--amber-soft); }
.mfa-cert-stat-label { font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing:.05em; margin-top: 2px; }
.mfa-confetti-piece { position:absolute; top: -10%; width: 8px; height: 14px; opacity:.9; animation: mfa-confetti linear infinite; }

/* ---------- Data-modal-ish note ---------- */
.mfa-note { font-size: 12.5px; color: var(--muted); margin-top: 4px; }

/* ---------- Responsive ---------- */
@media (max-width: 640px) {
  .mfa-panel { padding: 20px 16px; border-radius: 20px; }
  .mfa-header { padding: 12px 14px; }
}
`;

/* ================================================================== */
/*  Small shared bits                                                  */
/* ================================================================== */

function IconBadge({ icon: Icon }: { icon: typeof Bird }) {
  return <Icon size={16} />;
}

function AttrChip({ icon: Icon, label }: { icon: typeof Bird; label: string }) {
  return (
    <span className="mfa-attr-chip">
      <Icon size={15} /> {label}
    </span>
  );
}

function FeedbackBanner({ kind, children }: { kind: "good" | "bad" | "info"; children: ReactNode }) {
  const Icon = kind === "good" ? CheckCircle2 : kind === "bad" ? XCircle : HelpCircle;
  return (
    <div className={`mfa-feedback ${kind}`}>
      <Icon size={19} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>{children}</div>
    </div>
  );
}

function Scene() {
  const fireflies = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        top: `${20 + ((i * 53) % 70)}%`,
        delay: `${(i % 8) * 0.5}s`,
        dur: `${3 + (i % 5)}s`,
      })),
    []
  );
  const birds = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        top: `${10 + i * 14}%`,
        delay: `${i * 6}s`,
        dur: `${26 + i * 8}s`,
      })),
    []
  );
  return (
    <div className="mfa-scene" aria-hidden="true">
      {fireflies.map((f, i) => (
        <span key={i} className="mfa-firefly" style={{ left: f.left, top: f.top, animationDelay: f.delay, animationDuration: f.dur }} />
      ))}
      {birds.map((b, i) => (
        <Bird key={i} size={22} className="mfa-bird" style={{ top: b.top, animationDelay: b.delay, animationDuration: b.dur }} />
      ))}
      <div className="mfa-ground-glow" />
    </div>
  );
}

/* ================================================================== */
/*  Decision tree visual                                                */
/* ================================================================== */

type TreeStage = 0 | 1 | 2 | 3;
type NodeId = "root" | "yesBird" | "no" | "mammal" | "water" | "fish" | "bird2" | "amphibian";

const NODE_POS: Record<NodeId, { x: number; y: number }> = {
  root: { x: 500, y: 42 },
  yesBird: { x: 150, y: 205 },
  no: { x: 630, y: 205 },
  mammal: { x: 390, y: 365 },
  water: { x: 830, y: 365 },
  fish: { x: 650, y: 520 },
  bird2: { x: 830, y: 520 },
  amphibian: { x: 970, y: 520 },
};

function TreeNode({
  id, title, sub, icon: Icon, kind, state, active,
}: {
  id: NodeId; title: string; sub?: string; icon: typeof Bird;
  kind: "question" | "leaf"; state?: "bloom" | "dry"; active?: boolean;
}) {
  const p = NODE_POS[id];
  return (
    <div
      className={`mfa-tree-node ${kind}${state ? ` ${state}` : ""}${active ? " active-q" : ""}`}
      style={{ left: `${p.x / 10}%`, top: `${(p.y / 560) * 100}%` }}
    >
      <Icon size={18} style={{ color: kind === "question" ? "var(--amber-soft)" : undefined }} />
      <div className="mfa-tree-node-title">{title}</div>
      {sub && <div className="mfa-tree-node-sub">{sub}</div>}
    </div>
  );
}

function Placeholder({ id }: { id: NodeId }) {
  const p = NODE_POS[id];
  return (
    <div className="mfa-tree-placeholder" style={{ left: `${p.x / 10}%`, top: `${(p.y / 560) * 100}%` }}>
      <HelpCircle size={16} />
    </div>
  );
}

function Edge({ from, to, active, tag }: { from: NodeId; to: NodeId; active?: boolean; tag?: string }) {
  const a = NODE_POS[from];
  const b = NODE_POS[to];
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  return (
    <>
      <path className={`mfa-tree-edge grown${active ? " active" : ""}`} d={`M ${a.x} ${a.y + 26} Q ${midX} ${(a.y + b.y) / 2} ${b.x} ${b.y - 34}`} />
      {tag && (
        <foreignObject x={midX - 20} y={midY - 12} width="40" height="20" style={{ overflow: "visible" }}>
          <div className="mfa-edge-tag" style={{ position: "static", transform: "translate(-10%,-4%)" }}>{tag}</div>
        </foreignObject>
      )}
    </>
  );
}

function DecisionTree({ stage, highlight = [], activeNode }: { stage: TreeStage; highlight?: NodeId[]; activeNode?: NodeId }) {
  const has = (n: NodeId) =>
    n === "root" ? true :
    n === "yesBird" || n === "no" ? stage >= 1 :
    n === "mammal" || n === "water" ? stage >= 2 :
    stage >= 3;

  const isHi = (a: NodeId, b: NodeId) => highlight.includes(a) && highlight.includes(b);

  return (
    <div className="mfa-tree-wrap">
      <div className="mfa-tree-canvas">
        <svg className="mfa-tree-svg" viewBox="0 0 1000 560" preserveAspectRatio="none">
          {has("yesBird") && <Edge from="root" to="yesBird" tag="Yes" active={isHi("root", "yesBird")} />}
          {has("no") && <Edge from="root" to="no" tag="No" active={isHi("root", "no")} />}
          {has("mammal") && <Edge from="no" to="mammal" tag="No" active={isHi("no", "mammal")} />}
          {has("water") && <Edge from="no" to="water" tag="Yes" active={isHi("no", "water")} />}
          {has("fish") && <Edge from="water" to="fish" tag="0" active={isHi("water", "fish")} />}
          {has("bird2") && <Edge from="water" to="bird2" tag="2" active={isHi("water", "bird2")} />}
          {has("amphibian") && <Edge from="water" to="amphibian" tag="4" active={isHi("water", "amphibian")} />}
        </svg>

        <TreeNode id="root" title="Can Fly?" icon={Wind} kind="question" active={activeNode === "root"} />

        {has("yesBird") ? (
          <TreeNode id="yesBird" title="Bird" sub="Duck" icon={Bird} kind="leaf" state="bloom" />
        ) : (
          <Placeholder id="yesBird" />
        )}

        {has("no") ? (
          <TreeNode id="no" title="Lives in Water?" icon={Waves} kind="question" active={activeNode === "no"} />
        ) : (
          <Placeholder id="no" />
        )}

        {has("mammal") ? (
          <TreeNode id="mammal" title="Mammal" sub="Dog, Cat" icon={PawPrint} kind="leaf" state="bloom" />
        ) : stage >= 1 ? <Placeholder id="mammal" /> : null}

        {has("water") ? (
          <TreeNode id="water" title="Legs?" icon={Footprints} kind="question" active={activeNode === "water"} />
        ) : stage >= 1 ? <Placeholder id="water" /> : null}

        {has("fish") ? (
          <TreeNode id="fish" title="Fish" sub="0 legs" icon={Fish} kind="leaf" state="bloom" />
        ) : stage >= 2 ? <Placeholder id="fish" /> : null}
        {has("bird2") ? (
          <TreeNode id="bird2" title="Bird" sub="2 legs · Penguin" icon={Bird} kind="leaf" state="bloom" />
        ) : stage >= 2 ? <Placeholder id="bird2" /> : null}
        {has("amphibian") ? (
          <TreeNode id="amphibian" title="Amphibian" sub="4 legs · Frog" icon={Leaf} kind="leaf" state="bloom" />
        ) : stage >= 2 ? <Placeholder id="amphibian" /> : null}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Progress tracker + badge shelf                                     */
/* ================================================================== */

const CHAPTER_TITLES = ["Understand", "Find the Split", "Grow the Tree", "Predict", "Save the Forest"];

function Tracker({ chapter }: { chapter: number }) {
  return (
    <div className="mfa-tracker">
      {CHAPTER_TITLES.map((t, i) => {
        const n = i + 1;
        const done = chapter > n;
        const active = chapter === n;
        return (
          <div className="mfa-tracker-step" key={t}>
            <div className={`mfa-tracker-node${done ? " done" : ""}${active ? " active" : ""}`}>
              {done ? <CheckCircle2 size={16} /> : n}
              <span className="mfa-tracker-label">{t}</span>
            </div>
            {i < CHAPTER_TITLES.length - 1 && (
              <div className="mfa-tracker-line">
                <div className="mfa-tracker-line-fill" style={{ width: chapter > n ? "100%" : "0%" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BadgeShelf({ unlocked }: { unlocked: Set<string> }) {
  return (
    <div className="mfa-badges">
      {BADGES.map((b) => (
        <div key={b.id} className={`mfa-badge${unlocked.has(b.id) ? " unlocked" : ""}`} title={`${b.label} — ${b.desc}`}>
          <IconBadge icon={unlocked.has(b.id) ? b.icon : Lock} />
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

export default function Page() {
  const [chapter, setChapter] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const [achievements, setAchievements] = useState<Set<string>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hardMode, setHardMode] = useState(false);

  function unlock(id: string) {
    setAchievements((s) => (s.has(id) ? s : new Set(s).add(id)));
  }
  function markCorrect() { setCorrectCount((c) => c + 1); }
  function markWrong() { setWrongCount((c) => c + 1); }

  /* ---------------- Chapter 1 ---------------- */
  const [ch1Answer, setCh1Answer] = useState<string | null>(null);
  const ch1Correct = ch1Answer === "Class";

  /* ---------------- Chapter 2 (root split) ---------------- */
  const [rootChoice, setRootChoice] = useState<string | null>(null);
  const rootSolved = rootChoice === "fly";

  /* ---------------- Chapter 3 (sub splits) ---------------- */
  const [noFlyChoice, setNoFlyChoice] = useState<string | null>(null);
  const noFlySolved = noFlyChoice === "water";
  const [waterChoice, setWaterChoice] = useState<string | null>(null);
  const waterSolved = waterChoice === "legs";

  const treeStage: TreeStage = waterSolved ? 3 : noFlySolved ? 2 : rootSolved ? 1 : 0;
  const purity = treeStage === 3 ? 100 : treeStage === 2 ? 66.7 : treeStage === 1 ? 50 : 33.3;

  useEffect(() => { if (rootSolved) unlock("first-split"); }, [rootSolved]);
  useEffect(() => { if (noFlySolved) unlock("smart-decision"); }, [noFlySolved]);
  useEffect(() => { if (waterSolved) unlock("tree-builder"); }, [waterSolved]);

  /* ---------------- Chapter 4 (predict) ---------------- */
  const [ch4Index, setCh4Index] = useState(0);
  const [ch4Step, setCh4Step] = useState<"fly" | "water" | "legs" | "done">("fly");
  const [ch4Feedback, setCh4Feedback] = useState<{ kind: "good" | "bad"; text: string } | null>(null);
  const [ch4MistakeThisRun, setCh4MistakeThisRun] = useState(false);
  const [ch4AnyMistake, setCh4AnyMistake] = useState(false);
  const ch4Animal = CH4_ANIMALS[ch4Index];
  const ch4Path: NodeId[] = useMemo(() => {
    const p: NodeId[] = ["root"];
    if (ch4Step === "fly") return p;
    if (ch4Animal.canFly) { p.push("yesBird"); return p; }
    p.push("no");
    if (ch4Step === "water") return p;
    if (!ch4Animal.livesInWater) { p.push("mammal"); return p; }
    p.push("water");
    if (ch4Step === "legs") return p;
    p.push(ch4Animal.legs === 0 ? "fish" : ch4Animal.legs === 2 ? "bird2" : "amphibian");
    return p;
  }, [ch4Step, ch4Animal]);

  function ch4Answer(kind: "fly" | "water", value: boolean) {
    const correctValue = kind === "fly" ? ch4Animal.canFly : ch4Animal.livesInWater;
    if (value === correctValue) {
      markCorrect();
      setCh4Feedback(null);
      setCh4Step(kind === "fly" ? (ch4Animal.canFly ? "done" : "water") : ch4Animal.livesInWater ? "legs" : "done");
    } else {
      markWrong();
      setCh4MistakeThisRun(true);
      setCh4AnyMistake(true);
      setCh4Feedback({ kind: "bad", text: `Not quite — ${ch4Animal.name} ${kind === "fly" ? (ch4Animal.canFly ? "actually can fly!" : "actually can't fly.") : (ch4Animal.livesInWater ? "actually does live in water." : "actually doesn't live in water.")} Try the other branch.` });
    }
  }
  function ch4AnswerLegs(value: number) {
    if (value === ch4Animal.legs) {
      markCorrect();
      setCh4Feedback(null);
      setCh4Step("done");
    } else {
      markWrong();
      setCh4MistakeThisRun(true);
      setCh4AnyMistake(true);
      setCh4Feedback({ kind: "bad", text: `${ch4Animal.name} doesn't have ${value} legs — look at the attribute card again.` });
    }
  }
  function ch4Next() {
    if (ch4Index < CH4_ANIMALS.length - 1) {
      setCh4Index((i) => i + 1);
      setCh4Step("fly");
      setCh4Feedback(null);
      setCh4MistakeThisRun(false);
    } else {
      if (!ch4AnyMistake) unlock("perfect-prediction");
      setChapter(5);
    }
  }
  const ch4Predicted = ch4Step === "done" ? classify(ch4Animal) : null;

  /* ---------------- Chapter 5 (mystery / forest) ---------------- */
  const [mysteryOrder] = useState<number[]>(() => {
    const idx = MYSTERY_ANIMALS.map((_, i) => i);
    return idx;
  });
  const [mysteryIndex, setMysteryIndex] = useState(0);
  const [mysteryResults, setMysteryResults] = useState<Array<"correct" | "wrong" | null>>(Array(MYSTERY_ANIMALS.length).fill(null));
  const [mysteryChoice, setMysteryChoice] = useState<string | null>(null);
  const [mysteryFeedback, setMysteryFeedback] = useState<{ kind: "good" | "bad"; text: string } | null>(null);
  const forestPercent = Math.round((mysteryResults.filter((r) => r === "correct").length / MYSTERY_ANIMALS.length) * 100);
  const mysteryAnimal = MYSTERY_ANIMALS[mysteryOrder[mysteryIndex]];
  const mysteryDone = mysteryIndex >= MYSTERY_ANIMALS.length;

  function setMysteryResultAt(index: number, result: "correct" | "wrong") {
    setMysteryResults((prev) => {
      const next = prev.map((v, i) => (i === index ? result : v));
      if (next.every((r) => r === "correct")) unlock("forest-guardian");
      return next;
    });
  }

  function pickMystery(guess: string) {
    const truth = classify(mysteryAnimal);
    setMysteryChoice(guess);
    if (guess === truth) {
      markCorrect();
      setMysteryResultAt(mysteryOrder[mysteryIndex], "correct");
      setMysteryFeedback({ kind: "good", text: `Correct! ${mysteryAnimal.name} is a ${truth}. Part of the forest blooms again. 🌱` });
    } else {
      markWrong();
      if (hardMode) {
        setMysteryResultAt(mysteryOrder[mysteryIndex], "wrong");
      }
      setMysteryFeedback({ kind: "bad", text: hardMode ? `Not quite — ${mysteryAnimal.name} is actually a ${truth}. In Hard Mode there's no retry — moving on.` : `Not quite — walk the tree again: Can it fly? Does it live in water? How many legs?` });
    }
  }
  function mysteryNext() {
    const solvedThisOne = mysteryResults[mysteryOrder[mysteryIndex]] !== null;
    if (!solvedThisOne && !hardMode) return; // must get it right unless hard mode already recorded wrong
    setMysteryIndex((i) => i + 1);
    setMysteryChoice(null);
    setMysteryFeedback(null);
  }

  /* ---------------- Certificate / restart ---------------- */
  const missionScore = correctCount + wrongCount === 0 ? 0 : Math.round((correctCount / (correctCount + wrongCount)) * 100);

  function resetAll() {
    setChapter(1);
    setAchievements(new Set());
    setCorrectCount(0); setWrongCount(0);
    setCh1Answer(null);
    setRootChoice(null); setNoFlyChoice(null); setWaterChoice(null);
    setCh4Index(0); setCh4Step("fly"); setCh4Feedback(null); setCh4MistakeThisRun(false); setCh4AnyMistake(false);
    setMysteryIndex(0); setMysteryResults(Array(MYSTERY_ANIMALS.length).fill(null)); setMysteryChoice(null); setMysteryFeedback(null);
  }
  function startHardMode() {
    setHardMode(true);
    resetAll();
  }

  const showCertificate = chapter === 6;

  return (
    <div className="mfa-app" data-theme="dark">
      <style>{STYLES}</style>
      <Scene />

      <div className="mfa-shell">
        <header className="mfa-header">
          <div className="mfa-brand">
            <div className="mfa-brand-icon"><TreePine size={20} /></div>
            <div>
              <div className="mfa-brand-title">Mission: Save the AI Forest</div>
              <div className="mfa-brand-sub">You are the AI Engineer</div>
            </div>
          </div>
          <div className="mfa-header-right">
            <BadgeShelf unlocked={achievements} />
            <button className="mfa-icon-btn" onClick={() => setSoundOn((s) => !s)} aria-label="Toggle forest sounds">
              {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          </div>
        </header>

        {!showCertificate && <Tracker chapter={chapter} />}

        {/* ============================================================ CHAPTER 1 */}
        {chapter === 1 && (
          <section className="mfa-panel">
            <span className="mfa-eyebrow"><Sparkles size={13} /> Chapter 1</span>
            <h1 className="mfa-h1">Understand the Data</h1>
            <p className="mfa-lead">
              A storm shattered the AI Forest&apos;s magical Decision Tree. Before you can rebuild it, study how these six
              animals were sorted — the pattern hidden in this table is what your tree will learn.
            </p>

            <div className="mfa-table-wrap">
              <table className="mfa-table">
                <thead>
                  <tr><th>Animal</th><th>Legs</th><th>Can Fly</th><th>Lives in Water</th><th>Class</th></tr>
                </thead>
                <tbody>
                  {BASE_ANIMALS.map((a) => {
                    const cls = classify(a);
                    const ClsIcon = CLASS_ICON[cls];
                    return (
                      <tr key={a.name}>
                        <td className="mfa-table-name"><PawPrint size={14} style={{ opacity: .5 }} /> {a.name}</td>
                        <td>{a.legs}</td>
                        <td><span className={`mfa-pill ${a.canFly ? "mfa-pill-yes" : "mfa-pill-no"}`}>{a.canFly ? "Yes" : "No"}</span></td>
                        <td><span className={`mfa-pill ${a.livesInWater ? "mfa-pill-yes" : "mfa-pill-no"}`}>{a.livesInWater ? "Yes" : "No"}</span></td>
                        <td><span className="mfa-class-chip" style={{ color: CLASS_COLOR[cls] }}><ClsIcon size={14} /> {cls}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mfa-lead" style={{ marginTop: 18, marginBottom: 6 }}>
              <b>Which column is the AI trying to predict?</b>
            </p>
            <div className="mfa-choice-grid">
              {["Animal", "Legs", "Class", "Lives in Water"].map((opt) => (
                <button
                  key={opt}
                  className={`mfa-choice-card${ch1Answer === opt ? (opt === "Class" ? " correct" : " wrong") : ""}`}
                  onClick={() => setCh1Answer(opt)}
                >
                  <div className="mfa-choice-icon"><HelpCircle size={17} /></div>
                  <div className="mfa-choice-label">{opt}</div>
                </button>
              ))}
            </div>

            {ch1Answer && (
              ch1Correct ? (
                <FeedbackBanner kind="good">
                  <b>Exactly.</b> <b>Class</b> is what we want the AI to guess. Everything else — Legs, Can Fly, Lives in
                  Water — are <b>clues</b> the AI reads to make that guess.
                </FeedbackBanner>
              ) : (
                <FeedbackBanner kind="bad">
                  {ch1Answer === "Animal" && <>Close, but a name doesn&apos;t describe the animal&apos;s traits — it&apos;s just a label, not a clue.</>}
                  {ch1Answer === "Legs" && <>Legs is one of the <b>clues</b> the AI uses — but it isn&apos;t the thing we&apos;re guessing.</>}
                  {ch1Answer === "Lives in Water" && <>Lives in Water is a helpful clue, but it&apos;s not the final answer we want.</>}
                  <> Look for the column that names the animal&apos;s <b>group</b>.</>
                </FeedbackBanner>
              )
            )}

            <div className="mfa-btn-row">
              <button className="mfa-btn mfa-btn-primary" disabled={!ch1Correct} onClick={() => setChapter(2)}>
                Continue to Chapter 2 <ChevronRight size={16} />
              </button>
            </div>
          </section>
        )}

        {/* ============================================================ CHAPTER 2 */}
        {chapter === 2 && (
          <section className="mfa-panel">
            <span className="mfa-eyebrow"><Wind size={13} /> Chapter 2</span>
            <h1 className="mfa-h1">Find the First Split</h1>
            <p className="mfa-lead">The AI needs one question to ask <em>first</em> — a question that sorts the animals as cleanly as possible. What should it check?</p>

            <div className="mfa-choice-grid">
              {[
                { key: "legs", label: "Number of Legs", icon: Footprints },
                { key: "fly", label: "Can Fly", icon: Wind },
                { key: "water", label: "Lives in Water", icon: Waves },
                { key: "name", label: "Animal Name", icon: PawPrint },
              ].map((opt) => (
                <button
                  key={opt.key}
                  className={`mfa-choice-card${rootChoice === opt.key ? (opt.key === "fly" ? " correct" : " wrong") : ""}`}
                  onClick={() => { setRootChoice(opt.key); if (opt.key === "fly") markCorrect(); else markWrong(); }}
                >
                  <div className="mfa-choice-icon"><opt.icon size={17} /></div>
                  <div className="mfa-choice-label">{opt.label}</div>
                </button>
              ))}
            </div>

            {rootChoice && !rootSolved && (
              <FeedbackBanner kind="bad">
                {rootChoice === "name" ? (
                  <>Every animal has a <b>different name</b> — that would sort them into six lonely branches of one. It looks
                  perfectly clean, but it&apos;s a trap: the tree could never guess the class of an animal it hasn&apos;t seen before.</>
                ) : rootChoice === "legs" ? (
                  <>Legs will matter later — but right now it mixes flying and non-flying animals together. Try again.</>
                ) : (
                  <>Lives in Water mixes fish, frogs <em>and</em> penguins into one messy branch this early. Try again.</>
                )}
              </FeedbackBanner>
            )}
            {rootSolved && (
              <FeedbackBanner kind="good">
                <b>Great instinct!</b> In this dataset, only flying animals are birds — <b>Can Fly?</b> instantly separates
                Duck into its own clean branch.
              </FeedbackBanner>
            )}

            {rootSolved && (
              <div style={{ marginTop: 10 }}>
                <DecisionTree stage={1} />
              </div>
            )}

            <div className="mfa-btn-row">
              <button className="mfa-btn mfa-btn-ghost" onClick={() => setChapter(1)}>Back</button>
              <button className="mfa-btn mfa-btn-primary" disabled={!rootSolved} onClick={() => setChapter(3)}>
                Continue to Chapter 3 <ChevronRight size={16} />
              </button>
            </div>
          </section>
        )}

        {/* ============================================================ CHAPTER 3 */}
        {chapter === 3 && (
          <section className="mfa-panel">
            <span className="mfa-eyebrow"><TreeDeciduous size={13} /> Chapter 3</span>
            <h1 className="mfa-h1">Grow the Tree</h1>
            <p className="mfa-lead">
              The <b>Can Fly = Yes</b> branch only has Duck in it — already pure, nothing to fix. But the <b>No</b> branch
              still has Dog, Cat, Fish, Penguin and Frog all mixed together. Keep splitting until every branch blooms.
            </p>

            <div className="mfa-purity">
              <div className="mfa-purity-head">
                <span className="mfa-purity-label">Tree Purity</span>
                <span className="mfa-purity-val mfa-mono">{purity.toFixed(1)}%</span>
              </div>
              <div className="mfa-purity-track"><div className="mfa-purity-fill" style={{ width: `${purity}%` }} /></div>
            </div>

            <DecisionTree stage={treeStage} />

            {!noFlySolved && (
              <>
                <p className="mfa-lead" style={{ marginTop: 18, marginBottom: 6 }}>
                  <b>Dog, Cat, Fish, Penguin, Frog</b> are mixed. What should the AI check next?
                </p>
                <div className="mfa-choice-grid">
                  {[
                    { key: "water", label: "Lives in Water", icon: Waves },
                    { key: "legs", label: "Number of Legs", icon: Footprints },
                    { key: "name", label: "Animal Name", icon: PawPrint },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className={`mfa-choice-card${noFlyChoice === opt.key ? (opt.key === "water" ? " correct" : " wrong") : ""}`}
                      onClick={() => { setNoFlyChoice(opt.key); if (opt.key === "water") markCorrect(); else markWrong(); }}
                    >
                      <div className="mfa-choice-icon"><opt.icon size={17} /></div>
                      <div className="mfa-choice-label">{opt.label}</div>
                    </button>
                  ))}
                </div>
                {noFlyChoice && !noFlySolved && (
                  <FeedbackBanner kind="bad">
                    {noFlyChoice === "name"
                      ? <>Same trap as before — unique names look perfect but can&apos;t generalize.</>
                      : <>Legs helps a little, but right now Lives in Water separates Dog &amp; Cat from the rest much more cleanly.</>}
                  </FeedbackBanner>
                )}
                {noFlySolved && (
                  <FeedbackBanner kind="good">
                    <b>Nice!</b> Dog and Cat land in a pure <b>Mammal</b> branch. Fish, Penguin and Frog are still mixed — one more split to go.
                  </FeedbackBanner>
                )}
              </>
            )}

            {noFlySolved && !waterSolved && (
              <>
                <p className="mfa-lead" style={{ marginTop: 18, marginBottom: 6 }}>
                  <b>Fish, Penguin, Frog</b> all live in water. What should the AI check next?
                </p>
                <div className="mfa-choice-grid">
                  {[
                    { key: "legs", label: "Number of Legs", icon: Footprints },
                    { key: "fly", label: "Can Fly", icon: Wind },
                    { key: "name", label: "Animal Name", icon: PawPrint },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className={`mfa-choice-card${waterChoice === opt.key ? (opt.key === "legs" ? " correct" : " wrong") : ""}`}
                      onClick={() => { setWaterChoice(opt.key); if (opt.key === "legs") markCorrect(); else markWrong(); }}
                    >
                      <div className="mfa-choice-icon"><opt.icon size={17} /></div>
                      <div className="mfa-choice-label">{opt.label}</div>
                    </button>
                  ))}
                </div>
                {waterChoice && !waterSolved && (
                  <FeedbackBanner kind="bad">
                    {waterChoice === "fly" ? <>We already know none of these three can fly — that question won&apos;t split anything.</> : <>Unique names again won&apos;t generalize to new animals.</>}
                  </FeedbackBanner>
                )}
              </>
            )}

            {waterSolved && (
              <FeedbackBanner kind="good">
                <b>Perfect!</b> Fish (0 legs), Penguin (2 legs) and Frog (4 legs) each land in their own pure leaf. Purity is
                100% — the tree is fully grown! 🌳
              </FeedbackBanner>
            )}

            <div className="mfa-btn-row">
              {(noFlyChoice || waterChoice) && !waterSolved && (
                <button
                  className="mfa-btn mfa-btn-ghost"
                  onClick={() => { setNoFlyChoice(null); setWaterChoice(null); }}
                >
                  <Undo2 size={15} /> Undo &amp; try a different split
                </button>
              )}
              <button className="mfa-btn mfa-btn-ghost" onClick={() => setChapter(2)}>Back</button>
              <button className="mfa-btn mfa-btn-primary" disabled={!waterSolved} onClick={() => setChapter(4)}>
                Continue to Chapter 4 <ChevronRight size={16} />
              </button>
            </div>
          </section>
        )}

        {/* ============================================================ CHAPTER 4 */}
        {chapter === 4 && (
          <section className="mfa-panel">
            <span className="mfa-eyebrow"><Feather size={13} /> Chapter 4</span>
            <h1 className="mfa-h1">Predict New Animals</h1>
            <p className="mfa-lead">
              The tree is complete. Now walk brand-new animals through it yourself — click each branch instead of
              pressing a magic button.
            </p>

            <div className="mfa-dot-row">
              {CH4_ANIMALS.map((a, i) => (
                <div key={a.name} className={`mfa-dot${i === ch4Index ? " active" : ""}${i < ch4Index ? " done-correct" : ""}`}>{i + 1}</div>
              ))}
            </div>

            <div className="mfa-attrs">
              <AttrChip icon={Footprints} label={`${ch4Animal.legs} legs`} />
              <AttrChip icon={Wind} label="Can it fly?" />
              <AttrChip icon={Waves} label="Lives in water?" />
              <span className="mfa-class-chip mfa-display" style={{ fontSize: 18 }}>{ch4Animal.name}</span>
            </div>

            <DecisionTree stage={3} highlight={ch4Path} activeNode={ch4Step === "fly" ? "root" : ch4Step === "water" ? "no" : ch4Step === "legs" ? "water" : undefined} />

            {ch4Step !== "done" && (
              <div className="mfa-btn-row" style={{ marginTop: 14 }}>
                {ch4Step === "fly" && (
                  <>
                    <button className="mfa-btn mfa-btn-ghost" onClick={() => ch4Answer("fly", true)}>Yes, it can fly</button>
                    <button className="mfa-btn mfa-btn-ghost" onClick={() => ch4Answer("fly", false)}>No, it can&apos;t fly</button>
                  </>
                )}
                {ch4Step === "water" && (
                  <>
                    <button className="mfa-btn mfa-btn-ghost" onClick={() => ch4Answer("water", true)}>Yes, lives in water</button>
                    <button className="mfa-btn mfa-btn-ghost" onClick={() => ch4Answer("water", false)}>No, lives on land</button>
                  </>
                )}
                {ch4Step === "legs" && (
                  <>
                    <button className="mfa-btn mfa-btn-ghost" onClick={() => ch4AnswerLegs(0)}>0 legs</button>
                    <button className="mfa-btn mfa-btn-ghost" onClick={() => ch4AnswerLegs(2)}>2 legs</button>
                    <button className="mfa-btn mfa-btn-ghost" onClick={() => ch4AnswerLegs(4)}>4 legs</button>
                  </>
                )}
              </div>
            )}

            {ch4Feedback && <div style={{ marginTop: 14 }}><FeedbackBanner kind={ch4Feedback.kind}>{ch4Feedback.text}</FeedbackBanner></div>}

            {ch4Step === "done" && ch4Predicted && (
              <div style={{ marginTop: 14 }}>
                <FeedbackBanner kind="good">
                  <b>{ch4Animal.name} is a {ch4Predicted}!</b>{" "}
                  {ch4Animal.canFly
                    ? "It can fly, so the tree sent it straight to Bird."
                    : !ch4Animal.livesInWater
                    ? "It can't fly and doesn't live in water, so it's a Mammal."
                    : ch4Animal.legs === 0
                    ? "It can't fly, lives in water, and has 0 legs — Fish."
                    : ch4Animal.legs === 2
                    ? "It can't fly, lives in water, and has 2 legs — Bird, just like Penguin."
                    : "It can't fly, lives in water, and has 4 legs — Amphibian, just like Frog."}
                  {ch4MistakeThisRun && " You corrected course along the way — that's exactly how debugging a model feels!"}
                </FeedbackBanner>
                <div className="mfa-btn-row">
                  <button className="mfa-btn mfa-btn-primary" onClick={ch4Next}>
                    {ch4Index < CH4_ANIMALS.length - 1 ? "Next Animal" : "Continue to Chapter 5"} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ============================================================ CHAPTER 5 */}
        {chapter === 5 && (
          <section className="mfa-panel">
            <span className="mfa-eyebrow"><TreePine size={13} /> Chapter 5</span>
            <h1 className="mfa-h1">Save the AI Forest</h1>
            <p className="mfa-lead">Ten mystery animals need your help. Classify each one correctly to restore the forest.</p>

            <div className="mfa-forest-stage">
              <div className="mfa-forest-pct mfa-mono">{forestPercent}%</div>
              <div className="mfa-forest-row">
                {Array.from({ length: 9 }, (_, i) => {
                  const grownAt = Math.ceil(((i + 1) / 9) * 100);
                  return <TreePine key={i} size={30 + (i % 3) * 8} className={`mfa-forest-tree${forestPercent >= grownAt ? " grown" : ""}`} />;
                })}
              </div>
              {Array.from({ length: 6 }, (_, i) => (
                <Flower2
                  key={i}
                  size={16}
                  className={`mfa-forest-flower${forestPercent >= (i + 1) * 16 ? " show" : ""}`}
                  style={{ left: `${8 + i * 16}%` }}
                />
              ))}
            </div>

            <div className="mfa-dot-row">
              {MYSTERY_ANIMALS.map((_, i) => (
                <div
                  key={i}
                  className={`mfa-dot${i === mysteryIndex ? " active" : ""}${mysteryResults[mysteryOrder[i]] === "correct" ? " done-correct" : ""}${mysteryResults[mysteryOrder[i]] === "wrong" ? " done-wrong" : ""}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {!mysteryDone ? (
              <>
                <div className="mfa-attrs">
                  <AttrChip icon={Footprints} label={`${mysteryAnimal.legs} legs`} />
                  <AttrChip icon={Wind} label={mysteryAnimal.canFly ? "Can fly" : "Cannot fly"} />
                  <AttrChip icon={Waves} label={mysteryAnimal.livesInWater ? "Lives in water" : "Lives on land"} />
                  <span className="mfa-class-chip mfa-display" style={{ fontSize: 18 }}>Mystery Animal: {mysteryAnimal.name}</span>
                </div>

                <div className="mfa-class-grid">
                  {CLASS_OPTIONS.map((c) => {
                    const Icon = CLASS_ICON[c];
                    const chosen = mysteryChoice === c;
                    const truth = classify(mysteryAnimal);
                    const cls = chosen ? (c === truth ? "correct" : "wrong") : "";
                    return (
                      <button key={c} className={`mfa-class-card ${cls}`} onClick={() => pickMystery(c)}>
                        <Icon size={22} style={{ color: CLASS_COLOR[c] }} />
                        {c}
                      </button>
                    );
                  })}
                </div>

                {mysteryFeedback && <FeedbackBanner kind={mysteryFeedback.kind}>{mysteryFeedback.text}</FeedbackBanner>}

                <div className="mfa-btn-row">
                  <button
                    className="mfa-btn mfa-btn-primary"
                    disabled={mysteryResults[mysteryOrder[mysteryIndex]] === null}
                    onClick={mysteryNext}
                  >
                    {mysteryIndex < MYSTERY_ANIMALS.length - 1 ? "Next Mystery Animal" : "Finish Mission"} <ChevronRight size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <FeedbackBanner kind="good">
                  <b>🏆 Forest Saved!</b> You successfully rebuilt the AI Decision Tree and every animal found its way home.
                </FeedbackBanner>
                <div className="mfa-btn-row">
                  <button className="mfa-btn mfa-btn-primary" onClick={() => setChapter(6)}>
                    <PartyPopper size={16} /> View Certificate
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* ============================================================ CERTIFICATE */}
        {showCertificate && (
          <section className="mfa-cert">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className="mfa-confetti-piece"
                style={{
                  left: `${(i * 41) % 100}%`,
                  background: [`var(--amber)`, `var(--teal)`, `var(--leaf)`, `var(--rose)`][i % 4],
                  animationDuration: `${3 + (i % 4)}s`,
                  animationDelay: `${(i % 6) * 0.3}s`,
                }}
              />
            ))}
            <div className="mfa-cert-ring"><Trophy size={38} /></div>
            <div className="mfa-cert-title">Decision Tree Explorer</div>
            <p className="mfa-cert-sub">
              Congratulations! You successfully rebuilt the AI Forest by thinking like a Machine Learning algorithm —
              one clean split at a time.
            </p>

            <div className="mfa-cert-stats">
              <div className="mfa-cert-stat"><div className="mfa-cert-stat-val mfa-mono">{correctCount}</div><div className="mfa-cert-stat-label">Correct Decisions</div></div>
              <div className="mfa-cert-stat"><div className="mfa-cert-stat-val mfa-mono">{wrongCount}</div><div className="mfa-cert-stat-label">Wrong Decisions</div></div>
              <div className="mfa-cert-stat"><div className="mfa-cert-stat-val mfa-mono">100%</div><div className="mfa-cert-stat-label">Tree Purity</div></div>
              <div className="mfa-cert-stat"><div className="mfa-cert-stat-val mfa-mono">{forestPercent}%</div><div className="mfa-cert-stat-label">Forest Restored</div></div>
              <div className="mfa-cert-stat"><div className="mfa-cert-stat-val mfa-mono">{missionScore}</div><div className="mfa-cert-stat-label">Mission Score</div></div>
            </div>

            <div style={{ marginBottom: 20 }}><BadgeShelf unlocked={achievements} /></div>

            <div className="mfa-btn-row" style={{ justifyContent: "center" }}>
              <button className="mfa-btn mfa-btn-ghost" onClick={resetAll}><RotateCcw size={15} /> Restart Mission</button>
              {!hardMode && (
                <button className="mfa-btn mfa-btn-amber" onClick={startHardMode}><Wand2 size={15} /> Try Hard Mode</button>
              )}
              <button className="mfa-btn mfa-btn-primary" onClick={() => setChapter(1)}><Home size={15} /> Back to Start</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}