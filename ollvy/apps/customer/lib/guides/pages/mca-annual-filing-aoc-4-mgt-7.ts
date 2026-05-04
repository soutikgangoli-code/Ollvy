// =============================================================================
// GUIDE PAGE: mca-annual-filing-aoc-4-mgt-7
// File path: lib/guides/pages/mca-annual-filing-aoc-4-mgt-7.ts
// (or wherever your existing guide pages live)
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const mcaAnnualFilingAoc4Mgt7: LearnPageConfig = {
  slug: "mca-annual-filing-aoc-4-mgt-7",
  title: "MCA Annual Filing for Pvt Ltd: AOC-4 and MGT-7 Explained",
  seoTitle: "MCA Annual Filing 2026 | AOC-4 and MGT-7 for Pvt Ltd | Ollvy",
  seoDescription:
    "Complete guide to MCA annual filing for Pvt Ltd companies in India. AGM rules, AOC-4 (financials, 30 days), MGT-7 (annual return, 60 days), penalties, director disqualification under Section 164(2).",
  canonicalUrl: "https://www.ollvy.com/guides/mca-annual-filing-aoc-4-mgt-7",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["mca-annual-filing", "tax-audit", "private-limited-incorporation"],
  relatedLearnSlugs: [
    "agm-compliance",
    "dir-3-kyc-explained",
    "pvt-ltd-vs-llp",
  ],
  ctaServiceSlug: "mca-annual-filing",
  ctaSecondarySlug: "tax-audit",
  sections: [
    {
      id: "01",
      heading: "WHAT MCA ANNUAL FILING ACTUALLY MEANS",
      body:
        "Every Pvt Ltd in India, no matter how small, has a yearly compliance ritual with the Ministry of Corporate Affairs. It runs in three legs: hold an Annual General Meeting (AGM) that adopts your audited accounts, file Form AOC-4 with those accounts within 30 days of the AGM, and file Form MGT-7 with the year's annual return within 60 days of the AGM. Skip any leg and the daily penalty clock starts. Skip three years in a row of either AOC-4 or MGT-7 and your directors get disqualified automatically under Section 164(2)(a).",
    },
    {
      id: "02",
      heading: "THE AGM-AOC-4-MGT-7 SEQUENCE",
      body:
        "These three events sit on a strict timeline. The AGM must happen by 30 September of the calendar year following the financial year. AOC-4 is filed within 30 days of the AGM. MGT-7 is filed within 60 days of the AGM. So for FY 2025-26, the absolute outer dates assuming a 30 September 2026 AGM are:",
      table: {
        headers: ["Event", "Outer Date", "Trigger"],
        rows: [
          ["AGM held", "30 Sep 2026", "End of FY + 6 months"],
          ["AOC-4 filed", "30 Oct 2026", "AGM + 30 days"],
          ["MGT-7 filed", "29 Nov 2026", "AGM + 60 days"],
          ["ADT-1 filed", "15 Oct 2026", "AGM + 15 days"],
        ],
      },
      note:
        "If your AGM is earlier than 30 September, all the downstream deadlines move forward proportionately. Don't assume the calendar dates above apply automatically.",
    },
    {
      id: "03",
      heading: "WHO MUST FILE",
      body:
        "Every company registered under the Companies Act, 2013, including private limited, public limited, OPC and Section 8 companies. There is no revenue exemption, no first-year exemption, and no dormant exemption. A company with zero revenue, zero employees and zero transactions still files the same forms as a fully operational company. The only difference is that its forms will be NIL or near-NIL.",
      bullets: [
        "Newly incorporated companies file from their first full FY end onwards. The first AGM must be held within 9 months of FY end.",
        "Dormant companies file simplified versions of the same forms but cannot skip them entirely.",
        "Section 8 (not-for-profit) companies file the same forms as Pvt Ltds, with a few additional disclosures.",
      ],
    },
    {
      id: "04",
      heading: "WHAT GOES INTO AOC-4",
      body:
        "AOC-4 is the financial statement filing. It carries your audited balance sheet, profit and loss, cash flow (where applicable), notes to accounts, board's report, auditor's report, and a few Section 134 disclosures. Most companies file the regular AOC-4. Small companies and OPCs can use the lighter AOC-4 (XBRL not required for them in most cases).",
      bullets: [
        "Audited financial statements signed by directors and the auditor.",
        "Board's Report covering operations, dividend, transfer to reserves, related party transactions, CSR (if applicable), risk management commentary.",
        "Auditor's report including any qualifications, key audit matters, and Section 143 disclosures.",
        "AGM notice and the resolution adopting the accounts.",
      ],
    },
    {
      id: "05",
      heading: "WHAT GOES INTO MGT-7",
      body:
        "MGT-7 is the annual return. It captures the year's snapshot of who owns the company and who runs it. Small companies and OPCs file MGT-7A, a shorter version. Everyone else files MGT-7 in full.",
      bullets: [
        "Registered office address and principal business activity.",
        "Particulars of holding, subsidiary and associate companies.",
        "Share capital, debentures and other securities, with all changes during the year.",
        "Members and debenture holders list with shareholding pattern.",
        "Directors and key managerial personnel, with all appointments, resignations and changes.",
        "Meetings of the board, committees and members held during the year.",
        "Charges registered or modified.",
        "Remuneration of directors and KMP.",
      ],
      note:
        "MGT-7 needs CS certification if paid-up capital is Rs 10 crore or more, or turnover is Rs 50 crore or more. Below that, a director's signature plus a practising professional's certification is enough.",
    },
    {
      id: "06",
      heading: "PENALTIES IF YOU SLIP",
      body:
        "Both AOC-4 and MGT-7 carry late fees of Rs 100 per day with no upper cap. The cap is missing on purpose, the law assumes that if you've gone six months past deadline, you should pay six months of fees. The fee runs on the company and on every officer in default (which usually means every director).",
      table: {
        headers: ["Default Length", "Per-Form Penalty", "If both forms missed"],
        rows: [
          ["30 days late", "Rs 3,000", "Rs 6,000"],
          ["90 days late", "Rs 9,000", "Rs 18,000"],
          ["180 days late", "Rs 18,000", "Rs 36,000"],
          ["365 days late", "Rs 36,500", "Rs 73,000"],
          ["3 consecutive years of non-filing", "Rs 1,09,500+", "Director disqualification under 164(2) (5 years)"],
        ],
      },
    },
    {
      id: "07",
      heading: "DIRECTOR DISQUALIFICATION UNDER SECTION 164(2)",
      body:
        "This is the headline risk and the reason MCA filings can never be a back-burner item. Section 164(2)(a) of the Companies Act 2013 states that any director of a company that has not filed financial statements (AOC-4) or annual returns (MGT-7 or MGT-7A) for any continuous period of three consecutive financial years is disqualified for five years from the date of the default. Note the use of 'or' in the statute, non-filing of either AOC-4 or MGT-7 for the three-year window triggers the disqualification. The disqualification is automatic, not discretionary. It applies across every other company you direct, not just the defaulting one. It's published on the public MCA portal where investors, banks and customers can see it. Reinstatement requires going to NCLT or, where applicable, applying for relief through specific MCA windows.",
      note:
        "If you direct multiple companies and one of them is silently sliding into default, you are personally exposed in all of them. We see this every diligence cycle.",
    },
    {
      id: "08",
      heading: "STRIKE-OFF, ACCOUNT FREEZE AND REVIVAL",
      body:
        "Beyond personal disqualification, the company itself can be struck off the register under Section 248. ROC issues notices to companies that have not filed for two or more years and proceeds with strike-off if no response. A struck-off company immediately loses its bank accounts (banks freeze on receipt of MCA notice), its PAN gets cancelled, and contracts in its name become unenforceable. Reviving a struck-off company through NCLT typically takes 12 to 18 months and costs over Rs 1 lakh in legal and professional fees, plus all the back-filings with full late fees.",
    },
    {
      id: "09",
      heading: "WHEN INVESTORS LOOK AT YOUR MCA STATUS",
      body:
        "Every term sheet diligence pulls your MCA Master Data. So does every bank loan, every large enterprise contract, every government tender. Pending AOC-4 or MGT-7 shows as a red flag with the date of last filing. Many founders only learn this exists when their seed round is held up because of a missing MGT-7. By that point fixing it takes a week, money and a sheepish explanation to the investor. Cheaper to file on time.",
    },
  ],
  faqs: [
    {
      q: "Can a Pvt Ltd skip annual filings if it has zero revenue?",
      a: "No. The Companies Act has no revenue threshold for AOC-4 or MGT-7. Even a fully dormant company files. The only legitimate way to stop filing is to formally close the company through strike-off, voluntary liquidation, or fast-track exit, all of which require all past filings to be up to date first.",
    },
    {
      q: "What if our AGM was delayed?",
      a: "AGMs can be extended by up to three months with prior approval from ROC for valid reasons (e.g., audit delays, force majeure). Without prior approval, holding an AGM after 30 September is a Section 96 violation by itself, separate from the AOC-4/MGT-7 penalty.",
    },
    {
      q: "We had multiple director changes during the year. How is that handled?",
      a: "Each director appointment, resignation and change is filed in real-time via DIR-12, separate from the annual filing. MGT-7 then summarises all the year's changes as a single section. Real-time DIR-12 is mandatory within 30 days of each event.",
    },
    {
      q: "Do we need a CS for AOC-4?",
      a: "AOC-4 is signed by directors and certified by a practising professional (CA, CS or CWA). The company doesn't need a full-time CS unless it crosses certain capital or turnover thresholds. For most early-stage Pvt Ltds, an external CS for certification is enough.",
    },
    {
      q: "How does first-year filing work for newly incorporated companies?",
      a: "If incorporated between 1 January and 31 March, the first FY can be extended to end on 31 March of the next calendar year, giving a 12 to 15 month first FY. The first AGM must be within 9 months of that FY end. Then AOC-4 (30 days) and MGT-7 (60 days) follow normally.",
    },
    {
      q: "What's CS certification on MGT-7 actually checking?",
      a: "Whether the data in MGT-7 reconciles with the statutory registers, AGM minutes, board meeting minutes, and prior year MGT-7. The CS is also checking for material non-compliances during the year. It's a defensive check, not a rubber stamp.",
    },
  ],
  sources: [
    {
      name: "Ministry of Corporate Affairs",
      url: "https://www.mca.gov.in/",
      description: "MCA portal, AOC-4 and MGT-7 e-forms.",
    },
    {
      name: "Section 92, Companies Act 2013",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Annual return statutory provisions (MGT-7).",
    },
    {
      name: "Section 137, Companies Act 2013",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Filing of financial statements (AOC-4).",
    },
    {
      name: "Section 164(2), Companies Act 2013",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Director disqualification provisions.",
    },
  ],
};
