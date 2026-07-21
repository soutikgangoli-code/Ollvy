// =============================================================================
// GUIDE PAGE: dir-3-kyc-explained
// File path: lib/guides/pages/dir-3-kyc-explained.ts
// Last reviewed: May 2026 — reflects MCA Notification G.S.R. 943(E) dated
// 31 Dec 2025, effective 31 Mar 2026, and Companies (Registration Offices and
// Fees) Amendment Rules 2026, effective 21 Apr 2026.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const dir3KycExplained: LearnPageConfig = {
  slug: "dir-3-kyc-explained",
  title: "DIR-3 KYC: The New Triennial Rule and What Directors Must Do",
  seoTitle: "DIR-3 KYC Guide 2026 | Triennial Filing | Web-Only Form | Penalty | Ollvy",
  seoDescription:
    "MCA's December 2025 notification shifted Director KYC from annual to triennial, retired the eForm DIR-3 KYC, and made DIR-3 KYC Web the only filing route. Triennial cycle, Rs 5K reactivation fee, Rs 500 change fee, and the 30-day event-based update rule.",
  canonicalUrl: "https://www.ollvy.com/guides/dir-3-kyc-explained",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["director-kyc", "mca-annual-filing"],
  relatedLearnSlugs: ["agm-compliance", "mca-annual-filing-aoc-4-mgt-7", "director-kyc-2026"],
  ctaServiceSlug: "director-kyc",
  sections: [
    {
      id: "01",
      heading: "WHAT DIR-3 KYC IS",
      body:
        "DIR-3 KYC is the MCA's identity-refresh exercise for every director and designated partner who has been allotted a Director Identification Number (DIN). It exists because, before this requirement was introduced in 2018, DINs were being issued and never updated, leading to ghost directors, untraceable signatories, and shell companies running unchecked. Rule 12A of the Companies (Appointment and Qualification of Directors) Rules 2014 requires every DIN holder to verify their identity, mobile, email and address with the MCA at periodic intervals. Skipping the filing automatically deactivates your DIN, which then disables your ability to sign any e-form on the MCA portal for any company you're a director of.",
    },
    {
      id: "02",
      heading: "THE BIG SHIFT: ANNUAL TO TRIENNIAL, AND WEB-ONLY",
      body:
        "On 31 December 2025, MCA issued Notification G.S.R. 943(E), substituting Rule 12A in its entirety. The new rule came into force on 31 March 2026 and changed two things at once:",
      bullets: [
        "Filing frequency moved from annual to triennial. Routine KYC is now once every three consecutive financial years, with the deadline being 30 June of the relevant year.",
        "The eForm DIR-3 KYC has been discontinued. Going forward, there is only one filing channel: DIR-3 KYC Web. The same Web form now serves five purposes: routine triennial KYC, mobile number update, email update, residential address update, and reactivation of a deactivated DIN.",
      ],
      note:
        "Directors who completed their KYC for FY 2025-26 are automatically rolled into the new triennial cycle. Their next routine filing is due by 30 June 2028. Directors who had not filed previously had until 31 March 2026 to reactivate under the old framework.",
    },
    {
      id: "03",
      heading: "WHEN YOUR NEXT FILING IS DUE",
      body:
        "Your due date depends on when your DIN was allotted and whether you have already filed KYC for FY 2025-26.",
      table: {
        headers: ["Your Situation", "Next Routine KYC Due"],
        rows: [
          ["DIN allotted before 1 April 2026, KYC for FY 2025-26 already filed", "30 June 2028"],
          ["DIN allotted before 1 April 2026, KYC missed up to 31 March 2026", "Reactivate immediately, then 30 June 2028"],
          ["DIN allotted on or after 1 April 2026", "After completion of three financial years from end of FY of allotment"],
        ],
      },
      note:
        "Example for new DINs: a DIN allotted on 15 May 2026 (FY 2026-27) means three consecutive FYs end on 31 March 2030, so the first triennial KYC is due by 30 June 2030.",
    },
    {
      id: "04",
      heading: "THE CONTACT-CHANGE EXCEPTION (RULE 12A(2))",
      body:
        "Triennial filing does not mean you can ignore your contact details for three years. The amended rule preserves an event-based filing requirement: any change in mobile number, email, or residential address must be updated through DIR-3 KYC Web within 30 days of the change. This obligation runs in parallel with the triennial cycle and does not reset it. So if you change your residential address in March 2027, you file the Web form within 30 days and your next routine triennial filing remains due by 30 June 2028.",
    },
    {
      id: "05",
      heading: "FEE STRUCTURE UNDER COMPANIES (REGISTRATION OFFICES AND FEES) AMENDMENT RULES 2026",
      body:
        "MCA notified the new fee table on 21 April 2026. Three scenarios, three fees:",
      table: {
        headers: ["Scenario", "Fee"],
        rows: [
          ["Routine triennial filing on or before 30 June of the due year", "Nil"],
          ["Late filing (after the due date) or reactivation of a deactivated DIN", "Rs 5,000"],
          ["Contact-change filing under Rule 12A(2), per filing", "Rs 500"],
        ],
      },
      note:
        "The Rs 500 fee for change-based filings is new. Earlier, contact updates through DIR-3 KYC Web were free. If you find yourself filing repeatedly, batch changes where possible (one Web filing covering mobile, email and address change together) to keep costs down.",
    },
    {
      id: "06",
      heading: "WHEN DSC AND CA/CS CERTIFICATION ARE REQUIRED",
      body:
        "Under the substituted rule, the documentation burden depends on what kind of filing you're doing:",
      bullets: [
        "Routine triennial filing where nothing has changed: just OTP confirmation of mobile and email. No DSC, no CA/CS/CMA certification needed.",
        "Event-based filing under Rule 12A(2) (mobile, email or address change): DSC of the DIN holder plus certification by a practising CA, CS, or CMA is mandatory.",
        "Reactivation of a deactivated DIN: DSC plus professional certification, same as event-based filings.",
      ],
      note:
        "This is a meaningful relief. Earlier, every annual filing needed a DSC and a CA/CS sign-off. Now most directors with stable contact details can complete routine KYC themselves with just OTP verification.",
    },
    {
      id: "07",
      heading: "WHAT HAPPENS IF YOU MISS THE DEADLINE",
      body:
        "Missing your triennial due date triggers the same cascade as before:",
      bullets: [
        "Day after deadline: DIN status changes to 'Deactivated due to non-filing of DIR-3 KYC'.",
        "While deactivated: you cannot sign any e-form. Annual filings, board resolutions, ESOP allotments, every workflow that needs your DSC against your DIN simply rejects.",
        "Cascading damage: companies where you're a director can't file AOC-4, MGT-7, or any other return that requires you as a signatory. They start accumulating Rs 100/day late fees.",
        "To reactivate: file DIR-3 KYC Web with the Rs 5,000 reactivation fee. Once processed (usually 24 to 48 hours), the DIN goes back to Approved.",
      ],
    },
    {
      id: "08",
      heading: "DOCUMENTS YOU NEED FOR EVENT-BASED OR REACTIVATION FILINGS",
      body:
        "If you're filing because of a contact change or to reactivate a DIN, keep these ready:",
      bullets: [
        "Self-attested copy of PAN.",
        "Self-attested copy of Aadhaar (Indian nationals); passport (foreign nationals).",
        "Self-attested proof of present address: utility bill (not older than 2 months), bank statement, or registered rent agreement. Aadhaar address counts if it's current.",
        "Personal mobile number (not company number) with active OTP access.",
        "Personal email address with active OTP access.",
        "Class 3 DSC of the director, registered with their DIN on the MCA portal.",
        "Practising CA, CS, or CMA with their digital signature for the certification component.",
      ],
    },
    {
      id: "09",
      heading: "FOREIGN AND NRI DIRECTORS",
      body:
        "DIR-3 KYC applies to foreign and NRI DIN holders the same as residents. Specific points worth knowing:",
      bullets: [
        "Passport replaces Aadhaar as primary ID. The passport must be valid (not expired) on the date of filing.",
        "Foreign address proof must be apostilled or notarised in the country of residence (Hague Convention countries) or attested by the Indian embassy/consulate (non-Hague countries).",
        "Indian mobile number is not required, foreign mobile works as long as OTP is received and confirmed.",
        "DSC, where required (event-based filings, reactivation), must be Class 3 from an Indian Certifying Authority. Foreign-issued DSCs are not accepted by the MCA portal.",
      ],
    },
    {
      id: "10",
      heading: "COMMON ERRORS WE SEE EVERY KYC SEASON",
      body: "When clients come to us after a deactivation, the cause is usually one of these:",
      bullets: [
        "Mobile or email used in the last KYC is no longer accessible. OTP doesn't reach, filing stalls, deadline passes.",
        "DSC expired. Always check DSC validity at least 15 days before any event-based filing.",
        "Mismatch between PAN name, Aadhaar name, and DIN name. Even a missing initial triggers an objection. Reconcile name records before filing.",
        "Treating routine triennial filing as if eForm DIR-3 KYC still exists. The eForm is gone. Use DIR-3 KYC Web only.",
        "Forgetting to file under Rule 12A(2) within 30 days of a contact change. The triennial cycle does not cover this, and the Rs 5,000 reactivation fee kicks in if your DIN gets deactivated as a result.",
      ],
    },
  ],
  faqs: [
    {
      q: "I have a DIN but I'm not currently a director of any company. Do I still need to file DIR-3 KYC?",
      a: "Yes. The KYC obligation attaches to the DIN holder, not to the director role. Even if you've resigned from every directorship, your DIN remains active and the triennial KYC keeps applying. Some founders don't realize this and end up with deactivated DINs years later when they want to take a new directorship and have to pay the reactivation fee plus a fresh KYC.",
    },
    {
      q: "I changed my mobile number last month. Can I wait till my next triennial cycle?",
      a: "No. Any change in mobile, email, or residential address requires you to file DIR-3 KYC Web under Rule 12A(2) within 30 days, and the Rs 500 fee applies. The triennial cycle continues independently. Missing the 30-day window risks DIN deactivation and pushes you into the Rs 5,000 reactivation track.",
    },
    {
      q: "Is the Rs 5,000 reactivation fee per company or per director?",
      a: "Per director (per DIN). The fee reactivates the DIN itself, which is a person-level identifier. So if you hold a DIN and it's deactivated, you pay Rs 5,000 once to reactivate, regardless of how many companies you're a director of. The company-side late fees on missed annual filings during the deactivation period are separate and add up fast.",
    },
    {
      q: "Do I need a CA or CS to do my routine triennial KYC?",
      a: "Not anymore for routine filings where nothing has changed. The substituted Rule 12A makes routine triennial KYC a self-service OTP confirmation through DIR-3 KYC Web. Professional certification is required only for contact-change filings (Rule 12A(2)) and DIN reactivation. This is one of the most significant simplifications in the December 2025 reform.",
    },
    {
      q: "I had a DIN that was deactivated for non-filing several years ago and I've never reactivated. What happens now?",
      a: "Your DIN is still showing 'Deactivated due to non-filing of DIR-3 KYC' on MCA records. To reactivate, file DIR-3 KYC Web with the Rs 5,000 fee. The DIN itself doesn't expire from non-use, only deactivates. There's no additional penalty for the duration of inactivity, just the reactivation fee. Once reactivated, your next triennial cycle starts fresh.",
    },
  ],
  sources: [
    {
      name: "MCA Notification G.S.R. 943(E) dated 31 December 2025",
      url: "https://www.mca.gov.in/content/mca/global/en/notifications-tender/notifications.html",
      description: "Companies (Appointment and Qualification of Directors) Amendment Rules 2025, substituting Rule 12A. Effective 31 March 2026.",
    },
    {
      name: "Companies (Registration Offices and Fees) Amendment Rules 2026",
      url: "https://www.mca.gov.in/content/mca/global/en/notifications-tender/notifications.html",
      description: "Notified 21 April 2026. Sets the Nil / Rs 5,000 / Rs 500 fee structure for DIR-3 KYC Web filings.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for DIR-3 KYC Web (the only KYC filing channel after 31 March 2026).",
    },
    {
      name: "MCA FAQ on DIR-3 KYC (revised)",
      url: "https://www.mca.gov.in/content/mca/global/en/faq.html",
      description: "Frequently asked questions on the new triennial KYC, deactivation, and reactivation procedures.",
    },
  ],
};
