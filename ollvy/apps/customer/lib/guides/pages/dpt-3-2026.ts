// =============================================================================
// GUIDE PAGE: dpt-3-2026
// File path: lib/guides/pages/dpt-3-2026.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const dpt32026: LearnPageConfig = {
  slug: "dpt-3-2026",
  title: "DPT-3 Annual Return on Deposits and Loans for Indian Companies",
  seoTitle: "DPT-3 Filing 2026 | Annual Deposit Return Due 30 June | Ollvy",
  seoDescription: "File DPT-3 annual return by 30 June 2026 for FY 2025-26. Mandatory for every company including NIL filings. Section 403 daily fee plus Section 73 penalty for delay. Filed by Ollvy CS team.",
  canonicalUrl: "https://www.ollvy.com/guides/dpt-3-2026",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing"],
  relatedLearnSlugs: ["mca-annual-filing-aoc-4-mgt-7"],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT DPT-3 IS",
      body:
        "DPT-3 is the annual return that discloses all money received by a company that is either a deposit (regulated under Section 73 of the Companies Act 2013) or an exempt receipt (excluded from the deposit definition under Rule 2(1)(c) of the Companies (Acceptance of Deposits) Rules 2014). It is filed by every company except government companies, and the disclosure captures the company's outstanding position as on 31 March of the relevant financial year. The form has two purposes: it is the regulatory window into deposit acceptance, and it is the recurring disclosure that ensures the company stays compliant with the deposit rules.",
    },
    {
      id: "02",
      heading: "WHO HAS TO FILE",
      body:
        "Every company registered under the Companies Act except government companies. So Pvt Ltds, OPCs, Public Ltds (listed and unlisted) all file. Section 8 (not-for-profit) companies also file. Beyond government companies, the following are also exempt under Rule 1(3) of the Companies (Acceptance of Deposits) Rules 2014: banking companies, Non-Banking Financial Companies (NBFCs registered with RBI), and Housing Finance Companies registered with the National Housing Bank. There is no turnover threshold, no minimum capital, and no exemption based on size for any other company.",
    },
    {
      id: "03",
      heading: "WHEN IT IS DUE",
      body:
        "DPT-3 is due by 30 June every year, capturing the position as on 31 March. So for FY 2025-26 (the snapshot date of 31 March 2026), the filing deadline is 30 June 2026. The 90-day window from 31 March to 30 June is meant for the company to close books, get the audit done, and reconcile balances, but in practice most companies file in the last two weeks.",
    },
    {
      id: "04",
      heading: "WHAT GETS REPORTED",
      body:
        "DPT-3 captures all money received that is either a regulated deposit or an exempt receipt. Most growing companies have a mix of both.",
      bullets: [
        "Deposits accepted under Section 73 (rare for unlisted Pvt Ltds; more common in NBFCs and HFCs).",
        "Loans received from directors and their relatives (covered receipts under Rule 2(1)(c)).",
        "Loans received from any other body corporate including group companies (inter-corporate deposits or ICDs).",
        "Debentures issued (secured or unsecured, listed or unlisted).",
        "Share application money pending allotment beyond 60 days.",
        "Advances received against orders, work, or supply that haven't been adjusted.",
        "Bonds, commercial paper, and other money market instruments outstanding.",
        "Borrowings from banks and financial institutions (working capital, term loans).",
      ],
    },
    {
      id: "05",
      heading: "ONE-TIME RETURN VS ANNUAL RETURN",
      body:
        "When DPT-3 was first introduced (via the Companies (Acceptance of Deposits) Amendment Rules 2019), every company had to file a one-time return capturing all outstanding deposits and covered receipts as on 31 March 2019, plus annual returns thereafter. That one-time obligation is now done for all companies in existence at that time. New companies (incorporated after the original cut-off) just file the annual return from the year of incorporation onwards. The MCA portal still allows the form to be filed in either mode (one-time or annual), and most filings are now in annual mode.",
    },
    {
      id: "06",
      heading: "EXEMPT MONEY VS DEPOSITS",
      body:
        "The single most important DPT-3 distinction is between regulated deposits and exempt receipts. Regulated deposits trigger Section 73 obligations (deposit insurance, escrow, registration with Reserve Bank in some cases). Exempt receipts have to be disclosed in DPT-3 but don't trigger the Section 73 framework.",
      table: {
        headers: ["Type of Money Received", "Treatment", "DPT-3 Reportable"],
        rows: [
          ["Director's personal loan to the company", "Exempt under Rule 2(1)(c)(viii)", "Yes (separate column)"],
          ["Share application money pending up to 60 days", "Exempt under Rule 2(1)(c)(vii)", "No"],
          ["Share application money pending beyond 60 days", "Treated as deposit", "Yes (deposit column)"],
          ["Loan from group / holding / subsidiary company", "Exempt under Rule 2(1)(c)(vi)", "Yes"],
          ["Loan from a bank or financial institution", "Exempt under Rule 2(1)(c)(iii)", "Yes"],
          ["Public deposits accepted under Section 73", "Regulated deposit", "Yes (deposit column)"],
          ["Advance received against order to be supplied within 365 days", "Exempt under Rule 2(1)(c)(xii)", "No"],
          ["Subscription money pending under right issue / private placement", "Exempt", "No"],
        ],
      },
      note:
        "The exemption depends on satisfying the conditions of Rule 2(1)(c) precisely. Loose interpretation often gets companies into trouble: e.g., a 'director loan' that turns out to be from a third party who happens to be the director's friend is not exempt and counts as a deposit.",
    },
    {
      id: "07",
      heading: "PENALTY FOR LATE FILING",
      body:
        "Two penalties stack on a missed DPT-3.",
      bullets: [
        "Section 403 additional fee at Rs 100 per day from 30 June with no upper cap. Paid on the form itself at filing time.",
        "Section 73(2) read with Rule 21 statutory penalty: Rs 5,000 minimum on the company, plus Rs 500 per day of continuing default. Officers in default are personally liable.",
        "The company can be barred from accepting any further deposits or covered receipts until the default is cured. This is the operational pain: future founder loans, ICDs, and share application money flows can all get blocked.",
      ],
    },
    {
      id: "08",
      heading: "WHEN NIL FILING IS NEEDED",
      body:
        "Strictly under the Companies (Acceptance of Deposits) Rules 2014, a NIL DPT-3 (zero outstanding deposits, zero exempted receipts as on 31 March) is not legally mandatory. The trigger for the form is the existence of deposits or covered receipts to report. However, many practitioners file a precautionary NIL DPT-3 to maintain a clean compliance record, since: (a) the absence of a filing can be interpreted as oversight in due diligence, and (b) the form is cheap and quick to file (Rs 300 in MCA fees, 30 minutes of work). Most companies that have any director loans, share application money pending allotment, or group company advances will have something to report and won't qualify as truly NIL. A common compliance error is treating director loans as personal and skipping disclosure. Director loans are exempt receipts and must be disclosed in DPT-3.",
    },
  ],
  faqs: [
    {
      q: "Founder loaned the company Rs 5 lakh from personal account. Is this a deposit?",
      a: "No, it is exempt under Rule 2(1)(c)(viii). But it must be disclosed in DPT-3 in the 'amount received from directors' column with a written declaration from the director that the funds are not from borrowed sources. The exemption is conditional, the disclosure is mandatory.",
    },
    {
      q: "Share application money received but not allotted yet. Deposit or not?",
      a: "Depends on how long it has been pending. Up to 60 days from receipt: exempt and not DPT-3 reportable. Beyond 60 days without allotment or refund: treated as a deposit under Rule 2(1)(c)(vii), reportable in DPT-3, and triggers Section 73 obligations.",
    },
    {
      q: "We have zero deposits. Do we still file?",
      a: "Strictly speaking, no. NIL DPT-3 is not legally mandatory. The filing trigger is the existence of deposits or exempted receipts to report. But most practitioners recommend filing a precautionary NIL DPT-3 because the absence of any filing can be interpreted as oversight in due diligence. Cost is Rs 300 in MCA fees and about 30 minutes of work. Also, check carefully whether you truly have zero exempted receipts: director loans, share application money pending, group company advances all count and are commonly missed.",
    },
    {
      q: "Foreign loan from parent company: does it go in DPT-3?",
      a: "Yes. Loans from a holding or group company (whether Indian or foreign) are exempt receipts under Rule 2(1)(c)(vi) but still require disclosure in DPT-3. The form has a specific column for inter-corporate deposits.",
    },
    {
      q: "Penalty for filing one day late?",
      a: "Section 403 fee of Rs 100 for that one day, paid at filing. The Section 73 statutory penalty (Rs 5,000 minimum) typically gets triggered only on adjudication, which usually doesn't happen for a one-day delay if you file promptly. The risk grows materially with longer delays.",
    },
  ],
  sources: [
    {
      name: "Companies Act 2013, Section 73",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Prohibition on acceptance of deposits except in compliance with prescribed framework.",
    },
    {
      name: "Companies (Acceptance of Deposits) Rules 2014, Rule 16 and Rule 21",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Annual return requirement (Rule 16) and penalty framework (Rule 21).",
    },
    {
      name: "Companies (Acceptance of Deposits) Amendment Rules 2019",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Introduction of one-time return for outstanding receipts and the recurring annual DPT-3.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for DPT-3 submission.",
    },
  ],
};
