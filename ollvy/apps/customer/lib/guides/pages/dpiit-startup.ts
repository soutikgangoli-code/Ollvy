// lib/guides/pages/dpiit-startup.ts
import { LearnPageConfig } from '../pages';

export const dpiitStartup: LearnPageConfig = {
  slug: 'should-i-get-dpiit-startup-recognition',
  title: 'Should I Get DPIIT Startup Recognition?',
  seoTitle: 'DPIIT Startup India Recognition 2025: Is It Worth It? | Ollvy',
  seoDescription: 'Decide if DPIIT Startup Recognition is right for your company. Covers eligibility, 3-year tax holiday, angel tax exemption, labour law exemptions, and how to apply.',
  canonicalUrl: 'https://www.ollvy.com/guides/should-i-get-dpiit-startup-recognition',
  lastReviewed: 'March 2025',
  category: 'Registration',
  ctaServiceSlug: 'pvt-ltd-incorporation',
  relatedServiceSlugs: ['pvt-ltd-incorporation', 'llp-incorporation'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'is-msme-registration-worth-it', 'do-i-need-trademark-registration'],
  relatedTools: {
    penaltyCalculators: ['mca-annual-filing'],
    documentChecklists: ['private-limited-company'],
  },

  tool: {
    type: 'eligibility',
    title: 'Does DPIIT Startup Recognition Make Sense for You?',
    questions: [
      {
        text: 'What type of entity is your business?',
        options: [
          { value: 'pvt_ltd', label: 'Private Limited Company' },
          { value: 'llp', label: 'LLP' },
          { value: 'partnership', label: 'Partnership firm or sole proprietorship' },
          { value: 'not_incorporated', label: 'Not yet incorporated' },
        ],
        earlyExit: (answer) => {
          if (answer === 'partnership') {
            return {
              type: 'not_required',
              headline: 'Sole proprietorships do not qualify.',
              body: 'DPIIT recognition is only for Pvt Ltd companies, LLPs, and registered partnership firms. Sole proprietorships do not qualify.',
            };
          }
          if (answer === 'not_incorporated') {
            return {
              type: 'recommended',
              headline: 'Incorporate first, then apply.',
              body: 'You need to incorporate as a Pvt Ltd or LLP first. Once incorporated, you can apply for DPIIT recognition.',
              ctaLabel: 'Incorporate Your Company',
              ctaHref: '/checkout/pvt-ltd-incorporation',
            };
          }
          return null;
        },
      },
      {
        text: 'How long has the business been incorporated?',
        options: [
          { value: 'within_10_years', label: 'Less than 10 years' },
          { value: 'over_10_years', label: 'More than 10 years' },
        ],
        earlyExit: (answer) => {
          if (answer === 'over_10_years') {
            return {
              type: 'not_required',
              headline: 'Your entity is too old to qualify.',
              body: 'The entity must be less than 10 years old from its date of incorporation to qualify for DPIIT Startup Recognition.',
            };
          }
          return null;
        },
      },
      {
        text: 'What is your annual turnover?',
        options: [
          { value: 'below_100cr', label: 'Below Rs. 100 crore' },
          { value: 'above_100cr', label: 'Above Rs. 100 crore' },
        ],
        earlyExit: (answer) => {
          if (answer === 'above_100cr') {
            return {
              type: 'not_required',
              headline: 'Your turnover exceeds the DPIIT limit.',
              body: 'DPIIT Startup Recognition is only for businesses with turnover below Rs. 100 crore in every financial year.',
            };
          }
          return null;
        },
      },
      {
        text: 'What does your business do?',
        options: [
          { value: 'innovation_tech', label: 'Technology-driven or innovation-driven product or service with scale potential' },
          { value: 'traditional_business', label: 'Traditional business - trading, restaurant, salon, real estate' },
          { value: 'planning_raise', label: 'Planning to raise equity funding from investors' },
        ],
        evaluator: (answer) => {
          if (answer === 'traditional_business') {
            return {
              type: 'optional',
              headline: 'You may not qualify as a "startup".',
              body: 'DPIIT requires working towards "innovation, development, or commercialisation of new products/processes/services driven by technology or IP." A traditional business may not qualify.',
            };
          }
          if (answer === 'innovation_tech' || answer === 'planning_raise') {
            return {
              type: 'recommended',
              headline: 'Apply for DPIIT Startup Recognition.',
              body: 'Your business fits the DPIIT startup criteria. The most important benefit is angel tax protection - investments above fair market value are not treated as taxable income.',
              ctaLabel: 'Apply for DPIIT Recognition',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Yes - apply if you meet the criteria',
      body: 'DPIIT Startup Recognition is free to apply for and takes 2-7 working days. The most important benefit for most early-stage companies is angel tax protection - investments above fair market value are not treated as taxable income. If you are raising money from angels, this matters significantly.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT THIS RECOGNITION ACTUALLY IS',
      body: 'DPIIT Startup Recognition is a certificate issued by the Department for Promotion of Industry and Internal Trade under the Startup India initiative. It is not the same as MSME/Udyam registration - these are two completely separate things with different benefits. You apply on the Startup India portal (startupindia.gov.in), it is reviewed and approved within 2-7 working days, and the process involves no physical inspection or audit.',
      note: 'Source: DPIIT Notification No. G.S.R. 127(E) dated February 19, 2019',
    },
    {
      number: '02',
      heading: 'DO YOU QUALIFY?',
      body: 'All of these must be true at the same time:',
      bullets: [
        'Entity type: Private Limited Company, LLP, or Registered Partnership Firm',
        'Age: Less than 10 years from the date of incorporation',
        'Turnover: Below Rs. 100 crore in every financial year since you started',
        'Nature of work: You are working towards innovation, development, deployment, or commercialisation of new products, processes, or services - driven by technology or intellectual property',
        'Not formed by splitting up or reconstructing an existing business',
        'Your business is headquartered in India',
      ],
      note: 'Source: Startup India Definition, DPIIT Notification 2019',
    },
    {
      number: '03',
      heading: 'THE BENEFITS - AND WHICH ONES ARE ACTUALLY SIGNIFICANT',
      body: 'Let us be honest about which benefits genuinely move the needle.',
      bullets: [
        'Angel tax exemption (Section 56(2)(viib)): This is the big one. For DPIIT-recognised startups, money received from angel investors above Fair Market Value is not taxed as income from other sources. This was a huge blocker for early-stage funding rounds and removing it matters.',
        '3-year income tax holiday (Section 80-IAC): 100% profit deduction for any 3 consecutive years within your first 10 years. Important note: this requires a separate certification from the Inter-Ministerial Board (IMB) - it is not automatic with DPIIT recognition alone.',
        'Patent filing: 80% rebate on government patent filing fees, plus fast-tracked examination through a dedicated startup IP cell',
        'Labour law self-certification: For 5 years, you can self-certify compliance under 3 central labour laws instead of being subject to inspections',
        "Fund of Funds access: Eligible for investment from SIDBI's Fund of Funds via registered AIFs (Alternative Investment Funds)",
      ],
      note: 'Source: Section 80-IAC, Income Tax Act; Section 56(2)(viib) proviso',
    },
    {
      number: '04',
      heading: 'WHEN IT IS NOT WORTH PURSUING',
      body: '',
      bullets: [
        'Traditional businesses (restaurants, salons, real estate, trading) without a technology angle - approval is unlikely, and even if you get it, the tax holiday requires a further level of certification',
        'Businesses older than 10 years or above Rs. 100 crore in revenue - you are simply ineligible',
        'Sole proprietorships and HUFs - not eligible by entity type',
        'Businesses that have no plans to raise equity funding and are already well past startup stage',
      ],
    },
    {
      number: '05',
      heading: 'THE ANGEL TAX PROTECTION IS THE ONE TO UNDERSTAND',
      body: 'If you are raising money from angel investors, this protection matters more than almost any other benefit.',
      bullets: [
        'Section 56(2)(viib) of the Income Tax Act used to treat investments received above Fair Market Value as taxable income for the company - at 30%+. This was called "angel tax" and it was a genuine problem for early-stage startups.',
        'For DPIIT-recognised startups, this provision does not apply. Any investment from eligible investors is not taxed as income.',
        'This removes a major legal risk from your funding round. Without recognition, a large investment at a high valuation could generate a surprise tax bill.',
        'Important: This protection applies to investments from resident Indian individuals and eligible AIFs. Foreign investments still require FEMA compliance.',
      ],
      note: 'Source: Section 56(2)(viib) proviso; CBDT Circular on startup angel tax exemption',
    },
    {
      number: '06',
      heading: 'THE DECISION IS SIMPLE IF YOU QUALIFY',
      body: '',
      bullets: [
        'Pvt Ltd or LLP + under 10 years + under Rs. 100 crore + technology/innovation angle = Apply now. It is free, takes 2-7 days.',
        'Raising from angels soon = Apply before you close the round. The angel tax protection is only active once you are recognised.',
        'Want cheaper patents = Apply now.',
        'Traditional business or above the limits = Skip this; look at Udyam registration instead.',
      ],
    },
  ],

  faqs: [
    {
      q: 'What is the difference between DPIIT recognition and the 3-year tax holiday?',
      a: 'DPIIT recognition from the Startup India portal is the first step - and it gets you most benefits including angel tax protection. The 3-year income tax holiday under Section 80-IAC is a separate, additional step that requires a certificate from the Inter-Ministerial Board of Certification (IMBC). The Board is more selective - they look for validated innovation. Getting DPIIT recognition does not automatically give you the tax holiday.',
    },
    {
      q: 'Does DPIIT recognition involve any government inspection?',
      a: 'No. You self-declare on the Startup India portal, upload your incorporation certificate, and describe your product or innovation with supporting evidence (like a website or pitch deck). No physical inspection or audit is triggered.',
    },
    {
      q: 'Can I have both DPIIT recognition and Udyam registration at the same time?',
      a: 'Yes, and if you qualify for both, you should have both. They serve completely different purposes. DPIIT gives you income tax protection and fundraising benefits. Udyam gives you credit access, tender eligibility, and payment protection from large buyers. Apply for both.',
    },
    {
      q: 'Does DPIIT recognition need to be renewed?',
      a: 'No. Recognition stays valid until you cross the 10-year age limit or the Rs. 100 crore turnover threshold. There is no renewal. If you no longer qualify, you are expected to inform DPIIT.',
    },
  ],
};
