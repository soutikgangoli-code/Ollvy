// =============================================================================
// GUIDE PAGE: msme-form-1-h1-2026
// File path: lib/guides/pages/msme-form-1-h1-2026.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const msmeForm1H12026: LearnPageConfig = {
  slug: "msme-form-1-h1-2026",
  title: "MSME Form 1 H1 2026-27: V3 Expanded Disclosure for MSE Suppliers",
  seoTitle: "MSME Form 1 H1 2026 | Due 31 October | V3 Disclosure | Ollvy",
  seoDescription: "File MSME Form 1 H1 (Apr-Sep 2026) by 31 October 2026 under V3 expanded disclosure. Required if any MSE supplier payment exceeded 45 days. Section 405 penalty Rs 25,000 plus Section 43B(h) disallowance.",
  canonicalUrl: "https://www.ollvy.com/guides/msme-form-1-h1-2026",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing"],
  relatedLearnSlugs: ["msme-form-1-h2-2027", "is-msme-registration-worth-it"],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT MSME FORM 1 IS",
      body:
        "MSME Form 1 is a half-yearly return under Section 405 of the Companies Act 2013 read with the MCA Order dated 22 January 2019, the 'Specified Companies (Furnishing of Information about Payment to Micro and Small Enterprise Suppliers) Order'. It is filed by every Specified Company that has dealings with Micro or Small Enterprises (MSEs, those with Udyam Registration). The original 2019 form just asked for outstanding payments beyond 45 days at half-year cutoff. The V3 portal version (live since 15 July 2024) significantly expanded the disclosure scope.",
    },
    {
      id: "02",
      heading: "THE V3 EXPANSION (CRITICAL CHANGE)",
      body:
        "Under the V3 form, if the company has dealt with any MSE supplier during the half-year and at least one payment to an MSE supplier exceeded 45 days from the date of acceptance or deemed acceptance, the company must file MSME Form 1 with disclosure of ALL transactions during the half-year. Filing now requires four buckets of data per MSE supplier:",
      bullets: [
        "Payments made within 45 days during the half-year (new V3 requirement, was not asked under V2).",
        "Payments made after 45 days during the half-year (was asked under V2 only if outstanding at half-year end).",
        "Amount outstanding at half-year end where 45 days have not yet elapsed (new V3 requirement).",
        "Amount outstanding at half-year end where 45 days have elapsed (the original V2 disclosure).",
      ],
      note:
        "The V3 trigger is precise. The form is filed only if at least one payment in the half-year breached 45 days. Companies whose every MSE payment was within 45 days are not required to file (no NIL filing obligation). But once the trigger fires for any one supplier, the disclosure covers all transactions with all MSE suppliers, including on-time payments.",
    },
    {
      id: "03",
      heading: "WHO HAS TO FILE",
      body:
        "Every company (Pvt Ltd, OPC, Public Ltd) that meets the V3 trigger described above. Public sector companies and Section 8 companies are also covered. The triggering condition is a delayed MSE payment, not the company's own size, turnover, or industry.",
    },
    {
      id: "04",
      heading: "WHEN IT IS DUE",
      body:
        "Twice a year. H1 covers April to September with cutoff 30 September, due 31 October. H2 covers October to March with cutoff 31 March, due 30 April of the next year.",
      table: {
        headers: ["Period", "Cutoff Date", "Filing Deadline"],
        rows: [
          ["H1 FY 2026-27", "30 September 2026", "31 October 2026"],
          ["H2 FY 2026-27", "31 March 2027", "30 April 2027"],
        ],
      },
    },
    {
      id: "05",
      heading: "THE 45-DAY RULE UNDER SECTION 15 OF MSMED ACT",
      body:
        "Section 15 of the Micro, Small and Medium Enterprises Development Act 2006 governs the 45-day rule. If there is a written agreement with the MSE supplier, payment must be made within the period specified in the agreement, not exceeding 45 days from the date of acceptance or deemed acceptance. If there is no written agreement, payment must be made within 15 days of acceptance. Beyond these windows, Section 16 imposes interest on the buyer at three times the bank rate of RBI, compounded monthly.",
    },
    {
      id: "06",
      heading: "SECTION 43B(h) OF INCOME TAX ACT (THE BIGGER PAIN)",
      body:
        "Section 43B(h) of the Income Tax Act 1961 (and continued under the IT Act 2025) disallows expenses payable to MSE suppliers as tax-deductible in the year of accrual, if the payment is not made within 15 days (no agreement) or 45 days (with agreement). The expense becomes deductible in the year of actual payment, not the year of accrual. So a delayed MSE payment doesn't just trigger MSME Form 1 obligations, it also pushes a corporate tax liability one year forward, which is a permanent cash flow hit. For most companies, the 43B(h) impact materially exceeds the 405(4) penalty.",
      note:
        "Cross-reference with ITR audit (Form 3CD clause 22) is now standard. Auditors are flagging 43B(h) disallowance during statutory audit, which then has to reconcile with the company's MSME Form 1 disclosure. Inconsistency triggers IT Department scrutiny.",
    },
    {
      id: "07",
      heading: "WHAT GETS DISCLOSED",
      body:
        "Per MSE supplier with whom the company transacted during the half-year:",
      bullets: [
        "Supplier's name and Udyam Registration Number (URN).",
        "Total transaction value during the half-year.",
        "Amount paid within 45 days (new V3 disclosure).",
        "Amount paid after 45 days during the half-year.",
        "Amount outstanding at cutoff where 45 days have not elapsed (new V3 disclosure).",
        "Amount outstanding at cutoff where 45 days have elapsed.",
        "Reason for delay where applicable (dispute, cash flow, administrative).",
      ],
    },
    {
      id: "08",
      heading: "PENALTY FOR NON-FILING",
      body:
        "Two layers stack on a missed MSME Form 1 filing.",
      bullets: [
        "Section 405(4) Companies Act: Rs 25,000 minimum on the company, plus Rs 1,000 per day of continuing default, capped at Rs 3,00,000. Officers in default face Rs 25,000 to Rs 3,00,000 separately.",
        "Section 43B(h) IT Act disallowance: The related MSE expense is disallowed in the year of accrual and only allowed in the year of actual payment. For a Rs 50 lakh expense, the tax impact at 30 percent is Rs 15 lakh, payable a year ahead of when it would otherwise have been due.",
        "Reputational and supplier-relationship damage: MSE suppliers are increasingly aware of buyer-side compliance and may demand evidence of MSME Form 1 filing as part of vendor onboarding.",
      ],
    },
    {
      id: "09",
      heading: "COMMON MISTAKES",
      body:
        "MSME Form 1 errors are usually around vendor classification and the V3 trigger interpretation.",
      bullets: [
        "Assuming MSME status without Udyam verification: Always check the supplier's Udyam Certificate at https://udyamregistration.gov.in/. Self-declared MSME status without Udyam Registration doesn't count.",
        "Filing only when there's a 45-day breach at cutoff: The V3 form requires filing if any payment during the half-year breached 45 days, even if everything was settled before cutoff.",
        "Mixing Medium enterprises into the disclosure: Medium enterprises (turnover up to Rs 250 crore) are not covered by Section 15 of the MSMED Act. Only Micro and Small enterprises are MSE for this purpose.",
        "Using deemed acceptance date when written acceptance exists: The 45-day clock runs from date of acceptance (written) or deemed acceptance (15 days from delivery if no objection). Use the right date.",
        "Skipping NIL filing when no MSE payment breached 45 days: This is correct, NIL filing is not required. But document your basis for not filing in case of future ROC inquiry.",
      ],
    },
  ],
  faqs: [
    {
      q: "Our supplier doesn't have a Udyam certificate. Do we still file?",
      a: "No. The MSME Form 1 obligation triggers only for payments to Udyam-registered Micro or Small enterprises. If the supplier doesn't have a valid Udyam Registration Number, they are outside the framework and no Form 1 obligation arises. But you should obtain a written declaration from the supplier confirming non-MSME status, since suppliers can register at any time.",
    },
    {
      q: "All payments to MSE vendors were on time. Do we still need to file under V3?",
      a: "No. The V3 trigger is a 45-day breach during the half-year. If every payment was within 45 days, the form is not required. However, the V3 form does have an option to voluntarily disclose on-time payments, which some companies choose to do as a clean record.",
    },
    {
      q: "We dispute an invoice. Do we still disclose the outstanding amount?",
      a: "Yes. Outstanding amounts are disclosed regardless of dispute status, with the dispute noted as a reason for non-payment. The Section 16 interest meter still runs unless the dispute is upheld, but the form filing is mandatory.",
    },
    {
      q: "Penalty for first-time non-filing?",
      a: "Section 405(4) doesn't have a first-time waiver. A late filing or non-filing triggers Rs 25,000 minimum, plus Rs 1,000 per day. ROC has been adjudicating actively under V3, so don't bank on enforcement leniency.",
    },
    {
      q: "Section 43B(h) disallowance: how is it computed and how does Form 1 trigger it?",
      a: "Section 43B(h) is computed at corporate tax filing time, not at Form 1 filing time. The auditor reviews payment timing for all MSE expenses and disallows the year-of-accrual deduction for any expense not paid within 15 / 45 days. The disallowance becomes deductible in the year of actual payment, so the impact is timing (one year forward) not permanent. But the cash outflow on the disallowed tax in year 1 is real and irreversible.",
    },
  ],
  sources: [
    {
      name: "MSMED Act 2006, Section 15 and Section 23",
      url: "https://msme.gov.in/sites/default/files/MSMED2006act.pdf",
      description: "Statutory basis for the 45-day payment rule and interest on delayed payments.",
    },
    {
      name: "Companies Act 2013, Section 405",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory basis for the half-yearly return obligation.",
    },
    {
      name: "MCA Order dated 22 January 2019 (Specified Companies Order)",
      url: "https://www.mca.gov.in/Ministry/pdf/Specified_Companies_22012019.pdf",
      description: "Specified Companies (Furnishing of Information about Payment to Micro and Small Enterprise Suppliers) Order 2019.",
    },
    {
      name: "MCA V3 Portal MSME Form 1 (Expanded Disclosure)",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "V3 form went live 15 July 2024 with expanded disclosure framework requiring all-transaction reporting if any 45-day breach occurs during the half-year.",
    },
    {
      name: "Income Tax Act 1961, Section 43B(h)",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Disallowance of MSE-related expenses if not paid within 15 / 45 days, applicable from FY 2023-24 onwards.",
    },
    {
      name: "Udyam Registration Portal",
      url: "https://udyamregistration.gov.in/",
      description: "Official portal to verify supplier Udyam Registration status.",
    },
  ],
};
