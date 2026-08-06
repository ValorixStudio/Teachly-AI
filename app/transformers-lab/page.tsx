"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

/* ============================================================================
   BUILD YOUR OWN TRANSFORMER — an interactive architecture lab
   Single-file React + TypeScript + Tailwind implementation (Next.js page.tsx)
   ========================================================================== */

/* ----------------------------- Types -------------------------------------- */

type Activation = "relu" | "gelu" | "swiglu";
type PosEncoding = "sinusoidal" | "learned" | "rotary";
type Optimizer = "adam" | "adamw" | "sgd" | "adafactor";

interface TransformerConfig {
  vocabSize: number;
  dModel: number;
  numHeads: number;
  numEncoderLayers: number;
  numDecoderLayers: number;
  dFF: number;
  activation: Activation;
  dropout: number;
  maxSeqLen: number;
  posEncoding: PosEncoding;
  optimizer: Optimizer;
  learningRate: number;
}

type ComponentId =
  | "input-embedding"
  | "output-embedding"
  | "positional-encoding-enc"
  | "positional-encoding-dec"
  | "encoder-stack"
  | "encoder-mha"
  | "encoder-addnorm-1"
  | "encoder-ffn"
  | "encoder-addnorm-2"
  | "decoder-stack"
  | "decoder-masked-mha"
  | "decoder-addnorm-1"
  | "decoder-cross-attn"
  | "decoder-addnorm-2"
  | "decoder-ffn"
  | "decoder-addnorm-3"
  | "linear"
  | "softmax";

/* --------------------------- Defaults --------------------------------------*/

const DEFAULT_CONFIG: TransformerConfig = {
  vocabSize: 32000,
  dModel: 512,
  numHeads: 8,
  numEncoderLayers: 6,
  numDecoderLayers: 6,
  dFF: 2048,
  activation: "gelu",
  dropout: 0.1,
  maxSeqLen: 512,
  posEncoding: "sinusoidal",
  optimizer: "adamw",
  learningRate: 0.0003,
};

const STORAGE_KEY = "byot:saved-model";
const THEME_KEY = "byot:theme";

/* ---------------------- Parameter counting ----------------------------------
   Standard encoder-decoder transformer parameter estimate (weights only,
   biases/LN ignored for clarity — this is an educational approximation).
------------------------------------------------------------------------------*/
function estimateParams(cfg: TransformerConfig) {
  const dm = cfg.dModel;
  const dff = cfg.dFF;
  const V = cfg.vocabSize;

  const inputEmbedding = V * dm;
  const outputEmbedding = V * dm;
  const finalLinear = V * dm;

  const perEncoderLayer = 4 * dm * dm + 2 * dm * dff; // QKVO + FFN
  const perDecoderLayer = 8 * dm * dm + 2 * dm * dff; // self-attn + cross-attn + FFN

  const encoderTotal = perEncoderLayer * cfg.numEncoderLayers;
  const decoderTotal = perDecoderLayer * cfg.numDecoderLayers;

  const total =
    inputEmbedding + outputEmbedding + finalLinear + encoderTotal + decoderTotal;

  return {
    total,
    inputEmbedding,
    outputEmbedding,
    finalLinear,
    encoderTotal,
    decoderTotal,
    perEncoderLayer,
    perDecoderLayer,
  };
}

function formatParams(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

/* ------------------------- Component reference data --------------------------*/

interface ComponentInfo {
  name: string;
  category: string;
  purpose: string;
  inputShape: (cfg: TransformerConfig) => string;
  outputShape: (cfg: TransformerConfig) => string;
  parameters: (cfg: TransformerConfig) => { label: string; value: string }[];
  formula?: string[];
  accent: string; // tailwind color token key, see ACCENTS
}

const ACCENTS = {
  rose: {
    ring: "ring-rose-400/60",
    border: "border-rose-400/40",
    text: "text-rose-500 dark:text-rose-300",
    bg: "bg-rose-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(251,113,133,0.55)]",
    dot: "bg-rose-400",
  },
  amber: {
    ring: "ring-amber-400/60",
    border: "border-amber-400/40",
    text: "text-amber-600 dark:text-amber-300",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(251,191,36,0.55)]",
    dot: "bg-amber-400",
  },
  orange: {
    ring: "ring-orange-400/60",
    border: "border-orange-400/40",
    text: "text-orange-600 dark:text-orange-300",
    bg: "bg-orange-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(251,146,60,0.55)]",
    dot: "bg-orange-400",
  },
  sky: {
    ring: "ring-sky-400/60",
    border: "border-sky-400/40",
    text: "text-sky-600 dark:text-sky-300",
    bg: "bg-sky-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(56,189,248,0.55)]",
    dot: "bg-sky-400",
  },
  violet: {
    ring: "ring-violet-400/60",
    border: "border-violet-400/40",
    text: "text-violet-600 dark:text-violet-300",
    bg: "bg-violet-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(167,139,250,0.55)]",
    dot: "bg-violet-400",
  },
  emerald: {
    ring: "ring-emerald-400/60",
    border: "border-emerald-400/40",
    text: "text-emerald-600 dark:text-emerald-300",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_24px_-6px_rgba(52,211,153,0.55)]",
    dot: "bg-emerald-400",
  },
} as const;

type AccentKey = keyof typeof ACCENTS;

const COMPONENT_LIBRARY: Record<ComponentId, ComponentInfo> = {
  "input-embedding": {
    name: "Input Embedding",
    category: "Embedding",
    purpose:
      "Converts input token IDs into dense continuous vectors. Each of the vocabulary's tokens is mapped to a learned d_model-dimensional vector that captures semantic meaning.",
    inputShape: (c) => `(batch, seq_len ≤ ${c.maxSeqLen})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "Vocabulary size", value: c.vocabSize.toLocaleString() },
      { label: "Embedding dim (d_model)", value: String(c.dModel) },
      { label: "Table size", value: `${c.vocabSize} × ${c.dModel}` },
    ],
    formula: ["E = Embedding(token_id)", "E ∈ ℝ^(seq_len × d_model)"],
    accent: "rose",
  },
  "output-embedding": {
    name: "Output Embedding",
    category: "Embedding",
    purpose:
      "Embeds the target sequence (shifted right by one position) so the decoder can condition on previously generated tokens during training via teacher forcing.",
    inputShape: (c) => `(batch, seq_len ≤ ${c.maxSeqLen})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "Vocabulary size", value: c.vocabSize.toLocaleString() },
      { label: "Embedding dim (d_model)", value: String(c.dModel) },
      { label: "Shifted right by", value: "1 token" },
    ],
    formula: ["E = Embedding(shifted_target_id)"],
    accent: "rose",
  },
  "positional-encoding-enc": {
    name: "Positional Encoding",
    category: "Positional Signal",
    purpose:
      "Injects information about token order into the embeddings, since attention itself is permutation-invariant and has no built-in notion of sequence position.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "Encoding type", value: c.posEncoding },
      { label: "Max sequence length", value: String(c.maxSeqLen) },
      { label: "Combine method", value: "element-wise add" },
    ],
    formula:
      // eslint-disable-next-line no-useless-concat
      ["PE(pos,2i)   = sin(pos / 10000^(2i/d_model))", "PE(pos,2i+1) = cos(pos / 10000^(2i/d_model))"],
    accent: "amber",
  },
  "positional-encoding-dec": {
    name: "Positional Encoding",
    category: "Positional Signal",
    purpose:
      "Same mechanism as the encoder side — encodes the position of each target token so the decoder knows the order of the sequence it is generating.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "Encoding type", value: c.posEncoding },
      { label: "Max sequence length", value: String(c.maxSeqLen) },
    ],
    formula: ["PE(pos,2i)   = sin(pos / 10000^(2i/d_model))", "PE(pos,2i+1) = cos(pos / 10000^(2i/d_model))"],
    accent: "amber",
  },
  "encoder-stack": {
    name: "Encoder Stack",
    category: "Stack",
    purpose:
      "A stack of identical encoder layers that progressively build a contextualized representation of the input sequence. Each layer refines the representation using self-attention and a feed-forward network.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "Layers (N)", value: String(c.numEncoderLayers) },
      { label: "d_model", value: String(c.dModel) },
      { label: "Heads per layer", value: String(c.numHeads) },
      { label: "FFN dim", value: String(c.dFF) },
    ],
    accent: "sky",
  },
  "encoder-mha": {
    name: "Multi-Head Attention",
    category: "Encoder Sub-layer",
    purpose:
      "Lets every token attend to every other token in the input, allowing the model to combine information from across the whole sequence in parallel, from several representation subspaces at once.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "d_model", value: String(c.dModel) },
      { label: "Heads", value: String(c.numHeads) },
      { label: "Head dimension", value: String(Math.round(c.dModel / c.numHeads)) },
    ],
    formula: ["Q = XWq   K = XWk   V = XWv", "Attention(Q,K,V) = softmax(QKᵀ / √d_k) V"],
    accent: "orange",
  },
  "encoder-addnorm-1": {
    name: "Add & Norm",
    category: "Encoder Sub-layer",
    purpose:
      "A residual connection adds the sub-layer's input back to its output (helping gradients flow through deep stacks), followed by layer normalization to stabilize training.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: () => [{ label: "Normalization", value: "LayerNorm" }],
    formula: ["out = LayerNorm(x + Sublayer(x))"],
    accent: "amber",
  },
  "encoder-ffn": {
    name: "Feed Forward",
    category: "Encoder Sub-layer",
    purpose:
      "A position-wise, two-layer fully-connected network applied identically to every position, giving the model extra capacity to transform each token's representation.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "d_model", value: String(c.dModel) },
      { label: "d_ff", value: String(c.dFF) },
      { label: "Activation", value: c.activation.toUpperCase() },
      { label: "Dropout", value: c.dropout.toFixed(2) },
    ],
    formula: ["FFN(x) = Activation(xW1 + b1)W2 + b2"],
    accent: "sky",
  },
  "encoder-addnorm-2": {
    name: "Add & Norm",
    category: "Encoder Sub-layer",
    purpose:
      "Second residual + normalization step in the encoder layer, applied after the feed-forward sub-layer.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: () => [{ label: "Normalization", value: "LayerNorm" }],
    formula: ["out = LayerNorm(x + FFN(x))"],
    accent: "amber",
  },
  "decoder-stack": {
    name: "Decoder Stack",
    category: "Stack",
    purpose:
      "A stack of identical decoder layers that generate the output sequence one position at a time, attending to previously generated tokens and to the encoder's output.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "Layers (N)", value: String(c.numDecoderLayers) },
      { label: "d_model", value: String(c.dModel) },
      { label: "Heads per layer", value: String(c.numHeads) },
      { label: "FFN dim", value: String(c.dFF) },
    ],
    accent: "violet",
  },
  "decoder-masked-mha": {
    name: "Masked Multi-Head Attention",
    category: "Decoder Sub-layer",
    purpose:
      "Self-attention over the target sequence, with a causal mask that prevents each position from attending to future positions — preserving the autoregressive property during training.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "d_model", value: String(c.dModel) },
      { label: "Heads", value: String(c.numHeads) },
      { label: "Head dimension", value: String(Math.round(c.dModel / c.numHeads)) },
      { label: "Mask", value: "causal (lower-triangular)" },
    ],
    formula: ["scores = QKᵀ/√d_k + Mask (−∞ for future positions)", "Attention = softmax(scores) V"],
    accent: "orange",
  },
  "decoder-addnorm-1": {
    name: "Add & Norm",
    category: "Decoder Sub-layer",
    purpose: "Residual connection and normalization following masked self-attention.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: () => [{ label: "Normalization", value: "LayerNorm" }],
    formula: ["out = LayerNorm(x + MaskedAttn(x))"],
    accent: "amber",
  },
  "decoder-cross-attn": {
    name: "Cross Attention",
    category: "Decoder Sub-layer",
    purpose:
      "Lets each decoder position attend over the encoder's output representations, allowing the model to pull in relevant information from the source sequence while generating each target token.",
    inputShape: (c) => `Q: decoder (batch, seq_len, ${c.dModel})  •  K,V: encoder output`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "d_model", value: String(c.dModel) },
      { label: "Heads", value: String(c.numHeads) },
      { label: "Query source", value: "decoder" },
      { label: "Key/Value source", value: "encoder output" },
    ],
    formula: ["Q = decoder_state Wq", "K,V = encoder_output Wk, Wv", "Attention(Q,K,V) = softmax(QKᵀ/√d_k) V"],
    accent: "orange",
  },
  "decoder-addnorm-2": {
    name: "Add & Norm",
    category: "Decoder Sub-layer",
    purpose: "Residual connection and normalization following cross-attention.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: () => [{ label: "Normalization", value: "LayerNorm" }],
    formula: ["out = LayerNorm(x + CrossAttn(x))"],
    accent: "amber",
  },
  "decoder-ffn": {
    name: "Feed Forward",
    category: "Decoder Sub-layer",
    purpose:
      "Position-wise feed-forward network in the decoder, identical in structure to the encoder's, giving further per-token transformation capacity.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: (c) => [
      { label: "d_model", value: String(c.dModel) },
      { label: "d_ff", value: String(c.dFF) },
      { label: "Activation", value: c.activation.toUpperCase() },
    ],
    formula: ["FFN(x) = Activation(xW1 + b1)W2 + b2"],
    accent: "violet",
  },
  "decoder-addnorm-3": {
    name: "Add & Norm",
    category: "Decoder Sub-layer",
    purpose: "Final residual connection and normalization in the decoder layer, after the feed-forward sub-layer.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    parameters: () => [{ label: "Normalization", value: "LayerNorm" }],
    formula: ["out = LayerNorm(x + FFN(x))"],
    accent: "amber",
  },
  linear: {
    name: "Linear",
    category: "Output Head",
    purpose:
      "Projects the decoder's final hidden states into vocabulary-sized logits — one score per token in the vocabulary, for each output position.",
    inputShape: (c) => `(batch, seq_len, ${c.dModel})`,
    outputShape: (c) => `(batch, seq_len, ${c.vocabSize})`,
    parameters: (c) => [
      { label: "In features", value: String(c.dModel) },
      { label: "Out features", value: c.vocabSize.toLocaleString() },
      { label: "Weight shape", value: `${c.dModel} × ${c.vocabSize}` },
    ],
    formula: ["logits = h · W_out + b"],
    accent: "violet",
  },
  softmax: {
    name: "Softmax",
    category: "Output Head",
    purpose:
      "Converts the raw logits into a probability distribution over the vocabulary for each output position, from which the next token is sampled or selected.",
    inputShape: (c) => `(batch, seq_len, ${c.vocabSize})`,
    outputShape: (c) => `(batch, seq_len, ${c.vocabSize})`,
    parameters: () => [{ label: "Normalizes over", value: "vocabulary dimension" }],
    formula: ["P(token_i) = exp(logit_i) / Σⱼ exp(logit_j)"],
    accent: "emerald",
  },
};

/* ------------------------------ UI atoms -----------------------------------*/

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const activationOptions: { value: Activation; label: string }[] = [
  { value: "relu", label: "ReLU" },
  { value: "gelu", label: "GELU" },
  { value: "swiglu", label: "SwiGLU" },
];
const posEncodingOptions: { value: PosEncoding; label: string }[] = [
  { value: "sinusoidal", label: "Sinusoidal (fixed)" },
  { value: "learned", label: "Learned" },
  { value: "rotary", label: "Rotary (RoPE)" },
];
const optimizerOptions: { value: Optimizer; label: string }[] = [
  { value: "adam", label: "Adam" },
  { value: "adamw", label: "AdamW" },
  { value: "sgd", label: "SGD + Momentum" },
  { value: "adafactor", label: "Adafactor" },
];

/* ------------------------------- Page --------------------------------------*/

export default function Page() {
  const [config, setConfig] = useState<TransformerConfig>(DEFAULT_CONFIG);
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const [dark, setDark] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [hasSavedModel, setHasSavedModel] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  /* ---- initial load: theme + saved model ---- */
  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = window.localStorage.getItem(THEME_KEY);
      if (savedTheme) setDark(savedTheme === "dark");
      else setDark(window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true);

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TransformerConfig;
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
        setHasSavedModel(true);
      }
    } catch {
      /* localStorage unavailable — lab still works without persistence */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark, mounted]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const paramInfo = useMemo(() => estimateParams(config), [config]);

  const updateConfig = useCallback(<K extends keyof TransformerConfig>(key: K, value: TransformerConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setJourneyStep((s) => Math.max(s, 2));
  }, []);

  const handleSave = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setHasSavedModel(true);
      setToast("Your Transformer has been saved!");
      setJourneyStep((s) => Math.max(s, 7));
    } catch {
      setToast("Couldn't save — local storage is unavailable.");
    }
  }, [config]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-transformer-config.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setToast("Configuration exported as JSON.");
    setJourneyStep((s) => Math.max(s, 8));
  }, [config]);

  const performReset = useCallback((clearSaved: boolean) => {
    setConfig(DEFAULT_CONFIG);
    setSelected(null);
    setJourneyStep(0);
    setShowSummary(false);
    if (clearSaved) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setHasSavedModel(false);
    }
    setConfirmingReset(false);
    setToast("Lab reset to defaults.");
  }, []);

  const selectedInfo = selected ? COMPONENT_LIBRARY[selected] : null;

  const t = dark ? theme.dark : theme.light;

  return (
    <div className={cx("min-h-screen w-full font-sans transition-colors duration-300", t.pageBg, t.pageText)}>
      <style>{fontImports}</style>

      {/* ---------------------------- Top Nav ---------------------------- */}
      <header
        className={cx(
          "sticky top-0 z-30 border-b backdrop-blur-md",
          t.headerBg,
          t.border
        )}
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cx(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                "bg-gradient-to-br from-violet-500 to-sky-400 text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.7)]"
              )}
            >
              T
            </div>
            <div className="min-w-0">
              <h1 className={cx("text-[15px] sm:text-base font-semibold tracking-tight truncate", t.headingText)} style={{ fontFamily: "var(--font-display)" }}>
                Build Your Own Transformer
              </h1>
              <p className={cx("text-[11px] sm:text-xs truncate", t.subtleText)}>
                An interactive lab for constructing encoder–decoder architectures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSave}
              className={cx(
                "hidden sm:inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition",
                "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110 shadow-[0_0_16px_-4px_rgba(16,185,129,0.7)]"
              )}
            >
              Save Model
            </button>
            <button
              onClick={handleExport}
              className={cx(
                "hidden md:inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition border",
                t.buttonSecondary
              )}
            >
              Export JSON
            </button>
            <button
              onClick={() => setConfirmingReset(true)}
              className={cx(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition border",
                t.buttonDanger
              )}
            >
              Reset Lab
            </button>
            <button
              aria-label="Toggle color theme"
              onClick={() => setDark((d) => !d)}
              className={cx(
                "inline-flex h-9 w-9 items-center justify-center rounded-md border transition",
                t.buttonSecondary
              )}
            >
              {dark ? "☀" : "🌙"}
            </button>
          </div>
        </div>
        {/* mobile-only save/export row */}
        <div className="sm:hidden flex gap-2 px-4 pb-3">
          <button onClick={handleSave} className="flex-1 rounded-md px-3 py-2 text-xs font-medium bg-emerald-600 text-white">
            Save Model
          </button>
          <button onClick={handleExport} className={cx("flex-1 rounded-md px-3 py-2 text-xs font-medium border", t.buttonSecondary)}>
            Export JSON
          </button>
        </div>
      </header>

      {/* saved badge strip */}
      {hasSavedModel && (
        <div className={cx("text-center text-[11px] py-1.5", t.savedStrip)}>
          A saved model was restored from your browser. Changes are not saved until you click{" "}
          <span className="font-semibold">Save Model</span> again.
        </div>
      )}

      {/* ---------------------------- Journey bar ---------------------------- */}
      <JourneyBar step={journeyStep} dark={dark} t={t} />

      {/* ---------------------------- Main 3-column layout ---------------------------- */}
      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 py-5 grid grid-cols-1 xl:grid-cols-[290px_minmax(0,1fr)_320px] gap-5">
        {/* -------- Left: Configuration -------- */}
        <ConfigPanel config={config} update={updateConfig} t={t} dark={dark} paramTotal={paramInfo.total} />

        {/* -------- Center: Architecture diagram -------- */}
        <div className="min-w-0 flex flex-col gap-5">
          <ArchitectureDiagram config={config} selected={selected} onSelect={setSelected} t={t} dark={dark} />

          <ModelBuilderSummary
            config={config}
            paramInfo={paramInfo}
            t={t}
            dark={dark}
            onReady={() => setShowSummary(true)}
          />

          {showSummary && <ReadySummary config={config} paramInfo={paramInfo} t={t} onClose={() => setShowSummary(false)} />}
        </div>

        {/* -------- Right: Component detail panel -------- */}
        <DetailPanel info={selectedInfo} config={config} t={t} dark={dark} onClear={() => setSelected(null)} />
      </main>

      <footer className={cx("mx-auto max-w-[1600px] px-6 py-8 text-center text-xs", t.subtleText)}>
        Click any block in the diagram to inspect it. Adjust parameters on the left to watch the architecture and
        parameter count update live.
      </footer>

      {/* ---------------------------- Toast ---------------------------- */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className={cx(
              "rounded-lg px-4 py-2.5 text-sm font-medium shadow-xl border backdrop-blur-md animate-[fadeIn_0.2s_ease-out]",
              t.toast
            )}
          >
            {toast}
          </div>
        </div>
      )}

      {/* ---------------------------- Reset confirm modal ---------------------------- */}
      {confirmingReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className={cx("w-full max-w-sm rounded-xl border p-5 shadow-2xl", t.card)}>
            <h3 className={cx("text-sm font-semibold mb-1.5", t.headingText)}>Reset the lab?</h3>
            <p className={cx("text-xs mb-4", t.subtleText)}>
              This restores every parameter to its default value and clears your current progress.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => performReset(false)}
                className={cx("w-full rounded-md px-3 py-2 text-xs font-medium border", t.buttonSecondary)}
              >
                Reset parameters only
              </button>
              <button
                onClick={() => performReset(true)}
                className="w-full rounded-md px-3 py-2 text-xs font-medium bg-rose-600 text-white hover:brightness-110"
              >
                Reset and clear saved model
              </button>
              <button
                onClick={() => setConfirmingReset(false)}
                className={cx("w-full rounded-md px-3 py-2 text-xs font-medium", t.subtleText)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   Journey bar
   ========================================================================== */

const JOURNEY_STEPS = [
  "Learn",
  "Customize",
  "Add to Architecture",
  "See It Visually",
  "Build Complete Transformer",
  "Review",
  "",
  "Save Model",
  "Export",
];

function JourneyBar({ step, dark, t }: { step: number; dark: boolean; t: Theme }) {
  const labels = ["Learn Component", "Customize", "Build Architecture", "Review", "Save", "Export"];
  const mapped = Math.min(Math.round((step / 8) * (labels.length - 1)), labels.length - 1);
  return (
    <div className={cx("border-b", t.border, t.subStripBg)}>
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-2 flex items-center gap-1 overflow-x-auto">
        {labels.map((label, i) => (
          <React.Fragment key={label}>
            <div
              className={cx(
                "flex items-center gap-1.5 whitespace-nowrap text-[11px] px-2 py-1 rounded-full transition-colors",
                i <= mapped ? t.journeyActive : t.journeyInactive
              )}
            >
              <span
                className={cx(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
                  i <= mapped ? "bg-violet-500 text-white" : t.journeyDot
                )}
              >
                {i + 1}
              </span>
              {label}
            </div>
            {i < labels.length - 1 && <span className={cx("h-px w-4 shrink-0", i < mapped ? "bg-violet-400" : t.border)} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   Configuration Panel
   ========================================================================== */

function ConfigPanel({
  config,
  update,
  t,
  dark,
  paramTotal,
}: {
  config: TransformerConfig;
  update: <K extends keyof TransformerConfig>(key: K, value: TransformerConfig[K]) => void;
  t: Theme;
  dark: boolean;
  paramTotal: number;
}) {
  const headOptions = [1, 2, 4, 8, 12, 16].filter((h) => config.dModel % h === 0);

  return (
    <aside className={cx("xl:sticky xl:top-[104px] xl:self-start rounded-xl border p-4 sm:p-5", t.card)}>
      <h2 className={cx("text-sm font-semibold mb-0.5", t.headingText)} style={{ fontFamily: "var(--font-display)" }}>
        Configuration
      </h2>
      <p className={cx("text-[11px] mb-4", t.subtleText)}>Shape your model. The diagram updates as you go.</p>

      <div className="flex flex-col gap-4">
        <NumberField
          label="Vocabulary size"
          value={config.vocabSize}
          min={1000}
          max={128000}
          step={1000}
          onChange={(v) => update("vocabSize", v)}
          t={t}
        />

        <SelectField
          label="Embedding dimension (d_model)"
          value={config.dModel}
          options={[128, 256, 384, 512, 768, 1024].map((v) => ({ value: v, label: String(v) }))}
          onChange={(v) => {
            const dm = Number(v);
            const nextHeads = [1, 2, 4, 8, 12, 16].filter((h) => dm % h === 0);
            update("dModel", dm);
            if (!nextHeads.includes(config.numHeads)) {
              update("numHeads", nextHeads[Math.min(2, nextHeads.length - 1)]);
            }
          }}
          t={t}
        />

        <SelectField
          label="Attention heads"
          value={config.numHeads}
          options={headOptions.map((v) => ({ value: v, label: `${v}  (head dim ${config.dModel / v})` }))}
          onChange={(v) => update("numHeads", Number(v))}
          t={t}
        />

        <SliderField
          label="Encoder layers"
          value={config.numEncoderLayers}
          min={1}
          max={12}
          onChange={(v) => update("numEncoderLayers", v)}
          t={t}
        />

        <SliderField
          label="Decoder layers"
          value={config.numDecoderLayers}
          min={1}
          max={12}
          onChange={(v) => update("numDecoderLayers", v)}
          t={t}
        />

        <SelectField
          label="Feed-forward dimension"
          value={config.dFF}
          options={[512, 1024, 2048, 3072, 4096].map((v) => ({ value: v, label: String(v) }))}
          onChange={(v) => update("dFF", Number(v))}
          t={t}
        />

        <SelectField
          label="Activation function"
          value={config.activation}
          options={activationOptions.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(v) => update("activation", v as Activation)}
          t={t}
        />

        <SliderField
          label="Dropout"
          value={config.dropout}
          min={0}
          max={0.5}
          step={0.01}
          format={(v) => v.toFixed(2)}
          onChange={(v) => update("dropout", v)}
          t={t}
        />

        <SelectField
          label="Max sequence length"
          value={config.maxSeqLen}
          options={[128, 256, 512, 1024, 2048].map((v) => ({ value: v, label: String(v) }))}
          onChange={(v) => update("maxSeqLen", Number(v))}
          t={t}
        />

        <SelectField
          label="Positional encoding"
          value={config.posEncoding}
          options={posEncodingOptions.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(v) => update("posEncoding", v as PosEncoding)}
          t={t}
        />

        <SelectField
          label="Optimizer"
          value={config.optimizer}
          options={optimizerOptions.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(v) => update("optimizer", v as Optimizer)}
          t={t}
        />

        <SliderField
          label="Learning rate"
          value={config.learningRate}
          min={0.00001}
          max={0.01}
          step={0.00001}
          format={(v) => v.toExponential(1)}
          onChange={(v) => update("learningRate", v)}
          t={t}
        />
      </div>

      <div className={cx("mt-5 rounded-lg border px-3 py-2.5 flex items-center justify-between", t.statChip)}>
        <span className={cx("text-[11px]", t.subtleText)}>Total parameters</span>
        <span className={cx("text-sm font-bold tabular-nums", t.accentText)} style={{ fontFamily: "var(--font-mono)" }}>
          {formatParams(paramTotal)}
        </span>
      </div>
    </aside>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  t,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  t: Theme;
}) {
  return (
    <label className="block">
      <div className={cx("flex items-center justify-between text-[11px] mb-1.5", t.fieldLabel)}>
        <span>{label}</span>
        <span className={cx("font-mono tabular-nums", t.accentText)}>{value.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cx("w-full accent-violet-500", t.rangeTrack)}
      />
    </label>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  format,
  onChange,
  t,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  t: Theme;
}) {
  return (
    <label className="block">
      <div className={cx("flex items-center justify-between text-[11px] mb-1.5", t.fieldLabel)}>
        <span>{label}</span>
        <span className={cx("font-mono tabular-nums", t.accentText)}>{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cx("w-full accent-violet-500", t.rangeTrack)}
      />
    </label>
  );
}

function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
  t,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  t: Theme;
}) {
  return (
    <label className="block">
      <div className={cx("text-[11px] mb-1.5", t.fieldLabel)}>{label}</div>
      <select
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          const matched = options.find((o) => String(o.value) === raw);
          onChange((matched ? matched.value : raw) as T);
        }}
        className={cx("w-full rounded-md border px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-400/60", t.select)}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ============================================================================
   Architecture Diagram — the centerpiece, mirrors the reference figure
   ========================================================================== */

function ArchitectureDiagram({
  config,
  selected,
  onSelect,
  t,
  dark,
}: {
  config: TransformerConfig;
  selected: ComponentId | null;
  onSelect: (id: ComponentId) => void;
  t: Theme;
  dark: boolean;
}) {
  return (
    <div className={cx("rounded-xl border p-4 sm:p-6", t.card)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={cx("text-sm font-semibold", t.headingText)} style={{ fontFamily: "var(--font-display)" }}>
            Architecture Diagram
          </h2>
          <p className={cx("text-[11px]", t.subtleText)}>Click a block to inspect it</p>
        </div>
        <Legend t={t} />
      </div>

      {/* Output head, shared, sits above both towers */}
      <div className="flex flex-col items-center gap-2 mb-3">
        <Block id="softmax" label="Softmax" sub="probabilities" onSelect={onSelect} selected={selected} t={t} dark={dark} width="w-44" />
        <Arrow t={t} />
        <Block id="linear" label="Linear" sub={`→ ${config.vocabSize.toLocaleString()} logits`} onSelect={onSelect} selected={selected} t={t} dark={dark} width="w-44" />
        <Arrow t={t} />
      </div>

      {/* Two towers: encoder (left) / decoder (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 relative">
        {/* connecting cross-attention line, desktop only */}
        <div className={cx("hidden lg:block absolute left-1/2 top-[40%] w-10 -translate-x-1/2 border-t-2 border-dashed", t.crossLine)} />

        {/* ---------------- ENCODER TOWER ---------------- */}
        <Tower label="ENCODER">
          <StackWrapper count={config.numEncoderLayers} t={t} dark={dark}>
            <Block id="encoder-addnorm-2" label="Add & Norm" onSelect={onSelect} selected={selected} t={t} dark={dark} small accent="amber" />
            <Arrow t={t} small />
            <Block id="encoder-ffn" label="Feed Forward" onSelect={onSelect} selected={selected} t={t} dark={dark} accent="sky" />
            <Arrow t={t} small />
            <Block id="encoder-addnorm-1" label="Add & Norm" onSelect={onSelect} selected={selected} t={t} dark={dark} small accent="amber" />
            <Arrow t={t} small />
            <Block
              id="encoder-mha"
              label="Multi-Head Attention"
              sub={`${config.numHeads} heads`}
              onSelect={onSelect}
              selected={selected}
              t={t}
              dark={dark}
              accent="orange"
            />
          </StackWrapper>
          <StackBadge id="encoder-stack" n={config.numEncoderLayers} onSelect={onSelect} selected={selected} t={t} />
          <Arrow t={t} />
          <Block id="positional-encoding-enc" label="Positional Encoding" sub={config.posEncoding} onSelect={onSelect} selected={selected} t={t} dark={dark} accent="amber" circle />
          <Arrow t={t} label="+" />
          <Block id="input-embedding" label="Input Embedding" onSelect={onSelect} selected={selected} t={t} dark={dark} accent="rose" />
          <Arrow t={t} />
          <div className={cx("text-[11px] font-medium", t.subtleText)}>Inputs</div>
        </Tower>

        {/* ---------------- DECODER TOWER ---------------- */}
        <Tower label="DECODER">
          <StackWrapper count={config.numDecoderLayers} t={t} dark={dark}>
            <Block id="decoder-addnorm-3" label="Add & Norm" onSelect={onSelect} selected={selected} t={t} dark={dark} small accent="amber" />
            <Arrow t={t} small />
            <Block id="decoder-ffn" label="Feed Forward" onSelect={onSelect} selected={selected} t={t} dark={dark} accent="violet" />
            <Arrow t={t} small />
            <Block id="decoder-addnorm-2" label="Add & Norm" onSelect={onSelect} selected={selected} t={t} dark={dark} small accent="amber" />
            <Arrow t={t} small />
            <Block id="decoder-cross-attn" label="Cross Attention" sub="Q: decoder · K,V: encoder" onSelect={onSelect} selected={selected} t={t} dark={dark} accent="orange" />
            <Arrow t={t} small />
            <Block id="decoder-addnorm-1" label="Add & Norm" onSelect={onSelect} selected={selected} t={t} dark={dark} small accent="amber" />
            <Arrow t={t} small />
            <Block
              id="decoder-masked-mha"
              label="Masked Multi-Head Attention"
              sub={`${config.numHeads} heads · causal`}
              onSelect={onSelect}
              selected={selected}
              t={t}
              dark={dark}
              accent="orange"
            />
          </StackWrapper>
          <StackBadge id="decoder-stack" n={config.numDecoderLayers} onSelect={onSelect} selected={selected} t={t} />
          <Arrow t={t} />
          <Block id="positional-encoding-dec" label="Positional Encoding" sub={config.posEncoding} onSelect={onSelect} selected={selected} t={t} dark={dark} accent="amber" circle />
          <Arrow t={t} label="+" />
          <Block id="output-embedding" label="Output Embedding" onSelect={onSelect} selected={selected} t={t} dark={dark} accent="rose" />
          <Arrow t={t} />
          <div className={cx("text-[11px] font-medium", t.subtleText)}>Outputs (shifted right)</div>
        </Tower>
      </div>
    </div>
  );
}

function Legend({ t }: { t: Theme }) {
  const items: { label: string; accent: AccentKey }[] = [
    { label: "Embedding", accent: "rose" },
    { label: "Add & Norm", accent: "amber" },
    { label: "Attention", accent: "orange" },
    { label: "Feed Forward", accent: "sky" },
    { label: "Output", accent: "emerald" },
  ];
  return (
    <div className="hidden sm:flex items-center gap-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1">
          <span className={cx("h-2 w-2 rounded-full", ACCENTS[it.accent].dot)} />
          <span className={cx("text-[10px]", t.subtleText)}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function Tower({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] font-bold tracking-[0.2em] opacity-50">{label}</div>
      {children}
    </div>
  );
}

function StackWrapper({ count, t, dark, children }: { count: number; t: Theme; dark: boolean; children: React.ReactNode }) {
  // visualizes "depth" of the stack with layered offset panels behind the front layer
  const layers = Math.min(count, 3);
  return (
    <div className="relative w-full flex justify-center">
      {Array.from({ length: layers - 1 }).map((_, i) => (
        <div
          key={i}
          aria-hidden
          className={cx("absolute inset-x-0 rounded-xl border pointer-events-none", t.stackGhost)}
          style={{
            top: -(6 * (i + 1)),
            left: 6 * (i + 1),
            right: -(6 * (i + 1)),
            bottom: 6 * (i + 1),
            zIndex: -1 - i,
          }}
        />
      ))}
      <div className={cx("relative w-full rounded-xl border-2 p-3 flex flex-col items-center gap-2", t.stackFront)}>
        {children}
      </div>
    </div>
  );
}

function StackBadge({
  id,
  n,
  onSelect,
  selected,
  t,
}: {
  id: ComponentId;
  n: number;
  onSelect: (id: ComponentId) => void;
  selected: ComponentId | null;
  t: Theme;
}) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={cx(
        "text-[11px] font-semibold px-2.5 py-1 rounded-full border transition",
        selected === id ? "bg-violet-500 text-white border-violet-500" : t.stackBadge
      )}
    >
      × {n} layer{n > 1 ? "s" : ""}
    </button>
  );
}

function Arrow({ t, label, small }: { t: Theme; label?: string; small?: boolean }) {
  return (
    <div className="flex flex-col items-center leading-none">
      {label && <span className={cx("text-[10px] font-bold mb-0.5", t.subtleText)}>{label}</span>}
      <svg width="14" height={small ? 12 : 18} viewBox="0 0 14 18" className={t.arrow}>
        <line x1="7" y1="0" x2="7" y2={small ? 8 : 12} stroke="currentColor" strokeWidth="2" />
        <path d={`M2 ${small ? 7 : 11} L7 ${small ? 12 : 17} L12 ${small ? 7 : 11}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Block({
  id,
  label,
  sub,
  onSelect,
  selected,
  t,
  dark,
  small,
  circle,
  width,
  accent,
}: {
  id: ComponentId;
  label: string;
  sub?: string;
  onSelect: (id: ComponentId) => void;
  selected: ComponentId | null;
  t: Theme;
  dark: boolean;
  small?: boolean;
  circle?: boolean;
  width?: string;
  accent?: AccentKey;
}) {
  const info = COMPONENT_LIBRARY[id];
  const a = ACCENTS[accent ?? (info.accent as AccentKey)];
  const isSelected = selected === id;

  return (
    <button
      onClick={() => onSelect(id)}
      className={cx(
        "group relative z-10 border-2 px-3 transition-all duration-150 text-center",
        small ? "py-1.5" : "py-2.5",
        circle ? "rounded-full" : "rounded-lg",
        width ?? "w-full max-w-[240px]",
        a.bg,
        a.border,
        t.blockText,
        isSelected ? cx("ring-2", a.ring, a.glow, "scale-[1.03]") : "hover:scale-[1.02] hover:brightness-110"
      )}
    >
      <div className={cx("font-semibold", small ? "text-[11px]" : "text-xs sm:text-[13px]")}>{label}</div>
      {sub && <div className={cx("text-[10px] mt-0.5 opacity-70")}>{sub}</div>}
    </button>
  );
}

/* ============================================================================
   Model Builder Summary ("MY TRANSFORMER")
   ========================================================================== */

function ModelBuilderSummary({
  config,
  paramInfo,
  t,
  dark,
  onReady,
}: {
  config: TransformerConfig;
  paramInfo: ReturnType<typeof estimateParams>;
  t: Theme;
  dark: boolean;
  onReady: () => void;
}) {
  const flow = [
    "Input",
    `Embedding (${config.dModel})`,
    "Positional Encoding",
    `Encoder × ${config.numEncoderLayers}`,
    `Decoder × ${config.numDecoderLayers}`,
    "Linear",
    "Softmax",
  ];

  const stats: { label: string; value: string }[] = [
    { label: "Parameters", value: formatParams(paramInfo.total) },
    { label: "Embedding dimension", value: String(config.dModel) },
    { label: "Attention heads", value: String(config.numHeads) },
    { label: "Encoder layers", value: String(config.numEncoderLayers) },
    { label: "Decoder layers", value: String(config.numDecoderLayers) },
    { label: "FFN dimension", value: String(config.dFF) },
  ];

  return (
    <div className={cx("rounded-xl border p-4 sm:p-5", t.card)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className={cx("text-sm font-semibold tracking-wide", t.headingText)} style={{ fontFamily: "var(--font-display)" }}>
            MY TRANSFORMER
          </h2>
          <p className={cx("text-[11px]", t.subtleText)}>Your architecture, built live from the configuration.</p>
        </div>
        <button
          onClick={onReady}
          className="self-start sm:self-auto rounded-md px-3 py-2 text-xs font-medium bg-gradient-to-r from-violet-500 to-sky-500 text-white hover:brightness-110 shadow-[0_0_16px_-4px_rgba(139,92,246,0.7)]"
        >
          Review Architecture
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-5">
        <div className={cx("rounded-lg border px-4 py-3 flex flex-col items-start gap-1 font-mono text-xs", t.mono)}>
          {flow.map((f, i) => (
            <React.Fragment key={f}>
              <span className={i === 0 || i === flow.length - 1 ? t.subtleText : t.accentText}>{f}</span>
              {i < flow.length - 1 && <span className={t.subtleText}> ↓</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((s) => (
            <div key={s.label} className={cx("rounded-lg border px-3 py-2.5", t.statChip)}>
              <div className={cx("text-[10px] mb-0.5", t.subtleText)}>{s.label}</div>
              <div className={cx("text-sm font-bold tabular-nums", t.headingText)}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReadySummary({
  config,
  paramInfo,
  t,
  onClose,
}: {
  config: TransformerConfig;
  paramInfo: ReturnType<typeof estimateParams>;
  t: Theme;
  onClose: () => void;
}) {
  return (
    <div className={cx("rounded-xl border-2 p-5 relative overflow-hidden", t.readyCard)}>
      <button onClick={onClose} className={cx("absolute top-3 right-3 text-xs", t.subtleText)} aria-label="Close summary">
        ✕
      </button>
      <h3 className="text-base font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        🎉 Your Transformer is Ready!
      </h3>
      <p className={cx("text-xs mb-4", t.subtleText)}>
        A {config.numEncoderLayers}-layer / {config.numDecoderLayers}-layer encoder–decoder Transformer with{" "}
        {config.numHeads}-head attention and {formatParams(paramInfo.total)} parameters.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <SummaryRow label="Vocabulary" value={config.vocabSize.toLocaleString()} />
        <SummaryRow label="d_model" value={String(config.dModel)} />
        <SummaryRow label="Heads" value={String(config.numHeads)} />
        <SummaryRow label="Encoder layers" value={String(config.numEncoderLayers)} />
        <SummaryRow label="Decoder layers" value={String(config.numDecoderLayers)} />
        <SummaryRow label="FFN dim" value={String(config.dFF)} />
        <SummaryRow label="Activation" value={config.activation.toUpperCase()} />
        <SummaryRow label="Dropout" value={config.dropout.toFixed(2)} />
        <SummaryRow label="Max seq len" value={String(config.maxSeqLen)} />
        <SummaryRow label="Pos. encoding" value={config.posEncoding} />
        <SummaryRow label="Optimizer" value={config.optimizer} />
        <SummaryRow label="Learning rate" value={config.learningRate.toExponential(1)} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="opacity-60 text-[10px]">{label}</span>
      <span className="font-semibold capitalize">{value}</span>
    </div>
  );
}

/* ============================================================================
   Detail Panel (right column)
   ========================================================================== */

function DetailPanel({
  info,
  config,
  t,
  dark,
  onClear,
}: {
  info: ComponentInfo | null;
  config: TransformerConfig;
  t: Theme;
  dark: boolean;
  onClear: () => void;
}) {
  return (
    <aside className={cx("xl:sticky xl:top-[104px] xl:self-start rounded-xl border p-4 sm:p-5 min-h-[200px]", t.card)}>
      <h2 className={cx("text-sm font-semibold mb-0.5", t.headingText)} style={{ fontFamily: "var(--font-display)" }}>
        Component Details
      </h2>
      <p className={cx("text-[11px] mb-4", t.subtleText)}>Learn what each block does.</p>

      {!info ? (
        <div className={cx("rounded-lg border border-dashed px-4 py-8 text-center text-xs", t.subtleText, t.border)}>
          Click a block in the diagram to see its purpose, shapes, parameters, and formula here.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <span className={cx("inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2", ACCENTS[info.accent as AccentKey].bg, ACCENTS[info.accent as AccentKey].text)}>
              {info.category}
            </span>
            <h3 className={cx("text-base font-bold", t.headingText)}>{info.name}</h3>
          </div>

          <p className={cx("text-xs leading-relaxed", t.bodyText)}>{info.purpose}</p>

          <div className="grid grid-cols-1 gap-2">
            <ShapeRow label="Input shape" value={info.inputShape(config)} t={t} />
            <ShapeRow label="Output shape" value={info.outputShape(config)} t={t} />
          </div>

          <div>
            <div className={cx("text-[11px] font-semibold mb-1.5", t.fieldLabel)}>Current configuration</div>
            <div className="flex flex-col gap-1">
              {info.parameters(config).map((p) => (
                <div key={p.label} className={cx("flex items-center justify-between text-[11px] rounded-md px-2.5 py-1.5", t.statChip)}>
                  <span className={t.subtleText}>{p.label}</span>
                  <span className={cx("font-mono font-semibold", t.accentText)}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {info.formula && (
            <div>
              <div className={cx("text-[11px] font-semibold mb-1.5", t.fieldLabel)}>Formula</div>
              <pre className={cx("text-[11px] rounded-md px-3 py-2.5 overflow-x-auto leading-relaxed", t.mono)}>
                {info.formula.join("\n")}
              </pre>
            </div>
          )}

          <button
            onClick={onClear}
            className={cx("mt-1 text-[11px] font-medium rounded-md border px-3 py-2 self-start", t.buttonSecondary)}
          >
            ← Back to overview
          </button>
        </div>
      )}
    </aside>
  );
}

function ShapeRow({ label, value, t }: { label: string; value: string; t: Theme }) {
  return (
    <div className={cx("rounded-md px-2.5 py-1.5 text-[11px]", t.statChip)}>
      <div className={t.subtleText}>{label}</div>
      <div className={cx("font-mono font-semibold mt-0.5", t.accentText)}>{value}</div>
    </div>
  );
}

/* ============================================================================
   Theme tokens
   ========================================================================== */

interface Theme {
  pageBg: string;
  pageText: string;
  headerBg: string;
  border: string;
  headingText: string;
  subtleText: string;
  bodyText: string;
  card: string;
  buttonSecondary: string;
  buttonDanger: string;
  savedStrip: string;
  subStripBg: string;
  journeyActive: string;
  journeyInactive: string;
  journeyDot: string;
  fieldLabel: string;
  select: string;
  rangeTrack: string;
  statChip: string;
  accentText: string;
  toast: string;
  mono: string;
  blockText: string;
  arrow: string;
  crossLine: string;
  stackFront: string;
  stackGhost: string;
  stackBadge: string;
  readyCard: string;
}

const theme: { dark: Theme; light: Theme } = {
  dark: {
    pageBg: "bg-[#0A0D14]",
    pageText: "text-slate-200",
    headerBg: "bg-[#0A0D14]/90",
    border: "border-white/10",
    headingText: "text-white",
    subtleText: "text-slate-400",
    bodyText: "text-slate-300",
    card: "bg-[#10141D] border-white/10",
    buttonSecondary: "border-white/15 text-slate-200 hover:bg-white/5",
    buttonDanger: "border-rose-400/30 text-rose-300 hover:bg-rose-500/10",
    savedStrip: "bg-emerald-500/10 text-emerald-300 border-b border-emerald-500/20",
    subStripBg: "bg-[#0C1019]",
    journeyActive: "bg-violet-500/15 text-violet-200",
    journeyInactive: "text-slate-500",
    journeyDot: "bg-white/10 text-slate-400",
    fieldLabel: "text-slate-400",
    select: "bg-[#161B26] border-white/15 text-slate-200",
    rangeTrack: "bg-white/10",
    statChip: "bg-white/[0.04] border-white/10",
    accentText: "text-sky-300",
    toast: "bg-[#161B26] border-white/15 text-slate-100",
    mono: "bg-black/30 border border-white/10 text-emerald-300",
    blockText: "text-slate-100",
    arrow: "text-slate-500",
    crossLine: "border-white/20",
    stackFront: "bg-white/[0.03] border-white/10",
    stackGhost: "bg-white/[0.015] border-white/5",
    stackBadge: "border-white/15 text-slate-300 bg-white/5",
    readyCard: "bg-gradient-to-br from-violet-500/10 via-transparent to-sky-500/10 border-violet-400/30 text-slate-100",
  },
  light: {
    pageBg: "bg-[#F7F8FB]",
    pageText: "text-slate-800",
    headerBg: "bg-[#F7F8FB]/90",
    border: "border-slate-200",
    headingText: "text-slate-900",
    subtleText: "text-slate-500",
    bodyText: "text-slate-600",
    card: "bg-white border-slate-200 shadow-sm",
    buttonSecondary: "border-slate-200 text-slate-700 hover:bg-slate-50",
    buttonDanger: "border-rose-200 text-rose-600 hover:bg-rose-50",
    savedStrip: "bg-emerald-50 text-emerald-700 border-b border-emerald-200",
    subStripBg: "bg-white",
    journeyActive: "bg-violet-100 text-violet-700",
    journeyInactive: "text-slate-400",
    journeyDot: "bg-slate-100 text-slate-400",
    fieldLabel: "text-slate-500",
    select: "bg-white border-slate-200 text-slate-800",
    rangeTrack: "bg-slate-200",
    statChip: "bg-slate-50 border-slate-200",
    accentText: "text-violet-600",
    toast: "bg-white border-slate-200 text-slate-800",
    mono: "bg-slate-900 border border-slate-800 text-emerald-300",
    blockText: "text-slate-900",
    arrow: "text-slate-400",
    crossLine: "border-slate-300",
    stackFront: "bg-slate-50/60 border-slate-200",
    stackGhost: "bg-slate-50/40 border-slate-100",
    stackBadge: "border-slate-200 text-slate-600 bg-slate-50",
    readyCard: "bg-gradient-to-br from-violet-50 via-white to-sky-50 border-violet-200 text-slate-800",
  },
};

/* ============================================================================
   Fonts + tiny animation keyframes
   ========================================================================== */

const fontImports = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  }
  body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;