"use client";

import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  History, Database, ShieldAlert, ListTodo, TrendingUp, 
  ArrowDownCircle, Award, Sparkles, Filter 
} from 'lucide-react';

export default function KnowledgeEvolution() {
  const { timelineEvents } = useStore();
  const [filterType, setFilterType] = useState<'all' | 'memory' | 'issue' | 'trend' | 'feature'>('all');

  const filteredEvents = timelineEvents.filter(e => 
    filterType === 'all' || e.evolution_type === filterType
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'memory': return <Database className="w-4.5 h-4.5 text-primaryAccent" />;
      case 'issue': return <ShieldAlert className="w-4.5 h-4.5 text-danger" />;
      case 'trend': return <TrendingUp className="w-4.5 h-4.5 text-success" />;
      case 'feature': return <ListTodo className="w-4.5 h-4.5 text-secondaryAccent" />;
      default: return <History className="w-4.5 h-4.5 text-tertiaryAccent" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'memory': return 'bg-primaryAccent/10 text-primaryAccent';
      case 'issue': return 'bg-danger/10 text-danger';
      case 'trend': return 'bg-success/10 text-success';
      default: return 'bg-secondaryAccent/10 text-secondaryAccent';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-cardBorder">
        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-primaryText">Knowledge Evolution</h2>
          <p className="text-xs text-secondaryText">
            Observe the timeline trajectory of system intelligence and recurring feedback issues.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-1 bg-secondaryBg p-1.5 rounded-xl border border-cardBorder">
          {[
            { label: 'All', val: 'all' },
            { label: 'Memories', val: 'memory' },
            { label: 'Issues', val: 'issue' },
            { label: 'Trends', val: 'trend' },
            { label: 'Features', val: 'feature' }
          ].map(btn => (
            <button
              key={btn.val}
              onClick={() => setFilterType(btn.val as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                filterType === btn.val 
                  ? 'bg-cardBg text-primaryText shadow-sm' 
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative border-l border-cardBorder ml-6 pl-8 space-y-8 py-2">
        {filteredEvents.map((evt, idx) => (
          <div key={evt.id} className="relative group">
            {/* Left Node Dot Icon */}
            <div className="absolute -left-[50px] top-1.5 w-9 h-9 rounded-full bg-cardBg border border-cardBorder flex items-center justify-center shadow-sm group-hover:border-primaryAccent/40 transition-colors">
              {getEventIcon(evt.evolution_type)}
            </div>

            {/* Event Content card */}
            <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">{evt.month}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${getBadgeColor(evt.evolution_type)}`}>
                    {evt.evolution_type}
                  </span>
                  <span className="text-[10px] font-bold text-primaryAccent">
                    Vector count: {evt.memory_growth}k
                  </span>
                </div>
              </div>

              <h4 className="font-heading font-extrabold text-sm text-primaryText">
                {evt.title}
              </h4>
              <p className="text-xs text-secondaryText leading-relaxed">
                {evt.description}
              </p>

              {/* Trajectory validation metrics */}
              <div className="pt-2 flex items-center gap-4 text-[9px] text-secondaryText">
                <span className="flex items-center gap-1.5 font-semibold text-success bg-success/5 px-2 py-1 rounded">
                  <Sparkles className="w-3.5 h-3.5" />
                  Insight validation: Cleared
                </span>
                <span>Audit Trajectory: ID EV-0{idx + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
