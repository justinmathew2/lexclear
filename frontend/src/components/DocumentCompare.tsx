'use client';

import React, { useState } from 'react';
import { ComparisonResult } from '@/types';
import { Layers, ArrowRight, ShieldAlert, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { compareDocuments } from '@/lib/api';

interface DocumentCompareProps {
  docAId: string;
  docBId: string;
  docATitle: string;
  docBTitle: string;
}

export const DocumentCompare: React.FC<DocumentCompareProps> = ({
  docAId,
  docBId,
  docATitle,
  docBTitle,
}) => {
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await compareDocuments(docAId, docBId);
      setComparisonResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to compare documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Compare Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Dual-Document Side-by-Side Comparison</h3>
            <p className="text-xs text-slate-400">
              Compare contract drafts or lease terms against standards to see what changed and who it favors.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunComparison}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-950/50 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Layers className="w-4 h-4" />
          )}
          <span>{comparisonResult ? 'Re-run Comparison' : 'Analyze Differences'}</span>
        </button>
      </div>

      {/* Document Pair Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-purple-400 shrink-0" />
          <div className="overflow-hidden">
            <span className="text-[10px] text-purple-400 font-mono uppercase">Document A</span>
            <h4 className="text-xs font-semibold text-slate-100 truncate">{docATitle}</h4>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="overflow-hidden">
            <span className="text-[10px] text-indigo-400 font-mono uppercase">Document B</span>
            <h4 className="text-xs font-semibold text-slate-100 truncate">{docBTitle}</h4>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/50 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Executive Comparison Summary */}
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-3xl p-6 space-y-3 shadow-xl">
            <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Comparison Summary
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {comparisonResult.comparison.comparison_summary}
            </p>
          </div>

          {/* Differences Matrix Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Detailed Difference Breakdown
              </h4>
            </div>

            <div className="divide-y divide-slate-800/80">
              {comparisonResult.comparison.differences.map((diff, idx) => (
                <div key={idx} className="p-5 space-y-3 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-sm font-semibold text-slate-100">{diff.topic}</h5>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-medium rounded-lg">
                        Favors: {diff.who_it_favors}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border uppercase ${
                        diff.importance_level === 'HIGH'
                          ? 'bg-rose-950/60 border-rose-500/30 text-rose-300'
                          : 'bg-amber-950/60 border-amber-500/30 text-amber-300'
                      }`}>
                        {diff.importance_level}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-purple-400 font-mono font-semibold">Doc A:</span>
                      <p className="text-slate-300">{diff.doc_a_term}</p>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-indigo-400 font-mono font-semibold">Doc B:</span>
                      <p className="text-slate-300">{diff.doc_b_term}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 italic bg-slate-900 p-2.5 rounded-xl border border-slate-800/60">
                    💡 <strong>Analysis:</strong> {diff.difference_analysis}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Line Takeaway */}
          <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-6 space-y-2">
            <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Bottom-Line Recommendation
            </h4>
            <p className="text-xs text-purple-100/90 leading-relaxed">
              {comparisonResult.comparison.overall_takeaway}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
