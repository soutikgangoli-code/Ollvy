// ollvy-notice-pages.js
// 24 Tax / Compliance Notice pages for Ollvy
// Written from the perspective of an in-house CA explaining the situation to a stressed SME owner
// Each page: what happened, how serious, exact deadline, what a reply needs, what mistakes to avoid
// evaluatorLogic fields are prose - implement as JS functions in Claude Code

export const noticePages = [

  // ============================================================
  // BATCH 1: HIGHEST TRAFFIC + HIGHEST CONVERSION
  // ============================================================

  {
    slug: 'gst-drc-01-notice',
    title: 'GST DRC-01 Notice: What It Means and What to Do',
    seoTitle: 'GST DRC-01 Notice: What It Is and How to Reply (2025) | Ollvy',
    seoDescription: 'Got a GST DRC-01 notice? Understand what it means, why you got it, your exact deadline, and how to reply correctly. Expert CA guidance from Ollvy.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'urgent',
    deadline: '30 days from date of notice',
    deadlineNote: 'Missing this deadline results in an ex-parte demand order against you. The department will pass an order without hearing your side.',

    sections: [
      {
        number: '01',
        heading: 'FIRST, TAKE A BREATH - THEN READ THIS CAREFULLY',
        body: 'A DRC-01 notice is a Summary of the Show Cause Notice. In plain English: the GST department believes you owe them tax - and they are now formally putting that demand in writing and asking you to explain yourself or pay up.\n\nThis is serious. But it is not the end. A DRC-01 is the department\'s opening move, not their final word. You have a right to reply, a right to be heard, and if your case is strong, the demand can be reduced or dropped entirely.\n\nWhat you must not do is ignore it.',
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
        body: 'You have 30 days from the date of the DRC-01 notice to file your reply.\n\nIf you do not reply within 30 days, the GST officer is legally permitted to pass an ex-parte order - meaning they will decide the case without hearing your side and issue a demand in Form DRC-07. Once DRC-07 is issued, you cannot reply to DRC-01 anymore. Your options then become filing an appeal (which costs more time and money) or paying the demand.\n\nIf you need more time, you can request an adjournment - but this must be done before the deadline expires, not after. The officer has discretion to grant it.',
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
        number: '06',
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
        number: '07',
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
        a: 'Not necessarily. The DRC-01 shows the amount the department is claiming. After your reply, hearing, and the officer\'s consideration, the final order (DRC-07) may be for a different amount - lower if your arguments are accepted, or the same if they are not. The DRC-01 figure is the starting point for negotiation, not a settled debt.',
      },
      {
        q: 'I missed the 30-day deadline. What are my options now?',
        a: 'If DRC-07 has already been passed, you can file an appeal to the Appellate Authority within 3 months of the order date with a 10% pre-deposit of the disputed tax. If DRC-07 has not yet been passed (the officer has not yet issued the order), speak to a CA immediately - there may still be an opportunity to request that the officer hear your submission before passing the order, though this is at the officer\'s discretion.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help with My DRC-01 Reply', href: '/checkout/gst-notice-reply' },
      secondary: { label: 'Understand GST Penalty Amounts', href: '/tools/penalty-calculator/gst' },
    },

    relatedNotices: ['gst-drc-01a-notice', 'gst-asmt-10-notice', 'gst-drc-01b-mismatch'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'income-tax-143-1-intimation',
    title: 'Income Tax Section 143(1) Intimation: What It Means',
    seoTitle: 'Income Tax 143(1) Intimation Notice 2025: What to Do | Ollvy',
    seoDescription: 'Got an Income Tax 143(1) intimation? It is not always a demand - but sometimes it is. Understand what the CPC is telling you and how to respond correctly.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'serious',
    deadline: '30 days to pay demand (if a demand is raised)',
    deadlineNote: 'If the intimation shows an amount payable, you have 30 days to pay before interest starts accumulating.',

    sections: [
      {
        number: '01',
        heading: 'THIS IS THE MOST COMMON INCOME TAX COMMUNICATION - HERE IS WHAT IT MEANS',
        body: 'Almost everyone who files an ITR gets a Section 143(1) intimation eventually. It is generated automatically by the Centralised Processing Centre (CPC) in Bengaluru after your return is processed - not by a human tax officer looking at your specific case.\n\nThe intimation is the CPC\'s way of telling you: "We processed your return. Here is what we computed. Here is where it differs from what you filed."\n\nThree things can happen in a 143(1) intimation:',
        bullets: [
          'A demand is raised: The CPC found something that increases your tax liability and is asking you to pay the difference. This requires action.',
          'A refund is determined: The CPC agrees you overpaid and is initiating your refund. Good news - no action needed.',
          'No demand, no refund: The CPC processing agrees with your filed return exactly. Just acknowledge it. No action needed.',
        ],
        note: 'Source: Section 143(1), Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'WHY THE CPC RAISES A DEMAND IN 143(1)',
        body: 'The CPC processes your return through an automated system that checks for specific things. A demand is raised when the system finds one of these:',
        bullets: [
          'Arithmetical error: Your computation has a mathematical mistake - additions, subtractions, deduction limits applied wrongly.',
          'Incorrect claim: You claimed a deduction or exemption that is not allowed on the face of the return - for example, 80C deduction claimed above the Rs. 1.5 lakh limit.',
          'Disallowance of loss set-off: You tried to set off a loss from one head against income from another where the law does not permit it.',
          'TDS mismatch: The TDS you claimed in your return does not match what is actually reflected in your Form 26AS or AIS. If your employer or deductor has not filed their TDS return correctly, this creates a mismatch that shows up against you.',
          'Tax, interest, or fee not paid: The system calculates that advance tax, self-assessment tax, interest under 234A/234B/234C, or late fees under 234F were short-paid or not paid.',
          'Deduction denied under audit: For business returns, certain deductions require an audit report to be filed. If the report is missing or not filed in time, the deduction is denied.',
        ],
        note: 'The 143(1) intimation does NOT cover issues that require subjective judgment - valuation of assets, arm\'s length pricing, or interpretation of contracts. Those trigger a 143(2) scrutiny notice, which is a separate and more serious process.',
      },
      {
        number: '03',
        heading: 'YOUR DEADLINE AND OPTIONS',
        body: 'If the intimation raises a demand, you have 30 days from the date of the intimation to respond. You have three options:',
        bullets: [
          'Pay the demand: If you review it and agree it is correct, pay it through the income tax portal using Challan 280. Interest under Section 220(2) at 1% per month starts if you do not pay within 30 days.',
          'File a rectification request under Section 154: If you believe the demand is wrong because of an error in the processing (TDS mismatch, arithmetic error, etc.), you can file a rectification request online. This asks the CPC to reprocess the return after correcting the mistake.',
          'File a response to outstanding demand: On the income tax portal, you can formally respond to the demand and either agree, disagree, or partially agree. This is important because the department can otherwise adjust future refunds against the demand.',
        ],
        note: 'The 143(1) intimation is valid for 3 years from the end of the financial year in which the return was filed. Demands that sit unaddressed for long periods will be recovered aggressively.',
      },
      {
        number: '04',
        heading: 'THE TDS MISMATCH PROBLEM - BY FAR THE MOST COMMON CAUSE',
        body: 'The most frequent reason people get a demand in 143(1) is a TDS mismatch. Here is how it typically plays out:\n\nYou claimed Rs. 25,000 as TDS deducted in your ITR. But Form 26AS or AIS shows only Rs. 18,000 credited against your PAN. The CPC raises a demand for the Rs. 7,000 difference.\n\nThis is often not your fault at all. The deductor (your employer, your client, your bank) may have filed their TDS return incorrectly, missed a quarter, or entered your PAN wrongly. But the demand still lands in your mailbox.\n\nWhat to do:',
        bullets: [
          'Download your Form 26AS and AIS from the income tax portal and compare them with what you filed in your return',
          'Identify exactly which TDS entries are missing from 26AS',
          'Contact the deductor (HR/finance department of your employer, or the party who deducted TDS from your payments) and ask them to file a correction in their TDS return',
          'Once they correct their return, 26AS will update and you can file a rectification request to get the demand dropped',
          'If the deductor refuses or cannot be reached, file a grievance on the income tax portal and also file the rectification with whatever documentary proof you have (TDS certificates, salary slips)',
        ],
        note: 'If the deductor has deducted TDS from you but not deposited it with the government, you still have a right to credit based on your TDS certificate. This requires a written complaint to the CPC with supporting evidence.',
      },
      {
        number: '05',
        heading: 'HOW TO FILE A RECTIFICATION UNDER SECTION 154',
        body: 'A rectification request is the right tool for most 143(1) demands. Here is what the process looks like:',
        bullets: [
          'Log in to the income tax portal (incometax.gov.in)',
          'Go to Services > Rectification > New Request',
          'Select the relevant assessment year and the type of error (TDS mismatch, tax credit mismatch, etc.)',
          'For a TDS-related rectification, upload the correct Form 16 or TDS certificates',
          'Submit and note the acknowledgement number',
          'The CPC typically processes rectifications within 30-90 days and issues a fresh 143(1) intimation',
        ],
        note: 'A rectification request can only address errors that are apparent on the face of the record - not new claims or revised deductions. If you want to claim something additional, you need a revised return (if within the deadline) or respond via the appeal route.',
      },
      {
        number: '06',
        heading: 'WHAT THE MOST COMMON MISTAKES LOOK LIKE',
        body: '',
        bullets: [
          'Ignoring the intimation: Even if you think it is wrong, you must respond. An unaddressed demand gets recovered from future refunds without warning.',
          'Paying a demand that is clearly a TDS mismatch: If you can prove TDS was deducted, do not pay the demand - get the deductor to correct their return and then file a rectification.',
          'Confusing 143(1) with a scrutiny notice: These are very different things. 143(1) is automated processing. 143(2) is a human officer selecting your case. Do not panic about 143(1) the way you would about 143(2).',
          'Filing a revised return instead of a rectification: If there are no new facts to add and the error is purely in how the CPC processed your original return, a rectification (Section 154) is the right tool, not a revised return.',
        ],
      },
    ],

    faqs: [
      {
        q: 'I got a 143(1) intimation saying my return was processed with no demand and no refund. Do I need to do anything?',
        a: 'No action required. This just means the CPC agrees with your filed return. You can download this intimation and keep it for your records. It is essentially a clean bill of health for that year\'s return.',
      },
      {
        q: 'My 143(1) intimation shows a refund but I have not received the money. What is happening?',
        a: 'Check your bank account details on the income tax portal - even one digit wrong will bounce the refund. Also check if there are any outstanding demands from prior years. The department can adjust your refund against old demands without separate notice. If neither is the case, raise a refund reissuance request on the portal.',
      },
      {
        q: 'Can the income tax department scrutinise my return after issuing 143(1)?',
        a: 'Yes. A 143(1) intimation does not protect you from scrutiny. The department can still issue a 143(2) notice for the same return if your case is selected for scrutiny - but only within 3 months from the end of the financial year in which the return was filed.',
      },
      {
        q: 'The demand on my 143(1) is just Rs. 100. Should I still deal with it?',
        a: 'Technically yes - any unresolved demand sits on your record. But the department is unlikely to pursue recovery for tiny amounts. File a response on the portal disagreeing with the demand (or pay it if it is correct) to keep your record clean.',
      },
      {
        q: 'How do I get a copy of my 143(1) intimation if I deleted the email?',
        a: 'Log into incometax.gov.in, go to e-File > Income Tax Returns > View Filed Returns, select the relevant assessment year, and download the intimation from the "View Details" section.',
      },
    ],

    cta: {
      primary: { label: 'Get Help Responding to 143(1)', href: '/checkout/itr-notice-response' },
      secondary: { label: 'File a Rectification Under Section 154', href: '/checkout/itr-rectification' },
    },

    relatedNotices: ['income-tax-143-2-scrutiny', 'income-tax-148-148a-reopening', 'income-tax-245-refund-adjustment'],
    relatedTools: ['/tools/penalty-calculator/itr'],
  },

  // ============================================================

  {
    slug: 'gst-asmt-10-notice',
    title: 'GST ASMT-10 Scrutiny Notice: What It Means and How to Reply',
    seoTitle: 'GST ASMT-10 Notice: How to Reply and What It Means (2025) | Ollvy',
    seoDescription: 'Received a GST ASMT-10 scrutiny notice? Understand what discrepancy the department found, your reply deadline, and how to respond before it escalates.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'urgent',
    deadline: '15 days from date of notice (extendable on request)',
    deadlineNote: 'No response to ASMT-10 is one of the most common ways a minor GST query escalates into a full tax demand or audit. Do not let the deadline pass.',

    sections: [
      {
        number: '01',
        heading: 'WHAT IS ASMT-10 AND WHY DID YOU GET IT',
        body: 'An ASMT-10 notice is a scrutiny notice issued under Section 61 of the CGST Act. It means a GST officer has reviewed your filed GST returns and found something that does not add up. They are not accusing you of fraud - not yet. They are asking you to explain the discrepancy before deciding what to do next.\n\nThink of it as the officer flagging a specific issue and saying: "Your numbers don\'t match. Tell me why." The operative word is yet - if your reply is poor or missing, ASMT-10 escalates.',
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
        body: 'You have 15 days from the date of the ASMT-10 notice to file your reply in Form ASMT-11 on the GST portal.\n\nIf you need more time, you can request an extension before the 15 days expire. Extension requests are generally considered reasonable if submitted promptly with a genuine reason.\n\nHere is how the path forks based on your reply:',
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
          'Addresses each discrepancy specifically by the line item or period the notice mentions - do not give generic answers',
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
        number: '06',
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

    cta: {
      primary: { label: 'Get CA Help with My ASMT-10 Reply', href: '/checkout/gst-notice-reply' },
      secondary: { label: 'Understand GST Scrutiny Process', href: '/learn/do-i-need-gst-registration' },
    },

    relatedNotices: ['gst-drc-01-notice', 'gst-drc-01a-notice', 'gst-asmt-14-notice'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'income-tax-148-148a-reopening',
    title: 'Income Tax Section 148 / 148A Notice: Reopening of Assessment',
    seoTitle: 'Income Tax 148 / 148A Notice 2025: How to Respond | Ollvy',
    seoDescription: 'Received a Section 148 or 148A income tax notice? The department wants to reopen a past year\'s assessment. Understand your rights, deadlines, and how to fight it.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'urgent',
    deadline: '7 days minimum to reply to 148A SCN; 30 days to file return under 148',
    deadlineNote: 'Section 148A gives you the chance to stop the reopening before it begins. Missing the 148A deadline is one of the most costly mistakes in income tax disputes.',

    sections: [
      {
        number: '01',
        heading: 'THE DEPARTMENT WANTS TO REOPEN YOUR PAST TAX RETURN - HERE IS WHAT THAT MEANS',
        body: 'A Section 148 notice means the income tax department believes that income chargeable to tax has "escaped assessment" in a prior year - meaning they think you earned taxable income that was not taxed at the time. They want to reopen that year\'s assessment and potentially raise a fresh demand.\n\nSince the Finance Act 2021, there is now a mandatory prior step: Section 148A. Before issuing the actual 148 notice, the department must first issue a Section 148A show cause notice, give you a chance to reply, and then pass an order deciding whether reopening is justified. Only after that order can they issue the 148 notice.\n\nThis is actually in your favour. Section 148A is your chance to kill the reopening at the very beginning, before it becomes a full-blown reassessment.',
        note: 'Source: Sections 148, 148A, Income Tax Act, 1961, as amended by Finance Act 2021.',
      },
      {
        number: '02',
        heading: 'THE SECTION 148A PROCESS: YOUR FIRST AND BEST OPPORTUNITY',
        body: 'Here is exactly how Section 148A works:',
        bullets: [
          'Step 1 - 148A(a): The assessing officer conducts enquiry and gathers information (from banks, registrars, GST, third parties) suggesting income has escaped assessment. You are not involved at this stage.',
          'Step 2 - 148A(b): The officer issues a show cause notice to you with the information they have gathered. They give you a minimum of 7 days (extendable to 30 days on request) to reply.',
          'Step 3 - 148A(c): You reply with your explanation, documents, and arguments for why reopening is not justified.',
          'Step 4 - 148A(d): The officer passes an order. If they agree with you, the case is dropped. If not, they issue the formal Section 148 notice. This order must be approved by a Principal Commissioner or Commissioner if the escaped income is below Rs. 50 lakh for assessments more than 3 years old.',
        ],
        note: 'The 7-day minimum is the floor - officers frequently set longer deadlines. But if you receive a 7-day window, request an extension immediately.',
      },
      {
        number: '03',
        heading: 'HOW FAR BACK CAN THE DEPARTMENT GO',
        body: 'This question is critical and the answer changed significantly after the Finance Act 2021.',
        bullets: [
          'Up to 3 years: The department can reopen ANY assessment within 3 years from the end of the relevant assessment year, as long as they have "information" suggesting escaped income. The threshold for this is relatively low.',
          '3 to 5 years: Reopening is permitted only if the escaped income is Rs. 50 lakh or more (aggregate). The approval of a Principal Commissioner or above is required.',
          '5 to 10 years: Reopening is permitted only if the escaped income is Rs. 50 lakh or more AND the case involves specific serious categories: undisclosed foreign assets, discovered assets, specified false entries in accounts, etc. Again requires Principal Commissioner approval.',
          'Beyond 10 years: No reopening is possible under normal circumstances.',
          'IMPORTANT: If you receive a 148 notice for a year older than 3 years, verify the grounds very carefully. The law sets specific conditions for older reopenings and non-compliance with those conditions is a complete defence.',
        ],
        note: 'Source: Section 149, Income Tax Act, 1961, as amended by Finance Act 2021.',
      },
      {
        number: '04',
        heading: 'WHAT TRIGGERS A SECTION 148 / 148A NOTICE',
        body: 'Knowing what triggered your notice helps you frame your reply. Common triggers:',
        bullets: [
          'High-value transactions in your Annual Information Statement (AIS) that do not match your filed return: Property purchases or sales, large cash deposits, share transactions, mutual fund redemptions.',
          'Third-party information: Banks, registrars, stock exchanges, mutual funds, and other entities file Statements of Financial Transactions (SFT / Form 61A) with the income tax department. If a transaction in your name appears there but not in your return, you will get this notice.',
          'GST and income tax turnover mismatch: Your GST returns show significantly higher revenue than your income tax return.',
          'Foreign remittances: LRS transactions (foreign travel, education remittances, investments) flagged against your income profile.',
          'Search / survey information: Information obtained in a search at a third party\'s premises that implicates you.',
          'Tip-offs and intelligence: The department receives information from anonymous complaints, Benami transaction investigations, and other intelligence sources.',
        ],
      },
      {
        number: '05',
        heading: 'HOW TO REPLY TO A SECTION 148A NOTICE',
        body: 'Your 148A reply is a legal document and it should be treated as one. The goal is to demonstrate that either the income cited did not escape assessment (you did report it), or the information the department has is wrong, or it is not income at all.',
        bullets: [
          'Identify the specific information the department has: The 148A notice must contain the information or document they are relying on. Read it carefully. Do not guess what they know.',
          'Pull the original ITR for the relevant year: Check if the transaction or income they are citing was actually declared. If yes, point to it specifically in your reply with the schedule, amount, and how it was treated.',
          'Explain non-income transactions: If the "escaped income" is actually a loan repayment received, a gift, a capital receipt, or any other non-taxable inflow, document this with agreements, bank statements, and affidavits.',
          'Address the source of the information: If the department\'s information is based on a misread SFT filing (e.g., property purchase value vs your actual payment), explain and document the discrepancy.',
          'Challenge the legal basis if applicable: If the time limit for reopening has expired, or the required approvals are not mentioned, these are standalone legal grounds for dismissal.',
          'Attach a written submission rather than just an online response: For complex cases, a detailed written submission signed by a CA or advocate carries more weight.',
        ],
        note: 'The 148A reply is arguably the most important document in this entire proceeding. A strong reply at this stage can prevent a reassessment entirely.',
      },
      {
        number: '06',
        heading: 'IF 148A FAILS AND THE 148 NOTICE IS ISSUED',
        body: 'If the officer passes an adverse 148A(d) order and issues a Section 148 notice, here is what happens:',
        bullets: [
          'You will be asked to file a return for the relevant year within 30 days (extendable on request).',
          'The return you file will be treated as the return for that assessment year.',
          'You can file the same return you originally filed (if you stand by it) with a note that you are filing "without prejudice to your objections under Section 148A".',
          'The assessing officer then proceeds with the reassessment, can ask for documents, and passes an assessment order.',
          'You have the right to challenge both the 148A(d) order and the reassessment order in the High Court. Many 148A orders have been quashed by High Courts on the ground that the officer did not genuinely apply mind to the taxpayer\'s reply.',
        ],
        note: 'The Supreme Court has held that if the 148A process is not followed correctly, the subsequent 148 notice is invalid. This is a live area of litigation with taxpayer-friendly precedents.',
      },
    ],

    faqs: [
      {
        q: 'I received a Section 148 notice but not a 148A notice. Is that legal?',
        a: 'Post the Finance Act 2021 amendment (applicable to notices issued on or after April 1, 2021), a 148A show cause notice is mandatory before 148 can be issued. If you received 148 directly without 148A, this is a strong ground to challenge the notice. Challenge it immediately - do not ignore a potentially invalid notice.',
      },
      {
        q: 'The notice is for assessment year 2019-20. Can they still reopen that?',
        a: 'AY 2019-20 would be more than 3 years old. For reopening beyond 3 years, escaped income must be Rs. 50 lakh or more and the case must have Principal Commissioner approval. Check whether the notice mentions the approval and whether the escaped income cited meets the threshold. If not, these are legal grounds to challenge in your 148A reply.',
      },
      {
        q: 'The transaction they are questioning was a loan I received. How do I prove it is not income?',
        a: 'A loan received is not income. You need: a loan agreement (executed at or before the time of the loan, not backdated), bank statements showing the inward transfer and subsequent repayments, the lender\'s ITR or PAN showing the loan was from a legitimate source, and any interest payment records. If the lender is a relative or friend with no ITR, the case becomes harder - get professional help.',
      },
      {
        q: 'I filed my original ITR and the income was fully declared. Why am I still getting a 148A?',
        a: 'This happens. The department\'s system sometimes generates notices based on third-party data without cross-checking the original ITR. In your 148A reply, simply point to the exact line in your original ITR where the income appears. Attach your original ITR acknowledgement. Most cases like this close at the 148A stage.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help with 148A / 148 Reply', href: '/checkout/itr-notice-response' },
      secondary: { label: 'File Amended Return for Past Year', href: '/checkout/itr-filing' },
    },

    relatedNotices: ['income-tax-143-2-scrutiny', 'income-tax-142-1-notice', 'income-tax-ais-sft-notice'],
    relatedTools: ['/tools/penalty-calculator/itr'],
  },

  // ============================================================

  {
    slug: 'gst-drc-01b-mismatch',
    title: 'GST DRC-01B Notice: GSTR-1 vs GSTR-3B Liability Mismatch',
    seoTitle: 'GST DRC-01B Notice: GSTR-1 vs 3B Mismatch - How to Fix (2025) | Ollvy',
    seoDescription: 'Got a GST DRC-01B notice about GSTR-1 and GSTR-3B mismatch? Understand why it was generated, how serious it is, and what to do within 7 days.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'serious',
    deadline: '7 days from date of notice (Part B response)',
    deadlineNote: 'The 7-day window is short. If you miss it, the officer can initiate DRC-01 demand proceedings.',

    sections: [
      {
        number: '01',
        heading: 'WHAT IS DRC-01B AND WHY DOES IT EXIST',
        body: 'From 2022-23 onwards, the GST system automatically compares your GSTR-1 (invoice-level outward supply details) with your GSTR-3B (self-assessed tax payment summary) for every month. If the taxable value or tax liability in GSTR-3B is less than what you declared in GSTR-1, the system automatically generates a DRC-01B intimation.\n\nThis is a system-generated notice - no human officer has specifically reviewed your case. But it still demands a response and carries real consequences if ignored.',
        note: 'Source: Rule 88C, CGST Rules 2017, inserted by Notification 26/2022-CT dated 26.12.2022.',
      },
      {
        number: '02',
        heading: 'THE MOST COMMON REASONS FOR A DRC-01B',
        body: 'The mismatch is almost always one of these:',
        bullets: [
          'Tax paid through DRC-03: You realised you had underpaid tax in a prior period and made a voluntary payment through DRC-03 (voluntary tax payment challan) but the GSTR-3B still reflects the original lower figure. This is legitimate but needs to be declared in DRC-01B Part B.',
          'Timing difference: You raised invoices in GSTR-1 for advance received but the actual tax was paid in the next month\'s GSTR-3B. Common in construction and real estate.',
          'Credit notes issued: You issued credit notes in a later period that reduced your actual liability from what GSTR-1 showed for the current period. This is not always reflected correctly in the system comparison.',
          'Amendment in GSTR-1: You amended invoices in a subsequent month but the original period\'s comparison is being flagged.',
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
        number: '05',
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

    cta: {
      primary: { label: 'Get CA Help with DRC-01B Response', href: '/checkout/gst-notice-reply' },
      secondary: { label: 'Understand GSTR-1 and 3B Filing', href: '/checkout/gst-return-filing' },
    },

    relatedNotices: ['gst-drc-01-notice', 'gst-asmt-10-notice', 'gst-gstr2b-itc-mismatch'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'income-tax-245-refund-adjustment',
    title: 'Income Tax Section 245 Notice: Your Refund Has Been Adjusted',
    seoTitle: 'Income Tax Section 245 Notice: Refund Adjusted Against Demand | Ollvy',
    seoDescription: 'Got a Section 245 intimation saying your refund was adjusted against an old demand? Understand what demand is being set off, whether it is correct, and how to object.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'serious',
    deadline: '30 days to object to the proposed adjustment',
    deadlineNote: 'If you do not respond within 30 days, the adjustment is made automatically. Your refund is used to pay the demand whether you agree or not.',

    sections: [
      {
        number: '01',
        heading: 'YOU WERE EXPECTING A REFUND. INSTEAD YOU GOT THIS NOTICE.',
        body: 'Section 245 of the Income Tax Act allows the department to adjust (set off) your income tax refund against any outstanding tax demand - from any prior year - without going to court.\n\nBefore doing this, the law requires them to give you a notice under Section 245 and at least 30 days to respond. This is your window to either accept the adjustment (if the demand is correct) or object to it (if you dispute the demand or the demand has already been paid or appealed).',
        note: 'Source: Section 245, Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'THE MOST COMMON REASONS THIS HAPPENS',
        body: '',
        bullets: [
          'Old demand you forgot about: An outstanding demand from a prior assessment year that was never paid, appealed, or addressed. Demands can sit for years before the department triggers adjustment.',
          'Demand you thought was settled: You may have paid the demand but if the challan details were not correctly mapped to the demand in the system, it shows as outstanding.',
          'Demand you appealed: If you filed an appeal and the demand was not stayed, the department can still attempt adjustment. An appeal does not automatically stay a demand.',
          'Demand from 143(1) processing: You may have received a 143(1) intimation with a demand in a prior year, not responded to it, and the demand has accumulated with interest.',
          'Demand based on TDS mismatch: A prior year TDS mismatch demand that was never rectified.',
        ],
      },
      {
        number: '03',
        heading: 'WHAT TO DO IN THE NEXT 30 DAYS',
        body: 'Your first job is to identify the demand. The Section 245 notice will mention the assessment year and the demand amount being set off. Then:',
        bullets: [
          'Log in to the income tax portal and go to Pending Actions > Response to Outstanding Demand. You will see all demands against your PAN with details of the order that created them.',
          'Download the demand order (143(1) intimation, 143(3) assessment order, or whichever order created the demand) and review it.',
          'Determine if the demand is: (a) Correct and unpaid - in which case the adjustment is fair and you can agree, (b) Already paid but not mapped - in which case upload the challan proof and respond "Demand paid, challan details attached," (c) Being appealed - respond "Demand disputed, appeal filed, stay application submitted," (d) Wrong - a TDS mismatch, arithmetic error, or legally incorrect demand - file a rectification under Section 154 and simultaneously respond to the 245 notice.',
          'File your response on the portal within 30 days. Even a response of "disagree" preserves your position and buys you time to resolve the underlying demand.',
        ],
        note: 'If you are in a time crunch and cannot resolve the underlying demand within 30 days, at minimum file your response stating that you dispute the demand and will provide documentation. This protects you from the automatic adjustment.',
      },
      {
        number: '04',
        heading: 'WHAT HAPPENS IF YOU DO NOT RESPOND',
        body: 'If you do not respond within 30 days of the Section 245 notice, the department will proceed with the adjustment. This means:',
        bullets: [
          'Your refund (fully or partially) will be used to pay off the demand',
          'You will receive an intimation confirming the adjustment',
          'After adjustment, if there is a remaining demand balance, it continues to stay outstanding and accumulate interest',
          'If the refund is not enough to cover the demand, the remainder stays as an outstanding demand',
          'You can still challenge the underlying demand after adjustment, but getting the money back is harder once it is gone',
        ],
      },
      {
        number: '05',
        heading: 'HOW TO STAY AHEAD OF SECTION 245 IN FUTURE',
        body: 'Most Section 245 surprises are avoidable.',
        bullets: [
          'Respond to every 143(1) intimation, even small demands: An addressed demand is a resolved one. An ignored demand compounds over years.',
          'Check your outstanding demands on the portal before filing each year\'s return: Go to Pending Actions > Response to Outstanding Demand and clean up any open items.',
          'Map every tax payment to its corresponding demand: When you pay tax through Challan 280, the challan must be against the correct assessment year and demand type. Unlinked challans do not reduce outstanding demands.',
          'After filing an appeal, request a stay of demand: An appeal does not automatically stay recovery. You need a separate stay application.',
        ],
      },
    ],

    faqs: [
      {
        q: 'My Section 245 notice says the demand is Rs. 40,000 but I paid this 2 years ago. How do I prove it?',
        a: 'Find the Challan 280 payment receipt (downloadable from the TIN-NSDL portal using your PAN, assessment year, and challan details). Log in to the income tax portal, go to Response to Outstanding Demand, and select "Demand paid, challan details are as follows." Enter the BSR code, serial number, date, and amount from the challan. The system will verify and close the demand.',
      },
      {
        q: 'I appealed the demand. Can the department still adjust my refund?',
        a: 'Yes, unless you have a stay order. An appeal does not automatically prevent recovery or adjustment. You need to specifically apply for a stay of the demand with the Appellate Authority. If a stay is granted, file it as part of your Section 245 response.',
      },
      {
        q: 'My refund is Rs. 80,000 but the demand is only Rs. 20,000. Will they adjust the full refund?',
        a: 'No. The adjustment is limited to the demand amount (Rs. 20,000 in your example). The remaining Rs. 60,000 should be refunded to you after the adjustment - assuming there are no other outstanding demands.',
      },
      {
        q: 'I have Section 245 notices across multiple assessment years. How do I prioritise?',
        a: 'Start with the one where the refund being adjusted is largest - that is the most financially urgent. But address all of them. Outstanding demands from multiple years can compound interest simultaneously.',
      },
    ],

    cta: {
      primary: { label: 'Get Help Resolving Outstanding Demand', href: '/checkout/itr-notice-response' },
      secondary: { label: 'File Rectification Under Section 154', href: '/checkout/itr-rectification' },
    },

    relatedNotices: ['income-tax-143-1-intimation', 'income-tax-156-demand', 'income-tax-143-2-scrutiny'],
    relatedTools: ['/tools/penalty-calculator/itr'],
  },

  // ============================================================

  {
    slug: 'gst-reg-17-cancellation-notice',
    title: 'GST REG-17 Notice: Your GST Registration May Be Cancelled',
    seoTitle: 'GST REG-17 Cancellation Notice: How to Respond (2025) | Ollvy',
    seoDescription: 'Got a GST REG-17 show cause notice for cancellation? You have 7 days to respond or lose your GSTIN. Understand why it was issued and how to save your registration.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'urgent',
    deadline: '7 working days from date of notice',
    deadlineNote: 'This is the shortest deadline in the GST compliance calendar. Seven working days is not much time. Start today.',

    sections: [
      {
        number: '01',
        heading: 'YOUR GST REGISTRATION IS AT RISK. HERE IS WHAT IS HAPPENING.',
        body: 'REG-17 is a Show Cause Notice (SCN) for cancellation of your GST registration. It means the GST officer has grounds to believe your registration should be cancelled - and they are giving you one chance to explain why it should not be.\n\nYou have 7 working days to file your reply in Form REG-18 on the GST portal.\n\nIf you do not reply, the officer will issue REG-19 (cancellation order). Once your GSTIN is cancelled, you cannot charge GST on your invoices, you cannot claim Input Tax Credit, and your clients who are GST-registered businesses will face ITC rejection on your past invoices. The downstream damage is serious.',
        note: 'Source: Section 29(2), Central Goods and Services Tax Act, 2017. Rule 22, CGST Rules 2017.',
      },
      {
        number: '02',
        heading: 'WHY GST REGISTRATIONS GET CANCELLED (REG-17 GROUNDS)',
        body: 'The officer can issue REG-17 for any of these reasons:',
        bullets: [
          'Non-filing of returns: You have not filed GST returns for 6 or more consecutive months (or 2 tax periods for composition dealers). This is the most common trigger.',
          'Fraudulent registration: The registration was obtained using false information, fake documents, or a non-existent business.',
          'Business discontinued: Your business has been closed, sold, or transferred without applying for cancellation or transfer of registration.',
          'Constitution change: A partnership dissolved, a sole proprietor died, or a company was wound up without updating the GSTIN.',
          'Violation of anti-profiteering provisions: In rare cases.',
          'Registration obtained voluntarily but business not commenced within 6 months: Relevant for voluntary registrations.',
          'GSTIN found in databases of shell companies or fake invoice issuers: More common post-2022 as GSTIN verification has improved.',
        ],
      },
      {
        number: '03',
        heading: 'YOUR 7-DAY WINDOW: WHAT YOUR REPLY MUST DO',
        body: 'Your reply in REG-18 must specifically address the ground mentioned in the REG-17 notice.',
        bullets: [
          'For non-filing of returns: File all pending returns IMMEDIATELY before or alongside your reply. A reply saying "I will file shortly" is insufficient. The officer needs to see that the returns are filed before they will consider retaining your registration. Pay all tax, interest, and late fees.',
          'For fraudulent registration allegation: Present evidence that your business is genuine - rent agreement, bank account, stock photographs, client invoices, Udyam certificate, or any other proof of genuine business operations.',
          'For discontinued business: If the business continues under a different structure (new company, new partner), apply for fresh registration for the new entity and apply for cancellation of the old one rather than fighting REG-17.',
          'For PAN-level issues: If the notice is linked to your PAN appearing in a suspicious database, contact a CA immediately. This requires direct engagement with the department.',
          'Always include a personal appearance request: Request a personal hearing before any adverse order is passed. The law requires the officer to give you a hearing opportunity.',
        ],
        note: 'File your reply on the GST portal: Services > Registration > Application for Filing Clarification (REG-18). Attach all documents within the 7 working day window.',
      },
      {
        number: '04',
        heading: 'IF REG-19 IS ALREADY ISSUED: HOW TO REVOKE CANCELLATION',
        body: 'If you received REG-17, did not respond in time, and cancellation has already been ordered (REG-19), you are not completely without options. You can apply for revocation of cancellation.',
        bullets: [
          'For cancellations due to non-filing: File all pending returns first. Then apply for revocation of cancellation in Form REG-21 within 90 days of the cancellation order.',
          'The department has discretion to approve or reject revocation. If it is rejected, you can appeal to the Appellate Authority.',
          'IMPORTANT: The Supreme Court in November 2022 directed that businesses whose GST registrations were cancelled during COVID-related periods (non-filing due to COVID disruption) should be given a genuine opportunity for revocation. If your cancellation is from 2020-21, check whether any amnesty or relaxation applies.',
          'If revocation is not possible, you will need to apply for a fresh registration - which will require re-verification and may face additional scrutiny given the prior cancellation history.',
        ],
      },
      {
        number: '05',
        heading: 'THE BUSINESS IMPACT OF GSTIN CANCELLATION',
        body: 'This is why replying within 7 days matters so much.',
        bullets: [
          'You cannot issue tax invoices or collect GST from the date of cancellation',
          'Your customers cannot claim ITC on invoices you issued after suspension/cancellation',
          'If your GSTIN is reflected as "cancelled" on the GST portal, clients may retroactively question invoices you issued in the period before cancellation (especially if the portal shows "suspended" from an earlier date)',
          'Government tenders, e-commerce platforms, and many corporate procurement processes require an active GSTIN',
          'Banking and loan facilities tied to your GSTIN can be affected',
        ],
      },
    ],

    faqs: [
      {
        q: 'I have been filing returns but I still received REG-17 for non-filing. How is that possible?',
        a: 'A few things to check: (a) Were all your returns filed correctly and fully, or were some filed as nil returns when you had actual supplies? (b) Is there a system glitch showing your returns as unfiled despite being filed? Check the return filing status on the portal. If returns are filed, attach the filed return acknowledgements in your REG-18 reply.',
      },
      {
        q: 'My supplier received a REG-17 and their GSTIN may be cancelled. What does this mean for my ITC?',
        a: 'You may face ITC reversal for invoices from this supplier if their registration is cancelled retroactively. Monitor the situation. If their GSTIN is cancelled, your safest position is to demonstrate that you received the goods/services, paid for them, and the TDS/payment was made before the cancellation date. Keep all such documentation.',
      },
      {
        q: 'I received REG-17 but my business has genuinely closed. Should I fight it or let the cancellation happen?',
        a: 'If the business is genuinely closed, you should actually apply for voluntary cancellation (REG-16) yourself - do not let REG-17 cancel it. The difference matters: a self-cancelled registration shows responsible compliance behaviour; a forced cancellation under REG-17 creates a negative compliance record attached to your PAN.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help with REG-18 Reply', href: '/checkout/gst-notice-reply' },
      secondary: { label: 'File Pending GST Returns', href: '/checkout/gst-return-filing' },
    },

    relatedNotices: ['gst-reg-31-suspension', 'gst-drc-01-notice', 'gst-asmt-10-notice'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'income-tax-139-9-defective-return',
    title: 'Income Tax Section 139(9) Notice: Defective Return',
    seoTitle: 'Income Tax 139(9) Defective Return Notice 2025: How to Fix It | Ollvy',
    seoDescription: 'Got an Income Tax Section 139(9) notice saying your return is defective? Understand exactly what is wrong and how to fix it within 15 days before your ITR becomes invalid.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'serious',
    deadline: '15 days from date of notice (extendable)',
    deadlineNote: 'If you do not fix the defect within 15 days, your return is treated as if it was never filed. You lose refunds, lose loss carry-forward, and may be treated as a non-filer.',

    sections: [
      {
        number: '01',
        heading: 'YOUR RETURN WAS FILED BUT THE DEPARTMENT SAYS IT IS DEFECTIVE',
        body: 'A Section 139(9) notice means the income tax department processed your filed return and found something that makes it technically incomplete or incorrect in a way that invalidates it. This is not about tax liability - it is about the structural integrity of your return filing itself.\n\nThe specific defect will be mentioned in the notice. You have 15 days to fix it. If you do not, the return is legally treated as if it was never filed at all - which has significant consequences including loss of refunds and inability to carry forward losses.',
        note: 'Source: Section 139(9), Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'COMMON DEFECTS THAT TRIGGER 139(9)',
        body: 'The specific defect in your notice will tell you exactly what to fix. Here are the most common ones:',
        bullets: [
          'Wrong ITR form used: You filed ITR-1 but were required to file ITR-2 or ITR-3 (because you had capital gains, were a director, had foreign assets, or had income above Rs. 50 lakh). This is the most common reason.',
          'Incomplete schedules: The form was filed but key schedules were left blank or not filled - Schedule 80C deductions without details, capital gains schedule without transaction details, business income schedule incomplete.',
          'Income computed incorrectly: The department\'s algorithm detected that the income computation does not follow the prescribed format for that ITR form.',
          'Tax computed as zero when it should not be: You declared income but computed zero tax in a situation where tax is clearly due, without valid reasoning (e.g., wrong regime selected).',
          'PAN and name mismatch: The PAN on the return does not match the name in the PAN database.',
          'Audit report not filed: You are a business required to file an audit report (Form 3CA/3CB and 3CD) and the report has not been filed or was not filed within the prescribed time before the return.',
          'Balance sheet and P&L mismatch: For business returns, the figures in Schedule BP do not tally with the attached financial statements.',
          'Missing digital signature: For companies and required entities, the return was filed without a valid digital signature.',
        ],
        note: 'Read your 139(9) notice carefully. The exact defect code is mentioned. The Central Processing Centre (CPC) assigns specific defect codes (like "Defect Code 2," "Defect Code 8," etc.) which tell you exactly what is wrong.',
      },
      {
        number: '03',
        heading: 'HOW TO RESPOND AND FIX THE DEFECT',
        body: 'You respond to a 139(9) notice by filing a revised/corrected return - the system treats your defect-corrected filing as the response. Here is how:',
        bullets: [
          'Log in to incometax.gov.in and go to e-File > Income Tax Returns',
          'You will see the defective return for the relevant assessment year. Click on "Submit Response" for the 139(9) notice.',
          'If you agree with the defect: Select "Agree" and file a rectified return addressing the specific defect. If the defect is a wrong form, file the correct form now.',
          'If you disagree with the defect classification: Select "Disagree" and provide your response with reasoning. This is less common but available.',
          'Complete the corrected return accurately, fix the specific defect cited, and submit.',
          'Keep the acknowledgement number of the corrected filing.',
        ],
        note: 'The 15-day period is extendable. If you need more time (e.g., waiting for an audit report to be finalised), you can write to the CPC requesting an extension. Do this before the 15 days expire.',
      },
      {
        number: '04',
        heading: 'WHAT HAPPENS IF YOU DO NOT RESPOND',
        body: 'This is serious.',
        bullets: [
          'Your return is treated as invalid: Legally, it is as if you never filed.',
          'Any refund due is lost: The CPC will not process a refund on a defective/invalid return.',
          'Losses cannot be carried forward: Business losses, capital losses, speculation losses - all of which require a valid, timely return to carry forward - are lost.',
          'You may be treated as a non-filer: For the purpose of follow-up notices, loan applications, visa applications, and other purposes that require proof of ITR filing.',
          'Penalty under Section 234F: If the original due date has passed, and the return is effectively re-filed after the deadline (as a corrected version), the late filing fee applies.',
        ],
      },
    ],

    faqs: [
      {
        q: 'I filed ITR-1 but got 139(9) saying I should have filed ITR-2 because I am a director in a company. How do I fix this?',
        a: 'File a fresh ITR-2 in response to the 139(9) notice. In ITR-2, there is a specific schedule for "Directorship details" where you declare the companies you are a director in. Your income details remain the same - only the form changes.',
      },
      {
        q: 'My 139(9) says "return data is incomplete." What does that mean?',
        a: 'This usually means one or more schedules in the ITR are either not filled or have inconsistent data. Download your filed ITR-V (acknowledgement) and the ITR XML from the portal, and review every schedule against the relevant defect code in the notice. Common culprits are Schedule 80D (health insurance deduction) without premium details or Schedule CG (capital gains) without transaction details.',
      },
      {
        q: 'Can I still claim deductions and refunds in the corrected return?',
        a: 'Yes. Your corrected return is essentially a fresh filing that addresses the defect. You can include all deductions, exemptions, and TDS credits that you were originally entitled to. Do not file a minimal response - file the complete, accurate return.',
      },
      {
        q: 'I received the 139(9) notice very late and only have 3 days left. What should I do?',
        a: 'File the corrected return today with whatever is available. Do not wait for perfection. If you need more time for documentation (audit report, etc.), request an extension in writing to the CPC at the same time. A partially corrected return that was filed in time is better than a perfect return filed after the deadline.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help Fixing Defective Return', href: '/checkout/itr-filing' },
      secondary: { label: 'Which ITR Form Should I Use?', href: '/learn/which-itr-form-should-i-use' },
    },

    relatedNotices: ['income-tax-143-1-intimation', 'income-tax-142-1-notice', 'income-tax-143-2-scrutiny'],
    relatedTools: ['/tools/documents/itr-filing-individual'],
  },

  // ============================================================
  // BATCH 2: MEDIUM PRIORITY
  // ============================================================

  {
    slug: 'gst-drc-01a-pre-notice',
    title: 'GST DRC-01A Notice: Pre-Show Cause Notice Intimation',
    seoTitle: 'GST DRC-01A Notice: What It Is and How to Respond (2025) | Ollvy',
    seoDescription: 'Received a GST DRC-01A notice? This is a pre-demand intimation - not a formal demand yet. Respond within 30 days to avoid escalation to DRC-01.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'serious',
    deadline: '30 days from date of intimation',
    deadlineNote: 'DRC-01A is actually an opportunity - if you respond well here, the department may close the matter without ever issuing a formal DRC-01 demand.',

    sections: [
      {
        number: '01',
        heading: 'THIS IS NOT A DEMAND YET - BUT IT COULD BECOME ONE',
        body: 'DRC-01A is a relatively recent addition to the GST compliance toolkit, introduced to give taxpayers an informal opportunity to engage with the department before formal demand proceedings begin.\n\nHere is what has happened: the GST officer has done the calculation and determined that you owe tax. But before issuing the formal DRC-01 Show Cause Notice, they are required to first send you DRC-01A - essentially saying "we think you owe Rs. X. Here is what we found. Tell us if we are wrong, or pay up."\n\nThis informal stage is genuinely valuable. Use it.',
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
        note: 'The penalty protection at this stage is significant. Under Section 73 (non-fraud cases): paying during DRC-01A stage = nil penalty. Paying during DRC-01 stage = 10% penalty. Paying after DRC-07 demand order = 10-15% penalty. Under Section 74 (fraud): penalties are 100% at DRC-01 stage, so the relative benefit of early payment is even larger.',
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
        body: 'If you are challenging the department\'s calculation at DRC-01A stage, your representation should:',
        bullets: [
          'Be in writing and addressed to the officer who signed the DRC-01A',
          'Specifically identify each component of the ascertained amount you agree with and each you dispute',
          'Provide a reconciliation for every disputed component - not just a general statement',
          'Attach supporting documents (returns, invoices, bank statements, credit notes)',
          'State clearly the amount (if any) you are paying voluntarily and provide the DRC-03 challan details',
        ],
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
    ],

    cta: {
      primary: { label: 'Get CA Help Responding to DRC-01A', href: '/checkout/gst-notice-reply' },
      secondary: { label: 'Understand the Full DRC Series', href: '/notices/gst-drc-01-notice' },
    },

    relatedNotices: ['gst-drc-01-notice', 'gst-asmt-10-notice'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'income-tax-143-2-scrutiny',
    title: 'Income Tax Section 143(2) Scrutiny Notice: A Human is Reviewing Your Return',
    seoTitle: 'Income Tax 143(2) Scrutiny Notice 2025: What to Do | Ollvy',
    seoDescription: 'Received an Income Tax Section 143(2) scrutiny notice? A tax officer has selected your return for detailed examination. Understand what it means and how to respond.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'urgent',
    deadline: 'Date specified in notice (minimum 30 days to respond)',
    deadlineNote: 'Unlike 143(1), this is a human officer - not an automated system. Every document you submit and every word you write will be reviewed and may prompt follow-up questions.',

    sections: [
      {
        number: '01',
        heading: 'THIS IS DIFFERENT FROM 143(1). A REAL OFFICER IS LOOKING AT YOUR RETURN.',
        body: 'A Section 143(2) notice means your income tax return has been selected for scrutiny assessment. An assessing officer (a real person, not an automated system) has selected your case and is now conducting a detailed examination of your income, deductions, exemptions, and tax paid.\n\nThe officer has the power to call for any documents, examine books of accounts, make enquiries from third parties (banks, clients, employers), and ultimately pass an assessment order that can be higher than what you declared.\n\nThis is serious but manageable if handled correctly from the start.',
        note: 'Source: Section 143(2), Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'WHY YOUR RETURN WAS SELECTED FOR SCRUTINY',
        body: 'Cases are selected for scrutiny either by the CASS (Computer Assisted Scrutiny Selection) system or through specific departmental intelligence. Common triggers:',
        bullets: [
          'High-value deductions relative to income: Large 80C investments, substantial HRA claims, or home loan deductions that seem disproportionate to income.',
          'Significant year-on-year variation in income: A large dip or spike in income without an obvious reason.',
          'GST and income tax turnover mismatch: Your business income in ITR is significantly lower than turnover in GST returns.',
          'Cash deposits inconsistent with income: Bank account cash deposits shown in your AIS that do not match your declared income profile.',
          'Large capital gains claimed as exempt or with indexation: Especially on property sales.',
          'High-value foreign transactions: LRS transactions, foreign investments, or NRI status claims.',
          'Sector-specific scrutiny: The CBDT periodically selects specific business sectors for systematic scrutiny.',
          'Third-party data mismatch: Information from banks, registrars, stockbrokers that does not reconcile with your ITR.',
        ],
      },
      {
        number: '03',
        heading: 'WHAT THE SCRUTINY PROCESS LOOKS LIKE',
        body: 'Section 143(2) scrutiny is not a one-document exchange. It is a structured process that can last 12-18 months.',
        bullets: [
          'Notice under 143(2): The officer specifies what documents and information they want and sets a date for you to respond. The notice must be issued within 3 months from the end of the financial year in which the return was filed.',
          'First response: You submit the requested documents. This is usually a mix of financial statements, bank statements, investment proofs, and specific explanations.',
          'Questionnaire / further queries: The officer reviews your submission and sends follow-up questions, often in the form of notices under Section 142(1).',
          'Examination of accounts: The officer may call you or your CA for an in-person discussion or the examination of specific records.',
          'Show cause notice before addition: Before making any addition to your income or disallowing a deduction, the officer is required to give you a specific show cause notice under Section 144B (faceless assessment process). You must respond to this.',
          'Draft assessment order: Under the faceless assessment scheme, you receive a draft order before the final order. You have 30 days to respond.',
          'Final assessment order under Section 143(3): The conclusive order. Any additional tax demand, penalty, or clean chit from the scrutiny.',
        ],
        note: 'The entire scrutiny must be completed within 18 months from the end of the relevant assessment year (12 months for returns filed on time).',
      },
      {
        number: '04',
        heading: 'HOW TO HANDLE THE SCRUTINY FROM DAY ONE',
        body: 'The way you respond to the first 143(2) notice sets the tone for everything that follows.',
        bullets: [
          'Engage a CA immediately: Scrutiny assessment is not a DIY process. The officer is a trained professional who scrutinises returns all day. You need someone who knows the system on your side.',
          'Respond fully and on time: Partial responses and missed deadlines create negative impressions and invite harder follow-up queries.',
          'Do not over-share: Only answer what is asked. Do not volunteer information that was not requested and that might open new lines of enquiry.',
          'Document everything: Keep a log of every document submitted, every query answered, and every communication with the officer. Get written acknowledgements.',
          'Understand what the officer is looking for: Most scrutiny notices focus on one or two specific issues. Understanding the officer\'s concern early helps you address it effectively.',
          'Do not make verbal commitments: Everything in a scrutiny proceeding should be in writing. If you make a verbal statement that is later used against you, you have no record to contest it.',
        ],
      },
      {
        number: '05',
        heading: 'THE DIFFERENCE BETWEEN FACELESS AND CONVENTIONAL SCRUTINY',
        body: 'Since 2020, most income tax scrutiny cases go through the Faceless Assessment Scheme. This means:',
        bullets: [
          'You do not need to appear before an officer in person. All communication is through the income tax portal.',
          'The officer reviewing your case may be in a different city from you. This is by design to reduce corruption.',
          'You submit all documents digitally through the portal.',
          'The draft assessment order is sent to you electronically with a 30-day response period.',
          'The final order is also issued electronically.',
          'Conventional (non-faceless) scrutiny applies to certain categories of high-complexity cases, international taxation, and cases involving search and seizure.',
        ],
      },
    ],

    faqs: [
      {
        q: 'I received 143(2) for my business return. The officer is asking for all books of accounts for 3 years. Do I have to submit all of that?',
        a: 'The officer can ask for books of accounts under Section 142(1) and you must comply. However, you do not have to present original books in person for most faceless cases - scanned copies are acceptable. Start compiling digitally. If the volume is large, request a reasonable time extension.',
      },
      {
        q: 'My 143(2) notice was issued 4 months after the end of the financial year in which I filed my return. Is it valid?',
        a: 'The notice must be issued within 3 months from the end of the financial year in which the return was filed. If your return was filed in July 2024 (FY 2024-25), the 3-month window runs until June 30, 2025. If the notice came after that, it is time-barred and you should challenge it. Get the dates verified by a CA.',
      },
      {
        q: 'I received both 143(1) intimation with no demand and then 143(2). Is that normal?',
        a: 'Yes. A 143(1) intimation means the CPC processed your return with no issues found through automated checking. A 143(2) notice means your case was separately selected for scrutiny by a human officer. These are two independent processes and receiving a clean 143(1) does not protect you from 143(2) scrutiny.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Representation for Scrutiny Assessment', href: '/checkout/itr-notice-response' },
      secondary: { label: 'Understand What a Scrutiny Involves', href: '/learn/do-i-need-to-file-itr' },
    },

    relatedNotices: ['income-tax-142-1-notice', 'income-tax-148-148a-reopening', 'income-tax-156-demand'],
    relatedTools: ['/tools/penalty-calculator/itr'],
  },

  // ============================================================

  {
    slug: 'gst-asmt-14-best-judgment',
    title: 'GST ASMT-14 Notice: Best Judgment Assessment',
    seoTitle: 'GST ASMT-14 Notice: Best Judgment Assessment Explained (2025) | Ollvy',
    seoDescription: 'Received a GST ASMT-14 notice? This is a best judgment assessment - usually issued when ASMT-10 was not replied to. Understand what it means and how to challenge it.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'urgent',
    deadline: '30 days to challenge via appeal',
    deadlineNote: 'ASMT-14 is the outcome of not replying to ASMT-10. The window to prevent this has passed - but you can still challenge it.',

    sections: [
      {
        number: '01',
        heading: 'WHAT IS ASMT-14 AND HOW DID YOU GET HERE',
        body: 'If you are reading this, it is likely because an earlier ASMT-10 scrutiny notice was either not replied to or the reply was not accepted by the officer.\n\nASMT-14 is issued under Section 62 of the CGST Act (Assessment of Non-Filers). It is the GST officer\'s best judgment assessment - meaning they have determined your GST liability using whatever information they had, without your input. The final assessment order follows in ASMT-15.\n\nHere is the important part: if you file all your pending returns within 30 days of receiving ASMT-14, the assessment order can be withdrawn. This is a one-time relief built into the law.',
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
        a: 'This can happen if your reply was not considered satisfactory, if it was filed after the deadline, or (rarely) if there was a system issue. Check your GST portal for the ASMT-11 (your reply) and ASMT-12 (officer\'s response to your reply). If the officer issued ASMT-14 without acknowledging your reply, this is grounds to challenge the ASMT-14 in appeal.',
      },
      {
        q: 'The ASMT-14 shows Rs. 22 lakh as my GST liability. My actual liability should be around Rs. 3 lakh. Should I file returns or appeal?',
        a: 'File returns first (within 30 days) to trigger the Section 62(2) withdrawal. This brings the dispute down to your actual liability. If there are still disputes after filing (interest, penalty, or specific disallowances), deal with those through the officer or appeal. The Section 62(2) route is almost always cheaper and faster than a full appeal.',
      },
    ],

    cta: {
      primary: { label: 'File Pending GST Returns Now', href: '/checkout/gst-return-filing' },
      secondary: { label: 'Get Help with GST Appeal', href: '/checkout/gst-notice-reply' },
    },

    relatedNotices: ['gst-asmt-10-notice', 'gst-drc-01-notice'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'income-tax-142-1-notice',
    title: 'Income Tax Section 142(1) Notice: What the Department is Asking For',
    seoTitle: 'Income Tax Section 142(1) Notice 2025: How to Respond | Ollvy',
    seoDescription: 'Received an Income Tax Section 142(1) notice? It is either asking you to file a return or produce documents. Understand which situation you are in and how to respond.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'serious',
    deadline: 'Date specified in notice (typically 15-30 days)',
    deadlineNote: 'Not responding to 142(1) is itself an offence and attracts penalty under Section 271(1)(b).',

    sections: [
      {
        number: '01',
        heading: 'SECTION 142(1) IS USED IN TWO VERY DIFFERENT SITUATIONS',
        body: 'A Section 142(1) notice has two entirely distinct purposes under the law and which one applies to you determines what you need to do. Read your notice carefully to identify which situation you are in.',
        bullets: [
          'Situation A - Filing a return: Under Section 142(1)(i), if you have not filed an income tax return and the assessing officer believes you should have, they can ask you to file. This can happen even before the assessment process begins.',
          'Situation B - Producing documents, accounts, or information: Under Section 142(1)(ii) and (iii), during the course of an assessment (usually scrutiny under 143(2)), the officer can ask you to produce specific books of accounts, documents, bank statements, or answer specific questions. This is the more common use.',
        ],
        note: 'Source: Section 142(1), Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'IF THE NOTICE IS ASKING YOU TO FILE A RETURN',
        body: 'File the return for the relevant assessment year as promptly as possible. A few important points:',
        bullets: [
          'If the return is being filed late, Section 234F late fees apply: Rs. 5,000 if income above Rs. 5 lakh; Rs. 1,000 if below.',
          'Interest under Section 234A (1% per month on tax due) applies from the original due date.',
          'The return you file after a 142(1)(i) notice is treated as a belated return.',
          'Do not treat this lightly - not filing even after a 142(1) notice can lead to Best Judgment Assessment under Section 144.',
        ],
      },
      {
        number: '03',
        heading: 'IF THE NOTICE IS ASKING FOR DOCUMENTS OR INFORMATION',
        body: 'This is the more common use and typically arises during a scrutiny assessment. The notice will specify exactly what documents are needed.',
        bullets: [
          'Respond fully and on time: The deadline specified in the notice must be respected. If you need more time, request an extension before the deadline, not after.',
          'Submit only what is asked: Do not send additional documents that were not requested. Unsolicited documents can introduce new questions.',
          'Submit organised documentation: A disorganised submission creates a bad impression and may lead to the officer asking for everything again.',
          'Keep copies of everything you submit: This is your record of what was provided if disputes arise later.',
          'Respond in writing: Even if the notice seems informal, your response should be a written submission with an index of documents attached.',
          'Do not ignore individual items: If the notice asks for 8 things and you can provide 7, provide the 7 and specifically explain in writing why the 8th is not available or not applicable.',
        ],
        note: 'The officer can issue multiple Section 142(1) notices during a scrutiny. Each one must be responded to individually.',
      },
      {
        number: '04',
        heading: 'WHAT HAPPENS IF YOU DO NOT RESPOND',
        body: '',
        bullets: [
          'Penalty under Section 271(1)(b): Rs. 10,000 per notice that you fail to comply with. This is a fixed penalty, not proportional to your income.',
          'Best Judgment Assessment under Section 144: If you repeatedly fail to respond, the officer can pass a best judgment assessment based on available information - typically unfavourable.',
          'Prosecution under Section 276D: Persistent non-compliance with production orders can lead to criminal prosecution.',
        ],
      },
    ],

    faqs: [
      {
        q: 'The 142(1) notice is asking for 5 years of bank statements. That is a lot of documents. Do I really have to produce all of them?',
        a: 'Yes, you must comply with a valid 142(1) notice. However, if the request appears disproportionately broad, you can respond in writing raising this point and requesting that the officer limit the request to what is genuinely relevant to the specific issues under scrutiny. Do this professionally through a CA - it is a legitimate response, not a refusal.',
      },
      {
        q: 'I received a 142(1) notice but I thought my scrutiny was already closed. What is happening?',
        a: 'Sometimes 142(1) notices are issued after earlier responses as follow-up queries. Check whether the case is still open in the faceless assessment system. If the scrutiny was formally concluded and the final 143(3) order was passed, a fresh 142(1) should not be possible unless a new proceeding (like a reassessment under 148) has been initiated.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help Responding to 142(1)', href: '/checkout/itr-notice-response' },
      secondary: { label: 'Understand 143(2) Scrutiny Process', href: '/notices/income-tax-143-2-scrutiny' },
    },

    relatedNotices: ['income-tax-143-2-scrutiny', 'income-tax-148-148a-reopening', 'income-tax-271-penalty'],
    relatedTools: [],
  },

  // ============================================================

  {
    slug: 'gst-gstr2b-itc-mismatch',
    title: 'GST ITC Mismatch Notice: GSTR-2B vs Claimed Input Tax Credit',
    seoTitle: 'GST ITC Mismatch Notice 2025: GSTR-2B vs Claimed Credit | Ollvy',
    seoDescription: 'Got a GST notice about Input Tax Credit mismatch between GSTR-2B and your claimed ITC? Understand why it happened and how to respond before it becomes a demand.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'serious',
    deadline: 'Depends on notice form - typically 15-30 days',
    deadlineNote: 'ITC mismatch notices are growing rapidly in volume. The department is becoming more aggressive about enforcing Section 16(2)(aa).',

    sections: [
      {
        number: '01',
        heading: 'WHY YOUR ITC CLAIM IS BEING QUESTIONED',
        body: 'Since the Finance Act 2022 amended Section 16(2)(aa) of the CGST Act, Input Tax Credit can only be availed if the invoice or debit note appears in your GSTR-2B. GSTR-2B is an auto-generated document showing all the ITC available to you based on what your suppliers have actually filed in their GSTR-1.\n\nThe problem: You may have received goods or services, paid for them, and have the invoice - but if your supplier did not file their GSTR-1 correctly, or filed it late, the credit will not appear in your GSTR-2B. And you claimed it anyway. That gap is what the department is now targeting.',
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

    cta: {
      primary: { label: 'Get CA Help with ITC Mismatch Reply', href: '/checkout/gst-notice-reply' },
      secondary: { label: 'Fix Your GST Return Filing', href: '/checkout/gst-return-filing' },
    },

    relatedNotices: ['gst-asmt-10-notice', 'gst-drc-01-notice', 'gst-drc-01b-mismatch'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'income-tax-156-demand',
    title: 'Income Tax Section 156 Notice of Demand: Tax Has Been Assessed and is Now Due',
    seoTitle: 'Income Tax Section 156 Notice of Demand 2025: What to Do | Ollvy',
    seoDescription: 'Received a Section 156 income tax notice of demand? This is the formal payment request after an assessment. Understand your 30-day window and options.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'serious',
    deadline: '30 days from date of notice to pay or respond',
    deadlineNote: 'Interest at 1% per month under Section 220(2) starts the moment you miss the 30-day window.',

    sections: [
      {
        number: '01',
        heading: 'WHAT THIS NOTICE IS TELLING YOU',
        body: 'A Section 156 notice is the formal demand that follows an assessment order. It is not the assessment itself - it is the instruction to pay the tax that was determined in an earlier order (typically a 143(1) intimation, 143(3) assessment order, or a reassessment order).\n\nThink of it this way: the assessment order is the court judgment. The Section 156 notice is the execution notice asking you to pay the amount in the judgment.',
        note: 'Source: Section 156, Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'YOUR OPTIONS WHEN YOU RECEIVE A 156 NOTICE',
        body: '',
        bullets: [
          'Pay the demand within 30 days: If you agree the assessment is correct, pay via Challan 280 (income tax payment) and map the payment to the specific demand on the income tax portal. Respond to the outstanding demand on the portal with the challan details.',
          'Request an instalment arrangement: For large demands, you can request the assessing officer to grant payment in instalments under Section 220(3). This is discretionary. A formal written request with reason and proposed schedule is required.',
          'File an appeal and apply for stay: If you dispute the underlying assessment that created this demand, file an appeal under Section 246A within 30 days of the assessment order (not the 156 notice). Simultaneously, apply to the Appellate Authority for a stay of demand. With a stay, you do not need to pay the demand pending appeal resolution. Pre-deposit of 20% of disputed demand is typically required for a stay.',
          'Apply for rectification under Section 154: If the 156 demand is based on an arithmetic error or incorrect processing in the assessment, file a rectification request to correct it before paying.',
        ],
        note: 'After 30 days without payment, Section 220(2) interest at 1% per month kicks in. If recovery proceedings are initiated (Section 222-226), the department can attach bank accounts, property, and deduct from salaries.',
      },
      {
        number: '03',
        heading: 'WHEN PAYING IS NOT YOUR BEST FIRST MOVE',
        body: 'Do not pay automatically without reviewing the underlying assessment order.',
        bullets: [
          'Verify the original assessment order that created this demand - is it a 143(1) intimation, 143(3) assessment order, or something else?',
          'Is the demand figure correct? Check for arithmetic errors in the assessment order.',
          'Did you already pay this demand and it was not mapped correctly? Check your payment records.',
          'Is the demand disputable on merit? Did the officer disallow a legitimate deduction? Did they add income that should not have been added? These are grounds for appeal.',
          'Is the assessment order time-barred? Were the proper procedures followed?',
        ],
      },
    ],

    faqs: [
      {
        q: 'I received a Section 156 notice for a demand from 5 years ago that I thought was resolved. What do I do?',
        a: 'This sometimes happens when old demands are erroneously reactivated. First, check your payment records - if you paid, find the challan. Then check the income tax portal for the demand history. If the demand was previously paid or written off, raise a rectification request and grievance simultaneously. Do not pay again without investigation.',
      },
      {
        q: 'Can the department take any action before the 30-day window expires?',
        a: 'Generally no. The 30 days in Section 156 is a mandatory notice period before recovery action can begin. However, if the officer has reason to believe you are about to transfer assets to evade payment, a provisional attachment under Section 281B can be made before the 30 days.',
      },
    ],

    cta: {
      primary: { label: 'Get Help Responding to Section 156 Demand', href: '/checkout/itr-notice-response' },
      secondary: { label: 'File an Appeal Against Assessment', href: '/checkout/itr-notice-response' },
    },

    relatedNotices: ['income-tax-143-1-intimation', 'income-tax-143-2-scrutiny', 'income-tax-245-refund-adjustment'],
    relatedTools: ['/tools/penalty-calculator/itr'],
  },

  // ============================================================

  {
    slug: 'income-tax-ais-sft-notice',
    title: 'Income Tax AIS / SFT High-Value Transaction Notice',
    seoTitle: 'Income Tax AIS / High Value Transaction Notice 2025 | Ollvy',
    seoDescription: 'Got a notice about a high-value transaction in your AIS or SFT? Understand what the department has found, whether it is taxable, and how to respond.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'serious',
    deadline: 'Varies - typically 15-30 days if a formal notice',
    deadlineNote: 'Some of these arrive as informal emails or SMS. Do not ignore them - they almost always precede formal notices.',

    sections: [
      {
        number: '01',
        heading: 'THE DEPARTMENT HAS YOUR TRANSACTION DATA AND IS ASKING ABOUT IT',
        body: 'The income tax department now receives detailed financial information about you from dozens of sources: banks, stock exchanges, mutual fund houses, property registrars, foreign exchange dealers, insurance companies, and more. This data flows through two systems: the Annual Information Statement (AIS) and the Statement of Financial Transactions (SFT / Form 61A).\n\nWhen a transaction appears in your AIS and does not show up in your filed income tax return - or the income tax return shows much lower income than the transaction data suggests - the department sends you a communication asking for an explanation.',
        note: 'Source: Section 285BA, Income Tax Act, 1961 (SFT obligations of reporting entities). AIS launched 2021 as an expansion of Form 26AS.',
      },
      {
        number: '02',
        heading: 'WHAT KIND OF TRANSACTIONS GET REPORTED',
        body: 'Under SFT rules, these entities are required to report high-value transactions to the income tax department:',
        bullets: [
          'Banks: Cash deposits of Rs. 10 lakh or more in savings accounts; Rs. 50 lakh or more in current accounts in a financial year',
          'Credit card companies: Payments of Rs. 1 lakh or more in cash, or Rs. 10 lakh or more in aggregate against credit card bills',
          'Mutual fund houses: Investments of Rs. 10 lakh or more in mutual fund units',
          'Stockbrokers / NSE / BSE: Share transactions totalling Rs. 10 lakh or more',
          'Property registrars: Sale or purchase of immovable property of Rs. 30 lakh or more',
          'Foreign exchange dealers / FFMC: Foreign currency transactions (outward remittances, forex purchases) of Rs. 10 lakh or more',
          'LIC and other insurers: Receipt of cash payment of Rs. 10 lakh or more as premium',
          'NBFCs and cooperative banks: Fixed deposit receipts of Rs. 10 lakh or more',
        ],
        note: 'Every transaction above these thresholds appears in your AIS - linked to your PAN. The data is available to both you and the income tax department.',
      },
      {
        number: '03',
        heading: 'HOW TO RESPOND',
        body: 'Your response depends on the nature of the transaction and whether it was correctly reflected in your ITR:',
        bullets: [
          'Transaction was correctly reported in your ITR: Simply provide the reference - the schedule, amount, and treatment in your return. The matter typically closes here.',
          'Transaction was not reported because it is not taxable income: Explain and document. Examples: a loan receipt (not income), sale of shares at a loss, gift received from relatives, proceeds from selling household goods.',
          'Transaction was taxable and was not reported: The most uncomfortable situation. You will need to assess whether to file a revised return (if within the deadline) or a belated return, and pay tax with interest. Proactive disclosure is almost always better than waiting for a formal demand.',
          'Transaction data in AIS is wrong: This happens. Banks and other entities sometimes file SFT data incorrectly. You can submit a response on the AIS/26AS portal flagging the transaction as incorrect, with documentary evidence.',
        ],
      },
      {
        number: '04',
        heading: 'THE FORMAL NOTICE THAT FOLLOWS',
        body: 'If you do not respond to the initial AIS communication or if your response is not satisfactory, the department will typically issue a formal notice under Section 133(6) (asking for information from you), Section 142(1) (during ongoing scrutiny), or trigger a reassessment under Section 148A.\n\nResponding proactively to AIS communications - before they become formal notices - is significantly less expensive and stressful than dealing with formal proceedings later.',
      },
    ],

    faqs: [
      {
        q: 'My AIS shows a property sale that I do not recognise. Someone else\'s transaction appears against my PAN. What do I do?',
        a: 'This happens when a property registrar files SFT data with an incorrect PAN. First, verify that the transaction is genuinely not yours by checking the property address and details. Then submit an online feedback/objection on the AIS portal marking the transaction as "information is incorrect." Also raise a grievance on the income tax portal. Keep a record of all correspondence.',
      },
      {
        q: 'My AIS shows Rs. 35 lakh in mutual fund redemptions. I reported the capital gains but not the gross redemption amount. Will I get a notice?',
        a: 'Possibly. The AIS shows gross transaction value while your ITR shows net capital gains. The difference can look like unreported income to an automated system. If you receive a communication, simply explain this in your response with your ITR Schedule CG (capital gains) showing the purchase price, sale price, and gains computed. This is a common and easily explained discrepancy.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help Responding to AIS Notice', href: '/checkout/itr-notice-response' },
      secondary: { label: 'File or Revise Your ITR', href: '/checkout/itr-filing' },
    },

    relatedNotices: ['income-tax-148-148a-reopening', 'income-tax-143-2-scrutiny', 'income-tax-142-1-notice'],
    relatedTools: ['/tools/penalty-calculator/itr'],
  },

  // ============================================================

  {
    slug: 'gst-reg-31-suspension',
    title: 'GST REG-31 Notice: Your GST Registration Has Been Suspended',
    seoTitle: 'GST REG-31 Registration Suspension Notice 2025: What to Do | Ollvy',
    seoDescription: 'Got a GST REG-31 suspension notice? Your GSTIN is suspended - clients cannot claim ITC from your invoices. Understand what triggered this and how to restore it.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'urgent',
    deadline: '30 days from suspension to respond',
    deadlineNote: 'Every day your GSTIN stays suspended, your clients are at risk of ITC denial on your invoices. This urgently affects your business relationships.',

    sections: [
      {
        number: '01',
        heading: 'SUSPENDED IS NOT CANCELLED - BUT IT IS STILL A CRISIS',
        body: 'REG-31 is the intimation that your GST registration has been suspended, typically as a precursor to cancellation under REG-17. Suspension means your GSTIN is in an inactive state.\n\nThe critical business impact: during suspension, a GST portal search for your GSTIN will show "Suspended" status. Any client who pays you and claims ITC on your invoice during this period will face ITC rejection during their audit or return processing. This damages your client relationships and can result in them demanding compensation or ending the contract.',
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

    cta: {
      primary: { label: 'Get CA Help Restoring Suspended GSTIN', href: '/checkout/gst-notice-reply' },
      secondary: { label: 'File Pending GST Returns', href: '/checkout/gst-return-filing' },
    },

    relatedNotices: ['gst-reg-17-cancellation-notice', 'gst-asmt-10-notice'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'gst-gstr9-annual-return-mismatch',
    title: 'GST Annual Return Mismatch Notice: GSTR-9 vs GSTR-3B Discrepancy',
    seoTitle: 'GST GSTR-9 Annual Return Mismatch Notice 2025 | Ollvy',
    seoDescription: 'Got a GST notice about discrepancies in your GSTR-9 annual return versus monthly 3B filings? Understand what the department found and how to respond.',
    lastReviewed: 'March 2025',
    category: 'GST',
    severity: 'serious',
    deadline: '15-30 days as specified in notice',
    deadlineNote: 'GSTR-9 discrepancy notices are increasing as the department uses annual returns as an audit trigger. The quality of your annual return matters.',

    sections: [
      {
        number: '01',
        heading: 'WHAT TRIGGERED THIS NOTICE',
        body: 'GSTR-9 is the annual return that reconciles your monthly GST filings for the entire financial year. When the department\'s system compares your GSTR-9 against your GSTR-3B monthly filings (or your GSTR-1 invoice data), and finds differences that cannot be explained by standard adjustments, it triggers a notice.\n\nThis notice is typically an ASMT-10 scrutiny notice specifically citing GSTR-9 discrepancies. The analysis below is specific to GSTR-9 related queries.',
        note: 'Source: Section 44 (GSTR-9 filing), Section 61 (scrutiny), CGST Act 2017.',
      },
      {
        number: '02',
        heading: 'COMMON GSTR-9 DISCREPANCIES THAT TRIGGER NOTICES',
        body: '',
        bullets: [
          'Turnover in GSTR-9 is lower than aggregate turnover in monthly GSTR-3B: You may have amended prior months\' returns at the GSTR-9 level without the monthly 3B reflecting the same reduction.',
          'ITC claimed in GSTR-9 is higher than ITC in monthly GSTR-3B: You may have claimed additional ITC in GSTR-9 that was not claimed in the relevant months\' GSTR-3B.',
          'Tax paid figures differ: Tax paid in GSTR-9 does not match cumulative GSTR-3B payment amounts.',
          'Credit notes and amendments not captured correctly: The treatment of credit notes in GSTR-9 vs how they were handled month-to-month differs.',
          'Reverse charge supply not matching: RCM (reverse charge mechanism) supplies declared in GSTR-9 differ from what was paid in GSTR-3B monthly.',
        ],
      },
      {
        number: '03',
        heading: 'HOW TO RESPOND',
        body: 'Your ASMT-10/11 reply for GSTR-9 discrepancies needs to be more comprehensive than a regular monthly return scrutiny reply:',
        bullets: [
          'Prepare a full year reconciliation: Map every line of GSTR-9 back to the relevant month\'s GSTR-3B entry. This is the foundation of your reply.',
          'Explain each difference specifically: Amendment corrections, credit notes issued across years, advances adjusted, composition transactions, exempt supply adjustments - each needs a line-by-line explanation.',
          'Attach the filed GSTR-9/9C and all 12 GSTR-3B returns for the year: Give the officer everything in one place.',
          'GSTR-9C (reconciliation statement): If you filed GSTR-9C (audit-certified reconciliation for businesses above Rs. 5 crore), the discrepancy you are being asked about may already be explained there. Reference it.',
          'If you made errors in GSTR-9: An amendment to GSTR-9 is not possible after filing. Your only option is to provide the correct position in your reply with supporting data and offer to pay any shortfall with interest.',
        ],
      },
    ],

    faqs: [
      {
        q: 'Can I amend a filed GSTR-9?',
        a: 'No. GSTR-9 cannot be amended after filing. If there are errors, the correct approach is to acknowledge them in your reply to the notice, provide the actual correct figures with supporting data, and offer to pay any resulting tax liability with interest.',
      },
      {
        q: 'The GSTR-9 mismatch is because I forgot to include some transactions in my GSTR-9. Should I admit this in my reply?',
        a: 'If transactions were genuinely missed, it is better to acknowledge this proactively in your reply, provide the correct figures, and pay the difference with interest. Trying to explain away a genuine omission with reconciliation gymnastics often makes things worse. Honest acknowledgement with payment is treated more favourably than contested misrepresentation.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help with GSTR-9 Notice Reply', href: '/checkout/gst-notice-reply' },
      secondary: { label: 'File GSTR-9 Annual Return', href: '/checkout/gst-annual-return' },
    },

    relatedNotices: ['gst-asmt-10-notice', 'gst-drc-01-notice', 'gst-gstr2b-itc-mismatch'],
    relatedTools: ['/tools/penalty-calculator/gst'],
  },

  // ============================================================
  // BATCH 3: TDS AND MCA
  // ============================================================

  {
    slug: 'tds-short-deduction-notice',
    title: 'TDS Short Deduction or Non-Deduction Notice from TRACES',
    seoTitle: 'TDS Short Deduction Notice from TRACES 2025: How to Respond | Ollvy',
    seoDescription: 'Got a TDS short deduction or non-deduction notice from TRACES? Understand why it was generated, what interest and penalty applies, and how to regularise.',
    lastReviewed: 'March 2025',
    category: 'TDS',
    severity: 'serious',
    deadline: '30 days from TRACES intimation',
    deadlineNote: 'Interest on short/non-deduction accumulates at 1-1.5% per month from the date of payment or deductible event. The longer you wait, the more it grows.',

    sections: [
      {
        number: '01',
        heading: 'WHY YOU RECEIVED THIS NOTICE',
        body: 'TDS (Tax Deducted at Source) is a withholding obligation. When you make certain payments above specified thresholds - contractor fees, professional fees, rent, commission, salary - you are legally required to deduct a percentage of that payment and deposit it with the government.\n\nA short deduction notice means the TRACES system (the TDS processing system run by the income tax department) has found that you either deducted less than you were required to, or did not deduct at all, for a particular payment or set of payments.',
        note: 'Source: Chapter XVII, Income Tax Act, 1961. TDS provisions: Sections 192 to 196D.',
      },
      {
        number: '02',
        heading: 'HOW THE TRACES SYSTEM DETECTS SHORT DEDUCTION',
        body: 'TRACES cross-checks several data sources:',
        bullets: [
          'Your TDS returns (Form 26Q, 27Q, 24Q) against the payments declared therein',
          'GST invoices received from your vendors (which are now cross-referenced with TDS data in some cases)',
          'High-value transaction data from banks',
          'Complaints filed by payees who expected TDS to be deducted',
          'Audit observations from tax audits of other businesses that list you as a payer',
        ],
      },
      {
        number: '03',
        heading: 'INTEREST AND PENALTY FOR TDS DEFAULT',
        body: 'The financial consequences of TDS non-deduction or late deduction are structured and significant.',
        bullets: [
          'Interest for non-deduction (Section 201(1A)): 1% per month from the date the amount was payable or paid until the date TDS is actually deducted. If payment was already made to the vendor without TDS, 1% applies from date of payment to date of deduction from vendor or alternate recovery.',
          'Interest for late deposit after deduction (Section 201(1A)): 1.5% per month from the date TDS was deducted until the date it is deposited with the government.',
          'Penalty under Section 271C: Equal to the amount of TDS that was not deducted. This is discretionary but serious for large amounts.',
          'Prosecution under Section 276B: Failure to deduct and deposit TDS can lead to criminal prosecution with imprisonment of 3 months to 7 years.',
          'Disallowance under Section 40(a)(ia): If TDS was not deducted on a payment to a resident (professional fees, rent, contractor), 30% of that expense is disallowed in your income tax computation. This indirectly increases your tax liability.',
        ],
        note: 'The Section 40(a)(ia) disallowance is particularly impactful for businesses with large contractor, professional, or rent expenses. Get this right.',
      },
      {
        number: '04',
        heading: 'HOW TO REGULARISE THE DEFAULT',
        body: '',
        bullets: [
          'If you did not deduct TDS and have not yet paid the vendor: Deduct TDS now from the next payment to the vendor, deposit it with the government via Challan 281, and file a correction in your TDS return.',
          'If you already paid the vendor without deducting TDS: You have two options - (a) Deduct from the next payment (cumulative arrears), or (b) Pay the TDS out of your own pocket and deposit it. Option (b) is cleaner from a compliance standpoint. Interest accrues from the date of the original payment.',
          'File a revised TDS return: After depositing the short/non-deducted amount, file a correction statement in TRACES (Form 26Q/27Q/24Q as applicable) reflecting the corrected deduction and deposit.',
          'Respond to the TRACES notice: Upload the correction details and challan on the TRACES portal in response to the notice.',
          'Apply for condonation of interest if the default was due to a genuine interpretive issue: Section 119(2)(b) allows waiver of interest in genuine cases. This requires a detailed application to the CBDT.',
        ],
      },
      {
        number: '05',
        heading: 'COMMON TDS OBLIGATIONS THAT GET MISSED',
        body: 'These are the most frequently defaulted TDS categories for SMEs:',
        bullets: [
          'Section 194C (Contractor payments): 1% for individuals/HUFs, 2% for others. Applies to payments above Rs. 30,000 per contract or Rs. 1 lakh aggregate annually. Many SMEs miss this for small contractors and gig workers.',
          'Section 194J (Professional fees): 10% for professional and technical services above Rs. 30,000 per year. Applies to CA fees, legal fees, medical consultation fees, architectural fees, software development.',
          'Section 194I (Rent): 10% on annual rent above Rs. 2.4 lakh for land and building; 2% for plant and machinery. Frequently missed by businesses renting office space.',
          'Section 194H (Commission): 5% on commission/brokerage above Rs. 15,000 per year.',
          'Section 194Q (Buyer\'s TDS on purchases): If your purchases from a single seller exceed Rs. 50 lakh in a year, 0.1% TDS is deducted by you. Introduced in 2021 and still frequently missed.',
        ],
      },
    ],

    faqs: [
      {
        q: 'The vendor whose payment is the subject of this notice has already paid their own income tax on the amount. Does TDS still apply?',
        a: 'Yes. The fact that the vendor paid their income tax independently does not extinguish your TDS obligation. However, if the payee has paid their full tax and submits a certificate showing this, your interest liability can be reduced or waived. This is addressed in Section 201(1) proviso and CBDT circulars.',
      },
      {
        q: 'I was not aware that TDS was required on a particular payment. Does ignorance reduce the penalty?',
        a: 'Not officially. TDS obligations are statutory and ignorance is not a defence. However, for penalties (not interest), the officer does have discretion to reduce or waive penalties in genuine cases of inadvertent error with immediate correction. This discretion is exercised more favourably if you correct proactively before or immediately after receiving notice.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help Regularising TDS Default', href: '/checkout/tds-filing' },
      secondary: { label: 'File Revised TDS Returns', href: '/checkout/tds-filing' },
    },

    relatedNotices: ['tds-26q-27q-mismatch', 'tds-194c-194j-demand', 'income-tax-143-1-intimation'],
    relatedTools: ['/tools/penalty-calculator/tds'],
  },

  // ============================================================

  {
    slug: 'tds-26q-27q-mismatch',
    title: 'TDS Mismatch Notice: 26Q / 27Q Return vs Actual Deposits',
    seoTitle: 'TDS 26Q / 27Q Mismatch Notice 2025: How to Correct and Respond | Ollvy',
    seoDescription: 'Got a TDS mismatch notice about 26Q or 27Q discrepancies? Your TDS return does not match deposits. Understand how to correct and what the consequences are.',
    lastReviewed: 'March 2025',
    category: 'TDS',
    severity: 'serious',
    deadline: '30 days to file correction return',
    deadlineNote: 'Every quarter you delay a TDS correction, the interest compounds. File the correction TDS return as soon as possible.',

    sections: [
      {
        number: '01',
        heading: 'WHAT IS A TDS MISMATCH AND WHY IT HAPPENS',
        body: 'Your TDS return (Form 26Q for domestic non-salary payments, Form 27Q for foreign payments) declares the deductions made and deposited. The TRACES system compares this against actual challan deposits using BSR codes and challan serial numbers.\n\nMismatches arise when: the challan details entered in the TDS return do not match the actual challan; TDS was deposited but not linked to the correct quarter in the return; payments were made but the TDS return was filed with incorrect PAN of the deductee; or TDS was deducted but deposited in a different quarter than the return shows.',
        note: 'Source: Sections 200, 200A, Income Tax Act, 1961. TRACES processing rules.',
      },
      {
        number: '02',
        heading: 'HOW TO FILE A TDS CORRECTION RETURN',
        body: 'Most TDS mismatches are resolved through a correction return filing on TRACES.',
        bullets: [
          'Log in to TRACES (tdscpc.gov.in) using your TAN credentials',
          'Download the original filed return in Justification Report format to identify exactly which entries are mismatched',
          'Prepare the correction file using your TDS software (Cleartax, TDSMAN, or Winman TDS are commonly used)',
          'Types of corrections: Challan correction (wrong BSR code or serial number), deductee PAN correction (wrong PAN entered), amount correction (wrong deduction amount), addition of new deductee entries',
          'Upload the correction file on TRACES. Processing takes 3-7 working days.',
          'After correction processing, the Justification Report should reflect the corrected position and the mismatch should close.',
        ],
      },
      {
        number: '03',
        heading: 'INTEREST THAT HAS BEEN ACCUMULATING',
        body: 'Beyond fixing the mismatch, check whether any interest is due:',
        bullets: [
          'Interest for late deduction: 1% per month from due date of deduction to date of actual deduction',
          'Interest for late deposit: 1.5% per month from date of deduction to date of deposit',
          'If the mismatch is because TDS was deducted but challan was entered incorrectly: the actual deposit exists but is just linked wrong. In this case, no tax interest should arise once the correction is made - but verify.',
          'If TDS was genuinely deposited late: Interest applies and must be paid via a fresh challan. Include this challan in your correction return.',
        ],
      },
    ],

    faqs: [
      {
        q: 'I filed 26Q with a wrong PAN for a deductee. How does this affect them?',
        a: 'If you entered the wrong PAN, the TDS credit will not appear in that person\'s Form 26AS. They cannot claim the TDS against their tax liability. You must file a correction return with the correct PAN. Once processed, the credit will appear in their 26AS.',
      },
      {
        q: 'My correction TDS return has been rejected by TRACES. What do I do?',
        a: 'Rejection reasons are shown in the processing status. Common reasons: the original return is too old for online correction (needs to be submitted offline to the TIN facilitation centre), or there is a mismatch in the KYC details of the TAN. Identify the specific rejection reason and address it - the TRACES helpline (1800 103 0344) can assist.',
      },
    ],

    cta: {
      primary: { label: 'File TDS Correction Return', href: '/checkout/tds-filing' },
      secondary: { label: 'Regularise TDS Default', href: '/checkout/tds-filing' },
    },

    relatedNotices: ['tds-short-deduction-notice', 'tds-194c-194j-demand', 'income-tax-143-1-intimation'],
    relatedTools: ['/tools/penalty-calculator/tds'],
  },

  // ============================================================

  {
    slug: 'tds-194c-194j-demand',
    title: 'TDS Demand Notice: Section 194C (Contractors) and 194J (Professional Fees)',
    seoTitle: 'TDS 194C and 194J Demand Notice 2025: What to Do | Ollvy',
    seoDescription: 'Received a TDS demand for contractor payments (194C) or professional fees (194J)? Understand the thresholds, when TDS applies, and how to regularise.',
    lastReviewed: 'March 2025',
    category: 'TDS',
    severity: 'serious',
    deadline: '30 days to respond',
    deadlineNote: 'Section 40(a)(ia) means that 30% of the expense where TDS was not deducted is disallowed in your income tax computation. This is a double hit - TDS demand plus higher income tax.',

    sections: [
      {
        number: '01',
        heading: 'WHY 194C AND 194J GENERATE SO MANY DEMANDS',
        body: 'Sections 194C and 194J are the two TDS provisions most frequently defaulted by SMEs - because the payments they cover are the most common in everyday business: contractor/vendor fees and professional service fees. The thresholds are low, the applicable cases are broad, and many businesses simply are not aware of them.',
        note: 'Source: Sections 194C and 194J, Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'SECTION 194C: CONTRACTOR PAYMENTS',
        body: 'When does 194C apply?',
        bullets: [
          'Any payment to a contractor or sub-contractor for carrying out any work (including supply of labour for carrying out work)',
          'TDS rate: 1% if the contractor is an individual or HUF; 2% if the contractor is any other entity (company, firm, LLP)',
          'Threshold: Rs. 30,000 per single payment, OR Rs. 1 lakh aggregate to the same contractor in a financial year. If either threshold is crossed, TDS applies on all payments, not just the amount above the threshold.',
          'What counts as "work": Advertising, broadcasting, catering, manufacturing or supply of any product, civil work, transporting goods or passengers (if not covered by Goods Transport Agency provisions), toll collection - all these fall under 194C.',
          'What does NOT require TDS under 194C: Pure purchase of goods from a manufacturer where no specific work is performed, payments to employees (covered by Section 192), payments below threshold.',
        ],
      },
      {
        number: '03',
        heading: 'SECTION 194J: PROFESSIONAL AND TECHNICAL SERVICES',
        body: 'When does 194J apply?',
        bullets: [
          'Any payment by way of fees for professional services: medical, legal, engineering, architectural, accountancy, technical consultancy, interior decoration, advertising, any other notified profession',
          'Technical services: Any fees for rendering any managerial, technical, or consultancy services (including providing services of technical or other personnel)',
          'Royalty payments and non-compete fees',
          'TDS rate: 10% on professional and technical services, royalty, and non-compete fees. However, technical services (where no professional qualification is involved) attract a reduced rate of 2% under an amendment effective April 1, 2020.',
          'Threshold: Rs. 30,000 per year to the same person. Below this, no TDS.',
          'Important: If the vendor provides you a GST invoice for "professional services" and the annual amount exceeds Rs. 30,000, you must deduct TDS before making payment.',
        ],
      },
      {
        number: '04',
        heading: 'HOW TO DETERMINE IF YOUR DEMAND IS CORRECT',
        body: 'Before paying the TDS demand, verify:',
        bullets: [
          'Were the payments actually above the threshold? Check if any single payment was above Rs. 30,000 or aggregate was above Rs. 1 lakh for 194C.',
          'Is the vendor exemption applicable? Transporters who own up to 10 goods carriages and furnish a declaration in Form 15I/15J are exempt from 194C TDS.',
          'Did the vendor furnish a nil/lower TDS certificate? Under Section 197, vendors with low income can obtain a certificate from their Assessing Officer for nil or lower TDS. If such a certificate was provided to you, the demand is incorrect.',
          'Is the rate correct? Verify whether the officer has applied the correct rate (1% vs 2% for 194C; 2% vs 10% for 194J based on nature of service).',
          'Was TDS eventually deducted and deposited, just late? If yes, the demand amount may be just interest, not principal.',
        ],
      },
    ],

    faqs: [
      {
        q: 'I paid a freelancer Rs. 25,000 for website design and Rs. 20,000 for content writing - total Rs. 45,000. Do I need to deduct TDS?',
        a: 'Yes. The aggregate payments to the same vendor during the financial year exceed Rs. 30,000, which triggers Section 194J. The applicable rate is 10%. You should deduct Rs. 4,500 (10% of Rs. 45,000) from the remaining payment.',
      },
      {
        q: 'My vendor insists I should not deduct TDS because they "already pay tax." How do I handle this?',
        a: 'TDS is your statutory obligation, not the vendor\'s choice. You can inform the vendor that TDS is mandated by law regardless of their tax situation. If they have a nil TDS certificate from their Assessing Officer under Section 197, ask them to provide it. Without that, you must deduct. The vendor can claim the TDS as credit against their own tax liability.',
      },
    ],

    cta: {
      primary: { label: 'Regularise TDS Default (194C/194J)', href: '/checkout/tds-filing' },
      secondary: { label: 'Get Ongoing TDS Compliance Help', href: '/checkout/tds-filing' },
    },

    relatedNotices: ['tds-short-deduction-notice', 'tds-26q-27q-mismatch', 'income-tax-143-1-intimation'],
    relatedTools: ['/tools/penalty-calculator/tds'],
  },

  // ============================================================

  {
    slug: 'income-tax-271-penalty',
    title: 'Income Tax Section 271 Penalty Notice: Penalty for Non-Compliance or Concealment',
    seoTitle: 'Income Tax Section 271 Penalty Notice 2025: How to Respond | Ollvy',
    seoDescription: 'Received a Section 271(1)(b) or 271(1)(c) income tax penalty notice? Understand the difference, the amount at stake, and your best response strategy.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'serious',
    deadline: '30 days from penalty notice',
    deadlineNote: 'Penalty notices require a specific response - you need to show reasonable cause or challenge the basis. A generic reply or silence both have bad outcomes.',

    sections: [
      {
        number: '01',
        heading: 'TWO VERY DIFFERENT SECTIONS, TWO VERY DIFFERENT SITUATIONS',
        body: 'Section 271 of the Income Tax Act has multiple clauses, each addressing a different kind of non-compliance. The two you are most likely to encounter are 271(1)(b) and 271(1)(c), and they are fundamentally different situations with very different consequences.',
        bullets: [
          'Section 271(1)(b): Penalty for failure to comply with a notice - specifically, not responding to notices under Sections 142(1), 143(2), or not complying with directions under Section 142(2A). Penalty: Rs. 10,000 per default.',
          'Section 271(1)(c): Penalty for concealment of income or furnishing inaccurate particulars of income. Penalty: 100% to 300% of the tax on the concealed or inaccurately stated income. This is the serious one.',
        ],
        note: 'Source: Section 271, Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'SECTION 271(1)(B): PENALTY FOR NOT RESPONDING TO NOTICES',
        body: 'If your penalty is under Section 271(1)(b), it means you failed to respond to an earlier notice (143(2), 142(1), etc.) and the officer is now penalising you for that non-response.',
        bullets: [
          'The penalty is Rs. 10,000 per default - not per rupee of income. It is a fixed amount.',
          'Your defence: Show "reasonable cause" for the non-response. Genuine unavoidable circumstances (hospitalisation, natural disaster, technical portal failure with documentary evidence, bereavement) constitute reasonable cause under Section 273B.',
          'Even if you cannot show reasonable cause for the non-response, you can argue that the underlying assessment was correct and therefore the non-compliance caused no actual tax loss to the government.',
          'In practice, many 271(1)(b) penalties are imposed routinely and an application showing that the taxpayer engaged subsequently (even if late) often results in the penalty being waived or reduced in appeal.',
        ],
      },
      {
        number: '03',
        heading: 'SECTION 271(1)(C): CONCEALMENT PENALTY - THE SERIOUS ONE',
        body: 'Section 271(1)(c) is initiated when the assessing officer believes you either concealed income or furnished incorrect particulars in your return. This is the penalty that can be 100% to 300% of the tax on the concealed amount.',
        bullets: [
          'When is it triggered: Income that was discovered during scrutiny or reassessment that was not in your original return. Incorrect claims (deductions, exemptions) that were found to be wrong.',
          'Key distinction - what is and is not "concealment": Deliberate concealment (not declaring cash income, suppressing business receipts, claiming false deductions) = clear 271(1)(c) territory. Genuine bonafide disputes about characterisation of income, valuation differences, legal interpretations = arguable that this is not concealment.',
          'The "bonafide belief" defence: If you disclosed all material facts and took a particular legal position in good faith (even if later found to be wrong), this is generally NOT concealment. Courts have consistently held that legitimate tax positions, even if incorrect, do not attract 271(1)(c).',
          'Immunity under Section 270AA: If you agree with the assessment and pay the tax and interest within the time allowed, you can file an application under Section 270AA for immunity from 271(1)(c) penalty. This is available for non-fraud cases under Section 270A.',
        ],
        note: 'Section 270A replaced the concealment penalty provisions for assessments from AY 2017-18 onwards. If your case involves AY 2016-17 or earlier, Section 271(1)(c) in its older form applies.',
      },
      {
        number: '04',
        heading: 'HOW TO RESPOND TO A PENALTY NOTICE',
        body: '',
        bullets: [
          'File a detailed written reply: Address specifically whether the conditions for penalty are met. This is not the stage to be vague.',
          'For 271(1)(b): Show the reasonable cause. Attach documentary evidence of the genuine obstacle to compliance.',
          'For 271(1)(c): Make the bonafide belief argument if applicable. Provide documentation showing that the position taken in the return was a legitimate interpretation of the law, not a deliberate concealment.',
          'If there was genuine concealment: Consider applying under Section 270AA for immunity if the case qualifies. Paying the tax and accepting the assessment while seeking penalty immunity is often more cost-effective than fighting both the assessment and the penalty.',
          'Appeal: If the penalty is confirmed after your reply, you can appeal to the Commissioner of Income Tax (Appeals) under Section 246A within 30 days.',
        ],
      },
    ],

    faqs: [
      {
        q: 'I received a 271(1)(c) penalty notice for Rs. 12 lakh. The tax on the added income was Rs. 4 lakh. Is the 100% penalty minimum correct?',
        a: 'Under the older 271(1)(c) provisions, the penalty range is 100% to 300% of the tax (not the income amount). Rs. 4 lakh tax * 100% minimum = Rs. 4 lakh penalty. If the officer is imposing Rs. 12 lakh, they may be applying a 300% rate. The rate within the 100%-300% range is the officer\'s discretion, but you can argue for the minimum 100% in your reply and appeal.',
      },
      {
        q: 'Can both the assessment and the penalty be appealed simultaneously?',
        a: 'Yes. And typically, if the underlying assessment is overturned in appeal, the penalty notice falls automatically. Appeal the assessment first if you have strong grounds - a successful assessment appeal often eliminates the penalty entirely.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Help Contesting Penalty Notice', href: '/checkout/itr-notice-response' },
      secondary: { label: 'Appeal Against Income Tax Demand', href: '/checkout/itr-notice-response' },
    },

    relatedNotices: ['income-tax-143-2-scrutiny', 'income-tax-142-1-notice', 'income-tax-131-summons'],
    relatedTools: ['/tools/penalty-calculator/itr'],
  },

  // ============================================================

  {
    slug: 'income-tax-131-summons',
    title: 'Income Tax Section 131 Summons: What to Do When You Are Called In',
    seoTitle: 'Income Tax Section 131 Summons 2025: How to Respond | Ollvy',
    seoDescription: 'Got an Income Tax Section 131 summons? This is the highest level of individual notice in routine tax proceedings. Understand what is expected and how to appear.',
    lastReviewed: 'March 2025',
    category: 'Income Tax',
    severity: 'urgent',
    deadline: 'Date and time specified in the summons',
    deadlineNote: 'Non-compliance with a Section 131 summons is a criminal offence under Section 131(1A). Appear, or send a duly authorised representative.',

    sections: [
      {
        number: '01',
        heading: 'THIS IS THE INCOME TAX EQUIVALENT OF A COURT SUMMONS',
        body: 'Under Section 131 of the Income Tax Act, income tax authorities have the same powers as a civil court when it comes to: requiring the attendance of any person and examining them on oath, requiring the production of any books of accounts, documents, or papers, issuing commissions, and receiving evidence on affidavits.\n\nA Section 131 summons requires your personal attendance (or that of your authorised representative) before the income tax officer on a specific date and time. It may ask you to bring specific documents.',
        note: 'Source: Section 131, Income Tax Act, 1961.',
      },
      {
        number: '02',
        heading: 'WHY SECTION 131 SUMMONS ARE ISSUED',
        body: '',
        bullets: [
          'During scrutiny assessment: The officer wants to examine you on oath about specific transactions or entries in your return. This is more intensive than a written query.',
          'During investigation: Your name has come up in a survey, search, or investigation at another person\'s or entity\'s premises and the officer wants your statement.',
          'Third-party summons: The officer is examining you as a witness about transactions with a third party under investigation. You are not the subject of the investigation.',
          'Survey proceedings under Section 133A: After a survey at your business, the officer wants to examine specific persons in the organisation.',
          'High-value transaction enquiry: The officer wants a personal explanation about a large or unusual transaction that appears in your AIS.',
        ],
      },
      {
        number: '03',
        heading: 'HOW TO PREPARE FOR AND APPEAR AT A SECTION 131 EXAMINATION',
        body: 'Appearing before an income tax officer for examination is a formal legal proceeding. Treat it seriously.',
        bullets: [
          'Do not go alone: Engage a CA or tax advocate and have them accompany you as your authorised representative. Under Section 288 of the IT Act, you can be represented by a CA or advocate.',
          'Review the summons carefully: It will specify what documents to bring and (sometimes) the specific issues to be examined. Prepare these thoroughly.',
          'Know what you are going to say: Discuss with your CA what answers are appropriate for the likely questions. Do not speculate or guess - if you do not know the answer to a question, say so.',
          'Be truthful: You are being examined on oath. False statements constitute perjury, which is a criminal offence under Section 193 of the Indian Penal Code.',
          'Take notes: During the examination, ask for a copy of the statement recorded. Everything that is recorded becomes part of the official proceedings.',
          'Do not bring more than what is asked: If the summons asks for three years of bank statements, bring those. Do not bring additional records that were not asked for - they may open new avenues of enquiry.',
        ],
      },
      {
        number: '04',
        heading: 'WHAT HAPPENS IF YOU DO NOT APPEAR',
        body: 'Non-compliance with a Section 131 summons is not like ignoring a notice.',
        bullets: [
          'Criminal offence under Section 131(1A): Wilful failure to comply with a summons or produce documents is an offence punishable with up to 1 year imprisonment and/or fine.',
          'The officer can proceed ex-parte: The examination or assessment proceeds without your participation, typically in the most unfavourable manner.',
          'Prosecution under Section 276: Separately from Section 131(1A), persistent defiance of summons can result in prosecution.',
          'If you cannot appear on the scheduled date: Write immediately to the officer requesting a postponement with a specific reason. Officers generally accommodate genuine circumstances.',
        ],
      },
    ],

    faqs: [
      {
        q: 'I received a Section 131 summons as a third party - about a client\'s transactions, not mine. Do I have to appear?',
        a: 'Yes. Section 131 summons apply to any person - not just the taxpayer under assessment. If you are summoned as a third party, you must appear and truthfully answer questions about the specific transactions you have knowledge of. You can have a CA or advocate accompany you.',
      },
      {
        q: 'The Section 131 summons asks me to bring all books of accounts for 5 years. That is thousands of pages. What do I do?',
        a: 'You are required to produce what was asked. For very large volumes, write to the officer in advance to discuss a practical arrangement (e.g., production in batches, digital copies). Officers are generally practical about this. Do not use volume as a reason to not produce the records - that is non-compliance.',
      },
    ],

    cta: {
      primary: { label: 'Get CA Representation for Section 131 Appearance', href: '/checkout/itr-notice-response' },
      secondary: { label: 'Understand Scrutiny Assessment Process', href: '/notices/income-tax-143-2-scrutiny' },
    },

    relatedNotices: ['income-tax-143-2-scrutiny', 'income-tax-148-148a-reopening', 'income-tax-271-penalty'],
    relatedTools: [],
  },

  // ============================================================
  // MCA / ROC NOTICES
  // ============================================================

  {
    slug: 'roc-annual-filing-default-notice',
    title: 'ROC / MCA Show Cause Notice for Annual Filing Default',
    seoTitle: 'ROC Annual Filing Default Notice 2025: Director Disqualification Risk | Ollvy',
    seoDescription: 'Got an ROC or MCA show cause notice for not filing annual returns? Understand the director disqualification risk, penalties, and how to regularise before it is too late.',
    lastReviewed: 'March 2025',
    category: 'MCA',
    severity: 'urgent',
    deadline: '15-30 days as specified in notice',
    deadlineNote: 'If defaults continue for 3 consecutive years, directors are disqualified under Section 164(2). Disqualification affects all directorships, not just the defaulting company.',

    sections: [
      {
        number: '01',
        heading: 'THIS IS NOT JUST ABOUT PAPERWORK - DIRECTORS CAN BE DISQUALIFIED',
        body: 'Every Private Limited Company is required to file two annual returns with the Ministry of Corporate Affairs (MCA): AOC-4 (Financial Statements including Balance Sheet, P&L, and auditor\'s report) and MGT-7 (Annual Return showing shareholding, directors, etc.).\n\nWhen these are not filed, the Registrar of Companies (ROC) issues a notice under Section 234 of the Companies Act, 2013. If defaults continue for three consecutive financial years, every director of the defaulting company is disqualified under Section 164(2) - meaning they cannot be appointed as a director in any company for 5 years.',
        note: 'Source: Sections 92, 137, 164(2), 234, Companies Act 2013.',
      },
      {
        number: '02',
        heading: 'WHAT EXACTLY ARE THE FILING OBLIGATIONS',
        body: '',
        bullets: [
          'AOC-4 (Financial Statements): Must be filed within 30 days of the AGM (Annual General Meeting). The AGM must be held within 6 months of the close of the financial year. So for FY 2023-24 (ending March 31, 2024), the AGM should be held by September 30, 2024, and AOC-4 filed by October 30, 2024.',
          'MGT-7 (Annual Return): Must be filed within 60 days of the AGM. Using the same example: deadline is November 29, 2024.',
          'MGT-8 (Certification by Company Secretary): Required for listed companies and companies with paid-up capital above Rs. 10 crore or turnover above Rs. 50 crore.',
          'ADT-1 (Auditor appointment): Filed within 15 days of the AGM where auditors are appointed.',
        ],
        note: 'Every year of non-filing separately attracts penalties. The three consecutive years rule for disqualification is cumulative.',
      },
      {
        number: '03',
        heading: 'THE PENALTY STRUCTURE',
        body: 'Penalties for late filing have a base amount plus a per-day component.',
        bullets: [
          'AOC-4 (Financial Statements - Section 137): Company penalty of Rs. 10,000 plus Rs. 100 per day of default. Director penalty: Rs. 10,000 plus Rs. 100 per day. No cap mentioned in the Act, though practical limits exist.',
          'MGT-7 (Annual Return - Section 92): Company: Rs. 10,000 plus Rs. 100 per day. Director/KMP: Rs. 10,000 to Rs. 2 lakh.',
          'Additional fee on MCA portal: The MCA portal charges additional fees for delayed filing on a slab basis. For delays above 720 days, the additional fee can be 12 times the normal filing fee.',
          'The ROC notice will specify the total penalty being demanded.',
        ],
        note: 'Use our penalty calculator for specific MCA penalty amounts: /tools/penalty-calculator/mca',
      },
      {
        number: '04',
        heading: 'HOW TO RESPOND AND REGULARISE',
        body: '',
        bullets: [
          'Step 1 - File all pending returns immediately: Even before responding to the notice, get your financial statements prepared (this requires your auditor), hold the board meeting to approve them, hold the AGM, and then file AOC-4 and MGT-7. The filing must happen before you can meaningfully respond.',
          'Step 2 - File the ROC response: Once filings are done, respond to the notice with the filing details, late fees paid, and an explanation for the delay (even genuine ones: difficulty getting auditors, COVID disruption for earlier years, key person absence).',
          'Step 3 - Address any penalty demand: If the ROC has issued a specific penalty amount, pay it through the MCA portal.',
          'Step 4 - Check director disqualification status: If the default has been running for 3 or more years, check whether DIN disqualification has already been triggered by looking up DIN status on the MCA portal.',
        ],
        note: 'For companies that have not filed for multiple years, consider the Companies Fresh Start Scheme (CFSS) if it is currently active - the MCA periodically runs amnesty schemes with reduced penalties for regularising defaults.',
      },
      {
        number: '05',
        heading: 'WHAT DIRECTOR DISQUALIFICATION UNDER SECTION 164(2) MEANS IN PRACTICE',
        body: 'If you are disqualified:',
        bullets: [
          'You cannot be appointed or continue as director of any company for 5 years from the date of disqualification',
          'This affects ALL your directorships - you must vacate directorship in every company, not just the defaulting one',
          'Banks often run DIN status checks during director due diligence for loans',
          'SEBI registered entities and listed companies check for director disqualification',
          'Restoring the directorship requires filing a representation with the ROC and separately with each company\'s board',
        ],
      },
    ],

    faqs: [
      {
        q: 'Our company has been inactive for 3 years and we have not filed any returns. Is it too late?',
        a: 'Not necessarily. You have options: (a) regularise all pending filings (expensive in fees for multiple years but clears the record), (b) apply for striking off the company as a defunct company under Section 248 (easier, but requires at least 2 years of zero activity and bank account closure), or (c) apply to the NCLT to have the company wound up. Each option has different cost and consequence implications - get professional guidance.',
      },
      {
        q: 'I am a director in 6 companies. If one company defaults for 3 years and my DIN is disqualified, am I automatically removed from all 6?',
        a: 'Yes. Section 164(2) disqualification attaches to your DIN and applies to all companies where you are a director. You must vacate all directorships within 30 days of the default being completed. Each company where you are a director must then fill your position. This is why catching annual filing defaults early matters so much.',
      },
    ],

    cta: {
      primary: { label: 'File Pending MCA Annual Returns', href: '/checkout/mca-annual-filing' },
      secondary: { label: 'Check Director Disqualification Status', href: '/checkout/mca-annual-filing' },
    },

    relatedNotices: ['dir-3-kyc-din-deactivation', 'income-tax-143-1-intimation'],
    relatedTools: ['/tools/penalty-calculator/mca'],
  },

  // ============================================================

  {
    slug: 'dir-3-kyc-din-deactivation',
    title: 'DIR-3 KYC Notice: Director DIN Deactivation',
    seoTitle: 'DIR-3 KYC Not Filed: DIN Deactivation Notice 2025 | Ollvy',
    seoDescription: 'Got a notice about DIN deactivation due to DIR-3 KYC non-filing? Understand how to reactivate your Director Identification Number and what you cannot do while deactivated.',
    lastReviewed: 'March 2025',
    category: 'MCA',
    severity: 'serious',
    deadline: 'DIR-3 KYC must be filed annually by September 30',
    deadlineNote: 'Once DIN is deactivated, you cannot sign any company documents, file any MCA forms, or appear as an active director on records - until it is restored.',

    sections: [
      {
        number: '01',
        heading: 'YOUR DIRECTOR IDENTIFICATION NUMBER HAS BEEN DEACTIVATED',
        body: 'Every director of an Indian company holds a Director Identification Number (DIN) issued by MCA. To keep this DIN active, you must file DIR-3 KYC (Know Your Customer verification) every year by September 30.\n\nIf you missed the September 30 deadline, the MCA system automatically deactivates your DIN. You will receive an intimation about this. Your DIN status on the MCA portal will show as "Deactivated due to non-filing of DIR-3 KYC."',
        note: 'Source: Rule 12A and 12B, Companies (Appointment and Qualification of Directors) Rules, 2014.',
      },
      {
        number: '02',
        heading: 'WHAT HAPPENS WHEN YOUR DIN IS DEACTIVATED',
        body: '',
        bullets: [
          'You cannot be reflected as an active director in any MCA filing',
          'Any MCA form you sign as director will be rejected if your DIN shows as deactivated',
          'Annual returns (AOC-4, MGT-7) cannot be filed for your company if the sole director\'s DIN is deactivated - this creates a cascading annual filing default',
          'Board resolutions and other company documents that require your DIN will be problematic',
          'Banks doing director due diligence will see the deactivated DIN as a compliance flag',
        ],
      },
      {
        number: '03',
        heading: 'HOW TO REACTIVATE YOUR DIN',
        body: 'Reactivation requires filing DIR-3 KYC with a late fee.',
        bullets: [
          'Late filing fee: Rs. 5,000 if filed after September 30 but before the filing opens again (typically October onwards, with fee). The fee is fixed regardless of how many days late.',
          'Documents needed for DIR-3 KYC: PAN, Aadhaar, current address proof, mobile number OTP verification, email OTP verification. If filed by a CA/CS, their digital signature is also needed.',
          'File on the MCA portal: Log in to mca.gov.in, go to the DIR-3 KYC service, complete the form with verified documents, and pay the fee.',
          'Processing time: DIN reactivation is typically immediate or within 24 hours of successful DIR-3 KYC filing with fee.',
          'Annual commitment: Once reactivated, file DIR-3 KYC every year before September 30 to avoid this happening again. It takes about 10 minutes.',
        ],
      },
      {
        number: '04',
        heading: 'DIR-3 KYC-WEB VS DIR-3 KYC: WHICH DO YOU FILE',
        body: 'There are two variants:',
        bullets: [
          'DIR-3 KYC (eForm): Full KYC for first-time filing or when your details have changed (new PAN, new address, new mobile number, etc.). Requires digital signature of a professional (CA/CS).',
          'DIR-3 KYC-Web: Annual renewal for directors whose details have not changed. A simpler web-based form requiring only OTP verification on the registered mobile and email. No professional signature needed.',
          'Most directors do DIR-3 KYC-Web for annual renewal unless there is a change in personal details. First-time KYC (when DIN was newly issued) requires the full eForm.',
        ],
      },
    ],

    faqs: [
      {
        q: 'I have 3 DINs from different periods. Do I need to file DIR-3 KYC for all of them?',
        a: 'Having more than one DIN is actually an offence under the Companies Act. If you have multiple DINs, you must surrender the additional ones and retain only one. Once surrendered, you only file KYC for the retained DIN.',
      },
      {
        q: 'I stopped being a director 2 years ago. Do I still need to file DIR-3 KYC?',
        a: 'If you have resigned from all directorial positions and are no longer a director in any company, you can request surrender of your DIN. Post-surrender, no KYC filings are needed. However, as long as your DIN is active (even if you are no longer a director), the annual KYC requirement continues.',
      },
      {
        q: 'My DIN was deactivated and now the company cannot file its annual returns. Who is responsible?',
        a: 'As the director whose DIN is deactivated, you are responsible for filing DIR-3 KYC to restore it. The company\'s filing obligations remain unchanged regardless of DIN status - so the company is also accumulating annual filing defaults while this is unresolved. Restore the DIN and then file all company returns together.',
      },
    ],

    cta: {
      primary: { label: 'File DIR-3 KYC and Reactivate DIN', href: '/checkout/director-kyc' },
      secondary: { label: 'File Pending MCA Annual Returns', href: '/checkout/mca-annual-filing' },
    },

    relatedNotices: ['roc-annual-filing-default-notice'],
    relatedTools: ['/tools/penalty-calculator/mca'],
  },

];

export default noticePages;
