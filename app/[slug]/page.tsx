"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  FunctionSquare,
  Users,
  Trees,
  Globe,
  Clock,
  Layers,
  FileWarning,
  Search,
  Shield,
  Group,
  Tags,
  Package,
Calculator,
Layers3,
Table,
Radar,
Zap,
CircleOff,
Grid2X2,
Split,
SlidersHorizontal,
Target,
SearchCheck,
Scale,
LineChart,
BrainCircuit,
BrushCleaning,
Dice5,
  BookOpen,
  Cpu,
  Table2,
  Sparkles,
  Compass,
  Car,
  SplitSquareVertical,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  Braces,
  Bot,
  ShieldCheck,
  ShieldAlert,
  Code2,
  GitBranch,
  Boxes,
  TrendingDown,
  Gauge,
  Database,
  Music,
  Sigma,
  Network,
  Workflow,
  Brain,
  TrendingUp,
  ScanFace,
  Binary,
  BarChart3,
  RotateCcw,
  Rocket,
 ArrowRightLeft,
  GraduationCap,
  PieChart,
  Wand2,
} from "lucide-react";
import { text } from "stream/consumers";

const colors = {
  bg: "#FFF7E3",
  bgSoft: "#FFEFC8",
  card: "#FFFFFF",
  cardAlt: "#F6F1FF",
  border: "#FFD866",
  borderSoft: "#FFE9A8",
  gold: "#F5A623",
  goldDeep: "#E2860A",
  coral: "#FF7A59",
  purple: "#A855F7",
  teal: "#2FB6A3",
  ink: "#3A2E1E",
  inkSoft: "#5A4B34",
  muted: "#8A7A5C",
};

/* ---------------------------- TYPES ---------------------------- */

type AccentKey = "teal" | "coral" | "gold" | "purple" | "blue" | "green" | "orange";

interface Section {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface TopicContent {
  title: string;
  subtitle: string;
  eyebrow: string;
  accent: AccentKey;
  icon: typeof Lightbulb;
  sections: Section[];
  handsOnPrompt?: string;
}

/* ---------------------------- STYLES ---------------------------- */

const STYLES = `
  .topic-root {
    min-height: 100vh;
    width: 100%;
    padding: 2rem 1.5rem 6rem;
    background-color: #f8fafc;
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    color: #0f172a;
    box-sizing: border-box;
  }
  .topic-root * { box-sizing: border-box; }
  .topic-root button { font-family: inherit; cursor: pointer; }

  .bg-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.25;
    z-index: 0;
    animation: float 20s infinite alternate;
  }
  .blob-1 {
    top: -10%; left: -10%; width: 50vw; height: 50vw;
    background: var(--accent);
  }
  .blob-2 {
    bottom: -10%; right: -10%; width: 40vw; height: 40vw;
    background: var(--accent-border);
    animation-delay: -5s;
  }
  @keyframes float {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(8%, 12%) scale(1.1); }
  }

  .topic-container {
    max-width: 64rem;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .topic-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    margin-bottom: 2.5rem;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    color: #0f172a;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }
  .topic-back-btn:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.05);
  }

  .topic-header {
    text-align: left;
    margin-bottom: 2rem;
  }
  .topic-icon {
    width: 3.5rem; height: 3.5rem;
    border-radius: 1rem;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid var(--accent);
    color: var(--accent);
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 24px var(--accent-soft);
  }
  .topic-eyebrow {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 0.5rem 0;
  }
  .topic-title {
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(2.25rem, 5vw, 3.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 1rem 0;
    color: #0f172a;
    line-height: 1.1;
  }
  .topic-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
    max-width: 40rem;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 1.5rem;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255,255,255,0.7);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.4s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .slide-content {
    display: flex;
    flex-direction: column;
  }
  @media (min-width: 768px) {
    .slide-content {
      flex-direction: row;
      min-height: 450px;
    }
  }

  .slide-text {
    flex: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .slide-visual {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    background: rgba(255,255,255,0.25);
    border-left: 1px solid rgba(255,255,255,0.5);
  }
  @media (max-width: 767px) {
    .slide-visual {
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.5);
      padding: 2rem;
    }
    .slide-text { padding: 2rem; }
  }

  .visual-img {
    width: 100%;
    max-width: 360px;
    border-radius: 1rem;
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
    object-fit: cover;
    aspect-ratio: 1/1;
    border: 2px solid rgba(255,255,255,0.5);
  }

  .slide-badge {
    display: inline-flex;
    align-items: center;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 0.3rem 0.8rem;
    border-radius: 99px;
    align-self: flex-start;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255,255,255,0.4);
  }

  .topic-section-heading {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.85rem;
    font-weight: 700;
    margin: 0 0 1.25rem 0;
    color: #0f172a;
    line-height: 1.2;
  }

  .topic-paragraph {
    font-size: 1.05rem;
    line-height: 1.7;
    color: #334155;
    margin: 0 0 1.25rem 0;
  }
  .topic-paragraph:last-child { margin-bottom: 0; }

  .topic-bullets {
    list-style: none; padding: 0; margin: 1rem 0 0 0;
    display: flex; flex-direction: column; gap: 0.85rem;
  }
  .topic-bullets li {
    position: relative;
    padding-left: 1.85rem;
    font-size: 1.05rem;
    line-height: 1.6;
    color: #334155;
  }
  .topic-bullets li::before {
    content: "→";
    position: absolute;
    left: 0;
    top: 2px;
    color: var(--accent);
    font-weight: bold;
  }

  .slide-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 3rem;
    border-top: 1px solid rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.4);
  }
  @media (max-width: 767px) {
    .slide-controls { padding: 1.5rem 2rem; }
  }

  .control-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    border: 1px solid rgba(15, 23, 42, 0.1);
    background: white;
    color: #0f172a;
  }
  .control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .control-btn:not(:disabled):hover {
    background: #f8fafc;
    transform: translateY(-1px);
    border-color: rgba(15, 23, 42, 0.2);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  .control-btn.primary {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
  }
  .control-btn.primary:not(:disabled):hover {
    background: #1e293b;
    border-color: #1e293b;
    box-shadow: 0 6px 16px rgba(15,23,42,0.2);
  }

  .progress-dots {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .dot:hover { background: rgba(15, 23, 42, 0.3); }
  .dot.active {
    background: var(--accent);
    transform: scale(1.4);
  }
`;

/* ---------------------------- ACCENT PALETTE ---------------------------- */

const ACCENTS: Record<AccentKey, { color: string; border: string; soft: string }> = {
  teal: { color: colors.teal, border: "#BEEBE2", soft: "#E7F9F5" },
  coral: { color: colors.coral, border: "#FFD4C4", soft: "#FFF0E9" },
  gold: { color: colors.goldDeep, border: colors.border, soft: colors.bgSoft },
  purple: { color: colors.purple, border: "#E7D3FC", soft: colors.cardAlt },
  blue: { color: "#3B82F6", border: "#BFDBFE", soft: "#EFF6FF" },
  green: { color: "#22C55E", border: "#D1FAE5", soft: "#ECFDF5" },
   orange: { color: "#F97316", border: "#FED7AA", soft: "#FFF7ED" },
   red: { color: "#EF4444", border: "#FECACA", soft: "#FEF2F2" },
};


const contentMap: Record<string, TopicContent> = {
  "what-is-intelligence": {
    title: "What is Intelligence?",
    subtitle: "The foundation everything else in this module builds on.",
    eyebrow: "Concept 1 of 5",
    accent: "teal",
    icon: Lightbulb,
    sections: [
      {
        heading: "What actually counts as intelligence?",
        paragraphs: [
         "Intelligence is the ability to notice a new situation, understand what's happening, and respond in a way that wasn't already planned. It is not about being the fastest or the strongest. It is about thinking, learning, and finding a good solution when something unexpected happens.",
        "Imagine you are solving a puzzle. The first idea you try may not work, so you think again, try something different, and finally solve it. That ability to learn from your mistakes and improve is called intelligence.",
        "Humans, many animals, and even some computer systems can show intelligence in different ways. The important part is not how quickly they act, but whether they can learn, adapt, and make better decisions over time.",
      ],
      },
      {
        heading: "Four signs that usually give it away",
        bullets: [
         "Learning — getting better at something with experience instead of repeating the same fixed steps every time.",
        "Adapting — handling a brand-new situation that you've never faced before.",
        "Problem-solving — finding a new way to reach a goal instead of following one preset script.",
        "Remembering — using what you've learned before to make better decisions in the future.",
      ],},
       {
      heading: "Intelligence is all around us",
      paragraphs: [
        "Think about learning to ride a bicycle. At first, you may fall a few times. Slowly, you learn how to balance, pedal, and turn. Every practice session makes you better. That is intelligence because you are learning from experience.",
        "Animals also show intelligence. A dog can learn new tricks after practice. Birds like crows can use simple tools to get food. These actions are not copied every time they involve learning and solving problems.",
      ],
    },
      {
        heading: "The trap to watch for",
        paragraphs: [
            "Something can look smart just because it's fast, when really it's only following a fixed rule. If the same input always gives the same output, no matter how many times you repeat it, the system is simply following instructions instead of thinking.",
        "For example, a calculator can solve maths very quickly, but it only follows the rules programmed into it. It doesn't understand what the numbers mean or learn from previous calculations.",
        "A thermostat isn't 'deciding' anything either. It simply checks the room temperature. If the temperature is below a certain number, it turns the heater on. If it is above that number, it turns the heater off. It follows the same rule every single time.",
        "A crow bending a piece of wire into a hook to reach food, on the other hand, is solving a problem it has never faced before. It is trying different ideas to reach its goal. That's the difference between following a rule and showing real intelligence.",
      ],
      },
      {
      heading: "Key idea to remember",
      paragraphs: [
        "Being intelligent does not mean knowing every answer. It means being able to learn something new, understand a problem, think of different solutions, and improve with experience.",
        "As you move through this module, keep asking yourself one simple question:",
      ],
      bullets: [
        "Is this example learning from experience?",
        "Can it adapt when something changes?",
        "Is it solving a problem, or just following fixed instructions?",
      ],
    },
    ],
  },

  "ai-vs-human-intelligence": {
  title: "AI vs Human Intelligence",
  subtitle: "Both are intelligent in different ways, and each has its own strengths.",
  eyebrow: "Concept 2 of 5",
  accent: "gold",
  icon: Users,
  
  sections: [
    {
      heading: "They're not competing for the same crown",
      paragraphs: [
        "AI and human intelligence are simply good at different things. Knowing which is better for a particular task helps us use both wisely.",
        "Think of a race between a fish and a bird. If the race is in water, the fish wins. If the race is in the sky, the bird wins. It wouldn't make sense to say one is smarter than the other  they are built for different jobs.",
        "The same is true for humans and AI. Instead of asking 'Who is smarter?', it's better to ask 'Who is better for this task?'",
      ],
    },
    {
      heading: "AI tends to win at",
      bullets: [
        "Tasks with clear rules and huge amounts of data, like solving calculations or checking thousands of records in seconds.",
        "Repetition without getting tired for example, scanning millions of medical images or checking every product in a factory all day.",
        "Working with speed and accuracy on well-defined problems where the rules are already known.",
        "Remembering and searching through large amounts of information much faster than a human can.",
      ],
    },
    {
      heading: "Humans tend to win at",
      bullets: [
        "Understanding feelings and emotions, like comforting a friend who is sad.",
        "Using common sense and understanding situations where the answer is not obvious.",
        "Reading body language, facial expressions, and jokes or sarcasm that may confuse AI.",
        "Thinking creatively to invent completely new ideas, stories, songs, or solutions.",
        "Making decisions that involve kindness, values, and personal experiences.",
      ],
    },
    {
      heading: "Let's look at an example",
      paragraphs: [
        "Imagine a hospital. A doctor and an AI system work together.",
        "The AI quickly looks through thousands of X-ray images and highlights the ones that may have a problem. It finishes this task in just a few seconds.",
        "The doctor then studies the patient's medical history, talks to the patient, understands how they feel, and decides the best treatment. The doctor also explains everything in a caring and comforting way.",
        "In this situation, AI and humans are not replacing each other they are working together to get the best result.",
      ],
    },
    {
      heading: "A quick rule of thumb",
      paragraphs: [
        "If a task needs speed, repetition, or working with huge amounts of information, AI is usually the better choice.",
        "If a task needs emotions, understanding people, creativity, or making careful decisions, humans are usually the better choice.",
        "Today's AI learns from patterns in data, but it doesn't have real feelings, personal memories, or life experiences like humans do. That's why humans are still essential for many important decisions.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "The goal of AI is not to replace humans. Instead, AI is designed to help people by doing tasks that are repetitive, time-consuming, or require processing lots of information.",
        "The best results often come when humans and AI work together, each using their own strengths.",
      ],
      bullets: [
        "AI is great at speed, memory, and repetition.",
        "Humans are great at emotions, creativity, and understanding situations.",
        "Together, humans and AI can solve bigger problems than either could solve alone.",
      ],
    },
  ],
},

 "ai-around-us": {
  title: "AI Around Us",
  subtitle: "It's not a future technology it's already helping us every single day.",
  eyebrow: "Concept 3 of 5",
  accent: "gold",
  icon: Globe,
  sections: [
    {
      heading: "Hiding in plain sight",
      paragraphs: [
        "When people hear the words 'Artificial Intelligence', they often imagine robots from movies. But the truth is much simpler. AI is already part of our daily lives, even if we don't notice it.",
        "Every time you use your phone, watch videos online, search on the internet, or travel using a navigation app, there's a good chance AI is working behind the scenes. Most of the time, it works so quietly that we forget it's even there.",
        "AI doesn't always look like a robot. Sometimes it is just a smart computer program that helps us make everyday tasks faster, easier, and more convenient.",
      ],
    },
    {
      heading: "Everyday moments powered by AI",
      bullets: [
        "Unlocking your phone using your face or fingerprint.",
        "Autocorrect fixing spelling mistakes while you're typing a message.",
        "Google Maps finding the fastest route and avoiding traffic.",
        "Spam emails being removed before they reach your inbox.",
        "YouTube, Netflix, or Spotify recommending videos, movies, or songs you might enjoy.",
        "Voice assistants like Siri, Google Assistant, or Alexa answering your questions.",
        "Online shopping apps suggesting products based on what you've searched before.",
      ],
    },
    {
      heading: "How does AI know what to do?",
      paragraphs: [
        "Imagine teaching a child to recognize a cat. Instead of showing only one picture, you show hundreds of different cats. Slowly, the child begins to notice common features like ears, eyes, whiskers, and a tail.",
        "AI learns in a similar way. Instead of being told every single rule, it learns by looking at many examples. The more examples it learns from, the better it becomes at recognizing patterns and making predictions.",
        "For example, an email app has seen millions of spam emails before. Because of this, it can often recognize a new spam email without a person having to write a separate rule for every possible message.",
      ],
    },
    {
      heading: "The pattern behind all of them",
      paragraphs: [
        "Most AI systems work by finding patterns in data. They learn from thousands or even millions of examples instead of following one fixed rule for every situation.",
        "Someone trained the AI using many examples of faces, roads, emails, videos, voices, or shopping habits. Over time, the AI learned what these examples had in common and began making its own predictions.",
        "This ability to learn patterns is what makes AI useful in so many different apps and devices we use every day.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "AI is not just something found in science fiction movies or expensive robots. It is already helping millions of people every day, often without them even realizing it.",
        "Whenever a computer learns from data, recognizes patterns, or makes helpful suggestions, there is a good chance AI is involved.",
      ],
      bullets: [
        "AI is already part of everyday life.",
        "It learns from lots of examples instead of following only fixed rules.",
        "AI helps make many daily tasks faster, easier, and smarter.",
      ],
    },
  ],
  },

  "history-of-ai": {
  title: "History of AI",
  subtitle: "From a simple question to smart machines AI has grown step by step over many years.",
  eyebrow: "Concept 4 of 5",
  accent: "purple",
  icon: Clock,
  sections: [
    {
      heading: "A journey of ideas and discoveries",
      paragraphs: [
        "Artificial Intelligence didn't appear in a single day. It took many years of research, experiments, failures, and discoveries before AI became what we know today.",
        "Just like a child learns to walk one step at a time, AI also became smarter little by little. Every new discovery helped scientists solve bigger and more difficult problems.",
        "There were exciting times when AI made amazing progress, but there were also years when progress slowed down because computers weren't powerful enough or the technology wasn't ready yet.",
      ],
    },
    {
      heading: "Boom, winter, boom again",
      paragraphs: [
        "AI's journey has not always been smooth. Sometimes people became very excited about AI and invested time and money into new research. These periods are called AI booms.",
        "At other times, AI could not do everything people expected. Funding became limited, research slowed down, and many projects stopped. These quieter periods are known as 'AI winters.'",
        "Whenever better computers, more data, and smarter ideas became available, AI started growing again. This cycle of progress and setbacks happened several times before AI became widely used.",
      ],
    },
    {
      heading: "Moments that changed everything",
      bullets: [
        "1950 — Alan Turing asked an important question: 'Can a machine think like a human?' This inspired many scientists to explore AI.",
        "1956 — A group of researchers met at Dartmouth College and officially named the field 'Artificial Intelligence.'",
        "1980 — Expert Systems helped computers imitate human experts, allowing them to make decisions and solve real-world problems using predefined rules.",
        "1997 — IBM's Deep Blue defeated the world chess champion, showing that computers could solve very complex problems.",
        "2012 — A deep neural network called AlexNet wins the ImageNet competition by a huge margin, proving that large, layered networks trained on lots of data can outperform hand-built approaches.",
        "2017 — The paper 'Attention Is All You Need' introduces the transformer, letting models weigh every word against every other word at once. It becomes the backbone of modern language models.",
        "2020s — Generative AI tools like ChatGPT, image generators, and coding assistants showed that AI could write stories, answer questions, create images, and even help people write computer programs.",
      ],
    },
    {
      heading: "Why each breakthrough happened",
      paragraphs: [
        "Every major step forward happened because three important things improved together: better computers, larger amounts of data, and smarter algorithms. When these three worked together, AI became much more capable.",
        "Think of it like baking a cake. You need the right ingredients, the right tools, and the right recipe. If even one of them is missing, the cake won't turn out well. AI grows in the same way.",
      ],
      bullets: [
        "More Data — AI learns by studying many examples.",
        "More Computing Power — Faster computers can process much more information in less time.",
        "Better Algorithms — Smarter methods help AI learn more efficiently and make better decisions.",
      ],
    },
    {
      heading: "AI is still growing",
      paragraphs: [
        "The story of AI is not finished. Every year, researchers discover new ways to make AI faster, smarter, and more helpful.",
        "Today, AI helps people in education, healthcare, transportation, business, entertainment, and many other fields. The future will bring even more exciting discoveries.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "AI became powerful because scientists kept improving it over many years. Every important milestone helped AI become more useful than before.",
        "When you look at the timeline, don't just remember the year. Think about what changed and why it was an important step in AI's journey.",
      ],
      bullets: [
        "AI grew step by step, not all at once.",
        "There were times of fast progress and times when research slowed down.",
        "Better computers, more data, and smarter algorithms helped AI improve.",
        "The history of AI is still being written today.",
      ],
    },
  ],
  },

  "types-of-ai": {
  title: "Types of AI",
  subtitle: "Not all AI is created equal — each type has different abilities and limitations.",
  eyebrow: "Concept 5 of 5",
  accent: "teal",
  icon: Layers,
  sections: [
    {
      heading: "Not every AI is the same",
      paragraphs: [
        "When people hear the word 'AI', they often think every AI system can do anything. But that's not true. Different AI systems are built for different purposes.",
        "Some AI can only do one specific task, while others are imagined to be much more powerful. Scientists usually group AI into three main types based on how many different kinds of problems it can solve.",
        "Understanding these types helps us know what today's AI can do, what researchers hope to build in the future, and what currently exists only in theory.",
      ],
    },
    {
      heading: "Three types of AI",
      bullets: [
        "Narrow AI (Weak AI) — Built to do one specific job very well. Examples include voice assistants, face unlock, movie recommendations, language translators, and chess-playing computers. Almost every AI system we use today belongs to this category.",
        "General AI (Strong AI) — A future AI that could learn, understand, and perform almost any task the way a human can. It would not need to be rebuilt for every new job. Scientists are still researching this, and it does not exist today.",
        "Super AI — A theoretical AI that would become smarter than humans in every field, including science, creativity, reasoning, and decision-making. This idea is discussed in research and science fiction, but no one has built such a system.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine three students in a school.",
        "The first student is excellent only in Mathematics but struggles in every other subject. This is like Narrow AI—it is very good at one specific task.",
        "The second student can learn Mathematics, Science, English, Music, Sports, and any new subject with practice. This is similar to the idea of General AI.",
        "The third student knows more than every teacher, scientist, doctor, artist, and engineer in the world combined. This represents the idea of Super AI.",
        "Today, we only have the first type. The other two are still ideas for the future.",
      ],
    },
    {
      heading: "The quickest way to identify an AI",
      paragraphs: [
        "Whenever you see an AI system, ask yourself one simple question:",
        "'Can this AI perform a completely different task without being redesigned or retrained?'",
        "If the answer is 'No', then it is almost certainly Narrow AI.",
        "For example, a chess-playing AI cannot suddenly start driving a car. A face recognition system cannot suddenly become a doctor. They are each experts at only one job.",
        "This is why almost every AI you use today from ChatGPT to recommendation systems and navigation apps is considered Narrow AI, even though it may seem very intelligent.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "The more kinds of tasks an AI can perform, the more advanced it is considered.",
        "Today's AI is powerful, but it is still designed for specific jobs. Researchers continue working toward more flexible AI, but General AI and Super AI have not been achieved yet.",
      ],
      bullets: [
        "Narrow AI = One specific job (exists today).",
        "General AI = Can learn and perform almost any task like a human (future goal).",
        "Super AI = Smarter than humans in every field (theoretical idea).",
        "Almost every AI application you use today is Narrow AI.",
      ],
    },
  ],
  },

  /* ===================== LEVEL 1 · MODULE 2: Machine Learning Without Math ===================== */

  "what-is-learning": {
  title: "What is Learning?",
  subtitle: "Before machines can learn, it helps to know what 'learning' really means.",
  eyebrow: "Concept 1 of 4",
  accent: "teal",
  icon: BookOpen,
  sections: [
    {
      heading: "Learning is getting better with experience",
      paragraphs: [
        "Learning means improving because of something you've experienced before. Every time you try something, make a mistake, and do better the next time, you are learning.",
        "Imagine you're learning to ride a bicycle. At first, you may fall a few times. With practice, you learn how to balance, pedal, and turn. Soon, riding the bicycle becomes easy because your brain has learned from each attempt.",
        "Learning doesn't only happen in school. We learn every day when we remember a new word, solve a puzzle, play a game, or even discover a shortcut to reach home faster.",
      ],
    },
    {
      heading: "Two everyday ingredients of learning",
      bullets: [
        "Feedback — Someone or something tells you whether your answer or action was correct or incorrect.",
        "Repetition — The more you practise, the more confident and accurate you become.",
        "Experience — Every new attempt teaches you something that helps you improve.",
        "Remembering — Learning means using what you've learned before to make better decisions next time.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're playing a new video game for the first time. You may lose the first few rounds because you don't know the rules.",
        "As you keep playing, you begin to understand where the obstacles are, which moves work best, and how to score more points.",
        "You didn't suddenly become better you learned from your previous attempts. Every mistake helped you improve.",
        "This is exactly what learning means: using past experience to perform better in the future.",
      ],
    },
    {
      heading: "Why this matters for machines",
      paragraphs: [
        "Machine Learning follows the same basic idea. Instead of a person learning from experience, a computer learns from lots of examples.",
        "For example, if we show a computer thousands of pictures of cats and dogs, it slowly begins to notice patterns that help it tell them apart.",
        "The computer makes a prediction, checks whether it was correct, and improves its next prediction. It repeats this process again and again until it becomes much better at the task.",
        "Instead of writing hundreds of rules like 'if the ears are pointy, then it is a cat' the computer discovers many of these patterns by learning from examples.",
      ],
    },
    {
      heading: "Learning is everywhere",
      paragraphs: [
        "People, animals, and even computers can all learn, although they learn in different ways.",
        "A child learns by practising and asking questions. A pet learns through rewards and repetition. A machine learns by studying large amounts of data and improving its predictions.",
        "The idea is always the same: experience helps improve future performance.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Learning is not about knowing everything on the first try. It is about improving little by little through experience, practice, and feedback.",
        "This simple idea is the foundation of Machine Learning. Just as people become better with practice, machines can also become better by learning from many examples.",
      ],
      bullets: [
        "Learning means improving through experience.",
        "Practice and feedback help us learn faster.",
        "Mistakes are part of learning—they help us improve.",
        "Machine Learning is based on the same idea: learning from examples instead of following only fixed rules.",
      ],
    },
  ],
  },

  "how-machines-learn": {
  title: "How Machines Learn",
  subtitle: "Turning the human idea of learning into something a computer can do.",
  eyebrow: "Concept 2 of 4",
  accent: "coral",
  icon: Cpu,
  sections: [
    {
      heading: "Machines learn by practicing",
      paragraphs: [
        "Just like people learn by practising, machines also learn through practice. The difference is that instead of reading books or listening to a teacher, a machine learns by looking at lots of examples.",
        "Imagine teaching a child to recognize apples and oranges. You don't explain every tiny detail. Instead, you show many apples and many oranges until the child starts noticing the differences on their own.",
        "Machine Learning works in a very similar way. We give the computer many examples, and it slowly learns the patterns hidden inside the data.",
      ],
    },
    {
      heading: "The basic learning loop",
      bullets: [
        "Show the machine many examples, such as pictures, numbers, or text.",
        "Let the machine make its best guess based on what it has learned so far.",
        "Compare the guess with the correct answer to see if it was right or wrong.",
        "If the guess is wrong, the machine adjusts itself slightly to make a better guess next time.",
        "Repeat this process thousands or even millions of times until the machine becomes much more accurate.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you want to teach a computer to recognize cats and dogs.",
        "At first, the computer has no idea what either animal looks like. It simply makes random guesses.",
        "After seeing thousands of pictures, it starts noticing useful patterns. For example, it may learn that cats often have different ear shapes, faces, or body features than dogs.",
        "Every correct answer helps the computer become more confident, and every mistake teaches it something new. Over time, its guesses become better and better.",
      ],
    },
    {
      heading: "No hand-written rules",
      paragraphs: [
        "Traditional computer programs work by following instructions written by a programmer. Every rule has to be carefully written before the program can solve a problem.",
        "Machine Learning works differently. Instead of writing hundreds of rules, we provide many examples and let the computer discover the patterns by itself.",
        "You can think of a Machine Learning model like a student who learns from practice instead of memorizing a fixed list of instructions.",
        "The 'rules' the machine follows are not typed by a human they are learned automatically from the data it studies.",
      ],
    },
    {
      heading: "Why do machines need so much data?",
      paragraphs: [
        "A person may recognize a cat after seeing only a few pictures, but computers are not as naturally intelligent as humans. They usually need thousands or even millions of examples before they become good at a task.",
        "The more good-quality examples a machine sees, the better it becomes at finding patterns and making accurate predictions.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Machines do not understand the world the way humans do. They learn by looking at many examples, making guesses, checking their mistakes, and improving little by little.",
        "This process of learning from data is what makes Machine Learning different from traditional computer programming.",
      ],
      bullets: [
        "Machines learn from examples, not from experience like humans.",
        "Every mistake helps the machine improve.",
        "The learning process happens through repeated practice.",
        "More good-quality data usually leads to better learning.",
      ],
    },
  ],
   },

  "training-vs-testing": {
  title: "Training vs Testing",
  subtitle: "Studying for the exam is not the same thing as taking it.",
  eyebrow: "Concept 3 of 4",
  accent: "gold",
  icon: Table2,
  sections: [
    {
      heading: "Learning first, testing later",
      paragraphs: [
        "Imagine your teacher gives you a book full of practice questions before an exam. You use these questions to study, learn from your mistakes, and improve your understanding.",
        "On exam day, however, the teacher doesn't ask the exact same questions. Instead, you receive new questions that test whether you've truly understood the topic.",
        "Machine Learning works in exactly the same way. Before a machine is tested, it is first allowed to learn from one group of examples. Later, it is tested using completely different examples that it has never seen before.",
      ],
    },
    {
      heading: "Two separate groups of data",
      bullets: [
        "Training Data — The examples the machine studies to learn patterns and improve its predictions.",
        "Testing Data — New examples that the machine has never seen before. These are used to check how well it has really learned.",
        "Training is like studying with practice questions before an exam.",
        "Testing is like answering new questions in the final exam without looking at your notes.",
      ],
    },
    {
      heading: "Why the split matters",
      paragraphs: [
        "If we tested the machine using the same examples it studied, it might appear very smart even if it simply memorized the answers.",
        "By giving the machine new, unseen examples, we can check whether it has actually learned the pattern or whether it only remembered the training data.",
        "This helps us build AI systems that can solve new problems instead of only repeating what they have already seen.",
      ],
      bullets: [
        "Training helps the machine learn.",
        "Testing checks whether the machine can use its learning on new examples.",
        "Good AI should perform well on both familiar and new data.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're preparing for a spelling competition. You practise by writing the same 100 words every day until you know them perfectly.",
        "On the competition day, the teacher asks you to spell 20 completely new words.",
        "If you can spell the new words correctly, it means you've learned the spelling rules, not just memorized the practice list.",
        "Machine Learning follows the same idea. The testing data checks whether the machine has learned the rules instead of simply remembering the training examples.",
      ],
    },
    {
      heading: "The word to know: Overfitting",
      paragraphs: [
        "Sometimes a machine becomes too focused on its training data. Instead of learning the general pattern, it memorizes the examples one by one.",
        "This problem is called Overfitting.",
        "An overfitted model may score almost perfectly on its training data but perform poorly when it sees new examples because it never truly learned how to solve new problems.",
        "The training and testing split helps us discover this problem before we use the AI in the real world.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A smart machine is not one that remembers every answer it is one that can correctly solve problems it has never seen before.",
        "Training teaches the machine, while testing checks whether it has truly understood what it learned.",
      ],
      bullets: [
        "Training = Learning from examples.",
        "Testing = Solving new examples.",
        "Training and testing data should always be different.",
        "Overfitting happens when the machine memorizes instead of learning.",
      ],
    },
  ],
  },

  examples: {
    title: "Machine Learning in Everyday Examples",
    subtitle: "Tying the whole module together with cases you already recognise.",
    eyebrow: "Concept 4 of 4",
    accent: "purple",
    icon: Sparkles,
    sections: [
      {
        heading: "Same recipe, different ingredients",
        bullets: [
          "Email spam filters — trained on thousands of past emails marked spam or not spam",
          "Music recommendations — trained on what millions of listeners played next",
          "Handwriting recognition — trained on huge numbers of handwritten digits and letters",
          "Medical scan screening — trained on scans doctors have already labelled",
        ],
      },
      {
        heading: "The common thread",
        paragraphs: [
          "Every one of these systems follows the same loop from the last two concepts: gather labelled examples, train on most of them, test on the rest, and keep the version that generalises best to data it has never seen.",
        ],
      },
    ],
  },

  /* ===================== LEVEL 1 · MODULE 3: Computer Vision ===================== */

  "face-recognition": {
  title: "Face Recognition",
  subtitle: "How your phone knows it's really you in just a few seconds.",
  eyebrow: "Concept 1 of 4",
  accent: "teal",
  icon: ScanFace,
  sections: [
    {
      heading: "How does a computer recognize your face?",
      paragraphs: [
        "When you unlock your phone using Face Unlock, it may look like the phone is simply comparing your picture with another picture. But that's not how it actually works.",
        "Instead of remembering your entire face like a photograph, the AI looks for important features such as the distance between your eyes, the shape of your nose, the outline of your face, and other unique details.",
        "These features are turned into numbers that create a unique digital pattern for your face. This pattern is much easier and faster for a computer to compare than a full image.",
      ],
    },
    {
      heading: "How Face Recognition works",
      bullets: [
        "Step 1 – Enrollment: When you set up Face Unlock, your phone scans your face and creates a unique digital pattern.",
        "Step 2 – Store: This digital pattern is securely stored inside your device instead of saving a simple photograph.",
        "Step 3 – Scan Again: Every time you unlock your phone, the camera scans your face again and creates a new digital pattern.",
        "Step 4 – Compare: The phone compares the new pattern with the one saved earlier.",
        "Step 5 – Decision: If the two patterns are similar enough, your phone unlocks. If they are too different, it stays locked.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your best friend is standing far away. Even if you cannot clearly see every detail, you can still recognize them by looking at their height, hairstyle, face shape, or the way they walk.",
        "Face Recognition works in a similar way. It doesn't need to compare every tiny pixel. Instead, it looks at important features that make a person's face unique.",
        "Because everyone's face is slightly different, these features help AI tell one person from another.",
      ],
    },
    {
      heading: "Can Face Recognition make mistakes?",
      paragraphs: [
        "Yes. Like people, AI can sometimes make mistakes.",
        "If the room is very dark, if someone is wearing sunglasses or a mask, or if the face is turned too much to one side, the camera may not capture enough information.",
        "Modern Face Recognition systems are much better than older ones, but they are still not perfect. Engineers continue improving them to make them faster, safer, and fairer for everyone.",
      ],
      bullets: [
        "Poor lighting can reduce accuracy.",
        "Masks, hats, or sunglasses may hide important facial features.",
        "A face viewed from a very unusual angle may be harder to recognize.",
        "Good-quality training data helps improve accuracy for people of different ages, skin tones, and backgrounds.",
      ],
    },
    {
      heading: "Where do we use Face Recognition?",
      paragraphs: [
        "Face Recognition is used in many places besides smartphones. It helps make everyday life more convenient and secure.",
      ],
      bullets: [
        "Unlocking smartphones and tablets.",
        "Security systems for offices and buildings.",
        "Automatic attendance systems in schools and companies.",
        "Airport identity verification.",
        "Photo apps that automatically group pictures of the same person.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Face Recognition does not simply compare two photographs. It finds important facial features, converts them into a digital pattern, and compares that pattern with one stored earlier.",
        "The better the match, the more confident the AI becomes that it is looking at the correct person.",
      ],
      bullets: [
        "AI recognizes important facial features, not just pictures.",
        "Every face is converted into a unique digital pattern.",
        "The new scan is compared with the saved pattern.",
        "Good lighting and clear facial features help improve accuracy.",
      ],
    },
  ],
  

  },

  "self-driving-cars": {
  title: "Self-Driving Cars",
  subtitle: "How AI helps a car see the road, make decisions, and drive safely.",
  eyebrow: "Concept 2 of 4",
  accent: "coral",
  icon: Car,
  sections: [
    {
      heading: "How can a car drive by itself?",
      paragraphs: [
        "When a person drives a car, they constantly look at the road, notice what is happening around them, think about what to do next, and then control the steering wheel, brakes, and accelerator.",
        "A self-driving car follows the same basic idea. Instead of using human eyes and a human brain, it uses cameras, sensors, and Artificial Intelligence to understand its surroundings and make driving decisions.",
        "The car repeats this process every second so it can react quickly to changing traffic conditions and keep passengers safe.",
      ],
    },
    {
      heading: "Three simple steps",
      bullets: [
        "Perceive (See) — Cameras, radar, and lidar collect information about roads, traffic lights, people, vehicles, bicycles, and other nearby objects.",
        "Predict (Think) — The AI estimates what might happen next. Will the pedestrian cross the road? Will the car ahead stop suddenly? Will another vehicle change lanes?",
        "Decide (Act) — Based on its predictions, the AI chooses whether to steer, brake, slow down, speed up, or stop safely.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're riding your bicycle and you see a ball roll onto the road.",
        "You immediately think that a child might run after the ball. Even before the child appears, you slow down because you expect someone to cross the road.",
        "A self-driving car tries to do something similar. It doesn't only react to what it sees right now it also predicts what could happen next and prepares for it.",
      ],
    },
    {
      heading: "Why this is much harder than it sounds",
      paragraphs: [
        "Roads are full of surprises. Every journey is different, and the AI must be ready for situations it may not have seen before.",
        "A stop sign could be partly covered by snow or trees. Heavy rain or fog might make it difficult for cameras to see clearly. A cyclist may suddenly change direction, or a ball could roll onto the road before a child runs after it.",
        "The AI must understand these situations in just a fraction of a second and make the safest possible decision.",
      ],
      bullets: [
        "Bad weather like rain, fog, or snow can reduce visibility.",
        "Road signs may be damaged, dirty, or partly hidden.",
        "People and animals can move in unexpected ways.",
        "Every road is different, so the AI must constantly observe and adapt.",
      ],
    },
    {
      heading: "How does the AI become better?",
      paragraphs: [
        "Self-driving cars are trained using millions of kilometers of driving data collected from different roads, cities, weather conditions, and traffic situations.",
        "By learning from so many examples, the AI becomes better at recognizing objects, predicting what might happen, and making safer driving decisions.",
        "Even today, engineers continue improving self-driving systems because there are always new situations that AI needs to learn how to handle.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A self-driving car is not simply following a map. It is constantly observing the world, thinking about what might happen next, and making safe driving decisions in real time.",
        "Just like a human driver, it must see, think, and act but it does this using cameras, sensors, and Artificial Intelligence.",
      ],
      bullets: [
        "Perceive = See what is happening around the car.",
        "Predict = Think about what may happen next.",
        "Decide = Choose the safest action.",
        "The entire process repeats many times every second while the car is moving.",
      ],
    },
  ],
  },

 "image-classification": {
  title: "Image Classification",
  subtitle: "Teaching a computer to answer one simple question: 'What is this a picture of?'",
  eyebrow: "Concept 3 of 4",
  accent: "gold",
  icon: ImageIcon,
  sections: [
    {
      heading: "What is Image Classification?",
      paragraphs: [
        "Every day, people can look at a picture and quickly recognize what it shows. For example, you can easily tell whether a picture contains a cat, a bicycle, a tree, or a person.",
        "Computers cannot understand images the way humans do. They must first learn from thousands of example pictures before they can recognize objects on their own.",
        "Image Classification is the process of teaching a computer to look at an image and choose the correct label from a list of possible answers.",
      ],
    },
    {
      heading: "How does it work?",
      bullets: [
        "Step 1 – Show the computer thousands of labelled images, such as pictures of cats, dogs, cars, and flowers.",
        "Step 2 – The computer studies these images and starts noticing patterns that make each object unique.",
        "Step 3 – When it sees a new picture, it compares the patterns with what it has learned before.",
        "Step 4 – Finally, it predicts the label that best matches the image.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're learning to recognize different fruits. Your teacher shows you many pictures of apples, bananas, oranges, and mangoes.",
        "After seeing enough examples, you begin to notice their shapes, colors, and sizes. Soon, even when you see a fruit you've never seen before, you can often recognize it correctly.",
        "Image Classification works in the same way. The computer learns from many examples until it becomes good at recognizing new images.",
      ],
    },
    {
      heading: "What is the computer actually looking at?",
      paragraphs: [
        "The computer does not understand images like humans do. Instead, it looks for visual patterns that help it recognize objects.",
      ],
      bullets: [
        "Edges and textures — noticing lines, curves, smooth surfaces, or rough patterns.",
        "Shapes — combining those edges to recognize parts such as ears, wheels, leaves, or wings.",
        "Objects — combining all those parts to recognize the complete object, like a cat, car, bird, or flower.",
        "Patterns — comparing what it sees with thousands of examples it learned during training.",
      ],
    },
    {
      heading: "Where is Image Classification used?",
      paragraphs: [
        "Image Classification is used in many real-life applications that make our lives easier and safer.",
      ],
      bullets: [
        "Identifying diseases from X-ray or MRI images.",
        "Sorting photos automatically in your phone gallery.",
        "Recognizing plants, flowers, or animals using mobile apps.",
        "Detecting defective products in factories.",
        "Helping self-driving cars recognize road signs, traffic lights, and vehicles.",
      ],
    },
    {
      heading: "Can it make mistakes?",
      paragraphs: [
        "Yes. Just like people can sometimes mistake one object for another, AI can also make incorrect predictions.",
        "If an image is blurry, too dark, partly hidden, or very different from the examples it learned during training, the computer may choose the wrong label.",
        "The more high-quality examples the AI learns from, the better it becomes at recognizing new images correctly.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Image Classification is all about giving one correct label to one image. The computer learns by studying thousands of labelled examples and then uses those patterns to recognize new pictures.",
      ],
      bullets: [
        "One image → One predicted label.",
        "The computer learns from many labelled examples.",
        "It recognizes patterns instead of memorizing pictures.",
        "Better training data usually leads to better predictions.",
      ],
    },
  ],
  },

  ocr: {
  title: "OCR (Optical Character Recognition)",
  subtitle: "Turning a picture of words into text that a computer can read, search, and edit.",
  eyebrow: "Concept 4 of 4",
  accent: "purple",
  icon: FileText,
  sections: [
    {
      heading: "What is OCR?",
      paragraphs: [
        "Imagine you take a photo of a page in your notebook. To you, it's easy to read the words, but to a computer, it's just a collection of tiny colored dots called pixels.",
        "OCR, which stands for Optical Character Recognition, helps the computer recognize the letters and numbers inside the image. It converts those letters into real digital text that can be copied, searched, edited, or translated.",
        "Instead of seeing just a picture, the computer begins to understand that the image contains words, sentences, and numbers.",
      ],
    },
    {
      heading: "How does OCR work?",
      bullets: [
        "Step 1 – Capture an image using a camera or scanner.",
        "Step 2 – Find the areas that contain text.",
        "Step 3 – Recognize each letter, number, and symbol.",
        "Step 4 – Combine the characters into words and sentences.",
        "Step 5 – Convert everything into editable digital text.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your teacher gives you a printed worksheet. You read the letters, understand the words, and then write them into your notebook.",
        "OCR does something similar. It 'looks' at the letters in an image and copies them into a form that the computer can understand.",
        "For example, if you scan a printed page from a book, OCR converts the picture of the page into text that you can search, copy, or edit on your computer.",
      ],
    },
    {
      heading: "Everyday places OCR is already working",
      paragraphs: [
        "OCR is used in many apps and services that millions of people use every day, often without realizing it.",
      ],
      bullets: [
        "Scanning a business card and automatically saving the contact details.",
        "A banking app reading account numbers or cheque details from a photo.",
        "Google Translate reading a foreign-language sign or menu through your phone's camera.",
        "Creating searchable PDF documents from scanned books or paper files.",
        "Scanning school notes so they become editable text on a computer.",
        "Reading vehicle number plates for parking systems and traffic monitoring.",
      ],
    },
    {
      heading: "Can OCR make mistakes?",
      paragraphs: [
        "Yes. OCR works best when the text is clear, bright, and easy to read.",
        "If the handwriting is messy, the image is blurry, the page is folded, or the lighting is poor, OCR may confuse similar-looking letters such as 'O' and '0' or 'I' and '1'.",
        "Modern OCR systems are becoming much more accurate, but they still work best with clear, high-quality images.",
      ],
      bullets: [
        "Clear printed text is easier to recognize than messy handwriting.",
        "Good lighting improves OCR accuracy.",
        "High-quality images produce better results.",
        "Smudges, shadows, and blurry photos can cause mistakes.",
      ],
    },
    {
      heading: "OCR vs Image Classification",
      paragraphs: [
        "Although both use Computer Vision, they solve different problems.",
      ],
      bullets: [
        "Image Classification answers: 'What object is in this picture?'",
        "OCR answers: 'What words or numbers are written in this picture?'",
        "Image Classification identifies objects like cats, cars, or trees.",
        "OCR identifies letters, numbers, words, and complete sentences.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "OCR helps computers read text from images. It converts printed or handwritten words into digital text that can be searched, copied, translated, and edited.",
        "Without OCR, a computer would only see a picture of words not the words themselves.",
      ],
      bullets: [
        "OCR reads text from images.",
        "It converts pictures of text into editable digital text.",
        "It works best with clear, high-quality images.",
        "OCR is different from Image Classification because it recognizes words instead of objects.",
      ],
    },
  ],
  },

  /* ===================== LEVEL 1 · MODULE 4: ChatGPT and Generative AI ===================== */

 llms: {
  title: "LLMs (Large Language Models)",
  subtitle: "The engine behind ChatGPT and similar tools — learning language one word at a time.",
  eyebrow: "Concept 1 of 4",
  accent: "teal",
  icon: MessageSquare,
  sections: [
    {
      heading: "What is a Large Language Model?",
      paragraphs: [
        "A Large Language Model, or LLM, is an Artificial Intelligence system that has learned from a huge amount of text such as books, websites, articles, stories, and conversations.",
        "Its main job is surprisingly simple: read the words that have already been written and predict the most likely word that should come next.",
        "By repeating this prediction thousands of times while writing a sentence, the model can generate complete answers, stories, emails, computer code, poems, and even conversations that sound natural.",
      ],
    },
    {
      heading: "Learning by predicting the next word",
      paragraphs: [
        "Imagine someone starts a sentence by saying, 'The sun rises in the...' Most people would immediately think of the word 'east'.",
        "That's very similar to how an LLM works. It doesn't memorize every sentence. Instead, it learns language patterns from millions of examples and predicts which word is most likely to come next.",
        "Each prediction helps create the next one, and little by little, those predicted words become full paragraphs and meaningful conversations.",
      ],
    },
    {
      heading: "Why is it called 'Large'?",
      bullets: [
        "It learns from an enormous amount of text collected from books, articles, websites, and many other sources.",
        "It contains billions of adjustable values called parameters that help it recognize language patterns.",
        "The larger the model and the more good-quality data it learns from, the better it usually becomes at understanding and generating language.",
        "This large scale helps the model understand grammar, facts, writing styles, and many different topics.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're reading a story that says, 'The little boy opened his umbrella because it started to...' Most people would naturally predict the next word is 'rain'.",
        "You don't know the future you simply use your knowledge and experience to make a good guess.",
        "An LLM does something similar. It looks at the words that came before and predicts what should come next based on patterns it learned during training.",
      ],
    },
    {
      heading: "What an LLM can do",
      bullets: [
        "Answer questions on many different topics.",
        "Write emails, stories, essays, and reports.",
        "Translate text from one language to another.",
        "Summarize long documents into short explanations.",
        "Help programmers write and understand code.",
        "Explain difficult topics in simple language.",
      ],
    },
    {
      heading: "What it isn't doing",
      paragraphs: [
        "An LLM does not think exactly like a human. It doesn't have feelings, personal experiences, or real understanding of the world.",
        "It is not searching the internet every time you ask a question. Instead, it uses the language patterns it learned during training to generate the most likely response.",
        "Because it predicts words based on probability, it can sometimes sound very confident even when its answer is incomplete or incorrect. That's why it's always important to double-check important information.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A Large Language Model becomes powerful because it learns from huge amounts of text and becomes very good at predicting the next word.",
        "That simple idea predicting one word after another is what allows tools like ChatGPT to answer questions, write stories, explain concepts, and have natural conversations with people.",
      ],
      bullets: [
        "LLMs learn from massive amounts of text.",
        "Their main job is predicting the next word.",
        "Many small predictions become complete sentences and conversations.",
        "LLMs generate language using learned patterns they do not think like humans.",
      ],
    },
  ],
  },

 "prompt-engineering": {
  title: "Prompt Engineering",
  subtitle: "The words you choose can completely change the answer you get.",
  eyebrow: "Concept 2 of 4",
  accent: "coral",
  icon: Braces,
  sections: [
    {
      heading: "What is Prompt Engineering?",
      paragraphs: [
        "A prompt is simply the instruction or question you give to an AI. Prompt Engineering is the skill of writing clear, detailed, and well-structured prompts so the AI understands exactly what you want.",
        "Think of AI like a helpful assistant. If you give confusing instructions, it may become confused too. But if you explain your request clearly, it can give a much better answer.",
        "The better your prompt, the better the AI can understand your goal and generate a useful response.",
      ],
    },
    {
      heading: "Same question, very different prompts",
      paragraphs: [
        "Imagine you ask an AI, 'Tell me about animals.' That's a very broad question, so the AI doesn't know whether you want information about pets, wild animals, birds, or sea creatures.",
        "Now imagine asking, 'Explain the life cycle of a butterfly in simple language for a Class 5 student using bullet points.' The AI now has clear instructions about the topic, the audience, and the format.",
        "Both prompts ask about animals, but the second one gives much better guidance. That's why the answers can be very different.",
      ],
    },
    {
      heading: "A few reliable techniques",
      bullets: [
        "Be specific about the format. For example, 'Answer in 3 bullet points' is much clearer than 'Tell me about it.'",
        "Give examples whenever possible. AI learns patterns well and can follow the style of your example.",
        "Ask the AI to explain its reasoning step by step for problems that need careful thinking.",
        "Tell the AI who the answer is for, such as a beginner, a school student, or an expert.",
        "Mention any important details, such as word limit, tone, language, or style.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're asking your teacher for help with homework.",
        "If you simply say, 'Help me,' your teacher won't know what you need.",
        "But if you say, 'Please explain photosynthesis in simple language with one example because I have a science test tomorrow,' your teacher immediately knows how to help you.",
        "AI works in a very similar way. The more clearly you explain your request, the more useful the response is likely to be.",
      ],
    },
    {
      heading: "Common mistakes while writing prompts",
      paragraphs: [
        "Many beginners think AI can automatically understand everything they mean. However, AI only knows what you actually write.",
      ],
      bullets: [
        "Writing very short or unclear prompts.",
        "Leaving out important details about the task.",
        "Changing topics in the middle of the prompt without explaining.",
        "Expecting the AI to guess what you want instead of telling it clearly.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Prompt Engineering is not about using difficult words. It is about giving clear instructions so the AI knows exactly what you want.",
        "A good prompt saves time, produces better answers, and helps AI become a much more useful learning partner.",
      ],
      bullets: [
        "Clear prompts produce clearer answers.",
        "Specific instructions are better than vague requests.",
        "Include the topic, audience, format, and any special requirements.",
        "The quality of the prompt often decides the quality of the response.",
      ],
    },
  ],
  },

  "ai-assistants": {
  title: "AI Assistants",
  subtitle: "From answering questions to actually helping you complete real tasks.",
  eyebrow: "Concept 3 of 4",
  accent: "gold",
  icon: Bot,
  sections: [
    {
      heading: "What is an AI Assistant?",
      paragraphs: [
        "An AI Assistant is a computer program that understands your instructions, answers questions, and helps you complete different kinds of tasks. It is designed to work like a smart helper that is available whenever you need it.",
        "Unlike a simple chatbot that only replies with text, an AI Assistant can often perform useful actions such as reading documents, writing emails, creating code, searching for information, summarizing long articles, or helping you plan your work.",
        "Many modern AI assistants, such as ChatGPT, Microsoft Copilot, Google Gemini, and Claude, use Large Language Models (LLMs) to understand language and communicate naturally with people.",
      ],
    },
    {
      heading: "More than a chat window",
      paragraphs: [
        "Think of an AI Assistant as a very helpful teammate. It doesn't just answer questions it can also use different tools to complete tasks for you.",
        "For example, an AI Assistant may search the web for recent information, read a PDF that you upload, explain difficult topics, write computer programs, generate images, or summarize long documents.",
        "Instead of only giving advice, it can often help you finish real work much faster.",
      ],
    },
    {
      heading: "Common jobs AI assistants do today",
      bullets: [
        "Writing, improving, or correcting emails, essays, and reports.",
        "Answering customer questions on company websites through chatbots.",
        "Summarizing long documents, books, articles, or meeting notes.",
        "Helping programmers write, explain, and debug computer code.",
        "Planning trips, creating study schedules, or organizing daily tasks.",
        "Answering questions and explaining difficult topics in simple language.",
        "Generating ideas for presentations, projects, stories, or business plans.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your teacher asks you to prepare a presentation about space.",
        "Instead of doing everything yourself, you ask an AI Assistant for help.",
        "The assistant can explain the topic, suggest an outline, create bullet points, summarize information, generate images, and even help you prepare questions for your classmates.",
        "It doesn't replace your learning it helps you work faster and focus on understanding the topic.",
      ],
    },
    {
      heading: "Can an AI Assistant do everything?",
      paragraphs: [
        "No. AI Assistants are powerful, but they are not perfect.",
        "Sometimes they may misunderstand your request, give incomplete information, or make mistakes. They also do not have personal experiences, emotions, or human judgment.",
        "For important decisions such as medical, legal, or financial advice, people should always verify the information with trusted experts or reliable sources.",
      ],
      bullets: [
        "AI assistants can make mistakes.",
        "They should be used as helpful tools, not as replacements for human thinking.",
        "Always double-check important information.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "An AI Assistant combines the language abilities of an LLM with additional tools that allow it to complete real-world tasks.",
        "The best AI assistants don't just answer questions they help people learn, create, solve problems, and become more productive.",
      ],
      bullets: [
        "AI Assistants understand natural language.",
        "They can use tools to complete many different tasks.",
        "They help people work faster and learn more effectively.",
        "They are assistants not replacements for human intelligence and decision-making.",
      ],
    },
  ],
  },

  "ai-ethics": {
  title: "AI Ethics",
  subtitle: "Powerful AI should be used responsibly, fairly, and safely.",
  eyebrow: "Concept 4 of 4",
  accent: "purple",
  icon: ShieldCheck,
  sections: [
    {
      heading: "What is AI Ethics?",
      paragraphs: [
        "AI Ethics is the study of using Artificial Intelligence in a way that is fair, safe, honest, and helpful for everyone.",
        "As AI becomes part of our daily lives, it also becomes more important to make sure it is used responsibly. Just because AI can do something doesn't always mean it should.",
        "Good AI should help people, protect their privacy, treat everyone fairly, and avoid causing harm.",
      ],
    },
    {
      heading: "Four important things to think about",
      bullets: [
        "Bias — If AI is trained using unfair or unbalanced data, it may treat some people unfairly or make biased decisions.",
        "Misinformation — AI can sometimes generate answers that sound correct but are actually wrong. That's why important information should always be checked.",
        "Privacy — AI systems may work with personal information such as names, photos, or conversations, so this data should be protected carefully.",
        "Job Impact — AI can automate some tasks, changing the way people work. At the same time, it also creates new kinds of jobs and skills.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your school uses AI to help check homework. If the AI was trained using only a few types of answers, it might incorrectly mark some students' correct work as wrong.",
        "Now imagine an AI chatbot giving incorrect medical advice that someone believes without checking. Small mistakes can sometimes lead to big problems.",
        "These examples show why AI should always be tested carefully and used with human judgment.",
      ],
    },
    {
      heading: "Using AI responsibly",
      paragraphs: [
        "AI is a powerful helper, but it should not replace human thinking. People should use AI to learn, create ideas, solve problems, and save time not to blindly accept every answer it gives.",
        "Responsible AI means asking questions, checking important facts, respecting other people's privacy, and using AI in ways that benefit society.",
      ],
      bullets: [
        "Verify important information before trusting it.",
        "Protect personal and private information.",
        "Use AI to assist learning, not to cheat.",
        "Respect copyright and give credit when required.",
        "Think about how AI decisions might affect other people.",
      ],
    },
    {
      heading: "Why everyone has a role",
      paragraphs: [
        "AI Ethics is not only the responsibility of scientists or engineers. Anyone who builds, uses, or shares AI-generated content has a responsibility to use it wisely.",
        "Whether you're a student, teacher, developer, artist, business owner, or everyday user, your choices matter. Using AI carefully helps make technology safer and more useful for everyone.",
      ],
    },
    {
      heading: "The future of AI",
      paragraphs: [
        "AI will continue to improve and become part of more areas of our lives, including education, healthcare, transportation, science, and entertainment.",
        "The goal is not simply to build smarter AI, but to build AI that is trustworthy, fair, and beneficial for people around the world.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "AI is one of the most powerful technologies ever created. Like electricity or the internet, it can improve people's lives when used responsibly.",
        "The best AI is not only intelligent it is also fair, safe, transparent, and guided by human values.",
      ],
      bullets: [
        "AI should be fair and unbiased.",
        "Always verify important AI-generated information.",
        "Protect privacy and personal data.",
        "Use AI responsibly to help people, not harm them.",
        "Humans are responsible for how AI is used.",
      ],
    },
  ],

  },

  /* ===================== LEVEL 2 · MODULE 1: Python Basics ===================== */

  "variables": {
  title: "Python Variables",
  subtitle: "Variables are like labeled boxes that store information for your program.",
  eyebrow: "Concept 1 of 5",
  accent: "teal",
  icon: Boxes,
  sections: [
    {
      heading: "What is a Variable?",
      paragraphs: [
        "Imagine you have several boxes at home. One box stores toys, another stores books, and another stores clothes. Each box has a label so you know what's inside.",
        "A variable works in exactly the same way. It is a named container that stores information inside a computer program.",
        "Instead of remembering the information yourself, you give it a name, and Python remembers it for you. Whenever you need the information later, you simply use the variable's name.",
      ],
    },
    {
      heading: "Creating a variable in Python",
      paragraphs: [
        "Creating a variable is very easy. You choose a name, use the equal sign (=), and assign a value to it.",
        "Python automatically remembers the value and lets you use it anywhere in your program.",
      ],
      bullets: [
        "name = 'Ananya'",
        "age = 21",
        "marks = 95",
        "is_student = True",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your teacher writes your name on a notebook. Whenever someone wants to know whose notebook it is, they simply read the name written on it.",
        "Variables work in the same way. Instead of writing information everywhere in your program, you store it once inside a variable and use its name whenever you need it.",
        "For example, if your age changes from 21 to 22, you only need to update the variable instead of changing it in many places.",
      ],
    },
    {
      heading: "Different kinds of values variables can store",
      bullets: [
        "Text (String) → name = 'Aman'",
        "Whole Numbers (Integer) → age = 22",
        "Decimal Numbers (Float) → height = 5.8",
        "True or False (Boolean) → is_logged_in = True",
        "Lists of items → fruits = ['Apple', 'Banana', 'Mango']",
      ],
    },
    {
      heading: "Rules for naming variables",
      paragraphs: [
        "Python allows you to choose almost any meaningful name, but there are a few simple rules to follow.",
      ],
      bullets: [
        "Variable names should begin with a letter or an underscore (_).",
        "They can contain letters, numbers, and underscores.",
        "They cannot start with a number.",
        "Spaces are not allowed in variable names.",
        "Choose meaningful names like student_name instead of x or a whenever possible.",
      ],
    },
    {
      heading: "Why do programmers use variables?",
      paragraphs: [
        "Imagine writing your school name 100 times in a program. If the school's name changes, you would have to update it everywhere.",
        "Instead, you can store it in a variable and update it only once.",
        "Variables make programs easier to write, understand, and maintain.",
      ],
      bullets: [
        "Store information for later use.",
        "Avoid repeating the same values again and again.",
        "Make programs easier to read.",
        "Allow values to change while the program is running.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Everyone makes mistakes while learning programming. Understanding these common errors will help you avoid them.",
      ],
      bullets: [
        "Using spaces in variable names (student name ❌).",
        "Starting a variable name with a number (123name ❌).",
        "Using confusing names like x or abc when a meaningful name would be clearer.",
        "Forgetting that Python treats uppercase and lowercase letters differently (Age and age are two different variables).",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A variable is simply a named place where Python stores information. Once a value is stored, you can use the variable again and again throughout your program.",
        "Think of a variable as a labeled box—the label is the variable's name, and the item inside the box is its value.",
      ],
      bullets: [
        "Variables store information.",
        "Every variable has a name and a value.",
        "Values can be changed whenever needed.",
        "Meaningful variable names make programs easier to understand.",
      ],
    },
  ],
  },

  loops: {
  title: "Loops",
  subtitle: "Teaching the computer to repeat a task again and again without writing the same code repeatedly.",
  eyebrow: "Concept 2 of 5",
  accent: "coral",
  icon: GitBranch,
  sections: [
    {
      heading: "What is a Loop?",
      paragraphs: [
        "Imagine your teacher asks you to write your name 20 times. You could write it again and again, but that would take time and be very repetitive.",
        "Instead of writing the same instruction many times, programming gives us something called a loop. A loop tells the computer, 'Repeat this task for me.'",
        "A loop is a programming tool that repeats the same block of code multiple times until the job is finished. It helps programmers write shorter, cleaner, and smarter programs.",
      ],
    },
    {
      heading: "Why do we use loops?",
      paragraphs: [
        "Without loops, programmers would have to write the same code over and over again. This would make programs longer, harder to read, and more likely to contain mistakes.",
        "Loops save time because you write the instructions once, and the computer repeats them as many times as needed.",
      ],
      bullets: [
        "Avoid writing the same code again and again.",
        "Make programs shorter and easier to understand.",
        "Save time while programming.",
        "Reduce mistakes caused by repeated code.",
      ],
    },
    {
      heading: "The two loops you'll use most often",
      bullets: [
        "for loop — Used when you already know how many times you want to repeat something or when you want to go through each item in a collection like a list.",
        "while loop — Used when you don't know exactly how many times to repeat. The loop keeps running until a condition becomes false.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your teacher asks you to clap your hands 10 times.",
        "Instead of saying 'Clap' ten separate times, the teacher could simply say, 'Clap 10 times.'",
        "A loop works in the same way. You write the instruction only once, and Python repeats it automatically.",
        "Similarly, imagine watering every plant in a garden. Instead of giving separate instructions for each plant, you can simply say, 'Water every plant.' A loop follows this idea by repeating the same action for each item.",
      ],
    },
    {
      heading: "Where are loops used?",
      paragraphs: [
        "Loops are everywhere in programming. Whenever a task needs to be repeated, programmers use loops to make the program more efficient.",
      ],
      bullets: [
        "Displaying numbers from 1 to 100.",
        "Printing every student's name from a class list.",
        "Checking every answer in an online quiz.",
        "Reading every file inside a folder.",
        "Processing thousands of images for an AI application.",
        "Repeating game actions until the game ends.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Loops are very powerful, but beginners often make small mistakes while using them.",
      ],
      bullets: [
        "Forgetting to stop a while loop, causing it to run forever (an infinite loop).",
        "Using the wrong number of repetitions in a for loop.",
        "Changing the loop variable incorrectly.",
        "Writing code outside the loop because of incorrect indentation.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A loop allows the computer to repeat the same instructions automatically. Instead of writing the same code many times, you write it once and let Python do the repetition for you.",
        "Whenever you notice yourself repeating the same task, think about using a loop. That's exactly what experienced programmers do.",
      ],
      bullets: [
        "Loops repeat code automatically.",
        "Use a for loop when the number of repetitions is known.",
        "Use a while loop when repetition depends on a condition.",
        "Loops make programs shorter, cleaner, and easier to maintain.",
      ],
    },
  ],
  },

  functions: {
  title: "Functions",
  subtitle: "Writing a set of instructions once and using them whenever you need.",
  eyebrow: "Concept 3 of 5",
  accent: "gold",
  icon: Boxes,
  sections: [
    {
      heading: "What is a Function?",
      paragraphs: [
        "Imagine your teacher asks you to clap your hands 5 times several times during the day. Instead of explaining the same instruction again and again, the teacher could simply say, 'Do the clap activity.'",
        "A function works in the same way. It is a named block of code that performs a specific task. Once you create a function, you can use it whenever you need without writing the same code again.",
        "Functions help programmers organize their code into small, reusable pieces. This makes programs easier to read, understand, and maintain.",
      ],
    },
    {
      heading: "Why do we use functions?",
      paragraphs: [
        "Without functions, programmers often repeat the same code in many different places. If something needs to change later, they must edit every copy of that code.",
        "Functions solve this problem by storing the instructions in one place. Whenever you need those instructions, you simply call the function by its name.",
      ],
      bullets: [
        "Avoid writing the same code repeatedly.",
        "Make programs shorter and more organized.",
        "Save time while programming.",
        "Make code easier to update and fix.",
      ],
    },
    {
      heading: "The three important parts of a function",
      bullets: [
        "Inputs (Parameters) — The information the function needs to perform its task, such as a person's name or two numbers.",
        "Body — The set of instructions that tells the function what to do.",
        "Output (Return Value) — The result the function gives back after completing its work. Some functions return a value, while others simply perform an action.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you have a juice machine. Every time you put fruits into the machine and press the button, it follows the same steps and prepares fresh juice.",
        "The fruits are the inputs, the machine is the function, and the juice is the output.",
        "No matter how many times you use the machine, you don't have to rebuild it each time. In the same way, once a function is created, you can use it again and again whenever you need it.",
      ],
    },
    {
      heading: "Where are functions used?",
      paragraphs: [
        "Functions are used in almost every computer program. They help programmers divide large programs into smaller, manageable tasks.",
      ],
      bullets: [
        "Calculating the total marks of a student.",
        "Displaying a welcome message on a website.",
        "Checking whether a password is correct.",
        "Sending an email or text message.",
        "Processing images in AI applications.",
        "Performing calculations in games and mobile apps.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Functions are simple to use, but beginners often make a few common mistakes while learning them.",
      ],
      bullets: [
        "Creating a function but forgetting to call it.",
        "Passing the wrong number of inputs (parameters).",
        "Expecting a function to return a value when it doesn't.",
        "Using confusing function names instead of meaningful ones like calculate_total() or greet_user().",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A function is a reusable block of code that performs a specific task. Instead of writing the same instructions many times, you write them once inside a function and call the function whenever you need it.",
        "Think of a function like a machine. You provide the required inputs, the machine performs its job, and it may produce an output.",
      ],
      bullets: [
        "Functions help reuse code.",
        "A function can take inputs called parameters.",
        "A function performs a specific task.",
        "A function may return an output.",
        "Functions make programs cleaner, shorter, and easier to maintain.",
      ],
    },
  ],
  },

 lists: {
  title: "Lists",
  subtitle: "Storing many pieces of information together in a single container.",
  eyebrow: "Concept 4 of 5",
  accent: "purple",
  icon: Table2,
  sections: [
    {
      heading: "What is a List?",
      paragraphs: [
        "Imagine you have a basket filled with different fruits like apples, bananas, oranges, and mangoes. Instead of carrying each fruit separately, you keep them together in one basket.",
        "A list in Python works in a very similar way. It is a container that stores multiple values under one variable name. These values are stored in a specific order, so Python remembers which item comes first, second, third, and so on.",
        "Lists are one of the most useful data structures in Python because they allow us to store and work with many pieces of information at once.",
      ],
    },
    {
      heading: "Creating a list",
      paragraphs: [
        "In Python, a list is created by placing values inside square brackets [ ] and separating each value with a comma.",
        "The values inside a list can be numbers, text, or even other lists.",
      ],
      bullets: [
        "fruits = ['Apple', 'Banana', 'Mango']",
        "marks = [88, 91, 76]",
        "colors = ['Red', 'Blue', 'Green']",
        "numbers = [10, 20, 30, 40]",
      ],
    },
    {
      heading: "Why order and position matter",
      paragraphs: [
        "Every item inside a list has a position called an index. Python starts counting from 0 instead of 1.",
        "This means the first item is at index 0, the second item is at index 1, the third item is at index 2, and so on.",
        "Knowing the index allows us to access or change a specific item in the list whenever we need it.",
      ],
      bullets: [
        "The first item is at index 0, not index 1.",
        "Each item has its own unique position.",
        "You can quickly access any item using its index.",
        "The order of items is remembered by Python.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your classroom has a row of five students sitting in fixed seats.",
        "If your teacher asks, 'Who is sitting in the first seat?' everyone knows it's the student sitting at position 1. Python works similarly, except it starts counting from 0.",
        "So the student in the first seat is at index 0, the second student is at index 1, and the third student is at index 2.",
        "This numbering system helps Python quickly find any item inside the list.",
      ],
    },
    {
      heading: "What can we do with lists?",
      paragraphs: [
        "Lists are flexible, which means we can change them even after creating them. We can add new items, remove old ones, update values, or arrange them in a different order.",
      ],
      bullets: [
        "Add new items to a list.",
        "Remove items you no longer need.",
        "Change existing values.",
        "Sort items in alphabetical or numerical order.",
        "Count how many items are in the list.",
        "Loop through every item one by one.",
      ],
    },
    {
      heading: "Where are lists used?",
      paragraphs: [
        "Lists are used almost everywhere in programming because most real-world applications work with groups of data instead of just one value.",
      ],
      bullets: [
        "Storing the names of students in a class.",
        "Keeping a shopping list.",
        "Saving quiz scores or exam marks.",
        "Managing contacts in a phone.",
        "Storing images, sentences, or numbers in AI and Machine Learning applications.",
        "Displaying products on an online shopping website.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Lists are easy to learn, but beginners often make a few common mistakes.",
      ],
      bullets: [
        "Thinking the first item has index 1 instead of 0.",
        "Trying to access an index that doesn't exist.",
        "Forgetting to use square brackets [ ].",
        "Confusing a list with a single variable.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A list is an ordered collection of multiple values stored under one variable name. Every item has its own position, called an index, which starts from 0 in Python.",
        "Whenever you need to store many related values together, a list is usually the best choice.",
      ],
      bullets: [
        "Lists store multiple values together.",
        "Items stay in a specific order.",
        "The first item is at index 0.",
        "Lists can grow, shrink, and be modified anytime.",
        "Lists are widely used in Python, AI, and data science.",
      ],
    },
  ],
  },

 dictionaries: {
  title: "Dictionaries",
  subtitle: "Storing information as 'name → value' pairs for quick and easy lookup.",
  eyebrow: "Concept 5 of 5",
  accent: "teal",
  icon: Database,
  sections: [
    {
      heading: "What is a Dictionary?",
      paragraphs: [
        "Imagine your school keeps a student record book. Instead of remembering every student's information by their position in the book, the teacher searches using the student's name or roll number.",
        "A dictionary in Python works in a similar way. Instead of storing values by their position like a list, it stores information using a key and its corresponding value.",
        "Each key acts like a label, and each value is the information connected to that label. This makes it very easy to find exactly what you need without counting positions.",
      ],
    },
    {
      heading: "Creating a dictionary",
      paragraphs: [
        "A dictionary is created using curly braces { } and stores information as key-value pairs. Each key is followed by a colon (:) and its value.",
        "Keys should be unique so that every piece of information can be found easily.",
      ],
      bullets: [
        "student = {'name': 'Riya', 'age': 15}",
        "book = {'title': 'Python Basics', 'pages': 250}",
        "car = {'brand': 'Toyota', 'color': 'Blue'}",
        "country = {'capital': 'New Delhi', 'currency': 'Rupee'}",
      ],
    },
    {
      heading: "Keys and values, not positions",
      paragraphs: [
        "Unlike a list, a dictionary does not use index numbers like 0, 1, or 2 to find information.",
        "Instead, you use the key to access its value. For example, if the key is 'name', Python immediately finds the person's name without counting through every item.",
        "This makes dictionaries very useful when each piece of information has a meaningful label.",
      ],
      bullets: [
        "Every key has one associated value.",
        "Keys should be unique inside a dictionary.",
        "You look up information using the key, not an index number.",
        "The key acts like a label that helps find the correct value.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you visit a library and want to borrow a book.",
        "Instead of checking every shelf one by one, you search using the book's title in the library computer. The computer quickly finds where the book is located.",
        "A dictionary works in the same way. Instead of searching by position, it uses a key to directly find the value you need.",
      ],
    },
    {
      heading: "When is a dictionary better than a list?",
      paragraphs: [
        "Lists are useful when the order of items is important. Dictionaries are useful when each piece of information has a name or label.",
      ],
      bullets: [
        "Storing a student's information like name, age, and marks.",
        "Keeping product details such as price, brand, and stock.",
        "Saving employee information in a company.",
        "Looking up the meaning of a word in a dictionary app.",
        "Storing user profiles in websites and mobile applications.",
        "Managing settings and configurations in software.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Dictionaries are easy to use, but beginners often make a few common mistakes while learning them.",
      ],
      bullets: [
        "Trying to access a value using an index instead of a key.",
        "Using the same key more than once.",
        "Forgetting to use curly braces { }.",
        "Misspelling a key while trying to access its value.",
      ],
    },
    {
      heading: "Lists vs Dictionaries",
      paragraphs: [
        "Both lists and dictionaries store multiple values, but they organize information in different ways.",
      ],
      bullets: [
        "Lists use positions (indexes) to find items.",
        "Dictionaries use keys (labels) to find values.",
        "Choose a list when order matters.",
        "Choose a dictionary when information has meaningful names like 'name', 'age', or 'price'.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A dictionary stores information as key-value pairs. Instead of remembering where something is stored, you simply use its key to find the value quickly.",
        "Think of a dictionary as a real-life contact book. You search for a person's name (the key) to find their phone number (the value).",
      ],
      bullets: [
        "Dictionaries store information as key-value pairs.",
        "Keys are unique labels used to find values.",
        "You access values using keys, not indexes.",
        "Dictionaries are perfect for storing records and structured information.",
        "They are widely used in Python, web development, AI, and databases.",
      ],
    },
  ],
  },

  /* ===================== LEVEL 2 · MODULE 2: Data ===================== */

 "what-is-data": {
  title: "What is Data?",
  subtitle: "Everything AI learns comes from data collected from the real world.",
  eyebrow: "Concept 1 of 5",
  accent: "coral",
  icon: Database,
  sections: [
    {
      heading: "What is Data?",
      paragraphs: [
        "Data is any piece of information that describes something. It can be a number, a word, a picture, a sound, a video, or even the temperature outside.",
        "Every day, we create and use data without even realizing it. When you click a button, send a message, take a photo, or measure your height, you are creating data.",
        "Artificial Intelligence cannot learn on its own. It learns by studying large amounts of data collected from the real world. The better the data, the better the AI can learn.",
      ],
    },
    {
      heading: "Different types of data",
      paragraphs: [
        "Data comes in many different forms. Some data is easy to organize into tables, while other data is more complex, like images or videos.",
      ],
      bullets: [
        "Numbers – Age, marks, temperature, salary.",
        "Text – Stories, emails, messages, books, and articles.",
        "Images – Photos, X-rays, satellite images, and drawings.",
        "Audio – Songs, voice recordings, and podcasts.",
        "Video – Movies, security camera footage, and online videos.",
      ],
    },
    {
      heading: "Structured vs Unstructured Data",
      paragraphs: [
        "Not all data is organized in the same way. Some data is neatly arranged, while other data is free-form and more difficult for computers to organize.",
      ],
      bullets: [
        "Structured Data – Organized into rows and columns, like spreadsheets, school attendance records, or bank transactions.",
        "Unstructured Data – Information without a fixed format, such as photos, videos, emails, audio recordings, or social media posts.",
        "Structured data is easier for computers to search and analyze.",
        "Unstructured data often requires AI to understand and process it.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your teacher keeps a notebook with every student's marks. The notebook has columns for Name, Roll Number, Math Marks, and Science Marks. This is structured data because everything is neatly organized.",
        "Now imagine a folder containing school photographs, classroom videos, and voice recordings of speeches. These files contain information too, but they are not arranged in rows and columns. This is unstructured data.",
        "Both kinds of data are useful, and AI can learn from both.",
      ],
    },
    {
      heading: "Why is data important for AI?",
      paragraphs: [
        "Just like students learn by reading books and practicing questions, AI learns by studying data.",
        "If an AI is shown thousands of pictures of cats and dogs, it slowly learns the differences between them. If it is shown thousands of handwritten numbers, it learns to recognize handwriting.",
        "The quality of the data is just as important as the quantity. Good-quality data helps AI make better decisions and more accurate predictions.",
      ],
      bullets: [
        "AI learns patterns from data.",
        "More useful examples usually help AI learn better.",
        "Poor-quality data can lead to poor AI predictions.",
        "Clean, accurate, and diverse data improves AI performance.",
      ],
    },
    {
      heading: "Where do we use data every day?",
      paragraphs: [
        "Data is used in almost every part of our daily lives, even if we don't notice it.",
      ],
      bullets: [
        "Weather apps use temperature and rainfall data.",
        "Hospitals store patient records and medical reports.",
        "Schools maintain attendance and exam results.",
        "Online shopping websites store product and customer information.",
        "Maps use traffic and location data to suggest the fastest route.",
        "Streaming apps use viewing history to recommend movies and songs.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think data only means numbers, but data can be almost any kind of information.",
      ],
      bullets: [
        "Thinking only numbers are data.",
        "Confusing data with information.",
        "Believing AI can learn without data.",
        "Assuming all data is stored in tables.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Data is the foundation of Artificial Intelligence. Every AI system learns by studying data collected from the real world.",
        "Whether it is text, numbers, images, audio, or videos, all of it can become valuable data that helps AI understand patterns and make predictions.",
      ],
      bullets: [
        "Data is any recorded information.",
        "AI learns from data, not by itself.",
        "Data can be structured or unstructured.",
        "Better data usually leads to better AI.",
        "Data is the fuel that powers Artificial Intelligence.",
      ],
    },
  ],
  },

  csv: {
  title: "CSV",
  subtitle: "A simple file that stores data in rows and columns using commas.",
  eyebrow: "Concept 2 of 5",
  accent: "gold",
  icon: Table2,
  sections: [
    {
      heading: "What is a CSV file?",
      paragraphs: [
        "CSV stands for Comma-Separated Values. It is one of the simplest and most common file formats used to store data.",
        "A CSV file organizes information into rows and columns, just like a table or a spreadsheet. Each row represents one record, and each column represents a different type of information.",
        "Instead of using special formatting, a CSV file simply separates each value with a comma. Because it is plain text, it can be opened and read by many different programs.",
      ],
    },
    {
      heading: "How does a CSV file look?",
      paragraphs: [
        "Imagine a class attendance sheet. The first row contains the column names, and every row below stores information about one student.",
        "For example, a CSV file might contain columns like Name, Age, and Marks, with each student's details written on a separate row.",
        "Although it looks like a table in spreadsheet software, it is actually just plain text with commas separating each value.",
      ],
      bullets: [
        "Each row represents one record.",
        "Each column stores one type of information.",
        "Commas separate the values in each row.",
        "The first row usually contains column headings.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your teacher has a notebook containing every student's Name, Roll Number, and Marks.",
        "When this information is saved as a CSV file, each student's details are written on one line, and commas separate each value.",
        "Computers can easily read this format, making it simple to store and share large amounts of information.",
      ],
    },
    {
      heading: "Why is CSV used so often?",
      paragraphs: [
        "CSV files are simple, lightweight, and supported by almost every programming language, spreadsheet application, and database.",
        "Because the format is easy to understand, it has become one of the most popular ways to exchange data between different software applications.",
      ],
      bullets: [
        "Easy to create and edit.",
        "Can be opened in Excel, Google Sheets, and many other spreadsheet programs.",
        "Supported by Python and almost every programming language.",
        "Small file size because it stores only text.",
        "Easy to share between different applications.",
      ],
    },
    {
      heading: "Why is CSV important in AI and Data Science?",
      paragraphs: [
        "Most Artificial Intelligence and Machine Learning projects begin with data stored in CSV files.",
        "For example, a dataset containing thousands of students' marks, house prices, customer details, or weather records is often stored as a CSV file before being used to train an AI model.",
        "Python libraries like Pandas can quickly read CSV files, making them one of the most commonly used data formats in AI.",
      ],
      bullets: [
        "Stores training datasets for Machine Learning.",
        "Used to save survey results and business data.",
        "Helps programmers organize large amounts of information.",
        "Can be easily loaded into Python for analysis.",
      ],
    },
    {
      heading: "Where do we use CSV files?",
      paragraphs: [
        "CSV files are used in many real-world applications because they are simple and work with almost every software system.",
      ],
      bullets: [
        "School attendance and marks records.",
        "Customer information in businesses.",
        "Sales reports and financial data.",
        "Weather observations collected every day.",
        "Hospital patient records.",
        "AI and Machine Learning datasets.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "CSV files are easy to use, but beginners sometimes misunderstand how they work.",
      ],
      bullets: [
        "Thinking a CSV file is the same as an Excel file.",
        "Forgetting that values are separated by commas.",
        "Assuming CSV files can store colors, images, or formulas like spreadsheets.",
        "Changing the order of columns without updating the data correctly.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A CSV file is one of the simplest ways to store data in rows and columns. It is easy to read, easy to share, and supported by almost every programming language and spreadsheet application.",
        "Because of its simplicity and compatibility, CSV has become one of the most widely used file formats in Artificial Intelligence, Data Science, and software development.",
      ],
      bullets: [
        "CSV stands for Comma-Separated Values.",
        "It stores data in rows and columns.",
        "Each value is separated by a comma.",
        "CSV files are lightweight and easy to share.",
        "Most AI datasets are stored or shared as CSV files.",
      ],
    },
  ],
  },

  images: {
  title: "Images as Data",
  subtitle: "A computer doesn't see pictures like we do—it sees millions of tiny numbers.",
  eyebrow: "Concept 3 of 5",
  accent: "purple",
  icon: ImageIcon,
  sections: [
    {
      heading: "What is an image to a computer?",
      paragraphs: [
        "When we look at a picture, we immediately recognize people, animals, trees, or cars. Our brain understands what the picture shows almost instantly.",
        "A computer cannot understand a picture in the same way. To a computer, an image is simply a collection of tiny colored dots called pixels. Every pixel stores numbers that describe its color.",
        "These numbers are what computers use to process, analyze, and understand images. Before an AI can recognize a cat or a dog, it first learns patterns from millions of these numbers.",
      ],
    },
    {
      heading: "What are pixels?",
      paragraphs: [
        "A pixel is the smallest building block of a digital image. Think of an image as a giant mosaic made from thousands or even millions of tiny colored squares.",
        "When these tiny squares are placed together, they form the complete picture that we see on a screen.",
        "The more pixels an image has, the clearer and sharper it usually looks.",
      ],
      bullets: [
        "Every image is made up of tiny pixels.",
        "Each pixel stores color information.",
        "Millions of pixels together create a complete picture.",
        "More pixels usually mean higher image quality.",
      ],
    },
    {
      heading: "How does a computer store colors?",
      paragraphs: [
        "Most digital images use three basic colors: Red, Green, and Blue (RGB). Every pixel stores three numbers that tell the computer how much red, green, and blue should appear.",
        "Each color value usually ranges from 0 to 255. By mixing different amounts of these three colors, computers can display millions of different colors.",
      ],
      bullets: [
        "R (Red) → Red color intensity.",
        "G (Green) → Green color intensity.",
        "B (Blue) → Blue color intensity.",
        "Different RGB values create different colors.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you are making a picture using thousands of colorful LEGO blocks or tiny tiles.",
        "Each block has its own color. When all the blocks are placed together in the correct positions, they form a complete image.",
        "Pixels work in exactly the same way. Each pixel stores a small piece of color information, and together they create the full picture.",
      ],
    },
    {
      heading: "Why are images important in AI?",
      paragraphs: [
        "Artificial Intelligence learns by studying thousands or even millions of images. It does not understand the picture like humans do—it learns patterns from the pixel values.",
        "For example, after seeing many pictures of cats, AI learns that certain arrangements of pixels often represent cat ears, eyes, whiskers, and fur.",
        "Over time, it becomes better at recognizing similar patterns in new images.",
      ],
      bullets: [
        "AI learns patterns from image pixels.",
        "Large collections of images help AI improve its accuracy.",
        "Images are widely used to train computer vision models.",
        "Better quality images often lead to better AI performance.",
      ],
    },
    {
      heading: "Where are images used in AI?",
      paragraphs: [
        "Image data is used in many real-world AI applications that help people every day.",
      ],
      bullets: [
        "Face recognition for unlocking smartphones.",
        "Self-driving cars detecting roads, people, and traffic signs.",
        "Hospitals analyzing X-rays and MRI scans.",
        "Security cameras recognizing suspicious activities.",
        "Shopping apps searching products using photos.",
        "Social media automatically recognizing faces and objects.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Images may look simple to us, but computers process them very differently. Beginners often misunderstand how computers see images.",
      ],
      bullets: [
        "Thinking a computer understands pictures like humans do.",
        "Believing an image is stored as one object instead of millions of pixels.",
        "Ignoring image size and resolution when training AI models.",
        "Forgetting that computers only process numerical pixel values.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "An image is simply a collection of tiny pixels, and every pixel stores numbers that represent color. AI learns by finding patterns in these numbers—not by looking at pictures the way humans do.",
        "The better and more consistent the image data, the better an AI system can learn to recognize objects, faces, animals, handwriting, and many other things.",
      ],
      bullets: [
        "Images are made of tiny pixels.",
        "Each pixel stores numerical color values.",
        "AI learns patterns from pixel data.",
        "Higher-quality images usually provide more useful information.",
        "Image data powers many computer vision applications.",
      ],
    },
  ],
},

  audio: {
  title: "Audio as Data",
  subtitle: "How computers turn sounds into numbers they can understand.",
  eyebrow: "Concept 4 of 5",
  accent: "teal",
  icon: Music,
  sections: [
    {
      heading: "What is audio to a computer?",
      paragraphs: [
        "When we hear someone talking, singing, or playing music, our ears understand the sound naturally. We can recognize voices, songs, and different musical instruments almost instantly.",
        "A computer cannot hear sound the way humans do. Instead, it represents every sound as a long sequence of numbers.",
        "To make this possible, a microphone captures sound waves and converts them into digital data. These numbers allow computers and AI systems to store, analyze, and understand audio.",
      ],
    },
    {
      heading: "How is sound stored?",
      paragraphs: [
        "Sound travels through the air as waves. To save these waves on a computer, they are measured many thousands of times every second. This process is called sampling.",
        "Each measurement becomes a number. When all these numbers are stored together, they recreate the original sound whenever you play the audio.",
      ],
      bullets: [
        "Sound travels as waves.",
        "A microphone captures the sound waves.",
        "The computer measures the sound thousands of times every second (sampling).",
        "Each measurement is stored as a number.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine drawing a mountain using thousands of tiny dots. One dot alone doesn't show much, but when all the dots are connected, they form a complete picture.",
        "Audio works in a similar way. Each sample is like one tiny dot. Thousands of samples together recreate the original voice or music.",
      ],
    },
    {
      heading: "Why is audio important in AI?",
      paragraphs: [
        "Artificial Intelligence learns by studying thousands of hours of recorded speech and sounds. It finds patterns in these audio samples to recognize words, voices, music, and even emotions.",
        "This allows AI to understand spoken language, recognize songs, and respond to voice commands.",
      ],
      bullets: [
        "Speech recognition converts spoken words into text.",
        "Voice assistants understand voice commands.",
        "AI learns different accents and languages.",
        "Music recognition identifies songs from short recordings.",
      ],
    },
    {
      heading: "Where is audio used in AI?",
      paragraphs: [
        "Audio data is used in many applications that people use every day.",
      ],
      bullets: [
        "Voice assistants like Siri, Alexa, and Google Assistant.",
        "Speech-to-text apps that convert spoken words into text.",
        "Music apps that recognize songs.",
        "Translation apps that translate spoken language.",
        "Call centers that automatically create conversation summaries.",
        "Voice authentication used in banking and security systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Audio may sound simple to us, but computers process it differently.",
      ],
      bullets: [
        "Thinking computers hear sounds like humans.",
        "Believing sound is stored as words instead of numbers.",
        "Ignoring the importance of good-quality recordings.",
        "Assuming AI understands every voice perfectly.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Audio is simply sound converted into numbers. AI studies these numerical patterns to recognize speech, music, and many other sounds.",
        "Without converting sound into numbers, computers would not be able to understand or process audio.",
      ],
      bullets: [
        "Audio is stored as numbers.",
        "Sampling converts sound waves into digital data.",
        "AI learns patterns from audio samples.",
        "Audio data powers speech recognition and voice assistants.",
        "Better audio quality usually leads to better AI performance.",
      ],
    },
  ],
},
    text: {
  title: "Text as Data",
  subtitle: "Words and sentences are also data that computers can store and process.",
  eyebrow: "Concept 5 of 5",
  accent: "coral",
  icon: FileText,
  sections: [
    {
      heading: "What is text data?",
      paragraphs: [
        "Text data is any information written using letters, words, numbers, or symbols. Stories, books, emails, text messages, web pages, and social media posts are all examples of text data.",
        "Humans read text to understand its meaning. Computers can also work with text, but they first need to store and organize it in a way they can process.",
        "Text is one of the most common types of data in the digital world. Every message you send, every article you read, and every search you make creates text data.",
      ],
    },
    {
      heading: "Examples of text data",
      paragraphs: [
        "Text data appears almost everywhere in our daily lives. Whenever information is written down or typed, it becomes text data.",
      ],
      bullets: [
        "Books and newspapers.",
        "Emails and text messages.",
        "School notes and assignments.",
        "Websites and blogs.",
        "Social media posts and comments.",
        "Product reviews and customer feedback.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your school library has thousands of books. Every book contains words, sentences, and paragraphs. Together, all those books contain a huge amount of text data.",
        "A computer can store all of these books digitally. It can search for words, count how many times a word appears, or help you find a particular sentence much faster than a person could.",
      ],
    },
    {
      heading: "Why is text data important?",
      paragraphs: [
        "Text contains valuable information that helps people communicate, learn, and share ideas. Businesses, schools, hospitals, and governments all use text data every day.",
        "Artificial Intelligence also learns from large collections of text data. By studying books, articles, websites, and conversations, AI learns grammar, spelling, facts, and language patterns.",
      ],
      bullets: [
        "Helps people communicate with each other.",
        "Stores knowledge in books and documents.",
        "Allows computers to search for information quickly.",
        "Provides learning material for AI systems.",
      ],
    },
    {
      heading: "Where is text data used?",
      paragraphs: [
        "Text data is used in many applications that we use every day.",
      ],
      bullets: [
        "Search engines like Google.",
        "Chatbots and virtual assistants.",
        "Translation applications.",
        "Email services and spam filters.",
        "Online learning platforms.",
        "Customer support systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Text may seem simple, but there are a few misconceptions that beginners often have.",
      ],
      bullets: [
        "Thinking text data only means books or documents.",
        "Forgetting that emails, chats, and comments are also text data.",
        "Believing computers understand text exactly like humans do.",
        "Ignoring the importance of clean and well-written text data.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Text is a type of data that contains written information. Computers can store, search, organize, and process text to help people find information and communicate more effectively.",
        "For Artificial Intelligence, text data is one of the most valuable sources of learning because it contains knowledge, language, and human communication.",
      ],
      bullets: [
        "Text is written information.",
        "Books, emails, messages, and websites all contain text data.",
        "Computers can store and process large amounts of text.",
        "AI learns language from text data.",
        "Text data is one of the most widely used forms of data in the world.",
      ],
    },

  ],
},
  /* ===================== LEVEL 2 · MODULE 3: Machine Learning Basics ===================== */

  "machine-learning-basics": {
  title: "Machine Learning Basics",
  subtitle: "Teaching computers to learn from data instead of following fixed rules.",
  eyebrow: "Concept 1 of 8",
  accent: "teal",
  icon: Brain,
  sections: [
    {
      heading: "What is Machine Learning?",
      paragraphs: [
        "Machine Learning (ML) is a branch of Artificial Intelligence that allows computers to learn from data instead of being programmed with every single rule.",
        "Just like students learn by studying examples and practicing, a machine learning model learns by looking at lots of data and finding patterns. The more useful examples it sees, the better it usually becomes at making predictions or decisions.",
        "Instead of telling the computer exactly what to do in every situation, we provide data, and the computer learns the patterns by itself.",
      ],
    },
    {
      heading: "How does Machine Learning work?",
      paragraphs: [
        "The learning process begins with data. The computer studies many examples, finds patterns, learns from them, and then uses those patterns to make predictions on new data it has never seen before.",
        "For example, if an AI is shown thousands of pictures of cats and dogs, it gradually learns the differences between them. Later, when it sees a new picture, it can predict whether it is a cat or a dog.",
      ],
      bullets: [
        "Collect data.",
        "Study the patterns in the data.",
        "Learn from those patterns.",
        "Make predictions or decisions on new data.",
      ],
    },
    {
      heading: "The three main types of Machine Learning",
      paragraphs: [
        "Most Machine Learning problems fall into one of three main learning styles. The type you choose depends on the kind of data you have and what you want the computer to learn.",
      ],
      bullets: [
        "Supervised Learning — The computer learns from examples that already have the correct answers.",
        "Unsupervised Learning — The computer finds hidden patterns or groups in data that has no correct answers.",
        "Reinforcement Learning — The computer learns by trying different actions and receiving rewards or penalties based on its decisions.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a child learning different activities.",
        "When a teacher shows pictures of fruits and tells the child the correct names, the child is learning with guidance. This is similar to Supervised Learning.",
        "When the child is given a basket of toys and groups them by color or size without being told how, this is similar to Unsupervised Learning.",
        "When the child learns to ride a bicycle by practicing, falling, improving, and eventually balancing successfully, this is similar to Reinforcement Learning.",
      ],
    },
    {
      heading: "Why is Machine Learning important?",
      paragraphs: [
        "Modern AI systems generate huge amounts of data every day. It would be impossible for humans to write rules for every situation.",
        "Machine Learning allows computers to discover patterns automatically, making them more flexible and capable of solving complex real-world problems.",
      ],
      bullets: [
        "Learns from data instead of fixed rules.",
        "Improves as more data becomes available.",
        "Can solve complex problems automatically.",
        "Powers many modern AI applications.",
      ],
    },
    {
      heading: "Where is Machine Learning used?",
      paragraphs: [
        "Machine Learning is used in many applications that people interact with every day.",
      ],
      bullets: [
        "Email spam detection.",
        "Movie and music recommendations.",
        "Face recognition on smartphones.",
        "Self-driving cars.",
        "Online shopping product recommendations.",
        "Medical diagnosis and disease detection.",
        "Voice assistants like Siri, Alexa, and Google Assistant.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Machine Learning is often misunderstood because it sounds like computers learn exactly like humans. In reality, they learn patterns from data.",
      ],
      bullets: [
        "Thinking Machine Learning and Artificial Intelligence are the same thing.",
        "Believing computers learn without data.",
        "Assuming Machine Learning always gives correct answers.",
        "Thinking more data always means better results, even if the data is poor quality.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Machine Learning is the process of teaching computers to learn from data and improve with experience instead of following only fixed instructions.",
        "The three main learning styles—Supervised, Unsupervised, and Reinforcement Learning—form the foundation of almost every Machine Learning application you will study.",
      ],
      bullets: [
        "Machine Learning helps computers learn from data.",
        "It finds patterns instead of following only fixed rules.",
        "There are three main learning styles: Supervised, Unsupervised, and Reinforcement Learning.",
        "Machine Learning powers many AI systems we use every day.",
        "Good data is essential for good Machine Learning.",
      ],
    },
  ],
},

"supervised-learning": {
  title: "Supervised Learning",
  subtitle: "Teaching a computer using examples that already have the correct answers.",
  eyebrow: "Concept 2 of 8",
  accent: "coral",
  icon: GraduationCap,
  sections: [
    {
      heading: "What is Supervised Learning?",
      paragraphs: [
        "Supervised Learning is a type of Machine Learning where the computer learns from examples that already have the correct answers. These correct answers are called labels.",
        "Just like a student learns with the help of a teacher, the computer learns by comparing its answers with the correct ones. Every mistake helps it improve, and over time it becomes better at making accurate predictions.",
        "The goal of Supervised Learning is to learn patterns from the labeled data so that it can correctly predict the answers for new data it has never seen before.",
      ],
    },
    {
      heading: "How does Supervised Learning work?",
      paragraphs: [
        "The learning process begins with labeled data. The computer studies each example, makes a prediction, checks whether it is correct, learns from its mistakes, and repeats this process many times.",
        "As it practices with more examples, it gradually becomes more accurate and can make predictions on completely new data.",
      ],
      bullets: [
        "Collect labeled data with correct answers.",
        "Study the examples and learn patterns.",
        "Make predictions.",
        "Compare predictions with the correct answers.",
        "Learn from mistakes and improve over time.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a teacher shows a child many pictures of fruits. Each picture already has a label such as 'Apple', 'Banana', or 'Orange'.",
        "After seeing hundreds of labeled pictures, the child starts recognizing each fruit. Later, when shown a new picture that has no label, the child can correctly identify it.",
        "Supervised Learning works in the same way. The computer learns from labeled examples and then predicts the correct answer for new data.",
      ],
    },
    {
      heading: "Where is Supervised Learning used?",
      paragraphs: [
        "Supervised Learning is one of the most widely used Machine Learning techniques because many real-world problems have labeled data available.",
      ],
      bullets: [
        "Email spam detection.",
        "Face recognition on smartphones.",
        "Disease prediction from medical reports.",
        "House price prediction.",
        "Handwriting recognition.",
        "Weather forecasting.",
        "Credit card fraud detection.",
      ],
    },
    {
      heading: "Why is Supervised Learning important?",
      paragraphs: [
        "Many important AI applications need accurate predictions. Supervised Learning allows computers to learn from past examples and make reliable decisions on new data.",
        "As more good-quality labeled data becomes available, the model usually becomes more accurate and useful.",
      ],
      bullets: [
        "Learns from examples with correct answers.",
        "Makes accurate predictions on new data.",
        "Improves with more labeled training data.",
        "Used in many real-world AI systems.",
      ],
    },
    {
      heading: "Supervised vs Unsupervised Learning",
      paragraphs: [
        "Both methods help computers learn from data, but they learn in different ways.",
      ],
      bullets: [
        "Supervised Learning uses labeled data with correct answers.",
        "Unsupervised Learning uses unlabeled data without correct answers.",
        "Supervised Learning predicts known outputs.",
        "Unsupervised Learning discovers hidden groups and patterns.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Supervised Learning is easy to understand, but beginners often have a few misconceptions.",
      ],
      bullets: [
        "Thinking the computer already knows everything before training.",
        "Believing more data always means better results, even if the labels are incorrect.",
        "Confusing learning with memorizing.",
        "Assuming the model will always make perfect predictions.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Supervised Learning teaches a computer using examples that already have the correct answers. By studying these labeled examples, the computer learns patterns and uses them to make predictions on new data.",
        "It is one of the most common and powerful Machine Learning techniques used in modern Artificial Intelligence.",
      ],
      bullets: [
        "Uses labeled data.",
        "Learns from correct answers.",
        "Finds patterns in examples.",
        "Predicts answers for new data.",
        "Powers many everyday AI applications.",
      ],
    },
  ],
  
},

 "unsupervised-learning": {
  title: "Unsupervised Learning",
  subtitle: "Teaching a computer to discover hidden patterns without being given the correct answers.",
  eyebrow: "Concept 3 of 8",
  accent: "gold",
  icon: Layers,
  sections: [
    {
      heading: "What is Unsupervised Learning?",
      paragraphs: [
        "Unsupervised Learning is a type of Machine Learning where the computer is given data, but no correct answers or labels. Instead of being told what each item is, the computer has to explore the data and discover patterns on its own.",
        "It looks for things that are similar and groups them together. Just like people naturally organize objects into categories, the computer learns to create its own groups by finding similarities in the data.",
        "Since there are no answer labels, the computer acts like a detective, searching for hidden relationships and structures that humans may not immediately notice.",
      ],
    },
    {
      heading: "How does Unsupervised Learning work?",
      paragraphs: [
        "The computer first receives a collection of unlabeled data. It carefully compares the items, measures how similar they are, and then groups similar items together.",
        "Unlike Supervised Learning, no teacher tells the computer whether its groups are correct. The computer creates the groups based only on the patterns it discovers.",
      ],
      bullets: [
        "Collect unlabeled data.",
        "Compare the items to find similarities.",
        "Group similar items together.",
        "Discover hidden patterns without being given correct answers.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your teacher gives you a box filled with colorful buttons. Nobody tells you how to organize them.",
        "You might decide to group them by color, by size, or by shape. Someone else might choose a different way to group them. There is no single correct answer because no labels were provided.",
        "Unsupervised Learning works in exactly the same way. The computer looks at the data and creates groups based on what it finds similar.",
      ],
    },
    {
      heading: "Where is Unsupervised Learning used?",
      paragraphs: [
        "Unsupervised Learning is useful whenever we want to discover hidden patterns or organize large amounts of information without already knowing the correct categories.",
      ],
      bullets: [
        "Grouping customers based on their shopping habits.",
        "Organizing similar news articles into topics.",
        "Grouping songs with similar styles in music apps.",
        "Finding unusual or suspicious banking transactions.",
        "Organizing photos by similar faces or objects.",
        "Discovering patterns in scientific and medical research data.",
      ],
    },
    {
      heading: "Why is Unsupervised Learning important?",
      paragraphs: [
        "In the real world, most data does not come with labels. It would take a huge amount of time and effort for people to label every image, document, or customer record.",
        "Unsupervised Learning helps computers make sense of this unlabeled data by automatically discovering useful patterns and relationships.",
      ],
      bullets: [
        "Works even when no labels are available.",
        "Finds hidden relationships in data.",
        "Helps organize large datasets.",
        "Can discover patterns humans might miss.",
      ],
    },
    {
      heading: "Supervised vs Unsupervised Learning",
      paragraphs: [
        "Both learning methods help computers learn from data, but they use different kinds of information.",
      ],
      bullets: [
        "Supervised Learning uses labeled data with correct answers.",
        "Unsupervised Learning uses unlabeled data without correct answers.",
        "Supervised Learning predicts known outputs.",
        "Unsupervised Learning discovers hidden groups and patterns.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Since the computer creates its own groups, beginners sometimes misunderstand what Unsupervised Learning actually does.",
      ],
      bullets: [
        "Thinking the computer already knows the correct answers.",
        "Believing there is only one correct way to group the data.",
        "Confusing grouping with prediction.",
        "Assuming every discovered pattern is meaningful.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Unsupervised Learning teaches a computer to explore data without any correct answers. Instead of predicting labels, it discovers hidden patterns, similarities, and groups on its own.",
        "This makes it especially useful for exploring large datasets and finding information that humans may not notice immediately.",
      ],
      bullets: [
        "No labels or correct answers are provided.",
        "The computer finds patterns on its own.",
        "Similar items are grouped together.",
        "Used for clustering and pattern discovery.",
        "Most real-world data can benefit from Unsupervised Learning.",
      ],
    },
  ],
},

 "reinforcement-learning": {
  title: "Reinforcement Learning",
  subtitle: "Teaching a computer by rewarding good decisions and improving through practice.",
  eyebrow: "Concept 4 of 8",
  accent: "purple",
  icon: Rocket,
  sections: [
    {
      heading: "What is Reinforcement Learning?",
      paragraphs: [
        "Reinforcement Learning is a type of Machine Learning where a computer learns by trying different actions and receiving rewards or penalties based on its decisions.",
        "Unlike Supervised Learning, nobody tells the computer the correct answer. Instead, it learns through experience by discovering which actions lead to better outcomes.",
        "The computer keeps practicing, learning from its mistakes, and improving its decisions over time. Just like humans learn many skills through trial and error, AI can also learn in the same way.",
      ],
    },
    {
      heading: "How does Reinforcement Learning work?",
      paragraphs: [
        "A computer, called an agent, interacts with its environment. It performs an action, observes what happens, and receives either a reward for a good action or a penalty for a bad one.",
        "By repeating this process many times, the agent slowly learns which actions bring the highest rewards and avoids actions that lead to penalties.",
      ],
      bullets: [
        "The agent observes the environment.",
        "It chooses an action.",
        "It receives a reward or penalty.",
        "It learns from the result.",
        "It repeats the process and improves over time.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you are teaching a puppy to sit. Every time the puppy sits correctly, you give it a treat. If it does something else, it doesn't receive a reward.",
        "After practicing many times, the puppy learns that sitting earns a reward and starts doing it more often.",
        "Reinforcement Learning works in the same way. The AI learns by trying different actions and remembering which ones produce better rewards.",
      ],
    },
    {
      heading: "Where is Reinforcement Learning used?",
      paragraphs: [
        "Reinforcement Learning is used whenever an AI must make a sequence of decisions and improve through experience.",
      ],
      bullets: [
        "Game-playing AI like Chess and Go.",
        "Self-driving cars learning safe driving decisions.",
        "Robots learning to walk or pick up objects.",
        "Recommendation systems improving suggestions.",
        "Warehouse robots finding efficient routes.",
        "Resource management and scheduling systems.",
      ],
    },
    {
      heading: "Why is Reinforcement Learning important?",
      paragraphs: [
        "Many real-world problems don't have one correct answer. Instead, the best decision depends on what happens after each action.",
        "Reinforcement Learning helps AI make smarter decisions by learning from experience instead of memorizing examples.",
      ],
      bullets: [
        "Learns through experience.",
        "Improves with practice.",
        "Finds better decision-making strategies.",
        "Useful for dynamic and changing environments.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Reinforcement Learning sounds simple, but beginners often confuse it with other learning methods.",
      ],
      bullets: [
        "Thinking the computer already knows the correct answer.",
        "Confusing rewards with labeled data.",
        "Believing the AI learns after only a few attempts.",
        "Expecting every action to immediately receive the best reward.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Reinforcement Learning teaches a computer by rewarding good decisions and discouraging poor ones. Over time, the computer learns which actions produce the best long-term results.",
        "It is the learning method behind many intelligent systems that improve through experience.",
      ],
      bullets: [
        "Learns by trial and error.",
        "Uses rewards and penalties.",
        "Improves through repeated practice.",
        "Makes better decisions over time.",
        "Commonly used in robotics, games, and autonomous systems.",
      ],
    },
  ],
},

 "linear-regression": {
  title: "Linear Regression",
  subtitle: "Using a straight line to predict numbers from patterns in data.",
  eyebrow: "Concept 5 of 8",
  accent: "teal",
  icon: BarChart3,
  sections: [
    {
      heading: "What is Linear Regression?",
      paragraphs: [
        "Linear Regression is one of the simplest Machine Learning algorithms. It is used to predict numerical values by finding a relationship between two or more pieces of data.",
        "It works by drawing the best possible straight line through the data points. This line helps the computer estimate future values based on the patterns it has learned.",
        "Instead of predicting categories like 'Cat' or 'Dog', Linear Regression predicts numbers such as price, temperature, salary, or marks.",
      ],
    },
    {
      heading: "How does Linear Regression work?",
      paragraphs: [
        "The algorithm studies existing data and looks for a pattern between the input and the output. It then draws the line that best represents this relationship.",
        "Once the line is created, it can estimate the output for new inputs.",
      ],
      bullets: [
        "Collect data with input and output values.",
        "Find the relationship between them.",
        "Draw the best-fit straight line.",
        "Use the line to predict future values.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you notice that as the number of hours you study increases, your exam marks usually increase too.",
        "If you draw a line showing this pattern, you can estimate how many marks someone might get based on how many hours they study.",
        "Linear Regression learns this relationship automatically and uses it to make predictions.",
      ],
    },
    {
      heading: "Where is Linear Regression used?",
      paragraphs: [
        "Linear Regression is commonly used whenever we need to predict numbers.",
      ],
      bullets: [
        "Predicting house prices.",
        "Estimating student marks.",
        "Forecasting sales.",
        "Predicting temperatures.",
        "Estimating fuel consumption.",
        "Business and financial analysis.",
      ],
    },
    {
      heading: "Why is Linear Regression important?",
      paragraphs: [
        "It is simple, fast, and easy to understand, making it one of the first algorithms every Machine Learning student learns.",
      ],
      bullets: [
        "Predicts numerical values.",
        "Easy to understand and explain.",
        "Works well for simple relationships.",
        "Forms the foundation for many advanced algorithms.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Linear Regression is powerful, but it is not suitable for every problem.",
      ],
      bullets: [
        "Using it to predict categories instead of numbers.",
        "Thinking every relationship is a straight line.",
        "Ignoring unusual data points (outliers).",
        "Expecting perfect predictions every time.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Linear Regression predicts continuous numerical values by finding the best straight-line relationship between input and output data.",
        "Whenever the answer is a number rather than a category, Linear Regression is often one of the first algorithms to consider.",
      ],
      bullets: [
        "Predicts numbers.",
        "Finds the best-fit straight line.",
        "Learns relationships from data.",
        "Simple and easy to understand.",
        "Widely used in prediction problems.",
      ],
    },
  ],
},

 "logistic-regression": {
  title: "Logistic Regression",
  subtitle: "Predicting categories instead of numbers using probability.",
  eyebrow: "Concept 6 of 8",
  accent: "coral",
  icon: PieChart,
  sections: [
    {
      heading: "What is Logistic Regression?",
      paragraphs: [
        "Despite its name, Logistic Regression is not used to predict numbers. It is a Machine Learning algorithm used to predict categories, such as Yes or No, Spam or Not Spam, and Healthy or Sick.",
        "Instead of giving an exact number, it calculates the probability that something belongs to a particular category. Based on that probability, it makes a final prediction.",
        "It is one of the most popular algorithms for solving classification problems.",
      ],
    },
    {
      heading: "How does Logistic Regression work?",
      paragraphs: [
        "The algorithm studies labeled examples and learns the relationship between the input data and the correct category.",
        "When new data arrives, it calculates the probability for each possible outcome and predicts the category with the highest probability.",
      ],
      bullets: [
        "Learn from labeled examples.",
        "Calculate probabilities.",
        "Compare the probabilities.",
        "Predict the most likely category.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine your email app checking whether a new email is Spam or Not Spam.",
        "The AI looks at features such as suspicious words, unknown senders, and unusual links. It then calculates the chance that the email is spam.",
        "If the probability is very high, it places the email in the Spam folder.",
      ],
    },
    {
      heading: "Where is Logistic Regression used?",
      paragraphs: [
        "Logistic Regression is widely used for classification tasks in many industries.",
      ],
      bullets: [
        "Spam email detection.",
        "Disease diagnosis.",
        "Credit card fraud detection.",
        "Customer churn prediction.",
        "Loan approval systems.",
        "Face recognition systems.",
      ],
    },
    {
      heading: "Why is Logistic Regression important?",
      paragraphs: [
        "Many real-world AI applications require deciding between categories instead of predicting numbers. Logistic Regression provides a simple and effective way to make these decisions.",
      ],
      bullets: [
        "Predicts categories instead of numbers.",
        "Uses probability for decision making.",
        "Fast and easy to train.",
        "A popular baseline classification algorithm.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "The name 'Regression' often causes confusion for new learners.",
      ],
      bullets: [
        "Thinking it predicts numbers like Linear Regression.",
        "Confusing classification with regression.",
        "Ignoring the probability score.",
        "Using it for problems with continuous outputs.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Logistic Regression predicts categories by calculating probabilities. Although its name contains the word 'Regression', it is actually a classification algorithm.",
        "It is one of the simplest and most widely used algorithms for binary classification problems.",
      ],
      bullets: [
        "Predicts categories.",
        "Calculates probabilities.",
        "Commonly used for binary classification.",
        "Simple and efficient.",
        "Different from Linear Regression.",
      ],
    },
  ],
},

  "decision-tree": {
  title: "Decision Tree",
  subtitle: "Making decisions by asking one simple question at a time.",
  eyebrow: "Concept 7 of 8",
  accent: "gold",
  icon: GitBranch,
  sections: [
    {
      heading: "What is a Decision Tree?",
      paragraphs: [
        "A Decision Tree is a Machine Learning algorithm that makes predictions by asking a series of simple questions. Each answer leads to another question until the computer reaches a final decision.",
        "It works very much like a flowchart or a game of '20 Questions.' Instead of looking at all the information at once, the computer solves the problem step by step.",
        "Because every decision can be followed from the first question to the final answer, Decision Trees are one of the easiest Machine Learning models to understand.",
      ],
    },
    {
      heading: "How does a Decision Tree work?",
      paragraphs: [
        "The algorithm begins with the most important question. Based on the answer, it moves to the next question. This process continues until it reaches the final prediction, called a leaf node.",
      ],
      bullets: [
        "Start with the first question.",
        "Follow the Yes or No answer.",
        "Move to the next question.",
        "Repeat until a final decision is reached.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you are trying to identify an animal.",
        "You might first ask, 'Can it fly?' If the answer is Yes, you ask another question like, 'Does it have feathers?' If the answer is No, you follow a different path.",
        "After answering a few simple questions, you finally identify the animal. A Decision Tree works exactly the same way.",
      ],
    },
    {
      heading: "Where are Decision Trees used?",
      paragraphs: [
        "Decision Trees are popular because they are simple to understand and explain. They are used in many industries where people want to know why the AI made a particular decision.",
      ],
      bullets: [
        "Medical diagnosis.",
        "Loan approval systems.",
        "Email spam detection.",
        "Customer recommendation systems.",
        "Fraud detection.",
        "Business decision making.",
      ],
    },
    {
      heading: "Why are Decision Trees important?",
      paragraphs: [
        "Unlike some Machine Learning models that behave like a 'black box,' Decision Trees clearly show every step taken to reach a prediction.",
        "This makes them useful whenever explainability and transparency are important.",
      ],
      bullets: [
        "Easy to understand.",
        "Easy to explain to others.",
        "Works with both numbers and categories.",
        "Useful for classification and prediction tasks.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Decision Trees are simple, but they also have some limitations if they become too large.",
      ],
      bullets: [
        "Thinking bigger trees are always better.",
        "Allowing the tree to become too deep and memorize the training data.",
        "Believing every question has equal importance.",
        "Ignoring that different trees can solve the same problem differently.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A Decision Tree makes predictions by asking a sequence of simple questions. Each answer leads to another branch until the model reaches a final decision.",
        "Its biggest advantage is that people can easily understand how the prediction was made.",
      ],
      bullets: [
        "Works like a flowchart.",
        "Asks one question at a time.",
        "Easy to understand and explain.",
        "Used for both classification and prediction.",
        "One of the most beginner-friendly Machine Learning algorithms.",
      ],
    },
  ],
},
knn: {
  title: "KNN (K-Nearest Neighbours)",
  subtitle: "Making predictions by looking at the most similar examples nearby.",
  eyebrow: "Concept 8 of 8",
  accent: "purple",
  icon: Users,
  sections: [
    {
      heading: "What is KNN?",
      paragraphs: [
        "K-Nearest Neighbours (KNN) is a Machine Learning algorithm that predicts by comparing a new data point with the most similar examples it has already seen.",
        "Instead of learning complicated rules, KNN simply asks, 'Which existing examples are closest to this new one?' It then makes a prediction based on those nearby examples.",
        "The word 'K' represents how many neighbours the algorithm should consider before making its decision.",
      ],
    },
    {
      heading: "How does KNN work?",
      paragraphs: [
        "When a new data point arrives, the algorithm measures how close it is to every existing example. It then selects the nearest K neighbours and lets them 'vote' for the final prediction.",
      ],
      bullets: [
        "Choose a value for K.",
        "Measure the distance to every existing data point.",
        "Find the K closest neighbours.",
        "Use the majority vote or average to make the prediction.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you move to a new school and want to know whether a new student likes football.",
        "You look at the student's closest friends. If most of those friends enjoy football, you might guess that the new student also likes football.",
        "KNN works in the same way. It predicts based on the most similar examples nearby.",
      ],
    },
    {
      heading: "Where is KNN used?",
      paragraphs: [
        "KNN is useful whenever similar items are likely to have similar outcomes.",
      ],
      bullets: [
        "Movie recommendation systems.",
        "Product recommendation systems.",
        "Handwriting recognition.",
        "Image classification.",
        "Medical diagnosis.",
        "Customer segmentation.",
      ],
    },
    {
      heading: "Why is KNN important?",
      paragraphs: [
        "KNN is one of the easiest Machine Learning algorithms to understand because it does not build a complex mathematical model. Instead, it simply compares new data with existing examples.",
      ],
      bullets: [
        "Simple to understand.",
        "Easy to implement.",
        "Works well for many classification problems.",
        "Learns from similar examples.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Although KNN is simple, choosing the wrong value of K can affect its performance.",
      ],
      bullets: [
        "Choosing a K value that is too small.",
        "Choosing a K value that is too large.",
        "Ignoring the importance of measuring distance correctly.",
        "Using KNN with very large datasets without optimization.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "KNN predicts by looking at the most similar examples already available. The prediction is based on the nearest neighbours instead of complicated rules.",
        "It follows a simple idea: similar things are usually found close to each other.",
      ],
      bullets: [
        "Looks for similar neighbours.",
        "Uses distance to compare data.",
        "Makes predictions using majority voting or averaging.",
        "The value of K affects the prediction.",
        "One of the simplest Machine Learning algorithms.",
      ],
    },
  ],
},


  /* ===================== LEVEL 2 · MODULE 4: Neural Networks ===================== */

  "neural-networks": {
  title: "Neural Networks",
  subtitle: "A team of tiny artificial neurons working together to solve big problems.",
  eyebrow: "Concept 1 of 8",
  accent: "teal",
  icon: Network,
  sections: [
    {
      heading: "What is a Neural Network?",
      paragraphs: [
        "A Neural Network is a Machine Learning model inspired by the human brain. Instead of one intelligent unit doing all the work, it contains thousands or even millions of tiny artificial neurons that work together.",
        "Each neuron performs a very small task. By combining the work of many neurons, the network can recognize images, understand speech, translate languages, and even power AI systems like ChatGPT.",
        "Just like people solve difficult problems by working together as a team, artificial neurons also work together to solve complex problems that a single neuron cannot solve alone.",
      ],
    },
    {
      heading: "How does a Neural Network work?",
      paragraphs: [
        "A Neural Network receives information as input, processes it through several layers of neurons, and finally produces an output or prediction.",
        "Every neuron passes useful information to the next layer until the network reaches its final answer.",
      ],
      bullets: [
        "Receive the input data.",
        "Process the information through many neurons.",
        "Learn patterns during training.",
        "Produce a prediction or decision.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a school project where every student has a different responsibility. One student collects information, another writes the report, another creates the presentation, and another explains it.",
        "No single student completes the entire project alone. Together, they produce the final result.",
        "A Neural Network works in the same way. Each neuron performs a small task, and together they solve a much bigger problem.",
      ],
    },
    {
      heading: "Where are Neural Networks used?",
      paragraphs: [
        "Neural Networks are used in many of the AI applications we use every day.",
      ],
      bullets: [
        "Image recognition.",
        "Speech recognition.",
        "Face recognition.",
        "Self-driving cars.",
        "Language translation.",
        "Medical diagnosis.",
        "ChatGPT and other AI assistants.",
      ],
    },
    {
      heading: "Why are Neural Networks important?",
      paragraphs: [
        "Many real-world problems are too complex for traditional computer programs. Neural Networks can automatically learn complicated patterns from large amounts of data.",
        "This ability has made them the foundation of modern Artificial Intelligence and Deep Learning.",
      ],
      bullets: [
        "Learns complex patterns.",
        "Improves with more data.",
        "Can solve difficult AI problems.",
        "Forms the foundation of Deep Learning.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Neural Networks sound similar to the human brain, but they are much simpler than real biological brains.",
      ],
      bullets: [
        "Thinking Neural Networks think exactly like humans.",
        "Believing one neuron is intelligent by itself.",
        "Assuming bigger networks always perform better.",
        "Expecting Neural Networks to learn without training data.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A Neural Network is a collection of many artificial neurons working together to learn patterns and make predictions.",
        "Each neuron performs a simple task, but together they can solve incredibly complex problems.",
      ],
      bullets: [
        "Inspired by the human brain.",
        "Made of many artificial neurons.",
        "Learns from data.",
        "Used in Deep Learning.",
        "Powers many modern AI systems.",
      ],
    },
  ],
},

 "biological-neuron": {
  title: "Biological Neuron",
  subtitle: "The tiny brain cell that inspired modern Artificial Intelligence.",
  eyebrow: "Concept 2 of 8",
  accent: "coral",
  icon: Brain,
  sections: [
    {
      heading: "What is a Biological Neuron?",
      paragraphs: [
        "A Biological Neuron is a nerve cell found in the brain and nervous system. It is the basic building block of the human brain and is responsible for receiving, processing, and transmitting information throughout the body.",
        "The human brain contains nearly 86 billion neurons. Although each neuron performs only a small task, together they allow us to think, learn, remember, recognize objects, speak, and make decisions.",
        "Scientists studied how these neurons communicate with one another, and this inspired the creation of Artificial Neural Networks used in modern AI.",
      ],
    },
    {
      heading: "Parts of a Biological Neuron",
      paragraphs: [
        "A biological neuron has different parts, and each part performs a specific function in processing information.",
      ],
      bullets: [
        "Dendrites – Receive signals from other neurons.",
        "Cell Body (Soma) – Processes and combines all incoming signals.",
        "Nucleus – Controls the activities of the neuron.",
        "Axon – Carries the electrical signal away from the cell body.",
        "Axon Terminals – Pass the signal to the next neuron through tiny gaps called synapses.",
      ],
    },
    {
      heading: "How does a Biological Neuron work?",
      paragraphs: [
        "A neuron continuously receives electrical signals from many nearby neurons through its dendrites. These signals are combined inside the cell body.",
        "If the combined signal becomes strong enough to cross a certain threshold, the neuron 'fires' an electrical impulse that travels along the axon and is passed to the next neuron.",
        "This process happens billions of times every second, allowing the brain to process information extremely quickly.",
      ],
      bullets: [
        "Receive signals through dendrites.",
        "Combine all incoming signals.",
        "Check if the signal crosses the firing threshold.",
        "Send the signal through the axon.",
        "Pass the message to the next neuron.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're deciding whether to carry an umbrella before leaving home. You look at dark clouds, check the weather forecast, and feel the wind.",
        "Your brain collects all these pieces of information. If enough evidence suggests it will rain, the neuron fires and your brain decides to carry the umbrella.",
        "Similarly, a biological neuron collects many signals, combines them, and only sends an output when there is enough evidence to do so.",
      ],
    },
    {
      heading: "Why is a Biological Neuron important?",
      paragraphs: [
        "Biological neurons are the inspiration behind Artificial Neural Networks. Researchers observed how real neurons communicate and designed artificial neurons that follow a simplified version of the same idea.",
        "Understanding biological neurons helps us understand why neural networks are built using layers of connected artificial neurons.",
      ],
      bullets: [
        "Inspired Artificial Neural Networks.",
        "Shows how information flows in the brain.",
        "Explains how learning happens naturally.",
        "Forms the foundation of Deep Learning concepts.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Artificial neurons are inspired by biological neurons, but they are much simpler and do not behave exactly like real brain cells.",
      ],
      bullets: [
        "Thinking artificial neurons are exact copies of brain cells.",
        "Believing a single neuron can perform intelligent tasks by itself.",
        "Assuming neurons always fire regardless of signal strength.",
        "Confusing biological neurons with artificial neurons.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A Biological Neuron receives information, processes it, and sends it forward only when the signal is strong enough.",
        "Millions of these simple neurons working together make human intelligence possible and inspired the development of Artificial Neural Networks.",
      ],
      bullets: [
        "Basic unit of the human brain.",
        "Receives, processes, and transmits information.",
        "Works with billions of other neurons.",
        "Inspired Artificial Neural Networks.",
        "Foundation of modern AI concepts.",
      ],
    },
  ],
  },

 "artificial-neuron": {
  title: "Artificial Neuron",
  subtitle: "A mathematical version of a brain cell designed to learn from data.",
  eyebrow: "Concept 3 of 8",
  accent: "gold",
  icon: Cpu,
  sections: [
    {
      heading: "What is an Artificial Neuron?",
      paragraphs: [
        "An Artificial Neuron is the basic building block of an Artificial Neural Network. It was inspired by the way biological neurons process information in the human brain.",
        "Instead of electrical signals and chemicals, an artificial neuron works with numbers. It receives inputs, processes them mathematically, and produces an output.",
        "Although a single artificial neuron is very simple, millions of them working together can solve complex tasks such as image recognition, speech processing, and language understanding.",
      ],
    },
    {
      heading: "How does an Artificial Neuron work?",
      paragraphs: [
        "An artificial neuron receives multiple input values. Each input is assigned a weight that represents its importance.",
        "The neuron multiplies every input by its corresponding weight, adds all the results together, and then decides what output to produce.",
        "This process allows the neuron to determine which inputs are more important and which are less important when making a decision.",
      ],
      bullets: [
        "Receive input values.",
        "Multiply each input by its weight.",
        "Add all weighted inputs together.",
        "Apply a decision rule or activation function.",
        "Generate an output.",
      ],
    },
    {
      heading: "What are weights?",
      paragraphs: [
        "Weights are numerical values that determine how important each input is to the neuron.",
        "A larger weight means the input has a stronger influence on the neuron's decision, while a smaller weight means it has less influence.",
        "During training, the neural network continuously adjusts these weights to improve its predictions and reduce errors.",
      ],
      bullets: [
        "Represent importance of inputs.",
        "Can increase or decrease influence.",
        "Learned automatically during training.",
        "Main source of learning in neural networks.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a teacher deciding a student's final performance based on attendance, assignments, and exam marks.",
        "The teacher may consider exam marks more important than attendance. Therefore, exam marks receive a higher weight.",
        "Similarly, an artificial neuron assigns different weights to different inputs before making a decision.",
      ],
    },
    {
      heading: "How is it different from a Biological Neuron?",
      paragraphs: [
        "A biological neuron works using electrical and chemical signals, while an artificial neuron works using mathematical calculations.",
        "Artificial neurons are much simpler than real brain cells but follow the same basic idea of receiving information, processing it, and producing an output.",
      ],
      bullets: [
        "Biological neurons use electrical signals.",
        "Artificial neurons use numbers and equations.",
        "Artificial neurons are simplified models.",
        "Both process information and produce outputs.",
      ],
    },
    {
      heading: "Why are Artificial Neurons important?",
      paragraphs: [
        "Artificial neurons are the foundation of every neural network. Without them, modern AI systems would not exist.",
        "By connecting many artificial neurons together, we can build systems capable of recognizing patterns, learning from data, and making intelligent predictions.",
      ],
      bullets: [
        "Foundation of Neural Networks.",
        "Enable machines to learn from data.",
        "Power Deep Learning systems.",
        "Used in modern AI applications.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think an artificial neuron is intelligent by itself, but a single neuron can perform only very simple calculations.",
      ],
      bullets: [
        "Thinking one neuron can solve complex problems alone.",
        "Assuming weights never change.",
        "Confusing inputs with weights.",
        "Believing artificial neurons work exactly like brain cells.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "An Artificial Neuron receives inputs, assigns importance using weights, combines the information, and produces an output.",
        "Learning happens by adjusting these weights until the neuron makes better decisions.",
      ],
      bullets: [
        "Inspired by biological neurons.",
        "Works with numbers instead of signals.",
        "Uses weighted inputs.",
        "Learns by adjusting weights.",
        "Building block of Neural Networks.",
      ],
    },
  ],
},
perceptron: {
  title: "Perceptron",
  subtitle: "The first and simplest artificial neuron that makes yes-or-no decisions.",
  eyebrow: "Concept 4 of 8",
  accent: "purple",
  icon: Binary,
  sections: [
    {
      heading: "What is a Perceptron?",
      paragraphs: [
        "A Perceptron is the simplest form of an Artificial Neuron. It was introduced by Frank Rosenblatt in 1958 and became one of the earliest building blocks of Machine Learning.",
        "A perceptron receives multiple inputs, combines them using weights, and then makes a simple binary decision.",
        "Its output is usually one of two possible answers, such as Yes or No, True or False, or Accept or Reject.",
      ],
    },
    {
      heading: "How does a Perceptron work?",
      paragraphs: [
        "The perceptron multiplies each input by its corresponding weight and adds the results together.",
        "The combined value is then compared with a threshold. If the value exceeds the threshold, the perceptron outputs one result; otherwise, it outputs the other.",
      ],
      bullets: [
        "Receive input values.",
        "Apply weights to inputs.",
        "Calculate the weighted sum.",
        "Compare the result with a threshold.",
        "Produce a binary output.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a university admission process. A student's marks, attendance, and interview score are considered before making a decision.",
        "If the combined score is above a required cutoff, the student is admitted. Otherwise, the application is rejected.",
        "A perceptron works in exactly the same way by comparing its final score against a threshold.",
      ],
    },
    {
      heading: "What can a Perceptron learn?",
      paragraphs: [
        "A perceptron can learn simple patterns where data can be separated using a straight line.",
        "For example, it can classify emails as spam or not spam when the data follows a simple pattern.",
      ],
      bullets: [
        "Binary classification problems.",
        "Simple pattern recognition.",
        "Linearly separable datasets.",
        "Basic decision-making tasks.",
      ],
    },
    {
      heading: "The limitation of a Perceptron",
      paragraphs: [
        "A single perceptron can only create a straight decision boundary between categories.",
        "Many real-world problems contain complex patterns that cannot be separated by a single straight line.",
        "This limitation led researchers to create multi-layer neural networks and introduce activation functions to handle more complex problems.",
      ],
      bullets: [
        "Can only learn linear patterns.",
        "Cannot solve complex non-linear problems.",
        "Fails on problems like XOR.",
        "Motivated the development of Deep Learning.",
      ],
    },
    {
      heading: "Why is the Perceptron important?",
      paragraphs: [
        "Although simple, the perceptron introduced the fundamental ideas used in modern neural networks.",
        "Concepts such as inputs, weights, thresholds, learning, and classification all originated from perceptrons.",
      ],
      bullets: [
        "First neural network model.",
        "Introduced machine learning concepts.",
        "Foundation of modern neural networks.",
        "Inspired Deep Learning research.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many people assume a perceptron can solve any classification problem, but it is limited to simple linear patterns.",
      ],
      bullets: [
        "Expecting a perceptron to solve complex tasks.",
        "Ignoring the threshold concept.",
        "Confusing perceptrons with deep neural networks.",
        "Assuming more training always solves non-linear problems.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A Perceptron is a single artificial neuron that makes simple yes-or-no decisions using weighted inputs and a threshold.",
        "It is the foundation upon which modern Neural Networks and Deep Learning were built.",
      ],
      bullets: [
        "Single artificial neuron.",
        "Makes binary decisions.",
        "Uses weights and thresholds.",
        "Learns simple patterns.",
        "Foundation of Neural Networks.",
      ],
    },
  ],
},
  "need-for-non-linearity": {
  title: "Need for Non-Linearity",
  subtitle: "The reason neural networks can solve complex real-world problems instead of only simple ones.",
  eyebrow: "Concept 5 of 8",
  accent: "teal",
  icon: Workflow,
  sections: [
    {
      heading: "Why isn't a straight line enough?",
      paragraphs: [
        "Many real-world problems contain complex patterns that cannot be separated using a single straight line. Images, speech, handwriting, and human language all contain highly non-linear relationships.",
        "If every neuron only performed simple linear calculations, even a very deep neural network would behave like one large linear model.",
        "This means the network would fail to learn complicated patterns that exist in real-world data.",
      ],
    },
    {
      heading: "What is Non-Linearity?",
      paragraphs: [
        "Non-linearity allows a neural network to learn curved, complex, and irregular patterns instead of only straight-line relationships.",
        "It enables the network to make flexible decisions and model complicated relationships between inputs and outputs.",
      ],
      bullets: [
        "Learns curved decision boundaries.",
        "Captures complex data patterns.",
        "Improves prediction accuracy.",
        "Makes Deep Learning possible.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine separating apples and oranges placed neatly in two rows. A straight line can easily divide them.",
        "Now imagine the fruits are scattered randomly in circles and curves. A single straight line can no longer separate them correctly.",
        "To classify the fruits accurately, we need curved decision boundaries. This is exactly why neural networks require non-linearity.",
      ],
    },
    {
      heading: "Why is Non-Linearity important?",
      paragraphs: [
        "Without non-linearity, even networks with hundreds of layers would have the same learning ability as a single-layer linear model.",
        "Non-linearity allows neural networks to recognize faces, understand speech, translate languages, detect diseases, and perform many other advanced AI tasks.",
      ],
      bullets: [
        "Learns complex relationships.",
        "Improves model flexibility.",
        "Essential for Deep Learning.",
        "Enables powerful AI applications.",
      ],
    },
    {
      heading: "Where does Non-Linearity come from?",
      paragraphs: [
        "Neural networks introduce non-linearity using Activation Functions. These mathematical functions are applied after every neuron computes its weighted sum.",
        "Activation functions allow the network to learn patterns that would otherwise be impossible using only linear calculations.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think adding more layers automatically makes a network more powerful. However, without activation functions, extra layers provide almost no additional learning capability.",
      ],
      bullets: [
        "Thinking deeper always means smarter.",
        "Believing linear models can solve every problem.",
        "Ignoring the role of activation functions.",
        "Assuming non-linearity means randomness.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Non-linearity allows neural networks to learn complex patterns instead of only straight-line relationships.",
        "Without non-linearity, modern Deep Learning would not exist.",
      ],
      bullets: [
        "Real-world data is non-linear.",
        "Straight lines are often not enough.",
        "Activation functions create non-linearity.",
        "Foundation of Deep Learning.",
        "Enables complex decision making.",
      ],
    },
  ],
},
"activation-functions": {
  title: "Activation Functions",
  subtitle: "The mathematical functions that give neural networks the ability to learn complex patterns.",
  eyebrow: "Concept 6 of 8",
  accent: "coral",
  icon: Sigma,
  sections: [
    {
      heading: "What is an Activation Function?",
      paragraphs: [
        "An Activation Function is a mathematical function applied after a neuron calculates its weighted sum. It decides how much information should be passed to the next layer.",
        "Activation functions introduce non-linearity into neural networks, allowing them to learn much more than simple linear relationships.",
        "Without activation functions, even very deep neural networks would behave like simple linear models.",
      ],
    },
    {
      heading: "How does an Activation Function work?",
      paragraphs: [
        "Every neuron first calculates a weighted sum of its inputs.",
        "The activation function then transforms this value into a new output, which is passed to the next layer of neurons.",
      ],
      bullets: [
        "Calculate weighted sum.",
        "Apply activation function.",
        "Generate transformed output.",
        "Pass output to the next layer.",
      ],
    },
    {
      heading: "Common Activation Functions",
      paragraphs: [
        "Different activation functions are designed for different types of problems. Each has its own strengths and weaknesses.",
      ],
      bullets: [
        "ReLU (Rectified Linear Unit) – Outputs positive values and replaces negative values with zero.",
        "Sigmoid – Converts values into a range between 0 and 1.",
        "Tanh – Produces outputs between -1 and 1.",
        "Leaky ReLU – Similar to ReLU but allows a small negative output.",
        "Softmax – Converts outputs into probabilities for multi-class classification.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a security guard checking visitors at the entrance of a building.",
        "Not everyone is allowed inside. The guard decides who can enter and who cannot based on certain rules.",
        "Similarly, an activation function decides how much information should continue to the next neuron instead of allowing every value to pass unchanged.",
      ],
    },
    {
      heading: "Why are Activation Functions important?",
      paragraphs: [
        "Activation functions are one of the most important components of a neural network because they allow the model to learn highly complex and non-linear relationships.",
        "They enable modern AI systems to recognize faces, understand speech, generate text, detect diseases, and perform many advanced tasks.",
      ],
      bullets: [
        "Introduce non-linearity.",
        "Improve learning capability.",
        "Enable Deep Learning.",
        "Support complex AI applications.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Choosing an activation function depends on the problem being solved. There is no single activation function that works best for every task.",
      ],
      bullets: [
        "Thinking all activation functions behave the same.",
        "Using Sigmoid everywhere.",
        "Ignoring the output layer requirements.",
        "Believing deeper networks remove the need for activation functions.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Activation Functions determine how strongly a neuron responds after processing its inputs.",
        "They introduce non-linearity, making modern neural networks capable of solving complex real-world problems.",
      ],
      bullets: [
        "Applied after weighted sum.",
        "Introduce non-linearity.",
        "Control neuron output.",
        "Essential for Deep Learning.",
        "Power modern AI systems.",
      ],
    },
  ],
},
  layers: {
  title: "Layers",
  subtitle: "Groups of neurons working together, where each layer learns something more complex than the previous one.",
  eyebrow: "Concept 7 of 8",
  accent: "gold",
  icon: Layers,
  sections: [
    {
      heading: "What are Layers in a Neural Network?",
      paragraphs: [
        "A neural network is organized into groups of neurons called layers. Instead of every neuron connecting randomly, neurons are arranged in stages that process information step by step.",
        "Each layer has a specific responsibility. The first layer receives the data, the middle layers learn patterns, and the final layer produces the prediction.",
        "As information moves through these layers, the network gradually builds a better understanding of the input data.",
      ],
    },
    {
      heading: "Types of Layers",
      paragraphs: [
        "Every neural network contains three main types of layers, each serving a different purpose.",
      ],
      bullets: [
        "Input Layer – Receives the raw input data such as images, numbers, or text.",
        "Hidden Layers – Process the information and learn patterns from the data.",
        "Output Layer – Produces the final prediction or decision.",
      ],
    },
    {
      heading: "How do Layers work together?",
      paragraphs: [
        "The input layer passes information to the hidden layers. Each hidden layer extracts increasingly meaningful features from the data.",
        "Finally, the output layer uses everything learned by the hidden layers to generate the network's prediction.",
      ],
      bullets: [
        "Input receives data.",
        "Hidden layers learn patterns.",
        "Output layer makes the prediction.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine identifying a cat in an image.",
        "The first hidden layer may detect simple edges and lines. The next hidden layer combines those edges to recognize shapes like ears and eyes. The final hidden layer combines these features to recognize the complete cat.",
        "This gradual learning process allows neural networks to understand very complex data.",
      ],
    },
    {
      heading: "Why are Hidden Layers important?",
      paragraphs: [
        "Hidden layers are where most of the learning happens. They transform simple information into more meaningful representations that help the network make accurate predictions.",
        "Adding more hidden layers allows a network to solve increasingly difficult problems, although very deep networks also require more data and computational power.",
      ],
      bullets: [
        "Learn increasingly complex patterns.",
        "Improve prediction accuracy.",
        "Enable Deep Learning.",
        "Support advanced AI applications.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think adding more layers automatically improves performance, but deeper networks are not always better.",
      ],
      bullets: [
        "Thinking more layers always mean higher accuracy.",
        "Confusing neurons with layers.",
        "Believing hidden layers store data permanently.",
        "Ignoring the importance of good training data.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Layers organize neurons into stages, allowing the network to learn from simple features to highly complex patterns.",
        "This layered learning process is what makes Deep Learning so powerful.",
      ],
      bullets: [
        "Input Layer receives data.",
        "Hidden Layers learn patterns.",
        "Output Layer makes predictions.",
        "Learning becomes more complex layer by layer.",
        "Foundation of Deep Learning.",
      ],
    },
  ],
},
"forward-propagation": {
  title: "Forward Propagation",
  subtitle: "The step-by-step journey of data through a neural network to produce a prediction.",
  eyebrow: "Concept 8 of 8",
  accent: "purple",
  icon: Workflow,
  sections: [
    {
      heading: "What is Forward Propagation?",
      paragraphs: [
        "Forward Propagation is the process of passing input data through every layer of a neural network until it produces a final output.",
        "During this process, each neuron performs its calculations, applies an activation function, and sends its output to the next layer.",
        "This forward movement of information is how a neural network makes predictions.",
      ],
    },
    {
      heading: "How does Forward Propagation work?",
      paragraphs: [
        "The network processes data one layer at a time, starting from the input layer and ending at the output layer.",
      ],
      bullets: [
        "Input layer receives the data.",
        "Each neuron calculates its weighted sum.",
        "Activation functions transform the outputs.",
        "The outputs become inputs for the next layer.",
        "The output layer generates the final prediction.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine predicting whether an email is spam.",
        "The input layer receives information such as keywords and sender details. Hidden layers analyze patterns within this information, and the output layer finally predicts whether the email is 'Spam' or 'Not Spam'.",
        "Every decision is made by passing information forward through the network until the final answer is produced.",
      ],
    },
    {
      heading: "Why is Forward Propagation important?",
      paragraphs: [
        "Forward propagation is how every neural network makes predictions before learning from its mistakes.",
        "Once a prediction is made, the network compares it with the correct answer. During training, another process called Backpropagation adjusts the weights to improve future predictions.",
      ],
      bullets: [
        "Produces predictions.",
        "Processes data layer by layer.",
        "Required before learning can happen.",
        "Works together with Backpropagation during training.",
      ],
    },
    {
      heading: "Relationship with the previous concepts",
      paragraphs: [
        "Forward propagation combines everything learned so far. Inputs enter the network, artificial neurons calculate weighted sums, activation functions introduce non-linearity, hidden layers learn patterns, and the output layer produces the final prediction.",
        "It brings together all the building blocks of a neural network into one complete process.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Forward propagation only makes predictions. It does not update or improve the network's weights.",
      ],
      bullets: [
        "Confusing Forward Propagation with Backpropagation.",
        "Thinking weights change during forward propagation.",
        "Believing predictions automatically improve without training.",
        "Skipping the role of activation functions.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Forward Propagation is the complete flow of information from the input layer to the output layer.",
        "It is the prediction phase of every neural network and combines all the concepts you've learned in this module.",
      ],
      bullets: [
        "Starts with input data.",
        "Moves through every layer.",
        "Uses neurons, weights, and activation functions.",
        "Ends with a prediction.",
        "First step in neural network learning.",
      ],
    },
  ],
},

  /* ===================== LEVEL 2 · MODULE 5: Deep Learning ===================== */

 cnn: {
  title: "CNN (Convolutional Neural Network)",
  subtitle: "A specialized neural network designed to understand and analyze images.",
  eyebrow: "Concept 1 of 4",
  accent: "teal",
  icon: ImageIcon,
  sections: [
    {
      heading: "What is a CNN?",
      paragraphs: [
        "A Convolutional Neural Network (CNN) is a type of Deep Learning model specially designed to process images and other visual data.",
        "Instead of looking at an entire image at once, a CNN examines small regions of the image one by one, allowing it to identify important visual features such as edges, corners, textures, and shapes.",
        "By combining these small features layer by layer, a CNN can recognize complex objects like faces, animals, vehicles, or handwritten digits.",
      ],
    },
    {
      heading: "How does a CNN work?",
      paragraphs: [
        "A CNN processes an image through multiple stages. Each stage extracts increasingly meaningful information until the network can recognize the object in the image.",
      ],
      bullets: [
        "Receive the input image.",
        "Apply convolution filters to detect features.",
        "Reduce image size using pooling.",
        "Learn higher-level patterns through multiple layers.",
        "Produce the final classification or prediction.",
      ],
    },
    {
      heading: "Key Components of a CNN",
      paragraphs: [
        "CNNs contain several specialized layers that work together to understand images efficiently.",
      ],
      bullets: [
        "Convolution Layer – Detects features like edges, textures, and shapes.",
        "Activation Function – Introduces non-linearity after convolution.",
        "Pooling Layer – Reduces image size while preserving important features.",
        "Fully Connected Layer – Uses extracted features to make the final prediction.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine identifying a dog in a photograph.",
        "The first layers detect simple edges. The next layers combine those edges to identify ears, eyes, and fur. The deeper layers combine these features to recognize the complete dog.",
        "This step-by-step feature extraction makes CNNs extremely effective for image recognition.",
      ],
    },
    {
      heading: "Where are CNNs used?",
      paragraphs: [
        "CNNs are widely used in applications that involve understanding images and videos.",
      ],
      bullets: [
        "Image classification.",
        "Face recognition.",
        "Medical image diagnosis.",
        "Object detection.",
        "Self-driving cars.",
        "Handwritten digit recognition.",
        "Satellite image analysis.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think CNNs memorize entire images. Instead, they learn useful visual patterns that help recognize similar images they've never seen before.",
      ],
      bullets: [
        "Thinking CNNs look at the whole image at once.",
        "Confusing convolution with pooling.",
        "Believing CNNs memorize training images.",
        "Assuming CNNs work only for photographs.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A CNN learns images by detecting small visual features first and gradually combining them into complete objects.",
        "This layered feature learning makes CNNs the foundation of modern computer vision.",
      ],
      bullets: [
        "Designed for images.",
        "Learns features layer by layer.",
        "Uses convolution and pooling.",
        "Excellent at visual recognition.",
        "Foundation of Computer Vision.",
      ],
    },
  ],
},

  lstm: {
  title: "LSTM (Long Short-Term Memory)",
  subtitle: "An improved Recurrent Neural Network that can remember important information for much longer periods.",
  eyebrow: "Concept 3 of 4",
  accent: "gold",
  icon: Brain,
  sections: [
    {
      heading: "What is an LSTM?",
      paragraphs: [
        "Long Short-Term Memory (LSTM) is a special type of Recurrent Neural Network (RNN) designed to overcome the memory limitations of traditional RNNs.",
        "While a standard RNN gradually forgets information from earlier parts of a sequence, an LSTM can remember important information over much longer distances.",
        "This makes LSTMs highly effective for tasks involving long sentences, lengthy documents, speech, and time-series data.",
      ],
    },
    {
      heading: "Why do we need LSTMs?",
      paragraphs: [
        "Standard RNNs struggle to remember information when sequences become very long. As more data is processed, earlier information slowly disappears.",
        "LSTMs solve this problem by introducing a dedicated memory system that decides what information should be remembered, updated, or forgotten.",
      ],
      bullets: [
        "Remembers information for longer periods.",
        "Reduces the forgetting problem in RNNs.",
        "Improves learning on long sequences.",
        "Produces more accurate predictions.",
      ],
    },
    {
      heading: "How does an LSTM work?",
      paragraphs: [
        "An LSTM contains a memory cell and several gates that control the flow of information.",
        "These gates automatically learn which information is useful to keep and which information can be discarded.",
      ],
      bullets: [
        "Forget Gate – Removes unnecessary information.",
        "Input Gate – Decides what new information should be stored.",
        "Memory Cell – Stores important information over time.",
        "Output Gate – Determines what information is passed to the next step.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine reading a novel with hundreds of pages.",
        "Even after many chapters, you still remember the main characters and important events because your brain keeps the most relevant information.",
        "An LSTM works similarly by remembering important details while ignoring less useful information throughout a long sequence.",
      ],
    },
    {
      heading: "Where are LSTMs used?",
      paragraphs: [
        "LSTMs are useful for applications that require understanding long sequences of information.",
      ],
      bullets: [
        "Language translation.",
        "Speech recognition.",
        "Text generation.",
        "Handwriting recognition.",
        "Stock market prediction.",
        "Weather forecasting.",
        "Time-series forecasting.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think LSTMs remember everything forever. In reality, they learn what information is important and intentionally forget unnecessary details.",
      ],
      bullets: [
        "Thinking LSTMs have unlimited memory.",
        "Confusing LSTMs with standard RNNs.",
        "Believing every piece of information is stored.",
        "Ignoring the role of memory gates.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "An LSTM is an enhanced RNN that uses memory cells and gates to remember important information over long sequences.",
        "This ability makes LSTMs much better than traditional RNNs for tasks involving long-term dependencies.",
      ],
      bullets: [
        "Improved version of RNN.",
        "Designed for long sequences.",
        "Uses memory cells and gates.",
        "Learns what to remember and forget.",
        "Excellent for sequence modeling.",
      ],
    },
  ],
  },

  "transformers-introduction": {
  title: "Transformers (Introduction)",
  subtitle: "The modern neural network architecture that powers today's most advanced AI systems.",
  eyebrow: "Concept 4 of 4",
  accent: "purple",
  icon: Sparkles,
  sections: [
    {
      heading: "What is a Transformer?",
      paragraphs: [
        "A Transformer is a Deep Learning architecture designed to process entire sequences of data simultaneously instead of one step at a time.",
        "Unlike RNNs and LSTMs, Transformers do not rely on sequential memory. Instead, they use a mechanism called Attention to understand which parts of the input are most important.",
        "Because of this design, Transformers are faster, more efficient, and significantly more powerful for many AI tasks.",
      ],
    },
    {
      heading: "How does a Transformer work?",
      paragraphs: [
        "A Transformer looks at every part of the input sequence at the same time.",
        "Using the Attention mechanism, it learns how different words or data points are related, even if they are far apart in the sequence.",
      ],
      bullets: [
        "Receive the complete input sequence.",
        "Apply the Attention mechanism.",
        "Learn relationships between different inputs.",
        "Process information in parallel.",
        "Generate the final prediction or output.",
      ],
    },
    {
      heading: "What is Attention?",
      paragraphs: [
        "Attention is the mechanism that allows a Transformer to focus on the most relevant parts of the input while processing each word or data point.",
        "Instead of treating every input equally, the model learns which words or features are more important for understanding the overall meaning.",
      ],
      bullets: [
        "Finds important relationships.",
        "Focuses on relevant information.",
        "Connects distant words directly.",
        "Improves understanding of context.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Consider the sentence: 'The animal didn't cross the road because it was tired.'",
        "To understand the word 'it', the model needs to know that it refers to 'the animal', even though several words appear between them.",
        "A Transformer uses Attention to directly connect these related words, making language understanding much more accurate.",
      ],
    },
    {
      heading: "Why are Transformers important?",
      paragraphs: [
        "Transformers have revolutionized Artificial Intelligence by enabling models to learn from enormous amounts of data efficiently.",
        "They form the foundation of modern Large Language Models and many state-of-the-art AI systems.",
      ],
      bullets: [
        "Much faster than RNNs during training.",
        "Better at learning long-range relationships.",
        "Highly scalable.",
        "Foundation of modern AI models.",
      ],
    },
    {
      heading: "Where are Transformers used?",
      paragraphs: [
        "Transformers are used in almost every modern AI application involving language, images, audio, and even scientific research.",
      ],
      bullets: [
        "ChatGPT and other AI assistants.",
        "Language translation.",
        "Text summarization.",
        "Image generation.",
        "Speech recognition.",
        "Code generation.",
        "Computer Vision.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think Transformers simply replace RNNs. While they outperform RNNs in many tasks, both architectures are based on different approaches and are useful in different situations.",
      ],
      bullets: [
        "Thinking Transformers process one word at a time.",
        "Confusing Attention with memory.",
        "Believing Transformers ignore word order completely.",
        "Assuming every AI model is a Transformer.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Transformers process entire sequences simultaneously using the Attention mechanism to understand relationships between different inputs.",
        "This architecture powers today's most advanced AI systems, including GPT, Gemini, Claude, and many modern Large Language Models.",
      ],
      bullets: [
        "Processes data in parallel.",
        "Uses the Attention mechanism.",
        "Learns long-range relationships.",
        "Faster and more scalable than RNNs.",
        "Foundation of modern Generative AI.",
      ],
    },
  ],
},
"python-basics-revision": {
  title: "Python Basics Revision",
  subtitle: "A quick refresher of the core Python concepts you'll use throughout AI and Machine Learning.",
  eyebrow: "Concept 1 of 2",
  accent: "teal",
  icon: Code2,
  sections: [
    {
      heading: "Why revise Python?",
      paragraphs: [
        "Python is the most widely used programming language in Artificial Intelligence because it is simple, readable, and supported by thousands of powerful libraries.",
        "Before learning Machine Learning and Deep Learning, it's important to be comfortable with Python fundamentals since almost every AI project is built using them.",
        "This revision helps strengthen the concepts you'll use repeatedly while building AI applications.",
      ],
    },
    {
      heading: "Core Python concepts to remember",
      paragraphs: [
        "These are the fundamental programming concepts every AI developer should know before moving forward.",
      ],
      bullets: [
        "Variables and data types.",
        "Operators and expressions.",
        "Input and output.",
        "Conditional statements (if, elif, else).",
        "Loops (for and while).",
        "Functions.",
        "Lists, tuples, dictionaries, and sets.",
        "Basic file handling.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're creating an AI program that predicts house prices.",
        "The program first stores data in variables, uses loops to process thousands of records, applies conditions to clean incorrect data, and organizes everything using lists and dictionaries before training the model.",
        "Almost every AI project follows this workflow, making Python fundamentals essential.",
      ],
    },
    {
      heading: "Why is Python important for AI?",
      paragraphs: [
        "Python allows developers to build AI applications quickly using libraries such as NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow, and PyTorch.",
        "Its simple syntax lets developers focus on solving AI problems rather than writing complicated code.",
      ],
      bullets: [
        "Easy to learn and write.",
        "Large AI and Machine Learning ecosystem.",
        "Supports rapid development.",
        "Used in research and industry.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners rush into Machine Learning without fully understanding Python basics, making it difficult to debug or understand AI code later.",
      ],
      bullets: [
        "Skipping Python fundamentals.",
        "Confusing lists, tuples, and dictionaries.",
        "Writing repetitive code instead of using functions.",
        "Ignoring proper variable naming and indentation.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Python is the foundation of modern AI development. Mastering its basic concepts makes learning Machine Learning, Deep Learning, and Generative AI much easier.",
      ],
      bullets: [
        "Foundation of AI programming.",
        "Simple and beginner-friendly.",
        "Supports powerful AI libraries.",
        "Used in every stage of AI development.",
        "Essential before learning Machine Learning.",
      ],
    },
  ],
},
"advanced-data-structures": {
  title: "Advanced Data Structures",
  subtitle: "Efficient ways to organize, store, and process data for AI applications.",
  eyebrow: "Concept 2 of 2",
  accent: "coral",
  icon: Database,
  sections: [
    {
      heading: "What are Advanced Data Structures?",
      paragraphs: [
        "Advanced Data Structures are specialized ways of organizing data so that it can be stored, accessed, searched, and modified efficiently.",
        "In Artificial Intelligence, choosing the right data structure improves performance, reduces memory usage, and enables faster processing of large datasets.",
        "Many AI algorithms rely heavily on efficient data structures to manage millions of records and complex relationships.",
      ],
    },
    {
      heading: "Common Advanced Data Structures",
      paragraphs: [
        "Different problems require different data structures. Each one is optimized for a particular type of operation.",
      ],
      bullets: [
        "Stack – Follows Last In, First Out (LIFO).",
        "Queue – Follows First In, First Out (FIFO).",
        "Deque – Allows insertion and deletion from both ends.",
        "Heap (Priority Queue) – Always retrieves the highest or lowest priority element.",
        "Hash Table (Dictionary) – Provides extremely fast data lookup.",
        "Tree – Organizes hierarchical information.",
        "Graph – Represents relationships between connected objects.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine building a navigation application like Google Maps.",
        "Cities can be represented as nodes and roads as connections between them. This forms a graph, allowing algorithms to efficiently find the shortest route between two locations.",
        "Similarly, AI systems choose different data structures depending on the type of problem being solved.",
      ],
    },
    {
      heading: "Why are Data Structures important in AI?",
      paragraphs: [
        "AI applications often process millions of data points. Efficient data structures make searching, sorting, storing, and retrieving information much faster.",
        "Choosing the wrong data structure can significantly slow down AI models and increase memory consumption.",
      ],
      bullets: [
        "Improve algorithm efficiency.",
        "Reduce memory usage.",
        "Speed up data processing.",
        "Support large-scale AI applications.",
      ],
    },
    {
      heading: "Where are they used?",
      paragraphs: [
        "Advanced data structures are used throughout Artificial Intelligence and software development.",
      ],
      bullets: [
        "Search algorithms.",
        "Recommendation systems.",
        "Social network analysis.",
        "Knowledge graphs.",
        "Game AI.",
        "Route planning and navigation.",
        "Machine Learning pipelines.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners use the same data structure for every problem instead of selecting the one best suited for the required operations.",
      ],
      bullets: [
        "Using lists for everything.",
        "Ignoring time complexity.",
        "Confusing trees with graphs.",
        "Choosing inefficient data structures for large datasets.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Advanced Data Structures organize information efficiently, allowing AI systems to process large amounts of data quickly and effectively.",
      ],
      bullets: [
        "Store data efficiently.",
        "Improve speed and performance.",
        "Reduce computational cost.",
        "Essential for scalable AI systems.",
        "Foundation of efficient algorithms.",
      ],
    },
  ],
},
"functions-modules": {
  title: "Functions & Modules",
  subtitle: "Write reusable code and organize large Python programs efficiently.",
  eyebrow: "Concept 1 of 2",
  accent: "teal",
  icon: FunctionSquare,
  sections: [
    {
      heading: "What are Functions and Modules?",
      paragraphs: [
        "A function is a reusable block of code that performs a specific task. Instead of writing the same code multiple times, we write it once inside a function and call it whenever needed.",
        "A module is a Python file that contains functions, classes, and variables which can be imported into other programs. Modules help organize code into smaller, manageable pieces.",
        "Functions and modules make Python programs easier to read, maintain, and reuse, especially in AI and software development projects.",
      ],
    },
    {
      heading: "How do Functions work?",
      paragraphs: [
        "Functions receive inputs called parameters, perform some operations, and optionally return a result.",
      ],
      bullets: [
        "Define a function using the def keyword.",
        "Pass input values as parameters.",
        "Execute the function logic.",
        "Return a result using the return statement.",
        "Call the function whenever needed.",
      ],
    },
    {
      heading: "Why do we use Modules?",
      paragraphs: [
        "As programs become larger, keeping all code in a single file becomes difficult. Modules allow developers to divide programs into logical components.",
        "Python also provides thousands of built-in and third-party modules that simplify tasks such as mathematics, data analysis, visualization, and Artificial Intelligence.",
      ],
      bullets: [
        "Organize code into separate files.",
        "Reuse code across projects.",
        "Import built-in libraries like math and random.",
        "Use AI libraries such as NumPy, Pandas, TensorFlow, and PyTorch.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine building an AI chatbot.",
        "One function processes user input, another predicts the response, while another saves conversation history. Instead of placing everything in one file, each feature can be stored in a separate module.",
        "This makes the project easier to develop, test, and maintain.",
      ],
    },
    {
      heading: "Why are Functions and Modules important?",
      paragraphs: [
        "Large AI applications often contain thousands of lines of code. Functions and modules help developers build scalable software by reducing duplication and improving organization.",
      ],
      bullets: [
        "Reduce repeated code.",
        "Improve readability.",
        "Simplify debugging.",
        "Support team collaboration.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners write long programs without using functions or separate modules, making the code difficult to understand and maintain.",
      ],
      bullets: [
        "Writing repeated code instead of functions.",
        "Creating very large functions.",
        "Forgetting to return values.",
        "Not organizing code into modules.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Functions make code reusable, while modules organize related code into separate files. Together, they are essential for building clean and scalable Python applications.",
      ],
      bullets: [
        "Functions perform specific tasks.",
        "Modules organize code.",
        "Reduce code duplication.",
        "Improve maintainability.",
        "Essential for AI projects.",
      ],
    },
  ],
},
"object-oriented-programming": {
  title: "Object-Oriented Programming",
  subtitle: "A programming approach that models real-world objects using classes and objects.",
  eyebrow: "Concept 2 of 2",
  accent: "coral",
  icon: Boxes,
  sections: [
    {
      heading: "What is Object-Oriented Programming?",
      paragraphs: [
        "Object-Oriented Programming (OOP) is a programming paradigm that organizes code using objects. Each object represents a real-world entity with its own data (attributes) and behavior (methods).",
        "Instead of thinking only in terms of functions, OOP encourages developers to model real-world systems such as students, cars, bank accounts, or AI models as objects.",
        "Python fully supports Object-Oriented Programming, making it one of the most widely used paradigms in software and AI development.",
      ],
    },
    {
      heading: "Core concepts of OOP",
      paragraphs: [
        "Every OOP program is built around a few fundamental concepts.",
      ],
      bullets: [
        "Class – A blueprint used to create objects.",
        "Object – An instance created from a class.",
        "Attributes – Variables that store an object's data.",
        "Methods – Functions that define an object's behavior.",
        "Constructor (__init__) – Initializes an object when it is created.",
      ],
    },
    {
      heading: "The four pillars of OOP",
      paragraphs: [
        "These principles make software easier to design, reuse, and maintain.",
      ],
      bullets: [
        "Encapsulation – Bundle data and methods together.",
        "Inheritance – Create new classes from existing ones.",
        "Polymorphism – Use the same interface for different implementations.",
        "Abstraction – Hide unnecessary implementation details.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine creating a Student class.",
        "Every student object has attributes such as name and roll number, and methods such as study() and attendClass(). Although every student is different, they all share the same blueprint.",
        "Similarly, AI projects often represent datasets, models, and neural networks as objects with their own properties and methods.",
      ],
    },
    {
      heading: "Why is OOP important?",
      paragraphs: [
        "Most modern software frameworks and AI libraries are built using Object-Oriented Programming because it makes large applications easier to manage and extend.",
      ],
      bullets: [
        "Improves code organization.",
        "Promotes code reuse.",
        "Simplifies maintenance.",
        "Makes large projects scalable.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners confuse classes with objects or use OOP even when a simple function would be sufficient.",
      ],
      bullets: [
        "Confusing classes and objects.",
        "Ignoring constructors.",
        "Misunderstanding inheritance.",
        "Creating unnecessary classes.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Object-Oriented Programming models real-world entities using classes and objects, making software easier to organize, reuse, and maintain.",
      ],
      bullets: [
        "Classes are blueprints.",
        "Objects are instances.",
        "Attributes store data.",
        "Methods define behavior.",
        "Foundation of modern Python development.",
      ],
    },
  ],
},
"file-handling": {
  title: "File Handling",
  subtitle: "Store, read, and manage data permanently using files in Python.",
  eyebrow: "Concept 1 of 2",
  accent: "teal",
  icon: FileText,
  sections: [
    {
      heading: "What is File Handling?",
      paragraphs: [
        "File Handling is the process of reading from and writing to files stored on a computer. Unlike variables, whose values disappear when a program ends, files allow data to be saved permanently.",
        "Python provides built-in functions that make it easy to create, open, read, write, and update files.",
        "In AI and software development, file handling is commonly used to store datasets, model outputs, logs, reports, and configuration files.",
      ],
    },
    {
      heading: "Common File Operations",
      paragraphs: [
        "Python supports several operations for working with files efficiently.",
      ],
      bullets: [
        "Open a file.",
        "Read data from a file.",
        "Write new data to a file.",
        "Append data without deleting existing content.",
        "Close the file after use.",
      ],
    },
    {
      heading: "File Modes in Python",
      paragraphs: [
        "When opening a file, different modes specify how the file should be accessed.",
      ],
      bullets: [
        "r – Read an existing file.",
        "w – Write to a file (overwrites existing content).",
        "a – Append data to the end of a file.",
        "x – Create a new file.",
        "rb / wb – Read or write binary files.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine building an AI application that predicts house prices.",
        "After making predictions, the program saves the results into a CSV file so they can be reviewed later. Every time new predictions are generated, the application can append them to the same file instead of losing previous results.",
        "This is one of the most common uses of file handling in AI projects.",
      ],
    },
    {
      heading: "Why is File Handling important?",
      paragraphs: [
        "Most real-world applications need to store information permanently. File handling enables programs to save user data, datasets, reports, and logs for future use.",
      ],
      bullets: [
        "Stores data permanently.",
        "Loads datasets for AI models.",
        "Saves reports and logs.",
        "Supports data sharing between programs.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners forget to close files properly or overwrite important data by using the wrong file mode.",
      ],
      bullets: [
        "Using write mode instead of append mode.",
        "Forgetting to close files.",
        "Ignoring file paths.",
        "Not handling file-related errors.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "File handling allows Python programs to store and retrieve data permanently, making it an essential skill for software development and AI projects.",
      ],
      bullets: [
        "Reads and writes files.",
        "Stores data permanently.",
        "Supports multiple file modes.",
        "Essential for AI datasets and reports.",
        "Foundation of data persistence.",
      ],
    },
  ],
},
"exception-handling": {
  title: "Exception Handling",
  subtitle: "Write reliable Python programs that can handle unexpected errors gracefully.",
  eyebrow: "Concept 2 of 2",
  accent: "coral",
  icon: ShieldAlert,
  sections: [
    {
      heading: "What is Exception Handling?",
      paragraphs: [
        "Exception Handling is the process of detecting and managing errors that occur while a program is running. Instead of crashing, the program can respond appropriately and continue executing whenever possible.",
        "Python provides the try, except, else, and finally keywords to handle exceptions safely.",
        "Proper exception handling makes applications more robust, user-friendly, and easier to debug.",
      ],
    },
    {
      heading: "How does Exception Handling work?",
      paragraphs: [
        "Python executes code inside a try block. If an error occurs, control immediately moves to the matching except block, where the error can be handled.",
      ],
      bullets: [
        "try – Contains code that may generate an error.",
        "except – Handles the exception.",
        "else – Executes if no exception occurs.",
        "finally – Always executes, whether an error occurs or not.",
      ],
    },
    {
      heading: "Common Exceptions in Python",
      paragraphs: [
        "Python raises different exceptions depending on the type of error encountered.",
      ],
      bullets: [
        "ZeroDivisionError – Dividing by zero.",
        "FileNotFoundError – File does not exist.",
        "ValueError – Invalid value provided.",
        "TypeError – Invalid data type used.",
        "IndexError – Invalid list index accessed.",
        "KeyError – Missing dictionary key.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a calculator application where the user accidentally enters zero as the denominator.",
        "Without exception handling, the program would stop with an error. With a try-except block, the program can display a friendly message asking the user to enter a different number and continue running.",
      ],
    },
    {
      heading: "Why is Exception Handling important?",
      paragraphs: [
        "Real-world applications constantly encounter unexpected situations such as invalid user input, missing files, or network failures. Exception handling allows programs to recover from these situations instead of crashing.",
      ],
      bullets: [
        "Prevents program crashes.",
        "Improves user experience.",
        "Makes debugging easier.",
        "Builds reliable applications.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners catch every exception using a generic except block, making it difficult to identify the real cause of errors.",
      ],
      bullets: [
        "Using bare except without specifying the exception.",
        "Ignoring exception messages.",
        "Writing code that hides important errors.",
        "Using exceptions instead of proper validation.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Exception handling allows Python programs to detect, manage, and recover from errors without unexpectedly terminating the application.",
      ],
      bullets: [
        "Handles runtime errors.",
        "Uses try and except blocks.",
        "Improves program reliability.",
        "Prevents unexpected crashes.",
        "Essential for professional software development.",
      ],
    },
  ],
},
decorators: {
  title: "Decorators",
  subtitle: "A powerful Python feature that lets you extend the behavior of functions without changing their original code.",
  eyebrow: "Concept 1 of 2",
  accent: "teal",
  icon: Wand2,
  sections: [
    {
      heading: "What are Decorators?",
      paragraphs: [
        "A Decorator is a special Python function that adds new functionality to another function without modifying its original implementation.",
        "Decorators work because functions in Python are first-class objects—they can be passed as arguments, returned from other functions, and assigned to variables.",
        "They are commonly used to add features such as logging, authentication, timing, validation, and caching in a clean and reusable way.",
      ],
    },
    {
      heading: "How do Decorators work?",
      paragraphs: [
        "A decorator wraps an existing function inside another function. Whenever the original function is called, the decorator executes additional code before or after it.",
      ],
      bullets: [
        "Define a decorator function.",
        "Accept another function as an argument.",
        "Wrap the original function.",
        "Execute extra functionality.",
        "Return the enhanced function.",
      ],
    },
    {
      heading: "Why are Decorators useful?",
      paragraphs: [
        "Instead of rewriting the same code inside multiple functions, decorators allow developers to add common functionality once and reuse it everywhere.",
        "They help keep programs modular, readable, and easier to maintain.",
      ],
      bullets: [
        "Reduce code duplication.",
        "Improve code reusability.",
        "Keep business logic clean.",
        "Add functionality without modifying existing code.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a teacher who checks every student's assignment before submission.",
        "Instead of asking every student to perform the same checks individually, the teacher automatically reviews each assignment before accepting it.",
        "Similarly, a decorator automatically performs additional tasks whenever a function is executed.",
      ],
    },
    {
      heading: "Where are Decorators used?",
      paragraphs: [
        "Decorators are widely used in modern Python frameworks and production applications.",
      ],
      bullets: [
        "Logging function calls.",
        "Authentication and authorization.",
        "Performance measurement.",
        "Caching results.",
        "Input validation.",
        "Flask and Django web frameworks.",
        "Machine Learning pipelines.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners find decorators confusing because they involve functions returning other functions. Understanding first-class functions makes decorators much easier to learn.",
      ],
      bullets: [
        "Confusing decorators with normal functions.",
        "Forgetting to return the wrapper function.",
        "Not understanding function arguments.",
        "Using decorators when a simple function is sufficient.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Decorators enhance existing functions by adding new behavior without changing the original code, making applications cleaner and more reusable.",
      ],
      bullets: [
        "Extend function behavior.",
        "Do not modify original code.",
        "Promote reusable programming.",
        "Widely used in Python frameworks.",
        "Powerful feature for clean software design.",
      ],
    },
  ],
},
"generators-iterators": {
  title: "Generators & Iterators",
  subtitle: "Efficiently process large amounts of data one item at a time instead of loading everything into memory.",
  eyebrow: "Concept 2 of 2",
  accent: "coral",
  icon: RefreshCw,
  sections: [
    {
      heading: "What are Iterators and Generators?",
      paragraphs: [
        "An Iterator is an object that allows you to traverse a collection one element at a time. Instead of accessing all data at once, iterators return each item sequentially.",
        "A Generator is a special type of iterator created using the yield keyword. Unlike regular functions that return all values immediately, generators produce values only when they are needed.",
        "This approach makes Python programs much more memory-efficient when working with large datasets.",
      ],
    },
    {
      heading: "How do they work?",
      paragraphs: [
        "Iterators and generators produce one value at a time, allowing programs to process data without storing the entire collection in memory.",
      ],
      bullets: [
        "Iterators return items one by one.",
        "Generators use the yield keyword.",
        "Values are generated only when requested.",
        "Memory is reused efficiently.",
        "Suitable for processing large datasets.",
      ],
    },
    {
      heading: "Why are Generators useful?",
      paragraphs: [
        "Loading millions of records into memory at once can slow down applications or even cause them to crash.",
        "Generators solve this problem by generating each value only when it is required, making programs faster and more memory-efficient.",
      ],
      bullets: [
        "Reduce memory usage.",
        "Process large files efficiently.",
        "Improve application performance.",
        "Support streaming data processing.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine reading a very large book.",
        "Instead of memorizing every page before you begin reading, you read one page at a time. This requires much less memory and effort.",
        "Generators work in the same way by producing one value whenever the program asks for it.",
      ],
    },
    {
      heading: "Where are Generators and Iterators used?",
      paragraphs: [
        "They are commonly used in applications that handle continuous or very large amounts of data.",
      ],
      bullets: [
        "Reading large files.",
        "Streaming data.",
        "Machine Learning datasets.",
        "Data pipelines.",
        "Web scraping.",
        "Log processing.",
        "Real-time analytics.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners expect generators to behave like lists. Once a generator has produced all of its values, it cannot be reused unless a new generator is created.",
      ],
      bullets: [
        "Confusing generators with lists.",
        "Using return instead of yield.",
        "Trying to reuse an exhausted generator.",
        "Ignoring the memory advantages of generators.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Iterators and generators allow Python to process data one item at a time, making programs significantly more efficient when working with large datasets.",
      ],
      bullets: [
        "Generate values lazily.",
        "Save memory.",
        "Process data efficiently.",
        "Ideal for large datasets.",
        "Essential for scalable Python applications.",
      ],
    },
  ],
},
"virtual-environments": {
  title: "Virtual Environments",
  subtitle: "Create isolated Python workspaces so every project has its own dependencies.",
  eyebrow: "Concept 1 of 3",
  accent: "teal",
  icon: Boxes,
  sections: [
    {
      heading: "What are Virtual Environments?",
      paragraphs: [
        "A Virtual Environment is an isolated Python workspace that contains its own interpreter, libraries, and installed packages. It allows different projects to use different versions of the same package without conflicting with each other.",
        "Instead of installing every library globally on your computer, each project maintains its own independent environment.",
        "Virtual environments are considered a best practice for Python development and are widely used in AI, web development, and data science projects.",
      ],
    },
    {
      heading: "Why do we need Virtual Environments?",
      paragraphs: [
        "Different projects often require different versions of the same library. Installing everything globally can create dependency conflicts and break existing applications.",
      ],
      bullets: [
        "Isolate project dependencies.",
        "Avoid package version conflicts.",
        "Keep projects organized.",
        "Make projects easier to share with others.",
      ],
    },
    {
      heading: "How does a Virtual Environment work?",
      paragraphs: [
        "A virtual environment creates a separate folder containing its own Python executable and installed packages. When activated, Python automatically uses that isolated environment instead of the global installation.",
      ],
      bullets: [
        "Create a virtual environment.",
        "Activate the environment.",
        "Install project-specific packages.",
        "Develop the application.",
        "Deactivate the environment when finished.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine working on two AI projects. One requires TensorFlow 2.12, while another needs TensorFlow 2.18.",
        "Without virtual environments, installing one version could overwrite the other and break one of the projects. With separate virtual environments, each project works independently without conflicts.",
      ],
    },
    {
      heading: "Why are Virtual Environments important?",
      paragraphs: [
        "Professional developers use virtual environments to ensure projects remain stable, reproducible, and easy to deploy on different systems.",
      ],
      bullets: [
        "Prevent dependency conflicts.",
        "Improve project portability.",
        "Support team collaboration.",
        "Essential for professional development.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners install packages globally for every project, which often leads to version conflicts and difficult-to-debug errors.",
      ],
      bullets: [
        "Not creating a virtual environment.",
        "Installing packages globally.",
        "Forgetting to activate the environment.",
        "Not saving project dependencies.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A virtual environment isolates project dependencies, allowing every Python project to have its own libraries and package versions.",
      ],
      bullets: [
        "Creates isolated workspaces.",
        "Prevents dependency conflicts.",
        "Keeps projects independent.",
        "Industry best practice.",
        "Essential for AI development.",
      ],
    },
  ],
},
"package-management": {
  title: "Package Management",
  subtitle: "Install, update, and manage Python libraries efficiently for your projects.",
  eyebrow: "Concept 2 of 3",
  accent: "coral",
  icon: Package,
  sections: [
    {
      heading: "What is Package Management?",
      paragraphs: [
        "Package Management is the process of installing, updating, removing, and managing external Python libraries used in applications.",
        "Python has thousands of open-source packages that provide ready-made functionality, allowing developers to build powerful applications without writing everything from scratch.",
        "Tools like pip make it easy to download and manage these packages.",
      ],
    },
    {
      heading: "Why do we need Packages?",
      paragraphs: [
        "Instead of building every feature manually, developers can use existing libraries that have already been tested and optimized.",
      ],
      bullets: [
        "Reuse existing code.",
        "Save development time.",
        "Access AI and data science libraries.",
        "Simplify software development.",
      ],
    },
    {
      heading: "Common Package Management Tasks",
      paragraphs: [
        "Python provides simple commands for managing packages throughout a project's lifecycle.",
      ],
      bullets: [
        "Install packages using pip.",
        "Upgrade existing packages.",
        "Uninstall unused packages.",
        "View installed packages.",
        "Store dependencies in requirements.txt.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you're building an image classification model.",
        "Instead of implementing matrix operations yourself, you install libraries such as NumPy, OpenCV, and TensorFlow using pip. These libraries provide optimized tools that greatly reduce development time.",
      ],
    },
    {
      heading: "Why is Package Management important?",
      paragraphs: [
        "Modern AI applications depend on dozens of external libraries. Managing these dependencies correctly ensures applications remain stable and reproducible across different systems.",
      ],
      bullets: [
        "Simplifies dependency management.",
        "Supports reproducible projects.",
        "Speeds up development.",
        "Essential for AI ecosystems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners install packages without checking compatibility or forget to record dependencies, making projects difficult to reproduce later.",
      ],
      bullets: [
        "Ignoring package versions.",
        "Not using requirements.txt.",
        "Installing unnecessary packages.",
        "Mixing global and virtual environment packages.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Package management allows developers to easily install and maintain the external libraries required for modern Python applications.",
      ],
      bullets: [
        "Manages Python libraries.",
        "Uses pip for installation.",
        "Tracks project dependencies.",
        "Simplifies development.",
        "Essential for AI projects.",
      ],
    },
  ],
},
"git-github-basics": {
  title: "Git & GitHub Basics",
  subtitle: "Track code changes, collaborate with others, and manage software projects professionally.",
  eyebrow: "Concept 3 of 3",
  accent: "gold",
  icon: GitBranch,
  sections: [
    {
      heading: "What are Git and GitHub?",
      paragraphs: [
        "Git is a distributed version control system that tracks changes made to source code over time. It allows developers to save project history, restore previous versions, and collaborate efficiently.",
        "GitHub is a cloud-based platform that hosts Git repositories, making it easy to share projects, collaborate with teams, and contribute to open-source software.",
        "Together, Git and GitHub have become essential tools for modern software and AI development.",
      ],
    },
    {
      heading: "Basic Git Workflow",
      paragraphs: [
        "Developers typically follow the same sequence of steps while working on a project.",
      ],
      bullets: [
        "Initialize or clone a repository.",
        "Modify project files.",
        "Stage changes using git add.",
        "Save changes using git commit.",
        "Push commits to GitHub.",
        "Pull the latest updates from collaborators.",
      ],
    },
    {
      heading: "Why do we use Git?",
      paragraphs: [
        "Git maintains a complete history of every change made to a project. If something goes wrong, developers can easily compare versions or restore previous code.",
      ],
      bullets: [
        "Track code history.",
        "Collaborate with teams.",
        "Manage project versions.",
        "Support open-source development.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine two developers working on the same AI application.",
        "One develops the user interface while the other builds the machine learning model. Git allows both developers to work independently and later combine their changes safely into a single project.",
      ],
    },
    {
      heading: "Why is GitHub important?",
      paragraphs: [
        "GitHub provides online storage for repositories, supports collaboration through pull requests, and integrates with deployment, testing, and CI/CD tools used by professional development teams.",
      ],
      bullets: [
        "Cloud repository hosting.",
        "Team collaboration.",
        "Open-source contributions.",
        "Portfolio for developers.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners forget to commit regularly or push changes without reviewing them, making it difficult to track progress and resolve conflicts.",
      ],
      bullets: [
        "Skipping meaningful commit messages.",
        "Forgetting to pull before pushing.",
        "Committing generated or unnecessary files.",
        "Ignoring .gitignore.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Git tracks your project's history, while GitHub helps you store, share, and collaborate on that project with others.",
      ],
      bullets: [
        "Git tracks code changes.",
        "GitHub hosts repositories.",
        "Supports collaboration.",
        "Maintains version history.",
        "Essential for professional software development.",
      ],
    },
  ],
},
"linear-algebra": {
  title: "Linear Algebra",
  subtitle: "The mathematical language that powers Machine Learning and Deep Learning.",
  eyebrow: "Concept 1 of 3",
  accent: "teal",
  icon: Sigma,
  sections: [
    {
      heading: "What is Linear Algebra?",
      paragraphs: [
        "Linear Algebra is a branch of mathematics that studies vectors, matrices, and linear equations. It provides the mathematical foundation for almost every Machine Learning and Deep Learning algorithm.",
        "In Artificial Intelligence, data, images, text, and even neural network weights are represented using vectors and matrices. Linear Algebra allows computers to perform calculations on this data efficiently.",
        "Without Linear Algebra, modern AI systems such as image recognition, recommendation systems, and language models would not be possible.",
      ],
    },
    {
      heading: "Why is Linear Algebra important in AI?",
      paragraphs: [
        "AI models process enormous amounts of numerical data. Linear Algebra provides efficient mathematical operations that allow these computations to be performed quickly.",
      ],
      bullets: [
        "Represents datasets mathematically.",
        "Powers Neural Networks.",
        "Supports Machine Learning algorithms.",
        "Enables efficient numerical computation.",
      ],
    },
    {
      heading: "Key concepts you'll learn",
      paragraphs: [
        "Linear Algebra consists of several important mathematical concepts that appear repeatedly throughout AI.",
      ],
      bullets: [
        "Scalars.",
        "Vectors.",
        "Matrices.",
        "Matrix operations.",
        "Linear transformations.",
        "Dot products.",
        "Eigenvalues and eigenvectors (advanced).",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a student database where every student's marks in Mathematics, Science, and English are stored.",
        "Instead of storing each value separately, the entire dataset can be represented as a matrix. AI algorithms can then process thousands of students simultaneously using matrix operations.",
        "This ability to handle large datasets efficiently is one reason Linear Algebra is so important in AI.",
      ],
    },
    {
      heading: "Where is Linear Algebra used?",
      paragraphs: [
        "Linear Algebra is used throughout Artificial Intelligence and Data Science.",
      ],
      bullets: [
        "Machine Learning.",
        "Deep Learning.",
        "Computer Vision.",
        "Natural Language Processing.",
        "Recommendation Systems.",
        "Robotics.",
        "Scientific Computing.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think Linear Algebra is only academic mathematics, but almost every AI library performs Linear Algebra operations behind the scenes.",
      ],
      bullets: [
        "Skipping Linear Algebra fundamentals.",
        "Memorizing formulas without understanding.",
        "Confusing vectors with matrices.",
        "Ignoring practical AI applications.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Linear Algebra is the mathematical foundation of Artificial Intelligence. Every AI model uses vectors, matrices, and matrix operations to process and learn from data.",
      ],
      bullets: [
        "Foundation of AI mathematics.",
        "Represents data efficiently.",
        "Supports Neural Networks.",
        "Essential for Machine Learning.",
        "Used in every modern AI system.",
      ],
    },
  ],
},
matrices: {
  title: "Matrices",
  subtitle: "Tables of numbers that allow AI systems to process large amounts of data efficiently.",
  eyebrow: "Concept 2 of 3",
  accent: "coral",
  icon: Table2,
  sections: [
    {
      heading: "What is a Matrix?",
      paragraphs: [
        "A Matrix is a rectangular arrangement of numbers organized into rows and columns. It is one of the most important mathematical structures used in Artificial Intelligence.",
        "Matrices allow computers to store and process large datasets efficiently. Images, datasets, neural network weights, and transformations are all represented as matrices.",
        "Instead of performing calculations one value at a time, AI systems perform operations on entire matrices simultaneously.",
      ],
    },
    {
      heading: "Basic Matrix Operations",
      paragraphs: [
        "Several operations are commonly performed on matrices in AI applications.",
      ],
      bullets: [
        "Matrix addition.",
        "Matrix subtraction.",
        "Scalar multiplication.",
        "Matrix multiplication.",
        "Transpose of a matrix.",
      ],
    },
    {
      heading: "Why are Matrices important in AI?",
      paragraphs: [
        "Neural networks perform millions of matrix multiplications every second during training and prediction.",
        "Modern AI hardware such as GPUs is specifically optimized for fast matrix computations.",
      ],
      bullets: [
        "Represent datasets.",
        "Store neural network weights.",
        "Speed up computations.",
        "Enable efficient AI processing.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine storing the marks of 100 students in five different subjects.",
        "Instead of creating separate variables for every mark, all values can be stored in a single matrix where rows represent students and columns represent subjects.",
        "This allows AI algorithms to process the entire dataset efficiently.",
      ],
    },
    {
      heading: "Where are Matrices used?",
      paragraphs: [
        "Matrices appear throughout AI and computer science.",
      ],
      bullets: [
        "Machine Learning datasets.",
        "Image processing.",
        "Neural Networks.",
        "Computer Graphics.",
        "Recommendation Systems.",
        "Scientific simulations.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners confuse element-wise multiplication with matrix multiplication, even though they produce completely different results.",
      ],
      bullets: [
        "Mixing rows and columns.",
        "Confusing matrix multiplication with element-wise multiplication.",
        "Ignoring matrix dimensions.",
        "Applying invalid operations.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Matrices organize large amounts of numerical data and enable fast mathematical operations, making them one of the most important tools in Artificial Intelligence.",
      ],
      bullets: [
        "Organize data in rows and columns.",
        "Support efficient computation.",
        "Used by Neural Networks.",
        "Essential for AI mathematics.",
        "Foundation of matrix operations.",
      ],
    },
  ],
},
vectors: {
  title: "Vectors",
  subtitle: "Ordered collections of numbers used to represent data, features, and directions in AI.",
  eyebrow: "Concept 3 of 3",
  accent: "gold",
  icon: ArrowRightLeft,
  sections: [
    {
      heading: "What is a Vector?",
      paragraphs: [
        "A Vector is an ordered collection of numbers representing a quantity with one or more dimensions. In Artificial Intelligence, vectors are commonly used to represent data points, features, and mathematical quantities.",
        "Every row in a dataset, every word embedding, and every image feature can be represented as a vector.",
        "Vectors are one of the most fundamental building blocks of Machine Learning and Deep Learning.",
      ],
    },
    {
      heading: "How are Vectors used?",
      paragraphs: [
        "Vectors store multiple values together so mathematical operations can be performed efficiently.",
      ],
      bullets: [
        "Represent feature values.",
        "Store coordinates.",
        "Represent words using embeddings.",
        "Perform mathematical operations.",
      ],
    },
    {
      heading: "Common Vector Operations",
      paragraphs: [
        "AI algorithms frequently perform operations on vectors while processing data.",
      ],
      bullets: [
        "Vector addition.",
        "Vector subtraction.",
        "Scalar multiplication.",
        "Dot product.",
        "Magnitude of a vector.",
        "Normalization.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine predicting whether a student will pass an exam.",
        "Each student can be represented by a vector containing attendance, assignment marks, study hours, and previous exam scores.",
        "Machine Learning algorithms analyze these vectors to identify patterns and make predictions.",
      ],
    },
    {
      heading: "Where are Vectors used?",
      paragraphs: [
        "Vectors are used in almost every area of Artificial Intelligence.",
      ],
      bullets: [
        "Machine Learning.",
        "Deep Learning.",
        "Word embeddings.",
        "Recommendation systems.",
        "Computer Vision.",
        "Search engines.",
        "Generative AI.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think vectors are only arrows from school mathematics, but in AI they are primarily used to represent numerical data and features.",
      ],
      bullets: [
        "Confusing vectors with matrices.",
        "Ignoring vector dimensions.",
        "Misunderstanding the dot product.",
        "Thinking vectors only represent direction.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Vectors represent data efficiently and are the primary mathematical structure used by AI models to understand and process information.",
      ],
      bullets: [
        "Represent numerical data.",
        "Store feature values.",
        "Support mathematical operations.",
        "Foundation of Machine Learning.",
        "Used throughout modern AI.",
      ],
    },
  ],
},
"eigenvalues-eigenvectors": {
  title: "Eigenvalues & Eigenvectors",
  subtitle: "Special vectors that reveal the most important directions in data transformations.",
  eyebrow: "Concept 1 of 3",
  accent: "teal",
  icon: Compass,
  sections: [
    {
      heading: "What are Eigenvalues and Eigenvectors?",
      paragraphs: [
        "Eigenvectors are special vectors whose direction remains unchanged when a matrix transformation is applied. Although their length may change, they continue pointing in the same direction.",
        "The amount by which an eigenvector is stretched or compressed is called its Eigenvalue.",
        "These concepts help AI systems identify the most important patterns and directions hidden inside data.",
      ],
    },
    {
      heading: "Why are they important in AI?",
      paragraphs: [
        "Many Machine Learning algorithms analyze large datasets with hundreds or thousands of features. Eigenvalues and eigenvectors help reduce this complexity while preserving the most useful information.",
      ],
      bullets: [
        "Power Principal Component Analysis (PCA).",
        "Reduce data dimensions.",
        "Identify important patterns.",
        "Improve computational efficiency.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine stretching a rubber sheet in different directions.",
        "Most arrows drawn on the sheet change both their length and direction. However, a few arrows continue pointing in exactly the same direction while only becoming longer or shorter.",
        "Those special arrows are eigenvectors, and the stretching factor is the eigenvalue.",
      ],
    },
    {
      heading: "Where are Eigenvalues and Eigenvectors used?",
      paragraphs: [
        "These concepts appear in many AI and scientific computing applications.",
      ],
      bullets: [
        "Principal Component Analysis (PCA).",
        "Image compression.",
        "Face recognition.",
        "Recommendation systems.",
        "Computer Vision.",
        "Scientific simulations.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners focus only on memorizing formulas instead of understanding that eigenvectors represent important directions and eigenvalues measure their importance.",
      ],
      bullets: [
        "Memorizing without visualization.",
        "Confusing vectors with eigenvectors.",
        "Ignoring practical AI applications.",
        "Thinking every vector is an eigenvector.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Eigenvectors identify important directions in transformed data, while eigenvalues indicate how significant those directions are.",
      ],
      bullets: [
        "Special vectors.",
        "Special scaling values.",
        "Essential for PCA.",
        "Reduce data complexity.",
        "Important in Machine Learning.",
      ],
    },
  ],
},
"calculus-basics": {
  title: "Calculus Basics",
  subtitle: "The mathematics of change that enables AI models to learn and improve.",
  eyebrow: "Concept 2 of 3",
  accent: "coral",
  icon: FunctionSquare,
  sections: [
    {
      heading: "What is Calculus?",
      paragraphs: [
        "Calculus is a branch of mathematics that studies change and motion. In Artificial Intelligence, it helps measure how model outputs change when inputs or parameters change.",
        "Machine Learning algorithms continuously adjust millions of parameters during training, and calculus provides the mathematical tools needed to make these adjustments efficiently.",
        "Without calculus, modern Deep Learning models would not be able to learn from data.",
      ],
    },
    {
      heading: "Why is Calculus important in AI?",
      paragraphs: [
        "AI models learn by minimizing errors. Calculus helps determine how parameters should be adjusted to reduce those errors step by step.",
      ],
      bullets: [
        "Measures rates of change.",
        "Supports model optimization.",
        "Powers Gradient Descent.",
        "Enables Deep Learning.",
      ],
    },
    {
      heading: "Key concepts of Calculus",
      paragraphs: [
        "Although calculus is a large subject, only a few concepts are essential for understanding AI.",
      ],
      bullets: [
        "Functions.",
        "Limits.",
        "Derivatives.",
        "Gradients.",
        "Optimization.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine cycling uphill.",
        "At every point, the steepness of the road tells you how difficult it is to continue. Similarly, calculus measures the steepness of mathematical functions so AI models know which direction reduces errors the fastest.",
      ],
    },
    {
      heading: "Where is Calculus used?",
      paragraphs: [
        "Calculus appears throughout Artificial Intelligence and scientific computing.",
      ],
      bullets: [
        "Neural Networks.",
        "Gradient Descent.",
        "Backpropagation.",
        "Optimization algorithms.",
        "Physics simulations.",
        "Robotics.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think they need advanced calculus before learning AI. In reality, understanding the basic intuition behind derivatives and optimization is sufficient for getting started.",
      ],
      bullets: [
        "Fearing calculus unnecessarily.",
        "Memorizing formulas without intuition.",
        "Ignoring graphical interpretations.",
        "Thinking AI requires advanced mathematics from day one.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Calculus helps AI models understand how changes in parameters affect predictions, allowing them to improve through learning.",
      ],
      bullets: [
        "Studies change.",
        "Measures function behavior.",
        "Supports optimization.",
        "Essential for Deep Learning.",
        "Foundation of model training.",
      ],
    },
  ],
},
"derivatives": {
  title: "Derivatives",
  subtitle: "The mathematical tool that tells AI models which direction to move for better predictions.",
  eyebrow: "Concept 3 of 3",
  accent: "gold",
  icon: TrendingUp,
  sections: [
    {
      heading: "What is a Derivative?",
      paragraphs: [
        "A Derivative measures how quickly a function changes with respect to its input. It tells us the slope or steepness of a curve at any specific point.",
        "In Artificial Intelligence, derivatives help determine how much each model parameter contributes to prediction errors.",
        "By using derivatives, Machine Learning algorithms know how to adjust their parameters to improve accuracy.",
      ],
    },
    {
      heading: "Why are Derivatives important in AI?",
      paragraphs: [
        "During training, AI models repeatedly calculate derivatives to determine the best direction for reducing prediction errors.",
      ],
      bullets: [
        "Measure slope.",
        "Guide parameter updates.",
        "Power Gradient Descent.",
        "Enable Backpropagation.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine standing on a hill while trying to reach the lowest point.",
        "The slope beneath your feet tells you which direction goes downhill. If the slope is steep, you move carefully; if it is flat, you're close to the bottom.",
        "Similarly, derivatives tell AI models which direction reduces prediction error most effectively.",
      ],
    },
    {
      heading: "Where are Derivatives used?",
      paragraphs: [
        "Derivatives are used whenever AI models need to learn from data.",
      ],
      bullets: [
        "Gradient Descent.",
        "Backpropagation.",
        "Neural Networks.",
        "Machine Learning optimization.",
        "Deep Learning.",
        "Scientific computing.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think derivatives are only theoretical mathematics, but they are actually calculated millions of times during the training of modern AI models.",
      ],
      bullets: [
        "Ignoring graphical intuition.",
        "Memorizing differentiation rules only.",
        "Confusing derivatives with gradients.",
        "Thinking derivatives are optional in Deep Learning.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A derivative measures the slope of a function and guides AI models toward better parameter values by indicating the direction that reduces prediction error.",
      ],
      bullets: [
        "Measures slope.",
        "Guides optimization.",
        "Used in Gradient Descent.",
        "Essential for Backpropagation.",
        "Foundation of AI learning.",
      ],
    },
  ],
},
"partial-derivatives": {
  title: "Partial Derivatives",
  subtitle: "Measure how one variable affects an output while keeping all other variables constant.",
  eyebrow: "Concept 1 of 4",
  accent: "teal",
  icon: GitBranch,
  sections: [
    {
      heading: "What are Partial Derivatives?",
      paragraphs: [
        "A Partial Derivative measures how a function changes with respect to one variable while keeping all the other variables constant.",
        "Unlike ordinary derivatives, which work with functions having only one variable, partial derivatives are used when functions depend on multiple variables.",
        "Since AI models contain thousands or even millions of parameters, partial derivatives are essential for understanding how each parameter affects the model's output.",
      ],
    },
    {
      heading: "Why are Partial Derivatives important in AI?",
      paragraphs: [
        "Neural networks learn by adjusting many weights simultaneously. Partial derivatives tell us how changing one weight affects the prediction while keeping all other weights unchanged.",
      ],
      bullets: [
        "Update neural network weights.",
        "Power Backpropagation.",
        "Support Gradient Descent.",
        "Optimize complex AI models.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine baking a cake where the taste depends on sugar, butter, and flour.",
        "If you only increase the amount of sugar while keeping the butter and flour unchanged, you're measuring how sugar alone affects the taste.",
        "A partial derivative works the same way by measuring the effect of one variable while holding the others constant.",
      ],
    },
    {
      heading: "Where are Partial Derivatives used?",
      paragraphs: [
        "Partial derivatives are fundamental to modern Machine Learning and optimization algorithms.",
      ],
      bullets: [
        "Backpropagation.",
        "Gradient Descent.",
        "Deep Learning.",
        "Optimization.",
        "Computer Vision.",
        "Natural Language Processing.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners confuse ordinary derivatives with partial derivatives, forgetting that AI models usually involve many variables rather than just one.",
      ],
      bullets: [
        "Confusing derivatives with partial derivatives.",
        "Ignoring multiple variables.",
        "Memorizing formulas without visualization.",
        "Not relating them to neural network weights.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Partial derivatives measure the effect of changing one variable at a time, making them essential for training neural networks with millions of parameters.",
      ],
      bullets: [
        "Works with multiple variables.",
        "Measures one variable at a time.",
        "Foundation of Backpropagation.",
        "Supports AI optimization.",
        "Essential for Deep Learning.",
      ],
    },
  ],
},
probability: {
  title: "Probability",
  subtitle: "Measure the likelihood of events and make predictions under uncertainty.",
  eyebrow: "Concept 2 of 4",
  accent: "coral",
  icon: Dice5,
  sections: [
    {
      heading: "What is Probability?",
      paragraphs: [
        "Probability is the branch of mathematics that measures how likely an event is to occur. It helps quantify uncertainty using values between 0 and 1, where 0 means impossible and 1 means certain.",
        "Artificial Intelligence uses probability to make predictions when outcomes are uncertain rather than guaranteed.",
        "From spam detection to weather forecasting, probability helps AI estimate the most likely outcome.",
      ],
    },
    {
      heading: "Why is Probability important in AI?",
      paragraphs: [
        "AI systems rarely know answers with complete certainty. Instead, they estimate the probability of different outcomes and choose the most likely one.",
      ],
      bullets: [
        "Handle uncertainty.",
        "Support predictions.",
        "Estimate confidence scores.",
        "Power probabilistic models.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine predicting whether it will rain tomorrow.",
        "Instead of saying it will definitely rain, a weather model may predict an 80% chance of rain.",
        "Similarly, an AI model might predict that an email has a 95% probability of being spam.",
      ],
    },
    {
      heading: "Where is Probability used?",
      paragraphs: [
        "Probability plays a major role across Artificial Intelligence.",
      ],
      bullets: [
        "Spam detection.",
        "Recommendation systems.",
        "Medical diagnosis.",
        "Speech recognition.",
        "Weather prediction.",
        "Machine Learning classification.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners confuse probability with certainty. A high probability means an event is likely, not guaranteed.",
      ],
      bullets: [
        "Confusing probability with certainty.",
        "Ignoring uncertainty.",
        "Misinterpreting confidence scores.",
        "Assuming probabilities always equal reality.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Probability allows AI systems to make intelligent decisions even when complete certainty is impossible.",
      ],
      bullets: [
        "Measures likelihood.",
        "Represents uncertainty.",
        "Supports AI predictions.",
        "Used in Machine Learning.",
        "Foundation of probabilistic reasoning.",
      ],
    },
  ],
},
statistics: {
  title: "Statistics",
  subtitle: "Understand, summarize, and analyze data before training AI models.",
  eyebrow: "Concept 3 of 4",
  accent: "gold",
  icon: BarChart3,
  sections: [
    {
      heading: "What is Statistics?",
      paragraphs: [
        "Statistics is the science of collecting, organizing, analyzing, and interpreting data. It helps us understand patterns, trends, and relationships hidden within datasets.",
        "Before training any Machine Learning model, data scientists use statistics to explore, clean, and summarize their data.",
        "Good statistical analysis often leads to better AI models and more accurate predictions.",
      ],
    },
    {
      heading: "Important Statistical Concepts",
      paragraphs: [
        "Several statistical measures are used regularly in AI and data analysis.",
      ],
      bullets: [
        "Mean.",
        "Median.",
        "Mode.",
        "Variance.",
        "Standard Deviation.",
        "Distribution.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a teacher analyzing the marks of an entire class.",
        "Instead of looking at every student's marks individually, the teacher calculates the average score, identifies the highest and lowest marks, and measures how much the marks vary.",
        "Statistics provides these summary measures, helping us understand the entire dataset quickly.",
      ],
    },
    {
      heading: "Why is Statistics important in AI?",
      paragraphs: [
        "Statistics helps identify data quality issues, detect outliers, understand feature distributions, and evaluate model performance.",
      ],
      bullets: [
        "Analyze datasets.",
        "Detect outliers.",
        "Understand feature distributions.",
        "Evaluate AI models.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners jump directly into model training without first understanding the data statistically.",
      ],
      bullets: [
        "Ignoring data exploration.",
        "Confusing mean and median.",
        "Ignoring outliers.",
        "Misinterpreting variance.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Statistics helps transform raw data into meaningful information, making it one of the most important foundations of Machine Learning.",
      ],
      bullets: [
        "Summarizes data.",
        "Identifies patterns.",
        "Supports data analysis.",
        "Improves AI models.",
        "Essential before Machine Learning.",
      ],
    },
  ],
},
"bayes-theorem": {
  title: "Bayes' Theorem",
  subtitle: "Update probabilities using new evidence to make smarter AI decisions.",
  eyebrow: "Concept 4 of 4",
  accent: "purple",
  icon: BrainCircuit,
  sections: [
    {
      heading: "What is Bayes' Theorem?",
      paragraphs: [
        "Bayes' Theorem is a mathematical rule that calculates the probability of an event after considering new evidence.",
        "Instead of relying only on initial assumptions, Bayes' Theorem continuously updates beliefs as additional information becomes available.",
        "This ability to learn from new evidence makes Bayes' Theorem extremely useful in Artificial Intelligence and Machine Learning.",
      ],
    },
    {
      heading: "Why is Bayes' Theorem important in AI?",
      paragraphs: [
        "Many AI systems continuously receive new information. Bayes' Theorem helps update predictions based on this incoming evidence.",
      ],
      bullets: [
        "Updates probabilities.",
        "Supports decision-making.",
        "Handles uncertain information.",
        "Powers probabilistic classifiers.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a doctor diagnosing a disease.",
        "Before performing a medical test, the doctor estimates the likelihood that a patient has the disease. After seeing the test result, the doctor updates that probability.",
        "Bayes' Theorem mathematically explains how this updated belief should be calculated.",
      ],
    },
    {
      heading: "Where is Bayes' Theorem used?",
      paragraphs: [
        "Bayesian reasoning is widely used in Artificial Intelligence and data science.",
      ],
      bullets: [
        "Spam email detection.",
        "Medical diagnosis.",
        "Recommendation systems.",
        "Fraud detection.",
        "Machine Learning classification.",
        "Predictive analytics.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners confuse prior probability with posterior probability, forgetting that Bayes' Theorem updates beliefs using new evidence.",
      ],
      bullets: [
        "Ignoring prior probability.",
        "Confusing prior and posterior probabilities.",
        "Treating probabilities as fixed values.",
        "Memorizing the formula without understanding its intuition.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Bayes' Theorem improves predictions by updating probabilities whenever new evidence becomes available, making AI systems more accurate and adaptive.",
      ],
      bullets: [
        "Updates beliefs.",
        "Uses new evidence.",
        "Supports probabilistic AI.",
        "Foundation of Bayesian learning.",
        "Widely used in Machine Learning.",
        ],
    },
  ],
},
  "data-collection": {
  title: "Data Collection",
  subtitle: "Gathering the right data is the first step toward building intelligent AI systems.",
  eyebrow: "Concept 1 of 3",
  accent: "blue",
  icon: Database,
  sections: [
    {
      heading: "What is Data Collection?",
      paragraphs: [
        "Data Collection is the process of gathering raw information from various sources that can be used to train Artificial Intelligence and Machine Learning models.",
        "The quality and quantity of collected data directly affect how well an AI model learns and performs.",
        "Without sufficient and relevant data, even the most advanced algorithms cannot produce accurate predictions.",
      ],
    },
    {
      heading: "Why is Data Collection important in AI?",
      paragraphs: [
        "AI models learn patterns from examples, making high-quality data the foundation of every successful AI application.",
      ],
      bullets: [
        "Provides training examples.",
        "Improves model accuracy.",
        "Reduces bias when data is diverse.",
        "Helps models generalize to new situations.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're building an AI model that recognizes cats and dogs.",
        "You first collect thousands of images of both animals from cameras, websites, or public datasets. These images become the training data that teaches the model how to distinguish between them.",
      ],
    },
    {
      heading: "Where is Data Collection used?",
      paragraphs: [
        "Every AI project begins with collecting relevant data from different sources.",
      ],
      bullets: [
        "Self-driving cars collecting road images.",
        "Healthcare collecting patient records.",
        "E-commerce collecting customer behavior.",
        "Social media collecting user interactions.",
        "Finance collecting transaction history.",
        "Smart devices collecting sensor data.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners believe that collecting more data always leads to better AI models, but poor-quality or biased data can actually reduce performance.",
      ],
      bullets: [
        "Collecting irrelevant data.",
        "Ignoring data quality.",
        "Using biased datasets.",
        "Collecting too little data.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Good AI starts with good data. Collecting relevant, diverse, and high-quality data is the foundation of every successful Machine Learning project.",
      ],
      bullets: [
        "Quality over quantity.",
        "Relevant data matters.",
        "Diverse data improves fairness.",
        "Foundation of AI training.",
        "First step in every ML pipeline.",
      ],
    },
  ],
},
 "data-cleaning": {
  title: "Data Cleaning",
  subtitle: "Transform messy data into reliable information before training AI models.",
  eyebrow: "Concept 2 of 3",
  accent: "green",
  icon: BrushCleaning,
  sections: [
    {
      heading: "What is Data Cleaning?",
      paragraphs: [
        "Data Cleaning is the process of identifying and fixing errors, inconsistencies, duplicate records, and missing values in a dataset.",
        "Real-world data is often incomplete or noisy, making cleaning an essential step before model training.",
        "A clean dataset allows Machine Learning algorithms to learn meaningful patterns instead of incorrect information.",
      ],
    },
    {
      heading: "Why is Data Cleaning important in AI?",
      paragraphs: [
        "AI models are only as good as the data they learn from. Cleaning improves both accuracy and reliability.",
      ],
      bullets: [
        "Removes incorrect data.",
        "Handles missing values.",
        "Improves prediction accuracy.",
        "Reduces noise in datasets.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose a dataset contains customer ages like 25, 30, 29, and one value of 250.",
        "Since 250 is clearly an incorrect age, Data Cleaning identifies and corrects or removes such outliers before training the AI model.",
      ],
    },
    {
      heading: "Where is Data Cleaning used?",
      paragraphs: [
        "Every Machine Learning project includes a data cleaning stage before model training.",
      ],
      bullets: [
        "Healthcare records.",
        "Financial transactions.",
        "Customer databases.",
        "Sensor data.",
        "Retail sales data.",
        "Survey responses.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners skip data cleaning and directly train models, leading to poor performance and inaccurate predictions.",
      ],
      bullets: [
        "Ignoring missing values.",
        "Keeping duplicate records.",
        "Leaving incorrect entries unchanged.",
        "Removing too much useful data.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Clean data helps AI models learn correctly. Spending time cleaning data often improves performance more than changing algorithms.",
      ],
      bullets: [
        "Clean before training.",
        "Fix errors.",
        "Handle missing values.",
        "Remove duplicates.",
        "Improve model reliability.",
      ],
    },
  ],
},
"feature-engineering": {
  title: "Feature Engineering",
  subtitle: "Create meaningful inputs that help AI models learn patterns more effectively.",
  eyebrow: "Concept 3 of 3",
  accent: "orange",
  icon: Sparkles,
  sections: [
    {
      heading: "What is Feature Engineering?",
      paragraphs: [
        "Feature Engineering is the process of selecting, transforming, or creating new features from raw data to improve Machine Learning model performance.",
        "Instead of feeding raw data directly into a model, we prepare features that better represent the underlying patterns.",
        "Well-designed features often have a greater impact on accuracy than choosing a more complex algorithm.",
      ],
    },
    {
      heading: "Why is Feature Engineering important in AI?",
      paragraphs: [
        "Meaningful features make it easier for Machine Learning models to recognize patterns and make accurate predictions.",
      ],
      bullets: [
        "Improves model accuracy.",
        "Highlights important information.",
        "Reduces irrelevant data.",
        "Helps models learn faster.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you have a customer's Date of Birth.",
        "Instead of using the full date, you calculate the customer's age. Age is often much more useful for prediction than the raw date itself, making it a better feature.",
      ],
    },
    {
      heading: "Where is Feature Engineering used?",
      paragraphs: [
        "Feature Engineering is used across almost every Machine Learning application.",
      ],
      bullets: [
        "House price prediction.",
        "Credit risk analysis.",
        "Recommendation systems.",
        "Fraud detection.",
        "Medical diagnosis.",
        "Customer churn prediction.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners use every available feature without considering whether it actually helps the model learn.",
      ],
      bullets: [
        "Using irrelevant features.",
        "Creating data leakage.",
        "Ignoring feature scaling.",
        "Overengineering unnecessary features.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Feature Engineering transforms raw data into meaningful information that allows AI models to make smarter and more accurate predictions.",
      ],
      bullets: [
        "Better features, better models.",
        "Transform raw data.",
        "Remove unnecessary information.",
        "Improve prediction accuracy.",
        "One of the most valuable ML skills.",
      ],
    },
  ],
},
"numpy": {
  title: "NumPy",
  subtitle: "The fundamental library for fast numerical computing in Python.",
  eyebrow: "Concept 1 of 3",
  accent: "blue",
  icon: Calculator,
  sections: [
    {
      heading: "What is NumPy?",
      paragraphs: [
        "NumPy (Numerical Python) is an open-source Python library used for numerical computing and mathematical operations.",
        "It introduces the powerful ndarray (N-dimensional array), which stores data more efficiently than Python lists.",
        "NumPy forms the foundation of many AI, Machine Learning, and Data Science libraries such as Pandas, Scikit-learn, TensorFlow, and PyTorch.",
      ],
    },
    {
      heading: "Why is NumPy important in AI?",
      paragraphs: [
        "Machine Learning algorithms perform millions of mathematical calculations. NumPy makes these computations fast and efficient.",
      ],
      bullets: [
        "Fast array operations.",
        "Efficient memory usage.",
        "Supports linear algebra.",
        "Performs statistical computations.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you have marks of 10,000 students.",
        "Instead of calculating the average using loops, NumPy can compute it in a single optimized function call, making the operation much faster.",
      ],
    },
    {
      heading: "Where is NumPy used?",
      paragraphs: [
        "NumPy is the backbone of scientific computing and AI development.",
      ],
      bullets: [
        "Machine Learning.",
        "Deep Learning.",
        "Data Analysis.",
        "Image Processing.",
        "Scientific Computing.",
        "Statistical Analysis.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners continue using Python lists for numerical computations without realizing NumPy is significantly faster and more efficient.",
      ],
      bullets: [
        "Using Python lists instead of arrays.",
        "Ignoring array shapes.",
        "Mixing incompatible dimensions.",
        "Overusing loops instead of vectorized operations.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "NumPy provides high-performance arrays and mathematical operations that make AI and Data Science applications efficient and scalable.",
      ],
      bullets: [
        "Fast computations.",
        "Powerful arrays.",
        "Foundation of AI libraries.",
        "Optimized mathematical operations.",
        "Essential for Machine Learning.",
      ],
    },
  ],
},
"pandas": {
  title: "Pandas",
  subtitle: "Organize, analyze, and manipulate data with ease before building AI models.",
  eyebrow: "Concept 2 of 3",
  accent: "green",
  icon: Table,
  sections: [
    {
      heading: "What is Pandas?",
      paragraphs: [
        "Pandas is a Python library used for loading, organizing, cleaning, and analyzing structured data.",
        "It introduces powerful data structures like DataFrame and Series, making it easy to work with rows and columns.",
        "Pandas is one of the most widely used libraries in Data Science and Machine Learning.",
      ],
    },
    {
      heading: "Why is Pandas important in AI?",
      paragraphs: [
        "Before training an AI model, data usually needs to be cleaned, filtered, and transformed. Pandas simplifies these tasks.",
      ],
      bullets: [
        "Loads datasets easily.",
        "Cleans messy data.",
        "Handles missing values.",
        "Performs data analysis.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you have a CSV file containing student marks.",
        "Using Pandas, you can load the file, remove missing values, calculate average scores, and prepare the data for Machine Learning in just a few lines of code.",
      ],
    },
    {
      heading: "Where is Pandas used?",
      paragraphs: [
        "Pandas is used in almost every Data Science workflow.",
      ],
      bullets: [
        "Data Cleaning.",
        "Exploratory Data Analysis (EDA).",
        "Business Analytics.",
        "Financial Analysis.",
        "Healthcare Data.",
        "Machine Learning preprocessing.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners edit datasets manually instead of using Pandas functions that automate the process.",
      ],
      bullets: [
        "Ignoring missing values.",
        "Using incorrect column names.",
        "Not understanding DataFrames.",
        "Modifying data unintentionally.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Pandas makes working with structured data simple, allowing AI developers to focus on building better models instead of manually organizing datasets.",
      ],
      bullets: [
        "Easy data manipulation.",
        "Powerful DataFrames.",
        "Essential for preprocessing.",
        "Simplifies analysis.",
        "Core library in Data Science.",
      ],
    },
  ],
},
"data-visualization": {
  title: "Data Visualization",
  subtitle: "Turn numbers into meaningful charts that reveal patterns and insights.",
  eyebrow: "Concept 3 of 3",
  accent: "purple",
  icon: BarChart3,
  sections: [
    {
      heading: "What is Data Visualization?",
      paragraphs: [
        "Data Visualization is the process of representing data using charts, graphs, and plots to make information easier to understand.",
        "Instead of analyzing thousands of numbers, visualizations help us quickly identify trends, patterns, and relationships.",
        "It is an essential step in Data Science, Machine Learning, and business decision-making.",
      ],
    },
    {
      heading: "Why is Data Visualization important in AI?",
      paragraphs: [
        "Visualizing data helps us understand the dataset before training a Machine Learning model and evaluate results afterward.",
      ],
      bullets: [
        "Finds hidden patterns.",
        "Detects outliers.",
        "Explains model results.",
        "Supports better decision-making.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you have monthly sales data for an entire year.",
        "A line chart immediately shows whether sales are increasing or decreasing, making trends much easier to understand than looking at raw numbers.",
      ],
    },
    {
      heading: "Where is Data Visualization used?",
      paragraphs: [
        "Visualization is widely used across industries to communicate insights effectively.",
      ],
      bullets: [
        "Business dashboards.",
        "Machine Learning analysis.",
        "Healthcare reports.",
        "Financial analytics.",
        "Scientific research.",
        "Marketing analytics.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners choose the wrong chart type, making their data difficult to interpret.",
      ],
      bullets: [
        "Using incorrect chart types.",
        "Adding too many colors.",
        "Ignoring labels and legends.",
        "Displaying cluttered visualizations.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A good visualization transforms complex datasets into clear and meaningful insights, helping both humans and AI practitioners make informed decisions.",
      ],
      bullets: [
        "Visualize before modeling.",
        "Choose the right chart.",
        "Keep charts simple.",
        "Reveal patterns quickly.",
        "Improve communication of insights.",
      ],
    },
  ],
},
"exploratory-data-analysis": {
  title: "Exploratory Data Analysis",
  subtitle: "Understand your data before building Machine Learning models.",
  eyebrow: "Concept 1 of 3",
  accent: "blue",
  icon: Search,
  sections: [
    {
      heading: "What is Exploratory Data Analysis (EDA)?",
      paragraphs: [
        "Exploratory Data Analysis (EDA) is the process of examining, summarizing, and visualizing data to understand its characteristics before applying Machine Learning algorithms.",
        "EDA helps identify patterns, relationships, missing values, and unusual observations that may affect model performance.",
        "It is one of the most important steps in the Data Science workflow because understanding the data leads to better decisions and better models.",
      ],
    },
    {
      heading: "Why is EDA important in AI?",
      paragraphs: [
        "Machine Learning models learn from data. EDA ensures the data is suitable for training and helps uncover valuable insights.",
      ],
      bullets: [
        "Understands data distribution.",
        "Finds hidden patterns.",
        "Identifies data quality issues.",
        "Improves model performance.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you're predicting house prices.",
        "Before training the model, you create charts to understand the relationship between house size, location, and price. This helps identify which features are most important.",
      ],
    },
    {
      heading: "Where is EDA used?",
      paragraphs: [
        "EDA is performed before every Machine Learning project.",
      ],
      bullets: [
        "Business analytics.",
        "Healthcare research.",
        "Finance.",
        "Customer analytics.",
        "Sales forecasting.",
        "Scientific research.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners skip EDA and directly train models, often leading to poor predictions because they don't fully understand the data.",
      ],
      bullets: [
        "Skipping visualization.",
        "Ignoring correlations.",
        "Not checking distributions.",
        "Overlooking data quality issues.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "EDA is like investigating a dataset before solving a problem. The better you understand your data, the better your AI model will perform.",
      ],
      bullets: [
        "Explore before modeling.",
        "Visualize the data.",
        "Find patterns.",
        "Detect issues early.",
        "Foundation of successful AI projects.",
      ],
    },
  ],
},

"missing-values": {
  title: "Missing Values",
  subtitle: "Handle incomplete data to build more reliable AI models.",
  eyebrow: "Concept 2 of 3",
  accent: "green",
  icon: FileWarning,
  sections: [
    {
      heading: "What are Missing Values?",
      paragraphs: [
        "Missing values are data points that are absent or unavailable in a dataset.",
        "They may occur because of human errors, system failures, incomplete surveys, or unavailable information.",
        "Handling missing values properly is essential because many Machine Learning algorithms cannot work with incomplete data.",
      ],
    },
    {
      heading: "Why are Missing Values important in AI?",
      paragraphs: [
        "Incomplete data can reduce model accuracy and lead to incorrect predictions if not handled properly.",
      ],
      bullets: [
        "Improves data quality.",
        "Prevents model errors.",
        "Increases prediction accuracy.",
        "Ensures reliable analysis.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a student dataset where some students haven't entered their age.",
        "Before training a model, you may replace the missing ages with the average age or remove those incomplete records if appropriate.",
      ],
    },
    {
      heading: "Where are Missing Values handled?",
      paragraphs: [
        "Handling missing data is a standard preprocessing step in Data Science and AI.",
      ],
      bullets: [
        "Healthcare datasets.",
        "Financial records.",
        "Customer databases.",
        "Survey data.",
        "IoT sensor data.",
        "Machine Learning preprocessing.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners either ignore missing values or delete too much data without considering the impact on the dataset.",
      ],
      bullets: [
        "Ignoring missing values.",
        "Deleting too many rows.",
        "Using inappropriate replacement values.",
        "Assuming missing data has no impact.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Missing values should never be ignored. Proper handling improves data quality and helps AI models make more accurate predictions.",
      ],
      bullets: [
        "Detect missing data.",
        "Choose the right treatment.",
        "Improve data quality.",
        "Prevent training errors.",
        "Essential preprocessing step.",
      ],
    },
  ],
},
"outlier-detection": {
  title: "Outlier Detection",
  subtitle: "Identify unusual data points that can affect AI model performance.",
  eyebrow: "Concept 3 of 3",
  accent: "orange",
  icon: Radar,
  sections: [
    {
      heading: "What is Outlier Detection?",
      paragraphs: [
        "Outlier Detection is the process of identifying data points that are significantly different from the rest of the dataset.",
        "Outliers may result from measurement errors, data entry mistakes, or genuinely rare events.",
        "Detecting outliers helps improve data quality and ensures Machine Learning models are not influenced by abnormal values.",
      ],
    },
    {
      heading: "Why is Outlier Detection important in AI?",
      paragraphs: [
        "Extreme values can distort statistical analysis and negatively impact Machine Learning models.",
      ],
      bullets: [
        "Improves model accuracy.",
        "Reduces noise.",
        "Detects abnormal behavior.",
        "Enhances data quality.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose the salaries in a dataset range from ₹25,000 to ₹150,000, but one record shows ₹5,000,000.",
        "This unusually high value is an outlier that should be investigated before training the model.",
      ],
    },
    {
      heading: "Where is Outlier Detection used?",
      paragraphs: [
        "Outlier detection is widely used wherever unusual patterns need to be identified.",
      ],
      bullets: [
        "Fraud detection.",
        "Healthcare diagnosis.",
        "Network security.",
        "Manufacturing quality control.",
        "Financial analytics.",
        "Sensor monitoring.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners remove every outlier automatically, even though some outliers represent valuable real-world events.",
      ],
      bullets: [
        "Removing all outliers blindly.",
        "Ignoring genuine anomalies.",
        "Confusing noise with important data.",
        "Not investigating unusual values.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Outliers deserve investigation, not automatic deletion. Understanding why they exist leads to better data and more reliable AI models.",
      ],
      bullets: [
        "Detect unusual values.",
        "Investigate before removing.",
        "Improve data quality.",
        "Reduce model bias.",
        "Support accurate predictions.",
      ],
    },
  ],
},
"ml-pipeline": {
  title: "Machine Learning Pipeline",
  subtitle: "A step-by-step workflow for building reliable Machine Learning models.",
  eyebrow: "Concept 1 of 3",
  accent: "blue",
  icon: Workflow,
  sections: [
    {
      heading: "What is a Machine Learning Pipeline?",
      paragraphs: [
        "A Machine Learning Pipeline is a structured sequence of steps used to develop, train, evaluate, and deploy a Machine Learning model.",
        "Instead of treating each task separately, the pipeline organizes the entire workflow into a repeatable and efficient process.",
        "Following a pipeline ensures consistency, reduces errors, and makes Machine Learning projects easier to maintain and improve.",
      ],
    },
    {
      heading: "Why is a Machine Learning Pipeline important?",
      paragraphs: [
        "A well-defined pipeline helps data scientists build reliable AI systems while saving time and reducing manual work.",
      ],
      bullets: [
        "Organizes the ML workflow.",
        "Improves reproducibility.",
        "Reduces manual errors.",
        "Simplifies deployment and maintenance.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine you're building a house price prediction model.",
        "You first collect data, clean it, engineer useful features, train the model, evaluate its performance, and finally deploy it for users. These steps together form the Machine Learning Pipeline.",
      ],
    },
    {
      heading: "Where is the ML Pipeline used?",
      paragraphs: [
        "Every Machine Learning project follows some form of pipeline.",
      ],
      bullets: [
        "Recommendation systems.",
        "Fraud detection.",
        "Medical diagnosis.",
        "Self-driving cars.",
        "Customer churn prediction.",
        "Sales forecasting.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners jump directly to model training without properly preparing or understanding the data.",
      ],
      bullets: [
        "Skipping data preprocessing.",
        "Ignoring model evaluation.",
        "Not separating training and testing data.",
        "Deploying without proper validation.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Machine Learning is more than just training a model. A complete pipeline ensures every step contributes to building a reliable AI solution.",
      ],
      bullets: [
        "Follow a structured workflow.",
        "Prepare data carefully.",
        "Evaluate before deployment.",
        "Repeat and improve.",
        "Foundation of every ML project.",
      ],
    },
  ],
},
"supervised-learning-2": {
  title: "Supervised Learning",
  subtitle: "Learn from labeled examples to make accurate predictions.",
  eyebrow: "Concept 2 of 3",
  accent: "green",
  icon: GraduationCap,
  sections: [
    {
      heading: "What is Supervised Learning?",
      paragraphs: [
        "Supervised Learning is a type of Machine Learning where the model learns from labeled data, meaning every input already has a correct output.",
        "The goal is to discover the relationship between inputs and outputs so the model can make predictions on new, unseen data.",
        "It is the most widely used Machine Learning approach for prediction and classification tasks.",
      ],
    },
    {
      heading: "Why is Supervised Learning important?",
      paragraphs: [
        "Many real-world AI applications rely on learning from historical examples with known outcomes.",
      ],
      bullets: [
        "Produces accurate predictions.",
        "Learns from labeled data.",
        "Supports classification and regression.",
        "Widely used in real-world AI.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you have thousands of emails labeled as 'Spam' or 'Not Spam'.",
        "The model learns patterns from these labeled examples and can classify new incoming emails automatically.",
      ],
    },
    {
      heading: "Where is Supervised Learning used?",
      paragraphs: [
        "Supervised Learning powers many everyday AI applications.",
      ],
      bullets: [
        "Email spam detection.",
        "House price prediction.",
        "Medical diagnosis.",
        "Image classification.",
        "Credit scoring.",
        "Speech recognition.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think more complex models always perform better, even when the training data is limited or poor in quality.",
      ],
      bullets: [
        "Using poor-quality labels.",
        "Overfitting the model.",
        "Ignoring test data.",
        "Using insufficient training data.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Supervised Learning teaches AI using examples with known answers, allowing it to predict outcomes for new data.",
      ],
      bullets: [
        "Uses labeled data.",
        "Learns input-output relationships.",
        "Supports prediction tasks.",
        "Most common ML technique.",
        "Foundation of modern AI applications.",
      ],
    },
  ],
},

"unsupervised-learning-2": {
  title: "Unsupervised Learning",
  subtitle: "Discover hidden patterns and relationships without labeled data.",
  eyebrow: "Concept 3 of 3",
  accent: "purple",
  icon: Network,
  sections: [
    {
      heading: "What is Unsupervised Learning?",
      paragraphs: [
        "Unsupervised Learning is a type of Machine Learning where the model learns from unlabeled data without knowing the correct answers.",
        "Instead of making predictions, the model identifies hidden structures, patterns, or groups within the data.",
        "It is commonly used for clustering, dimensionality reduction, and anomaly detection.",
      ],
    },
    {
      heading: "Why is Unsupervised Learning important?",
      paragraphs: [
        "Much of the world's data is unlabeled, making unsupervised learning valuable for discovering meaningful insights automatically.",
      ],
      bullets: [
        "Finds hidden patterns.",
        "Groups similar data.",
        "Works without labels.",
        "Supports data exploration.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine an online shopping website with millions of customers but no predefined customer categories.",
        "An unsupervised learning algorithm automatically groups customers based on similar shopping behavior, helping businesses create personalized marketing campaigns.",
      ],
    },
    {
      heading: "Where is Unsupervised Learning used?",
      paragraphs: [
        "Unsupervised Learning is widely used for discovering patterns in large datasets.",
      ],
      bullets: [
        "Customer segmentation.",
        "Recommendation systems.",
        "Fraud detection.",
        "Market basket analysis.",
        "Document clustering.",
        "Anomaly detection.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners expect unsupervised learning to produce predefined labels, but its goal is to discover patterns rather than predict known outcomes.",
      ],
      bullets: [
        "Expecting labeled outputs.",
        "Choosing the wrong number of clusters.",
        "Ignoring feature scaling.",
        "Misinterpreting discovered groups.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Unsupervised Learning explores unlabeled data to uncover hidden structures, making it a powerful tool for understanding complex datasets.",
      ],
      bullets: [
        "Uses unlabeled data.",
        "Discovers hidden patterns.",
        "Groups similar observations.",
        "Supports exploratory analysis.",
        "Essential for pattern discovery.",
      ],
    },
  ],
},

"regression": {
  title: "Regression",
  subtitle: "Predict continuous numerical values using Machine Learning.",
  eyebrow: "Concept 2 of 4",
  accent: "blue",
  icon: TrendingUp,
  sections: [
    {
      heading: "What is Regression?",
      paragraphs: [
        "Regression is a Supervised Learning technique used to predict continuous numerical values.",
        "Instead of predicting categories, regression estimates values such as prices, temperatures, salaries, or sales.",
        "The model learns the relationship between input features and a continuous output variable.",
      ],
    },
    {
      heading: "Why is Regression important in AI?",
      paragraphs: [
        "Many business and scientific problems involve predicting quantities rather than categories.",
      ],
      bullets: [
        "Predicts numerical values.",
        "Finds relationships between variables.",
        "Supports forecasting.",
        "Measures trends over time.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you want to predict the price of a house based on its size, location, and number of bedrooms.",
        "A regression model learns from previous house sales and estimates the price of a new house.",
      ],
    },
    {
      heading: "Where is Regression used?",
      paragraphs: [
        "Regression is widely used for prediction and forecasting.",
      ],
      bullets: [
        "House price prediction.",
        "Sales forecasting.",
        "Weather prediction.",
        "Stock price estimation.",
        "Energy consumption forecasting.",
        "Salary prediction.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners use regression even when the target variable represents categories instead of numerical values.",
      ],
      bullets: [
        "Using regression for classification tasks.",
        "Ignoring outliers.",
        "Overfitting the model.",
        "Using irrelevant features.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Regression predicts continuous values, making it one of the most commonly used Machine Learning techniques.",
      ],
      bullets: [
        "Predicts numbers.",
        "Uses labeled data.",
        "Learns relationships.",
        "Supports forecasting.",
        "Core supervised learning algorithm.",
      ],
    },
  ],
},
"classification": {
  title: "Classification",
  subtitle: "Predict categories or labels by learning from labeled examples.",
  eyebrow: "Concept 3 of 4",
  accent: "green",
  icon: Tags,
  sections: [
    {
      heading: "What is Classification?",
      paragraphs: [
        "Classification is a Supervised Learning technique used to predict predefined categories or labels.",
        "The model learns from labeled examples and assigns new data to one of the known classes.",
        "Classification problems can involve two classes (binary classification) or multiple classes (multiclass classification).",
      ],
    },
    {
      heading: "Why is Classification important in AI?",
      paragraphs: [
        "Many real-world AI applications require identifying which category an object belongs to.",
      ],
      bullets: [
        "Predicts categories.",
        "Learns from labeled data.",
        "Supports decision-making.",
        "Works for binary and multiclass problems.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine an email application that labels incoming emails as 'Spam' or 'Not Spam'.",
        "The model learns from previously labeled emails and automatically classifies new messages.",
      ],
    },
    {
      heading: "Where is Classification used?",
      paragraphs: [
        "Classification is one of the most common Machine Learning tasks.",
      ],
      bullets: [
        "Spam detection.",
        "Face recognition.",
        "Disease diagnosis.",
        "Sentiment analysis.",
        "Handwritten digit recognition.",
        "Fraud detection.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners confuse classification with regression because both are supervised learning techniques.",
      ],
      bullets: [
        "Predicting numbers instead of categories.",
        "Using incorrect evaluation metrics.",
        "Ignoring class imbalance.",
        "Using poor-quality labels.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Classification predicts labels or categories, making it essential for recognition and decision-making tasks in AI.",
      ],
      bullets: [
        "Predicts categories.",
        "Uses labeled data.",
        "Binary or multiclass.",
        "Widely used in AI.",
        "Foundation of intelligent decision systems.",
      ],
    },
  ],
},
"clustering": {
  title: "Clustering",
  subtitle: "Group similar data points together without predefined labels.",
  eyebrow: "Concept 4 of 4",
  accent: "purple",
  icon: Group,
  sections: [
    {
      heading: "What is Clustering?",
      paragraphs: [
        "Clustering is an Unsupervised Learning technique that groups similar data points based on their characteristics.",
        "Unlike classification, clustering does not use labeled data. Instead, it discovers hidden groups automatically.",
        "The goal is to organize similar observations into meaningful clusters.",
      ],
    },
    {
      heading: "Why is Clustering important in AI?",
      paragraphs: [
        "Clustering helps uncover hidden patterns in large datasets where labels are unavailable.",
      ],
      bullets: [
        "Discovers natural groups.",
        "Works without labels.",
        "Finds hidden patterns.",
        "Supports data exploration.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose an online store has millions of customers but no customer categories.",
        "A clustering algorithm groups customers based on purchasing behavior, helping the business create personalized marketing strategies.",
      ],
    },
    {
      heading: "Where is Clustering used?",
      paragraphs: [
        "Clustering is widely used to organize and analyze large datasets.",
      ],
      bullets: [
        "Customer segmentation.",
        "Image segmentation.",
        "Document organization.",
        "Recommendation systems.",
        "Market analysis.",
        "Anomaly detection.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners assume clustering always produces meaningful groups, even when the data has no natural structure.",
      ],
      bullets: [
        "Choosing the wrong number of clusters.",
        "Ignoring feature scaling.",
        "Misinterpreting clusters.",
        "Treating clusters as predefined labels.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Clustering automatically groups similar data without labels, making it a powerful tool for discovering hidden insights.",
      ],
      bullets: [
        "Uses unlabeled data.",
        "Groups similar observations.",
        "Finds hidden patterns.",
        "Supports exploratory analysis.",
        "Essential unsupervised learning technique.",
      ],
    },
  ],
},
"random-forest": {
  title: "Random Forest",
  subtitle: "Combine multiple decision trees to make more accurate and reliable predictions.",
  eyebrow: "Algorithm 1 of 5",
  accent: "green",
  icon: Trees,
  sections: [
    {
      heading: "What is Random Forest?",
      paragraphs: [
        "Random Forest is a Supervised Learning algorithm that combines many Decision Trees to make predictions.",
        "Instead of relying on a single tree, it creates multiple trees using different subsets of the data and combines their predictions.",
        "This ensemble approach improves accuracy and reduces the chances of overfitting.",
      ],
    },
    {
      heading: "Why is Random Forest important in AI?",
      paragraphs: [
        "By combining multiple models, Random Forest produces more robust and reliable predictions than a single Decision Tree.",
      ],
      bullets: [
        "High prediction accuracy.",
        "Reduces overfitting.",
        "Works for classification and regression.",
        "Handles large datasets well.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine asking 100 experienced doctors for a diagnosis instead of relying on just one doctor's opinion.",
        "The final decision is based on the majority opinion, making the prediction more reliable. Random Forest follows the same principle.",
      ],
    },
    {
      heading: "Where is Random Forest used?",
      paragraphs: [
        "Random Forest is widely used in real-world Machine Learning applications.",
      ],
      bullets: [
        "Fraud detection.",
        "Disease diagnosis.",
        "Credit risk analysis.",
        "Customer churn prediction.",
        "Stock market prediction.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners assume adding more trees always improves performance, even though it can increase computation without significant benefits.",
      ],
      bullets: [
        "Using too many trees.",
        "Ignoring feature importance.",
        "Not tuning hyperparameters.",
        "Using poor-quality training data.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Random Forest combines multiple Decision Trees to produce more accurate, stable, and reliable predictions.",
      ],
      bullets: [
        "Ensemble learning.",
        "Multiple Decision Trees.",
        "Higher accuracy.",
        "Less overfitting.",
        "Powerful supervised algorithm.",
      ],
    },
  ],
},
"svm": {
  title: "Support Vector Machine (SVM)",
  subtitle: "Find the best boundary that separates different classes of data.",
  eyebrow: "Algorithm 2 of 5",
  accent: "blue",
  icon: SplitSquareVertical,
  sections: [
    {
      heading: "What is Support Vector Machine (SVM)?",
      paragraphs: [
        "Support Vector Machine (SVM) is a Supervised Learning algorithm primarily used for classification tasks.",
        "It works by finding the optimal boundary, called a hyperplane, that separates different classes with the maximum possible margin.",
        "A larger margin generally helps the model classify new data more accurately.",
      ],
    },
    {
      heading: "Why is SVM important in AI?",
      paragraphs: [
        "SVM performs well on high-dimensional datasets and is effective when classes are clearly separable.",
      ],
      bullets: [
        "Finds optimal decision boundaries.",
        "Works well with high-dimensional data.",
        "Effective for classification.",
        "Can handle non-linear data using kernels.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine drawing a line that separates red and blue balls placed on a table.",
        "SVM finds the line that leaves the maximum distance from both groups, making future classification more reliable.",
      ],
    },
    {
      heading: "Where is SVM used?",
      paragraphs: [
        "SVM is commonly used for classification tasks with complex datasets.",
      ],
      bullets: [
        "Face recognition.",
        "Text classification.",
        "Spam detection.",
        "Medical diagnosis.",
        "Image classification.",
        "Handwriting recognition.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners forget to scale features before training an SVM, which can significantly reduce its performance.",
      ],
      bullets: [
        "Ignoring feature scaling.",
        "Choosing the wrong kernel.",
        "Using very large datasets without optimization.",
        "Overlooking parameter tuning.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "SVM finds the best boundary that separates classes, making it a powerful algorithm for classification problems.",
      ],
      bullets: [
        "Maximum margin classifier.",
        "Uses support vectors.",
        "Works with kernels.",
        "Powerful for classification.",
        "Excellent for high-dimensional data.",
      ],
    },
  ],
},
"naive-bayes": {
  title: "Naive Bayes",
  subtitle: "Predict categories using probability and Bayes' Theorem.",
  eyebrow: "Algorithm 3 of 5",
  accent: "purple",
  icon: BrainCircuit,
  sections: [
    {
      heading: "What is Naive Bayes?",
      paragraphs: [
        "Naive Bayes is a Supervised Learning algorithm based on Bayes' Theorem.",
        "It predicts the probability that an input belongs to each class and chooses the class with the highest probability.",
        "The term 'Naive' comes from assuming that all input features are independent of each other, which simplifies calculations.",
      ],
    },
    {
      heading: "Why is Naive Bayes important in AI?",
      paragraphs: [
        "Despite its simple assumptions, Naive Bayes performs remarkably well for many text and classification tasks.",
      ],
      bullets: [
        "Fast and efficient.",
        "Probability-based predictions.",
        "Works well with text data.",
        "Easy to train.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose an email contains words like 'Prize', 'Win', and 'Free'.",
        "Naive Bayes calculates the probability that the email is spam based on these words and predicts the most likely category.",
      ],
    },
    {
      heading: "Where is Naive Bayes used?",
      paragraphs: [
        "Naive Bayes is especially useful for text-related Machine Learning tasks.",
      ],
      bullets: [
        "Spam filtering.",
        "Sentiment analysis.",
        "Document classification.",
        "News categorization.",
        "Recommendation systems.",
        "Medical diagnosis.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners assume Naive Bayes requires perfectly independent features, even though it often works well when this assumption is not completely true.",
      ],
      bullets: [
        "Misunderstanding feature independence.",
        "Ignoring feature preprocessing.",
        "Using poor-quality labels.",
        "Choosing inappropriate feature representations.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Naive Bayes uses probability and Bayes' Theorem to make fast and effective classification decisions.",
      ],
      bullets: [
        "Probability-based algorithm.",
        "Uses Bayes' Theorem.",
        "Fast classification.",
        "Excellent for text data.",
        "Simple yet powerful.",
      ],
    },
  ],
},
"k-means": {
  title: "K-Means Clustering",
  subtitle: "Automatically group similar data into meaningful clusters.",
  eyebrow: "Algorithm 4 of 5",
  accent: "orange",
  icon: Grid2X2,
  sections: [
    {
      heading: "What is K-Means Clustering?",
      paragraphs: [
        "K-Means is an Unsupervised Learning algorithm used to divide data into K distinct clusters.",
        "The algorithm groups similar data points together by repeatedly assigning them to the nearest cluster center and updating the centers.",
        "Its goal is to ensure that data points within the same cluster are as similar as possible.",
      ],
    },
    {
      heading: "Why is K-Means important in AI?",
      paragraphs: [
        "K-Means helps discover hidden patterns in unlabeled data without requiring predefined categories.",
      ],
      bullets: [
        "Automatically groups data.",
        "Works without labels.",
        "Simple and efficient.",
        "Useful for pattern discovery.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a shopping website with thousands of customers.",
        "K-Means automatically groups customers with similar buying habits, helping businesses create personalized marketing campaigns.",
      ],
    },
    {
      heading: "Where is K-Means used?",
      paragraphs: [
        "K-Means is widely used for clustering and segmentation tasks.",
      ],
      bullets: [
        "Customer segmentation.",
        "Image compression.",
        "Market analysis.",
        "Document clustering.",
        "Recommendation systems.",
        "Pattern recognition.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners choose the number of clusters randomly without evaluating whether it fits the data.",
      ],
      bullets: [
        "Choosing the wrong K value.",
        "Ignoring feature scaling.",
        "Assuming clusters are always meaningful.",
        "Stopping optimization too early.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "K-Means groups similar observations together, making it one of the most popular clustering algorithms.",
      ],
      bullets: [
        "Groups similar data.",
        "Uses cluster centroids.",
        "Requires choosing K.",
        "Unsupervised learning.",
        "Excellent for segmentation.",
      ],
    },
  ],
},
"pca": {
  title: "Principal Component Analysis (PCA)",
  subtitle: "Reduce data dimensions while preserving the most important information.",
  eyebrow: "Algorithm 5 of 5",
  accent: "teal",
  icon: Layers3,
  sections: [
    {
      heading: "What is Principal Component Analysis (PCA)?",
      paragraphs: [
        "Principal Component Analysis (PCA) is a dimensionality reduction technique used to simplify large datasets.",
        "It transforms many correlated features into a smaller number of new features called principal components while preserving most of the important information.",
        "Reducing dimensions makes Machine Learning models faster, easier to visualize, and sometimes more accurate.",
      ],
    },
    {
      heading: "Why is PCA important in AI?",
      paragraphs: [
        "Many real-world datasets contain hundreds of features. PCA helps reduce complexity without losing valuable information.",
      ],
      bullets: [
        "Reduces dimensionality.",
        "Removes redundant information.",
        "Speeds up model training.",
        "Improves data visualization.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose a dataset contains 100 different measurements for each customer.",
        "PCA can combine related measurements into a few principal components that capture most of the important patterns while reducing complexity.",
      ],
    },
    {
      heading: "Where is PCA used?",
      paragraphs: [
        "PCA is widely used before training Machine Learning models on high-dimensional datasets.",
      ],
      bullets: [
        "Image recognition.",
        "Face recognition.",
        "Data compression.",
        "Genomics.",
        "Recommendation systems.",
        "Data visualization.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners believe PCA selects the most important original features, whereas it actually creates new combined features called principal components.",
      ],
      bullets: [
        "Confusing features with components.",
        "Applying PCA before scaling data.",
        "Keeping too few components.",
        "Ignoring interpretability.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "PCA simplifies complex datasets by creating fewer, information-rich components that retain most of the original data's variance.",
      ],
      bullets: [
        "Reduces dimensions.",
        "Creates principal components.",
        "Preserves important information.",
        "Improves efficiency.",
        "Powerful preprocessing technique.",
      ],
    },
  ],
},
"traintest-split": {
  title: "Train/Test Split",
  subtitle: "Evaluate Machine Learning models using data they have never seen before.",
  eyebrow: "Concept 1 of 5",
  accent: "blue",
  icon: Split,
  sections: [
    {
      heading: "What is Train/Test Split?",
      paragraphs: [
        "Train/Test Split is the process of dividing a dataset into two separate parts: one for training the model and another for evaluating its performance.",
        "The training set teaches the model patterns from the data, while the test set measures how well the model performs on unseen examples.",
        "Separating the data helps ensure that the model can generalize to new data rather than simply memorizing the training examples.",
      ],
    },
    {
      heading: "Why is Train/Test Split important in AI?",
      paragraphs: [
        "Testing on unseen data provides a realistic measure of how the model will perform in real-world situations.",
      ],
      bullets: [
        "Measures generalization.",
        "Prevents data leakage.",
        "Detects overfitting.",
        "Provides fair model evaluation.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine preparing for an exam using practice questions.",
        "The practice questions are your training data, while the final exam represents the test data. A good score on the final exam shows you've truly learned rather than memorized.",
      ],
    },
    {
      heading: "Where is Train/Test Split used?",
      paragraphs: [
        "Every supervised Machine Learning project begins by splitting the dataset before training.",
      ],
      bullets: [
        "Image classification.",
        "Spam detection.",
        "House price prediction.",
        "Medical diagnosis.",
        "Fraud detection.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners accidentally evaluate their model using the same data it was trained on, resulting in overly optimistic performance.",
      ],
      bullets: [
        "Testing on training data.",
        "Data leakage.",
        "Using very small test sets.",
        "Ignoring randomization.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Always evaluate a Machine Learning model using data it has never seen before to measure its true performance.",
      ],
      bullets: [
        "Train on one set.",
        "Test on another.",
        "Measure generalization.",
        "Avoid memorization.",
        "Essential evaluation step.",
      ],
    },
  ],
},
"cross-validation": {
  title: "Cross Validation",
  subtitle: "Evaluate models more reliably by testing them on multiple data splits.",
  eyebrow: "Concept 2 of 5",
  accent: "green",
  icon: RefreshCw,
  sections: [
    {
      heading: "What is Cross Validation?",
      paragraphs: [
        "Cross Validation is a model evaluation technique that repeatedly splits the dataset into different training and validation sets.",
        "The most common approach is K-Fold Cross Validation, where the data is divided into K equal parts and each part is used once as the validation set.",
        "The final performance is calculated by averaging the results from all folds, providing a more reliable estimate.",
      ],
    },
    {
      heading: "Why is Cross Validation important in AI?",
      paragraphs: [
        "Using multiple data splits reduces the chance that evaluation depends on one lucky or unlucky train/test split.",
      ],
      bullets: [
        "Produces reliable evaluation.",
        "Uses data efficiently.",
        "Reduces evaluation bias.",
        "Improves model selection.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you divide your dataset into five equal parts.",
        "The model trains on four parts and validates on the remaining one. This process repeats five times until every part has been used for validation once.",
      ],
    },
    {
      heading: "Where is Cross Validation used?",
      paragraphs: [
        "Cross Validation is commonly used when comparing Machine Learning models and tuning hyperparameters.",
      ],
      bullets: [
        "Model comparison.",
        "Hyperparameter tuning.",
        "Academic research.",
        "Medical AI.",
        "Financial prediction.",
        "Small datasets.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners perform preprocessing before cross validation, which can accidentally leak information into the validation data.",
      ],
      bullets: [
        "Data leakage.",
        "Using too few folds.",
        "Ignoring computation cost.",
        "Applying preprocessing incorrectly.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Cross Validation evaluates a model multiple times using different data splits, making performance estimates more trustworthy.",
      ],
      bullets: [
        "Multiple train-test splits.",
        "Reliable evaluation.",
        "Reduces bias.",
        "Better model selection.",
        "Widely used in ML.",
      ],
    },
  ],
},
"hyperparameter-tuning": {
  title: "Hyperparameter Tuning",
  subtitle: "Find the best settings to improve Machine Learning model performance.",
  eyebrow: "Concept 3 of 5",
  accent: "purple",
  icon: SlidersHorizontal,
  sections: [
    {
      heading: "What is Hyperparameter Tuning?",
      paragraphs: [
        "Hyperparameter Tuning is the process of finding the best configuration for a Machine Learning algorithm before training.",
        "Unlike model parameters, which are learned automatically, hyperparameters are chosen by the developer.",
        "Selecting the right hyperparameters can significantly improve model accuracy and generalization.",
      ],
    },
    {
      heading: "Why is Hyperparameter Tuning important in AI?",
      paragraphs: [
        "Even the best algorithm may perform poorly if its hyperparameters are not properly configured.",
      ],
      bullets: [
        "Improves accuracy.",
        "Reduces overfitting.",
        "Optimizes model performance.",
        "Helps select the best model.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose you're using K-Nearest Neighbors.",
        "Choosing K = 1 may overfit the data, while K = 100 may underfit. Hyperparameter tuning helps identify the value of K that gives the best results.",
      ],
    },
    {
      heading: "Where is Hyperparameter Tuning used?",
      paragraphs: [
        "Hyperparameter tuning is performed for almost every Machine Learning algorithm.",
      ],
      bullets: [
        "Decision Trees.",
        "Random Forest.",
        "SVM.",
        "Neural Networks.",
        "Gradient Boosting.",
        "K-Nearest Neighbors.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners use default settings without exploring whether better hyperparameter values exist.",
      ],
      bullets: [
        "Using default values only.",
        "Testing too few combinations.",
        "Ignoring validation results.",
        "Overfitting during tuning.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Hyperparameter tuning helps unlock the full potential of a Machine Learning model by selecting the best settings before training.",
      ],
      bullets: [
        "Tune before final training.",
        "Optimize performance.",
        "Improve generalization.",
        "Compare multiple settings.",
        "Essential optimization step.",
      ],
    },
  ],
},
"precision": {
  title: "Precision",
  subtitle: "Measure how many positive predictions made by the model are actually correct.",
  eyebrow: "Concept 4 of 5",
  accent: "orange",
  icon: Target,
  sections: [
    {
      heading: "What is Precision?",
      paragraphs: [
        "Precision is an evaluation metric used for classification models.",
        "It measures the proportion of predicted positive cases that are actually positive.",
        "A high precision means the model makes very few false positive predictions.",
      ],
    },
    {
      heading: "Why is Precision important in AI?",
      paragraphs: [
        "Precision is especially important when false alarms are expensive or undesirable.",
      ],
      bullets: [
        "Measures prediction quality.",
        "Reduces false positives.",
        "Improves decision-making.",
        "Useful for classification tasks.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose an email filter marks 100 emails as spam.",
        "If 95 are actually spam and 5 are genuine emails, the model has high precision because most positive predictions are correct.",
      ],
    },
    {
      heading: "Where is Precision used?",
      paragraphs: [
        "Precision is important whenever false positive predictions have serious consequences.",
      ],
      bullets: [
        "Spam detection.",
        "Medical diagnosis.",
        "Fraud detection.",
        "Cybersecurity.",
        "Quality inspection.",
        "Content moderation.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners optimize only for precision while ignoring recall, leading to models that miss many true positive cases.",
      ],
      bullets: [
        "Ignoring recall.",
        "Optimizing one metric only.",
        "Misinterpreting precision as accuracy.",
        "Not considering class imbalance.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Precision answers the question: 'Of all the positive predictions the model made, how many were actually correct?'",
      ],
      bullets: [
        "Focuses on false positives.",
        "Higher is better.",
        "Classification metric.",
        "Measures prediction quality.",
        "Works with recall for evaluation.",
      ],
    },
  ],
},
"recall": {
  title: "Recall",
  subtitle: "Measure how many actual positive cases the model successfully finds.",
  eyebrow: "Concept 5 of 5",
  accent: "coral",
  icon: SearchCheck,
  sections: [
    {
      heading: "What is Recall?",
      paragraphs: [
        "Recall is an evaluation metric that measures how many actual positive cases are correctly identified by the model.",
        "It focuses on reducing false negatives, ensuring that important positive cases are not missed.",
        "A high recall means the model successfully detects most of the actual positive instances.",
      ],
    },
    {
      heading: "Why is Recall important in AI?",
      paragraphs: [
        "Recall is critical in situations where missing a positive case could have serious consequences.",
      ],
      bullets: [
        "Measures detection ability.",
        "Reduces false negatives.",
        "Improves safety.",
        "Essential for sensitive applications.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a medical test for detecting cancer.",
        "If 100 patients actually have cancer and the model correctly identifies 98 of them, it has a high recall because very few cases were missed.",
      ],
    },
    {
      heading: "Where is Recall used?",
      paragraphs: [
        "Recall is especially important in applications where missing a positive case is costly.",
      ],
      bullets: [
        "Medical diagnosis.",
        "Fraud detection.",
        "Disease screening.",
        "Cybersecurity.",
        "Safety monitoring.",
        "Disaster prediction.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners maximize recall without considering precision, which can result in too many false positive predictions.",
      ],
      bullets: [
        "Ignoring precision.",
        "Confusing recall with accuracy.",
        "Not balancing evaluation metrics.",
        "Overlooking class imbalance.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Recall answers the question: 'Of all the actual positive cases, how many did the model correctly identify?'",
      ],
      bullets: [
        "Focuses on false negatives.",
        "Higher is better.",
        "Measures detection rate.",
        "Important for critical systems.",
        "Complements precision.",
      ],
    },
  ],
},
"f1-score": {
  title: "F1 Score",
  subtitle: "Balance precision and recall with a single performance metric.",
  eyebrow: "Concept 1 of 4",
  accent: "blue",
  icon: Scale,
  sections: [
    {
      heading: "What is F1 Score?",
      paragraphs: [
        "F1 Score is a classification evaluation metric that combines Precision and Recall into a single value.",
        "It is the harmonic mean of Precision and Recall, giving equal importance to both metrics.",
        "The F1 Score is especially useful when working with imbalanced datasets where accuracy alone can be misleading.",
      ],
    },
    {
      heading: "Why is F1 Score important in AI?",
      paragraphs: [
        "F1 Score helps evaluate models that need both high precision and high recall.",
      ],
      bullets: [
        "Balances Precision and Recall.",
        "Works well with imbalanced datasets.",
        "Provides a single evaluation metric.",
        "Measures overall classification quality.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose a disease detection model identifies most patients correctly but also produces some false alarms.",
        "The F1 Score combines Precision and Recall to show how well the model performs overall instead of focusing on only one metric.",
      ],
    },
    {
      heading: "Where is F1 Score used?",
      paragraphs: [
        "F1 Score is commonly used when both false positives and false negatives matter.",
      ],
      bullets: [
        "Medical diagnosis.",
        "Spam detection.",
        "Fraud detection.",
        "Sentiment analysis.",
        "Cybersecurity.",
        "Information retrieval.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners rely only on accuracy and ignore F1 Score, especially when dealing with imbalanced datasets.",
      ],
      bullets: [
        "Ignoring class imbalance.",
        "Using accuracy alone.",
        "Confusing F1 with accuracy.",
        "Optimizing only Precision or Recall.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "F1 Score provides a balanced measure of a classification model by combining Precision and Recall into one metric.",
      ],
      bullets: [
        "Balances Precision and Recall.",
        "Useful for imbalanced data.",
        "Single evaluation metric.",
        "Higher is better.",
        "Essential classification metric.",
      ],
    },
  ],
},
"roc-curve": {
  title: "ROC Curve",
  subtitle: "Visualize how well a classification model separates different classes.",
  eyebrow: "Concept 2 of 4",
  accent: "green",
  icon: LineChart,
  sections: [
    {
      heading: "What is the ROC Curve?",
      paragraphs: [
        "The Receiver Operating Characteristic (ROC) Curve is a graph used to evaluate the performance of a binary classification model.",
        "It plots the True Positive Rate (Recall) against the False Positive Rate at different classification thresholds.",
        "A model with a curve closer to the top-left corner generally performs better at distinguishing between classes.",
      ],
    },
    {
      heading: "Why is the ROC Curve important in AI?",
      paragraphs: [
        "The ROC Curve helps compare classification models and choose an appropriate decision threshold.",
      ],
      bullets: [
        "Visualizes model performance.",
        "Compares classifiers.",
        "Evaluates different thresholds.",
        "Shows class separation ability.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine testing different confidence levels for a spam detection system.",
        "The ROC Curve shows how changing the decision threshold affects the number of correctly detected spam emails and false alarms.",
      ],
    },
    {
      heading: "Where is the ROC Curve used?",
      paragraphs: [
        "ROC Curves are widely used for evaluating binary classification models.",
      ],
      bullets: [
        "Medical diagnosis.",
        "Fraud detection.",
        "Spam filtering.",
        "Credit risk analysis.",
        "Cybersecurity.",
        "Machine Learning model comparison.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners interpret the ROC Curve without considering class imbalance or the application's specific requirements.",
      ],
      bullets: [
        "Ignoring AUC score.",
        "Using ROC for highly imbalanced datasets without caution.",
        "Misunderstanding thresholds.",
        "Comparing models incorrectly.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "The ROC Curve shows how well a classifier distinguishes between positive and negative classes across different thresholds.",
      ],
      bullets: [
        "Plots TPR vs FPR.",
        "Evaluates classifiers.",
        "Threshold independent.",
        "Often paired with AUC.",
        "Visual performance metric.",
      ],
    },
  ],
},
"confusion-matrix": {
  title: "Confusion Matrix",
  subtitle: "Understand exactly where a classification model makes correct and incorrect predictions.",
  eyebrow: "Concept 3 of 4",
  accent: "purple",
  icon: Grid2X2,
  sections: [
    {
      heading: "What is a Confusion Matrix?",
      paragraphs: [
        "A Confusion Matrix is a table that summarizes the performance of a classification model.",
        "It shows the number of True Positives, True Negatives, False Positives, and False Negatives.",
        "These values form the basis for calculating evaluation metrics such as Precision, Recall, Accuracy, and F1 Score.",
      ],
    },
    {
      heading: "Why is the Confusion Matrix important in AI?",
      paragraphs: [
        "It provides detailed insight into the types of mistakes a model makes instead of giving only a single accuracy value.",
      ],
      bullets: [
        "Shows prediction errors.",
        "Calculates evaluation metrics.",
        "Analyzes classification performance.",
        "Identifies model weaknesses.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose a disease detection model correctly identifies 90 sick patients and 850 healthy patients but misses 10 sick patients and incorrectly labels 50 healthy people as sick.",
        "A Confusion Matrix organizes these results, making it easy to analyze the model's performance.",
      ],
    },
    {
      heading: "Where is the Confusion Matrix used?",
      paragraphs: [
        "It is used to evaluate almost every classification model.",
      ],
      bullets: [
        "Medical diagnosis.",
        "Spam detection.",
        "Fraud detection.",
        "Face recognition.",
        "Sentiment analysis.",
        "Quality inspection.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners focus only on overall accuracy and ignore the detailed information available in the Confusion Matrix.",
      ],
      bullets: [
        "Ignoring False Positives.",
        "Ignoring False Negatives.",
        "Using only accuracy.",
        "Misinterpreting matrix values.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "The Confusion Matrix explains exactly how a classification model performs by breaking predictions into four meaningful categories.",
      ],
      bullets: [
        "TP, TN, FP, FN.",
        "Foundation of evaluation metrics.",
        "Shows prediction errors.",
        "Useful for model improvement.",
        "Essential for classification analysis.",
      ],
    },
  ],
},
"bias-variance-tradeoff": {
  title: "Bias-Variance Tradeoff",
  subtitle: "Balance underfitting and overfitting to build models that generalize well.",
  eyebrow: "Concept 4 of 4",
  accent: "orange",
  icon: Workflow,
  sections: [
    {
      heading: "What is the Bias-Variance Tradeoff?",
      paragraphs: [
        "The Bias-Variance Tradeoff describes the balance between two common sources of prediction error in Machine Learning.",
        "High bias occurs when a model is too simple and fails to capture important patterns, leading to underfitting.",
        "High variance occurs when a model is too complex and memorizes the training data, leading to overfitting. The goal is to find the right balance between the two.",
      ],
    },
    {
      heading: "Why is the Bias-Variance Tradeoff important in AI?",
      paragraphs: [
        "Understanding this tradeoff helps developers choose models that perform well on both training and unseen data.",
      ],
      bullets: [
        "Prevents underfitting.",
        "Prevents overfitting.",
        "Improves generalization.",
        "Guides model selection.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine studying for an exam.",
        "If you study only a few topics, you'll likely perform poorly because you haven't learned enough (high bias). If you memorize every practice question instead of understanding the concepts, you'll struggle with new questions (high variance). The ideal approach is to understand the concepts well enough to solve unseen problems.",
      ],
    },
    {
      heading: "Where is the Bias-Variance Tradeoff used?",
      paragraphs: [
        "This concept is considered whenever building or optimizing Machine Learning models.",
      ],
      bullets: [
        "Model selection.",
        "Hyperparameter tuning.",
        "Decision Trees.",
        "Neural Networks.",
        "Ensemble learning.",
        "Model optimization.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners try to maximize training accuracy without checking whether the model generalizes well to new data.",
      ],
      bullets: [
        "Ignoring validation performance.",
        "Overfitting training data.",
        "Choosing overly simple models.",
        "Focusing only on training accuracy.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "A good Machine Learning model finds the balance between bias and variance, allowing it to learn meaningful patterns without memorizing the training data.",
      ],
      bullets: [
        "High bias → Underfitting.",
        "High variance → Overfitting.",
        "Balance both errors.",
        "Improve generalization.",
        "Core ML optimization concept.",
      ],
    },
  ],
},
"artificial-neural-networks": {
  title: "Artificial Neural Networks",
  subtitle: "Learn how interconnected artificial neurons work together to solve complex problems.",
  eyebrow: "Concept 1 of 3",
  accent: "blue",
  icon: Network,
  sections: [
    {
      heading: "What are Artificial Neural Networks?",
      paragraphs: [
        "Artificial Neural Networks (ANNs) are Machine Learning models inspired by the structure and functioning of the human brain.",
        "An ANN consists of interconnected artificial neurons organized into layers: an input layer, one or more hidden layers, and an output layer.",
        "Each neuron processes information, passes it to the next layer, and together they learn complex patterns from data.",
      ],
    },
    {
      heading: "Why are Artificial Neural Networks important in AI?",
      paragraphs: [
        "Neural Networks form the foundation of modern Deep Learning and power many of today's most advanced AI systems.",
      ],
      bullets: [
        "Learns complex patterns.",
        "Handles non-linear problems.",
        "Automatically extracts features.",
        "Foundation of Deep Learning.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine recognizing handwritten digits.",
        "Instead of manually defining rules for every digit, a Neural Network learns the important patterns directly from thousands of labeled images and predicts the correct digit for new images.",
      ],
    },
    {
      heading: "Where are Artificial Neural Networks used?",
      paragraphs: [
        "Neural Networks are used across nearly every modern AI application.",
      ],
      bullets: [
        "Image recognition.",
        "Speech recognition.",
        "Natural Language Processing.",
        "Recommendation systems.",
        "Medical diagnosis.",
        "Autonomous vehicles.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners believe Neural Networks always outperform simpler algorithms, even when the dataset is small or the problem is relatively simple.",
      ],
      bullets: [
        "Using Neural Networks for very small datasets.",
        "Ignoring data preprocessing.",
        "Choosing overly complex architectures.",
        "Expecting instant high accuracy.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Artificial Neural Networks learn by adjusting the connections between neurons, allowing them to recognize complex patterns that traditional algorithms may struggle to capture.",
      ],
      bullets: [
        "Inspired by the brain.",
        "Built from layers of neurons.",
        "Learns complex relationships.",
        "Foundation of Deep Learning.",
        "Drives modern AI systems.",
      ],
    },
  ],
},

"artificial-neural-networks-1": {
  title: "Artificial Neural Networks",
  subtitle: "Learn how interconnected artificial neurons work together to solve complex problems.",
  eyebrow: "Concept 1 of 3",
  accent: "blue",
  icon: Network,
  sections: [
    {
      heading: "What are Artificial Neural Networks?",
      paragraphs: [
        "Artificial Neural Networks (ANNs) are Machine Learning models inspired by the structure and functioning of the human brain.",
        "An ANN consists of interconnected artificial neurons organized into layers: an input layer, one or more hidden layers, and an output layer.",
        "Each neuron processes information, passes it to the next layer, and together they learn complex patterns from data.",
      ],
    },
    {
      heading: "Why are Artificial Neural Networks important in AI?",
      paragraphs: [
        "Neural Networks form the foundation of modern Deep Learning and power many of today's most advanced AI systems.",
      ],
      bullets: [
        "Learns complex patterns.",
        "Handles non-linear problems.",
        "Automatically extracts features.",
        "Foundation of Deep Learning.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine recognizing handwritten digits.",
        "Instead of manually defining rules for every digit, a Neural Network learns the important patterns directly from thousands of labeled images and predicts the correct digit for new images.",
      ],
    },
    {
      heading: "Where are Artificial Neural Networks used?",
      paragraphs: [
        "Neural Networks are used across nearly every modern AI application.",
      ],
      bullets: [
        "Image recognition.",
        "Speech recognition.",
        "Natural Language Processing.",
        "Recommendation systems.",
        "Medical diagnosis.",
        "Autonomous vehicles.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners believe Neural Networks always outperform simpler algorithms, even when the dataset is small or the problem is relatively simple.",
      ],
      bullets: [
        "Using Neural Networks for very small datasets.",
        "Ignoring data preprocessing.",
        "Choosing overly complex architectures.",
        "Expecting instant high accuracy.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Artificial Neural Networks learn by adjusting the connections between neurons, allowing them to recognize complex patterns that traditional algorithms may struggle to capture.",
      ],
      bullets: [
        "Inspired by the brain.",
        "Built from layers of neurons.",
        "Learns complex relationships.",
        "Foundation of Deep Learning.",
        "Drives modern AI systems.",
      ],
    },
  ],
},
"backpropagation": {
  title: "Backpropagation",
  subtitle: "Teach Neural Networks by correcting errors and updating weights.",
  eyebrow: "Concept 3 of 3",
  accent: "purple",
  icon: RotateCcw,
  sections: [
    {
      heading: "What is Backpropagation?",
      paragraphs: [
        "Backpropagation is the learning algorithm used to train Artificial Neural Networks.",
        "After the network makes a prediction, the error between the predicted output and the actual output is calculated.",
        "This error is propagated backward through the network to adjust the weights, helping the model make more accurate predictions in future iterations.",
      ],
    },
    {
      heading: "Why is Backpropagation important in AI?",
      paragraphs: [
        "Without Backpropagation, Neural Networks would never improve their predictions because their weights would remain unchanged.",
      ],
      bullets: [
        "Learns from mistakes.",
        "Updates network weights.",
        "Reduces prediction error.",
        "Improves model accuracy.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a student solving a math problem.",
        "After seeing the correct answer, the student identifies mistakes, learns from them, and performs better next time. Backpropagation works similarly by correcting the network's errors after every prediction.",
      ],
    },
    {
      heading: "Where is Backpropagation used?",
      paragraphs: [
        "Backpropagation is used to train almost every Deep Learning model.",
      ],
      bullets: [
        "Image recognition.",
        "Natural Language Processing.",
        "Speech recognition.",
        "Computer Vision.",
        "Recommendation systems.",
        "Generative AI.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners think Backpropagation is the same as Forward Propagation, even though Backpropagation is responsible for learning by updating weights.",
      ],
      bullets: [
        "Confusing Forward and Backpropagation.",
        "Ignoring the loss function.",
        "Misunderstanding gradient updates.",
        "Assuming weights never change.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Backpropagation teaches a Neural Network by sending errors backward and adjusting weights so that future predictions become more accurate.",
      ],
      bullets: [
        "Learns from errors.",
        "Updates weights.",
        "Uses gradients.",
        "Reduces loss.",
        "Core Deep Learning algorithm.",
      ],
    },
  ],
},
"gradient-descent": {
  title: "Gradient Descent",
  subtitle: "Optimize Neural Networks by minimizing prediction errors step by step.",
  eyebrow: "Concept 1 of 3",
  accent: "blue",
  icon: TrendingDown,
  sections: [
    {
      heading: "What is Gradient Descent?",
      paragraphs: [
        "Gradient Descent is an optimization algorithm used to train Machine Learning and Deep Learning models.",
        "Its goal is to minimize the loss (error) by repeatedly adjusting the model's weights in the direction that reduces the error the most.",
        "With each iteration, the model gradually moves closer to the optimal solution, improving its predictions.",
      ],
    },
    {
      heading: "Why is Gradient Descent important in AI?",
      paragraphs: [
        "Without Gradient Descent, Neural Networks would not know how to improve after making incorrect predictions.",
      ],
      bullets: [
        "Minimizes prediction error.",
        "Updates model weights.",
        "Improves learning.",
        "Foundation of Deep Learning optimization.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine standing on top of a mountain in thick fog and trying to reach the lowest point.",
        "You take small steps downhill based on the slope beneath your feet. Similarly, Gradient Descent follows the direction of the steepest decrease in loss until it reaches the minimum.",
      ],
    },
    {
      heading: "Where is Gradient Descent used?",
      paragraphs: [
        "Gradient Descent is used to train almost every modern Machine Learning and Deep Learning model.",
      ],
      bullets: [
        "Artificial Neural Networks.",
        "Deep Learning.",
        "Linear Regression.",
        "Logistic Regression.",
        "Computer Vision.",
        "Natural Language Processing.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners choose an inappropriate learning rate, causing the model to learn too slowly or fail to converge.",
      ],
      bullets: [
        "Using a very high learning rate.",
        "Using a very low learning rate.",
        "Stopping training too early.",
        "Ignoring convergence behavior.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Gradient Descent improves a model by repeatedly adjusting its weights to reduce prediction error until the best solution is found.",
      ],
      bullets: [
        "Minimizes loss.",
        "Uses gradients.",
        "Updates weights.",
        "Iterative optimization.",
        "Essential for Deep Learning.",
      ],
    },
  ],
},
"optimizers": {
  title: "Optimizers",
  subtitle: "Improve how Neural Networks learn by updating weights efficiently.",
  eyebrow: "Concept 2 of 3",
  accent: "green",
  icon: Gauge,
  sections: [
    {
      heading: "What are Optimizers?",
      paragraphs: [
        "Optimizers are algorithms that update a Neural Network's weights during training to minimize the loss function.",
        "While Gradient Descent provides the basic optimization idea, modern optimizers improve speed, stability, and convergence.",
        "Popular optimizers include SGD (Stochastic Gradient Descent), Momentum, RMSProp, and Adam.",
      ],
    },
    {
      heading: "Why are Optimizers important in AI?",
      paragraphs: [
        "Choosing the right optimizer can significantly improve training speed and model performance.",
      ],
      bullets: [
        "Speeds up learning.",
        "Reduces training time.",
        "Improves convergence.",
        "Enhances model performance.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine two cyclists trying to reach the bottom of a hill.",
        "One rides carefully at a constant speed, while the other intelligently adjusts speed and direction to reach the destination faster. Modern optimizers work similarly by improving the basic Gradient Descent process.",
      ],
    },
    {
      heading: "Where are Optimizers used?",
      paragraphs: [
        "Optimizers are used whenever Neural Networks are trained.",
      ],
      bullets: [
        "Deep Learning.",
        "Computer Vision.",
        "Natural Language Processing.",
        "Speech Recognition.",
        "Generative AI.",
        "Reinforcement Learning.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners always use the default optimizer without understanding how different optimizers affect training.",
      ],
      bullets: [
        "Using the wrong optimizer.",
        "Ignoring learning rate settings.",
        "Stopping training too early.",
        "Not comparing optimizer performance.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Optimizers determine how a Neural Network learns by deciding the best way to update its weights during training.",
      ],
      bullets: [
        "Updates weights.",
        "Improves Gradient Descent.",
        "Faster convergence.",
        "Better learning.",
        "Essential for Deep Learning.",
      ],
    },
  ],
},
"activation-functions-2": {
  title: "Activation Functions",
  subtitle: "Introduce non-linearity so Neural Networks can learn complex patterns.",
  eyebrow: "Concept 3 of 3",
  accent: "purple",
  icon: Zap,
  sections: [
    {
      heading: "What are Activation Functions?",
      paragraphs: [
        "Activation Functions are mathematical functions applied to the output of each neuron in a Neural Network.",
        "They determine whether a neuron should pass information to the next layer by transforming its input into a meaningful output.",
        "Without activation functions, Neural Networks would behave like simple linear models and fail to learn complex relationships.",
      ],
    },
    {
      heading: "Why are Activation Functions important in AI?",
      paragraphs: [
        "Activation functions allow Deep Learning models to solve complex, non-linear problems that cannot be handled using simple linear equations.",
      ],
      bullets: [
        "Introduce non-linearity.",
        "Enable complex learning.",
        "Improve model performance.",
        "Support Deep Learning architectures.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a security gate that only opens when certain conditions are met.",
        "Similarly, an activation function decides whether a neuron's output should be passed to the next layer based on the input it receives.",
      ],
    },
    {
      heading: "Where are Activation Functions used?",
      paragraphs: [
        "Activation functions are used in every modern Neural Network architecture.",
      ],
      bullets: [
        "Image classification.",
        "Speech recognition.",
        "Language translation.",
        "Object detection.",
        "Generative AI.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners use the same activation function for every layer without considering the problem or network architecture.",
      ],
      bullets: [
        "Choosing inappropriate activation functions.",
        "Ignoring output layer requirements.",
        "Using Sigmoid everywhere.",
        "Not understanding vanishing gradients.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Activation functions give Neural Networks the ability to learn complex, non-linear relationships, making Deep Learning possible.",
      ],
      bullets: [
        "Adds non-linearity.",
        "Controls neuron output.",
        "Essential for Deep Learning.",
        "Improves learning capability.",
        "Common examples: ReLU, Sigmoid, Tanh, Softmax.",
      ],
    },
  ],
},
"loss-functions": {
  title: "Loss Functions",
  subtitle: "Measure how far a model's predictions are from the correct answers.",
  eyebrow: "Concept 1 of 4",
  accent: "blue",
  icon: Target,
  sections: [
    {
      heading: "What are Loss Functions?",
      paragraphs: [
        "A Loss Function is a mathematical function that measures the difference between a model's predicted output and the actual target value.",
        "It provides a numerical score representing how well or poorly the model is performing during training.",
        "The objective of training is to minimize this loss so the model can make more accurate predictions.",
      ],
    },
    {
      heading: "Why are Loss Functions important in AI?",
      paragraphs: [
        "Loss functions provide the feedback that tells a model whether its predictions are improving or getting worse.",
      ],
      bullets: [
        "Measures prediction error.",
        "Guides model learning.",
        "Works with Gradient Descent.",
        "Improves prediction accuracy.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose a model predicts that a house costs ₹48 lakh, but its actual price is ₹50 lakh.",
        "The loss function calculates the error between these values. During training, the model adjusts its weights to reduce this error over time.",
      ],
    },
    {
      heading: "Where are Loss Functions used?",
      paragraphs: [
        "Loss functions are used whenever Machine Learning or Deep Learning models are trained.",
      ],
      bullets: [
        "Linear Regression.",
        "Neural Networks.",
        "Image classification.",
        "Language models.",
        "Speech recognition.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners choose the wrong loss function for their problem, leading to poor model performance.",
      ],
      bullets: [
        "Using regression loss for classification.",
        "Ignoring the output type.",
        "Confusing loss with accuracy.",
        "Optimizing the wrong objective.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Loss functions tell the model how wrong its predictions are, enabling it to learn by minimizing those errors.",
      ],
      bullets: [
        "Measures prediction error.",
        "Guides learning.",
        "Minimized during training.",
        "Essential for optimization.",
        "Foundation of model training.",
      ],
    },
  ],
},
"regularization": {
  title: "Regularization",
  subtitle: "Prevent overfitting so models perform well on unseen data.",
  eyebrow: "Concept 2 of 4",
  accent: "green",
  icon: Shield,
  sections: [
    {
      heading: "What is Regularization?",
      paragraphs: [
        "Regularization is a technique used to reduce overfitting by preventing a model from becoming unnecessarily complex.",
        "It adds a penalty to the loss function, encouraging the model to keep its weights smaller and simpler.",
        "Common regularization methods include L1 Regularization (Lasso) and L2 Regularization (Ridge).",
      ],
    },
    {
      heading: "Why is Regularization important in AI?",
      paragraphs: [
        "Regularization helps models generalize better by reducing their tendency to memorize the training data.",
      ],
      bullets: [
        "Reduces overfitting.",
        "Improves generalization.",
        "Simplifies models.",
        "Produces more reliable predictions.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a student who memorizes every answer instead of understanding the concepts.",
        "While they may perform well on practice questions, they'll struggle with new ones. Regularization encourages the model to learn general patterns instead of memorizing examples.",
      ],
    },
    {
      heading: "Where is Regularization used?",
      paragraphs: [
        "Regularization is widely used in Machine Learning and Deep Learning models.",
      ],
      bullets: [
        "Linear Regression.",
        "Logistic Regression.",
        "Neural Networks.",
        "Computer Vision.",
        "Natural Language Processing.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners apply too much regularization, causing the model to become overly simple and underfit the data.",
      ],
      bullets: [
        "Using excessive regularization.",
        "Ignoring underfitting.",
        "Choosing incorrect penalty values.",
        "Not validating performance.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Regularization controls model complexity so it learns meaningful patterns instead of memorizing the training data.",
      ],
      bullets: [
        "Prevents overfitting.",
        "Controls complexity.",
        "Improves generalization.",
        "Uses L1 and L2 penalties.",
        "Better real-world performance.",
      ],
    },
  ],
},
"batch-normalization": {
  title: "Batch Normalization",
  subtitle: "Normalize intermediate outputs to train Neural Networks faster and more reliably.",
  eyebrow: "Concept 3 of 4",
  accent: "purple",
  icon: Layers,
  sections: [
    {
      heading: "What is Batch Normalization?",
      paragraphs: [
        "Batch Normalization is a technique that normalizes the outputs of a layer before passing them to the next layer during training.",
        "By keeping the values within a stable range, it helps Neural Networks learn more efficiently and consistently.",
        "It also allows the use of higher learning rates, making training faster and often improving model performance.",
      ],
    },
    {
      heading: "Why is Batch Normalization important in AI?",
      paragraphs: [
        "Batch Normalization improves training stability and helps Deep Learning models converge more quickly.",
      ],
      bullets: [
        "Speeds up training.",
        "Stabilizes learning.",
        "Improves convergence.",
        "Reduces sensitivity to initialization.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine students entering a classroom with very different levels of preparation.",
        "A quick revision session brings everyone to a similar understanding before the lesson begins. Batch Normalization works similarly by standardizing data flowing through the network.",
      ],
    },
    {
      heading: "Where is Batch Normalization used?",
      paragraphs: [
        "Batch Normalization is commonly used in modern Deep Learning architectures.",
      ],
      bullets: [
        "Convolutional Neural Networks (CNNs).",
        "Deep Neural Networks.",
        "Image classification.",
        "Object detection.",
        "Generative AI.",
        "Speech recognition.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners assume Batch Normalization completely eliminates overfitting, even though other techniques like Dropout may still be needed.",
      ],
      bullets: [
        "Confusing normalization with regularization.",
        "Incorrect layer placement.",
        "Ignoring batch size effects.",
        "Expecting it to solve every training issue.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Batch Normalization keeps activations stable during training, helping Neural Networks learn faster and more effectively.",
      ],
      bullets: [
        "Normalizes activations.",
        "Speeds up training.",
        "Improves stability.",
        "Works with Deep Learning.",
        "Boosts convergence.",
      ],
    },
  ],
},
"dropout": {
  title: "Dropout",
  subtitle: "Reduce overfitting by temporarily disabling neurons during training.",
  eyebrow: "Concept 4 of 4",
  accent: "orange",
  icon: CircleOff,
  sections: [
    {
      heading: "What is Dropout?",
      paragraphs: [
        "Dropout is a regularization technique used in Neural Networks to reduce overfitting.",
        "During training, it randomly disables a fraction of neurons in each iteration, preventing the network from relying too heavily on specific neurons.",
        "This encourages the network to learn more robust and generalized features.",
      ],
    },
    {
      heading: "Why is Dropout important in AI?",
      paragraphs: [
        "Dropout helps Neural Networks perform better on unseen data by reducing memorization of the training set.",
      ],
      bullets: [
        "Prevents overfitting.",
        "Improves generalization.",
        "Builds robust models.",
        "Works well with deep networks.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a team working on a project where different members are occasionally absent.",
        "The remaining team members must adapt and learn multiple responsibilities instead of depending on one person. Dropout trains Neural Networks in a similar way by temporarily removing neurons during learning.",
      ],
    },
    {
      heading: "Where is Dropout used?",
      paragraphs: [
        "Dropout is widely used in Deep Learning models with many layers.",
      ],
      bullets: [
        "Deep Neural Networks.",
        "Computer Vision.",
        "Natural Language Processing.",
        "Speech Recognition.",
        "Generative AI.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners apply Dropout during model evaluation, even though it should only be active during training.",
      ],
      bullets: [
        "Using Dropout during inference.",
        "Applying excessive dropout rates.",
        "Confusing it with Batch Normalization.",
        "Using Dropout in every layer unnecessarily.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Dropout randomly disables neurons during training, making Neural Networks more robust and less likely to overfit.",
      ],
      bullets: [
        "Randomly disables neurons.",
        "Prevents overfitting.",
        "Improves generalization.",
        "Training-only technique.",
        "Essential Deep Learning regularization method.",
      ],
    },
  ],
},
"activation-functions-dropout": {
  title: "Activation Functions",
  subtitle: "Introduce non-linearity so Neural Networks can learn complex patterns.",
  eyebrow: "Concept 3 of 3",
  accent: "purple",
  icon: Zap,
  sections: [
    {
      heading: "What are Activation Functions?",
      paragraphs: [
        "Activation Functions are mathematical functions applied to the output of each neuron in a Neural Network.",
        "They determine whether a neuron should pass information to the next layer by transforming its input into a meaningful output.",
        "Without activation functions, Neural Networks would behave like simple linear models and fail to learn complex relationships.",
      ],
    },
    {
      heading: "Why are Activation Functions important in AI?",
      paragraphs: [
        "Activation functions allow Deep Learning models to solve complex, non-linear problems that cannot be handled using simple linear equations.",
      ],
      bullets: [
        "Introduce non-linearity.",
        "Enable complex learning.",
        "Improve model performance.",
        "Support Deep Learning architectures.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a security gate that only opens when certain conditions are met.",
        "Similarly, an activation function decides whether a neuron's output should be passed to the next layer based on the input it receives.",
      ],
    },
    {
      heading: "Where are Activation Functions used?",
      paragraphs: [
        "Activation functions are used in every modern Neural Network architecture.",
      ],
      bullets: [
        "Image classification.",
        "Speech recognition.",
        "Language translation.",
        "Object detection.",
        "Generative AI.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners use the same activation function for every layer without considering the problem or network architecture.",
      ],
      bullets: [
        "Choosing inappropriate activation functions.",
        "Ignoring output layer requirements.",
        "Using Sigmoid everywhere.",
        "Not understanding vanishing gradients.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Activation functions give Neural Networks the ability to learn complex, non-linear relationships, making Deep Learning possible.",
      ],
      bullets: [
        "Adds non-linearity.",
        "Controls neuron output.",
        "Essential for Deep Learning.",
        "Improves learning capability.",
        "Common examples: ReLU, Sigmoid, Tanh, Softmax.",
      ],
    },
  ],
},
"loss-functions": {
  title: "Loss Functions",
  subtitle: "Measure how far a model's predictions are from the correct answers.",
  eyebrow: "Concept 1 of 4",
  accent: "blue",
  icon: Target,
  sections: [
    {
      heading: "What are Loss Functions?",
      paragraphs: [
        "A Loss Function is a mathematical function that measures the difference between a model's predicted output and the actual target value.",
        "It provides a numerical score representing how well or poorly the model is performing during training.",
        "The objective of training is to minimize this loss so the model can make more accurate predictions.",
      ],
    },
    {
      heading: "Why are Loss Functions important in AI?",
      paragraphs: [
        "Loss functions provide the feedback that tells a model whether its predictions are improving or getting worse.",
      ],
      bullets: [
        "Measures prediction error.",
        "Guides model learning.",
        "Works with Gradient Descent.",
        "Improves prediction accuracy.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Suppose a model predicts that a house costs ₹48 lakh, but its actual price is ₹50 lakh.",
        "The loss function calculates the error between these values. During training, the model adjusts its weights to reduce this error over time.",
      ],
    },
    {
      heading: "Where are Loss Functions used?",
      paragraphs: [
        "Loss functions are used whenever Machine Learning or Deep Learning models are trained.",
      ],
      bullets: [
        "Linear Regression.",
        "Neural Networks.",
        "Image classification.",
        "Language models.",
        "Speech recognition.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners choose the wrong loss function for their problem, leading to poor model performance.",
      ],
      bullets: [
        "Using regression loss for classification.",
        "Ignoring the output type.",
        "Confusing loss with accuracy.",
        "Optimizing the wrong objective.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Loss functions tell the model how wrong its predictions are, enabling it to learn by minimizing those errors.",
      ],
      bullets: [
        "Measures prediction error.",
        "Guides learning.",
        "Minimized during training.",
        "Essential for optimization.",
        "Foundation of model training.",
      ],
    },
  ],
},

"regularization": {
  title: "Regularization",
  subtitle: "Prevent overfitting so models perform well on unseen data.",
  eyebrow: "Concept 2 of 4",
  accent: "green",
  icon: Shield,
  sections: [
    {
      heading: "What is Regularization?",
      paragraphs: [
        "Regularization is a technique used to reduce overfitting by preventing a model from becoming unnecessarily complex.",
        "It adds a penalty to the loss function, encouraging the model to keep its weights smaller and simpler.",
        "Common regularization methods include L1 Regularization (Lasso) and L2 Regularization (Ridge).",
      ],
    },
    {
      heading: "Why is Regularization important in AI?",
      paragraphs: [
        "Regularization helps models generalize better by reducing their tendency to memorize the training data.",
      ],
      bullets: [
        "Reduces overfitting.",
        "Improves generalization.",
        "Simplifies models.",
        "Produces more reliable predictions.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a student who memorizes every answer instead of understanding the concepts.",
        "While they may perform well on practice questions, they'll struggle with new ones. Regularization encourages the model to learn general patterns instead of memorizing examples.",
      ],
    },
    {
      heading: "Where is Regularization used?",
      paragraphs: [
        "Regularization is widely used in Machine Learning and Deep Learning models.",
      ],
      bullets: [
        "Linear Regression.",
        "Logistic Regression.",
        "Neural Networks.",
        "Computer Vision.",
        "Natural Language Processing.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners apply too much regularization, causing the model to become overly simple and underfit the data.",
      ],
      bullets: [
        "Using excessive regularization.",
        "Ignoring underfitting.",
        "Choosing incorrect penalty values.",
        "Not validating performance.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Regularization controls model complexity so it learns meaningful patterns instead of memorizing the training data.",
      ],
      bullets: [
        "Prevents overfitting.",
        "Controls complexity.",
        "Improves generalization.",
        "Uses L1 and L2 penalties.",
        "Better real-world performance.",
      ],
    },
  ],
},
"batch-normalization": {
  title: "Batch Normalization",
  subtitle: "Normalize intermediate outputs to train Neural Networks faster and more reliably.",
  eyebrow: "Concept 3 of 4",
  accent: "purple",
  icon: Layers,
  sections: [
    {
      heading: "What is Batch Normalization?",
      paragraphs: [
        "Batch Normalization is a technique that normalizes the outputs of a layer before passing them to the next layer during training.",
        "By keeping the values within a stable range, it helps Neural Networks learn more efficiently and consistently.",
        "It also allows the use of higher learning rates, making training faster and often improving model performance.",
      ],
    },
    {
      heading: "Why is Batch Normalization important in AI?",
      paragraphs: [
        "Batch Normalization improves training stability and helps Deep Learning models converge more quickly.",
      ],
      bullets: [
        "Speeds up training.",
        "Stabilizes learning.",
        "Improves convergence.",
        "Reduces sensitivity to initialization.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine students entering a classroom with very different levels of preparation.",
        "A quick revision session brings everyone to a similar understanding before the lesson begins. Batch Normalization works similarly by standardizing data flowing through the network.",
      ],
    },
    {
      heading: "Where is Batch Normalization used?",
      paragraphs: [
        "Batch Normalization is commonly used in modern Deep Learning architectures.",
      ],
      bullets: [
        "Convolutional Neural Networks (CNNs).",
        "Deep Neural Networks.",
        "Image classification.",
        "Object detection.",
        "Generative AI.",
        "Speech recognition.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners assume Batch Normalization completely eliminates overfitting, even though other techniques like Dropout may still be needed.",
      ],
      bullets: [
        "Confusing normalization with regularization.",
        "Incorrect layer placement.",
        "Ignoring batch size effects.",
        "Expecting it to solve every training issue.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Batch Normalization keeps activations stable during training, helping Neural Networks learn faster and more effectively.",
      ],
      bullets: [
        "Normalizes activations.",
        "Speeds up training.",
        "Improves stability.",
        "Works with Deep Learning.",
        "Boosts convergence.",
      ],
    },
  ],
},

"dropout": {
  title: "Dropout",
  subtitle: "Reduce overfitting by temporarily disabling neurons during training.",
  eyebrow: "Concept 4 of 4",
  accent: "orange",
  icon: CircleOff,
  sections: [
    {
      heading: "What is Dropout?",
      paragraphs: [
        "Dropout is a regularization technique used in Neural Networks to reduce overfitting.",
        "During training, it randomly disables a fraction of neurons in each iteration, preventing the network from relying too heavily on specific neurons.",
        "This encourages the network to learn more robust and generalized features.",
      ],
    },
    {
      heading: "Why is Dropout important in AI?",
      paragraphs: [
        "Dropout helps Neural Networks perform better on unseen data by reducing memorization of the training set.",
      ],
      bullets: [
        "Prevents overfitting.",
        "Improves generalization.",
        "Builds robust models.",
        "Works well with deep networks.",
      ],
    },
    {
      heading: "Let's understand with an example",
      paragraphs: [
        "Imagine a team working on a project where different members are occasionally absent.",
        "The remaining team members must adapt and learn multiple responsibilities instead of depending on one person. Dropout trains Neural Networks in a similar way by temporarily removing neurons during learning.",
      ],
    },
    {
      heading: "Where is Dropout used?",
      paragraphs: [
        "Dropout is widely used in Deep Learning models with many layers.",
      ],
      bullets: [
        "Deep Neural Networks.",
        "Computer Vision.",
        "Natural Language Processing.",
        "Speech Recognition.",
        "Generative AI.",
        "Recommendation systems.",
      ],
    },
    {
      heading: "Common mistakes beginners make",
      paragraphs: [
        "Many beginners apply Dropout during model evaluation, even though it should only be active during training.",
      ],
      bullets: [
        "Using Dropout during inference.",
        "Applying excessive dropout rates.",
        "Confusing it with Batch Normalization.",
        "Using Dropout in every layer unnecessarily.",
      ],
    },
    {
      heading: "Key idea to remember",
      paragraphs: [
        "Dropout randomly disables neurons during training, making Neural Networks more robust and less likely to overfit.",
      ],
      bullets: [
        "Randomly disables neurons.",
        "Prevents overfitting.",
        "Improves generalization.",
        "Training-only technique.",
        "Essential Deep Learning regularization method.",
      ],
    },
  ],
},







};

/* ---------------------------- PAGE ---------------------------- */

export default function DynamicPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "";
  
  const content = contentMap[slug];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper to map abstract AI images based on keywords
  const getSectionImage = (slugStr: string, sectionHeading?: string) => {
    const text = (slugStr + " " + (sectionHeading || "")).toLowerCase();
    if (text.includes("human")|| text.includes("training")) return "/ai.png";
     if (text.includes("types")) return "/types.png";
       if (text.includes("machines")|| text.includes("examples")) return "/ex.png";
     if (text.includes("history") || text.includes("turn")) return "/hist.png";
 if (text.includes("car")) return "/car.png";
 if (text.includes("classification")) return "/car.png";
    if (text.includes("neuron") || text.includes("network") || text.includes("deep") || text.includes("brain") || text.includes("layer") || text.includes("percep")) return "/img_neuron.jpg";
    if (text.includes("data") || text.includes("math") || text.includes("learn") || text.includes("model") || text.includes("overfit") || text.includes("train") || text.includes("eval")) return "/img_data.jpg";
    if (text.includes("robot") || text.includes("ai") || text.includes("machine") || text.includes("agent") )return "/img_robot.jpg";
    if (text.includes("neuron") || text.includes("intelligence")) return "/we.png";
    return "/img_robot.jpg"; // Default fallback
  };

  if (!content) {
    return (
      <div className="topic-root">
         <div className="topic-container">
           <Link href="/" className="topic-back-btn">
              <ChevronLeft size={18} />
              Back to Curriculum
            </Link>
            <div className="glass-card" style={{ padding: "4rem", textAlign: "center" }}>
              <h1 className="topic-title">Topic Not Found</h1>
              <p className="topic-paragraph">This topic hasn't been added yet. Please select a valid topic.</p>
            </div>
         </div>
      </div>
    );
  }

  const Icon = content.icon;
  // ACCENTS is defined in the file
  const accent = ACCENTS[content.accent] || { color: '#0f172a', border: '#e2e8f0', soft: '#f8fafc' };
  const accentVars = {
    "--accent": accent.color,
    "--accent-border": accent.border,
    "--accent-soft": accent.soft,
  } as React.CSSProperties;

  const totalSlides = content.sections.length;
  const activeSection = content.sections[currentSlide];

  const nextSlide = () => setCurrentSlide(p => Math.min(p + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide(p => Math.max(p - 1, 0));

  return (
    <div className="topic-root" style={accentVars}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600;700&display=swap');
        ${STYLES}
      `}</style>
      
      {/* Dynamic Animated Glassmorphism Background */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      
      <div className="topic-container">
        <Link href="/" className="topic-back-btn">
          <ChevronLeft size={18} />
          Back to Curriculum
        </Link>

        <div className="topic-header">
          <div className="topic-icon">
            <Icon size={30} />
          </div>
          <p className="topic-eyebrow">{content.eyebrow}</p>
          <h1 className="topic-title">{content.title}</h1>
          <p className="topic-subtitle">{content.subtitle}</p>
        </div>

        <div className="glass-card">
          <div className="slide-content">
            <div className="slide-text">
              <div className="slide-badge">Step {currentSlide + 1} of {totalSlides}</div>
              {activeSection.heading && (
                <h2 className="topic-section-heading">{activeSection.heading}</h2>
              )}
              {activeSection.paragraphs?.map((p, pi) => (
                <p key={pi} className="topic-paragraph">{p}</p>
              ))}
              {activeSection.bullets && (
                <ul className="topic-bullets">
                  {activeSection.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="slide-visual">
              <img src={getSectionImage(slug, activeSection.heading)} alt={activeSection.heading || "Visual"} className="visual-img" />
            </div>
          </div>

          <div className="slide-controls">
            <button className="control-btn" onClick={prevSlide} disabled={currentSlide === 0}>
              <ChevronLeft size={18} /> Previous
            </button>
            <div className="progress-dots">
              {content.sections.map((_, i) => (
                <div key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
              ))}
            </div>
            <button className="control-btn primary" onClick={nextSlide} disabled={currentSlide === totalSlides - 1}>
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
