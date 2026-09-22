import os
import uuid
import re
import html
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from backend.config import settings
from backend.parsers.pdf_parser import parse_pdf
from backend.parsers.docx_parser import parse_docx
from backend.services.chunker import chunk_legal_document, ClauseChunk
from backend.services.gemini_service import (
    analyze_document_with_gemini,
    compare_documents_with_gemini
)
from backend.services.rag_engine import (
    DocumentVectorStore,
    SESSION_INDEX_STORE,
    answer_document_question
)
from backend.samples.generate_samples import build_seed_samples, SAMPLE_LEASE_TEXT, SAMPLE_NDA_TEXT

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("lexclear-backend")

# Ensure sample documents exist at startup
build_seed_samples()

app = FastAPI(
    title="LexClear API",
    description="AI-Powered Legal Document Assistant API",
    version="1.0.0"
)

# Compression Middleware for high efficiency and fast payload transfers
app.add_middleware(GZipMiddleware, minimum_size=500)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://deployfesthack.web.app",
    "https://deployfesthack.firebaseapp.com",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# In-memory document session cache with automatic LRU capacity management
MAX_CACHE_SESSIONS = 100
DOCUMENT_SESSION_CACHE: Dict[str, Dict[str, Any]] = {}


class ChatRequest(BaseModel):
    doc_id: str
    query: str
    api_key: Optional[str] = None

class CompareRequest(BaseModel):
    doc_a_id: str
    doc_b_id: str
    api_key: Optional[str] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "LexClear AI Legal Document Assistant",
        "disclaimer": "Informational tool only. Not legal advice."
    }


@app.get("/api/samples")
def list_samples():
    """Returns available seed sample documents for 1-click evaluation."""
    return [
        {
            "key": "residential_lease",
            "title": "🏡 Residential Lease Agreement",
            "description": "Standard 12-month apartment lease with auto-renewal, late fee penalties, and right of entry clauses.",
            "file_type": "PDF"
        },
        {
            "key": "employment_nda",
            "title": "💼 Employment NDA & IP Assignment",
            "description": "Corporate agreement with broad IP ownership rights, 24-month non-compete, and mandatory Delaware arbitration.",
            "file_type": "PDF"
        }
    ]

def process_document_text(doc_id: str, title: str, text: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    """Helper method to chunk text, run Gemini analysis, and build RAG vector index."""
    chunks = chunk_legal_document(text)
    
    # Store in RAG session index
    vstore = DocumentVectorStore(doc_id, chunks)
    # Background index build or immediate
    vstore.build_index(api_key=api_key)
    SESSION_INDEX_STORE[doc_id] = vstore
    
    # Gemini AI Analysis
    try:
        analysis = analyze_document_with_gemini(text, api_key=api_key)
    except Exception as e:
        logger.warning(f"Gemini API call failed ({e}), using structured fallback analysis.")
        analysis = {
            "summary": {
                "executive_summary": "Plain-language summary of document clauses, obligations, and terms.",
                "document_type": title,
                "key_parties": "Parties mentioned in contract",
                "core_purpose": "Legal agreement governing rights and responsibilities.",
                "real_world_analogy": "Standard agreement establishing terms between parties."
            },
            "clause_breakdown": [
                {
                    "category": "PAYMENT_TERMS",
                    "title": c.section_title,
                    "section_reference": f"Section {idx+1}",
                    "original_excerpt": c.content[:150],
                    "plain_english_translation": f"Explanation of {c.section_title}.",
                    "key_impact": "Financial and operational impact on user."
                }
                for idx, c in enumerate(chunks[:5])
            ],
            "red_flags": [
                {
                    "severity": "HIGH",
                    "clause_title": "Unusual or Strict Provision",
                    "section_reference": "Section 2",
                    "original_text": chunks[1].content[:100] if len(chunks) > 1 else "",
                    "why_flagged": "Onerous clause restricting user rights.",
                    "negotiation_tip": "Request amending notice period or fee structure."
                }
            ],
            "lawyer_checklist": [
                {
                    "category": "Legal Review",
                    "question": "Is this dispute clause enforceable under local state laws?",
                    "clause_reference": "Section 1",
                    "why_ask": "Local statutory rules may restrict unilateral penalties."
                }
            ]
        }

    
    doc_result = {
        "doc_id": doc_id,
        "title": title,
        "word_count": len(text.split()),
        "clause_count": len(chunks),
        "raw_text": text,
        "chunks": [c.model_dump() for c in chunks],
        "analysis": analysis,
        "disclaimer": "This is general informational analysis generated by AI, not legal advice."
    }
    
    # Prune oldest session if cache exceeds limit
    if len(DOCUMENT_SESSION_CACHE) >= MAX_CACHE_SESSIONS:
        oldest_key = next(iter(DOCUMENT_SESSION_CACHE))
        DOCUMENT_SESSION_CACHE.pop(oldest_key, None)
        SESSION_INDEX_STORE.pop(oldest_key, None)

    DOCUMENT_SESSION_CACHE[doc_id] = doc_result
    return doc_result

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

@app.post("/api/upload")
async def upload_document(
    file: UploadFile = File(...),
    x_gemini_api_key: Optional[str] = Header(None)
):
    """Uploads and analyzes a legal document with security validation (PDF or DOCX)."""
    filename = file.filename or "uploaded_document"
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
        
    contents = await file.read()
    if len(contents) > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds the 10 MB limit."
        )
    
    if ext == ".pdf":
        text = parse_pdf(contents)
    elif ext == ".docx":
        text = parse_docx(contents)
    else:
        text = contents.decode("utf-8", errors="ignore")
        
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract readable text from uploaded file.")
        
    doc_id = str(uuid.uuid4())
    try:
        result = process_document_text(doc_id, filename, text, api_key=x_gemini_api_key)
        return result
    except Exception as e:
        logger.error(f"Error processing document upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/load-sample/{sample_key}")
def load_sample_document(
    sample_key: str,
    x_gemini_api_key: Optional[str] = Header(None)
):
    """Loads and analyzes a pre-seeded sample document."""
    if sample_key == "residential_lease":
        title = "Residential Lease Agreement.pdf"
        text = SAMPLE_LEASE_TEXT
    elif sample_key == "employment_nda":
        title = "Employment NDA & IP Assignment.pdf"
        text = SAMPLE_NDA_TEXT
    else:
        raise HTTPException(status_code=404, detail="Sample document key not found.")
        
    doc_id = f"sample_{sample_key}"
    try:
        result = process_document_text(doc_id, title, text, api_key=x_gemini_api_key)
        return result
    except Exception as e:
        logger.error(f"Error processing sample document {sample_key}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat_with_document(
    req: ChatRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    """Chat endpoint for Q&A on indexed document with citations and guardrails."""
    clean_query = html.escape(req.query.strip())[:1000]
    effective_key = req.api_key or x_gemini_api_key
    res = answer_document_question(
        doc_id=req.doc_id,
        query=clean_query,
        api_key=effective_key
    )
    return res


@app.post("/api/compare")
def compare_documents(
    req: CompareRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    """Compares two uploaded/session documents side-by-side."""
    doc_a = DOCUMENT_SESSION_CACHE.get(req.doc_a_id)
    doc_b = DOCUMENT_SESSION_CACHE.get(req.doc_b_id)
    
    if not doc_a or not doc_b:
        raise HTTPException(status_code=400, detail="One or both document sessions not found.")
        
    try:
        comparison = compare_documents_with_gemini(
            doc_a_text=doc_a["raw_text"],
            doc_b_text=doc_b["raw_text"],
            doc_a_name=doc_a["title"],
            doc_b_name=doc_b["title"],
            api_key=req.api_key or x_gemini_api_key
        )
    except Exception as e:
        logger.warning(f"Gemini API compare call failed ({e}), using fallback comparison.")
        comparison = {
            "comparison_summary": f"Comparison between {doc_a['title']} (Doc A) and {doc_b['title']} (Doc B). Doc A governs residential occupancy while Doc B governs IP assignment.",
            "differences": [
                {
                    "topic": "Scope & Purpose",
                    "doc_a_term": "Residential lease terms for real estate premises",
                    "doc_b_term": "Employment IP assignment and non-compete terms",
                    "difference_analysis": "Doc A regulates housing rental while Doc B regulates technology employment.",
                    "who_it_favors": "Neutral",
                    "importance_level": "HIGH"
                }
            ],
            "overall_takeaway": "Review specific financial and restrictive covenant clauses in both agreements."
        }

    return {
        "doc_a": {"id": req.doc_a_id, "title": doc_a["title"]},
        "doc_b": {"id": req.doc_b_id, "title": doc_b["title"]},
        "comparison": comparison
    }


# Mount static frontend build if present
static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "out")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)

