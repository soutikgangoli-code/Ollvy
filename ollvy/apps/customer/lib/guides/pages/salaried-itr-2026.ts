// =============================================================================
// GUIDE PAGE: salaried-itr-2026
// File path: lib/guides/pages/salaried-itr-2026.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const salariedItr2026: LearnPageConfig = {
  slug: "salaried-itr-2026",
  title: "Salaried ITR Filing for FY 2025-26: ITR-1 vs ITR-2, Deadlines, Penalties",
  seoTitle: "Salaried ITR Filing 2026 | ITR-1 ITR-2 Due 31 July | Ollvy",
  seoDescription: "File ITR-1 / ITR-2 for FY 2025-26 by 31 July 2026. Section 234F penalty for late filing, loss of carry-forward, Section 87A rebate up to Rs 12 lakh under new regime. Ollvy files in 3 days starting Rs 1,499.",
  canonicalUrl: "https://www.ollvy.com/guides/salaried-itr-2026",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["itr-filing", "tax-audit"],
  relatedLearnSlugs: ["advance-tax-explained", "tds-on-rent-194i-194ib"],
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "WHAT THE ITR IS AND WHY YOU FILE EVEN IF NOTHING IS OWED",
      body:
        "Your Income Tax Return is the annual statement to the tax department of all income earned, all tax already paid (through TDS, advance tax, or self-assessment), and any refund or balance owed. Most salaried individuals already have most of their tax cut at source by the employer, so the ITR is largely a confirmation. But you still file, because the return is what triggers a refund of any excess TDS, what proves your income for visa applications and home loan paperwork, and what carries forward any losses you want to set off against future gains. Skip filing and these benefits all evaporate.",
    },
    {
      id: "02",
      heading: "WHO FILES BY 31 JULY 2026",
      body:
        "The 31 July 2026 deadline applies to ITR-1 and ITR-2 filers, which covers most salaried individuals and individuals without business or professional income.",
      table: {
        headers: ["Form", "Who Uses It", "Income Limit"],
        rows: [
          ["ITR-1 (Sahaj)", "Salary, one house property, interest, family pension, agricultural income up to Rs 5K", "Total income up to Rs 50 lakh"],
          ["ITR-2", "Salary plus capital gains, more than one house property, foreign income/assets, ESOPs in foreign companies, lottery winnings", "No income limit"],
          ["ITR-3", "Business or professional income (proprietorships, freelance with business books, unlisted shares)", "Not applicable, due 31 August 2026"],
          ["ITR-4 (Sugam)", "Presumptive taxation under 44AD/44ADA/44AE", "Not applicable, due 31 August 2026"],
        ],
      },
      note:
        "If you have any business or professional income, you need ITR-3 or ITR-4 with the 31 August 2026 deadline. ITR-1 and ITR-2 are for salaried and salary-plus-investment income only.",
    },
    {
      id: "03",
      heading: "STAGGERED DEADLINES UNDER BUDGET 2026",
      body:
        "Budget 2026 introduced India's first staggered ITR deadline regime. Earlier, all non-audit ITRs shared a single 31 July deadline. From AY 2026-27 (FY 2025-26), different categories of taxpayers get different dates.",
      table: {
        headers: ["Category", "Deadline for FY 2025-26 (AY 2026-27)"],
        rows: [
          ["ITR-1 / ITR-2 (salaried, capital gains, individuals without business income)", "31 July 2026"],
          ["ITR-3 / ITR-4 non-audit (business/professional income, no Section 44AB audit)", "31 August 2026"],
          ["Audit cases (turnover above Rs 1 crore for business or Rs 50 lakh for profession)", "31 October 2026"],
          ["Transfer pricing cases (international transactions, specified domestic transactions)", "30 November 2026"],
        ],
      },
      note:
        "The staggered framework reduces last-minute portal load and gives audit-case taxpayers more time. The schedule applies only to original returns. Belated returns under Section 139(4) follow the unified 31 December 2026 deadline regardless of category.",
    },
    {
      id: "04",
      heading: "WHAT INCOME GOES INTO EACH ITR FORM",
      body:
        "Quick decision tree to pick the right form. Picking wrong is the most common cause of a defective return notice under Section 139(9), which forces a fresh filing within 15 days.",
      bullets: [
        "Pure salary plus one self-occupied or let-out property, total under Rs 50L: ITR-1.",
        "Salary plus capital gains from listed shares, mutual funds, or property: ITR-2.",
        "Multiple house properties or any house property loss to carry forward: ITR-2 (not ITR-1).",
        "Foreign assets, foreign salary, or ESOPs vested in a foreign parent company: ITR-2 with Schedule FA.",
        "Any business or professional income (freelance, consulting, side hustle reported on books): ITR-3 (file by 31 August 2026).",
        "Presumptive taxation under 44AD or 44ADA: ITR-4 Sugam (file by 31 August 2026).",
        "Unlisted equity, partnership share, or director in an unlisted company: ITR-3 with mandatory disclosure of unlisted shareholding.",
      ],
    },
    {
      id: "05",
      heading: "NEW VS OLD TAX REGIME FOR FY 2025-26",
      body:
        "The new regime has been the default since AY 2024-25. For most salaried individuals, the new regime is now the simpler and lower-tax option, but the old regime can still beat it if you have substantial Section 80C, 80D, HRA, and home loan interest deductions.",
      table: {
        headers: ["Income Slab", "New Regime", "Old Regime"],
        rows: [
          ["Up to Rs 4 lakh", "Nil", "Nil up to Rs 2.5 lakh; 5% from Rs 2.5L to Rs 5L"],
          ["Rs 4 to 8 lakh", "5%", "20% from Rs 5L to Rs 10L"],
          ["Rs 8 to 12 lakh", "10%", "20%"],
          ["Rs 12 to 16 lakh", "15%", "30% above Rs 10L"],
          ["Rs 16 to 20 lakh", "20%", "30%"],
          ["Rs 20 to 24 lakh", "25%", "30%"],
          ["Above Rs 24 lakh", "30%", "30%"],
        ],
      },
      note:
        "Standard deduction under the new regime is Rs 75,000 (was Rs 50,000 earlier). Section 87A rebate under the new regime takes total tax to nil for income up to Rs 12 lakh, with marginal relief between Rs 12 lakh and roughly Rs 12.75 lakh. The old regime continues to allow 80C (Rs 1.5L), 80D, HRA, home loan interest, and other deductions. Compare both before locking in the regime, you can switch annually as a salaried individual.",
    },
    {
      id: "06",
      heading: "DOCUMENTS YOU WILL NEED",
      body:
        "Document discipline is what separates a 30-minute filing from a three-call back-and-forth.",
      bullets: [
        "Form 16 from every employer in FY 2025-26 (if you switched jobs, you'll have two).",
        "Form 26AS and AIS/TIS downloaded from the e-filing portal. Reconcile against Form 16 and bank interest statements.",
        "Capital gains statements from your broker or mutual fund house (preferably the consolidated one with grandfathering reflected).",
        "Interest certificates from banks for all FDs and savings accounts.",
        "Home loan interest certificate from the bank, if claiming Section 24(b).",
        "Rent receipts and rent agreement, if claiming HRA exemption (employer accepts these too in some cases).",
        "Section 80C, 80D proofs (PPF, ELSS, life insurance premium, health insurance premium, NPS contribution).",
        "ESOP perquisite working from the employer for foreign-parent ESOPs, plus the original grant and vesting details.",
        "PAN, Aadhaar (linked), and bank account number where any refund should be credited.",
      ],
    },
    {
      id: "07",
      heading: "PENALTIES FOR MISSING THE DEADLINE",
      body:
        "Three things hit if you file after 31 July 2026.",
      bullets: [
        "Section 234F late filing fee: Rs 5,000 if total income is above Rs 5 lakh, Rs 1,000 if it is below.",
        "Section 234A interest at 1 percent per month or part of a month on any unpaid tax until the date of filing.",
        "Section 234I revised return fee (new under Budget 2026, effective 1 March 2026): Rs 5,000 (Rs 1,000 if income up to Rs 5 lakh) for revised returns filed between 1 January 2027 and 31 March 2027. This is a separate fee, payable in addition to any 234F fee on a belated original return.",
        "Loss of carry-forward of capital losses (under Section 80, the right to carry losses forward is conditional on filing the return by the original due date).",
      ],
      note:
        "Refunds get processed only after the return is filed and assessed. If your TDS exceeds your final tax liability, every month of late filing is a month your refund money sits with the department instead of in your account.",
    },
    {
      id: "08",
      heading: "BELATED AND REVISED RETURN WINDOWS",
      body:
        "If you miss 31 July, you still have options, but each comes with trade-offs.",
      table: {
        headers: ["Scenario", "Window", "Section"],
        rows: [
          ["Belated return (filing for the first time after the original due date)", "Up to 31 December 2026", "Section 139(4)"],
          ["Revised return (correcting an already-filed return)", "Up to 31 March 2027", "Section 139(5)"],
          ["Updated return (paying additional tax for missed income, after revised window closes)", "Up to 31 March 2030 (4 years)", "Section 139(8A)"],
        ],
      },
      note:
        "Belated returns under Section 139(4) lose loss carry-forward rights. Revised returns under 139(5) preserve everything from the original filing but require declaring the original ITR's acknowledgement number. Updated returns under 139(8A) only allow upward revisions (more tax) and attract additional 25 percent or 50 percent of tax depending on when filed.",
    },
    {
      id: "09",
      heading: "COMMON MISTAKES THAT TRIGGER NOTICES OR REJECTION",
      body:
        "Most defective return notices from the department come from a small set of repeated errors.",
      bullets: [
        "Filing ITR-1 when you have any capital gains. Even Rs 100 of mutual fund redemption gain triggers ITR-2.",
        "Not reconciling Form 16 with Form 26AS. The department's data wins, mismatches lead to scrutiny notices.",
        "Claiming HRA without the rent agreement and rent receipts to back it up if income exceeds Rs 50 lakh.",
        "Missing Schedule FA disclosure for foreign assets, including ESOPs in foreign-parent companies. Penalty under the Black Money Act is severe.",
        "Selecting the wrong tax regime mid-filing. Once you save the regime selection, switching back can cause a fresh ITR draft to be needed.",
        "Forgetting to verify the return after filing. An unverified return is treated as not filed. e-Verification through Aadhaar OTP, net banking, or Demat account is the cleanest route.",
      ],
    },
    {
      id: "10",
      heading: "INCOME TAX ACT 2025 BRIDGE",
      body:
        "From 1 April 2026, the Income Tax Act 2025 replaces the 1961 Act. CBDT has clarified that taxability of income earned in FY 2025-26 (this ITR) continues to be governed by the 1961 Act, since income accrued before the new Act commenced. So for this ITR, all the familiar 1961 Act sections (139, 87A, 234A, 234F, 80C, 80D) still apply. From FY 2026-27 onwards (next year's ITR, filed in 2027), the new section numbers take over.",
      note:
        "ITR forms for AY 2026-27 still use the 1961 Act references on Tab 1 of the e-filing portal. From AY 2027-28 onwards, Tab 2 references the 2025 Act. The portal will guide you correctly. The math doesn't change, only the section numbers do.",
    },
  ],
  faqs: [
    {
      q: "I'm salaried at Rs 8 lakh. Old regime or new regime?",
      a: "At Rs 8 lakh income, the new regime is almost always better unless you have significant Section 80C, 80D, HRA, and home loan interest deductions. Under the new regime with the Rs 75,000 standard deduction and the Rs 60,000 Section 87A rebate up to Rs 12 lakh, your tax liability comes to nil. Under the old regime, you'd need around Rs 2.5 lakh in deductions just to break even. Run both calculations on the e-filing portal's tax calculator before locking in.",
    },
    {
      q: "I switched jobs mid-year and have two Form 16s. How do I file?",
      a: "Add up the salary income from both Form 16s, add up the TDS deducted, and file a single ITR with the consolidated numbers. The two employers won't have coordinated on your full year's income, so each may have under-deducted TDS based on its own salary slab. Expect a small balance to pay or factor it into your refund computation. Ollvy reconciles two-employer cases routinely, the math is straightforward but easy to get wrong if rushed.",
    },
    {
      q: "I have capital gains from US stocks. Which ITR?",
      a: "ITR-2 is mandatory because you have foreign assets and foreign capital gains. You'll also need to fill Schedule FA (Foreign Assets) disclosing the value of US-listed holdings as on 31 December 2025 and 31 March 2026, and Schedule CG for the capital gains. Foreign tax paid (US withholding on dividends) gets credited under Section 90/91 if there's a DTAA. India-US DTAA allows credit for US dividend tax up to a cap.",
    },
    {
      q: "I'm an NRI returning to India during FY 2025-26. Which ITR?",
      a: "Your residency status for the year determines the ITR. If you stayed in India for 182 days or more during FY 2025-26, you're a resident and tax on worldwide income applies. Use ITR-2 if you have only salary and capital gains, ITR-3 if you have business income. Returning NRIs with substantial foreign assets need to file Schedule FA carefully, including any US 401(k), foreign property, or foreign bank accounts.",
    },
    {
      q: "Does the new Income Tax Act 2025 apply to my FY 2025-26 ITR?",
      a: "No. The 2025 Act applies to income earned from FY 2026-27 onwards. Your FY 2025-26 ITR (this filing) continues to be governed by the 1961 Act, including all section numbers (139, 87A, 234F, etc.). The portal's first tab uses 1961 Act references. From AY 2027-28 onwards, the 2025 Act sections kick in. CBDT has issued explicit transitional guidance on this.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 1961, Section 139 (filing requirement)",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Statutory basis for ITR filing obligations and due dates.",
    },
    {
      name: "Income Tax Act 1961, Section 234F (late filing fee)",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Rs 5,000 / Rs 1,000 late filing fee structure.",
    },
    {
      name: "Income Tax Act 1961, Section 87A (rebate)",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Rebate up to Rs 60,000 for total income up to Rs 12 lakh under the new regime.",
    },
    {
      name: "Budget 2026 (Finance Act 2025) staggered deadlines",
      url: "https://www.indiabudget.gov.in/",
      description: "Staggered ITR due dates for AY 2026-27 introduced in Budget 2026.",
    },
    {
      name: "Income Tax Department e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Official portal for ITR filing, Form 26AS, AIS/TIS download.",
    },
  ],
};
