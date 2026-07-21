// lib/guides/pages/gstr-9-fy2025-26.ts
import { LearnPageConfig } from '../pages';

export const gstr9FY2526: LearnPageConfig = {
  slug: 'gstr-9-fy2025-26',
  title: 'GSTR-9 Annual Return FY2025-26: Filing Guide and Due Date',
  seoTitle: 'GSTR-9 Annual Return FY2025-26 Filing Guide - Due December 31, 2026 | Ollvy',
  seoDescription:
    'Complete guide to filing GSTR-9 Annual Return for FY2025-26. Due date is December 31, 2026. Learn about eligibility, documents required, reconciliation process, and penalties for late filing.',
  canonicalUrl: 'https://www.ollvy.com/guides/gstr-9-fy2025-26',
  lastReviewed: 'April 2026',
  category: 'GST Filing',
  ctaServiceSlug: 'gst-monthly',
  relatedServiceSlugs: ['gst-monthly', 'business-itr'],
  relatedLearnSlugs: ['do-i-need-gst-registration', 'gst-gstr9-annual-return-mismatch'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing'],
    documentChecklists: ['gst-registration', 'business-itr'],
  },
  deadline: 'December 31, 2026',
  deadlineNote:
    'GSTR-9 is the consolidated annual return covering all GST transactions from April 2025 to March 2026.',

  sections: [
    {
      number: '01',
      heading: 'GSTR-9 ANNUAL RETURN FY2025-26 OVERVIEW',
      body: 'GSTR-9 is the annual return for GST registered taxpayers, consolidating all monthly/quarterly returns filed during the financial year. For FY2025-26, this covers GST transactions from April 1, 2025 to March 31, 2026.\n\nThe due date for filing GSTR-9 for FY2025-26 is December 31, 2026. This return is a comprehensive reconciliation of your outward supplies, inward supplies, ITC claimed, tax paid, and other GST transactions during the year.',
      note: 'Source: Section 44 of CGST Act, 2017 read with Rule 80.',
    },
    {
      number: '02',
      heading: 'WHO MUST FILE GSTR-9',
      body: 'GSTR-9 filing requirements depend on your registration type and turnover:',
      bullets: [
        'Regular taxpayers: All registered persons filing GSTR-1 and GSTR-3B must file GSTR-9',
        'Composition taxpayers: File GSTR-9A instead of GSTR-9',
        'Exempted categories: Casual taxable persons, non-resident taxable persons, Input Service Distributors, and persons deducting TDS/TCS',
        'Turnover exemption: Taxpayers with aggregate turnover up to Rs. 2 crore may be exempted (check latest notification)',
        'GSTR-9C (Reconciliation Statement): Required if turnover exceeds Rs. 5 crore - must be self-certified',
      ],
      note: 'GSTR-9C audit requirement was removed - now it is a self-certified reconciliation.',
    },
    {
      number: '03',
      heading: 'DOCUMENTS REQUIRED FOR GSTR-9',
      body: 'Gather these documents before starting your annual return:',
      bullets: [
        'All GSTR-1 returns filed for FY2025-26 (April 2025 to March 2026)',
        'All GSTR-3B returns filed for FY2025-26',
        'GSTR-2A/2B for all months - to reconcile ITC claimed vs available',
        'Audited financial statements - sales, purchases, and expense ledgers',
        'E-way bill data - for cross-verification of supply values',
        'Credit notes and debit notes issued and received during the year',
        'Advance received and adjusted during the year',
        'HSN-wise summary of outward supplies (mandatory for turnover above threshold)',
        'ITC register with supplier GSTIN, invoice details, and amounts',
      ],
    },
    {
      number: '04',
      heading: 'GSTR-9 TABLE-WISE BREAKDOWN',
      body: 'Understanding the key tables in GSTR-9:',
      bullets: [
        'Part I (Tables 1-3): Basic details - GSTIN, legal name, trade name',
        'Part II (Tables 4-5): Outward supplies - taxable, exempt, nil-rated, non-GST',
        'Part III (Tables 6-8): ITC details - claimed, reversed, ineligible',
        'Part IV (Tables 9): Tax paid - integrated, central, state, cess',
        'Part V (Tables 10-14): Amendments and adjustments from previous year returns',
        'Part VI (Tables 15-16): Refund and demand particulars',
        'Part VII (Tables 17-18): HSN summary of outward and inward supplies',
        'Part VIII (Tables 19): Late fee calculation and payment',
      ],
      note: 'Tables 10-14 require careful review - these capture amendments made during FY2025-26 for previous year transactions.',
    },
    {
      number: '05',
      heading: 'KEY RECONCILIATIONS BEFORE FILING',
      body: 'Complete these reconciliations before submitting GSTR-9:',
      bullets: [
        'GSTR-1 vs GSTR-3B: Match outward supplies reported in both returns - differences need explanation',
        'GSTR-3B vs Books: Reconcile GST liability in returns with accounting records',
        'ITC claimed vs GSTR-2B: Ensure ITC claimed does not exceed ITC available in GSTR-2B',
        'E-way bills vs GSTR-1: Verify supply values match across both systems',
        'HSN summary: Ensure HSN codes are correctly classified and values match invoice total',
        'Advances: Reconcile advances received in earlier period with invoices issued',
        'Credit/Debit notes: Match amendments with original invoices',
      ],
    },
    {
      number: '06',
      heading: 'PENALTY FOR LATE FILING',
      body: 'Missing the December 31, 2026 deadline results in these penalties:',
      bullets: [
        'Late fee: Rs. 200 per day (Rs. 100 CGST + Rs. 100 SGST) until the return is filed',
        'Maximum late fee: 0.50% of turnover in the state (0.25% CGST + 0.25% SGST)',
        'For nil returns: Late fee capped at Rs. 500 (Rs. 250 CGST + Rs. 250 SGST) in some cases',
        'Interest on unpaid tax: 18% per annum on any additional tax liability discovered during annual return',
        'No revision possible: Unlike GSTR-1/3B, GSTR-9 cannot be revised once filed',
        'Compliance rating impact: Late filing affects your GST compliance score',
      ],
      note: 'GSTR-9 cannot be revised - ensure thorough reconciliation before filing.',
    },
    {
      number: '07',
      heading: 'COMMON MISTAKES TO AVOID',
      body: 'Watch out for these frequent errors in GSTR-9 filing:',
      bullets: [
        'ITC mismatch: Claiming more ITC than available in GSTR-2B leads to notices',
        'B2C classification errors: Misclassifying B2B supplies as B2C or vice versa',
        'Missing amendments: Not reporting credit notes or debit notes from previous year',
        'HSN code errors: Wrong HSN classification or missing HSN summary for high-turnover businesses',
        'Advance adjustment: Not properly adjusting advances with subsequent invoices',
        'Export reporting: Incorrect classification of exports with/without payment',
        'Multi-state GSTIN: Forgetting to file GSTR-9 for each state registration separately',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is GSTR-9 mandatory for all GST registered taxpayers?',
      a: 'GSTR-9 is mandatory for regular taxpayers. However, taxpayers with aggregate turnover up to Rs. 2 crore may be exempted based on government notifications - check the latest circular. Composition taxpayers file GSTR-9A instead. Casual and non-resident taxpayers are exempt.',
    },
    {
      q: 'What is the difference between GSTR-9 and GSTR-9C?',
      a: 'GSTR-9 is the annual return filed by all regular taxpayers. GSTR-9C is a reconciliation statement required when turnover exceeds Rs. 5 crore - it reconciles GSTR-9 data with audited financial statements. GSTR-9C is now self-certified (CA audit requirement was removed).',
    },
    {
      q: 'Can I revise GSTR-9 after filing?',
      a: 'No, GSTR-9 cannot be revised once submitted. This makes it critical to thoroughly reconcile all data before filing. Any errors discovered later must be corrected through amendments in subsequent year returns or may result in notices from the department.',
    },
    {
      q: 'I filed GSTR-1 and GSTR-3B with some errors during the year. How do I handle this in GSTR-9?',
      a: 'Use Tables 10-14 in GSTR-9 to report amendments. Differences between GSTR-1 and GSTR-3B should be reconciled, and any additional tax liability should be paid before filing GSTR-9. The annual return is your opportunity to correct reporting discrepancies.',
    },
    {
      q: 'What happens if my GSTR-9 shows ITC claimed is more than ITC available in GSTR-2B?',
      a: 'You need to reverse the excess ITC either through DRC-03 payment before filing GSTR-9, or report it as ineligible ITC in the annual return. Claiming ITC not appearing in GSTR-2B will result in notices and potential demand proceedings.',
    },
  ],
};
