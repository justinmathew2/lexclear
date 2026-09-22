import re
from functools import lru_cache
from typing import List, Dict, Any, Tuple
from pydantic import BaseModel

class ClauseChunk(BaseModel):
    clause_id: str
    section_title: str
    content: str
    word_count: int
    start_char: int
    end_char: int

def chunk_legal_document(raw_text: str) -> List[ClauseChunk]:
    """
    Splits a legal document into logical clauses based on legal section headings,
    articles, numbered clauses, and structural breaks.
    """

    if not raw_text or not raw_text.strip():
        return []

    # Regex patterns matching legal document section markers
    # e.g., "SECTION 1", "ARTICLE II", "1.1 Payment", "4. TERMINATION", "(a) Security Deposit"
    section_pattern = re.compile(
        r'(?=\n(?:--- Page \d+ ---|\b(?:SECTION|SECTION\s+\d+|ARTICLE|ARTICLE\s+[IVXLCDM\d]+|\d+\.\d+|\d+\.)\b[^\n]*\n))',
        re.IGNORECASE
    )
    
    # Alternative splitter if document doesn't use standard headers: look for double newlines
    raw_blocks = [b.strip() for b in section_pattern.split(raw_text) if b.strip()]
    
    if len(raw_blocks) <= 2:
        # Fallback to paragraph-based splitting if legal regex produced too few chunks
        paragraph_blocks = re.split(r'\n\s*\n', raw_text)
        raw_blocks = [p.strip() for p in paragraph_blocks if p.strip()]

    chunks: List[ClauseChunk] = []
    char_cursor = 0
    
    for idx, block in enumerate(raw_blocks):
        lines = block.split('\n')
        header_candidate = lines[0].strip()
        
        # Clean header title
        if len(header_candidate) < 100 and not header_candidate.endswith('.'):
            section_title = header_candidate
        elif '--- Page' in header_candidate:
            section_title = header_candidate
        else:
            # Generate a clean section title preview
            words = header_candidate.split()
            section_title = " ".join(words[:8]) if len(words) > 8 else header_candidate

        if not section_title or len(section_title) < 3:
            section_title = f"Section {idx + 1}"

        # Clean section title formatting
        section_title = re.sub(r'^[^\w\d]+', '', section_title).strip()
        if not section_title:
            section_title = f"Clause {idx + 1}"

        word_count = len(block.split())
        end_cursor = char_cursor + len(block)
        
        chunks.append(ClauseChunk(
            clause_id=f"clause_{idx + 1}",
            section_title=section_title,
            content=block,
            word_count=word_count,
            start_char=char_cursor,
            end_char=end_cursor
        ))
        
        char_cursor = end_cursor + 2

    return chunks
