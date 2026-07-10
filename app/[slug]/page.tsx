"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Users,
  Globe,
  Clock,
  Layers,
  FlaskConical,
  BookOpen,
  Cpu,
  Table2,
  Sparkles,
  Eye,
  Car,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  Braces,
  Bot,
  ShieldCheck,
  Code2,
  GitBranch,
  Boxes,
  Database,
  Music,
  Sigma,
  Network,
  Workflow,
  Brain,
  BrainCircuit,
  ScanFace,
  Binary,
  BarChart3,
  Rocket,
  Scale,
  GraduationCap,
  PieChart,
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

type AccentKey = "teal" | "coral" | "gold" | "purple";

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
 
}

/* ---------------------------- STYLES ---------------------------- */

const STYLES = `
  .topic-root {
    min-height: 100vh;
    width: 100%;
    padding: 32px 16px;
    background: radial-gradient(circle at 20% -10%, ${colors.bgSoft} 0%, ${colors.bg} 55%);
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
  }
  .topic-root * { box-sizing: border-box; }
  .topic-root button { font-family: inherit; border: none; background: none; cursor: pointer; }
  @media (prefers-reduced-motion: reduce) {
    .topic-root * { transition: none !important; animation: none !important; }
  }

  .topic-container { max-width: 1060px; margin: 0 auto; }

  .topic-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    margin-bottom: 24px;
    border-radius: 999px;
    background: ${colors.card};
    border: 2px solid ${colors.borderSoft};
    color: ${colors.ink};
    font-weight: 700;
    font-size: 14px;
    transition: all 0.2s ease;
    text-decoration: none;
    cursor: pointer;
  }
  .topic-back-btn:hover {
    background: ${colors.borderSoft};
    transform: translateX(-2px);
  }

  .topic-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  .topic-icon {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.card};
    border: 2.5px solid var(--accent-border);
    box-shadow: 0 6px 0 var(--accent-border);
    color: var(--accent);
  }
  .topic-eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0;
  }
  .topic-title {
    font-family: 'Baloo 2', sans-serif;
    font-weight: 800;
    font-size: 32px;
    margin: 0;
    color: ${colors.goldDeep};
    line-height: 1.2;
  }
  .topic-subtitle {
    font-size: 15px;
    color: ${colors.muted};
    margin: 0;
    max-width: 480px;
  }

  .topic-card {
    border-radius: 28px;
    padding: 32px;
    background: ${colors.card};
    border: 3px solid ${colors.border};
    box-shadow: 0 10px 0 ${colors.borderSoft};
    margin-bottom: 20px;
  }

  .topic-section + .topic-section {
    margin-top: 22px;
    padding-top: 22px;
    border-top: 1px dashed ${colors.borderSoft};
  }

  .topic-section-heading {
    font-family: 'Baloo 2', sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: var(--accent);
    margin: 0 0 10px 0;
  }

  .topic-paragraph {
    font-size: 15px;
    color: ${colors.ink};
    line-height: 1.75;
    margin: 0 0 12px 0;
  }
  .topic-paragraph:last-child { margin-bottom: 0; }

  .topic-bullets {
    list-style: none;
    padding: 0;
    margin: 10px 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .topic-bullets li {
    padding: 10px 14px;
    border-radius: 14px;
    background: ${colors.cardAlt};
    border: 2px solid ${colors.borderSoft};
    font-size: 14px;
    color: ${colors.ink};
    line-height: 1.5;
    position: relative;
    padding-left: 30px;
  }
  .topic-bullets li:before {
    content: "▸";
    position: absolute;
    left: 12px;
    color: var(--accent);
    font-weight: bold;
  }

  .topic-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    border-radius: 22px;
    padding: 20px 24px;
    background: linear-gradient(135deg, var(--accent-soft) 0%, ${colors.card} 70%);
    border: 2px solid var(--accent-border);
    margin-bottom: 24px;
  }
  .topic-cta-text {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .topic-cta-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.card};
    border: 2px solid var(--accent-border);
    color: var(--accent);
  }
  .topic-cta-title {
    font-family: 'Baloo 2', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: ${colors.ink};
    margin: 0 0 2px 0;
  }
  .topic-cta-desc {
    font-size: 12.5px;
    color: ${colors.muted};
    margin: 0;
  }
  .topic-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 20px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    color: ${colors.ink};
    background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%);
    box-shadow: 0 5px 0 ${colors.goldDeep};
    text-decoration: none;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    white-space: nowrap;
  }
  .topic-cta-btn:hover { transform: translateY(-1px); }
  .topic-cta-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 ${colors.goldDeep}; }

  .topic-nav {
    margin-top: 8px;
  }
  .topic-nav-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.teal};
    margin-bottom: 12px;
  }
  .topic-nav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }
  .topic-nav-btn {
    padding: 14px 12px;
    border-radius: 16px;
    background: ${colors.cardAlt};
    border: 2px solid ${colors.borderSoft};
    font-size: 13px;
    font-weight: 700;
    color: ${colors.ink};
    transition: all 0.2s ease;
    text-decoration: none;
    display: block;
    text-align: center;
  }
  .topic-nav-btn:hover {
    background: ${colors.borderSoft};
    transform: translateY(-2px);
    box-shadow: 0 4px 0 ${colors.borderSoft};
  }
  .topic-nav-btn.active {
    background: linear-gradient(180deg, #FFD98A 0%, ${colors.gold} 100%);
    border-color: ${colors.border};
    color: ${colors.ink};
  }

  @media (max-width: 640px) {
    .topic-root { padding: 24px 16px; }
    .topic-card { padding: 20px; }
    .topic-title { font-size: 26px; }
    .topic-cta { flex-direction: column; align-items: stretch; text-align: left; }
    .topic-cta-btn { justify-content: center; }
  }
`;

/* ---------------------------- ACCENT PALETTE ---------------------------- */

const ACCENTS: Record<AccentKey, { color: string; border: string; soft: string }> = {
  teal: { color: colors.teal, border: "#BEEBE2", soft: "#E7F9F5" },
  coral: { color: colors.coral, border: "#FFD4C4", soft: "#FFF0E9" },
  gold: { color: colors.goldDeep, border: colors.border, soft: colors.bgSoft },
  purple: { color: colors.purple, border: "#E7D3FC", soft: colors.cardAlt },
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
        "1997 — IBM's Deep Blue defeated the world chess champion, showing that computers could solve very complex problems.",
        "2011 — IBM Watson won the quiz show Jeopardy!, proving that AI could understand and answer questions written in human language.",
        "2016 — AlphaGo defeated a world champion in the game of Go, a game that many people believed was too difficult for computers because it required planning and strategy.",
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
    subtitle: "The brain cell that inspired the artificial version — the very first step in this chain.",
    eyebrow: "Concept 2 of 8",
    accent: "coral",
    icon: Brain,
    sections: [
      {
        heading: "How a real neuron behaves",
        paragraphs: [
          "A biological neuron receives electrical signals from other neurons through its dendrites, combines them, and — only if the combined signal is strong enough — fires its own signal onward through its axon to the next neuron.",
        ],
      },
      {
        heading: "The idea worth borrowing",
        bullets: [
          "Many small inputs get combined into one",
          "A firing decision only happens past a certain threshold",
          "Millions of these simple units, connected together, produce complex behaviour",
        ],
      },
    ],
    handsOnPrompt:
      "In the lab, you'll see a simplified animation of signals combining and firing in a biological neuron.",
  },

  "artificial-neuron": {
    title: "Artificial Neuron",
    subtitle: "The same 'combine and fire' idea, rebuilt with numbers instead of chemistry.",
    eyebrow: "Concept 3 of 8",
    accent: "gold",
    icon: Cpu,
    sections: [
      {
        heading: "Weighted inputs, summed together",
        paragraphs: [
          "An artificial neuron takes several numeric inputs, multiplies each by a 'weight' showing how important it is, adds them all up, and passes that sum onward — a direct numerical stand-in for a biological neuron combining signals.",
        ],
      },
      {
        heading: "What the weights actually are",
        paragraphs: [
          "The weights are exactly what gets adjusted during training. Learning, at this level, is nothing more than repeatedly tweaking these weights until the neuron's output gets closer to what's wanted.",
        ],
      },
    ],
    handsOnPrompt:
      "In the lab, you'll manually change a few weights and see how the neuron's combined output shifts.",
  },

  perceptron: {
    title: "Perceptron",
    subtitle: "The original, simplest artificial neuron — a single yes/no decision maker.",
    eyebrow: "Concept 4 of 8",
    accent: "purple",
    icon: Binary,
    sections: [
      {
        heading: "One neuron, one decision",
        paragraphs: [
          "A perceptron is a single artificial neuron that makes a simple binary decision — sums its weighted inputs and outputs one of two results, like 'approve' or 'reject' — based on whether that sum crosses a threshold.",
        ],
      },
      {
        heading: "Its famous limitation",
        paragraphs: [
          "A single perceptron can only draw a straight dividing line between two categories. Many real problems aren't separable by a straight line at all, which is exactly the gap the next concept, non-linearity, was needed to close.",
        ],
      },
    ],
    handsOnPrompt:
      "In the lab, you'll try to use a single perceptron to separate two groups of points, and see where a straight line simply isn't enough.",
  },

  "need-for-non-linearity": {
    title: "Need for Non-Linearity",
    subtitle: "Why real-world patterns almost never fit a straight line.",
    eyebrow: "Concept 5 of 8",
    accent: "teal",
    icon: Workflow,
    sections: [
      {
        heading: "The problem with only straight lines",
        paragraphs: [
          "Stack as many straight-line neurons as you like — without something extra, the whole network still only draws straight lines. Most real patterns, like separating a spiral of two colours, simply can't be captured that way.",
        ],
      },
      {
        heading: "The fix: bend the line",
        paragraphs: [
          "By inserting a small non-linear step after each neuron's weighted sum, the network gains the ability to bend, curve, and combine those bends into extremely complex shapes — enough to capture almost any pattern in data.",
        ],
      },
    ],
    handsOnPrompt:
      "In the lab, you'll compare a straight decision boundary to a curved one on the same tricky dataset.",
  },

  "activation-functions": {
    title: "Activation Functions",
    subtitle: "The small non-linear step that gives neural networks their real power.",
    eyebrow: "Concept 6 of 8",
    accent: "coral",
    icon: Sigma,
    sections: [
      {
        heading: "The bend, made concrete",
        paragraphs: [
          "An activation function takes a neuron's weighted sum and reshapes it — deciding how strongly, if at all, the neuron 'fires' onward. This is exactly the non-linear step the previous concept called for.",
        ],
      },
      {
        heading: "A few common ones",
        bullets: [
          "ReLU — passes positive values through unchanged, blocks negative values to zero",
          "Sigmoid — squashes any value into a smooth range between 0 and 1",
          "Without any activation function at all, a deep network mathematically collapses back into one straight line",
        ],
      },
    ],
    handsOnPrompt:
      "In the lab, you'll feed the same numbers through a few different activation functions and compare the shapes they produce.",
  },

  layers: {
    title: "Layers",
    subtitle: "Stacking neurons into stages so a network can build up complexity.",
    eyebrow: "Concept 7 of 8",
    accent: "gold",
    icon: Layers,
    sections: [
      {
        heading: "Input, hidden, and output",
        bullets: [
          "Input layer — where the raw data first enters the network",
          "Hidden layers — where the actual pattern-building happens, one stage at a time",
          "Output layer — produces the network's final prediction",
        ],
      },
      {
        heading: "Why more layers can help",
        paragraphs: [
          "Early hidden layers tend to pick up simple patterns, and later hidden layers combine those simple patterns into increasingly complex ones — like edges combining into shapes, and shapes combining into whole objects.",
        ],
      },
    ],
    handsOnPrompt:
      "In the lab, you'll add and remove hidden layers and watch how the network's decision boundary changes shape.",
  },

  "forward-propagation": {
    title: "Forward Propagation",
    subtitle: "The journey data takes from raw input to final prediction.",
    eyebrow: "Concept 8 of 8",
    accent: "purple",
    icon: Workflow,
    sections: [
      {
        heading: "One direction, layer by layer",
        paragraphs: [
          "Forward propagation is simply the process of pushing an input all the way through every layer of the network, in order, until it produces a final output — no looping back, just one forward pass.",
        ],
      },
      {
        heading: "Putting the whole module together",
        bullets: [
          "Input layer receives the raw data",
          "Each hidden layer computes weighted sums and applies its activation function",
          "The output layer produces the final prediction, ready to be compared against the correct answer during training",
        ],
      },
    ],
  },

  /* ===================== LEVEL 2 · MODULE 5: Deep Learning ===================== */

  cnn: {
    title: "CNN (Convolutional Neural Network)",
    subtitle: "The neural network architecture built specifically to understand images.",
    eyebrow: "Concept 1 of 4",
    accent: "teal",
    icon: ImageIcon,
    sections: [
      {
        heading: "Scanning for local patterns",
        paragraphs: [
          "Instead of looking at an entire image at once, a CNN slides small filters across it, each one learning to detect a specific local pattern — an edge, a curve, a texture — wherever it appears in the picture.",
        ],
      },
      {
        heading: "Why this suits images so well",
        bullets: [
          "The same filter can detect an edge whether it's in the top-left or bottom-right of the image",
          "Early layers detect simple patterns; later layers combine them into full objects",
          "This is the backbone behind face recognition, image classification, and self-driving perception",
        ],
      },
    ],
  },

  rnn: {
    title: "RNN (Recurrent Neural Network)",
    subtitle: "The architecture built to remember what came before in a sequence.",
    eyebrow: "Concept 2 of 4",
    accent: "coral",
    icon: Workflow,
    sections: [
      {
        heading: "A memory that carries forward",
        paragraphs: [
          "An RNN processes a sequence one step at a time — one word, one time-step of a sensor reading — and carries a running memory forward, so each new step is understood in the context of everything before it.",
        ],
      },
      {
        heading: "Where sequence order actually matters",
        bullets: [
          "Predicting the next word in a sentence",
          "Forecasting tomorrow's stock price from recent days",
          "Recognising speech, where sound only makes sense in order",
        ],
      },
    ],
  },

  lstm: {
    title: "LSTM (Long Short-Term Memory)",
    subtitle: "An upgraded RNN built to remember things over much longer sequences.",
    eyebrow: "Concept 3 of 4",
    accent: "gold",
    icon: Brain,
    sections: [
      {
        heading: "The problem plain RNNs ran into",
        paragraphs: [
          "A basic RNN's memory fades quickly — by the time it reaches word 50 of a paragraph, it's often forgotten what happened at word 2. LSTMs were designed specifically to fix this.",
        ],
      },
      {
        heading: "How it holds on longer",
        bullets: [
          "A dedicated memory cell that can preserve information across many steps",
          "'Gates' that learn what to keep, what to forget, and what to pass onward",
          "This let models handle far longer sentences and sequences reliably",
        ],
      },
    ],

  },

  "transformers-introduction": {
    title: "Transformers (Introduction)",
    subtitle: "The architecture that replaced RNNs and now powers most modern AI.",
    eyebrow: "Concept 4 of 4",
    accent: "purple",
    icon: Sparkles,
    sections: [
      {
        heading: "Looking at the whole sequence at once",
        paragraphs: [
          "Instead of processing one step at a time like an RNN, a transformer looks at an entire sequence simultaneously and uses a mechanism called attention to decide which other words matter most for understanding each word.",
        ],
      },
      {
        heading: "Why this was such a big leap",
        bullets: [
          "Much faster to train, since steps don't have to happen strictly one after another",
          "Attention lets the model connect distant words directly — 'it' can link straight back to a noun many sentences earlier",
          "This is the architecture underneath GPT, and most other modern large language models",
        ],
      },
    ],
    handsOnPrompt:
      "In the lab, you'll highlight which words in a sentence a model's attention would likely focus on to understand one specific word.",
  },
};

/* ---------------------------- PAGE ---------------------------- */

export default function DynamicPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "";

  const content = contentMap[slug];

  if (!content) {
    return (
      <div className="topic-root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
          ${STYLES}
        `}</style>
        <div className="topic-container" style={{ "--accent": colors.goldDeep, "--accent-border": colors.border, "--accent-soft": colors.bgSoft } as React.CSSProperties}>
          <Link href="/" className="topic-back-btn">
            <ChevronLeft size={18} />
            Back to Curriculum
          </Link>
          <div className="topic-card" style={{ textAlign: "center" }}>
            <h1 className="topic-title" style={{ marginBottom: 8 }}>Topic Not Found</h1>
            <p className="topic-paragraph">
              This topic hasn't been added yet. Please go back and select a topic from the curriculum.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const Icon = content.icon;
  const accent = ACCENTS[content.accent];
  const accentVars = {
    "--accent": accent.color,
    "--accent-border": accent.border,
    "--accent-soft": accent.soft,
  } as React.CSSProperties;

  return (
    <div className="topic-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
        ${STYLES}
      `}</style>
      <div className="topic-container" style={accentVars}>
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

        <div className="topic-card">
          {content.sections.map((section, i) => (
            <div key={i} className="topic-section">
              {section.heading && (
                <h2 className="topic-section-heading">{section.heading}</h2>
              )}
              {section.paragraphs?.map((p, pi) => (
                <p key={pi} className="topic-paragraph">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="topic-bullets">
                  {section.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
          </div>
        </div>
    
  );
}