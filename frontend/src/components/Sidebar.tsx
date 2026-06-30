"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Brain, 
  Network, 
  FolderKanban, 
  Sparkles, 
  TrendingUp, 
  ThumbsUp, 
  ListTodo, 
  ShieldAlert, 
  FileSpreadsheet, 
  Users, 
  Share2, 
  Settings,
  ChevronDown,
  ChevronRight,
  Database,
  Search,
  RefreshCw,
  GitCompare,
  History
} from 'lucide-react';

import { ROUTES } from '@/src/config/routes';

export default function Sidebar() {
  const pathname = usePathname();
  const [memoryOpen, setMemoryOpen] = useState(true);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Feedback Hub', path: ROUTES.FEEDBACK, icon: MessageSquare },
  ];

  const memoryItems = [
    { label: 'Memory Bank', path: ROUTES.MEMORY, icon: Database },
    { label: 'Recall Search', path: ROUTES.MEMORY_RECALL, icon: Search },
    { label: 'Reflection Center', path: ROUTES.MEMORY_REFLECT, icon: RefreshCw },
    { label: 'Mental Models', path: ROUTES.MEMORY_MODELS, icon: GitCompare },
    { label: 'Knowledge Evolution', path: ROUTES.MEMORY_EVOLUTION, icon: History },
  ];

  const mainItems = [
    { label: 'Memory Graph', path: ROUTES.MEMORY_GRAPH, icon: Network },
    { label: 'Themes & Clusters', path: ROUTES.THEMES, icon: FolderKanban },
    { label: 'AI Insights', path: ROUTES.INSIGHTS, icon: Sparkles },
    { label: 'Trend Intelligence', path: ROUTES.TRENDS, icon: TrendingUp },
    { label: 'Recommendations', path: ROUTES.RECOMMENDATIONS, icon: ThumbsUp },
    { label: 'Feature Requests', path: ROUTES.FEATURES, icon: ListTodo },
    { label: 'Issue Tracker', path: ROUTES.ISSUES, icon: ShieldAlert },
    { label: 'Reports', path: ROUTES.REPORTS, icon: FileSpreadsheet },
    { label: 'Workspace', path: ROUTES.WORKSPACE, icon: Users },
    { label: 'Integrations', path: ROUTES.INTEGRATIONS, icon: Share2 },
    { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
  ];

  return (
    <aside className="w-64 bg-cardBg border-r border-cardBorder h-screen flex flex-col fixed left-0 top-0 z-20">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-cardBorder flex items-center gap-3">
        <img
          src="/logo.png"
          alt="RevoxA Logo"
          className="h-9 w-auto object-contain"
        />
        <div>
          <h1 className="font-heading font-bold text-lg text-primaryText leading-none">RevoxA</h1>
          <span className="text-[10px] text-secondaryText tracking-wide uppercase font-semibold">Memory Intelligence</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {/* Core Nav */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active 
                  ? 'bg-gradient-primary text-white shadow-sm font-semibold' 
                  : 'text-secondaryText hover:bg-secondaryBg hover:text-primaryText'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-secondaryText'}`} />
              {item.label}
            </Link>
          );
        })}

        {/* Memory Intelligence Expandable Group */}
        <div className="pt-2">
          <button
            onClick={() => setMemoryOpen(!memoryOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-secondaryText uppercase tracking-wider hover:bg-secondaryBg transition-colors"
          >
            <span className="flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-primaryAccent" />
              Memory Suite
            </span>
            {memoryOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {memoryOpen && (
            <div className="mt-1 ml-3 pl-3 border-l border-cardBorder space-y-1">
              {memoryItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      active 
                        ? 'bg-secondaryBg text-primaryAccent font-semibold border-r-2 border-primaryAccent' 
                        : 'text-secondaryText hover:bg-secondaryBg hover:text-primaryText'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-primaryAccent' : 'text-secondaryText'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Nav Items */}
        <div className="pt-2 border-t border-cardBorder mt-2 space-y-1">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active 
                    ? 'bg-gradient-primary text-white shadow-sm font-semibold' 
                    : 'text-secondaryText hover:bg-secondaryBg hover:text-primaryText'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-secondaryText'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-cardBorder bg-secondaryBg/30 text-center">
        <p className="text-[10px] text-secondaryText">V1.2.0-Alpha · Light Theme</p>
      </div>
    </aside>
  );
}
