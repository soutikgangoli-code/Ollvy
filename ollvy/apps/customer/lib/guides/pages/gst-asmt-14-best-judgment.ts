// lib/guides/pages/gst-asmt-14-best-judgment.ts
import { LearnPageConfig } from '../pages';

export const gstAsmt14BestJudgment: LearnPageConfig = {
  slug: 'gst-asmt-14-best-judgment',
  title: 'GST ASMT-14 Notice: Best Judgment Assessment',
  seoTitle: 'GST ASMT-14 Notice: Best Judgment Assessment Explained (2025) | Ollvy',
  seoDescription: 'Received a GST ASMT-14 notice? This is a best judgment assessment - usually issued when ASMT-10 was not replied to. Understand what it means and how to challenge it.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-asmt-14-best-judgment',
  lastReviewed: 'March 2025',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-monthly-filing',
  ctaSecondarySlug: 'gst-registration',
  relatedServiceSlugs: ['gst-monthly-filing', 'gst-registration'],
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
      body: "If you are reading this, it is likely because an earlier ASMT-10 scrutiny notice was either not replied to or the reply was not accepted by the officer.\n\nASMT-14 is issued under Section 62 of the CGST Act (Assessment of Non-Filers). It is the GST officer's best judgment assessment - meaning they have determined your GST liability using whatever information they had, without your input. The final assessment order follows in ASMT-15.\n\nHere is the important part: if you file all your pending returns within 30 days of receiving ASMT-14, the assessment order can be withdrawn. This is a one-time relief built into the law.",
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
      heading: 'WHY BEST JUDGMENT ASSESSMENTS ARE ALMOST ALWAYS OVERSTATED',
      body: 'When an officer does a best judgment assessment without your data, they use the most conservative (for them) assumptions available:',
      bullets: [
        'Turnover is estimated based on bank credits, e-way bill data, third-party information - without the benefit of your reconciliation',
        'No Input Tax Credit is allowed in a best judgment assessment - your entire tax liability is computed on a gross basis',
        'Tax rates applied may be the higher applicable rate for your industry',
        'This means the ASMT-14 amount is almost always much higher than your actual liability',
      ],
      note: 'This is exactly why filing pending returns (even late) within 30 days is often the most effective path - the Section 62(2) withdrawal resets the position to your actual filed numbers rather than the officer\'s estimates.',
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
  ],
};
