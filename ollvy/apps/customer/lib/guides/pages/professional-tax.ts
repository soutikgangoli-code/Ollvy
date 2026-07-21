import { LearnPageConfig } from '../pages'

export const professionalTax: LearnPageConfig = {
  slug: 'do-i-need-professional-tax-registration',
  title: 'Do I Need Professional Tax Registration?',
  seoTitle: 'Professional Tax Registration in India 2026: Do You Need It? | Ollvy',
  seoDescription:
    'Find out if Professional Tax applies to your business or profession in India. State-wise thresholds, who must register, and employer vs self-employed obligations.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-professional-tax-registration',
  lastReviewed: 'April 2026',
  category: 'Tax',
  ctaServiceSlug: 'payroll-management',
  relatedServiceSlugs: ['payroll-management'],
  relatedLearnSlugs: ['when-does-pf-registration-become-mandatory', 'when-does-esi-registration-become-mandatory'],

  tool: {
    type: 'eligibility',
    title: 'Does Professional Tax Apply to You?',
    questions: [
      {
        text: 'Which state is your business based in?',
        options: [
          { value: 'pt_state', label: 'Maharashtra, Karnataka, West Bengal, Tamil Nadu, Andhra Pradesh, Telangana, MP, Odisha, Kerala, or Gujarat' },
          { value: 'non_pt_state', label: 'Delhi, UP, Rajasthan, Haryana, Himachal Pradesh, or Punjab' },
          { value: 'northeast', label: 'Assam, Meghalaya, Manipur, or Tripura' },
          { value: 'other', label: 'Another state or not sure' },
        ],
        exitOn: {
          non_pt_state: {
            type: 'not_required',
            headline: 'Professional Tax does not apply to you.',
            body: 'Delhi, UP, Rajasthan, Haryana, Himachal Pradesh, and Punjab do not levy Professional Tax. You have no PT obligation.',
          },
        },
      },
      {
        text: 'What is the gross monthly income or salary we are talking about?',
        options: [
          { value: 'below_7500', label: 'Below Rs. 7,500 per month' },
          { value: 'above_7500', label: 'Above Rs. 7,500 per month' },
        ],
        // Q0 answer non_pt_state already exits above, so by this point the
        // original allAnswers[0] !== 'non_pt_state' guard is always true.
        exitOn: {
          below_7500: {
            type: 'not_required',
            headline: 'Below the taxable threshold.',
            body: 'Most PT states set the minimum taxable income at Rs. 7,500 to Rs. 10,000 per month. Below this, no PT is due. Check your specific state\'s slab schedule to confirm.',
          },
        },
      },
      {
        text: 'What is your role in this business?',
        options: [
          { value: 'employer', label: 'I am an employer with salaried staff' },
          { value: 'self_employed', label: 'I am self-employed, a freelancer, or a professional' },
          { value: 'both', label: 'Both - I own the business and also draw a salary' },
        ],
      },
    ],
    resultRules: [
      {
        if: [
          { q: 0, anyOf: ['pt_state', 'northeast', 'other'] },
          { q: 2, anyOf: ['employer'] },
        ],
        result: {
          type: 'mandatory',
          headline: 'You need both PTRC and PTEC.',
          body: 'As an employer in a PT state, you need PTEC (for yourself) and PTRC (to deduct PT from employees and remit it to the state). These are two separate registrations.',
        },
      },
      {
        if: [
          { q: 0, anyOf: ['pt_state', 'northeast', 'other'] },
          { q: 2, anyOf: ['self_employed'] },
        ],
        result: {
          type: 'mandatory',
          headline: 'You need PTEC.',
          body: 'Self-employed professionals and business owners in PT states need PTEC (Professional Tax Enrollment Certificate) to pay PT on themselves.',
        },
      },
      {
        if: [
          { q: 0, anyOf: ['pt_state', 'northeast', 'other'] },
          { q: 2, anyOf: ['both'] },
        ],
        result: {
          type: 'mandatory',
          headline: 'You need both PTRC and PTEC.',
          body: 'PTEC for yourself and PTRC to handle employee deductions. Both apply when you are both a business owner and an employer.',
        },
      },
    ],
    defaultResult: {
      type: 'not_required',
      headline: 'Professional Tax likely does not apply to you.',
      body: 'Professional Tax is a state-level tax that only exists in specific states. If you operate in Delhi, UP, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have no PT obligation.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'FIRST: DOES YOUR STATE EVEN HAVE PROFESSIONAL TAX?',
      body: 'Professional Tax is a state-level tax - the central government does not collect it. About half the states in India levy it; the other half do not. If your business is in Delhi, Uttar Pradesh, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have zero Professional Tax obligations.',
      note: 'Source: Article 276, Constitution of India. The maximum any state can charge is Rs. 2,500 per year per person.',
    },
    {
      number: '02',
      heading: 'STATES WHERE PROFESSIONAL TAX APPLIES',
      body: '',
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
      table: {
        caption: 'Professional Tax by State - Current Rates and Thresholds (2026)',
        headers: ['State', 'Max Annual PT', 'Approx. Monthly Income Threshold', 'Due Date'],
        rows: [
          ['Maharashtra', 'Rs. 2,500', 'Rs. 7,500/month', 'Monthly by end of month'],
          ['Karnataka', 'Rs. 2,496', 'Rs. 10,000/month', 'Monthly by 20th'],
          ['West Bengal', 'Rs. 2,500', 'Rs. 10,000/month', 'Monthly by 21st'],
          ['Tamil Nadu', 'Rs. 2,400', 'Rs. 3,500/month', 'Half-yearly'],
          ['Andhra Pradesh', 'Rs. 2,500', 'Rs. 15,001/month', 'Monthly by 10th'],
          ['Telangana', 'Rs. 2,500', 'Rs. 15,001/month', 'Monthly by 10th'],
          ['Gujarat', 'Rs. 2,500', 'Rs. 6,000/month', 'Monthly by 15th'],
          ['Odisha', 'Rs. 2,500', 'Rs. 5,000/month', 'Quarterly'],
          ['Kerala', 'Rs. 2,400', 'Rs. 12,000/month', 'Half-yearly (April, October)'],
          ['Madhya Pradesh', 'Rs. 2,100', 'Rs. 6,000/month', 'Monthly by 10th'],
          ['Assam', 'Rs. 2,500', 'Rs. 10,000/month', 'Quarterly'],
          ['Jharkhand', 'Rs. 2,500', 'Rs. 5,000/month', 'Monthly'],
          ['Delhi, UP, Rajasthan, Haryana, Punjab, HP', 'Not applicable', 'Not applicable', 'N/A - no PT in these states'],
        ],
      },
      note: 'Exact slabs within each state vary by income bracket. Check your state\'s current PT schedule for the precise amounts.',
    },
    {
      number: '03',
      heading: 'IF YOU HAVE EMPLOYEES: TWO REGISTRATIONS, NOT ONE',
      body: 'In a PT state with salaried staff, you typically need two separate registrations.',
      bullets: [
        'PTEC (Professional Tax Enrollment Certificate): For you - the business owner, proprietor, partner, or director. You pay PT on yourself.',
        'PTRC (Professional Tax Registration Certificate): Authorises you to deduct PT from your employees\' salaries and deposit it with the state government. Without this, you are not authorised to make those deductions or remittances.',
        'Filing frequency (monthly, quarterly, or annual) and due dates vary by state.',
      ],
    },
    {
      number: '04',
      heading: 'WHO DOES NOT HAVE TO PAY',
      body: '',
      bullets: [
        'Individuals earning below the state minimum (typically Rs. 7,500 to Rs. 10,000 per month, depending on state)',
        'Women earning below Rs. 10,000 per month in Maharashtra',
        'Parents or guardians of children with physical or mental disabilities in some states',
        'Members of the armed forces',
        'Persons above 65 years of age in certain states',
        'Everyone in states where PT is not levied (Delhi, UP, Haryana, Rajasthan, Punjab, HP)',
      ],
    },
    {
      number: '05',
      heading: 'WHAT NON-COMPLIANCE LOOKS LIKE',
      body: '',
      bullets: [
        'Late registration penalty: Typically Rs. 5 per day in most states',
        'Interest on late payment: 1.25% per month in Maharashtra; similar in other states',
        'Penalty for not deducting or remitting: Up to 10% of unpaid amount plus arrears',
        'Assessment and prosecution by the state PT authority',
      ],
    },
    {
      number: '06',
      heading: 'THE SHORT ANSWER BASED ON YOUR SITUATION',
      body: '',
      bullets: [
        'In a PT state + have salaried employees = Get both PTRC and PTEC',
        'In a PT state + self-employed or proprietor = Get PTEC only',
        'In Delhi, UP, Haryana, Rajasthan, Punjab, or HP = Not applicable',
        'Operating in multiple states = Register separately in each PT state where you have employees or a business presence',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is the Professional Tax I pay deductible anywhere?',
      a: 'Yes. Professional Tax paid on salary income is deductible under Section 16(iii) of the Income Tax Act. For self-employed individuals, it is deductible as a business expense.',
    },
    {
      q: 'I work remotely for a Bangalore company but live in Delhi. Does PT apply to me?',
      a: 'Professional Tax typically follows the employer\'s registered place of business. If your employer is in Karnataka, Karnataka\'s PT rules apply - they should be deducting PT from your salary regardless of where you live.',
    },
    {
      q: 'Does PT apply to a Pvt Ltd company?',
      a: 'Yes. The company must get PTEC and pay PT for each director who draws a salary. It must also get PTRC and deduct PT from all salaried employees. Both obligations apply separately.',
    },
  ],
}
