// =============================================================================
// GUIDE PAGE: labour-codes-compliance-2026
// File path: lib/guides/pages/labour-codes-compliance-2026.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const labourCodesCompliance2026: LearnPageConfig = {
  slug: "labour-codes-compliance-2026",
  title: "The Four Labour Codes Are Live: What SME Employers Must Change in 2026-27",
  seoTitle: "Labour Codes Compliance 2026: Employer Checklist | Ollvy",
  seoDescription:
    "Four labour codes in force since 21 Nov 2025, Central Rules notified 8 May 2026. The 50% wages rule reshapes PF, gratuity and take-home. Fines up to Rs 3 lakh.",
  canonicalUrl: "https://www.ollvy.com/guides/labour-codes-compliance-2026",
  lastReviewed: "July 2026",
  category: "Payroll",
  relatedServiceSlugs: ["payroll-management", "tds-monthly-compliance", "pvt-ltd-incorporation"],
  relatedLearnSlugs: [
    "epf-scheme-2026",
    "when-does-pf-registration-become-mandatory",
    "when-does-esi-registration-become-mandatory",
    "do-i-need-shop-establishment-registration",
    "do-i-need-professional-tax-registration",
  ],
  ctaServiceSlug: "payroll-management",
  sections: [
    {
      id: "01",
      heading: "WHERE LABOUR LAW STANDS IN MID-2026",
      body:
        "The four labour codes (Code on Wages, Industrial Relations Code, Code on Social Security, Occupational Safety Code) came into force on 21 November 2025, replacing 29 central labour laws, and the Central Rules along with Model Standing Orders were notified on 8 May 2026. For employers, the single biggest operative change is the new definition of 'wages': at least 50% of total remuneration must count as wages for PF, gratuity and related computations, which forces a restructuring of most CTC structures built around a low basic salary.\n\nState rules are still rolling out through 2026-27, so enforcement intensity varies by state, but the central framework and its penalty schedule are already law. Employers who wait for their state's rules before touching salary structures are compounding a transition they will have to make anyway.",
    },
    {
      id: "02",
      heading: "THE 50% WAGES DEFINITION, IN PLAIN TERMS",
      body:
        "The codes define 'wages' as basic pay plus dearness allowance plus retaining allowance, and then add a deeming rule: if the excluded components (HRA, conveyance, bonus, overtime, most allowances) exceed 50% of total remuneration, the excess is added back into wages. The practical effect: wages for statutory purposes can never be less than 50% of total pay.",
      bullets: [
        "Old structure: basic Rs 25,000 on a Rs 1,00,000 CTC (25%) kept PF and gratuity contributions low.",
        "Under the codes: at least Rs 50,000 of that Rs 1,00,000 counts as wages, roughly doubling the base for gratuity and pushing up PF where contributions ride on actual wages.",
        "Employee take-home falls because employee PF contributions rise; employer cost rises because employer PF and gratuity accruals rise.",
        "Gratuity impact is the sleeper: gratuity at 15 days' wages per year of service on a doubled wage base roughly doubles the accrued liability for long-tenure staff.",
      ],
      note:
        "Interaction with the EPF wage ceiling matters: where PF is capped at the Rs 15,000 ceiling, the PF impact is muted, but gratuity and leave encashment computations have no such ceiling.",
    },
    {
      id: "03",
      heading: "MANDATORY APPOINTMENT LETTERS FOR EVERY EMPLOYEE",
      body:
        "The codes make a formal appointment letter mandatory for every employee, in the format prescribed under the rules, including existing employees hired informally years ago. For SMEs that grew on offer emails and WhatsApp confirmations, this is a document-generation project: every current employee needs a compliant letter stating designation, wages, social security entitlements and category. Inspectors under the codes' inspection scheme treat missing appointment letters as a first-line default because it is the easiest thing to check.",
    },
    {
      id: "04",
      heading: "FULL AND FINAL SETTLEMENT WITHIN 2 DAYS",
      body:
        "Under the Code on Wages, when an employee is removed, retrenched, or resigns, final wages must be paid within 2 working days of the last day. The traditional '45-day F&F cycle' most companies run is now a statutory default.",
      bullets: [
        "The 2-day clock covers wages payable; components genuinely requiring computation (gratuity, leave encashment) follow their own timelines, but wage components cannot wait for the monthly payroll run.",
        "Exit processes need re-engineering: asset recovery, clearance workflows and notice-period adjustments must run before the last working day, not after.",
        "Delayed payment exposes the employer to claims with interest and penalties under the code's wage-claim machinery.",
      ],
    },
    {
      id: "05",
      heading: "SINGLE REGISTRATION AND CONSOLIDATED RETURNS UNDER THE SS CODE",
      body:
        "The Code on Social Security replaces separate EPF and ESI registrations with a single registration for establishments, and consolidates multiple returns into unified filings. Aadhaar-seeded universal account numbers carry across jobs, and gig and platform workers enter the social security net through aggregator contributions.",
      bullets: [
        "Existing EPF and ESI registrations migrate; new establishments register once under the SS Code.",
        "Return consolidation cuts filing count but raises the stakes per filing: one wrong consolidated return touches every scheme at once.",
        "Fixed-term employees get gratuity on a pro-rata basis without the five-year qualifying condition, changing the cost math of fixed-term contracts.",
      ],
    },
    {
      id: "06",
      heading: "THE PENALTY SCHEDULE EMPLOYERS ARE NOW UNDER",
      body:
        "The codes decriminalise first offences in many areas in favour of monetary penalties, but the amounts are materially higher than the old laws, and repeat contraventions bring imprisonment back.",
      bullets: [
        "Wage-related contraventions: penalties up to Rs 50,000 for a first offence, and up to Rs 1 lakh with possible imprisonment up to 3 months for repeat offences within 5 years.",
        "Social security contraventions: up to Rs 50,000 to Rs 1 lakh at first instance depending on the default; failure to pay contributions carries imprisonment provisions where employee contributions were deducted but not deposited.",
        "Serious and repeat contraventions across the codes scale to Rs 2-3 lakh, with imprisonment for repeat offenders.",
        "Officer liability: the codes name the person responsible for compliance; in an SME that is usually a director or the founder directly.",
        "An inspector-cum-facilitator regime replaces the old inspector raj: first-time defaults typically get an improvement opportunity before penalty, which makes documented, prompt correction valuable.",
      ],
    },
    {
      id: "07",
      heading: "WHAT TO ACTUALLY DO: THE SME COMPLIANCE SEQUENCE",
      body:
        "For a typical 10-200 employee company, the transition is a five-workstream project.",
      bullets: [
        "Restructure CTC: rebuild salary structures so wages are at least 50% of total remuneration; model the PF, gratuity and take-home impact per employee band before announcing anything.",
        "Paper the workforce: issue compliant appointment letters to all existing employees and update templates for new hires.",
        "Rebuild exit workflows: pre-exit clearance and 2-day F&F payment capability, tested on the next few exits.",
        "Update registrations and returns: verify establishment registration status under the SS Code and map which consolidated returns replace your current EPF/ESI/labour filings.",
        "Re-baseline gratuity provisioning: get an updated actuarial or formula-based gratuity estimate on the new wage base; auditors will ask for it at FY 2026-27 close.",
      ],
    },
    {
      id: "08",
      heading: "WHY APRIL 2027 IS THE REAL DEADLINE EMPLOYERS ARE PLANNING FOR",
      body:
        "The April 2027 increment cycle is the first full salary-revision season with the codes and their rules completely in force, and it is the natural moment to implement restructured CTCs: increments absorb part of the take-home reduction, so employees see a smaller net change than a mid-year restructure would cause.\n\nWorking backwards, that means modelling and board sign-off in Q3 FY 2026-27 (October-December 2026), employee communication in Q4, and go-live with April 2027 payroll. Companies that leave it past December 2026 end up either restructuring mid-cycle (bad for morale) or carrying non-compliant wage structures into a second full year of the codes (bad in an inspection).",
    },
    {
      id: "09",
      heading: "STATE RULES: WHAT VARIES AND WHAT DOES NOT",
      body:
        "Labour is a concurrent subject, so states notify their own rules under the codes, and these are landing unevenly through 2026-27.",
      bullets: [
        "Does not vary: the wages definition, F&F timelines, appointment letter mandate, penalty schedule, and the codes' core obligations. These are central law, in force now.",
        "Varies by state: registration procedure details, shops and establishment interplay, working hour and overtime fine print, welfare board contributions, and the effective start of state-level inspections.",
        "Multi-state employers should build to the central floor plus the strictest applicable state rule, rather than running state-by-state variants of core policies.",
      ],
    },
  ],
  faqs: [
    {
      q: "We have 15 employees and everyone is on an offer email. Are appointment letters really mandatory for old staff?",
      a: "Yes. The mandate covers every employee, not just new joiners, and the rules prescribe the format. For a 15-person company this is a one-week exercise: generate letters from the prescribed format with current designation and wage details, have both sides sign, and file copies. It is also the first document an inspector-cum-facilitator asks for.",
    },
    {
      q: "Does the 50% wages rule mean every employee's PF contribution doubles?",
      a: "No. Where PF contributions are computed on the statutory wage ceiling of Rs 15,000, employees already at or above the ceiling see little PF change. The bigger, universal impact is on gratuity and leave encashment, which have no ceiling and now ride on a wage base of at least 50% of total remuneration. Model it band by band; blanket assumptions in either direction are wrong.",
    },
    {
      q: "Our F&F process takes 30-45 days. What exactly must be paid in 2 days?",
      a: "Wages payable up to the last working day, where employment ends by resignation, removal or retrenchment. Components that need computation or have their own statutory timelines (gratuity via its claim process, for instance) are not what the 2-day rule targets, but salary, unpaid allowances and wage arrears are. Practically, run clearance before the last day and pay the wage component within 2 working days, settling computed dues immediately after.",
    },
    {
      q: "Will restructuring to 50% basic reduce my employees' take-home pay?",
      a: "Usually yes, modestly, because employee PF contributions rise with the wage base (where not ceiling-capped) even as gross stays flat. That is why the April 2027 increment cycle is the preferred implementation window: a 8-10% increment can absorb a 2-3% take-home dip so no one sees a smaller credit. Communicate the retirement-savings upside; the money moves to PF and gratuity, it does not disappear.",
    },
    {
      q: "We are registered under EPF and ESI already. Do we need to re-register under the SS Code?",
      a: "Existing registrations carry over into the SS Code framework; you do not start from zero. What changes is the return architecture (consolidated filings) and the compliance surface (fixed-term gratuity, aggregator provisions if relevant). Verify your establishment's status on the portals once your state's machinery goes live, and watch for migration notifications rather than filing fresh registrations unprompted.",
    },
    {
      q: "What is the realistic penalty exposure if we simply do nothing this year?",
      a: "Stacked exposure across codes: wage-structure non-compliance, missing appointment letters and late F&F each carry penalties that start around Rs 50,000 and scale to Rs 2-3 lakh for repeat contraventions, with imprisonment provisions for repeat offences and for deducted-but-undeposited employee contributions. First inspections typically yield an improvement notice rather than an immediate fine, but 'we were waiting for state rules' is not a defence to central-law obligations in force since November 2025.",
    },
    {
      q: "Do the codes apply to a 8-person startup?",
      a: "The Code on Wages applies to all establishments regardless of headcount, so the wages definition, timely-payment and F&F rules apply to you. Threshold-based obligations (PF at 20 employees, ESI at 10, standing orders at higher counts) keep their thresholds. So a 8-person startup restructures wages and issues appointment letters now, and picks up PF/ESI obligations as it crosses the headcount lines.",
    },
  ],
  sources: [
    {
      name: "DLA Piper: India's labour codes Central Rules alert",
      url: "https://www.dlapiper.com/",
      description: "Analysis of the Central Rules and Model Standing Orders notified 8 May 2026.",
    },
    {
      name: "Government of India: Labour Codes portal",
      url: "https://www.india.gov.in/",
      description: "Official texts of the four codes and implementation notifications.",
    },
    {
      name: "Code on Wages 2019 and Code on Social Security 2020",
      url: "https://labour.gov.in/",
      description: "Wages definition, payment timelines, penalty schedules and social security obligations.",
    },
  ],
};
