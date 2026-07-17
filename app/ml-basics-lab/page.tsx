"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Brain,
  Layers,
  Target,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Compass,
  GitBranch,
  TrendingUp,
  Zap,
  Gauge,
  MapPin,
  Trophy,
  Star,
  Ban,
  Dices,
  Play,
  Pause,
  RefreshCw,
  Info,
  Share2,
  Bot,
  Gamepad2,
  SlidersHorizontal,
  MousePointer2,
  Database,
  Users,
  Rocket,
  Mail,
  Home as HomeIcon,
  Stethoscope,
  Film,
  Car,
  ShieldAlert,
  Dog,
  Cat,
  Rabbit,
  LucideIcon,
} from "lucide-react";

/* ======================================================================
   DESIGN TOKENS
====================================================================== */

const colors = {
  bg: "#F0F4F8",
  bgSoft: "#E7ECF5",
  bgDeep: "#E2E8F5",
  card: "#FFFFFF",
  cardHover: "#F8FAFC",
  cardSolid: "#F8FAFC",
  border: "rgba(148,163,184,0.25)",
  borderSoft: "rgba(148,163,184,0.18)",
  borderActive: "rgba(99,102,241,0.4)",
  purple: "#8B5CF6",
  purpleDeep: "#7C3AED",
  blue: "#3B82F6",
  blueDeep: "#2563EB",
  cyan: "#06B6D4",
  cyanDeep: "#0E7490",
  green: "#10B981",
  greenDeep: "#059669",
  coral: "#F43F5E",
  coralDeep: "#E11D48",
  amber: "#F59E0B",
  amberDeep: "#F97316",
  ink: "#1E293B",
  inkSoft: "#475569",
  muted: "#94A3B8",
  codeBg: "#1E1B31",
};

const GRADIENT_PBC = `linear-gradient(135deg, ${colors.purple}, ${colors.blue}, ${colors.cyan})`;
const GRADIENT_PB = `linear-gradient(135deg, ${colors.purple}, ${colors.blue})`;
const GRADIENT_BC = `linear-gradient(135deg, ${colors.blue}, ${colors.cyan})`;
const GRADIENT_GREEN = `linear-gradient(135deg, ${colors.green}, ${colors.cyanDeep})`;
const GRADIENT_CORAL = `linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep})`;
const GRADIENT_AMBER = `linear-gradient(135deg, ${colors.amber}, ${colors.amberDeep})`;

/* ======================================================================
   STYLES
====================================================================== */

const STYLES = `
  .mldl-root {
    min-height: 100vh;
    width: 100%;
    padding: 28px 16px 60px 16px;
    background: radial-gradient(circle at 20% -10%, ${colors.bgSoft} 0%, ${colors.bg} 55%);
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    box-sizing: border-box;
    position: relative;
    overflow-x: hidden;
    color: ${colors.ink};
  }
  .mldl-root *, .mldl-root *::before, .mldl-root *::after { box-sizing: border-box; }
  .mldl-root button { font-family: inherit; border: none; background: none; cursor: pointer; color: inherit; }
  .mldl-root button:focus-visible { outline: 3px solid ${colors.purple}; outline-offset: 2px; }
  .mldl-root input[type="range"] { accent-color: ${colors.purple}; }
  @media (prefers-reduced-motion: reduce) {
    .mldl-root * { transition: none !important; animation: none !important; }
  }

  /* -------------------- Floating particles -------------------- */
  .mldl-particle-field { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .mldl-particle {
    position: absolute; border-radius: 999px; opacity: 0.35; filter: blur(0.5px);
    animation: mldl-particle-float linear infinite;
  }
  @keyframes mldl-particle-float {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 0.4; }
    90% { opacity: 0.35; }
    100% { transform: translateY(-120vh) translateX(20px); opacity: 0; }
  }

  .mldl-container { max-width: 1080px; margin: 0 auto; position: relative; z-index: 1; }

  /* -------------------- Header -------------------- */
  .mldl-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 12px; flex-wrap: wrap; }
  .mldl-back-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px;
    border-radius: 999px; background: rgba(255,255,255,0.72); border: 1px solid ${colors.border};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    color: ${colors.inkSoft}; font-weight: 600; font-size: 13px; text-decoration: none;
    transition: transform 0.15s ease, border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
  }
  .mldl-back-btn:hover { color: ${colors.purpleDeep}; border-color: ${colors.borderActive}; transform: translateX(-2px); background: ${colors.cardHover}; }

  .mldl-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; margin-bottom: 26px; }
  .mldl-header-icon {
    width: 62px; height: 62px; border-radius: 20px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${GRADIENT_PBC};
    box-shadow: 0 10px 30px rgba(139,92,246,0.25);
    animation: mldl-bob 3.4s ease-in-out infinite;
  }
  @keyframes mldl-bob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(-4deg); } }
  .mldl-h1 {
    font-family: 'Inter', sans-serif; font-weight: 800; margin: 0; line-height: 1.15;
    font-size: 30px; letter-spacing: -0.02em;
    background: linear-gradient(90deg, ${colors.purpleDeep} 0%, ${colors.blueDeep} 55%, ${colors.cyanDeep} 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .mldl-h1 { font-size: 38px; } }
  .mldl-subtitle { font-size: 15px; color: ${colors.inkSoft}; max-width: 580px; margin: 0 auto; line-height: 1.6; }

  /* -------------------- Progress / stepper -------------------- */
  .mldl-progress-track {
    width: 100%; height: 10px; border-radius: 999px; background: #FFFFFF;
    border: 1px solid ${colors.border}; overflow: hidden; margin-bottom: 18px; position: relative;
  }
  .mldl-progress-fill {
    height: 100%; border-radius: 999px; position: relative; overflow: hidden;
    background: ${GRADIENT_PBC};
    transition: width 0.4s ease;
  }
  .mldl-progress-fill::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: mldl-shimmer 2.2s linear infinite;
  }
  @keyframes mldl-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

  .mldl-stepbar { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 26px; flex-wrap: wrap; }
  .mldl-step-btn {
    display: flex; align-items: center; gap: 7px; padding: 10px 14px; border-radius: 999px;
    font-weight: 700; font-size: 12.5px; flex: 1; min-width: 96px; justify-content: center;
    background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.muted};
    transition: all 0.2s ease;
  }
  .mldl-step-btn:hover { border-color: ${colors.borderActive}; transform: translateY(-2px); }
  .mldl-step-btn.mldl-step-active { background: ${GRADIENT_PBC}; color: #fff; border-color: transparent; box-shadow: 0 6px 18px rgba(139,92,246,0.3); }
  .mldl-step-btn.mldl-step-done { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.35); color: ${colors.greenDeep}; }
  .mldl-step-label { display: none; white-space: nowrap; }
  @media (min-width: 900px) { .mldl-step-label { display: inline; } }

  /* -------------------- Stage shell -------------------- */
  .mldl-stage-shell {
    border-radius: 24px; padding: 22px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  }
  @media (min-width: 720px) { .mldl-stage-shell { padding: 34px; } }
  .mldl-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; flex-wrap: wrap; gap: 8px; }
  .mldl-stage-tag {
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.cyanDeep};
    background: rgba(6,182,212,0.1); padding: 5px 14px; border-radius: 999px; border: 1px solid rgba(6,182,212,0.2);
  }
  .mldl-stage-title {
    font-weight: 800; color: ${colors.purpleDeep}; font-size: 25px; margin: 10px 0 8px 0; letter-spacing: -0.01em;
  }
  @media (min-width: 720px) { .mldl-stage-title { font-size: 30px; } }
  .mldl-stage-subtitle { font-size: 14.5px; color: ${colors.inkSoft}; margin: 0 0 24px 0; line-height: 1.6; max-width: 720px; }

  /* -------------------- Learning type cards (Stage 0) -------------------- */
  .mldl-type-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
  @media (min-width: 760px) { .mldl-type-grid { grid-template-columns: repeat(3, 1fr); } }
  .mldl-type-card {
    position: relative; border-radius: 20px; padding: 22px 18px; text-align: left; cursor: pointer;
    background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    overflow: hidden;
  }
  .mldl-type-card:hover { transform: translateY(-4px); border-color: ${colors.borderActive}; box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
  .mldl-type-card.mldl-type-active { border-color: transparent; box-shadow: 0 16px 40px rgba(139,92,246,0.22); }
  .mldl-type-card.mldl-type-active::before {
    content: ""; position: absolute; inset: 0; padding: 1px; border-radius: 20px;
    background: var(--accent-gradient); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
  }
  .mldl-type-icon-wrap {
    width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
    background: var(--accent-gradient); margin-bottom: 14px; position: relative; z-index: 1;
    animation: mldl-icon-pulse 2.6s ease-in-out infinite;
  }
  @keyframes mldl-icon-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
  .mldl-type-title { font-size: 17px; font-weight: 800; color: ${colors.ink}; margin: 0 0 6px 0; position: relative; z-index: 1; }
  .mldl-type-desc { font-size: 13px; color: ${colors.inkSoft}; margin: 0; line-height: 1.55; position: relative; z-index: 1; }

  /* -------------------- Pipeline canvas -------------------- */
  .mldl-canvas {
    border-radius: 18px; padding: 26px 18px; background: ${colors.card};
    border: 1px solid ${colors.borderSoft}; display: flex; flex-direction: column; align-items: center;
    gap: 4px; min-height: 200px; justify-content: center;
  }
  .mldl-pipe-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .mldl-pipe-node {
    display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 20px; border-radius: 16px;
    background: ${colors.cardSolid}; border: 1px solid ${colors.border}; min-width: 130px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    opacity: 0; animation: mldl-fade-up 0.5s ease forwards;
  }
  .mldl-pipe-node-icon {
    width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center;
    background: var(--accent-gradient);
  }
  .mldl-pipe-node-label { font-size: 12.5px; font-weight: 700; color: ${colors.ink}; text-align: center; }
  .mldl-pipe-arrow-down { color: ${colors.muted}; font-size: 18px; margin: 2px 0; opacity: 0; animation: mldl-fade-up 0.5s ease forwards; }
  @keyframes mldl-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* -------------------- Problem solver (Stage 1) -------------------- */
  .mldl-problem-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 22px; }
  @media (min-width: 640px) { .mldl-problem-grid { grid-template-columns: repeat(3, 1fr); } }
  .mldl-problem-chip {
    display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px 8px; border-radius: 16px;
    background: ${colors.card}; border: 1px solid ${colors.border}; font-size: 12px; font-weight: 700; text-align: center;
    transition: all 0.2s ease; color: ${colors.inkSoft};
  }
  .mldl-problem-chip:hover { border-color: ${colors.borderActive}; transform: translateY(-2px); }
  .mldl-problem-chip.mldl-problem-active { background: ${GRADIENT_PB}; color: #fff; border-color: transparent; box-shadow: 0 8px 20px rgba(59,130,246,0.25); }
  .mldl-problem-chip.mldl-problem-solved { border-color: rgba(16,185,129,0.4); }
  .mldl-problem-icon-circle {
    width: 36px; height: 36px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
    background: rgba(148,163,184,0.14);
  }
  .mldl-problem-chip.mldl-problem-active .mldl-problem-icon-circle { background: rgba(255,255,255,0.22); }

  .mldl-choice-section { margin-bottom: 18px; }
  .mldl-choice-label { font-size: 12.5px; font-weight: 700; color: ${colors.muted}; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0; }
  .mldl-choice-pills { display: flex; gap: 10px; flex-wrap: wrap; }
  .mldl-pill {
    padding: 11px 18px; border-radius: 999px; font-size: 13px; font-weight: 700; color: ${colors.inkSoft};
    background: ${colors.card}; border: 1px solid ${colors.border}; transition: all 0.18s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  }
  .mldl-pill:hover { border-color: ${colors.borderActive}; color: ${colors.ink}; transform: translateY(-1px); }
  .mldl-pill.mldl-pill-selected { color: #fff; border-color: transparent; }
  .mldl-pill.mldl-pill-correct { background: ${GRADIENT_GREEN} !important; box-shadow: 0 6px 16px rgba(16,185,129,0.3); }
  .mldl-pill.mldl-pill-wrong { background: ${GRADIENT_CORAL} !important; box-shadow: 0 6px 16px rgba(244,63,94,0.3); }
  .mldl-pill.mldl-pill-neutral-selected { background: ${GRADIENT_PB} !important; }
  .mldl-pill[disabled] { opacity: 0.55; cursor: default; }

  .mldl-feedback-box {
    display: flex; gap: 12px; align-items: flex-start; padding: 16px 18px; border-radius: 16px; margin-top: 6px;
    animation: mldl-fade-up 0.3s ease forwards; border: 1px solid;
  }
  .mldl-feedback-box.mldl-fb-correct { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.25); }
  .mldl-feedback-box.mldl-fb-wrong { background: rgba(244,63,94,0.08); border-color: rgba(244,63,94,0.25); }
  .mldl-feedback-title { font-size: 13.5px; font-weight: 800; margin: 0 0 4px 0; color: ${colors.ink}; }
  .mldl-feedback-text { font-size: 13px; color: ${colors.inkSoft}; margin: 0; line-height: 1.55; }

  /* -------------------- Algorithm playground tabs (Stage 2) -------------------- */
  .mldl-tab-row { display: flex; gap: 8px; margin-bottom: 22px; flex-wrap: wrap; }
  .mldl-tab-btn {
    display: flex; align-items: center; gap: 7px; padding: 10px 16px; border-radius: 12px; font-size: 13px; font-weight: 700;
    background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.inkSoft}; transition: all 0.2s ease;
  }
  .mldl-tab-btn:hover { border-color: ${colors.borderActive}; color: ${colors.ink}; }
  .mldl-tab-btn.mldl-tab-active { background: ${GRADIENT_PBC}; color: #fff; border-color: transparent; box-shadow: 0 6px 16px rgba(139,92,246,0.28); }

  .mldl-playground-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
  @media (min-width: 880px) { .mldl-playground-grid { grid-template-columns: 1.3fr 1fr; align-items: start; } }

  .mldl-svg-card {
    border-radius: 18px; background: ${colors.card}; border: 1px solid ${colors.borderSoft};
    padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
  .mldl-svg-caption { font-size: 12px; color: ${colors.muted}; text-align: center; }

  .mldl-side-panel { display: flex; flex-direction: column; gap: 14px; }
  .mldl-info-card {
    border-radius: 16px; padding: 16px 18px; background: ${colors.card}; border: 1px solid ${colors.borderSoft};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
  .mldl-info-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; color: ${colors.ink}; margin: 0 0 8px 0; }
  .mldl-info-text { font-size: 12.5px; color: ${colors.inkSoft}; margin: 0; line-height: 1.6; }

  .mldl-metric-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${colors.borderSoft}; }
  .mldl-metric-row:last-child { border-bottom: none; }
  .mldl-metric-label { font-size: 12px; color: ${colors.muted}; font-weight: 600; }
  .mldl-metric-value { font-size: 13.5px; color: ${colors.ink}; font-weight: 800; font-variant-numeric: tabular-nums; }

  .mldl-slider-block { display: flex; flex-direction: column; gap: 8px; }
  .mldl-slider-top { display: flex; align-items: center; justify-content: space-between; }
  .mldl-slider-top-label { font-size: 12.5px; font-weight: 700; color: ${colors.inkSoft}; }
  .mldl-slider-top-value { font-size: 13px; font-weight: 800; color: ${colors.cyanDeep}; }
  .mldl-slider { width: 100%; height: 6px; border-radius: 999px; background: rgba(148,163,184,0.25); appearance: none; outline: none; cursor: pointer; }
  .mldl-slider::-webkit-slider-thumb {
    appearance: none; width: 18px; height: 18px; border-radius: 999px; background: ${GRADIENT_PBC};
    box-shadow: 0 2px 8px rgba(139,92,246,0.45); cursor: pointer; border: 2px solid #fff;
  }
  .mldl-slider::-moz-range-thumb {
    width: 18px; height: 18px; border-radius: 999px; background: ${colors.purple};
    box-shadow: 0 2px 8px rgba(139,92,246,0.45); cursor: pointer; border: 2px solid #fff;
  }

  .mldl-prob-meter { width: 100%; height: 34px; border-radius: 999px; background: rgba(148,163,184,0.16); position: relative; overflow: hidden; border: 1px solid ${colors.borderSoft}; }
  .mldl-prob-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease, background 0.3s ease; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; }
  .mldl-prob-fill span { font-size: 11.5px; font-weight: 800; color: #fff; }

  .mldl-tree-canvas { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; }
  .mldl-tree-node {
    padding: 14px 22px; border-radius: 14px; background: ${colors.cardSolid}; border: 2px solid ${colors.border};
    font-size: 13.5px; font-weight: 700; color: ${colors.ink}; text-align: center; transition: all 0.3s ease;
  }
  .mldl-tree-node.mldl-tree-node-active { border-color: ${colors.cyanDeep}; box-shadow: 0 0 0 4px rgba(6,182,212,0.12); }
  .mldl-tree-node.mldl-tree-leaf { background: ${GRADIENT_GREEN}; color: #fff; border-color: transparent; }
  .mldl-tree-branch-line { width: 2px; height: 22px; background: ${colors.border}; }
  .mldl-tree-branch-line.mldl-tree-branch-active { background: ${colors.cyanDeep}; box-shadow: 0 0 8px rgba(6,182,212,0.4); }
  .mldl-tree-answers { display: flex; gap: 10px; }

  /* -------------------- Comparison (Stage 3) -------------------- */
  .mldl-dataset-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 22px; }
  .mldl-comparison-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
  @media (min-width: 720px) { .mldl-comparison-grid { grid-template-columns: repeat(2, 1fr); } }
  .mldl-compare-card {
    border-radius: 18px; padding: 18px; background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    opacity: 0; animation: mldl-fade-up 0.4s ease forwards;
  }
  .mldl-compare-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .mldl-compare-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--accent-gradient); }
  .mldl-compare-name { font-size: 14.5px; font-weight: 800; color: ${colors.ink}; }
  .mldl-compare-prediction { font-size: 12px; color: ${colors.cyanDeep}; font-weight: 700; margin: 0 0 12px 0; }
  .mldl-bar-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 9px; }
  .mldl-bar-top { display: flex; justify-content: space-between; font-size: 11px; color: ${colors.muted}; font-weight: 600; }
  .mldl-bar-track { height: 7px; border-radius: 999px; background: rgba(148,163,184,0.2); overflow: hidden; }
  .mldl-bar-fill { height: 100%; border-radius: 999px; transition: width 0.6s ease; }

  /* -------------------- Reinforcement Maze (Stage 4) -------------------- */
  .mldl-maze-wrap { display: flex; flex-direction: column; align-items: center; gap: 18px; }
  .mldl-maze-grid { display: grid; gap: 4px; padding: 10px; background: ${colors.card}; border-radius: 16px; border: 1px solid ${colors.borderSoft}; position: relative; }
  .mldl-maze-cell {
    width: 46px; height: 46px; border-radius: 8px; background: rgba(148,163,184,0.08);
    display: flex; align-items: center; justify-content: center; position: relative; border: 1px solid rgba(148,163,184,0.1);
  }
  .mldl-maze-cell.mldl-maze-obstacle { background: rgba(107,118,144,0.28); border-color: rgba(107,118,144,0.4); }
  .mldl-maze-cell.mldl-maze-goal { background: rgba(245,158,11,0.14); border-color: rgba(245,158,11,0.35); }
  .mldl-maze-cell.mldl-maze-path { background: rgba(6,182,212,0.12); }
  .mldl-maze-robot {
    position: absolute; width: 30px; height: 30px; border-radius: 999px; background: ${GRADIENT_PBC};
    display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(139,92,246,0.45);
    transition: top 0.45s cubic-bezier(0.4,0,0.2,1), left 0.45s cubic-bezier(0.4,0,0.2,1); z-index: 2;
  }
  .mldl-episode-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .mldl-episode-btn {
    padding: 9px 16px; border-radius: 999px; font-size: 12.5px; font-weight: 700; color: ${colors.inkSoft};
    background: ${colors.card}; border: 1px solid ${colors.border}; transition: all 0.18s ease;
  }
  .mldl-episode-btn:hover { border-color: ${colors.borderActive}; color: ${colors.ink}; }
  .mldl-episode-btn.mldl-episode-active { background: ${GRADIENT_PBC}; color: #fff; border-color: transparent; }
  .mldl-reward-row { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  .mldl-reward-chip {
    display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 20px; border-radius: 14px;
    background: ${colors.card}; border: 1px solid ${colors.borderSoft}; min-width: 100px;
  }
  .mldl-reward-num { font-size: 20px; font-weight: 800; color: ${colors.ink}; font-variant-numeric: tabular-nums; }
  .mldl-reward-label { font-size: 10.5px; color: ${colors.muted}; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
  .mldl-maze-controls { display: flex; gap: 10px; }
  .mldl-icon-btn {
    display: flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 12px; font-size: 12.5px; font-weight: 700;
    background: ${GRADIENT_PBC}; color: #fff; box-shadow: 0 6px 16px rgba(139,92,246,0.28);
  }
  .mldl-icon-btn.mldl-icon-btn-secondary { background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.inkSoft}; box-shadow: none; }

  /* -------------------- Challenge mode (Stage 5) -------------------- */
  .mldl-challenge-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .mldl-score-chip { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; background: ${GRADIENT_AMBER}; box-shadow: 0 6px 16px rgba(245,158,11,0.28); }
  .mldl-score-num { font-size: 16px; font-weight: 800; color: #fff; }
  .mldl-streak-chip { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 999px; background: ${colors.card}; border: 1px solid ${colors.borderSoft}; font-size: 12.5px; font-weight: 700; color: ${colors.inkSoft}; }

  .mldl-challenge-card { border-radius: 20px; padding: 22px; background: ${colors.card}; border: 1px solid ${colors.borderSoft}; margin-bottom: 18px; }
  .mldl-challenge-icon-row { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
  .mldl-challenge-icon { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: var(--accent-gradient); }
  .mldl-challenge-title { font-size: 18px; font-weight: 800; color: ${colors.ink}; margin: 0; }
  .mldl-challenge-num { font-size: 12px; color: ${colors.muted}; font-weight: 700; }

  /* -------------------- Final ecosystem (Stage 6) -------------------- */
  .mldl-ecosystem-legend { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 14px; }
  .mldl-legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: ${colors.inkSoft}; font-weight: 600; }
  .mldl-legend-dot { width: 10px; height: 10px; border-radius: 999px; }

  /* -------------------- Nav buttons -------------------- */
  .mldl-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; gap: 12px; }
  .mldl-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft}; background: ${colors.card}; border: 1px solid ${colors.border};
    transition: all 0.18s ease;
  }
  .mldl-nav-back:not([disabled]):hover { color: ${colors.purpleDeep}; border-color: ${colors.borderActive}; transform: translateX(-2px); }
  .mldl-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 26px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: #fff; background: ${GRADIENT_PBC};
    box-shadow: 0 8px 22px rgba(139,92,246,0.3);
    transition: all 0.18s ease;
  }
  .mldl-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(139,92,246,0.38); }
  .mldl-nav-next[disabled], .mldl-nav-back[disabled] { opacity: 0.4; cursor: default; }

  /* -------------------- Toast -------------------- */
  .mldl-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 10px 30px rgba(0,0,0,0.18);
    animation: mldl-toast-in 0.35s ease forwards;
  }
  .mldl-toast-up { background: ${GRADIENT_GREEN}; }
  .mldl-toast-down { background: ${GRADIENT_CORAL}; }
  @keyframes mldl-toast-in {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  /* -------------------- Finish screen -------------------- */
  .mldl-finish { border-radius: 24px; padding: 40px 22px; text-align: center; background: rgba(255,255,255,0.72); border: 1px solid ${colors.border}; backdrop-filter: blur(16px); position: relative; overflow: hidden; }
  .mldl-finish-badge {
    margin: 0 auto 20px auto; width: 84px; height: 84px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
    background: ${GRADIENT_AMBER}; box-shadow: 0 14px 34px rgba(245,158,11,0.35); animation: mldl-badge-pop 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes mldl-badge-pop { 0% { transform: scale(0.4) rotate(-15deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
  .mldl-finish-title { font-size: 27px; font-weight: 800; color: ${colors.ink}; margin: 0 0 10px 0; }
  .mldl-finish-desc { font-size: 14.5px; color: ${colors.inkSoft}; max-width: 480px; margin: 0 auto 26px auto; line-height: 1.6; }
  .mldl-finish-score { display: inline-flex; align-items: center; gap: 12px; border-radius: 20px; padding: 16px 26px; margin-bottom: 28px; background: ${colors.card}; border: 1px solid ${colors.borderSoft}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .mldl-finish-score-num { font-size: 32px; font-weight: 800; color: ${colors.amber}; }
  .mldl-finish-score-label { font-size: 12px; color: ${colors.muted}; text-align: left; max-width: 150px; }
  .mldl-reset-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; padding: 13px 24px; border-radius: 14px; background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.inkSoft}; }
  .mldl-reset-btn:hover { color: ${colors.purpleDeep}; border-color: ${colors.borderActive}; }
`;

/* ======================================================================
   TYPES
====================================================================== */

type LearningType = "supervised" | "unsupervised" | "reinforcement";
type AlgoId = "linear" | "logistic" | "tree" | "knn" | "clustering" | "qlearning";

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
}

interface Point {
  x: number;
  y: number;
}

/* ======================================================================
   CONTENT DATA
====================================================================== */

const STAGE_META: StageMetaItem[] = [
  { key: "types", title: "Learning Types", icon: Layers },
  { key: "problems", title: "Problem Solver", icon: Target },
  { key: "playground", title: "Playground", icon: Gamepad2 },
  { key: "compare", title: "Comparison", icon: Gauge },
  { key: "rl", title: "RL Maze", icon: Bot },
  { key: "challenge", title: "Challenge", icon: Trophy },
  { key: "ecosystem", title: "Ecosystem", icon: Share2 },
];

const LEARNING_TYPES: {
  id: LearningType;
  title: string;
  icon: LucideIcon;
  gradient: string;
  desc: string;
  pipeline: { label: string; icon: LucideIcon }[];
}[] = [
  {
    id: "supervised",
    title: "Supervised Learning",
    icon: Target,
    gradient: GRADIENT_PB,
    desc: "Learns from labeled examples to predict outcomes for new data.",
    pipeline: [
      { label: "Labeled Dataset", icon: Database },
      { label: "Training", icon: Brain },
      { label: "Prediction", icon: Sparkles },
    ],
  },
  {
    id: "unsupervised",
    title: "Unsupervised Learning",
    icon: Layers,
    gradient: GRADIENT_BC,
    desc: "Finds hidden patterns and groups in data that has no labels.",
    pipeline: [
      { label: "Raw Data", icon: Database },
      { label: "Pattern Detection", icon: Compass },
      { label: "Clusters", icon: Share2 },
    ],
  },
  {
    id: "reinforcement",
    title: "Reinforcement Learning",
    icon: Bot,
    gradient: GRADIENT_AMBER,
    desc: "An agent learns by acting, exploring, and collecting rewards.",
    pipeline: [
      { label: "Agent", icon: Bot },
      { label: "Environment", icon: MapPin },
      { label: "Reward", icon: Star },
      { label: "Learning", icon: Brain },
    ],
  },
];

const ALGO_INFO: Record<AlgoId, { label: string; icon: LucideIcon; gradient: string; blurb: string }> = {
  linear: { label: "Linear Regression", icon: TrendingUp, gradient: GRADIENT_PB, blurb: "Fits a straight line to predict a continuous number." },
  logistic: { label: "Logistic Regression", icon: SlidersHorizontal, gradient: GRADIENT_BC, blurb: "Draws a boundary to split data into two classes." },
  tree: { label: "Decision Tree", icon: GitBranch, gradient: GRADIENT_GREEN, blurb: "Asks a series of yes/no questions to reach a decision." },
  knn: { label: "K-Nearest Neighbors", icon: MousePointer2, gradient: GRADIENT_AMBER, blurb: "Classifies a point by majority vote of its closest neighbors." },
  clustering: { label: "Clustering (K-Means)", icon: Share2, gradient: GRADIENT_BC, blurb: "Groups similar unlabeled data points together." },
  qlearning: { label: "Q-Learning (RL Agent)", icon: Bot, gradient: GRADIENT_AMBER, blurb: "Learns the best actions through trial, error, and reward." },
};

interface ProblemDef {
  id: string;
  title: string;
  icon: LucideIcon;
  correctType: LearningType;
  correctAlgo: AlgoId;
  algoOptions: Record<LearningType, AlgoId[]>;
  wrongHints: Record<LearningType, string>;
  correctHint: string;
}

const PROBLEMS: ProblemDef[] = [
  {
    id: "house-price",
    title: "Predict House Price",
    icon: HomeIcon,
    correctType: "supervised",
    correctAlgo: "linear",
    algoOptions: { supervised: ["linear", "logistic", "tree", "knn"], unsupervised: ["clustering"], reinforcement: ["qlearning"] },
    correctHint: "House prices are numeric labels attached to past sales — a perfect fit for supervised regression.",
    wrongHints: {
      supervised: "",
      unsupervised: "This problem has clear price labels attached to every past house sale. Unsupervised learning needs unlabeled data — try Supervised Learning.",
      reinforcement: "There's no agent taking actions or receiving rewards here, just historical prices to learn from. Try Supervised Learning.",
    },
  },
  {
    id: "spam-detection",
    title: "Spam Detection",
    icon: Mail,
    correctType: "supervised",
    correctAlgo: "logistic",
    algoOptions: { supervised: ["linear", "logistic", "tree", "knn"], unsupervised: ["clustering"], reinforcement: ["qlearning"] },
    correctHint: "Emails are already labeled Spam / Not Spam, so a supervised classifier can learn the boundary between them.",
    wrongHints: {
      supervised: "",
      unsupervised: "Every email in the training set already has a Spam / Not Spam label. That's exactly what supervised learning needs — try that instead.",
      reinforcement: "There's no environment or reward signal here, just labeled emails to learn from. Try Supervised Learning.",
    },
  },
  {
    id: "animal-classification",
    title: "Animal Classification",
    icon: Dog,
    correctType: "supervised",
    correctAlgo: "tree",
    algoOptions: { supervised: ["linear", "logistic", "tree", "knn"], unsupervised: ["clustering"], reinforcement: ["qlearning"] },
    correctHint: "Each animal in the training data is already labeled with its species, so a classifier like a Decision Tree works well.",
    wrongHints: {
      supervised: "",
      unsupervised: "We already know each animal's species label in training — that's supervised territory, not unsupervised.",
      reinforcement: "Classifying a fixed photo isn't a sequence of actions and rewards. Try Supervised Learning.",
    },
  },
  {
    id: "movie-recommendation",
    title: "Movie Recommendation",
    icon: Film,
    correctType: "unsupervised",
    correctAlgo: "clustering",
    algoOptions: { supervised: ["linear", "logistic", "tree", "knn"], unsupervised: ["clustering"], reinforcement: ["qlearning"] },
    correctHint: "Grouping viewers by similar taste — with no 'correct' genre label — is a classic unsupervised clustering task.",
    wrongHints: {
      supervised: "There's no ground-truth label saying which movie is 'correct' for a viewer. Try Unsupervised Learning to group similar tastes.",
      unsupervised: "",
      reinforcement: "This isn't about an agent taking sequential actions for reward — it's about grouping similar viewers. Try Unsupervised Learning.",
    },
  },
  {
    id: "customer-segmentation",
    title: "Customer Segmentation",
    icon: Users,
    correctType: "unsupervised",
    correctAlgo: "clustering",
    algoOptions: { supervised: ["linear", "logistic", "tree", "knn"], unsupervised: ["clustering"], reinforcement: ["qlearning"] },
    correctHint: "Customers aren't pre-labeled into segments — clustering discovers natural groupings on its own.",
    wrongHints: {
      supervised: "This problem has no labels. Try Unsupervised Learning.",
      unsupervised: "",
      reinforcement: "There's no reward or sequential decision-making — just raw customer data to group. Try Unsupervised Learning.",
    },
  },
  {
    id: "robot-navigation",
    title: "Robot Navigation",
    icon: Bot,
    correctType: "reinforcement",
    correctAlgo: "qlearning",
    algoOptions: { supervised: ["linear", "logistic", "tree", "knn"], unsupervised: ["clustering"], reinforcement: ["qlearning"] },
    correctHint: "The robot takes actions, sees results, and earns rewards — a textbook reinforcement learning loop.",
    wrongHints: {
      supervised: "There's no labeled 'correct move' dataset here, just trial, error, and reward. Try Reinforcement Learning.",
      unsupervised: "This needs a feedback loop of actions and rewards, not just pattern discovery. Try Reinforcement Learning.",
      reinforcement: "",
    },
  },
];

interface DatasetDef {
  id: string;
  label: string;
  icon: LucideIcon;
  metrics: Record<AlgoId, { prediction: string; trainingTime: number; speed: number; accuracy: number; interpretability: number; complexity: number }>;
}

const COMPARISON_ALGOS: AlgoId[] = ["linear", "logistic", "tree", "knn"];

const DATASETS: DatasetDef[] = [
  {
    id: "house-price",
    label: "House Price",
    icon: HomeIcon,
    metrics: {
      linear: { prediction: "₹48.2L", trainingTime: 12, speed: 5, accuracy: 91, interpretability: 5, complexity: 1 },
      logistic: { prediction: "Not suited", trainingTime: 14, speed: 5, accuracy: 52, interpretability: 4, complexity: 1 },
      tree: { prediction: "₹46.8L", trainingTime: 40, speed: 4, accuracy: 85, interpretability: 4, complexity: 2 },
      knn: { prediction: "₹49.5L", trainingTime: 8, speed: 2, accuracy: 82, interpretability: 3, complexity: 2 },
      clustering: { prediction: "—", trainingTime: 0, speed: 0, accuracy: 0, interpretability: 0, complexity: 0 },
      qlearning: { prediction: "—", trainingTime: 0, speed: 0, accuracy: 0, interpretability: 0, complexity: 0 },
    },
  },
  {
    id: "spam",
    label: "Spam Detection",
    icon: Mail,
    metrics: {
      linear: { prediction: "Not suited", trainingTime: 10, speed: 5, accuracy: 61, interpretability: 4, complexity: 1 },
      logistic: { prediction: "Spam (94%)", trainingTime: 16, speed: 5, accuracy: 96, interpretability: 4, complexity: 2 },
      tree: { prediction: "Spam", trainingTime: 45, speed: 4, accuracy: 92, interpretability: 5, complexity: 2 },
      knn: { prediction: "Spam", trainingTime: 9, speed: 2, accuracy: 88, interpretability: 3, complexity: 2 },
      clustering: { prediction: "—", trainingTime: 0, speed: 0, accuracy: 0, interpretability: 0, complexity: 0 },
      qlearning: { prediction: "—", trainingTime: 0, speed: 0, accuracy: 0, interpretability: 0, complexity: 0 },
    },
  },
  {
    id: "animal",
    label: "Animal Classification",
    icon: Dog,
    metrics: {
      linear: { prediction: "Not suited", trainingTime: 11, speed: 5, accuracy: 44, interpretability: 4, complexity: 1 },
      logistic: { prediction: "Dog (81%)", trainingTime: 15, speed: 5, accuracy: 84, interpretability: 4, complexity: 2 },
      tree: { prediction: "Dog", trainingTime: 38, speed: 4, accuracy: 93, interpretability: 5, complexity: 2 },
      knn: { prediction: "Dog", trainingTime: 7, speed: 2, accuracy: 90, interpretability: 3, complexity: 2 },
      clustering: { prediction: "—", trainingTime: 0, speed: 0, accuracy: 0, interpretability: 0, complexity: 0 },
      qlearning: { prediction: "—", trainingTime: 0, speed: 0, accuracy: 0, interpretability: 0, complexity: 0 },
    },
  },
];

interface ChallengeDef {
  id: string;
  title: string;
  icon: LucideIcon;
  correctType: LearningType;
  correctAlgo: AlgoId;
  explanation: string;
}

const CHALLENGES: ChallengeDef[] = [
  { id: "ch1", title: "House Price", icon: HomeIcon, correctType: "supervised", correctAlgo: "linear", explanation: "Historical sale prices are numeric labels — Linear Regression predicts a continuous value from them." },
  { id: "ch2", title: "Medical Diagnosis", icon: Stethoscope, correctType: "supervised", correctAlgo: "logistic", explanation: "Diagnosing Healthy vs Diseased from labeled patient records is binary classification — Logistic Regression fits perfectly." },
  { id: "ch3", title: "Fraud Detection", icon: ShieldAlert, correctType: "supervised", correctAlgo: "tree", explanation: "Past transactions are labeled Fraud / Not Fraud — a Decision Tree can learn clear, explainable rules." },
  { id: "ch4", title: "Movie Recommendation", icon: Film, correctType: "unsupervised", correctAlgo: "clustering", explanation: "Grouping viewers with similar taste, with no correct-answer labels, is unsupervised clustering." },
  { id: "ch5", title: "Email Spam", icon: Mail, correctType: "supervised", correctAlgo: "logistic", explanation: "Spam / Not Spam is a labeled binary outcome — Logistic Regression models that boundary directly." },
  { id: "ch6", title: "Traffic Prediction", icon: Car, correctType: "supervised", correctAlgo: "linear", explanation: "Predicting a continuous traffic volume from historical, labeled data is a regression problem." },
  { id: "ch7", title: "Self Driving Car", icon: Car, correctType: "reinforcement", correctAlgo: "qlearning", explanation: "The car takes continuous actions in a changing environment and learns from reward signals over time." },
  { id: "ch8", title: "Customer Segmentation", icon: Users, correctType: "unsupervised", correctAlgo: "clustering", explanation: "There are no predefined segment labels — clustering discovers the groups directly from the data." },
];

const POSITIVE_PHRASES = ["Nice! 🎉", "You got it!", "Sharp instincts! ✨", "Exactly right!", "Great call!"];
const GENTLE_PHRASES = ["Not quite 🤔", "Close — see why below", "Good try!", "Almost there!"];

/* ======================================================================
   LINEAR REGRESSION HELPERS
====================================================================== */

function computeRegression(points: Point[]): { m: number; b: number } {
  const n = points.length;
  if (n === 0) return { m: 0, b: 150 };
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;
  let num = 0;
  let den = 0;
  points.forEach((p) => {
    num += (p.x - meanX) * (p.y - meanY);
    den += (p.x - meanX) * (p.x - meanX);
  });
  const m = den === 0 ? 0 : num / den;
  const b = meanY - m * meanX;
  return { m, b };
}

const DEFAULT_REGRESSION_POINTS: Point[] = [
  { x: 40, y: 210 },
  { x: 90, y: 175 },
  { x: 140, y: 165 },
  { x: 190, y: 120 },
  { x: 230, y: 110 },
  { x: 270, y: 80 },
  { x: 320, y: 60 },
];

/* ======================================================================
   LOGISTIC REGRESSION DATA
====================================================================== */

interface LogisticPoint {
  x: number;
  row: number;
  cls: 0 | 1; // 0 = not spam, 1 = spam
}

const LOGISTIC_POINTS: LogisticPoint[] = [
  { x: 8, row: 0, cls: 0 },
  { x: 18, row: 1, cls: 0 },
  { x: 22, row: 0, cls: 0 },
  { x: 30, row: 1, cls: 0 },
  { x: 34, row: 0, cls: 0 },
  { x: 40, row: 1, cls: 0 },
  { x: 46, row: 0, cls: 1 },
  { x: 52, row: 1, cls: 0 },
  { x: 58, row: 0, cls: 1 },
  { x: 64, row: 1, cls: 1 },
  { x: 70, row: 0, cls: 1 },
  { x: 76, row: 1, cls: 1 },
  { x: 84, row: 0, cls: 1 },
  { x: 90, row: 1, cls: 1 },
  { x: 96, row: 0, cls: 1 },
];

/* ======================================================================
   DECISION TREE DATA
====================================================================== */

type TreeNodeId = "root" | "weight" | "furless" | "dog" | "cat" | "rabbit";

interface TreeNode {
  id: TreeNodeId;
  question?: string;
  leaf?: { label: string; icon: LucideIcon };
  yes?: TreeNodeId;
  no?: TreeNodeId;
}

const TREE_NODES: Record<TreeNodeId, TreeNode> = {
  root: { id: "root", question: "Has Fur?", yes: "weight", no: "rabbit" },
  weight: { id: "weight", question: "Weight > 20kg?", yes: "dog", no: "cat" },
  furless: { id: "furless", leaf: { label: "Rabbit", icon: Rabbit } },
  dog: { id: "dog", leaf: { label: "Dog", icon: Dog } },
  cat: { id: "cat", leaf: { label: "Cat", icon: Cat } },
  rabbit: { id: "rabbit", leaf: { label: "Rabbit", icon: Rabbit } },
};

/* ======================================================================
   KNN DATA
====================================================================== */

interface KnnPoint {
  x: number;
  y: number;
  cls: "A" | "B";
}

const KNN_DATASET: KnnPoint[] = [
  { x: 60, y: 60, cls: "A" },
  { x: 90, y: 40, cls: "A" },
  { x: 50, y: 100, cls: "A" },
  { x: 100, y: 90, cls: "A" },
  { x: 75, y: 130, cls: "A" },
  { x: 40, y: 150, cls: "A" },
  { x: 280, y: 60, cls: "B" },
  { x: 250, y: 100, cls: "B" },
  { x: 300, y: 120, cls: "B" },
  { x: 260, y: 160, cls: "B" },
  { x: 320, y: 180, cls: "B" },
  { x: 290, y: 210, cls: "B" },
];

/* ======================================================================
   MAZE DATA
====================================================================== */

const MAZE_ROWS = 6;
const MAZE_COLS = 6;
const MAZE_CELL = 50;
const START_CELL = { row: 5, col: 0 };
const GOAL_CELL = { row: 0, col: 5 };
const OBSTACLES: [number, number][] = [
  [1, 1],
  [1, 2],
  [1, 4],
  [3, 2],
  [3, 3],
  [3, 4],
  [4, 1],
];

const PATH_EXPLORING: [number, number][] = [
  [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
  [4, 5], [3, 5], [2, 5], [2, 4], [2, 3], [2, 2], [2, 1], [2, 0],
  [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
];

const PATH_IMPROVING: [number, number][] = [
  [5, 0], [5, 1], [5, 2], [5, 3], [4, 3], [4, 2], [4, 3], [4, 4], [4, 5],
  [3, 5], [2, 5], [1, 5], [0, 5],
];

const PATH_OPTIMAL: [number, number][] = [
  [5, 0], [4, 0], [3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
];

function getPathForEpisodes(episodes: number): [number, number][] {
  if (episodes <= 1) return PATH_EXPLORING;
  if (episodes <= 10) return PATH_IMPROVING;
  return PATH_OPTIMAL;
}

function isObstacle(row: number, col: number): boolean {
  return OBSTACLES.some(([r, c]) => r === row && c === col);
}

/* ======================================================================
   SMALL SHARED COMPONENTS
====================================================================== */

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: (i * 43) % 100,
        size: 2 + (i % 4),
        duration: 14 + (i % 9) * 2.2,
        delay: (i % 10) * 1.3,
        color: [colors.purple, colors.blue, colors.cyan][i % 3],
      })),
    []
  );
  return (
    <div className="mldl-particle-field">
      {particles.map((p, i) => (
        <span
          key={i}
          className="mldl-particle"
          style={{
            left: `${p.left}%`,
            bottom: `-5%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

interface StepBarProps {
  current: number;
  completed: boolean[];
  onJump: (idx: number) => void;
}

function StepBar({ current, completed, onJump }: StepBarProps) {
  const doneCount = completed.filter(Boolean).length;
  const pct = (doneCount / STAGE_META.length) * 100;
  return (
    <div>
      <div className="mldl-progress-track">
        <div className="mldl-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="mldl-stepbar">
        {STAGE_META.map((s, i) => {
          const Icon = s.icon;
          const isDone = completed[i];
          const isCurrent = current === i;
          return (
            <button
              key={s.key}
              className={`mldl-step-btn ${isCurrent ? "mldl-step-active" : ""} ${isDone && !isCurrent ? "mldl-step-done" : ""}`}
              onClick={() => onJump(i)}
            >
              {isDone ? <CheckCircle2 size={15} /> : <Icon size={15} />}
              <span className="mldl-step-label">{s.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface NavButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
}

function NavButtons({ onBack, onNext, backDisabled, nextDisabled, nextLabel }: NavButtonsProps) {
  return (
    <div className="mldl-nav-row">
      <button className="mldl-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <button className="mldl-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ======================================================================
   STAGE 0 — LEARNING TYPES EXPLORER
====================================================================== */

function LearningTypesStage({
  selected,
  onSelect,
}: {
  selected: LearningType | null;
  onSelect: (t: LearningType) => void;
}) {
  const active = LEARNING_TYPES.find((t) => t.id === selected) || null;
  return (
    <>
      <div className="mldl-type-grid">
        {LEARNING_TYPES.map((t) => {
          const Icon = t.icon;
          const isActive = selected === t.id;
          return (
            <button
              key={t.id}
              className={`mldl-type-card ${isActive ? "mldl-type-active" : ""}`}
              onClick={() => onSelect(t.id)}
              style={( { ["--accent-gradient"]: t.gradient, } as unknown) as React.CSSProperties & Record<string, string>}
            >
              <div className="mldl-type-icon-wrap"><Icon size={22} color="#fff" /></div>
              <p className="mldl-type-title">{t.title}</p>
              <p className="mldl-type-desc">{t.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="mldl-canvas">
        {!active ? (
          <p className="mldl-svg-caption">Select a learning type above to watch its pipeline come to life.</p>
        ) : (
          <div className="mldl-pipe-row" key={active.id}>
            {active.pipeline.map((step, i) => {
              const StepIcon = step.icon;
              const nodeStyle: React.CSSProperties & Record<string, string> = {
                ["--accent-gradient"]: active.gradient,
                animationDelay: `${i * 0.25}s`,
              };
              return (
                <React.Fragment key={step.label}>
                  <div className="mldl-pipe-node" style={nodeStyle}>
                    <div className="mldl-pipe-node-icon"><StepIcon size={18} color="#fff" /></div>
                    <span className="mldl-pipe-node-label">{step.label}</span>
                  </div>
                  {i < active.pipeline.length - 1 && (
                    <ChevronRight
                      size={20}
                      color={colors.muted}
                      className="mldl-pipe-arrow-down"
                      style={{ animationDelay: `${i * 0.25 + 0.15}s` }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ======================================================================
   STAGE 1 — PROBLEM SOLVER
====================================================================== */

interface ProblemAnswer {
  chosenType?: LearningType;
  chosenAlgo?: AlgoId;
  done: boolean;
}

function ProblemSolverStage({
  answers,
  setAnswers,
  onFeedback,
}: {
  answers: Record<string, ProblemAnswer>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, ProblemAnswer>>>;
  onFeedback: (correct: boolean) => void;
}) {
  const [activeId, setActiveId] = useState<string>(PROBLEMS[0].id);
  const problem = PROBLEMS.find((p) => p.id === activeId)!;
  const answer = answers[activeId] || { done: false };

  const chooseType = (t: LearningType) => {
    if (answer.chosenType && answer.done) return;
    const isCorrect = t === problem.correctType;
    setAnswers((prev) => ({ ...prev, [activeId]: { chosenType: t, chosenAlgo: undefined, done: isCorrect } }));
    onFeedback(isCorrect);
  };

  const chooseAlgo = (a: AlgoId) => {
    if (!answer.chosenType || answer.done) return;
    const isCorrect = a === problem.correctAlgo;
    setAnswers((prev) => ({ ...prev, [activeId]: { ...prev[activeId], chosenAlgo: a, done: isCorrect } }));
    onFeedback(isCorrect);
  };

  const typeWrongChosen = answer.chosenType && answer.chosenType !== problem.correctType;
  const showAlgoStep = answer.chosenType === problem.correctType;

  return (
    <>
      <div className="mldl-problem-grid">
        {PROBLEMS.map((p) => {
          const Icon = p.icon;
          const isActive = p.id === activeId;
          const a = answers[p.id];
          return (
            <button
              key={p.id}
              className={`mldl-problem-chip ${isActive ? "mldl-problem-active" : ""} ${a?.done ? "mldl-problem-solved" : ""}`}
              onClick={() => setActiveId(p.id)}
            >
              <div className="mldl-problem-icon-circle"><Icon size={16} /></div>
              {p.title}
              {a?.done && <CheckCircle2 size={13} color={colors.green} />}
            </button>
          );
        })}
      </div>

      <div className="mldl-canvas" style={{ alignItems: "stretch" }}>
        <div className="mldl-choice-section">
          <p className="mldl-choice-label">Step 1 — Choose the Learning Type</p>
          <div className="mldl-choice-pills">
            {(["supervised", "unsupervised", "reinforcement"] as LearningType[]).map((t) => {
              const isSelected = answer.chosenType === t;
              const isCorrectPill = isSelected && t === problem.correctType;
              const isWrongPill = isSelected && t !== problem.correctType;
              return (
                <button
                  key={t}
                  className={`mldl-pill ${isSelected ? "mldl-pill-selected mldl-pill-neutral-selected" : ""} ${isCorrectPill ? "mldl-pill-correct" : ""} ${isWrongPill ? "mldl-pill-wrong" : ""}`}
                  onClick={() => chooseType(t)}
                  disabled={showAlgoStep && answer.done}
                >
                  {t === "supervised" ? "Supervised" : t === "unsupervised" ? "Unsupervised" : "Reinforcement"}
                </button>
              );
            })}
          </div>
        </div>

        {answer.chosenType && (
          <div
            className={`mldl-feedback-box ${answer.chosenType === problem.correctType ? "mldl-fb-correct" : "mldl-fb-wrong"}`}
          >
            {answer.chosenType === problem.correctType ? (
              <CheckCircle2 size={18} color={colors.green} />
            ) : (
              <XCircle size={18} color={colors.coral} />
            )}
            <div>
              <p className="mldl-feedback-title">
                {answer.chosenType === problem.correctType ? "Correct learning type!" : "Not quite — Incorrect"}
              </p>
              <p className="mldl-feedback-text">
                {answer.chosenType === problem.correctType ? problem.correctHint : problem.wrongHints[answer.chosenType]}
              </p>
            </div>
          </div>
        )}

        {showAlgoStep && (
          <div className="mldl-choice-section" style={{ marginTop: 18 }}>
            <p className="mldl-choice-label">Step 2 — Choose the Algorithm</p>
            <div className="mldl-choice-pills">
              {problem.algoOptions[problem.correctType].map((a) => {
                const info = ALGO_INFO[a];
                const isSelected = answer.chosenAlgo === a;
                const isCorrectPill = isSelected && a === problem.correctAlgo;
                const isWrongPill = isSelected && a !== problem.correctAlgo;
                return (
                  <button
                    key={a}
                    className={`mldl-pill ${isSelected ? "mldl-pill-selected mldl-pill-neutral-selected" : ""} ${isCorrectPill ? "mldl-pill-correct" : ""} ${isWrongPill ? "mldl-pill-wrong" : ""}`}
                    onClick={() => chooseAlgo(a)}
                    disabled={answer.done}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
            {answer.chosenAlgo && (
              <div className={`mldl-feedback-box ${answer.chosenAlgo === problem.correctAlgo ? "mldl-fb-correct" : "mldl-fb-wrong"}`} style={{ marginTop: 14 }}>
                {answer.chosenAlgo === problem.correctAlgo ? (
                  <CheckCircle2 size={18} color={colors.green} />
                ) : (
                  <XCircle size={18} color={colors.coral} />
                )}
                <div>
                  <p className="mldl-feedback-title">
                    {answer.chosenAlgo === problem.correctAlgo ? "Great algorithm choice!" : "Good guess, but not the best fit"}
                  </p>
                  <p className="mldl-feedback-text">
                    {answer.chosenAlgo === problem.correctAlgo
                      ? ALGO_INFO[problem.correctAlgo].blurb
                      : `${ALGO_INFO[problem.correctAlgo].label} is the better fit here: ${ALGO_INFO[problem.correctAlgo].blurb}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ======================================================================
   STAGE 2 — ALGORITHM PLAYGROUND
====================================================================== */

function LinearRegressionPlayground() {
  const [points, setPoints] = useState<Point[]>(DEFAULT_REGRESSION_POINTS);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [queryX, setQueryX] = useState<number>(200);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const W = 360;
  const H = 240;

  const { m, b } = useMemo(() => computeRegression(points), [points]);
  const predictedY = m * queryX + b;

  const toSvgCoords = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    const y = ((clientY - rect.top) / rect.height) * H;
    return { x: Math.max(6, Math.min(W - 6, x)), y: Math.max(6, Math.min(H - 6, y)) };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragIndex === null) return;
    const { x, y } = toSvgCoords(e.clientX, e.clientY);
    setPoints((prev) => prev.map((p, i) => (i === dragIndex ? { x, y } : p)));
  };

  const x1 = 0;
  const y1 = m * x1 + b;
  const x2 = W;
  const y2 = m * x2 + b;

  return (
    <div className="mldl-playground-grid">
      <div className="mldl-svg-card">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="240"
          onPointerMove={handlePointerMove}
          onPointerUp={() => setDragIndex(null)}
          onPointerLeave={() => setDragIndex(null)}
          style={{ touchAction: "none", cursor: dragIndex !== null ? "grabbing" : "default" }}
        >
          <line x1={0} y1={H - 1} x2={W} y2={H - 1} stroke={colors.borderSoft} strokeWidth={1} />
          <line x1={1} y1={0} x2={1} y2={H} stroke={colors.borderSoft} strokeWidth={1} />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.cyan} strokeWidth={2.5} opacity={0.9} />
          <line
            x1={queryX}
            y1={H}
            x2={queryX}
            y2={predictedY}
            stroke={colors.amber}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <circle cx={queryX} cy={predictedY} r={7} fill={colors.amber} stroke="#fff" strokeWidth={2} />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={9}
              fill={colors.purple}
              stroke="#fff"
              strokeWidth={2}
              style={{ cursor: "grab" }}
              onPointerDown={(e) => {
                (e.target as Element).setPointerCapture?.(e.pointerId);
                setDragIndex(i);
              }}
            />
          ))}
        </svg>
        <p className="mldl-svg-caption">Drag the purple points — the cyan regression line updates live. The amber marker is your prediction.</p>
      </div>
      <div className="mldl-side-panel">
        <div className="mldl-info-card">
          <p className="mldl-info-title"><TrendingUp size={15} color={colors.blue} /> Linear Regression</p>
          <p className="mldl-info-text">Fits the straight line that minimizes distance to every point, then reads off a continuous value — like predicting a house price from its size.</p>
        </div>
        <div className="mldl-info-card">
          <div className="mldl-slider-block">
            <div className="mldl-slider-top">
              <span className="mldl-slider-top-label">Query X position</span>
              <span className="mldl-slider-top-value">{Math.round(queryX)}</span>
            </div>
            <input className="mldl-slider" type="range" min={0} max={W} value={queryX} onChange={(e) => setQueryX(Number(e.target.value))} />
          </div>
        </div>
        <div className="mldl-info-card">
          <div className="mldl-metric-row"><span className="mldl-metric-label">Slope (m)</span><span className="mldl-metric-value">{m.toFixed(3)}</span></div>
          <div className="mldl-metric-row"><span className="mldl-metric-label">Intercept (b)</span><span className="mldl-metric-value">{b.toFixed(1)}</span></div>
          <div className="mldl-metric-row"><span className="mldl-metric-label">Predicted Value</span><span className="mldl-metric-value">{(H - predictedY).toFixed(0)} units</span></div>
        </div>
      </div>
    </div>
  );
}

function LogisticRegressionPlayground() {
  const [boundary, setBoundary] = useState<number>(50);
  const W = 360;
  const H = 200;
  const toX = (v: number) => (v / 100) * (W - 24) + 12;

  const correctCount = useMemo(() => {
    return LOGISTIC_POINTS.filter((p) => (p.x >= boundary ? p.cls === 1 : p.cls === 0)).length;
  }, [boundary]);
  const accuracy = Math.round((correctCount / LOGISTIC_POINTS.length) * 100);

  const testProb = 1 / (1 + Math.exp(-(50 - boundary) / 8));
  const testX = 50;
  const testIsSpam = testX >= boundary;

  return (
    <div className="mldl-playground-grid">
      <div className="mldl-svg-card">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="200">
          <rect x={0} y={0} width={toX(boundary)} height={H} fill={colors.green} opacity={0.06} />
          <rect x={toX(boundary)} y={0} width={W - toX(boundary)} height={H} fill={colors.coral} opacity={0.06} />
          <line x1={toX(boundary)} y1={0} x2={toX(boundary)} y2={H} stroke={colors.cyan} strokeWidth={2.5} />
          {LOGISTIC_POINTS.map((p, i) => (
            <circle
              key={i}
              cx={toX(p.x)}
              cy={40 + p.row * 60 + (i % 3) * 18}
              r={7}
              fill={p.cls === 1 ? colors.coral : colors.green}
              stroke="#fff"
              strokeWidth={1.5}
              opacity={0.9}
            />
          ))}
          <circle cx={toX(testX)} cy={H - 20} r={8} fill={colors.amber} stroke="#fff" strokeWidth={2} />
        </svg>
        <p className="mldl-svg-caption">Green = Not Spam, Red = Spam. Drag the slider to move the cyan decision boundary.</p>
      </div>
      <div className="mldl-side-panel">
        <div className="mldl-info-card">
          <p className="mldl-info-title"><SlidersHorizontal size={15} color={colors.cyan} /> Logistic Regression</p>
          <p className="mldl-info-text">Instead of a number, it outputs a probability of belonging to a class — then classifies using a threshold boundary.</p>
        </div>
        <div className="mldl-info-card">
          <div className="mldl-slider-block">
            <div className="mldl-slider-top">
              <span className="mldl-slider-top-label">Decision boundary</span>
              <span className="mldl-slider-top-value">{boundary}</span>
            </div>
            <input className="mldl-slider" type="range" min={0} max={100} value={boundary} onChange={(e) => setBoundary(Number(e.target.value))} />
          </div>
        </div>
        <div className="mldl-info-card">
          <p className="mldl-choice-label" style={{ marginBottom: 8 }}>Test point probability of Spam</p>
          <div className="mldl-prob-meter">
            <div
              className="mldl-prob-fill"
              style={{ width: `${Math.round(testProb * 100)}%`, background: testIsSpam ? GRADIENT_CORAL : GRADIENT_GREEN }}
            >
              <span>{Math.round(testProb * 100)}%</span>
            </div>
          </div>
          <p className="mldl-info-text" style={{ marginTop: 10 }}>Classified as <strong style={{ color: testIsSpam ? colors.coral : colors.green }}>{testIsSpam ? "Spam" : "Not Spam"}</strong></p>
        </div>
        <div className="mldl-info-card">
          <div className="mldl-metric-row"><span className="mldl-metric-label">Dataset Accuracy</span><span className="mldl-metric-value">{accuracy}%</span></div>
        </div>
      </div>
    </div>
  );
}

function DecisionTreePlayground() {
  const [path, setPath] = useState<TreeNodeId[]>(["root"]);
  const current = path[path.length - 1];
  const node = TREE_NODES[current];

  const answer = (yes: boolean) => {
    const next = yes ? node.yes : node.no;
    if (!next) return;
    setPath((p) => [...p, next]);
  };

  const reset = () => setPath(["root"]);

  return (
    <div className="mldl-playground-grid">
      <div className="mldl-svg-card">
        <div className="mldl-tree-canvas">
          {path.map((id, i) => {
            const n = TREE_NODES[id];
            const isLeaf = !!n.leaf;
            const LeafIcon = n.leaf?.icon;
            return (
              <React.Fragment key={id + i}>
                <div className={`mldl-tree-node ${isLeaf ? "mldl-tree-leaf" : "mldl-tree-node-active"}`}>
                  {isLeaf && LeafIcon ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <LeafIcon size={18} /> Its`a {n.leaf!.label}!
                    </span>
                  ) : (
                    n.question
                  )}
                </div>
                {i < path.length - 1 && <div className="mldl-tree-branch-line mldl-tree-branch-active" />}
              </React.Fragment>
            );
          })}
          {!node.leaf && (
            <>
              <div className="mldl-tree-branch-line" />
              <div className="mldl-tree-answers">
                <button className="mldl-pill mldl-pill-neutral-selected" style={{ background: GRADIENT_GREEN }} onClick={() => answer(true)}>Yes</button>
                <button className="mldl-pill mldl-pill-neutral-selected" style={{ background: GRADIENT_CORAL }} onClick={() => answer(false)}>No</button>
              </div>
            </>
          )}
          {node.leaf && (
            <button className="mldl-icon-btn mldl-icon-btn-secondary" onClick={reset}>
              <RotateCcw size={14} /> Try Another Path
            </button>
          )}
        </div>
      </div>
      <div className="mldl-side-panel">
        <div className="mldl-info-card">
          <p className="mldl-info-title"><GitBranch size={15} color={colors.green} /> Decision Tree</p>
          <p className="mldl-info-text">Every branch is a yes/no question. Follow enough questions and you land on a leaf — the final prediction.</p>
        </div>
        <div className="mldl-info-card">
          <p className="mldl-info-text">Try answering differently each time — notice how the tree reaches Dog, Cat, or Rabbit depending on the path you take.</p>
        </div>
      </div>
    </div>
  );
}

function KnnPlayground() {
  const [k, setK] = useState<number>(3);
  const [query, setQuery] = useState<Point>({ x: 180, y: 120 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const W = 360;
  const H = 240;

  const neighbors = useMemo(() => {
    const withDist = KNN_DATASET.map((p) => ({ ...p, dist: Math.hypot(p.x - query.x, p.y - query.y) }));
    withDist.sort((a, b) => a.dist - b.dist);
    return withDist.slice(0, k);
  }, [query, k]);

  const votesA = neighbors.filter((n) => n.cls === "A").length;
  const votesB = neighbors.filter((n) => n.cls === "B").length;
  const predicted = votesA >= votesB ? "A" : "B";

  const toSvgCoords = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    const y = ((clientY - rect.top) / rect.height) * H;
    return { x: Math.max(6, Math.min(W - 6, x)), y: Math.max(6, Math.min(H - 6, y)) };
  };

  return (
    <div className="mldl-playground-grid">
      <div className="mldl-svg-card">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="240"
          onPointerMove={(e) => {
            if (!dragging) return;
            setQuery(toSvgCoords(e.clientX, e.clientY));
          }}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
          style={{ touchAction: "none" }}
        >
          {neighbors.map((n, i) => (
            <line key={i} x1={query.x} y1={query.y} x2={n.x} y2={n.y} stroke={colors.cyan} strokeWidth={1.5} opacity={0.6} />
          ))}
          {KNN_DATASET.map((p, i) => {
            const isNeighbor = neighbors.some((n) => n.x === p.x && n.y === p.y);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={isNeighbor ? 9 : 7}
                fill={p.cls === "A" ? colors.blue : colors.coral}
                stroke={isNeighbor ? colors.cyan : "#fff"}
                strokeWidth={isNeighbor ? 3 : 1.5}
                opacity={isNeighbor ? 1 : 0.75}
              />
            );
          })}
          <circle
            cx={query.x}
            cy={query.y}
            r={10}
            fill={colors.amber}
            stroke="#fff"
            strokeWidth={2.5}
            style={{ cursor: "grab" }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture?.(e.pointerId);
              setDragging(true);
            }}
          />
        </svg>
        <p className="mldl-svg-caption">Drag the amber unknown point. Its {k} nearest neighbors glow and vote on its class.</p>
      </div>
      <div className="mldl-side-panel">
        <div className="mldl-info-card">
          <p className="mldl-info-title"><MousePointer2 size={15} color={colors.amber} /> K-Nearest Neighbors</p>
          <p className="mldl-info-text">Looks at the K closest labeled points and lets them vote — majority class becomes the prediction.</p>
        </div>
        <div className="mldl-info-card">
          <div className="mldl-slider-block">
            <div className="mldl-slider-top">
              <span className="mldl-slider-top-label">K value</span>
              <span className="mldl-slider-top-value">{k}</span>
            </div>
            <input className="mldl-slider" type="range" min={1} max={9} value={k} onChange={(e) => setK(Number(e.target.value))} />
          </div>
        </div>
        <div className="mldl-info-card">
          <div className="mldl-bar-row">
            <div className="mldl-bar-top"><span>Class A votes</span><span>{votesA}</span></div>
            <div className="mldl-bar-track"><div className="mldl-bar-fill" style={{ width: `${(votesA / k) * 100}%`, background: colors.blue }} /></div>
          </div>
          <div className="mldl-bar-row">
            <div className="mldl-bar-top"><span>Class B votes</span><span>{votesB}</span></div>
            <div className="mldl-bar-track"><div className="mldl-bar-fill" style={{ width: `${(votesB / k) * 100}%`, background: colors.coral }} /></div>
          </div>
          <p className="mldl-info-text" style={{ marginTop: 8 }}>
            Predicted class: <strong style={{ color: predicted === "A" ? colors.blue : colors.coral }}>{predicted}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function AlgorithmPlaygroundStage() {
  const [tab, setTab] = useState<"linear" | "logistic" | "tree" | "knn">("linear");
  const tabs: { id: typeof tab; label: string; icon: LucideIcon }[] = [
    { id: "linear", label: "Linear Regression", icon: TrendingUp },
    { id: "logistic", label: "Logistic Regression", icon: SlidersHorizontal },
    { id: "tree", label: "Decision Tree", icon: GitBranch },
    { id: "knn", label: "KNN", icon: MousePointer2 },
  ];
  return (
    <>
      <div className="mldl-tab-row">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} className={`mldl-tab-btn ${tab === t.id ? "mldl-tab-active" : ""}`} onClick={() => setTab(t.id)}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>
      {tab === "linear" && <LinearRegressionPlayground />}
      {tab === "logistic" && <LogisticRegressionPlayground />}
      {tab === "tree" && <DecisionTreePlayground />}
      {tab === "knn" && <KnnPlayground />}
    </>
  );
}

/* ======================================================================
   STAGE 3 — ALGORITHM COMPARISON
====================================================================== */

function ComparisonStage() {
  const [datasetId, setDatasetId] = useState<string>(DATASETS[0].id);
  const dataset = DATASETS.find((d) => d.id === datasetId)!;

  return (
    <>
      <div className="mldl-dataset-row">
        {DATASETS.map((d) => {
          const Icon = d.icon;
          const isActive = d.id === datasetId;
          return (
            <button key={d.id} className={`mldl-tab-btn ${isActive ? "mldl-tab-active" : ""}`} onClick={() => setDatasetId(d.id)}>
              <Icon size={15} /> {d.label}
            </button>
          );
        })}
      </div>
      <div className="mldl-comparison-grid">
        {COMPARISON_ALGOS.map((algoId, idx) => {
          const info = ALGO_INFO[algoId];
          const Icon = info.icon;
          const m = dataset.metrics[algoId];
          return (
            <div key={algoId} className="mldl-compare-card" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div className="mldl-compare-head">
                {/* CSS custom properties typed via React.CSSProperties to avoid `any` */}
                <div
                  className="mldl-compare-icon"
                  style={{ ['--accent-gradient']: info.gradient } as React.CSSProperties}
                >
                  <Icon size={17} color="#fff" />
                </div>
                <span className="mldl-compare-name">{info.label}</span>
              </div>
              <p className="mldl-compare-prediction">Prediction: {m.prediction}</p>
              <div className="mldl-bar-row">
                <div className="mldl-bar-top"><span>Accuracy</span><span>{m.accuracy}%</span></div>
                <div className="mldl-bar-track"><div className="mldl-bar-fill" style={{ width: `${m.accuracy}%`, background: GRADIENT_GREEN }} /></div>
              </div>
              <div className="mldl-bar-row">
                <div className="mldl-bar-top"><span>Speed</span><span>{m.speed}/5</span></div>
                <div className="mldl-bar-track"><div className="mldl-bar-fill" style={{ width: `${(m.speed / 5) * 100}%`, background: GRADIENT_BC }} /></div>
              </div>
              <div className="mldl-bar-row">
                <div className="mldl-bar-top"><span>Interpretability</span><span>{m.interpretability}/5</span></div>
                <div className="mldl-bar-track"><div className="mldl-bar-fill" style={{ width: `${(m.interpretability / 5) * 100}%`, background: GRADIENT_AMBER }} /></div>
              </div>
              <div className="mldl-bar-row">
                <div className="mldl-bar-top"><span>Complexity</span><span>{m.complexity}/5</span></div>
                <div className="mldl-bar-track"><div className="mldl-bar-fill" style={{ width: `${(m.complexity / 5) * 100}%`, background: GRADIENT_CORAL }} /></div>
              </div>
              <div className="mldl-metric-row" style={{ marginTop: 8 }}>
                <span className="mldl-metric-label">Training Time</span>
                <span className="mldl-metric-value">{m.trainingTime} ms</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ======================================================================
   STAGE 4 — REINFORCEMENT LEARNING MAZE
====================================================================== */

function ReinforcementMazeStage() {
  const [episodes, setEpisodes] = useState<number>(1);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const path = useMemo(() => getPathForEpisodes(episodes), [episodes]);
  const totalMoves = path.length - 1;
  const reward = Math.max(0, 50 - 2 * totalMoves);

  useEffect(() => {
    // Defer state updates to avoid synchronous setState within an effect
    const t = setTimeout(() => {
      setStepIndex(0);
      setPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 0);
    return () => clearTimeout(t);
  }, [episodes]);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= path.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 420);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, path.length]);

  const [row, col] = path[Math.min(stepIndex, path.length - 1)];
  const currentReward = Math.round((stepIndex / Math.max(1, totalMoves)) * reward);
  const cellsWalked = new Set(path.slice(0, stepIndex + 1).map(([r, c]) => `${r}-${c}`));

  return (
    <div className="mldl-maze-wrap">
      <div
        className="mldl-maze-grid"
        style={{ gridTemplateColumns: `repeat(${MAZE_COLS}, ${MAZE_CELL}px)`, gridTemplateRows: `repeat(${MAZE_ROWS}, ${MAZE_CELL}px)` }}
      >
        {Array.from({ length: MAZE_ROWS }).map((_, r) =>
          Array.from({ length: MAZE_COLS }).map((__, c) => {
            const obstacle = isObstacle(r, c);
            const isGoal = r === GOAL_CELL.row && c === GOAL_CELL.col;
            const walked = cellsWalked.has(`${r}-${c}`);
            return (
              <div
                key={`${r}-${c}`}
                className={`mldl-maze-cell ${obstacle ? "mldl-maze-obstacle" : ""} ${isGoal ? "mldl-maze-goal" : ""} ${walked && !isGoal ? "mldl-maze-path" : ""}`}
              >
                {isGoal && <Star size={20} color={colors.amber} fill={colors.amber} />}
              </div>
            );
          })
        )}
        <div
          className="mldl-maze-robot"
          style={{ top: row * (MAZE_CELL + 4) + 18, left: col * (MAZE_CELL + 4) + 18 }}
        >
          <Bot size={16} color="#fff" />
        </div>
      </div>

      <div className="mldl-episode-row">
        {[1, 10, 25, 50, 100].map((ep) => (
          <button key={ep} className={`mldl-episode-btn ${episodes === ep ? "mldl-episode-active" : ""}`} onClick={() => setEpisodes(ep)}>
            {ep} episodes
          </button>
        ))}
      </div>

      <div className="mldl-maze-controls">
        <button className="mldl-icon-btn" onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? "Pause" : "Run Robot"}
        </button>
        <button
          className="mldl-icon-btn mldl-icon-btn-secondary"
          onClick={() => {
            setStepIndex(0);
            setPlaying(false);
          }}
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      <div className="mldl-reward-row">
        <div className="mldl-reward-chip">
          <span className="mldl-reward-num">{totalMoves}</span>
          <span className="mldl-reward-label">Steps in Path</span>
        </div>
        <div className="mldl-reward-chip">
          <span className="mldl-reward-num" style={{ color: colors.green }}>+{currentReward}</span>
          <span className="mldl-reward-label">Reward So Far</span>
        </div>
        <div className="mldl-reward-chip">
          <span className="mldl-reward-num" style={{ color: colors.cyan }}>{episodes}</span>
          <span className="mldl-reward-label">Episodes Trained</span>
        </div>
      </div>
      <p className="mldl-svg-caption" style={{ maxWidth: 420 }}>
        {episodes <= 1
          ? "With only 1 episode, the agent barely knows the maze — it wanders and takes a long route to the goal ⭐."
          : episodes <= 10
          ? "After 10 episodes, the agent has learned to avoid some dead ends, but the path still isn't optimal."
          : "After enough episodes, the agent has learned the shortest possible path — maximizing its total reward."}
      </p>
    </div>
  );
}

/* ======================================================================
   STAGE 5 — CHALLENGE MODE
====================================================================== */

function ChallengeStage({
  onFeedback,
  score,
  setScore,
}: {
  onFeedback: (correct: boolean) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [order] = useState<number[]>(() => CHALLENGES.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [chosenType, setChosenType] = useState<LearningType | null>(null);
  const [chosenAlgo, setChosenAlgo] = useState<AlgoId | null>(null);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const challenge = CHALLENGES[order[index]];
  const Icon = challenge.icon;
  const typeCorrect = chosenType === challenge.correctType;
  const algoOptionsForType: AlgoId[] =
    chosenType === "supervised"
      ? ["linear", "logistic", "tree", "knn"]
      : chosenType === "unsupervised"
      ? ["clustering"]
      : chosenType === "reinforcement"
      ? ["qlearning"]
      : [];

  const pickType = (t: LearningType) => {
    if (chosenType) return;
    setChosenType(t);
    const correct = t === challenge.correctType;
    if (correct) {
      onFeedback(true);
    } else {
      onFeedback(false);
      setStreak(0);
    }
  };

  const pickAlgo = (a: AlgoId) => {
    if (chosenAlgo || !typeCorrect) return;
    setChosenAlgo(a);
    const correct = a === challenge.correctAlgo;
    if (correct) {
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
      onFeedback(true);
    } else {
      setStreak(0);
      onFeedback(false);
    }
  };

  const canAdvance = chosenType && (!typeCorrect || chosenAlgo);

  const next = () => {
    if (index >= order.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setChosenType(null);
    setChosenAlgo(null);
  };

  if (finished) {
    return (
      <div className="mldl-canvas" style={{ gap: 16 }}>
        <Trophy size={40} color={colors.amber} />
        <p className="mldl-stage-title" style={{ margin: 0 }}>Challenge Complete!</p>
        <p className="mldl-svg-caption">Final score: <strong style={{ color: colors.amber }}>{score} points</strong></p>
        <button
          className="mldl-icon-btn mldl-icon-btn-secondary"
          onClick={() => {
            setIndex(0);
            setChosenType(null);
            setChosenAlgo(null);
            setStreak(0);
            setFinished(false);
            setScore(0);
          }}
        >
          <RotateCcw size={14} /> Retry Challenges
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mldl-challenge-top">
        <div className="mldl-score-chip"><Trophy size={16} color="#fff" /><span className="mldl-score-num">{score} pts</span></div>
        <div className="mldl-streak-chip"><Zap size={14} color={colors.amber} /> Streak: {streak}</div>
        <div className="mldl-streak-chip">Question {index + 1} / {order.length}</div>
      </div>
      <div className="mldl-progress-track" style={{ marginBottom: 20 }}>
        <div className="mldl-progress-fill" style={{ width: `${((index) / order.length) * 100}%` }} />
      </div>

      <div className="mldl-challenge-card">
        <div className="mldl-challenge-icon-row">
          <div
            className="mldl-challenge-icon"
            style={{ ...( { ["--accent-gradient"]: GRADIENT_PBC } as React.CSSProperties) }}
          >
            <Icon size={22} color="#fff" />
          </div>
          <div>
            <p className="mldl-challenge-title">{challenge.title}</p>
            <span className="mldl-challenge-num">Real-world problem #{index + 1}</span>
          </div>
        </div>

        <div className="mldl-choice-section" style={{ marginTop: 14 }}>
          <p className="mldl-choice-label">Choose the Learning Type</p>
          <div className="mldl-choice-pills">
            {(["supervised", "unsupervised", "reinforcement"] as LearningType[]).map((t) => {
              const isSelected = chosenType === t;
              const isCorrectPill = isSelected && t === challenge.correctType;
              const isWrongPill = isSelected && t !== challenge.correctType;
              return (
                <button
                  key={t}
                  className={`mldl-pill ${isSelected ? "mldl-pill-selected mldl-pill-neutral-selected" : ""} ${isCorrectPill ? "mldl-pill-correct" : ""} ${isWrongPill ? "mldl-pill-wrong" : ""}`}
                  onClick={() => pickType(t)}
                  disabled={!!chosenType}
                >
                  {t === "supervised" ? "Supervised" : t === "unsupervised" ? "Unsupervised" : "Reinforcement"}
                </button>
              );
            })}
          </div>
        </div>

        {chosenType && typeCorrect && (
          <div className="mldl-choice-section">
            <p className="mldl-choice-label">Choose the Algorithm</p>
            <div className="mldl-choice-pills">
              {algoOptionsForType.map((a) => {
                const info = ALGO_INFO[a];
                const isSelected = chosenAlgo === a;
                const isCorrectPill = isSelected && a === challenge.correctAlgo;
                const isWrongPill = isSelected && a !== challenge.correctAlgo;
                return (
                  <button
                    key={a}
                    className={`mldl-pill ${isSelected ? "mldl-pill-selected mldl-pill-neutral-selected" : ""} ${isCorrectPill ? "mldl-pill-correct" : ""} ${isWrongPill ? "mldl-pill-wrong" : ""}`}
                    onClick={() => pickAlgo(a)}
                    disabled={!!chosenAlgo}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {chosenType && (
          <div className={`mldl-feedback-box ${typeCorrect ? "mldl-fb-correct" : "mldl-fb-wrong"}`}>
            {typeCorrect ? <CheckCircle2 size={18} color={colors.green} /> : <XCircle size={18} color={colors.coral} />}
            <div>
              <p className="mldl-feedback-title">{typeCorrect ? "Correct!" : "Incorrect"}</p>
              <p className="mldl-feedback-text">
                {typeCorrect
                  ? chosenAlgo
                    ? chosenAlgo === challenge.correctAlgo
                      ? `+10 points! ${challenge.explanation}`
                      : `Not the ideal algorithm. ${challenge.explanation}`
                    : "Great — now pick the best algorithm for this problem."
                  : `The correct learning type was ${challenge.correctType}. ${challenge.explanation}`}
              </p>
            </div>
          </div>
        )}
      </div>

      <NavButtons backDisabled onNext={next} nextDisabled={!canAdvance} nextLabel={index >= order.length - 1 ? "See Final Score" : "Next Problem"} />
    </>
  );
}

/* ======================================================================
   STAGE 6 — FINAL ECOSYSTEM VISUALIZATION
====================================================================== */

type EcoNodeId =
  | "supervised" | "unsupervised" | "reinforcement"
  | "linear" | "logistic" | "tree" | "knn" | "clustering" | "qlearning"
  | "training" | "prediction";

interface EcoNode {
  id: EcoNodeId;
  label: string;
  col: number;
  row: number;
  color: string;
  icon: LucideIcon;
}

const ECO_NODES: EcoNode[] = [
  { id: "supervised", label: "Supervised", col: 0, row: 0, color: colors.blue, icon: Target },
  { id: "unsupervised", label: "Unsupervised", col: 0, row: 1, color: colors.cyan, icon: Layers },
  { id: "reinforcement", label: "Reinforcement", col: 0, row: 2, color: colors.amber, icon: Bot },

  { id: "linear", label: "Linear Reg.", col: 1, row: 0, color: colors.blue, icon: TrendingUp },
  { id: "logistic", label: "Logistic Reg.", col: 1, row: 1, color: colors.blue, icon: SlidersHorizontal },
  { id: "tree", label: "Decision Tree", col: 1, row: 2, color: colors.blue, icon: GitBranch },
  { id: "knn", label: "KNN", col: 1, row: 3, color: colors.blue, icon: MousePointer2 },
  { id: "clustering", label: "Clustering", col: 1, row: 4, color: colors.cyan, icon: Share2 },
  { id: "qlearning", label: "Q-Learning", col: 1, row: 5, color: colors.amber, icon: Bot },

  { id: "training", label: "Training", col: 2, row: 2, color: colors.purple, icon: Brain },
  { id: "prediction", label: "Prediction", col: 3, row: 2, color: colors.green, icon: Sparkles },
];

const ECO_LINKS: [EcoNodeId, EcoNodeId][] = [
  ["supervised", "linear"], ["supervised", "logistic"], ["supervised", "tree"], ["supervised", "knn"],
  ["unsupervised", "clustering"],
  ["reinforcement", "qlearning"],
  ["linear", "training"], ["logistic", "training"], ["tree", "training"], ["knn", "training"],
  ["clustering", "training"], ["qlearning", "training"],
  ["training", "prediction"],
];

function EcosystemStage() {
  const [selected, setSelected] = useState<EcoNodeId | null>(null);
  const W = 620;
  const H = 320;
  const colGap = W / 4;
  const posOf = (n: EcoNode) => {
    const rowsInCol = ECO_NODES.filter((x) => x.col === n.col).length;
    const gap = H / (rowsInCol + 1);
    return { x: colGap * n.col + colGap / 2, y: gap * (n.row + 1) };
  };

  const isConnected = (id: EcoNodeId) => {
    if (!selected) return false;
    return ECO_LINKS.some(([a, b]) => (a === selected && b === id) || (b === selected && a === id));
  };

  return (
    <div className="mldl-svg-card" style={{ padding: 20 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="360">
        {ECO_LINKS.map(([a, b], i) => {
          const na = ECO_NODES.find((n) => n.id === a)!;
          const nb = ECO_NODES.find((n) => n.id === b)!;
          const pa = posOf(na);
          const pb = posOf(nb);
          const highlighted = selected && (selected === a || selected === b);
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={highlighted ? colors.cyan : "rgba(148,163,184,0.28)"}
              strokeWidth={highlighted ? 2.4 : 1.2}
              opacity={highlighted ? 0.95 : 0.6}
              style={{ transition: "all 0.3s ease" }}
            />
          );
        })}
        {ECO_NODES.map((n) => {
          const p = posOf(n);
          const isSelected = selected === n.id;
          const connected = isConnected(n.id);
          const Icon = n.icon;
          const dim = selected && !isSelected && !connected;
          return (
            <g
              key={n.id}
              onClick={() => setSelected(selected === n.id ? null : n.id)}
              style={{ cursor: "pointer" }}
              opacity={dim ? 0.35 : 1}
            >
              <circle cx={p.x} cy={p.y} r={isSelected ? 24 : 20} fill={colors.cardSolid} stroke={isSelected || connected ? colors.cyan : n.color} strokeWidth={isSelected ? 3 : 2} />
              <foreignObject x={p.x - 10} y={p.y - 10} width={20} height={20} style={{ pointerEvents: "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
                  <Icon size={14} color={n.color} />
                </div>
              </foreignObject>
              <text x={p.x} y={p.y + 34} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={colors.inkSoft}>{n.label}</text>
            </g>
          );
        })}
      </svg>
      <p className="mldl-svg-caption">Click any node to trace its connections through the whole Machine Learning ecosystem.</p>
      <div className="mldl-ecosystem-legend">
        <div className="mldl-legend-item"><span className="mldl-legend-dot" style={{ background: colors.blue }} /> Supervised</div>
        <div className="mldl-legend-item"><span className="mldl-legend-dot" style={{ background: colors.cyan }} /> Unsupervised</div>
        <div className="mldl-legend-item"><span className="mldl-legend-dot" style={{ background: colors.amber }} /> Reinforcement</div>
        <div className="mldl-legend-item"><span className="mldl-legend-dot" style={{ background: colors.purple }} /> Training</div>
        <div className="mldl-legend-item"><span className="mldl-legend-dot" style={{ background: colors.green }} /> Prediction</div>
      </div>
    </div>
  );
}

/* ======================================================================
   MAIN PAGE COMPONENT
====================================================================== */

export default function MachineLearningDecisionLab() {
  const [stage, setStage] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean[]>(new Array(STAGE_META.length).fill(false));

  const [learningTypeSelected, setLearningTypeSelected] = useState<LearningType | null>(null);
  const [problemAnswers, setProblemAnswers] = useState<Record<string, ProblemAnswer>>({});
  const [challengeScore, setChallengeScore] = useState(0);

  const [toast, setToast] = useState<{ mood: "up" | "down"; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const fireToast = (correct: boolean) => {
    const pool = correct ? POSITIVE_PHRASES : GENTLE_PHRASES;
    const text = pool[Math.floor(Math.random() * pool.length)];
    setToast({ mood: correct ? "up" : "down", text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  };

  const markComplete = (idx: number) => {
    setCompleted((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const goTo = (idx: number) => setStage(idx);

  const problemsAllSolved = PROBLEMS.every((p) => problemAnswers[p.id]?.done);

  const resetAll = () => {
    setStage(0);
    setCompleted(new Array(STAGE_META.length).fill(false));
    setLearningTypeSelected(null);
    setProblemAnswers({});
    setChallengeScore(0);
    setToast(null);
  };

  const stageBody = () => {
    switch (stage) {
      case 0:
        return (
          <LearningTypesStage
            selected={learningTypeSelected}
            onSelect={(t) => {
              setLearningTypeSelected(t);
              fireToast(true);
            }}
          />
        );
      case 1:
        return <ProblemSolverStage answers={problemAnswers} setAnswers={setProblemAnswers} onFeedback={fireToast} />;
      case 2:
        return <AlgorithmPlaygroundStage />;
      case 3:
        return <ComparisonStage />;
      case 4:
        return <ReinforcementMazeStage />;
      case 5:
        return <ChallengeStage onFeedback={fireToast} score={challengeScore} setScore={setChallengeScore} />;
      case 6:
        return <EcosystemStage />;
      default:
        return null;
    }
  };

  const stageTitles = [
    { tag: "Stage 1 — Learning Types", title: "Learning Types Explorer", subtitle: "Pick a learning type and watch its pipeline animate — see exactly how each approach turns data into decisions." },
    { tag: "Stage 2 — Problem Solver", title: "Match the Problem to the Method", subtitle: "Every real-world problem needs the right learning type before it needs the right algorithm. Get both right." },
    { tag: "Stage 3 — Algorithm Playground", title: "Play With Real Algorithms", subtitle: "Drag points, move boundaries, and grow trees — build intuition by interacting, not reading." },
    { tag: "Stage 4 — Comparison", title: "Compare Algorithms Side by Side", subtitle: "Same dataset, four algorithms. See how accuracy, speed, and interpretability trade off." },
    { tag: "Stage 5 — Reinforcement Learning", title: "Train a Robot Through the Maze", subtitle: "Watch an agent's path shrink toward the optimum as its training episodes increase." },
    { tag: "Stage 6 — Challenge Mode", title: "Test Your Machine Learning Instincts", subtitle: "Classify real-world problems under pressure and build your streak." },
    { tag: "Final Visualization", title: "The Machine Learning Ecosystem", subtitle: "Everything you've learned, connected in one living map." },
  ];

  const canProceed = () => {
    if (stage === 0) return !!learningTypeSelected;
    if (stage === 1) return problemsAllSolved;
    return true;
  };

  const isLast = stage === STAGE_META.length - 1;

  return (
    <div className="mldl-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        ${STYLES}
      `}</style>

      <ParticleField />

      {toast && (
        <div className={`mldl-toast ${toast.mood === "up" ? "mldl-toast-up" : "mldl-toast-down"}`}>
          {toast.mood === "up" ? <Sparkles size={15} /> : <Info size={15} />}
          {toast.text}
        </div>
      )}

      <div className="mldl-container">
        <div className="mldl-topbar">
          <Link href="/" className="mldl-back-btn">
            <ChevronLeft size={18} />
            Back to Curriculum
          </Link>
        </div>

        <div className="mldl-header">
          <div className="mldl-header-icon"><Brain size={28} color="#fff" /></div>
          <h1 className="mldl-h1">Machine Learning Decision Lab</h1>
          <p className="mldl-subtitle">Learn how machines solve different types of problems using Machine Learning.</p>
        </div>

        <StepBar current={stage} completed={completed} onJump={goTo} />

        <div className="mldl-stage-shell">
          <div className="mldl-stage-top">
            <span className="mldl-stage-tag">{stageTitles[stage].tag}</span>
          </div>
          <h2 className="mldl-stage-title">{stageTitles[stage].title}</h2>
          <p className="mldl-stage-subtitle">{stageTitles[stage].subtitle}</p>

          {stageBody()}

          {!isLast ? (
            <NavButtons
              backDisabled={stage === 0}
              onBack={() => setStage((s) => Math.max(0, s - 1))}
              nextDisabled={!canProceed()}
              onNext={() => {
                markComplete(stage);
                setStage((s) => s + 1);
              }}
              nextLabel={stage === STAGE_META.length - 2 ? "View Ecosystem" : "Continue"}
            />
          ) : (
            <div className="mldl-nav-row">
              <button className="mldl-nav-back" onClick={() => setStage((s) => Math.max(0, s - 1))}>
                <ChevronLeft size={16} /> Back
              </button>
              <button
                className="mldl-nav-next"
                onClick={() => {
                  markComplete(6);
                }}
              >
                <Rocket size={16} /> Finish Lab
              </button>
            </div>
          )}
        </div>

        {completed.every(Boolean) && (
          <div className="mldl-finish" style={{ marginTop: 24 }}>
            <div className="mldl-finish-badge"><Award size={38} color="#fff" /></div>
            <p className="mldl-finish-title">Lab Complete — You Think Like a Machine Learning Engineer!</p>
            <p className="mldl-finish-desc">
              You explored Supervised, Unsupervised, and Reinforcement Learning, played with Linear Regression, Logistic Regression,
              Decision Trees, and KNN, trained a maze-solving agent, and tackled real-world challenges.
            </p>
            <div className="mldl-finish-score">
              <span className="mldl-finish-score-num">{challengeScore}</span>
              <span className="mldl-finish-score-label">points earned in Challenge Mode</span>
            </div>
            <br />
            <button className="mldl-reset-btn" onClick={resetAll}>
              <RotateCcw size={14} /> Restart the Lab
            </button>
          </div>
        )}
      </div>
    </div>
  );
}