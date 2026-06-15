"use client";

import React, { useState } from 'react';
import { 
  FileText, Sparkles, Download, Calendar, Layers, 
  TrendingUp, CheckCircle, RefreshCw, ChevronRight 
} from 'lucide-react';

export default function ReportsCenter() {
  const [reportType, setReportType] = useState<'Weekly' | 'Monthly' | 'Quarterly' | 'Executive' | 'Investor'>('Executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);
  const [exportingType, setExportingType] = useState<'pdf' | 'csv' | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setReportData(null);
    setTimeout(() => {
      setReportData({
        title: `REVOXA ${reportType} Intelligence Report`,
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        stats: {
          totalIngested: 5120,
          growthRate: "+18.4% MoM",
          sentimentIndex: "78% Positive",
          activeIssues: 12
        },
        highlights: [
          "Identified active checkout timeout anomalies peaking during Stripe webhook calls.",
          "Onboarding activation bottlenecks traced to short invitation lifespan (2 hours).",
          "Slack real-time notification alert triggers successfully mapped to engineering teams."
        ],
        actions: [
          "Execute webhook asynchronous queuing database integration.",
          "Increase invitation link verification lifespans to 24 hours."
        ]
      });
      setIsGenerating(false);
    }, 1000);
  };

  const handleExport = (type: 'pdf' | 'csv') => {
    setExportingType(type);
    setTimeout(() => {
      setExportingType(null);
      alert(`Successfully downloaded ${reportType}_Report.${type.toUpperCase()}`);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-heading font-extrabold text-primaryText">Intelligence Reports Center</h2>
        <p className="text-xs text-secondaryText">
          Generate, review, and export PDF/CSV reports detailing vector memory trends and business risks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primaryAccent" />
            <h3 className="font-heading font-bold text-sm text-primaryText">Report Template Config</h3>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-secondaryText uppercase block">Select Report Category</label>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Weekly Summary', type: 'Weekly' },
                { label: 'Monthly Analytics', type: 'Monthly' },
                { label: 'Quarterly Audit', type: 'Quarterly' },
                { label: 'Executive Briefing', type: 'Executive' },
                { label: 'Investor Presentation', type: 'Investor' }
              ].map(opt => (
                <button
                  key={opt.type}
                  onClick={() => setReportType(opt.type as any)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border font-semibold flex justify-between items-center transition-all ${
                    reportType === opt.type 
                      ? 'bg-primaryAccent/5 border-primaryAccent text-primaryAccent' 
                      : 'border-cardBorder bg-transparent hover:bg-secondaryBg text-secondaryText'
                  }`}
                >
                  <span>{opt.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-primary hover:opacity-95 text-white rounded-xl text-xs font-semibold shadow-sm transition-transform active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Report Preview panel */}
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm col-span-2 space-y-4">
          {reportData ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-start pb-4 border-b border-cardBorder">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-primaryText">{reportData.title}</h3>
                  <span className="text-[10px] text-secondaryText">{reportData.date} · REVOXA AI Analysis</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={exportingType !== null}
                    className="flex items-center gap-1.5 px-3 py-2 border border-cardBorder hover:border-primaryAccent/30 rounded-xl text-[10px] font-bold text-secondaryText hover:text-primaryText"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {exportingType === 'pdf' ? 'Exporting...' : 'PDF'}
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={exportingType !== null}
                    className="flex items-center gap-1.5 px-3 py-2 border border-cardBorder hover:border-primaryAccent/30 rounded-xl text-[10px] font-bold text-secondaryText hover:text-primaryText"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {exportingType === 'csv' ? 'Exporting...' : 'CSV'}
                  </button>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Ingested logs', val: reportData.stats.totalIngested },
                  { label: 'MoM Growth', val: reportData.stats.growthRate },
                  { label: 'Sentiment Score', val: reportData.stats.sentimentIndex },
                  { label: 'Open Tickets', val: reportData.stats.activeIssues }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-secondaryBg/30 p-3 rounded-xl border border-cardBorder">
                    <span className="text-[9px] uppercase font-bold text-secondaryText block mb-1">{stat.label}</span>
                    <strong className="text-sm font-bold text-primaryText">{stat.val}</strong>
                  </div>
                ))}
              </div>

              {/* Executive Summary highlights */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">Executive Milestones</h4>
                <ul className="space-y-2 text-xs text-secondaryText leading-relaxed pl-4 list-disc">
                  {reportData.highlights.map((hl: string, idx: number) => (
                    <li key={idx} className="hover:text-primaryText transition-colors">{hl}</li>
                  ))}
                </ul>
              </div>

              {/* Proposed action list */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">Required Prioritized Actions</h4>
                <div className="space-y-2">
                  {reportData.actions.map((act: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-primaryAccent/5 border border-primaryAccent/10 rounded-xl text-xs text-primaryText font-semibold">
                      <CheckCircle className="w-4 h-4 text-primaryAccent shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 space-y-3.5">
              <FileText className="w-10 h-10 text-secondaryText animate-pulse-slow" />
              <div>
                <h4 className="font-heading font-extrabold text-sm text-primaryText">Report Preview Area</h4>
                <p className="text-xs text-secondaryText max-w-sm mt-1">Configure your timeframe parameters on the left and click 'Generate Report' to load the telemetry details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
