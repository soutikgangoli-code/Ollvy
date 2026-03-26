// lib/guides/pages/itr-filing.ts
import { LearnPageConfig } from '../pages';

export const itrFiling: LearnPageConfig = {
  slug: 'do-i-need-to-file-itr',
  title: 'Do I Need to File an Income Tax Return?',
  seoTitle: 'Do I Need to File ITR in 2025? Mandatory vs Optional | Ollvy',
  seoDescription: 'Check if ITR filing is mandatory for you in India. Covers salaried, freelancers, business owners, and NRIs - with 2025-26 thresholds and exemptions.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-to-file-itr',
  lastReviewed: 'March 2025',
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
          { value: '500k_to_1cr', label: 'Rs. 5 lakh to Rs. 1 crore' },
          { value: 'above_1cr', label: 'Above Rs. 1 crore' },
        ],
        earlyExit: (answer) => {
          if (answer === 'above_1cr' || answer === '500k_to_1cr') {
            return {
              type: 'mandatory',
              headline: 'You must file an Income Tax Return.',
              body: 'Your income is above the basic exemption limit. Filing is required under Section 139(1) of the Income Tax Act.',
              ctaLabel: 'File My ITR',
              ctaHref: '/checkout/business-itr',
            };
          }
          return null;
        },
      },
      {
        text: 'Does any of this apply to you?',
        options: [
          { value: 'tds_deducted', label: 'Tax was deducted at source from my salary, FD interest, or freelance payments' },
          { value: 'foreign_assets', label: 'I have a foreign bank account, investments abroad, or assets outside India' },
          { value: 'high_value_txn', label: 'I deposited Rs. 1 crore or more in a bank account, or spent Rs. 2 lakh or more on international travel, or paid electricity bills over Rs. 1 lakh' },
          { value: 'none', label: 'None of these apply to me' },
        ],
        earlyExit: (answer) => {
          if (answer === 'tds_deducted') {
            return {
              type: 'mandatory',
              headline: 'You should file to claim your TDS refund.',
              body: 'You need to file to claim back the tax that was deducted. If you do not file, that money is just gone.',
              ctaLabel: 'File My ITR',
              ctaHref: '/checkout/business-itr',
            };
          }
          if (answer === 'foreign_assets') {
            return {
              type: 'mandatory',
              headline: 'You must file - foreign assets require mandatory filing.',
              body: 'Anyone with foreign assets must file regardless of income level.',
              ctaLabel: 'File My ITR',
              ctaHref: '/checkout/business-itr',
            };
          }
          if (answer === 'high_value_txn') {
            return {
              type: 'mandatory',
              headline: 'You must file due to high-value transactions.',
              body: 'Rule 12AB requires filing even if income is below the basic exemption limit when you have high-value transactions.',
              ctaLabel: 'File My ITR',
              ctaHref: '/checkout/business-itr',
            };
          }
          return null;
        },
      },
      {
        text: 'How old are you?',
        options: [
          { value: 'below_60', label: 'Under 60' },
          { value: '60_to_80', label: '60 to 80 (Senior Citizen)' },
          { value: 'above_80', label: 'Above 80 (Super Senior Citizen)' },
        ],
        evaluator: (answer, allAnswers) => {
          if (allAnswers[0] === '250k_to_500k' && answer === 'above_80') {
            return {
              type: 'not_required',
              headline: 'You are likely exempt from filing.',
              body: 'Super senior citizens (above 80) have a basic exemption limit of Rs. 5 lakh. Your income appears to be below this threshold.',
            };
          }
          return null;
        },
      },
      {
        text: 'Are you planning to apply for any of these in the next 12 months?',
        options: [
          { value: 'yes_loan', label: 'A home loan or business loan' },
          { value: 'yes_visa', label: 'A US, UK, or Schengen visa' },
          { value: 'yes_tender', label: 'A government tender or contract' },
          { value: 'no', label: 'None of these' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes_loan' || answer === 'yes_visa' || answer === 'yes_tender') {
            return {
              type: 'recommended',
              headline: 'Filing is strongly recommended for practical reasons.',
              body: 'Lenders want 2-3 years of ITR. Visa embassies ask for it. Government tenders require it. Even if the law does not require you to file, not filing makes your life harder.',
              ctaLabel: 'File My ITR',
              ctaHref: '/checkout/business-itr',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Not strictly required - but filing anyway is a good idea',
      body: 'Your income seems to be below the taxable limit. But here is the thing - filing a nil return costs you nothing and takes about 30 minutes. What it gives you is a formal income record that banks, visa offices, and government departments recognise. It also protects you from any future income tax notice asking you to explain where your money came from.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHO HAS TO FILE',
      body: 'Under Section 139(1) of the Income Tax Act, 1961, you are required to file if your gross income - before any deductions - crosses the basic exemption limit. But income level is not the only reason you might need to file.',
      bullets: [
        'Gross income above Rs. 2.5 lakh if you are under 60, Rs. 3 lakh if you are between 60 and 80, or Rs. 5 lakh if you are above 80',
        'You deposited cash above Rs. 1 crore in one or more current accounts during the year',
        'You spent more than Rs. 2 lakh on international travel',
        'Your electricity bills totalled more than Rs. 1 lakh across the year',
        'You own property abroad, have a foreign bank account, or earn any income outside India',
        'You run a company or a firm - all companies and firms must file regardless of profit or loss',
        'You want to carry forward a loss (from investments, business) to set off against future income',
        'Tax was deducted from any of your payments and you want that money back',
      ],
      note: 'Source: Section 139(1), Income Tax Act 1961; Rule 12AB, Income Tax Rules 1962',
    },
    {
      number: '02',
      heading: 'NO EXCEPTIONS HERE - THESE ARE HARD MANDATORY',
      body: 'If any of these apply, you must file. No way around it.',
      bullets: [
        'You are a company or an LLP - mandatory every year, even if no business was done and there was zero income',
        'Your total income exceeds the basic exemption limit for your age',
        'You made a high-value transaction - bank deposit above Rs. 1 crore, international travel above Rs. 2 lakh, electricity above Rs. 1 lakh',
        'You are a director in any Indian company - even if it is a dormant startup you co-founded years ago',
        'You invested more than Rs. 10 lakh in mutual funds or stocks during the year',
        'You hold any asset outside India or have an account with a foreign bank',
        'Tax was deducted at source from any payment and you want to claim it back',
      ],
      note: 'Source: CBDT Notification; Rule 12AB added by the Income Tax (6th Amendment) Rules, 2022',
    },
    {
      number: '03',
      heading: 'REASONS TO FILE EVEN WHEN YOU TECHNICALLY DO NOT HAVE TO',
      body: 'Sometimes the most practical reason to file has nothing to do with tax.',
      bullets: [
        'Visa applications: US, UK, and Schengen embassies routinely ask for 2-3 years of ITRs as standard income proof',
        'Home loans and car loans: Banks and NBFCs ask self-employed applicants for ITR copies; increasingly, salaried applicants are asked too',
        'Government tenders: ITR submission is a standard pre-qualification requirement',
        'Premium credit cards: Most private banks require ITR for cards above a certain credit limit',
        'Building a paper trail: If you earn from multiple informal sources - rent, tuition, freelance - an ITR gives you documented proof of income',
        'Carrying forward losses: If you had capital losses or business losses, you can only use them against future profits if you file by the due date',
      ],
    },
    {
      number: '04',
      heading: 'WHEN YOU GENUINELY DO NOT NEED TO FILE',
      body: 'You are truly exempt if all of these are true at the same time:',
      bullets: [
        'Your gross income is below Rs. 2.5 lakh (under 60), Rs. 3 lakh (60-80), or Rs. 5 lakh (above 80) - before any deductions',
        'You have no foreign assets, accounts, or income',
        'You have not made any high-value transactions',
        'No tax was deducted from any of your income',
        'You have no capital or business losses you want to carry forward',
        'You are not a director in any company',
        'You have no plans for loans, visas, or government contracts soon',
      ],
      note: 'One more thing: Senior citizens above 75 with only pension and interest income from the same bank are exempt from filing if the bank deducts TDS on their behalf under Section 194P.',
    },
    {
      number: '05',
      heading: 'WHAT MISSING THE DEADLINE ACTUALLY COSTS YOU',
      body: 'Missing the due date (July 31 for most individuals) has consequences that grow over time.',
      bullets: [
        'Late filing fee: Rs. 5,000 if your total income is above Rs. 5 lakh; Rs. 1,000 if below (Section 234F)',
        'Interest on tax due: 1% per month from the original due date until you actually file (Section 234A)',
        'Losses lost permanently: Capital losses, business losses, and speculation losses cannot be carried forward if you miss the due date - that tax benefit is gone for good',
        'Income tax notice risk: The department can reopen your assessment up to 3 years back, or up to 10 years for larger undisclosed amounts',
        'Prosecution: Willful failure to file when tax was owed can lead to prosecution under Section 276CC',
      ],
      note: 'Use our penalty calculator for exact amounts based on your situation: /tools/penalty-calculator/itr-late-filing',
    },
    {
      number: '06',
      heading: 'ANSWER YES TO ANY OF THESE - THEN FILE',
      body: '',
      bullets: [
        'Is your gross income above your age-based exemption limit? YES - mandatory',
        'Was tax deducted from your salary, FD interest, or any payment to you? YES - file to get your refund',
        'Do you have any foreign assets or income? YES - mandatory',
        'Are you a director in any company? YES - mandatory',
        'Do you need a loan, visa, or government contract in the next year? YES - file now',
        'Did you make a large bank deposit, international trip, or pay high electricity bills? YES - mandatory',
        'All NO? You are probably exempt - but consider filing a nil return anyway just for the record',
      ],
    },
  ],

  faqs: [
    {
      q: 'I am a student with no income. Should I file?',
      a: 'If you have truly zero income and zero assets, there is nothing to file. But if you have a bank account where even small amounts of interest are credited and tax has been deducted on it, you should file to claim that refund. It takes 20 minutes and the money comes back to your account.',
    },
    {
      q: 'My employer deducts TDS every month. Do I still need to file?',
      a: "Yes. Your employer's TDS deduction (via Form 24Q) is not a substitute for your own ITR filing. You still need to file to declare all your income, claim any additional deductions you are eligible for (like HRA, home loan interest, 80C investments), and get back any excess TDS that was deducted.",
    },
    {
      q: 'I live abroad and earn in a foreign country. Do I need to file an ITR in India?',
      a: 'If you are an NRI and you have any income that originates in India - rental income, capital gains on Indian property or shares, interest on an NRO account - and that income crosses the basic exemption limit, you need to file. Also file if tax was deducted from Indian income and you want a refund.',
    },
    {
      q: 'What is the difference between ITR-1 and ITR-2?',
      a: 'ITR-1 is the simple form - for salaried individuals with income from salary, one house property, and interest income, with total income below Rs. 50 lakh and no capital gains. ITR-2 is for everyone else - if you have capital gains, more than one property, foreign income, or you are a director in a company. Not sure which applies to you? Check our ITR form guide.',
    },
    {
      q: 'Can I file after the July 31 deadline?',
      a: 'Yes. A belated return can be filed up to December 31 of the assessment year. You will pay a late fee (Rs. 1,000 to Rs. 5,000) and lose the ability to carry forward any losses. After December 31, filing is generally not possible without special circumstances.',
    },
  ],
};
