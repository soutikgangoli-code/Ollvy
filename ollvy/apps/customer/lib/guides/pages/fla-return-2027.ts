// =============================================================================
// GUIDE PAGE: fla-return-2027
// File path: lib/guides/pages/fla-return-2027.ts
// RBI FLA (Foreign Liabilities and Assets) return for FY 2026-27, due
// 15 July 2027 on the FLAIR portal. Audience: FDI-funded companies and LLPs.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const flaReturn2027: LearnPageConfig = {
  slug: "fla-return-2027",
  title: "RBI FLA Return for FY 2026-27: Due 15 July 2027",
  seoTitle: "FLA Return 2027 | RBI Deadline 15 July | FY 2026-27 | Ollvy",
  seoDescription:
    "Any company or LLP with FDI or overseas investment on the FY 2026-27 balance sheet must file the RBI FLA return by 15 July 2027. Late fee Rs 7,500 under FEMA.",
  canonicalUrl: "https://www.ollvy.com/guides/fla-return-2027",
  lastReviewed: "July 2026",
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing"],
  relatedLearnSlugs: [
    "dpt-3-2027",
    "should-i-get-dpiit-startup-recognition",
    "esop-structuring",
    "pas-6-2026",
  ],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT THE FLA RETURN IS AND WHO MUST FILE BY 15 JULY 2027",
      body:
        "The FLA (Foreign Liabilities and Assets) return is RBI's annual census of cross-border investment positions, filed on the FLAIR portal by 15 July each year. For FY 2026-27, any Indian company or LLP that has foreign direct investment (foreign shareholders on the cap table) or overseas direct investment (holdings in foreign entities) outstanding on its 31 March 2027 balance sheet must file by 15 July 2027. This is a FEMA obligation to RBI, completely separate from MCA annual filings and the ITR, and it applies even if no fresh investment happened during the year: what triggers it is the position on the balance sheet, not the year's transactions. A startup that raised from a foreign VC in 2023 and has done nothing since still files every year the holding remains outstanding.",
    },
    {
      id: "02",
      heading: "WHO EXACTLY IS COVERED",
      body:
        "The net covers more entities than the classic funded startup:",
      bullets: [
        "Companies with any foreign shareholding outstanding on 31 March 2027: VC/PE money routed through offshore funds, a foreign parent, angel money from NRIs on a non-repatriation basis excluded but foreign-resident angels included.",
        "Companies that have made overseas investment: a foreign subsidiary, a stake in a foreign entity, or an offshore branch.",
        "LLPs with FDI or ODI on the same test.",
        "AIFs, partnership firms, and public-private arrangements holding cross-border positions, per RBI's FLA guidance.",
        "Not covered: companies with only trade exports/imports, only ECB fully repaid, or shares held by NRIs strictly on non-repatriation basis and no other foreign position.",
      ],
      note:
        "A company that had FDI in the past but whose foreign holders fully exited before 31 March 2027 (nothing outstanding on the balance sheet date) does not need to file for FY 2026-27.",
    },
    {
      id: "03",
      heading: "WHAT GETS REPORTED",
      body:
        "The return is a position-and-valuation statement, not a transaction log:",
      bullets: [
        "Foreign liabilities: equity held by non-residents at market/fair value, retained earnings attributable, and other investment liabilities (loans from the foreign parent, trade credit beyond thresholds).",
        "Foreign assets: equity in foreign subsidiaries and associates, loans to them, and other overseas claims.",
        "Financial data from the FY 2026-27 accounts: paid-up capital, reserves, profit and loss for the year.",
        "Counterparty country and sector classification for each position.",
      ],
      note:
        "Valuation follows RBI's prescribed methods (for unlisted equity, the own-funds-at-book-value approach). The finance team's main work is reconciling the cap table, the share valuation, and the ledger to the FLAIR format.",
    },
    {
      id: "04",
      heading: "UNAUDITED ACCOUNTS ARE FINE: THE PROVISIONAL-THEN-REVISE ROUTE",
      body:
        "The most common excuse for missing FLA, waiting for the audit, is explicitly unnecessary. RBI accepts the return on provisional (unaudited) figures by 15 July 2027, with a revision expected once audited accounts are adopted, by 30 September 2027. So the sequence for a typical startup is: file on management accounts in the first half of July, complete the audit on its own timetable, and revise on FLAIR by end-September if the audited numbers differ. Filing nothing because the audit is pending converts a routine estimate-and-true-up into a FEMA contravention.",
    },
    {
      id: "05",
      heading: "WHAT NON-FILING COSTS UNDER FEMA",
      body:
        "FLA non-filing is a FEMA contravention, and FEMA's toolkit is different from the Rs-100-a-day world of MCA:",
      bullets: [
        "Late Submission Fee (LSF): RBI's regularisation route for reporting delays, at Rs 7,500 for a delayed FLA return, payable to regularise the default administratively.",
        "Compounding: where the LSF route is unavailable or the contravention is not regularised, FEMA compounding applies, with penalties that can be computed up to 300% of the amount involved in the contravention. For a company with a large FDI balance, the theoretical ceiling is severe even though compounding orders in practice land far below it.",
        "Knock-on friction: banks processing further FDI inflows, share allotments to foreign investors, or repatriations ask for FLA compliance confirmation. An unfiled FLA return surfaces at the exact moment a funding round is closing.",
      ],
      note:
        "The rational reading: Rs 7,500 and an hour of paperwork against a diligence red flag in your next round. Funded startups should treat 15 July like a board-level date.",
    },
    {
      id: "06",
      heading: "HOW TO FILE ON FLAIR: THE PROCESS",
      body:
        "The FLA return is filed on RBI's dedicated FLAIR portal (flair.rbi.org.in), not through your AD bank:",
      bullets: [
        "One-time registration: create the entity user on FLAIR with the authorised person's details, verification letter, and authority letter in RBI's format. First-time filers should do this in June; registration approval is not instant.",
        "Log in and select the FLA return for the reporting year ending 31 March 2027.",
        "Fill the sections: identification details, financial details from the FY 2026-27 accounts, foreign liabilities, foreign assets, and the variation report the portal computes against last year.",
        "Validate and submit; the portal issues an acknowledgement. No documents are uploaded; the return is the data itself.",
        "Diarise the revision: if you filed on provisional numbers, return to FLAIR by 30 September 2027 with audited figures.",
      ],
    },
    {
      id: "07",
      heading: "FLA IN THE FUNDED-STARTUP COMPLIANCE STACK",
      body:
        "For a company with foreign investors, FLA is one of four recurring FEMA/RBI touchpoints, and confusing them is common:",
      table: {
        headers: ["Filing", "When", "What it covers"],
        rows: [
          ["FC-GPR", "Within 30 days of allotment", "Each issue of shares to a foreign investor"],
          ["FC-TRS", "Within 60 days of transfer", "Share transfers between residents and non-residents"],
          ["FLA return", "Annually by 15 July", "Year-end stock of all foreign liabilities and assets"],
          ["APR (for ODI)", "Annually by 31 December", "Performance of overseas subsidiaries / JVs"],
        ],
      },
      note:
        "FC-GPR at the time of the round does not substitute for the annual FLA, and vice versa. The FLA return is the recurring one that outlives the transaction filings.",
    },
    {
      id: "08",
      heading: "COMMON FLA MISTAKES",
      body:
        "The patterns behind most FLA defaults and defective filings:",
      bullets: [
        "Assuming no-new-investment means no filing. The trigger is the outstanding position on 31 March 2027, not the year's activity.",
        "Missing the LLP obligation: FDI-funded LLPs file too, using their PAN-based registration on FLAIR.",
        "Waiting for audited accounts past 15 July instead of filing provisional and revising by 30 September.",
        "Forgetting the revision after filing provisional numbers, which leaves a knowingly wrong return on record.",
        "Treating convertible notes and CCDs held by foreign investors as outside the return; foreign-held instruments on the balance sheet belong in the liabilities side per RBI's classification.",
        "Losing FLAIR credentials with the departure of the finance person who registered; access recovery in July is a deadline killer.",
      ],
    },
  ],
  faqs: [
    {
      q: "We raised from a US fund in 2024 and nothing has changed since. Do we file for FY 2026-27?",
      a: "Yes. The US fund's holding was outstanding on your 31 March 2027 balance sheet, so the FLA return is due by 15 July 2027. The return will substantially repeat last year's positions with updated financials, which makes it quick, but it is not optional in quiet years.",
    },
    {
      q: "Our audit will not be done before 15 July 2027. What do we do?",
      a: "File on provisional (management) figures by 15 July 2027; RBI's FLA framework expressly allows it. Then revise the return on FLAIR with audited numbers by 30 September 2027. Missing 15 July because the audit is pending is the most common and least necessary FLA default.",
    },
    {
      q: "What actually happens if we skip it?",
      a: "The default is a FEMA contravention. The administrative fix is the Late Submission Fee of Rs 7,500 for delayed reporting; beyond that route lies FEMA compounding, where penalties can run up to 300% of the amount involved. The practical sting arrives earlier: your AD bank or a new investor's counsel asks for FLA acknowledgements during the next round, and the gap becomes a closing condition.",
    },
    {
      q: "Do NRI shareholders trigger the FLA return?",
      a: "It depends on the basis of their holding. Shares held by NRIs on a non-repatriation basis are treated as domestic investment and do not by themselves trigger FLA. NRI holdings on a repatriation basis are FDI and do. Check the FIRC/KYC trail of the original investment; many cap tables mix both.",
    },
    {
      q: "We have a wholly-owned subsidiary in Singapore but no foreign investors. Does FLA apply?",
      a: "Yes, from the assets side: overseas direct investment outstanding on 31 March 2027 triggers the return just as inbound FDI does. You will also have the separate APR (Annual Performance Report) obligation for the Singapore entity by 31 December. The two report different things and both apply.",
    },
    {
      q: "Is the FLA return public? Will competitors see our numbers?",
      a: "No. FLA data goes to RBI for compiling India's external investment statistics and is treated as confidential at entity level; only aggregates are published. It does not appear on the MCA registry the way AOC-4 financials do.",
    },
    {
      q: "Can the 15 July 2027 date shift?",
      a: "RBI has occasionally extended the FLA date in past years by a couple of weeks, announced through the FLAIR portal and AD banks. Treat 15 July 2027 as firm and file in the first half of July; if RBI notifies an extension for this cycle, this page will be updated.",
    },
  ],
  sources: [
    {
      name: "RBI - FLA Return FAQs",
      url: "https://www.rbi.org.in/scripts/FAQDisplay.aspx",
      description: "Official guidance on coverage, provisional filing, revision by 30 September, and the FLAIR process.",
    },
    {
      name: "RBI FLAIR Portal",
      url: "https://flair.rbi.org.in/",
      description: "Dedicated portal for entity registration and annual FLA submission.",
    },
    {
      name: "TaxGuru - FLA return practitioner guide",
      url: "https://taxguru.in/rbi/",
      description: "Practitioner walkthrough of applicability, valuation methods, and late submission consequences under FEMA.",
    },
  ],
};
