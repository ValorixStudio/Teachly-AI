"use client";
import React, { useState, useMemo } from "react";
import {
  Brain,
  Users,
  Globe,
  Clock,
  Layers,
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

  .aiel-choice-row { display: flex; gap: 8px; }
  .aiel-choice-btn {
    flex: 1; font-size: 12.5px; font-weight: 700; padding: 12px 8px; border-radius: 999px; color: ${colors.ink};
    box-shadow: 0 4px 0 rgba(0,0,0,0.18); transition: transform 0.12s ease, box-shadow 0.12s ease;
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

  .aiel-feedback { display: flex; align-items: flex-start; gap: 8px; }
  .aiel-feedback-text { font-size: 12px; color: ${colors.muted}; margin: 0; line-height: 1.5; }
  .aiel-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .aiel-hunt-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
  @media (min-width: 640px) { .aiel-hunt-grid { grid-template-columns: 1fr 1fr; } }
  .aiel-hunt-card {
    text-align: left; border-radius: 20px; padding: 16px; transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; width: 100%;
  }
  .aiel-hunt-card:hover { transform: translateY(-2px); box-shadow: 0 4px 0 ${colors.borderSoft}; }
  .aiel-hunt-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .aiel-hunt-dot { width: 14px; height: 14px; border-radius: 999px; border: 2px solid ${colors.muted}; flex-shrink: 0; }
  .aiel-hunt-label { font-size: 14px; font-weight: 600; color: ${colors.ink}; margin: 0; }
  .aiel-hunt-reveal { font-size: 12px; color: ${colors.muted}; margin: 8px 0 0 0; line-height: 1.5; }

  .aiel-timeline { position: relative; padding-left: 24px; }
  .aiel-timeline-line { position: absolute; left: 8px; top: 4px; bottom: 4px; width: 2px; background: ${colors.borderSoft}; }
  .aiel-timeline-list { display: flex; flex-direction: column; gap: 12px; }
  .aiel-timeline-item { position: relative; }
  .aiel-timeline-dot { position: absolute; left: -24px; top: 8px; width: 12px; height: 12px; border-radius: 999px; }
  .aiel-timeline-card { width: 100%; text-align: left; border-radius: 20px; padding: 16px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; transition: border-color 0.15s ease, transform 0.15s ease; }
  .aiel-timeline-card:hover { border-color: ${colors.gold}; transform: translateY(-1px); }
  .aiel-timeline-top { display: flex; align-items: center; justify-content: space-between; }
  .aiel-timeline-year { font-family: 'Baloo 2', sans-serif; font-size: 13px; font-weight: 700; color: ${colors.goldDeep}; }
  .aiel-timeline-title { font-size: 14px; font-weight: 600; color: ${colors.ink}; }
  .aiel-timeline-text { font-size: 12px; color: ${colors.muted}; margin: 12px 0 0 0; line-height: 1.5; }

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
  .aiel-cert-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; text-align: left; }
  .aiel-cert-item { border-radius: 14px; padding: 12px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; }
  .aiel-cert-item p { font-size: 12px; color: ${colors.ink}; margin: 6px 0 0 0; font-weight: 600; }
  .aiel-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700;
    padding: 12px 22px; border-radius: 999px; background: ${colors.cardAlt}; border: 2px solid ${colors.border}; color: ${colors.ink};
  }
`;

/* ---------------------------- TYPES ---------------------------- */

type SpotAnswer = "intelligent" | "rules";
type DuelAnswer = "ai" | "human";
type CategoryId = "narrow" | "general" | "super";

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

interface SpotItem {
  id: string;
  text: string;
  answer: SpotAnswer;
  explain: string;
}

interface DuelItem {
  id: string;
  text: string;
  answer: DuelAnswer;
  explain: string;
}

interface HuntItem {
  id: string;
  label: string;
  reveal: string;
}

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  text: string;
}

interface ClassifyItem {
  id: string;
  label: string;
  answer: CategoryId;
}

interface Category {
  id: CategoryId;
  label: string;
  hint: string;
}

type SpotAnswerMap = Record<string, SpotAnswer>;
type DuelAnswerMap = Record<string, DuelAnswer>;
type FoundMap = Record<string, boolean>;
type VisitedMap = Record<string, boolean>;
type ClassifiedMap = Record<string, CategoryId>;

/* ---------------------------- CONTENT DATA ---------------------------- */

const STAGE_META: StageMetaItem[] = [
  { key: "intelligence", title: "What Is Intelligence?", icon: Brain, tag: "Stage 1 - Spot the Pattern" },
  { key: "comparison", title: "AI vs Human", icon: Users, tag: "Stage 2 - Head-to-Head" },
  { key: "around-us", title: "AI Around Us", icon: Globe, tag: "Stage 3 - Scavenger Hunt" },
  { key: "history", title: "History of AI", icon: Clock, tag: "Stage 4 - Timeline Dig" },
  { key: "types", title: "Types of AI", icon: Layers, tag: "Stage 5 - Classify the Machines" },
];

const SPOT_ITEMS: SpotItem[] = [
  { id: "s1", text: "A thermostat turns on the heater whenever the room drops below 18 degreesC.", answer: "rules", explain: "Fixed if-then rule -- no learning, no adapting. Same input, same output, forever." },
  { id: "s2", text: "A crow bends a piece of wire into a hook to fish food out of a tube.", answer: "intelligent", explain: "It solved a brand-new problem it had never faced before -- real reasoning, not a script." },
  { id: "s3", text: "A calculator instantly solves a fourteen-digit multiplication.", answer: "rules", explain: "Blazing fast, but it only ever executes one fixed procedure. It can't learn new math." },
  { id: "s4", text: "A toddler tries three different grips before finally twisting a jar open.", answer: "intelligent", explain: "Trial, error, and learning from the attempt -- a core trait of intelligence." },
  { id: "s5", text: "A vending machine dispenses a snack the moment a coin is inserted.", answer: "rules", explain: "One input, one guaranteed output. Nothing is being understood or decided." },
  { id: "s6", text: "A dolphin invents a new hunting trick and teaches it to her calf.", answer: "intelligent", explain: "Inventing a method and passing it on is creativity plus learning in action." },
];

const DUEL_ITEMS: DuelItem[] = [
  { id: "d1", text: "Multiply two twelve-digit numbers instantly, with zero mistakes.", answer: "ai", explain: "Machines never tire and never miscalculate -- raw speed and precision favor AI." },
  { id: "d2", text: "Comfort a friend who just failed an important exam.", answer: "human", explain: "Reading emotion and responding with genuine empathy is still a deeply human skill." },
  { id: "d3", text: "Recall every rule of chess perfectly, every single game.", answer: "ai", explain: "Perfect, tireless memory -- machines don't forget a rule after game one thousand." },
  { id: "d4", text: "Catch the sarcasm in 'Oh great, another Monday.'", answer: "human", explain: "Sarcasm depends on tone, context, and shared experience -- territory humans still lead in." },
  { id: "d5", text: "Scan one million medical scans overnight, flagging anything unusual.", answer: "ai", explain: "Tireless, consistent, and fast at spotting patterns across huge volumes of data." },
  { id: "d6", text: "Dream up a completely original invention no one has ever imagined.", answer: "human", explain: "Open-ended, from-nothing creativity is still led by humans -- AI can assist, not originate intent." },
];

const HUNT_ITEMS: HuntItem[] = [
  { id: "h1", label: "Unlocking your phone with your face", reveal: "Facial-recognition AI maps the geometry of your face and matches it in milliseconds." },
  { id: "h2", label: "Netflix suggesting your next show", reveal: "A recommendation engine studies your watch history to predict what you'll enjoy." },
  { id: "h3", label: "Autocorrect fixing your typo mid-sentence", reveal: "Language models predict the most likely word from the patterns of billions of sentences." },
  { id: "h4", label: "Google Maps choosing the fastest route", reveal: "AI blends live traffic data with historical patterns to route you around jams." },
  { id: "h5", label: "Spam vanishing from your inbox automatically", reveal: "A spam-filter model flags suspicious patterns before the email ever reaches you." },
  { id: "h6", label: "A voice assistant answering your question", reveal: "Speech recognition plus language AI turn your voice into a spoken answer." },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t1", year: "1950", title: "Turing asks the question", text: "Alan Turing proposes the 'Turing Test' -- a way to judge if a machine can act intelligently enough to fool a human." },
  { id: "t2", year: "1956", title: "The term is born", text: "At the Dartmouth Conference, scientists coin the phrase 'Artificial Intelligence' and set out to build thinking machines." },
  { id: "t3", year: "1997", title: "Deep Blue vs Kasparov", text: "IBM's Deep Blue defeats world chess champion Garry Kasparov -- machines beat humans at pure strategy." },
  { id: "t4", year: "2011", title: "Watson wins Jeopardy!", text: "IBM Watson beats champion contestants on live TV, proving AI could understand tricky natural language." },
  { id: "t5", year: "2016", title: "AlphaGo masters Go", text: "AlphaGo defeats a world champion at Go -- a game once thought too intuitive for any machine to learn." },
  { id: "t6", year: "2020s", title: "Generative AI era", text: "Tools like ChatGPT and image generators show AI that can write, draw, code, and hold a conversation." },
];

const CLASSIFY_ITEMS: ClassifyItem[] = [
  { id: "c1", label: "Voice assistant (Siri / Alexa)", answer: "narrow" },
  { id: "c2", label: "Chess-playing engine", answer: "narrow" },
  { id: "c3", label: "Self-driving car software", answer: "narrow" },
  { id: "c4", label: "Movie recommendation engine", answer: "narrow" },
  { id: "c5", label: "A machine that learns any subject as flexibly as a human", answer: "general" },
  { id: "c6", label: "A machine smarter than all of humanity combined, at everything", answer: "super" },
];

const CATEGORIES: Category[] = [
  { id: "narrow", label: "Narrow AI", hint: "Great at one job" },
  { id: "general", label: "General AI", hint: "Hypothetical -- doesn't exist yet" },
  { id: "super", label: "Superintelligence", hint: "Purely theoretical" },
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

export default function AIExplorerLab() {
  const [current, setCurrent] = useState<number>(0); // 0..4 stages, 5 = certificate
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);

  const [spotAnswers, setSpotAnswers] = useState<SpotAnswerMap>({});
  const [duelAnswers, setDuelAnswers] = useState<DuelAnswerMap>({});
  const [found, setFound] = useState<FoundMap>({});
  const [visitedEvents, setVisitedEvents] = useState<VisitedMap>({});
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  const [classified, setClassified] = useState<ClassifiedMap>({});

  const markComplete = (idx: number) => {
    setCompleted((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const goTo = (idx: number) => setCurrent(idx);

  const spotDone = Object.keys(spotAnswers).length === SPOT_ITEMS.length;
  const duelDone = Object.keys(duelAnswers).length === DUEL_ITEMS.length;
  const huntDone = Object.keys(found).length === HUNT_ITEMS.length;
  const historyDone = Object.keys(visitedEvents).length === TIMELINE_EVENTS.length;
  const classifyDone = Object.keys(classified).length === CLASSIFY_ITEMS.length;

  const scores = useMemo(() => {
    const spotCorrect = SPOT_ITEMS.filter((it) => spotAnswers[it.id] === it.answer).length;
    const duelCorrect = DUEL_ITEMS.filter((it) => duelAnswers[it.id] === it.answer).length;
    const classifyCorrect = CLASSIFY_ITEMS.filter((it) => classified[it.id] === it.answer).length;
    return { spotCorrect, duelCorrect, classifyCorrect };
  }, [spotAnswers, duelAnswers, classified]);

  const totalScore = scores.spotCorrect + scores.duelCorrect + scores.classifyCorrect;
  const totalPossible = SPOT_ITEMS.length + DUEL_ITEMS.length + CLASSIFY_ITEMS.length;

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false, false]);
    setSpotAnswers({});
    setDuelAnswers({});
    setFound({});
    setVisitedEvents({});
    setOpenEvent(null);
    setClassified({});
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
          <h1 className="aiel-h1">AI Intro Lab</h1>
          <p className="aiel-subtitle">
            Learn what makes something intelligent, compare AI and human strengths, and explore real-world AI through fun interactive challenges.
          </p>
        </div>

        {current <= 4 && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: What is Intelligence */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Spot the Intelligence"
            subtitle="Read each scenario. Decide: is this real intelligence, or just a machine following a fixed rule?"
            progressLabel={`${Object.keys(spotAnswers).length}/${SPOT_ITEMS.length} sorted`}
          >
            <div className="aiel-item-list">
              {SPOT_ITEMS.map((item) => {
                const chosen = spotAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="aiel-item-card">
                    <p className="aiel-item-text">{item.text}</p>
                    {!chosen ? (
                      <div className="aiel-choice-row">
                        <button
                          className="aiel-choice-btn aiel-choice-teal"
                          onClick={() => setSpotAnswers((p) => ({ ...p, [item.id]: "intelligent" }))}
                        >
                          Real Intelligence
                        </button>
                        <button
                          className="aiel-choice-btn aiel-choice-coral"
                          onClick={() => setSpotAnswers((p) => ({ ...p, [item.id]: "rules" }))}
                        >
                          Just Following Rules
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
                          {isCorrect ? "Correct -- " : `Actually, this is ${item.answer === "intelligent" ? "real intelligence" : "just a rule"}. `}
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
              nextDisabled={!spotDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: AI vs Human */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Human vs AI: Who Wins?"
            subtitle="Before you see the answer, guess who is typically better at each task today."
            progressLabel={`${Object.keys(duelAnswers).length}/${DUEL_ITEMS.length} guessed`}
          >
            <div className="aiel-item-list">
              {DUEL_ITEMS.map((item) => {
                const chosen = duelAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="aiel-item-card">
                    <p className="aiel-item-text">{item.text}</p>
                    {!chosen ? (
                      <div className="aiel-choice-row">
                        <button
                          className="aiel-choice-btn aiel-choice-gold"
                          onClick={() => setDuelAnswers((p) => ({ ...p, [item.id]: "ai" }))}
                        >
                          AI
                        </button>
                        <button
                          className="aiel-choice-btn aiel-choice-teal"
                          onClick={() => setDuelAnswers((p) => ({ ...p, [item.id]: "human" }))}
                        >
                          Human
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
                          Typically wins: <strong style={{ color: colors.ink }}>{item.answer === "ai" ? "AI" : "Human"}</strong> -- {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!duelDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: AI Around Us */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="AI Around Us: Scavenger Hunt"
            subtitle="Tap each everyday moment to reveal the AI quietly working behind it."
            progressLabel={`${Object.keys(found).length}/${HUNT_ITEMS.length} found`}
          >
            <div className="aiel-hunt-grid">
              {HUNT_ITEMS.map((item) => {
                const isFound = found[item.id];
                return (
                  <button
                    key={item.id}
                    className="aiel-hunt-card"
                    style={{ borderColor: isFound ? colors.teal : colors.borderSoft }}
                    onClick={() => setFound((p) => ({ ...p, [item.id]: true }))}
                  >
                    <div className="aiel-hunt-top">
                      {isFound ? <Sparkles size={15} color={colors.teal} /> : <div className="aiel-hunt-dot" />}
                      <p className="aiel-hunt-label">{item.label}</p>
                    </div>
                    {isFound && <p className="aiel-hunt-reveal">{item.reveal}</p>}
                  </button>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!huntDone}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: History */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Dig Through the Timeline"
            subtitle="Tap each year to unearth what happened -- and why it mattered."
            progressLabel={`${Object.keys(visitedEvents).length}/${TIMELINE_EVENTS.length} unearthed`}
          >
            <div className="aiel-timeline">
              <div className="aiel-timeline-line" />
              <div className="aiel-timeline-list">
                {TIMELINE_EVENTS.map((ev) => {
                  const isOpen = openEvent === ev.id;
                  const isVisited = visitedEvents[ev.id];
                  return (
                    <div key={ev.id} className="aiel-timeline-item">
                      <div className="aiel-timeline-dot" style={{ background: isVisited ? colors.gold : colors.borderSoft }} />
                      <button
                        className="aiel-timeline-card"
                        onClick={() => {
                          setOpenEvent(isOpen ? null : ev.id);
                          setVisitedEvents((p) => ({ ...p, [ev.id]: true }));
                        }}
                      >
                        <div className="aiel-timeline-top">
                          <span className="aiel-timeline-year">{ev.year}</span>
                          <span className="aiel-timeline-title">{ev.title}</span>
                        </div>
                        {isOpen && <p className="aiel-timeline-text">{ev.text}</p>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!historyDone}
              onNext={() => {
                markComplete(3);
                setCurrent(4);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 4: Types of AI */}
        {current === 4 && (
          <StageShell
            tag={STAGE_META[4].tag}
            title="Classify the Machines"
            subtitle="Sort each example into the AI category it truly belongs to."
            progressLabel={`${Object.keys(classified).length}/${CLASSIFY_ITEMS.length} classified`}
          >
            <div className="aiel-item-list">
              {CLASSIFY_ITEMS.map((item) => {
                const chosen = classified[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="aiel-item-card">
                    <p className="aiel-item-text">{item.label}</p>
                    {!chosen ? (
                      <div className="aiel-tag-row">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            className="aiel-choice-outline"
                            onClick={() => setClassified((p) => ({ ...p, [item.id]: cat.id }))}
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
                          Correct category: <strong style={{ color: colors.ink }}>
                            {CATEGORIES.find((c) => c.id === item.answer)?.label}
                          </strong> -- {CATEGORIES.find((c) => c.id === item.answer)?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(3)}
              nextDisabled={!classifyDone}
              nextLabel="Finish Lab"
              onNext={() => {
                markComplete(4);
                setCurrent(5);
              }}
            />
          </StageShell>
        )}

        {/* CERTIFICATE */}
        {current === 5 && (
          <div className="aiel-cert">
            <div className="aiel-cert-badge">
              <Award size={36} color={colors.ink} />
            </div>
            <p className="aiel-cert-eyebrow">Certificate of Completion</p>
            <h2 className="aiel-cert-title">You've completed Module 1</h2>
            <p className="aiel-cert-desc">
              You explored intelligence, compared human and machine minds, hunted down real-world AI,
              dug through AI history, and classified today's machines.
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