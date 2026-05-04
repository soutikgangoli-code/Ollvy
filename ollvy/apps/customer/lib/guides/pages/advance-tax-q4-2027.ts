// =============================================================================
// GUIDE PAGE: advance-tax-q4-2027
// File path: lib/guides/pages/advance-tax-q4-2027.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const advanceTaxQ42027: LearnPageConfig = {
  slug: "advance-tax-q4-2027",
  title: "Advance Tax Q4 for FY 2026-27: 100 Percent by 15 March 2027",
  seoTitle: "Advance Tax Q4 2027 | 100% Due 15 March | Section 424 | Ollvy",
  seoDescription: "Pay 100% of estimated FY 2026-27 advance tax by 15 March 2027. Avoid Section 424 (IT Act 2025) annual underpayment interest. Computed and paid by Ollvy CAs starting Rs 999.",
  canonicalUrl: "https://www.ollvy.com/guides/advance-tax-q4-2027",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["advance-tax-payment", "itr-filing"],
  relatedLearnSlugs: ["advance-tax-explained"],
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "WHAT THE Q4 INSTALMENT REPRESENTS",
      body:
        "Q4 cumulative target is 100 percent of assessed annual tax. By 15 March 2027, your total advance tax payment for FY 2026-27 should equal your full annual tax liability (with TDS and TCS credits applied). Q4 is the last chance to top up before Section 424 annual underpayment interest kicks in from 1 April 2027.",
    },
    {
      id: "02",
      heading: "WHY Q4 IS THE MOST IMPORTANT INSTALMENT",
      body:
        "Two reasons. First, the Section 424 rule is binary: if total advance tax payment is below 90 percent of assessed tax, the full year's 424 interest accrues from 1 April. If you're at 90 percent or above, Section 424 doesn't apply at all. So Q4 is your last opportunity to cross the 90 percent threshold and avoid a year's worth of compounding interest. Second, by Q4 the year's income picture is fully clear (or nearly so), so the estimation error is much smaller than at earlier quarters.",
    },
    {
      id: "03",
      heading: "THE 90 PERCENT THRESHOLD UNDER SECTION 424",
      body:
        "Section 424 (the IT Act 2025 successor to Section 234B) applies if 'the assessee, who is liable to pay advance tax under section 404, has failed to pay such tax or, where the advance tax paid by such assessee is less than ninety per cent of the assessed tax'. The interest is 1 percent per month or part thereof, computed on the difference between assessed tax and advance tax paid, from 1 April of the AY (i.e., 1 April 2027 for FY 2026-27) until the date of self-assessment tax payment.",
      table: {
        headers: ["Total Advance Tax Paid", "Section 424 Trigger", "Interest"],
        rows: [
          ["100% or more of assessed tax", "Not triggered", "Nil"],
          ["90% to 100% of assessed tax", "Not triggered", "Nil"],
          ["Below 90% of assessed tax", "Triggered", "1% per month from 1 April"],
        ],
      },
      note:
        "The 90 percent cushion is meant to absorb minor estimation errors. But once you fall below it, the interest applies on the entire shortfall (not just the gap below 90 percent), running from 1 April until self-assessment payment. Most chronic 424 hits come from skipping advance tax entirely and paying everything at ITR filing.",
    },
    {
      id: "04",
      heading: "PRESUMPTIVE TAXPAYERS PAY EVERYTHING HERE",
      body:
        "Section 44AD (small business) and Section 44ADA (professionals) filers, and their IT Act 2025 successors Section 60 and Section 61, have a special single-instalment rule. They are exempt from the Q1, Q2, Q3 schedule and pay 100 percent of advance tax in a single shot by 15 March. So Q4 is also the only advance tax deadline that matters for presumptive filers.",
    },
    {
      id: "05",
      heading: "INCOME TAX ACT 2025 BRIDGE",
      body:
        "FY 2026-27 advance tax is governed by the IT Act 2025. Section 404 (was 208) for liability, Section 424 (was 234B) for annual underpayment interest, Section 425 (was 234C) for deferment interest. Substantive rules unchanged. Self-assessment tax under Section 140 of the new Act (was 140A in the 1961 Act) continues to govern any residual tax paid at ITR filing.",
    },
    {
      id: "06",
      heading: "FINAL ESTIMATION CHECKLIST FOR Q4",
      body:
        "By 15 March, your annual income should be near-final. Run a tight estimation that accounts for:",
      bullets: [
        "Salary (annual gross including any bonuses paid or accrued before 31 March).",
        "Business or professional income, accrual basis, including invoices billed but not yet received.",
        "All capital gains realised between 1 April 2026 and 15 March 2027 (and reasonably foreseeable gains expected by 31 March).",
        "Rental income for the full FY 2026-27 (including any unreceived rent for March).",
        "Interest income (actual + accrued, including FD interest computed but not paid out).",
        "Dividend income for the full FY.",
        "Deduct: Standard deduction Rs 75,000 (new regime) / Rs 50,000 (old regime), 80C / 80D / others under old regime, Section 87A rebate up to Rs 60,000 (new regime if income up to Rs 12L).",
        "Less: Total TDS and TCS credits expected for the year (from 26AS reconciliation).",
        "Less: Advance tax already paid in Q1, Q2, Q3.",
        "The residual amount is the Q4 payment.",
      ],
    },
    {
      id: "07",
      heading: "HOW TO PAY",
      body:
        "Same flow as earlier quarters. Income Tax e-Filing Portal, e-Pay Tax, Advance Tax (100), AY 2027-28. Save the challan acknowledgement (BSR code, challan serial number, date of payment). The payment must be reflected in 26AS before ITR filing in July, which usually takes 3 to 5 working days from challan date.",
      note:
        "If you realise on 15 March itself that you've under-estimated, paying the top-up by end-of-day clears the Q4 obligation. Banks typically allow same-day RTGS or net banking until 6 PM IST, with NEFT cut-off varying.",
    },
  ],
  faqs: [
    {
      q: "How do I know if I've crossed the 90 percent Section 424 threshold?",
      a: "Estimate your final FY 2026-27 tax (slabs applied to total income, less TDS / TCS credits). Compare against the total advance tax you've paid so far in Q1, Q2, Q3. If advance tax is at least 90 percent of estimated annual tax, you're safe from 424. Below 90 percent, plan a Q4 top-up to cross the threshold.",
    },
    {
      q: "I'm a presumptive taxpayer (44AD / 44ADA). Q4 is my only advance tax deadline?",
      a: "Yes. Pay 100 percent of advance tax in a single shot by 15 March 2027. Q1, Q2, Q3 don't apply to presumptive scheme filers. Under the IT Act 2025, the presumptive scheme is at Section 60 (was 44AD) and Section 61 (was 44ADA).",
    },
    {
      q: "What happens if I pay 92 percent in advance tax and 8 percent at ITR filing?",
      a: "Section 424 doesn't apply (you're above 90 percent). The 8 percent residual is paid as self-assessment tax under Section 140 (was 140A) at ITR filing time, with no interest implication. This is the cleanest cadence: stay above 90 percent in advance tax, settle the rest at ITR filing.",
    },
    {
      q: "Can I pay Q4 by year-end (31 March) instead of 15 March?",
      a: "No, the deadline is 15 March 2027. Payments between 16 March and 31 March attract Section 425 interest on the Q4 shortfall (1 percent for one month, since the next event is the year-end). Payments after 31 March count as self-assessment tax and trigger Section 424 if you fall below 90 percent.",
    },
    {
      q: "I forecast my year wrong and over-paid in Q4. What now?",
      a: "Excess advance tax becomes a refund at ITR filing. Section 244A pays you 0.5 percent per month interest from 1 April 2027 until refund credit. So over-payment isn't disastrous, just less efficient than getting the estimate right.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025, Section 424",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Annual underpayment interest provision (the IT Act 2025 successor to Section 234B of the 1961 Act).",
    },
    {
      name: "Income Tax Act 2025, Section 425",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Quarterly deferment interest provision (the IT Act 2025 successor to Section 234C).",
    },
    {
      name: "Income Tax Act 2025, Section 404",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Liability to pay advance tax (the IT Act 2025 successor to Section 208).",
    },
    {
      name: "Income Tax e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "e-Pay Tax module for advance tax payments.",
    },
  ],
};
