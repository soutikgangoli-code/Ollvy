// =============================================================================
// GUIDE PAGE: advance-tax-q1-2027
// File path: lib/guides/pages/advance-tax-q1-2027.ts
// Advance tax Q1 for FY 2027-28 (Tax Year 2027-28): 15% by 15 June 2027 under
// the Income Tax Act 2025 advance tax provisions. Modelled on advance-tax-q1-2026.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const advanceTaxQ12027: LearnPageConfig = {
  slug: "advance-tax-q1-2027",
  title: "Advance Tax Q1 for FY 2027-28: 15 Percent by 15 June 2027",
  seoTitle: "Advance Tax Q1 2027 | 15% Due 15 June | FY 2027-28 | Ollvy",
  seoDescription:
    "Pay 15% of estimated FY 2027-28 tax by 15 June 2027 if liability exceeds Rs 10,000. Section 425 interest at 1% a month applies to any shortfall.",
  canonicalUrl: "https://www.ollvy.com/guides/advance-tax-q1-2027",
  lastReviewed: "July 2026",
  category: "Tax",
  relatedServiceSlugs: ["business-itr"],
  relatedLearnSlugs: [
    "advance-tax-explained",
    "advance-tax-q4-2027",
    "income-tax-act-2025-section-mapping",
    "business-itr-2027",
  ],
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "THE Q1 OBLIGATION IN ONE PARAGRAPH",
      body:
        "If your estimated total tax for FY 2027-28 (Tax Year 2027-28 under the new terminology), after TDS and TCS credits, exceeds Rs 10,000, you must pay at least 15 percent of it as advance tax by 15 June 2027. The obligation now lives in the advance tax chapter of the Income Tax Act 2025, Sections 404 to 408, which replaced Sections 207 to 211 of the 1961 Act. The threshold, the 15/45/75/100 schedule, and the 1 percent monthly interest for shortfalls all carry forward unchanged; only the section numbers on your challans and notices are new. This is the second advance tax cycle under the new Act, so by now the portal, the challan flow, and the interest computations all run natively on the 2025 Act numbering.",
    },
    {
      id: "02",
      heading: "WHO HAS TO PAY BY 15 JUNE 2027",
      body:
        "The net is wide, and the salaried-only crowd is the main group outside it:",
      bullets: [
        "Individuals and HUFs whose FY 2027-28 tax after TDS/TCS is estimated above Rs 10,000: freelancers, consultants, landlords with meaningful rent, investors with gains and dividends.",
        "All companies, regardless of size or profit; the Rs 10,000 threshold offers no practical shelter to a company with any taxable income.",
        "Firms, LLPs, AOPs, and BOIs on the same basis.",
        "Exempt: resident senior citizens (60+) with no business or professional income.",
        "Usually exempt in practice: salaried employees whose entire tax is covered by employer TDS under Section 392. A large bonus, ESOP exercise, or capital gain mid-year changes that.",
      ],
    },
    {
      id: "03",
      heading: "THE FY 2027-28 INSTALMENT CALENDAR",
      body:
        "Four cumulative instalments. Cumulative means the percentage is of the full year's tax paid to date, not an increment per quarter:",
      table: {
        headers: ["Instalment", "Due Date", "Cumulative Target"],
        rows: [
          ["Q1", "15 June 2027", "15% of estimated annual tax"],
          ["Q2", "15 September 2027", "45% of estimated annual tax"],
          ["Q3", "15 December 2027", "75% of estimated annual tax"],
          ["Q4", "15 March 2028", "100% of estimated annual tax"],
        ],
      },
      note:
        "Presumptive taxpayers under Sections 60 and 61 of the 2025 Act (the old 44AD and 44ADA schemes) skip the quarterly ladder entirely and pay 100 percent in a single instalment by 15 March 2028.",
    },
    {
      id: "04",
      heading: "INTEREST FOR MISSING OR SHORTING Q1",
      body:
        "A Q1 shortfall is not an offence; it is a priced borrowing. Section 425 of the 2025 Act (formerly 234C) charges 1 percent per month or part thereof on the amount by which your payment falls short of 15 percent, for the three months until the Q2 date. Example: estimated annual tax Rs 2,00,000, Q1 target Rs 30,000, amount paid nil. Interest is Rs 30,000 x 1% x 3 = Rs 900. Separately, if by year-end your total advance tax lands below 90 percent of the assessed tax, Section 424 (formerly 234B) charges 1 percent per month from 1 April 2028 until payment. Small individually, these compound into real money for lakhs-level tax bills paid late.",
      note:
        "A safe-harbour worth knowing: if Q1 payment reaches at least 12 percent of the eventual tax, Section 425 interest for that instalment is not charged. The same relaxation applies at Q2 for 36 percent.",
    },
    {
      id: "05",
      heading: "SECTION MAPPING: 1961 ACT TO 2025 ACT",
      body:
        "Notices, challans, and computations for FY 2027-28 quote the new sections. The working map:",
      table: {
        headers: ["1961 Act (legacy)", "2025 Act (current)", "Subject"],
        rows: [
          ["Sections 207-208", "Section 404", "Liability to pay advance tax, Rs 10,000 threshold"],
          ["Sections 209-211", "Sections 405-408", "Computation and instalment schedule"],
          ["Section 234A", "Section 423", "Interest for late return filing with unpaid tax"],
          ["Section 234B", "Section 424", "Interest for advance tax default (below 90%)"],
          ["Section 234C", "Section 425", "Interest for instalment deferment"],
          ["Sections 44AD / 44ADA", "Sections 60 / 61", "Presumptive schemes with the single 15 March instalment"],
        ],
      },
    },
    {
      id: "06",
      heading: "ESTIMATING FY 2027-28 TAX IN JUNE: A WORKING METHOD",
      body:
        "The Q1 estimate does not need to be perfect; it needs to be defensible and revised each quarter. A practical June 2027 routine:",
      bullets: [
        "Start from FY 2026-27 actuals (your tax year 2026-27 return is being prepared around the same time; its numbers are fresh).",
        "Adjust for known changes: contracts signed or lost, salary revisions, rental changes, planned asset sales.",
        "Compute tax on the estimate under your regime, subtract expected TDS/TCS for the year, and check the Rs 10,000 threshold.",
        "Pay 15 percent of the net figure by 15 June 2027.",
        "Re-estimate in September, December, and March with actual year-to-date income; the schedule is self-correcting because each instalment trues up to the cumulative target.",
      ],
    },
    {
      id: "07",
      heading: "CAPITAL GAINS AND OTHER UNPREDICTABLE INCOME",
      body:
        "Income you could not reasonably foresee at Q1 gets statutory relief: for capital gains and similar windfalls, paying the related tax in the instalment following the event (with the balance schedule intact) avoids Section 425 interest on the earlier instalments. A property sale in October 2027 does not retroactively make your June estimate short. What the relief does not cover is income you knew about and ignored; a vesting schedule fixed in April is not a surprise in December. Keep dated evidence of when the gain crystallised.",
    },
    {
      id: "08",
      heading: "HOW TO PAY",
      body:
        "Payment runs through e-Pay Tax on the income tax portal, and the credit reflects against your PAN in Form 168 within a few working days:",
      bullets: [
        "Log in at incometax.gov.in and open e-Pay Tax.",
        "Choose Advance Tax (100) as the payment type.",
        "Select the year: the portal for FY 2027-28 payments uses the Tax Year 2027-28 label under the new Act's terminology.",
        "Enter the amount, pay by net banking, UPI, or over-the-counter challan, and download the acknowledgement.",
        "Verify the credit in Form 168 (the renumbered 26AS) after 3 to 5 working days; a challan paid under the wrong year label is the most common self-inflicted mismatch.",
      ],
    },
    {
      id: "09",
      heading: "PRESUMPTIVE FILERS: YOUR ONLY DATE IS 15 MARCH 2028",
      body:
        "If you are in the Section 60 scheme (small business, turnover to Rs 2 crore, or Rs 3 crore at 95 percent digital receipts) or Section 61 (professionals, receipts to Rs 50 lakh, or Rs 75 lakh at 95 percent digital), the quarterly ladder does not apply. One instalment, 100 percent, by 15 March 2028. Miss that single date and Section 425 interest applies for the March-to-payment gap. The June date on this page is simply not yours, but check that you actually qualify for and have opted into the scheme rather than assuming it.",
    },
  ],
  faqs: [
    {
      q: "Is 15 June 2027 a hard deadline like an ITR due date?",
      a: "It is a statutory instalment date, but the consequence of missing it is interest, not a late fee or invalidity. Pay short and Section 425 charges 1 percent a month on the shortfall for three months. That is real money at scale but it is also just pricing; there is no separate penalty for a missed instalment honestly caught up later.",
    },
    {
      q: "My only income is salary. Do I need to do anything on 15 June 2027?",
      a: "Almost certainly not; employer TDS under Section 392 spreads your tax across the year and satisfies the advance tax mechanics. The exceptions worth a 10-minute check: sizeable interest or dividend income, rent, capital gains, or a side income your employer does not know about. If tax beyond TDS exceeds Rs 10,000 for the year, the schedule applies to you.",
    },
    {
      q: "How accurate does my June estimate have to be?",
      a: "Directionally right, revised quarterly. Interest is computed on shortfalls against the eventual actual tax, so a good-faith June estimate trued up in September and December keeps exposure minimal. The expensive pattern is ignoring the first three dates and paying everything in March, which stacks Section 425 across quarters and often Section 424 after year-end.",
    },
    {
      q: "Do the new Act's section numbers change anything about how much I pay?",
      a: "No. Sections 404 to 408 of the 2025 Act reproduce the old 207-211 framework: same Rs 10,000 threshold, same 15/45/75/100 schedule, same 1 percent monthly interest under Sections 424 and 425 (old 234B/234C). What changes is only the reference you will see on portal screens and any notices.",
    },
    {
      q: "I expect a large capital gain in FY 2027-28 but do not know when. How do I plan Q1?",
      a: "Exclude it from the June estimate. The law relieves instalment interest on income of this kind if you pay the related tax in the instalment after it arises. Pay Q1 on your predictable income, and when the gain lands, fold its tax into the next date. Document the transaction date; that is what supports the relief if questioned.",
    },
    {
      q: "We are a loss-making startup. Does the company still pay advance tax?",
      a: "Only if there is estimated tax to pay. A genuine projected loss means no advance tax. But check MAT-style minimum tax applicability under the new Act for your structure, and revisit the estimate each quarter: a stronger H2, a grant, or interest income can create a liability mid-year, and companies get no Rs 10,000 cushion in practice.",
    },
    {
      q: "What happens if I pay Q1 into the wrong year by mistake?",
      a: "The credit sits against the wrong period and your FY 2027-28 record shows a shortfall. Fix it through the challan correction mechanism on the portal (minor head and year corrections are allowed within prescribed windows) rather than paying twice. Check Form 168 a few days after every instalment so errors surface in June, not at filing time in 2028.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025, Sections 404 to 408 and 423 to 425",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Advance tax liability, computation, instalment schedule, and interest provisions under the new Act.",
    },
    {
      name: "Income Tax e-Filing Portal - e-Pay Tax",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Official channel for advance tax payment and challan records.",
    },
    {
      name: "CBDT guidance on the IT Act 2025 transition",
      url: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/tax-payments",
      description: "Transitional clarifications including section mapping for advance tax and interest.",
    },
  ],
};
