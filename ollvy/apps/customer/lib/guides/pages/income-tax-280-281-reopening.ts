// =============================================================================
// GUIDE PAGE: income-tax-280-281-reopening
// File path: lib/guides/pages/income-tax-280-281-reopening.ts
// Reassessment notices under the Income Tax Act 2025: Section 280 (notice) and
// Section 281 (show-cause), successors to Sections 148 / 148A for notices
// issued on or after 1 April 2026.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const incomeTax280281Reopening: LearnPageConfig = {
  slug: "income-tax-280-281-reopening",
  title: "Section 280 / 281 Reassessment Notice (Income Tax Act 2025): What It Means",
  seoTitle: "Section 280 & 281 Reassessment Notice (IT Act 2025) | Ollvy",
  seoDescription:
    "Sections 280 and 281 of the Income-tax Act 2025 replace 148/148A for reopening notices from 1 April 2026. Respond within the notice window, usually 30 days.",
  canonicalUrl: "https://www.ollvy.com/guides/income-tax-280-281-reopening",
  lastReviewed: "July 2026",
  category: "Income Tax Notice",
  relatedServiceSlugs: ["business-itr"],
  relatedLearnSlugs: [
    "income-tax-148-148a-reopening",
    "income-tax-act-2025-section-mapping",
    "income-tax-270-intimation",
    "itr-u-updated-return",
  ],
  relatedTools: {
    documentChecklists: ["business-itr", "individual-itr"],
  },
  ctaServiceSlug: "business-itr",
  severity: "urgent",
  deadline: "As stated in the notice (typically 30 days)",
  deadlineNote:
    "The response window is printed on the notice itself. Show-cause notices commonly give around 30 days. Missing it lets the officer proceed to reassess on best-judgment basis without your side of the story.",
  sections: [
    {
      id: "01",
      heading: "WHAT A SECTION 280 OR 281 NOTICE MEANS",
      body:
        "A notice quoting Section 280 or Section 281 of the Income Tax Act 2025 means the department believes income escaped assessment in an earlier year and wants to reopen it. These are the new Act's successors to the familiar reassessment provisions: Section 280 is the reassessment notice itself (the old Section 148 role) and Section 281 is the show-cause procedure that gives you a chance to contest the reopening before it is confirmed (the old Section 148A role). They apply to notices issued on or after 1 April 2026, which is why taxpayers started seeing these unfamiliar numbers in 2026. The trigger is usually information the department already holds: AIS entries, SFT reports of large transactions, GST data, search material from a third party, or an unexplained gap between deposits and declared income.",
    },
    {
      id: "02",
      heading: "WHICH ACT GOVERNS YOUR NOTICE: THE SECTION 536(2)(c) SAVINGS CLAUSE",
      body:
        "Two regimes are running in parallel, and the first thing to check on any reopening notice is which one you are in. The savings clause in Section 536(2)(c) of the 2025 Act preserves proceedings that were already underway: where a reassessment was initiated under the 1961 Act before 1 April 2026, it continues under the 1961 Act with the old sections (148, 148A, 147) as if the new Act had not been passed.",
      bullets: [
        "Notice issued before 1 April 2026: the 1961 Act applies. It will quote Section 148 or 148A, and any follow-on orders in that proceeding stay under the old Act even if they arrive after April 2026.",
        "Notice issued on or after 1 April 2026: the 2025 Act applies. It will quote Section 280 or 281, even where the year being reopened was governed by the 1961 Act when the income was earned.",
        "If a post-April-2026 notice quotes Section 148, or a pre-April-2026 proceeding suddenly switches numbering, that inconsistency is worth raising: reopening notices have been quashed for procedural defects under the old regime, and the same discipline applies to the new one.",
      ],
      note:
        "Keep the notice's DIN (Document Identification Number), date of issue, and the section quoted together. These three facts decide the applicable law before you get to the merits.",
    },
    {
      id: "03",
      heading: "SHOW-CAUSE FIRST: HOW THE TWO SECTIONS WORK TOGETHER",
      body:
        "The 2025 Act keeps the taxpayer-protection sequence introduced in 2021: before the department can reassess, you normally get a show-cause opportunity under Section 281 explaining what information suggests escaped income and asking why reassessment should not follow. Only after considering your reply (or your silence) does the reassessment notice under Section 280 issue, requiring you to file a return for the reopened year. So identify which stage you are at:",
      bullets: [
        "Section 281 show-cause: the reopening is not yet confirmed. This is your best window to kill the case with a factual reply, because a strong response can end the matter with an order dropping the proposal.",
        "Section 280 notice: the reopening has been decided. You must now file a return for the year in question within the time stated, and the reassessment proceeding follows. You can still contest the merits, but the forum has shifted.",
        "Certain categories, such as cases arising from search material, can proceed on a modified track without the standard show-cause step, as they did under the 1961 Act.",
      ],
    },
    {
      id: "04",
      heading: "HOW FAR BACK THE DEPARTMENT CAN REACH",
      body:
        "For proceedings still under the 1961 Act (initiated before 1 April 2026), the settled structure applies: reopening within 3 years and 3 months from the end of the assessment year in ordinary cases, extended to 5 years and 3 months where the escaped income represented in an asset, expenditure, or entry is Rs 50 lakh or more. The 2025 Act carries a comparable limitation framework with a monetary threshold for the extended window. The notice must state the year being reopened and the information relied on; check the arithmetic on limitation before anything else, because a time-barred notice fails regardless of the merits.",
      note:
        "The exact limitation wording under the new Act should be read from the notice and the section it cites rather than assumed from 1961-Act memory. Where the department reopens a year close to the boundary, limitation is often the strongest ground.",
    },
    {
      id: "05",
      heading: "RESPONDING THROUGH THE FACELESS PORTAL",
      body:
        "Reassessment under the new Act runs through the faceless mechanism: the notice lands on the e-filing portal and email, and your reply goes back through the portal, not to a local officer. The mechanics:",
      bullets: [
        "Log in at incometax.gov.in and open Pending Actions, then e-Proceedings. The notice, its annexure, and the response window appear there.",
        "Verify the notice: DIN present, correct PAN, correct tax year, issuing authority, and date of issue. Notices without a valid DIN are treated as never issued under CBDT's own circular.",
        "Download the information annexure. It states what the department thinks you did: a property purchase, large deposits, trading data, a counterparty's search material.",
        "Reply point by point with documents: bank statements, the original ITR computation, sale deeds, loan agreements, gift deeds, broker statements. Address the source of every flagged amount.",
        "File within the stated window, and seek an adjournment through the portal before expiry if you genuinely need more time. Silence is the worst response.",
      ],
    },
    {
      id: "06",
      heading: "WHAT HAPPENS IF YOU IGNORE IT",
      body:
        "Ignoring a reopening notice does not make it lapse. The sequence that follows is mechanical and expensive.",
      bullets: [
        "The officer proceeds ex parte and completes a best-judgment reassessment, taxing the flagged amounts in full with no benefit of your explanations.",
        "Tax on the added income, plus interest running from the original year, lands as a demand.",
        "Penalty proceedings follow. Under-reporting attracts 50% of the tax; misreporting attracts 200%, using the new Act's successor to the Section 270A framework.",
        "An unpaid demand escalates to recovery: refund adjustments, bank account attachment, and in serious concealment cases prosecution exposure.",
        "Appeal remains possible, but appealing an ex parte order is a far weaker position than contesting the show-cause on facts.",
      ],
    },
    {
      id: "07",
      heading: "GROUNDS THAT ACTUALLY WORK AGAINST REOPENING",
      body:
        "Reopening cases are won on discipline, not indignation. The grounds that consistently succeed:",
      bullets: [
        "Limitation: the notice is beyond the permissible window for that year and amount. Check this first.",
        "Already disclosed: the flagged income was in the original return. Reassessment on a mere change of opinion has been struck down repeatedly, and the principle survives into the new Act.",
        "Explained source: the deposit or investment came from documented, non-taxable sources such as loan proceeds, redemption of earlier investments, gifts from relatives, or sale proceeds already taxed.",
        "Wrong person or duplication: the information relates to a joint holder, a namesake PAN error, or an amount counted twice across AIS feeds.",
        "Procedural defect: missing DIN, no show-cause opportunity where one was required, or sanction not obtained from the specified authority.",
      ],
    },
    {
      id: "08",
      heading: "IF THE REOPENING IS CONFIRMED: FILING THE SECTION 280 RETURN",
      body:
        "Once a Section 280 notice issues, file the return for the reopened year within the time it states, even if you believe the reopening is bad in law. File on the basis of your true income, claim the objections in the assessment proceeding, and keep every submission on the portal record. Refusing to file converts a defensible case into a best-judgment assessment with penalty on top. If genuinely escaped income exists, filing accurately at this stage and paying the tax with interest materially improves the penalty outcome compared to being caught contesting everything.",
    },
    {
      id: "09",
      heading: "WHERE THE UPDATED RETURN FITS",
      body:
        "The updated-return route (ITR-U) continues under the new Act and, for tax year 2026-27 onwards, remains available in defined situations even after a reassessment notice, on payment of the tax, interest, and the additional charge. If you know a genuine omission exists in a year that has not yet been reopened, an updated return filed before any notice is dramatically cheaper than a reassessment: additional tax on a slab, versus tax plus interest plus penalty of 50% to 200%. Once the show-cause arrives, get advice on the same day about whether the updated-return window is still open for your facts.",
    },
  ],
  faqs: [
    {
      q: "I received a notice quoting Section 280. Is this a scam? I have never heard of it.",
      a: "Verify before assuming either way. Section 280 is genuine: it is the Income Tax Act 2025 successor to Section 148, used for reopening notices issued on or after 1 April 2026. Confirm authenticity on the e-filing portal under Pending Actions and use the Authenticate Notice utility with the DIN. If it does not appear on the portal, treat it as suspect.",
    },
    {
      q: "My notice quotes Section 148A and was issued in March 2026. Does the new Act apply?",
      a: "No. Proceedings initiated under the 1961 Act before 1 April 2026 continue under the 1961 Act by virtue of the Section 536(2)(c) savings clause. Your case runs on the 148A / 148 track with the old Act's timelines, even though later orders may arrive well after April 2026.",
    },
    {
      q: "Can the department reopen a year that was governed by the old 1961 Act?",
      a: "Yes. The Act that governs the notice is decided by when the notice issues, not when the income was earned. A notice issued in 2027 reopening an older year proceeds under the 2025 Act's Sections 280 and 281, subject to the limitation limits for that year. What the savings clause protects is proceedings already started under the old Act, not old years as such.",
    },
    {
      q: "How many days do I get to reply to the Section 281 show-cause?",
      a: "The window is stated in the notice itself and is typically in the region of 30 days. Do not rely on a generic number: read the notice, diarise the exact date, and request an adjournment through the portal before expiry if you need more time. Replies filed after the window may simply not be considered.",
    },
    {
      q: "The notice is about a Rs 60 lakh property purchase I made with a home loan. Should I worry?",
      a: "This is one of the most common and most winnable fact patterns. The department sees the registered purchase through SFT data but not your funding. Reply with the loan sanction letter, disbursement proof, bank statements, and your own contribution trail. A complete source explanation at the show-cause stage frequently ends the matter without reassessment.",
    },
    {
      q: "What penalty am I facing if some income genuinely escaped?",
      a: "Tax at your slab on the escaped income, interest from the original year, and penalty under the new Act's under-reporting framework: 50% of the tax for under-reporting, 200% where it is treated as misreporting (fake entries, false documentation). Voluntary correction, cooperation, and payment before the assessment concludes are the levers that pull the outcome toward the lower end.",
    },
    {
      q: "Can I just ignore it if the amounts are old and small?",
      a: "No. An ignored show-cause becomes a confirmed reopening; an ignored Section 280 notice becomes a best-judgment reassessment taxing the full flagged amount, with interest and penalty, followed by recovery against refunds and bank accounts. Small cases are cheap to close with a reply and expensive to close after an ex parte order.",
    },
    {
      q: "Do I need a CA for this or can I reply myself?",
      a: "A simple, fully documented explanation (one flagged transaction, clean paper trail) can be self-handled through the portal. Get professional help when multiple years or transactions are involved, when limitation arguments arise, when search material is cited, or when any real escaped income exists, because the reply you file at the Section 281 stage frames everything that follows, including penalty.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025 - reassessment provisions",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Sections 280 and 281 (reassessment notice and show-cause procedure) and the Section 536 repeal and savings framework.",
    },
    {
      name: "CAclubindia - practitioner guide to Sections 280/281",
      url: "https://www.caclubindia.com/articles/",
      description: "Practitioner analysis of the reassessment procedure under the 2025 Act and its continuity with the 148A jurisprudence.",
    },
    {
      name: "Tax2win - 1961 Act to 2025 Act section mapping",
      url: "https://tax2win.in/guide/income-tax-act-2025",
      description: "Mapping of old reassessment sections (147/148/148A) to the new Act's numbering.",
    },
    {
      name: "Income Tax e-Filing Portal - e-Proceedings",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Faceless response channel and the Authenticate Notice / DIN verification utility.",
    },
  ],
};
