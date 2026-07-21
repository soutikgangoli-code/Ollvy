// =============================================================================
// GUIDE PAGE: belated-itr-2026
// File path: lib/guides/pages/belated-itr-2026.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const belatedItr2026: LearnPageConfig = {
  slug: "belated-itr-2026",
  title: "Missed the ITR Deadline? Belated Return for AY 2026-27 Explained",
  seoTitle: "Missed ITR Deadline 2026? Belated Return by 31 Dec | Ollvy",
  seoDescription:
    "Missed the ITR due date for AY 2026-27? File belated u/s 139(4) by 31 Dec 2026: Rs 5,000 late fee (Rs 1,000 under Rs 5L income), 234A interest, losses lost.",
  canonicalUrl: "https://www.ollvy.com/guides/belated-itr-2026",
  lastReviewed: "July 2026",
  category: "Income Tax Filing",
  relatedServiceSlugs: ["business-itr", "business-pan"],
  relatedLearnSlugs: [
    "itr-2026",
    "salaried-itr-2026",
    "itr-u-updated-return",
    "which-itr-form-should-i-use",
    "schedule-fa-foreign-assets-notice",
  ],
  ctaServiceSlug: "business-itr",
  tool: {
    type: "eligibility",
    title: "Can you still file your ITR for AY 2026-27?",
    questions: [
      {
        text: "Have you filed your ITR for AY 2026-27 (income of FY 2025-26)?",
        options: [
          { value: "filed_on_time", label: "Yes - filed by the due date" },
          { value: "not_filed", label: "No - not filed yet" },
          { value: "audit_case", label: "Not filed - but we are an audit case" },
          { value: "earlier_year", label: "The year I missed is AY 2025-26 or earlier" },
        ],
        exitOn: {
          filed_on_time: {
            type: "eligible",
            headline: "You are on time - and can still fix mistakes free until 31 December 2026.",
            body:
              "A revised return (Section 139(5)) completely replaces the original, carries no late fee, and can be filed any number of times until 31 December 2026. Missed bank interest, a wrong deduction, or a skipped Schedule FA foreign asset disclosure are all fixable now - an unrevised AIS mismatch is what generates 143(1) adjustment demands later.",
            ctaLabel: "Get a CA to revise it",
            ctaHref: "/checkout/business-itr",
          },
          audit_case: {
            type: "eligible",
            headline: "You are not late yet - your due date is 31 October 2026.",
            body:
              "Audit cases file by 31 October 2026, so filing now is on time, not belated. Miss that and the same belated rules apply to you: Rs 5,000 fee (Section 234F), 1% per month interest (Section 234A), and a hard cutoff of 31 December 2026.",
            ctaLabel: "File My ITR",
            ctaHref: "/checkout/business-itr",
          },
          earlier_year: {
            type: "conditional",
            headline: "Only ITR-U can fix that year now.",
            body:
              "The belated window for AY 2025-26 and earlier is closed. An updated return (Section 139(8A)) costs 25% to 70% additional tax on top of tax and interest, cannot claim a refund, cannot be a loss return, and allows one filing per year. AY 2022-23 closes permanently on 31 March 2027 at the 70% slab.",
            ctaLabel: "Check ITR-U eligibility",
            ctaHref: "/guides/itr-u-updated-return",
          },
        },
      },
      {
        text: "Was your total income for FY 2025-26 above Rs 5 lakh?",
        options: [
          { value: "above_5l", label: "Above Rs 5 lakh" },
          { value: "below_5l", label: "Rs 5 lakh or below" },
        ],
      },
      {
        text: "Do you have business (including F&O) or capital losses to carry forward?",
        options: [
          { value: "has_losses", label: "Yes - losses I want to carry forward" },
          { value: "no_losses", label: "No losses" },
        ],
      },
    ],
    resultRules: [
      {
        if: [
          { q: 1, anyOf: ["above_5l"] },
          { q: 2, anyOf: ["has_losses"] },
        ],
        result: {
          type: "mandatory",
          headline: "File belated by 31 December 2026 - your loss carry-forward is already gone.",
          body:
            "A belated return (Section 139(4)) costs Rs 5,000 (Section 234F) plus 1% per month interest on unpaid tax (Section 234A). The bigger hit: business and capital losses of FY 2025-26 lose their carry-forward when you file late - only house property loss (up to Rs 2 lakh) and unabsorbed depreciation survive. You can still set losses against FY 2025-26 income itself, so file before the cutoff makes it worse: after 31 December the only route is ITR-U at 25-70% additional tax.",
          ctaLabel: "File My Belated ITR",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [
          { q: 1, anyOf: ["above_5l"] },
          { q: 2, anyOf: ["no_losses"] },
        ],
        result: {
          type: "mandatory",
          headline: "Yes - file belated by 31 December 2026 for a flat Rs 5,000 fee.",
          body:
            "The bill: Rs 5,000 late fee (Section 234F) plus 1% per month interest on any unpaid tax (Section 234A). If TDS and advance tax already covered your liability, the fee is usually the entire cost - and a belated return can still claim your refund in full. Miss 31 December 2026 and ITR-U takes over at 25-70% additional tax, with no refunds allowed.",
          ctaLabel: "File My Belated ITR",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [
          { q: 1, anyOf: ["below_5l"] },
          { q: 2, anyOf: ["has_losses"] },
        ],
        result: {
          type: "mandatory",
          headline: "File belated by 31 December 2026 - Rs 1,000 fee, but the losses are gone.",
          body:
            "At income of Rs 5 lakh or below, the late fee is Rs 1,000 (Section 234F), plus 1% per month interest on unpaid tax (Section 234A). But a belated return cannot carry forward business or capital losses - only house property loss (up to Rs 2 lakh) and unabsorbed depreciation survive. Set-off against FY 2025-26 income still works, and any TDS refund can still be claimed until 31 December 2026.",
          ctaLabel: "File My Belated ITR",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [
          { q: 1, anyOf: ["below_5l"] },
          { q: 2, anyOf: ["no_losses"] },
        ],
        result: {
          type: "mandatory",
          headline: "Yes - file belated by 31 December 2026 for just Rs 1,000.",
          body:
            "At income of Rs 5 lakh or below, the Section 234F fee is Rs 1,000 (nil if you are below the basic exemption limit), plus 1% per month interest on any unpaid tax (Section 234A). If TDS was deducted from you, a belated return is the only way to get the refund back - ITR-U cannot claim refunds after 31 December 2026.",
          ctaLabel: "File My Belated ITR",
          ctaHref: "/checkout/business-itr",
        },
      },
    ],
    defaultResult: {
      type: "mandatory",
      headline: "Yes - but only until 31 December 2026.",
      body:
        "A belated return (Section 139(4)) costs Rs 5,000 (Rs 1,000 if income is Rs 5 lakh or below) plus 1% per month interest on unpaid tax (Section 234A). After 31 December 2026, AY 2026-27 becomes ITR-U territory: 25-70% additional tax, no refunds, no loss returns.",
      ctaLabel: "File My Belated ITR",
      ctaHref: "/checkout/business-itr",
    },
  },
  sections: [
    {
      id: "01",
      heading: "MISSED THE DUE DATE: WHAT YOU CAN STILL DO",
      body:
        "If you missed the ITR due date for AY 2026-27 (income of FY 2025-26), you can still file a belated return under Section 139(4) any time up to 31 December 2026, by paying a late fee of Rs 5,000 under Section 234F (Rs 1,000 if your total income is Rs 5 lakh or less). The return is filed the same way on the same portal; only the fee, interest and a few lost rights differ.\n\nAY 2026-27 remains governed by the Income-tax Act 1961 under the new Act's savings clause, so the familiar section numbers (139(4), 234F, 234A) still apply to this year. The key point: a belated return is a complete, legally valid return. What it costs you is money and carried-forward losses, not validity.",
    },
    {
      id: "02",
      heading: "THE THREE DATES THAT MATTER NOW",
      body:
        "Everything about a missed AY 2026-27 filing runs off three dates.",
      bullets: [
        "The original due date (passed): 31 July 2026 for non-audit taxpayers; 31 October 2026 for audit cases, which has not yet passed. If you are an audit case, you are not late yet.",
        "31 December 2026: last date for both a belated return under 139(4) and a revised return under 139(5). This is the hard cutoff for normal filing of AY 2026-27.",
        "After 31 December 2026: the only route left is ITR-U (updated return), which costs 25% to 70% additional tax on top of tax and interest, and cannot be used to claim or increase a refund.",
      ],
    },
    {
      id: "03",
      heading: "WHAT A BELATED RETURN COSTS: THE FULL BILL",
      body:
        "The late fee is the visible cost. The complete bill has four components.",
      table: {
        headers: ["Component", "Amount", "Applies when"],
        rows: [
          ["Late fee (Section 234F)", "Rs 5,000", "Total income above Rs 5 lakh"],
          ["Late fee (Section 234F)", "Rs 1,000", "Total income Rs 5 lakh or below"],
          ["Late fee (Section 234F)", "Nil", "Income below the basic exemption limit"],
          ["Interest (Section 234A)", "1% per month on unpaid tax", "From the day after the due date until filing"],
          ["Interest (Section 234B/234C)", "1% per month", "If advance tax was short-paid during FY 2025-26"],
        ],
      },
      note:
        "234A interest runs on the unpaid tax amount, so if all your tax was already covered by TDS and advance tax, the belated filing costs only the 234F fee.",
    },
    {
      id: "04",
      heading: "THE HIDDEN COST: CARRIED-FORWARD LOSSES ARE GONE",
      body:
        "For anyone with capital market or business losses, this is usually bigger than the late fee. A belated return cannot carry forward most current-year losses to future years.",
      bullets: [
        "Short-term and long-term capital losses of FY 2025-26: carry-forward lost. A Rs 4 lakh equity loss that could have offset future gains and saved roughly Rs 50,000-80,000 in tax is gone permanently.",
        "Business and professional losses: carry-forward lost, including speculative and F&O losses.",
        "House property loss: the exception; up to Rs 2 lakh can still be carried forward even in a belated return.",
        "Unabsorbed depreciation: also survives belated filing, since it is carried forward under a separate provision.",
        "Set-off within FY 2025-26 itself is unaffected: current-year losses can still be set against current-year income in the belated return.",
      ],
    },
    {
      id: "05",
      heading: "HOW TO FILE A BELATED RETURN, STEP BY STEP",
      body:
        "The mechanics are identical to a normal filing, with one dropdown difference.",
      bullets: [
        "Reconcile AIS, TIS and Form 26AS first: for a late filing, mismatches are the main scrutiny trigger, and the department already has 8-9 months of your reported data.",
        "Choose the same ITR form you would have used on time (ITR-1 to ITR-4 for most individuals and small businesses).",
        "In the filing section field, select 139(4) - belated return, not 139(1).",
        "Pay self-assessment tax including 234A/234B/234C interest and the 234F fee before submitting; the utility computes these once the filing date is after the due date.",
        "E-verify within 30 days of submission. An unverified belated return is treated as never filed, and by the time you notice, the 31 December window may be gone.",
      ],
    },
    {
      id: "06",
      heading: "ALREADY FILED ON TIME BUT MADE A MISTAKE? THAT IS A REVISED RETURN",
      body:
        "The same 31 December 2026 deadline governs revised returns under Section 139(5). If you filed by the due date but missed income, claimed a wrong deduction, or forgot Schedule FA foreign asset disclosure, you can revise any number of times until 31 December 2026 without any late fee.\n\nA belated return can itself be revised before 31 December 2026. What you cannot do is file a revised return after the 31 December cutoff; from 1 January 2027 the only correction route for AY 2026-27 is ITR-U, with its additional tax and its restrictions.",
    },
    {
      id: "07",
      heading: "WHAT HAPPENS IF YOU DO NOT FILE AT ALL",
      body:
        "Not filing is a materially worse position than filing late, because the department already knows your income profile from TDS, SFT and AIS data.",
      bullets: [
        "Non-filer campaign notices: SMS and email nudges, followed by notices under Section 142(1) requiring you to file.",
        "Best judgment assessment (Section 144): the officer assesses your income from available data, with no benefit of your deductions and expenses.",
        "Penalty exposure up to 200% of tax on under-reported income (Section 270A) in assessed cases, versus the flat Rs 5,000 fee if you file belatedly on your own.",
        "Prosecution for wilful failure to file (Section 276CC) in cases with tax due above Rs 25,000, carrying imprisonment of 6 months to 7 years; rarely invoked for small taxpayers but on the books.",
        "Refund lost: if you had excess TDS, not filing means the refund is simply never claimed; a belated return still gets you the refund.",
      ],
    },
    {
      id: "08",
      heading: "BELATED RETURN VS ITR-U: WHY 31 DECEMBER IS THE REAL DEADLINE",
      body:
        "People sometimes relax because 'ITR-U exists anyway'. The comparison shows why that logic is expensive.",
      table: {
        headers: ["", "Belated return (by 31 Dec 2026)", "ITR-U (from 1 Jan 2027)"],
        rows: [
          ["Extra cost", "Rs 5,000 fee + interest", "25%-70% additional tax on tax + interest, plus the fee"],
          ["Refund claim", "Allowed", "Not allowed; cannot increase a refund"],
          ["Loss return", "Allowed (carry-forward mostly lost)", "Not allowed if it is a return of loss"],
          ["Revision later", "Can revise until 31 Dec 2026", "One ITR-U per assessment year, no revision"],
          ["Nil-tax return", "Allowed", "Effectively unavailable if no additional tax arises"],
        ],
      },
      note:
        "If TDS was deducted from you and you are owed a refund, 31 December 2026 is your only chance to get it. ITR-U cannot recover it.",
    },
    {
      id: "09",
      heading: "SPECIAL SITUATIONS WORTH KNOWING",
      body: "",
      bullets: [
        "Audit cases: the 31 October 2026 due date has not passed, so companies and audit-liable firms filing now are on time, not belated. Their belated window also ends 31 December 2026.",
        "Foreign assets: if you hold foreign stocks, ESOPs or accounts and skipped Schedule FA, file or revise before 31 December 2026. Non-disclosure carries a Rs 10 lakh Black Money Act penalty, separate from anything in this guide.",
        "New regime vs old regime: a belated individual return cannot opt into the old regime; late filers with business income are locked to the default new regime for the year, which can itself cost real money in lost deductions.",
        "Multiple missed years: only AY 2026-27 can be filed as belated now. Earlier years (AY 2023-24 to AY 2025-26) are ITR-U territory with escalating additional tax.",
      ],
    },
  ],
  faqs: [
    {
      q: "I missed 31 July 2026. How much do I actually pay to file now?",
      a: "Three things: the Section 234F fee (Rs 5,000 if total income exceeds Rs 5 lakh, Rs 1,000 if not, nil if below the exemption limit), Section 234A interest at 1% per month on any unpaid tax counted from 1 August 2026 to your filing date, and any 234B/234C advance tax interest that would have applied anyway. If your entire tax was covered by TDS, the fee is usually the whole cost.",
    },
    {
      q: "Will filing belated increase my chances of scrutiny?",
      a: "Belated filing by itself is not a published scrutiny criterion. What does raise risk is mismatch between your return and AIS/26AS data, which late filers hit more often because they rush. Reconcile AIS and 26AS line by line before submitting; a clean belated return is far safer than a rushed one filed to beat the fee.",
    },
    {
      q: "I have F&O losses for FY 2025-26. Is there any way to preserve them after missing the due date?",
      a: "No. Business losses including F&O losses require a return filed by the original due date to be carried forward. Filing belatedly, you can still set the loss against other eligible income of FY 2025-26 itself, but the unabsorbed portion lapses. Only house property loss (up to Rs 2 lakh) and unabsorbed depreciation survive a belated filing.",
    },
    {
      q: "I am due a refund of Rs 40,000 from excess TDS. Can I still get it filing late?",
      a: "Yes, in full. A belated return under 139(4) can claim a refund, and the refund is not reduced by the late fee (the fee is collected via the return computation). But this only works until 31 December 2026. After that, ITR-U cannot be used to claim a refund, so an unclaimed refund is effectively forfeited.",
    },
    {
      q: "Can I switch to the old tax regime in my belated return?",
      a: "If you are a salaried individual with no business income, the regime choice is made in the return itself, but the option to opt out of the default new regime is tied to filing by the Section 139(1) due date. In a belated return you are locked into the new regime. If old-regime deductions (80C, home loan interest) were your plan, that plan died with the due date; compute your tax accordingly before you self-assess.",
    },
    {
      q: "My employer deducted TDS all year. Do I even need to file?",
      a: "Yes, if your income exceeds the basic exemption limit; TDS is a payment mechanism, not a substitute for a return. Non-filing keeps you exposed to non-filer notices and, if income escaped, assessment under Section 144. And if TDS exceeded your actual liability, filing is the only way to get the excess back.",
    },
    {
      q: "What if I miss 31 December 2026 too?",
      a: "Then AY 2026-27 can only be filed as an updated return (ITR-U) from the point the window opens for that year, with additional tax starting at 25% of the aggregate tax and interest, rising to 70% at the far end of the 48-month window. No refunds, no loss returns, one shot per year. The dedicated ITR-U guide covers the mechanics.",
    },
    {
      q: "I filed on time but forgot to report bank interest of Rs 60,000. Belated or revised?",
      a: "Revised. Since you filed by the due date, correct it with a revised return under 139(5) before 31 December 2026: no late fee, just any incremental tax and interest. Do it proactively; interest income is in your AIS, and an unrevised mismatch is exactly what generates 143(1) adjustment demands.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 1961, Sections 139(4), 139(5), 234A, 234F",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Belated and revised return provisions, late-filing interest and fee (governing AY 2026-27).",
    },
    {
      name: "Income Tax e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Filing utility, AIS/26AS download and e-verification for belated returns.",
    },
    {
      name: "Income Tax Act 1961, Section 139(8A) read with Section 140B",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Updated return route and additional tax that applies after the 31 December cutoff.",
    },
  ],
};
