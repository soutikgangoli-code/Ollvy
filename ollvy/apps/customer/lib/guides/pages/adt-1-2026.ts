// =============================================================================
// GUIDE PAGE: adt-1-2026
// File path: lib/guides/pages/adt-1-2026.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const adt12026: LearnPageConfig = {
  slug: "adt-1-2026",
  title: "ADT-1 Auditor Appointment Filing under Companies Act 2013",
  seoTitle: "ADT-1 Filing 2026 | Auditor Appointment Intimation | Ollvy",
  seoDescription: "File Form ADT-1 to intimate ROC about auditor appointment within 15 days of AGM. Standard deadline 15 October 2026 for 30 September AGMs. Multiplier-based late fees (2x to 12x of normal fee). Filed by Ollvy CS team.",
  canonicalUrl: "https://www.ollvy.com/guides/adt-1-2026",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["auditor-appointment", "mca-annual-filing"],
  relatedLearnSlugs: ["agm-compliance", "mca-annual-filing-aoc-4-mgt-7"],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT ADT-1 IS",
      body:
        "ADT-1 is the e-form a company files with the Registrar of Companies (ROC) to intimate the appointment or reappointment of an auditor. It is filed by the company, not by the auditor, and the appointment itself is created by the board resolution (for first auditor) or the AGM resolution (for subsequent appointments). ADT-1 is the formal notice to the ROC that the appointment has happened, attaching the auditor's written consent and certificate of eligibility.",
    },
    {
      id: "02",
      heading: "WHEN IT IS DUE",
      body:
        "Within 15 days of the AGM at which the auditor was appointed or reappointed. For a standard 30 September 2026 AGM, the deadline is 15 October 2026. For first auditors appointed by the board within 30 days of incorporation, the 15-day clock runs from the board resolution date, not the AGM date.",
      note:
        "The 15-day clock runs from the actual AGM date, not the standard 30 September. If your AGM is held earlier (say 15 August), ADT-1 is due 30 August. The 15 October 2026 date in this page assumes a 30 September AGM.",
    },
    {
      id: "03",
      heading: "FIRST AUDITOR vs SUBSEQUENT AUDITORS",
      body:
        "The Companies Act 2013 distinguishes between the first auditor (appointed for the company's first financial year) and subsequent auditors (appointed at AGMs). Per MCA Notification G.S.R. 359(E) dated 30 May 2025 (effective 14 July 2025), ADT-1 filing is now mandatory for first auditor appointments by the Board too, where it was previously optional or recommended.",
      table: {
        headers: ["Trigger", "Who Appoints", "Tenure", "ADT-1 Filing Trigger"],
        rows: [
          ["First auditor (within 30 days of incorporation)", "Board of Directors", "Until conclusion of first AGM", "15 days from board resolution"],
          ["First AGM appointment", "Shareholders at AGM", "Up to 5 financial years", "15 days from AGM"],
          ["Reappointment at subsequent AGM", "Shareholders at AGM", "Up to 5 financial years (for individual auditor)", "15 days from AGM"],
          ["Casual vacancy (resignation, death)", "Board (with shareholder ratification)", "Until next AGM", "15 days from board resolution"],
        ],
      },
    },
    {
      id: "04",
      heading: "AUDITOR APPOINTMENT TENURE UNDER SECTION 139",
      body:
        "Section 139(1) of the Companies Act 2013 allows the appointment of an auditor for up to five financial years at a time, with the appointment subject to ratification at every AGM until the Companies (Amendment) Act 2017 removed the annual ratification requirement. Section 139(2) imposes mandatory rotation for listed companies and certain prescribed classes of companies: an individual auditor cannot serve for more than one term of five consecutive years, and an audit firm cannot serve for more than two terms of five consecutive years (10 years total). After the rotation, a 5-year cooling period applies before the same auditor can be reappointed.",
      note:
        "Private companies that are not listed and do not cross the prescribed thresholds (paid-up capital Rs 10 crore, turnover Rs 100 crore, or borrowings Rs 50 crore) are exempt from mandatory auditor rotation. Most early-stage Pvt Ltds remain in the exempt category and can keep the same auditor indefinitely with reappointment every 5 years.",
    },
    {
      id: "05",
      heading: "WHAT GETS FILED IN ADT-1",
      body:
        "The form captures the appointment basics and the auditor's credentials. Attachments are critical: missing the auditor's written consent or eligibility certificate is the most common cause of resubmission.",
      bullets: [
        "Auditor's name and Firm Registration Number (FRN) issued by ICAI.",
        "Membership number of the auditor or partner signing on behalf of the firm.",
        "Period of appointment (e.g., from FY 2026-27 to FY 2030-31, five years).",
        "AGM date or board resolution date that approved the appointment.",
        "Auditor's written consent under Section 139(1) and certificate of eligibility under Rule 4 of the Companies (Audit and Auditors) Rules 2014.",
        "Copy of the board or AGM resolution.",
      ],
    },
    {
      id: "06",
      heading: "PENALTY FOR LATE FILING",
      body:
        "Late filing additional fees stack as a multiplier of the normal capital-based filing fee under the Companies (Registration Offices and Fees) Rules 2014, escalating with the period of delay. The base filing fee is Rs 200 to Rs 600 depending on the company's authorized capital.",
      table: {
        headers: ["Period of Delay", "Additional Fee (multiplier on normal fee)"],
        rows: [
          ["Up to 30 days", "2x normal fee"],
          ["30 to 60 days", "4x normal fee"],
          ["60 to 90 days", "6x normal fee"],
          ["90 to 180 days", "10x normal fee"],
          ["Beyond 180 days", "12x normal fee"],
        ],
      },
      note:
        "On top of the additional filing fee, persistent non-filing can attract Section 450 adjudication penalty: Rs 10,000 base on the company plus Rs 1,000 per day of continuing default, capped at Rs 2,00,000 on the company and Rs 50,000 per officer in default.",
    },
    {
      id: "07",
      heading: "WHEN TO USE ADT-3 INSTEAD OF ADT-1",
      body:
        "ADT-3 is the form for auditor resignation. If the auditor resigns mid-term (before the end of their five-year appointment), the resignation is filed in ADT-3 by the auditor (not the company) within 30 days of the resignation. The company then appoints a new auditor to fill the casual vacancy, board-approved within 30 days, AGM-ratified within 3 months, and that new appointment is filed in ADT-1 within 15 days of the board resolution.",
    },
    {
      id: "08",
      heading: "COMMON MISTAKES",
      body:
        "Most errors are mechanical and avoidable with a checklist.",
      bullets: [
        "Confusing first auditor (board appoints, files within 15 days of board resolution) with subsequent auditor (AGM appoints, files within 15 days of AGM).",
        "Missing the auditor's written consent under Section 139(1) and the eligibility certificate under Rule 4. Both are mandatory attachments.",
        "Wrong Firm Registration Number (FRN). The FRN is firm-specific, not partner-specific.",
        "Filing ADT-1 every year on a 5-year reappointment. After the 2017 amendment, no annual ratification is required, so ADT-1 is filed only once per 5-year tenure.",
        "Filing the wrong appointment period (writing 1 year instead of 5 years), which creates an inconsistency with the Section 139(1) framework.",
      ],
    },
  ],
  faqs: [
    {
      q: "Our auditor was reappointed for 5 more years. Do we file ADT-1 every year?",
      a: "No. After the Companies (Amendment) Act 2017 removed the annual ratification requirement, ADT-1 is filed only once at the start of each 5-year tenure. From FY 2026-27 to FY 2030-31, you file one ADT-1 in October 2026 and don't file again until the FY 2031-32 appointment.",
    },
    {
      q: "Auditor resigned mid-term. Which form?",
      a: "ADT-3 is filed by the resigning auditor within 30 days of resignation. The company then appoints a replacement auditor (board approval within 30 days, AGM ratification within 3 months) and files ADT-1 for the new auditor within 15 days of the board resolution.",
    },
    {
      q: "Can we file ADT-1 before the AGM?",
      a: "Not for the AGM appointment. The AGM resolution is what creates the appointment, so ADT-1 needs the AGM date and resolution copy. For a first auditor (board appointment within 30 days of incorporation), you file ADT-1 within 15 days of the board resolution, regardless of when the first AGM is held.",
    },
    {
      q: "Pvt Ltd, do we need rotation after 10 years?",
      a: "Only if you cross the prescribed thresholds: paid-up capital Rs 10 crore, turnover Rs 100 crore, or outstanding borrowings Rs 50 crore. Most early-stage Pvt Ltds stay below all three and can keep the same auditor with reappointment every 5 years for as long as the auditor is willing.",
    },
    {
      q: "ADT-1 fee structure?",
      a: "The MCA government fee scales with paid-up capital: Rs 200 for capital up to Rs 1 lakh, Rs 300 for Rs 1-5 lakh, Rs 400 for Rs 5-25 lakh, Rs 500 for Rs 25 lakh to Rs 1 crore, and Rs 600 for capital above Rs 1 crore. Late filing adds a multiplier (2x to 12x of the normal fee) based on the period of delay.",
    },
  ],
  sources: [
    {
      name: "Companies Act 2013, Section 139",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory basis for auditor appointment, reappointment, and rotation.",
    },
    {
      name: "Companies (Audit and Auditors) Rules 2014, Rule 4",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Eligibility certificate format and conditions for auditor appointment.",
    },
    {
      name: "MCA Notification G.S.R. 359(E) dated 30 May 2025",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/notifications.html",
      description: "Effective 14 July 2025, made ADT-1 filing mandatory for first auditor appointments by the Board (previously optional).",
    },
    {
      name: "Companies (Registration Offices and Fees) Rules 2014",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Capital-based filing fee structure (Rs 200 to Rs 600) and late filing multiplier table for ADT-1.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for ADT-1 submission.",
    },
  ],
};
