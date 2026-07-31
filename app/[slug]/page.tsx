"use client";

import React, { useState } from "react";
import NextImage from 'next/image';
import { useParams, useRouter } from "next/navigation";
import data from '../data'
import dataCss from '../data.css'
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  FunctionSquare,
  RefreshCcw,
  Camera,
  Users,
  Activity,
  Server,
  Container,
  Trees,
  Globe,
  Grid,
  Clock,
  Layers,
  UsersRound,
  Plug,
ArrowRight,
Axe,
Scissors,
  FileWarning,
  Search,
  Shield,
  Trophy,
  Group,
  ScanSearch,
  Tags,
  Package,
Calculator,
Layers3,
Table,
Radar,
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
FileStack, 
Wrench,
  BookOpen,
  Cpu,
  Table2,
  Sparkles,
  Compass,
  Car,
  Image,
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
  TimerReset,
} 
from "lucide-react";
import {
  findTopicLocation,
  topicKey,
  PROGRESS_STORAGE_KEY,
} from "../page";

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

type AccentKey = "teal" | "coral" | "gold" | "purple" | "red" | "blue" | "green" | "orange" | "emerald" | "indigo" | "cyan" | "pink" | "rose" | "violet" | "amber";

interface Section {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface TopicContent {
  title: string;
  subtitle: string;
  eyebrow: string;
  accent: AccentKey | string;
  icon: typeof Lightbulb;
  sections: Section[];
  handsOnPrompt?: string;
}

/* ---------------------------- STYLES ---------------------------- */

const STYLES =dataCss;
/* ---------------------------- ACCENT PALETTE ---------------------------- */

const ACCENTS: Record<AccentKey, { color: string; border: string; soft: string }> = {
  teal: { color: colors.teal, border: "#BEEBE2", soft: "#E7F9F5" },
  coral: { color: colors.coral, border: "#FFD4C4", soft: "#FFF0E9" },
  gold: { color: colors.goldDeep, border: colors.border, soft: colors.bgSoft },
  purple: { color: colors.purple, border: "#E7D3FC", soft: colors.cardAlt },
  blue: { color: "#3B82F6", border: "#BFDBFE", soft: "#EFF6FF" },
  green: { color: "#22C55E", border: "#D1FAE5", soft: "#ECFDF5" },
   orange: { color: "#F97316", border: "#FED7AA", soft: "#FFF7ED" },
   red: { color: "#EF4444", border: "  #FECACA", soft: "#FEF2F2" },
   indigo:  { color: "#6366F1", border: "#C7D2FE", soft: "#EEF2FF" },
  emerald: { color: "#10B981", border: "#A7F3D0", soft: "#ECFDF5" },
  cyan:    { color: "#06B6D4", border: "#A5F3FC", soft: "#ECFEFF" },
  pink:    { color: "#EC4899", border: "#FBCFE8", soft: "#FFF1F2" },
  amber:   { color: "#F59E0B", border: "#FDE68A", soft: "#FFFBEB" },
  violet:  { color: "#8B5CF6", border: "#DDD6FE", soft: "#F5F3FF" },
  rose:    { color: "#F43F5E", border: "#FECDD3", soft: "#FFF1F2" },

};


const contentMap: Record<string, TopicContent> =data;

/* ---------------------------- PAGE ---------------------------- */

export default function DynamicPage() {
  const params = useParams();
  const router = useRouter();
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
              <p className="topic-paragraph">This topic hasn`t been added yet. Please select a valid topic.</p>
            </div>
         </div>
      </div>
    );
  }

  const Icon = content.icon;
  // ACCENTS is defined in the file
  const accent = ACCENTS[content.accent as keyof typeof ACCENTS] || { color: '#0f172a', border: '#e2e8f0', soft: '#f8fafc' };
  const accentVars = {
    "--accent": accent.color,
    "--accent-border": accent.border,
    "--accent-soft": accent.soft,
  } as React.CSSProperties;

  const totalSlides = content.sections.length;
  const activeSection = content.sections[currentSlide];
const isLastSlide = currentSlide === totalSlides - 1;
 const prevSlide = () => setCurrentSlide(p => Math.max(p - 1, 0));
 
  const finishTopic = () => {
    try {
      const location = findTopicLocation(slug);
      if (location) {
        const key = topicKey(
          location.levelIndex,
          location.moduleIndex,
          location.topicIndex,
        );
        const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
        const parsed: string[] = stored ? JSON.parse(stored) : [];
        if (!parsed.includes(key)) {
          parsed.push(key);
          window.localStorage.setItem(
            PROGRESS_STORAGE_KEY,
            JSON.stringify(parsed),
          );
        }
      }
    } catch {
      // ignore storage errors, still let the user navigate back
    }
    router.push("/");
  };

  // CHANGED — nextSlide now finishes the topic on the last slide
  // instead of doing nothing (button used to just be disabled there).
  const nextSlide = () => {
    if (isLastSlide) {
      finishTopic();
    } else {
      setCurrentSlide(p => Math.min(p + 1, totalSlides - 1));
    }
  };



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
              <NextImage src={getSectionImage(slug, activeSection.heading)} alt={activeSection.heading || "Visual"} className="visual-img" width={600} height={360} />
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
            <button className="control-btn primary" onClick={nextSlide}>
              {isLastSlide ? (
                <>Finish & Unlock Next <ChevronRight size={18} /></>
              ) : (
                <>Next <ChevronRight size={18} /></>
              )}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
