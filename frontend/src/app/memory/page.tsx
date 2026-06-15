"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Database, Brain, TrendingUp, ShieldCheck, Plus, Trash2, 
  Search, MessageSquare, Sparkles, Filter, CheckCircle 
} from 'lucide-react';

export default function MemoryBank() {
  const { feedbacks, retainMemory, deleteMemory, dashboardStats } = useStore();
  const [newMemory, setNewMemory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Filter memories
  const memories = feedbacks.filter(f => f.status === 'processed' || f.feature_tag === 'Memory');
  const filteredMemories = memories.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;
    retainMemory(newMemory, 'Manual Console');
    setNewMemory('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Memories Ingested", value: dashboardStats.totalMemories, icon: Database, color: "text-primaryAccent bg-primaryAccent/10" },
          { label: "Memory Growth MoM", value: `+${dashboardStats.memoryGrowth}%`, icon: TrendingUp, color: "text-secondaryAccent bg-secondaryAccent/10" },
          { label: "Retention Rate Score", value: "99.8%", icon: ShieldCheck, color: "text-success bg-success/10" },
          { label: "Semantic Memory Clusters", value: "50", icon: Brain, color: "text-tertiaryAccent bg-tertiaryAccent/10" },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-cardBg border border-cardBorder rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-heading font-bold text-primaryText leading-none">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingest Console */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primaryAccent" />
            <h3 className="font-heading font-bold text-sm text-primaryText">Ingest Memory Vector</h3>
          </div>
          <p className="text-xs text-secondaryText leading-relaxed">
            Directly commit customer notes, audit traces, or team statements to Revoxa long-term vector indexes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              placeholder="e.g. Acme Corp plans to migrate Stripe gateways. Ensure checkout failures are addressed by Sprint 4."
              rows={4}
              className="w-full bg-secondaryBg px-3.5 py-2.5 rounded-xl text-xs text-primaryText focus:outline-none focus:ring-1 focus:ring-primaryAccent focus:bg-cardBg transition-all"
            />
            {successMsg && (
              <div className="flex items-center gap-2 text-success font-semibold text-xs py-1">
                <CheckCircle className="w-4 h-4" />
                <span>Memory index committed successfully!</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!newMemory.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-primary hover:opacity-95 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-50 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Commit to Hindsight</span>
            </button>
          </form>
        </div>

        {/* Memories Feed */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primaryAccent" />
              <h3 className="font-heading font-bold text-sm text-primaryText">Hindsight Memory logs</h3>
            </div>
            {/* Inner Search */}
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondaryText" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search index..."
                className="w-full pl-8 pr-3 py-1.5 bg-secondaryBg rounded-lg text-[10px] text-primaryText focus:outline-none focus:ring-1 focus:ring-primaryAccent"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
            {filteredMemories.map((mem) => (
              <div key={mem.id} className="p-4 bg-secondaryBg/25 border border-cardBorder hover:border-primaryAccent/30 rounded-xl space-y-2.5 transition-colors group">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-primaryText">{mem.title}</h4>
                    <span className="text-[9px] text-secondaryText">Commited via {mem.customer_name} · {new Date(mem.created_at).toLocaleDateString('en-US')}</span>
                  </div>
                  <button
                    onClick={() => deleteMemory(mem.id)}
                    className="p-1 text-secondaryText hover:text-danger rounded hover:bg-danger/5 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-secondaryText leading-relaxed">
                  "{mem.content}"
                </p>
                {/* AI generated micro summary */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-primaryAccent bg-primaryAccent/5 px-2 py-1 rounded-md w-fit">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Ingest Vector: Processed & Embedded (384 Dimensions)</span>
                </div>
              </div>
            ))}
            {filteredMemories.length === 0 && (
              <p className="text-xs text-secondaryText text-center py-8">No memories matching the query search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
