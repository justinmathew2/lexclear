'use client';

import React, { useState } from 'react';
import { LawyerQuestion } from '@/types';
import { HelpCircle, CheckSquare, Square, Printer } from 'lucide-react';

interface LawyerChecklistProps {
  questions: LawyerQuestion[];
}

export const LawyerChecklist: React.FC<LawyerChecklistProps> = ({ questions }) => {
  const [checkedIds, setCheckedIds] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedIds((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section aria-label="Lawyer Prep Checklist Section" className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Lawyer Prep Checklist</h3>
            <p className="text-xs text-slate-400">
              Document-specific questions to ask a licensed attorney before signing.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          aria-label="Print or Export Lawyer Prep Checklist"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Printer className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          Print / Export Checklist
        </button>
      </div>

      {/* Printable Checklist Items */}
      <div role="group" aria-label="Attorney questions list" className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            No specific attorney questions generated.
          </div>
        ) : (
          questions.map((item, idx) => {
            const isChecked = !!checkedIds[idx];

            return (
              <div
                key={idx}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onClick={() => toggleCheck(idx)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleCheck(idx);
                  }
                }}
                className={`cursor-pointer bg-slate-900/70 border rounded-2xl p-5 transition-all duration-200 space-y-3 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isChecked
                    ? 'border-indigo-500/40 bg-indigo-950/10 opacity-70'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 text-indigo-400 hover:text-indigo-300 transition-colors">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" aria-hidden="true" />
                    )}
                  </span>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 rounded-md">
                        {item.category || 'Legal Concern'}
                      </span>
                      {item.clause_reference && (
                        <span className="text-[10px] font-mono text-slate-400">
                          Ref: {item.clause_reference}
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm font-semibold text-slate-100 ${isChecked ? 'line-through text-slate-400' : ''}`}>
                      {item.question}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                      <strong className="text-indigo-300 font-medium">Why ask this: </strong>
                      {item.why_ask}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
