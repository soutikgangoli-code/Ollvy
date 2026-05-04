// =============================================================================
// GUIDE PAGE: agm-compliance
// File path: lib/guides/pages/agm-compliance.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const agmCompliance: LearnPageConfig = {
  slug: "agm-compliance",
  title: "AGM Compliance for Indian Companies: Timing, Notice, Penalties",
  seoTitle: "AGM Compliance India 2026 | Section 96 | Notice, Quorum, Penalties | Ollvy",
  seoDescription:
    "Annual General Meeting rules for Pvt Ltd and OPC: when the first AGM is due, recurring AGM by 30 September, 21-day notice rule, quorum, voting, penalties under Section 99. Filed by Ollvy.",
  canonicalUrl: "https://www.ollvy.com/guides/agm-compliance",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing", "private-limited-incorporation"],
  relatedLearnSlugs: ["mca-annual-filing-aoc-4-mgt-7", "dir-3-kyc-explained"],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT AN AGM IS AND WHY THE GOVERNMENT CARES",
      body:
        "An Annual General Meeting is the once-a-year gathering where shareholders of a company review what the directors did with their money over the past financial year. Directors present the audited financial statements, shareholders approve them, the auditor is reappointed (or replaced), dividends are declared, and any other shareholder-level decisions get voted on. Section 96 of the Companies Act 2013 makes AGMs compulsory for every company except a One Person Company (OPC). The rules around timing are strict because, historically, founders skipping AGMs was the easiest way to hide bad numbers from minority shareholders. The MCA penalty regime treats missed AGMs almost as seriously as falsified accounts.",
    },
    {
      id: "02",
      heading: "WHEN THE FIRST AGM IS DUE",
      body:
        "Your first AGM doesn't follow the standard rule. Section 96(1) gives a newly-incorporated company a longer runway to settle in before its first shareholder meeting. The first AGM must be held within 9 months from the close of the first financial year. Importantly, a company incorporated on or after January 1 of any year can extend its first financial year up to March 31 of the next year, giving you up to 15 months of operations before the first FY closes, and then 9 more months to call the AGM. So a company incorporated in February 2026 has its first FY ending March 2027, and its first AGM due by December 31, 2027.",
      note:
        "If you've held your first AGM, you don't need to hold another AGM in the same calendar year. The recurring 6-month rule kicks in only from the second AGM onwards.",
    },
    {
      id: "03",
      heading: "WHEN RECURRING AGMs ARE DUE",
      body:
        "From the second AGM onwards, the rules are tighter:",
      bullets: [
        "AGM must be held within 6 months of the close of the financial year. For a March 31 year-end, that means by September 30.",
        "Gap between two AGMs cannot exceed 15 months.",
        "If you can't hold it in time, apply to the Registrar of Companies for an extension under the proviso to Section 96(1) up to a maximum of 3 additional months. The application has to show genuine cause, accounts not finalized due to auditor change, key director hospitalization, etc. Generic reasons get rejected.",
      ],
    },
    {
      id: "04",
      heading: "NOTICE: THE 21 CLEAR DAYS RULE",
      body:
        "Section 101 requires every AGM notice to be sent at least 21 clear days before the meeting date. 'Clear days' means 21 full days, excluding the date of sending and the date of the meeting itself. Send a notice on September 1 for an AGM on September 22, and you've miscounted, that's only 20 clear days. The fix: notice on September 1 means the earliest valid AGM date is September 23. Notice has to be in writing, sent to every shareholder, every director, and the auditor, by post, courier, or email (electronic mode is permitted under Rule 18 of Companies (Management and Administration) Rules 2014). The notice must include date, time, place, agenda, and the form for proxy appointment.",
    },
    {
      id: "05",
      heading: "QUORUM, PROXIES, AND VOTING",
      body:
        "An AGM held without quorum is invalid, and resolutions passed are void. Quorum requirements under Section 103:",
      table: {
        headers: ["Type of Company", "Minimum Quorum"],
        rows: [
          ["Private Limited", "2 members personally present"],
          ["Public Ltd, up to 1000 members", "5 members personally present"],
          ["Public Ltd, 1001 to 5000 members", "15 members personally present"],
          ["Public Ltd, over 5000 members", "30 members personally present"],
          ["One Person Company", "AGM not required"],
        ],
      },
      note:
        "Proxies (Section 105) may attend but cannot count toward quorum. A proxy form must be lodged with the company at least 48 hours before the meeting. If quorum isn't met within 30 minutes of the scheduled start, the meeting is automatically adjourned to the same day next week, same time and place (unless directors decide otherwise).",
    },
    {
      id: "06",
      heading: "WHAT GETS DECIDED AT EVERY AGM",
      body:
        "Section 102 splits AGM business into two buckets: ordinary business and special business. Ordinary business is the standard list:",
      bullets: [
        "Adoption of audited financial statements (balance sheet, P&L, cash flow, directors' report, auditors' report).",
        "Declaration of dividend (if any).",
        "Appointment or reappointment of directors retiring by rotation (applies to public companies primarily).",
        "Appointment of auditors and fixing their remuneration.",
      ],
      note:
        "Anything outside this list is special business, alteration of MOA/AOA, increase in authorized capital, ESOP scheme approval, related party transactions over thresholds, etc. Special business needs an explanatory statement attached to the notice setting out the nature of the proposed resolution and material facts.",
    },
    {
      id: "07",
      heading: "VIRTUAL AND HYBRID AGMs",
      body:
        "Since 2020, the MCA has progressively permitted AGMs through Video Conference (VC) or Other Audio Visual Means (OAVM). The original framework was set out in MCA General Circular No. 20/2020 dated 5 May 2020 (AGMs) and General Circular No. 14/2020 dated 8 April 2020 (EGMs), and was extended through a series of follow-up circulars: GC 02/2022, GC 10/2022, GC 09/2023, GC 09/2024 and most recently GC 03/2025 dated 22 September 2025, which continues the VC/OAVM facility till further orders (open-ended, no fixed deadline). Procedural requirements: notice clearly mentions VC details, meeting recorded with timestamps, mechanism for shareholders to ask questions and vote in real time, scrutinizer's report on e-voting outcome filed with the company. The 2025 Circular clarifies that VC/OAVM does not extend the statutory AGM deadline under Section 96. For most Pvt Ltd companies with a small shareholder base, virtual AGMs are now the practical default.",
    },
    {
      id: "08",
      heading: "PENALTIES UNDER SECTION 99",
      body:
        "Failing to hold an AGM, or holding one without complying with the rules, triggers Section 99. The fine structure applies independently to the company AND to every officer in default (every director), not split between them:",
      bullets: [
        "Fine up to Rs 1,00,000 (one-time, on the company).",
        "Plus continuing default fine up to Rs 5,000 per day on the company.",
        "Same structure repeats for every officer in default: up to Rs 1,00,000 plus Rs 5,000 per day on each director.",
        "So a 100-day delay can mean Rs 6 lakh on the company plus Rs 6 lakh per defaulting director (Rs 1 lakh + Rs 5,000 x 100 = Rs 6 lakh each). For a 5-director board, total exposure crosses Rs 36 lakh.",
        "Section 99 prescribes a 'fine' (not 'penalty'), which means it requires NCLT compounding rather than ROC adjudication, making the process more onerous and expensive in legal fees.",
        "Persistent default also forms grounds for striking off the company under Section 248 and director disqualification under Section 164(2).",
      ],
    },
  ],
  faqs: [
    {
      q: "I'm a single founder running a Pvt Ltd. Do I really need an AGM with myself and the co-director?",
      a: "Yes. The Companies Act doesn't carve out small Pvt Ltds from AGM requirements (only OPCs are exempt). The minutes of a 2-person AGM are short and the meeting itself can take 15 minutes, but the legal requirement applies. Skip it and you face Section 99 penalties plus complications when you raise external capital, since investors will audit your secretarial records.",
    },
    {
      q: "What's the difference between an AGM and an EGM?",
      a: "AGM is the mandatory annual meeting governed by Section 96, with a fixed agenda of ordinary business. EGM (Extraordinary General Meeting) is any other shareholder meeting called between AGMs to deal with urgent matters that can't wait, ESOP scheme approval, fundraising resolutions, MOA changes. Notice for EGMs is also 21 clear days unless shareholders consent to shorter notice (Section 101(1) proviso).",
    },
    {
      q: "Can I extend the AGM deadline if my accounts aren't ready?",
      a: "Yes, you can apply to the ROC for an extension under Section 96(1) proviso, with reasons. Maximum extension is 3 months. The application must be filed before the original deadline expires, you can't apply retroactively. Common accepted reasons: auditor change mid-year, director illness with no alternate authorized signatory, fire or natural disaster affecting records. 'Bookkeeper was busy' won't fly.",
    },
    {
      q: "Does the AGM have to happen at the registered office?",
      a: "Section 96(2) requires the AGM to be held at the registered office or any other place in the same city, town, or village where the registered office is situated. If you want to hold it elsewhere, you need an unanimous consent in writing from all members. With virtual AGMs now permitted, location is less of a practical constraint than it used to be.",
    },
    {
      q: "What documents do I file with the ROC after the AGM?",
      a: "Form AOC-4 (financial statements) within 30 days of the AGM. Form MGT-7 or MGT-7A (annual return) within 60 days of the AGM. Form ADT-1 (auditor appointment intimation) within 15 days. Form MGT-15 (report on AGM, public companies only). The AGM date you record on these forms must match the date in your minute book, mismatches are a common cause of ROC objections.",
    },
  ],
  sources: [
    {
      name: "Companies Act 2013, Section 96",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory requirement for AGM, first AGM rules, and 6-month/15-month timelines.",
    },
    {
      name: "Companies Act 2013, Sections 99, 101, 103, 105",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Penalties, notice, quorum, and proxy provisions for general meetings.",
    },
    {
      name: "Companies (Management and Administration) Rules, 2014",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Procedural rules for sending notice, electronic mode, e-voting, and minutes.",
    },
    {
      name: "MCA General Circulars on Virtual AGMs",
      url: "https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS_circulars.html",
      description: "Successive circulars permitting AGMs through video conferencing during and after the COVID period.",
    },
  ],
};
