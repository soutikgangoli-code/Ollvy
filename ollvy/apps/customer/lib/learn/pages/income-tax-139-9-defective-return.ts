// lib/learn/pages/income-tax-139-9-defective-return.ts
import { LearnPageConfig } from '../pages';

export const incomeTax1399DefectiveReturn: LearnPageConfig = {
  slug: 'income-tax-139-9-defective-return',
  title: 'Income Tax Section 139(9) Notice: Defective Return',
  seoTitle: 'Income Tax 139(9) Defective Return Notice 2025: How to Fix It | Ollvy',
  seoDescription: 'Got an Income Tax Section 139(9) notice saying your return is defective? Understand exactly what is wrong and how to fix it within 15 days before your ITR becomes invalid.',
  canonicalUrl: 'https://www.ollvy.com/learn/income-tax-139-9-defective-return',
  lastReviewed: 'March 2025',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'itr-filing',
  relatedServiceSlugs: ['itr-filing', 'itr-notice-response'],
  relatedLearnSlugs: ['income-tax-143-1-intimation', 'income-tax-142-1-notice', 'income-tax-143-2-scrutiny'],
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
        "Income computed incorrectly: The department's algorithm detected that the income computation does not follow the prescribed format for that ITR form.",
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
};
