"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Bell, Sparkles, ShieldAlert, TrendingUp, Settings, Trash2, CheckSquare } from 'lucide-react';

export default function Notifications() {
  const { notifications } = useStore();
  const [alerts, setAlerts] = useState<any[]>(notifications);
  const [filterType, setFilterType] = useState<'all' | 'ai' | 'issue' | 'trend' | 'system'>('all');

  const filteredAlerts = alerts.filter(a => 
    filterType === 'all' || a.type === filterType
  );

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Sparkles className="w-4 h-4 text-primaryAccent" />;
      case 'issue': return <ShieldAlert className="w-4.5 h-4.5 text-danger" />;
      case 'trend': return <TrendingUp className="w-4.5 h-4.5 text-success" />;
      default: return <Settings className="w-4.5 h-4.5 text-secondaryText" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'ai': return 'border-l-3 border-primaryAccent bg-primaryAccent/5';
      case 'issue': return 'border-l-3 border-danger bg-danger/5';
      case 'trend': return 'border-l-3 border-success bg-success/5';
      default: return 'border-l-3 border-secondaryText bg-secondaryBg/40';
    }
  };

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const handleDelete = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-cardBorder">
        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-primaryText">Real-time alerts center</h2>
          <p className="text-xs text-secondaryText">
            Track system integrations warning messages and critical AI anomaly alarms.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-2 border border-cardBorder hover:border-primaryAccent/30 hover:bg-primaryAccent/5 text-[10px] font-bold text-secondaryText hover:text-primaryText rounded-xl transition-colors"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-1.5 bg-secondaryBg p-1.5 rounded-xl border border-cardBorder w-fit">
        {[
          { label: 'All Alerts', val: 'all' },
          { label: 'AI Detections', val: 'ai' },
          { label: 'Issue tracker', val: 'issue' },
          { label: 'Trends metrics', val: 'trend' },
          { label: 'System status', val: 'system' }
        ].map(tab => (
          <button
            key={tab.val}
            onClick={() => setFilterType(tab.val as any)}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              filterType === tab.val 
                ? 'bg-cardBg text-primaryText shadow-sm' 
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-4 rounded-xl border border-cardBorder transition-all flex gap-3.5 items-start justify-between group ${getAlertColor(alert.type)} ${
              alert.read ? 'opacity-75' : 'shadow-sm'
            }`}
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-cardBg border border-cardBorder flex items-center justify-center shadow-sm">
                {getAlertIcon(alert.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-heading font-extrabold text-xs text-primaryText">{alert.title}</h4>
                  {!alert.read && (
                    <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-secondaryText leading-relaxed">{alert.message}</p>
                <span className="text-[10px] text-secondaryText/60 block">{alert.time}</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(alert.id)}
              className="p-1 text-secondaryText hover:text-danger rounded hover:bg-danger/5 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete alert"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center bg-cardBg border border-cardBorder rounded-2xl">
            <p className="text-xs text-secondaryText">No alerts logged in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
