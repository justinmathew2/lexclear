'use client';

import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, X, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lexclear_gemini_api_key') || '';
    setApiKey(stored);
    if (stored) setIsSaved(true);
  }, []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (cleanKey) {
      localStorage.setItem('lexclear_gemini_api_key', cleanKey);
      setIsSaved(true);
      onKeySaved(cleanKey);
      onClose();
    } else {
      localStorage.removeItem('lexclear_gemini_api_key');
      setIsSaved(false);
      onKeySaved('');
      onClose();
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-title"
      aria-describedby="api-key-desc"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Close API Key Configuration Modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Key className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 id="api-key-title" className="text-lg font-semibold text-slate-100">Gemini API Key</h3>
            <p id="api-key-desc" className="text-xs text-slate-400">Configure your key for instant document parsing</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="api-key-input" className="block text-xs font-medium text-slate-300 mb-1.5">
              Enter Gemini API Key
            </label>
            <input
              id="api-key-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              aria-label="Gemini API Key input field"
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              Your key is stored locally in your browser session only.
            </p>
          </div>

          {isSaved && (
            <div role="status" aria-live="polite" className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-lg">
              <CheckCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              API key active in browser session
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
