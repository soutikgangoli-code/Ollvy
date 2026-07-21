import { LearnPageConfig, EligibilityResult } from '../pages'

// Q2 early-exit results: every trigger answer leads to ITR-2, with the
// trigger-specific reason. Built as plain data so it survives serialization.
const itr2Triggers: Record<string, string> = {
  director: 'ITR-1 cannot be used by directors or holders of unlisted shares',
  foreign: 'ITR-1 cannot be used if you have foreign assets or income',
  above_50l: 'ITR-1 is limited to income below Rs. 50 lakh',
  capital_gains: 'Any capital gain - even a small mutual fund redemption - disqualifies ITR-1',
}

const itr2ExitResults: Record<string, EligibilityResult> = Object.fromEntries(
  Object.entries(itr2Triggers).map(([answer, trigger]) => [
    answer,
    {
      type: 'eligible' as const,
      headline: 'Use ITR-2.',
      body: trigger,
      ranking: {
        type: 'form-assignment' as const,
        assignment: {
          form: 'ITR-2',
          reason: trigger,
          eliminated: [
            { form: 'ITR-1', why: trigger },
            { form: 'ITR-3', why: 'ITR-3 is for business or professional income - not applicable if your income is from salary and capital gains' },
            { form: 'ITR-4', why: 'ITR-4 is for presumptive taxation of business income - not for salaried individuals with capital gains' },
          ],
        },
      },
    },
  ]),
)

export const itrFormSelection: LearnPageConfig = {
  slug: 'which-itr-form-should-i-use',
  title: 'Which ITR Form Should I Use?',
  seoTitle: 'Which ITR Form to Use in 2026? ITR-1 to ITR-7 Guide | Ollvy',
  seoDescription:
    'Find out which Income Tax Return form applies to you in India for FY 2024-25. ITR-1, ITR-2, ITR-3, ITR-4, ITR-5, ITR-6, ITR-7 - clear eligibility explained.',
  canonicalUrl: 'https://www.ollvy.com/guides/which-itr-form-should-i-use',
  lastReviewed: 'April 2026',
  category: 'Tax',
  ctaServiceSlug: 'business-itr',
  relatedServiceSlugs: ['business-itr'],
  relatedLearnSlugs: ['do-i-need-to-file-itr', 'pvt-ltd-vs-llp'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },

  tool: {
    type: 'comparison',
    title: 'Find Your ITR Form',
    questions: [
      {
        text: 'What type of entity are you filing for?',
        options: [
          { value: 'individual_huf', label: 'An individual or HUF' },
          { value: 'firm_llp', label: 'A partnership firm or LLP' },
          { value: 'company', label: 'A Private Limited or Public Limited company' },
          { value: 'trust_ngo', label: 'A trust, society, NGO, AOP, or BOI' },
        ],
        exitOn: {
          company: {
            type: 'eligible' as const,
            headline: 'Use ITR-6.',
            body: 'All companies file ITR-6, every year, even with zero income.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-6',
                reason: 'All companies (Pvt Ltd, Public Ltd, OPC) except those claiming Section 11 exemption use this form.',
                eliminated: [
                  { form: 'ITR-1', why: 'Only for individual resident taxpayers' },
                  { form: 'ITR-5', why: 'For firms and LLPs, not companies' },
                  { form: 'ITR-7', why: 'For trusts and charitable institutions, not companies' },
                ],
              },
            },
          },
          firm_llp: {
            type: 'eligible' as const,
            headline: 'Use ITR-5.',
            body: 'Partnership firms and LLPs always file ITR-5 - regardless of size, profit, or activity.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-5',
                reason: 'Partnership firms, LLPs, AOPs, and BOIs use this form. Each partner separately files their own personal ITR.',
                eliminated: [
                  { form: 'ITR-3', why: 'ITR-3 is for individual partners, not the firm itself' },
                  { form: 'ITR-4', why: 'ITR-4 applies to partners using presumptive taxation - not the firm' },
                  { form: 'ITR-6', why: 'Only for companies, not LLPs or firms' },
                ],
              },
            },
          },
          trust_ngo: {
            type: 'eligible' as const,
            headline: 'Use ITR-7.',
            body: 'Trusts, political parties, universities, and research institutions use ITR-7.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-7',
                reason: 'For entities filing under Sections 139(4A), 139(4B), 139(4C), or 139(4D) - charitable trusts, political parties, educational institutions, and scientific research bodies.',
                eliminated: [
                  { form: 'ITR-5', why: 'ITR-5 is for firms and LLPs without charitable status' },
                  { form: 'ITR-6', why: 'For companies - trusts and societies are not companies' },
                ],
              },
            },
          },
        },
      },
      {
        text: 'Do any of these apply to you?',
        options: [
          { value: 'director', label: 'I am a director in any company, or I hold unlisted shares' },
          { value: 'foreign', label: 'I have foreign assets, a foreign bank account, or income from outside India' },
          { value: 'above_50l', label: 'Total income from all sources is above Rs. 50 lakh' },
          { value: 'capital_gains', label: 'I sold shares, mutual funds, property, or any other asset this year' },
          { value: 'none_of_these', label: 'None of these' },
        ],
        exitOn: itr2ExitResults,
      },
      {
        text: 'Where does your income come from?',
        options: [
          { value: 'salary_only', label: 'Salary, pension, or interest - that is mostly it' },
          { value: 'business_real', label: 'Business or professional income - I maintain actual accounts' },
          { value: 'presumptive', label: 'Business or professional income - I want to declare a flat percentage (Section 44AD/44ADA)' },
        ],
      },
    ],
    resultRules: [
      {
        if: [{ q: 2, anyOf: ['salary_only'] }],
        result: {
          type: 'eligible' as const,
          headline: 'Use ITR-1.',
          body: 'Salary, pension, one house property, and interest income with no other complications. The simplest form.',
          ranking: {
            type: 'form-assignment' as const,
            assignment: {
              form: 'ITR-1 (Sahaj)',
              reason: 'You are a resident individual with income from salary, one house property, and interest - total below Rs. 50 lakh, no capital gains, no directorship, no foreign assets.',
              eliminated: [
                { form: 'ITR-2', why: 'Only needed if you have capital gains, multiple properties, foreign assets, or income above Rs. 50 lakh' },
                { form: 'ITR-3', why: 'For business or professional income - not applicable to salaried individuals' },
                { form: 'ITR-4', why: 'For presumptive taxation of business income - not for salaried income' },
              ],
            },
          },
        },
      },
      {
        if: [{ q: 2, anyOf: ['business_real'] }],
        result: {
          type: 'eligible' as const,
          headline: 'Use ITR-3.',
          body: 'For business or professional income with actual books of accounts.',
          ranking: {
            type: 'form-assignment' as const,
            assignment: {
              form: 'ITR-3',
              reason: 'You have business or professional income and maintain actual books of accounts. Also required if your turnover exceeds presumptive limits (Rs. 2 crore for business, Rs. 50 lakh for professionals).',
              eliminated: [
                { form: 'ITR-4', why: 'ITR-4 is for presumptive taxation - you maintain actual books, so ITR-3 is required' },
                { form: 'ITR-1', why: 'ITR-1 cannot be used for business income' },
                { form: 'ITR-2', why: 'ITR-2 is for individuals with capital gains or other non-business income - not for business income with actual books' },
              ],
            },
          },
        },
      },
      {
        if: [{ q: 2, anyOf: ['presumptive'] }],
        result: {
          type: 'eligible' as const,
          headline: 'Use ITR-4 - but check the limits first.',
          body: 'ITR-4 applies to presumptive taxation. Critical check: business turnover must be below Rs. 2 crore (44AD) or professional receipts below Rs. 50 lakh (44ADA). If you exceed these, you must use ITR-3.',
          ranking: {
            type: 'form-assignment' as const,
            assignment: {
              form: 'ITR-4 (Sugam)',
              reason: 'Presumptive taxation: declare 8% of business turnover as income (6% for digital receipts), or 50% of gross receipts for professionals. Much simpler filing.',
              eliminated: [
                { form: 'ITR-3', why: 'Required only if you exceed presumptive limits or opt out of the scheme. If you opt out of 44AD, you cannot re-enter for 5 years.' },
                { form: 'ITR-1', why: 'ITR-1 cannot be used for business income' },
                { form: 'ITR-2', why: 'ITR-2 is for capital gains and non-business income - not for presumptive business income' },
              ],
            },
          },
        },
      },
    ],
    defaultResult: {
      type: 'optional',
      headline: 'When in doubt, use ITR-2.',
      body: 'ITR-2 covers everything ITR-1 covers, and more. No penalty for filing a more comprehensive form. But filing ITR-1 when you need ITR-2 makes the return defective.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'ALL 7 FORMS AND WHO USES EACH',
      body: 'India has 7 ITR forms. Filing the wrong one is treated as a defective return - you will get a notice asking you to re-file in the correct form within 15 days.',
      bullets: [
        'ITR-1 (Sahaj): Resident individuals, total income below Rs. 50 lakh, earned from salary, one house property, and interest income. No capital gains, no directorship, no foreign assets.',
        'ITR-2: Individuals with capital gains, more than one house property, foreign income, total income above Rs. 50 lakh, directorship in a company, or holding of unlisted shares.',
        'ITR-3: Individuals or HUFs with income from business or profession using actual books of accounts.',
        'ITR-4 (Sugam): Individuals, HUFs, and firms (not LLPs) using presumptive taxation under Sections 44AD, 44ADA, or 44AE.',
        'ITR-5: Partnership firms, LLPs, AOPs (Association of Persons), and BOIs (Body of Individuals).',
        'ITR-6: All companies except those claiming exemption under Section 11.',
        'ITR-7: Trusts, political parties, universities, and scientific research institutions.',
      ],
      table: {
        caption: 'Which ITR Form to Use - Complete Reference (AY 2025-26)',
        headers: ['Form', 'Who Files', 'Key Conditions', 'Cannot Be Used If'],
        rows: [
          ['ITR-1 (Sahaj)', 'Resident individual', 'Salary/pension + one house property + interest income. Total income below Rs. 50 lakh.', 'Capital gains, multiple properties, foreign assets, income above Rs. 50 lakh, director role, unlisted shares held'],
          ['ITR-2', 'Individual or HUF', 'Capital gains. Multiple house properties. Foreign income or assets. Income above Rs. 50 lakh. Directorship. Unlisted shares.', 'Business or professional income (use ITR-3 or ITR-4 for that)'],
          ['ITR-3', 'Individual or HUF', 'Business or professional income with actual books of accounts. Also if turnover exceeds presumptive limits.', 'Entities (firms use ITR-5, companies use ITR-6)'],
          ['ITR-4 (Sugam)', 'Individual, HUF, or Firm (not LLP)', 'Presumptive taxation: 44AD (business turnover ≤ Rs. 2 crore) or 44ADA (professional receipts ≤ Rs. 50 lakh). No capital gains.', 'Capital gains, turnover above Rs. 2 crore (44AD), professional income above Rs. 50 lakh (44ADA), LLPs'],
          ['ITR-5', 'Partnership Firm, LLP, AOP, BOI', 'Mandatory for all firms and LLPs - regardless of income, activity, or size.', 'Companies, individuals, trusts'],
          ['ITR-6', 'Companies (Pvt Ltd, Public Ltd, OPC)', 'All companies except those claiming Section 11 charitable exemption.', 'Non-company entities'],
          ['ITR-7', 'Trusts, NGOs, political parties, universities, research institutions', 'Entities filing under Section 139(4A), 139(4B), 139(4C), or 139(4D).', 'Companies and non-charitable entities'],
        ],
      },
      note: 'Source: CBDT ITR Notification for AY 2025-26',
    },
    {
      number: '02',
      heading: 'ITR-1 VS ITR-2: THE CONFUSION MOST PEOPLE FACE',
      body: 'Most salaried people file ITR-1 correctly. But ITR-1 cannot be used in these situations - and they are more common than people realise.',
      bullets: [
        'You are a director in any company - even a dormant startup where you earn nothing',
        'You hold unlisted equity shares at any point during the year',
        'You have any capital gains - from selling shares, mutual funds, property, or any other asset',
        'You have income from more than one house property',
        'Your total income from all sources exceeds Rs. 50 lakh',
        'You have a foreign bank account, foreign investments, or any income from outside India',
        'You are a non-resident or not ordinarily resident',
        'Your agricultural income exceeds Rs. 5,000',
      ],
      table: {
        caption: 'ITR-1 vs ITR-2: Disqualifiers That Force You to Use ITR-2',
        headers: ['Situation', 'ITR-1 Allowed?', 'Correct Form'],
        rows: [
          ['Salary income, one property, interest only - total below Rs. 50 lakh', 'Yes', 'ITR-1'],
          ['Sold any mutual fund units, shares, or property this year', 'No', 'ITR-2'],
          ['Director in any company (even dormant)', 'No', 'ITR-2'],
          ['Held unlisted shares at any point during the year', 'No', 'ITR-2'],
          ['Foreign bank account or any foreign asset', 'No', 'ITR-2'],
          ['Total income above Rs. 50 lakh from any source', 'No', 'ITR-2'],
          ['Non-resident or Not Ordinarily Resident', 'No', 'ITR-2'],
          ['Agricultural income above Rs. 5,000', 'No', 'ITR-2'],
          ['Income from more than one house property', 'No', 'ITR-2'],
          ['Business or professional income', 'No', 'ITR-3 or ITR-4'],
        ],
      },
      note: 'If you filed ITR-1 last year but any of these apply this year, you need ITR-2 this time.',
    },
    {
      number: '03',
      heading: 'ITR-3 VS ITR-4: FOR BUSINESS AND PROFESSIONAL INCOME',
      body: 'The choice comes down to one question: are you using the presumptive taxation scheme?',
      bullets: [
        'ITR-4 (Sugam): For businesses declaring income as 8% of turnover (6% for digital receipts), or professionals declaring 50% of gross receipts. Cannot use this if business turnover exceeds Rs. 2 crore or professional receipts exceed Rs. 50 lakh, or if you also have capital gains.',
        'ITR-3: For actual books of accounts, or if your turnover exceeds presumptive limits, or if you have capital gains alongside business income.',
        'Key catch: if you opt out of the presumptive scheme (Section 44AD), you cannot re-enter it for the next 5 years. Think before switching.',
      ],
      note: 'Source: Sections 44AD, 44ADA, 44AE, Income Tax Act 1961',
    },
    {
      number: '04',
      heading: 'ITR-5 FOR FIRMS AND LLPS',
      body: 'Partnership firms and LLPs always file ITR-5.',
      bullets: [
        'The firm files ITR-5 for its own income - regardless of size, profit level, or whether the business was active',
        'Each partner then files their own individual ITR for personal income',
        'A partner\'s share of LLP profit is exempt from tax in their personal return (already taxed at LLP level)',
        'Any salary or interest the partner receives from the LLP is taxable in their personal return',
        'Partners typically file ITR-3 (if they also have business income) or ITR-2 (if salary and capital gains only)',
      ],
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS IF YOU FILE THE WRONG FORM',
      body: '',
      bullets: [
        'Defective return notice under Section 139(9): You will be asked to re-file in the correct form within 15 days',
        'If you do not respond: The return is treated as never filed - triggering late filing fees and interest',
        'Losses cannot be carried forward: If the return ends up invalid, you lose the ability to carry forward any losses for that year',
        'Increased scrutiny risk: A defective return pattern can trigger closer scrutiny of your tax affairs',
      ],
    },
    {
      number: '06',
      heading: 'QUICK REFERENCE',
      body: '',
      bullets: [
        'Pvt Ltd or Public Company = ITR-6',
        'LLP or Partnership Firm = ITR-5',
        'Trust, NGO, political party = ITR-7',
        'Individual: salary + one property + interest + total under Rs. 50 lakh + no capital gains + not a director = ITR-1',
        'Individual: capital gains, director role, foreign assets, above Rs. 50 lakh, or unlisted shares = ITR-2',
        'Individual or firm: business/professional income under presumptive limits = ITR-4',
        'Individual or firm: business income with actual accounts, or capital gains alongside business income = ITR-3',
      ],
    },
  ],

  faqs: [
    {
      q: 'I am salaried and sold some mutual fund units this year. Which form do I use?',
      a: 'ITR-2. Any capital gains - even from redeeming mutual funds - disqualify you from ITR-1. It does not matter how small the amount is.',
    },
    {
      q: 'I am a freelancer getting paid in foreign currency. Which form applies?',
      a: 'ITR-3 if you maintain actual books of accounts. ITR-4 if your gross receipts are below Rs. 50 lakh and you want to use the 50% flat deduction under Section 44ADA (which applies to professionals). If you also have a foreign bank account, ITR-2 requirements may apply - check with a CA.',
    },
    {
      q: 'I filed ITR-1 last year. This year I joined a startup as co-founder and hold shares. Same form?',
      a: 'No. If you hold unlisted shares or are a director in any company, you must use ITR-2. This is one of the most common reasons for a defective return notice.',
    },
    {
      q: 'Can I switch from ITR-1 to ITR-2 if I realise I filed the wrong one?',
      a: 'Yes. File a revised return using the correct form by December 31 of the assessment year. A revised return replaces the original completely.',
    },
    {
      q: 'My LLP partner also has salaried income from another job. What does their return look like?',
      a: 'They file one ITR covering both their salary income and their share of the LLP. Their LLP profit share goes in as exempt income. Any salary or interest they receive from the LLP itself is reported as taxable. Most partners with both salary and LLP income use ITR-3.',
    },
  ],
}
