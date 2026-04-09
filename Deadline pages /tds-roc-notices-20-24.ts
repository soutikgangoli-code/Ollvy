// ─── TDS NOTICE PAGES 20-22 ──────────────────────────────────────────────────

// ─── 20. TDS Short Deduction Notice ──────────────────────────────────────────

export const tdsShortDeductionUpdates = {
  slug: 'tds-short-deduction-notice',
  seoTitle: 'TDS Short Deduction Notice: How to Respond (2025) | Ollvy',
  seoDescription: 'A TDS short deduction notice means you deducted less TDS than required. Interest at 1 percent per month accrues from the original deduction date. Verify and respond promptly.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS A SHORT DEDUCTION NOTICE',
      body: 'A short deduction notice is issued when the department determines that you deducted TDS at a rate lower than required, or did not deduct TDS when you should have.',
      bullets: [
        'Applied wrong TDS rate (e.g., 1 percent instead of 10 percent)',
        'Applied lower rate without valid certificate (Form 15G, 15H, or lower deduction certificate under Section 197)',
        'Failed to deduct TDS on a payment that required deduction',
        'Deducted TDS but on a lower amount than the actual payment',
      ],
      note: 'Source: Sections 201, 192 to 196, Income Tax Act 1961.',
    },
    {
      number: '02',
      heading: 'CONSEQUENCES OF SHORT DEDUCTION',
      body: 'You must pay the shortfall amount. Interest at 1 percent per month accrues from the date TDS should have been deducted until the date of actual payment. This is not the date of the notice: it is the original payment date.\n\nPenalty proceedings under Section 271C (up to 100 percent of the TDS amount) apply in wilful cases. Non-wilful short deductions typically attract interest but not penalty.',
    },
    {
      number: '03',
      heading: 'HOW TO VERIFY THE DEMAND',
      body: 'Before paying, verify the demand against your own records. Check your TDS returns (Form 24Q, 26Q, 27Q) for the relevant quarter. Verify the TDS rate you applied against the rate prescribed for each payment type. Check if you had valid documentation for a lower rate (Form 15G, 15H, or Section 197 certificate). Verify the payment amounts against your books.',
    },
    {
      number: '04',
      heading: 'HOW TDS RATES ARE DETERMINED AND WHERE ERRORS COMMONLY OCCUR',
      body: 'The most common source of short deduction notices is applying 194C rates (1 to 2 percent) to payments that should have been deducted under 194J (10 percent). This happens when the nature of service is misclassified.\n\nOther frequent errors: deducting TDS on the net amount after GST instead of the gross invoice value (TDS must be on the total payment including GST in most cases), failing to deduct on part payments when the annual aggregate exceeds the threshold, and using outdated rate charts (rates change with Finance Acts).\n\nMaintain a TDS rate card that is updated after every Union Budget.',
    },
    {
      number: '05',
      heading: 'HOW TO RESPOND',
      body: 'If the demand is correct: pay the shortfall with interest through Challan 281. Then file a correction TDS return to reflect the correct deduction.\n\nIf you have valid lower deduction documentation: submit copies of Form 15G, 15H, or Section 197 certificate. The demand should be dropped if documentation is valid.\n\nIf there is a computational error in the demand: request rectification with your own calculation showing the correct amount.\n\nIf the payment was to a deductee who has already paid tax on this income: file for relief under Section 201(1) with proof of the deductee\'s tax payment and return filing.',
    },
    {
      number: '06',
      heading: 'PREVENTING FUTURE SHORT DEDUCTION NOTICES',
      body: 'Verify TDS rates before every payment. Collect Form 15G or 15H before the first payment of the financial year, not after. Maintain a TDS compliance calendar with deduction dates, deposit dates, and return filing dates. Reconcile TDS deducted with returns filed at the end of every quarter.',
    },
  ],

  faqs: [
    {
      q: 'The deductee submitted PAN but I still got a short deduction notice. Why?',
      a: 'Having PAN only determines the rate in certain sections. If you applied a rate lower than what the section prescribes (e.g., 1 percent instead of 10 percent), it is still short deduction regardless of PAN. Verify the correct rate for each payment type.',
    },
    {
      q: 'The deductee has already paid tax on this income in their return. Do I still need to pay the shortfall?',
      a: 'Yes. Your liability as deductor is independent of whether the deductee paid tax. However, under Section 201(1), you can file for relief if you can prove the deductee has paid tax and filed a return. This requires documentation from the deductee.',
    },
    {
      q: 'The short deduction is from 3 years ago. Is there any time limit on how far back they can go?',
      a: 'The department can issue a notice for short deduction within 7 years from the end of the financial year in which the payment was made. So a payment made in FY 2020-21 can be assessed up to FY 2027-28.',
    },
  ],

  sources: [
    {
      name: 'Income Tax Act, 1961 (Section 201)',
      url: 'https://www.incometax.gov.in',
      description: 'Consequences of failure to deduct or pay TDS',
    },
    {
      name: 'Income Tax Act, 1961 (Sections 192 to 196)',
      url: 'https://incometaxindia.gov.in/acts/income-tax-act-1961.pdf',
      description: 'TDS provisions for different payment types and applicable rates',
    },
  ],
}


// ─── 21. TDS 26Q/27Q Mismatch Notice ─────────────────────────────────────────

export const tds26q27qUpdates = {
  slug: 'tds-26q-27q-mismatch',
  seoTitle: 'TDS 26Q/27Q Mismatch Notice: How to Resolve (2025) | Ollvy',
  seoDescription: 'A 26Q or 27Q mismatch means your TDS return and challan payments do not match. File a correction return on TRACES to fix it. Unresolved mismatches block your deductees\' Form 26AS credit.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS A 26Q/27Q MISMATCH',
      body: 'A mismatch occurs when the TDS amount claimed in your return (Form 26Q for non-salary payments, 27Q for NRI payments) does not match the challans you deposited.',
      bullets: [
        'Wrong challan quoted in the return',
        'Challan deposited but not quoted in return',
        'Challan quoted belongs to a different TAN',
        'Arithmetic errors in return or challan',
        'Previous quarter\'s challan used in current quarter',
      ],
    },
    {
      number: '02',
      heading: 'HOW MISMATCHES AFFECT YOUR DEDUCTEES',
      body: 'When there is a mismatch, deductees\' Form 26AS shows TDS as "unmatched" or does not show it at all. Deductees cannot claim TDS credit in their return. This creates complaints and queries from vendors and employees and can affect your business relationships.',
    },
    {
      number: '03',
      heading: 'HOW TO IDENTIFY THE ISSUE',
      body: 'Download your TDS return from TRACES. Download your challan statement from TRACES. Compare the BSR code, challan serial number, challan date, and amount for each entry. Identify which challan is mismatched and why. Most mismatches are either a wrong BSR code, a wrong serial number, or a challan belonging to a different quarter.',
    },
    {
      number: '04',
      heading: 'HOW TO FILE A CORRECTION RETURN',
      body: 'Use the TRACES correction utility to file the appropriate correction type.\n\nC1 correction: correct deductee details (wrong PAN, wrong name, wrong amount).\nC2 correction: correct challan details or add a new challan that was not quoted.\nC3 correction: correct both deductee and challan details.\n\nDownload the original return from TRACES, make the corrections, validate using the File Validation Utility (FVU), and submit the corrected return.',
    },
    {
      number: '05',
      heading: 'CHECKING CORRECTION STATUS AND DEDUCTEE IMPACT',
      body: 'After filing a correction return, check TRACES after 3 to 5 working days. The correction should reflect in the deductee\'s Form 26AS within 7 to 14 days after processing.\n\nIf a deductee has already filed their return without the TDS credit, they will need to file a revised return after the mismatch is resolved and the credit appears in their 26AS.\n\nFor high-value deductees (employees, large vendors), proactively inform them of the timeline so they can plan their return filing accordingly.',
    },
    {
      number: '06',
      heading: 'TIMELINE FOR CORRECTIONS',
      body: 'Corrections can be filed at any time with no deadline. However, resolve quickly to avoid deductee complaints and potential interest on short deposits.\n\nNote that correction returns for very old quarters (beyond 7 years) may face restrictions on TRACES. If you are correcting errors in old TDS returns, check TRACES for any applicable restrictions.',
    },
  ],

  faqs: [
    {
      q: 'I deposited the TDS but forgot to quote the challan in my return. What do I do?',
      a: 'File a C2 correction return to add the challan. The challan must be in your TAN\'s name and for the correct assessment year.',
    },
    {
      q: 'The mismatch is because of a wrong BSR code. How do I fix it?',
      a: 'Verify the correct BSR code from your bank\'s challan receipt. File a C2 correction with the correct BSR code. If the bank made an error, you may need to contact the bank for a correction at their end first.',
    },
    {
      q: 'My deductee is threatening to take action because TDS is not reflecting in their 26AS. What do I tell them?',
      a: 'Acknowledge the issue, share the correction return acknowledgement number, and give them a realistic timeline (7 to 14 days after correction processing). If the delay has caused them to miss their return filing deadline, advise them to file their return claiming the TDS credit anyway and revise once it reflects.',
    },
  ],

  sources: [
    {
      name: 'TRACES Portal',
      url: 'https://www.tdscpc.gov.in',
      description: 'Official portal for TDS correction returns, challan verification, and Form 26AS',
    },
    {
      name: 'Income Tax Act, 1961 (Sections 200 and 200A)',
      url: 'https://www.incometax.gov.in',
      description: 'TDS return filing requirement and processing of TDS statements',
    },
  ],
}


// ─── 22. TDS 194C/194J Demand Notice ─────────────────────────────────────────

export const tds194cj Updates = {
  slug: 'tds-194c-194j-demand',
  seoTitle: 'TDS 194C vs 194J Demand Notice: How to Respond (2025) | Ollvy',
  seoDescription: 'A 194C vs 194J TDS demand arises when the department classifies your payment differently. The rate difference (1-2 percent vs 10 percent) creates large demand amounts. Here is how to respond.',

  sections: [
    {
      number: '01',
      heading: 'WHY THIS DEMAND ARISES',
      body: 'The department has determined that you deducted TDS under the wrong section.\n\n194C (Contractors): 1 percent for individuals and HUF, 2 percent for others.\n194J (Professional or Technical services): 10 percent (or 2 percent for call centres and certain technical services).\n\nThe difference in rates means a wrong classification creates significant short deduction. On a Rs. 10 lakh annual payment, the difference between 194C (2 percent) and 194J (10 percent) is Rs. 80,000 in TDS.',
    },
    {
      number: '02',
      heading: 'THE KEY DISTINCTION BETWEEN 194C AND 194J',
      body: 'Section 194C covers works contracts (supply plus labour), labour contracts, carriage and transport, catering, and advertising production work.\n\nSection 194J covers professional services (legal, medical, architectural, engineering, accounting), technical services (managerial, technical, consultancy), royalty, and non-compete fees.\n\nThe grey area: many services have elements of both. IT development, marketing services, and design work are frequently disputed.',
    },
    {
      number: '03',
      heading: 'HOW TO DETERMINE THE CORRECT SECTION FOR YOUR PAYMENT',
      body: 'The correct section depends on the nature of the service, not what the vendor calls themselves or what the contract says.\n\nAsk these questions about each payment:\n\nDoes it involve application of mind, skill, or expertise by a professional or technical expert? If yes, it is likely 194J.\n\nIs it primarily a labour or material contract with a defined output? If yes, it is likely 194C.\n\nIs the service defined by a deliverable (like a software product) or by a process (like IT consulting)? Deliverable-based contracts lean 194C, process-based lean 194J.\n\nFor recurring large payments, get an advance ruling from the department to avoid uncertainty.',
    },
    {
      number: '04',
      heading: 'HOW TO RESPOND',
      body: 'Review the nature of services provided. Check invoices and contracts for how the service was described. Cite relevant CBDT circulars and case law for your classification.',
      bullets: [
        'If your classification is correct: submit a detailed response with supporting documents and cite relevant case law',
        'If classification was wrong: pay the shortfall with interest at 1 percent per month from the original deduction date',
        'For borderline cases: cite the specific facts that led to your 194C classification and argue why 194J does not apply',
      ],
    },
    {
      number: '05',
      heading: 'KEY CASE LAW AND CBDT GUIDANCE',
      body: 'CIT vs Bharti Cellular Ltd: technical services require a human element and application of mind.\n\nITO vs Computech International: software development is 194J; routine maintenance may be 194C.\n\nCBDT Circular 715: guidelines for distinguishing technical and professional services.\n\nFor IT-related payments specifically, courts have consistently held that software development involving custom design and coding is 194J, while installation, maintenance, and standard product supply is 194C.',
    },
    {
      number: '06',
      heading: 'GOING FORWARD',
      body: 'Review payment classifications annually with your CA. Document the nature of services in contracts clearly. When in doubt, deduct at the higher rate (194J). This costs nothing extra if you are wrong (the deductee gets credit for the higher TDS) but avoids a short deduction demand.\n\nGet advance rulings for large or recurring payments if classification is uncertain. The cost of an advance ruling is far less than a multi-year short deduction demand with interest.',
    },
  ],

  faqs: [
    {
      q: 'I paid for website development. Is it 194C or 194J?',
      a: 'Website development involving creative and technical skill is generally 194J. Website hosting or routine maintenance may be 194C. Check the nature of work in each invoice. If the vendor is designing and building a custom site, it is almost certainly 194J.',
    },
    {
      q: 'The vendor says they are a contractor, not a professional. Does that matter?',
      a: 'No. What the vendor calls themselves does not determine the section. The nature of the service provided determines the applicable section. A "contractor" providing technical consultancy is still covered under 194J.',
    },
    {
      q: 'We have been paying the same vendor under 194C for 3 years. Now we got a demand for all 3 years under 194J. What are our options?',
      a: 'First verify whether 194J actually applies based on the nature of the service. If it does, pay the shortfall with interest. If you genuinely believe 194C is correct, respond with a detailed legal argument and documentation. For a 3-year demand, the interest alone can be significant, so a professional reply is worth the cost.',
    },
  ],

  sources: [
    {
      name: 'Income Tax Act, 1961 (Sections 194C and 194J)',
      url: 'https://www.incometax.gov.in',
      description: 'TDS on contractor payments and professional or technical services',
    },
    {
      name: 'CBDT Circular No. 715',
      url: 'https://incometaxindia.gov.in',
      description: 'CBDT guidance on distinguishing technical and professional services for TDS',
    },
  ],
}


// ─── ROC NOTICE PAGES 23-24 ──────────────────────────────────────────────────

// ─── 23. ROC Annual Filing Default Notice ────────────────────────────────────

export const rocAnnualFilingUpdates = {
  slug: 'roc-annual-filing-default-notice',
  seoTitle: 'ROC Annual Filing Default Notice: How to Respond (2025) | Ollvy',
  seoDescription: 'An ROC default notice means your company has not filed AOC-4 or MGT-7 on time. Penalties of Rs. 100 to 200 per day apply with no cap. Directors risk disqualification after 3 years of default.',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS AN ROC ANNUAL FILING DEFAULT',
      body: 'Every company registered under the Companies Act, 2013 must file annual returns with the Registrar of Companies.\n\nAOC-4: financial statements (balance sheet, P&L, notes) due within 30 days of AGM.\nMGT-7 or MGT-7A: annual return with shareholder and director details, due within 60 days of AGM.\nAGM must be held within 6 months of financial year end.\n\nIf you miss these deadlines, the ROC may issue a default notice.',
      note: 'Source: Sections 92, 129, 137, Companies Act 2013.',
    },
    {
      number: '02',
      heading: 'PENALTIES FOR DELAYED FILING',
      body: 'The penalty for delayed filing is significant and there is no cap.\n\nAOC-4: Rs. 100 per day for small companies, Rs. 200 per day for others.\nMGT-7: Rs. 100 per day for small companies, Rs. 200 per day for others.\n\nExample: a non-small company that files both forms 1 year late faces approximately Rs. 200 x 365 x 2 = Rs. 1,46,000 in additional fees, on top of the standard filing fee.',
    },
    {
      number: '03',
      heading: 'DIRECTOR DISQUALIFICATION',
      body: 'Under Section 164(2), directors of companies that have not filed annual returns for 3 continuous years become disqualified from being appointed as director in any company for 5 years.\n\nThis disqualification applies to all companies where the person is a director, not just the defaulting company. It is automatically imposed based on MCA records. It can only be removed by filing the pending returns and applying for removal of disqualification.',
    },
    {
      number: '04',
      heading: 'CALCULATING THE EXACT PENALTY BEFORE FILING',
      body: 'Before filing overdue returns, calculate the exact additional fee so you are not surprised. The MCA portal calculates fees automatically based on delay, but you can estimate it yourself.\n\nFor each form: count the number of days from the due date to today. Multiply by Rs. 100 or Rs. 200 depending on your company category. Add the standard filing fee.\n\nFor a company that has defaulted for 2 years on both AOC-4 and MGT-7, the additional fees alone can exceed Rs. 2 to 3 lakh. Get this number from your CS before committing to the filing so you can arrange the funds.',
    },
    {
      number: '05',
      heading: 'HOW TO RESOLVE',
      body: 'Hold the AGM (if not already held). You may need to apply for extension to ROC. Prepare and audit financial statements for all pending years. File AOC-4 and MGT-7 for each pending year with the MCA-calculated additional fees.\n\nConsider filing a petition for compounding of offence if the penalties are very high and the default was due to genuine hardship.',
    },
    {
      number: '06',
      heading: 'PREVENTING FUTURE DEFAULTS',
      body: 'Set calendar reminders for AGM and filing deadlines. The AGM must be held by September 30 for companies with a March 31 financial year end. AOC-4 is then due by October 30. MGT-7 is due by November 29.\n\nEngage a company secretary or CA for compliance tracking. Even if the company is dormant or inactive, filings are still required. Consider striking off the company under Section 248 if it will never operate again.',
    },
  ],

  faqs: [
    {
      q: 'The company has not operated for years. Do we still need to file?',
      a: 'Yes. As long as the company exists on MCA records, annual filings are required. If the company will never operate, consider applying for strike-off under Section 248 to end the obligation.',
    },
    {
      q: 'I am a director in a company that defaulted. Am I personally liable?',
      a: 'Directors can be held personally liable for penalties. More significantly, if defaults continue for 3 years, you can be disqualified as a director under Section 164(2), affecting all your directorships across all companies.',
    },
    {
      q: 'The company has been struck off by ROC. Can we revive it?',
      a: 'Yes. A struck-off company can be revived by filing an application to the National Company Law Tribunal (NCLT) within 20 years of strike-off. The process requires filing all pending returns and paying all dues. For recently struck-off companies (within 3 years), the ROC itself can restore the company.',
    },
  ],

  sources: [
    {
      name: 'Companies Act, 2013 (Sections 92, 129, 137)',
      url: 'https://www.mca.gov.in',
      description: 'Annual return and financial statement filing requirements for companies',
    },
    {
      name: 'Companies Act, 2013 (Section 164(2))',
      url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html',
      description: 'Director disqualification for companies with continuous filing defaults',
    },
  ],
}


// ─── 24. DIR-3 KYC DIN Deactivation ──────────────────────────────────────────

export const rocDir3KycUpdates = {
  slug: 'dir-3-kyc-din-deactivation',
  seoTitle: 'DIR-3 KYC Not Filed: DIN Deactivation Notice 2025 | Ollvy',
  seoDescription: 'Your DIN has been deactivated due to non-filing of DIR-3 KYC. You cannot sign any company documents or file MCA forms until it is restored. File with Rs. 5,000 late fee to reactivate.',

  sections: [
    {
      number: '01',
      heading: 'YOUR DIRECTOR IDENTIFICATION NUMBER HAS BEEN DEACTIVATED',
      body: 'Every director of an Indian company holds a Director Identification Number (DIN) issued by MCA. To keep this DIN active, you must file DIR-3 KYC every year by September 30.\n\nIf you missed the deadline, the MCA system automatically deactivates your DIN. Your DIN status on the MCA portal will show as "Deactivated due to non-filing of DIR-3 KYC."',
      note: 'Source: Rule 12A and 12B, Companies (Appointment and Qualification of Directors) Rules, 2014.',
    },
    {
      number: '02',
      heading: 'WHAT HAPPENS WHEN YOUR DIN IS DEACTIVATED',
      body: '',
      bullets: [
        'You cannot be reflected as an active director in any MCA filing',
        'Any MCA form you sign as director will be rejected if your DIN shows as deactivated',
        'Annual returns (AOC-4, MGT-7) cannot be filed for companies where you are the sole director',
        'Board resolutions and other company documents that require your DIN will be problematic',
        'Banks doing director due diligence will see the deactivated DIN as a compliance flag',
      ],
    },
    {
      number: '03',
      heading: 'HOW TO REACTIVATE YOUR DIN',
      body: 'Reactivation requires filing DIR-3 KYC with a late fee of Rs. 5,000. This fee is fixed regardless of how many days late.\n\nDocuments needed: PAN, Aadhaar, current address proof, mobile number OTP verification, and email OTP verification. If filed by a CA or CS, their digital signature is also needed.\n\nFile on the MCA portal: log in to mca.gov.in, go to the DIR-3 KYC service, complete the form with verified documents, and pay the fee. DIN reactivation is typically immediate or within 24 hours of successful filing.',
    },
    {
      number: '04',
      heading: 'DIR-3 KYC VS DIR-3 KYC-WEB: WHICH DO YOU FILE',
      body: 'DIR-3 KYC (eForm): full KYC for first-time filing or when your details have changed (new PAN, new address, new mobile number). Requires digital signature of a CA or CS.\n\nDIR-3 KYC-Web: annual renewal for directors whose details have not changed. A simpler web-based form requiring only OTP verification on the registered mobile and email. No professional signature needed. Takes about 10 minutes.\n\nMost directors do DIR-3 KYC-Web for annual renewal. First-time KYC (when DIN was newly issued) requires the full eForm.',
    },
    {
      number: '05',
      heading: 'THE CASCADING EFFECT OF A DEACTIVATED DIN',
      body: 'A deactivated DIN does not just affect you. If you are a director in multiple companies, each company is affected.\n\nFor companies where you are the sole director, annual filings become impossible until your DIN is restored. This means those companies begin accumulating ROC filing defaults (Rs. 100 to 200 per day per form) on top of your existing DIN issue.\n\nFor companies where there are multiple directors, the other directors can continue filing. But your deactivated DIN still needs to be restored to remain on the MCA records as an active director.\n\nRestore the DIN and file all company annual returns together to avoid a larger penalty accumulation.',
    },
    {
      number: '06',
      heading: 'ANNUAL KYC COMMITMENT GOING FORWARD',
      body: 'Once your DIN is reactivated, set a reminder for September 30 every year. The DIR-3 KYC-Web takes about 10 minutes and has no fee if filed before September 30. The Rs. 5,000 late fee only applies if filed after September 30.\n\nIf your mobile number or email registered with MCA changes, file the full eForm (not KYC-Web) to update your details. Filing KYC-Web with old contact details will fail OTP verification.',
    },
  ],

  faqs: [
    {
      q: 'I have 3 DINs from different periods. Do I need to file DIR-3 KYC for all of them?',
      a: 'Having more than one DIN is an offence under the Companies Act. You must surrender the additional ones and retain only one. Once surrendered, you only file KYC for the retained DIN.',
    },
    {
      q: 'I stopped being a director 2 years ago. Do I still need to file DIR-3 KYC?',
      a: 'If you have resigned from all directorial positions and are no longer a director in any company, you can request surrender of your DIN. Post-surrender, no KYC filings are needed. However, as long as your DIN is active (even if you are no longer a director), the annual KYC requirement continues.',
    },
    {
      q: 'My DIN was deactivated and now the company cannot file its annual returns. Who is responsible?',
      a: 'As the director whose DIN is deactivated, you are responsible for filing DIR-3 KYC to restore it. The company\'s filing obligations remain unchanged regardless of DIN status. Restore the DIN and then file all company returns together to stop the penalty from accumulating further.',
    },
    {
      q: 'My Aadhaar mobile number is different from what is registered with MCA. How do I file KYC-Web?',
      a: 'You cannot use KYC-Web if your registered mobile has changed. You need to file the full DIR-3 KYC eForm instead, updating your mobile number in the process. This requires a CA or CS digital signature.',
    },
  ],

  sources: [
    {
      name: 'Companies (Appointment and Qualification of Directors) Rules, 2014 (Rule 12A and 12B)',
      url: 'https://www.mca.gov.in',
      description: 'DIR-3 KYC annual filing requirement and late fee of Rs. 5,000',
    },
    {
      name: 'MCA Portal',
      url: 'https://www.mca.gov.in/MinistryV2/din.html',
      description: 'Official portal for DIR-3 KYC filing and DIN status verification',
    },
  ],
}
