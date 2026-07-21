// =============================================================================
// GUIDE PAGE: llp-form-8-2026
// File path: lib/guides/pages/llp-form-8-2026.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const llpForm82026: LearnPageConfig = {
  slug: "llp-form-8-2026",
  title: "LLP Form 8 Statement of Account and Solvency Filing (FY 2025-26)",
  seoTitle: "LLP Form 8 Filing 2026 | Due 30 October | Ollvy",
  seoDescription: "Every LLP must file Form 8 (Statement of Account and Solvency) by 30 October 2026 for FY 2025-26. Audit needed if turnover above Rs 40L or contribution above Rs 25L. Multiplier-based late fees under LLP (Amendment) Rules 2022. Ollvy files in 7 days from Rs 2,499.",
  canonicalUrl: "https://www.ollvy.com/guides/llp-form-8-2026",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing", "llp-incorporation"],
  relatedLearnSlugs: ["dir-3-kyc-explained"],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT FORM 8 IS AND WHY EVERY LLP FILES IT",
      body:
        "Form 8 is the LLP's Statement of Account and Solvency. It captures the LLP's financial position as on 31 March, including the balance sheet, the statement of income and expenditure, and a written solvency declaration by the designated partners. Section 34 of the LLP Act 2008 makes Form 8 mandatory for every LLP, with no exemption for size, turnover, or activity. A dormant LLP files a NIL Form 8. An LLP that started in March 2026 with paper formation only still files. Form 8 is the financial half of LLP annual compliance, paired with Form 11 (the partner registry).",
    },
    {
      id: "02",
      heading: "WHEN IT IS DUE",
      body:
        "Form 8 is due within 30 days from the end of six months after the financial year close. Financial year for every LLP under the LLP Act runs 1 April to 31 March, so 30 days after 30 September is 30 October. For FY 2025-26 (year ended 31 March 2026), the deadline is 30 October 2026. Unlike Companies Act filings, there is no equivalent of the CCFS condonation scheme for LLPs, so the multiplier-based additional fees under the LLP (Amendment) Rules 2022 must be paid in full at the time of late filing.",
    },
    {
      id: "03",
      heading: "WHAT GOES INTO FORM 8",
      body:
        "Form 8 has two parts. Part A is the solvency declaration. Part B captures the financial statements.",
      bullets: [
        "Part A: Written declaration by designated partners that the LLP can pay its debts in full as they fall due in the normal course of business.",
        "Part B: Statement of Assets and Liabilities (balance sheet) as on 31 March 2026.",
        "Part B: Statement of Income and Expenditure (P&L) for FY 2025-26.",
        "Disclosure of any contingent liabilities not provided for.",
        "Declaration under MSMED Act 2006 (any outstanding dues to MSME suppliers beyond the prescribed window).",
        "Where statutory audit applies, the auditor's certification.",
      ],
    },
    {
      id: "04",
      heading: "AUDIT THRESHOLD",
      body:
        "Statutory audit by a practising chartered accountant is mandatory if the LLP crossed either of the following during FY 2025-26: total turnover exceeded Rs 40 lakh, or total contribution exceeded Rs 25 lakh. Both are tested at the FY level, and crossing either threshold (not both) triggers the audit requirement under the LLP Act 2008 read with Rule 24(8) of the LLP Rules 2009.",
      note:
        "Tax audit under Section 44AB of the Income Tax Act is separate from LLP statutory audit. Tax audit kicks in at Rs 1 crore turnover (Rs 10 crore for digital businesses) for business income, or Rs 50 lakh gross receipts for professional income. An LLP can need both audits at different thresholds, or only one, or neither.",
    },
    {
      id: "05",
      heading: "WHO SIGNS AND CERTIFIES",
      body:
        "Two designated partners must digitally sign Form 8 using Class 3 DSCs. Additionally, a professional certification is required.",
      bullets: [
        "If statutory audit is mandatory (turnover above Rs 40 lakh or contribution above Rs 25 lakh): the auditor (a practising CA) signs the audit report attached to Form 8.",
        "If audit is not mandatory: the form must still be certified by a practising CA, CS, or Cost Accountant. Two designated partner signatures alone are not enough.",
        "For a Small LLP under Section 2(1)(ta) (contribution up to Rs 25 lakh AND turnover up to Rs 40 lakh, both conditions met), the certification requirement is relaxed for many compliance areas, but Form 8 still needs the dual designated partner signatures and supporting financials.",
      ],
    },
    {
      id: "06",
      heading: "FILING FEE STRUCTURE",
      body:
        "The government filing fee on Form 8 is based on the total contribution of partners, mirroring the Form 11 fee structure.",
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
      id: "07",
      heading: "PENALTY FOR LATE FILING",
      body:
        "The LLP (Amendment) Rules 2022, effective 1 April 2022, replaced the earlier flat Rs 100 per day late fee with a multiplier-based structure tied to the period of delay and whether the LLP qualifies as a Small LLP under Section 2(1)(ta) of the LLP Act. Additional filing fees stack on top of the normal filing fee as follows:",
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
        "This is in addition to the normal filing fee in Section 06 above. Section 76A of the LLP Act read with the LLP (Amendment) Act 2021 provides for separate adjudication penalties on persistent default. The CCFS 2026 condonation window covers Companies Act filings only, not LLP Act filings, so there is no current waiver scheme for LLP additional fees.",
    },
    {
      id: "08",
      heading: "FORM 8 vs FORM 11: TWO SEPARATE FILINGS",
      body:
        "Founders sometimes assume Form 8 covers everything. It doesn't. Form 8 is financial. Form 11 is the partner registry, due five months earlier on 30 May. Both are mandatory and they don't substitute for each other.",
      table: {
        headers: ["Filing", "What It Covers", "Due Date FY 2025-26", "Section"],
        rows: [
          ["Form 11", "Partner registry, contributions, changes during the year", "30 May 2026", "Section 35, LLP Act"],
          ["Form 8", "Financial statements, solvency declaration", "30 October 2026", "Section 34, LLP Act"],
          ["ITR-5", "Income tax return for the LLP", "31 July 2026 (non-audit) / 31 October 2026 (audit)", "Section 139, IT Act 1961"],
        ],
      },
    },
    {
      id: "09",
      heading: "COMMON MISTAKES",
      body:
        "Most Form 8 rejections we see come from a small set of repeated errors.",
      bullets: [
        "Audit applicability missed because contribution increased mid-year. Once total contribution crosses Rs 25 lakh, audit kicks in for the entire FY, not just the post-crossing period.",
        "Balance sheet not matching books. The MCA21 portal validates basic accounting equations and rejects forms with assets-liabilities mismatch.",
        "Total partner contribution in Form 8 not reconciling with the same number filed in Form 11 for the same FY. Both must agree.",
        "MSME disclosure left blank when there are outstanding dues to MSME suppliers beyond 45 days. The MSME-1 disclosure is a separate filing from Form 8 but the relationship is checked.",
        "Filing in the last week of October. The MCA21 portal predictably slows in late October when both AOC-4 and Form 8 deadlines converge. Aim for 25 October as the working target.",
      ],
    },
  ],
  faqs: [
    {
      q: "Our LLP turnover was Rs 50 lakh. Do we need an audit?",
      a: "Yes. Audit is mandatory if either turnover exceeds Rs 40 lakh OR contribution exceeds Rs 25 lakh. Rs 50 lakh turnover crosses the first threshold. You need a practising CA to audit the books before Form 8 can be filed.",
    },
    {
      q: "Can the same CA do both the LLP statutory audit and the Form 8 certification?",
      a: "Yes. Where statutory audit applies, the auditor's signed report goes with the Form 8 filing and serves as the certification. You don't need a separate CS or Cost Accountant. Where audit is not mandatory, you can use the auditor or any other practising CA, CS, or Cost Accountant to certify.",
    },
    {
      q: "A designated partner refuses to sign the solvency declaration. What now?",
      a: "Form 8 needs two designated partner DSCs. If one refuses on the grounds that the LLP cannot meet its obligations, you have a real problem that goes beyond the form. Either resolve the dispute internally and get the signature, or file an honest negative solvency declaration (which has consequences but at least keeps you out of false-declaration territory). Our LLP advisory team handles these cases.",
    },
    {
      q: "Does Form 8 require an ICAI member or any CA?",
      a: "Statutory audit must be done by a CA holding a Certificate of Practice (full ICAI member with COP). For non-audit certification of Form 8, a practising CA, CS in whole-time practice, or Cost Accountant in whole-time practice can sign. Internal CAs (employees of the LLP) cannot certify their own LLP.",
    },
    {
      q: "What if we miss Form 8 by just a few days?",
      a: "Within 15 days of delay, the additional fee is 1x the base filing fee (so doubling the fee, since the base is also paid). Between 15 and 30 days, it's 2x. The multiplier escalates from there. There is no grace period and no condonation scheme for LLPs. File as soon as possible to keep the multiplier in the lower bracket.",
    },
  ],
  sources: [
    {
      name: "Limited Liability Partnership Act 2008, Section 34",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory basis for the Statement of Account and Solvency filing requirement.",
    },
    {
      name: "Limited Liability Partnership Rules 2009, Rule 24",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Form 8 contents, audit threshold, and certification requirements.",
    },
    {
      name: "Limited Liability Partnership (Amendment) Rules 2022",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Notified by MCA on 11 February 2022, effective 1 April 2022. Substituted Annexure A of the LLP Rules 2009 to introduce the multiplier-based additional fee structure for late filings.",
    },
    {
      name: "LLP (Amendment) Act 2021, Section 76A",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Adjudication of penalties framework with reduced caps for Small LLPs and start-up LLPs.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for Form 8 submission.",
    },
  ],
};
