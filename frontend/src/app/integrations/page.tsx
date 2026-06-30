"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Share2, Mail, MessageCircle, FileText, Sparkles, 
  HelpCircle, CheckCircle, AlertTriangle, ShieldX, ToggleLeft, ToggleRight 
} from 'lucide-react';

export default function Integrations() {
  const { integrations, toggleIntegration } = useStore();
  const [selectedInt, setSelectedInt] = useState<any | null>(null);

  const getSourceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('gmail')) return <Mail className="w-5 h-5 text-primaryAccent" />;
    if (lower.includes('slack')) return <MessageCircle className="w-5 h-5 text-secondaryAccent" />;
    if (lower.includes('zendesk')) return <FileText className="w-5 h-5 text-success" />;
    return <Share2 className="w-5 h-5 text-tertiaryAccent" />;
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'healthy': return <span className="flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" /> Healthy</span>;
      case 'warning': return <span className="flex items-center gap-1 text-[9px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full"><AlertTriangle className="w-3 h-3" /> Warning</span>;
      default: return <span className="flex items-center gap-1 text-[9px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-full"><ShieldX className="w-3 h-3" /> Error</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="space-y-1">
        <h2 className="text-2xl font-heading font-extrabold text-primaryText">Integrations Marketplace</h2>
        <p className="text-xs text-secondaryText">
          Connect your Gmail, Slack, customer support desks, and surveys databases to RevoxA Memory banks.
        </p>
      </div>

      {/* Grid of integration cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const isConnected = item.status === 'Connected' || item.status === 'Syncing';
          return (
            <div 
              key={item.id} 
              className={`bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isConnected ? 'border-primaryAccent/20' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondaryBg rounded-xl">
                      {getSourceIcon(item.name)}
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-xs text-primaryText leading-none mb-1">{item.name}</h4>
                      <span className="text-[9px] text-secondaryText uppercase font-semibold">{item.type}</span>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <button 
                    onClick={() => toggleIntegration(item.id)}
                    className="focus:outline-none"
                    title={isConnected ? "Disconnect Integration" : "Connect Integration"}
                  >
                    {isConnected ? (
                      <ToggleRight className="w-8 h-8 text-primaryAccent" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-secondaryText" />
                    )}
                  </button>
                </div>

                {/* Health & Sync stats */}
                {isConnected ? (
                  <div className="space-y-2.5 pt-2 border-t border-cardBorder">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-secondaryText font-medium">Integration Health</span>
                      {getHealthBadge(item.health)}
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-secondaryBg/30 p-2 rounded-lg text-center text-[9px] font-semibold">
                      <div>
                        <span className="text-secondaryText block">Synced</span>
                        <strong className="text-primaryText font-bold">{item.records_synced}</strong>
                      </div>
                      <div>
                        <span className="text-secondaryText block">Errors</span>
                        <strong className={item.errors > 0 ? "text-danger font-bold" : "text-success font-bold"}>
                          {item.errors}
                        </strong>
                      </div>
                      <div>
                        <span className="text-secondaryText block">Last Sync</span>
                        <strong className="text-primaryText font-bold truncate block">{item.last_sync}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-secondaryText py-3 italic">Integration disconnected. Toggle switch to restore synchronization.</p>
                )}
              </div>

              {/* Configure footer */}
              {isConnected && (
                <div className="pt-4 mt-4 border-t border-cardBorder flex justify-end">
                  <button 
                    onClick={() => setSelectedInt(item)}
                    className="text-xs text-primaryAccent font-bold hover:underline"
                  >
                    Configure Settings
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Config Settings Modal Popover */}
      {selectedInt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primaryText/20 backdrop-blur-sm animate-fade-in">
          <div className="w-[400px] bg-cardBg border border-cardBorder rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-cardBorder">
              <h3 className="font-heading font-extrabold text-sm text-primaryText">Configure {selectedInt.name}</h3>
              <button onClick={() => setSelectedInt(null)} className="text-xs font-semibold text-secondaryText hover:text-primaryText">
                Cancel
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Webhook Endpoint URL</label>
                <input
                  type="text"
                  value={`https://api.revoxa.io/v1/webhooks/${selectedInt.id}`}
                  disabled
                  className="w-full px-3 py-2 bg-secondaryBg rounded-lg text-secondaryText focus:outline-none border border-cardBorder"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Scraping Timeframe Interval</label>
                <select className="w-full px-3 py-2 bg-secondaryBg rounded-lg focus:outline-none border border-cardBorder font-medium text-primaryText">
                  <option>Every 5 minutes (Real-time)</option>
                  <option>Every 1 hour</option>
                  <option>Every 24 hours</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedInt(null)}
                className="w-full py-2.5 bg-gradient-primary text-white text-xs font-semibold rounded-xl"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
