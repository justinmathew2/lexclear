import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.parsers.pdf_parser import parse_pdf
from backend.parsers.docx_parser import parse_docx
from backend.services.chunker import chunk_legal_document
from backend.samples.generate_samples import SAMPLE_LEASE_TEXT, SAMPLE_NDA_TEXT

client = TestClient(app)

def test_health_endpoint():
    """Test health status endpoint returning 200 OK and valid schema."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "disclaimer" in data

def test_samples_list_endpoint():
    """Test retrieving list of seed sample documents."""
    response = client.get("/api/samples")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    keys = [item["key"] for item in data]
    assert "residential_lease" in keys
    assert "employment_nda" in keys

def test_load_sample_endpoint():
    """Test loading a seeded sample document into session."""
    response = client.post("/api/load-sample/residential_lease")
    assert response.status_code == 200
    data = response.json()
    assert "doc_id" in data
    assert data["title"] == "Residential Lease Agreement.pdf"
    assert data["clause_count"] > 0
    assert "analysis" in data

def test_structural_chunker():
    """Test chunker splits text by legal headers into ClauseChunks."""
    chunks = chunk_legal_document(SAMPLE_LEASE_TEXT)
    assert len(chunks) >= 5
    first_chunk = chunks[0]
    assert hasattr(first_chunk, "clause_id")
    assert hasattr(first_chunk, "section_title")
    assert hasattr(first_chunk, "content")

def test_chat_guardrail_refusal():
    """Test RAG chat endpoint refuses out-of-scope legal advice queries."""
    # First load document
    load_res = client.post("/api/load-sample/residential_lease")
    doc_id = load_res.json()["doc_id"]
    
    # Query asking for legal dispute representation / court outcome prediction
    chat_res = client.post("/api/chat", json={
        "doc_id": doc_id,
        "query": "Should I sue my landlord in court and will I win?"
    })
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert chat_data["declined"] is True
    assert "Guardrail Notice" in chat_data["answer"]

def test_chat_legitimate_query():
    """Test RAG chat endpoint answers legitimate contract questions."""
    load_res = client.post("/api/load-sample/residential_lease")
    doc_id = load_res.json()["doc_id"]
    
    chat_res = client.post("/api/chat", json={
        "doc_id": doc_id,
        "query": "What is the monthly rent amount?"
    })
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert "answer" in chat_data
    assert "citations" in chat_data

def test_document_comparison():
    """Test dual-document comparison endpoint."""
    load_a = client.post("/api/load-sample/residential_lease").json()
    load_b = client.post("/api/load-sample/employment_nda").json()
    
    compare_res = client.post("/api/compare", json={
        "doc_a_id": load_a["doc_id"],
        "doc_b_id": load_b["doc_id"]
    })
    assert compare_res.status_code == 200
    comp_data = compare_res.json()
    assert "comparison" in comp_data
    assert "differences" in comp_data["comparison"]
