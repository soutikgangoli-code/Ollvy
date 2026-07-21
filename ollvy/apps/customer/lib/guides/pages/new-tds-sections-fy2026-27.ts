// =============================================================================
// GUIDE PAGE: new-tds-sections-fy2026-27
// File path: lib/guides/pages/new-tds-sections-fy2026-27.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const newTdsSectionsFy202627: LearnPageConfig = {
  slug: "new-tds-sections-fy2026-27",
  title: "New TDS Sections for FY 2026-27: 194-Series Replaced by 392, 393, 394",
  seoTitle: "New TDS Sections 392, 393, 394 for FY 2026-27 | Ollvy",
  seoDescription:
    "From 1 April 2026 the 194-series is gone: salary TDS is Section 392, non-salary 393, TCS 394. New forms 138/140/143/144. Q2 FY 2026-27 return due 31 Oct 2026.",
  canonicalUrl: "https://www.ollvy.com/guides/new-tds-sections-fy2026-27",
  lastReviewed: "July 2026",
  category: "TDS Filing",
  relatedServiceSlugs: ["tds-monthly-compliance", "payroll-management", "business-itr"],
  relatedLearnSlugs: [
    "income-tax-act-2025-section-mapping",
    "form-141-tds-property-rent",
    "tds-return-q2-fy2026-27",
    "tds-return-q3-fy2026-27",
    "form-16-is-now-form-130",
    "tds-short-deduction-notice",
  ],
  ctaServiceSlug: "tds-monthly-compliance",
  sections: [
    {
      id: "01",
      heading: "WHAT CHANGED ON 1 APRIL 2026",
      body:
        "The Income-tax Act 2025 took effect on 1 April 2026 and abolished the entire 194-series of TDS sections that deductors have used since 1961. Salary TDS is now deducted under Section 392, every non-salary TDS category (contractors, rent, professional fees, interest, commission and the rest) sits under a single Section 393 with rates in a Schedule I table, and TCS moved to Section 394.\n\nThe substantive rates and thresholds carried forward largely unchanged. What changed is every label your accounting system, challans and returns use: section numbers, form numbers, and the codes you quote when depositing tax. Deductions from 1 April 2026 onwards (FY 2026-27, the first year fully on the new Act) must use the new references. Deductions up to 31 March 2026 stay under the old Act and old forms.",
    },
    {
      id: "02",
      heading: "THE NEW THREE-SECTION STRUCTURE",
      body:
        "Instead of memorising thirty-plus section numbers, deductors now work with three.",
      bullets: [
        "Section 392: TDS on salary. Replaces Section 192. Employer-side computation logic (regime choice, standard deduction, perquisites) is unchanged in substance.",
        "Section 393: TDS on everything that is not salary. Replaces 194A, 194C, 194H, 194I, 194J, 194Q and the rest of the 194-series. The rate, threshold and payer/payee conditions for each payment type now live in a table in Schedule I of the new Act rather than in separate sections.",
        "Section 394: Tax collected at source. Replaces Section 206C. Scrap, timber, motor vehicles above Rs 10 lakh and the other TCS categories continue with the same rates.",
      ],
      note:
        "In correspondence you will see references like 'Section 393(1) read with Schedule I'. The schedule row, not the section number, is what identifies the payment type.",
    },
    {
      id: "03",
      heading: "OLD SECTION TO NEW REFERENCE: THE MAPPING DEDUCTORS ACTUALLY NEED",
      body:
        "For day-to-day compliance, this is the translation table between what your ledgers say and what the new Act calls the same deduction.",
      table: {
        headers: ["Payment type", "Old section (1961 Act)", "New reference (2025 Act)"],
        rows: [
          ["Salary", "192", "Section 392"],
          ["Interest other than securities", "194A", "Section 393, Schedule I"],
          ["Contractor payments", "194C", "Section 393, Schedule I (challan code 1017)"],
          ["Commission or brokerage", "194H", "Section 393, Schedule I"],
          ["Rent (plant, machinery, property)", "194I", "Section 393, Schedule I"],
          ["Professional and technical fees", "194J", "Section 393, Schedule I"],
          ["Purchase of goods", "194Q", "Section 393, Schedule I"],
          ["TCS (all categories)", "206C", "Section 394"],
        ],
      },
      note:
        "The challan payment codes run from 1001 to 1092, one per payment category. 194C contractor payments map to code 1017; the full code list is published on the e-filing portal and in the challan utility itself.",
    },
    {
      id: "04",
      heading: "CHALLANS NOW USE NUMERIC PAYMENT CODES 1001-1092",
      body:
        "Under the old regime, a TDS challan quoted the section number (192B, 194C, 194J) as the 'nature of payment'. From FY 2026-27, challans use a numeric payment code between 1001 and 1092, each mapped to one payment category. For example, a contractor payment that was deposited under '194C' is now deposited under code 1017.\n\nThis matters because a challan deposited under the wrong code creates a mismatch when the quarterly return is filed, and mismatched challans are the single largest source of TDS default notices. Before your first FY 2026-27 deposit, pull the code list from the e-Pay Tax module and update the mapping in your accounting software, especially if challan generation is automated.",
    },
    {
      id: "05",
      heading: "NEW QUARTERLY RETURN FORMS: 24Q, 26Q, 27Q, 27EQ ARE RETIRED",
      body:
        "The quarterly statement forms were renumbered along with the sections. Filing the old form format for a FY 2026-27 quarter does not work: TRACES rejects old-format uploads for periods starting 1 April 2026, and the Rs 200 per day late fee keeps running while you fix the file format.",
      table: {
        headers: ["Return", "Old form", "New form (FY 2026-27 onwards)"],
        rows: [
          ["Salary TDS statement", "24Q", "Form 138"],
          ["Non-salary resident TDS statement", "26Q", "Form 140"],
          ["TCS statement", "27EQ", "Form 143"],
          ["Non-resident TDS statement", "27Q", "Form 144"],
        ],
      },
      note:
        "Q4 FY 2025-26 (filed by 31 May 2026) was the last quarter on the old forms. Everything filed for periods from Q1 FY 2026-27 onwards uses the new forms.",
    },
    {
      id: "06",
      heading: "THE DEADLINES THAT MAKE THIS URGENT",
      body:
        "The filing calendar itself has not changed, which means the new-format returns are already due on the familiar dates.",
      bullets: [
        "Q2 FY 2026-27 (Jul-Sep 2026): TDS return due 31 October 2026, in the new form format.",
        "Q3 FY 2026-27 (Oct-Dec 2026): due 31 January 2027.",
        "Monthly deposits: unchanged at the 7th of the following month (30 April for March), but on new challan codes.",
        "TDS certificates: issued from the new forms; salary certificates follow the renumbered certificate series rather than the old Form 16 label.",
      ],
      note:
        "Deductors who filed Q1 FY 2026-27 (due 31 July 2026) on the new forms have already been through the transition once. If your Q1 filing bounced for format reasons, the same fix applies to Q2.",
    },
    {
      id: "07",
      heading: "WHAT HAPPENS IF YOU FILE IN THE OLD FORMAT",
      body:
        "The failure mode is quiet and expensive. An old-format FVU file for a FY 2026-27 period is rejected at upload, either at the TIN facilitation centre or on the portal. Rejection is not filing: until a valid new-format statement is accepted, the return is simply late.",
      bullets: [
        "Late filing fee of Rs 200 per day under the fee provision carried into the new Act, capped at the TDS amount in the statement.",
        "Interest on any late-deposited tax at 1% per month (non-deduction) or 1.5% per month (deducted but not deposited).",
        "Deductees cannot see their credit until the statement is accepted, which triggers mismatch queries on their side.",
        "Repeated rejected uploads close to the due date leave no time to regenerate the file, which is how a format problem becomes a multi-week default.",
      ],
    },
    {
      id: "08",
      heading: "WHAT DEDUCTORS SHOULD UPDATE BEFORE THE 31 OCTOBER FILING",
      body:
        "A one-time migration checklist covers almost all of the transition risk.",
      bullets: [
        "Update accounting and payroll software to versions that generate Form 138/140/143/144 files and the 1001-1092 challan codes. Most vendors shipped this in Q1 FY 2026-27; confirm your version.",
        "Re-map every recurring deduction in your system from its old section (194C, 194J, 194I) to the correct Schedule I row and challan code.",
        "Reconcile Q1 and Q2 challans already deposited: any deposited under old-style references should be verified against the return utility before filing.",
        "Update vendor communication templates and TDS certificates so payees see the new references and do not dispute the deduction.",
        "For pre-1 April 2026 periods, keep the old forms: corrections to FY 2025-26 and earlier statements continue on 24Q/26Q/27Q/27EQ under the 1961 Act.",
      ],
    },
    {
      id: "09",
      heading: "WHAT DID NOT CHANGE",
      body:
        "The renumbering is broad but mostly cosmetic, and knowing what stayed the same avoids over-correction.",
      bullets: [
        "Rates and thresholds: contractor, rent, professional fee and interest thresholds carried forward as they stood after Budget 2025 revisions.",
        "Deposit due dates: 7th of the following month, 30 April for March deductions.",
        "Quarterly return due dates: 31 July, 31 October, 31 January, 31 May.",
        "TAN: your TAN continues unchanged; no re-registration on TRACES is needed.",
        "Lower/nil deduction certificates: the mechanism continues; certificates issued under the old Act for periods up to 31 March 2026 do not stretch into FY 2026-27.",
      ],
    },
  ],
  faqs: [
    {
      q: "Do I quote Section 393 or the old 194C in my FY 2026-27 challans and returns?",
      a: "Neither, exactly. Challans for FY 2026-27 use the numeric payment code (1017 for what used to be 194C contractor payments), and the return in Form 140 references the Schedule I payment category. The section number 393 appears on notices and legal documents, but the operative identifier in filings is the payment code.",
    },
    {
      q: "We deposited April-June 2026 TDS under old section references. Is that money lost?",
      a: "No. The tax is with the government and credit is not lost. But the challan-to-statement mapping may throw mismatches when you file the quarterly return. Run the challan verification in the return preparation utility first; where the utility cannot match an old-reference challan to a new-code row, a challan correction request through the bank or the portal fixes the tagging before you file.",
    },
    {
      q: "Our Q2 return is due 31 October 2026. Can we still file it as 26Q?",
      a: "No. For statement periods starting 1 April 2026, TRACES accepts only the new-format forms; a 26Q-format file for Q2 FY 2026-27 is rejected at upload. The rejection does not pause the Rs 200/day late fee, so the practical rule is: generate the Form 140 file well before 31 October and test-validate it, rather than discovering a format rejection on the due date.",
    },
    {
      q: "Does the single Section 393 mean one TDS rate for all non-salary payments now?",
      a: "No. The rates remain differentiated by payment type; they have just moved from individual sections into a table in Schedule I of the new Act. A contractor payment and a professional fee still carry their own rates and thresholds. What is unified is the charging section, not the rates.",
    },
    {
      q: "What happens to a TDS default notice for FY 2024-25 that arrives now? Old sections or new?",
      a: "Old. Proceedings for periods before 1 April 2026 continue under the Income-tax Act 1961 through the savings clause in the new Act, so a short-deduction notice for FY 2024-25 will cite 194C, 201 and the old framework, and corrections for those periods are filed on the old forms. Only FY 2026-27 onwards runs on the new references.",
    },
    {
      q: "Do Form 26QB (property) and 26QC (rent) also change?",
      a: "Yes. The challan-cum-statement forms for property purchase, high-value rent and similar one-off deductions were consolidated into a single Form 141 for deductions from 1 April 2026. That change has its own procedure and is covered in the Form 141 guide; this page covers the regular TAN-based quarterly returns.",
    },
    {
      q: "Is Form 16 also renumbered?",
      a: "Yes, the certificate series was renumbered along with the statement forms; the salary TDS certificate issued for FY 2026-27 will not carry the old Form 16 label. For FY 2025-26 salary certificates issued in June 2026, the old Form 16 applied one last time.",
    },
    {
      q: "Our software vendor has not shipped the new formats. What is the fallback?",
      a: "The income tax department's own Return Preparation Utility (RPU) and File Validation Utility (FVU) versions supporting the new forms are downloadable from the Protean (NSDL) TIN site free of charge. Export your deduction data to the RPU template and file through the utility. It is slower than integrated software but removes the vendor dependency before the 31 October deadline.",
    },
  ],
  sources: [
    {
      name: "India Briefing: TDS under Section 393 of the Income-tax Act 2025",
      url: "https://www.india-briefing.com/",
      description: "Explainer on the consolidation of non-salary TDS into Section 393 and Schedule I.",
    },
    {
      name: "ClearTax: TDS and TCS changes from April 2026",
      url: "https://cleartax.in/",
      description: "Summary of the 392/393/394 structure, renumbered forms and challan code changes.",
    },
    {
      name: "TDSMAN Blog: New TDS/TCS form mapping",
      url: "https://blog.tdsman.com/",
      description: "Old-to-new mapping of quarterly statement forms 24Q/26Q/27EQ/27Q to Forms 138/140/143/144.",
    },
    {
      name: "Income Tax e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "e-Pay Tax module with the 1001-1092 payment code list and new return utilities.",
    },
  ],
};
