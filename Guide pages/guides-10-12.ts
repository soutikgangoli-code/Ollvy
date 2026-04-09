// ─── GUIDE 10: DPIIT STARTUP RECOGNITION ────────────────────────────────────
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
        earlyExit: (answer) => {
          if (answer === 'other') {
            return {
              type: 'ineligible',
              headline: 'Not eligible by entity type.',
              body: 'DPIIT Startup Recognition requires a Private Limited Company, LLP, or Registered Partnership Firm. Sole proprietorships and HUFs cannot apply. Incorporate first.',
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
          { value: 'below_10_years', label: 'Less than 10 years' },
          { value: 'above_10_years', label: 'More than 10 years' },
        ],
        earlyExit: (answer) => {
          if (answer === 'above_10_years') {
            return {
              type: 'ineligible',
              headline: 'Not eligible - age limit exceeded.',
              body: 'DPIIT recognition is only available to entities incorporated within the last 10 years. Look at Udyam registration instead.',
            }
          }
          return null
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
              type: 'ineligible',
              headline: 'Not eligible - turnover exceeds Rs. 100 crore.',
              body: 'The DPIIT recognition turnover ceiling is Rs. 100 crore in any financial year since incorporation.',
            }
          }
          return null
        },
      },
      {
        text: 'What does your business do?',
        options: [
          { value: 'tech_innovation', label: 'Technology-driven or innovation-driven product or service with scale potential' },
          { value: 'traditional', label: 'Traditional business - trading, restaurant, salon, real estate' },
          { value: 'raising_funding', label: 'Planning to raise equity funding from investors' },
        ],
        evaluator: (answer) => {
          if (answer === 'traditional') {
            return {
              type: 'ineligible',
              headline: 'Likely not eligible.',
              body: 'DPIIT recognition requires innovation or technology-driven work with scale potential. Traditional businesses typically do not meet this criterion.',
            }
          }
          if (answer === 'tech_innovation' || answer === 'raising_funding') {
            return {
              type: 'eligible',
              headline: 'Apply - it is free and takes 2-7 working days.',
              body: 'DPIIT recognition removes the angel tax risk on fundraising, gives you an 80% rebate on patent fees, and qualifies you for the Section 80-IAC tax holiday (via separate IMB application). No cost, no inspection.',
              ctaLabel: 'Learn More',
              ctaHref: '/services/pvt-ltd-incorporation',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Yes - apply if you meet the criteria.',
      body: 'DPIIT Startup Recognition is free and takes 2-7 working days. The most important benefit for early-stage companies is angel tax protection - investments above fair market value are not treated as taxable income. If you are raising money from angels, this matters significantly.',
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


// ─── GUIDE 11: FSSAI LICENCE ──────────────────────────────────────────────────

export const fssaiLicense: LearnPageConfig = {
  slug: 'do-i-need-fssai-license',
  title: 'Do I Need an FSSAI Licence?',
  seoTitle: 'Do I Need an FSSAI Licence in India 2025? | Ollvy',
  seoDescription:
    'Find out if FSSAI registration or licence is mandatory for your food business in India. Covers restaurants, cloud kitchens, home cooks, manufacturers, and importers.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-fssai-license',
  lastReviewed: 'April 2026',
  category: 'Licensing',
  ctaServiceSlug: 'fssai-license',
  relatedServiceSlugs: ['fssai-license'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  tool: {
    type: 'eligibility',
    title: 'What FSSAI Licence Does Your Food Business Need?',
    questions: [
      {
        text: 'What does your food business do?',
        options: [
          { value: 'restaurant', label: 'Restaurant, cafe, dhaba, canteen, or cloud kitchen' },
          { value: 'manufacturing', label: 'Manufacturing, processing, or packaging food products' },
          { value: 'trading', label: 'Trading, retailing, or distributing food (offline or online)' },
          { value: 'import_export', label: 'Importing or exporting food' },
        ],
        earlyExit: (answer) => {
          if (answer === 'import_export') {
            return {
              type: 'mandatory',
              headline: 'You need a Central FSSAI Licence.',
              body: 'Food importers and exporters require a Central FSSAI Licence regardless of turnover. This is issued by the FSSAI central office in New Delhi.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            }
          }
          return null
        },
      },
      {
        text: 'What is your annual turnover from food activities?',
        options: [
          { value: 'below_12l', label: 'Below Rs. 12 lakh per year' },
          { value: '12l_to_20cr', label: 'Rs. 12 lakh to Rs. 20 crore per year' },
          { value: 'above_20cr', label: 'Above Rs. 20 crore per year' },
        ],
        evaluator: (answer) => {
          if (answer === 'below_12l') {
            return {
              type: 'mandatory',
              headline: 'You need Basic FSSAI Registration.',
              body: 'Even the smallest food business needs at minimum a Basic Registration (Form A). Issued by your local Food Safety Officer, it is the simplest and cheapest option.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            }
          }
          if (answer === '12l_to_20cr') {
            return {
              type: 'mandatory',
              headline: 'You need a State FSSAI Licence.',
              body: 'Businesses with turnover between Rs. 12 lakh and Rs. 20 crore operating within one state need a State FSSAI Licence (Form B - State). Issued by the State Food Safety Authority.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            }
          }
          if (answer === 'above_20cr') {
            return {
              type: 'mandatory',
              headline: 'You need a Central FSSAI Licence.',
              body: 'Businesses above Rs. 20 crore turnover, multi-state operations, importers, and exporters need a Central FSSAI Licence (Form B - Central). Issued by the FSSAI central office.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'mandatory',
      headline: 'Yes - any food business needs FSSAI.',
      body: 'Under the Food Safety and Standards Act, 2006, anyone involved in the manufacture, processing, distribution, sale, or import of food must be registered or licensed. This applies to every food business - from a home baker selling on Instagram to a national food chain.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THREE TIERS - AND WHICH ONE IS YOURS',
      body: 'The Food Safety and Standards Act, 2006 has three tiers depending on the scale of your food operation. Using the wrong tier is treated as non-compliance.',
      bullets: [
        'Basic Registration (Form A): For small food businesses - home-based sellers, petty manufacturers, small canteens, temporary stall holders - with annual turnover below Rs. 12 lakh. The simplest and cheapest option. Issued by the local Food Safety Officer.',
        'State FSSAI Licence (Form B - State): For food businesses with turnover between Rs. 12 lakh and Rs. 20 crore. Covers restaurants, hotels, distributors, transporters, and manufacturers operating within one state. Issued by the State Food Safety Authority.',
        'Central FSSAI Licence (Form B - Central): For businesses above Rs. 20 crore turnover, importers, exporters, central government canteens, and businesses operating across multiple states. Issued by the FSSAI central office in New Delhi.',
      ],
      note: 'Source: Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011',
    },
    {
      number: '02',
      heading: 'IF YOU DEAL WITH FOOD COMMERCIALLY, THIS APPLIES',
      body: '"Food business" is broad enough to cover almost every commercial food activity.',
      bullets: [
        'Restaurants, dhabas, cafes, food courts, canteens',
        'Cloud kitchens and delivery-only operations',
        'Home-based food businesses selling through Swiggy, Zomato, social media, or WhatsApp groups',
        'Bakers, confectioners, and snack makers',
        'Packaged water and beverage producers',
        'Meat, fish, and poultry processors',
        'Oil mills and flour mills',
        'Retailers and kirana stores selling packaged food',
        'Food importers and exporters',
      ],
    },
    {
      number: '03',
      heading: 'THINGS PEOPLE COMMONLY MISS',
      body: '',
      bullets: [
        'Home-based food sellers: If you sell home-cooked food via Instagram, WhatsApp, or a delivery app, you need at minimum a Basic FSSAI Registration. "I sell from home" is not an exemption.',
        'Cloud kitchens: No dine-in customers does not change the requirement. Preparing food for delivery requires a State Licence.',
        'E-commerce food sellers: Selling packaged food on Amazon or Flipkart requires your FSSAI number printed on packaging and displayed on the platform.',
        'Multi-state operations: Restaurants in more than one state need a Central Licence, not separate state licences.',
      ],
    },
    {
      number: '04',
      heading: 'WHO DOES NOT NEED AN FSSAI',
      body: 'The exemptions are narrow.',
      bullets: [
        'Farmers selling their own unprocessed produce directly at the farm gate',
        'Pure logistics companies that transport food but do not own, process, or sell it',
        'Religious or community events distributing free food below state-specific quantity thresholds',
      ],
      note: 'If you are charging money for food in any form, assume you need FSSAI. The exemptions are genuinely narrow.',
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS IF YOU OPERATE WITHOUT FSSAI',
      body: '',
      bullets: [
        'Penalty for operating without registration or licence: Up to Rs. 5 lakh (Section 63, Food Safety and Standards Act)',
        'Unsafe or adulterated food: Up to life imprisonment and Rs. 10 lakh fine in severe cases',
        'Stock seizure: Food safety officers can seize your entire stock without a court order',
        'Platform removal: Swiggy and Zomato require a valid FSSAI number at onboarding and remove accounts that do not maintain it',
        'Amazon and Flipkart listings: Products without a valid FSSAI number on packaging are liable to be de-listed',
      ],
    },
    {
      number: '06',
      heading: 'QUICK REFERENCE',
      body: '',
      bullets: [
        'Any food business at any scale = some form of FSSAI is required',
        'Turnover below Rs. 12 lakh = Basic Registration (Form A)',
        'Turnover Rs. 12 lakh to Rs. 20 crore, single state = State FSSAI Licence (Form B)',
        'Turnover above Rs. 20 crore, multi-state, or importer/exporter = Central FSSAI Licence',
        'On Swiggy, Zomato, or Amazon = FSSAI number required by the platform',
      ],
    },
  ],

  faqs: [
    {
      q: 'I sell home-made pickles and chutneys. Do I really need FSSAI?',
      a: 'Yes. If you are receiving payment for food, you are a food business operator in the eyes of the law. Basic Registration (the simplest tier, issued by your local food safety officer) is what you need. It is straightforward and low-cost.',
    },
    {
      q: 'How long does FSSAI registration or licensing take?',
      a: 'Basic Registration: 7 working days. State Licence: 30 days. Central Licence: 60 days. In most cases, you can display the application acknowledgement number and begin operations while you wait for the actual licence.',
    },
    {
      q: 'Does my FSSAI licence need to be renewed?',
      a: 'Yes. Registrations and licences are valid for 1 to 5 years depending on what you chose when you applied. You must renew before it expires. Operating with an expired FSSAI is treated the same as operating without one.',
    },
    {
      q: 'My restaurant is on Swiggy and Zomato. Do they check FSSAI?',
      a: 'Yes. Both platforms require you to upload your FSSAI licence at the time of onboarding and your FSSAI number is displayed on your restaurant profile. They periodically verify it against the FSSAI database and can suspend your account if it is expired or invalid.',
    },
  ],
}


// ─── GUIDE 12: ITR FORM SELECTION ────────────────────────────────────────────

export const itrFormSelection: LearnPageConfig = {
  slug: 'which-itr-form-should-i-use',
  title: 'Which ITR Form Should I Use?',
  seoTitle: 'Which ITR Form to Use in 2025? ITR-1 to ITR-7 Guide | Ollvy',
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
        earlyExit: (answer) => {
          if (answer === 'company') {
            return {
              type: 'eligible',
              headline: 'You need ITR-6.',
              body: 'All companies (except those claiming exemption under Section 11) file ITR-6. This is for Pvt Ltd, Public Ltd, and OPC.',
            }
          }
          if (answer === 'firm_llp') {
            return {
              type: 'eligible',
              headline: 'You need ITR-5.',
              body: 'Partnership firms, LLPs, AOPs, and BOIs all file ITR-5. The firm files its own return; each partner files their personal return separately.',
            }
          }
          if (answer === 'trust_ngo') {
            return {
              type: 'eligible',
              headline: 'You need ITR-7.',
              body: 'Trusts, political parties, universities, and scientific research institutions filing under Sections 139(4A), 139(4B), 139(4C), or 139(4D) use ITR-7.',
            }
          }
          return null
        },
      },
      {
        text: 'Where does your income come from?',
        options: [
          { value: 'salary_only', label: 'Salary or pension - that is mostly it' },
          { value: 'salary_plus_gains', label: 'Salary plus capital gains from shares, mutual funds, or property' },
          { value: 'business_income', label: 'Business income or professional fees (freelancer, doctor, consultant, trader)' },
          { value: 'presumptive', label: 'A small business where I want to declare income as a flat percentage (Section 44AD/44ADA)' },
        ],
        earlyExit: (answer) => {
          if (answer === 'salary_plus_gains') {
            return {
              type: 'eligible',
              headline: 'You need ITR-2.',
              body: 'Any capital gains - even a small mutual fund redemption - disqualify you from ITR-1. Use ITR-2.',
            }
          }
          if (answer === 'presumptive') {
            return {
              type: 'eligible',
              headline: 'You likely need ITR-4.',
              body: 'ITR-4 (Sugam) is for presumptive taxation under Sections 44AD, 44ADA, or 44AE. Check: business turnover must be below Rs. 2 crore (44AD) or professional receipts below Rs. 50 lakh (44ADA). No capital gains allowed.',
            }
          }
          if (answer === 'business_income') {
            return {
              type: 'eligible',
              headline: 'You need ITR-3.',
              body: 'ITR-3 is for individuals with business or professional income who maintain actual books of accounts. Also use ITR-3 if your turnover exceeds presumptive limits or if you have capital gains alongside business income.',
            }
          }
          return null
        },
      },
      {
        text: 'Does any of this apply to you?',
        options: [
          { value: 'director_or_unlisted', label: 'I am a director in any company, or I hold unlisted shares' },
          { value: 'foreign', label: 'I have foreign assets, a foreign bank account, or income from outside India' },
          { value: 'above_50l', label: 'My total income from all sources is above Rs. 50 lakh' },
          { value: 'none', label: 'None of these - just salary, one property, and some interest income' },
        ],
        evaluator: (answer) => {
          if (answer === 'director_or_unlisted' || answer === 'foreign' || answer === 'above_50l') {
            return {
              type: 'eligible',
              headline: 'You need ITR-2.',
              body: 'Directorship in any company, holding unlisted shares, foreign assets, foreign income, or total income above Rs. 50 lakh all disqualify you from ITR-1. Use ITR-2.',
            }
          }
          if (answer === 'none') {
            return {
              type: 'eligible',
              headline: 'You can use ITR-1.',
              body: 'ITR-1 (Sahaj) is for resident individuals with income from salary, one house property, and interest - total income below Rs. 50 lakh, no capital gains, not a director, no foreign assets.',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'optional',
      headline: 'When in doubt, use ITR-2.',
      body: 'ITR-2 covers everything ITR-1 covers, plus more. There is no penalty for filing a more comprehensive form than strictly required. But filing ITR-1 when you should have used ITR-2 makes the return defective.',
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
