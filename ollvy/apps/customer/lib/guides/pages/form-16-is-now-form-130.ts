// =============================================================================
// GUIDE PAGE: form-16-is-now-form-130
// File path: lib/guides/pages/form-16-is-now-form-130.ts
// Form 16 renumbered to Form 130 under the Income Tax Rules 2026. Employer
// obligations for tax year 2026-27 and what employees should check.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const form16IsNowForm130: LearnPageConfig = {
  slug: "form-16-is-now-form-130",
  title: "Form 16 Is Now Form 130: Salary TDS Certificate for Tax Year 2026-27",
  seoTitle: "Form 16 Is Now Form 130 | Salary TDS Certificate 2027 | Ollvy",
  seoDescription:
    "For tax year 2026-27 your salary TDS certificate is Form 130, not Form 16, under the Income Tax Rules 2026. Employers must issue it by 15 June 2027.",
  canonicalUrl: "https://www.ollvy.com/guides/form-16-is-now-form-130",
  lastReviewed: "July 2026",
  category: "Payroll",
  relatedServiceSlugs: ["payroll-management", "tds-monthly-compliance", "business-itr"],
  relatedLearnSlugs: [
    "salaried-itr-2027",
    "new-tds-sections-fy2026-27",
    "itr-2027",
    "form-141-tds-property-rent",
  ],
  ctaServiceSlug: "payroll-management",
  sections: [
    {
      id: "01",
      heading: "WHAT CHANGED AND WHEN",
      body:
        "For salary paid in tax year 2026-27 (1 April 2026 to 31 March 2027), the TDS certificate your employer issues is Form 130, not Form 16. The renumbering comes from the forms notification under the Income Tax Rules 2026, which accompanied the Income Tax Act 2025 into force on 1 April 2026. The content of the certificate is functionally identical to Form 16; the number, the governing rule, and the section references printed on it are new. The first Form 130s will be issued in mid-2027 for tax year 2026-27, due to employees by 15 June 2027, ahead of the 31 July 2027 salaried ITR deadline.",
    },
    {
      id: "02",
      heading: "THE FULL TDS CERTIFICATE RENUMBERING",
      body:
        "The salary certificate is not the only one that moved. The whole TDS certificate family was renumbered in one go:",
      table: {
        headers: ["Old form (1961 Act rules)", "New form (IT Rules 2026)", "What it certifies"],
        rows: [
          ["Form 16", "Form 130", "TDS on salary"],
          ["Form 16A", "Form 131", "TDS on non-salary payments (professional fees, interest, rent paid to you)"],
          ["Form 16B", "Form 132", "TDS on property purchase, issued by the buyer"],
          ["Form 16C", "Form 133", "TDS on rent by individuals above the threshold"],
          ["Form 26AS", "Form 168", "Annual tax credit statement on the portal"],
        ],
      },
      note:
        "Certificates for FY 2025-26 and earlier keep the old numbers and remain fully valid. Only certificates for income earned from 1 April 2026 use the new series.",
    },
    {
      id: "03",
      heading: "WHAT FORM 130 CONTAINS",
      body:
        "Structurally, Form 130 keeps the familiar two-part layout:",
      bullets: [
        "Part A: quarter-wise summary of TDS deducted and deposited against your PAN, the employer's TAN, and the challan trail. Generated from the TRACES system, so it reflects what actually reached the government.",
        "Part B: the salary annexure. Gross salary break-up, exempt allowances, standard deduction (Rs 75,000), deductions claimed through the employer, the regime applied for TDS, and the final tax computation.",
        "Section references on the form now point to the 2025 Act: salary TDS is deducted under Section 392 (the successor to Section 192), and the deduction entries reference the new Act's numbering (for example, Section 124 for the old 80C basket).",
      ],
    },
    {
      id: "04",
      heading: "EMPLOYER OBLIGATIONS FOR TAX YEAR 2026-27",
      body:
        "For payroll teams, the obligations track the old Form 16 cycle with the new labels:",
      bullets: [
        "Deduct TDS on salary monthly under Section 392, applying each employee's chosen regime and declared investments.",
        "Deposit TDS by the 7th of the following month (30 April for the March deduction) and file the quarterly salary TDS returns.",
        "Generate Form 130 Part A from TRACES after the Q4 return is processed; prepare Part B from payroll records.",
        "Issue Form 130 to every employee from whose salary tax was deducted during tax year 2026-27, by 15 June 2027.",
        "Job leavers are included: an employee who left in August 2026 still gets a Form 130 for the months worked.",
      ],
      note:
        "Payroll software needs the new form templates and the new section references for tax year 2026-27. Certificates generated on legacy Form 16 templates for TY 2026-27 salary are the transition-year mistake to catch in review.",
    },
    {
      id: "05",
      heading: "PENALTY FOR NOT ISSUING FORM 130 ON TIME",
      body:
        "Failure to issue a TDS certificate by the due date attracts a per-day penalty. Under the 1961 Act this was Section 272A(2)(g): Rs 100 per day of default per certificate, capped at the TDS amount involved. The 2025 Act carries an equivalent penalty provision for certificate defaults, with the same per-day structure. For an employer with 50 employees and certificates a month late, the exposure compounds per certificate, not per company, which is why the 15 June date deserves a hard internal deadline of end-May.",
      note:
        "The penalty sits on the employer, not the employee. But the practical cost of a late Form 130 lands on employees who cannot file accurately before the 31 July deadline.",
    },
    {
      id: "06",
      heading: "WHAT EMPLOYEES SHOULD CHECK BEFORE FILING",
      body:
        "Treat Form 130 as a document to verify, not just receive. Five minutes of checking prevents the most common processing demands:",
      bullets: [
        "PAN: one wrong character routes your TDS credit to someone else, and no amount of arguing fixes it faster than the employer correcting their return.",
        "TDS totals: Part A of Form 130 must match Form 168 (the renumbered 26AS) and AIS. Mismatches here become Section 270(1) demands after filing.",
        "Gross salary vs payslips: joining bonuses, RSU perquisites, and final settlements are the usual gaps between payroll reality and Part B.",
        "Regime shown: check whether the employer computed TDS on the new or old regime. You can switch at filing, but knowing the baseline explains any refund or shortfall.",
        "Multiple employers: if you switched jobs in tax year 2026-27, collect a Form 130 from each employer and check that both did not separately apply the standard deduction and basic exemption, which understates combined TDS.",
      ],
    },
    {
      id: "07",
      heading: "IF YOUR EMPLOYER DOES NOT GIVE YOU FORM 130",
      body:
        "You can still file, and you should not miss the ITR deadline waiting. The escalation path:",
      bullets: [
        "Ask payroll or HR in writing, citing the 15 June 2027 due date for the certificate.",
        "Meanwhile, pull Form 168 and AIS from the e-filing portal. If the employer deposited the TDS, the credits appear there and you can file accurately from portal data plus payslips.",
        "If TDS was deducted from your salary but never deposited (Form 168 shows nothing), keep payslips and bank statements as evidence. You are entitled to credit for tax deducted from you; the department pursues the employer for the deposit.",
        "Persistent refusal can be reported through the e-filing portal's grievance route; the certificate default penalty applies to the employer per day per certificate.",
      ],
    },
    {
      id: "08",
      heading: "FREELANCERS AND VENDORS: YOU GET FORM 131, NOT FORM 130",
      body:
        "Form 130 is for salary only. If clients deduct TDS on your professional fees or contract payments, the certificate you receive for tax year 2026-27 is Form 131 (the renumbered Form 16A), issued quarterly. Property buyers who deduct TDS on a purchase issue Form 132 (was 16B), and individual tenants deducting on high rent issue Form 133 (was 16C). The verification habit is identical across all of them: the certificate is only as good as its match with Form 168.",
    },
  ],
  faqs: [
    {
      q: "My employer issued a certificate titled Form 16 for tax year 2026-27. Is it invalid?",
      a: "The correct form for TY 2026-27 is Form 130 under the Income Tax Rules 2026, and employers should reissue on the right template. In practice, what makes or breaks your filing is whether the TDS in the certificate matches Form 168 and AIS. Point payroll to the renumbering notification and ask for a corrected certificate, but do not delay your reconciliation while waiting.",
    },
    {
      q: "Is anything in Form 130 actually different from Form 16, beyond the name?",
      a: "The structure and purpose are the same: Part A for deposited TDS, Part B for the salary computation. What differs is the legal wiring: it is issued under the Income Tax Rules 2026, references Section 392 for salary TDS instead of 192, and uses the 2025 Act's deduction numbering. If you could read a Form 16, you can read a Form 130.",
    },
    {
      q: "When exactly must my employer give me Form 130 for tax year 2026-27?",
      a: "By 15 June 2027. That leaves about six weeks before the 31 July 2027 salaried ITR deadline. If mid-June passes with nothing, chase in writing; the per-day certificate penalty gives payroll teams a real reason to respond.",
    },
    {
      q: "I left my job in October 2026. Do I still get a Form 130?",
      a: "Yes. Every employer that deducted salary TDS during tax year 2026-27 must issue you a Form 130 for the period worked, by 15 June 2027, whether or not you are still employed there. Ex-employees are the most commonly forgotten group; email the old payroll team rather than assuming it will arrive.",
    },
    {
      q: "My Form 130 shows less TDS than my payslips add up to. What happened?",
      a: "Two possibilities. Either a quarter's TDS return was filed with errors (wrong PAN, missed entries), in which case the employer corrects the return and Part A regenerates; or the tax was deducted but not deposited, which is a serious employer-side default. Compare against Form 168: what appears there is what the government actually received against your PAN.",
    },
    {
      q: "Can I file my ITR without Form 130?",
      a: "Yes. Form 130 is evidence, not a filing prerequisite. Form 168, AIS, and your payslips contain everything needed. The risk in filing without it is claiming TDS the employer never deposited, so if you file from payslips, cross-check the credits on the portal first.",
    },
    {
      q: "Does Form 130 apply to my FY 2025-26 certificate too?",
      a: "No. FY 2025-26 salary falls under the 1961 Act, so the certificate for it (issued by mid-June 2026) is a regular Form 16, and it stays valid under that name permanently. The new numbering starts with income earned from 1 April 2026.",
    },
    {
      q: "As an employer, what should we change in payroll before June 2027?",
      a: "Three things: update payroll software to the Form 130 / 131 templates and the 2025 Act section references, re-collect employee regime declarations for tax year 2026-27 under Section 392, and set an internal certificate-generation deadline of end-May 2027 so TRACES processing delays do not push you past 15 June. If payroll is outsourced, confirm the vendor's templates now rather than in May.",
    },
  ],
  sources: [
    {
      name: "Income Tax Rules 2026 - forms notification",
      url: "https://www.incometaxindia.gov.in/Pages/rules/income-tax-rules.aspx",
      description: "Official renumbering of TDS certificates: Form 16 to 130, 16A to 131, 16B to 132, 16C to 133.",
    },
    {
      name: "Income Tax Act 2025, Section 392",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Salary TDS provision, successor to Section 192 of the 1961 Act.",
    },
    {
      name: "EasyOffice - Form 130 vs Form 16 comparison",
      url: "https://www.easyofficesoftware.com/",
      description: "Practitioner-side comparison of the old and new salary TDS certificate formats.",
    },
    {
      name: "TRACES portal",
      url: "https://www.tdscpc.gov.in/",
      description: "Employer-side generation of TDS certificates from processed quarterly returns.",
    },
  ],
};
