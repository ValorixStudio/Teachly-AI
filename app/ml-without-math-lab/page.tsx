"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { markLabTopicComplete } from "../page";
import Link from "next/link";
import {
  Brain,
  RefreshCw,
  GitBranch,
  Mail,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  LucideIcon,
  ArrowLeft,
  Bird,
  GraduationCap,
  ShoppingCart,
  Flame,
  Bot,
  PawPrint,
  Image as ImageIcon,
  CloudRain,
  ShoppingBag,
  Repeat,
  Target,
  Play,
  Database,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */

const palette = {
  pageBg: "#F0F4F8",
  cardBg: "rgba(255,255,255,0.72)",
  cardBgSolid: "#FFFFFF",
  cardAlt: "#F8FAFC",
  indigo: "#6366F1",
  indigoDeep: "#4F46E5",
  indigoLight: "#A5B4FC",
  violet: "#8B5CF6",
  cyan: "#06B6D4",
  cyanLight: "#A5F3FC",
  emerald: "#10B981",
  emeraldLight: "#6EE7B7",
  amber: "#F59E0B",
  amberLight: "#FCD34D",
  rose: "#F43F5E",
  roseLight: "#FDA4AF",
  ink: "#1E293B",
  inkSoft: "#475569",
  muted: "#94A3B8",
  border: "rgba(148,163,184,0.25)",
  borderActive: "rgba(99,102,241,0.4)",
};

type AccentKey = "indigo" | "violet" | "cyan" | "amber" | "rose";

const STAGE_ACCENT: Record<string, AccentKey> = {
  "what-is-learning": "indigo",
  "how-machines-learn": "amber",
  "training-vs-testing": "cyan",
  example: "rose",
};

const ACCENT_HEX: Record<AccentKey, { main: string; deep: string; light: string }> = {
  indigo: { main: palette.indigo, deep: palette.indigoDeep, light: palette.indigoLight },
  violet: { main: palette.violet, deep: "#6D28D9", light: "#DDD6FE" },
  cyan: { main: palette.cyan, deep: "#0E7490", light: palette.cyanLight },
  amber: { main: palette.amber, deep: "#B45309", light: palette.amberLight },
  rose: { main: palette.rose, deep: "#BE123C", light: palette.roseLight },
};

/* ────────────────────────── CSS (NO TAILWIND) ────────────────────────── */

const STYLES = `
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 15px) scale(0.97); }
  }
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-25px, 25px) scale(0.96); }
    66% { transform: translate(20px, -15px) scale(1.04); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.3); }
    50% { box-shadow: 0 0 20px 6px rgba(99,102,241,0.15); }
  }
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.95); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes growBar {
    from { width: 0%; }
  }
  @keyframes popIn {
    from { transform: scale(0.85); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes heroIn {
    from { opacity: 0; transform: translateY(8px) scale(0.94); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes heroPing {
    0% { transform: scale(0.7); opacity: 0.6; }
    80%, 100% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes heroDrop {
    0% { transform: translateY(-10px); opacity: 0; }
    60% { transform: translateY(4px); opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes dashFlow {
    to { stroke-dashoffset: -24; }
  }
  @keyframes dotPop {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes needleIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .lab-root {
    min-height: 100vh; width: 100%; position: relative; overflow: hidden;
    background: ${palette.pageBg};
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  }
  .lab-root *, .lab-root *::before, .lab-root *::after { box-sizing: border-box; }
  .lab-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .lab-root button:focus-visible { outline: 3px solid ${palette.indigo}; outline-offset: 2px; }

  .lab-orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(80px); opacity: 0.35;
  }
  .lab-orb-1 {
    width: 500px; height: 500px; top: -120px; right: -100px;
    background: ${palette.indigoLight};
    animation: float1 18s ease-in-out infinite;
  }
  .lab-orb-2 {
    width: 400px; height: 400px; bottom: -80px; left: -80px;
    background: ${palette.cyanLight};
    animation: float2 22s ease-in-out infinite;
  }
  .lab-orb-3 {
    width: 300px; height: 300px; top: 50%; left: 50%;
    background: ${palette.amberLight};
    animation: float1 25s ease-in-out infinite reverse;
    opacity: 0.2;
  }

  .lab-container {
    position: relative; z-index: 1;
    max-width: 880px; margin: 0 auto; padding: 32px 20px 60px;
  }
  @media (min-width: 768px) { .lab-container { padding: 40px 32px 80px; } }

  .lab-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600; color: ${palette.inkSoft};
    padding: 8px 16px; border-radius: 12px;
    background: ${palette.cardBg};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${palette.border};
    transition: all 0.2s ease; margin-bottom: 28px; text-decoration: none;
  }
  .lab-back:hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; transform: translateX(-2px); }

  .lab-header {
    text-align: center; margin-bottom: 36px;
    animation: fadeSlideUp 0.6s ease both;
  }
  .lab-header-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 20px; border-radius: 999px;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    color: white; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 16px;
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }
  .lab-h1 {
    font-size: 32px; font-weight: 800;
    margin: 0 0 12px 0; line-height: 1.2;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, ${palette.indigoDeep}, ${palette.violet} 55%, ${palette.rose});
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  @media (min-width: 640px) { .lab-h1 { font-size: 40px; } }
  .lab-subtitle { font-size: 16px; color: ${palette.inkSoft}; max-width: 580px; margin: 0 auto; line-height: 1.6; }

  .lab-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    animation: labToastIn 0.35s ease forwards;
  }
  .lab-toast-up { background: linear-gradient(135deg, ${palette.emerald}, #059669); }
  .lab-toast-down { background: linear-gradient(135deg, ${palette.rose}, #E11D48); }
  @keyframes labToastIn {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  .lab-stepper {
    display: flex; align-items: center; justify-content: center;
    gap: 0; margin-bottom: 36px;
    animation: fadeSlideUp 0.7s ease both 0.1s;
  }
  .lab-step-item { display: flex; align-items: center; gap: 0; }
  .lab-step-btn {
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: 16px;
    transition: all 0.25s ease; position: relative;
    border: 2px solid ${palette.border};
    background: ${palette.cardBg};
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  }
  .lab-step-btn:hover { transform: translateY(-2px); border-color: ${palette.borderActive}; }
  .lab-step-btn.active {
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(99,102,241,0.35);
    animation: pulseGlow 2s ease-in-out infinite;
  }
  .lab-step-btn.done {
    background: ${palette.emerald};
    border-color: transparent;
  }
  .lab-step-connector {
    width: 32px; height: 3px; border-radius: 2px;
    background: ${palette.border};
    transition: background 0.3s ease;
  }
  .lab-step-connector.filled { background: ${palette.emerald}; }
  @media (max-width: 639px) {
    .lab-step-btn { width: 40px; height: 40px; border-radius: 12px; }
    .lab-step-connector { width: 16px; }
  }

  .lab-hero {
    display: flex; align-items: center; justify-content: center;
    min-height: 108px; margin-bottom: 8px; padding: 12px 8px;
    animation: fadeSlideUp 0.6s ease both 0.15s;
  }

  /* ---- Stage 1: Learning-curve simulator ---- */
  .lab-curve-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; max-width: 460px; }
  .lab-curve-chart-box {
    width: 100%; border-radius: 18px; background: ${palette.cardBgSolid};
    border: 1px solid ${palette.border}; padding: 14px 16px 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
  .lab-curve-legend { display: flex; gap: 16px; justify-content: center; margin-top: 6px; flex-wrap: wrap; }
  .lab-curve-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: ${palette.inkSoft}; }
  .lab-curve-swatch { width: 14px; height: 3px; border-radius: 2px; }
  .lab-curve-controls { display: flex; align-items: center; gap: 10px; }
  .lab-curve-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 999px; font-size: 13px; font-weight: 700; color: black;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    box-shadow: 0 4px 14px rgba(99,102,241,0.3); transition: all 0.2s ease;
  }
  .lab-curve-btn:hover:not([disabled]) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.35); }
  .lab-curve-btn[disabled] { opacity: 0.4; cursor: default; }
  .lab-curve-reset {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; color: ${palette.inkSoft};
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border}; transition: all 0.2s ease;
  }
  .lab-curve-reset:hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; }
  .lab-curve-readout { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .lab-curve-pill {
    font-size: 11.5px; font-weight: 700; padding: 6px 12px; border-radius: 999px;
    border: 1px solid ${palette.border}; background: ${palette.cardAlt}; color: ${palette.inkSoft};
  }

  /* ---- Stage 2: animated pipeline flow ---- */
  .lab-flow-box { width: 100%; max-width: 520px; }
  .lab-flow-node-label {
    font-size: 9.5px; font-weight: 800; fill: ${palette.muted}; text-transform: uppercase; letter-spacing: 0.03em;
  }

  /* ---- Stage 3: train/test ratio ---- */
  .lab-split-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; max-width: 440px; }
  .lab-split-slider-row { display: flex; align-items: center; gap: 12px; width: 100%; }
  .lab-split-slider-row input[type="range"] {
    flex: 1; -webkit-appearance: none; appearance: none; height: 8px; border-radius: 999px;
    background: linear-gradient(90deg, ${palette.indigo}, ${palette.amber});
    outline: none; cursor: pointer;
  }
  .lab-split-slider-row input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%;
    background: #fff; border: 3px solid ${palette.indigoDeep}; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: pointer;
  }
  .lab-split-slider-row input[type="range"]::-moz-range-thumb {
    width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 3px solid ${palette.indigoDeep};
    box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: pointer;
  }
  .lab-split-readout { font-size: 13px; font-weight: 800; color: ${palette.ink}; min-width: 96px; text-align: right; }
  .lab-split-grid {
    display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; width: 100%;
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border}; border-radius: 16px; padding: 14px;
  }
  .lab-split-dot {
    aspect-ratio: 1; border-radius: 5px; animation: dotPop 0.3s ease both;
  }
  .lab-split-legend { display: flex; gap: 18px; justify-content: center; flex-wrap: wrap; }
  .lab-split-legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: ${palette.inkSoft}; }
  .lab-split-legend-dot { width: 12px; height: 12px; border-radius: 4px; }

  /* ---- Stage 4: spam-o-meter gauge ---- */
  .lab-gauge-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .lab-gauge-needle-group { transform-origin: 100px 92px; transition: transform 0.7s cubic-bezier(0.34,1.56,0.64,1); }
  .lab-gauge-readout { font-size: 12px; font-weight: 800; color: ${palette.inkSoft}; text-transform: uppercase; letter-spacing: 0.04em; }
  .lab-gauge-readout strong { color: ${palette.ink}; font-size: 14px; }

  .lab-hero-spectrum { display: flex; align-items: center; gap: 14px; width: 100%; max-width: 420px; }
  .lab-hero-pole { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
  .lab-hero-pole-icon {
    width: 42px; height: 42px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .lab-hero-pole-label {
    font-size: 10px; font-weight: 700; color: ${palette.muted};
    text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap;
  }
  .lab-hero-bar { flex: 1; height: 4px; border-radius: 2px; position: relative; background: ${palette.border}; }
  .lab-hero-marker {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    animation: heroIn 0.4s ease both;
  }

  .lab-hero-radar { position: relative; width: 92px; height: 92px; display: flex; align-items: center; justify-content: center; }
  .lab-hero-radar-ring {
    position: absolute; width: 92px; height: 92px; border-radius: 50%;
    border: 2px solid;
    animation: heroPing 2.4s ease-out infinite;
  }
  .lab-hero-radar-core {
    position: relative; z-index: 1; width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    animation: heroIn 0.4s ease both;
  }

  .lab-hero-track { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }
  .lab-hero-track-step {
    padding: 7px 12px; border-radius: 999px;
    font-family: 'Menlo', 'Consolas', monospace; font-weight: 800; font-size: 12px;
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border}; color: ${palette.ink};
    opacity: 0; animation: heroIn 0.35s ease forwards;
  }
  .lab-hero-track-step-active {
    color: white; border-color: transparent;
    box-shadow: 0 6px 16px rgba(0,0,0,0.18); transform: scale(1.1);
  }
  .lab-hero-track-arrow { color: ${palette.muted}; font-size: 13px; }

  .lab-hero-bins { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .lab-hero-falling {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 16px rgba(0,0,0,0.18);
    animation: heroDrop 0.5s ease both;
  }
  .lab-hero-bins-row { display: flex; gap: 10px; }
  .lab-hero-bin {
    width: 76px; height: 52px; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
    border: 2px dashed ${palette.border}; background: ${palette.cardAlt};
  }
  .lab-hero-bin-label { font-size: 8.5px; font-weight: 700; color: ${palette.muted}; text-align: center; line-height: 1.2; }

  .lab-stage {
    border-radius: 24px; padding: 28px 24px;
    background: ${palette.cardBg};
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${palette.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    animation: fadeSlideUp 0.55s ease both 0.2s;
  }
  @media (min-width: 640px) { .lab-stage { padding: 36px 32px; } }
  .lab-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .lab-stage-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: ${palette.indigo}; padding: 5px 14px; border-radius: 999px;
    background: rgba(99,102,241,0.08);
  }
  .lab-stage-progress {
    font-size: 13px; font-weight: 700; color: white;
    display: flex; align-items: center; gap: 4px;
    padding: 5px 12px; border-radius: 999px;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
  }
  .lab-stage-title {
    font-size: 26px; font-weight: 800; color: ${palette.ink};
    margin: 8px 0 6px 0; letter-spacing: -0.01em;
  }
  @media (min-width: 640px) { .lab-stage-title { font-size: 30px; } }
  .lab-stage-subtitle { font-size: 15px; color: ${palette.inkSoft}; margin: 0 0 12px 0; line-height: 1.6; }

  .lab-items { display: flex; flex-direction: column; gap: 14px; margin-top: 16px; }
  .lab-item {
    border-radius: 18px; padding: 20px;
    background: ${palette.cardBgSolid};
    border: 1px solid ${palette.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    transition: all 0.2s ease;
  }
  .lab-item:hover { border-color: ${palette.borderActive}; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .lab-item-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
  .lab-item-text { font-size: 15px; color: ${palette.ink}; margin: 0; font-weight: 500; line-height: 1.55; padding-top: 6px; }

  .lab-icon-badge {
    flex-shrink: 0; width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .lab-icon-badge-indigo { background: rgba(99,102,241,0.12); color: ${palette.indigoDeep}; }
  .lab-icon-badge-violet { background: rgba(139,92,246,0.12); color: ${palette.violet}; }
  .lab-icon-badge-cyan { background: rgba(6,182,212,0.12); color: #0E7490; }
  .lab-icon-badge-amber { background: rgba(245,158,11,0.14); color: #B45309; }
  .lab-icon-badge-rose { background: rgba(244,63,94,0.12); color: #BE123C; }

  .lab-choices { display: flex; gap: 10px; flex-wrap: wrap; }
  .lab-choice {
    flex: 1; min-width: 150px; font-size: 13px; font-weight: 700; padding: 14px 16px;
    border-radius: 14px; color: #000; text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    border: 2px solid transparent;
  }
  .lab-choice:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
  .lab-choice:active { transform: translateY(1px); }
  .lab-choice-indigo { background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet}); }
  .lab-choice-rose { background: linear-gradient(135deg, ${palette.rose}, #E11D48); }
  .lab-choice-amber { background: linear-gradient(135deg, ${palette.amber}, #D97706); }
  .lab-choice-cyan { background: linear-gradient(135deg, ${palette.cyan}, #0891B2); }
  .lab-choice-emerald { background: linear-gradient(135deg, ${palette.emerald}, #059669); }

  .lab-classify-choices { display: grid; grid-template-columns: 1fr; gap: 10px; }
  @media (min-width: 480px) { .lab-classify-choices { grid-template-columns: 1fr 1fr; } }
  .lab-classify-btn {
    display: flex; align-items: center; gap: 10px; text-align: left;
    padding: 14px 16px; border-radius: 14px;
    border: 2px solid; font-weight: 700; font-size: 13px;
    transition: all 0.2s ease;
  }
  .lab-classify-btn:hover { transform: translateY(-2px); }
  .lab-classify-btn-indigo { background: rgba(99,102,241,0.08); border-color: ${palette.indigo}; color: ${palette.indigoDeep}; }
  .lab-classify-btn-indigo:hover { background: ${palette.indigo}; color: white; box-shadow: 0 6px 18px rgba(99,102,241,0.35); }
  .lab-classify-btn-amber { background: rgba(245,158,11,0.1); border-color: ${palette.amber}; color: #92400E; }
  .lab-classify-btn-amber:hover { background: ${palette.amber}; color: white; box-shadow: 0 6px 18px rgba(245,158,11,0.35); }
  .lab-classify-sub { display: block; font-weight: 500; font-size: 11px; opacity: 0.75; margin-top: 2px; }

  .lab-feedback {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px; border-radius: 14px;
    border: 1px solid transparent;
    animation: popIn 0.3s ease both;
  }
  .lab-feedback-correct { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.25); }
  .lab-feedback-wrong { background: rgba(244,63,94,0.08); border-color: rgba(244,63,94,0.25); }
  .lab-feedback-text { font-size: 14px; color: ${palette.inkSoft}; margin: 0; line-height: 1.55; }
  .lab-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .lab-timeline { position: relative; padding-left: 28px; margin-top: 16px; }
  .lab-timeline-line { position: absolute; left: 10px; top: 0; bottom: 0; width: 3px; background: ${palette.border}; border-radius: 2px; }
  .lab-timeline-list { display: flex; flex-direction: column; gap: 14px; }
  .lab-timeline-item { position: relative; }
  .lab-timeline-dot {
    position: absolute; left: -28px; top: 16px; width: 16px; height: 16px;
    border-radius: 6px; border: 3px solid ${palette.border};
    background: white; transition: all 0.3s ease;
  }
  .lab-timeline-dot.visited { background: ${palette.amber}; border-color: ${palette.amber}; box-shadow: 0 0 12px rgba(245,158,11,0.3); }
  .lab-timeline-card {
    width: 100%; text-align: left; border-radius: 18px; padding: 18px 20px;
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border};
    transition: all 0.25s ease;
  }
  .lab-timeline-card:hover { border-color: ${palette.borderActive}; transform: translateX(4px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .lab-timeline-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .lab-timeline-left { display: flex; align-items: center; gap: 10px; }
  .lab-timeline-year {
    font-size: 12px; font-weight: 800; color: white;
    padding: 3px 10px; border-radius: 8px;
    background: linear-gradient(135deg, ${palette.amber}, #D97706);
  }
  .lab-timeline-title { font-size: 15px; font-weight: 700; color: ${palette.ink}; }
  .lab-timeline-text {
    font-size: 14px; color: ${palette.inkSoft}; margin: 12px 0 0 0; line-height: 1.6;
    animation: fadeSlideUp 0.3s ease both;
  }

  .lab-nav {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 32px; gap: 12px;
  }
  .lab-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px;
    border-radius: 14px; font-size: 14px; font-weight: 700; color: ${palette.inkSoft};
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border};
    transition: all 0.2s ease;
  }
  .lab-nav-back:not([disabled]):hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; transform: translateX(-2px); }
  .lab-step-counter { font-size: 12px; font-weight: 700; color: ${palette.muted}; }
  .lab-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 24px;
    border-radius: 14px; font-size: 14px; font-weight: 700; color: #000;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: all 0.2s ease;
  }
  .lab-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .lab-nav-next:not([disabled]):active { transform: translateY(1px); }
  .lab-nav-next[disabled], .lab-nav-back[disabled] {
    opacity: 0.4; cursor: default;
  }
  .lab-nav-next[disabled] { background: ${palette.muted}; box-shadow: none; }

  .lab-reset-btn:hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; }

  /* ---- Completion overlay (matches AI Foundations Lab) ---- */
  .completion-overlay{
      position:fixed;
      inset:0;
      background:rgba(5,10,25,.75);
      backdrop-filter:blur(10px);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:9999;
      animation:fadeIn .35s ease;
  }

  .completion-modal{
      width:520px;
      max-width:90%;
      background:rgba(20,28,45,.95);
      border:1px solid rgba(255,255,255,.12);
      border-radius:24px;
      padding:40px;
      text-align:center;
      color:white;
      box-shadow:0 20px 60px rgba(0,0,0,.4);
      animation:pop .4s ease;
  }

  .completion-icon{
      font-size:64px;
      margin-bottom:18px;
  }

  .completion-modal h2{
      margin-bottom:10px;
  }

  .completion-modal p{
      color:#b8c5e1;
      line-height:1.6;
  }

  .completion-modal button{
      margin-top:28px;
      padding:12px 28px;
      border:none;
      border-radius:14px;
      cursor:pointer;
      background:linear-gradient(135deg,#6d5efc,#37b7ff);
      color:white;
      font-weight:600;
      font-size:16px;
  }

  @keyframes fadeIn{
      from{opacity:0;}
      to{opacity:1;}
  }

  @keyframes pop{
      from{
          transform:scale(.8);
          opacity:0;
      }
      to{
          transform:scale(1);
          opacity:1;
      }
  }

  @media (prefers-reduced-motion: reduce) {
    .lab-root * { transition: none !important; animation: none !important; }
  }
`;

/* ─────────────────────────────── TYPES ─────────────────────────────── */

type SpotAnswer = "learning" | "rules";
type SplitAnswer = "training" | "testing";
type SpamAnswer = "spam" | "not_spam";

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

interface SpotItem {
  id: string;
  text: string;
  answer: SpotAnswer;
  explain: string;
  icon: LucideIcon;
}

interface PipelineStep {
  id: string;
  year: string;
  title: string;
  text: string;
}

interface SplitItem {
  id: string;
  label: string;
  answer: SplitAnswer;
  icon: LucideIcon;
}

interface SplitCategory {
  id: SplitAnswer;
  label: string;
  hint: string;
}

interface SpamItem {
  id: string;
  text: string;
  answer: SpamAnswer;
  explain: string;
  score: number; // 0-100, how "spammy" this looks to a trained filter
}

type SpotAnswerMap = Record<string, SpotAnswer>;
type VisitedMap = Record<string, boolean>;
type SplitAnswerMap = Record<string, SplitAnswer>;
type SpamAnswerMap = Record<string, SpamAnswer>;

/* ─────────────────────────── CONTENT DATA ─────────────────────────── */

const STAGE_META: StageMetaItem[] = [
  { key: "what-is-learning", title: "What Is Learning?", icon: Brain, tag: "Stage 1 · Spot the Pattern" },
  { key: "how-machines-learn", title: "How Machines Learn", icon: RefreshCw, tag: "Stage 2 · Dig the Pipeline" },
  { key: "training-vs-testing", title: "Training vs Testing", icon: GitBranch, tag: "Stage 3 · Sort the Data" },
  { key: "example", title: "Worked Example", icon: Mail, tag: "Stage 4 · Train a Spam Filter" },
];

const SPOT_ITEMS: SpotItem[] = [
  { id: "s1", text: "A parrot squawks 'Hello!' every time the doorbell rings - it has no idea what the word means.", answer: "rules", explain: "Pure repetition with no understanding. Nothing is being adjusted or improved.", icon: Bird },
  { id: "s2", text: "After solving a few algebra problems, a student can now solve a brand-new one using the same idea.", answer: "learning", explain: "The knowledge generalized to something never seen before - the core of real learning.", icon: GraduationCap },
  { id: "s3", text: "A vending machine dispenses a soda every time button B3 is pressed.", answer: "rules", explain: "One fixed instruction, forever. There's no adjustment based on experience.", icon: ShoppingCart },
  { id: "s4", text: "After burning her hand once, a child now blows on hot food before taking a bite.", answer: "learning", explain: "Behavior changed permanently because of a single experience - that's learning.", icon: Flame },
  { id: "s5", text: "A factory robot repeats the exact same welding motion on every car that passes by.", answer: "rules", explain: "Identical action every time, regardless of what's actually in front of it.", icon: Bot },
  { id: "s6", text: "A dog that used to fear the vacuum cleaner slowly relaxes after hearing it safely many times.", answer: "learning", explain: "Repeated experience gradually changed the dog's response - a textbook example of learning.", icon: PawPrint },
];

const PIPELINE_STEPS: PipelineStep[] = [
  { id: "p1", year: "01", title: "Collect Data", text: "Gather lots of real examples - photos, prices, sentences, clicks - anything that shows the pattern you want the machine to notice." },
  { id: "p2", year: "02", title: "Find Patterns", text: "An algorithm studies the data and looks for regularities: which features tend to show up together, and which lead to which outcomes." },
  { id: "p3", year: "03", title: "Build a Model", text: "Those patterns get turned into a compact set of internal rules - a 'model' - that can take a new input and produce a guess." },
  { id: "p4", year: "04", title: "Make Predictions", text: "The model is shown something it has never seen before and produces its best guess based on what it learned." },
  { id: "p5", year: "05", title: "Check & Improve", text: "The guess is compared against the real answer. The model nudges its internal rules to be a little more accurate next time - then repeats." },
];

const SPLIT_ITEMS: SplitItem[] = [
  { id: "c1", label: "10,000 labeled cat and dog photos the model studies over and over", answer: "training", icon: ImageIcon },
  { id: "c2", label: "500 brand-new photos the model has never seen, used to check its score", answer: "testing", icon: ImageIcon },
  { id: "c3", label: "Years of past weather records used to teach a model what leads to rain", answer: "training", icon: CloudRain },
  { id: "c4", label: "Tomorrow's actual weather, used to see whether the prediction was right", answer: "testing", icon: CloudRain },
  { id: "c5", label: "A decade of old customer purchases used to teach a recommendation engine", answer: "training", icon: ShoppingBag },
  { id: "c6", label: "A fresh batch of shoppers the system has never encountered, used only to grade it", answer: "testing", icon: ShoppingBag },
];

const SPLIT_CATEGORIES: SplitCategory[] = [
  { id: "training", label: "Training Data", hint: "What the model studies and learns from" },
  { id: "testing", label: "Testing Data", hint: "Held back, used only to grade the model" },
];

const SPAM_ITEMS: SpamItem[] = [
  { id: "e1", text: "\"FREE MONEY!! Click now to claim your $1,000,000 prize!!!\"", answer: "spam", explain: "Urgent all-caps language, an unbelievable prize, and pressure to click - classic spam signals.", score: 96 },
  { id: "e2", text: "\"Hey, are we still on for lunch tomorrow at noon?\"", answer: "not_spam", explain: "Casual, specific, personal - the kind of message a real contact actually sends.", score: 6 },
  { id: "e3", text: "\"URGENT: Your account will be suspended, verify your password immediately.\"", answer: "spam", explain: "Manufactured urgency plus a request for a password is a textbook phishing pattern.", score: 91 },
  { id: "e4", text: "\"Reminder: your dentist appointment is on Thursday at 3pm.\"", answer: "not_spam", explain: "A plain, expected reminder tied to something real in your life.", score: 4 },
  { id: "e5", text: "\"Congratulations! You've been selected for a free cruise - reply NOW.\"", answer: "spam", explain: "Unearned reward plus a demand for an immediate reply - a pattern the model learns to flag.", score: 88 },
  { id: "e6", text: "\"Here's the report you asked for, let me know if you have questions.\"", answer: "not_spam", explain: "References something specific you'd actually expect, with a normal, unhurried tone.", score: 9 },
];

const POSITIVE_PHRASES = ["Nice! 🎉", "You got it!", "Sharp eye! ✨", "Exactly right!", "Great instinct!"];
const GENTLE_PHRASES = ["Good try! 🤔", "Almost there!", "Nice guess — see why below", "Close one!"];

/* ────────────────────────────── HELPERS ─────────────────────────────── */

interface StepperProps {
  current: number;
  completed: boolean[];
  onJump: (idx: number) => void;
}

function Stepper({ current, completed, onJump }: StepperProps) {
  return (
    <div className="lab-stepper">
      {STAGE_META.map((s, i) => {
        const Icon = s.icon;
        const isDone = completed[i];
        const isCurrent = current === i;
        return (
          <div key={s.key} className="lab-step-item">
            {i > 0 && (
              <div className={`lab-step-connector${completed[i - 1] ? " filled" : ""}`} />
            )}
            <button
              className={`lab-step-btn${isCurrent ? " active" : ""}${isDone ? " done" : ""}`}
              onClick={() => onJump(i)}
              title={s.title}
            >
              {isDone ? (
                <CheckCircle2 size={20} color="white" strokeWidth={2.5} />
              ) : (
                <Icon size={18} color={isCurrent ? "white" : palette.muted} />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function IconBadge({ icon: Icon, accent }: { icon: LucideIcon; accent: AccentKey }) {
  return (
    <div className={`lab-icon-badge lab-icon-badge-${accent}`}>
      <Icon size={19} strokeWidth={2.25} />
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/* ═══════════════════ DYNAMIC STAGE-1 HERO: LEARNING CURVE SIMULATOR ═══════════════════ */
/* Click "Show another example" and watch a real learning curve climb, next to a flat
   rule-based line that never improves -- the whole idea of the stage, made visual. */

function LearningCurveHero() {
  const accent = ACCENT_HEX.indigo;
  const maxReps = 7;
  const [reps, setReps] = useState(0);

  const learnAccuracy = useMemo(() => {
    const raw = 42 + reps * 9 - reps * reps * 0.35;
    return Math.round(clamp(raw, 42, 95));
  }, [reps]);

  const W = 380;
  const H = 120;
  const padL = 30;
  const padB = 18;
  const plotW = W - padL - 10;
  const plotH = H - padB - 10;

  const xFor = (i: number) => padL + (i / maxReps) * plotW;
  const yFor = (acc: number) => 10 + plotH - (clamp(acc, 0, 100) / 100) * plotH;

  const learnPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= reps; i++) {
      const acc = Math.round(clamp(42 + i * 9 - i * i * 0.35, 42, 95));
      pts.push(`${i === 0 ? "M" : "L"}${xFor(i)},${yFor(acc)}`);
    }
    return pts.join(" ");
  }, [reps]);

  const ruleY = yFor(50);

  return (
    <div className="lab-hero-spectrum lab-curve-wrap">
      <div className="lab-curve-chart-box">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
          <line x1={padL} y1={10} x2={padL} y2={10 + plotH} stroke={palette.border} strokeWidth={1} />
          <line x1={padL} y1={10 + plotH} x2={W - 10} y2={10 + plotH} stroke={palette.border} strokeWidth={1} />
          <text x={4} y={14} fontSize="8" fill={palette.muted} fontWeight={700}>100%</text>
          <text x={4} y={10 + plotH} fontSize="8" fill={palette.muted} fontWeight={700}>0%</text>

          <line x1={padL} y1={ruleY} x2={W - 10} y2={ruleY} stroke={palette.muted} strokeWidth={2} strokeDasharray="5 4" />
          <text x={W - 10} y={ruleY - 6} fontSize="9" fontWeight={800} fill={palette.muted} textAnchor="end">
            Rule-based: fixed at 50%
          </text>

          {reps > 0 && (
            <path d={learnPath} fill="none" stroke={accent.main} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          )}
          {reps > 0 && (
            <circle cx={xFor(reps)} cy={yFor(learnAccuracy)} r={5} fill={accent.main} stroke="#fff" strokeWidth={2} />
          )}
          {reps === 0 && (
            <circle cx={xFor(0)} cy={yFor(42)} r={5} fill={palette.muted} stroke="#fff" strokeWidth={2} />
          )}
        </svg>
        <div className="lab-curve-legend">
          <span className="lab-curve-legend-item">
            <span className="lab-curve-swatch" style={{ background: accent.main }} />
            Learning system
          </span>
          <span className="lab-curve-legend-item">
            <span className="lab-curve-swatch" style={{ background: palette.muted }} />
            Rule-based system
          </span>
        </div>
      </div>

      <div className="lab-curve-readout">
        <span className="lab-curve-pill">Examples shown: {reps}</span>
        <span className="lab-curve-pill">Learning accuracy: {reps === 0 ? 42 : learnAccuracy}%</span>
        <span className="lab-curve-pill">Rule-based accuracy: 50%</span>
      </div>

      <div className="lab-curve-controls">
        <button
          className="lab-curve-btn"
          disabled={reps >= maxReps}
          onClick={() => setReps((r) => Math.min(maxReps, r + 1))}
        >
          <Play size={14} /> Show another example
        </button>
        <button className="lab-curve-reset" onClick={() => setReps(0)}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════ DYNAMIC STAGE-2 HERO: ANIMATED PIPELINE FLOW ═══════════════════ */
/* A live node graph with data flowing along the pipeline, the active step pulsing --
   makes the abstract "data becomes a skill" idea into something you watch happen. */

function PipelineFlowHero({ steps, activeId }: { steps: PipelineStep[]; activeId?: string }) {
  const accent = ACCENT_HEX.amber;
  const n = steps.length;
  const W = 460;
  const H = 96;
  const nodeY = 48;
  const marginX = 34;
  const gap = (W - marginX * 2) / (n - 1);
  const xFor = (i: number) => marginX + i * gap;

  const activeIdx = Math.max(0, steps.findIndex((s) => s.id === activeId));

  return (
    <div className="lab-flow-box">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
        <line x1={xFor(0)} y1={nodeY} x2={xFor(n - 1)} y2={nodeY} stroke={palette.border} strokeWidth={3} />
        <line
          x1={xFor(0)}
          y1={nodeY}
          x2={xFor(n - 1)}
          y2={nodeY}
          stroke={accent.main}
          strokeWidth={3}
          strokeDasharray="8 8"
          style={{ animation: "dashFlow 1.1s linear infinite" }}
          opacity={0.55}
        />
        {steps.map((step, i) => {
          const isActive = i === activeIdx;
          const isPast = i < activeIdx;
          const fill = isActive ? accent.main : isPast ? accent.light : palette.cardBgSolid;
          const stroke = isActive || isPast ? accent.deep : palette.border;
          return (
            <g key={step.id}>
              {isActive && (
                <circle cx={xFor(i)} cy={nodeY} r={17} fill="none" stroke={accent.main} strokeWidth={2} opacity={0.5}>
                  <animate attributeName="r" values="14;22;14" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={xFor(i)} cy={nodeY} r={13} fill={fill} stroke={stroke} strokeWidth={2} />
              <text x={xFor(i)} y={nodeY + 4} fontSize="10" fontWeight={800} textAnchor="middle" fill={isActive ? "#fff" : palette.inkSoft}>
                {i + 1}
              </text>
              <text
                x={xFor(i)}
                y={nodeY + 30}
                fontSize="9.5"
                fontWeight={isActive ? 800 : 700}
                textAnchor="middle"
                fill={isActive ? accent.deep : palette.muted}
              >
                {step.title.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════ DYNAMIC STAGE-3 HERO: TRAIN/TEST SPLIT SLIDER ═══════════════════ */
/* Drag the slider and watch a live grid of 40 data points redistribute between the two
   piles -- turns "data gets split in two" into something you control and see. */

function SplitRatioHero() {
  const [pct, setPct] = useState(80);
  const total = 40;
  const trainCount = Math.round((pct / 100) * total);
  const testCount = total - trainCount;

  return (
    <div className="lab-hero-bins lab-split-wrap">
      <div className="lab-split-slider-row">
        <Database size={16} color={palette.indigoDeep} />
        <input
          type="range"
          min={50}
          max={95}
          step={5}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          aria-label="Training data percentage"
        />
        <span className="lab-split-readout">{pct}% / {100 - pct}%</span>
      </div>

      <div className="lab-split-grid">
        {Array.from({ length: total }).map((_, i) => {
          const isTrain = i < trainCount;
          return (
            <div
              key={i}
              className="lab-split-dot"
              style={{
                background: isTrain ? palette.indigo : palette.amber,
                animationDelay: `${i * 0.012}s`,
              }}
            />
          );
        })}
      </div>

      <div className="lab-split-legend">
        <span className="lab-split-legend-item">
          <span className="lab-split-legend-dot" style={{ background: palette.indigo }} />
          Training: {trainCount} examples
        </span>
        <span className="lab-split-legend-item">
          <span className="lab-split-legend-dot" style={{ background: palette.amber }} />
          Testing: {testCount} examples
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════ DYNAMIC STAGE-4 HERO: SPAM-O-METER GAUGE ═══════════════════ */
/* A live needle gauge that swings toward the active email's real spam score once you
   answer -- a working mini "filter" you can watch make its call. */

function SpamGaugeHero({ item, revealed }: { item?: SpamItem; revealed: boolean }) {
  const score = item ? (revealed ? item.score : 50) : 50;
  const angle = -90 + (clamp(score, 0, 100) / 100) * 180;
  const needleColor = !revealed ? palette.muted : score >= 50 ? palette.rose : palette.emerald;

  return (
    <div className="lab-gauge-wrap">
      <svg viewBox="0 0 200 118" width="180" height="106">
        <path d="M 20 100 A 80 80 0 0 1 100 20" fill="none" stroke={palette.emeraldLight} strokeWidth={14} strokeLinecap="round" />
        <path d="M 100 20 A 80 80 0 0 1 180 100" fill="none" stroke={palette.roseLight} strokeWidth={14} strokeLinecap="round" />
        <g className="lab-gauge-needle-group" style={{ transform: `rotate(${angle}deg)` }}>
          <line x1={100} y1={92} x2={100} y2={30} stroke={needleColor} strokeWidth={4} strokeLinecap="round" />
        </g>
        <circle cx={100} cy={92} r={8} fill={needleColor} stroke="#fff" strokeWidth={2} />
        <text x={20} y={112} fontSize="9" fontWeight={800} fill={palette.emerald}>Safe</text>
        <text x={148} y={112} fontSize="9" fontWeight={800} fill={palette.rose}>Spam</text>
      </svg>
      <span className="lab-gauge-readout">
        {revealed && item ? (
          <>Spam-o-meter: <strong>{item.score}/100</strong></>
        ) : (
          "Guess first, then watch the meter swing"
        )}
      </span>
    </div>
  );
}

/* -------- static hero shells kept for stage headers -------- */

function SpamScanHero({ item, revealed }: { item?: SpamItem; revealed: boolean }) {
  return <SpamGaugeHero item={item} revealed={revealed} />;
}

interface StageShellProps {
  tag: string;
  title: string;
  subtitle?: string;
  progressLabel?: string;
  hero?: React.ReactNode;
  children: React.ReactNode;
}

function StageShell({ tag, title, subtitle, progressLabel, hero, children }: StageShellProps) {
  return (
    <div className="lab-stage">
      <div className="lab-stage-top">
        <span className="lab-stage-tag"><Target size={12} /> {tag}</span>
        {progressLabel && <span className="lab-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="lab-stage-title">{title}</h2>
      {subtitle && <p className="lab-stage-subtitle">{subtitle}</p>}
      {hero && <div className="lab-hero">{hero}</div>}
      {children}
    </div>
  );
}

interface NavButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  step?: number;
  total?: number;
}

function NavButtons({ onBack, onNext, backDisabled, nextDisabled, nextLabel, step, total }: NavButtonsProps) {
  return (
    <div className="lab-nav">
      <button className="lab-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      {step && total ? <span className="lab-step-counter">{step} / {total}</span> : null}
      <button className="lab-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ────────────────────────────── MAIN APP ────────────────────────────── */

export default function MLWithoutMathLab() {
  const router = useRouter();
  const [current, setCurrent] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);
  const [labCompleted, setLabCompleted] = useState(false);
  const total = STAGE_META.length;

  const [spotAnswers, setSpotAnswers] = useState<SpotAnswerMap>({});
  const [visitedSteps, setVisitedSteps] = useState<VisitedMap>({});
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [splitAnswers, setSplitAnswers] = useState<SplitAnswerMap>({});
  const [spamAnswers, setSpamAnswers] = useState<SpamAnswerMap>({});

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

  const jumpTo = (idx: number) => setCurrent(idx);

  const spotDone = Object.keys(spotAnswers).length === SPOT_ITEMS.length;
  const pipelineDone = Object.keys(visitedSteps).length === PIPELINE_STEPS.length;
  const splitDone = Object.keys(splitAnswers).length === SPLIT_ITEMS.length;
  const spamDone = Object.keys(spamAnswers).length === SPAM_ITEMS.length;

  const activePipelineStep = useMemo(
    () => PIPELINE_STEPS.find((st) => !visitedSteps[st.id]) || PIPELINE_STEPS[PIPELINE_STEPS.length - 1],
    [visitedSteps]
  );
  const activeSpamItem = useMemo(
    () => SPAM_ITEMS.find((it) => !spamAnswers[it.id]) || SPAM_ITEMS[SPAM_ITEMS.length - 1],
    [spamAnswers]
  );
  const activeSpamRevealed = !!spamAnswers[activeSpamItem?.id || ""];

  const scores = useMemo(() => {
    const spotCorrect = SPOT_ITEMS.filter((it) => spotAnswers[it.id] === it.answer).length;
    const splitCorrect = SPLIT_ITEMS.filter((it) => splitAnswers[it.id] === it.answer).length;
    const spamCorrect = SPAM_ITEMS.filter((it) => spamAnswers[it.id] === it.answer).length;
    return { spotCorrect, splitCorrect, spamCorrect };
  }, [spotAnswers, splitAnswers, spamAnswers]);

  const totalScore = scores.spotCorrect + scores.splitCorrect + scores.spamCorrect;
  const totalPossible = SPOT_ITEMS.length + SPLIT_ITEMS.length + SPAM_ITEMS.length;
  const scorePct = Math.round((totalScore / totalPossible) * 100);

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false]);
    setSpotAnswers({});
    setVisitedSteps({});
    setOpenStep(null);
    setSplitAnswers({});
    setSpamAnswers({});
    setToast(null);
    setLabCompleted(false);
  };

  /* Unified back/next handlers -- mirrors the AI Foundations Lab pattern exactly */
  const goPrev = () => jumpTo(clamp(current - 1, 0, total - 1));
  const goNext = () => {
    if (current === total - 1) {
      markLabTopicComplete("ml-without-math-lab");
      setLabCompleted(true);
      return;
    }

    jumpTo(current + 1);
  };

  const currentMeta = STAGE_META[current];

  return (
    <div className="lab-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ${STYLES}
      `}</style>

      <div className="lab-orb lab-orb-1" />
      <div className="lab-orb lab-orb-2" />
      <div className="lab-orb lab-orb-3" />

      {toast && (
        <div className={`lab-toast ${toast.mood === "up" ? "lab-toast-up" : "lab-toast-down"}`}>
          {toast.mood === "up" ? <Sparkles size={15} /> : <XCircle size={15} />}
          {toast.text}
        </div>
      )}

      <div className="lab-container">
        <Link href="/" className="lab-back">
          <ArrowLeft size={16} /> Back to Curriculum
        </Link>

        <div className="lab-header">
          <div className="lab-header-badge">
            <Compass size={14} /> Interactive Lab
          </div>
          <h1 className="lab-h1">Machine Learning Without Math</h1>
          <p className="lab-subtitle">
            No formulas, no code — just the ideas, made visual. Watch a learning curve climb, follow
            data through a live pipeline, drag a slider to split a dataset, and swing a real spam
            meter into place.
          </p>
        </div>

        {current <= 3 && (
          <Stepper current={current} completed={completed} onJump={jumpTo} />
        )}

        {/* STAGE 0: What Is Learning? */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Spot the Learning"
            subtitle="Watch the simulator, then read each scenario below: is something actually learning, or just repeating a fixed behavior?"
            progressLabel={`${Object.keys(spotAnswers).length}/${SPOT_ITEMS.length} sorted`}
            hero={<LearningCurveHero />}
          >
            <div className="lab-items">
              {SPOT_ITEMS.map((item) => {
                const chosen = spotAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="lab-item">
                    <div className="lab-item-head">
                      <IconBadge icon={item.icon} accent="indigo" />
                      <p className="lab-item-text">{item.text}</p>
                    </div>
                    {!chosen ? (
                      <div className="lab-choices">
                        <button
                          className="lab-choice lab-choice-emerald"
                          onClick={() => {
                            setSpotAnswers((p) => ({ ...p, [item.id]: "learning" }));
                            fireToast("learning" === item.answer);
                          }}
                        >
                          <Brain size={16} /> Real Learning
                        </button>
                        <button
                          className="lab-choice lab-choice-rose"
                          onClick={() => {
                            setSpotAnswers((p) => ({ ...p, [item.id]: "rules" }));
                            fireToast("rules" === item.answer);
                          }}
                        >
                          <Repeat size={16} /> Just Repeating
                        </button>
                      </div>
                    ) : (
                      <div className={`lab-feedback ${isCorrect ? "lab-feedback-correct" : "lab-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="lab-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="lab-feedback-icon" />
                        )}
                        <p className="lab-feedback-text">
                          {isCorrect ? "Correct — " : `Actually, this is ${item.answer === "learning" ? "real learning" : "just repeating a fixed behavior"}. `}
                          {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              step={current + 1}
              total={total}
              backDisabled={current === 0}
              onBack={goPrev}
              nextDisabled={false}
              nextLabel={current === total - 1 ? "Finish & Unlock Next" : "Next"}
              onNext={goNext}
            />
          </StageShell>
        )}

        {/* STAGE 1: How Machines Learn */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Dig Through the Pipeline"
            subtitle="Watch data flow through the live pipeline above, then tap each step below to reveal what happens at that stage."
            progressLabel={`${Object.keys(visitedSteps).length}/${PIPELINE_STEPS.length} uncovered`}
            hero={<PipelineFlowHero steps={PIPELINE_STEPS} activeId={activePipelineStep?.id} />}
          >
            <div className="lab-timeline">
              <div className="lab-timeline-line" />
              <div className="lab-timeline-list">
                {PIPELINE_STEPS.map((step) => {
                  const isOpen = openStep === step.id;
                  const isVisited = visitedSteps[step.id];
                  return (
                    <div key={step.id} className="lab-timeline-item">
                      <div className={`lab-timeline-dot${isVisited ? " visited" : ""}`} />
                      <button
                        className="lab-timeline-card"
                        onClick={() => {
                          setOpenStep(isOpen ? null : step.id);
                          setVisitedSteps((p) => ({ ...p, [step.id]: true }));
                        }}
                      >
                        <div className="lab-timeline-top">
                          <div className="lab-timeline-left">
                            <div className="lab-icon-badge lab-icon-badge-amber">
                              <RefreshCw size={17} strokeWidth={2.25} />
                            </div>
                            <span className="lab-timeline-title">{step.title}</span>
                          </div>
                          <span className="lab-timeline-year">{step.year}</span>
                        </div>
                        {isOpen && <p className="lab-timeline-text">{step.text}</p>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <NavButtons
              step={current + 1}
              total={total}
              backDisabled={current === 0}
              onBack={goPrev}
              nextDisabled={false}
              nextLabel={current === total - 1 ? "Finish & Unlock Next" : "Next"}
              onNext={goNext}
            />
          </StageShell>
        )}

        {/* STAGE 2: Training vs Testing */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Training Set or Testing Set?"
            subtitle="Drag the slider to see how a dataset splits, then sort each example below into the pile it belongs to."
            progressLabel={`${Object.keys(splitAnswers).length}/${SPLIT_ITEMS.length} sorted`}
            hero={<SplitRatioHero />}
          >
            <div className="lab-items">
              {SPLIT_ITEMS.map((item) => {
                const chosen = splitAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="lab-item">
                    <div className="lab-item-head">
                      <IconBadge icon={item.icon} accent="cyan" />
                      <p className="lab-item-text">{item.label}</p>
                    </div>
                    {!chosen ? (
                      <div className="lab-classify-choices">
                        <button
                          className="lab-classify-btn lab-classify-btn-indigo"
                          onClick={() => {
                            setSplitAnswers((p) => ({ ...p, [item.id]: "training" }));
                            fireToast("training" === item.answer);
                          }}
                        >
                          <GitBranch size={18} strokeWidth={2.25} />
                          <span>
                            {SPLIT_CATEGORIES[0].label}
                            <span className="lab-classify-sub">{SPLIT_CATEGORIES[0].hint}</span>
                          </span>
                        </button>
                        <button
                          className="lab-classify-btn lab-classify-btn-amber"
                          onClick={() => {
                            setSplitAnswers((p) => ({ ...p, [item.id]: "testing" }));
                            fireToast("testing" === item.answer);
                          }}
                        >
                          <CheckCircle2 size={18} strokeWidth={2.25} />
                          <span>
                            {SPLIT_CATEGORIES[1].label}
                            <span className="lab-classify-sub">{SPLIT_CATEGORIES[1].hint}</span>
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className={`lab-feedback ${isCorrect ? "lab-feedback-correct" : "lab-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="lab-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="lab-feedback-icon" />
                        )}
                        <p className="lab-feedback-text">
                          Correct pile: <strong style={{ color: palette.ink }}>{SPLIT_CATEGORIES.find((c) => c.id === item.answer)?.label}</strong> — {SPLIT_CATEGORIES.find((c) => c.id === item.answer)?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              step={current + 1}
              total={total}
              backDisabled={current === 0}
              onBack={goPrev}
              nextDisabled={false}
              nextLabel={current === total - 1 ? "Finish & Unlock Next" : "Next"}
              onNext={goNext}
            />
          </StageShell>
        )}

        {/* STAGE 3: Worked Example */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Train a Spam Filter"
            subtitle="Guess first, then watch the spam-o-meter above swing to the real score. Exactly what a model sees during training: an example, then the correct label."
            progressLabel={`${Object.keys(spamAnswers).length}/${SPAM_ITEMS.length} labeled`}
            hero={<SpamScanHero item={activeSpamItem} revealed={activeSpamRevealed} />}
          >
            <div className="lab-items">
              {SPAM_ITEMS.map((item) => {
                const chosen = spamAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="lab-item">
                    <div className="lab-item-head">
                      <IconBadge icon={Mail} accent="rose" />
                      <p className="lab-item-text">{item.text}</p>
                    </div>
                    {!chosen ? (
                      <div className="lab-choices">
                        <button
                          className="lab-choice lab-choice-rose"
                          onClick={() => {
                            setSpamAnswers((p) => ({ ...p, [item.id]: "spam" }));
                            fireToast("spam" === item.answer);
                          }}
                        >
                          <ShieldAlert size={16} /> Spam
                        </button>
                        <button
                          className="lab-choice lab-choice-emerald"
                          onClick={() => {
                            setSpamAnswers((p) => ({ ...p, [item.id]: "not_spam" }));
                            fireToast("not_spam" === item.answer);
                          }}
                        >
                          <ShieldCheck size={16} /> Not Spam
                        </button>
                      </div>
                    ) : (
                      <div className={`lab-feedback ${isCorrect ? "lab-feedback-correct" : "lab-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="lab-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="lab-feedback-icon" />
                        )}
                        <p className="lab-feedback-text">
                          Labeled: <strong style={{ color: palette.ink }}>{item.answer === "spam" ? "Spam" : "Not Spam"}</strong> (spam score {item.score}/100) — {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <NavButtons
              step={current + 1}
              total={total}
              backDisabled={current === 0}
              onBack={goPrev}
              nextDisabled={false}
              nextLabel={current === total - 1 ? "Finish & Unlock Next" : "Next"}
              onNext={goNext}
            />

            {labCompleted && (
              <div className="completion-overlay">
                <div className="completion-modal">
                  <div className="completion-icon">🎉</div>

                  <h2>Lab Completed!</h2>

                  <p>
                    Congratulations! You have successfully completed the
                    <strong> Machine Learning Without Math Lab</strong>.
                  </p>

                  <button
                    onClick={() => {
                      setLabCompleted(false);
                      router.push("/");
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </StageShell>
        )}
      </div>
    </div>
  );
}