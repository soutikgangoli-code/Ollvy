// lib/guides/pages/gst-reg-17-cancellation-notice.ts
import { LearnPageConfig } from '../pages';

export const gstReg17CancellationNotice: LearnPageConfig = {
  slug: 'gst-reg-17-cancellation-notice',
  title: 'GST REG-17 Notice: Your GST Registration May Be Cancelled',
  seoTitle: 'GST REG-17 Cancellation Notice: How to Respond (2025) | Ollvy',
  seoDescription: 'Got a GST REG-17 show cause notice for cancellation? You have 7 days to respond or lose your GSTIN. Understand why it was issued and how to save your registration.',
  canonicalUrl: 'https://www.ollvy.com/guides/gst-reg-17-cancellation-notice',
  lastReviewed: 'March 2025',
  category: 'GST Notice',
  ctaServiceSlug: 'gst-revocation',
  ctaSecondarySlug: 'gst-monthly-filing',
  relatedServiceSlugs: ['gst-revocation', 'gst-monthly-filing'],
  relatedLearnSlugs: ['gst-reg-31-suspension', 'gst-drc-01-notice', 'gst-asmt-10-notice'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing'],
    documentChecklists: ['gst-registration'],
  },
  severity: 'urgent',
  deadline: '7 working days from date of notice',
  deadlineNote: 'This is the shortest deadline in the GST compliance calendar. Seven working days is not much time. Start today.',

  sections: [
    {
      number: '01',
      heading: 'YOUR GST REGISTRATION IS AT RISK. HERE IS WHAT IS HAPPENING.',
      body: "REG-17 is a Show Cause Notice (SCN) for cancellation of your GST registration. It means the GST officer has grounds to believe your registration should be cancelled - and they are giving you one chance to explain why it should not be.\n\nYou have 7 working days to file your reply in Form REG-18 on the GST portal.\n\nIf you do not reply, the officer will issue REG-19 (cancellation order). Once your GSTIN is cancelled, you cannot charge GST on your invoices, you cannot claim Input Tax Credit, and your clients who are GST-registered businesses will face ITC rejection on your past invoices. The downstream damage is serious.",
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
};
