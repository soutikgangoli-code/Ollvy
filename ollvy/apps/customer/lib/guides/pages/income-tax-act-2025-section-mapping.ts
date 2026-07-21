// =============================================================================
// GUIDE PAGE: income-tax-act-2025-section-mapping
// File path: lib/guides/pages/income-tax-act-2025-section-mapping.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const incomeTaxAct2025SectionMapping: LearnPageConfig = {
  slug: "income-tax-act-2025-section-mapping",
  title: "Income Tax Act 2025 vs 1961: Old to New Section Mapping",
  seoTitle: "Income Tax Act 2025 Section Mapping: Old vs New (2026) | Ollvy",
  seoDescription:
    "Find any 1961 Act section in the Income-tax Act 2025: 139 is now 263, 143(1) is 270(1), 148 is 280, 234B is 424. Plus which Act governs your notice or ITR.",
  canonicalUrl: "https://www.ollvy.com/guides/income-tax-act-2025-section-mapping",
  lastReviewed: "July 2026",
  category: "Tax",
  relatedServiceSlugs: ["business-itr", "tds-monthly-compliance", "gst-monthly"],
  relatedLearnSlugs: [
    "income-tax-143-1-intimation",
    "income-tax-142-1-notice",
    "income-tax-143-2-scrutiny",
    "income-tax-148-148a-reopening",
    "income-tax-156-demand",
    "new-tds-sections-fy2026-27",
  ],
  ctaServiceSlug: "business-itr",
  tool: {
    type: "eligibility",
    title: "Which Income Tax Act applies to your notice?",
    questions: [
      {
        text: "When was the notice issued?",
        options: [
          { value: "before_apr_2026", label: "Before 1 April 2026" },
          { value: "after_apr_2026", label: "On or after 1 April 2026" },
        ],
        exitOn: {
          before_apr_2026: {
            type: "eligible",
            headline: "The Income-tax Act 1961 governs your notice.",
            body:
              "Anything issued before 1 April 2026 was issued under the old Act, and the savings clause (Section 536(2)(c) of the 2025 Act) keeps those proceedings on the 1961 framework even now. Read the section numbers as printed - a 143(1) intimation or 148 reopening notice is answered under the old rules, usually within 30 days of the notice date.",
            ctaLabel: "Decode a 143(1) intimation",
            ctaHref: "/guides/income-tax-143-1-intimation",
          },
        },
      },
      {
        text: "Which year does the notice cover?",
        options: [
          { value: "old_year", label: "AY 2026-27 (FY 2025-26) or earlier" },
          { value: "new_year", label: "Tax year 2026-27 (FY 2026-27) onwards" },
        ],
      },
      {
        text: "What section number is printed on it?",
        options: [
          { value: "old_sections", label: "143(1), 142(1), 148, or 156" },
          { value: "new_sections", label: "270, 280, 281, or 289" },
          { value: "other_section", label: "Something else / not sure" },
        ],
      },
    ],
    resultRules: [
      {
        if: [
          { q: 1, anyOf: ["old_year"] },
          { q: 2, anyOf: ["old_sections"] },
        ],
        result: {
          type: "eligible",
          headline: "The 1961 Act governs - read the notice exactly as printed.",
          body:
            "The savings clause (Section 536(2)(c)) keeps AY 2026-27 and every earlier year on the 1961 Act, so a 143(1) intimation, 142(1) inquiry, 148 reopening or 156 demand for these years is correctly cited and fully valid. The renumbering changes nothing about your response: the 30-day windows on intimations and demands run from the notice date as before.",
          ctaLabel: "Read the 143(1) intimation guide",
          ctaHref: "/guides/income-tax-143-1-intimation",
        },
      },
      {
        if: [
          { q: 1, anyOf: ["old_year"] },
          { q: 2, anyOf: ["new_sections"] },
        ],
        result: {
          type: "conditional",
          headline: "Old year, new-Act sections - check the year printed on the notice again.",
          body:
            "AY 2026-27 and earlier years stay on the 1961 Act (Section 536(2)(c)), so a notice for those years should cite the old numbers. If it genuinely prints the new ones, map them back: 270(1) is the old 143(1) intimation, 280 is the old 148 reopening, 281 is the old 148A show-cause, 289 is the old 156 demand. The deadlines are identical either way - respond to the substance, not the numbering.",
          ctaLabel: "See what a Section 270 intimation means",
          ctaHref: "/guides/income-tax-270-intimation",
        },
      },
      {
        if: [
          { q: 1, anyOf: ["new_year"] },
          { q: 2, anyOf: ["new_sections"] },
        ],
        result: {
          type: "eligible",
          headline: "The Income-tax Act 2025 governs your notice.",
          body:
            "For tax year 2026-27 onwards the new numbering applies: a 270(1) intimation is answered exactly like the old 143(1), 280/281 replace 148/148A for reopening, and 289 replaces 156 for demand. Process, response options and the 30-day windows all carried forward unchanged - only the citations moved.",
          ctaLabel: "Read the Section 270 intimation guide",
          ctaHref: "/guides/income-tax-270-intimation",
        },
      },
      {
        if: [
          { q: 1, anyOf: ["new_year"] },
          { q: 2, anyOf: ["old_sections"] },
        ],
        result: {
          type: "conditional",
          headline: "New year, old sections - the citations are outdated, the notice still counts.",
          body:
            "For FY 2026-27 onwards the correct citations are the 2025 Act numbers: 270(1) for the old 143(1), 280 for the old 148, 289 for the old 156. Old-Act citations for a new-Act year do not invalidate the notice, but replies and appeals for these years should consistently use the new sections. Respond within the deadline printed on the notice itself.",
          ctaLabel: "Understand 280/281 reopening",
          ctaHref: "/guides/income-tax-280-281-reopening",
        },
      },
      {
        if: [{ q: 1, anyOf: ["old_year"] }],
        result: {
          type: "eligible",
          headline: "The 1961 Act governs - map the section using the tables below.",
          body:
            "Because of the savings clause (Section 536(2)(c)), everything up to AY 2026-27 runs on the old Act. Whatever section the notice quotes, find it in the mapping tables on this page and follow the linked guide for that notice type. If a reply is due, an Ollvy CA can draft it under the correct framework.",
          ctaLabel: "Get a CA to draft the reply",
          ctaHref: "/checkout/business-itr",
        },
      },
      {
        if: [{ q: 1, anyOf: ["new_year"] }],
        result: {
          type: "eligible",
          headline: "The Income-tax Act 2025 governs - map the section using the tables below.",
          body:
            "Tax year 2026-27 onwards runs on the new Act. Return filing is Section 263 (old 139), assessment notices sit in the 268-271 range (old 142-144), and advance tax interest is 424/425 (old 234B/234C). Find the printed section in the tables on this page, then follow the linked guide for that notice type.",
          ctaLabel: "Get a CA to draft the reply",
          ctaHref: "/checkout/business-itr",
        },
      },
    ],
    defaultResult: {
      type: "conditional",
      headline: "Check the assessment year printed on the notice - that decides everything.",
      body:
        "AY 2026-27 (FY 2025-26) or earlier: the 1961 Act, old section numbers. Tax year 2026-27 onwards: the 2025 Act, new numbers. That split comes from the savings clause in Section 536(2)(c), and the mapping tables below convert any section either way.",
      ctaLabel: "Get a CA to draft the reply",
      ctaHref: "/checkout/business-itr",
    },
  },
  sections: [
    {
      id: "01",
      heading: "THE ONE-PARAGRAPH ANSWER",
      body:
        "The Income-tax Act 2025 replaced the Income-tax Act 1961 on 1 April 2026, renumbering essentially every section while keeping the substantive rules largely intact: return filing moved from Section 139 to Section 263, the 143(1) intimation became 270(1), reopening moved from 147/148/148A to 279/280/281, and advance tax from 207-211 to 403-408. Which Act applies depends on the year: AY 2026-27 (FY 2025-26) and everything earlier stays on the 1961 Act, while FY 2026-27 onwards runs on the 2025 Act.\n\nThis page is a lookup table. If a notice, order or article quotes a section you do not recognise, find its old or new counterpart below, then follow the link to the detailed guide for that notice type.",
    },
    {
      id: "02",
      heading: "WHICH ACT GOVERNS YOUR CASE: THE SAVINGS CLAUSE",
      body:
        "Section 536(2)(c) of the new Act is the transition rule that decides everything. Proceedings, notices and assessments relating to periods before 1 April 2026 continue under the 1961 Act as if it had not been repealed. In practice:",
      bullets: [
        "ITR for AY 2026-27 (income of FY 2025-26), filed during 2026: old Act. Belated and revised returns for this year cite Section 139(4)/(5), late fee cites 234F.",
        "A scrutiny or reopening notice received in 2026 for AY 2023-24: old Act. It will cite 143(2) or 148, and replies are drafted under the 1961 framework.",
        "TDS on payments made from 1 April 2026: new Act (Sections 392/393/394).",
        "ITR for FY 2026-27, filed in 2027: new Act. Filing provision is Section 263.",
        "An intimation issued in 2027 for the FY 2026-27 return: new Act, Section 270(1).",
      ],
      note:
        "The most common confusion in 2026-27 is receiving old-Act notices and new-Act challans in the same month. Both are correct; they belong to different years.",
    },
    {
      id: "03",
      heading: "RETURN FILING: SECTION 139 BECOMES SECTION 263",
      body:
        "The whole return-filing machinery of Section 139 now lives in Section 263 of the 2025 Act, with the familiar sub-provisions renumbered as sub-sections.",
      table: {
        headers: ["What it does", "1961 Act", "2025 Act"],
        rows: [
          ["Filing the annual return", "139(1)", "263(1)"],
          ["Belated return", "139(4)", "263(4)"],
          ["Revised return", "139(5)", "263(5)"],
          ["Updated return (ITR-U)", "139(8A)", "263(6)"],
          ["Defective return", "139(9)", "corresponding provision in 263"],
        ],
      },
      note:
        "Deadlines carried forward: belated and revised returns remain due by 31 December following the assessment year, and the ITR-U window remains 48 months.",
    },
    {
      id: "04",
      heading: "ASSESSMENT AND SCRUTINY: THE 14X SERIES BECOMES THE 26X-27X SERIES",
      body:
        "Every assessment-stage notice was renumbered. If a notice cites one of these new sections, the process and your response options are the same as under the old counterpart.",
      table: {
        headers: ["Notice / proceeding", "1961 Act", "2025 Act"],
        rows: [
          ["Inquiry before assessment (asking for documents)", "142(1)", "268(1)"],
          ["Intimation after CPC processing", "143(1)", "270(1)"],
          ["Scrutiny selection notice", "143(2)", "270(2)"],
          ["Best judgment assessment", "144", "271"],
        ],
      },
    },
    {
      id: "05",
      heading: "REOPENING OF PAST YEARS: 147/148/148A BECOME 279/280/281",
      body:
        "The reassessment framework that was rewritten in 2021 (income escaping assessment, notice, and the mandatory prior show-cause) moved as a block.",
      table: {
        headers: ["What it does", "1961 Act", "2025 Act"],
        rows: [
          ["Income escaping assessment (the power)", "147", "279"],
          ["Reassessment notice", "148", "280"],
          ["Prior show-cause before reopening", "148A", "281"],
        ],
      },
      note:
        "Reopening notices issued in 2026 and 2027 for AY 2026-27 and earlier will still cite 148/148A because of the savings clause. Expect 280/281 notices only once FY 2026-27 assessments age into reopening range.",
    },
    {
      id: "06",
      heading: "DEMAND, ADVANCE TAX AND INTEREST",
      body:
        "The payment-side provisions renumbered as follows.",
      table: {
        headers: ["What it does", "1961 Act", "2025 Act"],
        rows: [
          ["Notice of demand", "156", "289"],
          ["Advance tax liability and schedule", "207-211", "403-408"],
          ["Interest for advance tax shortfall", "234B", "424"],
          ["Interest for deferred instalments", "234C", "425"],
          ["Late filing fee (Rs 5,000 / Rs 1,000)", "234F", "corresponding fee provision in the 2025 Act"],
        ],
      },
      note:
        "Rates are unchanged: 1% per month under 424/425, the 15/45/75/100 advance tax schedule, and the Rs 10,000 advance tax threshold all carry forward.",
    },
    {
      id: "07",
      heading: "TAX AUDIT AND TDS",
      body:
        "Two mappings matter for businesses more than any other.",
      table: {
        headers: ["What it does", "1961 Act", "2025 Act"],
        rows: [
          ["Tax audit requirement (turnover limits)", "44AB", "63"],
          ["Penalty for audit failure", "271B", "446"],
          ["TDS on salary", "192", "392"],
          ["TDS on non-salary payments (whole 194-series)", "194A to 194Q", "393 + Schedule I"],
          ["TCS", "206C", "394"],
        ],
      },
      note:
        "The TDS consolidation is the biggest structural change in the new Act; the dedicated FY 2026-27 TDS guide covers challan codes and the new return forms.",
    },
    {
      id: "08",
      heading: "HOW TO READ A NOTICE THAT ARRIVES AFTER APRIL 2026",
      body:
        "A three-step check tells you which framework you are in before you draft a single line of reply.",
      bullets: [
        "Check the assessment year or tax period on the notice. AY 2026-27 or earlier: 1961 Act. FY 2026-27 onwards: 2025 Act.",
        "Check the section quoted against the tables above. A 270(1) intimation is answered exactly like a 143(1) intimation; a 280 notice like a 148 notice.",
        "Check the response deadline on the notice itself. Renumbering did not relax a single deadline; the 30-day windows on intimations and demands operate as before.",
      ],
      note:
        "Do not cite new-Act sections when replying to an old-Act notice or vice versa. Mismatched citations do not invalidate a reply, but they signal confusion and invite avoidable queries.",
    },
    {
      id: "09",
      heading: "WHAT DID NOT CHANGE IN SUBSTANCE",
      body:
        "The 2025 Act was consciously drafted as a simplification, not a policy rewrite. For most taxpayers the following are untouched.",
      bullets: [
        "Tax slabs and both regimes as they stood after the Finance Act 2025.",
        "The concept of the 'tax year' replaces 'previous year/assessment year' terminology in the new Act, but the underlying periods align with financial years.",
        "Appeal hierarchy: faceless assessment, CIT(A), ITAT and beyond continue.",
        "Advance tax schedule, interest rates, late fee amounts, audit turnover thresholds.",
        "Refund, rectification and grievance processes on the e-filing portal, which now displays both old and new section references during the transition years.",
      ],
    },
  ],
  faqs: [
    {
      q: "I received a Section 270(1) intimation. Is that the same as the old 143(1)?",
      a: "Yes. Section 270(1) of the Income-tax Act 2025 is the CPC processing intimation, the direct successor of 143(1). It means your return for a tax year governed by the new Act (FY 2026-27 onwards) was processed, with a demand, a refund, or no change. The response options are the same: pay within 30 days, seek rectification, or respond to the demand on the portal.",
    },
    {
      q: "Which Act applies to my ITR for FY 2025-26 that I am filing in 2026?",
      a: "The 1961 Act. AY 2026-27 (income of FY 2025-26) is the last year on the old Act, under the savings clause in Section 536(2)(c) of the new Act. Your return cites Section 139, late fees cite 234F, and any belated or revised filing before 31 December 2026 is under 139(4)/139(5).",
    },
    {
      q: "Can the department still issue a Section 148 reopening notice after the 1961 Act was repealed?",
      a: "Yes. For assessment years before the new Act (AY 2026-27 and earlier), reopening continues under Sections 147/148/148A of the 1961 Act because pending and future proceedings for those years are saved by Section 536(2)(c). A 148 notice received in 2026 or 2027 for an old year is valid and is answered under the old framework, including the 148A show-cause safeguards.",
    },
    {
      q: "Where did Section 80C go in the new Act?",
      a: "The deduction provisions were regrouped into a new numbering scheme rather than mapped one-to-one, and most 80C-style deductions matter only under the old regime anyway. For the deduction chapter, work from the official mapping utility on incometax.gov.in rather than assuming a single-section counterpart, since several old sections were merged or split.",
    },
    {
      q: "Is the ITR-U window different under the new Act?",
      a: "No. The updated return moved from Section 139(8A) to Section 263(6) with the 48-month window and the 25%/50%/60%/70% additional tax slabs intact. The additional tax computation provision (old 140B) has its counterpart in the new Act as well. The mechanics are covered in the dedicated ITR-U guide.",
    },
    {
      q: "My CA's letterhead reply cites 143(3) for my FY 2026-27 scrutiny. Is that wrong?",
      a: "For FY 2026-27, the scrutiny notice issues under Section 270(2) of the new Act, and the assessment order will be under the new Act's assessment provision, so old-Act citations are technically incorrect for that year. It will not by itself invalidate the reply, but ask for the citations to be corrected; assessment orders and appeals for new-Act years should consistently use new-Act sections.",
    },
    {
      q: "Do I need to do anything just because the sections changed?",
      a: "For filing behaviour, no: the portal guides you to the right forms. Where action is needed is in systems and documents that hard-code section numbers: TDS software and challan mappings, rent agreements and contracts that quote TDS sections, salary structures referencing old-Act provisions, and internal compliance calendars. Those should be updated to dual references during 2026-27.",
    },
  ],
  sources: [
    {
      name: "Income-tax Act 2025 (official text and mapping utility)",
      url: "https://www.incometax.gov.in/",
      description: "Official new Act text and the department's old-to-new section comparison utility.",
    },
    {
      name: "CAclubindia: 1961-2025 Act concordance",
      url: "https://www.caclubindia.com/",
      description: "Practitioner concordance table of old and new section numbers.",
    },
    {
      name: "Tax2win: Income Tax Act 2025 section mapping guide",
      url: "https://tax2win.in/",
      description: "Side-by-side mapping of commonly used provisions including 139/263, 148/280 and 234B/424.",
    },
  ],
};
