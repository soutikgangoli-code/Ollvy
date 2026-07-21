// =============================================================================
// GUIDE PAGE: dpt-3-2027
// File path: lib/guides/pages/dpt-3-2027.ts
// DPT-3 return of deposits for FY 2026-27, due 30 June 2027 under Rule 16 of
// the Companies (Acceptance of Deposits) Rules 2014. Modelled on dpt-3-2026.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const dpt32027: LearnPageConfig = {
  slug: "dpt-3-2027",
  title: "DPT-3 Return of Deposits for FY 2026-27: Due 30 June 2027",
  seoTitle: "DPT-3 Filing 2027 | Return of Deposits Due 30 June | Ollvy",
  seoDescription:
    "File DPT-3 for FY 2026-27 by 30 June 2027. Director loans, ICDs, and advances all get reported. Late filing: Rs 100/day fee plus Rs 5,000 penalty (Rule 21).",
  canonicalUrl: "https://www.ollvy.com/guides/dpt-3-2027",
  lastReviewed: "July 2026",
  category: "ROC Filing",
  relatedServiceSlugs: ["mca-annual-filing"],
  relatedLearnSlugs: [
    "dpt-3-2026",
    "llp-form-11-2027",
    "fla-return-2027",
    "mca-annual-filing-aoc-4-mgt-7",
  ],
  ctaServiceSlug: "mca-annual-filing",
  sections: [
    {
      id: "01",
      heading: "WHAT DPT-3 IS AND THIS YEAR'S DEADLINE",
      body:
        "DPT-3 is the annual return in which a company discloses all outstanding money it has received that is either a deposit regulated under Section 73 of the Companies Act 2013, or an exempt receipt excluded from the deposit definition under Rule 2(1)(c) of the Companies (Acceptance of Deposits) Rules 2014. For FY 2026-27, the return captures the position as on 31 March 2027 and is due by 30 June 2027 under Rule 16. The name misleads founders every year: most filers have no public deposits at all, but director loans, group company loans, and long-pending advances are all covered receipts that must be reported.",
    },
    {
      id: "02",
      heading: "WHO FILES",
      body:
        "Every company registered under the Companies Act except government companies: Pvt Ltds, OPCs, public companies listed and unlisted, and Section 8 companies. Rule 1(3) additionally exempts banking companies, RBI-registered NBFCs, and housing finance companies registered with the National Housing Bank, all of which report deposits to their own regulators. There is no turnover, capital, or age threshold: a startup incorporated in 2026 with a single founder loan on its books files DPT-3 for FY 2026-27. LLPs do not file DPT-3; the deposits framework is a Companies Act construct.",
    },
    {
      id: "03",
      heading: "WHAT GETS REPORTED AS ON 31 MARCH 2027",
      body:
        "The return sweeps in most forms of money the company holds that it has not earned as revenue or raised as allotted share capital:",
      bullets: [
        "Loans from directors and their relatives outstanding as on 31 March 2027 (exempt receipts, but reportable with the director's declaration that funds are not borrowed).",
        "Inter-corporate loans and deposits, including from holding, subsidiary, and group companies, Indian or foreign.",
        "Bank and financial institution borrowings: term loans, working capital, ECBs.",
        "Debentures outstanding, secured or unsecured.",
        "Share application money pending allotment beyond 60 days (which converts into a deposit).",
        "Advances against orders or services not adjusted within 365 days.",
        "Any actual public deposits accepted under Section 73 (rare outside NBFC-adjacent structures).",
      ],
      note:
        "The audit trail matters: DPT-3 figures should tie to the FY 2026-27 balance sheet borrowings and other liabilities. A DPT-3 that disagrees with the AOC-4 financials filed later in the year is a discrepancy both filings will wear.",
    },
    {
      id: "04",
      heading: "DEPOSITS vs EXEMPT RECEIPTS: THE DISTINCTION THAT DRIVES EVERYTHING",
      body:
        "Regulated deposits trigger the full Section 73 machinery (credit rating, deposit insurance, trustee framework). Exempt receipts avoid that machinery but still get disclosed in DPT-3. The classification lives in Rule 2(1)(c) and is condition-sensitive:",
      table: {
        headers: ["Money Received", "Treatment", "DPT-3 Reportable"],
        rows: [
          ["Director's own-funds loan to the company", "Exempt under Rule 2(1)(c)(viii)", "Yes"],
          ["Loan from a director's relative (private company, with declaration)", "Exempt subject to conditions", "Yes"],
          ["Loan from holding / subsidiary / group company", "Exempt under Rule 2(1)(c)(vi)", "Yes"],
          ["Bank / FI borrowing", "Exempt under Rule 2(1)(c)(iii)", "Yes"],
          ["Share application money pending up to 60 days", "Exempt under Rule 2(1)(c)(vii)", "No"],
          ["Share application money pending beyond 60 days", "Becomes a deposit", "Yes (deposit column)"],
          ["Customer advance adjusted within 365 days", "Exempt under Rule 2(1)(c)(xii)", "No"],
          ["Customer advance outstanding beyond 365 days", "Becomes a deposit", "Yes (deposit column)"],
        ],
      },
      note:
        "The exemptions are conditional, not automatic. A 'director loan' actually funded by the director's own borrowing fails the declaration condition and slides into deposit territory, with Section 73 consequences.",
    },
    {
      id: "05",
      heading: "PENALTIES: WHAT A MISSED 30 JUNE 2027 COSTS",
      body:
        "Three layers of exposure stack on a DPT-3 default:",
      bullets: [
        "Additional filing fee of Rs 100 per day from 1 July 2027, with no upper cap, paid on the form at the time of late filing.",
        "Rule 21 statutory penalty on adjudication: Rs 5,000 on the company and every officer in default, plus Rs 500 per day for continuing contravention.",
        "Section 73 / Section 76A exposure where actual deposits were accepted in violation of the framework: repayment of the deposit with interest, a fine of Rs 1 crore or twice the deposit amount (whichever is lower) up to Rs 10 crore on the company, and for officers in default imprisonment up to 7 years with personal fines. This is the severe end, reserved for genuine deposit violations rather than late disclosure of exempt receipts.",
      ],
      note:
        "For a routine late filing of exempt-receipt disclosures, the practical cost is the uncapped Rs 100/day fee plus adjudication risk. The Section 76A artillery applies when the underlying money itself breaches the deposit rules.",
    },
    {
      id: "06",
      heading: "NIL POSITIONS: FILE OR SKIP?",
      body:
        "If the company truly had zero deposits and zero exempt receipts outstanding on 31 March 2027, a NIL DPT-3 is not strictly mandatory: the filing trigger is having something to report. Two cautions before you skip. First, genuinely NIL companies are rarer than founders think: a Rs 2 lakh founder loan from 2025 still outstanding, share application money sitting unallotted, or a group company advance each defeat the NIL position. Second, most practitioners file a precautionary NIL return anyway (Rs 300 in MCA fees, about 30 minutes) because an absent filing reads as an oversight in due diligence and invites questions during fundraises and audits.",
    },
    {
      id: "07",
      heading: "DPT-3 AND THE AUDITOR",
      body:
        "DPT-3 is certified with reference to the company's books, and the return asks for the net worth and the auditor-verifiable break-up of receipts. The practical dependency: the FY 2026-27 trial balance needs to be closed enough by June 2027 to extract reliable 31 March 2027 outstanding figures, even though the statutory audit itself may finish later in the year. Companies that leave book-closing to September end up filing DPT-3 on provisional numbers that later disagree with the audited AOC-4, or filing late. Close the borrowings and advances ledgers first; they are what DPT-3 needs.",
    },
    {
      id: "08",
      heading: "THE FY 2026-27 MID-YEAR COMPLIANCE CLUSTER",
      body:
        "DPT-3 lands in a crowded window. For a funded private company, the FY 2026-27 sequence looks like:",
      table: {
        headers: ["Filing", "Due Date", "Authority"],
        rows: [
          ["LLP Form 11 (if you also run an LLP)", "30 May 2027", "MCA"],
          ["DPT-3 return of deposits", "30 June 2027", "MCA"],
          ["RBI FLA return (if FDI / ODI on the balance sheet)", "15 July 2027", "RBI"],
          ["Non-audit business ITR", "31 August 2027", "Income Tax"],
          ["AOC-4 / MGT-7 (post-AGM)", "October / November 2027", "MCA"],
        ],
      },
      note:
        "DPT-3 and the FLA return draw on the same balance-sheet data (borrowings, foreign liabilities). Preparing them together in June saves a second pass over the books.",
    },
    {
      id: "09",
      heading: "COMMON MISTAKES",
      body:
        "The recurring DPT-3 errors we correct:",
      bullets: [
        "Treating founder loans as personal arrangements outside the books. Director loans are exempt receipts and must be disclosed with the source declaration.",
        "Reporting only the year's fresh borrowings instead of all amounts outstanding as on 31 March 2027. DPT-3 is a position statement, not a flow statement.",
        "Missing the 60-day check on share application money. A December 2026 infusion still unallotted in June 2027 is a deposit, not pending capital.",
        "Filing DPT-3 figures that contradict the borrowings schedule later filed in AOC-4 for the same year.",
        "Assuming the company is exempt because it is small or a startup. There is no size exemption; only government companies, banks, NBFCs, and HFCs are outside Rule 16.",
      ],
    },
  ],
  faqs: [
    {
      q: "Our only liability is a Rs 10 lakh founder loan. Do we really need DPT-3?",
      a: "Yes. A director loan outstanding on 31 March 2027 is an exempt receipt under Rule 2(1)(c)(viii), reportable in DPT-3 with the director's declaration that the money is not from borrowed funds. The exemption saves you from the Section 73 deposit machinery; it does not save you from the disclosure.",
    },
    {
      q: "What is the penalty if we file DPT-3 in August 2027?",
      a: "Roughly 60 days late means about Rs 6,000 in additional fees at Rs 100 per day, on top of the normal filing fee. Adjudicated Rule 21 penalties (Rs 5,000 plus Rs 500/day) are a further risk that grows with delay, though short delays that are voluntarily cured rarely get adjudicated. There is no cap and no condonation scheme, so the meter only stops at filing.",
    },
    {
      q: "We repaid the director loan in May 2027. Does it still go in the FY 2026-27 DPT-3?",
      a: "Yes. DPT-3 reports the position as on 31 March 2027. A loan outstanding on that date is reported even if repaid before the filing date. Conversely, a loan taken in April 2027 belongs to next year's return, not this one.",
    },
    {
      q: "Does a foreign parent company's loan to our Indian subsidiary go in DPT-3?",
      a: "Yes. Loans from a holding or group company, foreign or Indian, are exempt receipts under Rule 2(1)(c)(vi) and reportable in the inter-corporate column. If it is an ECB, RBI-side reporting applies separately, and the same liability will also feature in the FLA return due 15 July 2027. One liability, three reporting regimes.",
    },
    {
      q: "Customer paid us a Rs 15 lakh advance in January 2027 for a project delivering in 2028. Problem?",
      a: "Watch the 365-day clock. An advance against goods or services is exempt only if adjusted within 365 days of receipt. If the project genuinely will not be delivered within that window, the advance risks classification as a deposit, which is a Section 73 problem, not just a disclosure line. Structure long-gestation projects with milestone billing rather than one long-outstanding advance.",
    },
    {
      q: "Is DPT-3 needed if we have only bank loans?",
      a: "Yes. Bank and financial institution borrowings are exempt receipts under Rule 2(1)(c)(iii) and go into DPT-3. A company with only a working capital limit and a term loan still has a reportable position and should file.",
    },
    {
      q: "Can the 30 June 2027 date get extended?",
      a: "MCA has extended DPT-3 in past years when the form or portal changed, but 30 June has held as the standard date. Work to 30 June 2027; if MCA notifies an extension or a scheme touching DPT-3, this page will be updated. Given the Rs 100/day meter, filing early beats waiting for relief that may not come.",
    },
  ],
  sources: [
    {
      name: "Companies Act 2013, Sections 73 and 76A",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Deposit acceptance framework and the punishment provision for contraventions.",
    },
    {
      name: "Companies (Acceptance of Deposits) Rules 2014, Rules 2(1)(c), 16 and 21",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Exempt receipt definitions, the annual DPT-3 requirement, and the penalty framework.",
    },
    {
      name: "MCA-21 V3 Filing Portal",
      url: "https://www.mca.gov.in/mcafoportal/login.do",
      description: "Official portal for DPT-3 submission.",
    },
  ],
};
