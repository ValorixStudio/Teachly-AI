"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon,
  Workflow,
  Brain,
  Sparkles,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";

/* ============================================================================
   COLOR SYSTEM -- matches the AI Foundations Lab exactly
============================================================================ */

const colors = {
  bg: "#F0F4F8",
  bgSoft: "#E7ECF3",
  card: "#FFFFFF",
  cardAlt: "#F8FAFC",
  border: "rgba(148,163,184,0.25)",
  borderSoft: "rgba(148,163,184,0.18)",
  gold: "#F59E0B",
  goldDeep: "#B45309",
  coral: "#F43F5E",
  coralDeep: "#BE123C",
  purple: "#8B5CF6",
  purpleDeep: "#6D28D9",
  teal: "#06B6D4",
  tealDeep: "#0E7490",
  ink: "#1E293B",
  inkSoft: "#475569",
  muted: "#94A3B8",
  codeBg: "#211D3A",
  codeText: "#F3EFFF",
  indigo: "#6366F1",
  indigoDeep: "#4F46E5",
  indigoLight: "#A5B4FC",
  emerald: "#10B981",
};

/* ============================================================================
   TYPES
============================================================================ */

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
  subtitle: string;
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

/* ============================================================================
   CONTENT DATA
============================================================================ */

const STAGE_META: StageMetaItem[] = [
  {
    key: "cnn",
    title: "CNN",
    icon: ImageIcon,
    tag: "Stage 1 · Spot the Pattern",
    subtitle: "CNNs slide small filters across an image, hunting for specific local patterns.",
  },
  {
    key: "rnn",
    title: "RNN",
    icon: Workflow,
    tag: "Stage 2 · Follow the Sequence",
    subtitle: "RNNs process data one step at a time, carrying a running memory forward.",
  },
  {
    key: "lstm",
    title: "LSTM",
    icon: Brain,
    tag: "Stage 3 · Remember Longer",
    subtitle: "LSTMs add gates and a memory cell so important details survive much longer sequences.",
  },
  {
    key: "transformers",
    title: "Transformers",
    icon: Sparkles,
    tag: "Stage 4 · Pay Attention",
    subtitle: "Transformers look at a whole sequence at once and use attention to connect distant words.",
  },
];

const CNN_ITEMS: QuizItem[] = [
  { id: "c1", code: "Filter: detects vertical edges\nImage patch:\n0 0 9 9\n0 0 9 9\n0 0 9 9", question: "Would this vertical-edge filter activate strongly on this patch?", options: ["Yes -- there's a sharp vertical change", "No -- the patch is completely uniform", "Only if the patch were spinning"], answer: "Yes -- there's a sharp vertical change", explain: "The values jump from low to high right down the middle of the patch -- exactly the vertical edge this filter is built to detect." },
  { id: "c2", question: "Why does a CNN slide the same small filter across the whole image instead of examining everything at once?", options: ["So it can detect the same pattern, like an edge, no matter where it appears", "To make the image file smaller on disk", "Because computers can't display whole images"], answer: "So it can detect the same pattern, like an edge, no matter where it appears", explain: "A filter that finds an edge in the top-left should also recognise that same edge in the bottom-right -- sliding it across achieves exactly that." },
  { id: "c3", code: "Layer 1: detects edges\nLayer 2: combines edges into shapes\nLayer 3: combines shapes into objects", question: "What is this layer-by-layer pattern called in a CNN?", options: ["Building up complexity layer by layer", "Random noise reduction", "Simple data compression"], answer: "Building up complexity layer by layer", explain: "Each layer combines the patterns found by the layer before it, gradually moving from simple edges to full objects." },
  { id: "c4", question: "Which task is a CNN especially well suited for?", options: ["Classifying photos of animals", "Predicting next month's rainfall from a table of numbers", "Sorting a plain list of numbers"], answer: "Classifying photos of animals", explain: "CNNs are built specifically to find spatial patterns in grid-like data such as images." },
  { id: "c5", question: "What do the early layers of a CNN typically detect, compared to the later layers?", options: ["Early layers detect simple edges and textures; later layers detect whole objects", "Early layers detect whole objects; later layers detect edges", "Both layers detect the exact same thing"], answer: "Early layers detect simple edges and textures; later layers detect whole objects", explain: "Complexity builds up gradually -- simple patterns first, combined into increasingly complete objects later." },
];

const RNN_ITEMS: QuizItem[] = [
  { id: "r1", code: 'Sentence: "The clouds are heavy, so it will probably ___"', question: "Why does filling in this blank well require remembering the earlier words?", options: ["Because the missing word's meaning depends on the earlier context", "Because only the very last word ever matters", "Because word order never affects meaning"], answer: "Because the missing word's meaning depends on the earlier context", explain: "'Heavy clouds' sets up an expectation ('rain') that only makes sense if the earlier words are still remembered." },
  { id: "r2", question: "What does an RNN carry forward from one step of a sequence to the next?", options: ["A running memory of what it has seen so far", "A full copy of the entire training dataset", "Nothing -- each step is treated independently"], answer: "A running memory of what it has seen so far", explain: "That carried-forward memory is exactly what lets an RNN understand each new step in the context of what came before." },
  { id: "r3", code: "Stock prices over 5 days: 100, 102, 101, 105, 108", question: "Why would an RNN be a natural fit for predicting tomorrow's price?", options: ["The prices form a sequence where order and trend matter", "The order of the days doesn't matter at all", "Stock prices are images, not sequences"], answer: "The prices form a sequence where order and trend matter", explain: "An RNN is built to process ordered sequences, using the recent trend to inform its next prediction." },
  { id: "r4", question: "Which task fits an RNN's step-by-step memory best?", options: ["Predicting the next word in a sentence", "Classifying a single standalone photo", "Sorting a list of numbers into order"], answer: "Predicting the next word in a sentence", explain: "Language is inherently sequential, which is exactly the kind of data an RNN's memory is designed to handle." },
  { id: "r5", question: "What is a well-known weakness of a basic RNN?", options: ["Its memory fades quickly over long sequences", "It cannot process sequences at all", "It only works on images, never on text"], answer: "Its memory fades quickly over long sequences", explain: "By the time a basic RNN reaches word fifty of a paragraph, it has often forgotten what happened at word two -- exactly the gap LSTMs were built to close." },
];

const LSTM_ITEMS: QuizItem[] = [
  { id: "l1", code: 'Sentence: "The trophy the athlete, who trained for ten long years, finally won was heavy."', question: "Why might a plain RNN struggle to connect 'trophy' with 'was heavy' here?", options: ["Too many words come between them for its short memory to hold on", "LSTMs and plain RNNs behave identically here", "The sentence has no long-distance connection at all"], answer: "Too many words come between them for its short memory to hold on", explain: "The gap between 'trophy' and 'was heavy' is exactly the kind of long-distance dependency a plain RNN's fading memory tends to lose." },
  { id: "l2", question: "What extra structure does an LSTM add to fix a plain RNN's fading memory?", options: ["Gates that learn what to keep, forget, and pass onward", "A much larger vocabulary of words", "More color channels in its training images"], answer: "Gates that learn what to keep, forget, and pass onward", explain: "These learned gates are what let an LSTM selectively preserve important information across many steps." },
  { id: "l3", question: "What is the purpose of the LSTM's dedicated memory cell?", options: ["To preserve important information across many steps", "To store the entire training dataset permanently", "To erase all information after every single step"], answer: "To preserve important information across many steps", explain: "The memory cell is specifically designed to hold onto information far longer than a plain RNN's memory can." },
  { id: "l4", code: "Basic RNN: tends to forget details after roughly 10 words\nLSTM: retains key details after 100+ words", question: "Which model would generally handle a long paragraph better?", options: ["LSTM", "Basic RNN", "Neither can handle paragraphs"], answer: "LSTM", explain: "The LSTM's gates and dedicated memory cell let it hold onto relevant details far longer than a plain RNN can." },
  { id: "l5", question: "What does LSTM stand for?", options: ["Long Short-Term Memory", "Linear Sequential Training Model", "Large Scale Text Machine"], answer: "Long Short-Term Memory", explain: "The name describes exactly what it does -- it extends how long short-term memory can be usefully retained." },
];

const TRANSFORMER_ITEMS: QuizItem[] = [
  { id: "t1", question: "What mechanism lets a transformer decide which other words matter most for understanding a given word?", options: ["Attention", "Sorting", "Compression"], answer: "Attention", explain: "Attention is the core mechanism that lets a transformer weigh how relevant every other word is to the one it's currently processing." },
  { id: "t2", code: 'Sentence: "The trophy didn\'t fit in the suitcase because it was too big."', question: "What is attention helping the model figure out in this sentence?", options: ["Whether 'it' refers to the trophy or the suitcase", "How many letters are in the sentence", "The exact color of the trophy"], answer: "Whether 'it' refers to the trophy or the suitcase", explain: "Resolving what a pronoun like 'it' refers to is a classic example of the kind of connection attention is built to capture." },
  { id: "t3", question: "Why are transformers generally faster to train than RNNs on the same hardware?", options: ["They can process an entire sequence at once instead of one step at a time", "They use far fewer words during training", "They don't require any training data at all"], answer: "They can process an entire sequence at once instead of one step at a time", explain: "Because transformer steps don't have to happen strictly in order, far more of the computation can run in parallel." },
  { id: "t4", question: "What well-known family of AI models is built on the transformer architecture?", options: ["GPT and most modern large language models", "Only handwriting recognition tools", "Only chess-playing engines"], answer: "GPT and most modern large language models", explain: "The transformer architecture is the backbone behind GPT and the vast majority of today's large language models." },
  { id: "t5", code: 'Sentence: "The cat sat on the mat because it was tired."', question: "Which word would a transformer's attention most likely link 'it' back to?", options: ["cat", "mat", "was"], answer: "cat", explain: "A cat can be tired in a way a mat can't, so attention learns to connect 'it' back to 'cat' based on meaning, not just position." },
];

const STAGE_ITEMS: Record<string, QuizItem[]> = {
  cnn: CNN_ITEMS,
  rnn: RNN_ITEMS,
  lstm: LSTM_ITEMS,
  transformers: TRANSFORMER_ITEMS,
};

const POSITIVE_PHRASES = ["Nice! 🎉", "Great instinct!", "Sharp move! ✨", "That's it!", "Exactly right!"];
const GENTLE_PHRASES = ["Not quite 🤔", "Close -- try the next one", "Keep going", "Almost there!"];

/* ============================================================================
   STYLES -- matches the AI Foundations Lab's design language exactly
   (glassmorphism, Inter type, indigo/violet/cyan/amber/rose accents,
   floating background orbs, soft pill buttons, animated stepper)
============================================================================ */

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
  @keyframes popIn {
    from { transform: scale(0.85); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes dlfl-toast-in {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }
  @keyframes dlfl-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes dlfl-pop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  .dlfl-root {
    min-height: 100vh; width: 100%; position: relative; overflow-x: hidden;
    background: ${colors.bg};
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    padding: 32px 16px 60px;
    box-sizing: border-box;
  }
  .dlfl-root *, .dlfl-root *::before, .dlfl-root *::after { box-sizing: border-box; }
  .dlfl-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .dlfl-root button:focus-visible { outline: 3px solid ${colors.indigo}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .dlfl-root * { transition: none !important; animation: none !important; }
  }

  .dlfl-blob { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.35; }
  .dlfl-blob-1 { width: 460px; height: 460px; top: -110px; right: -90px; background: ${colors.indigoLight}; animation: float1 18s ease-in-out infinite; }
  .dlfl-blob-2 { width: 380px; height: 380px; bottom: -80px; left: -80px; background: ${colors.teal}; opacity: 0.22; animation: float2 22s ease-in-out infinite; }
  .dlfl-blob-3 { width: 300px; height: 300px; top: 45%; left: 55%; background: ${colors.gold}; opacity: 0.16; animation: float1 25s ease-in-out infinite reverse; }
  .dlfl-blob-4 { width: 260px; height: 260px; top: 60%; right: 4%; background: ${colors.coral}; opacity: 0.14; animation: float2 20s ease-in-out infinite; }

  .dlfl-container { max-width: 780px; margin: 0 auto; position: relative; z-index: 1; }

  .dlfl-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600; color: ${colors.inkSoft};
    padding: 8px 16px; border-radius: 12px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${colors.border};
    transition: all 0.2s ease; margin-bottom: 28px;
  }
  .dlfl-back-btn:hover { color: ${colors.indigo}; border-color: rgba(99,102,241,0.4); transform: translateX(-2px); }

  .dlfl-header { text-align: center; margin-bottom: 28px; animation: fadeSlideUp 0.6s ease both; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .dlfl-header-icon {
    width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, ${colors.indigo}, ${colors.purple});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }
  .dlfl-h1 {
    font-size: 32px; font-weight: 800; margin: 0; line-height: 1.2; letter-spacing: -0.02em;
    background: linear-gradient(135deg, ${colors.indigoDeep}, ${colors.purple} 55%, ${colors.coral});
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .dlfl-h1 { font-size: 40px; } }
  .dlfl-subtitle { font-size: 16px; color: ${colors.inkSoft}; max-width: 560px; margin: 0 auto; line-height: 1.6; }

  .dlfl-toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    animation: dlfl-toast-in 0.35s ease forwards;
  }
  .dlfl-toast-up { background: linear-gradient(135deg, ${colors.emerald}, #059669); }
  .dlfl-toast-down { background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep}); }

  .dlfl-progress-track {
    width: 100%; height: 8px; border-radius: 999px; background: rgba(148,163,184,0.18);
    overflow: hidden; margin-bottom: 18px; position: relative;
  }
  .dlfl-progress-fill {
    height: 100%; border-radius: 999px; position: relative; overflow: hidden;
    background: linear-gradient(90deg, ${colors.indigo}, ${colors.purple});
    transition: width 0.35s ease;
  }
  .dlfl-progress-fill::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: shimmer 2.2s linear infinite;
  }

  .dlfl-stampbar { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 32px; flex-wrap: wrap; animation: fadeSlideUp 0.7s ease both 0.1s; }
  .dlfl-stamp-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 18px; border-radius: 14px; font-weight: 700; font-size: 13px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border: 2px solid ${colors.border}; color: ${colors.muted};
    transition: all 0.25s ease; flex: 1; min-width: 54px; justify-content: center;
  }
  .dlfl-stamp-btn:hover { transform: translateY(-2px); border-color: rgba(99,102,241,0.4); }
  .dlfl-stamp-label { font-size: 12px; font-weight: 700; text-align: center; white-space: nowrap; }
  @media (max-width: 639px) { .dlfl-stamp-label { display: none; } .dlfl-stamp-btn { min-width: 0; padding: 11px; } }

  .dlfl-stage-shell {
    border-radius: 24px; padding: 28px 24px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    animation: fadeSlideUp 0.55s ease both 0.2s;
  }
  @media (min-width: 640px) { .dlfl-stage-shell { padding: 36px 32px; } }
  .dlfl-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .dlfl-stage-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: ${colors.indigo}; padding: 5px 14px; border-radius: 999px; background: rgba(99,102,241,0.08);
  }
  .dlfl-stage-progress { font-size: 13px; font-weight: 700; color: ${colors.muted}; }
  .dlfl-stage-title { font-size: 26px; font-weight: 800; color: ${colors.ink}; margin: 8px 0 6px 0; letter-spacing: -0.01em; }
  @media (min-width: 640px) { .dlfl-stage-title { font-size: 30px; } }
  .dlfl-stage-subtitle { font-size: 15px; color: ${colors.inkSoft}; margin: 0 0 18px 0; line-height: 1.6; }

  .dlfl-item-list { display: flex; flex-direction: column; gap: 12px; }
  .dlfl-item-card {
    border-radius: 18px; padding: 20px; background: ${colors.card};
    border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    opacity: 0; animation: fadeSlideUp 0.4s ease forwards; transition: all 0.2s ease;
  }
  .dlfl-item-card:hover { border-color: rgba(99,102,241,0.4); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

  .dlfl-code-block {
    background: ${colors.codeBg}; color: ${colors.codeText}; border-radius: 14px; padding: 14px 16px;
    font-family: 'Menlo', 'Consolas', monospace; font-size: 12.5px; line-height: 1.6;
    white-space: pre; overflow-x: auto; margin: 0 0 12px 0;
  }
  .dlfl-item-question { font-size: 14px; color: ${colors.ink}; margin: 0 0 14px 0; font-weight: 700; }

  .dlfl-choice-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .dlfl-choice-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 12.5px; font-weight: 700; padding: 13px 12px; border-radius: 14px; color: #1E1B2E;
    box-shadow: 0 3px 10px rgba(0,0,0,0.12); border: 2px solid transparent;
    transition: all 0.2s ease; min-width: 108px;
  }
  .dlfl-choice-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.16); }
  .dlfl-choice-btn:active { transform: translateY(1px); }
  .dlfl-choice-teal { background: linear-gradient(135deg, #7EE6D6, ${colors.teal}); }
  .dlfl-choice-coral { background: linear-gradient(135deg, #FFAD8F, ${colors.coral}); }
  .dlfl-choice-gold { background: linear-gradient(135deg, #FFD98A, ${colors.gold}); }

  .dlfl-feedback-line { display: flex; align-items: flex-start; gap: 10px; padding: 14px 16px; border-radius: 14px; background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.18); animation: popIn 0.3s ease both; }
  .dlfl-feedback-line p { font-size: 12.5px; color: ${colors.inkSoft}; margin: 0; line-height: 1.55; font-weight: 500; }
  .dlfl-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .dlfl-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; gap: 12px; }
  .dlfl-step-counter { font-size: 12px; font-weight: 700; color: ${colors.muted}; }
  .dlfl-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft};
    background: ${colors.card}; border: 1px solid ${colors.border};
    transition: all 0.2s ease;
  }
  .dlfl-nav-back:not([disabled]):hover { color: ${colors.indigo}; border-color: rgba(99,102,241,0.4); transform: translateX(-2px); }
  .dlfl-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 24px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: #fff;
    background: linear-gradient(135deg, ${colors.indigo}, ${colors.purple});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: all 0.2s ease;
  }
  .dlfl-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .dlfl-nav-next:not([disabled]):active { transform: translateY(1px); }
  .dlfl-nav-next[disabled], .dlfl-nav-back[disabled] { opacity: 0.4; cursor: default; }
  .dlfl-nav-next[disabled] { background: ${colors.muted}; box-shadow: none; }

  .dlfl-completion-overlay {
    position: fixed; inset: 0; background: rgba(5,10,25,0.75);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center; z-index: 9999;
    animation: dlfl-fade-in 0.35s ease;
  }
  .dlfl-completion-modal {
    width: 480px; max-width: 90%;
    background: rgba(20,28,45,0.95);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px; padding: 40px; text-align: center; color: #fff;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    animation: dlfl-pop 0.4s ease;
  }
  .dlfl-completion-icon {
    width: 68px; height: 68px; border-radius: 50%; margin: 0 auto 18px auto;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, ${colors.indigo}, ${colors.purple});
    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
  }
  .dlfl-completion-modal h2 { margin: 0 0 10px 0; font-size: 22px; font-weight: 800; }
  .dlfl-completion-modal p { color: #b8c5e1; line-height: 1.6; font-size: 14.5px; margin: 0; }
  .dlfl-completion-modal button {
    margin-top: 26px; padding: 13px 30px; border: none; border-radius: 14px; cursor: pointer;
    background: linear-gradient(135deg, ${colors.indigo}, ${colors.teal});
    color: white; font-weight: 700; font-size: 15px;
    display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 22px rgba(99,102,241,0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .dlfl-completion-modal button:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(99,102,241,0.4); }
`;

/* ============================================================================
   SHARED HELPERS
============================================================================ */

const PALETTE = ["dlfl-choice-teal", "dlfl-choice-coral", "dlfl-choice-gold"];

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
      <div className="dlfl-progress-track">
        <div className="dlfl-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="dlfl-stampbar">
        {STAGE_META.map((s, i) => {
          const Icon = s.icon;
          const isDone = completed[i];
          const isCurrent = current === i;
          const active = isDone || isCurrent;
          return (
            <button
              key={s.key}
              className="dlfl-stamp-btn"
              onClick={() => onJump(i)}
              style={{
                background: active ? `linear-gradient(135deg, ${colors.indigo}, ${colors.purple})` : undefined,
                borderColor: active ? "transparent" : colors.border,
                boxShadow: active ? "0 4px 15px rgba(99,102,241,0.3)" : "none",
              }}
            >
              {isDone ? (
                <CheckCircle2 size={18} color="#fff" strokeWidth={2.5} />
              ) : (
                <Icon size={16} color={isCurrent ? "#fff" : colors.muted} />
              )}
              <span className="dlfl-stamp-label" style={{ color: active ? "#fff" : colors.muted }}>
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
  children: React.ReactNode;
}

function StageShell({ tag, title, subtitle, progressLabel, children }: StageShellProps) {
  return (
    <div className="dlfl-stage-shell">
      <div className="dlfl-stage-top">
        <span className="dlfl-stage-tag">{tag}</span>
        {progressLabel && <span className="dlfl-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="dlfl-stage-title">{title}</h2>
      {subtitle && <p className="dlfl-stage-subtitle">{subtitle}</p>}
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
  step: number;
  total: number;
}

function NavButtons({ onBack, onNext, backDisabled, nextDisabled, nextLabel, step, total }: NavButtonsProps) {
  return (
    <div className="dlfl-nav-row">
      <button className="dlfl-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <span className="dlfl-step-counter">{step} / {total}</span>
      <button className="dlfl-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

interface QuizListProps {
  items: QuizItem[];
  answers: AnswerMap;
  onAnswer: (id: string, value: string) => void;
}

function QuizList({ items, answers, onAnswer }: QuizListProps) {
  return (
    <div className="dlfl-item-list">
      {items.map((item, idx) => {
        const chosen = answers[item.id];
        const isCorrect = chosen === item.answer;
        return (
          <div key={item.id} className="dlfl-item-card" style={{ animationDelay: `${idx * 0.05}s` }}>
            {item.code && <pre className="dlfl-code-block">{item.code}</pre>}
            <p className="dlfl-item-question">{item.question}</p>
            {!chosen ? (
              <div className="dlfl-choice-row">
                {item.options.map((opt, i) => (
                  <button
                    key={opt}
                    className={`dlfl-choice-btn ${PALETTE[i % PALETTE.length]}`}
                    onClick={() => onAnswer(item.id, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="dlfl-feedback-line">
                {isCorrect ? (
                  <CheckCircle2 size={16} color={colors.tealDeep} className="dlfl-feedback-icon" />
                ) : (
                  <XCircle size={16} color={colors.coralDeep} className="dlfl-feedback-icon" />
                )}
                <p>
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

/* ============================================================================
   MAIN APP
============================================================================ */

export default function DeepLearningLab() {
  const router = useRouter();
  const total = STAGE_META.length;

  const [current, setCurrent] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean[]>(STAGE_META.map(() => false));
  const [labCompleted, setLabCompleted] = useState(false);

  const [cnnAnswers, setCnnAnswers] = useState<AnswerMap>({});
  const [rnnAnswers, setRnnAnswers] = useState<AnswerMap>({});
  const [lstmAnswers, setLstmAnswers] = useState<AnswerMap>({});
  const [transformerAnswers, setTransformerAnswers] = useState<AnswerMap>({});

  const [toast, setToast] = useState<{ mood: "up" | "down"; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const fireToast = (correct: boolean) => {
    const pool = correct ? POSITIVE_PHRASES : GENTLE_PHRASES;
    const text = pool[Math.floor(Math.random() * pool.length)];
    setToast({ mood: correct ? "up" : "down", text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1400);
  };

  const answerMaps: Record<string, [AnswerMap, React.Dispatch<React.SetStateAction<AnswerMap>>]> = {
    cnn: [cnnAnswers, setCnnAnswers],
    rnn: [rnnAnswers, setRnnAnswers],
    lstm: [lstmAnswers, setLstmAnswers],
    transformers: [transformerAnswers, setTransformerAnswers],
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

  const stageKey = STAGE_META[current]?.key;
  const [currentAnswers, setCurrentAnswers] = stageKey ? answerMaps[stageKey] : [{}, () => {}];
  const currentItems = stageKey ? STAGE_ITEMS[stageKey] : [];
  const currentDone = currentItems.length > 0 && Object.keys(currentAnswers).length === currentItems.length;

  const handleAnswer = (id: string, value: string) => {
    const item = currentItems.find((it) => it.id === id);
    setCurrentAnswers((prev) => ({ ...prev, [id]: value }));
    if (item) fireToast(value === item.answer);
  };

  const goNext = () => {
    markComplete(current);
    if (current === total - 1) {
      setLabCompleted(true);
      return;
    }
    setCurrent(current + 1);
  };

  const goBack = () => setCurrent((c) => Math.max(0, c - 1));

  const stage = STAGE_META[current];

  return (
    <div className="dlfl-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ${STYLES}
      `}</style>

      <div className="dlfl-blob dlfl-blob-1" />
      <div className="dlfl-blob dlfl-blob-2" />
      <div className="dlfl-blob dlfl-blob-3" />
      <div className="dlfl-blob dlfl-blob-4" />

      {toast && (
        <div className={`dlfl-toast ${toast.mood === "up" ? "dlfl-toast-up" : "dlfl-toast-down"}`}>
          {toast.mood === "up" ? <Sparkles size={15} /> : <Brain size={15} />}
          {toast.text}
        </div>
      )}

      <div className="dlfl-container">
        <button className="dlfl-back-btn" onClick={() => router.push("/")}>
          <ChevronLeft size={16} /> Back
        </button>

        <div className="dlfl-header">
          <div className="dlfl-header-icon">
            <Compass size={26} color="#fff" />
          </div>
          <h1 className="dlfl-h1">Deep Learning Lab</h1>
          <p className="dlfl-subtitle">
            Slide filters across images, trace memory through sequences, see how LSTMs remember
            longer, and watch attention connect words across a whole sentence.
          </p>
        </div>

        <StampBar current={current} completed={completed} onJump={goTo} />

        <StageShell
          tag={stage.tag}
          title={stage.title}
          subtitle={stage.subtitle}
          progressLabel={`${Object.keys(currentAnswers).length}/${currentItems.length} solved`}
        >
          <QuizList items={currentItems} answers={currentAnswers} onAnswer={handleAnswer} />

          <NavButtons
            step={current + 1}
            total={total}
            backDisabled={current === 0}
            onBack={goBack}
            nextDisabled={!currentDone}
            nextLabel={current === total - 1 ? "Finish Lab" : "Continue"}
            onNext={goNext}
          />
        </StageShell>

        {labCompleted && (
          <div className="dlfl-completion-overlay">
            <div className="dlfl-completion-modal">
              <div className="dlfl-completion-icon">
                <Sparkles size={30} color="#fff" />
              </div>
              <h2>Lab Completed!</h2>
              <p>
                You explored how CNNs scan images for patterns, how RNNs carry memory through a
                sequence, how LSTMs remember over much longer stretches, and how transformers use
                attention to connect words across an entire sentence.
              </p>
              <button onClick={() => router.push("/")}>
                Finished <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}