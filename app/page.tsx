"use client";

import { useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";



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

const curriculum: Level[] = [
  {
    title: "Level 1 - AI Explorer",
    modules: [
      {
        title: "Module 1: What is AI?",
        topics: [
          { title: "What is Intelligence?" },
          { title: "AI vs Human Intelligence" },
          { title: "AI Around Us" },
          { title: "History of AI" },
          { title: "Types of AI" },
          { title: "AI Intro Lab", isHandsOn: true, labPath: "/level1-module1" },
        ],
      },
      {
        title: "Module 2: Machine Learning Without Math",
        topics: [
          { title: "What is Learning?" },
          { title: "How Machines Learn" },
          { title: "Training vs Testing" },
          { title: "Examples" },
          { title: "ML Without Math Lab", isHandsOn: true, labPath: "/level1-module2" },
        ],
      },
      {
        title: "Module 3: Computer Vision",
        topics: [
          { title: "Face Recognition" },
          { title: "Self-driving Cars" },
          { title: "Image Classification" },
          { title: "OCR" },
           { title: "Computer Vision Lab", isHandsOn: true, labPath: "/level1-module3" },
        ],
      },
      {
        title: "Module 4: ChatGPT and Generative AI",
        topics: [
          { title: "LLMs" },
          { title: "Prompt Engineering" },
          { title: "AI Assistants" },
          { title: "AI Ethics" },
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

// -----------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------

export default function Home() {
  const [openLevel, setOpenLevel] = useState<string | null>(curriculum[0]?.title ?? null);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  return (
    <div className="al-page">
      <div className="al-wrap">
        <header className="al-header">
          <h1 className="al-title">AI Labs</h1>
          <p className="al-sub">
            Pick a level, open a module, and jump straight into a topic or hands-on lab.
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
            const levelOpen = openLevel === level.title;
            const theme = levelThemes[levelIndex] ?? levelThemes[0];
            const accentStyle = { "--accent": theme.accent } as CSSProperties;

            return (
              <section key={level.title} className="al-level" style={accentStyle} data-open={levelOpen}>
                <button
                  onClick={() => {
                    setOpenLevel(levelOpen ? null : level.title);
                    setOpenModule(null);
                    setOpenTopic(null);
                  }}
                  className="al-level-header"
                  aria-expanded={levelOpen}
                >
                  <span className="al-level-heading">
                    <span className="al-tag al-tag-level">L{levelIndex + 1}</span>
                    <span className="al-level-title">{level.title}</span>
                  </span>
                  <ChevronIcon open={levelOpen} />
                </button>

                <div className={`al-collapsible ${levelOpen ? "al-open" : ""}`}>
                  <div className="al-collapsible-inner">
                    <div className="al-modules">
                      {level.modules.map((mod, modIndex) => {
                        const moduleKey = `${level.title}/${mod.title}`;
                        const moduleOpen = openModule === moduleKey;

                        return (
                          <div key={mod.title} className="al-module">
                            <button
                              onClick={() => {
                                setOpenModule(moduleOpen ? null : moduleKey);
                                setOpenTopic(null);
                              }}
                              className="al-module-header"
                              aria-expanded={moduleOpen}
                            >
                              <span className="al-module-heading">
                                <span className="al-tag al-tag-module">M{modIndex + 1}</span>
                                <span className="al-module-title">{mod.title}</span>
                              </span>
                              <ChevronIcon open={moduleOpen} />
                            </button>

                            <div className={`al-collapsible ${moduleOpen ? "al-open" : ""}`}>
                              <div className="al-collapsible-inner">
                                <ul className="al-topics">
                                  {mod.topics.length === 0 && (
                                    <li className="al-empty">Content in progress</li>
                                  )}
                                  {mod.topics.map((t, i) => {
                                    const topicKey = `${moduleKey}/${t.title}/${i}`;
                                    const topicOpen = openTopic === topicKey;
                                    const topicSlug = titleToSlug(t.title);

                                    // Real lab -> just a normal link, no extra page needed.
                                    if (t.labPath) {
                                      return (
                                        <li key={topicKey} className="al-topic">
                                          <Link href={t.labPath} className="al-topic-row al-topic-link">
                                            <span className="al-topic-text">
                                              {t.title}
                                              {t.isHandsOn && (
                                                <span className="al-badge">
                                                  <FlaskIcon />
                                                  Hands-on
                                                </span>
                                              )}
                                            </span>
                                            <ArrowIcon />
                                          </Link>
                                        </li>
                                      );
                                    }

                                    // Topics without lab -> route through [slug]
                                    return (
                                      <li key={topicKey} className="al-topic">
                                        <Link 
                                          href={`/${topicSlug}`} 
                                          className="al-topic-row al-topic-link"
                                        >
                                          <span className="al-topic-text">
                                            {t.title}
                                            {t.isHandsOn && (
                                              <span className="al-badge">
                                                <FlaskIcon />
                                                Hands-on
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
          transition: box-shadow 220ms ease, transform 220ms ease;
        }

        .al-level[data-open="true"] {
          box-shadow: 0 10px 28px rgba(18, 20, 28, 0.08);
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

        .al-level-heading {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          min-width: 0;
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

        .al-module-heading {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          min-width: 0;
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

        .al-topic-plus {
          flex-shrink: 0;
          color: var(--ink-soft);
          font-size: 0.95rem;
        }

        .al-topic-note {
          padding: 0 0.25rem 0.75rem;
          font-size: 0.8rem;
          font-style: italic;
          color: var(--ink-soft);
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