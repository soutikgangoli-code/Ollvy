// lib/guides/pages/professional-tax.ts
import { LearnPageConfig } from '../pages';

export const professionalTax: LearnPageConfig = {
  slug: 'do-i-need-professional-tax-registration',
  title: 'Do I Need Professional Tax Registration?',
  seoTitle: 'Professional Tax Registration in India 2025: Do You Need It? | Ollvy',
  seoDescription: 'Find out if Professional Tax applies to your business or profession in India. State-wise thresholds, who must register, and employer vs self-employed obligations.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-professional-tax-registration',
  lastReviewed: 'March 2025',
  category: 'Tax',
  ctaServiceSlug: 'payroll-management',
  relatedServiceSlugs: ['payroll-management'],
  relatedLearnSlugs: ['when-does-pf-registration-become-mandatory', 'when-does-esi-registration-become-mandatory', 'do-i-need-shop-establishment-registration'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },

  tool: {
    type: 'eligibility',
    title: 'Does Professional Tax Apply to You?',
    questions: [
      {
        text: 'Which state is your business based in?',
        options: [
          { value: 'pt_state', label: 'Maharashtra, Karnataka, West Bengal, Tamil Nadu, Andhra Pradesh, Telangana, Madhya Pradesh, Odisha, or Kerala' },
          { value: 'no_pt_state', label: 'Delhi, Uttar Pradesh, Rajasthan, Haryana, Himachal Pradesh, or Punjab' },
          { value: 'north_east', label: 'Assam, Meghalaya, Manipur, or Tripura' },
          { value: 'other', label: 'Another state or not sure' },
        ],
        earlyExit: (answer) => {
          if (answer === 'no_pt_state') {
            return {
              type: 'not_required',
              headline: 'Professional Tax does not exist in your state.',
              body: 'If your business is in Delhi, UP, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have zero Professional Tax obligations. You can stop here.',
            };
          }
          return null;
        },
      },
      {
        text: 'What is your role in this business?',
        options: [
          { value: 'employer', label: 'I am an employer with salaried staff' },
          { value: 'self_employed', label: 'I am self-employed, a freelancer, or a professional (doctor, CA, lawyer, consultant)' },
          { value: 'both', label: 'Both - I own the business and also draw a salary from it' },
        ],
        evaluator: (answer) => {
          if (answer === 'employer') {
            return {
              type: 'mandatory',
              headline: 'You need both PTRC and PTEC.',
              body: 'As an employer, you need PTRC (to deduct PT from employee salaries and remit it) and PTEC (for your own PT as a business owner).',
              ctaLabel: 'Get PT Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          if (answer === 'self_employed') {
            return {
              type: 'mandatory',
              headline: 'You need PTEC registration.',
              body: 'As a self-employed professional, you need PTEC and must pay your own PT.',
              ctaLabel: 'Get PT Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          if (answer === 'both') {
            return {
              type: 'mandatory',
              headline: 'You need both PTRC and PTEC.',
              body: 'You have obligations both as an employer (PTRC) and as a business owner (PTEC).',
              ctaLabel: 'Get PT Registration',
              ctaHref: '/checkout/payroll-management',
            };
          }
          return null;
        },
      },
      {
        text: 'What is the monthly income or salary we are talking about?',
        options: [
          { value: 'below_threshold', label: 'Below Rs. 7,500 per month' },
          { value: 'above_threshold', label: 'Above Rs. 7,500 per month' },
        ],
        evaluator: (answer) => {
          if (answer === 'below_threshold') {
            return {
              type: 'not_required',
              headline: 'You may be exempt from Professional Tax.',
              body: 'Most states exempt incomes below Rs. 7,500 per month from Professional Tax. Check your specific state rules.',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'not_required',
      headline: 'Professional Tax likely does not apply to you',
      body: 'Professional Tax is a state-level tax that only exists in specific states. If you are operating in Delhi, UP, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have no Professional Tax obligation at all.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'FIRST, THE IMPORTANT THING TO KNOW',
      body: 'Professional Tax is a state-level tax - it is not collected by the central government. About half the states in India levy it; the other half do not. If your business is in Delhi, Uttar Pradesh, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have zero Professional Tax obligations. Stop here.\n\nFor everyone else, it is governed by the relevant state\'s Professional Tax Act, under the authority granted by Article 276 of the Constitution. The maximum any state can charge is Rs. 2,500 per year per person.',
      note: 'Source: Article 276, Constitution of India; State Professional Tax Acts',
    },
    {
      number: '02',
      heading: 'STATES WHERE PROFESSIONAL TAX APPLIES',
      body: 'Here is where it applies and roughly how much.',
      bullets: [
        'Maharashtra: Up to Rs. 2,500 per year',
        'Karnataka: Up to Rs. 2,496 per year',
        'West Bengal: Up to Rs. 2,500 per year',
        'Tamil Nadu: Up to Rs. 2,400 per year',
        'Andhra Pradesh and Telangana: Up to Rs. 2,500 per year',
        'Madhya Pradesh: Up to Rs. 2,100 per year',
        'Odisha: Up to Rs. 2,500 per year',
        'Kerala: Up to Rs. 2,400 per year',
        'Gujarat: Up to Rs. 2,500 per year',
        'Assam, Meghalaya, Manipur, Tripura, Jharkhand, Sikkim: PT applies with varying slabs',
      ],
      note: "Exact slabs within each state vary by income bracket. Check your state's PT schedule for the current year.",
    },
    {
      number: '03',
      heading: 'IF YOU HAVE EMPLOYEES: YOU NEED TWO REGISTRATIONS',
      body: 'If you are a business owner in a PT state with salaried staff, you typically need two separate registrations - not one.',
      bullets: [
        'PTEC (Professional Tax Enrollment Certificate): This is for you - the business owner, proprietor, partner, or director. You pay PT on yourself.',
        "PTRC (Professional Tax Registration Certificate): This is what lets you deduct PT from your employees' salaries and deposit it with the state government. Without this, you are not authorised to make those deductions or remittances.",
        'Filing frequency (monthly, quarterly, or annual) and due dates vary by state - check the rules for your specific state.',
      ],
    },
    {
      number: '04',
      heading: 'WHO DOES NOT HAVE TO PAY',
      body: '',
      bullets: [
        'Individuals earning below the state minimum (typically Rs. 7,500 to Rs. 10,000 per month, depending on the state)',
        'Women earning below Rs. 10,000 per month in Maharashtra',
        'Parents or guardians of children with physical or mental disabilities in some states',
        'Members of the armed forces',
        'Persons above 65 years of age in certain states',
        'Everyone in states where PT is simply not levied (Delhi, UP, Haryana, Rajasthan, Punjab, HP)',
      ],
    },
    {
      number: '05',
      heading: 'WHAT NON-COMPLIANCE LOOKS LIKE',
      body: '',
      bullets: [
        'Late registration penalty: Typically Rs. 5 per day in most states',
        'Interest on late payment: 1.25% per month in Maharashtra; similar rates in other states',
        'Penalty for not deducting or not remitting: Up to 10% of unpaid amount plus arrears',
        'Assessment and prosecution by the state PT authority',
      ],
    },
    {
      number: '06',
      heading: 'THE SHORT ANSWER BASED ON YOUR SITUATION',
      body: '',
      bullets: [
        'In a PT state + have salaried employees = Get both PTRC and PTEC',
        'In a PT state + self-employed or proprietor = Get PTEC',
        'In Delhi, UP, Haryana, Rajasthan, Punjab, or HP = Not applicable, move on',
        'Operating in multiple states = Register separately in each state where you have employees or a business presence',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is the Professional Tax I pay deductible anywhere?',
      a: 'Yes. Professional Tax paid on salary income is deductible under Section 16(iii) of the Income Tax Act. For self-employed individuals, it is deductible as a business expense. It partially offsets the cost.',
    },
    {
      q: 'I work remotely for a Bangalore company but live in Delhi. Does PT apply to me?',
      a: "Professional Tax typically follows the employer's registered place of business, not your home address. If your employer is in Karnataka, Karnataka's PT rules apply - which means they should be deducting PT from your salary regardless of where you live.",
    },
    {
      q: 'Does PT apply to a Pvt Ltd company?',
      a: 'Yes. The company must get PTEC and pay PT for each director who draws a salary. It must also get PTRC and deduct PT from all salaried employees. These are two separate obligations and both apply.',
    },
  ],
};
