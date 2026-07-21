// =============================================================================
// GUIDE PAGE: lut-renewal-2027
// File path: lib/guides/pages/lut-renewal-2027.ts
// LUT (Letter of Undertaking) renewal for FY 2027-28 under Rule 96A. File on
// the GST portal before 1 April 2027, ahead of the first zero-rated invoice.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const lutRenewal2027: LearnPageConfig = {
  slug: "lut-renewal-2027",
  title: "LUT Renewal for FY 2027-28: File Before 1 April 2027",
  seoTitle: "LUT Renewal FY 2027-28 | File Before 1 April 2027 | Ollvy",
  seoDescription:
    "Renew your GST LUT for FY 2027-28 before 1 April 2027 to keep exporting without IGST. Miss it and you pay IGST upfront and wait months for the refund.",
  canonicalUrl: "https://www.ollvy.com/guides/lut-renewal-2027",
  lastReviewed: "July 2026",
  category: "GST Filing",
  relatedServiceSlugs: ["gst-monthly", "gst-registration", "iec-code"],
  relatedLearnSlugs: [
    "lut-for-exports",
    "iec-annual-update-2027",
    "do-i-need-gst-registration",
    "iec-import-export-code",
  ],
  ctaServiceSlug: "gst-monthly",
  sections: [
    {
      id: "01",
      heading: "WHY THE LUT NEEDS RENEWING BEFORE 1 APRIL 2027",
      body:
        "A Letter of Undertaking (LUT) under Rule 96A of the CGST Rules is valid for one financial year only, so the LUT covering FY 2026-27 dies on 31 March 2027 regardless of when during the year it was filed. To keep exporting goods or services without paying IGST from 1 April 2027, you need a fresh LUT for FY 2027-28 on the GST portal before your first zero-rated invoice of the new year, which practically means filing by 31 March 2027. The filing is free, online in Form GST RFD-11, and usually auto-acknowledged in minutes. The cost of forgetting is not a penalty; it is IGST out of your working capital on every export until the new LUT is in place.",
    },
    {
      id: "02",
      heading: "WHO NEEDS TO RENEW",
      body:
        "Anyone making zero-rated supplies without payment of IGST needs a live LUT at the moment of supply:",
      bullets: [
        "Goods exporters shipping under LUT instead of paying IGST and claiming rebate.",
        "Service exporters: SaaS companies, IT services, design studios, consultants, and freelancers billing foreign clients in convertible foreign exchange (or INR where permitted by RBI).",
        "Suppliers to SEZ units and SEZ developers, whose supplies are zero-rated the same way.",
        "Merchant exporters procuring at the concessional rate and exporting under LUT.",
      ],
      note:
        "Eligibility is broad: any registered person can file an LUT except one prosecuted for tax evasion exceeding Rs 2.5 crore, who must furnish a bond with bank guarantee instead. For nearly every genuine exporter, the LUT route is available.",
    },
    {
      id: "03",
      heading: "WHAT HAPPENS IF YOU EXPORT WITHOUT A VALID LUT",
      body:
        "Two scenarios, both worse than a two-minute renewal:",
      bullets: [
        "You pay IGST on exports and claim refund: legal, but you finance the government in the meantime. On Rs 50 lakh of quarterly exports at 18%, that is Rs 9 lakh locked up per quarter, with refunds typically taking weeks to months to flow back.",
        "You export without LUT and without paying IGST: Rule 96A treats the shipment as one where the undertaking conditions are unmet. The exposure is the IGST that should have been paid, plus interest at 18% per annum, and the position stays irregular until an LUT is regularised or tax is paid.",
        "For service exporters, an invoice raised on 3 April 2027 with no FY 2027-28 LUT already carries the defect. Backdating is not possible; the LUT applies from filing.",
      ],
      note:
        "Departmental practice on condoning a late LUT varies by jurisdiction. Some officers accept an LUT filed shortly after 1 April as covering the gap; nothing in the rules guarantees it. Filing in March removes the argument entirely.",
    },
    {
      id: "04",
      heading: "HOW TO FILE THE FY 2027-28 LUT: STEP BY STEP",
      body:
        "The renewal is one of the simplest filings on the GST portal:",
      bullets: [
        "Log in to gst.gov.in and go to Services > User Services > Furnish Letter of Undertaking (LUT).",
        "Select financial year 2027-28. The form is GST RFD-11.",
        "If you filed an LUT for FY 2026-27, upload it where the portal asks for the previous LUT (a PDF of the acknowledgement works).",
        "Enter two independent witnesses with names, occupations, and addresses. Employees or partners are commonly used; they are witnesses to the undertaking, not guarantors.",
        "Sign with DSC or EVC of the authorised signatory and submit. The acknowledgement with ARN generates immediately in most cases.",
        "Save the ARN and acknowledgement PDF. Quote the LUT ARN on export invoices for FY 2027-28 alongside the declaration that supply is made without payment of IGST under LUT.",
      ],
    },
    {
      id: "05",
      heading: "WHAT YOU ARE ACTUALLY UNDERTAKING",
      body:
        "The LUT is not a formality without content. In RFD-11 you undertake that: goods will be exported out of India within 3 months of the invoice date (or the extended period the Commissioner allows), payment for service exports will be received in convertible foreign exchange (or permitted INR) within 1 year, and that you will pay IGST with 18% interest if these conditions fail. For service exporters, the 1-year realisation condition is the live one: an unpaid foreign invoice ageing past a year technically triggers the undertaking. Track receivables against it, and document write-offs and RBI-permitted extensions where they occur.",
    },
    {
      id: "06",
      heading: "THE RENEWAL CALENDAR PROBLEM",
      body:
        "The LUT is a classic once-a-year filing with no portal reminder and no return tied to it, which is why it gets missed more often than monthly returns. The pattern that works:",
      bullets: [
        "File the FY 2027-28 LUT in the first half of March 2027, once the portal opens the new financial year selection.",
        "Do not wait for 1 April: the LUT can be filed in advance and takes effect for the new year, and March filing means no gap even if the portal misbehaves.",
        "Put the renewal in the same compliance calendar slot as other year-end items; it pairs naturally with the IEC annual update window that opens 1 April.",
        "If Ollvy manages your GST filings, the LUT renewal is filed as part of the March cycle with the ARN shared for your invoice template.",
      ],
    },
    {
      id: "07",
      heading: "LUT vs PAYING IGST AND CLAIMING REFUND",
      body:
        "Exporters always have two routes, and the LUT is optional in the sense that the IGST-refund route exists. The comparison is lopsided for most businesses:",
      table: {
        headers: ["Aspect", "Under LUT (Rule 96A)", "Pay IGST and refund (Rule 96)"],
        rows: [
          ["Cash outflow at export", "None", "IGST at applicable rate (commonly 18% for services)"],
          ["Working capital impact", "Nil", "Tax locked until refund is processed"],
          ["Paperwork per period", "One LUT per financial year", "Refund tracking per shipment / period"],
          ["When it can still make sense", "Default for most exporters", "Exporters with large unutilised ITC preferring the rebate mechanics"],
        ],
      },
    },
    {
      id: "08",
      heading: "COMMON RENEWAL MISTAKES",
      body:
        "The errors we see every April:",
      bullets: [
        "Assuming the LUT auto-renews. It never does; validity is strictly the financial year selected in RFD-11.",
        "Raising the first April invoices under the old LUT ARN. The FY 2026-27 ARN on an FY 2027-28 invoice is a defect visible in any scrutiny.",
        "New GSTINs of the same business not filing their own LUT. The LUT is per registration, so a second state registration needs its own RFD-11.",
        "Filing the LUT but never quoting the ARN on invoices, then struggling to evidence the LUT linkage during refund or audit.",
        "SEZ suppliers assuming LUT is only for out-of-country exports. Zero-rated SEZ supplies without IGST also ride on the LUT.",
      ],
    },
  ],
  faqs: [
    {
      q: "When exactly should I file the LUT for FY 2027-28?",
      a: "In March 2027, before the financial year starts. The portal allows advance filing for the coming year, and a March filing guarantees zero gap. The hard requirement is having a live LUT before your first zero-rated supply of FY 2027-28; for most exporters that is the first invoice raised in April.",
    },
    {
      q: "Is there a government fee or penalty involved in LUT filing?",
      a: "No fee, and no late fee either, because the LUT has no statutory due date; it simply must exist before you make zero-rated supplies without IGST. The financial consequence of a gap is indirect: IGST outflow with refund lag, or an 18% interest exposure under Rule 96A if you exported without paying IGST and without a valid LUT.",
    },
    {
      q: "I forgot to renew and raised export invoices in April 2027 without an LUT. What now?",
      a: "File the FY 2027-28 LUT immediately, then regularise the gap invoices. Options: pay IGST on those supplies and claim refund, or make a written submission to your jurisdictional officer seeking acceptance of the LUT as covering the interim, which some jurisdictions allow for short gaps. Do not simply continue as if covered; the gap surfaces in refund scrutiny and audits.",
    },
    {
      q: "I am a freelancer billing US clients Rs 30 lakh a year. Do I really need this?",
      a: "If you are GST-registered and treating your services as zero-rated exports without charging IGST, yes: that treatment legally rides on a live LUT. The renewal takes minutes and costs nothing. Without it, the correct treatment of your invoices is payment of IGST, which for a services freelancer is 18% of billings out of pocket until refunded.",
    },
    {
      q: "Does the LUT cover multiple GST registrations of my company?",
      a: "No. The LUT is furnished per GSTIN. If you hold registrations in Karnataka and Maharashtra, each files its own RFD-11 for FY 2027-28. A common audit finding in multi-state companies is one state exporting under a sister registration's LUT, which does not work.",
    },
    {
      q: "What if my foreign client has not paid an invoice within one year?",
      a: "The RFD-11 undertaking assumes service export payment is realised within 1 year. Where realisation is delayed beyond that, the conservative reading is that IGST with 18% interest becomes payable on that supply, subject to RBI-permitted extensions of the realisation period. Track ageing receivables against export invoices, and take advice before writing anything off.",
    },
    {
      q: "Can the LUT be rejected?",
      a: "Filings are generally deemed accepted on submission with immediate ARN generation, and rejection is rare. The disqualification to know: prosecution for tax evasion above Rs 2.5 crore pushes you to the bond-with-bank-guarantee route instead of the LUT. If your RFD-11 sits unacknowledged, follow up with the jurisdictional officer rather than exporting on assumption.",
    },
  ],
  sources: [
    {
      name: "CGST Rules 2017, Rule 96A",
      url: "https://cbic-gst.gov.in/",
      description: "Export under LUT without payment of IGST, conditions, and the interest consequence on unmet conditions.",
    },
    {
      name: "GST Portal - Furnish LUT (Form GST RFD-11)",
      url: "https://www.gst.gov.in/",
      description: "Online filing route: Services > User Services > Furnish Letter of Undertaking.",
    },
    {
      name: "CBIC Circular 8/8/2017-GST",
      url: "https://cbic-gst.gov.in/",
      description: "Clarifications on LUT eligibility, the Rs 2.5 crore prosecution disqualification, and acceptance process.",
    },
  ],
};
