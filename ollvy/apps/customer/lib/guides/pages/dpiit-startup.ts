import { LearnPageConfig } from '../pages'

export const dpiitStartup: LearnPageConfig = {
  slug: 'should-i-get-dpiit-startup-recognition',
  title: 'Should I Get DPIIT Startup Recognition?',
  seoTitle: 'DPIIT Startup India Recognition 2025: Is It Worth It? | Ollvy',
  seoDescription:
    'Decide if DPIIT Startup Recognition is right for your company. Covers eligibility, angel tax exemption, 3-year tax holiday, patent benefits, and how to apply.',
  canonicalUrl: 'https://www.ollvy.com/guides/should-i-get-dpiit-startup-recognition',
  lastReviewed: 'April 2026',
  category: 'Startup',
  ctaServiceSlug: 'pvt-ltd-incorporation',
  relatedServiceSlugs: ['pvt-ltd-incorporation'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'is-msme-registration-worth-it'],
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
          { value: 'partnership', label: 'Registered Partnership Firm' },
          { value: 'other', label: 'Sole proprietorship, HUF, or not yet incorporated' },
        ],
        earlyExit: (answer: string) => {
          if (answer === 'other') {
            return {
              type: 'ineligible' as const,
              headline: 'Not eligible by entity type.',
              body: 'DPIIT recognition requires a Pvt Ltd, LLP, or Registered Partnership Firm. Incorporate first.',
              ctaLabel: 'Register Pvt Ltd',
              ctaHref: '/checkout/pvt-ltd-incorporation',
            }
          }
          return null
        },
      },
      {
        text: 'How long has the business been incorporated?',
        options: [
          { value: 'below_5', label: 'Less than 5 years' },
          { value: '5_to_10', label: '5 to 10 years' },
          { value: 'above_10', label: 'More than 10 years' },
        ],
        earlyExit: (answer: string) => {
          if (answer === 'above_10') {
            return {
              type: 'ineligible' as const,
              headline: 'Age limit exceeded.',
              body: 'DPIIT recognition is only available within the first 10 years of incorporation. Look at Udyam registration instead.',
            }
          }
          return null
        },
      },
      {
        text: 'What does your business primarily do?',
        options: [
          { value: 'tech_saas', label: 'SaaS, app, or technology platform' },
          { value: 'tech_product', label: 'Tech-enabled product (hardware, device, biotech)' },
          { value: 'services_tech', label: 'Tech-enabled services (AI, data, fintech)' },
          { value: 'traditional', label: 'Traditional business - trading, restaurant, real estate, salon' },
        ],
        earlyExit: (answer: string) => {
          if (answer === 'traditional') {
            return {
              type: 'ineligible' as const,
              headline: 'Likely not eligible.',
              body: 'DPIIT recognition requires innovation or technology-driven work. Traditional businesses typically do not meet this criterion.',
            }
          }
          return null
        },
      },
      {
        text: 'Which of these apply to you?',
        options: [
          { value: 'raising_angels', label: 'Raising or planning to raise from angel investors' },
          { value: 'has_ip', label: 'You have or plan to file patents or proprietary IP' },
          { value: 'hiring_fast', label: 'Scaling headcount rapidly (10+ hires planned this year)' },
          { value: 'none', label: 'None of these specifically' },
        ],
        evaluator: (answer: string, allAnswers: string[]) => {
          const answers = [...allAnswers, answer]
          const entityType = answers[0]
          const age = answers[1]
          const businessType = answers[2]
          const specificContext = answers[3]

          const benefits: { label: string; relevance: 'high' | 'medium' | 'low'; reason: string; description: string }[] = []

          // Angel tax - most impactful if fundraising
          const raisingAngels = specificContext === 'raising_angels'
          benefits.push({
            label: 'Angel Tax Exemption (Section 56(2)(viib))',
            description: 'Investment received above fair market value is not taxed as income. At 30%, this is a serious financial risk without recognition.',
            relevance: raisingAngels ? 'high' : 'medium',
            reason: raisingAngels
              ? 'You are raising from angels - this protection is critical before you close a round'
              : 'Even if not raising now, protection activates the moment you do. Apply before you need it.',
          })

          // 80-IAC tax holiday
          const earlyStage = age === 'below_5'
          benefits.push({
            label: '3-Year Income Tax Holiday (Section 80-IAC)',
            description: '100% profit deduction for any 3 consecutive years within your first 10. Requires separate Inter-Ministerial Board certification after DPIIT recognition.',
            relevance: earlyStage ? 'high' : 'medium',
            reason: earlyStage
              ? 'You are in your first 5 years - the most valuable window to claim this'
              : 'Still available but the window is narrowing. Apply for IMB certification after recognition.',
          })

          // Patents
          const hasIP = specificContext === 'has_ip'
          benefits.push({
            label: 'Patent Subsidy (80% fee rebate)',
            description: '80% off government patent filing fees, plus fast-tracked examination through DPIIT\'s startup IP cell.',
            relevance: hasIP ? 'high' : businessType === 'tech_product' ? 'medium' : 'low',
            reason: hasIP
              ? 'You have IP to protect - the 80% fee rebate is directly valuable'
              : businessType === 'tech_product'
                ? 'Hardware and biotech typically have patentable components - worth exploring'
                : 'Less directly relevant for pure software/services businesses',
          })

          // Labour compliance
          const hiringFast = specificContext === 'hiring_fast'
          benefits.push({
            label: 'Labour Law Self-Certification (5 years)',
            description: 'Self-certify compliance under 3 central labour laws instead of being subject to inspections for 5 years.',
            relevance: hiringFast ? 'high' : 'medium',
            reason: hiringFast
              ? 'Scaling headcount fast - avoiding labour inspections for 5 years is immediately valuable'
              : 'Useful as you grow. Removes inspection risk during your most vulnerable scaling phase.',
          })

          // Fund of funds
          benefits.push({
            label: 'Fund of Funds Access (SIDBI)',
            description: 'Eligible for investment from SIDBI\'s Fund of Funds via registered AIFs.',
            relevance: raisingAngels ? 'medium' : 'low',
            reason: raisingAngels
              ? 'Relevant if you eventually pursue institutional funding via AIFs'
              : 'More relevant at Series A stage than early angel rounds',
          })

          return {
            type: 'eligible' as const,
            headline: 'Apply now. It is free and takes 2-7 working days.',
            body: 'Here are the benefits ranked by how relevant they are to your situation.',
            ctaLabel: 'Apply on Startup India Portal',
            ctaHref: 'https://startupindia.gov.in',
            ranking: {
              type: 'benefits' as const,
              benefits,
            },
          }
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Apply if you meet the criteria.',
      body: 'Free, 2-7 working days. Angel tax protection is the most important benefit for early-stage fundraising.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT THIS RECOGNITION ACTUALLY IS',
      body: 'DPIIT Startup Recognition is a certificate from the Department for Promotion of Industry and Internal Trade under the Startup India initiative. It is not the same as MSME/Udyam registration - these are two completely separate programmes with different benefits. You apply on the Startup India portal (startupindia.gov.in), reviewed within 2-7 working days, with no physical inspection or audit.',
      note: 'Source: DPIIT Notification No. G.S.R. 127(E) dated February 19, 2019',
    },
    {
      number: '02',
      heading: 'DO YOU QUALIFY?',
      body: 'All of these must be true:',
      bullets: [
        'Entity type: Private Limited Company, LLP, or Registered Partnership Firm',
        'Age: Less than 10 years from the date of incorporation',
        'Turnover: Below Rs. 100 crore in every financial year since you started',
        'Nature of work: Innovation, development, deployment, or commercialisation of new products, processes, or services - driven by technology or intellectual property',
        'Not formed by splitting up or reconstructing an existing business',
        'Headquartered in India',
      ],
      table: {
        caption: 'DPIIT Startup Recognition: Eligibility Criteria',
        headers: ['Criterion', 'Requirement', 'Common Disqualifier'],
        rows: [
          ['Entity type', 'Private Limited Company, LLP, or Registered Partnership Firm', 'Sole proprietorship, HUF, trust - not eligible'],
          ['Age', 'Less than 10 years from date of incorporation', 'Businesses older than 10 years'],
          ['Turnover', 'Below Rs. 100 crore in every financial year since incorporation', 'Any year above Rs. 100 crore'],
          ['Nature of work', 'Innovation, development, or commercialisation driven by technology or intellectual property', 'Pure trading, restaurants, salons, real estate'],
          ['Formation method', 'Not formed by splitting or reconstructing an existing business', 'Spin-offs from existing companies'],
          ['Headquarters', 'India', 'Foreign-incorporated entities'],
        ],
      },
      note: 'Source: Startup India Definition, DPIIT Notification 2019',
    },
    {
      number: '03',
      heading: 'THE BENEFITS - AND WHICH ONES ACTUALLY MATTER',
      body: '',
      bullets: [
        'Angel tax exemption (Section 56(2)(viib)): For DPIIT-recognised startups, money received from angel investors above Fair Market Value is not taxed as income. This is the most significant benefit for early-stage fundraising.',
        '3-year income tax holiday (Section 80-IAC): 100% profit deduction for any 3 consecutive years within your first 10 years. Both companies and LLPs qualify. Important: this requires a separate certification from the Inter-Ministerial Board (IMB) - it is not automatic with DPIIT recognition alone.',
        'Patent filing: 80% rebate on government patent fees, plus fast-tracked examination through a dedicated startup IP cell.',
        'Labour law self-certification: For 5 years, self-certify compliance under 3 central labour laws instead of being subject to inspections.',
        'Fund of Funds access: Eligible for investment from SIDBI\'s Fund of Funds via registered AIFs.',
      ],
      table: {
        caption: 'DPIIT Startup Recognition Benefits',
        headers: ['Benefit', 'What It Does', 'Requires Extra Step?', 'Most Relevant For'],
        rows: [
          ['Angel Tax Exemption (Sec 56(2)(viib))', 'Investment above Fair Market Value not taxed as income at 30%', 'No - automatic on recognition', 'Any startup raising from angel investors'],
          ['3-Year Tax Holiday (Sec 80-IAC)', '100% profit deduction for any 3 consecutive years in first 10 years', 'Yes - separate IMB certification required', 'Profitable startups in early years'],
          ['Patent fee rebate', '80% off government patent filing fees + fast-tracked examination', 'No - cite recognition certificate when filing', 'IP-driven and product startups'],
          ['Labour law self-certification', 'Self-certify under 3 central labour laws for 5 years - no inspections', 'No - automatic on recognition', 'Startups scaling headcount fast'],
          ['Fund of Funds access', 'Eligible for investment via SIDBI Fund of Funds through registered AIFs', 'No - automatic on recognition', 'Startups seeking institutional funding'],
        ],
      },
      note: 'Source: Section 80-IAC, Income Tax Act; Section 56(2)(viib) proviso',
    },
    {
      number: '04',
      heading: 'WHEN IT IS NOT WORTH PURSUING',
      body: '',
      bullets: [
        'Traditional businesses (restaurants, salons, real estate, trading) without a technology angle - approval is unlikely',
        'Businesses older than 10 years or above Rs. 100 crore in revenue - simply ineligible',
        'Sole proprietorships and HUFs - not eligible by entity type',
        'Businesses with no plans to raise equity and already well past startup stage',
      ],
    },
    {
      number: '05',
      heading: 'THE ANGEL TAX PROTECTION IS THE ONE TO UNDERSTAND',
      body: 'If you are raising money from angels, this protection matters more than almost any other benefit.',
      bullets: [
        'Section 56(2)(viib) used to treat investment received above Fair Market Value as taxable income for the company at 30%+. This was "angel tax" and it was a real problem for early-stage startups with high valuations.',
        'For DPIIT-recognised startups, this provision does not apply. Any investment from eligible investors is not taxed as income.',
        'This removes a major legal risk from your funding round. Without recognition, a large investment at a high valuation could generate a surprise tax bill.',
        'This protection applies to investments from resident Indian individuals and eligible AIFs. Foreign investments still require FEMA compliance.',
      ],
      note: 'Source: Section 56(2)(viib) proviso; CBDT Circular on startup angel tax exemption',
    },
    {
      number: '06',
      heading: 'THE DECISION IS SIMPLE IF YOU QUALIFY',
      body: '',
      bullets: [
        'Pvt Ltd or LLP + under 10 years + under Rs. 100 crore + technology/innovation angle = Apply now. Free, takes 2-7 days.',
        'Raising from angels soon = Apply before you close the round. Angel tax protection is only active once you are recognised.',
        'Want cheaper patents = Apply now.',
        'Traditional business or above the limits = Skip this; look at Udyam registration instead.',
        'Want the 3-year tax holiday = Apply for DPIIT recognition first, then separately apply to the Inter-Ministerial Board.',
      ],
    },
  ],

  faqs: [
    {
      q: 'What is the difference between DPIIT recognition and the 3-year tax holiday?',
      a: 'DPIIT recognition from the Startup India portal is the first step - it gets you most benefits including angel tax protection. The 3-year income tax holiday under Section 80-IAC requires a separate certificate from the Inter-Ministerial Board of Certification (IMBC). The Board is more selective - they look for validated innovation. DPIIT recognition does not automatically give you the tax holiday.',
    },
    {
      q: 'Does DPIIT recognition involve any government inspection?',
      a: 'No. You self-declare on the Startup India portal, upload your incorporation certificate, and describe your product or innovation with supporting evidence (website, pitch deck). No physical inspection or audit is triggered.',
    },
    {
      q: 'Can I have both DPIIT recognition and Udyam registration at the same time?',
      a: 'Yes, and if you qualify for both, get both. They serve completely different purposes. DPIIT gives you income tax protection and fundraising benefits. Udyam gives you credit access, tender eligibility, and payment protection from large buyers.',
    },
    {
      q: 'Does DPIIT recognition need to be renewed?',
      a: 'No. Recognition stays valid until you cross the 10-year age limit or the Rs. 100 crore turnover threshold. No renewal needed. If you no longer qualify, you are expected to inform DPIIT.',
    },
  ],
}
