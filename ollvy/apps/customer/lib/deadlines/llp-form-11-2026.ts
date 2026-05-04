// =============================================================================
// EXEMPLAR DEADLINE PAGE: llp-form-11-2026
// File path: lib/deadlines.ts (or wherever DeadlineConfig objects live)
//
// This is one of three exemplars showing the unified schema. Use this as the
// template for tone, depth, and section structure when migrating the
// remaining 14 deadline pages.
// =============================================================================

import type { DeadlineConfig } from "../deadlines";

export const llpForm112026: DeadlineConfig = {
  // ====== SERVICE/MARKETING FIELDS ======
  slug: "llp-form-11-2026",
  serviceSlug: "llp-annual-filing",
  bookingHref: "/book/llp-form-11",
  serviceName: "LLP Form 11 (Annual Return) Filing",
  eventLabel: "LLP Form 11 filing for FY 2025-26",
  dueDate: "2026-05-30",
  postDeadlineMessage:
    "The 30 May 2026 deadline for LLP Form 11 has passed. Additional fees now stack as a multiple of the normal filing fee under the LLP (Amendment) Rules 2022. File immediately to stop the multiplier from escalating and contact us for fast-tracked submission.",
  heroTagline:
    "LLP Form 11 due 30 May 2026. Late filing fees compound as a multiplier of the base fee under the LLP (Amendment) Rules 2022. We'll have it filed in 5 days.",
  purposeLabel: "FILE YOUR LLP ANNUAL RETURN",
  eligibilityLabel:
    "Every LLP registered in India under the LLP Act 2008, regardless of turnover, transactions, or operational status. Even dormant or zero-transaction LLPs must file.",
  urgencyLine:
    "Form 11 is due within 60 days of the close of the financial year, which means 30 May 2026 for FY 2025-26. Under the LLP (Amendment) Rules 2022, late filing fees stack as a multiple of the base filing fee (1x to 25x for Small LLPs, 1x to 50x for other LLPs) depending on the period of delay, and beyond 360 days an additional Rs 10 per day (Small LLP) or Rs 20 per day (other LLP) accrues.",
  penaltyLine:
    "Additional filing fees under the LLP (Amendment) Rules 2022 stack as a multiplier of the base filing fee, with separate slabs for Small LLPs and other LLPs. Beyond 360 days, an additional per-day component accrues. Persistent non-filing across multiple years can lead to ROC strike-off under Rule 37 of the LLP Rules 2009.",
  filingCount: 1,
  ollvyFee: 999,
  govtFee: 50,
  slaDays: 5,
  seoTitle: "LLP Form 11 Filing 2026 | Due 30 May | Annual Return | Ollvy",
  seoDescription:
    "Every LLP must file Form 11 annual return by 30 May 2026 for FY 2025-26. Late filing attracts multiplier-based additional fees under the LLP (Amendment) Rules 2022. Ollvy files in 5 days starting Rs 999. Section 35 LLP Act 2008.",
  canonicalUrl: "https://www.ollvy.com/llp-form-11-2026",
  documentTab: "documents",
  documentHeading: "What we'll need from you",
  risks: [
    {
      title: "Multiplier-based additional fees under LLP (Amendment) Rules 2022",
      body:
        "Effective 1 April 2022, late filing of LLP Form 11 attracts additional fees as a multiple of the base filing fee, not a flat per-day rate. The multiplier escalates with delay: 1x within 15 days, 2x to 25x for a Small LLP and up to 50x for other LLPs as the delay extends. Beyond 360 days, an extra Rs 10 per day (Small LLP) or Rs 20 per day (other LLP) accrues on top.",
    },
    {
      title: "Section 76A statutory penalty on persistent default",
      body:
        "In addition to the additional filing fees, Section 76A of the LLP Act read with the LLP (Amendment) Act 2021 provides for adjudication of penalties for non-compliance, with reduced penalty caps for Small LLPs. The adjudicating officer (a Registrar-rank official) can pass a separate penalty order after notice and hearing.",
    },
    {
      title: "Designated partner disqualification",
      body:
        "Continuous non-filing of Form 11 for multiple years can lead to disqualification of the designated partners from holding similar roles in any other LLP or company. This is a personal-liability consequence that follows the partner, not just the LLP.",
    },
    {
      title: "Inactive status and strike-off risk under Rule 37",
      body:
        "Under Rule 37 of the LLP Rules 2009, the Registrar may strike off an LLP that has not filed Form 8 and Form 11 for two consecutive financial years, treating it as defunct. Reviving a struck-off LLP requires a separate restoration application with its own fees and timelines.",
    },
  ],
  testimonials: [
    {
      name: "Karthik R.",
      role: "Designated partner, Bengaluru consulting LLP",
      quote:
        "I had no idea Form 11 had to be filed even when our LLP had zero revenue that year. Ollvy flagged it three weeks before the deadline and filed it for Rs 999. Saved me from the multiplier-based late fee structure.",
    },
    {
      name: "Aanya M.",
      role: "Designated partner, Mumbai design studio LLP",
      quote:
        "Smooth from start to finish. They asked for the partner contribution details, the DSC, and one phone confirmation. Filed in three days. SRN came through clean, no resubmission.",
    },
  ],

  // ====== EDUCATIONAL CONTENT FIELDS ======
  category: "Compliance",
  relatedServiceSlugs: ["llp-annual-filing", "llp-incorporation"],
  relatedLearnSlugs: ["dir-3-kyc-explained", "mca-annual-filing-aoc-4-mgt-7"],
  ctaSecondarySlug: "llp-incorporation",
  sections: [
    {
      id: "01",
      heading: "WHAT FORM 11 IS AND WHY EVERY LLP FILES IT",
      body:
        "Form 11 is the LLP's Annual Return. It captures who the partners are as on 31 March, how much each one has contributed, what changes happened during the year, and any penalties or compounding offences during the period. It's a partner-registry document, separate from the financial statements (which sit in Form 8). Section 35 of the LLP Act 2008 makes Form 11 mandatory for every LLP, with no exception for size, turnover, or activity. A dormant LLP with zero transactions still files. An LLP that started in March 2026 and only had partners on paper still files. The trigger is registration, not operation.",
    },
    {
      id: "02",
      heading: "WHEN IT IS DUE",
      body:
        "Form 11 is due within 60 days from the close of the financial year. Financial year for every LLP under the LLP Act runs 1 April to 31 March, so 60 days after 31 March is 30 May. For FY 2025-26 (year ended 31 March 2026), the deadline is 30 May 2026. There is no extension regime. Unlike companies under the Companies Act, LLPs cannot apply to the ROC for additional time on Form 11 except in extremely specific circumstances (orders of court, change of designated partner under medical incapacity, etc.).",
      note:
        "LLPs incorporated on or after 1 April 2026 are not required to file for FY 2025-26. Their first Form 11 obligation is for FY 2026-27, due 30 May 2027.",
    },
    {
      id: "03",
      heading: "WHAT GOES INTO THE FORM",
      body:
        "Form 11 captures the LLP's structural snapshot as on 31 March 2026 and a summary of changes during the year. The fields are:",
      bullets: [
        "LLPIN, name, registered office address.",
        "Total contribution from all partners (in rupees, as per the LLP agreement and any subsequent admissions).",
        "Number of partners and number of designated partners.",
        "Details of each partner: DPIN, name, address, profit-sharing ratio, contribution amount, and date of joining or change.",
        "List of any other LLPs or companies in which each partner holds a position.",
        "Summary of any changes in partners or designated partners during the year (additions, exits, name/address changes).",
        "Information on any penalties, compounding offences, or convictions involving the LLP or its partners during the year.",
      ],
    },
    {
      id: "04",
      heading: "WHO HAS TO SIGN AND CERTIFY",
      body:
        "Two designated partners must digitally sign Form 11 using their Class 3 DSCs. This is a hard requirement, the form cannot be filed with a single partner's signature even if the LLP has only two designated partners. If your LLP has only one DP currently, you must appoint a second one (and intimate via Form 4) before Form 11 can be filed. Additionally, certification by a practising Company Secretary is required if either of these is true:",
      bullets: [
        "Total partner contribution exceeds Rs 50 lakh as on 31 March 2026.",
        "Total turnover of the LLP exceeds Rs 5 crore during FY 2025-26.",
      ],
      note:
        "Smaller LLPs (under both thresholds) don't need a CS certificate but the form must still be signed by two DPs. The CS, where required, affixes a separate DSC for the certification component, this does not substitute for the DPs' signatures on the declaration.",
    },
    {
      id: "05",
      heading: "FILING FEE STRUCTURE",
      body:
        "The government filing fee on Form 11 is based on the total contribution of partners. The fee structure is:",
      table: {
        headers: ["Total Contribution", "Government Filing Fee"],
        rows: [
          ["Up to Rs 1 lakh", "Rs 50"],
          ["Rs 1 lakh to Rs 5 lakh", "Rs 100"],
          ["Rs 5 lakh to Rs 10 lakh", "Rs 150"],
          ["Rs 10 lakh to Rs 25 lakh", "Rs 200"],
          ["Rs 25 lakh to Rs 1 crore", "Rs 400"],
          ["Above Rs 1 crore", "Rs 600"],
        ],
      },
      note:
        "Most early-stage LLPs fall into the Rs 50 to Rs 200 bracket. The fee is small. The penalty for missing the deadline is what hurts.",
    },
    {
      id: "06",
      heading: "PENALTY FOR LATE FILING",
      body:
        "The LLP (Amendment) Rules 2022, effective 1 April 2022, replaced the earlier flat Rs 100 per day late fee with a multiplier-based structure tied to the period of delay and whether the LLP qualifies as a Small LLP under Section 2(1)(ta) of the LLP Act (contribution up to Rs 25 lakh and turnover up to Rs 40 lakh in the preceding FY, both conditions met). Additional filing fees stack on top of the normal filing fee as follows:",
      table: {
        headers: ["Period of Delay", "Small LLP", "Other than Small LLP"],
        rows: [
          ["Up to 15 days", "1x normal fee", "1x normal fee"],
          ["Beyond 15 days, up to 30 days", "2x normal fee", "2x normal fee"],
          ["Beyond 30 days, up to 60 days", "4x normal fee", "8x normal fee"],
          ["Beyond 60 days, up to 90 days", "6x normal fee", "12x normal fee"],
          ["Beyond 90 days, up to 180 days", "10x normal fee", "20x normal fee"],
          ["Beyond 180 days, up to 360 days", "15x normal fee", "30x normal fee"],
          ["Beyond 360 days", "25x normal fee + Rs 10 per day", "50x normal fee + Rs 20 per day"],
        ],
      },
      note:
        "This is in addition to the normal filing fee shown in Section 05 above. Separately, Section 76A of the LLP Act read with the LLP (Amendment) Act 2021 provides for adjudication penalties for non-compliance, with reduced caps for Small LLPs under Section 76A(3)(a). The CCFS 2026 condonation window covers Companies Act filings only, not LLP Act filings, so there is no current waiver scheme for LLP late fees.",
    },
    {
      id: "07",
      heading: "FORM 11 vs FORM 8: TWO SEPARATE FILINGS",
      body:
        "Founders sometimes assume Form 11 covers the financial reporting too. It doesn't. Form 11 is partner data only. Form 8 (Statement of Account and Solvency) covers the LLP's financials, balance sheet, P&L, and a solvency declaration. Form 8 is due separately by 30 October 2026. Both filings together complete the LLP's annual ROC compliance for FY 2025-26.",
      table: {
        headers: ["Filing", "What It Covers", "Due Date FY 2025-26", "Section"],
        rows: [
          ["Form 11", "Partner registry, contributions, changes", "30 May 2026", "Section 35, LLP Act"],
          ["Form 8", "Financials, balance sheet, P&L, solvency", "30 October 2026", "Section 34, LLP Act"],
          ["ITR-5", "Income tax return", "31 July 2026 (non-audit)", "Section 139, IT Act"],
        ],
      },
    },
    {
      id: "08",
      heading: "COMMON MISTAKES THAT TRIGGER REJECTION OR RESUBMISSION",
      body:
        "When clients come to us after a self-filed rejection, the cause is usually one of these:",
      bullets: [
        "Form 4 not filed for a partner change during the year. The data in Form 11 reflects the new partner, but MCA records still show the old partner. The portal flags the inconsistency and the form goes to defective queue.",
        "DSC of one of the DPs is expired. Always verify both DSCs are valid for at least 30 days before filing.",
        "DPIN and PAN name mismatch on the partner list. Even a missing initial triggers an objection.",
        "Total contribution number doesn't reconcile with the LLP agreement on file with ROC. If you've admitted a new partner mid-year and the LLP agreement wasn't updated, fix the agreement first.",
        "Filing in the last 48 hours before the deadline. The MCA21 portal predictably slows down or crashes in late May. File by 25 May to leave room for portal issues.",
      ],
    },
  ],
  faqs: [
    {
      q: "Our LLP had zero revenue last year. Do we still file Form 11?",
      a: "Yes. Form 11 is mandatory for every registered LLP regardless of revenue, transactions, or operational status. Even dormant LLPs file. The data is structural (partners, contribution) not financial, so 'no revenue' doesn't reduce the obligation. Skip it and the multiplier-based additional fee structure under the LLP (Amendment) Rules 2022 starts immediately and escalates with delay.",
    },
    {
      q: "Can a single designated partner sign Form 11?",
      a: "No. The form mandatorily requires DSCs of two designated partners. If your LLP has dropped to one DP, you must appoint a second one (file Form 4) before Form 11 can be submitted. The 30 May deadline doesn't extend on account of this, so plan ahead if you have a partner exit close to the deadline.",
    },
    {
      q: "What's the difference between Form 11 and Form 4?",
      a: "Form 4 is filed within 30 days of any partner change (admission, resignation, designation change). Form 11 is filed annually as a snapshot. So if a partner left in October 2025, you'd have filed Form 4 in November 2025, and the change is then reflected in Form 11 for FY 2025-26 filed in May 2026. Both are required if applicable, Form 4 isn't a substitute for Form 11.",
    },
    {
      q: "We applied for strike-off. Do we still file Form 11?",
      a: "Yes, until the ROC formally approves the strike-off and removes the LLP's name from the Official Gazette, the LLP remains a registered legal entity and all filings continue. In practice, the ROC won't even approve a strike-off application if there are pending Form 11 or Form 8 filings, so you have to clear them first.",
    },
    {
      q: "Can Form 11 be filed late under any condonation scheme?",
      a: "No. The Companies Compliance Facilitation Scheme (CCFS) 2026 covers Companies Act filings only, not LLP Act filings. There is no current scheme for waiver of LLP additional filing fees. The post-1 April 2022 multiplier-based fee structure under the LLP (Amendment) Rules 2022 must be paid in full at the time of filing. The MCA has occasionally announced limited LLP-specific schemes in the past, but none is open as of May 2026.",
    },
  ],
  lastReviewed: "May 2026",
  sources: [
    {
      name: "Limited Liability Partnership Act 2008, Section 35",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory basis for the LLP annual return filing requirement and the 60-day timeline.",
    },
    {
      name: "Limited Liability Partnership Rules 2009, Rule 25",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Detailed rules on Form 11, contents, certification thresholds, and fee structure.",
    },
    {
      name: "Limited Liability Partnership (Amendment) Rules 2022",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Notified by MCA on 11 February 2022, effective 1 April 2022. Substituted Annexure A of the LLP Rules 2009 to introduce the multiplier-based additional fee structure for late filings, with separate slabs for Small LLPs and other LLPs.",
    },
    {
      name: "LLP (Amendment) Act 2021, Section 76A",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Adjudication of penalties framework with reduced caps for Small LLPs and start-up LLPs.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for Form 11 submission.",
    },
    {
      name: "MCA Schedule of Fees for LLP Filings",
      url: "https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS_fees.html",
      description: "Government filing fee slabs based on partner contribution.",
    },
  ],
};
