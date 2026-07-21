// =============================================================================
// GUIDE PAGE: iec-annual-update-2027
// File path: lib/guides/pages/iec-annual-update-2027.ts
// Mandatory annual IEC update / confirmation on the DGFT portal, window
// 1 April to 30 June 2027. Miss it and the IEC is deactivated.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const iecAnnualUpdate2027: LearnPageConfig = {
  slug: "iec-annual-update-2027",
  title: "IEC Annual Update 2027: Confirm Your IEC Between 1 April and 30 June",
  seoTitle: "IEC Annual Update 2027 | 1 April to 30 June | DGFT | Ollvy",
  seoDescription:
    "Confirm your IEC on the DGFT portal between 1 April and 30 June 2027, even with no changes. Miss it and the IEC is deactivated, halting all trade.",
  canonicalUrl: "https://www.ollvy.com/guides/iec-annual-update-2027",
  lastReviewed: "July 2026",
  category: "Licensing",
  relatedServiceSlugs: ["iec-code"],
  relatedLearnSlugs: [
    "iec-import-export-code",
    "lut-renewal-2027",
    "lut-for-exports",
  ],
  ctaServiceSlug: "iec-code",
  sections: [
    {
      id: "01",
      heading: "THE OBLIGATION: CONFIRM YOUR IEC EVERY YEAR, EVEN IF NOTHING CHANGED",
      body:
        "Every Importer-Exporter Code holder must update and confirm their IEC details on the DGFT portal each year between April and June, and for 2027 that window runs 1 April to 30 June 2027. The requirement comes from DGFT Notification 58/2015-2020, which amended the Foreign Trade Policy to make the annual electronic update mandatory, explicitly including the case where there is nothing to change: you log in and confirm the details as-is. The update is free of charge when done within the April-June window. Miss it and DGFT deactivates the IEC, which is not a fine you pay later; it is a switch that stops your imports, exports, and trade remittances until you fix it.",
    },
    {
      id: "02",
      heading: "WHO THIS APPLIES TO",
      body:
        "Everyone holding an IEC, active trader or not:",
      bullets: [
        "Goods importers and exporters, from single-proprietor traders to large companies.",
        "Service exporters holding an IEC for remittance and benefit purposes (SaaS, IT services, consultants). Many took an IEC years ago for a specific requirement and forget it exists.",
        "E-commerce sellers shipping abroad through courier or postal exports.",
        "Businesses with a dormant IEC and no current trade: the update obligation attaches to holding the code, not using it. A dormant IEC skipping the update gets deactivated like any other.",
      ],
      note:
        "If the IEC genuinely has no future use, surrendering it is cleaner than letting it cycle through deactivation. But businesses that might import a machine or sign a foreign client within a year should keep it live; reviving paperwork mid-deal is the worst timing.",
    },
    {
      id: "03",
      heading: "WHAT DEACTIVATION ACTUALLY BREAKS",
      body:
        "The IEC is the key that customs and banks check on every cross-border trade transaction. When DGFT flags it deactivated:",
      bullets: [
        "Import consignments cannot be cleared: the Bill of Entry fails against an inactive IEC, and goods sit at port accruing demurrage that routinely runs into thousands of rupees per day.",
        "Export shipping bills cannot be filed, so shipments do not leave.",
        "Banks (AD banks) block trade transactions against the IEC: outward remittances for imports and inward remittance processing tied to trade documentation stall.",
        "Export incentives and scrip claims linked to the IEC freeze.",
        "For service exporters, client payments themselves may arrive, but any process that validates the IEC (remittance certificates, benefit claims) hits the wall.",
      ],
      note:
        "This is why June and July generate panic searches every year: the deactivation lands mid-shipment, not at a convenient moment. The fix is quick, but a vessel does not wait for it.",
    },
    {
      id: "04",
      heading: "HOW TO DO THE UPDATE: 15 MINUTES ON THE DGFT PORTAL",
      body:
        "The process is fully online at dgft.gov.in:",
      bullets: [
        "Log in to the DGFT portal with the registered credentials. If the login was created by a consultant years ago, recovering access is step zero; do it in April, not on 29 June.",
        "Go to Services > IEC Profile Management > Update IEC.",
        "The form pre-fills the current details: entity name, PAN, address, bank account, directors/partners/proprietor, contact details.",
        "Correct anything outdated (new registered office, changed bank account, director changes) or leave everything untouched if accurate.",
        "Submit with Aadhaar OTP e-sign or DSC of the authorised person.",
        "The portal confirms the update; the IEC profile shows the updated-for-the-year status. Save the acknowledgement.",
      ],
      note:
        "Within the 1 April to 30 June window the update is free. The same 15-minute task done after deactivation involves the extra step of the IEC reactivating only after the update goes through, with your shipments waiting on it.",
    },
    {
      id: "05",
      heading: "MISSED THE WINDOW: HOW REACTIVATION WORKS",
      body:
        "If 30 June 2027 passes without the update, DGFT deactivates the IEC in the routine post-window run. Reactivation is by doing the same update: log in, complete the IEC update, submit, and the code is reactivated and transmitted back to customs systems, ordinarily automatically and without a penalty fee under the current policy. Practical friction fills the gap the rules leave: the customs (ICEGATE) systems can take time to reflect reactivation, port charges on stuck cargo keep accruing meanwhile, and if your portal access or e-sign is broken, each recovery step adds days. Treat reactivation as a same-week emergency, and the annual update as the 10-minute insurance against ever needing it.",
    },
    {
      id: "06",
      heading: "WHAT TO CHECK WHILE YOU ARE IN THERE",
      body:
        "Since the annual update forces a login anyway, use it to true-up the profile details that cause downstream trade friction:",
      bullets: [
        "Address: customs registrations and AD bank records key off the IEC address; an office move never updated causes document mismatches in clearance.",
        "Bank account: the account linked for trade transactions and incentive credits should be the live operational account.",
        "Directors / partners: MCA-side changes do not flow to DGFT automatically; stale names surface at awkward diligence moments.",
        "Mobile and email: DGFT's deactivation warnings and OTPs go to what is on file. Most missed-deadline stories start with a dead registered email.",
        "PAN-linked details: the IEC is PAN-based; name mismatches with PAN records block updates and need fixing at the source.",
      ],
    },
    {
      id: "07",
      heading: "KEEP, UPDATE, OR SURRENDER: THE DORMANT-IEC DECISION",
      body:
        "If you are updating an IEC you have not used in years, make the keep-or-surrender call deliberately rather than defaulting into another annual cycle. The decision usually resolves on three questions: is there any realistic import (even a one-off equipment purchase) or foreign-client billing in the next 12 to 18 months; does any bank, marketplace, or benefit scheme you use validate the IEC; and is the entity itself continuing. If all three are no, surrender through the DGFT portal ends the annual obligation cleanly, and a fresh IEC can be obtained later in a day or two if circumstances change. If any answer is yes, the 15-minute annual confirmation is far cheaper than a deactivation discovered mid-transaction. What has no upside is the third path most defaulters take: keeping the code and ignoring it.",
    },
    {
      id: "08",
      heading: "PAIR IT WITH THE LUT: THE EXPORTER'S APRIL CHECKLIST",
      body:
        "For exporters, the IEC update window opens on 1 April 2027, the day after the GST LUT for FY 2027-28 should already be in place. Run the two as one checklist: LUT filed in March 2027 (so zero-rated invoicing continues uninterrupted), IEC confirmed in April 2027 (so shipments and remittances continue uninterrupted). Both are free, both take minutes, and both have failure modes measured in lakhs of blocked working capital. Service exporters holding both a GSTIN and an IEC need both even though only the LUT affects invoicing.",
    },
  ],
  faqs: [
    {
      q: "Nothing in my IEC has changed. Do I seriously have to do this?",
      a: "Yes. Notification 58/2015-2020 makes the annual update mandatory even where all details are unchanged; the no-change case is a login-and-confirm exercise. Skipping it because nothing changed is precisely how compliant, dormant-profile IECs get deactivated every July.",
    },
    {
      q: "What are the exact dates for 2027?",
      a: "The window is 1 April 2027 to 30 June 2027, and within it the update is free. IECs not updated by the close of the window are liable to deactivation in DGFT's post-June run. The same April-June window recurs every year.",
    },
    {
      q: "Is there a penalty fee for missing it?",
      a: "There is no monetary fine under the current policy; the sanction is deactivation itself. The real costs are consequential: demurrage on stuck import containers, missed shipment cut-offs, blocked bank trade transactions, and the scramble to restore portal access under time pressure.",
    },
    {
      q: "My IEC was deactivated. How long does reactivation take?",
      a: "The DGFT-side reactivation follows successful completion of the update, ordinarily automatically. The tail is systems and access: transmission to ICEGATE can lag, and recovering lost portal credentials or fixing an Aadhaar e-sign mismatch can take days. With clean access, same-day to a few days is realistic; with broken access, budget a week and start immediately.",
    },
    {
      q: "I only export services. My money arrives fine. Can I ignore the IEC?",
      a: "If you hold an IEC, update it; deactivation will surface exactly when you need an IEC-validated process such as remittance certificates or benefit claims. If you are certain the IEC has no future use, formally surrender it on the DGFT portal instead of ignoring it. What to avoid is the middle path of holding it and letting it rot.",
    },
    {
      q: "Who in the company can do the update?",
      a: "Anyone with the DGFT portal login and the ability to e-sign: Aadhaar OTP of the proprietor/director/partner on record, or the entity's DSC. It is a 15-minute task done in-house if credentials are in order. Ollvy handles it as part of IEC services where access recovery or detail corrections are involved.",
    },
    {
      q: "We updated in May 2026. Does that cover us for 2027?",
      a: "No. The confirmation is annual. An update in the April-June 2026 window covered that cycle; the 2027 cycle needs its own confirmation between 1 April and 30 June 2027. Put it in the compliance calendar as a recurring April task alongside the LUT check.",
    },
  ],
  sources: [
    {
      name: "DGFT Notification 58/2015-2020",
      url: "https://www.dgft.gov.in/CP/",
      description: "Amendment to the Foreign Trade Policy mandating annual electronic IEC updation, including where details are unchanged, with deactivation for non-compliance.",
    },
    {
      name: "DGFT Portal - IEC Profile Management",
      url: "https://www.dgft.gov.in/",
      description: "Online channel for the annual IEC update and reactivation after deactivation.",
    },
    {
      name: "Taxscan - DGFT IEC updation reminders",
      url: "https://www.taxscan.in/",
      description: "Coverage of DGFT's annual reminders and deactivation drives for IECs not updated in the April-June window.",
    },
  ],
};
