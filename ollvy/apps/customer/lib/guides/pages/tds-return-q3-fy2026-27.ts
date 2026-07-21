// =============================================================================
// GUIDE PAGE: tds-return-q3-fy2026-27
// File path: lib/guides/pages/tds-return-q3-fy2026-27.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const tdsReturnQ3Fy202627: LearnPageConfig = {
  slug: "tds-return-q3-fy2026-27",
  title: "TDS Return Q3 FY 2026-27: Forms 24Q, 26Q, 27Q under IT Act 2025",
  seoTitle: "TDS Return Q3 2026-27 | Due 31 January 2027 | Section 393 | Ollvy",
  seoDescription: "File Q3 TDS return (Oct-Dec 2026) by 31 January 2027 under IT Act 2025 Section 393. Forms 24Q, 26Q, 27Q, 27EQ. Section 234E penalty Rs 200 per day for delays. Filed by Ollvy CAs.",
  canonicalUrl: "https://www.ollvy.com/guides/tds-return-q3-fy2026-27",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["tds-monthly-compliance", "business-itr"],
  relatedLearnSlugs: ["tds-on-rent-194i-194ib", "tds-on-property-purchase-194ia", "tds-return-q4-fy2026-27"],
  ctaServiceSlug: "tds-monthly-compliance",
  sections: [
    {
      id: "01",
      heading: "WHAT A QUARTERLY TDS RETURN IS",
      body:
        "Every entity that has a TAN and deducts TDS during a quarter must file a return summarising what was deducted, from whom, under which section, and what was deposited to the government. The return is the bridge between the deductor's payment activity and the deductee's tax credit.",
      table: {
        headers: ["Form", "What It Covers", "Who Files"],
        rows: [
          ["24Q", "Salary TDS under Section 392 (was 192)", "Every employer who paid taxable salaries"],
          ["26Q", "Non-salary TDS to residents (vendor payments, professional fees, rent, contracts)", "Every TAN holder making such payments"],
          ["27Q", "TDS on payments to non-residents (royalty, fees for technical services, NRI property, etc.)", "Every TAN holder making such payments"],
          ["27EQ", "TCS (tax collected at source on car sales, scrap, foreign remittances under LRS, etc.)", "Every TCS collector"],
        ],
      },
    },
    {
      id: "02",
      heading: "WHO FILES Q3 RETURN",
      body:
        "Every TAN holder who deducted TDS or collected TCS during the Oct-Dec 2026 quarter. The obligation triggers on the first transaction in the quarter, even if it's just one. Common Q3 deduction triggers:",
      bullets: [
        "Salary payments to employees (Form 24Q).",
        "Vendor payments above the relevant Section 393 thresholds (formerly 194C contractors, 194J professionals, 194I rent, etc.).",
        "Rent payments if monthly rent exceeds Rs 50,000 (Section 194-I, now Section 393 sub-clause).",
        "Property purchase consideration above Rs 50 lakh (Section 194-IA).",
        "Payments to non-residents under Section 195 (now Section 393 sub-clause for non-resident payments).",
      ],
    },
    {
      id: "03",
      heading: "THE QUARTERLY CALENDAR",
      body:
        "TDS returns are due 30 days after each quarter ends, except Q4 which gets an extra month for year-end reconciliation.",
      table: {
        headers: ["Quarter", "Period Covered", "Due Date"],
        rows: [
          ["Q1", "April - June 2026", "31 July 2026"],
          ["Q2", "July - September 2026", "31 October 2026"],
          ["Q3", "October - December 2026", "31 January 2027"],
          ["Q4", "January - March 2027", "31 May 2027"],
        ],
      },
      note:
        "Q4 has a 60-day window (instead of 30) because Form 16 (annual salary TDS report) gets generated from the Q4 24Q filing, which requires year-end reconciliation.",
    },
    {
      id: "04",
      heading: "SECTION 393 SECTION CODES UNDER IT ACT 2025",
      body:
        "From 1 April 2026, all non-salary TDS is consolidated under a single Section 393 of the Income Tax Act 2025, organised as a table with serial-numbered entries for each payment type. The old 194-series sections (194C contractors, 194J professionals, 194I rent, 194IA property, 194IB individual rent, 194Q purchase of goods, etc.) are merged into Section 393 sub-clauses. Salary TDS continues separately under Section 392 (was 192).",
      bullets: [
        "Section 392 (was 192): TDS on salary.",
        "Section 393 (was 194C, J, I, IA, IB, Q, etc.): All non-salary TDS consolidated.",
        "Section 393 also incorporates non-resident payments (was Section 195) at a designated sub-clause.",
        "TCS provisions (was 206C) also restructured under the IT Act 2025.",
      ],
      note:
        "When filing TDS returns and challans for Q3 FY 2026-27, the Section 393 sub-clause codes must be quoted, not the old 194-series codes. Most ERP and payroll systems should have been updated by April 2026; if yours hasn't, this is a P0 fix before filing.",
    },
    {
      id: "05",
      heading: "WHAT GOES INTO THE RETURN",
      body:
        "The TDS return ties every deductee to a specific challan and a specific Section 393 code. The data captured is granular and any mismatch triggers a defect notice from TRACES.",
      bullets: [
        "Challan-level data: BSR code, challan serial number, date, amount deposited, AY.",
        "Deductee-level data: Name, PAN (mandatory), address, type of deductee (resident / non-resident), payment date, payment amount, TDS amount, Section 393 sub-clause.",
        "Aggregate totals: Total TDS deducted, total challans, total deductees.",
        "Adjustments and credits (carry-forward of excess TDS from previous quarters, refund claims).",
      ],
    },
    {
      id: "06",
      heading: "PENALTY FOR LATE FILING",
      body:
        "Two layers of penalty apply.",
      table: {
        headers: ["Trigger", "Provision", "Amount"],
        rows: [
          ["Late filing", "Section 234E (1961 Act) / Section 427 (IT Act 2025)", "Rs 200 per day, capped at TDS amount in return"],
          ["Delay beyond 1 month from due date, or incorrect / incomplete return", "Section 271H (1961 Act) / Section 461 (IT Act 2025)", "Rs 10,000 to Rs 1,00,000"],
          ["Failure to deduct or pay TDS", "Section 201", "Interest at 1% per month (deduction) / 1.5% per month (deposit)"],
          ["TDS deposited late but before due date", "Section 201(1A)", "Interest at 1.5% per month from deduction date to deposit date"],
        ],
      },
      note:
        "Section 234E fee gets paid as a separate challan and the receipt has to be quoted in the return. The return cannot be uploaded if the 234E fee is unpaid. The Section 271H 1-month grace was reduced from 1 year by Budget 2024, effective 1 April 2025. Under the IT Act 2025, the corresponding sections are 427 and 461 respectively, with the same substantive structure.",
    },
    {
      id: "07",
      heading: "FORM 16 / 16A GENERATION FROM Q3 RETURN",
      body:
        "Once the Q3 return is filed and processed by TRACES (typically 7 to 10 days after upload), the deductees can download Form 16A from the TRACES portal showing their TDS credits. Form 16 (the annual salary TDS report for employees) gets generated only after the Q4 return is filed in May 2027, since it covers the full year.",
    },
    {
      id: "08",
      heading: "COMMON ERRORS",
      body:
        "Most TDS return rejections come from a small number of recurring issues.",
      bullets: [
        "Wrong Section 393 sub-clause: Using old 194-series codes when Section 393 codes apply, or using the wrong Section 393 sub-clause for the payment type.",
        "Missing PAN of deductee: Triggers Section 206AA (or its IT Act 2025 successor), where TDS must be deducted at 20 percent or the rate in the section, whichever is higher.",
        "Challan-deductee mismatch: Total deductee TDS amount doesn't match challan amount. TRACES rejects the return.",
        "Late challan deposit: TDS deducted in October but deposited only in December attracts Section 201(1A) interest at 1.5 percent per month.",
        "Wrong assessment year: Q3 of FY 2026-27 belongs to AY 2027-28, but the challan was filed under AY 2026-27.",
      ],
    },
  ],
  faqs: [
    {
      q: "We forgot to deduct TDS on a payment in November. Can we do it now?",
      a: "Yes, deduct now from any future payment to the same deductee, deposit immediately with applicable Section 201(1A) interest at 1.5 percent per month from the original deduction date, and report it in the Q3 return. If no future payment is expected, the deductor pays the TDS from their own funds and recovers from the deductee separately.",
    },
    {
      q: "The deductee says their PAN is wrong on our return. How do we correct?",
      a: "File a TDS correction return on the TRACES portal. The correction return is identified by the original return's RRR (Return Request Receipt) number and updates only the affected deductee row. PAN corrections are non-financial and don't change the challan or total TDS.",
    },
    {
      q: "Do we need to file a NIL return if no TDS was deducted?",
      a: "Not legally required, but strongly recommended. If you have an active TAN and miss filing a quarterly return, the income tax system flags your TAN for non-compliance. A NIL return takes 5 minutes on the TRACES portal and keeps your TAN clean.",
    },
    {
      q: "TDS was deducted but not deposited by the 7th. What's the penalty?",
      a: "Section 201(1A)(ii) interest at 1.5 percent per month from the date of deduction to the date of deposit. So if you deducted on 15 October and deposited on 10 November, that's 0.5 month + 0.5 month = 1 month of interest. The deposit deadline is the 7th of the next month, except for March which is 30 April.",
    },
    {
      q: "Can we revise a TDS return after filing?",
      a: "Yes, file a correction return on TRACES. There's no time limit, but corrections should be filed promptly because the deductee's TDS credit reflects what's in your latest filed return. Corrections come in different categories (PAN correction, challan correction, deductee correction, etc.).",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025, Section 393",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Consolidated non-salary TDS provision (replaces Sections 194C, 194J, 194I, 194IA, 194IB, 194Q, 195, etc. of the 1961 Act).",
    },
    {
      name: "Income Tax Act 1961, Sections 234E and 271H (mapped to Sections 427 and 461 of IT Act 2025)",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Late filing fee and penalty provisions for TDS returns. Budget 2024 reduced the Section 271H grace period from 1 year to 1 month, effective 1 April 2025. Under the IT Act 2025, the corresponding sections are 427 (was 234E) and 461 (was 271H) with the same substantive structure.",
    },
    {
      name: "TRACES Portal",
      url: "https://www.tdscpc.gov.in/",
      description: "Official portal for TDS return filing, correction, and Form 16/16A download.",
    },
    {
      name: "Income Tax Department TDS FAQ",
      url: "https://www.incometax.gov.in/iec/foportal/help/all-topics/tds",
      description: "Official FAQ on TDS deduction, deposit, and quarterly return filing.",
    },
  ],
};
