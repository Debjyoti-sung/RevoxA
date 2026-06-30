"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ThumbsUp, Sparkles, Award, AlertCircle, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export default function Recommendations() {
  const { recommendations, notifications } = useStore();
  const [recs, setRecs] = useState(recommendations);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Group columns
  const columns: ('Critical' | 'High' | 'Medium' | 'Low')[] = ['Critical', 'High', 'Medium', 'Low'];

  const getPriorityColor = (col: string) => {
    switch (col) {
      case 'Critical': return 'border-t-4 border-danger text-danger';
      case 'High': return 'border-t-4 border-warning text-warning';
      case 'Medium': return 'border-t-4 border-primaryAccent text-primaryAccent';
      default: return 'border-t-4 border-secondaryText text-secondaryText';
    }
  };

  const handleResolve = (id: string) => {
    setSuccessId(id);
    setTimeout(() => {
      setRecs(prev => prev.filter(r => r.id !== id));
      setSuccessId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-heading font-extrabold text-primaryText">AI Recommendations Board</h2>
        <p className="text-xs text-secondaryText">
          Prioritized product actions synthesized from Hindsight Memory & GPT-OSS-120B.
        </p>
      </div>

      {/* Kanban Board columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colRecs = recs.filter(r => r.priority === col);
          return (
            <div key={col} className="bg-secondaryBg/30 border border-cardBorder rounded-2xl p-4 space-y-4">
              {/* Column header */}
              <div className={`p-2.5 bg-cardBg rounded-xl flex justify-between items-center shadow-sm ${getPriorityColor(col)}`}>
                <span className="text-xs font-heading font-bold uppercase tracking-wider">{col}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-secondaryBg text-primaryText rounded-full">
                  {colRecs.length} Action{colRecs.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3">
                {colRecs.map((rec) => (
                  <div 
                    key={rec.id} 
                    className={`bg-cardBg border border-cardBorder rounded-xl p-4 shadow-sm hover:shadow-md transition-all space-y-3.5 relative overflow-hidden ${
                      successId === rec.id ? 'border-success ring-1 ring-success/30 opacity-70' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-heading font-bold text-xs text-primaryText leading-snug max-w-[75%]">
                        {rec.title}
                      </h4>
                      <span className="text-[9px] font-bold text-success flex items-center gap-0.5 shrink-0 bg-success/5 px-1.5 py-0.5 rounded">
                        <Award className="w-3 h-3 animate-pulse" /> {rec.confidence}%
                      </span>
                    </div>

                    <p className="text-[11px] text-secondaryText leading-relaxed">
                      {rec.description}
                    </p>

                    {/* Stats table inner */}
                    <div className="grid grid-cols-2 gap-2 bg-secondaryBg/40 p-2.5 rounded-lg border border-cardBorder text-[10px]">
                      <div>
                        <span className="text-secondaryText text-[8px] uppercase font-semibold block">Affected Users</span>
                        <strong className="text-primaryText font-bold">{rec.affected_users.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-secondaryText text-[8px] uppercase font-semibold block">Revenue Risk</span>
                        <strong className="text-danger font-bold">${rec.revenue_risk.toLocaleString()}</strong>
                      </div>
                    </div>

                    {/* Action recommendations details */}
                    <div className="space-y-1 text-[10px]">
                      <span className="text-secondaryText uppercase font-bold text-[8px]">Business Impact</span>
                      <p className="text-primaryText font-medium leading-relaxed">{rec.business_impact}</p>
                    </div>

                    <div className="space-y-1 text-[10px] p-2 bg-primaryAccent/5 rounded-lg border border-primaryAccent/10">
                      <span className="text-primaryAccent uppercase font-bold text-[8px]">Suggested Action</span>
                      <p className="text-primaryText font-semibold leading-relaxed truncate">{rec.suggested_action}</p>
                    </div>

                    {/* Footer resolve button */}
                    <div className="pt-3 border-t border-cardBorder flex justify-end">
                      <button
                        onClick={() => handleResolve(rec.id)}
                        disabled={successId === rec.id}
                        className="flex items-center gap-1 text-[10px] text-primaryAccent font-bold hover:underline"
                      >
                        {successId === rec.id ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                            <span className="text-success">Executing action...</span>
                          </>
                        ) : (
                          <>
                            <span>Prioritize Action</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {colRecs.length === 0 && (
                  <p className="text-[10px] text-secondaryText text-center py-6">All action recommendations executed.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
