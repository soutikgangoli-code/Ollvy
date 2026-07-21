// =============================================================================
// GUIDE PAGE: msme-form-1-h2-2027
// File path: lib/guides/pages/msme-form-1-h2-2027.ts
// Converted from deadline DeadlineConfig to LearnPageConfig.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const msmeForm1H22027: LearnPageConfig = {
  slug: "msme-form-1-h2-2027",
  title: "MSME Form 1 H2 2026-27: Year-End Cutoff and Section 43B(h) Reconciliation",
  seoTitle: "MSME Form 1 H2 2027 | Due 30 April | Year-End Filing | Ollvy",
  seoDescription: "File MSME Form 1 H2 (Oct 2026 - Mar 2027) by 30 April 2027 under V3 expanded disclosure. Year-end cutoff aligns with 43B(h) tax audit. Section 405 penalty Rs 25,000+ for delays. Filed by Ollvy.",
  canonicalUrl: "https://www.ollvy.com/guides/msme-form-1-h2-2027",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing"],
  relatedLearnSlugs: ["msme-form-1-h1-2026", "is-msme-registration-worth-it"],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT MSME FORM 1 H2 COVERS",
      body:
        "H2 captures all transactions with Micro or Small Enterprise (MSE) suppliers between 1 October 2026 and 31 March 2027, with disclosure structure identical to H1. The trigger is the same: at least one payment to an MSE supplier breached 45 days during the half-year. If triggered, the form discloses all four buckets (paid within 45 days, paid after 45 days, outstanding less than 45 days, outstanding more than 45 days) for every MSE supplier transacted with during the half-year.",
    },
    {
      id: "02",
      heading: "WHY H2 IS DIFFERENT FROM H1",
      body:
        "Three things make H2 materially harder than H1 even though the form structure is identical.",
      bullets: [
        "Year-end cutoff: H2 cutoff is 31 March, which is also the FY end. The MSE outstanding balance at 31 March feeds directly into the financial audit and into the Form 3CD clause 22 disclosure for tax audit purposes.",
        "Section 43B(h) crystallisation: The 43B(h) disallowance for FY 2026-27 is computed on the books position at 31 March 2027. If MSME Form 1 H2 shows a different picture from the tax audit, the IT Department flags the inconsistency.",
        "Tighter window: 30 April leaves just 30 days from FY-end, competing with statutory audit kickoff, advance tax Q4 reconciliation, Form 16 prep, and book closure.",
      ],
    },
    {
      id: "03",
      heading: "THE H2 RECONCILIATION CHAIN",
      body:
        "MSME Form 1 H2, the tax audit Form 3CD clause 22, and the financial books all describe the same underlying MSE supplier position at 31 March 2027. They have to match. The reconciliation chain runs:",
      bullets: [
        "Books: MSE supplier ledger showing every invoice, payment, and outstanding amount.",
        "Form 3CD clause 22 (tax audit): Itemised list of MSE expenses with payment status, used to compute 43B(h) disallowance.",
        "MSME Form 1 H2 (MCA): Half-year transaction summary with V3 four-bucket disclosure.",
        "Section 16 interest accrual under MSMED Act on delayed payments, separately tracked in books.",
      ],
      note:
        "Most MSE-related notices from regulators come from gaps in this chain. The discipline of reconciling the three filings before any of them is finalised is the lowest-cost protection against MSE compliance trouble.",
    },
    {
      id: "04",
      heading: "WHAT GETS DISCLOSED (SAME AS H1)",
      body:
        "Per MSE supplier with whom the company transacted during October 2026 to March 2027:",
      bullets: [
        "Supplier's name and Udyam Registration Number (URN).",
        "Total transaction value during the half-year.",
        "Amount paid within 45 days (V3 disclosure).",
        "Amount paid after 45 days during the half-year.",
        "Amount outstanding at 31 March 2027 where 45 days have not elapsed (V3 disclosure).",
        "Amount outstanding at 31 March 2027 where 45 days have elapsed.",
        "Reason for delay where applicable.",
      ],
    },
    {
      id: "05",
      heading: "THE 45-DAY RULE AND SECTION 16 INTEREST",
      body:
        "Section 15 of the MSMED Act 2006 governs the 45-day window (15 days if no written agreement). Section 16 imposes interest on the buyer at three times the bank rate of RBI, compounded monthly, for any payment beyond the window. The interest is automatic by operation of law, regardless of whether the supplier formally claims it. If unpaid at year-end, it appears as a liability in the books and gets disclosed in the tax audit.",
    },
    {
      id: "06",
      heading: "SECTION 43B(h) DISALLOWANCE FOR FY 2026-27",
      body:
        "Section 43B(h) of the IT Act disallows MSE-related expenses as tax-deductible in the year of accrual if not paid within 15 / 45 days. The expense becomes deductible in the year of actual payment. For FY 2026-27 closing on 31 March 2027, the 43B(h) computation requires:",
      bullets: [
        "Identify every MSE-supplier expense booked during FY 2026-27 (whether paid or unpaid at year-end).",
        "Classify each by acceptance date and payment date.",
        "For expenses not paid within 15 / 45 days, disallow in FY 2026-27 and defer to the year of payment.",
        "Compute the tax impact at the company's effective rate (typically 25 percent for new regime corporates, 30 percent for old regime).",
      ],
      note:
        "MSME Form 1 H2 is filed before the tax audit is signed in most cases. Once filed, it becomes the data source the auditor cross-checks. So get the underlying MSE classification right before either filing goes out.",
    },
    {
      id: "07",
      heading: "INCOME TAX ACT 2025 STATUS",
      body:
        "Section 43B of the 1961 Act maps to Section 22 of the Income Tax Act 2025, with the same substantive structure. The clause(h) for MSE disallowance is preserved. So FY 2026-27 audit and 43B(h) computation continues with the same rules; only the section reference shifts to the new Act.",
    },
    {
      id: "08",
      heading: "PENALTY FOR LATE FILING",
      body:
        "Section 405(4) Companies Act: Rs 25,000 minimum on the company plus Rs 1,000 per day continuing default capped at Rs 3,00,000. Officers in default face Rs 25,000 to Rs 3,00,000. Plus the 43B(h) tax disallowance, which is the bigger pain for most companies.",
    },
  ],
  faqs: [
    {
      q: "We have the same MSE outstanding balance in books, MSME Form 1, and tax audit. Are we safe?",
      a: "Yes, that's the goal. The three filings should describe the same underlying position. If they match, you've eliminated the most common source of regulatory inconsistency notices. Document the reconciliation as part of your year-end finance close.",
    },
    {
      q: "Can H2 be filed late if H1 was filed on time?",
      a: "Each half-year is a separate filing obligation. Filing H1 on time doesn't grace H2. Late H2 attracts Section 405(4) penalty independently.",
    },
    {
      q: "Year-end MSE invoice received on 31 March but payment on 5 April. Where does it go?",
      a: "The invoice books in FY 2026-27 if accepted before 31 March (accrual basis). The payment books on 5 April in FY 2027-28. For 43B(h), the 5-day gap is well within the 15 / 45 day window if your terms allow, so no disallowance. For MSME Form 1 H2, the position at 31 March 2027 (outstanding less than 45 days) is disclosed in the third bucket.",
    },
    {
      q: "Our auditor is recomputing 43B(h) based on a stricter view than ours. Conflict?",
      a: "Common situation. The auditor's interpretation prevails for the audit report; you can disclose your differing view in the audit response notes. For MSME Form 1 H2, use the auditor's classification to keep the two filings consistent.",
    },
    {
      q: "Does the IT Act 2025 change Section 43B(h)?",
      a: "Substantively no. Section 43B of the 1961 Act maps to Section 22 of the IT Act 2025, with clause(h) for MSE disallowance preserved. The FY 2026-27 audit and 43B(h) computation continue with the same rules under the new Act.",
    },
  ],
  sources: [
    {
      name: "MSMED Act 2006, Section 15 and Section 16",
      url: "https://msme.gov.in/sites/default/files/MSMED2006act.pdf",
      description: "45-day payment rule (Section 15) and interest at 3x bank rate compounded monthly on delayed payments (Section 16).",
    },
    {
      name: "Companies Act 2013, Section 405",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Half-yearly return obligation.",
    },
    {
      name: "MCA Order dated 22 January 2019 (Specified Companies Order)",
      url: "https://www.mca.gov.in/Ministry/pdf/Specified_Companies_22012019.pdf",
      description: "Specified Companies (Furnishing of Information about Payment to Micro and Small Enterprise Suppliers) Order 2019.",
    },
    {
      name: "MCA V3 Portal MSME Form 1 (Expanded Disclosure)",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "V3 form expanded disclosure framework, live since 15 July 2024.",
    },
    {
      name: "Income Tax Act 1961, Section 43B(h)",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Disallowance of MSE-related expenses; corresponds to Section 22(h) of the IT Act 2025 from FY 2026-27 onwards.",
    },
  ],
};
