import { LearnPageConfig } from '../pages'

export const esiRegistration: LearnPageConfig = {
  slug: 'when-does-esi-registration-become-mandatory',
  title: 'When Does ESI Registration Become Mandatory?',
  seoTitle: 'ESI Registration: When is it Mandatory in India 2026? | Ollvy',
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
              ctaHref: '/services',
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
      table: {
        caption: 'ESI Contribution Rates (ESI Act 1948)',
        headers: ['Contributor', 'Rate', 'Basis'],
        rows: [
          ['Employer', '3.25%', 'Gross wages of each covered employee'],
          ['Employee', '0.75%', 'Gross wages'],
          ['Total', '4%', 'Per covered employee per month'],
          ['Employees earning ≤ Rs. 176/day', 'Employer pays 3.25%, employee exempt from contribution', 'Employee below daily wage threshold'],
          ['Employees earning above Rs. 21,000/month', 'No ESI contribution', 'Above salary ceiling - exempt from ESI'],
        ],
      },
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
      table: {
        caption: 'ESI Benefits Available to Covered Employees and Dependants',
        headers: ['Benefit', 'Amount / Coverage', 'Eligibility Period'],
        rows: [
          ['Medical care', 'Full treatment for employee and family through ESIC hospitals', 'From day of registration'],
          ['Sickness benefit', '70% of wages for up to 91 days per year', 'After 6 months of contribution'],
          ['Maternity benefit', 'Full wages for 26 weeks', 'After 70 days of contribution'],
          ['Disability benefit (employment injury)', '90% of wages - permanent or temporary disability', 'From day of registration'],
          ['Dependants benefit (death due to injury)', '90% of wages paid to family', 'From day of registration'],
          ['Funeral expenses', 'Rs. 15,000 lump sum', 'On death of insured person'],
        ],
      },
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
