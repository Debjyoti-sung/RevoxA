"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  FolderKanban, Sparkles, TrendingUp, TrendingDown, 
  MessageSquare, ShieldAlert, ChevronRight, Play, Eye 
} from 'lucide-react';

export default function ThemesClusters() {
  const { clusters, feedbacks } = useStore();
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);

  // Group top 6 clusters for the visual bubble map
  const bubbleClusters = clusters.slice(0, 6);

  const getSentimentText = (score: number) => {
    if (score < -0.3) return { label: 'Frustrated', color: 'text-danger bg-danger/10' };
    if (score > 0.3) return { label: 'Delighted', color: 'text-success bg-success/10' };
    return { label: 'Neutral', color: 'text-secondaryText bg-secondaryBg' };
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'rising') return <TrendingUp className="w-4 h-4 text-danger" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-success" />;
    return <FolderKanban className="w-4 h-4 text-secondaryText" />;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. BUBBLE VISUALIZATION (VIBRANT GRADIENTS ON LIGHT CARD) */}
      <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-heading font-extrabold text-sm text-primaryText">Semantic Volume Map</h3>
          <p className="text-[10px] text-secondaryText">Bubble size represents overall customer feedback density</p>
        </div>

        <div className="h-64 bg-secondaryBg/25 border border-cardBorder rounded-xl relative flex items-center justify-center p-6 gap-6 flex-wrap overflow-hidden">
          {/* Animated gradient light circles */}
          {bubbleClusters.map((cluster, idx) => {
            // Sizing calculation based on feedback count
            const size = Math.min(130, Math.max(80, cluster.total_feedback_count * 0.7));
            const gradients = [
              'from-primaryAccent to-secondaryAccent',
              'from-secondaryAccent to-highlightGlow',
              'from-tertiaryAccent to-primaryAccent',
              'from-highlightGlow to-warning',
              'from-success to-tertiaryAccent',
              'from-warning to-danger'
            ];

            return (
              <div
                key={cluster.id}
                onClick={() => setSelectedClusterId(cluster.id)}
                style={{ width: size, height: size }}
                className={`rounded-full bg-gradient-to-tr ${gradients[idx % gradients.length]} p-[1.5px] cursor-pointer shadow-md transition-all hover:scale-110 active:scale-95 flex items-center justify-center text-center animate-float relative group`}
              >
                <div className="w-full h-full rounded-full bg-cardBg flex flex-col justify-center p-2 text-primaryText">
                  <span className="text-[9px] font-bold line-clamp-2 leading-tight mb-1">{cluster.name}</span>
                  <span className="text-[8px] text-secondaryText font-semibold">{cluster.total_feedback_count} logs</span>
                </div>

                {/* Popover tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-primaryText text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 text-[10px] shadow-lg pointer-events-none space-y-1">
                  <p className="font-bold">{cluster.name}</p>
                  <p className="text-white/80">Sentiment: {cluster.sentiment_score}</p>
                  <p className="text-white/80">Growth: {cluster.growth_rate}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SEMANTIC CLUSTER CARDS */}
      <div className="space-y-4">
        <h3 className="font-heading font-extrabold text-sm text-primaryText">Active Clusters ({clusters.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clusters.map((cluster) => {
            const sentiment = getSentimentText(cluster.sentiment_score);
            return (
              <div 
                key={cluster.id} 
                className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primaryAccent/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-heading font-extrabold text-xs text-primaryText leading-snug line-clamp-2">
                      {cluster.name}
                    </h4>
                    <span className="shrink-0 p-1 bg-secondaryBg rounded-lg">
                      {getTrendIcon(cluster.trend)}
                    </span>
                  </div>

                  <p className="text-xs text-secondaryText leading-relaxed line-clamp-3">
                    {cluster.summary}
                  </p>
                </div>

                {/* Metrics Row */}
                <div className="pt-4 border-t border-cardBorder mt-4 flex items-center justify-between text-[10px]">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-secondaryText block">Growth Rate</span>
                      <strong className={`font-bold ${cluster.growth_rate > 0 ? 'text-danger' : 'text-success'}`}>
                        {cluster.growth_rate > 0 ? '+' : ''}{cluster.growth_rate}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-secondaryText block">Volume density</span>
                      <strong className="text-primaryText font-bold">
                        {cluster.total_feedback_count} feedbacks
                      </strong>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${sentiment.color}`}>
                    {sentiment.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
