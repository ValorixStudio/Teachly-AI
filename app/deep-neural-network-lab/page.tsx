"use client";
import { useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import * as XLSX from "xlsx";
import { createPortal } from "react-dom";
import * as math from "mathjs";
import {
  Brain, Share2, Home, Boxes, LineChart as LineChartIcon, CheckSquare, BarChart3, Sparkles,
  HelpCircle, Folder, Sun, Moon, Trash2, Plus, Minus, RotateCcw, Play, Save, Camera,
  MoreHorizontal, ChevronDown, Table2, Wand2, X, Check, Upload, Download, AlertTriangle,
} from "lucide-react";


type ActName = "Linear" | "ReLU" | "LeakyReLU" | "Sigmoid" | "Tanh" | "Softmax";

const INPUT_ACTIVATIONS: ActName[] = ["Linear", "Sigmoid", "Tanh", "ReLU"];
const HIDDEN_ACTIVATIONS: ActName[] = ["ReLU", "LeakyReLU", "Sigmoid", "Tanh", "Linear"];
const OUTPUT_ACTIVATIONS: ActName[] = ["Softmax", "Sigmoid", "Tanh", "Linear", "ReLU"];

function actApply(name: ActName, z: number): number {
  switch (name) {
    case "ReLU": return z > 0 ? z : 0;
    case "LeakyReLU": return z > 0 ? z : 0.01 * z;
    case "Sigmoid": return 1 / (1 + Math.exp(-z));
    case "Tanh": return Math.tanh(z);
    case "Linear": return z;
    default: return z; // Softmax is a vector op, handled separately
  }
}

function actDeriv(name: ActName, z: number, a: number): number {
  switch (name) {
    case "ReLU": return z > 0 ? 1 : 0;
    case "LeakyReLU": return z > 0 ? 1 : 0.01;
    case "Sigmoid": return a * (1 - a);
    case "Tanh": return 1 - a * a;
    case "Linear": return 1;
    default: return 1;
  }
}

function softmax(z: number[]): number[] {
  const m = Math.max(...z);
  const exps = z.map((v) => Math.exp(v - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

/* ================================================================== */
/*  Network configuration & weights (fully generic depth)              */
/* ================================================================== */

type NetConfig = {
  inputUnits: number;
  hiddenUnits: number[]; // one entry per hidden layer
  outputUnits: number;
  inputActivation: ActName;
  hiddenActivation: ActName;
  outputActivation: ActName;
};

type LayerWeights = { W: number[][]; b: number[] };
type NetWeights = LayerWeights[]; // length = hiddenUnits.length + 1

function randWeight(fanIn: number, fanOut: number) {
  const limit = Math.sqrt(6 / (fanIn + fanOut)); // Xavier/Glorot uniform
  return (Math.random() * 2 - 1) * limit;
}

function initNetwork(config: NetConfig, deterministic = false): NetWeights {
  const sizes = [config.inputUnits, ...config.hiddenUnits, config.outputUnits];
  const net: NetWeights = [];
  for (let i = 1; i < sizes.length; i++) {
    const nIn = sizes[i - 1], nOut = sizes[i];
    const W = Array.from({ length: nIn }, () =>
      Array.from({ length: nOut }, () => (deterministic ? 0 : randWeight(nIn, nOut)))
    );
    const b = Array.from({ length: nOut }, () => 0);
    net.push({ W, b });
  }
  return net;
}



function cloneNet(net: NetWeights): NetWeights {
  return net.map((l) => ({ W: l.W.map((r) => r.slice()), b: l.b.slice() }));
}
function zerosLikeNet(net: NetWeights): NetWeights {
  return net.map((l) => ({ W: l.W.map((r) => r.map(() => 0)), b: l.b.map(() => 0) }));
}
function paramCount(net: NetWeights): number {
  return net.reduce((s, l) => s + l.W.length * (l.W[0]?.length ?? 0) + l.b.length, 0);
}

function matVec(x: number[], W: number[][], b: number[]) {
  const out = new Array(b.length).fill(0);
  for (let j = 0; j < b.length; j++) {
    let s = b[j];
    for (let i = 0; i < x.length; i++) s += x[i] * W[i][j];
    out[j] = s;
  }
  return out;
}

type ForwardCache = { zs: number[][]; as: number[][] };

function forwardPass(x: number[], net: NetWeights, config: NetConfig): ForwardCache {
  const xIn = x.map((v) => actApply(config.inputActivation, v));
  const zs: number[][] = [];
  const as: number[][] = [xIn];
  for (let l = 0; l < net.length; l++) {
    const z = matVec(as[l], net[l].W, net[l].b);
    const isOutput = l === net.length - 1;
    const name = isOutput ? config.outputActivation : config.hiddenActivation;
    const a = name === "Softmax" ? softmax(z) : z.map((zi) => actApply(name, zi));
    zs.push(z);
    as.push(a);
  }
  return { zs, as };
}

/* ---- Loss functions: SSE / MSE / MAE / Cross Entropy ---- */
function lossAndOutputGrad(pred: number[], target: number[], lossFn: string) {
  const n = pred.length;
  let loss = 0;
  const dLda = new Array(n).fill(0);
  if (lossFn === "Cross Entropy") {
    for (let i = 0; i < n; i++) {
      const p = Math.min(Math.max(pred[i], 1e-7), 1 - 1e-7);
      loss += -target[i] * Math.log(p);
      dLda[i] = -target[i] / p;
    }
  } else if (lossFn === "Mean Absolute Error") {
    for (let i = 0; i < n; i++) {
      const diff = pred[i] - target[i];
      loss += Math.abs(diff) / n;
      dLda[i] = (diff > 0 ? 1 : diff < 0 ? -1 : 0) / n;
    }
  } else if (lossFn === "Sum Squared Error") {
    for (let i = 0; i < n; i++) {
      const diff = pred[i] - target[i];
      loss += diff * diff;
      dLda[i] = 2 * diff;
    }
  } else {
    // Mean Squared Error (default)
    for (let i = 0; i < n; i++) {
      const diff = pred[i] - target[i];
      loss += (diff * diff) / n;
      dLda[i] = (2 * diff) / n;
    }
  }
  return { loss, dLda };
}

function softmaxBackward(a: number[], dLda: number[]) {
  const n = a.length;
  const dz = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) {
      const dai_dzj = a[i] * ((i === j ? 1 : 0) - a[j]);
      s += dLda[i] * dai_dzj;
    }
    dz[j] = s;
  }
  return dz;
}

function denseBackward(prevA: number[], delta: number[]) {
  const dW = prevA.map((a) => delta.map((d) => a * d));
  return { dW, db: delta.slice() };
}

function propagateDeltaRaw(delta: number[], W: number[][]) {
  const nIn = W.length;
  const out = new Array(nIn).fill(0);
  for (let i = 0; i < nIn; i++) {
    let s = 0;
    for (let j = 0; j < delta.length; j++) s += W[i][j] * delta[j];
    out[i] = s;
  }
  return out;
}

type Grads = { dW: number[][]; db: number[] }[];

function backwardPass(cache: ForwardCache, net: NetWeights, config: NetConfig, target: number[], lossFn: string) {
  const L = net.length;
  const pred = cache.as[L];
  const { loss, dLda } = lossAndOutputGrad(pred, target, lossFn);
  let delta =
    config.outputActivation === "Softmax"
      ? softmaxBackward(pred, dLda)
      : dLda.map((d, i) => d * actDeriv(config.outputActivation, cache.zs[L - 1][i], pred[i]));
  const grads: Grads = new Array(L);
  for (let l = L - 1; l >= 0; l--) {
    const prevA = cache.as[l];
    const { dW, db } = denseBackward(prevA, delta);
    grads[l] = { dW, db };
    if (l > 0) {
      const raw = propagateDeltaRaw(delta, net[l].W);
      delta = raw.map((v, i) => v * actDeriv(config.hiddenActivation, cache.zs[l - 1][i], cache.as[l][i]));
    }
  }
  return { loss, grads };
}

function accumulateGrads(sum: NetWeights, g: Grads) {
  for (let l = 0; l < sum.length; l++) {
    for (let i = 0; i < sum[l].W.length; i++) for (let j = 0; j < sum[l].W[i].length; j++) sum[l].W[i][j] += g[l].dW[i][j];
    for (let j = 0; j < sum[l].b.length; j++) sum[l].b[j] += g[l].db[j];
  }
}
function scaleGrads(sum: NetWeights, s: number) {
  for (const l of sum) {
    for (const row of l.W) for (let j = 0; j < row.length; j++) row[j] *= s;
    for (let j = 0; j < l.b.length; j++) l.b[j] *= s;
  }
}

/* ---- Optimizers: GD / SGD / Adam / AdamW / RMSprop ---- */
type OptState = { m: NetWeights; v: NetWeights; t: number };
function createOptState(net: NetWeights): OptState {
  return { m: zerosLikeNet(net), v: zerosLikeNet(net), t: 0 };
}

function applyGradients(net: NetWeights, grads: NetWeights, opt: OptState, optimizer: string, lr: number, weightDecay: number) {
  opt.t += 1;
  const beta1 = 0.9, beta2 = 0.999, eps = 1e-8;
  const plain = optimizer === "GD (Full Batch)" || optimizer === "SGD (Mini-batch)";

  const updateScalar = (w: number, g: number, m: number, v: number, isWeight: boolean): [number, number, number] => {
    if (optimizer === "Adam" || optimizer === "AdamW") {
      const mN = beta1 * m + (1 - beta1) * g;
      const vN = beta2 * v + (1 - beta2) * g * g;
      const mHat = mN / (1 - Math.pow(beta1, opt.t));
      const vHat = vN / (1 - Math.pow(beta2, opt.t));
      let wN = w - (lr * mHat) / (Math.sqrt(vHat) + eps);
      if (optimizer === "AdamW" && isWeight) wN -= lr * weightDecay * w; // decoupled weight decay
      return [wN, mN, vN];
    }
    if (optimizer === "RMSprop") {
      const vN = beta2 * v + (1 - beta2) * g * g;
      const wN = w - (lr * g) / (Math.sqrt(vN) + eps);
      return [wN, m, vN];
    }
    // GD / SGD: plain gradient step
    return [w - lr * g, m, v];
  };

  for (let l = 0; l < net.length; l++) {
    for (let i = 0; i < net[l].W.length; i++) {
      for (let j = 0; j < net[l].W[i].length; j++) {
        const [wN, mN, vN] = updateScalar(net[l].W[i][j], grads[l].W[i][j], opt.m[l].W[i][j], opt.v[l].W[i][j], true);
        net[l].W[i][j] = wN; opt.m[l].W[i][j] = mN; opt.v[l].W[i][j] = vN;
      }
    }
    for (let j = 0; j < net[l].b.length; j++) {
      const [bN, mN, vN] = updateScalar(net[l].b[j], grads[l].b[j], opt.m[l].b[j], opt.v[l].b[j], false);
      net[l].b[j] = bN; opt.m[l].b[j] = mN; opt.v[l].b[j] = vN;
    }
  }
  void plain;
}

function trainEpoch(
  net: NetWeights, opt: OptState, trainSamples: Sample[], batchSize: number,
  optimizer: string, lr: number, lossFn: string, config: NetConfig, weightDecay: number
) {
  const idx = trainSamples.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const bs = optimizer === "GD (Full Batch)" ? trainSamples.length : Math.max(1, Math.min(batchSize, trainSamples.length));
  let totalLoss = 0;

  for (let start = 0; start < idx.length; start += bs) {
    const batchIdx = idx.slice(start, start + bs);
    const gradSum = zerosLikeNet(net);
    let batchLoss = 0;
    for (const bi of batchIdx) {
      const s = trainSamples[bi];
      const cache = forwardPass(s.x, net, config);
      const { loss, grads } = backwardPass(cache, net, config, s.y, lossFn);
      batchLoss += loss;
      accumulateGrads(gradSum, grads);
    }
    scaleGrads(gradSum, 1 / batchIdx.length);
    applyGradients(net, gradSum, opt, optimizer, lr, weightDecay);
    totalLoss += batchLoss;
  }
  return totalLoss / trainSamples.length;
}

function evaluateSet(net: NetWeights, dataset: Sample[], lossFn: string, config: NetConfig, isClassification: boolean) {
  let totalLoss = 0, correct = 0, absErrSum = 0, absErrCount = 0;
  for (const s of dataset) {
    const cache = forwardPass(s.x, net, config);
    const pred = cache.as[cache.as.length - 1];
    const { loss } = lossAndOutputGrad(pred, s.y, lossFn);
    totalLoss += loss;
    for (let i = 0; i < pred.length; i++) { absErrSum += Math.abs(pred[i] - s.y[i]); absErrCount++; }
    if (isClassification) {
      let predIdx = 0; for (let i = 1; i < pred.length; i++) if (pred[i] > pred[predIdx]) predIdx = i;
      let trueIdx = 0; for (let i = 1; i < s.y.length; i++) if (s.y[i] > s.y[trueIdx]) trueIdx = i;
      if (predIdx === trueIdx) correct++;
    }
  }
  return {
    loss: dataset.length ? totalLoss / dataset.length : 0,
    accuracy: dataset.length && isClassification ? (correct / dataset.length) * 100 : null,
    mae: absErrCount ? absErrSum / absErrCount : 0,
  };
}

function flattenNet(net: NetWeights): number[] {
  const vec: number[] = [];
  for (const l of net) {
    for (const row of l.W) for (const w of row) vec.push(w);
    for (const b of l.b) vec.push(b);
  }
  return vec;
}
function unflattenNet(net: NetWeights, vec: number[]): NetWeights {
  const clone = cloneNet(net);
  let idx = 0;
  for (const l of clone) {
    for (let i = 0; i < l.W.length; i++) for (let j = 0; j < l.W[i].length; j++) l.W[i][j] = vec[idx++];
    for (let j = 0; j < l.b.length; j++) l.b[j] = vec[idx++];
  }
  return clone;
}


function jacobianRow(cache: ForwardCache, net: NetWeights, config: NetConfig, k: number): number[] {
  const L = net.length;
  const pred = cache.as[L];
  const seed = pred.map((_, i) => (i === k ? 1 : 0));
  let delta =
    config.outputActivation === "Softmax"
      ? softmaxBackward(pred, seed)
      : seed.map((d, i) => d * actDeriv(config.outputActivation, cache.zs[L - 1][i], pred[i]));
  const grads: Grads = new Array(L);
  for (let l = L - 1; l >= 0; l--) {
    const prevA = cache.as[l];
    const { dW, db } = denseBackward(prevA, delta);
    grads[l] = { dW, db };
    if (l > 0) {
      const raw = propagateDeltaRaw(delta, net[l].W);
      delta = raw.map((v, i) => v * actDeriv(config.hiddenActivation, cache.zs[l - 1][i], cache.as[l][i]));
    }
  }
  const row: number[] = [];
  for (const g of grads) {
    for (const r of g.dW) for (const w of r) row.push(w);
    for (const b of g.db) row.push(b);
  }
  return row;
}

function canUseLM(net: NetWeights, dataset: Sample[], outputUnits: number) {
  const P = paramCount(net);
  const M = dataset.length * outputUnits;
  return { ok: P > 0 && P <= 180 && M > 0 && M <= 4000 && P * M <= 400000, P, M };
}


function lmTrialStep(net: NetWeights, config: NetConfig, dataset: Sample[], mu: number): NetWeights | null {
  const rows: number[][] = [];
  const residuals: number[] = [];
  for (const s of dataset) {
    const cache = forwardPass(s.x, net, config);
    const pred = cache.as[cache.as.length - 1];
    for (let k = 0; k < pred.length; k++) {
      residuals.push(pred[k] - s.y[k]);
      rows.push(jacobianRow(cache, net, config, k));
    }
  }
  const P = paramCount(net);
  try {
    const Jm = math.matrix(rows);
    const Jt = math.transpose(Jm);
    const JtJ = math.multiply(Jt, Jm) as math.Matrix;
    const I = math.identity(P) as math.Matrix;
    const A = math.add(JtJ, math.multiply(mu, I)) as math.Matrix;
    const rVec = math.matrix(residuals.map((v) => [v]));
    const JtR = math.multiply(Jt, rVec) as math.Matrix;
    const deltaCol = math.lusolve(A, JtR) as math.Matrix;
    const deltaArr = (deltaCol.toArray() as number[][]).map((r) => r[0]);
    const paramsVec = flattenNet(net);
    const newParams = paramsVec.map((p, i) => p - deltaArr[i]);
    return unflattenNet(net, newParams);
  } catch {
    return null; // singular matrix at this mu — caller should raise mu and retry
  }
}

function totalSSE(net: NetWeights, dataset: Sample[], config: NetConfig) {
  let sse = 0;
  for (const s of dataset) {
    const { as } = forwardPass(s.x, net, config);
    const pred = as[as.length - 1];
    for (let i = 0; i < pred.length; i++) { const d = pred[i] - s.y[i]; sse += d * d; }
  }
  return sse;
}



type Sample = { x: number[]; y: number[] };

function readSheetFile(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const wb = XLSX.read(reader.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" }) as unknown[][];
        const strRows = rows.map((r) => r.map((c) => (c === null || c === undefined ? "" : String(c))));
        resolve(strRows.filter((r) => r.some((c) => c.trim() !== "")));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error("Couldn't read that file"));
    reader.readAsBinaryString(file);
  });
}

function splitHeaderAndData(rows: string[][]): { headers: string[]; dataRows: string[][] } {
  if (rows.length === 0) return { headers: [], dataRows: [] };
  const first = rows[0];
  const looksLikeHeader = rows.length > 1 && first.some((c) => c.trim() !== "" && Number.isNaN(Number(c.trim())));
  if (looksLikeHeader) return { headers: first.map((h, i) => h.trim() || `Column ${i + 1}`), dataRows: rows.slice(1) };
  return { headers: first.map((_, i) => `Column ${i + 1}`), dataRows: rows };
}

/* ---- Input Dataset validation: strip ID/serial columns, reject bad files ---- */

// Normalizes a header for comparison: lowercase, strip everything but letters/digits.
// "Sr. No." -> "srno", "S No" -> "sno", "Row Number" -> "rownumber".
function normalizeHeaderKey(h: string): string {
  return h.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Exact-match keys (post-normalization) that identify an auto-generated
// row/serial identifier column. Kept as an exact-match set (rather than a
// suffix regex like /id$/) so ordinary feature names such as "Paid",
// "Valid", or "Grid" are never mistaken for an ID column.
const ID_COLUMN_KEYS = new Set([
  "sno", "srno", "slno", "sl", "serial", "serialno", "serialnumber",
  "id", "index", "indexno", "rowno", "rownumber", "rownum",
  "recordno", "recordnumber", "recordid", "rowid", "sampleid", "sampleno",
]);

function isIdHeaderName(h: string): boolean {
  return ID_COLUMN_KEYS.has(normalizeHeaderKey(h));
}

// Heuristic for an unlabeled auto-increment identifier column: every value
// present, numeric, and forming an unbroken 0,1,2,… or 1,2,3,… sequence.
function isAutoIncrementColumn(dataRows: string[][], colIdx: number): boolean {
  if (dataRows.length < 2) return false;
  const vals = dataRows.map((r) => (r[colIdx] ?? "").trim());
  if (vals.some((v) => v === "" || Number.isNaN(Number(v)))) return false;
  const nums = vals.map(Number);
  if (nums[0] !== 0 && nums[0] !== 1) return false;
  for (let i = 1; i < nums.length; i++) if (nums[i] !== nums[i - 1] + 1) return false;
  return true;
}

// Keywords identifying an obvious output/target column. Matched as a
// substring of the normalized header, except for the single-letter "y"
// which is matched exactly to avoid false positives (e.g. "Salary").
const OUTPUT_COLUMN_KEYWORDS = [
  "output", "target", "label",  "prediction", "predicted", "result", "dependentvariable", "dependentvar",
];

function isOutputHeaderName(h: string): boolean {
  const key = normalizeHeaderKey(h);
  if (key === "y") return true;
  if (/^y\d+$/.test(key)) return true; // y1, y2, ...
  return OUTPUT_COLUMN_KEYWORDS.some((kw) => key.includes(kw));
}

type InputValidation = { valid: boolean; message?: string };

// Validates raw headers from an uploaded Input Dataset sheet before any
// column is dropped. Rejects duplicate column names, obvious output/target
// columns, and sheets left with one or zero feature columns once ID/serial
// columns are excluded.
function validateInputHeaders(headers: string[]): InputValidation {
  if (headers.length === 0) {
    return { valid: false, message: "The uploaded Input Dataset appears to be empty. Please upload a file with a header row and feature columns." };
  }

  const seen = new Map<string, string>();
  for (const h of headers) {
    const key = h.trim().toLowerCase();
    if (seen.has(key)) {
      return { valid: false, message: `The uploaded Input Dataset contains duplicate column names ('${seen.get(key)}'). Please make sure every column name is unique.` };
    }
    seen.set(key, h.trim());
  }

  const outputCol = headers.find((h) => isOutputHeaderName(h));
  if (outputCol) {
    return { valid: false, message: `The uploaded Input Dataset contains an output column named '${outputCol}'. Please upload a dataset containing only input features.` };
  }

  const featureHeaders = headers.filter((h) => !isIdHeaderName(h));
  if (featureHeaders.length <= 1) {
    return { valid: false, message: "The uploaded Input Dataset must contain more than one input feature column (ID/serial-number columns don't count). Please upload a dataset with multiple feature columns." };
  }

  return { valid: true };
}

// Every column becomes a numeric feature: numeric columns parsed directly
// (missing values imputed to the column mean); text columns integer-encoded
// by sorted distinct value. Used for both the Input sheet and the Test sheet.
// ID/serial/index columns (by name or by auto-increment values) are detected
// and excluded so they never become input neurons.
function extractFeatureMatrix(rows: string[][]): { matrix: number[][]; headers: string[]; droppedIdColumns: string[] } {
  const { headers, dataRows } = splitHeaderAndData(rows);
  const numCols = headers.length;

  const isIdCol: boolean[] = headers.map((h, c) => isIdHeaderName(h) || isAutoIncrementColumn(dataRows, c));
  const keepCols = headers.map((_, c) => c).filter((c) => !isIdCol[c]);
  const droppedIdColumns = headers.filter((_, c) => isIdCol[c]);

  const isNumericCol: boolean[] = [];
  const means: number[] = [];
  const catMaps: Map<string, number>[] = [];
  for (let c = 0; c < numCols; c++) {
    if (isIdCol[c]) continue;
    const vals = dataRows.map((r) => (r[c] ?? "").trim());
    const nonEmpty = vals.filter((v) => v !== "");
    const numericCount = nonEmpty.filter((v) => !Number.isNaN(Number(v))).length;
    const numeric = nonEmpty.length > 0 && numericCount / nonEmpty.length >= 0.8;
    isNumericCol[c] = numeric;
    if (numeric) {
      const nums = nonEmpty.map(Number).filter((v) => !Number.isNaN(v));
      means[c] = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    } else {
      const uniq = Array.from(new Set(nonEmpty)).sort();
      const map = new Map<string, number>();
      uniq.forEach((v, i) => map.set(v, i));
      catMaps[c] = map;
    }
  }
  const matrix = dataRows.map((r) =>
    keepCols.map((c) => {
      const raw = (r[c] ?? "").trim();
      if (isNumericCol[c]) {
        const n = Number(raw);
        return raw === "" || Number.isNaN(n) ? means[c] : n;
      }
      return catMaps[c]?.get(raw) ?? 0;
    })
  );
  return { matrix, headers: keepCols.map((c) => headers[c]), droppedIdColumns };
}

type OutputExtract = { matrix: number[][]; classLabels: string[] | null; isClassification: boolean; outputNames: string[] };

type OutputValidation = { valid: boolean; message?: string };

// Validates a raw uploaded Output Dataset sheet *before* any parsing.
// The Output sheet must contain ONLY target values: a single label/target
// column, a one-hot-encoded classification block, or multiple columns whose
// names are clearly output/target-like (e.g. "y1", "Target_A", "Output").
// Anything else — several unrelated numeric columns, or an ID/serial
// column — means the user likely uploaded (or mixed in) input features, so
// it's rejected rather than silently misinterpreted.
function validateOutputHeaders(rows: string[][]): OutputValidation {
  const { headers, dataRows } = splitHeaderAndData(rows);
  const numCols = headers.length;

  if (numCols === 0 || dataRows.length === 0) {
    return { valid: false, message: "The uploaded Output Dataset appears to be empty. Please upload a file with target values." };
  }

  // An ID/serial/index column has no business being in the Output sheet.
  const idCol = headers.find((h) => isIdHeaderName(h));
  if (idCol) {
    return { valid: false, message: "Output Dataset should contain only target values." };
  }

  // A single column is always fine — it's either a regression target or a
  // classification label column (handled downstream by extractOutputData).
  if (numCols === 1) return { valid: true };

  // Multiple columns are fine if they're a one-hot classification block...
  const allBinaryOneHot = dataRows.every((r) => {
    let sum = 0;
    for (let c = 0; c < numCols; c++) {
      const v = Number((r[c] ?? "").trim());
      if (v !== 0 && v !== 1) return false;
      sum += v;
    }
    return Math.abs(sum - 1) < 1e-6;
  });
  if (allBinaryOneHot) return { valid: true };

  // ...or if every column is clearly named like a target/output (multi-output
  // regression, e.g. "Target_X", "Target_Y", "y1", "y2").
  const allHeadersLookLikeOutputs = headers.every((h) => isOutputHeaderName(h));
  if (allHeadersLookLikeOutputs) return { valid: true };

  // Otherwise this looks like a set of unrelated numeric feature columns,
  // i.e. an accidental Input sheet.
  return { valid: false, message: "Output Dataset should contain only target values." };
}

function extractOutputData(rows: string[][]): OutputExtract {
  const { headers, dataRows } = splitHeaderAndData(rows);
  const numCols = headers.length;

  if (numCols > 1) {
    const allBinaryOneHot = dataRows.every((r) => {
      let sum = 0;
      for (let c = 0; c < numCols; c++) {
        const v = Number((r[c] ?? "").trim());
        if (v !== 0 && v !== 1) return false;
        sum += v;
      }
      return Math.abs(sum - 1) < 1e-6;
    });
    if (allBinaryOneHot) {
      const matrix = dataRows.map((r) => headers.map((_, c) => Number((r[c] ?? "").trim())));
      return { matrix, classLabels: headers, isClassification: true, outputNames: headers };
    }
    const matrix = dataRows.map((r) =>
      headers.map((_, c) => { const n = Number((r[c] ?? "").trim()); return Number.isNaN(n) ? 0 : n; })
    );
    return { matrix, classLabels: null, isClassification: false, outputNames: headers };
  }

  const rawVals = dataRows.map((r) => (r[0] ?? "").trim());
  const uniq = Array.from(new Set(rawVals.filter((v) => v !== "")));
  const smallCardinality = uniq.length >= 2 && uniq.length <= 20;
  if (smallCardinality) {
    const numericLabels = uniq.every((v) => !Number.isNaN(Number(v)));
    const classLabels = numericLabels ? uniq.sort((a, b) => Number(a) - Number(b)) : uniq.sort();
    const matrix = dataRows.map((r) => {
      const raw = (r[0] ?? "").trim();
      const idx = classLabels.indexOf(raw);
      return classLabels.map((_, ci) => (ci === idx ? 1 : 0));
    });
    return { matrix, classLabels, isClassification: true, outputNames: classLabels };
  }

  const matrix = dataRows.map((r) => { const n = Number((r[0] ?? "").trim()); return [Number.isNaN(n) ? 0 : n]; });
  return { matrix, classLabels: null, isClassification: false, outputNames: [headers[0] || "Output"] };
}

const XOR_INPUT: number[][] = [
  [0, 0, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1], [1, 1, 0, 1],
  [0, 0, 0, 1], [1, 1, 1, 0], [0, 1, 0, 1], [1, 0, 1, 0],
];
const XOR_OUTPUT: number[][] = [
  [1, 0], [0, 1], [0, 1], [1, 0], [1, 0], [1, 0], [0, 1], [0, 1],
];

function buildSamples(inputMatrix: number[][], outputMatrix: number[][]): Sample[] {
  const n = Math.min(inputMatrix.length, outputMatrix.length);
  const out: Sample[] = [];
  for (let i = 0; i < n; i++) out.push({ x: inputMatrix[i], y: outputMatrix[i] });
  return out;
}

/* ================================================================== */
/*  Static content                                                     */
/* ================================================================== */

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "builder", label: "Builder", icon: Share2 },
  { key: "train", label: "Train", icon: LineChartIcon },
  { key: "test", label: "Test", icon: CheckSquare },
  { key: "visualize", label: "Visualize", icon: BarChart3 },
  { key: "explain", label: "Explain", icon: Sparkles },
];

const COMPONENTS = ["Input Layer", "Dense Layer", "Activation", "Dropout", "Output Layer"];
const MAX_EPOCHS_DEFAULT = 1000;
const HIDDEN_COLORS = ["#3b82f6", "#a855f7", "#06b6d4", "#8b5cf6", "#0ea5e9"];
const CLASS_COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f43f5e", "#f59e0b", "#06b6d4", "#ec4899", "#84cc16"];

function getHighlightIndices(selected: string | null, numLayers: number): number[] {
  if (!selected) return [];
  if (selected === "Input Layer") return [0];
  if (selected === "Output Layer") return [numLayers - 1];
  if (selected === "Dense Layer" || selected === "Activation") return Array.from({ length: Math.max(0, numLayers - 2) }, (_, i) => i + 1);
  return [];
}

type LayerDisplay = { name: string; units: number; type: string; activation: string; color: string };
function layerDisplayList(config: NetConfig): LayerDisplay[] {
  const list: LayerDisplay[] = [
    { name: "Input Layer", units: config.inputUnits, type: "Input", activation: config.inputActivation, color: "#22c55e" },
  ];
  config.hiddenUnits.forEach((u, i) => {
    list.push({ name: `Hidden Layer ${i + 1}`, units: u, type: "Dense", activation: config.hiddenActivation, color: HIDDEN_COLORS[i % HIDDEN_COLORS.length] });
  });
  list.push({ name: "Output Layer", units: config.outputUnits, type: "Dense", activation: config.outputActivation, color: "#f43f5e" });
  return list;
}

const VIEW_W = 1000, VIEW_H = 460;
function layerX(index: number, numLayers: number) {
  const margin = 110;
  return margin + ((VIEW_W - margin * 2) * index) / (numLayers - 1);
}
const MAX_VISIBLE_NODES = 20;
function nodeYs(count: number) {
  const visible = Math.min(count, MAX_VISIBLE_NODES);
  const maxSpacing = 62;
  const available = VIEW_H - 170; // headroom for the layer label + activation box
  const spacing = visible > 1 ? Math.min(maxSpacing, available / (visible - 1)) : 0;
  const total = (visible - 1) * spacing;
  const start = VIEW_H / 2 - total / 2;
  return Array.from({ length: visible }, (_, i) => start + i * spacing);
}



const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

@keyframes nns-scan { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
@keyframes nns-fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes nns-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }
@keyframes nns-pulseDot { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.5); } 70% { box-shadow: 0 0 0 6px rgba(34,211,238,0); } }

.nns-app, .nns-app *, .nns-app *::before, .nns-app *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
.nns-app {
  --blue-600:#0891B2; --blue-500:#22D3EE; --blue-400:#67E8F9; --purple-600:#7C3AED; --purple-500:#A855F7;
  --green-500:#16A34A; --green-400:#4ADE80; --rose-500:#F43F5E; --rose-400:#FB7185;
  --orange-500:#D97706; --orange-400:#F59E0B; --amber:#F59E0B; --cyan:#22D3EE;
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px; line-height: 1.4; width: 100%; min-height: 100vh; display: flex; flex-direction: column;
  position: relative; isolation: isolate; overflow-x: hidden;
}
.nns-app[data-theme="dark"] {
  --bg:#0A0D13; --panel-bg:rgba(16,21,31,0.86); --panel-border:rgba(103,232,249,0.14);
  --text-main:#EDF1F7; --text-muted:#7C8BA1; --text-soft:#C3CCDA;
  --input-bg:rgba(255,255,255,0.04); --hover-bg:rgba(103,232,249,0.08); --line:rgba(103,232,249,0.16);
  --grid-line: rgba(103,232,249,0.05); --card-shadow: 0 10px 30px rgba(0,0,0,0.45);
  --glow-bg: radial-gradient(ellipse 900px 420px at 50% -10%, rgba(34,211,238,0.14), transparent 65%);
}
.nns-app[data-theme="light"] {
  --bg:#EEF2F7; --panel-bg:rgba(255,255,255,0.86); --panel-border:rgba(15,23,42,0.08);
  --text-main:#111827; --text-muted:#64748B; --text-soft:#334155;
  --input-bg:#F5F8FB; --hover-bg:rgba(8,145,178,0.07); --line:rgba(15,23,42,0.08);
  --grid-line: rgba(15,23,42,0.045); --card-shadow: 0 10px 26px rgba(15,23,42,0.08);
  --glow-bg: radial-gradient(ellipse 900px 420px at 50% -10%, rgba(34,211,238,0.16), transparent 65%);
}
.nns-app { background: var(--bg); color: var(--text-main); }
.nns-app button { cursor: pointer; font-family: inherit; }
.nns-app select, .nns-app input, .nns-app button { font-family: inherit; font-size: inherit; color: inherit; }
.nns-app table { border-collapse: collapse; width: 100%; }
.nns-app svg text { font-family: inherit; }
.nns-app button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .nns-app *, .nns-app *::before, .nns-app *::after { animation: none !important; transition: none !important; } }
.nns-mono { font-family: 'JetBrains Mono', 'Menlo', monospace; }

.nns-app::before {
  content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 34px 34px;
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 90%);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 90%);
}
.nns-app::after { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background: var(--glow-bg); }

.nns-header { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:13px 20px; border-bottom:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); flex-wrap:wrap; position: relative; z-index: 5; }
.nns-header-left { display:flex; align-items:center; gap:12px; }
.nns-logo { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--cyan), var(--amber)); flex-shrink:0; box-shadow: 0 0 0 1px rgba(103,232,249,0.3), 0 4px 14px rgba(34,211,238,0.25); }
.nns-logo svg { width:19px; height:19px; color:#08131A; }
.nns-title { font-weight:800; font-size:15px; line-height:1.2; letter-spacing:-0.01em; }
.nns-subtitle { font-family: 'JetBrains Mono', monospace; font-size:10.5px; color:var(--cyan); letter-spacing: 0.04em; text-transform: uppercase; font-weight: 600; }

.nns-nav { display:flex; align-items:center; gap:2px; border:1px solid var(--panel-border); background:var(--input-bg); border-radius:10px; padding:3px; flex-wrap:wrap; }
.nns-nav-btn { display:flex; align-items:center; gap:6px; border-radius:7px; padding:7px 13px; font-size:12.5px; font-weight:700; color:var(--text-muted); background:transparent; border:none; transition:all .15s ease; }
.nns-nav-btn svg { width:14px; height:14px; }
.nns-nav-btn:hover { color:var(--text-main); background:var(--hover-bg); }
.nns-nav-btn.active { background: var(--input-bg); color:var(--cyan); box-shadow: inset 0 -2px 0 var(--cyan); }
.nns-help-btn { display:flex; align-items:center; justify-content:center; border-radius:7px; padding:7px 11px; color:var(--text-muted); background:transparent; border:none; transition: color .15s ease; }
.nns-help-btn svg { width:14px; height:14px; }
.nns-help-btn:hover { color:var(--amber); }

.nns-header-right { display:flex; align-items:center; gap:8px; position:relative; }
.nns-saved-btn { display:flex; align-items:center; gap:8px; border:1px solid var(--panel-border); border-radius:9px; padding:7px 13px; font-size:12.5px; font-weight:700; color:var(--text-muted); background:var(--input-bg); transition: all .15s ease; }
.nns-saved-btn svg { width:14px; height:14px; }
.nns-saved-btn:hover, .nns-saved-btn.open { color:var(--cyan); border-color: rgba(34,211,238,0.4); }
.nns-saved-badge { margin-left:2px; border-radius:4px; background:var(--amber); color:#1A1102; font-family: 'JetBrains Mono', monospace; font-size:10px; font-weight:800; padding:1px 6px; }

.nns-saved-panel { position:absolute; right:0; top:46px; z-index:30; width:280px; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(14px); border-radius:12px; padding:12px; box-shadow: var(--card-shadow); animation: nns-fadeIn 0.2s ease both; border-top: 2px solid var(--cyan); }
.nns-saved-panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.nns-saved-panel-header p { font-size:13px; font-weight:800; text-transform: uppercase; letter-spacing: 0.03em; }
.nns-saved-panel-close { color:var(--text-muted); background:none; border:none; display:flex; }
.nns-saved-panel-close svg { width:16px; height:16px; }
.nns-saved-empty { font-size:12px; color:var(--text-muted); font-weight: 500; line-height: 1.5; }
.nns-saved-list { display:flex; flex-direction:column; gap:8px; }
.nns-saved-item { border:1px solid var(--panel-border); border-left: 2px solid var(--green-400); background:var(--input-bg); border-radius:8px; padding:9px 11px; font-size:12px; }
.nns-saved-item-row { display:flex; justify-content:space-between; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.nns-saved-item-acc { color:var(--green-400); }
.nns-saved-item-meta { margin-top:3px; color:var(--text-muted); font-weight: 500; }
.nns-saved-item-actions { margin-top:8px; display:flex; gap:6px; }
.nns-saved-item-btn { flex:1; border:1px solid var(--panel-border); background:var(--panel-bg); border-radius:6px; padding:5px 0; font-size:11px; font-weight:700; color:var(--text-main); transition: all .15s ease; }
.nns-saved-item-btn:hover { border-color: rgba(34,211,238,0.4); color: var(--cyan); }
.nns-saved-item-btn.danger:hover { border-color: rgba(244,63,94,0.4); color: var(--rose-500); }

.nns-icon-toggle { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid var(--panel-border); border-radius:9px; color:var(--text-muted); background:var(--input-bg); transition: all .15s ease; }
.nns-icon-toggle svg { width:15px; height:15px; }
.nns-icon-toggle:hover { color:var(--amber); border-color: rgba(245,158,11,0.4); }
.nns-avatar { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg, var(--purple-500), var(--rose-500)); color:#fff; display:flex; align-items:center; justify-content:center; font-family: 'JetBrains Mono', monospace; font-size:13px; font-weight:800; }

.nns-builder { display:flex; gap:16px; padding:20px; flex-wrap:wrap; flex:1; position: relative; z-index: 1; }
.nns-sidebar { display:flex; flex-direction:column; gap:20px; width:100%; flex-shrink:0; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); border-radius:14px; padding:18px; box-shadow: var(--card-shadow); position: relative; overflow: hidden; }
.nns-sidebar::before, .nns-main .nns-panel::before, .nns-aside::before, .nns-hero::before, .nns-panel.nns-page-mid::before {
  content:""; position:absolute; top:0; left:0; right:0; height:2px; background: linear-gradient(90deg, var(--cyan), var(--amber) 60%, transparent);
}
.nns-main { display:flex; flex-direction:column; gap:16px; flex:1 1 480px; min-width:600px; }
.nns-aside { display:flex; flex-direction:column; gap:16px; width:100%; flex-shrink:0; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); border-radius:14px; padding:18px; overflow-y:auto; box-shadow: var(--card-shadow); position: relative; }
@media (min-width:1280px) { .nns-builder { flex-wrap:nowrap; } .nns-sidebar { width:280px; } .nns-aside { width:340px; } }

.nns-section-title { display:flex; align-items:center; gap:9px; }
.nns-section-badge { min-width:24px; height:20px; padding: 0 5px; border-radius:5px; border:1px solid var(--panel-border); background: var(--input-bg); color:var(--cyan); font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight: 700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.nns-section-badge::before { content: "\\00a7"; margin-right: 1px; opacity: 0.6; }
.nns-section-label { font-size:11.5px; font-weight:800; letter-spacing:0.07em; text-transform: uppercase; color:var(--text-soft); }
.nns-block-label { margin-bottom:8px; font-family: 'JetBrains Mono', monospace; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-muted); }

.nns-components { display:flex; flex-direction:column; gap:7px; }
.nns-component-btn { display:flex; align-items:center; gap:8px; border-radius:9px; padding:9px 12px; font-size:12.5px; font-weight: 600; border:1px solid var(--panel-border); background:var(--input-bg); transition:all .15s ease; text-align:left; width:100%; }
.nns-component-btn svg.nns-box-icon { width:15px; height:15px; color:var(--cyan); flex-shrink:0; }
.nns-component-btn:hover { border-color:rgba(34,211,238,0.45); background:rgba(34,211,238,0.06); }
.nns-component-btn.selected { border-color:var(--cyan); background:rgba(34,211,238,0.1); box-shadow: inset 2px 0 0 var(--cyan); }
.nns-component-check { margin-left:auto; width:14px; height:14px; color:var(--cyan); flex-shrink:0; }
.nns-hint { margin-top:8px; font-size:11px; color:var(--text-muted); font-weight: 500; line-height: 1.5; }

.nns-settings { display:flex; flex-direction:column; gap:16px; }
.nns-slider-row { display:flex; align-items:center; justify-content:space-between; font-size:12.5px; margin-bottom:6px; }
.nns-slider-row span:first-child { color:var(--text-soft); font-weight: 700; }
.nns-slider-value { color:var(--cyan); font-family: 'JetBrains Mono', monospace; font-weight: 700; }
.nns-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:999px; background:rgba(124,139,161,0.28); cursor:pointer; outline:none; display:block; }
.nns-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:14px; height:14px; border-radius:3px; transform: rotate(45deg); background:var(--cyan); border:2px solid var(--bg); cursor:pointer; box-shadow: 0 0 8px rgba(34,211,238,0.6); }
.nns-slider::-moz-range-thumb { width:14px; height:14px; border-radius:3px; transform: rotate(45deg); background:var(--cyan); border:2px solid var(--bg); cursor:pointer; box-shadow: 0 0 8px rgba(34,211,238,0.6); }
.nns-slider::-moz-range-track { background:rgba(124,139,161,0.28); height:4px; border-radius:999px; }

.nns-select-label { margin-bottom:6px; font-family: 'JetBrains Mono', monospace; font-size:10px; text-transform: uppercase; letter-spacing: 0.06em; color:var(--text-muted); font-weight: 700; }
.nns-select-wrap { position:relative; border:1px solid var(--panel-border); background:var(--input-bg); border-radius:9px; }
.nns-select { -webkit-appearance:none; appearance:none; width:100%; background:transparent; border:none; outline:none; padding:9px 32px 9px 12px; font-size:12.5px; font-weight: 600; border-radius:9px; cursor:pointer; }
.nns-select option { background:var(--input-bg); color:var(--text-main); }
.nns-select-chevron { position:absolute; right:10px; top:50%; transform:translateY(-50%); width:15px; height:15px; color:var(--text-muted); pointer-events:none; }
.nns-select-wrap.disabled { opacity: 0.5; pointer-events: none; }

.nns-actions { display:flex; flex-direction:column; gap:8px; margin-top:auto; padding-top:8px; }
.nns-btn-primary { display:flex; align-items:center; justify-content:center; gap:8px; border-radius:9px; padding:11px; font-size:12.5px; font-weight:800; text-transform: uppercase; letter-spacing: 0.04em; color:#0B1520; background:linear-gradient(100deg, var(--cyan), var(--amber)); border:none; transition:all .15s ease; width:100%; position: relative; overflow: hidden; }
.nns-btn-primary::after { content:""; position:absolute; top:0; bottom:0; width:40%; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent); animation: nns-scan 2.8s linear infinite; }
.nns-btn-primary svg { width:15px; height:15px; position: relative; z-index: 1; }
.nns-btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
.nns-btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
.nns-btn-primary:disabled::after { animation: none; }
.nns-btn-secondary { display:flex; align-items:center; justify-content:center; gap:8px; border-radius:9px; padding:11px; font-size:12.5px; font-weight:700; border:1px solid var(--panel-border); background:var(--input-bg); color:var(--text-main); width:100%; transition: all .15s ease; }
.nns-btn-secondary svg { width:15px; height:15px; }
.nns-btn-secondary:hover { border-color: rgba(34,211,238,0.4); color: var(--cyan); }
.nns-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

.nns-panel { border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); border-radius:14px; padding:18px; box-shadow: var(--card-shadow); position: relative; overflow: hidden; }
.nns-panel-header { display:flex; align-items:center; justify-content:space-between; padding-bottom:13px; flex-wrap:wrap; gap:8px; }
.nns-toolbar { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.nns-toolbar-btn { display:flex; align-items:center; gap:6px; font-size:12px; font-weight: 700; color:var(--text-muted); background:none; border:none; transition: color .15s ease; }
.nns-toolbar-btn svg { width:14px; height:14px; }
.nns-toolbar-btn:hover { color:var(--amber); }
.nns-zoom { display:flex; align-items:center; gap:0; border:1px solid var(--panel-border); border-radius:8px; overflow:hidden; background: var(--input-bg); }
.nns-zoom span { padding:0 8px; font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight: 700; color:var(--text-muted); }
.nns-zoom button { width:26px; height:26px; display:flex; align-items:center; justify-content:center; background:none; border:none; color:var(--text-main); }
.nns-zoom button svg { width:13px; height:13px; }
.nns-zoom button:hover { background:var(--hover-bg); color: var(--cyan); }
.nns-zoom-value { width:40px; text-align:center; font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight: 700; }
.nns-icon-danger { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid var(--panel-border); border-radius:9px; background:var(--input-bg); color:var(--text-muted); transition: all .15s ease; }
.nns-icon-danger svg { width:15px; height:15px; }
.nns-icon-danger:hover { color:var(--rose-500); border-color:rgba(244,63,94,0.4); background: rgba(244,63,94,0.06); }

.nns-canvas-wrap { width:100%; height:100%; overflow-x:auto; }
.nns-canvas-svg { display:block; margin:0 auto; width:100%; min-width:640px; }

.nns-legend { margin-top:14px; display:flex; flex-wrap:wrap; align-items:center; gap:18px; border:1px dashed var(--panel-border); background: var(--input-bg); border-radius:10px; padding:9px 15px; font-size:11.5px; font-weight: 600; color:var(--text-muted); }
.nns-legend strong { font-family: 'JetBrains Mono', monospace; font-weight:700; color:var(--text-main); text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.05em; }
.nns-legend-item { display:flex; align-items:center; gap:6px; }
.nns-legend-dot { width:8px; height:8px; border-radius:2px; flex-shrink:0; }
.nns-legend-line { width:16px; height:1px; background:var(--text-muted); }

.nns-dashboard-row { margin-top:14px; display:flex; gap:16px; flex-wrap:wrap; }
.nns-chart-col { flex:1 1 280px; min-width:280px; }
.nns-chart-col-label { margin-bottom:8px; font-family: 'JetBrains Mono', monospace; font-size:10.5px; font-weight:700; text-transform: uppercase; letter-spacing: 0.05em; color:var(--text-muted); }
.nns-stats-grid { width:100%; flex-shrink:0; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
@media (min-width:1024px) { .nns-stats-grid { width:256px; } }

.nns-stat-card { border:1px solid var(--panel-border); border-left: 2px solid var(--cyan); background: var(--input-bg); border-radius:9px; padding:12px; transition: all .15s ease; }
.nns-stat-card:hover { border-left-color: var(--amber); }
.nns-stat-label { font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color:var(--text-muted); display:flex; align-items:center; gap:5px; }
.nns-stat-value { margin-top:5px; font-family: 'JetBrains Mono', monospace; font-size:19px; font-weight:700; }
.nns-stat-sub { margin-left:3px; font-size:12px; font-weight:600; opacity:0.7; }
.nns-c-blue { color:var(--blue-400); } .nns-c-orange { color:var(--orange-400); } .nns-c-green { color:var(--green-400); }
.nns-c-purple { color:var(--purple-500); } .nns-c-rose { color:var(--rose-400); }

.nns-chart-box { border:1px solid var(--panel-border); background: var(--input-bg); border-radius:10px; padding:13px; }
.nns-chart-box svg { width:100%; display:block; }
.nns-chart-legend { margin-top:6px; display:flex; align-items:center; gap:16px; font-size:11px; font-weight: 600; }
.nns-chart-legend-item { display:flex; align-items:center; gap:6px; }
.nns-chart-legend-swatch { width:14px; height:2px; display:inline-block; }

.nns-table-wrap { overflow:hidden; border:1px solid var(--panel-border); border-radius:10px; }
.nns-table { font-size:11.5px; text-align:left; }
.nns-table thead { background:var(--input-bg); }
.nns-table th { padding:9px 8px; font-family: 'JetBrains Mono', monospace; font-weight:700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.04em; color:var(--text-muted); border-bottom: 1px solid var(--panel-border); }
.nns-table td { padding:8px; font-weight: 600; border-top:1px solid var(--panel-border); }
.nns-table tbody tr:hover { background: var(--hover-bg); }
.nns-param-row { margin-top:10px; display:flex; align-items:center; justify-content:space-between; border:1px solid var(--panel-border); background:var(--input-bg); border-radius:10px; padding:9px 13px; font-size:12.5px; }
.nns-param-row span:first-child { color:var(--text-muted); font-weight: 700; }
.nns-param-row span:last-child { font-family: 'JetBrains Mono', monospace; font-weight:700; color: var(--cyan); }

.nns-heatmap { display:flex; gap:8px; border:1px solid var(--panel-border); background: var(--input-bg); border-radius:10px; padding:13px; }
.nns-heatmap-labels { display:flex; flex-direction:column; justify-content:space-between; font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 600; color:var(--text-muted); }
.nns-heatmap-grid { display:grid; gap:2px; }
.nns-heatmap-cell { aspect-ratio:1/1; border-radius:2px; }
.nns-heatmap-collabels { margin-top:4px; display:grid; gap:2px; font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 600; color:var(--text-muted); }
.nns-heatmap-collabels span { text-align:center; }
.nns-heatmap-scale { display:flex; flex-direction:column; justify-content:space-between; font-family: 'JetBrains Mono', monospace; font-size:9.5px; font-weight: 600; color:var(--text-muted); }

.nns-output { display:flex; flex-direction:column; gap:9px; border:1px solid var(--panel-border); background: var(--input-bg); border-radius:10px; padding:13px; }
.nns-output-row { display:flex; align-items:center; gap:12px; font-family: 'JetBrains Mono', monospace; font-size:12px; font-weight: 700; }
.nns-output-label { width:16px; color:var(--text-muted); }
.nns-output-track { height:8px; flex:1; overflow:hidden; border-radius:3px; background:rgba(124,139,161,0.2); }
.nns-output-fill { height:100%; border-radius:3px; transition: width .4s ease; }
.nns-output-val { width:40px; text-align:right; font-variant-numeric:tabular-nums; }

.nns-divider { border-top:1px dashed var(--panel-border); padding-top:18px; margin-top:4px; }
.nns-data-content { margin-top:10px; border:1px solid var(--panel-border); background: var(--input-bg); border-radius:9px; padding:10px 13px; font-size:11.5px; font-weight: 600; }
.nns-data-content-row { display:flex; align-items:center; justify-content:space-between; }
.nns-data-muted { color:var(--text-muted); font-weight: 700; }
.nns-data-accent { color:var(--cyan); font-weight: 700; }
.nns-data-btn { margin-top:10px; display:flex; width:100%; align-items:center; justify-content:center; gap:8px; border:1px solid var(--panel-border); border-radius:9px; padding:9px 0; font-size:12px; font-weight: 700; background:var(--input-bg); color:var(--text-main); transition: all .15s ease; }
.nns-data-btn svg { width:15px; height:15px; }
.nns-data-btn:hover { border-color: rgba(34,211,238,0.4); color: var(--cyan); }
.nns-data-btn.uploaded { border-color: rgba(74,222,128,0.5); color: var(--green-400); }
.nns-data-warn { margin-top:8px; display:flex; align-items:flex-start; gap:7px; border:1px solid rgba(245,158,11,0.35); background: rgba(245,158,11,0.08); border-radius:8px; padding:8px 10px; font-size:11px; font-weight:600; color: var(--orange-400); line-height:1.5; }
.nns-data-warn svg { width:14px; height:14px; flex-shrink:0; margin-top:1px; }

.nns-page { display:flex; flex-direction:column; gap:16px; padding:20px; flex:1; position: relative; z-index: 1; }
.nns-page-mid { max-width:768px; }
.nns-explain-text { margin-top:14px; display:flex; flex-direction:column; gap:14px; font-size:13.5px; font-weight: 500; line-height: 1.7; color:var(--text-soft); }

.nns-hero { border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); border-radius:16px; padding:26px 24px; box-shadow: var(--card-shadow); position: relative; overflow: hidden; }
.nns-hero h1 { font-size:23px; font-weight:800; letter-spacing: -0.01em; }
.nns-hero-sub { margin-top:8px; font-size:13.5px; font-weight: 500; line-height: 1.6; color:var(--text-muted); max-width: 520px; }
.nns-hero-stats { margin-top:20px; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
@media (min-width:640px) { .nns-hero-stats { grid-template-columns:repeat(4,1fr); } }
.nns-hero-actions { margin-top:22px; display:flex; flex-wrap:wrap; gap:10px; }
.nns-hero-btn-primary { border-radius:9px; padding:11px 18px; font-size:12.5px; font-weight:800; text-transform: uppercase; letter-spacing: 0.03em; color:#0B1520; background:linear-gradient(100deg, var(--cyan), var(--amber)); border:none; transition: all .15s ease; }
.nns-hero-btn-primary:hover { filter: brightness(1.08); }
.nns-hero-btn-secondary { border-radius:9px; padding:11px 18px; font-size:12.5px; font-weight: 700; border:1px solid var(--panel-border); background:var(--input-bg); color:var(--text-main); transition: all .15s ease; }
.nns-hero-btn-secondary:hover { border-color: rgba(34,211,238,0.4); color: var(--cyan); }

.nns-test-bits { margin-top:14px; display:flex; gap:10px; flex-wrap: wrap; }
.nns-bit-btn { width:46px; height:46px; display:flex; align-items:center; justify-content:center; border-radius:9px; border:1px solid var(--panel-border); background:var(--input-bg); color:var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size:17px; font-weight:700; transition: all .15s ease; }
.nns-bit-btn.active { border-color:var(--cyan); background:rgba(34,211,238,0.12); color:var(--cyan); }
.nns-test-field { display:flex; flex-direction:column; gap:5px; }
.nns-test-field-label { font-family: 'JetBrains Mono', monospace; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); text-align:center; }
.nns-test-field input { width:74px; border-radius:9px; border:1px solid var(--panel-border); background:var(--input-bg); color:var(--text-main); font-family: 'JetBrains Mono', monospace; font-size:14px; font-weight:700; text-align:center; padding:11px 6px; }
.nns-test-field input:focus { outline: 2px solid var(--cyan); outline-offset: 1px; }
.nns-test-result { margin-top:18px; border:1px solid var(--panel-border); border-left: 2px solid var(--green-400); background: var(--input-bg); border-radius:10px; padding:13px; font-size:13px; animation: nns-fadeIn 0.25s ease both; }
.nns-test-result-value { margin-top:6px; font-family: 'JetBrains Mono', monospace; font-size:17px; font-weight:700; color:var(--cyan); }
.nns-test-hint { margin-top:18px; font-size:12.5px; font-weight: 600; color:var(--text-muted); line-height: 1.6; }
.nns-test-model-row { margin-top:14px; display:flex; align-items:center; gap:8px; flex-wrap: wrap; }
.nns-test-model-select { flex:1; min-width:200px; }

.nns-hidden-row { display:flex; align-items:center; gap:8px; }
.nns-hidden-row-label { flex-shrink:0; width:64px; font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight:700; color:var(--text-muted); }
.nns-hidden-row input { flex:1; min-width:0; border-radius:8px; border:1px solid var(--panel-border); background:var(--input-bg); color:var(--text-main); font-family: 'JetBrains Mono', monospace; font-size:12.5px; font-weight:700; text-align:center; padding:7px 4px; }
.nns-hidden-row button { flex-shrink:0; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:7px; border:1px solid var(--panel-border); background:var(--panel-bg); color:var(--text-muted); }
.nns-hidden-row button:hover { color:var(--rose-500); border-color: rgba(244,63,94,0.4); }
.nns-hidden-row button svg { width:12px; height:12px; }
.nns-add-hidden-btn { margin-top:4px; display:flex; align-items:center; justify-content:center; gap:6px; width:100%; border-radius:8px; border:1px dashed var(--panel-border); background:var(--input-bg); color:var(--text-muted); padding:8px 0; font-size:11.5px; font-weight:700; }
.nns-add-hidden-btn:hover { color:var(--cyan); border-color: rgba(34,211,238,0.4); }
.nns-add-hidden-btn svg { width:13px; height:13px; }
.nns-add-hidden-btn:disabled { opacity:0.4; cursor:not-allowed; }

.nns-modal-overlay { position:fixed; inset:0; z-index:40; display:flex; align-items:center; justify-content:center; background:rgba(6,9,15,0.65); backdrop-filter: blur(4px); padding:16px; }
.nns-modal { width:100%; max-width:560px; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(16px); border-radius:14px; padding:18px; box-shadow: var(--card-shadow); animation: nns-fadeIn 0.2s ease both; border-top: 2px solid var(--amber); }
.nns-modal-header { margin-bottom:13px; display:flex; align-items:center; justify-content:space-between; }
.nns-modal-header p { font-weight:800; font-size: 13px; font-family: 'JetBrains Mono', monospace; }
.nns-modal-close { color:var(--text-muted); background:none; border:none; display:flex; }
.nns-modal-close svg { width:16px; height:16px; }
.nns-modal-table-wrap { max-height:288px; overflow-y:auto; overflow-x:auto; border:1px solid var(--panel-border); border-radius:10px; }
.nns-modal-foot { margin-top:13px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.nns-modal-foot-note { font-size:11.5px; color:var(--text-muted); font-weight:500; line-height:1.5; max-width:340px; }
.nns-modal-body-text { display:flex; flex-direction:column; gap:12px; font-size:13px; font-weight:500; line-height:1.65; color:var(--text-soft); }
.nns-modal-body-text strong { color:var(--text-main); }
.nns-shortcut-row { display:flex; align-items:center; justify-content:space-between; padding:8px 2px; border-top:1px solid var(--panel-border); font-size:12.5px; }
.nns-shortcut-row:first-child { border-top:none; }
.nns-kbd { font-family:'JetBrains Mono', monospace; font-size:11px; font-weight:700; background:var(--input-bg); border:1px solid var(--panel-border); border-radius:5px; padding:3px 7px; color:var(--cyan); }

.nns-toast { position:fixed; bottom:52px; left:50%; transform:translateX(-50%); z-index:50; border-radius:8px; background:#0A0D13; color:var(--cyan); font-family: 'JetBrains Mono', monospace; padding:9px 16px 9px 14px; font-size:12.5px; font-weight: 600; box-shadow:0 10px 28px rgba(0,0,0,0.4); border:1px solid rgba(34,211,238,0.35); animation: nns-fadeIn 0.2s ease both; max-width: calc(100vw - 32px); text-align: left; }
.nns-toast::before { content: "\\203a"; color: var(--amber); margin-right: 8px; font-weight: 800; animation: nns-blink 1.1s step-start infinite; }

.nns-footer { display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(10px); padding:9px 20px; font-family: 'JetBrains Mono', monospace; font-size:11px; font-weight: 600; color:var(--text-muted); position:relative; z-index: 5; }
.nns-footer-status { display:flex; align-items:center; gap:8px; text-transform: uppercase; letter-spacing: 0.04em; }
.nns-status-dot { width:7px; height:7px; border-radius:2px; background:var(--green-500); animation: nns-pulseDot 1.8s ease-in-out infinite; }
.nns-status-dot.training { background:var(--amber); }
.nns-footer-center { display:none; text-transform: uppercase; letter-spacing: 0.04em; }
@media (min-width:640px) { .nns-footer-center { display:block; } }
.nns-footer-actions { display:flex; align-items:center; gap:14px; position:relative; }
.nns-footer-actions button { background:none; border:none; color:inherit; display:flex; transition: color .15s ease; }
.nns-footer-actions button svg { width:15px; height:15px; }
.nns-footer-actions button:hover { color:var(--cyan); }
.nns-more-menu { position:absolute; bottom:34px; right:0; z-index:30; width:200px; border:1px solid var(--panel-border); background:var(--panel-bg); backdrop-filter: blur(14px); border-radius:10px; padding:5px; box-shadow: var(--card-shadow); animation: nns-fadeIn 0.2s ease both; }
.nns-more-menu button { width:100%; text-align:left; border-radius:7px; padding:8px 11px; font-size:11.5px; font-weight: 700; background:none; border:none; color:var(--text-main); display:flex; align-items:center; gap:8px; }
.nns-more-menu button:hover { background:var(--hover-bg); color: var(--cyan); }

.nns-tip-icon { display:inline-flex; align-items:center; justify-content:center; width:14px; height:14px; border:none; background:none; padding:0; color:var(--text-muted); cursor:help; flex-shrink:0; transition: color .15s ease; }
.nns-tip-icon svg { width:100%; height:100%; }
.nns-tip-icon:hover, .nns-tip-icon:focus-visible { color:var(--cyan); }
.nns-tip-bubble { position: fixed; transform: translate(-50%, calc(-100% - 11px)); background:#0A0D13; color:#E7ECF3; border:1px solid rgba(34,211,238,0.4); border-radius:8px; padding:9px 12px; font-size:11.5px; font-weight:500; line-height:1.55; box-shadow:0 12px 30px rgba(0,0,0,0.45); z-index:100; pointer-events:none; animation: nns-fadeIn 0.12s ease both; }
.nns-tip-bubble::after { content:""; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:6px solid transparent; border-top-color:#0A0D13; }
`;

/* ================================================================== */
/*  Tooltip                                                             */
/* ================================================================== */

function Tip({ text, width = 230 }: { text: string; width?: number }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLButtonElement | null>(null);
  function open() {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.top, left: rect.left + rect.width / 2 });
    setShow(true);
  }
  function close() { setShow(false); }
  const canUseDom = typeof document !== "undefined";
  return (
    <>
      <button type="button" ref={ref} className="nns-tip-icon" onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close} onClick={(e) => e.preventDefault()} aria-label={text}>
        <HelpCircle />
      </button>
      {canUseDom && show && createPortal(
        <div className="nns-tip-bubble" style={{ top: pos.top, left: pos.left, width }} role="tooltip">{text}</div>,
        document.body
      )}
      </>
  );
}

function SectionTitle({ badge, label, tip }: { badge: string | number; label: string; tip?: string }) {
  return (
    <div className="nns-section-title">
      <span className="nns-section-badge">{badge}</span>
      <span className="nns-section-label">{label}</span>
      {tip && <Tip text={tip} />}
    </div>
  );
}

/* ================================================================== */
/*  Saved model type                                                    */
/* ================================================================== */

type SavedModel = {
  id: number;
  epoch: number;
  accuracy: string | null;
  trainLoss: string;
  optimizer: string;
  algorithm: string;
  learningRate: number;
  datasetName: string;
  config: NetConfig;
  classLabels: string[] | null;
  outputNames: string[];
  isClassification: boolean;
  network: NetWeights;
};

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

export default function Page() {
  const [activeTab, setActiveTab] = useState("builder");
  const [dark, setDark] = useState(true);

  // ---- Hyperparameters ----
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochsTarget, setEpochsTarget] = useState(MAX_EPOCHS_DEFAULT);
  const [batchSize, setBatchSize] = useState(32);
  const [weightDecay, setWeightDecay] = useState(0.01);
  const [lossFn, setLossFn] = useState("Mean Squared Error");
  const [algorithm, setAlgorithm] = useState("Backpropagation"); // "Backpropagation" | "Levenberg-Marquardt"
  const [optimizer, setOptimizer] = useState("Adam");
  const [zoom, setZoom] = useState(100);

  // ---- Architecture config ----
  const [config, setConfig] = useState<NetConfig>({
    inputUnits: 4, hiddenUnits: [6, 5], outputUnits: 2,
    inputActivation: "Linear", hiddenActivation: "ReLU", outputActivation: "Softmax",
  });

  // ---- Training state ----
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [trainHistory, setTrainHistory] = useState<number[]>([]);
  const [valHistory, setValHistory] = useState<number[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(0);
  const [mae, setMae] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const networkSvgRef = useRef<SVGSVGElement | null>(null);
  const lmMuRef = useRef(0.01);

 const [renderNetwork, setRenderNetwork] = useState<NetWeights>(() => initNetwork(config, /* deterministic */ true));

const networkRef = useRef<NetWeights>(renderNetwork);
const optStateRef = useRef<OptState | null>(null);

useEffect(() => {
  // Randomize weights only on the client, after hydration completes,
  // so SSR and the first client render match exactly.
  const net = initNetwork(config);
  networkRef.current = net;
  setRenderNetwork(net);
  optStateRef.current = createOptState(net);
}, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [dataTab, setDataTab] = useState("Dataset");
  const [showDataModal, setShowDataModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(true);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [toast, setToast] = useState<React.ReactNode | null>(null);
  const [testInputs, setTestInputs] = useState<number[]>([0, 1, 0, 1]);

  // ---- Dataset state ----
  const [samples, setSamples] = useState<Sample[]>(buildSamples(XOR_INPUT, XOR_OUTPUT));
  const [classLabels, setClassLabels] = useState<string[] | null>(["Class 1", "Class 2"]);
  const [outputNames, setOutputNames] = useState<string[]>(["Class 1", "Class 2"]);
  const [isClassification, setIsClassification] = useState(true);
  const [inputFileName, setInputFileName] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string | null>(null);
  const [datasetName, setDatasetName] = useState("Demo: XOR Dataset");
  const [rowMismatchWarning, setRowMismatchWarning] = useState<string | null>(null);

  const [testSet, setTestSet] = useState<{ matrix: number[][]; headers: string[] } | null>(null);
  const [testFileName, setTestFileName] = useState<string | null>(null);
  const [testPredictions, setTestPredictions] = useState<{ row: number[]; predicted: string; confidence: number }[] | null>(null);

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const outputFileRef = useRef<HTMLInputElement | null>(null);
  const testFileRef = useRef<HTMLInputElement | null>(null);
  const pendingInputMatrixRef = useRef<number[][] | null>(null);
  const pendingOutputRef = useRef<OutputExtract | null>(null);

  const trainLoss = trainHistory.length ? trainHistory[trainHistory.length - 1] : 1;
  const valLoss = valHistory.length ? valHistory[valHistory.length - 1] : 1;
  const layers = layerDisplayList(config);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (["INPUT", "SELECT", "TEXTAREA"].includes(tag)) return;
      if (e.code === "Space") { e.preventDefault(); startTraining(); }
      else if (e.key.toLowerCase() === "r") resetNetwork();
      else if (e.key.toLowerCase() === "s") handleSaveModel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function showToast(msg: React.ReactNode) { setToast(msg); }


  function startTraining() {
    if (isTraining || samples.length < 4) {
      if (samples.length < 4) showToast("Need at least 4 samples to train — load an Input + Output sheet first");
      return;
    }
    setIsTraining(true);
    setEpoch(0);
    setTrainHistory([]);
    setValHistory([]);
    setAccuracy(isClassification ? 0 : null);
    setMae(0);
    setActiveModelId(null);

    networkRef.current = initNetwork(config);
    setRenderNetwork(networkRef.current);
    optStateRef.current = createOptState(networkRef.current);
    lmMuRef.current = 0.01;

    const valCount = Math.max(1, Math.min(Math.floor(samples.length * 0.2), samples.length - 2));
    const trainSet = samples.length > 4 ? samples.slice(0, samples.length - valCount) : samples;
    const valSet = samples.length > 4 ? samples.slice(samples.length - valCount) : samples;

    if (algorithm === "Levenberg-Marquardt") {
      const check = canUseLM(networkRef.current, trainSet, config.outputUnits);
      if (!check.ok) {
        setIsTraining(false);
        showToast(`LM needs a smaller problem here (params=${check.P}, residuals=${check.M}) — reduce hidden neurons/dataset or switch to Backpropagation`);
        return;
      }
    }

    let e = 0;
    const stepEvery = Math.max(1, Math.floor(epochsTarget / 200));

    intervalRef.current = setInterval(() => {
      const net = networkRef.current!;
      let lastTrainLoss = 0;

      if (algorithm === "Levenberg-Marquardt") {
        const before = totalSSE(net, trainSet, config);
        let accepted = false;
        for (let tries = 0; tries < 6 && !accepted; tries++) {
          const trial = lmTrialStep(net, config, trainSet, lmMuRef.current);
          if (!trial) { lmMuRef.current *= 10; continue; }
          const after = totalSSE(trial, trainSet, config);
          if (after < before) {
            networkRef.current = trial;
            setRenderNetwork(trial);
            lmMuRef.current = Math.max(1e-7, lmMuRef.current / 10);
            accepted = true;
          } else {
            lmMuRef.current *= 10;
          }
        }
        e += 1;
        const evalRes = evaluateSet(networkRef.current, trainSet, lossFn, config, isClassification);
        lastTrainLoss = evalRes.loss;
      } else {
        for (let k = 0; k < stepEvery && e < epochsTarget; k++) {
          lastTrainLoss = trainEpoch(net, optStateRef.current!, trainSet, batchSize, optimizer, learningRate, lossFn, config, weightDecay);
          e++;
        }
        if (e % 10 === 0) {
    setRenderNetwork(cloneNet(net));
}
}

      const { loss: vLoss } = evaluateSet(networkRef.current!, valSet, lossFn, config, isClassification);
      const { accuracy: trainAcc, mae: trainMae } = evaluateSet(networkRef.current!, trainSet, lossFn, config, isClassification);

      setEpoch(e);
      setTrainHistory((h) => [...h, lastTrainLoss]);
      setValHistory((h) => [...h, vLoss]);
      setAccuracy(trainAcc);
      setMae(trainMae);

      if (e >= epochsTarget) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTraining(false);
        showToast("Training complete");
      }
    }, 55);
  }

  function resetNetwork() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTraining(false);
    setEpoch(0);
    setTrainHistory([]);
    setValHistory([]);
    setAccuracy(isClassification ? 0 : null);
    setMae(0);
    setActiveModelId(null);
    networkRef.current = initNetwork(config);
    setRenderNetwork(networkRef.current);
    optStateRef.current = createOptState(networkRef.current);
    lmMuRef.current = 0.01;
    showToast("Network reset — weights reinitialized");
  }

  function handleComponentClick(label: string) {
    setSelectedComponent((cur) => (cur === label ? null : label));
    if (label === "Dropout") showToast("Dropout isn't part of this architecture yet");
    else showToast(`Highlighting ${label} in the diagram`);
  }


  function handleSaveModel() {
    if (epoch === 0) { showToast("Nothing to save yet — train the network first"); return; }
    const net = networkRef.current;
    if (!net) return;
    const snapshot: SavedModel = {
      id: Date.now(), epoch, accuracy: accuracy === null ? null : accuracy.toFixed(1),
      trainLoss: trainLoss.toFixed(4), optimizer, algorithm, learningRate, datasetName,
      config: { ...config, hiddenUnits: [...config.hiddenUnits] },
      classLabels: classLabels ? [...classLabels] : null, outputNames: [...outputNames],
      isClassification, network: cloneNet(net),
    };
    setSavedModels((list) => [snapshot, ...list].slice(0, 8));
    setActiveModelId(snapshot.id);
    showToast("Model snapshot saved");
    setShowSavedPanel(true);
  }

  function handleLoadModel(id: number) {
    const snapshot = savedModels.find((m) => m.id === id);
    if (!snapshot) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTraining(false);

    networkRef.current = cloneNet(snapshot.network);
    optStateRef.current = createOptState(networkRef.current);
    setConfig({ ...snapshot.config, hiddenUnits: [...snapshot.config.hiddenUnits] });
    setClassLabels(snapshot.classLabels ? [...snapshot.classLabels] : null);
    setOutputNames([...snapshot.outputNames]);
    setIsClassification(snapshot.isClassification);
    setDatasetName(snapshot.datasetName);
    setOptimizer(snapshot.optimizer);
    setAlgorithm(snapshot.algorithm);
    setLearningRate(snapshot.learningRate);
    setEpoch(snapshot.epoch);
    setAccuracy(snapshot.accuracy === null ? null : Number(snapshot.accuracy));
    setTrainHistory([Number(snapshot.trainLoss)]);
    setValHistory([]);
    setActiveModelId(snapshot.id);

    setTestInputs((cur) => (cur.length === snapshot.config.inputUnits ? cur : new Array(snapshot.config.inputUnits).fill(0)));
    setShowSavedPanel(false);
    showToast(`Loaded model from epoch ${snapshot.epoch} — ready to test`);
  }

  function handleDeleteModel(id: number) {
    setSavedModels((list) => list.filter((m) => m.id !== id));
    setActiveModelId((cur) => (cur === id ? null : cur));
    showToast("Saved model deleted");
  }

 

  function handleScreenshot() {
    const svgEl = networkSvgRef.current;
    if (!svgEl) { showToast("Nothing to capture yet"); return; }
    try {
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", String(VIEW_W));
      clone.setAttribute("height", String(VIEW_H));
      const svgString = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = VIEW_W * 2; canvas.height = VIEW_H * 2;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = dark ? "#0A0D13" : "#EEF2F7";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0, VIEW_W, VIEW_H);
        }
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `network-diagram-epoch-${epoch}.png`;
          link.click();
          URL.revokeObjectURL(link.href);
        });
      };
      img.src = url;
      showToast("Diagram exported as PNG");
    } catch {
      showToast("Couldn't export the diagram in this browser");
    }
  }

  function handleAutoLayout() { setZoom(100); showToast("Layout auto-arranged"); }

  function handleExportConfig() {
    const cfg = {
      architecture: config, lossFunction: lossFn, algorithm, optimizer, learningRate, epochsTarget, batchSize, weightDecay,
      isClassification, classLabels, outputNames,
      lastRun: epoch > 0 ? { epoch, accuracy: accuracy === null ? null : Number(accuracy.toFixed(2)), mae: Number(mae.toFixed(4)), trainLoss: Number(trainLoss.toFixed(4)), valLoss: Number(valLoss.toFixed(4)) } : null,
    };
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "network-config.json";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Config exported as JSON");
  }

  function handleExportModel() {
    if (epoch === 0 || !networkRef.current) { showToast("Nothing to export yet — train the network first"); return; }
    const payload = { datasetName, config, classLabels, outputNames, isClassification, algorithm, optimizer, learningRate, epoch, accuracy, trainLoss: Number(trainLoss.toFixed(4)), network: networkRef.current };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `model-epoch-${epoch}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Model weights exported as JSON");
  }

  function exportTestPredictionsToExcel() {
    if (!testPredictions || !testSet) { showToast("Run predictions on the Test sheet first"); return; }
    const rows = testPredictions.map((p, i) => {
      const row: Record<string, string | number> = {};
      testSet.headers.forEach((h, j) => (row[h] = p.row[j]));
      row["Predicted"] = p.predicted;
      row["Confidence"] = Number((p.confidence * 100).toFixed(2));
      void i;
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Predictions");
    XLSX.writeFile(wb, "test-predictions.xlsx");
    showToast("Predictions exported to Excel");
  }


  function rebuildNetworkFromConfig(newConfig: NetConfig) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTraining(false);
    setEpoch(0); setTrainHistory([]); setValHistory([]); setAccuracy(newConfig ? null : 0); setMae(0);
    setActiveModelId(null);
    networkRef.current = initNetwork(newConfig);
    setRenderNetwork(networkRef.current);
    optStateRef.current = createOptState(networkRef.current);
  }

  function updateConfig(patch: Partial<NetConfig>) {
    setConfig((cur) => {
      const next = { ...cur, ...patch };
      rebuildNetworkFromConfig(next);
      return next;
    });
  }

  function addHiddenLayer() {
    if (config.hiddenUnits.length >= 6) { showToast("Maximum of 6 hidden layers in this lab"); return; }
    updateConfig({ hiddenUnits: [...config.hiddenUnits, 4] });
  }
  function removeHiddenLayer(idx: number) {
    if (config.hiddenUnits.length <= 1) { showToast("At least one hidden layer is required"); return; }
    updateConfig({ hiddenUnits: config.hiddenUnits.filter((_, i) => i !== idx) });
  }
  function setHiddenLayerUnits(idx: number, units: number) {
    const clamped = Math.max(1, Math.min(64, Math.round(units) || 1));
    const next = config.hiddenUnits.map((u, i) => (i === idx ? clamped : u));
    updateConfig({ hiddenUnits: next });
  }

 

  // ---- Auto-configuration: pick activations, loss, optimizer & algorithm from the data ----
  function autoSelectHyperparams(out: OutputExtract, newConfig: NetConfig, newSamples: Sample[]) {
    const isClf = out.isClassification;

    // Activations: sane, standard defaults for the task type.
    const inputActivation: ActName = "Linear";
    const hiddenActivation: ActName = "ReLU";
    const outputActivation: ActName = isClf ? "Softmax" : "Linear";

    // Loss: Cross Entropy pairs with Softmax classification, MSE for regression.
    const lossFn = isClf ? "Cross Entropy" : "Mean Squared Error";

    // MLFF Algorithm: Levenberg-Marquardt only when the problem is small enough
    // for a real Jacobian/Gauss-Newton solve in-browser (same feasibility check
    // used by the Run/Train button). Otherwise fall back to Backpropagation.
    const probeConfig: NetConfig = { ...newConfig, inputActivation, hiddenActivation, outputActivation };
    const probeNet = initNetwork(probeConfig);
    const lmCheck = canUseLM(probeNet, newSamples, probeConfig.outputUnits);
    const algorithm = lmCheck.ok ? "Levenberg-Marquardt" : "Backpropagation";

    // Optimizer (only matters for Backpropagation): full-batch GD for tiny
    // datasets where mini-batching adds noise for no benefit, AdamW once the
    // dataset is large enough that weight-decay regularization pays off,
    // Adam as the solid general-purpose default in between.
    let optimizer = "Adam";
    if (algorithm === "Backpropagation") {
      if (newSamples.length <= 16) optimizer = "GD (Full Batch)";
      else if (newSamples.length >= 500) optimizer = "AdamW";
      else optimizer = "Adam";
    }

    return { inputActivation, hiddenActivation, outputActivation, lossFn, algorithm, optimizer };
  }

  function finalizeDatasetIfReady() {
    const inMat = pendingInputMatrixRef.current;
    const out = pendingOutputRef.current;
    if (!inMat || !out) return;

    const nIn = inMat.length, nOut = out.matrix.length;
    if (nIn !== nOut) {
      setRowMismatchWarning(`Input sheet has ${nIn} rows but Output sheet has ${nOut} rows — using the first ${Math.min(nIn, nOut)} matching rows.`);
    } else {
      setRowMismatchWarning(null);
    }

    const baseConfig: NetConfig = { ...config, inputUnits: inMat[0].length, outputUnits: out.matrix[0].length };
    const newSamples = buildSamples(inMat, out.matrix);

    const auto = autoSelectHyperparams(out, baseConfig, newSamples);
    const newConfig: NetConfig = {
      ...baseConfig,
      inputActivation: auto.inputActivation,
      hiddenActivation: auto.hiddenActivation,
      outputActivation: auto.outputActivation,
    };

    setSamples(newSamples);
    setClassLabels(out.classLabels);
    setOutputNames(out.outputNames);
    setIsClassification(out.isClassification);
    setConfig(newConfig);
    setLossFn(auto.lossFn);
    setAlgorithm(auto.algorithm);
    setOptimizer(auto.optimizer);
    rebuildNetworkFromConfig(newConfig);
    setTestInputs(newSamples[0]?.x.slice() ?? new Array(newConfig.inputUnits).fill(0));
    showToast(
      `Dataset ready — ${newSamples.length} samples, ${newConfig.inputUnits} input feature${newConfig.inputUnits === 1 ? "" : "s"}, ` +
      `${newConfig.outputUnits} output${newConfig.outputUnits === 1 ? "" : "s"} (${out.isClassification ? "classification" : "regression"}). ` +
      `Auto-configured: ${auto.algorithm === "Levenberg-Marquardt" ? "Levenberg-Marquardt" : `Backprop + ${auto.optimizer}`}, ${auto.lossFn} loss, ` +
      `${auto.hiddenActivation} hidden / ${auto.outputActivation} output activation.`
    );
  }
  async function handleInputFile(file: File) {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      showToast("The Input Dataset must be an Excel (.xlsx/.xls) or CSV file.");
      return;
    }
    try {
      const rows = await readSheetFile(file);
      const { headers: rawHeaders } = splitHeaderAndData(rows);
      const validation = validateInputHeaders(rawHeaders);
      if (!validation.valid) {
        showToast(validation.message);
        return;
      }
      const { matrix, headers, droppedIdColumns } = extractFeatureMatrix(rows);
      if (matrix.length < 4) throw new Error("Input sheet needs at least a few rows");
      pendingInputMatrixRef.current = matrix;
      setInputFileName(file.name);
      setDatasetName(file.name.replace(/\.(xlsx|xls|csv)$/i, ""));
      showToast(
        `Input sheet loaded: ${matrix.length} rows × ${headers.length} feature columns` +
        (droppedIdColumns.length ? ` (ignored ID column${droppedIdColumns.length > 1 ? "s" : ""}: ${droppedIdColumns.join(", ")})` : "")
      );
      finalizeDatasetIfReady();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't parse the Input sheet");
    }
  }

  async function handleOutputFile(file: File) {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      showToast("The Output Dataset must be an Excel (.xlsx/.xls) or CSV file.");
      return;
    }
    try {
      const rows = await readSheetFile(file);
      const validation = validateOutputHeaders(rows);
      if (!validation.valid) {
        showToast(validation.message);
        return;
      }
      const out = extractOutputData(rows);
      if (out.matrix.length < 4) throw new Error("Output sheet needs at least a few rows");
      pendingOutputRef.current = out;
      setOutputFileName(file.name);
      showToast(`Output sheet loaded: ${out.matrix.length} rows, ${out.matrix[0].length} output column${out.matrix[0].length === 1 ? "" : "s"} (${out.isClassification ? "classification" : "regression"})`);
      finalizeDatasetIfReady();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't parse the Output sheet");
    }
  }

  async function handleTestFile(file: File) {
    try {
      const rows = await readSheetFile(file);
      const { matrix, headers } = extractFeatureMatrix(rows);
      if (matrix.length < 1) throw new Error("Test sheet appears to be empty");
      setTestSet({ matrix, headers });
      setTestFileName(file.name);
      setTestPredictions(null);
      showToast(`Test sheet loaded: ${matrix.length} rows × ${matrix[0].length} feature columns`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't parse the Test sheet");
    }
  }

  function runBatchTest() {
    if (!testSet || !networkRef.current) { showToast("Load a Test sheet first"); return; }
    if (testSet.matrix[0]?.length !== config.inputUnits) {
      showToast(`Test sheet has ${testSet.matrix[0]?.length ?? 0} columns but the network expects ${config.inputUnits} — results may be unreliable`);
    }
    const net = networkRef.current;
    const preds = testSet.matrix.map((row) => {
      const x = row.length === config.inputUnits ? row : Array.from({ length: config.inputUnits }, (_, i) => row[i] ?? 0);
      const { as } = forwardPass(x, net, config);
      const pred = as[as.length - 1];
      if (isClassification) {
        let idx = 0; for (let i = 1; i < pred.length; i++) if (pred[i] > pred[idx]) idx = i;
        return { row, predicted: outputNames[idx] ?? `Class ${idx + 1}`, confidence: pred[idx] };
      }
      const label = pred.map((v, i) => `${outputNames[i] ?? `y${i + 1}`}=${v.toFixed(3)}`).join(", ");
      return { row, predicted: label, confidence: 1 };
    });
    setTestPredictions(preds);
    showToast(`Ran predictions on ${preds.length} test rows`);
  }

  function loadDemoXOR() {
    const newConfig: NetConfig = { ...config, inputUnits: 4, outputUnits: 2, outputActivation: "Softmax" };
    setSamples(buildSamples(XOR_INPUT, XOR_OUTPUT));
    setClassLabels(["Class 1", "Class 2"]);
    setOutputNames(["Class 1", "Class 2"]);
    setIsClassification(true);
    setDatasetName("Demo: XOR Dataset");
    setInputFileName(null); setOutputFileName(null);
    setRowMismatchWarning(null);
    pendingInputMatrixRef.current = null; pendingOutputRef.current = null;
    setConfig(newConfig);
    rebuildNetworkFromConfig(newConfig);
    setTestInputs([0, 1, 0, 1]);
    showToast("Loaded the built-in XOR demo dataset");
  }

  function toggleSampleLabel(idx: number) {
    if (!isClassification || !classLabels) { showToast("Editing labels in-place only applies to classification datasets"); return; }
    setSamples((arr) => arr.map((s, i) => {
      if (i !== idx) return s;
      const curClass = s.y.findIndex((v) => v === 1);
      const nextClass = (curClass + 1) % classLabels.length;
      return { ...s, y: classLabels.map((_, ci) => (ci === nextClass ? 1 : 0)) };
    }));
    showToast("Label updated — retrain to apply it");
  }

  const highlightIndices = getHighlightIndices(selectedComponent, layers.length);

  /* -------------------------------------------------------------- */
  /*  Render                                                          */
  /* -------------------------------------------------------------- */

  return (
    <div className="nns-app" data-theme={dark ? "dark" : "light"}>
      <style>{STYLES}</style>

      <header className="nns-header">
        <div className="nns-header-left">
          <div className="nns-logo"><Brain /></div>
          <div>
            <p className="nns-title">Deep Neural Network Simulation Lab</p>
            <p className="nns-subtitle">Configurable Feed-Forward Network</p>
          </div>
        </div>

        <nav className="nns-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" onClick={() => setActiveTab(key)} className={`nns-nav-btn${activeTab === key ? " active" : ""}`}>
              <Icon />{label}
            </button>
          ))}
          <button type="button" onClick={() => setShowAboutModal(true)} className="nns-help-btn" title="What is this?"><HelpCircle /></button>
        </nav>

        <div className="nns-header-right">
          <button type="button" onClick={() => setShowSavedPanel((v) => !v)} className={`nns-saved-btn${showSavedPanel ? " open" : ""}`}>
            <Folder />Saved Models
            {savedModels.length > 0 && <span className="nns-saved-badge">{savedModels.length}</span>}
          </button>

          {showSavedPanel && (
            <div className="nns-saved-panel">
              <div className="nns-saved-panel-header">
                <p>Saved Models</p>
                <button type="button" onClick={() => setShowSavedPanel(false)} className="nns-saved-panel-close"><X /></button>
              </div>
              {savedModels.length === 0 ? (
                <p className="nns-saved-empty">No models saved yet. Train the network, then hit the save icon in the footer.</p>
              ) : (
                <div className="nns-saved-list">
                  {savedModels.map((m) => (
                    <div key={m.id} className="nns-saved-item">
                      <div className="nns-saved-item-row">
                        <span>Epoch {m.epoch}{activeModelId === m.id ? " · active" : ""}</span>
                        <span className="nns-saved-item-acc">{m.accuracy !== null ? `${m.accuracy}% acc` : `MAE ${Number(m.trainLoss).toFixed(3)}`}</span>
                      </div>
                      <div className="nns-saved-item-meta">{m.datasetName} · {m.algorithm === "Levenberg-Marquardt" ? "LM" : m.optimizer} · loss {m.trainLoss}</div>
                      <div className="nns-saved-item-actions">
                        <button type="button" className="nns-saved-item-btn" onClick={() => handleLoadModel(m.id)}>Load &amp; Test</button>
                        <button type="button" className="nns-saved-item-btn danger" onClick={() => handleDeleteModel(m.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button type="button" onClick={() => setDark((d) => !d)} className="nns-icon-toggle">{dark ? <Sun /> : <Moon />}</button>
          
        </div>
      </header>

      {activeTab === "builder" && (
        <div className="nns-builder">
          {/* -------------------------------------------------- Left sidebar */}
          <aside className="nns-sidebar">
            <SectionTitle badge="1" label="ARCHITECTURE" tip="Input and output neuron counts are set automatically from your Input/Output sheets. Configure hidden layers and activation functions here." />

            <div>
              <p className="nns-block-label">Add Components</p>
              <div className="nns-components">
                {COMPONENTS.map((c) => (
                  <button key={c} type="button" onClick={() => handleComponentClick(c)} className={`nns-component-btn${selectedComponent === c ? " selected" : ""}`}>
                    <Boxes className="nns-box-icon" />{c}
                    {selectedComponent === c && <Check className="nns-component-check" />}
                  </button>
                ))}
              </div>
              <p className="nns-hint">Selecting a component highlights it in the diagram. Input/output size follows your dataset.</p>
            </div>

            <div>
              <p className="nns-block-label" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                Hidden Layers
                <Tip text="How many hidden layers the network has, and how many neurons are in each. Changing this reinitializes the network with fresh random weights." width={230} />
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {config.hiddenUnits.map((u, i) => (
                  <div key={i} className="nns-hidden-row">
                    <span className="nns-hidden-row-label">Layer {i + 1}</span>
                    <input type="number" min={1} max={64} value={u} onChange={(e) => setHiddenLayerUnits(i, parseInt(e.target.value || "1", 10))} />
                    <button type="button" onClick={() => removeHiddenLayer(i)} title="Remove layer"><Minus /></button>
                  </div>
                ))}
              </div>
              <button type="button" className="nns-add-hidden-btn" onClick={addHiddenLayer} disabled={config.hiddenUnits.length >= 6}>
                <Plus />Add Hidden Layer
              </button>
            </div>

            <div className="nns-settings">
              <p className="nns-block-label">Activation Functions</p>
              <SelectField label="Input Layer" value={config.inputActivation} onChange={(v) => updateConfig({ inputActivation: v as ActName })} options={INPUT_ACTIVATIONS} tip="Transform applied to raw input features before the first hidden layer." />
              <SelectField label="Hidden Layers" value={config.hiddenActivation} onChange={(v) => updateConfig({ hiddenActivation: v as ActName })} options={HIDDEN_ACTIVATIONS} tip="Applied uniformly to every hidden layer's output." />
              <SelectField label="Output Layer" value={config.outputActivation} onChange={(v) => updateConfig({ outputActivation: v as ActName })} options={OUTPUT_ACTIVATIONS} tip="Softmax for classification (probabilities summing to 1); Linear for regression." />
            </div>

            <div className="nns-settings">
              <p className="nns-block-label">Training Settings</p>
              <SelectField label="Loss Function" value={lossFn} onChange={setLossFn} options={["Sum Squared Error", "Mean Squared Error", "Mean Absolute Error", "Cross Entropy"]} tip="The formula scoring how wrong a prediction is. Cross Entropy needs a Softmax output." />
              <SelectField label="MLFF Algorithm" value={algorithm} onChange={setAlgorithm} options={["Backpropagation", "Levenberg-Marquardt"]} tip="Backpropagation uses the chosen optimizer with mini-batches. Levenberg-Marquardt is a real Gauss-Newton solver — fast to converge but only practical on small networks/datasets (browser-side matrix inversion)." />
              <div className={`nns-select-wrap-outer${algorithm === "Levenberg-Marquardt" ? "" : ""}`}>
                <SelectField label="Optimizer" value={optimizer} onChange={setOptimizer} options={["GD (Full Batch)", "SGD (Mini-batch)", "Adam", "AdamW", "RMSprop"]} tip="Used only when the algorithm is Backpropagation." disabled={algorithm === "Levenberg-Marquardt"} />
              </div>
              {optimizer === "AdamW" && algorithm !== "Levenberg-Marquardt" && (
                <SliderField label="Weight Decay" value={weightDecay} display={weightDecay.toFixed(3)} min={0} max={0.2} step={0.001} onChange={setWeightDecay} tip="AdamW's decoupled L2 penalty pulling weights toward zero each step." />
              )}
              <SliderField label="Learning Rate" value={learningRate} display={learningRate.toFixed(3)} min={0.001} max={0.5} step={0.001} onChange={setLearningRate} tip="Step size per update. Ignored by Levenberg-Marquardt, which sizes its own step via the damping factor μ." />
              <SliderField label="Epochs" value={epochsTarget} display={String(epochsTarget)} min={20} max={2000} step={10} onChange={(v) => setEpochsTarget(Math.round(v))} tip="One epoch = one full pass through the training data (or one LM iteration)." />
              {algorithm === "Backpropagation" && optimizer !== "GD (Full Batch)" && (
                <SliderField label="Batch Size" value={batchSize} display={String(batchSize)} min={4} max={256} step={4} onChange={(v) => setBatchSize(Math.round(v))} tip="Samples processed before each weight update." />
              )}
            </div>

            <div className="nns-actions">
              <button type="button" onClick={startTraining} disabled={isTraining} className="nns-btn-primary">
                <Play />{isTraining ? "Training…" : "Run / Train"}
              </button>
              <button type="button" onClick={resetNetwork} className="nns-btn-secondary"><RotateCcw />Reset Network</button>
            </div>
          </aside>

          {/* -------------------------------------------------- Center column */}
          <main className="nns-main">
            <section className="nns-panel">
              <div className="nns-panel-header">
                <SectionTitle badge="2" label="NETWORK ARCHITECTURE" tip="Circles are neurons, grouped into layers. Lines are weighted connections — the 'feed-forward' part." />
                <div className="nns-toolbar">
                  <button type="button" onClick={handleAutoLayout} className="nns-toolbar-btn"><Wand2 />Auto Layout</button>
                  <div className="nns-zoom">
                    <span>Zoom</span>
                    <button type="button" onClick={() => setZoom((z) => Math.max(50, z - 10))}><Minus /></button>
                    <span className="nns-zoom-value">{zoom}%</span>
                    <button type="button" onClick={() => setZoom((z) => Math.min(200, z + 10))}><Plus /></button>
                  </div>
                  <button type="button" onClick={resetNetwork} className="nns-icon-danger"><Trash2 /></button>
                </div>
              </div>
              <NetworkCanvas dark={dark} zoom={zoom} layers={layers} highlightIndices={highlightIndices} svgRef={networkSvgRef} />
              <Legend layers={layers} />
            </section>

            <section className="nns-panel">
              <SectionTitle badge="4" label="TRAINING DASHBOARD" tip="Live numbers from the current training run." />
              <div className="nns-dashboard-row">
                <div className="nns-chart-col">
                  <p className="nns-chart-col-label">Training Progress</p>
                  <LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} />
                </div>
                <div className="nns-stats-grid">
                  <StatCard label="Epoch" value={`${epoch}`} sub={`/ ${epochsTarget}`} colorClass="nns-c-blue" tip="Passes through the training data (or LM iterations) completed so far." />
                  <StatCard label="Loss (Train)" value={trainLoss.toFixed(4)} colorClass="nns-c-blue" tip="How wrong predictions are on training data, using the selected loss function." />
                  <StatCard label="Loss (Val)" value={valLoss.toFixed(4)} colorClass="nns-c-orange" tip="Loss on held-out validation data." />
                  {isClassification ? (
                    <StatCard label="Accuracy" value={`${(accuracy ?? 0).toFixed(1)}`} sub="%" colorClass="nns-c-green" tip="Share of predictions matching the correct class." />
                  ) : (
                    <StatCard label="Mean Abs Error" value={mae.toFixed(4)} colorClass="nns-c-green" tip="Average absolute difference between predicted and target values (regression)." />
                  )}
                </div>
              </div>
            </section>
          </main>

          {/* -------------------------------------------------- Right panel */}
          <aside className="nns-aside">
            <SectionTitle badge="3" label="INFORMATION PANEL" tip="A closer look inside the network." />

            <div>
              <p className="nns-chart-col-label">Layer Summary</p>
              <div className="nns-table-wrap">
                <table className="nns-table">
                  <thead><tr><th>Layer</th><th>Type</th><th>Units</th><th>Activation</th></tr></thead>
                  <tbody>{layers.map((l) => (<tr key={l.name}><td>{l.name}</td><td>{l.type}</td><td>{l.units}</td><td>{l.activation}</td></tr>))}</tbody>
                </table>
              </div>
              <div className="nns-param-row">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  Parameter Count
                  <Tip text="Total trainable weights and biases across every connection." width={210} />
                </span>
                <span>{paramCount(renderNetwork)}</span>
              </div>
            </div>

            <div>
              <p className="nns-chart-col-label" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                Activation Preview (Hidden Layer 1)
                <Tip text="Real ReLU-family activations of Hidden Layer 1 for a sample batch. Dim = low activation, bright = high." width={230} />
              </p>
              <ActivationHeatmap net={renderNetwork} config={config} samples={samples} />
            </div>

            <div>
              <p className="nns-chart-col-label" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                Output Preview
                <Tip text="The network's current output for the current test input, from a real forward pass." width={220} />
              </p>
              <OutputPreview net={renderNetwork} config={config} input={testInputs} outputNames={outputNames} isClassification={isClassification} />
            </div>

            <div className="nns-divider">
              <SectionTitle badge="5" label="DATA PANEL" tip="Upload three separate spreadsheets: Input features, Output targets, and a Test feature set for batch predictions." />

              <div className="nns-data-content nns-data-content-row">
                <div>
                  <p className="nns-data-muted">Dataset</p>
                  <p className="nns-data-accent">{datasetName}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="nns-data-muted">Samples</p>
                  <p>{samples.length}</p>
                </div>
              </div>

              {rowMismatchWarning && (
                <div className="nns-data-warn"><AlertTriangle />{rowMismatchWarning}</div>
              )}

              <p className="nns-block-label" style={{ marginTop: 14 }}>Input Sheet (features only)</p>
              <input ref={inputFileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleInputFile(f); e.target.value = ""; }} />
              <button type="button" onClick={() => inputFileRef.current?.click()} className={`nns-data-btn${inputFileName ? " uploaded" : ""}`}>
                <Upload />{inputFileName ? `✓ ${inputFileName}` : "Upload Input Sheet"}
              </button>

              <p className="nns-block-label" style={{ marginTop: 12 }}>Output Sheet (targets only)</p>
              <input ref={outputFileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleOutputFile(f); e.target.value = ""; }} />
              <button type="button" onClick={() => outputFileRef.current?.click()} className={`nns-data-btn${outputFileName ? " uploaded" : ""}`}>
                <Upload />{outputFileName ? `✓ ${outputFileName}` : "Upload Output Sheet"}
              </button>

              <p className="nns-hint">
                Input columns set the input-layer neuron count; Output columns/classes set the output-layer neuron
                count — both update automatically. Serial/ID/index-style columns (e.g. &quot;S.No&quot;, &quot;ID&quot;,
                &quot;Row Number&quot;, or a plain auto-incrementing column) are detected and excluded from the Input
                sheet automatically. A single non-numeric or low-cardinality Output column is treated as a
                classification label (auto one-hot encoded); multiple numeric columns are treated as regression
                targets.
              </p>

              <button type="button" onClick={() => setShowDataModal(true)} className="nns-data-btn" style={{ marginTop: 12 }}>
                <Table2 />View Training Data
              </button>
              <button type="button" onClick={loadDemoXOR} className="nns-data-btn"><RotateCcw />Load Demo Dataset (XOR)</button>
            </div>
          </aside>
        </div>
      )}

      {activeTab === "home" && <HomeTab onGo={setActiveTab} epoch={epoch} accuracy={accuracy} layers={layers} net={networkRef.current} />}

      {activeTab === "train" && (
        <div className="nns-page">
          <section className="nns-panel">
            <SectionTitle badge="1" label="TRAIN" tip="Runs the same real training loop as the Builder tab." />
            <div className="nns-dashboard-row">
              <div className="nns-chart-col"><LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} /></div>
              <div className="nns-stats-grid">
                <StatCard label="Epoch" value={`${epoch}`} sub={`/ ${epochsTarget}`} colorClass="nns-c-blue" tip="Passes through the training data completed so far." />
                {isClassification ? (
                  <StatCard label="Accuracy" value={`${(accuracy ?? 0).toFixed(1)}`} sub="%" colorClass="nns-c-green" tip="Share of predictions currently matching the correct label." />
                ) : (
                  <StatCard label="Mean Abs Error" value={mae.toFixed(4)} colorClass="nns-c-green" tip="Average absolute prediction error." />
                )}
              </div>
            </div>
            <button type="button" onClick={startTraining} disabled={isTraining} className="nns-btn-primary" style={{ marginTop: 16, width: "fit-content", padding: "10px 16px" }}>
              <Play />{isTraining ? "Training…" : "Run / Train"}
            </button>
          </section>
        </div>
      )}

      {activeTab === "test" && (
        <TestTab
          testInputs={testInputs} setTestInputs={setTestInputs} trained={epoch > 0}
          net={networkRef.current} config={config} outputNames={outputNames} isClassification={isClassification}
          savedModels={savedModels} activeModelId={activeModelId} onLoadModel={handleLoadModel} onSaveModel={handleSaveModel}
          testSet={testSet} testFileName={testFileName} testFileRef={testFileRef}
          onTestFile={(f) => handleTestFile(f)} onRunBatch={runBatchTest}
          testPredictions={testPredictions} onExportPredictions={exportTestPredictionsToExcel}
        />
      )}

      {activeTab === "visualize" && (
        <div className="nns-page">
          <section className="nns-panel">
            <SectionTitle badge="1" label="ACTIVATIONS" tip="Same activation snapshot as the Builder tab, given more room." />
            <div style={{ marginTop: 12, maxWidth: 420 }}><ActivationHeatmap net={networkRef.current} config={config} samples={samples} /></div>
          </section>
          <section className="nns-panel">
            <SectionTitle badge="2" label="LOSS CURVE" tip="Training loss (blue) and validation loss (orange). A widening gap is the classic sign of overfitting." />
            <div style={{ marginTop: 12 }}><LossChart trainHistory={trainHistory} valHistory={valHistory} epochsTarget={epochsTarget} /></div>
          </section>
        </div>
      )}

      {activeTab === "explain" && (
        <div className="nns-page">
          <section className="nns-panel nns-page-mid">
            <SectionTitle badge="1" label="HOW THIS NETWORK WORKS" />
            <div className="nns-explain-text">
              <p>
                Data enters through the <span className="nns-c-green">input layer</span> ({config.inputUnits} units,
                matching your Input sheet`s columns), passes through {config.hiddenUnits.length}{" "}
                <span className="nns-c-blue">hidden layer{config.hiddenUnits.length === 1 ? "" : "s"}</span> ({config.hiddenUnits.join(", ")}{" "}
                neurons) using {config.hiddenActivation} activation, and produces a {config.outputUnits}-way{" "}
                <span className="nns-c-rose">output</span> via {config.outputActivation}.
              </p>
              <p>
                {algorithm === "Levenberg-Marquardt"
                  ? `Training uses the Levenberg-Marquardt algorithm: each iteration builds the real Jacobian of the network's outputs with respect to all ${paramCount(networkRef.current)} parameters, then solves a damped Gauss-Newton update (JᵀJ + μI)⁻¹Jᵀe.`
                  : `The ${optimizer} optimizer adjusts all ${paramCount(networkRef.current)} weights and biases via backpropagation to minimize ${lossFn}, at a learning rate of ${learningRate.toFixed(3)}.`}
              </p>
              <p>Switch to the Builder tab to change the architecture, activations, loss, algorithm or optimizer and watch the loss curve respond.</p>
              <p>Curious about the bigger picture? Click the <HelpCircle style={{ width: 13, height: 13, display: "inline", verticalAlign: -2 }} /> icon in the top nav any time.</p>
            </div>
          </section>
        </div>
      )}

      {/* ---------------------------------------------------------- Data modal */}
      {showDataModal && (
        <div className="nns-modal-overlay" onClick={() => setShowDataModal(false)}>
          <div className="nns-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nns-modal-header">
              <p>{datasetName} — {samples.length} samples</p>
              <button type="button" onClick={() => setShowDataModal(false)} className="nns-modal-close"><X /></button>
            </div>
            <div className="nns-modal-table-wrap">
              <table className="nns-table">
                <thead><tr><th>#</th>{samples[0]?.x.map((_, j) => <th key={j}>x{j + 1}</th>)}<th>{isClassification ? "Label" : "Target(s)"}</th></tr></thead>
                <tbody>
                  {samples.slice(0, 200).map((s, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      {s.x.map((v, j) => <td key={j}>{Number(v.toFixed(3))}</td>)}
                      <td>
                        {isClassification ? (
                          <button type="button" onClick={() => toggleSampleLabel(i)} style={{ background: "none", border: "none", color: "inherit", textDecoration: "underline dotted", cursor: "pointer", font: "inherit" }}>
                            {classLabels?.[s.y.findIndex((v) => v === 1)] ?? "—"}
                          </button>
                        ) : (
                          s.y.map((v) => Number(v.toFixed(3))).join(", ")
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="nns-modal-foot">
              <p className="nns-modal-foot-note">{isClassification ? "Click a label to cycle to the next class (reference table only)." : "Regression targets shown read-only."} Showing up to 200 rows.</p>
              <button type="button" onClick={loadDemoXOR} className="nns-btn-secondary" style={{ width: "auto", padding: "8px 14px" }}><RotateCcw />Reset to demo</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- Shortcuts modal */}
      {showShortcutsModal && (
        <div className="nns-modal-overlay" onClick={() => setShowShortcutsModal(false)}>
          <div className="nns-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nns-modal-header"><p>Keyboard Shortcuts</p><button type="button" onClick={() => setShowShortcutsModal(false)} className="nns-modal-close"><X /></button></div>
            <div>
              <div className="nns-shortcut-row"><span>Start / run training</span><span className="nns-kbd">Space</span></div>
              <div className="nns-shortcut-row"><span>Reset network</span><span className="nns-kbd">R</span></div>
              <div className="nns-shortcut-row"><span>Save snapshot</span><span className="nns-kbd">S</span></div>
            </div>
            <p className="nns-modal-foot-note" style={{ marginTop: 12 }}>Shortcuts are disabled while typing in a text field, dropdown, or slider.</p>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- About modal */}
      {showAboutModal && (
        <div className="nns-modal-overlay" onClick={() => setShowAboutModal(false)}>
          <div className="nns-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nns-modal-header"><p>What is this lab?</p><button type="button" onClick={() => setShowAboutModal(false)} className="nns-modal-close"><X /></button></div>
            <div className="nns-modal-body-text">
              <p>This lab runs a real, fully configurable <strong>feed-forward neural network</strong> — genuine forward passes, backpropagation, and (optionally) a real Levenberg-Marquardt solver — so you can watch it actually learn, without writing any code.</p>
              <p>
                <strong>The data:</strong> upload three separate spreadsheets from the Data Panel — an <strong>Input</strong> sheet
                (feature columns only), an <strong>Output</strong> sheet (target/label columns only), and a <strong>Test</strong> sheet
                (feature columns only, for batch predictions on the Test tab). The input and output layer sizes are
                detected from those sheets automatically. Or click ``Load Demo Dataset (XOR)`` — a classic example
                because a network with no hidden layer literally cannot learn it.
              </p>
              <p>
                <strong>Architecture:</strong> choose how many hidden layers and how many neurons each has, plus
                separate activation functions for the input, hidden, and output layers.
              </p>
              <p>
                <strong>Training:</strong> pick a loss function (SSE / MSE / MAE / Cross Entropy), an MLFF algorithm
                (Backpropagation or Levenberg-Marquardt), and — for Backpropagation — an optimizer (GD, SGD, Adam,
                AdamW, RMSprop). Every number shown (loss, accuracy, activations, predictions) is read directly from
                the live network.
              </p>
              <p>Once trained, hit <strong>Save</strong> (footer icon or <span className="nns-kbd">S</span>) to snapshot the real weights under Saved Models, then <strong>Load &amp; Test</strong> any snapshot later.</p>
            </div>
            <div className="nns-modal-foot">
              <span />
              <button type="button" onClick={() => setShowAboutModal(false)} className="nns-btn-primary" style={{ width: "auto", padding: "9px 18px" }}><Check />Got it</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="nns-toast">{toast}</div>}

      <footer className="nns-footer">
        <span className="nns-footer-status">
          <span className={`nns-status-dot${isTraining ? " training" : ""}`} />
          {isTraining ? "Training…" : "Ready"}
        </span>
        <span className="nns-footer-center">Neural Network Simulator&nbsp;|&nbsp;Learn · Build · Understand</span>
        <span className="nns-footer-actions">
          <button type="button" onClick={handleSaveModel} title="Save model (S)"><Save /></button>
          <button type="button" onClick={handleScreenshot} title="Download diagram as PNG"><Camera /></button>
          <button type="button" onClick={() => setShowMoreMenu((v) => !v)} title="More"><MoreHorizontal /></button>
          {showMoreMenu && (
            <div className="nns-more-menu">
              <button type="button" onClick={() => { setShowMoreMenu(false); handleExportModel(); }}><Save />Export model (.json)</button>
              <button type="button" onClick={() => { setShowMoreMenu(false); handleExportConfig(); }}><Table2 />Export config</button>
              <button type="button" onClick={() => { setShowMoreMenu(false); exportTestPredictionsToExcel(); }}><Download />Export predictions (.xlsx)</button>
              <button type="button" onClick={() => { setShowMoreMenu(false); setShowShortcutsModal(true); }}><HelpCircle />Keyboard shortcuts</button>
              <button type="button" onClick={() => { setShowMoreMenu(false); setShowAboutModal(true); }}><Sparkles />About</button>
            </div>
          )}
        </span>
      </footer>
    </div>
  );
}

/* ================================================================== */
/*  Sub components                                                      */
/* ================================================================== */

function SliderField({ label, value, display, min, max, step, onChange, tip }: {
  label: string; value: number; display: string | number; min: number; max: number; step: number; onChange: (value: number) => void; tip?: string;
}) {
  return (
    <div>
      <div className="nns-slider-row">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{label}{tip && <Tip text={tip} width={230} />}</span>
        <span className="nns-slider-value">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="nns-slider" />
    </div>
  );
}

function SelectField({ label, value, onChange, options, tip, disabled }: {
  label: string; value: string; onChange: (value: string) => void; options: string[]; tip?: string; disabled?: boolean;
}) {
  return (
    <div>
      <p className="nns-select-label" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{label}{tip && <Tip text={tip} width={220} />}</p>
      <div className={`nns-select-wrap${disabled ? " disabled" : ""}`}>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="nns-select" disabled={disabled}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="nns-select-chevron" />
      </div>
    </div>
  );
}

function NetworkCanvas({ dark, zoom, layers, highlightIndices = [], svgRef }: {
  dark: boolean; zoom: number; layers: LayerDisplay[]; highlightIndices?: number[]; svgRef?: React.MutableRefObject<SVGSVGElement | null>;
}) {
  const scale = zoom / 100;
  const textColor = dark ? "#cbd5e1" : "#334155";
  const boxTextColor = dark ? "#e2e8f0" : "#334155";
  const boxStroke = dark ? "#33415580" : "#cbd5e1";
  const lineStroke = dark ? "#33415580" : "#cbd5e180";

  return (
    <div className="nns-canvas-wrap">
      <svg ref={svgRef} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: `${100 * scale}%`, height: `${100 * scale}%` }} className="nns-canvas-svg">
        {layers.slice(0, -1).map((layer, li) => {
          const x1 = layerX(li, layers.length), x2 = layerX(li + 1, layers.length);
          const ys1 = nodeYs(layer.units), ys2 = nodeYs(layers[li + 1].units);
          return ys1.flatMap((y1, i) => ys2.map((y2, j) => (
            <line key={`c-${li}-${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lineStroke} strokeWidth={1} />
          )));
        })}
        {layers.map((layer, li) => {
          const x = layerX(li, layers.length);
          const ys = nodeYs(layer.units);
          const headerY = ys[0] - 60;
          const isHighlighted = highlightIndices.includes(li);
          return (
            <g key={`${layer.name}-${li}`}>
              {isHighlighted && (
                <rect x={x - 46} y={headerY - 24} width={92} height={ys[ys.length - 1] - headerY + 70} rx={12} fill={`${layer.color}14`} stroke={layer.color} strokeWidth={2} strokeDasharray="4 3" />
              )}
              <text x={x} y={headerY - 8} textAnchor="middle" fontSize="14" fontWeight={600} fill={layer.color}>{layer.name}</text>
              <text x={x} y={headerY + 10} textAnchor="middle" fontSize="12" fill={layer.color} opacity={0.8}>({layer.units})</text>
              {ys.map((y, i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={20} fill={`${layer.color}22`} stroke={layer.color} strokeWidth={2} />
                  <circle cx={x} cy={y} r={4.5} fill={layer.color} />
                  {li === 0 && layer.units <= 12 && <text x={x - 40} y={y + 5} textAnchor="middle" fontSize="12" fill={textColor}>{`x${i + 1}`}</text>}
                  {li === layers.length - 1 && layer.units <= 12 && <text x={x + 40} y={y + 5} textAnchor="middle" fontSize="12" fill={textColor}>{`y${i + 1}`}</text>}
                </g>
              ))}
              {layer.activation !== "–" && (
                <g>
                  <rect x={x - 36} y={ys[ys.length - 1] + 40} width={72} height={24} rx={6} fill="none" stroke={boxStroke} />
                  <text x={x} y={ys[ys.length - 1] + 56} textAnchor="middle" fontSize="11" fill={boxTextColor}>{layer.activation}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Legend({ layers }: { layers: LayerDisplay[] }) {
  const seen = new Map<string, string>();
  layers.forEach((l) => { if (!seen.has(l.name.replace(/ \d+$/, ""))) seen.set(l.name.startsWith("Hidden") ? "Hidden Layer" : l.name, l.color); });
  return (
    <div className="nns-legend">
      <strong>Legend</strong>
      {Array.from(seen.entries()).map(([label, color]) => (
        <span key={label} className="nns-legend-item"><span className="nns-legend-dot" style={{ backgroundColor: color }} />{label}</span>
      ))}
      <span className="nns-legend-item"><span className="nns-legend-line" />Connection</span>
    </div>
  );
}

function LossChart({ trainHistory, valHistory, epochsTarget }: { trainHistory: number[]; valHistory?: number[]; epochsTarget?: number }) {
  const W = 640, H = 220, padL = 44, padB = 24, padT = 10, padR = 10;
  const allVals = [...trainHistory, ...(valHistory ?? [])].filter((v) => Number.isFinite(v) && v > 0);
  const maxV = allVals.length ? Math.max(...allVals, 1e-6) : 1;
  const minV = allVals.length ? Math.max(1e-6, Math.min(...allVals) * 0.5) : 0.001;
  const logMax = Math.log10(Math.max(maxV, minV * 10));
  const logMin = Math.log10(minV);

  const yFor = (v: number) => {
    const clamped = Math.min(Math.max(v, minV), maxV);
    const t = (Math.log10(clamped) - logMin) / Math.max(1e-9, logMax - logMin);
    return padT + (1 - t) * (H - padT - padB);
  };
  const xFor = (i: number, n: number) => padL + (i / Math.max(1, n - 1)) * (W - padL - padR);
  const pathFor = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i, arr.length).toFixed(1)} ${yFor(v).toFixed(1)}`).join(" ");

  const gridVals = [maxV, maxV / 10, maxV / 100, minV].filter((v, i, arr) => arr.indexOf(v) === i);
  const gridStroke = "var(--panel-border)", axisText = "var(--text-muted)";

  return (
    <div className="nns-chart-box">
      <svg viewBox={`0 0 ${W} ${H + 20}`}>
        {gridVals.map((g) => (
          <g key={g}>
            <line x1={padL} x2={W - padR} y1={yFor(g)} y2={yFor(g)} stroke={gridStroke} strokeWidth={1} />
            <text x={padL - 8} y={yFor(g) + 4} fontSize="10" textAnchor="end" fill={axisText}>{g >= 1 ? g.toFixed(2) : g.toExponential(1)}</text>
          </g>
        ))}
        <text x={10} y={H / 2} fontSize="10" fill={axisText} transform={`rotate(-90 10 ${H / 2})`} textAnchor="middle">Loss</text>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <text key={f} x={padL + f * (W - padL - padR)} y={H + 14} fontSize="10" textAnchor="middle" fill={axisText}>{Math.round(f * (epochsTarget ?? MAX_EPOCHS_DEFAULT))}</text>
        ))}
        <text x={W / 2} y={H + 30} fontSize="10" textAnchor="middle" fill={axisText}>Epoch</text>
        {trainHistory.length > 1 && <path d={pathFor(trainHistory)} fill="none" stroke="#3b82f6" strokeWidth={2} />}
        {valHistory && valHistory.length > 1 && <path d={pathFor(valHistory)} fill="none" stroke="#f97316" strokeWidth={2} />}
        {trainHistory.length === 0 && <text x={W / 2} y={H / 2} fontSize="12" textAnchor="middle" fill={axisText}>Press &quot;Run / Train&quot; to start</text>}
      </svg>
      <div className="nns-chart-legend">
        <span className="nns-chart-legend-item"><span className="nns-chart-legend-swatch" style={{ background: "#3b82f6" }} /> Training Loss</span>
        <span className="nns-chart-legend-item"><span className="nns-chart-legend-swatch" style={{ background: "#f97316" }} /> Validation Loss</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, colorClass, tip }: { label: string; value: ReactNode; sub?: ReactNode; colorClass?: string; tip?: string }) {
  return (
    <div className="nns-stat-card">
      <p className="nns-stat-label">{label}{tip && <Tip text={tip} width={220} />}</p>
      <p className={`nns-stat-value ${colorClass}`}>{value}{sub && <span className="nns-stat-sub">{sub}</span>}</p>
    </div>
  );
}

function ActivationHeatmap({ net, config, samples }: { net: NetWeights; config: NetConfig; samples: Sample[] }) {
  const shown = samples.slice(0, 24);
  const perSample = shown.map((s) => forwardPass(s.x, net, config).as[1]); // as[1] = Hidden Layer 1 output
  const rows = perSample[0]?.length ?? 0;
  const cols = perSample.length;
  const grid = Array.from({ length: rows }, (_, u) => perSample.map((a1) => a1[u]));
  const maxVal = Math.max(1e-6, ...grid.flat().map(Math.abs));

  function colorFor(v: number) {
    const t = Math.min(1, Math.max(0, Math.abs(v) / maxVal));
    const r = Math.round(30 + t * 40), g = Math.round(30 + t * 90), b = Math.round(90 + t * 165);
    return `rgb(${r},${g},${b})`;
  }

  return (
    <div className="nns-heatmap">
      <div className="nns-heatmap-labels">{Array.from({ length: rows }, (_, i) => <span key={i}>N{i + 1}</span>)}</div>
      <div style={{ flex: 1 }}>
        <div className="nns-heatmap-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {grid.map((row, i) => row.map((v, j) => <div key={`${i}-${j}`} className="nns-heatmap-cell" style={{ backgroundColor: colorFor(v) }} />))}
        </div>
        <div className="nns-heatmap-collabels" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>{Array.from({ length: cols }, (_, i) => <span key={i}>S{i + 1}</span>)}</div>
      </div>
      <div className="nns-heatmap-scale"><span>{maxVal.toFixed(2)}</span></div>
    </div>
  );
}

function OutputPreview({ net, config, input, outputNames, isClassification }: { net: NetWeights; config: NetConfig; input: number[]; outputNames: string[]; isClassification: boolean }) {
  const x = input.length === config.inputUnits ? input : Array.from({ length: config.inputUnits }, (_, i) => input[i] ?? 0);
  const { as } = forwardPass(x, net, config);
  const pred = as[as.length - 1];
  const rows = pred.map((value, i) => ({ label: outputNames[i] ?? `y${i + 1}`, value, color: CLASS_COLORS[i % CLASS_COLORS.length] }));
  const maxAbs = isClassification ? 1 : Math.max(1e-6, ...rows.map((r) => Math.abs(r.value)));
  return (
    <div className="nns-output">
      {rows.map((r) => (
        <div key={r.label} className="nns-output-row">
          <span className="nns-output-label" style={{ width: "auto", minWidth: 16 }} title={r.label}>{r.label.length > 8 ? `${r.label.slice(0, 7)}…` : r.label}</span>
          <div className="nns-output-track"><div className="nns-output-fill" style={{ width: `${Math.min(100, (Math.abs(r.value) / maxAbs) * 100)}%`, backgroundColor: r.color }} /></div>
          <span className="nns-output-val">{r.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function HomeTab({ onGo, epoch, accuracy, layers, net }: { onGo: (tab: string) => void; epoch: number; accuracy: number | null; layers: LayerDisplay[]; net: NetWeights }) {
  return (
    <div className="nns-page" style={{ maxWidth: 768 }}>
      <section className="nns-hero">
        <h1>Welcome back</h1>
        <p className="nns-hero-sub">Build, train and inspect a fully configurable feed-forward network right in the browser — Excel in, Excel out.</p>
        <div className="nns-hero-stats">
          <StatCard label="Last Epoch" value={`${epoch}`} colorClass="nns-c-blue" tip="Most recent epoch reached in your last training run." />
          <StatCard label="Last Accuracy" value={accuracy !== null ? `${accuracy.toFixed(1)}` : "–"} sub={accuracy !== null ? "%" : ""} colorClass="nns-c-green" tip="Accuracy at the end of your last training run (classification only)." />
          <StatCard label="Layers" value={`${layers.length}`} colorClass="nns-c-purple" tip="Total layers: input, hidden, and output." />
          <StatCard label="Parameters" value={`${paramCount(net)}`} colorClass="nns-c-rose" tip="Total trainable weights and biases." />
        </div>
        <div className="nns-hero-actions">
          <button type="button" onClick={() => onGo("builder")} className="nns-hero-btn-primary">Open Builder</button>
          <button type="button" onClick={() => onGo("explain")} className="nns-hero-btn-secondary">How it works</button>
        </div>
      </section>
    </div>
  );
}

function TestTab({
  testInputs, setTestInputs, trained, net, config, outputNames, isClassification,
  savedModels, activeModelId, onLoadModel, onSaveModel,
  testSet, testFileName, testFileRef, onTestFile, onRunBatch, testPredictions, onExportPredictions,
}: {
  testInputs: number[]; setTestInputs: Dispatch<SetStateAction<number[]>>; trained: boolean;
  net: NetWeights; config: NetConfig; outputNames: string[]; isClassification: boolean;
  savedModels: SavedModel[]; activeModelId: number | null; onLoadModel: (id: number) => void; onSaveModel: () => void;
  testSet: { matrix: number[][]; headers: string[] } | null; testFileName: string | null; testFileRef: React.MutableRefObject<HTMLInputElement | null>;
  onTestFile: (f: File) => void; onRunBatch: () => void;
  testPredictions: { row: number[]; predicted: string; confidence: number }[] | null; onExportPredictions: () => void;
}) {
  const x = testInputs.length === config.inputUnits ? testInputs : Array.from({ length: config.inputUnits }, (_, i) => testInputs[i] ?? 0);
  const { as } = forwardPass(x, net, config);
  const pred = as[as.length - 1];
  let predicted = 0; for (let i = 1; i < pred.length; i++) if (pred[i] > pred[predicted]) predicted = i;
  const confidence = pred[predicted];
  const isBinaryBits = x.length <= 6 && x.every((v) => v === 0 || v === 1);

  function updateInput(i: number, v: number) { setTestInputs((arr) => arr.map((val, idx) => (idx === i ? v : val))); }

  return (
    <div className="nns-page" style={{ maxWidth: 620 }}>
      <section className="nns-panel">
        <SectionTitle badge="1" label="MANUAL TEST" tip="Edit input values to run them through the network's real forward pass." />
        {savedModels.length > 0 && (
          <div className="nns-test-model-row">
            <div className="nns-select-wrap nns-test-model-select">
              <select className="nns-select" value={activeModelId ?? ""} onChange={(e) => { const id = Number(e.target.value); if (id) onLoadModel(id); }}>
                <option value="">Use current (live) network</option>
                {savedModels.map((m) => <option key={m.id} value={m.id}>{m.datasetName} · epoch {m.epoch} · {m.accuracy !== null ? `${m.accuracy}% acc` : "regression"}</option>)}
              </select>
              <ChevronDown className="nns-select-chevron" />
            </div>
          </div>
        )}
        <p style={{ marginTop: 8, color: "var(--text-muted)" }}>{isBinaryBits ? "Toggle the input bits below." : "Edit the input values below."}</p>
        <div className="nns-test-bits">
          {x.map((v, i) => isBinaryBits ? (
            <button key={i} type="button" onClick={() => updateInput(i, v === 1 ? 0 : 1)} className={`nns-bit-btn${v === 1 ? " active" : ""}`}>{v}</button>
          ) : (
            <div key={i} className="nns-test-field">
              <span className="nns-test-field-label">x{i + 1}</span>
              <input type="number" step="any" value={v} onChange={(e) => updateInput(i, e.target.value === "" ? 0 : parseFloat(e.target.value))} />
            </div>
          ))}
        </div>
        {!trained ? (
          <p className="nns-test-hint">Train the network from the Builder tab first to get a real prediction.</p>
        ) : (
          <>
            <div className="nns-test-result">
              <p className="nns-data-muted">{isClassification ? "Predicted class" : "Predicted value(s)"}</p>
              <p className="nns-test-result-value">
                {isClassification ? `${outputNames[predicted] ?? `Class ${predicted + 1}`} · ${(confidence * 100).toFixed(1)}% confidence`
                  : pred.map((v, i) => `${outputNames[i] ?? `y${i + 1}`}=${v.toFixed(3)}`).join("  ")}
              </p>
            </div>
            <button type="button" onClick={onSaveModel} className="nns-btn-secondary" style={{ marginTop: 12, width: "auto", padding: "9px 16px" }}><Save />Save this model</button>
          </>
        )}
      </section>

      <section className="nns-panel">
        <SectionTitle badge="2" label="BATCH TEST (Excel)" tip="Upload a Test sheet of feature rows (no labels) and run every row through the network at once." />
        <input ref={testFileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onTestFile(f); e.target.value = ""; }} />
        <button type="button" onClick={() => testFileRef.current?.click()} className={`nns-data-btn${testFileName ? " uploaded" : ""}`} style={{ marginTop: 12 }}>
          <Upload />{testFileName ? `✓ ${testFileName}` : "Upload Test Sheet"}
        </button>
        {testSet && (
          <>
            <p className="nns-hint">{testSet.matrix.length} rows × {testSet.matrix[0]?.length ?? 0} columns loaded.</p>
            <button type="button" onClick={onRunBatch} className="nns-btn-primary" style={{ marginTop: 10 }}><Play />Run Predictions</button>
          </>
        )}
        {testPredictions && (
          <>
            <div className="nns-table-wrap" style={{ marginTop: 14, maxHeight: 260, overflowY: "auto" }}>
              <table className="nns-table">
                <thead><tr><th>#</th>{testSet?.headers.map((h, i) => <th key={i}>{h}</th>)}<th>Predicted</th></tr></thead>
                <tbody>
                  {testPredictions.slice(0, 200).map((p, i) => (
                    <tr key={i}><td>{i + 1}</td>{p.row.map((v, j) => <td key={j}>{Number(v.toFixed(3))}</td>)}<td>{p.predicted}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={onExportPredictions} className="nns-btn-secondary" style={{ marginTop: 10, width: "auto", padding: "9px 16px" }}><Download />Export to Excel</button>
          </>
        )}
      </section>
    </div>
  );
}