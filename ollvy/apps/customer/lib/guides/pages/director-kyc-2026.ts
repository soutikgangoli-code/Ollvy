// =============================================================================
// GUIDE PAGE: director-kyc-2026
// File path: lib/guides/pages/director-kyc-2026.ts
// Authored fresh covering DIR-3 KYC compliance, including the major MCA
// notification G.S.R. 943(E) dated 31 December 2025 changing the regime from
// annual to triennial filing, effective 31 March 2026.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const directorKyc2026: LearnPageConfig = {
  slug: "director-kyc-2026",
  title: "DIR-3 KYC for Directors: New Triennial Regime, Penalty, and Reactivation",
  seoTitle: "DIR-3 KYC 2026 | Triennial Filing under Rule 12A | Rs 5,000 Penalty | Ollvy",
  seoDescription:
    "DIR-3 KYC moved from annual to triennial filing per MCA notification G.S.R. 943(E) dated 31 December 2025, effective 31 March 2026. Filing once every 3 years by 30 June. Rs 5,000 penalty for late filing or DIN reactivation. Filed by Ollvy CS team.",
  canonicalUrl: "https://www.ollvy.com/guides/director-kyc-2026",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["dir-3-kyc-filing", "private-limited-incorporation"],
  relatedLearnSlugs: ["dir-3-kyc-explained", "agm-compliance", "mca-annual-filing-aoc-4-mgt-7"],
  ctaServiceSlug: "director-kyc",
  sections: [
    {
      id: "01",
      heading: "WHAT DIR-3 KYC IS",
      body:
        "DIR-3 KYC is the periodic Know Your Customer verification that every individual holding a Director Identification Number (DIN) must complete with the Ministry of Corporate Affairs. It exists under Rule 12A of the Companies (Appointment and Qualification of Directors) Rules 2014. The form verifies your personal details (mobile, email, residential address, PAN, Aadhaar) so the MCA register stays accurate. If you don't file, the MCA system automatically deactivates your DIN, which blocks you from signing any e-form filed with the ministry.",
    },
    {
      id: "02",
      heading: "THE MAJOR CHANGE FROM 31 MARCH 2026: TRIENNIAL FILING",
      body:
        "MCA notification G.S.R. 943(E) dated 31 December 2025 introduced the Companies (Appointment and Qualification of Directors) Amendment Rules 2025, which substituted Rule 12A. From 31 March 2026 onwards, the annual filing requirement has been replaced with a triennial regime. Each director files DIR-3 KYC once every three consecutive financial years, by 30 June of the third year, instead of every 30 September. This was recommended by the High Level Committee on National Financial Reporting Reform to reduce repetitive compliance.",
      bullets: [
        "Old regime: Annual filing by 30 September of every year.",
        "New regime (from 31 March 2026): Once every 3 financial years, by 30 June of the applicable year.",
        "The unified DIR-3 KYC Web form has replaced both the earlier DIR-3 KYC e-Form and the DIR-3 KYC Web. There is now one form for all purposes.",
        "Within 30 days of any change in mobile, email, or residential address, a director must still file DIR-3 KYC Web (separate from the triennial cycle, no fee if filed timely).",
      ],
      note:
        "Even with the triennial regime, the obligation to file does not disappear. If you miss your three-year deadline, your DIN gets deactivated and you'll need to pay the Rs 5,000 reactivation fee.",
    },
    {
      id: "03",
      heading: "WHO HAS TO FILE",
      body:
        "Every individual who has been allotted a DIN, regardless of current director status. The obligation is on the DIN, not on the directorship.",
      bullets: [
        "Active directors of any company.",
        "Resigned directors who still hold a DIN.",
        "Designated partners of LLPs holding a DIN (or DPIN).",
        "Directors of struck-off, dormant, or wound-up companies.",
        "Foreign nationals holding an Indian DIN.",
        "Anyone who obtained a DIN but never joined a board.",
        "Disqualified directors under Section 164 (the disqualification does not exempt from KYC).",
      ],
      note:
        "If you no longer want the DIN, the way to permanently end the filing obligation is to surrender the DIN by filing Form DIR-5. Until then, the triennial KYC obligation continues.",
    },
    {
      id: "04",
      heading: "DUE DATE UNDER THE NEW TRIENNIAL REGIME",
      body:
        "Your three-year cycle depends on your DIN allotment date and the last KYC filing. The MCA has issued official illustrations to help directors identify their next due year. The general principle is: once you've completed a triennial filing, your next is due in the third financial year following, by 30 June.",
      bullets: [
        "If you filed DIR-3 KYC during FY 2025-26 (by 30 September 2025): your next triennial filing is due by 30 June 2029.",
        "If your DIN was allotted in FY 2024-25 or FY 2025-26 and you've completed initial KYC: your next filing is by 30 June of the third FY following.",
        "First-time filers (DIN allotted in current FY): file before the end of that FY.",
      ],
    },
    {
      id: "05",
      heading: "PENALTY: Rs 5,000 FLAT FEE",
      body:
        "Filing within the deadline is free. Missing the deadline triggers a flat Rs 5,000 penalty per DIN, regardless of how late. This is set by the Companies (Registration Offices and Fees) Amendment Rules 2026, notified in the Official Gazette on 21 April 2026. The penalty is non-refundable and per-DIN, so directors holding multiple DINs (e.g., legacy DINs from old companies) pay Rs 5,000 for each.",
      bullets: [
        "Timely filing: Rs 0.",
        "Late filing or DIN reactivation: Rs 5,000 per DIN, flat.",
        "Mid-cycle update of mobile / email / address (separate Rule 12A(2) filing): Rs 500 per filing if filed late beyond the 30-day window.",
      ],
    },
    {
      id: "06",
      heading: "WHAT HAPPENS WHEN YOUR DIN GETS DEACTIVATED",
      body:
        "DIN deactivation has cascading consequences far beyond the Rs 5,000 reactivation fee. While deactivated, the director cannot sign any MCA e-form using their DSC. If that director is the only signatory on AOC-4 or MGT-7, the company's annual filings get blocked. AOC-4 attracts Rs 100 per day delay penalty (no cap). MGT-7 attracts Rs 100 per day plus Section 92(5) statutory penalty. A 3-month DIN deactivation can cascade into Rs 18,000 of company-level filing delays on top of the Rs 5,000 director penalty.",
      table: {
        headers: ["Day", "Direct Cost", "Cascading Cost"],
        rows: [
          ["Day 1 (deadline missed)", "Rs 5,000 reactivation fee", "DIN deactivated, MCA filings blocked"],
          ["Day 30", "Rs 5,000", "Rs 3,000 AOC-4 delay + Rs 3,000 MGT-7 delay"],
          ["Day 90", "Rs 5,000", "Rs 9,000 AOC-4 + Rs 9,000 MGT-7 + risk of statutory penalty"],
          ["Day 180+", "Rs 5,000", "Cascading risk into ITR-6, GST annual return"],
        ],
      },
    },
    {
      id: "07",
      heading: "FILING PROCESS",
      body:
        "DIR-3 KYC Web is filed online through the MCA-21 V3 portal. The unified form (post-31 March 2026) handles routine triennial filing, mid-cycle updates, and DIN reactivation through the same interface.",
      bullets: [
        "Step 1: Log in to MCA-21 V3 portal with your DIN credentials.",
        "Step 2: Open DIR-3 KYC Web. Verify pre-filled details (DIN, name, DOB, citizenship).",
        "Step 3: Update mobile and email if changed. OTPs sent to both for verification.",
        "Step 4: Confirm residential address. Upload supporting document if changed (Aadhaar, passport, utility bill).",
        "Step 5: Sign with DSC if details have changed (otherwise OTP verification suffices for routine filing).",
        "Step 6: Pay fee if applicable (Rs 0 if on time, Rs 5,000 if late).",
        "Step 7: Submit. Download SRN acknowledgement.",
      ],
      note:
        "If you're filing for the first time, or reactivating a deactivated DIN, the filing requires CA / CS / CMA certification. Routine triennial filings without changes can be self-completed via OTP.",
    },
    {
      id: "08",
      heading: "INTERNATIONAL DIRECTORS AND SPECIAL CASES",
      body:
        "Foreign nationals holding an Indian DIN comply with the same triennial KYC. Their filings need apostilled or notarised identity and address proof. Disqualified directors (Section 164) continue to be subject to KYC even though their directorship may be invalid. Directors of struck-off companies remain DIN holders until they surrender the DIN, so KYC continues. The single exception is directors who actively file DIR-5 to surrender their DIN.",
    },
  ],
  faqs: [
    {
      q: "Did the rules really change to triennial filing?",
      a: "Yes. MCA notification G.S.R. 943(E) dated 31 December 2025 substituted Rule 12A under the Companies (Appointment and Qualification of Directors) Amendment Rules 2025. From 31 March 2026 onwards, DIR-3 KYC is filed once every 3 financial years by 30 June of the applicable year, instead of annually. The Rs 5,000 penalty for missing the cycle deadline is unchanged.",
    },
    {
      q: "When is my next DIR-3 KYC due?",
      a: "It depends on when you last filed. If you completed an annual DIR-3 KYC in FY 2025-26 (by 30 September 2025), your next triennial filing is by 30 June 2029. If your DIN was allotted in the current FY, your first KYC is due by the end of that FY. The MCA has issued illustrative tables to help directors identify their cycle position.",
    },
    {
      q: "What happens if I miss the deadline?",
      a: "Your DIN is automatically deactivated. To reactivate, you file the unified DIR-3 KYC Web form and pay a Rs 5,000 flat penalty per DIN. While deactivated, you cannot sign any MCA e-form using your DSC, which can block your company's other filings (AOC-4, MGT-7) and trigger cascading penalties of Rs 100 per day per form.",
    },
    {
      q: "I resigned from all my directorships. Do I still file?",
      a: "Yes, as long as you hold a DIN, the KYC obligation continues. Resignation from directorships does not end the obligation. To permanently stop the KYC requirement, you must surrender your DIN by filing Form DIR-5. Until DIR-5 is filed and accepted, you keep the triennial KYC duty.",
    },
    {
      q: "What if my mobile or email changes mid-cycle?",
      a: "Within 30 days of the change, you file DIR-3 KYC Web specifically to update the contact information. This is a separate filing under Rule 12A(2), not a replacement for the triennial filing. If filed within 30 days, no fee. Late updates beyond 30 days carry a Rs 500 fee.",
    },
  ],
  sources: [
    {
      name: "MCA Notification G.S.R. 943(E) dated 31 December 2025",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/notifications.html",
      description: "Companies (Appointment and Qualification of Directors) Amendment Rules 2025 substituting Rule 12A and replacing annual KYC with triennial filing, effective 31 March 2026.",
    },
    {
      name: "Companies (Registration Offices and Fees) Amendment Rules 2026",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/notifications.html",
      description: "Notified 21 April 2026, prescribing the Rs 5,000 flat fee for late DIR-3 KYC filing or DIN reactivation, and Rs 500 fee for mid-year updates.",
    },
    {
      name: "Companies (Appointment and Qualification of Directors) Rules 2014, Rule 12A",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Statutory basis for periodic director KYC, post-substitution covering both triennial filing and mid-cycle updates.",
    },
    {
      name: "Companies Act 2013, Section 153 (DIN allotment) and Section 164 (disqualification)",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Underlying provisions for DIN as an identifier and disqualification of directors, both of which continue to require KYC.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Online portal for DIR-3 KYC Web filing with OTP verification and DSC signing.",
    },
  ],
};
