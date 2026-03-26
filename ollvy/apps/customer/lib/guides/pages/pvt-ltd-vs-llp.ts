// lib/guides/pages/pvt-ltd-vs-llp.ts
import { LearnPageConfig } from '../pages';

export const pvtLtdVsLlp: LearnPageConfig = {
  slug: 'pvt-ltd-vs-llp',
  title: 'Pvt Ltd vs LLP - Which Should I Choose?',
  seoTitle: 'Pvt Ltd vs LLP in India 2025: Which is Right for You? | Ollvy',
  seoDescription: 'Compare Private Limited Company vs LLP for your Indian business. Analyze tax, compliance, funding, liability, and cost to make the right choice in 2025.',
  canonicalUrl: 'https://www.ollvy.com/guides/pvt-ltd-vs-llp',
  lastReviewed: 'March 2025',
  category: 'Incorporation',
  ctaServiceSlug: 'pvt-ltd-incorporation',
  ctaSecondarySlug: 'llp-incorporation',
  relatedServiceSlugs: ['pvt-ltd-incorporation', 'llp-incorporation'],
  relatedLearnSlugs: ['do-i-need-gst-registration', 'should-i-get-dpiit-startup-recognition', 'is-msme-registration-worth-it'],
  relatedTools: {
    penaltyCalculators: ['mca-annual-filing', 'director-kyc'],
    documentChecklists: ['private-limited-company', 'llp'],
  },

  tool: {
    type: 'comparison',
    title: 'Which Structure Suits Your Business?',
    questions: [
      {
        text: 'Do you plan to raise money from external investors - angels, VCs, or institutions?',
        options: [
          { value: 'yes_funding', label: 'Yes, within the next 2 years' },
          { value: 'maybe', label: 'Possibly, in 3-5 years' },
          { value: 'no_funding', label: 'No - self-funded or debt only' },
        ],
        earlyExit: (answer) => {
          if (answer === 'yes_funding') {
            return {
              type: 'eligible',
              headline: 'Choose Private Limited Company.',
              body: 'Investors need to receive shares. An LLP cannot issue equity. ESOPs are also not possible in an LLP. This one factor settles it.',
              ctaLabel: 'Register Pvt Ltd',
              ctaHref: '/checkout/pvt-ltd-incorporation',
            };
          }
          return null;
        },
      },
      {
        text: 'How many people will own the business?',
        options: [
          { value: 'one', label: 'Just me' },
          { value: 'two_to_five', label: '2 to 5 founders' },
          { value: 'six_plus', label: '6 or more owners' },
        ],
        earlyExit: (answer) => {
          if (answer === 'one') {
            return {
              type: 'eligible',
              headline: 'Choose Private Limited Company.',
              body: 'LLPs require a minimum of 2 designated partners. A solo founder cannot incorporate an LLP. Choose Pvt Ltd - you can be the sole director and shareholder.',
              ctaLabel: 'Register Pvt Ltd',
              ctaHref: '/checkout/pvt-ltd-incorporation',
            };
          }
          return null;
        },
      },
      {
        text: 'What kind of business is this?',
        options: [
          { value: 'tech_startup', label: 'A tech startup or product company' },
          { value: 'services_professional', label: 'Professional services - consulting, design, legal, or a CA firm' },
          { value: 'trading_manufacturing', label: 'Trading or manufacturing' },
          { value: 'real_estate_investment', label: 'Real estate, investment holding, or passive income' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'tech_startup') {
            return {
              type: 'eligible',
              headline: 'Choose Private Limited Company.',
              body: 'ESOPs, investor onboarding, and DPIIT startup recognition all require a company structure.',
              ctaLabel: 'Register Pvt Ltd',
              ctaHref: '/checkout/pvt-ltd-incorporation',
            };
          }
          if (answer === 'services_professional' && allAnswers[0] === 'no_funding') {
            return {
              type: 'eligible',
              headline: 'LLP is likely the right choice.',
              body: 'CA firms and law firms are required by their professional bodies to use LLP; others benefit from lower compliance burden.',
              ctaLabel: 'Register LLP',
              ctaHref: '/checkout/llp-incorporation',
            };
          }
          if (answer === 'real_estate_investment') {
            return {
              type: 'eligible',
              headline: 'LLP is likely the right choice.',
              body: 'Lower compliance and pass-through taxation is more efficient for real estate and investment holding.',
              ctaLabel: 'Register LLP',
              ctaHref: '/checkout/llp-incorporation',
            };
          }
          return null;
        },
      },
      {
        text: 'How important is keeping your annual compliance costs low?',
        options: [
          { value: 'very_important', label: 'Very important - every rupee counts' },
          { value: 'somewhat', label: 'Somewhat - moderate is fine' },
          { value: 'not_important', label: 'Not a priority - I want the strongest structure' },
        ],
        evaluator: (answer) => {
          if (answer === 'very_important') {
            return {
              type: 'eligible',
              headline: 'LLP may be the better fit.',
              body: 'Annual compliance typically costs Rs. 8,000-15,000 vs Rs. 25,000-50,000 for Pvt Ltd; no mandatory audit below Rs. 40 lakh.',
              ctaLabel: 'Register LLP',
              ctaHref: '/checkout/llp-incorporation',
            };
          }
          if (answer === 'not_important') {
            return {
              type: 'eligible',
              headline: 'Choose Private Limited Company.',
              body: 'Pvt Ltd gives you better optionality for team incentives and future exits.',
              ctaLabel: 'Register Pvt Ltd',
              ctaHref: '/checkout/pvt-ltd-incorporation',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'optional',
      headline: 'Both options work for you - here is how to decide',
      body: 'Your situation fits either structure. Here is the simplest tiebreaker: if there is even a small chance you will want to raise equity funding, bring in investors, or offer ESOPs to employees in the next 5 years, go with Pvt Ltd. If you are building something stable and profitable where you want to keep compliance light, choose LLP.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT IS ACTUALLY DIFFERENT BETWEEN THE TWO',
      body: "Here is what often gets lost in these comparisons: both a Private Limited Company and an LLP protect your personal assets. If your business fails or gets sued, your house, savings, and personal accounts are not at risk in either structure. That is the limited liability part, and it applies to both.\n\nThe difference is in everything else - how ownership works, how much you spend on compliance every year, and most importantly, what your options are as the business grows.",
      note: 'Source: Companies Act 2013; Limited Liability Partnership Act 2008',
    },
    {
      number: '02',
      heading: 'CHOOSE PVT LTD IF ANY OF THESE ARE TRUE',
      body: '',
      bullets: [
        'You want to raise money from investors - they receive shares in your company. An LLP cannot issue shares or convertible instruments. End of story.',
        'You want to give your team ESOPs - equity ownership for employees is only possible in a company structure',
        'You are building something that could be acquired or listed someday - clean cap tables and share registers matter for this',
        'You want DPIIT Startup Recognition and the 3-year tax holiday under Section 80-IAC - only companies (not LLPs) qualify',
        'You have multiple founders with different equity stakes and want a clean, legally enforceable cap table',
        'Your enterprise clients or government contracts expect to work with a company',
      ],
      note: 'Source: Companies Act 2013; DPIIT Startup India eligibility criteria',
    },
    {
      number: '03',
      heading: 'CHOOSE LLP IF ANY OF THESE ARE TRUE',
      body: '',
      bullets: [
        'You are a professional services firm - CA firms, law firms, architecture practices, and consulting businesses often find LLP a natural fit, and some professional bodies actually require it',
        'You want to keep annual compliance costs low - typically Rs. 8,000-15,000 per year with an LLP versus Rs. 25,000-50,000 for a Pvt Ltd',
        'Your turnover is below Rs. 40 lakh and contribution below Rs. 25 lakh - you do not need a mandatory statutory audit with an LLP',
        'You want flexible profit-sharing - partners can split profits in any ratio they agree on, regardless of capital contributed. In a Pvt Ltd, dividends must follow shareholding percentage.',
        "You are holding investments or property - LLP's pass-through taxation and lower compliance make it more efficient for this purpose",
      ],
      note: 'Source: LLP Act 2008; Income Tax Act 1961',
    },
    {
      number: '04',
      heading: 'THE ANNUAL COMPLIANCE COST DIFFERENCE IS REAL',
      body: 'This is not a small gap. Here is what annual compliance typically looks like:',
      bullets: [
        'LLP: File Form 8 (accounts) and Form 11 (annual return) - roughly Rs. 8,000 to Rs. 15,000 per year with a CA. Audit only needed if turnover crosses Rs. 40 lakh.',
        'Pvt Ltd: File AOC-4 (financials) and MGT-7 (annual return), hold minimum 4 board meetings per year, get a mandatory statutory audit done regardless of size - typically Rs. 25,000 to Rs. 60,000 per year. Each director also needs to complete DIR-3 KYC annually.',
        'Closing an LLP is also significantly simpler and faster than closing a Pvt Ltd - worth thinking about if you are still validating your idea.',
      ],
    },
    {
      number: '05',
      heading: 'WHAT ABOUT TAX?',
      body: 'This is where it gets a bit nuanced.',
      bullets: [
        'LLP profits are taxed at a flat 30% rate at the entity level. Partners do not pay tax again on their share of the profit (it is exempt in their hands). But there is a 12% surcharge if profit crosses Rs. 1 crore.',
        "Pvt Ltd profits are taxed at 22% under the new tax regime (Section 115BAA). However, when the company distributes dividends to shareholders, those dividends are taxed again in the shareholder's hands at their personal income tax rate.",
        'In practice, which one is more efficient depends on your profit levels and how much you plan to draw out versus retain in the business. A CA can run the numbers for your specific situation.',
      ],
    },
    {
      number: '06',
      heading: 'THE ONE QUESTION THAT DECIDES MOST CASES',
      body: 'Do you want equity investors within the next 3 years?',
      bullets: [
        'YES - Go with Pvt Ltd, right from day one. Converting later is possible but costs time and money.',
        'NO + professional services - LLP is the better fit. Lower cost, simpler structure.',
        'NO + tech product or consumer brand - Pvt Ltd gives you better optionality for team incentives and future exits.',
        'NO + trading or manufacturing with simple partner split - Either works; choose LLP to keep costs low.',
        'NO + investment or holding vehicle - LLP is more efficient here.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Can I convert an LLP to a Pvt Ltd later if I want to raise funding?',
      a: 'Yes, you can convert - it is allowed under Section 366 of the Companies Act, 2013. But it involves multiple MCA filings, stamp duty, and often a valuation exercise. It typically takes 3-6 months and costs Rs. 50,000 to Rs. 1.5 lakh. If funding is even a possibility within 3 years, it is almost always cheaper and simpler to just start as a Pvt Ltd.',
    },
    {
      q: 'Do I need a minimum amount of capital to start?',
      a: 'No. Both a Pvt Ltd and an LLP can be incorporated with as little as Re. 1 as initial capital. In practice, most Pvt Ltd companies start with Rs. 1 lakh paid-up capital, but there is no legal minimum.',
    },
    {
      q: 'Can a foreign national be a director or partner?',
      a: 'In a Pvt Ltd, a foreigner can be a director - but at least one director must have stayed in India for 182 days or more in the previous calendar year. In an LLP, a foreign national can be a designated partner, but there are FEMA (foreign exchange) regulations that apply to the investment.',
    },
    {
      q: 'Which is easier to shut down if things do not work out?',
      a: 'LLP, by a significant margin. If an LLP has been inactive for a year and has no outstanding liabilities, you can close it using a simplified strike-off process (Form 24). Closing a Pvt Ltd - whether through voluntary winding up or strike-off under Section 248 - involves more paperwork and takes longer.',
    },
    {
      q: 'Does an LLP need to hold board meetings like a Pvt Ltd?',
      a: 'No. LLPs have no requirement for formal board meetings or general meetings. Partners can make decisions informally, as agreed in the LLP Agreement. This is a genuine compliance relief if you want to keep things simple.',
    },
  ],
};
