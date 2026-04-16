// lib/guides/pages/gst-gstr9-annual-return-mismatch.ts
import { LearnPageConfig } from '../pages';

export const gstGstr9AnnualReturnMismatch: LearnPageConfig = {
  slug: 'gst-gstr9-annual-return-mismatch',
  title: 'GST Annual Return Mismatch Notice: GSTR-9 vs GSTR-3B Discrepancy',
  seoTitle: 'GSTR-9 vs GSTR-3B Mismatch Notice: How to Reconcile (2026) | Ollvy',
  seoDescription: 'GSTR-9 discrepancies often trigger ASMT-10 scrutiny. Prepare a full year reconciliation matching GSTR-9 lines to GSTR-3B. GSTR-9 cannot be amended after filing.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-gstr9-annual-return-mismatch',
  lastReviewed: 'April 2026',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-monthly',
  ctaSecondarySlug: 'gst-registration',
  relatedServiceSlugs: ['gst-monthly', 'gst-registration', 'business-itr'],
  relatedLearnSlugs: ['gst-asmt-10-notice', 'gst-drc-01-notice', 'gst-gstr2b-itc-mismatch'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing', 'gst-demand-notice'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'serious',
  deadline: '15-30 days as specified in notice',
  deadlineNote: 'GSTR-9 discrepancy notices are increasing as the department uses annual returns as an audit trigger. The quality of your annual return matters.',

  sections: [
    {
      number: '01',
      heading: 'WHAT TRIGGERED THIS NOTICE',
      body: "GSTR-9 is the annual return that reconciles your monthly GST filings for the entire financial year. When the department's system compares your GSTR-9 against your GSTR-3B monthly filings (or your GSTR-1 invoice data), and finds differences that cannot be explained by standard adjustments, it triggers a notice.\n\nThis notice is typically an ASMT-10 scrutiny notice specifically citing GSTR-9 discrepancies.",
      note: 'Source: Section 44 (GSTR-9 filing), Section 61 (scrutiny), CGST Act 2017.',
    },
    {
      number: '02',
      heading: 'COMMON GSTR-9 DISCREPANCIES THAT TRIGGER NOTICES',
      body: '',
      bullets: [
        "Turnover in GSTR-9 is lower than aggregate turnover in monthly GSTR-3B: You may have amended prior months' returns at the GSTR-9 level without the monthly GSTR-3B reflecting the same reduction.",
        "ITC claimed in GSTR-9 is higher than ITC in monthly GSTR-3B: You may have claimed additional ITC in GSTR-9 that was not claimed in the relevant months' GSTR-3B.",
        'Tax paid figures differ: Tax paid in GSTR-9 does not match cumulative GSTR-3B payment amounts.',
        'Credit notes and amendments not captured correctly: The treatment of credit notes in GSTR-9 versus how they were handled month-to-month differs.',
        'Reverse charge supply not matching: RCM (reverse charge mechanism) supplies declared in GSTR-9 differ from what was paid in GSTR-3B monthly.',
      ],
    },
    {
      number: '03',
      heading: 'HOW TO RESPOND',
      body: 'Your ASMT-10/11 reply for GSTR-9 discrepancies needs to be more comprehensive than a regular monthly return scrutiny reply:',
      bullets: [
        "Prepare a full year reconciliation: Map every line of GSTR-9 back to the relevant month's GSTR-3B entry.",
        'Explain each difference specifically: Amendment corrections, credit notes issued across years, advances adjusted, composition transactions, exempt supply adjustments - each needs a line-by-line explanation.',
        'Attach the filed GSTR-9/9C and all 12 GSTR-3B returns for the year: Give the officer everything in one place.',
        'GSTR-9C (reconciliation statement): If you filed GSTR-9C (audit-certified reconciliation for businesses above Rs. 5 crore), the discrepancy you are being asked about may already be explained there. Reference it.',
        'If you made errors in GSTR-9: An amendment to GSTR-9 is not possible after filing. Your only option is to provide the correct position in your reply with supporting data and offer to pay any shortfall with interest.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Can I amend a filed GSTR-9?',
      a: 'No. GSTR-9 cannot be amended after filing. If there are errors, the correct approach is to acknowledge them in your reply to the notice, provide the actual correct figures with supporting data, and offer to pay any resulting tax liability with interest.',
    },
    {
      q: 'The GSTR-9 mismatch is because I forgot to include some transactions in my GSTR-9. Should I admit this in my reply?',
      a: 'If transactions were genuinely missed, it is better to acknowledge this proactively in your reply, provide the correct figures, and pay the difference with interest. Trying to explain away a genuine omission with reconciliation gymnastics often makes things worse. Honest acknowledgement with payment is treated more favourably than contested misrepresentation.',
    },
    {
      q: 'What documents do I attach to support my GSTR-9 reply?',
      a: 'At minimum: the filed GSTR-9, GSTR-9C (if applicable), all twelve GSTR-3B returns for the year, all twelve GSTR-1 returns, and a monthly reconciliation sheet mapping GSTR-9 to GSTR-3B line by line. If you have supporting documents for specific adjustments (credit notes, advance adjustments), include those.',
    },
  ],

  sources: [
    { name: 'CGST Act, 2017 (Section 44)', url: 'https://www.gst.gov.in', description: 'GSTR-9 annual return filing requirements' },
    { name: 'CGST Rules, 2017 (Rule 80)', url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html', description: 'Format and content requirements for GSTR-9' },
  ],
};
