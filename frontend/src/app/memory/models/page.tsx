"use client";

import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { MentalModel } from '../../../lib/seedData';
import { 
  GitCompare, Brain, Calendar, ShieldCheck, Award, 
  Sparkles, X, Plus, PlusCircle, CheckCircle2 
} from 'lucide-react';

export default function MentalModels() {
  const { mentalModels, createMentalModel } = useStore();
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSummary, setNewSummary] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSummary.trim()) return;
    createMentalModel(newName, newSummary);
    setNewName('');
    setNewSummary('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-primaryText">Mental Models Engine</h2>
          <p className="text-xs text-secondaryText">
            Long-term cognitive mapping of customer sentiments and system behaviors.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Build Mental Model</span>
        </button>
      </div>

      {/* Grid of Mental Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mentalModels.map((model) => (
          <div 
            key={model.id} 
            className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primaryAccent/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primaryAccent" />
                  <h4 className="font-heading font-extrabold text-sm text-primaryText">{model.name}</h4>
                </div>
                <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                  {model.memory_coverage}% coverage
                </span>
              </div>
              <p className="text-xs text-secondaryText leading-relaxed line-clamp-3">
                {model.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-cardBorder mt-4 flex items-center justify-between">
              <span className="text-[9px] text-secondaryText flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Updated: {new Date(model.last_updated).toLocaleDateString('en-US')}
              </span>
              <button
                onClick={() => setSelectedModel(model)}
                className="text-xs text-primaryAccent font-semibold hover:underline"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Model Creation Modal Popover */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primaryText/20 backdrop-blur-sm animate-fade-in">
          <div className="w-[450px] bg-cardBg border border-cardBorder rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-cardBorder">
              <h3 className="font-heading font-extrabold text-sm text-primaryText">Create Cognitive Model</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4 text-secondaryText hover:text-primaryText" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-secondaryText">Model Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Stripe Checkout Gateway timeouts"
                  className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primaryAccent"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-secondaryText">Semantic Summary</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe what categories and parameters this model should trace..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primaryAccent resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-primary text-white text-xs font-semibold rounded-xl hover:opacity-95 shadow-sm transition-opacity"
              >
                Compile and Initialize Model
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal Drawer */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primaryText/20 backdrop-blur-sm animate-fade-in">
          <div className="w-[500px] bg-cardBg border border-cardBorder rounded-2xl shadow-xl p-6 space-y-6 relative">
            <button 
              onClick={() => setSelectedModel(null)}
              className="absolute right-4 top-4 p-1.5 hover:bg-secondaryBg rounded-lg text-secondaryText"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-primaryAccent bg-primaryAccent/10 px-2 py-0.5 rounded">
                Cognitive Model Trace
              </span>
              <h3 className="font-heading font-extrabold text-base text-primaryText">
                {selectedModel.name}
              </h3>
            </div>

            <p className="text-xs text-secondaryText leading-relaxed">
              {selectedModel.summary}
            </p>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-3 bg-secondaryBg/30 p-4 rounded-xl border border-cardBorder">
              <div>
                <span className="text-[9px] uppercase font-bold text-secondaryText">Memory Coverage</span>
                <p className="text-lg font-bold text-gradient-primary">{selectedModel.memory_coverage}%</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-secondaryText">Last Updated</span>
                <p className="text-xs font-bold text-primaryText mt-1">
                  {new Date(selectedModel.last_updated).toLocaleDateString('en-US')}
                </p>
              </div>
            </div>

            {/* Coverage validation list */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">Active Reference Rules</h4>
              <div className="space-y-2 text-xs">
                {[
                  "Vector logs mapped from Stripe Gateway clusters",
                  "Gmail subscription inquiries parsing",
                  "Monthly reports telemetry logs"
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-secondaryBg/20 border border-cardBorder rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-primaryText">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
