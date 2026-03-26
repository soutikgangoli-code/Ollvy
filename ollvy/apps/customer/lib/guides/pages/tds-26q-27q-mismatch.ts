// lib/guides/pages/tds-26q-27q-mismatch.ts
import { LearnPageConfig } from '../pages';

export const tds26q27qMismatch: LearnPageConfig = {
  slug: 'tds-26q-27q-mismatch',
  title: 'TDS Mismatch Notice: 26Q / 27Q Return vs Actual Deposits',
  seoTitle: 'TDS 26Q / 27Q Mismatch Notice 2025: How to Correct and Respond | Ollvy',
  seoDescription: 'Got a TDS mismatch notice about 26Q or 27Q discrepancies? Your TDS return does not match deposits. Understand how to correct and what the consequences are.',
  canonicalUrl: 'https://www.ollvy.com/guides/tds-26q-27q-mismatch',
  lastReviewed: 'March 2025',
  category: 'TDS Notice',
  ctaServiceSlug: 'tds-monthly-compliance',
  relatedServiceSlugs: ['tds-monthly-compliance', 'business-itr'],
  relatedLearnSlugs: ['tds-short-deduction-notice', 'tds-194c-194j-demand', 'income-tax-143-1-intimation'],
  relatedTools: {
    penaltyCalculators: ['tds-late-filing'],
    documentChecklists: ['business-itr'],
  },
  severity: 'serious',
  deadline: '30 days to file correction return',
  deadlineNote: 'Every quarter you delay a TDS correction, the interest compounds. File the correction TDS return as soon as possible.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS A TDS MISMATCH AND WHY IT HAPPENS',
      body: 'Your TDS return (Form 26Q for domestic non-salary payments, Form 27Q for foreign payments) declares the deductions made and deposited. The TRACES system compares this against actual challan deposits using BSR codes and challan serial numbers.\n\nMismatches arise when: the challan details entered in the TDS return do not match the actual challan; TDS was deposited but not linked to the correct quarter in the return; payments were made but the TDS return was filed with incorrect PAN of the deductee; or TDS was deducted but deposited in a different quarter than the return shows.',
      note: 'Source: Sections 200, 200A, Income Tax Act, 1961. TRACES processing rules.',
    },
    {
      number: '02',
      heading: 'HOW TO FILE A TDS CORRECTION RETURN',
      body: 'Most TDS mismatches are resolved through a correction return filing on TRACES.',
      bullets: [
        'Log in to TRACES (tdscpc.gov.in) using your TAN credentials',
        'Download the original filed return in Justification Report format to identify exactly which entries are mismatched',
        'Prepare the correction file using your TDS software (Cleartax, TDSMAN, or Winman TDS are commonly used)',
        'Types of corrections: Challan correction (wrong BSR code or serial number), deductee PAN correction (wrong PAN entered), amount correction (wrong deduction amount), addition of new deductee entries',
        'Upload the correction file on TRACES. Processing takes 3-7 working days.',
        'After correction processing, the Justification Report should reflect the corrected position and the mismatch should close.',
      ],
    },
    {
      number: '03',
      heading: 'INTEREST THAT HAS BEEN ACCUMULATING',
      body: 'Beyond fixing the mismatch, check whether any interest is due:',
      bullets: [
        'Interest for late deduction: 1% per month from due date of deduction to date of actual deduction',
        'Interest for late deposit: 1.5% per month from date of deduction to date of deposit',
        'If the mismatch is because TDS was deducted but challan was entered incorrectly: the actual deposit exists but is just linked wrong. In this case, no tax interest should arise once the correction is made - but verify.',
        'If TDS was genuinely deposited late: Interest applies and must be paid via a fresh challan. Include this challan in your correction return.',
      ],
    },
  ],

  faqs: [
    {
      q: 'I filed 26Q with a wrong PAN for a deductee. How does this affect them?',
      a: 'If you entered the wrong PAN, the TDS credit will not appear in that person\'s Form 26AS. They cannot claim the TDS against their tax liability. You must file a correction return with the correct PAN. Once processed, the credit will appear in their 26AS.',
    },
    {
      q: 'My correction TDS return has been rejected by TRACES. What do I do?',
      a: 'Rejection reasons are shown in the processing status. Common reasons: the original return is too old for online correction (needs to be submitted offline to the TIN facilitation centre), or there is a mismatch in the KYC details of the TAN. Identify the specific rejection reason and address it - the TRACES helpline (1800 103 0344) can assist.',
    },
  ],
};
