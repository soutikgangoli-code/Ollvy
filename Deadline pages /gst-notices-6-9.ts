// ─── GST NOTICE PAGES 6-9 ────────────────────────────────────────────────────

// ─── 6. GST REG-17 ───────────────────────────────────────────────────────────

export const gstReg17Updates = {
  slug: 'gst-reg-17-cancellation-notice',
  seoTitle: 'GST REG-17 Cancellation Notice: How to Respond (2025) | Ollvy',
  seoDescription: 'A GST REG-17 notice means your registration may be cancelled. You have 7 working days to reply in Form REG-18. No reply results in a REG-19 cancellation order.',

  sections: [
    {
      number: '01',
      heading: 'YOUR GST REGISTRATION IS AT RISK',
      body: 'REG-17 is a Show Cause Notice for cancellation of your GST registration. The GST officer has grounds to believe your registration should be cancelled and is giving you one chance to explain why it should not be.\n\nYou have 7 working days to file your reply in Form REG-18 on the GST portal.\n\nIf you do not reply, the officer will issue REG-19 (cancellation order). Once your GSTIN is cancelled, you cannot charge GST on your invoices, you cannot claim Input Tax Credit, and your clients who are GST-registered businesses will face ITC rejection on your past invoices.',
      note: 'Source: Section 29(2), Central Goods and Services Tax Act, 2017. Rule 22, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'WHY GST REGISTRATIONS GET CANCELLED',
      body: 'The officer can issue REG-17 for any of these reasons.',
      bullets: [
        'Non-filing of returns: You have not filed GST returns for 6 or more consecutive months. This is the most common trigger',
        'Fraudulent registration: The registration was obtained using false information, fake documents, or a non-existent business',
        'Business discontinued: Your business has been closed, sold, or transferred without applying for cancellation',
        'Constitution change: A partnership dissolved, a sole proprietor died, or a company was wound up without updating the GSTIN',
        'Registration obtained voluntarily but business not commenced within 6 months',
        'GSTIN found in databases of shell companies or fake invoice issuers',
      ],
    },
    {
      number: '03',
      heading: 'YOUR 7-DAY WINDOW: WHAT YOUR REPLY MUST DO',
      body: 'Your reply in REG-18 must specifically address the ground mentioned in the REG-17 notice.\n\nFor non-filing of returns: File all pending returns immediately before or alongside your reply. A reply saying "I will file shortly" is insufficient. The officer needs to see that the returns are filed before they will consider retaining your registration.\n\nFor fraudulent registration allegation: Present evidence that your business is genuine. Rent agreement, bank account statements, stock photographs, client invoices, Udyam certificate.\n\nFor discontinued business: If the business continues under a different structure, apply for fresh registration for the new entity and apply for cancellation of the old one rather than fighting REG-17.\n\nAlways include a personal appearance request: request a personal hearing before any adverse order is passed.',
      note: 'File your reply on the GST portal: Services > Registration > Application for Filing Clarification (REG-18). Attach all documents within the 7 working day window.',
    },
    {
      number: '04',
      heading: 'THE BUSINESS IMPACT OF GSTIN CANCELLATION',
      body: 'This is why replying within 7 days matters so much.',
      bullets: [
        'You cannot issue tax invoices or collect GST from the date of cancellation',
        'Your customers cannot claim ITC on invoices you issued after suspension or cancellation',
        'If your GSTIN shows as "cancelled" on the GST portal, clients may retroactively question invoices from the period before cancellation',
        'Government tenders, e-commerce platforms, and corporate procurement processes require an active GSTIN',
        'Banking and loan facilities tied to your GSTIN can be affected',
      ],
    },
    {
      number: '05',
      heading: 'IF REG-19 IS ALREADY ISSUED: HOW TO REVOKE CANCELLATION',
      body: 'If you received REG-17, did not respond in time, and cancellation has already been ordered (REG-19), you can apply for revocation of cancellation.\n\nFor cancellations due to non-filing: File all pending returns first. Then apply for revocation of cancellation in Form REG-21 within 90 days of the cancellation order.\n\nThe department has discretion to approve or reject revocation. If it is rejected, you can appeal to the Appellate Authority.\n\nIf revocation is not possible, you will need to apply for a fresh registration, which will require re-verification and may face additional scrutiny given the prior cancellation history.',
    },
  ],

  faqs: [
    {
      q: 'I have been filing returns but I still received REG-17 for non-filing. How is that possible?',
      a: 'Check: Were all your returns filed correctly and fully, or were some filed as nil returns when you had actual supplies? Is there a system glitch showing your returns as unfiled despite being filed? Check the return filing status on the portal. If returns are filed, attach the filed return acknowledgements in your REG-18 reply.',
    },
    {
      q: 'My supplier received a REG-17 and their GSTIN may be cancelled. What does this mean for my ITC?',
      a: 'You may face ITC reversal for invoices from this supplier if their registration is cancelled retroactively. Keep all documentation showing that you received the goods or services, paid for them, and the payment was made before the cancellation date.',
    },
    {
      q: 'I received REG-17 but my business has genuinely closed. Should I fight it or let the cancellation happen?',
      a: 'If the business is genuinely closed, apply for voluntary cancellation (REG-16) yourself. Do not let REG-17 cancel it. A self-cancelled registration shows responsible compliance behaviour. A forced cancellation under REG-17 creates a negative compliance record attached to your PAN.',
    },
  ],

  sources: [
    {
      name: 'CGST Act, 2017 (Section 29(2))',
      url: 'https://www.gst.gov.in',
      description: 'Cancellation of registration by proper officer',
    },
    {
      name: 'CGST Rules, 2017 (Rule 22)',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Procedure for cancellation of registration and REG-18 reply',
    },
  ],
}


// ─── 7. GST REG-31 ───────────────────────────────────────────────────────────

export const gstReg31Updates = {
  slug: 'gst-reg-31-suspension',
  seoTitle: 'GST REG-31 Suspension Notice: What to Do Now (2025) | Ollvy',
  seoDescription: 'A GST REG-31 notice means your registration is suspended. You cannot issue invoices or claim ITC while suspended. REG-17 cancellation notice follows within 30 days if you do not act.',

  sections: [
    {
      number: '01',
      heading: 'YOUR GSTIN IS SUSPENDED',
      body: 'REG-31 is a suspension notice. Your GST registration has been temporarily put on hold pending further action. Suspension is not cancellation, but it is the step before cancellation.\n\nWhile suspended, you cannot file GSTR-1 (outward supplies), file GSTR-3B (tax payment), issue tax invoices with valid GST, or claim or utilise Input Tax Credit.\n\nIn practical terms, your GST operations are frozen until the suspension is lifted or the registration is cancelled.',
      note: 'Source: Rule 21A, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'WHY SUSPENSIONS HAPPEN',
      body: 'The system or officer suspends registrations for these reasons.',
      bullets: [
        'Return non-filing: The system may auto-suspend before the officer issues REG-17',
        'Voluntary cancellation pending: You applied for voluntary cancellation (REG-16) and the registration is suspended while your application is processed',
        'Suo-motu cancellation process initiated: The officer has reason to believe your registration should be cancelled and has initiated proceedings',
        'Discrepancy in registration details: The department found inconsistencies in your registration (address, PAN, bank account) that require verification',
      ],
    },
    {
      number: '03',
      heading: 'WHAT COMES NEXT AND HOW LONG YOU HAVE',
      body: 'Once REG-31 is issued, the officer must issue REG-17 (show cause notice for cancellation) within 30 days. If REG-17 is not issued within 30 days, the suspension is deemed to be revoked automatically.\n\nYour path forward: file all pending returns immediately. This is the single most effective step. Respond to any discrepancies the department has flagged. Wait for REG-17 and respond within 7 working days when it arrives. If no REG-17 arrives within 30 days, confirm that your suspension has been lifted on the portal.',
      note: 'Source: Rule 21A(4), CGST Rules 2017: "Where no order is issued within a period of thirty days, the suspension shall be deemed to be revoked."',
    },
    {
      number: '04',
      heading: 'WHAT YOU CAN STILL DO WHILE SUSPENDED',
      body: 'Suspension does not lock you out of the portal completely.',
      bullets: [
        'You can log in to the GST portal',
        'You can file GSTR-9 (annual return) for past periods if it was pending',
        'You can pay any outstanding tax through DRC-03 (voluntary payment)',
        'You can submit replies to notices',
        'You can apply for revocation if cancellation has already been ordered',
      ],
    },
    {
      number: '05',
      heading: 'THE IMPACT ON YOUR CUSTOMERS WHILE YOU ARE SUSPENDED',
      body: 'Every day your GSTIN is suspended, your customers are affected. Invoices issued during suspension are not valid tax invoices. Your customers cannot claim ITC on them.\n\nIf you supply to GST-registered businesses and your GSTIN shows as "suspended" on the portal, your customers may refuse to accept invoices or put payments on hold until the suspension is resolved. For B2B businesses, this can cause immediate cash flow disruption.\n\nThe faster you resolve the suspension, the smaller this impact is.',
    },
    {
      number: '06',
      heading: 'IF SUSPENSION TURNS INTO CANCELLATION',
      body: 'If REG-17 is issued and you do not respond (or your response is rejected), the officer will issue REG-19 (cancellation order). Your suspension converts to permanent cancellation from a retrospective date, often the date of suspension or earlier.\n\nYou can apply for revocation within 90 days of the cancellation order. If revocation is rejected, your only option is a fresh registration.',
    },
  ],

  faqs: [
    {
      q: 'My registration shows "Suspended" on the portal but I did not receive any notice. What happened?',
      a: 'Check your registered email and SMS. The notice may have been served electronically. Also check the "View Notices and Orders" section on the GST portal under Services > User Services. The notice is legally served once it appears on the portal, regardless of whether you received an email.',
    },
    {
      q: 'Can my customers claim ITC on invoices I issued while I was suspended?',
      a: 'No. Invoices issued during suspension are not valid tax invoices. Your customers cannot claim ITC on them. This is why resolving suspension quickly is critical.',
    },
    {
      q: 'I filed all pending returns. How long before the suspension is lifted?',
      a: 'If the suspension was due to non-filing and there are no other grounds for cancellation, the officer should revoke it after verifying your returns. This typically takes a few days to 2 weeks. Follow up with the jurisdictional officer if it is not lifted within 7 working days of filing.',
    },
  ],

  sources: [
    {
      name: 'CGST Rules, 2017 (Rule 21A)',
      url: 'https://www.gst.gov.in',
      description: 'Suspension of registration provision and automatic revocation rule',
    },
    {
      name: 'CBIC GST Portal',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Official GST compliance and notice tracking portal',
    },
  ],
}


// ─── 8. GST GSTR-2B ITC Mismatch ─────────────────────────────────────────────

export const gstGstr2bUpdates = {
  slug: 'gst-gstr2b-itc-mismatch',
  seoTitle: 'GSTR-2B ITC Mismatch: How to Resolve Blocked Credit (2025) | Ollvy',
  seoDescription: 'ITC claims exceeding your GSTR-2B are blocked under Section 16(2)(aa). Reconcile your purchase register with GSTR-2B every month before filing GSTR-3B to avoid demands.',

  sections: [
    {
      number: '01',
      heading: 'WHAT GSTR-2B IS AND WHY IT MATTERS',
      body: 'GSTR-2B is an auto-generated statement that shows the Input Tax Credit available to you based on what your suppliers have filed in their GSTR-1. It is generated on the 14th of every month for the previous month.\n\nFrom January 2022, Section 16(2)(aa) of the CGST Act makes GSTR-2B the definitive document for ITC claims. You can only claim ITC on invoices that appear in your GSTR-2B. If your supplier has not filed their return or has not included your invoice, you cannot claim that credit, regardless of whether you have the invoice and have paid for the goods or services.',
      note: 'Source: Section 16(2)(aa), CGST Act 2017; Rule 36(4), CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'WHY YOUR ITC CLAIM MAY EXCEED GSTR-2B',
      body: 'The mismatch usually comes from one of these situations.',
      bullets: [
        'Supplier has not filed GSTR-1: Your supplier issued you an invoice but has not filed their return for that month',
        'Invoice date vs filing period mismatch: The invoice is dated in one month but the supplier reported it in a different month\'s GSTR-1',
        'Supplier filed with errors: Wrong GSTIN, wrong invoice number, or wrong amount causing the invoice to not appear correctly in your 2B',
        'Supplier\'s registration was cancelled or suspended: Invoices from cancelled GSTINs may not reflect in your 2B',
        'Duplicate invoice in your books: The same invoice entered twice in your accounting',
      ],
    },
    {
      number: '03',
      heading: 'THE MONTHLY RECONCILIATION PROCESS',
      body: 'Before filing GSTR-3B, you must reconcile your purchase register with GSTR-2B. Download GSTR-2B from the portal on or after the 14th. Compare it line by line with your purchase register. Identify invoices that appear in your books but not in 2B.\n\nFor each missing invoice, determine whether it is (a) a timing difference where the supplier will file later, (b) a supplier error with wrong details, or (c) potentially unclaimed credit. Claim only what appears in 2B, or document the excess claim with a clear reconciliation.',
      note: 'If you claim more ITC than what is in GSTR-2B, you must be prepared to justify it. Officers are now matching claims to 2B automatically.',
    },
    {
      number: '04',
      heading: 'HOW TO FOLLOW UP WITH NON-COMPLIANT SUPPLIERS',
      body: 'When invoices are missing from GSTR-2B, the most effective first step is direct supplier follow-up. Most mismatches resolve when the supplier files their pending GSTR-1 or corrects an error in their next filing.\n\nDocument everything: keep records of your follow-up (emails, WhatsApp messages) showing you attempted to get the supplier to comply. This documentation matters if you ever face a demand notice for the claimed ITC.\n\nIf a supplier is consistently non-compliant, consider whether the relationship is worth the ITC risk. Buying from GST-compliant suppliers is the only way to guarantee clean ITC.',
    },
    {
      number: '05',
      heading: 'WHAT TO DO ABOUT MISSING INVOICES',
      body: 'Contact the supplier immediately. Most mismatches are resolved by simply asking the supplier to file their pending GSTR-1 or correct the error in their next filing.\n\nIf the invoice appears in a later month\'s 2B, you can claim it then, subject to the time limit under Section 16(4). The ITC time limit allows claims up to November 30 following the end of the financial year, or the date of filing the annual return, whichever is earlier.',
    },
    {
      number: '06',
      heading: 'WHEN ITC IS GENUINELY UNAVAILABLE',
      body: 'In some cases, ITC cannot be claimed even if you have a valid invoice.',
      bullets: [
        'Supplier has permanently stopped filing and their GSTIN is cancelled',
        'Invoice is for blocked credit items under Section 17(5): food and beverages, club memberships, certain vehicles',
        'Invoice is beyond the time limit for claiming',
        'Supplier is flagged as a fake invoice issuer',
      ],
      note: 'If you have already claimed ITC and it is subsequently found to be ineligible, you must reverse it with interest at 18 percent per annum from the date of wrong availment.',
    },
  ],

  faqs: [
    {
      q: 'I have a valid invoice and proof of payment. Why can I not claim ITC if it is not in GSTR-2B?',
      a: 'Section 16(2)(aa) ties your ITC entitlement to what your supplier files, not what you received. Courts have given some relief in specific cases, but as a practical matter, your ITC is blocked until the invoice appears in 2B. Follow up aggressively with suppliers.',
    },
    {
      q: 'My supplier says they filed but the invoice is still not in my 2B. What now?',
      a: 'Ask the supplier for a screenshot of their GSTR-1 showing the invoice. Check if they filed with the correct GSTIN. If there is a mismatch, the supplier needs to amend in their next GSTR-1. If they filed correctly but it is still not appearing, escalate to the GST helpdesk.',
    },
    {
      q: 'I claimed ITC in GSTR-3B that was not in my GSTR-2B. Now I have received a notice. What do I do?',
      a: 'Check whether the ITC has since appeared in a subsequent GSTR-2B. If it has, your claim may be justifiable with a reconciliation. If it has not, you need to reverse the excess claim in your next GSTR-3B with interest at 18 percent per annum from the date of the original claim.',
    },
  ],

  sources: [
    {
      name: 'CGST Act, 2017 (Section 16(2)(aa))',
      url: 'https://www.gst.gov.in',
      description: 'ITC eligibility condition tied to GSTR-2B availability',
    },
    {
      name: 'CGST Rules, 2017 (Rule 36(4))',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'Conditions for claiming ITC and reconciliation requirements',
    },
  ],
}


// ─── 9. GSTR-9 Annual Return Mismatch ────────────────────────────────────────

export const gstGstr9Updates = {
  slug: 'gst-gstr9-annual-return-mismatch',
  seoTitle: 'GSTR-9 Annual Return Mismatch: How to Reconcile (2025) | Ollvy',
  seoDescription: 'Discrepancies between your GSTR-9 annual return and monthly filings trigger ASMT-10 scrutiny notices. Reconcile before filing and pay any difference through DRC-03 to avoid demands.',

  sections: [
    {
      number: '01',
      heading: 'WHAT GSTR-9 IS AND WHY MISMATCHES MATTER',
      body: 'GSTR-9 is the annual return that consolidates all your monthly GSTR-1 and GSTR-3B filings for the financial year. It is due by December 31 following the end of the financial year.\n\nThe department uses GSTR-9 to cross-verify your monthly filings. Any discrepancy between what you reported in monthly returns and what appears in the annual return is a red flag. Significant mismatches trigger ASMT-10 scrutiny notices.',
      note: 'Source: Section 44, CGST Act 2017; Rule 80, CGST Rules 2017.',
    },
    {
      number: '02',
      heading: 'COMMON SOURCES OF GSTR-9 MISMATCHES',
      body: 'Most GSTR-9 discrepancies come from one of these situations.',
      bullets: [
        'Amendments filed in monthly returns not reflected in annual totals: If you amended invoices in GSTR-1, GSTR-9 needs to capture both the original and amended values correctly',
        'ITC reversals and re-claims: ITC reversed in one month and re-claimed in another needs to be shown correctly in the annual reconciliation',
        'Credit notes and debit notes: These must be netted against the original supply values',
        'Turnover rounding differences: Small differences between accounting software and GST portal calculations can accumulate over 12 months',
        'Tax paid through DRC-03: Voluntary payments made outside of regular returns must be accounted for',
        'RCM transactions: Reverse charge supplies and the corresponding ITC claims need special attention',
      ],
    },
    {
      number: '03',
      heading: 'THE RECONCILIATION TABLES IN GSTR-9',
      body: 'GSTR-9 includes specific reconciliation tables. Errors in these tables are the primary source of discrepancy notices.\n\nTable 6: ITC reconciliation, comparing what you claimed in GSTR-3B vs what was available in GSTR-2B.\nTable 9: Tax payment reconciliation, comparing tax declared in GSTR-1 vs tax paid in GSTR-3B.\nTable 14: Differential tax paid through DRC-03.\nTable 16 and 17: HSN-wise summary of inward and outward supplies.',
    },
    {
      number: '04',
      heading: 'RECONCILING GSTR-9 WITH YOUR AUDITED FINANCIALS',
      body: 'GSTR-9 must align with your audited financial statements. The turnover in your GSTR-9 should match the turnover in your P&L. Any difference needs a clear explanation: goods returned, export turnover excluded from GST, advance receipts treated differently.\n\nBefore filing GSTR-9, run a side-by-side comparison of your GSTR-1 total taxable value, your GSTR-3B total taxable value, and your audited turnover. Any difference between these three numbers needs to be documented with a reconciliation note, even if the difference is zero. Auditors and tax officers both look at this comparison.',
    },
    {
      number: '05',
      heading: 'WHAT TO DO IF YOU HAVE ALREADY FILED WITH ERRORS',
      body: 'GSTR-9 cannot be revised once filed. If you have filed with errors, your options are limited.\n\nMinor errors: Document the correct position in your records. If the error is in your favour (you reported less tax than actually paid), no action is required.\n\nErrors where you reported less tax: Pay the differential through DRC-03 with interest. Keep a reconciliation note explaining the error.\n\nErrors in ITC claim: If you over-claimed, reverse the excess in a subsequent GSTR-3B with interest. If you under-claimed, you may have lost it subject to the applicable time limits.',
    },
    {
      number: '06',
      heading: 'PREVENTING GSTR-9 ISSUES',
      body: 'Reconcile monthly, not in December. Monthly reconciliation prevents the pile-up. Use the pre-filled data: the GST portal provides pre-filled GSTR-9 based on your monthly filings. Start from this and verify against your books. Maintain a separate tracker for all amendments filed during the year. Reconcile with books before filing.',
    },
  ],

  faqs: [
    {
      q: 'The difference between my monthly filings and GSTR-9 is Rs. 5,000. Is that going to trigger a notice?',
      a: 'Small differences under Rs. 10,000 to Rs. 20,000 typically do not trigger scrutiny on their own. The system flags significant discrepancies based on percentage or absolute thresholds. However, even small differences should be documented with an explanation in your files.',
    },
    {
      q: 'I filed GSTR-9 late. What is the penalty?',
      a: 'Late fee is Rs. 200 per day (Rs. 100 CGST plus Rs. 100 SGST), capped at 0.5 percent of turnover in the state. For large turnover businesses, this can be substantial.',
    },
    {
      q: 'Do I need to file GSTR-9C (reconciliation statement) as well?',
      a: 'GSTR-9C is mandatory for taxpayers with annual aggregate turnover above Rs. 5 crore. It is a reconciliation between the annual returns filed and the audited financial statements. If your turnover is below Rs. 5 crore, GSTR-9C is optional.',
    },
  ],

  sources: [
    {
      name: 'CGST Act, 2017 (Section 44)',
      url: 'https://www.gst.gov.in',
      description: 'Annual return filing requirement and provisions',
    },
    {
      name: 'CGST Rules, 2017 (Rule 80)',
      url: 'https://cbic-gst.gov.in/gst-goods-services-rates.html',
      description: 'GSTR-9 form, reconciliation tables, and filing procedure',
    },
  ],
}
