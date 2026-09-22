import numpy as np
import logging
from typing import List, Dict, Any, Optional
from google import genai
from google.genai import types
from backend.services.chunker import ClauseChunk
from backend.services.gemini_service import generate_text_embedding, get_client
from backend.config import settings

logger = logging.getLogger(__name__)

class DocumentVectorStore:
    def __init__(self, doc_id: str, chunks: List[ClauseChunk]):
        self.doc_id = doc_id
        self.chunks = chunks
        self.embeddings: List[List[float]] = []
        
    def build_index(self, api_key: Optional[str] = None):
        """Generates embeddings for all chunks in the document."""
        self.embeddings = []
        for chunk in self.chunks:
            try:
                emb = generate_text_embedding(f"{chunk.section_title}\n{chunk.content}", api_key=api_key)
                self.embeddings.append(emb)
            except Exception as e:
                logger.warning(f"Failed to generate embedding for chunk {chunk.clause_id}: {e}")
                # Fallback zero embedding if embedding call fails
                self.embeddings.append([0.0] * 768)

    def search(self, query: str, top_k: int = 4, api_key: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieves top_k most relevant chunks using cosine similarity."""
        if not self.chunks:
            return []
            
        try:
            query_emb = generate_text_embedding(query, api_key=api_key)
        except Exception as e:
            logger.error(f"Failed to generate query embedding: {e}")
            # Fallback simple text match search if embedding API fails
            query_lower = query.lower()
            scored = []
            for chunk in self.chunks:
                score = 0
                for word in query_lower.split():
                    if word in chunk.content.lower():
                        score += 1
                scored.append((score, chunk))
            scored.sort(key=lambda x: x[0], reverse=True)
            return [{"chunk": c, "score": float(s)} for s, c in scored[:top_k]]

        query_vec = np.array(query_emb, dtype=np.float32)
        query_norm = np.linalg.norm(query_vec)
        if query_norm > 0:
            query_vec = query_vec / query_norm
            
        results = []
        for idx, chunk in enumerate(self.chunks):
            emb_vec = np.array(self.embeddings[idx], dtype=np.float32)
            norm = np.linalg.norm(emb_vec)
            if norm > 0:
                emb_vec = emb_vec / norm
                score = float(np.dot(query_vec, emb_vec))
            else:
                score = 0.0
                
            results.append({"chunk": chunk, "score": score})
            
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

# Global in-memory session index store
SESSION_INDEX_STORE: Dict[str, DocumentVectorStore] = {}

OUT_OF_SCOPE_KEYWORDS = [
    "predict who will win", "predict trial outcome", "should i sue", "file a lawsuit",
    "draft a motion", "draft a complaint", "guarantee victory", "legal advice on dispute",
    "will i win", "how to represent myself in court", "draft legal pleading"
]

def is_out_of_scope_legal_advice(query: str) -> bool:
    q_lower = query.lower()
    return any(keyword in q_lower for keyword in OUT_OF_SCOPE_KEYWORDS)

def answer_document_question(
    doc_id: str,
    query: str,
    chat_history: Optional[List[Dict[str, str]]] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Answers a question about an indexed document using RAG.
    Enforces strict citation requirements and legal advice guardrails.
    """
    if is_out_of_scope_legal_advice(query):
        return {
            "answer": "⚠️ **Guardrail Notice**: I cannot provide legal advice, predict trial outcomes, tell you whether to take legal action, or draft legal filings. LexClear is an informational AI tool, not a licensed attorney.\n\n"
                      "I strongly recommend consulting a licensed attorney for advice on your specific legal dispute or court action. Here are relevant questions you can ask your lawyer regarding this document:\n"
                      "1. What are my legal remedies under this contract's dispute resolution clause?\n"
                      "2. Does the governing law or local jurisdiction impact the enforceability of these terms?\n"
                      "3. What evidence or documentation should I compile before seeking legal counsel?",
            "citations": [],
            "declined": True
        }

    vector_store = SESSION_INDEX_STORE.get(doc_id)
    if not vector_store:
        return {
            "answer": "Document index session not found. Please upload or reload the document.",
            "citations": [],
            "declined": False
        }

    retrieved = vector_store.search(query, top_k=4, api_key=api_key)
    
    context_blocks = []
    citations = []
    
    for item in retrieved:
        chunk: ClauseChunk = item["chunk"]
        context_blocks.append(f"[{chunk.section_title}]:\n\"{chunk.content}\"")
        citations.append({
            "clause_id": chunk.clause_id,
            "section_title": chunk.section_title,
            "snippet": chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content,
            "relevance_score": round(item["score"], 3)
        })
        
    context_str = "\n\n".join(context_blocks)
    
    system_instruction = """You are LexClear, an AI legal document assistant. 
Your job is to answer user questions about their legal document based ONLY on the provided document section excerpts.

STRICT GUARDRAILS:
1. CITATIONS ARE MANDATORY: Every factual claim or explanation must cite the specific section title inline, e.g. [Section 4.1: Rent Payment].
2. NO HALLUCINATION: If the provided text does not contain the answer, explicitly state: "The document text provided does not mention [topic]." Do NOT make up contract terms or assume standard practices outside what the document states.
3. NO DEFINITIVE LEGAL ADVICE: Frame all answers informatively. Never tell the user what legal action to take.
4. Keep explanations clear, empathetic, and jargon-free for non-lawyers.
"""

    prompt = f"""DOCUMENT EXCERPTS:
{context_str}

USER QUESTION: {query}

Provide a clear answer grounded strictly in the document excerpts above, with inline citations [Section Name] for every claim:
"""

    try:
        client = get_client(api_key)
        response = client.models.generate_content(
            model=settings.DEFAULT_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
            ),
        )
        answer_text = response.text
    except Exception as e:
        logger.error(f"Error calling Gemini for RAG answer: {e}")
        answer_text = f"Unable to generate response: {str(e)}"

    return {
        "answer": answer_text,
        "citations": citations,
        "declined": False
    }
