// =============================================================================
// GUIDE PAGE: form-141-tds-property-rent
// File path: lib/guides/pages/form-141-tds-property-rent.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const form141TdsPropertyRent: LearnPageConfig = {
  slug: "form-141-tds-property-rent",
  title: "Form 141: The New TDS Challan for Property Purchases and Rent",
  seoTitle: "Form 141 TDS 2026: Replaces 26QB/26QC for Property, Rent | Ollvy",
  seoDescription:
    "Form 141 replaces 26QB/26QC/26QD/26QE for TDS deducted from 1 April 2026: property buys of Rs 50L+, rent over Rs 50k/month. 30 days to deposit, Rs 200/day late.",
  canonicalUrl: "https://www.ollvy.com/guides/form-141-tds-property-rent",
  lastReviewed: "July 2026",
  category: "TDS Filing",
  relatedServiceSlugs: ["tds-monthly-compliance", "business-itr"],
  relatedLearnSlugs: [
    "tds-on-property-purchase-194ia",
    "tds-on-rent-194i-194ib",
    "new-tds-sections-fy2026-27",
    "income-tax-act-2025-section-mapping",
  ],
  ctaServiceSlug: "tds-monthly-compliance",
  sections: [
    {
      id: "01",
      heading: "WHAT FORM 141 IS AND WHO NEEDS IT",
      body:
        "Form 141 is the unified challan-cum-statement that replaces Forms 26QB (property purchase), 26QC (rent), 26QD (contractor/professional payments by individuals) and 26QE (crypto transfers) for TDS deducted on or after 1 April 2026 under the Income-tax Act 2025. If you are buying a property worth Rs 50 lakh or more, or paying rent above Rs 50,000 a month, you deduct the same TDS as before but deposit and report it through Form 141 instead of the old form.\n\nNothing about the underlying obligation changed: the rates, thresholds and 30-day deposit window carried into the new Act. What changed is the paperwork, and because these are typically one-off filings done by individuals without a TAN, the form change is where first-time deductors now go wrong. This page covers the new procedure; the separate guides on property TDS and rent TDS cover when the obligation arises and how to compute it.",
    },
    {
      id: "02",
      heading: "THE CONSOLIDATION: FOUR OLD FORMS INTO ONE",
      body:
        "Under the 1961 Act, each PAN-based TDS category had its own challan-cum-statement. The 2025 Act merges them.",
      table: {
        headers: ["Transaction", "Old form (up to 31 Mar 2026)", "From 1 Apr 2026"],
        rows: [
          ["Property purchase of Rs 50 lakh+ (1% TDS)", "26QB", "Form 141"],
          ["Rent above Rs 50,000/month by individuals (TDS u/s old 194-IB)", "26QC", "Form 141"],
          ["Contractor/professional payments over Rs 50 lakh by individuals/HUF (old 194M)", "26QD", "Form 141"],
          ["Crypto/VDA transfer consideration (old 194S, specified persons)", "26QE", "Form 141"],
        ],
      },
      note:
        "Deductions made up to 31 March 2026 still use the old forms, including corrections to previously filed 26QB/26QC statements. The cutover is by deduction date, not filing date.",
    },
    {
      id: "03",
      heading: "WHAT STAYED THE SAME",
      body:
        "The compliance substance is unchanged from the old regime; only the reporting container is new.",
      bullets: [
        "Property: 1% TDS where consideration (or stamp duty value) is Rs 50 lakh or more, deducted at payment or credit, including on each instalment.",
        "Rent: individuals and HUFs not under tax audit paying rent above Rs 50,000 per month deduct at the prescribed rate, typically once in the last month of the year or tenancy.",
        "No TAN needed: Form 141 is PAN-based, like the forms it replaces.",
        "Deposit window: 30 days from the end of the month in which TDS was deducted.",
        "Certificate to the payee: the deductor downloads the TDS certificate from TRACES after the statement is processed, as with 16B/16C earlier (the certificate series is renumbered under the new Act).",
      ],
    },
    {
      id: "04",
      heading: "HOW TO FILE FORM 141, STEP BY STEP",
      body: "",
      bullets: [
        "Log in to the e-filing portal (incometax.gov.in) and open the e-Pay Tax / TDS on transactions section; Form 141 sits where 26QB/26QC used to.",
        "Select the transaction category within the form (property, rent, contractual payment, VDA); the category drives which fields and payment code apply.",
        "Fill both parties' PANs, property or tenancy details, total consideration, amount paid in the period, and TDS deducted. Verify the seller's or landlord's PAN character by character: a wrong PAN puts the credit in the wrong hands and is painful to fix.",
        "Pay the TDS through net banking, UPI or the listed modes; the challan and statement are one combined submission.",
        "Save the acknowledgement and challan; the payee needs it, and banks financing a property purchase ask for it at disbursement stages.",
        "After processing (typically within a week), register on TRACES as a taxpayer-deductor and download the TDS certificate for the seller, landlord or payee.",
      ],
    },
    {
      id: "05",
      heading: "DEADLINES WITH A WORKED EXAMPLE",
      body:
        "The 30-days-from-month-end rule is where most defaults happen, because one-off deductors do not run a compliance calendar.",
      bullets: [
        "Property instalment paid 12 August 2026 with 1% deducted: Form 141 due by 30 September 2026.",
        "Rent TDS deducted in March 2027 for FY 2026-27 tenancy: Form 141 due by 30 April 2027.",
        "Multiple buyers/sellers: each buyer-seller pair files its own Form 141 for its share, same as the 26QB practice.",
        "Each instalment of a property purchase triggers its own deduction and its own filing window.",
      ],
    },
    {
      id: "06",
      heading: "WHAT IT COSTS TO BE LATE",
      body:
        "The default costs carried into the new Act unchanged, and TRACES generates default notices on processed statements automatically.",
      bullets: [
        "Late filing fee: Rs 200 per day until the statement is filed, capped at the TDS amount.",
        "Interest for deducting late: 1% per month or part month, from the date TDS was deductible to the date deducted.",
        "Interest for depositing late after deducting: 1.5% per month or part month, from deduction date to deposit date.",
        "Penalty exposure for extended failure to file the statement, over and above the daily fee.",
        "For property deals, the seller's TDS credit stays invisible until your Form 141 is processed, which surfaces as a dispute at registration or possession time.",
      ],
      note:
        "Example: Rs 80,000 TDS on a Rs 80 lakh purchase, filed 90 days late, means Rs 18,000 in late fee plus interest; the fee alone often exceeds what a professional would have charged to do it on time many times over.",
    },
    {
      id: "07",
      heading: "TRANSITION TRAPS FOR DEALS STRADDLING 1 APRIL 2026",
      body:
        "Property purchases run on instalments, and many current deals started before the cutover. The rule is mechanical: the form follows the deduction date.",
      bullets: [
        "Instalments paid up to 31 March 2026: TDS on them was reported on 26QB under the old Act; that does not migrate.",
        "Instalments paid from 1 April 2026: each is deducted under the new Act and reported on Form 141, even for the same property and same seller.",
        "One property can therefore legitimately have both 26QB and Form 141 filings against it; keep both sets of acknowledgements for the registration file.",
        "Corrections to old 26QB/26QC filings continue through the old correction mechanism on TRACES, not through Form 141.",
      ],
    },
    {
      id: "08",
      heading: "HOW THIS FITS THE WIDER TDS RENUMBERING",
      body:
        "Form 141 is one piece of the Income-tax Act 2025 transition: the 194-series sections were consolidated into Section 393 (with TDS categories in Schedule I), TAN-based quarterly returns moved to Forms 138/140/143/144, and challans moved to numeric payment codes. For a one-off property buyer or tenant none of that machinery matters except this form. For businesses that also run regular TAN-based TDS, note that Form 141 transactions stay outside the quarterly returns, exactly as 26QB/26QC did: do not report the same deduction in both places.",
    },
  ],
  faqs: [
    {
      q: "I am buying a Rs 75 lakh flat with instalments through 2026-27. Which form do I use?",
      a: "Form 141, for every instalment paid on or after 1 April 2026, filed within 30 days of the end of each instalment's month, deducting 1% each time. If you paid instalments before April 2026, those went on 26QB and stay there. Keep all acknowledgements together; the sub-registrar and your lender will want the full TDS trail at registration.",
    },
    {
      q: "My rent is Rs 60,000 per month. When do I actually file Form 141?",
      a: "Once a year in the normal case: deduct TDS from the March rent (or the last month's rent if you vacate earlier) covering the whole year, then file Form 141 within 30 days of that month's end. You do not file monthly. What changed from FY 2025-26 is only the form: the obligation, timing and rate follow the same pattern as the old 26QC regime.",
    },
    {
      q: "Do I need a TAN to file Form 141?",
      a: "No. Like 26QB and 26QC before it, Form 141 is a PAN-based challan-cum-statement designed for individuals making one-off deductions. You file with your PAN and the payee's PAN. A TAN is only for regular deductors filing quarterly returns, which is a different track entirely.",
    },
    {
      q: "I filed a 26QB in February 2026 with a wrong PAN. Do I correct it via Form 141?",
      a: "No. Deductions made up to 31 March 2026 live under the old Act and old forms; corrections to a filed 26QB go through the 26QB correction flow on TRACES, with the existing verification requirements. Form 141 only handles deductions dated 1 April 2026 onwards. Running an old-period correction into the new form is not possible.",
    },
    {
      q: "What happens if I just do not file? The seller says they do not care about the certificate.",
      a: "TRACES processes SFT and registration data against TDS filings, so property transactions above Rs 50 lakh without a matching TDS statement are flagged systematically. You accumulate Rs 200/day in fees (capped at the TDS), interest at 1%/1.5% per month, and a demand notice in your name, since the deductor is the defaulter, not the seller. The seller also loses the credit, which resurfaces as a dispute when their return mismatches. Filing late is bad; not filing converts a fee into a formal default.",
    },
    {
      q: "The seller is an NRI. Do I use Form 141?",
      a: "No. Payments to non-residents were never in the 26QB regime and are not in Form 141 either: buying from an NRI requires a TAN, TDS at the capital-gains rates (not 1%), and reporting through the non-resident quarterly statement (Form 144 under the new Act, old 27Q). This is the single most expensive form-selection mistake in property TDS; verify the seller's residential status in writing before the first payment.",
    },
    {
      q: "How does the seller or landlord see the credit I deposited?",
      a: "Once your Form 141 is processed, the TDS appears against their PAN in Form 26AS and AIS, and you can download their TDS certificate from TRACES to hand over. Processing typically takes about a week after filing. If it does not appear, the usual cause is a PAN error in the form, which needs a correction request from your side.",
    },
    {
      q: "Is the TDS rate on rent still what it was, and on property still 1%?",
      a: "Yes. The 2025 Act carried the rates and thresholds forward: 1% on property consideration of Rs 50 lakh or more, and the prescribed rate on rent above Rs 50,000 per month for non-audit individuals (2% after the October 2024 rate reduction). Form 141 changed the reporting, not a single rate. Compute exactly as the property and rent TDS guides describe, then report on the new form.",
    },
  ],
  sources: [
    {
      name: "TaxUpdate: New TDS challan-cum-statement forms under the Income-tax Act 2025",
      url: "https://taxupdate.in/",
      description: "Coverage of the consolidation of 26QB/26QC/26QD/26QE into Form 141.",
    },
    {
      name: "CA Alok Kumar: New Act TDS forms guide",
      url: "https://caalokkumar.com/",
      description: "Practitioner mapping of old challan-cum-statement forms to the new numbering.",
    },
    {
      name: "Income Tax e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Filing location for Form 141 and the e-Pay Tax module.",
    },
    {
      name: "TRACES",
      url: "https://www.tdscpc.gov.in/",
      description: "Statement processing, default notices, corrections and TDS certificate downloads.",
    },
  ],
};
