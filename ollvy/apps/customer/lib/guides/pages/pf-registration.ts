// lib/guides/pages/pf-registration.ts
import { LearnPageConfig } from '../pages';

export const pfRegistration: LearnPageConfig = {
  slug: 'when-does-pf-registration-become-mandatory',
  title: 'When Does PF Registration Become Mandatory?',
  seoTitle: 'PF Registration: When is it Mandatory in India 2025? | Ollvy',
  seoDescription: 'Find out when Provident Fund (EPFO) registration becomes mandatory for your business in India. Covers employee threshold, penalties, and voluntary registration.',
  canonicalUrl: 'https://www.ollvy.com/guides/when-does-pf-registration-become-mandatory',
  lastReviewed: 'March 2025',
  category: 'Compliance',
  ctaServiceSlug: 'payroll-management',
  relatedServiceSlugs: ['payroll-management'],
  relatedLearnSlugs: ['when-does-esi-registration-become-mandatory', 'do-i-need-professional-tax-registration', 'do-i-need-shop-establishment-registration'],
  // No closely related penalty calculators or document checklists for PF

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
          { value: 'hiring_soon', label: 'Below 20 now, but growing fast' },
        ],
        earlyExit: (answer) => {
          if (answer === '20_plus') {
            return {
              type: 'mandatory',
              headline: 'PF registration is mandatory for you.',
              body: 'Any establishment with 20 or more employees must register under the EPF Act. You should register immediately if you have not already.',
              ctaLabel: 'Get PF Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          if (answer === 'hiring_soon') {
            return {
              type: 'mandatory',
              headline: 'Register when you cross 20 employees.',
              body: 'Once you cross 20 employees, you have 30 days to register. Start preparing your payroll data now.',
              ctaLabel: 'Get PF Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          return null;
        },
      },
      {
        text: 'What industry is your business in?',
        options: [
          { value: 'scheduled_industry', label: 'Cinema/theatre, beedi/tobacco manufacturing, or jute/cotton textile mill' },
          { value: 'it_services', label: 'IT, BPO, software services, or tech startup' },
          { value: 'other_services', label: 'Retail, hospitality, food, healthcare, or other services' },
          { value: 'manufacturing', label: 'Other manufacturing, construction, or engineering' },
          { value: 'not_sure', label: 'Not sure' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'scheduled_industry' && allAnswers[0] === '10_to_19') {
            // Schedule I industries (cinemas, beedi/tobacco, textile mills) have 10-employee threshold
            return {
              type: 'mandatory',
              headline: 'PF registration is mandatory for your industry.',
              body: 'Schedule I industries (cinemas, beedi/tobacco manufacturing, textile mills) have a lower threshold of 10 employees under Section 1(4) of the EPF Act. You need to register.',
              ctaLabel: 'Get PF Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          // Manufacturing/construction/engineering follow the standard 20-employee threshold
          return null;
        },
      },
      {
        text: 'What do your employees earn?',
        options: [
          { value: 'all_above_15k', label: 'Everyone earns above Rs. 15,000 basic salary per month' },
          { value: 'some_above_15k', label: 'A mix - some above, some below Rs. 15,000 basic' },
          { value: 'all_below_15k', label: 'Everyone earns below Rs. 15,000 basic salary per month' },
        ],
      },
      {
        text: 'Do your clients, staffing contracts, or tenders ask for PF registration?',
        options: [
          { value: 'yes_required', label: 'Yes, it has come up' },
          { value: 'no', label: 'No, not so far' },
          { value: 'not_sure', label: 'Not sure yet' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes_required') {
            return {
              type: 'recommended',
              headline: 'Voluntary registration makes commercial sense.',
              body: 'Even below the legal threshold, voluntary registration may be required by clients and makes your business more credible.',
              ctaLabel: 'Get PF Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'not_required',
      headline: 'Not required at your current size',
      body: 'With fewer than 20 employees and no industry-specific trigger, PF registration is not mandatory for you right now. The important thing is to keep track of your headcount - the moment you cross 20 employees, you have 30 days to register.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THE NUMBER THAT CHANGES EVERYTHING: 20',
      body: 'Under the Employees Provident Funds and Miscellaneous Provisions Act, 1952, PF registration becomes mandatory the moment your business employs 20 or more people. That is the trigger. It does not matter what industry you are in, what city you are in, or how much your employees earn. Once you cross 20, you have 30 days to register.\n\nWho counts toward that 20? More than you might think.',
      bullets: [
        'All direct employees on your payroll',
        'Contract workers if you are the one directing their work at your premises',
        'Casual and temporary staff who work regularly',
        'Directors who draw a regular salary',
        'Part-time employees',
      ],
      note: 'Source: Section 1(3)(b), Employees Provident Funds and Miscellaneous Provisions Act, 1952',
    },
    {
      number: '02',
      heading: 'SOME INDUSTRIES HAVE A LOWER THRESHOLD',
      body: 'If your business is in one of these industries, PF registration kicks in at 10 employees - not 20.',
      bullets: [
        'Cinemas and theatres',
        'Cigarette, beedi, and tobacco product manufacturing',
        'Textile mills (jute, cotton, or other fibre manufacturing)',
        'Any establishment specifically notified by the Central Government under Section 1(4) of the EPF Act',
      ],
      note: 'If you are in manufacturing and are not sure which category applies, check Schedule I of the EPF Act or ask a labour law advisor.',
    },
    {
      number: '03',
      heading: 'WHAT PF ACTUALLY COSTS YOUR BUSINESS',
      body: 'Once you are registered, both you and your employees contribute to the fund every month.',
      bullets: [
        'Your employee contributes 12% of their basic salary plus dearness allowance (DA)',
        'You as the employer also contribute 12% - of that, 3.67% goes to the EPF (Provident Fund) and 8.33% goes to EPS (Employee Pension Scheme)',
        'You also pay 0.5% in administrative charges',
        'For establishments that voluntarily register with fewer than 20 employees, the contribution rate is 10% instead of 12%',
        'The mandatory PF contribution only applies to employees earning up to Rs. 15,000 basic salary per month',
        'Payments must be made by the 15th of the following month',
      ],
      note: 'Source: EPF Scheme, 1952; Employee Pension Scheme, 1995',
    },
    {
      number: '04',
      heading: 'WHEN PF DOES NOT APPLY TO YOU',
      body: 'A few genuine exemptions.',
      bullets: [
        'Fewer than 20 employees in most industries (or below 10 in the scheduled industries listed above)',
        'Government establishments where employees are already covered under a separate provident fund scheme',
        'Employees earning above Rs. 15,000 basic salary can choose to opt out - though this does not exempt the employer from registering if the 20-employee threshold is met',
        'Establishments that have their own superior provident fund scheme and have received specific exemption under Section 17 of the EPF Act',
      ],
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS IF YOU DO NOT REGISTER WHEN YOU SHOULD',
      body: 'This is not an area where the consequences are light.',
      bullets: [
        'Penalty for not registering: Up to Rs. 5,000 per day',
        'Interest on unpaid contributions: 12% per annum',
        'Damages for delayed payment: Between 5% and 25% of arrears, depending on how long you delayed',
        'Employees can file complaints directly with the EPFO Regional Commissioner',
        'Criminal prosecution: Wilful non-compliance can lead to imprisonment up to 1 year and/or a fine under Section 14 of the EPF Act',
        'Labour audits have become more common in IT parks and industrial estates - being unregistered is an easy catch',
      ],
      note: 'Use our penalty calculator for specific amounts: /tools/penalty-calculator/pf-esic-penalty',
    },
    {
      number: '06',
      heading: 'WHERE YOU STAND AND WHAT TO DO NEXT',
      body: '',
      bullets: [
        '20 or more employees right now? Register immediately if you have not already.',
        '15 to 19 employees? Start preparing your payroll data now. Register before you make your next hire.',
        '10 to 14 employees in a scheduled industry? Register now - you have already crossed the threshold.',
        'Below 10 employees? You are fine - just check again with every new hire.',
        'Have any employees earning below Rs. 15,000 basic? Once you register, they must be enrolled.',
      ],
    },
  ],

  faqs: [
    {
      q: 'We went above 20 employees but are now back below 20. Do we still need to be registered?',
      a: 'Yes. Once an establishment has employed 20 or more people at any point in the previous 12 months, it remains covered under the EPF Act - even if headcount later drops. The Act specifically uses the phrase "any day of the preceding 12 months" as the reference point.',
    },
    {
      q: 'We use contract workers from a staffing agency. Do they count toward our 20-employee limit?',
      a: 'It depends on the contract structure. If the staffing agency employs and pays them, the agency is the employer for PF purposes and should have their own PF registration. If you are directing their work at your premises and are effectively their employer in practice, EPFO may count them toward your threshold. This is a grey area - get clarity on your specific contract structure before assuming.',
    },
    {
      q: 'Can an employee earning above Rs. 15,000 opt out of PF?',
      a: 'An employee who has never been an EPFO member and is earning above Rs. 15,000 basic salary can opt out when joining a new employer by submitting Form 11. However, once you are an EPFO member, you cannot opt out - even if your salary later crosses Rs. 15,000. You can choose to contribute only on Rs. 15,000 rather than your full salary.',
    },
    {
      q: 'What is a UAN and does every employee need one?',
      a: "UAN is a 12-digit Universal Account Number assigned by EPFO to every PF member. It stays the same across all jobs throughout a person's career. As an employer, you need to generate or link a UAN for every covered employee when they join.",
    },
    {
      q: 'What about part-time or contractual employees?',
      a: 'Yes, they count toward your 20-employee threshold. And once your establishment is registered, contributions are due for all employees earning up to Rs. 15,000 basic - regardless of whether they are full-time, part-time, or contractual.',
    },
  ],
};
