'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileText, Sparkles, ArrowRight, Loader2, FileCode, CheckCircle2, Layers } from 'lucide-react';
import { fetchSamples, uploadDocument, loadSampleDocument } from '@/lib/api';
import { DEFAULT_SAMPLES } from '@/lib/sampleData';
import { ParsedDocument, SampleDoc } from '@/types';

interface DocumentUploaderProps {
  onDocumentLoaded: (doc: ParsedDocument) => void;
  onSecondDocumentLoaded?: (doc: ParsedDocument) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
  isCompareMode?: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentLoaded,
  onSecondDocumentLoaded,
  isLoading,
  setIsLoading,
  error,
  setError,
  isCompareMode = false,
}) => {
  const [samples, setSamples] = useState<SampleDoc[]>(DEFAULT_SAMPLES);

  const [dragActive, setDragActive] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [targetSlot, setTargetSlot] = useState<'A' | 'B'>('A');

  useEffect(() => {
    fetchSamples()
      .then(setSamples)
      .catch((err) => console.warn('Could not load sample list', err));
  }, []);

  const processFileUpload = async (file: File, slot: 'A' | 'B' = 'A') => {
    setIsLoading(true);
    setError(null);
    setLoadingText(`Parsing and indexing ${file.name}...`);

    try {
      const parsed = await uploadDocument(file);
      if (slot === 'B' && onSecondDocumentLoaded) {
        onSecondDocumentLoaded(parsed);
      } else {
        onDocumentLoaded(parsed);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze document.');
    } finally {
      setIsLoading(false);
      setLoadingText('');
    }
  };

  const handleSampleClick = async (sampleKey: string, slot: 'A' | 'B' = 'A') => {
    setIsLoading(true);
    setError(null);
    setLoadingText('Analyzing pre-seeded sample document...');

    try {
      const parsed = await loadSampleDocument(sampleKey);
      if (slot === 'B' && onSecondDocumentLoaded) {
        onSecondDocumentLoaded(parsed);
      } else {
        onDocumentLoaded(parsed);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load sample document.');
    } finally {
      setIsLoading(false);
      setLoadingText('');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileUpload(e.dataTransfer.files[0], targetSlot);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileUpload(e.target.files[0], targetSlot);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 backdrop-blur-xl ${
          dragActive
            ? 'border-emerald-400 bg-emerald-950/20 scale-[1.01]'
            : 'border-slate-700/80 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900/80'
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-950/50">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            ) : (
              <Upload className="w-8 h-8 text-emerald-400" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">
              {isLoading ? 'Processing Document...' : 'Upload Legal Document'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Drag and drop your PDF or DOCX agreement (Lease, NDA, Contract, ToS). Parsed in memory for privacy.
            </p>
          </div>

          {!isLoading && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg">PDF</span>
              <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg">DOCX</span>
              <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg">TXT</span>
            </div>
          )}

          {isLoading && (
            <p className="text-xs text-emerald-400 animate-pulse font-medium">{loadingText}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/50 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-400 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Seeded Sample Selector */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Or Try a Seeded Sample Document
            </h4>
          </div>
          {isCompareMode && (
            <div className="flex items-center gap-2 text-xs bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <span className="text-slate-400 px-1">Loading into:</span>
              <button
                onClick={() => setTargetSlot('A')}
                className={`px-2 py-0.5 rounded ${targetSlot === 'A' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400'}`}
              >
                Doc A
              </button>
              <button
                onClick={() => setTargetSlot('B')}
                className={`px-2 py-0.5 rounded ${targetSlot === 'B' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400'}`}
              >
                Doc B
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {samples.map((sample) => (
            <div
              key={sample.key}
              onClick={() => !isLoading && handleSampleClick(sample.key, targetSlot)}
              className="group cursor-pointer bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between space-y-3 shadow-md hover:shadow-emerald-950/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-xl text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {sample.title}
                    </h5>
                    <span className="text-[10px] text-emerald-400/80 font-mono">{sample.file_type} Sample</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{sample.description}</p>
              <div className="flex items-center justify-end text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
                <span>Analyze Sample</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
