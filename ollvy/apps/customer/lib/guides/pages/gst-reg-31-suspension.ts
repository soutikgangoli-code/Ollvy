// lib/guides/pages/gst-reg-31-suspension.ts
import { LearnPageConfig } from '../pages';

export const gstReg31Suspension: LearnPageConfig = {
  slug: 'gst-reg-31-suspension',
  title: 'GST REG-31 Notice: Your GST Registration Has Been Suspended',
  seoTitle: 'GST REG-31 Registration Suspension Notice 2025: What to Do | Ollvy',
  seoDescription: 'Got a GST REG-31 suspension notice? Your GSTIN is suspended - clients cannot claim ITC from your invoices. Understand what triggered this and how to restore it.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-reg-31-suspension',
  lastReviewed: 'March 2025',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-revocation',
  ctaSecondarySlug: 'gst-monthly',
  relatedServiceSlugs: ['gst-revocation', 'gst-monthly'],
  relatedLearnSlugs: ['gst-reg-17-cancellation-notice', 'gst-asmt-10-notice'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'urgent',
  deadline: '30 days from suspension to respond',
  deadlineNote: 'Every day your GSTIN stays suspended, your clients are at risk of ITC denial on your invoices. This urgently affects your business relationships.',

  sections: [
    {
      number: '01',
      heading: 'SUSPENDED IS NOT CANCELLED - BUT IT IS STILL A CRISIS',
      body: "REG-31 is the intimation that your GST registration has been suspended, typically as a precursor to cancellation under REG-17. Suspension means your GSTIN is in an inactive state.\n\nThe critical business impact: during suspension, a GST portal search for your GSTIN will show \"Suspended\" status. Any client who pays you and claims ITC on your invoice during this period will face ITC rejection during their audit or return processing. This damages your client relationships and can result in them demanding compensation or ending the contract.",
      note: 'Source: Section 29(2) proviso, CGST Act 2017; Rule 21A, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'WHY GSTIN SUSPENSION HAPPENS',
      body: '',
      bullets: [
        'Return non-filing: More than 3 consecutive periods of GSTR-3B non-filing (or 2 consecutive quarters for composition dealers).',
        'Comparison-based system triggers: The system finds significant differences between GSTR-3B and GSTR-1 across multiple periods.',
        'Significant discrepancy in ITC claimed: Claimed ITC is significantly higher than what suppliers have filed.',
        'Application for voluntary cancellation filed: Your own application for cancellation can trigger a temporary suspended status while the application is processed.',
        'Direction from a higher authority: Based on intelligence, surveys, or investigation outcomes.',
      ],
    },
    {
      number: '03',
      heading: 'HOW TO GET YOUR GSTIN RESTORED',
      body: 'Your path to restoration depends on the reason for suspension:',
      bullets: [
        'For return non-filing: File all pending returns immediately with full tax, interest, and late fees. File a response to the REG-31 on the GST portal explaining the situation and confirming that returns have been filed. The officer will review and either restore the registration or proceed to issue REG-17.',
        'For system-generated discrepancy triggers: Prepare a reconciliation showing the GSTR-1 vs GSTR-3B differences with explanations. File the response on the portal within 30 days. Attach supporting documents.',
        'While suspended: You cannot file GSTR-1 and GSTR-3B (the portal locks these). Focus first on responding to REG-31 to get the suspension lifted, which unlocks the return filing.',
      ],
    },
    {
      number: '04',
      heading: 'WHAT TO TELL YOUR CLIENTS',
      body: 'Proactive communication with your GST-registered clients during suspension is important.',
      bullets: [
        'Inform them immediately that your GSTIN is temporarily suspended and that you are working to restore it.',
        'Advise them to hold off claiming ITC on your recent invoices until the suspension is lifted.',
        'Once restoration is confirmed, inform them explicitly so they can proceed with ITC claims.',
        'Consider holding new invoicing until the restoration is confirmed - issuing invoices while suspended creates ITC risk for your clients and puts your business relationships under strain.',
      ],
    },
  ],

  faqs: [
    {
      q: 'How long does GST suspension typically last?',
      a: 'Suspension is not time-limited by law. It continues until either: (a) the officer restores it after reviewing your response, or (b) the officer issues a REG-17 leading to formal cancellation. Your goal is to respond promptly to ensure the officer takes action (restoration) rather than allowing it to drift toward cancellation.',
    },
  ],
};
