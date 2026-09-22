import io
from pypdf import PdfReader

def parse_pdf(file_bytes: bytes) -> str:
    """Extract text content page-by-page from a PDF file."""
    pdf_file = io.BytesIO(file_bytes)
    reader = PdfReader(pdf_file)
    extracted_text = []
    
    for idx, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        if page_text.strip():
            extracted_text.append(f"--- Page {idx + 1} ---\n{page_text.strip()}")
            
    return "\n\n".join(extracted_text)
