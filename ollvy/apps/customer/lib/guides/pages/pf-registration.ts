import { LearnPageConfig } from '../pages'

export const pfRegistration: LearnPageConfig = {
  slug: 'when-does-pf-registration-become-mandatory',
  title: 'When Does PF Registration Become Mandatory?',
  seoTitle: 'PF Registration: When is it Mandatory in India 2026? | Ollvy',
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
              ctaHref: '/services',
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
          if (answer === 'scheduled' && (allAnswers?.[0] === '10_to_19')) {
            return {
              type: 'mandatory',
              headline: 'PF registration is mandatory.',
              body: 'Scheduled industries (cinema, beedi, textile mills) have a lower threshold of 10 employees, not 20. You are above this.',
              ctaLabel: 'Get Payroll Help',
              ctaHref: '/services',
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
              ctaHref: '/services',
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
      table: {
        caption: 'PF Registration Threshold by Industry',
        headers: ['Industry Type', 'Mandatory Threshold', 'Examples'],
        rows: [
          ['Most industries', '20 employees', 'IT, retail, hospitality, healthcare, services, manufacturing'],
          ['Scheduled industries', '10 employees', 'Cinemas, theatres, beedi/tobacco, jute/cotton textile mills'],
          ['Voluntary', 'Below threshold', 'Any employer can register voluntarily - contribution rate 10% instead of 12%'],
        ],
      },
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
      table: {
        caption: 'PF Contribution Rates (EPF Scheme 1952)',
        headers: ['Contributor', 'Rate', 'Paid To', 'Applicable to'],
        rows: [
          ['Employee', '12% of basic salary + DA', 'EPF account', 'All PF members'],
          ['Employer - EPF', '3.67% of basic salary + DA', 'EPF account', 'All covered employees'],
          ['Employer - EPS (pension)', '8.33% of basic salary + DA', 'EPS account', 'Employees earning up to Rs. 15,000 basic'],
          ['Employer - EDLI (insurance)', '0.5% of wages', 'EDLI scheme', 'All covered employees'],
          ['Employer - Admin charges', '0.5% of wages', 'EPFO admin', 'All covered employees'],
          ['Total employer cost', '~13.61% of basic + DA', 'Various', 'In addition to the employee\'s own contribution'],
        ],
      },
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
