// lib/guides/pages/business-itr-fy2025-26.ts
import { LearnPageConfig } from '../pages';

export const businessITRFY2526: LearnPageConfig = {
  slug: 'business-itr-fy2025-26',
  title: 'Business ITR FY2025-26: Filing Guide and Due Date',
  seoTitle: 'Business ITR FY2025-26 Filing Guide - Due October 31, 2026 | Ollvy',
  seoDescription:
    'Complete guide to filing Business Income Tax Return for FY2025-26 (AY2026-27). Due date is October 31, 2026 for companies and audit cases. Learn about ITR-6, ITR-5, and ITR-3 requirements.',
  canonicalUrl: 'https://www.ollvy.com/guides/business-itr-fy2025-26',
  lastReviewed: 'April 2026',
  category: 'Income Tax Filing',
  ctaServiceSlug: 'business-itr',
  relatedServiceSlugs: ['business-itr', 'mca-annual-filing', 'tds-monthly-compliance'],
  relatedLearnSlugs: ['itr-filing', 'itr-form-selection', 'tds-return-q2-fy2026-27'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing', 'mca-annual-filing'],
    documentChecklists: ['business-itr'],
  },
  deadline: 'October 31, 2026',
  deadlineNote:
    'For companies, LLPs with audit requirement, and individuals/firms requiring tax audit. Non-audit cases have earlier deadlines.',

  sections: [
    {
      number: '01',
      heading: 'BUSINESS ITR FY2025-26 OVERVIEW',
      body: 'Business Income Tax Return for FY2025-26 (Assessment Year 2026-27) covers income earned during April 2025 to March 2026. The due date depends on whether your business requires audit.\n\nFor companies (Private Limited, Public, OPC), the due date is October 31, 2026. For LLPs and firms requiring audit, the same deadline applies. Non-audit cases (small businesses below turnover threshold) have the July 31 deadline.',
      note: 'Source: Section 139(1) of Income Tax Act, 1961.',
    },
    {
      number: '02',
      heading: 'WHICH ITR FORM TO FILE',
      body: 'Choose the correct ITR form based on your business structure:',
      bullets: [
        'ITR-6: Companies (Private Limited, Public Limited, One Person Company, Section 8) - most common for corporate businesses',
        'ITR-5: LLPs, Partnership firms, AOPs, BOIs - limited liability partnerships and traditional partnerships',
        'ITR-3: Proprietors and individuals with business income - if you run business as an individual',
        'ITR-7: Trusts, political parties, institutions claiming exemption under sections 10(23A), 10(23B), etc.',
      ],
      note: 'Companies always file ITR-6 regardless of size. LLPs file ITR-5.',
    },
    {
      number: '03',
      heading: 'DOCUMENTS REQUIRED FOR BUSINESS ITR',
      body: 'Gather these documents before starting your tax return filing:',
      bullets: [
        'Audited financial statements - Balance Sheet, Profit & Loss Account, Notes to Accounts',
        'Tax audit report (Form 3CA/3CB with 3CD) - if turnover exceeds audit threshold',
        'Computation of income - showing adjustments from book profit to taxable income',
        'TDS certificates - Form 16A, Form 16, 26AS/AIS reconciliation',
        'Advance tax challans - self-assessment and advance tax paid during the year',
        'Details of capital gains - sale of shares, property, or other capital assets',
        'GST returns summary - for cross-verification of turnover',
        'Bank statements - for all business accounts',
        'Details of related party transactions - if applicable',
      ],
    },
    {
      number: '04',
      heading: 'TAX AUDIT REQUIREMENTS',
      body: 'Tax audit under Section 44AB is mandatory in these cases:',
      bullets: [
        'Business turnover exceeds Rs. 1 crore (Rs. 10 crore if cash transactions are below 5%)',
        'Professional gross receipts exceed Rs. 50 lakh',
        'Claiming presumptive taxation but declaring income below prescribed limits',
        'Turnover exceeds Rs. 2 crore in any previous year (if opting for presumptive taxation)',
        'Tax audit report is due on October 31, 2026 - same as ITR due date',
        'Audit must be conducted by a Chartered Accountant in practice',
      ],
      note: 'The tax audit due date was shifted from September 30 to October 31 in recent years.',
    },
    {
      number: '05',
      heading: 'PENALTY FOR LATE FILING',
      body: 'Missing the October 31, 2026 deadline results in significant penalties:',
      bullets: [
        'Late filing fee under Section 234F: Rs. 5,000 (or Rs. 1,000 if total income is below Rs. 5 lakh)',
        'Interest under Section 234A: 1% per month on unpaid tax from due date to filing date',
        'Interest under Section 234B: 1% per month if advance tax paid is less than 90% of assessed tax',
        'Interest under Section 234C: For delay in quarterly advance tax installments',
        'Penalty for not getting audit: Section 271B - Rs. 1.5 lakh or 0.5% of turnover, whichever is lower',
        'Loss carry forward denied: Losses cannot be carried forward if ITR is filed after due date',
      ],
    },
    {
      number: '06',
      heading: 'KEY FILING STEPS FOR BUSINESS ITR',
      body: 'Follow this process to file your business income tax return:',
      bullets: [
        'Step 1: Complete statutory audit (if applicable) and finalize accounts',
        'Step 2: Get tax audit conducted and obtain Form 3CA/3CB with 3CD',
        'Step 3: Upload tax audit report on e-filing portal before or along with ITR',
        'Step 4: Reconcile TDS with Form 26AS and AIS - claim credit only for verified TDS',
        'Step 5: Prepare computation of income with all adjustments and deductions',
        'Step 6: Fill ITR form online or using utility - prefill data where available',
        'Step 7: Verify and submit - use DSC for companies, EVC for others',
        'Step 8: E-verify within 30 days if not using DSC',
      ],
    },
    {
      number: '07',
      heading: 'COMMON MISTAKES TO AVOID',
      body: 'Watch out for these frequent errors in business ITR filing:',
      bullets: [
        'Mismatch between ITR turnover and GST returns - reconcile before filing',
        'TDS credit not matching 26AS - claim only what appears in Form 26AS',
        'Missing related party transaction details - mandatory disclosure for companies',
        'Incorrect MAT (Minimum Alternate Tax) computation - verify Section 115JB calculation',
        'Not claiming eligible deductions - 80G donations, R&D expenses, etc.',
        'Forgetting to disclose foreign assets - mandatory for companies with overseas holdings',
        'Late payment of advance tax interest - calculate 234B and 234C correctly',
      ],
    },
  ],

  faqs: [
    {
      q: 'What is the due date for Business ITR if my company does not require audit?',
      a: 'All companies must file ITR-6 by October 31 regardless of audit requirement - companies are mandatorily required to be audited under Companies Act even if not under Income Tax Act. For LLPs or firms not requiring tax audit, the due date is July 31.',
    },
    {
      q: 'Can I file a revised return if I find errors after October 31?',
      a: 'Yes, a revised return under Section 139(5) can be filed before December 31, 2026 (end of relevant assessment year) or before completion of assessment, whichever is earlier. However, losses cannot be carried forward if the original return was filed late.',
    },
    {
      q: 'Is tax audit report uploaded separately from ITR?',
      a: 'Yes, the tax audit report (Form 3CA/3CB with 3CD) is uploaded separately on the e-filing portal under the tax audit section. The ITR then picks up the audit details. Both must be submitted by October 31, 2026.',
    },
    {
      q: 'My company made losses this year. Do I still need to file ITR?',
      a: 'Yes, filing ITR is mandatory for all companies regardless of profit or loss. Moreover, to carry forward losses for set-off against future profits, ITR must be filed before the due date (October 31, 2026). Late filing means you lose the ability to carry forward the loss.',
    },
    {
      q: 'What happens if I miss both audit and ITR deadline?',
      a: 'Penalty under Section 271B for non-audit (Rs. 1.5 lakh or 0.5% of turnover), late filing fee under Section 234F (Rs. 5,000), and interest under Section 234A on unpaid tax. File as soon as possible to stop further interest accumulation.',
    },
  ],
};
