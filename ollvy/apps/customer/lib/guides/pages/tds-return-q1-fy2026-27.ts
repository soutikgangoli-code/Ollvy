// lib/guides/pages/tds-return-q1-fy2026-27.ts
import { LearnPageConfig } from '../pages';

export const tdsQ1FY2627: LearnPageConfig = {
  slug: 'tds-return-q1-fy2026-27',
  title: 'TDS Return Q1 FY2026-27: Filing Guide and Due Date',
  seoTitle: 'TDS Return Q1 FY2026-27 Filing Guide - Due July 31, 2026 | Ollvy',
  seoDescription:
    'Complete guide to filing TDS Return for Q1 (Apr-Jun 2026) of FY2026-27. Due date is July 31, 2026. Learn about Form 24Q, 26Q, 27Q requirements and avoid late filing penalties.',
  canonicalUrl: 'https://www.ollvy.com/guides/tds-return-q1-fy2026-27',
  lastReviewed: 'April 2026',
  category: 'TDS Filing',
  ctaServiceSlug: 'tds-monthly-compliance',
  relatedServiceSlugs: ['tds-monthly-compliance', 'business-itr'],
  relatedLearnSlugs: ['tds-return-q4-fy2025-26', 'tds-return-q2-fy2026-27', 'tds-short-deduction-notice'],
  relatedTools: {
    penaltyCalculators: ['tds-late-filing'],
    documentChecklists: ['business-itr'],
    deadlines: ['tds-return-q2-fy2026-27'],
  },
  deadline: 'July 31, 2026',
  deadlineNote:
    'Q1 covers April to June 2026. This is the first quarter return for FY2026-27.',

  sections: [
    {
      number: '01',
      heading: 'TDS RETURN Q1 FY2026-27 OVERVIEW',
      body: 'TDS Return for Q1 FY2026-27 covers tax deducted at source during April, May, and June 2026. As the first quarter of a new financial year, this return establishes the baseline for your annual TDS compliance cycle.\n\nThe due date for filing Q1 TDS Return is July 31, 2026. This gives you one month after the quarter ends to compile all deduction records, reconcile challan payments, and file the return.',
      note: 'Source: Rule 31A of Income Tax Rules, 1962.',
    },
    {
      number: '02',
      heading: 'WHICH TDS FORMS TO FILE',
      body: 'Different forms apply based on the type of TDS deducted:',
      bullets: [
        'Form 24Q: TDS on salary payments to employees - basic salary, allowances, and other compensation',
        'Form 26Q: TDS on non-salary payments to residents - professional fees, rent, contractor payments, interest',
        'Form 27Q: TDS on payments to non-residents - interest, royalty, fees for technical services, dividends',
        'Form 27EQ: TCS (Tax Collected at Source) - for sellers collecting tax on specified goods like scrap, minerals',
      ],
      note: 'Q1 of a new financial year is a fresh start - ensure correct deductee details and updated TDS rates.',
    },
    {
      number: '03',
      heading: 'DOCUMENTS REQUIRED FOR Q1 TDS RETURN',
      body: 'Gather these documents before starting your TDS return filing:',
      bullets: [
        'TAN (Tax Deduction Account Number) of your organization',
        'PAN of all deductees - employees, vendors, landlords, professionals',
        'Challan details for TDS deposited - BSR code, challan serial number, deposit date, amount',
        'Payment records showing gross amount, TDS rate applied, and net payment',
        'For 24Q: Salary statements, declared investments for TDS estimation',
        'For 26Q: Invoices from vendors, rent agreements, professional service contracts',
        'Lower deduction certificates (Section 197) if applicable - new certificates for FY2026-27',
      ],
    },
    {
      number: '04',
      heading: 'PENALTY FOR LATE FILING',
      body: 'Missing the July 31, 2026 deadline results in the following penalties:',
      bullets: [
        'Late filing fee under Section 234E: Rs. 200 per day until the return is filed, capped at the total TDS amount',
        'Penalty under Section 271H: Minimum Rs. 10,000 to maximum Rs. 1,00,000 for failure to file or filing incorrect statements',
        'Interest on late deposit: If TDS was deposited late, interest at 1.5% per month applies from due date of deposit',
        'Form 16A delay: You cannot generate Form 16A certificates until the quarterly return is filed',
      ],
      note: 'Start filing early in July to avoid last-minute technical issues with TRACES.',
    },
    {
      number: '05',
      heading: 'HOW TO FILE TDS RETURN Q1',
      body: 'Follow these steps to file your Q1 TDS return:',
      bullets: [
        'Step 1: Download the latest RPU (Return Preparation Utility) from TRACES or tin-nsdl.com',
        'Step 2: Enter deductor details - TAN, PAN, address, responsible person details',
        'Step 3: Enter challan details - all TDS deposits made during Q1 with BSR codes',
        'Step 4: Enter deductee records - PAN, payment details, TDS deducted for each transaction',
        'Step 5: Validate the return using FVU (File Validation Utility) to check for errors',
        'Step 6: Generate the validated .fvu file',
        'Step 7: Upload on TRACES portal with digital signature or EVC',
        'Step 8: Download the provisional receipt and acknowledgment',
      ],
    },
    {
      number: '06',
      heading: 'NEW FINANCIAL YEAR CHECKLIST',
      body: 'Starting Q1 of a new financial year requires additional attention:',
      bullets: [
        'Verify updated TDS rates - budget changes may affect rates from April 1, 2026',
        'Collect fresh investment declarations from employees for salary TDS computation',
        'Renew lower deduction certificates (Section 197) - old certificates expire on March 31',
        'Update vendor PAN records - verify no PAN changes or inoperative PANs',
        'Check threshold limits - deduction thresholds may have changed in the new year',
        'Archive previous year data - keep FY2025-26 records accessible for corrections if needed',
      ],
    },
  ],

  faqs: [
    {
      q: 'What happens if I miss the July 31, 2026 deadline for Q1 TDS return?',
      a: 'Late filing fee of Rs. 200 per day under Section 234E starts accruing from August 1, 2026. Additionally, you cannot generate Form 16A for vendors until the return is filed. In extreme cases, penalty under Section 271H of Rs. 10,000 to Rs. 1,00,000 may apply.',
    },
    {
      q: 'Do TDS rates change from April 2026?',
      a: 'TDS rates may change based on the Union Budget announced in February 2026. Check the latest rates applicable from April 1, 2026 before filing Q1 returns. Key sections to verify include 194C (contractors), 194J (professionals), 194H (commission), and 194I (rent).',
    },
    {
      q: 'I have a new employee who joined in Q1. What PAN details do I need?',
      a: 'Collect the employee PAN, verify it on the Income Tax portal, and ensure it is linked with Aadhaar. For salary TDS in 24Q, you also need their investment declaration (Form 12BB) to compute tax correctly. Missing or invalid PAN attracts TDS at higher rates.',
    },
    {
      q: 'Can I revise Q4 FY2025-26 after filing Q1 FY2026-27?',
      a: 'Yes, correction statements for previous quarters can be filed even after filing returns for subsequent quarters. File the correction on TRACES by selecting the appropriate quarter and choosing the correction return type.',
    },
  ],
};
