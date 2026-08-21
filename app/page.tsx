"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";

import "./globals.css";
interface Topic {
  title: string;
  isHandsOn?: boolean;
  labPath?: string;
}

interface Module {
  title: string;
  topics: Topic[];
  videoUrl?: string; // NEW: video for the module
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
        videoUrl: "/videos/l1m1.mp4",
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
        videoUrl: "/videos/l1m2.mp4",
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
        videoUrl: "/videos/l1m3.mp4",
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
        videoUrl: "/videos/l1m4.mp4",
        topics: [
          { title: "LLMs" },
          { title: "Prompt Engineering" },
          { title: "AI Assistants" },
          { title: "AI Ethics" },
          {
            title: "ChatGPT and Generative AI Lab",
            isHandsOn: true,
            labPath: "/chatgpt-and-genAI-lab"
          },
        ],
      },
      {
        title: "AI Explorer: Your First Mission!! ",
        videoUrl: "/videos/l1m5.mp4",
        topics: [{
          title: "Try It Yourself ",
          isHandsOn: true,
          labPath: "/mission-1"
        },]
      }
    ],
  },
  {
    title: "Level 2 - AI Foundations",
    modules: [
      {
        title: "Module 1: Python Basics",
        videoUrl: "/videos/l2m1.mp4",
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
        videoUrl: "/videos/l2m2.mp4",
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
        videoUrl: "/videos/l2m3.mp4",
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
        videoUrl: "/videos/l2m4.mp4",
        topics: [
          { title: "Neural Networks" },
          { title: "Biological Neuron" },
          { title: "Artificial Neuron" },
          { title: "Perceptron" },
          { title: "Need for Non-Linearity" },
          { title: "Activation Functions" },
          { title: "Layers" },
          { title: "Forward Propagation" },
          {
            title: "Neural Network Lab",
            isHandsOn: true,
            labPath: "/neural-network-lab",
          },
        ],
      },
      {
        title: "Module 5: Deep Learning",
        videoUrl: "/videos/l2m5.mp4",
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
      {
        title: "AI Foundations: Your Second Mission!! ",
        videoUrl: "/videos/l2m6.mp4",
        topics: [{
          title: "Try It Yourself (Mini Project1) ",
          isHandsOn: true,
          labPath: "/mission-2"
        },]
      }
    ],
  },
  {
    title: "Level 3 - AI Engineer",
    modules: [
      {
        title: "Module 1: Python Programming for AI",
        videoUrl: "/videos/l3m1.mp4",
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
          { title: "Python Playground", isHandsOn: true, labPath: "/python-playground" }
        ],
      },
      {
        title: "Module 2: Mathematics for AI",
        videoUrl: "/videos/l3m2.mp4",
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
          { title: "Maths for AI Lab", isHandsOn: true, labPath: "/math-ai" }
        ],
      },
      {
        title: "Module 3: Data Science Essentials",
        videoUrl: "/videos/l3m3.mp4",
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
          { title: "Analyze Real Datasets", isHandsOn: true, labPath: "/data-science-lab" },
        ],
      },
      {
        title: "Module 4: Machine Learning Fundamentals",
        videoUrl: "/videos/l3m4.mp4",
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
          { title: "Unsupervised Learning Simulator", isHandsOn: true, labPath: "/unsupervised-simulator" },
          { title: "Reinforcement Learning Lab", isHandsOn: true, labPath: "/rnn-lab" },
        ],
      },
      {
        title: "Module 5: Model Evaluation & Optimization",
        videoUrl: "/videos/l3m5.mp4",
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
        videoUrl: "/videos/l3m6.mp4",
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
          },
          { title: "DNN Lab", isHandsOn: true, labPath: "/dnn-lab" },
        ],
      },
      {
        title: "Module 7: Computer Vision",
        videoUrl: "/videos/l3m7.mp4",
        topics: [
          { title: "OpenCV" },
          { title: "Image Processing" },
          { title: "CNN-2" },
          { title: "Transfer Learning" },
          { title: "Object Detection" },
          { title: "Image Segmentation" },
          { title: "More on OCR" },
          { title: "YOLO" },
          { title: "CNN Lab", isHandsOn: true, labPath: "/cnn-lab" },
        ]
      },
      {
        title: "Module 8: Natural Language Processing",
        videoUrl: "/videos/l3m8.mp4",
        topics: [
          { title: "More on OpenCV" },
          { title: "Text Processing" },
          { title: "Tokenization" },
          { title: "Stemming" },
          { title: "Lemmatization" },
          { title: "Embeddings" },
          { title: "Word2Vec" },
          { title: "GloVe" },
          { title: "BERT" },
          { title: "Transformers" },
          {
            title: "Transformers Simulation Lab",
            isHandsOn: true,
            labPath: "/transformers-lab"
          }
        ]
      },
      {
        title: "Module 9: Generative AI & LLMs",
        videoUrl: "/videos/l3m9.mp4",
        topics: [
          { title: "Introduction to LLMs" },
          { title: "GPT Architecture" },
          { title: "More on Prompt Engineering" },
          { title: "LLM Embeddings" },
          { title: "Vector Databases" },
          { title: "Retrieval-Augmented Generation (RAG)" },
          { title: "Function Calling" },
          { title: "Context Windows" },
        ]
      },
      {
        title: "Module 10: AI Agents & Automation",
        videoUrl: "/videos/l3m10.mp4",
        topics: [
          { title: "AI Agents" },
          { title: "Tool Calling" },
          { title: "Memory Systems" },
          { title: "Multi-Agent Systems" },
          { title: "Embeddings" },
          { title: "LangChain" },
          { title: "CrewAI" },
          { title: "MCP Basics" },
        ]
      },
      {
        title: "Module 11: Model Deployment & MLOps",
        videoUrl: "/videos/l3m11.mp4",
        topics: [
          { title: "AI Agents" },
          { title: "FastAPI" },
          { title: "Docker" },
          { title: "Kubernetes" },
          { title: "MLflow" },
          { title: "CI/CD" },
          { title: "Monitoring" },
          { title: "Logging" },
          { title: "Model Serving" },
        ]
      },
      {
        title: "AI Engineer: Your Next Mission!! ",
        videoUrl: "/videos/l3m12.mp4",
        topics: [{
          title: "Try It Yourself (Mini Project 2) ",
          isHandsOn: true,
          labPath: "/mission-3"
        },],
      },
    ],
  },
  {
    title: "Level 4 - Advanced AI",
    modules: [
      {
        title: "Module 1: Advanced Mathematics for AI",
        videoUrl: "/videos/l4m1.mp4",
        topics: [
          { title: "Advanced Linear Algebra" },
          { title: "Matrix Decomposition" },
          { title: "Multivariable Calculus" },
          { title: "Convex Optimization" },
          { title: "Information Theory" },
          { title: "Numerical Optimization" },
        ]
      },
      {
        title: "Module 2: Deep Learning Theory",
        videoUrl: "/videos/l4m2.mp4",
        topics: [
          { title: "Computational Graphs" },
          { title: "Automatic Differentiation" },
          { title: "Gradient Flow" },
          { title: "Vanishing/Exploding Gradients" },
          { title: "Residual Networks" },
          { title: "Advanced Optimizers" },
          { title: "Learning Rate Scheduling" },
        ]
      },
      {
        title: "Module 3: Transformer Architecture",
        videoUrl: "/videos/l4m3.mp4",
        topics: [
          { title: "Self-Attention" },
          { title: "Multi-Head Attention" },
          { title: "Positional Encoding" },
          { title: "Encoder" },
          { title: "Decoder" },
          { title: "Cross Attention" },
          { title: "Feed Forward Networks" },
          { title: "Layer Normalization" },
        ]
      },
      {
        title: "Module 4: Large Language Models",
        videoUrl: "/videos/l4m4.mp4",
        topics: [
          { title: "GPT" },
          { title: "BERT" },
          { title: "LLaMA" },
          { title: "Mistral" },
          { title: "Gemma" },
          { title: "Tokenizers" },
          { title: "Scaling Laws" },
          { title: "Inference Optimization" },
        ]
      },
      {
        title: "Module 5: LLM Fine-Tuning",
        videoUrl: "/videos/l4m5.mp4",
        topics: [
          { title: "Fine-Tuning" },
          { title: "LoRA" },
          { title: "QLoRA" },
          { title: "PEFT" },
          { title: "RLHF" },
          { title: "DPO" },
          { title: "Model Distillation" },
          { title: "Quantization" },
        ]
      },
      {
        title: "Module 6: Retrieval-Augmented Generation (RAG)",
        videoUrl: "/videos/l4m6.mp4",
        topics: [
          { title: "Fine-Tuning" },
          { title: "Embeddings" },
          { title: "Chunking" },
          { title: "Retrieval Strategies" },
          { title: "Hybrid Search" },
          { title: "Vector Databases" },
          { title: "Knowledge Graphs" },
          { title: "Reranking" },
          { title: "Evaluation" },
        ]
      },
      {
        title: "Module 7: AI Agents & Autonomous Systems",
        videoUrl: "/videos/l4m7.mp4",
        topics: [
          { title: "Planning" },
          { title: "Reasoning" },
          { title: "Reflection" },
          { title: "Memory Architectures" },
          { title: "Agent Communication" },
          { title: "Multi-Agent Collaboration" },
          { title: "Tool Use" },
          { title: "Agent Evaluation" },
        ]
      },
      {
        title: "Module 8: Multimodal AI",
        videoUrl: "/videos/l4m8.mp4",
        topics: [
          { title: "Planning" },
          { title: "Vision Transformers" },
          { title: "Vision-Language Models" },
          { title: "Image Generation" },
          { title: "Speech Models" },
          { title: "Audio Understanding" },
          { title: "Video Understanding" },
        ]
      },
      {
        title: "Module 9: AI Infrastructure",
        videoUrl: "/videos/l4m9.mp4",
        topics: [
          { title: "GPU Programming" },
          { title: "CUDA Basics" },
          { title: "Distributed Training" },
          { title: "Parallel Processing" },
          { title: "Ray" },
          { title: "DeepSpeed" },
          { title: "Tensor Parallelism" },
          { title: "Pipeline Parallelism" },
        ]
      },
      {
        title: "Module 10: AI Security & Responsible AI",
        videoUrl: "/videos/l4m10.mp4",
        topics: [
          { title: "AI Ethics" },
          { title: "Explainable AI (XAI)" },
          { title: "Adversarial Attacks" },
          { title: "AI Safety" },
          { title: "Bias Detection" },
          { title: "Privacy" },
          { title: "Governance" },
        ]
      },
      {
        title: "Advanced AI : Your Last Mission!! ",
        videoUrl: "/videos/l4m11.mp4",
        topics: [{
          title: "Try It Yourself (Major Project) ",
          isHandsOn: true,
          labPath: "/level4"
        },],
      },
    ],
  },
];

const levelThemes = [
  { accent: "#2D7DD2", name: "Explorer" },
  { accent: "#12A594", name: "Foundations" },
  { accent: "#7C5CFC", name: "Engineer" },
  { accent: "#E8590C", name: "Advanced" },
];

// -----------------------------------------------------------------------
// Progression system — topic → module → level, all sequential.
// -----------------------------------------------------------------------

export const PROGRESS_STORAGE_KEY = "ai-labs-completed-topics-v2";

export const ACTIVE_LEVEL_STORAGE_KEY = "ai-labs-active-level-v1";
export const ACTIVE_MODULE_STORAGE_KEY = "ai-labs-active-module-v1";

export const PENDING_SYNC_STORAGE_KEY = "ai-labs-pending-sync-v1";
export const RESET_AT_STORAGE_KEY = "ai-labs-reset-at-v1";
const LOGIN_STORAGE_KEY = "teachly-ai-is-logged-in";
const LOGIN_TOKEN_KEY = "teachly-ai-token";
const LOGIN_COOKIE = "teachly_ai_logged_in";
const TOKEN_COOKIE = "teachly_ai_token";

function getBackendUrl(path: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_PROGRESS_API_URL ??
    process.env.NEXT_PUBLIC_LOGIN_API_URL ??
    "";

  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

interface ServerProgressResponse {
  completedTopics?: unknown;
  updatedAt?: unknown;
}

function readTopicKeysFromApi(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (key): key is string => typeof key === "string" && key.trim().length > 0,
  );
}

function formatLastSubmittedAt(value: string | null): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getCookieValue(name: string) {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

function hasLoginCookie() {
  return getCookieValue(LOGIN_COOKIE) === "true";
}

function hasStoredAuth() {
  return hasLoginCookie() && Boolean(getCookieValue(TOKEN_COOKIE));
}

function clearSavedLogin() {
  try {
    window.localStorage.removeItem(LOGIN_STORAGE_KEY);
    window.localStorage.removeItem(LOGIN_TOKEN_KEY);
    window.localStorage.removeItem("teachly-ai-user");
    clearLocalProgressState();
  } catch {
    // ignore storage failures
  }
}

function readStringArrayFromStorage(key: string): string[] {
  const stored = window.localStorage.getItem(key);
  if (!stored) return [];

  const parsed = JSON.parse(stored);
  return Array.isArray(parsed)
    ? parsed.filter((value): value is string => typeof value === "string")
    : [];
}

function readLocalProgressCache(): Set<string> {
  try {
    return new Set(readStringArrayFromStorage(PROGRESS_STORAGE_KEY));
  } catch {
    return new Set();
  }
}

function writeLocalProgressCache(topics: Set<string>): void {
  window.localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify(Array.from(topics)),
  );
}

function clearLocalProgressState(): void {
  window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  window.localStorage.removeItem(ACTIVE_LEVEL_STORAGE_KEY);
  window.localStorage.removeItem(ACTIVE_MODULE_STORAGE_KEY);
  window.localStorage.removeItem(PENDING_SYNC_STORAGE_KEY);
  window.localStorage.removeItem(RESET_AT_STORAGE_KEY);
}

function queueTopicForSync(key: string): void {
  try {
    const pending = new Set(readStringArrayFromStorage(PENDING_SYNC_STORAGE_KEY));
    pending.add(key);
    window.localStorage.setItem(
      PENDING_SYNC_STORAGE_KEY,
      JSON.stringify(Array.from(pending)),
    );
  } catch {
    // ignore queue failures; local completion still succeeds
  }
}

async function flushPendingProgress(): Promise<void> {
  try {
    const pending = readStringArrayFromStorage(PENDING_SYNC_STORAGE_KEY);
    if (pending.length === 0) return;

    const token = getCookieValue(TOKEN_COOKIE) ?? window.localStorage.getItem(LOGIN_TOKEN_KEY);
    if (!token) return;

    const response = await fetch(getBackendUrl("/progress/complete"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topicKeys: pending }),
    });

    if (response.ok) {
      window.localStorage.removeItem(PENDING_SYNC_STORAGE_KEY);
    }
  } catch {
    // keep pending topics queued for a later attempt
  }
}

async function fetchServerProgress(): Promise<{
  completedTopics: string[];
  updatedAt: string | null;
} | null> {
  try {
    const token = getCookieValue(TOKEN_COOKIE) ?? window.localStorage.getItem(LOGIN_TOKEN_KEY);
    if (!token) return null;

    const response = await fetch(getBackendUrl("/progress"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json().catch(() => null)) as ServerProgressResponse | null;
    if (!response.ok || !data) return null;

    const completedTopics = readTopicKeysFromApi(data.completedTopics);
    return {
      completedTopics,
      updatedAt:
        completedTopics.length > 0 && typeof data.updatedAt === "string"
          ? data.updatedAt
          : null,
    };
  } catch {
    return null;
  }
}

export function topicKey(levelIndex: number, moduleIndex: number, topicIndex: number) {
  return `${levelIndex}:${moduleIndex}:${topicIndex}`;
}

// NEW helper — lets the topic page figure out "where am I in the curriculum"
export function findTopicLocation(slug: string) {
  for (let levelIndex = 0; levelIndex < curriculum.length; levelIndex++) {
    const modules = curriculum[levelIndex].modules;
    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
      const topics = modules[moduleIndex].topics;
      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        if (resolveTopicPath(topics[topicIndex]) === `/${slug}`) {
          return { levelIndex, moduleIndex, topicIndex };
        }
      }
    }
  }
  return null;
}

function buildModuleKey(levelIndex: number, moduleIndex: number): string | null {
  const level = curriculum[levelIndex];
  const mod = level?.modules[moduleIndex];
  if (!level || !mod) return null;
  return `${level.title}/${mod.title}`;
}

function setActiveLocation(
  levelIndex: number,
  moduleIndex: number,
  topicIndex: number,
): void {
  try {
    const level = curriculum[levelIndex];
    const mod = level?.modules[moduleIndex];
    if (!level || !mod) return;

    window.localStorage.setItem(ACTIVE_LEVEL_STORAGE_KEY, level.title);

    const isLastTopicInModule = topicIndex === mod.topics.length - 1;
    const nextModuleExists = moduleIndex + 1 < level.modules.length;

    const targetModuleKey =
      isLastTopicInModule && nextModuleExists
        ? buildModuleKey(levelIndex, moduleIndex + 1)
        : buildModuleKey(levelIndex, moduleIndex);

    if (targetModuleKey) {
      window.localStorage.setItem(ACTIVE_MODULE_STORAGE_KEY, targetModuleKey);
    }
  } catch {
    // ignore storage errors — active-location tracking is best-effort
  }
}

export function markLabTopicComplete(slug: string): void {
  try {
    const location = findTopicLocation(slug);
    if (!location) return;

    const key = topicKey(
      location.levelIndex,
      location.moduleIndex,
      location.topicIndex,
    );

    const localTopics = readLocalProgressCache();
    if (!localTopics.has(key)) {
      localTopics.add(key);
      writeLocalProgressCache(localTopics);
    }

    setActiveLocation(
      location.levelIndex,
      location.moduleIndex,
      location.topicIndex,
    );

    queueTopicForSync(key);
    void flushPendingProgress();
  } catch {
    // ignore storage errors — don't block navigation over a progress-save failure
  }
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

function VideoIcon() {
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
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function VideoModal({
  videoUrl,
  onClose,
  moduleName,
}: {
  videoUrl: string;
  onClose: () => void;
  moduleName: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "90%",
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
            {moduleName}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            position: "relative",
            minHeight: "500px",
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            controls
            autoPlay
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

// NEW: Toast for "video not uploaded" / error feedback
function VideoToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1e293b",
        color: "#fff",
        padding: "0.75rem 1.25rem",
        borderRadius: "10px",
        fontWeight: 700,
        fontSize: "0.85rem",
        zIndex: 1100,
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        cursor: "pointer",
      }}
    >
      {message}
    </div>
  );
}

// -----------------------------------------------------------------------
// Progress tracker widget
// -----------------------------------------------------------------------

interface LevelProgressInfo {
  title: string;
  shortLabel: string;
  accent: string;
  themeName: string;
  completed: number;
  total: number;
  locked: boolean;
  isCurrent: boolean;
  completedBadge: boolean;
}

function ProgressTrackerWidget({
  overallCompleted,
  overallTotal,
  levels,
  onLevelClick,
  nextTopic,
  onContinueClick,
  lastSubmittedAt,
}: {
  overallCompleted: number;
  overallTotal: number;
  levels: LevelProgressInfo[];
  onLevelClick: (levelIndex: number) => void;
  nextTopic: {
    levelShortLabel: string;
    levelTitle: string;
    moduleTitle: string;
    topicTitle: string;
    accent: string;
  } | null;
  onContinueClick: () => void;
  lastSubmittedAt: string | null;
}) {
  const overallPercent =
    overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        borderRadius: "16px",
        padding: "1.25rem 1.5rem 1.5rem",
        marginBottom: "1.75rem",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "0.6rem",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }}>
          Your Progress
        </span>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
          {overallCompleted} / {overallTotal} topics
          <span style={{ color: "#0f172a", marginLeft: "0.4rem" }}>
            · {overallPercent}%
          </span>
        </span>
      </div>

      {lastSubmittedAt && (
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#64748b",
            marginBottom: "0.75rem",
          }}
        >
          Last submitted: {lastSubmittedAt}
        </div>
      )}

      <div
        style={{
          width: "100%",
          height: "10px",
          borderRadius: "999px",
          background: "rgba(15, 23, 42, 0.08)",
          overflow: "hidden",
          marginBottom: "1.1rem",
        }}
      >
        <div
          style={{
            width: `${overallPercent}%`,
            height: "100%",
            borderRadius: "999px",
            background:
              "linear-gradient(90deg, #2D7DD2, #12A594, #7C5CFC, #E8590C)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {nextTopic ? (
        <button
          onClick={onContinueClick}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            textAlign: "left",
            cursor: "pointer",
            background: `${nextTopic.accent}14`,
            border: `1px solid ${nextTopic.accent}55`,
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            marginBottom: "1.1rem",
            font: "inherit",
          }}
        >
          <span style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                color: nextTopic.accent,
              }}
            >
              CONTINUE · {nextTopic.levelShortLabel} · {nextTopic.moduleTitle}
            </span>
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
              {nextTopic.topicTitle}
            </span>
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              borderRadius: "999px",
              background: nextTopic.accent,
              color: "#ffffff",
              flexShrink: 0,
            }}
          >
            <ArrowIcon />
          </span>
        </button>
      ) : (
        <div
          style={{
            background: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            marginBottom: "1.1rem",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#15803d",
          }}
        >
          🎉 All topics completed — nice work!
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {levels.map((level, levelIndex) => {
          const percent =
            level.total > 0
              ? Math.round((level.completed / level.total) * 100)
              : 0;

          return (
            <button
              key={level.title}
              onClick={() => onLevelClick(levelIndex)}
              disabled={level.locked}
              style={{
                textAlign: "left",
                cursor: level.locked ? "not-allowed" : "pointer",
                background: level.completedBadge
                  ? "rgba(34, 197, 94, 0.08)"
                  : level.isCurrent
                    ? "rgba(15, 23, 42, 0.035)"
                    : "transparent",
                border: level.completedBadge
                  ? "1px solid rgba(34, 197, 94, 0.4)"
                  : level.isCurrent
                    ? `1px solid ${level.accent}55`
                    : "1px solid rgba(15, 23, 42, 0.08)",
                borderRadius: "12px",
                padding: "0.65rem 0.75rem",
                opacity: level.locked ? 0.55 : 1,
                font: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.35rem",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: level.accent,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {level.shortLabel}
                </span>
                {level.locked && (
                  <LockIcon />
                )}
                {!level.locked && level.completedBadge && (
                  <span style={{ color: "#15803d", display: "flex" }}>
                    <CheckIcon />
                  </span>
                )}
                {!level.locked && level.isCurrent && !level.completedBadge && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      color: level.accent,
                      letterSpacing: "0.02em",
                    }}
                  >
                    IN PROGRESS
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: "0.35rem",
                }}
              >
                {level.themeName} · {level.completed}/{level.total}
              </div>

              <div
                style={{
                  width: "100%",
                  height: "6px",
                  borderRadius: "999px",
                  background: "rgba(15, 23, 42, 0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    borderRadius: "999px",
                    background: level.completedBadge ? "#22c55e" : level.accent,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TutorialContent {
  title: string;
  description: string;
  chapters: unknown[];
  videoUrl: string | null;
  videoFileName: string | null;
  thumbnailUrl: string | null;
  thumbnailFileName: string | null;
}

interface Tutorial {
  id: string;
  slug: string;
  classLevel: string;
  subjectId: string;
  subjectName: string;
  pricing: string;
  order: number;
  status: string;
  languages: string[];
  content: Record<string, TutorialContent>; // keyed by language, e.g. "english"
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------
// Fetch a single tutorial by title. Title is cleaned + encoded before
// being placed in the URL. Returns null (never throws to the caller of
// the click handler — errors are caught there) when nothing is found.
// -----------------------------------------------------------------------
async function fetchTutorialByTitle(params: {
  title: string;
  classLevel: string;
}): Promise<Tutorial | null> {
  const { title, classLevel } = params;

  let userEmail: string | undefined;
  try {
    const raw = window.localStorage.getItem("teachly-ai-user");
    userEmail = raw ? JSON.parse(raw)?.email : undefined;
  } catch {
    userEmail = undefined;
  }

  const encrypted_email_id = userEmail ? btoa(userEmail) : undefined;

  const query = new URLSearchParams({
    classLevel,
    status: "published",
    ...(encrypted_email_id ? { encrypted_email_id } : {}),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOGIN_API_URL}/tutorial/title/${encodeURIComponent(title)}?${query.toString()}`
  );

  if (!res.ok) {
    throw new Error(`Tutorial API failed: ${res.status}`);
  }

  const data = await res.json();
  // API returns the tutorial object directly (ok, id, slug, content, ...)
  // — not wrapped in a `.tutorial` field. Guard for both shapes just in case.
  if (data?.content) return data as Tutorial;
  if (data?.tutorial) return data.tutorial as Tutorial;
  return null;
}

function stripModulePrefix(title: string): string {
  return title.replace(/^Module\s+\d+:\s*/i, "").trim();
}

export default function Home() {
  const router = useRouter();
  const [openLevel, setOpenLevel] = useState<string | null>(null);
  const [openModule, setOpenModule] = useState<string | null>(null);

  const [selectedVideo, setSelectedVideo] = useState<{ url: string; moduleName: string } | null>(null);
  const [videoLoadingKey, setVideoLoadingKey] = useState<string | null>(null);
  const [videoToast, setVideoToast] = useState<string | null>(null);

  const levelRefs = useRef<Record<string, HTMLElement | null>>({});
  const topicRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    () => new Set(),
  );
  const [lastSubmittedAt, setLastSubmittedAt] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    try {
      if (!hasStoredAuth()) {
        clearSavedLogin();
        router.replace("/login");
        return;
      }

      window.localStorage.setItem(LOGIN_STORAGE_KEY, "true");

      const cookieToken = getCookieValue(TOKEN_COOKIE);
      if (cookieToken) {
        window.localStorage.setItem(LOGIN_TOKEN_KEY, cookieToken);
      }

      const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTimeout(() => setCompletedTopics(new Set(parsed)), 0);
        }
      }
    } catch {
      clearSavedLogin();
      router.replace("/login");
      return;
    } finally {
      setHydrated(true);
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    let cancelled = false;

    async function loadServerProgress() {
      await flushPendingProgress();
      const serverProgress = await fetchServerProgress();
      if (cancelled || !serverProgress) return;

      setCompletedTopics(new Set(serverProgress.completedTopics));
      setLastSubmittedAt(serverProgress.updatedAt);
    }

    void loadServerProgress();

    return () => {
      cancelled = true;
    };
  }, [authChecked]);

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

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (openLevel) {
        window.localStorage.setItem(ACTIVE_LEVEL_STORAGE_KEY, openLevel);
      } else {
        window.localStorage.removeItem(ACTIVE_LEVEL_STORAGE_KEY);
      }
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [openLevel, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (openModule) {
        window.localStorage.setItem(ACTIVE_MODULE_STORAGE_KEY, openModule);
      } else {
        window.localStorage.removeItem(ACTIVE_MODULE_STORAGE_KEY);
      }
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [openModule, hydrated]);

  useEffect(() => {
    if (!authChecked) return;

    function syncLogoutAcrossLocalhostApps() {
      if (hasLoginCookie()) return;

      clearSavedLogin();
      router.replace("/login");
    }

    const intervalId = window.setInterval(syncLogoutAcrossLocalhostApps, 1500);
    window.addEventListener("focus", syncLogoutAcrossLocalhostApps);
    document.addEventListener("visibilitychange", syncLogoutAcrossLocalhostApps);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", syncLogoutAcrossLocalhostApps);
      document.removeEventListener(
        "visibilitychange",
        syncLogoutAcrossLocalhostApps,
      );
    };
  }, [authChecked, router]);

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

    const level = curriculum[levelIndex];
    const mod = level?.modules[moduleIndex];
    if (!level || !mod) return;

    setOpenLevel(level.title);

    const isLastTopicInModule = topicIndex === mod.topics.length - 1;
    const nextModule = level.modules[moduleIndex + 1];

    if (isLastTopicInModule && nextModule) {
      setOpenModule(`${level.title}/${nextModule.title}`);
    } else {
      setOpenModule(`${level.title}/${mod.title}`);
    }
  }

  function getLevelProgress(levelIndex: number): {
    completed: number;
    total: number;
  } {
    let total = 0;
    let completed = 0;
    curriculum[levelIndex].modules.forEach((mod, moduleIndex) => {
      mod.topics.forEach((_, topicIndex) => {
        total += 1;
        if (completedTopics.has(topicKey(levelIndex, moduleIndex, topicIndex))) {
          completed += 1;
        }
      });
    });
    return { completed, total };
  }

  function getOverallProgress(): { completed: number; total: number } {
    return curriculum.reduce(
      (acc, _, levelIndex) => {
        const { completed, total } = getLevelProgress(levelIndex);
        return { completed: acc.completed + completed, total: acc.total + total };
      },
      { completed: 0, total: 0 },
    );
  }

  function getNextTopicLocation(): {
    levelIndex: number;
    moduleIndex: number;
    topicIndex: number;
    levelTitle: string;
    moduleTitle: string;
    topicTitle: string;
  } | null {
    for (let levelIndex = 0; levelIndex < curriculum.length; levelIndex++) {
      const level = curriculum[levelIndex];
      for (let moduleIndex = 0; moduleIndex < level.modules.length; moduleIndex++) {
        const mod = level.modules[moduleIndex];
        for (let topicIndex = 0; topicIndex < mod.topics.length; topicIndex++) {
          const isDone = completedTopics.has(
            topicKey(levelIndex, moduleIndex, topicIndex),
          );
          if (isDone) continue;
          if (!isTopicUnlocked(levelIndex, moduleIndex, topicIndex)) return null;
          return {
            levelIndex,
            moduleIndex,
            topicIndex,
            levelTitle: level.title,
            moduleTitle: mod.title,
            topicTitle: mod.topics[topicIndex].title,
          };
        }
      }
    }
    return null;
  }

  function goToLevel(levelIndex: number) {
    if (!isLevelUnlocked(levelIndex)) return;
    const level = curriculum[levelIndex];
    setOpenLevel(level.title);

    const firstIncompleteModuleIndex = level.modules.findIndex(
      (_, mi) => !isModuleCompleted(levelIndex, mi),
    );
    const moduleIndexToOpen =
      firstIncompleteModuleIndex === -1 ? 0 : firstIncompleteModuleIndex;

    if (isModuleUnlocked(levelIndex, moduleIndexToOpen)) {
      const targetModule = level.modules[moduleIndexToOpen];
      if (targetModule) {
        setOpenModule(`${level.title}/${targetModule.title}`);
      }
    }

    requestAnimationFrame(() => {
      levelRefs.current[level.title]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

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

  // Handles the "Watch Video" click for a given level/module.
  async function handleWatchVideo(level: Level, mod: Module) {
    const moduleKeyStr = `${level.title}/${mod.title}`;
    const cleanTitle = stripModulePrefix(mod.title);

    setVideoLoadingKey(moduleKeyStr);
    setVideoToast(null);

    try {
      const tutorial = await fetchTutorialByTitle({
        title: cleanTitle,
        classLevel: level.title,
      });

      const englishContent = tutorial?.content?.english;

      if (englishContent?.videoUrl) {
        // API returned a tutorial with a real video — show it.
        setSelectedVideo({
          url: englishContent.videoUrl,
          moduleName: stripModulePrefix(englishContent.title),
        });
      } else {
        // API responded but no video attached to this tutorial yet.
        setVideoToast("The video is coming soon. In the meantime, Please continue with the theoretical study materials.");
      }
    } catch (err) {
      console.error("Failed to fetch tutorial video from API:", err);
      setVideoToast("The video is coming soon. In the meantime, Please continue with the theoretical study materials.");
    } finally {
      setVideoLoadingKey(null);
    }
  }

  if (!authChecked) {
    return (
      <main
        style={{
          minHeight: "calc(100vh - 6px)",
          display: "grid",
          placeItems: "center",
          color: "#4b5563",
          fontWeight: 800,
        }}
      >
        Loading your lab...
      </main>
    );
  }

  const overallProgress = getOverallProgress();
  const nextTopicLocation = getNextTopicLocation();
  const levelsProgressInfo: LevelProgressInfo[] = curriculum.map(
    (level, levelIndex) => {
      const theme = levelThemes[levelIndex] ?? levelThemes[0];
      const { completed, total } = getLevelProgress(levelIndex);
      return {
        title: level.title,
        shortLabel: `L${levelIndex + 1}`,
        accent: theme.accent,
        themeName: theme.name,
        completed,
        total,
        locked: !isLevelUnlocked(levelIndex),
        isCurrent: openLevel === level.title,
        completedBadge: levelEarnsCompleteBadge(levelIndex),
      };
    },
  );

  function goToNextTopic() {
    if (!nextTopicLocation) return;
    const level = curriculum[nextTopicLocation.levelIndex];
    const mod = level.modules[nextTopicLocation.moduleIndex];
    setOpenLevel(level.title);
    setOpenModule(`${level.title}/${mod.title}`);

    requestAnimationFrame(() => {
      const topicKeyStr = `${level.title}/${mod.title}/${nextTopicLocation.topicTitle}/${nextTopicLocation.topicIndex}`;
      const topicEl = topicRefs.current[topicKeyStr];
      if (topicEl) {
        topicEl.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        levelRefs.current[level.title]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
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

        <ProgressTrackerWidget
          overallCompleted={overallProgress.completed}
          overallTotal={overallProgress.total}
          levels={levelsProgressInfo}
          onLevelClick={goToLevel}
          nextTopic={
            nextTopicLocation
              ? {
                levelShortLabel: `L${nextTopicLocation.levelIndex + 1}`,
                levelTitle: nextTopicLocation.levelTitle,
                moduleTitle: nextTopicLocation.moduleTitle,
                topicTitle: nextTopicLocation.topicTitle,
                accent:
                  (levelThemes[nextTopicLocation.levelIndex] ?? levelThemes[0])
                    .accent,
              }
              : null
          }
          onContinueClick={goToNextTopic}
          lastSubmittedAt={formatLastSubmittedAt(lastSubmittedAt)}
        />

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
                ref={(el) => {
                  levelRefs.current[level.title] = el;
                }}
                className="al-level"
                style={
                  levelCompleted
                    ? ({
                      ...accentStyle,
                      background: "white",
                      border: "1px solid rgba(34, 197, 94, 0.35)",
                      borderRadius: "16px",
                    } as CSSProperties)
                    : accentStyle
                }
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
                        const isVideoLoading = videoLoadingKey === moduleKey;

                        return (
                          <div
                            key={mod.title}
                            className="al-module"
                            data-locked={moduleLocked}
                            style={
                              moduleCompleted && mod.topics.length > 0
                                ? {
                                  background: "white",
                                  border: "1px solid rgba(34, 197, 94, 0.3)",
                                  borderRadius: "12px",
                                }
                                : undefined
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "stretch",
                                gap: "0.5rem",
                              }}
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
                                style={{ flex: 1, minWidth: 0 }}
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

                              {mod.videoUrl && !moduleLocked && (
                                <button
                                  onClick={() => handleWatchVideo(level, mod)}
                                  title="Watch video"
                                  disabled={isVideoLoading}
                                  style={{
                                    flexShrink: 0,
                                    alignSelf: "center",
                                    margin: "7px",
                                    padding: "0.55rem 0.9rem",
                                    background: `${theme.accent}14`,
                                    border: `1px solid ${theme.accent}55`,
                                    borderRadius: "8px",
                                    color: theme.accent,
                                    fontWeight: 700,
                                    fontSize: "0.8rem",
                                    cursor: isVideoLoading ? "wait" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.4rem",
                                    whiteSpace: "nowrap",
                                    transition: "all 0.2s ease",
                                    opacity: isVideoLoading ? 0.6 : 1,
                                  }}
                                  onMouseEnter={(e) => {
                                    if (isVideoLoading) return;
                                    e.currentTarget.style.background = `${theme.accent}25`;
                                    e.currentTarget.style.borderColor = `${theme.accent}88`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = `${theme.accent}14`;
                                    e.currentTarget.style.borderColor = `${theme.accent}55`;
                                  }}
                                >
                                  <VideoIcon />
                                  {isVideoLoading ? "Loading..." : "Watch Video"}
                                </button>
                              )}
                            </div>

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
                                    const isNextTopic =
                                      nextTopicLocation !== null &&
                                      nextTopicLocation.levelIndex === levelIndex &&
                                      nextTopicLocation.moduleIndex === modIndex &&
                                      nextTopicLocation.topicIndex === i;
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
                                        ref={(el) => {
                                          topicRefs.current[topicKeyStr] = el;
                                        }}
                                      >
                                        <Link
                                          href={href}
                                          className="al-topic-row al-topic-link"
                                          style={
                                            tCompleted
                                              ? {
                                                background: "rgba(34, 197, 94, 0.08)",
                                                border: "1px solid rgba(34, 197, 94, 0.35)",
                                                borderRadius: "10px",
                                              }
                                              : isNextTopic
                                                ? {
                                                  background: `${(levelThemes[levelIndex] ?? levelThemes[0]).accent}14`,
                                                  border: `1px solid ${(levelThemes[levelIndex] ?? levelThemes[0]).accent}66`,
                                                  borderRadius: "10px",
                                                }
                                                : undefined
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
                                            {isNextTopic && !tCompleted && (
                                              <span
                                                className="al-status-badge"
                                                style={{
                                                  background: `${(levelThemes[levelIndex] ?? levelThemes[0]).accent}22`,
                                                  color: (levelThemes[levelIndex] ?? levelThemes[0]).accent,
                                                }}
                                              >
                                                Continue here
                                              </span>
                                            )}
                                          </span>
                                          <ArrowIcon />
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>                              </div>
                            </div>           </div>
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

      {selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo.url}
          moduleName={selectedVideo.moduleName}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {videoToast && (
        <VideoToast message={videoToast} onClose={() => setVideoToast(null)} />
      )}
    </div>
  );
}