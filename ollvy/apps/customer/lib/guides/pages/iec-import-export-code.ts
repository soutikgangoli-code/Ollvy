// =============================================================================
// GUIDE PAGE: iec-import-export-code
// File path: lib/guides/pages/iec-import-export-code.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const iecImportExportCode: LearnPageConfig = {
  slug: "iec-import-export-code",
  title: "IEC (Import Export Code) in India: When You Need It and How to Get It",
  seoTitle: "IEC Import Export Code 2026 | DGFT Registration Guide | Ollvy",
  seoDescription:
    "Complete guide to IEC (Import Export Code). Who needs it, how it differs from GST, AD Code follow-up, application via DGFT, annual update requirement. Filed by Ollvy in 5 days.",
  canonicalUrl: "https://www.ollvy.com/guides/iec-import-export-code",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["iec-code", "gst-registration"],
  relatedLearnSlugs: ["lut-for-exports", "is-msme-registration-worth-it"],
  ctaServiceSlug: "iec-code",
  ctaSecondarySlug: "gst-registration",
  sections: [
    {
      id: "01",
      heading: "WHAT IEC IS, IN ONE LINE",
      body:
        "IEC stands for Import Export Code. It's a 10-digit number issued by the Directorate General of Foreign Trade (DGFT) and it's mandatory for any business in India that wants to import goods, export goods, or receive most foreign currency for services. Without IEC, customs won't clear your container and your bank won't credit a foreign wire.",
    },
    {
      id: "02",
      heading: "WHO NEEDS IEC",
      body:
        "If your business does any of the following, you need IEC before you start.",
      bullets: [
        "Imports any goods into India for resale, manufacturing or use.",
        "Exports any goods out of India to a foreign buyer.",
        "Receives foreign payment for export of services where the recipient is required to be DGFT-registered (most B2B service exports above small thresholds).",
        "Operates as a freelancer or consultant invoicing foreign clients above small thresholds, where banks require IEC for FIRC processing.",
      ],
      note:
        "Personal imports (one-off goods for personal use) and certain government departments don't need IEC. Almost every commercial entity does.",
    },
    {
      id: "03",
      heading: "HOW IEC DIFFERS FROM GST",
      body:
        "Founders often conflate the two because both involve government registration and both touch cross-border trade. They're separate.",
      table: {
        headers: ["Aspect", "GST", "IEC"],
        rows: [
          ["Issuing authority", "GSTN / state tax dept", "DGFT (Ministry of Commerce)"],
          ["Purpose", "Domestic indirect tax", "Cross-border trade authorisation"],
          ["Threshold", "Rs 20L/40L turnover", "No threshold, mandatory once you cross border"],
          ["Renewal", "Annual return GSTR-9", "Annual update on DGFT portal (April–June)"],
          ["Penalty", "Late fees + interest", "Cannot import/export, customs holds shipments"],
        ],
      },
    },
    {
      id: "04",
      heading: "WHAT YOU GET",
      body:
        "Your IEC is a 10-digit code, generally identical to your PAN. The DGFT portal also issues an IEC certificate (PDF) showing the entity name, address, directors/partners/proprietors, and authorised modes of trade. The IEC sits on a DGFT account, and you'll log in periodically to update it.",
    },
    {
      id: "05",
      heading: "DOCUMENTS NEEDED FOR APPLICATION",
      body:
        "The DGFT IEC application is fully online and runs on Aadhaar/DSC e-signature. You'll need digital copies of:",
      bullets: [
        "PAN of the business (proprietor's PAN for proprietorships).",
        "Aadhaar of the proprietor / managing partner / managing director.",
        "Bank certificate or cancelled cheque showing entity name and account number.",
        "Address proof of the principal place of business (electricity bill, rent agreement, NOC).",
        "Digital signature certificate (Class 3) for the authorised signatory, or Aadhaar e-sign.",
      ],
    },
    {
      id: "06",
      heading: "AD CODE: THE FOLLOW-UP STEP",
      body:
        "IEC alone isn't enough to actually import or export. You also need to register your bank's Authorised Dealer (AD) Code with the customs port you'll use. Each port-specific AD Code registration links your IEC to your bank account at that port, allowing customs to release shipments and your bank to receive funds. AD Code registration is done at each customs port separately, with a one-time formality.",
      note:
        "Many founders get IEC, attempt their first export, and discover at the port that AD Code registration is missing. Plan AD Code registration immediately after IEC, before your first shipment.",
    },
    {
      id: "07",
      heading: "ANNUAL UPDATE REQUIREMENT",
      body:
        "Since 2021, IEC must be updated every year between April and June, even if no details have changed. The update is a confirmation that the IEC is still active. Skip the update and the IEC is automatically deactivated, blocking all imports and exports until reactivation. Reactivation is straightforward but the gap can disrupt scheduled shipments.",
    },
    {
      id: "08",
      heading: "IEC FOR SERVICE EXPORTS",
      body:
        "Service exports (consulting, software, design) are technically not 'goods' but most banks require an IEC before processing FIRC (Foreign Inward Remittance Certificate) for service-export receipts. SOFTEX filings under SEZ/STPI also require IEC. So if you're a freelancer or services agency invoicing foreign clients, get IEC even though you're not crossing customs in the traditional sense.",
    },
    {
      id: "09",
      heading: "WHEN YOU CAN OPERATE WITHOUT IEC",
      body:
        "A short list of cases where IEC is genuinely not needed.",
      bullets: [
        "Personal imports of goods for individual use, not for resale or business.",
        "Export of services where you receive payment in INR (rare in practice).",
        "Imports/exports by government departments and certain notified bodies.",
        "Small e-commerce shipments via courier / postal mode below per-shipment thresholds, though most platforms require IEC anyway.",
      ],
    },
  ],
  faqs: [
    {
      q: "How long does IEC application take?",
      a: "Same-day to 2 working days if all documents are ready and the PAN-Aadhaar linkage is clean. We typically file within 24 hours of getting documents and the IEC certificate downloads from the DGFT portal once approved.",
    },
    {
      q: "Is IEC the same number as PAN?",
      a: "Effectively yes. Since 2017, the IEC issued is identical to the PAN of the entity. The PDF certificate from DGFT is what you actually use as proof, and the 10-digit code on it matches PAN.",
    },
    {
      q: "Do I need a separate IEC if I have multiple businesses?",
      a: "Each PAN gets one IEC. If your different businesses run on different PANs (e.g., proprietorship vs Pvt Ltd vs LLP), each entity gets its own IEC. You can't share IEC across PANs.",
    },
    {
      q: "What if I forget the annual update?",
      a: "DGFT deactivates IEC automatically if not updated between April and June. Reactivation requires logging in, completing the pending update, and waiting for the system to reflect the active status. No financial penalty, but the deactivation pause can delay shipments.",
    },
    {
      q: "Can a foreigner with an Indian-registered business get IEC?",
      a: "Yes. Indian Pvt Ltds with foreign directors or shareholders can apply for IEC normally. The IEC sits on the company PAN, not the individual director's nationality.",
    },
    {
      q: "Does IEC have any cost?",
      a: "DGFT charges a Rs 500 application fee plus Rs 200 for any modification later. There's no annual fee, only the annual update which is free if done within the window.",
    },
  ],
  sources: [
    {
      name: "Directorate General of Foreign Trade",
      url: "https://www.dgft.gov.in/",
      description: "Official DGFT portal for IEC application and updates.",
    },
    {
      name: "Foreign Trade (Development and Regulation) Act, 1992",
      url: "https://www.dgft.gov.in/CP/?opt=ft-act",
      description: "Statutory basis for IEC requirement.",
    },
    {
      name: "RBI Master Direction on Export of Goods and Services",
      url: "https://www.rbi.org.in/",
      description: "AD Code, FIRC and foreign exchange procedures.",
    },
  ],
};
