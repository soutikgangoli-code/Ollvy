// =============================================================================
// GUIDE PAGE: gst-invoice-management-system-ims
// File path: lib/guides/pages/gst-invoice-management-system-ims.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const gstInvoiceManagementSystemIms: LearnPageConfig = {
  slug: "gst-invoice-management-system-ims",
  title: "GST Invoice Management System (IMS): Mandatory Rules and ITC Hard-Locking",
  seoTitle: "GST IMS Mandatory 2026: GSTR-3B ITC Hard-Locking | Ollvy",
  seoDescription:
    "IMS is mandatory from 1 April 2026 and GSTR-3B Table 4 ITC is hard-locked from the July 2026 period. Unactioned or rejected invoices mean lost ITC and DRC-01B.",
  canonicalUrl: "https://www.ollvy.com/guides/gst-invoice-management-system-ims",
  lastReviewed: "July 2026",
  category: "GST",
  relatedServiceSlugs: ["gst-monthly", "gst-registration"],
  relatedLearnSlugs: [
    "gst-gstr2b-itc-mismatch",
    "gst-drc-01b-mismatch",
    "gstat-appeal-guide",
    "gst-annual-2027",
  ],
  ctaServiceSlug: "gst-monthly",
  sections: [
    {
      id: "01",
      heading: "WHAT IMS IS AND WHAT JUST CHANGED",
      body:
        "The Invoice Management System (IMS) is the GST portal dashboard where every invoice your suppliers report in their GSTR-1 lands for you to accept, reject or keep pending, and those actions now decide your input tax credit. IMS became mandatory from 1 April 2026, and from the July 2026 tax period, Phase 2 of ITC hard-locking makes Table 4 of GSTR-3B non-editable: the ITC figure flows from your IMS-driven GSTR-2B and can no longer be manually increased in the return.\n\nThe practical meaning for the return you file in August 2026: if an invoice sits rejected or your supplier never reported it, you cannot paper over the gap by typing a higher ITC number into GSTR-3B. The credit is what IMS says it is. Invoice-level action every month is now the ITC process, not an optional hygiene step.",
    },
    {
      id: "02",
      heading: "HOW THE ACCEPT / REJECT / PENDING WORKFLOW DRIVES GSTR-2B",
      body:
        "Every document a supplier saves or files in GSTR-1, IFF or through amendment flows into your IMS inbox. Your action per invoice determines its treatment in the GSTR-2B generated on the 14th.",
      bullets: [
        "Accept: the invoice enters your GSTR-2B and its ITC flows into the auto-populated GSTR-3B Table 4.",
        "Reject: the invoice is excluded from your GSTR-2B, and the supplier sees the rejection on their side; use it for wrong-GSTIN, duplicate or disputed documents.",
        "Pending: the invoice is parked (goods not received, invoice under verification) and excluded from the current period's 2B without being bounced back to the supplier.",
        "No action: treated as deemed accepted, and the ITC flows. Deemed acceptance sounds convenient but silently accepts wrong and fraudulent invoices too, which you then own in audit.",
        "Since October 2025, import IGST entries from Bills of Entry also flow through IMS, so import credit follows the same action discipline.",
      ],
    },
    {
      id: "03",
      heading: "THE PENDING LIMIT: ONE TAX PERIOD ONLY",
      body:
        "Pending is not a parking lot. An invoice can remain pending for a maximum of one tax period; after that, the system requires a decision, and an undecided document effectively falls out of your credit flow for that cycle. The design intent is to stop taxpayers deferring reconciliation indefinitely.\n\nOperationally this means your goods-receipt and invoice-verification cycle must complete within roughly a month of the supplier reporting the invoice. Businesses with long inward logistics (project sites, imports moving inland) need the purchase team feeding receipt confirmations to whoever works the IMS dashboard before the next 2B generation, every month.",
    },
    {
      id: "04",
      heading: "WHAT HARD-LOCKING OF GSTR-3B TABLE 4 MEANS",
      body:
        "Until this change, GSTR-2B was advisory: the portal auto-filled Table 4, but you could edit the ITC figure and reconcile later. That editing room is what closed.",
      bullets: [
        "Phase 1 locked the outward liability side of GSTR-3B (Table 3) to GSTR-1 data from earlier periods.",
        "Phase 2, effective the July 2026 tax period, locks Table 4: ITC in GSTR-3B equals the IMS/2B output, with only the structured adjustments (reversals under Rules 42/43, ineligible credit tagging) available.",
        "Missed invoices are claimed by getting the document into a subsequent 2B (supplier reports or amends, you accept), not by manual addition.",
        "Excess claims become structurally difficult, which is the point: DRC-01B mismatch notices targeted exactly the 3B-vs-2B gap that manual editing created.",
      ],
      note:
        "The days-of-the-month rhythm that matters: suppliers file GSTR-1 by the 11th, 2B generates on the 14th, your GSTR-3B is due the 20th. IMS actions between the 11th and 14th (and recompute before filing) are the new monthly ritual.",
    },
    {
      id: "05",
      heading: "WHAT GOES WRONG NOW: THE FAILURE MODES",
      body: "",
      bullets: [
        "Supplier does not file GSTR-1: the invoice never reaches IMS, so the ITC does not exist for you that month regardless of the tax you paid the supplier. Your leverage is commercial: payment holdbacks tied to GSTR-1 filing.",
        "Wrong rejection by you: rejecting a genuine invoice removes its ITC; recovering it needs the supplier to re-report or amend, pushing the credit to a later period and stretching working capital.",
        "Wrong rejection by your customer (outward side): your buyer rejecting your invoice can raise your liability visibility and triggers reconciliation calls; watch the outward IMS view too.",
        "Unactioned fraud: deemed acceptance of a fake invoice puts recovered-ITC-with-interest exposure on you; the accept action is now evidence of your diligence or its absence.",
        "Credit notes: supplier credit notes also flow through IMS and reduce your ITC when accepted; rejecting a genuine credit note overstates your credit and surfaces in the supplier's liability reconciliation.",
      ],
    },
    {
      id: "06",
      heading: "THE COST OF GETTING IT WRONG: DRC-01B AND 18% INTEREST",
      body:
        "The enforcement mechanics around ITC mismatches are already live and now run on cleaner data.",
      bullets: [
        "ITC claimed beyond what the locked 2B supports (through the remaining adjustment fields) triggers DRC-01B intimations: explain or pay within 7 days, with the next GSTR-1 blocked for non-response.",
        "Wrongly availed and utilised ITC is recoverable with interest at 18% per annum (Section 50(3) read with Section 73/74 proceedings).",
        "Penalty exposure scales from 10% of tax (Section 73, non-fraud) to 100% (Section 74, fraud cases).",
        "Lost genuine credit is the quieter cost: every invoice that misses its window is working capital parked with the government until the supplier acts.",
      ],
    },
    {
      id: "07",
      heading: "MONTHLY OPERATING PROCESS THAT SURVIVES HARD-LOCKING",
      body:
        "The businesses handling IMS well run the same five-step loop each month.",
      bullets: [
        "By the 12th: pull the IMS inbox after suppliers' GSTR-1 filings (due the 11th); match against your purchase register at invoice level, not totals.",
        "By the 13th: accept matched invoices, reject clear errors (wrong GSTIN, duplicates), mark genuinely unverified receipts pending, and chase suppliers for missing documents while their amendment window is open.",
        "On the 14th: review the draft GSTR-2B; if you acted after generation, recompute 2B on the portal before it feeds 3B.",
        "Before the 20th: file GSTR-3B off the locked Table 4, applying only legitimate reversals (Rules 42/43, blocked credits under 17(5)).",
        "Monthly hygiene: clear the pending queue (one-period limit), reconcile supplier payment terms to GSTR-1 behaviour, and log rejection reasons; that log is your diligence record in any later Section 73/74 proceeding.",
      ],
    },
    {
      id: "08",
      heading: "WHO FEELS THIS MOST",
      body: "",
      bullets: [
        "High-invoice-volume businesses (distributors, e-commerce sellers): thousands of monthly line items make manual IMS action impractical; API-based reconciliation tooling or outsourced monthly working becomes necessary rather than nice.",
        "Businesses with unreliable small suppliers: quarterly QRMP suppliers' invoices reach IMS on their filing rhythm, so credit timing needs planning, and supplier discipline needs contract teeth.",
        "Importers: Bill-of-Entry IGST now rides the same workflow; customs-broker data delays become ITC delays.",
        "Multi-GSTIN companies: each registration has its own IMS inbox; a centralised process that misses one state's dashboard loses that state's credit.",
      ],
    },
  ],
  faqs: [
    {
      q: "We missed acting on 40 invoices last month. Is that ITC gone?",
      a: "Not gone, but check what happened to each. Unactioned invoices are deemed accepted, so if they were genuine, their ITC flowed into 2B and you are fine, though you have effectively skipped your verification control. The real losses are invoices you rejected wrongly or that suppliers never reported. Wrong rejections need the supplier to re-report or amend so the document returns through a later 2B; there is no manual add-back in the locked GSTR-3B.",
    },
    {
      q: "Our supplier filed GSTR-1 late, so the invoice hit IMS after our 3B was filed. When do we get the credit?",
      a: "In the period whose GSTR-2B picks the invoice up: accept it in IMS and the ITC flows into that later month's locked Table 4 automatically. The credit is delayed, not lost, provided it lands within the overall time limit for availing ITC for that financial year. The fix for chronic lateness is commercial: tie a slice of payment to the supplier's GSTR-1 filing.",
    },
    {
      q: "Can we still edit GSTR-3B Table 4 for genuine adjustments like reversals?",
      a: "The structured adjustments remain: reversals under Rules 42/43 (exempt-supply apportionment), Section 17(5) blocked credit tagging, and re-claims of earlier reversals flow through their designated fields. What is locked is the base ITC figure itself; you cannot key in credit that IMS/2B does not support. If a genuine credit is missing, the correction happens upstream in IMS or the supplier's filing, never by overtyping the return.",
    },
    {
      q: "What should we mark pending versus reject?",
      a: "Pending is for documents that are probably genuine but not yet verifiable: goods in transit, services under acceptance testing, invoices awaiting three-way match. Reject is for documents that should never enter your credit: wrong GSTIN, duplicates, cancelled deals, inflated or unknown invoices. The distinction matters because pending preserves the invoice for the next period (one period maximum), while reject bounces it to the supplier and requires their action to revive.",
    },
    {
      q: "We received a DRC-01B after the July period. What is the 7-day drill?",
      a: "DRC-01B means your filed 3B ITC exceeded what 2B supports beyond tolerance. Within 7 days, respond in Part B: either pay the difference through DRC-03 with 18% interest, or explain the gap against the listed reasons (permissible re-claims, import credits, documented timing differences). Non-response blocks your next GSTR-1, which cascades into your customers' ITC and turns an accounting issue into a commercial one. With hard-locked Table 4, new DRC-01Bs should mostly trace to the adjustment fields, so audit those first.",
    },
    {
      q: "Do credit notes from suppliers need action too?",
      a: "Yes, and carelessly rejecting them is the new common error. An accepted credit note reduces your ITC, as it should when you have received a price reduction or returned goods. Rejecting a genuine credit note keeps credit you are not entitled to, creates a mismatch against the supplier's reduced liability, and surfaces in their reconciliation and eventually your audit. Reject a credit note only when you genuinely dispute the underlying transaction.",
    },
    {
      q: "Does IMS apply to QRMP taxpayers and to imports?",
      a: "Yes to both. QRMP taxpayers work the same dashboard; their suppliers' documents arrive per the suppliers' filing rhythm (monthly IFF or quarterly GSTR-1), and their own quarterly 3B rides the same locked auto-population. Imports entered IMS in October 2025: IGST on Bills of Entry flows from ICEGATE data into the dashboard for action, so import credit now depends on that data landing correctly, worth checking whenever a BoE is amended.",
    },
  ],
  sources: [
    {
      name: "Taxscan: GSTR-3B ITC hard-locking coverage",
      url: "https://www.taxscan.in/",
      description: "Reporting on the phased locking of GSTR-3B and the July 2026 Table 4 ITC lock.",
    },
    {
      name: "ClearTax: Is IMS mandatory?",
      url: "https://cleartax.in/",
      description: "IMS workflow, mandatory status from April 2026 and the pending-period limit.",
    },
    {
      name: "GST Portal: IMS dashboard and advisories",
      url: "https://www.gst.gov.in/",
      description: "Official IMS advisories, 2B generation schedule and recompute functionality.",
    },
  ],
};
