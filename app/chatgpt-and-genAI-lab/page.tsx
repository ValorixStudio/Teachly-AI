"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { markLabTopicComplete } from "../page";
import {
  MessageSquare,
  Braces,
  Bot,
  ShieldCheck,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LucideIcon,
  ArrowLeft,
  Target,
  HelpCircle,
  Coffee,
  Sunrise,
  Calculator,
  CloudRain,
  DoorOpen,
  BookOpen,
  Gift,
  Lightbulb,
  Bug,
  MapPin,
  FileText,
  TrendingUp,
  Newspaper,
  Calendar,
  Mail,
  FlaskConical,
  Users,
  ScanFace,
  Clock,
  Quote,
  HeartPulse,
  Camera,
  UserX,
  Languages,
} from "lucide-react";

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */
/* Matches the AI Intro Lab / ML Without Math Lab / Computer Vision Lab
   exactly, so every module in the course feels like one continuous course. */

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
  llms: "indigo",
  prompting: "violet",
  assistants: "cyan",
  ethics: "rose",
};

const ACCENT_HEX: Record<AccentKey, { main: string; deep: string; light: string }> = {
  indigo: { main: palette.indigo, deep: palette.indigoDeep, light: palette.indigoLight },
  violet: { main: palette.violet, deep: "#6D28D9", light: "#DDD6FE" },
  cyan: { main: palette.cyan, deep: "#0E7490", light: palette.cyanLight },
  amber: { main: palette.amber, deep: "#B45309", light: palette.amberLight },
  rose: { main: palette.rose, deep: "#BE123C", light: palette.roseLight },
};

/* Cycle of tag colors used for multi-category sort stages (assistants, ethics) */
const TAG_COLOR_CYCLE: AccentKey[] = ["indigo", "violet", "cyan", "amber"];

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

  .gal-root {
    min-height: 100vh; width: 100%; position: relative; overflow: hidden;
    background: ${palette.pageBg};
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  }
  .gal-root *, .gal-root *::before, .gal-root *::after { box-sizing: border-box; }
  .gal-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .gal-root button:focus-visible { outline: 3px solid ${palette.indigo}; outline-offset: 2px; }

  /* Animated background orbs */
  .gal-orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(80px); opacity: 0.35;
  }
  .gal-orb-1 {
    width: 500px; height: 500px; top: -120px; right: -100px;
    background: ${palette.indigoLight};
    animation: float1 18s ease-in-out infinite;
  }
  .gal-orb-2 {
    width: 400px; height: 400px; bottom: -80px; left: -80px;
    background: ${palette.cyanLight};
    animation: float2 22s ease-in-out infinite;
  }
  .gal-orb-3 {
    width: 300px; height: 300px; top: 50%; left: 50%;
    background: ${palette.amberLight};
    animation: float1 25s ease-in-out infinite reverse;
    opacity: 0.2;
  }

  .gal-container {
    position: relative; z-index: 1;
    max-width: 880px; margin: 0 auto; padding: 32px 20px 60px;
  }
  @media (min-width: 768px) { .gal-container { padding: 40px 32px 80px; } }

  /* Back button */
  .gal-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600; color: ${palette.inkSoft};
    padding: 8px 16px; border-radius: 12px;
    background: ${palette.cardBg};
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${palette.border};
    transition: all 0.2s ease; margin-bottom: 28px; text-decoration: none;
  }
  .gal-back:hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; transform: translateX(-2px); }

  /* Header */
  .gal-header {
    text-align: center; margin-bottom: 36px;
    animation: fadeSlideUp 0.6s ease both;
  }
  .gal-header-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 20px; border-radius: 999px;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    color: white; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 16px;
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }
  .gal-h1 {
    font-size: 32px; font-weight: 800;
    margin: 0 0 12px 0; line-height: 1.2;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, ${palette.indigoDeep}, ${palette.violet} 55%, ${palette.rose});
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  @media (min-width: 640px) { .gal-h1 { font-size: 40px; } }
  .gal-subtitle { font-size: 16px; color: ${palette.inkSoft}; max-width: 580px; margin: 0 auto; line-height: 1.6; }

  /* Reaction toast */
  .gal-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    animation: galToastIn 0.35s ease forwards;
  }
  .gal-toast-up { background: linear-gradient(135deg, ${palette.emerald}, #059669); }
  .gal-toast-down { background: linear-gradient(135deg, ${palette.rose}, #E11D48); }
  @keyframes galToastIn {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  /* Progress stepper */
  .gal-stepper {
    display: flex; align-items: center; justify-content: center;
    gap: 0; margin-bottom: 36px;
    animation: fadeSlideUp 0.7s ease both 0.1s;
  }
  .gal-step-item { display: flex; align-items: center; gap: 0; }
  .gal-step-btn {
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: 16px;
    transition: all 0.25s ease; position: relative;
    border: 2px solid ${palette.border};
    background: ${palette.cardBg};
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  }
  .gal-step-btn:hover { transform: translateY(-2px); border-color: ${palette.borderActive}; }
  .gal-step-btn.active {
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(99,102,241,0.35);
    animation: pulseGlow 2s ease-in-out infinite;
  }
  .gal-step-btn.done {
    background: ${palette.emerald};
    border-color: transparent;
  }
  .gal-step-connector {
    width: 32px; height: 3px; border-radius: 2px;
    background: ${palette.border};
    transition: background 0.3s ease;
  }
  .gal-step-connector.filled { background: ${palette.emerald}; }
  @media (max-width: 639px) {
    .gal-step-btn { width: 40px; height: 40px; border-radius: 12px; }
    .gal-step-connector { width: 16px; }
  }

  /* Stage hero illustration -- content-linked */
  .gal-hero {
    display: flex; align-items: center; justify-content: center;
    min-height: 108px; margin-bottom: 8px; padding: 12px 8px;
    animation: fadeSlideUp 0.6s ease both 0.15s;
  }

  /* Radar hero (Stage 1: predict the word) */
  .gal-hero-radar { position: relative; width: 92px; height: 92px; display: flex; align-items: center; justify-content: center; }
  .gal-hero-radar-ring {
    position: absolute; width: 92px; height: 92px; border-radius: 50%;
    border: 2px solid;
    animation: heroPing 2.4s ease-out infinite;
  }
  .gal-hero-radar-core {
    position: relative; z-index: 1; width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    animation: heroIn 0.4s ease both;
  }

  /* Versus hero (Stage 2: weak vs strong prompt) */
  .gal-hero-duel { display: flex; align-items: center; gap: 18px; }
  .gal-hero-duel-side {
    width: 50px; height: 50px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    background: ${palette.cardAlt}; border: 1px solid ${palette.border};
  }
  .gal-hero-duel-mid { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .gal-hero-vs-label {
    font-family: 'Menlo', 'Consolas', monospace; font-size: 11px; font-weight: 800;
    color: ${palette.muted}; letter-spacing: 0.06em;
  }
  .gal-hero-vs-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    animation: heroIn 0.4s ease both;
  }

  /* Bins hero (multi-category sort: assistants, ethics) */
  .gal-hero-bins { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .gal-hero-falling {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 16px rgba(0,0,0,0.18);
    animation: heroDrop 0.5s ease both;
  }
  .gal-hero-bins-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .gal-hero-bin {
    width: 62px; height: 52px; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
    border: 2px dashed ${palette.border}; background: ${palette.cardAlt};
  }
  .gal-hero-bin-label { font-size: 8px; font-weight: 700; color: ${palette.muted}; text-align: center; line-height: 1.15; }

  /* Stage card (glassmorphism) */
  .gal-stage {
    border-radius: 24px; padding: 28px 24px;
    background: ${palette.cardBg};
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${palette.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    animation: fadeSlideUp 0.55s ease both 0.2s;
  }
  @media (min-width: 640px) { .gal-stage { padding: 36px 32px; } }
  .gal-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .gal-stage-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: ${palette.indigo}; padding: 5px 14px; border-radius: 999px;
    background: rgba(99,102,241,0.08);
  }
  .gal-stage-progress {
    font-size: 13px; font-weight: 700; color: white;
    display: flex; align-items: center; gap: 4px;
    padding: 5px 12px; border-radius: 999px;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
  }
  .gal-stage-title {
    font-size: 26px; font-weight: 800; color: ${palette.ink};
    margin: 8px 0 6px 0; letter-spacing: -0.01em;
  }
  @media (min-width: 640px) { .gal-stage-title { font-size: 30px; } }
  .gal-stage-subtitle { font-size: 15px; color: ${palette.inkSoft}; margin: 0 0 12px 0; line-height: 1.6; }

  /* Item card */
  .gal-items { display: flex; flex-direction: column; gap: 14px; margin-top: 16px; }
  .gal-item {
    border-radius: 18px; padding: 20px;
    background: ${palette.cardBgSolid};
    border: 1px solid ${palette.border};
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    transition: all 0.2s ease;
  }
  .gal-item:hover { border-color: ${palette.borderActive}; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .gal-item-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
  .gal-item-text { font-size: 15px; color: ${palette.ink}; margin: 0; font-weight: 500; line-height: 1.55; padding-top: 6px; }
  .gal-item-goal {
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    color: ${palette.violet}; margin: 0 0 4px 0; padding-top: 6px;
  }

  /* Icon badge on each item */
  .gal-icon-badge {
    flex-shrink: 0; width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .gal-icon-badge-indigo { background: rgba(99,102,241,0.12); color: ${palette.indigoDeep}; }
  .gal-icon-badge-violet { background: rgba(139,92,246,0.12); color: ${palette.violet}; }
  .gal-icon-badge-cyan { background: rgba(6,182,212,0.12); color: #0E7490; }
  .gal-icon-badge-amber { background: rgba(245,158,11,0.14); color: #B45309; }
  .gal-icon-badge-rose { background: rgba(244,63,94,0.12); color: #BE123C; }

  /* Choice buttons (word prediction) */
  .gal-choices { display: flex; gap: 10px; flex-wrap: wrap; }
  .gal-choice {
    flex: 1; min-width: 130px; font-size: 13px; font-weight: 700; padding: 14px 16px;
    border-radius: 14px; color: #000; text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    border: 2px solid transparent;
  }
  .gal-choice:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
  .gal-choice:active { transform: translateY(1px); }
  .gal-choice-indigo { background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet}); }
  .gal-choice-rose { background: linear-gradient(135deg, ${palette.rose}, #E11D48); }
  .gal-choice-amber { background: linear-gradient(135deg, ${palette.amber}, #D97706); }
  .gal-choice-cyan { background: linear-gradient(135deg, ${palette.cyan}, #0891B2); }
  .gal-choice-emerald { background: linear-gradient(135deg, ${palette.emerald}, #059669); }

  /* Prompt A/B pair (prompt engineering stage) */
  .gal-prompt-pair { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
  .gal-prompt-option {
    text-align: left; width: 100%; border-radius: 16px; padding: 14px 16px;
    background: ${palette.cardBgSolid}; border: 2px solid ${palette.border};
    transition: all 0.2s ease;
  }
  .gal-prompt-option:hover:not(:disabled) { transform: translateY(-2px); border-color: ${palette.borderActive}; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .gal-prompt-option:disabled { cursor: default; }
  .gal-prompt-option-label {
    font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
    color: ${palette.muted}; margin: 0 0 6px 0;
  }
  .gal-prompt-option-text { font-size: 13.5px; color: ${palette.ink}; margin: 0; line-height: 1.55; font-style: italic; }
  .gal-prompt-option.is-correct { border-color: ${palette.emerald}; background: rgba(16,185,129,0.06); }
  .gal-prompt-option.is-wrong { border-color: ${palette.rose}; background: rgba(244,63,94,0.06); opacity: 0.7; }

  /* Multi-color tag buttons (assistants / ethics sort) */
  .gal-tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .gal-tag-btn {
    font-size: 12.5px; font-weight: 700; padding: 11px 16px; border-radius: 999px;
    border: 2px solid; transition: all 0.2s ease;
  }
  .gal-tag-btn:hover { transform: translateY(-2px); }
  .gal-tag-btn-indigo { background: rgba(99,102,241,0.08); border-color: ${palette.indigo}; color: ${palette.indigoDeep}; }
  .gal-tag-btn-indigo:hover { background: ${palette.indigo}; color: white; box-shadow: 0 6px 16px rgba(99,102,241,0.3); }
  .gal-tag-btn-violet { background: rgba(139,92,246,0.08); border-color: ${palette.violet}; color: #6D28D9; }
  .gal-tag-btn-violet:hover { background: ${palette.violet}; color: white; box-shadow: 0 6px 16px rgba(139,92,246,0.3); }
  .gal-tag-btn-cyan { background: rgba(6,182,212,0.08); border-color: ${palette.cyan}; color: #0E7490; }
  .gal-tag-btn-cyan:hover { background: ${palette.cyan}; color: white; box-shadow: 0 6px 16px rgba(6,182,212,0.3); }
  .gal-tag-btn-amber { background: rgba(245,158,11,0.08); border-color: ${palette.amber}; color: #92400E; }
  .gal-tag-btn-amber:hover { background: ${palette.amber}; color: white; box-shadow: 0 6px 16px rgba(245,158,11,0.3); }
  .gal-tag-btn-rose { background: rgba(244,63,94,0.08); border-color: ${palette.rose}; color: #9F1239; }
  .gal-tag-btn-rose:hover { background: ${palette.rose}; color: white; box-shadow: 0 6px 16px rgba(244,63,94,0.3); }

  /* Feedback */
  .gal-feedback {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px; border-radius: 14px;
    border: 1px solid transparent;
    animation: popIn 0.3s ease both;
  }
  .gal-feedback-correct { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.25); }
  .gal-feedback-wrong { background: rgba(244,63,94,0.08); border-color: rgba(244,63,94,0.25); }
  .gal-feedback-text { font-size: 14px; color: ${palette.inkSoft}; margin: 0; line-height: 1.55; }
  .gal-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  /* Nav row */
  .gal-nav {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 32px; gap: 12px;
  }
  .gal-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px;
    border-radius: 14px; font-size: 14px; font-weight: 700; color: ${palette.inkSoft};
    background: ${palette.cardBgSolid}; border: 1px solid ${palette.border};
    transition: all 0.2s ease;
  }
  .gal-nav-back:not([disabled]):hover { color: ${palette.indigo}; border-color: ${palette.borderActive}; transform: translateX(-2px); }
  .gal-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 24px;
    border-radius: 14px; font-size: 14px; font-weight: 700; color: #000;
    background: linear-gradient(135deg, ${palette.indigo}, ${palette.violet});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: all 0.2s ease;
  }
  .gal-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .gal-nav-next:not([disabled]):active { transform: translateY(1px); }
  .gal-nav-next[disabled], .gal-nav-back[disabled] {
    opacity: 0.4; cursor: default;
  }
  .gal-nav-next[disabled] { background: ${palette.muted}; box-shadow: none; }

  /* ---- Completion overlay (matches AI Foundations Lab / ML Without Math Lab / Computer Vision Lab) ---- */
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
    .gal-root * { transition: none !important; animation: none !important; }
  }
`;

/* ─────────────────────────────── TYPES ─────────────────────────────── */

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

interface WordItem {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explain: string;
  icon: LucideIcon;
}

interface PromptItem {
  id: string;
  goal: string;
  weak: string;
  strong: string;
  explain: string;
  icon: LucideIcon;
}

type ToolCategoryId = "search" | "files" | "code" | "actions";

interface ToolItem {
  id: string;
  label: string;
  answer: ToolCategoryId;
  icon: LucideIcon;
}

interface ToolCategory {
  id: ToolCategoryId;
  label: string;
  hint: string;
}

type EthicsCategoryId = "bias" | "misinformation" | "privacy" | "jobs";

interface EthicsItem {
  id: string;
  text: string;
  answer: EthicsCategoryId;
  icon: LucideIcon;
}

interface EthicsCategory {
  id: EthicsCategoryId;
  label: string;
  hint: string;
}

type WordAnswerMap = Record<string, string>;
type PromptAnswerMap = Record<string, "weak" | "strong">;
type ToolAnswerMap = Record<string, ToolCategoryId>;
type EthicsAnswerMap = Record<string, EthicsCategoryId>;

/* ─────────────────────────── CONTENT DATA ─────────────────────────── */

const STAGE_META: StageMetaItem[] = [
  { key: "llms", title: "LLMs", icon: MessageSquare, tag: "Stage 1 · Predict the Word" },
  { key: "prompting", title: "Prompt Engineering", icon: Braces, tag: "Stage 2 · Which Prompt Wins?" },
  { key: "assistants", title: "AI Assistants", icon: Bot, tag: "Stage 3 · Match the Tool" },
  { key: "ethics", title: "AI Ethics", icon: ShieldCheck, tag: "Stage 4 · Spot the Concern" },
];

const WORD_ITEMS: WordItem[] = [
  { id: "w1", prompt: "I woke up and drank a cup of ___", options: ["coffee", "bicycle", "jealousy"], answer: "coffee", explain: "An LLM predicts the next word using patterns learned from huge amounts of text — 'coffee' follows 'cup of' far more often than the other options ever would.", icon: Coffee },
  { id: "w2", prompt: "The sun rises in the ___", options: ["east", "refrigerator", "Tuesday"], answer: "east", explain: "This phrase appears constantly in training text, so the model has seen the pattern 'sun rises in the east' many, many times.", icon: Sunrise },
  { id: "w3", prompt: "Two plus two equals ___", options: ["four", "giraffe", "Monday"], answer: "four", explain: "Even simple arithmetic phrases like this show up so often in text that the model reliably predicts the expected word.", icon: Calculator },
  { id: "w4", prompt: "The weather today is sunny with a chance of ___", options: ["rain", "homework", "silence"], answer: "rain", explain: "Weather reports are a common pattern in training data, so 'rain' is a far likelier continuation than an unrelated word.", icon: CloudRain },
  { id: "w5", prompt: "She opened the door and stepped ___", options: ["outside", "spaghetti", "purple"], answer: "outside", explain: "Story-like sentences follow common patterns — 'stepped outside' fits the flow of the sentence, while the other options break it completely.", icon: DoorOpen },
  { id: "w6", prompt: "Once upon a time, in a land far ___", options: ["away", "Tuesday", "calculator"], answer: "away", explain: "This is one of the most repeated story openings in existence, so the model has an extremely strong prediction for what comes next.", icon: BookOpen },
];

const PROMPT_ITEMS: PromptItem[] = [
  {
    id: "p1",
    goal: "Get help writing a birthday message",
    weak: "Write something for a birthday",
    strong: "Write a warm, 3-sentence birthday message for my sister who loves hiking, mentioning the outdoors",
    explain: "Naming the length, the person, and a personal detail gives the model everything it needs to write something specific instead of generic.",
    icon: Gift,
  },
  {
    id: "p2",
    goal: "Understand a science concept",
    weak: "Explain photosynthesis",
    strong: "Explain photosynthesis to a 10-year-old in 3 simple sentences with one everyday example",
    explain: "Specifying the audience, the length, and asking for an example steers the answer toward something actually useful and easy to follow.",
    icon: Lightbulb,
  },
  {
    id: "p3",
    goal: "Get help fixing code",
    weak: "Fix my code",
    strong: "Here's my Python function that should sort a list but throws an error on line 5 — explain what's wrong and give the corrected code",
    explain: "Describing the expected behaviour and pointing to exactly where it fails helps the model diagnose the real problem instead of guessing.",
    icon: Bug,
  },
  {
    id: "p4",
    goal: "Plan a trip",
    weak: "Plan a trip",
    strong: "Plan a 3-day budget-friendly itinerary for a first-time visitor to Tokyo, focused on food and temples",
    explain: "Giving a duration, a budget, a destination, and a focus turns an impossibly broad request into one the model can actually answer well.",
    icon: MapPin,
  },
  {
    id: "p5",
    goal: "Summarize a long article",
    weak: "Summarize this",
    strong: "Summarize this article in 5 bullet points, focusing on the main argument and any statistics mentioned",
    explain: "Asking for a specific format and telling the model what to prioritize produces a summary you can actually use right away.",
    icon: FileText,
  },
];

const TOOL_ITEMS: ToolItem[] = [
  { id: "t1", label: "Find out today's stock price for a company", answer: "search", icon: TrendingUp },
  { id: "t2", label: "Check the latest news about an election", answer: "search", icon: Newspaper },
  { id: "t3", label: "Summarize a PDF report you just uploaded", answer: "files", icon: FileText },
  { id: "t4", label: "Read a spreadsheet and calculate the average of a column", answer: "files", icon: FileText },
  { id: "t5", label: "Debug a Python script and run it to check the output", answer: "code", icon: Bug },
  { id: "t6", label: "Schedule a meeting with your team for Thursday", answer: "actions", icon: Calendar },
  { id: "t7", label: "Send a follow-up email to a client", answer: "actions", icon: Mail },
  { id: "t8", label: "Test whether a small function actually produces the right result", answer: "code", icon: FlaskConical },
];

const TOOL_CATEGORIES: ToolCategory[] = [
  { id: "search", label: "Web Search", hint: "Needs current, outside information" },
  { id: "files", label: "File & Document Reading", hint: "Needs to read something you provided" },
  { id: "code", label: "Code Execution", hint: "Needs to write and actually run code" },
  { id: "actions", label: "Take Real-World Action", hint: "Needs to do something on your behalf" },
];

const ETHICS_ITEMS: EthicsItem[] = [
  { id: "e1", text: "A hiring AI trained mostly on resumes from one gender ends up favoring that gender for interviews.", answer: "bias", icon: Users },
  { id: "e2", text: "A facial recognition system misidentifies people of a certain skin tone far more often than others.", answer: "bias", icon: ScanFace },
  { id: "e3", text: "A chatbot confidently states a wrong historical date, and someone shares it online as fact.", answer: "misinformation", icon: Clock },
  { id: "e4", text: "An AI-generated article spreads a fabricated quote that a real public figure never actually said.", answer: "misinformation", icon: Quote },
  { id: "e5", text: "An AI assistant retains and reuses sensitive medical details a user typed into a conversation.", answer: "privacy", icon: HeartPulse },
  { id: "e6", text: "A free AI app quietly sells users' uploaded photos to advertisers without clear consent.", answer: "privacy", icon: Camera },
  { id: "e7", text: "A company replaces its entire customer support team with an AI chatbot overnight.", answer: "jobs", icon: UserX },
  { id: "e8", text: "Automated AI translation tools replace most of a company's human translation staff.", answer: "jobs", icon: Languages },
];

const ETHICS_CATEGORIES: EthicsCategory[] = [
  { id: "bias", label: "Bias", hint: "Unfair treatment baked in from unbalanced data" },
  { id: "misinformation", label: "Misinformation", hint: "Confident, convincing, and wrong" },
  { id: "privacy", label: "Privacy", hint: "Personal data handled carelessly" },
  { id: "jobs", label: "Job Impact", hint: "Automation changing human roles" },
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
    <div className="gal-stepper">
      {STAGE_META.map((s, i) => {
        const Icon = s.icon;
        const isDone = completed[i];
        const isCurrent = current === i;
        return (
          <div key={s.key} className="gal-step-item">
            {i > 0 && (
              <div className={`gal-step-connector${completed[i - 1] ? " filled" : ""}`} />
            )}
            <button
              className={`gal-step-btn${isCurrent ? " active" : ""}${isDone ? " done" : ""}`}
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
    <div className={`gal-icon-badge gal-icon-badge-${accent}`}>
      <Icon size={19} strokeWidth={2.25} />
    </div>
  );
}

/* -------- Stage hero illustrations, each reflecting the active (first unanswered) question -------- */

function WordRadarHero({ item }: { item?: WordItem }) {
  if (!item) return null;
  const Icon = item.icon;
  const accent = ACCENT_HEX[STAGE_ACCENT.llms];
  return (
    <div className="gal-hero-radar">
      <div className="gal-hero-radar-ring" style={{ borderColor: accent.main, animationDelay: "0s" }} />
      <div className="gal-hero-radar-ring" style={{ borderColor: accent.main, animationDelay: "0.8s" }} />
      <div
        className="gal-hero-radar-core"
        style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.deep})` }}
      >
        <Icon size={22} color="#fff" />
      </div>
    </div>
  );
}

function PromptDuelHero({ item }: { item?: PromptItem }) {
  if (!item) return null;
  const Icon = item.icon;
  const accent = ACCENT_HEX[STAGE_ACCENT.prompting];
  return (
    <div className="gal-hero-duel">
      <div className="gal-hero-duel-side">
        <HelpCircle size={24} color={palette.inkSoft} />
      </div>
      <div className="gal-hero-duel-mid">
        <div
          className="gal-hero-vs-icon"
          style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.deep})` }}
        >
          <Icon size={20} color="#fff" />
        </div>
        <span className="gal-hero-vs-label">VS</span>
      </div>
      <div className="gal-hero-duel-side">
        <Target size={24} color={palette.inkSoft} />
      </div>
    </div>
  );
}

function ToolBinsHero({ item }: { item?: ToolItem }) {
  if (!item) return null;
  const Icon = item.icon;
  const accent = ACCENT_HEX[STAGE_ACCENT.assistants];
  return (
    <div className="gal-hero-bins">
      <div
        className="gal-hero-falling"
        style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.deep})` }}
      >
        <Icon size={20} color="#fff" />
      </div>
      <div className="gal-hero-bins-row">
        {TOOL_CATEGORIES.map((cat) => (
          <div key={cat.id} className="gal-hero-bin">
            <span className="gal-hero-bin-label">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EthicsBinsHero({ item }: { item?: EthicsItem }) {
  if (!item) return null;
  const Icon = item.icon;
  const accent = ACCENT_HEX[STAGE_ACCENT.ethics];
  return (
    <div className="gal-hero-bins">
      <div
        className="gal-hero-falling"
        style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.deep})` }}
      >
        <Icon size={20} color="#fff" />
      </div>
      <div className="gal-hero-bins-row">
        {ETHICS_CATEGORIES.map((cat) => (
          <div key={cat.id} className="gal-hero-bin">
            <span className="gal-hero-bin-label">{cat.label}</span>
          </div>
        ))}
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
    <div className="gal-stage">
      <div className="gal-stage-top">
        <span className="gal-stage-tag"><Target size={12} /> {tag}</span>
        {progressLabel && <span className="gal-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="gal-stage-title">{title}</h2>
      {subtitle && <p className="gal-stage-subtitle">{subtitle}</p>}
      {hero && <div className="gal-hero">{hero}</div>}
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
    <div className="gal-nav">
      <button className="gal-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <button className="gal-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Next"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ────────────────────────────── MAIN APP ────────────────────────────── */

export default function GenerativeAILab() {
  const router = useRouter();
  const [current, setCurrent] = useState<number>(0); // 0..3 stages
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);
  const [labCompleted, setLabCompleted] = useState(false);

  const [wordAnswers, setWordAnswers] = useState<WordAnswerMap>({});
  const [promptAnswers, setPromptAnswers] = useState<PromptAnswerMap>({});
  const [toolAnswers, setToolAnswers] = useState<ToolAnswerMap>({});
  const [ethicsAnswers, setEthicsAnswers] = useState<EthicsAnswerMap>({});

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

  const wordDone = Object.keys(wordAnswers).length === WORD_ITEMS.length;
  const promptDone = Object.keys(promptAnswers).length === PROMPT_ITEMS.length;
  const toolDone = Object.keys(toolAnswers).length === TOOL_ITEMS.length;
  const ethicsDone = Object.keys(ethicsAnswers).length === ETHICS_ITEMS.length;

  const activeWordItem = useMemo(
    () => WORD_ITEMS.find((it) => !wordAnswers[it.id]) || WORD_ITEMS[WORD_ITEMS.length - 1],
    [wordAnswers]
  );
  const activePromptItem = useMemo(
    () => PROMPT_ITEMS.find((it) => !promptAnswers[it.id]) || PROMPT_ITEMS[PROMPT_ITEMS.length - 1],
    [promptAnswers]
  );
  const activeToolItem = useMemo(
    () => TOOL_ITEMS.find((it) => !toolAnswers[it.id]) || TOOL_ITEMS[TOOL_ITEMS.length - 1],
    [toolAnswers]
  );
  const activeEthicsItem = useMemo(
    () => ETHICS_ITEMS.find((it) => !ethicsAnswers[it.id]) || ETHICS_ITEMS[ETHICS_ITEMS.length - 1],
    [ethicsAnswers]
  );

  // Same pattern as AI Foundations Lab / ML Without Math Lab / Computer Vision Lab:
  // when the final stage's "Finish Lab" button is pressed, mark this exact topic
  // complete (slug MUST match the labPath registered in page.tsx, e.g.
  // "/generative-ai-lab") and show the completion overlay — no separate
  // certificate page.
  const finishLab = () => {
    markComplete(3);
    markLabTopicComplete("chatgpt-and-genAI-lab");
    setLabCompleted(true);
  };

  return (
    <div className="gal-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ${STYLES}
      `}</style>

      {/* Background orbs */}
      <div className="gal-orb gal-orb-1" />
      <div className="gal-orb gal-orb-2" />
      <div className="gal-orb gal-orb-3" />

      {toast && (
        <div className={`gal-toast ${toast.mood === "up" ? "gal-toast-up" : "gal-toast-down"}`}>
          {toast.mood === "up" ? <Sparkles size={15} /> : <XCircle size={15} />}
          {toast.text}
        </div>
      )}

      <div className="gal-container">
        <Link href="/" className="gal-back">
          <ArrowLeft size={16} /> Back to Curriculum
        </Link>

        <div className="gal-header">
          <div className="gal-header-badge">
            <Compass size={14} /> Interactive Lab
          </div>
          <h1 className="gal-h1">ChatGPT &amp; Generative AI Lab</h1>
          <p className="gal-subtitle">
            Play the same game a language model plays, craft sharper prompts, match tasks to the
            right AI tools, and spot the ethical concerns hiding in real scenarios.
          </p>
        </div>

        <Stepper current={current} completed={completed} onJump={goTo} />

        {/* STAGE 0: LLMs */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Predict the Next Word"
            subtitle="This is exactly the task an LLM is trained on: given the text so far, guess the most likely next word."
            progressLabel={`${Object.keys(wordAnswers).length}/${WORD_ITEMS.length} predicted`}
            hero={<WordRadarHero item={activeWordItem} />}
          >
            <div className="gal-items">
              {WORD_ITEMS.map((item) => {
                const chosen = wordAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="gal-item">
                    <div className="gal-item-head">
                      <IconBadge icon={item.icon} accent="indigo" />
                      <p className="gal-item-text">{item.prompt}</p>
                    </div>
                    {!chosen ? (
                      <div className="gal-choices">
                        {item.options.map((opt, i) => (
                          <button
                            key={opt}
                            className={`gal-choice ${i === 0 ? "gal-choice-indigo" : i === 1 ? "gal-choice-cyan" : "gal-choice-amber"}`}
                            onClick={() => {
                              setWordAnswers((p) => ({ ...p, [item.id]: opt }));
                              fireToast(opt === item.answer);
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`gal-feedback ${isCorrect ? "gal-feedback-correct" : "gal-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="gal-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="gal-feedback-icon" />
                        )}
                        <p className="gal-feedback-text">
                          {isCorrect ? "Correct — " : `Most models would pick '${item.answer}' here. `}
                          {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons backDisabled onBack={() => {}} nextDisabled={!wordDone} onNext={() => { markComplete(0); setCurrent(1); }} />
          </StageShell>
        )}

        {/* STAGE 1: Prompt Engineering */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Which Prompt Wins?"
            subtitle="Same goal, two different prompts. Pick the one that would actually get a better answer."
            progressLabel={`${Object.keys(promptAnswers).length}/${PROMPT_ITEMS.length} chosen`}
            hero={<PromptDuelHero item={activePromptItem} />}
          >
            <div className="gal-items">
              {PROMPT_ITEMS.map((item) => {
                const chosen = promptAnswers[item.id];
                return (
                  <div key={item.id} className="gal-item">
                    <div className="gal-item-head">
                      <IconBadge icon={item.icon} accent="violet" />
                      <p className="gal-item-goal">Goal: {item.goal}</p>
                    </div>
                    <div className="gal-prompt-pair">
                      <button
                        className={`gal-prompt-option ${chosen ? (chosen === "weak" ? "is-wrong" : "") : ""}`}
                        onClick={() => {
                          if (chosen) return;
                          setPromptAnswers((p) => ({ ...p, [item.id]: "weak" }));
                          fireToast(false);
                        }}
                        disabled={!!chosen}
                      >
                        <p className="gal-prompt-option-label">Prompt A</p>
                        <p className="gal-prompt-option-text">&quot;{item.weak}&quot;</p>
                      </button>
                      <button
                        className={`gal-prompt-option ${chosen ? (chosen === "strong" ? "is-correct" : "") : ""}`}
                        onClick={() => {
                          if (chosen) return;
                          setPromptAnswers((p) => ({ ...p, [item.id]: "strong" }));
                          fireToast(true);
                        }}
                        disabled={!!chosen}
                      >
                        <p className="gal-prompt-option-label">Prompt B</p>
                        <p className="gal-prompt-option-text">&quot;{item.strong}&quot;</p>
                      </button>
                    </div>
                    {chosen && (
                      <div className={`gal-feedback ${chosen === "strong" ? "gal-feedback-correct" : "gal-feedback-wrong"}`}>
                        {chosen === "strong" ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="gal-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="gal-feedback-icon" />
                        )}
                        <p className="gal-feedback-text">
                          {chosen === "strong" ? "Correct — Prompt B wins. " : "Prompt B actually wins here. "}
                          {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons onBack={() => setCurrent(0)} nextDisabled={!promptDone} onNext={() => { markComplete(1); setCurrent(2); }} />
          </StageShell>
        )}

        {/* STAGE 2: AI Assistants */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Match the Right Tool"
            subtitle="An AI assistant is only as useful as the tools behind it. Sort each task by what it truly needs."
            progressLabel={`${Object.keys(toolAnswers).length}/${TOOL_ITEMS.length} matched`}
            hero={<ToolBinsHero item={activeToolItem} />}
          >
            <div className="gal-items">
              {TOOL_ITEMS.map((item) => {
                const chosen = toolAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="gal-item">
                    <div className="gal-item-head">
                      <IconBadge icon={item.icon} accent="cyan" />
                      <p className="gal-item-text">{item.label}</p>
                    </div>
                    {!chosen ? (
                      <div className="gal-tag-row">
                        {TOOL_CATEGORIES.map((cat, i) => (
                          <button
                            key={cat.id}
                            className={`gal-tag-btn gal-tag-btn-${TAG_COLOR_CYCLE[i % TAG_COLOR_CYCLE.length]}`}
                            onClick={() => {
                              setToolAnswers((p) => ({ ...p, [item.id]: cat.id }));
                              fireToast(cat.id === item.answer);
                            }}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`gal-feedback ${isCorrect ? "gal-feedback-correct" : "gal-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="gal-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="gal-feedback-icon" />
                        )}
                        <p className="gal-feedback-text">
                          Needs: <strong style={{ color: palette.ink }}>{TOOL_CATEGORIES.find((c) => c.id === item.answer)?.label}</strong> — {TOOL_CATEGORIES.find((c) => c.id === item.answer)?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons onBack={() => setCurrent(1)} nextDisabled={!toolDone} onNext={() => { markComplete(2); setCurrent(3); }} />
          </StageShell>
        )}

        {/* STAGE 3: AI Ethics */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Spot the Concern"
            subtitle="Read each real-world scenario and identify which ethical concern it raises."
            progressLabel={`${Object.keys(ethicsAnswers).length}/${ETHICS_ITEMS.length} classified`}
            hero={<EthicsBinsHero item={activeEthicsItem} />}
          >
            <div className="gal-items">
              {ETHICS_ITEMS.map((item) => {
                const chosen = ethicsAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="gal-item">
                    <div className="gal-item-head">
                      <IconBadge icon={item.icon} accent="rose" />
                      <p className="gal-item-text">{item.text}</p>
                    </div>
                    {!chosen ? (
                      <div className="gal-tag-row">
                        {ETHICS_CATEGORIES.map((cat, i) => (
                          <button
                            key={cat.id}
                            className={`gal-tag-btn gal-tag-btn-${TAG_COLOR_CYCLE[i % TAG_COLOR_CYCLE.length]}`}
                            onClick={() => {
                              setEthicsAnswers((p) => ({ ...p, [item.id]: cat.id }));
                              fireToast(cat.id === item.answer);
                            }}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`gal-feedback ${isCorrect ? "gal-feedback-correct" : "gal-feedback-wrong"}`}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color={palette.emerald} className="gal-feedback-icon" />
                        ) : (
                          <XCircle size={18} color={palette.rose} className="gal-feedback-icon" />
                        )}
                        <p className="gal-feedback-text">
                          Correct concern: <strong style={{ color: palette.ink }}>{ETHICS_CATEGORIES.find((c) => c.id === item.answer)?.label}</strong> — {ETHICS_CATEGORIES.find((c) => c.id === item.answer)?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons onBack={() => setCurrent(2)} nextDisabled={!ethicsDone} nextLabel="Finish & Unlock Next" onNext={finishLab} />
          </StageShell>
        )}

        {labCompleted && (
          <div className="completion-overlay">
            <div className="completion-modal">
              <div className="completion-icon">🎉</div>

              <h2>Lab Completed!</h2>

              <p>
                Congratulations! You have successfully completed the
                <strong> ChatGPT &amp; Generative AI Lab</strong>.
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