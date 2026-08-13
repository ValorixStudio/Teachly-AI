"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Brain,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
  Sparkles,
  Play,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Code2,
  Layers,
  Terminal,
  Activity,
  Award,
  Zap,
  Info,
  Check,
  RefreshCw,
  ArrowRight,
  Cpu,
  Variable,
  BookOpen
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

export interface MissionDef {
  id: MissionId;
  number: number;
  icon: string;
  title: string;
  subtitle: string;
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

// ==========================================
// MATHEMATICAL HELPER FUNCTIONS
// ==========================================

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

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AIMathEnginePage() {
  // State: Navigation & XP
  const [currentMission, setCurrentMission] = useState<MissionId>("vectors");
  const [completedMissions, setCompletedMissions] = useState<Record<MissionId, boolean>>({
    vectors: false,
    matrices: false,
    linear_algebra: false,
    eigenvalues: false,
    calculus: false,
    derivatives: false,
    partial_derivatives: false,
    probability: false,
    statistics: false,
    bayes: false,
    numpy: false,
    final_ai: false
  });
  const [activeTab, setActiveTab] = useState<"visualization" | "calculator" | "formula" | "code" | "console" | "ai">("visualization");
  const [hintsUsed, setHintsUsed] = useState<Record<MissionId, number>>({
    vectors: 0,
    matrices: 0,
    linear_algebra: 0,
    eigenvalues: 0,
    calculus: 0,
    derivatives: 0,
    partial_derivatives: 0,
    probability: 0,
    statistics: 0,
    bayes: 0,
    numpy: 0,
    final_ai: 0
  });

  // Notifications / Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Calculated XP
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

  // Unlocked Missions State
  const unlockedMissions = useMemo(() => {
    const unlocked: Record<MissionId, boolean> = {
      vectors: true,
      matrices: false,
      linear_algebra: false,
      eigenvalues: false,
      calculus: false,
      derivatives: false,
      partial_derivatives: false,
      probability: false,
      statistics: false,
      bayes: false,
      numpy: false,
      final_ai: false
    };

    for (let i = 0; i < MISSIONS.length; i++) {
      const mid = MISSIONS[i].id;
      if (i === 0) {
        unlocked[mid] = true;
      } else {
        const prevId = MISSIONS[i - 1].id;
        if (completedMissions[prevId]) {
          unlocked[mid] = true;
        }
      }
    }
    return unlocked;
  }, [completedMissions]);

  // Handle Complete Mission
  const completeMission = (id: MissionId) => {
    if (!completedMissions[id]) {
      setCompletedMissions((prev) => ({ ...prev, [id]: true }));
      showToast(`🎉 Mission Completed! +${MISSIONS.find((m) => m.id === id)?.xp} XP`, "success");
    }
  };

  // Rest Lab State
  const resetLab = () => {
    setCompletedMissions({
      vectors: false,
      matrices: false,
      linear_algebra: false,
      eigenvalues: false,
      calculus: false,
      derivatives: false,
      partial_derivatives: false,
      probability: false,
      statistics: false,
      bayes: false,
      numpy: false,
      final_ai: false
    });
    setHintsUsed({
      vectors: 0,
      matrices: 0,
      linear_algebra: 0,
      eigenvalues: 0,
      calculus: 0,
      derivatives: 0,
      partial_derivatives: 0,
      probability: 0,
      statistics: 0,
      bayes: 0,
      numpy: 0,
      final_ai: 0
    });
    setCurrentMission("vectors");
    showToast("Lab progress reset successfully.", "info");
  };

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
  const [numpyCode, setNumpyCode] = useState<string>(
    `import numpy as np\n\nA = np.array([\n  [2, 1],\n  [1, 3]\n])\nx = np.array([4, 2])\n\n# Calculate matrix-vector product\nresult = A @ x\nprint("Result:", result)`
  );
  const [numpyOutput, setNumpyOutput] = useState<string>('Click "Run" to evaluate code');

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

    setAiWeight(Number(newW.toFixed(2)));
    setAiBias(Number(newB.toFixed(2)));

    const currentIter = aiHistory.length + 1;
    setAiHistory((prev) => [
      ...prev,
      {
        iter: currentIter,
        weight: Number(newW.toFixed(2)),
        bias: Number(newB.toFixed(2)),
        loss: Math.round(totalLoss)
      }
    ]);
  };

  // ==========================================
  // VALIDATION & CHALLENGES LOGIC
  // ==========================================

  const handleValidateChallenge = () => {
    switch (currentMission) {
      case "vectors": {
        const magA = calcVectorMag(vecA);
        if (Math.abs(magA - 5.0) < 0.1) {
          completeMission("vectors");
        } else {
          showToast(`Vector A magnitude is ${magA.toFixed(2)}. Target is 5.0!`, "error");
        }
        break;
      }
      case "matrices": {
        // Target: 90 deg rotation -> [[0, -1], [1, 0]]
        const isRot = matrixM2[0][0] === 0 && matrixM2[0][1] === -1 && matrixM2[1][0] === 1 && matrixM2[1][1] === 0;
        if (isRot) {
          completeMission("matrices");
        } else {
          showToast("Matrix is not a 90° rotation. Set [[0, -1], [1, 0]].", "error");
        }
        break;
      }
      case "linear_algebra": {
        const res = matrixVectorMult(matrixM3, vecM3);
        if (res[0] === 10 && res[1] === 10) {
          completeMission("linear_algebra");
        } else {
          showToast(`Calculated [${res[0]}, ${res[1]}]. Target is [10, 10].`, "error");
        }
        break;
      }
      case "eigenvalues": {
        if ((selectedEigenVec[0] === 1 && selectedEigenVec[1] === 0) || (selectedEigenVec[0] === 0 && selectedEigenVec[1] === 1)) {
          completeMission("eigenvalues");
        } else {
          showToast("Selected vector is not an eigenvector of this diagonal matrix.", "error");
        }
        break;
      }
      case "calculus": {
        if (Math.abs(selectedX - 2.0) < 0.1) {
          completeMission("calculus");
        } else {
          showToast(`Selected X is ${selectedX.toFixed(1)}. Move slider to X = 2.0`, "error");
        }
        break;
      }
      case "derivatives": {
        if (Math.abs(gdWeight) < 0.5) {
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
        if (numpyOutput.includes("[10 10]") || numpyOutput.includes("[10, 10]") || numpyOutput.includes("10")) {
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

  // Use hint
  const handleUseHint = () => {
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
                        <label className="text-[10px] text-slate-400">X Component</label>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          value={vecA[0]}
                          onChange={(e) => setVecA([parseInt(e.target.value), vecA[1]])}
                          className="w-full accent-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Y Component</label>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          value={vecA[1]}
                          onChange={(e) => setVecA([vecA[0], parseInt(e.target.value)])}
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
                        <label className="text-[10px] text-slate-400">X Component</label>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          value={vecB[0]}
                          onChange={(e) => setVecB([parseInt(e.target.value), vecB[1]])}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Y Component</label>
                        <input
                          type="range"
                          min="-5"
                          max="5"
                          value={vecB[1]}
                          onChange={(e) => setVecB([vecB[0], parseInt(e.target.value)])}
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
                <svg className="w-full h-72" viewBox="-10 -10 20 20">
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
                  <input
                    type="number"
                    value={matrixM2[0][0]}
                    onChange={(e) =>
                      setMatrixM2([
                        [parseFloat(e.target.value) || 0, matrixM2[0][1]],
                        [matrixM2[1][0], matrixM2[1][1]]
                      ])
                    }
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                  />
                  <input
                    type="number"
                    value={matrixM2[0][1]}
                    onChange={(e) =>
                      setMatrixM2([
                        [matrixM2[0][0], parseFloat(e.target.value) || 0],
                        [matrixM2[1][0], matrixM2[1][1]]
                      ])
                    }
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                  />
                  <input
                    type="number"
                    value={matrixM2[1][0]}
                    onChange={(e) =>
                      setMatrixM2([
                        [matrixM2[0][0], matrixM2[0][1]],
                        [parseFloat(e.target.value) || 0, matrixM2[1][1]]
                      ])
                    }
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                  />
                  <input
                    type="number"
                    value={matrixM2[1][1]}
                    onChange={(e) =>
                      setMatrixM2([
                        [matrixM2[0][0], matrixM2[0][1]],
                        [matrixM2[1][0], parseFloat(e.target.value) || 0]
                      ])
                    }
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
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
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
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-emerald-400 border border-emerald-500/30"
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
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
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
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                    >
                      Reflect Y
                    </button>
                  </div>
                </div>
              </div>

              {/* Transformation Visualizer */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[320px] relative">
                <svg className="w-full h-72" viewBox="-10 -10 20 20">
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
                    <input
                      type="number"
                      value={matrixM3[0][0]}
                      onChange={(e) =>
                        setMatrixM3([
                          [parseFloat(e.target.value) || 0, matrixM3[0][1]],
                          [matrixM3[1][0], matrixM3[1][1]]
                        ])
                      }
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-slate-200"
                    />
                    <input
                      type="number"
                      value={matrixM3[0][1]}
                      onChange={(e) =>
                        setMatrixM3([
                          [matrixM3[0][0], parseFloat(e.target.value) || 0],
                          [matrixM3[1][0], matrixM3[1][1]]
                        ])
                      }
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-slate-200"
                    />
                    <input
                      type="number"
                      value={matrixM3[1][0]}
                      onChange={(e) =>
                        setMatrixM3([
                          [matrixM3[0][0], matrixM3[0][1]],
                          [parseFloat(e.target.value) || 0, matrixM3[1][1]]
                        ])
                      }
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-slate-200"
                    />
                    <input
                      type="number"
                      value={matrixM3[1][1]}
                      onChange={(e) =>
                        setMatrixM3([
                          [matrixM3[0][0], matrixM3[0][1]],
                          [matrixM3[1][0], parseFloat(e.target.value) || 0]
                        ])
                      }
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-slate-200"
                    />
                  </div>
                </div>

                {/* Vector x */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Vector x (2x1)</span>
                  <div className="grid grid-cols-1 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                    <input
                      type="number"
                      value={vecM3[0]}
                      onChange={(e) => setVecM3([parseFloat(e.target.value) || 0, vecM3[1]])}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-center text-emerald-400"
                    />
                    <input
                      type="number"
                      value={vecM3[1]}
                      onChange={(e) => setVecM3([vecM3[0], parseFloat(e.target.value) || 0])}
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
                <svg className="w-full h-72" viewBox="-6 -6 12 12">
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
                  <label className="text-xs text-slate-400">Select Function f(x)</label>
                  <select
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
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={dataPlot}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="x" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} dot={false} />
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
                      onChange={(e) => setGdWeight(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newW = gdWeight - gdLearningRate * gdGrad;
                        setGdWeight(Number(newW.toFixed(2)));
                      }}
                      className="flex-1 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded text-amber-300 text-xs font-semibold"
                    >
                      Step Gradient Descent
                    </button>
                    <button onClick={() => setGdWeight(4.0)} className="px-3 py-2 bg-slate-800 rounded text-xs text-slate-300">
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
                  <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800 pt-2">
                    <span>Total Loss L:</span>
                    <span className="text-rose-400">{lossVal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 2D Loss Surface Contour Map */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[320px] relative">
                <svg className="w-full h-72" viewBox="-5 -5 10 10">
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
                    <button onClick={() => runProbSimulation(10)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-xs">
                      10 Trials
                    </button>
                    <button onClick={() => runProbSimulation(100)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-xs">
                      100 Trials
                    </button>
                    <button onClick={() => runProbSimulation(1000)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                      1,000 Trials
                    </button>
                    <button onClick={() => runProbSimulation(10000)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold text-cyan-400 border border-cyan-500/30">
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
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar dataKey="Empirical" fill="#10b981" />
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
                  <div>Standard Dev σ: {stdVal.toFixed(2)}</div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[320px]">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={activeData.map((val, idx) => ({ item: `Item ${idx + 1}`, value: val }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="item" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar dataKey="value" fill="#06b6d4" />
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
                      onChange={(e) => setPFreeSpam(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
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
                  onChange={(e) => setNumpyCode(e.target.value)}
                  className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (numpyCode.includes("@") || numpyCode.includes("dot")) {
                        setNumpyOutput("Result: [10 10]\nShape: (2,)\nData type: int64");
                      } else {
                        setNumpyOutput("Execution completed successfully.\nArray output evaluated.");
                      }
                    }}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded hover:bg-emerald-400 text-xs flex items-center gap-1"
                  >
                    <Play className="w-4 h-4" /> Run Simulator
                  </button>
                  <button
                    onClick={() =>
                      setNumpyCode(
                        `import numpy as np\n\nA = np.array([\n  [2, 1],\n  [1, 3]\n])\nx = np.array([4, 2])\n\n# Calculate matrix-vector product\nresult = A @ x\nprint("Result:", result)`
                      )
                    }
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs"
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
        const currentLoss = aiHistory.length > 0 ? aiHistory[aiHistory.length - 1].loss : 3364;

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
                      onChange={(e) => setAiBias(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={runAiStep}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center justify-center gap-1"
                  >
                    <Play className="w-4 h-4" /> 1 Optimization Step
                  </button>
                  <button
                    onClick={() => {
                      setAiWeight(2.0);
                      setAiBias(10.0);
                      setAiHistory([]);
                    }}
                    className="px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded"
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
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={aiHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="iter" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} />
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toast && (
        <div
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
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                🧠 AI Math Engine
              </h1>
              <p className="text-xs text-slate-400">Mathematics Behind AI Playground</p>
            </div>
          </div>

          {/* XP & Level Status */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex-1 md:w-64 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Level {level} • XP {xp} / {TOTAL_XP}
                </span>
                <span className="text-emerald-400">{Math.round((xp / TOTAL_XP) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${(xp / TOTAL_XP) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={resetLab}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
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
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR — MISSION TREE */}
        <div className="lg:col-span-3 space-y-2 bg-slate-900/40 border border-slate-800 rounded-xl p-3 h-fit">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">Missions</h2>

          <div className="space-y-1">
            {MISSIONS.map((m) => {
              const isUnlocked = unlockedMissions[m.id];
              const isDone = completedMissions[m.id];
              const isActive = currentMission === m.id;

              return (
                <button
                  key={m.id}
                  disabled={!isUnlocked}
                  onClick={() => setCurrentMission(m.id)}
                  className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between transition-all ${
                    isActive
                      ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300"
                      : isUnlocked
                      ? "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                      : "opacity-40 cursor-not-allowed text-slate-500 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{m.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{m.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{m.subtitle}</div>
                    </div>
                  </div>

                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isUnlocked ? (
                    <Unlock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN PLAYGROUND PANEL */}
        <div className="lg:col-span-9 space-y-6">
          {/* Mission Title Header */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <span>Mission {activeMissionDef.number} of 12</span>
                <span>•</span>
                <span>+{activeMissionDef.xp} XP</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>{activeMissionDef.icon}</span> {activeMissionDef.title}
              </h2>
              <p className="text-xs text-slate-400">{activeMissionDef.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUseHint}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Hint ({hintsUsed[currentMission] || 0}/{activeMissionDef.hints.length})
              </button>

              <button
                onClick={handleValidateChallenge}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" /> Complete Mission
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
          <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
            {(["visualization", "formula", "ai"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold border-b-2 capitalize transition-all ${
                  activeTab === tab
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
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
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
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
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                  <Cpu className="w-5 h-5" /> 💡 Where AI Uses This Concept
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{activeMissionDef.aiConnection}</p>
              </div>
            )}
          </div>
        </div>
      </div>
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