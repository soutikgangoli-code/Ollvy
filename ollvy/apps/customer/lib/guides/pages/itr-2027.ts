// =============================================================================
// GUIDE PAGE: itr-2027
// File path: lib/guides/pages/itr-2027.ts
// Authored fresh covering ITR filing for FY 2026-27 (AY 2027-28), the first
// ITR year fully governed by the Income Tax Act 2025.
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const itr2027: LearnPageConfig = {
  slug: "itr-2027",
  title: "ITR Filing for FY 2026-27: First Full Year Under Income Tax Act 2025",
  seoTitle: "ITR Filing 2027 | Tax Year 2026-27 | Income Tax Act 2025 | Ollvy",
  seoDescription:
    "First ITR fully under the Income Tax Act 2025. Tax Year 2026-27, staggered deadlines, renumbered sections (139 to 263, 234F to 426), expanded HRA cities, new PAN rules, revised forms.",
  canonicalUrl: "https://www.ollvy.com/guides/itr-2027",
  lastReviewed: "May 2026",
  category: "Tax",
  relatedServiceSlugs: ["itr-filing", "tax-audit", "advance-tax-payment"],
  relatedLearnSlugs: ["itr-2026", "advance-tax-explained", "tds-on-rent-194i-194ib"],
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "WHY THIS YEAR IS DIFFERENT",
      body:
        "The Income Tax Act 2025 came into force on 1 April 2026 and applies to income earned from 1 April 2026 onwards. So FY 2026-27 (which the new Act calls Tax Year 2026-27) is the first full year governed by the new framework. Your ITR for this year, filed in 2027, will be the first one filed entirely under the 2025 Act. The big changes are not in the tax rates (slabs are unchanged for the new regime) but in the language, the section numbers, the PAN reporting expansions, the HRA rules, and the form numbers.",
    },
    {
      id: "02",
      heading: "ASSESSMENT YEAR vs TAX YEAR",
      body:
        "The 2025 Act replaces 'Previous Year' and 'Assessment Year' with a single concept: Tax Year. Tax Year 2026-27 is the year in which income is earned (1 April 2026 to 31 March 2027), and the ITR for it is filed in 2027. This simplifies what historically confused first-time filers, who had to track 'AY 2027-28' and 'FY 2026-27' as different labels for the same period.",
      note:
        "On the e-filing portal, you may still see both labels during the transition. CBDT's interface uses 'Tax Year' going forward, but legacy notices and some screens reference both formats.",
    },
    {
      id: "03",
      heading: "WHO HAS TO FILE FOR TAX YEAR 2026-27",
      body:
        "The basic obligation is unchanged: file if your gross total income is above the basic exemption limit (Rs 4 lakh under the default new regime) or if any compulsory filing trigger applies. The triggers (PAN deposits, foreign travel, electricity bills, business turnover thresholds) have been retained in the 2025 Act with renumbered references but identical figures.",
      bullets: [
        "Income above the basic exemption limit (Rs 4 lakh new regime, Rs 2.5 lakh old regime).",
        "TDS / TCS aggregating Rs 25,000 or more.",
        "Deposits Rs 1 crore or more in current accounts; Rs 50 lakh or more in savings accounts.",
        "Foreign travel above Rs 2 lakh; electricity bills above Rs 1 lakh.",
        "Business turnover above Rs 60 lakh; professional receipts above Rs 10 lakh.",
        "Foreign asset holding (mandatory ITR-2 / ITR-3 with Schedule FA disclosure).",
      ],
    },
    {
      id: "04",
      heading: "STAGGERED DEADLINES CONTINUE",
      body:
        "The Budget 2026 staggered ITR deadline structure continues for Tax Year 2026-27.",
      table: {
        headers: ["Filer", "Form", "Due Date Tax Year 2026-27"],
        rows: [
          ["Salaried, capital gains, no business", "ITR-1 / ITR-2", "31 July 2027"],
          ["Business / professional non-audit", "ITR-3 / ITR-4", "31 August 2027"],
          ["Business / professional with audit", "ITR-3 / ITR-4 / ITR-5", "31 October 2027 (audit report by 30 September 2027)"],
          ["With international transactions / TP audit", "Any business form", "30 November 2027"],
          ["Belated return", "Any form", "31 December 2027"],
          ["Revised return", "Any form", "31 March 2028 (Section 234I fee from 1 January 2028)"],
        ],
      },
    },
    {
      id: "05",
      heading: "KEY SECTION NUMBER MAPPINGS",
      body:
        "For taxpayers familiar with the 1961 Act, here are the most common sections you'll encounter on your TY 2026-27 ITR.",
      table: {
        headers: ["Old (1961 Act)", "New (IT Act 2025)", "Topic"],
        rows: [
          ["Section 139(1)", "Section 263(1)", "Filing of ITR"],
          ["Section 139(4)", "Section 263(4)", "Belated return"],
          ["Section 139(5)", "Section 263(5)", "Revised return"],
          ["Section 234F", "Section 426", "Late filing fee"],
          ["Section 234A", "Section 423", "Interest on unpaid tax"],
          ["Section 234I (Budget 2026)", "Section 426A", "Revised return fee"],
          ["Section 87A (rebate)", "Section 156", "Rebate up to Rs 60,000"],
          ["Section 80C (deductions)", "Section 124", "Specified investments"],
          ["Section 44AB (tax audit)", "Section 63", "Audit threshold"],
          ["Section 44AD (presumptive)", "Section 60", "Small business deemed profit"],
        ],
      },
      note:
        "CBDT's section mapping utility on the e-filing portal lets you look up any 1961 Act section to find the 2025 Act equivalent. The mapping is one-to-one for most sections; a few (the 194 series) consolidated under a single new section.",
    },
    {
      id: "06",
      heading: "SLABS, REBATE, STANDARD DEDUCTION (UNCHANGED FROM FY 2025-26)",
      body:
        "Budget 2026 made no changes to personal income tax slabs or the Section 87A rebate. So the FY 2025-26 structure carries forward.",
      table: {
        headers: ["Slab (New Regime, default)", "Rate"],
        rows: [
          ["Up to Rs 4 lakh", "Nil"],
          ["Rs 4 lakh to Rs 8 lakh", "5%"],
          ["Rs 8 lakh to Rs 12 lakh", "10%"],
          ["Rs 12 lakh to Rs 16 lakh", "15%"],
          ["Rs 16 lakh to Rs 20 lakh", "20%"],
          ["Rs 20 lakh to Rs 24 lakh", "25%"],
          ["Above Rs 24 lakh", "30%"],
        ],
      },
      note:
        "Rs 60,000 Section 87A rebate (now Section 156) takes total tax to nil for income up to Rs 12 lakh. Rs 75,000 standard deduction for salaried filers takes effective tax-free salary income to Rs 12.75 lakh. The old regime continues unchanged with its own slabs and full deduction set.",
    },
    {
      id: "07",
      heading: "WHAT'S GENUINELY NEW FOR TY 2026-27",
      body:
        "Beyond renumbering, a handful of substantive changes apply to Tax Year 2026-27 filings.",
      bullets: [
        "HRA exemption expanded: 50% HRA exemption now applies in 8 cities (added Bengaluru, Pune, Hyderabad, Ahmedabad to the original 4 metros). You also need to declare your relationship with the landlord.",
        "PAN reporting expansion: PAN now mandatory for motor vehicle purchases above Rs 5 lakh (including 2-wheelers above threshold), property deals above Rs 20 lakh, hotel bills above Rs 1 lakh.",
        "Form renumbering: Form 16 becomes Form 130. Form 26AS becomes Form 168. Forms 15G and 15H merged into Form 121.",
        "Section 9(5) buyback taxation: Share buyback proceeds taxed as capital gains in shareholder's hands (was earlier taxed as deemed dividend at slab rates; now LTCG / STCG depending on holding).",
        "Updated return (ITR-U): Available even after reassessment notice, on payment of tax + interest + 10% additional charge.",
        "Updated return for losses: Allowed even if original return was a loss return, provided ITR-U reduces the loss.",
      ],
    },
    {
      id: "08",
      heading: "PENALTIES FOR LATE FILING",
      body:
        "Same structure as FY 2025-26 with renumbered sections.",
      table: {
        headers: ["Trigger", "Section (IT Act 2025)", "Amount"],
        rows: [
          ["Late filing fee (income above Rs 5L)", "Section 426 (was 234F)", "Rs 5,000"],
          ["Late filing fee (income up to Rs 5L)", "Section 426 (was 234F)", "Rs 1,000"],
          ["Interest on unpaid tax", "Section 423 (was 234A)", "1% per month"],
          ["Revised return fee (filed after 31 December)", "Section 426A (was 234I)", "Rs 5,000 / Rs 1,000"],
          ["Loss carry-forward", "Section 159 (was 80)", "Forfeited if return is late"],
        ],
      },
    },
    {
      id: "09",
      heading: "WHAT TO DO BEFORE 31 JULY 2027",
      body:
        "If you're a salaried filer, your prep is essentially the same as previous years, with two additions specific to TY 2026-27.",
      bullets: [
        "Form 130 (was Form 16) from every employer in TY 2026-27.",
        "Form 168 (was Form 26AS) and AIS / TIS reconciled against Form 130.",
        "Capital gains statements with the new buyback treatment (capital gains, not deemed dividend).",
        "If claiming HRA in Bengaluru, Pune, Hyderabad, or Ahmedabad: rent agreement, rent receipts, and disclosure of relationship with landlord.",
        "Bank interest certificates, foreign asset disclosures, Section 80C / 80D / HRA proofs (if old regime).",
        "Aadhaar (linked to PAN), bank account for refund, mobile / email verified on portal.",
      ],
    },
  ],
  faqs: [
    {
      q: "Will the new sections appear on my ITR forms?",
      a: "Yes. The ITR forms for Tax Year 2026-27 reference the 2025 Act sections directly. So you'll see Section 426 instead of 234F, Section 156 instead of 87A, Section 124 instead of 80C, and so on. The portal's tax computation engine has been updated to match.",
    },
    {
      q: "Are tax rates higher under the new Act?",
      a: "No. Budget 2026 made no changes to slab rates, the Section 87A rebate amount, or the standard deduction. Tax Year 2026-27 has the same rates as FY 2025-26: Rs 4L exempt, slabs from 5% to 30%, Rs 60,000 rebate up to Rs 12 lakh income.",
    },
    {
      q: "Do I file ITR forms with old or new section numbers?",
      a: "New section numbers. CBDT has clarified that Tax Year 2026-27 returns use the IT Act 2025 references. The 1961 Act continues to govern returns for tax years before 1 April 2026 (so FY 2025-26 ITR filed in 2026 uses old numbers, but FY 2026-27 ITR filed in 2027 uses new numbers).",
    },
    {
      q: "What's the Form 130 / Form 168 thing?",
      a: "Form 16 (your salary TDS certificate) was renumbered to Form 130 by Income Tax Rules 2026. Form 26AS (annual tax credit statement) became Form 168. Functionally they're identical. Employers issuing for TY 2026-27 will use the new form numbers. Old Form 16s for FY 2025-26 and earlier remain valid in the original numbering.",
    },
    {
      q: "Do I need to do anything different if I claim HRA in Bengaluru or Pune?",
      a: "Yes, two things. First, you can now claim 50% HRA exemption (was 40% earlier for these cities). Second, you must disclose your relationship with the landlord on the ITR. This was added to prevent fake HRA claims to family members. If your landlord is a parent or spouse, the rent agreement and rent receipts need stronger documentation.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Full text of the Income Tax Act 2025, replacing the 1961 Act for tax years from 1 April 2026.",
    },
    {
      name: "Income Tax Rules 2026",
      url: "https://www.incometaxindia.gov.in/Pages/rules/income-tax-rules.aspx",
      description: "New rules effective 1 April 2026 introducing renumbered forms (Form 130, 168, 121) and expanded PAN reporting requirements.",
    },
    {
      name: "CBDT Section Mapping Utility",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Official mapping between 1961 Act and 2025 Act sections.",
    },
    {
      name: "Union Budget 2026 announcements",
      url: "https://www.indiabudget.gov.in/",
      description: "Confirmation that personal tax slabs and rebates are unchanged; staggered ITR deadlines continue; HRA expansion and buyback taxation changes effective TY 2026-27.",
    },
    {
      name: "Income Tax Department: Tax Year FAQ",
      url: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-tax-returns",
      description: "Official guidance on the Tax Year concept replacing Assessment Year and Previous Year.",
    },
  ],
};
