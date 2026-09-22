# Security Policy — LexClear

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Data Privacy & Confidentiality Guarantee

LexClear is built with a **Privacy-First Architecture** for sensitive legal documents:
1. **In-Memory Session Storage**: Uploaded legal agreements (PDFs/DOCXs) are processed purely in ephemeral memory sessions and are never persisted to databases or long-term disk storage.
2. **Local Session Eviction**: Sessions are automatically pruned via LRU eviction policies when cache limits are reached.
3. **No Training on User Data**: User contracts are never used to train public foundational AI models.
4. **Input Sanitization & Validation**:
   - Strict file type verification (whitelisted to `.pdf`, `.docx`, `.txt`).
   - Maximum upload file size enforced at 10 MB.
   - Text inputs and queries are escaped against script injection (XSS).
5. **Security Headers**:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - `Referrer-Policy: strict-origin-when-cross-origin`

## Reporting a Vulnerability

If you discover a security vulnerability within LexClear:
1. Please open a confidential advisory or contact the maintainers.
2. Do not report security vulnerabilities through public GitHub issues.
3. Include detailed steps to reproduce the issue.
4. We will acknowledge receipt of your vulnerability report within 24 hours.
