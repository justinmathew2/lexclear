import os
import io
from pypdf import PdfWriter, PageObject
from pypdf.annotations import Text

SAMPLE_LEASE_TEXT = """RESIDENTIAL LEASE AGREEMENT

PARTIES
This Residential Lease Agreement ("Agreement") is entered into as of January 1, 2026, by and between Alpha Real Estate Holdings LLC ("Landlord") and John Doe & Jane Doe ("Tenant").

SECTION 1. PROPERTY AND TERM
Landlord hereby leases to Tenant the premises located at 742 Evergreen Terrace, Suite 3B, Springfield ("Premises"). The term of this Lease shall be for 12 months, commencing on February 1, 2026, and ending on January 31, 2027.

SECTION 2. RENT AND PAYMENT TERMS
Tenant agrees to pay Landlord monthly rent in the amount of $2,400.00 USD, payable on or before the 1st day of each calendar month. Payments received after the 3rd of the month shall incur an immediate initial Late Fee of $150.00, plus an additional penalty of $25.00 per day until rent is paid in full.

SECTION 3. SECURITY DEPOSIT AND DEDUCTIONS
Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $4,800.00 as a Security Deposit. Landlord reserves the right to retain the entire Security Deposit if Tenant terminates prior to the 12-month term. Landlord may deduct funds for professional carpet cleaning, painting, administrative processing fees ($250 flat fee), and any alleged damages at Landlord's sole discretion without providing detailed repair receipts.

SECTION 4. AUTOMATIC RENEWAL AND NOTICE
This Agreement shall AUTOMATICALLY RENEW for an additional 12-month period at a 15% rent increase unless Tenant provides written notice of non-renewal via Certified Mail at least ninety (90) days prior to the expiration date. Verbal or email notification of non-renewal shall be deemed invalid.

SECTION 5. MAINTENANCE, REPAIRS, AND RIGHT OF ENTRY
Tenant shall maintain the Premises in good condition. Tenant is responsible for all repairs under $300. Landlord and Landlord's agents reserve the right to enter the Premises at any time, 24/7, without prior written or verbal notice, for inspection, maintenance, or showing the property to prospective buyers.

SECTION 6. SUBLETTING AND GUESTS
Subletting, short-term rental hosting (e.g. Airbnb), or assignment of this Lease is strictly prohibited. Guests remaining on the Premises for more than 3 consecutive days shall be deemed unauthorized occupants, incurring a fine of $100 per guest per day.

SECTION 7. PENALTIES, INDEMNIFICATION, AND LEGAL FEES
Tenant agrees to indemnify, defend, and hold harmless Landlord from any liability, injury, damage, or legal claims arising on the Premises. In any dispute, Tenant waives the right to a jury trial and agrees to pay Landlord's full legal fees regardless of trial outcome.

IN WITNESS WHEREOF, the Parties have executed this Lease Agreement.
Landlord: Alpha Real Estate Holdings LLC
Tenant: John Doe & Jane Doe
"""

SAMPLE_NDA_TEXT = """MUTUAL NON-DISCLOSURE AND INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT

PARTIES
This Agreement ("Agreement") is made effective as of March 15, 2026, by and between Apex Tech Solutions Inc. ("Company") and Alex Mercer ("Contractor/Employee").

ARTICLE I: CONFIDENTIAL INFORMATION
Contractor acknowledges that during engagement, Contractor will have access to proprietary software, algorithms, client lists, and trade secrets ("Confidential Information"). Contractor agrees to hold all Confidential Information in strict confidence perpetually, even after termination.

ARTICLE II: INTELLECTUAL PROPERTY ASSIGNMENT
Contractor hereby irrevocably assigns, transfers, and conveys to Company ALL rights, title, and intellectual property created, authored, or conceived by Contractor during the term of engagement—including side projects, inventions, ideas, or personal software code developed on personal hardware outside working hours.

ARTICLE III: NON-COMPETE AND NON-SOLICITATION
During engagement and for a period of twenty-four (24) months following termination for any reason, Contractor shall not:
(a) Work for, consult with, or advise any entity competing in the technology sector worldwide.
(b) Solicit, recruit, or hire any employee, client, or contractor of Company.

ARTICLE IV: TERMINATION AND SEVERANCE
Company may terminate this Agreement immediately at any time without notice or cause. Contractor must provide sixty (60) days advance written notice prior to resignation. Upon termination, Contractor forfeits all accrued but unpaid bonuses or compensation adjustments.

ARTICLE V: GOVERNING LAW AND MANDATORY ARBITRATION
This Agreement shall be governed by Delaware law. Any dispute shall be settled by binding arbitration in Wilmington, Delaware. Contractor waives all rights to participate in class-action lawsuits or jury proceedings.

IN WITNESS WHEREOF, the Parties execute this Agreement.
Company: Apex Tech Solutions Inc.
Contractor: Alex Mercer
"""

def generate_pdf_from_text(text: str, filename: str):
    """Utility to generate a clean PDF file from string text."""
    # We can write plain formatted PDF streams or create text files
    # PyPDF doesn't directly build layout from text, so we can create text file or PDF formatted file
    # Let's create both .pdf and .txt or simple PDF stream
    out_dir = os.path.dirname(filename)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir, exist_ok=True)
        
    # Write text version for direct parser convenience
    txt_path = filename.replace('.pdf', '.txt')
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(text)

    # Simple PDF generator using fpdf2 or pdf writer structure or raw text format
    # To keep it robust without external heavy dependencies, we write clean text / formatted files
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(text)

def build_seed_samples():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    lease_path = os.path.join(base_dir, "residential_lease.pdf")
    nda_path = os.path.join(base_dir, "employment_nda.pdf")
    
    generate_pdf_from_text(SAMPLE_LEASE_TEXT, lease_path)
    generate_pdf_from_text(SAMPLE_NDA_TEXT, nda_path)
    print("Seed sample documents generated successfully in backend/samples/")

if __name__ == "__main__":
    build_seed_samples()
