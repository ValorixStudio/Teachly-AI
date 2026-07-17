"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Wand2,
  Compass,
  Copy,
  Check,
  ExternalLink,
  MessageSquareText,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Award,
  RotateCcw,
  Globe,
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
  .pel-root {
    min-height: 100vh;
    width: 100%;
    padding: 32px 16px;
    background: radial-gradient(circle at 20% -10%, ${colors.bgSoft} 0%, ${colors.bg} 55%);
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    box-sizing: border-box;
    position: relative;
    overflow-x: hidden;
  }
  .pel-root *, .pel-root *::before, .pel-root *::after { box-sizing: border-box; }
  .pel-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .pel-root textarea { font-family: inherit; }
  .pel-root button:focus-visible, .pel-root textarea:focus-visible { outline: 3px solid ${colors.purple}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .pel-root * { transition: none !important; animation: none !important; }
  }

  /* -------------------- Decorative floating blobs -------------------- */
  .pel-blob { position: absolute; border-radius: 999px; filter: blur(70px); opacity: 0.3; pointer-events: none; z-index: 0; }
  .pel-blob-1 { width: 320px; height: 320px; background: #A5B4FC; top: -60px; left: 2%; animation: pel-float-a 9s ease-in-out infinite; }
  .pel-blob-2 { width: 240px; height: 240px; background: ${colors.coral}; top: 40px; right: 4%; animation: pel-float-b 7s ease-in-out infinite; opacity: 0.22; }
  .pel-blob-3 { width: 200px; height: 200px; background: ${colors.purple}; top: 260px; left: 6%; animation: pel-float-c 8s ease-in-out infinite; opacity: 0.2; }
  .pel-blob-4 { width: 260px; height: 260px; background: #A5F3FC; top: 160px; right: 10%; animation: pel-float-a 10s ease-in-out infinite; opacity: 0.25; }
  @keyframes pel-float-a { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10px, -18px) scale(1.06); } }
  @keyframes pel-float-b { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-14px, 12px) scale(0.94); } }
  @keyframes pel-float-c { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(8px, 16px); } }

  .pel-container { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }

  .pel-back-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; margin-bottom: 18px;
    border-radius: 999px; background: rgba(255,255,255,0.72); border: 1px solid ${colors.border};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    color: ${colors.inkSoft}; font-weight: 600; font-size: 13px; text-decoration: none;
    transition: transform 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .pel-back-btn:hover { color: ${colors.gold}; border-color: ${colors.borderActive}; transform: translateX(-2px); }

  .pel-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; margin-bottom: 28px; }
  .pel-header-icon {
    width: 60px; height: 60px; border-radius: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 8px 24px rgba(99,102,241,0.18), 0 1px 3px rgba(0,0,0,0.04);
    animation: pel-bob 3s ease-in-out infinite;
  }
  @keyframes pel-bob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(-4deg); } }
  .pel-eyebrow {
    font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    color: ${colors.goldDeep}; margin: 4px 0 0 0;
  }
  .pel-h1 {
    font-weight: 800; margin: 0; line-height: 1.15; font-size: 28px; letter-spacing: -0.02em;
    background: linear-gradient(90deg, ${colors.goldDeep} 0%, ${colors.purple} 55%, ${colors.coral} 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .pel-h1 { font-size: 34px; } }
  .pel-subtitle { font-size: 15px; color: ${colors.inkSoft}; max-width: 560px; margin: 4px auto 0 auto; line-height: 1.6; }

  /* -------------------- Reaction toast -------------------- */
  .pel-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep});
    animation: pel-toast-in 0.35s ease forwards;
  }
  @keyframes pel-toast-in {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  .pel-progress-track {
    width: 100%; height: 12px; border-radius: 999px; background: #FFFFFF;
    border: 1px solid ${colors.border}; overflow: hidden; margin-bottom: 18px; position: relative;
  }
  .pel-progress-fill {
    height: 100%; border-radius: 999px; position: relative; overflow: hidden;
    background: linear-gradient(90deg, ${colors.gold} 0%, ${colors.coral} 100%);
    transition: width 0.35s ease;
  }
  .pel-progress-fill::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: pel-shimmer 2.2s linear infinite;
  }
  @keyframes pel-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

  .pel-stampbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .pel-stamp-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 18px; border-radius: 999px; font-weight: 700; font-size: 14px;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; flex: 1; min-width: 130px; justify-content: center;
  }
  .pel-stamp-btn:hover { transform: translateY(-2px); border-color: ${colors.borderActive}; }
  .pel-stamp-label { font-size: 13px; font-weight: 700; text-align: center; white-space: nowrap; }
  @media (max-width: 639px) {
    .pel-stamp-label { display: none; }
    .pel-stamp-btn { min-width: 0; padding: 12px; }
  }

  .pel-stage-shell {
    border-radius: 24px; padding: 20px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  }
  @media (min-width: 640px) { .pel-stage-shell { padding: 32px; } }
  .pel-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
  .pel-stage-tag {
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.tealDeep};
    background: rgba(6,182,212,0.1); padding: 5px 14px; border-radius: 999px;
  }
  .pel-stage-progress {
    font-size: 12px; font-weight: 700; color: white;
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple});
    padding: 5px 12px; border-radius: 999px;
  }
  .pel-stage-title { font-weight: 800; color: ${colors.goldDeep}; font-size: 24px; margin: 10px 0 8px 0; letter-spacing: -0.01em; }
  @media (min-width: 640px) { .pel-stage-title { font-size: 28px; } }
  .pel-stage-subtitle { font-size: 14px; color: ${colors.inkSoft}; margin: 0 0 20px 0; line-height: 1.55; }

  .pel-hero { display: flex; align-items: center; justify-content: center; margin-bottom: 22px; min-height: 74px; }

  /* Browser / portal hero (Stage 1) */
  .pel-portal { width: 100%; max-width: 320px; border-radius: 14px; overflow: hidden; border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .pel-portal-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: ${colors.cardAlt}; border-bottom: 1px solid ${colors.border}; }
  .pel-portal-dots { display: flex; gap: 4px; }
  .pel-portal-dot { width: 7px; height: 7px; border-radius: 999px; background: ${colors.borderSoft}; }
  .pel-portal-url { flex: 1; font-size: 11px; font-weight: 700; color: ${colors.inkSoft}; font-family: 'Menlo','Consolas',monospace; display: flex; align-items: center; gap: 5px; }
  .pel-portal-body { padding: 22px 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; background: ${colors.card}; }
  .pel-portal-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); box-shadow: 0 6px 16px rgba(99,102,241,0.3); }
  .pel-portal-caption { font-size: 12px; color: ${colors.inkSoft}; font-weight: 600; text-align: center; }

  /* Chat bubble hero (Stage 2 & 3) */
  .pel-bubbles { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 320px; }
  .pel-bubble-row { display: flex; }
  .pel-bubble-row.pel-from-user { justify-content: flex-end; }
  .pel-bubble {
    max-width: 78%; padding: 9px 13px; border-radius: 14px; font-size: 12px; font-weight: 600; line-height: 1.5;
    opacity: 0; animation: pel-bubble-in 0.4s ease forwards;
  }
  @keyframes pel-bubble-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pel-bubble-user { background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); color: #fff; border-bottom-right-radius: 4px; }
  .pel-bubble-ai { background: ${colors.cardAlt}; color: ${colors.ink}; border: 1px solid ${colors.border}; border-bottom-left-radius: 4px; }
  .pel-bubble-ai.pel-bubble-short { color: ${colors.muted}; font-style: italic; }

  /* Compare hero (Stage 4) */
  .pel-scoreboard { display: flex; align-items: center; gap: 14px; }
  .pel-score-crate {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 22px; border-radius: 16px; min-width: 96px;
    background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); box-shadow: 0 8px 20px rgba(6,182,212,0.3);
  }
  .pel-score-crate-alt { background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep}); box-shadow: 0 8px 20px rgba(244,63,94,0.3); }
  .pel-score-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.85); }
  .pel-score-divider { font-weight: 800; font-size: 13px; color: ${colors.muted}; }

  /* Checklist hero (Stage 5) */
  .pel-checklist-hero { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 300px; }
  .pel-checklist-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 700; color: ${colors.inkSoft}; }

  .pel-item-list { display: flex; flex-direction: column; gap: 14px; }
  .pel-item-card {
    border-radius: 18px; padding: 20px; background: ${colors.card}; border: 1px solid ${colors.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .pel-item-card:hover { border-color: ${colors.borderActive}; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .pel-item-text { font-size: 14px; color: ${colors.ink}; margin: 0 0 12px 0; font-weight: 500; line-height: 1.6; }

  .pel-code-block {
    background: ${colors.codeBg}; color: ${colors.codeText}; border-radius: 14px; padding: 14px 16px;
    font-family: 'Menlo', 'Consolas', monospace; font-size: 12.5px; line-height: 1.6;
    white-space: pre-wrap; overflow-x: auto; margin: 0 0 12px 0;
  }

  .pel-action-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .pel-pill-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 700; padding: 12px 18px;
    border-radius: 999px; color: #black; box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .pel-pill-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.2); }
  .pel-pill-btn:active { transform: translateY(1px); }
  .pel-pill-gold { background: linear-gradient(135deg, ${colors.gold}, ${colors.purple}); }
  .pel-pill-teal { background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); }
  .pel-pill-outline {
    background: ${colors.card}; color: ${colors.inkSoft}; border: 1px solid ${colors.border}; box-shadow: none;
  }
  .pel-pill-outline:hover { color: ${colors.gold}; border-color: ${colors.borderActive}; }
  .pel-pill-outline.pel-done { color: ${colors.tealDeep}; border-color: rgba(6,182,212,0.4); background: rgba(6,182,212,0.08); }

  .pel-feedback {
    display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 14px; margin-top: 12px;
    background: rgba(6,182,212,0.08);
    opacity: 0; animation: pel-card-in 0.3s ease forwards;
  }
  @keyframes pel-card-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .pel-feedback-text { font-size: 12.5px; color: ${colors.inkSoft}; margin: 0; line-height: 1.55; }
  .pel-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .pel-textarea {
    width: 100%; min-height: 120px; resize: vertical; border-radius: 14px; padding: 14px 16px;
    background: ${colors.cardAlt}; border: 1px solid ${colors.border}; color: ${colors.ink};
    font-size: 13.5px; font-weight: 500; line-height: 1.6;
  }
  .pel-textarea::placeholder { color: ${colors.muted}; }
  .pel-textarea:focus { border-color: ${colors.borderActive}; }
  .pel-char-count { margin-top: 6px; text-align: right; font-size: 11px; font-weight: 700; color: ${colors.muted}; }

  .pel-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; gap: 12px; }
  .pel-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft}; background: ${colors.card}; border: 1px solid ${colors.border};
    transition: transform 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .pel-nav-back:not([disabled]):hover { color: ${colors.gold}; border-color: ${colors.borderActive}; transform: translateX(-2px); }
  .pel-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 24px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: black;
    background: linear-gradient(135deg, ${colors.gold}, ${colors.purple});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .pel-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .pel-nav-next:not([disabled]):active { transform: translateY(1px); }
  .pel-nav-next[disabled], .pel-nav-back[disabled] { opacity: 0.4; cursor: default; background: ${colors.cardAlt}; color: ${colors.muted}; box-shadow: none; }

  .pel-cert {
    border-radius: 24px; padding: 32px 20px; text-align: center;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    position: relative; overflow: hidden;
  }
  @media (min-width: 640px) { .pel-cert { padding: 40px; } }
  .pel-cert-badge {
    margin: 0 auto 20px auto; width: 76px; height: 76px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #F59E0B, #F97316);
    box-shadow: 0 10px 28px rgba(245,158,11,0.35);
    position: relative; z-index: 1;
    animation: pel-badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes pel-badge-pop { 0% { transform: scale(0.4) rotate(-15deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
  .pel-cert-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.gold}; margin: 0 0 8px 0; position: relative; z-index: 1; }
  .pel-cert-title { font-weight: 800; color: ${colors.ink}; font-size: 26px; margin: 0 0 12px 0; position: relative; z-index: 1; }
  .pel-cert-desc { font-size: 14px; color: ${colors.inkSoft}; margin: 0 0 24px 0; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; position: relative; z-index: 1; }
  .pel-cert-score {
    display: inline-flex; align-items: center; gap: 12px; border-radius: 20px; padding: 16px 24px; margin-bottom: 32px;
    background: ${colors.card}; border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); position: relative; z-index: 1;
  }
  .pel-cert-score-num { font-weight: 800; font-size: 30px; color: ${colors.gold}; }
  .pel-cert-score-label { font-size: 12px; color: ${colors.muted}; text-align: left; max-width: 140px; }
  .pel-cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px; text-align: left; position: relative; z-index: 1; }
  @media (min-width: 480px) { .pel-cert-grid { grid-template-columns: repeat(5, 1fr); } }
  .pel-cert-item { border-radius: 14px; padding: 12px; background: ${colors.card}; border: 1px solid ${colors.border}; }
  .pel-cert-item p { font-size: 12px; color: ${colors.ink}; margin: 6px 0 0 0; font-weight: 600; }
  .pel-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700;
    padding: 14px 24px; border-radius: 14px; background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.inkSoft};
    position: relative; z-index: 1; transition: color 0.2s ease, border-color 0.2s ease;
  }
  .pel-reset-btn:hover { color: ${colors.gold}; border-color: ${colors.borderActive}; }
`;

/* ---------------------------- CONTENT DATA ---------------------------- */

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

const STAGE_META: StageMetaItem[] = [
  { key: "open", title: "Open ChatGPT", icon: Globe, tag: "Stage 1 - Head to ChatGPT" },
  { key: "vague", title: "Vague Prompt", icon: MessageSquareText, tag: "Stage 2 - Try Prompt A" },
  { key: "engineered", title: "Engineered Prompt", icon: Wand2, tag: "Stage 3 - Try Prompt B" },
  { key: "reflect", title: "Compare", icon: Sparkles, tag: "Stage 4 - Compare Results" },
  { key: "log", title: "Log It", icon: ClipboardList, tag: "Stage 5 - Wrap Up" },
];

const CHATGPT_URL = "https://chat.openai.com/";
const PROMPT_A = "Tell me about dogs.";
const PROMPT_B =
  "Act as a friendly science tutor. Explain 3 fun, surprising facts about Golden Retrievers to a curious 10-year-old, in simple language, using at least one comparison to something they already know.";

const ENCOURAGEMENTS = ["Nice! 🎉", "You got it!", "Sharp instinct! ✨", "Great work!", "On a roll!"];

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
      <div className="pel-progress-track">
        <div className="pel-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="pel-stampbar">
        {STAGE_META.map((s, i) => {
          const Icon = s.icon;
          const isDone = completed[i];
          const isCurrent = current === i;
          const bg = isDone || isCurrent ? `linear-gradient(135deg, ${colors.gold}, ${colors.purple})` : colors.card;
          return (
            <button
              key={s.key}
              className="pel-stamp-btn"
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
              <span className="pel-stamp-label" style={{ color: isDone || isCurrent ? "#fff" : colors.muted }}>
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
    <div className="pel-stage-shell">
      <div className="pel-stage-top">
        <span className="pel-stage-tag">{tag}</span>
        {progressLabel && <span className="pel-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="pel-stage-title">{title}</h2>
      {subtitle && <p className="pel-stage-subtitle">{subtitle}</p>}
      {hero && <div className="pel-hero">{hero}</div>}
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
    <div className="pel-nav-row">
      <button className="pel-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <button className="pel-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* -------- Stage hero illustrations -------- */

function PortalHero() {
  return (
    <div className="pel-portal">
      <div className="pel-portal-bar">
        <div className="pel-portal-dots">
          <span className="pel-portal-dot" />
          <span className="pel-portal-dot" />
          <span className="pel-portal-dot" />
        </div>
        <span className="pel-portal-url">
          <Globe size={11} /> chat.openai.com
        </span>
      </div>
      <div className="pel-portal-body">
        <div className="pel-portal-icon">
          <MessageSquareText size={22} color="#fff" />
        </div>
        <p className="pel-portal-caption">A blank chat, waiting for your first prompt.</p>
      </div>
    </div>
  );
}

function BubbleHero({ short }: { short?: boolean }) {
  return (
    <div className="pel-bubbles">
      <div className="pel-bubble-row pel-from-user">
        <span className="pel-bubble pel-bubble-user" style={{ animationDelay: "0s" }}>
          {short ? "Tell me about dogs." : "Explain 3 facts about Golden Retrievers, for a 10-year-old..."}
        </span>
      </div>
      <div className="pel-bubble-row">
        <span
          className={`pel-bubble pel-bubble-ai ${short ? "pel-bubble-short" : ""}`}
          style={{ animationDelay: "0.25s" }}
        >
          {short ? "A long, generic wall of facts about every dog breed ever…" : "Three specific, age-tuned facts with a comparison kids get."}
        </span>
      </div>
    </div>
  );
}

function CompareHero() {
  return (
    <div className="pel-scoreboard">
      <div className="pel-score-crate">
        <MessageSquareText size={20} color="#fff" />
        <span className="pel-score-label">Prompt A</span>
      </div>
      <div className="pel-score-divider">VS</div>
      <div className="pel-score-crate pel-score-crate-alt">
        <Wand2 size={20} color="#fff" />
        <span className="pel-score-label">Prompt B</span>
      </div>
    </div>
  );
}

function ChecklistHero({ items }: { items: { label: string; done: boolean }[] }) {
  return (
    <div className="pel-checklist-hero">
      {items.map((it) => (
        <div key={it.label} className="pel-checklist-row">
          {it.done ? (
            <CheckCircle2 size={16} color={colors.tealDeep} />
          ) : (
            <span style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${colors.border}`, display: "inline-block" }} />
          )}
          {it.label}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- MAIN APP ------------------------------- */

export default function PromptEngineeringLab() {
  const [current, setCurrent] = useState<number>(0); // 0..4 stages, 5 = certificate
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);

  const [openedConfirmed, setOpenedConfirmed] = useState(false);
  const [triedA, setTriedA] = useState(false);
  const [triedB, setTriedB] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");

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

  const markComplete = (idx: number) => {
    setCompleted((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const goTo = (idx: number) => setCurrent(idx);

  async function copyPrompt(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      fireToast("Prompt copied — paste it into ChatGPT");
    } catch {
      fireToast("Couldn't copy — select the text manually");
    }
  }

  const reflectDone = reflection.trim().length >= 10;

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false, false]);
    setOpenedConfirmed(false);
    setTriedA(false);
    setTriedB(false);
    setCopiedId(null);
    setReflection("");
    setToast(null);
  };

  return (
    <div className="pel-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ${STYLES}
      `}</style>

      <div className="pel-blob pel-blob-1" />
      <div className="pel-blob pel-blob-2" />
      <div className="pel-blob pel-blob-3" />
      <div className="pel-blob pel-blob-4" />

      {toast && (
        <div className="pel-toast">
          <Sparkles size={15} />
          {toast}
        </div>
      )}

      <div className="pel-container">
        <Link href="/" className="pel-back-btn">
          <ChevronLeft size={18} />
          Back to Curriculum
        </Link>

        <div className="pel-header">
          <div className="pel-header-icon">
            <Compass size={26} color={colors.gold} />
          </div>
          <h1 className="pel-h1">Level 1 Task</h1>
          <p className="pel-subtitle">
            A vague prompt gets a vague answer. Run both prompts below on ChatGPT and see the difference a
            well-engineered prompt makes for yourself.
          </p>
        </div>

        {current <= 4 && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: Open ChatGPT */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Open ChatGPT"
            subtitle="Open ChatGPT in a new tab. A free account works fine — nothing paid needed for this task."
            hero={<PortalHero />}
          >
            <div className="pel-item-list">
              <div className="pel-item-card">
                <p className="pel-item-text">
                  Click the button below to open ChatGPT in a new tab, then come back here for the next step.
                </p>
                <div className="pel-action-row">
                  <a
                    href={CHATGPT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pel-pill-btn pel-pill-gold"
                    onClick={() => {
                      setOpenedConfirmed(true);
                      fireToast();
                    }}
                  >
                    <ExternalLink size={15} />
                    Open ChatGPT
                  </a>
                </div>
                {openedConfirmed && (
                  <div className="pel-feedback">
                    <CheckCircle2 size={16} color={colors.tealDeep} className="pel-feedback-icon" />
                    <p className="pel-feedback-text">Nice — keep that tab open, you`ll paste into it next.</p>
                  </div>
                )}
              </div>
            </div>
            <NavButtons
              backDisabled
              onBack={() => {}}
              nextDisabled={!openedConfirmed}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: Vague prompt */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Try the Vague Prompt"
            subtitle="Copy this prompt, paste it into ChatGPT, and read the answer you get back."
            hero={<BubbleHero short />}
          >
            <div className="pel-item-list">
              <div className="pel-item-card">
                <pre className="pel-code-block">{PROMPT_A}</pre>
                <div className="pel-action-row">
                  <button className="pel-pill-btn pel-pill-teal" onClick={() => copyPrompt("A", PROMPT_A)}>
                    {copiedId === "A" ? <Check size={15} /> : <Copy size={15} />}
                    {copiedId === "A" ? "Copied" : "Copy Prompt A"}
                  </button>
                  <button
                    className={`pel-pill-btn pel-pill-outline ${triedA ? "pel-done" : ""}`}
                    onClick={() => {
                      setTriedA(true);
                      fireToast();
                    }}
                  >
                    <Check size={15} />
                    {triedA ? "Tried it" : "I tried this"}
                  </button>
                </div>
                {triedA && (
                  <div className="pel-feedback">
                    <CheckCircle2 size={16} color={colors.tealDeep} className="pel-feedback-icon" />
                    <p className="pel-feedback-text">
                      Notice how general that answer probably was — no age, no format, no focus.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!triedA}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: Engineered prompt */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Try the Engineered Prompt"
            subtitle="Now copy this prompt, paste it into the same chat, and read that answer too."
            hero={<BubbleHero />}
          >
            <div className="pel-item-list">
              <div className="pel-item-card">
                <pre className="pel-code-block">{PROMPT_B}</pre>
                <div className="pel-action-row">
                  <button className="pel-pill-btn pel-pill-teal" onClick={() => copyPrompt("B", PROMPT_B)}>
                    {copiedId === "B" ? <Check size={15} /> : <Copy size={15} />}
                    {copiedId === "B" ? "Copied" : "Copy Prompt B"}
                  </button>
                  <button
                    className={`pel-pill-btn pel-pill-outline ${triedB ? "pel-done" : ""}`}
                    onClick={() => {
                      setTriedB(true);
                      fireToast();
                    }}
                  >
                    <Check size={15} />
                    {triedB ? "Tried it" : "I tried this"}
                  </button>
                </div>
                {triedB && (
                  <div className="pel-feedback">
                    <CheckCircle2 size={16} color={colors.tealDeep} className="pel-feedback-icon" />
                    <p className="pel-feedback-text">
                      A role, an audience, and a format — that`s what turned a vague ask into a useful one.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!triedB}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: Compare & reflect */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Compare & Reflect"
            subtitle="Which answer was more useful, and why? Write 2–3 sentences below."
            hero={<CompareHero />}
          >
            <div className="pel-item-list">
              <div className="pel-item-card">
                <textarea
                  className="pel-textarea"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="e.g. Prompt B's answer was more useful because it was written for my age, gave exact facts, and used a comparison I could picture..."
                />
                <div className="pel-char-count">{reflection.length} characters</div>
              </div>
            </div>
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!reflectDone}
              onNext={() => {
                markComplete(3);
                fireToast();
                setCurrent(4);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 4: Log it */}
        {current === 4 && (
          <StageShell
            tag={STAGE_META[4].tag}
            title="Log It"
            subtitle="You've compared both prompts and written your reflection. Wrap up the task below."
            hero={
              <ChecklistHero
                items={[
                  { label: "Opened ChatGPT", done: openedConfirmed },
                  { label: "Tried the vague prompt", done: triedA },
                  { label: "Tried the engineered prompt", done: triedB },
                  { label: "Wrote a reflection", done: reflectDone },
                ]}
              />
            }
          >
            <div className="pel-item-list">
              <div className="pel-item-card">
                <p className="pel-item-text">
                  That`s the core of prompt engineering: turning a vague ask into a specific, well-scoped one
                  gets you an answer worth reading. Hit finish to collect your completion badge.
                </p>
              </div>
            </div>
            <NavButtons
              onBack={() => setCurrent(3)}
              nextLabel="Finish Task"
              onNext={() => {
                markComplete(4);
                setCurrent(5);
              }}
            />
          </StageShell>
        )}

        {/* CERTIFICATE */}
        {current === 5 && (
          <div className="pel-cert">
            <div className="pel-cert-badge">
              <Award size={36} color="#fff" />
            </div>
            <p className="pel-cert-eyebrow">Certificate of Completion</p>
            <h2 className="pel-cert-title">You&apos;ve completed the Prompt Engineering Task</h2>
            <p className="pel-cert-desc">
              You tested a vague prompt against a specific, well-engineered one, and saw firsthand how much
              a clear prompt changes the quality of an AI`s answer.
            </p>

            <div className="pel-cert-score">
              <span className="pel-cert-score-num">2</span>
              <span className="pel-cert-score-label">prompts tested side-by-side</span>
            </div>

            <div className="pel-cert-grid">
              {STAGE_META.map((s) => (
                <div key={s.key} className="pel-cert-item">
                  <CheckCircle2 size={14} color={colors.tealDeep} />
                  <p>{s.title}</p>
                </div>
              ))}
            </div>

            <button className="pel-reset-btn" onClick={resetAll}>
              <RotateCcw size={14} /> Restart the Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}