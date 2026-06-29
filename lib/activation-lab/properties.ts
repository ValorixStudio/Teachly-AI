import { ActivationType } from "./activations";

export const properties: Record<
  ActivationType,
  {
    range: string;
    gradient: string;
    use: string;
  }
> = {
  linear: {
    range: "(-∞, ∞)",
    gradient: "Constant Gradient",
    use: "Regression Output Layer",
  },

  binarystep: {
    range: "{0, 1}",
    gradient: "Not Differentiable",
    use: "Perceptrons (Historical)",
  },      
  relu: {
    range: "[0, ∞)",
    gradient: "Mitigates Vanishing Gradient",
    use: "CNNs, Transformers",
  },

  sigmoid: {
    range: "(0, 1)",
    gradient: "Vanishing Gradient",
    use: "Binary Classification Output Layer",
  },

  tanh: {
    range: "(-1, 1)",
    gradient:
      "Less Vanishing Gradient than Sigmoid",
    use: "RNNs",
  },

  leakyrelu: {
    range: "(-∞, ∞)",
    gradient:
      "Avoids Dead Neurons",
    use: "Deep Neural Networks",
  },
  elu: {
    range: "(-1, ∞)",
    gradient: "Reduces Vanishing Gradient",
    use: "Deep Neural Networks",
  },

  swish: {
    range: "(-∞, ∞)",
    gradient: "Smooth Gradient Flow",
    use: "EfficientNet, Modern CNNs",
  },

  gelu: {
    range: "(-∞, ∞)",
    gradient: "Smooth Gradient Flow",
    use: "Transformers, Large Language Models",
  },


};