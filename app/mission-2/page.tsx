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

  .acc-container { max-width: 900px; margin: 0 auto; position: relative; z-index: 1; }

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

  .acc-item-list { display: flex; flex-direction: column; gap: 12px; }
  .acc-item-card {
    border-radius: 18px; padding: 16px 18px; background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: border-color 0.2s ease, box-shadow 0.2s ease;
    display: flex; align-items: flex-start; gap: 12px; cursor: pointer;
  }
  .acc-item-card:hover { border-color: ${colors.borderActive}; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .acc-item-card.acc-item-done { border-color: rgba(6,182,212,0.35); background: rgba(6,182,212,0.05); }
  .acc-item-check { flex-shrink: 0; margin-top: 2px; }
  .acc-item-body { flex: 1; }
  .acc-item-num { font-size: 11px; font-weight: 800; letter-spacing: 0.04em; color: ${colors.goldDeep}; text-transform: uppercase; }
  .acc-item-title { font-size: 15px; font-weight: 700; color: ${colors.ink}; margin: 3px 0 6px 0; }
  .acc-item-details { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 3px; }
  .acc-item-details li { font-size: 13px; color: ${colors.inkSoft}; line-height: 1.55; }

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
    font-size: 14px; font-weight: 700; color: #fff;
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

interface StepItem {
  num: number;
  title: string;
  details: string[];
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
        details: [
          "Python 3.11 or above, Visual Studio Code, Git, Node.js",
          "PostgreSQL (optional for advanced features)",
          "Docker Desktop (used later during deployment)",
          "Verify with: python --version, git --version, node --version",
        ],
      },
      {
        num: 2,
        title: "Create Your Project Folder",
        details: ["Create a folder named AI-Career-Coach", "Open the folder inside VS Code"],
      },
      {
        num: 3,
        title: "Create the Project Structure",
        details: [
          "backend/, frontend/, datasets/, uploads/, models/, utils/, static/, templates/",
          "README.md and requirements.txt at the root",
        ],
      },
      {
        num: 4,
        title: "Create a Python Virtual Environment",
        details: ["Create it, activate it, and verify it's active"],
      },
      {
        num: 5,
        title: "Install Required Python Libraries",
        details: [
          "FastAPI, Uvicorn, Pandas, NumPy, Scikit-learn, Matplotlib",
          "TensorFlow or PyTorch, OpenCV, EasyOCR or Tesseract",
          "Transformers, LangChain (optional), Docker dependencies",
          "Update your requirements.txt",
        ],
      },
      {
        num: 6,
        title: "Initialize Git",
        details: ["Init Git, make your first commit", "Create a GitHub repository and push your project"],
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
        details: ["Create your first FastAPI application", "Run the server and visit http://localhost:8000", "Confirm your API is working"],
      },
      {
        num: 8,
        title: "Build the Frontend",
        details: [
          "Let users upload resumes, enter job descriptions, and view AI responses",
          "Connect the interface to the backend",
        ],
      },
      {
        num: 9,
        title: "Resume Upload Feature",
        details: ["Allow PDF, DOCX, and image resumes", "Store uploaded files inside the uploads folder"],
      },
      {
        num: 10,
        title: "Extract Resume Content",
        details: [
          "Extract text from PDF files, Word files, and images using OCR",
          "Display the extracted text on the screen",
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
        details: [
          "Collect resumes into a CSV: skills, education, experience, projects, certifications, job role",
          "Clean the dataset, handle missing values, remove duplicates",
        ],
      },
      {
        num: 12,
        title: "Explore the Dataset",
        details: [
          "Count common skills, visualize experience distribution",
          "Analyze education levels, find the most common job roles",
          "Create meaningful charts with Pandas and Matplotlib",
        ],
      },
      {
        num: 13,
        title: "Feature Engineering",
        details: [
          "Convert resume info into machine-readable features",
          "Number of skills, years of experience, degree level, certification count",
        ],
      },
      {
        num: 14,
        title: "Build Your First ML Model",
        details: ["Train Decision Tree, Random Forest, KNN, Logistic Regression, and SVM", "Predict the most suitable job role"],
      },
      {
        num: 15,
        title: "Evaluate the Models",
        details: [
          "Split into training and testing sets",
          "Measure accuracy, precision, recall, F1 score, and confusion matrix",
          "Compare all models and select the best one",
        ],
      },
      {
        num: 16,
        title: "Improve the Model",
        details: ["Apply cross validation and hyperparameter tuning", "Retrain and save the final model"],
      },
      {
        num: 17,
        title: "Build a Neural Network",
        details: [
          "Using TensorFlow or PyTorch, predict suitable job roles",
          "Compare its performance with traditional ML models",
        ],
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
        details: ["Allow scanned resume uploads", "Extract text automatically using OCR and display it"],
      },
      {
        num: 19,
        title: "Add Resume Understanding (NLP)",
        details: [
          "Extract skills, education, experience, certifications, and contact details",
          "Generate structured resume information",
        ],
      },
      {
        num: 20,
        title: "Add AI Resume Suggestions",
        details: [
          "Integrate an LLM to generate resume improvements",
          "ATS optimization suggestions, missing skills, better project descriptions",
        ],
      },
      {
        num: 21,
        title: "Generate Cover Letters",
        details: ["Use the uploaded resume and selected job description to generate a personalized cover letter"],
      },
      {
        num: 22,
        title: "Build an Interview Question Generator",
        details: ["Analyze the resume and generate questions based on skills, projects, and experience", "Display model answers"],
      },
      {
        num: 23,
        title: "Build an AI Career Agent",
        details: [
          "One agent that reads the resume, extracts info, finds suitable jobs",
          "Suggests improvements, generates a cover letter, creates interview questions",
          "Recommends learning resources — all with a single click",
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
        details: [
          "Upload Resume → Extract Text → Clean Data → Analyze Resume",
          "Predict Job Role → Generate Resume Suggestions → Create Cover Letter",
          "Generate Interview Questions → Career Roadmap",
        ],
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
        details: [
          "Dockerize the project and create API documentation",
          "Push the latest code to GitHub",
          "Deploy the backend, deploy the frontend, test the live application",
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
            letters, and preps candidates for interviews — from setup to deployment, in 25 steps.
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
                          <ul className="acc-item-details">
                            {s.details.map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
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