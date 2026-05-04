// =============================================================================
// GUIDE PAGE: advance-tax-explained
// File path: lib/guides/pages/advance-tax-explained.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const advanceTaxExplained: LearnPageConfig = {
  slug: "advance-tax-explained",
  title: "Advance Tax in India: Who Pays, When, and How Much",
  seoTitle: "Advance Tax India 2026 | Schedule, Calculation, Sections 234B/234C | Ollvy",
  seoDescription:
    "Complete guide to advance tax in India. When it applies, the 15/45/75/100 quarterly schedule, Section 234B and 234C interest, calculation logic, and exemptions. By Ollvy CAs.",
  canonicalUrl: "https://www.ollvy.com/guides/advance-tax-explained",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["advance-tax-payment", "individual-itr-filing", "business-itr-filing"],
  relatedLearnSlugs: [
    "which-itr-form-should-i-use",
    "tds-on-rent-194i-194ib",
    "tds-on-property-purchase-194ia",
  ],
  ctaServiceSlug: "advance-tax-payment",
  ctaSecondarySlug: "individual-itr-filing",
  tool: {
    type: "calculator",
    name: "Do I owe advance tax?",
    description:
      "Quick check: enter your expected annual income, deductions and TDS. We'll tell you whether advance tax applies and the four quarterly amounts.",
  },
  sections: [
    {
      id: "01",
      heading: "WHAT ADVANCE TAX REALLY IS",
      body:
        "Income tax in India is meant to be paid as you earn. Salaried employees pay through TDS month by month. Everyone else pays through advance tax, in four quarterly installments through the year. Wait until 31 July to pay it all in one go and the law treats you as having underpaid for nine months, charging you interest at 1% per month for the privilege. So advance tax isn't an optional smoothing mechanism, it's the default mode of paying tax on non-salary income.",
    },
    {
      id: "02",
      heading: "WHO MUST PAY ADVANCE TAX",
      body:
        "Section 208 of the Income Tax Act applies to every taxpayer (individual, HUF, firm, LLP, company) whose total tax liability for the year, after subtracting TDS already deducted, exceeds Rs 10,000. The threshold is per-PAN, so if you run a Pvt Ltd, the company has its own threshold separate from yours.",
      bullets: [
        "Salaried employees with only TDS-covered income usually don't need to pay extra.",
        "Salaried employees with side income (freelance, capital gains, rent, interest) often do.",
        "Resident senior citizens (60+) who don't have business or professional income are completely exempt.",
        "Companies, LLPs, firms and partnerships have no exemption regardless of size.",
      ],
    },
    {
      id: "03",
      heading: "THE FOUR-QUARTER SCHEDULE",
      body:
        "Section 211 sets out the cumulative percentages by each due date. These are cumulative targets for tax already paid as advance tax, not separate per-quarter slices.",
      table: {
        headers: ["Installment", "Due Date", "Cumulative target", "Per-quarter incremental"],
        rows: [
          ["Q1", "15 June", "15% of annual tax", "15%"],
          ["Q2", "15 September", "45% of annual tax", "30%"],
          ["Q3", "15 December", "75% of annual tax", "30%"],
          ["Q4", "15 March", "100% of annual tax", "25%"],
        ],
      },
      note:
        "Presumptive scheme users under Section 44AD or 44ADA pay all 100% of advance tax in a single installment on or before 15 March.",
    },
    {
      id: "04",
      heading: "HOW TO CALCULATE THE ANNUAL TARGET",
      body:
        "The headline number is your projected annual tax liability for the year, computed under whichever regime (old or new) you'll use at ITR. Take it step by step.",
      bullets: [
        "Estimate total income from all heads (salary, business, capital gains, house property, other sources).",
        "Apply deductions you'll actually claim under the chosen regime.",
        "Compute tax using the slabs of the chosen regime, add cess and surcharge.",
        "Subtract TDS already deducted by employers, banks, customers, brokers.",
        "Subtract MAT/AMT credit and other prepayments.",
        "What's left is your advance tax target. If under Rs 10,000, you don't need to pay.",
      ],
    },
    {
      id: "05",
      heading: "SECTION 234C: INTEREST FOR LATE INSTALLMENTS",
      body:
        "If you fall short of any quarterly target, Section 234C charges 1% per month for three months on the shortfall (1% per month for one month for the Q4 shortfall). So a missed Q1 installment of Rs 1,00,000 attracts Rs 3,000 of 234C interest. A missed Q2 installment of Rs 1,00,000 attracts another Rs 3,000. The interest pots are independent and they all show up at ITR time.",
      note:
        "Capital gains and dividend income that couldn't reasonably have been anticipated get a 234C carve-out. The relief shifts the tax to the next-quarter installment without 234C, provided the residual installment is paid in full.",
    },
    {
      id: "06",
      heading: "SECTION 234B: INTEREST FOR YEAR-END SHORTFALL",
      body:
        "Section 234B is the bigger sibling. It applies if total advance tax paid by 31 March is below 90% of the final tax liability. Once triggered, interest at 1% per month runs from 1 April of the following year until the residual is paid as self-assessment with ITR. So if you finally settle on 31 July, that's four months of 234B interest. Settle on 31 March of next year, that's twelve months. The trigger is binary, the interest is continuous.",
    },
    {
      id: "07",
      heading: "HOW TO ACTUALLY PAY",
      body:
        "Advance tax is paid using Challan ITNS-280 on the income tax e-filing portal or the e-Pay Tax module. The minor head matters: 100 for advance tax, 300 for self-assessment, 400 for tax on regular assessment. Picking the wrong minor head is the most common operational error and it can cause the payment to not show up against the right liability.",
      bullets: [
        "Pick PAN, assessment year (e.g., 2027-28 for FY 2026-27), nature of payment (Income Tax other than companies, or Tax on Companies).",
        "Pick minor head 100 for advance tax.",
        "Pay via net banking, debit card, RTGS or NEFT.",
        "Save the challan PDF. The challan number (CIN) is the only proof of payment until it shows up in Form 26AS or AIS.",
      ],
    },
    {
      id: "08",
      heading: "COMMON FOUNDER MISTAKES",
      body:
        "We see the same mistakes every year, and they all compound at ITR. Avoiding them is mostly procedural.",
      bullets: [
        "Treating TDS as the only obligation: salary TDS rarely covers freelance income, capital gains or business profit.",
        "Underestimating in April based on last year's numbers when this year is clearly different.",
        "Forgetting to factor in capital gains from a December exit before the 15 December installment.",
        "Picking minor head 300 (self-assessment) by mistake when the year hasn't ended yet.",
        "Paying everything at Q4 thinking 234C unwinds. It doesn't. The earlier interest pots stay.",
      ],
    },
    {
      id: "09",
      heading: "EXEMPTIONS AND SPECIAL CASES",
      body:
        "A few categories of taxpayers don't pay advance tax in the regular way.",
      bullets: [
        "Resident senior citizens (60+) without business or professional income: fully exempt.",
        "Presumptive scheme (44AD/44ADA): single installment by 15 March instead of four.",
        "Salaried employees with no other income: TDS handles it, no separate advance tax needed.",
        "Capital gains arising late in the year: Section 234C relief if 'not reasonably anticipated'.",
      ],
    },
    {
      id: "10",
      heading: "INCOME TAX ACT 2025 BRIDGE",
      body:
        "From 1 April 2026, the Income Tax Act 2025 replaces the 1961 Act. CBDT has clarified that advance tax obligations and interest defaults that arose during FY 2025-26 continue to be governed by the 1961 Act, since both the obligation and any default occurred before the new Act commenced. From FY 2026-27 onwards, the corresponding 2025 Act sections take over with substantive rules unchanged.",
      table: {
        headers: ["1961 Act (FY 2025-26 and earlier)", "2025 Act (FY 2026-27 onwards)", "Subject"],
        rows: [
          ["Section 208", "Section 404", "Liability to pay advance tax (Rs 10,000 threshold)"],
          ["Section 211", "Same framework, tabular form", "Quarterly schedule (15/45/75/100)"],
          ["Section 234A", "Section 423", "Interest for late filing of return"],
          ["Section 234B", "Section 424", "Interest for default in payment of advance tax"],
          ["Section 234C", "Section 425", "Interest for deferment of advance tax instalments"],
        ],
      },
      note:
        "The 1% per month interest rate, the 90 percent threshold for 234B/424, and the 15/45/75/100 cumulative schedule all carry forward unchanged. Only the section number on any order or notice changes for FY 2026-27 onwards. Self-assessment tax under Section 140A of the 1961 Act continues to govern payment for income earned in FY 2025-26, even if the actual payment is made on or after 1 April 2026.",
    },
  ],
  faqs: [
    {
      q: "What if my income is irregular and hard to estimate?",
      a: "Advance tax is computed on a 'reasonable estimate'. We update the estimate each quarter using YTD actuals. The law accepts that estimates change, the only test is whether your final-year numbers came in above 90% of your cumulative advance tax payments. As long as you pay roughly in line with how income is unfolding, 234C and 234B exposure stays small.",
    },
    {
      q: "Do I have to pay advance tax on capital gains immediately?",
      a: "Section 234C provides relief for capital gains that couldn't reasonably have been anticipated. The tax on such gains gets shifted to the residual installment of the same quarter (or the next quarter if the gain occurred near a quarter-end). The relief is conditional on actually paying that installment in full.",
    },
    {
      q: "What's the difference between advance tax and self-assessment tax?",
      a: "Advance tax is paid during the year (15 June, 15 September, 15 December, 15 March), with minor head 100. Self-assessment tax is paid after FY end with ITR if there's a residual liability after TDS and advance tax, with minor head 300. They're the same money, the difference is timing and label.",
    },
    {
      q: "Can foreign income be subject to advance tax?",
      a: "Yes. Indian residents are taxable on worldwide income, so foreign salary, dividend, capital gains and rental income are all included in advance tax computations. DTAA benefits apply at the credit stage, not at the gross income stage.",
    },
    {
      q: "I'm a freelance designer with TDS at 10%. Why do I still owe advance tax?",
      a: "TDS at 10% covers exactly that, 10% of gross. If your slab rate is 30%, the residual 20% is your responsibility, paid as advance tax during the year and self-assessment after. The lower the TDS rate vs your slab, the larger the advance tax you owe.",
    },
    {
      q: "Can I pay advance tax in cash?",
      a: "No. Advance tax must be paid digitally through the e-Pay Tax module or net banking. Cash payments at bank counters were phased out for direct taxes some years ago.",
    },
  ],
  sources: [
    {
      name: "Section 208 to 211, Income Tax Act 1961",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Liability and schedule for advance tax payments (governs FY 2025-26 and earlier).",
    },
    {
      name: "Section 234B and 234C, Income Tax Act 1961",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Interest provisions for default in advance tax (governs FY 2025-26 and earlier).",
    },
    {
      name: "Section 404, 423, 424, 425, Income Tax Act 2025",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Renumbered advance tax and interest provisions applicable from FY 2026-27 onwards. Substantive rates and thresholds unchanged.",
    },
    {
      name: "Income Tax Department FAQ on Tax Payments under IT Act 2025",
      url: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/tax-payments",
      description: "Official transitional clarification on which Act governs advance tax obligations and interest defaults during the FY 2025-26 to FY 2026-27 transition.",
    },
    {
      name: "Income Tax e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "e-Pay Tax module and Challan ITNS-280.",
    },
  ],
};
