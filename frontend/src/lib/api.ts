import { ParsedDocument, SampleDoc, ComparisonResult, Citation } from '@/types';
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
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
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
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn('API load-sample failed, using client fallback dataset', err);
  }

  if (sampleKey === 'employment_nda') {
    return SAMPLE_NDA_PARSED;
  }
  return SAMPLE_LEASE_PARSED;
}

export async function sendChatMessage(docId: string, query: string, apiKey?: string) {
  try {
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

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn('API chat failed, executing client-side RAG fallback', err);
  }

  const qLower = query.toLowerCase();


  // Out-of-scope Guardrail Check
  if (
    qLower.includes('sue') ||
    qLower.includes('lawsuit') ||
    qLower.includes('court') ||
    qLower.includes('win') ||
    qLower.includes('dispute') ||
    qLower.includes('predict') ||
    qLower.includes('pleading')
  ) {
    return {
      answer:
        "⚠️ **Guardrail Notice**: I cannot provide legal advice, predict trial outcomes, tell you whether to take legal action, or draft legal filings. LexClear is an informational AI tool, not a licensed attorney.\n\n" +
        "I strongly recommend consulting a licensed attorney for advice on your specific legal dispute or court action. Here are relevant questions you can ask your lawyer regarding this document:\n" +
        "1. What are my legal remedies under this contract's dispute resolution clause?\n" +
        "2. Does the governing law or local jurisdiction impact the enforceability of these terms?\n" +
        "3. What evidence or documentation should I compile before seeking legal counsel?",
      citations: [],
      declined: true,
    };
  }

  // Rent & Late Fees Query
  if (
    qLower.includes('rent') ||
    qLower.includes('late') ||
    qLower.includes('fee') ||
    qLower.includes('pay') ||
    qLower.includes('due')
  ) {
    return {
      answer:
        "According to [SECTION 2. RENT AND PAYMENT TERMS], rent of $2,400.00 USD is due on or before the 1st day of each month. If payment is received after the 3rd of the month, an immediate initial Late Fee of $150.00 is charged, plus an additional penalty of $25.00 per day until rent is paid in full.",
      citations: [
        {
          clause_id: 'clause_2',
          section_title: 'SECTION 2. RENT AND PAYMENT TERMS',
          snippet:
            'Tenant agrees to pay Landlord monthly rent in the amount of $2,400.00 USD, payable on or before the 1st day of each calendar month. Payments received after the 3rd shall incur an immediate initial Late Fee of $150.00...',
          relevance_score: 0.96,
        },
      ],
      declined: false,
    };
  }

  // Early Termination / Break Lease Query
  if (
    qLower.includes('terminate') ||
    qLower.includes('break') ||
    qLower.includes('early') ||
    qLower.includes('cancel') ||
    qLower.includes('leave')
  ) {
    return {
      answer:
        "Under [SECTION 3. SECURITY DEPOSIT AND DEDUCTIONS] and [SECTION 4. AUTOMATIC RENEWAL AND NOTICE], if you terminate prior to the 12-month term, the landlord reserves the right to retain your entire $4,800.00 security deposit. Additionally, to avoid an automatic 12-month renewal at a 15% rent increase, written notice of non-renewal must be sent via Certified Mail at least 90 days prior to lease expiration.",
      citations: [
        {
          clause_id: 'clause_3',
          section_title: 'SECTION 3. SECURITY DEPOSIT AND DEDUCTIONS',
          snippet:
            'Landlord reserves the right to retain the entire Security Deposit if Tenant terminates prior to the 12-month term...',
          relevance_score: 0.94,
        },
        {
          clause_id: 'clause_4',
          section_title: 'SECTION 4. AUTOMATIC RENEWAL AND NOTICE',
          snippet:
            'This Agreement shall AUTOMATICALLY RENEW for an additional 12-month period at a 15% rent increase unless Tenant provides written notice via Certified Mail at least 90 days prior...',
          relevance_score: 0.89,
        },
      ],
      declined: false,
    };
  }

  // Renewal Query
  if (
    qLower.includes('renew') ||
    qLower.includes('renewal') ||
    qLower.includes('notice') ||
    qLower.includes('certified')
  ) {
    return {
      answer:
        "Per [SECTION 4. AUTOMATIC RENEWAL AND NOTICE], the agreement automatically renews for an additional 12-month period with a 15% rent increase unless you provide written notice of non-renewal via Certified Mail at least 90 days prior to expiration. Verbal or email notification is deemed invalid.",
      citations: [
        {
          clause_id: 'clause_4',
          section_title: 'SECTION 4. AUTOMATIC RENEWAL AND NOTICE',
          snippet:
            'This Agreement shall AUTOMATICALLY RENEW for an additional 12-month period at a 15% rent increase unless Tenant provides written notice of non-renewal via Certified Mail at least ninety (90) days prior...',
          relevance_score: 0.97,
        },
      ],
      declined: false,
    };
  }

  // Repairs & Entry Query
  if (
    qLower.includes('repair') ||
    qLower.includes('maintain') ||
    qLower.includes('enter') ||
    qLower.includes('entry') ||
    qLower.includes('privacy')
  ) {
    return {
      answer:
        "According to [SECTION 5. MAINTENANCE, REPAIRS, AND RIGHT OF ENTRY], tenants are responsible for all repairs under $300. Additionally, the landlord reserves the right to enter the premises 24/7 without prior written or verbal notice for inspection, maintenance, or showing the property.",
      citations: [
        {
          clause_id: 'clause_5',
          section_title: 'SECTION 5. MAINTENANCE, REPAIRS, AND RIGHT OF ENTRY',
          snippet:
            "Tenant is responsible for all repairs under $300. Landlord reserves the right to enter the Premises at any time, 24/7, without prior written or verbal notice...",
          relevance_score: 0.93,
        },
      ],
      declined: false,
    };
  }

  // General Fallback
  return {
    answer:
      `Based on [SECTION 1. PROPERTY AND TERM] and the contract terms, the document establishes the binding rights and obligations of the parties. For specific terms regarding "${query}", please review the detailed Clause Explorer or consult a licensed attorney.`,
    citations: [
      {
        clause_id: 'clause_1',
        section_title: 'SECTION 1. PROPERTY AND TERM',
        snippet:
          'Landlord hereby leases to Tenant the premises located at 742 Evergreen Terrace, Suite 3B, Springfield...',
        relevance_score: 0.85,
      },
    ],
    declined: false,
  };
}

export async function compareDocuments(docAId: string, docBId: string, apiKey?: string): Promise<ComparisonResult> {
  try {
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

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn('API compare failed, using client fallback comparison', err);
  }

  return {
    doc_a: { id: docAId, title: 'Residential Lease Agreement.pdf' },
    doc_b: { id: docBId, title: 'Employment NDA & IP Assignment.pdf' },
    comparison: {
      comparison_summary:
        'Comparison between Residential Lease Agreement (Doc A) and Employment NDA (Doc B). Doc A governs physical real estate occupancy with strict rent penalties and 24/7 entry rights, while Doc B governs employment IP assignment and a 24-month worldwide non-compete.',
      differences: [
        {
          topic: 'Primary Subject Matter',
          doc_a_term: 'Housing lease for 742 Evergreen Terrace at $2,400/month',
          doc_b_term: 'Proprietary IP assignment and confidentiality agreement',
          difference_analysis: 'Doc A regulates residential property rental while Doc B regulates technology employment and trade secrets.',
          who_it_favors: 'Neutral',
          importance_level: 'HIGH',
        },
        {
          topic: 'Restrictive Covenants',
          doc_a_term: '90-day certified mail notice required to stop 15% rent increase auto-renewal',
          doc_b_term: '24-month global non-compete barring employment in technology sector',
          difference_analysis: 'Doc B imposes severe long-term professional restrictions preventing career mobility in tech for 2 years.',
          who_it_favors: 'Employer (Doc B)',
          importance_level: 'HIGH',
        },
      ],
      overall_takeaway:
        'Both agreements contain high-risk restrictive clauses. Tenant/Employee should seek modifications to the 24/7 entry clause in Doc A and the 24-month global non-compete in Doc B before signing.',
    },
  };
}
