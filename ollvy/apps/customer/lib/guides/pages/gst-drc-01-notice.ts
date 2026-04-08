// lib/guides/pages/gst-drc-01-notice.ts
import { LearnPageConfig } from '../pages';

export const gstDrc01Notice: LearnPageConfig = {
  slug: 'gst-drc-01-notice',
  title: 'GST DRC-01 Notice: What It Means and What to Do',
  seoTitle: 'GST DRC-01 Notice: What It Is and How to Reply (2025) | Ollvy',
  seoDescription: 'A DRC-01 is a formal GST tax demand. You have 30 days to reply before the officer passes an order without hearing your side. Understand Section 73 vs 74 and how to respond.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-drc-01-notice',
  lastReviewed: 'March 2025',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-monthly',
  relatedServiceSlugs: ['gst-monthly', 'gst-registration'],
  relatedLearnSlugs: ['gst-drc-01a-pre-notice', 'gst-asmt-10-notice', 'gst-drc-01b-mismatch'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing', 'gst-demand-notice'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'urgent',
  deadline: '30 days from date of notice',
  deadlineNote: 'Missing this deadline results in an ex-parte demand order against you. The department will pass an order without hearing your side.',

  sections: [
    {
      number: '01',
      heading: 'WHAT A DRC-01 IS AND WHY YOU GOT IT',
      body: "A DRC-01 notice is a Summary of the Show Cause Notice. In plain English: the GST department believes you owe them tax and they are now formally putting that demand in writing and asking you to explain yourself or pay up.\n\nThis is serious. But it is not the end. A DRC-01 is the department's opening move, not their final word. You have a right to reply, a right to be heard, and if your case is strong, the demand can be reduced or dropped entirely.\n\nWhat you must not do is ignore it.",
      note: 'Source: Section 73 and Section 74, Central Goods and Services Tax Act, 2017. Rule 142, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'WHAT IS A DRC-01 AND WHY DID YOU GET ONE',
      body: 'DRC stands for Demand and Recovery. The DRC-01 is the formal document that summarises the Show Cause Notice issued against you. There are two versions of this notice - and which one you received changes everything about how serious your situation is.',
      bullets: [
        'DRC-01 under Section 73 (non-fraud): The department believes there is a tax shortfall but is NOT alleging fraud, deliberate suppression, or willful misstatement on your part. This is the less severe version. The limitation period for this is 3 years from the due date of the relevant annual return.',
        'DRC-01 under Section 74 (fraud / suppression): The department IS alleging fraud, willful misstatement, or suppression of facts to evade tax. This is the more serious version. The limitation period extends to 5 years. Penalties here can be up to 100% of the tax amount.',
        'Common reasons you received a DRC-01: GSTR-1 and GSTR-3B mismatch, ITC claimed exceeds what your suppliers filed, incorrect HSN classification, turnover underreported compared to bank data or e-way bills, wrong tax rate applied, ITC claimed on blocked credit items.',
      ],
      note: 'Check the first page of your notice carefully. It will state "under Section 73" or "under Section 74." This is the single most important line in the document.',
    },
    {
      number: '03',
      heading: 'YOUR EXACT DEADLINE AND WHAT HAPPENS IF YOU MISS IT',
      body: "You have 30 days from the date of the DRC-01 notice to file your reply.\n\nIf you do not reply within 30 days, the GST officer is legally permitted to pass an ex-parte order - meaning they will decide the case without hearing your side and issue a demand in Form DRC-07. Once DRC-07 is issued, you cannot reply to DRC-01 anymore. Your options then become filing an appeal (which costs more time and money) or paying the demand.\n\nIf you need more time, you can request an adjournment - but this must be done before the deadline expires, not after. The officer has discretion to grant it.",
      note: 'The 30-day period starts from the date printed on the DRC-01 notice, not the date you received it. If your GSTIN portal shows the notice was uploaded 5 days ago, count backwards.',
    },
    {
      number: '04',
      heading: 'WHAT YOUR REPLY (DRC-06) MUST CONTAIN',
      body: 'Your reply is filed in Form DRC-06 on the GST portal. A good reply is not just "I disagree." It must be specific, documented, and address every point the notice raises. Here is what a proper reply covers:',
      bullets: [
        'Point-by-point response to each discrepancy or allegation in the notice - vague replies are treated as weak replies',
        'Reconciliation statement showing how the numbers the department flagged are explained (e.g., a GSTR-1 vs 3B difference might be timing, credit notes, or amendments)',
        'Supporting documents attached as evidence: GSTR-1, GSTR-3B, books of accounts, purchase invoices, bank statements, e-way bills, contracts as relevant',
        'Legal arguments citing relevant sections and case law if applicable - this is where professional help adds significant value',
        'If you partially agree with the demand: Pay the admitted tax, interest, and applicable penalty immediately and state this in your reply. This can significantly reduce the final demand.',
        'If under Section 74 (fraud allegation): The reply must specifically address and counter the fraud allegation. Never admit to suppression or fraud even if you are willing to pay the tax.',
      ],
      note: 'If you choose to pay before or during the DRC-01 stage (and the case is under Section 73), you benefit from reduced penalties - 10% of tax instead of 100%. This window closes once the officer passes the DRC-07 order.',
    },
    {
      number: '05',
      heading: 'PAY BEFORE REPLYING: WHEN THIS IS THE RIGHT MOVE',
      body: 'If the case is under Section 73 and you agree the tax is due, paying the full demand plus interest within 30 days of the SCN means zero penalty. Section 73(8) is explicit: "no penalty shall be payable and all proceedings shall be deemed to be concluded." This is the cheapest and fastest resolution path if you accept the liability.\n\nIf the case is under Section 74 (fraud allegation), paying within 30 days of the SCN reduces the penalty from 100 percent to 15 percent. Do not pay under Section 74 without professional advice. If the fraud allegation itself can be challenged, your reply should challenge the Section 74 classification before you pay anything.',
      note: 'Partial payment is also an option. Pay what you agree with, state it clearly in your DRC-06 reply with challan details, and contest the rest.',
    },
    {
      number: '06',
      heading: 'WHAT HAPPENS AT THE PERSONAL HEARING',
      body: 'After you file DRC-06, the officer will grant you a personal hearing. Do not skip this. The personal hearing is your opportunity to present your case verbally, clarify anything in your written reply, and understand exactly what the officer is thinking.\n\nA few things to know about personal hearings:',
      bullets: [
        'You or your authorised representative (CA/advocate) can appear. In most cases, send a professional - they know the right language and arguments.',
        'Bring physical copies of all documents you submitted with your reply.',
        'Take notes during the hearing. If the officer raises new points, ask for them in writing.',
        'The officer cannot make a final order on the spot during the hearing. There is a mandated speaking period.',
        'If you are not satisfied with the hearing outcome, you can still appeal after DRC-07 is issued.',
      ],
    },
    {
      number: '07',
      heading: 'THE MOST COMMON MISTAKES PEOPLE MAKE',
      body: '',
      bullets: [
        'Ignoring the notice completely: This is the worst thing you can do. The officer WILL pass an ex-parte order and the demand becomes very hard to fight without an appeal.',
        'Filing a vague or generic reply without documents: "The discrepancy is due to accounting differences" without a reconciliation statement is not a reply. It is an invitation for the officer to rule against you.',
        'Paying the full demand without checking it: Sometimes the demand calculation itself has errors. Always verify the numbers before paying.',
        'Admitting to fraud when you did not commit fraud: If the notice is under Section 74 but you genuinely believe it is a bookkeeping error and not fraud, your reply should challenge the Section 74 classification itself.',
        'Missing the 30-day deadline because you were "gathering documents": Start gathering immediately. If you need more time, file a request for adjournment before the deadline.',
        'Not tracking the notice on the GST portal: The DRC-01 is served electronically. If your email or phone linked to your GSTIN is outdated, you might not get an alert but the 30-day clock has already started.',
      ],
    },
    {
      number: '08',
      heading: 'AFTER THE DRC-01: WHAT COMES NEXT',
      body: 'One of three things will happen after your reply and hearing:',
      bullets: [
        'DRC-05 (Conclusion of proceedings): The officer is satisfied with your reply. The proceedings are dropped. This is the outcome you are aiming for.',
        'DRC-07 (Order for demand): The officer partially or fully confirms the demand. You now have the option to pay (with appeal rights preserved) or appeal to the Appellate Authority within 3 months.',
        'Further enquiry: The officer asks for additional documents or information before deciding. This can happen multiple times.',
      ],
      note: 'If DRC-07 is passed against you, the appeal must be filed to the First Appellate Authority (Joint/Additional Commissioner) within 3 months. Pre-deposit of 10% of disputed tax is required for the appeal to be admitted.',
    },
  ],

  faqs: [
    {
      q: 'I received DRC-01 for a GST period from 3 years ago. Is it too late for them to issue this?',
      a: "Not necessarily. For Section 73 (non-fraud) cases, the notice must be issued within 3 years from the due date of the annual return for the relevant year. For Section 74 (fraud), the limit is 5 years. If the notice is genuinely time-barred, this is a strong legal ground for your reply. A CA can check the dates precisely.",
    },
    {
      q: 'Do I need a CA to reply or can I do it myself?',
      a: 'Technically you can file DRC-06 yourself. But for any demand above Rs. 1 lakh, the risk of a wrong reply is too high. A professional reply with a proper reconciliation and legal citations dramatically changes outcomes. For demands above Rs. 5 lakh, always get professional help.',
    },
    {
      q: 'I partially agree with the demand. Should I pay part of it now?',
      a: 'Yes, paying the admitted tax and interest before or during DRC-01 proceedings reduces your penalty exposure significantly under Section 73. Pay what you agree with, clearly state the payment in your DRC-06 reply with challan details, and contest the rest.',
    },
    {
      q: 'The notice says the demand is Rs. 40 lakh. Is that the final amount I will owe?',
      a: "Not necessarily. The DRC-01 shows the amount the department is claiming. After your reply, hearing, and the officer's consideration, the final order (DRC-07) may be for a different amount - lower if your arguments are accepted, or the same if they are not. The DRC-01 figure is the starting point for negotiation, not a settled debt.",
    },
    {
      q: 'I missed the 30-day deadline. What are my options now?',
      a: "If DRC-07 has already been passed, you can file an appeal to the Appellate Authority within 3 months of the order date with a 10% pre-deposit of the disputed tax. If DRC-07 has not yet been passed (the officer has not yet issued the order), speak to a CA immediately - there may still be an opportunity to request that the officer hear your submission before passing the order, though this is at the officer's discretion.",
    },
  ],

  sources: [
    { name: 'CGST Act, 2017 (Section 73 and 74)', url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html', description: 'Primary legislation governing GST demand and recovery proceedings' },
    { name: 'CGST Rules, 2017 (Rule 142)', url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf', description: 'Rules for service of show cause notice and reply procedure' },
  ],
};
