// =============================================================================
// GUIDE PAGE: business-itr-2026
// File path: lib/guides/pages/business-itr-2026.ts
// Authored as a guide page (LearnPageConfig) covering ITR-3 / ITR-4 non-audit
// filers under Budget 2026 staggered deadlines.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const businessItr2026: LearnPageConfig = {
  slug: "business-itr-2026",
  title: "Business ITR Filing for FY 2025-26: ITR-3 and ITR-4 Non-Audit",
  seoTitle: "Business ITR Filing 2026 | ITR-3 ITR-4 Due 31 August | Ollvy",
  seoDescription:
    "Budget 2026 set a staggered ITR deadline. ITR-3 and ITR-4 non-audit filers must file by 31 August 2026 for FY 2025-26. Section 234F penalty, presumptive scheme rules, audit threshold triggers covered.",
  canonicalUrl: "https://www.ollvy.com/guides/business-itr-2026",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["itr-filing", "tax-audit", "advance-tax-payment"],
  relatedLearnSlugs: ["advance-tax-explained", "tds-on-rent-194i-194ib", "salaried-itr-2026"],
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "WHO FILES ITR-3 AND ITR-4",
      body:
        "ITR-3 and ITR-4 are the income tax return forms for individuals and HUFs whose income includes business or professional earnings. ITR-4 (Sugam) is the simpler form for taxpayers under the presumptive scheme (Section 44AD for small business, Section 44ADA for professionals, Section 44AE for transport operators) with total income up to Rs 50 lakh. ITR-3 is for everyone else with business or professional income, including those above Rs 50 lakh, those not opting for presumptive, partners in firms, and anyone with capital gains alongside business income.",
      bullets: [
        "ITR-4 (Sugam): Small business with turnover up to Rs 2 crore under 44AD; professionals with gross receipts up to Rs 50 lakh (Rs 75 lakh from FY 2023-24) under 44ADA; transport operators under 44AE.",
        "ITR-3: All other business or professional income filers, including non-presumptive, partners in firms, anyone above Rs 50 lakh income, anyone with foreign assets / income.",
        "Threshold check: If your total income is above Rs 50 lakh or you have multiple house properties or capital gains alongside business income, ITR-4 is unavailable and you must file ITR-3.",
      ],
    },
    {
      id: "02",
      heading: "THE 31 AUGUST 2026 DEADLINE UNDER BUDGET 2026",
      body:
        "Budget 2026 introduced staggered ITR deadlines for AY 2026-27, replacing the single 31 July date that previously applied across all non-audit cases. Salaried and capital-gains-only filers (ITR-1 / ITR-2) keep 31 July. Business and professional non-audit filers (ITR-3 / ITR-4) now have until 31 August 2026, giving them an extra month for the additional book-closing work. Audit cases continue to have 31 October 2026 (with the audit report due 30 September 2026), and transfer pricing cases have 30 November 2026.",
      table: {
        headers: ["Form", "Who Files", "Due Date FY 2025-26"],
        rows: [
          ["ITR-1 / ITR-2", "Salaried, capital gains, no business income", "31 July 2026"],
          ["ITR-3 / ITR-4 (non-audit)", "Business or professional, no audit", "31 August 2026"],
          ["ITR-3 / ITR-4 (audit)", "Business or professional, audit applicable", "31 October 2026"],
          ["ITR with TP audit", "International / specified domestic transactions", "30 November 2026"],
        ],
      },
      note:
        "If your business turnover crosses the audit threshold mid-year, you slip from 31 August into the 31 October bucket automatically. We flag this during pre-filing review.",
    },
    {
      id: "03",
      heading: "PRESUMPTIVE TAXATION UNDER SECTION 44AD AND 44ADA",
      body:
        "The presumptive scheme is the simpler path for small business and professional filers. Instead of computing actual profits and maintaining detailed books, you declare a deemed profit at a statutory percentage of turnover or gross receipts. Section 44AD covers small business (turnover up to Rs 2 crore), with deemed profit at 8 percent of turnover (6 percent for digital receipts). Section 44ADA covers professionals (gross receipts up to Rs 50 lakh, raised to Rs 75 lakh from FY 2023-24 if cash receipts are below 5 percent), with deemed profit at 50 percent of gross receipts. The taxpayer pays tax on the deemed profit, regardless of actual profit (which could be higher or lower).",
      bullets: [
        "Section 44AD threshold: Rs 2 crore turnover (Rs 3 crore from FY 2023-24 if cash receipts under 5 percent).",
        "Section 44AD deemed profit: 8% of turnover (6% if received digitally).",
        "Section 44ADA threshold: Rs 50 lakh gross receipts (Rs 75 lakh from FY 2023-24 if cash receipts under 5 percent).",
        "Section 44ADA deemed profit: 50% of gross receipts.",
        "Section 44AE: Transport operators with up to 10 vehicles. Deemed profit Rs 1,000 per ton per vehicle per month for HGVs above 12 tons; Rs 7,500 per vehicle per month otherwise.",
        "Once you opt out of presumptive in any year, you cannot opt back in for 5 years (Section 44AD(4)). 44ADA does not have this lock-in.",
      ],
    },
    {
      id: "04",
      heading: "WHEN PRESUMPTIVE STOPS MAKING SENSE",
      body:
        "Presumptive is great for genuinely small operations where book-keeping costs more than the tax saved. It stops making sense when actual profit is meaningfully below the deemed rate. A consultant with Rs 30 lakh receipts but Rs 12 lakh in genuine business expenses (rent, software, contractors) has actual profit of Rs 18 lakh, which is 60 percent of receipts. Section 44ADA forces a 50 percent deemed profit, so 50 percent works in their favour. But a consultant with Rs 30 lakh receipts and Rs 6 lakh expenses has actual profit of Rs 24 lakh (80 percent), so 44ADA's 50 percent floor is generous. The consultant in the second case keeps 44ADA. The consultant in a third scenario with Rs 30 lakh receipts and Rs 22 lakh expenses (74 percent expense ratio) has actual profit Rs 8 lakh, well below the 50 percent floor; they should opt out of 44ADA, file ITR-3 with audited books, and pay tax on the lower actual profit.",
      note:
        "If you opt out of 44AD, you must maintain books and get audited if turnover above the basic Section 44AB threshold. Plan ahead, the audit costs more than the tax saved if turnover is small.",
    },
    {
      id: "05",
      heading: "DOCUMENTS YOU WILL NEED",
      body:
        "Business and professional ITRs require more documentation than salaried ITRs. The audit-trail bar is higher.",
      bullets: [
        "Books of accounts: cash book, ledger, journal, sales/purchase registers (mandatory under 44AA if not under presumptive).",
        "Bank statements for all business accounts for FY 2025-26.",
        "GST returns (GSTR-1, GSTR-3B) for the year, reconciled with books.",
        "TDS deducted on payments received (your Form 26AS) plus TDS you've deducted on payments made (your TDS challans).",
        "Invoices for all expenses claimed as business deductions, especially the high-value ones (rent, salaries, professional fees, software, travel).",
        "Capital asset register if claiming depreciation under Section 32.",
        "Form 26AS, AIS, and TIS reconciled against books.",
        "Aadhaar (linked to PAN), bank account for refund, DSC for filing if turnover > Rs 1 crore.",
      ],
    },
    {
      id: "06",
      heading: "THE AUDIT THRESHOLD UNDER SECTION 44AB",
      body:
        "If your business turnover or professional receipts cross the audit threshold, you slip from non-audit (31 August deadline) into audit (31 October ITR deadline, 30 September audit report deadline). The thresholds are: Rs 1 crore for business turnover; Rs 10 crore for largely-digital business turnover (cash receipts and payments under 5 percent each); Rs 50 lakh for professional gross receipts. Crossing any threshold mid-year triggers Section 44AB audit, which means appointing a CA, getting Form 3CD prepared, and paying for the audit.",
      note:
        "From FY 2026-27 onwards, Section 44AB of the 1961 Act becomes Section 63 of the IT Act 2025, with the same thresholds. Penalty for missing the audit (Section 271B, 0.5 percent of turnover capped at Rs 1.5 lakh) becomes Section 446 in the new Act with the same numbers.",
    },
    {
      id: "07",
      heading: "PENALTIES FOR MISSING THE 31 AUGUST DEADLINE",
      body:
        "Missing the 31 August deadline shifts you into belated return territory, which carries three layers of cost.",
      table: {
        headers: ["Trigger", "Provision", "Amount"],
        rows: [
          ["Late filing fee (income above Rs 5L)", "Section 234F", "Rs 5,000"],
          ["Late filing fee (income up to Rs 5L)", "Section 234F", "Rs 1,000"],
          ["Interest on unpaid tax", "Section 234A", "1% per month"],
          ["Revised return fee (filed 1 Jan to 31 Mar 2027)", "Section 234I (new, Budget 2026)", "Rs 5,000 / Rs 1,000"],
          ["Loss carry-forward of business and capital losses", "Section 80", "Forfeited if return is late"],
        ],
      },
      note:
        "The biggest practical pain is loss-carry-forward forfeiture. Business losses can be carried forward 8 years to offset future profits, but only if the return is filed by the original due date. A Rs 10 lakh business loss could save Rs 3 lakh in future tax. Filing on 1 September wipes that out.",
    },
    {
      id: "08",
      heading: "INCOME TAX ACT 2025 BRIDGE",
      body:
        "Your FY 2025-26 ITR (filed by 31 August 2026) is governed by the Income Tax Act 1961, even though the IT Act 2025 came into force on 1 April 2026. CBDT has clarified that returns relating to income earned in tax years before 1 April 2026 continue under the 1961 Act. So you'll see all the familiar section numbers (139, 234F, 44AD, 44ADA, 44AB, etc.) on your ITR forms and any notices for AY 2026-27. From AY 2027-28 onwards (next year's ITR), the renumbered 2025 Act sections apply: Section 60 replaces 44AD, Section 61 replaces 44ADA, Section 63 replaces 44AB, and so on.",
    },
    {
      id: "09",
      heading: "COMMON MISTAKES",
      body:
        "Most defective return notices come from a small set of repeated errors.",
      bullets: [
        "Filing ITR-4 with capital gains. Capital gains require ITR-3, full stop. ITR-4 is presumptive-only.",
        "Skipping the audit threshold check. A turnover spike in March can push you above Rs 1 crore without you noticing.",
        "Mixing presumptive and actual profit. If you opt for 44AD, you declare 8 percent of turnover, even if your actual profit is lower. There's no middle ground.",
        "Forgetting to disclose foreign assets. ESOPs in foreign-parent companies, foreign bank accounts, foreign property all require Schedule FA disclosure under ITR-3.",
        "Claiming TDS without reconciling with 26AS. Any gap is a defect notice waiting to happen.",
      ],
    },
  ],
  faqs: [
    {
      q: "Why is the deadline 31 August and not 31 July?",
      a: "Budget 2026 introduced staggered ITR deadlines for FY 2025-26 (AY 2026-27). Salaried and pensioner filers using ITR-1 and ITR-2 keep the 31 July deadline. Non-audit business and professional filers using ITR-3 and ITR-4 now have until 31 August, giving them an extra month given the additional book-closing work involved.",
    },
    {
      q: "How do I know if I should file ITR-3 or ITR-4?",
      a: "ITR-4 (Sugam) is for resident individuals, HUFs and firms (other than LLPs) with total income up to Rs 50 lakh and presumptive income under Section 44AD (business), 44ADA (profession) or 44AE (transport). ITR-3 covers everyone else with business or professional income, including those who can't or don't want to use the presumptive scheme. If you're unsure, share your last year's filing and we'll confirm.",
    },
    {
      q: "Does the Income Tax Act 2025 affect my FY 2025-26 ITR?",
      a: "No. Even though the IT Act 2025 came into force from 1 April 2026, the FY 2025-26 return is governed by the old IT Act 1961 under the transition provisions. You'll file using ITR forms notified under the old Act for AY 2026-27. The new Act applies to income earned from 1 April 2026 onwards (Tax Year 2026-27), which you'll file in 2027.",
    },
    {
      q: "Can I file a revised return after 31 August?",
      a: "Yes. The revised return window for AY 2026-27 has been extended to 31 March 2027 under Budget 2026. So if you spot an error in your original filing (whether filed by 31 August or as a belated return), you can correct it via a revised return any time before 31 March 2027. From 1 January 2027 onwards, Section 234I (new, introduced by Budget 2026) applies a Rs 5,000 / Rs 1,000 fee on revised returns.",
    },
    {
      q: "What if my turnover crosses the audit threshold?",
      a: "If your business turnover crosses Rs 1 crore (or Rs 10 crore for largely-digital businesses), or your professional receipts cross Rs 50 lakh, you fall under Section 44AB tax audit. The deadline then shifts to 31 October 2026 for the ITR and 30 September 2026 for the audit report. We'll flag this when we review your books.",
    },
  ],
  sources: [
    {
      name: "Union Budget 2026 announcement: staggered ITR deadlines",
      url: "https://www.indiabudget.gov.in/",
      description: "Finance Minister announcement of differentiated ITR deadlines for ITR-1/ITR-2 (31 July) and ITR-3/ITR-4 (31 August) from AY 2026-27 onwards.",
    },
    {
      name: "Income Tax Department FAQ on AY 2026-27 ITR filing",
      url: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-tax-returns",
      description: "Official guidance on FY 2025-26 ITR due dates, governing Act, and forms applicable.",
    },
    {
      name: "Income Tax Act 1961, Sections 44AD, 44ADA, 44AE, 44AB, 234F, 234A",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Statutory basis for presumptive taxation, audit thresholds, and late filing penalties applicable to FY 2025-26.",
    },
    {
      name: "Income Tax Act 2025, Sections 60, 61, 63, 446 (transitional)",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Renumbered presumptive and audit provisions applicable from FY 2026-27 onwards (next year's ITR).",
    },
  ],
};
