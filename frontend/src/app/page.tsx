'use client';

import React, { useState } from 'react';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { DocumentUploader } from '@/components/DocumentUploader';
import { SummaryView } from '@/components/SummaryView';
import { ClauseExplorer } from '@/components/ClauseExplorer';
import { RedFlagsRadar } from '@/components/RedFlagsRadar';
import { LawyerChecklist } from '@/components/LawyerChecklist';
import { DocumentCompare } from '@/components/DocumentCompare';
import { RagChat } from '@/components/RagChat';
import { ParsedDocument } from '@/types';
import { SAMPLE_NDA_PARSED } from '@/lib/sampleData';
import {
  Scale,
  FileText,
  AlertOctagon,
  HelpCircle,
  MessageSquare,
  Key,
  Plus,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  const [document, setDocument] = useState<ParsedDocument | null>(null);
  const [secondDocument, setSecondDocument] = useState<ParsedDocument | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'clauses' | 'red_flags' | 'checklist' | 'compare'>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [highlightedClauseRef, setHighlightedClauseRef] = useState<string | null>(null);

  const handleDocumentLoaded = (doc: ParsedDocument) => {
    setDocument(doc);
    setActiveTab('summary');
  };

  const handleSecondDocumentLoaded = (doc: ParsedDocument) => {
    setSecondDocument(doc);
    setActiveTab('compare');
  };

  const handleCompareTabClick = () => {
    if (!secondDocument) {
      setSecondDocument(SAMPLE_NDA_PARSED);
    }
    setActiveTab('compare');
  };


  const handleCitationClick = (sectionRef: string) => {
    setActiveTab('clauses');
    setHighlightedClauseRef(sectionRef);
    setTimeout(() => setHighlightedClauseRef(null), 4000);
  };

  const resetAll = () => {
    setDocument(null);
    setSecondDocument(null);
    setActiveTab('summary');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Legal Guardrail Notice */}
      <DisclaimerBanner />

      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetAll}>
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-950/60 text-slate-950 font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-100 via-emerald-200 to-teal-400 bg-clip-text text-transparent">
                  LexClear
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-full font-medium">
                  GenAI Legal Clarity
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Demystifying legal agreements for non-lawyers
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            {document && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">New Analysis</span>
              </button>
            )}

            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">API Key</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {!document ? (
          /* Initial Upload View */
          <div className="py-6 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-semibold shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Private &amp; Session-Based Legal Analysis</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                Understand your legal contracts in <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">seconds</span>.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upload any lease, NDA, employment contract, or terms of service to extract plain-language summaries, structured clause breakdowns, red flags, and attorney-prep checklists.
              </p>
            </div>

            <DocumentUploader
              onDocumentLoaded={handleDocumentLoaded}
              onSecondDocumentLoaded={handleSecondDocumentLoaded}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              error={error}
              setError={setError}
            />
          </div>
        ) : (
          /* Document Analyzed View */
          <div className="space-y-6">
            {/* Document Title Banner */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-100">{document.title}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                      {document.clause_count} clauses
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Analyzed by Gemini AI • {document.word_count} words
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav aria-label="Document View Modes">
                <div role="tablist" aria-label="Document navigation options" className="flex items-center gap-1 overflow-x-auto bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 scrollbar-none">
                  <button
                    role="tab"
                    id="tab-summary"
                    aria-selected={activeTab === 'summary'}
                    aria-controls="tabpanel-summary"
                    onClick={() => setActiveTab('summary')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      activeTab === 'summary'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Summary</span>
                  </button>

                  <button
                    role="tab"
                    id="tab-clauses"
                    aria-selected={activeTab === 'clauses'}
                    aria-controls="tabpanel-clauses"
                    onClick={() => setActiveTab('clauses')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      activeTab === 'clauses'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Clauses ({document.analysis.clause_breakdown.length})</span>
                  </button>

                  <button
                    role="tab"
                    id="tab-red-flags"
                    aria-selected={activeTab === 'red_flags'}
                    aria-controls="tabpanel-red-flags"
                    onClick={() => setActiveTab('red_flags')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      activeTab === 'red_flags'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-300" aria-hidden="true" />
                    <span>Red Flags ({document.analysis.red_flags.length})</span>
                  </button>

                  <button
                    role="tab"
                    id="tab-checklist"
                    aria-selected={activeTab === 'checklist'}
                    aria-controls="tabpanel-checklist"
                    onClick={() => setActiveTab('checklist')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      activeTab === 'checklist'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
                    <span>Lawyer Prep ({document.analysis.lawyer_checklist.length})</span>
                  </button>

                  <button
                    role="tab"
                    id="tab-compare"
                    aria-selected={activeTab === 'compare'}
                    aria-controls="tabpanel-compare"
                    onClick={handleCompareTabClick}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      activeTab === 'compare'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                        : 'text-purple-400 hover:text-purple-300 bg-purple-950/30 border border-purple-500/20'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Compare</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Active View Tab Panel */}
            <div className="min-h-[500px]">
              {activeTab === 'summary' && (
                <div role="tabpanel" id="tabpanel-summary" aria-labelledby="tab-summary">
                  <SummaryView
                    summary={document.analysis.summary}
                    title={document.title}
                    wordCount={document.word_count}
                    clauseCount={document.clause_count}
                  />
                </div>
              )}

              {activeTab === 'clauses' && (
                <div role="tabpanel" id="tabpanel-clauses" aria-labelledby="tab-clauses">
                  <ClauseExplorer
                    clauses={document.analysis.clause_breakdown}
                    highlightedClauseRef={highlightedClauseRef}
                  />
                </div>
              )}

              {activeTab === 'red_flags' && (
                <div role="tabpanel" id="tabpanel-red-flags" aria-labelledby="tab-red-flags">
                  <RedFlagsRadar redFlags={document.analysis.red_flags} />
                </div>
              )}

              {activeTab === 'checklist' && (
                <div role="tabpanel" id="tabpanel-checklist" aria-labelledby="tab-checklist">
                  <LawyerChecklist questions={document.analysis.lawyer_checklist} />
                </div>
              )}

              {activeTab === 'compare' && secondDocument && (
                <div role="tabpanel" id="tabpanel-compare" aria-labelledby="tab-compare">
                  <DocumentCompare
                    docAId={document.doc_id}
                    docBId={secondDocument.doc_id}
                    docATitle={document.title}
                    docBTitle={secondDocument.title}
                  />
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Floating Q&A Chat Widget */}
      {document && (
        <div className="fixed bottom-6 right-6 z-50">
          {!isChatOpen ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full font-semibold text-xs shadow-2xl shadow-emerald-950/80 transition-all transform hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Document</span>
            </button>
          ) : (
            <div className="w-[420px] max-w-[90vw]">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="px-3 py-1 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700"
                >
                  Close Chat ✕
                </button>
              </div>
              <RagChat docId={document.doc_id} onCitationClick={handleCitationClick} />
            </div>
          )}
        </div>
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {}}
      />
    </div>
  );
}
