// lib/guides/pages/gst-asmt-14-best-judgment.ts
import { LearnPageConfig } from '../pages';

export const gstAsmt14BestJudgment: LearnPageConfig = {
  slug: 'gst-asmt-14-best-judgment',
  title: 'GST ASMT-14 Notice: Best Judgment Assessment',
  seoTitle: 'GST ASMT-14 Notice: Best Judgment Assessment Explained (2026) | Ollvy',
  seoDescription: 'A GST ASMT-14 is a best judgment assessment issued when ASMT-10 was not replied to. Filing all pending returns within 30 days withdraws the assessment under Section 62(2).',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-asmt-14-best-judgment',
  lastReviewed: 'April 2026',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-monthly',
  ctaSecondarySlug: 'gst-registration',
  relatedServiceSlugs: ['gst-monthly', 'gst-registration'],
  relatedLearnSlugs: ['gst-asmt-10-notice', 'gst-drc-01-notice'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing', 'gst-demand-notice'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'urgent',
  deadline: '30 days to challenge via appeal',
  deadlineNote: 'ASMT-14 is the outcome of not replying to ASMT-10. The window to prevent this has passed - but you can still challenge it.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS ASMT-14 AND HOW DID YOU GET HERE',
      body: "If you are reading this, it is likely because an earlier ASMT-10 scrutiny notice was either not replied to or the reply was not accepted by the officer.\n\nASMT-14 is issued under Section 62 of the CGST Act (Assessment of Non-Filers). It is the GST officer's best judgment assessment, meaning they have determined your GST liability using whatever information they had, without your input. The final assessment order follows in ASMT-15.\n\nIf you file all your pending returns within 30 days of receiving ASMT-14, the assessment order can be withdrawn. This is a one-time relief built into the law.",
      note: 'Source: Section 62, CGST Act 2017. Rule 100, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'YOUR OPTIONS NOW',
      body: '',
      bullets: [
        'Option 1 - File pending returns within 30 days: If ASMT-14 was triggered by non-filing of returns, file all pending GSTR-3B returns within 30 days of the assessment order. Under Section 62(2), the assessment order is deemed to have been withdrawn upon filing of valid returns. Pay all tax, interest (18% p.a. on late tax), and late fees (GSTR-3B late fee: Rs. 50 per day for returns with tax liability; Rs. 20 per day for nil returns - capped at Rs. 10,000 per return).',
        'Option 2 - File an appeal: If you believe the best judgment assessment amount is significantly overstated (which is common - officers make conservative assumptions when they have no data), you can appeal to the Appellate Authority under Section 107 within 3 months of the assessment order. Pre-deposit of 10% of disputed tax is required.',
        'Option 3 - Do both: File pending returns (to trigger Section 62(2) withdrawal) and also file an appeal against the assessment for the period where returns cannot be filed (e.g., if there was a penalty imposed beyond just tax).',
      ],
    },
    {
      number: '03',
      heading: 'CALCULATING WHAT YOU OWE TO FILE RETURNS AND CLOSE THIS',
      body: 'To file pending returns and trigger Section 62(2) withdrawal, you need to pay:\n\nPending tax: the actual GST liability for each unfiled period based on your outward supplies and eligible ITC.\n\nInterest under Section 50: 18 percent per annum from the original due date of each return to the date of actual payment. This is calculated separately for each month.\n\nLate fees: for GSTR-3B, the late fee is Rs. 50 per day for returns with a tax liability (Rs. 25 CGST plus Rs. 25 SGST), capped at Rs. 10,000 per return. For nil returns, it is Rs. 20 per day, capped at Rs. 500.\n\nGet a CA to calculate the exact amount before filing so there are no surprises.',
    },
    {
      number: '04',
      heading: 'WHY BEST JUDGMENT ASSESSMENTS ARE ALMOST ALWAYS OVERSTATED',
      body: 'When an officer does a best judgment assessment without your data, they use the most conservative (for them) assumptions available:',
      bullets: [
        'Turnover is estimated based on bank credits, e-way bill data, third-party information - without the benefit of your reconciliation',
        'No Input Tax Credit is allowed in a best judgment assessment - your entire tax liability is computed on a gross basis',
        'Tax rates applied may be the higher applicable rate for your industry',
        'This means the ASMT-14 amount is almost always much higher than your actual liability',
      ],
      note: 'This is exactly why filing pending returns (even late) within 30 days is often the most effective path. The Section 62(2) withdrawal resets the position to your actual filed numbers rather than the officer\'s estimates.',
    },
  ],

  faqs: [
    {
      q: 'I received ASMT-14 but I had actually replied to ASMT-10. What happened?',
      a: "This can happen if your reply was not considered satisfactory, if it was filed after the deadline, or (rarely) if there was a system issue. Check your GST portal for the ASMT-11 (your reply) and ASMT-12 (officer's response to your reply). If the officer issued ASMT-14 without acknowledging your reply, this is grounds to challenge the ASMT-14 in appeal.",
    },
    {
      q: 'The ASMT-14 shows Rs. 22 lakh as my GST liability. My actual liability should be around Rs. 3 lakh. Should I file returns or appeal?',
      a: 'File returns first (within 30 days) to trigger the Section 62(2) withdrawal. This brings the dispute down to your actual liability. If there are still disputes after filing (interest, penalty, or specific disallowances), deal with those through the officer or appeal. The Section 62(2) route is almost always cheaper and faster than a full appeal.',
    },
    {
      q: 'The 30-day window has passed. What are my options now?',
      a: 'You can still file the pending returns but the Section 62(2) automatic withdrawal no longer applies. You must appeal the ASMT-14 order to the Appellate Authority within 3 months of the assessment order. Pay 10 percent of the disputed tax as pre-deposit. File the pending returns simultaneously to show compliance intent.',
    },
  ],

  sources: [
    { name: 'CGST Act, 2017 (Section 62)', url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html', description: 'Best judgment assessment of non-filers and withdrawal provision under Section 62(2)' },
    { name: 'CGST Rules, 2017 (Rule 100)', url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf', description: 'Procedure for best judgment assessment under Section 62' },
  ],
};
