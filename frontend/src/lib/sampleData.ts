import { ParsedDocument, SampleDoc } from '@/types';

export className DEFAULT_SAMPLES: SampleDoc[] = [
  {
    key: "residential_lease",
    title: "🏡 Residential Lease Agreement",
    description: "Standard 12-month apartment lease with auto-renewal, late fee penalties, and right of entry clauses.",
    file_type: "PDF"
  },
  {
    key: "employment_nda",
    title: "💼 Employment NDA & IP Assignment",
    description: "Corporate agreement with broad IP ownership rights, 24-month non-compete, and mandatory Delaware arbitration.",
    file_type: "PDF"
  }
];

export const SAMPLE_LEASE_PARSED: ParsedDocument = {
  doc_id: "sample_residential_lease",
  title: "Residential Lease Agreement.pdf",
  word_count: 385,
  clause_count: 7,
  raw_text: `RESIDENTIAL LEASE AGREEMENT

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
Tenant agrees to indemnify, defend, and hold harmless Landlord from any liability, injury, damage, or legal claims arising on the Premises. In any dispute, Tenant waives the right to a jury trial and agrees to pay Landlord's full legal fees regardless of trial outcome.`,

  chunks: [
    {
      clause_id: "clause_1",
      section_title: "SECTION 1. PROPERTY AND TERM",
      content: "Landlord hereby leases to Tenant the premises located at 742 Evergreen Terrace, Suite 3B, Springfield (\"Premises\"). The term of this Lease shall be for 12 months, commencing on February 1, 2026, and ending on January 31, 2027.",
      word_count: 42,
      start_char: 0,
      end_char: 215
    },
    {
      clause_id: "clause_2",
      section_title: "SECTION 2. RENT AND PAYMENT TERMS",
      content: "Tenant agrees to pay Landlord monthly rent in the amount of $2,400.00 USD, payable on or before the 1st day of each calendar month. Payments received after the 3rd of the month shall incur an immediate initial Late Fee of $150.00, plus an additional penalty of $25.00 per day until rent is paid in full.",
      word_count: 61,
      start_char: 216,
      end_char: 520
    },
    {
      clause_id: "clause_3",
      section_title: "SECTION 3. SECURITY DEPOSIT AND DEDUCTIONS",
      content: "Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $4,800.00 as a Security Deposit. Landlord reserves the right to retain the entire Security Deposit if Tenant terminates prior to the 12-month term. Landlord may deduct funds for professional carpet cleaning, painting, administrative processing fees ($250 flat fee), and any alleged damages at Landlord's sole discretion without providing detailed repair receipts.",
      word_count: 72,
      start_char: 521,
      end_char: 940
    },
    {
      clause_id: "clause_4",
      section_title: "SECTION 4. AUTOMATIC RENEWAL AND NOTICE",
      content: "This Agreement shall AUTOMATICALLY RENEW for an additional 12-month period at a 15% rent increase unless Tenant provides written notice of non-renewal via Certified Mail at least ninety (90) days prior to the expiration date. Verbal or email notification of non-renewal shall be deemed invalid.",
      word_count: 48,
      start_char: 941,
      end_char: 1240
    },
    {
      clause_id: "clause_5",
      section_title: "SECTION 5. MAINTENANCE, REPAIRS, AND RIGHT OF ENTRY",
      content: "Tenant shall maintain the Premises in good condition. Tenant is responsible for all repairs under $300. Landlord and Landlord's agents reserve the right to enter the Premises at any time, 24/7, without prior written or verbal notice, for inspection, maintenance, or showing the property to prospective buyers.",
      word_count: 52,
      start_char: 1241,
      end_char: 1550
    },
    {
      clause_id: "clause_6",
      section_title: "SECTION 6. SUBLETTING AND GUESTS",
      content: "Subletting, short-term rental hosting (e.g. Airbnb), or assignment of this Lease is strictly prohibited. Guests remaining on the Premises for more than 3 consecutive days shall be deemed unauthorized occupants, incurring a fine of $100 per guest per day.",
      word_count: 41,
      start_char: 1551,
      end_char: 1810
    },
    {
      clause_id: "clause_7",
      section_title: "SECTION 7. PENALTIES, INDEMNIFICATION, AND LEGAL FEES",
      content: "Tenant agrees to indemnify, defend, and hold harmless Landlord from any liability, injury, damage, or legal claims arising on the Premises. In any dispute, Tenant waives the right to a jury trial and agrees to pay Landlord's full legal fees regardless of trial outcome.",
      word_count: 48,
      start_char: 1811,
      end_char: 2100
    }
  ],

  analysis: {
    summary: {
      executive_summary: "This is a 12-month residential lease agreement between Alpha Real Estate Holdings (Landlord) and John & Jane Doe (Tenant) for rent of $2,400/month. The contract imposes strict payment deadlines, aggressive late fees, automatic renewal conditions, and broad landlord entry permissions.\n\nWhile standard in structure, several clauses strongly favor the landlord—including discretionary security deposit deductions, a 15% rent hike upon auto-renewal unless 90 days certified mail notice is given, and full legal fee shifting onto the tenant.",
      document_type: "Residential Lease Agreement",
      key_parties: "Landlord: Alpha Real Estate Holdings LLC | Tenant: John Doe & Jane Doe",
      core_purpose: "Leasing apartment unit 3B at 742 Evergreen Terrace for 12 months at $2,400/month.",
      real_world_analogy: "Like renting a hotel room for a year, but if you check out one day late or forget to send a certified letter 3 months in advance, the hotel locks you into another full year at 15% higher rates and charges you for repainting the room."
    },
    clause_breakdown: [
      {
        category: "PAYMENT_TERMS",
        title: "Monthly Rent & Late Fees",
        section_reference: "SECTION 2",
        original_excerpt: "Tenant agrees to pay Landlord monthly rent in the amount of $2,400.00 USD, payable on or before the 1st day of each calendar month. Payments received after the 3rd of the month shall incur an immediate initial Late Fee of $150.00, plus an additional penalty of $25.00 per day until rent is paid in full.",
        plain_english_translation: "Rent is $2,400 due on the 1st. You get a 2-day grace period until the 3rd. If rent isn't paid by the 3rd, you instantly owe a $150 fee PLUS $25 for every single day rent remains unpaid.",
        key_impact: "Financial penalty: Paying rent on the 10th costs an extra $325 in fees ($150 base + 7 days x $25)."
      },
      {
        category: "AUTO_RENEWAL",
        title: "Automatic Renewal & 15% Rent Increase",
        section_reference: "SECTION 4",
        original_excerpt: "This Agreement shall AUTOMATICALLY RENEW for an additional 12-month period at a 15% rent increase unless Tenant provides written notice of non-renewal via Certified Mail at least ninety (90) days prior to the expiration date.",
        plain_english_translation: "The lease automatically extends for another full year at $2,760/month (15% increase) unless you send a physical Certified Mail letter 90 days before the lease ends. Email or text notifications do not count.",
        key_impact: "Critical deadline: You must send certified mail by November 2, 2026 to prevent being locked into another year."
      },
      {
        category: "OBLIGATIONS",
        title: "24/7 Landlord Unannounced Entry",
        section_reference: "SECTION 5",
        original_excerpt: "Landlord and Landlord's agents reserve the right to enter the Premises at any time, 24/7, without prior written or verbal notice, for inspection, maintenance, or showing the property to prospective buyers.",
        plain_english_translation: "The landlord can enter your apartment at any time of day or night without giving you any notice beforehand.",
        key_impact: "Loss of privacy: Violates standard tenant privacy norms (which typically require 24-hour advance written notice)."
      },
      {
        category: "PENALTIES_LIABILITIES",
        title: "Discretionary Security Deposit Deductions",
        section_reference: "SECTION 3",
        original_excerpt: "Landlord reserves the right to retain the entire Security Deposit if Tenant terminates prior to the 12-month term. Landlord may deduct funds for professional carpet cleaning, painting, administrative processing fees ($250 flat fee), and any alleged damages at Landlord's sole discretion without providing detailed repair receipts.",
        plain_english_translation: "The landlord can keep your $4,800 deposit for routine cleaning, painting, and admin fees without giving you receipts or proving actual damages.",
        key_impact: "Risk of losing deposit ($4,800) even if you leave the apartment in clean condition."
      },
      {
        category: "DEADLINES",
        title: "Repairs & Maintenance Cap",
        section_reference: "SECTION 5",
        original_excerpt: "Tenant is responsible for all repairs under $300.",
        plain_english_translation: "You must pay out of pocket for any minor plumbing, electrical, or appliance repairs costing less than $300.",
        key_impact: "Unexpected maintenance costs for minor household fixes."
      },
      {
        category: "TERMINATION",
        title: "Subletting & Guest Fines",
        section_reference: "SECTION 6",
        original_excerpt: "Subletting, short-term rental hosting (e.g. Airbnb), or assignment of this Lease is strictly prohibited. Guests remaining on the Premises for more than 3 consecutive days shall be deemed unauthorized occupants, incurring a fine of $100 per guest per day.",
        plain_english_translation: "No Airbnb or subletting allowed. If a friend stays over for more than 3 nights, you are fined $100 per day.",
        key_impact: "Strict guest restrictions and heavy daily fines for overnight visitors."
      }
    ],
    red_flags: [
      {
        severity: "HIGH",
        clause_title: "24/7 Unannounced Landlord Entry Rights",
        section_reference: "SECTION 5",
        original_text: "Landlord reserves the right to enter the Premises at any time, 24/7, without prior written or verbal notice...",
        why_flagged: "Severely restricts tenant privacy and peace of mind. Most state laws and standard leases require at least 24 hours written notice except during emergency fires/floods.",
        negotiation_tip: "Ask to amend Section 5 to require: 'at least 24 hours advance written notice prior to non-emergency entry during reasonable business hours (9 AM - 5 PM)'."
      },
      {
        severity: "HIGH",
        clause_title: "Strict Auto-Renewal via Certified Mail Only",
        section_reference: "SECTION 4",
        original_text: "AUTOMATICALLY RENEW for an additional 12-month period at a 15% rent increase unless Tenant provides written notice via Certified Mail at least ninety (90) days prior...",
        why_flagged: "90 days is an unusually long notice window (standard is 30-60 days), and restricting notice exclusively to Certified Mail while invalidating email can cause tenants to accidentally trigger a 15% rent hike.",
        negotiation_tip: "Request shortening notice to 60 days and allowing written notice via email to landlord's official address."
      },
      {
        severity: "MEDIUM",
        clause_title: "Discretionary Deposit Deduction Without Receipts",
        section_reference: "SECTION 3",
        original_text: "Landlord may deduct funds for professional carpet cleaning, painting, administrative processing fees ($250 flat fee)... without providing detailed repair receipts.",
        why_flagged: "Gives landlord broad discretion to deduct non-damage items like routine repainting and admin fees from your deposit without proof of itemized costs.",
        negotiation_tip: "Request removing flat admin fees and adding a clause that deposit deductions require itemized receipts for actual damages beyond normal wear and tear."
      },
      {
        severity: "MEDIUM",
        clause_title: "Daily Compounding Late Fee ($150 + $25/day)",
        section_reference: "SECTION 2",
        original_text: "Payments received after the 3rd... incur an immediate initial Late Fee of $150.00, plus an additional penalty of $25.00 per day...",
        why_flagged: "Combining a $150 initial fee with $25/day can quickly accumulate to an excessive 15%+ penalty on a single late rent check.",
        negotiation_tip: "Propose capping total late fees at 5% of monthly rent ($120 max) per state standards."
      }
    ],
    lawyer_checklist: [
      {
        category: "Tenant Privacy & Entry",
        question: "Is the 24/7 unannounced landlord entry clause in Section 5 enforceable under local residential tenant protection laws?",
        clause_reference: "SECTION 5",
        why_ask: "Local housing codes usually mandate a statutory 24-hour notice requirement that overrides contract terms."
      },
      {
        category: "Auto-Renewal & Notice",
        question: "Does local tenant law limit mandatory auto-renewal notice periods to 60 days or require landlord disclosure reminders?",
        clause_reference: "SECTION 4",
        why_ask: "Many jurisdictions restrict automatic lease renewals unless the landlord sends a written reminder 15-30 days before the notice deadline."
      },
      {
        category: "Security Deposit",
        question: "Are flat administrative fees ($250) and discretionary carpet cleaning deductions legal to deduct from security deposits?",
        clause_reference: "SECTION 3",
        why_ask: "State deposit laws generally prohibit deductions for 'normal wear and tear' regardless of lease language."
      },
      {
        category: "Dispute Resolution & Legal Fees",
        question: "Does the tenant waiver of jury trial and one-sided legal fee clause in Section 7 stand up in court?",
        clause_reference: "SECTION 7",
        why_ask: "Some states automatically make legal fee clauses reciprocal so the winning party recovers fees regardless of who is named in the lease."
      }
    ]
  },
  disclaimer: "This is general informational analysis generated by AI, not legal advice."
};

export const SAMPLE_NDA_PARSED: ParsedDocument = {
  doc_id: "sample_employment_nda",
  title: "Employment NDA & IP Assignment.pdf",
  word_count: 310,
  clause_count: 5,
  raw_text: `MUTUAL NON-DISCLOSURE AND INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT

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
This Agreement shall be governed by Delaware law. Any dispute shall be settled by binding arbitration in Wilmington, Delaware. Contractor waives all rights to participate in class-action lawsuits or jury proceedings.`,

  chunks: [
    {
      clause_id: "clause_1",
      section_title: "ARTICLE I: CONFIDENTIAL INFORMATION",
      content: "Contractor acknowledges that during engagement, Contractor will have access to proprietary software, algorithms, client lists, and trade secrets (\"Confidential Information\"). Contractor agrees to hold all Confidential Information in strict confidence perpetually, even after termination.",
      word_count: 36,
      start_char: 0,
      end_char: 290
    },
    {
      clause_id: "clause_2",
      section_title: "ARTICLE II: INTELLECTUAL PROPERTY ASSIGNMENT",
      content: "Contractor hereby irrevocably assigns, transfers, and conveys to Company ALL rights, title, and intellectual property created, authored, or conceived by Contractor during the term of engagement—including side projects, inventions, ideas, or personal software code developed on personal hardware outside working hours.",
      word_count: 41,
      start_char: 291,
      end_char: 600
    },
    {
      clause_id: "clause_3",
      section_title: "ARTICLE III: NON-COMPETE AND NON-SOLICITATION",
      content: "During engagement and for a period of twenty-four (24) months following termination for any reason, Contractor shall not: (a) Work for, consult with, or advise any entity competing in the technology sector worldwide. (b) Solicit, recruit, or hire any employee, client, or contractor of Company.",
      word_count: 45,
      start_char: 601,
      end_char: 920
    },
    {
      clause_id: "clause_4",
      section_title: "ARTICLE IV: TERMINATION AND SEVERANCE",
      content: "Company may terminate this Agreement immediately at any time without notice or cause. Contractor must provide sixty (60) days advance written notice prior to resignation. Upon termination, Contractor forfeits all accrued but unpaid bonuses or compensation adjustments.",
      word_count: 38,
      start_char: 921,
      end_char: 1200
    },
    {
      clause_id: "clause_5",
      section_title: "ARTICLE V: GOVERNING LAW AND MANDATORY ARBITRATION",
      content: "This Agreement shall be governed by Delaware law. Any dispute shall be settled by binding arbitration in Wilmington, Delaware. Contractor waives all rights to participate in class-action lawsuits or jury proceedings.",
      word_count: 32,
      start_char: 1201,
      end_char: 1450
    }
  ],

  analysis: {
    summary: {
      executive_summary: "This is a highly restrictive employment NDA and IP assignment agreement between Apex Tech Solutions Inc. (Company) and Alex Mercer (Contractor/Employee). It imposes perpetual confidentiality, total ownership over personal side projects developed outside work hours, a 24-month worldwide non-compete, and immediate company termination rights with bonus forfeiture.",
      document_type: "Employment NDA & IP Assignment",
      key_parties: "Company: Apex Tech Solutions Inc. | Employee/Contractor: Alex Mercer",
      core_purpose: "Assigning IP rights, imposing 2-year non-compete restrictions, and establishing Delaware arbitration.",
      real_world_analogy: "Like handing over the keys to your personal garage workspace: anything you build on your own time belongs to the company, and if you leave, you can't work in tech anywhere for two years."
    },
    clause_breakdown: [
      {
        category: "PENALTIES_LIABILITIES",
        title: "Overbroad Personal IP Ownership",
        section_reference: "ARTICLE II",
        original_excerpt: "Contractor hereby irrevocably assigns... ALL rights, title, and intellectual property created... including side projects, inventions, ideas, or personal software code developed on personal hardware outside working hours.",
        plain_english_translation: "The company owns everything you create, even if you code personal side projects on your own computer at home during weekends.",
        key_impact: "Total loss of ownership over personal coding projects or independent software ideas."
      },
      {
        category: "OBLIGATIONS",
        title: "24-Month Worldwide Non-Compete",
        section_reference: "ARTICLE III",
        original_excerpt: "During engagement and for a period of twenty-four (24) months following termination... Contractor shall not work for, consult with, or advise any entity competing in the technology sector worldwide.",
        plain_english_translation: "You cannot work for or advise any tech company anywhere in the world for 2 full years after leaving Apex Tech.",
        key_impact: "Severe employment restriction making it difficult to work in software engineering post-resignation."
      },
      {
        category: "TERMINATION",
        title: "Immediate Company Termination & Bonus Forfeiture",
        section_reference: "ARTICLE IV",
        original_excerpt: "Company may terminate this Agreement immediately at any time without notice or cause. Contractor must provide sixty (60) days advance written notice prior to resignation. Upon termination, Contractor forfeits all accrued but unpaid bonuses...",
        plain_english_translation: "The company can fire you instantly without notice, but you must give 60 days notice to quit. Firing you forfeits any earned unpaid bonuses.",
        key_impact: "Asymmetric termination rights favoring employer; loss of earned bonuses upon exit."
      }
    ],
    red_flags: [
      {
        severity: "HIGH",
        clause_title: "Unilateral Ownership of Personal Side Projects",
        section_reference: "ARTICLE II",
        original_text: "including side projects, inventions, ideas, or personal software code developed on personal hardware outside working hours.",
        why_flagged: "Overbroad IP assignment claims personal hobby projects built off-the-clock without company resources.",
        negotiation_tip: "Add standard exception: 'Excludes inventions created entirely on personal time without company equipment, trade secrets, or confidential data.'"
      },
      {
        severity: "HIGH",
        clause_title: "24-Month Global Tech Non-Compete",
        section_reference: "ARTICLE III",
        original_text: "period of twenty-four (24) months following termination... shall not work for... any entity competing in the technology sector worldwide.",
        why_flagged: "A 2-year global ban on working in tech is extremely restrictive and unenforceable in many states (e.g., California, Minnesota).",
        negotiation_tip: "Propose striking the non-compete entirely or scoping it narrowly to direct product competitors."
      }
    ],
    lawyer_checklist: [
      {
        category: "IP & Side Projects",
        question: "Is the assignment of off-the-clock personal side projects in Article II legal under state labor codes?",
        clause_reference: "ARTICLE II",
        why_ask: "States like CA, WA, and NY statutory protect employee ownership of side inventions created on personal time."
      },
      {
        category: "Non-Compete Enforceability",
        question: "Is the 24-month worldwide non-compete in Article III enforceable in my jurisdiction?",
        clause_reference: "ARTICLE III",
        why_ask: "FTC rules and state laws increasingly ban non-compete agreements for workers."
      }
    ]
  },
  disclaimer: "This is general informational analysis generated by AI, not legal advice."
};
