// lib/guides/pages/gst-reg-31-suspension.ts
import { LearnPageConfig } from '../pages';

export const gstReg31Suspension: LearnPageConfig = {
  slug: 'gst-reg-31-suspension',
  title: 'GST REG-31 Notice: Your GST Registration Has Been Suspended',
  seoTitle: 'GST REG-31 Suspension Notice: What to Do Now (2026) | Ollvy',
  seoDescription: 'A GST REG-31 notice means your registration is suspended. You cannot issue invoices or claim ITC while suspended. REG-17 cancellation notice follows within 30 days if you do not act.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-reg-31-suspension',
  lastReviewed: 'April 2026',
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
      heading: 'YOUR GSTIN IS SUSPENDED',
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
        'Consider holding new invoicing until the restoration is confirmed. Issuing invoices while suspended creates ITC risk for your clients and puts your business relationships under strain.',
      ],
    },
    {
      number: '05',
      heading: 'THE IMPACT ON YOUR CUSTOMERS WHILE YOU ARE SUSPENDED',
      body: 'Every day your GSTIN is suspended, your customers are affected. Invoices issued during suspension are not valid tax invoices. Your customers cannot claim ITC on them.\n\nIf you supply to GST-registered businesses and your GSTIN shows as "suspended" on the portal, your customers may refuse to accept invoices or put payments on hold until the suspension is resolved. For B2B businesses, this can cause immediate cash flow disruption.\n\nThe faster you resolve the suspension, the smaller this impact is.',
    },
  ],

  faqs: [
    {
      q: 'How long does GST suspension typically last?',
      a: 'Suspension is not time-limited by law. It continues until either: (a) the officer restores it after reviewing your response, or (b) the officer issues a REG-17 leading to formal cancellation. Your goal is to respond promptly to ensure the officer takes action (restoration) rather than allowing it to drift toward cancellation.',
    },
    {
      q: 'I filed all pending returns. How long before the suspension is lifted?',
      a: 'If the suspension was due to non-filing and there are no other grounds for cancellation, the officer should revoke it after verifying your returns. This typically takes a few days to 2 weeks. Follow up with the jurisdictional officer if it is not lifted within 7 working days of filing.',
    },
  ],

  sources: [
    { name: 'CGST Rules, 2017 (Rule 21A)', url: 'https://www.gst.gov.in', description: 'Suspension of registration provision and automatic revocation rule' },
    { name: 'CBIC GST Portal', url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html', description: 'Official GST compliance and notice tracking portal' },
  ],
};
