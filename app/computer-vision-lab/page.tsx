"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ScanFace,
  Car,
  Image as ImageIcon,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  RotateCcw,
  LucideIcon,
  ArrowLeft,
  Target,
  Smile,
  Users,
  ShieldAlert,
  Baby,
  Wind,
  Cloud,
  Bike,
  Sun,
  PawPrint,
  Apple,
  Activity,
  ScanEye,
  CloudSun,
  PenLine,
  AlertTriangle,
  FileX,
} from "lucide-react";

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */
/* Matches the AI Intro Lab / ML Without Math Lab exactly, so every module
   in the course feels like one continuous experience. */

const palette = {
  // Surfaces
  pageBg: "#F0F4F8",
  cardBg: "rgba(255,255,255,0.72)",
  cardBgSolid: "#FFFFFF",
  cardAlt: "#F8FAFC",
  // Accent spectrum
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
  // Text
  ink: "#1E293B",
  inkSoft: "#475569",
  muted: "#94A3B8",
  // Borders
  border: "rgba(148,163,184,0.25)",
  borderActive: "rgba(99,102,241,0.4)",
};

/* ─────────────────────── STAGE ACCENT (per-section theme) ─────────────────────── */

type AccentKey = "indigo" | "violet" | "cyan" | "amber" | "rose";

const STAGE_ACCENT: Record<string, AccentKey> = {
  face: "indigo",
  driving: "violet",
  classify: "cyan",
  ocr: "rose",
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

  .cvl-root {
    min-height: 100vh; width: 100%; position: relative; overflow: hidden;
    background: ${palette.pageBg};
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  }
  .cvl-root *, .cvl-root *::before, .cvl-root *::after { box-sizing: border-box; }
  .cvl-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .cvl-root button:focus-visible { outline: 3px solid ${palette.indigo}; outline-offset: 2px; }

  /* Animated background orbs */
  .cvl-orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(80px); opacity: 0.35;
  }
  .cvl-orb-1 {
    width: 500px; height: 500px; top: -120px; right: -100px;
    background: ${palette.indigoLight};
    animation: float1 18s ease-in-out infinite;
  }
  .cvl-orb-2 {
    width: 400px; height: 400px; bottom: -80px; left: -80px;
    background: ${palette.cyanLight};
    animation: float2 22s ease-in-out infinite;
  }
  .cvl-orb-3 {
    width: 300px; height: 300px; top: 50%; left: 50%;
    background: ${palette.amberLight};
    animation: float1 25s ease-in-out infinite reverse;
    opacity: 0.2;
  }

  .cvl-container {
    position: relative; z-index: 1;
    max-width: 880px; margin: 0 auto; padding: 32px 20px 60px;
  }
  @media (min-width: 768px) { .cvl-container { padding: 40px 32px 80px; } }

  /* Back button */
  .cvl-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600; color: ${palette.inkSoft};
    padding: 8px 16px; border-radius: 12px;
    background: ${palette.cardBg};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${palette.border};
    transition: all 0.2s ease; margin-bottom: 28px; text-decoration: none;
  }
  .cvl-back:hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; transform: translateX(-2px); }

  /* Header */
  .cvl-header {
    text-align: center; margin-bottom: 36px;
    animation: fadeSlideUp 0.6s ease both;
  }
  .cvl-header-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 20px; border-radius: 999px;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    color: white; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 16px;
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }
  .cvl-h1 {
    font-size: 32px; font-weight: 800;
    margin: 0 0 12px 0; line-height: 1.2;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, ${palette.indigoDeep}, ${palette.violet} 55%, ${palette.rose});
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  @media (min-width: 640px) { .cvl-h1 { font-size: 40px; } }
  .cvl-subtitle { font-size: 16px; color: ${palette.inkSoft}; max-width: 580px; margin: 0 auto; line-height: 1.6; }

  /* Reaction toast */
  .cvl-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    animation: cvlToastIn 0.35s ease forwards;
  }
  .cvl-toast-up { background: linear-gradient(135deg, ${palette.emerald}, #059669); }
  .cvl-toast-down { background: linear-gradient(135deg, ${palette.rose}, #E11D48); }
  @keyframes cvlToastIn {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  /* Progress stepper */
  .cvl-stepper {
    display: flex; align-items: center; justify-content: center;
    gap: 0; margin-bottom: 36px;
    animation: fadeSlideUp 0.7s ease both 0.1s;
  }
  .cvl-step-item { display: flex; align-items: center; gap: 0; }
  .cvl-step-btn {
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: 16px;
    transition: all 0.25s ease; position: relative;
    border: 2px solid ${palette.border};
    background: ${palette.cardBg};
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  }
  .cvl-step-btn:hover { transform: translateY(-2px); border-color: ${palette.borderActive}; }
  .cvl-step-btn.active {
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(99,102,241,0.35);
    animation: pulseGlow 2s ease-in-out infinite;
  }
  .cvl-step-btn.done {
    background: ${palette.emerald};
    border-color: transparent;
  }
  .cvl-step-connector {
    width: 32px; height: 3px; border-radius: 2px;
    background: ${palette.border};
    transition: background 0.3s ease;
  }
  .cvl-step-connector.filled { background: ${palette.emerald}; }
  @media (max-width: 639px) {
    .cvl-step-btn { width: 40px; height: 40px; border-radius: 12px; }
    .cvl-step-connector { width: 16px; }
  }

  /* Stage hero illustration -- content-linked */
  .cvl-hero {
    display: flex; align-items: center; justify-content: center;
    min-height: 108px; margin-bottom: 8px; padding: 12px 8px;
    animation: fadeSlideUp 0.6s ease both 0.15s;
  }

  /* Spectrum hero (Stage 1: true vs myth) */
  .cvl-hero-spectrum { display: flex; align-items: center; gap: 14px; width: 100%; max-width: 420px; }
  .cvl-hero-pole { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
  .cvl-hero-pole-icon {
    width: 42px; height: 42px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .cvl-hero-pole-label {
    font-size: 10px; font-weight: 700; color: ${palette.muted};
    text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap;
  }
  .cvl-hero-bar { flex: 1; height: 4px; border-radius: 2px; position: relative; background: ${palette.border}; }
  .cvl-hero-marker {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    animation: heroIn 0.4s ease both;
  }

  /* Versus hero (Stage 2: critical vs background) */
  .cvl-hero-duel { display: flex; align-items: center; gap: 18px; }
  .cvl-hero-duel-side {
    width: 50px; height: 50px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    background: ${palette.cardAlt}; border: 1px solid ${palette.border};
  }
  .cvl-hero-duel-mid { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .cvl-hero-vs-label {
    font-family: 'Menlo', 'Consolas', monospace; font-size: 11px; font-weight: 800;
    color: ${palette.muted}; letter-spacing: 0.06em;
  }
  .cvl-hero-vs-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    animation: heroIn 0.4s ease both;
  }

  /* Radar hero (Stage 3: classification scavenger hunt) */
  .cvl-hero-radar { position: relative; width: 92px; height: 92px; display: flex; align-items: center; justify-content: center; }
  .cvl-hero-radar-ring {
    position: absolute; width: 92px; height: 92px; border-radius: 50%;
    border: 2px solid;
    animation: heroPing 2.4s ease-out infinite;
  }
  .cvl-hero-radar-core {
    position: relative; z-index: 1; width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    animation: heroIn 0.4s ease both;
  }

  /* Bins hero (Stage 4: sort the OCR scans) */
  .cvl-hero-bins { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .cvl-hero-falling {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 16px rgba(0,0,0,0.18);
    animation: heroDrop 0.5s ease both;
  }
  .cvl-hero-bins-row { display: flex; gap: 10px; }
  .cvl-hero-bin {
    width: 68px; height: 52px; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
    border: 2px dashed ${palette.border}; background: ${palette.cardAlt};
  }
  .cvl-hero-bin-label { font-size: 8.5px; font-weight: 700; color: ${palette.muted}; text-align: center; line-height: 1.2; }

  /* Stage card (glassmorphism) */
  .cvl-stage {
    border-radius: 24px; padding: 28px 24px;
    background: ${palette.cardBg};
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${palette.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    animation: fadeSlideUp 0.55s ease both 0.2s;
  }
  @media (min-width: 640px) { .cvl-stage { padding: 36px 32px; } }
  .cvl-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .cvl-stage-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: ${palette.indigo}; padding: 5px 14px; border-radius: 999px;
    background: rgba(99,102,241,0.08);
  }
  .cvl-stage-progress {
    font-size: 13px; font-weight: 700; color: white;
    display: flex; align-items: center; gap: 4px;
    padding: 5px 12px; border-radius: 999px;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
  }
  .cvl-stage-title {
    font-size: 26px; font-weight: 800; color: ${palette.ink};
    margin: 8px 0 6px 0; letter-spacing: -0.01em;
  }
  @media (min-width: 640px) { .cvl-stage-title { font-size: 30px; } }
  .cvl-stage-subtitle { font-size: 15px; color: ${palette.inkSoft}; margin: 0 0 12px 0; line-height: 1.6; }

  /* Item card */
  .cvl-items { display: flex; flex-direction: column; gap: 14px; margin-top: 16px; }
  .cvl-item {
    border-radius: 18px; padding: 20px;
    background: ${palette.cardBgSolid};
    border: 1px solid ${palette.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    transition: all 0.2s ease;
  }
  .cvl-item:hover { border-color: ${palette.borderActive}; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .cvl-item-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
  .cvl-item-text { font-size: 15px; color: ${palette.ink}; margin: 0; font-weight: 500; line-height: 1.55; padding-top: 6px; }

  /* Icon badge on each item */
  .cvl-icon-badge {
    flex-shrink: 0; width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .cvl-icon-badge-indigo { background: rgba(99,102,241,0.12); color: ${palette.indigoDeep}; }
  .cvl-icon-badge-violet { background: rgba(139,92,246,0.12); color: ${palette.violet}; }
  .cvl-icon-badge-cyan { background: rgba(6,182,212,0.12); color: #0E7490; }
  .cvl-icon-badge-amber { background: rgba(245,158,11,0.14); color: #B45309; }
  .cvl-icon-badge-rose { background: rgba(244,63,94,0.12); color: #BE123C; }

  /* Choice buttons */
  .cvl-choices { display: flex; gap: 10px; flex-wrap: wrap; }
  .cvl-choice {
    flex: 1; min-width: 150px; font-size: 13px; font-weight: 700; padding: 14px 16px;
    border-radius: 14px; color: #000; text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    border: 2px solid transparent;
  }
  .cvl-choice:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
  .cvl-choice:active { transform: translateY(1px); }
  .cvl-choice-indigo { background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet}); }
  .cvl-choice-rose { background: linear-gradient(135deg, ${palette.rose}, #E11D48); }
  .cvl-choice-amber { background: linear-gradient(135deg, ${palette.amber}, #D97706); }
  .cvl-choice-cyan { background: linear-gradient(135deg, ${palette.cyan}, #0891B2); }
  .cvl-choice-emerald { background: linear-gradient(135deg, ${palette.emerald}, #059669); }

  /* Classify option buttons (OCR: 3 categories) */
  .cvl-classify-choices { display: grid; grid-template-columns: 1fr; gap: 10px; }
  @media (min-width: 480px) { .cvl-classify-choices { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 640px) { .cvl-classify-choices { grid-template-columns: 1fr 1fr 1fr; } }
  .cvl-classify-btn {
    display: flex; align-items: center; gap: 10px; text-align: left;
    padding: 14px 16px; border-radius: 14px;
    border: 2px solid; font-weight: 700; font-size: 13px;
    transition: all 0.2s ease;
  }
  .cvl-classify-btn:hover { transform: translateY(-2px); }
  .cvl-classify-btn-indigo { background: rgba(99,102,241,0.08); border-color: ${palette.indigo}; color: ${palette.indigoDeep}; }
  .cvl-classify-btn-indigo:hover { background: ${palette.indigo}; color: white; box-shadow: 0 6px 18px rgba(99,102,241,0.35); }
  .cvl-classify-btn-amber { background: rgba(245,158,11,0.1); border-color: ${palette.amber}; color: #92400E; }
  .cvl-classify-btn-amber:hover { background: ${palette.amber}; color: white; box-shadow: 0 6px 18px rgba(245,158,11,0.35); }
  .cvl-classify-btn-rose { background: rgba(244,63,94,0.08); border-color: ${palette.rose}; color: #9F1239; }
  .cvl-classify-btn-rose:hover { background: ${palette.rose}; color: white; box-shadow: 0 6px 18px rgba(244,63,94,0.35); }
  .cvl-classify-sub { display: block; font-weight: 500; font-size: 11px; opacity: 0.75; margin-top: 2px; }

  /* Feedback */
  .cvl-feedback {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px; border-radius: 14px;
    border: 1px solid transparent;
    animation: popIn 0.3s ease both;
  }
  .cvl-feedback-correct { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.25); }
  .cvl-feedback-wrong { background: rgba(244,63,94,0.08); border-color: rgba(244,63,94,0.25); }
  .cvl-feedback-text { font-size: 14px; color: ${palette.inkSoft}; margin: 0; line-height: 1.55; }
  .cvl-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  /* Hunt grid (image classification scavenger hunt) */
  .cvl-hunt-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 16px; }
  @media (min-width: 640px) { .cvl-hunt-grid { grid-template-columns: 1fr 1fr; } }
  .cvl-hunt-card {
    text-align: left; border-radius: 18px; padding: 20px;
    background: ${palette.cardBgSolid}; border: 2px solid ${palette.border};
    transition: all 0.25s ease; width: 100%; position: relative; overflow: hidden;
  }
  .cvl-hunt-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); border-color: ${palette.borderActive}; }
  .cvl-hunt-card.found { border-color: ${palette.emerald}; }
  .cvl-hunt-card.found::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(16,185,129,0.05), transparent);
    pointer-events: none;
  }
  .cvl-hunt-top { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .cvl-hunt-dot {
    width: 20px; height: 20px; border-radius: 8px; flex-shrink: 0;
    border: 2px solid ${palette.muted}; display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  .cvl-hunt-dot.found { background: ${palette.emerald}; border-color: ${palette.emerald}; }
  .cvl-hunt-label { font-size: 14px; font-weight: 600; color: ${palette.ink}; margin: 0; }
  .cvl-hunt-reveal {
    font-size: 13px; color: ${palette.inkSoft}; margin: 10px 0 0 0; line-height: 1.55;
    animation: fadeSlideUp 0.3s ease both;
  }

  /* Nav row */
  .cvl-nav {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 32px; gap: 12px;
  }
  .cvl-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px;
    border-radius: 14px; font-size: 14px; font-weight: 700; color: ${palette.inkSoft};
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border};
    transition: all 0.2s ease;
  }
  .cvl-nav-back:not([disabled]):hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; transform: translateX(-2px); }
  .cvl-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 24px;
    border-radius: 14px; font-size: 14px; font-weight: 700; color: #000;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: all 0.2s ease;
  }
  .cvl-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .cvl-nav-next:not([disabled]):active { transform: translateY(1px); }
  .cvl-nav-next[disabled], .cvl-nav-back[disabled] {
    opacity: 0.4; cursor: default;
  }
  .cvl-nav-next[disabled] { background: ${palette.muted}; box-shadow: none; }

  /* Certificate */
  .cvl-cert {
    border-radius: 28px; padding: 40px 24px; text-align: center;
    background: ${palette.cardBg};
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${palette.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    animation: fadeSlideUp 0.6s ease both;
  }
  @media (min-width: 640px) { .cvl-cert { padding: 52px 40px; } }
  .cvl-cert-badge {
    margin: 0 auto 24px auto; width: 88px; height: 88px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, ${palette.amber}, #F97316);
    box-shadow: 0 8px 30px rgba(245,158,11,0.35);
    animation: bounceIn 0.6s ease both 0.2s;
  }
  .cvl-cert-eyebrow {
    font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: ${palette.indigo}; margin: 0 0 8px 0;
  }
  .cvl-cert-title { font-size: 28px; font-weight: 800; color: ${palette.ink}; margin: 0 0 14px 0; }
  .cvl-cert-desc { font-size: 15px; color: ${palette.inkSoft}; margin: 0 0 28px 0; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.65; }
  .cvl-cert-score-wrap {
    display: inline-flex; flex-direction: column; align-items: stretch; gap: 14px; border-radius: 20px;
    padding: 20px 28px; margin-bottom: 32px; width: 100%; max-width: 360px;
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .cvl-cert-score-top { display: flex; align-items: baseline; justify-content: center; gap: 8px; }
  .cvl-cert-score-num { font-size: 36px; font-weight: 800; color: ${palette.indigo}; }
  .cvl-cert-score-label { font-size: 13px; color: ${palette.muted}; }
  .cvl-cert-scorebar-track { width: 100%; height: 10px; border-radius: 999px; background: rgba(148,163,184,0.2); overflow: hidden; }
  .cvl-cert-scorebar-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, ${palette.emerald}, ${palette.cyan});
    animation: growBar 1s ease both 0.3s;
  }
  .cvl-cert-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 32px; }
  .cvl-cert-item {
    border-radius: 16px; padding: 14px; text-align: left;
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border};
    display: flex; align-items: center; gap: 10px;
  }
  .cvl-cert-item p { font-size: 13px; color: ${palette.ink}; margin: 0; font-weight: 600; }
  .cvl-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700;
    padding: 14px 24px; border-radius: 14px;
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border}; color: ${palette.inkSoft};
    transition: all 0.2s ease;
  }
  .cvl-reset-btn:hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; }

  @media (prefers-reduced-motion: reduce) {
    .cvl-root * { transition: none !important; animation: none !important; }
  }
`;

/* ─────────────────────────────── TYPES ─────────────────────────────── */

type FaceAnswer = "true" | "myth";
type DriveAnswer = "critical" | "background";
type OcrCategoryId = "reliable" | "tricky" | "struggles";

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

interface FaceItem {
  id: string;
  text: string;
  answer: FaceAnswer;
  explain: string;
  icon: LucideIcon;
}

interface DriveItem {
  id: string;
  text: string;
  answer: DriveAnswer;
  explain: string;
  icon: LucideIcon;
}

interface HuntItem {
  id: string;
  label: string;
  reveal: string;
  icon: LucideIcon;
}

interface OcrItem {
  id: string;
  label: string;
  answer: OcrCategoryId;
  icon: LucideIcon;
}

interface OcrCategory {
  id: OcrCategoryId;
  label: string;
  hint: string;
  icon: LucideIcon;
}

type FaceAnswerMap = Record<string, FaceAnswer>;
type DriveAnswerMap = Record<string, DriveAnswer>;
type FoundMap = Record<string, boolean>;
type OcrClassifiedMap = Record<string, OcrCategoryId>;

/* ─────────────────────────── CONTENT DATA ─────────────────────────── */

const STAGE_META: StageMetaItem[] = [
  { key: "face", title: "Face Recognition", icon: ScanFace, tag: "Stage 1 · True or Myth" },
  { key: "driving", title: "Self-Driving Cars", icon: Car, tag: "Stage 2 · Critical or Background" },
  { key: "classify", title: "Image Classification", icon: ImageIcon, tag: "Stage 3 · Scavenger Hunt" },
  { key: "ocr", title: "OCR", icon: FileText, tag: "Stage 4 · Sort the Scans" },
];

const FACE_ITEMS: FaceItem[] = [
  { id: "f1", text: "Face recognition measures the geometry of your face — like eye spacing and jaw shape — into a unique numerical map.", answer: "true", explain: "This numeric 'fingerprint' is what actually gets compared, not the raw photo itself.", icon: ScanFace },
  { id: "f2", text: "The system works by comparing your photo pixel-by-pixel against a stored photo.", answer: "myth", explain: "Pixel matching would fail instantly with different lighting or angles. Models compare extracted features instead.", icon: ImageIcon },
  { id: "f3", text: "A well-trained system can still recognise you in different lighting, angles, or expressions.", answer: "true", explain: "Modern face models are trained on huge, varied datasets specifically so they generalise across conditions.", icon: Eye },
  { id: "f4", text: "Face recognition can read your exact emotions with perfect accuracy.", answer: "myth", explain: "Emotion recognition is a separate, far less reliable task — expressions are ambiguous and culturally variable.", icon: Smile },
  { id: "f5", text: "Identical twins can sometimes fool basic face recognition systems.", answer: "true", explain: "Twins share extremely similar facial geometry, which can confuse systems that don't also check depth or texture.", icon: Users },
  { id: "f6", text: "Every face unlock system today is completely impossible to trick with a photo or mask.", answer: "myth", explain: "Only systems using depth sensing or liveness checks reliably resist this — plain 2D camera systems can be more vulnerable.", icon: ShieldAlert },
];

const DRIVE_ITEMS: DriveItem[] = [
  { id: "d1", text: "A child suddenly chasing a ball into the street.", answer: "critical", explain: "A moving person entering the car's path is exactly the kind of hazard the system must react to instantly.", icon: Baby },
  { id: "d2", text: "A plastic bag tumbling across the road in the wind.", answer: "background", explain: "Lightweight, non-solid debris poses no real collision risk — the system should note it but not brake hard.", icon: Wind },
  { id: "d3", text: "Brake lights suddenly turning on in the car directly ahead.", answer: "critical", explain: "This directly signals the car in front is slowing — an immediate, high-priority signal to react to.", icon: Car },
  { id: "d4", text: "A tree's shadow sweeping across the lane as the car drives past.", answer: "background", explain: "A shadow has no physical presence — vision systems are trained to recognise and ignore this pattern.", icon: Cloud },
  { id: "d5", text: "A cyclist signalling a left turn just ahead of the car.", answer: "critical", explain: "A cyclist changing direction is a moving hazard requiring the car to predict and adjust its path.", icon: Bike },
  { id: "d6", text: "Sunlight reflections shimmering on a wet road surface.", answer: "background", explain: "Reflections and glare are visual noise the perception system is trained to filter out from real obstacles.", icon: Sun },
];

const HUNT_ITEMS: HuntItem[] = [
  { id: "h1", label: "Cat vs Dog", reveal: "The model learns ear shape, snout length, and fur patterns that reliably separate the two from thousands of labelled photos.", icon: PawPrint },
  { id: "h2", label: "Ripe vs Unripe Fruit", reveal: "Colour distribution and surface texture are the strongest signals a classifier learns to rely on.", icon: Apple },
  { id: "h3", label: "Handwritten Digit: 3 or 8?", reveal: "Curves and closed loops in the strokes are the pixels the model weighs most heavily.", icon: PenLine },
  { id: "h4", label: "X-ray: Fracture vs Healthy Bone", reveal: "Sharp discontinuities in bone density patterns are what the model has learned to flag as unusual.", icon: Activity },
  { id: "h5", label: "Real Photo vs AI-Generated Image", reveal: "Subtle texture artifacts and inconsistent lighting are often the giveaway patterns a detector picks up on.", icon: ScanEye },
  { id: "h6", label: "Sunny vs Cloudy vs Rainy Sky", reveal: "Cloud coverage, sky brightness, and colour gradients drive the classification between weather types.", icon: CloudSun },
];

const OCR_ITEMS: OcrItem[] = [
  { id: "o1", label: "Clean, printed black text on a white page", answer: "reliable", icon: FileText },
  { id: "o2", label: "A clearly printed invoice scanned at high resolution", answer: "reliable", icon: FileText },
  { id: "o3", label: "Messy, fast handwritten cursive notes", answer: "tricky", icon: PenLine },
  { id: "o4", label: "A street sign photographed at a sharp angle in dim light", answer: "tricky", icon: AlertTriangle },
  { id: "o5", label: "Text on a crumpled, torn, or heavily stained page", answer: "struggles", icon: FileX },
  { id: "o6", label: "Text overlapping a busy, cluttered background photo", answer: "struggles", icon: ImageIcon },
];

const OCR_CATEGORIES: OcrCategory[] = [
  { id: "reliable", label: "OCR Handles Well", hint: "Clean, high-contrast, well-lit text", icon: FileText },
  { id: "tricky", label: "OCR Struggles But Can Manage", hint: "Needs extra processing or gets partial results", icon: AlertTriangle },
  { id: "struggles", label: "OCR Often Fails", hint: "Too degraded, cluttered, or distorted", icon: FileX },
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
    <div className="cvl-stepper">
      {STAGE_META.map((s, i) => {
        const Icon = s.icon;
        const isDone = completed[i];
        const isCurrent = current === i;
        return (
          <div key={s.key} className="cvl-step-item">
            {i > 0 && (
              <div className={`cvl-step-connector${completed[i - 1] ? " filled" : ""}`} />
            )}
            <button
              className={`cvl-step-btn${isCurrent ? " active" : ""}${isDone ? " done" : ""}`}
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
    <div className={`cvl-icon-badge cvl-icon-badge-${accent}`}>
      <Icon size={19} strokeWidth={2.25} />
    </div>
  );
}

/* -------- Stage hero illustrations, each reflecting the active (first unanswered) question -------- */

function FaceSpectrumHero({ item }: { item?: FaceItem }) {
  if (!item) return null;
  const Icon = item.icon;
  const accent = ACCENT_HEX[STAGE_ACCENT.face];
  return (
    <div className="cvl-hero-spectrum">
      <div className="cvl-hero-pole">
        <div className="cvl-hero-pole-icon" style={{ background: "rgba(244,63,94,0.12)", color: "#BE123C" }}>
          <XCircle size={20} />
        </div>
        <span className="cvl-hero-pole-label">Myth</span>
      </div>
      <div className="cvl-hero-bar">
        <div
          className="cvl-hero-marker"
          style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.deep})` }}
        >
          <Icon size={20} color="#fff" />
        </div>
      </div>
      <div className="cvl-hero-pole">
        <div className="cvl-hero-pole-icon" style={{ background: "rgba(16,185,129,0.14)", color: "#047857" }}>
          <CheckCircle2 size={20} />
        </div>
        <span className="cvl-hero-pole-label">Verified True</span>
      </div>
    </div>
  );
}

function DriveDuelHero({ item }: { item?: DriveItem }) {
  if (!item) return null;
  const Icon = item.icon;
  const accent = ACCENT_HEX[STAGE_ACCENT.driving];
  return (
    <div className="cvl-hero-duel">
      <div className="cvl-hero-duel-side">
        <AlertTriangle size={24} color={palette.inkSoft} />
      </div>
      <div className="cvl-hero-duel-mid">
        <div
          className="cvl-hero-vs-icon"
          style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.deep})` }}
        >
          <Icon size={20} color="#fff" />
        </div>
        <span className="cvl-hero-vs-label">VS</span>
      </div>
      <div className="cvl-hero-duel-side">
        <Wind size={24} color={palette.inkSoft} />
      </div>
    </div>
  );
}

function HuntRadarHero({ item }: { item?: HuntItem }) {
  if (!item) return null;
  const Icon = item.icon;
  const accent = ACCENT_HEX[STAGE_ACCENT.classify];
  return (
    <div className="cvl-hero-radar">
      <div className="cvl-hero-radar-ring" style={{ borderColor: accent.main, animationDelay: "0s" }} />
      <div className="cvl-hero-radar-ring" style={{ borderColor: accent.main, animationDelay: "0.8s" }} />
      <div
        className="cvl-hero-radar-core"
        style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.deep})` }}
      >
        <Icon size={22} color="#fff" />
      </div>
    </div>
  );
}

function OcrBinsHero({ item }: { item?: OcrItem }) {
  if (!item) return null;
  const Icon = item.icon;
  const accent = ACCENT_HEX[STAGE_ACCENT.ocr];
  return (
    <div className="cvl-hero-bins">
      <div
        className="cvl-hero-falling"
        style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.deep})` }}
      >
        <Icon size={20} color="#fff" />
      </div>
      <div className="cvl-hero-bins-row">
        {OCR_CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <div key={cat.id} className="cvl-hero-bin">
              <CatIcon size={16} color={palette.muted} />
              <span className="cvl-hero-bin-label">{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
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
    <div className="cvl-stage">
      <div className="cvl-stage-top">
        <span className="cvl-stage-tag"><Target size={12} /> {tag}</span>
        {progressLabel && <span className="cvl-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="cvl-stage-title">{title}</h2>
      {subtitle && <p className="cvl-stage-subtitle">{subtitle}</p>}
      {hero && <div className="cvl-hero">{hero}</div>}
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
}

function NavButtons({ onBack, onNext, backDisabled, nextDisabled, nextLabel }: NavButtonsProps) {
  return (
    <div className="cvl-nav">
      <button className="cvl-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <button className="cvl-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ────────────────────────────── MAIN APP ────────────────────────────── */

export default function ComputerVisionLab() {
  const [current, setCurrent] = useState<number>(0); // 0..3 stages, 4 = certificate
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);

  const [faceAnswers, setFaceAnswers] = useState<FaceAnswerMap>({});
  const [driveAnswers, setDriveAnswers] = useState<DriveAnswerMap>({});
  const [found, setFound] = useState<FoundMap>({});
  const [ocrClassified, setOcrClassified] = useState<OcrClassifiedMap>({});

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

  const goTo = (idx: number) => setCurrent(idx);

  const faceDone = Object.keys(faceAnswers).length === FACE_ITEMS.length;
  const driveDone = Object.keys(driveAnswers).length === DRIVE_ITEMS.length;
  const huntDone = Object.keys(found).length === HUNT_ITEMS.length;
  const ocrDone = Object.keys(ocrClassified).length === OCR_ITEMS.length;

  const activeFaceItem = useMemo(
    () => FACE_ITEMS.find((it) => !faceAnswers[it.id]) || FACE_ITEMS[FACE_ITEMS.length - 1],
    [faceAnswers]
  );
  const activeDriveItem = useMemo(
    () => DRIVE_ITEMS.find((it) => !driveAnswers[it.id]) || DRIVE_ITEMS[DRIVE_ITEMS.length - 1],
    [driveAnswers]
  );
  const activeHuntItem = useMemo(
    () => HUNT_ITEMS.find((it) => !found[it.id]) || HUNT_ITEMS[HUNT_ITEMS.length - 1],
    [found]
  );
  const activeOcrItem = useMemo(
    () => OCR_ITEMS.find((it) => !ocrClassified[it.id]) || OCR_ITEMS[OCR_ITEMS.length - 1],
    [ocrClassified]
  );

  const scores = useMemo(() => {
    const faceCorrect = FACE_ITEMS.filter((it) => faceAnswers[it.id] === it.answer).length;
    const driveCorrect = DRIVE_ITEMS.filter((it) => driveAnswers[it.id] === it.answer).length;
    const ocrCorrect = OCR_ITEMS.filter((it) => ocrClassified[it.id] === it.answer).length;
    return { faceCorrect, driveCorrect, ocrCorrect };
  }, [faceAnswers, driveAnswers, ocrClassified]);

  const totalScore = scores.faceCorrect + scores.driveCorrect + scores.ocrCorrect;
  const totalPossible = FACE_ITEMS.length + DRIVE_ITEMS.length + OCR_ITEMS.length;
  const scorePct = Math.round((totalScore / totalPossible) * 100);

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false]);
    setFaceAnswers({});
    setDriveAnswers({});
    setFound({});
    setOcrClassified({});
    setToast(null);
  };

  return (
    <div className="cvl-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ${STYLES}
      `}</style>

      {/* Background orbs */}
      <div className="cvl-orb cvl-orb-1" />
      <div className="cvl-orb cvl-orb-2" />
      <div className="cvl-orb cvl-orb-3" />

      {toast && (
        <div className={`cvl-toast ${toast.mood === "up" ? "cvl-toast-up" : "cvl-toast-down"}`}>
          {toast.mood === "up" ? <Sparkles size={15} /> : <XCircle size={15} />}
          {toast.text}
        </div>
      )}

      <div className="cvl-container">
        <Link href="/" className="cvl-back">
          <ArrowLeft size={16} /> Back to Curriculum
        </Link>

        <div className="cvl-header">
          <div className="cvl-header-badge">
            <Eye size={14} /> Interactive Lab
          </div>
          <h1 className="cvl-h1">Computer Vision Lab</h1>
          <p className="cvl-subtitle">
            Explore how machines see: separating fact from myth in face recognition, spotting real
            hazards on the road, classifying images, and sorting what OCR can and can&apos;t read.
          </p>
        </div>

        {current <= 3 && (
          <Stepper current={current} completed={completed} onJump={goTo} />
        )}

        {/* STAGE 0: Face Recognition */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="True or Myth: Face Recognition"
            subtitle="Read each claim about how face recognition really works. Decide: is it true, or a common myth?"
            progressLabel={`${Object.keys(faceAnswers).length}/${FACE_ITEMS.length} sorted`}
            hero={<FaceSpectrumHero item={activeFaceItem} />}
          >
            <div className="cvl-items">
              {FACE_ITEMS.map((item) => {
                const chosen = faceAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="cvl-item">
                    <div className="cvl-item-head">
                      <IconBadge icon={item.icon} accent="indigo" />
                      <p className="cvl-item-text">{item.text}</p>
                    </div>
                    {!chosen ? (
                      <div className="cvl-choices">
                        <button
                          className="cvl-choice cvl-choice-emerald"
                          onClick={() => {
                            setFaceAnswers((p) => ({ ...p, [item.id]: "true" }));
                            fireToast("true" === item.answer);
                          }}
                        >
                          <CheckCircle2 size={16} /> True
                        </button>
                        <button
                          className="cvl-choice cvl-choice-rose"
                          onClick={() => {
                            setFaceAnswers((p) => ({ ...p, [item.id]: "myth" }));
                            fireToast("myth" === item.answer);
                          }}
                        >
                          <XCircle size={16} /> Myth
                        </button>
                      </div>
                    ) : (
                      <div className={`cvl-feedback ${isCorrect ? "cvl-feedback-correct" : "cvl-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="cvl-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="cvl-feedback-icon" />
                        )}
                        <p className="cvl-feedback-text">
                          {isCorrect ? "Correct — " : `Actually, this is ${item.answer === "true" ? "true" : "a myth"}. `}
                          {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons backDisabled onBack={() => {}} nextDisabled={!faceDone} onNext={() => { markComplete(0); setCurrent(1); }} />
          </StageShell>
        )}

        {/* STAGE 1: Self-Driving Cars */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Critical or Background?"
            subtitle="A self-driving car's vision system sees everything, but must decide what to react to. Sort each detection."
            progressLabel={`${Object.keys(driveAnswers).length}/${DRIVE_ITEMS.length} sorted`}
            hero={<DriveDuelHero item={activeDriveItem} />}
          >
            <div className="cvl-items">
              {DRIVE_ITEMS.map((item) => {
                const chosen = driveAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="cvl-item">
                    <div className="cvl-item-head">
                      <IconBadge icon={item.icon} accent="violet" />
                      <p className="cvl-item-text">{item.text}</p>
                    </div>
                    {!chosen ? (
                      <div className="cvl-choices">
                        <button
                          className="cvl-choice cvl-choice-rose"
                          onClick={() => {
                            setDriveAnswers((p) => ({ ...p, [item.id]: "critical" }));
                            fireToast("critical" === item.answer);
                          }}
                        >
                          <AlertTriangle size={16} /> Critical Hazard
                        </button>
                        <button
                          className="cvl-choice cvl-choice-amber"
                          onClick={() => {
                            setDriveAnswers((p) => ({ ...p, [item.id]: "background" }));
                            fireToast("background" === item.answer);
                          }}
                        >
                          <Wind size={16} /> Background Noise
                        </button>
                      </div>
                    ) : (
                      <div className={`cvl-feedback ${isCorrect ? "cvl-feedback-correct" : "cvl-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="cvl-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="cvl-feedback-icon" />
                        )}
                        <p className="cvl-feedback-text">
                          {isCorrect ? "Correct — " : `Actually, this is ${item.answer === "critical" ? "a critical hazard" : "background noise"}. `}
                          {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons onBack={() => setCurrent(0)} nextDisabled={!driveDone} onNext={() => { markComplete(1); setCurrent(2); }} />
          </StageShell>
        )}

        {/* STAGE 2: Image Classification */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Image Classification: Scavenger Hunt"
            subtitle="Tap each classification pair to reveal the visual features a model actually relies on to tell them apart."
            progressLabel={`${Object.keys(found).length}/${HUNT_ITEMS.length} found`}
            hero={<HuntRadarHero item={activeHuntItem} />}
          >
            <div className="cvl-hunt-grid">
              {HUNT_ITEMS.map((item) => {
                const isFound = found[item.id];
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`cvl-hunt-card${isFound ? " found" : ""}`}
                    onClick={() => setFound((p) => ({ ...p, [item.id]: true }))}
                  >
                    <div className="cvl-hunt-top">
                      <div className="cvl-icon-badge cvl-icon-badge-cyan">
                        <Icon size={18} strokeWidth={2.25} />
                      </div>
                      <p className="cvl-hunt-label" style={{ flex: 1 }}>{item.label}</p>
                      {isFound ? (
                        <div className="cvl-hunt-dot found">
                          <Sparkles size={12} color="white" />
                        </div>
                      ) : (
                        <div className="cvl-hunt-dot" />
                      )}
                    </div>
                    {isFound && <p className="cvl-hunt-reveal">{item.reveal}</p>}
                  </button>
                );
              })}
            </div>
            <NavButtons onBack={() => setCurrent(1)} nextDisabled={!huntDone} onNext={() => { markComplete(2); setCurrent(3); }} />
          </StageShell>
        )}

        {/* STAGE 3: OCR */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Sort the Scans"
            subtitle="OCR doesn't handle every document equally well. Sort each example into how OCR is likely to perform on it."
            progressLabel={`${Object.keys(ocrClassified).length}/${OCR_ITEMS.length} sorted`}
            hero={<OcrBinsHero item={activeOcrItem} />}
          >
            <div className="cvl-items">
              {OCR_ITEMS.map((item) => {
                const chosen = ocrClassified[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="cvl-item">
                    <div className="cvl-item-head">
                      <IconBadge icon={item.icon} accent="rose" />
                      <p className="cvl-item-text">{item.label}</p>
                    </div>
                    {!chosen ? (
                      <div className="cvl-classify-choices">
                        {OCR_CATEGORIES.map((cat) => {
                          const colorKey = cat.id === "reliable" ? "indigo" : cat.id === "tricky" ? "amber" : "rose";
                          const CatIcon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              className={`cvl-classify-btn cvl-classify-btn-${colorKey}`}
                              onClick={() => {
                                setOcrClassified((p) => ({ ...p, [item.id]: cat.id }));
                                fireToast(cat.id === item.answer);
                              }}
                            >
                              <CatIcon size={18} strokeWidth={2.25} />
                              <span>
                                {cat.label}
                                <span className="cvl-classify-sub">{cat.hint}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`cvl-feedback ${isCorrect ? "cvl-feedback-correct" : "cvl-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="cvl-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="cvl-feedback-icon" />
                        )}
                        <p className="cvl-feedback-text">
                          Correct category: <strong style={{ color: palette.ink }}>{OCR_CATEGORIES.find((c) => c.id === item.answer)?.label}</strong> — {OCR_CATEGORIES.find((c) => c.id === item.answer)?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons onBack={() => setCurrent(2)} nextDisabled={!ocrDone} nextLabel="Finish Lab" onNext={() => { markComplete(3); setCurrent(4); }} />
          </StageShell>
        )}

        {/* CERTIFICATE */}
        {current === 4 && (
          <div className="cvl-cert">
            <div className="cvl-cert-badge">
              <Award size={40} color="white" />
            </div>
            <p className="cvl-cert-eyebrow">Certificate of Completion</p>
            <h2 className="cvl-cert-title">You&apos;ve completed Module 3</h2>
            <p className="cvl-cert-desc">
              You separated fact from myth in face recognition, judged real driving hazards,
              uncovered how image classifiers really see, and sorted what OCR can and can&apos;t
              reliably read.
            </p>

            <div className="cvl-cert-score-wrap">
              <div className="cvl-cert-score-top">
                <span className="cvl-cert-score-num">{totalScore}/{totalPossible}</span>
                <span className="cvl-cert-score-label">correct ({scorePct}%)</span>
              </div>
              <div className="cvl-cert-scorebar-track">
                <div className="cvl-cert-scorebar-fill" style={{ width: `${scorePct}%` }} />
              </div>
            </div>

            <div className="cvl-cert-grid">
              {STAGE_META.map((s) => (
                <div key={s.key} className="cvl-cert-item">
                  <CheckCircle2 size={16} color={palette.emerald} />
                  <p>{s.title}</p>
                </div>
              ))}
            </div>

            <button className="cvl-reset-btn" onClick={resetAll}>
              <RotateCcw size={15} /> Restart the Lab
            </button>
          </div>
        )}
      </div>
    </div>
  );
}