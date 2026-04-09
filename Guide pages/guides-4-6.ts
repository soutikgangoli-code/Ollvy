// ─── GUIDE 4: TRADEMARK REGISTRATION ─────────────────────────────────────────
import { LearnPageConfig } from '../pages'

export const trademarkGuide: LearnPageConfig = {
  slug: 'do-i-need-trademark-registration',
  title: 'Do I Need Trademark Registration?',
  seoTitle: 'Do I Need to Register a Trademark in India 2025? | Ollvy',
  seoDescription:
    'Find out if trademark registration makes sense for your brand in India. Understand protection, costs, enforcement, and when to prioritise it in 2025.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-trademark-registration',
  lastReviewed: 'April 2026',
  category: 'Registration',
  ctaServiceSlug: 'trademark-registration',
  relatedServiceSlugs: ['trademark-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'is-msme-registration-worth-it'],
  relatedTools: {
    documentChecklists: ['trademark'],
  },

  tool: {
    type: 'eligibility',
    title: 'Should You Register Your Trademark?',
    questions: [
      {
        text: 'How central is your brand name or logo to your business?',
        options: [
          { value: 'central', label: 'It is the product - customers search for us by name' },
          { value: 'matters', label: 'It matters, but we also compete on quality and relationships' },
          { value: 'less_important', label: 'B2B supplier or white-label - the brand is less important' },
        ],
        earlyExit: (answer) => {
          if (answer === 'central') {
            return {
              type: 'mandatory',
              headline: 'Register now.',
              body: 'Your brand is the product. Someone can register your name before you and legally demand you stop using it. The cost is Rs. 4,500 for small entities. There is no good reason to wait.',
              ctaLabel: 'Register Trademark',
              ctaHref: '/checkout/trademark-registration',
            }
          }
          return null
        },
      },
      {
        text: 'Have you spent money building brand awareness in the last 12 months?',
        options: [
          { value: 'significant', label: 'Yes - significant spend on ads, packaging, or marketing' },
          { value: 'some', label: 'Some - social media and basic content' },
          { value: 'none', label: 'Not yet - we have not started marketing' },
        ],
        earlyExit: (answer) => {
          if (answer === 'significant') {
            return {
              type: 'mandatory',
              headline: 'Register now.',
              body: 'Every rupee you have spent is building value in an unprotected brand. Someone can register your name and your investment evaporates. Register before your next campaign.',
              ctaLabel: 'Register Trademark',
              ctaHref: '/checkout/trademark-registration',
            }
          }
          return null
        },
      },
      {
        text: 'Is anyone else using a similar name in your industry?',
        options: [
          { value: 'yes_similar', label: 'Yes, similar names exist' },
          { value: 'not_sure', label: 'Not sure - I have not checked' },
          { value: 'unique', label: 'Our name is unique - nothing similar exists' },
        ],
        earlyExit: (answer) => {
          if (answer === 'yes_similar') {
            return {
              type: 'mandatory',
              headline: 'Register now - before someone else does.',
              body: 'In India, trademark rights go to whoever registers first. If similar names exist, the race to register is already on.',
              ctaLabel: 'Register Trademark',
              ctaHref: '/checkout/trademark-registration',
            }
          }
          return null
        },
      },
      {
        text: 'Are any of these in your plans?',
        options: [
          { value: 'international_or_licensing', label: 'Expanding internationally or licensing my brand' },
          { value: 'funding', label: 'Raising investor funding' },
          { value: 'none', label: 'None - staying India-focused and self-funded' },
        ],
        evaluator: (answer) => {
          if (answer === 'international_or_licensing' || answer === 'funding') {
            return {
              type: 'recommended',
              headline: 'Register before that happens.',
              body: 'You cannot legally license a brand you do not own as a registered trademark. And IP due diligence in a funding round will flag an unregistered brand as a risk.',
              ctaLabel: 'Register Trademark',
              ctaHref: '/checkout/trademark-registration',
            }
          }
          return {
            type: 'recommended',
            headline: 'Not urgent today - but set a timeline.',
            body: 'Registration costs Rs. 4,500 for small entities per class. That is Rs. 4,500 for 10 years of protection. Do it before you invest heavily in marketing.',
            ctaLabel: 'Learn More',
            ctaHref: '/services/trademark-registration',
          }
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Not urgent right now - but register before you scale.',
      body: 'Your brand exposure is moderate. The cost is Rs. 4,500 for individuals and small entities per class. Register before you invest heavily in marketing - because after that point, if someone has already registered the same name, you have no easy recourse.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT A TRADEMARK ACTUALLY DOES FOR YOU',
      body: 'A trademark is a legally recognised sign - a name, logo, tagline, or combination - that identifies your products or services as yours. Once registered under the Trade Marks Act, 1999, you have the exclusive right to use that mark commercially in India for 10 years (renewable forever). More importantly, you have the legal power to stop others from using the same or confusingly similar mark in your category.',
      note: 'Source: Trade Marks Act, 1999; Trade Marks Rules, 2017',
    },
    {
      number: '02',
      heading: 'WHEN YOU CANNOT AFFORD TO WAIT',
      body: 'Registration is urgent in these situations.',
      bullets: [
        'You are spending on ads, packaging, or social media - every rupee is building value in an unprotected brand',
        'You sell on Amazon or Flipkart - both platforms have brand registry programs requiring trademark registration. Without it, your listings are open to hijackers and copycats',
        'You run a SaaS or tech product - your product name is your primary asset. A competitor can register a similar name first',
        'You plan to franchise or license - you cannot license a brand you do not own as a registered trademark',
        'You are raising investor funding - IP due diligence will catch an unregistered brand and can delay or complicate your round',
        'India gives trademark rights to whoever registers first - waiting means someone else can register your name',
      ],
      note: 'Source: Section 28, Trade Marks Act, 1999',
    },
    {
      number: '03',
      heading: 'WHEN YOU CAN TAKE A BIT MORE TIME',
      body: 'Lower urgency, but set a timeline.',
      bullets: [
        'Early stage, still validating your product - aim to register within 6 months of committing to a name',
        'B2B service firm that mostly gets work through referrals - lower risk of copying, but register before you scale',
        'Local service business (salon, restaurant, regional brand) - register before you open your second location',
      ],
    },
    {
      number: '04',
      heading: 'WHEN IT IS GENUINELY NOT URGENT',
      body: '',
      bullets: [
        'You are still testing and have not settled on a name',
        'Pure white-label supplier with no consumer-facing brand',
        'Working under your own name serving a small local client base',
      ],
      note: 'Even without a registered trademark, you have limited protection against copycats under "passing off" (Section 27, Trade Marks Act). But proving passing off requires demonstrating prior reputation in court - expensive, slow, and uncertain. Registration is far simpler.',
    },
    {
      number: '05',
      heading: 'WHAT ACTUALLY HAPPENS TO BUSINESSES THAT DELAY',
      body: '',
      bullets: [
        'Someone else registers your name and legally demands you stop using it',
        'You receive a cease-and-desist from a registered holder, even if you have been using the name longer - without registration, your protection is limited',
        'Without a registered trademark, you cannot enrol in Amazon Brand Registry, leaving your listings open to unauthorised sellers',
        'Competitors can file IP infringement complaints against your marketplace listings if they have a registered mark and you do not',
        'In M&A or funding due diligence, an unregistered brand is flagged as an IP risk affecting valuation',
      ],
    },
    {
      number: '06',
      heading: 'THE COST IS LOW ENOUGH THAT THE QUESTION IS JUST WHEN',
      body: 'Government filing fee: Rs. 4,500 per class for individuals and small entities (Rs. 9,000 for others). That is per class, per 10 years - not per year.',
      bullets: [
        'Decided on a name and started any marketing? Register within 30 days',
        'Raising funding or planning M&A? Register today',
        'Expanding to a second city or new product? Register before that expansion',
        'Still testing product-market fit? Do a free search on the IP India portal now, and register the moment you commit to the name',
        'Renewal: Rs. 9,000 to Rs. 10,000 every 10 years',
      ],
    },
  ],

  faqs: [
    {
      q: 'How long does trademark registration actually take?',
      a: 'Your application is filed and gets a filing date immediately - and your rights are protected from that date, not the final registration date. From filing to receiving the official registration certificate (assuming no objections), the typical timeline is 18-24 months.',
    },
    {
      q: 'What is a trademark class and which one do I need?',
      a: 'Goods and services are divided into 45 categories called classes. Class 42 is software and tech services; Class 25 is clothing; Class 35 is retail and marketing. You register per class. Using the wrong class means you are unprotected in the category you actually operate in. Most businesses need 1-3 classes.',
    },
    {
      q: 'Can I trademark a common word like "Fresh" or "Quick"?',
      a: 'Descriptive or generic words are very difficult to register on their own. But a distinctive combination, a stylised logo, or a word used in an unexpected context (Apple for computers) can be protected. A trademark attorney can assess whether your name is protectable before you build a business around it.',
    },
    {
      q: 'What do TM, R, and C symbols mean?',
      a: 'TM can be used by anyone claiming rights to a mark - even without registration. R can only be used once your trademark is officially registered; using it before registration is an offence. C applies to creative works like art and music, not trademarks.',
    },
    {
      q: 'Do I need a trademark or a copyright for my logo?',
      a: 'Both can apply. Copyright protects the artistic creation automatically from the moment it is made. Trademark protects the logo as a brand identifier in commerce. For a business, trademark registration is usually more important because it gives you enforceable commercial rights and a practical way to stop copycats.',
    },
  ],
}


// ─── GUIDE 5: PF REGISTRATION ─────────────────────────────────────────────────

export const pfRegistration: LearnPageConfig = {
  slug: 'when-does-pf-registration-become-mandatory',
  title: 'When Does PF Registration Become Mandatory?',
  seoTitle: 'PF Registration: When is it Mandatory in India 2025? | Ollvy',
  seoDescription:
    'Find out when Provident Fund (EPFO) registration becomes mandatory for your business in India. Covers employee threshold, penalties, and voluntary registration.',
  canonicalUrl: 'https://www.ollvy.com/guides/when-does-pf-registration-become-mandatory',
  lastReviewed: 'April 2026',
  category: 'Compliance',
  ctaServiceSlug: 'payroll-management',
  relatedServiceSlugs: ['payroll-management'],
  relatedLearnSlugs: ['when-does-esi-registration-become-mandatory'],

  tool: {
    type: 'eligibility',
    title: 'Is PF Registration Mandatory for Your Business?',
    questions: [
      {
        text: 'How many people does your business currently employ?',
        options: [
          { value: 'below_10', label: 'Fewer than 10' },
          { value: '10_to_19', label: '10 to 19 employees' },
          { value: '20_plus', label: '20 or more employees' },
          { value: 'growing', label: 'Below 20 now, but growing fast' },
        ],
        earlyExit: (answer) => {
          if (answer === '20_plus') {
            return {
              type: 'mandatory',
              headline: 'PF registration is mandatory.',
              body: 'You have crossed the 20-employee threshold. Register with EPFO within 30 days if you have not done so.',
              ctaLabel: 'Get Payroll Help',
              ctaHref: '/checkout/payroll-management',
            }
          }
          return null
        },
      },
      {
        text: 'What industry is your business in?',
        options: [
          { value: 'scheduled', label: 'Cinema/theatre, beedi/tobacco, or jute/cotton textile mill' },
          { value: 'it_tech', label: 'IT, BPO, software, or tech startup' },
          { value: 'services', label: 'Retail, hospitality, food, healthcare, or other services' },
          { value: 'manufacturing', label: 'Other manufacturing or engineering' },
        ],
        earlyExit: (answer, allAnswers) => {
          if (answer === 'scheduled' && (allAnswers[0] === '10_to_19')) {
            return {
              type: 'mandatory',
              headline: 'PF registration is mandatory.',
              body: 'Scheduled industries (cinema, beedi, textile mills) have a lower threshold of 10 employees, not 20. You are above this.',
              ctaLabel: 'Get Payroll Help',
              ctaHref: '/checkout/payroll-management',
            }
          }
          return null
        },
      },
      {
        text: 'What do your employees earn?',
        options: [
          { value: 'all_above_15k', label: 'Everyone earns above Rs. 15,000 basic salary per month' },
          { value: 'mix', label: 'A mix - some above, some below Rs. 15,000 basic' },
          { value: 'all_below_15k', label: 'Everyone earns below Rs. 15,000 basic per month' },
        ],
      },
      {
        text: 'Do your clients, staffing contracts, or tenders ask for PF registration?',
        options: [
          { value: 'yes', label: 'Yes, it has come up' },
          { value: 'no', label: 'No, not so far' },
          { value: 'not_sure', label: 'Not sure' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'yes' && allAnswers[0] === 'growing') {
            return {
              type: 'recommended',
              headline: 'Register proactively.',
              body: 'If clients are already asking and you are close to 20 employees, register now. Late registration after crossing the threshold means retroactive contributions from the date you became eligible.',
              ctaLabel: 'Get Payroll Help',
              ctaHref: '/checkout/payroll-management',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'not_required',
      headline: 'Not required at your current size.',
      body: 'With fewer than 20 employees and no scheduled industry trigger, PF registration is not mandatory. The key is to track headcount - the moment you cross 20, you have 30 days to register.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THE NUMBER THAT CHANGES EVERYTHING: 20',
      body: 'Under the Employees Provident Funds and Miscellaneous Provisions Act, 1952, PF registration becomes mandatory the moment your business employs 20 or more people. Once you cross 20, you have 30 days to register. Who counts toward that 20:',
      bullets: [
        'All direct employees on your payroll',
        'Contract workers if you are directing their work at your premises',
        'Casual and temporary staff who work regularly',
        'Directors who draw a regular salary',
        'Part-time employees',
      ],
      note: 'Source: Section 1(3)(b), Employees Provident Funds and Miscellaneous Provisions Act, 1952',
    },
    {
      number: '02',
      heading: 'SOME INDUSTRIES HAVE A LOWER THRESHOLD',
      body: 'If your business is in one of these industries, PF registration kicks in at 10 employees, not 20.',
      bullets: [
        'Cinemas and theatres',
        'Cigarette, beedi, and tobacco product manufacturing',
        'Textile mills (jute, cotton, or other fibre manufacturing)',
        'Any establishment specifically notified by the Central Government under Section 1(4) of the EPF Act',
      ],
      note: 'If you are in manufacturing and unsure which category applies, check Schedule I of the EPF Act.',
    },
    {
      number: '03',
      heading: 'WHAT PF ACTUALLY COSTS YOUR BUSINESS',
      body: 'Once registered, both you and your employees contribute monthly.',
      bullets: [
        'Employee contribution: 12% of basic salary plus dearness allowance (DA)',
        'Employer contribution: 12% - of which 3.67% goes to EPF (Provident Fund) and 8.33% to EPS (Employee Pension Scheme)',
        'Employer also pays 0.5% in administrative charges',
        'The mandatory contribution only applies to employees earning up to Rs. 15,000 basic per month',
        'Payments must be made by the 15th of the following month',
        'For voluntary registrations (below 20 employees), the contribution rate is 10% instead of 12%',
      ],
      note: 'Source: EPF Scheme, 1952; Employee Pension Scheme, 1995',
    },
    {
      number: '04',
      heading: 'WHEN PF DOES NOT APPLY',
      body: '',
      bullets: [
        'Fewer than 20 employees in most industries (fewer than 10 in scheduled industries)',
        'Government establishments where employees are already covered under a separate provident fund scheme',
        'Employees earning above Rs. 15,000 basic can choose to opt out - though this does not exempt the employer from registering once the threshold is met',
        'Establishments with their own superior provident fund scheme approved under Section 17 of the EPF Act',
      ],
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS IF YOU DO NOT REGISTER WHEN YOU SHOULD',
      body: '',
      bullets: [
        'Penalty for not registering: Up to Rs. 5,000 per day',
        'Interest on unpaid contributions: 12% per annum',
        'Damages for delayed payment: Between 5% and 25% of arrears depending on how long you delayed',
        'Employees can file complaints directly with the EPFO Regional Commissioner',
        'Criminal prosecution: Wilful non-compliance carries imprisonment up to 1 year under Section 14 of the EPF Act',
      ],
      note: 'Use our penalty calculator: /tools/penalty-calculator/pf-esic-penalty',
    },
    {
      number: '06',
      heading: 'WHERE YOU STAND AND WHAT TO DO NEXT',
      body: '',
      bullets: [
        '20 or more employees right now? Register immediately if you have not already',
        '15 to 19 employees? Prepare your payroll data and register before your next hire',
        '10 to 14 employees in a scheduled industry? You are already above threshold - register now',
        'Below 10 employees? You are fine - check again with every new hire',
        'Any employees earning below Rs. 15,000 basic? Once registered, they must be enrolled',
      ],
    },
  ],

  faqs: [
    {
      q: 'We went above 20 employees but are now back below 20. Do we still need to be registered?',
      a: 'Yes. Once an establishment has employed 20 or more people at any point in the previous 12 months, it remains covered under the EPF Act - even if headcount later drops. The Act uses "any day of the preceding 12 months" as the reference point.',
    },
    {
      q: 'We use contract workers from a staffing agency. Do they count toward our 20-employee limit?',
      a: 'It depends on the contract structure. If the staffing agency employs and pays them, they are the employer for PF purposes. If you are directing their work at your premises, EPFO may count them toward your threshold. This is a grey area - get clarity on your specific contract structure.',
    },
    {
      q: 'Can an employee earning above Rs. 15,000 opt out of PF?',
      a: 'An employee who has never been an EPFO member and earns above Rs. 15,000 basic salary can opt out when joining a new employer by submitting Form 11. Once you are an EPFO member, you cannot opt out - even if your salary later crosses Rs. 15,000. You can choose to contribute only on Rs. 15,000 rather than your full salary.',
    },
    {
      q: 'What is a UAN and does every employee need one?',
      a: 'UAN is a 12-digit Universal Account Number assigned by EPFO to every PF member. It stays with the person across all jobs. As an employer, you need to generate or link a UAN for every covered employee when they join.',
    },
    {
      q: 'What about part-time or contractual employees?',
      a: 'Yes, they count toward your 20-employee threshold. And once your establishment is registered, contributions are due for all employees earning up to Rs. 15,000 basic - regardless of full-time, part-time, or contractual status.',
    },
  ],
}


// ─── GUIDE 6: ESI REGISTRATION ────────────────────────────────────────────────

export const esiRegistration: LearnPageConfig = {
  slug: 'when-does-esi-registration-become-mandatory',
  title: 'When Does ESI Registration Become Mandatory?',
  seoTitle: 'ESI Registration: When is it Mandatory in India 2025? | Ollvy',
  seoDescription:
    'Understand when ESIC registration becomes mandatory for your business in India. Employee threshold, salary limit, covered industries, and non-compliance penalties.',
  canonicalUrl: 'https://www.ollvy.com/guides/when-does-esi-registration-become-mandatory',
  lastReviewed: 'April 2026',
  category: 'Compliance',
  ctaServiceSlug: 'payroll-management',
  relatedServiceSlugs: ['payroll-management'],
  relatedLearnSlugs: ['when-does-pf-registration-become-mandatory'],

  tool: {
    type: 'eligibility',
    title: 'Is ESI Registration Mandatory for Your Business?',
    questions: [
      {
        text: 'How many employees do you have right now?',
        options: [
          { value: 'below_10', label: 'Fewer than 10' },
          { value: '10_plus', label: '10 or more' },
          { value: 'growing', label: 'Fewer than 10, but growing quickly' },
        ],
        earlyExit: (answer) => {
          if (answer === '10_plus') {
            return {
              type: 'mandatory',
              headline: 'ESI registration is mandatory.',
              body: 'The threshold is 10 employees for factories and most establishments. Register within 15 days of crossing this number.',
              ctaLabel: 'Get Payroll Help',
              ctaHref: '/checkout/payroll-management',
            }
          }
          return null
        },
      },
      {
        text: 'What kind of business do you run?',
        options: [
          { value: 'factory_power', label: 'A factory or manufacturing unit with power' },
          { value: 'factory_no_power', label: 'A factory without power, or a seasonal operation' },
          { value: 'shop_office', label: 'A shop, office, IT company, hotel, restaurant, or cinema' },
          { value: 'other', label: 'Agriculture, construction, or something else' },
        ],
      },
      {
        text: 'What do your employees earn?',
        options: [
          { value: 'some_below_21k', label: 'Some employees earn below Rs. 21,000 per month' },
          { value: 'all_above_21k', label: 'Everyone earns above Rs. 21,000 per month' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'all_above_21k') {
            return {
              type: 'conditional',
              headline: 'Registration may technically apply - but no contributions are due.',
              body: 'If your establishment meets the 10-employee threshold, ESI registration still applies. But since all employees earn above Rs. 21,000, no contributions are due from you or your employees.',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'not_required',
      headline: 'ESI does not appear mandatory for you right now.',
      body: 'The main triggers are 10 or more employees in a factory, or 10 or more in shops, offices, or services. Revisit this as your team grows.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THE ESI THRESHOLD: 10 EMPLOYEES',
      body: 'The Employees State Insurance Act, 1948 applies to factories with 10 or more employees and to shops, restaurants, hotels, cinemas, IT companies, and other service establishments with 10 or more employees. As of 2025, ESI coverage has been extended to all states and union territories in India.',
      note: 'Source: Section 1(5), Employees State Insurance Act, 1948; ESIC Circulars on coverage extension',
    },
    {
      number: '02',
      heading: 'WHO COUNTS AS A COVERED EMPLOYEE',
      body: 'ESI covers employees earning up to Rs. 21,000 per month (Rs. 25,000 for persons with disabilities).',
      bullets: [
        'Employees earning up to Rs. 21,000 per month in total wages',
        'Persons with disabilities employed at up to Rs. 25,000 per month',
        'Casual and temporary staff',
        'Contract workers if you are deploying them at your premises as the principal employer',
        'Directors who are on your payroll',
      ],
      note: 'Employees earning above Rs. 21,000 do not need ESI contributions - but they still count toward your 10-employee threshold.',
    },
    {
      number: '03',
      heading: 'WHAT ESI CONTRIBUTIONS LOOK LIKE',
      body: 'Once registered, contributions are calculated as a percentage of each covered employee\'s gross wages.',
      bullets: [
        'Employer contribution: 3.25% of gross wages',
        'Employee contribution: 0.75% of gross wages',
        'Total: 4% of gross wages for each covered employee',
        'Employees earning below approximately Rs. 176 per day are exempt from their own contribution - the employer still pays 3.25%',
        'Contributions are due by the 15th of the following month',
        'Half-yearly returns must be filed twice a year',
      ],
      note: 'Source: ESI (Central) Rules, 1950; ESIC Contribution Rates Notification',
    },
    {
      number: '04',
      heading: 'WHAT ESI ACTUALLY GIVES YOUR EMPLOYEES',
      body: 'ESI is a genuine social insurance scheme. Covered employees and their families get:',
      bullets: [
        'Medical care: Full treatment for the employee and family through ESIC dispensaries and hospitals',
        'Sickness benefit: 70% of wages for up to 91 days during certified illness',
        'Maternity benefit: Full wages for 26 weeks of maternity leave',
        'Disability benefit: 90% of wages if permanently or temporarily disabled due to a work injury',
        'Dependants benefit: 90% of wages paid to family if the employee dies due to a work injury',
        'Funeral expenses: Rs. 15,000 lump sum',
      ],
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS IF YOU DO NOT COMPLY',
      body: '',
      bullets: [
        'Not registering when required: Penalty up to Rs. 10,000 and prosecution under Section 85 of the ESI Act',
        'Late payment of contributions: 12% per annum interest on unpaid amounts',
        'Damages for delay: 5% to 25% of arrears depending on how long the delay continues',
        'ESIC can directly attach bank accounts and property to recover arrears',
        'Wilful evasion: Imprisonment up to 2 years under Section 85',
      ],
    },
    {
      number: '06',
      heading: 'QUICK SUMMARY',
      body: '',
      bullets: [
        '10 or more employees in a covered establishment type? Check if your state\'s notification covers your industry - if yes, register',
        'Any employees earning below Rs. 21,000? They must be enrolled once you are registered',
        'All employees above Rs. 21,000? No contributions due, though registration may still technically apply',
        'Crossing 10 employees? Register within 15 days',
      ],
    },
  ],

  faqs: [
    {
      q: 'We already have PF registration. Is ESI the same thing?',
      a: 'No. PF is managed by EPFO under the Employees Provident Funds Act, 1952. ESI is managed by ESIC under the Employees State Insurance Act, 1948. Different laws, different thresholds, different contributions, different registrations. You can be subject to both, one, or neither.',
    },
    {
      q: 'Does ESI apply in my state?',
      a: 'Yes. ESI has been extended to all states and union territories. Coverage of specific establishment types (shops, IT companies, hotels) was progressively extended and is now essentially nationwide as of 2025.',
    },
    {
      q: 'Can my employees opt out of ESI if they have private health insurance?',
      a: 'No. Unlike PF, there is no individual opt-out from ESI. If your establishment is covered and an employee falls below the wage ceiling, both contributions are mandatory. The only exception is if the employer obtains a specific exemption under Section 87 of the ESI Act by demonstrating superior medical benefits - this is a formal government approval, not a simple opt-out.',
    },
    {
      q: 'We just crossed 10 employees. How long do we have to register?',
      a: 'You have 15 days from the date you cross the threshold to apply for ESI registration.',
    },
  ],
}
