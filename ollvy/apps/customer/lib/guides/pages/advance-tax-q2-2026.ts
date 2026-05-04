// =============================================================================
// GUIDE PAGE: advance-tax-q2-2026
// File path: lib/guides/pages/advance-tax-q2-2026.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const advanceTaxQ22026: LearnPageConfig = {
  slug: "advance-tax-q2-2026",
  title: "Advance Tax Q2 for FY 2026-27: 45 Percent Cumulative by 15 September 2026",
  seoTitle: "Advance Tax Q2 2026 | 45% Due 15 September | Ollvy",
  seoDescription: "Pay cumulative 45% of estimated FY 2026-27 advance tax by 15 September 2026. Section 425 (IT Act 2025) interest for default. Computed and paid by Ollvy CAs starting Rs 999.",
  canonicalUrl: "https://www.ollvy.com/guides/advance-tax-q2-2026",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["advance-tax-payment", "itr-filing"],
  relatedLearnSlugs: ["advance-tax-explained"],
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "WHAT THE Q2 INSTALMENT REPRESENTS",
      body:
        "The Q2 cumulative target is 45 percent of estimated annual tax. Note this is cumulative, not incremental: by 15 September, your total advance tax payment for FY 2026-27 (Q1 + Q2 combined) should reach 45 percent of annual tax. If you paid 15 percent in Q1, you owe an additional 30 percent in Q2. If you skipped Q1, you owe the full 45 percent in Q2 (plus Section 425 interest on the Q1 shortfall).",
    },
    {
      id: "02",
      heading: "WHY Q2 IS WHEN MOST FREELANCERS FIRST FEEL ADVANCE TAX",
      body:
        "Q1 is in June, when most freelancers and small business owners are still ramping up income for the year and haven't built a clear forecast. By September, six months of revenue is in the books, and the annual income picture starts to clarify. This is when many file their first advance tax payment of the year, often catching up on Q1 in the same shot. The downside: 3 months of Section 425 interest on the Q1 shortfall is already locked in.",
    },
    {
      id: "03",
      heading: "THE CUMULATIVE SCHEDULE RECAP",
      body:
        "Cumulative is the operative word. Each quarter's target is the running total, not a fresh slice.",
      table: {
        headers: ["Quarter", "Due Date FY 2026-27", "Cumulative Target", "If You Skipped Earlier Quarters"],
        rows: [
          ["Q1", "15 June 2026", "15%", "N/A"],
          ["Q2", "15 September 2026", "45%", "Pay full 45% + 425 interest on Q1 shortfall"],
          ["Q3", "15 December 2026", "75%", "Pay full 75% + accumulated 425 interest"],
          ["Q4", "15 March 2027", "100%", "Pay full 100% + accumulated 425 interest"],
        ],
      },
    },
    {
      id: "04",
      heading: "SECTION 425 INTEREST CALCULATION FOR Q2 MISSES",
      body:
        "Example. Annual tax target Rs 2,00,000. Q1 target Rs 30,000 (15 percent). You paid Rs 18,000 in Q1, shortfall Rs 12,000. Q2 cumulative target Rs 90,000 (45 percent). You paid Rs 50,000 cumulatively by Q2, shortfall Rs 40,000. Interest under Section 425: on the Q1 shortfall (Rs 12,000 for 3 months at 1 percent) Rs 360, plus on the Q2 shortfall (Rs 40,000 for 3 months at 1 percent) Rs 1,200. Total Section 425 interest by 15 December: Rs 1,560. The interest will keep accruing until the shortfalls are cleared.",
    },
    {
      id: "05",
      heading: "INCOME TAX ACT 2025 BRIDGE",
      body:
        "FY 2026-27 advance tax is governed by the Income Tax Act 2025, which came into force on 1 April 2026. Section 404 replaces Section 208 (liability), Section 424 replaces 234B (annual underpayment interest), and Section 425 replaces 234C (deferment interest). Substantive rules including 1 percent monthly rate, 90 percent threshold, and the 15/45/75/100 schedule are unchanged.",
    },
    {
      id: "06",
      heading: "REFORECASTING IN Q2",
      body:
        "Q2 is the right time to refresh your annual income estimate. Six months of actual data is in the books, and forecasts can be tightened materially. Common Q2 reforecast triggers:",
      bullets: [
        "Quarterly client billings clearer than April projections.",
        "Bonuses or stock vests received in May to August now confirmed.",
        "Capital gains from equity or property realised in the first half of the year.",
        "Updated salary projections for the second half of the year.",
        "Loss of expected income (lost a major client, deal collapsed).",
      ],
    },
    {
      id: "07",
      heading: "HOW TO PAY",
      body:
        "Same flow as Q1. Income Tax e-Filing Portal, e-Pay Tax, Advance Tax (100), AY 2027-28, current FY 2026-27. Save the challan acknowledgement (BSR code, challan serial number, date). The payment will reflect in your 26AS within 3 to 5 working days.",
    },
  ],
  faqs: [
    {
      q: "I missed Q1. How much do I owe in Section 425 interest?",
      a: "1 percent per month or part thereof on the Q1 shortfall, for 3 months (June to September). Example: Q1 target Rs 15,000, paid Rs 0, shortfall Rs 15,000, interest Rs 450 by 15 September. The interest stops accruing once you pay the shortfall (or close it via the Q2 cumulative payment).",
    },
    {
      q: "Should I pay 30 percent additional in Q2 or 45 percent cumulative?",
      a: "Cumulative 45 percent of annual tax is the right computation. If you paid 15 percent in Q1, the additional Q2 payment is 30 percent. If you skipped Q1, you pay the full 45 percent in Q2 (plus interest on Q1 default).",
    },
    {
      q: "I'll have a major capital gain in October. Should I include it in Q2?",
      a: "Not unless you've already realised it by 15 September. If the gain is reasonably unanticipated as of Q2, you can include it in Q3 instead with relief from Section 425 interest under the unanticipated capital gain rule, provided you pay by year-end.",
    },
    {
      q: "I'm a presumptive taxpayer (44AD / 44ADA). Do I pay 45 percent in Q2?",
      a: "No. Presumptive scheme filers are exempt from the quarterly schedule. Pay 100 percent in a single instalment by 15 March 2027. Q1, Q2, and Q3 don't apply to you.",
    },
    {
      q: "Can I just pay Q2 without computing it carefully?",
      a: "Possible but risky. Underpaying causes 425 interest to keep accruing on the shortfall. Overpaying ties up cash you'll only get back as a refund after filing your ITR (and waiting for processing). A 30-minute reforecast is usually worth it.",
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
      description: "e-Pay Tax module for advance tax challan payments.",
    },
  ],
};
