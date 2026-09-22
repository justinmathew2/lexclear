# ⚖️ LexClear — AI-Powered Legal Document Assistant

> **Demystifying legal documents for non-lawyers using GenAI.**  
> *Informational AI tool — Not legal advice.*

---

## 🌟 Overview

**LexClear** is an intelligent legal document assistant built to help non-lawyers navigate, digest, and query complex legal contracts (leases, employment agreements, NDAs, Terms of Service). It translates legal jargon into plain English, highlights hidden risks ("red flags"), generates document-tailored attorney preparation checklists, and provides interactive Q&A strictly grounded in the document text with **mandatory inline section citations**.

---

## 🛡️ Legal Advice Guardrails

LexClear is strictly designed to inform and clarify—it **never** gives legal counsel or claims to replace a lawyer.

1. **Persistent Disclaimer**: Every screen and response explicitly displays a notice that outputs are informational only.
2. **Out-of-Scope Refusal Engine**: If a user asks the AI to predict trial outcomes, tell them what to do in a legal dispute, or draft legal filings, LexClear politely declines and redirects them to relevant questions to ask a licensed attorney.
3. **Mandatory Citations**: Answers in RAG chat cite the exact source section/clause inline (`[Section 4.1: Payment Terms]`). If a topic is absent from the document, LexClear states so explicitly rather than guessing.
4. **Session-Based Privacy**: Uploaded documents are processed in-memory and are **never** persisted to disk or databases beyond the active session.

---

## 🚀 Key Features

* **📄 Multi-Format Document Parsing**: Parses PDF and DOCX files while preserving section headings, paragraph numbers, and table structure.
* **🧠 Plain-Language Executive Summary**: Provides a 2-3 paragraph jargon-free overview, party roles, core objectives, and real-world analogies.
* **📂 Categorized Clause Explorer**: Automatically categorizes clauses into *Obligations, Deadlines, Payment Terms, Termination, Penalties & Liabilities*, and *Auto-Renewal*. Compare original text against plain English translations.
* **🚨 Red Flags Radar**: Identifies one-sided, onerous, or high-risk clauses (severity: `HIGH`, `MEDIUM`, `LOW`), explaining *why* it's flagged alongside practical negotiation tips.
* **📋 Lawyer Prep Checklist**: Generates a printable, interactive checklist of document-specific questions to ask an attorney before signing.
* **💬 RAG Chat with Inline Citations**: Interactive chat drawer powered by semantic vector search. Click any citation to jump directly to the referenced clause.
* **🔄 Dual-Document Comparison**: Compare two document drafts or a lease vs tenant rights guide side-by-side to highlight added/removed terms, favorability shifts, and key takeaways.
* **⚡ 1-Click Seed Sample Documents**: Seeded with a *Residential Lease Agreement* and *Employment NDA & IP Assignment* for instant testing without needing manual uploads.

---

## 🏗️ Technical Architecture & Design Choices

```
lexclear/
├── backend/
│   ├── main.py                 # FastAPI endpoints & CORS configuration
│   ├── config.py               # Gemini settings & model configurations
│   ├── parsers/
│   │   ├── pdf_parser.py       # Page-by-page PDF extraction using PyPDF
│   │   └── docx_parser.py      # DOCX & table extraction using python-docx
│   ├── services/
│   │   ├── chunker.py          # Structural legal clause chunker
│   │   ├── gemini_service.py   # Gemini API structured JSON output schemas
│   │   ├── rag_engine.py       # In-memory vector store & citation engine
│   │   └── comparator.py       # Dual-document diff & favorability engine
│   ├── samples/
│   │   └── generate_samples.py # Seed sample document generator
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/                # Next.js App Router (layout, page)
    │   ├── components/         # DisclaimerBanner, ClauseExplorer, RedFlagsRadar, RagChat, etc.
    │   ├── lib/                # API client
    │   └── types/              # TypeScript interfaces
    ├── package.json
    └── tailwind.config.js
```

### Why Structural Legal Chunking over Fixed-Token Windows?
Standard chunking (e.g. 500 fixed tokens) breaks legal clauses across sentence boundaries or severs section titles from their conditions. LexClear's `chunker.py` uses pattern matching (`SECTION X`, `ARTICLE Y`, `1.1`, numbered sub-clauses) to preserve semantic legal clause boundaries, ensuring RAG retrieval yields full coherent legal clauses.

### Why Gemini Structured JSON Outputs?
Legal document analysis demands predictable, parseable data structures. Using `google-genai` SDK with `response_mime_type="application/json"` and Pydantic schemas guarantees that summaries, red flag severity ratings (`HIGH`/`MEDIUM`/`LOW`), and categorized clauses strictly conform to schema interfaces without markdown parsing fragility.

---

## 🛠️ Setup & Running Locally

### 1. Prerequisites
* **Python**: 3.11 or higher
* **Node.js**: 18.0 or higher
* **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)

---

### 2. Backend Setup (FastAPI)

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here

# Run backend dev server (Port 8000)
python -m uvicorn backend.main:app --reload --port 8000
```

---

### 3. Frontend Setup (Next.js)

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run frontend dev server (Port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Application

1. **Instant Seed Sample Test**: Click *"🏡 Residential Lease Agreement"* or *"💼 Employment NDA"* on the landing page to run analysis instantly.
2. **Custom Document Upload**: Drag and drop any PDF or DOCX file to run custom clause extraction and RAG indexing.
3. **Interactive RAG Chat**: Ask questions like *"What is the penalty for late rent?"* or *"What am I responsible for maintaining?"*. Notice the inline citations `[Section 2. Rent and Payment Terms]`.
4. **Guardrail Verification**: Ask out-of-scope questions like *"Should I sue my landlord in court?"* or *"Predict if I will win my dispute"*. Notice LexClear's guardrail decline notice and redirect to attorney prep questions.
5. **Dual-Document Compare**: Switch to Compare mode, load a second sample document, and view the side-by-side favorability breakdown.

---

## 📄 License
MIT License. Created for non-lawyer legal clarity powered by GenAI.
