// =============================================================================
// GUIDE PAGE: tds-return-q1-2027
// File path: lib/guides/pages/tds-return-q1-2027.ts
// Authored fresh covering TDS quarterly return Q1 FY 2026-27 (Apr-Jun 2026)
// due 31 July 2026, the first TDS quarter under the Income Tax Act 2025.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const tdsReturnQ12027: LearnPageConfig = {
  slug: "tds-return-q1-2027",
  title: "TDS Return Q1 FY 2026-27: First Quarter Under Income Tax Act 2025",
  seoTitle: "TDS Return Q1 2026-27 | Forms 24Q 26Q 27Q | Due 31 July 2026 | Ollvy",
  seoDescription:
    "TDS quarterly return for Q1 FY 2026-27 (April-June 2026), due 31 July 2026. The first TDS quarter governed by the Income Tax Act 2025 (Sections 392, 393). Section 234E and 271H penalties, IT Act 2025 section mappings, and filing checklist.",
  canonicalUrl: "https://www.ollvy.com/guides/tds-return-q1-2027",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["tds-monthly-compliance", "business-itr"],
  relatedLearnSlugs: ["tds-on-rent-194i-194ib", "tds-on-property-purchase-194ia", "advance-tax-explained"],
  ctaServiceSlug: "tds-monthly-compliance",
  sections: [
    {
      id: "01",
      heading: "WHAT THIS RETURN COVERS",
      body:
        "The Q1 TDS return covers tax deducted at source on payments made between 1 April 2026 and 30 June 2026. This is the first quarter under the Income Tax Act 2025, which came into force on 1 April 2026 and replaced the 1961 Act for tax years from FY 2026-27 onwards. The legal substance of TDS hasn't changed, but the section numbers have, and that matters for the return forms and any notices that follow. Forms 24Q, 26Q, and 27Q are still in use, with content updated to reference the new section numbers.",
    },
    {
      id: "02",
      heading: "WHO HAS TO FILE",
      body:
        "Anyone who deducted TDS on any payment in Q1. The trigger is the deduction, not the size of the business. If you paid even one rent invoice with TDS or one professional fee with 10 percent TDS, you file.",
      table: {
        headers: ["Form", "What It Covers"],
        rows: [
          ["24Q", "TDS on salary (under Section 392 of IT Act 2025, was 192 of 1961 Act)"],
          ["26Q", "TDS on non-salary domestic payments (Section 393, consolidating the old 194 series)"],
          ["27Q", "TDS on payments to non-residents (also under Section 393 read with 197)"],
          ["27EQ", "TCS (tax collected at source) on specified transactions"],
        ],
      },
      note:
        "Government deductors filing without challan use Form 24G with a different process and timeline. This page covers private deductors filing 24Q / 26Q / 27Q.",
    },
    {
      id: "03",
      heading: "DUE DATE",
      body:
        "31 July 2026 for non-government deductors. Government deductors filing through Form 24G have a different timeline that runs day-by-day on credit transactions.",
      bullets: [
        "Q1 FY 2026-27 return: covers 1 April 2026 to 30 June 2026.",
        "Filing deadline: 31 July 2026.",
        "TDS itself was deposited monthly (by the 7th of the next month for normal deductions, by 30 April for March deductions).",
        "The return is the periodic statement; depositing TDS on time does not exempt you from filing the return.",
      ],
    },
    {
      id: "04",
      heading: "KEY SECTION NUMBER CHANGES UNDER IT ACT 2025",
      body:
        "The Income Tax Act 2025 renumbered most sections without changing the substantive rules. For TDS practitioners, the key mappings are:",
      table: {
        headers: ["Old (1961 Act)", "New (IT Act 2025)", "What It Covers"],
        rows: [
          ["Section 192", "Section 392", "TDS on salary"],
          ["Section 194 series + 195 + 206C", "Section 393", "Non-salary TDS / TCS (consolidated)"],
          ["Section 200(3)", "Section 397", "Filing of TDS / TCS statement"],
          ["Section 201", "Section 421", "Failure to deduct, treated as assessee in default"],
          ["Section 201(1A)", "Section 421(1A)", "Interest on late deduction / late deposit"],
          ["Section 234E", "Section 427", "Late filing fee for TDS / TCS return"],
          ["Section 271H", "Section 461", "Penalty for non-filing or incorrect return"],
        ],
      },
      note:
        "When you file Q1 FY 2026-27, the TRACES portal reflects the new section numbers. CBDT issued a complete mapping utility. Penalties and rates are unchanged in substance.",
    },
    {
      id: "05",
      heading: "TDS RATES YOU LIKELY TOUCHED IN Q1",
      body:
        "These are the common rates a typical SME deductor will encounter in any quarter. The full schedule under Section 393 has 30 plus categories.",
      table: {
        headers: ["Payment Type", "Section (IT Act 2025)", "TDS Rate"],
        rows: [
          ["Salary (above exemption)", "Section 392", "Slab rate"],
          ["Rent on land / building (Rs 50,000+ per month)", "Section 393 (was 194I / 194IB)", "10% (5% if landlord PAN unverified)"],
          ["Professional fees", "Section 393 (was 194J)", "10%"],
          ["Contract payments above Rs 30,000 per invoice", "Section 393 (was 194C)", "1% individual / 2% entity"],
          ["Interest other than securities", "Section 393 (was 194A)", "10%"],
          ["Commission and brokerage", "Section 393 (was 194H)", "5%"],
          ["Property purchase (Rs 50L+ from resident)", "Section 393 (was 194IA)", "1%"],
        ],
      },
    },
    {
      id: "06",
      heading: "PENALTY FOR LATE FILING",
      body:
        "Two layers stack on a late or incorrect return.",
      table: {
        headers: ["Trigger", "Provision (IT Act 2025)", "Amount"],
        rows: [
          ["Late filing", "Section 427 (was 234E)", "Rs 200 per day, capped at TDS amount"],
          ["Delay beyond 1 month or incorrect return", "Section 461 (was 271H)", "Rs 10,000 to Rs 1,00,000"],
          ["Failure to deduct or pay", "Section 421 (was 201)", "Interest 1% per month (deduction) / 1.5% per month (deposit)"],
          ["TDS deposited late", "Section 421(1A)", "1.5% per month from deduction date to deposit date"],
        ],
      },
      note:
        "The Section 271H grace period (now Section 461) was reduced from 1 year to 1 month effective 1 April 2025 (Budget 2024 amendment). So if the return is filed more than 1 month late, the AO can impose the Rs 10K to Rs 1L penalty in addition to the daily 234E / 427 fee.",
    },
    {
      id: "07",
      heading: "DOCUMENTS YOU WILL NEED",
      body:
        "Before opening the TRACES utility, build a clean file with all the source data. Most rejection cycles come from PAN mismatches and missing challans.",
      bullets: [
        "All TDS / TCS challans (BSR codes, deposit dates, amounts) for April through June.",
        "PAN of every deductee (employee, vendor, landlord, contractor). Wrong PANs cause the deductee to lose TDS credit and trigger reconciliation work.",
        "Salary register with month-wise breakup, exemptions, and other income declarations from employees (Form 12BB).",
        "Vendor invoices with TDS computation visible.",
        "Form 16A or Form 16 issued for prior quarters (if continuing employment / engagement).",
        "TAN (Tax Deduction Account Number) for the deductor.",
        "DSC of the authorised signatory (mandatory for non-individuals).",
      ],
    },
    {
      id: "08",
      heading: "WHY TIMELY FILING MATTERS BEYOND THE PENALTY",
      body:
        "The TDS credit a deductee can claim in their ITR depends on you filing the return and the TRACES portal processing it. If you miss Q1 filing, the deductee's Form 26AS won't reflect the TDS, and they may either get a notice or have to file with a manual adjustment. Vendor relationships suffer. For salary TDS specifically, late Q4 filing means employees can't get Form 16, which delays their personal ITR filing and can spill into late filing fees on their side.",
    },
  ],
  faqs: [
    {
      q: "Why are the section numbers different this quarter?",
      a: "The Income Tax Act 2025 came into force on 1 April 2026, replacing the 1961 Act for tax years from FY 2026-27 onwards. Section 192 is now Section 392, Section 194 (series) is consolidated under Section 393, Section 234E is Section 427, and Section 271H is Section 461. The substance is unchanged. The forms (24Q, 26Q, 27Q) remain the same with updated content.",
    },
    {
      q: "Is the return shape any different from earlier quarters?",
      a: "No. Form 24Q and Form 26Q have the same line items as before. The only difference is references to the new section numbers in the form's metadata and any system-generated notices. The challan formats, BSR codes, and PAN-validation logic are unchanged.",
    },
    {
      q: "I forgot to deduct TDS in May. What now?",
      a: "Two issues stack. First, you owe Section 421 (was 201) interest at 1 percent per month from when TDS should have been deducted to when you actually deduct. Second, even if you deduct now and deposit, you have to report it correctly in the Q1 return. If the deductee pays tax themselves, you may avoid being treated as 'assessee in default' but the interest under 421(1A) still applies.",
    },
    {
      q: "Are there any new TDS rates this quarter?",
      a: "Substantive TDS rates under Section 393 are unchanged for Q1 FY 2026-27. Budget 2026 made minor procedural amendments (PAN-less reporting for non-resident property sales, simplified lower-deduction certificates), but the headline rates on rent, professional fees, contracts, interest, and salary remain unchanged.",
    },
    {
      q: "Where do I file?",
      a: "Through the TRACES portal (tdscpc.gov.in) or via authorised TIN-FCs. Most large deductors use the TRACES utility (NSDL e-TDS / e-TCS RPU) to prepare the file and upload it. The portal validates the file structure and PAN-challan-deductee links before accepting.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025, Sections 392, 393, 397, 421, 427, 461",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Renumbered TDS provisions effective FY 2026-27. Substantive rules unchanged from the 1961 Act mappings.",
    },
    {
      name: "CBDT Section Mapping Utility",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Official mapping between 1961 Act sections and IT Act 2025 sections, useful for cross-referencing legacy notices.",
    },
    {
      name: "TDS / TCS Quarterly Return Filing Portal",
      url: "https://www.tdscpc.gov.in/",
      description: "TRACES portal for filing 24Q, 26Q, 27Q and downloading Form 16 / Form 16A.",
    },
    {
      name: "NSDL e-TDS Return Preparation Utility",
      url: "https://www.protean-tinpan.com/services/etds-etcs/etds-rpu.html",
      description: "Standard utility for preparing the .txt file before uploading to TRACES.",
    },
    {
      name: "Budget 2024 amendment to Section 271H grace period",
      url: "https://www.indiabudget.gov.in/",
      description: "Reduced the grace period for the Section 271H (now 461) penalty from 1 year to 1 month, effective 1 April 2025.",
    },
  ],
};
