// =============================================================================
// GUIDE PAGE: gst-annual-2026
// File path: lib/guides/pages/gst-annual-2026.ts
// Authored fresh covering GSTR-9 and GSTR-9C annual GST filing for FY 2024-25
// (due 31 December 2025, now in post-deadline territory) and forward-looking
// guidance for FY 2025-26 (due 31 December 2026).
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const gstAnnual2026: LearnPageConfig = {
  slug: "gst-annual-2026",
  title: "GST Annual Return Filing: GSTR-9 and GSTR-9C for Indian Businesses",
  seoTitle: "GST Annual Return 2026 | GSTR-9 GSTR-9C Due 31 December | Ollvy",
  seoDescription:
    "Complete guide to GST annual return filing in India. Who files GSTR-9 and GSTR-9C, the FY 2024-25 deadline that was 31 December 2025, FY 2025-26 deadline of 31 December 2026, tiered late fee structure, and self-certification rules.",
  canonicalUrl: "https://www.ollvy.com/guides/gst-annual-2026",
  lastReviewed: "May 2026",
  category: "GST",
  relatedServiceSlugs: ["gst-annual-return", "gst-registration", "gst-return-filing"],
  relatedLearnSlugs: ["lut-for-exports", "iec-import-export-code"],
  ctaServiceSlug: "gst-monthly",
  sections: [
    {
      id: "01",
      heading: "WHAT GSTR-9 AND GSTR-9C ARE",
      body:
        "GSTR-9 is the annual GST return that consolidates everything you reported through GSTR-1 (outward supplies) and GSTR-3B (tax payment) over the financial year, plus reconciliations against your books. GSTR-9C is the annual reconciliation statement that bridges your GSTR-9 with your audited financial statements. The two are related but separate: GSTR-9 is mandatory above a turnover threshold; GSTR-9C is required only above a higher threshold and applies on top of GSTR-9. From FY 2020-21 onwards, GSTR-9C is self-certified by the taxpayer; the earlier mandatory CA / CMA certification has been removed.",
    },
    {
      id: "02",
      heading: "WHO HAS TO FILE",
      body:
        "Eligibility is based on aggregate turnover at the PAN level for the financial year.",
      table: {
        headers: ["Aggregate Turnover", "GSTR-9", "GSTR-9C"],
        rows: [
          ["Up to Rs 2 crore", "Optional (waived since FY 2017-18)", "Not required"],
          ["Rs 2 crore to Rs 5 crore", "Mandatory", "Not required"],
          ["Above Rs 5 crore", "Mandatory", "Mandatory"],
        ],
      },
      note:
        "The Rs 2 crore exemption is reaffirmed for FY 2024-25 via CBIC Notification 15/2025-Central Tax. Composition scheme dealers file GSTR-4 (not GSTR-9). Casual taxpayers, ISDs, non-residents, and tax deductors under Section 51 are excluded from GSTR-9.",
    },
    {
      id: "03",
      heading: "DEADLINES",
      body:
        "GSTR-9 and GSTR-9C are both due 31 December following the close of the financial year.",
      table: {
        headers: ["Financial Year", "GSTR-9 / GSTR-9C Due Date", "Status"],
        rows: [
          ["FY 2024-25", "31 December 2025", "Past (file with late fee)"],
          ["FY 2025-26", "31 December 2026", "Upcoming"],
          ["FY 2026-27", "31 December 2027", "Future"],
        ],
      },
      note:
        "Late filing is allowed but attracts a per-day fee under Section 47(2) of the CGST Act. The portal will not allow you to file without paying the calculated late fee first.",
    },
    {
      id: "04",
      heading: "TIERED LATE FEE STRUCTURE",
      body:
        "From FY 2022-23 onwards, GSTR-9 late fees were rationalised by turnover slab via CBIC Notification 07/2023, and apply on a CGST + SGST basis (no late fee under IGST).",
      table: {
        headers: ["Aggregate Turnover", "Late Fee per Day (CGST + SGST)", "Maximum Cap"],
        rows: [
          ["Up to Rs 5 crore", "Rs 50 (Rs 25 + Rs 25)", "0.04% of turnover per Act"],
          ["Rs 5 crore to Rs 20 crore", "Rs 100 (Rs 50 + Rs 50)", "0.04% of turnover per Act"],
          ["Above Rs 20 crore", "Rs 200 (Rs 100 + Rs 100)", "0.50% of turnover per Act"],
        ],
      },
      note:
        "The late fee for GSTR-9C accrues separately from the later of GSTR-9 filing date or the original due date, until GSTR-9C is filed. So if you file GSTR-9 on 5 January and GSTR-9C on 7 January, you pay 5 days of GSTR-9 late fee plus 2 days of GSTR-9C late fee.",
    },
    {
      id: "05",
      heading: "WHAT GSTR-9 ACTUALLY ASKS FOR",
      body:
        "The form has 6 parts and 19 sections. Most data auto-populates from your already-filed GSTR-1 and GSTR-3B. Your job is to reconcile the auto-population against your books and report any unreconciled differences.",
      bullets: [
        "Part I (Tables 1-3): Basic info, financial year, GSTIN, legal name.",
        "Part II (Tables 4-5): Outward supplies. Taxable, zero-rated, exempt/nil, plus credit and debit notes for the year.",
        "Part III (Tables 6-8): Input Tax Credit. ITC availed, reversed (under Rules 37 / 37A), reclaimed, and reconciled against GSTR-2B.",
        "Part IV (Table 9): Tax paid in cash / through ITC, broken by tax head (CGST, SGST, IGST, cess).",
        "Part V (Tables 10-13): Cross-year transactions. Adjustments for the previous FY made in current FY's GSTR-3B (Table 10/11) and reverse direction (Table 12/13).",
        "Part VI (Tables 15-19): Demands and refunds, HSN-wise summary, segregated supplies.",
      ],
    },
    {
      id: "06",
      heading: "WHAT GSTR-9C ADDS",
      body:
        "GSTR-9C is the reconciliation between your books (audited financial statements) and what you reported in GSTR-9. It surfaces the gaps between accrual-based audited turnover and tax-reported turnover, and between book-level ITC and GSTR-9 reported ITC. Common reconciling items include: revenue recognised in books but not yet reported (or vice versa), supplies treated differently for income tax vs GST, ITC reversed in books but not in GST returns, and cross-year credit notes.",
      bullets: [
        "Part I (Tables 1-4): Basic GSTIN, legal name, turnover bridge.",
        "Part II (Table 5): Reconciliation of turnover declared vs audited.",
        "Part III (Tables 9-11): Reconciliation of tax paid.",
        "Part IV (Tables 12-16): Reconciliation of ITC. New tables (6A1, 8H1) added by Notification 13/2025 for granular tracking under Rules 37 and 37A.",
        "Part V (Table 17, new for FY 2024-25): Auto-calculated late fee table.",
      ],
    },
    {
      id: "07",
      heading: "DOCUMENTS YOU WILL NEED",
      body:
        "Build a centralised folder before you start. Most rejection-and-rework cycles come from missing or unreconciled data.",
      bullets: [
        "GSTR-1 summaries for all 12 months of FY 2025-26 (or relevant FY) plus any GSTR-1A amendments.",
        "GSTR-3B summaries for all 12 months.",
        "GSTR-2B reports monthly (for ITC matching, including post-October 2026 uploads for cross-year claims).",
        "Books of account: trial balance, P&L, ledgers (rate-wise and GSTIN-wise).",
        "Sales register: taxable, exempt, nil-rated, exports, SEZ, e-commerce supplies under Section 9(5).",
        "Purchase register: inputs, input services, capital goods, RCM supplies, imports, unregistered purchases.",
        "Credit notes and debit notes register, including timing of cross-year notes.",
        "If filing GSTR-9C: audited financial statements, Form 3CD if tax audit done, expense reconciliation for non-GST items (salary, depreciation, taxes).",
      ],
    },
    {
      id: "08",
      heading: "PENALTY FOR NON-FILING",
      body:
        "Missing the deadline triggers the per-day late fee until you file. The portal will not let you file without paying the accrued late fee. Beyond the late fee, persistent non-filing can lead to:",
      bullets: [
        "GST registration cancellation under Section 29(2)(c) for not filing returns for a continuous period.",
        "Best judgment assessment by the proper officer under Section 62, where the department estimates your liability and demands payment.",
        "Blocked input tax credit for buyers on supplies you made if you don't file, since they cannot reconcile against your unfiled return.",
        "Section 125 general penalty up to Rs 25,000 per Act for repeated default (CGST + SGST = up to Rs 50,000).",
      ],
    },
    {
      id: "09",
      heading: "COMMON MISTAKES",
      body:
        "Most rework cycles come from a small set of repeated errors.",
      bullets: [
        "Filing GSTR-9 before completing all GSTR-3B for the year. The portal allows it but auto-population breaks.",
        "Misclassifying nil-rated as exempt (or vice versa) in Part II.",
        "Missing cross-year credit notes in Tables 10-13. A March credit note adjusted in April's GSTR-3B has to be reported here.",
        "ITC reversal under Rule 37A (supplier non-filing) reported in the wrong table. It belongs in Table 7, not Table 6A.",
        "GSTR-9C turnover reconciliation not capturing non-GST items (salary, employer's PF contribution, depreciation). These reduce GST turnover but not book turnover.",
        "Filing GSTR-9 then forgetting GSTR-9C. They are separate filings and the late fee clock keeps ticking on GSTR-9C even after GSTR-9 is filed.",
      ],
    },
  ],
  faqs: [
    {
      q: "What was the deadline for FY 2024-25 GSTR-9 / 9C?",
      a: "31 December 2025. If you missed it, file with the tiered late fee. The portal calculates the fee automatically based on your turnover slab and the days of delay, and won't let you submit without paying.",
    },
    {
      q: "What is the deadline for FY 2025-26?",
      a: "31 December 2026 for both GSTR-9 and GSTR-9C. Plan to start the reconciliation work in October 2026, especially if you're a Rs 5 crore-plus turnover business filing GSTR-9C, since the books-vs-returns reconciliation takes time.",
    },
    {
      q: "Do I have to file GSTR-9 if my turnover is under Rs 2 crore?",
      a: "No. The Rs 2 crore exemption from GSTR-9 has been continued for FY 2024-25 via Notification 15/2025-Central Tax. You can still file voluntarily. For FY 2025-26 onwards, watch for the corresponding notification each year.",
    },
    {
      q: "Is CA certification required for GSTR-9C?",
      a: "No, not since FY 2020-21. GSTR-9C is self-certified by the authorised signatory of the taxpayer. Many businesses still engage a CA for the actual reconciliation work because it's complex, but the certification on the form itself is the taxpayer's signature.",
    },
    {
      q: "Can I file GSTR-9 after GSTR-9C?",
      a: "No, filing order matters. GSTR-9 must be filed first, then GSTR-9C. The GSTR-9C draws data from GSTR-9 for the reconciliation. The late fee for GSTR-9C accrues separately from the later of (a) actual GSTR-9 filing date or (b) the original 31 December due date, until GSTR-9C is filed.",
    },
  ],
  sources: [
    {
      name: "CBIC Notification 15/2025-Central Tax (17 September 2025)",
      url: "https://taxinformation.cbic.gov.in/",
      description: "Continued exemption from GSTR-9 filing for taxpayers with aggregate turnover up to Rs 2 crore for FY 2024-25.",
    },
    {
      name: "CBIC Notification 13/2025 and 16/2025-Central Tax",
      url: "https://taxinformation.cbic.gov.in/",
      description: "Updated GSTR-9 and GSTR-9C formats for FY 2024-25 introducing IMS-based ITC auto-population and new ITC reporting tables.",
    },
    {
      name: "CGST Act, Section 47 (late fee for return non-filing)",
      url: "https://cbic-gst.gov.in/CGST-bill-e.html",
      description: "Statutory basis for the per-day late fee on GSTR-9 / GSTR-9C delays.",
    },
    {
      name: "CBIC Notification 07/2023 dated 31 March 2023",
      url: "https://taxinformation.cbic.gov.in/",
      description: "Tiered late fee structure for GSTR-9 by turnover slab, applicable from FY 2022-23 onwards.",
    },
    {
      name: "GST Portal: Annual Return filing services",
      url: "https://www.gst.gov.in/",
      description: "Filing portal for GSTR-9 and GSTR-9C with auto-populated data and late fee calculator.",
    },
  ],
};
