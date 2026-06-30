"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { FeatureRequest } from '../../lib/seedData';
import { 
  ListTodo, Sparkles, TrendingUp, ThumbsUp, 
  Search, ArrowUpDown, ChevronRight, Activity, DollarSign
} from 'lucide-react';

export default function FeatureIntelligence() {
  const { features } = useStore();
  const [feats, setFeats] = useState<FeatureRequest[]>(features);
  const [sortBy, setSortBy] = useState<'popularity' | 'growth' | 'revenue'>('popularity');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle vote increase
  const handleVote = (id: string) => {
    setFeats(prev => prev.map(f => 
      f.id === id 
        ? { ...f, popularity_score: f.popularity_score + 1, revenue_impact: f.revenue_impact + 250 } 
        : f
    ));
  };

  // Sort and filter features
  const processedFeats = feats
    .filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.summary.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'growth') return b.growth_rate - a.growth_rate;
      if (sortBy === 'revenue') return b.revenue_impact - a.revenue_impact;
      return b.popularity_score - a.popularity_score;
    });

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case 'Critical': return 'bg-danger/10 text-danger border-danger/20';
      case 'High': return 'bg-warning/10 text-warning border-warning/20';
      case 'Medium': return 'bg-primaryAccent/10 text-primaryAccent border-primaryAccent/15';
      default: return 'bg-secondaryBg text-secondaryText border-cardBorder';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success/15 text-success';
      case 'In Progress': return 'bg-warning/15 text-warning';
      case 'Planned': return 'bg-primaryAccent/15 text-primaryAccent';
      default: return 'bg-secondaryBg text-secondaryText';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-cardBorder">
        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-primaryText">Feature Intelligence Board</h2>
          <p className="text-xs text-secondaryText">
            Prioritize feature boards based on user request popularity and projected revenue impacts.
          </p>
        </div>

        {/* Sort triggers */}
        <div className="flex items-center gap-1.5 bg-secondaryBg p-1.5 rounded-xl border border-cardBorder">
          <span className="text-[10px] font-bold text-secondaryText uppercase px-2">Sort:</span>
          {[
            { label: 'Popularity', val: 'popularity' },
            { label: 'Growth Rate', val: 'growth' },
            { label: 'Revenue Impact', val: 'revenue' }
          ].map((btn) => (
            <button
              key={btn.val}
              onClick={() => setSortBy(btn.val as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                sortBy === btn.val 
                  ? 'bg-cardBg text-primaryText shadow-sm' 
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondaryText" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter requested feature index..."
          className="w-full pl-10 pr-4 py-2 bg-cardBg border border-cardBorder rounded-xl text-xs focus:outline-none"
        />
      </div>

      {/* Leaderboard Grid */}
      <div className="bg-cardBg border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondaryBg/40 border-b border-cardBorder text-[10px] font-bold text-secondaryText uppercase tracking-wider">
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Feature Idea</th>
                <th className="py-3.5 px-6">Priority</th>
                <th className="py-3.5 px-6">Popularity Score</th>
                <th className="py-3.5 px-6">Growth Rate</th>
                <th className="py-3.5 px-6">Gated Revenue Est.</th>
                <th className="py-3.5 px-6">Release Status</th>
                <th className="py-3.5 px-6 text-right">Vote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder text-xs text-primaryText">
              {processedFeats.slice(0, 15).map((item, index) => (
                <tr key={item.id} className="hover:bg-secondaryBg/20 transition-colors">
                  <td className="py-4 px-6 font-bold text-gradient-primary">
                    #{index + 1}
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <div className="font-bold text-primaryText">{item.name}</div>
                    <div className="text-[10px] text-secondaryText truncate leading-relaxed mt-0.5">{item.summary}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 border rounded-md font-bold text-[9px] uppercase ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold">
                    {item.popularity_score} requests
                  </td>
                  <td className="py-4 px-6 font-semibold text-danger">
                    +{item.growth_rate}% MoM
                  </td>
                  <td className="py-4 px-6 font-bold text-success flex items-center mt-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {item.revenue_impact.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleVote(item.id)}
                      className="p-1.5 border border-cardBorder hover:border-primaryAccent/30 hover:bg-primaryAccent/5 rounded-xl transition-all hover:scale-105"
                      title="Add support vote"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-primaryAccent" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
