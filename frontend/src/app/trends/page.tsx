"use client";

import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Sparkles, Calendar, Layers, ShieldAlert, Award } from 'lucide-react';

export default function TrendIntelligence() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // MoM prediction datasets (including actual vs forecasting projection)
  const forecastData = [
    { month: 'Jan', Ingested: 2400, Forecast: 2400 },
    { month: 'Feb', Ingested: 2900, Forecast: 2900 },
    { month: 'Mar', Ingested: 3300, Forecast: 3300 },
    { month: 'Apr', Ingested: 3800, Forecast: 3800 },
    { month: 'May', Ingested: 4200, Forecast: 4400 },
    { month: 'Jun (Now)', Ingested: 5120, Forecast: 5120 },
    { month: 'Jul (Proj)', Forecast: 5800 },
    { month: 'Aug (Proj)', Forecast: 6400 },
    { month: 'Sep (Proj)', Forecast: 7100 },
  ];

  const issueGrowthData = [
    { name: 'Stripe failures', June: 140, JulyProj: 180 },
    { name: 'Workspace Links', June: 90, JulyProj: 40 },
    { name: 'Slack webhooks', June: 85, JulyProj: 120 },
    { name: 'PDF downloads', June: 42, JulyProj: 25 },
    { name: 'CSV imports', June: 68, JulyProj: 45 }
  ];

  // Map representation of hour/day density matrix
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = ['9am', '12pm', '3pm', '6pm', '9pm'];
  
  // High-fidelity heatmap density levels: 0 (light) to 4 (deep indigo)
  const heatmapData = [
    [1, 2, 4, 3, 1], // Mon
    [2, 3, 4, 2, 1], // Tue
    [3, 4, 3, 2, 2], // Wed
    [4, 3, 2, 1, 1], // Thu
    [2, 2, 3, 4, 3], // Fri
  ];

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-primaryAccent';
      case 3: return 'bg-primaryAccent/70';
      case 2: return 'bg-primaryAccent/40';
      default: return 'bg-primaryAccent/15';
    }
  };

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center animate-shimmer">Loading intelligence model...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. FORECAST CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Forecast Area Chart */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-primaryText">AI Forecast Prediction Curves</h3>
              <p className="text-[10px] text-secondaryText">Projecting total ingested vectors for the next 90 days</p>
            </div>
            <span className="text-[10px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Forecast Margin: +/- 4.5%
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorIngested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4FB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="Ingested" name="Ingested Logs (Actual)" stroke="#6366F1" fillOpacity={1} fill="url(#colorIngested)" strokeWidth={2} />
                <Area type="monotone" dataKey="Forecast" name="Predictive Vector Path" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorForecast)" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ingestion Density Heatmap */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-heading font-extrabold text-sm text-primaryText">Weekly Ingest Hotspots</h3>
            <p className="text-[10px] text-secondaryText">Identifying peak load hours across connected webhooks</p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Grid display */}
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-semibold text-secondaryText">
              <span />
              {hours.map(h => <span key={h}>{h}</span>)}
            </div>

            {days.map((day, dIdx) => (
              <div key={day} className="grid grid-cols-6 gap-2 items-center text-center">
                <span className="text-[10px] font-bold text-secondaryText uppercase text-left">{day}</span>
                {hours.map((_, hIdx) => {
                  const level = heatmapData[dIdx][hIdx];
                  return (
                    <div
                      key={hIdx}
                      className={`h-7 rounded-lg ${getHeatmapColor(level)} border border-cardBg shadow-sm hover:scale-105 transition-transform cursor-pointer relative group`}
                    >
                      {/* Tooltip */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-20 bg-primaryText text-white text-[8px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                        Level {level} Density
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend indicator */}
          <div className="flex items-center gap-4 text-[9px] text-secondaryText pt-2">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primaryAccent/15 rounded" /> Low density</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primaryAccent rounded" /> High density</span>
          </div>
        </div>
      </div>

      {/* 2. ISSUE GROWTH/DECLINE CHART */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Growth Decline BarChart */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm col-span-2">
          <h3 className="font-heading font-extrabold text-sm text-primaryText mb-4">MoM Cluster Progression Forecast (June vs Proj July)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4FB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="June" name="June Volume (Actual)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="JulyProj" name="July Volume (AI Predicted)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prediction Cards */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-primaryText">Predictive Actions Required</h3>
          <div className="space-y-3">
            {[
              { title: "Stripe renewals escalation", risk: "Highly Rising (+28%)", color: "text-danger bg-danger/10 border-danger/15", icon: ShieldAlert },
              { title: "Workspace link lifespan rollout", risk: "Strongly Declining (-55%)", color: "text-success bg-success/10 border-success/15", icon: Award },
              { title: "Slack notifications delay mitigation", risk: "Moderately Rising (+41%)", color: "text-warning bg-warning/10 border-warning/15", icon: TrendingUp }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="p-3 border border-cardBorder rounded-xl space-y-1.5 text-xs hover:border-primaryAccent/30 transition-colors">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-primaryText">{card.title}</h4>
                    <Icon className="w-3.5 h-3.5 text-secondaryText" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase border inline-block ${card.color}`}>
                    {card.risk}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
