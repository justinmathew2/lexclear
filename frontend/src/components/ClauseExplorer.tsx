'use client';

import React, { useState } from 'react';
import { ClauseItem } from '@/types';
import { Search, ChevronDown, ChevronUp, FileCode, CheckCircle2, Clock, CreditCard, XCircle, AlertOctagon, RefreshCw } from 'lucide-react';

interface ClauseExplorerProps {
  clauses: ClauseItem[];
  highlightedClauseRef?: string | null;
}

const CATEGORIES = [
  { key: 'ALL', label: 'All Clauses' },
  { key: 'OBLIGATIONS', label: 'Obligations', icon: CheckCircle2 },
  { key: 'DEADLINES', label: 'Deadlines', icon: Clock },
  { key: 'PAYMENT_TERMS', label: 'Payment Terms', icon: CreditCard },
  { key: 'TERMINATION', label: 'Termination', icon: XCircle },
  { key: 'PENALTIES_LIABILITIES', label: 'Penalties & Liability', icon: AlertOctagon },
  { key: 'AUTO_RENEWAL', label: 'Auto-Renewal', icon: RefreshCw },
];

export const ClauseExplorer: React.FC<ClauseExplorerProps> = ({ clauses, highlightedClauseRef }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredClauses = clauses.filter((c) => {
    const matchesCategory = selectedCategory === 'ALL' || c.category.toUpperCase() === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plain_english_translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.original_excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.section_reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getBadgeStyle = (category: string) => {
    switch (category.toUpperCase()) {
      case 'PAYMENT_TERMS':
        return 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300';
      case 'AUTO_RENEWAL':
        return 'bg-amber-950/60 border-amber-500/30 text-amber-300';
      case 'PENALTIES_LIABILITIES':
        return 'bg-rose-950/60 border-rose-500/30 text-rose-300';
      case 'TERMINATION':
        return 'bg-purple-950/60 border-purple-500/30 text-purple-300';
      case 'DEADLINES':
        return 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clauses..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Clause Cards List */}
      <div className="space-y-4">
        {filteredClauses.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
            No clauses found matching your filter criteria.
          </div>
        ) : (
          filteredClauses.map((clause, idx) => {
            const isExpanded = expandedIndex === idx;
            const isHighlighted = highlightedClauseRef && clause.section_reference.toLowerCase().includes(highlightedClauseRef.toLowerCase());

            return (
              <div
                key={idx}
                className={`bg-slate-900/70 border rounded-2xl transition-all duration-200 overflow-hidden shadow-md ${
                  isHighlighted
                    ? 'border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Clause Header Bar */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getBadgeStyle(clause.category)}`}>
                      {clause.category.replace('_', ' ')}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                        <span>{clause.title}</span>
                        {clause.section_reference && (
                          <span className="text-xs font-mono text-slate-400 font-normal">
                            ({clause.section_reference})
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-200 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Clause Body */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-slate-800/60 pt-3 animate-in fade-in duration-200">
                    {/* Translation */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                        Plain English Meaning
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                        {clause.plain_english_translation}
                      </p>
                    </div>

                    {/* Key Impact */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                        Key Impact on You
                      </span>
                      <p className="text-xs text-teal-200/90 leading-relaxed bg-teal-950/20 p-3 rounded-xl border border-teal-500/20">
                        {clause.key_impact}
                      </p>
                    </div>

                    {/* Original Legal Excerpt */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-slate-500" />
                        Original Contract Excerpt
                      </span>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 leading-normal max-h-40 overflow-y-auto">
                        &quot;{clause.original_excerpt}&quot;
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
