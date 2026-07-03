"use client";
import React, { useState, useMemo } from "react";
import {
  Brain,
  RefreshCw,
  GitBranch,
  Mail,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  RotateCcw,
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
  .mlwm-root {
    min-height: 100vh;
    width: 100%;
    padding: 32px 16px;
    background: radial-gradient(circle at 20% -10%, ${colors.bgSoft} 0%, ${colors.bg} 55%);
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
  }
  .mlwm-root *, .mlwm-root *::before, .mlwm-root *::after { box-sizing: border-box; }
  .mlwm-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .mlwm-root button:focus-visible { outline: 3px solid ${colors.purple}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .mlwm-root * { transition: none !important; animation: none !important; }
  }

  .mlwm-container { max-width: 760px; margin: 0 auto; }

  .mlwm-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; margin-bottom: 28px; }
  .mlwm-header-icon {
    width: 60px; height: 60px; border-radius: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 2.5px solid ${colors.border};
    box-shadow: 0 6px 0 ${colors.border};
  }
  .mlwm-h1 {
    font-family: 'Baloo 2', sans-serif; font-weight: 800; margin: 0; line-height: 1.15;
    font-size: 28px;
    background: linear-gradient(90deg, #D9A62B 0%, ${colors.coral} 45%, ${colors.purple} 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .mlwm-h1 { font-size: 34px; } }
  .mlwm-subtitle { font-size: 15px; color: ${colors.muted}; max-width: 560px; margin: 4px auto 0 auto; line-height: 1.55; }

  .mlwm-progress-track {
    width: 100%; height: 14px; border-radius: 999px; background: #FFFFFF;
    border: 2px solid ${colors.borderSoft}; overflow: hidden; margin-bottom: 18px;
  }
  .mlwm-progress-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, ${colors.gold} 0%, ${colors.coral} 100%);
    transition: width 0.35s ease;
  }

  .mlwm-stampbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px; margin-bottom: 28px; flex-wrap: wrap;
  }
  .mlwm-stamp-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 18px; border-radius: 999px; font-weight: 700; font-size: 14px;
    transition: transform 0.15s ease, box-shadow 0.15s ease; flex: 1; min-width: 130px; justify-content: center;
  }
  .mlwm-stamp-btn:hover { transform: translateY(-2px); }
  .mlwm-stamp-label {
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    text-align: center; white-space: nowrap;
  }
  @media (max-width: 639px) {
    .mlwm-stamp-label { display: none; }
    .mlwm-stamp-btn { min-width: 0; padding: 12px; }
  }

  .mlwm-stage-shell { border-radius: 28px; padding: 20px; background: ${colors.card}; border: 3px solid ${colors.border}; box-shadow: 0 10px 0 ${colors.borderSoft}; }
  @media (min-width: 640px) { .mlwm-stage-shell { padding: 32px; } }
  .mlwm-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .mlwm-stage-tag {
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.teal};
  }
  .mlwm-stage-progress { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: ${colors.muted}; }
  .mlwm-stage-title {
    font-family: 'Baloo 2', sans-serif; font-weight: 800; color: ${colors.goldDeep};
    font-size: 24px; margin: 4px 0 8px 0;
  }
  @media (min-width: 640px) { .mlwm-stage-title { font-size: 28px; } }
  .mlwm-stage-subtitle { font-size: 14px; color: ${colors.muted}; margin: 0 0 24px 0; }

  .mlwm-item-list { display: flex; flex-direction: column; gap: 12px; }
  .mlwm-item-card { border-radius: 20px; padding: 16px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; }
  .mlwm-item-text { font-size: 14px; color: ${colors.ink}; margin: 0 0 12px 0; font-weight: 500; }

  .mlwm-choice-row { display: flex; gap: 8px; }
  .mlwm-choice-btn {
    flex: 1; font-size: 12.5px; font-weight: 700; padding: 12px 8px; border-radius: 999px; color: ${colors.ink};
    box-shadow: 0 4px 0 rgba(0,0,0,0.18); transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  .mlwm-choice-btn:hover { transform: translateY(-1px); }
  .mlwm-choice-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,0.18); }
  .mlwm-choice-teal { background: linear-gradient(180deg, #7EE6D6 0%, ${colors.teal} 100%); }
  .mlwm-choice-coral { background: linear-gradient(180deg, #FFAD8F 0%, ${colors.coral} 100%); }
  .mlwm-choice-gold { background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%); }
  .mlwm-choice-outline {
    font-size: 12.5px; font-weight: 700; padding: 10px 14px; border-radius: 999px;
    background: ${colors.card}; border: 2px solid ${colors.border}; color: ${colors.ink};
    transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease;
  }
  .mlwm-choice-outline:hover { background: ${colors.borderSoft}; border-color: ${colors.gold}; transform: translateY(-1px); }

  .mlwm-feedback { display: flex; align-items: flex-start; gap: 8px; }
  .mlwm-feedback-text { font-size: 12px; color: ${colors.muted}; margin: 0; line-height: 1.5; }
  .mlwm-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .mlwm-timeline { position: relative; padding-left: 24px; }
  .mlwm-timeline-line { position: absolute; left: 8px; top: 4px; bottom: 4px; width: 2px; background: ${colors.borderSoft}; }
  .mlwm-timeline-list { display: flex; flex-direction: column; gap: 12px; }
  .mlwm-timeline-item { position: relative; }
  .mlwm-timeline-dot { position: absolute; left: -24px; top: 8px; width: 12px; height: 12px; border-radius: 999px; }
  .mlwm-timeline-card { width: 100%; text-align: left; border-radius: 20px; padding: 16px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; transition: border-color 0.15s ease, transform 0.15s ease; }
  .mlwm-timeline-card:hover { border-color: ${colors.gold}; transform: translateY(-1px); }
  .mlwm-timeline-top { display: flex; align-items: center; justify-content: space-between; }
  .mlwm-timeline-year { font-family: 'Baloo 2', sans-serif; font-size: 13px; font-weight: 700; color: ${colors.goldDeep}; }
  .mlwm-timeline-title { font-size: 14px; font-weight: 600; color: ${colors.ink}; }
  .mlwm-timeline-text { font-size: 12px; color: ${colors.muted}; margin: 12px 0 0 0; line-height: 1.5; }

  .mlwm-tag-row { display: flex; flex-wrap: wrap; gap: 8px; }

  .mlwm-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; }
  .mlwm-nav-back {
    display: flex; align-items: center; gap: 4px; padding: 10px 18px; border-radius: 999px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft}; background: ${colors.cardAlt};
    transition: transform 0.12s ease, background 0.15s ease;
  }
  .mlwm-nav-back:not([disabled]):hover { background: ${colors.borderSoft}; transform: translateY(-1px); }
  .mlwm-nav-next {
    display: flex; align-items: center; gap: 4px; padding: 12px 22px; border-radius: 999px;
    font-size: 14px; font-weight: 700; color: ${colors.ink};
    background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%);
    box-shadow: 0 5px 0 ${colors.goldDeep};
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  .mlwm-nav-next:not([disabled]):hover { transform: translateY(-1px); }
  .mlwm-nav-next:not([disabled]):active { transform: translateY(4px); box-shadow: 0 1px 0 ${colors.goldDeep}; }
  .mlwm-nav-next[disabled], .mlwm-nav-back[disabled] { opacity: 0.4; cursor: default; background: ${colors.cardAlt}; color: ${colors.muted}; box-shadow: none; }

  .mlwm-cert { border-radius: 28px; padding: 32px 20px; text-align: center; background: ${colors.card}; border: 3px solid ${colors.border}; box-shadow: 0 10px 0 ${colors.borderSoft}; }
  @media (min-width: 640px) { .mlwm-cert { padding: 40px; } }
  .mlwm-cert-badge {
    margin: 0 auto 20px auto; width: 76px; height: 76px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%);
    box-shadow: 0 6px 0 ${colors.goldDeep};
  }
  .mlwm-cert-eyebrow { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.teal}; margin: 0 0 8px 0; }
  .mlwm-cert-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; color: ${colors.goldDeep}; font-size: 26px; margin: 0 0 12px 0; }
  .mlwm-cert-desc { font-size: 14px; color: ${colors.muted}; margin: 0 0 24px 0; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
  .mlwm-cert-score {
    display: inline-flex; align-items: center; gap: 12px; border-radius: 20px; padding: 16px 24px; margin-bottom: 32px;
    background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft};
  }
  .mlwm-cert-score-num { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 30px; color: ${colors.goldDeep}; }
  .mlwm-cert-score-label { font-size: 12px; color: ${colors.muted}; text-align: left; max-width: 140px; }
  .mlwm-cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px; text-align: left; }
  @media (min-width: 480px) { .mlwm-cert-grid { grid-template-columns: repeat(4, 1fr); } }
  .mlwm-cert-item { border-radius: 14px; padding: 12px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; }
  .mlwm-cert-item p { font-size: 12px; color: ${colors.ink}; margin: 6px 0 0 0; font-weight: 600; }
  .mlwm-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700;
    padding: 12px 22px; border-radius: 999px; background: ${colors.cardAlt}; border: 2px solid ${colors.border}; color: ${colors.ink};
  }
`;

/* ---------------------------- CONTENT DATA ---------------------------- */

const STAGE_META = [
  { key: "what-is-learning", title: "What Is Learning?", icon: Brain, tag: "Stage 1 · Spot the Pattern" },
  { key: "how-machines-learn", title: "How Machines Learn", icon: RefreshCw, tag: "Stage 2 · Dig the Pipeline" },
  { key: "training-vs-testing", title: "Training vs Testing", icon: GitBranch, tag: "Stage 3 · Sort the Data" },
  { key: "example", title: "Worked Example", icon: Mail, tag: "Stage 4 · Train a Spam Filter" },
];

const SPOT_ITEMS = [
  { id: "s1", text: "A parrot squawks 'Hello!' every time the doorbell rings — it has no idea what the word means.", answer: "rules", explain: "Pure repetition with no understanding. Nothing is being adjusted or improved." },
  { id: "s2", text: "After solving a few algebra problems, a student can now solve a brand-new one using the same idea.", answer: "learning", explain: "The knowledge generalized to something never seen before — the core of real learning." },
  { id: "s3", text: "A vending machine dispenses a soda every time button B3 is pressed.", answer: "rules", explain: "One fixed instruction, forever. There's no adjustment based on experience." },
  { id: "s4", text: "After burning her hand once, a child now blows on hot food before taking a bite.", answer: "learning", explain: "Behavior changed permanently because of a single experience — that's learning." },
  { id: "s5", text: "A factory robot repeats the exact same welding motion on every car that passes by.", answer: "rules", explain: "Identical action every time, regardless of what's actually in front of it." },
  { id: "s6", text: "A dog that used to fear the vacuum cleaner slowly relaxes after hearing it safely many times.", answer: "learning", explain: "Repeated experience gradually changed the dog's response — a textbook example of learning." },
];

const PIPELINE_STEPS = [
  { id: "p1", year: "STEP 01", title: "Collect Data", text: "Gather lots of real examples — photos, prices, sentences, clicks — anything that shows the pattern you want the machine to notice." },
  { id: "p2", year: "STEP 02", title: "Find Patterns", text: "An algorithm studies the data and looks for regularities: which features tend to show up together, and which lead to which outcomes." },
  { id: "p3", year: "STEP 03", title: "Build a Model", text: "Those patterns get turned into a compact set of internal rules — a 'model' — that can take a new input and produce a guess." },
  { id: "p4", year: "STEP 04", title: "Make Predictions", text: "The model is shown something it has never seen before and produces its best guess based on what it learned." },
  { id: "p5", year: "STEP 05", title: "Check & Improve", text: "The guess is compared against the real answer. The model nudges its internal rules to be a little more accurate next time — then repeats." },
];

const SPLIT_ITEMS = [
  { id: "c1", label: "10,000 labeled cat and dog photos the model studies over and over", answer: "training" },
  { id: "c2", label: "500 brand-new photos the model has never seen, used to check its score", answer: "testing" },
  { id: "c3", label: "Years of past weather records used to teach a model what leads to rain", answer: "training" },
  { id: "c4", label: "Tomorrow's actual weather, used to see whether the prediction was right", answer: "testing" },
  { id: "c5", label: "A decade of old customer purchases used to teach a recommendation engine", answer: "training" },
  { id: "c6", label: "A fresh batch of shoppers the system has never encountered, used only to grade it", answer: "testing" },
];

const SPLIT_CATEGORIES = [
  { id: "training", label: "Training Data", hint: "What the model studies and learns from" },
  { id: "testing", label: "Testing Data", hint: "Held back, used only to grade the model" },
];

const SPAM_ITEMS = [
  { id: "e1", text: "\"FREE MONEY!! Click now to claim your $1,000,000 prize!!!\"", answer: "spam", explain: "Urgent all-caps language, an unbelievable prize, and pressure to click — classic spam signals." },
  { id: "e2", text: "\"Hey, are we still on for lunch tomorrow at noon?\"", answer: "not_spam", explain: "Casual, specific, personal — the kind of message a real contact actually sends." },
  { id: "e3", text: "\"URGENT: Your account will be suspended, verify your password immediately.\"", answer: "spam", explain: "Manufactured urgency plus a request for a password is a textbook phishing pattern." },
  { id: "e4", text: "\"Reminder: your dentist appointment is on Thursday at 3pm.\"", answer: "not_spam", explain: "A plain, expected reminder tied to something real in your life." },
  { id: "e5", text: "\"Congratulations! You've been selected for a free cruise — reply NOW.\"", answer: "spam", explain: "Unearned reward plus a demand for an immediate reply — a pattern the model learns to flag." },
  { id: "e6", text: "\"Here's the report you asked for, let me know if you have questions.\"", answer: "not_spam", explain: "References something specific you'd actually expect, with a normal, unhurried tone." },
];

/* ------------------------------- HELPERS ------------------------------- */

function StampBar({ current, completed, onJump }) {
  const doneCount = completed.filter(Boolean).length;
  const pct = (doneCount / STAGE_META.length) * 100;
  return (
    <div>
      <div className="mlwm-progress-track">
        <div className="mlwm-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="mlwm-stampbar">
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
              className="mlwm-stamp-btn"
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
              <span className="mlwm-stamp-label" style={{ color: isDone || isCurrent ? colors.ink : colors.muted }}>
                {s.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StageShell({ tag, title, subtitle, progressLabel, children }) {
  return (
    <div className="mlwm-stage-shell">
      <div className="mlwm-stage-top">
        <span className="mlwm-stage-tag">{tag}</span>
        {progressLabel && <span className="mlwm-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="mlwm-stage-title">{title}</h2>
      {subtitle && <p className="mlwm-stage-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}

function NavButtons({ onBack, onNext, backDisabled, nextDisabled, nextLabel }) {
  return (
    <div className="mlwm-nav-row">
      <button className="mlwm-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <button className="mlwm-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ------------------------------- MAIN APP ------------------------------- */

export default function MLWithoutMathLab() {
  const [current, setCurrent] = useState(0); // 0..3 stages, 4 = certificate
  const [completed, setCompleted] = useState([false, false, false, false]);

  const [spotAnswers, setSpotAnswers] = useState({});
  const [visitedSteps, setVisitedSteps] = useState({});
  const [openStep, setOpenStep] = useState(null);
  const [splitAnswers, setSplitAnswers] = useState({});
  const [spamAnswers, setSpamAnswers] = useState({});

  const markComplete = (idx) => {
    setCompleted((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const goTo = (idx) => setCurrent(idx);

  const spotDone = Object.keys(spotAnswers).length === SPOT_ITEMS.length;
  const pipelineDone = Object.keys(visitedSteps).length === PIPELINE_STEPS.length;
  const splitDone = Object.keys(splitAnswers).length === SPLIT_ITEMS.length;
  const spamDone = Object.keys(spamAnswers).length === SPAM_ITEMS.length;

  const scores = useMemo(() => {
    const spotCorrect = SPOT_ITEMS.filter((it) => spotAnswers[it.id] === it.answer).length;
    const splitCorrect = SPLIT_ITEMS.filter((it) => splitAnswers[it.id] === it.answer).length;
    const spamCorrect = SPAM_ITEMS.filter((it) => spamAnswers[it.id] === it.answer).length;
    return { spotCorrect, splitCorrect, spamCorrect };
  }, [spotAnswers, splitAnswers, spamAnswers]);

  const totalScore = scores.spotCorrect + scores.splitCorrect + scores.spamCorrect;
  const totalPossible = SPOT_ITEMS.length + SPLIT_ITEMS.length + SPAM_ITEMS.length;

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false]);
    setSpotAnswers({});
    setVisitedSteps({});
    setOpenStep(null);
    setSplitAnswers({});
    setSpamAnswers({});
  };

  return (
    <div className="mlwm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
        ${STYLES}
      `}</style>

      <div className="mlwm-container">
        <div className="mlwm-header">
          <div className="mlwm-header-icon">
            <Compass size={26} color={colors.gold} />
          </div>
          <h1 className="mlwm-h1">Machine Learning Without Math</h1>
          <p className="mlwm-subtitle">
            No formulas, no code — just the ideas. Learn what learning actually means, how a machine turns
            examples into a skill, why data gets split in two, and watch it all play out on a real spam filter.
          </p>
        </div>

        {current <= 3 && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: What Is Learning? */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Spot the Learning"
            subtitle="Read each scenario. Is something actually learning, or just repeating a fixed behavior?"
            progressLabel={`${Object.keys(spotAnswers).length}/${SPOT_ITEMS.length} sorted`}
          >
            <div className="mlwm-item-list">
              {SPOT_ITEMS.map((item) => {
                const chosen = spotAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="mlwm-item-card">
                    <p className="mlwm-item-text">{item.text}</p>
                    {!chosen ? (
                      <div className="mlwm-choice-row">
                        <button
                          className="mlwm-choice-btn mlwm-choice-teal"
                          onClick={() => setSpotAnswers((p) => ({ ...p, [item.id]: "learning" }))}
                        >
                          Real Learning
                        </button>
                        <button
                          className="mlwm-choice-btn mlwm-choice-coral"
                          onClick={() => setSpotAnswers((p) => ({ ...p, [item.id]: "rules" }))}
                        >
                          Just Repeating
                        </button>
                      </div>
                    ) : (
                      <div className="mlwm-feedback">
                        {isCorrect ? (
                          <CheckCircle2 size={16} color={colors.teal} className="mlwm-feedback-icon" />
                        ) : (
                          <XCircle size={16} color={colors.coral} className="mlwm-feedback-icon" />
                        )}
                        <p className="mlwm-feedback-text">
                          {isCorrect ? "Correct — " : `Actually, this is ${item.answer === "learning" ? "real learning" : "just repeating a fixed behavior"}. `}
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
              nextDisabled={!spotDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: How Machines Learn */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Dig Through the Pipeline"
            subtitle="Tap each step to reveal what happens as raw data turns into a working skill."
            progressLabel={`${Object.keys(visitedSteps).length}/${PIPELINE_STEPS.length} uncovered`}
          >
            <div className="mlwm-timeline">
              <div className="mlwm-timeline-line" />
              <div className="mlwm-timeline-list">
                {PIPELINE_STEPS.map((step) => {
                  const isOpen = openStep === step.id;
                  const isVisited = visitedSteps[step.id];
                  return (
                    <div key={step.id} className="mlwm-timeline-item">
                      <div className="mlwm-timeline-dot" style={{ background: isVisited ? colors.gold : colors.borderSoft }} />
                      <button
                        className="mlwm-timeline-card"
                        onClick={() => {
                          setOpenStep(isOpen ? null : step.id);
                          setVisitedSteps((p) => ({ ...p, [step.id]: true }));
                        }}
                      >
                        <div className="mlwm-timeline-top">
                          <span className="mlwm-timeline-year">{step.year}</span>
                          <span className="mlwm-timeline-title">{step.title}</span>
                        </div>
                        {isOpen && <p className="mlwm-timeline-text">{step.text}</p>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!pipelineDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: Training vs Testing */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Training Set or Testing Set?"
            subtitle="Every machine learning project splits its data in two. Sort each example into the pile it belongs to."
            progressLabel={`${Object.keys(splitAnswers).length}/${SPLIT_ITEMS.length} sorted`}
          >
            <div className="mlwm-item-list">
              {SPLIT_ITEMS.map((item) => {
                const chosen = splitAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="mlwm-item-card">
                    <p className="mlwm-item-text">{item.label}</p>
                    {!chosen ? (
                      <div className="mlwm-tag-row">
                        {SPLIT_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            className="mlwm-choice-outline"
                            onClick={() => setSplitAnswers((p) => ({ ...p, [item.id]: cat.id }))}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="mlwm-feedback">
                        {isCorrect ? (
                          <CheckCircle2 size={16} color={colors.teal} className="mlwm-feedback-icon" />
                        ) : (
                          <XCircle size={16} color={colors.coral} className="mlwm-feedback-icon" />
                        )}
                        <p className="mlwm-feedback-text">
                          Correct pile: <strong style={{ color: colors.ink }}>
                            {SPLIT_CATEGORIES.find((c) => c.id === item.answer).label}
                          </strong> — {SPLIT_CATEGORIES.find((c) => c.id === item.answer).hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!splitDone}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: Worked Example */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Train a Spam Filter"
            subtitle="This is exactly what a model sees during training: an example, then the correct label. Guess before you peek."
            progressLabel={`${Object.keys(spamAnswers).length}/${SPAM_ITEMS.length} labeled`}
          >
            <div className="mlwm-item-list">
              {SPAM_ITEMS.map((item) => {
                const chosen = spamAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="mlwm-item-card">
                    <p className="mlwm-item-text">{item.text}</p>
                    {!chosen ? (
                      <div className="mlwm-choice-row">
                        <button
                          className="mlwm-choice-btn mlwm-choice-coral"
                          onClick={() => setSpamAnswers((p) => ({ ...p, [item.id]: "spam" }))}
                        >
                          Spam
                        </button>
                        <button
                          className="mlwm-choice-btn mlwm-choice-teal"
                          onClick={() => setSpamAnswers((p) => ({ ...p, [item.id]: "not_spam" }))}
                        >
                          Not Spam
                        </button>
                      </div>
                    ) : (
                      <div className="mlwm-feedback">
                        {isCorrect ? (
                          <CheckCircle2 size={16} color={colors.teal} className="mlwm-feedback-icon" />
                        ) : (
                          <XCircle size={16} color={colors.coral} className="mlwm-feedback-icon" />
                        )}
                        <p className="mlwm-feedback-text">
                          Labeled: <strong style={{ color: colors.ink }}>{item.answer === "spam" ? "Spam" : "Not Spam"}</strong> — {item.explain}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!spamDone}
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
          <div className="mlwm-cert">
            <div className="mlwm-cert-badge">
              <Award size={36} color={colors.ink} />
            </div>
            <p className="mlwm-cert-eyebrow">Certificate of Completion</p>
            <h2 className="mlwm-cert-title">You've completed Module 2</h2>
            <p className="mlwm-cert-desc">
              You told real learning apart from mere repetition, walked the data-to-prediction pipeline,
              sorted training data from testing data, and trained your own mental spam filter — no math required.
            </p>

            <div className="mlwm-cert-score">
              <span className="mlwm-cert-score-num">{totalScore}/{totalPossible}</span>
              <span className="mlwm-cert-score-label">correct across the scored stages</span>
            </div>

            <div className="mlwm-cert-grid">
              {STAGE_META.map((s) => (
                <div key={s.key} className="mlwm-cert-item">
                  <CheckCircle2 size={14} color={colors.teal} />
                  <p>{s.title}</p>
                </div>
              ))}
            </div>

            <button className="mlwm-reset-btn" onClick={resetAll}>
              <RotateCcw size={14} /> Restart the Lab
            </button>
          </div>
        )}
      </div>
    </div>
  );
}