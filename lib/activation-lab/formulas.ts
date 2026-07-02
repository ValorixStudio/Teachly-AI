import { ActivationType } from "@/lib/activation-lab/activations";

export const formulas: Record<
  ActivationType,
  string
> = {
  linear: "f(z) = z",
  binarystep: "f(z) = 1 if z >= 0, else 0",
  relu: "f(z) = max(0, z)",

  sigmoid: "f(z) = 1 / (1 + e^(-z))",

  tanh: "f(z) = tanh(z)",

  leakyrelu: "f(z) = z if z > 0, else 0.01z",

  elu: "f(z) = z if z >= 0, else e^z - 1",
  swish: "f(z) = z * sigmoid(z)",
  gelu: "f(z) = 0.5 * z * (1 + tanh(sqrt(2/pi) * (z + 0.044715 * z^3)))",
 
  
};