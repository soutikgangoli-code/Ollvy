// =============================================================================
// GUIDE PAGE: salaried-itr-2027
// File path: lib/guides/pages/salaried-itr-2027.ts
// Salaried ITR for Tax Year 2026-27, due 31 July 2027. First salaried filing
// season fully under the Income Tax Act 2025 (Form 130, Section 263, Section 392).
// =============================================================================

import type { LearnPageConfig } from "../pages";

export const salariedItr2027: LearnPageConfig = {
  slug: "salaried-itr-2027",
  title: "Salaried ITR for Tax Year 2026-27: Due 31 July 2027",
  seoTitle: "Salaried ITR 2027 | Tax Year 2026-27 Due 31 July | Ollvy",
  seoDescription:
    "Salaried ITR for tax year 2026-27 is due 31 July 2027, the first under the Income-tax Act 2025. Late fee up to Rs 5,000. Check Form 130 before filing.",
  canonicalUrl: "https://www.ollvy.com/guides/salaried-itr-2027",
  lastReviewed: "July 2026",
  category: "Income Tax Filing",
  relatedServiceSlugs: ["business-itr"],
  relatedLearnSlugs: [
    "itr-2027",
    "form-16-is-now-form-130",
    "which-itr-form-should-i-use",
    "belated-itr-2026",
    "income-tax-270-intimation",
  ],
  relatedTools: {
    penaltyCalculators: ["itr-late-filing"],
    documentChecklists: ["individual-itr"],
  },
  ctaServiceSlug: "business-itr",
  sections: [
    {
      id: "01",
      heading: "WHEN IS THE SALARIED ITR DUE AND WHY THIS YEAR IS DIFFERENT",
      body:
        "The ITR for tax year 2026-27 (income earned 1 April 2026 to 31 March 2027) is due 31 July 2027 for salaried filers. This is the first salaried filing season governed entirely by the Income Tax Act 2025, which came into force on 1 April 2026 and replaces the 1961 Act for income earned from that date. The filing obligation itself now sits in Section 263 of the new Act (the successor to Section 139), your salary TDS was deducted under Section 392 (the successor to Section 192), and the certificate your employer gives you is Form 130, not Form 16. The deadline, the slabs, and the late fee amounts are familiar. The paperwork around them has been renumbered.",
    },
    {
      id: "02",
      heading: "TAX YEAR REPLACES PY AND AY",
      body:
        "The 2025 Act drops the Previous Year / Assessment Year split and uses a single label: Tax Year. Tax Year 2026-27 is the year you earned the income (1 April 2026 to 31 March 2027), and the return for it is filed in mid-2027. You no longer need to translate FY 2026-27 into AY 2027-28 on the portal. When you file in June or July 2027, select Tax Year 2026-27.",
      note:
        "Legacy screens and old notices may still show both formats during the transition. Anything relating to FY 2025-26 or earlier stays under the 1961 Act and keeps the AY labels.",
    },
    {
      id: "03",
      heading: "WAIT FOR FORM 130 - YOUR EMPLOYER MUST ISSUE IT BY 15 JUNE 2027",
      body:
        "Form 16 has been renumbered to Form 130 under the Income Tax Rules 2026 forms notification (Form 16A became 131, 16B became 132, 16C became 133). For tax year 2026-27, your employer must issue Form 130 by 15 June 2027. It carries the same two parts: Part A with the TDS deposited against your PAN quarter by quarter, and Part B with the salary break-up, exemptions, deductions, and the regime your employer used for TDS. Do not file before you have Form 130 in hand and have reconciled it against Form 168 (the renumbered Form 26AS) and your AIS. Filing off payslips alone is the single most common cause of TDS-mismatch demands.",
    },
    {
      id: "04",
      heading: "SLABS, REBATE, AND STANDARD DEDUCTION FOR TAX YEAR 2026-27",
      body:
        "Rates are unchanged from FY 2025-26. Under the default new regime, income up to Rs 4 lakh is exempt, and the rebate (Section 156 of the 2025 Act, formerly Section 87A) of up to Rs 60,000 takes total tax to nil for income up to Rs 12 lakh. The Rs 75,000 standard deduction for salaried filers pushes the effective tax-free salary to Rs 12.75 lakh.",
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
        "The old regime continues as an option with its own slabs and the full deduction set (80C-style investments now under Section 124, and others). Your regime choice at filing can differ from what your employer used for TDS.",
    },
    {
      id: "05",
      heading: "HRA FOR TAX YEAR 2026-27: 8 CITIES AT 50%, LANDLORD DISCLOSURE",
      body:
        "Two HRA changes apply to this return if you are on the old regime. First, the 50% HRA exemption band now covers 8 cities: Bengaluru, Pune, Hyderabad, and Ahmedabad joined the original 4 metros (Delhi, Mumbai, Kolkata, Chennai). Second, the ITR asks you to declare your relationship with the landlord, a check aimed at fake rent claims to family members. If you pay rent to a parent or spouse, keep the rent agreement, receipts, and the landlord's ITR trail tight before claiming.",
    },
    {
      id: "06",
      heading: "THE FULL DEADLINE LADDER FOR TAX YEAR 2026-27",
      body:
        "Budget 2026-27 continued the staggered deadline structure, so salaried filers and non-audit businesses no longer share a date.",
      table: {
        headers: ["Filer", "Due Date"],
        rows: [
          ["Salaried / capital gains, no business income", "31 July 2027"],
          ["Business or professional, non-audit", "31 August 2027"],
          ["Business with tax audit", "31 October 2027"],
          ["Belated return (with late fee)", "31 December 2027"],
          ["Revised return", "31 March 2028"],
        ],
      },
      note:
        "If you have even a small freelance or consulting income alongside salary, you may fall in the business category for form selection, but the 31 August date applies only if you file a business-income return. See the business ITR guide for the changed deadline.",
    },
    {
      id: "07",
      heading: "WHAT MISSING 31 JULY 2027 COSTS",
      body:
        "The late fee and interest structure carries forward from the 1961 Act with new section numbers.",
      table: {
        headers: ["Trigger", "Provision (IT Act 2025)", "Amount"],
        rows: [
          ["Late filing fee, income above Rs 5 lakh", "Section 426 (was 234F)", "Rs 5,000"],
          ["Late filing fee, income up to Rs 5 lakh", "Section 426 (was 234F)", "Rs 1,000"],
          ["Interest on unpaid tax from 1 August 2027", "Section 423 (was 234A)", "1% per month or part"],
          ["Loss carry-forward (capital losses)", "Section 159 (was 80)", "Forfeited if return is late"],
        ],
      },
      note:
        "For most salaried filers with full TDS, the interest exposure is small, but the Rs 5,000 fee applies even with zero tax payable if your income is above Rs 5 lakh. Capital loss carry-forward is the silent cost: a Rs 2 lakh equity loss that could offset future gains is gone if you file after the deadline.",
    },
    {
      id: "08",
      heading: "OLD REGIME OR NEW REGIME: DECIDE AT FILING, NOT PANIC IN JULY",
      body:
        "Salaried filers without business income can pick their regime fresh each year at the time of filing, regardless of what they told their employer. The employer's choice only affects TDS during the year; the final liability is settled in the return. Run both computations before filing.",
      bullets: [
        "New regime wins for most filers up to Rs 12.75 lakh salary because tax is nil after the Section 156 rebate and standard deduction.",
        "Old regime can win if your combined deductions (HRA, home loan interest, Section 124 investments, health insurance) are large relative to income.",
        "If your employer deducted TDS on the wrong regime for you, the difference settles as refund or self-assessment tax at filing. It is not locked in.",
        "The regime choice locks per year at filing. A revised return generally cannot flip the regime after the due date.",
      ],
    },
    {
      id: "09",
      heading: "DOCUMENTS TO HAVE READY BEFORE YOU FILE",
      body:
        "The checklist is familiar, with the new form numbers swapped in.",
      bullets: [
        "Form 130 from every employer you worked for during tax year 2026-27 (job switchers need one from each).",
        "Form 168 (renumbered Form 26AS) and AIS / TIS, reconciled line by line against Form 130.",
        "Bank interest certificates and dividend statements; both are pre-filled but verify against AIS.",
        "Capital gains statements from brokers, including the new buyback treatment (buyback proceeds are now capital gains, not deemed dividend).",
        "Rent agreement, receipts, and landlord relationship details if claiming HRA on the old regime.",
        "Section 124 investment proofs, health insurance premiums, home loan interest certificate (old regime only).",
        "PAN linked to Aadhaar, pre-validated bank account for the refund, mobile and email verified on the portal.",
      ],
    },
    {
      id: "10",
      heading: "AFTER YOU FILE: E-VERIFY, THEN WATCH FOR THE SECTION 270(1) INTIMATION",
      body:
        "E-verify within 30 days of filing, or the return is treated as never filed. Once the CPC processes your return, you will receive an intimation under Section 270(1) of the 2025 Act, the successor to the familiar 143(1) intimation. It shows the CPC's computation against yours: refund, demand, or no change. If it proposes adjustments, you get 30 days to respond before they are finalised. Most salaried filers see the intimation within a few weeks to a few months of filing.",
    },
  ],
  faqs: [
    {
      q: "Is the salaried ITR deadline still 31 July under the new Act?",
      a: "Yes. Budget 2026-27 kept 31 July for salaried and other non-business filers while moving non-audit business filers to 31 August. For tax year 2026-27 that means 31 July 2027. One-off extensions do happen in heavy-transition years; if CBDT notifies a change, this page will be updated.",
    },
    {
      q: "My employer gave me a document called Form 16. Is it valid?",
      a: "For tax year 2026-27 the correct certificate is Form 130 under the Income Tax Rules 2026. In practice the content is identical to Form 16 and some payroll software may carry legacy labels during the transition. What matters is that the TDS figures match Form 168 and AIS. For FY 2025-26 and earlier, Form 16 remains the correct name.",
    },
    {
      q: "Which ITR form do I use as a salaried person?",
      a: "ITR-1 if your income is salary, one house property, and other sources up to Rs 50 lakh with no capital gains complications. ITR-2 if you have capital gains, more than one house property, foreign assets, or income above Rs 50 lakh. Any business or freelance income pushes you to ITR-3 or ITR-4. The forms for tax year 2026-27 reference the 2025 Act sections directly.",
    },
    {
      q: "I switched jobs during tax year 2026-27. What do I need?",
      a: "A Form 130 from each employer. The common trap: both employers apply the basic exemption and standard deduction, so combined TDS falls short and you owe self-assessment tax at filing. Reconcile both certificates against Form 168 and pay any shortfall before 31 July 2027 to avoid Section 423 interest.",
    },
    {
      q: "What happens if I miss 31 July 2027?",
      a: "You can file a belated return until 31 December 2027 with a Section 426 late fee of Rs 5,000 (Rs 1,000 if income is up to Rs 5 lakh), plus 1% monthly interest on any unpaid tax. Capital loss carry-forward is forfeited. After 31 December, the updated-return route with additional tax is the only fallback.",
    },
    {
      q: "Do I need to learn the new section numbers to file?",
      a: "No. The portal's computation engine handles the mapping. You will simply see new references on the forms: Section 263 for filing, Section 426 for the late fee, Section 156 for the rebate, Section 124 for investment deductions. If you get a notice quoting an unfamiliar section, check the mapping guide before assuming it is something new.",
    },
    {
      q: "My TDS in Form 130 does not match Form 168. What do I do?",
      a: "Do not file with the higher number and hope. Ask your employer's payroll team to correct their TDS return so Form 168 updates. If you file with a claim that Form 168 does not support, the CPC will raise a demand for the difference in the Section 270(1) intimation, and you will spend months on rectification.",
    },
    {
      q: "I have RSUs from a foreign employer. Does anything change?",
      a: "The disclosure obligation continues: foreign shares and accounts go in Schedule FA, which forces ITR-2 at minimum. Perquisite tax on vesting is usually handled by Indian payroll TDS, but the year-end foreign holding must still be disclosed. Non-disclosure carries steep penalties under the black money law, so treat Schedule FA as non-optional.",
    },
  ],
  sources: [
    {
      name: "Income Tax Act 2025",
      url: "https://www.incometaxindia.gov.in/income-tax-act-20251",
      description: "Full text of the 2025 Act. Section 263 (return filing), Section 392 (salary TDS), Section 426 (late fee), Section 423 (interest).",
    },
    {
      name: "Income Tax Rules 2026 - forms notification",
      url: "https://www.incometaxindia.gov.in/Pages/rules/income-tax-rules.aspx",
      description: "Renumbered forms: Form 16 to 130, 16A to 131, 16B to 132, 16C to 133, 26AS to 168.",
    },
    {
      name: "Union Budget 2026-27",
      url: "https://www.indiabudget.gov.in/",
      description: "Staggered ITR deadlines: 31 July for salaried filers, 31 August for non-audit business filers.",
    },
    {
      name: "Income Tax e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Filing portal with the Tax Year selector and the CBDT section mapping utility.",
    },
  ],
};
