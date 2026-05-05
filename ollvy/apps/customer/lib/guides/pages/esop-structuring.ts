// =============================================================================
// GUIDE PAGE: esop-structuring
// File path: lib/guides/pages/esop-structuring.ts
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const esopStructuring: LearnPageConfig = {
  slug: "esop-structuring",
  title: "ESOP Structuring for Indian Startups: Pool Size, Vesting, Tax",
  seoTitle: "ESOP Guide India 2026 | Pool Sizing, Vesting, Tax Treatment | Ollvy",
  seoDescription:
    "Plain-English guide to setting up an ESOP plan for your Indian startup. Pool sizing benchmarks, vesting schedules, Section 17(2) tax timing, FMV, exercise mechanics. Drafted by Ollvy.",
  canonicalUrl: "https://www.ollvy.com/guides/esop-structuring",
  lastReviewed: "May 2026",
  category: "Compliance",
  relatedServiceSlugs: ["esop-structuring", "private-limited-incorporation"],
  relatedLearnSlugs: ["advance-tax-explained", "mca-annual-filing-aoc-4-mgt-7"],
  ctaServiceSlug: "pvt-ltd-incorporation",
  ctaSecondarySlug: "llp-incorporation",
  sections: [
    {
      id: "01",
      heading: "WHAT AN ESOP ACTUALLY IS",
      body:
        "An ESOP, short for Employee Stock Option Plan, is a contract that gives your employee the right to buy a fixed number of your company's shares at a fixed price after they've stuck around for a set period. Three things matter: the number of options granted, the strike price (what they'll pay to convert options into shares), and the vesting schedule (when those options actually become theirs). Until an option is exercised, the employee owns nothing. They just have a promise. That's why a well-drafted ESOP scheme isn't paperwork, it's the legal instrument that decides whether your team actually walks away with wealth when you exit.",
    },
    {
      id: "02",
      heading: "HOW BIG SHOULD YOUR ESOP POOL BE",
      body:
        "Pool size is the percentage of your company's fully-diluted equity reserved for employee grants. There's no legal cap. Indian VCs typically expect founders to carve out a pool before the priced round closes (so the dilution hits founders, not investors). Common ranges:",
      bullets: [
        "Pre-seed/idea stage: 5 to 7 percent. Enough for two or three early hires.",
        "Seed stage: 8 to 12 percent. Standard ask from institutional investors.",
        "Series A onwards: 10 to 15 percent, with top-ups at each round.",
      ],
      note:
        "Don't size the pool by gut feel. Build a hiring plan for the next 18 to 24 months, decide the option grant for each role (typical: 0.1 to 1 percent for senior IC, 1 to 5 percent for VP/CXO, 5 to 15 percent for a co-founder-level COO/CTO joining post-incorporation), then add a 20 percent buffer for refreshers and unexpected hires.",
    },
    {
      id: "03",
      heading: "VESTING: HOW EMPLOYEES EARN THEIR OPTIONS",
      body:
        "Vesting is the schedule that converts a grant into actually-earned options. The Indian startup default, copied from Silicon Valley, is a 4-year vest with a 1-year cliff and monthly vesting after that. In practical terms: nothing vests in year one. On day 366, the employee gets 25 percent of their grant in one shot. From month 13 to month 48, the remaining 75 percent vests in equal monthly slices. The cliff exists to protect you from someone leaving in month 9 with a chunk of equity. The 4-year horizon exists to align incentives with a typical investor exit timeline.",
      table: {
        headers: ["Vesting Variant", "When To Use", "Trade-off"],
        rows: [
          ["4 yr / 1 yr cliff / monthly", "Default for almost all hires", "Boring, but everyone understands it"],
          ["3 yr / 1 yr cliff / monthly", "Senior leaders you want long-term but not 4 years", "Faster wealth, weaker retention in years 3 to 4"],
          ["4 yr / 6 mo cliff / monthly", "Trusted hires, earlier joiners", "Less protection if they leave fast"],
          ["Performance vesting (revenue/milestone)", "Sales leaders, founding GM hires", "Hard to administer, easy to dispute"],
        ],
      },
    },
    {
      id: "04",
      heading: "STRIKE PRICE AND FAIR MARKET VALUE",
      body:
        "Strike price is what an employee pays to convert vested options into shares. In India, you can't just pick any number. Section 62(1)(b) of the Companies Act and Rule 12 of the Companies (Share Capital and Debentures) Rules 2014 require the price to be at or above face value. For tax purposes, the difference between Fair Market Value (FMV) on the exercise date and the strike price is taxed as salary perquisite under Section 17(2)(vi) of the Income Tax Act. So if your strike is Rs 10 and FMV at exercise is Rs 1,000, the employee pays tax on Rs 990 per share as salary income. A registered valuer must determine FMV using the merchant banker method or a Category I merchant banker for unlisted companies. Many startups set strike at face value (Rs 10 or Re 1) for early employees and bump it up at later stages to reflect the higher 409A-equivalent valuation.",
    },
    {
      id: "05",
      heading: "TAX: THE TWO MOMENTS THAT MATTER",
      body:
        "ESOPs trigger tax twice in the employee's life, and one of them used to bankrupt people before the 2020 amendment.",
      bullets: [
        "At exercise: (FMV minus strike price) is taxed as salary under Section 17(2)(vi) of the IT Act 1961 (corresponding provision under IT Act 2025 from April 2026 onwards). Your company deducts TDS at the slab rate. Eligible startups (defined as both DPIIT-recognised AND certified under Section 80-IAC by the Inter-Ministerial Board) can defer this tax under Section 192(1C). Important: only about 4,000 of the 1.97 lakh+ DPIIT-recognised startups have IMB 80-IAC certification, so most early-stage startups don't qualify. The Budget 2026 expansion to all DPIIT startups was discussed but not enacted.",
        "Deferral mechanics: TDS gets pushed to the earliest of (a) sale of shares, (b) cessation of employment, or (c) 48 months from the end of the assessment year of allotment for shares allotted on or before 31 March 2026. For shares allotted on or after 1 April 2026, the IT Act 2025 extends the window to 60 months from the end of the relevant tax year.",
        "At sale: The gain over FMV-at-exercise is capital gains. Long-term (held over 24 months for unlisted, over 12 for listed) is taxed at 12.5 percent under the post-July 2024 LTCG regime. Short-term is at slab rates for unlisted, 20 percent for listed.",
      ],
      note:
        "For startups that don't qualify under Section 80-IAC (the vast majority of DPIIT companies), the exercise-date tax bill can be brutal. An employee exercising Rs 50L worth of options has to pay roughly Rs 15L in cash to the tax department, with no ability to sell shares to fund it. Most Indian employees in non-IMB-certified startups end up not exercising. Solve this by either obtaining IMB 80-IAC certification (separate from DPIIT recognition, more rigorous), offering buybacks, or structuring exercise to coincide with secondary opportunities.",
    },
    {
      id: "06",
      heading: "EXERCISE WINDOWS AND WHAT HAPPENS WHEN PEOPLE LEAVE",
      body:
        "When an employee leaves, vested options don't vest further but they don't automatically vanish either. Your ESOP scheme defines the post-termination exercise window. Industry standard is 90 days. Some progressive plans (Stripe, Quora-style) extend this to 7 or even 10 years for good leavers, on the logic that 90 days isn't enough time to find Rs 15L of cash to exercise. Whatever you pick, document it clearly. Also define:",
      bullets: [
        "Good leaver vs bad leaver: voluntary resignation in good standing vs termination for cause. Bad leavers typically forfeit even vested options.",
        "Death/disability: usually full acceleration of vested portion, exercise extension for nominee.",
        "Change of control: single-trigger acceleration (vesting accelerates on acquisition) vs double-trigger (acquisition plus subsequent termination).",
      ],
    },
    {
      id: "07",
      heading: "WHAT YOUR ESOP SCHEME DOCUMENT NEEDS TO COVER",
      body:
        "Under the Companies Act, ESOPs require a special resolution at a shareholders' meeting and a formal scheme document. The scheme has to cover total options, vesting conditions, exercise period, lock-in (if any), conditions on lapse, the appraisal/grant process, maximum options per employee per year (over 1 percent needs a separate special resolution), and accounting policy. After the scheme is approved, each grant happens via a grant letter referencing the scheme. Form PAS-3 is filed when shares are actually allotted on exercise.",
    },
    {
      id: "08",
      heading: "COMMON MISTAKES FOUNDERS MAKE",
      body: "What we see when we audit existing ESOP schemes:",
      bullets: [
        "Verbal grants that never made it into a board resolution. Legally these are unenforceable. The employee leaves angry, the founder looks dishonest, and there's no paper to back either side.",
        "No FMV valuation done at exercise. The Income Tax Department can pick whatever value it likes. Get a Cat I merchant banker certificate dated within 180 days of exercise.",
        "Strike price set too low relative to round price. Legal but creates a tax mess at exercise because the perquisite value is huge.",
        "Forgetting to size up the pool before a fundraise. Investors will insist, and the dilution will come from your stake, not theirs.",
        "Treating advisors and contractors with the same scheme as employees. Use a separate Stock Appreciation Rights or warrant structure for non-employees, ESOP rules require an employer-employee relationship.",
      ],
    },
  ],
  faqs: [
    {
      q: "Can I issue ESOPs in an LLP?",
      a: "Not under Section 62 of the Companies Act, that section applies only to companies. LLPs can set up profit-share or partnership-interest schemes that mimic ESOPs economically, but they're not the same instrument and the tax treatment differs. If equity-style upside matters for hiring, convert your LLP to a Pvt Ltd before granting options.",
    },
    {
      q: "What's a sweat equity share and how is it different from an ESOP?",
      a: "Sweat equity shares are issued for non-cash consideration, typically know-how or IP contribution, under Section 54 of the Companies Act. ESOPs are options to buy shares at a fixed price after vesting. Sweat equity is taxed at issuance based on FMV. ESOPs are taxed at exercise. For founders bringing IP at incorporation, sweat equity is the cleaner instrument. For ongoing employee compensation, use ESOPs.",
    },
    {
      q: "Do I need shareholder approval every time I grant options?",
      a: "No. You need a special resolution to approve the overall scheme and the maximum pool size. After that, individual grants happen via board resolution within the approved pool. You only need a fresh special resolution if you increase the pool or grant more than 1 percent of paid-up capital to a single employee in any year.",
    },
    {
      q: "How do I value the company for FMV at exercise?",
      a: "For unlisted companies, FMV must be certified by a Category I merchant banker using a method prescribed under Rule 3(8) of the Income Tax Rules, typically NAV or DCF. The certificate must be dated within 180 days of the exercise date. Listed companies use the average of the high and low quoted price on the exercise date. Plan to spend Rs 75K to 2.5L per valuation depending on the merchant banker.",
    },
    {
      q: "Can I claw back vested options if an employee leaves and joins a competitor?",
      a: "Only if your scheme document explicitly includes a non-compete clawback clause and the employee signed it. Even then, Indian courts enforce non-compete restrictions narrowly post-employment. Most enforceable clawbacks are tied to fraud, breach of confidentiality, or termination for cause. If competitor poaching is a real concern, structure delayed exercise windows or extended cliff vesting instead of relying on clawback.",
    },
  ],
  sources: [
    {
      name: "Companies Act 2013, Section 62(1)(b)",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      description: "Statutory basis for issuing further shares to employees including ESOPs.",
    },
    {
      name: "Companies (Share Capital and Debentures) Rules, 2014, Rule 12",
      url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      description: "Detailed rules for ESOP schemes, special resolution requirements, vesting and pricing.",
    },
    {
      name: "Income Tax Act, Section 17(2)(vi) and Section 192(1C)",
      url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      description: "Taxation of ESOP perquisite at exercise and the deferred TDS regime for eligible startups.",
    },
    {
      name: "DPIIT Recognition + Section 80-IAC Certification",
      url: "https://www.startupindia.gov.in/content/sih/en/startupgov/startup-recognition-page.html",
      description: "Both DPIIT recognition AND Inter-Ministerial Board certification under Section 80-IAC are required to access the ESOP tax deferral. Only ~4,000 of 1.97L+ DPIIT-recognised startups currently hold IMB certification.",
    },
    {
      name: "Income Tax Act 2025, Sections 289 and 392 (ESOP and TDS provisions)",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Renumbered ESOP perquisite and TDS deferral provisions effective April 2026. Deferral window extended from 48 to 60 months for shares allotted on or after 1 April 2026.",
    },
  ],
};
