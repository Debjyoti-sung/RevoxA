"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  Brain, Sparkles, MessageSquare, Database, TrendingUp, ShieldAlert, 
  ThumbsUp, ListTodo, HelpCircle, Activity, Award, ArrowUpRight, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { feedbacks, clusters, features, recommendations, dashboardStats, notifications } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prepare chart datasets (representing scaled numbers from seedData analytics)
  const volumeData = [
    { name: 'Jan', gmail: 240, slack: 480, discord: 310 },
    { name: 'Feb', gmail: 280, slack: 520, discord: 350 },
    { name: 'Mar', gmail: 320, slack: 590, discord: 390 },
    { name: 'Apr', gmail: 350, slack: 650, discord: 420 },
    { name: 'May', gmail: 390, slack: 710, discord: 480 },
    { name: 'Jun', gmail: 420, slack: 780, discord: 520 },
  ];

  const sentimentData = [
    { name: 'Jan', Positive: 72, Neutral: 20, Negative: 8 },
    { name: 'Feb', Positive: 78, Neutral: 15, Negative: 7 },
    { name: 'Mar', Positive: 80, Neutral: 14, Negative: 6 },
    { name: 'Apr', Positive: 83, Neutral: 12, Negative: 5 },
    { name: 'May', Positive: 85, Neutral: 11, Negative: 4 },
    { name: 'Jun', Positive: 88, Neutral: 8, Negative: 4 },
  ];

  const sourceData = [
    { name: 'Gmail', value: 920, color: '#6366F1' },
    { name: 'Slack', value: 1420, color: '#8B5CF6' },
    { name: 'Discord', value: 850, color: '#06B6D4' },
    { name: 'Zendesk', value: 1100, color: '#10B981' },
    { name: 'HubSpot', value: 650, color: '#F59E0B' },
  ];

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center animate-shimmer">Loading dashboard...</div>;
  }

  // Filter top lists
  const criticalAlerts = feedbacks.filter(f => f.severity === 'critical').slice(0, 3);
  const topIssues = clusters.slice(0, 3);
  const topRequests = features.slice(0, 3);
  const activeRecs = recommendations.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. HERO AI INSIGHT CARD */}
      <div className="p-[1.5px] rounded-2xl bg-gradient-primary shadow-md">
        <div className="p-6 bg-glass rounded-[15px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primaryAccent animate-pulse" />
              <span className="text-[10px] text-primaryAccent font-bold uppercase tracking-wider bg-primaryAccent/10 px-2.5 py-1 rounded-full">
                AI Memory Insight Report
              </span>
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-primaryText leading-snug">
              RevoxA detected checkouts anomalies in European Stripe gateways.
            </h2>
            <p className="text-sm text-secondaryText max-w-2xl leading-relaxed">
              Analyzing over <strong className="text-primaryText">5,120 ingested signals</strong>, our long-term memory points to Stripe webhooks thread lock. 12% revenue is predicted at risk if webhook throughput parameters are not adjusted today.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 bg-white/50 p-4 rounded-xl border border-cardBorder">
            <div className="text-center">
              <p className="text-[10px] uppercase font-semibold text-secondaryText">AI Confidence</p>
              <p className="text-xl font-bold text-gradient-primary">96.4%</p>
            </div>
            <div className="text-center border-l border-cardBorder pl-4">
              <p className="text-[10px] uppercase font-semibold text-secondaryText">Trend Forecast</p>
              <p className="text-xl font-bold text-success">Positive</p>
            </div>
            <div className="text-center border-t border-cardBorder pt-2">
              <p className="text-[10px] uppercase font-semibold text-secondaryText">Mental Models</p>
              <p className="text-xl font-bold text-primaryText">{dashboardStats.activeMentalModels}</p>
            </div>
            <div className="text-center border-t border-l border-cardBorder pt-2 pl-4">
              <p className="text-[10px] uppercase font-semibold text-secondaryText">Memory Growth</p>
              <p className="text-xl font-bold text-primaryAccent">+{dashboardStats.memoryGrowth}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Feedback", value: dashboardStats.totalFeedback, suffix: "items", icon: MessageSquare, color: "text-primaryAccent bg-primaryAccent/10" },
          { label: "Total Memories", value: dashboardStats.totalMemories, suffix: "stored", icon: Database, color: "text-secondaryAccent bg-secondaryAccent/10" },
          { label: "Memory Growth", value: `+${dashboardStats.memoryGrowth}%`, suffix: "this month", icon: TrendingUp, color: "text-tertiaryAccent bg-tertiaryAccent/10" },
          { label: "Active Models", value: dashboardStats.activeMentalModels, suffix: "evolving", icon: Brain, color: "text-highlightGlow bg-highlightGlow/10" },
          { label: "Insights Generated", value: dashboardStats.aiInsightsGenerated, suffix: "summaries", icon: Sparkles, color: "text-warning bg-warning/10" },
          { label: "Reasoning Confidence", value: `${dashboardStats.reasoningConfidence}%`, suffix: "average", icon: Award, color: "text-success bg-success/10" },
          { label: "Critical Trends", value: dashboardStats.criticalTrendsCount, suffix: "active alerts", icon: ShieldAlert, color: "text-danger bg-danger/10" },
          { label: "Open Issues", value: dashboardStats.openIssuesCount, suffix: "in progress", icon: Activity, color: "text-primaryText bg-secondaryBg" },
          { label: "Sentiment Score", value: `${dashboardStats.sentimentScore}/100`, suffix: "positive index", icon: ShieldCheck, color: "text-success bg-success/10" },
          { label: "Feature Requests", value: dashboardStats.featureRequestsCount, suffix: "in queue", icon: ListTodo, color: "text-primaryAccent bg-primaryAccent/10" },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-cardBg border border-cardBorder rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-secondaryText uppercase tracking-wider">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-heading font-bold text-primaryText leading-none mb-1">{kpi.value}</p>
              <span className="text-[10px] text-secondaryText">{kpi.suffix}</span>
            </div>
          );
        })}
      </div>

      {/* 3. METRICS CHARTS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Feedback Volume */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm col-span-2">
          <h3 className="font-heading font-bold text-sm text-primaryText mb-4">Feedback Volume Ingestion (by channel)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorSlack" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDiscord" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4FB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="slack" name="Slack" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorSlack)" strokeWidth={2} />
                <Area type="monotone" dataKey="discord" name="Discord" stroke="#06B6D4" fillOpacity={1} fill="url(#colorDiscord)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Source Distribution */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm">
          <h3 className="font-heading font-bold text-sm text-primaryText mb-4">Feedback Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} layout="horizontal" align="center" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Sentiment Evolution */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm col-span-2">
          <h3 className="font-heading font-bold text-sm text-primaryText mb-4">Sentiment Index (12-Month Progression)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4FB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Positive" name="Positive %" stroke="#10B981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Negative" name="Negative %" stroke="#EF4444" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget: Live Alerts */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-sm text-primaryText">Real-time Ingest Alerts</h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-danger/5 border-l-3 border-danger rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-danger uppercase text-[9px] tracking-wide bg-danger/10 px-2 py-0.5 rounded">
                    {alert.severity}
                  </span>
                  <span className="text-[9px] text-secondaryText">Just now</span>
                </div>
                <h4 className="font-bold text-primaryText line-clamp-1">{alert.title}</h4>
                <p className="text-secondaryText line-clamp-2 leading-relaxed">{alert.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ACTIONS AND RECOMENDATIONS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Issue Clusters */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm text-primaryText">Top Problem Clusters</h3>
            <Link href="/themes" className="text-xs text-primaryAccent font-bold flex items-center gap-0.5 hover:underline">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {topIssues.map((issue) => (
              <div key={issue.id} className="flex justify-between items-center p-3 hover:bg-secondaryBg rounded-xl transition-colors">
                <div className="space-y-0.5 max-w-[70%]">
                  <h4 className="font-semibold text-xs text-primaryText truncate">{issue.name}</h4>
                  <p className="text-[10px] text-secondaryText truncate">{issue.summary}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${issue.growth_rate > 0 ? 'text-danger' : 'text-success'}`}>
                    {issue.growth_rate > 0 ? '+' : ''}{issue.growth_rate}%
                  </span>
                  <p className="text-[9px] text-secondaryText">{issue.total_feedback_count} feedback</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Requests Leaderboard */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm text-primaryText">Requested Leaderboard</h3>
            <Link href="/features" className="text-xs text-primaryAccent font-bold flex items-center gap-0.5 hover:underline">
              Leaderboard <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {topRequests.map((feat) => (
              <div key={feat.id} className="flex justify-between items-center p-3 hover:bg-secondaryBg rounded-xl transition-colors">
                <div className="space-y-0.5 max-w-[70%]">
                  <h4 className="font-semibold text-xs text-primaryText truncate">{feat.name}</h4>
                  <span className="text-[9px] text-primaryAccent font-bold bg-primaryAccent/10 px-1.5 py-0.5 rounded">
                    {feat.priority} Priority
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primaryText">{feat.popularity_score} upvotes</span>
                  <p className="text-[9px] text-success font-semibold">+${(feat.revenue_impact / 1000).toFixed(0)}k impact</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Action recommendations */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm text-primaryText">Prioritized Recommendations</h3>
            <Link href="/recommendations" className="text-xs text-primaryAccent font-bold flex items-center gap-0.5 hover:underline">
              Actions Board <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {activeRecs.map((rec) => (
              <div key={rec.id} className="p-3 border border-cardBorder hover:border-primaryAccent/30 hover:bg-primaryAccent/5 rounded-xl text-xs transition-colors space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-primaryText line-clamp-1">{rec.title}</h4>
                  <span className="text-[9px] font-bold text-success">{rec.confidence}% Confidence</span>
                </div>
                <p className="text-[10px] text-secondaryText line-clamp-2 leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
