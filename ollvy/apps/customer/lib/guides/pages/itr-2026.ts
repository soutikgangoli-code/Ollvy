// =============================================================================
// GUIDE PAGE: itr-2026
// File path: lib/guides/pages/itr-2026.ts
// Authored fresh for the older deadline slug "itr-2026" (the broad
// individual ITR page, distinct from salaried-itr-2026 which is ITR-1/ITR-2
// specific). This page covers ITR filing in general for FY 2025-26 (AY 2026-27).
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const itr2026: LearnPageConfig = {
  slug: "itr-2026",
  title: "ITR Filing for FY 2025-26: Which Form, When, and What Changed",
  seoTitle: "ITR Filing 2026 | Forms ITR-1 to ITR-7 | Due Dates AY 2026-27 | Ollvy",
  seoDescription:
    "How to choose the right ITR form for FY 2025-26, the staggered Budget 2026 deadlines, the new Section 234I revised return fee, and what the Income Tax Act 2025 transition means for your filing.",
  canonicalUrl: "https://www.ollvy.com/guides/itr-2026",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["itr-filing", "tax-audit", "advance-tax-payment"],
  relatedLearnSlugs: ["salaried-itr-2026", "business-itr-2026", "advance-tax-explained"],
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "WHO HAS TO FILE AN ITR FOR FY 2025-26",
      body:
        "An Income Tax Return is the annual statement of income to the tax department. For FY 2025-26 (AY 2026-27), you have to file if your gross total income (before deductions) is above the basic exemption limit. The basic exemption is Rs 4 lakh under the new regime (the default for FY 2025-26) and Rs 2.5 lakh under the old regime. Beyond income, certain triggers force you to file even if income is below the limit: TDS or TCS of Rs 25,000 or more, deposits of Rs 1 crore or more in current accounts or Rs 50 lakh or more in savings accounts, foreign travel spend above Rs 2 lakh, electricity bills above Rs 1 lakh, business turnover above Rs 60 lakh, or professional receipts above Rs 10 lakh.",
      note:
        "Even if you fall below the limit, filing an ITR is what triggers refunds of excess TDS and gives you the documentary trail for visa applications, home loans, and credit card increases. Most salaried filers benefit from filing voluntarily.",
    },
    {
      id: "02",
      heading: "WHICH ITR FORM YOU FILE",
      body:
        "ITR forms are categorised by who you are and what kinds of income you have. Pick the wrong form and the return gets treated as defective under Section 139(9), which means you have to refile.",
      table: {
        headers: ["Form", "Who Files"],
        rows: [
          ["ITR-1 (Sahaj)", "Resident individual, total income up to Rs 50 lakh, salary + one house property + other sources only"],
          ["ITR-2", "Individuals and HUFs without business income (capital gains, multiple house properties, foreign assets, income above Rs 50 lakh)"],
          ["ITR-3", "Individuals and HUFs with business or professional income (non-presumptive)"],
          ["ITR-4 (Sugam)", "Resident individuals, HUFs and firms (other than LLPs) under presumptive scheme (44AD/44ADA/44AE), total income up to Rs 50 lakh"],
          ["ITR-5", "Firms, LLPs, AOPs, BOIs (not individuals)"],
          ["ITR-6", "Companies (other than those claiming Section 11 exemption)"],
          ["ITR-7", "Trusts, political parties, institutions claiming exemption under Sections 11, 12, 10(23C), 13A, 13B"],
        ],
      },
      note:
        "ITR-1 cannot handle even Rs 100 of capital gains. The moment you redeem mutual funds or sell shares, you move to ITR-2. Pick correctly upfront, defective return notices are avoidable.",
    },
    {
      id: "03",
      heading: "STAGGERED DEADLINES UNDER BUDGET 2026",
      body:
        "Budget 2026 introduced different ITR deadlines for different filer categories from AY 2026-27 onwards, replacing the previous single 31 July date.",
      table: {
        headers: ["Filer", "Form", "Due Date FY 2025-26"],
        rows: [
          ["Salaried, capital gains, no business", "ITR-1 / ITR-2", "31 July 2026"],
          ["Business / professional non-audit", "ITR-3 / ITR-4", "31 August 2026"],
          ["Business / professional with audit", "ITR-3 / ITR-4 / ITR-5", "31 October 2026 (audit report by 30 September)"],
          ["With international transactions / TP audit", "Any business form", "30 November 2026"],
          ["Belated return", "Any form", "31 December 2026"],
          ["Revised return", "Any form", "31 March 2027 (Budget 2026 extension)"],
        ],
      },
      note:
        "The audit deadline (31 October) was extended from 30 September in earlier years for ITR forms; the audit report itself is still due 30 September. If your turnover spikes above the audit threshold mid-year, you slip from 31 August to 31 October automatically.",
    },
    {
      id: "04",
      heading: "THE NEW SECTION 234I FEE FOR REVISED RETURNS",
      body:
        "Budget 2026 introduced Section 234I, a new fee for revised returns filed after 31 December but before the new 31 March cutoff. Effective 1 March 2026, any revised return filed between 1 January 2027 and 31 March 2027 attracts a fee of Rs 5,000 (Rs 1,000 if total income is up to Rs 5 lakh). This is separate from the Section 234F late filing fee, so a taxpayer who files belated and then revises after December pays both.",
      bullets: [
        "Revised return filed by 31 December 2026: No 234I fee.",
        "Revised return filed between 1 January 2027 and 31 March 2027: Rs 5,000 (Rs 1,000 if income up to Rs 5 lakh).",
        "234I is on top of any 234F penalty on the original belated return, not a replacement.",
      ],
    },
    {
      id: "05",
      heading: "OLD REGIME vs NEW REGIME UNDER FY 2025-26 SLABS",
      body:
        "The new tax regime is the default. To opt for the old regime, you actively select it while filing. For FY 2025-26, the new regime tax-free threshold is effectively Rs 12 lakh thanks to the Section 87A rebate of Rs 60,000 (Budget 2025). For salaried filers, the standard deduction of Rs 75,000 takes effective tax-free salary income to Rs 12.75 lakh.",
      table: {
        headers: ["Slab (New Regime)", "Rate"],
        rows: [
          ["Up to Rs 4 lakh", "Nil"],
          ["Rs 4 lakh to Rs 8 lakh", "5%"],
          ["Rs 8 lakh to Rs 12 lakh", "10%"],
          ["Rs 12 lakh to Rs 16 lakh", "15%"],
          ["Rs 16 lakh to Rs 20 lakh", "20%"],
          ["Rs 20 lakh to Rs 24 lakh", "25%"],
          ["Above Rs 24 lakh", "30%"],
        ],
      },
      note:
        "The old regime continues to allow deductions under Sections 80C (Rs 1.5 lakh), 80D, HRA, home loan interest. It can beat the new regime if you have Rs 3 lakh or more in deductions. For most salaried filers, the new regime is now both simpler and lower-tax.",
    },
    {
      id: "06",
      heading: "DOCUMENTS YOU WILL NEED",
      body:
        "Document discipline is what separates a 30-minute filing from a three-call back-and-forth.",
      bullets: [
        "Form 16 (salary TDS certificate) from every employer in FY 2025-26.",
        "Form 26AS, AIS, and TIS downloaded from the e-filing portal. These show all TDS, advance tax, and reported financial transactions. Reconcile against Form 16 and bank interest statements.",
        "Capital gains statements from broker or mutual fund house (preferably with grandfathering reflected for pre-31 January 2018 holdings).",
        "Bank interest certificates (deposit interest is taxable, not exempt as many assume).",
        "Section 80C, 80D, HRA proofs (if filing under old regime).",
        "Property purchase or sale documents (for capital gains computation).",
        "Foreign asset disclosures including ESOPs in foreign-parent companies (Schedule FA in ITR-2/3, mandatory).",
        "Aadhaar (linked to PAN, mandatory for filing).",
      ],
    },
    {
      id: "07",
      heading: "PENALTIES FOR FILING LATE",
      body:
        "Missing the original due date pushes you into belated return territory with three layers of cost.",
      table: {
        headers: ["Trigger", "Provision", "Amount"],
        rows: [
          ["Late filing fee (income above Rs 5L)", "Section 234F", "Rs 5,000"],
          ["Late filing fee (income up to Rs 5L)", "Section 234F", "Rs 1,000"],
          ["Interest on unpaid tax", "Section 234A", "1% per month"],
          ["Revised return fee (filed 1 Jan to 31 Mar 2027)", "Section 234I (new, Budget 2026)", "Rs 5,000 / Rs 1,000"],
          ["Loss carry-forward", "Section 80", "Forfeited if return is late"],
        ],
      },
      note:
        "Loss carry-forward forfeiture is the underrated cost. A Rs 5 lakh capital loss can offset future gains worth Rs 60,000 to Rs 1.5 lakh in tax savings. Filing one day late on the original due date wipes that out.",
    },
    {
      id: "08",
      heading: "INCOME TAX ACT 2025 BRIDGE",
      body:
        "Even though the Income Tax Act 2025 came into force on 1 April 2026, the FY 2025-26 ITR (AY 2026-27) is governed by the Income Tax Act 1961 under transition provisions. CBDT has clarified this in their AY 2026-27 filing FAQ. So the section numbers you'll see on your return and any related notices are the familiar 1961 Act numbers (139, 234F, 87A, 80C, 234A). From AY 2027-28 onwards (next year's ITR), the renumbered IT Act 2025 sections apply.",
    },
    {
      id: "09",
      heading: "COMMON MISTAKES",
      body:
        "Most defective return notices come from a small set of avoidable errors.",
      bullets: [
        "Filing ITR-1 with capital gains. Even Rs 100 of mutual fund redemption forces ITR-2.",
        "Not reconciling Form 16 with Form 26AS. The department's data wins, mismatches lead to scrutiny.",
        "Claiming HRA without rent agreement and rent receipts when income exceeds Rs 50 lakh.",
        "Skipping Schedule FA for ESOPs in foreign-parent companies. Black Money Act penalties are severe.",
        "Choosing the wrong tax regime mid-filing. Once saved, switching back can require a fresh draft.",
        "Forgetting to e-verify after filing. Unverified returns are treated as not filed.",
      ],
    },
  ],
  faqs: [
    {
      q: "Why are there different ITR deadlines this year?",
      a: "Budget 2026 introduced staggered deadlines from AY 2026-27 onwards. Salaried and capital-gains-only filers (ITR-1 / ITR-2) keep 31 July. Business and professional non-audit filers (ITR-3 / ITR-4) get an extra month, due 31 August, to handle the additional book-closing work. Audit cases continue with 31 October ITR and 30 September audit report deadlines.",
    },
    {
      q: "What is Section 234I and when does it apply?",
      a: "Section 234I is a new fee introduced by Budget 2026, effective 1 March 2026, for revised returns filed after 31 December but before the new 31 March cutoff. The fee is Rs 5,000 (Rs 1,000 if your total income is up to Rs 5 lakh). It applies in addition to any Section 234F fee on a belated original return.",
    },
    {
      q: "Does the Income Tax Act 2025 affect my FY 2025-26 ITR?",
      a: "No. The 2025 Act came into force from 1 April 2026 but applies to income earned from FY 2026-27 onwards. Your FY 2025-26 ITR continues under the 1961 Act, including all the familiar section numbers. The transition is in CBDT's official AY 2026-27 filing FAQ.",
    },
    {
      q: "Old regime or new regime, which should I pick?",
      a: "For most salaried filers, the new regime is simpler and lower-tax. The new regime gives Rs 12 lakh tax-free income through the Section 87A rebate (Rs 12.75 lakh for salaried, after Rs 75,000 standard deduction). The old regime can beat the new only if your total deductions (80C, 80D, HRA, home loan interest) cross roughly Rs 3 lakh. Run both calculations on the e-filing portal's tax calculator before locking in.",
    },
    {
      q: "Can I file even if my income is below the exemption limit?",
      a: "Yes, voluntarily. In fact, you should, because the ITR is what triggers a refund of any excess TDS, and it gives you the income trail you'll need for visa applications, home loans, and credit card limit increases. Filing voluntarily costs nothing if you do it on time and there's no tax due.",
    },
  ],
  sources: [
    {
      name: "Income Tax Department: AY 2026-27 ITR filing FAQs",
      url: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-tax-returns",
      description: "Official guidance on FY 2025-26 ITR due dates, applicable Act, and forms.",
    },
    {
      name: "Union Budget 2026: staggered ITR deadlines and Section 234I",
      url: "https://www.indiabudget.gov.in/",
      description: "Finance Bill 2026 introduced differentiated deadlines and the new Section 234I fee for late revised returns.",
    },
    {
      name: "Income Tax Act 1961, Sections 139, 234F, 234A, 87A",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Statutory basis for ITR filing obligations, due dates, late fees, and rebate.",
    },
    {
      name: "Income Tax Act 2025, transition provisions",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Transition rules preserving the 1961 Act for tax years before 1 April 2026.",
    },
  ],
};
