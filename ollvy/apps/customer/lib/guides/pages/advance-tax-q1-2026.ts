// =============================================================================
// GUIDE PAGE: advance-tax-q1-2026
// File path: lib/guides/pages/advance-tax-q1-2026.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const advanceTaxQ12026: LearnPageConfig = {
  slug: "advance-tax-q1-2026",
  title: "Missed Advance Tax Q1 (15 June 2026)? Catch Up Before 15 September",
  seoTitle: "Missed Advance Tax Q1 FY 2026-27 | Catch Up by 15 Sep | Ollvy",
  seoDescription: "The 15 June 2026 Q1 advance tax date has passed. Interest under Section 425 (IT Act 2025) is a fixed 3 months at 1% on the shortfall. Reach 45% of annual tax by 15 September 2026 to stop the next charge.",
  canonicalUrl: "https://www.ollvy.com/guides/advance-tax-q1-2026",
  lastReviewed: "July 2026",
  category: "Tax",
  relatedServiceSlugs: ["business-itr"],
  relatedLearnSlugs: ["advance-tax-explained", "advance-tax-q2-2026"],
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "15 JUNE HAS PASSED: WHAT IT COSTS AND WHAT TO DO NOW",
      body:
        "The Q1 instalment date for FY 2026-27 was 15 June 2026. If you paid less than 15 percent of your estimated annual tax by then, the interest is already fixed: Section 425 (IT Act 2025, formerly 234C) charges 1 percent per month for a flat 3 months on the Q1 shortfall. On a Rs 15,000 shortfall that is Rs 450, and paying today does not reduce it.\n\nWhat paying now does protect is the next charge. The 15 September 2026 target is cumulative: 45 percent of annual tax. Miss that too and a fresh 3-month interest charge lands on the larger Q2 shortfall. The practical move is to compute the annual estimate now and pay enough before 15 September to reach 45 percent.\n\nOne relief worth checking: if you paid at least 12 percent of your annual tax by 15 June, no Q1 interest applies at all. The 15 percent target has a 12 percent tolerance built into the law.",
      note:
        "Ollvy CA computes the annual estimate, the Q1 interest already accrued, and the exact amount to pay before 15 September in one working day.",
    },
    {
      id: "02",
      heading: "WHAT ADVANCE TAX IS",
      body:
        "Advance tax is the pay-as-you-earn version of income tax. Instead of waiting until ITR filing time and paying everything in one shot, the law requires taxpayers to pay tax in four instalments through the year, matched roughly to the pace of earning income. The triggering threshold is Rs 10,000: if your total tax liability (after deducting TDS and TCS already credited to you) is expected to exceed Rs 10,000 in a year, advance tax kicks in.",
      note:
        "From FY 2026-27 onwards, advance tax is governed by Section 404 of the Income Tax Act 2025 (successor to Section 208 of the 1961 Act). The Rs 10,000 threshold and the 15/45/75/100 schedule carry forward unchanged.",
    },
    {
      id: "03",
      heading: "WHO HAS TO PAY",
      body:
        "Most taxpayers with non-salary income end up paying advance tax. The salaried with no other income are typically covered by their employer's TDS and don't need to pay advance tax separately, though large bonuses or stock vests can change that mid-year.",
      bullets: [
        "Individuals and HUFs with total tax liability above Rs 10,000 after TDS / TCS.",
        "All companies, regardless of profit level (the threshold doesn't apply to companies).",
        "All firms, LLPs, AOPs, and BOIs.",
        "Resident senior citizens (60+) without business or professional income are exempt.",
        "Salaried employees with only TDS-covered salary income don't usually need to pay advance tax separately.",
      ],
    },
    {
      id: "04",
      heading: "THE 15-45-75-100 SCHEDULE",
      body:
        "Advance tax is paid in four cumulative instalments. The percentages are cumulative, not incremental: Q2 means 45 percent total paid by then, not an additional 45 percent on top of Q1.",
      table: {
        headers: ["Quarter", "Due Date", "Cumulative Target", "FY 2026-27 Date"],
        rows: [
          ["Q1", "15 June", "15% of annual tax", "15 June 2026"],
          ["Q2", "15 September", "45% of annual tax", "15 September 2026"],
          ["Q3", "15 December", "75% of annual tax", "15 December 2026"],
          ["Q4", "15 March", "100% of annual tax", "15 March 2027"],
        ],
      },
      note:
        "Presumptive taxpayers (Section 44AD or Section 44ADA) get a single-instalment shortcut: pay 100 percent in one shot by 15 March. They don't have to follow the quarterly schedule.",
    },
    {
      id: "05",
      heading: "SECTION 425 INTEREST FOR Q1 SHORTFALL (FORMERLY 234C)",
      body:
        "If you paid less than 15 percent of your annual tax by 15 June, Section 425 (IT Act 2025, formerly Section 234C) charges interest at 1 percent per month on the shortfall for a fixed period of 3 months. The 3-month period does not shrink if you pay mid-quarter; the charge is computed per instalment, not per day. Example: Annual tax target Rs 1,00,000, Q1 target Rs 15,000, you paid Rs 9,000. Shortfall Rs 6,000. Interest at 1 percent for 3 months = Rs 180.",
    },
    {
      id: "06",
      heading: "INCOME TAX ACT 2025 BRIDGE",
      body:
        "The Income Tax Act 2025 came into force on 1 April 2026. For FY 2026-27 advance tax, the new section numbers apply.",
      table: {
        headers: ["1961 Act (legacy)", "2025 Act (current)", "Subject"],
        rows: [
          ["Section 208", "Section 404", "Liability to pay advance tax (Rs 10,000 threshold)"],
          ["Section 211", "Same framework, tabular form", "Quarterly schedule (15/45/75/100)"],
          ["Section 234B", "Section 424", "Interest for default in payment of advance tax"],
          ["Section 234C", "Section 425", "Interest for deferment of advance tax instalments"],
        ],
      },
      note:
        "Substantive rates and thresholds are unchanged. Only the section number on any order or notice you receive will be the new one. CBDT confirmed the transition framework in its March 2026 FAQ.",
    },
    {
      id: "07",
      heading: "CAPITAL GAINS RELIEF",
      body:
        "If your Q1 shortfall is caused by a capital gain or other income that wasn't reasonably anticipated at the start of the year, you can pay the related tax in the next instalment without 425 interest, provided you pay it by year-end. The relief is conditional and is well-litigated, so document the basis for the unanticipated gain (e.g., stock vest in May not known in April, property sale closed in late June).",
    },
    {
      id: "08",
      heading: "PRESUMPTIVE TAXPAYERS",
      body:
        "Section 44AD (small business presumptive scheme) and Section 44ADA (professionals presumptive scheme) filers don't have to follow the four-quarter schedule. They pay 100 percent of advance tax in a single shot by 15 March. Q1, Q2, and Q3 don't apply to them.",
      note:
        "Under the IT Act 2025, presumptive taxation is at Section 60 (44AD equivalent) and Section 61 (44ADA equivalent). Substantive rules including the single-instalment payment carry forward.",
    },
    {
      id: "09",
      heading: "HOW TO PAY",
      body:
        "Advance tax is paid through Challan ITNS-280 on the Income Tax e-Filing Portal. The flow is: log in, go to e-Pay Tax, select 'Advance Tax (100)', enter the assessment year (AY 2027-28 for FY 2026-27), enter the amount, choose your bank, and confirm. The challan acknowledgement (BSR code, challan serial number, date) becomes your proof of payment and gets reflected in your 26AS within 3 to 5 working days.",
      bullets: [
        "Log in to https://www.incometax.gov.in/iec/foportal/",
        "Navigate to e-Pay Tax under the e-File menu.",
        "Select 'Advance Tax (100)' as the type of payment.",
        "Pick the correct Assessment Year: AY 2027-28 for FY 2026-27 advance tax.",
        "Enter the amount, choose net banking or RTGS, and confirm.",
        "Save the challan acknowledgement; it becomes your audit trail.",
      ],
    },
  ],
  faqs: [
    {
      q: "I completely missed 15 June. Should I pay immediately or wait for 15 September?",
      a: "Pay as part of the 15 September instalment unless your estimate has grown. The Q1 interest is a fixed 3-month charge either way, so there is no daily meter running on it. What matters is reaching 45 percent of annual tax by 15 September 2026; paying early within the quarter neither reduces the Q1 charge nor earns credit. Use the time to firm up the annual estimate so the Q2 payment lands the cumulative total exactly.",
    },
    {
      q: "I am salaried. My TDS already covers everything. Do I need advance tax?",
      a: "Usually no, unless you have non-salary income that the employer's TDS doesn't capture. Common triggers: rental income above Rs 50,000 per month (TDS at 10 percent often falls short of slab rate), capital gains from equity or property, freelance side income, dividend income from foreign stocks. Run a quick projection in May for the upcoming year to check.",
    },
    {
      q: "I'll have a one-off capital gain in October. How do I plan?",
      a: "Don't include it in your June or September estimate, since the law gives relief for unanticipated capital gains. Pay the capital gains tax in the next instalment after the gain is realised (i.e., in December for an October sale), and document the gain's date so you can claim Section 425 relief if questioned.",
    },
    {
      q: "Last year I paid only at year-end. What's my interest exposure?",
      a: "Section 425 (formerly 234C) interest at 1 percent per month on each quarterly shortfall, plus Section 424 (formerly 234B) interest at 1 percent per month from 1 April until self-assessment payment if your total advance tax was below 90 percent. For an Rs 5 lakh annual tax paid only in March, expect roughly Rs 8,000 to Rs 12,000 in compounding 425 + 424 interest.",
    },
    {
      q: "Does freelancer income from US clients count?",
      a: "Yes, every rupee equivalent of foreign-source freelance income is taxable in India for residents and counts toward advance tax computation. The US clients won't withhold Indian TDS, so the entire tax is your responsibility through advance tax.",
    },
    {
      q: "New Tax Act 2025 changes anything for me?",
      a: "Substantively, no. Threshold (Rs 10,000), schedule (15/45/75/100), interest rate (1 percent per month) all carry forward. Only the section numbers change: 208 becomes 404, 234B becomes 424, 234C becomes 425.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025, Sections 404 to 425",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Renumbered advance tax and interest provisions applicable from FY 2026-27 onwards.",
    },
    {
      name: "Income Tax e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "e-Pay Tax module and Challan ITNS-280 for advance tax payments.",
    },
    {
      name: "CBDT FAQ on Advance Tax under IT Act 2025",
      url: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/tax-payments",
      description: "Official transitional clarification on advance tax obligations under the new Act.",
    },
  ],
};
