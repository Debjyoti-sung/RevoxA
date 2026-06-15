"use client";

import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Feedback } from '../../lib/seedData';
import {
  Search, Filter, Mail, MessageCircle, AlertCircle,
  Trash2, X, Sparkles, FileText, Activity, ChevronRight,
  ArrowUpRight, TrendingDown, TrendingUp, Minus,
  Zap, Globe, Hash, Clock, User, BarChart2, ShieldAlert,
  CheckCircle2, RefreshCw, LayoutGrid, List
} from 'lucide-react';

/* ── helpers ──────────────────────────────────────── */

const SOURCE_META: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  gmail:    { color: '#EA4335', bg: 'rgba(234,67,53,0.08)',   icon: <Mail      className="w-3.5 h-3.5" />, label: 'Gmail'    },
  slack:    { color: '#4A154B', bg: 'rgba(74,21,75,0.08)',    icon: <Hash      className="w-3.5 h-3.5" />, label: 'Slack'    },
  discord:  { color: '#5865F2', bg: 'rgba(88,101,242,0.08)', icon: <MessageCircle className="w-3.5 h-3.5" />, label: 'Discord'  },
  zendesk:  { color: '#03363D', bg: 'rgba(3,54,61,0.08)',    icon: <FileText  className="w-3.5 h-3.5" />, label: 'Zendesk'  },
  hubspot:  { color: '#FF7A59', bg: 'rgba(255,122,89,0.08)', icon: <Globe     className="w-3.5 h-3.5" />, label: 'HubSpot'  },
  intercom: { color: '#1F8FEB', bg: 'rgba(31,143,235,0.08)', icon: <Activity  className="w-3.5 h-3.5" />, label: 'Intercom' },
  csv:      { color: '#10B981', bg: 'rgba(16,185,129,0.08)', icon: <FileText  className="w-3.5 h-3.5" />, label: 'CSV'      },
  twitter:  { color: '#1DA1F2', bg: 'rgba(29,161,242,0.08)', icon: <Globe     className="w-3.5 h-3.5" />, label: 'Twitter'  },
  reddit:   { color: '#FF4500', bg: 'rgba(255,69,0,0.08)',   icon: <Globe     className="w-3.5 h-3.5" />, label: 'Reddit'   },
};

const getSourceMeta = (type: string) => SOURCE_META[type] || {
  color: '#6B7280', bg: 'rgba(107,114,128,0.08)',
  icon: <Activity className="w-3.5 h-3.5" />, label: type,
};

const SENTIMENT_CFG = {
  positive: { label: 'Positive', color: '#10B981', bg: 'rgba(16,185,129,0.10)', icon: <TrendingUp  className="w-3 h-3" /> },
  negative: { label: 'Negative', color: '#EF4444', bg: 'rgba(239,68,68,0.10)',  icon: <TrendingDown className="w-3 h-3" /> },
  neutral:  { label: 'Neutral',  color: '#6B7280', bg: 'rgba(107,114,128,0.10)', icon: <Minus       className="w-3 h-3" /> },
};

const SEVERITY_CFG = {
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  pulse: true },
  high:     { label: 'High',     color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', pulse: false },
  medium:   { label: 'Medium',   color: '#6366F1', bg: 'rgba(99,102,241,0.10)', pulse: false },
  low:      { label: 'Low',      color: '#10B981', bg: 'rgba(16,185,129,0.10)', pulse: false },
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  ['#6366F1','#8B5CF6'], ['#10B981','#06B6D4'], ['#F59E0B','#EF4444'],
  ['#EC4899','#8B5CF6'], ['#06B6D4','#6366F1'], ['#F97316','#EF4444'],
];

function avatarGradient(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const [a, b] = AVATAR_COLORS[idx];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

/* ── component ────────────────────────────────────── */

export default function FeedbackHub() {
  const {
    feedbacks, clusters,
    setSearchText, searchText,
    sourceFilter, sentimentFilter, severityFilter, featureFilter,
    setFilters, resetFilters, deleteMemory,
  } = useStore();

  const [selected, setSelected]   = useState<Feedback | null>(null);
  const [semantic, setSemantic]   = useState(false);
  const [viewMode, setViewMode]   = useState<'table' | 'cards'>('table');
  const [filterOpen, setFilterOpen] = useState(true);

  const filtered = useMemo(() => feedbacks.filter(item => {
    const q = searchText.toLowerCase();
    const matchSearch =
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.customer_name.toLowerCase().includes(q) ||
      item.customer_email.toLowerCase().includes(q);
    return matchSearch
      && (sourceFilter   === 'all' || item.source_type === sourceFilter)
      && (sentimentFilter=== 'all' || item.sentiment   === sentimentFilter)
      && (severityFilter === 'all' || item.severity    === severityFilter)
      && (featureFilter  === 'all' || item.feature_tag === featureFilter);
  }), [feedbacks, searchText, sourceFilter, sentimentFilter, severityFilter, featureFilter]);

  const activeFilters = [sourceFilter, sentimentFilter, severityFilter, featureFilter].filter(f => f !== 'all').length;

  const relatedFeedback = (fb: Feedback) =>
    feedbacks.filter(f => f.id !== fb.id && f.cluster_id === fb.cluster_id).slice(0, 3);

  /* stats strip */
  const criticalCount  = filtered.filter(f => f.severity  === 'critical').length;
  const negativeCount  = filtered.filter(f => f.sentiment === 'negative').length;
  const positiveCount  = filtered.filter(f => f.sentiment === 'positive').length;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-primaryText tracking-tight">
            Feedback Hub
          </h2>
          <p className="text-xs text-secondaryText mt-0.5">
            AI-analyzed customer signals from all connected channels
          </p>
        </div>
        {/* view toggle */}
        <div className="flex items-center gap-2 bg-white border border-cardBorder rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-primaryAccent text-white shadow-sm' : 'text-secondaryText hover:text-primaryText'}`}
            title="Table view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-primaryAccent text-white shadow-sm' : 'text-secondaryText hover:text-primaryText'}`}
            title="Card view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Signals', value: feedbacks.length, icon: <BarChart2 className="w-4 h-4" />, color: '#6366F1', bg: 'rgba(99,102,241,0.08)' },
          { label: 'Critical Issues', value: criticalCount, icon: <ShieldAlert className="w-4 h-4" />, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
          { label: 'Negative Signals', value: negativeCount, icon: <TrendingDown className="w-4 h-4" />, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Positive Signals', value: positiveCount, icon: <CheckCircle2 className="w-4 h-4" />, color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-cardBorder rounded-2xl p-4 shadow-sm flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-secondaryText uppercase tracking-wider">{s.label}</p>
              <p className="font-heading font-bold text-lg text-primaryText leading-none mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTER PANEL ── */}
      <div className="bg-white border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
        {/* filter header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-secondaryBg/30 transition-colors"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <div className="flex items-center gap-2.5">
            <Filter className="w-3.5 h-3.5 text-primaryAccent" />
            <span className="text-xs font-bold text-primaryText">Filters &amp; Search</span>
            {activeFilters > 0 && (
              <span className="px-2 py-0.5 bg-primaryAccent text-white rounded-full text-[10px] font-bold">
                {activeFilters} active
              </span>
            )}
          </div>
          <ChevronRight className={`w-4 h-4 text-secondaryText transition-transform ${filterOpen ? 'rotate-90' : ''}`} />
        </div>

        {filterOpen && (
          <div className="px-5 pb-5 border-t border-cardBorder space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondaryText" />
                <input
                  type="text"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="Search by topic, customer name, email, or content..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondaryBg rounded-xl text-xs text-primaryText focus:outline-none focus:ring-2 focus:ring-primaryAccent/30 transition-all placeholder:text-secondaryText/60"
                />
              </div>
              {/* Semantic AI toggle */}
              <button
                onClick={() => setSemantic(!semantic)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  semantic ? 'bg-gradient-primary text-white shadow-md scale-105' : 'bg-secondaryBg text-secondaryText hover:text-primaryText border border-cardBorder'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${semantic ? 'animate-pulse' : ''}`} />
                Semantic Mode {semantic ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Source', key: 'source', val: sourceFilter, opts: [['all','All Sources'],['gmail','Gmail'],['slack','Slack'],['discord','Discord'],['zendesk','Zendesk'],['hubspot','HubSpot'],['intercom','Intercom']] },
                { label: 'Sentiment', key: 'sentiment', val: sentimentFilter, opts: [['all','All'],['positive','Positive'],['neutral','Neutral'],['negative','Negative']] },
                { label: 'Severity', key: 'severity', val: severityFilter, opts: [['all','All'],['low','Low'],['medium','Medium'],['high','High'],['critical','Critical']] },
                { label: 'Feature Tag', key: 'feature', val: featureFilter, opts: [['all','All Features'],['Billing','Billing'],['Onboarding','Onboarding'],['Integrations','Integrations'],['Reporting','Reporting'],['UI UX','UI/UX']] },
              ].map(({ label, key, val, opts }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondaryText uppercase tracking-widest">{label}</label>
                  <select
                    value={val}
                    onChange={e => setFilters({ [key]: e.target.value })}
                    className="w-full px-3 py-2 bg-secondaryBg border border-cardBorder rounded-xl text-xs text-primaryText focus:outline-none focus:ring-2 focus:ring-primaryAccent/30 transition-all appearance-none cursor-pointer"
                  >
                    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-cardBorder text-secondaryText hover:text-danger hover:border-danger/30 hover:bg-danger/5 rounded-xl text-xs font-semibold transition-all"
                >
                  <RefreshCw className="w-3 h-3" /> Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FEEDBACK CONTENT ── */}
      <div className="bg-white border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
        {/* table header */}
        <div className="px-6 py-4 border-b border-cardBorder flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primaryAccent/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primaryAccent" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-primaryText">Feedback Log</h3>
              <p className="text-[10px] text-secondaryText">
                Showing <strong className="text-primaryText">{filtered.length}</strong> of <strong className="text-primaryText">{feedbacks.length}</strong> signals
              </p>
            </div>
          </div>
          {activeFilters > 0 && (
            <span className="text-[10px] font-semibold text-primaryAccent bg-primaryAccent/10 px-2.5 py-1 rounded-full">
              {activeFilters} filter{activeFilters > 1 ? 's' : ''} applied
            </span>
          )}
        </div>

        {viewMode === 'table' ? (
          /* ── TABLE VIEW ── */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: 'linear-gradient(to right, #FAFBFF, #F5F7FF)' }} className="border-b border-cardBorder">
                  {['Customer','Feedback Signal','Channel','Sentiment','Severity','Date',''].map(col => (
                    <th key={col} className="py-3 px-5 text-[10px] font-bold text-secondaryText uppercase tracking-widest whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="w-8 h-8 text-cardBorder" />
                        <p className="text-sm font-semibold text-secondaryText">No feedback matches your filters</p>
                        <button onClick={resetFilters} className="text-xs text-primaryAccent hover:underline">Clear all filters</button>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((item, idx) => {
                  const src  = getSourceMeta(item.source_type);
                  const sent = SENTIMENT_CFG[item.sentiment as keyof typeof SENTIMENT_CFG] || SENTIMENT_CFG.neutral;
                  const sev  = SEVERITY_CFG[item.severity as keyof typeof SEVERITY_CFG] || SEVERITY_CFG.low;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className="border-b border-cardBorder/60 row-hover cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${idx * 0.02}s` }}
                    >
                      {/* Customer */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm"
                            style={{ background: avatarGradient(item.customer_name) }}
                          >
                            {getInitials(item.customer_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-primaryText whitespace-nowrap">{item.customer_name}</p>
                            <p className="text-[10px] text-secondaryText truncate max-w-[120px]">{item.customer_email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Feedback Signal */}
                      <td className="py-3.5 px-5 max-w-xs">
                        <p className="font-semibold text-xs text-primaryText line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-secondaryText line-clamp-1 mt-0.5 leading-relaxed">{item.content}</p>
                      </td>

                      {/* Channel */}
                      <td className="py-3.5 px-5">
                        <span
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit whitespace-nowrap"
                          style={{ background: src.bg, color: src.color }}
                        >
                          {src.icon}
                          {src.label}
                        </span>
                      </td>

                      {/* Sentiment */}
                      <td className="py-3.5 px-5">
                        <span
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit whitespace-nowrap"
                          style={{ background: sent.bg, color: sent.color }}
                        >
                          {sent.icon}
                          {sent.label}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit whitespace-nowrap ${sev.pulse ? 'animate-pulse' : ''}`}
                          style={{ background: sev.bg, color: sev.color }}
                        >
                          {sev.pulse && <span className="w-1.5 h-1.5 rounded-full animate-blink-dot" style={{ background: sev.color }} />}
                          {sev.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-5">
                        <span className="flex items-center gap-1 text-[10px] text-secondaryText whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setSelected(item)}
                            className="p-1.5 text-secondaryText hover:text-primaryAccent rounded-lg hover:bg-primaryAccent/5 transition-all"
                            title="View details"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMemory(item.id)}
                            className="p-1.5 text-secondaryText hover:text-danger rounded-lg hover:bg-danger/5 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── CARD VIEW ── */
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-3 py-16 text-center">
                <Search className="w-8 h-8 text-cardBorder mx-auto mb-3" />
                <p className="text-sm font-semibold text-secondaryText">No feedback matches your filters</p>
              </div>
            ) : filtered.map((item, idx) => {
              const src  = getSourceMeta(item.source_type);
              const sent = SENTIMENT_CFG[item.sentiment as keyof typeof SENTIMENT_CFG] || SENTIMENT_CFG.neutral;
              const sev  = SEVERITY_CFG[item.severity as keyof typeof SEVERITY_CFG] || SEVERITY_CFG.low;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="bg-white border border-cardBorder rounded-2xl p-4 cursor-pointer hover:border-primaryAccent/30 hover:shadow-md transition-all animate-fade-in group"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: avatarGradient(item.customer_name) }}>
                        {getInitials(item.customer_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-primaryText">{item.customer_name}</p>
                        <p className="text-[10px] text-secondaryText">{item.customer_email}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ background: src.bg, color: src.color }}>
                      {src.icon} {src.label}
                    </span>
                  </div>

                  <p className="font-bold text-xs text-primaryText line-clamp-1 mb-1">{item.title}</p>
                  <p className="text-[10px] text-secondaryText line-clamp-2 leading-relaxed mb-3">{item.content}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ background: sent.bg, color: sent.color }}>
                      {sent.icon} {sent.label}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${sev.pulse ? 'animate-pulse' : ''}`} style={{ background: sev.bg, color: sev.color }}>
                      {sev.label}
                    </span>
                    <span className="text-[10px] text-secondaryText ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-cardBorder flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-primaryAccent bg-primaryAccent/8 px-2 py-0.5 rounded">
                      {item.feature_tag}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => { e.stopPropagation(); deleteMemory(item.id); }} className="p-1 text-secondaryText hover:text-danger rounded transition-colors" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <ArrowUpRight className="w-3.5 h-3.5 text-primaryAccent" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── DETAIL DRAWER ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(15,20,35,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="flex-1" onClick={() => setSelected(null)} />

          <div className="w-[520px] bg-white h-full flex flex-col shadow-2xl overflow-y-auto animate-slide-in border-l border-cardBorder">

            {/* drawer top bar */}
            <div className="sticky top-0 bg-white border-b border-cardBorder px-6 py-4 z-10 flex items-start justify-between">
              <div className="space-y-1 max-w-[85%]">
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-primaryAccent bg-primaryAccent/10 px-2.5 py-1 rounded-full">
                  <Zap className="w-2.5 h-2.5" /> Feedback Details · {selected.id}
                </span>
                <h3 className="font-heading font-extrabold text-sm text-primaryText leading-snug">{selected.title}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-secondaryBg rounded-xl text-secondaryText hover:text-primaryText transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1">

              {/* Customer card */}
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-cardBorder" style={{ background: 'linear-gradient(135deg, #FAFBFF, #F5F7FF)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md" style={{ background: avatarGradient(selected.customer_name) }}>
                  {getInitials(selected.customer_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-primaryText">{selected.customer_name}</h4>
                  <p className="text-[10px] text-secondaryText">{selected.customer_email}</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: getSourceMeta(selected.source_type).bg, color: getSourceMeta(selected.source_type).color }}>
                  {getSourceMeta(selected.source_type).icon}
                  {getSourceMeta(selected.source_type).label}
                </span>
              </div>

              {/* Original message */}
              <div>
                <p className="text-[10px] font-bold text-secondaryText uppercase tracking-widest mb-2">Original Ingest Message</p>
                <blockquote className="text-xs text-primaryText bg-secondaryBg/40 p-4 rounded-xl border border-cardBorder leading-relaxed border-l-4 border-l-primaryAccent/30">
                  "{selected.content}"
                </blockquote>
              </div>

              {/* AI Summary */}
              <div className="p-4 rounded-2xl border border-primaryAccent/20" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-primaryAccent uppercase tracking-wider">AI Hindsight Analysis</span>
                </div>
                <p className="text-xs text-primaryText leading-relaxed">
                  Customer experiences issues with <strong className="text-primaryText">{selected.feature_tag}</strong>. This feedback was classified with sentiment score of{' '}
                  <strong style={{ color: (SENTIMENT_CFG[selected.sentiment as keyof typeof SENTIMENT_CFG] || SENTIMENT_CFG.neutral).color }}>
                    {selected.sentiment_score}
                  </strong>
                  {' '}and routed to the <em>{selected.severity}</em> priority queue for product team review.
                </p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'Sentiment',
                    content: (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg w-fit"
                        style={{ background: (SENTIMENT_CFG[selected.sentiment as keyof typeof SENTIMENT_CFG] || SENTIMENT_CFG.neutral).bg, color: (SENTIMENT_CFG[selected.sentiment as keyof typeof SENTIMENT_CFG] || SENTIMENT_CFG.neutral).color }}>
                        {(SENTIMENT_CFG[selected.sentiment as keyof typeof SENTIMENT_CFG] || SENTIMENT_CFG.neutral).icon}
                        {selected.sentiment} ({selected.sentiment_score})
                      </span>
                    )
                  },
                  {
                    label: 'Severity',
                    content: (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg w-fit"
                        style={{ background: (SEVERITY_CFG[selected.severity as keyof typeof SEVERITY_CFG] || SEVERITY_CFG.low).bg, color: (SEVERITY_CFG[selected.severity as keyof typeof SEVERITY_CFG] || SEVERITY_CFG.low).color }}>
                        {selected.severity}
                      </span>
                    )
                  },
                  {
                    label: 'Cluster',
                    content: <span className="text-xs font-semibold text-primaryText">{clusters.find(c => c.id === selected.cluster_id)?.name || 'General'}</span>
                  },
                  {
                    label: 'Feature Tag',
                    content: <span className="text-xs font-semibold text-primaryAccent bg-primaryAccent/10 px-2 py-0.5 rounded-lg">{selected.feature_tag}</span>
                  },
                  {
                    label: 'Received',
                    content: <span className="text-xs text-primaryText font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-secondaryText" />{new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  },
                  {
                    label: 'Signal ID',
                    content: <span className="text-[10px] text-secondaryText font-mono">{selected.id}</span>
                  },
                ].map(({ label, content }) => (
                  <div key={label} className="p-3.5 bg-secondaryBg/40 rounded-xl border border-cardBorder">
                    <p className="text-[9px] uppercase font-bold text-secondaryText tracking-widest mb-1.5">{label}</p>
                    {content}
                  </div>
                ))}
              </div>

              {/* Related feedback */}
              {relatedFeedback(selected).length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-secondaryText uppercase tracking-widest mb-3">Related Feedback Signals</p>
                  <div className="space-y-2">
                    {relatedFeedback(selected).map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className="p-3.5 bg-white border border-cardBorder hover:border-primaryAccent/30 hover:shadow-sm rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-primaryText truncate">{item.title}</p>
                          <p className="text-[10px] text-secondaryText truncate mt-0.5">{item.content}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-secondaryText group-hover:text-primaryAccent flex-shrink-0 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { deleteMemory(selected.id); setSelected(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-danger/20 text-danger hover:bg-danger/5 rounded-xl text-xs font-bold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Signal
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-primary text-white rounded-xl text-xs font-bold transition-all hover:opacity-90"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Reviewed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
