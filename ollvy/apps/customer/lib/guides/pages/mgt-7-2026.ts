// =============================================================================
// GUIDE PAGE: mgt-7-2026
// File path: lib/guides/pages/mgt-7-2026.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const mgt72026: LearnPageConfig = {
  slug: "mgt-7-2026",
  title: "MGT-7 Annual Return Filing for Indian Companies (FY 2025-26)",
  seoTitle: "MGT-7 Filing 2026 | Annual Return Due 29 November | Ollvy",
  seoDescription: "File MGT-7 / MGT-7A annual return within 60 days of AGM. For 30 September 2026 AGM, deadline is 29 November 2026. Section 403 Rs 100/day + Section 92(5) Rs 10K base penalty. Ollvy CS team files in 7 days.",
  canonicalUrl: "https://www.ollvy.com/guides/mgt-7-2026",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing", "agm-services"],
  relatedLearnSlugs: ["mca-annual-filing-aoc-4-mgt-7", "agm-compliance"],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT MGT-7 IS",
      body:
        "MGT-7 is the company's annual return, a structural snapshot of the company as on 31 March of the financial year. It captures share capital, board composition, key managerial personnel, shareholders, related-party transactions, and meetings held during the year. It is separate from AOC-4 (which covers the audited financial statements). Both are mandatory annual filings under the Companies Act 2013, but they capture different things and have different deadlines.",
    },
    {
      id: "02",
      heading: "MGT-7 vs MGT-7A",
      body:
        "MGT-7A is the abridged version for One Person Companies (OPCs) and small companies. A small company is defined under Section 2(85) of the Companies Act 2013, with thresholds revised by MCA notification effective 1 December 2025: paid-up share capital not exceeding Rs 10 crore AND turnover not exceeding Rs 100 crore (both conditions must be met, up from the earlier Rs 4 crore / Rs 40 crore). Holding companies, subsidiaries, Section 8 companies, and companies governed by special acts are excluded from small company status regardless of size. All other companies file MGT-7.",
      table: {
        headers: ["Form", "Who Uses It", "Disclosures"],
        rows: [
          ["MGT-7", "Pvt Ltd, Public Ltd, Section 8, and any company that doesn't qualify as small or OPC", "Full annual return with detailed shareholder and director disclosures"],
          ["MGT-7A", "OPCs and small companies (paid-up capital up to Rs 10 Cr AND turnover up to Rs 100 Cr, revised 1 Dec 2025)", "Abridged disclosures, simplified format"],
        ],
      },
    },
    {
      id: "03",
      heading: "WHEN IT IS DUE",
      body:
        "MGT-7 is due within 60 days from the actual date of the AGM at which the financial statements were adopted. For most companies holding their AGM on 30 September (the statutory last date for companies whose financial year ended 31 March), the MGT-7 deadline is 29 November. If you held the AGM earlier (say 30 August), the deadline moves up to 29 October. The 60 days is from the AGM date, not from the financial year end.",
      note:
        "For OPCs, the deadline is 60 days from the date the sole member adopted the financial statements (a written resolution under Section 122(3), since OPCs don't hold AGMs). For most companies that adopt by 30 September, the MGT-7A deadline is 29 November.",
    },
    {
      id: "04",
      heading: "WHAT MGT-7 CAPTURES",
      body:
        "Form MGT-7 has multiple parts and around 30 fields. Key disclosures include:",
      bullets: [
        "Share capital details (authorised, issued, subscribed, paid-up, equity and preference breakup).",
        "Indebtedness (secured, unsecured, deposits, total) as on 31 March, must reconcile with audited balance sheet.",
        "Board composition, directors and KMP (CFO, CS, MD, CEO), changes during the year.",
        "Top 10 shareholders by holding, with PAN.",
        "Promoter and director shareholding, including any pledges.",
        "Related-party transactions count and aggregate value.",
        "Number of board meetings held and director attendance.",
        "AGM date and resolutions passed (ordinary, special).",
        "Penalties or compounding of offences during the year.",
        "Certifications and signatures.",
      ],
    },
    {
      id: "05",
      heading: "CERTIFICATION REQUIREMENT",
      body:
        "MGT-7 must be signed by a director and the Company Secretary (if appointed). If no CS is appointed, by a Company Secretary in Practice. Additionally, MGT-7 (not 7A) requires certification by a practising Company Secretary in Form MGT-8 if any of the following apply.",
      bullets: [
        "Listed company.",
        "Paid-up share capital of Rs 10 crore or more.",
        "Turnover of Rs 50 crore or more.",
      ],
      note:
        "Below these thresholds, MGT-7 still needs a CS signature (in-house or in-practice), but the separate Form MGT-8 certification by a Company Secretary in Practice is not mandatory. Most early-stage Pvt Ltds fall below the thresholds and only need the standard signing.",
    },
    {
      id: "06",
      heading: "PENALTY FOR LATE FILING",
      body:
        "Two layers of penalty stack until the form is filed.",
      bullets: [
        "Section 403 additional filing fee: Rs 100 per day from due date until actual filing, no upper cap. Paid on the form itself at filing time.",
        "Section 92(5) statutory penalty (separate, adjudicated): Rs 10,000 base on the company plus Rs 100 per day of continuing default, capped at Rs 2,00,000. Same structure on every officer in default, capped at Rs 50,000 per individual.",
      ],
      note:
        "The two penalties are independent. The Rs 100 per day filing fee is automatic and paid via the MCA portal at the time of late filing. The Section 92(5) penalty requires an adjudication order from the Registrar and is separately demanded after notice. Three consecutive years of MGT-7 default also triggers Section 164(2)(a) director disqualification for five years.",
    },
    {
      id: "07",
      heading: "AGM DATE TRIGGER",
      body:
        "The 60 days runs from the actual AGM date, not from the financial year end. This means companies have some control over their MGT-7 deadline by choosing when to hold the AGM. The earliest you can hold the AGM is the day after your audited financials are signed by the auditor. The latest is 30 September (six months after the FY end of 31 March, per Section 96 of the Companies Act). Many companies use the in-between window strategically to balance auditor capacity, board scheduling, and regulatory deadlines.",
    },
    {
      id: "08",
      heading: "INTERSECTION WITH AOC-4",
      body:
        "MGT-7 references the audited financials filed in AOC-4. So AOC-4 should be filed first (within 30 days of AGM), and MGT-7 follows (within 60 days). The two filings together complete the annual MCA compliance for the company. Filing MGT-7 before AOC-4 is technically allowed but the validation often fails because MGT-7 fields like indebtedness need to match the figures already on the MCA21 portal from AOC-4.",
    },
    {
      id: "09",
      heading: "COMMON MISTAKES",
      body:
        "When clients come to us after a self-filed MGT-7 rejection, the cause is usually one of these.",
      bullets: [
        "Top 10 shareholder list missing PAN. The portal validates that PAN is provided for every disclosed shareholder.",
        "Indebtedness number not matching AOC-4 audited balance sheet. The portal checks this automatically and flags the mismatch.",
        "AGM date inconsistency between AOC-4 and MGT-7. Both forms must show the same AGM date.",
        "Director/CS signature missing or DSC expired. Always validate DSCs at least 30 days before filing.",
        "MGT-8 certification missing for companies that crossed the Rs 10 crore capital or Rs 50 crore turnover threshold during the FY.",
        "Filing in the last 48 hours before the deadline. The MCA21 portal predictably slows down or crashes when AOC-4 and MGT-7 deadlines converge in late November.",
      ],
    },
  ],
  faqs: [
    {
      q: "We're an OPC. Do we file MGT-7 or MGT-7A?",
      a: "MGT-7A. The abridged form was introduced specifically for OPCs and small companies. MGT-7A has fewer fields and simpler disclosures. The signing requirement is also lighter, an OPC files MGT-7A with just the sole director's DSC (no CS signature needed unless one is voluntarily appointed).",
    },
    {
      q: "We didn't hold an AGM. Can we still file MGT-7?",
      a: "If you didn't hold an AGM by the statutory date (30 September for most companies), the law treats the AGM as having been required by that date and the 60 days runs from there, not from a hypothetical later date. So MGT-7 is still due by 29 November, not deferred. Beyond that, you owe a separate Section 99 penalty for not holding the AGM at all (Rs 1 lakh on the company plus Rs 5,000 per day continuing default). Talk to us before this compounds.",
    },
    {
      q: "Top 10 shareholders disclosure: do we include shares held in trust or by minors?",
      a: "Yes. The disclosure is by registered shareholder, regardless of whether the shares are held in trust, by minors, or via demat. The PAN of the registered holder (the trust, the natural guardian for a minor, etc.) is what gets reported. Beneficial interest disclosure is a separate compliance under MGT-4/MGT-5/MGT-6 if you have nominee or trust arrangements.",
    },
    {
      q: "Does the new Income Tax Act 2025 affect MGT-7?",
      a: "No. MGT-7 is a Companies Act filing, not an income tax filing. The Companies Act 2013 continues unchanged. The Income Tax Act 2025 transition affects ITRs, TDS returns, advance tax, and tax audit forms, but not MCA filings. AOC-4 and MGT-7 retain their existing 1961-Act-era references because they're under a different statute.",
    },
    {
      q: "Can MGT-7 be revised after filing?",
      a: "Yes, but only with ROC approval through a separate application. Unlike MGT-7A or simple e-forms, MGT-7 revisions are not self-service. If you filed with errors, you need to apply for revision under the relevant MCA process, which is essentially an admission of incorrect filing. Better to get it right the first time, which is why CS pre-filing review matters.",
    },
  ],
  sources: [
    {
      name: "Companies Act 2013, Section 92",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory basis for the annual return filing requirement.",
    },
    {
      name: "Companies Act 2013, Section 92(5)",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Penalty provisions for default in filing MGT-7: Rs 10,000 base plus Rs 100 per day, capped at Rs 2,00,000 (company) and Rs 50,000 (officers).",
    },
    {
      name: "Companies (Management and Administration) Rules 2014, Rule 11",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "MGT-7 form contents, certification requirements, and MGT-8 thresholds.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for MGT-7 and MGT-7A submission.",
    },
  ],
};
