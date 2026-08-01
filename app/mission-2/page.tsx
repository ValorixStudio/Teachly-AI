"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { markLabTopicComplete } from "../page";
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

  /* Boxes hero */
  .acc-boxes { display: flex; align-items: center; gap: 14px; }
  .acc-box {
    display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 20px; border-radius: 16px; min-width: 100px;
    background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); box-shadow: 0 8px 20px rgba(6,182,212,0.3);
  }
  .acc-box-alt { background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); box-shadow: 0 8px 20px rgba(99,102,241,0.3); }
  .acc-box-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.9); }
  .acc-box-arrow { font-weight: 800; font-size: 15px; color: ${colors.muted}; }

  /* Scoreboard hero */
  .acc-scoreboard { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .acc-score-crate {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 16px; border-radius: 14px; min-width: 76px;
    background: ${colors.card}; border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .acc-score-label { font-size: 10.5px; font-weight: 700; color: ${colors.inkSoft}; text-align: center; }

  /* Bubble hero */
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

  /* ---- Completion overlay (matches AI Foundations Lab / ML Without Math Lab / Computer Vision Lab / Generative AI Lab / Mission 1) ---- */
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
    title: "Setup & Environment",
    tag: "Phase 1 - Foundations",
    icon: FolderTree,
    subtitle: "Install your tools and scaffold a clean project folder before touching any data.",
    hero: "terminal",
    steps: [
      {
        num: 1,
        title: "Install the Required Software",
        explanation: [
          "Go to python.org and download Python 3.10 or above for your operating system. While installing on Windows, tick the checkbox that says 'Add Python to PATH' — this lets you run Python from any terminal without extra setup.",
          "Also install Visual Studio Code from code.visualstudio.com if it isn't already on your machine.",
          "Once both are installed, open VS Code, click Terminal in the top menu bar, then click New Terminal. A terminal panel opens at the bottom of the window. Copy the two commands below one at a time, paste each into that terminal, and press Enter after each to confirm everything installed correctly.",
        ],
        blocks: [{ lines: ["python --version", "pip --version"] }],
        tip: "You should see a version number printed back for each command. If you instead see 'command not found', close and reopen VS Code so it picks up the new PATH.",
      },
      {
        num: 2,
        title: "Create Your Project Folder",
        explanation: [
          "In VS Code, go to File > Open Folder, create a new empty folder on your computer, and name it Student-Performance-Predictor. Select it and open it.",
          "With that folder open, go to Terminal > New Terminal again so the terminal's starting location matches your project folder. Copy the block below and paste it in — it creates the four folders you'll use throughout this project in one go.",
        ],
        blocks: [{ lines: ["mkdir dataset", "mkdir notebooks", "mkdir model", "mkdir app"] }],
        tip: "After running this, you'll see dataset, notebooks, model, and app appear in the file explorer on the left side of VS Code.",
      },
      {
        num: 3,
        title: "Create a Virtual Environment",
        explanation: [
          "A virtual environment keeps this project's Python packages separate from everything else on your computer, so nothing conflicts with other projects.",
          "In the terminal panel at the bottom of VS Code, look at the small dropdown arrow next to the '+' icon in the top-right of that panel. Click it and choose PowerShell if you're on Windows (Mac and Linux users can skip this and use the default Terminal).",
          "With that shell open, paste the command below to create the environment. This makes a new folder called venv inside your project — you won't need to open it yourself.",
        ],
        blocks: [{ caption: "Create the environment", lines: ["python -m venv venv"] }],
        tip: "Do this step only once per project. You'll re-use the same venv folder every time you come back to work on it.",
      },
      {
        num: 4,
        title: "Activate the Virtual Environment",
        explanation: [
          "Now turn the environment on so any library you install goes inside it instead of your system-wide Python.",
          "If you're on Windows PowerShell, paste the first command below. If PowerShell blocks it with a message like 'running scripts is disabled on this system', paste the second command first to allow it for this session, then run the activation command again.",
          "If you're on Mac or Linux, use the third command instead in your regular Terminal app.",
        ],
        blocks: [
          { caption: "Windows (PowerShell)", lines: ["venv\\Scripts\\Activate.ps1"] },
          { caption: "If PowerShell blocks the script above", lines: ["Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"] },
          { caption: "Mac / Linux", lines: ["source venv/bin/activate"] },
        ],
        tip: "You'll know it worked when you see (venv) appear at the very start of your terminal line. Keep it active for every step from here on.",
      },
      {
        num: 5,
        title: "Install Required Python Libraries",
        explanation: [
          "With (venv) showing in your terminal, paste the command below and press Enter. This downloads every library you'll need: Pandas and NumPy for handling data, Matplotlib and Seaborn for charts, and Scikit-learn for the machine learning models. It may take a minute or two.",
          "Once it finishes, save the exact list of what got installed into a requirements.txt file, so you (or anyone else) can recreate this exact setup later with one command.",
        ],
        blocks: [
          { caption: "Install the libraries", lines: ["pip install pandas numpy matplotlib seaborn scikit-learn"] },
          { caption: "Save the installed list", lines: ["pip freeze > requirements.txt"] },
        ],
      },
      {
        num: 6,
        title: "Initialize Git",
        explanation: [
          "Git keeps a saved history of every change you make. Paste the three commands below one at a time: the first turns the folder into a Git repository, the second stages every file in it, and the third saves your first snapshot.",
          "Next, go to github.com, click the '+' icon in the top-right corner, choose New repository, name it Student-Performance-Predictor, and create it without adding a README (since your project already has files). GitHub will show you a remote URL on the next screen — copy it and paste it in place of YOUR-REPO-URL in the block below, then run all three lines.",
        ],
        blocks: [
          { caption: "Save your first commit", lines: ["git init", "git add .", 'git commit -m "Initial commit"'] },
          { caption: "Connect and push to GitHub", lines: ["git remote add origin YOUR-REPO-URL", "git branch -M main", "git push -u origin main"] },
        ],
      },
    ],
  },
  {
    key: "dataset",
    title: "Build the CSV Dataset",
    tag: "Phase 2 - Data Collection",
    icon: Database,
    subtitle: "Every ML project starts with data. Design and load the dataset your model will learn from.",
    hero: "boxes",
    steps: [
      {
        num: 7,
        title: "Design the Dataset Columns",
        explanation: [
          "Before writing any code, decide exactly what information your model needs to see. This project uses four columns: Study_Hours (a number like 4.5, hours studied per day), Attendance (a percentage from 0 to 100), Previous_Marks (a score out of 100 from the last exam), and Result (the text Pass or Fail — this is what the model will learn to predict).",
          "Keeping the column names exactly as written below will save you from renaming things later in your code.",
        ],
        blocks: [{ caption: "Header row you'll use", lines: ["Study_Hours,Attendance,Previous_Marks,Result"] }],
      },
      {
        num: 8,
        title: "Create student_data.csv",
        explanation: [
          "In VS Code's file explorer on the left, right-click the dataset folder, choose New File, and name it exactly student_data.csv.",
          "Open the new file and paste the block below into it. The first line is the header from the previous step, and every line after it is one student's data. Feel free to add many more rows below these — the more balanced examples of Pass and Fail you provide, the better your model will learn. Save the file with Ctrl+S (or Cmd+S on Mac) once you're done.",
        ],
        blocks: [
          {
            caption: "Paste into dataset/student_data.csv",
            lines: [
              "Study_Hours,Attendance,Previous_Marks,Result",
              "1,60,40,Fail",
              "2,65,45,Fail",
              "3,70,50,Fail",
              "4,75,55,Pass",
              "5,80,60,Pass",
              "6,85,65,Pass",
              "7,90,70,Pass",
              "2,55,35,Fail",
              "8,95,80,Pass",
              "3,60,42,Fail",
            ],
          },
        ],
        tip: "Aim for at least 40-50 rows in your real dataset so the model has enough examples to generalize from.",
      },
      {
        num: 9,
        title: "Load the Dataset with Pandas",
        explanation: [
          "Right-click the notebooks folder, choose New File, and name it explore.py. Paste the code below into it and save.",
          "Then open your terminal (make sure it still shows (venv) at the start of the line — if not, repeat step 4), and paste the run command underneath to execute the file.",
        ],
        blocks: [
          {
            caption: "notebooks/explore.py",
            lines: ["import pandas as pd", "", "df = pd.read_csv('dataset/student_data.csv')", "print(df.head())", "print(df.shape)", "print(df.dtypes)"],
          },
          { caption: "Run it from the terminal", lines: ["python notebooks/explore.py"] },
        ],
      },
    ],
  },
  {
    key: "explore",
    title: "Explore & Clean the Data",
    tag: "Phase 3 - Data Analysis",
    icon: BrainCircuit,
    subtitle: "Understand what the numbers are telling you before you feed them into a model.",
    hero: "scoreboard",
    steps: [
      {
        num: 10,
        title: "Check Data Quality",
        explanation: [
          "Open notebooks/explore.py again and add the two lines below to the bottom of the file (keep everything already there). These check whether any cells are empty and whether any full rows are exact duplicates.",
          "Save the file, then re-run it from the terminal using the same command as before: python notebooks/explore.py.",
        ],
        blocks: [{ lines: ["print(df.isnull().sum())", "print(df.duplicated().sum())"] }],
        tip: "isnull().sum() counts empty cells per column. duplicated().sum() counts fully repeated rows.",
      },
      {
        num: 11,
        title: "Visualize the Relationships",
        explanation: [
          "Add the code below underneath your existing code in explore.py. It plots Study Hours against Previous Marks, coloring each dot by whether that student passed or failed, so you can see the pattern visually.",
          "Save the file and run python notebooks/explore.py again. A chart window will pop up — close it to let the script finish.",
        ],
        blocks: [
          {
            lines: [
              "import matplotlib.pyplot as plt",
              "import seaborn as sns",
              "",
              "sns.scatterplot(data=df, x='Study_Hours', y='Previous_Marks', hue='Result')",
              "plt.show()",
            ],
          },
        ],
      },
      {
        num: 12,
        title: "Check Correlations",
        explanation: [
          "Correlation only works on numbers, so first turn Result into 1s and 0s just for this check. Add the two lines below to the bottom of explore.py, save, and run the file again.",
        ],
        blocks: [{ lines: ["df['Result_num'] = df['Result'].map({'Pass': 1, 'Fail': 0})", "print(df.corr(numeric_only=True))"] }],
        tip: "Whichever feature has a correlation value closest to 1 or -1 with Result_num is influencing the outcome the most.",
      },
      {
        num: 13,
        title: "Clean the Data",
        explanation: [
          "If step 10 showed any missing values or duplicates, remove them now. Add the three lines below to explore.py, save, and run it one more time.",
          "This creates a brand-new file called student_data_clean.csv so your original raw data stays untouched, in case you want to go back to it.",
        ],
        blocks: [{ lines: ["df = df.drop_duplicates()", "df = df.dropna()", "df.to_csv('dataset/student_data_clean.csv', index=False)"] }],
      },
    ],
  },
  {
    key: "features",
    title: "Feature Engineering",
    tag: "Phase 4 - Prepare for ML",
    icon: Workflow,
    subtitle: "Turn cleaned data into a format a machine learning model can actually learn from.",
    hero: "flow",
    steps: [
      {
        num: 14,
        title: "Encode the Target Label",
        explanation: [
          "Right-click the model folder, choose New File, and name it train_model.py — this is where your actual model gets built.",
          "Paste the code below at the top of the file and save. It loads your cleaned CSV and converts the Result column into 1s and 0s, since scikit-learn's models only understand numbers.",
        ],
        blocks: [
          {
            caption: "model/train_model.py",
            lines: ["import pandas as pd", "", "df = pd.read_csv('dataset/student_data_clean.csv')", "df['Result'] = df['Result'].map({'Pass': 1, 'Fail': 0})"],
          },
        ],
      },
      {
        num: 15,
        title: "Select Input Features (X) and Target (y)",
        explanation: [
          "Directly underneath the code from the previous step, paste the two lines below. X holds the three columns the model will look at, and y holds the answer it's trying to predict.",
        ],
        blocks: [{ lines: ["X = df[['Study_Hours', 'Attendance', 'Previous_Marks']]", "y = df['Result']"] }],
      },
      {
        num: 16,
        title: "Split into Training and Testing Sets",
        explanation: [
          "Paste the code below next. It imports scikit-learn's splitting function and divides your data so the model trains on 80% of the rows and gets tested on the other 20% it has never seen — that's how you'll know if it actually learned, rather than just memorized.",
        ],
        blocks: [
          {
            lines: [
              "from sklearn.model_selection import train_test_split",
              "",
              "X_train, X_test, y_train, y_test = train_test_split(",
              "    X, y, test_size=0.2, random_state=42",
              ")",
            ],
          },
        ],
      },
      {
        num: 17,
        title: "Scale the Features",
        explanation: [
          "KNN is sensitive to features being on different scales — Attendance ranges 0 to 100 while Study Hours might only range 0 to 10. Paste the code below to standardize them so KNN treats each feature fairly.",
        ],
        blocks: [
          {
            lines: [
              "from sklearn.preprocessing import StandardScaler",
              "",
              "scaler = StandardScaler()",
              "X_train_scaled = scaler.fit_transform(X_train)",
              "X_test_scaled = scaler.transform(X_test)",
            ],
          },
        ],
        tip: "The Decision Tree in the next phase doesn't need scaled data — you'll train it on X_train directly. Only KNN uses the scaled versions.",
      },
    ],
  },
  {
    key: "model",
    title: "Train the ML Model",
    tag: "Phase 5 - Machine Learning",
    icon: Server,
    subtitle: "Build, train, and compare a Decision Tree and a KNN classifier.",
    hero: "bubbles",
    steps: [
      {
        num: 18,
        title: "Build a Decision Tree Classifier",
        explanation: [
          "Paste the code below into train_model.py, underneath everything else. This trains a Decision Tree — a model that learns a series of yes/no questions (like 'Is Attendance above 80%?') to arrive at Pass or Fail.",
        ],
        blocks: [{ lines: ["from sklearn.tree import DecisionTreeClassifier", "", "tree_model = DecisionTreeClassifier(random_state=42)", "tree_model.fit(X_train, y_train)"] }],
      },
      {
        num: 19,
        title: "Build a KNN Classifier",
        explanation: [
          "Now paste the code below to train a K-Nearest Neighbors model using the scaled features from step 17. It starts with 5 neighbors — you can experiment with other numbers later to see if results improve.",
        ],
        blocks: [{ lines: ["from sklearn.neighbors import KNeighborsClassifier", "", "knn_model = KNeighborsClassifier(n_neighbors=5)", "knn_model.fit(X_train_scaled, y_train)"] }],
      },
      {
        num: 20,
        title: "Evaluate Both Models",
        explanation: [
          "Paste the code below to see how each model performs on the test data it has never seen. Save the file, then open your terminal (with (venv) still active) and run the command underneath to see the printed results.",
        ],
        blocks: [
          {
            caption: "Add to model/train_model.py",
            lines: [
              "from sklearn.metrics import accuracy_score, confusion_matrix",
              "",
              "tree_preds = tree_model.predict(X_test)",
              "knn_preds = knn_model.predict(X_test_scaled)",
              "",
              "print('Decision Tree Accuracy:', accuracy_score(y_test, tree_preds))",
              "print('KNN Accuracy:', accuracy_score(y_test, knn_preds))",
              "print(confusion_matrix(y_test, tree_preds))",
            ],
          },
          { caption: "Run it", lines: ["python model/train_model.py"] },
        ],
      },
      {
        num: 21,
        title: "Choose the Best Model",
        explanation: [
          "Look at the two accuracy numbers printed in your terminal from the previous step. Whichever model scored higher — and whose confusion matrix looks more balanced rather than guessing one outcome every time — is the one you'll carry forward into the next steps.",
          "There's nothing to paste here — just decide, based on your printed numbers, whether tree_model or knn_model wins.",
        ],
      },
      {
        num: 22,
        title: "Save the Trained Model",
        explanation: [
          "Use Python's built-in pickle library to save your chosen model to a file, so your app can load it instantly later instead of retraining every time it starts. Paste the code below, replacing tree_model with knn_model if that's the one you picked in the previous step.",
        ],
        blocks: [{ caption: "Add to model/train_model.py", lines: ["import pickle", "", "with open('model/student_model.pkl', 'wb') as f:", "    pickle.dump(tree_model, f)"] }],
        tip: "If you chose KNN, also save the scaler the same way (pickle.dump(scaler, f) into a second file) since your app will need it to scale new inputs the same way.",
      },
    ],
  },
  {
    key: "deploy",
    title: "Build & Deploy the App",
    tag: "Phase 6 - Ship It",
    icon: Rocket,
    subtitle: "Wrap the trained model in a simple interface so anyone can get a live prediction.",
    hero: "rocket",
    steps: [
      {
        num: 23,
        title: "Build a Simple Input Form",
        explanation: [
          "Streamlit is the fastest way to turn a plain Python script into a working web form. With (venv) active in your terminal, paste the command below to install it.",
          "Then right-click the app folder, choose New File, name it app.py, and paste the second block into it to create a title and three number inputs for Study Hours, Attendance, and Previous Marks.",
        ],
        blocks: [
          { caption: "Install Streamlit", lines: ["pip install streamlit"] },
          {
            caption: "app/app.py",
            lines: [
              "import streamlit as st",
              "",
              "st.title('Student Performance Predictor')",
              "study_hours = st.number_input('Study Hours', 0.0, 24.0, 4.0)",
              "attendance = st.number_input('Attendance (%)', 0.0, 100.0, 75.0)",
              "previous_marks = st.number_input('Previous Marks', 0.0, 100.0, 60.0)",
            ],
          },
        ],
      },
      {
        num: 24,
        title: "Load the Saved Model & Show the Prediction",
        explanation: [
          "At the very top of app/app.py, paste the first block below to load the pickle file you saved in step 22, so the app has your trained model ready to use.",
          "Then, at the bottom of the file, paste the second block. It adds a Predict button that runs the model on whatever the user typed in and displays Pass or Fail clearly on screen.",
        ],
        blocks: [
          { caption: "Add at the top of app/app.py", lines: ["import pickle", "", "with open('model/student_model.pkl', 'rb') as f:", "    model = pickle.load(f)"] },
          {
            caption: "Add at the bottom of app/app.py",
            lines: [
              "if st.button('Predict'):",
              "    result = model.predict([[study_hours, attendance, previous_marks]])",
              "    if result[0] == 1:",
              "        st.success('Prediction: Pass ✅')",
              "    else:",
              "        st.error('Prediction: Fail ❌')",
            ],
          },
        ],
      },
      {
        num: 25,
        title: "Test & Deploy",
        explanation: [
          "Run your app locally first to make sure everything works end to end. Paste the command below into your terminal (with (venv) active) — it opens the app automatically in your browser.",
          "Once you're happy with it, push your final code to GitHub using the second block. To put it online for others, create a free account at streamlit.io/cloud, connect the GitHub repository you pushed to, point it at app/app.py, and click Deploy.",
        ],
        blocks: [
          { caption: "Run locally", lines: ["streamlit run app/app.py"] },
          { caption: "Push your final code", lines: ["git add .", 'git commit -m "Add Streamlit app"', "git push"] },
        ],
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
        <span className="acc-term-label">Student-Performance-Predictor — zsh</span>
      </div>
      <div className="acc-term-body">
        <div className="acc-term-line">
          <span>$</span> python --version
        </div>
        <div className="acc-term-line">
          <span>$</span> pip install pandas scikit-learn
        </div>
        <div className="acc-term-line">
          <span>$</span> git init
        </div>
      </div>
    </div>
  );
}

function BoxesHero() {
  return (
    <div className="acc-boxes">
      <div className="acc-box">
        <Database size={20} color="#fff" />
        <span className="acc-box-label">CSV Data</span>
      </div>
      <span className="acc-box-arrow">→</span>
      <div className="acc-box acc-box-alt">
        <FolderTree size={20} color="#fff" />
        <span className="acc-box-label">Pandas DataFrame</span>
      </div>
    </div>
  );
}

function ScoreboardHero() {
  const stats = ["Nulls", "Duplicates", "Outliers", "Correlation", "Charts"];
  return (
    <div className="acc-scoreboard">
      {stats.map((m) => (
        <div key={m} className="acc-score-crate">
          <BrainCircuit size={16} color={colors.tealDeep} />
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
          Study Hours: 6, Attendance: 88%, Previous Marks: 74
        </span>
      </div>
      <div className="acc-bubble-row">
        <span className="acc-bubble acc-bubble-ai" style={{ animationDelay: "0.25s" }}>
          Prediction: Pass ✅ (Decision Tree, 91% test accuracy)
        </span>
      </div>
    </div>
  );
}

function FlowHero() {
  const nodes = ["Raw Data", "Encode Label", "Select Features", "Train/Test Split", "Scale"];
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

/* ------------------------------- MAIN APP ------------------------------- */

export default function StudentPerformancePredictorGuide() {
  const router = useRouter();
  const [current, setCurrent] = useState<number>(0); // 0..PHASES.length-1
  const [completedPhases, setCompletedPhases] = useState<boolean[]>(PHASES.map(() => false));
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [labCompleted, setLabCompleted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const fireToast = (text?: string) => {
    const msg = text || ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
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

  // Same pattern as AI Foundations Lab / ML Without Math Lab / Computer Vision
  // Lab / Generative AI Lab / Mission 1: when the final phase's "Finish Guide"
  // button is pressed, mark this exact topic complete (slug MUST match the
  // labPath registered in page.tsx: "/mission-2") and show the completion
  // overlay — no separate certificate page.
  const finishLab = () => {
    markPhaseComplete(PHASES.length - 1);
    markLabTopicComplete("mission-2");
    setLabCompleted(true);
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
          <h1 className="acc-h1">Student Performance Predictor</h1>
          <p className="acc-subtitle">
            Build an app where users enter Study Hours, Attendance, and Previous Marks — and a trained
            Decision Tree or KNN model predicts Pass or Fail. Every step below reads like a tutorial: what to
            do, where to click, and the exact commands or code to copy and paste.
          </p>
        </div>

        <StampBar current={current} completedPhases={completedPhases} onJump={goTo} />

        {(() => {
          const phase = PHASES[current];
          const allChecked = isPhaseFullyChecked(current);
          const isLastPhase = current === PHASES.length - 1;
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
                nextLabel={isLastPhase ? "Finish & Unlock Next" : "Continue"}
                onNext={() => {
                  if (isLastPhase) {
                    finishLab();
                  } else {
                    markPhaseComplete(current);
                    fireToast();
                    setCurrent(current + 1);
                  }
                }}
              />
            </StageShell>
          );
        })()}

        {labCompleted && (
          <div className="completion-overlay">
            <div className="completion-modal">
              <div className="completion-icon">🎉</div>

              <h2>Mission Completed!</h2>

              <p>
                Congratulations! You&apos;ve built a complete end-to-end machine learning app —
                the <strong>Student Performance Predictor</strong> — from raw CSV data all the
                way to a working Pass/Fail predictor.
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
      </div>
    </div>
  );
}