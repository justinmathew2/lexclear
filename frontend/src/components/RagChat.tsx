'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/types';
import { Send, Bot, User, Sparkles, BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';

interface RagChatProps {
  docId: string;
  onCitationClick?: (sectionRef: string) => void;
}

const SUGGESTED_QUESTIONS = [
  'What happens if I pay rent late?',
  'Can I terminate this agreement early?',
  'What are my main payment deadlines?',
  'Is there an automatic renewal clause?',
  'What repairs am I responsible for?',
];

export const RagChat: React.FC<RagChatProps> = ({ docId, onCitationClick }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am LexClear Chat. Ask me any question about your document. Every answer I provide is strictly grounded in the document text with inline clause citations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(docId, textToSend);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.answer,
        citations: res.citations || [],
        declined: res.declined || false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ Error retrieving answer: ${err.message || 'Server error'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      role="region" 
      aria-label="Document Chat Assistant"
      className="flex flex-col h-[650px] bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md"
    >
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Interactive Document Q&amp;A</span>
              <span className="text-[10px] bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                RAG Grounded
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Answers cited with exact section references</p>
          </div>
        </div>
      </div>

      {/* Suggested Chips */}
      <div 
        role="group" 
        aria-label="Suggested document questions"
        className="p-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
        <span className="text-[10px] text-slate-400 uppercase font-mono shrink-0">Try asking:</span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            aria-label={`Ask suggested question: ${q}`}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 rounded-lg whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div 
        role="log" 
        aria-live="polite" 
        aria-label="Chat messages history"
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`p-2 rounded-xl text-xs shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" aria-hidden="true" /> : <Bot className="w-4 h-4" aria-hidden="true" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : msg.declined
                  ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-tl-none'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Citations Panel */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                    <BookOpen className="w-3 h-3" aria-hidden="true" />
                    <span>Source Clause Citations ({msg.citations.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((cite, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => onCitationClick && onCitationClick(cite.section_title)}
                        aria-label={`Jump to citation: ${cite.section_title}`}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-[10px] text-emerald-300 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        title={cite.snippet}
                      >
                        <span>{cite.section_title}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-emerald-400 opacity-60 group-hover:opacity-100" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className="block text-[9px] text-slate-400 text-right opacity-70">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div role="status" className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" aria-hidden="true" />
            <span>Searching document clauses and retrieving citations...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <label htmlFor="rag-chat-input" className="sr-only">Type your question about the contract</label>
        <input
          id="rag-chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your contract..."
          disabled={loading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send question"
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl disabled:opacity-50 transition-colors shadow-md shadow-emerald-950/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};
