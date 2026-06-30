"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain, Sparkles, Database, Search, RefreshCw, GitCompare, History, Network,
  TrendingUp, ThumbsUp, ListTodo, ShieldAlert, FileSpreadsheet, Users, Share2,
  Settings, ArrowRight, Check, Play, ChevronDown, MessageSquare, Info, Shield,
  Layers, Zap, Cpu, Terminal, ArrowUpRight, CheckCircle2, ChevronRight, Globe, Lock
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  // 3D Card Tilt state and reference
  const heroCardRef = useRef<HTMLDivElement>(null);
  const [heroTiltStyle, setHeroTiltStyle] = useState({
    transform: 'perspective(1200px) rotateX(10deg) rotateY(-12deg) rotateZ(1deg)'
  });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Smooth 3D tilt calculation
    const rX = -(y / (rect.height / 2)) * 14;
    const rY = (x / (rect.width / 2)) * 14;

    setHeroTiltStyle({
      transform: `perspective(1200px) rotateX(${rX}deg) rotateY(${rY}deg) rotateZ(1deg) scale3d(1.02, 1.02, 1.02)`
    });
  };

  const handleHeroMouseLeave = () => {
    setHeroTiltStyle({
      transform: 'perspective(1200px) rotateX(10deg) rotateY(-12deg) rotateZ(1deg) scale3d(1, 1, 1)'
    });
  };

  // State for interactive timeline
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  // State for product showcase dashboard tab
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('insights');

  // State for pricing monthly/annual billing
  const [isAnnual, setIsAnnual] = useState(false);

  // State for FAQ accordion toggles
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // State for architecture highlight
  const [activeArchStep, setActiveArchStep] = useState<string | null>(null);

  // Particle list for animated right side hero
  const [heroParticles, setHeroParticles] = useState<Array<{ id: number, x: number, y: number, size: number, pulse: boolean }>>([]);

  // Generate random coordinates for floating particle nodes in Hero section
  useEffect(() => {
    const list = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 85 + 5, // percentage
      y: Math.random() * 85 + 5,
      size: Math.random() * 8 + 4,
      pulse: Math.random() > 0.5
    }));
    setHeroParticles(list);
  }, []);

  const timelineSteps = [
    { title: "Ingest", desc: "Connect Slack, Discord, Gmail, Zendesk, or custom API endpoints. RevoxA hooks stream feedback signals instantly.", icon: Share2, detail: "Ingested 1,240 records in the last hour" },
    { title: "Store", desc: "Feedback text is chunked, cleaned, and embedded into high-dimensional vectors (384-D) for instant query matching.", icon: Database, detail: "Stored with 99.99% vector sync integrity" },
    { title: "Recall", desc: "When the user or agent prompts, RevoxA queries the vector base to retrieve relevant context items instantly.", icon: Search, detail: "Recall speed: 18ms latency average" },
    { title: "Reflect", desc: "Background processes autonomously review ingested feedback, finding recurring themes and consolidating patterns.", icon: RefreshCw, detail: "Reflections ran: 12 times today" },
    { title: "Reason", desc: "The reasoning engine validates context relevance against mental models to eliminate hallucination vectors.", icon: Cpu, detail: "Groq Llama-3-OSS reasoning confidence: 96.4%" },
    { title: "Evolve", desc: "System refines existing knowledge clusters, resolving stale concepts as user feedback evolves.", icon: History, detail: "Mental models evolved: 4 active updates" },
    { title: "Generate", desc: "Outputs real-time insights, prioritizes features, lists bugs, and designs user recommendation flows.", icon: Sparkles, detail: "15 product insights generated" }
  ];

  const showcaseTabs = [
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'growth', label: 'Memory Growth', icon: Database },
    { id: 'recall', label: 'Recall Search', icon: Search },
    { id: 'metrics', label: 'Telemetry Metrics', icon: TrendingUp },
    { id: 'analysis', label: 'Trend Analysis', icon: ShieldAlert }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      desc: "For individual builders and developers testing AI agent memory.",
      price: { monthly: 0, annual: 0 },
      features: [
        "Up to 10,000 memory vectors",
        "5 external API integrations",
        "Standard search recall (50ms)",
        "Daily automated reflections",
        "Basic insights dashboard",
        "Community support channel"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Professional",
      desc: "For growing teams building Production AI SaaS platforms.",
      price: { monthly: 79, annual: 59 },
      features: [
        "Up to 1,000,000 memory vectors",
        "Unlimited API integrations",
        "Sub-15ms ultra-low latency recall",
        "Real-time autonomous reflections",
        "Advanced mental models builder",
        "Trend analysis & recommendations",
        "Dedicated agent copilot support",
        "SOC2 compliance workspace"
      ],
      popular: true,
      cta: "Upgrade to Pro"
    },
    {
      name: "Enterprise",
      desc: "For global enterprises running cluster-level reasoning engines.",
      price: { monthly: 299, annual: 239 },
      features: [
        "Infinite vector storage capacity",
        "Multi-region database replication",
        "Dedicated Groq inference endpoints",
        "Custom reasoning model fine-tuning",
        "SSO, SAML & Advanced Audit Logs",
        "Custom SLA guarantees",
        "Dedicated solutions architect",
        "24/7 Priority support hotline"
      ],
      popular: false,
      cta: "Contact Enterprise"
    }
  ];

  const faqs = [
    {
      q: "What is RevoxA?",
      a: "RevoxA is a premium AI-native long-term memory and context orchestration platform. It enables LLMs, AI agents, and product software to continuously ingest user feedback, build evolving mental models, and recall context records with sub-18ms vector search times, eliminating memory drift and context window limitations."
    },
    {
      q: "How does the memory ingestion layer work?",
      a: "Our ingestion layer securely links with communication platforms (Slack, Discord, Zendesk, Gmail, HubSpot) and custom APIs. When feedback arrives, the text is chunked, run through embedding models, and securely stored in our managed vector index. It runs silently in the background without affecting your frontend performance."
    },
    {
      q: "Can I integrate my own custom LLM/AI models?",
      a: "Yes. RevoxA is fully model-agnostic. We provide SDKs and REST APIs to fetch context structures, memory graphs, and mental models. You can feed this premium context directly into OpenAI, Anthropic, Gemini, or self-hosted open-source models."
    },
    {
      q: "Is enterprise deployment supported? How is security managed?",
      a: "Absolutely. RevoxA is built with strict enterprise-grade security. We support SOC2 Type II compliance, SSO/SAML integration, isolated secure multi-tenant clusters, data encryption at rest and in transit, and custom deployments within your own private VPC (AWS, GCP, Azure)."
    }
  ];

  const handleTimelinePrev = () => {
    setActiveTimelineStep(prev => (prev > 0 ? prev - 1 : timelineSteps.length - 1));
  };

  const handleTimelineNext = () => {
    setActiveTimelineStep(prev => (prev < timelineSteps.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-x-hidden selection:bg-[#7C3AED]/20">

      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/75 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="RevoxA Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="font-heading font-extrabold text-xl tracking-tight text-gradient-primary">
              RevoxA
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#64748B]">
            <a href="#features" className="hover:text-[#0F172A] transition-colors">Features</a>
            <a href="#timeline" className="hover:text-[#0F172A] transition-colors">Architecture</a>
            <a href="#showcase" className="hover:text-[#0F172A] transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-[#0F172A] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#0F172A] transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] px-4 py-2 rounded-xl hover:bg-[#F1F5F9] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold text-white bg-gradient-primary hover:opacity-95 shadow-md shadow-[#4F46E5]/10 hover:shadow-lg transition-all px-4 py-2.5 rounded-xl border border-white/10 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col md:grid md:grid-cols-12 items-center gap-12 overflow-hidden">

        {/* Glow Ambient Blobs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#06B6D4] opacity-10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse-slow stagger-2"></div>

        {/* Left column info */}
        <div className="md:col-span-7 space-y-8 text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] font-heading font-extrabold text-[10px] tracking-wider uppercase animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Memory Intelligence Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-black text-[#0F172A] tracking-tight leading-[1.08] animate-slide-up">
            Your AI's Memory. <br />
            <span className="text-gradient-primary">Evolved.</span>
          </h1>

          <p className="text-sm md:text-base text-[#64748B] leading-relaxed max-w-lg animate-slide-up stagger-1">
            Transform conversations, feedback, documents, and knowledge into a continuously evolving intelligence layer that powers smarter AI systems. Solve context fragmentation forever.
          </p>

          <div className="flex flex-wrap gap-4 items-center animate-slide-up stagger-2">
            <Link
              href="/login"
              className="px-6 py-3 bg-gradient-primary hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-[#4F46E5]/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/10"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="#showcase"
              className="px-5 py-3 border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Play className="w-3 h-3 text-[#7C3AED]" />
              Watch Demo
            </a>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase tracking-wider animate-slide-up stagger-3">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#10B981]" /> No Credit Card Required</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#10B981]" /> Free Tier Available</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#10B981]" /> Enterprise Ready</span>
          </div>
        </div>

        {/* Right column visualization */}
        <div className="md:col-span-5 w-full h-[360px] md:h-[500px] relative flex items-center justify-center">
          {/* Dynamic 3D CSS Parallax styles */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes rotate-orbit-clockwise {
              from { transform: translateZ(10px) rotate(0deg); }
              to { transform: translateZ(10px) rotate(360deg); }
            }
            @keyframes rotate-orbit-counter {
              from { transform: translateZ(15px) rotate(360deg); }
              to { transform: translateZ(15px) rotate(0deg); }
            }
            ${heroParticles.slice(0, 5).map((node, i) => `
              @keyframes flow-particle-${i} {
                0% {
                  left: ${node.x}%;
                  top: ${node.y}%;
                  opacity: 0;
                  transform: translateZ(45px) translate(-50%, -50%) scale(0.6);
                }
                10% {
                  opacity: 1;
                  transform: translateZ(50px) translate(-50%, -50%) scale(1.1);
                }
                85% {
                  opacity: 0.9;
                  transform: translateZ(55px) translate(-50%, -50%) scale(0.9);
                }
                100% {
                  left: 50%;
                  top: 50%;
                  opacity: 0;
                  transform: translateZ(65px) translate(-50%, -50%) scale(0.4);
                }
              }
            `).join('\n')}
          `}} />

          {/* Interactive Tilt Container */}
          <div
            ref={heroCardRef}
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            style={{ ...heroTiltStyle, transformStyle: 'preserve-3d' }}
            className="w-full h-full max-w-[420px] rounded-3xl bg-glass border border-[#E2E8F0]/30 shadow-2xl relative overflow-hidden flex flex-col p-6 glow-primary transition-all duration-300 transform-gpu cursor-pointer"
          >

            {/* Simulation Header with slight depth */}
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4 mb-4" style={{ transform: 'translateZ(20px)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">AI Memory Orchestration Stream</span>
              </div>
              <span className="text-[8px] font-bold bg-[#7C3AED]/10 text-[#7C3AED] px-2 py-0.5 rounded-md">Inference Lock</span>
            </div>

            {/* Simulated 3D graph elements */}
            <div className="flex-1 relative border border-dashed border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] overflow-hidden shadow-inner" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>

              {/* Rotating background orbital rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div
                  className="w-40 h-40 rounded-full border border-dashed border-[#7C3AED]/20 absolute"
                  style={{ animation: 'rotate-orbit-clockwise 25s linear infinite' }}
                />
                <div
                  className="w-60 h-60 rounded-full border border-dashed border-[#06B6D4]/15 absolute"
                  style={{ animation: 'rotate-orbit-counter 40s linear infinite' }}
                />
              </div>

              {/* Central Hub representing the core memory node */}
              <div className="absolute inset-0 flex items-center justify-center z-10" style={{ transform: 'translateZ(65px)' }}>
                {/* Central brain glow */}
                <div className="w-24 h-24 rounded-full bg-gradient-primary opacity-30 filter blur-xl animate-pulse-slow absolute"></div>
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] shadow-lg flex items-center justify-center animate-float">
                  <img src="/logo.png" alt="RevoxA Logo" className="w-10 h-10 object-contain" />
                </div>
              </div>

              {/* Connecting SVG lines */}
              <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                {heroParticles.map((node, i) => (
                  <line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    stroke="rgba(124,58,237,0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                ))}
              </svg>

              {/* Active data packet streams flowing along nodes to center */}
              {heroParticles.slice(0, 5).map((node, i) => (
                <div
                  key={`packet-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] z-20 shadow-md shadow-[#7C3AED]/50"
                  style={{
                    animation: `flow-particle-${i} ${3.5 + i * 0.8}s infinite linear`
                  }}
                />
              ))}

              {/* Memory Node points floating at height */}
              {heroParticles.map((node) => (
                <div
                  key={node.id}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translateZ(45px) translate(-50%, -50%)'
                  }}
                  className="absolute flex items-center justify-center z-20"
                >
                  <div className={`rounded-full bg-white border border-[#E2E8F0] shadow-md flex items-center justify-center p-1 cursor-pointer transition-all duration-300 hover:scale-125 hover:border-[#7C3AED] hover:shadow-lg hover:shadow-[#7C3AED]/15`}>
                    <div
                      className={`rounded-full bg-gradient-primary`}
                      style={{
                        width: `${node.size}px`,
                        height: `${node.size}px`,
                        animation: node.pulse ? 'pulse-slow 2s infinite' : undefined
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Live stream logs ticker */}
            <div className="mt-4 bg-[#0F172A] text-white p-3 rounded-xl font-mono text-[9px] space-y-1 h-20 overflow-y-auto" style={{ transform: 'translateZ(25px)' }}>
              <p className="text-[#06B6D4]">[SYSTEM] Stream active...</p>
              <p className="text-[#10B981]">[INGEST] Ingested customer feedback - ID: #f918</p>
              <p className="text-[#8B5CF6]">[VECTOR] Encoded 384-D matrix in 4.2ms</p>
              <p className="text-[#F59E0B]">[RECALL] Retained vector linked to 'Stripe lock'</p>
            </div>
          </div>
        </div>
      </section>



      {/* 4. PROBLEM STATEMENT */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 text-center space-y-16">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
            The Context Bottleneck
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight leading-none">
            AI Systems Forget. RevoxA Remembers.
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
            Most LLM applications start fresh with every query or rely on short-term session histories. RevoxA introduces persistent vector memory logic directly to the reasoning cycle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1: Traditional */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-left space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0F172A]">Traditional AI Systems</h3>
            <ul className="space-y-3.5 text-xs text-[#64748B]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#EF4444] font-bold">✕</span>
                <span>Forgets user history upon session expiry, repeating onboarding questions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#EF4444] font-bold">✕</span>
                <span>Fragile context window allocation triggers frequent prompt overflows.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#EF4444] font-bold">✕</span>
                <span>No self-reflection or intelligence synthesis of historical data.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#EF4444] font-bold">✕</span>
                <span>Repeats reasoning steps for duplicate issues, burning API tokens.</span>
              </li>
            </ul>
            <div className="absolute right-6 top-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert className="w-24 h-24 text-[#EF4444]" />
            </div>
          </div>

          {/* Card 2: RevoxA */}
          <div className="bg-white border-2 border-[#7C3AED]/20 rounded-3xl p-8 text-left space-y-6 shadow-md shadow-[#7C3AED]/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-gradient-primary text-white text-[9px] font-extrabold uppercase px-4 py-1.5 rounded-bl-2xl">
              Recommended Evolved Layer
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
              <img src="/logo.png" alt="RevoxA Logo" className="w-8 h-8 object-contain" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0F172A] flex items-center gap-2">
              RevoxA Intelligence Layer
            </h3>
            <ul className="space-y-3.5 text-xs text-[#0F172A]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#10B981] font-bold">✓</span>
                <span>Stores semantic embeddings that persist across login sessions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#10B981] font-bold">✓</span>
                <span>Injects top-K relevant memories dynamically into the context window.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#10B981] font-bold">✓</span>
                <span>Autonomous background reflection refines and connects mental models.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#10B981] font-bold">✓</span>
                <span>Caches repeated queries for sub-18ms semantic retrieval loops.</span>
              </li>
            </ul>
            <div className="absolute right-6 top-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src="/logo.png" alt="RevoxA Logo" className="w-24 h-24 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW REVOXA WORKS */}
      <section id="timeline" className="py-20 md:py-32 bg-white border-y border-[#E2E8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
              Orchestration Flow
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight leading-none">
              How RevoxA Works
            </h2>
            <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
              An interactive walk through our long-term memory ingestion and retrieval lifecycle.
            </p>
          </div>

          {/* Timeline slider steps */}
          <div className="relative max-w-5xl mx-auto">
            {/* Timeline connectors */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-[#E2E8F0] -z-10 hidden md:block"></div>

            {/* Grid selector */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {timelineSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeTimelineStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTimelineStep(idx)}
                    className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 relative ${isActive
                      ? 'bg-gradient-primary text-white scale-105 shadow-lg shadow-[#4F46E5]/20'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-white text-[#4F46E5] shadow-sm border border-[#E2E8F0]'
                      }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide">Step {idx + 1}</span>
                    <span className="text-xs font-bold mt-1">{step.title}</span>

                    {/* Active pulse dot indicators */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#06B6D4] border-2 border-white rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Interactive Step Content Details */}
            <div className="mt-12 p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-8 animate-fade-in">
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 flex items-center justify-center text-[#7C3AED]">
                    {React.createElement(timelineSteps[activeTimelineStep].icon, { className: "w-4 h-4" })}
                  </div>
                  <h3 className="font-heading font-black text-lg text-[#0F172A]">
                    {timelineSteps[activeTimelineStep].title} Stage
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
                  {timelineSteps[activeTimelineStep].desc}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E2E8F0] rounded-lg text-[10px] font-mono text-[#64748B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  <span>{timelineSteps[activeTimelineStep].detail}</span>
                </div>
              </div>

              {/* Navigator buttons */}
              <div className="flex gap-3 self-end md:self-center">
                <button
                  onClick={handleTimelinePrev}
                  className="p-3 border border-[#E2E8F0] bg-white rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={handleTimelineNext}
                  className="p-3 bg-gradient-primary text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all"
                >
                  Next Stage
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORE FEATURES */}
      <section id="features" className="py-20 md:py-32 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
            Capabilities Grid
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight leading-none">
            Built for Advanced Cognition
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
            RevoxA connects memory retention pathways directly to your intelligence workspace dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Memory Bank", icon: Database, desc: "A robust repository of all ingested semantic memories, vectors, and historical documents." },
            { title: "Recall Search", icon: Search, desc: "Run deep semantic queries across vector space with sub-18ms speed indicators." },
            { title: "Reflection Center", icon: RefreshCw, desc: "Background processes clean, deduplicate, and compile intelligence signals automatically." },
            { title: "Mental Models", icon: GitCompare, desc: "Cluster-driven reasoning constructs that map user behaviors into logical schemas." },
            { title: "Knowledge Evolution", icon: History, desc: "Track how memory nodes develop, merge, and phase out stale concepts over time." },
            { title: "Memory Graph", icon: Network, desc: "A visual network canvas connecting feedback categories, themes, and entity models." },
            { title: "Trend Intelligence", icon: TrendingUp, desc: "Identify rising anomaly signals in checkout flows or system alerts immediately." },
            { title: "Recommendations", icon: ThumbsUp, desc: "Prioritize product roadmaps and fixes based on collective historical memory clusters." },
            { title: "Feedback Analytics", icon: ListTodo, desc: "Analyze raw feedback channels (Slack, Discord) with sentiment index metrics." }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white border border-[#E2E8F0] hover:border-[#7C3AED]/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
              >
                {/* Purple light glow effect */}
                <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-[#7C3AED] opacity-0 group-hover:opacity-5 rounded-full blur-xl transition-all"></div>

                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-[#0F172A] mb-2">{feature.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. INTERACTIVE PRODUCT SHOWCASE */}
      <section id="showcase" className="py-20 md:py-32 bg-[#0F172A] text-white border-y border-white/5 relative overflow-hidden">

        {/* Glow ambient meshes */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#7C3AED] opacity-20 rounded-full blur-3xl -z-0 pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#06B6D4] opacity-20 rounded-full blur-3xl -z-0 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider bg-[#06B6D4]/15 px-3 py-1.5 rounded-full">
              Live Mockup Preview
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none text-white">
              Interact With The Workspace
            </h2>
            <p className="text-xs md:text-sm text-white/60 leading-relaxed">
              Explore a direct emulation of the RevoxA dashboard running simulated live vector telemetry.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
            {/* Header toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 p-4 bg-slate-950/60 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
                <span className="text-[10px] text-white/40 font-mono pl-2">revoxa.app/workspace/dashboard</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {showcaseTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeShowcaseTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveShowcaseTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${isActive
                        ? 'bg-gradient-primary text-white shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Showcase Board Body Content */}
            <div className="flex-1 p-6 bg-slate-950/40 relative">

              {/* Showcase Tab 1: AI Insights */}
              {activeShowcaseTab === 'insights' && (
                <div className="space-y-6 animate-scale-in">
                  <div className="p-5 border border-white/10 bg-slate-900/80 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#06B6D4]">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Autonomous Signal Summary Report</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-base md:text-lg text-white leading-tight">
                      Detected checkout anomalies in European Stripe gateways.
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Analyzing 5,120 ingested feedback records, the long-term memory points to a thread lock issue on stripe-webhooks container endpoints. 12% revenue is predicted at risk if parameters are not adjusted today.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-center border-t border-white/5">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/50 block">AI Confidence</span>
                        <strong className="text-[#06B6D4] text-sm font-black">96.4%</strong>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/50 block">Trend Forecast</span>
                        <strong className="text-[#10B981] text-sm font-black">Positive</strong>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/50 block">Mental Models</span>
                        <strong className="text-white text-sm font-black">12 active</strong>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-white/50 block">Memory Growth</span>
                        <strong className="text-[#7C3AED] text-sm font-black">+24.5%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Secondary insights widget */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-white/5 bg-slate-900/40 rounded-xl space-y-1">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">Anomaly Alert</span>
                      <h4 className="text-xs font-bold text-white">Slack: Auth Token Lockout</h4>
                      <p className="text-[10px] text-white/60">6 customer comments mention SSO logins failing on iOS builds since yesterday.</p>
                    </div>
                    <div className="p-4 border border-white/5 bg-slate-900/40 rounded-xl space-y-1">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">Action Recommendation</span>
                      <h4 className="text-xs font-bold text-white">Optimize Webhook Queue</h4>
                      <p className="text-[10px] text-white/60">Queue buffer adjustments will prevent message drops for high concurrency events.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Showcase Tab 2: Memory Growth */}
              {activeShowcaseTab === 'growth' && (
                <div className="space-y-6 animate-scale-in">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-5 border border-white/5 bg-slate-900/60 rounded-2xl text-center space-y-1">
                      <span className="text-[8px] font-bold text-white/50 uppercase">Total Vectors Sync</span>
                      <p className="text-2xl font-black text-[#06B6D4]">852,149</p>
                      <span className="text-[9px] text-[#10B981]">+12.5k today</span>
                    </div>
                    <div className="p-5 border border-white/5 bg-slate-900/60 rounded-2xl text-center space-y-1">
                      <span className="text-[8px] font-bold text-white/50 uppercase">Autonomous Reflections</span>
                      <p className="text-2xl font-black text-[#7C3AED]">1,402</p>
                      <span className="text-[9px] text-[#10B981]">+8 completed</span>
                    </div>
                    <div className="p-5 border border-white/5 bg-slate-900/60 rounded-2xl text-center space-y-1">
                      <span className="text-[8px] font-bold text-white/50 uppercase">Ingestion Channels</span>
                      <p className="text-2xl font-black text-white">8 active</p>
                      <span className="text-[9px] text-white/40">Slack, Discord, Zendesk, Web</span>
                    </div>
                  </div>

                  {/* Simulated graph image or placeholder container */}
                  <div className="border border-white/10 rounded-2xl bg-slate-950 p-4 h-48 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[10px] text-white/40 font-mono">
                      <span>Vector Ingest Progress</span>
                      <span>100% capacity threshold</span>
                    </div>
                    {/* Simulated bar chart via Tailwind elements */}
                    <div className="flex items-end justify-between gap-3 flex-1 pt-6 px-4">
                      {[15, 30, 45, 25, 60, 75, 55, 90, 80, 95].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-gradient-primary rounded-t-md transition-all duration-1000"
                            style={{ height: `${val}%`, minHeight: '4px' }}
                          />
                          <span className="text-[8px] text-white/30 font-mono">D{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Showcase Tab 3: Recall Search */}
              {activeShowcaseTab === 'recall' && (
                <div className="space-y-4 animate-scale-in">
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs">
                      <Search className="w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        readOnly
                        value="SSO lockouts on Stripe dashboard hooks"
                        className="bg-transparent border-none text-white outline-none w-full font-mono text-xs"
                      />
                    </div>
                    <button className="px-4 py-2 bg-gradient-primary text-white text-xs font-bold rounded-xl shadow-md border border-white/10">
                      Query
                    </button>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[8px] uppercase tracking-wider text-white/40 font-bold block">Top Matches</span>

                    {[
                      { content: "SSO login loops back to root URL with no cookies saved", score: 0.94, time: "2 hours ago" },
                      { content: "Stripe hook fails with response timeout on Stripe payload verification", score: 0.88, time: "4 hours ago" },
                      { content: "Checkout fail alerts triggered from billing systems webhooks", score: 0.85, time: "1 day ago" }
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-slate-900/80 border border-white/5 rounded-xl flex items-center justify-between gap-4 text-xs">
                        <div className="space-y-0.5">
                          <p className="text-white font-medium">"{item.content}"</p>
                          <span className="text-[8px] text-white/40">{item.time}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[#06B6D4] font-bold font-mono">{item.score}</span>
                          <span className="text-[8px] text-white/40 block">Cosine score</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Showcase Tab 4: Telemetry Metrics */}
              {activeShowcaseTab === 'metrics' && (
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 animate-scale-in pt-4">
                  {[
                    { label: "Recall Latency", value: "18 ms", desc: "Average retrieval speed", color: "text-[#06B6D4]" },
                    { label: "Vector Efficiency", value: "99.8%", desc: "Signal compression ratio", color: "text-[#10B981]" },
                    { label: "Deduplication Rate", value: "42.5%", desc: "Repeated signals consolidated", color: "text-[#7C3AED]" },
                    { label: "Embedding Throughput", value: "240 / min", desc: "Groq hardware processing", color: "text-white" }
                  ].map((m, i) => (
                    <div key={i} className="p-5 border border-white/5 bg-slate-900/60 rounded-2xl space-y-1 text-center">
                      <span className="text-[8px] font-bold text-white/40 uppercase block">{m.label}</span>
                      <strong className={`text-2xl font-black ${m.color}`}>{m.value}</strong>
                      <span className="text-[9px] text-white/50 block">{m.desc}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Showcase Tab 5: Trend Analysis */}
              {activeShowcaseTab === 'analysis' && (
                <div className="space-y-4 animate-scale-in">
                  <div className="p-4 border border-white/5 bg-slate-900/40 rounded-xl space-y-2">
                    <span className="text-[8px] uppercase tracking-wider text-[#EF4444] font-bold block">Critical Cluster Alert</span>
                    <h3 className="text-xs font-bold text-white">Stripe Webhooks Failures</h3>
                    <p className="text-[10px] text-white/70">Ingest trend spiked 420% compared to typical baseline since container release yesterday.</p>
                    <div className="flex gap-4 pt-1.5 text-[9px] text-white/40">
                      <span>Total Signals: 142 items</span>
                      <span>Growth rate: +420%</span>
                    </div>
                  </div>

                  <div className="p-4 border border-white/5 bg-slate-900/40 rounded-xl space-y-2">
                    <span className="text-[8px] uppercase tracking-wider text-[#F59E0B] font-bold block">Moderate Cluster Alert</span>
                    <h3 className="text-xs font-bold text-white">SSO Login Errors</h3>
                    <p className="text-[10px] text-white/70">Google OAuth redirects fail in safari builds with cookie-blocking enabled.</p>
                    <div className="flex gap-4 pt-1.5 text-[9px] text-white/40">
                      <span>Total Signals: 32 items</span>
                      <span>Growth rate: +45%</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* 8. ARCHITECTURE SHOWCASE */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 text-center space-y-16">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
            Data Orchestration Flow
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight leading-none">
            Built For Enterprise Scale
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
            Click any subsystem node to explore the telemetry pathways and reasoning steps.
          </p>
        </div>

        {/* Visual architecture flow map */}
        <div className="max-w-4xl mx-auto relative p-8 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center relative">

            {[
              { id: "users", name: "Users", desc: "Customer interaction clients" },
              { id: "sources", name: "Feedback Sources", desc: "Slack, Discord, Zendesk APIs" },
              { id: "ingest", name: "Ingestion Layer", desc: "Managed hook triggers" },
              { id: "memory", name: "Memory Engine", desc: "Vector database indexing" },
              { id: "reasoning", name: "Reasoning Engine", desc: "Groq inference models" },
              { id: "intelligence", name: "Intelligence Layer", desc: "Insights & classifications" },
              { id: "dashboard", name: "Dashboard", desc: "Analyst workspace visual" }
            ].map((node, i) => {
              const isActive = activeArchStep === node.id;
              return (
                <div key={node.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveArchStep(node.id)}
                    className={`w-full p-4 rounded-2xl text-center border transition-all duration-300 relative ${isActive
                      ? 'bg-gradient-primary text-white border-transparent scale-105 shadow-md shadow-[#4F46E5]/10'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]'
                      }`}
                  >
                    <span className="text-[8px] font-bold block text-white/50 mb-1 font-mono">0{i + 1}</span>
                    <h4 className="text-xs font-bold leading-tight">{node.name}</h4>
                  </button>

                  {/* Horizontal arrow spacer */}
                  {i < 6 && (
                    <div className="h-6 w-0.5 bg-[#E2E8F0] my-2 md:hidden"></div>
                  )}
                </div>
              );
            })}

          </div>

          {/* Connected Flow Node Explainer Detail */}
          <div className="mt-8 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-left animate-fade-in">
            {activeArchStep ? (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">Subsystem Active Node: {activeArchStep.toUpperCase()}</h4>
                <p className="text-xs text-[#0F172A] font-semibold">
                  {activeArchStep === 'users' && "The end-users or enterprise clients whose behavioral patterns and direct interactions drive the Memora AI platform"}
                  {activeArchStep === 'sources' && "The multi-channel raw input streams that continuously capture incoming user data, product reviews, and customer support tickets."}
                  {activeArchStep === 'ingest' && "The pipeline responsible for continuously capturing, cleaning, and structuring incoming raw text payloads in real time."}
                  {activeArchStep === 'memory' && "The core subsystem that utilizes hindsight to look back at historical data, embedding raw text payloads into dense 384-dimensional vector coordinate coordinates synced with Supabase."}
                  {activeArchStep === 'reasoning' && "The cognitive processing core powered by gpt-oss-123b(groq api) to analyze relationships, synthesize memory vectors, and execute complex logical workflows."}
                  {activeArchStep === 'intelligence' && "The strategic backend that converts reasoned data into semantic clusters, predictive trends, and automated product recommendations."}
                  {activeArchStep === 'dashboard' && "The high-fidelity, premium enterprise UI that visualizes actionable metrics, active telemetry pathways, and system reasoning steps for teams."}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#64748B] justify-center italic">
                <Info className="w-4 h-4" />
                <span>Select a flowchart component above to explore telemetry flow details.</span>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* 10. ENTERPRISE BENEFITS */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
            Impact Metrics
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight leading-none">
            Engineered For Performance
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
            Realized operational metrics from enterprise workspaces deploying RevoxA.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { metric: "95%", label: "Faster Knowledge Retrieval", desc: "Sub-18ms semantic vector queries completely bypass manual ticket sorting layers." },
            { metric: "Zero", label: "Long-Term AI Memory Drift", desc: "Persistent coordinate databases guarantee historical signals remain indexed forever." },
            { metric: "-70%", label: "Reduced Context Loss", desc: "Dynamically sized context window allocation cuts API token leaks and page overflows." },
            { metric: "10x", label: "Better Decision Making", desc: "Automated reflections discover rising bug clusters before customer support spikes." },
            { metric: "85%", label: "Improved Product Insights", desc: "Deduplication algorithms combine hundreds of raw feedbacks into clean features plans." },
            { metric: "3.5x", label: "Intelligent Recommendations", desc: "Vector similarity matching assigns related fixes to responsible teams immediately." }
          ].map((benefit, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-2 hover:shadow-md transition-shadow">
              <strong className="text-3xl md:text-4xl font-heading font-black text-gradient-primary">{benefit.metric}</strong>
              <h4 className="text-xs font-bold text-[#0F172A]">{benefit.label}</h4>
              <p className="text-[11px] text-[#64748B] leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. TESTIMONIALS */}
      <section className="py-20 md:py-32 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
              Customer Success
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight leading-none">
              Loved by AI Builders
            </h2>
            <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
              Hear what startup founders and enterprise AI systems architects are saying.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                text: "RevoxA changed how we deploy our agent workflows. By linking the vector store memory directly to our Llama engines, our support agents recall previous checkout failures instantly. Latency is non-existent.",
                name: "Sarah Jenkins",
                role: "Lead Architect",
                company: "LinearAI"
              },
              {
                text: "We were constantly hitting context window limits trying to keep user feedback active in prompt histories. RevoxA handles that orchestration in the background, saving us 30% in monthly OpenAI API costs.",
                name: "Alex Rivera",
                role: "CTO & Co-founder",
                company: "ContextFlow"
              },
              {
                text: "The reflection engine is like having a silent research analyst. It groups customer complaints into mental models automatically, so our product teams know what to build before support tickets accumulate.",
                name: "Clara Vance",
                role: "Product VP",
                company: "Stripe Flow"
              }
            ].map((test, i) => (
              <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 text-left flex flex-col justify-between shadow-sm relative group">
                <p className="text-xs text-[#64748B] italic leading-relaxed mb-6">"{test.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary text-white font-bold flex items-center justify-center text-xs">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{test.name}</h4>
                    <span className="text-[10px] text-[#64748B]">{test.role} · {test.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. PRICING */}
      <section id="pricing" className="py-20 md:py-32 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
            Subscription Options
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight leading-none">
            Transparent, Scalable Pricing
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
            Choose a tier optimized for your application's reasoning volume.
          </p>

          {/* Toggle Monthly/Annual */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <span className={`text-xs font-bold ${!isAnnual ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-[#E2E8F0] p-1 flex items-center relative transition-all duration-300"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#7C3AED] shadow-sm transform transition-all duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'
                  }`}
              />
            </button>
            <span className={`text-xs font-bold ${isAnnual ? 'text-[#0F172A]' : 'text-[#64748B]'} flex items-center gap-1.5`}>
              Annually
              <span className="bg-[#10B981]/15 text-[#10B981] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">Save 25%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {pricingPlans.map((plan, i) => {
            const priceVal = isAnnual ? plan.price.annual : plan.price.monthly;
            return (
              <div
                key={i}
                className={`bg-white border rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${plan.popular
                  ? 'border-2 border-[#7C3AED] shadow-xl shadow-[#7C3AED]/5 -translate-y-2'
                  : 'border-[#E2E8F0] shadow-sm hover:shadow-md'
                  }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-primary text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-black text-lg text-[#0F172A]">{plan.name}</h3>
                    <p className="text-[11px] text-[#64748B] mt-1">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-heading font-black text-[#0F172A]">${priceVal}</span>
                    <span className="text-xs text-[#64748B]">/ user / month</span>
                  </div>

                  <ul className="space-y-3 pt-6 border-t border-[#F1F5F9] text-xs text-[#64748B]">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href="/login"
                    className={`w-full block text-center py-2.5 rounded-xl text-xs font-bold transition-all ${plan.popular
                      ? 'bg-gradient-primary text-white shadow-md hover:opacity-95 hover:scale-[1.02]'
                      : 'border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 13. FAQ SECTION */}
      <section id="faq" className="py-20 md:py-32 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider bg-[#7C3AED]/10 px-3 py-1.5 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-[#0F172A] tracking-tight leading-none">
              Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">
              Read details about deployment vectors, API keys, and model support.
            </p>
          </div>

          <div className="divide-y divide-[#E2E8F0] border-t border-b border-[#E2E8F0]">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={i} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left font-heading font-bold text-xs md:text-sm text-[#0F172A] py-2"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="pt-2 pb-4 text-xs text-[#64748B] leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 14. FINAL CTA */}
      <section className="py-20 md:py-32 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Glow ambient background meshes */}
        <div className="absolute inset-0 bg-gradient-primary opacity-10 -z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7C3AED] opacity-20 filter blur-[120px] rounded-full -z-20 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <img src="/logo.png" alt="RevoxA Logo" className="w-14 h-14 mx-auto animate-float object-contain" />
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none text-white max-w-xl mx-auto">
            Give Your AI The Memory It Deserves.
          </h2>
          <p className="text-xs md:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
            Deploy in minutes with Supabase Auth configurations pre-built. Set up your vectors, run reflections, and watch reasoning accuracy grow.
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center pt-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-gradient-primary hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-[#4F46E5]/20 hover:scale-105 active:scale-95 transition-all border border-white/10"
            >
              Start Free Today
            </Link>
            <a
              href="mailto:team@revoxa.app"
              className="px-6 py-3 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
            >
              Book Demo Call
            </a>
          </div>
        </div>
      </section>

      {/* 15. FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0] py-16 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-8">

          {/* Logo Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="RevoxA Logo"
                className="h-6 w-auto object-contain"
              />
              <span className="font-heading font-bold text-sm text-[#0F172A]">RevoxA</span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-xs">
              RevoxA is the premium long-term memory layer for advanced AI architectures. Engineered for low-latency search and autonomous cognitive reflection.
            </p>
            <p className="text-[10px] text-[#64748B]/60 pt-2 font-mono">
              © {new Date().getFullYear()} RevoxA Inc. All rights reserved.
            </p>
          </div>

          {/* Links col 1 */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-[#0F172A] uppercase tracking-wider text-[9px]">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-[#0F172A] transition-colors">Features</a></li>
              <li><a href="#timeline" className="hover:text-[#0F172A] transition-colors">Memory Engine</a></li>
              <li><a href="#pricing" className="hover:text-[#0F172A] transition-colors">Pricing</a></li>
              <li><a href="#showcase" className="hover:text-[#0F172A] transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Links col 2 */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-[#0F172A] uppercase tracking-wider text-[9px]">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#0F172A] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition-colors">Trust Center</a></li>
            </ul>
          </div>

          {/* Links col 3 */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-[#0F172A] uppercase tracking-wider text-[9px]">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#0F172A] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-[#0F172A] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Links col 4 */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-[#0F172A] uppercase tracking-wider text-[9px]">Connect</h4>
            <ul className="space-y-2 font-semibold text-[#0F172A]">
              <li><a href="#" className="hover:underline flex items-center gap-1">GitHub <ArrowUpRight className="w-3 h-3 text-[#64748B]" /></a></li>
              <li><a href="#" className="hover:underline flex items-center gap-1">LinkedIn <ArrowUpRight className="w-3 h-3 text-[#64748B]" /></a></li>
              <li><a href="#" className="hover:underline flex items-center gap-1">Discord <ArrowUpRight className="w-3 h-3 text-[#64748B]" /></a></li>
              <li><a href="#" className="hover:underline flex items-center gap-1">X / Twitter <ArrowUpRight className="w-3 h-3 text-[#64748B]" /></a></li>
            </ul>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-[#F1F5F9] mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px]">
          <span>Security Compliant: SOC2 Type II Certified · ISO 27001 Certified · HIPAA Compliant</span>
          <span>Designed with absolute precision in San Francisco, CA.</span>
        </div>
      </footer>

    </div>
  );
}
