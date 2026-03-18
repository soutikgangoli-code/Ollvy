// lib/learn/pages/how-to-register-gst.ts
import { LearnPageConfig } from '../pages';

export const howToRegisterGst: LearnPageConfig = {
  slug: 'how-to-register-gst-india',
  title: 'How to Register for GST in India',
  seoTitle: 'How to Register for GST in India (2025) - Step-by-Step Guide | Ollvy',
  seoDescription: 'Complete guide to GST registration in India. Check if it\'s mandatory for you, required documents by business type, exact process steps, fees, and timeline. Free eligibility checker.',
  canonicalUrl: 'https://ollvy.com/learn/how-to-register-gst-india',
  lastReviewed: 'March 2025',
  category: 'GST',
  ctaServiceSlug: 'gst-registration',
  relatedServiceSlugs: ['gst-monthly-filing', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['gst-filing-penalty', 'gst-due-dates', 'pvt-ltd-vs-llp'],

  tool: {
    type: 'eligibility',
    title: 'Is GST registration mandatory for your business?',
    questions: [
      {
        text: 'What type of business are you?',
        options: [
          { value: 'pvt_ltd', label: 'Private Limited Company' },
          { value: 'llp', label: 'LLP or Partnership' },
          { value: 'proprietor', label: 'Sole Proprietor or Freelancer' },
          { value: 'ecommerce', label: 'E-commerce seller (Amazon, Flipkart, etc.)' },
        ],
        evaluator: (answer) => {
          if (answer === 'ecommerce') return {
            type: 'eligible',
            headline: 'GST registration is mandatory for you.',
            body: 'E-commerce sellers must register for GST regardless of annual turnover. Amazon, Flipkart, and all major platforms require a valid GSTIN before you can activate your seller account.',
            ctaLabel: 'Get GST Registration - ₹8,999',
          };
          return null;
        },
      },
      {
        text: 'What is your approximate annual turnover?',
        options: [
          { value: 'below_20l', label: 'Below ₹20 lakh' },
          { value: '20l_40l', label: '₹20-40 lakh' },
          { value: 'above_40l', label: 'Above ₹40 lakh' },
          { value: 'not_started', label: 'Not started yet / below ₹5 lakh' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'above_40l') return {
            type: 'eligible',
            headline: 'GST registration is mandatory for you.',
            body: 'Businesses with annual turnover above ₹40 lakh (₹20L for service businesses) must register for GST under Section 22 of the CGST Act. Non-registration after crossing the threshold is an offence with 100% tax due as penalty.',
            ctaLabel: 'Get GST Registration - ₹8,999',
          };
          if (answer === 'below_20l' && allAnswers[0] === 'proprietor') return {
            type: 'ineligible',
            headline: 'GST registration is not mandatory at this turnover.',
            body: 'Sole proprietors below ₹20L turnover (₹10L in North-East states) are exempt. You can register voluntarily if you want to issue GST invoices to B2B clients or claim input tax credit. Voluntary registration uses the same process.',
          };
          return null;
        },
      },
      {
        text: 'Do you supply goods or services across state borders?',
        options: [
          { value: 'yes', label: 'Yes - I sell to customers in other states' },
          { value: 'no', label: 'No - all sales are within my state' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes') return {
            type: 'eligible',
            headline: 'GST registration is mandatory for you.',
            body: 'Interstate supply triggers mandatory GST registration regardless of annual turnover. Even if your total sales are ₹5 lakh, a single interstate sale requires registration.',
            ctaLabel: 'Get GST Registration - ₹8,999',
          };
          return null;
        },
      },
      {
        text: 'Do you want to claim input tax credit on purchases?',
        options: [
          { value: 'yes', label: 'Yes - I buy goods/services for my business' },
          { value: 'no', label: 'Not a priority right now' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes') return {
            type: 'eligible',
            headline: 'Voluntary GST registration makes sense for you.',
            body: 'To claim input tax credit (reduce your tax by the GST you paid on purchases), you must be a registered taxpayer. If your supplier is GST-registered and you\'re not, you lose that credit. Voluntary registration uses the same process and the same ₹8,999 price.',
            ctaLabel: 'Get Voluntary GST Registration - ₹8,999',
          };
          return {
            type: 'conditional',
            headline: 'Registration is optional at your current stage.',
            body: 'You\'re below the mandatory threshold and don\'t have immediate interstate sales or ITC needs. Register when turnover approaches ₹40L, or when you start selling B2B to GST-registered buyers who will want a tax invoice.',
          };
        },
      },
    ],
  },

  sections: [
    {
      heading: 'Is GST registration mandatory?',
      body: `The threshold depends on your business type and what you sell.

**For goods businesses**: Mandatory above ₹40 lakh annual turnover. If you're in Manipur, Mizoram, Tripura, Meghalaya, Assam, Nagaland, Arunachal Pradesh, or Sikkim, the threshold is ₹20 lakh.

**For service businesses**: Mandatory above ₹20 lakh annual turnover. Same North-East exception applies.

**Regardless of turnover - mandatory in all cases**:
- Any interstate supply of goods or services
- E-commerce sellers (Amazon, Flipkart, Meesho, etc.)
- Casual taxable persons (occasional supplies)
- Non-resident taxable persons
- Anyone required to deduct TDS under GST
- Anyone supplying through an e-commerce operator

**Voluntary registration**: If you're below the threshold but want to issue GST invoices or claim input tax credit, you can register voluntarily. Same process, same fee.`,
      table: [
        { col1: 'Business Type', col2: 'Mandatory Threshold', col3: 'Exception' },
        { col1: 'Goods - general states', col2: '₹40 lakh/year', col3: '-' },
        { col1: 'Services - general states', col2: '₹20 lakh/year', col3: '-' },
        { col1: 'Any - North-East states', col2: '₹10 lakh/year', col3: '-' },
        { col1: 'E-commerce seller', col2: 'No threshold - mandatory', col3: '-' },
        { col1: 'Interstate supply', col2: 'No threshold - mandatory', col3: '-' },
      ],
      note: 'Source: Section 22, CGST Act 2017. Thresholds as amended by Notification 10/2019-CT.',
    },
    {
      heading: 'What documents do you need?',
      body: 'Required documents depend on your business type. Use the tabs below.',
      componentSlot: 'document-checklist',
      componentProps: { serviceSlug: 'gst-registration' },
    },
    {
      heading: 'The registration process - step by step',
      body: 'Your CA handles all of this. If you\'re filing yourself, this is what happens on the GSTN portal.',
      componentSlot: 'process-stepper',
      componentProps: {
        steps: [
          {
            step: 1, title: 'Answer 5 questions - personalised checklist generated', timeline: 'Day 0',
            body: 'Business type, state, turnover estimate, supply type, and whether you need voluntary registration. A CA is assigned within 4 hours and generates your specific document list - not the generic 20-item government list.',
            visual: 'checklist', milestone: 'CA assigned, document checklist sent',
          },
          {
            step: 2, title: 'Upload documents', timeline: 'Day 0-1',
            body: 'PAN, Aadhaar, address proof, and bank statement. Uploaded through the app. CA verifies every document before filing - blurry scans and address mismatches are caught here, not after an officer query.',
            visual: 'upload', milestone: 'Documents verified',
          },
          {
            step: 3, title: 'Application filed - ARN in 24 hours', timeline: 'Day 1-2',
            body: 'CA files GST REG-01 on the GSTN portal. Application Reference Number generated immediately. Shared in your app the same day. You can verify the status yourself at gstn.gov.in → Search Taxpayer → Search by ARN.',
            visual: 'form', milestone: 'ARN generated and sent to your app',
          },
          {
            step: 4, title: 'Officer query - if raised, CA responds', timeline: 'Day 3-5 (if applicable)',
            body: 'Officers occasionally request document clarification within 7 days. Your CA responds within 24 hours. This is in scope - not an extra charge.',
            visual: 'form',
          },
          {
            step: 5, title: 'GSTIN issued', timeline: 'Day 5-7',
            body: 'GSTN issues your GSTIN. Permanent - no renewal. Compliance calendar populated automatically with GSTR-1 and GSTR-3B due dates.',
            visual: 'stamp', isCompletion: true, milestone: 'GSTIN active on GSTN portal',
          },
        ],
      },
    },
    {
      heading: 'How long does it take?',
      body: `**Standard timeline**: 5-7 working days if documents are clean.

**What delays it**:
- Aadhaar mobile number not linked or changed: adds 2-3 days (requires UIDAI visit, must be done by the applicant)
- Business address doesn't match utility bill exactly: officer raises a query, adds 3-5 days
- GSTN portal downtime: happens occasionally, especially near filing deadlines

**If you file yourself**: The GST REG-01 form has 23 fields across 5 tabs. Budget 2-3 hours minimum if you're doing it for the first time. Officers raise queries on self-filed applications more frequently than CA-filed ones - document formatting is a common issue.`,
    },
    {
      heading: 'What does it cost?',
      body: `**Government fee**: ₹0. There is no fee to apply for GST registration.

**If using a CA**: Market rates in India range from ₹1,500 (budget, no tracking) to ₹5,000 (full-service). Ollvy charges ₹8,999 - which includes CA assignment, document pre-verification, ARN tracking, officer query handling, and compliance calendar setup. The price difference is the difference between filing and being done.

**Penalty for not registering when mandatory**: 100% of tax due, minimum ₹10,000. If your annual turnover is ₹50 lakh and you haven't registered, that's ₹50,000+ penalty on top of all unpaid GST.`,
      note: 'Penalty reference: Section 122, CGST Act 2017.',
    },
    {
      heading: 'What are your obligations after getting a GSTIN?',
      body: `Once registered, you must file regularly or face penalties.

**Monthly (for most businesses)**:
- GSTR-1 (outward supplies): Due by 11th of every month
- GSTR-3B (net tax payment): Due by 20th of every month

**Quarterly (if annual turnover below ₹1.5 crore)**:
- GSTR-1: Due by 13th of the month after quarter end
- GSTR-3B: Due by 22nd or 24th depending on state

**Annually**:
- GSTR-9 (annual return): Due December 31 for the previous financial year
- GSTR-9C (reconciliation, if turnover above ₹5Cr): Due with GSTR-9

**Late filing penalties**: ₹100/day (₹50 CGST + ₹50 SGST) plus 18% per annum interest on outstanding tax from day 21.

If this sounds like a lot to track, it is. Ollvy's GST Monthly Filing retainer handles all of this for ₹2,999/month - CA assigned, all three filings covered, Proof-of-Work Report every cycle.`,
    },
  ],
};
