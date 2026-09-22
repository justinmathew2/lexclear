# Contributing to LexClear

Thank you for your interest in contributing to **LexClear**!

## Code Quality & Standards

1. **Python Backend**:
   - Adhere to PEP 8 standards.
   - All public functions must contain descriptive docstrings and type annotations.
   - Run tests before pushing:
     ```bash
     python -m pytest backend/tests/ -v
     ```
2. **Next.js Frontend**:
   - Maintain strict TypeScript typings (no `any` without justification).
   - Ensure WCAG 2.1 AA accessibility (all interactive elements require ARIA attributes and focus rings).
   - Run tests before pushing:
     ```bash
     cd frontend && npm test
     ```
3. **Security**:
   - Never commit API keys or credentials.
   - Ensure all user inputs are sanitized against XSS.
