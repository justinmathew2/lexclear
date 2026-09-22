import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div 
      role="alert"
      aria-live="polite"
      className="bg-amber-950/40 border-b border-amber-500/30 backdrop-blur-md px-4 py-2.5 text-xs text-amber-200/90 flex flex-wrap items-center justify-between gap-2 shadow-inner"
    >
      <div className="flex items-center gap-2 max-w-5xl">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
        <span>
          <strong className="text-amber-300 font-semibold">Important Legal Notice:</strong> LexClear is an AI-powered document clarity tool. All outputs are for <strong>informational purposes only</strong> and do not constitute legal advice, counsel, or representation.
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-amber-400 font-medium">
        <Info className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Always consult a qualified attorney for legal matters</span>
      </div>
    </div>
  );
};
