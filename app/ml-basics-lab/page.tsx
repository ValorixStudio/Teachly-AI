"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  BookOpen,
  Layers,
  Rocket,
  BarChart3,
  Sigma,
  GitBranch,
  Users,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  RotateCcw,
  Sparkles,
  Database,
  Tag,
  TrendingUp,
  Target,
  LucideIcon,
} from "lucide-react";

const colors = {
  bg: "#FFF7E3",
  bgSoft: "#FFEFC8",
  card: "#FFFFFF",
  cardAlt: "#F6F1FF",
  border: "#FFD866",
  borderSoft: "#FFE9A8",
  gold: "#F5A623",
  goldDeep: "#E2860A",
  goldDeepest: "#B96A05",
  coral: "#FF7A59",
  coralDeep: "#E85A38",
  purple: "#A855F7",
  purpleDeep: "#8B34E0",
  teal: "#2FB6A3",
  tealDeep: "#1F9585",
  ink: "#3A2E1E",
  inkSoft: "#5A4B34",
  muted: "#8A7A5C",
  codeBg: "#2B2440",
  codeText: "#F3EFFF",
};

/* All layout/spacing/typography lives in plain CSS below, so this component
   has zero dependency on Tailwind being configured in the host project. */
const STYLES = `
  .aiel-root {
    min-height: 100vh;
    width: 100%;
    padding: 32px 16px;
    background: radial-gradient(circle at 20% -10%, ${colors.bgSoft} 0%, ${colors.bg} 55%);
    font-family: 'Poppins', sans-serif;
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
  .aiel-blob { position: absolute; border-radius: 999px; filter: blur(2px); opacity: 0.32; pointer-events: none; z-index: 0; }
  .aiel-blob-1 { width: 140px; height: 140px; background: ${colors.gold}; top: 0px; left: 4%; animation: aiel-float-a 9s ease-in-out infinite; }
  .aiel-blob-2 { width: 90px; height: 90px; background: ${colors.coral}; top: 60px; right: 6%; animation: aiel-float-b 7s ease-in-out infinite; }
  .aiel-blob-3 { width: 60px; height: 60px; background: ${colors.purple}; top: 220px; left: 10%; animation: aiel-float-c 8s ease-in-out infinite; }
  .aiel-blob-4 { width: 100px; height: 100px; background: ${colors.teal}; top: 180px; right: 14%; animation: aiel-float-a 10s ease-in-out infinite; }
  @keyframes aiel-float-a { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10px, -18px) scale(1.06); } }
  @keyframes aiel-float-b { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-14px, 12px) scale(0.94); } }
  @keyframes aiel-float-c { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(8px, 16px); } }

  .aiel-container { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }

  .topic-back-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; margin-bottom: 18px;
    border-radius: 999px; background: ${colors.card}; border: 2px solid ${colors.borderSoft};
    color: ${colors.inkSoft}; font-weight: 700; font-size: 13px; text-decoration: none;
    transition: transform 0.15s ease, background 0.15s ease;
  }
  .topic-back-btn:hover { background: ${colors.borderSoft}; transform: translateX(-2px); }

  .aiel-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; margin-bottom: 28px; }
  .aiel-header-icon {
    width: 60px; height: 60px; border-radius: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 2.5px solid ${colors.border};
    box-shadow: 0 6px 0 ${colors.border};
    animation: aiel-bob 3s ease-in-out infinite;
  }
  @keyframes aiel-bob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(-4deg); } }
  .aiel-eyebrow {
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
    color: ${colors.goldDeep}; margin: 4px 0 0 0;
  }
  .aiel-h1 {
    font-family: 'Baloo 2', sans-serif; font-weight: 800; margin: 0; line-height: 1.15;
    font-size: 26px;
    background: linear-gradient(90deg, #D9A62B 0%, ${colors.coral} 45%, ${colors.purple} 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .aiel-h1 { font-size: 32px; } }
  .aiel-subtitle { font-size: 15px; color: ${colors.muted}; max-width: 560px; margin: 4px auto 0 auto; line-height: 1.55; }

  /* -------------------- Reaction toast -------------------- */
  .aiel-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: ${colors.ink}; z-index: 50;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    animation: aiel-toast-in 0.35s ease forwards;
  }
  .aiel-toast-up { background: linear-gradient(180deg, #B9F3E7 0%, ${colors.teal} 100%); border: 2px solid ${colors.tealDeep}; }
  .aiel-toast-down { background: linear-gradient(180deg, #FFE0D2 0%, #FFC1A6 100%); border: 2px solid ${colors.coralDeep}; }
  @keyframes aiel-toast-in {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  .aiel-progress-track {
    width: 100%; height: 14px; border-radius: 999px; background: #FFFFFF;
    border: 2px solid ${colors.borderSoft}; overflow: hidden; margin-bottom: 18px; position: relative;
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
    gap: 6px; margin-bottom: 28px; flex-wrap: wrap;
  }
  .aiel-stamp-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 12px; border-radius: 999px; font-weight: 700; font-size: 14px;
    transition: transform 0.15s ease, box-shadow 0.15s ease; flex: 1; min-width: 90px; justify-content: center;
  }
  .aiel-stamp-btn:hover { transform: translateY(-2px); }
  .aiel-stamp-label {
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 700;
    text-align: center; white-space: nowrap;
  }
  @media (max-width: 639px) {
    .aiel-stamp-label { display: none; }
    .aiel-stamp-btn { min-width: 0; padding: 10px; }
  }

  .aiel-stage-shell { border-radius: 28px; padding: 20px; background: ${colors.card}; border: 3px solid ${colors.border}; box-shadow: 0 10px 0 ${colors.borderSoft}; }
  @media (min-width: 640px) { .aiel-stage-shell { padding: 32px; } }
  .aiel-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .aiel-stage-tag {
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.teal};
  }
  .aiel-stage-progress { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: ${colors.muted}; }
  .aiel-stage-title {
    font-family: 'Baloo 2', sans-serif; font-weight: 800; color: ${colors.goldDeep};
    font-size: 24px; margin: 4px 0 8px 0;
  }
  @media (min-width: 640px) { .aiel-stage-title { font-size: 28px; } }
  .aiel-stage-subtitle { font-size: 14px; color: ${colors.muted}; margin: 0 0 20px 0; }

  /* -------------------- Stage hero illustrations -------------------- */
  .aiel-hero { display: flex; align-items: center; justify-content: center; margin-bottom: 22px; min-height: 90px; }

  /* Tally crates (ML Basics + Supervised stages) */
  .aiel-tally-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .aiel-tally-crate {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 18px; border-radius: 16px;
    box-shadow: 0 5px 0 rgba(0,0,0,0.15); min-width: 84px; transition: transform 0.2s ease;
  }
  .aiel-tally-num { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 22px; color: #fff; line-height: 1; }
  .aiel-tally-label { font-size: 10.5px; font-weight: 700; color: #fff; opacity: 0.92; text-align: center; }

  /* Cluster scatter (Unsupervised) */
  .aiel-cluster-dot { animation: aiel-hero-in 0.5s ease forwards; }
  .aiel-cluster-caption { font-size: 12px; color: ${colors.muted}; text-align: center; max-width: 300px; font-weight: 600; line-height: 1.5; margin-top: 8px; }
  @keyframes aiel-hero-in { from { opacity: 0; transform: translateY(6px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* Agent-Environment-Reward loop (Reinforcement) */
  .aiel-loop-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .aiel-loop-chip {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 16px; border-radius: 14px;
    background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft};
  }
  .aiel-loop-chip-name { font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 800; color: ${colors.ink}; }
  .aiel-loop-arrow { color: ${colors.muted}; }

  /* Fitted line (Linear Regression) */
  .aiel-chart-caption { font-size: 12px; color: ${colors.muted}; text-align: center; max-width: 300px; font-weight: 600; line-height: 1.5; margin-top: 8px; }

  /* Threshold gauge (Logistic Regression) */
  .aiel-gauge-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; max-width: 300px; }
  .aiel-gauge-track { width: 100%; height: 16px; border-radius: 999px; background: linear-gradient(90deg, ${colors.borderSoft} 0%, ${colors.gold} 100%); position: relative; border: 2px solid ${colors.border}; }
  .aiel-gauge-threshold { position: absolute; top: -6px; bottom: -6px; width: 2px; background: ${colors.ink}; left: 50%; }
  .aiel-gauge-dot { position: absolute; top: -7px; width: 18px; height: 18px; border-radius: 999px; background: ${colors.coral}; border: 2px solid ${colors.coralDeep}; transform: translateX(-50%); animation: aiel-hero-in 0.5s ease forwards; }
  .aiel-gauge-labels { display: flex; justify-content: space-between; width: 100%; font-family: 'Menlo', 'Consolas', monospace; font-size: 11px; color: ${colors.muted}; font-weight: 700; }

  /* Decision tree (Decision Tree) */
  .aiel-tree-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .aiel-tree-node {
    padding: 8px 14px; border-radius: 10px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft};
    font-size: 11.5px; font-weight: 700; color: ${colors.ink}; text-align: center;
  }
  .aiel-tree-node-root { background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%); border-color: ${colors.goldDeep}; color: ${colors.ink}; }
  .aiel-tree-branches { display: flex; gap: 24px; margin-top: 4px; }
  .aiel-tree-branch { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .aiel-tree-branch-label { font-size: 10px; color: ${colors.muted}; font-weight: 700; }
  .aiel-tree-leaf { padding: 6px 12px; border-radius: 999px; font-size: 10.5px; font-weight: 800; color: #fff; }

  /* KNN neighbors */
  .aiel-knn-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .aiel-knn-dot { animation: aiel-hero-in 0.5s ease forwards; }
  .aiel-knn-caption { font-size: 12px; color: ${colors.muted}; text-align: center; max-width: 300px; font-weight: 600; line-height: 1.5; }

  .aiel-item-list { display: flex; flex-direction: column; gap: 12px; }
  .aiel-item-card {
    border-radius: 20px; padding: 16px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft};
    opacity: 0; animation: aiel-card-in 0.4s ease forwards;
  }
  @keyframes aiel-card-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .aiel-item-text { font-size: 14px; color: ${colors.ink}; margin: 0 0 12px 0; font-weight: 500; }

  .aiel-code-block {
    background: ${colors.codeBg}; color: ${colors.codeText}; border-radius: 14px; padding: 14px 16px;
    font-family: 'Menlo', 'Consolas', monospace; font-size: 12.5px; line-height: 1.6;
    white-space: pre; overflow-x: auto; margin: 0 0 10px 0;
  }
  .aiel-item-question { font-size: 13px; color: ${colors.inkSoft}; margin: 0 0 12px 0; font-weight: 600; }

  .aiel-choice-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .aiel-choice-btn {
    flex: 1; font-size: 12px; font-weight: 700; padding: 12px 8px; border-radius: 999px; color: ${colors.ink};
    box-shadow: 0 4px 0 rgba(0,0,0,0.18); transition: transform 0.12s ease, box-shadow 0.12s ease;
    min-width: 100px;
  }
  .aiel-choice-btn:hover { transform: translateY(-1px); }
  .aiel-choice-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,0.18); }
  .aiel-choice-teal { background: linear-gradient(180deg, #7EE6D6 0%, ${colors.teal} 100%); }
  .aiel-choice-coral { background: linear-gradient(180deg, #FFAD8F 0%, ${colors.coral} 100%); }
  .aiel-choice-gold { background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%); }
  .aiel-choice-outline {
    font-size: 12.5px; font-weight: 700; padding: 10px 14px; border-radius: 999px;
    background: ${colors.card}; border: 2px solid ${colors.border}; color: ${colors.ink};
    transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease;
  }
  .aiel-choice-outline:hover { background: ${colors.borderSoft}; border-color: ${colors.gold}; transform: translateY(-1px); }

  .aiel-feedback { display: flex; align-items: flex-start; gap: 8px; animation: aiel-card-in 0.3s ease forwards; }
  .aiel-feedback-text { font-size: 12px; color: ${colors.muted}; margin: 0; line-height: 1.5; }
  .aiel-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .aiel-tag-row { display: flex; flex-wrap: wrap; gap: 8px; }

  .aiel-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; }
  .aiel-nav-back {
    display: flex; align-items: center; gap: 4px; padding: 10px 18px; border-radius: 999px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft}; background: ${colors.cardAlt};
    transition: transform 0.12s ease, background 0.15s ease;
  }
  .aiel-nav-back:not([disabled]):hover { background: ${colors.borderSoft}; transform: translateY(-1px); }
  .aiel-nav-next {
    display: flex; align-items: center; gap: 4px; padding: 12px 22px; border-radius: 999px;
    font-size: 14px; font-weight: 700; color: ${colors.ink};
    background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%);
    box-shadow: 0 5px 0 ${colors.goldDeep};
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  .aiel-nav-next:not([disabled]):hover { transform: translateY(-1px); }
  .aiel-nav-next:not([disabled]):active { transform: translateY(4px); box-shadow: 0 1px 0 ${colors.goldDeep}; }
  .aiel-nav-next[disabled], .aiel-nav-back[disabled] { opacity: 0.4; cursor: default; background: ${colors.cardAlt}; color: ${colors.muted}; box-shadow: none; }

  .aiel-cert { border-radius: 28px; padding: 32px 20px; text-align: center; background: ${colors.card}; border: 3px solid ${colors.border}; box-shadow: 0 10px 0 ${colors.borderSoft}; position: relative; overflow: hidden; }
  @media (min-width: 640px) { .aiel-cert { padding: 40px; } }
  .aiel-confetti-piece { position: absolute; top: -14px; width: 8px; height: 14px; opacity: 0.9; animation: aiel-confetti-fall linear infinite; border-radius: 2px; }
  @keyframes aiel-confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(340px) rotate(540deg); opacity: 0; }
  }
  .aiel-cert-badge {
    margin: 0 auto 20px auto; width: 76px; height: 76px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(180deg, #FFC65C 0%, ${colors.gold} 100%);
    box-shadow: 0 6px 0 ${colors.goldDeep};
    position: relative; z-index: 1;
    animation: aiel-badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes aiel-badge-pop { 0% { transform: scale(0.4) rotate(-15deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
  .aiel-cert-eyebrow { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.teal}; margin: 0 0 8px 0; position: relative; z-index: 1; }
  .aiel-cert-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; color: ${colors.goldDeep}; font-size: 24px; margin: 0 0 12px 0; position: relative; z-index: 1; }
  .aiel-cert-desc { font-size: 14px; color: ${colors.muted}; margin: 0 0 24px 0; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.6; position: relative; z-index: 1; }
  .aiel-cert-score {
    display: inline-flex; align-items: center; gap: 12px; border-radius: 20px; padding: 16px 24px; margin-bottom: 32px;
    background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; position: relative; z-index: 1;
  }
  .aiel-cert-score-num { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 30px; color: ${colors.goldDeep}; }
  .aiel-cert-score-label { font-size: 12px; color: ${colors.muted}; text-align: left; max-width: 140px; }
  .aiel-cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 32px; text-align: left; position: relative; z-index: 1; }
  @media (min-width: 480px) { .aiel-cert-grid { grid-template-columns: repeat(4, 1fr); } }
  .aiel-cert-item { border-radius: 14px; padding: 10px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; }
  .aiel-cert-item p { font-size: 11px; color: ${colors.ink}; margin: 6px 0 0 0; font-weight: 600; }
  .aiel-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700;
    padding: 12px 22px; border-radius: 999px; background: ${colors.cardAlt}; border: 2px solid ${colors.border}; color: ${colors.ink};
    position: relative; z-index: 1;
  }
`;

/* ---------------------------- TYPES ---------------------------- */

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

type LearningStyleId = "supervised" | "unsupervised" | "reinforcement";

interface StyleItem {
  id: string;
  text: string;
  answer: LearningStyleId;
}

interface StyleCategory {
  id: LearningStyleId;
  label: string;
  hint: string;
}

type TaskTypeId = "classification" | "regression";

interface TaskItem {
  id: string;
  text: string;
  answer: TaskTypeId;
  explain: string;
}

interface QuizItem {
  id: string;
  code?: string;
  question: string;
  options: string[];
  answer: string;
  explain: string;
}

type StyleAnswerMap = Record<string, LearningStyleId>;
type TaskAnswerMap = Record<string, TaskTypeId>;
type AnswerMap = Record<string, string>;

/* ---------------------------- CONTENT DATA ---------------------------- */

const STAGE_META: StageMetaItem[] = [
  { key: "ml-basics", title: "ML Basics", icon: Brain, tag: "Stage 1 - Which Learning Style?" },
  { key: "supervised", title: "Supervised", icon: BookOpen, tag: "Stage 2 - Class or Number?" },
  { key: "unsupervised", title: "Unsupervised", icon: Layers, tag: "Stage 3 - Find the Cluster" },
  { key: "reinforcement", title: "Reinforcement", icon: Rocket, tag: "Stage 4 - Agent & Reward" },
  { key: "linear-regression", title: "Linear Regression", icon: BarChart3, tag: "Stage 5 - Fit the Line" },
  { key: "logistic-regression", title: "Logistic Regression", icon: Sigma, tag: "Stage 6 - Cross the Threshold" },
  { key: "decision-tree", title: "Decision Tree", icon: GitBranch, tag: "Stage 7 - Follow the Branches" },
  { key: "knn", title: "KNN", icon: Users, tag: "Stage 8 - Vote With Neighbors" },
];

const STYLE_ITEMS: StyleItem[] = [
  { id: "st1", text: "Predict a house's price from past sales that already list the price for each house.", answer: "supervised" },
  { id: "st2", text: "Group customers into segments based on purchasing behavior, with no predefined labels.", answer: "unsupervised" },
  { id: "st3", text: "Train a robot to walk by rewarding it whenever it moves forward without falling.", answer: "reinforcement" },
  { id: "st4", text: "Classify emails as spam or not spam using thousands of already-labeled examples.", answer: "supervised" },
  { id: "st5", text: "Discover hidden topics inside a pile of unlabeled news articles.", answer: "unsupervised" },
  { id: "st6", text: "Teach a game-playing agent through repeated trial and error, scored after each move.", answer: "reinforcement" },
];

const STYLE_CATEGORIES: StyleCategory[] = [
  { id: "supervised", label: "Supervised", hint: "Learns from labeled examples" },
  { id: "unsupervised", label: "Unsupervised", hint: "Finds structure with no labels" },
  { id: "reinforcement", label: "Reinforcement", hint: "Learns from trial, error, and reward" },
];

const TASK_ITEMS: TaskItem[] = [
  { id: "tk1", text: "Predicting tomorrow's temperature in degrees.", answer: "regression", explain: "The output is a continuous number, which is exactly what regression predicts." },
  { id: "tk2", text: "Deciding whether an email is spam or not.", answer: "classification", explain: "The output is one of two fixed categories, which is exactly what classification predicts." },
  { id: "tk3", text: "Predicting a house's sale price.", answer: "regression", explain: "Price is a continuous number that can take on countless possible values." },
  { id: "tk4", text: "Detecting whether a tumor is malignant or benign.", answer: "classification", explain: "This is a choice between two fixed categories, not a number to predict." },
  { id: "tk5", text: "Predicting how many minutes a delivery will take.", answer: "regression", explain: "Minutes is a continuous number that can vary smoothly, so this is regression." },
  { id: "tk6", text: "Sorting a photo as either 'cat' or 'dog'.", answer: "classification", explain: "Choosing between two labeled categories is a classification task." },
];

const UNSUPERVISED_ITEMS: QuizItem[] = [
  { id: "u1", code: "Customer spending:\nA: $10, $15, $12\nB: $500, $480, $510\nC: $20, $18, $22", question: "Which two customers would a clustering algorithm most likely group together?", options: ["A and C", "A and B", "B and C"], answer: "A and C", explain: "Clustering groups points whose values are close together -- A and C's spending is far closer to each other than to B's." },
  { id: "u2", question: "What is the key difference between supervised and unsupervised learning?", options: ["Unsupervised data has no correct-answer labels attached", "Unsupervised learning always uses more data", "Supervised learning never uses real data"], answer: "Unsupervised data has no correct-answer labels attached", explain: "Supervised learning studies from an answer key; unsupervised learning has to find structure with no answer key at all." },
  { id: "u3", question: "Which of these is a typical unsupervised learning task?", options: ["Grouping similar news articles together", "Predicting next month's rainfall in millimeters", "Classifying an email as spam or not spam"], answer: "Grouping similar news articles together", explain: "Grouping unlabeled items by similarity is a classic unsupervised task -- the other two both rely on labeled answers." },
  { id: "u4", code: "Two clusters found in shopping data:\nCluster 1: buys diapers, baby wipes\nCluster 2: buys protein powder, running shoes", question: "What did the algorithm most likely group customers by?", options: ["Similarity in purchasing patterns", "Alphabetical order of their names", "Random chance"], answer: "Similarity in purchasing patterns", explain: "Clustering algorithms group items that behave similarly -- here, similar shopping habits." },
  { id: "u5", question: "Why can't accuracy be measured the same way in unsupervised learning as in supervised learning?", options: ["There are no correct labels to compare predictions against", "Unsupervised algorithms never make mistakes", "Accuracy isn't a real concept in computing"], answer: "There are no correct labels to compare predictions against", explain: "Without labeled answers, there's nothing to directly check a grouping against, so accuracy has to be judged differently." },
];

const REINFORCEMENT_ITEMS: QuizItem[] = [
  { id: "r1", question: "In reinforcement learning, what is the 'agent' rewarded or penalized for?", options: ["The actions it takes", "The color of its code", "How much memory it uses"], answer: "The actions it takes", explain: "The agent learns which actions tend to lead to better outcomes by receiving rewards or penalties after each one." },
  { id: "r2", code: "A dog is given a treat every time it sits on command.", question: "In reinforcement learning terms, what is the treat?", options: ["The reward", "The environment", "The agent"], answer: "The reward", explain: "The treat is the positive signal that reinforces the behaviour -- exactly what a reward does in RL." },
  { id: "r3", question: "Which of these best matches reinforcement learning?", options: ["A robot learns to walk through repeated trial and error with feedback", "A model learns to classify images from thousands of labeled photos", "An algorithm groups similar customers with no labels at all"], answer: "A robot learns to walk through repeated trial and error with feedback", explain: "Trial, error, and feedback in the form of reward is the defining loop of reinforcement learning." },
  { id: "r4", question: "What is the 'environment' in reinforcement learning?", options: ["The world or system the agent interacts with", "The programming language used", "The name of the reward function"], answer: "The world or system the agent interacts with", explain: "The environment is everything the agent acts within and receives feedback from." },
  { id: "r5", code: "A chess-playing AI improves by playing millions of games against itself, winning or losing each time.", question: "What signal is it mainly learning from?", options: ["Win/loss outcomes acting as rewards and penalties", "Pre-labeled correct moves for every position", "Grouping similar board positions together"], answer: "Win/loss outcomes acting as rewards and penalties", explain: "No one labels the 'correct' move -- the agent learns purely from whether its games are eventually won or lost." },
];

const LINEAR_REGRESSION_ITEMS: QuizItem[] = [
  { id: "lr1", code: "House size (sq ft) -> Price ($)\n1000 -> 200,000\n1500 -> 300,000\n2000 -> 400,000", question: "Following this pattern, what would linear regression predict for a 2500 sq ft house?", options: ["About $500,000", "About $250,000", "About $2,000,000"], answer: "About $500,000", explain: "Price rises by about $200 per square foot in this pattern, so continuing that straight line lands close to $500,000." },
  { id: "lr2", question: "What kind of output does linear regression predict?", options: ["A continuous number", "A yes/no category", "A cluster label"], answer: "A continuous number", explain: "Regression always predicts a number that can vary smoothly, unlike classification's fixed categories." },
  { id: "lr3", question: "What shape does linear regression assume the relationship between input and output follows?", options: ["A straight line", "A perfect circle", "A random scatter"], answer: "A straight line", explain: "Linear regression specifically fits the best possible straight line through the training data." },
  { id: "lr4", question: "Why is linear regression often described as 'easy to explain'?", options: ["Each input's effect on the output is a simple, constant slope", "It never makes mistakes", "It works only on images"], answer: "Each input's effect on the output is a simple, constant slope", explain: "A constant slope means you can say something like 'each extra square foot adds about this much value' in plain language." },
  { id: "lr5", question: "Which task fits linear regression best?", options: ["Predicting a car's fuel efficiency from its weight", "Sorting emails into spam or not spam", "Grouping shoppers into unlabeled segments"], answer: "Predicting a car's fuel efficiency from its weight", explain: "Fuel efficiency is a continuous number with a roughly proportional relationship to weight -- a natural fit for regression." },
];

const LOGISTIC_REGRESSION_ITEMS: QuizItem[] = [
  { id: "lg1", code: "Model output: 0.82\nDecision threshold: 0.5", question: "What would this be classified as?", options: ["Positive class (probably yes)", "Negative class (probably no)", "Impossible to tell"], answer: "Positive class (probably yes)", explain: "Since 0.82 sits above the 0.5 threshold, the model leans strongly toward the positive class." },
  { id: "lg2", question: "What does logistic regression output before it's turned into a class?", options: ["A probability between 0 and 1", "A raw unbounded number", "A cluster ID"], answer: "A probability between 0 and 1", explain: "Logistic regression squashes its score into a smooth probability range between 0 and 1." },
  { id: "lg3", code: "Model output: 0.35\nDecision threshold: 0.5", question: "What would this be classified as?", options: ["Negative class (probably no)", "Positive class (probably yes)", "Both at once"], answer: "Negative class (probably no)", explain: "0.35 falls below the 0.5 threshold, so the model leans toward the negative class." },
  { id: "lg4", question: "Despite its name, what kind of problems does logistic regression actually solve?", options: ["Classification problems, not number prediction", "Only image-related problems", "Only unsupervised problems"], answer: "Classification problems, not number prediction", explain: "Logistic regression predicts categories like yes/no, even though the word 'regression' is in its name." },
  { id: "lg5", question: "Which task fits logistic regression best?", options: ["Predicting whether a customer will cancel their subscription (yes/no)", "Predicting a house's exact sale price", "Grouping articles by topic with no labels"], answer: "Predicting whether a customer will cancel their subscription (yes/no)", explain: "A binary yes/no outcome is exactly the kind of problem logistic regression is built for." },
];

const DECISION_TREE_ITEMS: QuizItem[] = [
  { id: "dt1", code: "Is income > $50,000?\n  Yes -> Is age > 30?\n    Yes -> Approve\n    No  -> Reject\n  No  -> Reject", question: "Would a 35-year-old earning $60,000 be approved by this tree?", options: ["Yes", "No", "Not enough information"], answer: "Yes", explain: "Income above $50,000 takes the 'Yes' branch, and age above 30 also takes 'Yes', leading straight to Approve." },
  { id: "dt2", question: "How does a decision tree arrive at its final prediction?", options: ["By following a sequence of yes/no questions down to a leaf", "By averaging every possible answer at once", "By picking randomly among all options"], answer: "By following a sequence of yes/no questions down to a leaf", explain: "Each answer branches to the next question until a final prediction is reached at the bottom." },
  { id: "dt3", question: "What problem can happen if a decision tree is allowed to grow too deep?", options: ["It can overfit, memorizing quirks instead of general patterns", "It becomes impossible to store on a computer", "It stops working on numeric data"], answer: "It can overfit, memorizing quirks instead of general patterns", explain: "An overly deep tree can carve out a rule for every single training example instead of learning the real pattern." },
  { id: "dt4", code: "Is it raining?\n  Yes -> Bring umbrella\n  No  -> Is it sunny?\n    Yes -> Wear sunglasses\n    No  -> Just go", question: "What would this tree recommend on a cloudy, dry day?", options: ["Just go", "Bring umbrella", "Wear sunglasses"], answer: "Just go", explain: "Not raining takes the 'No' branch to the second question; not sunny either, landing on 'Just go'." },
  { id: "dt5", question: "What is one advantage of a decision tree over many other models?", options: ["Its decision path can be read and explained step by step", "It always achieves perfect accuracy", "It requires no data at all to train"], answer: "Its decision path can be read and explained step by step", explain: "Because it's just a sequence of questions, you can literally trace why the tree made its prediction." },
];

const KNN_ITEMS: QuizItem[] = [
  { id: "kn1", code: "New point's 3 nearest neighbors:\nNeighbor 1: Category A\nNeighbor 2: Category A\nNeighbor 3: Category B", question: "With K=3, what would KNN predict for the new point?", options: ["Category A", "Category B", "Cannot decide"], answer: "Category A", explain: "Two out of three nearest neighbors are Category A, so the majority vote predicts Category A." },
  { id: "kn2", question: "What does the 'K' in KNN refer to?", options: ["The number of nearest neighbors consulted", "The number of features in the dataset", "The number of classes available"], answer: "The number of nearest neighbors consulted", explain: "K is simply how many of the closest existing points get a vote in the prediction." },
  { id: "kn3", question: "What tends to happen if K is set far too small, like K=1?", options: ["Predictions get noisy, swayed by a single odd neighbor", "Predictions become perfectly accurate every time", "The model stops working entirely"], answer: "Predictions get noisy, swayed by a single odd neighbor", explain: "With only one neighbor voting, a single unusual nearby point can completely flip the prediction." },
  { id: "kn4", code: "New point's 5 nearest neighbors:\nCategory A: 1 vote\nCategory B: 4 votes", question: "With K=5, what would KNN predict?", options: ["Category B", "Category A", "A tie, impossible to decide"], answer: "Category B", explain: "Category B holds the clear majority of votes among the five nearest neighbors." },
  { id: "kn5", question: "What tends to happen if K is set far too large?", options: ["Predictions get blurry, ignoring what's actually nearby", "Predictions become instantly perfect", "The algorithm requires no data at all"], answer: "Predictions get blurry, ignoring what's actually nearby", explain: "Counting too many distant points dilutes the vote, smoothing over exactly the local pattern that mattered." },
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
              ? `linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%)`
              : colors.card;
          return (
            <button
              key={s.key}
              className="aiel-stamp-btn"
              onClick={() => onJump(i)}
              style={{
                background: bg,
                border: `2px solid ${isDone || isCurrent ? colors.goldDeep : colors.borderSoft}`,
                boxShadow: isDone || isCurrent ? `0 4px 0 ${colors.goldDeep}` : "none",
              }}
            >
              {isDone ? (
                <CheckCircle2 size={16} color={colors.ink} strokeWidth={2.5} />
              ) : (
                <Icon size={14} color={isCurrent ? colors.ink : colors.muted} />
              )}
              <span className="aiel-stamp-label" style={{ color: isDone || isCurrent ? colors.ink : colors.muted }}>
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

/* -------- Stage hero illustrations, one per stage -------- */

function TallyHero({
  categories,
}: {
  categories: { label: string; count: number; icon: LucideIcon; from: string; to: string; shadow: string }[];
}) {
  return (
    <div className="aiel-tally-row">
      {categories.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="aiel-tally-crate"
            style={{
              background: `linear-gradient(180deg, ${c.from} 0%, ${c.to} 100%)`,
              boxShadow: `0 5px 0 ${c.shadow}`,
              transform: c.count ? "translateY(-2px)" : undefined,
            }}
          >
            <Icon size={20} color="#fff" />
            <span className="aiel-tally-num">{c.count}</span>
            <span className="aiel-tally-label">{c.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ClusterHero() {
  // Two tight clusters plus one far outlier, illustrating unlabeled grouping by proximity.
  const clusterA = [
    { x: 34, y: 30 },
    { x: 46, y: 24 },
    { x: 40, y: 42 },
    { x: 54, y: 36 },
  ];
  const clusterB = [
    { x: 210, y: 46 },
    { x: 224, y: 30 },
    { x: 236, y: 52 },
    { x: 218, y: 62 },
  ];
  return (
    <div className="aiel-knn-wrap">
      <svg viewBox="0 0 280 90" width="100%" height="90" preserveAspectRatio="xMidYMid meet">
        {clusterA.map((p, i) => (
          <circle key={`a-${i}`} className="aiel-cluster-dot" cx={p.x} cy={p.y} r={7} fill={colors.teal} stroke={colors.tealDeep} strokeWidth="2" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
        {clusterB.map((p, i) => (
          <circle key={`b-${i}`} className="aiel-cluster-dot" cx={p.x} cy={p.y} r={7} fill={colors.coral} stroke={colors.coralDeep} strokeWidth="2" style={{ animationDelay: `${0.3 + i * 0.08}s` }} />
        ))}
        <ellipse cx={44} cy={33} rx={30} ry={26} fill="none" stroke={colors.tealDeep} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        <ellipse cx={222} cy={47} rx={30} ry={26} fill="none" stroke={colors.coralDeep} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
      </svg>
      <p className="aiel-cluster-caption">No labels are given -- clustering finds these two groups purely by how close the points sit to each other.</p>
    </div>
  );
}

function LoopHero() {
  const steps: { name: string; icon: LucideIcon }[] = [
    { name: "Agent", icon: Rocket },
    { name: "Action", icon: TrendingUp },
    { name: "Environment", icon: Layers },
    { name: "Reward", icon: Target },
  ];
  return (
    <div className="aiel-loop-row">
      {steps.map((s, i) => {
        const Icon = s.icon;
        return (
          <React.Fragment key={s.name}>
            <div className="aiel-loop-chip">
              <Icon size={16} color={colors.goldDeep} />
              <span className="aiel-loop-chip-name">{s.name}</span>
            </div>
            {i < steps.length - 1 && <ChevronRight size={16} className="aiel-loop-arrow" />}
          </React.Fragment>
        );
      })}
      <RotateCcw size={16} className="aiel-loop-arrow" />
    </div>
  );
}

function RegressionLineHero() {
  const points = [
    { x: 20, y: 68 },
    { x: 70, y: 52 },
    { x: 120, y: 40 },
    { x: 170, y: 26 },
    { x: 220, y: 14 },
  ];
  return (
    <div className="aiel-knn-wrap">
      <svg viewBox="0 0 260 80" width="100%" height="80" preserveAspectRatio="xMidYMid meet">
        <line x1="10" y1="74" x2="248" y2="8" stroke={colors.goldDeep} strokeWidth="2.5" />
        {points.map((p, i) => (
          <circle key={i} className="aiel-cluster-dot" cx={p.x} cy={p.y} r={5.5} fill={colors.purple} stroke={colors.purpleDeep} strokeWidth="2" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </svg>
      <p className="aiel-chart-caption">Linear regression draws the straight line that best fits every point, then reads predictions straight off it.</p>
    </div>
  );
}

function ThresholdGaugeHero() {
  return (
    <div className="aiel-gauge-wrap">
      <div className="aiel-gauge-track">
        <div className="aiel-gauge-threshold" />
        <div className="aiel-gauge-dot" style={{ left: "82%" }} />
      </div>
      <div className="aiel-gauge-labels">
        <span>0.0</span>
        <span>threshold 0.5</span>
        <span>1.0</span>
      </div>
    </div>
  );
}

function TreeHero() {
  return (
    <div className="aiel-tree-wrap">
      <div className="aiel-tree-node aiel-tree-node-root">Income &gt; $50,000?</div>
      <div className="aiel-tree-branches">
        <div className="aiel-tree-branch">
          <span className="aiel-tree-branch-label">Yes</span>
          <div className="aiel-tree-node">Age &gt; 30?</div>
          <div className="aiel-tree-branches">
            <div className="aiel-tree-branch">
              <span className="aiel-tree-branch-label">Yes</span>
              <span className="aiel-tree-leaf" style={{ background: colors.teal }}>Approve</span>
            </div>
            <div className="aiel-tree-branch">
              <span className="aiel-tree-branch-label">No</span>
              <span className="aiel-tree-leaf" style={{ background: colors.coral }}>Reject</span>
            </div>
          </div>
        </div>
        <div className="aiel-tree-branch">
          <span className="aiel-tree-branch-label">No</span>
          <span className="aiel-tree-leaf" style={{ background: colors.coral }}>Reject</span>
        </div>
      </div>
    </div>
  );
}

function KnnHero() {
  const neighborsA = [
    { x: 60, y: 20 },
    { x: 90, y: 55 },
  ];
  const neighborsB = [
    { x: 150, y: 22 },
    { x: 175, y: 50 },
    { x: 145, y: 62 },
  ];
  return (
    <div className="aiel-knn-wrap">
      <svg viewBox="0 0 260 90" width="100%" height="90" preserveAspectRatio="xMidYMid meet">
        <circle cx={128} cy={44} r={38} fill="none" stroke={colors.muted} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        {neighborsA.map((p, i) => (
          <circle key={`a-${i}`} className="aiel-knn-dot" cx={p.x} cy={p.y} r={6} fill={colors.teal} stroke={colors.tealDeep} strokeWidth="2" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
        {neighborsB.map((p, i) => (
          <circle key={`b-${i}`} className="aiel-knn-dot" cx={p.x} cy={p.y} r={6} fill={colors.coral} stroke={colors.coralDeep} strokeWidth="2" style={{ animationDelay: `${0.2 + i * 0.08}s` }} />
        ))}
        <circle cx={128} cy={44} r={7} fill={colors.purple} stroke={colors.purpleDeep} strokeWidth="2.5" />
      </svg>
      <p className="aiel-knn-caption">The new point (center) looks at its closest neighbors and takes a majority vote among their categories.</p>
    </div>
  );
}

interface StyleListProps {
  items: StyleItem[];
  answers: StyleAnswerMap;
  onAnswer: (id: string, value: LearningStyleId) => void;
  onFeedback: (correct: boolean) => void;
}

function StyleList({ items, answers, onAnswer, onFeedback }: StyleListProps) {
  return (
    <div className="aiel-item-list">
      {items.map((item, idx) => {
        const chosen = answers[item.id];
        const isCorrect = chosen === item.answer;
        return (
          <div key={item.id} className="aiel-item-card" style={{ animationDelay: `${idx * 0.06}s` }}>
            <p className="aiel-item-text">{item.text}</p>
            {!chosen ? (
              <div className="aiel-tag-row">
                {STYLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="aiel-choice-outline"
                    onClick={() => {
                      onAnswer(item.id, cat.id);
                      onFeedback(cat.id === item.answer);
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="aiel-feedback">
                {isCorrect ? (
                  <CheckCircle2 size={16} color={colors.teal} className="aiel-feedback-icon" />
                ) : (
                  <XCircle size={16} color={colors.coral} className="aiel-feedback-icon" />
                )}
                <p className="aiel-feedback-text">
                  Correct style: <strong style={{ color: colors.ink }}>
                    {STYLE_CATEGORIES.find((c) => c.id === item.answer)?.label}
                  </strong> -- {STYLE_CATEGORIES.find((c) => c.id === item.answer)?.hint}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface TaskListProps {
  items: TaskItem[];
  answers: TaskAnswerMap;
  onAnswer: (id: string, value: TaskTypeId) => void;
  onFeedback: (correct: boolean) => void;
}

function TaskList({ items, answers, onAnswer, onFeedback }: TaskListProps) {
  return (
    <div className="aiel-item-list">
      {items.map((item, idx) => {
        const chosen = answers[item.id];
        const isCorrect = chosen === item.answer;
        return (
          <div key={item.id} className="aiel-item-card" style={{ animationDelay: `${idx * 0.06}s` }}>
            <p className="aiel-item-text">{item.text}</p>
            {!chosen ? (
              <div className="aiel-choice-row">
                <button
                  className="aiel-choice-btn aiel-choice-teal"
                  onClick={() => {
                    onAnswer(item.id, "classification");
                    onFeedback("classification" === item.answer);
                  }}
                >
                  Classification
                </button>
                <button
                  className="aiel-choice-btn aiel-choice-coral"
                  onClick={() => {
                    onAnswer(item.id, "regression");
                    onFeedback("regression" === item.answer);
                  }}
                >
                  Regression
                </button>
              </div>
            ) : (
              <div className="aiel-feedback">
                {isCorrect ? (
                  <CheckCircle2 size={16} color={colors.teal} className="aiel-feedback-icon" />
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
              <div className="aiel-feedback">
                {isCorrect ? (
                  <CheckCircle2 size={16} color={colors.teal} className="aiel-feedback-icon" />
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

export default function MachineLearningBasicsLab() {
  const [current, setCurrent] = useState<number>(0); // 0..7 stages, 8 = certificate
  const [completed, setCompleted] = useState<boolean[]>(new Array(STAGE_META.length).fill(false));

  const [styleAnswers, setStyleAnswers] = useState<StyleAnswerMap>({});
  const [taskAnswers, setTaskAnswers] = useState<TaskAnswerMap>({});
  const [unsupervisedAnswers, setUnsupervisedAnswers] = useState<AnswerMap>({});
  const [reinforcementAnswers, setReinforcementAnswers] = useState<AnswerMap>({});
  const [linearAnswers, setLinearAnswers] = useState<AnswerMap>({});
  const [logisticAnswers, setLogisticAnswers] = useState<AnswerMap>({});
  const [treeAnswers, setTreeAnswers] = useState<AnswerMap>({});
  const [knnAnswers, setKnnAnswers] = useState<AnswerMap>({});

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

  const styleDone = Object.keys(styleAnswers).length === STYLE_ITEMS.length;
  const taskDone = Object.keys(taskAnswers).length === TASK_ITEMS.length;
  const unsupervisedDone = Object.keys(unsupervisedAnswers).length === UNSUPERVISED_ITEMS.length;
  const reinforcementDone = Object.keys(reinforcementAnswers).length === REINFORCEMENT_ITEMS.length;
  const linearDone = Object.keys(linearAnswers).length === LINEAR_REGRESSION_ITEMS.length;
  const logisticDone = Object.keys(logisticAnswers).length === LOGISTIC_REGRESSION_ITEMS.length;
  const treeDone = Object.keys(treeAnswers).length === DECISION_TREE_ITEMS.length;
  const knnDone = Object.keys(knnAnswers).length === KNN_ITEMS.length;

  const styleTallyCounts = useMemo(() => {
    const values = Object.values(styleAnswers);
    return {
      supervised: values.filter((v) => v === "supervised").length,
      unsupervised: values.filter((v) => v === "unsupervised").length,
      reinforcement: values.filter((v) => v === "reinforcement").length,
    };
  }, [styleAnswers]);

  const taskTallyCounts = useMemo(() => {
    const values = Object.values(taskAnswers);
    return {
      classification: values.filter((v) => v === "classification").length,
      regression: values.filter((v) => v === "regression").length,
    };
  }, [taskAnswers]);

  const scores = useMemo(() => {
    const styleCorrect = STYLE_ITEMS.filter((it) => styleAnswers[it.id] === it.answer).length;
    const taskCorrect = TASK_ITEMS.filter((it) => taskAnswers[it.id] === it.answer).length;
    const unsupervisedCorrect = UNSUPERVISED_ITEMS.filter((it) => unsupervisedAnswers[it.id] === it.answer).length;
    const reinforcementCorrect = REINFORCEMENT_ITEMS.filter((it) => reinforcementAnswers[it.id] === it.answer).length;
    const linearCorrect = LINEAR_REGRESSION_ITEMS.filter((it) => linearAnswers[it.id] === it.answer).length;
    const logisticCorrect = LOGISTIC_REGRESSION_ITEMS.filter((it) => logisticAnswers[it.id] === it.answer).length;
    const treeCorrect = DECISION_TREE_ITEMS.filter((it) => treeAnswers[it.id] === it.answer).length;
    const knnCorrect = KNN_ITEMS.filter((it) => knnAnswers[it.id] === it.answer).length;
    return {
      styleCorrect,
      taskCorrect,
      unsupervisedCorrect,
      reinforcementCorrect,
      linearCorrect,
      logisticCorrect,
      treeCorrect,
      knnCorrect,
    };
  }, [styleAnswers, taskAnswers, unsupervisedAnswers, reinforcementAnswers, linearAnswers, logisticAnswers, treeAnswers, knnAnswers]);

  const totalScore =
    scores.styleCorrect +
    scores.taskCorrect +
    scores.unsupervisedCorrect +
    scores.reinforcementCorrect +
    scores.linearCorrect +
    scores.logisticCorrect +
    scores.treeCorrect +
    scores.knnCorrect;

  const totalPossible =
    STYLE_ITEMS.length +
    TASK_ITEMS.length +
    UNSUPERVISED_ITEMS.length +
    REINFORCEMENT_ITEMS.length +
    LINEAR_REGRESSION_ITEMS.length +
    LOGISTIC_REGRESSION_ITEMS.length +
    DECISION_TREE_ITEMS.length +
    KNN_ITEMS.length;

  const resetAll = () => {
    setCurrent(0);
    setCompleted(new Array(STAGE_META.length).fill(false));
    setStyleAnswers({});
    setTaskAnswers({});
    setUnsupervisedAnswers({});
    setReinforcementAnswers({});
    setLinearAnswers({});
    setLogisticAnswers({});
    setTreeAnswers({});
    setKnnAnswers({});
    setToast(null);
  };

  const lastStageIdx = STAGE_META.length - 1;
  const certIdx = STAGE_META.length;

  return (
    <div className="aiel-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
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
          <h1 className="aiel-h1">Machine Learning Basics Lab</h1>
          <p className="aiel-subtitle">
            Sort learning styles, tell classification from regression, and work through the four
            core algorithms -- linear regression, logistic regression, decision trees, and KNN.
          </p>
        </div>

        {current <= lastStageIdx && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: ML Basics */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Which Learning Style?"
            subtitle="Sort each scenario into supervised, unsupervised, or reinforcement learning."
            progressLabel={`${Object.keys(styleAnswers).length}/${STYLE_ITEMS.length} sorted`}
            hero={
              <TallyHero
                categories={[
                  { label: "Supervised", count: styleTallyCounts.supervised, icon: BookOpen, from: "#FFD98A", to: colors.gold, shadow: colors.goldDeep },
                  { label: "Unsupervised", count: styleTallyCounts.unsupervised, icon: Layers, from: "#E7D3FC", to: colors.purple, shadow: colors.purpleDeep },
                  { label: "Reinforcement", count: styleTallyCounts.reinforcement, icon: Rocket, from: "#7EE6D6", to: colors.teal, shadow: colors.tealDeep },
                ]}
              />
            }
          >
            <StyleList items={STYLE_ITEMS} answers={styleAnswers} onAnswer={(id, value) => setStyleAnswers((p) => ({ ...p, [id]: value }))} onFeedback={fireToast} />
            <NavButtons
              backDisabled
              onBack={() => {}}
              nextDisabled={!styleDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: Supervised Learning */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Classification or Regression?"
            subtitle="Supervised learning splits into two tasks. Decide which one each example needs."
            progressLabel={`${Object.keys(taskAnswers).length}/${TASK_ITEMS.length} sorted`}
            hero={
              <TallyHero
                categories={[
                  { label: "Classification", count: taskTallyCounts.classification, icon: Tag, from: "#7EE6D6", to: colors.teal, shadow: colors.tealDeep },
                  { label: "Regression", count: taskTallyCounts.regression, icon: TrendingUp, from: "#FFAD8F", to: colors.coral, shadow: colors.coralDeep },
                ]}
              />
            }
          >
            <TaskList items={TASK_ITEMS} answers={taskAnswers} onAnswer={(id, value) => setTaskAnswers((p) => ({ ...p, [id]: value }))} onFeedback={fireToast} />
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!taskDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: Unsupervised Learning */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Find the Cluster"
            subtitle="No labels here -- just structure waiting to be discovered."
            progressLabel={`${Object.keys(unsupervisedAnswers).length}/${UNSUPERVISED_ITEMS.length} solved`}
            hero={<ClusterHero />}
          >
            <QuizList
              items={UNSUPERVISED_ITEMS}
              answers={unsupervisedAnswers}
              onAnswer={(id, value) => setUnsupervisedAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!unsupervisedDone}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: Reinforcement Learning */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Agent, Environment, Reward"
            subtitle="Reinforcement learning is a loop of action and feedback. Get familiar with its parts."
            progressLabel={`${Object.keys(reinforcementAnswers).length}/${REINFORCEMENT_ITEMS.length} solved`}
            hero={<LoopHero />}
          >
            <QuizList
              items={REINFORCEMENT_ITEMS}
              answers={reinforcementAnswers}
              onAnswer={(id, value) => setReinforcementAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!reinforcementDone}
              onNext={() => {
                markComplete(3);
                setCurrent(4);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 4: Linear Regression */}
        {current === 4 && (
          <StageShell
            tag={STAGE_META[4].tag}
            title="Fit the Line"
            subtitle="Linear regression predicts numbers by extending the best straight line through the data."
            progressLabel={`${Object.keys(linearAnswers).length}/${LINEAR_REGRESSION_ITEMS.length} solved`}
            hero={<RegressionLineHero />}
          >
            <QuizList
              items={LINEAR_REGRESSION_ITEMS}
              answers={linearAnswers}
              onAnswer={(id, value) => setLinearAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(3)}
              nextDisabled={!linearDone}
              onNext={() => {
                markComplete(4);
                setCurrent(5);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 5: Logistic Regression */}
        {current === 5 && (
          <StageShell
            tag={STAGE_META[5].tag}
            title="Cross the Threshold"
            subtitle="Logistic regression turns a score into a probability, then a probability into a class."
            progressLabel={`${Object.keys(logisticAnswers).length}/${LOGISTIC_REGRESSION_ITEMS.length} solved`}
            hero={<ThresholdGaugeHero />}
          >
            <QuizList
              items={LOGISTIC_REGRESSION_ITEMS}
              answers={logisticAnswers}
              onAnswer={(id, value) => setLogisticAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(4)}
              nextDisabled={!logisticDone}
              onNext={() => {
                markComplete(5);
                setCurrent(6);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 6: Decision Tree */}
        {current === 6 && (
          <StageShell
            tag={STAGE_META[6].tag}
            title="Follow the Branches"
            subtitle="A decision tree predicts by asking a sequence of yes/no questions. Trace the path."
            progressLabel={`${Object.keys(treeAnswers).length}/${DECISION_TREE_ITEMS.length} solved`}
            hero={<TreeHero />}
          >
            <QuizList
              items={DECISION_TREE_ITEMS}
              answers={treeAnswers}
              onAnswer={(id, value) => setTreeAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(5)}
              nextDisabled={!treeDone}
              onNext={() => {
                markComplete(6);
                setCurrent(7);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 7: KNN */}
        {current === 7 && (
          <StageShell
            tag={STAGE_META[7].tag}
            title="Vote With Neighbors"
            subtitle="KNN predicts by asking: what do the nearest existing points say?"
            progressLabel={`${Object.keys(knnAnswers).length}/${KNN_ITEMS.length} solved`}
            hero={<KnnHero />}
          >
            <QuizList
              items={KNN_ITEMS}
              answers={knnAnswers}
              onAnswer={(id, value) => setKnnAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(6)}
              nextDisabled={!knnDone}
              nextLabel="Finish Lab"
              onNext={() => {
                markComplete(7);
                setCurrent(certIdx);
              }}
            />
          </StageShell>
        )}

        {/* CERTIFICATE */}
        {current === certIdx && (
          <div className="aiel-cert">
            {Array.from({ length: 26 }, (_, i) => ({
              left: (i * 137) % 100,
              delay: (i % 10) * 0.22,
              duration: 2.6 + ((i * 7) % 10) / 5,
              color: [colors.gold, colors.coral, colors.purple, colors.teal, colors.goldDeep][i % 5],
              rotate: (i * 53) % 360,
            })).map((c, i) => (
              <div
                key={i}
                className="aiel-confetti-piece"
                style={{
                  left: `${c.left}%`,
                  background: c.color,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.duration}s`,
                  transform: `rotate(${c.rotate}deg)`,
                }}
              />
            ))}
            <div className="aiel-cert-badge">
              <Award size={36} color={colors.ink} />
            </div>
            <p className="aiel-cert-eyebrow">Certificate of Completion</p>
            <h2 className="aiel-cert-title">You've completed Module 3</h2>
            <p className="aiel-cert-desc">
              You sorted learning styles, told classification from regression, clustered unlabeled
              data, explored reward-driven learning, and worked through linear regression, logistic
              regression, decision trees, and KNN.
            </p>

            <div className="aiel-cert-score">
              <span className="aiel-cert-score-num">{totalScore}/{totalPossible}</span>
              <span className="aiel-cert-score-label">correct across all eight stages</span>
            </div>

            <div className="aiel-cert-grid">
              {STAGE_META.map((s) => (
                <div key={s.key} className="aiel-cert-item">
                  <CheckCircle2 size={14} color={colors.teal} />
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