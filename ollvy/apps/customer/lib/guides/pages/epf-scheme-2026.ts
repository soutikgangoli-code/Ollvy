// =============================================================================
// GUIDE PAGE: epf-scheme-2026
// File path: lib/guides/pages/epf-scheme-2026.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const epfScheme2026: LearnPageConfig = {
  slug: "epf-scheme-2026",
  title: "The New EPF Scheme 2026: What Changes for Employers From 1 July",
  seoTitle: "New EPF Scheme 2026: Employer Changes From 1 July | Ollvy",
  seoDescription:
    "The EPF Scheme 2026, effective 1 July 2026, replaces the 1952 Scheme: contributions on SS-Code wages, voluntary employer share above Rs 15,000, EPFO 3.0.",
  canonicalUrl: "https://www.ollvy.com/guides/epf-scheme-2026",
  lastReviewed: "July 2026",
  category: "Payroll",
  relatedServiceSlugs: ["payroll-management", "tds-monthly-compliance"],
  relatedLearnSlugs: [
    "when-does-pf-registration-become-mandatory",
    "when-does-esi-registration-become-mandatory",
    "labour-codes-compliance-2026",
  ],
  ctaServiceSlug: "payroll-management",
  sections: [
    {
      id: "01",
      heading: "WHAT CHANGED ON 1 JULY 2026",
      body:
        "The Employees' Provident Fund Scheme 2026, notified on 29 June 2026 and effective 1 July 2026, replaces the EPF Scheme 1952 that governed provident fund operations for 74 years. The two changes employers feel immediately: contributions are now computed on the Code on Social Security's 'wages' definition (the 50% rule), and the scheme explicitly makes the employer's contribution above the Rs 15,000 wage ceiling voluntary, capping the mandatory employer share at Rs 1,800 per month.\n\nThe 12% + 12% contribution structure, UAN system and EPS/EDLI linkages continue. What the new scheme really does is align PF with the labour codes and complete the EPFO 3.0 shift to an all-electronic operation. Your July 2026 payroll run, deposited by 15 August, is the first one under the new scheme.",
    },
    {
      id: "02",
      heading: "CONTRIBUTIONS NOW RIDE ON THE SS-CODE WAGES DEFINITION",
      body:
        "The 2026 Scheme computes contributions on 'wages' as defined in the Code on Social Security: basic plus DA plus retaining allowance, with the deeming rule that pulls excluded allowances back in if they exceed 50% of total remuneration.",
      bullets: [
        "Old-structure risk: a Rs 80,000 gross salary with Rs 20,000 basic (25%) understates PF wages under the new definition; at least Rs 40,000 counts as wages.",
        "Where the employee's PF wages were below Rs 15,000 due to a low basic, the recomputed wage base can raise both employee and employer contributions.",
        "Where wages already exceed the Rs 15,000 ceiling, contributions can continue to be computed on the ceiling, so the change is muted for higher earners.",
        "Payroll software must map the SS-Code wage components correctly from July 2026; a wrong wage base flows into every monthly ECR filing after it.",
      ],
      note:
        "This is the same 50% definition driving CTC restructuring under the labour codes; PF is where it first bites operationally because deposits are monthly.",
    },
    {
      id: "03",
      heading: "EMPLOYER SHARE ABOVE THE CEILING: NOW EXPLICITLY VOLUNTARY",
      body:
        "Under the 1952 Scheme, whether an employer had to match contributions on wages above the Rs 15,000 statutory ceiling was a matter of practice and precedent. The 2026 Scheme settles it: the employer's mandatory contribution is computed on wages up to Rs 15,000 (Rs 1,800 per month at 12%), and anything above is voluntary.",
      bullets: [
        "Employers currently matching on full basic can continue; the scheme permits it as a voluntary higher contribution.",
        "Employers can restructure to contribute on the ceiling only, but a reduction for existing employees is a change to terms of employment: handle it through consent and communication, not silently through payroll.",
        "Employees can continue voluntary provident fund (VPF) contributions above the ceiling on their own side regardless of the employer's choice.",
        "The long-discussed hike of the wage ceiling from Rs 15,000 to Rs 21,000 was deferred and is not part of the 2026 Scheme. Budget for the current ceiling but model the Rs 21,000 scenario, since it would raise the mandatory employer share to Rs 2,520 per month whenever notified.",
      ],
    },
    {
      id: "04",
      heading: "EPFO 3.0: WHAT ALL-ELECTRONIC ACTUALLY MEANS",
      body:
        "The 2026 Scheme is drafted for a fully digital EPFO. The paper-era provisions of the 1952 Scheme are gone, and member-facing operations move to auto-processing.",
      bullets: [
        "All returns, contributions and member records are electronic; physical forms have no place in the new scheme's machinery.",
        "Withdrawals and advances move to auto-settlement for most claim types, with UPI and ATM-based withdrawal access being rolled out for members.",
        "Auto-settlement reduces the employer's role in claims: fewer attestation touchpoints, but clean member data (Aadhaar-seeded UAN, verified bank details, correct joining/exit dates) becomes the binding constraint.",
        "Employer action item: audit member KYC completeness now. Every unseeded UAN or wrong date-of-exit in your establishment becomes a stuck auto-claim and an employee grievance directed at you.",
      ],
    },
    {
      id: "05",
      heading: "WHAT DID NOT CHANGE",
      body: "",
      bullets: [
        "Contribution rates: 12% employee, 12% employer (8.33% of the employer share to EPS on pensionable wages, balance to EPF), plus EDLI and administrative charges.",
        "Deposit deadline: the 15th of the following month.",
        "Applicability threshold: establishments with 20 or more employees (the SS Code retains the threshold framework).",
        "UAN portability, EPS pension structure and EDLI insurance cover continue.",
        "Interest crediting on member balances continues under the EPFO's annual rate declaration.",
      ],
    },
    {
      id: "06",
      heading: "LATE OR MISSED REMITTANCE: THE COST STRUCTURE",
      body:
        "The enforcement provisions carry into the new framework with their familiar teeth. A missed 15th-of-the-month deposit triggers three separate consequences.",
      bullets: [
        "Interest under Section 7Q: 12% per annum on the delayed amount, from the due date until payment, with no discretion to waive.",
        "Damages under Section 14B: graded by delay duration, historically up to 25% per annum of arrears for delays beyond 6 months; levied after a hearing.",
        "Income-tax disallowance on the employee share: employee contributions deposited after the EPF due date are permanently disallowed as a deduction in the employer's hands (Supreme Court, Checkmate Services, 2022). A Rs 1 lakh employee-share deposit made late costs roughly Rs 25,000-30,000 in extra income tax on top of 7Q and 14B.",
        "Deducted-but-undeposited employee contributions also carry prosecution exposure under the SS Code's penal provisions.",
      ],
      note:
        "The all-electronic system makes delay visible instantly: ECR filing and payment status are machine-tracked, and 7Q/14B notices are increasingly system-generated.",
    },
    {
      id: "07",
      heading: "EMPLOYER TRANSITION CHECKLIST FOR FY 2026-27",
      body: "",
      bullets: [
        "Recompute PF wages for every employee on the SS-Code definition and compare against what your payroll currently uses; fix gaps from the July 2026 payroll onward.",
        "Decide and document your position on above-ceiling employer contributions: continue matching, or restrict to the Rs 15,000 ceiling with employee consent for existing staff.",
        "Complete UAN-Aadhaar seeding and bank KYC for all members before auto-settlement volumes grow.",
        "Verify your establishment's registration continuity under the SS Code framework; no fresh registration is needed but migration notices should be actioned.",
        "Re-test your payroll vendor's ECR output for July 2026 onwards against the new wage base before the 15 August deposit.",
        "Update employment contracts and CTC sheets so the stated PF treatment matches what payroll actually does; mismatches surface in F&F disputes.",
      ],
    },
    {
      id: "08",
      heading: "HOW THIS INTERACTS WITH THE LABOUR CODES TRANSITION",
      body:
        "The EPF Scheme 2026 is the first major scheme notified under the Code on Social Security machinery, and it front-runs the broader CTC restructuring most companies are planning for the April 2027 increment cycle. That creates a sequencing question: PF wages must be right from July 2026, but the full salary restructure may not land until April 2027.\n\nThe workable approach: correct the PF wage base now (it is a payroll computation change, not a CTC change), and fold the visible salary-structure changes into the April 2027 cycle. What is not workable is leaving PF on the old low-basic base until 2027; every month of under-contribution accrues 7Q interest and 14B damages exposure retroactively once assessed.",
    },
  ],
  faqs: [
    {
      q: "Our basic salary is 30% of gross. Do we have to change it from July 2026?",
      a: "For PF computation, yes in effect: contributions under the 2026 Scheme ride on the SS-Code wages definition, under which wages cannot fall below 50% of total remuneration. You can fix the PF wage base in payroll without immediately restructuring the visible CTC, then align the CTC formally in the April 2027 increment cycle. What you cannot do is keep contributing on the old 30% basic.",
    },
    {
      q: "We currently pay employer PF on full basic of Rs 60,000. Can we cut back to the Rs 1,800 ceiling amount?",
      a: "The 2026 Scheme makes above-ceiling employer contribution voluntary, so prospectively the ceiling-only position is legal. But for existing employees, employer PF on full basic is typically part of their contractual CTC; reducing it unilaterally invites disputes and morale damage. Standard practice: keep existing employees whole (or compensate in cash), and set the ceiling-based policy for new hires with a clean contract clause.",
    },
    {
      q: "Did the PF wage ceiling go up to Rs 21,000?",
      a: "No. The hike from Rs 15,000 to Rs 21,000 was widely expected but deferred; the 2026 Scheme retains the Rs 15,000 ceiling. Worth modelling anyway: at Rs 21,000 the mandatory employer share rises from Rs 1,800 to Rs 2,520 per month per capped employee, and more employees fall under mandatory coverage. If it is notified later, it will arrive with its own effective date.",
    },
    {
      q: "What exactly happens if we deposit PF on the 20th instead of the 15th?",
      a: "Three costs. Interest at 12% per annum under 7Q for 5 days (small), damages under 14B at the graded rate for the delay period (levied after notice and hearing), and, the expensive one, permanent income-tax disallowance of the employee-share portion deposited late, per the Supreme Court's Checkmate ruling. For a Rs 2 lakh monthly PF outgo, a habitual 5-day slip can cost tens of thousands a year in disallowance alone. Fix the process, not the individual delay.",
    },
    {
      q: "Does the new scheme change anything for employees below 20 headcount employers who registered voluntarily?",
      a: "Voluntarily covered establishments continue under the same framework; the 2026 Scheme applies to them as it does to mandatorily covered ones. The wage-definition change and the voluntary-above-ceiling rule apply identically. The 20-employee threshold continues to define when coverage becomes mandatory.",
    },
    {
      q: "What do employers need to do for EPFO 3.0 auto-settlement?",
      a: "Mostly data hygiene. Auto-settlement processes claims against the member's recorded KYC: Aadhaar-seeded UAN, verified bank account, accurate date of joining and date of exit. The employer tasks are keeping ECR filings accurate, marking exits promptly, and clearing pending KYC verifications. Establishments with dirty member data will see claims fail and grievances land on HR, even though the settlement itself no longer routes through the employer.",
    },
    {
      q: "Is VPF affected by the new scheme?",
      a: "Employees can continue voluntary contributions above the mandatory rate, and the employer is not required to match them (that was true before and is explicit now). The income-tax treatment of large VPF contributions (interest on employee contributions above Rs 2.5 lakh a year being taxable) is an Income-tax Act matter and continues independently of the scheme change.",
    },
  ],
  sources: [
    {
      name: "EPF Scheme 2026 notification (29 June 2026)",
      url: "https://www.epfindia.gov.in/",
      description: "Official notification replacing the EPF Scheme 1952, effective 1 July 2026.",
    },
    {
      name: "Zoho Payroll Academy: EPF Scheme 2026 explainer",
      url: "https://www.zoho.com/in/payroll/academy/",
      description: "Employer-focused summary of the new scheme's contribution and digital-operations changes.",
    },
    {
      name: "Code on Social Security 2020 (wages definition)",
      url: "https://labour.gov.in/",
      description: "The 50% wages definition on which 2026 Scheme contributions are computed.",
    },
    {
      name: "Supreme Court, Checkmate Services P Ltd v CIT (2022)",
      url: "https://main.sci.gov.in/",
      description: "Ruling that employee PF contributions deposited after the EPF due date are disallowed for income tax.",
    },
  ],
};
