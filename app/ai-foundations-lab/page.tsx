"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  Database,
  TrendingUp,
  Sparkles,
  Eye,
  GitBranch,
  ScanFace,
  Puzzle,
  BookOpen,
  Car,
  Crown,
  User,
  Cpu,
  Zap,
  Users,
  Layers,
  Building2,
  Clock,
  Smartphone,
  Stethoscope,
  ShoppingBag,
  Camera,
  Film,
  Map,
  Landmark,
  School,
  Home,
  Cloud,
  Mic,
  Languages,
  Target,
  Infinity as InfinityIcon,
  Rocket,
  Lightbulb,
  Trophy,
  MessageSquare,
  CheckCircle2,
  Circle,
  X,
  Gauge,
  Compass,
  type LucideIcon,
} from "lucide-react";

/* ============================================================================
   COLOR SYSTEM -- matches the ML Without Math Lab exactly
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
  goldDeepest: "#92400E",
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

type AbilityKey =
  | "memory"
  | "reasoning"
  | "learning"
  | "creativity"
  | "perception"
  | "decision";

type MetricKey =
  | "speed"
  | "accuracy"
  | "memory"
  | "creativity"
  | "emotion"
  | "learning";

interface AbilityDef {
  key: AbilityKey;
  label: string;
  icon: LucideIcon;
  color: string;
  colorDeep: string;
}

interface SimTask {
  id: string;
  label: string;
  icon: LucideIcon;
  weights: Record<AbilityKey, number>;
}

interface CompareTask {
  id: string;
  label: string;
  icon: LucideIcon;
  human: Record<MetricKey, number>;
  ai: Record<MetricKey, number>;
  blurb: string;
}

interface CityAiUse {
  label: string;
  desc: string;
  icon: LucideIcon;
}

interface CityBuilding {
  id: string;
  label: string;
  icon: LucideIcon;
  top: number;
  left: number;
  uses: CityAiUse[];
}

interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  detail: string;
  fact: string;
}

interface CapabilityOption {
  id: "narrow" | "general" | "super";
  label: string;
  icon: LucideIcon;
  desc: string;
  tier: number;
}

interface BehaviorOption {
  id: "reactive" | "memory" | "theory" | "selfaware";
  label: string;
  icon: LucideIcon;
  desc: string;
  tier: number;
}

interface EcosystemNode {
  id: string;
  label: string;
  icon: LucideIcon;
  x: number;
  y: number;
  desc: string;
}

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
  subtitle: string;
}

interface ChoiceOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

/* ============================================================================
   STATIC DATA
============================================================================ */

const ABILITIES: AbilityDef[] = [
  { key: "memory", label: "Memory", icon: Database, color: colors.teal, colorDeep: colors.tealDeep },
  { key: "reasoning", label: "Reasoning", icon: GitBranch, color: colors.purple, colorDeep: colors.purpleDeep },
  { key: "learning", label: "Learning", icon: TrendingUp, color: colors.gold, colorDeep: colors.goldDeep },
  { key: "creativity", label: "Creativity", icon: Sparkles, color: colors.coral, colorDeep: colors.coralDeep },
  { key: "perception", label: "Perception", icon: Eye, color: colors.tealDeep, colorDeep: colors.teal },
  { key: "decision", label: "Decision Making", icon: Target, color: colors.purpleDeep, colorDeep: colors.purple },
];

const SIM_TASKS: (SimTask & ChoiceOption)[] = [
  { id: "face", label: "Recognize Face", icon: ScanFace, weights: { perception: 0.5, learning: 0.3, memory: 0.2, reasoning: 0, creativity: 0, decision: 0 } },
  { id: "puzzle", label: "Solve Puzzle", icon: Puzzle, weights: { reasoning: 0.5, decision: 0.3, memory: 0.2, perception: 0, learning: 0, creativity: 0 } },
  { id: "story", label: "Write Story", icon: BookOpen, weights: { creativity: 0.6, learning: 0.2, reasoning: 0.2, memory: 0, perception: 0, decision: 0 } },
  { id: "drive", label: "Drive Car", icon: Car, weights: { perception: 0.4, decision: 0.4, reasoning: 0.2, memory: 0, learning: 0, creativity: 0 } },
  { id: "chess", label: "Play Chess", icon: Crown, weights: { reasoning: 0.5, memory: 0.3, decision: 0.2, perception: 0, learning: 0, creativity: 0 } },
];

const COMPARE_TASKS: (CompareTask & ChoiceOption)[] = [
  { id: "vision", label: "Image Recognition", icon: Eye, blurb: "Spotting and labeling what is inside a picture.", human: { speed: 42, accuracy: 84, memory: 58, creativity: 30, emotion: 20, learning: 55 }, ai: { speed: 96, accuracy: 97, memory: 92, creativity: 18, emotion: 4, learning: 82 } },
  { id: "chess", label: "Chess", icon: Crown, blurb: "Planning moves several turns ahead under fixed rules.", human: { speed: 48, accuracy: 70, memory: 64, creativity: 55, emotion: 32, learning: 60 }, ai: { speed: 99, accuracy: 99, memory: 96, creativity: 15, emotion: 2, learning: 85 } },
  { id: "writing", label: "Creative Writing", icon: BookOpen, blurb: "Inventing a story with voice, stakes, and feeling.", human: { speed: 40, accuracy: 62, memory: 50, creativity: 96, emotion: 92, learning: 66 }, ai: { speed: 92, accuracy: 66, memory: 80, creativity: 58, emotion: 12, learning: 70 } },
  { id: "driving", label: "Driving", icon: Car, blurb: "Reacting to changing traffic in real time.", human: { speed: 55, accuracy: 76, memory: 55, creativity: 34, emotion: 42, learning: 60 }, ai: { speed: 85, accuracy: 81, memory: 87, creativity: 14, emotion: 4, learning: 76 } },
  { id: "diagnosis", label: "Medical Diagnosis", icon: Stethoscope, blurb: "Weighing symptoms, history, and risk to find a cause.", human: { speed: 38, accuracy: 80, memory: 70, creativity: 50, emotion: 72, learning: 76 }, ai: { speed: 93, accuracy: 88, memory: 95, creativity: 20, emotion: 5, learning: 86 } },
  { id: "translation", label: "Translation", icon: Languages, blurb: "Carrying meaning and tone across languages.", human: { speed: 50, accuracy: 76, memory: 60, creativity: 62, emotion: 56, learning: 65 }, ai: { speed: 97, accuracy: 91, memory: 90, creativity: 36, emotion: 6, learning: 86 } },
];

const METRICS: { key: MetricKey; label: string }[] = [
  { key: "speed", label: "Speed" },
  { key: "accuracy", label: "Accuracy" },
  { key: "memory", label: "Memory" },
  { key: "creativity", label: "Creativity" },
  { key: "emotion", label: "Emotion" },
  { key: "learning", label: "Learning" },
];

const CITY_BUILDINGS: CityBuilding[] = [
  { id: "phone", label: "Smartphone", icon: Smartphone, top: 14, left: 12, uses: [
    { label: "Face Unlock", desc: "Face Detection maps your features to unlock the screen.", icon: ScanFace },
    { label: "Voice Assistant", desc: "Speech Recognition turns your voice into text commands.", icon: Mic },
  ] },
  { id: "hospital", label: "Hospital", icon: Stethoscope, top: 12, left: 46, uses: [
    { label: "Scan Reading", desc: "Computer Vision flags unusual patterns in X-rays and scans.", icon: Eye },
    { label: "Risk Prediction", desc: "Machine Learning estimates patient risk from historical data.", icon: TrendingUp },
  ] },
  { id: "traffic", label: "Traffic", icon: Car, top: 40, left: 6, uses: [
    { label: "Signal Timing", desc: "Machine Learning adjusts lights to reduce congestion in real time.", icon: TrendingUp },
  ] },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, top: 42, left: 78, uses: [
    { label: "Product Picks", desc: "A Recommendation System ranks items you are likely to want.", icon: Sparkles },
  ] },
  { id: "camera", label: "Camera", icon: Camera, top: 10, left: 80, uses: [
    { label: "Smart Focus", desc: "Computer Vision detects faces and subjects to focus the shot.", icon: Eye },
  ] },
  { id: "netflix", label: "Netflix", icon: Film, top: 66, left: 20, uses: [
    { label: "Up Next", desc: "A Recommendation System predicts what you will want to watch.", icon: Sparkles },
  ] },
  { id: "maps", label: "Google Maps", icon: Map, top: 64, left: 60, uses: [
    { label: "Best Route", desc: "Machine Learning predicts traffic to choose the fastest path.", icon: TrendingUp },
  ] },
  { id: "bank", label: "Bank", icon: Landmark, top: 38, left: 40, uses: [
    { label: "Fraud Alerts", desc: "Machine Learning flags transactions that look unusual.", icon: Gauge },
  ] },
  { id: "school", label: "School", icon: School, top: 88, left: 42, uses: [
    { label: "Tutoring Help", desc: "NLP powers chatbots that answer student questions.", icon: MessageSquare },
  ] },
  { id: "home", label: "Smart Home", icon: Home, top: 88, left: 80, uses: [
    { label: "Voice Control", desc: "Speech Recognition lets you control lights and locks by voice.", icon: Mic },
  ] },
];

const TIMELINE: TimelineMilestone[] = [
  { id: "1950", year: "1950", title: "The Turing Test", icon: Lightbulb, summary: "Alan Turing asks \"can machines think?\"", detail: "Turing proposes a test: if a person chatting with a hidden machine cannot tell it apart from a human, the machine can be said to think.", fact: "Turing never gave the test a name himself -- it was named that by later researchers." },
  { id: "1956", year: "1956", title: "Dartmouth Workshop", icon: Users, summary: "The term \"Artificial Intelligence\" is coined.", detail: "A small summer workshop at Dartmouth College brings researchers together around one bold claim: every part of learning can, in principle, be described precisely enough for a machine to simulate it.", fact: "The original workshop proposal budgeted for just ten attendees." },
  { id: "1980", year: "1980", title: "Expert Systems", icon: Layers, summary: "Rule-based programs go commercial.", detail: "Businesses start using expert systems: programs that encode a human specialist's rules of thumb to make decisions in narrow domains like chemistry or credit approval.", fact: "Some expert systems contained thousands of hand-written \"if this, then that\" rules." },
  { id: "1997", year: "1997", title: "Deep Blue Beats Kasparov", icon: Trophy, summary: "A computer beats the reigning world chess champion.", detail: "IBM's Deep Blue defeats Garry Kasparov in a six-game match, searching millions of positions per second rather than \"thinking\" the way a person does.", fact: "Deep Blue could evaluate roughly 200 million chess positions every second." },
  { id: "2012", year: "2012", title: "Deep Learning Breakthrough", icon: Cpu, summary: "Neural networks start crushing image recognition.", detail: "A deep neural network called AlexNet wins the ImageNet competition by a huge margin, proving that large, layered networks trained on lots of data can outperform hand-built approaches.", fact: "AlexNet cut the image-recognition error rate almost in half compared to the next best entry." },
  { id: "2017", year: "2017", title: "The Transformer", icon: MessageSquare, summary: "A new architecture reshapes language AI.", detail: "The paper \"Attention Is All You Need\" introduces the transformer, letting models weigh every word against every other word at once. It becomes the backbone of modern language models.", fact: "The transformer's \"attention\" mechanism can look at an entire sentence in one step, instead of word by word." },
  { id: "2020s", year: "2020s", title: "Generative AI Goes Public", icon: Sparkles, summary: "Chatbots and image generators reach everyday users.", detail: "Conversational AI assistants and image generators put large-scale AI directly into the hands of hundreds of millions of people for the first time.", fact: "Some of these tools reached 100 million users within just a couple of months of launch." },
  { id: "future", year: "Future", title: "What Comes Next?", icon: Rocket, summary: "Multi-step reasoning, agents, and open questions.", detail: "Researchers are pushing toward systems that can plan over many steps, use tools, and reason more reliably -- while society works out how to govern them safely.", fact: "No one knows exactly what the next milestone will be -- that part of the timeline is still unwritten." },
];

const CAPABILITIES: (CapabilityOption & ChoiceOption)[] = [
  { id: "narrow", label: "Narrow AI", icon: Target, tier: 1, desc: "Built to do one job well, like recommending songs or recognizing faces." },
  { id: "general", label: "General AI", icon: Brain, tier: 2, desc: "Could learn and reason across many domains the way a person can. Not built yet." },
  { id: "super", label: "Super AI", icon: InfinityIcon, tier: 3, desc: "A hypothetical intelligence that would surpass humans at nearly everything." },
];

const BEHAVIORS: (BehaviorOption & ChoiceOption)[] = [
  { id: "reactive", label: "Reactive Machine", icon: Zap, tier: 1, desc: "Responds to the current input only, with no memory of the past." },
  { id: "memory", label: "Limited Memory", icon: Database, tier: 2, desc: "Uses recent past data to inform its next decision." },
  { id: "theory", label: "Theory of Mind", icon: Users, tier: 3, desc: "Would model beliefs, intentions, and emotions of others. Still research." },
  { id: "selfaware", label: "Self Aware", icon: Eye, tier: 4, desc: "Would have a sense of its own internal state. Purely hypothetical today." },
];

interface ExampleSet {
  today: string[];
  research: string[];
  future: string[];
}

function getExamples(cap: CapabilityOption, beh: BehaviorOption): ExampleSet {
  const today: string[] = [];
  const research: string[] = [];
  const future: string[] = [];

  if (cap.id === "narrow") today.push("Spam filters", "Recommendation engines", "Voice assistants");
  else if (cap.id === "general") research.push("Cross-domain reasoning agents", "Flexible multi-task learners");
  else future.push("A hypothetical superintelligent system");

  if (beh.id === "reactive") today.push("Chess engines like Deep Blue", "Simple game-playing bots");
  else if (beh.id === "memory") today.push("Self-driving perception stacks", "Chat assistants that track context");
  else if (beh.id === "theory") research.push("Social robots that infer intent");
  else future.push("Machines with genuine self-models");

  return { today, research, future };
}

const ECOSYSTEM_NODES: EcosystemNode[] = [
  { id: "timeline", label: "Timeline", icon: Clock, x: 50, y: 9, desc: "AI grew step by step, from symbolic rules to today's learning systems." },
  { id: "types", label: "AI Types", icon: Layers, x: 50, y: 27, desc: "Every system falls somewhere on a scale of capability and behavior." },
  { id: "city", label: "Smart City", icon: Building2, x: 50, y: 45, desc: "Those types show up around us, in phones, hospitals, and homes." },
  { id: "human", label: "Human", icon: User, x: 27, y: 65, desc: "People bring creativity, emotion, and judgment machines still lack." },
  { id: "ai", label: "AI", icon: Cpu, x: 73, y: 65, desc: "Machines bring speed, scale, and tireless precision people lack." },
  { id: "intelligence", label: "Intelligence", icon: Brain, x: 50, y: 86, desc: "Together, both kinds of intelligence combine memory, reasoning, learning, creativity, perception, and decision making." },
];

const ECOSYSTEM_EDGES: [string, string][] = [
  ["timeline", "types"],
  ["types", "city"],
  ["city", "human"],
  ["city", "ai"],
  ["human", "intelligence"],
  ["ai", "intelligence"],
];

const STAGE_META: StageMetaItem[] = [
  { key: "intelligence", title: "Intelligence Simulator", icon: Brain, tag: "Stage 1 · Build a Mind", subtitle: "Tune six abilities, then try a task and see if this mix of intelligence pulls it off." },
  { key: "compare", title: "AI vs Human", icon: Users, tag: "Stage 2 · Head to Head", subtitle: "Pick a task and watch human and artificial intelligence go head to head." },
  { key: "city", title: "AI Around Us", icon: Building2, tag: "Stage 3 · Smart City", subtitle: "Tap any building in the city to see the AI quietly working behind the scenes." },
  { key: "history", title: "History of AI", icon: Clock, tag: "Stage 4 · The Timeline", subtitle: "Scrub through seven decades of milestones that built modern AI." },
  { key: "types", title: "Types of AI", icon: Layers, tag: "Stage 5 · Build a Robot", subtitle: "Combine a capability with a behavior to build your own AI, then see where it fits." },
  { key: "ecosystem", title: "The Big Picture", icon: Sparkles, tag: "Finale · The Ecosystem", subtitle: "Every idea in this lab connects into one living ecosystem. Tap a node to see how." },
];

const POSITIVE_PHRASES = ["Nice! 🎉", "Great blend!", "Sharp move! ✨", "That works!", "Great instinct!"];
const GENTLE_PHRASES = ["Keep tuning 🤔", "Almost there!", "Try another mix", "So close!"];

/* ============================================================================
   STYLES -- matches the ML Without Math Lab's design language exactly
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
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.3); }
    50% { box-shadow: 0 0 20px 6px rgba(99,102,241,0.15); }
  }
  @keyframes popIn {
    from { transform: scale(0.85); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes heroIn {
    from { opacity: 0; transform: translateY(8px) scale(0.94); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes nodePulse {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
  }
  @keyframes floaty {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .aifl-root {
    min-height: 100vh; width: 100%; position: relative; overflow-x: hidden;
    background: ${colors.bg};
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    padding: 32px 16px 60px;
    box-sizing: border-box;
  }
  .aifl-root *, .aifl-root *::before, .aifl-root *::after { box-sizing: border-box; }
  .aifl-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .aifl-root button:focus-visible { outline: 3px solid ${colors.indigo}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .aifl-root * { transition: none !important; animation: none !important; }
  }

  /* Floating background orbs */
  .aifl-blob { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.35; }
  .aifl-blob-1 { width: 460px; height: 460px; top: -110px; right: -90px; background: ${colors.indigoLight}; animation: float1 18s ease-in-out infinite; }
  .aifl-blob-2 { width: 380px; height: 380px; bottom: -80px; left: -80px; background: ${colors.teal}; opacity: 0.22; animation: float2 22s ease-in-out infinite; }
  .aifl-blob-3 { width: 300px; height: 300px; top: 45%; left: 55%; background: ${colors.gold}; opacity: 0.16; animation: float1 25s ease-in-out infinite reverse; }
  .aifl-blob-4 { width: 260px; height: 260px; top: 60%; right: 4%; background: ${colors.coral}; opacity: 0.14; animation: float2 20s ease-in-out infinite; }

  .aifl-container { max-width: 880px; margin: 0 auto; position: relative; z-index: 1; }

  .aifl-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600; color: ${colors.inkSoft};
    padding: 8px 16px; border-radius: 12px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${colors.border};
    transition: all 0.2s ease; margin-bottom: 28px;
  }
  .aifl-back-btn:hover { color: ${colors.indigo}; border-color: rgba(99,102,241,0.4); transform: translateX(-2px); }

  .aifl-header { text-align: center; margin-bottom: 28px; animation: fadeSlideUp 0.6s ease both; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .aifl-header-icon {
    width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, ${colors.indigo}, ${colors.purple});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }
  .aifl-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 20px; border-radius: 999px;
    background: linear-gradient(135deg, ${colors.indigo}, ${colors.purple});
    color: white; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }
  .aifl-h1 {
    font-size: 32px; font-weight: 800; margin: 0; line-height: 1.2; letter-spacing: -0.02em;
    background: linear-gradient(135deg, ${colors.indigoDeep}, ${colors.purple} 55%, ${colors.coral});
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .aifl-h1 { font-size: 40px; } }
  .aifl-subtitle { font-size: 16px; color: ${colors.inkSoft}; max-width: 580px; margin: 0 auto; line-height: 1.6; }

{
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px;
    font-weight: 700; font-size: 13.5px; color: white; z-index: 50;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    animation: aifl-toast-in 0.35s ease forwards;
  }
  .aifl-toast-up { background: linear-gradient(135deg, ${colors.emerald}, #059669); }
  .aifl-toast-down { background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep}); }
  @keyframes aifl-toast-in {
    0% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.9); }
    60% { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  /* Progress bar + stamp/step bar */
  .aifl-progress-track {
    width: 100%; height: 8px; border-radius: 999px; background: rgba(148,163,184,0.18);
    overflow: hidden; margin-bottom: 18px; position: relative;
  }
  .aifl-progress-fill {
    height: 100%; border-radius: 999px; position: relative; overflow: hidden;
    background: linear-gradient(90deg, ${colors.indigo}, ${colors.purple});
    transition: width 0.35s ease;
  }
  .aifl-progress-fill::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
    animation: shimmer 2.2s linear infinite;
  }

  .aifl-stampbar { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 32px; flex-wrap: wrap; animation: fadeSlideUp 0.7s ease both 0.1s; }
  .aifl-stamp-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 18px; border-radius: 14px; font-weight: 700; font-size: 13px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border: 2px solid ${colors.border}; color: ${colors.muted};
    transition: all 0.25s ease; flex: 1; min-width: 54px; justify-content: center;
  }
  .aifl-stamp-btn:hover { transform: translateY(-2px); border-color: rgba(99,102,241,0.4); }
  .aifl-stamp-label { font-size: 12px; font-weight: 700; text-align: center; white-space: nowrap; }
  @media (max-width: 639px) { .aifl-stamp-label { display: none; } .aifl-stamp-btn { min-width: 0; padding: 11px; } }

  .aifl-stage-shell {
    border-radius: 24px; padding: 28px 24px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${colors.border};
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    animation: fadeSlideUp 0.55s ease both 0.2s;
  }
  @media (min-width: 640px) { .aifl-stage-shell { padding: 36px 32px; } }
  .aifl-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .aifl-stage-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: ${colors.indigo}; padding: 5px 14px; border-radius: 999px; background: rgba(99,102,241,0.08);
  }
  .aifl-stage-progress { font-size: 13px; font-weight: 700; color: ${colors.muted}; }
  .aifl-stage-title { font-size: 26px; font-weight: 800; color: ${colors.ink}; margin: 8px 0 6px 0; letter-spacing: -0.01em; }
  @media (min-width: 640px) { .aifl-stage-title { font-size: 30px; } }
  .aifl-stage-subtitle { font-size: 15px; color: ${colors.inkSoft}; margin: 0 0 12px 0; line-height: 1.6; }

  .aifl-hero { display: flex; align-items: center; justify-content: center; margin-bottom: 22px; min-height: 96px; gap: 18px; flex-wrap: wrap; }

  .score-crate {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 24px; border-radius: 18px;
    background: ${colors.card}; border: 1px solid ${colors.border}; box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    min-width: 100px;
  }
  .score-crate.crate-teal { background: linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.06)); border-color: rgba(6,182,212,0.3); }
  .score-num { font-weight: 800; font-size: 24px; color: ${colors.ink}; line-height: 1; }
  .score-label { font-size: 11px; font-weight: 700; color: ${colors.muted}; }
  .score-divider { font-weight: 800; font-size: 13px; color: ${colors.coralDeep}; }

  .section-label { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color:black; margin: 22px 0 10px; }
  .section-label:first-of-type { margin-top: 4px; }

  .item-list { display: flex; flex-direction: column; gap: 12px; }
  .item-card {
    border-radius: 18px; padding: 20px; background: ${colors.card};
    border: 1px solid ${colors.border}; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    opacity: 0; animation: fadeSlideUp 0.4s ease forwards; transition: all 0.2s ease;
  }
  .item-card:hover { border-color: rgba(99,102,241,0.4); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

  /* Sliders */
  .slider-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .slider-item-name { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 700; color: ${colors.ink}; }
  .slider-icon-wrap { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .slider-item-value { font-size: 15px; font-weight: 800; }
  .slider-track-wrap { position: relative; height: 8px; border-radius: 999px; background: rgba(148,163,184,0.18); }
  .slider-track-fill { position: absolute; inset: 0; border-radius: 999px; transition: width 0.15s ease; }
  .slider-input { position: absolute; inset: -9px 0; width: 100%; height: 26px; opacity: 0; cursor: pointer; margin: 0; }
  .slider-thumb { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.25); pointer-events: none; transition: left 0.15s ease; }

  /* Choice pill row */
  .choice-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .choice-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 13px; font-weight: 700; padding: 14px 14px; border-radius: 14px; color: #000;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15); border: 2px solid transparent;
    transition: all 0.2s ease; min-width: 118px;
  }
  .choice-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
  .choice-btn:active { transform: translateY(1px); }
  .choice-teal { background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep}); color: #black; }
  .choice-coral { background: linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep}); color: black; }
  .choice-gold { background: linear-gradient(135deg, ${colors.gold}, ${colors.goldDeep}); color: black; }
  .choice-btn.active { outline: 3px solid rgba(99,102,241,0.35); outline-offset: 2px; }

  /* Feedback */
  .feedback-line { display: flex; align-items: flex-start; gap: 10px; padding: 14px 16px; border-radius: 14px; background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.18); animation: popIn 0.3s ease both; }
  .feedback-line p { font-size: 13px; color: ${colors.inkSoft}; margin: 0; line-height: 1.55; font-weight: 500; }
  .feedback-icon { margin-top: 2px; flex-shrink: 0; }

  /* Stage 1: brain */
  .brain-frame { position: relative; width: 128px; height: 128px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .brain-glow-ring { position: absolute; inset: 0; border-radius: 50%; filter: blur(20px); transition: background 0.4s ease, opacity 0.4s ease; }
  .brain-svg { position: relative; z-index: 1; width: 100%; height: 100%; }
  .brain-node { animation: nodePulse 2.4s ease-in-out infinite; }
  .task-feedback-meter { width: 100%; height: 8px; border-radius: 999px; background: rgba(148,163,184,0.18); overflow: hidden; margin-bottom: 10px; }
  .task-feedback-fill { height: 100%; border-radius: 999px; transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }

  /* Stage 2: compare */
  .s2-blurb { font-size: 13px; color: ${colors.muted}; margin: 10px 0 0; font-weight: 500; text-align: center; }
  .metric-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .metric-item-label { font-size: 13px; font-weight: 700; color: ${colors.ink}; }
  .metric-dual-row { display: flex; flex-direction: column; gap: 8px; }
  .metric-mini { display: flex; align-items: center; gap: 10px; }
  .metric-mini-label { width: 46px; flex-shrink: 0; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; }
  .metric-bar-track { flex: 1; height: 8px; border-radius: 999px; background: rgba(148,163,184,0.18); overflow: hidden; }
  .metric-bar-fill { height: 100%; border-radius: 999px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
  .metric-mini-num { width: 26px; text-align: right; flex-shrink: 0; font-size: 11.5px; font-weight: 800; font-variant-numeric: tabular-nums; }

  /* Stage 3: smart city */
  .city-frame {
    position: relative; width: 100%; min-height: 340px; border-radius: 22px; overflow: hidden;
    background: ${colors.cardAlt}; border: 1px solid ${colors.border}; margin-bottom: 16px;
  }
  .city-hub {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, ${colors.teal}, ${colors.tealDeep});
    box-shadow: 0 6px 18px rgba(6,182,212,0.3); z-index: 2;
  }
  .city-hub-ring { position: absolute; inset: -12px; border-radius: 50%; border: 2px dashed ${colors.teal}; opacity: 0.5; animation: spinSlow 18s linear infinite; }
  .city-svg-lines { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; }
  .building-node { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; z-index: 3; }
  .building-icon-wrap {
    width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 2px solid ${colors.border}; color: ${colors.ink};
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease;
    animation: floaty 5s ease-in-out infinite; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .building-node:hover .building-icon-wrap { transform: scale(1.1) translateY(-4px); }
  .building-node.active .building-icon-wrap { border-color: ${colors.tealDeep}; color: ${colors.tealDeep}; box-shadow: 0 6px 16px rgba(6,182,212,0.25); }
  .building-node-label { font-size: 10px; font-weight: 700; color: ${colors.inkSoft}; white-space: nowrap; }
  .city-info-header { display: flex; align-items: center; gap: 12px; justify-content: space-between; margin-bottom: 12px; }
  .city-info-title { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 700; color: ${colors.ink}; }
  .city-info-close { cursor: pointer; color: ${colors.muted}; transition: color 0.2s ease, transform 0.2s ease; }
  .city-info-close:hover { color: ${colors.coralDeep}; transform: rotate(90deg); }
  .city-use-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 14px; background: ${colors.card}; border: 1px solid ${colors.border}; margin-bottom: 10px; }
  .city-use-item:last-child { margin-bottom: 0; }
  .city-use-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(6,182,212,0.12); color: ${colors.tealDeep}; flex-shrink: 0; }
  .city-use-item h4 { margin: 0 0 3px; font-size: 13px; font-weight: 700; color: ${colors.ink}; }
  .city-use-item p { margin: 0; font-size: 12.5px; color: ${colors.muted}; line-height: 1.4; }
  .city-empty-hint { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 22px; text-align: center; color: ${colors.muted}; font-size: 13px; font-weight: 600; }

  /* Stage 4: history timeline */
  .timeline-scroll-wrap { position: relative; margin-bottom: 16px; }
  .timeline-track { display: flex; gap: 0; overflow-x: auto; scroll-behavior: smooth; scroll-snap-type: x proximity; padding: 30px 6px 16px; position: relative; }
  .timeline-track::-webkit-scrollbar { height: 6px; }
  .timeline-track::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 999px; }
  .timeline-track::before { content: ""; position: absolute; left: 0; right: 0; top: 54px; height: 3px; background: linear-gradient(90deg, ${colors.teal}, ${colors.gold}, ${colors.coral}); opacity: 0.4; border-radius: 3px; }
  .timeline-node { scroll-snap-align: center; flex: 0 0 120px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; position: relative; padding-top: 4px; }
  .timeline-dot {
    width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 2px solid ${colors.border}; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 1; position: relative; top: 32px;
  }
  .timeline-node.active .timeline-dot { border-color: ${colors.goldDeep}; box-shadow: 0 4px 14px rgba(180,83,9,0.25); transform: scale(1.12) translateY(-2px); }
  .timeline-year { font-size: 11px; font-weight: 800; color: ${colors.muted}; transition: color 0.3s ease; font-family: 'Menlo', 'Consolas', monospace; }
  .timeline-node.active .timeline-year { color: ${colors.goldDeep}; }
  .timeline-mini-title { font-size: 10.5px; color: ${colors.inkSoft}; text-align: center; max-width: 108px; margin-top: 44px; font-weight: 600; }
  .timeline-arrows { display: flex; justify-content: center; gap: 10px; margin-top: 2px; }
  .timeline-arrow-btn { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: ${colors.inkSoft}; background: ${colors.cardAlt}; border: 1px solid ${colors.border}; transition: all 0.2s ease; }
  .timeline-arrow-btn:hover { background: rgba(99,102,241,0.08); color: ${colors.indigo}; }
  .timeline-detail-card { padding: 18px; display: flex; gap: 16px; align-items: flex-start; }
  .timeline-detail-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${colors.gold}, ${colors.goldDeep}); box-shadow: 0 4px 14px rgba(180,83,9,0.25); flex-shrink: 0; }
  .timeline-detail-body h3 { margin: 0 0 6px; font-size: 17px; font-weight: 700; color: ${colors.ink}; }
  .timeline-detail-body .timeline-summary { margin: 0 0 10px; color: ${colors.tealDeep}; font-size: 13px; font-weight: 700; }
  .timeline-detail-body p.timeline-full { margin: 0 0 14px; color: ${colors.inkSoft}; font-size: 13.5px; line-height: 1.6; }
  .timeline-fact-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer; background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.goldDeep}; transition: all 0.2s ease; }
  .timeline-fact-toggle:hover { background: rgba(245,158,11,0.08); }
  .timeline-fact-box { margin-top: 12px; padding: 12px 16px; border-radius: 14px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); font-size: 12.5px; color: ${colors.ink}; font-weight: 500; }

  /* Stage 5: AI builder */
  .robot-svg { width: 108px; height: 124px; flex-shrink: 0; }
  .robot-tier-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .robot-tier-badge { font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 999px; background: ${colors.card}; border: 1px solid ${colors.border}; }
  .matrix-section { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .matrix-section:last-child { margin-bottom: 0; }
  .matrix-section-label { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
  .matrix-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .matrix-chip { font-size: 11.5px; font-weight: 700; padding: 5px 11px; border-radius: 999px; background: ${colors.card}; border: 1px solid ${colors.border}; color: ${colors.inkSoft}; }
  .matrix-empty { font-size: 12px; color: ${colors.muted}; font-style: italic; }

  /* Stage 6: ecosystem */
  .eco-frame { position: relative; width: 100%; min-height: 400px; border-radius: 22px; border: 1px solid ${colors.border}; background: ${colors.cardAlt}; overflow: hidden; margin-bottom: 16px; }
  .eco-node { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 7px; cursor: pointer; z-index: 2; }
  .eco-node-icon { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: ${colors.card}; border: 2px solid ${colors.border}; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .eco-node:hover .eco-node-icon { transform: scale(1.08); }
  .eco-node.active .eco-node-icon { border-color: ${colors.coralDeep}; color: ${colors.coralDeep}; box-shadow: 0 6px 16px rgba(190,18,60,0.2); }
  .eco-node-label { font-size: 11px; font-weight: 700; color: ${colors.inkSoft}; }
  .eco-node.active .eco-node-label { color: ${colors.ink}; }

  /* Nav row */
  .aifl-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; gap: 12px; }
  .aifl-step-counter { font-size: 12px; font-weight: 700; color: ${colors.muted}; }
  .aifl-nav-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 20px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft};
    background: ${colors.card}; border: 1px solid ${colors.border};
    transition: all 0.2s ease;
  }
  .aifl-nav-back:not([disabled]):hover { color: ${colors.indigo}; border-color: rgba(99,102,241,0.4); transform: translateX(-2px); }
  .aifl-nav-next {
    display: flex; align-items: center; gap: 6px; padding: 14px 24px; border-radius: 14px;
    font-size: 14px; font-weight: 700; color:black;
    background: linear-gradient(135deg, ${colors.indigo}, ${colors.purple});
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    transition: all 0.2s ease;
  }
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
  .aifl-nav-next:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.35); }
  .aifl-nav-next:not([disabled]):active { transform: translateY(1px); }
  .aifl-nav-next[disabled], .aifl-nav-back[disabled] { opacity: 0.4; cursor: default; }
  .aifl-nav-next[disabled] { background: ${colors.muted}; box-shadow: none; }
`;


/* ============================================================================
   SMALL SHARED HELPERS
============================================================================ */

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const PALETTE = ["choice-teal", "choice-coral", "choice-gold"];

interface StampBarProps {
  current: number;
  visited: boolean[];
  onJump: (idx: number) => void;
}

function StampBar({ current, visited, onJump }: StampBarProps) {
  const pct = ((current + 1) / STAGE_META.length) * 100;
  return (
    <div>
      <div className="aifl-progress-track">
        <div className="aifl-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="aifl-stampbar">
        {STAGE_META.map((s, i) => {
          const Icon = s.icon;
          const isDone = visited[i] && i !== current;
          const isCurrent = current === i;
          const active = isDone || isCurrent;
          return (
            <button
              key={s.key}
              className={`aifl-stamp-btn${isCurrent ? " active" : ""}`}
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
              <span className="aifl-stamp-label" style={{ color: active ? "#fff" : colors.muted }}>
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
    <div className="aifl-stage-shell">
      <div className="aifl-stage-top">
        <span className="aifl-stage-tag"><Target size={12} /> {tag}</span>
        {progressLabel && <span className="aifl-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="aifl-stage-title">{title}</h2>
      {subtitle && <p className="aifl-stage-subtitle">{subtitle}</p>}
      {hero && <div className="aifl-hero">{hero}</div>}
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
    <div className="aifl-nav-row">
      <button className="aifl-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <span className="aifl-step-counter">{step} / {total}</span>
      <button className="aifl-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

function ChoiceRow<T extends ChoiceOption>({
  options,
  activeId,
  onSelect,
}: {
  options: T[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="choice-row">
      {options.map((opt, i) => {
        const Icon = opt.icon;
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            className={`choice-btn ${PALETTE[i % PALETTE.length]}${isActive ? " active" : ""}`}
            onClick={() => onSelect(opt.id)}
          >
            <Icon size={14} /> {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function FeedbackLine({ icon: Icon, color, text }: { icon: LucideIcon; color: string; text: string }) {
  return (
    <div className="feedback-line">
      <Icon size={16} color={color} className="feedback-icon" />
      <p>{text}</p>
    </div>
  );
}

const Slider: React.FC<{
  label: string;
  icon: LucideIcon;
  color: string;
  colorDeep: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, icon: Icon, color, colorDeep, value, onChange }) => {
  return (
    <div className="item-card">
      <div className="slider-item-top">
        <div className="slider-item-name">
          <span className="slider-icon-wrap" style={{ background: `${color}26`, color: colorDeep }}>
            <Icon size={14} />
          </span>
          {label}
        </div>
        <span className="slider-item-value" style={{ color: colorDeep }}>{value}</span>
      </div>
      <div className="slider-track-wrap">
        <div className="slider-track-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${colorDeep})` }} />
        <div className="slider-thumb" style={{ left: `${value}%`, border: `2px solid ${colorDeep}` }} />
        <input className="slider-input" type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
      </div>
    </div>
  );
};

const BrainVisual: React.FC<{ score: number; glowColor: string }> = ({ score, glowColor }) => {
  const intensity = clamp(score, 0, 100) / 100;
  return (
    <div className="brain-frame">
      <div className="brain-glow-ring" style={{ background: `radial-gradient(circle, ${glowColor}55, transparent 70%)`, opacity: 0.4 + intensity * 0.6 }} />
      <svg viewBox="0 0 200 200" className="brain-svg">
        <defs>
          <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.indigo} />
            <stop offset="100%" stopColor={colors.purple} />
          </linearGradient>
        </defs>
        <path
          d="M60 40 C40 40 30 60 34 78 C20 84 18 106 32 116 C28 132 42 148 60 146 C64 160 84 166 96 156 C108 166 128 160 132 146 C150 148 164 132 160 116 C174 106 172 84 158 78 C162 60 152 40 132 40 C124 28 106 24 96 32 C86 24 68 28 60 40Z"
          fill="none" stroke="url(#brainGrad)" strokeWidth={4} opacity={0.65 + intensity * 0.35}
        />
        <path
          d="M96 32 L96 156 M60 40 C74 60 74 100 60 146 M132 40 C118 60 118 100 132 146 M34 78 C58 88 74 96 96 96 C118 96 134 88 158 78 M32 116 C56 106 76 112 96 122 C116 112 136 106 160 116"
          fill="none" stroke={glowColor} strokeWidth={2} opacity={0.35 + intensity * 0.4}
        />
        {[[50, 60], [70, 45], [110, 48], [140, 62], [46, 100], [150, 100], [58, 130], [96, 140], [134, 130], [96, 70], [80, 108], [116, 108]].map(([x, y], i) => (
          <circle key={i} className="brain-node" cx={x} cy={y} r={3.4 + intensity * 2.4} fill={glowColor} style={{ animationDelay: `${i * 0.15}s` }} opacity={0.55 + intensity * 0.45} />
        ))}
      </svg>
    </div>
  );
};

/* ============================================================================
   STAGE 1 -- INTELLIGENCE SIMULATOR
============================================================================ */

const IntelligenceStage: React.FC<{ onReact: (correct: boolean) => void }> = ({ onReact }) => {
  const [values, setValues] = useState<Record<AbilityKey, number>>({
    memory: 55, reasoning: 60, learning: 50, creativity: 45, perception: 58, decision: 52,
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const score = useMemo(() => {
    const sum = ABILITIES.reduce((acc, a) => acc + values[a.key], 0);
    return Math.round(sum / ABILITIES.length);
  }, [values]);

  const glowColor = score > 70 ? colors.teal : score > 40 ? colors.purple : colors.coral;

  const taskScore = useCallback((task: SimTask) => {
    const raw = ABILITIES.reduce((acc, a) => acc + task.weights[a.key] * values[a.key], 0);
    return Math.round(clamp(raw, 0, 100));
  }, [values]);

  const selectedTask = SIM_TASKS.find((t) => t.id === selectedTaskId) || null;
  const taskPct = selectedTask ? taskScore(selectedTask) : null;
  const tint = taskPct == null ? colors.indigoDeep : taskPct > 70 ? colors.tealDeep : taskPct > 40 ? colors.goldDeep : colors.coralDeep;

  return (
    <>
      <div className="aifl-hero">
        <BrainVisual score={score} glowColor={glowColor} />
        <div className="score-crate">
          <span className="score-num">{score}</span>
          <span className="score-label">Intelligence Score</span>
        </div>
      </div>

      <p className="section-label">Tune the six abilities</p>
      <div className="item-list">
        {ABILITIES.map((a) => (
          <Slider
            key={a.key}
            label={a.label}
            icon={a.icon}
            color={a.color}
            colorDeep={a.colorDeep}
            value={values[a.key]}
            onChange={(v) => setValues((prev) => ({ ...prev, [a.key]: v }))}
          />
        ))}
      </div>

      <p className="section-label">Try a task</p>
      <ChoiceRow
        options={SIM_TASKS}
        activeId={selectedTaskId}
        onSelect={(id) => {
          setSelectedTaskId(id);
          const t = SIM_TASKS.find((x) => x.id === id)!;
          onReact(taskScore(t) > 70);
        }}
      />

      {selectedTask && taskPct != null && (
        <div className="item-card" style={{ marginTop: 12 }}>
          <div className="task-feedback-meter">
            <div className="task-feedback-fill" style={{ width: `${taskPct}%`, background: tint }} />
          </div>
          <FeedbackLine
            icon={taskPct > 70 ? CheckCircle2 : Circle}
            color={tint}
            text={`${selectedTask.label}: ${taskPct}% -- ${
              taskPct > 70
                ? "this ability mix pulls it off smoothly."
                : taskPct > 40
                ? "this mix struggles -- a few abilities are too low for the job."
                : "this mix fails -- the abilities this task needs are barely tuned up."
            }`}
          />
        </div>
      )}
    </>
  );
};

/* ============================================================================
   STAGE 2 -- AI vs HUMAN
============================================================================ */

const CompareStage: React.FC = () => {
  const [taskId, setTaskId] = useState(COMPARE_TASKS[0].id);
  const task = COMPARE_TASKS.find((t) => t.id === taskId)!;

  const humanAvg = Math.round(METRICS.reduce((acc, m) => acc + task.human[m.key], 0) / METRICS.length);
  const aiAvg = Math.round(METRICS.reduce((acc, m) => acc + task.ai[m.key], 0) / METRICS.length);

  return (
    <>
      <ChoiceRow options={COMPARE_TASKS} activeId={taskId} onSelect={setTaskId} />
      <p className="s2-blurb">{task.blurb}</p>

      <div className="aifl-hero" style={{ marginTop: 18 }}>
        <div className="score-crate">
          <User size={20} color={colors.ink} />
          <span className="score-num">{humanAvg}</span>
          <span className="score-label">Human</span>
        </div>
        <span className="score-divider">VS</span>
        <div className="score-crate crate-teal">
          <Cpu size={20} color={colors.tealDeep} />
          <span className="score-num">{aiAvg}</span>
          <span className="score-label">AI</span>
        </div>
      </div>

      <div className="item-list">
        {METRICS.map((m) => (
          <div key={m.key} className="item-card">
            <div className="metric-item-top">
              <span className="metric-item-label">{m.label}</span>
            </div>
            <div className="metric-dual-row">
              <div className="metric-mini">
                <span className="metric-mini-label" style={{ color: colors.goldDeep }}>Human</span>
                <div className="metric-bar-track">
                  <div className="metric-bar-fill" style={{ width: `${task.human[m.key]}%`, background: `linear-gradient(90deg, ${colors.gold}, ${colors.coral})` }} />
                </div>
                <span className="metric-mini-num" style={{ color: colors.goldDeep }}>{task.human[m.key]}</span>
              </div>
              <div className="metric-mini">
                <span className="metric-mini-label" style={{ color: colors.tealDeep }}>AI</span>
                <div className="metric-bar-track">
                  <div className="metric-bar-fill" style={{ width: `${task.ai[m.key]}%`, background: `linear-gradient(90deg, ${colors.teal}, ${colors.purple})` }} />
                </div>
                <span className="metric-mini-num" style={{ color: colors.tealDeep }}>{task.ai[m.key]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

/* ============================================================================
   STAGE 3 -- SMART CITY
============================================================================ */

const SmartCityStage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = CITY_BUILDINGS.find((b) => b.id === activeId) || null;

  return (
    <>
      <div className="city-frame">
        <svg className="city-svg-lines">
          {CITY_BUILDINGS.map((b) => {
            const isActive = b.id === activeId;
            return (
              <line
                key={b.id}
                x1="50%" y1="50%" x2={`${b.left}%`} y2={`${b.top}%`}
                stroke={isActive ? colors.tealDeep : colors.border}
                strokeWidth={isActive ? 2 : 1.2}
                strokeDasharray={isActive ? "5 4" : undefined}
                style={{ transition: "stroke 0.3s ease" }}
              >
                {isActive && <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.9s" repeatCount="indefinite" />}
              </line>
            );
          })}
        </svg>

        <div className="city-hub">
          <div className="city-hub-ring" />
          <Cloud size={22} color="#fff" />
        </div>

        {CITY_BUILDINGS.map((b) => {
          const Icon = b.icon;
          const isActive = b.id === activeId;
          return (
            <div key={b.id} className={`building-node${isActive ? " active" : ""}`} style={{ top: `${b.top}%`, left: `${b.left}%` }} onClick={() => setActiveId(isActive ? null : b.id)}>
              <div className="building-icon-wrap">
                <Icon size={18} />
              </div>
              <span className="building-node-label">{b.label}</span>
            </div>
          );
        })}
      </div>

      {active ? (
        <div className="item-card">
          <div className="city-info-header">
            <div className="city-info-title">
              <active.icon size={19} color={colors.tealDeep} />
              {active.label}
            </div>
            <X size={18} className="city-info-close" onClick={() => setActiveId(null)} />
          </div>
          {active.uses.map((u) => {
            const UIcon = u.icon;
            return (
              <div key={u.label} className="city-use-item">
                <div className="city-use-icon"><UIcon size={16} /></div>
                <div>
                  <h4>{u.label}</h4>
                  <p>{u.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="item-card city-empty-hint">
          <Building2 size={20} color={colors.muted} />
          Tap any building in the city to see the AI working behind the scenes.
        </div>
      )}
    </>
  );
};

/* ============================================================================
   STAGE 4 -- HISTORY TIMELINE
============================================================================ */

const HistoryStage: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const active = TIMELINE[activeIdx];

  const scrollBy = (dir: number) => trackRef.current?.scrollBy({ left: dir * 150, behavior: "smooth" });
  const selectMilestone = (idx: number) => {
    setActiveIdx(idx);
    setShowFact(false);
  };

  return (
    <>
      <div className="timeline-scroll-wrap">
        <div className="timeline-track" ref={trackRef}>
          {TIMELINE.map((m, idx) => {
            const Icon = m.icon;
            const isActive = idx === activeIdx;
            return (
              <div key={m.id} className={`timeline-node${isActive ? " active" : ""}`} onClick={() => selectMilestone(idx)}>
                <div className="timeline-dot">
                  <Icon size={16} color={isActive ? colors.goldDeep : colors.muted} />
                </div>
                <span className="timeline-year">{m.year}</span>
                <span className="timeline-mini-title">{m.title}</span>
              </div>
            );
          })}
        </div>
        <div className="timeline-arrows">
          <div className="timeline-arrow-btn" onClick={() => scrollBy(-1)}><ChevronLeft size={16} /></div>
          <div className="timeline-arrow-btn" onClick={() => scrollBy(1)}><ChevronRight size={16} /></div>
        </div>
      </div>

      <div className="item-card timeline-detail-card">
        <div className="timeline-detail-icon">
          <active.icon size={24} color="#fff" />
        </div>
        <div className="timeline-detail-body">
          <h3>{active.year} -- {active.title}</h3>
          <p className="timeline-summary">{active.summary}</p>
          <p className="timeline-full">{active.detail}</p>
          <div className="timeline-fact-toggle" onClick={() => setShowFact((s) => !s)}>
            <Lightbulb size={14} />
            {showFact ? "Hide fun fact" : "Reveal a fun fact"}
          </div>
          {showFact && <div className="timeline-fact-box">{active.fact}</div>}
        </div>
      </div>
    </>
  );
};

/* ============================================================================
   STAGE 5 -- AI BUILDER
============================================================================ */

const RobotVisual: React.FC<{ capTier: number; behTier: number }> = ({ capTier, behTier }) => {
  const glow = capTier === 3 ? colors.coral : capTier === 2 ? colors.purple : colors.teal;
  const eyeCount = behTier;
  return (
    <svg viewBox="0 0 140 160" className="robot-svg">
      <defs>
        <linearGradient id="robotGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={glow} stopOpacity={0.9} />
          <stop offset="100%" stopColor={colors.purple} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect x="35" y="40" width="70" height="60" rx="16" fill="#FFFFFF" stroke="url(#robotGrad)" strokeWidth={3} />
      <circle cx="70" cy="24" r="16" fill="#FFFFFF" stroke="url(#robotGrad)" strokeWidth={3} />
      <line x1="70" y1="8" x2="70" y2="0" stroke={glow} strokeWidth={3} />
      <circle cx="70" cy="0" r="4" fill={glow} className="brain-node" />
      {Array.from({ length: Math.min(eyeCount, 4) }).map((_, i) => {
        const spread = Math.min(eyeCount, 4);
        const startX = 70 - ((spread - 1) * 8) / 2;
        return <circle key={i} cx={startX + i * 8} cy={24} r={2.8} fill={glow} className="brain-node" style={{ animationDelay: `${i * 0.2}s` }} />;
      })}
      <rect x="15" y="50" width="14" height="34" rx="7" fill="#FFFFFF" stroke="url(#robotGrad)" strokeWidth={2.5} />
      <rect x="111" y="50" width="14" height="34" rx="7" fill="#FFFFFF" stroke="url(#robotGrad)" strokeWidth={2.5} />
      <rect x="48" y="105" width="16" height="40" rx="8" fill="#FFFFFF" stroke="url(#robotGrad)" strokeWidth={2.5} />
      <rect x="76" y="105" width="16" height="40" rx="8" fill="#FFFFFF" stroke="url(#robotGrad)" strokeWidth={2.5} />
      <circle cx="70" cy="70" r={10 + capTier * 3} fill="none" stroke={glow} strokeWidth={2.5} opacity={0.6}>
        <animate attributeName="r" values={`${8 + capTier * 3};${13 + capTier * 3};${8 + capTier * 3}`} dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

const TypesStage: React.FC = () => {
  const [capId, setCapId] = useState<CapabilityOption["id"]>("narrow");
  const [behId, setBehId] = useState<BehaviorOption["id"]>("reactive");
  const cap = CAPABILITIES.find((c) => c.id === capId)!;
  const beh = BEHAVIORS.find((b) => b.id === behId)!;
  const examples = useMemo(() => getExamples(cap, beh), [cap, beh]);

  return (
    <>
      <div className="aifl-hero">
        <RobotVisual capTier={cap.tier} behTier={beh.tier} />
        <div className="robot-tier-row">
          <span className="robot-tier-badge" style={{ color: colors.purpleDeep }}>{cap.label}</span>
          <span className="robot-tier-badge" style={{ color: colors.tealDeep }}>{beh.label}</span>
        </div>
      </div>

      <p className="section-label">Capability</p>
      <ChoiceRow options={CAPABILITIES} activeId={capId} onSelect={(id) => setCapId(id as CapabilityOption["id"])} />
      <div style={{ marginTop: 10 }}>
        <FeedbackLine icon={cap.icon} color={colors.purpleDeep} text={cap.desc} />
      </div>

      <p className="section-label">Behavior</p>
      <ChoiceRow options={BEHAVIORS} activeId={behId} onSelect={(id) => setBehId(id as BehaviorOption["id"])} />
      <div style={{ marginTop: 10 }}>
        <FeedbackLine icon={beh.icon} color={colors.tealDeep} text={beh.desc} />
      </div>

      <p className="section-label">Where does this combination exist?</p>
      <div className="item-card">
        <div className="matrix-section">
          <span className="matrix-section-label" style={{ color: colors.tealDeep }}><CheckCircle2 size={13} /> Exists Today</span>
          <div className="matrix-chip-row">
            {examples.today.length ? examples.today.map((e) => <span key={e} className="matrix-chip">{e}</span>) : <span className="matrix-empty">Not yet built</span>}
          </div>
        </div>
        <div className="matrix-section">
          <span className="matrix-section-label" style={{ color: colors.goldDeep }}><GitBranch size={13} /> Active Research</span>
          <div className="matrix-chip-row">
            {examples.research.length ? examples.research.map((e) => <span key={e} className="matrix-chip">{e}</span>) : <span className="matrix-empty">No major research track</span>}
          </div>
        </div>
        <div className="matrix-section">
          <span className="matrix-section-label" style={{ color: colors.coralDeep }}><Rocket size={13} /> Future / Hypothetical</span>
          <div className="matrix-chip-row">
            {examples.future.length ? examples.future.map((e) => <span key={e} className="matrix-chip">{e}</span>) : <span className="matrix-empty">Already realized</span>}
          </div>
        </div>
      </div>
    </>
  );
};

/* ============================================================================
   STAGE 6 -- ECOSYSTEM
============================================================================ */

const EcosystemStage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>("intelligence");
  const active = ECOSYSTEM_NODES.find((n) => n.id === activeId) || null;
  const nodeById = (id: string) => ECOSYSTEM_NODES.find((n) => n.id === id)!;

  return (
    <>
      <div className="eco-frame">
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {ECOSYSTEM_EDGES.map(([from, to], i) => {
            const a = nodeById(from);
            const b = nodeById(to);
            const touching = activeId === from || activeId === to;
            return (
              <line
                key={i}
                x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
                stroke={touching ? colors.coralDeep : colors.border}
                strokeWidth={touching ? 2.4 : 1.6}
                strokeDasharray="6 5"
              >
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.1s" repeatCount="indefinite" />
              </line>
            );
          })}
        </svg>

        {ECOSYSTEM_NODES.map((n) => {
          const Icon = n.icon;
          const isActive = n.id === activeId;
          return (
            <div key={n.id} className={`eco-node${isActive ? " active" : ""}`} style={{ left: `${n.x}%`, top: `${n.y}%` }} onClick={() => setActiveId(n.id)}>
              <div className="eco-node-icon" style={{ color: isActive ? colors.coralDeep : colors.ink }}>
                <Icon size={20} />
              </div>
              <span className="eco-node-label">{n.label}</span>
            </div>
          );
        })}
      </div>

      {active && (
        <div className="item-card">
          <FeedbackLine icon={active.icon} color={colors.coralDeep} text={`${active.label}: ${active.desc}`} />
        </div>
      )}
    </>
  );
};

/* ============================================================================
   MAIN PAGE
============================================================================ */

export default function AIFoundationsLabPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [visited, setVisited] = useState<boolean[]>([true, false, false, false, false, false]);
  const total = STAGE_META.length;

  const [toast, setToast] = useState<{ mood: "up" | "down"; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const fireToast = (correct: boolean) => {
    const pool = correct ? POSITIVE_PHRASES : GENTLE_PHRASES;
    const text = pool[Math.floor(Math.random() * pool.length)];
    setToast({ mood: correct ? "up" : "down", text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  };

  const goBack = useCallback(() => {
    try {
      router.back();
    } catch {
      /* no-op if no router history is available */
    }
  }, [router]);

  const jumpTo = (idx: number) => {
    setStage(idx);
    setVisited((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const [labCompleted, setLabCompleted] = useState(false);
  const goPrev = () => jumpTo(clamp(stage - 1, 0, total - 1));
  const goNext = () => {
    if (stage === total - 1) {
      setLabCompleted(true);
      return;
    }

    jumpTo(stage + 1);
  };

  const current = STAGE_META[stage];

  return (
    <div className="aifl-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ${STYLES}
      `}</style>

      <div className="aifl-blob aifl-blob-1" />
      <div className="aifl-blob aifl-blob-2" />
      <div className="aifl-blob aifl-blob-3" />
      <div className="aifl-blob aifl-blob-4" />

      {toast && (
        <div className={`aifl-toast ${toast.mood === "up" ? "aifl-toast-up" : "aifl-toast-down"}`}>
          {toast.mood === "up" ? <Sparkles size={15} /> : <Brain size={15} />}
          {toast.text}
        </div>
      )}

      <div className="aifl-container">
        <button className="aifl-back-btn" onClick={goBack}>
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="aifl-header">
          <div className="aifl-header-icon">
            <Compass size={26} color="#fff" />
          </div>
          <h1 className="aifl-h1">AI Foundations Lab</h1>
          <p className="aifl-subtitle">
            Blend six abilities into an intelligence score, race AI against human skill, wander a smart city,
            scrub through the history of AI, build your own robot, and connect it all into one big picture.
          </p>
        </div>

        <StampBar current={stage} visited={visited} onJump={jumpTo} />

        <StageShell tag={current.tag} title={current.title} subtitle={current.subtitle} progressLabel={`Stage ${stage + 1} of ${total}`}>
          {stage === 0 && <IntelligenceStage onReact={fireToast} />}
          {stage === 1 && <CompareStage />}
          {stage === 2 && <SmartCityStage />}
          {stage === 3 && <HistoryStage />}
          {stage === 4 && <TypesStage />}
          {stage === 5 && <EcosystemStage />}

          <NavButtons
            step={stage + 1}
            total={total}
            backDisabled={stage === 0}
            onBack={goPrev}
            nextDisabled={false}
            nextLabel={stage === total - 1 ? "Finished" : "Next"}
            onNext={goNext}
          />
          {labCompleted && (
  <div className="completion-overlay">
    <div className="completion-modal">
      <div className="completion-icon">🎉</div>

      <h2>Lab Completed!</h2>

      <p>
        Congratulations! You have successfully completed the
        <strong> AI Foundations Visualization Lab</strong>.
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
        </StageShell>
      </div>
    </div>
  );
}