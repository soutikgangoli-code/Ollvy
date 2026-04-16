// lib/guides/pages/income-tax-245-refund-adjustment.ts
import { LearnPageConfig } from '../pages';

export const incomeTax245RefundAdjustment: LearnPageConfig = {
  slug: 'income-tax-245-refund-adjustment',
  title: 'Income Tax Section 245 Notice: Your Refund Has Been Adjusted',
  seoTitle: 'Section 245 Refund Adjustment: Object Within 30 Days (2026) | Ollvy',
  seoDescription: 'A Section 245 notice says your refund will be adjusted against an old demand. You have 30 days to object. Check if the demand was already paid or is under appeal.',
  canonicalUrl: 'https://www.ollvy.com/guides/income-tax-245-refund-adjustment',
  lastReviewed: 'April 2026',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'business-itr',
  ctaSecondarySlug: undefined,
  relatedServiceSlugs: ['itr-notice-response', 'itr-rectification'],
  relatedLearnSlugs: ['income-tax-143-1-intimation', 'income-tax-156-demand', 'income-tax-143-2-scrutiny'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },
  severity: 'serious',
  deadline: '30 days to object to the proposed adjustment',
  deadlineNote: 'If you do not respond within 30 days, the adjustment is made automatically. Your refund is used to pay the demand whether you agree or not.',

  sections: [
    {
      number: '01',
      heading: 'YOU WERE EXPECTING A REFUND. INSTEAD YOU GOT THIS NOTICE.',
      body: "Section 245 of the Income Tax Act allows the department to adjust (set off) your income tax refund against any outstanding tax demand from any prior year without going to court.\n\nBefore doing this, the law requires them to give you a notice under Section 245 and at least 30 days to respond. This is your window to either accept the adjustment (if the demand is correct) or object to it (if you dispute the demand or the demand has already been paid or appealed).",
      note: 'Source: Section 245, Income Tax Act, 1961.',
    },
    {
      number: '02',
      heading: 'THE MOST COMMON REASONS THIS HAPPENS',
      body: '',
      bullets: [
        'Old demand you forgot about: An outstanding demand from a prior assessment year that was never paid, appealed, or addressed. Demands can sit for years before the department triggers adjustment.',
        'Demand you thought was settled: You may have paid the demand but if the challan details were not correctly mapped to the demand in the system, it shows as outstanding.',
        'Demand you appealed: If you filed an appeal and the demand was not stayed, the department can still attempt adjustment. An appeal does not automatically stay a demand.',
        'Demand from 143(1) processing: You may have received a 143(1) intimation with a demand in a prior year, not responded to it, and the demand has accumulated with interest.',
        'Demand based on TDS mismatch: A prior year TDS mismatch demand that was never rectified.',
      ],
    },
    {
      number: '03',
      heading: 'WHAT TO DO IN THE NEXT 30 DAYS',
      body: 'Your first job is to identify the demand. The Section 245 notice will mention the assessment year and the demand amount being set off. Then:',
      bullets: [
        'Log in to the income tax portal and go to Pending Actions > Response to Outstanding Demand. You will see all demands against your PAN with details of the order that created them.',
        'Download the demand order (143(1) intimation, 143(3) assessment order, or whichever order created the demand) and review it.',
        'Determine if the demand is: (a) Correct and unpaid, in which case the adjustment is fair and you can agree, (b) Already paid but not mapped, in which case upload the challan proof and respond "Demand paid, challan details attached," (c) Being appealed, respond "Demand disputed, appeal filed, stay application submitted," (d) Wrong due to a TDS mismatch, arithmetic error, or legally incorrect demand, file a rectification under Section 154 and simultaneously respond to the 245 notice.',
        'File your response on the portal within 30 days. Even a response of "disagree" preserves your position and buys you time to resolve the underlying demand.',
      ],
      note: 'If you are in a time crunch and cannot resolve the underlying demand within 30 days, at minimum file your response stating that you dispute the demand and will provide documentation. This protects you from the automatic adjustment.',
    },
    {
      number: '04',
      heading: 'WHAT HAPPENS IF YOU DO NOT RESPOND',
      body: 'If you do not respond within 30 days of the Section 245 notice, the department will proceed with the adjustment. This means:',
      bullets: [
        'Your refund (fully or partially) will be used to pay off the demand',
        'You will receive an intimation confirming the adjustment',
        'After adjustment, if there is a remaining demand balance, it continues to stay outstanding and accumulate interest',
        'If the refund is not enough to cover the demand, the remainder stays as an outstanding demand',
        'You can still challenge the underlying demand after adjustment, but getting the money back is harder once it is gone',
      ],
    },
    {
      number: '05',
      heading: 'HOW TO STAY AHEAD OF SECTION 245 IN FUTURE',
      body: 'Most Section 245 surprises are avoidable.',
      bullets: [
        'Respond to every 143(1) intimation, even small demands: An addressed demand is a resolved one. An ignored demand compounds over years.',
        "Check your outstanding demands on the portal before filing each year's return: Go to Pending Actions > Response to Outstanding Demand and clean up any open items.",
        'Map every tax payment to its corresponding demand: When you pay tax through Challan 280, the challan must be against the correct assessment year and demand type. Unlinked challans do not reduce outstanding demands.',
        'After filing an appeal, request a stay of demand: An appeal does not automatically stay recovery. You need a separate stay application.',
      ],
    },
  ],

  faqs: [
    {
      q: 'My Section 245 notice says the demand is Rs. 40,000 but I paid this 2 years ago. How do I prove it?',
      a: 'Find the Challan 280 payment receipt (downloadable from the TIN-NSDL portal using your PAN, assessment year, and challan details). Log in to the income tax portal, go to Response to Outstanding Demand, and select "Demand paid, challan details are as follows." Enter the BSR code, serial number, date, and amount from the challan. The system will verify and close the demand.',
    },
    {
      q: 'I appealed the demand. Can the department still adjust my refund?',
      a: 'Yes, unless you have a stay order. An appeal does not automatically prevent recovery or adjustment. You need to specifically apply for a stay of the demand with the Appellate Authority. If a stay is granted, file it as part of your Section 245 response.',
    },
    {
      q: 'My refund is Rs. 80,000 but the demand is only Rs. 20,000. Will they adjust the full refund?',
      a: 'No. The adjustment is limited to the demand amount (Rs. 20,000 in your example). The remaining Rs. 60,000 should be refunded to you after the adjustment - assuming there are no other outstanding demands.',
    },
    {
      q: 'I have Section 245 notices across multiple assessment years. How do I prioritise?',
      a: 'Start with the one where the refund being adjusted is largest. But address all of them. Outstanding demands from multiple years can compound interest simultaneously.',
    },
    {
      q: 'The demand being adjusted is from 8 years ago. Is there any time limit?',
      a: 'There is no statutory time limit on adjusting old demands against new refunds. However, if the demand is from very old years and you believe it should have been written off or time-barred for recovery, raise this point in your response.',
    },
  ],

  sources: [
    { name: 'Income Tax Act, 1961 (Section 245)', url: 'https://incometaxindia.gov.in', description: 'Set off of refund against outstanding demand' },
    { name: 'Income Tax Portal', url: 'https://incometaxindia.gov.in', description: 'Outstanding demand response filing' },
  ],
};
