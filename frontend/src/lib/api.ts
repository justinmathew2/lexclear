import { ParsedDocument, SampleDoc, ComparisonResult } from '@/types';
import { DEFAULT_SAMPLES, SAMPLE_LEASE_PARSED, SAMPLE_NDA_PARSED } from '@/lib/sampleData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL !== undefined ? process.env.NEXT_PUBLIC_API_URL : '';

function getApiKeyHeader(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('lexclear_gemini_api_key') : null;
  const keyToUse = apiKey || storedKey;
  if (keyToUse) {
    headers['x-gemini-api-key'] = keyToUse;
  }
  return headers;
}

export async function fetchSamples(): Promise<SampleDoc[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/samples`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('API samples fetch failed, using default client sample list', err);
  }
  return DEFAULT_SAMPLES;
}

export async function uploadDocument(file: File, apiKey?: string): Promise<ParsedDocument> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: getApiKeyHeader(apiKey),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Failed to upload and analyze document');
  }

  return res.json();
}

export async function loadSampleDocument(sampleKey: string, apiKey?: string): Promise<ParsedDocument> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/load-sample/${sampleKey}`, {
      method: 'POST',
      headers: getApiKeyHeader(apiKey),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API load-sample failed, using client fallback dataset', err);
  }

  // Fallback to client sample dataset
  if (sampleKey === 'employment_nda') {
    return SAMPLE_NDA_PARSED;
  }
  return SAMPLE_LEASE_PARSED;
}


export async function sendChatMessage(docId: string, query: string, apiKey?: string) {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getApiKeyHeader(apiKey),
    },
    body: JSON.stringify({
      doc_id: docId,
      query: query,
      api_key: apiKey || (typeof window !== 'undefined' ? localStorage.getItem('lexclear_gemini_api_key') : ''),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Chat error' }));
    throw new Error(err.detail || 'Failed to send chat message');
  }

  return res.json();
}

export async function compareDocuments(docAId: string, docBId: string, apiKey?: string): Promise<ComparisonResult> {
  const res = await fetch(`${API_BASE_URL}/api/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getApiKeyHeader(apiKey),
    },
    body: JSON.stringify({
      doc_a_id: docAId,
      doc_b_id: docBId,
      api_key: apiKey || (typeof window !== 'undefined' ? localStorage.getItem('lexclear_gemini_api_key') : ''),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Comparison failed' }));
    throw new Error(err.detail || 'Failed to compare documents');
  }

  return res.json();
}
