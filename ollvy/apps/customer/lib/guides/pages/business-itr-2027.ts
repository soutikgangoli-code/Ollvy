// =============================================================================
// GUIDE PAGE: business-itr-2027
// File path: lib/guides/pages/business-itr-2027.ts
// Non-audit business ITR for Tax Year 2026-27, due 31 August 2027 under the
// Budget 2026-27 staggered deadline structure. First business ITR season fully
// under the Income Tax Act 2025.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const businessItr2027: LearnPageConfig = {
  slug: "business-itr-2027",
  title: "Business ITR for Tax Year 2026-27: New Deadline 31 August 2027",
  seoTitle: "Business ITR 2027 | New Deadline 31 August | TY 2026-27 | Ollvy",
  seoDescription:
    "Non-audit business ITR for tax year 2026-27 is now due 31 August 2027, not 31 July. Audit cases 31 October. Late fee Rs 5,000 plus 1% monthly interest.",
  canonicalUrl: "https://www.ollvy.com/guides/business-itr-2027",
  lastReviewed: "July 2026",
  category: "Income Tax Filing",
  relatedServiceSlugs: ["business-itr", "gst-monthly", "tds-monthly-compliance"],
  relatedLearnSlugs: [
    "itr-2027",
    "business-itr-2026",
    "salaried-itr-2027",
    "income-tax-act-2025-section-mapping",
    "advance-tax-q1-2027",
  ],
  relatedTools: {
    penaltyCalculators: ["itr-late-filing"],
    documentChecklists: ["business-itr"],
  },
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "THE DEADLINE MOVED: NON-AUDIT BUSINESS ITR IS DUE 31 AUGUST 2027",
      body:
        "The non-audit business ITR for tax year 2026-27 is due 31 August 2027, not 31 July. Budget 2026-27 introduced staggered ITR deadlines: salaried and other non-business filers keep 31 July 2027, while proprietors, freelancers, professionals, firms, and LLPs without a tax audit move to 31 August 2027. Audit cases stay at 31 October 2027. This is a genuine change from every prior year, when non-audit business filers shared the 31 July date, and much of the internet will keep repeating 31 July out of habit. If you run a non-audit business, you have one extra month, and no extension request is needed to use it.",
    },
    {
      id: "02",
      heading: "WHO COUNTS AS A NON-AUDIT BUSINESS FILER",
      body:
        "The 31 August 2027 date applies to anyone filing business or professional income without a mandatory tax audit.",
      bullets: [
        "Sole proprietors and freelancers filing ITR-3 or ITR-4.",
        "Professionals (doctors, lawyers, designers, consultants) below the audit threshold.",
        "Partnership firms and LLPs below the audit threshold, filing ITR-5.",
        "Presumptive filers under the 2025 Act successors to Section 44AD and 44ADA (Sections 60 and 61).",
        "Salaried people with a side business or meaningful freelance income: the business income puts them on ITR-3 / ITR-4, and the 31 August date follows the return type.",
      ],
      note:
        "The tax audit threshold carries forward: Rs 1 crore turnover for business (Rs 10 crore where 95% of receipts and payments are digital) and Rs 50 lakh gross receipts for professions, now housed in Section 63 of the 2025 Act (formerly Section 44AB).",
    },
    {
      id: "03",
      heading: "THE FULL DEADLINE TABLE FOR TAX YEAR 2026-27",
      body:
        "Four separate business-relevant dates now exist. Diarise the one that applies to your entity.",
      table: {
        headers: ["Filer", "Form", "Due Date"],
        rows: [
          ["Salaried / no business income", "ITR-1 / ITR-2", "31 July 2027"],
          ["Business / professional, non-audit", "ITR-3 / ITR-4 / ITR-5", "31 August 2027"],
          ["Business with tax audit", "ITR-3 / ITR-5 / ITR-6", "31 October 2027 (audit report by 30 September 2027)"],
          ["Transfer pricing cases", "Any business form", "30 November 2027"],
          ["Belated return", "Any form", "31 December 2027"],
          ["Revised return", "Any form", "31 March 2028"],
        ],
      },
    },
    {
      id: "04",
      heading: "FIRST BUSINESS RETURN UNDER THE INCOME TAX ACT 2025",
      body:
        "The Income Tax Act 2025 took effect on 1 April 2026, so tax year 2026-27 is the first business year fully governed by it. The return you file in 2027 uses the new Act's section numbers throughout: filing sits in Section 263 (was 139), the late fee in Section 426 (was 234F), interest in Sections 423 to 425 (was 234A/234B/234C), presumptive schemes in Sections 60 and 61 (was 44AD/44ADA), and the audit requirement in Section 63 (was 44AB). Rates and thresholds carry forward; the labels changed. Anything for FY 2025-26 or earlier, including a belated 2026 return, stays under the 1961 Act with the old numbers.",
      note:
        "The 2025 Act also replaces Previous Year / Assessment Year with a single Tax Year label. On the portal, select Tax Year 2026-27 rather than hunting for AY 2027-28.",
    },
    {
      id: "05",
      heading: "PRESUMPTIVE TAXATION UNDER THE NEW ACT",
      body:
        "The presumptive schemes carry forward with new section numbers and unchanged mechanics. Small businesses under Section 60 (formerly 44AD) declare 8% of turnover as profit (6% for digital receipts) with turnover up to Rs 2 crore, extended to Rs 3 crore where at least 95% of receipts are digital. Professionals under Section 61 (formerly 44ADA) declare 50% of gross receipts with a Rs 50 lakh ceiling, extended to Rs 75 lakh on the same 95% digital condition. Presumptive filers use ITR-4, skip books of account, and pay advance tax in a single instalment by 15 March instead of the quarterly schedule.",
      note:
        "Opting out of Section 60 after using it triggers the five-year lock-out from re-entering the scheme, and can pull in audit requirements. Model the numbers before switching to regular books in a good year.",
    },
    {
      id: "06",
      heading: "WHAT MISSING 31 AUGUST 2027 COSTS",
      body:
        "The penalty structure mirrors the old Act with renumbered provisions.",
      table: {
        headers: ["Trigger", "Provision (IT Act 2025)", "Amount"],
        rows: [
          ["Late filing fee, income above Rs 5 lakh", "Section 426 (was 234F)", "Rs 5,000"],
          ["Late filing fee, income up to Rs 5 lakh", "Section 426 (was 234F)", "Rs 1,000"],
          ["Interest on unpaid tax from 1 September 2027", "Section 423 (was 234A)", "1% per month or part"],
          ["Advance tax shortfall interest", "Sections 424 / 425 (was 234B / 234C)", "1% per month"],
          ["Business loss carry-forward", "Section 159 (was 80)", "Forfeited if return is late"],
        ],
      },
      note:
        "Loss forfeiture is the expensive one for businesses. A Rs 20 lakh loss in tax year 2026-27 that could offset future profits is permanently gone if the return goes in after the deadline. Unabsorbed depreciation survives late filing; business losses do not.",
    },
    {
      id: "07",
      heading: "RECONCILE GST, TDS, AND AIS BEFORE FILING",
      body:
        "Business returns for tax year 2026-27 are cross-checked against more third-party data than ever. Mismatches trigger Section 270(1) intimations (the new 143(1)) or worse.",
      bullets: [
        "GST turnover: the turnover in GSTR-1 / GSTR-3B for FY 2026-27 should reconcile with the turnover in your ITR. Document genuine differences (unregistered branches, exempt supplies, timing).",
        "TDS credits: match every credit in Form 168 (renumbered 26AS) and AIS against your books. Client-side TDS under the contractor and professional-fee provisions is the usual gap.",
        "Bank credits: AIS aggregates deposits across accounts. Large unexplained credits versus declared turnover are a reopening trigger.",
        "Your own TDS compliance: expenses where you were required to deduct TDS but did not attract a 30% disallowance of the expense.",
      ],
    },
    {
      id: "08",
      heading: "AUDIT CASES: THE 31 AUGUST DATE IS NOT YOURS",
      body:
        "If your turnover crossed the Section 63 threshold, or you declared profits below the presumptive rate while over the basic exemption, the audit track applies: audit report by 30 September 2027, return by 31 October 2027. Companies file ITR-6 by 31 October regardless of size. Do not read the extra non-audit month as breathing room for the audit pipeline; the audit report date has not moved, and auditors are busiest in September.",
    },
    {
      id: "09",
      heading: "WHAT TO DO BETWEEN NOW AND AUGUST 2027",
      body:
        "The extra month is only useful if the books are ready. A realistic sequence for a non-audit business:",
      bullets: [
        "Close FY 2026-27 books by May 2027: bank reconciliations, debtor and creditor confirmations, closing stock.",
        "Reconcile GST annual turnover against books in June 2027.",
        "Pull Form 168 and AIS in June 2027, chase missing TDS credits with clients early.",
        "Compute and pay any self-assessment tax before filing to stop Section 423 interest.",
        "File in July or early August 2027. The last-week portal crush now happens twice, at end-July and end-August.",
      ],
    },
  ],
  faqs: [
    {
      q: "Is the 31 August 2027 deadline confirmed, or an extension?",
      a: "Confirmed and structural. Budget 2026-27 introduced staggered deadlines as a permanent feature: 31 July for salaried filers, 31 August for non-audit business filers. It is not a one-off extension. Separately, one-off extensions on top of these dates do happen in transition years; if CBDT notifies a change for tax year 2026-27, this page will be updated.",
    },
    {
      q: "I have salary plus freelance income. Which deadline applies?",
      a: "The deadline follows the return type. Freelance income makes it a business return (ITR-3, or ITR-4 if presumptive), so 31 August 2027 applies. If the freelance income is trivial and you report it as other sources on ITR-1 or ITR-2, you are on 31 July 2027, but that treatment only fits genuinely incidental income.",
    },
    {
      q: "Does my LLP get the 31 August date?",
      a: "Only if it is below the audit thresholds. A non-audit LLP files ITR-5 by 31 August 2027. Once turnover crosses Rs 1 crore (Rs 10 crore with 95% digital receipts) or the LLP otherwise needs a tax audit, the dates become 30 September 2027 for the audit report and 31 October 2027 for the return. Note the LLP Act statutory audit (Rs 40 lakh turnover / Rs 25 lakh contribution) is a separate test from tax audit.",
    },
    {
      q: "Do the presumptive thresholds change under the 2025 Act?",
      a: "No. Section 60 (formerly 44AD) keeps the Rs 2 crore limit, extended to Rs 3 crore with 95% digital receipts, at 8% deemed profit (6% digital). Section 61 (formerly 44ADA) keeps Rs 50 lakh, extended to Rs 75 lakh on the same condition, at 50% deemed profit. Only the section numbers changed.",
    },
    {
      q: "What if I miss 31 August 2027?",
      a: "Belated filing is open until 31 December 2027 with the Section 426 fee (Rs 5,000, or Rs 1,000 if income is up to Rs 5 lakh) plus 1% monthly interest on unpaid tax, and business loss carry-forward is forfeited. After 31 December 2027, only the updated-return route with additional tax remains.",
    },
    {
      q: "My CA says the deadline is 31 July. Who is right?",
      a: "For tax year 2026-27 (filed in 2027), non-audit business returns are due 31 August 2027 under the Budget 2026-27 staggering. The confusion is understandable: 31 July was the business date for decades, and the FY 2025-26 return filed in 2026 followed the old structure. Check the return type and the tax year before applying the old date.",
    },
    {
      q: "Does advance tax change because the filing deadline moved?",
      a: "No. Advance tax instalments for FY 2027-28 stay at 15 June, 15 September, 15 December, and 15 March, and interest under Sections 424 and 425 for FY 2026-27 shortfalls is computed the same way regardless of when you file. The extra filing month does not defer any payment obligation.",
    },
  ],
  sources: [
    {
      name: "Union Budget 2026-27",
      url: "https://www.indiabudget.gov.in/",
      description: "Staggered ITR deadline structure: 31 July salaried, 31 August non-audit business, 31 October audit cases.",
    },
    {
      name: "Income Tax Act 2025",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Section 263 (filing), Section 426 (late fee), Sections 60/61 (presumptive), Section 63 (audit), Section 159 (loss carry-forward).",
    },
    {
      name: "Income Tax e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Tax Year 2026-27 filing, Form 168 and AIS downloads, section mapping utility.",
    },
  ],
};
