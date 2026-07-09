"use client";
import React, { useState, useMemo } from "react";
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
  Award,
  RotateCcw,
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
  }
  .aiel-root *, .aiel-root *::before, .aiel-root *::after { box-sizing: border-box; }
  .aiel-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .aiel-root button:focus-visible { outline: 3px solid ${colors.purple}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .aiel-root * { transition: none !important; animation: none !important; }
  }

  .aiel-container { max-width: 760px; margin: 0 auto; }

  .aiel-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; margin-bottom: 28px; }
  .aiel-header-icon {
    width: 60px; height: 60px; border-radius: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 2.5px solid ${colors.border};
    box-shadow: 0 6px 0 ${colors.border};
  }
  .aiel-eyebrow {
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
    color: ${colors.goldDeep}; margin: 4px 0 0 0;
  }
  .aiel-h1 {
    font-family: 'Baloo 2', sans-serif; font-weight: 800; margin: 0; line-height: 1.15;
    font-size: 28px;
    background: linear-gradient(90deg, #D9A62B 0%, ${colors.coral} 45%, ${colors.purple} 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .aiel-h1 { font-size: 34px; } }
  .aiel-subtitle { font-size: 15px; color: ${colors.muted}; max-width: 560px; margin: 4px auto 0 auto; line-height: 1.55; }

  .aiel-progress-track {
    width: 100%; height: 14px; border-radius: 999px; background: #FFFFFF;
    border: 2px solid ${colors.borderSoft}; overflow: hidden; margin-bottom: 18px;
  }
  .aiel-progress-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, ${colors.gold} 0%, ${colors.coral} 100%);
    transition: width 0.35s ease;
  }

  .aiel-stampbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px; margin-bottom: 28px; flex-wrap: wrap;
  }
  .aiel-stamp-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 18px; border-radius: 999px; font-weight: 700; font-size: 14px;
    transition: transform 0.15s ease, box-shadow 0.15s ease; flex: 1; min-width: 130px; justify-content: center;
  }
  .aiel-stamp-btn:hover { transform: translateY(-2px); }
  .aiel-stamp-label {
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    text-align: center; white-space: nowrap;
  }
  @media (max-width: 639px) {
    .aiel-stamp-label { display: none; }
    .aiel-stamp-btn { min-width: 0; padding: 12px; }
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
  .aiel-stage-subtitle { font-size: 14px; color: ${colors.muted}; margin: 0 0 24px 0; }

  .aiel-item-list { display: flex; flex-direction: column; gap: 12px; }
  .aiel-item-card { border-radius: 20px; padding: 16px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; }
  .aiel-item-text { font-size: 14px; color: ${colors.ink}; margin: 0 0 12px 0; font-weight: 500; }
  .aiel-item-goal {
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    color: ${colors.purpleDeep}; margin: 0 0 6px 0;
  }

  .aiel-choice-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .aiel-choice-btn {
    flex: 1; font-size: 12.5px; font-weight: 700; padding: 12px 8px; border-radius: 999px; color: ${colors.ink};
    box-shadow: 0 4px 0 rgba(0,0,0,0.18); transition: transform 0.12s ease, box-shadow 0.12s ease;
    min-width: 90px;
  }
  .aiel-choice-btn:hover { transform: translateY(-1px); }
  .aiel-choice-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,0.18); }
  .aiel-choice-teal { background: linear-gradient(180deg, #7EE6D6 0%, ${colors.teal} 100%); }
  .aiel-choice-coral { background: linear-gradient(180deg, #FFAD8F 0%, ${colors.coral} 100%); }
  .aiel-choice-gold { background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%); }
  .aiel-choice-purple { background: linear-gradient(180deg, #DBB6FF 0%, ${colors.purple} 100%); }
  .aiel-choice-outline {
    font-size: 12.5px; font-weight: 700; padding: 10px 14px; border-radius: 999px;
    background: ${colors.card}; border: 2px solid ${colors.border}; color: ${colors.ink};
    transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease;
  }
  .aiel-choice-outline:hover { background: ${colors.borderSoft}; border-color: ${colors.gold}; transform: translateY(-1px); }

  .aiel-feedback { display: flex; align-items: flex-start; gap: 8px; }
  .aiel-feedback-text { font-size: 12px; color: ${colors.muted}; margin: 0; line-height: 1.5; }
  .aiel-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .aiel-prompt-pair { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .aiel-prompt-option {
    text-align: left; width: 100%; border-radius: 16px; padding: 12px 14px;
    background: ${colors.card}; border: 2px solid ${colors.borderSoft};
    transition: transform 0.12s ease, border-color 0.15s ease, box-shadow 0.12s ease;
  }
  .aiel-prompt-option:hover { transform: translateY(-1px); border-color: ${colors.gold}; box-shadow: 0 3px 0 ${colors.borderSoft}; }
  .aiel-prompt-option-label {
    font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
    color: ${colors.muted}; margin: 0 0 4px 0;
  }
  .aiel-prompt-option-text { font-size: 13.5px; color: ${colors.ink}; margin: 0; line-height: 1.5; font-style: italic; }
  .aiel-prompt-option.is-correct { border-color: ${colors.teal}; background: #EAFBF7; }
  .aiel-prompt-option.is-wrong { border-color: ${colors.coral}; background: #FFF1EC; opacity: 0.75; }

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

  .aiel-cert { border-radius: 28px; padding: 32px 20px; text-align: center; background: ${colors.card}; border: 3px solid ${colors.border}; box-shadow: 0 10px 0 ${colors.borderSoft}; }
  @media (min-width: 640px) { .aiel-cert { padding: 40px; } }
  .aiel-cert-badge {
    margin: 0 auto 20px auto; width: 76px; height: 76px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(180deg, #FFC65C 0%, ${colors.gold} 100%);
    box-shadow: 0 6px 0 ${colors.goldDeep};
  }
  .aiel-cert-eyebrow { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.teal}; margin: 0 0 8px 0; }
  .aiel-cert-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; color: ${colors.goldDeep}; font-size: 26px; margin: 0 0 12px 0; }
  .aiel-cert-desc { font-size: 14px; color: ${colors.muted}; margin: 0 0 24px 0; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
  .aiel-cert-score {
    display: inline-flex; align-items: center; gap: 12px; border-radius: 20px; padding: 16px 24px; margin-bottom: 32px;
    background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft};
  }
  .aiel-cert-score-num { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 30px; color: ${colors.goldDeep}; }
  .aiel-cert-score-label { font-size: 12px; color: ${colors.muted}; text-align: left; max-width: 140px; }
  .aiel-cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px; text-align: left; }
  @media (min-width: 480px) { .aiel-cert-grid { grid-template-columns: repeat(4, 1fr); } }
  .aiel-cert-item { border-radius: 14px; padding: 12px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; }
  .aiel-cert-item p { font-size: 12px; color: ${colors.ink}; margin: 6px 0 0 0; font-weight: 600; }
  .aiel-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700;
    padding: 12px 22px; border-radius: 999px; background: ${colors.cardAlt}; border: 2px solid ${colors.border}; color: ${colors.ink};
  }
`;

/* ---------------------------- TYPES ---------------------------- */

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
}

interface PromptItem {
  id: string;
  goal: string;
  weak: string;
  strong: string;
  explain: string;
}

type ToolCategoryId = "search" | "files" | "code" | "actions";

interface ToolItem {
  id: string;
  label: string;
  answer: ToolCategoryId;
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

/* ---------------------------- CONTENT DATA ---------------------------- */

const STAGE_META: StageMetaItem[] = [
  { key: "llms", title: "LLMs", icon: MessageSquare, tag: "Stage 1 - Predict the Word" },
  { key: "prompting", title: "Prompt Engineering", icon: Braces, tag: "Stage 2 - Which Prompt Wins?" },
  { key: "assistants", title: "AI Assistants", icon: Bot, tag: "Stage 3 - Match the Tool" },
  { key: "ethics", title: "AI Ethics", icon: ShieldCheck, tag: "Stage 4 - Spot the Concern" },
];

const WORD_ITEMS: WordItem[] = [
  { id: "w1", prompt: "I woke up and drank a cup of ___", options: ["coffee", "bicycle", "jealousy"], answer: "coffee", explain: "An LLM predicts the next word using patterns learned from huge amounts of text -- 'coffee' follows 'cup of' far more often than the other options ever would." },
  { id: "w2", prompt: "The sun rises in the ___", options: ["east", "refrigerator", "Tuesday"], answer: "east", explain: "This phrase appears constantly in training text, so the model has seen the pattern 'sun rises in the east' many, many times." },
  { id: "w3", prompt: "Two plus two equals ___", options: ["four", "giraffe", "Monday"], answer: "four", explain: "Even simple arithmetic phrases like this show up so often in text that the model reliably predicts the expected word." },
  { id: "w4", prompt: "The weather today is sunny with a chance of ___", options: ["rain", "homework", "silence"], answer: "rain", explain: "Weather reports are a common pattern in training data, so 'rain' is a far likelier continuation than an unrelated word." },
  { id: "w5", prompt: "She opened the door and stepped ___", options: ["outside", "spaghetti", "purple"], answer: "outside", explain: "Story-like sentences follow common patterns -- 'stepped outside' fits the flow of the sentence, while the other options break it completely." },
  { id: "w6", prompt: "Once upon a time, in a land far ___", options: ["away", "Tuesday", "calculator"], answer: "away", explain: "This is one of the most repeated story openings in existence, so the model has an extremely strong prediction for what comes next." },
];

const PROMPT_ITEMS: PromptItem[] = [
  {
    id: "p1",
    goal: "Get help writing a birthday message",
    weak: "Write something for a birthday",
    strong: "Write a warm, 3-sentence birthday message for my sister who loves hiking, mentioning the outdoors",
    explain: "Naming the length, the person, and a personal detail gives the model everything it needs to write something specific instead of generic.",
  },
  {
    id: "p2",
    goal: "Understand a science concept",
    weak: "Explain photosynthesis",
    strong: "Explain photosynthesis to a 10-year-old in 3 simple sentences with one everyday example",
    explain: "Specifying the audience, the length, and asking for an example steers the answer toward something actually useful and easy to follow.",
  },
  {
    id: "p3",
    goal: "Get help fixing code",
    weak: "Fix my code",
    strong: "Here's my Python function that should sort a list but throws an error on line 5 -- explain what's wrong and give the corrected code",
    explain: "Describing the expected behaviour and pointing to exactly where it fails helps the model diagnose the real problem instead of guessing.",
  },
  {
    id: "p4",
    goal: "Plan a trip",
    weak: "Plan a trip",
    strong: "Plan a 3-day budget-friendly itinerary for a first-time visitor to Tokyo, focused on food and temples",
    explain: "Giving a duration, a budget, a destination, and a focus turns an impossibly broad request into one the model can actually answer well.",
  },
  {
    id: "p5",
    goal: "Summarize a long article",
    weak: "Summarize this",
    strong: "Summarize this article in 5 bullet points, focusing on the main argument and any statistics mentioned",
    explain: "Asking for a specific format and telling the model what to prioritize produces a summary you can actually use right away.",
  },
];

const TOOL_ITEMS: ToolItem[] = [
  { id: "t1", label: "Find out today's stock price for a company", answer: "search" },
  { id: "t2", label: "Check the latest news about an election", answer: "search" },
  { id: "t3", label: "Summarize a PDF report you just uploaded", answer: "files" },
  { id: "t4", label: "Read a spreadsheet and calculate the average of a column", answer: "files" },
  { id: "t5", label: "Debug a Python script and run it to check the output", answer: "code" },
  { id: "t6", label: "Schedule a meeting with your team for Thursday", answer: "actions" },
  { id: "t7", label: "Send a follow-up email to a client", answer: "actions" },
  { id: "t8", label: "Test whether a small function actually produces the right result", answer: "code" },
];

const TOOL_CATEGORIES: ToolCategory[] = [
  { id: "search", label: "Web Search", hint: "Needs current, outside information" },
  { id: "files", label: "File & Document Reading", hint: "Needs to read something you provided" },
  { id: "code", label: "Code Execution", hint: "Needs to write and actually run code" },
  { id: "actions", label: "Take Real-World Action", hint: "Needs to do something on your behalf" },
];

const ETHICS_ITEMS: EthicsItem[] = [
  { id: "e1", text: "A hiring AI trained mostly on resumes from one gender ends up favoring that gender for interviews.", answer: "bias" },
  { id: "e2", text: "A facial recognition system misidentifies people of a certain skin tone far more often than others.", answer: "bias" },
  { id: "e3", text: "A chatbot confidently states a wrong historical date, and someone shares it online as fact.", answer: "misinformation" },
  { id: "e4", text: "An AI-generated article spreads a fabricated quote that a real public figure never actually said.", answer: "misinformation" },
  { id: "e5", text: "An AI assistant retains and reuses sensitive medical details a user typed into a conversation.", answer: "privacy" },
  { id: "e6", text: "A free AI app quietly sells users' uploaded photos to advertisers without clear consent.", answer: "privacy" },
  { id: "e7", text: "A company replaces its entire customer support team with an AI chatbot overnight.", answer: "jobs" },
  { id: "e8", text: "Automated AI translation tools replace most of a company's human translation staff.", answer: "jobs" },
];

const ETHICS_CATEGORIES: EthicsCategory[] = [
  { id: "bias", label: "Bias", hint: "Unfair treatment baked in from unbalanced data" },
  { id: "misinformation", label: "Misinformation", hint: "Confident, convincing, and wrong" },
  { id: "privacy", label: "Privacy", hint: "Personal data handled carelessly" },
  { id: "jobs", label: "Job Impact", hint: "Automation changing human roles" },
];

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
                <CheckCircle2 size={18} color={colors.ink} strokeWidth={2.5} />
              ) : (
                <Icon size={16} color={isCurrent ? colors.ink : colors.muted} />
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
  children: React.ReactNode;
}

function StageShell({ tag, title, subtitle, progressLabel, children }: StageShellProps) {
  return (
    <div className="aiel-stage-shell">
      <div className="aiel-stage-top">
        <span className="aiel-stage-tag">{tag}</span>
        {progressLabel && <span className="aiel-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="aiel-stage-title">{title}</h2>
      {subtitle && <p className="aiel-stage-subtitle">{subtitle}</p>}
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

/* ------------------------------- MAIN APP ------------------------------- */

export default function GenerativeAILab() {
  const [current, setCurrent] = useState<number>(0); // 0..3 stages, 4 = certificate
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);

  const [wordAnswers, setWordAnswers] = useState<WordAnswerMap>({});
  const [promptAnswers, setPromptAnswers] = useState<PromptAnswerMap>({});
  const [toolAnswers, setToolAnswers] = useState<ToolAnswerMap>({});
  const [ethicsAnswers, setEthicsAnswers] = useState<EthicsAnswerMap>({});

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

  const scores = useMemo(() => {
    const wordCorrect = WORD_ITEMS.filter((it) => wordAnswers[it.id] === it.answer).length;
    const promptCorrect = PROMPT_ITEMS.filter((it) => promptAnswers[it.id] === "strong").length;
    const toolCorrect = TOOL_ITEMS.filter((it) => toolAnswers[it.id] === it.answer).length;
    const ethicsCorrect = ETHICS_ITEMS.filter((it) => ethicsAnswers[it.id] === it.answer).length;
    return { wordCorrect, promptCorrect, toolCorrect, ethicsCorrect };
  }, [wordAnswers, promptAnswers, toolAnswers, ethicsAnswers]);

  const totalScore = scores.wordCorrect + scores.promptCorrect + scores.toolCorrect + scores.ethicsCorrect;
  const totalPossible = WORD_ITEMS.length + PROMPT_ITEMS.length + TOOL_ITEMS.length + ETHICS_ITEMS.length;

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false]);
    setWordAnswers({});
    setPromptAnswers({});
    setToolAnswers({});
    setEthicsAnswers({});
  };

  return (
    <div className="aiel-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
        ${STYLES}
      `}</style>

      <div className="aiel-container">
        <div className="aiel-header">
          <div className="aiel-header-icon">
            <Compass size={26} color={colors.gold} />
          </div>
          <h1 className="aiel-h1">ChatGPT & Generative AI Lab</h1>
          <p className="aiel-subtitle">
            Play the same game a language model plays, craft sharper prompts, match tasks to the right
            AI tools, and spot the ethical concerns hiding in real scenarios.
          </p>
        </div>

        {current <= 3 && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: LLMs */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Predict the Next Word"
            subtitle="This is exactly the task an LLM is trained on: given the text so far, guess the most likely next word."
            progressLabel={`${Object.keys(wordAnswers).length}/${WORD_ITEMS.length} predicted`}
          >
            <div className="aiel-item-list">
              {WORD_ITEMS.map((item) => {
                const chosen = wordAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="aiel-item-card">
                    <p className="aiel-item-text">{item.prompt}</p>
                    {!chosen ? (
                      <div className="aiel-choice-row">
                        {item.options.map((opt, i) => (
                          <button
                            key={opt}
                            className={`aiel-choice-btn ${i === 0 ? "aiel-choice-teal" : i === 1 ? "aiel-choice-coral" : "aiel-choice-gold"}`}
                            onClick={() => setWordAnswers((p) => ({ ...p, [item.id]: opt }))}
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
                          {isCorrect ? "Correct -- " : `Most models would pick '${item.answer}' here. `}
                          {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              backDisabled
              onBack={() => {}}
              nextDisabled={!wordDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: Prompt Engineering */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Which Prompt Wins?"
            subtitle="Same goal, two different prompts. Pick the one that would actually get a better answer."
            progressLabel={`${Object.keys(promptAnswers).length}/${PROMPT_ITEMS.length} chosen`}
          >
            <div className="aiel-item-list">
              {PROMPT_ITEMS.map((item) => {
                const chosen = promptAnswers[item.id];
                return (
                  <div key={item.id} className="aiel-item-card">
                    <p className="aiel-item-goal">Goal: {item.goal}</p>
                    <div className="aiel-prompt-pair">
                      <button
                        className={`aiel-prompt-option ${chosen ? (chosen === "weak" ? "is-wrong" : "") : ""}`}
                        onClick={() => !chosen && setPromptAnswers((p) => ({ ...p, [item.id]: "weak" }))}
                        disabled={!!chosen}
                      >
                        <p className="aiel-prompt-option-label">Prompt A</p>
                        <p className="aiel-prompt-option-text">"{item.weak}"</p>
                      </button>
                      <button
                        className={`aiel-prompt-option ${chosen ? (chosen === "strong" ? "is-correct" : "") : ""}`}
                        onClick={() => !chosen && setPromptAnswers((p) => ({ ...p, [item.id]: "strong" }))}
                        disabled={!!chosen}
                      >
                        <p className="aiel-prompt-option-label">Prompt B</p>
                        <p className="aiel-prompt-option-text">"{item.strong}"</p>
                      </button>
                    </div>
                    {chosen && (
                      <div className="aiel-feedback">
                        {chosen === "strong" ? (
                          <CheckCircle2 size={16} color={colors.teal} className="aiel-feedback-icon" />
                        ) : (
                          <XCircle size={16} color={colors.coral} className="aiel-feedback-icon" />
                        )}
                        <p className="aiel-feedback-text">
                          {chosen === "strong" ? "Correct -- Prompt B wins. " : "Prompt B actually wins here. "}
                          {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!promptDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: AI Assistants */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Match the Right Tool"
            subtitle="An AI assistant is only as useful as the tools behind it. Sort each task by what it truly needs."
            progressLabel={`${Object.keys(toolAnswers).length}/${TOOL_ITEMS.length} matched`}
          >
            <div className="aiel-item-list">
              {TOOL_ITEMS.map((item) => {
                const chosen = toolAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="aiel-item-card">
                    <p className="aiel-item-text">{item.label}</p>
                    {!chosen ? (
                      <div className="aiel-tag-row">
                        {TOOL_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            className="aiel-choice-outline"
                            onClick={() => setToolAnswers((p) => ({ ...p, [item.id]: cat.id }))}
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
                          Needs: <strong style={{ color: colors.ink }}>
                            {TOOL_CATEGORIES.find((c) => c.id === item.answer)?.label}
                          </strong> -- {TOOL_CATEGORIES.find((c) => c.id === item.answer)?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!toolDone}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: AI Ethics */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Spot the Concern"
            subtitle="Read each real-world scenario and identify which ethical concern it raises."
            progressLabel={`${Object.keys(ethicsAnswers).length}/${ETHICS_ITEMS.length} classified`}
          >
            <div className="aiel-item-list">
              {ETHICS_ITEMS.map((item) => {
                const chosen = ethicsAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="aiel-item-card">
                    <p className="aiel-item-text">{item.text}</p>
                    {!chosen ? (
                      <div className="aiel-tag-row">
                        {ETHICS_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            className="aiel-choice-outline"
                            onClick={() => setEthicsAnswers((p) => ({ ...p, [item.id]: cat.id }))}
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
                          Correct concern: <strong style={{ color: colors.ink }}>
                            {ETHICS_CATEGORIES.find((c) => c.id === item.answer)?.label}
                          </strong> -- {ETHICS_CATEGORIES.find((c) => c.id === item.answer)?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!ethicsDone}
              nextLabel="Finish Lab"
              onNext={() => {
                markComplete(3);
                setCurrent(4);
              }}
            />
          </StageShell>
        )}

        {/* CERTIFICATE */}
        {current === 4 && (
          <div className="aiel-cert">
            <div className="aiel-cert-badge">
              <Award size={36} color={colors.ink} />
            </div>
            <p className="aiel-cert-eyebrow">Certificate of Completion</p>
            <h2 className="aiel-cert-title">You've completed Module 4</h2>
            <p className="aiel-cert-desc">
              You played the next-word prediction game LLMs are trained on, sharpened weak prompts into
              strong ones, matched tasks to the right AI tools, and spotted real ethical concerns in AI.
            </p>

            <div className="aiel-cert-score">
              <span className="aiel-cert-score-num">{totalScore}/{totalPossible}</span>
              <span className="aiel-cert-score-label">correct across the scored stages</span>
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