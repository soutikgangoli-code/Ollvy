// =============================================================================
// GUIDE PAGE: lut-for-exports
// File path: lib/guides/pages/lut-for-exports.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const lutForExports: LearnPageConfig = {
  slug: "lut-for-exports",
  title: "LUT for Exports: How to Export GST-Free Without IGST Refund Hassles",
  seoTitle: "LUT for Exports India 2026 | Letter of Undertaking GST | Ollvy",
  seoDescription:
    "Complete guide to LUT (Letter of Undertaking) for GST-free exports. Eligibility, annual filing, LUT vs IGST refund route, application via GST portal. Filed by Ollvy in 3 days.",
  canonicalUrl: "https://www.ollvy.com/guides/lut-for-exports",
  lastReviewed: "May 2026",
  category: "GST",
  relatedServiceSlugs: ["lut-filing", "gst-registration", "iec-registration"],
  relatedLearnSlugs: [
    "iec-import-export-code",
    "gst-cancellation",
  ],
  ctaServiceSlug: "lut-filing",
  ctaSecondarySlug: "gst-registration",
  sections: [
    {
      id: "01",
      heading: "WHAT LUT ACTUALLY IS",
      body:
        "LUT stands for Letter of Undertaking. It's an annual declaration filed on the GST portal by exporters who want to ship goods or services out of India without paying IGST upfront. The undertaking says: I'll comply with all export procedures, and if I don't, I'll pay the IGST plus interest. With an LUT in place, your zero-rated export invoices can be raised without any GST loaded onto them. Without one, you have to pay IGST on every export and then claim it back as a refund, which ties up cash.",
    },
    {
      id: "02",
      heading: "LUT VERSUS IGST REFUND ROUTE",
      body:
        "Under GST, exports are zero-rated, which gives you two equally legal options.",
      table: {
        headers: ["Option", "How it works", "Cash flow impact"],
        rows: [
          [
            "LUT route (preferred)",
            "File LUT once a year, then export without GST",
            "No GST paid on exports, no refund needed",
          ],
          [
            "IGST refund route",
            "Pay IGST on every export, claim refund later",
            "GST locked up for 60–90 days per shipment",
          ],
        ],
      },
      note:
        "For software, services and SaaS exporters, the LUT route is essentially mandatory because the IGST refund route involves submitting BRC/FIRC and other paperwork on each export which gets impractical at volume.",
    },
    {
      id: "03",
      heading: "WHO CAN FILE LUT",
      body:
        "Any GST-registered exporter is eligible, with a few exceptions.",
      bullets: [
        "Both goods exporters and service exporters can file LUT.",
        "SEZ developers and SEZ units exporting from India are eligible.",
        "There's no minimum turnover threshold.",
        "The exporter must not have been prosecuted under GST law for tax evasion above Rs 2.5 crore in the past, otherwise the IGST route is the only option.",
      ],
    },
    {
      id: "04",
      heading: "WHEN LUT IS FILED",
      body:
        "LUT is valid for a financial year. So an LUT filed for FY 2026-27 covers exports made between 1 April 2026 and 31 March 2027. A new LUT must be filed each year, ideally before 1 April so there's no gap in coverage. Filings between April and June for the current FY are accepted but exports made in the gap days have to use the IGST route.",
      note:
        "For first-time exporters, file LUT as soon as you register your first export-related GSTIN. Don't wait for the first shipment.",
    },
    {
      id: "05",
      heading: "HOW TO FILE LUT (THE ACTUAL PROCESS)",
      body:
        "LUT is filed entirely online on the GST portal. The process takes about 15 minutes and approval is usually instant.",
      bullets: [
        "Login to gst.gov.in with the GSTIN of the exporting entity.",
        "Go to Services > User Services > Furnish Letter of Undertaking (LUT).",
        "Pick the financial year for which the LUT is being filed.",
        "Enter the name, full residential address (with PIN code), and occupation of two independent witnesses (employees, suppliers, or any individuals not connected to ownership). The witnesses do not need to sign anything physically or provide an OTP, only their details are captured. The form does not require GSTIN or PAN of the witnesses.",
        "Self-declare that you'll comply with export rules and pay any tax due if conditions are violated.",
        "Submit using DSC (mandatory for companies and LLPs) or EVC (allowed for proprietors and partnerships).",
        "Download the acknowledgement (ARN) and the LUT certificate immediately.",
      ],
    },
    {
      id: "06",
      heading: "WHAT GOES WRONG MOST OFTEN",
      body:
        "LUT is one of the simpler GST procedures, but a few patterns cause delay.",
      bullets: [
        "Witnesses must be independent. Don't list co-founders, family or directors of the exporting company.",
        "DSC must be active and the authorised signatory's PAN must match the registered signatory on GSTIN.",
        "Filing for a future year before 1 April fails. The portal opens for a new FY filing only after April begins.",
        "Acceptance of LUT does not waive the need to file your regular GST returns (GSTR-1, GSTR-3B). Both run independently.",
      ],
    },
    {
      id: "07",
      heading: "WHAT HAPPENS IF YOU EXPORT WITHOUT LUT",
      body:
        "If you export without an active LUT, you're treated as having opted for the IGST route. The export invoice must include IGST at the applicable rate, the IGST is paid through GSTR-3B for the month, and a refund is claimed via GSTR-1 (export with payment of tax) plus a separate refund application. Refund timelines are 60 days from receipt of complete application, but in practice the cash sits with the government for 2 to 3 months.",
    },
    {
      id: "08",
      heading: "LUT EXPIRY AND RENEWAL",
      body:
        "LUT is valid only for the financial year it covers. Set a reminder for late March each year to file the new LUT. If you forget and export in early April without renewal, those specific shipments need IGST treatment retrospectively, which is messier than just renewing on time.",
    },
    {
      id: "09",
      heading: "LUT VS BOND: WHAT'S THE DIFFERENCE",
      body:
        "Some businesses (typically those with past GST violations) cannot file an LUT and must instead furnish a Bond backed by a bank guarantee for 15% of the bond amount. Bond is more expensive (bank guarantee fees plus margin money) and has stricter renewal procedures. For most clean-record exporters, LUT is the only route they'll ever need.",
    },
  ],
  faqs: [
    {
      q: "Is LUT a one-time filing?",
      a: "No, LUT is filed every financial year. The undertaking expires on 31 March and a fresh one is needed for the new FY. We file for retainer clients automatically in the first week of April.",
    },
    {
      q: "Does LUT cover both goods and services exports?",
      a: "Yes. A single LUT covers all zero-rated supplies for the year, whether goods exports, service exports, or supplies to SEZ units. No need to file separate LUTs for different export streams.",
    },
    {
      q: "If I'm an SEZ unit, do I still need LUT?",
      a: "If you're an SEZ unit supplying goods or services from India, you still need an LUT for those zero-rated supplies. Supplies you receive from a Domestic Tariff Area (DTA) supplier are governed by the DTA supplier's compliance. SEZ developers also need LUT for their own outward supplies.",
    },
    {
      q: "Can a single LUT cover multiple GSTINs?",
      a: "No. Each GSTIN files its own LUT. If you operate from multiple states with multiple GSTINs, each one needs its own annual LUT. Single Pvt Ltds typically have one GSTIN per state of operation.",
    },
    {
      q: "Does LUT need to be paper-printed and signed?",
      a: "No. Since 2017, LUT is fully online. The portal generates the acknowledgement (ARN) and the LUT certificate as PDFs. Save them with your export documentation but no physical paperwork is needed for filing.",
    },
    {
      q: "What happens if I violate the undertaking?",
      a: "If you export under LUT and then fail to comply with export rules (e.g., goods don't actually leave India, BRC/FIRC not received within prescribed time), the GST officer can demand IGST plus interest as if the export had been a domestic supply, plus penalties. The undertaking is enforceable.",
    },
  ],
  sources: [
    {
      name: "GST Portal",
      url: "https://www.gst.gov.in/",
      description: "Official GST portal for LUT filing under User Services.",
    },
    {
      name: "CBIC Circular No. 8/8/2017-GST",
      url: "https://cbic-gst.gov.in/",
      description: "Initial circular outlining LUT and bond requirements for exporters.",
    },
    {
      name: "Section 16, IGST Act 2017",
      url: "https://cbic-gst.gov.in/",
      description: "Zero-rated supply provisions covering exports and SEZ supplies.",
    },
  ],
};
