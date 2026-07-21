import { LearnPageConfig } from '../pages'

export const itrFiling: LearnPageConfig = {
  slug: 'do-i-need-to-file-itr',
  title: 'Do I Need to File an Income Tax Return?',
  seoTitle: 'Do I Need to File ITR in 2026? Mandatory vs Optional | Ollvy',
  seoDescription:
    'Check if ITR filing is mandatory for you in India. Covers salaried, freelancers, business owners, and NRIs - with 2025-26 thresholds and exemptions.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-to-file-itr',
  lastReviewed: 'April 2026',
  category: 'Tax',
  ctaServiceSlug: 'business-itr',
  relatedServiceSlugs: ['business-itr'],
  relatedLearnSlugs: ['which-itr-form-should-i-use', 'do-i-need-gst-registration', 'pvt-ltd-vs-llp'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },

  tool: {
    type: 'eligibility',
    title: 'Is ITR Filing Mandatory for You?',
    questions: [
      {
        text: 'What was your total income in FY 2024-25 - before any deductions?',
        options: [
          { value: 'below_250k', label: 'Below Rs. 2.5 lakh' },
          { value: '250k_to_500k', label: 'Rs. 2.5 lakh to Rs. 5 lakh' },
          { value: 'above_500k', label: 'Above Rs. 5 lakh' },
        ],
        exitOn: {
          above_500k: {
            type: 'mandatory',
            headline: 'You must file an Income Tax Return.',
            body: 'Your income is above the basic exemption limit. Filing is required under Section 139(1) of the Income Tax Act.',
            ctaLabel: 'File My ITR',
            ctaHref: '/checkout/business-itr',
          },
        },
      },
      {
        text: 'Does any of this apply to you?',
        options: [
          { value: 'tds_deducted', label: 'Tax was deducted at source from my salary, FD interest, or freelance payments' },
          { value: 'foreign_assets', label: 'I have a foreign bank account, investments abroad, or assets outside India' },
          { value: 'high_value_txn', label: 'I deposited Rs. 1 crore or more in a bank account, or spent Rs. 2 lakh or more on international travel, or paid electricity bills over Rs. 1 lakh' },
          { value: 'director', label: 'I am a director in any Indian company' },
          { value: 'none', label: 'None of these apply' },
        ],
        exitOn: {
          tds_deducted: {
            type: 'mandatory',
            headline: 'File to claim your TDS refund.',
            body: 'If you do not file, that deducted tax is gone. It takes 20-30 minutes and the money comes back to your account.',
            ctaLabel: 'File My ITR',
            ctaHref: '/checkout/business-itr',
          },
          foreign_assets: {
            type: 'mandatory',
            headline: 'Mandatory - foreign assets require filing.',
            body: 'Anyone with foreign assets or accounts must file an ITR regardless of income level.',
            ctaLabel: 'File My ITR',
            ctaHref: '/checkout/business-itr',
          },
          high_value_txn: {
            type: 'mandatory',
            headline: 'Mandatory due to high-value transactions.',
            body: 'Rule 12AB requires filing even if income is below the basic exemption limit when you have made high-value transactions.',
            ctaLabel: 'File My ITR',
            ctaHref: '/checkout/business-itr',
          },
          director: {
            type: 'mandatory',
            headline: 'Mandatory - all company directors must file.',
            body: 'Every director of an Indian company must file an ITR, regardless of income level or whether the company was active.',
            ctaLabel: 'File My ITR',
            ctaHref: '/checkout/business-itr',
          },
        },
      },
      {
        text: 'How old are you?',
        options: [
          { value: 'under_60', label: 'Under 60' },
          { value: '60_to_80', label: '60 to 80 (Senior Citizen)' },
          { value: 'above_80', label: 'Above 80 (Super Senior Citizen)' },
        ],
      },
      {
        text: 'Are you planning to apply for any of these in the next 12 months?',
        options: [
          { value: 'yes_loan', label: 'A home loan or business loan' },
          { value: 'yes_visa', label: 'A US, UK, or Schengen visa' },
          { value: 'yes_tender', label: 'A government tender or contract' },
          { value: 'no', label: 'None of these' },
        ],
      },
    ],
    resultRules: [
      {
        if: [
          { q: 0, anyOf: ['250k_to_500k'] },
          { q: 2, anyOf: ['under_60'] },
        ],
        result: {
          type: 'mandatory',
          headline: 'You must file an Income Tax Return.',
          body: 'Your income is above Rs. 2.5 lakh. For individuals under 60, filing is mandatory under Section 139(1). You may owe zero tax after rebate, but filing is still required.',
          ctaLabel: 'File My ITR',
          ctaHref: '/checkout/business-itr',
        },
      },
      {
        if: [
          { q: 0, anyOf: ['250k_to_500k'] },
          { q: 2, anyOf: ['60_to_80'] },
        ],
        result: {
          type: 'conditional',
          headline: 'Depends on whether your income is above Rs. 3 lakh.',
          body: 'For senior citizens between 60 and 80, the exemption limit is Rs. 3 lakh. If your income is below Rs. 3 lakh, filing is not mandatory. If it is between Rs. 3 lakh and Rs. 5 lakh, filing is technically required - though you may owe zero tax.',
        },
      },
      {
        if: [
          { q: 0, anyOf: ['250k_to_500k'] },
          { q: 2, anyOf: ['above_80'] },
        ],
        result: {
          type: 'not_required',
          headline: 'Filing is likely not mandatory.',
          body: 'For super senior citizens above 80, the exemption limit is Rs. 5 lakh. Income below Rs. 5 lakh is below the threshold - filing is not mandatory unless other triggers apply (foreign assets, TDS deducted, director role, etc.).',
        },
      },
      {
        if: [{ q: 3, anyOf: ['yes_loan', 'yes_visa', 'yes_tender'] }],
        result: {
          type: 'recommended',
          headline: 'File - you will need it.',
          body: 'Lenders require 2-3 years of ITR. Visa embassies ask for it. Government tenders require it as pre-qualification. File now so you have the record when you need it.',
          ctaLabel: 'File My ITR',
          ctaHref: '/checkout/business-itr',
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Not strictly required - but worth filing anyway.',
      body: 'Your income appears to be below the taxable limit. Filing a nil return costs nothing and takes about 30 minutes. What you get: a formal income record that banks, visa offices, and government departments accept. It also protects against future notices asking you to explain where your money came from.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHO HAS TO FILE',
      body: 'Under Section 139(1) of the Income Tax Act, 1961, you must file if your gross income - before any deductions - crosses the basic exemption limit. But income level is not the only trigger.',
      bullets: [
        'Gross income above Rs. 2.5 lakh (under 60), Rs. 3 lakh (60 to 80), or Rs. 5 lakh (above 80)',
        'Cash deposited above Rs. 1 crore in one or more current accounts during the year',
        'Spent more than Rs. 2 lakh on international travel',
        'Electricity bills totalled more than Rs. 1 lakh across the year',
        'You own property abroad, have a foreign bank account, or earn income outside India',
        'You run a company or a firm - all companies and firms must file regardless of profit or loss',
        'You want to carry forward a loss to set off against future income',
        'Tax was deducted from any payment and you want it back',
      ],
      table: {
        caption: 'ITR Filing: Basic Exemption Limits and Due Dates (FY 2025-26 / AY 2026-27)',
        headers: ['Taxpayer', 'Exemption Limit', 'Due Date', 'Late Fee'],
        rows: [
          ['Individual below 60', 'Rs. 2.5 lakh', '31 July 2026', 'Rs. 1,000 (income ≤ Rs. 5L) or Rs. 5,000'],
          ['Senior Citizen (60-80 years)', 'Rs. 3 lakh', '31 July 2026', 'Rs. 1,000 or Rs. 5,000'],
          ['Super Senior Citizen (above 80)', 'Rs. 5 lakh', '31 July 2026', 'Rs. 1,000 only'],
          ['Private Limited Company', 'No exemption', '31 October 2026', 'Rs. 10,000'],
          ['LLP or Partnership Firm', 'No exemption', '31 July or 31 October (if audit)', 'Rs. 1,000-10,000'],
          ['Business requiring tax audit', 'No exemption', '31 October 2026', 'Rs. 10,000'],
          ['Director in any company', 'No exemption (must file regardless)', 'As per entity type', 'Rs. 1,000-10,000'],
          ['Foreign assets/income holder', 'No exemption (must file regardless)', 'As per entity type', 'Rs. 1,000-10,000'],
        ],
      },
      note: 'Source: Section 139(1), Income Tax Act 1961; Rule 12AB, Income Tax Rules 1962',
    },
    {
      number: '02',
      heading: 'NO EXCEPTIONS - THESE ARE HARD MANDATORY',
      body: 'If any of these apply, you must file.',
      bullets: [
        'You are a company or LLP - mandatory every year, even with zero income and no activity',
        'Your total income exceeds the basic exemption limit for your age',
        'High-value transaction: bank deposit above Rs. 1 crore, international travel above Rs. 2 lakh, electricity above Rs. 1 lakh',
        'You are a director in any Indian company - even a dormant startup',
        'You invested more than Rs. 10 lakh in mutual funds or stocks during the year',
        'You hold any asset outside India or have a foreign bank account',
        'Tax was deducted at source and you want to claim it back',
      ],
      table: {
        caption: 'High-Value Transactions That Trigger Mandatory ITR Filing (Rule 12AB)',
        headers: ['Transaction', 'Threshold', 'Applies to'],
        rows: [
          ['Cash deposit in current account(s)', 'Rs. 1 crore or more', 'All individuals, regardless of income'],
          ['International travel expenses', 'Rs. 2 lakh or more', 'All individuals, regardless of income'],
          ['Electricity bill payments', 'Rs. 1 lakh or more (aggregate)', 'All individuals, regardless of income'],
          ['Mutual fund/stock purchases', 'Rs. 10 lakh or more', 'All individuals, regardless of income'],
          ['Foreign bank account or asset', 'Any amount', 'All individuals and entities'],
          ['TDS deducted on income', 'Any amount', 'Must file to claim refund'],
        ],
      },
      note: 'Source: CBDT Notification; Rule 12AB, Income Tax (6th Amendment) Rules, 2022',
    },
    {
      number: '03',
      heading: 'REASONS TO FILE EVEN WHEN YOU DO NOT HAVE TO',
      body: 'Sometimes the best reason to file has nothing to do with tax.',
      bullets: [
        'Visa applications: US, UK, and Schengen embassies routinely ask for 2-3 years of ITR as income proof',
        'Home loans and car loans: Banks and NBFCs ask self-employed applicants for ITR copies; increasingly salaried applicants too',
        'Government tenders: ITR submission is a standard pre-qualification requirement',
        'Premium credit cards: Most private banks require ITR for cards above a certain credit limit',
        'Income documentation: If you earn from multiple sources (rent, tuition, freelance), an ITR gives you formal proof',
        'Carrying forward losses: Capital losses and business losses can only be used against future profits if you file by the due date',
      ],
    },
    {
      number: '04',
      heading: 'WHEN YOU GENUINELY DO NOT NEED TO FILE',
      body: 'You are truly exempt if all of these are true at the same time:',
      bullets: [
        'Gross income below Rs. 2.5 lakh (under 60), Rs. 3 lakh (60-80), or Rs. 5 lakh (above 80) - before any deductions',
        'No foreign assets, accounts, or income',
        'No high-value transactions',
        'No tax deducted from any income',
        'No capital or business losses to carry forward',
        'Not a director in any company',
        'No plans for loans, visas, or government contracts',
      ],
      note: 'Senior citizens above 75 with only pension and interest income from the same bank are exempt from filing if the bank deducts TDS on their behalf under Section 194P.',
    },
    {
      number: '05',
      heading: 'WHAT MISSING THE DEADLINE COSTS YOU',
      body: 'Missing the due date (July 31 for most individuals) has consequences that compound.',
      bullets: [
        'Late filing fee: Rs. 5,000 if total income is above Rs. 5 lakh; Rs. 1,000 if below (Section 234F)',
        'Interest on tax due: 1% per month from the original due date until you file (Section 234A)',
        'Losses lost permanently: Capital losses, business losses, and speculation losses cannot be carried forward if you miss the due date',
        'Assessment risk: The department can reopen your assessment up to 3 years back, or up to 10 years for larger undisclosed amounts',
        'Prosecution: Wilful failure to file when tax was owed can lead to prosecution under Section 276CC',
      ],
      note: 'Use our penalty calculator for exact amounts: /tools/penalty-calculator/itr-late-filing',
    },
    {
      number: '06',
      heading: 'ANSWER YES TO ANY OF THESE - THEN FILE',
      body: '',
      bullets: [
        'Is your gross income above your age-based exemption limit? YES - mandatory',
        'Was tax deducted from your salary, FD interest, or any payment? YES - file to get your refund',
        'Do you have any foreign assets or income? YES - mandatory',
        'Are you a director in any company? YES - mandatory',
        'Do you need a loan, visa, or government contract in the next year? YES - file now',
        'Did you make a large bank deposit, international trip, or pay high electricity bills? YES - mandatory',
        'All NO? You are probably exempt - but filing a nil return anyway takes 30 minutes and creates a useful record',
      ],
    },
  ],

  faqs: [
    {
      q: 'I am a student with no income. Should I file?',
      a: 'If you have truly zero income and zero assets, there is nothing to file. But if you have a bank account where interest is credited and TDS was deducted on it, file to claim that refund. It takes 20 minutes and the money comes back to your account.',
    },
    {
      q: 'My employer deducts TDS every month. Do I still need to file?',
      a: "Yes. Your employer's TDS deduction (via Form 24Q) is not a substitute for your own ITR filing. You still need to file to declare all income, claim deductions (HRA, home loan interest, 80C investments), and get back any excess TDS deducted.",
    },
    {
      q: 'I live abroad and earn in a foreign country. Do I need to file in India?',
      a: 'If you are an NRI with any income originating in India - rental income, capital gains on Indian property or shares, interest on an NRO account - and that income crosses the basic exemption limit, you must file. Also file if TDS was deducted from Indian income and you want a refund.',
    },
    {
      q: 'What is the difference between ITR-1 and ITR-2?',
      a: 'ITR-1 is for salaried individuals with income from salary, one house property, and interest, with total income below Rs. 50 lakh and no capital gains. ITR-2 covers everyone else - capital gains, more than one property, foreign income, above Rs. 50 lakh, or if you are a director in a company. Check our ITR form guide.',
    },
    {
      q: 'Can I file after the July 31 deadline?',
      a: 'Yes. A belated return can be filed up to December 31 of the assessment year. You will pay a late fee (Rs. 1,000 to Rs. 5,000) and lose the ability to carry forward losses. After December 31, filing is generally not possible without special circumstances.',
    },
  ],
}
