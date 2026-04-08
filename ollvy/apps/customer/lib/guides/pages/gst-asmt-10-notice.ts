// lib/guides/pages/gst-asmt-10-notice.ts
import { LearnPageConfig } from '../pages';

export const gstAsmt10Notice: LearnPageConfig = {
  slug: 'gst-asmt-10-notice',
  title: 'GST ASMT-10 Scrutiny Notice: What It Means and How to Reply',
  seoTitle: 'GST ASMT-10 Notice: How to Reply and What It Means (2025) | Ollvy',
  seoDescription: 'A GST ASMT-10 notice means an officer found a discrepancy in your returns. You have 15 days to reply in Form ASMT-11. No reply leads to a best judgment assessment under Section 62.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-asmt-10-notice',
  lastReviewed: 'March 2025',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-monthly',
  relatedServiceSlugs: ['gst-monthly', 'gst-registration'],
  relatedLearnSlugs: ['gst-drc-01-notice', 'gst-drc-01a-pre-notice', 'gst-asmt-14-best-judgment'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing', 'gst-demand-notice'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'urgent',
  deadline: '15 days from date of notice (extendable on request)',
  deadlineNote: 'No response to ASMT-10 is one of the most common ways a minor GST query escalates into a full tax demand or audit. Do not let the deadline pass.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS ASMT-10 AND WHY DID YOU GET IT',
      body: "An ASMT-10 notice is a scrutiny notice issued under Section 61 of the CGST Act. It means a GST officer has reviewed your filed GST returns and found something that does not add up. They are not accusing you of fraud, not yet. They are asking you to explain the discrepancy before deciding what to do next.\n\nThink of it as the officer flagging a specific issue and saying: \"Your numbers don't match. Tell me why.\" The operative word is yet. If your reply is poor or missing, ASMT-10 escalates.",
      note: 'Source: Section 61, Central Goods and Services Tax Act, 2017. Rule 99, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'WHAT DISCREPANCIES TYPICALLY TRIGGER AN ASMT-10',
      body: 'The GST system runs automated checks and flags returns where numbers do not reconcile. The most common triggers are:',
      bullets: [
        'GSTR-1 vs GSTR-3B mismatch: The outward supplies (sales) you declared in GSTR-1 (invoice-level) are different from what you declared in GSTR-3B (summary). Even legitimate timing differences can trigger this.',
        'ITC mismatch: The Input Tax Credit you claimed in GSTR-3B is more than what your suppliers declared in their GSTR-1, making it unavailable in your GSTR-2B.',
        'Turnover discrepancy: The turnover in your GST returns does not match the turnover in your Income Tax returns, financial statements, or data from other sources the department has.',
        'Tax rate discrepancy: You applied a tax rate that the officer believes is incorrect for that HSN/SAC code.',
        'Reverse charge non-payment: You made purchases from unregistered dealers or imported services and did not pay the applicable reverse charge GST.',
        'E-way bill vs return mismatch: E-way bills generated do not correspond to the supply values declared in your returns.',
      ],
    },
    {
      number: '03',
      heading: 'YOUR EXACT DEADLINE AND WHAT HAPPENS NEXT',
      body: 'You have 15 days from the date of the ASMT-10 notice to file your reply in Form ASMT-11 on the GST portal.\n\nIf you need more time, you can request an extension before the 15 days expire. Extension requests are generally considered reasonable if submitted promptly with a genuine reason.\n\nThe outcome depends on your reply:',
      bullets: [
        'You reply and the officer is satisfied: The officer issues ASMT-12 (acceptance of reply) and closes the matter. This is the outcome you are working toward.',
        'You reply but the officer is not fully satisfied: The officer may ask follow-up questions or proceed to initiate a formal audit under Section 65 or Section 66.',
        'You do not reply within 15 days: The officer is empowered to proceed with assessment under Section 62 (Best Judgment Assessment) - where the officer determines your tax liability based on whatever information they have, without your input. Best Judgment Assessments are almost always worse than the real number.',
        'The discrepancy is large or serious: Even with a reply, the officer can escalate to Section 73 or 74 demand proceedings. Your reply influences how far this escalates.',
      ],
      note: 'The risk of ignoring ASMT-10 cannot be overstated. Section 62 allows the officer to assess you arbitrarily. You can appeal later but that is expensive and time-consuming.',
    },
    {
      number: '04',
      heading: 'HOW TO WRITE A STRONG ASMT-11 REPLY',
      body: 'Your reply in ASMT-11 is your one chance to close this at the lowest level of the hierarchy. A strong reply does the following:',
      bullets: [
        'Addresses each discrepancy specifically by the line item or period the notice mentions. Do not give generic answers',
        'Provides a reconciliation statement: For a GSTR-1 vs 3B mismatch, a table showing exactly which invoices account for the difference (credit notes issued, return of goods, timing of invoice vs payment) is the most effective reply',
        'Attaches supporting documents: GSTR returns, financial statements, purchase invoices, bank statements, contracts, and any other evidence that supports your explanation',
        'Acknowledges errors if there are any: If you made a genuine mistake in filing, acknowledge it clearly, explain how it happened (human error, software issue), show the correct position, and offer to pay any tax due with interest',
        'States the legal position clearly: If your position is that no tax is due, cite the relevant exemption, rate, or provision',
        'Is professionally drafted: A CA-authored reply with proper citations carries significantly more weight than a self-drafted one',
      ],
      note: 'If there is tax genuinely due, consider paying it voluntarily before the reply. Voluntary payment during ASMT-10 stage - before formal demand proceedings - demonstrates good faith and is often treated more favourably by the officer.',
    },
    {
      number: '05',
      heading: 'WHAT VOLUNTARY PAYMENT AT ASMT-10 STAGE SAVES YOU',
      body: 'If you agree that some or all of the discrepancy represents genuine underpaid tax, paying it voluntarily through DRC-03 before or alongside your ASMT-11 reply has real financial advantages.\n\nAt the ASMT-10 stage, before formal demand proceedings begin, there is no mandatory penalty. If the matter progresses to DRC-01A and you pay there, the same applies for non-fraud cases. Once DRC-01 is issued, a minimum 10 percent penalty applies under Section 73.\n\nPaying early also demonstrates compliance intent, which influences how officers approach your case at every subsequent stage.',
    },
    {
      number: '06',
      heading: 'THE ASMT-10 TO DRC-01 ESCALATION PATH',
      body: 'It is worth understanding the full escalation path so you know what you are trying to prevent:',
      bullets: [
        'ASMT-10 (scrutiny notice): Officer flags a discrepancy. This is where you are now.',
        'ASMT-12 (acceptance): If your reply is good, this is where it ends.',
        'Section 65/66 audit: Officer decides a formal audit is needed. Your premises can be visited, records can be inspected.',
        'DRC-01A (pre-SCN intimation): Officer has determined a tax demand and is giving you one more informal opportunity to pay before formal proceedings.',
        'DRC-01 (show cause notice): Formal demand. You have 30 days to reply.',
        'DRC-07 (demand order): Final demand with penalty and interest.',
        'The earlier you engage seriously in this chain, the better the outcome. ASMT-10 is the best stage to resolve this.',
      ],
    },
    {
      number: '07',
      heading: 'MISTAKES THAT TURN A MINOR QUERY INTO A MAJOR DEMAND',
      body: '',
      bullets: [
        'Treating ASMT-10 as optional: Some businesses assume a GST notice is just a formality. It is not. Non-reply leads to Best Judgment Assessment.',
        'Generic replies without reconciliation: Saying "the discrepancy is due to different accounting treatment" without a table showing the actual numbers is useless.',
        'Not attaching documents: The officer needs evidence. A reply without annexures is like a court submission without exhibits.',
        'Acknowledging more than what is asked: Only address what the notice specifically asks about. Do not volunteer information that opens new lines of inquiry.',
        'Ignoring the notice because the amount seems small: Officers use ASMT-10 responses (or the absence of them) to determine whether to escalate. Even a small discrepancy ignored can trigger a full audit.',
      ],
    },
  ],

  faqs: [
    {
      q: 'My ASMT-10 is about a GSTR-1 vs GSTR-3B mismatch but the difference is only because I filed an amendment. How do I explain this?',
      a: 'This is one of the most common and cleanest explanations. In your ASMT-11 reply, provide a reconciliation showing: original GSTR-1 value, the amendment filed in which period, the net impact, and how the final GSTR-3B number reflects the correct position. Attach the amendment filings and the original returns. Most officers are familiar with this scenario.',
    },
    {
      q: 'I received ASMT-10 for a period where I had genuine ITC mismatches because my suppliers were non-compliant. What do I do?',
      a: 'This is a genuinely difficult situation because the law (Section 16(2)(aa) after 2022) ties your ITC claim to what your supplier files. In your reply, show your purchase invoices and GSTR-2B side by side. Demonstrate that you followed up with suppliers, have evidence of receipt of goods or services, and paid for them. The legal argument is evolving through court decisions - a CA can advise on the strongest current position.',
    },
    {
      q: 'I am receiving ASMT-10 notices for multiple years at the same time. Where do I start?',
      a: 'Start with the earliest year, as its resolution often informs the methodology for later years. Also, if the same issue (e.g., turnover mismatch) appears across multiple years, one well-argued reply can serve as the template for all. Handling them together with professional help is more efficient than tackling them one by one.',
    },
    {
      q: 'The ASMT-10 notice says the discrepancy is Rs. 12 lakh. Will I have to pay all of this?',
      a: 'Not necessarily. The Rs. 12 lakh is the discrepancy flagged, not necessarily the final tax due. After your reply and reconciliation, the officer may accept your explanation fully, partially, or not at all. What you eventually owe (if anything) depends entirely on the quality of your reply.',
    },
  ],

  sources: [
    { name: 'CGST Act, 2017 (Section 61)', url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html', description: 'Scrutiny of returns provision under which ASMT-10 is issued' },
    { name: 'CGST Rules, 2017 (Rule 99)', url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf', description: 'Procedure for scrutiny of returns and reply in Form ASMT-11' },
  ],
};
