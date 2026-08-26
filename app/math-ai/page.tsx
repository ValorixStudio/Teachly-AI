"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { markLabTopicComplete } from "../page";
import {
  Brain,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
  Sparkles,
  Play,
  HelpCircle,
  TrendingUp,
  Info,
  Code2,
  Terminal,
  Award,
  Check,
  ArrowRight,
  Cpu,
  BookOpen,
  Sun,
  Moon,
  X,
  MousePointerClick,
  Trophy,
  Compass
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";

// ==========================================
// TYPES & DEFINITIONS
// ==========================================

export type MissionId =
  | "vectors"
  | "matrices"
  | "linear_algebra"
  | "eigenvalues"
  | "calculus"
  | "derivatives"
  | "partial_derivatives"
  | "probability"
  | "statistics"
  | "bayes"
  | "numpy"
  | "final_ai";

type Theme = "dark" | "light";

export interface MissionDef {
  id: MissionId;
  number: number;
  icon: string;
  title: string;
  subtitle: string;
  /** Shown in the intro modal the moment this mission unlocks — explains
   * the concept in plain language before the learner touches any controls. */
  intro: string;
  xp: number;
  hints: string[];
  aiConnection: string;
}

const MISSIONS: MissionDef[] = [
  {
    id: "vectors",
    number: 1,
    icon: "📐",
    title: "Vectors",
    subtitle: "Control the AI coordinate world",
    intro:
      "A vector is just an ordered list of numbers that represents a direction and a size — think of it as an arrow on a grid. In this mission you'll control two vectors, watch their sum update live, and learn to calculate a vector's magnitude (the length of that arrow).",
    xp: 50,
    hints: [
      "Think about the relationship between vector components and total distance.",
      "Calculate the magnitude using |A| = √(x² + y²).",
      "Try setting X = 3 and Y = 4 or X = 4 and Y = 3 so that 3² + 4² = 25."
    ],
    aiConnection: "Vectors represent features, inputs, embeddings, and weight vectors in neural networks."
  },
  {
    id: "matrices",
    number: 2,
    icon: "🔢",
    title: "Matrices",
    subtitle: "Build a transformation machine",
    intro:
      "A matrix is a grid of numbers that transforms any vector it's multiplied against — rotating, scaling, shearing, or reflecting it. You'll edit a 2x2 matrix directly and watch a fixed input vector bend into a new output vector in real time.",
    xp: 60,
    hints: [
      "Look at how basis vectors [1,0] and [0,1] transform.",
      "A 90° counter-clockwise rotation matrix turns [1,0] into [0,1] and [0,1] into [-1,0].",
      "Set the top row to [0, -1] and the bottom row to [1, 0]."
    ],
    aiConnection: "Matrices scale, rotate, and project high-dimensional data in deep learning layers."
  },
  {
    id: "linear_algebra",
    number: 3,
    icon: "🧮",
    title: "Linear Algebra",
    subtitle: "Make matrices transform data",
    intro:
      "This mission shows the mechanics behind matrix-vector multiplication — the single most common operation inside every neural network layer. You'll edit a matrix and a vector and watch the exact row-by-row arithmetic that produces the result.",
    xp: 70,
    hints: [
      "Multiply row 1 by vector x, then row 2 by vector x.",
      "Row 1: (2*4) + (1*2) = 10.",
      "Row 2: (1*4) + (3*2) = 10. Make sure vector x is set to [4, 2]."
    ],
    aiConnection: "Matrix-vector multiplication is the fundamental operation behind feedforward neural network layers."
  },
  {
    id: "eigenvalues",
    number: 4,
    icon: "🌀",
    title: "Eigenvalues & Eigenvectors",
    subtitle: "Find the special directions",
    intro:
      "Most vectors get rotated when multiplied by a matrix — but a special few, called eigenvectors, only get stretched or shrunk, never rotated. You'll test different vectors against a fixed matrix to find which ones keep their original direction, and see the eigenvalue (stretch factor) for each.",
    xp: 80,
    hints: [
      "For a diagonal matrix like [[3,0],[0,2]], axes remain on their line.",
      "Vectors along the X or Y axis do not rotate, only stretch.",
      "Select vector [1, 0] or [0, 1] which matches an eigenvector of the matrix."
    ],
    aiConnection: "Eigenvalues reveal principal component axes used in PCA dimensionality reduction and data compression."
  },
  {
    id: "calculus",
    number: 5,
    icon: "📈",
    title: "Calculus Basics",
    subtitle: "Explore mathematical functions",
    intro:
      "Calculus starts with the humble function: every input maps to exactly one output. You'll pick a function, slide an input value along the x-axis, and watch the corresponding output plotted live on a graph — the foundation everything else in this lab builds on.",
    xp: 60,
    hints: [
      "Use the input controls to set the point along the X-axis.",
      "Move the slider or drag x until it equals 2.0.",
      "Notice how f(2) = 2² = 4."
    ],
    aiConnection: "Activation functions (ReLU, Sigmoid, GELU) map neural activations smoothly or piecewise."
  },
  {
    id: "derivatives",
    number: 6,
    icon: "📉",
    title: "Derivatives",
    subtitle: "Discover how AI learns",
    intro:
      "The derivative tells you the instantaneous slope of a function at any point — and that slope is exactly what tells an AI model which direction to adjust its weights. You'll explore the slope at a point, then run real gradient descent steps to minimize a simple loss curve.",
    xp: 100,
    hints: [
      "The derivative f'(x) gives the instantaneous slope of f(x) at point x.",
      "For f(x) = x², f'(x) = 2x. At x = 2, slope is 4.",
      "Adjust weight to decrease loss, or set weight close to the minimum loss (w = 0)."
    ],
    aiConnection: "Derivatives specify the instantaneous rate of change needed for optimization via Gradient Descent."
  },
  {
    id: "partial_derivatives",
    number: 7,
    icon: "⛰️",
    title: "Partial Derivatives",
    subtitle: "Navigate a multi-variable loss surface",
    intro:
      "Real neural networks have millions of weights, not just one, so we need partial derivatives — the slope with respect to a single variable while holding all the others fixed. You'll navigate a 2D loss surface by adjusting two weights at once, following the gradient toward the minimum.",
    xp: 100,
    hints: [
      "Loss function L(w1, w2) = w1² + w2² reaches minimum at (0,0).",
      "Partial derivative ∂L/∂w1 measures sensitivity to w1 alone.",
      "Move both w1 and w2 within 0.2 of the origin (0, 0)."
    ],
    aiConnection: "Neural nets have millions of weights; partial derivatives give gradient directions for each weight."
  },
  {
    id: "probability",
    number: 8,
    icon: "🎲",
    title: "Probability",
    subtitle: "Teach AI to handle uncertainty",
    intro:
      "Probability quantifies uncertainty, and the Law of Large Numbers says your observed (empirical) results converge toward the true probability the more trials you run. You'll flip a simulated coin thousands of times and watch the empirical ratio settle near the theoretical 50%.",
    xp: 80,
    hints: [
      "Law of Large Numbers state that empirical frequency approaches theoretical probability with more trials.",
      "Click the 1000 or 10000 trial simulation button.",
      "Check that the empirical ratio gets within 3% of 0.50."
    ],
    aiConnection: "Probabilities quantify confidence scores, classification logits, and generative AI sampling."
  },
  {
    id: "statistics",
    number: 9,
    icon: "📊",
    title: "Statistics",
    subtitle: "Understand your dataset",
    intro:
      "Statistics like mean and standard deviation summarize how spread out a dataset really is — critical for techniques like batch normalization and feature scaling in deep learning. You'll compare two datasets and identify which one has far greater variation.",
    xp: 90,
    hints: [
      "Standard deviation measures data spread relative to the mean.",
      "Compare Dataset A (tight spread) and Dataset B (wide spread).",
      "Dataset B ranges from 40 to 120, having far greater variation."
    ],
    aiConnection: "Batch normalization and feature scaling rely on mean and variance to stabilize training."
  },
  {
    id: "bayes",
    number: 10,
    icon: "🧠",
    title: "Bayes Theorem",
    subtitle: "Build a simple Bayesian classifier",
    intro:
      "Bayes' Theorem lets you update a prior belief using new evidence — exactly the logic behind a spam classifier deciding whether an email is junk. You'll adjust priors and likelihoods with sliders and watch the posterior probability recompute instantly.",
    xp: 100,
    hints: [
      "Bayes Formula: P(Spam|FREE) = [P(FREE|Spam) * P(Spam)] / P(FREE).",
      "P(FREE) = P(FREE|Spam)*P(Spam) + P(FREE|NotSpam)*P(NotSpam).",
      "Adjust the prior P(Spam) slider and test posterior recalculation."
    ],
    aiConnection: "Bayesian reasoning allows models to update prior beliefs dynamically as new data arrives."
  },
  {
    id: "numpy",
    number: 11,
    icon: "🐍",
    title: "NumPy Operations",
    subtitle: "Code the mathematics",
    intro:
      "NumPy is the library that makes all the math you've learned so far fast and practical in real code. You'll write or edit a short NumPy snippet that performs matrix-vector multiplication and run it in a simulated console to see the actual result.",
    xp: 120,
    hints: [
      "Use valid NumPy operations syntax like np.dot(A, x) or A @ x.",
      "Click 'Run' to evaluate code in the simulated environment.",
      "Try computing the matrix-vector dot product or transpose."
    ],
    aiConnection: "NumPy provides vectorised linear algebra pipelines essential for model architecture engineering."
  },
  {
    id: "final_ai",
    number: 12,
    icon: "🤖",
    title: "AI Math Challenge",
    subtitle: "Build the engine behind an AI prediction",
    intro:
      "This final mission combines everything you've learned — vectors, matrices, and gradient descent — into one real training loop. You'll tune a linear model's weight and bias, run optimization steps, and watch the loss curve fall as the model actually learns to fit the data.",
    xp: 200,
    hints: [
      "Linear prediction equation: y_hat = w * x + b.",
      "Run multiple gradient descent iterations to optimize weights.",
      "Lower the loss below 20 by fine-tuning weight and bias."
    ],
    aiConnection: "Combines vectors, matrices, derivatives, and loss optimization into a fully functioning AI training loop."
  }
];

// Total XP possible
const TOTAL_XP = MISSIONS.reduce((acc, m) => acc + m.xp, 0);

const EMPTY_MISSION_RECORD = <T,>(value: T): Record<MissionId, T> => ({
  vectors: value,
  matrices: value,
  linear_algebra: value,
  eigenvalues: value,
  calculus: value,
  derivatives: value,
  partial_derivatives: value,
  probability: value,
  statistics: value,
  bayes: value,
  numpy: value,
  final_ai: value
});

// ==========================================
// MATHEMATICAL / SAFE-PARSING HELPER FUNCTIONS
// ==========================================

/** Approximate equality check — avoids brittle strict float equality. */
function isApproximately(value: number, target: number, tolerance = 0.01): boolean {
  if (!Number.isFinite(value) || !Number.isFinite(target)) return false;
  return Math.abs(value - target) <= tolerance;
}

/** Parses a numeric string but never returns NaN/Infinity — falls back safely. */
function safeParseNumber(raw: string, fallback = 0): number {
  if (raw.trim() === "") return fallback;
  const parsed = parseFloat(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

function calcVectorMag(v: [number, number]): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function calcDotProduct(a: [number, number], b: [number, number]): number {
  return a[0] * b[0] + a[1] * b[1];
}

function matrixVectorMult(m: [[number, number], [number, number]], v: [number, number]): [number, number] {
  return [
    m[0][0] * v[0] + m[0][1] * v[1],
    m[1][0] * v[0] + m[1][1] * v[1]
  ];
}

function calcMean(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calcVariance(arr: number[]): number {
  if (arr.length <= 1) return 0;
  const m = calcMean(arr);
  return arr.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / arr.length;
}

function calcStdDev(arr: number[]): number {
  return Math.sqrt(calcVariance(arr));
}

/**
 * Computes total squared-error loss for a linear model y = w*x + b against a
 * dataset. Used both by the gradient-descent training step AND by the
 * "Current Loss" display so the two never disagree (previously the display
 * used a hardcoded placeholder value that didn't match the real starting
 * loss for the default weight/bias).
 */
function calcLinearLoss(weight: number, bias: number, data: Array<{ x: number; y: number }>): number {
  return data.reduce((acc, pt) => {
    const pred = weight * pt.x + bias;
    const err = pred - pt.y;
    return acc + err * err;
  }, 0);
}

// ==========================================
// REUSABLE NUMERIC INPUT
// A controlled text field that keeps its own "raw" string while the user is
// typing (so "-", ".", "-1." etc. are all valid intermediate states) and only
// commits a safely-parsed number up to the parent on each keystroke, defaulting
// to 0 for calculations without ever producing NaN/Infinity.
// ==========================================

interface NumberFieldProps {
  value: number;
  onCommit: (n: number) => void;
  className?: string;
  ariaLabel: string;
}

function NumberField({ value, onCommit, className, ariaLabel }: NumberFieldProps) {
  const [raw, setRaw] = useState<string>(String(value));

  // Keep the field in sync if the value changes externally (e.g. a preset button)
  useEffect(() => {
    // Only overwrite if the numeric value actually differs from what's parsed,
    // so we don't clobber the user mid-keystroke (e.g. typing "1." -> 1).
    const parsed = safeParseNumber(raw, NaN);
    if (parsed !== value) {
      setRaw(String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      value={raw}
      onChange={(e) => {
        const next = e.target.value;
        // Allow intermediate typing states: empty, "-", ".", "-.", digits, decimals
        if (!/^-?\d*\.?\d*$/.test(next)) return;
        setRaw(next);
        onCommit(safeParseNumber(next, 0));
      }}
      onBlur={() => {
        // Normalize display once the user leaves the field
        setRaw(String(safeParseNumber(raw, 0)));
      }}
      className={className}
    />
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AIMathEnginePage() {
  const router = useRouter();

  // Theme State
  const [theme, setTheme] = useState<Theme>("dark");
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // State: Navigation & XP
  const [currentMission, setCurrentMission] = useState<MissionId>("vectors");
  const [completedMissions, setCompletedMissions] = useState<Record<MissionId, boolean>>(EMPTY_MISSION_RECORD(false));
  const [activeTab, setActiveTab] = useState<"visualization" | "formula" | "ai">("visualization");
  const [hintsUsed, setHintsUsed] = useState<Record<MissionId, number>>(EMPTY_MISSION_RECORD(0));

  // Notifications / Toast — timeout is tracked in a ref so rapid toasts never
  // stack up multiple pending `setToast(null)` calls (which could otherwise
  // clear a newer toast early or fire after unmount).
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // How-to-Use onboarding modal — shown automatically the first time this
  // component mounts in a session, and reopenable at any time via the header
  // help button. No browser storage is used (per artifact constraints), so it
  // reappears once per fresh session, which is the right behavior here.
  const [showHowToUse, setShowHowToUse] = useState<boolean>(true);

  // Mission Intro modal — shows automatically the moment a mission becomes
  // current, whether that's the very first mission on load or a mission
  // that just got unlocked by completing the previous one. Starts pointed
  // at "vectors" so the learner gets an intro right after closing the
  // How-to-Use guide; it's suppressed while that guide is still open so the
  // two modals never stack.
  const [introMissionId, setIntroMissionId] = useState<MissionId | null>("vectors");

  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ msg, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // Clean up any pending timers on unmount to avoid setState-after-unmount
  // warnings and memory leaks.
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  // Calculated XP — derived entirely from completedMissions + hintsUsed,
  // never duplicated into its own piece of state.
  const xp = useMemo(() => {
    return MISSIONS.reduce((acc, m) => {
      if (completedMissions[m.id]) {
        const hintPenalty = (hintsUsed[m.id] || 0) * 10;
        return acc + Math.max(10, m.xp - hintPenalty);
      }
      return acc;
    }, 0);
  }, [completedMissions, hintsUsed]);

  const level = Math.floor(xp / 150) + 1;

  // Unlocked Missions State — driven by a simple index counter rather than
  // re-derived from the completedMissions map every render. This avoids any
  // stale-closure / recomputation edge cases: the moment a mission is
  // completed we explicitly bump the unlock frontier by one, full stop.
  const [highestUnlockedIndex, setHighestUnlockedIndex] = useState<number>(0);

  const unlockedMissions = useMemo(() => {
    const unlocked: Record<MissionId, boolean> = EMPTY_MISSION_RECORD(false);
    MISSIONS.forEach((m, i) => {
      if (i <= highestUnlockedIndex) unlocked[m.id] = true;
    });
    return unlocked;
  }, [highestUnlockedIndex]);

  // Handle Complete Mission
  const completeMission = useCallback(
    (id: MissionId) => {
      setCompletedMissions((prev) => {
        if (prev[id]) return prev; // already completed — never award XP twice
        return { ...prev, [id]: true };
      });

      const idx = MISSIONS.findIndex((m) => m.id === id);
      const next = MISSIONS[idx + 1];

      // Explicitly advance the unlock frontier — guaranteed to unlock the next
      // mission regardless of how completedMissions happens to resolve.
      setHighestUnlockedIndex((prev) => Math.max(prev, idx + 1));

      if (next) {
        showToast(`🎉 Mission Completed! +${MISSIONS[idx].xp} XP · "${next.title}" unlocked!`, "success");
        // Auto-advance so the newly unlocked mission is immediately visible/selected,
        // then pop its intro modal so the learner knows what it's about before
        // touching any controls.
        if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = setTimeout(() => {
          setCurrentMission(next.id);
          setIntroMissionId(next.id);
        }, 600);
      } else {
        showToast(`🎉 Final Mission Completed! +${MISSIONS[idx].xp} XP`, "success");
      }
    },
    [showToast]
  );

  // ==========================================
  // PLAYGROUND STATES FOR MISSIONS
  // ==========================================

  // M1: Vectors
  const [vecA, setVecA] = useState<[number, number]>([3, 2]);
  const [vecB, setVecB] = useState<[number, number]>([1, 4]);

  // M2: Matrices
  const [matrixM2, setMatrixM2] = useState<[[number, number], [number, number]]>([
    [2, 0],
    [0, 2]
  ]);

  // M3: Linear Algebra
  const [matrixM3, setMatrixM3] = useState<[[number, number], [number, number]]>([
    [2, 1],
    [1, 3]
  ]);
  const [vecM3, setVecM3] = useState<[number, number]>([4, 2]);

  // M4: Eigenvalues
  const [selectedEigenVec, setSelectedEigenVec] = useState<[number, number]>([1, 0]);

  // M5: Calculus Basics
  const [selectedFunction, setSelectedFunction] = useState<"x2" | "x3" | "linear" | "sin">("x2");
  const [selectedX, setSelectedX] = useState<number>(1.5);

  // M6: Derivatives & Gradient Descent
  const [derivX, setDerivX] = useState<number>(2.0);
  const [gdWeight, setGdWeight] = useState<number>(4.0);
  const [gdLearningRate, setGdLearningRate] = useState<number>(0.1);

  // M7: Partial Derivatives
  const [w1, setW1] = useState<number>(3.0);
  const [w2, setW2] = useState<number>(2.5);

  // M8: Probability
  const [probHeads, setProbHeads] = useState<number>(0);
  const [probTails, setProbTails] = useState<number>(0);

  const runProbSimulation = (count: number) => {
    let h = 0;
    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.5) h++;
    }
    setProbHeads(h);
    setProbTails(count - h);
  };

  // M9: Statistics
  const [selectedDatasetOption, setSelectedDatasetOption] = useState<"A" | "B">("A");
  const datasetA = [78, 79, 80, 81, 82];
  const datasetB = [40, 60, 80, 100, 120];

  // M10: Bayes
  const [pSpam, setPSpam] = useState<number>(0.2);
  const [pFreeSpam, setPFreeSpam] = useState<number>(0.8);
  const [pFreeNotSpam, setPFreeNotSpam] = useState<number>(0.05);

  // M11: NumPy
  const DEFAULT_NUMPY_CODE = `import numpy as np\n\nA = np.array([\n  [2, 1],\n  [1, 3]\n])\nx = np.array([4, 2])\n\n# Calculate matrix-vector product\nresult = A @ x\nprint("Result:", result)`;
  const [numpyCode, setNumpyCode] = useState<string>(DEFAULT_NUMPY_CODE);
  const [numpyOutput, setNumpyOutput] = useState<string>('Click "Run" to evaluate code');
  const [numpyLastResult, setNumpyLastResult] = useState<[number, number] | null>(null);

  // M12: Final AI Challenge
  const [aiWeight, setAiWeight] = useState<number>(2.0);
  const [aiBias, setAiBias] = useState<number>(10.0);
  const [aiLr, setAiLr] = useState<number>(0.01);
  const [aiHistory, setAiHistory] = useState<Array<{ iter: number; weight: number; bias: number; loss: number }>>([]);
  const datasetAI = [
    { x: 1, y: 35 },
    { x: 2, y: 42 },
    { x: 3, y: 51 },
    { x: 4, y: 60 },
    { x: 5, y: 72 },
    { x: 6, y: 81 }
  ];

  const runAiStep = () => {
    let dw = 0;
    let db = 0;
    let totalLoss = 0;
    const n = datasetAI.length;

    datasetAI.forEach((pt) => {
      const pred = aiWeight * pt.x + aiBias;
      const err = pred - pt.y;
      totalLoss += err * err;
      dw += (2 / n) * err * pt.x;
      db += (2 / n) * err;
    });

    const newW = aiWeight - aiLr * dw;
    const newB = aiBias - aiLr * db;

    // Guard against runaway/NaN values from an overly large learning rate.
    const safeW = Number.isFinite(newW) ? Number(newW.toFixed(2)) : aiWeight;
    const safeB = Number.isFinite(newB) ? Number(newB.toFixed(2)) : aiBias;

    setAiWeight(safeW);
    setAiBias(safeB);

    setAiHistory((prev) => [
      ...prev,
      {
        iter: prev.length + 1,
        weight: safeW,
        bias: safeB,
        loss: Number.isFinite(totalLoss) ? Math.round(totalLoss) : prev[prev.length - 1]?.loss ?? 0
      }
    ]);
  };

  // ==========================================
  // RESET LAB — restores every mission's playground state, not just
  // progress/XP, so "Reset Lab" genuinely returns the app to a fresh start.
  // ==========================================
  const resetLab = () => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);

    setCompletedMissions(EMPTY_MISSION_RECORD(false));
    setHintsUsed(EMPTY_MISSION_RECORD(0));
    setCurrentMission("vectors");
    setHighestUnlockedIndex(0);
    setShowCertificate(false);
    setActiveTab("visualization");
    setIntroMissionId("vectors");

    // Reset every mission's playground values back to their defaults.
    setVecA([3, 2]);
    setVecB([1, 4]);
    setMatrixM2([
      [2, 0],
      [0, 2]
    ]);
    setMatrixM3([
      [2, 1],
      [1, 3]
    ]);
    setVecM3([4, 2]);
    setSelectedEigenVec([1, 0]);
    setSelectedFunction("x2");
    setSelectedX(1.5);
    setDerivX(2.0);
    setGdWeight(4.0);
    setGdLearningRate(0.1);
    setW1(3.0);
    setW2(2.5);
    setProbHeads(0);
    setProbTails(0);
    setSelectedDatasetOption("A");
    setPSpam(0.2);
    setPFreeSpam(0.8);
    setPFreeNotSpam(0.05);
    setNumpyCode(DEFAULT_NUMPY_CODE);
    setNumpyOutput('Click "Run" to evaluate code');
    setNumpyLastResult(null);
    setAiWeight(2.0);
    setAiBias(10.0);
    setAiLr(0.01);
    setAiHistory([]);

    showToast("Lab progress reset successfully.", "info");
  };

  // ==========================================
  // NUMPY MINI-INTERPRETER
  // A small, deterministic, *safe* (no eval) parser that recognizes the
  // matrix-vector multiplication pattern the mission teaches, so the output
  // genuinely reflects the numbers the learner typed rather than a canned
  // string. Anything it can't confidently parse gets a friendly message
  // instead of a fabricated "success".
  // ==========================================
  const runNumpyCode = () => {
    try {
      const matrixMatch = numpyCode.match(/\[\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*,\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*\]/);
      const vectorMatch = numpyCode.match(/x\s*=\s*np\.array\(\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*\)/);
      const usesMultiplication = /(@|np\.dot|\.dot\()/.test(numpyCode);

      if (!usesMultiplication) {
        setNumpyOutput(
          "No matrix-vector operation detected.\nTry using `A @ x` or `np.dot(A, x)` to multiply a matrix by a vector."
        );
        setNumpyLastResult(null);
        return;
      }

      if (!matrixMatch || !vectorMatch) {
        setNumpyOutput(
          "Couldn't parse a 2x2 matrix `A` and a 2-element vector `x`.\nMake sure they're defined as np.array([[a,b],[c,d]]) and np.array([e,f])."
        );
        setNumpyLastResult(null);
        return;
      }

      const A: [[number, number], [number, number]] = [
        [parseFloat(matrixMatch[1]), parseFloat(matrixMatch[2])],
        [parseFloat(matrixMatch[3]), parseFloat(matrixMatch[4])]
      ];
      const x: [number, number] = [parseFloat(vectorMatch[1]), parseFloat(vectorMatch[2])];
      const result = matrixVectorMult(A, x);

      setNumpyOutput(`Result: [${result[0]} ${result[1]}]\nShape: (2,)\nData type: int64`);
      setNumpyLastResult(result);
    } catch (err) {
      setNumpyOutput("Error: could not evaluate this code. Check your syntax and try again.");
      setNumpyLastResult(null);
    }
  };

  // ==========================================
  // VALIDATION & CHALLENGES LOGIC
  // ==========================================

  const handleValidateChallenge = () => {
    switch (currentMission) {
      case "vectors": {
        const magA = calcVectorMag(vecA);
        if (isApproximately(magA, 5.0, 0.1)) {
          completeMission("vectors");
        } else {
          showToast(`Vector A magnitude is ${magA.toFixed(2)}. Target is 5.0!`, "error");
        }
        break;
      }
      case "matrices": {
        // Target: 90 deg rotation -> [[0, -1], [1, 0]]
        const isRot =
          isApproximately(matrixM2[0][0], 0) &&
          isApproximately(matrixM2[0][1], -1) &&
          isApproximately(matrixM2[1][0], 1) &&
          isApproximately(matrixM2[1][1], 0);
        if (isRot) {
          completeMission("matrices");
        } else {
          showToast("Matrix is not a 90° rotation. Set [[0, -1], [1, 0]].", "error");
        }
        break;
      }
      case "linear_algebra": {
        const res = matrixVectorMult(matrixM3, vecM3);
        if (isApproximately(res[0], 10) && isApproximately(res[1], 10)) {
          completeMission("linear_algebra");
        } else {
          showToast(`Calculated [${res[0]}, ${res[1]}]. Target is [10, 10].`, "error");
        }
        break;
      }
      case "eigenvalues": {
        const isAxisVector =
          (isApproximately(selectedEigenVec[0], 1) && isApproximately(selectedEigenVec[1], 0)) ||
          (isApproximately(selectedEigenVec[0], 0) && isApproximately(selectedEigenVec[1], 1));
        if (isAxisVector) {
          completeMission("eigenvalues");
        } else {
          showToast("Selected vector is not an eigenvector of this diagonal matrix.", "error");
        }
        break;
      }
      case "calculus": {
        if (isApproximately(selectedX, 2.0, 0.1)) {
          completeMission("calculus");
        } else {
          showToast(`Selected X is ${selectedX.toFixed(1)}. Move slider to X = 2.0`, "error");
        }
        break;
      }
      case "derivatives": {
        if (isApproximately(gdWeight, 0, 0.5)) {
          completeMission("derivatives");
        } else {
          showToast(`Weight is ${gdWeight.toFixed(2)}. Adjust weight closer to 0 for minimum loss!`, "error");
        }
        break;
      }
      case "partial_derivatives": {
        const dist = Math.sqrt(w1 * w1 + w2 * w2);
        if (dist < 0.3) {
          completeMission("partial_derivatives");
        } else {
          showToast(`Distance from minimum is ${dist.toFixed(2)}. Move w1 and w2 closer to (0,0).`, "error");
        }
        break;
      }
      case "probability": {
        const total = probHeads + probTails;
        if (total >= 1000) {
          completeMission("probability");
        } else {
          showToast("Run at least 1,000 simulations!", "error");
        }
        break;
      }
      case "statistics": {
        if (selectedDatasetOption === "B") {
          completeMission("statistics");
        } else {
          showToast("Select Dataset B which has greater variation.", "error");
        }
        break;
      }
      case "bayes": {
        completeMission("bayes");
        break;
      }
      case "numpy": {
        // Validate against the actual parsed result rather than a loose
        // substring check, so unrelated output can never accidentally pass.
        if (numpyLastResult && isApproximately(numpyLastResult[0], 10) && isApproximately(numpyLastResult[1], 10)) {
          completeMission("numpy");
        } else {
          showToast("Run a matrix-vector product resulting in [10, 10]!", "error");
        }
        break;
      }
      case "final_ai": {
        const lastLoss = aiHistory.length > 0 ? aiHistory[aiHistory.length - 1].loss : 999;
        if (lastLoss < 50) {
          completeMission("final_ai");
        } else {
          showToast(`Current loss is ${lastLoss}. Train model until loss drops below 50!`, "error");
        }
        break;
      }
    }
  };

  const activeMissionDef = MISSIONS.find((m) => m.id === currentMission)!;
  const isCurrentMissionComplete = completedMissions[currentMission];
  const introMissionDef = introMissionId ? MISSIONS.find((m) => m.id === introMissionId) ?? null : null;

  // Use hint — locked once the mission is completed so viewing a hint for
  // review never retroactively reduces XP already earned.
  const handleUseHint = () => {
    if (isCurrentMissionComplete) return;
    const currentHints = hintsUsed[currentMission] || 0;
    if (currentHints < activeMissionDef.hints.length) {
      setHintsUsed((prev) => ({
        ...prev,
        [currentMission]: currentHints + 1
      }));
      showToast(`Hint unlocked (-10 XP penalty on completion)`, "info");
    }
  };

  // Check if all missions complete
  const allCompleted = useMemo(() => {
    return Object.values(completedMissions).every(Boolean);
  }, [completedMissions]);

  // Show certificate automatically the first time everything is completed
  useEffect(() => {
    if (allCompleted) {
      setShowCertificate(true);
    }
  }, [allCompleted]);


  const handleContinueToCurriculum = () => {
    markLabTopicComplete("math-ai");
    setShowCertificate(false);
    router.push("/");
  };

  // ==========================================
  // RENDER HELPERS FOR MISSIONS
  // ==========================================

  const renderMissionContent = () => {
    switch (currentMission) {
      case "vectors": {
        const magA = calcVectorMag(vecA);
        const magB = calcVectorMag(vecB);
        const dotAB = calcDotProduct(vecA, vecB);
        const sumAB: [number, number] = [vecA[0] + vecB[0], vecA[1] + vecB[1]];

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <SlidersIcon className="w-5 h-5" /> Vector Controls
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>
                        Vector A (X: {vecA[0]}, Y: {vecA[1]})
                      </span>
                      <span className="text-emerald-400 font-mono">|A| = {magA.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400" htmlFor="vecA-x">X Component</label>
                        <input
                          id="vecA-x"
                          type="range"
                          min="-5"
                          max="5"
                          value={vecA[0]}
                          aria-label="Vector A X component"
                          onChange={(e) => setVecA([parseInt(e.target.value, 10), vecA[1]])}
                          className="w-full accent-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400" htmlFor="vecA-y">Y Component</label>
                        <input
                          id="vecA-y"
                          type="range"
                          min="-5"
                          max="5"
                          value={vecA[1]}
                          aria-label="Vector A Y component"
                          onChange={(e) => setVecA([vecA[0], parseInt(e.target.value, 10)])}
                          className="w-full accent-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>
                        Vector B (X: {vecB[0]}, Y: {vecB[1]})
                      </span>
                      <span className="text-cyan-400 font-mono">|B| = {magB.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400" htmlFor="vecB-x">X Component</label>
                        <input
                          id="vecB-x"
                          type="range"
                          min="-5"
                          max="5"
                          value={vecB[0]}
                          aria-label="Vector B X component"
                          onChange={(e) => setVecB([parseInt(e.target.value, 10), vecB[1]])}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400" htmlFor="vecB-y">Y Component</label>
                        <input
                          id="vecB-y"
                          type="range"
                          min="-5"
                          max="5"
                          value={vecB[1]}
                          aria-label="Vector B Y component"
                          onChange={(e) => setVecB([vecB[0], parseInt(e.target.value, 10)])}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Dot Product (A · B):</span>
                    <span className="text-amber-400">{dotAB}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Vector Sum (A + B):</span>
                    <span className="text-purple-400">
                      [{sumAB[0]}, {sumAB[1]}]
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Grid */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
                <svg className="w-full h-72" viewBox="-10 -10 20 20" role="img" aria-label="Vector visualization on a coordinate grid">
                  {/* Grid lines */}
                  {Array.from({ length: 21 }, (_, i) => i - 10).map((tick) => (
                    <React.Fragment key={tick}>
                      <line x1={tick} y1="-10" x2={tick} y2="10" stroke="#1e293b" strokeWidth="0.05" />
                      <line x1="-10" y1={tick} x2="10" y2={tick} stroke="#1e293b" strokeWidth="0.05" />
                    </React.Fragment>
                  ))}
                  {/* Axes */}
                  <line x1="-10" y1="0" x2="10" y2="0" stroke="#475569" strokeWidth="0.1" />
                  <line x1="0" y1="-10" x2="0" y2="10" stroke="#475569" strokeWidth="0.1" />

                  {/* Vector A (Green) */}
                  <line x1="0" y1="0" x2={vecA[0]} y2={-vecA[1]} stroke="#10b981" strokeWidth="0.3" markerEnd="url(#arrow-green)" />
                  {/* Vector B (Cyan) */}
                  <line x1="0" y1="0" x2={vecB[0]} y2={-vecB[1]} stroke="#06b6d4" strokeWidth="0.3" markerEnd="url(#arrow-cyan)" />
                  {/* Vector Sum A+B (Purple) */}
                  <line
                    x1="0"
                    y1="0"
                    x2={sumAB[0]}
                    y2={-sumAB[1]}
                    stroke="#a855f7"
                    strokeWidth="0.2"
                    strokeDasharray="0.3 0.3"
                  />

                  {/* Arrow markers */}
                  <defs>
                    <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                    </marker>
                    <marker id="arrow-cyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                    </marker>
                  </defs>
                </svg>
                <div className="absolute bottom-3 left-3 text-xs bg-slate-900/90 p-2 rounded border border-slate-800 flex gap-4">
                  <span className="text-emerald-400">■ Vector A</span>
                  <span className="text-cyan-400">■ Vector B</span>
                  <span className="text-purple-400">-- Vector A+B</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "matrices": {
        const originalPoint: [number, number] = [1, 2];
        const transformedPoint = matrixVectorMult(matrixM2, originalPoint);

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Matrix Inputs & Presets */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Transformation Matrix</h3>

                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-center">
                  <NumberField
                    ariaLabel="Matrix row 1 column 1"
                    value={matrixM2[0][0]}
                    onCommit={(n) => setMatrixM2([[n, matrixM2[0][1]], [matrixM2[1][0], matrixM2[1][1]]])}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                  />
                  <NumberField
                    ariaLabel="Matrix row 1 column 2"
                    value={matrixM2[0][1]}
                    onCommit={(n) => setMatrixM2([[matrixM2[0][0], n], [matrixM2[1][0], matrixM2[1][1]]])}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                  />
                  <NumberField
                    ariaLabel="Matrix row 2 column 1"
                    value={matrixM2[1][0]}
                    onCommit={(n) => setMatrixM2([[matrixM2[0][0], matrixM2[0][1]], [n, matrixM2[1][1]]])}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                  />
                  <NumberField
                    ariaLabel="Matrix row 2 column 2"
                    value={matrixM2[1][1]}
                    onCommit={(n) => setMatrixM2([[matrixM2[0][0], matrixM2[0][1]], [matrixM2[1][0], n]])}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Presets:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() =>
                        setMatrixM2([
                          [2, 0],
                          [0, 2]
                        ])
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-slate-300 transition-all"
                    >
                      Scale x2
                    </button>
                    <button
                      onClick={() =>
                        setMatrixM2([
                          [0, -1],
                          [1, 0]
                        ])
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-emerald-400 border border-emerald-500/30 transition-all"
                    >
                      Rotate 90°
                    </button>
                    <button
                      onClick={() =>
                        setMatrixM2([
                          [1, 1],
                          [0, 1]
                        ])
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-slate-300 transition-all"
                    >
                      Shear X
                    </button>
                    <button
                      onClick={() =>
                        setMatrixM2([
                          [1, 0],
                          [0, -1]
                        ])
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-slate-300 transition-all"
                    >
                      Reflect Y
                    </button>
                  </div>
                </div>
              </div>

              {/* Transformation Visualizer */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[320px] relative">
                <svg className="w-full h-72" viewBox="-10 -10 20 20" role="img" aria-label="Matrix transformation visualization">
                  {/* Grid */}
                  {Array.from({ length: 21 }, (_, i) => i - 10).map((tick) => (
                    <React.Fragment key={tick}>
                      <line x1={tick} y1="-10" x2={tick} y2="10" stroke="#1e293b" strokeWidth="0.05" />
                      <line x1="-10" y1={tick} x2="10" y2={tick} stroke="#1e293b" strokeWidth="0.05" />
                    </React.Fragment>
                  ))}
                  <line x1="-10" y1="0" x2="10" y2="0" stroke="#475569" strokeWidth="0.1" />
                  <line x1="0" y1="-10" x2="0" y2="10" stroke="#475569" strokeWidth="0.1" />

                  {/* Vector before (Slate) */}
                  <line x1="0" y1="0" x2={originalPoint[0]} y2={-originalPoint[1]} stroke="#64748b" strokeWidth="0.2" strokeDasharray="0.3 0.3" />
                  {/* Vector after (Amber) */}
                  <line x1="0" y1="0" x2={transformedPoint[0]} y2={-transformedPoint[1]} stroke="#f59e0b" strokeWidth="0.3" markerEnd="url(#arrow-amber)" />

                  <defs>
                    <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                    </marker>
                  </defs>
                </svg>
                <div className="absolute bottom-3 left-3 text-xs bg-slate-900/90 p-2 rounded border border-slate-800 flex gap-4 font-mono">
                  <span className="text-slate-400">Input v: [{originalPoint.join(", ")}]</span>
                  <span className="text-amber-400">
                    Output Matrix * v: [{transformedPoint[0]}, {transformedPoint[1]}]
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "linear_algebra": {
        const res = matrixVectorMult(matrixM3, vecM3);

        return (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-emerald-400">Matrix-Vector Multiplication Engine</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Matrix A */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Matrix A (2x2)</span>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                    <NumberField
                      ariaLabel="Matrix A row 1 column 1"
                      value={matrixM3[0][0]}
                      onCommit={(n) => setMatrixM3([[n, matrixM3[0][1]], [matrixM3[1][0], matrixM3[1][1]]])}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-slate-200"
                    />
                    <NumberField
                      ariaLabel="Matrix A row 1 column 2"
                      value={matrixM3[0][1]}
                      onCommit={(n) => setMatrixM3([[matrixM3[0][0], n], [matrixM3[1][0], matrixM3[1][1]]])}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-slate-200"
                    />
                    <NumberField
                      ariaLabel="Matrix A row 2 column 1"
                      value={matrixM3[1][0]}
                      onCommit={(n) => setMatrixM3([[matrixM3[0][0], matrixM3[0][1]], [n, matrixM3[1][1]]])}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-slate-200"
                    />
                    <NumberField
                      ariaLabel="Matrix A row 2 column 2"
                      value={matrixM3[1][1]}
                      onCommit={(n) => setMatrixM3([[matrixM3[0][0], matrixM3[0][1]], [matrixM3[1][0], n]])}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-slate-200"
                    />
                  </div>
                </div>

                {/* Vector x */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Vector x (2x1)</span>
                  <div className="grid grid-cols-1 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                    <NumberField
                      ariaLabel="Vector x first component"
                      value={vecM3[0]}
                      onCommit={(n) => setVecM3([n, vecM3[1]])}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                    />
                    <NumberField
                      ariaLabel="Vector x second component"
                      value={vecM3[1]}
                      onCommit={(n) => setVecM3([vecM3[0], n])}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                    />
                  </div>
                </div>

                {/* Output Result */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Result A × x</span>
                  <div className="bg-slate-950 p-4 rounded-lg border border-emerald-500/30 text-center font-mono">
                    <div className="text-xl text-emerald-400 font-bold">[{res[0]}]</div>
                    <div className="text-xl text-emerald-400 font-bold">[{res[1]}]</div>
                  </div>
                </div>
              </div>

              {/* Multiplication Breakdown */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-slate-400">Row 1 Calculation: ({matrixM3[0][0]} × {vecM3[0]}) + ({matrixM3[0][1]} × {vecM3[1]}) = {res[0]}</div>
                <div className="text-slate-400">Row 2 Calculation: ({matrixM3[1][0]} × {vecM3[0]}) + ({matrixM3[1][1]} × {vecM3[1]}) = {res[1]}</div>
              </div>
            </div>
          </div>
        );
      }

      case "eigenvalues": {
        const matrixEigen: [[number, number], [number, number]] = [
          [3, 0],
          [0, 2]
        ];
        const transformedEigen = matrixVectorMult(matrixEigen, selectedEigenVec);

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Select Test Vector</h3>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedEigenVec([1, 0])}
                    className={`w-full p-3 rounded-lg border text-left font-mono text-sm transition-all ${
                      selectedEigenVec[0] === 1 && selectedEigenVec[1] === 0
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Vector [1, 0] (X Axis)
                  </button>

                  <button
                    onClick={() => setSelectedEigenVec([0, 1])}
                    className={`w-full p-3 rounded-lg border text-left font-mono text-sm transition-all ${
                      selectedEigenVec[0] === 0 && selectedEigenVec[1] === 1
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Vector [0, 1] (Y Axis)
                  </button>

                  <button
                    onClick={() => setSelectedEigenVec([1, 1])}
                    className={`w-full p-3 rounded-lg border text-left font-mono text-sm transition-all ${
                      selectedEigenVec[0] === 1 && selectedEigenVec[1] === 1
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Vector [1, 1] (Diagonal)
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-slate-400">Matrix = [[3, 0], [0, 2]]</div>
                  <div className="text-slate-300">Eigenvalue λ1 = 3 (for [1,0])</div>
                  <div className="text-slate-300">Eigenvalue λ2 = 2 (for [0,1])</div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[320px] relative">
                <svg className="w-full h-72" viewBox="-6 -6 12 12" role="img" aria-label="Eigenvector transformation visualization">
                  <line x1="-6" y1="0" x2="6" y2="0" stroke="#334155" strokeWidth="0.05" />
                  <line x1="0" y1="-6" x2="0" y2="6" stroke="#334155" strokeWidth="0.05" />

                  {/* Input Vector */}
                  <line x1="0" y1="0" x2={selectedEigenVec[0]} y2={-selectedEigenVec[1]} stroke="#38bdf8" strokeWidth="0.2" />
                  {/* Transformed Vector */}
                  <line x1="0" y1="0" x2={transformedEigen[0]} y2={-transformedEigen[1]} stroke="#10b981" strokeWidth="0.25" markerEnd="url(#arrow-e)" />

                  <defs>
                    <marker id="arrow-e" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                    </marker>
                  </defs>
                </svg>

                <div className="absolute bottom-3 left-3 text-xs bg-slate-900/90 p-2 rounded border border-slate-800 font-mono">
                  Input: [{selectedEigenVec.join(", ")}] → Output: [{transformedEigen.join(", ")}]
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "calculus": {
        const funcVal =
          selectedFunction === "x2"
            ? selectedX * selectedX
            : selectedFunction === "x3"
            ? Math.pow(selectedX, 3)
            : selectedFunction === "linear"
            ? 2 * selectedX + 1
            : Math.sin(selectedX);

        const dataPlot = Array.from({ length: 41 }, (_, i) => {
          const x = (i - 20) / 5;
          let y = 0;
          if (selectedFunction === "x2") y = x * x;
          else if (selectedFunction === "x3") y = Math.pow(x, 3);
          else if (selectedFunction === "linear") y = 2 * x + 1;
          else y = Math.sin(x);
          return { x: Number(x.toFixed(1)), y: Number(y.toFixed(2)) };
        });

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Function Explorer</h3>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400" htmlFor="fn-select">Select Function f(x)</label>
                  <select
                    id="fn-select"
                    value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm"
                  >
                    <option value="x2">f(x) = x²</option>
                    <option value="x3">f(x) = x³</option>
                    <option value="linear">f(x) = 2x + 1</option>
                    <option value="sin">f(x) = sin(x)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Input x:</span>
                    <span className="text-emerald-400 font-mono">{selectedX.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.1"
                    value={selectedX}
                    aria-label="Input x value"
                    onChange={(e) => setSelectedX(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono space-y-1">
                  <div className="text-slate-400">Result Output:</div>
                  <div className="text-emerald-400 text-lg font-bold">f({selectedX.toFixed(1)}) = {funcVal.toFixed(2)}</div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[320px]">
                <ResponsiveContainer width="100%" height={280} minWidth={200}>
                  <LineChart data={dataPlot}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="x" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <ReferenceLine x={Number(selectedX.toFixed(1))} stroke="#f59e0b" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      case "derivatives": {
        const slope = 2 * derivX;
        const fx = derivX * derivX;

        // Loss curve for gradient descent
        const gdLoss = gdWeight * gdWeight;
        const gdGrad = 2 * gdWeight;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Part A: Derivative Tangent */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">1. Instantaneous Slope (Derivative)</h3>
                <p className="text-xs text-slate-400">Function: f(x) = x², Derivative: f'(x) = 2x</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Position x:</span>
                    <span className="text-emerald-400 font-mono">{derivX.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.1"
                    value={derivX}
                    aria-label="Position x"
                    onChange={(e) => setDerivX(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="text-slate-400 block">Value f(x)</span>
                    <span className="text-slate-200 text-base">{fx.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded border border-emerald-500/30">
                    <span className="text-slate-400 block">Slope f'(x)</span>
                    <span className="text-emerald-400 text-base font-bold">{slope.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Part B: Gradient Descent */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-amber-400">2. Gradient Descent Optimization</h3>
                <p className="text-xs text-slate-400">Formula: weight = weight - learning_rate * gradient</p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Current Weight (w):</span>
                      <span className="text-amber-400 font-mono">{gdWeight.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.1"
                      value={gdWeight}
                      aria-label="Current weight"
                      onChange={(e) => setGdWeight(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Learning Rate (η):</span>
                      <span className="text-cyan-400 font-mono">{gdLearningRate.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.9"
                      step="0.01"
                      value={gdLearningRate}
                      aria-label="Learning rate"
                      onChange={(e) => setGdLearningRate(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newW = gdWeight - gdLearningRate * gdGrad;
                        setGdWeight(Number.isFinite(newW) ? Number(newW.toFixed(2)) : gdWeight);
                      }}
                      className="flex-1 py-2 bg-amber-500/20 hover:bg-amber-500/30 active:scale-[0.98] border border-amber-500/50 rounded text-amber-300 text-xs font-semibold transition-all"
                    >
                      Step Gradient Descent
                    </button>
                    <button
                      onClick={() => setGdWeight(4.0)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block">Loss (w²)</span>
                    <span className="text-rose-400 font-bold">{gdLoss.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block">Gradient (2w)</span>
                    <span className="text-amber-400 font-bold">{gdGrad.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "partial_derivatives": {
        const lossVal = w1 * w1 + w2 * w2;
        const gradW1 = 2 * w1;
        const gradW2 = 2 * w2;
        const distFromMin = Math.sqrt(w1 * w1 + w2 * w2);

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Loss Surface L(w₁, w₂) = w₁² + w₂²</h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Weight w₁:</span>
                      <span className="text-emerald-400 font-mono">{w1.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.1"
                      value={w1}
                      aria-label="Weight w1"
                      onChange={(e) => setW1(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Weight w₂:</span>
                      <span className="text-cyan-400 font-mono">{w2.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.1"
                      value={w2}
                      aria-label="Weight w2"
                      onChange={(e) => setW2(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>∂L / ∂w₁:</span>
                    <span className="text-emerald-400">{gradW1.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>∂L / ∂w₂:</span>
                    <span className="text-cyan-400">{gradW2.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Distance from minimum:</span>
                    <span className="text-amber-400">{distFromMin.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800 pt-2">
                    <span>Total Loss L:</span>
                    <span className="text-rose-400">{lossVal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 2D Loss Surface Contour Map */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[320px] relative">
                <svg className="w-full h-72" viewBox="-5 -5 10 10" role="img" aria-label="Loss surface contour visualization">
                  {/* Concentric Loss Circles */}
                  {[1, 2, 3, 4].map((r) => (
                    <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#1e293b" strokeWidth="0.05" />
                  ))}
                  <line x1="-5" y1="0" x2="5" y2="0" stroke="#334155" strokeWidth="0.05" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#334155" strokeWidth="0.05" />

                  {/* Current Position */}
                  <circle cx={w1} cy={-w2} r="0.2" fill="#ef4444" />
                  {/* Descent Vector arrow toward origin */}
                  <line x1={w1} y1={-w2} x2={w1 - 0.3 * gradW1} y2={-w2 + 0.3 * gradW2} stroke="#10b981" strokeWidth="0.15" />
                </svg>

                <div className="absolute bottom-3 left-3 text-xs bg-slate-900/90 p-2 rounded border border-slate-800 font-mono">
                  Current Coordinates: ({w1.toFixed(1)}, {w2.toFixed(1)}) | Green Line: Gradient Descent Direction
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "probability": {
        const totalTrials = probHeads + probTails;
        const expHeadsProb = totalTrials > 0 ? (probHeads / totalTrials).toFixed(3) : "0.000";

        const barData = [
          { name: "Heads", Empirical: probHeads, Theoretical: totalTrials * 0.5 },
          { name: "Tails", Empirical: probTails, Theoretical: totalTrials * 0.5 }
        ];

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Coin Toss Simulator</h3>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Run Trials:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => runProbSimulation(10)} className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-xs transition-all">
                      10 Trials
                    </button>
                    <button onClick={() => runProbSimulation(100)} className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-xs transition-all">
                      100 Trials
                    </button>
                    <button
                      onClick={() => runProbSimulation(1000)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-all"
                    >
                      1,000 Trials
                    </button>
                    <button
                      onClick={() => runProbSimulation(10000)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-xs font-semibold text-cyan-400 border border-cyan-500/30 transition-all"
                    >
                      10,000 Trials
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                  <div>Total Trials: {totalTrials}</div>
                  <div>Empirical P(Heads): {expHeadsProb}</div>
                  <div>Theoretical P(Heads): 0.500</div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[320px]">
                <ResponsiveContainer width="100%" height={280} minWidth={200}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar dataKey="Empirical" fill="#10b981" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      case "statistics": {
        const activeData = selectedDatasetOption === "A" ? datasetA : datasetB;
        const meanVal = calcMean(activeData);
        const stdVal = calcStdDev(activeData);

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Dataset Selector</h3>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedDatasetOption("A")}
                    className={`w-full p-3 rounded-lg border text-left text-xs font-mono transition-all ${
                      selectedDatasetOption === "A" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    Dataset A: [78, 79, 80, 81, 82]
                  </button>

                  <button
                    onClick={() => setSelectedDatasetOption("B")}
                    className={`w-full p-3 rounded-lg border text-left text-xs font-mono transition-all ${
                      selectedDatasetOption === "B" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    Dataset B: [40, 60, 80, 100, 120]
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                  <div>Mean μ: {meanVal.toFixed(1)}</div>
                  <div>Variance σ²: {calcVariance(activeData).toFixed(2)}</div>
                  <div>Standard Dev σ: {stdVal.toFixed(2)}</div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[320px]">
                <ResponsiveContainer width="100%" height={280} minWidth={200}>
                  <BarChart data={activeData.map((val, idx) => ({ item: `Item ${idx + 1}`, value: val }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="item" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar dataKey="value" fill="#06b6d4" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      case "bayes": {
        const pFree = pFreeSpam * pSpam + pFreeNotSpam * (1 - pSpam);
        const pSpamGivenFree = pFree > 0 ? (pFreeSpam * pSpam) / pFree : 0;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Bayesian Inputs</h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300">
                      <span>Prior P(Spam):</span>
                      <span className="font-mono text-emerald-400">{(pSpam * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.05"
                      value={pSpam}
                      aria-label="Prior probability of spam"
                      onChange={(e) => setPSpam(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300">
                      <span>Likelihood P(FREE | Spam):</span>
                      <span className="font-mono text-cyan-400">{(pFreeSpam * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.99"
                      step="0.05"
                      value={pFreeSpam}
                      aria-label="Likelihood of FREE given spam"
                      onChange={(e) => setPFreeSpam(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300">
                      <span>Likelihood P(FREE | Not Spam):</span>
                      <span className="font-mono text-purple-400">{(pFreeNotSpam * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.5"
                      step="0.01"
                      value={pFreeNotSpam}
                      aria-label="Likelihood of FREE given not spam"
                      onChange={(e) => setPFreeNotSpam(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Posterior Result Card */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center space-y-4">
                <div className="text-slate-400 text-sm">Posterior Probability P(Spam | "FREE")</div>
                <div className="text-5xl font-extrabold text-emerald-400 font-mono">{(pSpamGivenFree * 100).toFixed(1)}%</div>
                <p className="text-xs text-slate-400 max-w-md">
                  Given that an email contains the word "FREE", the probability that it is SPAM updates from {(pSpam * 100).toFixed(0)}% to{" "}
                  {(pSpamGivenFree * 100).toFixed(1)}%.
                </p>
              </div>
            </div>
          </div>
        );
      }

      case "numpy": {
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <Code2 className="w-5 h-5" /> NumPy Code Playground
                </h3>

                <textarea
                  value={numpyCode}
                  aria-label="NumPy code editor"
                  onChange={(e) => setNumpyCode(e.target.value)}
                  className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />

                <div className="flex gap-2">
                  <button
                    onClick={runNumpyCode}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded hover:bg-emerald-400 active:scale-95 text-xs flex items-center gap-1 transition-all"
                  >
                    <Play className="w-4 h-4" /> Run Simulator
                  </button>
                  <button
                    onClick={() => {
                      setNumpyCode(DEFAULT_NUMPY_CODE);
                      setNumpyOutput('Click "Run" to evaluate code');
                      setNumpyLastResult(null);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs transition-all"
                  >
                    Reset Code
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Terminal className="w-4 h-4" /> Console Output
                </div>
                <pre className="p-4 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-emerald-400 min-h-[160px] whitespace-pre-wrap">
                  {numpyOutput}
                </pre>
              </div>
            </div>
          </div>
        );
      }

      case "final_ai": {
        // Derived live from current weight/bias whenever no training step has
        // run yet, instead of a stale hardcoded number, so the displayed loss
        // always matches what the model would actually compute.
        const currentLoss =
          aiHistory.length > 0
            ? aiHistory[aiHistory.length - 1].loss
            : Math.round(calcLinearLoss(aiWeight, aiBias, datasetAI));

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-amber-400">AI Model Parameters</h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Weight (w):</span>
                      <span className="font-mono text-amber-400">{aiWeight.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={aiWeight}
                      aria-label="Model weight"
                      onChange={(e) => setAiWeight(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Bias (b):</span>
                      <span className="font-mono text-cyan-400">{aiBias.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={aiBias}
                      aria-label="Model bias"
                      onChange={(e) => setAiBias(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Learning Rate (η):</span>
                      <span className="font-mono text-purple-400">{aiLr.toFixed(3)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.001"
                      max="0.05"
                      step="0.001"
                      value={aiLr}
                      aria-label="Learning rate"
                      onChange={(e) => setAiLr(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={runAiStep}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold rounded text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Play className="w-4 h-4" /> 1 Optimization Step
                  </button>
                  <button
                    onClick={() => {
                      setAiWeight(2.0);
                      setAiBias(10.0);
                      setAiHistory([]);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-all"
                  >
                    Reset
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                  <div>Iterations: {aiHistory.length}</div>
                  <div>
                    Current Loss: <span className="text-rose-400 font-bold">{currentLoss}</span>
                  </div>
                </div>
              </div>

              {/* Loss Curve Graph */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[320px]">
                <ResponsiveContainer width="100%" height={280} minWidth={200}>
                  <LineChart data={aiHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="iter" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  // ==========================================
  // MAIN LAYOUT RENDER
  // ==========================================

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950"
          : "min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950"
      }
    >
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-xl flex items-center gap-2 text-sm font-semibold transition-all ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500 text-emerald-300"
              : toast.type === "error"
              ? "bg-rose-950/90 border-rose-500 text-rose-300"
              : "bg-slate-900/90 border-slate-700 text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <header
        className={`border-b backdrop-blur sticky top-0 z-40 px-4 py-3 ${
          theme === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                🧠 AI Math Engine
              </h1>
              <p className={theme === "dark" ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                Mathematics Behind AI Playground
              </p>
            </div>
          </div>

          {/* XP & Level Status */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex-1 md:w-64 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                  Level {level} • XP {xp} / {TOTAL_XP}
                </span>
                <span className="text-emerald-400">{Math.round((xp / TOTAL_XP) * 100)}%</span>
              </div>
              <div
                className={`h-2 w-full rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}
                role="progressbar"
                aria-valuenow={xp}
                aria-valuemin={0}
                aria-valuemax={TOTAL_XP}
                aria-label="Experience progress"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${(xp / TOTAL_XP) * 100}%` }}
                />
              </div>
            </div>

            {/* How to Use */}
            <button
              onClick={() => setShowHowToUse(true)}
              aria-label="How to use this lab"
              className={`p-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700"
                  : "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300"
              }`}
              title="How to Use"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className={`p-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700"
                  : "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300"
              }`}
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={resetLab}
              aria-label="Reset lab progress"
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-800"
              }`}
              title="Reset Lab"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* FINAL COMPLETION MODAL */}
      {allCompleted && (
        <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-4 py-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 text-xs font-semibold">
            <Award className="w-4 h-4" /> 🎉 AI MATH ENGINEER UNLOCKED!
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Congratulations! You've Mastered the Math Behind AI</h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            You have successfully completed all 12 modules from vectors to deep learning loss surfaces and optimization algorithms.
          </p>
          <button
            onClick={handleContinueToCurriculum}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
          >
            Finish &amp; Unlock Next <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR — MISSION TREE */}
        <div
          className={`lg:col-span-3 space-y-2 rounded-xl p-3 h-fit border ${
            theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <h2 className={`text-xs font-bold uppercase tracking-wider px-2 mb-3 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            Missions
          </h2>

          <div className="space-y-1">
            {MISSIONS.map((m) => {
              const isUnlocked = unlockedMissions[m.id];
              const isDone = completedMissions[m.id];
              const isActive = currentMission === m.id;

              return (
                <button
                  key={m.id}
                  disabled={!isUnlocked}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${m.title}${isDone ? " (completed)" : isUnlocked ? " (unlocked)" : " (locked)"}`}
                  onClick={() => setCurrentMission(m.id)}
                  className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${
                    isActive
                      ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300"
                      : isUnlocked
                      ? theme === "dark"
                        ? "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                        : "hover:bg-slate-100 text-slate-700 border border-transparent"
                      : "opacity-40 cursor-not-allowed text-slate-500 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{m.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{m.title}</div>
                      <div className={`text-[10px] truncate ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{m.subtitle}</div>
                    </div>
                  </div>

                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isUnlocked ? (
                    <Unlock className={`w-3.5 h-3.5 shrink-0 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`} />
                  ) : (
                    <Lock className={`w-3.5 h-3.5 shrink-0 ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN PLAYGROUND PANEL */}
        <div className="lg:col-span-9 space-y-6">
          {/* Mission Title Header */}
          <div
            className={`rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
              theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <span>Mission {activeMissionDef.number} of 12</span>
                <span>•</span>
                <span>+{activeMissionDef.xp} XP</span>
              </div>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                <span>{activeMissionDef.icon}</span> {activeMissionDef.title}
              </h2>
              <p className={theme === "dark" ? "text-xs text-slate-400" : "text-xs text-slate-500"}>{activeMissionDef.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIntroMissionId(currentMission)}
                aria-label="Show mission intro"
                title="What is this mission about?"
                className={`p-2 rounded-lg text-xs transition-colors ${
                  theme === "dark"
                    ? "bg-slate-800 hover:bg-slate-700 text-cyan-400"
                    : "bg-slate-100 hover:bg-slate-200 text-cyan-600"
                }`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleUseHint}
                disabled={isCurrentMissionComplete || (hintsUsed[currentMission] || 0) >= activeMissionDef.hints.length}
                title={isCurrentMissionComplete ? "Mission already completed — hints no longer affect XP" : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  theme === "dark"
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Hint ({hintsUsed[currentMission] || 0}/{activeMissionDef.hints.length})
              </button>

              <button
                onClick={handleValidateChallenge}
                disabled={isCurrentMissionComplete}
                className={`px-4 py-2 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg transition-all ${
                  isCurrentMissionComplete
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default shadow-none"
                    : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 shadow-emerald-500/20"
                }`}
              >
                {isCurrentMissionComplete ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Complete Mission
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Hint Box */}
          {(hintsUsed[currentMission] || 0) > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-xs space-y-2">
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Unlocked Hints:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {activeMissionDef.hints.slice(0, hintsUsed[currentMission]).map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tabs */}
          <div className={`flex border-b gap-2 overflow-x-auto ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
            {(["visualization", "formula", "ai"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                className={`px-4 py-2 text-xs font-semibold border-b-2 capitalize transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${
                  activeTab === tab
                    ? "border-emerald-500 text-emerald-400"
                    : theme === "dark"
                    ? "border-transparent text-slate-400 hover:text-slate-200"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab === "visualization" ? "Visual Math Lab" : tab === "formula" ? "Formula & Math" : "AI Connection"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[360px]">
            {activeTab === "visualization" && renderMissionContent()}

            {activeTab === "formula" && (
              <div
                className={`rounded-xl p-6 space-y-4 border ${
                  theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Formula Inspector
                </h3>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm text-emerald-300">
                  {currentMission === "vectors" && "Vector Magnitude: |A| = √(Ax² + Ay²)"}
                  {currentMission === "matrices" && "Matrix Transformation: v' = M × v"}
                  {currentMission === "linear_algebra" && "Linear Combo: y = A · x"}
                  {currentMission === "eigenvalues" && "Eigen Equation: A v = λ v"}
                  {currentMission === "calculus" && "Function Mapping: f(x) = y"}
                  {currentMission === "derivatives" && "Derivative Limit: f'(x) = d/dx [f(x)]"}
                  {currentMission === "partial_derivatives" && "Gradient Vector: ∇L = [∂L/∂w1, ∂L/∂w2]"}
                  {currentMission === "probability" && "Empirical Ratio: P(E) = n(E) / N"}
                  {currentMission === "statistics" && "Standard Deviation: σ = √( Σ(x - μ)² / N )"}
                  {currentMission === "bayes" && "Bayes Theorem: P(A|B) = [ P(B|A) P(A) ] / P(B)"}
                  {currentMission === "numpy" && "Matrix Dot Product: np.dot(A, B) or A @ B"}
                  {currentMission === "final_ai" && "Linear AI Prediction: y = w * x + b"}
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div
                className={`rounded-xl p-6 space-y-4 border ${
                  theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                  <Cpu className="w-5 h-5" /> 💡 Where AI Uses This Concept
                </h3>
                <p className={theme === "dark" ? "text-sm text-slate-300 leading-relaxed" : "text-sm text-slate-600 leading-relaxed"}>
                  {activeMissionDef.aiConnection}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FINAL CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowCertificate(false)}
              aria-label="Close certificate"
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg">
              🏆
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                CERTIFICATE OF COMPLETION
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">AI MATH ENGINEER UNLOCKED</h2>
              <p className="text-xs text-slate-400 mt-2">
                Has successfully mastered all 12 modules of the mathematics behind AI, from vectors to gradient-based optimization.
              </p>
            </div>

            <div className="grid grid-cols-2 text-left gap-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              {MISSIONS.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{m.title}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <button
                onClick={() => setShowCertificate(false)}
                className="bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 border border-slate-700 font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
              >
                Review Playground
              </button>
              <button
                onClick={handleContinueToCurriculum}
                className="bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                Finish &amp; Unlock Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOW TO USE MODAL */}
      {showHowToUse && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-use-title"
        >
          <div className="max-w-lg w-full bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowHowToUse(false)}
              aria-label="Close how-to-use guide"
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Welcome
                </span>
                <h2 id="how-to-use-title" className="text-lg font-bold text-slate-100">
                  How to Use the AI Math Engine
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="flex gap-3">
                <Unlock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-slate-100">Getting started —</span> you begin on Mission 1
                  (Vectors). Missions 2–12 stay locked in the sidebar until you complete the one before them.
                </p>
              </div>

              <div className="flex gap-3">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-slate-100">Track progress —</span> the Level and XP bar in the
                  header sum up every mission's XP as you complete it.
                </p>
              </div>

              <div className="flex gap-3">
                <MousePointerClick className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-100">Work a mission:</p>
                  <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-300">
                    <li>Pick a mission from the sidebar (locked ones show a lock icon).</li>
                    <li><span className="text-slate-100">Visual Math Lab</span> — interact with sliders, matrix cells, buttons, or code; everything updates live.</li>
                    <li><span className="text-slate-100">Formula &amp; Math</span> — see the underlying equation.</li>
                    <li><span className="text-slate-100">AI Connection</span> — see how it's used in real AI/ML systems.</li>
                    <li>Use <span className="text-slate-100">Hint</span> if stuck (each hint costs 10 XP off that mission, but is free once the mission is already completed).</li>
                    <li>Click <span className="text-slate-100">Complete Mission</span> once you've hit the target — this awards XP and unlocks the next mission.</li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-3">
                <RotateCcw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-slate-100">Other controls —</span> the sun/moon icon toggles
                  dark/light mode; the reset icon wipes all progress and every playground value back to defaults.
                </p>
              </div>

              <div className="flex gap-3">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-slate-100">Finishing up —</span> completing all 12 missions
                  automatically shows a certificate. You can keep reviewing missions or finish and move on.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowToUse(false)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              Got it, let's start <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-center text-[10px] text-slate-500">
              You can reopen this guide anytime from the <HelpCircle className="w-3 h-3 inline -mt-0.5" /> icon in the header.
            </p>
          </div>
        </div>
      )}

      {/* MISSION INTRO MODAL — pops the moment a mission becomes current
          (first load, or right after unlocking the next one). Held back
          while the How-to-Use guide is still open so the two never stack. */}
      {!showHowToUse && introMissionDef && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mission-intro-title"
        >
          <div className="max-w-lg w-full bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIntroMissionId(null)}
              aria-label="Close mission intro"
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center text-2xl">
                {introMissionDef.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Mission {introMissionDef.number} of 12 Unlocked
                </span>
                <h2 id="mission-intro-title" className="text-lg font-bold text-slate-100">
                  {introMissionDef.title}
                </h2>
                <p className="text-xs text-slate-400">{introMissionDef.subtitle}</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{introMissionDef.intro}</p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-amber-300 flex gap-2 items-start">
              <Cpu className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold">Where AI uses this:</span> {introMissionDef.aiConnection}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>+{introMissionDef.xp} XP on completion</span>
              <span>{introMissionDef.hints.length} hints available</span>
            </div>

            <button
              onClick={() => setIntroMissionId(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              Start Mission <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon Helper
function SlidersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
    </svg>
  );
}