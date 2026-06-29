export type ActivationType =
  | "linear"
  | "binarystep"
  | "relu"
  | "sigmoid"
  | "tanh"
  | "leakyrelu"
  | "elu"
  | "swish"
  | "gelu"
  

export function applyActivation(
  x: number,
  activation: ActivationType
) {
  switch (activation) {
    case "linear":
      return x;

    case "binarystep":
      return x >= 0 ? 1 : 0;

    case "relu":
      return Math.max(0, x);

    case "sigmoid":
      return 1 / (1 + Math.exp(-x));

    case "tanh":
      return Math.tanh(x);

    case "leakyrelu":
      return x > 0 ? x : 0.01 * x;
    
    case "elu":
      return x >= 0 ? x : Math.exp(x) - 1;
    
    case "swish":
      return x * (1 / (1 + Math.exp(-x)));
    
    case "gelu":
      return x * 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.04476 * Math.pow(x, 3))));
    
  
    
    default:
      return x;
  }
}