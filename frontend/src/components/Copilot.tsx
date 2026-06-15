"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, MessageCircle, X, Send, Brain, ShieldAlert, Award, FileText } from 'lucide-react';

export default function Copilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { aiChatHistory, sendAiMessage, isThinking } = useStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    sendAiMessage(input);
    setInput('');
  };

  const samplePrompts = [
    "Show payment complaints",
    "Show login issues",
    "Summarize this month",
    "Show top feature requests"
  ];

  return (
    <div className="relative">
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-primary p-[2px] shadow-lg transition-all hover:scale-110 active:scale-95 animate-float relative group"
        >
          <div className="w-full h-full rounded-full bg-cardBg flex items-center justify-center text-primaryAccent">
            <Sparkles className="w-6 h-6 animate-pulse-slow" />
          </div>
          {/* Tooltip */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-primaryText text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
            Ask RevoxA Intelligence
          </span>
        </button>
      )}

      {/* Chat Console Panel */}
      {isOpen && (
        <div className="w-96 h-[500px] bg-glass border border-cardBorder rounded-2xl shadow-lg flex flex-col overflow-hidden animate-fade-in">
          {/* Header Panel */}
          <div className="p-4 bg-gradient-primary text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <div>
                <h3 className="font-heading font-bold text-sm leading-none">RevoxA Intelligence</h3>
                <span className="text-[10px] text-white/80">Hindsight Memory + GPT-OSS-120B</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-secondaryBg/20">
            {aiChatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primaryAccent text-white rounded-br-none' 
                      : 'bg-cardBg text-primaryText rounded-bl-none shadow-sm border border-cardBorder'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    // Parse markdown headers/lists simple styling
                    <div className="space-y-1 whitespace-pre-line">
                      {msg.content}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Meta details for assistant responses */}
                {msg.role === 'assistant' && msg.confidence && (
                  <div className="mt-1 flex items-center gap-3 ml-1">
                    <span className="text-[9px] font-bold text-success flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Confidence: {msg.confidence}%
                    </span>
                    <span className="text-[9px] text-secondaryText flex items-center gap-1">
                      <Brain className="w-2.5 h-2.5 text-primaryAccent" />
                      Recall Sources: 3
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Thinking pulse animation */}
            {isThinking && (
              <div className="flex flex-col items-start">
                <div className="bg-cardBg p-3 rounded-2xl rounded-bl-none shadow-sm border border-cardBorder text-xs text-secondaryText flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primaryAccent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-primaryAccent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-primaryAccent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span>Thinking... recalling memory engines</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Panel */}
          {aiChatHistory.length === 1 && (
            <div className="p-3 bg-cardBg border-t border-cardBorder flex flex-wrap gap-1.5">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    sendAiMessage(prompt);
                  }}
                  className="px-2.5 py-1.5 bg-secondaryBg hover:bg-primaryAccent/10 text-primaryAccent rounded-lg text-[10px] font-medium transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Panel */}
          <form onSubmit={handleSubmit} className="p-3 bg-cardBg border-t border-cardBorder flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask RevoxA Memory..."
              disabled={isThinking}
              className="flex-1 bg-secondaryBg px-3.5 py-2.5 rounded-xl text-xs text-primaryText focus:outline-none focus:ring-1 focus:ring-primaryAccent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="w-10 h-10 rounded-xl bg-gradient-primary hover:opacity-95 text-white flex items-center justify-center shadow-sm disabled:opacity-50 transition-opacity hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
