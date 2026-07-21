// =============================================================================
// GUIDE PAGE: gst-annual-2027
// File path: lib/guides/pages/gst-annual-2027.ts
// Authored fresh covering GSTR-9 and GSTR-9C annual GST filing for FY 2025-26
// (due 31 December 2026). Forward-looking guide with current rules.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const gstAnnual2027: LearnPageConfig = {
  slug: "gst-annual-2027",
  title: "GST Annual Return for FY 2025-26: GSTR-9 and GSTR-9C Due 31 December 2026",
  seoTitle: "GST Annual Return FY 2025-26 | GSTR-9 GSTR-9C Due 31 December 2026 | Ollvy",
  seoDescription:
    "Annual GST return for FY 2025-26 due 31 December 2026. GSTR-9 mandatory above Rs 2 crore turnover, GSTR-9C above Rs 5 crore. Tiered late fee structure, self-certification, ITC reconciliation under Rules 37 and 37A.",
  canonicalUrl: "https://www.ollvy.com/guides/gst-annual-2027",
  lastReviewed: "May 2026",
  category: "GST",
  relatedServiceSlugs: ["gst-monthly", "gst-registration"],
  relatedLearnSlugs: ["gst-annual-2026", "lut-for-exports", "iec-import-export-code"],
  ctaServiceSlug: "gst-monthly",
  sections: [
    {
      id: "01",
      heading: "WHAT THIS RETURN IS FOR",
      body:
        "GSTR-9 and GSTR-9C are the annual GST filings that consolidate everything you reported through GSTR-1 (outward supplies) and GSTR-3B (tax payment) over the financial year, then reconcile against your books and audited financial statements. The FY 2025-26 return is your annual statement for the period 1 April 2025 to 31 March 2026, due 31 December 2026. It's the second annual GST filing under the rationalised tiered late-fee regime introduced by Notification 07/2023.",
    },
    {
      id: "02",
      heading: "WHO HAS TO FILE",
      body:
        "Eligibility is based on aggregate turnover at the PAN level for the financial year. Subject to any exemption notification CBIC issues for FY 2025-26 specifically, the standard rules are:",
      table: {
        headers: ["Aggregate Turnover (FY 2025-26, PAN-level)", "GSTR-9", "GSTR-9C"],
        rows: [
          ["Up to Rs 2 crore", "Optional (typically waived by annual notification)", "Not required"],
          ["Rs 2 crore to Rs 5 crore", "Mandatory", "Not required"],
          ["Above Rs 5 crore", "Mandatory", "Mandatory"],
        ],
      },
      note:
        "Watch for the FY 2025-26 notification (typically issued by CBIC in Q3 of 2026) confirming or modifying the Rs 2 crore exemption. The structure has been consistent since FY 2017-18 but is reconfirmed annually.",
    },
    {
      id: "03",
      heading: "WHO IS EXCLUDED",
      body:
        "Some categories of registered persons don't file GSTR-9 regardless of turnover. They have their own annual or specific returns.",
      bullets: [
        "Composition scheme dealers: file GSTR-4 (not GSTR-9). The earlier GSTR-9A for composition has been discontinued.",
        "Casual taxable persons: temporary GST registrations don't trigger GSTR-9.",
        "Input Service Distributors (ISDs).",
        "Non-resident taxable persons.",
        "Tax deductors under Section 51 (TDS deductors).",
        "Tax collectors at source (e-commerce operators) under Section 52: file GSTR-9B instead.",
      ],
    },
    {
      id: "04",
      heading: "DUE DATES AND TIMELINES",
      body:
        "31 December following the close of the financial year, for both GSTR-9 and GSTR-9C. Plan to start the reconciliation work in October 2026.",
      bullets: [
        "FY 2025-26 GSTR-9 / GSTR-9C: due 31 December 2026.",
        "Internal milestone: complete GSTR-1 / GSTR-3B reconciliation by end of October 2026.",
        "Internal milestone: build the turnover bridge and ITC bridge by end of November 2026.",
        "Filing target: 15 December 2026 to leave buffer for portal issues or last-minute corrections.",
        "Late fee: triggered the day after 31 December until the date of filing.",
      ],
    },
    {
      id: "05",
      heading: "TIERED LATE FEE STRUCTURE",
      body:
        "The CBIC Notification 07/2023 tiered late fee structure (effective from FY 2022-23 onwards) continues for FY 2025-26. The fee is per-day under both CGST and SGST acts, with no late fee under IGST.",
      table: {
        headers: ["Aggregate Turnover", "Late Fee per Day (CGST + SGST)", "Maximum Cap"],
        rows: [
          ["Up to Rs 5 crore", "Rs 50 (Rs 25 + Rs 25)", "0.04% of turnover per Act"],
          ["Rs 5 crore to Rs 20 crore", "Rs 100 (Rs 50 + Rs 50)", "0.04% of turnover per Act"],
          ["Above Rs 20 crore", "Rs 200 (Rs 100 + Rs 100)", "0.50% of turnover per Act"],
        ],
      },
      note:
        "GSTR-9C late fee accrues separately from the later of (a) GSTR-9 actual filing date or (b) 31 December due date, until GSTR-9C is filed. So filing GSTR-9 on time and missing GSTR-9C still triggers the per-day fee on GSTR-9C.",
    },
    {
      id: "06",
      heading: "GSTR-9 FORM STRUCTURE",
      body:
        "Six parts and 19 sections. Most fields auto-populate from your filed GSTR-1 and GSTR-3B. Your role is to reconcile and report differences.",
      bullets: [
        "Part I (Tables 1-3): Basic info, GSTIN, legal name, financial year.",
        "Part II (Tables 4-5): Outward supplies. Taxable, zero-rated, exempt, nil-rated, plus credit and debit notes within the same FY.",
        "Part III (Tables 6-8): Input Tax Credit. ITC availed, reversed (Rules 37 / 37A), reclaimed, reconciled with GSTR-2B.",
        "Part IV (Table 9): Tax paid analysis (cash vs ITC) by tax head.",
        "Part V (Tables 10-13): Cross-year transactions. FY 2024-25 entries adjusted in FY 2025-26 GSTR-3B (Tables 10-11) and FY 2025-26 entries adjusted in FY 2026-27 GSTR-3B (Tables 12-13).",
        "Part VI (Tables 15-19): Demands, refunds, HSN-wise summary, segregated supplies.",
      ],
    },
    {
      id: "07",
      heading: "GSTR-9C: WHAT THE RECONCILIATION DOES",
      body:
        "GSTR-9C bridges your audited financial statements with your GSTR-9. It surfaces gaps that arise because GST treats supplies differently from how books treat revenue and expenses. Common reconciling items include accrual revenue not yet reported, supplies subject to tax in books but exempted under GST, ITC reversed in books but not yet in returns, and cross-year credit notes. From FY 2024-25, new tables (6A1, 8H1) for granular ITC tracking under Rules 37 / 37A continue into FY 2025-26.",
      bullets: [
        "Self-certified by the taxpayer's authorised signatory. No mandatory CA / CMA certification (rule unchanged since FY 2020-21).",
        "Reconciliation of turnover (Part II): match audited turnover to GSTR-9 turnover, report differences.",
        "Reconciliation of tax (Part III): match audited tax liability to GSTR-9 tax paid.",
        "Reconciliation of ITC (Part IV): match book ITC to GSTR-9 ITC, including Rule 37 / 37A treatment.",
        "Auto-calculated late fee table (Table 17, introduced for FY 2024-25, continues).",
      ],
    },
    {
      id: "08",
      heading: "DOCUMENTS YOU WILL NEED",
      body:
        "Build a centralised file by mid-October 2026. Most rework cycles come from missing or unreconciled data.",
      bullets: [
        "GSTR-1 summaries for all 12 months of FY 2025-26 plus any GSTR-1A amendments.",
        "GSTR-3B summaries for all 12 months.",
        "GSTR-2B reports monthly (post-October 2026 uploads matter for cross-year ITC claims).",
        "Books of account: trial balance, P&L, balance sheet, ledgers (rate-wise and GSTIN-wise).",
        "Sales register: taxable, exempt, nil-rated, exports, SEZ, e-commerce supplies under Section 9(5).",
        "Purchase register: inputs, input services, capital goods, RCM supplies, imports, unregistered purchases.",
        "Credit and debit notes register, with cross-year timing flags.",
        "If filing GSTR-9C: audited financial statements, Form 3CD if tax audit done, expense reconciliation for non-GST items (salary, depreciation, taxes paid).",
        "Documentation for any exception items or unreconciled differences (so you can answer if the proper officer asks).",
      ],
    },
    {
      id: "09",
      heading: "PENALTY FOR NON-FILING",
      body:
        "Beyond the per-day late fee, repeated non-filing has serious operational consequences.",
      bullets: [
        "GST registration cancellation under Section 29(2)(c) for continuous non-filing.",
        "Best judgment assessment under Section 62 (proper officer estimates your liability).",
        "Blocked input tax credit for buyers on supplies you made (they cannot reconcile).",
        "Section 125 general penalty up to Rs 25,000 per Act for repeated default.",
        "Reputational impact: regulators, buyers and lenders cross-check GST compliance during due diligence.",
      ],
    },
  ],
  faqs: [
    {
      q: "When is GSTR-9 / 9C for FY 2025-26 due?",
      a: "31 December 2026 for both. Plan to start the reconciliation work in October 2026, especially if you're a Rs 5 crore-plus business filing GSTR-9C, since the books-vs-returns reconciliation takes time. Aim to file by 15 December 2026 to leave buffer for portal issues or last-minute corrections.",
    },
    {
      q: "Do I file GSTR-9 if my turnover is below Rs 2 crore?",
      a: "Not mandatory if the FY 2025-26 exemption notification follows the precedent. CBIC has consistently waived GSTR-9 for taxpayers with aggregate turnover up to Rs 2 crore since FY 2017-18, and reaffirmed this for FY 2024-25 via Notification 15/2025. Watch for the FY 2025-26 notification, typically issued in Q3 2026.",
    },
    {
      q: "Is CA certification required for GSTR-9C?",
      a: "No, not since FY 2020-21. GSTR-9C is self-certified by the authorised signatory. Many businesses still engage a CA for the actual reconciliation work because it's complex, but the certification on the form itself is the taxpayer's signature.",
    },
    {
      q: "What's the late fee for a small business filing late?",
      a: "If your turnover is up to Rs 5 crore, late fee is Rs 50 per day (Rs 25 CGST + Rs 25 SGST), capped at 0.04% of turnover per Act. So a Rs 4 crore turnover business filing 30 days late pays Rs 1,500. The cap protects small businesses from runaway penalties.",
    },
    {
      q: "Can I file GSTR-9 and GSTR-9C in different orders?",
      a: "No. GSTR-9 must be filed first, then GSTR-9C. The 9C draws data from 9 for the reconciliation. The late fee for GSTR-9C accrues separately from the later of (a) GSTR-9 filing date or (b) 31 December due date.",
    },
  ],
  sources: [
    {
      name: "CGST Act, Section 47(2) and Section 35(5)",
      url: "https://cbic-gst.gov.in/CGST-bill-e.html",
      description: "Statutory basis for late fee on annual return non-filing and GSTR-9C reconciliation requirement.",
    },
    {
      name: "CGST Rules, Rule 80",
      url: "https://cbic-gst.gov.in/cgst-rules.html",
      description: "Form, manner, and due date for GSTR-9 and GSTR-9C.",
    },
    {
      name: "CBIC Notification 07/2023 dated 31 March 2023",
      url: "https://taxinformation.cbic.gov.in/",
      description: "Tiered late fee structure for GSTR-9 by turnover slab, applicable from FY 2022-23 onwards.",
    },
    {
      name: "CBIC Notifications 13/2025 and 15/2025-Central Tax",
      url: "https://taxinformation.cbic.gov.in/",
      description: "GSTR-9 / 9C format updates for FY 2024-25 and continued exemption for taxpayers up to Rs 2 crore.",
    },
    {
      name: "GST Portal: Annual Return filing services",
      url: "https://www.gst.gov.in/",
      description: "Filing portal for GSTR-9 and GSTR-9C with auto-populated data and late fee calculator.",
    },
  ],
};
