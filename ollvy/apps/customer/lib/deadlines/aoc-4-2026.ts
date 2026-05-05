// =============================================================================
// EXEMPLAR DEADLINE PAGE: aoc-4-2026
// File path: lib/deadlines.ts (or wherever DeadlineConfig objects live)
//
// Exemplar 2 of 3. MCA Companies Act category. Use as template for adt-1-2026,
// mgt-7-2026, dpt-3-2026.
// =============================================================================

import type { DeadlineConfig } from "../deadlines";

export const aoc42026: DeadlineConfig = {
  // ====== SERVICE/MARKETING FIELDS ======
  slug: "aoc-4-2026",
  serviceSlug: "mca-annual-filing",
  serviceName: "AOC-4 Filing (Financial Statements)",
  eventLabel: "AOC-4 filing for FY 2025-26",
  dueDate: "2026-10-30",
  postDeadlineMessage:
    "The 30 October 2026 deadline for AOC-4 has passed. Late filing is Rs 100 per day with no upper cap, plus possible director liability under Section 137(3). File immediately and we'll handle the catch-up.",
  heroTagline:
    "AOC-4 due 30 October 2026 (within 30 days of AGM). Rs 100 per day uncapped late fee. We'll have it filed in 7 days.",
  purposeLabel: "FILE YOUR FINANCIAL STATEMENTS WITH ROC",
  eligibilityLabel:
    "Every company registered under the Companies Act 2013, including OPCs, Pvt Ltd, and Public Ltd. Filing required even for companies with no revenue or operations during the year.",
  urgencyLine:
    "AOC-4 must be filed within 30 days of the AGM. Standard AGM by 30 September 2026 means AOC-4 by 30 October 2026. Late fees compound daily and there is no upper limit.",
  penaltyLine:
    "Section 403 additional fee: Rs 100 per day from due date until filed, no upper cap on this MCA late fee. Section 137(3) penalty (separate from late fee): Rs 10,000 base on the company plus Rs 100 per day of continuing default, capped at Rs 2,00,000. On the MD, CFO, or any director designated as officer in default: Rs 10,000 base plus Rs 100 per day of continuing default, capped at Rs 50,000 per individual. Continued default is grounds for director disqualification under Section 164(2) and strike-off under Section 248.",
  filingCount: 1,
  ollvyFee: 4999,
  govtFee: 600,
  slaDays: 7,
  seoTitle: "AOC-4 Filing 2026 | Due 30 October | Financial Statements | Ollvy",
  seoDescription:
    "Every company files AOC-4 within 30 days of AGM. For FY 2025-26 that's 30 October 2026. Rs 100/day uncapped penalty plus director liability under Section 137(3). Ollvy files in 7 days.",
  canonicalUrl: "https://www.ollvy.com/aoc-4-2026",
  documentTab: "documents",
  documentHeading: "What we'll need from you",
  risks: [
    {
      title: "Section 403 additional fee: Rs 100 per day, uncapped",
      body:
        "The MCA charges Rs 100 per day from the due date until the form is filed. Unlike Section 137(3), this additional fee has no upper limit. A 12-month delay alone adds Rs 36,500 to the filing cost on top of any Section 137(3) penalty.",
    },
    {
      title: "Section 137(3) statutory penalty on the company",
      body:
        "On top of the per-day late fee, Section 137(3) imposes a penalty of Rs 10,000 plus Rs 100 per day of continuing default, capped at Rs 2,00,000. This is the maximum monetary exposure for the company under this section, separate from the Section 403 additional fee.",
    },
    {
      title: "Director-level personal liability",
      body:
        "The MD, CFO, and any director designated as 'officer in default' face a personal penalty under Section 137(3) of Rs 10,000 plus Rs 100 per day of continuing default, capped at Rs 50,000 per individual. This is paid by the directors personally, not by the company.",
    },
    {
      title: "Director disqualification cascade",
      body:
        "Three consecutive years of non-filing of AOC-4 (or MGT-7) attracts director disqualification under Section 164(2). The disqualified director is then automatically removed from every other company they sit on. This is the single most consequential ROC penalty.",
    },
  ],
  testimonials: [
    {
      name: "Rahul J.",
      role: "Founder, Pvt Ltd, FY 25-26 first filing",
      quote:
        "First-year compliance was overwhelming. Ollvy walked us through AGM minutes, AOC-4, MGT-7, and ADT-1 in one go. SRN came clean, no objections. Worth the fee for the peace of mind alone.",
    },
    {
      name: "Sanjana P.",
      role: "Founder, B2B SaaS Pvt Ltd",
      quote:
        "We had a defective AOC-4 sitting in the queue from a previous CA. Ollvy diagnosed the cause (XBRL tagging error), refiled, and the SRN cleared in 4 days. Saved us from a 90-day penalty spiral.",
    },
  ],

  // ====== EDUCATIONAL CONTENT FIELDS ======
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing", "private-limited-incorporation"],
  relatedLearnSlugs: ["mca-annual-filing-aoc-4-mgt-7", "agm-compliance", "dir-3-kyc-explained"],
  ctaSecondarySlug: "pvt-ltd-incorporation",
  sections: [
    {
      id: "01",
      heading: "WHAT AOC-4 IS",
      body:
        "AOC-4 is the e-form through which every company files its audited financial statements with the Registrar of Companies. It carries the balance sheet, profit and loss account, cash flow statement (where applicable), the directors' report, the auditors' report, and corporate governance disclosures. It's the document that makes your year's financials a matter of public record. Anyone can pay Rs 25 on the MCA portal and pull your AOC-4. That includes investors doing diligence, competitors mapping your traction, and tax officers cross-checking your ITR. So it's worth filing it cleanly.",
    },
    {
      id: "02",
      heading: "WHEN IT'S DUE",
      body:
        "Section 137 of the Companies Act 2013 requires AOC-4 to be filed within 30 days of the Annual General Meeting. The standard AGM deadline (Section 96) is within 6 months from the close of the financial year, meaning 30 September for an FY ending 31 March. So for FY 2025-26, the AGM happens by 30 September 2026, and AOC-4 follows by 30 October 2026.",
      note:
        "If your AGM is held earlier (say 15 August 2026), the AOC-4 deadline is 14 September 2026, not 30 October. The 30-day clock runs from the actual AGM date, not the latest possible AGM date. If the AGM is not held at all (which itself violates Section 96), AOC-4 is due 30 days from the date the AGM should have been held.",
    },
    {
      id: "03",
      heading: "AOC-4 vs AOC-4 (CFS) vs AOC-4 XBRL",
      body:
        "There are three variants of the form depending on the company's profile:",
      table: {
        headers: ["Form Variant", "Who Files It", "Format"],
        rows: [
          ["AOC-4", "Most companies (small, OPC, Pvt Ltd not crossing XBRL threshold)", "Regular e-form, attachments in PDF"],
          ["AOC-4 (CFS)", "Companies with subsidiaries or associates (consolidated financials)", "Regular e-form, plus consolidated FS attachment"],
          ["AOC-4 XBRL", "Listed companies, companies with paid-up capital >= Rs 5Cr or turnover >= Rs 100Cr, and certain other categories", "XBRL-tagged financial data, machine-readable"],
        ],
      },
      note:
        "Most early-stage Pvt Ltds file regular AOC-4. Crossing the XBRL threshold (paid-up capital Rs 5 Cr or turnover Rs 100 Cr) is a one-way door, once you cross, you file in XBRL forever, even if you fall back below the threshold in future years.",
    },
    {
      id: "04",
      heading: "WHAT GETS ATTACHED",
      body:
        "AOC-4 itself is a structured form, but most of the substance is in the attachments. You'll need:",
      bullets: [
        "Audited balance sheet as on 31 March 2026, signed by two directors and the auditor.",
        "Audited profit and loss account for FY 2025-26, similarly signed.",
        "Cash flow statement (mandatory for non-small companies).",
        "Notes to accounts forming part of the financial statements.",
        "Directors' report covering matters under Section 134 (state of affairs, dividend, reserves, related party transactions, energy/foreign exchange disclosures, etc.).",
        "Auditor's report under Section 143, including CARO 2020 reporting where applicable.",
        "Statement of subsidiaries in Form AOC-1, if the company has subsidiaries or associates.",
        "Secretarial audit report under Section 204, if the company crosses any of the thresholds in Rule 9 of the Companies (Appointment and Remuneration of Managerial Personnel) Rules 2014: every public company with paid-up share capital of Rs 50 Cr or more, every public company with turnover of Rs 250 Cr or more, and (since the amendment dated 3 January 2020 effective from FY 2020-21) every company including private companies with outstanding loans or borrowings from banks or public financial institutions of Rs 100 Cr or more.",
        "Corporate Social Responsibility (CSR) report, if Section 135 applies (net worth Rs 500 Cr / turnover Rs 1000 Cr / net profit Rs 5 Cr).",
      ],
    },
    {
      id: "05",
      heading: "FEES AND PENALTIES",
      body:
        "The base filing fee depends on the authorized share capital of the company:",
      table: {
        headers: ["Authorized Share Capital", "Base Filing Fee"],
        rows: [
          ["Up to Rs 1 lakh", "Rs 200"],
          ["Rs 1 to Rs 5 lakh", "Rs 300"],
          ["Rs 5 to Rs 25 lakh", "Rs 400"],
          ["Rs 25 lakh to Rs 1 crore", "Rs 500"],
          ["Above Rs 1 crore", "Rs 600"],
        ],
      },
      note:
        "Two layers of penalty stack on missed filings: (a) Section 403 additional fee of Rs 100 per day from the due date, with no upper cap, charged on the form itself; (b) Section 137(3) statutory penalty of Rs 10,000 base plus Rs 100 per day of continuing default, capped at Rs 2,00,000 on the company and Rs 50,000 on each officer in default (MD, CFO, or designated director). The Section 403 fee runs uncapped, the Section 137(3) penalty caps at the figures above. Both apply together until cured.",
    },
    {
      id: "06",
      heading: "WHO HAS TO SIGN",
      body:
        "AOC-4 must be digitally signed by:",
      bullets: [
        "One director of the company (using their DSC linked to their DIN).",
        "The Chief Financial Officer (CFO) if the company has appointed one. If not, a second director's DSC works.",
        "A practising Chartered Accountant, Cost Accountant, or Company Secretary, certifying the form. Per Rule 9(b) of the Companies (Registration Offices and Fees) Rules 2014, AOC-4 pre-certification by a practising professional is mandatory for every company OTHER than One Person Companies (OPCs) and small companies. OPCs and small companies are exempt from this professional certification, only the director and CFO signatures are required.",
      ],
      note:
        "All DSCs must be Class 3 and the underlying DIN/PAN combination must be active on MCA-21. A common cause of rejection is a director whose DIN was deactivated for non-filing of DIR-3 KYC. Always verify DIN status 7 days before filing.",
    },
    {
      id: "07",
      heading: "THE AGM-FIRST SEQUENCE",
      body:
        "AOC-4 is the second step in a four-step annual filing sequence. Each step depends on the one before it:",
      bullets: [
        "Step 1: Hold the AGM (by 30 September 2026 for FY 2025-26). Adopt the financial statements and reappoint the auditor.",
        "Step 2: File AOC-4 (within 30 days of AGM, so by 30 October 2026). Includes the AGM-adopted financial statements.",
        "Step 3: File MGT-7 or MGT-7A (within 60 days of AGM, so by 29 November 2026). The annual return.",
        "Step 4: File ADT-1 (within 15 days of AGM, so by 15 October 2026). Auditor appointment intimation.",
      ],
      note:
        "ADT-1 is technically due before AOC-4 even though it concerns auditor appointment. File it first to avoid having to refile AOC-4 if the auditor record on MCA records doesn't match what AOC-4 declares.",
    },
    {
      id: "08",
      heading: "COMMON MISTAKES THAT TRIGGER DEFECTIVE NOTICES",
      body:
        "Things we see when clients come to us after a self-filed rejection:",
      bullets: [
        "AGM date in AOC-4 doesn't match AGM date in board minutes. The MCA cross-references this with MGT-15. Reconcile before filing.",
        "Directors' report doesn't include all Section 134 disclosures. CSR disclosure, related party transactions, conservation of energy, foreign exchange earnings/outgo, and the explicit statement on internal financial controls all have specific drafting requirements.",
        "Auditor's signature missing or DSC mismatch. The auditor signs the financial statements, not AOC-4 itself, but a name and membership number mismatch flags the form.",
        "Wrong form variant filed. Filing AOC-4 instead of AOC-4 XBRL once you've crossed the XBRL threshold is treated as defective filing, not a fresh filing.",
        "Form filed before the AGM date. Sounds obvious but happens, especially when an AGM gets pushed and someone forgets to update the form before submission.",
      ],
    },
  ],
  faqs: [
    {
      q: "We had no revenue or operations in FY 2025-26. Do we still file AOC-4?",
      a: "Yes. AOC-4 is mandatory for every registered company regardless of activity. A nil filing with NIL balance sheet and zero P&L still satisfies the obligation. The penalty for non-filing applies whether or not you had any business activity.",
    },
    {
      q: "Can we file AOC-4 if the auditor's report has qualifications?",
      a: "Yes. A qualified auditor's report doesn't prevent filing, it just gets attached and disclosed as is. The directors' report should explain the qualifications, what's being done about them, and why the directors believe the financials still fairly present the company's position. Investors and the ROC will see the qualifications, so be prepared to explain in any follow-up.",
    },
    {
      q: "What if our AGM gets delayed past 30 September?",
      a: "If you've applied to the ROC for an AGM extension under the proviso to Section 96(1), the AOC-4 deadline shifts to 30 days from your extended AGM date. If you held the AGM late without an extension, the AGM itself is non-compliant (Section 99 penalty) but the AOC-4 deadline still runs from the actual AGM date. If you didn't hold an AGM at all, AOC-4 is due 30 days from the date by which the AGM should have been held (i.e., 30 October 2026 for FY 2025-26).",
    },
    {
      q: "Is AOC-4 covered by the CCFS 2026 condonation scheme?",
      a: "Yes. The Companies Compliance Facilitation Scheme 2026 (CCFS-2026), notified by MCA Circular 01/2026 dated 24 February 2026, is active from 15 April 2026 to 15 July 2026. It covers backlog AOC-4 and MGT-7 filings under Sections 137 and 92, with a 90 percent waiver on additional fees (you pay base fee plus only 10 percent of accumulated late fees). If you have a stale AOC-4 sitting in the queue, this is the cheapest window in years to clear it. Note that CCFS does not condone the underlying default of holding the AGM late, that's a separate Section 99 matter.",
    },
    {
      q: "Do listed companies have a different deadline?",
      a: "Listed companies follow the same 30-day-from-AGM rule, but in practice they file earlier because SEBI LODR requires public disclosure of audited financials within 60 days of the year-end. So listed companies typically file AOC-4 (XBRL) in June or early July, well before the 30 October technical deadline.",
    },
  ],
  lastReviewed: "May 2026",
  sources: [
    {
      name: "Companies Act 2013, Section 137",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory basis for filing financial statements with the ROC and the penalty for non-compliance.",
    },
    {
      name: "Companies (Accounts) Rules 2014",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Detailed rules on form variants, attachments, signing, and certification.",
    },
    {
      name: "MCA General Circular 01/2026: Companies Compliance Facilitation Scheme 2026",
      url: "https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS_circulars.html",
      description: "CCFS-2026, dated 24 February 2026, active 15 April to 15 July 2026. Pay 10% of additional fees on pending AOC-4 and MGT-7 filings during this window.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for AOC-4 submission.",
    },
  ],
};
