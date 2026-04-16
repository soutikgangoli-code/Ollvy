// lib/guides/pages/gst-drc-01b-mismatch.ts
import { LearnPageConfig } from '../pages';

export const gstDrc01bMismatch: LearnPageConfig = {
  slug: 'gst-drc-01b-mismatch',
  title: 'GST DRC-01B Notice: GSTR-1 vs GSTR-3B Liability Mismatch',
  seoTitle: 'GST DRC-01B Notice: GSTR-1 vs 3B Mismatch - How to Fix (2026) | Ollvy',
  seoDescription: 'A DRC-01B notice means the GST system found a mismatch between your GSTR-1 and GSTR-3B. You have 7 days to explain or pay the difference before it escalates to a formal DRC-01 demand.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-drc-01b-mismatch',
  lastReviewed: 'April 2026',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-monthly',
  ctaSecondarySlug: 'gst-registration',
  relatedServiceSlugs: ['gst-monthly', 'gst-registration'],
  relatedLearnSlugs: ['gst-drc-01-notice', 'gst-asmt-10-notice', 'gst-gstr2b-itc-mismatch'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing', 'gst-demand-notice'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'serious',
  deadline: '7 days from date of notice (Part B response)',
  deadlineNote: 'The 7-day window is short. If you miss it, the officer can initiate DRC-01 demand proceedings.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS DRC-01B AND WHY DOES IT EXIST',
      body: "From 2022-23 onwards, the GST system automatically compares your GSTR-1 (invoice-level outward supply details) with your GSTR-3B (self-assessed tax payment summary) for every month. If the taxable value or tax liability in GSTR-3B is less than what you declared in GSTR-1, the system automatically generates a DRC-01B intimation.\n\nThis is a system-generated notice. No human officer has specifically reviewed your case. But it still demands a response and carries real consequences if ignored.",
      note: 'Source: Rule 88C, CGST Rules 2017, inserted by Notification 26/2022-CT dated 26.12.2022.',
    },
    {
      number: '02',
      heading: 'THE MOST COMMON REASONS FOR A DRC-01B',
      body: 'The mismatch is almost always one of these:',
      bullets: [
        "Tax paid through DRC-03: You realised you had underpaid tax in a prior period and made a voluntary payment through DRC-03 (voluntary tax payment challan) but the GSTR-3B still reflects the original lower figure. This is legitimate but needs to be declared in DRC-01B Part B.",
        "Timing difference: You raised invoices in GSTR-1 for advance received but the actual tax was paid in the next month's GSTR-3B. Common in construction and real estate.",
        "Credit notes issued: You issued credit notes in a later period that reduced your actual liability from what GSTR-1 showed for the current period. This is not always reflected correctly in the system comparison.",
        "Amendment in GSTR-1: You amended invoices in a subsequent month but the original period's comparison is being flagged.",
        'Genuine underpayment: You made a mistake in GSTR-3B and actually did pay less tax than you were supposed to. In this case, you should pay the shortfall.',
        'Nil-rated, exempted, or non-GST supplies declared in GSTR-1 but not in GSTR-3B: These categories can create apparent mismatches that are not actual tax dues.',
      ],
    },
    {
      number: '03',
      heading: 'THE TWO-PART RESPONSE STRUCTURE',
      body: 'DRC-01B has two parts and your response determines which path you go down.',
      bullets: [
        'DRC-01B Part A: This is the intimation the system sends you. It shows the specific period, the GSTR-1 declared liability, the GSTR-3B declared liability, and the difference.',
        'DRC-01B Part B: This is where you reply. You must file Part B within 7 days of the Part A intimation.',
        'In Part B, you select one of two responses: (a) "The difference is due to the following reasons" - you explain and provide details, or (b) "I am making payment of the difference" - you pay the shortfall.',
        'If you select the explanation route, you must provide specific reasons. Vague reasons like "due to accounting treatment" are not sufficient - you need the specific transaction details.',
      ],
    },
    {
      number: '04',
      heading: 'HOW TO PREVENT DRC-01B NOTICES IN FUTURE',
      body: 'DRC-01B is a system check that runs automatically every month. Preventing it is straightforward if you reconcile before filing GSTR-3B.\n\nBefore filing GSTR-3B each month: verify that the taxable value and tax in your GSTR-3B matches what you declared in GSTR-1 for the same period. If there is a difference due to DRC-03 payment, credit notes, or timing, note it now rather than waiting for the system to flag it.\n\nIf you made a voluntary payment through DRC-03 for a prior period, always declare it in the next GSTR-3B filing so the portal can match it correctly.',
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS AFTER YOUR PART B RESPONSE',
      body: 'The outcome depends on whether the officer accepts your explanation.',
      bullets: [
        'If your explanation is accepted: The matter closes here. No further action.',
        'If your explanation is not accepted or you do not respond: The system/officer can initiate proceedings under Section 73 or 74 and issue a DRC-01. At that stage, the mismatch becomes a formal demand with penalties.',
        'If you pay the shortfall: Part B closed with payment challan number. The matter closes for that period.',
        'If the same mismatch recurs across multiple months: The officer may decide to initiate a comprehensive scrutiny or audit rather than handling them individually.',
      ],
      note: 'A DRC-01B is significantly easier and cheaper to resolve than a DRC-01. The incentive to resolve it here is strong.',
    },
    {
      number: '06',
      heading: 'HOW TO PREPARE YOUR PART B RESPONSE',
      body: 'A proper Part B response should include:',
      bullets: [
        'A clear statement of the reason for the mismatch with the specific transaction or period it relates to',
        'DRC-03 challan details if the difference was paid voluntarily in a different period',
        'A reconciliation table showing: GSTR-1 declared value, credit notes issued, amendments, advances adjusted, and the net taxable value matching GSTR-3B',
        'Copies of relevant invoices, credit notes, or amendment records as supporting documents',
        'If there was a genuine error, the payment of shortfall with interest under Section 50 (18% per annum from the original due date)',
      ],
    },
  ],

  faqs: [
    {
      q: 'I received DRC-01B for a mismatch but I already paid the difference via DRC-03 voluntarily. What do I do?',
      a: 'This is exactly the right path. In your Part B response, select the explanation option, state that the difference was paid voluntarily through DRC-03, and provide the DRC-03 challan number and date. The system will verify this and close the matter.',
    },
    {
      q: 'The DRC-01B mismatch is just Rs. 500. Is it worth worrying about?',
      a: 'Yes. The amount does not determine whether the notice escalates. A non-response to DRC-01B can initiate formal DRC-01 proceedings regardless of the amount. Respond to every DRC-01B - even for small amounts.',
    },
    {
      q: 'I received DRC-01B notices for 6 different months simultaneously. Do I respond to each separately?',
      a: 'Yes, each DRC-01B is for a specific month and must be responded to individually in its own Part B. The reasons may be the same across months - in that case, your responses will be similar - but each Part B must be filed.',
    },
  ],

  sources: [
    { name: 'CGST Rules, 2017 (Rule 88C)', url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html', description: 'Rule governing GSTR-1 and GSTR-3B liability mismatch intimation' },
    { name: 'Notification 26/2022-Central Tax', url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf', description: 'Notification inserting Rule 88C into the CGST Rules' },
  ],
};
