// =============================================================================
// GUIDE PAGE: llp-form-11-2027
// File path: lib/guides/pages/llp-form-11-2027.ts
// LLP Form 11 annual return for FY 2026-27, due 30 May 2027 under Rule 25(1)
// of the LLP Rules 2009. Follows the llp-form-8-2026 pattern.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const llpForm112027: LearnPageConfig = {
  slug: "llp-form-11-2027",
  title: "LLP Form 11 Annual Return Filing (FY 2026-27): Due 30 May 2027",
  seoTitle: "LLP Form 11 Filing 2027 | Due 30 May | FY 2026-27 | Ollvy",
  seoDescription:
    "Every LLP must file Form 11 annual return for FY 2026-27 by 30 May 2027. Late fees are multiplier-based with no upper cap. Dormant LLPs file too.",
  canonicalUrl: "https://www.ollvy.com/guides/llp-form-11-2027",
  lastReviewed: "July 2026",
  category: "ROC Filing",
  relatedServiceSlugs: ["mca-annual-filing", "llp-incorporation"],
  relatedLearnSlugs: [
    "llp-form-8-2026",
    "dpt-3-2027",
    "pvt-ltd-vs-llp",
    "business-itr-2027",
  ],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT FORM 11 IS AND WHO MUST FILE",
      body:
        "Form 11 is the LLP's annual return: a snapshot of the partners, designated partners, and their contributions as on 31 March, filed under Section 35 of the LLP Act 2008 read with Rule 25(1) of the LLP Rules 2009. For FY 2026-27 (year ended 31 March 2027), it is due 30 May 2027. Every LLP on the register files it, with no exemption for size, turnover, or activity. An LLP with zero revenue files. An LLP incorporated in February 2027 that never opened a bank account files. Form 11 is the partner-registry half of LLP annual compliance; the financial half is Form 8, due 30 October 2027 for the same year.",
    },
    {
      id: "02",
      heading: "WHY 30 MAY: THE RULE 25(1) CLOCK",
      body:
        "Rule 25(1) requires the annual return within 60 days of the close of the financial year. Every LLP's financial year under the LLP Act runs 1 April to 31 March, so 60 days from 31 March 2027 lands on 30 May 2027. There is no AGM concept for LLPs and no extension mechanism tied to one: the date is fixed by the rule, and unlike companies, LLPs get no CCFS-style condonation scheme for waived additional fees. What you file late, you pay for in full at the multiplier rates.",
    },
    {
      id: "03",
      heading: "WHAT GOES INTO FORM 11",
      body:
        "Form 11 is a registry return, not a financial statement. It captures:",
      bullets: [
        "Total number of partners and designated partners as on 31 March 2027, with DPIN/DIN details.",
        "Total contribution received from all partners, and each partner's individual contribution obligation and receipt.",
        "Partner changes during FY 2026-27: admissions, resignations, cessations, with dates.",
        "Particulars of penalties or compounding of offences during the year, if any.",
        "Whether any partner is a partner in other LLPs or a director in companies: LLPs where partners hold positions in more than a threshold number of entities disclose the detail in an attachment.",
        "The turnover bracket declaration (used by MCA for the certification requirement below).",
      ],
    },
    {
      id: "04",
      heading: "WHO SIGNS AND WHEN A CS CERTIFICATION IS NEEDED",
      body:
        "Form 11 is digitally signed by a designated partner using a Class 3 DSC. A second layer applies to larger LLPs: where total contribution exceeds Rs 50 lakh or turnover exceeds Rs 5 crore, the form must also be certified by a Company Secretary in whole-time practice. Below both thresholds, the designated partner's signature alone completes the form. Getting this wrong is a common rejection cause: an LLP that crossed Rs 5 crore turnover during FY 2026-27 cannot self-certify even if contribution is tiny.",
    },
    {
      id: "05",
      heading: "FILING FEE STRUCTURE",
      body:
        "The government fee on Form 11 is based on total partner contribution, mirroring the Form 8 structure:",
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
    },
    {
      id: "06",
      heading: "PENALTY FOR LATE FILING: MULTIPLIERS, NO CAP",
      body:
        "The LLP (Amendment) Rules 2022, effective 1 April 2022, replaced the old flat Rs 100 per day late fee with a multiplier structure tied to the delay period and to whether the LLP qualifies as a Small LLP under Section 2(1)(ta) (contribution up to Rs 25 lakh AND turnover up to Rs 40 lakh). The small-LLP slabs are gentler, but neither track has an upper cap once the per-day component starts:",
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
        "These additional fees stack on top of the normal filing fee. A non-small LLP that files Form 11 a year and a half late pays 50x the base fee plus Rs 20 for every day beyond 360, and the meter keeps running until filing.",
    },
    {
      id: "07",
      heading: "DESIGNATED PARTNER LIABILITY BEYOND THE LATE FEE",
      body:
        "The additional fee is the automatic cost; it is not the only one. Section 35 read with the penalty framework of the LLP (Amendment) Act 2021 exposes the LLP and its designated partners to adjudicated penalties for continuing default, with Section 76A providing the adjudication machinery (with reduced caps for Small LLPs and start-up LLPs). Separately, a non-compliant filing record has practical costs: banks and investors pull the MCA master data during diligence, an LLP with overdue annual filings cannot be closed through the strike-off route until filings are made up, and persistent defaulters invite ROC notices to the designated partners personally.",
    },
    {
      id: "08",
      heading: "FORM 11 vs FORM 8 vs ITR: THE FY 2026-27 LLP CALENDAR",
      body:
        "Three separate annual obligations, three different deadlines, none substituting for another:",
      table: {
        headers: ["Filing", "What It Covers", "Due Date FY 2026-27", "Provision"],
        rows: [
          ["Form 11", "Partner registry, contributions, changes", "30 May 2027", "Section 35 LLP Act, Rule 25(1)"],
          ["Form 8", "Financial statements, solvency declaration", "30 October 2027", "Section 34 LLP Act"],
          ["ITR-5", "Income tax return of the LLP", "31 August 2027 (non-audit, per Budget 2026-27 staggering) / 31 October 2027 (audit)", "Income Tax Act 2025"],
        ],
      },
      note:
        "Note the ITR change: from tax year 2026-27, non-audit LLPs file ITR-5 by 31 August, not 31 July. The Form 11 and Form 8 dates are unchanged.",
    },
    {
      id: "09",
      heading: "COMMON FORM 11 MISTAKES",
      body:
        "The rejections and resubmissions we see cluster around a few repeat errors:",
      bullets: [
        "Contribution figures not matching Form 8. The total contribution in Form 11 for FY 2026-27 must reconcile with what Form 8 reports for the same year; MCA cross-checks the pair.",
        "Partner changes filed in Form 11 but never notified through Form 4. Form 11 reports the changes; Form 4 is the event filing that should have happened within 30 days of each change. Filing 11 exposes the missed 4s.",
        "Contribution reported as the committed amount instead of the amount actually received. Form 11 asks for both; conflating them misstates the return.",
        "Missing CS certification after crossing Rs 50 lakh contribution or Rs 5 crore turnover during the year.",
        "Waiting for the tax audit or books to close. Form 11 needs no financials, so there is nothing to wait for; it can be filed in April.",
      ],
    },
    {
      id: "10",
      heading: "HOW TO FILE, PRACTICALLY",
      body:
        "Form 11 is filed on the MCA V3 portal as a web form. The realistic sequence for a clean 30 May 2027 filing:",
      bullets: [
        "April 2027: confirm the partner register is current; file any pending Form 4 for partner changes that happened during FY 2026-27.",
        "Confirm both designated partners' DSCs are valid and DPINs are active (a lapsed DIR-3 KYC blocks signing).",
        "Pull contribution figures as on 31 March 2027 from the capital accounts.",
        "File in early May; the MCA portal predictably slows in the last week of May as lakhs of LLPs converge on the same deadline.",
        "Save the SRN and the paid challan; Form 8 preparation in October reuses the same contribution numbers.",
      ],
    },
  ],
  faqs: [
    {
      q: "Our LLP had zero transactions in FY 2026-27. Do we still file Form 11?",
      a: "Yes. There is no NIL exemption for annual returns under the LLP Act. A dormant LLP files Form 11 by 30 May 2027 (and Form 8 by 30 October 2027) like any other. If the LLP has no future, filing and then applying for strike-off is cheaper than accumulating uncapped multiplier fees year after year.",
    },
    {
      q: "What does missing 30 May 2027 actually cost us?",
      a: "It depends on delay length and size. A Small LLP with Rs 1 lakh contribution filing 20 days late pays Rs 50 base plus Rs 100 additional (2x). The same LLP filing 8 months late pays 15x. A non-small LLP beyond 360 days pays 50x plus Rs 20 per further day, uncapped. There is no condonation scheme for LLPs, so nothing gets waived later.",
    },
    {
      q: "A partner resigned in January 2027 but we never filed Form 4. Can we still file Form 11?",
      a: "File Form 4 first (with its own late fee), then Form 11 reflecting the cessation. Filing Form 11 with a partner list that contradicts the registry, or one that silently drops a partner never formally ceased, creates a mismatch that surfaces at the next filing or in diligence. Clean the event filings before the annual return.",
    },
    {
      q: "Do we need a CA or CS to file Form 11?",
      a: "A CS in whole-time practice must certify only if contribution exceeds Rs 50 lakh or turnover exceeds Rs 5 crore. Below both thresholds, a designated partner signs with a DSC and no professional certification is mandatory, though most LLPs have a professional prepare it because the contribution and partner-change fields are where errors happen.",
    },
    {
      q: "Is Form 11 needed if we incorporated in March 2027?",
      a: "Yes, for the stub period. An LLP incorporated on any date up to 31 March 2027 existed during FY 2026-27 and files Form 11 by 30 May 2027 covering the period from incorporation. Only LLPs incorporated on or after 1 April 2027 have their first Form 11 due 30 May 2028.",
    },
    {
      q: "Can the 30 May 2027 deadline get extended?",
      a: "MCA has occasionally extended LLP filing dates or waived fees in exceptional years, but 30 May has held as the normal Form 11 date. Plan for 30 May 2027; if MCA notifies a change, this page will be updated. Banking on an extension against an uncapped per-day fee is a bad trade.",
    },
    {
      q: "Does filing Form 11 satisfy our income tax filing?",
      a: "No. Form 11 goes to the Registrar under the LLP Act; the ITR-5 goes to the income tax department under the Income Tax Act 2025. For FY 2026-27 the ITR-5 is due 31 August 2027 for non-audit LLPs and 31 October 2027 for audit cases. All three of Form 11, Form 8, and ITR-5 are independently mandatory.",
    },
  ],
  sources: [
    {
      name: "Limited Liability Partnership Act 2008, Section 35",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory basis for the LLP annual return.",
    },
    {
      name: "Limited Liability Partnership Rules 2009, Rule 25(1)",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "60-day filing window from financial year close, and Form 11 contents and certification thresholds.",
    },
    {
      name: "LLP (Amendment) Rules 2022",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Multiplier-based additional fee structure for late LLP filings, effective 1 April 2022, with reduced slabs for Small LLPs.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for Form 11 submission.",
    },
  ],
};
