"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  Table2,
  Image as ImageIcon,
  Music,
  FileText,
  Cloud,
  Sparkles,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  RotateCcw,
  LucideIcon,
} from "lucide-react";

const colors = {
  bg: "#F0F4F8",
  bgSoft: "#E7ECF5",
  card: "#FFFFFF",
  cardAlt: "#F8FAFC",
  border: "rgba(148,163,184,0.25)",
  borderSoft: "rgba(148,163,184,0.18)",
  borderActive: "rgba(99,102,241,0.4)",
  gold: "#6366F1",
  goldDeep: "#4F46E5",
  goldDeepest: "#3730A3",
  coral: "#F43F5E",
  coralDeep: "#E11D48",
  purple: "#8B5CF6",
  purpleDeep: "#7C3AED",
  teal: "#06B6D4",
  tealDeep: "#0E7490",
  ink: "#1E293B",
  inkSoft: "#475569",
  muted: "#94A3B8",
  codeBg: "#1E1B31",
  codeText: "#ECE7FF",
};

/* All layout/spacing/typography lives in plain CSS below, so this component
   has zero dependency on Tailwind being configured in the host project. */
const STYLES = `
  .aiel-root {
    min-height: 100vh;
    width: 100%;
    padding: 32px 16px;
    background: radial-gradient(circle at 20% -10%, ${colors.bgSoft} 0%, ${colors.bg} 55%);
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    box-sizing: border-box;
    position: relative;
    overflow-x: hidden;
  }
  .aiel-root *, .aiel-root *::before, .aiel-root *::after { box-sizing: border-box; }
  .aiel-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .aiel-root button:focus-visible { outline: 3px solid ${colors.purple}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .aiel-root * { transition: none !important; animation: none !important; }
  }

  /* -------------------- Decorative floating blobs -------------------- */
  .aiel-blob { position: absolute; border-radius: 999px; filter: blur(70px); opacity: 0.3; pointer-events: none; z-index: 0; }
  .aiel-blob-1 { width: 320px; height: 320px; background: #A5B4FC; top: -60px; left: 2%; animation: aiel-float-a 9s ease-in-out infinite; }
  .aiel-blob-2 { width: 240px; height: 240px; background: ${colors.coral}; top: 40px; right: 4%; animation: aiel-float-b 7s ease-in-out infinite; opacity: 0.22; }
  .aiel-blob-3 { width: 200px; height: 200px; background: ${colors.purple}; top: 260px; left: 6%; animation: aiel-float-c 8s ease-in-out infinite; opacity: 0.2; }
  .aiel-blob-4 { width: 260px; height: 260px; background: #A5F3FC; top: 160px; right: 10%; animation: aiel-float-a 10s ease-in-out infinite; opacity: 0.25; }
  @keyframes aiel-float-a { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10px, -18px) scale(1.06); } }
  @keyframes aiel-float-b { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-14px, 12px) scale(0.94); } }
  @keyframes aiel-float-c { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(8px, 16px); } }

  .aiel-container { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }

  .topic-back-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; margin-bottom: 18px;
    border-radius: 999px; background: rgba(255,255,255,0.72); border: 1px solid ${colors.border};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    color: ${colors.inkSoft}; font-weight: 600; font-size: 13px; text-decoration: none;
    transition: transform 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .topic-back-btn:hover { color: ${colors.gold}; border-color: ${colors.borderActive}; transform: translateX(-2px); }

  .aiel-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; margin-bottom: 28px; }
  .aiel-header-icon {
    width: 60px; height: 60px; border-radius: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 8px 24px rgba(99,102,241,0.18), 0 1px 3px rgba(0,0,0,0.04);
    animation: aiel-bob 3s ease-in-out infinite;
  }
  @keyframes aiel-bob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(-4deg); } }
  .aiel-eyebrow {
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    color: ${colors.goldDeep}; margin: 4px 0 0 0;
  }
  .aiel-h1 {
    font-family: 'Inter', sans-serif; font-weight: 800; margin: 0; line-height: 1.15;
    font-size: 28px; letter-spacing: -0.02em;
    background: linear-gradient(90deg, ${colors.goldDeep} 0%, ${colors.purple} 55%, ${colors.coral} 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .aiel-h1 { font-size: 34px; } }
  .aiel-subtitle { font-size: 15px; color: ${colors.inkSoft}; max-width: 560px; margin: 4px auto 0 auto; line-height: 1.6; }

  /* -------------------- Reaction toast -------------------- */
  .aiel-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    animation: aiel-toast-in 0.35s ease forwards;
  }
  .aiel-toast-up { background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); }
  .aiel-toast-down { background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep}); }
  @keyframes aiel-toast-in {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  .aiel-progress-track {
    width: 100%; height: 12px; border-radius: 999px; background: #FFFFFF;
    border: 1px solid ${colors.border}; overflow: hidden; margin-bottom: 18px; position: relative;
  }
  .aiel-progress-fill {
    height: 100%; border-radius: 999px; position: relative; overflow: hidden;
    background: linear-gradient(90deg, ${colors.gold} 0%, ${colors.coral} 100%);
    transition: width 0.35s ease;
  }
  .aiel-progress-fill::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: aiel-shimmer 2.2s linear infinite;
  }
  @keyframes aiel-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

  .aiel-stampbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px; margin-bottom: 28px; flex-wrap: wrap;
  }
  .aiel-stamp-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 18px; border-radius: 999px; font-weight: 700; font-size: 14px;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; flex: 1; min-width: 130px; justify-content: center;
  }
  .aiel-stamp-btn:hover { transform: translateY(-2px); border-color: ${colors.borderActive}; }
  .aiel-stamp-label {
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    text-align: center; white-space: nowrap;
  }
  @media (max-width: 639px) {
    .aiel-stamp-label { display: none; }
    .aiel-stamp-btn { min-width: 0; padding: 12px; }
  }

  .aiel-stage-shell {
    border-radius: 24px; padding: 20px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  }
  @media (min-width: 640px) { .aiel-stage-shell { padding: 32px; } }
  .aiel-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
  .aiel-stage-tag {
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.tealDeep};
    background: rgba(6,182,212,0.1); padding: 5px 14px; border-radius: 999px;
  }
  .aiel-stage-progress {
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; color: white;
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple});
    padding: 5px 12px; border-radius: 999px;
  }
  .aiel-stage-title {
    font-family: 'Inter', sans-serif; font-weight: 800; color: ${colors.goldDeep};
    font-size: 24px; margin: 10px 0 8px 0; letter-spacing: -0.01em;
  }
  @media (min-width: 640px) { .aiel-stage-title { font-size: 28px; } }
  .aiel-stage-subtitle { font-size: 14px; color: ${colors.inkSoft}; margin: 0 0 20px 0; line-height: 1.55; }

  /* -------------------- Stage hero illustrations, driven by real stage content -------------------- */
  .aiel-hero { display: flex; align-items: center; justify-content: center; margin-bottom: 22px; min-height: 74px; }

  /* Scoreboard (Stage 0: structured vs unstructured tally) */
  .aiel-scoreboard { display: flex; align-items: center; gap: 14px; }
  .aiel-score-crate {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 22px; border-radius: 16px;
    min-width: 96px; transition: transform 0.2s ease;
    background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep});
    box-shadow: 0 8px 20px rgba(6,182,212,0.3);
  }
  .aiel-score-crate-alt {
    background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep});
    box-shadow: 0 8px 20px rgba(244,63,94,0.3);
  }
  .aiel-score-num { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 24px; color: #fff; line-height: 1; }
  .aiel-score-label { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.85); }
  .aiel-score-divider { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 13px; color: ${colors.muted}; }

  /* Spreadsheet hero (Stage 1: CSV) */
  .aiel-sheet { border-radius: 14px; overflow: hidden; border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); width: 100%; max-width: 340px; }
  .aiel-sheet-toolbar {
    display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: ${colors.cardAlt};
    font-size: 11px; font-weight: 700; color: ${colors.goldDeep}; font-family: 'Menlo', 'Consolas', monospace;
    border-bottom: 1px solid ${colors.border};
  }
  .aiel-sheet-grid { display: grid; }
  .aiel-sheet-cell {
    padding: 8px 6px; font-size: 12px; font-family: 'Menlo', 'Consolas', monospace; color: ${colors.ink};
    background: ${colors.card}; border-bottom: 1px solid ${colors.borderSoft}; border-right: 1px solid ${colors.borderSoft};
    text-align: center; transition: background 0.35s ease, color 0.35s ease;
  }
  .aiel-sheet-head { background: ${colors.cardAlt}; font-weight: 700; color: ${colors.inkSoft}; }
  .aiel-sheet-hl { background: rgba(99,102,241,0.08); }
  .aiel-sheet-hl-row { background: rgba(99,102,241,0.08); }
  .aiel-sheet-hl-cell {
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); color: #fff; font-weight: 800;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3);
  }

  /* Pixel inspector (Stage 2: Images) */
  .aiel-pixel-inspector { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .aiel-pixel-grid2 {
    display: grid; grid-template-columns: repeat(2, 46px); grid-template-rows: repeat(2, 46px); gap: 4px;
    border-radius: 10px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  }
  .aiel-pixel-swatch { position: relative; transition: transform 0.25s ease; }
  .aiel-pixel-active { transform: scale(1.1); z-index: 1; box-shadow: 0 0 0 3px #fff, 0 0 0 6px ${colors.gold}; }
  .aiel-pixel-ping { position: absolute; inset: -6px; border-radius: 6px; border: 2px solid ${colors.gold}; animation: aiel-pulse-ring 1.6s ease-out infinite; }
  @keyframes aiel-pulse-ring { 0% { transform: scale(0.85); opacity: 0.6; } 100% { transform: scale(1.3); opacity: 0; } }
  .aiel-pixel-caption { font-size: 12px; color: ${colors.inkSoft}; text-align: center; max-width: 300px; font-weight: 600; line-height: 1.5; }

  /* Waveform hero (Stage 3: Audio) */
  .aiel-wave-hero { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; max-width: 320px; }
  .aiel-wave-caption { font-size: 12px; color: ${colors.inkSoft}; text-align: center; max-width: 300px; font-weight: 600; line-height: 1.5; }
  .aiel-wave-dot { animation: aiel-dot-pop 1.8s ease-in-out infinite; }
  @keyframes aiel-dot-pop { 0%, 100% { r: 3.4; } 50% { r: 4.4; } }

  /* Token pipeline hero (Stage 4: Text) */
  .aiel-pipeline { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .aiel-pipeline-row { display: flex; gap: 8px; align-items: center; justify-content: center; flex-wrap: wrap; }
  .aiel-pipeline-sentence {
    font-family: 'Menlo', 'Consolas', monospace; font-size: 14px; font-weight: 700; color: ${colors.ink};
    background: ${colors.cardAlt}; padding: 8px 14px; border-radius: 10px; border: 1px solid ${colors.border};
  }
  .aiel-pipeline-arrow { font-size: 13px; color: ${colors.muted}; line-height: 1; font-weight: 600; }
  .aiel-token-chip {
    padding: 8px 14px; border-radius: 999px; background: ${colors.cardAlt}; border: 1px solid ${colors.border};
    font-family: 'Menlo', 'Consolas', monospace; font-size: 12px; font-weight: 700; color: ${colors.ink};
    opacity: 0; animation: aiel-token-in 0.5s ease forwards;
  }
  @keyframes aiel-token-in { from { opacity: 0; transform: translateY(6px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .aiel-id-chip {
    padding: 8px 16px; border-radius: 999px; background: linear-gradient(135deg, ${colors.gold}, ${colors.purple});
    font-family: 'Menlo', 'Consolas', monospace; font-size: 12px; font-weight: 800; color: #fff;
    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
    opacity: 0; animation: aiel-token-in 0.5s ease forwards;
  }

  .aiel-item-list { display: flex; flex-direction: column; gap: 14px; }
  .aiel-item-card {
    border-radius: 18px; padding: 20px; background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    opacity: 0; animation: aiel-card-in 0.4s ease forwards;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .aiel-item-card:hover { border-color: ${colors.borderActive}; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  @keyframes aiel-card-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .aiel-item-text { font-size: 14px; color: ${colors.ink}; margin: 0 0 12px 0; font-weight: 500; }

  .aiel-code-block {
    background: ${colors.codeBg}; color: ${colors.codeText}; border-radius: 14px; padding: 14px 16px;
    font-family: 'Menlo', 'Consolas', monospace; font-size: 12.5px; line-height: 1.6;
    white-space: pre; overflow-x: auto; margin: 0 0 12px 0;
  }
  .aiel-item-question { font-size: 13px; color: ${colors.inkSoft}; margin: 0 0 14px 0; font-weight: 600; }

  .aiel-choice-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .aiel-choice-btn {
    flex: 1; font-size: 12.5px; font-weight: 700; padding: 13px 10px; border-radius: 14px; color: black;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15); transition: transform 0.15s ease, box-shadow 0.15s ease;
    min-width: 100px; font-family: 'Menlo', 'Consolas', monospace;
  }
  .aiel-choice-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.2); }
  .aiel-choice-btn:active { transform: translateY(1px); }
  .aiel-choice-teal { background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); }
  .aiel-choice-coral { background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep}); }
  .aiel-choice-gold { background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); }

  .aiel-feedback {
    display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 14px;
    animation: aiel-card-in 0.3s ease forwards;
  }
  .aiel-feedback-text { font-size: 12.5px; color: ${colors.inkSoft}; margin: 0; line-height: 1.55; }
  .aiel-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .aiel-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; gap: 12px; }
  .aiel-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft}; background: ${colors.card}; border: 1px solid ${colors.border};
    transition: transform 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .aiel-nav-back:not([disabled]):hover { color: ${colors.gold}; border-color: ${colors.borderActive}; transform: translateX(-2px); }
  .aiel-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 24px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: #fff;
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .aiel-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .aiel-nav-next:not([disabled]):active { transform: translateY(1px); }
  .aiel-nav-next[disabled], .aiel-nav-back[disabled] { opacity: 0.4; cursor: default; background: ${colors.cardAlt}; color: ${colors.muted}; box-shadow: none; }

  .aiel-cert {
    border-radius: 24px; padding: 32px 20px; text-align: center;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    position: relative; overflow: hidden;
  }
  @media (min-width: 640px) { .aiel-cert { padding: 40px; } }
  .aiel-cert-badge {
    margin: 0 auto 20px auto; width: 76px; height: 76px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #F59E0B, #F97316);
    box-shadow: 0 10px 28px rgba(245,158,11,0.35);
    position: relative; z-index: 1;
    animation: aiel-badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes aiel-badge-pop { 0% { transform: scale(0.4) rotate(-15deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
  .aiel-cert-eyebrow { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.gold}; margin: 0 0 8px 0; position: relative; z-index: 1; }
  .aiel-cert-title { font-family: 'Inter', sans-serif; font-weight: 800; color: ${colors.ink}; font-size: 26px; margin: 0 0 12px 0; position: relative; z-index: 1; }
  .aiel-cert-desc { font-size: 14px; color: ${colors.inkSoft}; margin: 0 0 24px 0; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; position: relative; z-index: 1; }
  .aiel-cert-score {
    display: inline-flex; align-items: center; gap: 12px; border-radius: 20px; padding: 16px 24px; margin-bottom: 32px;
    background: ${colors.card}; border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); position: relative; z-index: 1;
  }
  .aiel-cert-score-num { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 30px; color: ${colors.gold}; }
  .aiel-cert-score-label { font-size: 12px; color: ${colors.muted}; text-align: left; max-width: 140px; }
  .aiel-cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px; text-align: left; position: relative; z-index: 1; }
  @media (min-width: 480px) { .aiel-cert-grid { grid-template-columns: repeat(5, 1fr); } }
  .aiel-cert-item { border-radius: 14px; padding: 12px; background: ${colors.card}; border: 1px solid ${colors.border}; }
  .aiel-cert-item p { font-size: 12px; color: ${colors.ink}; margin: 6px 0 0 0; font-weight: 600; }
  .aiel-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700;
    padding: 14px 24px; border-radius: 14px; background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.inkSoft};
    position: relative; z-index: 1; transition: color 0.2s ease, border-color 0.2s ease;
  }
  .aiel-reset-btn:hover { color: ${colors.gold}; border-color: ${colors.borderActive}; }
`;

/* ---------------------------- TYPES ---------------------------- */

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

type StructureAnswer = "structured" | "unstructured";

interface StructureItem {
  id: string;
  text: string;
  answer: StructureAnswer;
  explain: string;
}

interface QuizItem {
  id: string;
  code?: string;
  question: string;
  options: string[];
  answer: string;
  explain: string;
  // Optional metadata used by content-linked hero illustrations:
  highlightRow?: number;
  highlightCol?: string;
  highlightHeader?: boolean;
  highlightAllRows?: boolean;
  highlightPixel?: number;
}

type StructureAnswerMap = Record<string, StructureAnswer>;
type AnswerMap = Record<string, string>;

/* ---------------------------- CONTENT DATA ---------------------------- */

const STAGE_META: StageMetaItem[] = [
  { key: "what-is-data", title: "What is Data?", icon: Database, tag: "Stage 1 - Structured or Not?" },
  { key: "csv", title: "CSV", icon: Table2, tag: "Stage 2 - Read the CSV" },
  { key: "images", title: "Images", icon: ImageIcon, tag: "Stage 3 - Pixel Detective" },
  { key: "audio", title: "Audio", icon: Music, tag: "Stage 4 - Sound to Numbers" },
  { key: "text", title: "Text", icon: FileText, tag: "Stage 5 - Tokenize This" },
];

const STRUCTURE_ITEMS: StructureItem[] = [
  { id: "s1", text: "A spreadsheet of student names, ages, and grades arranged in neat rows and columns.", answer: "structured", explain: "Neatly organised into consistent rows and columns is the defining trait of structured data." },
  { id: "s2", text: "A voice memo recorded on your phone.", answer: "unstructured", explain: "Free-form audio has no rows or columns -- it's a classic example of unstructured data." },
  { id: "s3", text: "A database table storing every order a store has ever made.", answer: "structured", explain: "Each order fits a consistent set of fields -- order ID, date, amount -- exactly like structured data should." },
  { id: "s4", text: "A photo of a sunset saved on your phone.", answer: "unstructured", explain: "An image is just a grid of pixel values with no built-in rows-and-columns meaning -- unstructured data." },
  { id: "s5", text: "A CSV file listing the daily temperature for every day of the year.", answer: "structured", explain: "One row per day, the same columns every time -- a textbook structured dataset." },
  { id: "s6", text: "A paragraph of text from a news article.", answer: "unstructured", explain: "Free-flowing sentences don't fit into fixed fields, which is exactly what makes text unstructured." },
];

const CSV_TABLE = "name,age,city\nRiya,15,Pune\nAman,16,Delhi\nZara,15,Mumbai";

const CSV_ITEMS: QuizItem[] = [
  { id: "c1", code: CSV_TABLE, question: "What is Aman's city?", options: ["Delhi", "Pune", "Mumbai"], answer: "Delhi", explain: "Reading across Aman's row, the city column holds 'Delhi'.", highlightRow: 1, highlightCol: "city" },
  { id: "c2", code: CSV_TABLE, question: "How many columns does this CSV have?", options: ["3", "2", "4"], answer: "3", explain: "The header row lists exactly three column names: name, age, and city.", highlightHeader: true },
  { id: "c3", code: CSV_TABLE, question: "How many rows of data are there, not counting the header?", options: ["3", "4", "2"], answer: "3", explain: "There are three people listed -- Riya, Aman, and Zara -- below the header row.", highlightAllRows: true },
  { id: "c4", code: CSV_TABLE, question: "What character separates each value in a row?", options: ["A comma", "A tab", "A colon"], answer: "A comma", explain: "CSV stands for Comma-Separated Values -- the comma is what marks where one value ends and the next begins." },
  { id: "c5", code: CSV_TABLE, question: "What is Zara's age?", options: ["15", "16", "14"], answer: "15", explain: "Reading across Zara's row, the age column holds 15.", highlightRow: 2, highlightCol: "age" },
];

const PIXEL_GRID = "[(255, 0, 0),   (0, 255, 0)]\n[(0, 0, 255),   (255, 255, 255)]";

const IMAGE_ITEMS: QuizItem[] = [
  { id: "i1", code: PIXEL_GRID, question: "What color is the pixel at the top-left (row 0, column 0)?", options: ["Red", "Green", "Blue"], answer: "Red", explain: "(255, 0, 0) means full red intensity with no green or blue at all -- pure red.", highlightPixel: 0 },
  { id: "i2", code: PIXEL_GRID, question: "How many numbers does each pixel store here?", options: ["3", "1", "2"], answer: "3", explain: "Each pixel stores three numbers -- red, green, and blue intensity -- to represent its exact color." },
  { id: "i3", code: PIXEL_GRID, question: "What color is the pixel at the bottom-right?", options: ["White", "Black", "Blue"], answer: "White", explain: "(255, 255, 255) means all three color channels are at full intensity, which produces white.", highlightPixel: 3 },
  { id: "i4", code: "Before: 100 x 100 pixels\nAfter:  200 x 200 pixels", question: "The photo's width and height both double. What happens to the total amount of pixel data?", options: ["It roughly quadruples", "It stays the same", "It roughly doubles"], answer: "It roughly quadruples", explain: "Doubling both width and height multiplies the total pixel count by four (2 x 2), not two." },
  { id: "i5", code: "Photo A: 4000 x 3000, color (3 numbers per pixel)\nPhoto B: 200 x 150, grayscale (1 number per pixel)", question: "Which photo needs far more stored numbers overall?", options: ["Photo A", "Photo B", "They're the same"], answer: "Photo A", explain: "Photo A has vastly more pixels and stores three numbers per pixel instead of one, so its total data is enormously larger." },
];

const AUDIO_ITEMS: QuizItem[] = [
  { id: "a1", code: "Sample rate: 44,100 samples/second\nClip length: 2 seconds", question: "About how many numbers are stored for this clip?", options: ["88,200", "44,100", "2"], answer: "88,200", explain: "Samples per second multiplied by the number of seconds gives the total: 44,100 x 2 = 88,200." },
  { id: "a2", code: "Sample rate A: 8,000 samples/second\nSample rate B: 48,000 samples/second", question: "Which sample rate captures the original sound wave more precisely?", options: ["Sample rate B", "Sample rate A", "Both are identical"], answer: "Sample rate B", explain: "A higher sample rate measures the sound wave more often per second, capturing much finer detail." },
  { id: "a3", code: "A 10-second voice memo\nSample rate: 16,000 samples/second", question: "Roughly how many numbers make up this memo?", options: ["160,000", "16,000", "10"], answer: "160,000", explain: "16,000 samples every second for 10 seconds gives 16,000 x 10 = 160,000 numbers total." },
  { id: "a4", code: "Recording A: sampled 44,100 times/second\nRecording B: sampled 4,410 times/second", question: "Which recording is more likely to sound choppy or lose detail?", options: ["Recording B", "Recording A", "Neither -- they sound the same"], answer: "Recording B", explain: "Sampling far less often means more of the original wave's detail gets lost between each measurement." },
  { id: "a5", code: "A microphone captures a continuous sound wave.", question: "What is the process of measuring that wave thousands of times per second called?", options: ["Sampling", "Rendering", "Compiling"], answer: "Sampling", explain: "Sampling is exactly this repeated measurement process that turns a continuous wave into a list of numbers." },
];

const TEXT_ITEMS: QuizItem[] = [
  { id: "t1", code: 'Sentence: "I love AI"', question: "How would this typically be split into tokens?", options: ["'I', 'love', 'AI'", "'I love', 'AI'", "'I', 'loveAI'"], answer: "'I', 'love', 'AI'", explain: "Tokenizing usually breaks text into individual words, giving three separate tokens here." },
  { id: "t2", code: 'Sentence: "Cats run fast"', question: "How many tokens would a simple word-based split produce?", options: ["3", "1", "6"], answer: "3", explain: "Three separate words means three tokens under a simple word-based split." },
  { id: "t3", code: "Token IDs: {'I': 1, 'love': 2, 'AI': 3}\nSentence: \"I love AI\"", question: "What numeric sequence would this sentence become?", options: ["[1, 2, 3]", "[3, 2, 1]", "[1, 1, 1]"], answer: "[1, 2, 3]", explain: "Each word is replaced by its assigned ID, kept in the same order the words appear." },
  { id: "t4", question: "Why do computers need text converted into numbers before a model can be trained on it?", options: ["Models only compute with numbers, not raw letters", "Numbers always take up less storage", "It makes the text easier for humans to read"], answer: "Models only compute with numbers, not raw letters", explain: "Every calculation inside a model is numeric, so text has to become numbers before any learning can happen." },
  { id: "t5", code: 'Sentence: "unbelievable"', question: "Why might a tokenizer split this into smaller pieces like 'un', 'believ', 'able' instead of one token?", options: ["To handle rare or unfamiliar words using familiar smaller pieces", "Because long words are against the rules", "To make the sentence longer on purpose"], answer: "To handle rare or unfamiliar words using familiar smaller pieces", explain: "Breaking rare words into familiar sub-pieces lets a model handle words it has never seen as one whole unit before." },
];

const POSITIVE_PHRASES = ["Nice! 🎉", "You got it!", "Sharp eye! ✨", "Exactly right!", "Great instinct!"];
const GENTLE_PHRASES = ["Good try! 🤔", "Almost there!", "Nice guess -- see why below", "Close one!"];

const PIXELS = [
  { hex: "#FF3B3B", rgb: "(255, 0, 0)", label: "Red" },
  { hex: "#3ECF6E", rgb: "(0, 255, 0)", label: "Green" },
  { hex: "#3B82F6", rgb: "(0, 0, 255)", label: "Blue" },
  { hex: "#FFFFFF", rgb: "(255, 255, 255)", label: "White" },
];

const TOKEN_WORDS = ["I", "love", "AI"];
const TOKEN_IDS = [1, 2, 3];

/* ------------------------------- HELPERS ------------------------------- */

interface StampBarProps {
  current: number;
  completed: boolean[];
  onJump: (idx: number) => void;
}

function StampBar({ current, completed, onJump }: StampBarProps) {
  const doneCount = completed.filter(Boolean).length;
  const pct = (doneCount / STAGE_META.length) * 100;
  return (
    <div>
      <div className="aiel-progress-track">
        <div className="aiel-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="aiel-stampbar">
        {STAGE_META.map((s, i) => {
          const Icon = s.icon;
          const isDone = completed[i];
          const isCurrent = current === i;
          const bg =
            isDone || isCurrent
              ? `linear-gradient(135deg, ${colors.gold}, ${colors.purple})`
              : colors.card;
          return (
            <button
              key={s.key}
              className="aiel-stamp-btn"
              onClick={() => onJump(i)}
              style={{
                background: bg,
                border: `1px solid ${isDone || isCurrent ? "transparent" : colors.border}`,
                boxShadow: isDone || isCurrent ? `0 4px 15px rgba(99,102,241,0.3)` : "none",
              }}
            >
              {isDone ? (
                <CheckCircle2 size={18} color="#fff" strokeWidth={2.5} />
              ) : (
                <Icon size={16} color={isCurrent ? "#fff" : colors.muted} />
              )}
              <span className="aiel-stamp-label" style={{ color: isDone || isCurrent ? "#fff" : colors.muted }}>
                {s.title}
              </span>
            </button>
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
    <div className="aiel-stage-shell">
      <div className="aiel-stage-top">
        <span className="aiel-stage-tag">{tag}</span>
        {progressLabel && <span className="aiel-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="aiel-stage-title">{title}</h2>
      {subtitle && <p className="aiel-stage-subtitle">{subtitle}</p>}
      {hero && <div className="aiel-hero">{hero}</div>}
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
    <div className="aiel-nav-row">
      <button className="aiel-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <button className="aiel-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* -------- Stage hero illustrations, each one driven by real stage content -------- */

function SortScoreboard({ answers }: { answers: StructureAnswerMap }) {
  const values = Object.values(answers);
  const structuredCount = values.filter((a) => a === "structured").length;
  const unstructuredCount = values.filter((a) => a === "unstructured").length;
  return (
    <div className="aiel-scoreboard">
      <div className="aiel-score-crate" style={{ transform: structuredCount ? "translateY(-3px)" : undefined }}>
        <Table2 size={22} color="#fff" />
        <span className="aiel-score-num">{structuredCount}</span>
        <span className="aiel-score-label">Structured</span>
      </div>
      <div className="aiel-score-divider">VS</div>
      <div className="aiel-score-crate aiel-score-crate-alt" style={{ transform: unstructuredCount ? "translateY(-3px)" : undefined }}>
        <Cloud size={22} color="#fff" />
        <span className="aiel-score-num">{unstructuredCount}</span>
        <span className="aiel-score-label">Unstructured</span>
      </div>
    </div>
  );
}

function SpreadsheetHero({ activeItem }: { activeItem: QuizItem | null }) {
  const rows = CSV_TABLE.split("\n").map((r) => r.split(","));
  const [header, ...data] = rows;
  const hlCol = activeItem?.highlightCol ? header.indexOf(activeItem.highlightCol) : -1;
  const hlRow = activeItem?.highlightRow;
  const hlAllRows = !!activeItem?.highlightAllRows;
  const hlHeader = !!activeItem?.highlightHeader;

  return (
    <div className="aiel-sheet">
      <div className="aiel-sheet-toolbar">
        <Table2 size={14} color={colors.goldDeep} />
        <span>data.csv</span>
      </div>
      <div className="aiel-sheet-grid" style={{ gridTemplateColumns: `repeat(${header.length}, 1fr)` }}>
        {header.map((h, ci) => (
          <div
            key={`h-${ci}`}
            className={`aiel-sheet-cell aiel-sheet-head ${ci === hlCol || hlHeader ? "aiel-sheet-hl" : ""}`}
          >
            {h}
          </div>
        ))}
        {data.map((row, ri) =>
          row.map((cell, ci) => {
            const rowHit = ri === hlRow || hlAllRows;
            const colHit = ci === hlCol;
            const cellClass =
              rowHit && colHit ? "aiel-sheet-hl-cell" : rowHit ? "aiel-sheet-hl-row" : colHit ? "aiel-sheet-hl" : "";
            return (
              <div key={`${ri}-${ci}`} className={`aiel-sheet-cell ${cellClass}`}>
                {cell}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function PixelInspector({ activeIndex }: { activeIndex?: number }) {
  const active = typeof activeIndex === "number" ? PIXELS[activeIndex] : null;
  return (
    <div className="aiel-pixel-inspector">
      <div className="aiel-pixel-grid2">
        {PIXELS.map((p, i) => (
          <div
            key={i}
            className={`aiel-pixel-swatch ${activeIndex === i ? "aiel-pixel-active" : ""}`}
            style={{ background: p.hex, border: p.hex === "#FFFFFF" ? `1px solid ${colors.borderSoft}` : "none" }}
          >
            {activeIndex === i && <span className="aiel-pixel-ping" />}
          </div>
        ))}
      </div>
      <p className="aiel-pixel-caption">
        {active
          ? `${active.label} pixel → stored as RGB ${active.rgb}`
          : "Every square is one pixel, stored as three numbers: red, green, and blue intensity."}
      </p>
    </div>
  );
}

function WaveformHero() {
  const points = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const x = i * (280 / 59);
        const y = 40 + Math.sin(i / 4) * 20 + Math.sin(i / 9) * 8;
        return { x, y };
      }),
    []
  );
  const path = "M" + points.map((p) => `${p.x},${p.y}`).join(" L");
  const sampleDots = useMemo(
    () => Array.from({ length: 14 }, (_, i) => points[Math.round(i * (59 / 13))]),
    [points]
  );

  return (
    <div className="aiel-wave-hero">
      <svg viewBox="0 0 280 80" width="100%" height="80" preserveAspectRatio="none">
        <path d={path} fill="none" stroke={colors.tealDeep} strokeWidth="2.5" />
        {sampleDots.map((d, i) => (
          <g key={i}>
            <line x1={d.x} y1={d.y} x2={d.x} y2={80} stroke={colors.teal} strokeWidth="1" opacity="0.35" />
            <circle className="aiel-wave-dot" cx={d.x} cy={d.y} r={3.5} fill={colors.coral} style={{ animationDelay: `${i * 0.08}s` }} />
          </g>
        ))}
      </svg>
      <p className="aiel-wave-caption">Sampling measures the wave at each dot, turning sound into a list of numbers.</p>
    </div>
  );
}

function TokenPipelineHero() {
  return (
    <div className="aiel-pipeline">
      <div className="aiel-pipeline-row">
        <span className="aiel-pipeline-sentence">&quot;I love AI&quot;</span>
      </div>
      <span className="aiel-pipeline-arrow">↓ tokenize</span>
      <div className="aiel-pipeline-row">
        {TOKEN_WORDS.map((w, i) => (
          <span key={w} className="aiel-token-chip" style={{ animationDelay: `${i * 0.15}s` }}>
            {w}
          </span>
        ))}
      </div>
      <span className="aiel-pipeline-arrow">↓ convert to IDs</span>
      <div className="aiel-pipeline-row">
        {TOKEN_IDS.map((id, i) => (
          <span key={id} className="aiel-id-chip" style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
            {id}
          </span>
        ))}
      </div>
    </div>
  );
}

interface StructureListProps {
  items: StructureItem[];
  answers: StructureAnswerMap;
  onAnswer: (id: string, value: StructureAnswer) => void;
  onFeedback: (correct: boolean) => void;
}

function StructureList({ items, answers, onAnswer, onFeedback }: StructureListProps) {
  return (
    <div className="aiel-item-list">
      {items.map((item, i) => {
        const chosen = answers[item.id];
        const isCorrect = chosen === item.answer;
        return (
          <div key={item.id} className="aiel-item-card" style={{ animationDelay: `${i * 0.06}s` }}>
            <p className="aiel-item-text">{item.text}</p>
            {!chosen ? (
              <div className="aiel-choice-row">
                <button
                  className="aiel-choice-btn aiel-choice-teal"
                  onClick={() => {
                    onAnswer(item.id, "structured");
                    onFeedback("structured" === item.answer);
                  }}
                >
                  Structured
                </button>
                <button
                  className="aiel-choice-btn aiel-choice-coral"
                  onClick={() => {
                    onAnswer(item.id, "unstructured");
                    onFeedback("unstructured" === item.answer);
                  }}
                >
                  Unstructured
                </button>
              </div>
            ) : (
              <div
                className="aiel-feedback"
                style={{ background: isCorrect ? "rgba(6,182,212,0.08)" : "rgba(244,63,94,0.08)" }}
              >
                {isCorrect ? (
                  <CheckCircle2 size={16} color={colors.tealDeep} className="aiel-feedback-icon" />
                ) : (
                  <XCircle size={16} color={colors.coral} className="aiel-feedback-icon" />
                )}
                <p className="aiel-feedback-text">
                  {isCorrect ? "Correct -- " : `Actually, this is ${item.answer}. `}
                  {item.explain}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface QuizListProps {
  items: QuizItem[];
  answers: AnswerMap;
  onAnswer: (id: string, value: string) => void;
  onFeedback: (correct: boolean) => void;
}

function QuizList({ items, answers, onAnswer, onFeedback }: QuizListProps) {
  const palette = ["aiel-choice-teal", "aiel-choice-coral", "aiel-choice-gold"];
  return (
    <div className="aiel-item-list">
      {items.map((item, idx) => {
        const chosen = answers[item.id];
        const isCorrect = chosen === item.answer;
        return (
          <div key={item.id} className="aiel-item-card" style={{ animationDelay: `${idx * 0.06}s` }}>
            {item.code && <pre className="aiel-code-block">{item.code}</pre>}
            <p className="aiel-item-question">{item.question}</p>
            {!chosen ? (
              <div className="aiel-choice-row">
                {item.options.map((opt, i) => (
                  <button
                    key={opt}
                    className={`aiel-choice-btn ${palette[i % palette.length]}`}
                    onClick={() => {
                      onAnswer(item.id, opt);
                      onFeedback(opt === item.answer);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="aiel-feedback"
                style={{ background: isCorrect ? "rgba(6,182,212,0.08)" : "rgba(244,63,94,0.08)" }}
              >
                {isCorrect ? (
                  <CheckCircle2 size={16} color={colors.tealDeep} className="aiel-feedback-icon" />
                ) : (
                  <XCircle size={16} color={colors.coral} className="aiel-feedback-icon" />
                )}
                <p className="aiel-feedback-text">
                  {isCorrect ? "Correct -- " : `Actually, the answer is "${item.answer}". `}
                  {item.explain}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- MAIN APP ------------------------------- */

export default function DataLab() {
  const [current, setCurrent] = useState<number>(0); // 0..4 stages, 5 = certificate
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);

  const [structureAnswers, setStructureAnswers] = useState<StructureAnswerMap>({});
  const [csvAnswers, setCsvAnswers] = useState<AnswerMap>({});
  const [imageAnswers, setImageAnswers] = useState<AnswerMap>({});
  const [audioAnswers, setAudioAnswers] = useState<AnswerMap>({});
  const [textAnswers, setTextAnswers] = useState<AnswerMap>({});

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

  const structureDone = Object.keys(structureAnswers).length === STRUCTURE_ITEMS.length;
  const csvDone = Object.keys(csvAnswers).length === CSV_ITEMS.length;
  const imageDone = Object.keys(imageAnswers).length === IMAGE_ITEMS.length;
  const audioDone = Object.keys(audioAnswers).length === AUDIO_ITEMS.length;
  const textDone = Object.keys(textAnswers).length === TEXT_ITEMS.length;

  const activeCsvItem = useMemo(() => CSV_ITEMS.find((it) => !csvAnswers[it.id]) || null, [csvAnswers]);
  const activeImageItem = useMemo(() => IMAGE_ITEMS.find((it) => !imageAnswers[it.id]) || null, [imageAnswers]);

  const scores = useMemo(() => {
    const structureCorrect = STRUCTURE_ITEMS.filter((it) => structureAnswers[it.id] === it.answer).length;
    const csvCorrect = CSV_ITEMS.filter((it) => csvAnswers[it.id] === it.answer).length;
    const imageCorrect = IMAGE_ITEMS.filter((it) => imageAnswers[it.id] === it.answer).length;
    const audioCorrect = AUDIO_ITEMS.filter((it) => audioAnswers[it.id] === it.answer).length;
    const textCorrect = TEXT_ITEMS.filter((it) => textAnswers[it.id] === it.answer).length;
    return { structureCorrect, csvCorrect, imageCorrect, audioCorrect, textCorrect };
  }, [structureAnswers, csvAnswers, imageAnswers, audioAnswers, textAnswers]);

  const totalScore =
    scores.structureCorrect + scores.csvCorrect + scores.imageCorrect + scores.audioCorrect + scores.textCorrect;
  const totalPossible =
    STRUCTURE_ITEMS.length + CSV_ITEMS.length + IMAGE_ITEMS.length + AUDIO_ITEMS.length + TEXT_ITEMS.length;

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false, false]);
    setStructureAnswers({});
    setCsvAnswers({});
    setImageAnswers({});
    setAudioAnswers({});
    setTextAnswers({});
    setToast(null);
  };

  return (
    <div className="aiel-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ${STYLES}
      `}</style>

      <div className="aiel-blob aiel-blob-1" />
      <div className="aiel-blob aiel-blob-2" />
      <div className="aiel-blob aiel-blob-3" />
      <div className="aiel-blob aiel-blob-4" />

      {toast && (
        <div className={`aiel-toast ${toast.mood === "up" ? "aiel-toast-up" : "aiel-toast-down"}`}>
          {toast.mood === "up" ? <Sparkles size={15} /> : <Database size={15} />}
          {toast.text}
        </div>
      )}

      <div className="aiel-container">
        <Link href="/" className="topic-back-btn">
          <ChevronLeft size={18} />
          Back to Curriculum
        </Link>

        <div className="aiel-header">
          <div className="aiel-header-icon">
            <Compass size={26} color={colors.gold} />
          </div>
          <h1 className="aiel-h1">Data Lab</h1>
          <p className="aiel-subtitle">
            Sort structured from unstructured data, read a real CSV table, decode pixels, turn sound
            into numbers, and see how text gets tokenized -- the raw material behind every AI system.
          </p>
        </div>

        {current <= 4 && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: What is Data? */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Structured or Unstructured?"
            subtitle="Read each example and decide which kind of data it is. Watch the tally fill up as you sort."
            progressLabel={`${Object.keys(structureAnswers).length}/${STRUCTURE_ITEMS.length} sorted`}
            hero={<SortScoreboard answers={structureAnswers} />}
          >
            <StructureList
              items={STRUCTURE_ITEMS}
              answers={structureAnswers}
              onAnswer={(id, value) => setStructureAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              backDisabled
              onBack={() => {}}
              nextDisabled={!structureDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: CSV */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Read the CSV"
            subtitle="Here's a real CSV table. The highlighted cell shows exactly what the current question is asking about."
            progressLabel={`${Object.keys(csvAnswers).length}/${CSV_ITEMS.length} solved`}
            hero={<SpreadsheetHero activeItem={activeCsvItem} />}
          >
            <QuizList
              items={CSV_ITEMS}
              answers={csvAnswers}
              onAnswer={(id, value) => setCsvAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!csvDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: Images */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Pixel Detective"
            subtitle="Every image is really just a grid of numbers. The glowing pixel matches the current question."
            progressLabel={`${Object.keys(imageAnswers).length}/${IMAGE_ITEMS.length} solved`}
            hero={<PixelInspector activeIndex={activeImageItem?.highlightPixel} />}
          >
            <QuizList
              items={IMAGE_ITEMS}
              answers={imageAnswers}
              onAnswer={(id, value) => setImageAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!imageDone}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: Audio */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Sound to Numbers"
            subtitle="Sound becomes data through sampling. Work out what each sample rate actually means."
            progressLabel={`${Object.keys(audioAnswers).length}/${AUDIO_ITEMS.length} solved`}
            hero={<WaveformHero />}
          >
            <QuizList
              items={AUDIO_ITEMS}
              answers={audioAnswers}
              onAnswer={(id, value) => setAudioAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!audioDone}
              onNext={() => {
                markComplete(3);
                setCurrent(4);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 4: Text */}
        {current === 4 && (
          <StageShell
            tag={STAGE_META[4].tag}
            title="Tokenize This"
            subtitle="Before a model can read text, it has to be broken into tokens and turned into numbers."
            progressLabel={`${Object.keys(textAnswers).length}/${TEXT_ITEMS.length} solved`}
            hero={<TokenPipelineHero />}
          >
            <QuizList
              items={TEXT_ITEMS}
              answers={textAnswers}
              onAnswer={(id, value) => setTextAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(3)}
              nextDisabled={!textDone}
              nextLabel="Finish Lab"
              onNext={() => {
                markComplete(4);
                setCurrent(5);
              }}
            />
          </StageShell>
        )}

        {/* CERTIFICATE */}
        {current === 5 && (
          <div className="aiel-cert">
            <div className="aiel-cert-badge">
              <Award size={36} color="#fff" />
            </div>
            <p className="aiel-cert-eyebrow">Certificate of Completion</p>
            <h2 className="aiel-cert-title">You've completed Module 2</h2>
            <p className="aiel-cert-desc">
              You sorted structured from unstructured data, read a real CSV table, decoded pixels,
              turned sound into numbers, and tokenized text -- the raw material behind every AI system.
            </p>

            <div className="aiel-cert-score">
              <span className="aiel-cert-score-num">{totalScore}/{totalPossible}</span>
              <span className="aiel-cert-score-label">correct across all five stages</span>
            </div>

            <div className="aiel-cert-grid">
              {STAGE_META.map((s) => (
                <div key={s.key} className="aiel-cert-item">
                  <CheckCircle2 size={14} color={colors.tealDeep} />
                  <p>{s.title}</p>
                </div>
              ))}
            </div>

            <button className="aiel-reset-btn" onClick={resetAll}>
              <RotateCcw size={14} /> Restart the Lab
            </button>
          </div>
        )}
      </div>
    </div>
  );
}