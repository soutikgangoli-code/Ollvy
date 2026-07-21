// =============================================================================
// GUIDE PAGE: fssai-annual-return-2027
// File path: lib/guides/pages/fssai-annual-return-2027.ts
// FSSAI annual return Form D1 for FY 2026-27, due 31 May 2027 on FoSCoS.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const fssaiAnnualReturn2027: LearnPageConfig = {
  slug: "fssai-annual-return-2027",
  title: "FSSAI Annual Return (Form D1) for FY 2026-27: Due 31 May 2027",
  seoTitle: "FSSAI Annual Return 2027 | Form D1 Due 31 May | Ollvy",
  seoDescription:
    "FSSAI license holders who manufacture, process, or import food must file Form D1 for FY 2026-27 by 31 May 2027 on FoSCoS. Rs 100 per day penalty, no cap.",
  canonicalUrl: "https://www.ollvy.com/guides/fssai-annual-return-2027",
  lastReviewed: "July 2026",
  category: "Licensing",
  relatedServiceSlugs: ["fssai-license"],
  relatedLearnSlugs: [
    "do-i-need-fssai-license",
    "iec-annual-update-2027",
    "business-itr-2027",
  ],
  ctaServiceSlug: "fssai-license",
  sections: [
    {
      id: "01",
      heading: "WHO FILES FORM D1 AND WHEN",
      body:
        "Every FSSAI license holder that manufactured, processed, packed (including relabelling and repacking), or imported food during FY 2026-27 must file the annual return in Form D1 on the FoSCoS portal by 31 May 2027. The obligation attaches to license holders, which in practice means food businesses with turnover of Rs 12 lakh or more (below that, basic FSSAI registration applies and no D1 is due). The return covers the year 1 April 2026 to 31 March 2027 and is filed license-wise: a company holding a Central license and two State licenses files three D1 returns, one per license, each reflecting that premises' activity.",
    },
    {
      id: "02",
      heading: "WHO IS EXEMPT FROM D1",
      body:
        "The D1 net targets the production and import side of the food chain, not the selling side:",
      bullets: [
        "Must file: manufacturers, processors, packers, relabellers, repackers, and importers of food products holding a State or Central license.",
        "Exempt: pure traders, distributors, wholesalers, and retailers who do not manufacture or import.",
        "Exempt: restaurants, canteens, and caterers serving food (their activity is covered by the license itself, not D1).",
        "Exempt: businesses on basic FSSAI registration (turnover below Rs 12 lakh).",
        "Separate track: milk and milk-product units file the half-yearly Form D2 returns instead of the annual D1.",
      ],
      note:
        "The classification follows what your license says you do. If your license lists manufacturing or import as a kind of business, FoSCoS expects a D1 against it, and a NIL-activity year is filed as a NIL return rather than skipped.",
    },
    {
      id: "03",
      heading: "WHAT GOES INTO FORM D1",
      body:
        "Form D1 is a product-wise activity statement for FY 2026-27:",
      bullets: [
        "Each food product handled: name and category per the FSSAI product classification.",
        "Quantities: manufactured or handled during the year, in tonnes or the applicable unit.",
        "Value: selling price per unit and the value of production or imports.",
        "For importers: quantities and values of imported products with countries of origin.",
        "Packaging details: bottle, pouch, bulk pack sizes as applicable.",
      ],
      note:
        "The figures should reconcile broadly with your GST turnover and stock records for the same year. FSSAI and state food safety departments increasingly cross-check declared production against other filings during inspections and renewals.",
    },
    {
      id: "04",
      heading: "THE PENALTY: RS 100 PER DAY, NO CAP",
      body:
        "Filing after 31 May 2027 attracts a late fee of Rs 100 for every day of delay, with no upper cap under the current framework. The arithmetic gets serious quietly: filing in September 2027 (about 120 days late) costs around Rs 12,000; letting it slide a full year costs over Rs 36,000, per license. For multi-license businesses the amounts multiply. Beyond the daily fee, a pending return is a compliance defect on the license record that surfaces at the worst times: during renewal, during inspections, and in the buyer diligence that large retail and quick-commerce platforms now run on food suppliers.",
    },
    {
      id: "05",
      heading: "D1 BLOCKS RENEWAL: THE HIDDEN COST",
      body:
        "The FoSCoS system links annual return compliance to license actions. An unfiled D1 shows against the license and obstructs renewal processing, and license renewal itself has hard deadlines: a license renewed late attracts its own fee consequences, and an expired license means operating without a valid license, which under Section 63 of the Food Safety and Standards Act 2006 carries penalties that can extend to imprisonment and fines up to Rs 5 lakh. The chain from a skipped Rs 0 return to an unrenewable license is short. Businesses whose licenses come up for renewal in FY 2027-28 should clear the FY 2026-27 D1 well before starting the renewal application.",
    },
    {
      id: "06",
      heading: "HOW TO FILE ON FoSCoS",
      body:
        "Since FY 2020-21 the return is filed online on FoSCoS; paper returns to the local authority are history:",
      bullets: [
        "Log in at foscos.fssai.gov.in with the license credentials.",
        "Open Annual Return under the license menu and select Form D1 for FY 2026-27.",
        "The form pre-populates license and premises details; fill the product-wise quantity and value tables.",
        "Products must be picked from the FSSAI standardised product list; map your SKUs to the closest standard product codes before starting.",
        "Submit and download the acknowledgement. Repeat per license if you hold more than one.",
      ],
      note:
        "Assemble the data first: production registers, import records, and sales summaries by product. The portal session is the easy part; the product-wise break-up from messy internal records is where the time goes.",
    },
    {
      id: "07",
      heading: "THE FOOD BUSINESS MID-2027 CALENDAR",
      body:
        "D1 sits inside a cluster of dates for a food manufacturer or importer:",
      table: {
        headers: ["Obligation", "Due Date", "Portal"],
        rows: [
          ["FSSAI annual return (Form D1) for FY 2026-27", "31 May 2027", "FoSCoS"],
          ["IEC annual update (food importers)", "1 April to 30 June 2027", "DGFT"],
          ["DPT-3 (companies with loans/advances)", "30 June 2027", "MCA"],
          ["Non-audit business ITR for tax year 2026-27", "31 August 2027", "Income Tax"],
          ["Form D2 half-yearly (milk units), Apr-Sep 2027 period", "Within a month of the half-year end", "FoSCoS"],
        ],
      },
    },
    {
      id: "08",
      heading: "COMMON D1 MISTAKES",
      body:
        "The recurring errors that turn a routine return into a problem:",
      bullets: [
        "Assuming traders and restaurants must file, or the reverse error: manufacturers assuming exemption. The activity on the license decides it.",
        "Filing one consolidated return for multiple licenses. D1 is per license, per premises.",
        "Skipping the return in a zero-production year instead of filing NIL against an active manufacturing license.",
        "Product quantities declared in D1 wildly inconsistent with GST turnover, inviting questions at inspection.",
        "Leaving it past renewal: discovering the unfiled D1 (plus accumulated Rs 100/day) only when the renewal application stalls.",
        "Repackers and relabellers not realising they count as manufacturers for D1 purposes.",
      ],
    },
  ],
  faqs: [
    {
      q: "We run a restaurant chain with a Central license. Do we file Form D1?",
      a: "No. Restaurants, caterers, and canteens are exempt from the annual return; D1 targets manufacturers, processors, packers, and importers. But if any kitchen in the chain also manufactures packaged products for retail sale (sauces, spice mixes) under a manufacturing endorsement, that activity pulls in a D1 for the relevant license.",
    },
    {
      q: "Our turnover is Rs 9 lakh and we have basic FSSAI registration. Does the 31 May 2027 date apply?",
      a: "No. Annual returns apply to license holders; basic registration (turnover below Rs 12 lakh) carries no D1 obligation. The date to watch instead is your registration renewal. Once turnover crosses Rs 12 lakh you must upgrade to a State license, and D1 obligations start from that point.",
    },
    {
      q: "We manufactured nothing in FY 2026-27; the unit was idle. Skip the return?",
      a: "File a NIL Form D1 against the license by 31 May 2027. An active manufacturing license with no return reads as a default, not as dormancy, and the Rs 100/day meter does not distinguish idle units. If the unit will stay idle, consider surrendering or downgrading the license instead of filing NIL forever.",
    },
    {
      q: "What does filing in August 2027 actually cost?",
      a: "Roughly 90 days late at Rs 100 per day is about Rs 9,000 in late fees, per license, with no cap and no waiver mechanism. On top sits the soft cost: the delay is visible on the license record during renewal and inspections.",
    },
    {
      q: "We import packaged snacks and sell them unchanged. Are we a trader or an importer for D1?",
      a: "An importer, and importers file D1 with product-wise import quantities, values, and countries of origin. The trader exemption covers domestic buying and selling; bringing goods across the border is exactly what the return is designed to capture. You will also need your IEC updated in the April-June 2027 window for the imports themselves.",
    },
    {
      q: "Is there a separate return for our dairy division?",
      a: "Yes. Milk and milk-product units file half-yearly Form D2 returns on FoSCoS instead of the annual D1 for that activity. A mixed business (dairy plus general foods) can end up filing both, each against the relevant license and activity.",
    },
    {
      q: "Could the 31 May 2027 date change?",
      a: "FSSAI has occasionally extended return deadlines through FoSCoS advisories in past years. Work to 31 May 2027 as the statutory date; if FSSAI notifies an extension for the FY 2026-27 return, this page will be updated. With an uncapped daily fee, filing early is the only strategy that costs nothing.",
    },
  ],
  sources: [
    {
      name: "FoSCoS - Food Safety Compliance System",
      url: "https://foscos.fssai.gov.in/",
      description: "Official portal for FSSAI licensing and the online D1 / D2 annual and half-yearly returns.",
    },
    {
      name: "FSS (Licensing and Registration of Food Businesses) Regulations 2011, Regulation 2.1.13",
      url: "https://www.fssai.gov.in/",
      description: "Annual return requirement for license holders, the D1/D2 formats, and the late fee of Rs 100 per day.",
    },
    {
      name: "ClearTax - FSSAI annual returns guide",
      url: "https://cleartax.in/s/fssai-annual-return",
      description: "Practitioner overview of D1 applicability, exemptions, and filing mechanics.",
    },
  ],
};
