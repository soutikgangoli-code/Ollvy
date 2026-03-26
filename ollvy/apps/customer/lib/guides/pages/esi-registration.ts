// lib/guides/pages/esi-registration.ts
import { LearnPageConfig } from '../pages';

export const esiRegistration: LearnPageConfig = {
  slug: 'when-does-esi-registration-become-mandatory',
  title: 'When Does ESI Registration Become Mandatory?',
  seoTitle: 'ESI Registration: When is it Mandatory in India 2025? | Ollvy',
  seoDescription: 'Understand when ESIC registration becomes mandatory for your business in India. Employee threshold, salary limit, covered industries, and non-compliance penalties.',
  canonicalUrl: 'https://www.ollvy.com/guides/when-does-esi-registration-become-mandatory',
  lastReviewed: 'March 2025',
  category: 'Compliance',
  ctaServiceSlug: 'payroll-management',
  relatedServiceSlugs: ['payroll-management'],
  relatedLearnSlugs: ['when-does-pf-registration-become-mandatory', 'do-i-need-professional-tax-registration', 'do-i-need-shop-establishment-registration'],
  // No closely related penalty calculators or document checklists for ESI

  tool: {
    type: 'eligibility',
    title: 'Is ESI Registration Mandatory for Your Business?',
    questions: [
      {
        text: 'How many employees do you have right now?',
        options: [
          { value: 'below_10', label: 'Fewer than 10' },
          { value: '10_plus', label: '10 or more' },
          { value: 'hiring_soon', label: 'Fewer than 10, but growing quickly' },
        ],
        earlyExit: (answer) => {
          if (answer === 'hiring_soon') {
            return {
              type: 'recommended',
              headline: 'Register when you cross 10 employees.',
              body: 'Once you cross 10 employees, register within 15 days. Start preparing your employee data now.',
              ctaLabel: 'Get ESI Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          return null;
        },
      },
      {
        text: 'What kind of business do you run?',
        options: [
          { value: 'factory', label: 'A factory or manufacturing unit with power' },
          { value: 'non_seasonal_factory', label: 'A factory without power, or a seasonal operation' },
          { value: 'shops_services', label: 'A shop, office, IT company, hotel, restaurant, or cinema' },
          { value: 'other', label: 'Agriculture, construction, or something else' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'factory' && allAnswers[0] === '10_plus') {
            return {
              type: 'mandatory',
              headline: 'ESI registration is mandatory for your factory.',
              body: 'Factories with 10 or more employees must register under the ESI Act.',
              ctaLabel: 'Get ESI Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          if (answer === 'shops_services' && allAnswers[0] === '10_plus') {
            return {
              type: 'mandatory',
              headline: 'ESI registration is mandatory for your establishment.',
              body: 'ESI coverage has been extended to shops and establishments in most states. With 10+ employees, you need to register.',
              ctaLabel: 'Get ESI Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          return null;
        },
      },
      {
        text: 'What do your employees earn?',
        options: [
          { value: 'below_21k', label: 'Some employees earn below Rs. 21,000 per month' },
          { value: 'all_above_21k', label: 'Everyone earns above Rs. 21,000 per month' },
        ],
        evaluator: (answer) => {
          if (answer === 'all_above_21k') {
            return {
              type: 'not_required',
              headline: 'No ESI contributions due.',
              body: 'ESI contributions only apply to employees earning up to Rs. 21,000 per month. If no one falls within that bracket, there are no contributions due. However, registration may still technically apply.',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'not_required',
      headline: 'ESI does not appear to be mandatory for you right now',
      body: 'The main triggers are 10 or more employees in a factory, or 10 or more employees in shops, offices, or services in most states. You can revisit this as your team grows.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THE ESI THRESHOLD: 10 EMPLOYEES',
      body: 'The Employees State Insurance Act, 1948 applies to factories with 10 or more employees and to shops, restaurants, hotels, cinemas, IT companies, and other service establishments with 10 or more employees in states where the Act has been extended. As of 2025, ESI coverage has been extended to all states and union territories in India.',
      note: 'Source: Section 1(5), Employees State Insurance Act, 1948; ESIC Circulars on coverage extension',
    },
    {
      number: '02',
      heading: 'WHO COUNTS AS A COVERED EMPLOYEE',
      body: 'ESI covers employees earning up to Rs. 21,000 per month (Rs. 25,000 for persons with disabilities). Once your establishment is covered, all eligible employees must be enrolled.',
      bullets: [
        'Employees earning up to Rs. 21,000 per month in total wages',
        'Persons with disabilities employed at up to Rs. 25,000 per month',
        'Casual and temporary staff',
        'Contract workers if you are deploying them at your premises as the principal employer',
        'Directors who are on your payroll',
        'Family members working in the business and drawing salary',
      ],
      note: 'Employees earning above Rs. 21,000 do not need ESI contributions - but they still count toward your 10-employee threshold for determining whether the establishment is covered.',
    },
    {
      number: '03',
      heading: 'WHAT ESI CONTRIBUTIONS LOOK LIKE',
      body: "Once registered, contributions are calculated as a percentage of each covered employee's gross wages.",
      bullets: [
        'Employer contribution: 3.25% of gross wages',
        'Employee contribution: 0.75% of gross wages',
        'Total: 4% of gross wages for each covered employee',
        'Employees earning below approximately Rs. 176 per day are exempt from their own contribution, but the employer still pays 3.25%',
        'Contributions are due by the 15th of the following month',
        'Half-yearly returns must be filed twice a year',
      ],
      note: 'Source: ESI (Central) Rules, 1950; ESIC Contribution Rates Notification',
    },
    {
      number: '04',
      heading: 'WHAT ESI ACTUALLY GIVES YOUR EMPLOYEES',
      body: 'ESI is a proper social insurance scheme, not just a compliance checkbox. Covered employees and their families get real benefits.',
      bullets: [
        'Medical care: Full treatment for the employee and their family through ESIC dispensaries and hospitals',
        'Sickness benefit: 70% of wages for up to 91 days during certified illness',
        'Maternity benefit: Full wages for 26 weeks of maternity leave',
        'Disability benefit: 90% of wages if permanently or temporarily disabled due to a work injury',
        'Dependants benefit: 90% of wages paid to family members if the employee dies due to a work injury',
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
      heading: 'QUICK SUMMARY OF WHERE YOU STAND',
      body: '',
      bullets: [
        "10 or more employees in a covered establishment type? Check if your state's notification covers your industry - if yes, register.",
        'Any employees earning below Rs. 21,000? They must be enrolled once you are registered.',
        'All employees above Rs. 21,000? No contributions due, though registration may still technically apply.',
        'Crossing 10 employees? Register within 15 days of that happening.',
      ],
    },
  ],

  faqs: [
    {
      q: 'We already have PF registration. Is ESI the same thing?',
      a: 'No - they are completely separate. PF is managed by EPFO under the Employees Provident Funds Act, 1952. ESI is managed by ESIC under the Employees State Insurance Act, 1948. Different laws, different thresholds, different contributions, different registrations. You can be subject to both, one, or neither, depending on your setup.',
    },
    {
      q: 'Does ESI apply in my state?',
      a: 'Yes - ESI has been extended to all states and union territories. Coverage of specific establishment types (shops, IT companies, hotels) was progressively extended across states and is now essentially nationwide as of 2025.',
    },
    {
      q: 'Can my employees opt out of ESI if they have private health insurance?',
      a: 'No. Unlike PF, there is no individual opt-out from ESI. If your establishment is covered and an employee falls below the wage ceiling, both their contribution and yours are mandatory. The only exception is if the employer obtains a specific exemption under Section 87 of the ESI Act by demonstrating they provide superior medical benefits - this is a formal government approval process, not a simple opt-out.',
    },
    {
      q: 'We just crossed 10 employees. How long do we have to register?',
      a: 'You have 15 days from the date you cross the threshold to apply for ESI registration.',
    },
  ],
};
