// lib/guides/pages/tds-return-q4-fy2025-26.ts
import { LearnPageConfig } from '../pages';

export const tdsQ4FY2526: LearnPageConfig = {
  slug: 'tds-return-q4-fy2025-26',
  title: 'TDS Return Q4 FY2025-26: Filing Guide and Due Date',
  seoTitle: 'TDS Return Q4 FY2025-26 Filing Guide - Due May 31, 2026 | Ollvy',
  seoDescription:
    'Complete guide to filing TDS Return for Q4 (Jan-Mar 2026) of FY2025-26. Due date is May 31, 2026. Learn about Form 24Q, 26Q, 27Q requirements and avoid late filing penalties.',
  canonicalUrl: 'https://www.ollvy.com/guides/tds-return-q4-fy2025-26',
  lastReviewed: 'April 2026',
  category: 'TDS Filing',
  ctaServiceSlug: 'tds-monthly-compliance',
  relatedServiceSlugs: ['tds-monthly-compliance', 'business-itr'],
  relatedLearnSlugs: ['tds-return-q1-fy2026-27', 'tds-short-deduction-notice'],
  relatedTools: {
    penaltyCalculators: ['tds-late-filing'],
    documentChecklists: ['business-itr'],
    deadlines: ['tds-return-q1-fy2026-27'],
  },
  deadline: 'May 31, 2026',
  deadlineNote:
    'Q4 covers January to March 2026. This is the final quarter return for FY2025-26.',

  sections: [
    {
      number: '01',
      heading: 'TDS RETURN Q4 FY2025-26 OVERVIEW',
      body: 'TDS Return for Q4 FY2025-26 covers tax deducted at source during January, February, and March 2026. As the final quarter of the financial year, this return is particularly important because it captures year-end transactions and must reconcile with Form 16/16A issuance.\n\nThe due date for filing Q4 TDS Return is May 31, 2026. Unlike other quarters where the due date is 31 days after quarter end, Q4 gets an extended deadline to allow for year-end reconciliation.',
      note: 'Source: Rule 31A of Income Tax Rules, 1962.',
    },
    {
      number: '02',
      heading: 'WHICH TDS FORMS TO FILE',
      body: 'Different forms apply based on the type of TDS deducted:',
      bullets: [
        'Form 24Q: TDS on salary payments to employees - includes detailed salary breakup and deductions',
        'Form 26Q: TDS on non-salary payments to residents - covers professional fees, rent, contractor payments, etc.',
        'Form 27Q: TDS on payments to non-residents - interest, royalty, fees for technical services',
        'Form 27EQ: TCS (Tax Collected at Source) - for sellers collecting tax on specified goods',
      ],
      note: 'Most businesses file 24Q (if they have employees) and 26Q (for vendor payments).',
    },
    {
      number: '03',
      heading: 'DOCUMENTS REQUIRED FOR Q4 TDS RETURN',
      body: 'Gather these documents before starting your TDS return filing:',
      bullets: [
        'TAN (Tax Deduction Account Number) of your organization',
        'PAN of all deductees - employees, vendors, landlords, professionals',
        'Challan details for TDS deposited - BSR code, challan serial number, deposit date, amount',
        'Payment records showing gross amount, TDS rate applied, and net payment',
        'For 24Q: Salary statements, investment proofs, Form 12BB submissions from employees',
        'For 26Q: Bills and invoices from vendors, rent agreements, professional service contracts',
        'Previous quarter TDS returns for reference and continuity',
      ],
    },
    {
      number: '04',
      heading: 'PENALTY FOR LATE FILING',
      body: 'Missing the May 31, 2026 deadline results in multiple penalties:',
      bullets: [
        'Late filing fee under Section 234E: Rs. 200 per day until the return is filed, capped at the total TDS amount',
        'Penalty under Section 271H: Minimum Rs. 10,000 to maximum Rs. 1,00,000 for failure to file or filing incorrect statements',
        'Interest on late deposit: If TDS was deposited late, interest at 1.5% per month applies from the due date of deposit',
        'Form 16/16A delay: You cannot generate Form 16 or 16A certificates until the quarterly return is filed, affecting your employees and vendors',
      ],
      note: 'Section 234E fee accrues daily - file as early as possible even if late.',
    },
    {
      number: '05',
      heading: 'HOW TO FILE TDS RETURN Q4',
      body: 'Follow these steps to file your Q4 TDS return:',
      bullets: [
        'Step 1: Download the latest RPU (Return Preparation Utility) from TRACES or tin-nsdl.com',
        'Step 2: Enter deductor details - TAN, PAN, address, responsible person details',
        'Step 3: Enter challan details - all TDS deposits made during Q4 with BSR codes',
        'Step 4: Enter deductee records - PAN, payment details, TDS deducted for each transaction',
        'Step 5: Validate the return using FVU (File Validation Utility) to check for errors',
        'Step 6: Generate the validated .fvu file',
        'Step 7: Upload on TRACES portal with digital signature or EVC',
        'Step 8: Note the provisional receipt number for your records',
      ],
    },
    {
      number: '06',
      heading: 'Q4 SPECIFIC REQUIREMENTS',
      body: 'Q4 has additional requirements compared to other quarters:',
      bullets: [
        'Salary annexure in 24Q: Q4 requires detailed salary breakup including exemptions, deductions under Chapter VI-A, and tax computation for each employee',
        'Form 16 generation: After Q4 filing, you must download and issue Form 16 to employees by June 15, 2026',
        'Form 16A generation: TDS certificates for non-salary payments must be issued within 15 days of Q4 return filing',
        'Reconciliation: Ensure total TDS in quarterly returns matches Form 26AS of deductees',
        'Correction statements: If you find errors after filing, submit correction returns before assessment deadlines',
      ],
    },
  ],

  faqs: [
    {
      q: 'What happens if I miss the May 31, 2026 deadline for Q4 TDS return?',
      a: 'Late filing fee of Rs. 200 per day under Section 234E starts accruing from June 1, 2026. Additionally, you cannot generate Form 16 for employees or Form 16A for vendors until the return is filed. In extreme cases of non-filing, penalty under Section 271H of Rs. 10,000 to Rs. 1,00,000 may also apply.',
    },
    {
      q: 'Can I file Q4 TDS return before the quarter ends?',
      a: 'No. TDS returns can only be filed after the quarter ends and all TDS has been deposited. For Q4, you can start filing from April 1, 2026, but ensure all March 2026 transactions and deposits are captured.',
    },
    {
      q: 'I made a mistake in my Q4 TDS return. How do I correct it?',
      a: 'File a correction statement on TRACES. You can correct PAN errors, challan errors, or add missed deductees. The correction statement should be filed using the same TAN and quarter selection, choosing the correction option instead of regular return.',
    },
    {
      q: 'Do I need to file nil TDS return for Q4 if no TDS was deducted?',
      a: 'Nil returns are not mandatory but are recommended for continuity of records. If you have been filing TDS returns and had no deductions in Q4, filing a nil return confirms no TDS liability for that quarter.',
    },
  ],
};
