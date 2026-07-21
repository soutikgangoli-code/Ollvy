// =============================================================================
// GUIDE PAGE: tds-return-q4-fy2026-27
// File path: lib/guides/pages/tds-return-q4-fy2026-27.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const tdsReturnQ4Fy202627: LearnPageConfig = {
  slug: "tds-return-q4-fy2026-27",
  title: "TDS Return Q4 FY 2026-27: Form 16 Generation and Year-End Reconciliation",
  seoTitle: "TDS Return Q4 2026-27 | Due 31 May 2027 | Form 16 Trigger | Ollvy",
  seoDescription: "File Q4 TDS return (Jan-Mar 2027) by 31 May 2027 to trigger Form 16 issuance to employees. Section 234E penalty Rs 200 per day for delays. IT Act 2025 Section 392/393 codes apply. Filed by Ollvy.",
  canonicalUrl: "https://www.ollvy.com/guides/tds-return-q4-fy2026-27",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["tds-monthly-compliance", "business-itr"],
  relatedLearnSlugs: ["tds-on-rent-194i-194ib", "tds-on-property-purchase-194ia", "tds-return-q1-2027"],
  ctaServiceSlug: "tds-monthly-compliance",
  sections: [
    {
      id: "01",
      heading: "WHY Q4 IS DIFFERENT FROM OTHER QUARTERS",
      body:
        "Three things distinguish Q4 from Q1, Q2, and Q3. First, the filing window is 60 days (31 May), not 30 days, to allow year-end reconciliation across all four quarters. Second, this is when Form 16 (the annual salary TDS report) gets generated, since Form 16 covers the full FY and can only be issued once Q4 is processed. Third, the Q4 24Q return includes a final salary computation per employee with all annual deductions and exemptions, which doesn't apply to earlier quarters.",
    },
    {
      id: "02",
      heading: "Q4 IS WHEN FORM 16 GETS GENERATED",
      body:
        "Form 16 is the annual TDS certificate that employers issue to employees, summarising salary paid, TDS deducted, exemptions claimed, and net taxable income for the FY. It is generated after the Q4 24Q return is filed and processed by TRACES (typically 10 to 15 days after upload). Until then, employees waiting to file their ITR have to rely on salary slips and Form 26AS, which is workable but messy.",
      note:
        "The statutory deadline for issuing Form 16 to employees is 15 June (for FY 2026-27, that's 15 June 2027). This means filing Q4 by 31 May leaves 15 days for TRACES processing and Form 16 download, which is usually enough but not generous.",
    },
    {
      id: "03",
      heading: "TDS RECONCILIATION FOR FY 2026-27",
      body:
        "By the time Q4 is being prepared, all four quarters of TDS data are visible. Q4 is the right moment to reconcile the entire year's TDS against the company's trial balance, accounting books, and 26AS data. Common reconciliation flags:",
      bullets: [
        "Total TDS deducted in books vs total TDS deposited via challans (gap usually means a missed deposit).",
        "Total TDS deposited via challans vs total TDS reported in quarterly returns (gap usually means a missed deductee in a return).",
        "Deductee-wise TDS in your records vs TDS visible in their 26AS (gap means TRACES processing delay or a wrong PAN).",
        "Salary TDS computed for each employee vs total Form 16 figure (gap usually means a year-end exemption / deduction adjustment that didn't make it into earlier quarters).",
      ],
    },
    {
      id: "04",
      heading: "WHY 31 MAY (NOT 30 APRIL)",
      body:
        "Other quarters are due 30 days after quarter-end (so Q1 due 31 July, Q2 due 31 October, Q3 due 31 January). Q4 gets an extra month, due 31 May, because the year-end reconciliation requires more time and Form 16 needs to be issued by 15 June with reasonable buffer for TRACES processing.",
    },
    {
      id: "05",
      heading: "MARCH DEPOSIT TIMING (DIFFERENT FROM OTHER MONTHS)",
      body:
        "TDS deducted in any month is normally deposited by the 7th of the next month. The exception is March: TDS deducted in March is deposited by 30 April (not 7 April). This 30-day extension to the deposit deadline gives finance teams time to handle year-end deduction adjustments, but it's also a frequent source of error for new finance teams who default to the 7th rule.",
      note:
        "Section 201(1A) interest at 1.5 percent per month applies on any TDS deposited after the deadline. For a March deduction, deposit between 1 May and 30 April runs zero days late; deposit on 1 May is 1 day late but counts as one month of interest under the 'any part of a month' rule.",
    },
    {
      id: "06",
      heading: "SECTION 392 AND 393 CODES UNDER IT ACT 2025",
      body:
        "FY 2026-27 is fully under the Income Tax Act 2025. Salary TDS uses Section 392 (was Section 192 of the 1961 Act). All non-salary TDS uses Section 393 (was 194C, 194J, 194I, 194IA, 194IB, 194Q, 195, etc.) with sub-clause codes for each payment type. The 24Q return for salary uses Section 392 codes. The 26Q / 27Q returns use Section 393 sub-clause codes.",
    },
    {
      id: "07",
      heading: "PENALTY FOR LATE FILING",
      body:
        "Section 234E late filing fee at Rs 200 per day, capped at total TDS amount (under IT Act 2025, this is Section 427). Section 271H penalty Rs 10,000 to Rs 1,00,000 if the delay extends beyond 1 month from the due date (Budget 2024 reduced the grace period from 1 year to 1 month, effective 1 April 2025; under IT Act 2025, this is Section 461) or for incorrect returns. Section 201(1A) interest at 1.5 percent per month for late deposit (separate from return filing penalty).",
    },
    {
      id: "08",
      heading: "COMMON ERRORS",
      body:
        "Most Q4 errors are around year-end reconciliation.",
      bullets: [
        "Form 24Q salary computation doesn't match Form 16 figures employees expect (year-end deductions, exemptions, or LTA bills missed).",
        "Total Q1 + Q2 + Q3 + Q4 TDS doesn't reconcile to books trial balance (missed challan, double-counted challan).",
        "March TDS deposited after 30 April triggers Section 201(1A) interest, often missed in Q4 challan list.",
        "Form 16 PartA (TRACES auto-generated) and PartB (employer-prepared) inconsistency. PartB has to match PartA exactly.",
        "Deductees with PAN-Aadhaar de-link issues end up showing as 'inoperative PAN' on TRACES, creating Form 16A issuance friction.",
      ],
    },
  ],
  faqs: [
    {
      q: "We deducted TDS on 31 March payments but didn't deposit until 8 April. What's the consequence?",
      a: "March deduction is allowed to be deposited until 30 April (not 7 April). So 8 April is well within the window. No interest, no penalty.",
    },
    {
      q: "Q4 return shows different total than my books. How to fix?",
      a: "Reconcile challan-by-challan. Identify which deductee or which deposit is missing or double-counted. The most common cause is a March deposit reflected in the books but not yet in the TDS return template. Once identified, file the correct Q4 return with adjusted deductee rows and matching challan totals.",
    },
    {
      q: "Form 16 deadline for issuing to employees?",
      a: "15 June for the previous FY (so 15 June 2027 for FY 2026-27). The deadline is on the employer; if Form 16 isn't issued by that date, the employer is in default. Q4 filing by 31 May leaves a 15-day window for TRACES processing.",
    },
    {
      q: "Employee left mid-year. Do I still issue Form 16?",
      a: "Yes. Form 16 is issued for the period the employee was on payroll, covering all salary paid by you to them during FY 2026-27. The employee will combine your Form 16 with their next employer's Form 16 (if they joined another company) when filing their ITR.",
    },
    {
      q: "Can a NIL Q4 return be filed if there's no TDS?",
      a: "Yes, NIL Q4 returns are accepted. Same logic as other quarters: if the TAN is active, file NIL returns for any quarter with no deductions to keep the TAN compliant.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025, Section 392 and 393",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Consolidated TDS provisions: Section 392 for salary (was 192), Section 393 for non-salary (was 194 series, 195, 206C).",
    },
    {
      name: "Income Tax Act 1961, Sections 234E, 271H, 201(1A) (mapped to IT Act 2025 Sections 427, 461, and 421 respectively)",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Late filing fee, penalty, and interest provisions. Budget 2024 reduced the Section 271H grace period from 1 year to 1 month, effective 1 April 2025. Under IT Act 2025, the corresponding sections are 427 (was 234E), 461 (was 271H), and 421 (was 201(1A)) with substantively unchanged structure.",
    },
    {
      name: "TRACES Portal",
      url: "https://www.tdscpc.gov.in/",
      description: "Official portal for TDS return filing, correction, Form 16 / 16A generation.",
    },
  ],
};
