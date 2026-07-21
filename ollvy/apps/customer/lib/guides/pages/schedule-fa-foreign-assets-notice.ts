// =============================================================================
// GUIDE PAGE: schedule-fa-foreign-assets-notice
// File path: lib/guides/pages/schedule-fa-foreign-assets-notice.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const scheduleFaForeignAssetsNotice: LearnPageConfig = {
  slug: "schedule-fa-foreign-assets-notice",
  title: "Got a Foreign Assets SMS from the Income Tax Department? Schedule FA, Explained",
  seoTitle: "Schedule FA Notice 2026: Fix by 31 Dec or Rs 10L Penalty | Ollvy",
  seoDescription:
    "The IT department NUDGE SMS on foreign assets uses CRS/FATCA data already in your AIS. Revise with Schedule FA by 31 Dec 2026 or face the Rs 10 lakh penalty.",
  canonicalUrl: "https://www.ollvy.com/guides/schedule-fa-foreign-assets-notice",
  lastReviewed: "July 2026",
  category: "Income Tax Notice",
  severity: "serious",
  deadline: "31 December 2026 (revised return window)",
  deadlineNote:
    "The campaign is timed against the revised-return cutoff for AY 2026-27. After 31 December 2026, the cheap fix (a revised return adding Schedule FA) is gone and the Black Money Act exposure hardens.",
  relatedServiceSlugs: ["business-itr", "business-pan"],
  relatedLearnSlugs: [
    "belated-itr-2026",
    "itr-u-updated-return",
    "income-tax-ais-sft-notice",
    "salaried-itr-2026",
    "income-tax-148-148a-reopening",
  ],
  ctaServiceSlug: "business-itr",
  tool: {
    type: "eligibility",
    title: "Do you need to report foreign assets in Schedule FA?",
    questions: [
      {
        text: "Do you hold foreign stocks, RSUs or ESOPs in an overseas brokerage (Schwab, Fidelity, E*TRADE, Morgan Stanley)?",
        options: [
          { value: "yes_stocks", label: "Yes - vested RSUs, ESOPs, or foreign shares" },
          { value: "no_stocks", label: "No foreign stocks" },
        ],
      },
      {
        text: "Any foreign bank account, pension (401(k), UK workplace), insurance policy, or other foreign asset - even dormant?",
        options: [
          { value: "yes_other", label: "Yes - at least one" },
          { value: "no_other", label: "No other foreign assets" },
        ],
      },
      {
        text: "Did your AY 2026-27 return disclose all of them in Schedule FA?",
        options: [
          { value: "reported", label: "Yes - all of them" },
          { value: "not_reported", label: "No, or only partly" },
          { value: "not_filed", label: "I have not filed yet" },
        ],
      },
    ],
    resultRules: [
      {
        if: [
          { q: 0, anyOf: ["no_stocks"] },
          { q: 1, anyOf: ["no_other"] },
        ],
        result: {
          type: "not_required",
          headline: "Schedule FA does not apply to you.",
          body:
            "The schedule covers residents who are ordinarily resident (ROR) and held any foreign asset at any time during the calendar year. With no foreign holdings, there is nothing to disclose. One check if you recently returned from abroad: the year your status flips from RNOR to ROR, every foreign account and holding becomes disclosable - and CRS data on those accounts is already flowing to India.",
        },
      },
      {
        if: [{ q: 2, anyOf: ["not_reported"] }],
        result: {
          type: "mandatory",
          headline: "Revise with a complete Schedule FA before 31 December 2026.",
          body:
            "Non-disclosure of a foreign asset carries a Rs 10 lakh penalty per year (Section 43, Black Money Act) - even where the income was fully taxed, and with no minimum threshold for brokerage holdings. A revised return (Section 139(5)) filed by 31 December 2026 completely replaces the original and costs nothing beyond tax on any missed foreign income. Your CRS/FATCA data is already in your AIS, and a third NUDGE wave is expected in November-December 2026.",
          ctaLabel: "Get a CA to revise with Schedule FA",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [{ q: 2, anyOf: ["not_filed"] }],
        result: {
          type: "mandatory",
          headline: "File with a full Schedule FA - the window ends 31 December 2026.",
          body:
            "A belated return (Section 139(4)) with a complete Schedule FA costs Rs 5,000 (Rs 1,000 if income is Rs 5 lakh or below) plus interest - trivial against the Rs 10 lakh per-year penalty (Section 43, Black Money Act) for non-disclosure. Every account counts: a $50 brokerage balance is disclosed the same as $500,000, and the custodial account itself needs its own row. Report the dividends too, with US withholding claimed as treaty credit via Form 67.",
          ctaLabel: "File with Schedule FA",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [{ q: 2, anyOf: ["reported"] }],
        result: {
          type: "eligible",
          headline: "You are covered - verify against your AIS once.",
          body:
            "Match every CRS/FATCA entry in your AIS to a Schedule FA row: the campaign flags specific reported accounts, and duplicated or stale institution reporting causes false positives. If a NUDGE SMS still arrives, respond on the compliance portal that the information is covered in your return, and keep screenshots. Closed accounts often keep reporting for a year or more - keep closure confirmations permanently.",
          ctaLabel: "Decode your AIS entries",
          ctaHref: "/guides/income-tax-ais-sft-notice",
        },
      },
    ],
    defaultResult: {
      type: "conditional",
      headline: "If you held any foreign asset in 2025, Schedule FA applies.",
      body:
        "Disclosure is required regardless of value and regardless of whether the asset produced income - vested RSUs never sold, dormant accounts, and employer-opened brokerage accounts all count. The cheap fix is a revised return by 31 December 2026; the alternative is Rs 10 lakh per year (Section 43, Black Money Act).",
      ctaLabel: "Get a CA to check your return",
      ctaHref: "/checkout/business-itr",
    },
  },
  sections: [
    {
      id: "01",
      heading: "WHAT THIS SMS OR EMAIL ACTUALLY MEANS",
      body:
        "If you received an SMS or email from the income tax department about foreign assets or income not reflected in your return, it means foreign financial institutions have reported accounts or securities linked to you under automatic exchange of information (CRS and FATCA), and that data does not match your ITR's Schedule FA. This is the department's NUDGE campaign (Non-intrusive Use of Data to Guide and Enable): not yet a statutory notice, but a data-matched warning with your PAN already flagged.\n\nThe fix, in most cases, is straightforward and cheap relative to the risk: revise your return with a complete Schedule FA before 31 December 2026. The consequence of ignoring it is not: non-disclosure of a foreign asset carries a Rs 10 lakh penalty per year under Section 43 of the Black Money Act, plus prosecution exposure, even where no tax was actually evaded.",
    },
    {
      id: "02",
      heading: "WHY YOU GOT IT: THE DATA THE DEPARTMENT ALREADY HAS",
      body:
        "Under CRS (100+ countries) and FATCA (the US), foreign banks and brokers report Indian tax residents' accounts annually: balances, interest, dividends, sale proceeds. This feed now lands directly in your AIS. The campaign has run in waves: the first on 17 November 2024, the second on 28 November 2025, and a third wave is expected in November-December 2026, again timed so recipients can still revise before the 31 December cutoff.",
      bullets: [
        "US brokerage accounts holding vested RSUs or ESOP shares (Schwab, Fidelity, E*TRADE, Morgan Stanley accounts opened by your employer's stock plan).",
        "Foreign bank accounts kept open after returning from an overseas stint, even dormant ones with small balances.",
        "Foreign pension and retirement accounts (401(k), UK workplace pensions) from prior employment abroad.",
        "Interests in foreign entities: shareholding in an overseas startup, LLC membership, trust beneficiary positions.",
        "Overseas life insurance or investment-linked policies.",
      ],
      note:
        "The two most common recipients by far: tech employees with US-listed RSUs, and NRI-returnees who became resident again but never closed foreign accounts.",
    },
    {
      id: "03",
      heading: "WHO ACTUALLY HAS TO FILE SCHEDULE FA",
      body:
        "Schedule FA applies to every person who is a resident and ordinarily resident (ROR) in India and held any foreign asset at any time during the calendar year, regardless of value and regardless of whether it produced income.",
      bullets: [
        "Residency is the gate: non-residents and RNOR individuals do not fill Schedule FA. Returnees often misjudge the year their status flips to ROR.",
        "There is no minimum threshold: a US brokerage account worth $50 must be disclosed just like one worth $500,000.",
        "Vested RSUs held in a foreign brokerage count, even if you never sold and never repatriated anything.",
        "Unvested RSUs are generally not 'held' assets yet; vesting is the trigger point for disclosure.",
        "Disclosure is required even where the income was already taxed: salary-taxed RSU perquisites still need the underlying shares disclosed as assets.",
        "Schedule FA runs on the calendar year (January-December) for most reporting, not the financial year, a detail that trips up self-filers.",
      ],
    },
    {
      id: "04",
      heading: "THE PENALTY MATH: WHY A DISCLOSURE MISS IS TREATED SO SEVERELY",
      body:
        "Foreign asset non-disclosure is not punished under the normal Income-tax Act penalty ladder. It sits under the Black Money (Undisclosed Foreign Income and Assets) and Imposition of Tax Act 2015, which was written to be frightening.",
      bullets: [
        "Section 43: Rs 10 lakh penalty for failure to disclose a foreign asset in the return, per year of failure, even if the asset was built from fully taxed income. (A carve-out exists for foreign bank accounts with aggregate balances up to Rs 20 lakh.)",
        "Sections 49/50: prosecution for wilful failure to disclose, with imprisonment of 6 months to 7 years in addition to fines.",
        "If undisclosed foreign income or assets are assessed under the Act: tax at 30% flat with no deductions, plus penalty at 300% of the tax.",
        "No time-bar comfort: reassessment reach for foreign-asset cases under the Income-tax Act extends far longer than domestic cases.",
      ],
      note:
        "The Rs 10 lakh penalty attaches to the disclosure failure itself. 'I already paid tax on that income' is not a defence to a Schedule FA omission; it is only a mitigating fact.",
    },
    {
      id: "05",
      heading: "THE FIX: REVISE WITH SCHEDULE FA BEFORE 31 DECEMBER 2026",
      body:
        "For AY 2026-27 (FY 2025-26), a revised return under Section 139(5) filed by 31 December 2026 completely replaces the original. Adding a full Schedule FA in a revised return, voluntarily and before any formal notice, is the strongest position available and costs nothing beyond any incremental tax on missed foreign income.",
      bullets: [
        "Pull statements for every foreign account and holding for calendar year 2025: brokerage statements, bank statements, pension statements.",
        "Reconcile with your AIS: the campaign matches specific reported accounts; make sure each one appears in your Schedule FA.",
        "Convert values using the prescribed SBI telegraphic transfer buying rate conventions the schedule requires (peak balance and closing balance both matter for accounts).",
        "Report the income too: dividends and interest go in the income schedules with foreign tax credit claimed via Form 67 where treaty credit applies.",
        "File the revised return, selecting Section 139(5), and e-verify within 30 days.",
        "If earlier years also had omissions, assess those separately: AY 2025-26 and earlier are ITR-U territory with additional tax, and Black Money Act exposure for old years needs professional judgment before self-correcting.",
      ],
    },
    {
      id: "06",
      heading: "IF YOU GOT THE SMS BUT HAVE NOTHING UNDISCLOSED",
      body:
        "A meaningful share of campaign recipients are false positives: duplicated institution reporting, closed accounts still being reported, or accounts belonging to a period when you were non-resident. Do not ignore the message even then.",
      bullets: [
        "Check AIS for the foreign-asset entries and match them to your actual holdings and your filed Schedule FA.",
        "If your return already discloses everything: submit feedback on the compliance portal confirming the information is covered in your return. Keep screenshots.",
        "If the reported account existed in a year you were RNOR or non-resident: document your residency computation (day counts, passport stamps) and respond accordingly.",
        "If the entry is simply wrong (not your account, duplicate): dispute it via AIS feedback rather than letting it sit unmatched.",
      ],
    },
    {
      id: "07",
      heading: "WHAT HAPPENS IF YOU IGNORE THE NUDGE",
      body:
        "The campaign is explicitly the soft step in an escalation ladder, and the department has said verification follows for non-responders.",
      bullets: [
        "Formal notices: questionnaire-style verification, then reassessment under the reopening framework for the relevant years.",
        "Black Money Act assessment: 30% flat tax, 300% penalty, Section 43's Rs 10 lakh per-year penalty, and prosecution sanction in wilful cases.",
        "Timing lock-out: after 31 December 2026 you cannot revise AY 2026-27; ITR-U can add missed foreign income but is barred once proceedings start, and disclosure-only fixes get harder to make cleanly.",
        "Each further year of silence is a fresh non-disclosure with its own penalty exposure.",
      ],
    },
    {
      id: "08",
      heading: "RSU AND ESOP HOLDERS: THE SPECIFIC TRAPS",
      body:
        "US-stock employees are the campaign's largest cohort, and their mistakes are consistent.",
      bullets: [
        "Disclosing only sold shares: Schedule FA requires holdings, not just transactions. Vested-and-held RSUs must appear every year they are held.",
        "Missing the brokerage account itself: the custodial account is a foreign 'account' requiring disclosure separately from the shares in several table rows of the schedule.",
        "Ignoring dividends: US-stock dividends (even $30 auto-reinvested) are taxable in India for ROR holders, with 25% US withholding claimable as treaty credit via Form 67.",
        "Wrong valuation date: the schedule wants initial value, peak value and closing value conventions; closing-only reporting is a common defect.",
        "Assuming the employer handles it: the employer taxes the vesting perquisite through TDS, but Schedule FA disclosure is entirely the employee's job.",
      ],
    },
    {
      id: "09",
      heading: "TIMELINE TO WORK BACKWARDS FROM",
      body: "",
      bullets: [
        "Now to October 2026: gather foreign statements, reconcile AIS, decide whether a revised return is needed. Statement retrieval from foreign institutions can take weeks.",
        "November-December 2026: expected third NUDGE wave. Filing your revision before the wave lands is strictly better than after.",
        "31 December 2026: revised and belated return window for AY 2026-27 closes. The cheap fix expires.",
        "After 31 December 2026: corrections shift to ITR-U (with additional tax, and only where additional tax arises) and the exposure conversation changes character.",
      ],
    },
  ],
  faqs: [
    {
      q: "I got the SMS but I only hold vested RSUs I have never sold. Is that really a problem?",
      a: "Holding is the trigger, not selling. Vested RSUs sitting in a US brokerage are foreign assets requiring Schedule FA disclosure every year you hold them, along with the brokerage account itself. If your filed return skipped Schedule FA, revise before 31 December 2026. The vesting perquisite your employer taxed covers the income side, not the asset-disclosure side.",
    },
    {
      q: "My foreign account has a balance under Rs 20 lakh. Am I safe from the Rs 10 lakh penalty?",
      a: "Partly. The Section 43 penalty carve-out covers foreign bank accounts with aggregate balances up to Rs 20 lakh during the year. It does not cover brokerage accounts, shares, or other foreign assets. And the carve-out only softens the penalty; the disclosure obligation in Schedule FA still applies, and prosecution provisions are not threshold-linked. Disclose regardless.",
    },
    {
      q: "I returned to India in 2024 and am RNOR. Do I need Schedule FA?",
      a: "Not while you are RNOR: Schedule FA applies to residents who are ordinarily resident. But run the RNOR computation carefully, since it depends on your day-count history over the prior 7-10 years, and status typically flips to ROR within 2-3 years of return. The year you become ROR, every foreign account, pension and holding becomes disclosable, and CRS reporting on those accounts is already flowing to India.",
    },
    {
      q: "The income from my foreign account was already taxed abroad. Do I still disclose and pay in India?",
      a: "Yes on both counts if you are ROR. India taxes residents on worldwide income; foreign tax paid becomes a credit under the relevant treaty, claimed by filing Form 67 before your return. And disclosure in Schedule FA is independent of tax: even a zero-income foreign asset must be reported. Tax paid abroad is a credit, not an exemption from Indian filing.",
    },
    {
      q: "Can I just respond on the compliance portal instead of revising my return?",
      a: "Only if your return is actually complete. The portal response ('information is covered in the return') works when Schedule FA already discloses the flagged accounts. If the disclosure is missing or partial, a portal response does not cure the omission; the revised return does. The right sequence is: fix the return, then respond on the portal pointing to the revision.",
    },
    {
      q: "What about AY 2024-25 and AY 2025-26 where I also skipped Schedule FA?",
      a: "Those years can no longer be revised. ITR-U can add missed foreign income for them (with 25%-60% additional tax depending on the year), but ITR-U requires additional tax to be payable, so a pure disclosure omission with no missed income does not fit neatly. For multi-year foreign-asset omissions, get professional advice before self-correcting; sequencing matters because each filing is also an admission about the earlier years.",
    },
    {
      q: "Is the NUDGE SMS a notice under the Income-tax Act? Does it have a legal deadline?",
      a: "No, it is a pre-notice communication with no statutory deadline of its own. The operative deadline is the one it points at: 31 December 2026, when the revised-return window for AY 2026-27 closes. The prior waves (17 November 2024 and 28 November 2025) were followed by verification of non-responders, so treat the absence of a legal deadline as timing information, not as permission to ignore it.",
    },
    {
      q: "I closed my foreign account in 2023 but it still shows in the campaign data. What do I do?",
      a: "If the account existed at any time during a year you were ROR, it needed disclosure for that year, closed or not. For the current year, if it was closed before the relevant period, respond via AIS feedback with the closure statement as evidence. Keep the closure confirmation permanently; CRS data often lags account closures by a year or more.",
    },
  ],
  sources: [
    {
      name: "Income Tax Department: NUDGE campaign on foreign assets",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Official campaign communications and compliance portal for responding to foreign-asset mismatches.",
    },
    {
      name: "Black Money (Undisclosed Foreign Income and Assets) Act 2015, Sections 43, 49, 50",
      url: "https://incometaxindia.gov.in/pages/acts/black-money-act.aspx",
      description: "Penalty for non-disclosure of foreign assets and prosecution provisions.",
    },
    {
      name: "TaxGuru: analysis of the foreign-assets NUDGE campaign",
      url: "https://taxguru.in/",
      description: "Practitioner coverage of the 2024 and 2025 campaign waves and CRS/FATCA data matching.",
    },
  ],
};
