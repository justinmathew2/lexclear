import json
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from backend.config import settings

logger = logging.getLogger(__name__)

# Pydantic Schemas for Structured JSON Output

class SummaryOutput(BaseModel):
    executive_summary: str = Field(description="2-3 paragraph plain-language overview using simple terms and helpful real-world analogies. No jargon.")
    document_type: str = Field(description="Type of document (e.g. Residential Lease, NDA, Employment Contract, ToS)")
    key_parties: str = Field(description="Parties involved and their roles")
    core_purpose: str = Field(description="Core objective and agreement of the document")
    real_world_analogy: str = Field(description="Simple everyday analogy explaining how this document works for non-lawyers")

class ClauseBreakdownItem(BaseModel):
    category: str = Field(description="Category: OBLIGATIONS, DEADLINES, PAYMENT_TERMS, TERMINATION, PENALTIES_LIABILITIES, or AUTO_RENEWAL")
    title: str = Field(description="Clause or section title")
    section_reference: str = Field(description="Section/Clause identifier in original text (e.g., Section 4.2)")
    original_excerpt: str = Field(description="Direct verbatim quote or excerpt from text")
    plain_english_translation: str = Field(description="Plain-language explanation of what this means for the user")
    key_impact: str = Field(description="What action, benefit, or restriction this places on the user")

class RedFlagItem(BaseModel):
    severity: str = Field(description="HIGH, MEDIUM, or LOW risk severity")
    clause_title: str = Field(description="Title of the risky clause")
    section_reference: str = Field(description="Section/Clause number")
    original_text: str = Field(description="Excerpt of flagged text")
    why_flagged: str = Field(description="Plain-language explanation of why this clause is unusual, one-sided, or risky")
    negotiation_tip: str = Field(description="Practical counter-offer or question to ask to protect oneself")

class LawyerQuestionItem(BaseModel):
    category: str = Field(description="Category of legal concern")
    question: str = Field(description="Specific document-tailored question to ask an attorney")
    clause_reference: str = Field(description="Section or clause reference triggering this question")
    why_ask: str = Field(description="Explanation of why professional legal counsel is needed for this point")

class AnalysisResponse(BaseModel):
    summary: SummaryOutput
    clause_breakdown: List[ClauseBreakdownItem]
    red_flags: List[RedFlagItem]
    lawyer_checklist: List[LawyerQuestionItem]

class ComparisonItem(BaseModel):
    topic: str = Field(description="Topic or clause area (e.g. Rent Increase, IP Rights, Termination)")
    doc_a_term: str = Field(description="Term or stance in Document A")
    doc_b_term: str = Field(description="Term or stance in Document B")
    difference_analysis: str = Field(description="Plain-language explanation of what changed")
    who_it_favors: str = Field(description="Who this change favors (e.g. Tenant, Landlord, Employee, Employer, Neutral)")
    importance_level: str = Field(description="HIGH, MEDIUM, or LOW impact")

class DocumentComparisonResponse(BaseModel):
    comparison_summary: str = Field(description="Executive summary of key differences between the two documents")
    differences: List[ComparisonItem]
    overall_takeaway: str = Field(description="Bottom-line recommendation on which draft is more favorable and key points to watch out for")

def get_client(api_key: Optional[str] = None) -> genai.Client:
    key = api_key or settings.GEMINI_API_KEY
    if not key:
        raise ValueError("Gemini API Key is missing. Please provide GEMINI_API_KEY in backend/.env or in the UI header.")
    return genai.Client(api_key=key)

def analyze_document_with_gemini(document_text: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    """Uses Gemini API with structured JSON schema output to parse and analyze a legal document."""
    client = get_client(api_key)
    
    prompt = f"""You are LexClear, an AI legal document analysis engine designed to help non-lawyers understand contracts.
Analyze the following legal document text thoroughly.
Extract the structured summary, clause breakdown categorized into (OBLIGATIONS, DEADLINES, PAYMENT_TERMS, TERMINATION, PENALTIES_LIABILITIES, AUTO_RENEWAL), red flags (risky, one-sided, unusual clauses), and a customized list of questions to ask a lawyer.

DOCUMENT TEXT:
{document_text[:40000]}
"""

    response = client.models.generate_content(
        model=settings.DEFAULT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AnalysisResponse,
            temperature=0.2,
        ),
    )

    return json.loads(response.text)

EMBEDDING_CACHE: Dict[str, List[float]] = {}

def generate_text_embedding(text: str, api_key: Optional[str] = None) -> List[float]:
    """Generates vector embedding for document chunk using Gemini embedding model with LRU cache."""
    cache_key = f"{text[:100]}_{len(text)}"
    if cache_key in EMBEDDING_CACHE:
        return EMBEDDING_CACHE[cache_key]

    client = get_client(api_key)
    result = client.models.embed_content(
        model=settings.EMBEDDING_MODEL,
        contents=text,
    )
    values = result.embedding.values
    if len(EMBEDDING_CACHE) < 500:
        EMBEDDING_CACHE[cache_key] = values
    return values


def compare_documents_with_gemini(doc_a_text: str, doc_b_text: str, doc_a_name: str = "Document A", doc_b_name: str = "Document B", api_key: Optional[str] = None) -> Dict[str, Any]:
    """Compares two legal documents/drafts and outputs a structured matrix of differences and favorability."""
    client = get_client(api_key)
    
    prompt = f"""You are LexClear's Contract Comparison Engine.
Compare the following two legal documents:

--- {doc_a_name} ---
{doc_a_text[:20000]}

--- {doc_b_name} ---
{doc_b_text[:20000]}

Provide a structured breakdown comparing key clauses, payment/financial terms, termination rights, liabilities, and obligations between {doc_a_name} and {doc_b_name}.
Highlight who each difference favors and how critical it is for a non-lawyer to be aware of.
"""

    response = client.models.generate_content(
        model=settings.DEFAULT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=DocumentComparisonResponse,
            temperature=0.2,
        ),
    )

    return json.loads(response.text)
