"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Lightbulb, Zap, Globe, History, Layers } from "lucide-react";

const colors = {
    bg: "#FFF7E3",
    bgSoft: "#FFEFC8",
    card: "#FFFFFF",
    cardAlt: "#F6F1FF",
    border: "#FFD866",
    borderSoft: "#FFE9A8",
    gold: "#F5A623",
    goldDeep: "#E2860A",
    goldDeepest: "#B96A05",
    coral: "#FF7A59",
    coralDeep: "#E85A38",
    purple: "#A855F7",
    purpleDeep: "#8B34E0",
    teal: "#2FB6A3",
    tealDeep: "#1F9585",
    ink: "#3A2E1E",
    inkSoft: "#5A4B34",
    muted: "#8A7A5C",
};

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
  
  .topic-container { max-width: 760px; margin: 0 auto; }
  
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
    gap: 12px;
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
    border: 2.5px solid ${colors.border};
    box-shadow: 0 6px 0 ${colors.border};
    color: ${colors.goldDeep};
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
  }
  
  .topic-card {
    border-radius: 28px;
    padding: 32px;
    background: ${colors.card};
    border: 3px solid ${colors.border};
    box-shadow: 0 10px 0 ${colors.borderSoft};
    margin-bottom: 24px;
  }
  
  .topic-content {
    font-size: 15px;
    color: ${colors.ink};
    line-height: 1.8;
    margin: 0;
  }
  .topic-content strong {
    color: ${colors.goldDeep};
    font-weight: 700;
  }
  .topic-content ul {
    list-style: none;
    padding: 0;
    margin: 16px 0;
  }
  .topic-content li {
    padding: 8px 0 8px 24px;
    position: relative;
  }
  .topic-content li:before {
    content: "▸";
    position: absolute;
    left: 0;
    color: ${colors.gold};
    font-weight: bold;
  }
  
  .topic-nav {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 2px solid ${colors.borderSoft};
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
  }
`;

const topicIcons = {
    "what-is-intelligence": Lightbulb,
    "ai-vs-human-intelligence": Zap,
    "ai-around-us": Globe,
    "history-of-ai": History,
    "types-of-ai": Layers,
};

const contentMap = {
    "what-is-intelligence": {
        title: "What is Intelligence?",
        subtitle: "Understanding the foundation",
        content: `Intelligence is the ability to acquire, understand, and apply knowledge. It involves reasoning, learning from experience, problem-solving, and adapting to new situations.

            Key aspects of intelligence:
            • Cognitive abilities
            • Learning capacity
            • Problem-solving skills
            • Reasoning and logic
            • Creativity and innovation
            • Emotional understanding
            • Adaptability to change`,
    },
    "ai-vs-human-intelligence": {
        title: "AI vs Human Intelligence",
        subtitle: "Comparing two forms of intelligence",
        content: `Human intelligence and artificial intelligence both have unique strengths and limitations.
        Human Intelligence:
        • Emotional understanding and empathy
        • Creative and abstract thinking
        • Common sense reasoning
        • Flexible adaptation to novelty
        • Conscious awareness
        • Learning from few examples

        Artificial Intelligence:
        • Lightning-fast computation
        • Perfect memory and recall
        • Handling massive datasets
        • Consistency and zero fatigue
        • Scalability across tasks
        • Pattern recognition at scale`,
    },
    "ai-around-us": {
        title: "AI Around Us",
        subtitle: "Discovering AI in daily life",
        content: `Artificial intelligence is embedded in the technology we use every single day.

        Common applications:
        • Smartphones: Voice assistants, face recognition, predictive text
        • Social Media: Content recommendations, feed curation
        • Shopping: Product suggestions, price optimization
        • Navigation: GPS routing, traffic prediction
        • Healthcare: Diagnosis assistance, drug discovery
        • Entertainment: Movie and music recommendations
        • Home Automation: Smart devices, energy management
        • Banking: Fraud detection, credit scoring
        • Search Engines: Ranking and understanding queries`,
    },
    "history-of-ai": {
        title: "History of AI",
        subtitle: "The journey of artificial intelligence",
        content: `The field of artificial intelligence has evolved through cycles of optimism and challenges.

Key Milestones:
• 1950s: Birth of AI - Alan Turing's foundational work
• 1956: Dartmouth Conference - Official founding as an academic field
• 1970s-80s: AI Winter - Limited progress due to high expectations
• 1980s-90s: Expert Systems - Rule-based systems gained popularity
• 2000s: Machine Learning Rise - Data-driven approaches emerged
• 2012: Deep Learning Revolution - Neural networks proved highly effective
• 2017: Transformer Architecture - Foundation for modern LLMs
• 2023+: Generative AI Era - ChatGPT and large language models`,
    },
    "types-of-ai": {
        title: "Types of AI",
        subtitle: "Categorizing artificial intelligence",
        content: `AI can be categorized in multiple meaningful ways.

By Capability Level:
• Narrow AI (Weak AI): Designed for specific, well-defined tasks
• General AI (Strong AI): Can perform any intellectual task
• Super AI (ASI): Hypothetical AI surpassing human intelligence

By Technology:
• Symbolic AI: Rule-based, logic-driven systems
• Machine Learning: Data-driven learning algorithms
• Deep Learning: Neural networks with many layers
• Reinforcement Learning: Learning through interaction

By Autonomy:
• Reactive: No memory, responds directly to inputs
• Limited Memory: Uses historical data for decisions
• Theory of Mind: Understands emotions and beliefs
• Self-aware: Hypothetical conscious AI systems`,
    },
};

export default function DynamicPage() {
    const params = useParams();
    const slug = params?.slug;

    const content = contentMap[slug] || {
        title: "Page Not Found",
        subtitle: "Topic not found",
        content: "This topic hasn't been added yet. Please go back and select a topic from the curriculum.",
    };

    const IconComponent = topicIcons[slug] || Lightbulb;

    return (
        <div className="topic-root">
            <style>{STYLES}</style>
            <div className="topic-container">
                {/* Back Button */}
                <Link href="/" className="topic-back-btn">
                    <ChevronLeft size={18} />
                    Back to Curriculum
                </Link>

                {/* Header */}
                <div className="topic-header">
                    <div className="topic-icon">
                        <IconComponent size={32} />
                    </div>
                    <h1 className="topic-title">{content.title}</h1>
                    <p className="topic-subtitle">{content.subtitle}</p>
                </div>

                {/* Content Card */}
                <div className="topic-card">
                    <div
                        className="topic-content"
                        dangerouslySetInnerHTML={{
                            __html: content.content
                                .split("\n")
                                .map((line) => {
                                    if (line.startsWith("•")) {
                                        return `<li>${line.slice(1).trim()}</li>`;
                                    }
                                    if (line.trim() && !line.startsWith("•")) {
                                        const prev = content.content
                                            .split("\n")
                                            .indexOf(line) - 1;
                                        if (prev >= 0 && content.content.split("\n")[prev].startsWith("•")) {
                                            return `<ul>${content.content
                                                .split("\n")
                                                .filter((l) => l.startsWith("•"))
                                                .map((l) => `<li>${l.slice(1).trim()}</li>`)
                                                .join("")}</ul><p>${line}</p>`;
                                        }
                                        return `<p>${line}</p>`;
                                    }
                                    return "";
                                })
                                .join("")
                                .replace(/<\/ul><p>/g, "</ul><p>"),
                        }}
                    />
                </div>

                {/* Topic Navigation */}
                <div className="topic-nav">
                    <div className="topic-nav-label">Explore Other Topics</div>
                    <div className="topic-nav-grid">
                        {Object.keys(contentMap).map((topic) => (
                            <Link
                                key={topic}
                                href={`/${topic}`}
                                className={`topic-nav-btn ${slug === topic ? "active" : ""}`}
                            >
                                {topic.replace(/-/g, " ").split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
