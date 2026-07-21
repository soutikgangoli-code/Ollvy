// =============================================================================
// GUIDE PAGE: itr-u-updated-return
// File path: lib/guides/pages/itr-u-updated-return.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const itrUUpdatedReturn: LearnPageConfig = {
  slug: "itr-u-updated-return",
  title: "ITR-U Updated Return: The 48-Month Window and What It Costs",
  seoTitle: "ITR-U Updated Return 2026: 48-Month Window, 25-70% Tax | Ollvy",
  seoDescription:
    "ITR-U lets you file or fix a return up to 48 months late at 25-70% additional tax. AY 2022-23 window closes 31 March 2027. Who can file, who cannot, the math.",
  canonicalUrl: "https://www.ollvy.com/guides/itr-u-updated-return",
  lastReviewed: "July 2026",
  category: "Income Tax Filing",
  relatedServiceSlugs: ["business-itr", "business-pan"],
  relatedLearnSlugs: [
    "belated-itr-2026",
    "itr-2026",
    "income-tax-ais-sft-notice",
    "income-tax-148-148a-reopening",
    "schedule-fa-foreign-assets-notice",
    "income-tax-act-2025-section-mapping",
  ],
  ctaServiceSlug: "business-itr",
  tool: {
    type: "eligibility",
    title: "Are you eligible to file ITR-U?",
    questions: [
      {
        text: "Which assessment year do you want to file or fix?",
        options: [
          { value: "ay_2022_23", label: "AY 2022-23 (FY 2021-22)" },
          { value: "ay_2023_24", label: "AY 2023-24 (FY 2022-23)" },
          { value: "ay_2024_25", label: "AY 2024-25 (FY 2023-24)" },
          { value: "ay_2025_26", label: "AY 2025-26 (FY 2024-25)" },
        ],
      },
      {
        text: "Would the update reduce your tax or claim/increase a refund?",
        options: [
          { value: "reduces_tax", label: "Yes - I would owe less or get money back" },
          { value: "more_tax", label: "No - I would owe more tax" },
        ],
        exitOn: {
          reduces_tax: {
            type: "ineligible",
            headline: "Not eligible - ITR-U cannot cut your tax bill.",
            body:
              "An updated return (Section 139(8A)) cannot claim a refund, increase a refund, or reduce your liability - refunds died with the 31 December belated deadline for that year. If the AIS entry driving this is wrong (duplicated broker reporting is common), dispute it via AIS feedback on the compliance portal instead of filing.",
            ctaLabel: "Talk to a CA about the year",
            ctaHref: "/checkout/business-itr",
          },
        },
      },
      {
        text: "Would the updated return still show a loss?",
        options: [
          { value: "still_loss", label: "Yes - it stays a loss return" },
          { value: "not_loss", label: "No - positive income with tax payable" },
        ],
        exitOn: {
          still_loss: {
            type: "ineligible",
            headline: "Not eligible - an ITR-U cannot be a return of loss.",
            body:
              "Reducing a loss, or converting it into positive income with additional tax payable, is allowed. A return that remains a loss return is barred. Watch the knock-on effect: if a carried-forward loss shrinks, later years that used that loss may need their own updates, each with its own additional tax.",
            ctaLabel: "Get a CA to run the numbers",
            ctaHref: "/checkout/business-itr",
          },
        },
      },
      {
        text: "Any search (Section 132), survey (Section 133A), or pending assessment for that year?",
        options: [
          { value: "action_ongoing", label: "Yes - search, survey, or proceedings pending" },
          { value: "no_action", label: "No enforcement action" },
        ],
        exitOn: {
          action_ongoing: {
            type: "ineligible",
            headline: "Not eligible - enforcement action closes the ITR-U window instantly.",
            body:
              "Once a search under Section 132, survey under Section 133A, or assessment/reassessment proceedings are underway for a year, ITR-U is barred for it and the assessment framework takes over. ITR-U is strictly a pre-enforcement window - which is why filing before the department acts is the whole game.",
            ctaLabel: "Get help responding",
            ctaHref: "/checkout/business-itr",
          },
        },
      },
    ],
    resultRules: [
      {
        if: [{ q: 0, anyOf: ["ay_2022_23"] }],
        result: {
          type: "eligible",
          headline: "Eligible - at the 70% slab, and the window closes 31 March 2027.",
          body:
            "AY 2022-23 is in the final 37-48 month band, so the additional tax (Section 140B) is 70% of the aggregate tax and interest, paid in full before filing. After 31 March 2027 this year closes permanently, leaving only the risk side: a Section 148 reopening with 50-200% under-reporting penalties (Section 270A). One filing per year - get it right the first time.",
          ctaLabel: "File ITR-U with a CA",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [{ q: 0, anyOf: ["ay_2023_24"] }],
        result: {
          type: "eligible",
          headline: "Eligible - at the 60% slab until 31 March 2027.",
          body:
            "AY 2023-24 sits in the 25-36 month band: additional tax (Section 140B) is 60% of tax plus interest, paid before filing. Cross 31 March 2027 and the same income costs 70%. Example from this band: Rs 1,50,000 of tax and interest carries Rs 90,000 additional tax now - versus up to 200% penalty (Section 270A) if the department reopens the year first.",
          ctaLabel: "File ITR-U with a CA",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [{ q: 0, anyOf: ["ay_2024_25"] }],
        result: {
          type: "eligible",
          headline: "Eligible - at the 50% slab until 31 March 2027.",
          body:
            "AY 2024-25 is in the 13-24 month band: additional tax (Section 140B) is 50% of the aggregate tax and interest, paid in full before filing. Waiting past 31 March 2027 moves it to the 60% slab - a slab boundary is the most expensive deadline to miss. E-verify within 30 days; an unverified ITR-U is treated as never filed.",
          ctaLabel: "File ITR-U with a CA",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [{ q: 0, anyOf: ["ay_2025_26"] }],
        result: {
          type: "eligible",
          headline: "Eligible - at the cheapest slab, 25%, until 31 March 2027.",
          body:
            "AY 2025-26 is inside the first 12-month band: additional tax (Section 140B) is 25% of tax plus interest. That doubles to 50% on 1 April 2027, so this is the cheapest this correction will ever be. Pay the full amount as self-assessment tax first - ITR-U cannot be filed with unpaid balances - and e-verify within 30 days.",
          ctaLabel: "File ITR-U with a CA",
          ctaHref: "/checkout/business-itr",
        },
      },
    ],
    defaultResult: {
      type: "eligible",
      headline: "Likely eligible - ITR-U works whenever the update produces additional tax.",
      body:
        "The gate is simple: additional tax must become payable, whether or not you filed originally. The cost is 25% to 70% of tax plus interest depending on how late you file (Section 140B), with each assessment year allowed exactly one updated return.",
      ctaLabel: "File ITR-U with a CA",
      ctaHref: "/checkout/business-itr",
    },
  },
  sections: [
    {
      id: "01",
      heading: "WHAT ITR-U IS AND WHEN YOU NEED IT",
      body:
        "ITR-U is the updated return under Section 139(8A) of the Income-tax Act 1961 (Section 263(6) in the new 2025 Act): it lets you file a missed return or add missed income for a past year up to 48 months after the end of the assessment year, in exchange for additional tax of 25% to 70% on top of the normal tax and interest. It exists for exactly one situation: the normal belated/revised window (31 December after the assessment year) has closed, and you want to come clean before the department comes to you.\n\nThe timing pressure right now: the AY 2022-23 window closes on 31 March 2027, and the department's e-campaign SMS and emails to non-filers and under-reporters are specifically designed to push people into ITR-U before reopening notices go out.",
    },
    {
      id: "02",
      heading: "THE COST SLABS: 25%, 50%, 60%, 70%",
      body:
        "The additional tax under Section 140B is computed on the aggregate of tax and interest payable, and it steps up the longer you wait. The clock runs from the end of the relevant assessment year.",
      table: {
        headers: ["Filed within", "Additional tax", "For AY 2025-26 that means"],
        rows: [
          ["12 months of AY end", "25% of tax + interest", "By 31 March 2027"],
          ["13-24 months", "50% of tax + interest", "By 31 March 2028"],
          ["25-36 months", "60% of tax + interest", "By 31 March 2029"],
          ["37-48 months", "70% of tax + interest", "By 31 March 2030"],
        ],
      },
      note:
        "The 60% and 70% slabs were added by the Finance Act 2025 when the window stretched from 24 to 48 months. Waiting one slab boundary can double the surcharge on the same underlying income.",
    },
    {
      id: "03",
      heading: "WHICH YEARS ARE OPEN RIGHT NOW",
      body:
        "As of July 2026, four assessment years are inside the ITR-U window, each at a different price.",
      table: {
        headers: ["Assessment year", "Window closes", "Current additional tax slab"],
        rows: [
          ["AY 2022-23 (FY 2021-22)", "31 March 2027", "70%"],
          ["AY 2023-24 (FY 2022-23)", "31 March 2028", "60%"],
          ["AY 2024-25 (FY 2023-24)", "31 March 2029", "50%"],
          ["AY 2025-26 (FY 2024-25)", "31 March 2030", "25% (until 31 March 2027)"],
        ],
      },
      note:
        "AY 2026-27 is not ITR-U territory yet: its normal belated/revised window runs until 31 December 2026. Use that first; it is dramatically cheaper.",
    },
    {
      id: "04",
      heading: "WHO CAN FILE AN ITR-U",
      body:
        "The gate is simple: the updated return must result in additional tax being paid. You can file whether or not you filed the original return.",
      bullets: [
        "You never filed for that year and had taxable income: eligible, and this is the most common case driven by e-campaign SMS.",
        "You filed but missed income (bank interest, capital gains, freelance receipts, crypto): eligible for the incremental income.",
        "You claimed a deduction or head of income wrongly and owe more tax as a result: eligible.",
        "You want to correct the rate or head under which income was taxed, resulting in higher tax: eligible.",
      ],
    },
    {
      id: "05",
      heading: "WHO CANNOT FILE: THE HARD EXCLUSIONS",
      body:
        "ITR-U is a one-way street toward paying more tax. The exclusions all follow from that design.",
      bullets: [
        "No loss returns: an ITR-U cannot be a return of loss. (If your original return had a loss and the update converts it to income, that is allowed.)",
        "No refunds: it cannot claim a refund, increase a refund, or reduce your tax liability compared to the earlier return.",
        "No nil-change filings: if no additional tax becomes payable, there is nothing to update; the return is invalid.",
        "Not during or after search/survey action: if a search under Section 132, requisition under 132A, or survey under 133A has been initiated against you, ITR-U is barred for the relevant years.",
        "Not where assessment, reassessment or prosecution is pending or completed for that year, or where the department has already communicated information against you under specified laws.",
        "One shot per assessment year: an ITR-U cannot be revised or filed twice for the same year. Get it right the first time.",
      ],
    },
    {
      id: "06",
      heading: "THE MATH ON A REAL EXAMPLE",
      body:
        "Say you missed reporting Rs 6 lakh of freelance income for AY 2023-24 and the tax plus 234A/234B/234C interest on it works out to Rs 1,50,000.",
      bullets: [
        "Tax + interest payable: Rs 1,50,000.",
        "Additional tax at the current 60% slab for AY 2023-24: Rs 90,000.",
        "Total outflow via ITR-U: Rs 2,40,000, paid before filing (the return requires proof of payment).",
        "The alternative if the department reopens the year instead: the same Rs 1,50,000 plus penalty under Section 270A at 50% of tax for under-reporting, or 200% if treated as misreporting, plus the reopening process itself.",
      ],
      note:
        "ITR-U at 60% is expensive; an under-reporting assessment at up to 200% penalty with prosecution exposure is worse. That comparison, not the sticker price, is the real decision.",
    },
    {
      id: "07",
      heading: "HOW TO FILE, STEP BY STEP",
      body: "",
      bullets: [
        "Pull AIS, TIS and Form 26AS for the target year and identify exactly what income is missing; the e-campaign notice (if you got one) lists the transactions the department is looking at.",
        "Compute tax, interest (234A/234B/234C) and late fee (234F if the original return was never filed) for that year using the applicable slabs of that year.",
        "Compute the Section 140B additional tax at the slab your filing date falls in.",
        "Pay the full amount as self-assessment tax and keep the challan; ITR-U cannot be filed with unpaid balances.",
        "File the applicable year's ITR form along with Form ITR-U on the e-filing portal, selecting the reason for updating (return not filed earlier, income not reported correctly, etc.).",
        "E-verify within 30 days. An unverified ITR-U is treated as never filed, and you cannot file it again casually since the one-shot rule applies to a valid filing.",
      ],
    },
    {
      id: "08",
      heading: "THE E-CAMPAIGN SMS: WHY PEOPLE ARE FILING ITR-U IN 2026",
      body:
        "Most ITR-U filings are not spontaneous. The department's e-verification and NUDGE campaigns match SFT data (property purchases, large deposits, mutual fund and share transactions, foreign remittances) and AIS entries against filed returns, then send SMS and emails inviting you to 'review' the mismatch and file an updated return.\n\nThe message is deliberately soft, but it means your PAN is already flagged against specific transactions. The choice it presents is real: file ITR-U at the current slab, or wait and risk a Section 148 reopening (Section 280 under the new Act for later years), where the same income comes with under-reporting penalties instead of a fixed surcharge. Ignoring the SMS does not make the data go away.",
    },
    {
      id: "09",
      heading: "ITR-U VS THE ALTERNATIVES",
      body: "",
      table: {
        headers: ["Route", "When available", "Cost profile"],
        rows: [
          ["Revised return (139(5))", "Until 31 Dec after the AY", "No fee, just incremental tax + interest"],
          ["Belated return (139(4))", "Until 31 Dec after the AY", "Rs 1,000-5,000 fee + interest"],
          ["ITR-U (139(8A))", "48 months from AY end", "25%-70% additional tax on tax + interest"],
          ["Do nothing", "Until the department acts", "270A penalty 50%-200% + reopening + prosecution risk"],
        ],
      },
      note:
        "If you are still inside the belated/revised window for AY 2026-27 (open until 31 December 2026), never use ITR-U for that year; the normal routes are a fraction of the cost.",
    },
  ],
  faqs: [
    {
      q: "I got an SMS saying my AY 2023-24 transactions do not match my return. Do I have to file ITR-U?",
      a: "Not mandatorily; the e-campaign message is an invitation, not a notice. But check AIS for that year immediately. If income was genuinely missed, filing ITR-U at the current 60% slab for AY 2023-24 settles it. If the AIS entry is wrong (duplicated broker reporting is common), submit feedback on the AIS portal disputing the entry instead of filing. Ignoring a genuine mismatch is what converts a soft SMS into a Section 148 reopening.",
    },
    {
      q: "Can I use ITR-U to claim the refund I forgot to claim for AY 2023-24?",
      a: "No. An ITR-U cannot claim a refund, increase a refund, or reduce your liability. Refunds die with the belated-return deadline (31 December after the assessment year). ITR-U exists only for situations where you owe the government more, not the other way around.",
    },
    {
      q: "My original AY 2024-25 return showed a business loss. Can I update it?",
      a: "You cannot file an ITR-U that is itself a return of loss. But if the correction reduces the loss or converts it into positive income with additional tax payable, that is permitted. Note the knock-on effect: if a carried-forward loss shrinks, subsequent years that used that loss may also need updating, each with its own additional tax.",
    },
    {
      q: "How is the additional tax calculated exactly: on income or on tax?",
      a: "On tax. Section 140B levies the additional tax as a percentage (25/50/60/70) of the aggregate of tax and applicable interest on the additional income. Example: additional tax + interest of Rs 1,00,000 filed in the 25% window costs Rs 25,000 extra, for a total of Rs 1,25,000. It is never a percentage of the income itself.",
    },
    {
      q: "Can I file ITR-U for more than one year at once?",
      a: "Yes, each year is a separate ITR-U with its own computation and its own slab. Multi-year non-filers typically clear the oldest open year first (AY 2022-23, closing 31 March 2027 at 70%) since that window expires first. Each year can only be updated once, so compute each carefully.",
    },
    {
      q: "I never filed for AY 2022-23 and had Rs 3 lakh income, below taxable limits after deductions. Should I file ITR-U before March 2027?",
      a: "You likely cannot: if no additional tax is payable, an ITR-U is not valid. If your income was genuinely below the taxable threshold, there was no obligation to file and there is nothing to regularise. Keep the computation and proofs on record in case a non-filer query arrives; a written response to the query is the right tool, not ITR-U.",
    },
    {
      q: "Does filing ITR-U protect me from a Section 148 reopening for that year?",
      a: "It substantially reduces the practical risk for the disclosed income, since the income is now taxed and the case for 'income escaping assessment' on that item falls away. It is not statutory immunity: if the department finds further undisclosed income beyond what the ITR-U covered, reopening on that remains possible. Disclose completely in one shot; partial ITR-U filings are the worst of both worlds.",
    },
    {
      q: "There is a search operation in our group. Can the promoters still file ITR-U?",
      a: "No. Once a search under Section 132 or survey under 133A is initiated, ITR-U is barred for the relevant person and years, and the search assessment framework takes over. This is why timing matters: ITR-U is a pre-enforcement window, and enforcement action closes it instantly.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 1961, Section 139(8A) and Section 140B",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Updated return eligibility, exclusions and additional tax computation.",
    },
    {
      name: "ClearTax: ITR-U guide",
      url: "https://cleartax.in/s/itr-u-updated-income-tax-return",
      description: "Slab-wise additional tax, eligibility conditions and filing walkthrough.",
    },
    {
      name: "Income Tax e-Filing Portal (e-campaign / compliance portal)",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "AIS review, e-campaign responses and ITR-U filing utility.",
    },
  ],
};
