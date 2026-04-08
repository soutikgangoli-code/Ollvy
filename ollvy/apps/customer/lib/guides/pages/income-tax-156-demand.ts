// lib/guides/pages/income-tax-156-demand.ts
import { LearnPageConfig } from '../pages';

export const incomeTax156Demand: LearnPageConfig = {
  slug: 'income-tax-156-demand',
  title: 'Income Tax Section 156 Notice of Demand: Tax Has Been Assessed and is Now Due',
  seoTitle: 'Section 156 Demand Notice: Pay, Appeal, or Rectify (2025) | Ollvy',
  seoDescription: 'A Section 156 notice is the formal demand for tax determined in an assessment order. Pay within 30 days, or interest at 1 percent per month starts. Appeal requires 20 percent pre-deposit for stay.',
  canonicalUrl: 'https://www.ollvy.com/guides/income-tax-156-demand',
  lastReviewed: 'March 2025',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'business-itr',
  relatedServiceSlugs: ['itr-notice-response', 'itr-rectification'],
  relatedLearnSlugs: ['income-tax-143-1-intimation', 'income-tax-143-2-scrutiny', 'income-tax-245-refund-adjustment'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },
  severity: 'serious',
  deadline: '30 days from date of notice to pay or respond',
  deadlineNote: 'Interest at 1% per month under Section 220(2) starts the moment you miss the 30-day window.',

  sections: [
    {
      number: '01',
      heading: 'WHAT THIS NOTICE IS TELLING YOU',
      body: 'A Section 156 notice is the formal demand that follows an assessment order. It is not the assessment itself. It is the instruction to pay the tax that was determined in an earlier order (typically a 143(1) intimation, 143(3) assessment order, or a reassessment order).\n\nThink of it this way: the assessment order is the court judgment. The Section 156 notice is the execution notice asking you to pay the amount in the judgment.',
      note: 'Source: Section 156, Income Tax Act, 1961.',
    },
    {
      number: '02',
      heading: 'YOUR OPTIONS WHEN YOU RECEIVE A 156 NOTICE',
      body: '',
      bullets: [
        'Pay the demand within 30 days: If you agree the assessment is correct, pay via Challan 280 (income tax payment) and map the payment to the specific demand on the income tax portal. Respond to the outstanding demand on the portal with the challan details.',
        'Request an instalment arrangement: For large demands, you can request the assessing officer to grant payment in instalments under Section 220(3). This is discretionary. A formal written request with reason and proposed schedule is required.',
        'File an appeal and apply for stay: If you dispute the underlying assessment that created this demand, file an appeal under Section 246A within 30 days of the assessment order (not the 156 notice). Simultaneously, apply to the Appellate Authority for a stay of demand. With a stay, you do not need to pay the demand pending appeal resolution. Pre-deposit of 20% of disputed demand is typically required for a stay.',
        'Apply for rectification under Section 154: If the 156 demand is based on an arithmetic error or incorrect processing in the assessment, file a rectification request to correct it before paying.',
      ],
      note: 'After 30 days without payment, Section 220(2) interest at 1% per month kicks in. If recovery proceedings are initiated (Section 222-226), the department can attach bank accounts, property, and deduct from salaries.',
    },
    {
      number: '03',
      heading: 'WHEN PAYING IS NOT YOUR BEST FIRST MOVE',
      body: 'Do not pay automatically without reviewing the underlying assessment order.',
      bullets: [
        'Verify the original assessment order that created this demand. Is it a 143(1) intimation, 143(3) assessment order, or something else?',
        'Is the demand figure correct? Check for arithmetic errors in the assessment order.',
        'Did you already pay this demand and it was not mapped correctly? Check your payment records.',
        'Is the demand disputable on merit? Did the officer disallow a legitimate deduction? Did they add income that should not have been added? These are grounds for appeal.',
        'Is the assessment order time-barred? Were the proper procedures followed?',
      ],
    },
  ],

  faqs: [
    {
      q: 'I received a Section 156 notice for a demand from 5 years ago that I thought was resolved. What do I do?',
      a: 'This sometimes happens when old demands are erroneously reactivated. First, check your payment records - if you paid, find the challan. Then check the income tax portal for the demand history. If the demand was previously paid or written off, raise a rectification request and grievance simultaneously. Do not pay again without investigation.',
    },
    {
      q: 'Can the department take any action before the 30-day window expires?',
      a: 'Generally no. The 30 days in Section 156 is a mandatory notice period before recovery action can begin. However, if the officer has reason to believe you are about to transfer assets to evade payment, a provisional attachment under Section 281B can be made before the 30 days.',
    },
    {
      q: 'I want to pay the demand in instalments. Is that possible?',
      a: 'Yes, under Section 220(3) you can request instalment payment. Write to the assessing officer with a proposed schedule and reasons why you cannot pay in one instalment. This is discretionary and typically granted for large demands with genuine financial constraints.',
    },
  ],

  sources: [
    { name: 'Income Tax Act, 1961 (Section 156)', url: 'https://incometaxindia.gov.in', description: 'Notice of demand provision' },
    { name: 'Income Tax Act, 1961 (Section 220)', url: 'https://incometaxindia.gov.in', description: 'Interest and instalment payment provisions' },
  ],
};
