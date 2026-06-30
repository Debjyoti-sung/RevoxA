"use client";

import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Sparkles, Brain, Award, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ReflectionCenter() {
  const { 
    reflectionQuestion, 
    reflectionAnswer, 
    reflectionConfidence, 
    reflectionEvidence, 
    reflectMemory, 
    isThinking 
  } = useStore();
  const [question, setQuery] = useState('');

  const handleReflect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    reflectMemory(question);
  };

  const sampleQuestions = [
    "What do customers think about checkout performance?",
    "What is onboarding friction like?",
    "Are there generic API integration concerns?"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center space-y-2.5">
        <h2 className="text-2xl font-heading font-extrabold text-primaryText">Hindsight Reflection Center</h2>
        <p className="text-xs text-secondaryText">
          Synthesize high-level mental models and track feedback patterns across history.
        </p>
      </div>

      {/* Input console */}
      <form onSubmit={handleReflect} className="bg-cardBg border border-cardBorder p-3 rounded-2xl shadow-sm flex flex-col gap-3">
        <textarea
          value={question}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a reflection question (e.g. What are checkout complaints?)..."
          rows={3}
          className="w-full bg-secondaryBg px-4 py-3 rounded-xl text-xs text-primaryText focus:outline-none focus:ring-1 focus:ring-primaryAccent focus:bg-cardBg transition-all resize-none"
        />
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-secondaryText leading-none">Powered by Hindsight Reflection Engine</span>
          <button
            type="submit"
            disabled={!question.trim() || isThinking}
            className="px-5 py-2 bg-gradient-primary text-white text-xs font-semibold rounded-xl hover:opacity-95 shadow-sm transition-opacity"
          >
            {isThinking ? 'Reflecting...' : 'Ask Reflection'}
          </button>
        </div>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] text-secondaryText font-bold uppercase mr-1">Suggestions:</span>
        {sampleQuestions.map((q) => (
          <button
            key={q}
            onClick={() => {
              setQuery(q);
              reflectMemory(q);
            }}
            className="px-3 py-1.5 bg-secondaryBg hover:bg-primaryAccent/15 text-primaryAccent rounded-xl text-[10px] font-semibold transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isThinking && (
        <div className="p-8 text-center bg-cardBg border border-cardBorder rounded-2xl animate-pulse space-y-2">
          <Brain className="w-8 h-8 text-primaryAccent animate-spin-slow mx-auto" />
          <p className="text-xs text-secondaryText">Traversing long-term reflection memory states...</p>
        </div>
      )}

      {/* Answer Panel */}
      {!isThinking && reflectionAnswer && (
        <div className="space-y-6">
          {/* Main Answer Card */}
          <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
            {/* Top confidence index */}
            <div className="flex justify-between items-center pb-3 border-b border-cardBorder">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-primaryAccent animate-pulse" />
                <h3 className="font-heading font-extrabold text-sm text-primaryText">AI Reflection Synthesis</h3>
              </div>
              <span className="text-[10px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Reflection Confidence: {reflectionConfidence}%
              </span>
            </div>

            <p className="text-xs text-primaryText leading-relaxed whitespace-pre-line">
              {reflectionAnswer}
            </p>
          </div>

          {/* Evidence Grid */}
          {reflectionEvidence.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-secondaryText uppercase tracking-wider ml-1">Referenced Memory Evidence</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reflectionEvidence.map((ev, idx) => (
                  <div key={idx} className="bg-cardBg border border-cardBorder rounded-xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
                    <div className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <p className="text-xs text-primaryText font-medium line-clamp-3 leading-relaxed">
                        "{ev}"
                      </p>
                    </div>
                    <span className="text-[9px] text-secondaryText font-semibold mt-2 block">
                      Ref #MM-0{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
