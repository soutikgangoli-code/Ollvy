// lib/guides/pages/gst-drc-01a-pre-notice.ts
import { LearnPageConfig } from '../pages';

export const gstDrc01aPreNotice: LearnPageConfig = {
  slug: 'gst-drc-01a-pre-notice',
  title: 'GST DRC-01A Notice: Pre-Show Cause Notice Intimation',
  seoTitle: 'GST DRC-01A Notice: What It Is and How to Respond (2026) | Ollvy',
  seoDescription: 'A DRC-01A is a pre-demand intimation, not a formal notice. Respond well here and the matter may close without a DRC-01 ever being issued. You have 30 days.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-drc-01a-pre-notice',
  lastReviewed: 'April 2026',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-monthly',
  relatedServiceSlugs: ['gst-monthly', 'gst-registration'],
  relatedLearnSlugs: ['gst-drc-01-notice', 'gst-asmt-10-notice'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing', 'gst-demand-notice'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'serious',
  deadline: '30 days from date of intimation',
  deadlineNote: 'DRC-01A is actually an opportunity - if you respond well here, the department may close the matter without ever issuing a formal DRC-01 demand.',

  sections: [
    {
      number: '01',
      heading: 'THIS IS NOT A DEMAND YET',
      body: "DRC-01A is a relatively recent addition to the GST compliance toolkit, introduced to give taxpayers an informal opportunity to engage with the department before formal demand proceedings begin.\n\nHere is what has happened: the GST officer has done the calculation and determined that you owe tax. But before issuing the formal DRC-01 Show Cause Notice, they are required to first send you DRC-01A, essentially saying \"we think you owe Rs. X. Here is what we found. Tell us if we are wrong, or pay up.\"\n\nThis informal stage is genuinely valuable. Use it.",
      note: 'Source: Rule 142(1A), CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'WHAT YOUR RESPONSE TO DRC-01A CAN DO',
      body: 'You have two paths in response to DRC-01A.',
      bullets: [
        'Option A - Pay the ascertained amount: If you review the notice and agree that the tax is due, pay it along with applicable interest through DRC-03 (voluntary payment challan). When you pay at the DRC-01A stage (before formal SCN), the penalty that would apply if you paid after DRC-01 is either nil or significantly reduced. Under Section 73, if you pay before the SCN, no penalty applies at all.',
        'Option B - Provide a representation: If you believe the amount is wrong (partially or fully), file a written representation in DRC-01A Part B explaining your position with supporting documents. If the officer agrees with your representation, they can close the matter without issuing DRC-01.',
      ],
      note: 'The penalty protection at this stage is significant. Under Section 73 (non-fraud cases): paying during DRC-01A stage means nil penalty. Paying during DRC-01 stage means 10% penalty. Paying after DRC-07 demand order means 10-15% penalty. Under Section 74 (fraud): penalties are 100% at DRC-01 stage, so the relative benefit of early payment is even larger.',
    },
    {
      number: '03',
      heading: 'WHAT HAPPENS IF YOU IGNORE DRC-01A',
      body: 'DRC-01A is informal. There is no statutory consequence just for not responding. However:',
      bullets: [
        'The officer will proceed to issue the formal DRC-01 Show Cause Notice',
        'At DRC-01 stage, penalties apply (10% minimum for Section 73, 100% for Section 74)',
        'The matter becomes part of your formal litigation record',
        'You lose the goodwill of early engagement, which sometimes influences how officers treat borderline cases',
      ],
    },
    {
      number: '04',
      heading: 'HOW TO WRITE A STRONG REPRESENTATION',
      body: "If you are challenging the department's calculation at DRC-01A stage, your representation should:",
      bullets: [
        'Be in writing and addressed to the officer who signed the DRC-01A',
        'Specifically identify each component of the ascertained amount you agree with and each you dispute',
        'Provide a reconciliation for every disputed component - not just a general statement',
        'Attach supporting documents (returns, invoices, bank statements, credit notes)',
        'State clearly the amount (if any) you are paying voluntarily and provide the DRC-03 challan details',
      ],
    },
    {
      number: '05',
      heading: 'HOW DRC-01A COMPARES TO DRC-01: THE COST DIFFERENCE',
      body: 'Most businesses do not realise how much cheaper DRC-01A resolution is compared to waiting for DRC-01. The penalty structure makes early engagement financially rational.\n\nFor a Rs. 10 lakh demand under Section 73: paying at DRC-01A stage costs Rs. 10 lakh (tax) plus interest. Paying after DRC-07 is passed costs Rs. 10 lakh (tax) plus interest plus Rs. 1 lakh minimum penalty (10 percent). For Section 74 cases, the difference is even larger: DRC-01A stage carries 15 percent penalty, DRC-07 stage carries 100 percent.\n\nIf you agree the tax is due, paying at DRC-01A is almost always the right financial decision.',
    },
  ],

  faqs: [
    {
      q: 'Is DRC-01A mandatory before DRC-01 can be issued?',
      a: 'It depends on the case. Rule 142(1A) requires DRC-01A for cases where the officer has ascertained the tax through scrutiny, audit, inspection, or investigation. For cases where the officer is acting on a complaint or intelligence-based investigation, DRC-01A may not be issued before DRC-01.',
    },
    {
      q: 'I received DRC-01A for Rs. 8 lakh. If I pay it now via DRC-03, is the matter fully closed?',
      a: 'Not automatically. You pay via DRC-03 and inform the officer. The officer reviews and if satisfied, does not issue DRC-01 and closes the proceedings. Get a written acknowledgement or wait for the ASMT-12 or closure order before treating the matter as closed.',
    },
    {
      q: 'Can I negotiate the amount shown in DRC-01A?',
      a: "DRC-01A is not a negotiation. It is the officer's calculation based on available data. You can challenge it with your own reconciliation and documents in your Part B representation. If the officer accepts your data, the amount is revised. If not, DRC-01 is issued for the original amount.",
    },
  ],

  sources: [
    { name: 'CGST Rules, 2017 (Rule 142(1A))', url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html', description: 'Rule governing pre-notice intimation before formal show cause notice' },
    { name: 'CGST Act, 2017 (Section 73)', url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf', description: 'Penalty provisions applicable at different stages of demand proceedings' },
  ],
};
