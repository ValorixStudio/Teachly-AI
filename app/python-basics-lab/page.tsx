"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { markLabTopicComplete } from "../page";
import {
  Code2,
  RotateCw,
  Boxes,
  ListOrdered,
  Database,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Play,
  Loader2,
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

/* ---------------------------- IN-BROWSER PYTHON RUNTIME ----------------------------
   Loads Pyodide (a real Python interpreter compiled to WebAssembly) from a CDN,
   once, and reuses the same instance for every "Run Code" click across all stages.
------------------------------------------------------------------------------------ */
declare global {
  interface Window {
    loadPyodide?: (config?: Record<string, unknown>) => Promise<any>;
  }
}

let pyodideLoadPromise: Promise<any> | null = null;

function loadPyodideRuntime(): Promise<any> {
  if (pyodideLoadPromise) return pyodideLoadPromise;
  pyodideLoadPromise = new Promise((resolve, reject) => {
    const start = () => {
      if (!window.loadPyodide) {
        reject(new Error("Pyodide failed to initialize."));
        return;
      }
      window
        .loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" })
        .then(resolve)
        .catch(reject);
    };
    if (window.loadPyodide) {
      start();
      return;
    }
    const existing = document.getElementById("pyodide-script");
    if (existing) {
      existing.addEventListener("load", start);
      existing.addEventListener("error", () => reject(new Error("Failed to load Python runtime.")));
      return;
    }
    const script = document.createElement("script");
    script.id = "pyodide-script";
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
    script.async = true;
    script.onload = start;
    script.onerror = () => reject(new Error("Failed to load Python runtime."));
    document.body.appendChild(script);
  });
  return pyodideLoadPromise;
}

async function runPythonSnippet(code: string): Promise<{ output: string; isError: boolean }> {
  try {
    const pyodide = await loadPyodideRuntime();
    let captured = "";
    pyodide.setStdout({
      batched: (s: string) => {
        captured += s + "\n";
      },
    });
    pyodide.setStderr({
      batched: (s: string) => {
        captured += s + "\n";
      },
    });
    try {
      await pyodide.runPythonAsync(code);
      return { output: captured.trim() || "(no output)", isError: false };
    } catch (err: any) {
      const message = (err && err.message) || String(err);
      // Trim Pyodide's internal traceback noise down to the last, most useful line.
      const lines = message.split("\n").filter(Boolean);
      const friendly = lines[lines.length - 1] || message;
      return { output: `${captured}${friendly}`.trim(), isError: true };
    }
  } catch (err: any) {
    return {
      output: "Couldn't load the Python runtime. Check your connection and try again.",
      isError: true,
    };
  }
}

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

  /* -------------------- Stage hero illustrations, driven by real code content -------------------- */
  .aiel-hero { display: flex; align-items: center; justify-content: center; margin-bottom: 22px; min-height: 74px; }

  /* Variables: live "memory boxes" watch panel */
  .aiel-mem-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .aiel-mem-box {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 16px; border-radius: 12px;
    background: ${colors.cardAlt}; border: 1px solid ${colors.border}; min-width: 64px;
    opacity: 0; animation: aiel-hero-in 0.4s ease forwards; transition: transform 0.2s ease;
  }
  .aiel-mem-label { font-family: 'Menlo', 'Consolas', monospace; font-size: 11px; font-weight: 700; color: ${colors.muted}; }
  .aiel-mem-value { font-family: 'Menlo', 'Consolas', monospace; font-size: 15px; font-weight: 800; color: ${colors.ink}; }
  .aiel-mem-active {
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); border-color: transparent;
    box-shadow: 0 6px 18px rgba(99,102,241,0.35); transform: translateY(-3px);
  }
  .aiel-mem-active .aiel-mem-label { color: rgba(255,255,255,0.8); }
  .aiel-mem-active .aiel-mem-value { color: #fff; }
  @keyframes aiel-hero-in { from { opacity: 0; transform: translateY(6px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* Loops: iteration track */
  .aiel-loop-track { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }
  .aiel-loop-step {
    width: 38px; height: 38px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 1px solid ${colors.border}; font-family: 'Menlo', 'Consolas', monospace;
    font-weight: 800; font-size: 13px; color: ${colors.ink};
    opacity: 0; animation: aiel-hero-in 0.4s ease forwards;
  }
  .aiel-loop-step-active {
    background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); border-color: transparent; color: #fff;
    box-shadow: 0 6px 16px rgba(6,182,212,0.35); transform: scale(1.15);
  }
  .aiel-hero-arrow { color: ${colors.muted}; font-size: 14px; }

  /* Functions: input -> machine -> output */
  .aiel-fn-machine { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .aiel-fn-chip {
    padding: 9px 16px; border-radius: 999px; background: ${colors.cardAlt}; border: 1px solid ${colors.border};
    font-family: 'Menlo', 'Consolas', monospace; font-size: 12.5px; font-weight: 700; color: ${colors.ink};
  }
  .aiel-fn-output-none { border-style: dashed; border-color: ${colors.muted}; color: ${colors.muted}; font-style: italic; background: transparent; }
  .aiel-fn-box {
    display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 12px 18px; border-radius: 16px;
    background: linear-gradient(135deg, ${colors.purple}, ${colors.purpleDeep}); box-shadow: 0 8px 20px rgba(139,92,246,0.35); color: #fff;
  }
  .aiel-fn-box-name { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 13px; }

  /* Lists: indexed array */
  .aiel-array-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
  .aiel-array-box { position: relative; display: flex; flex-direction: column; align-items: center; }
  .aiel-array-index { font-size: 10px; color: ${colors.muted}; font-family: 'Menlo', 'Consolas', monospace; margin-bottom: 3px; font-weight: 700; }
  .aiel-array-cell {
    position: relative; min-width: 48px; padding: 10px 8px; border-radius: 10px; background: ${colors.card};
    border: 1px solid ${colors.border}; font-family: 'Menlo', 'Consolas', monospace; font-weight: 700; font-size: 12px;
    text-align: center; color: ${colors.ink}; transition: transform 0.2s ease;
  }
  .aiel-array-cell-active {
    background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep}); border-color: transparent; color: #fff;
    box-shadow: 0 6px 16px rgba(244,63,94,0.35); transform: translateY(-3px);
  }
  .aiel-array-cell-new { border-style: dashed; border-color: ${colors.tealDeep}; animation: aiel-hero-in 0.5s ease; }
  .aiel-array-badge {
    position: absolute; top: -11px; right: -8px; background: ${colors.tealDeep}; color: #fff; font-size: 9px;
    font-weight: 800; padding: 2px 6px; border-radius: 999px; letter-spacing: 0.02em;
  }

  /* Dictionaries: key -> value map */
  .aiel-dict-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .aiel-dict-pair { position: relative; display: flex; align-items: stretch; }
  .aiel-dict-key {
    padding: 8px 12px; border-radius: 10px 0 0 10px; background: ${colors.cardAlt}; border: 1px solid ${colors.border}; border-right: none;
    font-family: 'Menlo', 'Consolas', monospace; font-weight: 700; font-size: 12px; color: ${colors.goldDeep};
    display: flex; align-items: center;
  }
  .aiel-dict-value {
    padding: 8px 12px; border-radius: 0 10px 10px 0; background: ${colors.cardAlt}; border: 1px solid ${colors.border};
    border-left: none; font-family: 'Menlo', 'Consolas', monospace; font-weight: 700; font-size: 12px; color: ${colors.ink};
    display: flex; align-items: center;
  }
  .aiel-dict-pair-active .aiel-dict-key { background: linear-gradient(135deg, ${colors.gold}, ${colors.goldDeep}); border-color: transparent; color: #fff; }
  .aiel-dict-pair-active .aiel-dict-value { background: rgba(99,102,241,0.08); border-color: ${colors.borderActive}; color: ${colors.goldDeep}; font-weight: 800; }
  .aiel-dict-pair-new { animation: aiel-hero-in 0.5s ease; }
  .aiel-dict-fallback .aiel-dict-key { border-style: dashed; border: 1px dashed ${colors.coralDeep}; background: transparent; color: ${colors.coralDeep}; }
  .aiel-dict-fallback .aiel-dict-value { font-style: italic; color: ${colors.coralDeep}; }

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

  .aiel-run-row { display: flex; align-items: center; gap: 10px; margin: -4px 0 14px 0; }
  .aiel-run-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px;
    font-size: 12.5px; font-weight: 700; color: ${colors.tealDeep};
    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25);
    transition: transform 0.15s ease, background 0.15s ease;
  }
  .aiel-run-btn:hover:not([disabled]) { background: rgba(6,182,212,0.18); transform: translateY(-1px); }
  .aiel-run-btn:active:not([disabled]) { transform: translateY(0); }
  .aiel-run-btn[disabled] { opacity: 0.6; cursor: wait; }
  .aiel-run-hint { font-size: 11.5px; color: ${colors.muted}; }
  .aiel-run-output {
    display: flex; flex-direction: column; gap: 4px; margin: 0 0 14px 0; padding: 10px 14px;
    border-radius: 12px; background: ${colors.cardAlt}; border: 1px solid ${colors.border};
    animation: aiel-card-in 0.3s ease forwards;
  }
  .aiel-run-output-label {
    font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; color: ${colors.muted};
  }
  .aiel-run-output-text {
    font-family: 'Menlo', 'Consolas', monospace; font-size: 12.5px; color: ${colors.ink};
    margin: 0; white-space: pre-wrap; word-break: break-word;
  }
  .aiel-run-output-error { color: ${colors.coralDeep}; }
  .aiel-spin { animation: aiel-spin 0.8s linear infinite; }
  @keyframes aiel-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .aiel-choice-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .aiel-choice-btn {
    flex: 1; font-size: 12.5px; font-weight: 700; padding: 13px 10px; border-radius: 14px; color: #000;
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
    font-size: 14px; font-weight: 700; color: #000;
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .aiel-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .aiel-nav-next:not([disabled]):active { transform: translateY(1px); }
  .aiel-nav-next[disabled], .aiel-nav-back[disabled] { opacity: 0.4; cursor: default; background: ${colors.cardAlt}; color: ${colors.muted}; box-shadow: none; }

  /* ---- Completion overlay (matches AI Foundations Lab / Computer Vision Lab) ---- */
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

/* ---------------------------- TYPES ---------------------------- */

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

interface CodeItem {
  id: string;
  code: string;
  question: string;
  options: string[];
  answer: string;
  explain: string;
  // Optional metadata used by content-linked hero illustrations:
  memory?: { label: string; value: string }[];
  highlightLabel?: string;
  steps?: string[];
  highlightStep?: number;
  fnName?: string;
  fnArgs?: string;
  fnReturns?: string;
  listValues?: string[];
  highlightIndex?: number;
  highlightFromEnd?: boolean;
  appended?: boolean;
  countMode?: boolean;
  dictEntries?: [string, string][];
  highlightKey?: string;
  addedKey?: string;
  fallback?: { key: string; value: string };
}

type AnswerMap = Record<string, string>;

/* ---------------------------- CONTENT DATA ---------------------------- */

const STAGE_META: StageMetaItem[] = [
  { key: "variables", title: "Variables", icon: Code2, tag: "Stage 1 - What Will It Print?" },
  { key: "loops", title: "Loops", icon: RotateCw, tag: "Stage 2 - Trace the Loop" },
  { key: "functions", title: "Functions", icon: Boxes, tag: "Stage 3 - What Comes Back?" },
  { key: "lists", title: "Lists", icon: ListOrdered, tag: "Stage 4 - Read the List" },
  { key: "dictionaries", title: "Dictionaries", icon: Database, tag: "Stage 5 - Look It Up" },
];

const VARIABLE_ITEMS: CodeItem[] = [
  { id: "v1", code: "x = 5\ny = x + 3\nprint(y)", question: "What does this print?", options: ["8", "5", "3"], answer: "8", explain: "y takes x's value (5) and adds 3 to it, so y becomes 8.", memory: [{ label: "x", value: "5" }, { label: "y", value: "8" }], highlightLabel: "y" },
  { id: "v2", code: "name = 'Ravi'\nname = name + ' Kumar'\nprint(name)", question: "What does this print?", options: ["Ravi Kumar", "Ravi", "Kumar"], answer: "Ravi Kumar", explain: "Reassigning name to itself plus ' Kumar' overwrites the old value with the combined text.", memory: [{ label: "name", value: '"Ravi Kumar"' }], highlightLabel: "name" },
  { id: "v3", code: "a = 10\nb = a\na = 20\nprint(b)", question: "What does this print?", options: ["10", "20", "Error"], answer: "10", explain: "b copied a's value (10) at that moment -- changing a afterward doesn't change b.", memory: [{ label: "a", value: "20" }, { label: "b", value: "10" }], highlightLabel: "b" },
  { id: "v4", code: "score = 7\nscore += 3\nprint(score)", question: "What does this print?", options: ["10", "7", "73"], answer: "10", explain: "The += shortcut adds 3 to the existing value of score, giving 10.", memory: [{ label: "score", value: "10" }], highlightLabel: "score" },
  { id: "v5", code: "temp = '25'\ntemp = int(temp) + 5\nprint(temp)", question: "What does this print?", options: ["30", "255", "Error"], answer: "30", explain: "int(temp) converts the text '25' into the number 25 before the addition happens.", memory: [{ label: "temp", value: "30" }], highlightLabel: "temp" },
];

const LOOP_ITEMS: CodeItem[] = [
  { id: "l1", code: "for i in range(3):\n    print(i)", question: "How many lines does this print?", options: ["3", "2", "4"], answer: "3", explain: "range(3) produces 0, 1, and 2 -- exactly three values, so the loop body runs three times.", steps: ["0", "1", "2"] },
  { id: "l2", code: "total = 0\nfor n in [1, 2, 3, 4]:\n    total += n\nprint(total)", question: "What does this print?", options: ["10", "4", "24"], answer: "10", explain: "The loop adds each number in the list to total: 1 + 2 + 3 + 4 = 10.", steps: ["1", "3", "6", "10"], highlightStep: 3 },
  { id: "l3", code: "count = 0\nwhile count < 3:\n    count += 1\nprint(count)", question: "What does this print?", options: ["3", "2", "This never stops"], answer: "3", explain: "The loop keeps adding 1 until count is no longer less than 3, stopping exactly at 3.", steps: ["1", "2", "3"], highlightStep: 2 },
  { id: "l4", code: "for i in range(1, 5):\n    print(i)", question: "What is the first number printed?", options: ["1", "0", "5"], answer: "1", explain: "range(1, 5) starts counting from 1, not 0, and stops before it reaches 5.", steps: ["1", "2", "3", "4"], highlightStep: 0 },
  { id: "l5", code: "for letter in 'cat':\n    print(letter)", question: "How many times does the loop run?", options: ["3", "1", "4"], answer: "3", explain: "Looping over a string visits each character once -- 'c', 'a', 't' -- three characters total.", steps: ["c", "a", "t"] },
];

const FUNCTION_ITEMS: CodeItem[] = [
  { id: "f1", code: "def add(a, b):\n    return a + b\n\nprint(add(4, 5))", question: "What does this print?", options: ["9", "45", "Error"], answer: "9", explain: "The function adds its two inputs together and returns 4 + 5 = 9.", fnName: "add", fnArgs: "4, 5", fnReturns: "9" },
  { id: "f2", code: "def greet(name):\n    return 'Hi ' + name\n\nprint(greet('Sam'))", question: "What does this print?", options: ["Hi Sam", "name", "Hi name"], answer: "Hi Sam", explain: "The function substitutes the actual argument 'Sam' wherever name appears inside it.", fnName: "greet", fnArgs: "'Sam'", fnReturns: '"Hi Sam"' },
  { id: "f3", code: "def square(n):\n    return n * n\n\nprint(square(6))", question: "What does this print?", options: ["36", "12", "6"], answer: "36", explain: "square multiplies its input by itself: 6 times 6 equals 36.", fnName: "square", fnArgs: "6", fnReturns: "36" },
  { id: "f4", code: "def double(x):\n    x = x * 2\n\nresult = double(5)\nprint(result)", question: "What does this print?", options: ["None", "10", "5"], answer: "None", explain: "The function never uses return, so it hands back nothing at all -- even though it computed a value inside.", fnName: "double", fnArgs: "5", fnReturns: "None" },
  { id: "f5", code: "def max_of(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(max_of(3, 9))", question: "What does this print?", options: ["9", "3", "Error"], answer: "9", explain: "Since 3 is not greater than 9, the function falls through to the second return, which sends back 9.", fnName: "max_of", fnArgs: "3, 9", fnReturns: "9" },
];

const LIST_ITEMS: CodeItem[] = [
  { id: "li1", code: "fruits = ['apple', 'banana', 'cherry']\nprint(fruits[0])", question: "What does this print?", options: ["apple", "banana", "cherry"], answer: "apple", explain: "List positions start counting from 0, so index 0 points to the very first item, 'apple'.", listValues: ["apple", "banana", "cherry"], highlightIndex: 0 },
  { id: "li2", code: "nums = [10, 20, 30]\nnums.append(40)\nprint(nums)", question: "What does this print?", options: ["[10, 20, 30, 40]", "[40, 10, 20, 30]", "[10, 20, 30]"], answer: "[10, 20, 30, 40]", explain: "append() always adds the new item to the end of the list, never the beginning.", listValues: ["10", "20", "30", "40"], appended: true },
  { id: "li3", code: "letters = ['a', 'b', 'c']\nprint(letters[-1])", question: "What does this print?", options: ["c", "a", "Error"], answer: "c", explain: "A negative index counts backward from the end, so -1 always refers to the last item.", listValues: ["a", "b", "c"], highlightFromEnd: true },
  { id: "li4", code: "nums = [1, 2, 3, 4, 5]\nprint(len(nums))", question: "What does this print?", options: ["5", "4", "6"], answer: "5", explain: "len() counts every item in the list -- there are five numbers here.", listValues: ["1", "2", "3", "4", "5"], countMode: true },
  { id: "li5", code: "nums = [5, 1, 4, 2]\nnums.sort()\nprint(nums)", question: "What does this print?", options: ["[1, 2, 4, 5]", "[5, 1, 4, 2]", "[2, 4, 1, 5]"], answer: "[1, 2, 4, 5]", explain: "sort() rearranges the list's items into ascending order, in place.", listValues: ["1", "2", "4", "5"] },
];

const DICT_ITEMS: CodeItem[] = [
  { id: "d1", code: "student = {'name': 'Asha', 'age': 15}\nprint(student['name'])", question: "What does this print?", options: ["Asha", "name", "15"], answer: "Asha", explain: "Using a key inside square brackets looks up its matching value -- here 'name' maps to 'Asha'.", dictEntries: [["name", '"Asha"'], ["age", "15"]], highlightKey: "name" },
  { id: "d2", code: "scores = {'math': 90, 'science': 85}\nscores['science'] = 95\nprint(scores['science'])", question: "What does this print?", options: ["95", "85", "Error"], answer: "95", explain: "Assigning to an existing key overwrites its old value with the new one.", dictEntries: [["math", "90"], ["science", "95"]], highlightKey: "science" },
  { id: "d3", code: "profile = {'city': 'Pune'}\nprofile['country'] = 'India'\nprint(profile)", question: "What does this print?", options: ["{'city': 'Pune', 'country': 'India'}", "{'country': 'India'}", "{'city': 'Pune'}"], answer: "{'city': 'Pune', 'country': 'India'}", explain: "Assigning a brand-new key adds it to the dictionary instead of replacing anything already there.", dictEntries: [["city", '"Pune"'], ["country", '"India"']], addedKey: "country" },
  { id: "d4", code: "data = {'a': 1, 'b': 2}\nprint(len(data))", question: "What does this print?", options: ["2", "1", "4"], answer: "2", explain: "len() on a dictionary counts its key-value pairs -- there are two here.", dictEntries: [["a", "1"], ["b", "2"]], countMode: true },
  { id: "d5", code: "user = {'name': 'Kabir'}\nprint(user.get('age', 'Unknown'))", question: "What does this print?", options: ["Unknown", "None", "Error"], answer: "Unknown", explain: ".get() returns the fallback value you provide when the key doesn't exist, instead of crashing the program.", dictEntries: [["name", '"Kabir"']], fallback: { key: "age", value: '"Unknown"' } },
];

const POSITIVE_PHRASES = ["Nice! 🎉", "You got it!", "Sharp eye! ✨", "Exactly right!", "Great instinct!"];
const GENTLE_PHRASES = ["Good try! 🤔", "Almost there!", "Nice guess -- see why below", "Close one!"];

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
        {nextLabel || "Next"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* -------- Stage hero illustrations, each one reflecting the active (first unanswered) question -------- */

function MemoryBoxesHero({ memory, highlightLabel }: { memory?: { label: string; value: string }[]; highlightLabel?: string }) {
  if (!memory || memory.length === 0) return null;
  return (
    <div className="aiel-mem-row">
      {memory.map((m, i) => (
        <div
          key={m.label}
          className={`aiel-mem-box ${m.label === highlightLabel ? "aiel-mem-active" : ""}`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <span className="aiel-mem-label">{m.label}</span>
          <span className="aiel-mem-value">{m.value}</span>
        </div>
      ))}
    </div>
  );
}

function LoopTrackHero({ steps, highlightStep }: { steps?: string[]; highlightStep?: number }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="aiel-loop-track">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div
            className={`aiel-loop-step ${i === highlightStep ? "aiel-loop-step-active" : ""}`}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            {s}
          </div>
          {i < steps.length - 1 && <span className="aiel-hero-arrow">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function FunctionMachineHero({ fnName, args, returns }: { fnName?: string; args?: string; returns?: string }) {
  if (!fnName) return null;
  const isNone = returns === "None";
  return (
    <div className="aiel-fn-machine">
      <span className="aiel-fn-chip">{args}</span>
      <span className="aiel-hero-arrow">→</span>
      <div className="aiel-fn-box">
        <Boxes size={20} color="#fff" />
        <span className="aiel-fn-box-name">{fnName}()</span>
      </div>
      <span className="aiel-hero-arrow">→</span>
      <span className={`aiel-fn-chip ${isNone ? "aiel-fn-output-none" : ""}`}>{returns}</span>
    </div>
  );
}

function ArrayHero({
  values,
  highlightIndex,
  highlightFromEnd,
  appended,
  countMode,
}: {
  values?: string[];
  highlightIndex?: number;
  highlightFromEnd?: boolean;
  appended?: boolean;
  countMode?: boolean;
}) {
  if (!values || values.length === 0) return null;
  const lastIdx = values.length - 1;
  return (
    <div className="aiel-array-row">
      {values.map((v, i) => {
        const isActive = countMode || i === highlightIndex || (highlightFromEnd && i === lastIdx);
        const isNew = appended && i === lastIdx;
        const idxLabel = highlightFromEnd && i === lastIdx ? "-1" : String(i);
        return (
          <div key={i} className="aiel-array-box">
            <span className="aiel-array-index">{idxLabel}</span>
            <div className={`aiel-array-cell ${isActive ? "aiel-array-cell-active" : ""} ${isNew ? "aiel-array-cell-new" : ""}`}>
              {v}
              {isNew && <span className="aiel-array-badge">new</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DictMapHero({
  entries,
  highlightKey,
  addedKey,
  fallback,
  countMode,
}: {
  entries?: [string, string][];
  highlightKey?: string;
  addedKey?: string;
  fallback?: { key: string; value: string };
  countMode?: boolean;
}) {
  if (!entries || entries.length === 0) return null;
  return (
    <div className="aiel-dict-row">
      {entries.map(([k, v]) => {
        const active = countMode || k === highlightKey;
        const isNew = k === addedKey;
        return (
          <div key={k} className={`aiel-dict-pair ${active ? "aiel-dict-pair-active" : ""} ${isNew ? "aiel-dict-pair-new" : ""}`}>
            <span className="aiel-dict-key">{k}</span>
            <span className="aiel-dict-value">
              {v}
              {isNew && <span className="aiel-array-badge">new</span>}
            </span>
          </div>
        );
      })}
      {fallback && (
        <div className="aiel-dict-pair aiel-dict-fallback">
          <span className="aiel-dict-key">{fallback.key}?</span>
          <span className="aiel-dict-value">{fallback.value}</span>
        </div>
      )}
    </div>
  );
}

interface CodeChallengeListProps {
  items: CodeItem[];
  answers: AnswerMap;
  onAnswer: (id: string, value: string) => void;
  onFeedback: (correct: boolean) => void;
}

function shuffledOptions(options: string[], answer: string, id: string): string[] {
  const answerIndex = Array.from(id).reduce((total, character) => total + character.charCodeAt(0), 0) % options.length;
  const distractors = options.filter((option) => option !== answer);
  distractors.splice(answerIndex, 0, answer);
  return distractors;
}

function CodeChallengeList({ items, answers, onAnswer, onFeedback }: CodeChallengeListProps) {
  const palette = ["aiel-choice-teal", "aiel-choice-coral", "aiel-choice-gold"];
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResults, setRunResults] = useState<Record<string, { output: string; isError: boolean }>>({});

  const handleRun = async (item: CodeItem) => {
    setRunningId(item.id);
    const result = await runPythonSnippet(item.code);
    setRunResults((prev) => ({ ...prev, [item.id]: result }));
    setRunningId(null);
  };

  return (
    <div className="aiel-item-list">
      {items.map((item, idx) => {
        const chosen = answers[item.id];
        const isCorrect = chosen === item.answer;
        const isRunning = runningId === item.id;
        const result = runResults[item.id];
        const options = shuffledOptions(item.options, item.answer, item.id);
        return (
          <div key={item.id} className="aiel-item-card" style={{ animationDelay: `${idx * 0.06}s` }}>
            <pre className="aiel-code-block">{item.code}</pre>
            <div className="aiel-run-row">
              <button className="aiel-run-btn" onClick={() => handleRun(item)} disabled={isRunning}>
                {isRunning ? <Loader2 size={14} className="aiel-spin" /> : <Play size={14} />}
                {isRunning ? "Running..." : "Run this code"}
              </button>
              <span className="aiel-run-hint">See the real output before you answer</span>
            </div>
            {result && (
              <div className="aiel-run-output">
                <span className="aiel-run-output-label">Output</span>
                <pre className={`aiel-run-output-text ${result.isError ? "aiel-run-output-error" : ""}`}>
                  {result.output}
                </pre>
              </div>
            )}
            <p className="aiel-item-question">{item.question}</p>
            {!chosen ? (
              <div className="aiel-choice-row">
                {options.map((opt, i) => (
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
                  {isCorrect ? "Correct -- " : `Actually, this prints ${item.answer}. `}
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

export default function PythonBasicsLab() {
  const router = useRouter();
  const [current, setCurrent] = useState<number>(0); // 0..4 stages
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);
  const [labCompleted, setLabCompleted] = useState(false);

  const [variableAnswers, setVariableAnswers] = useState<AnswerMap>({});
  const [loopAnswers, setLoopAnswers] = useState<AnswerMap>({});
  const [functionAnswers, setFunctionAnswers] = useState<AnswerMap>({});
  const [listAnswers, setListAnswers] = useState<AnswerMap>({});
  const [dictAnswers, setDictAnswers] = useState<AnswerMap>({});

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

  const variableDone = Object.keys(variableAnswers).length === VARIABLE_ITEMS.length;
  const loopDone = Object.keys(loopAnswers).length === LOOP_ITEMS.length;
  const functionDone = Object.keys(functionAnswers).length === FUNCTION_ITEMS.length;
  const listDone = Object.keys(listAnswers).length === LIST_ITEMS.length;
  const dictDone = Object.keys(dictAnswers).length === DICT_ITEMS.length;

  const activeVariableItem = useMemo(
    () => VARIABLE_ITEMS.find((it) => !variableAnswers[it.id]) || VARIABLE_ITEMS[VARIABLE_ITEMS.length - 1],
    [variableAnswers]
  );
  const activeLoopItem = useMemo(
    () => LOOP_ITEMS.find((it) => !loopAnswers[it.id]) || LOOP_ITEMS[LOOP_ITEMS.length - 1],
    [loopAnswers]
  );
  const activeFunctionItem = useMemo(
    () => FUNCTION_ITEMS.find((it) => !functionAnswers[it.id]) || FUNCTION_ITEMS[FUNCTION_ITEMS.length - 1],
    [functionAnswers]
  );
  const activeListItem = useMemo(
    () => LIST_ITEMS.find((it) => !listAnswers[it.id]) || LIST_ITEMS[LIST_ITEMS.length - 1],
    [listAnswers]
  );
  const activeDictItem = useMemo(
    () => DICT_ITEMS.find((it) => !dictAnswers[it.id]) || DICT_ITEMS[DICT_ITEMS.length - 1],
    [dictAnswers]
  );

  // Same pattern as the AI Foundations Lab / Computer Vision Lab: when the
  // final stage's "Finish & Unlock Next" button is pressed, mark this exact
  // topic complete (slug MUST match the labPath registered in page.tsx:
  // "/python-basics-lab") and show the completion overlay -- no separate
  // certificate page/stage.
  const finishLab = () => {
    markComplete(4);
    markLabTopicComplete("python-basics-lab");
    setLabCompleted(true);
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
          <h1 className="aiel-h1">Python Basics Lab</h1>
          <p className="aiel-subtitle">
            Read short snippets of real Python code and predict exactly what they do -- the fastest way
            to actually understand variables, loops, functions, lists, and dictionaries.
          </p>
        </div>

        <StampBar current={current} completed={completed} onJump={goTo} />

        {/* STAGE 0: Variables */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="What Will It Print?"
            subtitle="Read each snippet and predict exactly what gets printed. The glowing box shows the variable in question."
            progressLabel={`${Object.keys(variableAnswers).length}/${VARIABLE_ITEMS.length} solved`}
            hero={<MemoryBoxesHero memory={activeVariableItem?.memory} highlightLabel={activeVariableItem?.highlightLabel} />}
          >
            <CodeChallengeList
              items={VARIABLE_ITEMS}
              answers={variableAnswers}
              onAnswer={(id, value) => setVariableAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              backDisabled
              onBack={() => {}}
              nextDisabled={!variableDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: Loops */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Trace the Loop"
            subtitle="Follow each loop step by step -- the track shows the value the loop variable takes on each pass."
            progressLabel={`${Object.keys(loopAnswers).length}/${LOOP_ITEMS.length} solved`}
            hero={<LoopTrackHero steps={activeLoopItem?.steps} highlightStep={activeLoopItem?.highlightStep} />}
          >
            <CodeChallengeList
              items={LOOP_ITEMS}
              answers={loopAnswers}
              onAnswer={(id, value) => setLoopAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!loopDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: Functions */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="What Comes Back?"
            subtitle="Every function either returns a value or quietly returns nothing. Watch the machine turn input into output."
            progressLabel={`${Object.keys(functionAnswers).length}/${FUNCTION_ITEMS.length} solved`}
            hero={
              <FunctionMachineHero
                fnName={activeFunctionItem?.fnName}
                args={activeFunctionItem?.fnArgs}
                returns={activeFunctionItem?.fnReturns}
              />
            }
          >
            <CodeChallengeList
              items={FUNCTION_ITEMS}
              answers={functionAnswers}
              onAnswer={(id, value) => setFunctionAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!functionDone}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: Lists */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Read the List"
            subtitle="Indexes, appends, and sorts -- the highlighted box shows exactly which slot the question is about."
            progressLabel={`${Object.keys(listAnswers).length}/${LIST_ITEMS.length} solved`}
            hero={
              <ArrayHero
                values={activeListItem?.listValues}
                highlightIndex={activeListItem?.highlightIndex}
                highlightFromEnd={activeListItem?.highlightFromEnd}
                appended={activeListItem?.appended}
                countMode={activeListItem?.countMode}
              />
            }
          >
            <CodeChallengeList
              items={LIST_ITEMS}
              answers={listAnswers}
              onAnswer={(id, value) => setListAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!listDone}
              onNext={() => {
                markComplete(3);
                setCurrent(4);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 4: Dictionaries */}
        {current === 4 && (
          <StageShell
            tag={STAGE_META[4].tag}
            title="Look It Up"
            subtitle="Keys map to values. The highlighted pair shows exactly which key the question is looking up."
            progressLabel={`${Object.keys(dictAnswers).length}/${DICT_ITEMS.length} solved`}
            hero={
              <DictMapHero
                entries={activeDictItem?.dictEntries}
                highlightKey={activeDictItem?.highlightKey}
                addedKey={activeDictItem?.addedKey}
                fallback={activeDictItem?.fallback}
                countMode={activeDictItem?.countMode}
              />
            }
          >
            <CodeChallengeList
              items={DICT_ITEMS}
              answers={dictAnswers}
              onAnswer={(id, value) => setDictAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(3)}
              nextDisabled={!dictDone}
              nextLabel="Finish & Unlock Next"
              onNext={finishLab}
            />
          </StageShell>
        )}

        {labCompleted && (
          <div className="completion-overlay">
            <div className="completion-modal">
              <div className="completion-icon">🎉</div>

              <h2>Lab Completed!</h2>

              <p>
                Congratulations! You have successfully completed the
                <strong> Python Basics Lab</strong>.
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
