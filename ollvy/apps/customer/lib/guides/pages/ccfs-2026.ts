// =============================================================================
// GUIDE PAGE: ccfs-2026
// File path: lib/guides/pages/ccfs-2026.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const ccfs2026: LearnPageConfig = {
  slug: "ccfs-2026",
  title: "CCFS 2026: MCA Amnesty for Pending ROC Filings Ends 31 August",
  seoTitle: "CCFS 2026 | MCA Amnesty Ends 31 Aug, 10% Late Fees | Ollvy",
  seoDescription:
    "MCA CCFS window closes 31 August 2026: clear pending AOC-4, MGT-7 and ADT-1 at 10% of additional fees. Miss it and Rs 100/day per form returns in full.",
  canonicalUrl: "https://www.ollvy.com/guides/ccfs-2026",
  lastReviewed: "July 2026",
  category: "ROC Filing",
  relatedServiceSlugs: ["mca-annual-filing", "din-reactivation", "pvt-ltd-incorporation"],
  relatedLearnSlugs: [
    "mca-annual-filing-aoc-4-mgt-7",
    "roc-annual-filing-default-notice",
    "dir-3-kyc-din-deactivation",
    "pas-6-2026",
    "mgt-7-2026",
    "adt-1-2026",
  ],
  ctaServiceSlug: "mca-annual-filing",
  tool: {
    type: "eligibility",
    title: "Can your company use the CCFS 2026 amnesty?",
    questions: [
      {
        text: "Which filings are pending?",
        options: [
          { value: "annual_forms", label: "AOC-4, MGT-7/MGT-7A, ADT-1, or foreign company (FC) forms" },
          { value: "other_forms", label: "DIR-3 KYC, DPT-3, PAS-6, charge forms, or LLP forms" },
        ],
        exitOn: {
          other_forms: {
            type: "ineligible",
            headline: "Those forms are outside CCFS - normal fees apply.",
            body:
              "The 10% concession covers AOC-4, MGT-7/7A, ADT-1 and FC forms only. DIR-3 KYC reactivation stays at Rs 5,000 per director, DPT-3 and PAS-6 pay normal additional fees, and LLP Forms 8/11 follow the LLP fee regime entirely. There is nothing to wait for - every extra day just adds to the bill.",
            ctaLabel: "Clear the pending filings",
            ctaHref: "/checkout/mca-annual-filing",
          },
        },
      },
      {
        text: "How many financial years of default?",
        options: [
          { value: "one_two", label: "1-2 years" },
          { value: "three_plus", label: "3 or more years" },
        ],
      },
      {
        text: "What is the plan for the company?",
        options: [
          { value: "active", label: "Keep operating" },
          { value: "strike_off", label: "Shut it down (strike-off)" },
          { value: "dormant", label: "Pause operations (dormant status)" },
        ],
      },
    ],
    resultRules: [
      {
        if: [{ q: 2, anyOf: ["strike_off"] }],
        result: {
          type: "eligible",
          headline: "Use CCFS to exit cheaply: annual forms at 10%, then STK-2 at 25%.",
          body:
            "Strike-off requires overdue annual returns filed first, so the sequence is: clear pending AOC-4/MGT-7 at 10% of additional fees, then file STK-2 at 25% of fees - both before 31 August 2026. This is the cheapest formal exit the MCA has offered since 2020. An abandoned, un-struck-off company keeps generating director liability every year, and the Registrar can strike it off anyway (Section 248(1)), freezing bank accounts in the process.",
          ctaLabel: "Start the exit filing",
          ctaHref: "/checkout/mca-annual-filing",
        },
      },
      {
        if: [{ q: 2, anyOf: ["dormant"] }],
        result: {
          type: "eligible",
          headline: "File the backlog at 10%, then MSC-1 at 50% for dormant status.",
          body:
            "CCFS prices the pause route deliberately: pending AOC-4/MGT-7 clear at 10% of additional fees, and the dormant application (MSC-1) files at 50% of fees. Dormant status cuts annual compliance to a single MSC-3 return instead of the full AOC-4/MGT-7 cycle - and keeps the company alive for a restart. Both steps must land before 31 August 2026.",
          ctaLabel: "Clear the backlog first",
          ctaHref: "/checkout/mca-annual-filing",
        },
      },
      {
        if: [
          { q: 1, anyOf: ["three_plus"] },
          { q: 2, anyOf: ["active"] },
        ],
        result: {
          type: "conditional",
          headline: "Eligible at 10% - but check the directors' DINs before anything else.",
          body:
            "Three consecutive unfiled years triggers director disqualification (Section 164(2)): 5 years, across all companies, with DINs deactivated. CCFS clears the company's backlog at 10% of the Rs 100/day additional fees and stops the default from continuing, but deactivated DINs must be fixed first or the forms will not take signatures. Audit, AGM paperwork and KYC reactivation each take 1-3 weeks - against a 31 August 2026 close, start this week.",
          ctaLabel: "Clear 3 years of filings",
          ctaHref: "/checkout/mca-annual-filing",
        },
      },
      {
        if: [{ q: 2, anyOf: ["active"] }],
        result: {
          type: "eligible",
          headline: "Eligible - file at 10% of late fees before 31 August 2026.",
          body:
            "The math: a 500-day-late AOC-4 carries Rs 50,000 in additional fees at the normal Rs 100/day rate; under CCFS it is Rs 5,000. Two years of AOC-4 + MGT-7 drop from about Rs 2.23 lakh to Rs 22,300. From 1 September 2026 the full daily rate returns and the MCA has signalled adjudication (Section 454) for companies that stayed in default. The concession applies automatically at fee computation - no separate application.",
          ctaLabel: "File under CCFS now",
          ctaHref: "/checkout/mca-annual-filing",
        },
      },
    ],
    defaultResult: {
      type: "eligible",
      headline: "Most annual-filing defaults qualify - but only until 31 August 2026.",
      body:
        "Pending AOC-4, MGT-7/7A and ADT-1 clear at 10% of additional fees while the window is open. After 31 August 2026 the Rs 100/day per form rate returns in full, uncapped, and post-scheme enforcement is the MCA's stated priority.",
      ctaLabel: "Clear the backlog",
      ctaHref: "/checkout/mca-annual-filing",
    },
  },
  sections: [
    {
      id: "01",
      heading: "WHAT CCFS 2026 IS AND WHY IT MATTERS RIGHT NOW",
      body:
        "The Companies Compliance Facilitation Scheme (CCFS) 2026 is a one-time MCA amnesty that lets companies file pending annual returns and event forms at 10% of the normal additional fees, instead of the full Rs 100 per day per form. The window runs from 15 April 2026 to 31 August 2026, which leaves roughly six weeks as of late July 2026.\n\nFor a company that skipped AOC-4 and MGT-7 for two years, the additional fees alone can exceed Rs 1.4 lakh at the normal rate. Under CCFS, the same backlog clears at about a tenth of that. Once the window closes on 31 August 2026, the full daily fee returns and the MCA has signalled that adjudication under Section 454 will follow for companies that stayed in default despite the scheme.",
    },
    {
      id: "02",
      heading: "WHY THE DEADLINE MOVED FROM 15 JULY TO 31 AUGUST",
      body:
        "The scheme originally closed on 15 July 2026. On 5 June 2026, a fire at the MCA data centre disrupted the MCA-21 V3 portal for several days during peak filing season, and thousands of in-progress CCFS filings stalled. In response, the MCA issued General Circular 03/2026 dated 8 July 2026 extending the scheme's closing date to 31 August 2026.\n\nTwo things follow from how this extension happened. First, it was granted for a portal outage, not out of generosity, so a second extension should not be assumed. Second, the portal has been under heavy load since it came back, so filings attempted in the last week of August risk running into queue delays with no safety net.",
    },
    {
      id: "03",
      heading: "WHICH PENDING FORMS QUALIFY FOR THE 10% RATE",
      body:
        "CCFS 2026 covers the core annual filing forms and several event-based forms that companies most commonly miss. The concession applies to the additional (late) fee only. Normal filing fees are payable in full.",
      bullets: [
        "AOC-4 and AOC-4 XBRL: financial statements for any pending financial year, at 10% of additional fees.",
        "MGT-7 and MGT-7A: annual return (MGT-7A for OPCs and small companies), at 10% of additional fees.",
        "ADT-1: auditor appointment intimation, at 10% of additional fees.",
        "FC forms: filings by foreign companies with Indian places of business, at 10% of additional fees.",
        "MSC-1: application for dormant company status, at 50% of the applicable fees.",
        "STK-2: voluntary strike-off application, at 25% of the applicable fees.",
      ],
      note:
        "The 50% MSC-1 and 25% STK-2 concessions exist because the scheme is also an exit ramp: the MCA wants defunct companies to either go dormant or strike off cleanly rather than accumulate defaults.",
    },
    {
      id: "04",
      heading: "THE MATH: 10% NOW VS FULL FEES FROM 1 SEPTEMBER",
      body:
        "Additional fees on annual forms accrue at Rs 100 per day per form with no upper cap. The table shows what a typical backlog costs inside and outside the scheme, assuming a form that is 500 days late.",
      table: {
        headers: ["Pending form", "Days late (example)", "Normal additional fee", "Under CCFS (10%)"],
        rows: [
          ["AOC-4 (one FY)", "500", "Rs 50,000", "Rs 5,000"],
          ["MGT-7 (one FY)", "500", "Rs 50,000", "Rs 5,000"],
          ["ADT-1", "500", "Rs 50,000", "Rs 5,000"],
          ["Two FYs of AOC-4 + MGT-7", "500 and 865", "Rs 2,23,000", "Rs 22,300"],
        ],
      },
      note:
        "Every extra day of delay adds Rs 100 per form to the base on which the 10% is computed, so even inside the window, filing earlier is cheaper.",
    },
    {
      id: "05",
      heading: "WHO SHOULD BE USING THIS SCHEME",
      body:
        "Three profiles account for most of the companies this scheme was designed for.",
      bullets: [
        "Companies that stopped filing but kept operating: typically 1-3 years of pending AOC-4 and MGT-7. CCFS clears the backlog at 10% and resets the compliance record before it hardens into adjudication.",
        "Defunct companies the founders walked away from: STK-2 at 25% of fees is the cheapest formal exit the MCA has offered since the 2020 fresh start scheme. An unfiled, un-struck-off company keeps generating director liability every year.",
        "Companies that paused operations but may restart: MSC-1 at 50% moves the company to dormant status, which cuts annual compliance to a single MSC-3 return instead of the full AOC-4/MGT-7 cycle.",
      ],
    },
    {
      id: "06",
      heading: "HOW TO FILE UNDER CCFS BEFORE 31 AUGUST",
      body:
        "The scheme uses the normal MCA-21 V3 forms. The concession applies automatically at fee computation while the window is open, but the practical bottleneck is preparation, not portal work.",
      bullets: [
        "List every pending form per financial year: check the company's filing history on MCA-21 under 'View Public Documents' or via the master data page.",
        "Finalise and get financial statements signed for each pending year: AOC-4 cannot be filed without audited financials adopted at an AGM (or attached with reasons if the AGM was not held).",
        "Prepare MGT-7 shareholder and director data for each pending year: the annual return needs year-specific shareholding, not current data.",
        "Check DSC and DIN status of signing directors: if DINs are deactivated for non-filing of DIR-3 KYC, fix that first or the forms will not take signatures.",
        "File oldest year first: the MCA system generally expects sequential filing of annual forms.",
        "Keep the SRN and challan for every form as proof the filing happened inside the window.",
      ],
      note:
        "Audit, AGM paperwork and director KYC reactivation each take 1-3 weeks. Starting in mid-August leaves no margin for a single bounce-back.",
    },
    {
      id: "07",
      heading: "WHAT HAPPENS IF YOU MISS 31 AUGUST 2026",
      body:
        "From 1 September 2026, the default position of the Companies Act 2013 resumes in full, and the MCA has historically followed amnesty windows with enforcement drives against companies that ignored them.",
      bullets: [
        "Full additional fees return: Rs 100 per day per form, uncapped, accruing from each form's original due date.",
        "Adjudication under Section 454: Registrars can impose statutory penalties on the company and every officer in default, over and above the late fees.",
        "Director disqualification under Section 164(2): three consecutive years of unfiled financial statements or annual returns disqualifies every director for five years, across all their companies.",
        "Strike-off under Section 248(1): the Registrar can begin striking off a company that has not filed for two consecutive years, freezing bank accounts and assets in the process.",
      ],
    },
    {
      id: "08",
      heading: "THE SECTION 164(2) DISQUALIFICATION RISK, SPELT OUT",
      body:
        "Disqualification is the consequence that catches founders off guard because it travels with the person, not the company. A director of a company that has not filed financial statements or annual returns for three consecutive financial years is disqualified under Section 164(2)(a) for five years from appointment or reappointment in any company.\n\nIn the 2017-18 drive, the MCA disqualified over 3 lakh directors in one sweep and deactivated their DINs. Directors who were on the board of one neglected shell company found themselves unable to sign filings for their active, funded companies. CCFS 2026 is the cheapest way to stop a two-year default from becoming a three-year default that triggers exactly this.",
    },
    {
      id: "09",
      heading: "WHAT CCFS DOES NOT COVER",
      body:
        "The scheme is generous but not universal, and assuming otherwise wastes preparation time.",
      bullets: [
        "It does not waive normal filing fees, only reduces the additional (late) fee component.",
        "It does not cover forms outside its list: DIR-3 KYC, DPT-3, PAS-6, charge forms (CHG-1/CHG-4) and LLP forms are outside the 10% concession.",
        "It does not undo an already-issued adjudication order or a strike-off notice that has progressed past objection stage; those need separate responses.",
        "It does not protect against prosecution for other Companies Act defaults; it settles the late-filing fee, not every violation.",
      ],
    },
    {
      id: "10",
      heading: "SIX WEEKS LEFT: A REALISTIC TIMELINE",
      body:
        "Working backwards from 31 August 2026, a company with a two-year backlog needs to start now.",
      bullets: [
        "Week of 21 July: pull the MCA filing history, list pending forms, engage the auditor for pending-year financials.",
        "By 8 August: financials signed, AGM held or convened, MGT-7 data compiled, DSCs and DINs verified active.",
        "By 20 August: all forms uploaded and fees paid, leaving buffer for resubmission if a form is marked for rework.",
        "Last week of August: buffer only. Portal load in the final days of MCA schemes routinely causes upload failures, and a failed upload on 31 August gets no concession.",
      ],
    },
  ],
  faqs: [
    {
      q: "My company has not filed AOC-4 and MGT-7 for three years. Can CCFS still help?",
      a: "Yes, and urgently. All three years of AOC-4 and MGT-7 can be filed under the scheme at 10% of additional fees. But note that at three consecutive years of default, Section 164(2) disqualification has likely already been triggered for the directors. Filing under CCFS clears the company's record and stops the default from continuing, but the disqualification question needs separate legal assessment. Check whether the directors' DINs are still active before filing anything.",
    },
    {
      q: "Is the 10% concession applied automatically or do I apply for it separately?",
      a: "It is applied at fee computation on MCA-21 while the scheme window is open. There is no separate application form for the concession on AOC-4, MGT-7, MGT-7A, ADT-1 and FC forms. You file the normal form; the system charges 10% of the additional fee. Keep the challan as proof of filing within the window.",
    },
    {
      q: "We want to shut the company down. Is STK-2 under CCFS really cheaper?",
      a: "Yes. STK-2 is charged at 25% of the applicable fees under the scheme. But strike-off has preconditions: the company must have filed overdue annual returns up to the end of the financial year in which it ceased operations, closed bank accounts, and cleared liabilities. So the usual sequence inside CCFS is: clear the pending AOC-4/MGT-7 at 10%, then file STK-2 at 25%. Both steps need to complete before 31 August 2026 to get both concessions.",
    },
    {
      q: "Will the MCA extend the scheme again beyond 31 August 2026?",
      a: "There is no indication it will. The extension from 15 July to 31 August (General Circular 03/2026, dated 8 July 2026) was granted specifically because the 5 June 2026 data-centre fire disrupted the portal. That reason no longer applies. Planning around a second extension means betting the full Rs 100/day fee schedule on a circular that may never come.",
    },
    {
      q: "Our directors' DINs are deactivated for missing DIR-3 KYC. Can we still file under CCFS?",
      a: "Not until the DINs are reactivated. Forms filed under CCFS need valid signatures from directors with active DINs and DSCs. DIR-3 KYC is not part of the CCFS concession, so reactivation is filed separately (Rs 5,000 fee per director for late KYC). Budget 3-7 working days for reactivation before the annual forms can go in, which is exactly why starting in August is risky.",
    },
    {
      q: "Does filing under CCFS protect the company from Section 454 adjudication?",
      a: "For the late-filing default it cures, effectively yes: once the pending forms are filed and fees paid, there is no continuing default to adjudicate. What CCFS does not do is immunise the company against adjudication for other violations, or unwind penalty orders already passed. Companies that ignore the scheme are the stated priority for post-scheme enforcement.",
    },
    {
      q: "We only missed ADT-1, not the annual returns. Is CCFS worth it for one form?",
      a: "Usually yes. ADT-1 additional fees accrue at Rs 100/day like the annual forms, so an ADT-1 that is 400 days late carries Rs 40,000 in additional fees, which becomes Rs 4,000 under the scheme. For a single form the filing itself is a same-week job; the saving is immediate.",
    },
    {
      q: "Does CCFS cover LLPs?",
      a: "No. CCFS 2026 is a Companies Act scheme covering companies and foreign companies. LLP filings (Form 8, Form 11) have their own fee regime and are outside this scheme. An LLP with pending filings pays the normal LLP additional fees regardless of the CCFS window.",
    },
  ],
  sources: [
    {
      name: "MCA General Circular 03/2026 (8 July 2026)",
      url: "https://www.mca.gov.in/content/mca/global/en/notifications-tender/circulars.html",
      description: "Extension of the CCFS 2026 closing date from 15 July to 31 August 2026 following the 5 June 2026 data-centre disruption.",
    },
    {
      name: "Vinod Kothari Consultants: CCFS 2026 analysis",
      url: "https://vinodkothari.com/",
      description: "Detailed practitioner analysis of scheme coverage, the 10%/50%/25% fee concessions and eligibility.",
    },
    {
      name: "Companies Act 2013, Sections 164(2), 248, 454",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Director disqualification, strike-off and adjudication provisions that apply after the scheme closes.",
    },
    {
      name: "MCA-21 V3 Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Filing portal for AOC-4, MGT-7, ADT-1, MSC-1 and STK-2 under the scheme.",
    },
  ],
};
