// =============================================================================
// GUIDE PAGE: tds-on-rent-194i-194ib
// File path: lib/guides/pages/tds-on-rent-194i-194ib.ts
// Last reviewed: May 2026 — reflects Finance Act 2025 threshold change and
// the consolidation of TDS sections under Section 393 of Income Tax Act 2025
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const tdsOnRent: LearnPageConfig = {
  slug: "tds-on-rent-194i-194ib",
  title: "TDS on Rent: Section 194-I vs 194-IB Explained (FY 2026-27)",
  seoTitle: "TDS on Rent India 2026-27 | Section 194-I vs 194-IB | Form 26QC | Ollvy",
  seoDescription:
    "When TDS on rent applies, who deducts under 194-I (10%, threshold Rs 50K/month) and who deducts under 194-IB (2%), Form 26QC for individuals, and how the Income Tax Act 2025 maps these to Section 393. Plain English guide by Ollvy.",
  canonicalUrl: "https://www.ollvy.com/guides/tds-on-rent-194i-194ib",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["tds-monthly-compliance"],
  relatedLearnSlugs: ["advance-tax-explained", "tds-on-property-purchase-194ia"],
  ctaServiceSlug: "tds-monthly-compliance",
  sections: [
    {
      id: "01",
      heading: "WHY THERE ARE TWO SEPARATE SECTIONS FOR RENT",
      body:
        "Both Section 194-I and Section 194-IB deal with TDS on rent, but they apply to completely different deductors. The split exists because Parliament wanted businesses (who already file TDS returns every quarter) to handle commercial rent under the regular TDS system, while keeping the compliance burden lighter for ordinary individuals and HUFs paying high residential rent. Get the section wrong and you'll either over-deduct (and have an unhappy landlord) or under-deduct (and face penalty plus interest).",
      note:
        "Important context: From April 1, 2026, the Income Tax Act 2025 has replaced the 1961 Act. All non-salary TDS provisions, including the old 194-I and 194-IB, are now consolidated under a single Section 393 of the new Act, which uses a table-driven structure with serial-numbered entries for each payment type. Salary TDS (the old Section 192) sits separately under Section 392. The substantive rates and thresholds below carry forward unchanged, but if you're filing TDS returns or challans for transactions on or after April 1, 2026, the new Section 393 codes apply. We retain the familiar 194-I and 194-IB labels here for clarity since most CAs and CFOs still use them in practice for transactions up to 31 March 2026.",
    },
    {
      id: "02",
      heading: "SECTION 194-I: FOR BUSINESS DEDUCTORS",
      body:
        "Section 194-I (now under the Section 393 table in the IT Act 2025) applies to anyone other than an individual or HUF, so basically every company, LLP, firm, trust and AOP. It also applies to individuals/HUFs whose books are subject to tax audit under Section 44AB in the previous financial year. If you fall in this bucket and pay rent above the threshold, you deduct TDS at the time of credit to the landlord's account or actual payment, whichever is earlier.",
      table: {
        headers: ["What's Being Rented", "TDS Rate", "Threshold (FY 2026-27)"],
        rows: [
          ["Plant, machinery, equipment", "2%", "Rs 50,000 per month (or part of a month)"],
          ["Land, building, furniture, fittings", "10%", "Rs 50,000 per month (or part of a month)"],
        ],
      },
      note:
        "The threshold was substantially overhauled by Finance Act 2025 with effect from April 1, 2025. Earlier, the rule was Rs 2,40,000 per landlord per year. The new rule looks at the rent for any single month (or part of a month). If rent in any month exceeds Rs 50,000, TDS applies on that month's rent. Practically: Rs 49,999 a month escapes TDS even if the annual total touches Rs 5.99 lakh; Rs 50,001 a month triggers TDS for that month and every subsequent month at that level. If the landlord doesn't have a PAN, the rate jumps to 20 percent under Section 206AA.",
    },
    {
      id: "03",
      heading: "SECTION 194-IB: FOR INDIVIDUAL AND HUF DEDUCTORS",
      body:
        "Section 194-IB was introduced in 2017 to bring high-value residential rent into the tax net without forcing every salaried tenant to obtain a TAN and file quarterly returns. It applies to individuals and HUFs not subject to tax audit who pay rent of Rs 50,000 or more per month for any residential or commercial property. Two important contrasts with 194-I:",
      bullets: [
        "Threshold is monthly (Rs 50K and above), not annual. So Rs 49,999 a month is exempt; Rs 50,000 a month triggers the section.",
        "TDS is deducted only once a year, in the last month of tenancy or last month of the financial year (March), whichever comes first. Not every month.",
        "Rate is 2 percent on the total rent paid for the year. (The earlier 5 percent rate was reduced to 2 percent by Finance (No. 2) Act 2024 with effect from October 1, 2024.)",
        "No TAN required. The tenant uses their own PAN to file Form 26QC.",
      ],
    },
    {
      id: "04",
      heading: "FORM 26QC AND FORM 16C",
      body:
        "If you're an individual tenant deducting under 194-IB, you don't file regular quarterly TDS returns. Instead, you file Form 26QC, a one-time challan-cum-statement, within 30 days from the end of the month in which TDS was deducted. The form takes the landlord's PAN, address, rent amount, period, and TDS deducted. Once filed, you generate Form 16C from the TRACES portal and hand it to your landlord as their TDS certificate. Form 16C is the landlord's proof to claim the TDS credit while filing their return. Miss the 30-day Form 26QC deadline and you owe Rs 200 per day late fee under Section 234E (capped at the TDS amount), plus 1 to 1.5 percent monthly interest under Section 201(1A).",
    },
    {
      id: "05",
      heading: "WHICH SECTION APPLIES TO YOU: A QUICK TEST",
      body:
        "Walk through these in order and stop at the first match:",
      bullets: [
        "You're a company, LLP, partnership firm, trust, or AOP paying rent above Rs 50,000 in any month to one landlord. Apply Section 194-I.",
        "You're an individual or HUF whose business or profession was tax audited last year (turnover over Rs 1Cr business or Rs 50L professional). Apply Section 194-I.",
        "You're an individual or HUF (salaried, freelance, or non-audit business) paying Rs 50,000 or more per month rent. Apply Section 194-IB.",
        "You're an individual or HUF paying less than Rs 50,000 per month. No TDS at all.",
        "Rent goes to a non-resident landlord. Apply Section 195 (now Section 393(2) under IT Act 2025) instead, with rates from the relevant DTAA. Get a CA involved.",
      ],
    },
    {
      id: "06",
      heading: "GST ON RENT INTERACTS WITH TDS",
      body:
        "If your landlord is GST-registered and charges GST on rent, you deduct TDS only on the rent amount, not on the GST component. So Rs 1,00,000 rent plus 18 percent GST means TDS is calculated on Rs 1,00,000, not Rs 1,18,000. This is per CBDT Circular No. 23/2017. Confirm in writing whether the rent quoted is inclusive or exclusive of GST before deducting, otherwise you risk under-deducting.",
    },
    {
      id: "07",
      heading: "PRACTICAL MISTAKES THAT COST FOUNDERS MONEY",
      body:
        "Things we see consistently when we onboard new clients:",
      bullets: [
        "Pvt Ltd companies forgetting to deduct on the office rent for months because the founder is using their personal account to pay until the company opens its bank. Once the company exists, even retroactive payments need TDS.",
        "Quoting old TDS section codes (194I, 194IB) on challans for transactions on or after April 1, 2026. The challan needs the new Section 393 sub-clause codes per the IT Rules 2026. Old codes are treated as defective.",
        "Confusing the Rs 50K monthly threshold (now common to both 194-I and 194-IB) with the old Rs 2.4L annual threshold. The annual rule was retired on April 1, 2025.",
        "Filing 26QC late because the tenant doesn't realize the deduction kicks in by March 31 even if the lease extends into the next year.",
        "Not getting a fresh Form 16C every year, which then breaks the landlord's ITR refund claim.",
        "Paying rent in cash above Rs 20,000 per day, which gets the entire payment disallowed under Section 40A(3) for business deductors.",
      ],
    },
  ],
  faqs: [
    {
      q: "I started paying Rs 60,000 rent from January. Do I deduct TDS for the full year or only from January?",
      a: "Only from January, when the rent crossed Rs 50,000 a month. But the deduction itself happens once, in March (or when you vacate), on the total rent paid from January to March. So if you paid Rs 60K each for Jan, Feb, Mar (Rs 1.8L total), you deduct 2 percent of Rs 1.8L = Rs 3,600 in March and file Form 26QC by April 30.",
    },
    {
      q: "What if the landlord refuses to share their PAN?",
      a: "Under Section 206AA, you must deduct at the higher of (a) the rate prescribed in the section, (b) rates in force, or (c) 20 percent. So 194-IB without PAN means 20 percent TDS, not 2 percent. The landlord then can't claim credit for the TDS while filing their own return. Most landlords share PAN once you explain this.",
    },
    {
      q: "I share an apartment with two roommates and we split Rs 90K rent equally. Does TDS apply?",
      a: "If each tenant is a separate party to the lease and pays Rs 30K a month, no, because each individual's monthly rent is below Rs 50K. But if one of you is the sole tenant on the lease and the others reimburse you, the entire Rs 90K is treated as paid by the sole tenant and 194-IB triggers. Structure the lease as joint tenancy with payment splits documented in the lease itself to avoid this.",
    },
    {
      q: "Has the IT Act 2025 changed the rate or threshold?",
      a: "No. The IT Act 2025 (in force from April 1, 2026) restructures TDS into a single Section 393 with a master table, but the substantive rates and thresholds carry forward unchanged. So 10 percent for land/building, 2 percent for plant/machinery, Rs 50,000 monthly threshold, and 2 percent for individual residential rent over Rs 50K/month all continue. Only the section number on your challan and TDS return changes.",
    },
    {
      q: "Do I deduct TDS on security deposit?",
      a: "No. A genuine refundable security deposit isn't rent and isn't subject to TDS. But if the deposit is a non-refundable advance that's adjusted against future rent, it gets treated as rent paid in advance and TDS applies. Keep the lease language clear, refundable deposits should explicitly say so.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025, Section 393 (with mapping utility)",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Consolidated TDS provisions in force from April 1, 2026, with mapping to old sections 194-I and 194-IB.",
    },
    {
      name: "Finance Act 2025: Section 194-I threshold amendment",
      url: "https://www.indiabudget.gov.in/",
      description: "Statutory change replacing the Rs 2,40,000 annual threshold with Rs 50,000 per month (or part of a month).",
    },
    {
      name: "Finance (No. 2) Act 2024: Section 194-IB rate reduction",
      url: "https://www.indiabudget.gov.in/",
      description: "Reduction of TDS on residential rent under 194-IB from 5% to 2%, effective October 1, 2024.",
    },
    {
      name: "TRACES Portal: Form 26QC and 16C",
      url: "https://www.tdscpc.gov.in/app/login.xhtml",
      description: "Official portal for filing the rent TDS challan-cum-statement and downloading the certificate.",
    },
    {
      name: "CBDT Circular No. 23/2017",
      url: "https://incometaxindia.gov.in/communications/circular/circular23_2017.pdf",
      description: "Clarifies that TDS on rent is computed on the amount excluding GST.",
    },
  ],
};
