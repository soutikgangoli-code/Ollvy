// =============================================================================
// EXEMPLAR DEADLINE PAGE: tax-audit-2026
// File path: lib/deadlines.ts (or wherever DeadlineConfig objects live)
//
// Exemplar 3 of 3. Tax category. Use as template for advance-tax-* and
// tds-return-* deadline pages. Note IT Act 2025 section bridge throughout.
// =============================================================================

import type { DeadlineConfig } from "../deadlines";

export const taxAudit2026: DeadlineConfig = {
  // ====== SERVICE/MARKETING FIELDS ======
  slug: "tax-audit-2026",
  serviceSlug: "tax-audit",
  bookingHref: "/book/tax-audit",
  serviceName: "Tax Audit Report Filing (Form 3CA-3CB-3CD)",
  eventLabel: "Tax audit report for FY 2025-26",
  dueDate: "2026-09-30",
  postDeadlineMessage:
    "The 30 September 2026 tax audit deadline has passed. Section 271B penalty (0.5% of turnover up to Rs 1.5 lakh) now applies. Also blocks ITR filing under Section 44AB. File immediately, we'll handle it.",
  heroTagline:
    "Tax audit due 30 September 2026. Cross Rs 1 Cr turnover (or Rs 50L professional)? You need a 3CD report. We do it for Rs 14,999.",
  purposeLabel: "FILE YOUR TAX AUDIT REPORT",
  eligibilityLabel:
    "Businesses with turnover above Rs 1 crore (Rs 10 crore if 95%+ digital transactions) and professionals with gross receipts above Rs 50 lakh in FY 2025-26.",
  urgencyLine:
    "Tax audit report (Form 3CA/3CB and 3CD) is due one month before the ITR deadline. For FY 2025-26 audit cases, the ITR is due 31 October 2026, so the audit report is due 30 September 2026. Miss this and you can't file the ITR cleanly either.",
  penaltyLine:
    "Section 271B: 0.5 percent of turnover or gross receipts, capped at Rs 1.5 lakh. Plus inability to file ITR under Section 44AB without a valid audit report. Plus disallowance of certain deductions under Sections 35AD, 80-IA, 80-IB.",
  filingCount: 1,
  ollvyFee: 14999,
  govtFee: 0,
  slaDays: 14,
  seoTitle: "Tax Audit Filing 2026 | Form 3CA-3CB-3CD | Due 30 Sep | Ollvy",
  seoDescription:
    "Tax audit under Section 44AB for FY 2025-26 due 30 September 2026. Required if turnover crosses Rs 1Cr or professional receipts cross Rs 50L. 0.5% penalty under Section 271B. Filed by Ollvy.",
  canonicalUrl: "https://www.ollvy.com/tax-audit-2026",
  documentTab: "documents",
  documentHeading: "What we'll need from you",
  risks: [
    {
      title: "Section 271B monetary penalty",
      body:
        "0.5 percent of total turnover or gross receipts for FY 2025-26, subject to a maximum of Rs 1.5 lakh. For a Rs 5 crore turnover business, this is the full Rs 1.5 lakh penalty. For a Rs 1.2 crore turnover business, it's Rs 60,000.",
    },
    {
      title: "ITR rejection or defective return",
      body:
        "If tax audit applies and you file ITR-3 or ITR-5 without the audit report, the system flags the return as defective under Section 139(9). You get 15 days to cure it. If not cured, the return is treated as never filed, with all consequences (loss carry-forward denied, late fee, interest).",
    },
    {
      title: "Disallowance of investment-linked deductions",
      body:
        "Several deductions in the Income Tax Act (35AD, 80-IA, 80-IB, 80-IC, 80-IE) require a tax audit report as a precondition. Skip the audit and these deductions get fully disallowed in the assessment.",
    },
  ],
  testimonials: [
    {
      name: "Vikas N.",
      role: "Founder, e-commerce Pvt Ltd",
      quote:
        "We crossed Rs 1.2 crore turnover for the first time in FY 25-26 and didn't realize tax audit kicked in. Ollvy flagged it in August, did the audit, and filed both the 3CD and the ITR by deadline. Smooth.",
    },
    {
      name: "Dr. Priya S.",
      role: "Independent practitioner",
      quote:
        "My professional receipts crossed Rs 60 lakh in FY 25-26. Ollvy explained the 50L threshold under 44AB(b), did the audit, and structured my advance tax for next year on the basis. Practical, not preachy.",
    },
  ],

  // ====== EDUCATIONAL CONTENT FIELDS ======
  category: "Tax",
  relatedServiceSlugs: ["tax-audit", "itr-filing", "advance-tax-payment"],
  relatedLearnSlugs: ["advance-tax-explained", "esop-structuring"],
  ctaSecondarySlug: "itr-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT TAX AUDIT IS",
      body:
        "A tax audit under Section 44AB of the Income Tax Act 1961 (now Section 63 of the IT Act 2025 for FY 2026-27 onwards) is an independent CA's review of your books, ledgers, and tax computation, focused on whether the numbers reported in your ITR are accurate and consistent with your accounting records. It's not a financial audit (which is governed by the Companies Act and is about true-and-fair view of financials). It's a tax-specific audit that produces a structured report (Form 3CD) capturing about 44 specific data points the Income Tax Department wants visibility on.",
    },
    {
      id: "02",
      heading: "WHO HAS TO GET A TAX AUDIT DONE",
      body:
        "Section 44AB lists the categories. The most common triggers are turnover and gross-receipts thresholds:",
      table: {
        headers: ["Category", "Threshold for FY 2025-26", "Source Section"],
        rows: [
          ["Business (digital receipts/payments above 95%)", "Turnover above Rs 10 crore", "Section 44AB(a) proviso"],
          ["Business (cash receipts/payments above 5%)", "Turnover above Rs 1 crore", "Section 44AB(a)"],
          ["Profession", "Gross receipts above Rs 50 lakh", "Section 44AB(b)"],
          ["Presumptive business (44AD), claiming lower than presumptive profit", "Income exceeds basic exemption limit", "Section 44AB(e)"],
          ["Presumptive profession (44ADA), claiming lower than presumptive profit", "Income exceeds basic exemption limit", "Section 44AB(d)"],
        ],
      },
      note:
        "The Rs 10 crore digital threshold (vs Rs 1 crore otherwise) is one of the most under-leveraged provisions in Indian tax law. If 95 percent or more of your business's receipts and payments happen via banking/digital channels (UPI, NEFT, cards, no cash), you qualify for the higher Rs 10 crore threshold and stay outside the audit net much longer. Document your cash percentage carefully.",
    },
    {
      id: "03",
      heading: "WHEN IT'S DUE",
      body:
        "The tax audit report must be furnished one month before the due date for filing the ITR under Section 139(1). For audit cases, the ITR is due 31 October 2026 (under the IT Act 1961, applicable to FY 2025-26). So the audit report is due 30 September 2026. For transfer pricing cases (international or specified domestic transactions), the ITR shifts to 30 November 2026 and the audit report shifts to 31 October 2026.",
      note:
        "From FY 2026-27 onwards (under the IT Act 2025), the same one-month-before-ITR rule continues. The ITR forms and section numbers get renumbered (Form 3CD becomes Form 26 under the Rules 2026), but the dates and obligations are unchanged.",
    },
    {
      id: "04",
      heading: "FORM 3CA vs FORM 3CB AND THE 3CD",
      body:
        "The audit report consists of two parts:",
      table: {
        headers: ["Form", "When It Applies", "What It Contains"],
        rows: [
          ["Form 3CA", "Companies and others whose accounts are also audited under another law (e.g., Companies Act statutory audit)", "Auditor's report attaching the already-prepared statutory audit accounts"],
          ["Form 3CB", "Sole proprietors, firms, LLPs, etc., whose accounts are not audited under another law", "Standalone auditor's report on financial statements specifically for tax audit"],
          ["Form 3CD", "Always (regardless of 3CA or 3CB)", "Structured statement with about 44 data points: opening/closing stock, deductions claimed, payments to related parties, etc."],
        ],
      },
    },
    {
      id: "05",
      heading: "WHAT FORM 3CD CAPTURES",
      body:
        "Form 3CD is the heart of the tax audit. It's a structured form that walks through the year's tax-sensitive transactions. Key items:",
      bullets: [
        "Method of accounting employed and any change during the year.",
        "Opening and closing inventory with valuation method.",
        "Capital expenditure on scientific research, new plant, etc., that's eligible for accelerated deduction.",
        "Bonus, commission, and similar payments to employees.",
        "Loans and deposits accepted, with names, amounts, and modes (cash above Rs 20K is flagged under Section 269SS).",
        "Payments to related parties under Section 40A(2)(b).",
        "Cash payments above Rs 10,000 (single transaction) under Section 40A(3).",
        "TDS deducted, deposited, and any short-deduction.",
        "GST/Customs/Excise/Service Tax disputes, demands, and refunds.",
        "Any specified domestic transactions or international transactions (cross-references the transfer pricing report).",
      ],
    },
    {
      id: "06",
      heading: "WHO CAN CONDUCT THE AUDIT",
      body:
        "Only a Chartered Accountant in practice (member of ICAI with a Certificate of Practice) can conduct a tax audit. Internal accountants, even if they're qualified CAs, cannot audit their own employer. Per Section 44AB read with Section 288, the same CA cannot conduct more than 60 tax audits in a year (the cap was 30 until FY 2014-15, then 45, then 60). Audits beyond the cap are invalid and trigger a fresh penalty under Section 271B.",
    },
    {
      id: "07",
      heading: "PENALTIES FOR MISSING THE AUDIT",
      body:
        "Section 271B of the Income Tax Act 1961 (which governs FY 2025-26 audits filed in 2026) kicks in if you fail to get the audit done or fail to furnish the report by the due date:",
      bullets: [
        "Penalty of 0.5 percent of total sales, turnover or gross receipts for the year.",
        "Capped at Rs 1.5 lakh.",
        "Discretion lies with the assessing officer to waive the penalty if there's reasonable cause (force majeure, severe medical incapacity of the proprietor, etc.). 'I forgot' or 'my CA was unavailable' do not qualify.",
      ],
      note:
        "Bridge to the IT Act 2025: For FY 2026-27 audits onwards (filed in 2027 and later), Section 271B is replaced by Section 446 of the Income Tax Act 2025, which retains the same 0.5 percent penalty and Rs 1.5 lakh cap. The reasonable-cause defense moves from Section 273B (1961 Act) to Section 470 (2025 Act) but operates on the same principle. So the penalty math doesn't change, just the section number on any order or notice you receive will be the new one for FY 2026-27 onwards. Beyond the statutory penalty, the practical pain is bigger: the ITR can't be filed cleanly, advance tax credits get scrutinized, and any deductions requiring an audit report (35AD, 80-IA series) get disallowed. Treat 30 September as a hard date.",
    },
    {
      id: "08",
      heading: "PRACTICAL TIMELINE: WHEN TO START",
      body:
        "If your books close 31 March 2026 and you target a 30 September 2026 audit completion, work backward:",
      bullets: [
        "April-May 2026: Close books, finalize trial balance, run TDS reconciliation against Form 26AS.",
        "June 2026: Onboard auditor, share books, ledgers, contracts, fixed asset register.",
        "July 2026: Auditor draft of Form 3CD, queries to management, supporting document collection.",
        "August 2026: Final 3CD draft, sign-off by management, auditor signs and uploads.",
        "Early September 2026: Buffer for portal issues, name mismatch corrections, last-minute clarifications.",
        "Latest by 30 September 2026: Audit report furnished on the e-filing portal.",
      ],
      note:
        "Founders who start the audit conversation in September almost never finish in September. Either the auditor doesn't have capacity, or the books reveal issues that take weeks to resolve. Aim for August completion as the working target, September as the safety buffer.",
    },
  ],
  faqs: [
    {
      q: "We're a startup with Rs 80 lakh revenue and Rs 30 lakh expenses. Do we need a tax audit?",
      a: "No, your turnover is below the Rs 1 crore threshold under Section 44AB(a). You can file ITR-3 or ITR-5 without an audit. But you'll still need to maintain books under Section 44AA, get the financial statements audited if you're a Pvt Ltd (mandatory under Companies Act regardless of revenue), and you may want to consider opting into the presumptive scheme under 44AD if you qualify.",
    },
    {
      q: "Our turnover is Rs 1.5 crore but 100% via UPI and bank transfers. Are we exempt?",
      a: "Yes, you fall under the proviso to Section 44AB(a) which allows the higher Rs 10 crore threshold for businesses where 95 percent or more of receipts AND 95 percent or more of payments are non-cash. Document this clearly: a CA-certified statement showing the digital percentage, plus your bank statements as backup. The Income Tax Department occasionally verifies these claims during scrutiny.",
    },
    {
      q: "Can the same CA do our financial audit (Companies Act) and tax audit?",
      a: "Yes. In fact, when both audits are required, it's standard practice to have the same CA do both, and the tax audit report is filed in Form 3CA (which references the financial audit). This saves duplication of work because much of the underlying ledger review is shared. Keep the engagement letters separate to be clear on scope.",
    },
    {
      q: "What's the difference between tax audit and statutory audit?",
      a: "Statutory audit is required under the Companies Act for every Pvt Ltd / LLP (above the LLP threshold) / Public Ltd, and it focuses on the true-and-fair view of financial statements. Tax audit is required under the Income Tax Act when turnover/receipts thresholds are crossed, and it focuses specifically on tax-sensitive items. The two have different objectives, different governing laws, different forms (Form AOC-4 vs Form 3CA-3CB-3CD), and different deadlines. Many small companies need both.",
    },
    {
      q: "Does the new Income Tax Act 2025 change tax audit rules?",
      a: "The substantive rules carry forward unchanged. The threshold (Rs 1 Cr / Rs 10 Cr digital / Rs 50 L professional) stays the same. The form moves from 3CA/3CB/3CD to a unified Form 26 under the Income Tax Rules 2026. Section 44AB of the 1961 Act is now Section 63 of the 2025 Act. The penalty for missing the audit (Section 271B in the 1961 Act, with its 0.5 percent of turnover and Rs 1.5 lakh cap) becomes Section 446 of the 2025 Act with the same numbers. The reasonable-cause defense moves from Section 273B to Section 470. So for FY 2025-26 audits (filed by 30 September 2026), use the old forms and old section references. For FY 2026-27 onwards, use the new forms and the new section numbers.",
    },
  ],
  lastReviewed: "May 2026",
  sources: [
    {
      name: "Income Tax Act 1961, Section 44AB",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Statutory basis for tax audit thresholds and the requirement to furnish Form 3CD (governs FY 2025-26 audits).",
    },
    {
      name: "Income Tax Act 1961, Section 271B",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Penalty for failure to get accounts audited or furnish audit report under Section 44AB (governs FY 2025-26).",
    },
    {
      name: "Income Tax Act 2025, Section 63",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Renumbered tax audit provision applicable from FY 2026-27 onwards.",
    },
    {
      name: "Income Tax Act 2025, Section 446",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Renumbered penalty provision (corresponds to old Section 271B) applicable from FY 2026-27 onwards.",
    },
    {
      name: "Income Tax Rules 1962, Rule 6G (Forms 3CA, 3CB, 3CD)",
      url: "https://incometaxindia.gov.in/Pages/rules/income-tax-rules-1962.aspx",
      description: "Prescribed audit report formats applicable for FY 2025-26.",
    },
    {
      name: "Income Tax e-filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Official portal for furnishing the tax audit report.",
    },
    {
      name: "ICAI Guidance Note on Tax Audit u/s 44AB",
      url: "https://www.icai.org/post/guidance-note-tax-audit",
      description: "Practical guidance on the conduct of tax audit and preparation of Form 3CD.",
    },
  ],
};
