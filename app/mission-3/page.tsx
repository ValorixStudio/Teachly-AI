"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  FolderTree,
  Server,
  Database,
  BrainCircuit,
  Workflow,
  Rocket,
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
  Circle,
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
  coral: "#F43F5E",
  coralDeep: "#E11D48",
  purple: "#8B5CF6",
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
  .acc-root {
    min-height: 100vh;
    width: 100%;
    padding: 32px 16px;
    background: radial-gradient(circle at 20% -10%, ${colors.bgSoft} 0%, ${colors.bg} 55%);
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    box-sizing: border-box;
    position: relative;
    overflow-x: hidden;
  }
  .acc-root *, .acc-root *::before, .acc-root *::after { box-sizing: border-box; }
  .acc-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .acc-root button:focus-visible { outline: 3px solid ${colors.purple}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .acc-root * { transition: none !important; animation: none !important; }
  }

  /* -------------------- Decorative floating blobs -------------------- */
  .acc-blob { position: absolute; border-radius: 999px; filter: blur(70px); opacity: 0.3; pointer-events: none; z-index: 0; }
  .acc-blob-1 { width: 320px; height: 320px; background: #A5B4FC; top: -60px; left: 2%; animation: acc-float-a 9s ease-in-out infinite; }
  .acc-blob-2 { width: 240px; height: 240px; background: ${colors.coral}; top: 40px; right: 4%; animation: acc-float-b 7s ease-in-out infinite; opacity: 0.22; }
  .acc-blob-3 { width: 200px; height: 200px; background: ${colors.purple}; top: 260px; left: 6%; animation: acc-float-c 8s ease-in-out infinite; opacity: 0.2; }
  .acc-blob-4 { width: 260px; height: 260px; background: #A5F3FC; top: 160px; right: 10%; animation: acc-float-a 10s ease-in-out infinite; opacity: 0.25; }
  @keyframes acc-float-a { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10px, -18px) scale(1.06); } }
  @keyframes acc-float-b { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-14px, 12px) scale(0.94); } }
  @keyframes acc-float-c { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(8px, 16px); } }

  .acc-container { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

  .acc-back-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; margin-bottom: 18px;
    border-radius: 999px; background: rgba(255,255,255,0.72); border: 1px solid ${colors.border};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    color: ${colors.inkSoft}; font-weight: 600; font-size: 13px; text-decoration: none;
    transition: transform 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .acc-back-btn:hover { color: ${colors.gold}; border-color: ${colors.borderActive}; transform: translateX(-2px); }

  .acc-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; margin-bottom: 28px; }
  .acc-header-icon {
    width: 60px; height: 60px; border-radius: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 8px 24px rgba(99,102,241,0.18), 0 1px 3px rgba(0,0,0,0.04);
    animation: acc-bob 3s ease-in-out infinite;
  }
  @keyframes acc-bob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(-4deg); } }
  .acc-eyebrow {
    font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    color: ${colors.goldDeep}; margin: 4px 0 0 0;
  }
  .acc-h1 {
    font-weight: 800; margin: 0; line-height: 1.15; font-size: 28px; letter-spacing: -0.02em;
    background: linear-gradient(90deg, ${colors.goldDeep} 0%, ${colors.purple} 55%, ${colors.coral} 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .acc-h1 { font-size: 34px; } }
  .acc-subtitle { font-size: 15px; color: ${colors.inkSoft}; max-width: 580px; margin: 4px auto 0 auto; line-height: 1.6; }

  /* -------------------- Reaction toast -------------------- */
  .acc-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep});
    animation: acc-toast-in 0.35s ease forwards;
  }
  @keyframes acc-toast-in {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  .acc-progress-track {
    width: 100%; height: 12px; border-radius: 999px; background: #FFFFFF;
    border: 1px solid ${colors.border}; overflow: hidden; margin-bottom: 18px; position: relative;
  }
  .acc-progress-fill {
    height: 100%; border-radius: 999px; position: relative; overflow: hidden;
    background: linear-gradient(90deg, ${colors.gold} 0%, ${colors.coral} 100%);
    transition: width 0.35s ease;
  }
  .acc-progress-fill::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: acc-shimmer 2.2s linear infinite;
  }
  @keyframes acc-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

  .acc-stampbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .acc-stamp-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 14px; border-radius: 999px; font-weight: 700; font-size: 14px;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; flex: 1; min-width: 110px; justify-content: center;
  }
  .acc-stamp-btn:hover { transform: translateY(-2px); border-color: ${colors.borderActive}; }
  .acc-stamp-label { font-size: 12.5px; font-weight: 700; text-align: center; white-space: nowrap; }
  @media (max-width: 700px) {
    .acc-stamp-label { display: none; }
    .acc-stamp-btn { min-width: 0; padding: 12px; }
  }

  .acc-stage-shell {
    border-radius: 24px; padding: 20px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  }
  @media (min-width: 640px) { .acc-stage-shell { padding: 32px; } }
  .acc-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
  .acc-stage-tag {
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.tealDeep};
    background: rgba(6,182,212,0.1); padding: 5px 14px; border-radius: 999px;
  }
  .acc-stage-progress {
    font-size: 12px; font-weight: 700; color: white;
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple});
    padding: 5px 12px; border-radius: 999px;
  }
  .acc-stage-title { font-weight: 800; color: ${colors.goldDeep}; font-size: 24px; margin: 10px 0 8px 0; letter-spacing: -0.01em; }
  @media (min-width: 640px) { .acc-stage-title { font-size: 28px; } }
  .acc-stage-subtitle { font-size: 14px; color: ${colors.inkSoft}; margin: 0 0 20px 0; line-height: 1.55; }

  .acc-hero { display: flex; align-items: center; justify-content: center; margin-bottom: 22px; min-height: 74px; }

  /* Terminal hero (Phase 1) */
  .acc-term { width: 100%; max-width: 340px; border-radius: 14px; overflow: hidden; border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .acc-term-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: ${colors.cardAlt}; border-bottom: 1px solid ${colors.border}; }
  .acc-term-dots { display: flex; gap: 4px; }
  .acc-term-dot { width: 7px; height: 7px; border-radius: 999px; background: ${colors.borderSoft}; }
  .acc-term-label { flex: 1; font-size: 11px; font-weight: 700; color: ${colors.inkSoft}; font-family: 'Menlo','Consolas',monospace; text-align: center; }
  .acc-term-body { padding: 14px 16px; background: ${colors.codeBg}; }
  .acc-term-line { font-family: 'Menlo','Consolas',monospace; font-size: 12px; color: ${colors.codeText}; line-height: 1.8; }
  .acc-term-line span { color: ${colors.teal}; }

  /* Boxes hero (Backend <-> Frontend) */
  .acc-boxes { display: flex; align-items: center; gap: 14px; }
  .acc-box {
    display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 20px; border-radius: 16px; min-width: 100px;
    background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); box-shadow: 0 8px 20px rgba(6,182,212,0.3);
  }
  .acc-box-alt { background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); box-shadow: 0 8px 20px rgba(99,102,241,0.3); }
  .acc-box-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.9); }
  .acc-box-arrow { font-weight: 800; font-size: 15px; color: ${colors.muted}; }

  /* Model scoreboard hero */
  .acc-scoreboard { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .acc-score-crate {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 16px; border-radius: 14px; min-width: 76px;
    background: ${colors.card}; border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .acc-score-label { font-size: 10.5px; font-weight: 700; color: ${colors.inkSoft}; text-align: center; }

  /* Bubble hero (AI agent) */
  .acc-bubbles { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 320px; }
  .acc-bubble-row { display: flex; }
  .acc-bubble-row.acc-from-user { justify-content: flex-end; }
  .acc-bubble {
    max-width: 80%; padding: 9px 13px; border-radius: 14px; font-size: 12px; font-weight: 600; line-height: 1.5;
    opacity: 0; animation: acc-bubble-in 0.4s ease forwards;
  }
  @keyframes acc-bubble-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .acc-bubble-user { background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); color: #fff; border-bottom-right-radius: 4px; }
  .acc-bubble-ai { background: ${colors.cardAlt}; color: ${colors.ink}; border: 1px solid ${colors.border}; border-bottom-left-radius: 4px; }

  /* Workflow hero */
  .acc-flow { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .acc-flow-node {
    font-size: 11.5px; font-weight: 700; color: ${colors.ink}; background: ${colors.card};
    border: 1px solid ${colors.border}; border-radius: 999px; padding: 6px 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }
  .acc-flow-arrow { color: ${colors.muted}; font-size: 13px; line-height: 1; }

  /* Rocket hero */
  .acc-rocket-wrap { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .acc-rocket-badge {
    width: 64px; height: 64px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep}); box-shadow: 0 10px 24px rgba(244,63,94,0.3);
    animation: acc-rocket-float 2.4s ease-in-out infinite;
  }
  @keyframes acc-rocket-float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(6deg); } }

  .acc-item-list { display: flex; flex-direction: column; gap: 14px; }
  .acc-item-card {
    border-radius: 18px; padding: 16px 18px; background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: border-color 0.2s ease, box-shadow 0.2s ease;
    display: flex; align-items: flex-start; gap: 12px; cursor: pointer;
  }
  .acc-item-card:hover { border-color: ${colors.borderActive}; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .acc-item-card.acc-item-done { border-color: rgba(6,182,212,0.35); background: rgba(6,182,212,0.05); }
  .acc-item-check { flex-shrink: 0; margin-top: 2px; }
  .acc-item-body { flex: 1; min-width: 0; }
  .acc-item-num { font-size: 11px; font-weight: 800; letter-spacing: 0.04em; color: ${colors.goldDeep}; text-transform: uppercase; }
  .acc-item-title { font-size: 15px; font-weight: 700; color: ${colors.ink}; margin: 3px 0 8px 0; }
  .acc-item-explain { font-size: 13.5px; color: ${colors.inkSoft}; line-height: 1.65; margin: 0 0 10px 0; }
  .acc-item-explain:last-child { margin-bottom: 0; }

  .acc-code-wrap { margin: 10px 0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: ${colors.codeBg}; position: relative; }
  .acc-code-caption {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase;
    color: ${colors.muted}; padding: 9px 46px 0 14px;
  }
  .acc-code-pre {
    margin: 0; padding: 10px 14px 14px 14px; font-family: 'Menlo','Consolas',monospace;
    font-size: 12.5px; color: ${colors.codeText}; line-height: 1.75; overflow-x: auto; white-space: pre;
  }
  .acc-code-copy {
    position: absolute; top: 8px; right: 8px; display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700; color: ${colors.codeText}; background: rgba(255,255,255,0.08);
    padding: 6px 10px; border-radius: 8px; transition: background 0.15s ease;
  }
  .acc-code-copy:hover { background: rgba(255,255,255,0.18); }
  .acc-code-copy.acc-copied { background: rgba(6,182,212,0.35); color: #fff; }

  .acc-item-tip {
    display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; color: ${colors.goldDeep};
    background: rgba(99,102,241,0.06); border-left: 3px solid ${colors.gold};
    padding: 9px 12px; border-radius: 8px; margin-top: 10px; line-height: 1.5;
  }

  .acc-action-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
  .acc-pill-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 700; padding: 12px 18px;
    border-radius: 999px; color: #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .acc-pill-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.2); }
  .acc-pill-btn:active { transform: translateY(1px); }
  .acc-pill-gold { background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); }
  .acc-pill-teal { background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); }

  .acc-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 28px; gap: 12px; }
  .acc-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft}; background: ${colors.card}; border: 1px solid ${colors.border};
    transition: transform 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .acc-nav-back:not([disabled]):hover { color: ${colors.gold}; border-color: ${colors.borderActive}; transform: translateX(-2px); }
  .acc-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 24px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: black;
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .acc-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .acc-nav-next:not([disabled]):active { transform: translateY(1px); }
  .acc-nav-next[disabled], .acc-nav-back[disabled] { opacity: 0.4; cursor: default; background: ${colors.cardAlt}; color: ${colors.muted}; box-shadow: none; }

  .acc-cert {
    border-radius: 24px; padding: 32px 20px; text-align: center;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    position: relative; overflow: hidden;
  }
  @media (min-width: 640px) { .acc-cert { padding: 40px; } }
  .acc-cert-badge {
    margin: 0 auto 20px auto; width: 76px; height: 76px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #F59E0B, #F97316);
    box-shadow: 0 10px 28px rgba(245,158,11,0.35);
    position: relative; z-index: 1;
    animation: acc-badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes acc-badge-pop { 0% { transform: scale(0.4) rotate(-15deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
  .acc-cert-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.gold}; margin: 0 0 8px 0; position: relative; z-index: 1; }
  .acc-cert-title { font-weight: 800; color: ${colors.ink}; font-size: 26px; margin: 0 0 12px 0; position: relative; z-index: 1; }
  .acc-cert-desc { font-size: 14px; color: ${colors.inkSoft}; margin: 0 0 24px 0; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.6; position: relative; z-index: 1; }
  .acc-cert-score {
    display: inline-flex; align-items: center; gap: 12px; border-radius: 20px; padding: 16px 24px; margin-bottom: 32px;
    background: ${colors.card}; border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); position: relative; z-index: 1;
  }
  .acc-cert-score-num { font-weight: 800; font-size: 30px; color: ${colors.gold}; }
  .acc-cert-score-label { font-size: 12px; color: ${colors.muted}; text-align: left; max-width: 150px; }
  .acc-cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px; text-align: left; position: relative; z-index: 1; }
  @media (min-width: 560px) { .acc-cert-grid { grid-template-columns: repeat(3, 1fr); } }
  .acc-cert-item { border-radius: 14px; padding: 12px; background: ${colors.card}; border: 1px solid ${colors.border}; display: flex; align-items: center; gap: 8px; }
  .acc-cert-item p { font-size: 12px; color: ${colors.ink}; margin: 0; font-weight: 600; }
  .acc-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700;
    padding: 14px 24px; border-radius: 14px; background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.inkSoft};
    position: relative; z-index: 1; transition: color 0.2s ease, border-color 0.2s ease;
  }
  .acc-reset-btn:hover { color: ${colors.gold}; border-color: ${colors.borderActive}; }
`;

/* ---------------------------- CONTENT DATA ---------------------------- */

interface CommandBlock {
  caption?: string;
  lines: string[];
}

interface StepItem {
  num: number;
  title: string;
  explanation: string[]; // one or more instructional paragraphs, read top to bottom
  blocks?: CommandBlock[]; // exact text the student copies and pastes
  tip?: string;
}

interface PhaseData {
  key: string;
  title: string;
  tag: string;
  icon: LucideIcon;
  subtitle: string;
  hero: "terminal" | "boxes" | "scoreboard" | "bubbles" | "flow" | "rocket";
  steps: StepItem[];
}

const PHASES: PhaseData[] = [
  {
    key: "setup",
    title: "Setup & Structure",
    tag: "Phase 1 - Foundations",
    icon: FolderTree,
    subtitle: "Install your tools, scaffold the project, and get Git tracking your work.",
    hero: "terminal",
    steps: [
      {
        num: 1,
        title: "Install the Required Software",
        explanation: [
          "Download Python 3.11 or above from python.org. On Windows, tick 'Add Python to PATH' during install so you can run it from any terminal.",
          "Download and install Visual Studio Code from code.visualstudio.com and Git from git-scm.com.",
          "Download Node.js (the LTS version) from nodejs.org — you'll use it if you extend the frontend later.",
          "Docker Desktop (docker.com) is used in the final deployment phase, and PostgreSQL is optional for advanced features — install both now if you'd like, or skip and come back later.",
          "Once everything is installed, open VS Code, click Terminal in the top menu, then New Terminal. Paste the block below to confirm each tool is ready.",
        ],
        blocks: [{ lines: ["python --version", "git --version", "node --version"] }],
        tip: "If any command isn't recognized, close and reopen VS Code so it picks up the newly installed PATH.",
      },
      {
        num: 2,
        title: "Create Your Project Folder",
        explanation: [
          "In VS Code, go to File > Open Folder, create a new empty folder named AI-Career-Coach, and open it.",
          "With that folder open, go to Terminal > New Terminal so the terminal's starting location matches your project — you'll use it in the next step.",
        ],
      },
      {
        num: 3,
        title: "Create the Project Structure",
        explanation: [
          "In the terminal, paste the block below to create every folder this project needs in one pass: backend for your API, frontend/templates/static for the UI, datasets for training data, uploads for resumes, models for saved ML models, and utils for helper code.",
        ],
        blocks: [
          {
            caption: "Create the folders",
            lines: ["mkdir backend", "mkdir frontend", "mkdir datasets", "mkdir uploads", "mkdir models", "mkdir utils", "mkdir static", "mkdir templates"],
          },
          { caption: "Windows (PowerShell) — create the root files", lines: ["New-Item README.md", "New-Item requirements.txt"] },
          { caption: "Mac / Linux — create the root files", lines: ["touch README.md requirements.txt"] },
        ],
      },
      {
        num: 4,
        title: "Create a Python Virtual Environment",
        explanation: [
          "A virtual environment keeps this project's Python packages separate from everything else on your machine.",
          "Look at the small dropdown arrow next to the '+' icon in the top-right of the terminal panel, and select PowerShell if you're on Windows. Paste the command below to create the environment.",
          "Then activate it. On Windows PowerShell use the second command — if it's blocked with a 'running scripts is disabled' message, run the third command first and try again. On Mac or Linux use the fourth command instead.",
        ],
        blocks: [
          { caption: "Create the environment", lines: ["python -m venv venv"] },
          { caption: "Windows (PowerShell) — activate", lines: ["venv\\Scripts\\Activate.ps1"] },
          { caption: "If PowerShell blocks the script above", lines: ["Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"] },
          { caption: "Mac / Linux — activate", lines: ["source venv/bin/activate"] },
        ],
        tip: "You'll know it worked when (venv) appears at the start of your terminal line. Keep it active for every step from here on.",
      },
      {
        num: 5,
        title: "Install Required Python Libraries",
        explanation: [
          "With (venv) active, paste the block below to install everything the backend needs: FastAPI and Uvicorn for the API, Pandas/NumPy/Scikit-learn/Matplotlib for data and machine learning, TensorFlow for the neural network, OpenCV and EasyOCR for image and OCR work, and Transformers plus LangChain for the AI features later. This is a large install and can take several minutes.",
          "Once it finishes, save the exact list of what got installed into requirements.txt.",
        ],
        blocks: [
          {
            caption: "Install the libraries",
            lines: ["pip install fastapi \"uvicorn[standard]\" pandas numpy scikit-learn matplotlib tensorflow opencv-python easyocr transformers langchain python-multipart python-docx pypdf"],
          },
          { caption: "Save the installed list", lines: ["pip freeze > requirements.txt"] },
        ],
      },
      {
        num: 6,
        title: "Initialize Git",
        explanation: [
          "Paste the three commands below one at a time to turn the folder into a Git repository, stage every file, and save your first commit.",
          "Then go to github.com, click the '+' icon top right, choose New repository, name it AI-Career-Coach, and create it without a README. Copy the remote URL it shows you, paste it in place of YOUR-REPO-URL below, and run all three lines.",
        ],
        blocks: [
          { caption: "Save your first commit", lines: ["git init", "git add .", 'git commit -m "Initial commit"'] },
          { caption: "Connect and push to GitHub", lines: ["git remote add origin YOUR-REPO-URL", "git branch -M main", "git push -u origin main"] },
        ],
      },
    ],
  },
  {
    key: "app",
    title: "Backend & Frontend",
    tag: "Phase 2 - Build the App",
    icon: Server,
    subtitle: "Stand up the FastAPI backend, build a simple UI, and get resumes flowing in.",
    hero: "boxes",
    steps: [
      {
        num: 7,
        title: "Build Your First Backend",
        explanation: [
          "Right-click the backend folder, choose New File, name it main.py, and paste the code below into it.",
          "Open your terminal (with (venv) active) and run the command underneath to start the server. Visit http://localhost:8000 in your browser to see the JSON message, and http://localhost:8000/docs to see the interactive API documentation FastAPI builds automatically.",
        ],
        blocks: [
          { caption: "backend/main.py", lines: ["from fastapi import FastAPI", "", "app = FastAPI(title='AI Career Coach')", "", "@app.get('/')", "def read_root():", "    return {'message': 'AI Career Coach API is running'}"] },
          { caption: "Run the server", lines: ["uvicorn backend.main:app --reload"] },
        ],
      },
      {
        num: 8,
        title: "Build the Frontend",
        explanation: [
          "Right-click the templates folder, choose New File, name it index.html, and paste the starter page below — it gives users a file picker, a job description box, and a button.",
          "Right-click the static folder, choose New File, name it app.js, and paste the second block in — it sends whatever the user uploads to your backend.",
          "Finally, add the third block to backend/main.py so FastAPI knows how to serve these two files, then restart uvicorn (stop it with Ctrl+C in the terminal, then run the same command from step 7 again) and visit http://localhost:8000/home.",
        ],
        blocks: [
          {
            caption: "templates/index.html",
            lines: [
              "<!DOCTYPE html>",
              "<html>",
              "<head><title>AI Career Coach</title></head>",
              "<body>",
              "  <h1>AI Career Coach</h1>",
              "  <input type='file' id='resumeFile' />",
              "  <textarea id='jobDescription' placeholder='Paste job description'></textarea>",
              "  <button onclick='uploadResume()'>Analyze Resume</button>",
              "  <pre id='result'></pre>",
              "  <script src='/static/app.js'></script>",
              "</body>",
              "</html>",
            ],
          },
          {
            caption: "static/app.js",
            lines: [
              "async function uploadResume() {",
              "  const file = document.getElementById('resumeFile').files[0];",
              "  const formData = new FormData();",
              "  formData.append('file', file);",
              "  const res = await fetch('/upload-resume', { method: 'POST', body: formData });",
              "  const data = await res.json();",
              "  document.getElementById('result').textContent = JSON.stringify(data, null, 2);",
              "}",
            ],
          },
          {
            caption: "Add to backend/main.py",
            lines: [
              "from fastapi.staticfiles import StaticFiles",
              "from fastapi.templating import Jinja2Templates",
              "from fastapi import Request",
              "",
              "app.mount('/static', StaticFiles(directory='static'), name='static')",
              "templates = Jinja2Templates(directory='templates')",
              "",
              "@app.get('/home')",
              "def home(request: Request):",
              "    return templates.TemplateResponse('index.html', {'request': request})",
            ],
          },
        ],
      },
      {
        num: 9,
        title: "Resume Upload Feature",
        explanation: [
          "Paste the endpoint below into backend/main.py. It accepts PDF, DOCX, or image files and saves each one inside the uploads folder using its original filename.",
          "Restart uvicorn, then test it directly from http://localhost:8000/docs before wiring up the frontend button.",
        ],
        blocks: [
          {
            caption: "Add to backend/main.py",
            lines: [
              "from fastapi import UploadFile, File",
              "import shutil, os",
              "",
              "@app.post('/upload-resume')",
              "async def upload_resume(file: UploadFile = File(...)):",
              "    save_path = os.path.join('uploads', file.filename)",
              "    with open(save_path, 'wb') as buffer:",
              "        shutil.copyfileobj(file.file, buffer)",
              "    return {'filename': file.filename, 'status': 'saved'}",
            ],
          },
        ],
      },
      {
        num: 10,
        title: "Extract Resume Content",
        explanation: [
          "Right-click the utils folder, choose New File, name it extract_text.py, and paste the code below. It pulls text out of PDF, DOCX, and image resumes using a different library for each file type.",
          "Then update the /upload-resume endpoint in backend/main.py to call this function and return the extracted text, using the second block below.",
        ],
        blocks: [
          {
            caption: "utils/extract_text.py",
            lines: [
              "import pypdf",
              "import docx",
              "import easyocr",
              "",
              "reader = easyocr.Reader(['en'])",
              "",
              "def extract_text(path: str) -> str:",
              "    if path.endswith('.pdf'):",
              "        pdf = pypdf.PdfReader(path)",
              "        return '\\n'.join(page.extract_text() or '' for page in pdf.pages)",
              "    elif path.endswith('.docx'):",
              "        doc = docx.Document(path)",
              "        return '\\n'.join(p.text for p in doc.paragraphs)",
              "    else:",
              "        result = reader.readtext(path, detail=0)",
              "        return '\\n'.join(result)",
            ],
          },
          {
            caption: "Update /upload-resume in backend/main.py",
            lines: [
              "from utils.extract_text import extract_text",
              "",
              "@app.post('/upload-resume')",
              "async def upload_resume(file: UploadFile = File(...)):",
              "    save_path = os.path.join('uploads', file.filename)",
              "    with open(save_path, 'wb') as buffer:",
              "        shutil.copyfileobj(file.file, buffer)",
              "    text = extract_text(save_path)",
              "    return {'filename': file.filename, 'extracted_text': text}",
            ],
          },
        ],
      },
    ],
  },
  {
    key: "ml",
    title: "Data & Machine Learning",
    tag: "Phase 3 - Data & ML",
    icon: Database,
    subtitle: "Turn raw resumes into a clean dataset, then train and compare models to predict job roles.",
    hero: "scoreboard",
    steps: [
      {
        num: 11,
        title: "Build a Resume Dataset",
        explanation: [
          "Right-click the datasets folder, choose New File, name it resumes.csv, and paste the block below — a header row plus a handful of starter resumes. Add many more rows underneath covering different roles so your model has enough to learn from.",
          "Then create a quick script anywhere in notebooks (create that folder if you'd like) to load and clean it.",
        ],
        blocks: [
          {
            caption: "datasets/resumes.csv",
            lines: [
              "skills,education,experience_years,projects,certifications,job_role",
              "Python;SQL;Excel,Bachelors,1,2,0,Data Analyst",
              "React;JavaScript;CSS,Bachelors,2,4,1,Frontend Developer",
              "Python;TensorFlow;Pandas,Masters,3,5,2,Machine Learning Engineer",
              "Java;Spring;SQL,Bachelors,4,6,1,Backend Developer",
              "Python;FastAPI;Docker,Masters,2,3,1,Backend Developer",
            ],
          },
          { caption: "Load and clean it", lines: ["import pandas as pd", "", "df = pd.read_csv('datasets/resumes.csv')", "df = df.drop_duplicates().dropna()", "print(df.head())"] },
        ],
        tip: "Aim for at least 10-15 rows per job role so each category has enough examples.",
      },
      {
        num: 12,
        title: "Explore the Dataset",
        explanation: ["Add the code below to see how job roles and experience are distributed across your dataset."],
        blocks: [{ lines: ["print(df['job_role'].value_counts())", "", "import matplotlib.pyplot as plt", "df['experience_years'].hist()", "plt.show()"] }],
      },
      {
        num: 13,
        title: "Feature Engineering",
        explanation: ["Turn the text columns into numbers a model can use. Add this code next — it counts skills and maps education level to a number."],
        blocks: [
          {
            lines: [
              "df['num_skills'] = df['skills'].apply(lambda s: len(s.split(';')))",
              "df['education_level'] = df['education'].map({'Bachelors': 1, 'Masters': 2, 'PhD': 3})",
            ],
          },
        ],
      },
      {
        num: 14,
        title: "Build Your First ML Model",
        explanation: [
          "Right-click the model folder (create it if it isn't there yet), choose New File, name it train_model.py, and paste the code below. It builds the features and target, splits the data, and trains five different classifiers so you can compare them.",
        ],
        blocks: [
          {
            caption: "model/train_model.py",
            lines: [
              "import pandas as pd",
              "from sklearn.model_selection import train_test_split",
              "from sklearn.tree import DecisionTreeClassifier",
              "from sklearn.ensemble import RandomForestClassifier",
              "from sklearn.neighbors import KNeighborsClassifier",
              "from sklearn.linear_model import LogisticRegression",
              "from sklearn.svm import SVC",
              "",
              "df = pd.read_csv('datasets/resumes.csv')",
              "df['num_skills'] = df['skills'].apply(lambda s: len(s.split(';')))",
              "df['education_level'] = df['education'].map({'Bachelors': 1, 'Masters': 2, 'PhD': 3})",
              "",
              "X = df[['num_skills', 'education_level', 'experience_years', 'projects', 'certifications']]",
              "y = df['job_role']",
              "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)",
              "",
              "models = {",
              "    'Decision Tree': DecisionTreeClassifier(),",
              "    'Random Forest': RandomForestClassifier(),",
              "    'KNN': KNeighborsClassifier(),",
              "    'Logistic Regression': LogisticRegression(max_iter=1000),",
              "    'SVM': SVC(),",
              "}",
              "for name, model in models.items():",
              "    model.fit(X_train, y_train)",
            ],
          },
        ],
      },
      {
        num: 15,
        title: "Evaluate the Models",
        explanation: [
          "Add the code below to the bottom of train_model.py to see how each model scores on the test data, then save the file and run the command underneath from your terminal.",
        ],
        blocks: [
          {
            lines: [
              "from sklearn.metrics import accuracy_score, classification_report",
              "",
              "for name, model in models.items():",
              "    preds = model.predict(X_test)",
              "    print(name, 'accuracy:', accuracy_score(y_test, preds))",
              "    print(classification_report(y_test, preds))",
            ],
          },
          { caption: "Run it", lines: ["python model/train_model.py"] },
        ],
      },
      {
        num: 16,
        title: "Improve the Model",
        explanation: [
          "Once you've picked your best-performing model type from the printed results, tune it with cross validation and a grid search over its settings. The example below tunes the Random Forest — swap in whichever model you picked.",
          "Then save the tuned model so your app can load it later without retraining.",
        ],
        blocks: [
          {
            lines: [
              "from sklearn.model_selection import GridSearchCV",
              "",
              "param_grid = {'n_estimators': [50, 100, 200], 'max_depth': [None, 5, 10]}",
              "grid = GridSearchCV(RandomForestClassifier(), param_grid, cv=5)",
              "grid.fit(X_train, y_train)",
              "best_model = grid.best_estimator_",
              "print('Best params:', grid.best_params_)",
            ],
          },
          { caption: "Save the tuned model", lines: ["import pickle", "", "with open('models/job_role_model.pkl', 'wb') as f:", "    pickle.dump(best_model, f)"] },
        ],
      },
      {
        num: 17,
        title: "Build a Neural Network",
        explanation: [
          "Right-click the model folder, choose New File, name it train_nn.py, and paste the code below to build a small neural network with TensorFlow/Keras, then compare its accuracy against your traditional ML models from step 15.",
        ],
        blocks: [
          {
            caption: "model/train_nn.py",
            lines: [
              "import tensorflow as tf",
              "from tensorflow.keras import layers",
              "from sklearn.preprocessing import LabelEncoder",
              "",
              "encoder = LabelEncoder()",
              "y_train_encoded = encoder.fit_transform(y_train)",
              "",
              "nn_model = tf.keras.Sequential([",
              "    layers.Dense(16, activation='relu', input_shape=(X_train.shape[1],)),",
              "    layers.Dense(8, activation='relu'),",
              "    layers.Dense(len(encoder.classes_), activation='softmax'),",
              "])",
              "nn_model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])",
              "nn_model.fit(X_train, y_train_encoded, epochs=20, validation_split=0.2)",
            ],
          },
        ],
        tip: "LabelEncoder turns job role names into numbers the network can predict — you'll use encoder.classes_ later to turn predictions back into readable role names.",
      },
    ],
  },
  {
    key: "ai",
    title: "AI & NLP Features",
    tag: "Phase 4 - Generative AI",
    icon: BrainCircuit,
    subtitle: "Layer in OCR, NLP understanding, and an LLM-powered career agent.",
    hero: "bubbles",
    steps: [
      {
        num: 18,
        title: "Add OCR Support",
        explanation: [
          "Your extract_text.py from step 10 already handles scanned images with EasyOCR. Confirm it works by running the command below in your terminal (with (venv) active) against a sample scanned resume image saved in your uploads folder.",
        ],
        blocks: [{ lines: ["python -c \"from utils.extract_text import extract_text; print(extract_text('uploads/sample_scan.png'))\""] }],
        tip: "The first time you run this, EasyOCR downloads its recognition model — that's expected and only happens once.",
      },
      {
        num: 19,
        title: "Add Resume Understanding (NLP)",
        explanation: [
          "Install spaCy and its small English language model using the block below.",
          "Right-click the utils folder, choose New File, name it parse_resume.py, and paste the code underneath. It pulls out an email address and matches known skills from the resume text.",
        ],
        blocks: [
          { caption: "Install spaCy", lines: ["pip install spacy", "python -m spacy download en_core_web_sm"] },
          {
            caption: "utils/parse_resume.py",
            lines: [
              "import re",
              "import spacy",
              "",
              "nlp = spacy.load('en_core_web_sm')",
              "SKILL_LIST = ['Python', 'SQL', 'React', 'TensorFlow', 'FastAPI', 'Docker']",
              "",
              "def parse_resume(text: str) -> dict:",
              "    email = re.findall(r'[\\w.-]+@[\\w.-]+', text)",
              "    skills_found = [s for s in SKILL_LIST if s.lower() in text.lower()]",
              "    return {'email': email[0] if email else None, 'skills': skills_found}",
            ],
          },
        ],
      },
      {
        num: 20,
        title: "Add AI Resume Suggestions",
        explanation: [
          "Install the Anthropic Python library, then set your API key as an environment variable so your code can use it without hardcoding it into a file.",
          "Right-click the utils folder, choose New File, name it ai_suggestions.py, and paste the code below in.",
        ],
        blocks: [
          { caption: "Install the library", lines: ["pip install anthropic"] },
          { caption: "Windows (PowerShell) — set your API key", lines: ['setx ANTHROPIC_API_KEY "your-key-here"'] },
          { caption: "Mac / Linux — set your API key", lines: ['export ANTHROPIC_API_KEY="your-key-here"'] },
          {
            caption: "utils/ai_suggestions.py",
            lines: [
              "import anthropic",
              "",
              "client = anthropic.Anthropic()",
              "",
              "def get_resume_suggestions(resume_text: str) -> str:",
              "    message = client.messages.create(",
              "        model='claude-sonnet-4-6',",
              "        max_tokens=500,",
              "        messages=[{'role': 'user', 'content': f'Suggest 5 ATS improvements for this resume:\\n{resume_text}'}],",
              "    )",
              "    return message.content[0].text",
            ],
          },
        ],
        tip: "After setting the Windows environment variable with setx, close and reopen your terminal for it to take effect.",
      },
      {
        num: 21,
        title: "Generate Cover Letters",
        explanation: ["Add the function below to the bottom of utils/ai_suggestions.py — it turns a resume and a job description into a personalized cover letter."],
        blocks: [
          {
            lines: [
              "def generate_cover_letter(resume_text: str, job_description: str) -> str:",
              "    message = client.messages.create(",
              "        model='claude-sonnet-4-6',",
              "        max_tokens=600,",
              "        messages=[{'role': 'user', 'content': f'Write a cover letter for this job:\\n{job_description}\\nUsing this resume:\\n{resume_text}'}],",
              "    )",
              "    return message.content[0].text",
            ],
          },
        ],
      },
      {
        num: 22,
        title: "Build an Interview Question Generator",
        explanation: ["Add one more function to the same file — this one produces likely interview questions with model answers based on the resume."],
        blocks: [
          {
            lines: [
              "def generate_interview_questions(resume_text: str) -> str:",
              "    message = client.messages.create(",
              "        model='claude-sonnet-4-6',",
              "        max_tokens=600,",
              "        messages=[{'role': 'user', 'content': f'Generate 5 interview questions with model answers based on this resume:\\n{resume_text}'}],",
              "    )",
              "    return message.content[0].text",
            ],
          },
        ],
      },
      {
        num: 23,
        title: "Build an AI Career Agent",
        explanation: [
          "Paste the endpoint below into backend/main.py. It chains everything together in one click: it extracts text, parses it, loads your saved job-role model, and calls the three AI functions you just wrote — all from a single request.",
          "Restart uvicorn after saving, then test it from http://localhost:8000/docs.",
        ],
        blocks: [
          {
            caption: "Add to backend/main.py",
            lines: [
              "from utils.parse_resume import parse_resume",
              "from utils.ai_suggestions import get_resume_suggestions, generate_cover_letter, generate_interview_questions",
              "import pickle",
              "",
              "with open('models/job_role_model.pkl', 'rb') as f:",
              "    job_model = pickle.load(f)",
              "",
              "@app.post('/career-agent')",
              "async def career_agent(file: UploadFile = File(...), job_description: str = ''):",
              "    save_path = os.path.join('uploads', file.filename)",
              "    with open(save_path, 'wb') as buffer:",
              "        shutil.copyfileobj(file.file, buffer)",
              "    text = extract_text(save_path)",
              "    parsed = parse_resume(text)",
              "    suggestions = get_resume_suggestions(text)",
              "    cover_letter = generate_cover_letter(text, job_description) if job_description else None",
              "    questions = generate_interview_questions(text)",
              "    return {",
              "        'parsed': parsed,",
              "        'suggestions': suggestions,",
              "        'cover_letter': cover_letter,",
              "        'interview_questions': questions,",
              "    }",
            ],
          },
        ],
      },
    ],
  },
  {
    key: "integrate",
    title: "Connect Everything",
    tag: "Phase 5 - Integration",
    icon: Workflow,
    subtitle: "Wire every feature into one continuous workflow, end to end.",
    hero: "flow",
    steps: [
      {
        num: 24,
        title: "Connect Everything",
        explanation: [
          "Open static/app.js and replace its contents with the block below. Instead of calling /upload-resume, the button now calls /career-agent, sending both the file and the job description text, and displays every result on the page.",
          "Restart uvicorn, refresh http://localhost:8000/home, upload a resume with a job description filled in, and confirm the parsed info, suggestions, cover letter, and interview questions all come back together.",
        ],
        blocks: [
          {
            caption: "static/app.js",
            lines: [
              "async function uploadResume() {",
              "  const file = document.getElementById('resumeFile').files[0];",
              "  const jobDescription = document.getElementById('jobDescription').value;",
              "  const formData = new FormData();",
              "  formData.append('file', file);",
              "  formData.append('job_description', jobDescription);",
              "  const res = await fetch('/career-agent', { method: 'POST', body: formData });",
              "  const data = await res.json();",
              "  document.getElementById('result').textContent = JSON.stringify(data, null, 2);",
              "}",
            ],
          },
        ],
        tip: "This is the moment the whole pipeline — Upload → Extract → Analyze → Predict → Suggest → Cover Letter → Interview Questions — runs end to end from one click.",
      },
    ],
  },
  {
    key: "deploy",
    title: "Deploy",
    tag: "Phase 6 - Ship It",
    icon: Rocket,
    subtitle: "Package the app and put it online for the world to use.",
    hero: "rocket",
    steps: [
      {
        num: 25,
        title: "Deploy the Application",
        explanation: [
          "In VS Code's file explorer, right-click your project's root folder, choose New File, name it exactly Dockerfile (no extension), and paste the block below into it. This packages your backend so it can run anywhere Docker is installed.",
          "Build and run the image locally first to confirm it works before deploying anywhere.",
          "Once it runs correctly, push your final code to GitHub, then deploy the backend on a host like Render or Railway — point it at this Dockerfile — and the frontend separately on Vercel or Netlify if you split it out. Test the live URL the same way you tested localhost.",
        ],
        blocks: [
          {
            caption: "Dockerfile",
            lines: ["FROM python:3.11-slim", "WORKDIR /app", "COPY requirements.txt .", "RUN pip install -r requirements.txt", "COPY . .", 'CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]'],
          },
          { caption: "Build and run locally", lines: ["docker build -t ai-career-coach .", "docker run -p 8000:8000 ai-career-coach"] },
          { caption: "Push your final code", lines: ["git add .", 'git commit -m "Add Dockerfile and finalize app"', "git push"] },
        ],
        tip: "Free tiers on Render and Railway are enough to demo this project — just remember to add your ANTHROPIC_API_KEY as an environment variable in their dashboard too, since your local .env or terminal export won't carry over.",
      },
    ],
  },
];

const TOTAL_STEPS = PHASES.reduce((sum, p) => sum + p.steps.length, 0);
const ENCOURAGEMENTS = ["Nice! 🎉", "Shipped! ✨", "Great work!", "On a roll!", "Solid progress!"];

/* ------------------------------- HELPERS ------------------------------- */

interface StampBarProps {
  current: number;
  completedPhases: boolean[];
  onJump: (idx: number) => void;
}

function StampBar({ current, completedPhases, onJump }: StampBarProps) {
  const doneCount = completedPhases.filter(Boolean).length;
  const pct = (doneCount / PHASES.length) * 100;
  return (
    <div>
      <div className="acc-progress-track">
        <div className="acc-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="acc-stampbar">
        {PHASES.map((p, i) => {
          const Icon = p.icon;
          const isDone = completedPhases[i];
          const isCurrent = current === i;
          const bg = isDone || isCurrent ? `linear-gradient(135deg, ${colors.gold}, ${colors.purple})` : colors.card;
          return (
            <button
              key={p.key}
              className="acc-stamp-btn"
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
              <span className="acc-stamp-label" style={{ color: isDone || isCurrent ? "#fff" : colors.muted }}>
                {p.title}
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
    <div className="acc-stage-shell">
      <div className="acc-stage-top">
        <span className="acc-stage-tag">{tag}</span>
        {progressLabel && <span className="acc-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="acc-stage-title">{title}</h2>
      {subtitle && <p className="acc-stage-subtitle">{subtitle}</p>}
      {hero && <div className="acc-hero">{hero}</div>}
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
    <div className="acc-nav-row">
      <button className="acc-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <button className="acc-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* -------- Copy-to-clipboard code block used inside each step -------- */

function CodeBlock({ block }: { block: CommandBlock }) {
  const [copied, setCopied] = useState(false);
  const text = block.lines.join("\n");

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable — the student can still select the text manually.
    }
  };

  return (
    <div className="acc-code-wrap" onClick={(e) => e.stopPropagation()}>
      {block.caption && <div className="acc-code-caption">{block.caption}</div>}
      <button className={`acc-code-copy ${copied ? "acc-copied" : ""}`} onClick={handleCopy}>
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="acc-code-pre">
        {block.lines.map((line, i) => (
          <div key={i}>{line || "\u00A0"}</div>
        ))}
      </pre>
    </div>
  );
}

/* -------- Phase hero illustrations -------- */

function TerminalHero() {
  return (
    <div className="acc-term">
      <div className="acc-term-bar">
        <div className="acc-term-dots">
          <span className="acc-term-dot" />
          <span className="acc-term-dot" />
          <span className="acc-term-dot" />
        </div>
        <span className="acc-term-label">AI-Career-Coach — zsh</span>
      </div>
      <div className="acc-term-body">
        <div className="acc-term-line">
          <span>$</span> python --version
        </div>
        <div className="acc-term-line">
          <span>$</span> git init
        </div>
        <div className="acc-term-line">
          <span>$</span> pip install -r requirements.txt
        </div>
      </div>
    </div>
  );
}

function BoxesHero() {
  return (
    <div className="acc-boxes">
      <div className="acc-box">
        <Server size={20} color="#fff" />
        <span className="acc-box-label">Backend</span>
      </div>
      <span className="acc-box-arrow">↔</span>
      <div className="acc-box acc-box-alt">
        <FolderTree size={20} color="#fff" />
        <span className="acc-box-label">Frontend</span>
      </div>
    </div>
  );
}

function ScoreboardHero() {
  const models = ["Tree", "Forest", "KNN", "SVM", "NN"];
  return (
    <div className="acc-scoreboard">
      {models.map((m) => (
        <div key={m} className="acc-score-crate">
          <Database size={16} color={colors.tealDeep} />
          <span className="acc-score-label">{m}</span>
        </div>
      ))}
    </div>
  );
}

function BubblesHero() {
  return (
    <div className="acc-bubbles">
      <div className="acc-bubble-row acc-from-user">
        <span className="acc-bubble acc-bubble-user" style={{ animationDelay: "0s" }}>
          Improve my resume for this job posting
        </span>
      </div>
      <div className="acc-bubble-row">
        <span className="acc-bubble acc-bubble-ai" style={{ animationDelay: "0.25s" }}>
          Here are your ATS gaps, a rewritten summary, and 5 interview questions...
        </span>
      </div>
    </div>
  );
}

function FlowHero() {
  const nodes = ["Upload", "Extract", "Analyze", "Suggest", "Roadmap"];
  return (
    <div className="acc-flow">
      {nodes.map((n, i) => (
        <React.Fragment key={n}>
          <span className="acc-flow-node">{n}</span>
          {i < nodes.length - 1 && <span className="acc-flow-arrow">↓</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function RocketHero() {
  return (
    <div className="acc-rocket-wrap">
      <div className="acc-rocket-badge">
        <Rocket size={26} color="#fff" />
      </div>
    </div>
  );
}

function renderHero(kind: PhaseData["hero"]) {
  switch (kind) {
    case "terminal":
      return <TerminalHero />;
    case "boxes":
      return <BoxesHero />;
    case "scoreboard":
      return <ScoreboardHero />;
    case "bubbles":
      return <BubblesHero />;
    case "flow":
      return <FlowHero />;
    case "rocket":
      return <RocketHero />;
    default:
      return null;
  }
}

const getRandomEncouragement = () =>
  ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

/* ------------------------------- MAIN APP ------------------------------- */

export default function AICareerCoachGuide() {
  const [current, setCurrent] = useState<number>(0); // 0..PHASES.length-1, PHASES.length = certificate
  const [completedPhases, setCompletedPhases] = useState<boolean[]>(PHASES.map(() => false));
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const fireToast = (text?: string) => {
    const msg = text || getRandomEncouragement();
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  };

  const toggleStep = (num: number) => {
    setCheckedSteps((prev) => {
      const next = { ...prev, [num]: !prev[num] };
      if (next[num]) fireToast();
      return next;
    });
  };

  const isPhaseFullyChecked = (idx: number) => PHASES[idx].steps.every((s) => checkedSteps[s.num]);

  const markPhaseComplete = (idx: number) => {
    setCompletedPhases((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const goTo = (idx: number) => setCurrent(idx);

  const totalChecked = Object.values(checkedSteps).filter(Boolean).length;

  const resetAll = () => {
    setCurrent(0);
    setCompletedPhases(PHASES.map(() => false));
    setCheckedSteps({});
    setToast(null);
  };

  return (
    <div className="acc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ${STYLES}
      `}</style>

      <div className="acc-blob acc-blob-1" />
      <div className="acc-blob acc-blob-2" />
      <div className="acc-blob acc-blob-3" />
      <div className="acc-blob acc-blob-4" />

      {toast && (
        <div className="acc-toast">
          <Sparkles size={15} />
          {toast}
        </div>
      )}

      <div className="acc-container">
        <Link href="/" className="acc-back-btn">
          <ChevronLeft size={18} />
          Back to Curriculum
        </Link>

        <div className="acc-header">
          <div className="acc-header-icon">
            <BrainCircuit size={26} color={colors.gold} />
          </div>
          <p className="acc-eyebrow">Complete Project Build Guide</p>
          <h1 className="acc-h1">AI Career Coach</h1>
          <p className="acc-subtitle">
            Build a web app that analyzes resumes, matches them to jobs, suggests improvements, writes cover
            letters, and preps candidates for interviews. Every step below reads like a tutorial: what to do,
            where to click, and the exact commands or code to copy and paste.
          </p>
        </div>

        {current <= PHASES.length - 1 && <StampBar current={current} completedPhases={completedPhases} onJump={goTo} />}

        {current < PHASES.length &&
          (() => {
            const phase = PHASES[current];
            const allChecked = isPhaseFullyChecked(current);
            return (
              <StageShell
                tag={phase.tag}
                title={phase.title}
                subtitle={phase.subtitle}
                progressLabel={`${phase.steps.filter((s) => checkedSteps[s.num]).length}/${phase.steps.length}`}
                hero={renderHero(phase.hero)}
              >
                <div className="acc-item-list">
                  {phase.steps.map((s) => {
                    const done = !!checkedSteps[s.num];
                    return (
                      <div
                        key={s.num}
                        className={`acc-item-card ${done ? "acc-item-done" : ""}`}
                        onClick={() => toggleStep(s.num)}
                      >
                        <span className="acc-item-check">
                          {done ? (
                            <CheckCircle2 size={20} color={colors.tealDeep} />
                          ) : (
                            <Circle size={20} color={colors.border} />
                          )}
                        </span>
                        <div className="acc-item-body">
                          <div className="acc-item-num">Step {s.num}</div>
                          <p className="acc-item-title">{s.title}</p>
                          {s.explanation.map((para, i) => (
                            <p key={i} className="acc-item-explain">
                              {para}
                            </p>
                          ))}
                          {s.blocks?.map((b, i) => (
                            <CodeBlock key={i} block={b} />
                          ))}
                          {s.tip && (
                            <div className="acc-item-tip">
                              <Sparkles size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                              <span>{s.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <NavButtons
                  backDisabled={current === 0}
                  onBack={() => setCurrent(current - 1)}
                  nextDisabled={!allChecked}
                  nextLabel={current === PHASES.length - 1 ? "Finish Guide" : "Continue"}
                  onNext={() => {
                    markPhaseComplete(current);
                    if (current === PHASES.length - 1) {
                      setCurrent(PHASES.length);
                    } else {
                      fireToast();
                      setCurrent(current + 1);
                    }
                  }}
                />
              </StageShell>
            );
          })()}

        {/* CERTIFICATE */}
        {current === PHASES.length && (
          <div className="acc-cert">
            <div className="acc-cert-badge">
              <Award size={36} color="#fff" />
            </div>
            <p className="acc-cert-eyebrow">Certificate of Completion</p>
            <h2 className="acc-cert-title">You&apos;ve built the AI Career Coach</h2>
            <p className="acc-cert-desc">
              A complete end-to-end AI application — from project setup and data processing to machine
              learning, deep learning, NLP, generative AI, AI agents, and deployment. A strong portfolio piece
              that shows the practical skills of an AI Engineer.
            </p>

            <div className="acc-cert-score">
              <span className="acc-cert-score-num">{totalChecked}/{TOTAL_STEPS}</span>
              <span className="acc-cert-score-label">build steps checked off</span>
            </div>

            <div className="acc-cert-grid">
              {PHASES.map((p) => (
                <div key={p.key} className="acc-cert-item">
                  <CheckCircle2 size={14} color={colors.tealDeep} />
                  <p>{p.title}</p>
                </div>
              ))}
            </div>

            <button className="acc-reset-btn" onClick={resetAll}>
              <RotateCcw size={14} /> Restart the Guide
            </button>
          </div>
        )}
      </div>
    </div>
  );
}