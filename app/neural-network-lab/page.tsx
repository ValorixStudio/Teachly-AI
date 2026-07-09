"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Cpu,
  Target,
  Zap,
  Sigma,
  Layers,
  ArrowRightCircle,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  RotateCcw,
  Sparkles,
  Database,
  LucideIcon,
} from "lucide-react";

/*
 * NOTE ON THE HANDS-ON ACTIVATION LAB
 * ------------------------------------
 * Stage 4 ("Activation Functions") embeds your existing Activation Function
 * Learning Lab component (the one built from ActivationSelector, FormulaCard,
 * PropertiesCard, ActivationGraph, ComparisonGraph, applyActivation, and
 * properties). That file has been left completely untouched.
 *
 * Adjust the import path below so it points at wherever that component
 * actually lives in your project (e.g. it may be a page at
 * app/activation-lab/page.tsx, or you may want to move its default export
 * into its own component file like components/activation-lab/ActivationLab.tsx).
 */
import ActivationFunctionLab from "@/app/neural-lab/page";

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

  .aiel-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

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
  .aiel-subtitle { font-size: 15px; color: ${colors.muted}; max-width: 580px; margin: 4px auto 0 auto; line-height: 1.55; }

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
  .aiel-hero { display: flex; align-items: center; justify-content: center; margin-bottom: 22px; min-height: 96px; }
  .aiel-hero-caption { font-size: 12px; color: ${colors.muted}; text-align: center; max-width: 340px; font-weight: 600; line-height: 1.5; margin-top: 8px; }
  .aiel-hero-fade { animation: aiel-hero-in 0.5s ease forwards; }
  @keyframes aiel-hero-in { from { opacity: 0; transform: translateY(6px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* Biological neuron labels */
  .aiel-neuron-wrap { display: flex; flex-direction: column; align-items: center; }
  .aiel-neuron-tag { font-family: 'Menlo', 'Consolas', monospace; font-size: 10px; font-weight: 700; fill: ${colors.inkSoft}; }

  /* Artificial neuron flow chips */
  .aiel-anrow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .aiel-anchip {
    padding: 8px 14px; border-radius: 999px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft};
    font-family: 'Menlo', 'Consolas', monospace; font-size: 11.5px; font-weight: 700; color: ${colors.ink};
  }
  .aiel-anbox {
    display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 16px; border-radius: 14px;
    color: #fff; box-shadow: 0 5px 0 rgba(0,0,0,0.15);
  }
  .aiel-anbox-name { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 12px; }
  .aiel-an-arrow { color: ${colors.muted}; }

  /* Perceptron / XOR scatter captions share .aiel-hero-caption */

  /* Layers network diagram */
  .aiel-layer-col-label { font-size: 10px; font-weight: 700; fill: ${colors.muted}; font-family: 'Poppins', sans-serif; }

  /* Forward propagation flow */
  .aiel-fwd-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }
  .aiel-fwd-chip {
    padding: 9px 14px; border-radius: 12px; font-family: 'Menlo', 'Consolas', monospace; font-size: 11.5px;
    font-weight: 700; opacity: 0; animation: aiel-hero-in 0.45s ease forwards;
  }

  /* Hands-on activation stage wrapper */
  .aiel-handson-wrap { border-radius: 22px; border: 2px dashed ${colors.border}; background: ${colors.bgSoft}; padding: 18px; margin-bottom: 20px; }
  .aiel-handson-badge {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px;
    background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%); color: ${colors.ink};
    font-size: 12px; font-weight: 800; margin-bottom: 12px;
  }
  .aiel-handson-note { font-size: 13px; color: ${colors.inkSoft}; line-height: 1.6; margin: 0 0 16px 0; }
  .aiel-handson-frame { border-radius: 18px; overflow: hidden; background: ${colors.card}; border: 2px solid ${colors.borderSoft}; padding: 12px; }

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
    min-width: 100px; font-family: 'Menlo', 'Consolas', monospace;
  }
  .aiel-choice-btn:hover { transform: translateY(-1px); }
  .aiel-choice-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,0.18); }
  .aiel-choice-teal { background: linear-gradient(180deg, #7EE6D6 0%, ${colors.teal} 100%); }
  .aiel-choice-coral { background: linear-gradient(180deg, #FFAD8F 0%, ${colors.coral} 100%); }
  .aiel-choice-gold { background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%); }

  .aiel-feedback { display: flex; align-items: flex-start; gap: 8px; animation: aiel-card-in 0.3s ease forwards; }
  .aiel-feedback-text { font-size: 12px; color: ${colors.muted}; margin: 0; line-height: 1.5; }
  .aiel-feedback-icon { margin-top: 2px; flex-shrink: 0; }

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

interface QuizItem {
  id: string;
  code?: string;
  question: string;
  options: string[];
  answer: string;
  explain: string;
}

type AnswerMap = Record<string, string>;

/* ---------------------------- CONTENT DATA ---------------------------- */

const STAGE_META: StageMetaItem[] = [
  { key: "biological-neuron", title: "Biological Neuron", icon: Brain, tag: "Stage 1 - Nature's Original" },
  { key: "artificial-neuron", title: "Artificial Neuron", icon: Cpu, tag: "Stage 2 - The Math Version" },
  { key: "perceptron", title: "Perceptron", icon: Target, tag: "Stage 3 - Draw the Line" },
  { key: "non-linearity", title: "Non-Linearity", icon: Zap, tag: "Stage 4 - Why Bend the Line?" },
  { key: "activation-functions", title: "Activation Functions", icon: Sigma, tag: "Stage 5 - Hands-On Lab" },
  { key: "layers", title: "Layers", icon: Layers, tag: "Stage 6 - Stack Them Up" },
  { key: "forward-propagation", title: "Forward Propagation", icon: ArrowRightCircle, tag: "Stage 7 - Follow the Signal" },
];

const BIO_NEURON_ITEMS: QuizItem[] = [
  { id: "b1", question: "Which part of a biological neuron receives incoming signals from other neurons?", options: ["Dendrites", "Axon", "Synapse"], answer: "Dendrites", explain: "Dendrites branch out from the cell body and act as the neuron's receiving antennae." },
  { id: "b2", question: "What is the small gap where one neuron passes a signal to the next called?", options: ["Synapse", "Nucleus", "Axon terminal"], answer: "Synapse", explain: "The synapse is the junction where a signal crosses from one neuron to the next." },
  { id: "b3", question: "What does the axon do?", options: ["Carries the electrical signal away from the cell body", "Receives signals from other neurons", "Stores the cell's genetic material"], answer: "Carries the electrical signal away from the cell body", explain: "Once a neuron fires, the axon is the long fiber that transmits the signal onward." },
  { id: "b4", question: "A biological neuron only fires a signal once its combined inputs cross a certain ______.", options: ["threshold", "color", "weight"], answer: "threshold", explain: "This all-or-nothing firing behaviour is exactly what inspired activation functions in artificial neurons." },
  { id: "b5", question: "Which best describes how a neuron's cell body (soma) handles signals from many dendrites?", options: ["It sums them up before deciding whether to fire", "It only listens to the loudest single input", "It ignores every input except the first one"], answer: "It sums them up before deciding whether to fire", explain: "The soma combines incoming signals, and only fires onward if the combined signal is strong enough." },
];

const ARTIFICIAL_NEURON_ITEMS: QuizItem[] = [
  { id: "a1", code: "Biological:  dendrites -> soma -> axon\nArtificial:  inputs -> weighted sum -> activation", question: "In an artificial neuron, what plays the role of dendrites?", options: ["Inputs (x)", "Weights (w)", "Bias (b)"], answer: "Inputs (x)", explain: "Inputs are the values flowing in, just like dendrites are where biological signals arrive." },
  { id: "a2", question: "What role do weights play in an artificial neuron?", options: ["They scale how much each input matters", "They store the neuron's memory of past runs", "They simply count how many inputs there are"], answer: "They scale how much each input matters", explain: "A larger weight means that input has a bigger influence on the neuron's output." },
  { id: "a3", code: "z = w1*x1 + w2*x2 + b", question: "What is 'b' called in this formula?", options: ["Bias", "Weight", "Activation"], answer: "Bias", explain: "The bias is an extra learnable value that shifts the neuron's decision, independent of any input." },
  { id: "a4", question: "What does an artificial neuron do with its weighted sum before producing an output?", options: ["Passes it through an activation function", "Deletes it and starts over", "Multiplies it by zero"], answer: "Passes it through an activation function", explain: "The raw weighted sum (z) is transformed by an activation function to produce the final output (a)." },
  { id: "a5", question: "Which part of a biological neuron does the artificial neuron's 'weighted sum' step most resemble?", options: ["The soma summing incoming signals", "The synapse gap between neurons", "The nucleus storing DNA"], answer: "The soma summing incoming signals", explain: "Just like the soma combines dendrite signals, the weighted sum combines all the inputs and weights." },
];

const PERCEPTRON_ITEMS: QuizItem[] = [
  { id: "p1", question: "What is a perceptron?", options: ["The simplest type of artificial neuron, using a step-function output", "A biological brain cell", "A type of database used to store weights"], answer: "The simplest type of artificial neuron, using a step-function output", explain: "A perceptron is the most basic artificial neuron: weighted sum, then a hard yes/no step decision." },
  { id: "p2", code: "output = 1 if z >= 0\noutput = 0 if z < 0", question: "What kind of activation does the classic perceptron use?", options: ["A step function", "A smooth curve", "No activation at all"], answer: "A step function", explain: "The perceptron fires a clean 1 or 0 depending on which side of zero its weighted sum lands on." },
  { id: "p3", question: "What is a perceptron fundamentally trying to do with its inputs?", options: ["Draw a straight line (or flat plane) that separates two classes", "Predict a smoothly varying continuous number", "Group unlabeled data with no target classes"], answer: "Draw a straight line (or flat plane) that separates two classes", explain: "A perceptron's decision boundary is always a straight line -- or in higher dimensions, a flat plane." },
  { id: "p4", question: "What is a major limitation of a single perceptron?", options: ["It can only solve problems that are linearly separable", "It cannot store any weights between runs", "It requires no training data whatsoever"], answer: "It can only solve problems that are linearly separable", explain: "If no straight line can separate the classes, a single perceptron simply cannot learn the task." },
  { id: "p5", question: "How does a perceptron typically learn its weights?", options: ["By adjusting weights based on its prediction errors", "By randomly guessing forever with no feedback", "By copying the weights of another neuron"], answer: "By adjusting weights based on its prediction errors", explain: "Each time it misclassifies a point, the perceptron nudges its weights to reduce that error." },
];

const NON_LINEARITY_ITEMS: QuizItem[] = [
  { id: "n1", code: "XOR truth table:\n(0,0) -> 0\n(0,1) -> 1\n(1,0) -> 1\n(1,1) -> 0", question: "Why can't a single perceptron solve the XOR problem?", options: ["XOR's two classes can't be separated by any single straight line", "XOR has too many inputs to compute", "XOR only works with negative numbers"], answer: "XOR's two classes can't be separated by any single straight line", explain: "Plot the four XOR points and you'll find no straight line can put the 0s on one side and 1s on the other." },
  { id: "n2", question: "What happens if you stack multiple layers of neurons but skip activation functions entirely?", options: ["The whole network collapses into one single linear function", "The network becomes infinitely more powerful", "Nothing changes about what the network can learn"], answer: "The whole network collapses into one single linear function", explain: "Composing linear functions together is still just linear -- depth alone adds nothing without non-linearity." },
  { id: "n3", question: "Why do real-world patterns often require non-linear models?", options: ["Because most real relationships aren't simple straight lines", "Because computers can't perform addition reliably", "Because non-linear models always use less memory"], answer: "Because most real relationships aren't simple straight lines", explain: "Prices, images, language, and most natural signals bend and curve in ways a straight line can't capture." },
  { id: "n4", question: "What is the role of an activation function in solving problems like XOR?", options: ["It introduces the non-linearity needed to bend decision boundaries", "It removes all randomness from the training process", "It permanently stores the training dataset"], answer: "It introduces the non-linearity needed to bend decision boundaries", explain: "Non-linear activations let stacked layers curve and fold space, making non-linearly-separable problems solvable." },
  { id: "n5", question: "Which best describes 'linear separability'?", options: ["Whether two classes can be split apart by a single straight line or flat plane", "Whether a dataset happens to have exactly two columns", "Whether a model only uses whole numbers"], answer: "Whether two classes can be split apart by a single straight line or flat plane", explain: "It's purely a geometric property of the data -- can one straight cut separate the classes or not." },
];

const LAYER_ITEMS: QuizItem[] = [
  { id: "l1", question: "What is the 'input layer' of a neural network responsible for?", options: ["Receiving the raw data fed into the network", "Making the network's final prediction", "Permanently storing all the trained weights"], answer: "Receiving the raw data fed into the network", explain: "The input layer is simply where the raw feature values enter the network -- no computation happens yet." },
  { id: "l2", question: "What is a 'hidden layer'?", options: ["A layer between input and output that learns intermediate representations", "A layer that is invisible to the programmer at runtime", "A layer that only exists while the network is being tested"], answer: "A layer between input and output that learns intermediate representations", explain: "Hidden layers transform the data step by step, building up increasingly useful internal representations." },
  { id: "l3", code: "Input layer: 4 neurons\nHidden layer: 3 neurons\nOutput layer: 1 neuron", question: "How many layers does this network have in total?", options: ["3", "2", "4"], answer: "3", explain: "Input, hidden, and output together make three layers, even though the input layer does no computing." },
  { id: "l4", question: "Why do deeper networks (more hidden layers) often learn more complex patterns?", options: ["Each added layer can build more abstract representations from the layer before it", "Extra layers make the network train instantly", "Extra layers always use less memory than fewer layers"], answer: "Each added layer can build more abstract representations from the layer before it", explain: "Later layers combine what earlier layers detected, letting the network represent increasingly rich patterns." },
  { id: "l5", question: "In a fully connected (dense) layer, how is each neuron connected to the previous layer?", options: ["It receives input from every neuron in the previous layer", "It receives input from exactly one neuron only", "It receives no input from the previous layer at all"], answer: "It receives input from every neuron in the previous layer", explain: "That's exactly what makes a layer 'fully connected' -- every neuron sees every output from before it." },
];

const FORWARD_PROP_ITEMS: QuizItem[] = [
  { id: "f1", question: "What is 'forward propagation'?", options: ["Passing input data through the network layer by layer to produce an output", "Sending prediction errors backward to update the weights", "Deleting neurons that are no longer needed"], answer: "Passing input data through the network layer by layer to produce an output", explain: "Forward propagation is simply the network's way of turning an input into a prediction." },
  { id: "f2", code: "Input -> Layer 1 -> Layer 2 -> Output", question: "In what order does forward propagation compute values?", options: ["From the input layer toward the output layer", "From the output layer backward to the input", "In a different random order every time"], answer: "From the input layer toward the output layer", explain: "Values flow strictly forward -- input first, then each hidden layer in turn, ending at the output." },
  { id: "f3", question: "At each layer during forward propagation, what two steps happen to the incoming values?", options: ["A weighted sum is computed, then an activation function is applied", "The values are deleted and replaced with random numbers", "The values are simply sorted from smallest to largest"], answer: "A weighted sum is computed, then an activation function is applied", explain: "Every layer repeats the same two-step pattern: combine with weights and bias, then activate." },
  { id: "f4", question: "Why is it called 'forward' propagation?", options: ["Because information flows in one direction, from input toward output", "Because it only runs correctly on certain days", "Because it moves data backward through time"], answer: "Because information flows in one direction, from input toward output", explain: "The name simply describes the direction data travels -- forward through the network's layers." },
  { id: "f5", question: "What is the final result of forward propagation?", options: ["The network's prediction/output for the given input", "The original raw input data, completely unchanged", "A list of the names of every neuron in the network"], answer: "The network's prediction/output for the given input", explain: "Once the signal reaches the output layer, whatever comes out is the network's prediction." },
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

function BiologicalNeuronHero() {
  return (
    <div className="aiel-neuron-wrap aiel-hero-fade">
      <svg viewBox="0 0 300 100" width="100%" height="100" preserveAspectRatio="xMidYMid meet">
        {/* dendrites */}
        {[20, 30, 40, 50, 60].map((y, i) => (
          <line key={i} x1={10} y1={y - 10} x2={55} y2={50} stroke={colors.tealDeep} strokeWidth="2" opacity="0.8" />
        ))}
        {/* soma */}
        <circle cx={70} cy={50} r={22} fill={colors.gold} stroke={colors.goldDeep} strokeWidth="2.5" />
        {/* axon */}
        <line x1={92} y1={50} x2={230} y2={50} stroke={colors.purpleDeep} strokeWidth="3" />
        {/* axon terminals / synapse */}
        <line x1={230} y1={50} x2={260} y2={30} stroke={colors.coralDeep} strokeWidth="2" />
        <line x1={230} y1={50} x2={260} y2={50} stroke={colors.coralDeep} strokeWidth="2" />
        <line x1={230} y1={50} x2={260} y2={70} stroke={colors.coralDeep} strokeWidth="2" />
        <circle cx={260} cy={30} r={4} fill={colors.coral} />
        <circle cx={260} cy={50} r={4} fill={colors.coral} />
        <circle cx={260} cy={70} r={4} fill={colors.coral} />
        <text x={20} y={14} className="aiel-neuron-tag">Dendrites</text>
        <text x={52} y={82} className="aiel-neuron-tag">Soma</text>
        <text x={130} y={42} className="aiel-neuron-tag">Axon</text>
        <text x={238} y={90} className="aiel-neuron-tag">Synapse</text>
      </svg>
      <p className="aiel-hero-caption">Dendrites receive signals, the soma combines them, and the axon fires the result onward across a synapse.</p>
    </div>
  );
}

function ArtificialNeuronHero() {
  return (
    <div className="aiel-anrow aiel-hero-fade">
      <span className="aiel-anchip">x1, x2</span>
      <ChevronRight size={16} className="aiel-an-arrow" />
      <div className="aiel-anbox" style={{ background: `linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%)`, boxShadow: `0 5px 0 ${colors.goldDeep}` }}>
        <Sigma size={18} color="#fff" />
        <span className="aiel-anbox-name">Weighted Sum</span>
      </div>
      <ChevronRight size={16} className="aiel-an-arrow" />
      <div className="aiel-anbox" style={{ background: `linear-gradient(180deg, #C9A6FF 0%, ${colors.purple} 100%)`, boxShadow: `0 5px 0 ${colors.purpleDeep}` }}>
        <Zap size={18} color="#fff" />
        <span className="aiel-anbox-name">Activation</span>
      </div>
      <ChevronRight size={16} className="aiel-an-arrow" />
      <span className="aiel-anchip">output</span>
    </div>
  );
}

function PerceptronHero() {
  const classA = [
    { x: 30, y: 20 },
    { x: 55, y: 32 },
    { x: 40, y: 45 },
  ];
  const classB = [
    { x: 200, y: 55 },
    { x: 230, y: 40 },
    { x: 215, y: 70 },
  ];
  return (
    <div className="aiel-neuron-wrap aiel-hero-fade">
      <svg viewBox="0 0 260 90" width="100%" height="90" preserveAspectRatio="xMidYMid meet">
        <line x1="110" y1="0" x2="150" y2="90" stroke={colors.goldDeep} strokeWidth="2.5" strokeDasharray="6 4" />
        {classA.map((p, i) => (
          <circle key={`a-${i}`} cx={p.x} cy={p.y} r={6} fill={colors.teal} stroke={colors.tealDeep} strokeWidth="2" />
        ))}
        {classB.map((p, i) => (
          <circle key={`b-${i}`} cx={p.x} cy={p.y} r={6} fill={colors.coral} stroke={colors.coralDeep} strokeWidth="2" />
        ))}
      </svg>
      <p className="aiel-hero-caption">A perceptron draws one straight decision line, sorting everything on the left from everything on the right.</p>
    </div>
  );
}

function NonLinearityHero() {
  const zeros = [
    { x: 50, y: 20 },
    { x: 200, y: 70 },
  ];
  const ones = [
    { x: 50, y: 70 },
    { x: 200, y: 20 },
  ];
  return (
    <div className="aiel-neuron-wrap aiel-hero-fade">
      <svg viewBox="0 0 250 90" width="100%" height="90" preserveAspectRatio="xMidYMid meet">
        {zeros.map((p, i) => (
          <circle key={`z-${i}`} cx={p.x} cy={p.y} r={7} fill={colors.purple} stroke={colors.purpleDeep} strokeWidth="2" />
        ))}
        {ones.map((p, i) => (
          <circle key={`o-${i}`} cx={p.x} cy={p.y} r={7} fill={colors.gold} stroke={colors.goldDeep} strokeWidth="2" />
        ))}
        <line x1="20" y1="10" x2="230" y2="80" stroke={colors.coralDeep} strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
        <line x1="20" y1="80" x2="230" y2="10" stroke={colors.coralDeep} strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
        <text x="105" y="50" className="aiel-neuron-tag" fill={colors.coralDeep}>no line works!</text>
      </svg>
      <p className="aiel-hero-caption">XOR's purple and gold points are crossed diagonally -- no single straight line can ever separate them.</p>
    </div>
  );
}

function LayersHero() {
  const inputYs = [15, 35, 55, 75];
  const hiddenYs = [22, 45, 68];
  const outputYs = [45];
  return (
    <div className="aiel-neuron-wrap aiel-hero-fade">
      <svg viewBox="0 0 260 90" width="100%" height="90" preserveAspectRatio="xMidYMid meet">
        {inputYs.map((iy) =>
          hiddenYs.map((hy, hi) => (
            <line key={`ih-${iy}-${hi}`} x1={40} y1={iy} x2={130} y2={hy} stroke={colors.borderSoft} strokeWidth="1.5" />
          ))
        )}
        {hiddenYs.map((hy) =>
          outputYs.map((oy, oi) => (
            <line key={`ho-${hy}-${oi}`} x1={130} y1={hy} x2={220} y2={oy} stroke={colors.borderSoft} strokeWidth="1.5" />
          ))
        )}
        {inputYs.map((y, i) => (
          <circle key={`i-${i}`} cx={40} cy={y} r={7} fill={colors.teal} stroke={colors.tealDeep} strokeWidth="2" />
        ))}
        {hiddenYs.map((y, i) => (
          <circle key={`h-${i}`} cx={130} cy={y} r={7} fill={colors.gold} stroke={colors.goldDeep} strokeWidth="2" />
        ))}
        {outputYs.map((y, i) => (
          <circle key={`o-${i}`} cx={220} cy={y} r={7} fill={colors.coral} stroke={colors.coralDeep} strokeWidth="2" />
        ))}
        <text x={20} y={90} className="aiel-layer-col-label">Input</text>
        <text x={110} y={90} className="aiel-layer-col-label">Hidden</text>
        <text x={200} y={90} className="aiel-layer-col-label">Output</text>
      </svg>
      <p className="aiel-hero-caption">Every neuron in a fully connected layer receives input from every neuron in the layer before it.</p>
    </div>
  );
}

function ForwardPropHero() {
  const steps = [
    { label: "Input", from: "#7EE6D6", to: colors.teal },
    { label: "z1 = w.x+b", from: "#FFD98A", to: colors.gold },
    { label: "a1 = f(z1)", from: "#C9A6FF", to: colors.purple },
    { label: "Output", from: "#FFAD8F", to: colors.coral },
  ];
  return (
    <div className="aiel-fwd-row">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <span
            className="aiel-fwd-chip"
            style={{ background: `linear-gradient(180deg, ${s.from} 0%, ${s.to} 100%)`, color: "#fff", animationDelay: `${i * 0.12}s` }}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && <ChevronRight size={16} color={colors.muted} />}
        </React.Fragment>
      ))}
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

export default function NeuralNetworksLab() {
  const ACTIVATION_STAGE_IDX = 4;
  const lastStageIdx = STAGE_META.length - 1; // 6
  const certIdx = STAGE_META.length; // 7

  const [current, setCurrent] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean[]>(new Array(STAGE_META.length).fill(false));

  const [bioAnswers, setBioAnswers] = useState<AnswerMap>({});
  const [artificialAnswers, setArtificialAnswers] = useState<AnswerMap>({});
  const [perceptronAnswers, setPerceptronAnswers] = useState<AnswerMap>({});
  const [nonLinearAnswers, setNonLinearAnswers] = useState<AnswerMap>({});
  const [layerAnswers, setLayerAnswers] = useState<AnswerMap>({});
  const [forwardAnswers, setForwardAnswers] = useState<AnswerMap>({});

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

  const bioDone = Object.keys(bioAnswers).length === BIO_NEURON_ITEMS.length;
  const artificialDone = Object.keys(artificialAnswers).length === ARTIFICIAL_NEURON_ITEMS.length;
  const perceptronDone = Object.keys(perceptronAnswers).length === PERCEPTRON_ITEMS.length;
  const nonLinearDone = Object.keys(nonLinearAnswers).length === NON_LINEARITY_ITEMS.length;
  const layerDone = Object.keys(layerAnswers).length === LAYER_ITEMS.length;
  const forwardDone = Object.keys(forwardAnswers).length === FORWARD_PROP_ITEMS.length;

  const scores = useMemo(() => {
    const bioCorrect = BIO_NEURON_ITEMS.filter((it) => bioAnswers[it.id] === it.answer).length;
    const artificialCorrect = ARTIFICIAL_NEURON_ITEMS.filter((it) => artificialAnswers[it.id] === it.answer).length;
    const perceptronCorrect = PERCEPTRON_ITEMS.filter((it) => perceptronAnswers[it.id] === it.answer).length;
    const nonLinearCorrect = NON_LINEARITY_ITEMS.filter((it) => nonLinearAnswers[it.id] === it.answer).length;
    const layerCorrect = LAYER_ITEMS.filter((it) => layerAnswers[it.id] === it.answer).length;
    const forwardCorrect = FORWARD_PROP_ITEMS.filter((it) => forwardAnswers[it.id] === it.answer).length;
    return { bioCorrect, artificialCorrect, perceptronCorrect, nonLinearCorrect, layerCorrect, forwardCorrect };
  }, [bioAnswers, artificialAnswers, perceptronAnswers, nonLinearAnswers, layerAnswers, forwardAnswers]);

  // The hands-on Activation Functions stage is exploratory and isn't scored like the quiz stages.
  const totalScore =
    scores.bioCorrect + scores.artificialCorrect + scores.perceptronCorrect + scores.nonLinearCorrect + scores.layerCorrect + scores.forwardCorrect;
  const totalPossible =
    BIO_NEURON_ITEMS.length + ARTIFICIAL_NEURON_ITEMS.length + PERCEPTRON_ITEMS.length + NON_LINEARITY_ITEMS.length + LAYER_ITEMS.length + FORWARD_PROP_ITEMS.length;

  const resetAll = () => {
    setCurrent(0);
    setCompleted(new Array(STAGE_META.length).fill(false));
    setBioAnswers({});
    setArtificialAnswers({});
    setPerceptronAnswers({});
    setNonLinearAnswers({});
    setLayerAnswers({});
    setForwardAnswers({});
    setToast(null);
  };

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
          <h1 className="aiel-h1">Neural Networks Lab</h1>
          <p className="aiel-subtitle">
            Follow the path from a biological neuron all the way to forward propagation -- with a full
            hands-on activation function playground built right in.
          </p>
        </div>

        {current <= lastStageIdx && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: Biological Neuron */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="The Biological Neuron"
            subtitle="Before there was math, there was biology. Every artificial neuron borrows its shape from this."
            progressLabel={`${Object.keys(bioAnswers).length}/${BIO_NEURON_ITEMS.length} solved`}
            hero={<BiologicalNeuronHero />}
          >
            <QuizList items={BIO_NEURON_ITEMS} answers={bioAnswers} onAnswer={(id, value) => setBioAnswers((p) => ({ ...p, [id]: value }))} onFeedback={fireToast} />
            <NavButtons
              backDisabled
              onBack={() => {}}
              nextDisabled={!bioDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: Artificial Neuron */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="The Artificial Neuron"
            subtitle="Inputs, weights, a bias, and an activation -- the math translation of dendrites, synapses, and a firing threshold."
            progressLabel={`${Object.keys(artificialAnswers).length}/${ARTIFICIAL_NEURON_ITEMS.length} solved`}
            hero={<ArtificialNeuronHero />}
          >
            <QuizList
              items={ARTIFICIAL_NEURON_ITEMS}
              answers={artificialAnswers}
              onAnswer={(id, value) => setArtificialAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!artificialDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: Perceptron */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="The Perceptron"
            subtitle="The simplest possible neural network: one neuron, one straight decision line."
            progressLabel={`${Object.keys(perceptronAnswers).length}/${PERCEPTRON_ITEMS.length} solved`}
            hero={<PerceptronHero />}
          >
            <QuizList
              items={PERCEPTRON_ITEMS}
              answers={perceptronAnswers}
              onAnswer={(id, value) => setPerceptronAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!perceptronDone}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: Need for Non-Linearity */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="The Need for Non-Linearity"
            subtitle="Some problems just can't be split by a straight line -- that's exactly where activation functions earn their keep."
            progressLabel={`${Object.keys(nonLinearAnswers).length}/${NON_LINEARITY_ITEMS.length} solved`}
            hero={<NonLinearityHero />}
          >
            <QuizList
              items={NON_LINEARITY_ITEMS}
              answers={nonLinearAnswers}
              onAnswer={(id, value) => setNonLinearAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!nonLinearDone}
              onNext={() => {
                markComplete(3);
                setCurrent(4);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 4: Activation Functions -- HANDS ON */}
        {current === ACTIVATION_STAGE_IDX && (
          <StageShell
            tag={STAGE_META[4].tag}
            title="Activation Functions -- Try It Yourself"
            subtitle="This is the full interactive lab: build a neuron, pick an activation function, and watch the graphs respond live."
          >
            <div className="aiel-handson-wrap">
              <span className="aiel-handson-badge">
                <Sparkles size={14} /> Hands-on playground
              </span>
              <p className="aiel-handson-note">
                Everything below is fully interactive. Add inputs, tweak weights and bias, switch between
                activation functions, and compare their curves side by side -- exactly the same lab you've
                already built, dropped straight into this stage.
              </p>
              <div className="aiel-handson-frame">
                <ActivationFunctionLab />
              </div>
            </div>
            <NavButtons
              onBack={() => setCurrent(3)}
              onNext={() => {
                markComplete(4);
                setCurrent(5);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 5: Layers */}
        {current === 5 && (
          <StageShell
            tag={STAGE_META[5].tag}
            title="Layers"
            subtitle="One neuron alone can't do much. Stack them into layers, and the network starts learning richer patterns."
            progressLabel={`${Object.keys(layerAnswers).length}/${LAYER_ITEMS.length} solved`}
            hero={<LayersHero />}
          >
            <QuizList items={LAYER_ITEMS} answers={layerAnswers} onAnswer={(id, value) => setLayerAnswers((p) => ({ ...p, [id]: value }))} onFeedback={fireToast} />
            <NavButtons
              onBack={() => setCurrent(4)}
              nextDisabled={!layerDone}
              onNext={() => {
                markComplete(5);
                setCurrent(6);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 6: Forward Propagation */}
        {current === 6 && (
          <StageShell
            tag={STAGE_META[6].tag}
            title="Forward Propagation"
            subtitle="Watch how a single input travels through every layer, transforming step by step into a final prediction."
            progressLabel={`${Object.keys(forwardAnswers).length}/${FORWARD_PROP_ITEMS.length} solved`}
            hero={<ForwardPropHero />}
          >
            <QuizList
              items={FORWARD_PROP_ITEMS}
              answers={forwardAnswers}
              onAnswer={(id, value) => setForwardAnswers((p) => ({ ...p, [id]: value }))}
              onFeedback={fireToast}
            />
            <NavButtons
              onBack={() => setCurrent(5)}
              nextDisabled={!forwardDone}
              nextLabel="Finish Lab"
              onNext={() => {
                markComplete(6);
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
            <h2 className="aiel-cert-title">You've completed Module 4</h2>
            <p className="aiel-cert-desc">
              You traced the path from biological neurons to artificial ones, built perceptrons, discovered
              why non-linearity matters, explored activation functions hands-on, stacked layers, and followed
              a signal through forward propagation.
            </p>

            <div className="aiel-cert-score">
              <span className="aiel-cert-score-num">{totalScore}/{totalPossible}</span>
              <span className="aiel-cert-score-label">correct across six quiz stages</span>
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