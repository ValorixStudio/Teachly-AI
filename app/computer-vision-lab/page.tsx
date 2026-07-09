"use client";
import React, { useState, useMemo } from "react";
import {
  ScanFace,
  Car,
  Image as ImageIcon,
  FileText,
  Eye,
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
  .cvl-root {
    min-height: 100vh;
    width: 100%;
    padding: 32px 16px;
    background: radial-gradient(circle at 20% -10%, ${colors.bgSoft} 0%, ${colors.bg} 55%);
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
  }
  .cvl-root *, .cvl-root *::before, .cvl-root *::after { box-sizing: border-box; }
  .cvl-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  .cvl-root button:focus-visible { outline: 3px solid ${colors.purple}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .cvl-root * { transition: none !important; animation: none !important; }
  }

  .cvl-container { max-width: 760px; margin: 0 auto; }

  .cvl-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; margin-bottom: 28px; }
  .cvl-header-icon {
    width: 60px; height: 60px; border-radius: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: ${colors.card}; border: 2.5px solid ${colors.border};
    box-shadow: 0 6px 0 ${colors.border};
  }
  .cvl-h1 {
    font-family: 'Baloo 2', sans-serif; font-weight: 800; margin: 0; line-height: 1.15;
    font-size: 28px;
    background: linear-gradient(90deg, #D9A62B 0%, ${colors.coral} 45%, ${colors.purple} 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: ${colors.purple};
  }
  @media (min-width: 640px) { .cvl-h1 { font-size: 34px; } }
  .cvl-subtitle { font-size: 15px; color: ${colors.muted}; max-width: 560px; margin: 4px auto 0 auto; line-height: 1.55; }

  .cvl-progress-track {
    width: 100%; height: 14px; border-radius: 999px; background: #FFFFFF;
    border: 2px solid ${colors.borderSoft}; overflow: hidden; margin-bottom: 18px;
  }
  .cvl-progress-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, ${colors.gold} 0%, ${colors.coral} 100%);
    transition: width 0.35s ease;
  }

  .cvl-stampbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px; margin-bottom: 28px; flex-wrap: wrap;
  }
  .cvl-stamp-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 18px; border-radius: 999px; font-weight: 700; font-size: 14px;
    transition: transform 0.15s ease, box-shadow 0.15s ease; flex: 1; min-width: 130px; justify-content: center;
  }
  .cvl-stamp-btn:hover { transform: translateY(-2px); }
  .cvl-stamp-label {
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    text-align: center; white-space: nowrap;
  }
  @media (max-width: 639px) {
    .cvl-stamp-label { display: none; }
    .cvl-stamp-btn { min-width: 0; padding: 12px; }
  }

  .cvl-stage-shell { border-radius: 28px; padding: 20px; background: ${colors.card}; border: 3px solid ${colors.border}; box-shadow: 0 10px 0 ${colors.borderSoft}; }
  @media (min-width: 640px) { .cvl-stage-shell { padding: 32px; } }
  .cvl-stage-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .cvl-stage-tag {
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.teal};
  }
  .cvl-stage-progress { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: ${colors.muted}; }
  .cvl-stage-title {
    font-family: 'Baloo 2', sans-serif; font-weight: 800; color: ${colors.goldDeep};
    font-size: 24px; margin: 4px 0 8px 0;
  }
  @media (min-width: 640px) { .cvl-stage-title { font-size: 28px; } }
  .cvl-stage-subtitle { font-size: 14px; color: ${colors.muted}; margin: 0 0 24px 0; }

  .cvl-item-list { display: flex; flex-direction: column; gap: 12px; }
  .cvl-item-card { border-radius: 20px; padding: 16px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; }
  .cvl-item-text { font-size: 14px; color: ${colors.ink}; margin: 0 0 12px 0; font-weight: 500; }

  .cvl-choice-row { display: flex; gap: 8px; }
  .cvl-choice-btn {
    flex: 1; font-size: 12.5px; font-weight: 700; padding: 12px 8px; border-radius: 999px; color: ${colors.ink};
    box-shadow: 0 4px 0 rgba(0,0,0,0.18); transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  .cvl-choice-btn:hover { transform: translateY(-1px); }
  .cvl-choice-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,0.18); }
  .cvl-choice-teal { background: linear-gradient(180deg, #7EE6D6 0%, ${colors.teal} 100%); }
  .cvl-choice-coral { background: linear-gradient(180deg, #FFAD8F 0%, ${colors.coral} 100%); }
  .cvl-choice-gold { background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%); }
  .cvl-choice-outline {
    font-size: 12.5px; font-weight: 700; padding: 10px 14px; border-radius: 999px;
    background: ${colors.card}; border: 2px solid ${colors.border}; color: ${colors.ink};
    transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease;
  }
  .cvl-choice-outline:hover { background: ${colors.borderSoft}; border-color: ${colors.gold}; transform: translateY(-1px); }

  .cvl-feedback { display: flex; align-items: flex-start; gap: 8px; }
  .cvl-feedback-text { font-size: 12px; color: ${colors.muted}; margin: 0; line-height: 1.5; }
  .cvl-feedback-icon { margin-top: 2px; flex-shrink: 0; }

  .cvl-hunt-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
  @media (min-width: 640px) { .cvl-hunt-grid { grid-template-columns: 1fr 1fr; } }
  .cvl-hunt-card {
    text-align: left; border-radius: 20px; padding: 16px; transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; width: 100%;
  }
  .cvl-hunt-card:hover { transform: translateY(-2px); box-shadow: 0 4px 0 ${colors.borderSoft}; }
  .cvl-hunt-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .cvl-hunt-dot { width: 14px; height: 14px; border-radius: 999px; border: 2px solid ${colors.muted}; flex-shrink: 0; }
  .cvl-hunt-label { font-size: 14px; font-weight: 600; color: ${colors.ink}; margin: 0; }
  .cvl-hunt-reveal { font-size: 12px; color: ${colors.muted}; margin: 8px 0 0 0; line-height: 1.5; }

  .cvl-tag-row { display: flex; flex-wrap: wrap; gap: 8px; }

  .cvl-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; }
  .cvl-nav-back {
    display: flex; align-items: center; gap: 4px; padding: 10px 18px; border-radius: 999px;
    font-size: 14px; font-weight: 700; color: ${colors.inkSoft}; background: ${colors.cardAlt};
    transition: transform 0.12s ease, background 0.15s ease;
  }
  .cvl-nav-back:not([disabled]):hover { background: ${colors.borderSoft}; transform: translateY(-1px); }
  .cvl-nav-next {
    display: flex; align-items: center; gap: 4px; padding: 12px 22px; border-radius: 999px;
    font-size: 14px; font-weight: 700; color: ${colors.ink};
    background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%);
    box-shadow: 0 5px 0 ${colors.goldDeep};
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  .cvl-nav-next:not([disabled]):hover { transform: translateY(-1px); }
  .cvl-nav-next:not([disabled]):active { transform: translateY(4px); box-shadow: 0 1px 0 ${colors.goldDeep}; }
  .cvl-nav-next[disabled], .cvl-nav-back[disabled] { opacity: 0.4; cursor: default; background: ${colors.cardAlt}; color: ${colors.muted}; box-shadow: none; }

  .cvl-cert { border-radius: 28px; padding: 32px 20px; text-align: center; background: ${colors.card}; border: 3px solid ${colors.border}; box-shadow: 0 10px 0 ${colors.borderSoft}; }
  @media (min-width: 640px) { .cvl-cert { padding: 40px; } }
  .cvl-cert-badge {
    margin: 0 auto 20px auto; width: 76px; height: 76px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(180deg, #FFC65C 0%, ${colors.gold} 100%);
    box-shadow: 0 6px 0 ${colors.goldDeep};
  }
  .cvl-cert-eyebrow { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${colors.teal}; margin: 0 0 8px 0; }
  .cvl-cert-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; color: ${colors.goldDeep}; font-size: 26px; margin: 0 0 12px 0; }
  .cvl-cert-desc { font-size: 14px; color: ${colors.muted}; margin: 0 0 24px 0; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
  .cvl-cert-score {
    display: inline-flex; align-items: center; gap: 12px; border-radius: 20px; padding: 16px 24px; margin-bottom: 32px;
    background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft};
  }
  .cvl-cert-score-num { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 30px; color: ${colors.goldDeep}; }
  .cvl-cert-score-label { font-size: 12px; color: ${colors.muted}; text-align: left; max-width: 140px; }
  .cvl-cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px; text-align: left; }
  @media (min-width: 480px) { .cvl-cert-grid { grid-template-columns: repeat(4, 1fr); } }
  .cvl-cert-item { border-radius: 14px; padding: 12px; background: ${colors.cardAlt}; border: 2px solid ${colors.borderSoft}; }
  .cvl-cert-item p { font-size: 12px; color: ${colors.ink}; margin: 6px 0 0 0; font-weight: 600; }
  .cvl-reset-btn {
    display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700;
    padding: 12px 22px; border-radius: 999px; background: ${colors.cardAlt}; border: 2px solid ${colors.border}; color: ${colors.ink};
  }
`;

/* ---------------------------- TYPES ---------------------------- */

type FaceAnswer = "true" | "myth";
type DriveAnswer = "critical" | "background";
type OcrCategoryId = "reliable" | "tricky" | "struggles";

interface StageMetaItem {
  key: string;
  title: string;
  icon: LucideIcon;
  tag: string;
}

interface FaceItem {
  id: string;
  text: string;
  answer: FaceAnswer;
  explain: string;
}

interface DriveItem {
  id: string;
  text: string;
  answer: DriveAnswer;
  explain: string;
}

interface HuntItem {
  id: string;
  label: string;
  reveal: string;
}

interface OcrItem {
  id: string;
  label: string;
  answer: OcrCategoryId;
}

interface OcrCategory {
  id: OcrCategoryId;
  label: string;
  hint: string;
}

type FaceAnswerMap = Record<string, FaceAnswer>;
type DriveAnswerMap = Record<string, DriveAnswer>;
type FoundMap = Record<string, boolean>;
type OcrClassifiedMap = Record<string, OcrCategoryId>;

/* ---------------------------- CONTENT DATA ---------------------------- */

const STAGE_META: StageMetaItem[] = [
  { key: "face", title: "Face Recognition", icon: ScanFace, tag: "Stage 1 - True or Myth" },
  { key: "driving", title: "Self-Driving Cars", icon: Car, tag: "Stage 2 - Critical or Background" },
  { key: "classify", title: "Image Classification", icon: ImageIcon, tag: "Stage 3 - Scavenger Hunt" },
  { key: "ocr", title: "OCR", icon: FileText, tag: "Stage 4 - Sort the Scans" },
];

const FACE_ITEMS: FaceItem[] = [
  { id: "f1", text: "Face recognition measures the geometry of your face — like eye spacing and jaw shape — into a unique numerical map.", answer: "true", explain: "This numeric 'fingerprint' is what actually gets compared, not the raw photo itself." },
  { id: "f2", text: "The system works by comparing your photo pixel-by-pixel against a stored photo.", answer: "myth", explain: "Pixel matching would fail instantly with different lighting or angles. Models compare extracted features instead." },
  { id: "f3", text: "A well-trained system can still recognise you in different lighting, angles, or expressions.", answer: "true", explain: "Modern face models are trained on huge, varied datasets specifically so they generalise across conditions." },
  { id: "f4", text: "Face recognition can read your exact emotions with perfect accuracy.", answer: "myth", explain: "Emotion recognition is a separate, far less reliable task — expressions are ambiguous and culturally variable." },
  { id: "f5", text: "Identical twins can sometimes fool basic face recognition systems.", answer: "true", explain: "Twins share extremely similar facial geometry, which can confuse systems that don't also check depth or texture." },
  { id: "f6", text: "Every face unlock system today is completely impossible to trick with a photo or mask.", answer: "myth", explain: "Only systems using depth sensing or liveness checks reliably resist this — plain 2D camera systems can be more vulnerable." },
];

const DRIVE_ITEMS: DriveItem[] = [
  { id: "d1", text: "A child suddenly chasing a ball into the street.", answer: "critical", explain: "A moving person entering the car's path is exactly the kind of hazard the system must react to instantly." },
  { id: "d2", text: "A plastic bag tumbling across the road in the wind.", answer: "background", explain: "Lightweight, non-solid debris poses no real collision risk — the system should note it but not brake hard." },
  { id: "d3", text: "Brake lights suddenly turning on in the car directly ahead.", answer: "critical", explain: "This directly signals the car in front is slowing — an immediate, high-priority signal to react to." },
  { id: "d4", text: "A tree's shadow sweeping across the lane as the car drives past.", answer: "background", explain: "A shadow has no physical presence — vision systems are trained to recognise and ignore this pattern." },
  { id: "d5", text: "A cyclist signalling a left turn just ahead of the car.", answer: "critical", explain: "A cyclist changing direction is a moving hazard requiring the car to predict and adjust its path." },
  { id: "d6", text: "Sunlight reflections shimmering on a wet road surface.", answer: "background", explain: "Reflections and glare are visual noise the perception system is trained to filter out from real obstacles." },
];

const HUNT_ITEMS: HuntItem[] = [
  { id: "h1", label: "Cat vs Dog", reveal: "The model learns ear shape, snout length, and fur patterns that reliably separate the two from thousands of labelled photos." },
  { id: "h2", label: "Ripe vs Unripe Fruit", reveal: "Colour distribution and surface texture are the strongest signals a classifier learns to rely on." },
  { id: "h3", label: "Handwritten Digit: 3 or 8?", reveal: "Curves and closed loops in the strokes are the pixels the model weighs most heavily." },
  { id: "h4", label: "X-ray: Fracture vs Healthy Bone", reveal: "Sharp discontinuities in bone density patterns are what the model has learned to flag as unusual." },
  { id: "h5", label: "Real Photo vs AI-Generated Image", reveal: "Subtle texture artifacts and inconsistent lighting are often the giveaway patterns a detector picks up on." },
  { id: "h6", label: "Sunny vs Cloudy vs Rainy Sky", reveal: "Cloud coverage, sky brightness, and colour gradients drive the classification between weather types." },
];

const OCR_ITEMS: OcrItem[] = [
  { id: "o1", label: "Clean, printed black text on a white page", answer: "reliable" },
  { id: "o2", label: "A clearly printed invoice scanned at high resolution", answer: "reliable" },
  { id: "o3", label: "Messy, fast handwritten cursive notes", answer: "tricky" },
  { id: "o4", label: "A street sign photographed at a sharp angle in dim light", answer: "tricky" },
  { id: "o5", label: "Text on a crumpled, torn, or heavily stained page", answer: "struggles" },
  { id: "o6", label: "Text overlapping a busy, cluttered background photo", answer: "struggles" },
];

const OCR_CATEGORIES: OcrCategory[] = [
  { id: "reliable", label: "OCR Handles Well", hint: "Clean, high-contrast, well-lit text" },
  { id: "tricky", label: "OCR Struggles But Can Manage", hint: "Needs extra processing or gets partial results" },
  { id: "struggles", label: "OCR Often Fails", hint: "Too degraded, cluttered, or distorted" },
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
      <div className="cvl-progress-track">
        <div className="cvl-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="cvl-stampbar">
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
              className="cvl-stamp-btn"
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
              <span className="cvl-stamp-label" style={{ color: isDone || isCurrent ? colors.ink : colors.muted }}>
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
    <div className="cvl-stage-shell">
      <div className="cvl-stage-top">
        <span className="cvl-stage-tag">{tag}</span>
        {progressLabel && <span className="cvl-stage-progress">{progressLabel}</span>}
      </div>
      <h2 className="cvl-stage-title">{title}</h2>
      {subtitle && <p className="cvl-stage-subtitle">{subtitle}</p>}
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
    <div className="cvl-nav-row">
      <button className="cvl-nav-back" onClick={onBack} disabled={backDisabled}>
        <ChevronLeft size={16} /> Back
      </button>
      <button className="cvl-nav-next" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || "Continue"} <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ------------------------------- MAIN APP ------------------------------- */

export default function ComputerVisionLab() {
  const [current, setCurrent] = useState<number>(0); // 0..3 stages, 4 = certificate
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);

  const [faceAnswers, setFaceAnswers] = useState<FaceAnswerMap>({});
  const [driveAnswers, setDriveAnswers] = useState<DriveAnswerMap>({});
  const [found, setFound] = useState<FoundMap>({});
  const [ocrClassified, setOcrClassified] = useState<OcrClassifiedMap>({});

  const markComplete = (idx: number) => {
    setCompleted((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const goTo = (idx: number) => setCurrent(idx);

  const faceDone = Object.keys(faceAnswers).length === FACE_ITEMS.length;
  const driveDone = Object.keys(driveAnswers).length === DRIVE_ITEMS.length;
  const huntDone = Object.keys(found).length === HUNT_ITEMS.length;
  const ocrDone = Object.keys(ocrClassified).length === OCR_ITEMS.length;

  const scores = useMemo(() => {
    const faceCorrect = FACE_ITEMS.filter((it) => faceAnswers[it.id] === it.answer).length;
    const driveCorrect = DRIVE_ITEMS.filter((it) => driveAnswers[it.id] === it.answer).length;
    const ocrCorrect = OCR_ITEMS.filter((it) => ocrClassified[it.id] === it.answer).length;
    return { faceCorrect, driveCorrect, ocrCorrect };
  }, [faceAnswers, driveAnswers, ocrClassified]);

  const totalScore = scores.faceCorrect + scores.driveCorrect + scores.ocrCorrect;
  const totalPossible = FACE_ITEMS.length + DRIVE_ITEMS.length + OCR_ITEMS.length;

  const resetAll = () => {
    setCurrent(0);
    setCompleted([false, false, false, false]);
    setFaceAnswers({});
    setDriveAnswers({});
    setFound({});
    setOcrClassified({});
  };

  return (
    <div className="cvl-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
        ${STYLES}
      `}</style>

      <div className="cvl-container">
        <div className="cvl-header">
          <div className="cvl-header-icon">
            <Eye size={26} color={colors.gold} />
          </div>
          <h1 className="cvl-h1">Computer Vision Lab</h1>
          <p className="cvl-subtitle">
            Explore how machines see: separating fact from myth in face recognition, spotting real hazards on the road, classifying images, and sorting what OCR can and can't read.
          </p>
        </div>

        {current <= 3 && <StampBar current={current} completed={completed} onJump={goTo} />}

        {/* STAGE 0: Face Recognition */}
        {current === 0 && (
          <StageShell
            tag={STAGE_META[0].tag}
            title="True or Myth: Face Recognition"
            subtitle="Read each claim about how face recognition really works. Decide: is it true, or a common myth?"
            progressLabel={`${Object.keys(faceAnswers).length}/${FACE_ITEMS.length} sorted`}
          >
            <div className="cvl-item-list">
              {FACE_ITEMS.map((item) => {
                const chosen = faceAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="cvl-item-card">
                    <p className="cvl-item-text">{item.text}</p>
                    {!chosen ? (
                      <div className="cvl-choice-row">
                        <button
                          className="cvl-choice-btn cvl-choice-teal"
                          onClick={() => setFaceAnswers((p) => ({ ...p, [item.id]: "true" }))}
                        >
                          True
                        </button>
                        <button
                          className="cvl-choice-btn cvl-choice-coral"
                          onClick={() => setFaceAnswers((p) => ({ ...p, [item.id]: "myth" }))}
                        >
                          Myth
                        </button>
                      </div>
                    ) : (
                      <div className="cvl-feedback">
                        {isCorrect ? (
                          <CheckCircle2 size={16} color={colors.teal} className="cvl-feedback-icon" />
                        ) : (
                          <XCircle size={16} color={colors.coral} className="cvl-feedback-icon" />
                        )}
                        <p className="cvl-feedback-text">
                          {isCorrect ? "Correct -- " : `Actually, this is ${item.answer === "true" ? "true" : "a myth"}. `}
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
              nextDisabled={!faceDone}
              onNext={() => {
                markComplete(0);
                setCurrent(1);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 1: Self-Driving Cars */}
        {current === 1 && (
          <StageShell
            tag={STAGE_META[1].tag}
            title="Critical or Background?"
            subtitle="A self-driving car's vision system sees everything, but must decide what to react to. Sort each detection."
            progressLabel={`${Object.keys(driveAnswers).length}/${DRIVE_ITEMS.length} sorted`}
          >
            <div className="cvl-item-list">
              {DRIVE_ITEMS.map((item) => {
                const chosen = driveAnswers[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="cvl-item-card">
                    <p className="cvl-item-text">{item.text}</p>
                    {!chosen ? (
                      <div className="cvl-choice-row">
                        <button
                          className="cvl-choice-btn cvl-choice-coral"
                          onClick={() => setDriveAnswers((p) => ({ ...p, [item.id]: "critical" }))}
                        >
                          Critical Hazard
                        </button>
                        <button
                          className="cvl-choice-btn cvl-choice-gold"
                          onClick={() => setDriveAnswers((p) => ({ ...p, [item.id]: "background" }))}
                        >
                          Background Noise
                        </button>
                      </div>
                    ) : (
                      <div className="cvl-feedback">
                        {isCorrect ? (
                          <CheckCircle2 size={16} color={colors.teal} className="cvl-feedback-icon" />
                        ) : (
                          <XCircle size={16} color={colors.coral} className="cvl-feedback-icon" />
                        )}
                        <p className="cvl-feedback-text">
                          {isCorrect ? "Correct -- " : `Actually, this is ${item.answer === "critical" ? "a critical hazard" : "background noise"}. `}
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
              nextDisabled={!driveDone}
              onNext={() => {
                markComplete(1);
                setCurrent(2);
              }}
            />
          </StageShell>
        )}

        {/* STAGE 2: Image Classification */}
        {current === 2 && (
          <StageShell
            tag={STAGE_META[2].tag}
            title="Image Classification: Scavenger Hunt"
            subtitle="Tap each classification pair to reveal the visual features a model actually relies on to tell them apart."
            progressLabel={`${Object.keys(found).length}/${HUNT_ITEMS.length} found`}
          >
            <div className="cvl-hunt-grid">
              {HUNT_ITEMS.map((item) => {
                const isFound = found[item.id];
                return (
                  <button
                    key={item.id}
                    className="cvl-hunt-card"
                    style={{ borderColor: isFound ? colors.teal : colors.borderSoft }}
                    onClick={() => setFound((p) => ({ ...p, [item.id]: true }))}
                  >
                    <div className="cvl-hunt-top">
                      {isFound ? <Sparkles size={15} color={colors.teal} /> : <div className="cvl-hunt-dot" />}
                      <p className="cvl-hunt-label">{item.label}</p>
                    </div>
                    {isFound && <p className="cvl-hunt-reveal">{item.reveal}</p>}
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

        {/* STAGE 3: OCR */}
        {current === 3 && (
          <StageShell
            tag={STAGE_META[3].tag}
            title="Sort the Scans"
            subtitle="OCR doesn't handle every document equally well. Sort each example into how OCR is likely to perform on it."
            progressLabel={`${Object.keys(ocrClassified).length}/${OCR_ITEMS.length} sorted`}
          >
            <div className="cvl-item-list">
              {OCR_ITEMS.map((item) => {
                const chosen = ocrClassified[item.id];
                const isCorrect = chosen === item.answer;
                return (
                  <div key={item.id} className="cvl-item-card">
                    <p className="cvl-item-text">{item.label}</p>
                    {!chosen ? (
                      <div className="cvl-tag-row">
                        {OCR_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            className="cvl-choice-outline"
                            onClick={() => setOcrClassified((p) => ({ ...p, [item.id]: cat.id }))}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="cvl-feedback">
                        {isCorrect ? (
                          <CheckCircle2 size={16} color={colors.teal} className="cvl-feedback-icon" />
                        ) : (
                          <XCircle size={16} color={colors.coral} className="cvl-feedback-icon" />
                        )}
                        <p className="cvl-feedback-text">
                          Correct category: <strong style={{ color: colors.ink }}>
                            {OCR_CATEGORIES.find((c) => c.id === item.answer)?.label}
                          </strong> -- {OCR_CATEGORIES.find((c) => c.id === item.answer)?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavButtons
              onBack={() => setCurrent(2)}
              nextDisabled={!ocrDone}
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
          <div className="cvl-cert">
            <div className="cvl-cert-badge">
              <Award size={36} color={colors.ink} />
            </div>
            <p className="cvl-cert-eyebrow">Certificate of Completion</p>
            <h2 className="cvl-cert-title">You've completed Module 3</h2>
            <p className="cvl-cert-desc">
              You separated fact from myth in face recognition, judged real driving hazards, uncovered how image
              classifiers really see, and sorted what OCR can and can't reliably read.
            </p>

            <div className="cvl-cert-score">
              <span className="cvl-cert-score-num">{totalScore}/{totalPossible}</span>
              <span className="cvl-cert-score-label">correct across the scored stages</span>
            </div>

            <div className="cvl-cert-grid">
              {STAGE_META.map((s) => (
                <div key={s.key} className="cvl-cert-item">
                  <CheckCircle2 size={14} color={colors.teal} />
                  <p>{s.title}</p>
                </div>
              ))}
            </div>

            <button className="cvl-reset-btn" onClick={resetAll}>
              <RotateCcw size={14} /> Restart the Lab
            </button>
          </div>
        )}
      </div>
    </div>
  );
}