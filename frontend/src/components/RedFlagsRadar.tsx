'use client';

import React from 'react';
import { RedFlag } from '@/types';
import { AlertTriangle, ShieldAlert, AlertOctagon, Info, Sparkles } from 'lucide-react';

interface RedFlagsRadarProps {
  redFlags: RedFlag[];
}

export const RedFlagsRadar: React.FC<RedFlagsRadarProps> = ({ redFlags }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'HIGH':
        return {
          badge: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
          icon: ShieldAlert,
          cardBorder: 'border-rose-900/60 bg-rose-950/10 hover:border-rose-700/80',
        };
      case 'MEDIUM':
        return {
          badge: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
          icon: AlertTriangle,
          cardBorder: 'border-amber-900/60 bg-amber-950/10 hover:border-amber-700/80',
        };
      default:
        return {
          badge: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
          icon: Info,
          cardBorder: 'border-blue-900/60 bg-blue-950/10 hover:border-blue-700/80',
        };
    }
  };

  const highCount = redFlags.filter((f) => f.severity.toUpperCase() === 'HIGH').length;
  const mediumCount = redFlags.filter((f) => f.severity.toUpperCase() === 'MEDIUM').length;

  return (
    <section aria-label="Red Flags & Risk Radar Section" className="space-y-6 animate-in fade-in duration-300">
      {/* Radar Summary Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
            <AlertOctagon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Red Flags &amp; Risk Radar</h3>
            <p className="text-xs text-slate-400">
              Scanned for unusual, one-sided, or high-risk clauses that could disadvantage you.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2" role="group" aria-label="Risk counts summary">
          <span className="px-3 py-1 bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl">
            {highCount} High Risk
          </span>
          <span className="px-3 py-1 bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl">
            {mediumCount} Medium Risk
          </span>
        </div>
      </div>

      {/* Red Flag Cards */}
      <div role="region" aria-live="polite" className="space-y-4">
        {redFlags.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            No significant red flags detected in this document.
          </div>
        ) : (
          redFlags.map((flag, idx) => {
            const style = getSeverityBadge(flag.severity);
            const Icon = style.icon;

            return (
              <article
                key={idx}
                aria-label={`Red flag: ${flag.clause_title}`}
                className={`border rounded-2xl p-5 space-y-4 transition-all duration-200 shadow-md ${style.cardBorder}`}
              >
                {/* Title & Severity */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0 text-rose-400" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">{flag.clause_title}</h4>
                      {flag.section_reference && (
                        <span className="text-[11px] font-mono text-slate-400">{flag.section_reference}</span>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border tracking-wider uppercase ${style.badge}`}>
                    {flag.severity} RISK
                  </span>
                </div>

                {/* Why Flagged */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">
                    Why This is Flagged
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    {flag.why_flagged}
                  </p>
                </div>

                {/* Negotiation Tip */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    Suggested Negotiation Tip / Counter-Clause
                  </span>
                  <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-950/20 p-3 rounded-xl border border-amber-500/20">
                    {flag.negotiation_tip}
                  </p>
                </div>

                {/* Original Snippet */}
                {flag.original_text && (
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
                    &quot;{flag.original_text}&quot;
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
