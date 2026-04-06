# Notice Pages Content

This document contains all notice page content from the Ollvy codebase for content review and improvement.

---

## Schema Reference

```typescript
export interface LearnPageConfig {
  slug: string;
  title: string;                       // H1 - plain language, specific
  seoTitle: string;                    // <title> tag - includes year + location signal
  seoDescription: string;              // meta description - answer-first
  canonicalUrl: string;
  lastReviewed: string;                // "March 2025" - shown on page, updated manually
  category: LearnCategory;             // 'GST Notice' | 'Income Tax Notice' | 'TDS Notice' | 'ROC Notice'
  relatedServiceSlugs: string[];       // which service pages to link to
  relatedLearnSlugs: string[];         // which other /guides pages to link to

  // Page sections
  sections: LearnSection[];

  // FAQs - shown after sections
  faqs?: LearnFaq[];

  // Service CTA at bottom
  ctaServiceSlug: string;              // primary service to promote
  ctaSecondarySlug?: string;           // secondary CTA if relevant

  // Notice-specific fields
  severity: NoticeSeverity;            // 'urgent' | 'serious' | 'moderate'
  deadline: string;                    // e.g., "30 days from date of notice"
  deadlineNote?: string;               // additional context about the deadline

  // Related external tools (penalty calculators, document checklists)
  relatedTools?: RelatedTools;
}

export type NoticeSeverity = 'urgent' | 'serious' | 'moderate';

export interface LearnSection {
  number?: string;
  heading: string;
  body: string;
  bullets?: string[];
  note?: string;
}

export interface LearnFaq {
  q: string;
  a: string;
}
```

---

# GST Notices (9 Pages)

---

## 1. GST DRC-01 Notice

**File:** `lib/guides/pages/gst-drc-01-notice.ts`

- **Slug:** `gst-drc-01-notice`
- **Title:** GST DRC-01 Notice: What It Means and What to Do
- **SEO Title:** GST DRC-01 Notice: What It Is and How to Reply (2025) | Ollvy
- **SEO Description:** Got a GST DRC-01 notice? Understand what it means, why you got it, your exact deadline, and how to reply correctly. Expert CA guidance from Ollvy.
- **Category:** GST Notice
- **Severity:** urgent
- **Deadline:** 30 days from date of notice
- **Deadline Note:** Missing this deadline results in an ex-parte demand order against you. The department will pass an order without hearing your side.
- **CTA Service:** gst-monthly
- **Related Tools:**
  - Penalty Calculators: gst-late-filing, gst-demand-notice
  - Document Checklists: gst-registration

### Sections

**01. FIRST, TAKE A BREATH - THEN READ THIS CAREFULLY**
A DRC-01 notice is a Summary of the Show Cause Notice. In plain English: the GST department believes you owe them tax - and they are now formally putting that demand in writing and asking you to explain yourself or pay up.

This is serious. But it is not the end. A DRC-01 is the department's opening move, not their final word. You have a right to reply, a right to be heard, and if your case is strong, the demand can be reduced or dropped entirely.

What you must not do is ignore it.

Note: Source: Section 73 and Section 74, Central Goods and Services Tax Act, 2017. Rule 142, CGST Rules 2017.

**02. WHAT IS A DRC-01 AND WHY DID YOU GET ONE**
DRC stands for Demand and Recovery. The DRC-01 is the formal document that summarises the Show Cause Notice issued against you. There are two versions of this notice - and which one you received changes everything about how serious your situation is.
- DRC-01 under Section 73 (non-fraud): The department believes there is a tax shortfall but is NOT alleging fraud, deliberate suppression, or willful misstatement on your part. This is the less severe version. The limitation period for this is 3 years from the due date of the relevant annual return.
- DRC-01 under Section 74 (fraud / suppression): The department IS alleging fraud, willful misstatement, or suppression of facts to evade tax. This is the more serious version. The limitation period extends to 5 years. Penalties here can be up to 100% of the tax amount.
- Common reasons you received a DRC-01: GSTR-1 and GSTR-3B mismatch, ITC claimed exceeds what your suppliers filed, incorrect HSN classification, turnover underreported compared to bank data or e-way bills, wrong tax rate applied, ITC claimed on blocked credit items.

Note: Check the first page of your notice carefully. It will state "under Section 73" or "under Section 74." This is the single most important line in the document.

**03. YOUR EXACT DEADLINE AND WHAT HAPPENS IF YOU MISS IT**
You have 30 days from the date of the DRC-01 notice to file your reply.

If you do not reply within 30 days, the GST officer is legally permitted to pass an ex-parte order - meaning they will decide the case without hearing your side and issue a demand in Form DRC-07. Once DRC-07 is issued, you cannot reply to DRC-01 anymore. Your options then become filing an appeal (which costs more time and money) or paying the demand.

If you need more time, you can request an adjournment - but this must be done before the deadline expires, not after. The officer has discretion to grant it.

Note: The 30-day period starts from the date printed on the DRC-01 notice, not the date you received it. If your GSTIN portal shows the notice was uploaded 5 days ago, count backwards.

**04. WHAT YOUR REPLY (DRC-06) MUST CONTAIN**
Your reply is filed in Form DRC-06 on the GST portal. A good reply is not just "I disagree." It must be specific, documented, and address every point the notice raises. Here is what a proper reply covers:
- Point-by-point response to each discrepancy or allegation in the notice - vague replies are treated as weak replies
- Reconciliation statement showing how the numbers the department flagged are explained (e.g., a GSTR-1 vs 3B difference might be timing, credit notes, or amendments)
- Supporting documents attached as evidence: GSTR-1, GSTR-3B, books of accounts, purchase invoices, bank statements, e-way bills, contracts as relevant
- Legal arguments citing relevant sections and case law if applicable - this is where professional help adds significant value
- If you partially agree with the demand: Pay the admitted tax, interest, and applicable penalty immediately and state this in your reply. This can significantly reduce the final demand.
- If under Section 74 (fraud allegation): The reply must specifically address and counter the fraud allegation. Never admit to suppression or fraud even if you are willing to pay the tax.

Note: If you choose to pay before or during the DRC-01 stage (and the case is under Section 73), you benefit from reduced penalties - 10% of tax instead of 100%. This window closes once the officer passes the DRC-07 order.

**05. WHAT HAPPENS AT THE PERSONAL HEARING**
After you file DRC-06, the officer will grant you a personal hearing. Do not skip this. The personal hearing is your opportunity to present your case verbally, clarify anything in your written reply, and understand exactly what the officer is thinking.

A few things to know about personal hearings:
- You or your authorised representative (CA/advocate) can appear. In most cases, send a professional - they know the right language and arguments.
- Bring physical copies of all documents you submitted with your reply.
- Take notes during the hearing. If the officer raises new points, ask for them in writing.
- The officer cannot make a final order on the spot during the hearing. There is a mandated speaking period.
- If you are not satisfied with the hearing outcome, you can still appeal after DRC-07 is issued.

**06. THE MOST COMMON MISTAKES PEOPLE MAKE**
- Ignoring the notice completely: This is the worst thing you can do. The officer WILL pass an ex-parte order and the demand becomes very hard to fight without an appeal.
- Filing a vague or generic reply without documents: "The discrepancy is due to accounting differences" without a reconciliation statement is not a reply. It is an invitation for the officer to rule against you.
- Paying the full demand without checking it: Sometimes the demand calculation itself has errors. Always verify the numbers before paying.
- Admitting to fraud when you did not commit fraud: If the notice is under Section 74 but you genuinely believe it is a bookkeeping error and not fraud, your reply should challenge the Section 74 classification itself.
- Missing the 30-day deadline because you were "gathering documents": Start gathering immediately. If you need more time, file a request for adjournment before the deadline.
- Not tracking the notice on the GST portal: The DRC-01 is served electronically. If your email or phone linked to your GSTIN is outdated, you might not get an alert but the 30-day clock has already started.

**07. AFTER THE DRC-01: WHAT COMES NEXT**
One of three things will happen after your reply and hearing:
- DRC-05 (Conclusion of proceedings): The officer is satisfied with your reply. The proceedings are dropped. This is the outcome you are aiming for.
- DRC-07 (Order for demand): The officer partially or fully confirms the demand. You now have the option to pay (with appeal rights preserved) or appeal to the Appellate Authority within 3 months.
- Further enquiry: The officer asks for additional documents or information before deciding. This can happen multiple times.

Note: If DRC-07 is passed against you, the appeal must be filed to the First Appellate Authority (Joint/Additional Commissioner) within 3 months. Pre-deposit of 10% of disputed tax is required for the appeal to be admitted.

### FAQs

**Q: I received DRC-01 for a GST period from 3 years ago. Is it too late for them to issue this?**
A: Not necessarily. For Section 73 (non-fraud) cases, the notice must be issued within 3 years from the due date of the annual return for the relevant year. For Section 74 (fraud), the limit is 5 years. If the notice is genuinely time-barred, this is a strong legal ground for your reply. A CA can check the dates precisely.

**Q: Do I need a CA to reply or can I do it myself?**
A: Technically you can file DRC-06 yourself. But for any demand above Rs. 1 lakh, the risk of a wrong reply is too high. A professional reply with a proper reconciliation and legal citations dramatically changes outcomes. For demands above Rs. 5 lakh, always get professional help.

**Q: I partially agree with the demand. Should I pay part of it now?**
A: Yes, paying the admitted tax and interest before or during DRC-01 proceedings reduces your penalty exposure significantly under Section 73. Pay what you agree with, clearly state the payment in your DRC-06 reply with challan details, and contest the rest.

**Q: The notice says the demand is Rs. 40 lakh. Is that the final amount I will owe?**
A: Not necessarily. The DRC-01 shows the amount the department is claiming. After your reply, hearing, and the officer's consideration, the final order (DRC-07) may be for a different amount - lower if your arguments are accepted, or the same if they are not. The DRC-01 figure is the starting point for negotiation, not a settled debt.

**Q: I missed the 30-day deadline. What are my options now?**
A: If DRC-07 has already been passed, you can file an appeal to the Appellate Authority within 3 months of the order date with a 10% pre-deposit of the disputed tax. If DRC-07 has not yet been passed (the officer has not yet issued the order), speak to a CA immediately - there may still be an opportunity to request that the officer hear your submission before passing the order, though this is at the officer's discretion.

---

## 2. GST DRC-01A Pre-Notice

**File:** `lib/guides/pages/gst-drc-01a-pre-notice.ts`

- **Slug:** `gst-drc-01a-pre-notice`
- **Title:** GST DRC-01A Notice: Pre-Show Cause Notice Intimation
- **SEO Title:** GST DRC-01A Notice: What It Is and How to Respond (2025) | Ollvy
- **SEO Description:** Received a GST DRC-01A notice? This is a pre-demand intimation - not a formal demand yet. Respond within 30 days to avoid escalation to DRC-01.
- **Category:** GST Notice
- **Severity:** serious
- **Deadline:** 30 days from date of intimation
- **Deadline Note:** DRC-01A is actually an opportunity - if you respond well here, the department may close the matter without ever issuing a formal DRC-01 demand.
- **CTA Service:** gst-monthly
- **Related Tools:**
  - Penalty Calculators: gst-late-filing, gst-demand-notice
  - Document Checklists: gst-registration

### Sections

**01. THIS IS NOT A DEMAND YET - BUT IT COULD BECOME ONE**
DRC-01A is a relatively recent addition to the GST compliance toolkit, introduced to give taxpayers an informal opportunity to engage with the department before formal demand proceedings begin.

Here is what has happened: the GST officer has done the calculation and determined that you owe tax. But before issuing the formal DRC-01 Show Cause Notice, they are required to first send you DRC-01A - essentially saying "we think you owe Rs. X. Here is what we found. Tell us if we are wrong, or pay up."

This informal stage is genuinely valuable. Use it.

Note: Source: Rule 142(1A), CGST Rules 2017.

**02. WHAT YOUR RESPONSE TO DRC-01A CAN DO**
You have two paths in response to DRC-01A.
- Option A - Pay the ascertained amount: If you review the notice and agree that the tax is due, pay it along with applicable interest through DRC-03 (voluntary payment challan). When you pay at the DRC-01A stage (before formal SCN), the penalty that would apply if you paid after DRC-01 is either nil or significantly reduced. Under Section 73, if you pay before the SCN, no penalty applies at all.
- Option B - Provide a representation: If you believe the amount is wrong (partially or fully), file a written representation in DRC-01A Part B explaining your position with supporting documents. If the officer agrees with your representation, they can close the matter without issuing DRC-01.

Note: The penalty protection at this stage is significant. Under Section 73 (non-fraud cases): paying during DRC-01A stage = nil penalty. Paying during DRC-01 stage = 10% penalty. Paying after DRC-07 demand order = 10-15% penalty. Under Section 74 (fraud): penalties are 100% at DRC-01 stage, so the relative benefit of early payment is even larger.

**03. WHAT HAPPENS IF YOU IGNORE DRC-01A**
DRC-01A is informal. There is no statutory consequence just for not responding. However:
- The officer will proceed to issue the formal DRC-01 Show Cause Notice
- At DRC-01 stage, penalties apply (10% minimum for Section 73, 100% for Section 74)
- The matter becomes part of your formal litigation record
- You lose the goodwill of early engagement, which sometimes influences how officers treat borderline cases

**04. HOW TO WRITE A STRONG REPRESENTATION**
If you are challenging the department's calculation at DRC-01A stage, your representation should:
- Be in writing and addressed to the officer who signed the DRC-01A
- Specifically identify each component of the ascertained amount you agree with and each you dispute
- Provide a reconciliation for every disputed component - not just a general statement
- Attach supporting documents (returns, invoices, bank statements, credit notes)
- State clearly the amount (if any) you are paying voluntarily and provide the DRC-03 challan details

### FAQs

**Q: Is DRC-01A mandatory before DRC-01 can be issued?**
A: It depends on the case. Rule 142(1A) requires DRC-01A for cases where the officer has ascertained the tax through scrutiny, audit, inspection, or investigation. For cases where the officer is acting on a complaint or intelligence-based investigation, DRC-01A may not be issued before DRC-01.

**Q: I received DRC-01A for Rs. 8 lakh. If I pay it now via DRC-03, is the matter fully closed?**
A: Not automatically. You pay via DRC-03 and inform the officer. The officer reviews and if satisfied, does not issue DRC-01 and closes the proceedings. Get a written acknowledgement or wait for the ASMT-12 or closure order before treating the matter as closed.

---

## 3. GST DRC-01B Mismatch Notice

**File:** `lib/guides/pages/gst-drc-01b-mismatch.ts`

- **Slug:** `gst-drc-01b-mismatch`
- **Title:** GST DRC-01B Notice: GSTR-1 vs GSTR-3B Liability Mismatch
- **SEO Title:** GST DRC-01B Notice: GSTR-1 vs 3B Mismatch - How to Fix (2025) | Ollvy
- **SEO Description:** Got a GST DRC-01B notice about GSTR-1 and GSTR-3B mismatch? Understand why it was generated, how serious it is, and what to do within 7 days.
- **Category:** GST Notice
- **Severity:** serious
- **Deadline:** 7 days from date of notice (Part B response)
- **Deadline Note:** The 7-day window is short. If you miss it, the officer can initiate DRC-01 demand proceedings.
- **CTA Service:** gst-monthly
- **Related Tools:**
  - Penalty Calculators: gst-late-filing, gst-demand-notice
  - Document Checklists: gst-registration

### Sections

**01. WHAT IS DRC-01B AND WHY DOES IT EXIST**
From 2022-23 onwards, the GST system automatically compares your GSTR-1 (invoice-level outward supply details) with your GSTR-3B (self-assessed tax payment summary) for every month. If the taxable value or tax liability in GSTR-3B is less than what you declared in GSTR-1, the system automatically generates a DRC-01B intimation.

This is a system-generated notice - no human officer has specifically reviewed your case. But it still demands a response and carries real consequences if ignored.

Note: Source: Rule 88C, CGST Rules 2017, inserted by Notification 26/2022-CT dated 26.12.2022.

**02. THE MOST COMMON REASONS FOR A DRC-01B**
The mismatch is almost always one of these:
- Tax paid through DRC-03: You realised you had underpaid tax in a prior period and made a voluntary payment through DRC-03 (voluntary tax payment challan) but the GSTR-3B still reflects the original lower figure. This is legitimate but needs to be declared in DRC-01B Part B.
- Timing difference: You raised invoices in GSTR-1 for advance received but the actual tax was paid in the next month's GSTR-3B. Common in construction and real estate.
- Credit notes issued: You issued credit notes in a later period that reduced your actual liability from what GSTR-1 showed for the current period. This is not always reflected correctly in the system comparison.
- Amendment in GSTR-1: You amended invoices in a subsequent month but the original period's comparison is being flagged.
- Genuine underpayment: You made a mistake in GSTR-3B and actually did pay less tax than you were supposed to. In this case, you should pay the shortfall.
- Nil-rated, exempted, or non-GST supplies declared in GSTR-1 but not in GSTR-3B: These categories can create apparent mismatches that are not actual tax dues.

**03. THE TWO-PART RESPONSE STRUCTURE**
DRC-01B has two parts and your response determines which path you go down.
- DRC-01B Part A: This is the intimation the system sends you. It shows the specific period, the GSTR-1 declared liability, the GSTR-3B declared liability, and the difference.
- DRC-01B Part B: This is where you reply. You must file Part B within 7 days of the Part A intimation.
- In Part B, you select one of two responses: (a) "The difference is due to the following reasons" - you explain and provide details, or (b) "I am making payment of the difference" - you pay the shortfall.
- If you select the explanation route, you must provide specific reasons. Vague reasons like "due to accounting treatment" are not sufficient - you need the specific transaction details.

**04. WHAT HAPPENS AFTER YOUR PART B RESPONSE**
The outcome depends on whether the officer accepts your explanation.
- If your explanation is accepted: The matter closes here. No further action.
- If your explanation is not accepted or you do not respond: The system/officer can initiate proceedings under Section 73 or 74 and issue a DRC-01. At that stage, the mismatch becomes a formal demand with penalties.
- If you pay the shortfall: Part B closed with payment challan number. The matter closes for that period.
- If the same mismatch recurs across multiple months: The officer may decide to initiate a comprehensive scrutiny or audit rather than handling them individually.

Note: A DRC-01B is significantly easier and cheaper to resolve than a DRC-01. The incentive to resolve it here is strong.

**05. HOW TO PREPARE YOUR PART B RESPONSE**
A proper Part B response should include:
- A clear statement of the reason for the mismatch with the specific transaction or period it relates to
- DRC-03 challan details if the difference was paid voluntarily in a different period
- A reconciliation table showing: GSTR-1 declared value, credit notes issued, amendments, advances adjusted, and the net taxable value matching GSTR-3B
- Copies of relevant invoices, credit notes, or amendment records as supporting documents
- If there was a genuine error, the payment of shortfall with interest under Section 50 (18% per annum from the original due date)

### FAQs

**Q: I received DRC-01B for a mismatch but I already paid the difference via DRC-03 voluntarily. What do I do?**
A: This is exactly the right path. In your Part B response, select the explanation option, state that the difference was paid voluntarily through DRC-03, and provide the DRC-03 challan number and date. The system will verify this and close the matter.

**Q: The DRC-01B mismatch is just Rs. 500. Is it worth worrying about?**
A: Yes. The amount does not determine whether the notice escalates. A non-response to DRC-01B can initiate formal DRC-01 proceedings regardless of the amount. Respond to every DRC-01B - even for small amounts.

**Q: I received DRC-01B notices for 6 different months simultaneously. Do I respond to each separately?**
A: Yes, each DRC-01B is for a specific month and must be responded to individually in its own Part B. The reasons may be the same across months - in that case, your responses will be similar - but each Part B must be filed.

---

## 4. GST ASMT-10 Scrutiny Notice

**File:** `lib/guides/pages/gst-asmt-10-notice.ts`

- **Slug:** `gst-asmt-10-notice`
- **Title:** GST ASMT-10 Scrutiny Notice: What It Means and How to Reply
- **SEO Title:** GST ASMT-10 Notice: How to Reply and What It Means (2025) | Ollvy
- **SEO Description:** Received a GST ASMT-10 scrutiny notice? Understand what discrepancy the department found, your reply deadline, and how to respond before it escalates.
- **Category:** GST Notice
- **Severity:** urgent
- **Deadline:** 15 days from date of notice (extendable on request)
- **Deadline Note:** No response to ASMT-10 is one of the most common ways a minor GST query escalates into a full tax demand or audit. Do not let the deadline pass.
- **CTA Service:** gst-monthly
- **Related Tools:**
  - Penalty Calculators: gst-late-filing, gst-demand-notice
  - Document Checklists: gst-registration

### Sections

**01. WHAT IS ASMT-10 AND WHY DID YOU GET IT**
An ASMT-10 notice is a scrutiny notice issued under Section 61 of the CGST Act. It means a GST officer has reviewed your filed GST returns and found something that does not add up. They are not accusing you of fraud - not yet. They are asking you to explain the discrepancy before deciding what to do next.

Think of it as the officer flagging a specific issue and saying: "Your numbers don't match. Tell me why." The operative word is yet - if your reply is poor or missing, ASMT-10 escalates.

Note: Source: Section 61, Central Goods and Services Tax Act, 2017. Rule 99, CGST Rules 2017.

**02. WHAT DISCREPANCIES TYPICALLY TRIGGER AN ASMT-10**
The GST system runs automated checks and flags returns where numbers do not reconcile. The most common triggers are:
- GSTR-1 vs GSTR-3B mismatch: The outward supplies (sales) you declared in GSTR-1 (invoice-level) are different from what you declared in GSTR-3B (summary). Even legitimate timing differences can trigger this.
- ITC mismatch: The Input Tax Credit you claimed in GSTR-3B is more than what your suppliers declared in their GSTR-1, making it unavailable in your GSTR-2B.
- Turnover discrepancy: The turnover in your GST returns does not match the turnover in your Income Tax returns, financial statements, or data from other sources the department has.
- Tax rate discrepancy: You applied a tax rate that the officer believes is incorrect for that HSN/SAC code.
- Reverse charge non-payment: You made purchases from unregistered dealers or imported services and did not pay the applicable reverse charge GST.
- E-way bill vs return mismatch: E-way bills generated do not correspond to the supply values declared in your returns.

**03. YOUR EXACT DEADLINE AND WHAT HAPPENS NEXT**
You have 15 days from the date of the ASMT-10 notice to file your reply in Form ASMT-11 on the GST portal.

If you need more time, you can request an extension before the 15 days expire. Extension requests are generally considered reasonable if submitted promptly with a genuine reason.

Here is how the path forks based on your reply:
- You reply and the officer is satisfied: The officer issues ASMT-12 (acceptance of reply) and closes the matter. This is the outcome you are working toward.
- You reply but the officer is not fully satisfied: The officer may ask follow-up questions or proceed to initiate a formal audit under Section 65 or Section 66.
- You do not reply within 15 days: The officer is empowered to proceed with assessment under Section 62 (Best Judgment Assessment) - where the officer determines your tax liability based on whatever information they have, without your input. Best Judgment Assessments are almost always worse than the real number.
- The discrepancy is large or serious: Even with a reply, the officer can escalate to Section 73 or 74 demand proceedings. Your reply influences how far this escalates.

Note: The risk of ignoring ASMT-10 cannot be overstated. Section 62 allows the officer to assess you arbitrarily. You can appeal later but that is expensive and time-consuming.

**04. HOW TO WRITE A STRONG ASMT-11 REPLY**
Your reply in ASMT-11 is your one chance to close this at the lowest level of the hierarchy. A strong reply does the following:
- Addresses each discrepancy specifically by the line item or period the notice mentions - do not give generic answers
- Provides a reconciliation statement: For a GSTR-1 vs 3B mismatch, a table showing exactly which invoices account for the difference (credit notes issued, return of goods, timing of invoice vs payment) is the most effective reply
- Attaches supporting documents: GSTR returns, financial statements, purchase invoices, bank statements, contracts, and any other evidence that supports your explanation
- Acknowledges errors if there are any: If you made a genuine mistake in filing, acknowledge it clearly, explain how it happened (human error, software issue), show the correct position, and offer to pay any tax due with interest
- States the legal position clearly: If your position is that no tax is due, cite the relevant exemption, rate, or provision
- Is professionally drafted: A CA-authored reply with proper citations carries significantly more weight than a self-drafted one

Note: If there is tax genuinely due, consider paying it voluntarily before the reply. Voluntary payment during ASMT-10 stage - before formal demand proceedings - demonstrates good faith and is often treated more favourably by the officer.

**05. THE ASMT-10 TO DRC-01 ESCALATION PATH**
It is worth understanding the full escalation path so you know what you are trying to prevent:
- ASMT-10 (scrutiny notice): Officer flags a discrepancy. This is where you are now.
- ASMT-12 (acceptance): If your reply is good, this is where it ends.
- Section 65/66 audit: Officer decides a formal audit is needed. Your premises can be visited, records can be inspected.
- DRC-01A (pre-SCN intimation): Officer has determined a tax demand and is giving you one more informal opportunity to pay before formal proceedings.
- DRC-01 (show cause notice): Formal demand. You have 30 days to reply.
- DRC-07 (demand order): Final demand with penalty and interest.
- The earlier you engage seriously in this chain, the better the outcome. ASMT-10 is the best stage to resolve this.

**06. MISTAKES THAT TURN A MINOR QUERY INTO A MAJOR DEMAND**
- Treating ASMT-10 as optional: Some businesses assume a GST notice is just a formality. It is not. Non-reply leads to Best Judgment Assessment.
- Generic replies without reconciliation: Saying "the discrepancy is due to different accounting treatment" without a table showing the actual numbers is useless.
- Not attaching documents: The officer needs evidence. A reply without annexures is like a court submission without exhibits.
- Acknowledging more than what is asked: Only address what the notice specifically asks about. Do not volunteer information that opens new lines of inquiry.
- Ignoring the notice because the amount seems small: Officers use ASMT-10 responses (or the absence of them) to determine whether to escalate. Even a small discrepancy ignored can trigger a full audit.

### FAQs

**Q: My ASMT-10 is about a GSTR-1 vs GSTR-3B mismatch but the difference is only because I filed an amendment. How do I explain this?**
A: This is one of the most common and cleanest explanations. In your ASMT-11 reply, provide a reconciliation showing: original GSTR-1 value, the amendment filed in which period, the net impact, and how the final GSTR-3B number reflects the correct position. Attach the amendment filings and the original returns. Most officers are familiar with this scenario.

**Q: I received ASMT-10 for a period where I had genuine ITC mismatches because my suppliers were non-compliant. What do I do?**
A: This is a genuinely difficult situation because the law (Section 16(2)(aa) after 2022) ties your ITC claim to what your supplier files. In your reply, show your purchase invoices and GSTR-2B side by side. Demonstrate that you followed up with suppliers, have evidence of receipt of goods or services, and paid for them. The legal argument is evolving through court decisions - a CA can advise on the strongest current position.

**Q: I am receiving ASMT-10 notices for multiple years at the same time. Where do I start?**
A: Start with the earliest year, as its resolution often informs the methodology for later years. Also, if the same issue (e.g., turnover mismatch) appears across multiple years, one well-argued reply can serve as the template for all. Handling them together with professional help is more efficient than tackling them one by one.

**Q: The ASMT-10 notice says the discrepancy is Rs. 12 lakh. Will I have to pay all of this?**
A: Not necessarily. The Rs. 12 lakh is the discrepancy flagged, not necessarily the final tax due. After your reply and reconciliation, the officer may accept your explanation fully, partially, or not at all. What you eventually owe (if anything) depends entirely on the quality of your reply.

---

## 5. GST ASMT-14 Best Judgment Assessment

**File:** `lib/guides/pages/gst-asmt-14-best-judgment.ts`

- **Slug:** `gst-asmt-14-best-judgment`
- **Title:** GST ASMT-14 Notice: Best Judgment Assessment
- **SEO Title:** GST ASMT-14 Notice: Best Judgment Assessment Explained (2025) | Ollvy
- **SEO Description:** Received a GST ASMT-14 notice? This is a best judgment assessment - usually issued when ASMT-10 was not replied to. Understand what it means and how to challenge it.
- **Category:** GST Notice
- **Severity:** urgent
- **Deadline:** 30 days to challenge via appeal
- **Deadline Note:** ASMT-14 is the outcome of not replying to ASMT-10. The window to prevent this has passed - but you can still challenge it.
- **CTA Service:** gst-monthly
- **Related Tools:**
  - Penalty Calculators: gst-late-filing, gst-demand-notice
  - Document Checklists: gst-registration

### Sections

**01. WHAT IS ASMT-14 AND HOW DID YOU GET HERE**
If you are reading this, it is likely because an earlier ASMT-10 scrutiny notice was either not replied to or the reply was not accepted by the officer.

ASMT-14 is issued under Section 62 of the CGST Act (Assessment of Non-Filers). It is the GST officer's best judgment assessment - meaning they have determined your GST liability using whatever information they had, without your input. The final assessment order follows in ASMT-15.

Here is the important part: if you file all your pending returns within 30 days of receiving ASMT-14, the assessment order can be withdrawn. This is a one-time relief built into the law.

Note: Source: Section 62, CGST Act 2017. Rule 100, CGST Rules 2017.

**02. YOUR OPTIONS NOW**
- Option 1 - File pending returns within 30 days: If ASMT-14 was triggered by non-filing of returns, file all pending GSTR-3B returns within 30 days of the assessment order. Under Section 62(2), the assessment order is deemed to have been withdrawn upon filing of valid returns. Pay all tax, interest (18% p.a. on late tax), and late fees (GSTR-3B late fee: Rs. 50 per day for returns with tax liability; Rs. 20 per day for nil returns - capped at Rs. 10,000 per return).
- Option 2 - File an appeal: If you believe the best judgment assessment amount is significantly overstated (which is common - officers make conservative assumptions when they have no data), you can appeal to the Appellate Authority under Section 107 within 3 months of the assessment order. Pre-deposit of 10% of disputed tax is required.
- Option 3 - Do both: File pending returns (to trigger Section 62(2) withdrawal) and also file an appeal against the assessment for the period where returns cannot be filed (e.g., if there was a penalty imposed beyond just tax).

**03. WHY BEST JUDGMENT ASSESSMENTS ARE ALMOST ALWAYS OVERSTATED**
When an officer does a best judgment assessment without your data, they use the most conservative (for them) assumptions available:
- Turnover is estimated based on bank credits, e-way bill data, third-party information - without the benefit of your reconciliation
- No Input Tax Credit is allowed in a best judgment assessment - your entire tax liability is computed on a gross basis
- Tax rates applied may be the higher applicable rate for your industry
- This means the ASMT-14 amount is almost always much higher than your actual liability

Note: This is exactly why filing pending returns (even late) within 30 days is often the most effective path - the Section 62(2) withdrawal resets the position to your actual filed numbers rather than the officer's estimates.

### FAQs

**Q: I received ASMT-14 but I had actually replied to ASMT-10. What happened?**
A: This can happen if your reply was not considered satisfactory, if it was filed after the deadline, or (rarely) if there was a system issue. Check your GST portal for the ASMT-11 (your reply) and ASMT-12 (officer's response to your reply). If the officer issued ASMT-14 without acknowledging your reply, this is grounds to challenge the ASMT-14 in appeal.

**Q: The ASMT-14 shows Rs. 22 lakh as my GST liability. My actual liability should be around Rs. 3 lakh. Should I file returns or appeal?**
A: File returns first (within 30 days) to trigger the Section 62(2) withdrawal. This brings the dispute down to your actual liability. If there are still disputes after filing (interest, penalty, or specific disallowances), deal with those through the officer or appeal. The Section 62(2) route is almost always cheaper and faster than a full appeal.

---

## 6. GST REG-17 Cancellation Notice

**File:** `lib/guides/pages/gst-reg-17-cancellation-notice.ts`

- **Slug:** `gst-reg-17-cancellation-notice`
- **Title:** GST REG-17 Notice: Your GST Registration May Be Cancelled
- **SEO Title:** GST REG-17 Cancellation Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Got a GST REG-17 show cause notice for cancellation? You have 7 days to respond or lose your GSTIN. Understand why it was issued and how to save your registration.
- **Category:** GST Notice
- **Severity:** urgent
- **Deadline:** 7 working days from date of notice
- **Deadline Note:** This is the shortest deadline in the GST compliance calendar. Seven working days is not much time. Start today.
- **CTA Service:** gst-revocation
- **Related Tools:**
  - Penalty Calculators: gst-late-filing
  - Document Checklists: gst-registration

### Sections

**01. YOUR GST REGISTRATION IS AT RISK. HERE IS WHAT IS HAPPENING.**
REG-17 is a Show Cause Notice (SCN) for cancellation of your GST registration. It means the GST officer has grounds to believe your registration should be cancelled - and they are giving you one chance to explain why it should not be.

You have 7 working days to file your reply in Form REG-18 on the GST portal.

If you do not reply, the officer will issue REG-19 (cancellation order). Once your GSTIN is cancelled, you cannot charge GST on your invoices, you cannot claim Input Tax Credit, and your clients who are GST-registered businesses will face ITC rejection on your past invoices. The downstream damage is serious.

Note: Source: Section 29(2), Central Goods and Services Tax Act, 2017. Rule 22, CGST Rules 2017.

**02. WHY GST REGISTRATIONS GET CANCELLED (REG-17 GROUNDS)**
The officer can issue REG-17 for any of these reasons:
- Non-filing of returns: You have not filed GST returns for 6 or more consecutive months (or 2 tax periods for composition dealers). This is the most common trigger.
- Fraudulent registration: The registration was obtained using false information, fake documents, or a non-existent business.
- Business discontinued: Your business has been closed, sold, or transferred without applying for cancellation or transfer of registration.
- Constitution change: A partnership dissolved, a sole proprietor died, or a company was wound up without updating the GSTIN.
- Violation of anti-profiteering provisions: In rare cases.
- Registration obtained voluntarily but business not commenced within 6 months: Relevant for voluntary registrations.
- GSTIN found in databases of shell companies or fake invoice issuers: More common post-2022 as GSTIN verification has improved.

**03. YOUR 7-DAY WINDOW: WHAT YOUR REPLY MUST DO**
Your reply in REG-18 must specifically address the ground mentioned in the REG-17 notice.
- For non-filing of returns: File all pending returns IMMEDIATELY before or alongside your reply. A reply saying "I will file shortly" is insufficient. The officer needs to see that the returns are filed before they will consider retaining your registration. Pay all tax, interest, and late fees.
- For fraudulent registration allegation: Present evidence that your business is genuine - rent agreement, bank account, stock photographs, client invoices, Udyam certificate, or any other proof of genuine business operations.
- For discontinued business: If the business continues under a different structure (new company, new partner), apply for fresh registration for the new entity and apply for cancellation of the old one rather than fighting REG-17.
- For PAN-level issues: If the notice is linked to your PAN appearing in a suspicious database, contact a CA immediately. This requires direct engagement with the department.
- Always include a personal appearance request: Request a personal hearing before any adverse order is passed. The law requires the officer to give you a hearing opportunity.

Note: File your reply on the GST portal: Services > Registration > Application for Filing Clarification (REG-18). Attach all documents within the 7 working day window.

**04. IF REG-19 IS ALREADY ISSUED: HOW TO REVOKE CANCELLATION**
If you received REG-17, did not respond in time, and cancellation has already been ordered (REG-19), you are not completely without options. You can apply for revocation of cancellation.
- For cancellations due to non-filing: File all pending returns first. Then apply for revocation of cancellation in Form REG-21 within 90 days of the cancellation order.
- The department has discretion to approve or reject revocation. If it is rejected, you can appeal to the Appellate Authority.
- IMPORTANT: The Supreme Court in November 2022 directed that businesses whose GST registrations were cancelled during COVID-related periods (non-filing due to COVID disruption) should be given a genuine opportunity for revocation. If your cancellation is from 2020-21, check whether any amnesty or relaxation applies.
- If revocation is not possible, you will need to apply for a fresh registration - which will require re-verification and may face additional scrutiny given the prior cancellation history.

**05. THE BUSINESS IMPACT OF GSTIN CANCELLATION**
This is why replying within 7 days matters so much.
- You cannot issue tax invoices or collect GST from the date of cancellation
- Your customers cannot claim ITC on invoices you issued after suspension/cancellation
- If your GSTIN is reflected as "cancelled" on the GST portal, clients may retroactively question invoices you issued in the period before cancellation (especially if the portal shows "suspended" from an earlier date)
- Government tenders, e-commerce platforms, and many corporate procurement processes require an active GSTIN
- Banking and loan facilities tied to your GSTIN can be affected

### FAQs

**Q: I have been filing returns but I still received REG-17 for non-filing. How is that possible?**
A: A few things to check: (a) Were all your returns filed correctly and fully, or were some filed as nil returns when you had actual supplies? (b) Is there a system glitch showing your returns as unfiled despite being filed? Check the return filing status on the portal. If returns are filed, attach the filed return acknowledgements in your REG-18 reply.

**Q: My supplier received a REG-17 and their GSTIN may be cancelled. What does this mean for my ITC?**
A: You may face ITC reversal for invoices from this supplier if their registration is cancelled retroactively. Monitor the situation. If their GSTIN is cancelled, your safest position is to demonstrate that you received the goods/services, paid for them, and the TDS/payment was made before the cancellation date. Keep all such documentation.

**Q: I received REG-17 but my business has genuinely closed. Should I fight it or let the cancellation happen?**
A: If the business is genuinely closed, you should actually apply for voluntary cancellation (REG-16) yourself - do not let REG-17 cancel it. The difference matters: a self-cancelled registration shows responsible compliance behaviour; a forced cancellation under REG-17 creates a negative compliance record attached to your PAN.

---

## 7. GST REG-31 Suspension Notice

**File:** `lib/guides/pages/gst-reg-31-suspension.ts`

- **Slug:** `gst-reg-31-suspension`
- **Title:** GST REG-31 Notice: Your GST Registration is Suspended
- **SEO Title:** GST REG-31 Suspension Notice: What to Do Now (2025) | Ollvy
- **SEO Description:** Received GST REG-31? Your registration is suspended. Understand what triggered it, what you cannot do while suspended, and how to restore your GSTIN.
- **Category:** GST Notice
- **Severity:** urgent
- **Deadline:** REG-17 show cause notice follows within 30 days
- **Deadline Note:** Suspension is the warning shot. REG-17 (cancellation notice) follows shortly. Act now to prevent permanent cancellation.
- **CTA Service:** gst-revocation
- **Related Tools:**
  - Penalty Calculators: gst-late-filing
  - Document Checklists: gst-registration

### Sections

**01. YOUR GSTIN IS SUSPENDED - HERE IS WHAT THAT MEANS**
REG-31 is a suspension notice. It means your GST registration has been temporarily put on hold pending further action. Suspension is not cancellation - but it is the step before cancellation.

While suspended, you cannot:
- File GSTR-1 (outward supplies)
- File GSTR-3B (tax payment)
- Issue tax invoices with valid GST
- Claim or utilise Input Tax Credit

In practical terms, your GST operations are frozen until the suspension is lifted or the registration is cancelled.

Note: Source: Rule 21A, CGST Rules 2017.

**02. WHY SUSPENSIONS HAPPEN**
The system or officer suspends registrations for these reasons:
- Return non-filing: If you have not filed returns for the prescribed period, the system may auto-suspend before the officer issues REG-17.
- Voluntary cancellation pending: You applied for voluntary cancellation (REG-16) and the registration is suspended while your application is processed.
- Suo-motu cancellation process initiated: The officer has reason to believe your registration should be cancelled and has initiated proceedings. Suspension happens while REG-17 is being prepared.
- Discrepancy in registration details: The department found inconsistencies in your registration (address, PAN, bank account) that require verification.

**03. WHAT COMES NEXT**
Once REG-31 is issued, the officer must issue REG-17 (show cause notice for cancellation) within 30 days. If REG-17 is not issued within 30 days, the suspension is deemed to be revoked automatically.

Your path forward:
- File all pending returns immediately - this is the single most effective step
- Respond to any discrepancies the department has flagged
- Wait for REG-17 and respond within 7 working days when it arrives
- If no REG-17 arrives within 30 days, confirm that your suspension has been lifted on the portal

Note: Source: Rule 21A(4), CGST Rules 2017 - "Where no order... is issued within a period of thirty days... the suspension shall be deemed to be revoked."

**04. WHAT YOU CAN STILL DO WHILE SUSPENDED**
- You can log in to the GST portal
- You can file GSTR-9 (annual return) for past periods if it was pending
- You can pay any outstanding tax through DRC-03 (voluntary payment)
- You can submit replies to notices
- You can apply for revocation if cancellation has already been ordered

**05. IF SUSPENSION TURNS INTO CANCELLATION**
If REG-17 is issued and you do not respond (or your response is rejected), the officer will issue REG-19 (cancellation order). At that point:
- Your suspension converts to permanent cancellation from a retrospective date (often the date of suspension or earlier)
- You can apply for revocation within 90 days of the cancellation order
- If revocation is rejected, your only option is a fresh registration

### FAQs

**Q: My registration shows "Suspended" on the portal but I did not receive any notice. What happened?**
A: Check your registered email and SMS. The notice may have been served electronically. Also check the "View Notices and Orders" section on the GST portal under Services > User Services. The notice is legally served once it appears on the portal, regardless of whether you received an email.

**Q: Can my customers claim ITC on invoices I issued while I was suspended?**
A: No. Invoices issued during suspension are not valid tax invoices. Your customers cannot claim ITC on them. This is why resolving suspension quickly is critical - every day suspended is a day your business cannot issue valid invoices.

---

## 8. GST GSTR-2B ITC Mismatch Notice

**File:** `lib/guides/pages/gst-gstr2b-itc-mismatch.ts`

- **Slug:** `gst-gstr2b-itc-mismatch`
- **Title:** GST GSTR-2B ITC Mismatch: What to Do When ITC is Blocked
- **SEO Title:** GSTR-2B ITC Mismatch: How to Resolve Blocked Credit (2025) | Ollvy
- **SEO Description:** Your ITC claim exceeds what is available in GSTR-2B? Understand why ITC gets blocked, how to reconcile with suppliers, and what to do if credit is permanently unavailable.
- **Category:** GST Notice
- **Severity:** serious
- **Deadline:** Ongoing - reconcile monthly before filing GSTR-3B
- **Deadline Note:** ITC mismatches compound over time. A small monthly mismatch becomes a large annual problem if not addressed regularly.
- **CTA Service:** gst-monthly
- **Related Tools:**
  - Penalty Calculators: gst-late-filing, gst-demand-notice
  - Document Checklists: gst-registration

### Sections

**01. WHAT GSTR-2B IS AND WHY IT MATTERS**
GSTR-2B is an auto-generated statement that shows the Input Tax Credit available to you based on what your suppliers have filed in their GSTR-1. It is generated on the 14th of every month for the previous month.

From January 2022, Section 16(2)(aa) of the CGST Act makes GSTR-2B the definitive document for ITC claims. You can only claim ITC on invoices that appear in your GSTR-2B. If your supplier has not filed their return or has not included your invoice, you cannot claim that credit - regardless of whether you have the invoice and have paid for the goods or services.

Note: Source: Section 16(2)(aa), CGST Act 2017; Rule 36(4), CGST Rules 2017.

**02. WHY YOUR ITC CLAIM MAY EXCEED GSTR-2B**
- Supplier has not filed GSTR-1: The most common reason. Your supplier issued you an invoice but has not filed their return for that month.
- Invoice date vs filing period mismatch: The invoice is dated in one month but the supplier reported it in a different month's GSTR-1.
- Supplier filed with errors: Wrong GSTIN, wrong invoice number, wrong amount - any of these can cause the invoice to not appear correctly in your 2B.
- Supplier's registration was cancelled or suspended: Invoices from cancelled GSTINs may not reflect in your 2B.
- Duplicate invoice in your books: You may have entered the same invoice twice in your accounting.

**03. THE MONTHLY RECONCILIATION PROCESS**
Before filing GSTR-3B, you must reconcile your purchase register with GSTR-2B. Here is the process:
- Download GSTR-2B from the portal on or after the 14th
- Compare it line by line with your purchase register
- Identify invoices that appear in your books but not in 2B
- For each missing invoice, determine whether it is (a) a timing difference (supplier will file later), (b) supplier error (wrong details), or (c) potentially unclaimed credit
- Claim only what appears in 2B, or document the excess claim with a clear reconciliation

Note: If you claim more ITC than what is in GSTR-2B, you must be prepared to justify it. Officers are now matching claims to 2B automatically.

**04. WHAT TO DO ABOUT MISSING INVOICES**
- Contact the supplier immediately: Most mismatches are resolved by simply asking the supplier to file their pending GSTR-1 or correct the error in their next filing.
- Document everything: Keep records of your follow-up (emails, WhatsApp messages) showing you attempted to get the supplier to comply.
- Claim in subsequent period: If the invoice appears in a later month's 2B, you can claim it then (subject to the time limit under Section 16(4)).
- ITC time limit: You can claim ITC up to November 30 following the end of the financial year, or the date of filing the annual return, whichever is earlier.

**05. WHEN ITC IS GENUINELY UNAVAILABLE**
In some cases, ITC cannot be claimed even if you have a valid invoice:
- Supplier has permanently stopped filing and their GSTIN is cancelled
- Invoice is for blocked credit items (Section 17(5)) - e.g., food and beverages, club memberships, certain vehicles
- Invoice is beyond the time limit for claiming
- Supplier is flagged as a fake invoice issuer

Note: If you have already claimed ITC and it is subsequently found to be ineligible, you must reverse it with interest (18% p.a. from the date of wrong availment).

### FAQs

**Q: I have a valid invoice and proof of payment. Why can I not claim ITC if it is not in GSTR-2B?**
A: This is a genuine hardship caused by Section 16(2)(aa). The law ties your ITC entitlement to what your supplier files, not what you received. Courts have given some relief in specific cases, but as a practical matter, your ITC is blocked until the invoice appears in 2B. Follow up aggressively with suppliers.

**Q: My supplier says they filed but the invoice is still not in my 2B. What now?**
A: Ask the supplier for a screenshot of their GSTR-1 showing the invoice. Check if they filed with the correct GSTIN. If there is a mismatch, the supplier needs to amend in their next GSTR-1. If they filed correctly but it is still not appearing, escalate to the GST helpdesk.

---

## 9. GST GSTR-9 Annual Return Mismatch

**File:** `lib/guides/pages/gst-gstr9-annual-return-mismatch.ts`

- **Slug:** `gst-gstr9-annual-return-mismatch`
- **Title:** GST GSTR-9 Annual Return Mismatch: How to Handle Discrepancies
- **SEO Title:** GSTR-9 Annual Return Mismatch: How to Reconcile (2025) | Ollvy
- **SEO Description:** Discrepancies between your GSTR-9 annual return and monthly returns? Understand what triggers scrutiny, how to reconcile, and how to avoid notices.
- **Category:** GST Notice
- **Severity:** serious
- **Deadline:** December 31 for the preceding financial year
- **Deadline Note:** GSTR-9 discrepancies are a major trigger for ASMT-10 scrutiny notices. Getting this right prevents future problems.
- **CTA Service:** gst-monthly
- **Related Tools:**
  - Penalty Calculators: gst-late-filing
  - Document Checklists: gst-registration

### Sections

**01. WHAT GSTR-9 IS AND WHY MISMATCHES MATTER**
GSTR-9 is the annual return that consolidates all your monthly GSTR-1 and GSTR-3B filings for the financial year. It is due by December 31 following the end of the financial year.

The department uses GSTR-9 to cross-verify your monthly filings. Any discrepancy between what you reported in monthly returns and what appears in the annual return is a red flag. Significant mismatches trigger ASMT-10 scrutiny notices.

Note: Source: Section 44, CGST Act 2017; Rule 80, CGST Rules 2017.

**02. COMMON SOURCES OF GSTR-9 MISMATCHES**
- Amendments filed in monthly returns not reflected in annual totals: If you amended invoices in GSTR-1, the GSTR-9 needs to capture both the original and amended values correctly.
- ITC reversals and re-claims: ITC reversed in one month and re-claimed in another needs to be shown correctly in the annual reconciliation.
- Credit notes and debit notes: These must be netted against the original supply values.
- Turnover rounding differences: Small differences between accounting software and GST portal calculations can accumulate over 12 months.
- Tax paid through DRC-03: Voluntary payments made outside of regular returns must be accounted for.
- RCM transactions: Reverse charge supplies and the corresponding ITC claims need special attention.

**03. THE RECONCILIATION TABLES IN GSTR-9**
GSTR-9 includes specific reconciliation tables:
- Table 6: ITC reconciliation - comparing what you claimed in GSTR-3B vs what was available in GSTR-2B
- Table 9: Tax payment reconciliation - comparing tax declared in GSTR-1 vs tax paid in GSTR-3B
- Table 14: Differential tax paid through DRC-03
- Table 16/17: HSN-wise summary of inward and outward supplies

Errors in these tables are the primary source of discrepancy notices.

**04. WHAT TO DO IF YOU HAVE ALREADY FILED WITH ERRORS**
GSTR-9 cannot be revised once filed. If you have filed with errors:
- Minor errors: Document the correct position in your records. If the error is in your favour (you reported less tax than actually paid), no action is required.
- Errors where you reported less tax: Pay the differential through DRC-03 with interest. Keep a reconciliation note explaining the error.
- Errors in ITC claim: If you over-claimed, reverse the excess in a subsequent GSTR-3B with interest. If you under-claimed, you may have lost it (subject to time limits).

**05. PREVENTING GSTR-9 ISSUES**
- Reconcile monthly: Do not wait until December to reconcile. Monthly reconciliation prevents the pile-up.
- Use the pre-filled data: The GST portal provides pre-filled GSTR-9 based on your monthly filings. Start from this and verify against your books.
- Flag amendments: Maintain a separate tracker for all amendments filed during the year.
- Reconcile with books before filing: GSTR-9 must match your audited financials. Any difference should be explainable.

### FAQs

**Q: The difference between my monthly filings and GSTR-9 is Rs. 5,000. Is that going to trigger a notice?**
A: Small differences (under Rs. 10,000-20,000) typically do not trigger scrutiny on their own. The system flags significant discrepancies - usually percentage-based or absolute thresholds. However, even small differences should be documented with an explanation in your files.

**Q: I filed GSTR-9 late. What is the penalty?**
A: Late fee is Rs. 200 per day (Rs. 100 CGST + Rs. 100 SGST), capped at 0.5% of turnover in the state. For large turnover businesses, this can be substantial.

---

# Income Tax Notices (10 Pages)

---

## 10. Income Tax Section 143(1) Intimation

**File:** `lib/guides/pages/income-tax-143-1-intimation.ts`

- **Slug:** `income-tax-143-1-intimation`
- **Title:** Income Tax 143(1) Intimation: What It Means and What to Do
- **SEO Title:** Income Tax 143(1) Intimation Explained (2025) | Ollvy
- **SEO Description:** Received a 143(1) intimation from the Income Tax department? Understand what adjustments were made, whether you owe tax or get a refund, and how to respond.
- **Category:** Income Tax Notice
- **Severity:** moderate
- **Deadline:** 30 days to file rectification request if you disagree
- **Deadline Note:** 143(1) is usually not a notice to worry about - it is just the CPC confirming processing. But if there is a demand, you need to act.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. THIS IS NOT A SCRUTINY NOTICE - IT IS A PROCESSING CONFIRMATION**
A 143(1) intimation is generated by the Centralised Processing Centre (CPC) after your Income Tax Return is processed. It is not a notice asking for documents or explanations - it is simply the department's computation of your tax based on what you filed.

The intimation shows:
- Total income as computed by the CPC
- Tax payable or refund due
- Any adjustments made by the CPC to your filed return

Note: Source: Section 143(1), Income Tax Act 1961. Every return filed is processed under this section within 9 months of filing.

**02. WHAT THE INTIMATION CONTAINS**
- Your filed income figures
- CPC-adjusted income figures (if any adjustments were made)
- Tax computed by CPC
- TDS/advance tax credit allowed
- Net tax payable or refund due
- Interest under Sections 234A/B/C if applicable

If the CPC-adjusted figures match what you filed and the refund/demand is as expected, no action is needed. The issue arises when there is a discrepancy.

**03. COMMON REASONS FOR ADJUSTMENTS**
- Arithmetic errors in your return
- Incorrect claim of deduction (e.g., 80C claim exceeds limit)
- Mismatch between TDS claimed and Form 26AS/AIS data
- Disallowance of expenses that require supporting documents
- Income added from AIS/TIS that you did not declare

**04. IF THERE IS A TAX DEMAND**
If the intimation shows tax payable:
- Verify the computation - is the CPC's adjustment correct?
- If correct: Pay the demand through the e-filing portal (Challan 280)
- If incorrect: File a rectification request under Section 154 within 30 days
- Interest will accrue on unpaid demands, so act quickly

**05. IF YOU DISAGREE WITH THE ADJUSTMENT**
File a rectification request (Section 154) through the e-filing portal:
- Login > e-File > Rectification > New Request
- Select the assessment year and type of rectification
- Upload supporting documents showing why the adjustment is wrong
- The CPC will process the rectification and issue a revised intimation

Note: Rectification is free and online. For genuine errors by the CPC, this is usually resolved within 30-60 days.

### FAQs

**Q: The 143(1) intimation shows a refund. Do I need to do anything?**
A: If the refund amount matches what you expected, no action needed. The refund will be credited to your bank account (verify your bank details are correct in your e-filing profile). If the refund is less than expected, check whether the CPC made adjustments.

**Q: I received 143(1) but my return shows "pending" on the portal. Why?**
A: The intimation is generated after processing. If you received it, your return has been processed. The portal status may take a few days to update. Check again after 24-48 hours.

---

## 11. Income Tax Section 143(2) Scrutiny Notice

**File:** `lib/guides/pages/income-tax-143-2-scrutiny.ts`

- **Slug:** `income-tax-143-2-scrutiny`
- **Title:** Income Tax 143(2) Scrutiny Notice: What to Expect
- **SEO Title:** Income Tax 143(2) Scrutiny Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received an Income Tax 143(2) scrutiny notice? Your return has been selected for detailed examination. Understand the process, timeline, and how to respond.
- **Category:** Income Tax Notice
- **Severity:** urgent
- **Deadline:** As specified in the notice (typically 15-30 days for initial response)
- **Deadline Note:** 143(2) is a formal scrutiny. This is serious. Get professional help and respond within the deadline.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. YOUR RETURN HAS BEEN SELECTED FOR SCRUTINY**
A 143(2) notice means the Assessing Officer (AO) has selected your return for detailed examination. Unlike 143(1) which is automated, 143(2) involves a human officer reviewing your return and supporting documents.

This notice must be issued within 3 months from the end of the financial year in which the return was filed (for returns filed by the due date) or within 3 months from the date of filing (for belated returns).

Note: Source: Section 143(2), Income Tax Act 1961. Scrutiny assessments are completed under Section 143(3).

**02. WHY RETURNS GET SELECTED FOR SCRUTINY**
- CASS (Computer Assisted Scrutiny Selection): Returns are selected based on risk parameters - high cash deposits, significant capital gains, large deductions, turnover thresholds, etc.
- Specific information: The department received information about you from third parties (banks, registrars, foreign tax authorities)
- Random selection: A small percentage of returns are selected randomly
- Mismatch with AIS/TIS: Income reported in your Annual Information Statement does not match your return

**03. THE SCRUTINY PROCESS**
- Initial notice (143(2)): Asks you to appear or submit documents
- Questionnaire: The AO issues specific questions about income, deductions, investments
- Document submission: You provide books of accounts, bank statements, contracts, invoices
- Hearings: You or your CA appears before the AO to explain and clarify
- Draft assessment: The AO shares a proposed assessment with adjustments
- Final order (143(3)): The assessment order is passed with or without additions to income

The entire process typically takes 6-18 months depending on complexity.

**04. HOW TO RESPOND**
- Engage a CA/tax professional immediately - scrutiny is not DIY territory
- Compile all documents mentioned in the notice
- Respond within the deadline (request extension if needed, in writing, before the deadline)
- Be factual and precise - do not volunteer extra information
- Maintain a record of all submissions and correspondence

**05. POSSIBLE OUTCOMES**
- No addition: AO accepts your return as filed. Assessment order reflects your declared income.
- Addition with your agreement: AO finds an issue, you agree and pay the additional tax
- Addition without agreement: AO adds income, you disagree and plan to appeal
- Penalty proceedings: If the AO believes there was concealment or furnishing of inaccurate particulars, penalty proceedings under Section 270A/271(1)(c) may be initiated

Note: If there are additions, you have 30 days to file an appeal to the CIT(Appeals). Paying the demand (or at least 20% of it) may be required to stay recovery during appeal.

### FAQs

**Q: I received 143(2) but I have filed my return correctly. Should I still be worried?**
A: Selection for scrutiny does not mean the department suspects wrongdoing. Many scrutinies end with the return being accepted as filed. However, you must respond properly and on time. Engage a CA to ensure your response is complete and professional.

**Q: Can I handle scrutiny without a CA?**
A: Technically yes, but not recommended. The scrutiny process involves legal and procedural nuances. A professional knows how to present your case, what documents to submit, and what arguments carry weight. The cost of a CA is usually less than the cost of adverse additions due to poor handling.

---

## 12. Income Tax Section 142(1) Notice

**File:** `lib/guides/pages/income-tax-142-1-notice.ts`

- **Slug:** `income-tax-142-1-notice`
- **Title:** Income Tax 142(1) Notice: Request for Information
- **SEO Title:** Income Tax 142(1) Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Got an Income Tax 142(1) notice? The department is asking for specific information or documents. Understand what it means and how to respond before the deadline.
- **Category:** Income Tax Notice
- **Severity:** serious
- **Deadline:** As specified in the notice (typically 15 days, extendable)
- **Deadline Note:** 142(1) is an information request, not a demand. But ignoring it can lead to best judgment assessment. Respond on time.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. WHAT IS A 142(1) NOTICE**
A 142(1) notice is issued by the Assessing Officer to:
- Ask you to file a return (if you have not filed), or
- Request specific information, documents, or accounts for assessment purposes

It is an information-gathering notice, not a demand for tax. The officer is asking for clarity before deciding whether any additions need to be made.

Note: Source: Section 142(1), Income Tax Act 1961.

**02. TYPES OF 142(1) NOTICES**
- Inquiry before assessment: Issued during scrutiny to request specific documents
- Notice to non-filers: Issued to persons who have not filed a return but should have (based on high-value transactions, TDS credits, etc.)
- Pre-scrutiny inquiry: Issued to gather information before deciding whether to issue 143(2)

**03. HOW TO RESPOND**
- Read the notice carefully - it will specify exactly what documents or information is required
- Compile the requested documents
- Submit online through the e-filing portal (Compliance > e-Proceedings)
- If you need more time, request an adjournment before the deadline
- Keep a copy of everything you submit

**04. IF YOU DO NOT RESPOND**
The consequences of ignoring a 142(1) notice are serious:
- Best judgment assessment: The AO can assess your income based on available information without your input (Section 144)
- Penalty: Rs. 10,000 for failure to comply with 142(1) notice (Section 272A)
- Prosecution: Repeated non-compliance can lead to prosecution under Section 276D

**05. WHAT NOT TO DO**
- Do not ignore the notice
- Do not submit incomplete information hoping the AO will not notice
- Do not submit documents that contradict your filed return without explanation
- Do not miss the deadline without requesting extension

### FAQs

**Q: I already filed my return. Why am I getting a 142(1) notice?**
A: The notice may be asking for supporting documents related to your filed return (income sources, deduction proofs, bank statements). The AO wants to verify what you declared.

**Q: The notice asks for documents I do not have. What do I do?**
A: Submit what you have and clearly explain in your response which documents are unavailable and why. Provide alternative evidence if possible. Do not submit fabricated documents - that is a serious offence.

---

## 13. Income Tax Section 148/148A Reopening Notice

**File:** `lib/guides/pages/income-tax-148-148a-reopening.ts`

- **Slug:** `income-tax-148-148a-reopening`
- **Title:** Income Tax 148/148A Notice: Assessment Reopening
- **SEO Title:** Income Tax 148/148A Reopening Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received a 148 or 148A notice? The department wants to reopen your past assessment. Understand why, your rights, and how to respond effectively.
- **Category:** Income Tax Notice
- **Severity:** urgent
- **Deadline:** 30 days for 148A response; then follow 148 notice timeline
- **Deadline Note:** Reopening is a serious matter. The department believes you have escaped income. Your response to 148A is critical.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. WHAT REOPENING MEANS**
A 148/148A notice means the Income Tax department wants to reassess an assessment year that was already completed. They believe income has "escaped assessment" - meaning income that should have been taxed was not.

The law changed significantly in 2021. Now, before issuing a 148 notice, the AO must first issue a 148A notice giving you an opportunity to respond.

Note: Source: Sections 147, 148, 148A, Income Tax Act 1961 (as amended by Finance Act 2021).

**02. THE NEW TWO-STEP PROCESS (POST-2021)**
- Step 1 - 148A(b) Notice: The AO sends you a notice stating why they believe income has escaped assessment. You get a hearing opportunity.
- Your response: You submit your objections with supporting documents within the deadline (typically 7-30 days).
- 148A(d) Order: The AO considers your response and decides whether to proceed. They must pass a speaking order giving reasons.
- Step 2 - 148 Notice: If the AO decides to proceed, they issue a 148 notice requiring you to file a return for the relevant year.

**03. TIME LIMITS FOR REOPENING**
- 3 years: If income escaped assessment is less than Rs. 50 lakh
- 10 years: If income escaped assessment is Rs. 50 lakh or more and the AO has evidence of asset, expenditure, or deposit in a bank account outside the books
- IMPORTANT: These time limits run from the end of the relevant assessment year

**04. HOW TO RESPOND TO 148A**
Your response to 148A is your first and best opportunity to prevent reopening.
- Address each ground mentioned in the notice specifically
- Provide documentary evidence that the income was already assessed or did not escape
- Cite legal provisions and case law supporting your position
- If there are procedural defects in the notice (wrong year, wrong ground, time-barred), raise them clearly
- Engage a CA or tax lawyer - 148A responses require legal precision

**05. AFTER 148 IS ISSUED**
If the 148 notice is issued after considering your 148A response:
- You must file a return for the relevant year (even if you already filed one for that year)
- This return will be treated as a fresh return
- The AO will conduct assessment proceedings
- You retain the right to challenge the reopening itself through appeal or writ petition

Note: Many reopenings are quashed by courts on procedural grounds (inadequate reasons, time-barred, change of opinion without new information). A tax professional can assess whether your case has such grounds.

### FAQs

**Q: Can they reopen my return just because they disagree with my tax position?**
A: No. "Change of opinion" is not a valid ground for reopening. The AO must have new information that was not available or considered during the original assessment. If the reopening is based purely on re-examining the same material, it can be challenged.

**Q: I received a 148A notice for AY 2018-19. Is that time-barred?**
A: It depends on the amount of escaped income alleged and the nature of evidence. For less than Rs. 50 lakh, 3 years is the limit (making AY 2018-19 potentially time-barred for regular cases as of 2025). Check with a CA for your specific situation and any COVID-related extensions.

---

## 14. Income Tax Section 139(9) Defective Return Notice

**File:** `lib/guides/pages/income-tax-139-9-defective-return.ts`

- **Slug:** `income-tax-139-9-defective-return`
- **Title:** Income Tax 139(9) Defective Return Notice: How to Fix It
- **SEO Title:** Income Tax 139(9) Defective Return Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received a defective return notice under Section 139(9)? Your return has issues that need correction. Understand what went wrong and how to fix it within 15 days.
- **Category:** Income Tax Notice
- **Severity:** serious
- **Deadline:** 15 days from receipt of notice
- **Deadline Note:** If you do not respond within 15 days, your return is treated as invalid - as if you never filed.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. YOUR RETURN HAS BEEN MARKED AS DEFECTIVE**
A 139(9) notice means the CPC found technical defects in your filed return that make it incomplete or inconsistent. Common defects include:
- Using the wrong ITR form (e.g., ITR-1 when you should have used ITR-2)
- Missing schedules or annexures
- Arithmetic inconsistencies
- P&L/Balance Sheet not attached for business returns
- Incomplete bank account details
- Missing foreign asset disclosures when required

Note: Source: Section 139(9), Income Tax Act 1961.

**02. WHAT HAPPENS IF YOU DO NOT RESPOND**
If you fail to respond within 15 days:
- Your return is treated as invalid
- You are considered to have not filed a return for that year
- You lose the ability to carry forward losses
- Late filing fees and penalties may apply
- If you had claimed a refund, it will not be processed

**03. HOW TO RESPOND**
- Login to the e-filing portal
- Go to e-File > e-Proceedings > View Notices/Orders
- Click on "Submit Response" against the defective notice
- Fix the defect as specified in the notice
- Submit the corrected return or information

Note: You can request one extension of 15 days if you need more time. Submit the request before the original deadline expires.

**04. COMMON DEFECTS AND HOW TO FIX THEM**
- Wrong ITR form: File a revised return using the correct form
- Missing P&L/Balance Sheet: Upload the missing financial statements
- Bank account details incomplete: Provide complete IFSC and account number
- Arithmetic error: Correct the calculation in the relevant schedule
- Foreign asset not declared: File revised return with Schedule FA completed

### FAQs

**Q: I submitted the response but the portal still shows defective. What now?**
A: Processing takes 15-30 days. If the status does not update after 30 days, raise a grievance on the e-filing portal under Grievance > Submit Grievance.

**Q: Can I file a revised return instead of responding to the defective notice?**
A: Yes, but only if you are within the time limit for filing revised returns (before December 31 of the assessment year). If you are past that date, you must respond to the defective notice specifically.

---

## 15. Income Tax Section 156 Demand Notice

**File:** `lib/guides/pages/income-tax-156-demand.ts`

- **Slug:** `income-tax-156-demand`
- **Title:** Income Tax 156 Demand Notice: Tax Demand and How to Pay
- **SEO Title:** Income Tax 156 Demand Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received an Income Tax demand notice under Section 156? Understand why you owe tax, how to verify the demand, and your options for paying or disputing.
- **Category:** Income Tax Notice
- **Severity:** urgent
- **Deadline:** 30 days from receipt of notice
- **Deadline Note:** Unpaid demands attract interest at 1% per month. If you disagree, respond before paying - once paid, getting refunds is harder.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. WHAT IS A 156 DEMAND NOTICE**
A demand notice under Section 156 is issued when the Income Tax department has computed that you owe tax. This follows an assessment order (143(3), 144, 147, or other sections).

The notice specifies:
- The amount of tax payable
- Interest payable under Sections 234A/B/C
- Penalty if any
- Due date for payment (usually 30 days)

Note: Source: Section 156, Income Tax Act 1961.

**02. VERIFY BEFORE YOU PAY**
Before paying the demand:
- Check the assessment order that generated the demand
- Verify whether TDS credits have been correctly allowed
- Check if all deductions you claimed have been accepted
- Confirm the computation of interest is correct
- If there are obvious errors, file for rectification under Section 154

**03. OPTIONS FOR RESPONDING**
- Pay in full: If the demand is correct, pay through the e-filing portal
- Pay under protest: If you disagree but want to avoid interest, pay and file an appeal
- File rectification: If there are obvious errors in the computation
- File appeal: If you disagree with the additions made by the AO
- Request instalment or stay: If you cannot pay immediately

**04. IF YOU CANNOT PAY IMMEDIATELY**
- Request instalment payment: Write to the AO explaining your financial situation
- Request stay of demand pending appeal: If you have filed an appeal, request that recovery be stayed until the appeal is decided (you may need to pay 20% upfront)

**05. WHAT HAPPENS IF YOU DO NOT PAY**
- Interest: 1% per month on outstanding amount
- Attachment of bank account: The Tax Recovery Officer can attach your bank accounts
- Attachment of salary: Your employer can be directed to deduct from your salary
- Attachment of property: In extreme cases, property can be attached and sold

### FAQs

**Q: The demand is for Rs. 50 lakh but I only earn Rs. 10 lakh per year. This must be wrong.**
A: Large demands often result from AO additions during assessment. Check the assessment order. If additions were made incorrectly, file an appeal. You may need to pay 20% to get a stay on recovery during appeal.

**Q: I already paid my taxes when I filed. Why is there a demand?**
A: The demand may be for additional tax due to disallowed deductions, additions to income, or interest. Compare the assessment order with your filed return to understand what changed.

---

## 16. Income Tax Section 245 Refund Adjustment Notice

**File:** `lib/guides/pages/income-tax-245-refund-adjustment.ts`

- **Slug:** `income-tax-245-refund-adjustment`
- **Title:** Income Tax 245 Notice: Refund Adjusted Against Demand
- **SEO Title:** Income Tax 245 Refund Adjustment Notice: What to Do (2025) | Ollvy
- **SEO Description:** Your Income Tax refund is being adjusted against a pending demand under Section 245. Understand why, how to verify the demand, and how to respond within 30 days.
- **Category:** Income Tax Notice
- **Severity:** serious
- **Deadline:** 30 days from receipt of notice
- **Deadline Note:** If you do not respond, the adjustment will happen automatically. Verify the underlying demand before the deadline.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. WHAT IS HAPPENING**
A 245 notice means:
- You have a refund due (from a return you filed)
- You also have an outstanding tax demand (from a previous year or current processing)
- The department is proposing to adjust your refund against that demand

This is called "set off" - the department wants to use your refund to pay your outstanding dues.

Note: Source: Section 245, Income Tax Act 1961.

**02. VERIFY THE UNDERLYING DEMAND**
Before accepting or rejecting the adjustment:
- Check your outstanding demands on the e-filing portal (Pending Actions > Response to Outstanding Demand)
- Verify if the demand is legitimate
- Check if you have already paid it (sometimes old demands show as pending due to system errors)
- Check if the demand was reduced or deleted on appeal

**03. HOW TO RESPOND**
- If demand is correct: Accept the adjustment by responding "Yes" on the portal
- If demand is incorrect: Respond "No" and provide reasons (already paid, paid under appeal, rectification pending, demand is disputed)
- If partially correct: You can accept partial adjustment and dispute the rest

**04. TIME LIMIT**
You must respond within 30 days. If you do not respond, the adjustment is deemed accepted and will be processed automatically.

### FAQs

**Q: The demand being adjusted is very old and I do not have records. What do I do?**
A: Check Form 26AS for TDS credits for that year. Pull up old returns from the e-filing portal. If the demand is for an assessment that was appealed and won, submit proof of the appellate order.

**Q: Can I get my refund without the adjustment if I have filed an appeal against the demand?**
A: You can request this, but it is at the AO's discretion. Generally, if you have paid 20% of the disputed demand, you may request that the rest of the refund be released pending appeal.

---

## 17. Income Tax Section 271 Penalty Notice

**File:** `lib/guides/pages/income-tax-271-penalty.ts`

- **Slug:** `income-tax-271-penalty`
- **Title:** Income Tax 271 Penalty Notice: Concealment and Misreporting
- **SEO Title:** Income Tax 271/270A Penalty Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received a penalty notice under Section 271 or 270A for concealment or misreporting? Understand the penalty provisions, your defence options, and how to respond.
- **Category:** Income Tax Notice
- **Severity:** urgent
- **Deadline:** As specified in the notice (typically 15-30 days)
- **Deadline Note:** Penalty proceedings are separate from assessment. Even if you paid the tax, you must respond to avoid penalty.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. WHAT PENALTY PROCEEDINGS MEAN**
Penalty notices are issued when the AO believes you:
- Concealed income, or
- Furnished inaccurate particulars of income, or
- Under-reported or misreported income

The penalty regime changed in 2016. For assessment years before AY 2017-18, Section 271(1)(c) applies. For AY 2017-18 onwards, Section 270A applies.

Note: Source: Sections 270A, 271(1)(c), Income Tax Act 1961.

**02. PENALTY RATES**
Under Section 270A (current):
- Under-reporting: 50% of tax payable on under-reported income
- Misreporting: 200% of tax payable on misreported income

Under Section 271(1)(c) (old):
- 100% to 300% of tax sought to be evaded

**03. DEFENCES AVAILABLE**
Not all additions in assessment attract penalty. You can argue:
- Bona fide mistake: You made an honest error with no intention to conceal
- Disclosed all material facts: You provided complete information; the disallowance is due to difference of opinion
- Legal interpretation: You took a position based on a legitimate interpretation of law
- Additions are disputed: If the assessment additions are themselves being appealed
- Procedural defects: The penalty notice does not specify which limb (concealment vs inaccurate particulars)

Note: The Supreme Court in Dilip Shroff vs JCIT held that penalty is not automatic just because an addition is made. The AO must prove that there was concealment or furnishing of inaccurate particulars.

**04. HOW TO RESPOND**
- Request time if needed (before the deadline)
- Submit a detailed written reply addressing each point
- Cite relevant case law supporting no penalty
- If the underlying assessment is being appealed, request that penalty be kept in abeyance pending appeal
- Appear for the hearing with your CA

**05. IF PENALTY IS LEVIED**
You can appeal to CIT(Appeals) within 30 days of the penalty order. Penalty orders are often reversed or reduced at appellate stages.

### FAQs

**Q: The AO made additions and now wants penalty. Is penalty automatic?**
A: No. Penalty is not automatic. The AO must independently establish that there was concealment or furnishing of inaccurate particulars. Many penalty orders are deleted on appeal because the AO failed to discharge this burden.

**Q: I declared all my income but the AO disallowed a deduction. Can they impose penalty?**
A: Generally no. If you disclosed all facts and the disallowance is due to a legal interpretation, penalty should not apply. This is a strong defence - but you must argue it properly.

---

## 18. Income Tax Section 131 Summons

**File:** `lib/guides/pages/income-tax-131-summons.ts`

- **Slug:** `income-tax-131-summons`
- **Title:** Income Tax 131 Summons: Compulsory Attendance
- **SEO Title:** Income Tax 131 Summons: What to Do (2025) | Ollvy
- **SEO Description:** Received a summons under Section 131? You are legally required to appear before the Income Tax officer. Understand your obligations and how to prepare.
- **Category:** Income Tax Notice
- **Severity:** urgent
- **Deadline:** As specified in the summons (typically 7-15 days)
- **Deadline Note:** Ignoring a 131 summons is a prosecutable offence. You must appear or face serious consequences.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. WHAT IS A 131 SUMMONS**
A summons under Section 131 is a legal order requiring you to:
- Appear in person before the Income Tax officer, and/or
- Produce specific documents or evidence, and/or
- Give evidence on oath

Section 131 gives the Income Tax officer powers similar to a civil court for compelling attendance and document production.

Note: Source: Section 131, Income Tax Act 1961.

**02. WHY YOU MAY HAVE RECEIVED THIS**
- You are a witness in someone else's investigation
- Your transactions appeared in another taxpayer's records
- You are the subject of an investigation/survey/search
- The AO needs your testimony to complete an assessment

**03. YOUR OBLIGATIONS**
- You must appear at the time and place specified
- You must produce documents specified in the summons
- You may be examined on oath - false statements are perjury
- If you cannot appear on the specified date, request adjournment in writing before the date

**04. CONSEQUENCES OF NON-COMPLIANCE**
- Penalty under Section 272A: Up to Rs. 10,000
- Prosecution under Section 276D: Up to 1 year imprisonment
- Adverse inference: The AO can draw adverse conclusions from your non-appearance

**05. HOW TO PREPARE**
- Engage a CA or tax lawyer immediately
- Collect all documents mentioned in the summons
- Review your own tax filings for the relevant years
- Prepare honest answers - do not fabricate or mislead
- You can be accompanied by your authorised representative

### FAQs

**Q: Can I send my CA instead of appearing personally?**
A: If the summons specifically requires your personal attendance, you must appear. Your CA can accompany you but cannot appear in your place. If the summons allows representation, your CA can appear with a valid power of attorney.

**Q: I do not have the documents they are asking for. What do I do?**
A: Appear on the date and explain which documents you do not have and why. Submit whatever you do have. Do not submit fabricated documents - that is far worse than not having documents.

---

## 19. Income Tax AIS/SFT Mismatch Notice

**File:** `lib/guides/pages/income-tax-ais-sft-notice.ts`

- **Slug:** `income-tax-ais-sft-notice`
- **Title:** Income Tax AIS/SFT Mismatch: High Value Transaction Notice
- **SEO Title:** Income Tax AIS/SFT Mismatch Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received a notice about AIS/SFT high-value transaction mismatch? The department found transactions you may not have declared. Understand what to do next.
- **Category:** Income Tax Notice
- **Severity:** serious
- **Deadline:** As specified (typically 15-30 days)
- **Deadline Note:** AIS mismatches are the department's new data-driven approach. Ignoring these leads to scrutiny selection.
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Sections

**01. WHAT IS AIS AND SFT**
AIS (Annual Information Statement) contains information reported to the Income Tax department by third parties - banks, registrars, mutual funds, companies, etc.

SFT (Statement of Financial Transactions) is the reporting mechanism by which specified parties report high-value transactions (property purchases, mutual fund investments, FD interest, etc.).

If your ITR does not match the information in AIS/SFT, the department sends you a mismatch notice.

Note: Source: Section 285BA, Income Tax Act 1961; Rule 114E, Income Tax Rules.

**02. COMMON MISMATCHES**
- Property sale/purchase: SFT value differs from capital gains declared
- Bank interest: Interest in AIS not matching interest declared in return
- Mutual fund transactions: Capital gains from redemptions not declared
- Share transactions: Securities transaction tax data not matching reported gains
- High-value cash deposits: Bank deposits above Rs. 10 lakh flagged

**03. HOW TO RESPOND**
- Login to the e-filing portal
- Go to AIS > View your AIS
- Review each transaction
- For each mismatch, you can:
  - Accept: The information is correct
  - Provide feedback: The information is incorrect or partially correct (with explanation)
- If you need to revise your return based on AIS data, file a revised return (if within time limit)

**04. IF THE MISMATCH IS GENUINE**
If you genuinely forgot to declare income shown in AIS:
- File updated return under Section 139(8A) - available for 2 years from end of assessment year with 25-50% additional tax
- Or respond to the notice explaining and offering to pay additional tax with interest

**05. IF THE AIS DATA IS WRONG**
If the third-party reported incorrect information:
- Submit feedback on AIS portal explaining the error
- Contact the reporting entity (bank, registrar) to correct their records
- Keep evidence of your communication for future reference

### FAQs

**Q: I received AIS mismatch notice but I have already filed my return. What now?**
A: If your filed return is correct and the AIS data is wrong, respond with feedback explaining the discrepancy. If the AIS data is correct and you missed declaring something, consider filing an updated return or responding with an offer to pay additional tax.

**Q: The AIS shows a property sale that I already declared in my return. Why the mismatch?**
A: The mismatch may be due to:
- Difference between sale consideration and stamp duty value
- Different date of registration vs date of sale
- Indexation computation differences
Respond by explaining which figure you used and why.

---

# TDS Notices (3 Pages)

---

## 20. TDS Short Deduction Notice

**File:** `lib/guides/pages/tds-short-deduction-notice.ts`

- **Slug:** `tds-short-deduction-notice`
- **Title:** TDS Short Deduction Notice: What to Do
- **SEO Title:** TDS Short Deduction Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received a TDS short deduction notice? The department found you deducted less TDS than required. Understand why and how to resolve it.
- **Category:** TDS Notice
- **Severity:** serious
- **Deadline:** As specified in the notice (typically 15-30 days)
- **Deadline Note:** Short deduction demands include interest at 1% per month from the date TDS should have been deducted. Respond promptly.
- **CTA Service:** tds-return-filing
- **Related Tools:**
  - Penalty Calculators: tds-late-filing
  - Document Checklists: business-itr

### Sections

**01. WHAT IS A SHORT DEDUCTION NOTICE**
A short deduction notice is issued when the department determines that you deducted TDS at a rate lower than required, or did not deduct TDS when you should have.

Common triggers:
- Applied wrong TDS rate (e.g., 1% instead of 10%)
- Applied lower rate without valid certificate (Form 15G/15H or lower deduction certificate)
- Failed to deduct TDS on a payment that required deduction
- Deducted TDS but on a lower amount than the actual payment

Note: Source: Sections 201, 192-196, Income Tax Act 1961.

**02. CONSEQUENCES OF SHORT DEDUCTION**
- You must pay the shortfall amount
- Interest at 1% per month from the date TDS should have been deducted until the date of payment
- Penalty proceedings under Section 271C (up to 100% of TDS amount) in willful cases

**03. HOW TO VERIFY THE DEMAND**
- Check your TDS returns (Form 24Q, 26Q, 27Q) for the relevant quarter
- Verify the TDS rate you applied against the rate prescribed
- Check if you had valid documentation for lower rate (15G/H, Section 197 certificate)
- Verify the payment amounts against your books

**04. HOW TO RESPOND**
- If the demand is correct: Pay the shortfall with interest through Challan 281
- If you have valid lower deduction documentation: Submit copies of Form 15G/H or Section 197 certificate
- If there is a computational error: Request rectification
- File a corrected TDS return if the original filing had errors

**05. PREVENTING FUTURE ISSUES**
- Verify TDS rates before every payment
- Collect Form 15G/H before the first payment of the year
- Maintain a TDS compliance calendar
- Reconcile TDS deducted with returns filed quarterly

### FAQs

**Q: The deductee submitted PAN but I still got a short deduction notice. Why?**
A: Having PAN only determines the rate. If you applied a rate lower than what the section prescribes (e.g., 1% instead of 10%), it is still short deduction. Verify the correct rate for each payment type.

**Q: The deductee has already paid tax on this income in their return. Do I still need to pay the shortfall?**
A: Yes. Your liability as deductor is independent of whether the deductee paid tax. However, under certain circumstances, you can file for relief under Section 201(1) if you can prove the deductee has paid tax and filed return.

---

## 21. TDS 26Q/27Q Mismatch Notice

**File:** `lib/guides/pages/tds-26q-27q-mismatch.ts`

- **Slug:** `tds-26q-27q-mismatch`
- **Title:** TDS 26Q/27Q Mismatch: Return vs Challan Discrepancy
- **SEO Title:** TDS 26Q/27Q Mismatch Notice: How to Resolve (2025) | Ollvy
- **SEO Description:** Your TDS return and challan payments do not match. Understand why this happens and how to file corrections to resolve the mismatch.
- **Category:** TDS Notice
- **Severity:** serious
- **Deadline:** Resolve before next quarter filing or as specified in notice
- **Deadline Note:** Unresolved mismatches can result in demands, interest, and issues for your deductees' Form 26AS.
- **CTA Service:** tds-return-filing
- **Related Tools:**
  - Penalty Calculators: tds-late-filing
  - Document Checklists: business-itr

### Sections

**01. WHAT IS A 26Q/27Q MISMATCH**
A mismatch occurs when the TDS amount claimed in your return (Form 26Q for non-salary payments, 27Q for NRI payments) does not match the challans you deposited.

Common causes:
- Wrong challan quoted in the return
- Challan deposited but not quoted in return
- Challan quoted belongs to a different TAN
- Arithmetic errors in return or challan
- Previous quarter's challan used in current quarter

**02. HOW MISMATCHES AFFECT DEDUCTEES**
When there is a mismatch:
- Deductees' Form 26AS shows TDS as "unmatched" or does not show it at all
- Deductees cannot claim TDS credit in their return
- This creates complaints and queries from vendors and employees

**03. HOW TO IDENTIFY THE ISSUE**
- Download your TDS return from TRACES
- Download your challan statement from TRACES
- Compare the BSR code, challan serial number, challan date, and amount
- Identify which challan is mismatched and why

**04. HOW TO RESOLVE**
- File a correction return (C1, C2, or C3 correction depending on type)
- C1: Correct deductee details
- C2: Correct challan details or add new challan
- C3: Correct both deductee and challan
- Use the TRACES utility for filing corrections

**05. TIMELINE**
- Corrections can be filed anytime (no time limit for correction returns)
- However, resolve quickly to avoid deductee complaints and potential interest

### FAQs

**Q: I deposited the TDS but forgot to quote the challan in my return. What do I do?**
A: File a C2 correction return to add the challan. The challan must be in your TAN's name and for the correct assessment year.

**Q: The mismatch is because of a wrong BSR code. How do I fix it?**
A: Verify the correct BSR code from your bank's challan receipt. File a C2 correction with the correct BSR code. If the bank made an error, you may need to contact the bank for correction.

---

## 22. TDS 194C/194J Demand Notice

**File:** `lib/guides/pages/tds-194c-194j-demand.ts`

- **Slug:** `tds-194c-194j-demand`
- **Title:** TDS 194C/194J Demand: Contractor vs Professional Services
- **SEO Title:** TDS 194C vs 194J Demand Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received a TDS demand for wrong section under 194C/194J? Understand the difference between contractor and professional payments and how to resolve the notice.
- **Category:** TDS Notice
- **Severity:** serious
- **Deadline:** As specified in the notice (typically 15-30 days)
- **Deadline Note:** 194C vs 194J disputes are common. The rate difference (1-2% vs 10%) creates significant demand amounts.
- **CTA Service:** tds-return-filing
- **Related Tools:**
  - Penalty Calculators: tds-late-filing
  - Document Checklists: business-itr

### Sections

**01. WHY THIS DEMAND ARISES**
The department has determined that you deducted TDS under the wrong section:
- 194C (Contractors): 1% for individuals/HUF, 2% for others
- 194J (Professional/Technical services): 10% (or 2% for call centres and certain technical services)

The difference in rates means a wrong classification creates significant short deduction.

**02. THE KEY DISTINCTION**
Section 194C covers:
- Works contracts (supply + labour)
- Labour contracts
- Carriage and transport
- Catering
- Advertising (production work)

Section 194J covers:
- Professional services (legal, medical, architectural, engineering, accounting)
- Technical services (managerial, technical, consultancy)
- Royalty
- Non-compete fees

The grey area: Many services have elements of both. For example, is IT development a contract (194C) or technical service (194J)?

**03. HOW TO RESPOND**
- Review the nature of services provided
- Check invoices and contracts for how the service was described
- Cite relevant CBDT circulars and case law for your classification
- If your classification is correct, submit a detailed response with supporting documents
- If classification was wrong, pay the shortfall with interest

**04. KEY CASE LAW**
- CIT vs Bharti Cellular Ltd: Technical services require human element and application of mind
- ITO vs Computech International: Software development is 194J; maintenance may be 194C
- CBDT Circular 715: Guidelines for distinguishing technical and professional services

**05. GOING FORWARD**
- Review payment classifications annually
- Document the nature of services in contracts clearly
- When in doubt, deduct at the higher rate (194J) to be safe
- Get advance rulings for large or recurring payments if classification is uncertain

### FAQs

**Q: I paid for website development. Is it 194C or 194J?**
A: Website development involving creative and technical skill is generally 194J. Website hosting or maintenance (routine work) may be 194C. Check the nature of work in each invoice.

**Q: The vendor says they are a contractor, not a professional. Does that matter?**
A: What the vendor calls themselves does not determine the section. The nature of service provided determines the applicable section. A "contractor" providing technical consultancy is still covered under 194J.

---

# ROC Notices (2 Pages)

---

## 23. ROC Annual Filing Default Notice

**File:** `lib/guides/pages/roc-annual-filing-default-notice.ts`

- **Slug:** `roc-annual-filing-default-notice`
- **Title:** ROC Annual Filing Default Notice: What to Do
- **SEO Title:** ROC Annual Filing Default Notice: How to Respond (2025) | Ollvy
- **SEO Description:** Received an ROC notice for non-filing of annual returns? Understand the penalties, how to file overdue AOC-4 and MGT-7, and how to bring your company into compliance.
- **Category:** ROC Notice
- **Severity:** serious
- **Deadline:** File immediately - penalties accrue daily
- **Deadline Note:** ROC penalties for delayed filing are Rs. 100-200 per day per form. A few months' delay can mean lakhs in penalties.
- **CTA Service:** mca-annual-filing
- **Related Tools:**
  - Penalty Calculators: mca-annual-filing
  - Document Checklists: private-limited-company

### Sections

**01. WHAT IS AN ROC ANNUAL FILING DEFAULT**
Every company registered under the Companies Act, 2013 must file annual returns with the Registrar of Companies (ROC):
- AOC-4: Financial statements (balance sheet, P&L, notes) - due within 30 days of AGM
- MGT-7/MGT-7A: Annual return with shareholder and director details - due within 60 days of AGM
- AGM must be held within 6 months of financial year end

If you miss these deadlines, the ROC may issue a default notice.

Note: Source: Sections 92, 129, 137, Companies Act 2013.

**02. PENALTIES FOR DELAYED FILING**
- AOC-4: Rs. 100 per day of delay (for small companies) up to Rs. 200 per day (for other companies)
- MGT-7: Rs. 100 per day of delay (for small companies) up to Rs. 200 per day (for other companies)
- No maximum cap on penalties
- Directors may face personal penalties and disqualification

Example: A company that files both forms 1 year late faces approximately:
- Rs. 200 x 365 x 2 = Rs. 1,46,000 in additional fees (for a non-small company)

**03. DIRECTOR DISQUALIFICATION**
Under Section 164(2), directors of companies that have not filed annual returns for 3 continuous years become disqualified from being appointed as director in any company for 5 years.

This disqualification:
- Applies to all companies where the person is a director
- Is automatically imposed based on MCA records
- Can only be removed by filing the pending returns and applying for removal of disqualification

**04. HOW TO RESOLVE**
- Hold the AGM (if not already held) - you may need to apply for extension to ROC
- Prepare and audit financial statements for all pending years
- File AOC-4 and MGT-7 for each pending year with additional fees
- The MCA portal calculates additional fees automatically based on delay
- Consider filing a petition for compounding of offence if penalties are very high

**05. PREVENTING FUTURE DEFAULTS**
- Set calendar reminders for AGM and filing deadlines
- Engage a company secretary or CA for compliance tracking
- Even if the company is dormant or inactive, filings are still required
- Consider striking off the company if it will never operate

### FAQs

**Q: The company has not operated for years. Do we still need to file?**
A: Yes. As long as the company exists on MCA records, annual filings are required. If the company will never operate, consider applying for strike-off under Section 248.

**Q: I am a director in a company that defaulted. Am I personally liable?**
A: Directors can be held personally liable for penalties. More significantly, if defaults continue for 3 years, you can be disqualified as a director under Section 164(2), affecting all your directorships.

---

## 24. DIR-3 KYC DIN Deactivation Notice

**File:** `lib/guides/pages/dir-3-kyc-din-deactivation.ts`

- **Slug:** `dir-3-kyc-din-deactivation`
- **Title:** DIR-3 KYC Notice: Director DIN Deactivation
- **SEO Title:** DIR-3 KYC Not Filed: DIN Deactivation Notice 2025 | Ollvy
- **SEO Description:** Got a notice about DIN deactivation due to DIR-3 KYC non-filing? Understand how to reactivate your Director Identification Number and what you cannot do while deactivated.
- **Category:** ROC Notice
- **Severity:** serious
- **Deadline:** DIR-3 KYC must be filed annually by September 30
- **Deadline Note:** Once DIN is deactivated, you cannot sign any company documents, file any MCA forms, or appear as an active director on records - until it is restored.
- **CTA Service:** director-kyc
- **Related Tools:**
  - Penalty Calculators: mca-annual-filing, director-kyc
  - Document Checklists: private-limited-company

### Sections

**01. YOUR DIRECTOR IDENTIFICATION NUMBER HAS BEEN DEACTIVATED**
Every director of an Indian company holds a Director Identification Number (DIN) issued by MCA. To keep this DIN active, you must file DIR-3 KYC (Know Your Customer verification) every year by September 30.

If you missed the September 30 deadline, the MCA system automatically deactivates your DIN. You will receive an intimation about this. Your DIN status on the MCA portal will show as "Deactivated due to non-filing of DIR-3 KYC."

Note: Source: Rule 12A and 12B, Companies (Appointment and Qualification of Directors) Rules, 2014.

**02. WHAT HAPPENS WHEN YOUR DIN IS DEACTIVATED**
- You cannot be reflected as an active director in any MCA filing
- Any MCA form you sign as director will be rejected if your DIN shows as deactivated
- Annual returns (AOC-4, MGT-7) cannot be filed for your company if the sole director's DIN is deactivated - this creates a cascading annual filing default
- Board resolutions and other company documents that require your DIN will be problematic
- Banks doing director due diligence will see the deactivated DIN as a compliance flag

**03. HOW TO REACTIVATE YOUR DIN**
Reactivation requires filing DIR-3 KYC with a late fee.
- Late filing fee: Rs. 5,000 if filed after September 30 but before the filing opens again (typically October onwards, with fee). The fee is fixed regardless of how many days late.
- Documents needed for DIR-3 KYC: PAN, Aadhaar, current address proof, mobile number OTP verification, email OTP verification. If filed by a CA/CS, their digital signature is also needed.
- File on the MCA portal: Log in to mca.gov.in, go to the DIR-3 KYC service, complete the form with verified documents, and pay the fee.
- Processing time: DIN reactivation is typically immediate or within 24 hours of successful DIR-3 KYC filing with fee.
- Annual commitment: Once reactivated, file DIR-3 KYC every year before September 30 to avoid this happening again. It takes about 10 minutes.

**04. DIR-3 KYC-WEB VS DIR-3 KYC: WHICH DO YOU FILE**
There are two variants:
- DIR-3 KYC (eForm): Full KYC for first-time filing or when your details have changed (new PAN, new address, new mobile number, etc.). Requires digital signature of a professional (CA/CS).
- DIR-3 KYC-Web: Annual renewal for directors whose details have not changed. A simpler web-based form requiring only OTP verification on the registered mobile and email. No professional signature needed.
- Most directors do DIR-3 KYC-Web for annual renewal unless there is a change in personal details. First-time KYC (when DIN was newly issued) requires the full eForm.

### FAQs

**Q: I have 3 DINs from different periods. Do I need to file DIR-3 KYC for all of them?**
A: Having more than one DIN is actually an offence under the Companies Act. If you have multiple DINs, you must surrender the additional ones and retain only one. Once surrendered, you only file KYC for the retained DIN.

**Q: I stopped being a director 2 years ago. Do I still need to file DIR-3 KYC?**
A: If you have resigned from all directorial positions and are no longer a director in any company, you can request surrender of your DIN. Post-surrender, no KYC filings are needed. However, as long as your DIN is active (even if you are no longer a director), the annual KYC requirement continues.

**Q: My DIN was deactivated and now the company cannot file its annual returns. Who is responsible?**
A: As the director whose DIN is deactivated, you are responsible for filing DIR-3 KYC to restore it. The company's filing obligations remain unchanged regardless of DIN status - so the company is also accumulating annual filing defaults while this is unresolved. Restore the DIN and then file all company returns together.

---

*End of Notice Pages Content*
