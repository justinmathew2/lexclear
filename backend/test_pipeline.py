import sys
import os

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.parsers.pdf_parser import parse_pdf
from backend.services.chunker import chunk_legal_document
from backend.samples.generate_samples import SAMPLE_LEASE_TEXT, build_seed_samples

def test_pipeline():
    print("--- 1. Testing Sample Document Generation ---")
    build_seed_samples()
    print("SUCCESS: Sample documents generated.")

    print("\n--- 2. Testing Structural Legal Chunker ---")
    chunks = chunk_legal_document(SAMPLE_LEASE_TEXT)
    print(f"Extracted {len(chunks)} clause chunks from sample lease.")
    for c in chunks[:3]:
        print(f"  - [{c.clause_id}] {c.section_title} ({c.word_count} words)")
    
    assert len(chunks) >= 5, "Expected at least 5 structured clause chunks"
    print("SUCCESS: Chunker created structured clause blocks.")

    print("\n--- Pipeline sanity test completed successfully! ---")

if __name__ == "__main__":
    test_pipeline()
