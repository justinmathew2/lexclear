export interface SummaryData {
  executive_summary: string;
  document_type: string;
  key_parties: string;
  core_purpose: string;
  real_world_analogy: string;
}

export interface ClauseItem {
  category: 'OBLIGATIONS' | 'DEADLINES' | 'PAYMENT_TERMS' | 'TERMINATION' | 'PENALTIES_LIABILITIES' | 'AUTO_RENEWAL' | string;
  title: string;
  section_reference: string;
  original_excerpt: string;
  plain_english_translation: string;
  key_impact: string;
}

export interface RedFlag {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  clause_title: string;
  section_reference: string;
  original_text: string;
  why_flagged: string;
  negotiation_tip: string;
}

export interface LawyerQuestion {
  category: string;
  question: string;
  clause_reference: string;
  why_ask: string;
}

export interface DocumentAnalysis {
  summary: SummaryData;
  clause_breakdown: ClauseItem[];
  red_flags: RedFlag[];
  lawyer_checklist: LawyerQuestion[];
}

export interface ClauseChunk {
  clause_id: string;
  section_title: string;
  content: string;
  word_count: number;
  start_char: number;
  end_char: number;
}

export interface ParsedDocument {
  doc_id: string;
  title: string;
  word_count: number;
  clause_count: number;
  raw_text: string;
  chunks: ClauseChunk[];
  analysis: DocumentAnalysis;
  disclaimer: string;
}

export interface SampleDoc {
  key: string;
  title: string;
  description: string;
  file_type: string;
}

export interface Citation {
  clause_id: string;
  section_title: string;
  snippet: string;
  relevance_score: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: Citation[];
  declined?: boolean;
  timestamp: string;
}

export interface ComparisonItem {
  topic: string;
  doc_a_term: string;
  doc_b_term: string;
  difference_analysis: string;
  who_it_favors: string;
  importance_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ComparisonResult {
  doc_a: { id: string; title: string };
  doc_b: { id: string; title: string };
  comparison: {
    comparison_summary: string;
    differences: ComparisonItem[];
    overall_takeaway: string;
  };
}
