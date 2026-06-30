"use client";

import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Search, Brain, HelpCircle, Award, Share2, Layers, ExternalLink } from 'lucide-react';

export default function RecallSearch() {
  const { recallQuery, recallResults, recallConfidence, recallMemory, isThinking, clusters } = useStore();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    recallMemory(query);
  };

  const samplePrompts = [
    "What complaints exist about payment failures?",
    "What did customers say about onboarding?",
    "What trends emerged in the last 60 days?"
  ];

  const triggerPrompt = (text: string) => {
    setQuery(text);
    recallMemory(text);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center space-y-2.5">
        <h2 className="text-2xl font-heading font-extrabold text-primaryText">Vector Recall Engine</h2>
        <p className="text-xs text-secondaryText">
          Retrieve semantic matches across BGE Small / Nomic Embed memory layers.
        </p>
      </div>

      {/* Search Bar Input */}
      <form onSubmit={handleSearch} className="bg-cardBg border border-cardBorder p-2.5 rounded-2xl shadow-sm flex gap-3">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-secondaryText" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask RevoxA Memory (e.g. Stripe checkout error)..."
            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs text-primaryText focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isThinking}
          className="px-5 py-2 bg-gradient-primary text-white text-xs font-semibold rounded-xl hover:opacity-95 shadow-sm transition-opacity"
        >
          {isThinking ? 'Recalling...' : 'Recall Search'}
        </button>
      </form>

      {/* Sample prompts */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] text-secondaryText font-bold uppercase mr-1">Suggestions:</span>
        {samplePrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => triggerPrompt(prompt)}
            className="px-3 py-1.5 bg-secondaryBg hover:bg-primaryAccent/15 text-primaryAccent rounded-xl text-[10px] font-semibold transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isThinking && (
        <div className="p-8 text-center bg-cardBg border border-cardBorder rounded-2xl animate-pulse space-y-2">
          <Brain className="w-8 h-8 text-primaryAccent animate-spin-slow mx-auto" />
          <p className="text-xs text-secondaryText">Traversing vector space & matching weights...</p>
        </div>
      )}

      {/* Results panel */}
      {!isThinking && recallQuery && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs text-secondaryText">
              Recall results for: <strong className="text-primaryText">"{recallQuery}"</strong>
            </span>
            {recallConfidence > 0 && (
              <span className="text-[10px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                Vector Match Confidence: {recallConfidence}%
              </span>
            )}
          </div>

          <div className="space-y-4">
            {recallResults.length > 0 ? (
              recallResults.map((item) => (
                <div key={item.id} className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-3.5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-heading font-extrabold text-sm text-primaryText">
                      {item.title}
                    </h4>
                    <span className="text-[9px] font-bold uppercase text-secondaryText bg-secondaryBg px-2 py-0.5 rounded">
                      {item.source_type}
                    </span>
                  </div>
                  <p className="text-xs text-secondaryText leading-relaxed whitespace-pre-line">
                    "{item.content}"
                  </p>
                  
                  {/* Matching Cluster */}
                  <div className="pt-3 border-t border-cardBorder flex flex-wrap gap-4 items-center text-[10px]">
                    <div className="flex items-center gap-1 text-secondaryText font-medium">
                      <Layers className="w-3.5 h-3.5 text-primaryAccent" />
                      <span>Cluster: </span>
                      <strong className="text-primaryText">
                        {clusters.find(c => c.id === item.cluster_id)?.name || 'Checkout Gateway'}
                      </strong>
                    </div>
                    <div className="flex items-center gap-1 text-secondaryText font-medium">
                      <Share2 className="w-3.5 h-3.5 text-secondaryAccent" />
                      <span>Feature Tag: </span>
                      <strong className="text-primaryText">{item.feature_tag}</strong>
                    </div>
                    <div className="ml-auto text-secondaryText flex items-center gap-1">
                      <span>Severity: </span>
                      <strong className="text-danger capitalize">{item.severity}</strong>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-cardBg border border-cardBorder rounded-2xl">
                <p className="text-xs text-secondaryText">No exact matches found. Try queries related to payment, login, or onboarding.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
