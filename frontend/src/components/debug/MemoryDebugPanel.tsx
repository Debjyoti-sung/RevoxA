"use client";

import React, { useState, useEffect } from 'react';
import { useMemoryDebug } from '../../hooks/useMemoryDebug';
import { 
  Brain, Clipboard, CheckCircle, AlertOctagon, Activity, 
  ChevronUp, ChevronDown, RefreshCw, Copy, Network, Cpu, Sliders 
} from 'lucide-react';

export const MemoryDebugPanel: React.FC = () => {
  const { state, copyDebugData, resetState } = useMemoryDebug();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(-1);

  // Development check
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Highlight pipeline steps based on actions
  useEffect(() => {
    if (state.recallCalled) {
      // Animate pipeline execution steps
      let step = 0;
      setActivePipelineStep(0); // Query
      
      const interval = setInterval(() => {
        step += 1;
        if (step <= 6) {
          setActivePipelineStep(step);
        } else {
          clearInterval(interval);
          setTimeout(() => setActivePipelineStep(-1), 4000); // clear after 4s
        }
      }, 400);

      return () => clearInterval(interval);
    }
  }, [state.recallCalled, state.lastQuery]);

  // If not development environment, render absolutely nothing
  if (!isDevelopment) {
    return null;
  }

  const handleCopy = async () => {
    const success = await copyDebugData();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const steps = [
    { label: 'User Query', desc: 'Capture query string input' },
    { label: 'Recall API', desc: 'Trigger database retrieval queries' },
    { label: 'Embedding', desc: 'Generate 384D vectors via Groq' },
    { label: 'Vector Search', desc: 'Vector cosine similarity scan' },
    { label: 'Top K Retrieval', desc: 'Select top relevant signals' },
    { label: 'Context Injection', desc: 'Relevance-inject LLM window' },
    { label: 'LLM Response', desc: 'Groq GPT-OSS final response text' },
  ];

  return (
    <div className="relative font-sans text-xs selection:bg-primaryAccent/20">
      
      {/* COLLAPSED TRIGGER BUTTON */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-slide-up font-semibold border border-white/10"
        >
          <Brain className="w-4 h-4 animate-pulse" />
          <span>🧠 Memory Debug</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="w-[380px] bg-cardBg border border-cardBorder rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[580px] animate-fade-in">
          {/* EXPANDED PANEL CARD */}
          
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 bg-secondaryBg border-b border-cardBorder">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primaryAccent/15 flex items-center justify-center text-primaryAccent">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-heading font-extrabold text-primaryText">🧠 Memory Debug Panel</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-cardBorder rounded-lg text-secondaryText hover:text-primaryText transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* MAIN PANEL CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[440px]">
            
            {/* STATUS HEALTH SECTION */}
            <div className="bg-secondaryBg/40 border border-cardBorder rounded-xl p-3 space-y-2.5">
              <h4 className="font-bold text-secondaryText uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <Network className="w-3 h-3 text-secondaryText" /> System Telemetry
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-secondaryText">Memory Engine:</span>
                  <span className="flex items-center gap-1 font-bold text-success">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondaryText">Vector Database:</span>
                  <span className={`flex items-center gap-1 font-bold ${state.vectorStoreConnected ? 'text-success' : 'text-danger'}`}>
                    {state.vectorStoreConnected ? (
                      <>
                        <CheckCircle className="w-3 h-3" /> Connected
                      </>
                    ) : (
                      <>
                        <AlertOctagon className="w-3 h-3" /> Disconnected
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between col-span-2 border-t border-cardBorder/40 pt-1.5 mt-1">
                  <span className="text-secondaryText">Retain Executed:</span>
                  <span className={`font-semibold ${state.retainCalled ? 'text-success font-bold' : 'text-secondaryText'}`}>
                    {state.retainCalled ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex items-center justify-between col-span-2">
                  <span className="text-secondaryText">Recall Executed:</span>
                  <span className={`font-semibold ${state.recallCalled ? 'text-success font-bold' : 'text-secondaryText'}`}>
                    {state.recallCalled ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>
            </div>

            {/* PERFORMANCE METRICS SECTION */}
            <div className="bg-secondaryBg/40 border border-cardBorder rounded-xl p-3 space-y-2">
              <h4 className="font-bold text-secondaryText uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-secondaryText" /> Telemetry Performance Metrics
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                <div className="p-1.5 bg-cardBg border border-cardBorder rounded-lg">
                  <span className="text-[8px] text-secondaryText uppercase block">Recall Latency</span>
                  <strong className="text-gradient-primary text-xs font-bold">{state.recallLatencyMs} ms</strong>
                </div>
                <div className="p-1.5 bg-cardBg border border-cardBorder rounded-lg">
                  <span className="text-[8px] text-secondaryText uppercase block">Top Score</span>
                  <strong className="text-primaryText text-xs font-bold">{state.topSimilarityScore || '-'}</strong>
                </div>
                <div className="p-1.5 bg-cardBg border border-cardBorder rounded-lg">
                  <span className="text-[8px] text-secondaryText uppercase block">Memories Sync</span>
                  <strong className="text-primaryText text-xs font-bold">{state.memoriesStored}</strong>
                </div>
              </div>
            </div>

            {/* PIPELINE WORKFLOW STEP VISUALIZER */}
            <div className="bg-secondaryBg/40 border border-cardBorder rounded-xl p-3 space-y-2.5">
              <h4 className="font-bold text-secondaryText uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-secondaryText" /> Memory Pipeline Flow
              </h4>
              <div className="space-y-1.5 pl-2">
                {steps.map((step, idx) => {
                  const isActive = activePipelineStep === idx;
                  return (
                    <div 
                      key={step.label} 
                      className={`flex items-center gap-2.5 transition-all duration-200 ${
                        isActive ? 'text-primaryAccent font-bold translate-x-1' : 'text-secondaryText opacity-60'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primaryAccent animate-ping' : 'bg-cardBorder'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span>{step.label}</span>
                          {isActive && <span className="text-[8px] font-semibold text-primaryAccent/80 uppercase animate-pulse">active</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RETRIEVED MEMORIES VIEWER */}
            <div className="bg-secondaryBg/40 border border-cardBorder rounded-xl p-3 space-y-2.5">
              <h4 className="font-bold text-secondaryText uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-secondaryText" /> Retrieved Memories Matches
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {state.retrievedMemories.length === 0 ? (
                  <p className="text-[10px] text-secondaryText italic text-center py-2">No active recalled vector memory logs.</p>
                ) : (
                  state.retrievedMemories.map((mem, index) => (
                    <div key={index} className="p-2 bg-cardBg border border-cardBorder rounded-lg space-y-1">
                      <p className="text-[10px] text-primaryText font-medium leading-relaxed">"{mem.content}"</p>
                      <div className="flex items-center justify-between text-[8px] text-secondaryText font-semibold">
                        <span>Similarity Score:</span>
                        <span className="text-primaryAccent font-bold">{mem.score}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* LATEST RETAINED MEMORY DISPLAY */}
            {state.lastStoredMemory && (
              <div className="bg-success/5 border border-success/20 rounded-xl p-3 space-y-1">
                <span className="text-[8px] font-bold text-success uppercase tracking-wide">Last Retained Memory Vector</span>
                <p className="text-[10px] text-primaryText leading-relaxed">"{state.lastStoredMemory}"</p>
              </div>
            )}

          </div>

          {/* ACTION BUTTON FOOTER */}
          <div className="p-3 bg-secondaryBg border-t border-cardBorder flex items-center justify-between gap-3">
            <button
              onClick={resetState}
              className="px-3 py-1.5 border border-cardBorder hover:bg-cardBorder rounded-xl text-[10px] font-semibold text-secondaryText hover:text-primaryText transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Debug State
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-gradient-primary hover:opacity-95 text-white rounded-xl text-[10px] font-bold shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 border border-white/5"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3 h-3" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Debug Data
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default MemoryDebugPanel;
