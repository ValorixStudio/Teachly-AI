"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Check } from "lucide-react";
interface Topic {
  title: string;
  isHandsOn?: boolean;
  labPath?: string;
}

interface Module {
  title: string;
  topics: Topic[];
}

interface Level {
  title: string;
  modules: Module[];
}

// Utility function to convert topic titles to URL-safe slugs
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

// Every topic navigates somewhere. If a labPath was set explicitly, use it;
// otherwise derive a URL from the topic title (e.g. "AI Around Us" -> /ai-around-us).
// labPath is normalized to always start with "/" since some entries in the
// curriculum below were authored without a leading slash (e.g.
// "what-is-intelligence") while others include it (e.g. "/ai-foundations-lab").
// Without normalizing, next/link would treat those as relative paths instead
// of absolute routes.
function resolveTopicPath(topic: Topic): string {
  if (topic.labPath) {
    return topic.labPath.startsWith("/") ? topic.labPath : `/${topic.labPath}`;
  }
  return `/${titleToSlug(topic.title)}`;
}

const curriculum: Level[] = [
  {
    title: "Level 1 - AI Explorer",
    modules: [
      {
        title: "Module 1: What is AI?",
        topics: [
          { title: "What is Intelligence?", labPath: "what-is-intelligence" },
          {
            title: "AI vs Human Intelligence",
            labPath: "ai-vs-human-intelligence",
          },
          { title: "AI Around Us", labPath: "ai-around-us" },
          { title: "History of AI", labPath: "history-of-ai" },
          { title: "Types of AI", labPath: "types-of-ai" },
          { title: "AI Foundations Lab", isHandsOn: true, labPath: "/ai-foundations-lab" },
        ],
      },
      {
        title: "Module 2: Machine Learning Without Math",
        topics: [
          { title: "What is Learning?" },
          { title: "How Machines Learn" },
          { title: "Training vs Testing" },
          { title: "Examples" },
          {
            title: "ML Without Math Lab",
            isHandsOn: true,
            labPath: "/ml-without-math-lab",
          },
        ],
      },
      {
        title: "Module 3: Computer Vision",
        topics: [
          { title: "Face Recognition" },
          { title: "Self-driving Cars" },
          { title: "Image Classification" },
          { title: "OCR" },
          {
            title: "Computer Vision Lab",
            isHandsOn: true,
            labPath: "/computer-vision-lab",
          },
        ],
      },
      {
        title: "Module 4: ChatGPT and Generative AI",
        topics: [
          { title: "LLMs" },
          { title: "Prompt Engineering" },
          { title: "AI Assistants" },
          { title: "AI Ethics" },
          {
            title: "ChatGPT and Generative AI Lab",
            isHandsOn: true,
            labPath: "/chatgpt-and-genAI-lab"},
        ],
      },
  {title: "AI Explorer: Your First Mission!! ", topics: [{
           title: "Try It Yourself ",
            isHandsOn: true,
            labPath: "/level1"}, ] }
    ],
  },
  {
    title: "Level 2 - AI Foundations",
    modules: [
      {
        title: "Module 1: Python Basics",
        topics: [
          { title: "Variables" },
          { title: "Loops" },
          { title: "Functions" },
          { title: "Lists" },
          { title: "Dictionaries" },
          {
            title: "Python Basics Lab",
            isHandsOn: true,
            labPath: "/python-basics-lab",
          },
        ],
      },
      {
        title: "Module 2: Data",
        topics: [
          { title: "What is Data?" },
          { title: "CSV" },
          { title: "Images" },
          { title: "Audio" },
          { title: "Text" },
          { title: "Data Lab", isHandsOn: true, labPath: "/data-lab" },
        ],
      },
      {
        title: "Module 3: Machine Learning Basics",
        topics: [
          { title: "Machine Learning Basics" },
          { title: "Supervised Learning" },
          { title: "Unsupervised Learning" },
          { title: "Reinforcement Learning" },
          { title: "Linear Regression" },
          { title: "Logistic Regression" },
          { title: "Decision Tree" },
          { title: "KNN" },
          {
            title: "Machine Learning Basics Lab",
            isHandsOn: true,
            labPath: "/ml-basics-lab",
          },
        ],
      },
      {
        title: "Module 4: Neural Networks",
        topics: [
          { title: "Neural Networks" },
          { title: "Biological Neuron" },
          { title: "Artificial Neuron" },
          { title: "Perceptron" },
          { title: "Need for Non-Linearity" },
          { title: "Activation Functions" },
          { title: "Layers" },
          { title: "Forward Propagation" },
          // Hands-on: this is the one that jumps into the real lab
          {
            title: "Neural Network Lab",
            isHandsOn: true,
            labPath: "/neural-network-lab",
          },
        ],
      },
      {
        title: "Module 5: Deep Learning",
        topics: [
          { title: "CNN" },
          { title: "RNN" },
          { title: "LSTM" },
          { title: "Transformers (Introduction)" },
          {
            title: "Deep Learning Lab",
            isHandsOn: true,
            labPath: "/deep-learning-lab",
          },
        ],
      },
       {title: "AI Foundations: Your Second Mission!! ", topics: [{
           title: "Try It Yourself ",
            isHandsOn: true,
            labPath: "/level2"}, ] }
    ],
  },
  {
    title: "Level 3 - AI Engineer",
    modules: [
      {
        title: "Module 1: Python Programming for AI",
        topics: [
          { title: "Python Basics Revision" },
          { title: "Advanced Data Structures" },
          { title: "Functions & Modules" },
          { title: "Object-Oriented Programming" },
          { title: "File Handling" },
          { title: "Exception Handling" },
          { title: "Decorators" },
          { title: "Generators & Iterators" },
          { title: "Virtual Environments" },
          { title: "Package Management" },
          { title: "Git & GitHub Basics" },
          { title: "Python Mini Projects", isHandsOn: true },
          { title: "CLI Applications", isHandsOn: true },

        ],
      },
      {
        title: "Module 2: Mathematics for AI",
        topics: [
          { title: "Linear Algebra" },
          { title: "Matrices" },
          { title: "Vectors" },
          { title: "Eigenvalues & Eigenvectors" },
          { title: "Calculus Basics" },
          { title: "Derivatives" },
          { title: "Partial Derivatives" },
          { title: "Probability" },
          { title: "Statistics" },
          { title: "Bayes Theorem" },
          { title: "NumPy Mathematical Operations", isHandsOn: true },
        ],
      },
      {
        title: "Module 3: Data Science Essentials",
        topics: [
          { title: "Data Collection" },
          { title: "Data Cleaning" },
          { title: "Feature Engineering" },
          { title: "NumPy" },
          { title: "Pandas" },
          { title: "Data Visualization" },
          { title: "Exploratory Data Analysis" },
          { title: "Missing Values" },
          { title: "Outlier Detection" },
          { title: "Analyze Real Datasets", isHandsOn: true },
        ],
      },
      {
        title: "Module 4: Machine Learning Fundamentals",
        topics: [
          { title: "ML Pipeline" },
          { title: "More on Supervised Learning" },
          { title: "More on Unsupervised Learning" },
          { title: "More on Reinforcement Learning" },
          { title: "Regression" },
          { title: "Classification" },
          { title: "Clustering" },
          { title: "More on Linear Regression" },
          { title: "More on Logistic Regression" },
          { title: "More on KNN" },
          { title: "More on Decision Tree" },
          { title: "Random Forest" },
          { title: "SVM" },
          { title: "Naive Bayes" },
          { title: "K-Means" },
          { title: "PCA" },
          { title: "Build Multiple ML Models", isHandsOn: true },
        ],
      },
      {
        title: "Module 5: Model Evaluation & Optimization",
        topics: [
          { title: "Train/Test Split" },
          { title: "Cross Validation" },
          { title: "Hyperparameter Tuning" },
          { title: "Precision" },
          { title: "Recall" },
          { title: "F1 Score" },
          { title: "ROC Curve" },
          { title: "Confusion Matrix" },
          { title: "Bias-Variance Tradeoff" },
        ],
      },
      {
        title: "Module 6: Deep Learning Fundamentals",
        topics: [
          { title: "Deep Neural Networks" },
           { title: "Feedforward Neural Networks" },
          { title: "More on Forward Propagation" },
           { title: "Loss Functions" },
          { title: "Backpropagation" },
          { title: "Gradient Descent" },
          { title: "Optimizers" },
           { title: "Batch Normalization" }, 
          { title: "Regularization" },
          { title: "Dropout" },
           {
            title: "Feedforward Neural Network Simulation Lab",
            isHandsOn: true,
            labPath: "/deep-neural-network-lab"
          }
        ],
      },
      { title: "Module 7: Computer Vision", topics: [
         { title: "OpenCV" },
          { title: "Image Processing" },
          { title: "CNN-2" },
          { title: "Transfer Learning" },
          { title: "Object Detection" },
          { title: "Image Segmentation" },
          { title: "More on OCR" },
          { title: "YOLO"}, 
      ] },
      { title: "Module 8: Natural Language Processing", topics: [ { title: "More on OpenCV" },
          { title: "Text Processing" },
          { title: "Tokenization" },
          { title: "Stemming" },
          { title: "Lemmatization" },
          { title: "Embeddings" },
          { title: "Word2Vec"},
          { title: "GloVe"},
            { title: "BERT"},
                { title: "Transformers"},
        ] },
      { title: "Module 9: Generative AI & LLMs", topics: [
 { title: "Introduction to LLMs" },
          { title: "GPT Architecture" },
          { title: "More on Prompt Engineering" },
          { title: "LLM Embeddings" },
          { title: "Vector Databases" },
          { title: "Retrieval-Augmented Generation (RAG)"},
          { title: "Function Calling"},
            { title: "Context Windows"},

      ] },
      { title: "Module 10: AI Agents & Automation", topics: [
{ title: "AI Agents" },
          { title: "Tool Calling" },
          { title: "Memory Systems" },
          { title: "Multi-Agent Systems" },
          { title: "Embeddings" },
          { title: "LangChain"},
          { title: "CrewAI"},
            { title: "MCP Basics"},
          


      ] },
      { title: "Module 11: Model Deployment & MLOps", topics: [
{ title: "AI Agents" },
          { title: "FastAPI" },
          { title: "Docker" },
          { title: "Kubernetes" },
          { title: "MLflow" },
          { title: "CI/CD"},
          { title: "Monitoring"},
            { title: "Logging"},
             { title: "Model Serving"},

      ] },
       {title: "AI Engineer: Your Next Mission!! ", topics: [{
           title: "Try It Yourself ",
            isHandsOn: true,
            labPath: "/level3"}, ] }
    ],
  },
  {
    title: "Level 4 - Advanced AI",
    modules: [
      { title: "Module 1: Advanced Mathematics for AI", topics: [
          { title: "Advanced Linear Algebra" },
          { title: "Matrix Decomposition" },
          { title: "Multivariable Calculus" },
          { title: "Convex Optimization" },
          { title: "Information Theory"},
          { title: "Numerical Optimization"},
           
      ] },
      { title: "Module 2: Deep Learning Theory", topics: [
{ title: "Computational Graphs" },
          { title: "Automatic Differentiation" },
          { title: "Gradient Flow" },
          { title: "Vanishing/Exploding Gradients" },
          { title: "Residual Networks"},
          { title: "Advanced Optimizers"},
           { title: "Learning Rate Scheduling"},
           
        
      ] },
      { title: "Module 3: Transformer Architecture", topics: [
{ title: "Self-Attention" },
          { title: "Multi-Head Attention" },
          { title: "Positional Encoding" },
          { title: "Encoder" },
          { title: "Decoder"},
          { title: "Cross Attention"},
           { title: "Feed Forward Networks"},
           { title: "Layer Normalization"},

      ] },
      { title: "Module 4: Large Language Models", topics: [
{ title: "GPT" },
          { title: "BERT" },
          { title: "LLaMA" },
          { title: "Mistral" },
          { title: "Gemma"},
          { title: "Tokenizers"},
           { title: "Scaling Laws"},
           { title: "Inference Optimization"},

      ] },
      { title: "Module 5: LLM Fine-Tuning", topics: [
        { title: "Fine-Tuning" },
          { title: "LoRA" },
          { title: "QLoRA" },
          { title: "PEFT" },
          { title: "RLHF"},
          { title: "DPO"},
           { title: "Model Distillation"},
           { title: "Quantization"},
      ] },
      { title: "Module 6: Retrieval-Augmented Generation (RAG)", topics: [
 { title: "Fine-Tuning" },
          { title: "Embeddings" },
          { title: "Chunking" },
          { title: "Retrieval Strategies" },
          { title: "Hybrid Search"},
          { title: "Vector Databases"},
           { title: "Knowledge Graphs"},
           { title: "Reranking"},
           { title: "Evaluation"},

      ] },
      { title: "Module 7: AI Agents & Autonomous Systems", topics: [
{ title: "Planning" },
          { title: "Reasoning" },
          { title: "Reflection" },
          { title: "Memory Architectures"},
          { title: "Agent Communication"},
           { title: "Multi-Agent Collaboration"},
           { title: "Tool Use"},
           { title: "Agent Evaluation"},


      ] },
      { title: "Module 8: Multimodal AI", topics: [
{ title: "Planning" },
          { title: "Vision Transformers" },
          { title: "Vision-Language Models" },
          { title: "Image Generation"},
          { title: "Speech Models"},
           { title: "Audio Understanding"},
           { title: "Video Understanding"},

      ] },
      { title: "Module 9: AI Infrastructure", topics: [
{ title: "GPU Programming" },
          { title: "CUDA Basics" },
          { title: "Distributed Training" },
          { title: "Parallel Processing"},
          { title: "Ray"},
           { title: "DeepSpeed"},
           { title: "Tensor Parallelism"},
           { title: "Pipeline Parallelism"},

      ] },
      { title: "Module 10: AI Security & Responsible AI", topics: [

        { title: "AI Ethics" },
          { title: "Explainable AI (XAI)" },
          { title: "Adversarial Attacks" },
          { title: "AI Safety"},
          { title: "Bias Detection"},
           { title: "Privacy"},
           { title: "Governance"},
      ] },
      { title: "Module 11: AI Research Methods", topics: [

          { title: "Reading Research Papers" },
          { title: "Literature Surveys" },
          { title: "Parallel Processing"},
          { title: "Experiment Design"},
           { title: "Benchmarking"},
           { title: "Reproducibility"},
           { title: "Scientific Writing"},
      ] },
    ],
  },
];

// -----------------------------------------------------------------------
// Level theming — a cool → warm spectrum that maps to difficulty.
// Index lines up 1:1 with `curriculum` above.
// -----------------------------------------------------------------------

const levelThemes = [
  { accent: "#2D7DD2", name: "Explorer" },
  { accent: "#12A594", name: "Foundations" },
  { accent: "#7C5CFC", name: "Engineer" },
  { accent: "#E8590C", name: "Advanced" },
];

// -----------------------------------------------------------------------
// Progression system — topic → module → level, all sequential.
// -----------------------------------------------------------------------

const PROGRESS_STORAGE_KEY = "ai-labs-completed-topics-v2";

function topicKey(levelIndex: number, moduleIndex: number, topicIndex: number) {
  return `${levelIndex}:${moduleIndex}:${topicIndex}`;
}

// -----------------------------------------------------------------------
// Small inline icons (no extra dependency)
// -----------------------------------------------------------------------

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="al-chevron"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="al-arrow"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h13" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 2v6.3L4.2 17a2 2 0 0 0 1.8 3h12a2 2 0 0 0 1.8-3L15 8.3V2" />
      <path d="M8.5 2h7" />
      <path d="M7.5 14.5h9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="al-lock"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// -----------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------

export default function Home() {
  const [openLevel, setOpenLevel] = useState<string | null>(
    curriculum[0]?.title ?? null,
  );
  const [openModule, setOpenModule] = useState<string | null>(null);

  // Set of topicKey(levelIndex, moduleIndex, topicIndex) strings that are done.
  // IMPORTANT: this must start identical on server and client (an empty Set).
  // Reading localStorage inside the useState initializer would make the
  // client's very first render diverge from the server-rendered HTML
  // (different locked/unlocked topics, "Completed" badges, etc.), which is
  // exactly what causes a hydration error. So we always start empty here,
  // and load the real saved progress in an effect below, after mount.
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    () => new Set(),
  );
  const [hydrated, setHydrated] = useState(false);

  // Load saved progress once, on the client, after mount. This runs after
  // hydration has completed, so updating state here is a normal re-render,
  // not a hydration mismatch.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Avoid setting state synchronously inside an effect to prevent
          // cascading renders / linter warnings. Schedule the update.
          setTimeout(() => setCompletedTopics(new Set(parsed)), 0);
        }
      }
    } catch {
      // ignore corrupt/missing storage
    }
    setTimeout(() => setHydrated(true), 0);
  }, []);

  // Persist progress whenever it changes.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(Array.from(completedTopics)),
      );
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [completedTopics, hydrated]);

  function markTopicComplete(
    levelIndex: number,
    moduleIndex: number,
    topicIndex: number,
  ) {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      next.add(topicKey(levelIndex, moduleIndex, topicIndex));
      return next;
    });
  }

  // Used purely for unlocking the NEXT module/level. Empty-content modules
  // auto-pass here so they never permanently block progression.
  function isModuleCompleted(levelIndex: number, moduleIndex: number): boolean {
    const mod = curriculum[levelIndex].modules[moduleIndex];
    if (mod.topics.length === 0) return true;
    return mod.topics.every((_, ti) =>
      completedTopics.has(topicKey(levelIndex, moduleIndex, ti)),
    );
  }

  function isLevelCompleted(levelIndex: number): boolean {
    return curriculum[levelIndex].modules.every((_, mi) =>
      isModuleCompleted(levelIndex, mi),
    );
  }

  // Used purely for the "Completed" BADGE. A module/level only earns the
  // badge if it actually has content AND that content is finished — an
  // empty module/level should never display as "Completed".
  function hasAnyContent(levelIndex: number): boolean {
    return curriculum[levelIndex].modules.some((m) => m.topics.length > 0);
  }

  function levelEarnsCompleteBadge(levelIndex: number): boolean {
    if (!hasAnyContent(levelIndex)) return false;
    return isLevelCompleted(levelIndex);
  }

  function isLevelUnlocked(levelIndex: number): boolean {
    if (levelIndex === 0) return true;
    return isLevelCompleted(levelIndex - 1);
  }

  function isModuleUnlocked(levelIndex: number, moduleIndex: number): boolean {
    if (!isLevelUnlocked(levelIndex)) return false;
    if (moduleIndex === 0) return true;
    return isModuleCompleted(levelIndex, moduleIndex - 1);
  }

  function isTopicUnlocked(
    levelIndex: number,
    moduleIndex: number,
    topicIndex: number,
  ): boolean {
    if (!isModuleUnlocked(levelIndex, moduleIndex)) return false;
    if (topicIndex === 0) return true;
    return completedTopics.has(
      topicKey(levelIndex, moduleIndex, topicIndex - 1),
    );
  }

  return (
    <div className="al-page">
      <div className="al-wrap">
        <header className="al-header">
          <h1 className="al-title">AI Visualization Labs</h1>
          <p className="al-sub">
            Learn how AI works, explore it visually, and build your own AI
            skills step by step.
          </p>

          <ul className="al-legend">
            {levelThemes.map((t, i) => (
              <li key={t.name} className="al-legend-item">
                <span
                  className="al-legend-dot"
                  style={{ background: t.accent }}
                />
                <span className="al-legend-label">
                  L{i + 1} · {t.name}
                </span>
              </li>
            ))}
          </ul>
        </header>

        <div className="al-levels">
          {curriculum.map((level, levelIndex) => {
            const levelLocked = !isLevelUnlocked(levelIndex);
            const levelCompleted = levelEarnsCompleteBadge(levelIndex);
            const levelOpen = openLevel === level.title && !levelLocked;
            const theme = levelThemes[levelIndex] ?? levelThemes[0];
            const accentStyle = { "--accent": theme.accent } as CSSProperties;

            return (
              <section
                key={level.title}
                className="al-level"
                style={accentStyle}
                data-open={levelOpen}
                data-locked={levelLocked}
              >
                <button
                  onClick={() => {
                    if (levelLocked) return;
                    setOpenLevel(levelOpen ? null : level.title);
                    setOpenModule(null);
                  }}
                  className="al-level-header"
                  aria-expanded={levelOpen}
                  aria-disabled={levelLocked}
                  disabled={levelLocked}
                >
                  <span className="al-level-heading">
                    <span className="al-tag al-tag-level">
                      L{levelIndex + 1}
                    </span>
                    <span className="al-level-title">{level.title}</span>
                    {levelCompleted && (
                      <span className="al-status-badge al-status-complete">
                        <CheckIcon />
                        Completed
                      </span>
                    )}
                    {levelLocked && (
                      <span className="al-status-badge al-status-locked">
                        <LockIcon />
                        Locked
                      </span>
                    )}
                  </span>
                  {levelLocked ? (
                    <LockIcon />
                  ) : (
                    <ChevronIcon open={levelOpen} />
                  )}
                </button>

                <div className={`al-collapsible ${levelOpen ? "al-open" : ""}`}>
                  <div className="al-collapsible-inner">
                    <div className="al-modules">
                      {level.modules.map((mod, modIndex) => {
                        const moduleKey = `${level.title}/${mod.title}`;
                        const moduleLocked = !isModuleUnlocked(
                          levelIndex,
                          modIndex,
                        );
                        const moduleCompleted = isModuleCompleted(
                          levelIndex,
                          modIndex,
                        );
                        const moduleOpen =
                          openModule === moduleKey && !moduleLocked;

                        return (
                          <div
                            key={mod.title}
                            className="al-module"
                            data-locked={moduleLocked}
                          >
                            <button
                              onClick={() => {
                                if (moduleLocked) return;
                                setOpenModule(moduleOpen ? null : moduleKey);
                              }}
                              className="al-module-header"
                              aria-expanded={moduleOpen}
                              aria-disabled={moduleLocked}
                              disabled={moduleLocked}
                            >
                              <span className="al-module-heading">
                                <span className="al-tag al-tag-module">
                                  M{modIndex + 1}
                                </span>
                                <span className="al-module-title">
                                  {mod.title}
                                </span>
                                {moduleCompleted && mod.topics.length > 0 && (
                                  <span className="al-status-badge al-status-complete">
                                    <CheckIcon />
                                    Done
                                  </span>
                                )}
                              </span>
                              {moduleLocked ? (
                                <LockIcon />
                              ) : (
                                <ChevronIcon open={moduleOpen} />
                              )}
                            </button>

                            <div
                              className={`al-collapsible ${moduleOpen ? "al-open" : ""}`}
                            >
                              <div className="al-collapsible-inner">
                                <ul className="al-topics">
                                  {mod.topics.length === 0 && (
                                    <li className="al-empty">
                                      Content in progress
                                    </li>
                                  )}
                                  {mod.topics.map((t, i) => {
                                    const topicKeyStr = `${moduleKey}/${t.title}/${i}`;
                                    const tLocked = !isTopicUnlocked(
                                      levelIndex,
                                      modIndex,
                                      i,
                                    );
                                    const tCompleted = completedTopics.has(
                                      topicKey(levelIndex, modIndex, i),
                                    );
                                    const href = resolveTopicPath(t);

                                    if (tLocked) {
                                      return (
                                        <li
                                          key={topicKeyStr}
                                          className="al-topic"
                                        >
                                          <div className="al-topic-row al-topic-locked">
                                            <span className="al-topic-text">
                                              {t.title}
                                              {t.isHandsOn && (
                                                <span className="al-badge">
                                                  <FlaskIcon />
                                                  Hands-on
                                                </span>
                                              )}
                                            </span>
                                            <LockIcon />
                                          </div>
                                        </li>
                                      );
                                    }

                                    return (
                                      <li
                                        key={topicKeyStr}
                                        className="al-topic"
                                      >
                                        <Link
                                          href={href}
                                          className="al-topic-row al-topic-link"
                                          onClick={() =>
                                            markTopicComplete(
                                              levelIndex,
                                              modIndex,
                                              i,
                                            )
                                          }
                                        >
                                          <span className="al-topic-text">
                                            {t.title}
                                            {t.isHandsOn && (
                                              <span className="al-badge">
                                                <FlaskIcon />
                                                Hands-on
                                              </span>
                                            )}
                                            {tCompleted && (
                                              <span className="al-status-badge al-status-complete">
                                                <CheckIcon />
                                                Done
                                              </span>
                                            )}
                                          </span>
                                          <ArrowIcon />
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap");

        .al-page {
          --bg-base: #f8fafc;
          --bg-surface: #ffffff;
          --ink: #0f172a;
          --ink-soft: #64748b;
          --line: #e2e8f0;

          min-height: 100vh;
          padding: 4rem 1.5rem 6rem;
          background-color: var(--bg-base);
          background-image: url("/bg-light.jpg");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: var(--ink);
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
        }

        .al-wrap {
          max-width: 58rem;
          margin: 0 auto;
        }

        /* ---------- Header ---------- */

        .al-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .al-title {
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
          font-size: clamp(2.75rem, 6vw, 4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          background: linear-gradient(
            235deg,
            #a62963 0%,
            #a6497c 60%,
            #bf984e 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        .al-sub {
          font-size: 1.15rem;
          color: var(--ink-soft);
          margin-bottom: 2rem;
          max-width: 32rem;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .al-legend {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem 1.5rem;
          padding: 0;
          margin: 0;
        }

        .al-legend-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .al-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 8px var(--accent);
        }

        .al-legend-label {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }

        /* ---------- Levels (Roadmap Timeline) ---------- */

        .al-levels {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          position: relative;
          padding-left: 48px;
        }

        .al-levels::before {
          content: "";
          position: absolute;
          top: 2rem;
          bottom: 2rem;
          left: 14px;
          width: 4px;
          background: var(--line);
          border-radius: 4px;
        }

        .al-level {
          position: relative;
          background: var(--bg-surface);
          border: 1px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        /* Timeline Node */
        .al-level::before {
          content: "";
          position: absolute;
          top: 1.5rem;
          left: -42px; /* Centers the 16px circle on the 4px line at 14px */
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 4px solid var(--accent);
          z-index: 2;
          box-shadow: 0 0 0 6px var(--bg-base);
          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .al-level[data-open="true"] {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--accent) 50%, transparent);
        }

        .al-level[data-open="true"]::before {
          transform: scale(1.2);
        }

        .al-level[data-locked="true"] {
          opacity: 0.6;
          filter: grayscale(100%);
        }

        .al-level[data-locked="true"]::before {
          border-color: var(--line);
        }

        .al-level-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--ink);
          transition: background-color 0.2s ease;
        }

        .al-level-header:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }

        .al-level[data-locked="true"] .al-level-header {
          cursor: not-allowed;
        }

        .al-level[data-locked="true"] .al-level-header:hover {
          background: transparent;
        }

        .al-level-heading {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
          flex-wrap: wrap;
        }

        .al-level-title {
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .al-chevron {
          flex-shrink: 0;
          color: var(--ink-soft);
          transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .al-lock {
          flex-shrink: 0;
          color: var(--ink-soft);
        }

        /* ---------- Status badges (locked / completed) ---------- */

        .al-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
        }

        .al-status-complete {
          color: #059669;
          background: rgba(5, 150, 105, 0.1);
          border: 1px solid rgba(5, 150, 105, 0.2);
        }

        .al-status-locked {
          color: var(--ink-soft);
          background: rgba(100, 116, 139, 0.1);
          border: 1px solid var(--line);
        }

        /* ---------- Tags (mono badges) ---------- */

        .al-tag {
          flex-shrink: 0;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-weight: 600;
          letter-spacing: 0.05em;
          border-radius: 6px;
          text-align: center;
          border: 1px solid var(--accent);
        }

        .al-tag-level {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 15%, transparent);
        }

        .al-tag-module {
          font-size: 0.7rem;
          padding: 0.2rem 0.4rem;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
        }

        /* ---------- Collapsible (animated height) ---------- */

        .al-collapsible {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .al-collapsible.al-open {
          grid-template-rows: 1fr;
        }

        .al-collapsible-inner {
          overflow: hidden;
        }

        /* ---------- Modules ---------- */

        .al-modules {
          border-top: 1px solid var(--line);
        }

        .al-module {
          border-bottom: 1px solid var(--line);
          transition: opacity 220ms ease;
        }

        .al-module[data-locked="true"] {
          opacity: 0.6;
        }

        .al-module:last-child {
          border-bottom: none;
        }

        .al-module-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--ink);
          transition: background-color 0.2s ease;
        }

        .al-module-header:hover {
          background-color: rgba(0, 0, 0, 0.015);
        }

        .al-module[data-locked="true"] .al-module-header {
          cursor: not-allowed;
        }

        .al-module[data-locked="true"] .al-module-header:hover {
          background: transparent;
        }

        .al-module-heading {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          min-width: 0;
          flex-wrap: wrap;
        }

        .al-module-title {
          font-weight: 500;
          font-size: 1rem;
        }

        /* ---------- Topics ---------- */

        .al-topics {
          list-style: none;
          margin: 0;
          padding: 0.5rem 1.5rem 1.25rem 2.75rem;
        }

        .al-topic {
          border-bottom: 1px solid var(--line);
        }

        .al-topic:last-child {
          border-bottom: none;
        }

        .al-topic-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-size: 0.95rem;
          color: var(--ink);
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .al-topic-link {
          text-decoration: none;
        }

        .al-topic-row:hover {
          color: var(--accent);
          transform: translateX(4px);
        }

        .al-topic-locked {
          cursor: not-allowed;
          color: var(--ink-soft);
        }

        .al-topic-locked:hover {
          color: var(--ink-soft);
          transform: none;
        }

        .al-topic-text {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .al-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .al-arrow {
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-8px);
          transition:
            opacity 200ms ease,
            transform 200ms ease;
          color: var(--accent);
        }

        .al-topic-link:hover .al-arrow,
        .al-topic-link:focus-visible .al-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .al-empty {
          padding: 1rem;
          margin: 0.5rem 0;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--ink-soft);
          border: 1px dashed var(--line);
          border-radius: 8px;
          text-align: center;
          background: rgba(0, 0, 0, 0.01);
        }

        /* ---------- Accessibility ---------- */

        .al-level-header:focus-visible,
        .al-module-header:focus-visible,
        .al-topic-row:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: -2px;
          border-radius: 8px;
        }

        @media (prefers-reduced-motion: reduce) {
          .al-collapsible,
          .al-chevron,
          .al-arrow,
          .al-level,
          .al-topic-row {
            transition: none !important;
          }
        }

        @media (max-width: 480px) {
          .al-page {
            padding: 2.5rem 1rem 4rem;
          }
          .al-title {
            font-size: 2.25rem;
          }
          .al-levels {
            padding-left: 32px;
          }
          .al-levels::before {
            left: 8px;
          }
          .al-level::before {
            left: -34px;
            width: 16px;
            height: 16px;
            top: 1.4rem;
          }
          .al-level-header,
          .al-module-header {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .al-topics {
            padding-left: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}