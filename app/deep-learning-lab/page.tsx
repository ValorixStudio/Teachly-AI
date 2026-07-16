"use client";
import React, { useState, useMemo } from "react";
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

  .aiel-feedback { display: flex; align-items: flex-start; gap: 8px; }
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
  { key: "cnn", title: "CNN", icon: ImageIcon, tag: "Stage 1 - Spot the Pattern" },
  { key: "rnn", title: "RNN", icon: Workflow, tag: "Stage 2 - Follow the Sequence" },
  { key: "lstm", title: "LSTM", icon: Brain, tag: "Stage 3 - Remember Longer" },
  { key: "transformers", title: "Transformers", icon: Sparkles, tag: "Stage 4 - Pay Attention" },
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

interface QuizListProps {
  items: QuizItem[];
  answers: AnswerMap;
  onAnswer: (id: string, value: string) => void;
}

function QuizList({ items, answers, onAnswer }: QuizListProps) {
  const palette = ["aiel-choice-teal", "aiel-choice-coral", "aiel-choice-gold"];
  return (
    <div className="aiel-item-list">
      {items.map((item) => {
        const chosen = answers[item.id];
        const isCorrect = chosen === item.answer;
        return (
          <div key={item.id} className="aiel-item-card">
            {item.code && <pre className="aiel-code-block">{item.code}</pre>}
            <p className="aiel-item-question">{item.question}</p>
            {!chosen ? (
              <div className="aiel-choice-row">
                {item.options.map((opt, i) => (
                  <button
                    key={opt}
                    className={`aiel-choice-btn ${palette[i % palette.length]}`}
                    onClick={() => onAnswer(item.id, opt)}
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

export default function DeepLearningLab() {
  const [current, setCurrent] = useState<number>(0); // 0..3 stages, 4 = certificate
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);

  const [cnnAnswers, setCnnAnswers] = useState<AnswerMap>({});
  const [rnnAnswers, setRnnAnswers] = useState<AnswerMap>({});
  const [lstmAnswers, setLstmAnswers] = useState<AnswerMap>({});
  const [transformerAnswers, setTransformerAnswers] = useState<AnswerMap>({});

  const markComplete = (idx: number) => {
    setCompleted((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const goTo = (idx: number) => setCurrent(idx);

  const cnnDone = Object.keys(cnnAnswers).length === CNN_ITEMS.length;
  const rnnDone = Object.keys(rnnAnswers).length === RNN_ITEMS.length;
  const lstmDone = Object.keys(lstmAnswers).length === LSTM_ITEMS.length;
  const transformerDone = Object.keys(transformerAnswers).length === TRANSFORMER_ITEMS.length;

  const scores = useMemo(() => {
    const cnnCorrect = CNN_ITEMS.filter((it) => cnnAnswers[it.id] === it.answer).length;
    const rnnCorrect = RNN_ITEMS.filter((it) => rnnAnswers[it.id] === it.answer).length;
    const lstmCorrect = LSTM_ITEMS.filter((it) => lstmAnswers[it.id] === it.answer).length;
    const transformerCorrect = TRANSFORMER_ITEMS.filter((it) => transformerAnswers[it.id] === it.answer).length;
    return { cnnCorrect, rnnCorrect, lstmCorrect, transformerCorrect };
  }, [cnnAnswers, rnnAnswers, lstmAnswers, transformerAnswers]);

  const totalScore = scores.cnnCorrect + scores.rnnCorrect + scores.lstmCorrect + scores.transformerCorrect;
  const totalPossible = CNN_ITEMS.length + RNN_ITEMS.length + LSTM_ITEMS.length + TRANSFORMER_ITEMS.length;

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false]);
    setCnnAnswers({});
    setRnnAnswers({});
    setLstmAnswers({});
    setTransformerAnswers({});
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
          <h1 className="aiel-h1">Deep Learning Lab</h1>
          <p className="aiel-subtitle">
            Slide filters across images, trace memory through sequences, see how LSTMs remember
            longer, and watch attention connect words across a whole sentence.
          </p>
        </div>

        {current <= 3 && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: CNN */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="Spot the Pattern"
            subtitle="CNNs slide small filters across an image, hunting for specific local patterns."
            progressLabel={`${Object.keys(cnnAnswers).length}/${CNN_ITEMS.length} solved`}
          >
            <QuizList items={CNN_ITEMS} answers={cnnAnswers} onAnswer={(id, value) => setCnnAnswers((p) => ({ ...p, [id]: value }))} />
            <NavButtons
              backDisabled
              onBack={() => {}}
              nextDisabled={!cnnDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: RNN */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Follow the Sequence"
            subtitle="RNNs process data one step at a time, carrying a running memory forward."
            progressLabel={`${Object.keys(rnnAnswers).length}/${RNN_ITEMS.length} solved`}
          >
            <QuizList items={RNN_ITEMS} answers={rnnAnswers} onAnswer={(id, value) => setRnnAnswers((p) => ({ ...p, [id]: value }))} />
            <NavButtons
              onBack={() => setCurrent(0)}
              nextDisabled={!rnnDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: LSTM */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Remember Longer"
            subtitle="LSTMs add gates and a memory cell so important details survive much longer sequences."
            progressLabel={`${Object.keys(lstmAnswers).length}/${LSTM_ITEMS.length} solved`}
          >
            <QuizList items={LSTM_ITEMS} answers={lstmAnswers} onAnswer={(id, value) => setLstmAnswers((p) => ({ ...p, [id]: value }))} />
            <NavButtons
              onBack={() => setCurrent(1)}
              nextDisabled={!lstmDone}
              onNext={() => {
                markComplete(2);
                setCurrent(3);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 3: Transformers */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Pay Attention"
            subtitle="Transformers look at a whole sequence at once and use attention to connect distant words."
            progressLabel={`${Object.keys(transformerAnswers).length}/${TRANSFORMER_ITEMS.length} solved`}
          >
            <QuizList
              items={TRANSFORMER_ITEMS}
              answers={transformerAnswers}
              onAnswer={(id, value) => setTransformerAnswers((p) => ({ ...p, [id]: value }))}
            />
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!transformerDone}
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
            <h2 className="aiel-cert-title">You`ve completed Module 5</h2>
            <p className="aiel-cert-desc">
              You explored how CNNs scan images for patterns, how RNNs carry memory through a
              sequence, how LSTMs remember over much longer stretches, and how transformers use
              attention to connect words across an entire sentence.
            </p>

            <div className="aiel-cert-score">
              <span className="aiel-cert-score-num">{totalScore}/{totalPossible}</span>
              <span className="aiel-cert-score-label">correct across all four stages</span>
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