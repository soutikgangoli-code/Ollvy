// lib/guides/pages/income-tax-143-1-intimation.ts
import { LearnPageConfig } from '../pages';

export const incomeTax1431Intimation: LearnPageConfig = {
  slug: 'income-tax-143-1-intimation',
  title: 'Income Tax Section 143(1) Intimation: What It Means',
  seoTitle: 'Income Tax 143(1) Intimation Notice 2025: What to Do | Ollvy',
  seoDescription: 'Got an Income Tax 143(1) intimation? It is not always a demand - but sometimes it is. Understand what the CPC is telling you and how to respond correctly.',
  canonicalUrl: 'https://www.ollvy.com/guides/income-tax-143-1-intimation',
  lastReviewed: 'March 2025',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'itr-notice-response',
  ctaSecondarySlug: 'itr-rectification',
  relatedServiceSlugs: ['itr-notice-response', 'itr-rectification', 'itr-filing'],
  relatedLearnSlugs: ['income-tax-143-2-scrutiny', 'income-tax-148-148a-reopening', 'income-tax-245-refund-adjustment'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },
  severity: 'serious',
  deadline: '30 days to pay demand (if a demand is raised)',
  deadlineNote: 'If the intimation shows an amount payable, you have 30 days to pay before interest starts accumulating.',

  sections: [
    {
      number: '01',
      heading: 'THIS IS THE MOST COMMON INCOME TAX COMMUNICATION - HERE IS WHAT IT MEANS',
      body: "Almost everyone who files an ITR gets a Section 143(1) intimation eventually. It is generated automatically by the Centralised Processing Centre (CPC) in Bengaluru after your return is processed - not by a human tax officer looking at your specific case.\n\nThe intimation is the CPC's way of telling you: \"We processed your return. Here is what we computed. Here is where it differs from what you filed.\"\n\nThree things can happen in a 143(1) intimation:",
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
      body: "The most frequent reason people get a demand in 143(1) is a TDS mismatch. Here is how it typically plays out:\n\nYou claimed Rs. 25,000 as TDS deducted in your ITR. But Form 26AS or AIS shows only Rs. 18,000 credited against your PAN. The CPC raises a demand for the Rs. 7,000 difference.\n\nThis is often not your fault at all. The deductor (your employer, your client, your bank) may have filed their TDS return incorrectly, missed a quarter, or entered your PAN wrongly. But the demand still lands in your mailbox.\n\nWhat to do:",
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
      a: "No action required. This just means the CPC agrees with your filed return. You can download this intimation and keep it for your records. It is essentially a clean bill of health for that year's return.",
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
};
