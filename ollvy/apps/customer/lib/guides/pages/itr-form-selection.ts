// lib/guides/pages/itr-form-selection.ts
import { LearnPageConfig } from '../pages';

export const itrFormSelection: LearnPageConfig = {
  slug: 'which-itr-form-should-i-use',
  title: 'Which ITR Form Should I Use?',
  seoTitle: 'Which ITR Form to Use in 2025? ITR-1 to ITR-7 Guide | Ollvy',
  seoDescription: 'Find out which Income Tax Return form applies to you in India for FY 2024-25. ITR-1, ITR-2, ITR-3, ITR-4, ITR-5, ITR-6, ITR-7 - clear eligibility explained.',
  canonicalUrl: 'https://www.ollvy.com/guides/which-itr-form-should-i-use',
  lastReviewed: 'March 2025',
  category: 'Tax',
  ctaServiceSlug: 'business-itr',
  relatedServiceSlugs: ['business-itr'],
  relatedLearnSlugs: ['do-i-need-to-file-itr', 'pvt-ltd-vs-llp', 'do-i-need-gst-registration'],
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
          { value: 'individual', label: 'An individual or HUF' },
          { value: 'firm_llp', label: 'A partnership firm or LLP' },
          { value: 'company', label: 'A Private Limited or Public Limited company' },
          { value: 'trust_ngo', label: 'A trust, society, NGO, AOP, or BOI' },
        ],
        earlyExit: (answer) => {
          if (answer === 'firm_llp') {
            return {
              type: 'mandatory',
              headline: 'Use ITR-5.',
              body: 'Partnership firms and LLPs always file ITR-5 - regardless of size, profit level, or whether the business was active during the year.',
              ctaLabel: 'File ITR-5',
              ctaHref: '/checkout/business-itr',
            };
          }
          if (answer === 'company') {
            return {
              type: 'mandatory',
              headline: 'Use ITR-6.',
              body: 'All Private Limited and Public Limited companies file ITR-6 (except those claiming exemption under Section 11).',
              ctaLabel: 'File ITR-6',
              ctaHref: '/checkout/business-itr',
            };
          }
          if (answer === 'trust_ngo') {
            return {
              type: 'mandatory',
              headline: 'Use ITR-7.',
              body: 'Trusts, societies, NGOs, political parties, and scientific research institutions file ITR-7.',
              ctaLabel: 'File ITR-7',
              ctaHref: '/checkout/business-itr',
            };
          }
          return null;
        },
      },
      {
        text: 'Where does your income come from?',
        options: [
          { value: 'salary_only', label: 'Salary or pension - that is mostly it' },
          { value: 'salary_capital', label: 'Salary plus capital gains from shares, mutual funds, or property' },
          { value: 'business_professional', label: 'Business income or professional fees (freelancer, doctor, consultant, trader)' },
          { value: 'presumptive', label: 'A small business where I want to declare income as a flat percentage (Section 44AD/44ADA)' },
        ],
        earlyExit: (answer) => {
          if (answer === 'presumptive') {
            return {
              type: 'recommended',
              headline: 'Use ITR-4 (Sugam).',
              body: 'ITR-4 is for individuals, HUFs, and firms (not LLPs) using presumptive taxation under Sections 44AD, 44ADA, or 44AE. Cannot use if you have capital gains, more than one house property, or foreign income.',
              ctaLabel: 'File ITR-4',
              ctaHref: '/checkout/business-itr',
            };
          }
          if (answer === 'salary_capital') {
            return {
              type: 'mandatory',
              headline: 'Use ITR-2.',
              body: 'Any capital gains - even from redeeming mutual funds - disqualify you from ITR-1. Use ITR-2.',
              ctaLabel: 'File ITR-2',
              ctaHref: '/checkout/business-itr',
            };
          }
          return null;
        },
      },
      {
        text: 'Does any of this apply to you?',
        options: [
          { value: 'director_unlisted_shares', label: 'I am a director in any company, or I hold unlisted shares' },
          { value: 'foreign_assets', label: 'I have foreign assets, a foreign bank account, or income from outside India' },
          { value: 'above_50l', label: 'My total income from all sources is above Rs. 50 lakh' },
          { value: 'simple_salary', label: 'None of these - just salary, one property, and some interest income' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'director_unlisted_shares' || answer === 'foreign_assets' || answer === 'above_50l') {
            return {
              type: 'mandatory',
              headline: 'Use ITR-2.',
              body: 'Directors, unlisted shareholders, and those with foreign assets or income above Rs. 50 lakh must use ITR-2.',
              ctaLabel: 'File ITR-2',
              ctaHref: '/checkout/business-itr',
            };
          }
          if (answer === 'simple_salary' && allAnswers[1] === 'salary_only') {
            return {
              type: 'recommended',
              headline: 'Use ITR-1 (Sahaj).',
              body: 'ITR-1 is the simplest form - for salaried individuals with income from salary, one house property, and interest income, with total income below Rs. 50 lakh and no capital gains.',
              ctaLabel: 'File ITR-1',
              ctaHref: '/checkout/business-itr',
            };
          }
          if (allAnswers[1] === 'business_professional') {
            return {
              type: 'recommended',
              headline: 'Use ITR-3.',
              body: 'ITR-3 is for individuals or HUFs with income from business or profession where you maintain actual books of accounts.',
              ctaLabel: 'File ITR-3',
              ctaHref: '/checkout/business-itr',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'optional',
      headline: 'When in doubt, use ITR-2',
      body: 'If you are unsure whether to use ITR-1 or ITR-2, go with ITR-2. It covers everything ITR-1 covers, plus more. There is no penalty for filing a more comprehensive form than strictly required. But if you file ITR-1 when you should have used ITR-2, the return is treated as defective.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THE FULL PICTURE: ALL 7 ITR FORMS',
      body: 'India has 7 ITR forms and each one is designed for a specific type of taxpayer. Filing the wrong one is treated as a defective return - you will get a notice asking you to re-file in the correct form within 15 days.',
      bullets: [
        'ITR-1 (Sahaj): For resident individuals with total income below Rs. 50 lakh, earned from salary, one house property, and other sources like interest. No capital gains. No directorship. No foreign assets.',
        'ITR-2: For individuals with capital gains, more than one house property, foreign income, total income above Rs. 50 lakh, directorship in a company, or holding of unlisted shares.',
        'ITR-3: For individuals or HUFs with income from business or profession - non-presumptive (you maintain actual books of accounts).',
        'ITR-4 (Sugam): For individuals, HUFs, and firms (not LLPs) using presumptive taxation under Sections 44AD, 44ADA, or 44AE.',
        'ITR-5: For partnership firms, LLPs, AOPs (Association of Persons), and BOIs (Body of Individuals).',
        'ITR-6: For all companies (except those claiming exemption under Section 11).',
        'ITR-7: For trusts, political parties, universities, and scientific research institutions filing under Sections 139(4A), 139(4B), 139(4C), or 139(4D).',
      ],
      note: 'Source: CBDT ITR Notification for AY 2025-26',
    },
    {
      number: '02',
      heading: 'ITR-1 VS ITR-2: THE CONFUSION MOST PEOPLE FACE',
      body: 'Most salaried people file ITR-1 and that is usually right. But ITR-1 cannot be used in a few specific situations - and these are more common than people realise.',
      bullets: [
        'You are a director in any company - even a small startup where you earn nothing yet',
        'You hold unlisted equity shares at any point during the year',
        'You have any capital gains - from selling shares, mutual funds, property, or any other asset',
        'You have income from more than one house property',
        'Your total income from all sources exceeds Rs. 50 lakh',
        'You have a foreign bank account, foreign investments, or any income from outside India',
        'You are a non-resident or not ordinarily resident',
        'Your agricultural income exceeds Rs. 5,000',
      ],
      note: 'If you filed ITR-1 last year but any of these apply this year, you need ITR-2 this time.',
    },
    {
      number: '03',
      heading: 'ITR-3 VS ITR-4: FOR BUSINESS AND PROFESSIONAL INCOME',
      body: 'If you have business or professional income, your choice comes down to one question: are you using the presumptive taxation scheme?',
      bullets: [
        'ITR-4 (Sugam) is for you if you want to keep things simple and declare income as a flat percentage - 8% of turnover for business (or 6% for digital receipts), or 50% of gross receipts for professionals. You cannot use this if your business turnover exceeds Rs. 2 crore or your professional receipts exceed Rs. 50 lakh, or if you also have capital gains.',
        'ITR-3 is for you if you maintain actual accounts, or your turnover exceeds the presumptive limits, or you have capital gains alongside your business income.',
        'One important catch: if you opt out of the presumptive scheme, you cannot re-enter it for the next 5 years (Section 44AD). So think before you switch.',
      ],
      note: 'Source: Sections 44AD, 44ADA, 44AE, Income Tax Act 1961',
    },
    {
      number: '04',
      heading: 'ITR-5 FOR FIRMS AND LLPS',
      body: 'Partnership firms and LLPs always file ITR-5 - regardless of size, profit level, or whether the business was active during the year. The firm files ITR-5 for its own income. Each partner then files their own individual ITR for their personal income.',
      bullets: [
        "The partner's share of LLP profit is exempt from tax in their personal ITR (it has already been taxed at the LLP level)",
        'But any salary or interest the partner receives from the LLP is taxable in the partner\'s individual return',
        'Partners typically file ITR-3 (if they also have business income) or ITR-2 (if they have only salary and capital gains)',
      ],
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS IF YOU FILE THE WRONG FORM',
      body: 'It is not the end of the world, but it does create problems.',
      bullets: [
        'Defective return notice under Section 139(9): You will be asked to re-file in the correct form within 15 days',
        'If you do not respond: The return is treated as if you never filed - which triggers late filing fees and interest',
        'Losses cannot be carried forward: If the return ends up being invalid, you lose the ability to carry forward any losses for that year',
        'Increased scrutiny risk: A defective return filing pattern can trigger closer scrutiny of your tax affairs',
      ],
    },
    {
      number: '06',
      heading: 'THE QUICK REFERENCE YOU CAN BOOKMARK',
      body: '',
      bullets: [
        'Pvt Ltd or Public Company = ITR-6',
        'LLP or Partnership Firm = ITR-5',
        'Trust, NGO, political party = ITR-7',
        'Individual: salary + one property + interest + total under Rs. 50 lakh + no capital gains + not a director = ITR-1',
        'Individual: capital gains, director role, foreign assets, above Rs. 50 lakh, or unlisted shares = ITR-2',
        'Individual or firm: business/professional income under presumptive limits = ITR-4',
        'Individual or firm: business income with actual accounts, or with capital gains alongside business income = ITR-3',
      ],
    },
  ],

  faqs: [
    {
      q: 'I am salaried and sold some mutual fund units this year. Which form do I use?',
      a: 'ITR-2. Any capital gains - even from redeeming mutual funds - disqualify you from ITR-1. It does not matter how small the amount is.',
    },
    {
      q: 'I am a freelancer getting paid in foreign currency. Which form applies to me?',
      a: 'ITR-3 if you maintain actual books of accounts and declare actual profit. ITR-4 if your gross receipts are below Rs. 50 lakh and you want to use the 50% flat deduction under Section 44ADA (which applies to professionals - designers, writers, consultants, etc.). If you also have a foreign bank account, ITR-2 requirements may apply - check with a CA.',
    },
    {
      q: 'I filed ITR-1 last year. This year I joined a startup as a co-founder and hold shares. Same form?',
      a: 'No. If you hold unlisted shares or are a director in any company, you must use ITR-2. This is one of the most common reasons people get a defective return notice.',
    },
    {
      q: 'Can I switch from ITR-1 to ITR-2 if I realise I filed the wrong one?',
      a: 'Yes. File a revised return (revised ITR) using the correct form by December 31 of the assessment year. A revised return replaces the original completely.',
    },
    {
      q: 'My LLP partner also has salaried income from another job. What does their return look like?',
      a: 'They file one ITR that covers both their salary income and their share of the LLP. Their LLP profit share goes in as exempt income. Any salary or interest they receive from the LLP itself is reported as taxable. Most partners with both salary and LLP income use ITR-3.',
    },
  ],
};
