// =============================================================================
// GUIDE PAGE: pas-6-2026
// File path: lib/guides/pages/pas-6-2026.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const pas62026: LearnPageConfig = {
  slug: "pas-6-2026",
  title: "PAS-6 for Apr-Sep 2026: The Share Capital Audit Report Most Private Companies Now Owe",
  seoTitle: "PAS-6 Due 29 Nov 2026 | Share Capital Audit Report | Ollvy",
  seoDescription:
    "PAS-6 for Apr-Sep 2026 is due 29 November 2026. Most non-small private companies must now file. Section 450 penalty: Rs 10,000 plus Rs 1,000/day if you miss it.",
  canonicalUrl: "https://www.ollvy.com/guides/pas-6-2026",
  lastReviewed: "July 2026",
  category: "ROC Filing",
  relatedServiceSlugs: ["mca-annual-filing", "pvt-ltd-incorporation", "company-name-change"],
  relatedLearnSlugs: ["mca-annual-filing-aoc-4-mgt-7", "mgt-7-2026", "agm-compliance", "ccfs-2026", "adt-1-2026", "iepf-claim"],
  ctaServiceSlug: "mca-annual-filing",
  tool: {
    type: "eligibility",
    title: "Does PAS-6 apply to your company?",
    questions: [
      {
        text: "What type of company is it?",
        options: [
          { value: "private", label: "Private limited company" },
          { value: "unlisted_public", label: "Unlisted public company" },
          { value: "listed", label: "Listed company" },
          { value: "llp_other", label: "LLP or other entity" },
        ],
        exitOn: {
          unlisted_public: {
            type: "mandatory",
            headline: "In scope since FY 2019-20 - PAS-6 due 29 November 2026.",
            body:
              "Unlisted public companies have filed PAS-6 under Rule 9A since it began. For the April-September 2026 half-year, the form is due 60 days from 30 September - one PAS-6 per ISIN, certified by a practising CS or CA. Missing it means Section 450 penalties (Rs 10,000 plus Rs 1,000/day) and a block on issuing or allotting securities.",
            ctaLabel: "Get PAS-6 filed",
            ctaHref: "/checkout/mca-annual-filing",
          },
          listed: {
            type: "not_required",
            headline: "Listed companies reconcile under the SEBI regime, not PAS-6.",
            body:
              "Your share capital reconciliation runs through the quarterly reconciliation of share capital audit report filed with the stock exchanges under SEBI regulations. PAS-6 under Rules 9A/9B is the unlisted-company counterpart of that same reconciliation.",
          },
          llp_other: {
            type: "not_required",
            headline: "PAS-6 does not apply - it is a share-capital form.",
            body:
              "LLPs have no share capital and no demat mandate, so there is nothing to reconcile. LLP annual compliance is Form 11 (due 30 May) and Form 8 (due 30 October) - a different calendar with its own late fees.",
          },
        },
      },
      {
        text: "Is it a small company - paid-up capital up to Rs 4 crore AND turnover up to Rs 40 crore?",
        options: [
          { value: "small", label: "Yes - within both limits, and not a holding or subsidiary" },
          { value: "not_small", label: "No - crosses either limit" },
          { value: "holding_sub", label: "Within the limits, but it is a holding or subsidiary company" },
        ],
        exitOn: {
          small: {
            type: "not_required",
            headline: "Exempt - for now.",
            body:
              "Genuine small companies sit outside the Rule 9B demat mandate and PAS-6. Two ways to lose the shelter: crossing Rs 4 crore paid-up capital or Rs 40 crore turnover (18 months to dematerialise from that financial year's close), or becoming a holding or subsidiary company, which defeats the exemption regardless of size. And if you voluntarily obtained an ISIN, the PAS-6 obligation follows the ISIN anyway.",
          },
        },
      },
      {
        text: "Are the company's shares dematerialised (ISIN live with NSDL/CDSL)?",
        options: [
          { value: "demat_done", label: "Yes - ISIN active" },
          { value: "in_progress", label: "In progress" },
          { value: "not_started", label: "No - still fully physical, no ISIN" },
        ],
      },
    ],
    resultRules: [
      {
        if: [{ q: 2, anyOf: ["not_started"] }],
        result: {
          type: "mandatory",
          headline: "Urgent - you are past the demat mandate and your cap table is frozen.",
          body:
            "The demat mandate for non-small private companies took effect 30 June 2025. In breach of Rule 9B, the company cannot issue or allot securities and holders cannot transfer shares - a funding round, ESOP allotment or secondary sale stalls on exactly this. ISIN admission (RTA appointment, depository admission) takes 3-6 weeks, and it must finish before your first PAS-6 can be filed for the half-year due 29 November 2026. Section 450 exposure runs at Rs 10,000 plus Rs 1,000/day meanwhile.",
          ctaLabel: "Start demat and PAS-6 now",
          ctaHref: "/checkout/mca-annual-filing",
        },
      },
      {
        if: [{ q: 2, anyOf: ["in_progress"] }],
        result: {
          type: "conditional",
          headline: "In scope - finish demat, then file PAS-6 by 29 November 2026.",
          body:
            "Once the ISIN is live, PAS-6 becomes a permanent half-yearly obligation (60 days from 30 September and 31 March). For the first filing: request the 30 September beneficiary position from your RTA in early October, and book a certifying PCS/CA well before the November crunch - AOC-4 and MGT-7 land in the same window. A form showing mostly physical holdings is fine; skipping the filing is what converts a lagging-demat problem into a Section 450 penalty.",
          ctaLabel: "Plan the first PAS-6",
          ctaHref: "/checkout/mca-annual-filing",
        },
      },
      {
        if: [{ q: 2, anyOf: ["demat_done"] }],
        result: {
          type: "mandatory",
          headline: "In scope - PAS-6 for Apr-Sep 2026 is due 29 November 2026.",
          body:
            "One PAS-6 per ISIN, every half-year, certified by a practising CS or CA (typically Rs 10,000-25,000 per filing). It reconciles issued capital against NSDL/CDSL holdings plus physical shares, and flags demat requests pending beyond 21 days. Missing it costs Rs 10,000 plus Rs 1,000/day (Section 450, capped at Rs 2 lakh for the company) - and a missing PAS-6 trail is now a standard investor-diligence red flag.",
          ctaLabel: "Get PAS-6 filed",
          ctaHref: "/checkout/mca-annual-filing",
        },
      },
    ],
    defaultResult: {
      type: "conditional",
      headline: "Run the small-company test - that decides it.",
      body:
        "Paid-up capital up to Rs 4 crore AND turnover up to Rs 40 crore, and not a holding or subsidiary company: exempt. Anything else: the Rule 9B demat mandate applies and PAS-6 for Apr-Sep 2026 is due 29 November 2026, per ISIN, certified by a practising CS or CA.",
      ctaLabel: "Check with an Ollvy CS",
      ctaHref: "/checkout/mca-annual-filing",
    },
  },
  sections: [
    {
      id: "01",
      heading: "WHAT PAS-6 IS AND WHY IT NOW APPLIES TO YOUR PRIVATE COMPANY",
      body:
        "PAS-6 is the half-yearly Reconciliation of Share Capital Audit Report, certified by a practising CS or CA, that reconciles a company's issued capital with the shares actually held in demat form with the depositories. For the half-year April to September 2026, it is due by 29 November 2026 (60 days from 30 September), under Rule 9B read with Rule 9A of the Companies (Prospectus and Allotment of Securities) Rules 2014.\n\nThe reason this suddenly matters to private companies: the demat mandate for non-small private companies took effect on 30 June 2025. Once a company's securities carry an ISIN, the PAS-6 obligation follows automatically, which puts lakhs of private companies into their first full AGM-season PAS-6 cycle this half-year. Most of them have never filed the form and many do not know it exists.",
    },
    {
      id: "02",
      heading: "WHO HAS TO FILE FOR THE APR-SEP 2026 HALF-YEAR",
      body: "",
      bullets: [
        "Unlisted public companies: in scope since Rule 9A (FY 2019-20 onwards); nothing new for them.",
        "Private companies that are not small companies: in scope via Rule 9B after the 30 June 2025 demat mandate. A company is outside the 'small company' shelter if paid-up capital exceeds Rs 4 crore or turnover exceeds Rs 40 crore (or it is a holding/subsidiary company, which loses small-company status regardless of size).",
        "Any private company that has actually obtained an ISIN and admitted securities to a depository, even if it dematerialised early or voluntarily.",
        "Out of scope: genuine small companies (until they cross the thresholds), government companies as exempted, and companies with no ISIN and no Rule 9B obligation.",
      ],
      note:
        "Holding and subsidiary companies are the trap: a Rs 1 lakh capital subsidiary of any other company is not a 'small company' and is therefore inside the demat mandate and PAS-6 net.",
    },
    {
      id: "03",
      heading: "THE DEADLINE ARITHMETIC",
      body:
        "PAS-6 runs on half-years with a 60-day filing window from the end of each half-year.",
      table: {
        headers: ["Half-year", "Period end", "PAS-6 due date"],
        rows: [
          ["H1 FY 2026-27", "30 September 2026", "29 November 2026"],
          ["H2 FY 2026-27", "31 March 2027", "30 May 2027"],
        ],
      },
      note:
        "The obligation is per ISIN: a company with separate ISINs for equity and preference shares files a PAS-6 for each ISIN, each half-year.",
    },
    {
      id: "04",
      heading: "WHAT THE FORM ACTUALLY RECONCILES",
      body:
        "PAS-6 is a numbers form. It reconciles issued capital against the sum of shares held in demat (NSDL plus CDSL) and shares still in physical form, and flags the gaps.",
      bullets: [
        "Issued capital vs total of demat and physical holdings, per ISIN, as at the half-year end.",
        "Changes during the half-year: fresh issues, buybacks, and their demat status.",
        "Shares held by promoters, directors and KMP, and whether those are fully dematerialised (Rule 9B requires promoter/director/KMP holdings to be demat before any fresh issue or buyback).",
        "Details of demat requests pending beyond 21 days and reasons.",
        "Certification by a practising Company Secretary or practising Chartered Accountant, with their membership details.",
      ],
    },
    {
      id: "05",
      heading: "WHAT YOU NEED IN PLACE BEFORE THE FORM CAN BE FILED",
      body:
        "For first-time filers, the form itself is the last 10% of the work. The dependencies are the other 90%.",
      bullets: [
        "ISIN: if the company has not yet admitted its securities to NSDL or CDSL, that process (RTA appointment, admission, ISIN activation) takes 3-6 weeks and must finish before any reconciliation is possible.",
        "RTA data: the half-yearly beneficiary position and reconciliation statement come from your Registrar and Transfer Agent; request it early in October, not mid-November.",
        "A PCS or PCA engagement: the certifying professional needs the register of members, depository statements and capital history, and reputable professionals get booked out in the November crunch.",
        "Clean capital records: if issued capital per MCA records does not match your register (old allotments not filed, forfeited shares hanging), the mismatch surfaces in PAS-6 and must be explained or fixed first.",
      ],
    },
    {
      id: "06",
      heading: "PENALTY FOR NOT FILING: SECTION 450 PLUS A FROZEN CAP TABLE",
      body:
        "PAS-6 has no dedicated penalty provision, so default falls under Section 450 of the Companies Act, the general penalty clause, plus the operational consequences built into the demat rules.",
      bullets: [
        "Section 450: Rs 10,000 on the company and every officer in default, plus Rs 1,000 per day for continuing default, capped at Rs 2 lakh for the company and Rs 50,000 per officer.",
        "The operational bite: a company in breach of Rule 9B cannot issue or allot securities, and holders who have not dematerialised cannot transfer or subscribe. A funding round, ESOP allotment or secondary transfer stalls on exactly this.",
        "Late filing also attracts additional MCA fees on the form itself, which grow with the delay.",
        "In diligence, a missing PAS-6 trail is now a standard red-flag item for investors' counsel, because it signals the demat mandate was missed wholesale.",
      ],
    },
    {
      id: "07",
      heading: "FIRST-TIME FILER TIMELINE: WORKING BACK FROM 29 NOVEMBER",
      body: "",
      bullets: [
        "July-August 2026: confirm applicability (small-company test, holding/subsidiary status), and if no ISIN exists, start depository admission now; this is the long pole.",
        "Early October 2026: request the 30 September beneficiary position and reconciliation data from the RTA and depositories.",
        "October 2026: engage the certifying PCS/CA, hand over the register of members and capital history, resolve mismatches.",
        "By mid-November 2026: form certified and filed on MCA-21, keeping a buffer for portal load and resubmission remarks.",
        "29 November 2026: statutory deadline. AGM-season filings (AOC-4, MGT-7) land in the same window, so do not plan on professional availability in the final week.",
      ],
    },
    {
      id: "08",
      heading: "PAS-6 VS THE REST OF YOUR ANNUAL FILING STACK",
      body:
        "PAS-6 is easy to lose among the year-end forms because it follows a different calendar and a different logic.",
      table: {
        headers: ["Form", "What it covers", "Frequency", "Certified by"],
        rows: [
          ["PAS-6", "Share capital vs demat reconciliation", "Half-yearly (60 days from 30 Sep / 31 Mar)", "PCS or PCA"],
          ["AOC-4", "Financial statements", "Annual (30 days from AGM)", "Auditor-linked"],
          ["MGT-7/7A", "Annual return, shareholding", "Annual (60 days from AGM)", "Company / PCS"],
          ["ADT-1", "Auditor appointment", "15 days from AGM", "Company"],
        ],
      },
      note:
        "MGT-7 shareholding data and PAS-6 demat data describe the same capital from different angles; Registrars cross-check them, so inconsistencies between the two forms invite queries.",
    },
    {
      id: "09",
      heading: "COMMON FIRST-YEAR MISTAKES",
      body: "",
      bullets: [
        "Assuming 'private company' means exempt: the small-company test, not the private label, decides Rule 9B applicability, and holding/subsidiary status defeats the exemption entirely.",
        "Waiting for the AGM: PAS-6 is not AGM-linked; the 29 November date applies whether or not the AGM has happened.",
        "Filing one form for two ISINs: each ISIN needs its own PAS-6.",
        "Treating it as a one-time filing: it recurs every half-year from now on; put 30 May and 29 November into the permanent compliance calendar.",
        "Leaving promoter holdings in physical form: it blocks fresh issues and shows up in the form; dematerialising promoter/director holdings is a precondition worth clearing this half-year.",
      ],
    },
  ],
  faqs: [
    {
      q: "Our private company has Rs 1 crore paid-up capital and Rs 12 crore turnover. Do we file PAS-6?",
      a: "On those numbers alone, no: you are within the small-company thresholds (paid-up capital up to Rs 4 crore and turnover up to Rs 40 crore), so the Rule 9B demat mandate and PAS-6 do not apply yet. But check two overrides: if the company is a holding or subsidiary of another company, small-company status is lost regardless of size; and if you have voluntarily obtained an ISIN, the reconciliation obligation follows the ISIN.",
    },
    {
      q: "We crossed Rs 40 crore turnover in FY 2025-26. When does PAS-6 start for us?",
      a: "Losing small-company status pulls you into Rule 9B, which gives a window (18 months from the close of the financial year in which you crossed the threshold) to complete dematerialisation. The PAS-6 obligation follows once your securities are admitted with an ISIN. Practically: start depository admission now, and plan for your first PAS-6 at the first half-year end after your ISIN is live rather than waiting out the full window.",
    },
    {
      q: "We have an ISIN but zero shares have actually been dematerialised. Do we still file?",
      a: "Yes. The reconciliation is between issued capital, demat holdings and physical holdings; a form showing 100% physical holdings is exactly what PAS-6 is designed to surface. Skipping the filing because the demat column is zero converts a lagging-demat problem into a Section 450 penalty problem as well. File, and use the form's own fields to show the dematerialisation status honestly.",
    },
    {
      q: "Who can certify PAS-6, and what does it typically cost?",
      a: "A practising Company Secretary or practising Chartered Accountant. For a private company with a simple cap table, professional fees typically run Rs 10,000-25,000 per half-year including the reconciliation work, on top of RTA charges and nominal MCA filing fees. Complex capital histories (multiple allotments, unfiled old changes) cost more because the mismatches must be resolved before certification.",
    },
    {
      q: "What exactly gets blocked if we miss the 29 November deadline?",
      a: "Two separate things. The penalty track: Section 450 exposure of Rs 10,000 plus Rs 1,000/day continuing (capped at Rs 2 lakh for the company, Rs 50,000 per officer) plus growing additional fees on the late form. The operational track: while the company is in breach of the demat framework, it cannot issue or allot securities, and non-dematerialised holders cannot transfer shares, which stalls funding rounds, ESOP exercises and secondaries at the worst possible moment.",
    },
    {
      q: "Is PAS-6 filed with the ROC or with the depositories?",
      a: "With the ROC, on the MCA-21 portal, as an eForm certified by the PCS/PCA. The inputs come from the depositories (NSDL/CDSL beneficiary positions) and your RTA, but the filing obligation and the penalty for missing it sit under the Companies Act with the MCA.",
    },
    {
      q: "Our first PAS-6 will show a mismatch: issued capital 10,00,000 shares, depository shows 9,80,000, physical 15,000. What now?",
      a: "A 5,000-share gap has a finite set of causes: allotments not admitted to the depository, forfeited or cancelled shares not updated, or RTA records lagging a corporate action. The reconciliation has to identify and explain it before certification; a certifying professional will not sign an unexplained gap. Budget 2-4 weeks to trace it through the register of members and depository records, which is precisely why starting in November is too late.",
    },
    {
      q: "Does CCFS 2026 cover a missed PAS-6?",
      a: "No. The CCFS amnesty running until 31 August 2026 covers AOC-4, MGT-7/7A, ADT-1 and FC forms (plus concessional MSC-1 and STK-2); PAS-6 is not on the list. A pending PAS-6 for an earlier half-year pays normal additional fees and carries Section 450 exposure regardless of the scheme, which is one more reason not to let the first one slip.",
    },
  ],
  sources: [
    {
      name: "Companies (Prospectus and Allotment of Securities) Rules 2014, Rules 9A and 9B",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Demat mandate for unlisted public and non-small private companies, and the PAS-6 reconciliation requirement.",
    },
    {
      name: "MMJC: PAS-6 applicability analysis",
      url: "https://mmjc.in/",
      description: "Practitioner analysis of PAS-6 scope after the private-company demat mandate.",
    },
    {
      name: "ClearTax: Form PAS-6 guide",
      url: "https://cleartax.in/",
      description: "Form contents, due-date arithmetic and filing procedure.",
    },
    {
      name: "Companies Act 2013, Section 450",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "General penalty provision applicable to PAS-6 default.",
    },
  ],
};
