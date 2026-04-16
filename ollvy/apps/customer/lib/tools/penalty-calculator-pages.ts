import type { ToolPageConfig } from './types'

// ─── 1. GST Late Filing Calculator ───────────────────────────────────────────

export const gstLateFilingPage: ToolPageConfig = {
  slug: 'gst-late-filing',
  title: 'GST Late Filing Penalty Calculator',
  seoTitle: 'GST Late Filing Penalty Calculator India 2026 | GSTR-1 & GSTR-3B | Ollvy',
  seoDescription: 'Calculate GST late filing penalty and interest instantly. Covers GSTR-1, GSTR-3B, and GSTR-9. Correct rates per CBIC Notification 19/2021.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/gst-late-filing',
  lastReviewed: 'April 2026',
  category: 'GST',
  relatedServiceSlug: 'gst-monthly',
  relatedServiceLabel: 'Get GST Returns Filed on Time',
  relatedCalculatorSlugs: ['gst-demand-notice', 'tds-late-filing', 'itr-late-filing'],
  relatedLearnSlug: 'do-i-need-gst-registration',
  reviewSources: [
    {
      name: 'CBIC Notification 19/2021 - Late Fee Rates',
      url: 'https://www.cbic.gov.in/resources/htdocs-cbec/gst/notfctn-19-central-tax-english-2021.pdf',
      description: 'Official notification specifying revised late fee rates for GSTR-1 and GSTR-3B',
    },
    {
      name: 'CBIC GST Rates Portal',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Central Board of Indirect Customs and Taxes - GST rate information',
    },
  ],

  intro: `Missing a GST return filing deadline costs money every day. This calculator tells you exactly how much.

Late fee for GSTR-1 and GSTR-3B is Rs. 50 per day per return for non-nil returns (Rs. 25 CGST + Rs. 25 SGST) under Section 47 of the CGST Act, 2017, as revised by CBIC Notification 19/2021. For nil returns - months with no sales - the rate drops to Rs. 20 per day, capped at Rs. 500 per return.

For GSTR-9 (the annual return), the rate is Rs. 200 per day, but the total is capped at 0.50% of your annual turnover (0.25% CGST + 0.25% SGST) under Section 47(2) of the CGST Act.

If you also have outstanding tax that has not been paid, interest accrues separately at 18% per annum on that amount under Section 50. Interest is not capped - it compounds daily until the tax is actually paid.

Select your return type, enter how many days late you are, and add any outstanding tax liability to see your full exposure. The calculator separates late fee from interest so you know what is fixed and what is still growing.`,

  howToUse: `**What the numbers mean:**
Late fee is fixed once you file - it stops the moment the return is submitted. The amount shown is what you owe today.

Interest on unpaid tax continues to grow every day until the tax is paid - filing the return alone does not stop it. If you have outstanding tax, pay it and file simultaneously.

**Turnover-based caps for GSTR-1 and GSTR-3B:**
- Turnover up to Rs. 1.5 crore: Rs. 2,000 per return
- Turnover Rs. 1.5 crore to Rs. 5 crore: Rs. 5,000 per return
- Turnover above Rs. 5 crore: Rs. 10,000 per return

These caps were introduced by CBIC Notification 19/2021. The calculator applies the standard Rs. 5,000 cap as a conservative estimate - check the exact cap for your AATO.

**Next step:** File the return immediately. The late fee is payable in cash only - you cannot use ITC from your credit ledger to pay it.`,

  faqs: [
    {
      q: 'What is the late fee for GSTR-3B?',
      a: 'Rs. 50 per day per return for non-nil returns (Rs. 25 CGST + Rs. 25 SGST), capped at Rs. 10,000 per return for turnover above Rs. 5 crore. Rs. 20 per day for nil returns, capped at Rs. 500. Rates per CBIC Notification 19/2021, effective June 2021.',
    },
    {
      q: 'Is the late fee different for nil returns?',
      a: 'Yes. If you had no sales in the period and are filing a nil return, the late fee is Rs. 20 per day (Rs. 10 CGST + Rs. 10 SGST), capped at Rs. 500 per return. This is significantly lower than the Rs. 50/day rate for non-nil returns.',
    },
    {
      q: 'What is the late fee for GSTR-9 (annual return)?',
      a: 'Rs. 200 per day (Rs. 100 CGST + Rs. 100 SGST), capped at 0.50% of your annual turnover in the state. The 0.50% is the combined cap - 0.25% per Act under Section 47(2) of the CGST Act. GSTR-9 is mandatory only above Rs. 2 crore annual turnover.',
    },
    {
      q: 'Can I pay the late fee using ITC from my credit ledger?',
      a: 'No. Late fees must be paid in cash from your electronic cash ledger. You cannot use Input Tax Credit to pay GST late fees. This is explicitly stated in the GST law - ITC can only offset tax liability, not fees or penalties.',
    },
    {
      q: 'What happens if I do not file GST returns for 6 months?',
      a: 'After 6 consecutive months of non-filing, the GST portal suspends your GSTIN. You cannot generate e-way bills or file new returns until all pending returns are filed. After suspension, the department can initiate suo-moto cancellation of your GST registration.',
    },
    {
      q: 'Does interest apply even if I file on time but have unpaid tax?',
      a: 'Yes. Section 50 of the CGST Act charges interest at 18% per annum on outstanding tax from the original due date, regardless of when you file the return. Filing on time stops the late fee but does not stop interest on unpaid tax.',
    },
  ],
}


// ─── 2. GST Demand Calculator (Section 73/74) ─────────────────────────────────

export const gstDemandPage: ToolPageConfig = {
  slug: 'gst-demand-notice',
  title: 'GST Demand Notice Penalty Calculator (Section 73 & 74)',
  seoTitle: 'GST Demand Notice Penalty Calculator India 2026 | Section 73 & 74 | Ollvy',
  seoDescription: 'Calculate penalty on GST show cause notice. Section 73 (non-fraud): no penalty if paid within 30 days. Section 74 (fraud): 15%/25%/100% tiers.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/gst-demand-notice',
  lastReviewed: 'April 2026',
  category: 'GST',
  relatedServiceSlug: 'gst-monthly',
  relatedServiceLabel: 'Get GST Compliance Help',
  relatedCalculatorSlugs: ['gst-late-filing'],
  relatedLearnSlug: 'do-i-need-gst-registration',
  reviewSources: [
    {
      name: 'CGST Act 2017 - Full Text',
      url: 'https://www.cbic.gov.in/resources/htdocs-cbec/gst/cgst-act.pdf',
      description: 'Central Goods and Services Tax Act with Sections 73 and 74 penalty provisions',
    },
    {
      name: 'CGST Act Updated (January 2024)',
      url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf',
      description: 'Latest consolidated CGST Act with all amendments',
    },
  ],

  intro: `Received a GST show cause notice? The penalty you face depends entirely on whether the notice is under Section 73 or Section 74 of the CGST Act, and how quickly you respond.

Section 73 covers genuine errors - tax short-paid, wrong ITC claimed, or excess refund taken without fraudulent intent. Under Section 73(8), if you pay the full tax demand plus interest within 30 days of the show cause notice, no penalty applies at all. This is the law explicitly - "no penalty shall be payable and all proceedings shall be deemed to be concluded." If the 30-day window passes, a penalty of 10% of the demand (minimum Rs. 10,000) applies when the order is passed.

Section 74 covers fraud, wilful misstatement, and suppression of facts. The penalty structure is different: 15% if paid within 30 days of the SCN, 25% if paid before the order is passed, and 100% (equal to the full demand amount) after the order. Interest under Section 74 accrues at 24% per annum, not 18%.

This calculator shows your exposure across all scenarios so you can make an informed decision about when to pay.`,

  howToUse: `**The most important number:** Days since the notice was issued. If you are within 30 days and the notice is under Section 73, paying now means zero penalty. That window closes fast.

**Scenario comparison:** The calculator shows three scenarios side by side - what you owe if you pay now, before the order, and after the order. The difference between paying now versus after the order under Section 74 is the difference between 15% penalty and 100% penalty.

**Interest keeps growing:** The interest shown is an estimate based on the days entered. It increases by the day. The demand amount and penalty are fixed by the section - the interest is the variable.

**If you received a notice:** Respond within the deadline even if you cannot pay immediately. Not responding leads to an ex-parte order, which removes all penalty reduction options.`,

  faqs: [
    {
      q: 'What is the penalty under Section 73 if I pay within 30 days of the SCN?',
      a: 'Zero. Section 73(8) of the CGST Act states explicitly that "no penalty shall be payable" if tax and interest are paid within 30 days of the show cause notice. This is the most important window in any Section 73 case.',
    },
    {
      q: 'What is the difference between Section 73 and Section 74?',
      a: 'Section 73 covers non-fraud cases - genuine errors, oversight, or difference of interpretation. Section 74 applies where the department alleges fraud, wilful misstatement, or suppression of facts. Section 74 carries higher penalties (up to 100% of tax) and higher interest (24% vs 18%). Which section applies is stated in the notice.',
    },
    {
      q: 'What is the penalty under Section 74 after the order is passed?',
      a: '100% of the tax demand - equal to the full amount of tax evaded. This is in addition to the tax itself and interest at 24% per annum. Evasion above Rs. 5 crore under Section 74 can also lead to prosecution under Section 132 of the CGST Act.',
    },
    {
      q: 'Can I appeal against a GST demand order?',
      a: 'Yes. Appeal lies to the Appellate Authority (Section 107) within 3 months of the order. A pre-deposit of 10% of the disputed tax must be paid before the appeal is heard. If the appeal fails, further appeal lies to GSTAT, then the High Court.',
    },
    {
      q: 'What interest rate applies under Section 73 vs Section 74?',
      a: 'Section 73: 18% per annum on the outstanding tax (Section 50). Section 74: 24% per annum where excess ITC was wrongly availed and utilised. Both rates are calculated from the original due date of the tax, not the notice date.',
    },
  ],
}


// ─── 3. Director KYC Penalty Calculator ──────────────────────────────────────

export const directorKycPage: ToolPageConfig = {
  slug: 'director-kyc',
  title: 'Director KYC (DIR-3 KYC) Penalty Calculator',
  seoTitle: 'Director KYC Penalty Calculator India 2026 | DIN Deactivation | Ollvy',
  seoDescription: 'Calculate DIR-3 KYC late fee. Rs. 5,000 per year of missed KYC. DIN deactivates on October 1 each year. Find out what you owe to reactivate.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/director-kyc',
  lastReviewed: 'April 2026',
  category: 'MCA',
  relatedServiceSlug: 'din-reactivation',
  relatedServiceLabel: 'Reactivate Your DIN',
  relatedCalculatorSlugs: ['mca-annual-filing'],
  relatedLearnSlug: 'pvt-ltd-vs-llp',
  reviewSources: [
    {
      name: 'MCA Rules - Directors Appointment and Qualification',
      url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html?act=NDA2MA==',
      description: 'Companies (Appointment and Qualification of Directors) Rules including Rule 12A',
    },
    {
      name: 'MCA DIR-3 KYC Portal',
      url: 'https://www.mca.gov.in/MinistryV2/dir3kyc.html',
      description: 'Official MCA page for DIR-3 KYC filing requirements and procedures',
    },
  ],

  intro: `Every director of an Indian company must file DIR-3 KYC. MCA changed this from annual to triennial (every 3 years) effective March 31, 2026. Directors who filed by September 30, 2025 are covered until June 30, 2028. Miss the deadline and the DIN (Director Identification Number) is automatically deactivated by MCA.

A deactivated DIN is not just a personal inconvenience - it blocks every company where you hold a directorship from filing any MCA form. AOC-4, MGT-7, director appointment, share transfer - nothing can be filed until your DIN is restored.

The penalty is straightforward: Rs. 5,000 per financial year of missed DIR-3 KYC. This is a fixed government fee, set under Rule 12A of the Companies (Appointment and Qualification of Directors) Rules, 2014. It cannot be reduced, waived, or paid in instalments. Three years of missed KYC means Rs. 15,000 in government fees before you can reactivate.

This calculator shows the total late fee based on the number of years you have missed, so you know the exact cost before starting the reactivation process.`,

  howToUse: `**After calculating:** The amount shown is the government fee payable to MCA. Each missed year requires a separate DIR-3 KYC filing with a separate Rs. 5,000 payment.

**What you need to reactivate:** Aadhaar with an active linked mobile number (OTP required for each KYC filing), PAN card, email address, and a recent passport photo. If your Aadhaar-linked mobile is inactive, that must be updated at an Aadhaar enrolment centre before you can file.

**How long it takes:** 1-2 working days from filing and payment to DIN being marked Active on MCA21.

**Prevention going forward:** File DIR-3 KYC before each triennial deadline (next: June 30, 2028). Only DIR-3 KYC Web is permitted - the e-Form has been discontinued. A 2-minute online form with no late fee when filed on time. Changes to mobile, email, or address require filing within 30 days even outside the triennial cycle.`,

  faqs: [
    {
      q: 'What is DIR-3 KYC and why is it required?',
      a: 'DIR-3 KYC is the triennial KYC filing (every 3 years) that every director must submit to MCA. Next due June 30, 2028. It verifies that the director\'s mobile number and email are current and active. Without it, MCA cannot contact directors and the DIN is deactivated.',
    },
    {
      q: 'What is the penalty for missing DIR-3 KYC?',
      a: 'Rs. 5,000 per financial year of missed KYC. This is fixed under Rule 12A of the Companies (Appointment and Qualification of Directors) Rules, 2014. There is no daily accrual - it is a flat fee per missed year.',
    },
    {
      q: 'What happens if my DIN is deactivated?',
      a: 'You cannot sign any MCA form, board resolution, or official company document. Every company where you are a director is blocked from filing AOC-4, MGT-7, or any other MCA form until your DIN is restored. The block applies to all directorships, not just one company.',
    },
    {
      q: 'Is there a difference between DIR-3 KYC and DIR-3 KYC-Web?',
      a: 'The e-Form (DIR-3 KYC) has been discontinued by MCA. DIR-3 KYC Web is now the only permitted mode. It requires OTP verification on your registered mobile and email. No DSC required. Takes 2 minutes when filed before the triennial deadline.',
    },
    {
      q: 'Can I file DIR-3 KYC for multiple missed years at once?',
      a: 'You must file separately for each missed year - one form per year with a separate Rs. 5,000 payment each. They can be filed back-to-back in one sitting, but each requires its own Aadhaar OTP verification.',
    },
  ],
}


// ─── 4. MCA Annual Filing Penalty Calculator ──────────────────────────────────

export const mcaFilingPage: ToolPageConfig = {
  slug: 'mca-annual-filing',
  title: 'MCA Annual Filing Penalty Calculator (AOC-4 & MGT-7)',
  seoTitle: 'MCA Annual Filing Penalty Calculator 2026 | AOC-4 & MGT-7 | Ollvy',
  seoDescription: 'Calculate MCA annual filing late fee for Pvt Ltd companies. AOC-4 due 30 days after AGM, MGT-7 due 60 days. Rs. 100/day per form. Director disqualification risk.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/mca-annual-filing',
  lastReviewed: 'April 2026',
  category: 'MCA',
  relatedServiceSlug: 'mca-annual-filing',
  relatedServiceLabel: 'File MCA Annual Returns',
  relatedCalculatorSlugs: ['director-kyc'],
  relatedLearnSlug: 'pvt-ltd-vs-llp',
  reviewSources: [
    {
      name: 'Companies Act 2013 - Full Text',
      url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
      description: 'The Companies Act 2013 with filing requirements and penalty provisions',
    },
    {
      name: 'MCA Rules - Company Management and Administration',
      url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html?act=NDA3Mg==',
      description: 'Companies (Management and Administration) Rules for AOC-4 and MGT-7',
    },
  ],

  intro: `Every Private Limited company must file two annual returns with the Registrar of Companies: AOC-4 (financial statements) within 30 days of the AGM, and MGT-7 (annual return) within 60 days of the AGM. The AGM itself must be held by September 30 for companies with a March financial year-end.

Missing these deadlines triggers additional MCA fees that scale with how late you are. Up to 30 days late: 2x the normal filing fee. 30-60 days: 4x. 60-90 days: 6x. 90-180 days: 10x. Above 180 days: 12x the normal fee. This is on top of the standard filing fee, not instead of it.

Beyond the financial cost, sustained non-filing has serious consequences. A company that does not file for 3 consecutive financial years can be struck off by the Registrar under Section 248 of the Companies Act. Directors are disqualified under Section 164(2) after 3 consecutive years of non-filing. Every director of such a company is disqualified under Section 164(2) of the Companies Act from holding any directorship for 5 years - across all companies, not just the defaulting one.

This calculator helps you see the additional fee exposure for both forms so you can file immediately and stop the penalty from growing.`,

  howToUse: `**How the fee is calculated:** Enter your AGM date and the number of days late for each form. The calculator applies the MCA additional fee multiplier based on your delay period.

**Both forms must be filed:** AOC-4 and MGT-7 are separate filings with separate fees. The calculator shows both. Filing one without the other still leaves you in default.

**Audit must be done first:** AOC-4 requires signed, audited financial statements. If your audit is not complete, that is the bottleneck - not the MCA filing itself.

**After calculating:** File immediately. Every additional day adds to the fee multiplier once you cross a threshold.`,

  faqs: [
    {
      q: 'When are AOC-4 and MGT-7 due?',
      a: 'AOC-4 (financial statements) is due within 30 days of the AGM. MGT-7 (annual return) is due within 60 days of the AGM. For companies with a March financial year-end, the AGM must be held by September 30, making AOC-4 due by October 30 and MGT-7 by November 29.',
    },
    {
      q: 'What is the penalty for late MCA annual filing?',
      a: 'The MCA charges an additional fee on top of the normal filing fee based on delay period: 2x (up to 30 days late), 4x (30-60 days), 6x (60-90 days), 10x (90-180 days), 12x (above 180 days). Both AOC-4 and MGT-7 have separate fees.',
    },
    {
      q: 'What happens if a company does not file MCA annual returns for 2 years?',
      a: 'The Registrar of Companies can strike off the company under Section 248 of the Companies Act. Every director is also disqualified under Section 164(2) from holding any directorship for 5 years across all companies. Restoring a struck-off company requires an NCLT petition - expensive and slow.',
    },
    {
      q: 'Does an LLP need to file AOC-4 and MGT-7?',
      a: 'No. LLPs file different forms: Form 8 (Statement of Account and Solvency, due October 30) and Form 11 (Annual Return, due May 30). AOC-4 and MGT-7 are specific to Private Limited and Public Limited companies.',
    },
    {
      q: 'Can I file AOC-4 without completing the statutory audit?',
      a: 'No. AOC-4 requires the signed, audited Balance Sheet and P&L. If your auditor has not signed off, you cannot file. Plan your audit timeline to ensure completion well before the AGM filing deadline.',
    },
  ],
}


// ─── 5. ITR Late Filing Calculator ───────────────────────────────────────────

export const itrLateFilingPage: ToolPageConfig = {
  slug: 'itr-late-filing',
  title: 'ITR Late Filing Penalty Calculator',
  seoTitle: 'Income Tax Return Late Filing Penalty Calculator India 2026 | Ollvy',
  seoDescription: 'Calculate ITR late filing fee, Section 234A interest, and 234B advance tax interest. Company and LLP ITR due October 31. Individual ITR due July 31.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/itr-late-filing',
  lastReviewed: 'April 2026',
  category: 'Tax',
  relatedServiceSlug: 'business-itr',
  relatedServiceLabel: 'File Business ITR',
  relatedCalculatorSlugs: ['tds-late-filing'],
  relatedLearnSlug: 'do-i-need-to-file-itr',
  reviewSources: [
    {
      name: 'Income Tax Act 1961 - Full Text',
      url: 'https://incometaxindia.gov.in/acts/income-tax-act-1961.pdf',
      description: 'The Income Tax Act with Sections 234A, 234B, 234F penalty provisions',
    },
    {
      name: 'Income Tax Portal - Section 234F Guide',
      url: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1#234f',
      description: 'Official e-filing portal guidance on late filing fees',
    },
  ],

  intro: `Missing the Income Tax Return deadline has three separate financial consequences: a flat late filing fee, interest on any unpaid tax, and the permanent loss of loss carry-forward rights.

The late filing fee under Section 234F is Rs. 10,000 for income above Rs. 5 lakh (Rs. 1,000 if income is below Rs. 5 lakh). For companies and LLPs, the fee is Rs. 10,000 regardless of income. This is a flat amount - not per day.

Interest under Section 234A accrues at 1% per month on outstanding tax from the original due date. Unlike the late fee, this continues to grow every month until the tax is actually paid. A company with Rs. 5 lakh of unpaid tax pays Rs. 5,000 per month in Section 234A interest.

The loss that cannot be quantified: if a company or LLP made a loss this year and files the ITR after October 31, it permanently loses the right to carry that loss forward against future profits. That tax benefit - potentially lakhs of rupees over the next 8 years - is gone forever. The calculator does not include this because it depends on your specific loss amount, but it is often the largest cost of filing late.`,

  howToUse: `**Due dates:**
- Individual ITR (non-audit): July 31
- Company (all cases): October 31 - statutory audit is mandatory for all companies
- LLP (no audit required): July 31
- LLP (audit required - turnover above Rs. 1 crore): October 31
- Business with tax audit: October 31

**What the calculator shows:** Late filing fee (flat) + Section 234A interest (monthly on unpaid tax) + Section 234B interest if advance tax was short-paid.

**What it does not show:** Loss carry-forward forfeiture. If you have business losses this year, calculate separately what you lose by filing late - often far more than the penalties shown.`,

  faqs: [
    {
      q: 'What is the late filing fee for ITR under Section 234F?',
      a: 'Rs. 5,000 if filed after the due date but before December 31 of the assessment year, for income above Rs. 5 lakh. Rs. 1,000 if income is Rs. 5 lakh or below. For companies and LLPs, Rs. 10,000 applies. After December 31, the same fees apply but filing is no longer possible without special circumstances.',
    },
    {
      q: 'When is the due date for company ITR?',
      a: 'October 31 for all Pvt Ltd and Public Ltd companies, regardless of turnover. Statutory audit is mandatory for all companies (Companies Act 2013), so the extended deadline always applies.',
    },
    {
      q: 'What is Section 234A interest?',
      a: '1% per month on outstanding tax liability from the original due date until the date of actual payment. It is calculated on a monthly basis (not daily) and continues even after you file the return, until the tax is paid.',
    },
    {
      q: 'What is the consequence of not filing a loss return on time?',
      a: 'Under Section 139(3) of the Income Tax Act, business losses and capital losses can only be carried forward if the ITR is filed by the due date. Filing even one day late means the loss cannot be offset against future profits - that tax benefit is permanently forfeited.',
    },
    {
      q: 'Can I file ITR after the December 31 deadline?',
      a: 'Not normally. December 31 of the assessment year is the last date for filing a belated return. After that, you need either a specific departmental notice or the Commissioner\'s approval. Any pending refund also cannot be claimed after this date.',
    },
  ],
}


// ─── 6. TDS Late Filing Calculator ───────────────────────────────────────────

export const tdsLateFilingPage: ToolPageConfig = {
  slug: 'tds-late-filing',
  title: 'TDS Late Filing Penalty Calculator',
  seoTitle: 'TDS Late Filing Penalty Calculator India 2026 | Section 234E | Ollvy',
  seoDescription: 'Calculate TDS late filing penalty (Rs. 200/day, Section 234E), interest on late deposit (1.5%/month), and Section 40(a)(ia) expense disallowance.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/tds-late-filing',
  lastReviewed: 'April 2026',
  category: 'Tax',
  relatedServiceSlug: 'tds-monthly-compliance',
  relatedServiceLabel: 'Get TDS Filed on Time',
  relatedCalculatorSlugs: ['itr-late-filing'],
  relatedLearnSlug: 'do-i-need-to-file-itr',
  reviewSources: [
    {
      name: 'Income Tax Act 1961 - Full Text',
      url: 'https://incometaxindia.gov.in/acts/income-tax-act-1961.pdf',
      description: 'The Income Tax Act with Sections 234E, 201, and 40(a)(ia) provisions',
    },
    {
      name: 'TRACES - TDS CPC Portal',
      url: 'https://www.tdscpc.gov.in/app/statreg.xhtml',
      description: 'TDS Centralized Processing Cell - statutory requirements and regulations',
    },
  ],

  intro: `TDS non-compliance has three separate penalties that can apply simultaneously: a late filing fee, interest on late deposit, and a business expense disallowance that effectively taxes money you have already spent.

The late filing fee under Section 234E is Rs. 200 per day for each day the quarterly TDS return is filed late, capped at the TDS amount itself. This applies regardless of whether the TDS was deducted - simply not filing the return on time triggers it.

If TDS was deducted from payments but deposited late with the government, interest under Section 201(1A)(ii) accrues at 1.5% per month from the date of deduction to the date of deposit. If TDS was not deducted at all, the interest rate is lower - 1% per month under Section 201(1A)(i) - but the real cost is Section 40(a)(ia).

Section 40(a)(ia) is the most expensive consequence. If you made a payment on which TDS should have been deducted but was not, 30% of that entire payment is disallowed as a business expense. You pay income tax on 30% of money you already paid to someone else.

This calculator separates all three penalties so you can see the total exposure.`,

  howToUse: `**TDS deposit deadline:** 7th of the following month for most payments. For March, the deadline is April 30. Interest starts from the date of deduction, not the deposit deadline.

**Quarterly return deadlines:**
- Q1 (April-June): July 31
- Q2 (July-September): October 31
- Q3 (October-December): January 31
- Q4 (January-March): May 31

**Section 271H note:** An additional penalty of Rs. 10,000 to Rs. 1,00,000 under Section 271H can be levied for late TDS return filing. This is waived if you file within 1 year of the due date - after that, it becomes assessable.

**Section 40(a)(ia) disallowance:** This calculator estimates the disallowance based on the TDS amount entered. The actual disallowance is 30% of the gross payment on which TDS was not deducted.`,

  faqs: [
    {
      q: 'What is the penalty under Section 234E for late TDS return filing?',
      a: 'Rs. 200 per day for each day the quarterly TDS return (24Q or 26Q) is filed after the due date. The total fee cannot exceed the TDS amount for the quarter. Section 234E applies even if TDS was deducted and deposited correctly - late filing of the return alone triggers it.',
    },
    {
      q: 'What interest applies if TDS is deposited late?',
      a: 'Section 201(1A)(ii): 1.5% per month from the date TDS was deducted to the date it was deposited with the government. If TDS was not deducted at all, Section 201(1A)(i) applies at 1% per month from the date of payment to the date of deduction.',
    },
    {
      q: 'What is Section 40(a)(ia) disallowance?',
      a: '30% of any payment on which TDS was required but not deducted is disallowed as a business expense under Section 40(a)(ia). This means you pay income tax on 30% of money you already paid to a vendor, employee, or landlord. This is often the largest financial consequence of not deducting TDS.',
    },
    {
      q: 'When must TDS be deposited?',
      a: 'By the 7th of the following month for most payments (salary, contractor, professional fees, rent). Exception: March TDS must be deposited by April 30. If the 7th falls on a bank holiday, the next working day applies.',
    },
    {
      q: 'Can I avoid the Section 271H penalty?',
      a: 'Yes. Section 271H penalty (Rs. 10,000 to Rs. 1,00,000) is waived if the TDS return is filed within 1 year of the due date, and all TDS is deposited with the correct interest. After 1 year, the penalty becomes assessable by the Assessing Officer.',
    },
  ],
}


// ─── 7. PF / ESIC Penalty Calculator ─────────────────────────────────────────

export const pfEsicPage: ToolPageConfig = {
  slug: 'pf-esic-penalty',
  title: 'PF and ESIC Non-Compliance Penalty Calculator',
  seoTitle: 'PF ESIC Penalty Calculator India 2026 | Section 14B EPF Act | Ollvy',
  seoDescription: 'Calculate PF damages (Section 14B, EPF Act) and ESIC interest (Section 85B) for late contributions. Tiered damage rates: 5% to 25% per annum.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/pf-esic-penalty',
  lastReviewed: 'April 2026',
  category: 'Payroll',
  relatedServiceSlug: 'payroll-management',
  relatedServiceLabel: 'Get Payroll Compliance Help',
  relatedCalculatorSlugs: [],
  relatedLearnSlug: 'when-does-pf-registration-become-mandatory',
  reviewSources: [
    {
      name: 'EPF Act 1952 - Full Text',
      url: 'https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/EPFAct1952.pdf',
      description: 'Employees Provident Funds and Miscellaneous Provisions Act with Section 14B damages',
    },
    {
      name: 'ESI Act 1948 - Amended Text',
      url: 'https://www.esic.gov.in/attachments/files/ESI_Act_amended_upto_2010.pdf',
      description: 'Employees State Insurance Act with Section 85B interest provisions',
    },
  ],

  intro: `PF and ESIC non-compliance has a tiered penalty structure that gets more expensive the longer the default continues. For PF, the penalty is called "damages" under Section 14B of the Employees Provident Funds and Miscellaneous Provisions Act, 1952.

PF damage rates depend on how long contributions have been overdue: under 2 months at 5% per annum, 2-4 months at 10%, 4-6 months at 15%, and above 6 months at 25% per annum. These rates apply to the outstanding contribution amount, not the salary. Beyond 1 year of default, EPFO can file a criminal complaint under Section 14 of the EPF Act, which carries imprisonment up to 1 year.

ESIC interest under Section 85B of the Employees State Insurance Act, 1948 is simpler: 12% per annum on delayed contributions from the due date. The due date for both PF and ESIC contributions is the 15th of the following month.

The contributions themselves are not penalties - they are what you owe your employees in welfare benefits. The damages and interest are what you owe the government for the delay. This calculator estimates both.`,

  howToUse: `**PF is mandatory above 20 employees** (10 for cinemas, beedi/tobacco, and textile mills). ESIC is mandatory above 10 employees for most establishments.

**Employee count:** All employees count toward the threshold - full-time, part-time, contractual, and directors drawing salary.

**PF contribution base:** 12% of basic salary plus dearness allowance (DA), not gross salary. The mandatory PF contribution only applies to employees earning up to Rs. 15,000 basic per month.

**ESIC contribution base:** 3.25% employer + 0.75% employee = 4% of gross wages. Only for employees earning up to Rs. 21,000 per month.

**After calculating:** Pay the contributions and damages immediately. File the EPFO/ESIC challans through the respective portals and send proof to the regional office.`,

  faqs: [
    {
      q: 'What are PF damages under Section 14B?',
      a: 'Damages are the penalty charged by EPFO for delayed payment of PF contributions. They are calculated as a percentage of the outstanding amount based on the delay period: 5% per annum (under 2 months), 10% (2-4 months), 15% (4-6 months), 25% (above 6 months). These are in addition to the actual contributions owed.',
    },
    {
      q: 'When is PF registration mandatory?',
      a: 'Under Section 1(3)(b) of the EPF Act, registration is mandatory when an establishment employs 20 or more persons at any point during the year. For cinemas, beedi/tobacco, and textile mills, the threshold is 10 employees. Once crossed, the obligation continues even if headcount later drops below the threshold.',
    },
    {
      q: 'What is the ESIC interest rate for late contributions?',
      a: '12% per annum on delayed contributions under Section 85B of the ESI Act, 1948. Contributions are due by the 15th of the following month. ESIC can also levy damages of 5% to 25% depending on the period of default, similar to PF.',
    },
    {
      q: 'Can EPFO take criminal action for PF non-compliance?',
      a: 'Yes. Under Section 14 of the EPF Act, wilful non-compliance can lead to imprisonment up to 1 year and/or a fine. After 1 year of default, EPFO can file a criminal complaint. EPFO also has powers to attach bank accounts and property to recover arrears under Section 8F.',
    },
    {
      q: 'Do contract workers count toward the 20-employee PF threshold?',
      a: 'It depends on the contract structure. If you are directing their work at your premises and are effectively their employer, EPFO may count them toward your threshold. If the staffing agency employs them and bears the liability, they count toward the agency\'s threshold instead. This is a grey area - get clarity on your specific contract before assuming.',
    },
  ],
}


// ─── 8. Professional Tax Penalty Calculator ───────────────────────────────────

export const professionalTaxPage: ToolPageConfig = {
  slug: 'professional-tax-penalty',
  title: 'Professional Tax Penalty Calculator',
  seoTitle: 'Professional Tax Penalty Calculator India 2026 | State-wise PT Rates | Ollvy',
  seoDescription: 'Calculate Professional Tax penalty for Maharashtra, Karnataka, West Bengal, Tamil Nadu, and other states. Max PT is Rs. 2,500/year per person.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/professional-tax-penalty',
  lastReviewed: 'April 2026',
  category: 'Tax',
  relatedServiceSlug: 'payroll-management',
  relatedServiceLabel: 'Get PT Compliance Help',
  relatedCalculatorSlugs: ['pf-esic-penalty'],
  relatedLearnSlug: 'do-i-need-professional-tax-registration',
  reviewSources: [
    {
      name: 'Maharashtra Professional Tax - Labour Department',
      url: 'https://www.mah.labour.gov.in/professionaltax.php',
      description: 'Official Maharashtra Labour Department page for Professional Tax rates and compliance',
    },
    {
      name: 'Constitution of India - Article 276',
      url: 'https://legislative.gov.in/constitution-of-india',
      description: 'Constitutional provision setting Rs. 2,500 per annum maximum on Professional Tax',
    },
  ],

  intro: `Professional Tax is a state-level tax levied by about half the states in India. If your business is in Delhi, Uttar Pradesh, Rajasthan, Haryana, Punjab, or Himachal Pradesh, Professional Tax does not apply to you at all - stop reading.

For businesses in Maharashtra, Karnataka, West Bengal, Tamil Nadu, Andhra Pradesh, Telangana, Gujarat, Odisha, Kerala, Madhya Pradesh, and certain North-Eastern states, PT is a real obligation with real penalties for non-payment.

The maximum PT any state can charge is Rs. 2,500 per year per person, set by Article 276 of the Constitution. Each state sets its own rates within this ceiling. Employers have two obligations: PTEC (Professional Tax Enrollment Certificate) for themselves, and PTRC (Professional Tax Registration Certificate) to deduct PT from employee salaries and remit it to the state.

Penalty rates for late payment vary by state: Maharashtra charges 10% per month on the outstanding amount. Karnataka charges 2% per month. Tamil Nadu imposes a flat 10% penalty plus 2% monthly interest. This calculator uses your state's specific rates.`,

  howToUse: `**Check your state first.** If you are in Delhi, UP, Haryana, Rajasthan, Punjab, or HP - Professional Tax does not apply. No calculation needed.

**Two separate registrations:** If you have employees in a PT state, you need both PTEC (for yourself as the employer/professional) and PTRC (to deduct and remit PT from employees). These are separate registrations with separate filing obligations.

**Filing frequency:** Varies by state. Maharashtra: monthly for PTRC. Karnataka: monthly above certain thresholds. Tamil Nadu: half-yearly. Check your state's specific schedule.

**Salary threshold:** Most states exempt individuals below Rs. 7,500-10,000 per month from PT. No PT is deductible from employees below this threshold.`,

  faqs: [
    {
      q: 'Which states levy Professional Tax in India?',
      a: 'Maharashtra, Karnataka, West Bengal, Tamil Nadu, Andhra Pradesh, Telangana, Gujarat, Odisha, Kerala, Madhya Pradesh, Assam, Jharkhand, Meghalaya, Manipur, Tripura, and Sikkim. Delhi, UP, Rajasthan, Haryana, Punjab, and Himachal Pradesh do not levy Professional Tax.',
    },
    {
      q: 'What is the maximum Professional Tax in India?',
      a: 'Rs. 2,500 per year per person, set by Article 276 of the Constitution. No state can charge more than this regardless of income level. Maharashtra charges up to Rs. 2,500, Karnataka up to Rs. 2,496, Tamil Nadu up to Rs. 2,400.',
    },
    {
      q: 'What is the difference between PTEC and PTRC?',
      a: 'PTEC (Professional Tax Enrollment Certificate) is for you as the business owner, proprietor, partner, or director - you pay PT on yourself. PTRC (Professional Tax Registration Certificate) authorises you to deduct PT from your employees\' salaries and remit it to the state government. If you have employees, you need both.',
    },
    {
      q: 'Is Professional Tax deductible for income tax?',
      a: 'Yes. PT paid on salary is deductible under Section 16(iii) of the Income Tax Act. For self-employed individuals, it is deductible as a business expense. This partially offsets the cost.',
    },
    {
      q: 'Does a Pvt Ltd company need to pay Professional Tax?',
      a: 'Yes, in PT states. The company needs PTEC and pays PT for each director drawing a salary. It also needs PTRC to deduct PT from all salaried employees. Both obligations apply separately.',
    },
  ],
}


// ─── 9. Shop & Establishment Penalty Calculator ───────────────────────────────

export const shopEstablishmentPage: ToolPageConfig = {
  slug: 'shops-establishment-penalty',
  title: 'Shop & Establishment Non-Compliance Penalty Calculator',
  seoTitle: 'Shop & Establishment Penalty Calculator India 2026 | State-wise | Ollvy',
  seoDescription: 'Calculate Shop & Establishment Act penalty for operating without registration. State-wise penalties for Maharashtra, Delhi, Karnataka, Tamil Nadu, and others.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/shops-establishment-penalty',
  lastReviewed: 'April 2026',
  category: 'Registration',
  relatedServiceSlug: 'gst-registration',
  relatedServiceLabel: 'Get Business Registered',
  relatedCalculatorSlugs: ['professional-tax-penalty'],
  relatedLearnSlug: 'do-i-need-shop-establishment-registration',
  reviewSources: [
    {
      name: 'Maharashtra Shops and Establishments Act',
      url: 'https://www.mah.labour.gov.in/ShopsAct.php',
      description: 'Official Maharashtra Labour Department page for Shops and Establishments Act compliance',
    },
    {
      name: 'Delhi Shops and Establishments Act',
      url: 'https://labour.delhi.gov.in/content/shops-and-establishments-act',
      description: 'Delhi Labour Department guidance on Shops and Establishments registration',
    },
  ],

  intro: `Every commercial establishment - shop, office, restaurant, IT company, hotel, or cloud kitchen - must register under the state's Shops and Establishments Act within 30 days of starting business. Operating without registration exposes you to penalties under the state Act, and practically blocks you from opening a bank current account or applying for other licences.

Penalties under state S&E Acts vary significantly. Maharashtra (under the Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017) charges Rs. 1,000 to Rs. 5,000 for first offences and Rs. 5,000 to Rs. 10,000 for repeat offences. Karnataka charges Rs. 500 to Rs. 3,000 for first offences. Delhi charges Rs. 500 to Rs. 2,500.

Beyond the fine, the practical consequences are immediate: most banks require an S&E certificate as proof of business address for current account opening, and most other licences (FSSAI, trade licence, GSTN) accept it as primary address proof. Operating without it stalls your entire compliance setup.

This calculator gives state-specific penalty ranges for the 6 major states and indicative ranges for others.`,

  howToUse: `**Who must register:** Any commercial establishment - not just shops. IT offices, cloud kitchens, restaurants, hotels, educational institutions, and warehouses all fall under S&E Acts in most states. Home-based businesses with employees also qualify in most states.

**Who is exempt:** Factories (governed by the Factories Act), government offices, and purely agricultural businesses.

**Renewal:** Maharashtra made the certificate lifetime (permanent) after a 2017 amendment - no renewal needed. Delhi and Karnataka require annual renewal. Most states require annual or every 3 years.

**After calculating:** Register immediately. The certificate is required for bank current account opening, GST registration address proof, FSSAI application, and labour inspections.`,

  faqs: [
    {
      q: 'Is Shop & Establishment registration mandatory for IT companies and offices?',
      a: 'Yes. IT companies, BPOs, and offices are specifically covered under S&E Acts in most states. The misconception that S&E applies only to retail shops is wrong - "establishment" in the law includes any commercial operation with employees.',
    },
    {
      q: 'Can I use my S&E certificate as business address proof?',
      a: 'Yes. It is the primary accepted proof of business address for sole proprietorships and firms at banks (for current account), GST portal, FSSAI applications, and most government licence applications.',
    },
    {
      q: 'Does a Pvt Ltd company need Shop & Establishment registration?',
      a: 'In most states, yes - the company must register the premises where it operates. The registration is for the commercial premises, not the entity type. Even registered companies must comply with state S&E law for their offices.',
    },
    {
      q: 'What happens during a labour inspection if I am not registered?',
      a: 'The inspector can issue a notice, impose a penalty under the state Act, and in repeat cases, recommend prosecution. In states like Maharashtra, the fine for non-registration doubles for repeat offences. The lack of S&E registration is one of the easiest violations to spot and action during an inspection.',
    },
    {
      q: 'How long is the S&E certificate valid?',
      a: 'It depends on your state. Maharashtra: lifetime (permanent) since 2017. Delhi and Karnataka: annual renewal required. Haryana: 5-year renewal. Tamil Nadu: annual or 5-year option. Most other states: annual. Check your specific state Act.',
    },
  ],
}


// ─── 10. DPIIT / FEMA Penalty Calculator ─────────────────────────────────────

export const dpiitFemaPage: ToolPageConfig = {
  slug: 'startup-dpiit-compliance',
  title: 'DPIIT Startup / FEMA Compliance Penalty Calculator',
  seoTitle: 'FEMA Compliance Penalty Calculator India 2026 | FC-GPR FC-TRS | Ollvy',
  seoDescription: 'Estimate FEMA compounding fees for FC-GPR, FC-TRS, and ESOP reporting delays. RBI sets the actual fee - this calculator provides indicative ranges.',
  canonicalUrl: 'https://www.ollvy.com/tools/penalty-calculator/startup-dpiit-compliance',
  lastReviewed: 'April 2026',
  category: 'Startup',
  relatedServiceSlug: 'pvt-ltd-incorporation',
  relatedServiceLabel: 'Get Startup Compliance Help',
  relatedCalculatorSlugs: ['mca-annual-filing'],
  relatedLearnSlug: 'should-i-get-dpiit-startup-recognition',
  reviewSources: [
    {
      name: 'FEMA Act and Rules - RBI',
      url: 'https://fema.rbi.org.in/fema/english/FEMA_CONTENTS.aspx',
      description: 'Reserve Bank of India - Foreign Exchange Management Act regulations and rules',
    },
    {
      name: 'FIRMS Portal - RBI Foreign Investment Reporting',
      url: 'https://firms.rbi.org.in/firms/faces/pages/login.xhtml',
      description: 'RBI Foreign Investment Reporting and Management System for FC-GPR and FC-TRS filings',
    },
  ],

  intro: `Startups receiving foreign equity investment have FEMA (Foreign Exchange Management Act, 1999) reporting obligations that many founders miss, often discovering the issue only during funding due diligence.

FC-GPR (Foreign Currency - Gross Provisional Return) must be filed within 30 days of receiving foreign equity investment. FC-TRS (Foreign Currency - Transfer of Shares) must be filed within 60 days of share transfer involving a foreign person. Missing these deadlines constitutes a FEMA contravention under Section 13.

The remedy is compounding - a formal process where you approach RBI, disclose the violation, and pay a compounding fee. RBI determines the fee individually based on the nature of the violation, the delay period, whether you disclosed voluntarily, and the amount involved. Voluntary disclosure consistently receives lower compounding fees than cases discovered by the department.

This calculator provides indicative ranges based on the investment amount and delay period. The actual fee is determined by RBI and can only be confirmed through the compounding application process. Consider this a planning tool, not a definitive liability figure.`,

  howToUse: `**This calculator is indicative only.** RBI sets compounding fees case by case. The ranges shown are based on reported compounding orders for similar contraventions - actual fees may differ.

**Voluntary disclosure:** If you file a compounding application yourself before the contravention is detected by the department, RBI consistently applies lower compounding fees. Once detected, you lose this benefit.

**Angel Tax note:** DPIIT Startup Recognition removes the Section 56(2)(viib) angel tax risk on investments above fair market value. This is separate from FEMA obligations. Both apply to foreign investment - FEMA for reporting, angel tax for income tax treatment.

**ESOP reporting:** ESOPs granted to foreign employees or employees of foreign group companies require separate FEMA reporting. The reporting obligation depends on whether the options are exercised, not just granted.`,

  faqs: [
    {
      q: 'What is FC-GPR and when must it be filed?',
      a: 'FC-GPR (Foreign Currency - Gross Provisional Return) is the RBI reporting form for equity investment received from foreign investors. It must be filed within 30 days of receiving the investment. The company files FC-GPR through the FIRMS portal (RBI\'s Foreign Investment Reporting and Management System).',
    },
    {
      q: 'What is the penalty for missing FC-GPR filing?',
      a: 'FEMA does not have a fixed daily penalty. The remedy is compounding under Section 15 of FEMA, 1999. RBI determines the compounding fee based on the amount, delay, nature of the contravention, and voluntary disclosure. Indicative range: Rs. 5,000 to 1% of the investment amount. Higher amounts and longer delays attract higher fees.',
    },
    {
      q: 'What is the difference between DPIIT recognition and FEMA compliance?',
      a: 'These are completely separate. DPIIT Startup Recognition deals with income tax (angel tax exemption, 80-IAC holiday). FEMA compliance deals with foreign exchange reporting to RBI (FC-GPR, FC-TRS). Both are required for startups receiving foreign investment - one does not substitute for the other.',
    },
    {
      q: 'What is compounding under FEMA?',
      a: 'Compounding is the process of approaching RBI voluntarily to regularise a FEMA violation. You file an application, disclose the contravention, and pay the compounding fee determined by RBI. After compounding, the matter is settled and no further action can be taken for that specific contravention.',
    },
    {
      q: 'Does DPIIT recognition provide any FEMA exemption?',
      a: 'No. DPIIT recognition provides income tax benefits (angel tax, 80-IAC) but does not exempt startups from FEMA reporting obligations. FC-GPR must still be filed within 30 days of receiving any foreign investment regardless of DPIIT status.',
    },
  ],
}


// ─── Export all penalty calculator page configs ──────────────────────────────

export const penaltyCalculatorPages: Record<string, ToolPageConfig> = {
  'gst-late-filing': gstLateFilingPage,
  'gst-demand-notice': gstDemandPage,
  'director-kyc': directorKycPage,
  'mca-annual-filing': mcaFilingPage,
  'itr-late-filing': itrLateFilingPage,
  'tds-late-filing': tdsLateFilingPage,
  'pf-esic-penalty': pfEsicPage,
  'professional-tax-penalty': professionalTaxPage,
  'shops-establishment-penalty': shopEstablishmentPage,
  'startup-dpiit-compliance': dpiitFemaPage,
}

export function getPenaltyCalculatorPage(slug: string): ToolPageConfig | undefined {
  return penaltyCalculatorPages[slug]
}
