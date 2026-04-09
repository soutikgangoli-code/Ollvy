// ─── GST NOTICE PAGES: COMPLETE REWRITES ─────────────────────────────────────
// Rules: no em dashes, answer-first seoDescriptions, fluff removed,
// sources array in HowWeReviewed format, one new mid-page section per notice

// ─── 1. GST DRC-01 ───────────────────────────────────────────────────────────

export const gstDrc01Updates = {
  slug: 'gst-drc-01-notice',
  seoTitle: 'GST DRC-01 Notice: What It Is and How to Reply (2025) | Ollvy',
  seoDescription: 'A DRC-01 is a formal GST tax demand. You have 30 days to reply before the officer passes an order without hearing your side. Understand Section 73 vs 74 and how to respond.',

  sections: [
    {
      number: '01',
      heading: 'WHAT A DRC-01 IS AND WHY YOU GOT IT',
      body: 'A DRC-01 notice is a Summary of the Show Cause Notice. The GST department believes you owe tax and is now formally putting that demand in writing, asking you to explain yourself or pay.\n\nThis is serious. But it is not the end. A DRC-01 is the department\'s opening move, not their final word. You have a right to reply, a right to be heard, and if your case is strong, the demand can be reduced or dropped entirely.\n\nDo not ignore it.',
      note: 'Source: Section 73 and Section 74, Central Goods and Services Tax Act, 2017. Rule 142, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'SECTION 73 VS SECTION 74: THE MOST IMPORTANT DISTINCTION',
      body: 'DRC stands for Demand and Recovery. The DRC-01 summarises the Show Cause Notice issued against you. Which section it is issued under changes everything about how serious your situation is.\n\nDRC-01 under Section 73 (non-fraud): The department believes there is a tax shortfall but is not alleging fraud, deliberate suppression, or wilful misstatement. This is the less severe version. The limitation period is 3 years from the due date of the relevant annual return.\n\nDRC-01 under Section 74 (fraud or suppression): The department is alleging fraud, wilful misstatement, or suppression of facts to evade tax. This is the more serious version. The limitation period extends to 5 years. Penalties can reach 100 percent of the tax amount.',
      bullets: [
        'GSTR-1 and GSTR-3B mismatch',
        'ITC claimed exceeds what your suppliers filed',
        'Incorrect HSN classification',
        'Turnover underreported compared to bank data or e-way bills',
        'Wrong tax rate applied',
        'ITC claimed on blocked credit items',
      ],
      note: 'Check the first page of your notice carefully. It will state "under Section 73" or "under Section 74." This is the single most important line in the document.',
    },
    {
      number: '03',
      heading: 'YOUR DEADLINE AND WHAT HAPPENS IF YOU MISS IT',
      body: 'You have 30 days from the date of the DRC-01 notice to file your reply.\n\nIf you do not reply within 30 days, the GST officer is legally permitted to pass an ex-parte order, meaning they decide the case without hearing your side and issue a demand in Form DRC-07. Once DRC-07 is issued, you cannot reply to DRC-01 anymore. Your options then become filing an appeal (which costs more time and money) or paying the demand.\n\nIf you need more time, you can request an adjournment. This must be done before the deadline expires, not after. The officer has discretion to grant it.',
      note: 'The 30-day period starts from the date printed on the DRC-01 notice, not the date you received it. If your GSTIN portal shows the notice was uploaded 5 days ago, count backwards.',
    },
    {
      number: '04',
      heading: 'PAY BEFORE REPLYING: WHEN THIS IS THE RIGHT MOVE',
      body: 'If the case is under Section 73 and you agree the tax is due, paying the full demand plus interest within 30 days of the SCN means zero penalty. Section 73(8) is explicit: "no penalty shall be payable and all proceedings shall be deemed to be concluded." This is the cheapest and fastest resolution path if you accept the liability.\n\nIf the case is under Section 74 (fraud allegation), paying within 30 days of the SCN reduces the penalty from 100 percent to 15 percent. Do not pay under Section 74 without professional advice. If the fraud allegation itself can be challenged, your reply should challenge the Section 74 classification before you pay anything.',
      note: 'Partial payment is also an option. Pay what you agree with, state it clearly in your DRC-06 reply with challan details, and contest the rest.',
    },
    {
      number: '05',
      heading: 'WHAT YOUR REPLY (DRC-06) MUST CONTAIN',
      body: 'Your reply is filed in Form DRC-06 on the GST portal. A good reply is specific, documented, and addresses every point the notice raises.',
      bullets: [
        'Point-by-point response to each discrepancy or allegation in the notice',
        'Reconciliation statement showing how the numbers the department flagged are explained',
        'Supporting documents: GSTR-1, GSTR-3B, books of accounts, purchase invoices, bank statements, e-way bills',
        'Legal arguments citing relevant sections and case law if applicable',
        'If partially agreeing: pay the admitted tax, interest, and applicable penalty immediately and state this in the reply',
        'If under Section 74: specifically address and counter the fraud allegation',
      ],
    },
    {
      number: '06',
      heading: 'WHAT HAPPENS AT THE PERSONAL HEARING',
      body: 'After you file DRC-06, the officer will grant you a personal hearing. Do not skip this. The personal hearing is your opportunity to present your case verbally, clarify anything in your written reply, and understand exactly what the officer is thinking.\n\nYou or your authorised representative (CA or advocate) can appear. In most cases, send a professional. Bring physical copies of all documents you submitted with your reply. Take notes during the hearing. If the officer raises new points, ask for them in writing.\n\nThe officer cannot make a final order on the spot. There is a mandated speaking period. If you are not satisfied with the hearing outcome, you can still appeal after DRC-07 is issued.',
    },
    {
      number: '07',
      heading: 'THE MOST COMMON MISTAKES',
      body: '',
      bullets: [
        'Ignoring the notice completely: The officer will pass an ex-parte order and the demand becomes very hard to fight without an appeal',
        'Filing a vague reply without documents: "The discrepancy is due to accounting differences" without a reconciliation statement is not a reply',
        'Paying the full demand without checking it: Sometimes the demand calculation itself has errors',
        'Admitting to fraud when you did not commit fraud: Challenge the Section 74 classification if the notice is under that section and you believe the case is genuinely a bookkeeping error',
        'Missing the deadline because you were gathering documents: Start immediately. If you need more time, file an adjournment request before the deadline',
        'Not tracking the notice on the GST portal: DRC-01 is served electronically. If your registered mobile or email is outdated, the 30-day clock has already started',
      ],
    },
    {
      number: '08',
      heading: 'AFTER THE DRC-01: WHAT COMES NEXT',
      body: 'One of three things will happen after your reply and hearing.\n\nDRC-05 (Conclusion of proceedings): The officer is satisfied with your reply. The proceedings are dropped. This is the outcome you are aiming for.\n\nDRC-07 (Order for demand): The officer partially or fully confirms the demand. You can pay (with appeal rights preserved) or appeal to the Appellate Authority within 3 months.\n\nFurther enquiry: The officer asks for additional documents before deciding. This can happen multiple times.',
      note: 'If DRC-07 is passed against you, the appeal must be filed to the First Appellate Authority (Joint or Additional Commissioner) within 3 months. A pre-deposit of 10 percent of disputed tax is required for the appeal to be admitted.',
    },
  ],

  faqs: [
    {
      q: 'I received DRC-01 for a GST period from 3 years ago. Is it too late for them to issue this?',
      a: 'Not necessarily. For Section 73 (non-fraud) cases, the notice must be issued within 3 years from the due date of the annual return for the relevant year. For Section 74 (fraud), the limit is 5 years. If the notice is genuinely time-barred, this is a strong legal ground for your reply. A CA can check the dates precisely.',
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
      a: 'Not necessarily. The DRC-01 shows the amount the department is claiming. After your reply, hearing, and the officer\'s consideration, the final order (DRC-07) may be for a different amount. The DRC-01 figure is the starting point, not a settled debt.',
    },
    {
      q: 'I missed the 30-day deadline. What are my options now?',
      a: 'If DRC-07 has already been passed, you can file an appeal to the Appellate Authority within 3 months of the order date with a 10 percent pre-deposit of the disputed tax. If DRC-07 has not yet been passed, speak to a CA immediately. There may still be an opportunity to request that the officer hear your submission before passing the order.',
    },
  ],

  sources: [
    {
      name: 'CGST Act, 2017 (Section 73 and 74)',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Primary legislation governing GST demand and recovery proceedings',
    },
    {
      name: 'CGST Rules, 2017 (Rule 142)',
      url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf',
      description: 'Rules for service of show cause notice and reply procedure',
    },
  ],
}


// ─── 2. GST DRC-01A ──────────────────────────────────────────────────────────

export const gstDrc01aUpdates = {
  slug: 'gst-drc-01a-pre-notice',
  seoTitle: 'GST DRC-01A Notice: What It Is and How to Respond (2025) | Ollvy',
  seoDescription: 'A DRC-01A is a pre-demand intimation, not a formal notice. Respond well here and the matter may close without a DRC-01 ever being issued. You have 30 days.',

  sections: [
    {
      number: '01',
      heading: 'THIS IS NOT A DEMAND YET',
      body: 'DRC-01A is a pre-notice intimation introduced to give taxpayers an opportunity to engage with the department before formal demand proceedings begin.\n\nThe GST officer has done the calculation and determined that you owe tax. Before issuing the formal DRC-01 Show Cause Notice, they are required to first send you DRC-01A, essentially saying: "We think you owe Rs. X. Here is what we found. Tell us if we are wrong, or pay up."\n\nThis informal stage is genuinely valuable. Use it.',
      note: 'Source: Rule 142(1A), CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'YOUR TWO OPTIONS IN RESPONSE',
      body: 'Option A: Pay the ascertained amount. If you review the notice and agree that the tax is due, pay it along with applicable interest through DRC-03 (voluntary payment challan). Paying at the DRC-01A stage carries significantly lower penalties than paying after DRC-01.\n\nOption B: File a representation. If you believe the amount is wrong (partially or fully), file a written representation in DRC-01A Part B explaining your position with supporting documents. If the officer agrees with your representation, the matter can be closed without issuing DRC-01.',
      note: 'The penalty difference at this stage is significant. Under Section 73 (non-fraud): paying during DRC-01A = nil penalty. Paying during DRC-01 stage = 10 percent penalty. Paying after DRC-07 demand order = 10 to 15 percent penalty. Under Section 74 (fraud): penalties are 100 percent at DRC-01 stage, so the relative benefit of early payment is even larger.',
    },
    {
      number: '03',
      heading: 'WHAT HAPPENS IF YOU IGNORE DRC-01A',
      body: 'DRC-01A is informal. There is no statutory consequence just for not responding. However, the officer will proceed to issue the formal DRC-01 Show Cause Notice. At that stage, penalties apply. The matter becomes part of your formal litigation record. You also lose the goodwill of early engagement, which sometimes influences how officers treat borderline cases.',
    },
    {
      number: '04',
      heading: 'HOW TO WRITE A STRONG REPRESENTATION',
      body: 'If you are challenging the department\'s calculation at DRC-01A stage, your representation should be in writing and addressed to the officer who signed the notice.',
      bullets: [
        'Specifically identify each component of the ascertained amount you agree with and each you dispute',
        'Provide a reconciliation for every disputed component, not just a general statement',
        'Attach supporting documents: returns, invoices, bank statements, credit notes',
        'State clearly the amount you are paying voluntarily and provide the DRC-03 challan details',
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
      a: 'DRC-01A is not a negotiation. It is the officer\'s calculation based on available data. You can challenge it with your own reconciliation and documents in your Part B representation. If the officer accepts your data, the amount is revised. If not, DRC-01 is issued for the original amount.',
    },
  ],

  sources: [
    {
      name: 'CGST Rules, 2017 (Rule 142(1A))',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Rule governing pre-notice intimation before formal show cause notice',
    },
    {
      name: 'CGST Act, 2017 (Section 73)',
      url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf',
      description: 'Penalty provisions applicable at different stages of demand proceedings',
    },
  ],
}


// ─── 3. GST DRC-01B ──────────────────────────────────────────────────────────

export const gstDrc01bUpdates = {
  slug: 'gst-drc-01b-mismatch',
  seoTitle: 'GST DRC-01B Notice: GSTR-1 vs 3B Mismatch - How to Fix (2025) | Ollvy',
  seoDescription: 'A DRC-01B notice means the GST system found a mismatch between your GSTR-1 and GSTR-3B. You have 7 days to explain or pay the difference before it escalates to a formal DRC-01 demand.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS DRC-01B AND WHY DOES IT EXIST',
      body: 'From 2022-23 onwards, the GST system automatically compares your GSTR-1 (invoice-level outward supply details) with your GSTR-3B (self-assessed tax payment summary) for every month. If the taxable value or tax liability in GSTR-3B is less than what you declared in GSTR-1, the system automatically generates a DRC-01B intimation.\n\nThis is a system-generated notice. No human officer has specifically reviewed your case. But it still demands a response and carries real consequences if ignored.',
      note: 'Source: Rule 88C, CGST Rules 2017, inserted by Notification 26/2022-CT dated 26.12.2022.',
    },
    {
      number: '02',
      heading: 'THE MOST COMMON REASONS FOR A DRC-01B',
      body: 'The mismatch is almost always one of these situations.',
      bullets: [
        'Tax paid through DRC-03: You paid voluntarily through DRC-03 but the GSTR-3B still reflects the original lower figure. This is legitimate but needs to be declared in DRC-01B Part B',
        'Timing difference: Invoices raised in GSTR-1 for advance received but actual tax paid in the next month\'s GSTR-3B. Common in construction and real estate',
        'Credit notes issued: Credit notes in a later period reduced your actual liability from what GSTR-1 showed for the current period',
        'Amendment in GSTR-1: Invoices amended in a subsequent month but the original period\'s comparison is being flagged',
        'Genuine underpayment: A mistake in GSTR-3B where you actually paid less tax than required',
        'Nil-rated or exempted supplies declared in GSTR-1 but not in GSTR-3B',
      ],
    },
    {
      number: '03',
      heading: 'THE TWO-PART RESPONSE STRUCTURE',
      body: 'DRC-01B Part A is the intimation the system sends you. It shows the specific period, the GSTR-1 declared liability, the GSTR-3B declared liability, and the difference.\n\nDRC-01B Part B is where you reply. You must file Part B within 7 days of the Part A intimation.\n\nIn Part B, you select one of two responses: (a) "The difference is due to the following reasons" where you explain with specific details, or (b) "I am making payment of the difference" where you pay the shortfall.\n\nIf you select the explanation route, provide specific transaction details. Vague reasons are not sufficient.',
    },
    {
      number: '04',
      heading: 'WHAT HAPPENS AFTER YOUR PART B RESPONSE',
      body: 'If your explanation is accepted, the matter closes here with no further action.\n\nIf your explanation is not accepted or you do not respond, the system or officer can initiate proceedings under Section 73 or 74 and issue a DRC-01. At that stage, the mismatch becomes a formal demand with penalties.\n\nIf you pay the shortfall, Part B is closed with the payment challan number.\n\nIf the same mismatch recurs across multiple months, the officer may decide to initiate a comprehensive scrutiny rather than handling them individually.',
      note: 'A DRC-01B is significantly easier and cheaper to resolve than a DRC-01. The incentive to resolve it here is strong.',
    },
    {
      number: '05',
      heading: 'HOW TO PREVENT DRC-01B NOTICES IN FUTURE',
      body: 'DRC-01B is a system check that runs automatically every month. Preventing it is straightforward if you reconcile before filing GSTR-3B.\n\nBefore filing GSTR-3B each month: verify that the taxable value and tax in your GSTR-3B matches what you declared in GSTR-1 for the same period. If there is a difference due to DRC-03 payment, credit notes, or timing, note it now rather than waiting for the system to flag it.\n\nIf you made a voluntary payment through DRC-03 for a prior period, always declare it in the next GSTR-3B filing so the portal can match it correctly.',
    },
    {
      number: '06',
      heading: 'HOW TO PREPARE YOUR PART B RESPONSE',
      body: 'A proper Part B response should include a clear statement of the reason for the mismatch with the specific transaction or period it relates to.',
      bullets: [
        'DRC-03 challan details if the difference was paid voluntarily in a different period',
        'A reconciliation table showing GSTR-1 declared value, credit notes issued, amendments, advances adjusted, and the net taxable value matching GSTR-3B',
        'Copies of relevant invoices, credit notes, or amendment records as supporting documents',
        'If there was a genuine error: payment of shortfall with interest under Section 50 (18 percent per annum from the original due date)',
      ],
    },
  ],

  faqs: [
    {
      q: 'I received DRC-01B for a mismatch but I already paid the difference via DRC-03 voluntarily. What do I do?',
      a: 'In your Part B response, select the explanation option, state that the difference was paid voluntarily through DRC-03, and provide the DRC-03 challan number and date. The system will verify this and close the matter.',
    },
    {
      q: 'The DRC-01B mismatch is just Rs. 500. Is it worth worrying about?',
      a: 'Yes. The amount does not determine whether the notice escalates. A non-response to DRC-01B can initiate formal DRC-01 proceedings regardless of the amount. Respond to every DRC-01B.',
    },
    {
      q: 'I received DRC-01B notices for 6 different months simultaneously. Do I respond to each separately?',
      a: 'Yes, each DRC-01B is for a specific month and must be responded to individually in its own Part B. The reasons may be the same across months, in which case your responses will be similar, but each Part B must be filed.',
    },
  ],

  sources: [
    {
      name: 'CGST Rules, 2017 (Rule 88C)',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Rule governing GSTR-1 and GSTR-3B liability mismatch intimation',
    },
    {
      name: 'Notification 26/2022-Central Tax',
      url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf',
      description: 'Notification inserting Rule 88C into the CGST Rules',
    },
  ],
}


// ─── 4. GST ASMT-10 ──────────────────────────────────────────────────────────

export const gstAsmt10Updates = {
  slug: 'gst-asmt-10-notice',
  seoTitle: 'GST ASMT-10 Notice: How to Reply and What It Means (2025) | Ollvy',
  seoDescription: 'A GST ASMT-10 notice means an officer found a discrepancy in your returns. You have 15 days to reply in Form ASMT-11. No reply leads to a best judgment assessment under Section 62.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS ASMT-10 AND WHY DID YOU GET IT',
      body: 'An ASMT-10 notice is a scrutiny notice issued under Section 61 of the CGST Act. It means a GST officer has reviewed your filed GST returns and found something that does not add up. They are not accusing you of fraud, not yet. They are asking you to explain the discrepancy before deciding what to do next.\n\nThe operative word is "yet." If your reply is poor or missing, ASMT-10 escalates.',
      note: 'Source: Section 61, Central Goods and Services Tax Act, 2017. Rule 99, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'WHAT DISCREPANCIES TYPICALLY TRIGGER AN ASMT-10',
      body: 'The GST system runs automated checks and flags returns where numbers do not reconcile. The most common triggers are listed below.',
      bullets: [
        'GSTR-1 vs GSTR-3B mismatch: Outward supplies declared in GSTR-1 differ from GSTR-3B. Even legitimate timing differences can trigger this',
        'ITC mismatch: ITC claimed in GSTR-3B exceeds what your suppliers declared in their GSTR-1, making it unavailable in GSTR-2B',
        'Turnover discrepancy: Turnover in GST returns does not match Income Tax returns, financial statements, or other data sources the department holds',
        'Tax rate discrepancy: You applied a tax rate the officer believes is incorrect for that HSN or SAC code',
        'Reverse charge non-payment: Purchases from unregistered dealers or imported services without paying applicable reverse charge GST',
        'E-way bill vs return mismatch: E-way bills generated do not correspond to the supply values declared in returns',
      ],
    },
    {
      number: '03',
      heading: 'YOUR DEADLINE AND WHAT HAPPENS NEXT',
      body: 'You have 15 days from the date of the ASMT-10 notice to file your reply in Form ASMT-11 on the GST portal.\n\nIf you need more time, you can request an extension before the 15 days expire. Extension requests are generally considered reasonable if submitted promptly with a genuine reason.\n\nThe outcome depends on your reply.\n\nYou reply and the officer is satisfied: The officer issues ASMT-12 (acceptance of reply) and closes the matter.\n\nYou reply but the officer is not fully satisfied: The officer may ask follow-up questions or proceed to initiate a formal audit under Section 65 or 66.\n\nYou do not reply within 15 days: The officer is empowered to proceed with assessment under Section 62 (Best Judgment Assessment), where the officer determines your tax liability based on whatever information they have, without your input.',
      note: 'The risk of ignoring ASMT-10 cannot be overstated. Section 62 allows the officer to assess you arbitrarily. You can appeal later but that is expensive and time-consuming.',
    },
    {
      number: '04',
      heading: 'HOW TO WRITE A STRONG ASMT-11 REPLY',
      body: 'Your reply in ASMT-11 is your one chance to close this at the lowest level. A strong reply does the following.',
      bullets: [
        'Addresses each discrepancy specifically by the line item or period the notice mentions',
        'Provides a reconciliation statement: for a GSTR-1 vs 3B mismatch, a table showing exactly which invoices account for the difference',
        'Attaches supporting documents: GSTR returns, financial statements, purchase invoices, bank statements, contracts',
        'Acknowledges errors if there are any: explain how it happened and show the correct position, then offer to pay any tax due with interest',
        'States the legal position clearly: if your position is that no tax is due, cite the relevant exemption, rate, or provision',
        'Is professionally drafted: a CA-authored reply with proper citations carries more weight than a self-drafted one',
      ],
      note: 'If there is tax genuinely due, consider paying it voluntarily before the reply. Voluntary payment during ASMT-10 demonstrates good faith and is often treated more favourably by the officer.',
    },
    {
      number: '05',
      heading: 'WHAT VOLUNTARY PAYMENT AT ASMT-10 STAGE SAVES YOU',
      body: 'If you agree that some or all of the discrepancy represents genuine underpaid tax, paying it voluntarily through DRC-03 before or alongside your ASMT-11 reply has real financial advantages.\n\nAt the ASMT-10 stage, before formal demand proceedings begin, there is no mandatory penalty. If the matter progresses to DRC-01A and you pay there, the same applies for non-fraud cases. Once DRC-01 is issued, a minimum 10 percent penalty applies under Section 73.\n\nPaying early also demonstrates compliance intent, which influences how officers approach your case at every subsequent stage.',
    },
    {
      number: '06',
      heading: 'THE ASMT-10 TO DRC-01 ESCALATION PATH',
      body: 'Understanding the full escalation path shows you what you are trying to prevent.\n\nASMT-10 (scrutiny notice): Officer flags a discrepancy. This is where you are now.\nASMT-12 (acceptance): If your reply is good, this is where it ends.\nSection 65 or 66 audit: Officer decides a formal audit is needed. Your premises can be visited, records can be inspected.\nDRC-01A (pre-SCN intimation): Officer has determined a tax demand and gives you one more informal opportunity.\nDRC-01 (show cause notice): Formal demand. You have 30 days to reply.\nDRC-07 (demand order): Final demand with penalty and interest.\n\nThe earlier you engage seriously in this chain, the better the outcome.',
    },
    {
      number: '07',
      heading: 'MISTAKES THAT TURN A MINOR QUERY INTO A MAJOR DEMAND',
      body: '',
      bullets: [
        'Treating ASMT-10 as optional: Non-reply leads to Best Judgment Assessment',
        'Generic replies without reconciliation: Saying the discrepancy is due to different accounting treatment without a table showing actual numbers is not a reply',
        'Not attaching documents: The officer needs evidence',
        'Acknowledging more than what is asked: Only address what the notice specifically asks about',
        'Ignoring the notice because the amount seems small: Officers use ASMT-10 responses to determine whether to escalate',
      ],
    },
  ],

  faqs: [
    {
      q: 'My ASMT-10 is about a GSTR-1 vs GSTR-3B mismatch but the difference is only because I filed an amendment. How do I explain this?',
      a: 'In your ASMT-11 reply, provide a reconciliation showing the original GSTR-1 value, the amendment filed in which period, the net impact, and how the final GSTR-3B number reflects the correct position. Attach the amendment filings and the original returns.',
    },
    {
      q: 'I received ASMT-10 for a period where I had genuine ITC mismatches because my suppliers were non-compliant. What do I do?',
      a: 'Show your purchase invoices and GSTR-2B side by side. Demonstrate that you followed up with suppliers and have evidence of receipt of goods or services. The legal argument is evolving through court decisions. A CA can advise on the strongest current position.',
    },
    {
      q: 'I am receiving ASMT-10 notices for multiple years at the same time. Where do I start?',
      a: 'Start with the earliest year, as its resolution often informs the methodology for later years. If the same issue appears across multiple years, one well-argued reply can serve as the template for all. Handling them together with professional help is more efficient.',
    },
    {
      q: 'The ASMT-10 notice says the discrepancy is Rs. 12 lakh. Will I have to pay all of this?',
      a: 'Not necessarily. The Rs. 12 lakh is the discrepancy flagged, not the final tax due. After your reply and reconciliation, the officer may accept your explanation fully, partially, or not at all. What you eventually owe depends entirely on the quality of your reply.',
    },
  ],

  sources: [
    {
      name: 'CGST Act, 2017 (Section 61)',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Scrutiny of returns provision under which ASMT-10 is issued',
    },
    {
      name: 'CGST Rules, 2017 (Rule 99)',
      url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf',
      description: 'Procedure for scrutiny of returns and reply in Form ASMT-11',
    },
  ],
}


// ─── 5. GST ASMT-14 ──────────────────────────────────────────────────────────

export const gstAsmt14Updates = {
  slug: 'gst-asmt-14-best-judgment',
  seoTitle: 'GST ASMT-14 Notice: Best Judgment Assessment Explained (2025) | Ollvy',
  seoDescription: 'A GST ASMT-14 is a best judgment assessment issued when ASMT-10 was not replied to. Filing all pending returns within 30 days withdraws the assessment under Section 62(2).',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS ASMT-14 AND HOW DID YOU GET HERE',
      body: 'If you are reading this, it is likely because an earlier ASMT-10 scrutiny notice was either not replied to or the reply was not accepted by the officer.\n\nASMT-14 is issued under Section 62 of the CGST Act (Assessment of Non-Filers). It is the GST officer\'s best judgment assessment: they have determined your GST liability using whatever information they had, without your input. The final assessment order follows in ASMT-15.\n\nIf you file all your pending returns within 30 days of receiving ASMT-14, the assessment order can be withdrawn. This is a one-time relief built into the law.',
      note: 'Source: Section 62, CGST Act 2017. Rule 100, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'YOUR OPTIONS NOW',
      body: 'Option 1: File pending returns within 30 days. If ASMT-14 was triggered by non-filing of returns, file all pending GSTR-3B returns within 30 days of the assessment order. Under Section 62(2), the assessment order is deemed to have been withdrawn upon filing of valid returns. Pay all tax, interest (18 percent per annum on late tax), and late fees.\n\nOption 2: File an appeal. If you believe the best judgment assessment amount is significantly overstated (which is common), you can appeal to the Appellate Authority under Section 107 within 3 months of the assessment order. A pre-deposit of 10 percent of disputed tax is required.\n\nOption 3: Do both. File pending returns to trigger Section 62(2) withdrawal and also file an appeal against the assessment for periods where penalties were imposed beyond just the tax.',
    },
    {
      number: '03',
      heading: 'WHY BEST JUDGMENT ASSESSMENTS ARE ALMOST ALWAYS OVERSTATED',
      body: 'When an officer does a best judgment assessment without your data, they use the most conservative assumptions available.\n\nTurnover is estimated based on bank credits, e-way bill data, and third-party information, without the benefit of your reconciliation. No Input Tax Credit is allowed in a best judgment assessment. Your entire tax liability is computed on a gross basis. Tax rates applied may be the higher applicable rate for your industry.\n\nThe ASMT-14 amount is almost always much higher than your actual liability.',
      note: 'This is exactly why filing pending returns even late within 30 days is often the most effective path. The Section 62(2) withdrawal resets the position to your actual filed numbers rather than the officer\'s estimates.',
    },
    {
      number: '04',
      heading: 'CALCULATING WHAT YOU OWE TO FILE RETURNS AND CLOSE THIS',
      body: 'To file pending returns and trigger Section 62(2) withdrawal, you need to pay:\n\nPending tax: the actual GST liability for each unfiled period based on your outward supplies and eligible ITC.\n\nInterest under Section 50: 18 percent per annum from the original due date of each return to the date of actual payment. This is calculated separately for each month.\n\nLate fees: for GSTR-3B, the late fee is Rs. 50 per day for returns with a tax liability (Rs. 25 CGST plus Rs. 25 SGST), capped at Rs. 10,000 per return. For nil returns, it is Rs. 20 per day, capped at Rs. 500.\n\nGet a CA to calculate the exact amount before filing so there are no surprises.',
    },
  ],

  faqs: [
    {
      q: 'I received ASMT-14 but I had actually replied to ASMT-10. What happened?',
      a: 'Check your GST portal for the ASMT-11 (your reply) and ASMT-12 (officer\'s response to your reply). If the officer issued ASMT-14 without acknowledging your reply, this is grounds to challenge the ASMT-14 in appeal.',
    },
    {
      q: 'The ASMT-14 shows Rs. 22 lakh as my GST liability. My actual liability should be around Rs. 3 lakh. Should I file returns or appeal?',
      a: 'File returns first within 30 days to trigger the Section 62(2) withdrawal. This brings the dispute down to your actual liability. If there are still disputes after filing (interest, penalty, or specific disallowances), deal with those through the officer or appeal. The Section 62(2) route is almost always cheaper and faster than a full appeal.',
    },
    {
      q: 'The 30-day window has passed. What are my options now?',
      a: 'You can still file the pending returns but the Section 62(2) automatic withdrawal no longer applies. You must appeal the ASMT-14 order to the Appellate Authority within 3 months of the assessment order. Pay 10 percent of the disputed tax as pre-deposit. File the pending returns simultaneously to show compliance intent.',
    },
  ],

  sources: [
    {
      name: 'CGST Act, 2017 (Section 62)',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Best judgment assessment of non-filers and withdrawal provision under Section 62(2)',
    },
    {
      name: 'CGST Rules, 2017 (Rule 100)',
      url: 'https://tutorial.gst.gov.in/downloads/news/cgst_act_updated_till_jan_2024.pdf',
      description: 'Procedure for best judgment assessment under Section 62',
    },
  ],
}
