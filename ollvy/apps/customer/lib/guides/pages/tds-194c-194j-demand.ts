// lib/guides/pages/tds-194c-194j-demand.ts
import { LearnPageConfig } from '../pages';

export const tds194c194jDemand: LearnPageConfig = {
  slug: 'tds-194c-194j-demand',
  title: 'TDS Demand Notice: Section 194C (Contractors) and 194J (Professional Fees)',
  seoTitle: 'Section 194C and 194J TDS Demand: Thresholds and Rates (2025) | Ollvy',
  seoDescription: '194C applies to contractor payments above Rs. 30,000 (1-2 percent). 194J applies to professional fees above Rs. 30,000 (10 percent or 2 percent for technical services). Non-deduction disallows 30 percent of the expense.',
  canonicalUrl: 'https://www.ollvy.com/guides/tds-194c-194j-demand',
  lastReviewed: 'March 2025',
  category: 'TDS Notice',
  ctaServiceSlug: 'tds-monthly-compliance',
  relatedServiceSlugs: ['tds-monthly-compliance', 'business-itr'],
  relatedLearnSlugs: ['tds-short-deduction-notice', 'tds-26q-27q-mismatch', 'income-tax-143-1-intimation'],
  relatedTools: {
    penaltyCalculators: ['tds-late-filing'],
    documentChecklists: ['business-itr'],
  },
  severity: 'serious',
  deadline: '30 days to respond',
  deadlineNote: 'Section 40(a)(ia) means that 30% of the expense where TDS was not deducted is disallowed in your income tax computation. This is a double hit - TDS demand plus higher income tax.',

  sections: [
    {
      number: '01',
      heading: 'WHY 194C AND 194J GENERATE SO MANY DEMANDS',
      body: 'Sections 194C and 194J are the two TDS provisions most frequently defaulted by SMEs because the payments they cover are the most common in everyday business: contractor/vendor fees and professional service fees. The thresholds are low, the applicable cases are broad, and many businesses are not aware of them.',
      note: 'Source: Sections 194C and 194J, Income Tax Act, 1961.',
    },
    {
      number: '02',
      heading: 'SECTION 194C: CONTRACTOR PAYMENTS',
      body: 'When does 194C apply?',
      bullets: [
        'Any payment to a contractor or sub-contractor for carrying out any work (including supply of labour for carrying out work)',
        'TDS rate: 1% if the contractor is an individual or HUF; 2% if the contractor is any other entity (company, firm, LLP)',
        'Threshold: Rs. 30,000 per single payment, OR Rs. 1 lakh aggregate to the same contractor in a financial year. If either threshold is crossed, TDS applies on all payments, not just the amount above the threshold.',
        'What counts as "work": Advertising, broadcasting, catering, manufacturing or supply of any product, civil work, transporting goods or passengers (if not covered by Goods Transport Agency provisions), toll collection - all these fall under 194C.',
        'What does NOT require TDS under 194C: Pure purchase of goods from a manufacturer where no specific work is performed, payments to employees (covered by Section 192), payments below threshold.',
      ],
    },
    {
      number: '03',
      heading: 'SECTION 194J: PROFESSIONAL AND TECHNICAL SERVICES',
      body: 'When does 194J apply?',
      bullets: [
        'Any payment by way of fees for professional services: medical, legal, engineering, architectural, accountancy, technical consultancy, interior decoration, advertising, any other notified profession',
        'Technical services: Any fees for rendering any managerial, technical, or consultancy services (including providing services of technical or other personnel)',
        'Royalty payments and non-compete fees',
        'TDS rate: 10% on professional and technical services, royalty, and non-compete fees. However, technical services (where no professional qualification is involved) attract a reduced rate of 2% under an amendment effective April 1, 2020.',
        'Threshold: Rs. 30,000 per year to the same person. Below this, no TDS.',
        'If the vendor provides you a GST invoice for "professional services" and the annual amount exceeds Rs. 30,000, you must deduct TDS before making payment.',
      ],
    },
    {
      number: '04',
      heading: 'HOW TO DETERMINE IF YOUR DEMAND IS CORRECT',
      body: 'Before paying the TDS demand, verify:',
      bullets: [
        'Were the payments actually above the threshold? Check if any single payment was above Rs. 30,000 or aggregate was above Rs. 1 lakh for 194C.',
        'Is the vendor exemption applicable? Transporters who own up to 10 goods carriages and furnish a declaration in Form 15I/15J are exempt from 194C TDS.',
        'Did the vendor furnish a nil/lower TDS certificate? Under Section 197, vendors with low income can obtain a certificate from their Assessing Officer for nil or lower TDS. If such a certificate was provided to you, the demand is incorrect.',
        'Is the rate correct? Verify whether the officer has applied the correct rate (1% vs 2% for 194C; 2% vs 10% for 194J based on nature of service).',
        'Was TDS eventually deducted and deposited, just late? If yes, the demand amount may be just interest, not principal.',
      ],
    },
  ],

  faqs: [
    {
      q: 'I paid a freelancer Rs. 25,000 for website design and Rs. 20,000 for content writing - total Rs. 45,000. Do I need to deduct TDS?',
      a: 'Yes. The aggregate payments to the same vendor during the financial year exceed Rs. 30,000, which triggers Section 194J. The applicable rate is 10%. You should deduct Rs. 4,500 (10% of Rs. 45,000) from the remaining payment.',
    },
    {
      q: 'My vendor insists I should not deduct TDS because they "already pay tax." How do I handle this?',
      a: "TDS is your statutory obligation. If the vendor has a nil TDS certificate from their Assessing Officer under Section 197, ask them to provide it. Without that, you must deduct. The vendor can claim the TDS as credit against their own tax liability.",
    },
    {
      q: 'Does TDS apply to one-time payments below the threshold?',
      a: 'For 194C, if a single payment exceeds Rs. 30,000, TDS applies even if it is a one-time payment. For 194J, the threshold is Rs. 30,000 per year to the same person. Track aggregate payments to each vendor through the year.',
    },
  ],

  sources: [
    { name: 'Income Tax Act, 1961 (Section 194C)', url: 'https://incometaxindia.gov.in', description: 'TDS on contractor payments' },
    { name: 'Income Tax Act, 1961 (Section 194J)', url: 'https://incometaxindia.gov.in', description: 'TDS on professional and technical fees' },
    { name: 'Income Tax Act, 1961 (Section 40(a)(ia))', url: 'https://incometaxindia.gov.in', description: 'Disallowance for non-deduction of TDS' },
  ],
};
