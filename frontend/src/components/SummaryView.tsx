'use client';

import React from 'react';
import { SummaryData } from '@/types';
import { FileText, Users, Target, Lightbulb, CheckCircle, ShieldAlert } from 'lucide-react';

interface SummaryViewProps {
  summary: SummaryData;
  title: string;
  wordCount: number;
  clauseCount: number;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  title,
  wordCount,
  clauseCount,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Document Type</span>
            <h4 className="text-sm font-semibold text-slate-100">{summary.document_type}</h4>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Key Parties</span>
            <h4 className="text-sm font-semibold text-slate-100 truncate max-w-[200px]">{summary.key_parties}</h4>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Scope</span>
            <h4 className="text-sm font-semibold text-slate-100">{clauseCount} Clauses ({wordCount} words)</h4>
          </div>
        </div>
      </div>

      {/* Main Executive Summary */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-slate-100">Plain-Language Executive Summary</h3>
        </div>

        <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
          {summary.executive_summary}
        </div>
      </div>

      {/* Core Purpose & Analogy Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Purpose */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
            <Target className="w-4 h-4" />
            <span>Core Objective</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{summary.core_purpose}</p>
        </div>

        {/* Real-World Analogy */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 space-y-3 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
            <Lightbulb className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Real-World Analogy</span>
          </div>
          <p className="text-xs text-indigo-200/90 leading-relaxed italic">
            &quot;{summary.real_world_analogy}&quot;
          </p>
        </div>
      </div>
    </div>
  );
};
