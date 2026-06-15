"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Sparkles, Send, Brain, Award, ShieldAlert, 
  HelpCircle, ThumbsUp, List, CheckCircle, Activity,
  Layers, Lock
} from 'lucide-react';

export default function AIInsights() {
  const { aiChatHistory, sendAiMessage, isThinking } = useStore();
  const [query, setQuery] = useState('');
  const [selectedMsgIndex, setSelectedMsgIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isThinking) return;
    sendAiMessage(query);
    setQuery('');
    setSelectedMsgIndex(aiChatHistory.length); // auto select newest response
  };

  const sampleQuestions = [
    "What is growing fastest?",
    "Which issue impacts users most?",
    "What feature should we build next?",
    "What changed after version 4.1?"
  ];

  const triggerQuestion = (text: string) => {
    setQuery(text);
    sendAiMessage(text);
    setSelectedMsgIndex(aiChatHistory.length);
  };

  // Static trace details mapped to simulate response tracing
  const getTraceDetails = (msgContent: string) => {
    const text = msgContent.toLowerCase();
    if (text.includes("stripe") || text.includes("checkout") || text.includes("payment")) {
      return {
        rootCause: "Stripe API timeouts during concurrent webhook requests under peak loads.",
        trace: [
          "1. Received 143 new negative feedback logs regarding credit renewals.",
          "2. BGE Embedding search matches logs with Stripe Checkout Gateway Cluster (Similarity: 0.94).",
          "3. Groq reasoning layer identifies thread-pool bottleneck on FastAPI worker routes.",
          "4. Formulates recommended patch: upgrading Stripe webhook concurrency configurations."
        ],
        evidence: [
          "Subscription renew failing with error code 402 (Clara Vance, Gmail)",
          "Cannot renew corporate subscription (Dave Miller, Slack)"
        ],
        recommendation: "Upgrade Stripe Webhook Concurrency Limits (Priority: Critical)"
      };
    }

    if (text.includes("onboarding") || text.includes("invite")) {
      return {
        rootCause: "JWT session tokens on email invitation links are set to expire too quickly (2 hours).",
        trace: [
          "1. Identified 42 onboarding friction reports from Discord scraper.",
          "2. pgvector similarity query groups reports with 'Workspace Link Expiry' cluster.",
          "3. Mental models update flags token duration configuration.",
          "4. Suggests patch: change link expiration hook to 24 hours."
        ],
        evidence: [
          "Onboarding flow is incredibly confusing (Mark Harrison, Zendesk)",
          "Expired invite token link failure (Alex Rivera, Support)"
        ],
        recommendation: "Redesign Workspace Member Invitation Flow (Priority: High)"
      };
    }

    return {
      rootCause: "General analysis of monthly memory database. Ingest systems stable.",
      trace: [
        "1. Scanned 5,120 active feedback vectors.",
        "2. Classified 92% of entries into existing mental models.",
        "3. Average sentiment remains positive (78/100).",
        "4. No anomalies detected in active webhook lines."
      ],
      evidence: [
        "RevoxA Memory Bank logs",
        "Knowledge Evolution Milestones"
      ],
      recommendation: "Conduct quarterly customer satisfaction review."
    };
  };

  const selectedMsg = selectedMsgIndex !== null ? aiChatHistory[selectedMsgIndex] : null;
  const trace = selectedMsg && selectedMsg.role === 'assistant' ? getTraceDetails(selectedMsg.content) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-10rem)] animate-fade-in">
      
      {/* LEFT & CENTER PANEL: Conversational Interface */}
      <div className="md:col-span-2 bg-cardBg border border-cardBorder rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm">
        {/* Header bar */}
        <div className="p-4 border-b border-cardBorder flex items-center justify-between bg-cardBg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primaryAccent animate-spin-slow" />
            <div>
              <h3 className="font-heading font-extrabold text-sm text-primaryText">RevoxA Intelligence Console</h3>
              <p className="text-[10px] text-secondaryText">Ask questions across Hindsight long-term memories</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-success bg-success/10 px-2 py-0.5 rounded">
            GPT-OSS-120B Connected
          </span>
        </div>

        {/* Message feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-secondaryBg/20">
          {aiChatHistory.map((msg, idx) => (
            <div 
              key={idx}
              onClick={() => msg.role === 'assistant' && setSelectedMsgIndex(idx)}
              className={`flex flex-col cursor-pointer transition-all ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primaryAccent text-white rounded-br-none shadow-sm'
                    : `bg-cardBg text-primaryText border rounded-bl-none shadow-sm ${
                        selectedMsgIndex === idx 
                          ? 'border-primaryAccent ring-1 ring-primaryAccent/30' 
                          : 'border-cardBorder hover:border-cardBorder/80'
                      }`
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.content}
                </div>
              </div>

              {msg.role === 'assistant' && (
                <div className="mt-1 flex items-center gap-3 ml-1 text-[9px] text-secondaryText">
                  <span className="text-success font-bold flex items-center gap-0.5">
                    <Award className="w-3 h-3" /> Confidence: {msg.confidence || 94}%
                  </span>
                  <span>Click to view reasoning trace</span>
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-start">
              <div className="bg-cardBg p-3.5 border border-cardBorder rounded-2xl rounded-bl-none text-xs text-secondaryText flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-primaryAccent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-primaryAccent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-primaryAccent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span>AI is reasoning over vector database...</span>
              </div>
            </div>
          )}
        </div>

        {/* Query Input form */}
        <div className="p-4 border-t border-cardBorder bg-cardBg space-y-3">
          {/* Quick links */}
          {aiChatHistory.length === 1 && (
            <div className="flex flex-wrap gap-2 pb-1">
              {sampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => triggerQuestion(q)}
                  className="px-3 py-1.5 bg-secondaryBg hover:bg-primaryAccent/15 text-primaryAccent rounded-xl text-[10px] font-semibold transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask RevoxA Intelligence (e.g. what is growing fastest?)..."
              disabled={isThinking}
              className="flex-1 bg-secondaryBg px-3.5 py-2.5 rounded-xl text-xs text-primaryText focus:outline-none focus:ring-1 focus:ring-primaryAccent"
            />
            <button
              type="submit"
              disabled={!query.trim() || isThinking}
              className="w-10 h-10 rounded-xl bg-gradient-primary hover:opacity-95 text-white flex items-center justify-center shadow-sm disabled:opacity-50 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL: Reasoning Trace summary */}
      <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm flex flex-col justify-between overflow-y-auto">
        {trace && selectedMsg ? (
          <div className="space-y-5">
            <div>
              <span className="text-[9px] font-bold text-primaryAccent uppercase bg-primaryAccent/10 px-2 py-0.5 rounded">
                Reasoning Trace Report
              </span>
              <h3 className="font-heading font-extrabold text-sm text-primaryText mt-2">
                Trace Diagnostics
              </h3>
            </div>

            {/* Confidence Gauge */}
            <div className="p-3 bg-secondaryBg/40 border border-cardBorder rounded-xl text-xs space-y-1">
              <span className="text-[9px] font-bold text-secondaryText uppercase">Trace confidence indices</span>
              <div className="flex justify-between items-center font-bold text-primaryText mt-1">
                <span>Reasoning Confidence</span>
                <span className="text-success">{selectedMsg.confidence || 94}%</span>
              </div>
              <div className="w-full bg-cardBorder h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-success rounded-full" 
                  style={{ width: `${selectedMsg.confidence || 94}%` }} 
                />
              </div>
            </div>

            {/* Root Cause Analysis */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-secondaryText uppercase block">Root Cause analysis</span>
              <div className="p-3 bg-danger/5 border-l-3 border-danger rounded-xl text-xs leading-relaxed text-primaryText font-medium">
                "{trace.rootCause}"
              </div>
            </div>

            {/* Trace Steps list */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-secondaryText uppercase block">Reasoning Trace steps</span>
              <div className="space-y-1.5 text-xs text-secondaryText leading-relaxed">
                {trace.trace.map((step, idx) => (
                  <p key={idx} className="hover:text-primaryText transition-colors">{step}</p>
                ))}
              </div>
            </div>

            {/* Supporting evidence */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-secondaryText uppercase block">Ingest evidence sources</span>
              <div className="space-y-1.5">
                {trace.evidence.map((ev, idx) => (
                  <div key={idx} className="p-2.5 bg-secondaryBg/25 border border-cardBorder rounded-xl text-xs text-primaryText italic">
                    "{ev}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6">
            <Brain className="w-8 h-8 text-secondaryText animate-pulse-slow" />
            <h4 className="font-heading font-bold text-xs text-primaryText">Select an AI Response</h4>
            <p className="text-[10px] text-secondaryText">Click any assistant card in the chat flow to view its live reasoning trace diagnostics here.</p>
          </div>
        )}

        {/* Reasoning attribution footer */}
        <div className="pt-4 border-t border-cardBorder mt-4 text-[9px] text-secondaryText flex items-center justify-between">
          <span>Attribution: BGE Small Embed</span>
          <span className="flex items-center gap-1 font-semibold text-primaryAccent">
            <Layers className="w-3.5 h-3.5" /> Models Evolution active
          </span>
        </div>
      </div>
    </div>
  );
}
