"use client";

import { useState } from "react";
import Link from "next/link";

// -----------------------------------------------------------------------
// Curriculum data — everything lives in this one file.
// Add labPath to a topic to make it jump straight into a real lab page.
// Leave labPath out and clicking the topic just expands a "coming soon" note.
// -----------------------------------------------------------------------

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
        ],
      },
      {
        title: "Module 2: Machine Learning Without Math",
        topics: [
          { title: "What is Learning?" },
          { title: "How Machines Learn" },
          { title: "Training vs Testing" },
          { title: "Examples" },
        ],
      },
      {
        title: "Module 3: Computer Vision",
        topics: [
          { title: "Face Recognition" },
          { title: "Self-driving Cars" },
          { title: "Image Classification" },
          { title: "OCR" },
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
          { title: "Activation Functions", isHandsOn: true, labPath: "/activation-lab" },
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
          { title: "Activation Functions", labPath: "/activation-lab" },
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
// Page
// -----------------------------------------------------------------------

export default function Home() {
  const [openLevel, setOpenLevel] = useState<string | null>(curriculum[0]?.title ?? null);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">AI Labs</h1>
        <p className="text-center text-lg text-gray-500 mb-10">
          Pick a level, open a module, and jump straight into a topic or hands-on lab.
        </p>

        <div className="space-y-4">
          {curriculum.map((level) => {
            const levelOpen = openLevel === level.title;
            return (
              <div key={level.title} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => {
                    setOpenLevel(levelOpen ? null : level.title);
                    setOpenModule(null);
                    setOpenTopic(null);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-xl font-semibold">{level.title}</span>
                  <span className="text-gray-400">{levelOpen ? "−" : "+"}</span>
                </button>

                {levelOpen && (
                  <div className="divide-y">
                    {level.modules.map((mod) => {
                      const moduleKey = `${level.title}/${mod.title}`;
                      const moduleOpen = openModule === moduleKey;
                      return (
                        <div key={mod.title}>
                          <button
                            onClick={() => {
                              setOpenModule(moduleOpen ? null : moduleKey);
                              setOpenTopic(null);
                            }}
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="font-medium">{mod.title}</span>
                            <span className="text-gray-400">{moduleOpen ? "−" : "+"}</span>
                          </button>

                          {moduleOpen && (
                            <ul className="px-6 pb-4">
                              {mod.topics.length === 0 && (
                                <li className="py-2 text-sm text-gray-400 italic">
                                  Topics coming soon
                                </li>
                              )}
                              {mod.topics.map((t, i) => {
                                const topicKey = `${moduleKey}/${t.title}/${i}`;
                                const topicOpen = openTopic === topicKey;

                                // Real lab -> just a normal link, no extra page needed.
                                if (t.labPath) {
                                  return (
                                    <li key={topicKey}>
                                      <Link
                                        href={t.labPath}
                                        className="flex items-center justify-between py-2 text-sm hover:text-blue-600 group"
                                      >
                                        <span>
                                          {t.title}
                                          {t.isHandsOn && (
                                            <span className="ml-2 text-xs uppercase tracking-wide text-emerald-600 font-semibold">
                                              Hands-on
                                            </span>
                                          )}
                                        </span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                          →
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                }

                                // No lab yet -> expand inline instead of navigating anywhere.
                                return (
                                  <li key={topicKey}>
                                    <button
                                      onClick={() => setOpenTopic(topicOpen ? null : topicKey)}
                                      className="w-full flex items-center justify-between py-2 text-sm text-left hover:text-blue-600"
                                    >
                                      <span>
                                        {t.title}
                                        {t.isHandsOn && (
                                          <span className="ml-2 text-xs uppercase tracking-wide text-emerald-600 font-semibold">
                                            Hands-on
                                          </span>
                                        )}
                                      </span>
                                      <span className="text-gray-300">{topicOpen ? "−" : "+"}</span>
                                    </button>
                                    {topicOpen && (
                                      <p className="pb-2 pl-1 text-xs text-gray-400 italic">
                                        Lesson content coming soon.
                                      </p>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}