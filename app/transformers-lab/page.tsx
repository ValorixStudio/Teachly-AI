"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";


type Vec = number[];
type Mat = number[][];

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(rng: () => number): number {
  // Box-Muller transform
  let u = 0,
    v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function xavierMatrix(rows: number, cols: number, rng: () => number): Mat {
  const scale = Math.sqrt(2 / (rows + cols));
  const m: Mat = [];
  for (let i = 0; i < rows; i++) {
    const row: Vec = [];
    for (let j = 0; j < cols; j++) row.push(randn(rng) * scale);
    m.push(row);
  }
  return m;
}

function zerosVec(n: number): Vec {
  return new Array(n).fill(0);
}

function matmul(a: Mat, b: Mat): Mat {
  const rows = a.length,
    inner = b.length,
    cols = b[0]?.length ?? 0;
  const out: Mat = [];
  for (let i = 0; i < rows; i++) {
    const row: Vec = new Array(cols).fill(0);
    for (let k = 0; k < inner; k++) {
      const aik = a[i][k];
      if (aik === 0) continue;
      const brow = b[k];
      for (let j = 0; j < cols; j++) row[j] += aik * brow[j];
    }
    out.push(row);
  }
  return out;
}

function transpose(a: Mat): Mat {
  if (a.length === 0) return [];
  const rows = a.length,
    cols = a[0].length;
  const out: Mat = [];
  for (let j = 0; j < cols; j++) {
    const row: Vec = [];
    for (let i = 0; i < rows; i++) row.push(a[i][j]);
    out.push(row);
  }
  return out;
}

function addMat(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

function addBiasRow(a: Mat, bias: Vec): Mat {
  return a.map((row) => row.map((v, j) => v + bias[j]));
}

function scaleMat(a: Mat, s: number): Mat {
  return a.map((row) => row.map((v) => v * s));
}

function softmaxVec(row: Vec): Vec {
  const max = Math.max(...row);
  const exps = row.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((v) => v / sum);
}

function layerNormRow(row: Vec, eps = 1e-5): Vec {
  const mean = row.reduce((a, b) => a + b, 0) / row.length;
  const variance = row.reduce((a, b) => a + (b - mean) ** 2, 0) / row.length;
  const denom = Math.sqrt(variance + eps);
  return row.map((v) => (v - mean) / denom);
}

function layerNorm(mat: Mat): Mat {
  return mat.map((row) => layerNormRow(row));
}

function relu(x: number): number {
  return Math.max(0, x);
}
function gelu(x: number): number {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
}
function applyActivation(mat: Mat, fn: "relu" | "gelu"): Mat {
  const f = fn === "relu" ? relu : gelu;
  return mat.map((row) => row.map(f));
}

function sinusoidalPE(seqLen: number, dModel: number): Mat {
  const pe: Mat = [];
  for (let pos = 0; pos < seqLen; pos++) {
    const row: Vec = new Array(dModel).fill(0);
    for (let i = 0; i < dModel; i += 2) {
      const angle = pos / Math.pow(10000, i / dModel);
      row[i] = Math.sin(angle);
      if (i + 1 < dModel) row[i + 1] = Math.cos(angle);
    }
    pe.push(row);
  }
  return pe;
}

/** Split a (seqLen x dModel) matrix into `heads` matrices of (seqLen x headDim) */
function splitHeads(mat: Mat, heads: number): Mat[] {
  const headDim = mat[0].length / heads;
  const out: Mat[] = [];
  for (let h = 0; h < heads; h++) {
    out.push(mat.map((row) => row.slice(h * headDim, (h + 1) * headDim)));
  }
  return out;
}

function concatHeads(mats: Mat[]): Mat {
  const seqLen = mats[0].length;
  const out: Mat = [];
  for (let i = 0; i < seqLen; i++) {
    let row: Vec = [];
    for (const m of mats) row = row.concat(m[i]);
    out.push(row);
  }
  return out;
}

interface AttentionResult {
  Q: Mat;
  K: Mat;
  V: Mat;
  scores: Mat; // averaged across heads, for a single-head style demo
  weights: Mat; // softmax(scores) single-head demo
  headWeights: Mat[]; // per-head attention weight matrices
  output: Mat; // concat of heads projected back through Wo
}

function scaledDotProductAttention(Q: Mat, K: Mat, V: Mat): { weights: Mat; output: Mat; scores: Mat } {
  const dk = Q[0].length;
  const scores = matmul(Q, transpose(K)).map((row) => row.map((v) => v / Math.sqrt(dk)));
  const weights = scores.map((row) => softmaxVec(row));
  const output = matmul(weights, V);
  return { weights, output, scores };
}

function multiHeadAttention(
  X: Mat,
  Wq: Mat,
  Wk: Mat,
  Wv: Mat,
  Wo: Mat,
  heads: number
): AttentionResult {
  const Q = matmul(X, Wq);
  const K = matmul(X, Wk);
  const V = matmul(X, Wv);
  const Qh = splitHeads(Q, heads);
  const Kh = splitHeads(K, heads);
  const Vh = splitHeads(V, heads);
  const headWeights: Mat[] = [];
  const headOutputs: Mat[] = [];
  let scoresAvg: Mat | null = null;
  for (let h = 0; h < heads; h++) {
    const { weights, output, scores } = scaledDotProductAttention(Qh[h], Kh[h], Vh[h]);
    headWeights.push(weights);
    headOutputs.push(output);
    if (!scoresAvg) scoresAvg = scores.map((r) => [...r]);
    else scoresAvg = scoresAvg.map((r, i) => r.map((v, j) => v + scores[i][j]));
  }
  const concatenated = concatHeads(headOutputs);
  const output = matmul(concatenated, Wo);
  const scores = (scoresAvg as Mat).map((r) => r.map((v) => v / heads));
  const weights = scores.map((r) => softmaxVec(r));
  return { Q, K, V, scores, weights, headWeights, output };
}

interface LayerWeights {
  Wq: Mat;
  Wk: Mat;
  Wv: Mat;
  Wo: Mat;
  W1: Mat;
  b1: Vec;
  W2: Mat;
  b2: Vec;
}

interface LayerTrace {
  attn: AttentionResult;
  addNorm1: Mat;
  ffnHidden: Mat;
  ffnOut: Mat;
  addNorm2: Mat;
}

interface ForwardTrace {
  tokens: string[];
  ids: number[];
  vocab: string[];
  vocabIndex: Record<string, number>;
  embeddings: Mat;
  pe: Mat;
  embedPlusPE: Mat;
  layers: LayerTrace[];
  finalHidden: Mat;
  logits: Mat;
  probs: Mat;
  weightsPerLayer: LayerWeights[];
  embeddingMatrixSample: Mat; // small sample rows for visualization
  outputWeights: { Wout: Mat; bout: Vec };
}

const SPECIAL_TOKENS = ["[PAD]", "[UNK]", "[CLS]", "[SEP]"];

function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[a-z0-9']+|[.,!?;:]/g);
  return matches ?? [];
}

function buildVocab(tokens: string[]): { vocab: string[]; index: Record<string, number> } {
  const seen: string[] = [...SPECIAL_TOKENS];
  for (const t of tokens) if (!seen.includes(t)) seen.push(t);
  const index: Record<string, number> = {};
  seen.forEach((t, i) => (index[t] = i));
  return { vocab: seen, index };
}

interface HyperParams {
  embeddingSize: number;
  numHeads: number;
  numLayers: number;
  ffnDim: number;
  activation: "relu" | "gelu";
  dropout: number;
  learningRate: number;
  optimizer: "adam" | "sgd" | "rmsprop" | "adamw";
  seqLength: number;
}

const DEFAULT_HP: HyperParams = {
  embeddingSize: 32,
  numHeads: 4,
  numLayers: 3,
  ffnDim: 64,
  activation: "relu",
  dropout: 0.1,
  learningRate: 0.001,
  optimizer: "adam",
  seqLength: 8,
};

function computeForward(hp: HyperParams, text: string, seed: number): ForwardTrace {
  const rng = mulberry32(seed);
  const rawTokens = tokenize(text.trim().length ? text : "the cat sat on the mat");
  const { vocab, index } = buildVocab(rawTokens);
  let ids = rawTokens.map((t) => index[t] ?? index["[UNK]"]);
  // pad or truncate to seqLength
  const padId = index["[PAD]"];
  const tokensPadded = [...rawTokens];
  if (ids.length > hp.seqLength) {
    ids = ids.slice(0, hp.seqLength);
    tokensPadded.length = hp.seqLength;
  } else {
    while (ids.length < hp.seqLength) {
      ids.push(padId);
      tokensPadded.push("[PAD]");
    }
  }

  const d = hp.embeddingSize;
  const vocabSize = vocab.length;
  const embeddingMatrix = xavierMatrix(vocabSize, d, rng);
  const embeddings = ids.map((id) => embeddingMatrix[id]);
  const pe = sinusoidalPE(hp.seqLength, d);
  const embedPlusPE = addMat(embeddings, pe);

  const weightsPerLayer: LayerWeights[] = [];
  const layers: LayerTrace[] = [];
  let x = embedPlusPE;
  for (let l = 0; l < hp.numLayers; l++) {
    const Wq = xavierMatrix(d, d, rng);
    const Wk = xavierMatrix(d, d, rng);
    const Wv = xavierMatrix(d, d, rng);
    const Wo = xavierMatrix(d, d, rng);
    const W1 = xavierMatrix(d, hp.ffnDim, rng);
    const b1 = zerosVec(hp.ffnDim);
    const W2 = xavierMatrix(hp.ffnDim, d, rng);
    const b2 = zerosVec(d);
    weightsPerLayer.push({ Wq, Wk, Wv, Wo, W1, b1, W2, b2 });

    const attn = multiHeadAttention(x, Wq, Wk, Wv, Wo, hp.numHeads);
    const addNorm1 = layerNorm(addMat(x, attn.output));
    const hidden = applyActivation(addBiasRow(matmul(addNorm1, W1), b1), hp.activation);
    const ffnOut = addBiasRow(matmul(hidden, W2), b2);
    const addNorm2 = layerNorm(addMat(addNorm1, ffnOut));

    layers.push({ attn, addNorm1, ffnHidden: hidden, ffnOut, addNorm2 });
    x = addNorm2;
  }

  const finalHidden = x;
  const Wout = xavierMatrix(d, vocabSize, rng);
  const bout = zerosVec(vocabSize);
  const logits = addBiasRow(matmul(finalHidden, Wout), bout);
  const probs = logits.map((row) => softmaxVec(row));

  return {
    tokens: tokensPadded,
    ids,
    vocab,
    vocabIndex: index,
    embeddings,
    pe,
    embedPlusPE,
    layers,
    finalHidden,
    logits,
    probs,
    weightsPerLayer,
    embeddingMatrixSample: embeddingMatrix.slice(0, Math.min(8, embeddingMatrix.length)),
    outputWeights: { Wout, bout },
  };
}

/* ----------------------------------------------------------------------- */
/* Static Content: Stage metadata + Quizzes                                */
/* ----------------------------------------------------------------------- */

interface StageMeta {
  key: string;
  title: string;
  eyebrow: string;
  blurb: string;
}

const STAGE_META: StageMeta[] = [
  { key: "tokenizer", title: "Tokenizer", eyebrow: "Module 01", blurb: "Split raw text into discrete units the model can consume." },
  { key: "vocabulary", title: "Vocabulary", eyebrow: "Module 02", blurb: "Assign every unique token a stable integer ID." },
  { key: "embedding", title: "Embedding", eyebrow: "Module 03", blurb: "Map token IDs to dense vectors that encode meaning." },
  { key: "positional", title: "Positional Encoding", eyebrow: "Module 04", blurb: "Inject order information attention can't infer on its own." },
  { key: "qkv", title: "Query, Key & Value", eyebrow: "Module 05", blurb: "Project each token into three learned roles." },
  { key: "selfattention", title: "Self-Attention", eyebrow: "Module 06", blurb: "Let every token gather context from every other token." },
  { key: "multihead", title: "Multi-Head Attention", eyebrow: "Module 07", blurb: "Run several attention subspaces in parallel." },
  { key: "addnorm", title: "Add & Layer Normalization", eyebrow: "Module 08", blurb: "Stabilize training with residual connections and normalization." },
  { key: "ffn", title: "Feed-Forward Network", eyebrow: "Module 09", blurb: "Transform each token's representation independently." },
  { key: "encoderblock", title: "Encoder Block", eyebrow: "Module 10", blurb: "Wire attention and the feed-forward network into one reusable unit." },
  { key: "stack", title: "Stack Encoder Layers", eyebrow: "Module 11", blurb: "Repeat the block to build depth and abstraction." },
  { key: "output", title: "Output Layer", eyebrow: "Module 12", blurb: "Project final representations into your target space." },
];

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZZES: Quiz[] = [
  {
    question: "What does a tokenizer actually do in a Transformer pipeline?",
    options: [
      "Converts raw text into discrete units (tokens) the model can process",
      "Trains the model's weights end-to-end",
      "Permanently deletes punctuation from the dataset",
      "Translates tokens into another language",
    ],
    correct: 0,
    explanation: "Tokenization is purely a text-splitting step — it turns a string into a sequence of discrete units, with no learning involved.",
  },
  {
    question: "Why does the model need a fixed vocabulary with unique IDs?",
    options: [
      "So every token can be mapped to a specific row in the embedding table",
      "To make the raw text file smaller on disk",
      "So the model can automatically spell-check the user",
      "Vocabulary is optional and is never actually used",
    ],
    correct: 0,
    explanation: "The vocabulary is a lookup table: token → integer ID → row index into the embedding matrix. Without it, there'd be nothing to index into.",
  },
  {
    question: "What is the primary purpose of an embedding layer?",
    options: [
      "Map discrete token IDs to dense, learnable vectors that capture meaning",
      "Sort tokens alphabetically for faster search",
      "Compress the vocabulary purely to save disk space",
      "Assign arbitrary colors to tokens for a UI",
    ],
    correct: 0,
    explanation: "Embeddings replace a sparse one-hot ID with a dense vector whose geometry can encode semantic and syntactic relationships.",
  },
  {
    question: "Why do Transformers need positional encoding?",
    options: [
      "Self-attention has no inherent sense of token order, so position must be injected",
      "It exists only to make training slower",
      "It replaces the embedding layer entirely",
      "Positional encoding is only used in convolutional networks",
    ],
    correct: 0,
    explanation: "Attention treats the input as a set, not a sequence — every position is compared symmetrically. Positional encoding restores order information.",
  },
  {
    question: "In self-attention, what do the Query, Key, and Value vectors represent?",
    options: [
      "Query = what a token is looking for, Key = what a token offers, Value = the content retrieved",
      "Three unmodified copies of the same word embedding",
      "They only matter for machine translation, not encoding",
      "Query is the input text, Key is a training label, Value is unused",
    ],
    correct: 0,
    explanation: "Q/K/V are three learned linear projections of the same input, each playing a distinct role in computing attention.",
  },
  {
    question: "What does softmax(QKᵀ / √dₖ) · V actually compute?",
    options: [
      "A weighted sum of Value vectors, weighted by how relevant each Key is to the Query",
      "The gradient of the loss function with respect to the weights",
      "A random reordering of the input tokens",
      "The size of the vocabulary",
    ],
    correct: 0,
    explanation: "The dot product measures Query-Key similarity, softmax turns similarities into weights, and those weights blend the Value vectors.",
  },
  {
    question: "Why use multiple attention heads instead of just one?",
    options: [
      "Each head can specialize in different relationships or subspaces, learned in parallel",
      "It collapses the network into a single linear layer",
      "It removes the need for embeddings entirely",
      "It guarantees faster training with absolutely no tradeoffs",
    ],
    correct: 0,
    explanation: "Splitting Q/K/V into smaller subspaces lets different heads specialize — e.g. one might track syntax, another long-range dependencies.",
  },
  {
    question: "What problem does the residual (\"Add\") connection help solve?",
    options: [
      "It helps gradients flow through deep networks and preserves the original signal",
      "It deletes the attention output before normalization",
      "It doubles the size of the vocabulary",
      "It makes layer normalization unnecessary",
    ],
    correct: 0,
    explanation: "Adding the sublayer's input back to its output creates a shortcut for gradients, which is critical once you stack many layers.",
  },
  {
    question: "What is the role of the position-wise Feed-Forward Network in each encoder layer?",
    options: [
      "Apply a non-linear transformation independently to each token's representation",
      "Mix information across different sequences in the same batch",
      "Tokenize the raw input text",
      "Store the vocabulary lookup table",
    ],
    correct: 0,
    explanation: "The FFN is applied identically and independently to each position — it doesn't let tokens talk to each other (attention already did that).",
  },
  {
    question: "What is an encoder block actually composed of?",
    options: [
      "Multi-head self-attention + Add & Norm, followed by a Feed-Forward Network + Add & Norm",
      "Only an embedding lookup table",
      "A single softmax classifier and nothing else",
      "Positional encoding applied twice in a row",
    ],
    correct: 0,
    explanation: "One encoder block = attention sublayer (with residual + norm) followed by a feed-forward sublayer (with residual + norm).",
  },
  {
    question: "Why stack multiple encoder layers on top of each other?",
    options: [
      "Each additional layer lets the model build increasingly abstract, higher-level representations",
      "Stacking layers has no measurable effect on the model",
      "It exists only to slow down inference for no benefit",
      "Stacking removes the need for attention in later layers",
    ],
    correct: 0,
    explanation: "Like layers in a CNN, deeper encoder stacks compose simpler patterns from earlier layers into richer, more abstract features.",
  },
  {
    question: "What does the final output layer typically do in this configuration?",
    options: [
      "Projects final hidden representations into a target space (e.g. vocabulary logits) via a linear layer",
      "Deletes the learned embeddings to save memory",
      "Randomly shuffles the token order one last time",
      "Only runs during the tokenization step",
    ],
    correct: 0,
    explanation: "A linear layer (optionally followed by softmax) maps the model's internal hidden size back out to whatever target space the task needs.",
  },
];

/* ----------------------------------------------------------------------- */
/* Small presentational primitives                                         */
/* ----------------------------------------------------------------------- */

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function Heatmap({ mat, cell = 22, max, colorClass = "94,234,212" }: { mat: Mat; cell?: number; max?: number; colorClass?: string }) {
  const flat = mat.flat();
  const m = max ?? Math.max(...flat.map((v) => Math.abs(v)), 1e-6);
  return (
    <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${mat[0]?.length ?? 0}, ${cell}px)` }}>
      {mat.map((row, i) =>
        row.map((v, j) => {
          const alpha = Math.min(1, Math.abs(v) / m);
          return (
            <div
              key={`${i}-${j}`}
              title={v.toFixed(3)}
              style={{
                width: cell,
                height: cell,
                background: `rgba(${colorClass},${alpha.toFixed(2)})`,
              }}
              className="rounded-[3px] border border-white/5"
            />
          );
        })
      )}
    </div>
  );
}

function VectorBars({ vec, colorClass = "bg-teal-300", height = 60 }: { vec: number[]; colorClass?: string; height?: number }) {
  const max = Math.max(...vec.map((v) => Math.abs(v)), 1e-6);
  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {vec.map((v, i) => (
        <div
          key={i}
          title={v.toFixed(3)}
          className={`w-2 rounded-t-sm ${v >= 0 ? colorClass : "bg-rose-400"} opacity-80`}
          style={{ height: `${Math.max(4, (Math.abs(v) / max) * height)}px` }}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Quiz block                                                              */
/* ----------------------------------------------------------------------- */

function QuizBlock({
  quiz,
  selected,
  correct,
  onSelect,
}: {
  quiz: Quiz;
  selected: number | null;
  correct: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400/80">
        <BoltIcon className="h-3.5 w-3.5" /> Checkpoint Quiz
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-200">{quiz.question}</p>
      <div className="grid gap-2">
        {quiz.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = i === quiz.correct;
          let style = "border-slate-700 bg-slate-900 hover:border-slate-500 text-slate-300";
          if (isSelected && correct) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
          else if (isSelected && !correct) style = "border-rose-500 bg-rose-500/10 text-rose-300";
          else if (selected !== null && correct && isCorrectOpt) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={correct}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${style} ${correct ? "cursor-default" : "cursor-pointer"}`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-mono">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className={`mt-3 rounded-md p-3 text-xs leading-relaxed ${correct ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
          {correct ? "Correct. " : "Not quite. "} {quiz.explanation}
          {!correct && <span className="block mt-1 text-slate-400">Try another option to continue.</span>}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Stage shell wrapper                                                     */
/* ----------------------------------------------------------------------- */

function StageShell({
  index,
  meta,
  quiz,
  quizSelected,
  quizCorrect,
  onSelectAnswer,
  completed,
  onAddComponent,
  children,
  extraGate = true,
  extraGateMessage,
}: {
  index: number;
  meta: StageMeta;
  quiz: Quiz;
  quizSelected: number | null;
  quizCorrect: boolean;
  onSelectAnswer: (i: number) => void;
  completed: boolean;
  onAddComponent: () => void;
  children: React.ReactNode;
  extraGate?: boolean;
  extraGateMessage?: string;
}) {
  const canAdd = quizCorrect && extraGate;
  return (
    <div className="space-y-5">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-teal-400/80">{meta.eyebrow}</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">{meta.title}</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-400">{meta.blurb}</p>
      </div>
      {children}
      <QuizBlock quiz={quiz} selected={quizSelected} correct={quizCorrect} onSelect={onSelectAnswer} />
      <div className="flex items-center gap-3">
        <button
          onClick={onAddComponent}
          disabled={!canAdd || completed}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            completed
              ? "cursor-default bg-slate-800 text-slate-500"
              : canAdd
              ? "bg-teal-400 text-slate-950 hover:bg-teal-300"
              : "cursor-not-allowed bg-slate-800 text-slate-500"
          }`}
        >
          {completed ? (
            <>
              <CheckIcon className="h-4 w-4" /> Component added to model
            </>
          ) : (
            <>Add {meta.title} to my model</>
          )}
        </button>
        {!quizCorrect && !completed && (
          <span className="text-xs text-slate-500">Answer the checkpoint correctly to unlock this.</span>
        )}
        {quizCorrect && !extraGate && !completed && (
          <span className="text-xs text-rose-400">{extraGateMessage ?? "Fix the configuration above to unlock this."}</span>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Hyperparameter controls                                                 */
/* ----------------------------------------------------------------------- */

function ControlCard({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      {children}
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function SegSelect<T extends string | number>({
  value,
  options,
  onChange,
  format,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange(opt)}
          className={`rounded-md border px-2.5 py-1 text-xs font-mono transition-colors ${
            opt === value
              ? "border-teal-400 bg-teal-400/15 text-teal-300"
              : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"
          }`}
        >
          {format ? format(opt) : String(opt)}
        </button>
      ))}
    </div>
  );
}

function SliderControl({
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-teal-400"
      />
      <div className="mt-1 font-mono text-sm text-teal-300">
        {value}
        {suffix}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Live architecture diagram                                               */
/* ----------------------------------------------------------------------- */

function ArchitectureDiagram({ completed, hp }: { completed: boolean[]; hp: HyperParams }) {
  const nodeLabel = (i: number): string => {
    switch (i) {
      case 0:
        return "Tokenizer";
      case 1:
        return `Vocabulary`;
      case 2:
        return `Embedding · d=${hp.embeddingSize}`;
      case 3:
        return "+ Positional Encoding";
      case 4:
        return "Q / K / V Projections";
      case 5:
        return "Self-Attention";
      case 6:
        return `Multi-Head Attention · h=${hp.numHeads}`;
      case 7:
        return "Add & Layer Norm";
      case 8:
        return `Feed-Forward · ${hp.ffnDim}d (${hp.activation})`;
      case 9:
        return "Encoder Block ✓";
      case 10:
        return `Stack ×${hp.numLayers} Encoder Layers`;
      case 11:
        return "Output Layer → logits";
      default:
        return "";
    }
  };

  const lastCompletedIndex = completed.reduce((acc, v, i) => (v ? i : acc), -1);

  return (
    <div className="rounded-lg border border-slate-800 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.15)_1px,transparent_0)] bg-[length:14px_14px] bg-slate-950/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Live Architecture</span>
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-400">
          {completed.filter(Boolean).length}/12 built
        </span>
      </div>
      {lastCompletedIndex === -1 ? (
        <p className="py-6 text-center text-xs text-slate-600">No components added yet. Complete Module 01 to begin.</p>
      ) : (
        <div className="relative pl-4">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-teal-500/60 via-slate-700 to-transparent" />
          <div className="space-y-2">
            {completed.map((done, i) => {
              if (!done) return null;
              const isNewest = i === lastCompletedIndex;
              if (i === 10) {
                return (
                  <div key={i} className="relative">
                    <span className="absolute -left-4 top-2.5 h-2 w-2 rounded-full bg-teal-400" />
                    <div className="space-y-1 rounded-md border border-dashed border-violet-500/40 bg-violet-500/5 p-2">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-violet-300/80">Repeated block</div>
                      {Array.from({ length: hp.numLayers }).map((_, li) => (
                        <div
                          key={li}
                          className={`rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-mono text-slate-300 ${
                            isNewest ? "animate-[fadeSlide_0.4s_ease-out]" : ""
                          }`}
                        >
                          Encoder Layer {li + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="relative">
                  <span
                    className={`absolute -left-4 top-2.5 h-2 w-2 rounded-full ${isNewest ? "bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.6)]" : "bg-teal-400"}`}
                  />
                  <div
                    className={`rounded-md border px-3 py-2 text-xs font-mono transition-all ${
                      isNewest ? "border-amber-400/60 bg-amber-400/10 text-amber-200 animate-[fadeSlide_0.4s_ease-out]" : "border-slate-700 bg-slate-900 text-slate-300"
                    }`}
                  >
                    {nodeLabel(i)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Stepper sidebar                                                         */
/* ----------------------------------------------------------------------- */

function Stepper({
  stage,
  setStage,
  completed,
  unlockedUpTo,
  finalUnlocked,
}: {
  stage: number;
  setStage: (n: number) => void;
  completed: boolean[];
  unlockedUpTo: number;
  finalUnlocked: boolean;
}) {
  return (
    <nav className="space-y-1">
      {STAGE_META.map((m, i) => {
        const isUnlocked = i <= unlockedUpTo;
        const isDone = completed[i];
        const isActive = stage === i;
        return (
          <button
            key={m.key}
            onClick={() => isUnlocked && setStage(i)}
            disabled={!isUnlocked}
            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
              isActive ? "bg-teal-400/10 text-teal-300" : isUnlocked ? "text-slate-300 hover:bg-slate-800/60" : "cursor-not-allowed text-slate-600"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                isDone ? "border-teal-400 bg-teal-400/20 text-teal-300" : isUnlocked ? "border-amber-400 text-amber-400" : "border-slate-700 text-slate-600"
              }`}
            >
              {isDone ? <CheckIcon className="h-3 w-3" /> : isUnlocked ? i + 1 : <LockIcon className="h-3 w-3" />}
            </span>
            <span className="truncate">{m.title}</span>
          </button>
        );
      })}
      <button
        onClick={() => finalUnlocked && setStage(12)}
        disabled={!finalUnlocked}
        className={`mt-2 flex w-full items-center gap-2.5 rounded-md border border-dashed px-2.5 py-2 text-left text-sm transition-colors ${
          stage === 12 ? "border-teal-400 bg-teal-400/10 text-teal-300" : finalUnlocked ? "border-slate-700 text-slate-300 hover:bg-slate-800/60" : "cursor-not-allowed border-slate-800 text-slate-600"
        }`}
      >
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${finalUnlocked ? "border-teal-400 text-teal-300" : "border-slate-700 text-slate-600"}`}>
          {finalUnlocked ? <BoltIcon className="h-3 w-3" /> : <LockIcon className="h-3 w-3" />}
        </span>
        Test &amp; Export Model
      </button>
    </nav>
  );
}

/* ----------------------------------------------------------------------- */
/* Shared demo text input                                                  */
/* ----------------------------------------------------------------------- */

function DemoTextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-slate-400">Your demo sentence</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={80}
        placeholder="the cat sat on the mat"
        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-teal-400"
      />
      <p className="mt-1 text-xs text-slate-500">Every visualization on this page uses this exact sentence, run through your model.</p>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Main Page Component                                                     */
/* ----------------------------------------------------------------------- */

const STORAGE_KEY = "transformer-lab-state-v1";

export default function TransformerLabPage() {
  const [stage, setStage] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(new Array(12).fill(false));
  const [quizSel, setQuizSel] = useState<(number | null)[]>(new Array(12).fill(null));
  const [quizCorrect, setQuizCorrect] = useState<boolean[]>(new Array(12).fill(false));
  const [hp, setHp] = useState<HyperParams>(DEFAULT_HP);
  const [demoText, setDemoText] = useState("the cat sat on the mat");
  const [seed, setSeed] = useState(1337);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted progress on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.completed) setCompleted(parsed.completed);
        if (parsed.quizSel) setQuizSel(parsed.quizSel);
        if (parsed.quizCorrect) setQuizCorrect(parsed.quizCorrect);
        if (parsed.hp) setHp(parsed.hp);
        if (parsed.demoText) setDemoText(parsed.demoText);
        if (typeof parsed.seed === "number") setSeed(parsed.seed);
        if (typeof parsed.stage === "number") setStage(parsed.stage);
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist progress
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completed, quizSel, quizCorrect, hp, demoText, seed, stage })
      );
    } catch {
      // storage may be unavailable (private browsing, quota) — fail silently
    }
  }, [completed, quizSel, quizCorrect, hp, demoText, seed, stage, hydrated]);

  const unlockedUpTo = useMemo(() => {
    let n = 0;
    for (let i = 0; i < 12; i++) {
      if (completed[i]) n = Math.min(11, i + 1);
      else break;
    }
    return n;
  }, [completed]);

  const finalUnlocked = completed.every(Boolean);

  const trace = useMemo(() => computeForward(hp, demoText, seed), [hp, demoText, seed]);

  const handleSelectAnswer = useCallback((idx: number, choice: number) => {
    setQuizSel((prev) => {
      const next = [...prev];
      next[idx] = choice;
      return next;
    });
    const isRight = choice === QUIZZES[idx].correct;
    setQuizCorrect((prev) => {
      const next = [...prev];
      next[idx] = next[idx] || isRight;
      return next;
    });
  }, []);

  const handleAddComponent = useCallback((idx: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }, []);

  const headsValid = hp.embeddingSize % hp.numHeads === 0;

  const resetLab = () => {
    if (!window.confirm("Reset all progress, quiz answers, and hyperparameters? This can't be undone.")) return;
    setCompleted(new Array(12).fill(false));
    setQuizSel(new Array(12).fill(null));
    setQuizCorrect(new Array(12).fill(false));
    setHp(DEFAULT_HP);
    setDemoText("the cat sat on the mat");
    setStage(0);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const builtCount = completed.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-200">
      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flowDash { to { stroke-dashoffset: -24; } }
        @keyframes pulseGlow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        ::selection { background: rgba(94,234,212,0.3); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#0a0e14]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-teal-400/40 bg-teal-400/10">
              <BoltIcon className="h-4 w-4 text-teal-300" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-50">Build-Your-Own Transformer Lab</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Construct · Configure · Compute</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-1.5 w-36 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-teal-400 transition-all" style={{ width: `${(builtCount / 12) * 100}%` }} />
              </div>
              <span className="font-mono text-xs text-slate-400">{builtCount}/12</span>
            </div>
            <button
              onClick={resetLab}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-rose-500 hover:text-rose-400"
            >
              Reset Lab
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[220px_1fr_320px]">
        {/* Left: Stepper */}
        <aside className="order-2 lg:order-1 lg:sticky lg:top-20 lg:h-fit">
          <Stepper stage={stage} setStage={setStage} completed={completed} unlockedUpTo={unlockedUpTo} finalUnlocked={finalUnlocked} />
        </aside>

        {/* Center: Main content */}
        <main className="order-1 lg:order-2 min-w-0 space-y-6">
          {stage < 12 && (
            <StageShell
              index={stage}
              meta={STAGE_META[stage]}
              quiz={QUIZZES[stage]}
              quizSelected={quizSel[stage]}
              quizCorrect={quizCorrect[stage]}
              onSelectAnswer={(i) => handleSelectAnswer(stage, i)}
              completed={completed[stage]}
              onAddComponent={() => handleAddComponent(stage)}
              extraGate={stage !== 6 || headsValid}
              extraGateMessage="Choose a head count that evenly divides your embedding size before adding this component."
            >
              <StageContent
                stage={stage}
                hp={hp}
                setHp={setHp}
                demoText={demoText}
                setDemoText={setDemoText}
                trace={trace}
                headsValid={headsValid}
                seed={seed}
                setSeed={setSeed}
              />
            </StageShell>
          )}

          {stage === 12 && <FinalStage hp={hp} demoText={demoText} setDemoText={setDemoText} trace={trace} seed={seed} setSeed={setSeed} />}

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              onClick={() => setStage((s) => Math.max(0, s - 1))}
              disabled={stage === 0}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30"
            >
              <ChevronIcon className="h-3.5 w-3.5 rotate-180" /> Previous
            </button>
            <button
              onClick={() => setStage((s) => Math.min(12, s + 1))}
              disabled={stage === 12 || (stage < 11 ? stage + 1 > unlockedUpTo : !finalUnlocked)}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30"
            >
              Next <ChevronIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </main>

        {/* Right: Live diagram + hp summary */}
        <aside className="order-3 space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <ArchitectureDiagram completed={completed} hp={hp} />
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-400">Current Config</div>
            <dl className="grid grid-cols-2 gap-y-1.5 text-xs">
              <dt className="text-slate-500">d_model</dt>
              <dd className="text-right font-mono text-slate-300">{hp.embeddingSize}</dd>
              <dt className="text-slate-500">heads</dt>
              <dd className="text-right font-mono text-slate-300">{hp.numHeads}</dd>
              <dt className="text-slate-500">layers</dt>
              <dd className="text-right font-mono text-slate-300">{hp.numLayers}</dd>
              <dt className="text-slate-500">ffn dim</dt>
              <dd className="text-right font-mono text-slate-300">{hp.ffnDim}</dd>
              <dt className="text-slate-500">activation</dt>
              <dd className="text-right font-mono text-slate-300">{hp.activation}</dd>
              <dt className="text-slate-500">dropout</dt>
              <dd className="text-right font-mono text-slate-300">{hp.dropout}</dd>
              <dt className="text-slate-500">seq length</dt>
              <dd className="text-right font-mono text-slate-300">{hp.seqLength}</dd>
              <dt className="text-slate-500">optimizer</dt>
              <dd className="text-right font-mono text-slate-300">{hp.optimizer}</dd>
              <dt className="text-slate-500">lr</dt>
              <dd className="text-right font-mono text-slate-300">{hp.learningRate}</dd>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Per-stage visualization content                                         */
/* ----------------------------------------------------------------------- */

function StageContent({
  stage,
  hp,
  setHp,
  demoText,
  setDemoText,
  trace,
  headsValid,
  seed,
  setSeed,
}: {
  stage: number;
  hp: HyperParams;
  setHp: React.Dispatch<React.SetStateAction<HyperParams>>;
  demoText: string;
  setDemoText: (v: string) => void;
  trace: ForwardTrace;
  headsValid: boolean;
  seed: number;
  setSeed: (n: number) => void;
}) {
  switch (stage) {
    case 0:
      return <TokenizerStage demoText={demoText} setDemoText={setDemoText} trace={trace} />;
    case 1:
      return <VocabularyStage trace={trace} />;
    case 2:
      return <EmbeddingStage hp={hp} setHp={setHp} trace={trace} />;
    case 3:
      return <PositionalStage hp={hp} trace={trace} />;
    case 4:
      return <QKVStage hp={hp} trace={trace} />;
    case 5:
      return <SelfAttentionStage trace={trace} />;
    case 6:
      return <MultiHeadStage hp={hp} setHp={setHp} trace={trace} headsValid={headsValid} />;
    case 7:
      return <AddNormStage trace={trace} />;
    case 8:
      return <FFNStage hp={hp} setHp={setHp} trace={trace} />;
    case 9:
      return <EncoderBlockStage hp={hp} trace={trace} />;
    case 10:
      return <StackStage hp={hp} setHp={setHp} trace={trace} />;
    case 11:
      return <OutputStage hp={hp} trace={trace} />;
    default:
      return null;
  }
}

function TokenizerStage({ demoText, setDemoText, trace }: { demoText: string; setDemoText: (v: string) => void; trace: ForwardTrace }) {
  const rawTokens = tokenize(demoText.trim().length ? demoText : "the cat sat on the mat");
  return (
    <div className="space-y-4">
      <DemoTextInput value={demoText} onChange={setDemoText} />
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Tokenized output</div>
        <div className="flex flex-wrap gap-2">
          {rawTokens.map((t, i) => (
            <span
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-[fadeSlide_0.35s_ease-out_backwards] rounded-md border border-teal-500/40 bg-teal-500/10 px-2.5 py-1 font-mono text-sm text-teal-300"
            >
              {t}
            </span>
          ))}
          {rawTokens.length === 0 && <span className="text-xs text-slate-500">Type something above to see it tokenized.</span>}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          This lab uses a simple word/punctuation tokenizer (regex-based). Production Transformers usually use subword tokenizers like
          BPE or WordPiece, which split rare words into smaller reusable pieces — but the pipeline downstream is identical.
        </p>
      </div>
    </div>
  );
}

function VocabularyStage({ trace }: { trace: ForwardTrace }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-400">Vocabulary table</div>
          <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-400">{trace.vocab.length} entries</span>
        </div>
        <div className="grid max-h-64 grid-cols-2 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-3">
          {trace.vocab.map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs">
              <span className={`font-mono ${i < SPECIAL_TOKENS.length ? "text-violet-300" : "text-slate-300"}`}>{t}</span>
              <span className="font-mono text-slate-500">#{i}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          The first {SPECIAL_TOKENS.length} entries are reserved special tokens (padding, unknown, sequence markers). Every other row was
          discovered from your demo sentence, in order of first appearance.
        </p>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-400">Your sentence → IDs</div>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {trace.tokens.map((t, i) => (
            <span key={i} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">
              {t} <span className="text-teal-400">#{trace.ids[i]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmbeddingStage({ hp, setHp, trace }: { hp: HyperParams; setHp: React.Dispatch<React.SetStateAction<HyperParams>>; trace: ForwardTrace }) {
  return (
    <div className="space-y-4">
      <ControlCard label="Embedding size (d_model)" hint="Larger vectors capture more nuance but cost more compute. Must be divisible by your future head count.">
        <SegSelect value={hp.embeddingSize} options={[8, 16, 32, 64]} onChange={(v) => setHp((p) => ({ ...p, embeddingSize: v }))} />
      </ControlCard>
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Token → vector lookup</div>
        <div className="space-y-3">
          {trace.tokens.slice(0, 5).map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-16 shrink-0 truncate font-mono text-xs text-slate-400">{t}</span>
              <VectorBars vec={trace.embeddings[i]} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Each bar is one dimension of a {hp.embeddingSize}-dimensional vector, randomly initialized here (Xavier init) since this lab
          doesn't train weights — in a trained model these values would encode learned meaning.
        </p>
      </div>
    </div>
  );
}

function PositionalStage({ hp, trace }: { hp: HyperParams; trace: ForwardTrace }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">
          Sinusoidal positional encoding — PE(pos, 2i)=sin(pos/10000^(2i/d)), PE(pos, 2i+1)=cos(...)
        </div>
        <Heatmap mat={trace.pe} cell={14} colorClass="139,124,246" />
        <p className="mt-3 text-xs text-slate-500">
          Each row is a sequence position (0 to {hp.seqLength - 1}), each column a dimension. Notice how nearby rows produce similar
          patterns while distant rows diverge — that structure is what lets the model infer relative position.
        </p>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Embedding + Positional Encoding (first token)</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="mb-1 text-[10px] text-slate-500">embedding</div>
            <VectorBars vec={trace.embeddings[0]} colorClass="bg-slate-400" />
          </div>
          <div>
            <div className="mb-1 text-[10px] text-slate-500">+ position</div>
            <VectorBars vec={trace.pe[0]} colorClass="bg-violet-400" />
          </div>
          <div>
            <div className="mb-1 text-[10px] text-slate-500">= result</div>
            <VectorBars vec={trace.embedPlusPE[0]} colorClass="bg-teal-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QKVStage({ hp, trace }: { hp: HyperParams; trace: ForwardTrace }) {
  const layer0 = trace.layers[0];
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Three learned projections of layer 1's input</div>
        <p className="mb-3 text-xs text-slate-400">
          Q = X·Wq &nbsp;·&nbsp; K = X·Wk &nbsp;·&nbsp; V = X·Wv — each W is a {hp.embeddingSize}×{hp.embeddingSize} learnable matrix.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="mb-1 text-[10px] uppercase text-amber-300/80">Query</div>
            <Heatmap mat={layer0.attn.Q.slice(0, 6)} cell={12} colorClass="251,191,36" />
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase text-teal-300/80">Key</div>
            <Heatmap mat={layer0.attn.K.slice(0, 6)} cell={12} colorClass="94,234,212" />
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase text-violet-300/80">Value</div>
            <Heatmap mat={layer0.attn.V.slice(0, 6)} cell={12} colorClass="139,124,246" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Rows shown are the first 6 sequence positions. Query will be compared against Key to compute relevance; Value is what actually
          gets mixed together once relevance is known.
        </p>
      </div>
    </div>
  );
}

function SelfAttentionStage({ trace }: { trace: ForwardTrace }) {
  const layer0 = trace.layers[0];
  const n = Math.min(trace.tokens.length, 8);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Attention weights — softmax(QKᵀ/√dₖ)</div>
        <div className="flex gap-4">
          <div>
            <Heatmap mat={layer0.attn.weights.slice(0, n).map((r) => r.slice(0, n))} cell={26} colorClass="94,234,212" />
          </div>
          <div className="flex flex-col justify-center gap-1 text-[10px] font-mono text-slate-500">
            {trace.tokens.slice(0, n).map((t, i) => (
              <div key={i} className="h-[26px] leading-[26px]">
                row {i}: {t}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Brighter cells mean token (row) attends more strongly to token (column). Each row always sums to 1 — it's a probability
          distribution over which other tokens to gather information from.
        </p>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-400">Resulting context vector (token 0)</div>
        <VectorBars vec={layer0.attn.output[0]} colorClass="bg-teal-300" />
      </div>
    </div>
  );
}

function MultiHeadStage({
  hp,
  setHp,
  trace,
  headsValid,
}: {
  hp: HyperParams;
  setHp: React.Dispatch<React.SetStateAction<HyperParams>>;
  trace: ForwardTrace;
  headsValid: boolean;
}) {
  const layer0 = trace.layers[0];
  const n = Math.min(trace.tokens.length, 6);
  return (
    <div className="space-y-4">
      <ControlCard label="Number of attention heads" hint={`d_model (${hp.embeddingSize}) must divide evenly by heads. Head dimension = d_model / heads.`}>
        <SegSelect value={hp.numHeads} options={[1, 2, 4, 8]} onChange={(v) => setHp((p) => ({ ...p, numHeads: v }))} />
        {!headsValid && (
          <p className="mt-2 rounded-md bg-rose-500/10 px-2 py-1 text-xs text-rose-300">
            {hp.embeddingSize} isn't divisible by {hp.numHeads} heads. Pick a compatible combination before continuing — try{" "}
            {[1, 2, 4, 8].filter((h) => hp.embeddingSize % h === 0).join(", ")} heads.
          </p>
        )}
      </ControlCard>
      {headsValid && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">
            {hp.numHeads} attention heads running in parallel (head dim = {hp.embeddingSize / hp.numHeads})
          </div>
          <div className="flex flex-wrap gap-4">
            {layer0.attn.headWeights.map((hw, h) => (
              <div key={h} className="text-center">
                <div className="mb-1 text-[10px] text-slate-500">head {h + 1}</div>
                <Heatmap mat={hw.slice(0, n).map((r) => r.slice(0, n))} cell={16} colorClass={h % 2 === 0 ? "139,124,246" : "251,191,36"} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Each head produces its own attention pattern from the same input. Their outputs are concatenated and projected back to{" "}
            {hp.embeddingSize} dimensions with an output matrix Wo.
          </p>
        </div>
      )}
    </div>
  );
}

function AddNormStage({ trace }: { trace: ForwardTrace }) {
  const layer0 = trace.layers[0];
  const before = trace.embedPlusPE[0];
  const afterAttn = layer0.attn.output[0];
  const summed = before.map((v, i) => v + afterAttn[i]);
  const normed = layer0.addNorm1[0];
  const stat = (v: number[]) => {
    const mean = v.reduce((a, b) => a + b, 0) / v.length;
    const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length;
    return { mean, std: Math.sqrt(variance) };
  };
  const s1 = stat(summed);
  const s2 = stat(normed);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Residual add, then normalize (token 0)</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="mb-1 text-[10px] text-slate-500">input (x)</div>
            <VectorBars vec={before} colorClass="bg-slate-400" />
          </div>
          <div>
            <div className="mb-1 text-[10px] text-slate-500">+ sublayer(x)</div>
            <VectorBars vec={summed} colorClass="bg-amber-300" />
            <div className="mt-1 font-mono text-[10px] text-slate-500">
              μ={s1.mean.toFixed(2)} σ={s1.std.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[10px] text-slate-500">layer norm</div>
            <VectorBars vec={normed} colorClass="bg-teal-300" />
            <div className="mt-1 font-mono text-[10px] text-slate-500">
              μ={s2.mean.toFixed(2)} σ={s2.std.toFixed(2)}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          LayerNorm rescales every token vector to zero mean and unit variance, independent of the others. Combined with the residual
          add, this keeps activations well-behaved even after many stacked layers.
        </p>
      </div>
    </div>
  );
}

function FFNStage({ hp, setHp, trace }: { hp: HyperParams; setHp: React.Dispatch<React.SetStateAction<HyperParams>>; trace: ForwardTrace }) {
  const layer0 = trace.layers[0];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <ControlCard label="Feed-forward dimension" hint="The inner hidden size the token vector is temporarily expanded into.">
          <SegSelect value={hp.ffnDim} options={[32, 64, 128, 256]} onChange={(v) => setHp((p) => ({ ...p, ffnDim: v }))} />
        </ControlCard>
        <ControlCard label="Activation function" hint="Adds the non-linearity that lets the network model complex functions.">
          <SegSelect value={hp.activation} options={["relu", "gelu"] as const} onChange={(v) => setHp((p) => ({ ...p, activation: v }))} />
        </ControlCard>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">
          x → Linear({hp.embeddingSize}→{hp.ffnDim}) → {hp.activation} → Linear({hp.ffnDim}→{hp.embeddingSize})
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="mb-1 text-[10px] text-slate-500">input ({hp.embeddingSize}d)</div>
            <VectorBars vec={layer0.addNorm1[0]} colorClass="bg-slate-400" />
          </div>
          <ChevronIcon className="h-4 w-4 shrink-0 text-slate-600" />
          <div className="text-center">
            <div className="mb-1 text-[10px] text-slate-500">
              hidden ({hp.ffnDim}d, {hp.activation})
            </div>
            <VectorBars vec={layer0.ffnHidden[0]} colorClass="bg-amber-300" />
          </div>
          <ChevronIcon className="h-4 w-4 shrink-0 text-slate-600" />
          <div className="text-center">
            <div className="mb-1 text-[10px] text-slate-500">output ({hp.embeddingSize}d)</div>
            <VectorBars vec={layer0.ffnOut[0]} colorClass="bg-teal-300" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          This transformation is applied to every token position independently and identically — it's the same two matrices reused
          across the whole sequence.
        </p>
      </div>
    </div>
  );
}

function EncoderBlockStage({ hp, trace }: { hp: HyperParams; trace: ForwardTrace }) {
  const l = trace.layers[0];
  const steps = [
    { label: "Input", vec: trace.embedPlusPE[0], color: "bg-slate-400" },
    { label: "Multi-Head Attn", vec: l.attn.output[0], color: "bg-amber-300" },
    { label: "Add & Norm", vec: l.addNorm1[0], color: "bg-violet-300" },
    { label: "Feed-Forward", vec: l.ffnOut[0], color: "bg-amber-300" },
    { label: "Add & Norm", vec: l.addNorm2[0], color: "bg-teal-300" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">One full encoder block, data flowing through (token 0)</div>
        <div className="flex flex-wrap items-center gap-3">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="text-center">
                <div className="mb-1 max-w-[90px] text-[10px] leading-tight text-slate-500">{s.label}</div>
                <VectorBars vec={s.vec} colorClass={s.color} />
              </div>
              {i < steps.length - 1 && <ChevronIcon className="h-4 w-4 shrink-0 text-slate-600" />}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          You've now assembled every piece into one reusable unit: attention lets tokens exchange information, the feed-forward network
          processes each token individually, and residual+norm keeps everything numerically stable. This whole block is what gets
          repeated in the next module.
        </p>
      </div>
    </div>
  );
}

function StackStage({ hp, setHp, trace }: { hp: HyperParams; setHp: React.Dispatch<React.SetStateAction<HyperParams>>; trace: ForwardTrace }) {
  return (
    <div className="space-y-4">
      <ControlCard label="Number of encoder layers" hint="More layers → more capacity and more abstract representations, at the cost of compute and harder optimization.">
        <SliderControl value={hp.numLayers} min={1} max={6} step={1} onChange={(v) => setHp((p) => ({ ...p, numLayers: v }))} />
      </ControlCard>
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Representation of token 0 evolving through the stack</div>
        <div className="space-y-2">
          {trace.layers.map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-16 shrink-0 font-mono text-[10px] text-slate-500">layer {i + 1}</span>
              <VectorBars vec={l.addNorm2[0]} colorClass="bg-teal-300" height={36} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Each layer takes the previous layer's output as its input, applying the same attention → add&norm → feed-forward → add&norm
          pattern with its own independent weights.
        </p>
      </div>
    </div>
  );
}

function OutputStage({ hp, trace }: { hp: HyperParams; trace: ForwardTrace }) {
  const lastPos = trace.tokens.filter((t) => t !== "[PAD]").length - 1;
  const probs = trace.probs[Math.max(0, lastPos)];
  const top = probs
    .map((p, i) => ({ token: trace.vocab[i], p }))
    .sort((a, b) => b.p - a.p)
    .slice(0, 5);
  const maxP = top[0]?.p ?? 1;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">
          Final hidden state → Linear({hp.embeddingSize}→{trace.vocab.length}) → Softmax
        </div>
        <div className="mb-4 space-y-1.5">
          {top.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-16 shrink-0 truncate font-mono text-xs text-slate-400">{t.token}</span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-slate-900">
                <div className="h-full bg-teal-400" style={{ width: `${(t.p / maxP) * 100}%` }} />
              </div>
              <span className="w-12 shrink-0 text-right font-mono text-xs text-slate-400">{(t.p * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Shown here as a vocabulary distribution for the last non-padding position — this is exactly what a masked-language-modeling
          head or classification head would consume. Since we never trained the weights, the distribution reflects random
          initialization rather than learned meaning; wire this same layer to a training loop and it becomes a real language model head.
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Final: Test & Export                                                    */
/* ----------------------------------------------------------------------- */

function OPTIMIZER_CLASS(o: HyperParams["optimizer"]): string {
  switch (o) {
    case "adam":
      return "Adam";
    case "sgd":
      return "SGD";
    case "rmsprop":
      return "RMSprop";
    case "adamw":
      return "AdamW";
  }
}

function generatePyTorchSkeleton(hp: HyperParams): string {
  return `import torch
import torch.nn as nn

class MyTransformerEncoder(nn.Module):
    def __init__(self, vocab_size: int):
        super().__init__()
        d_model = ${hp.embeddingSize}
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.register_buffer("pos_encoding", self._build_pe(${hp.seqLength}, d_model))
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=${hp.numHeads},
            dim_feedforward=${hp.ffnDim},
            dropout=${hp.dropout},
            activation="${hp.activation}",
            batch_first=True,
        )
        self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=${hp.numLayers})
        self.output_layer = nn.Linear(d_model, vocab_size)

    def _build_pe(self, seq_len, d_model):
        pos = torch.arange(seq_len).unsqueeze(1)
        div = torch.exp(torch.arange(0, d_model, 2) * (-torch.log(torch.tensor(10000.0)) / d_model))
        pe = torch.zeros(seq_len, d_model)
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        return pe.unsqueeze(0)

    def forward(self, token_ids, attn_mask=None):
        x = self.embedding(token_ids) + self.pos_encoding[:, : token_ids.size(1), :]
        x = self.encoder(x, src_key_padding_mask=attn_mask)
        return self.output_layer(x)

model = MyTransformerEncoder(vocab_size=YOUR_VOCAB_SIZE)
optimizer = torch.optim.${OPTIMIZER_CLASS(hp.optimizer)}(model.parameters(), lr=${hp.learningRate})
`;
}

function FinalStage({
  hp,
  demoText,
  setDemoText,
  trace,
  seed,
  setSeed,
}: {
  hp: HyperParams;
  demoText: string;
  setDemoText: (v: string) => void;
  trace: ForwardTrace;
  seed: number;
  setSeed: (n: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const lastPos = trace.tokens.filter((t) => t !== "[PAD]").length - 1;
  const probs = trace.probs[Math.max(0, lastPos)];
  const top = probs
    .map((p, i) => ({ token: trace.vocab[i], p }))
    .sort((a, b) => b.p - a.p)
    .slice(0, 5);
  const maxP = top[0]?.p ?? 1;

  const exportConfig = () => {
    const config = {
      name: "my-transformer-encoder",
      createdAt: new Date().toISOString(),
      hyperparameters: hp,
      architecture: {
        pipeline: STAGE_META.map((m) => m.title),
        totalParametersApprox: estimateParams(hp, trace.vocab.length),
        vocabSizeUsedInDemo: trace.vocab.length,
      },
      seed,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transformer-config.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatePyTorchSkeleton(hp));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-teal-400/80">Final Stage</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">Test &amp; Export Your Model</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
          Every module is assembled. Run your own text through the complete pipeline, then export the configuration to use as the
          foundation for a real training run.
        </p>
      </div>

      <DemoTextInput value={demoText} onChange={setDemoText} />

      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400">End-to-end pipeline trace</span>
          <button onClick={() => setSeed(Math.floor(Math.random() * 1e6))} className="rounded-md border border-slate-700 px-2 py-1 text-[10px] text-slate-400 hover:border-teal-400 hover:text-teal-300">
            Reinitialize weights
          </button>
        </div>
        <ol className="grid gap-2 text-xs sm:grid-cols-2">
          <li className="rounded border border-slate-800 bg-slate-900 px-2.5 py-2">
            <span className="text-slate-500">1. Tokens</span> <div className="mt-1 font-mono text-slate-300">{trace.tokens.filter((t) => t !== "[PAD]").join(" · ")}</div>
          </li>
          <li className="rounded border border-slate-800 bg-slate-900 px-2.5 py-2">
            <span className="text-slate-500">2. Vocab size</span> <div className="mt-1 font-mono text-slate-300">{trace.vocab.length} tokens</div>
          </li>
          <li className="rounded border border-slate-800 bg-slate-900 px-2.5 py-2">
            <span className="text-slate-500">3. Embedding + PE shape</span>{" "}
            <div className="mt-1 font-mono text-slate-300">
              {hp.seqLength} × {hp.embeddingSize}
            </div>
          </li>
          <li className="rounded border border-slate-800 bg-slate-900 px-2.5 py-2">
            <span className="text-slate-500">4. Encoder stack</span> <div className="mt-1 font-mono text-slate-300">{hp.numLayers} layers × {hp.numHeads} heads</div>
          </li>
          <li className="rounded border border-slate-800 bg-slate-900 px-2.5 py-2">
            <span className="text-slate-500">5. Feed-forward</span> <div className="mt-1 font-mono text-slate-300">{hp.embeddingSize}→{hp.ffnDim}→{hp.embeddingSize} ({hp.activation})</div>
          </li>
          <li className="rounded border border-slate-800 bg-slate-900 px-2.5 py-2">
            <span className="text-slate-500">6. Output projection</span> <div className="mt-1 font-mono text-slate-300">{hp.embeddingSize}→{trace.vocab.length} logits</div>
          </li>
        </ol>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Top predictions (last token position)</div>
        <div className="space-y-1.5">
          {top.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-16 shrink-0 truncate font-mono text-xs text-slate-400">{t.token}</span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-slate-900">
                <div className="h-full bg-teal-400" style={{ width: `${(t.p / maxP) * 100}%` }} />
              </div>
              <span className="w-12 shrink-0 text-right font-mono text-xs text-slate-400">{(t.p * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-teal-300">Export configuration</div>
          <p className="mb-3 text-xs text-slate-400">Download your hyperparameters and architecture summary as JSON.</p>
          <button onClick={exportConfig} className="rounded-md bg-teal-400 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-teal-300">
            Download transformer-config.json
          </button>
        </div>
        <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-violet-300">Continue in PyTorch</div>
          <p className="mb-3 text-xs text-slate-400">Copy a working model skeleton pre-filled with your chosen hyperparameters.</p>
          <button onClick={copyCode} className="rounded-md border border-violet-400 px-3 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-400/10">
            {copied ? "Copied!" : "Copy PyTorch code"}
          </button>
        </div>
      </div>

      <pre className="max-h-72 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-[11px] leading-relaxed text-slate-300">
        <code>{generatePyTorchSkeleton(hp)}</code>
      </pre>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-200">
        You`ve built a complete Transformer Encoder: tokenizer, vocabulary, embeddings, positional encoding, {hp.numLayers} encoder
        layer{hp.numLayers > 1 ? "s" : ""} of multi-head attention and feed-forward sublayers, and an output projection — all
        configured by you. Use the exported config and PyTorch skeleton as the starting point for your next project.
      </div>
    </div>
  );
}

function estimateParams(hp: HyperParams, vocabSize: number): number {
  const d = hp.embeddingSize;
  const perLayer = 4 * d * d + 2 * d * hp.ffnDim; // Wq,Wk,Wv,Wo + W1 + W2 (approx, ignoring biases/norm)
  const embedding = vocabSize * d;
  const output = d * vocabSize;
  return Math.round(embedding + hp.numLayers * perLayer + output);
}