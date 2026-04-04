// lib/guides/pages/tds-return-q2-fy2026-27.ts
import { LearnPageConfig } from '../pages';

export const tdsQ2FY2627: LearnPageConfig = {
  slug: 'tds-return-q2-fy2026-27',
  title: 'TDS Return Q2 FY2026-27: Filing Guide and Due Date',
  seoTitle: 'TDS Return Q2 FY2026-27 Filing Guide - Due October 31, 2026 | Ollvy',
  seoDescription:
    'Complete guide to filing TDS Return for Q2 (Jul-Sep 2026) of FY2026-27. Due date is October 31, 2026. Learn about Form 24Q, 26Q, 27Q requirements and avoid late filing penalties.',
  canonicalUrl: 'https://www.ollvy.com/guides/tds-return-q2-fy2026-27',
  lastReviewed: 'April 2026',
  category: 'TDS Filing',
  ctaServiceSlug: 'tds-monthly-compliance',
  relatedServiceSlugs: ['tds-monthly-compliance', 'business-itr'],
  relatedLearnSlugs: ['tds-return-q1-fy2026-27', 'tds-short-deduction-notice', 'business-itr-fy2025-26'],
  relatedTools: {
    penaltyCalculators: ['tds-late-filing'],
    documentChecklists: ['business-itr'],
  },
  deadline: 'October 31, 2026',
  deadlineNote:
    'Q2 covers July to September 2026. October is a busy month with multiple compliance deadlines - plan your TDS filing early.',

  sections: [
    {
      number: '01',
      heading: 'TDS RETURN Q2 FY2026-27 OVERVIEW',
      body: 'TDS Return for Q2 FY2026-27 covers tax deducted at source during July, August, and September 2026. This quarter typically sees increased business activity after the monsoon and includes important employee-related deadlines.\n\nThe due date for filing Q2 TDS Return is October 31, 2026. Note that this coincides with several other compliance deadlines including Business ITR and audit report submissions, so early planning is essential.',
      note: 'Source: Rule 31A of Income Tax Rules, 1962.',
    },
    {
      number: '02',
      heading: 'WHICH TDS FORMS TO FILE',
      body: 'Different forms apply based on the type of TDS deducted:',
      bullets: [
        'Form 24Q: TDS on salary payments to employees - includes salary annexure',
        'Form 26Q: TDS on non-salary payments to residents - professional fees, rent, contractor payments',
        'Form 27Q: TDS on payments to non-residents - interest, royalty, fees for technical services',
        'Form 27EQ: TCS (Tax Collected at Source) - for sellers collecting tax on specified goods',
      ],
      note: 'Q2 ends just before the festive season - ensure all vendor payments and TDS are properly captured.',
    },
    {
      number: '03',
      heading: 'DOCUMENTS REQUIRED FOR Q2 TDS RETURN',
      body: 'Gather these documents before starting your TDS return filing:',
      bullets: [
        'TAN (Tax Deduction Account Number) of your organization',
        'PAN of all deductees - employees, vendors, landlords, professionals',
        'Challan details for TDS deposited - BSR code, challan serial number, deposit date, amount',
        'Payment records showing gross amount, TDS rate applied, and net payment',
        'For 24Q: Salary statements, bonus payments if any, updated investment proofs',
        'For 26Q: Bills and invoices from vendors, rent agreements, professional service contracts',
        'Previous quarter (Q1) TDS return for reference',
      ],
    },
    {
      number: '04',
      heading: 'PENALTY FOR LATE FILING',
      body: 'Missing the October 31, 2026 deadline results in multiple penalties:',
      bullets: [
        'Late filing fee under Section 234E: Rs. 200 per day until the return is filed, capped at the total TDS amount',
        'Penalty under Section 271H: Minimum Rs. 10,000 to maximum Rs. 1,00,000 for failure to file or incorrect statements',
        'Interest on late deposit: If TDS was deposited late, interest at 1.5% per month applies from due date',
        'Form 16A delay: Cannot generate Form 16A certificates for Q2 vendors until return is filed',
      ],
      note: 'October 31 is also the due date for Business ITR - do not let TDS filing get deprioritized.',
    },
    {
      number: '05',
      heading: 'HOW TO FILE TDS RETURN Q2',
      body: 'Follow these steps to file your Q2 TDS return:',
      bullets: [
        'Step 1: Download the latest RPU (Return Preparation Utility) from TRACES or tin-nsdl.com',
        'Step 2: Enter deductor details - TAN, PAN, address, responsible person details',
        'Step 3: Enter challan details - all TDS deposits made during Q2 with BSR codes',
        'Step 4: Enter deductee records - PAN, payment details, TDS deducted for each transaction',
        'Step 5: Validate the return using FVU (File Validation Utility) to check for errors',
        'Step 6: Generate the validated .fvu file',
        'Step 7: Upload on TRACES portal with digital signature or EVC',
        'Step 8: Download the provisional receipt and keep for records',
      ],
    },
    {
      number: '06',
      heading: 'OCTOBER COMPLIANCE PLANNING',
      body: 'October 31 has multiple overlapping deadlines - plan your compliance calendar:',
      bullets: [
        'TDS Return Q2 FY2026-27 - due October 31, 2026',
        'Business ITR FY2025-26 (for audit cases) - due October 31, 2026',
        'Tax audit report - due October 31, 2026 (same as ITR for audit cases)',
        'Transfer pricing report - due October 31, 2026 (if applicable)',
        'Recommendation: Complete TDS return filing by October 20 to avoid last-minute rush',
        'Use the first two weeks of October for TDS, last two weeks for ITR and audit reports',
      ],
    },
  ],

  faqs: [
    {
      q: 'What happens if I miss the October 31, 2026 deadline for Q2 TDS return?',
      a: 'Late filing fee of Rs. 200 per day under Section 234E starts accruing from November 1, 2026. Additionally, you cannot generate Form 16A certificates until the return is filed. Penalty under Section 271H may also apply for delayed filing.',
    },
    {
      q: 'Should I prioritize TDS return or Business ITR if both are due on October 31?',
      a: 'File TDS return first (ideally by October 20). TDS returns are straightforward once data is compiled, while ITR may need last-minute adjustments based on audit findings. TDS filing also affects your vendors who need Form 16A.',
    },
    {
      q: 'We made advance salary payments for Diwali in September. How to handle TDS?',
      a: 'TDS on salary is deducted at the time of payment or credit, whichever is earlier. If advance salary for October was paid in September, TDS must be deducted and deposited in September, and reported in Q2 return (not Q3).',
    },
    {
      q: 'I found errors in Q1 TDS return. Can I correct them while filing Q2?',
      a: 'No, you cannot correct Q1 errors in the Q2 return. File a separate correction statement for Q1 on TRACES. You can file correction statements and regular returns independently of each other.',
    },
  ],
};
