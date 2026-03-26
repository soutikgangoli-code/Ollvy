// lib/learn/pages/tds-short-deduction-notice.ts
import { LearnPageConfig } from '../pages';

export const tdsShortDeductionNotice: LearnPageConfig = {
  slug: 'tds-short-deduction-notice',
  title: 'TDS Short Deduction or Non-Deduction Notice from TRACES',
  seoTitle: 'TDS Short Deduction Notice from TRACES 2025: How to Respond | Ollvy',
  seoDescription: 'Got a TDS short deduction or non-deduction notice from TRACES? Understand why it was generated, what interest and penalty applies, and how to regularise.',
  canonicalUrl: 'https://www.ollvy.com/learn/tds-short-deduction-notice',
  lastReviewed: 'March 2025',
  category: 'TDS Notice',
  ctaServiceSlug: 'tds-notice-response',
  relatedServiceSlugs: ['tds-notice-response', 'tds-filing'],
  relatedLearnSlugs: ['tds-26q-27q-mismatch', 'tds-194c-194j-demand', 'income-tax-143-1-intimation'],
  severity: 'serious',
  deadline: '30 days from TRACES intimation',
  deadlineNote: 'Interest on short/non-deduction accumulates at 1-1.5% per month from the date of payment or deductible event. The longer you wait, the more it grows.',

  sections: [
    {
      number: '01',
      heading: 'WHY YOU RECEIVED THIS NOTICE',
      body: 'TDS (Tax Deducted at Source) is a withholding obligation. When you make certain payments above specified thresholds - contractor fees, professional fees, rent, commission, salary - you are legally required to deduct a percentage of that payment and deposit it with the government.\n\nA short deduction notice means the TRACES system (the TDS processing system run by the income tax department) has found that you either deducted less than you were required to, or did not deduct at all, for a particular payment or set of payments.',
      note: 'Source: Chapter XVII, Income Tax Act, 1961. TDS provisions: Sections 192 to 196D.',
    },
    {
      number: '02',
      heading: 'HOW THE TRACES SYSTEM DETECTS SHORT DEDUCTION',
      body: 'TRACES cross-checks several data sources:',
      bullets: [
        'Your TDS returns (Form 26Q, 27Q, 24Q) against the payments declared therein',
        'GST invoices received from your vendors (which are now cross-referenced with TDS data in some cases)',
        'High-value transaction data from banks',
        'Complaints filed by payees who expected TDS to be deducted',
        'Audit observations from tax audits of other businesses that list you as a payer',
      ],
    },
    {
      number: '03',
      heading: 'INTEREST AND PENALTY FOR TDS DEFAULT',
      body: 'The financial consequences of TDS non-deduction or late deduction are structured and significant.',
      bullets: [
        'Interest for non-deduction (Section 201(1A)): 1% per month from the date the amount was payable or paid until the date TDS is actually deducted. If payment was already made to the vendor without TDS, 1% applies from date of payment to date of deduction from vendor or alternate recovery.',
        'Interest for late deposit after deduction (Section 201(1A)): 1.5% per month from the date TDS was deducted until the date it is deposited with the government.',
        'Penalty under Section 271C: Equal to the amount of TDS that was not deducted. This is discretionary but serious for large amounts.',
        'Prosecution under Section 276B: Failure to deduct and deposit TDS can lead to criminal prosecution with imprisonment of 3 months to 7 years.',
        'Disallowance under Section 40(a)(ia): If TDS was not deducted on a payment to a resident (professional fees, rent, contractor), 30% of that expense is disallowed in your income tax computation. This indirectly increases your tax liability.',
      ],
      note: 'The Section 40(a)(ia) disallowance is particularly impactful for businesses with large contractor, professional, or rent expenses. Get this right.',
    },
    {
      number: '04',
      heading: 'HOW TO REGULARISE THE DEFAULT',
      body: '',
      bullets: [
        'If you did not deduct TDS and have not yet paid the vendor: Deduct TDS now from the next payment to the vendor, deposit it with the government via Challan 281, and file a correction in your TDS return.',
        'If you already paid the vendor without deducting TDS: You have two options - (a) Deduct from the next payment (cumulative arrears), or (b) Pay the TDS out of your own pocket and deposit it. Option (b) is cleaner from a compliance standpoint. Interest accrues from the date of the original payment.',
        'File a revised TDS return: After depositing the short/non-deducted amount, file a correction statement in TRACES (Form 26Q/27Q/24Q as applicable) reflecting the corrected deduction and deposit.',
        'Respond to the TRACES notice: Upload the correction details and challan on the TRACES portal in response to the notice.',
        'Apply for condonation of interest if the default was due to a genuine interpretive issue: Section 119(2)(b) allows waiver of interest in genuine cases. This requires a detailed application to the CBDT.',
      ],
    },
    {
      number: '05',
      heading: 'COMMON TDS OBLIGATIONS THAT GET MISSED',
      body: 'These are the most frequently defaulted TDS categories for SMEs:',
      bullets: [
        'Section 194C (Contractor payments): 1% for individuals/HUFs, 2% for others. Applies to payments above Rs. 30,000 per contract or Rs. 1 lakh aggregate annually. Many SMEs miss this for small contractors and gig workers.',
        'Section 194J (Professional fees): 10% for professional and technical services above Rs. 30,000 per year. Applies to CA fees, legal fees, medical consultation fees, architectural fees, software development.',
        'Section 194I (Rent): 10% on annual rent above Rs. 2.4 lakh for land and building; 2% for plant and machinery. Frequently missed by businesses renting office space.',
        'Section 194H (Commission): 5% on commission/brokerage above Rs. 15,000 per year.',
        'Section 194Q (Buyer\'s TDS on purchases): If your purchases from a single seller exceed Rs. 50 lakh in a year, 0.1% TDS is deducted by you. Introduced in 2021 and still frequently missed.',
      ],
    },
  ],

  faqs: [
    {
      q: 'The vendor whose payment is the subject of this notice has already paid their own income tax on the amount. Does TDS still apply?',
      a: 'Yes. The fact that the vendor paid their income tax independently does not extinguish your TDS obligation. However, if the payee has paid their full tax and submits a certificate showing this, your interest liability can be reduced or waived. This is addressed in Section 201(1) proviso and CBDT circulars.',
    },
    {
      q: 'I was not aware that TDS was required on a particular payment. Does ignorance reduce the penalty?',
      a: 'Not officially. TDS obligations are statutory and ignorance is not a defence. However, for penalties (not interest), the officer does have discretion to reduce or waive penalties in genuine cases of inadvertent error with immediate correction. This discretion is exercised more favourably if you correct proactively before or immediately after receiving notice.',
    },
  ],
};
