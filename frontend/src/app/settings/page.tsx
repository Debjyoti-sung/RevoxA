"use client";

import React, { useState } from 'react';
import { 
  Settings, Key, Sparkles, CreditCard, Users, 
  Database, ShieldCheck, Mail, PlusCircle, Copy, Eye, EyeOff, Lock 
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'api' | 'models' | 'billing'>('workspace');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeysList, setApiKeysList] = useState([
    { id: 'key-1', name: 'Production Scraper SDK', key: 'rev_live_a1b2c3d4e5f6g7h8i9j0', created: '2026-06-12' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `rev_live_${randomHex}`,
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeysList(prev => [...prev, newKey]);
    setNewKeyName('');
  };

  return (
    <div className="flex gap-6 animate-fade-in">
      
      {/* 1. VERTICAL SETTINGS MENU */}
      <aside className="w-56 space-y-1 bg-cardBg border border-cardBorder rounded-2xl p-3 shadow-sm h-fit shrink-0">
        {[
          { id: 'workspace', label: 'Workspace Details', icon: Settings },
          { id: 'api', label: 'API Credentials', icon: Key },
          { id: 'models', label: 'AI Model Settings', icon: Sparkles },
          { id: 'billing', label: 'Billing & Quotas', icon: CreditCard },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-primary text-white shadow-sm' 
                  : 'text-secondaryText hover:bg-secondaryBg hover:text-primaryText'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </aside>

      {/* 2. CONFIGURATION VIEWPANEL */}
      <div className="flex-1 bg-cardBg border border-cardBorder rounded-2xl p-6 shadow-sm min-h-[400px]">
        
        {/* TAB 1: WORKSPACE DETAILS */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-primaryText">General Workspace Config</h3>
              <p className="text-[10px] text-secondaryText">Update corporate names and email sync rules</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Workspace Brand Name</label>
                <input
                  type="text"
                  defaultValue="RevoxA"
                  className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl focus:outline-none border border-cardBorder font-medium text-primaryText"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Subdomain Slug URL</label>
                <input
                  type="text"
                  defaultValue="revoxa"
                  className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl focus:outline-none border border-cardBorder font-medium text-primaryText"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-cardBorder">
              <h4 className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">Default notification routes</h4>
              <div className="space-y-2 text-xs">
                {[
                  { label: "Dispatch real-time email digests to admins", defaultChecked: true },
                  { label: "Alert Slack webhook channels on critical sentiment drops", defaultChecked: true },
                  { label: "Archive CSV files reports once monthly", defaultChecked: false }
                ].map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={opt.defaultChecked} 
                      className="rounded text-primaryAccent focus:ring-primaryAccent w-4 h-4 border-cardBorder bg-secondaryBg" 
                    />
                    <span className="text-secondaryText font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: API CREDENTIALS */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-primaryText">API Key Generation</h3>
              <p className="text-[10px] text-secondaryText">Access vector indices via HTTP request headers</p>
            </div>

            {/* List keys */}
            <div className="space-y-3">
              {apiKeysList.map(item => (
                <div key={item.id} className="p-4 bg-secondaryBg/30 border border-cardBorder rounded-xl text-xs flex justify-between items-center">
                  <div className="space-y-1">
                    <strong className="text-primaryText">{item.name}</strong>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-secondaryText">
                      <span>{showApiKey ? item.key : 'rev_live_••••••••••••••••••••'}</span>
                      <button onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-secondaryText font-semibold">Created: {item.created}</span>
                </div>
              ))}
            </div>

            {/* Generate form */}
            <form onSubmit={handleGenerateKey} className="pt-4 border-t border-cardBorder flex gap-2">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key label (e.g. Discord pipeline app)..."
                className="flex-1 bg-secondaryBg px-3.5 py-2.5 rounded-xl text-xs focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-primary text-white text-xs font-semibold rounded-xl"
              >
                Generate Token
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: MODEL CONFIG */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-primaryText">AI Models & Reasoning Configuration</h3>
              <p className="text-[10px] text-secondaryText">Manage Groq completions temperature thresholds and embeddings dimensions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Active Completion Model</label>
                <select className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl border border-cardBorder font-semibold text-primaryText">
                  <option>openai/gpt-oss-120b (Groq API)</option>
                  <option>meta-llama/llama-3.1-70b-instruct</option>
                  <option>mistralai/mixtral-8x7b-instruct</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Embedding Model (pgvector compatibility)</label>
                <select className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl border border-cardBorder font-semibold text-primaryText">
                  <option>nomic-embed-text-v1.5 (768 dimensions)</option>
                  <option>bge-small-en-v1.5 (384 dimensions)</option>
                </select>
              </div>
            </div>

            <div className="p-4 border border-primaryAccent/20 bg-primaryAccent/5 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-primaryAccent font-bold text-[10px] uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Memory index security rules</span>
              </div>
              <p className="text-secondaryText leading-relaxed">
                Embedding vectors are automatically encrypted in transit and mapped with tenant UUID checks on Supabase database layers.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: BILLING & PLANS */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-primaryText">Billing Plan & Limits</h3>
              <p className="text-[10px] text-secondaryText">Manage your corporate quotas and check pending invoices</p>
            </div>

            {/* Plan Card */}
            <div className="p-5 bg-gradient-primary rounded-2xl text-white flex justify-between items-center shadow-md">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded">Current Tier</span>
                <h4 className="font-heading font-extrabold text-lg">Growth Enterprise</h4>
                <p className="text-xs text-white/90">Billing period: Renewing July 14, 2026</p>
              </div>
              <strong className="text-2xl font-extrabold">$249 <span className="text-xs font-semibold">/mo</span></strong>
            </div>

            {/* Quota logs */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold text-secondaryText uppercase block">Resource Consumption limits</span>
              <div className="space-y-3 text-xs">
                {[
                  { label: "Vector Ingestion quota limit", val: "5,120 / 50,000 requests (10%)" },
                  { label: "Active seats occupied", val: "4 / 20 members (20%)" },
                  { label: "Connected Slack webhooks", val: "9 / 10 integration adapters (90%)" }
                ].map((quota, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold text-primaryText text-[11px]">
                      <span>{quota.label}</span>
                      <span>{quota.val}</span>
                    </div>
                    <div className="w-full bg-secondaryBg h-2 rounded-full overflow-hidden border border-cardBorder">
                      <div className="h-full bg-primaryAccent rounded-full" style={{ width: quota.val.includes('10%') ? '10%' : quota.val.includes('20%') ? '20%' : '90%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
