// lib/guides/pages/gst-gstr2b-itc-mismatch.ts
import { LearnPageConfig } from '../pages';

export const gstGstr2bItcMismatch: LearnPageConfig = {
  slug: 'gst-gstr2b-itc-mismatch',
  title: 'GST ITC Mismatch Notice: GSTR-2B vs Claimed Input Tax Credit',
  seoTitle: 'GST ITC Mismatch Notice 2025: GSTR-2B vs Claimed Credit | Ollvy',
  seoDescription: 'Got a GST notice about Input Tax Credit mismatch between GSTR-2B and your claimed ITC? Understand why it happened and how to respond before it becomes a demand.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-gstr2b-itc-mismatch',
  lastReviewed: 'March 2025',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-monthly-filing',
  ctaSecondarySlug: 'gst-registration',
  relatedServiceSlugs: ['gst-monthly-filing', 'gst-registration'],
  relatedLearnSlugs: ['gst-asmt-10-notice', 'gst-drc-01-notice', 'gst-drc-01b-mismatch'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing', 'gst-demand-notice'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'serious',
  deadline: 'Depends on notice form - typically 15-30 days',
  deadlineNote: 'ITC mismatch notices are growing rapidly in volume. The department is becoming more aggressive about enforcing Section 16(2)(aa).',

  sections: [
    {
      number: '01',
      heading: 'WHY YOUR ITC CLAIM IS BEING QUESTIONED',
      body: "Since the Finance Act 2022 amended Section 16(2)(aa) of the CGST Act, Input Tax Credit can only be availed if the invoice or debit note appears in your GSTR-2B. GSTR-2B is an auto-generated document showing all the ITC available to you based on what your suppliers have actually filed in their GSTR-1.\n\nThe problem: You may have received goods or services, paid for them, and have the invoice - but if your supplier did not file their GSTR-1 correctly, or filed it late, the credit will not appear in your GSTR-2B. And you claimed it anyway. That gap is what the department is now targeting.",
      note: 'Source: Section 16(2)(aa), CGST Act 2017 (inserted by Finance Act 2022, effective October 1, 2022).',
    },
    {
      number: '02',
      heading: 'HOW THESE NOTICES ARRIVE AND WHAT THEY LOOK LIKE',
      body: 'ITC mismatch notices come in different forms depending on the stage:',
      bullets: [
        'ASMT-10 scrutiny notice: The most common form. Officer identifies that your GSTR-3B claimed ITC is higher than your GSTR-2B available ITC and asks for an explanation.',
        'DRC-01B: As described separately, the system flags GSTR-1 vs 3B differences which can include ITC-related mismatches.',
        'DRC-01: If the ASMT-10 reply is not satisfactory, a formal demand for the excess ITC claimed is raised.',
        'GST Audit observation: During an audit under Section 65, ITC mismatches are a primary focus area.',
      ],
    },
    {
      number: '03',
      heading: 'BUILDING YOUR RESPONSE',
      body: 'Your defence against an ITC mismatch notice has multiple layers:',
      bullets: [
        'Reconcile first: Before responding, do a proper reconciliation of your claimed ITC vs GSTR-2B. Identify exactly which invoices are missing from GSTR-2B and why.',
        'Supplier communication: For every missing invoice, contact the supplier and ask them to rectify their GSTR-1. Once they amend, the credit will appear in a future GSTR-2B and can be claimed. Document your communication attempts.',
        'Establish receipt of goods/services: Under Section 16(2)(b), ITC is available only on receipt of goods or services. Even if GSTR-2B does not reflect the credit, you can argue that the credit is legally available if you can prove actual receipt, payment, and tax was charged.',
        'Court precedents in your favour: Multiple High Courts have held that a buyer should not be denied ITC solely because their supplier was non-compliant, especially if the buyer took all reasonable steps. This is an evolving legal position and should be part of your reply.',
        'Reverse matching with purchases: Show your full purchase ledger for the period and match it with GSTR-2B. This demonstrates that the mismatch is limited to specific supplier non-compliance, not a broad pattern.',
      ],
      note: 'The legal position on ITC denial for supplier default is actively being litigated. As of 2025, buyer-favourable positions exist in several High Courts. A CA can advise on applicable precedents for your jurisdiction.',
    },
    {
      number: '04',
      heading: 'WHAT TO DO GOING FORWARD',
      body: 'Beyond resolving the current notice, here is how to protect your ITC going forward:',
      bullets: [
        'Match GSTR-2B before filing GSTR-3B every month: Only claim ITC that appears in GSTR-2B. If you have credits not in GSTR-2B, hold them until they appear.',
        'Include ITC matching as a vendor selection criterion: Prefer suppliers who file on time. Persistent non-filer suppliers cost you ITC and create litigation risk.',
        'Use 2B reconciliation tools: Accounting software like Tally, Zoho, and Busy now have GSTR-2B reconciliation built in. Use them.',
        'Document receipt of goods: Maintain good inward supply registers and delivery acknowledgements. These are your evidence if ITC is challenged.',
      ],
    },
  ],

  faqs: [
    {
      q: 'My supplier promised to file their GSTR-1 but has not done it in 3 months. Can I claim the ITC now?',
      a: 'As of the current law, strictly speaking, no - the credit must appear in your GSTR-2B before it can be claimed. However, if the supplier eventually files and the credit appears in a future GSTR-2B, you can claim it in the period it appears. Keep your purchase records and the credit note/invoice ready for whenever this happens.',
    },
    {
      q: 'I reversed the ITC mismatch amount in a subsequent month. Does this close the notice?',
      a: 'If you voluntarily reversed the ITC in the same year (or subsequent month) through a GSTR-3B reversal, this demonstrates that you are correcting the position. Include this reversal with challan details in your notice reply. Pay interest at 24% p.a. from the date of claiming incorrect ITC to the date of reversal (higher rate applies when ITC is reversed pursuant to demand).',
    },
  ],
};
