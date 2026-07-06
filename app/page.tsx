"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";



interface Topic {
  title: string;
  isHandsOn?: boolean;
  labPath?: string;
  /** Short theory/explanation shown in a flashcard before the learner proceeds. */
  content?: string;
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

const curriculum: Level[] = [
  {
    title: "Level 1 - AI Explorer",
    modules: [
      {
        title: "Module 1: What is AI?",
        topics: [
          {
            title: "What is Intelligence?",
            content:
              "Intelligence is the ability to notice a new situation, figure out what's actually going on, and respond in a way that wasn't pre-programmed. Three signs usually give it away: learning (getting better with experience), adapting (handling a situation you've never faced before), and problem-solving (finding a new path to a goal, not just following one).The trap to watch for: something can look smart just because it's fast or complex, when really it's just executing a fixed rule same input, same output, every time, no matter how many times you repeat it. A thermostat isn't deciding anything; it's just checking a number against a threshold. A crow bending wire into a hook to reach food, on the other hand, is solving a problem it's never seen before that's real intelligence.",
          },
          {
            title: "AI vs Human Intelligence",
            content:
              "AI is extremely fast at crunching huge amounts of data and never gets tired, but it doesn't truly 'understand' the world the way people do — it recognises statistical patterns rather than reasoning from lived experience. Humans are better at common sense, creativity, and handling situations they've never seen before. Most real-world AI today is a tool that's great at narrow, well-defined tasks, not a replacement for human judgement.",
          },
          {
            title: "AI Around Us",
            content:
              "AI already shows up in everyday life: the recommendations on your streaming app, voice assistants like Siri or Alexa, spam filters in your inbox, face unlock on your phone, and turn-by-turn navigation that predicts traffic. Each of these systems was trained on large amounts of past data to spot patterns humans use every day without thinking about it.",
          },
          {
            title: "History of AI",
            content:
              "AI as a field began in the 1950s, with Alan Turing's famous question 'Can machines think?' and his Turing Test. Progress was uneven — periods of excitement were followed by 'AI winters' when funding and interest dried up because the technology couldn't yet deliver. The field took off again after 2012, when deep learning combined with more data and more computing power finally started producing dramatic real-world results.",
          },
          {
            title: "Types of AI",
            content:
              "AI is usually grouped into three categories: Narrow AI (today's AI — great at one specific task like translation or image recognition), General AI (a hypothetical system with human-level ability across any task, which doesn't exist yet), and Superintelligence (a theoretical AI that would surpass human intelligence in every domain). Everything you use today, including this course, is Narrow AI.",
          },
          { title: "AI Intro Lab", isHandsOn: true, labPath: "/ai-intro-lab" },
        ],
      },
      {
        title: "Module 2: Machine Learning Without Math",
        topics: [
          {
            title: "What is Learning?",
            content:
              "In machine learning, 'learning' means improving performance on a task by looking at examples, rather than being told explicit rules for every case. Instead of a programmer writing 'if X then Y' for every possibility, the system is shown many examples and works out the underlying pattern itself.",
          },
          {
            title: "How Machines Learn",
            content:
              "A machine learning model starts with random internal settings (parameters). It's shown examples, makes a guess, checks how wrong that guess was, and nudges its parameters to be a little less wrong next time. Repeat this thousands or millions of times and the model gradually gets good at the task.",
          },
          {
            title: "Training vs Testing",
            content:
              "Training data is what the model learns from — it sees the answers and adjusts itself accordingly. Testing data is kept completely separate and hidden from the model during training; it's used afterward to check whether the model actually generalises to new, unseen situations rather than just memorising the training examples.",
          },
          {
            title: "Examples",
            content:
              "Common everyday ML examples: spam filters learn from millions of emails already labelled 'spam' or 'not spam'; price-prediction tools learn from past sales data; photo apps learn to tag 'beach' or 'dog' from millions of labelled images. In every case, the pattern is learned from labelled past examples, not hand-written rules.",
          },
          { title: "ML Without Math Lab", isHandsOn: true, labPath: "/level1-module2" },
        ],
      },
      {
        title: "Module 3: Computer Vision",
        topics: [
          {
            title: "Face Recognition",
            content:
              "Face recognition works by mapping unique measurable features of a face — like the distance between the eyes or the shape of the jawline — into a numerical fingerprint. New faces are compared against stored fingerprints to find a match, rather than the system 'seeing' a face the way a person does.",
          },
          {
            title: "Self-driving Cars",
            content:
              "Self-driving cars combine cameras, radar and other sensors with computer vision models trained to detect lanes, road signs, pedestrians and other vehicles in real time — often many times per second — so the car's software can decide how to steer, brake or accelerate safely.",
          },
          {
            title: "Image Classification",
            content:
              "Image classification is the task of assigning a label to an entire image — 'cat', 'car', 'X-ray showing a fracture' — by learning which visual patterns (edges, textures, shapes) reliably distinguish one category from another, based on thousands of labelled example images.",
          },
          {
            title: "OCR",
            content:
              "OCR (Optical Character Recognition) converts an image containing text — a scanned page, a photo of a street sign — into machine-readable, editable text. It's what lets your phone 'read' a business card or a document scanner turn a photo into a searchable PDF.",
          },
          { title: "Computer Vision Lab", isHandsOn: true, labPath: "/level1-module3" },
        ],
      },
      {
        title: "Module 4: ChatGPT and Generative AI",
        topics: [
          {
            title: "LLMs",
            content:
              "Large Language Models (LLMs) are neural networks trained on enormous amounts of text. They learn to predict the next word in a sequence so well that, strung together, this simple prediction produces coherent essays, code, conversations, and more.",
          },
          {
            title: "Prompt Engineering",
            content:
              "Prompt engineering is the skill of writing clear, well-structured inputs to guide an LLM toward the response you actually want — giving context, examples, constraints or a specific format rather than a vague one-line request.",
          },
          {
            title: "AI Assistants",
            content:
              "AI assistants pair an LLM with tools and actions — web search, calendars, code execution — so it can not just talk about a task but actually help complete it, like drafting an email, scheduling a meeting, or writing and running code.",
          },
          {
            title: "AI Ethics",
            content:
              "AI ethics covers the responsible development and use of AI: avoiding bias in training data, protecting people's privacy, being transparent about AI's limitations, and thinking carefully about misuse before it happens rather than after.",
          },
        ],
      },
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
        ],
      },
      {
        title: "Module 3: Machine Learning Basics",
        topics: [
          { title: "Machine Learning Basics" },
          { title: "Supervised Learning" },
          { title: "Unsupervised Learning" },
          { title: "Reinforcement Learning" },
          { title: "Algorithms" },
          { title: "Linear Regression" },
          { title: "Logistic Regression" },
          { title: "Decision Tree" },
          { title: "KNN" },
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
          { title: "Activation Functions", isHandsOn: true, labPath: "/level2-module4" },
        ],
      },
      {
        title: "Module 5: Deep Learning",
        topics: [
          { title: "CNN" },
          { title: "RNN" },
          { title: "LSTM" },
          { title: "Transformers (Introduction)" },
        ],
      },
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
          { title: "Supervised Learning" },
          { title: "Unsupervised Learning" },
          { title: "Reinforcement Learning" },
          { title: "Regression" },
          { title: "Classification" },
          { title: "Clustering" },
          { title: "Linear Regression" },
          { title: "Logistic Regression" },
          { title: "KNN" },
          { title: "Decision Tree" },
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
          { title: "Artificial Neural Networks" },
          { title: "Forward Propagation" },
          { title: "Backpropagation" },
          { title: "Gradient Descent" },
          { title: "Optimizers" },
          { title: "Activation Functions", labPath: "/level2-module4" },
          { title: "Loss Functions" },
          { title: "Regularization" },
          { title: "Batch Normalization" },
          { title: "Dropout" },
          { title: "PyTorch & TensorFlow", isHandsOn: true },
        ],
      },
      { title: "Module 7: Computer Vision", topics: [] },
      { title: "Module 8: Natural Language Processing", topics: [] },
      { title: "Module 9: Generative AI & LLMs", topics: [] },
      { title: "Module 10: AI Agents & Automation", topics: [] },
      { title: "Module 11: Model Deployment & MLOps", topics: [] },
    ],
  },
  {
    title: "Level 4 - Advanced AI",
    modules: [
      { title: "Module 1: Advanced Mathematics for AI", topics: [] },
      { title: "Module 2: Deep Learning Theory", topics: [] },
      { title: "Module 3: Transformer Architecture", topics: [] },
      { title: "Module 4: Large Language Models", topics: [] },
      { title: "Module 5: LLM Fine-Tuning", topics: [] },
      { title: "Module 6: Retrieval-Augmented Generation (RAG)", topics: [] },
      { title: "Module 7: AI Agents & Autonomous Systems", topics: [] },
      { title: "Module 8: Multimodal AI", topics: [] },
      { title: "Module 9: AI Infrastructure", topics: [] },
      { title: "Module 10: AI Security & Responsible AI", topics: [] },
      { title: "Module 11: AI Research Methods", topics: [] },
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

function fallbackTheory(title: string) {
  return `Theory content for "${title}" is coming soon. For now, review any linked material or ask your instructor for a quick explanation before continuing to the next topic.`;
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

function BookIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

// -----------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------

export default function Home() {
  const [openLevel, setOpenLevel] = useState<string | null>(curriculum[0]?.title ?? null);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  // Set of topicKey(levelIndex, moduleIndex, topicIndex) strings that are done.
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Load saved progress once, on the client, after mount.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCompletedTopics(new Set(parsed));
      }
    } catch {
      // ignore corrupt/missing storage
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist progress whenever it changes.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(Array.from(completedTopics))
      );
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [completedTopics, hydrated]);

  function markTopicComplete(levelIndex: number, moduleIndex: number, topicIndex: number) {
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
    return mod.topics.every((_, ti) => completedTopics.has(topicKey(levelIndex, moduleIndex, ti)));
  }

  function isLevelCompleted(levelIndex: number): boolean {
    return curriculum[levelIndex].modules.every((_, mi) => isModuleCompleted(levelIndex, mi));
  }

  // Used purely for the "Completed" BADGE. A module/level only earns the
  // badge if it actually has content AND that content is finished — an
  // empty module/level should never display as "Completed".
  function hasAnyContent(levelIndex: number): boolean {
    return curriculum[levelIndex].modules.some((m) => m.topics.length > 0);
  }

  function moduleEarnsCompleteBadge(levelIndex: number, moduleIndex: number): boolean {
    const mod = curriculum[levelIndex].modules[moduleIndex];
    if (mod.topics.length === 0) return false;
    return isModuleCompleted(levelIndex, moduleIndex);
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

  function isTopicUnlocked(levelIndex: number, moduleIndex: number, topicIndex: number): boolean {
    if (!isModuleUnlocked(levelIndex, moduleIndex)) return false;
    if (topicIndex === 0) return true;
    return completedTopics.has(topicKey(levelIndex, moduleIndex, topicIndex - 1));
  }

  return (
    <div className="al-page">
      <div className="al-wrap">
        <header className="al-header">
          <h1 className="al-title">AI Visualization Labs</h1>
          <p className="al-sub">
            Learn how AI works, explore it visually, and build your own AI skills step by step.
          </p>

          <ul className="al-legend">
            {levelThemes.map((t, i) => (
              <li key={t.name} className="al-legend-item">
                <span className="al-legend-dot" style={{ background: t.accent }} />
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
                    setOpenTopic(null);
                  }}
                  className="al-level-header"
                  aria-expanded={levelOpen}
                  aria-disabled={levelLocked}
                  disabled={levelLocked}
                >
                  <span className="al-level-heading">
                    <span className="al-tag al-tag-level">L{levelIndex + 1}</span>
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
                  {levelLocked ? <LockIcon /> : <ChevronIcon open={levelOpen} />}
                </button>

                <div className={`al-collapsible ${levelOpen ? "al-open" : ""}`}>
                  <div className="al-collapsible-inner">
                    <div className="al-modules">
                      {level.modules.map((mod, modIndex) => {
                        const moduleKey = `${level.title}/${mod.title}`;
                        const moduleLocked = !isModuleUnlocked(levelIndex, modIndex);
                        const moduleCompleted = isModuleCompleted(levelIndex, modIndex);
                        const moduleOpen = openModule === moduleKey && !moduleLocked;

                        return (
                          <div key={mod.title} className="al-module" data-locked={moduleLocked}>
                            <button
                              onClick={() => {
                                if (moduleLocked) return;
                                setOpenModule(moduleOpen ? null : moduleKey);
                                setOpenTopic(null);
                              }}
                              className="al-module-header"
                              aria-expanded={moduleOpen}
                              aria-disabled={moduleLocked}
                              disabled={moduleLocked}
                            >
                              <span className="al-module-heading">
                                <span className="al-tag al-tag-module">M{modIndex + 1}</span>
                                <span className="al-module-title">{mod.title}</span>
                                {moduleCompleted && mod.topics.length > 0 && (
                                  <span className="al-status-badge al-status-complete">
                                    <CheckIcon />
                                    Done
                                  </span>
                                )}
                              </span>
                              {moduleLocked ? <LockIcon /> : <ChevronIcon open={moduleOpen} />}
                            </button>

                            <div className={`al-collapsible ${moduleOpen ? "al-open" : ""}`}>
                              <div className="al-collapsible-inner">
                                <ul className="al-topics">
                                  {mod.topics.length === 0 && (
                                    <li className="al-empty">Content in progress</li>
                                  )}
                                  {mod.topics.map((t, i) => {
                                    const topicKeyStr = `${moduleKey}/${t.title}/${i}`;
                                    const topicOpen = openTopic === topicKeyStr;
                                    const tLocked = !isTopicUnlocked(levelIndex, modIndex, i);
                                    const tCompleted = completedTopics.has(
                                      topicKey(levelIndex, modIndex, i)
                                    );

                                    // Real lab -> a link, but marks the topic complete on click
                                    // so the next module/level can unlock.
                                    if (t.labPath) {
                                      if (tLocked) {
                                        return (
                                          <li key={topicKeyStr} className="al-topic">
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
                                        <li key={topicKeyStr} className="al-topic">
                                          <Link
                                            href={t.labPath}
                                            className="al-topic-row al-topic-link"
                                            onClick={() =>
                                              markTopicComplete(levelIndex, modIndex, i)
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
                                    }

                                    // No lab -> expand into a theory flashcard instead of navigating.
                                    if (tLocked) {
                                      return (
                                        <li key={topicKeyStr} className="al-topic">
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
                                      <li key={topicKeyStr} className="al-topic">
                                        <button
                                          onClick={() =>
                                            setOpenTopic(topicOpen ? null : topicKeyStr)
                                          }
                                          className="al-topic-row al-topic-button"
                                          aria-expanded={topicOpen}
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
                                          <ChevronIcon open={topicOpen} />
                                        </button>

                                        <div
                                          className={`al-collapsible ${
                                            topicOpen ? "al-open" : ""
                                          }`}
                                        >
                                          <div className="al-collapsible-inner">
                                            <div className="al-flashcard">
                                              <div className="al-flashcard-label">
                                                <BookIcon />
                                                Key Concept
                                              </div>
                                              <p className="al-flashcard-text">
                                                {t.content ?? fallbackTheory(t.title)}
                                              </p>
                                              {tCompleted ? (
                                                <p className="al-flashcard-done">
                                                  <CheckIcon />
                                                  Completed
                                                </p>
                                              ) : (
                                                <button
                                                  type="button"
                                                  className="al-flashcard-btn"
                                                  onClick={() =>
                                                    markTopicComplete(levelIndex, modIndex, i)
                                                  }
                                                >
                                                  Mark as Complete
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>
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
          --ink: #12141c;
          --ink-soft: #5b6072;
          --paper: #f5f6f8;
          --surface: #ffffff;
          --line: #e3e5ea;

          min-height: 100vh;
          padding: 4rem 1.5rem 6rem;
          background-color: var(--paper);
          background-image: radial-gradient(circle, #dfe2e8 1px, transparent 1px);
          background-size: 22px 22px;
          color: var(--ink);
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
        }

        .al-wrap {
          max-width: 46rem;
          margin: 0 auto;
        }

        /* ---------- Header ---------- */

        .al-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .al-title {
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
          font-size: clamp(2.75rem, 6vw, 3.75rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, #2d7dd2, #12a594, #7c5cfc, #e8590c);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .al-sub {
          font-size: 1.05rem;
          color: var(--ink-soft);
          margin-bottom: 1.75rem;
        }

        .al-legend {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem 1.1rem;
          padding: 0;
          margin: 0;
        }

        .al-legend-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .al-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .al-legend-label {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.72rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }

        /* ---------- Levels ---------- */

        .al-levels {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .al-level {
          background: var(--surface);
          border: 1px solid var(--line);
          border-left: 3px solid var(--accent);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(18, 20, 28, 0.04);
          transition: box-shadow 220ms ease, transform 220ms ease, opacity 220ms ease;
        }

        .al-level[data-open="true"] {
          box-shadow: 0 10px 28px rgba(18, 20, 28, 0.08);
        }

        .al-level[data-locked="true"] {
          opacity: 0.55;
          border-left-color: var(--line);
        }

        .al-level-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.15rem 1.4rem;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--ink);
        }

        .al-level-header:hover {
          background: color-mix(in srgb, var(--accent) 6%, transparent);
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
          gap: 0.85rem;
          min-width: 0;
          flex-wrap: wrap;
        }

        .al-level-title {
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
          font-size: 1.2rem;
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
          gap: 0.3rem;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 0.18rem 0.5rem;
          border-radius: 999px;
        }

        .al-status-complete {
          color: #12a594;
          background: color-mix(in srgb, #12a594 14%, transparent);
        }

        .al-status-locked {
          color: var(--ink-soft);
          background: color-mix(in srgb, #5b6072 12%, transparent);
        }

        /* ---------- Tags (mono badges) ---------- */

        .al-tag {
          flex-shrink: 0;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-weight: 600;
          letter-spacing: 0.02em;
          border-radius: 6px;
          text-align: center;
        }

        .al-tag-level {
          font-size: 0.75rem;
          padding: 0.28rem 0.5rem;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 14%, transparent);
        }

        .al-tag-module {
          font-size: 0.68rem;
          padding: 0.2rem 0.42rem;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 10%, transparent);
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
          opacity: 0.5;
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
          padding: 0.85rem 1.4rem;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--ink);
        }

        .al-module-header:hover {
          background: color-mix(in srgb, var(--accent) 5%, transparent);
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
          gap: 0.7rem;
          min-width: 0;
          flex-wrap: wrap;
        }

        .al-module-title {
          font-weight: 500;
          font-size: 0.95rem;
        }

        /* ---------- Topics ---------- */

        .al-topics {
          list-style: none;
          margin: 0;
          padding: 0.25rem 1.4rem 1rem 2.5rem;
        }

        .al-topic {
          border-bottom: 1px dashed var(--line);
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
          padding: 0.6rem 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-size: 0.9rem;
          color: var(--ink);
        }

        .al-topic-link {
          text-decoration: none;
        }

        .al-topic-row:hover {
          color: var(--accent);
        }

        .al-topic-locked {
          cursor: not-allowed;
          color: var(--ink-soft);
        }

        .al-topic-locked:hover {
          color: var(--ink-soft);
        }

        .al-topic-text {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .al-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          padding: 0.18rem 0.45rem;
          border-radius: 999px;
        }

        .al-arrow {
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .al-topic-link:hover .al-arrow,
        .al-topic-link:focus-visible .al-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .al-empty {
          padding: 0.7rem 0.75rem;
          margin: 0.25rem 0;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.72rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--ink-soft);
          border: 1px dashed var(--line);
          border-radius: 8px;
        }

        /* ---------- Theory flashcard ---------- */

        .al-flashcard {
          margin: 0.25rem 0.25rem 1rem;
          padding: 1rem 1.1rem;
          border-radius: 12px;
          border: 1px solid var(--line);
          border-left: 3px solid var(--accent);
          background: color-mix(in srgb, var(--accent) 5%, var(--surface));
        }

        .al-flashcard-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.55rem;
        }

        .al-flashcard-text {
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--ink);
          margin: 0 0 0.9rem;
        }

        .al-flashcard-btn {
          padding: 0.55rem 0.9rem;
          border-radius: 8px;
          border: 1px solid var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          color: var(--accent);
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
          transition: background 180ms ease, transform 180ms ease;
        }

        .al-flashcard-btn:hover {
          background: color-mix(in srgb, var(--accent) 20%, transparent);
          transform: translateY(-1px);
        }

        .al-flashcard-done {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin: 0;
          font-size: 0.8rem;
          font-weight: 600;
          color: #12a594;
        }

        /* ---------- Accessibility ---------- */

        .al-level-header:focus-visible,
        .al-module-header:focus-visible,
        .al-topic-row:focus-visible,
        .al-flashcard-btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: -2px;
          border-radius: 8px;
        }

        @media (prefers-reduced-motion: reduce) {
          .al-collapsible,
          .al-chevron,
          .al-arrow,
          .al-level {
            transition: none !important;
          }
        }

        @media (max-width: 480px) {
          .al-page {
            padding: 2.5rem 1rem 4rem;
          }
          .al-level-header,
          .al-module-header {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .al-topics {
            padding-left: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}