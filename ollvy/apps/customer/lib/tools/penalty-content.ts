// lib/tools/penalty-content.ts
// FY 2024-25 / AY 2025-26 | Generated for Ollvy.com

export interface PenaltyPageContent {
  slug: string
  intro: {
    title: string
    description: string
    keyInfo: { label: string; value: string }[]
  }
  howToCalculate: {
    title: string
    steps: {
      step: number
      title: string
      description: string
      formula?: string
    }[]
    example: {
      scenario: string
      calculation: string
      result: string
    }
  }
  penaltyBreakdown: {
    title: string
    categories: {
      name: string
      rate: string
      cap: string
      notes?: string
    }[]
  }
  financialImpact: {
    title: string
    scenarios: {
      delay: string
      penalty: string
      interest: string
      total: string
    }[]
    worstCase: {
      description: string
      amount: string
    }
  }
  deadlines: {
    title: string
    dates: {
      form: string
      dueDate: string
      frequency: string
    }[]
  }
  legalReferences: {
    sections: {
      section: string
      description: string
    }[]
    notifications?: {
      number: string
      summary: string
    }[]
  }
  howToAvoid: { title: string; description: string }[]
  additionalFaqs: { question: string; answer: string }[]
  relatedPenalties: { title: string; slug: string; description: string }[]
}

// ─────────────────────────────────────────────
// 1. GST LATE FILING
// ─────────────────────────────────────────────
export const gstLateFilingContent: PenaltyPageContent = {
  slug: 'gst-late-filing',
  intro: {
    title: 'GST Late Filing Penalty Calculator 2024-25 (GSTR-1, GSTR-3B, GSTR-9)',
    description: `Miss your GST filing deadline and you'll owe a late fee for every day until you file. Under Section 47 of the CGST Act, the fee starts the day after the due date - so the sooner you file, the less you pay.

Good news: the late fee structure was rationalised in 2023 with turnover-based caps. For nil returns, the maximum is Rs. 500 per return. For other taxpayers, caps range from Rs. 2,000 to Rs. 10,000 depending on your annual turnover. One catch - you must pay the late fee in cash from your Electronic Cash Ledger. You can't use input tax credit to cover it.`,
    keyInfo: [
      { label: 'Governing section', value: 'Section 47, CGST Act 2017' },
      { label: 'Late fee - nil return', value: 'Rs. 20/day (Rs. 10 CGST + Rs. 10 SGST), capped at Rs. 500' },
      { label: 'Late fee - turnover up to Rs. 1.5 crore', value: 'Rs. 50/day, capped at Rs. 2,000' },
      { label: 'Late fee - turnover Rs. 1.5 crore to Rs. 5 crore', value: 'Rs. 50/day, capped at Rs. 5,000' },
      { label: 'Late fee - turnover above Rs. 5 crore', value: 'Rs. 100/day (Rs. 50 CGST + Rs. 50 SGST), capped at Rs. 10,000' },
      { label: 'Interest on unpaid tax', value: '18% per annum on net tax payable (cash component only, not ITC)' },
      { label: 'Payment method', value: 'Cash only - cannot use ITC balance' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate GST Late Filing Penalty',
    steps: [
      {
        step: 1,
        title: 'Find your return type and due date',
        description: 'Check the due date for your specific return (GSTR-1, GSTR-3B, GSTR-9). For large taxpayers, GSTR-3B is due on the 20th of the following month. GSTR-1 monthly is due on the 11th.',
      },
      {
        step: 2,
        title: 'Count your days of delay',
        description: 'Count every calendar day from the day after the due date up to and including the day you actually file.',
        formula: 'Days of delay = Filing date - Due date',
      },
      {
        step: 3,
        title: 'Find your per-day rate',
        description: 'Check whether your return has nil tax liability or a positive liability, then look up your turnover bracket to get the per-day rate (Rs. 20, Rs. 50, or Rs. 100 per day).',
      },
      {
        step: 4,
        title: 'Calculate gross late fee before the cap',
        description: 'Multiply your per-day rate by the number of days you\'re late. This gives you the uncapped late fee.',
        formula: 'Gross late fee = Per-day rate x Days of delay',
      },
      {
        step: 5,
        title: 'Apply your turnover-based cap',
        description: 'Compare your gross late fee against your applicable cap (Rs. 500, Rs. 2,000, Rs. 5,000, or Rs. 10,000). You pay whichever is lower. Separately, add 18% per annum interest on any unpaid cash tax for the same period.',
        formula: 'Late fee payable = MIN(Gross late fee, Applicable cap)',
      },
    ],
    example: {
      scenario: 'A business with Rs. 2 crore annual turnover files GSTR-3B for July 2024 (due 20 August 2024) on 25 September 2024. Cash tax payable is Rs. 50,000.',
      calculation: 'Days late: 36 days (21 Aug to 25 Sep). Per-day rate: Rs. 50/day (turnover Rs. 1.5-5 crore). Gross late fee: 36 x Rs. 50 = Rs. 1,800. Cap for this bracket: Rs. 5,000. Late fee payable: Rs. 1,800 (below cap). Interest: Rs. 50,000 x 18% x 36/365 = Rs. 887.',
      result: 'Total extra cost: Rs. 1,800 (late fee) + Rs. 887 (interest) = Rs. 2,687',
    },
  },
  penaltyBreakdown: {
    title: 'GST Late Filing Penalty Rates 2024-25',
    categories: [
      {
        name: 'Nil return - any turnover',
        rate: 'Rs. 20 per day (Rs. 10 CGST + Rs. 10 SGST)',
        cap: 'Rs. 500 per return',
        notes: 'Applies when you have zero tax liability for the period',
      },
      {
        name: 'Non-nil return - turnover up to Rs. 1.5 crore',
        rate: 'Rs. 50 per day (Rs. 25 CGST + Rs. 25 SGST)',
        cap: 'Rs. 2,000 per return',
        notes: 'Cap introduced via Finance Act 2023',
      },
      {
        name: 'Non-nil return - turnover Rs. 1.5 crore to Rs. 5 crore',
        rate: 'Rs. 50 per day',
        cap: 'Rs. 5,000 per return',
      },
      {
        name: 'Non-nil return - turnover above Rs. 5 crore',
        rate: 'Rs. 100 per day (Rs. 50 CGST + Rs. 50 SGST)',
        cap: 'Rs. 10,000 per return',
        notes: 'Previously had no cap',
      },
      {
        name: 'GSTR-9 annual return',
        rate: 'Rs. 200 per day (Rs. 100 CGST + Rs. 100 SGST)',
        cap: '0.25% of annual turnover in the state',
        notes: 'Higher per-day rate for annual returns',
      },
      {
        name: 'Interest on unpaid cash tax',
        rate: '18% per annum',
        cap: 'No cap - charged on actual unpaid tax',
        notes: 'Calculated on net tax payable in cash, not on ITC portion',
      },
    ],
  },
  financialImpact: {
    title: 'How Much Will Late GST Filing Cost You?',
    scenarios: [
      {
        delay: '15 days late',
        penalty: 'Rs. 750 (turnover above Rs. 5 crore) | Rs. 375 (smaller taxpayers)',
        interest: 'Rs. 370 on Rs. 50,000 unpaid tax',
        total: 'Rs. 1,120 - Rs. 1,370 depending on turnover',
      },
      {
        delay: '30 days late',
        penalty: 'Rs. 1,500 (large) | Rs. 750 (mid) | Rs. 600 (small)',
        interest: 'Rs. 740 on Rs. 50,000 unpaid tax at 18% p.a.',
        total: 'Rs. 1,340 - Rs. 2,240 depending on bracket',
      },
      {
        delay: '60 days late',
        penalty: 'Cap reached for all brackets (Rs. 2,000 / Rs. 5,000 / Rs. 10,000)',
        interest: 'Rs. 1,479 on Rs. 50,000 unpaid tax at 18% p.a.',
        total: 'Rs. 3,479 - Rs. 11,479 depending on turnover',
      },
      {
        delay: '90+ days late',
        penalty: 'Cap already reached - same as 60 days',
        interest: 'Rs. 2,219+ on Rs. 50,000 unpaid tax (grows daily)',
        total: 'Rs. 4,219+ - interest becomes the main cost after 60 days',
      },
    ],
    worstCase: {
      description: 'A large taxpayer (above Rs. 5 crore turnover) filing multiple quarters late with significant cash tax liability. The late fee cap hits Rs. 10,000 per return, but 18% interest on unpaid tax has no cap and keeps growing.',
      amount: 'Rs. 10,000 late fee per return + 18% p.a. interest on unpaid tax with no ceiling',
    },
  },
  deadlines: {
    title: 'GST Return Due Dates 2024-25',
    dates: [
      { form: 'GSTR-1 (monthly filers, turnover above Rs. 5 crore)', dueDate: '11th of following month', frequency: 'Monthly' },
      { form: 'GSTR-1 (QRMP scheme, turnover up to Rs. 5 crore)', dueDate: '13th of month after quarter end', frequency: 'Quarterly' },
      { form: 'GSTR-3B (large taxpayers - turnover above Rs. 5 crore)', dueDate: '20th of following month', frequency: 'Monthly' },
      { form: 'GSTR-3B (QRMP Category X states)', dueDate: '22nd of month after quarter end', frequency: 'Quarterly' },
      { form: 'GSTR-3B (QRMP Category Y states)', dueDate: '24th of month after quarter end', frequency: 'Quarterly' },
      { form: 'GSTR-9 (Annual Return)', dueDate: '31 December of following financial year', frequency: 'Annual' },
      { form: 'GSTR-4 (Composition Scheme Annual)', dueDate: '30 April of following financial year', frequency: 'Annual' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Section 47, CGST Act 2017', description: 'Late fee for delayed GST return filing' },
      { section: 'Section 50, CGST Act 2017', description: 'Interest on delayed payment of tax at 18% per annum' },
      { section: 'Rule 68, CGST Rules 2017', description: 'Notice to return defaulters (GSTIN suspension trigger)' },
    ],
    notifications: [
      { number: 'Notification 07/2023-CT dated 31 March 2023', summary: 'Amnesty scheme - waived late fees for GSTR-4, GSTR-9, GSTR-10 for periods up to FY 2021-22 if filed by 30 June 2023' },
      { number: 'Notification 19/2021-CT dated 1 June 2021', summary: 'Introduced turnover-based caps on GSTR-3B late fees (Rs. 2,000 / Rs. 5,000 / Rs. 10,000)' },
      { number: 'Finance Act 2023', summary: 'Extended turnover-based caps to GSTR-1 late fees' },
    ],
  },
  howToAvoid: [
    {
      title: 'Set reminders 7 days before each due date',
      description: 'GST due dates vary by return type and taxpayer category. Use a compliance calendar with phone and email alerts set 7 days and 1 day before each deadline. The GSTN does send SMS alerts, but they often arrive too close to the deadline to be useful.',
    },
    {
      title: 'Reconcile GSTR-2B with purchase records by the 16th',
      description: 'The most common reason for last-minute delays? Unresolved ITC mismatches. GSTR-2B is available by the 14th. Reconcile within 2 days and follow up with vendors whose invoices are missing so your GSTR-3B is ready by the 18th - 2 days before the deadline.',
    },
    {
      title: 'Consider the QRMP scheme if turnover is below Rs. 5 crore',
      description: 'The Quarterly Return Monthly Payment scheme cuts your filings from 24 per year to 8 (4 GSTR-1 + 4 GSTR-3B), while you pay tax monthly via a fixed-sum method. Fewer filing events means fewer chances to miss a deadline.',
    },
    {
      title: 'Don\'t wait for perfect numbers before starting',
      description: 'File the return with your known figures and amend via GSTR-1A or the next period\'s GSTR-1 if needed. A timely return with minor corrections beats a perfectly accurate return filed 5 days late.',
    },
    {
      title: 'Outsource to a CA or compliance firm',
      description: 'At Rs. 500-1,500 per month, professional GST filing costs less per year than a single month of maximum late fees for a large taxpayer. You also get someone else tracking deadlines and taking responsibility.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Can GST late fees be waived or reduced?',
      answer: 'You can\'t waive the standard late fee on your own. The GST Council occasionally announces amnesty schemes that reduce or waive accumulated late fees for specific periods. The most recent one in 2023 (Notification 07/2023-CT) covered GSTR-4, GSTR-9, and GSTR-10 for periods up to FY 2021-22. There\'s no guarantee of future amnesty schemes - filing on time is the only reliable way to avoid fees.',
    },
    {
      question: 'What happens if I don\'t pay the GST late fee?',
      answer: 'The GST portal won\'t accept your return until the late fee is paid in full from your Electronic Cash Ledger. You can\'t file with unpaid late fees pending. If you don\'t file for multiple months, your GSTIN may be suspended under Rule 68 - blocking your ability to generate e-invoices, e-way bills, and tax invoices.',
    },
    {
      question: 'Is interest charged on top of the GST late fee?',
      answer: 'Yes, they\'re separate charges. The late fee under Section 47 covers the filing delay. Interest under Section 50 at 18% per annum applies to any net tax you didn\'t pay in cash by the due date. If you had enough ITC to cover the liability, no interest applies on that portion. Interest has no cap - unlike the late fee.',
    },
    {
      question: 'How do I file a GST return after the deadline?',
      answer: 'Log in to gst.gov.in, navigate to Returns, and open the relevant period\'s return. The system automatically calculates the late fee based on how many days you\'re late. Pay the computed late fee from your Electronic Cash Ledger, then submit. There\'s no separate late filing application - it\'s all handled within the normal return flow.',
    },
    {
      question: 'How do I check if I have pending GST penalties online?',
      answer: 'Log in to the GST portal at gst.gov.in, go to Services > Ledgers > Electronic Liability Register. This shows all outstanding demands, penalties, and interest. You can also check the Cash Ledger and Credit Ledger for any negative balances.',
    },
    {
      question: 'Can I pay GST late filing penalties in installments?',
      answer: 'No, GST late fees must be paid in full before you can file your return. The portal blocks return filing until all late fees are cleared. However, for large demand notices (DRC-01), you can request payment in installments under Section 80.',
    },
    {
      question: 'If I have multiple overdue GST returns, should I file them in order?',
      answer: 'Yes, GST returns must be filed in chronological order. You cannot file GSTR-3B for March if January and February are pending. Each return calculates late fees based on its due date, so file oldest returns first.',
    },
    {
      question: 'Does GST late filing affect my compliance rating?',
      answer: 'Yes. GSTN calculates a compliance rating based on timely filing, tax payment, and other factors. Poor compliance rating can affect your Input Tax Credit availability and may trigger scrutiny from GST officers.',
    },
    {
      question: 'Are there any GST amnesty schemes for late filing penalties?',
      answer: 'The government occasionally announces amnesty schemes that waive or reduce late fees for specific periods. The most recent was in 2023. Check the CBIC website for current schemes. Filing under an amnesty scheme still requires paying the full tax and interest, but late fees may be waived.',
    },
    {
      question: 'What if my GSTIN is suspended for non-filing - can I still pay late fees?',
      answer: 'Yes, but you must first file all pending returns with late fees to lift the suspension. If cancelled by officer, you need to apply for revocation (REG-21) within 90 days. Penalties during suspension period still apply.',
    },
  ],
  relatedPenalties: [
    { title: 'GST Demand Notice Penalty', slug: 'gst-demand-notice', description: 'Section 73 and 74 penalties for unpaid or short-paid GST found during audit or scrutiny.' },
    { title: 'ITR Late Filing Penalty', slug: 'itr-late-filing', description: 'Section 234F fees for missing income tax return due dates.' },
    { title: 'TDS Late Filing Penalty', slug: 'tds-late-filing', description: 'Section 234E and 271H charges for delayed quarterly TDS returns.' },
  ],
}

// ─────────────────────────────────────────────
// 2. ITR LATE FILING
// ─────────────────────────────────────────────
export const itrLateFilingContent: PenaltyPageContent = {
  slug: 'itr-late-filing',
  intro: {
    title: 'ITR Late Filing Penalty Calculator 2024-25 (Section 234F)',
    description: `Miss your income tax return due date and you'll face a mandatory late filing fee under Section 234F. For FY 2024-25 (AY 2025-26), salaried individuals must file by 31 July 2025. File after that date but before 31 December 2025, and you'll pay Rs. 5,000 (or Rs. 1,000 if your total income doesn't exceed Rs. 5 lakhs).

Beyond the flat fee, late filing can also trigger interest on unpaid tax under Section 234A (1% per month), advance tax interest under Sections 234B and 234C, and - importantly - you lose the right to carry forward certain losses. You can file a belated return under Section 139(4) up to 31 December 2025. After that, your only option is an Updated Return (ITR-U) under Section 139(8A), which carries an additional tax surcharge.`,
    keyInfo: [
      { label: 'Late fee - income above Rs. 5 lakhs (Section 234F)', value: 'Rs. 5,000 flat' },
      { label: 'Late fee - income up to Rs. 5 lakhs (Section 234F)', value: 'Rs. 1,000 flat' },
      { label: 'Late fee - income below exemption limit', value: 'Nil (no fee if total income is below the basic exemption limit)' },
      { label: 'Interest on unpaid tax (Section 234A)', value: '1% per month or part month from due date to filing date' },
      { label: 'Belated return deadline (AY 2025-26)', value: '31 December 2025' },
      { label: 'Updated return (ITR-U) deadline', value: '31 March 2028 (2 years from end of AY 2025-26)' },
      { label: 'Additional tax on ITR-U - within 12 months', value: '25% of aggregate of tax and interest due' },
      { label: 'Additional tax on ITR-U - after 12 months', value: '50% of aggregate of tax and interest due' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate ITR Late Filing Penalty',
    steps: [
      {
        step: 1,
        title: 'Check if your income exceeds the exemption limit',
        description: 'If your total income is below the basic exemption limit (Rs. 3 lakhs under the new regime, Rs. 2.5 lakhs under the old regime for those below 60), Section 234F doesn\'t apply - no late fee even if you file late.',
      },
      {
        step: 2,
        title: 'Determine your flat fee under Section 234F',
        description: 'If your income exceeds the exemption limit but not Rs. 5 lakhs, the fee is Rs. 1,000. If your income exceeds Rs. 5 lakhs, the fee is Rs. 5,000 - regardless of how much you earn.',
        formula: 'Late fee = Rs. 5,000 (if income > Rs. 5 lakhs) OR Rs. 1,000 (if exemption limit < income <= Rs. 5 lakhs)',
      },
      {
        step: 3,
        title: 'Calculate interest under Section 234A if you owe tax',
        description: 'If you had tax payable (after TDS and advance tax credits) that wasn\'t paid by the original due date, you\'ll pay 1% per month (or part month) on that amount.',
        formula: 'Section 234A interest = Unpaid tax x 1% x number of months (or part months) of delay',
      },
      {
        step: 4,
        title: 'Check for advance tax interest under 234B and 234C',
        description: 'If you owed Rs. 10,000 or more in tax and didn\'t pay advance tax in quarterly instalments, additional interest applies under Section 234B (from April 1 to filing date) and Section 234C (for each quarter you fell short).',
        formula: 'Section 234B interest = Assessed tax x 1% x months from April 1 to date of payment',
      },
      {
        step: 5,
        title: 'Add everything up and pay before filing',
        description: 'The Section 234F fee and any interest under 234A, 234B, 234C must all be paid via Challan 280 as Self Assessment Tax before you file your belated return. Enter the challan details in your return before submission.',
        formula: 'Total extra cost = Section 234F fee + Section 234A interest + Section 234B/234C interest',
      },
    ],
    example: {
      scenario: 'A salaried individual with Rs. 8 lakhs total income files ITR for AY 2025-26 on 30 September 2025 (due date was 31 July 2025). TDS was fully deducted - no tax remains unpaid.',
      calculation: 'Section 234F: Income > Rs. 5 lakhs so flat fee = Rs. 5,000. Section 234A: No unpaid tax, so interest = Rs. 0. Section 234B/234C: No advance tax liability since TDS covered everything. Total = Rs. 5,000.',
      result: 'Total extra cost: Rs. 5,000 (flat late filing fee only). No interest since TDS was already deducted by the employer.',
    },
  },
  penaltyBreakdown: {
    title: 'ITR Late Filing Penalty Rates AY 2025-26',
    categories: [
      {
        name: 'Section 234F - income above Rs. 5 lakhs',
        rate: 'Rs. 5,000 flat',
        cap: 'Rs. 5,000 (flat fee, doesn\'t increase with further delay)',
        notes: 'Mandatory - cannot be waived. Pay before filing.',
      },
      {
        name: 'Section 234F - income up to Rs. 5 lakhs',
        rate: 'Rs. 1,000 flat',
        cap: 'Rs. 1,000 (flat, not per-day)',
        notes: 'Applies even if just one day late past 31 July',
      },
      {
        name: 'Section 234A - interest on unpaid tax',
        rate: '1% per month or part month',
        cap: 'No cap - grows with delay',
        notes: 'Only applies if tax wasn\'t fully paid by the original due date',
      },
      {
        name: 'Section 234B - advance tax default',
        rate: '1% per month from 1 April to date of payment',
        cap: 'No cap',
        notes: 'Applies if advance tax paid was less than 90% of assessed tax',
      },
      {
        name: 'Section 234C - advance tax instalment shortfall',
        rate: '1% per month per instalment shortfall',
        cap: 'No cap',
        notes: 'Calculated separately for each quarterly instalment that was short',
      },
      {
        name: 'Updated Return (ITR-U) additional tax',
        rate: '25% (within 12 months of AY end) or 50% (after 12 months) on tax + interest',
        cap: 'No cap - based on total outstanding tax and interest',
        notes: 'ITR-U cannot be used to claim a refund - only for additional tax payment',
      },
    ],
  },
  financialImpact: {
    title: 'How Much Will Late ITR Filing Cost You?',
    scenarios: [
      {
        delay: '15 days late (file by 15 August)',
        penalty: 'Rs. 5,000 (Section 234F, if income > Rs. 5 lakhs)',
        interest: 'Rs. 0 if TDS fully covered tax liability',
        total: 'Rs. 5,000 flat - same as filing 3 months late (fee doesn\'t increase)',
      },
      {
        delay: '30 days late (file by 31 August)',
        penalty: 'Rs. 5,000 (Section 234F)',
        interest: 'Rs. 1,000 on Rs. 1 lakh unpaid tax (1% x 1 month x Rs. 1 lakh)',
        total: 'Rs. 6,000 if Rs. 1 lakh was unpaid at due date',
      },
      {
        delay: '60 days late (file by 30 September)',
        penalty: 'Rs. 5,000 (Section 234F)',
        interest: 'Rs. 2,000 on Rs. 1 lakh unpaid tax (1% x 2 months)',
        total: 'Rs. 7,000 - interest grows monthly',
      },
      {
        delay: '90+ days late (file by 31 October or later)',
        penalty: 'Rs. 5,000 (Section 234F - unchanged)',
        interest: 'Rs. 3,000+ on Rs. 1 lakh unpaid tax (1% x 3+ months)',
        total: 'Rs. 8,000+ - after 31 December, ITR-U surcharge applies (25-50% of tax + interest)',
      },
    ],
    worstCase: {
      description: 'High-income individual with significant unpaid tax who files after 31 December using ITR-U. The ITR-U surcharge of 50% on aggregate tax and interest makes this the most expensive outcome.',
      amount: 'Rs. 5,000 (Section 234F) + 12 months of interest at 1% per month + 50% ITR-U surcharge on total outstanding',
    },
  },
  deadlines: {
    title: 'Income Tax Return Due Dates AY 2025-26',
    dates: [
      { form: 'ITR - individuals, HUF (non-audit)', dueDate: '31 July 2025', frequency: 'Annual' },
      { form: 'ITR - businesses requiring tax audit (Section 44AB)', dueDate: '31 October 2025', frequency: 'Annual' },
      { form: 'ITR - international transactions (Section 92E transfer pricing)', dueDate: '30 November 2025', frequency: 'Annual' },
      { form: 'Belated return (Section 139(4))', dueDate: '31 December 2025', frequency: 'Annual - last chance for belated filing' },
      { form: 'Revised return (Section 139(5))', dueDate: '31 December 2025', frequency: 'Can be filed after original or belated return' },
      { form: 'Updated return ITR-U (Section 139(8A))', dueDate: '31 March 2028', frequency: '2 years from end of AY 2025-26' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Section 234F, Income Tax Act 1961', description: 'Mandatory late filing fee of Rs. 5,000 or Rs. 1,000 for returns filed after the due date' },
      { section: 'Section 234A, Income Tax Act 1961', description: 'Interest at 1% per month on unpaid self-assessment tax from due date to filing date' },
      { section: 'Section 234B, Income Tax Act 1961', description: 'Interest for default in advance tax payment (less than 90% paid during the year)' },
      { section: 'Section 234C, Income Tax Act 1961', description: 'Interest for deferment of advance tax instalment payments' },
      { section: 'Section 139(4), Income Tax Act 1961', description: 'Belated return - can be filed up to 31 December of the assessment year' },
      { section: 'Section 139(8A), Income Tax Act 1961', description: 'Updated Return (ITR-U) with additional tax surcharge of 25% or 50%' },
    ],
  },
  howToAvoid: [
    {
      title: 'File a preliminary return before 31 July even if documents are incomplete',
      description: 'A return filed on time can be revised under Section 139(5) up to 31 December. Filing a rough return on time and revising later costs Rs. 0 in late fees. Missing the deadline costs at least Rs. 5,000.',
    },
    {
      title: 'Collect Form 16 and reconcile AIS before 30 June',
      description: 'Most employers issue Form 16 by 15 June. Use the first half of July to reconcile your income with AIS and Form 26AS on the Income Tax portal. Raise TDS correction requests with employers or banks in June, not late July.',
    },
    {
      title: 'Track capital gains from April itself',
      description: 'Download your annual capital gains statement from your demat account and mutual fund statements in April. LTCG, STCG, dividend income, debt fund gains - all reportable. Leaving this to July is the most common reason for last-minute scrambling.',
    },
    {
      title: 'Pay advance tax if non-salary income exceeds Rs. 10,000',
      description: 'If your total tax liability after TDS is Rs. 10,000 or more, advance tax must be paid in quarterly instalments by 15 June, 15 September, 15 December, and 15 March. Missing these triggers Section 234B and 234C interest separately from the Section 234F filing fee.',
    },
    {
      title: 'Engage a CA by June for complex returns',
      description: 'Returns involving property sale capital gains, ESOPs, foreign income, or business income with potential audit should be handed to a CA by June. Giving a complex return to a CA in the last week of July dramatically increases the risk of missing the deadline.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Can the Section 234F late filing penalty be waived?',
      answer: 'No, Section 234F is mandatory and the Income Tax Department has no power to waive it. The only exception is if your total income is below the basic exemption limit - then the fee simply doesn\'t apply. Courts have upheld the mandatory nature of Section 234F in several rulings since its introduction in 2017.',
    },
    {
      question: 'What happens if I don\'t file ITR at all?',
      answer: 'If you were required to file but didn\'t, the Assessing Officer can make a best judgement assessment under Section 144, estimating your income and issuing a demand. Prosecution under Section 276CC can also be initiated for wilful failure to file - carrying imprisonment of 3 months to 2 years (or 6 months to 7 years if tax evaded exceeds Rs. 25 lakhs). The department sends notices under Section 142(1) to non-filers identified through AIS data.',
    },
    {
      question: 'Is there interest on the Section 234F penalty itself?',
      answer: 'No, Section 234F is a flat fee that doesn\'t attract additional interest. However, interest under Section 234A keeps accruing on any unpaid tax until paid in full. These are two independent charges - the Section 234F fee is fixed regardless of how much tax you owe, while Section 234A interest grows based on the unpaid tax amount.',
    },
    {
      question: 'How do I file ITR after the 31 July deadline?',
      answer: 'File a belated return under Section 139(4) by 31 December 2025 for AY 2025-26. Log in to incometax.gov.in, select the assessment year, choose the correct ITR form, pay the Section 234F fee (Rs. 5,000 or Rs. 1,000) and any outstanding tax via Challan 280, enter the challan details, and submit. E-verify within 30 days of filing.',
    },
    {
      question: 'How do I check my pending income tax penalties on the portal?',
      answer: 'Log in to incometax.gov.in, go to Pending Actions > Response to Outstanding Demand. This shows all pending demands including Section 234F late fees, Section 234A/B/C interest, and other penalties.',
    },
    {
      question: 'Can I pay ITR late filing penalty in installments?',
      answer: 'The Section 234F late fee (Rs. 1,000-5,000) must be paid with the return filing. For larger Section 234A/B/C interest amounts, you can request installment payments under Section 220(3) by writing to the Assessing Officer.',
    },
    {
      question: 'If I have multiple years of ITR pending, which year should I file first?',
      answer: 'File the oldest year first. Each year is assessed independently, but loss carry-forward requires sequential filing. Late filing for earlier years may also limit deductions (like Section 80C) in those years.',
    },
    {
      question: 'Does ITR late filing affect my loan or visa applications?',
      answer: 'Yes. Banks require 2-3 years of ITRs for loans. Late filing stamps on ITRs may raise questions. For visa applications, some consulates specifically look for timely filing. ITR acknowledgments show filing date, which is visible to anyone you share them with.',
    },
    {
      question: 'What happens to carry-forward losses if I file ITR late?',
      answer: 'Losses cannot be carried forward if ITR is filed after the due date. This applies to business losses, capital losses, and speculation losses. The only exception is house property loss, which can be carried forward even with late filing.',
    },
    {
      question: 'Is there a way to get Section 234F late fee waived for genuine hardship?',
      answer: 'No, Section 234F late fee is automatic and cannot be waived - it is a fee, not a penalty. However, Section 234A/B/C interest can sometimes be reduced or waived by the Assessing Officer under Section 220(2A) if you demonstrate genuine inability to pay.',
    },
  ],
  relatedPenalties: [
    { title: 'GST Late Filing Penalty', slug: 'gst-late-filing', description: 'Section 47 CGST Act late fees for GSTR-1, GSTR-3B, and GSTR-9 filed after due dates.' },
    { title: 'TDS Late Filing Penalty', slug: 'tds-late-filing', description: 'Section 234E and 271H penalties for missing quarterly TDS return deadlines.' },
    { title: 'Business ITR and Tax Audit Penalty', slug: 'mca-annual-filing', description: 'Section 271B penalty for failure to get accounts audited when mandatory under Section 44AB.' },
  ],
}

// ─────────────────────────────────────────────
// 3. TDS LATE FILING
// ─────────────────────────────────────────────
export const tdsLateFilingContent: PenaltyPageContent = {
  slug: 'tds-late-filing',
  intro: {
    title: 'TDS Late Filing Penalty Calculator 2024-25 (Section 234E and Section 271H)',
    description: `If you deduct TDS, you must file quarterly returns by the due dates - miss them and you'll pay Rs. 200 per day under Section 234E until you file. This adds up fast, though it's capped at the total TDS amount for that quarter.

On top of that, Section 271H gives the Assessing Officer discretion to levy an additional penalty of Rs. 10,000 to Rs. 1,00,000 for failure to file or filing incorrect returns. And if you deposited TDS late (separate from filing late), there's interest under Section 201(1A) at 1% per month for non-deduction and 1.5% per month for late deposit. Yes, all three charges can apply to the same quarter.`,
    keyInfo: [
      { label: 'Late fee (Section 234E)', value: 'Rs. 200 per day, capped at total TDS amount for the quarter' },
      { label: 'Penalty (Section 271H)', value: 'Rs. 10,000 to Rs. 1,00,000 at the AO\'s discretion' },
      { label: 'Interest - TDS not deducted (Section 201(1A))', value: '1% per month from date of payment to date of deduction' },
      { label: 'Interest - TDS deducted but not deposited (Section 201(1A))', value: '1.5% per month from date of deduction to date of deposit' },
      { label: 'Section 271H not applicable if', value: 'TDS paid and return filed within 1 year of the due date' },
      { label: 'Section 234E applies', value: 'Even if TDS was deposited on time - filing and depositing are separate obligations' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate TDS Late Filing Penalty',
    steps: [
      {
        step: 1,
        title: 'Find the quarterly due date for your TDS return',
        description: 'Each quarter has a fixed due date. Q1 (Apr-Jun) is due 31 July. Q2 (Jul-Sep) is due 31 October. Q3 (Oct-Dec) is due 31 January. Q4 (Jan-Mar) is due 31 May. The form depends on the payment type (Form 24Q for salary TDS, Form 26Q for non-salary, Form 27Q for non-resident payments).',
      },
      {
        step: 2,
        title: 'Count the days of delay',
        description: 'Count every calendar day from the day after the due date to the actual date of filing.',
        formula: 'Days of delay = Filing date - Due date',
      },
      {
        step: 3,
        title: 'Calculate Section 234E late fee',
        description: 'Multiply Rs. 200 by the number of days of delay. The result cannot exceed the total TDS amount for that quarter.',
        formula: 'Section 234E fee = MIN(Rs. 200 x Days of delay, Total TDS for the quarter)',
      },
      {
        step: 4,
        title: 'Calculate interest on late TDS deposit (if applicable)',
        description: 'If you also deposited TDS late, calculate 1.5% per month interest from the date you deducted it to the date you deposited it into the government account.',
        formula: 'Interest on late deposit = TDS amount x 1.5% x months of delay (rounded up to full months)',
      },
      {
        step: 5,
        title: 'Check Section 271H applicability',
        description: 'If the delay exceeds 1 year from the due date and TDS hadn\'t been paid and filed, the Assessing Officer may additionally levy a penalty of up to Rs. 1,00,000. This is discretionary, not automatic.',
      },
    ],
    example: {
      scenario: 'A company files Q1 (Apr-Jun 2024) TDS return Form 26Q on 15 September 2024 (due date was 31 July 2024). Total TDS deducted and deposited on time was Rs. 45,000.',
      calculation: 'Days of delay: 46 days (1 Aug to 15 Sep). Section 234E: Rs. 200 x 46 = Rs. 9,200. Cap check: total TDS = Rs. 45,000, so cap = Rs. 45,000. Fee payable = Rs. 9,200 (below cap). TDS was deposited on time so no Section 201(1A) interest. Section 271H: filing within 1 year so not applicable.',
      result: 'Total extra cost: Rs. 9,200 (Section 234E only). Pay this before the TRACES portal accepts the return.',
    },
  },
  penaltyBreakdown: {
    title: 'TDS Penalty Rates 2024-25',
    categories: [
      {
        name: 'Section 234E - late filing fee',
        rate: 'Rs. 200 per calendar day of delay',
        cap: 'Cannot exceed total TDS amount for the quarter',
        notes: 'Mandatory - must be paid via challan before the return is accepted. Cannot be waived.',
      },
      {
        name: 'Section 271H - discretionary penalty (AO imposed)',
        rate: 'Rs. 10,000 minimum to Rs. 1,00,000 maximum',
        cap: 'Rs. 1,00,000',
        notes: 'Doesn\'t apply if TDS is paid and return filed within 1 year of the due date',
      },
      {
        name: 'Section 201(1A) - interest for non-deduction of TDS',
        rate: '1% per month from payment date to deduction date',
        cap: 'No cap',
        notes: 'Applies when TDS was not deducted at all on a payment',
      },
      {
        name: 'Section 201(1A) - interest for late deposit after deduction',
        rate: '1.5% per month from deduction date to deposit date',
        cap: 'No cap',
        notes: 'Applies when TDS was deducted but deposited after the 7th of following month',
      },
      {
        name: 'Section 276B - criminal prosecution for non-deposit',
        rate: 'Imprisonment 3 months to 7 years + fine',
        cap: 'Criminal sanction - no monetary cap',
        notes: 'For willful failure to deposit TDS after deduction. Most severe consequence.',
      },
    ],
  },
  financialImpact: {
    title: 'How Much Will Late TDS Return Filing Cost You?',
    scenarios: [
      {
        delay: '15 days late',
        penalty: 'Rs. 3,000 (Section 234E: Rs. 200 x 15 days)',
        interest: 'Rs. 0 if TDS was deposited on time',
        total: 'Rs. 3,000 - significant for just a 2-week delay',
      },
      {
        delay: '30 days late',
        penalty: 'Rs. 6,000 (Section 234E: Rs. 200 x 30 days)',
        interest: 'Rs. 0 if deposited on time (but Rs. 450 on Rs. 30,000 TDS at 1.5%/month if deposited late too)',
        total: 'Rs. 6,000 to Rs. 6,450 depending on deposit timing',
      },
      {
        delay: '60 days late',
        penalty: 'Rs. 12,000 (Section 234E: Rs. 200 x 60) unless cap is hit',
        interest: 'Rs. 900 on Rs. 30,000 TDS at 1.5%/month x 2 months if deposited late',
        total: 'Rs. 12,000 to Rs. 12,900 or capped at total TDS amount if lower',
      },
      {
        delay: '90+ days / beyond 1 year',
        penalty: 'Section 234E capped at total TDS + potential Section 271H up to Rs. 1,00,000',
        interest: 'Section 201(1A) at 1.5%/month keeps growing',
        total: 'TDS amount cap on Section 234E + up to Rs. 1,00,000 Section 271H + uncapped interest',
      },
    ],
    worstCase: {
      description: 'TDS deducted but not deposited for over 1 year, with return also not filed. Section 234E applies (capped at TDS amount), Section 271H at maximum Rs. 1,00,000, Section 201(1A) interest at 1.5%/month, and possible criminal prosecution under Section 276B.',
      amount: 'TDS amount (Section 234E cap) + Rs. 1,00,000 (Section 271H max) + 18% effective annual interest + criminal prosecution risk',
    },
  },
  deadlines: {
    title: 'TDS Return Due Dates 2024-25',
    dates: [
      { form: 'Q1 TDS Return (Apr-Jun 2024) - Form 24Q / 26Q / 27Q', dueDate: '31 July 2024', frequency: 'Quarterly' },
      { form: 'Q2 TDS Return (Jul-Sep 2024) - Form 24Q / 26Q / 27Q', dueDate: '31 October 2024', frequency: 'Quarterly' },
      { form: 'Q3 TDS Return (Oct-Dec 2024) - Form 24Q / 26Q / 27Q', dueDate: '31 January 2025', frequency: 'Quarterly' },
      { form: 'Q4 TDS Return (Jan-Mar 2025) - Form 24Q / 26Q / 27Q', dueDate: '31 May 2025', frequency: 'Quarterly' },
      { form: 'Monthly TDS deposit - all months except March', dueDate: '7th of following month', frequency: 'Monthly' },
      { form: 'Monthly TDS deposit - March', dueDate: '30 April', frequency: 'Annual exception' },
      { form: 'TDS certificate (Form 16) to employees', dueDate: '15 June of the following FY', frequency: 'Annual' },
      { form: 'TDS certificate (Form 16A) for non-salary', dueDate: '15 days from due date of quarterly return', frequency: 'Quarterly' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Section 234E, Income Tax Act 1961', description: 'Mandatory late filing fee of Rs. 200 per day, capped at TDS amount for the quarter' },
      { section: 'Section 271H, Income Tax Act 1961', description: 'Discretionary penalty of Rs. 10,000 to Rs. 1,00,000 for failure to file or incorrect TDS returns' },
      { section: 'Section 201(1A), Income Tax Act 1961', description: 'Interest at 1% (non-deduction) or 1.5% per month (late deposit) on TDS amount' },
      { section: 'Section 276B, Income Tax Act 1961', description: 'Criminal prosecution for willful failure to deposit deducted TDS - imprisonment 3 months to 7 years' },
      { section: 'Section 200A, Income Tax Act 1961', description: 'Intimation after TDS statement processing - demand generated for defaults' },
    ],
    notifications: [
      { number: 'CBDT Circular 09/2015 dated 9 June 2015', summary: 'Section 271H penalty doesn\'t apply if TDS paid and return filed within 1 year of due date' },
    ],
  },
  howToAvoid: [
    {
      title: 'Automate TDS deposit by the 7th using bank standing instructions',
      description: 'TDS deposit and return filing are separate obligations with different deadlines. Automate the monthly deposit by the 7th using your bank\'s challan payment or auto-debit. A missed deposit triggers 1.5% per month interest from day one of deduction.',
    },
    {
      title: 'Prepare and validate the TDS return at least 7 days early',
      description: 'TDS return preparation involves matching deductee PAN details against the Income Tax database. Invalid PANs cause rejection, requiring correction and re-submission. Starting 7 days early gives you time to resolve PAN mismatches without missing the deadline.',
    },
    {
      title: 'Validate all deductee PANs through TRACES before including them',
      description: 'Log in to TRACES (tdscpc.gov.in) and use the PAN Verification service to confirm all PANs in your deductee list are valid and active. Incorrect PAN entries mean TDS credit doesn\'t reach the deductee and triggers defaults in your account.',
    },
    {
      title: 'Monitor TRACES for defaults and short deduction notices',
      description: 'The TDS Processing Cell sends intimations for defaults via email and TRACES dashboard. Check TRACES at least monthly to catch and respond to short deduction or interest demands before they escalate to a formal Section 271H penalty proceeding.',
    },
    {
      title: 'Use payroll or accounting software with built-in TDS return generation',
      description: 'Manual TDS return preparation using Excel is error-prone. Most accounting platforms (Tally, Zoho Books, QuickBooks India) generate Form 24Q and 26Q returns automatically from payroll and payment data. Using software reduces PAN errors and last-minute prep time.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Can the Section 234E TDS late filing fee be waived?',
      answer: 'No. Section 234E is mandatory and the Income Tax Act provides no mechanism for waiver. The TRACES portal won\'t accept your TDS return until the Section 234E fee is paid in full via a TDS/TCS challan. The only limit is the cap at the total TDS amount for that quarter - beyond that, no further fee accrues.',
    },
    {
      question: 'What happens if I don\'t deposit TDS that I\'ve deducted from employees or vendors?',
      answer: 'This is treated as a criminal offence under Section 276B and can result in 3 months to 7 years imprisonment plus a fine. You also become an "assessee in default" under Section 201 and are personally liable for the TDS amount plus 1.5% per month interest. The Income Tax Department has become increasingly aggressive in pursuing criminal cases for TDS non-deposit.',
    },
    {
      question: 'Is Section 234E charged even if I deposited TDS on time?',
      answer: 'Yes. Section 234E applies to late filing of the quarterly TDS return, which is a separate obligation from the monthly TDS deposit. Even if you deposited TDS before the 7th of every month perfectly, filing the quarterly return (Form 24Q or 26Q) late still triggers the Rs. 200 per day charge. Both obligations must be met independently.',
    },
    {
      question: 'How do I file a TDS return after the due date?',
      answer: 'First, pay the Section 234E late fee via challan (using the TDS/TCS challan, not a regular income tax challan). Then log in to TRACES or use TDS return filing software (like NSDL RPU) to prepare the return file. Upload it on the TRACES portal under "Upload TDS". The portal will verify the Section 234E fee has been paid before accepting the return. File corrections using Form 26A if PAN-based errors are flagged after filing.',
    },
    {
      question: 'How do I check my TDS late filing status on TRACES?',
      answer: 'Log in to TRACES at tdscpc.gov.in, go to Statements > Statement Status. This shows all filed and pending TDS returns with late fee details. You can also check the Challan Status Enquiry for deposit details.',
    },
    {
      question: 'Can Section 234E late filing fee be paid in installments?',
      answer: 'No, Section 234E fee is calculated at Rs. 200/day and must be paid in full before filing the TDS return. The fee is capped at the TDS amount due in the return, so it cannot exceed what you owed to deposit.',
    },
    {
      question: 'What happens if I filed TDS return but deposited TDS late?',
      answer: 'Two separate consequences: Section 234E for late return filing (Rs. 200/day) AND Section 201(1A) interest for late deposit (1% to 1.5% per month). These are calculated independently. Late deposit interest is separate from late filing fee.',
    },
    {
      question: 'Can I correct a TDS return after filing to reduce penalties?',
      answer: 'You can file a correction return to fix errors (wrong PAN, wrong amount), but this does not reduce late fees already charged. Section 234E late fee is calculated from original due date regardless of correction filings.',
    },
    {
      question: 'Will TDS non-compliance trigger an income tax scrutiny?',
      answer: 'Yes. Section 40(a)(ia) disallows 30% of expenses where TDS was not deducted. This reduces your business profits and increases tax liability. During assessment, officers cross-check TRACES data with your ITR, triggering scrutiny notices.',
    },
    {
      question: 'What if my vendor paid tax themselves - do I still face TDS penalties?',
      answer: 'Yes. Your obligation to deduct TDS is independent of whether the vendor paid tax on their income. However, under certain conditions, you may claim relief using Form 26A if you can prove the vendor included the income in their ITR.',
    },
  ],
  relatedPenalties: [
    { title: 'ITR Late Filing Penalty', slug: 'itr-late-filing', description: 'Section 234F penalty and Section 234A interest for missing income tax return due dates.' },
    { title: 'GST Late Filing Penalty', slug: 'gst-late-filing', description: 'Section 47 CGST Act late fees for GSTR-3B and GSTR-1 filed after due dates.' },
    { title: 'MCA Annual Filing Penalty', slug: 'mca-annual-filing', description: 'Rs. 100/day ROC penalty for late AOC-4 and MGT-7 annual filings by companies.' },
  ],
}

// ─────────────────────────────────────────────
// 4. MCA ANNUAL FILING
// ─────────────────────────────────────────────
export const mcaAnnualFilingContent: PenaltyPageContent = {
  slug: 'mca-annual-filing',
  intro: {
    title: 'MCA Annual Filing Penalty Calculator 2024-25 (ROC Late Fee)',
    description: `Every Private Limited Company, OPC, and LLP in India must file annual returns and financial statements with the Registrar of Companies (ROC) through the MCA portal. File late and you'll pay an additional fee of Rs. 100 per day per form - with no upper cap. This makes persistent non-compliance one of the most expensive regulatory defaults in Indian company law.

For companies, AOC-4 (financial statements) is due within 30 days of the AGM and MGT-7 (annual return) within 60 days of the AGM. Since most companies hold their AGM on 30 September, this means AOC-4 is due by 29 October and MGT-7 by 28 November. For LLPs, the deadlines are fixed: Form 8 (Statement of Accounts) by 30 October and Form 11 (Annual Return) by 30 May. Unlike GST late fees, the ROC additional fee has no cap and keeps accumulating indefinitely.`,
    keyInfo: [
      { label: 'Late fee - AOC-4 (financial statements)', value: 'Rs. 100 per day of delay, no cap' },
      { label: 'Late fee - MGT-7 (annual return)', value: 'Rs. 100 per day of delay, no cap' },
      { label: 'Late fee - LLP Form 8', value: 'Rs. 100 per day of delay, no cap' },
      { label: 'Late fee - LLP Form 11', value: 'Rs. 100 per day of delay, no cap' },
      { label: 'AOC-4 due date (if AGM held 30 Sep)', value: '29 October' },
      { label: 'MGT-7 due date (if AGM held 30 Sep)', value: '28 November' },
      { label: 'Strike-off risk', value: 'After 2+ years of non-filing - ROC can strike off under Section 248' },
      { label: 'Officer in default fine', value: 'Up to Rs. 5 lakhs + imprisonment up to 6 months' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate MCA Annual Filing Penalty',
    steps: [
      {
        step: 1,
        title: 'Determine your AGM date and calculate form due dates',
        description: 'The AGM must happen within 6 months of year-end (31 March). Most companies hold AGM on 29-30 September. AOC-4 is due 30 days after AGM. MGT-7 is due 60 days after AGM. For LLPs, Form 11 is due 30 May and Form 8 is due 30 October regardless of any AGM.',
        formula: 'AOC-4 due = AGM date + 30 days | MGT-7 due = AGM date + 60 days',
      },
      {
        step: 2,
        title: 'Count the days of delay for each form separately',
        description: 'Each form has its own due date and accumulates its own penalty independently. Count days from the day after the due date to the actual filing date for each form.',
        formula: 'Days of delay per form = Actual filing date - Due date for that form',
      },
      {
        step: 3,
        title: 'Calculate additional fee per form',
        description: 'Multiply Rs. 100 by the number of days of delay for each form. There\'s no cap. A company filing both AOC-4 and MGT-7 two months late pays Rs. 100/day on each form independently.',
        formula: 'Additional fee per form = Rs. 100 x Days of delay',
      },
      {
        step: 4,
        title: 'Add additional fees across all forms',
        description: 'Sum the additional fees for all overdue forms. For a company filing both AOC-4 and MGT-7 late by different periods, calculate each separately and add them up.',
        formula: 'Total additional fee = Sum of (Rs. 100 x Days late) for each overdue form',
      },
      {
        step: 5,
        title: 'Check for officer-in-default and strike-off risk',
        description: 'If any filing has been overdue for 2+ years, the company risks strike-off under Section 248. If already struck off, revival requires an NCLT petition before any filing can be made.',
      },
    ],
    example: {
      scenario: 'A Private Limited Company held its AGM on 30 September 2024. It files AOC-4 on 15 January 2025 (due 29 October 2024) and MGT-7 on 15 January 2025 (due 28 November 2024).',
      calculation: 'AOC-4 delay: 78 days (30 Oct 2024 to 15 Jan 2025). AOC-4 additional fee: Rs. 100 x 78 = Rs. 7,800. MGT-7 delay: 48 days (29 Nov 2024 to 15 Jan 2025). MGT-7 additional fee: Rs. 100 x 48 = Rs. 4,800. Total: Rs. 7,800 + Rs. 4,800 = Rs. 12,600.',
      result: 'Total additional fee: Rs. 12,600 for filing both forms about 2.5 months late. No cap - this is on top of the normal filing fee.',
    },
  },
  penaltyBreakdown: {
    title: 'MCA Annual Filing Penalty Rates 2024-25',
    categories: [
      {
        name: 'AOC-4 late filing - all companies',
        rate: 'Rs. 100 per day of delay',
        cap: 'No cap',
        notes: 'Financial statements including balance sheet and P&L',
      },
      {
        name: 'MGT-7 late filing - Pvt Ltd and Public companies',
        rate: 'Rs. 100 per day of delay',
        cap: 'No cap',
        notes: 'Annual return with shareholding and directorship details',
      },
      {
        name: 'MGT-7A late filing - OPCs and small companies',
        rate: 'Rs. 100 per day of delay',
        cap: 'No cap',
        notes: 'Simplified annual return for One Person Companies and small companies',
      },
      {
        name: 'LLP Form 8 (Statement of Accounts and Solvency)',
        rate: 'Rs. 100 per day of delay',
        cap: 'No cap',
        notes: 'Due 30 October every year. Applies to all LLPs regardless of turnover.',
      },
      {
        name: 'LLP Form 11 (Annual Return)',
        rate: 'Rs. 100 per day of delay',
        cap: 'No cap',
        notes: 'Due 30 May every year. Applies to all LLPs regardless of turnover.',
      },
      {
        name: 'Officer-in-default penalty (Section 92, 137)',
        rate: 'Rs. 50,000 for company + Rs. 500/day per officer up to Rs. 5 lakhs',
        cap: 'Rs. 5 lakhs per officer',
        notes: 'Imposed by ROC separately from the additional filing fee',
      },
    ],
  },
  financialImpact: {
    title: 'How Much Will Late MCA Filing Cost You?',
    scenarios: [
      {
        delay: '15 days late on both AOC-4 and MGT-7',
        penalty: 'Rs. 1,500 (AOC-4) + Rs. 1,500 (MGT-7) = Rs. 3,000',
        interest: 'N/A',
        total: 'Rs. 3,000 in additional fees + normal filing fee',
      },
      {
        delay: '30 days late on both forms',
        penalty: 'Rs. 3,000 (AOC-4) + Rs. 3,000 (MGT-7) = Rs. 6,000',
        interest: 'N/A',
        total: 'Rs. 6,000 - doubles with each additional month',
      },
      {
        delay: '60 days late on both forms',
        penalty: 'Rs. 6,000 (AOC-4) + Rs. 6,000 (MGT-7) = Rs. 12,000',
        interest: 'N/A',
        total: 'Rs. 12,000 - no cap means cost keeps compounding',
      },
      {
        delay: '180 days / 6 months late on both forms',
        penalty: 'Rs. 18,000 (AOC-4) + Rs. 18,000 (MGT-7) = Rs. 36,000',
        interest: 'N/A',
        total: 'Rs. 36,000+ with strike-off risk approaching. DIN disqualification risk for directors.',
      },
    ],
    worstCase: {
      description: 'Company that hasn\'t filed for 2+ consecutive years. ROC initiates strike-off under Section 248. Directors become disqualified from all directorships under Section 164(2) for 5 years. Revival requires an NCLT petition, which takes 6-18 months and costs Rs. 50,000-2,00,000 in professional fees.',
      amount: 'Accumulated Rs. 100/day with no cap + Section 164(2) disqualification + NCLT revival cost of Rs. 50,000-2,00,000',
    },
  },
  deadlines: {
    title: 'MCA Annual Filing Due Dates 2024-25',
    dates: [
      { form: 'AGM (Annual General Meeting)', dueDate: '30 September 2024 (within 6 months of 31 March year-end)', frequency: 'Annual' },
      { form: 'AOC-4 (Financial Statements) - Pvt Ltd / OPC', dueDate: '29 October 2024 (30 days after AGM on 30 Sep)', frequency: 'Annual' },
      { form: 'MGT-7 / MGT-7A (Annual Return)', dueDate: '28 November 2024 (60 days after AGM on 30 Sep)', frequency: 'Annual' },
      { form: 'LLP Form 11 (Annual Return)', dueDate: '30 May 2025', frequency: 'Annual - fixed date' },
      { form: 'LLP Form 8 (Statement of Accounts)', dueDate: '30 October 2025', frequency: 'Annual - fixed date' },
      { form: 'DIR-3 KYC (for all directors)', dueDate: '30 September each year', frequency: 'Annual' },
      { form: 'ADT-1 (Auditor Appointment)', dueDate: '15 days from AGM', frequency: 'Annual or as changed' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Section 92, Companies Act 2013', description: 'Annual return filing requirement for companies - MGT-7 within 60 days of AGM' },
      { section: 'Section 137, Companies Act 2013', description: 'Filing of financial statements with ROC - AOC-4 within 30 days of AGM' },
      { section: 'Section 164(2), Companies Act 2013', description: 'Disqualification of directors who serve on boards of companies that haven\'t filed for 3+ years' },
      { section: 'Section 248, Companies Act 2013', description: 'ROC\'s power to strike off companies that haven\'t been carrying on business or haven\'t filed returns for 2+ years' },
      { section: 'Section 12(9), LLP Act 2008', description: 'Annual return and statement of accounts filing requirements for LLPs' },
    ],
    notifications: [
      { number: 'MCA Circular dated 29 December 2020', summary: 'CFSS (Companies Fresh Start Scheme) allowed overdue filings with immunity from prosecution - scheme has closed' },
      { number: 'MCA General Circular 12/2021', summary: 'Waiver of additional fees for certain forms filed between 1 April 2021 and 31 July 2021 due to COVID-19 - scheme closed' },
    ],
  },
  howToAvoid: [
    {
      title: 'Hold the AGM by 29 September to maximise time for filing',
      description: 'Holding the AGM a day before the 30 September deadline gives you 30 days for AOC-4 (due 29 October) and 60 days for MGT-7 (due 28 November). Start auditor finalisation in July and board approval in September. Missing the AGM deadline requires an NCLT extension petition.',
    },
    {
      title: 'Begin the statutory audit in April immediately after year-end',
      description: 'The financial statements presented at the AGM must be auditor-approved. Engage your statutory auditor by April 15 and target draft financials by 31 July. Audit delays cascade directly into delayed AGM and then delayed ROC filing.',
    },
    {
      title: 'Keep all directors\' DINs active with timely DIR-3 KYC',
      description: 'Deactivated DINs block all MCA form submissions. File DIR-3 KYC for every director by 30 September each year (free if filed on time). A deactivated DIN on any director delays the entire annual filing process.',
    },
    {
      title: 'File LLP forms on calendar dates, not AGM-linked dates',
      description: 'Unlike company filings, LLP Form 8 (30 October) and Form 11 (30 May) have fixed calendar due dates not linked to any AGM. Mark these as fixed reminders at the start of every FY. LLPs often miss these because there\'s no AGM trigger as a reminder.',
    },
    {
      title: 'Assign a Company Secretary or CA as the compliance owner',
      description: 'Growing companies often lack a dedicated compliance function. Designate a specific CA firm or Company Secretary who is contractually responsible for tracking and filing all MCA forms. The cost is far less than accumulated Rs. 100/day penalties.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Can MCA additional fees (ROC penalty) be waived?',
      answer: 'No, the additional fee of Rs. 100 per day is mandatory under the Companies Act and cannot be waived by the ROC or MCA. The government has announced CFSS (Companies Fresh Start Scheme) in the past to allow filings with reduced or waived fees, but such schemes are not permanent. The most recent comprehensive CFSS was in 2020-21 and has closed.',
    },
    {
      question: 'What happens if a company doesn\'t file annual returns for 2+ years?',
      answer: 'The ROC can issue a notice under Section 248 to strike off the company as defunct. Once struck off, the company loses its legal existence, its bank accounts are frozen, and directors become disqualified from directorships in all other companies for 5 years under Section 164(2). Revival requires filing a petition before the National Company Law Tribunal (NCLT), which is expensive and time-consuming.',
    },
    {
      question: 'Is there interest on the MCA additional filing fee?',
      answer: 'The additional fee isn\'t an interest-bearing amount - it\'s a fixed Rs. 100 per day that accumulates over time. There\'s no compound interest on the accumulated penalty. But since accumulation is unlimited, totals can become very large over long periods of non-compliance. For example, 365 days of delay on both AOC-4 and MGT-7 would total Rs. 73,000 in additional fees alone.',
    },
    {
      question: 'How do I file MCA annual returns after the due date?',
      answer: 'Log in to the MCA V3 portal at efiling.mca.gov.in. Navigate to the relevant form (AOC-4 or MGT-7). The portal automatically calculates and displays the additional fee based on the current date. Pay the additional fee via online payment during the filing process. The system accepts the payment and allows filing without any separate application. Make sure the director\'s DIN is active and DSC is valid before starting.',
    },
    {
      question: 'How do I check pending MCA penalties on the portal?',
      answer: 'Log in to mca.gov.in, go to MCA Services > Company Services > View Company/LLP Master Data. Enter your CIN/LLPIN to see compliance status. Alternatively, check the SRN status of your last filing to see if additional fees were charged.',
    },
    {
      question: 'Can I pay MCA additional fees in installments?',
      answer: 'No, MCA additional fees must be paid in full at the time of filing. The fee is calculated automatically by the portal (Rs. 100/day per form). For very large amounts, some companies file STK-2 (strike-off) and then revive the company with a fresh start under the CFSS scheme.',
    },
    {
      question: 'What happens if only one form (AOC-4 or MGT-7) is filed late?',
      answer: 'Each form is penalized separately. AOC-4 has its own Rs. 100/day fee, and MGT-7 has its own Rs. 100/day fee. Filing one does not affect the penalty on the other. Both must be filed to be compliant.',
    },
    {
      question: 'Does MCA non-compliance affect director DIN status?',
      answer: 'Yes. After 3 consecutive years of non-filing, directors face disqualification under Section 164(2). This deactivates DIN for 5 years and affects all directorships held by that person - not just the defaulting company.',
    },
    {
      question: 'Is there an MCA amnesty scheme for late filing penalties?',
      answer: 'MCA periodically announces Company Fresh Start Schemes (CFSS) and LLP Settlement Schemes that waive additional fees for filing pending returns. The last major scheme was in 2020-2021. Check MCA website for current schemes.',
    },
    {
      question: 'What if the auditor has not completed the audit - can I still file on time?',
      answer: 'No. AOC-4 requires audited financial statements. You cannot file provisional or unaudited accounts. If your auditor delays, the company and directors bear the penalty. Consider changing auditors if delays are recurring.',
    },
  ],
  relatedPenalties: [
    { title: 'Director KYC (DIR-3) Penalty', slug: 'director-kyc', description: 'Rs. 5,000 penalty for late DIR-3 KYC filing and resulting DIN deactivation.' },
    { title: 'PF and ESIC Penalty', slug: 'pf-esic-penalty', description: 'Interest and damages for late EPF and ESIC contribution payments for companies with employees.' },
    { title: 'ITR Late Filing Penalty', slug: 'itr-late-filing', description: 'Section 234F fee for companies and LLPs missing income tax return due dates.' },
  ],
}

// ─────────────────────────────────────────────
// 5. PF AND ESIC PENALTY
// ─────────────────────────────────────────────
export const pfEsicPenaltyContent: PenaltyPageContent = {
  slug: 'pf-esic-penalty',
  intro: {
    title: 'PF and ESIC Late Payment Penalty Calculator 2024-25',
    description: `If you have 20 or more employees, you must register with EPFO and contribute monthly to EPF. With 10 or more employees in specified industries, you need ESIC registration too. Both EPF and ESIC contributions are due by the 15th of the following month.

Pay late and you'll face interest under Section 7Q of the EPF Act at 12% per annum, plus damages under Section 14B ranging from 5% to 25% depending on how late you are. ESIC late payments attract 12% simple interest under Regulation 31C. And if you deducted EPF from employee salaries but didn't deposit it? That's a criminal offence under Section 14 of the EPF Act, punishable with up to 3 years imprisonment.`,
    keyInfo: [
      { label: 'EPF contribution - employer', value: '12% of basic wages + DA (3.67% to EPF, 8.33% to EPS, 0.5% to EDLI)' },
      { label: 'EPF contribution - employee', value: '12% of basic wages + DA (entire amount to EPF account)' },
      { label: 'ESIC contribution - employer', value: '3.25% of gross wages' },
      { label: 'ESIC contribution - employee', value: '0.75% of gross wages (exempt if wages below Rs. 176 per day)' },
      { label: 'EPF interest on delayed payment (Section 7Q)', value: '12% per annum on overdue contribution' },
      { label: 'EPF damages - delay up to 2 months (Section 14B)', value: '5% per annum on overdue amount' },
      { label: 'EPF damages - delay 2 to 4 months', value: '10% per annum on overdue amount' },
      { label: 'EPF damages - delay 4 to 6 months', value: '15% per annum on overdue amount' },
      { label: 'EPF damages - delay beyond 6 months', value: '25% per annum on overdue amount' },
      { label: 'ESIC interest on delayed payment', value: '12% per annum simple interest' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate PF Late Payment Penalty',
    steps: [
      {
        step: 1,
        title: 'Calculate total overdue EPF and ESIC contribution',
        description: 'Total overdue = Employer\'s contribution + Employee\'s contribution for the delayed month. EPF employer share is 12% of basic + DA (3.67% + 8.33% + 0.5% EDLI). Employee share is 12% of basic + DA. ESIC is 3.25% (employer) + 0.75% (employee) of gross wages.',
        formula: 'Total EPF due = (12% + 12%) of basic wages + 0.5% EDLI | Total ESIC due = (3.25% + 0.75%) of gross wages',
      },
      {
        step: 2,
        title: 'Calculate Section 7Q interest at 12% p.a.',
        description: 'Interest accrues from the 16th of the month (one day after the due date) to the date of actual payment. Calculate on a simple interest basis.',
        formula: 'Section 7Q interest = Overdue EPF amount x 12% x (Days of delay / 365)',
      },
      {
        step: 3,
        title: 'Determine the Section 14B damages bracket',
        description: 'Classify the delay into the applicable bracket: 0-2 months (5% p.a.), 2-4 months (10% p.a.), 4-6 months (15% p.a.), over 6 months (25% p.a.). The EPFO Commissioner applies the rate for your bracket.',
        formula: 'Damages bracket: 0-60 days = 5% | 61-120 days = 10% | 121-180 days = 15% | 180+ days = 25%',
      },
      {
        step: 4,
        title: 'Calculate Section 14B damages',
        description: 'Apply the bracket rate to the overdue EPF amount for the period of delay. Note: damages are in addition to Section 7Q interest - both apply simultaneously.',
        formula: 'Section 14B damages = Overdue EPF x Applicable damages rate x (Days of delay / 365)',
      },
      {
        step: 5,
        title: 'Total all charges for EPF and ESIC separately',
        description: 'EPF total = Overdue contribution + Section 7Q interest + Section 14B damages. ESIC total = Overdue contribution + 12% p.a. interest. Pay both via their respective portals (EPFO Unified Portal and esic.in).',
        formula: 'Total EPF liability = Overdue + 7Q interest + 14B damages | Total ESIC liability = Overdue + 12% p.a. interest',
      },
    ],
    example: {
      scenario: 'A company with 25 employees has a monthly EPF liability of Rs. 50,000 (employer + employee combined). The contribution for September 2024 (due by 15 October 2024) is paid on 30 November 2024 - a delay of 46 days.',
      calculation: 'Section 7Q interest: Rs. 50,000 x 12% x (46/365) = Rs. 757. Section 14B damages bracket: 46 days falls in 0-60 day bracket (5% p.a.). Damages: Rs. 50,000 x 5% x (46/365) = Rs. 315. Total extra cost: Rs. 757 + Rs. 315 = Rs. 1,072.',
      result: 'Total extra cost: Rs. 1,072 on a Rs. 50,000 EPF contribution that was 46 days late. That\'s about 2.1% of the contribution amount.',
    },
  },
  penaltyBreakdown: {
    title: 'PF and ESIC Penalty Rates 2024-25',
    categories: [
      {
        name: 'Section 7Q EPF interest (mandatory)',
        rate: '12% per annum simple interest',
        cap: 'No cap - accrues daily until payment',
        notes: 'Applies from day 1 after the 15th. Cannot be waived.',
      },
      {
        name: 'Section 14B damages - 0 to 2 months delay',
        rate: '5% per annum on overdue EPF',
        cap: 'No cap',
        notes: 'Discretionary but routinely applied by EPFO Commissioner',
      },
      {
        name: 'Section 14B damages - 2 to 4 months delay',
        rate: '10% per annum on overdue EPF',
        cap: 'No cap',
        notes: 'Rate doubles from the 0-2 month bracket',
      },
      {
        name: 'Section 14B damages - 4 to 6 months delay',
        rate: '15% per annum on overdue EPF',
        cap: 'No cap',
        notes: 'Effective combined rate with 7Q interest approaches 27% p.a.',
      },
      {
        name: 'Section 14B damages - beyond 6 months',
        rate: '25% per annum on overdue EPF',
        cap: 'No cap',
        notes: 'Combined with 12% Section 7Q interest, effective rate is 37% p.a.',
      },
      {
        name: 'ESIC late payment interest',
        rate: '12% per annum simple interest',
        cap: 'No cap',
        notes: 'Under Regulation 31C of ESI (General) Regulations 1950',
      },
    ],
  },
  financialImpact: {
    title: 'How Much Will Late EPF Payment Cost You?',
    scenarios: [
      {
        delay: '15 days late (paid by 1st of following month)',
        penalty: 'Section 14B damages: Rs. 50,000 x 5% x (15/365) = Rs. 103',
        interest: 'Section 7Q: Rs. 50,000 x 12% x (15/365) = Rs. 247',
        total: 'Rs. 350 on Rs. 50,000 EPF contribution - about 0.7%',
      },
      {
        delay: '30 days late (paid mid-following month)',
        penalty: 'Section 14B: Rs. 50,000 x 5% x (30/365) = Rs. 205',
        interest: 'Section 7Q: Rs. 50,000 x 12% x (30/365) = Rs. 493',
        total: 'Rs. 698 on Rs. 50,000 EPF contribution',
      },
      {
        delay: '60 days late (approaching 2-month bracket boundary)',
        penalty: 'Section 14B: Rs. 50,000 x 5% x (60/365) = Rs. 411 (still in 0-2 month bracket)',
        interest: 'Section 7Q: Rs. 50,000 x 12% x (60/365) = Rs. 986',
        total: 'Rs. 1,397 - rate jumps to 10% p.a. damages if just 1 more day late',
      },
      {
        delay: '180+ days (beyond 6 months)',
        penalty: 'Section 14B: Rs. 50,000 x 25% x (180/365) = Rs. 6,164',
        interest: 'Section 7Q: Rs. 50,000 x 12% x (180/365) = Rs. 2,959',
        total: 'Rs. 9,123 on Rs. 50,000 EPF - over 18% of the contribution amount',
      },
    ],
    worstCase: {
      description: 'Employer who deducts EPF from employee salaries but doesn\'t deposit it for 6+ months and then faces criminal prosecution under Section 14 of the EPF Act along with damages at 25% p.a.',
      amount: 'Section 7Q interest (12% p.a.) + Section 14B damages (25% p.a.) = effective 37% p.a. cost + criminal prosecution risk of imprisonment up to 3 years',
    },
  },
  deadlines: {
    title: 'EPF and ESIC Filing Due Dates 2024-25',
    dates: [
      { form: 'Monthly EPF contribution deposit', dueDate: '15th of following month', frequency: 'Monthly' },
      { form: 'Monthly ESIC contribution deposit', dueDate: '15th of following month', frequency: 'Monthly' },
      { form: 'Monthly EPF ECR (Electronic Challan cum Return)', dueDate: '15th of following month', frequency: 'Monthly' },
      { form: 'EPF Annual Return (Form 3A / 6A) - now through ECR', dueDate: 'Replaced by monthly ECR filing', frequency: 'Replaced by monthly ECR' },
      { form: 'New employee UAN registration', dueDate: 'Within 1 month of joining', frequency: 'As applicable' },
      { form: 'ESIC monthly contribution via ESIC portal', dueDate: '15th of following month', frequency: 'Monthly' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Section 7Q, EPF and MP Act 1952', description: 'Interest at 12% per annum on delayed EPF contributions' },
      { section: 'Section 14B, EPF and MP Act 1952', description: 'Damages for delayed EPF payment - 5% to 25% per annum based on delay period' },
      { section: 'Section 14, EPF and MP Act 1952', description: 'Criminal prosecution for willful failure to deposit EPF - imprisonment up to 3 years' },
      { section: 'Regulation 31C, ESI (General) Regulations 1950', description: 'Interest at 12% per annum on delayed ESIC contribution deposits' },
      { section: 'Section 85, ESI Act 1948', description: 'Penalty for failure to pay ESIC contributions - fine up to Rs. 10,000' },
    ],
    notifications: [
      { number: 'EPFO Circular dated 26 February 2020', summary: 'Operational guidelines for levy of Section 14B damages based on delay period brackets' },
    ],
  },
  howToAvoid: [
    {
      title: 'Set up NACH auto-debit for EPF and ESIC by the 10th',
      description: 'Target payment by the 10th to give a 5-day buffer before the 15th deadline. Set up NACH (National Automated Clearing House) mandate with your bank for automatic debit on the 10th. Generate the ECR challan on the EPFO portal by the 8th to feed into the auto-debit.',
    },
    {
      title: 'Finalise payroll by the 5th of each month',
      description: 'EPF and ESIC contributions are on actual wages, which vary with joining, leaving, salary revisions, and variable pay. A finalised payroll by the 5th allows exact challan generation by the 8th and payment by the 10th - well within the 15th deadline.',
    },
    {
      title: 'Register new employees on EPFO within 30 days of joining',
      description: 'New employees must be added to the EPFO portal within 30 days of joining to generate their UAN and begin contributions. Late registration creates retrospective liability from the date of joining with Section 7Q interest from that date.',
    },
    {
      title: 'Run a monthly compliance checklist to confirm ECR filing',
      description: 'Paying the EPF challan is not the same as filing the ECR (Electronic Challan cum Return). Both must be done. Many employers pay the challan but forget to file the ECR, which is treated as non-compliance. Verify ECR submission status on the EPFO portal within 24 hours of payment.',
    },
    {
      title: 'Consider voluntary EPF registration even if below the 20-employee threshold',
      description: 'Voluntary EPFO registration signals compliance maturity to employees and investors. Once registered, you get structured systems for tracking and depositing contributions. It\'s much easier to comply with a system in place than to retroactively deposit arrears.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Can EPF Section 14B damages be waived?',
      answer: 'Section 14B damages are discretionary - they\'re imposed by the EPFO Regional Provident Fund Commissioner, not automatically computed like Section 7Q interest. In practice, employers who pay overdue contributions and Section 7Q interest promptly and file a representation with a valid reason have sometimes had damages reduced or waived. However, Section 7Q interest itself is mandatory and cannot be waived.',
    },
    {
      question: 'What happens if an employer doesn\'t pay ESIC contributions?',
      answer: 'Failure to register or pay ESIC when mandatory attracts a fine of up to Rs. 10,000 under Section 85 of the ESI Act. Failure to deposit contributions while employees are enrolled can result in ESIC suspending employee access to medical benefits, which exposes you to civil liability from employees. Willful failure to pay can result in criminal prosecution under Section 85A.',
    },
    {
      question: 'Is EPF applicable to employees earning above Rs. 15,000 basic wages?',
      answer: 'EPF is mandatory for employees earning basic wages up to Rs. 15,000 per month. For existing EPF members who get a salary hike above Rs. 15,000, contributions continue on their actual salary (not capped at Rs. 15,000) unless they specifically opt to limit contributions. New employees joining at a salary above Rs. 15,000 basic can choose whether to become EPF members if they weren\'t already enrolled.',
    },
    {
      question: 'How do I pay overdue EPF contributions with interest and damages?',
      answer: 'Log in to the EPFO Unified Portal (unifiedportal-emp.epfindia.gov.in). Generate an EPF challan for the overdue months. Pay the challan amount (your calculated overdue contributions). Contact your regional EPFO office for a Section 7Q interest demand letter, pay the interest, and respond to any Section 14B damages notice. The EPFO inspector may visit for defaults exceeding 2 months.',
    },
    {
      question: 'How do I check pending PF/ESIC dues and damages?',
      answer: 'For PF: Log in to unifiedportal-epfo.epfindia.gov.in, check the Establishment Dashboard for compliance status. For ESIC: Log in to esic.in, go to Employer Portal > View Contribution History. Both portals show outstanding amounts.',
    },
    {
      question: 'Can PF damages under Section 14B be paid in installments?',
      answer: 'Yes, but only with Regional PF Commissioner approval. You must file an application explaining hardship and propose a payment schedule. Interest continues to accrue during the installment period.',
    },
    {
      question: 'What is the difference between PF interest, damages, and penalty?',
      answer: 'Interest is under Section 7Q (12% p.a. on late deposits). Damages are under Section 14B (5% to 25% depending on delay period). Penalty is under Section 14 (up to Rs. 25,000 for non-compliance). All three can apply simultaneously.',
    },
    {
      question: 'What happens to employee PF if employer does not deposit?',
      answer: 'Employee share is always credited to their PF account as it is their salary. Employer share and interest become dues against the establishment. EPFO can attach bank accounts and assets to recover. Criminal prosecution under Section 406 IPC is also possible.',
    },
    {
      question: 'Can I voluntarily register for PF before reaching 20 employees?',
      answer: 'Yes. Under Section 1(4), you can voluntarily register with employee consent. Once registered, you cannot de-register even if employee count drops below 20. This is often done to attract better employees or for government contract eligibility.',
    },
    {
      question: 'Does PF/ESIC non-compliance affect company credit rating?',
      answer: 'Not directly, but it creates contingent liabilities on your balance sheet. Banks may ask for EPFO compliance certificates before sanctioning loans. Unpaid PF dues are a first-charge liability and can affect company valuation during M&A due diligence.',
    },
  ],
  relatedPenalties: [
    { title: 'Professional Tax Penalty', slug: 'professional-tax-penalty', description: 'State-wise interest and penalty for late professional tax payment on employee salaries.' },
    { title: 'TDS Late Filing Penalty', slug: 'tds-late-filing', description: 'Section 234E and 201(1A) penalties for late TDS deposit and quarterly return filing.' },
    { title: 'Shops and Establishment Penalty', slug: 'shops-establishment-penalty', description: 'State-level penalties for non-compliance with Shop Act registration and labour law requirements.' },
  ],
}

// ─────────────────────────────────────────────
// 6. DIRECTOR KYC (DIR-3)
// ─────────────────────────────────────────────
export const directorKycContent: PenaltyPageContent = {
  slug: 'director-kyc',
  intro: {
    title: 'Director KYC (DIR-3 KYC) Penalty Calculator 2024-25',
    description: `If you hold a Director Identification Number (DIN), you must file an annual KYC to keep it active. Introduced by the MCA in 2018, DIR-3 KYC must be filed by 30 September each year. Miss this deadline? You'll pay a flat Rs. 5,000 late fee - no exceptions.

A DIN that isn't KYC-compliant gets marked as "Deactivated due to non-filing of DIR-3 KYC." Once deactivated, you can't use it to authorise or sign any MCA form. This blocks your company's ability to file annual returns, event-based filings, or any regulatory submission. For LLP designated partners, the same rules apply to your DPIN (Designated Partner Identification Number).`,
    keyInfo: [
      { label: 'Annual filing deadline', value: '30 September each year' },
      { label: 'Late fee after 30 September', value: 'Rs. 5,000 flat - cannot be waived' },
      { label: 'Free filing (unchanged details)', value: 'DIR-3 KYC-Web - no fee, no DSC, OTP-based only (if details unchanged from last year)' },
      { label: 'Full form (changed details or first-time)', value: 'DIR-3 KYC form with document uploads and DSC' },
      { label: 'Consequence of non-filing', value: 'DIN marked Deactivated - blocks all MCA filings by that director' },
      { label: 'Applicable to', value: 'All DIN holders including directors of companies, designated partners of LLPs, and DIN holders who aren\'t currently directors' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate DIR-3 KYC Penalty',
    steps: [
      {
        step: 1,
        title: 'Check if DIR-3 KYC was filed by 30 September',
        description: 'Log in to the MCA V3 portal at efiling.mca.gov.in and check your DIN status. If it shows "Deactivated due to non-filing of DIR-3 KYC," the late fee applies.',
      },
      {
        step: 2,
        title: 'Confirm the fee amount',
        description: 'The late fee is a flat Rs. 5,000 regardless of how late you are. Filing 1 day late and filing 300 days late both cost the same Rs. 5,000. There\'s no per-day calculation.',
        formula: 'Late fee = Rs. 5,000 flat (regardless of delay duration)',
      },
      {
        step: 3,
        title: 'Decide between DIR-3 KYC or DIR-3 KYC-Web',
        description: 'If your name, address, mobile, and email registered with MCA are unchanged from last year, use the simpler DIR-3 KYC-Web form (OTP-based, no documents needed). If any details have changed, use the full DIR-3 KYC form with DSC.',
      },
      {
        step: 4,
        title: 'Pay the Rs. 5,000 fee through the MCA portal',
        description: 'The portal prompts for payment before allowing the late KYC submission. Pay via net banking, debit card, or NEFT. The payment reference links to your specific DIN.',
      },
      {
        step: 5,
        title: 'Verify DIN reactivation after successful filing',
        description: 'After filing and fee payment, your DIN status should revert to "Approved." Check DIN status on the MCA portal within 24 hours. Only after reactivation can you sign or authorise any MCA form.',
      },
    ],
    example: {
      scenario: 'A company has 3 directors. Two directors filed DIR-3 KYC before 30 September 2024. The third director missed the deadline and files on 20 November 2024.',
      calculation: 'Flat late fee per deactivated DIN = Rs. 5,000. Only 1 DIN is deactivated. Total fee = Rs. 5,000. Note: The company couldn\'t file MGT-7 (due 28 November) until this DIN was reactivated, potentially causing additional Rs. 100/day MCA late fees on the company\'s annual return.',
      result: 'Total cost: Rs. 5,000 (DIR-3 KYC late fee) + potential Rs. 100/day MCA additional fee on any delayed company filings caused by the deactivated DIN.',
    },
  },
  penaltyBreakdown: {
    title: 'DIR-3 KYC Penalty Structure 2024-25',
    categories: [
      {
        name: 'DIR-3 KYC filed before 30 September (on time)',
        rate: 'Free - Rs. 0',
        cap: 'N/A',
        notes: 'No government fee for timely filing. Available via DIR-3 KYC-Web (if details unchanged) or DIR-3 KYC form.',
      },
      {
        name: 'DIR-3 KYC filed after 30 September (late)',
        rate: 'Rs. 5,000 flat per DIN',
        cap: 'Rs. 5,000 - fee doesn\'t increase with further delay',
        notes: 'Mandatory before the portal accepts the late KYC. Cannot be waived.',
      },
      {
        name: 'Cascading MCA penalty from deactivated DIN',
        rate: 'Rs. 100 per day per MCA form that can\'t be filed due to deactivated DIN',
        cap: 'No cap on cascading MCA additional fees',
        notes: 'Indirect cost - not a DIR-3 penalty itself but a consequence of the deactivated DIN',
      },
      {
        name: 'LLP designated partner DPIN late KYC',
        rate: 'Rs. 5,000 flat per DPIN',
        cap: 'Rs. 5,000 - same rules as DIN',
        notes: 'DPIN deactivation blocks LLP Form 8 and Form 11 filing',
      },
    ],
  },
  financialImpact: {
    title: 'Financial Impact of DIR-3 KYC Non-Filing',
    scenarios: [
      {
        delay: '1 to 30 days late (filed by 31 October)',
        penalty: 'Rs. 5,000 per DIN (flat, same whether 1 day or 30 days late)',
        interest: 'N/A',
        total: 'Rs. 5,000 per director with deactivated DIN',
      },
      {
        delay: '30 to 60 days late (DIN deactivated during peak filing season Oct-Nov)',
        penalty: 'Rs. 5,000 per DIN + potential Rs. 100/day if company\'s MGT-7 is blocked',
        interest: 'N/A',
        total: 'Rs. 5,000 + up to Rs. 3,000 in cascading MCA penalties if MGT-7 is delayed 30 days',
      },
      {
        delay: '60+ days late (company annual filing season blocked)',
        penalty: 'Rs. 5,000 per DIN',
        interest: 'N/A',
        total: 'Rs. 5,000 per DIN + accumulated MCA Rs. 100/day penalties on blocked filings',
      },
      {
        delay: 'Full year non-filing (12 months)',
        penalty: 'Rs. 5,000 per DIN (still flat)',
        interest: 'N/A',
        total: 'Rs. 5,000 per DIN + potentially Rs. 36,500 in cascading MCA penalties on blocked company filings (Rs. 100/day x 365 days x 2 forms)',
      },
    ],
    worstCase: {
      description: 'All directors of a company fail to file DIR-3 KYC. All DINs are deactivated. The company can\'t file its annual returns (AOC-4 and MGT-7). After 2+ years, ROC initiates strike-off proceedings. Directors face Section 164(2) disqualification.',
      amount: 'Rs. 5,000 x number of directors (KYC late fees) + Rs. 100/day on all blocked MCA forms (no cap) + disqualification risk',
    },
  },
  deadlines: {
    title: 'DIR-3 KYC Due Dates',
    dates: [
      { form: 'DIR-3 KYC (first-time filing or changed details)', dueDate: '30 September each year', frequency: 'Annual' },
      { form: 'DIR-3 KYC-Web (unchanged details from previous year)', dueDate: '30 September each year', frequency: 'Annual - simpler web-based form' },
      { form: 'DIN allotment (new directors)', dueDate: 'Through SPICe+ at incorporation or Form DIR-3 separately', frequency: 'One-time' },
      { form: 'Update of director details (name, address, etc.)', dueDate: 'Within 30 days of any change via DIR-6', frequency: 'As applicable' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Rule 12A, Companies (Appointment and Qualification of Directors) Rules 2014', description: 'Mandatory annual DIR-3 KYC filing requirement for all DIN holders' },
      { section: 'Rule 11, Companies (Appointment and Qualification of Directors) Rules 2014', description: 'DIN deactivation for non-compliance with DIR-3 KYC requirement' },
      { section: 'Section 12(9), LLP Act 2008 and LLP Rules', description: 'Annual KYC requirement for LLP designated partners (DPIN holders)' },
    ],
    notifications: [
      { number: 'MCA Notification dated 5 July 2018', summary: 'Introduction of DIR-3 KYC requirement for all DIN holders - original mandate' },
      { number: 'MCA Notification dated 25 February 2019', summary: 'Introduction of DIR-3 KYC-Web form for holders with unchanged details - simplified OTP-based process' },
    ],
  },
  howToAvoid: [
    {
      title: 'File DIR-3 KYC-Web by 15 September if details are unchanged',
      description: 'The DIR-3 KYC-Web form takes about 5 minutes. It requires only mobile OTP and email OTP verification. Filing by 15 September gives a 15-day buffer before the deadline. There\'s no reason to delay when the simpler web form is available.',
    },
    {
      title: 'Update contact details in MCA database before attempting KYC-Web',
      description: 'DIR-3 KYC-Web relies on OTPs sent to the mobile and email registered in the MCA database. If these have changed since last year, you won\'t receive the OTP. Update contact details via the full DIR-3 KYC form with DSC before the September deadline.',
    },
    {
      title: 'Renew your DSC before it expires in August or September',
      description: 'Class 3 DSC certificates have 2-3 year validity. Check the DSC expiry date in July. If it expires before 30 September, renew it immediately. A lapsed DSC blocks the full DIR-3 KYC form submission.',
    },
    {
      title: 'Track KYC compliance for all directors centrally - including independent directors',
      description: 'Companies with independent directors, nominee directors, or additional directors often miss KYC for non-executive directors not involved in daily operations. Assign a Company Secretary or CA to confirm KYC compliance for every DIN holder associated with the company by early September.',
    },
    {
      title: 'File KYC even for DINs not currently in active use',
      description: 'Anyone who was ever allotted a DIN must file annual KYC - even if they\'re no longer an active director of any company. Dormant DIN holders who miss KYC find their DIN deactivated, and if they\'re later appointed as director of a new company, they must first pay Rs. 5,000 to reactivate.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Can the Rs. 5,000 DIR-3 KYC late fee be waived?',
      answer: 'No. The Rs. 5,000 late fee is a mandatory government fee prescribed by MCA rules and cannot be waived by the Registrar, MCA, or any court. The MCA portal requires the fee to be paid before processing the late KYC form. Unlike MCA\'s CFSS schemes that covered annual filings, no amnesty scheme has ever specifically waived DIR-3 KYC late fees.',
    },
    {
      question: 'What happens if I don\'t file DIR-3 KYC at all?',
      answer: 'Your DIN remains deactivated indefinitely. You can\'t sign or authorise any MCA filing. For the company, this means all annual returns, event-based filings (Board resolutions, share allotments, charges), and other forms that need that director\'s DSC signature can\'t be submitted. The company itself may be flagged as a defaulting company if annual filings are blocked.',
    },
    {
      question: 'Is there interest charged on the DIR-3 KYC late fee?',
      answer: 'No, the Rs. 5,000 late fee is a flat charge that doesn\'t attract any interest. It also doesn\'t increase with the duration of delay - the fee is Rs. 5,000 whether you file 1 day late or 2 years late. However, the indirect consequences of a deactivated DIN (blocked company filings) can result in substantial cascading MCA additional fees of Rs. 100 per day with no cap.',
    },
    {
      question: 'How do I file DIR-3 KYC after the 30 September deadline?',
      answer: 'Log in to the MCA V3 portal at efiling.mca.gov.in. Go to e-Filing and select DIR-3 KYC or DIR-3 KYC-Web. The portal will show a message that the Rs. 5,000 late fee is applicable. Pay the fee via the integrated payment gateway. After successful payment, complete the form with OTP (KYC-Web) or DSC (full KYC form). Verify your DIN status is restored to Active within 24-48 hours.',
    },
    {
      question: 'How do I check if my DIN is active or deactivated?',
      answer: 'Go to mca.gov.in > MCA Services > Check Director DIN Status. Enter your DIN to see current status. Active means compliant. Deactivated means DIR-3 KYC is pending. Disqualified means Section 164 action - different from deactivation.',
    },
    {
      question: 'Can I file DIR-3 KYC after my DIN is deactivated?',
      answer: 'Yes. Filing DIR-3 KYC with the Rs. 5,000 late fee reactivates your DIN within 24-48 hours. The deactivation is lifted automatically once MCA processes the form. No separate reactivation application is needed.',
    },
    {
      question: 'If I have multiple DINs (by mistake), which one needs KYC?',
      answer: 'You should not have multiple DINs - this is a compliance issue. Surrender duplicate DINs using Form DIR-5. KYC must be filed for each active DIN you hold. Having multiple active DINs may attract MCA scrutiny.',
    },
    {
      question: 'What if I resigned from all companies - do I still need DIR-3 KYC?',
      answer: 'Yes. DIN is a lifetime identifier regardless of active directorships. Even if you have resigned from all companies, you must file annual KYC. The only way to stop KYC requirement is to surrender DIN using Form DIR-5.',
    },
    {
      question: 'Does DIN deactivation affect my existing directorships?',
      answer: 'Yes. You cannot sign any MCA forms with a deactivated DIN. This blocks the company from filing returns if you are the sole signatory director. Your name still appears in company records, but you cannot perform statutory functions.',
    },
  ],
  relatedPenalties: [
    { title: 'MCA Annual Filing Penalty', slug: 'mca-annual-filing', description: 'Rs. 100/day ROC additional fee for late AOC-4 and MGT-7 filings - often delayed by deactivated DINs.' },
    { title: 'Startup DPIIT Compliance', slug: 'startup-dpiit-compliance', description: 'DPIIT recognition compliance including company filing requirements for startup tax benefits.' },
    { title: 'GST Late Filing Penalty', slug: 'gst-late-filing', description: 'Section 47 CGST Act late fees for GSTR-1 and GSTR-3B return delays.' },
  ],
}

// ─────────────────────────────────────────────
// 7. GST DEMAND NOTICE
// ─────────────────────────────────────────────
export const gstDemandNoticeContent: PenaltyPageContent = {
  slug: 'gst-demand-notice',
  intro: {
    title: 'GST Demand Notice Penalty Calculator 2024-25 (Section 73 and Section 74)',
    description: `When the GST department determines you've underpaid GST, claimed excess ITC, or made return errors, they issue a demand notice. Sections 73 and 74 of the CGST Act govern what happens next. Section 73 applies to genuine errors (no fraud). Section 74 kicks in when the department alleges fraud, willful misstatement, or suppression of facts.

The penalty difference is massive. Under Section 74 (fraud), penalty can hit 100% of the tax demanded - effectively doubling your bill. Even under Section 73 (no fraud), you're looking at a minimum penalty of Rs. 10,000 or 10% of tax. But here's the key: voluntary payment through Form DRC-03 before or shortly after the show-cause notice (SCN) can dramatically reduce the penalty. The department can go back 3 years under Section 73 and 5 years under Section 74.`,
    keyInfo: [
      { label: 'Section 73 (no fraud) - minimum penalty', value: 'Rs. 10,000 or 10% of tax, whichever is higher' },
      { label: 'Section 73 - penalty if paid before SCN', value: '10% of tax or Rs. 10,000 minimum' },
      { label: 'Section 74 (fraud) - penalty if paid within 30 days of SCN', value: '15% of tax demanded' },
      { label: 'Section 74 - penalty after adjudication', value: '100% of tax demanded (you pay double)' },
      { label: 'Interest on delayed GST (Section 50)', value: '18% per annum on unpaid tax from original due date' },
      { label: 'Section 73 lookback period', value: '3 years from the annual return due date for the relevant FY' },
      { label: 'Section 74 lookback period', value: '5 years from the annual return due date for the relevant FY' },
      { label: 'DRC-03 voluntary payment', value: 'Self-admitted payment to reduce penalty - 10-15% penalty applies' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate GST Demand Notice Penalty',
    steps: [
      {
        step: 1,
        title: 'Identify the nature of the demand - Section 73 or Section 74',
        description: 'Check whether the notice alleges fraud, suppression, or willful misstatement (Section 74) or whether it\'s based on a genuine error or interpretation difference (Section 73). The notice will specify which section it\'s issued under. Incorrect classification or over-reporting usually falls under Section 73. Deliberate concealment is Section 74.',
      },
      {
        step: 2,
        title: 'Quantify the tax demand amount',
        description: 'The tax demand is the GST the department claims was underpaid or the ITC that was excess claimed. This is typically specified in the demand notice (ASMT-10 or SCN in Form DRC-01).',
      },
      {
        step: 3,
        title: 'Calculate the applicable penalty percentage',
        description: 'For Section 73: penalty is 10% of tax demanded (minimum Rs. 10,000). For Section 74: penalty is 15% if paid within 30 days of SCN, or 100% if adjudicated.',
        formula: 'Section 73 penalty = MAX(10% of tax demand, Rs. 10,000) | Section 74 penalty (early payment) = 15% of tax demand | Section 74 penalty (post-adjudication) = 100% of tax demand',
      },
      {
        step: 4,
        title: 'Calculate Section 50 interest at 18% per annum',
        description: 'Interest accrues from the date the tax was originally due (the return due date for that period) to the date of actual payment. Apply 18% per annum on the tax demand amount for this period.',
        formula: 'Interest = Tax demand x 18% x (Days from original due date to payment / 365)',
      },
      {
        step: 5,
        title: 'Determine DRC-03 voluntary payment option',
        description: 'If you\'ve received a demand notice but it hasn\'t been adjudicated yet, paying the full tax + interest + 10-15% penalty via DRC-03 closes the matter. This is far cheaper than contesting and losing at adjudication, where Section 74 penalty becomes 100% of tax.',
      },
    ],
    example: {
      scenario: 'Company receives a Section 73 SCN for FY 2022-23 alleging excess ITC claim of Rs. 5,00,000. The notice is issued in September 2024. The original return was filed in December 2022.',
      calculation: 'Tax demand: Rs. 5,00,000. Section 73 penalty: 10% of Rs. 5,00,000 = Rs. 50,000 (above Rs. 10,000 minimum). Interest at 18% p.a. from December 2022 (original due date) to October 2024 (DRC-03 payment date): about 22 months. Interest = Rs. 5,00,000 x 18% x (22/12) = Rs. 1,65,000.',
      result: 'Total via DRC-03: Rs. 5,00,000 (tax) + Rs. 1,65,000 (interest) + Rs. 50,000 (penalty) = Rs. 7,15,000. If contested and lost: penalty jumps to Rs. 5,00,000 (100% under Section 74 if fraud is established), making total Rs. 11,65,000.',
    },
  },
  penaltyBreakdown: {
    title: 'GST Demand Notice Penalty Rates 2024-25',
    categories: [
      {
        name: 'Section 73 - paid before SCN or within 30 days of SCN',
        rate: '10% of tax or Rs. 10,000 minimum',
        cap: 'No cap above the minimum - 10% of any demand amount',
        notes: 'Best outcome for Section 73 cases - pay via DRC-03 before adjudication',
      },
      {
        name: 'Section 73 - after adjudication (post-order)',
        rate: '10% of tax or Rs. 10,000 minimum',
        cap: 'Same as pre-SCN payment - no reduction for delaying',
        notes: 'Unlike Section 74, Section 73 penalty rate doesn\'t escalate after adjudication',
      },
      {
        name: 'Section 74 (fraud) - paid within 30 days of SCN',
        rate: '15% of tax demanded',
        cap: 'No cap - 15% of any demand amount',
        notes: 'Strongly advisable to pay within 30 days if Section 74 applies - saves 85% of potential penalty',
      },
      {
        name: 'Section 74 (fraud) - after adjudication',
        rate: '100% of tax demanded',
        cap: 'No cap - equals the full tax amount again',
        notes: 'Most expensive outcome - doubles total liability vs. paying at SCN stage',
      },
      {
        name: 'Section 50 interest on unpaid GST',
        rate: '18% per annum from original due date to payment',
        cap: 'No cap',
        notes: 'Separate from penalty - applies regardless of which section the demand is under',
      },
      {
        name: 'Additional penalty for incorrect invoice (Section 122)',
        rate: 'Rs. 10,000 or 100% of tax, whichever is higher',
        cap: 'No cap',
        notes: 'Applies specifically for generating false invoices or fraudulent ITC claims',
      },
    ],
  },
  financialImpact: {
    title: 'How Much Will a GST Demand Notice Cost You?',
    scenarios: [
      {
        delay: 'Section 73 - Rs. 1 lakh demand, paid before SCN via DRC-03',
        penalty: 'Rs. 10,000 (10% penalty - equals the Rs. 10,000 minimum)',
        interest: 'Rs. 18,000 (18% p.a. for 12 months on Rs. 1 lakh)',
        total: 'Rs. 1,28,000 total (tax + interest + penalty)',
      },
      {
        delay: 'Section 74 (fraud) - Rs. 1 lakh demand, paid within 30 days of SCN',
        penalty: 'Rs. 15,000 (15% of tax)',
        interest: 'Rs. 27,000 (18% p.a. for 18 months)',
        total: 'Rs. 1,42,000 total - pay within 30 days to avoid 100% penalty',
      },
      {
        delay: 'Section 74 (fraud) - Rs. 1 lakh demand, contested and lost at adjudication',
        penalty: 'Rs. 1,00,000 (100% of tax)',
        interest: 'Rs. 36,000 (18% p.a. for 24 months)',
        total: 'Rs. 2,36,000 - total doubles vs paying at SCN stage',
      },
      {
        delay: 'Section 74 - Rs. 10 lakh demand, adjudicated after 2 years',
        penalty: 'Rs. 10,00,000 (100% of tax)',
        interest: 'Rs. 3,60,000 (18% p.a. for 24 months)',
        total: 'Rs. 23,60,000 - nearly 2.5x the original tax demand',
      },
    ],
    worstCase: {
      description: 'Section 74 fraud case with large demand, contested through all levels, rejected at adjudication. Penalty is 100% of tax + 18% per annum interest from original due date + potential prosecution under Section 132 for fraud.',
      amount: '200% of original tax demand (100% tax + 100% penalty) + 18% p.a. interest with no cap + potential criminal prosecution',
    },
  },
  deadlines: {
    title: 'GST Demand Notice Response Timelines',
    dates: [
      { form: 'Response to ASMT-10 scrutiny notice', dueDate: '15-30 days from notice date (as specified in notice)', frequency: 'As applicable' },
      { form: 'Reply to Show Cause Notice (DRC-01) - Section 73', dueDate: '30 days from SCN date to pay with 10% penalty via DRC-03', frequency: 'As applicable' },
      { form: 'Reply to Show Cause Notice (DRC-01) - Section 74', dueDate: '30 days from SCN date to pay with 15% penalty via DRC-03', frequency: 'As applicable' },
      { form: 'Personal hearing before adjudication', dueDate: 'As scheduled by adjudicating authority (usually 15-30 days post-reply)', frequency: 'As applicable' },
      { form: 'Appeal against adjudication order to Appellate Authority', dueDate: '3 months from order date', frequency: 'As applicable' },
      { form: 'Section 73 - time limit for department to issue demand', dueDate: '3 years from due date of annual return for relevant FY', frequency: 'Lookback period' },
      { form: 'Section 74 - time limit for department to issue demand', dueDate: '5 years from due date of annual return for relevant FY', frequency: 'Lookback period' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Section 73, CGST Act 2017', description: 'Demand for tax not paid or short paid without fraud - 10% penalty, 3-year lookback' },
      { section: 'Section 74, CGST Act 2017', description: 'Demand involving fraud, suppression, or willful misstatement - 100% penalty, 5-year lookback' },
      { section: 'Section 50, CGST Act 2017', description: 'Interest at 18% per annum on delayed GST payment' },
      { section: 'Section 75, CGST Act 2017', description: 'General provisions for determination of tax - including personal hearing rights' },
      { section: 'Section 122, CGST Act 2017', description: 'Penalty for specific offences including false invoicing and fraudulent ITC claims' },
      { section: 'Section 132, CGST Act 2017', description: 'Criminal prosecution for specified offences - imprisonment 1-5 years' },
    ],
    notifications: [
      { number: 'Circular 31/05/2018-GST dated 9 February 2018', summary: 'Clarification on DRC-03 voluntary payment procedure and penalty reduction mechanism' },
    ],
  },
  howToAvoid: [
    {
      title: 'Reconcile GSTR-1, GSTR-3B, and GSTR-2B every month before filing',
      description: 'Most Section 73 demand notices arise from mismatches between outward supplies declared in GSTR-1 and tax paid in GSTR-3B, or ITC claimed in GSTR-3B versus GSTR-2B. Run a three-way reconciliation before filing each return. Correct mismatches in the same period rather than carrying them forward.',
    },
    {
      title: 'Never claim ITC beyond the GSTR-2B eligible credit',
      description: 'Under Rule 36(4), ITC can\'t be claimed beyond the GSTR-2B balance. Claiming ITC against invoices not in GSTR-2B is the single largest trigger for demand notices. Follow up with vendors whose invoices are missing from your GSTR-2B and only claim ITC that\'s fully reflected.',
    },
    {
      title: 'Respond to ASMT-10 scrutiny notices within the deadline with supporting documents',
      description: 'Before a formal SCN, the department typically issues an ASMT-10 pointing out discrepancies. A prompt, well-documented reply at this stage often closes the matter without escalation to Section 73 or 74 proceedings. Ignoring ASMT-10 is the fastest path to a formal demand notice.',
    },
    {
      title: 'Use DRC-03 proactively if you identify a self-assessed error',
      description: 'If you discover an error in a previously filed return (underpaid tax or excess ITC), pay the short amount plus interest voluntarily through Form DRC-03 before the department identifies it. This typically prevents initiation of demand proceedings entirely and avoids any penalty.',
    },
    {
      title: 'Maintain HSN-wise classification records to defend against rate disputes',
      description: 'Classification disputes (wrong HSN code leading to underpayment) are a common basis for demand notices. Maintain a product classification register with legal justification for the HSN codes and tax rates you apply. This documentation forms the basis of your defence in case of scrutiny.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Can a GST demand notice penalty be waived?',
      answer: 'The penalty itself can\'t be waived unilaterally. However, it can be reduced to zero under Section 73 if tax and interest are paid in full before the show-cause notice is issued. Under Section 74, penalty is reduced from 100% to 15% if paid within 30 days of the SCN. Courts have also granted stay on penalties pending appeals where the taxpayer has deposited the tax and interest amount.',
    },
    {
      question: 'What happens if I don\'t respond to a GST show-cause notice?',
      answer: 'If you don\'t respond or appear for the personal hearing, the adjudicating officer passes an ex-parte order determining the demand against you at the maximum penalty rate. For Section 74, this means 100% penalty in addition to full tax and 18% interest. An ex-parte order is much harder to challenge on appeal than a contested adjudication order.',
    },
    {
      question: 'Is there interest on the GST penalty amount itself?',
      answer: 'The 18% interest under Section 50 applies to the unpaid tax amount, not the penalty. The penalty itself doesn\'t attract additional interest. However, if the full demand (tax + interest + penalty) isn\'t paid after an adjudication order, the GST department can initiate recovery proceedings under Section 78, which can include attachment of bank accounts and property.',
    },
    {
      question: 'How do I respond to a GST demand notice?',
      answer: 'Log in to gst.gov.in. Go to Services > User Services > View Notices and Orders. Download the notice (ASMT-10 or DRC-01). Prepare a written reply with supporting documents - purchase invoices, bank statements, GSTR-2B reconciliation, and legal arguments for your position. File the reply through the GST portal within the specified deadline. If paying via DRC-03, generate the DRC-03 challan before filing the reply.',
    },
    {
      question: 'How do I check pending GST demand notices online?',
      answer: 'Log in to gst.gov.in, go to Services > User Services > View Notices and Orders. This shows all notices including ASMT-10 (scrutiny), DRC-01 (demand), and REG-17 (cancellation). You can also check under Dashboard > Pending Actions.',
    },
    {
      question: 'Can I pay GST demand amount in installments?',
      answer: 'Yes. Under Section 80, you can apply for payment in monthly installments (up to 24 months) if you cannot pay the full amount at once. Apply using Form GST DRC-20 with reasons. The officer may approve or reject based on your financial situation.',
    },
    {
      question: 'What is the difference between DRC-01 and DRC-01A notices?',
      answer: 'DRC-01 is a formal show-cause notice requiring response within 30 days. DRC-01A is a pre-notice intimation giving you a chance to pay voluntarily before DRC-01 is issued. Paying during DRC-01A stage attracts lower penalty (typically 10-15%).',
    },
    {
      question: 'Can I appeal a GST demand order - what is the process?',
      answer: 'Yes. File an appeal to the Appellate Authority within 3 months of the order using Form GST APL-01. You must pre-deposit 10% of disputed tax (25% for second appeal to Tribunal). The appeal does not automatically stay recovery - you may need to request a stay separately.',
    },
    {
      question: 'What happens to ITC claims if GST demand is raised against my supplier?',
      answer: 'Your ITC is not automatically reversed, but if your supplier does not pay the demanded tax, you may receive DRC-01B notice for ITC mismatch. You must then either reverse the ITC or provide proof that your supplier has paid. This is why supplier due diligence matters.',
    },
    {
      question: 'Is GST demand notice different from GST audit?',
      answer: 'Yes. GST audit (ASMT-13) is a broader review of records and compliance. Demand notices (Section 73/74) are issued when specific tax shortfall is identified. An audit may or may not result in a demand notice, depending on findings.',
    },
  ],
  relatedPenalties: [
    { title: 'GST Late Filing Penalty', slug: 'gst-late-filing', description: 'Section 47 late fees for delayed GSTR-1, GSTR-3B, and GSTR-9 filing.' },
    { title: 'ITR Late Filing Penalty', slug: 'itr-late-filing', description: 'Section 234F fees for missing income tax return deadlines for individuals and businesses.' },
    { title: 'TDS Late Filing Penalty', slug: 'tds-late-filing', description: 'Section 234E charges for delayed quarterly TDS return filing.' },
  ],
}

// ─────────────────────────────────────────────
// 8. PROFESSIONAL TAX PENALTY
// ─────────────────────────────────────────────
export const professionalTaxPenaltyContent: PenaltyPageContent = {
  slug: 'professional-tax-penalty',
  intro: {
    title: 'Professional Tax Late Payment Penalty Calculator 2024-25',
    description: `Professional Tax (PT) is a state-level tax on income from employment, trade, or profession. Rules, rates, and penalties vary significantly by state. States that levy PT include Maharashtra, Karnataka, West Bengal, Tamil Nadu, Gujarat, Andhra Pradesh, and Telangana. States that don't include Delhi, Rajasthan, Haryana, and Uttar Pradesh.

As an employer, you need a Professional Tax Registration Certificate (PTRC) to deduct PT from employee salaries and a Professional Tax Enrollment Certificate (PTEC) for your own business's PT liability. Pay late and you'll face a penalty (typically 10-50% of outstanding tax) plus simple interest of 1-2% per month depending on your state. Penalties for non-registration are significantly higher.`,
    keyInfo: [
      { label: 'Maximum PT per individual per year (most states)', value: 'Rs. 2,500 per year' },
      { label: 'Maharashtra - monthly PT payment due date', value: 'Last day of the month (for PTRC holders with annual liability > Rs. 1 lakh)' },
      { label: 'Maharashtra - penalty for late payment', value: '10% of PT amount + interest at 1.25% per month' },
      { label: 'Karnataka - interest for late payment', value: '2% per month on outstanding PT' },
      { label: 'West Bengal - interest for late payment', value: '1% per month on outstanding PT' },
      { label: 'Tamil Nadu - interest for late payment', value: '1% per month on outstanding PT' },
      { label: 'Gujarat - interest for late payment', value: '2% per month on outstanding PT' },
      { label: 'States without PT', value: 'Delhi, Rajasthan, Haryana, Uttar Pradesh, Madhya Pradesh, Chhattisgarh, Himachal Pradesh' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate Professional Tax Late Payment Penalty',
    steps: [
      {
        step: 1,
        title: 'Determine your state\'s PT rate and payment cycle',
        description: 'PT rates are state-specific. Maharashtra has a monthly slab system (ranging from Rs. 0 for income below Rs. 7,500 to Rs. 200/month for income above Rs. 10,000). Karnataka has an annual slab system. Check your state\'s PT schedule for the applicable rate.',
      },
      {
        step: 2,
        title: 'Calculate the overdue PT amount',
        description: 'Multiply the number of employees in each salary bracket by the applicable PT rate for that bracket for the overdue period. Add your own PTEC liability if also overdue.',
      },
      {
        step: 3,
        title: 'Count the months of delay',
        description: 'Count the number of months (rounded up to the next full month) from the payment due date to the actual payment date. Most states calculate interest on a monthly basis.',
        formula: 'Months of delay = CEILING((Actual payment date - Due date) / 30)',
      },
      {
        step: 4,
        title: 'Apply your state\'s interest rate',
        description: 'Multiply the overdue PT amount by the monthly interest rate for your state and the number of months of delay.',
        formula: 'Interest = Overdue PT x Monthly interest rate (%) x Months of delay',
      },
      {
        step: 5,
        title: 'Add any flat penalty prescribed by the state',
        description: 'Some states (like Maharashtra) charge a flat penalty percentage in addition to monthly interest. Add this to the interest to get total extra cost.',
        formula: 'Total extra cost = Flat penalty + Monthly interest',
      },
    ],
    example: {
      scenario: 'A company in Maharashtra pays PT for 10 employees (all earning above Rs. 10,000/month) that was due on 30 September 2024. PT is paid on 31 October 2024 - one month late. Monthly PT per employee = Rs. 200. Total PT overdue = Rs. 2,000.',
      calculation: 'Maharashtra penalty: 10% of overdue PT = Rs. 200. Maharashtra interest: Rs. 2,000 x 1.25% x 1 month = Rs. 25. Total extra cost: Rs. 200 + Rs. 25 = Rs. 225 on Rs. 2,000 overdue PT.',
      result: 'Total extra cost: Rs. 225 for one month delay - about 11.25% of the overdue PT amount.',
    },
  },
  penaltyBreakdown: {
    title: 'Professional Tax Penalty Rates by State 2024-25',
    categories: [
      {
        name: 'Maharashtra - penalty + interest',
        rate: '10% flat penalty + 1.25% per month interest',
        cap: 'No cap specified',
        notes: 'Administered under the Maharashtra State Tax on Professions, Trades, Callings and Employments Act, 1975',
      },
      {
        name: 'Karnataka - interest only',
        rate: '2% per month on outstanding PT',
        cap: 'No cap',
        notes: 'Administered under the Karnataka Tax on Professions, Trades, Callings and Employments Act, 1976',
      },
      {
        name: 'West Bengal - interest only',
        rate: '1% per month on outstanding PT',
        cap: 'No cap',
        notes: 'Maximum PT in WB is Rs. 2,400 per year (slightly lower than other states)',
      },
      {
        name: 'Tamil Nadu - interest only',
        rate: '1% per month on outstanding PT',
        cap: 'No cap',
        notes: 'Tamil Nadu also has penalty for non-registration up to Rs. 1,000',
      },
      {
        name: 'Gujarat - interest only',
        rate: '2% per month on outstanding PT',
        cap: 'No cap',
        notes: 'Gujarat also levies a penalty of 10-50% for failure to pay in specified circumstances',
      },
      {
        name: 'Andhra Pradesh and Telangana - interest',
        rate: '1% per month on outstanding PT',
        cap: 'No cap',
        notes: 'Both states follow the AP Professions Tax Act post-bifurcation',
      },
    ],
  },
  financialImpact: {
    title: 'How Much Will Late Professional Tax Cost You?',
    scenarios: [
      {
        delay: '15 days late (Maharashtra - 50 employees, Rs. 10,000/month PT)',
        penalty: 'Flat 10% penalty = Rs. 1,000',
        interest: '1.25% per month = Rs. 125 (for 1 month)',
        total: 'Rs. 1,125 extra cost on Rs. 10,000 overdue PT',
      },
      {
        delay: '30 days late (Karnataka - 50 employees)',
        penalty: 'No flat penalty in Karnataka',
        interest: '2% per month = Rs. 200 on Rs. 10,000 overdue PT',
        total: 'Rs. 200 for 1 month delay - lower penalty state',
      },
      {
        delay: '60 days late (Maharashtra)',
        penalty: 'Flat 10% penalty = Rs. 1,000',
        interest: '1.25% per month x 2 months = Rs. 250 on Rs. 10,000',
        total: 'Rs. 1,250 - flat penalty stays fixed, only interest grows',
      },
      {
        delay: '6+ months late (non-registration penalty)',
        penalty: 'Rs. 5,000 to Rs. 20,000 state-specific non-registration penalty',
        interest: '12-24% annualised on unpaid PT',
        total: 'Non-registration penalties dwarf the PT amount itself for extended periods',
      },
    ],
    worstCase: {
      description: 'Operating without PTRC registration for multiple years, discovered during an inspection. Back-dated PT liability plus non-registration penalty, late payment interest, and potential prosecution under the state PT Act.',
      amount: 'Rs. 2,500 per employee per year x years of non-compliance + non-registration penalty up to Rs. 20,000 + 1-2% per month interest from original due dates',
    },
  },
  deadlines: {
    title: 'Professional Tax Due Dates 2024-25',
    dates: [
      { form: 'Maharashtra PTRC - monthly payment (annual PT liability > Rs. 1 lakh)', dueDate: 'Last day of each month', frequency: 'Monthly' },
      { form: 'Maharashtra PTRC - annual payment (annual PT liability < Rs. 1 lakh)', dueDate: '31 March each year', frequency: 'Annual' },
      { form: 'Karnataka PT - annual return and payment', dueDate: '30 April each year', frequency: 'Annual' },
      { form: 'West Bengal PT - monthly payment', dueDate: '21st of following month', frequency: 'Monthly' },
      { form: 'Tamil Nadu PT - half-yearly return and payment', dueDate: '15 September (Apr-Sep) and 15 March (Oct-Mar)', frequency: 'Half-yearly' },
      { form: 'Gujarat PT - monthly payment', dueDate: '15th of following month', frequency: 'Monthly' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Article 276, Constitution of India', description: 'Constitutional provision allowing states to levy taxes on professions, trades, callings, and employments - maximum Rs. 2,500 per year per person' },
      { section: 'Maharashtra State Tax on Professions, Trades, Callings and Employments Act, 1975', description: 'Governing legislation for PT in Maharashtra including PTRC, PTEC, penalty, and interest provisions' },
      { section: 'Karnataka Tax on Professions, Trades, Callings and Employments Act, 1976', description: 'Governing legislation for PT in Karnataka' },
      { section: 'Section 16(iii), Income Tax Act 1961', description: 'PT paid by employee is deductible from gross salary for income tax computation' },
    ],
  },
  howToAvoid: [
    {
      title: 'Get PTRC and PTEC registrations before starting business',
      description: 'Every employer needs a PTRC before deducting PT from employees and a PTEC for the business\'s own PT liability. Register on your state\'s PT portal before hiring your first employee. Back-dated registration triggers retrospective liability from the date operations began.',
    },
    {
      title: 'Build PT payment into the monthly payroll closure process',
      description: 'PT deduction and remittance should be a non-negotiable step in the monthly payroll cycle - not an afterthought. Configure your payroll software with your state\'s PT slabs and automate deduction calculations. Schedule PT payment by the 10th to allow buffer time.',
    },
    {
      title: 'Track PT slab revisions annually',
      description: 'State PT slabs occasionally change in state budgets. Review your state\'s applicable PT schedule at the start of each financial year to confirm you\'re deducting the correct amounts. Using outdated slabs results in systematic short deductions that accumulate over a full year.',
    },
    {
      title: 'File annual or periodic PT returns separately from payment',
      description: 'Most states require a separate PT return in addition to payment. Failure to file the return is itself a violation, even if payment was made. Check your state\'s PT return filing schedule and confirm both payment and return are completed.',
    },
    {
      title: 'Register for PT in each state where you have employees or offices',
      description: 'PT registration is state-specific. If you have employees in Maharashtra and Karnataka both, you need separate PTRC in each state. Remote employees in PT-levying states trigger that state\'s PT obligation for the employer.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Is professional tax deductible as an expense for income tax?',
      answer: 'Yes. PT paid by an employee is deductible from their gross salary under Section 16(iii) of the Income Tax Act, reducing taxable salary. PT paid by an employer on behalf of the business is deductible as a business expense when computing business income. Self-employed individuals can deduct their own PT payment from business income.',
    },
    {
      question: 'What happens if I operate without a PTRC for several years?',
      answer: 'Operating without PTRC registration when required triggers back-dated PT liability for all years of non-registration, plus non-registration penalties (up to Rs. 20,000 in some states), plus monthly interest on all overdue amounts from original due dates. State tax inspectors conduct periodic surveys and unregistered businesses face immediate demand.',
    },
    {
      question: 'Is professional tax applicable to remote employees working from home?',
      answer: 'PT applicability follows the employee\'s location, not the employer\'s office location. If an employee is based in Karnataka and works remotely for a Mumbai-based company, Karnataka PT rules apply to that employee. The employer must obtain a Karnataka PTRC and comply with Karnataka\'s PT deduction and payment obligations for that employee.',
    },
    {
      question: 'How do I pay professional tax after missing the due date?',
      answer: 'Log in to your state\'s PT portal - e.g., mahagst.maharashtra.gov.in for Maharashtra or pt.kar.nic.in for Karnataka. Generate a challan for the overdue period including the tax amount, applicable penalty, and interest. Pay via the online portal. File the corresponding PT return after payment. Some states allow bank challan payment if the online portal doesn\'t support late payment directly.',
    },
    {
      question: 'How do I check pending professional tax dues online?',
      answer: 'Log in to your state\'s PT portal (varies by state - Maharashtra uses mahagst.maharashtra.gov.in, Karnataka uses pt.kar.nic.in). Check Payment Status or Dues section. Many states also send SMS alerts for pending dues.',
    },
    {
      question: 'Can professional tax penalties be paid in installments?',
      answer: 'Most states do not allow installment payment for PT arrears. The full amount including tax, interest, and penalty must be paid together. However, you can negotiate with the state PT authority in case of extreme hardship.',
    },
    {
      question: 'What is the difference between PTRC and PTEC?',
      answer: 'PTRC (Professional Tax Registration Certificate) is for employers to deduct PT from employee salaries. PTEC (Professional Tax Enrollment Certificate) is for the business owner\'s own PT liability. Most businesses need both - PTRC for employees and PTEC for the proprietor/partners/directors.',
    },
    {
      question: 'Do freelancers and consultants need to pay professional tax?',
      answer: 'Yes, if they work in a state that levies PT and their income exceeds the exemption threshold. Freelancers need PTEC registration in their state. The maximum PT is Rs. 2,500 per year in most states. States like Delhi, UP, Rajasthan do not have professional tax.',
    },
    {
      question: 'What happens if professional tax is deducted but not deposited?',
      answer: 'This is treated seriously by state authorities. You face higher penalties (often double the normal rate), interest on the deducted amount, and potential prosecution under state PT laws. Some states classify this as misappropriation of employee funds.',
    },
    {
      question: 'Does professional tax apply to directors of private limited companies?',
      answer: 'Yes. Directors receiving salary or remuneration are subject to PT deduction by the company (via PTRC). Directors not receiving salary may still need individual PTEC if they have other professional income in the state.',
    },
  ],
  relatedPenalties: [
    { title: 'PF and ESIC Penalty', slug: 'pf-esic-penalty', description: 'Interest and damages for delayed EPF and ESIC contribution payments.' },
    { title: 'Shops and Establishment Penalty', slug: 'shops-establishment-penalty', description: 'State-level penalties for non-registration and non-renewal under the Shop Act.' },
    { title: 'TDS Late Filing Penalty', slug: 'tds-late-filing', description: 'Section 234E fees for delayed quarterly TDS return filing.' },
  ],
}

// ─────────────────────────────────────────────
// 9. SHOPS AND ESTABLISHMENT PENALTY
// ─────────────────────────────────────────────
export const shopsEstablishmentPenaltyContent: PenaltyPageContent = {
  slug: 'shops-establishment-penalty',
  intro: {
    title: 'Shops and Establishment Act Penalty Calculator 2024-25',
    description: `The Shops and Commercial Establishments Act is state-specific legislation governing working conditions, operational hours, employee leave, and mandatory registrations for all commercial establishments including offices, shops, restaurants, hotels, and service providers. Every commercial establishment must register under the applicable state Shop Act within 30 days of starting business.

Penalties for non-registration, late registration, or working condition violations vary by state and range from Rs. 500 to Rs. 20,000 for first offences, with higher penalties for repeat violations. Some states like Maharashtra and Karnataka have introduced permanent registration certificates that don't require annual renewal, while others like Delhi still require annual renewal by 31 December. Non-compliance can affect your ability to claim labour law protections and can result in inspection-triggered closures.`,
    keyInfo: [
      { label: 'Registration deadline from business commencement', value: '30 days (varies by state - some require registration before commencement)' },
      { label: 'Maharashtra', value: 'Permanent registration - no annual renewal required. Penalty up to Rs. 10,000 for non-registration.' },
      { label: 'Delhi', value: 'Annual renewal by 31 December each year. Penalty up to Rs. 10,000 for non-registration or late renewal.' },
      { label: 'Karnataka', value: 'Permanent registration. Penalty of Rs. 500-2,000 for violations.' },
      { label: 'West Bengal', value: 'Annual renewal. Penalty up to Rs. 5,000 for non-registration.' },
      { label: 'Tamil Nadu', value: 'Annual renewal. Penalty up to Rs. 5,000 for first offence.' },
      { label: 'Impact of non-registration', value: 'Cannot claim labour law protections. Employees may not be entitled to ESI, PF, or leave benefits through the establishment.' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate Shop Act Penalty',
    steps: [
      {
        step: 1,
        title: 'Identify your state\'s Shop Act and applicable penalties',
        description: 'Each state has its own Shops and Commercial Establishments Act with different penalty provisions. Identify the governing Act for your state (e.g., Delhi Shops and Establishments Act 1954, Maharashtra Shops and Establishments Act 2017).',
      },
      {
        step: 2,
        title: 'Determine the nature of the violation',
        description: 'Common violations include: (a) non-registration within 30 days of commencement, (b) failure to renew annual registration in renewal states, (c) violation of working hours or weekly off rules, (d) non-maintenance of required registers. Each carries a different penalty.',
      },
      {
        step: 3,
        title: 'Check whether this is a first or repeat offence',
        description: 'Most state Shop Acts prescribe higher penalties for repeat offences. First offence penalties typically range from Rs. 500 to Rs. 10,000. Repeat violations within a defined period attract enhanced penalties of Rs. 10,000 to Rs. 25,000.',
      },
      {
        step: 4,
        title: 'Identify any daily or continuing default penalties',
        description: 'Some states prescribe an additional per-day penalty for continuing defaults. For example, if non-registration continues after a notice is issued, an additional penalty of Rs. 50-200 per day may apply from notice date to registration date.',
        formula: 'Continuing default penalty = Fixed penalty + (Daily rate x Days of continuing default)',
      },
      {
        step: 5,
        title: 'Add any applicable late renewal fees',
        description: 'In states requiring annual renewal, late renewal attracts a surcharge on the normal renewal fee. This varies by state and establishment type.',
      },
    ],
    example: {
      scenario: 'A startup opens an office in Delhi on 1 August 2024 and registers under the Delhi Shops and Establishments Act on 1 November 2024 - 92 days after commencement (should have registered by 31 August 2024).',
      calculation: 'Delay: 62 days past the 30-day registration window. Delhi penalty for late registration (first offence): up to Rs. 5,000 at the inspector\'s discretion. If inspector imposes daily continuing default penalty from notice date: e.g., Rs. 50/day x 30 days (from notice to registration) = Rs. 1,500. Total potential penalty: Rs. 5,000 + Rs. 1,500 = Rs. 6,500.',
      result: 'Total estimated penalty: Rs. 5,000 to Rs. 6,500 depending on inspector discretion and whether a continuing default notice was issued.',
    },
  },
  penaltyBreakdown: {
    title: 'Shop Act Penalty Rates by State 2024-25',
    categories: [
      {
        name: 'Maharashtra - non-registration',
        rate: 'Fine up to Rs. 10,000 for first offence',
        cap: 'Rs. 25,000 for repeat offence',
        notes: 'Permanent registration since 2017 - no annual renewal. Online registration at mahashop.maharashtra.gov.in',
      },
      {
        name: 'Delhi - non-registration or late renewal',
        rate: 'Fine up to Rs. 10,000',
        cap: 'Rs. 20,000 for repeat offence',
        notes: 'Annual renewal by 31 December each year. Registration on Delhi government portal.',
      },
      {
        name: 'Karnataka - violation',
        rate: 'Rs. 500 to Rs. 2,000 per violation',
        cap: 'Rs. 5,000 for repeat offence',
        notes: 'Permanent registration introduced for most establishments',
      },
      {
        name: 'West Bengal - non-registration',
        rate: 'Fine up to Rs. 5,000',
        cap: 'Rs. 10,000 for continuing default',
        notes: 'Annual renewal required. Registration through West Bengal portal.',
      },
      {
        name: 'Tamil Nadu - non-registration',
        rate: 'Fine up to Rs. 5,000 for first offence',
        cap: 'Rs. 10,000 for subsequent offences',
        notes: 'Annual renewal required. Separate registration for each place of business.',
      },
      {
        name: 'Working hours / weekly off violation (all states)',
        rate: 'Rs. 1,000 to Rs. 5,000 per violation per inspector visit',
        cap: 'Varies by state - recurring violations can attract multiple penalties',
        notes: 'Includes violations for excess working hours, insufficient weekly off, child labour, or non-maintenance of registers',
      },
    ],
  },
  financialImpact: {
    title: 'How Much Will Shop Act Violations Cost You?',
    scenarios: [
      {
        delay: '15 days past registration deadline (low-penalty state)',
        penalty: 'Rs. 500 to Rs. 1,000 (inspector discretion, first offence)',
        interest: 'N/A',
        total: 'Rs. 500 to Rs. 1,000 - low risk for minor delays in lenient states',
      },
      {
        delay: '30 days past deadline (Maharashtra or Delhi)',
        penalty: 'Rs. 2,500 to Rs. 5,000 (first offence)',
        interest: 'N/A',
        total: 'Rs. 2,500 to Rs. 5,000 + registration fee',
      },
      {
        delay: '60+ days with inspector visit before registration',
        penalty: 'Rs. 5,000 to Rs. 10,000 (first offence) + daily default penalty from notice date',
        interest: 'N/A',
        total: 'Rs. 5,000 to Rs. 10,000 + Rs. 50-200/day continuing default penalty',
      },
      {
        delay: '12+ months / repeat offence',
        penalty: 'Rs. 10,000 to Rs. 25,000 (repeat offence in most states)',
        interest: 'N/A',
        total: 'Rs. 10,000 to Rs. 25,000 + potential prosecution under state labour law',
      },
    ],
    worstCase: {
      description: 'Business operating for 2+ years without registration in a high-penalty state, discovered during a labour department inspection. Repeat-offence penalties plus back-dated labour law compliance requirements and potential criminal prosecution under the state Act.',
      amount: 'Rs. 25,000 maximum fine + prosecution risk + potential back-dated ESI and PF liability for unregistered employees',
    },
  },
  deadlines: {
    title: 'Shop Act Registration and Renewal Deadlines',
    dates: [
      { form: 'Initial registration (all states)', dueDate: '30 days from date of commencing business', frequency: 'One-time (or before commencement in some states)' },
      { form: 'Delhi - annual renewal', dueDate: '31 December each year', frequency: 'Annual' },
      { form: 'West Bengal - annual renewal', dueDate: '31 December each year', frequency: 'Annual' },
      { form: 'Tamil Nadu - annual renewal', dueDate: '31 December each year (for most categories)', frequency: 'Annual' },
      { form: 'Maharashtra - no renewal needed', dueDate: 'Permanent registration since 2017', frequency: 'One-time' },
      { form: 'Karnataka - no renewal needed', dueDate: 'Permanent registration for most establishments', frequency: 'One-time' },
      { form: 'Update on change of details', dueDate: '15-30 days from change (state-specific)', frequency: 'As applicable' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Delhi Shops and Establishments Act, 1954', description: 'Governing legislation for commercial establishments in Delhi - annual renewal, penalty up to Rs. 20,000' },
      { section: 'Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017', description: 'Updated Maharashtra Shop Act - permanent registration, digital compliance' },
      { section: 'Karnataka Shops and Commercial Establishments Act, 1961', description: 'Governing legislation for Karnataka - covers working hours, leave, termination' },
      { section: 'West Bengal Shops and Establishments Act, 1963', description: 'Annual renewal required. Covers working conditions and registration requirements.' },
    ],
  },
  howToAvoid: [
    {
      title: 'Register within 15 days of starting operations - not 30',
      description: 'The 30-day window is the statutory maximum, not a target. Applying on day 15 gives you time to resolve any document deficiencies before the deadline. Online portals in most states (Maharashtra, Karnataka) process applications within 3-7 working days.',
    },
    {
      title: 'Set a 1 December reminder for annual renewal in renewal states',
      description: 'States like Delhi, West Bengal, and Tamil Nadu require annual renewal by 31 December. A 1 December reminder gives you the entire month to complete renewal. Late renewal in Delhi attracts the same penalty as non-registration.',
    },
    {
      title: 'Update the registration certificate within 15 days of any business change',
      description: 'Changes in address, number of employees, business category, or name must be reported to the registering authority within 15-30 days (state-specific). Operating with an outdated certificate is treated as a separate violation.',
    },
    {
      title: 'Maintain all registers required under the Shop Act',
      description: 'Most state Shop Acts require maintenance of attendance registers, wage registers, leave records, and overtime records. Even if registration is in order, failure to maintain these registers results in separate penalties during inspector visits. Use digital payroll software that generates state-compliant registers automatically.',
    },
    {
      title: 'Verify registration status before opening any new office or branch',
      description: 'Shop Act registration is specific to the establishment address - not the company PAN. Opening a new branch or office in the same or a different state requires a fresh Shop Act registration for that location within 30 days.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Does a home-based or remote-work business need Shop Act registration?',
      answer: 'In most states, Shop Act registration is required for establishments where commercial activity is carried out and employees work. A purely home-based business with no employees and no customer-facing premises typically doesn\'t need Shop Act registration. However, if you employ even one person - including a home-based assistant or delivery person - registration requirements may apply. Check your specific state rules.',
    },
    {
      question: 'What happens if Shop Act registration is not renewed in renewal states?',
      answer: 'Operating with an expired registration is treated the same as operating without registration. In Delhi, the penalty for non-renewal is up to Rs. 10,000 for first offence and Rs. 20,000 for repeat offences. An expired registration can also be flagged during GST department visits, bank KYC renewals, or labour department inspections - all of which can create cascading compliance problems.',
    },
    {
      question: 'Is Shop Act registration different from GST registration?',
      answer: 'Yes, these are entirely separate registrations under different laws. GST registration is with the Central government (GSTN) and relates to indirect tax compliance. Shop Act registration is with the state government\'s Labour Department and relates to labour law and working conditions compliance. Both may be required simultaneously for the same business.',
    },
    {
      question: 'How do I register under the Shop Act after missing the 30-day deadline?',
      answer: 'Most states allow late registration with payment of a penalty. In Maharashtra, visit mahashop.maharashtra.gov.in and apply online - the system processes late applications with the applicable penalty. In Delhi, apply at the SDM office with the penalty payment and an explanation letter. In Karnataka, apply online at labour.karnataka.gov.in. The authority will inspect or verify the premises before granting late registration.',
    },
    {
      question: 'How do I check if my Shop Act registration is valid?',
      answer: 'In states with online portals (Maharashtra, Karnataka, Gujarat), log in to the state labour portal and check your registration status. In other states, check the physical certificate for validity dates or contact the local Labour Inspector office.',
    },
    {
      question: 'Can Shop Act penalty be paid in installments?',
      answer: 'Generally no. Shop Act penalties are typically one-time fees that must be paid in full when registering late or renewing after expiry. The penalty amount is usually fixed based on the period of delay.',
    },
    {
      question: 'What inspections can happen for Shop Act non-compliance?',
      answer: 'Labour inspectors can visit unannounced to check registration, working hours, employee records, leave registers, and working conditions. Non-compliance can result in immediate notice, penalty proceedings, and in repeat cases, prosecution. Banks and landlords may also request Shop Act certificate during KYC.',
    },
    {
      question: 'Do e-commerce and online businesses need Shop Act registration?',
      answer: 'Yes, if they have a physical office or warehouse with employees in the state. The business being online does not exempt you from Shop Act. Registration is based on where employees work, not where customers are located.',
    },
    {
      question: 'What is the difference between Shop Act and Factory Act registration?',
      answer: 'Shop Act covers commercial establishments like offices, shops, restaurants, and service providers. Factory Act covers manufacturing units with 10+ workers (with power) or 20+ workers (without power). Manufacturing businesses may need Factory Act registration instead of or in addition to Shop Act.',
    },
    {
      question: 'Does Shop Act registration affect minimum wage compliance?',
      answer: 'Yes. Registered establishments are expected to comply with state minimum wage laws, which are enforced by the same Labour Department. During Shop Act inspections, labour officers often also verify minimum wage compliance and employee benefit provisions.',
    },
  ],
  relatedPenalties: [
    { title: 'Professional Tax Penalty', slug: 'professional-tax-penalty', description: 'State-level professional tax penalties for employers with registered employees.' },
    { title: 'PF and ESIC Penalty', slug: 'pf-esic-penalty', description: 'EPF and ESIC late payment interest and damages for registered establishments.' },
    { title: 'MCA Annual Filing Penalty', slug: 'mca-annual-filing', description: 'Rs. 100/day ROC additional fee for delayed company annual return filings.' },
  ],
}

// ─────────────────────────────────────────────
// 10. STARTUP DPIIT COMPLIANCE
// ─────────────────────────────────────────────
export const startupDpiitComplianceContent: PenaltyPageContent = {
  slug: 'startup-dpiit-compliance',
  intro: {
    title: 'DPIIT Startup Recognition Compliance Guide 2024-25',
    description: `DPIIT (Department for Promotion of Industry and Internal Trade) recognition grants eligible startups access to significant tax benefits including a 3-year income tax holiday under Section 80-IAC, exemption from angel tax under Section 56(2)(viib), fast-track patent filing, and government procurement preferences. Recognition is obtained through the Startup India portal (startupindia.gov.in) and stays valid as long as you continue to meet eligibility conditions.

Unlike other penalty calculators, DPIIT compliance doesn't have a per-day penalty structure. The consequences are binary - you either retain recognition and all associated benefits, or you lose recognition and are liable to repay claimed tax benefits with interest. Keeping your MCA, GST, and income tax filings current is essential to maintaining recognition status.`,
    keyInfo: [
      { label: 'Eligibility - entity type', value: 'Private Limited Company, LLP, or Registered Partnership Firm' },
      { label: 'Eligibility - age limit', value: 'Not more than 10 years from date of incorporation or registration' },
      { label: 'Eligibility - turnover limit', value: 'Annual turnover must not exceed Rs. 100 crore in any previous year' },
      { label: 'Eligibility - innovation requirement', value: 'Working towards development or improvement of a product, service, or process with innovation or significant employment/wealth creation potential' },
      { label: 'Section 80-IAC tax holiday', value: '100% deduction of profits for any 3 consecutive years out of the first 10 years from incorporation' },
      { label: 'Section 56(2)(viib) angel tax exemption', value: 'DPIIT-recognised startups exempt from angel tax on qualifying investments from SEBI-registered investors and specified categories' },
      { label: 'IMB approval required for 80-IAC', value: 'DPIIT recognition is necessary but not sufficient - separate IMB approval required to claim Section 80-IAC deduction' },
    ],
  },
  howToCalculate: {
    title: 'How to Calculate Cost of Losing DPIIT Recognition',
    steps: [
      {
        step: 1,
        title: 'Calculate the Section 80-IAC tax benefit already claimed',
        description: 'Multiply your startup\'s taxable profit in each year the 80-IAC deduction was claimed by the applicable corporate tax rate (25.17% under Section 115BAA). This is the tax that would have been payable without the deduction - the benefit you received.',
        formula: 'Tax benefit per year = Profit claimed under 80-IAC x 25.17% (effective corporate tax rate)',
      },
      {
        step: 2,
        title: 'Identify any angel tax exemption utilised',
        description: 'If your startup received investment at a premium above Fair Market Value from investors relying on the Section 56(2)(viib) DPIIT exemption, calculate the FMV excess that wasn\'t taxed. If recognition is revoked retroactively, this amount becomes taxable.',
        formula: 'Angel tax exposure = (Investment received - FMV of shares) x 30% effective tax rate',
      },
      {
        step: 3,
        title: 'Estimate interest on retrospective tax liability under Section 234B',
        description: 'If DPIIT recognition is revoked and tax benefits are clawed back, you\'d owe income tax on previously exempt profits plus interest at 1% per month from the end of each relevant assessment year to the date of payment.',
        formula: 'Section 234B interest = Retrospective tax liability x 1% x months from AY end to payment date',
      },
      {
        step: 4,
        title: 'Check ongoing MCA compliance to protect recognition status',
        description: 'DPIIT recognition can be revoked if your company is struck off or in default with MCA. Verify that all annual returns (AOC-4, MGT-7), DIR-3 KYC, and any event-based filings are current. A company flagged as defaulting by ROC is at risk of losing DPIIT recognition.',
      },
      {
        step: 5,
        title: 'Verify continued eligibility each year',
        description: 'Confirm your startup still meets all 4 eligibility conditions annually: entity type, age below 10 years, turnover below Rs. 100 crore, and working on innovation. If turnover crosses Rs. 100 crore in any year, DPIIT recognition eligibility lapses from that year.',
        formula: 'Eligibility check: Entity type + Age < 10 years + Turnover < Rs. 100 crore + Innovation = Active recognition',
      },
    ],
    example: {
      scenario: 'A DPIIT-recognised startup claimed Section 80-IAC deduction for FY 2022-23 (profit Rs. 50 lakhs). DPIIT recognition is later revoked in FY 2024-25 due to turnover crossing Rs. 100 crore.',
      calculation: 'Tax benefit claimed for FY 2022-23: Rs. 50 lakhs x 25.17% = Rs. 12.58 lakhs. Section 234B interest from AY 2023-24 end (31 March 2024) to payment in FY 2024-25: Rs. 12.58 lakhs x 1% x 12 months = Rs. 1.51 lakhs.',
      result: 'Retrospective tax liability: Rs. 12.58 lakhs + Section 234B interest of Rs. 1.51 lakhs = Rs. 14.09 lakhs payable on revocation for that one year of 80-IAC claim.',
    },
  },
  penaltyBreakdown: {
    title: 'DPIIT Recognition - Benefit and Revocation Impact',
    categories: [
      {
        name: 'Section 80-IAC tax holiday',
        rate: '100% deduction on profits for 3 out of first 10 years',
        cap: 'No limit on quantum of profit eligible for deduction',
        notes: 'Requires separate IMB approval in addition to DPIIT recognition. Retroactive revocation requires repayment of tax saved.',
      },
      {
        name: 'Section 56(2)(viib) angel tax exemption',
        rate: 'Full exemption from 30% angel tax on investment above FMV',
        cap: 'No cap - applies to entire above-FMV premium received',
        notes: 'As of 2023, expanded to cover investments from most SEBI-registered investor categories',
      },
      {
        name: 'Retrospective tax on 80-IAC revocation',
        rate: '25.17% corporate tax on previously exempt profits',
        cap: 'No cap - based on actual profits claimed under 80-IAC',
        notes: 'Plus 234B interest at 1% per month from AY end to payment',
      },
      {
        name: 'Angel tax on retroactive revocation',
        rate: '30% on excess premium over FMV',
        cap: 'No cap',
        notes: 'Applies if recognition revoked retroactively to the period of investment',
      },
      {
        name: 'Patent filing benefit',
        rate: '80% rebate on patent filing fees for DPIIT-recognised startups',
        cap: 'Per-patent benefit',
        notes: 'Lost on revocation but already-filed patents retain their filing discount',
      },
    ],
  },
  financialImpact: {
    title: 'Financial Impact of DPIIT Recognition Loss',
    scenarios: [
      {
        delay: 'Turnover crosses Rs. 100 crore - recognition lapses going forward',
        penalty: 'No tax benefit available from year of crossing Rs. 100 crore',
        interest: 'No retrospective liability if only prospective',
        total: 'Lost opportunity cost only - no penalty on past years if recognition was valid when benefits were claimed',
      },
      {
        delay: 'MCA strike-off - recognition likely revoked',
        penalty: 'Loss of 80-IAC deduction + angel tax exemption retroactively',
        interest: 'Section 234B interest at 1% per month on retrospective tax',
        total: 'Full tax liability on all previously exempt profits + 12% per annum interest',
      },
      {
        delay: 'Age limit exceeded (10 years from incorporation)',
        penalty: 'Recognition lapses automatically - no retrospective impact',
        interest: 'N/A',
        total: 'No penalty - recognition simply doesn\'t renew. Benefits already validly claimed are retained.',
      },
      {
        delay: 'IMB approval not obtained within 10 years',
        penalty: 'Section 80-IAC deduction cannot be claimed even if DPIIT recognised',
        interest: 'N/A',
        total: 'Lost tax benefit of Rs. X lakhs per year that could have been deducted - pure opportunity cost',
      },
    ],
    worstCase: {
      description: 'Startup with DPIIT recognition loses it retroactively due to misrepresentation in the recognition application. All Section 80-IAC deductions and angel tax exemptions are reversed, with interest.',
      amount: 'Full corporate tax on all previously exempt profits at 25.17% + Section 234B interest at 1% per month + potential angel tax at 30% on all investments received under exemption',
    },
  },
  deadlines: {
    title: 'DPIIT Startup Compliance Key Dates',
    dates: [
      { form: 'DPIIT recognition application (Startup India portal)', dueDate: 'Before the startup\'s 10th year from incorporation', frequency: 'One-time' },
      { form: 'IMB approval for Section 80-IAC (Form 1 to DIPP)', dueDate: 'Apply before the relevant AY in which you want to claim the deduction', frequency: 'Once in eligible lifetime' },
      { form: 'Company AOC-4 (financial statements)', dueDate: '29 October 2024 (30 days after AGM on 30 Sep)', frequency: 'Annual - critical for maintaining recognition' },
      { form: 'Company MGT-7 (annual return)', dueDate: '28 November 2024', frequency: 'Annual' },
      { form: 'Income tax return (non-audit companies)', dueDate: '31 July 2025 for FY 2024-25', frequency: 'Annual' },
      { form: 'GST returns (if registered)', dueDate: '11th / 20th of each month depending on return type', frequency: 'Monthly / Quarterly' },
      { form: 'DIR-3 KYC for all directors', dueDate: '30 September each year', frequency: 'Annual' },
      { form: 'Annual self-certification on Startup India portal', dueDate: 'Review portal for any annual update requirement', frequency: 'Annual' },
    ],
  },
  legalReferences: {
    sections: [
      { section: 'Section 80-IAC, Income Tax Act 1961', description: '100% profit deduction for DPIIT-recognised startups for 3 consecutive years out of first 10 years - requires IMB approval' },
      { section: 'Section 56(2)(viib), Income Tax Act 1961', description: 'Angel tax provision - investments above FMV taxable in startup\'s hands. DPIIT-recognised startups exempt under specified conditions' },
      { section: 'Notification G.S.R. 127(E) dated 19 February 2019', description: 'DPIIT notification defining eligibility criteria for startup recognition - entity type, age, turnover, innovation requirement' },
      { section: 'Section 234B, Income Tax Act 1961', description: 'Interest for default in advance tax payment - applicable if retrospective tax is triggered on recognition revocation' },
    ],
    notifications: [
      { number: 'DPIIT Notification dated 11 April 2023', summary: 'Updated angel tax exemption framework - expanded eligible investor categories to include SEBI-registered FPIs, VCFs, and specified non-resident investors' },
      { number: 'CBDT Circular 16/2024 dated 1 October 2024', summary: 'Guidance on angel tax valuation methods and documentation requirements for DPIIT-exempt investments' },
      { number: 'IMB Process Note dated January 2019', summary: 'Clarification that DPIIT recognition alone doesn\'t grant Section 80-IAC benefit - separate IMB approval required' },
    ],
  },
  howToAvoid: [
    {
      title: 'Apply for DPIIT recognition as early as possible - ideally within year 1',
      description: 'DPIIT recognition has no cost and the application takes 2-5 working days on the Startup India portal. Applying early maximises the years available for Section 80-IAC deduction and ensures angel tax exemption is available from your first funding round.',
    },
    {
      title: 'Apply for IMB approval for Section 80-IAC separately and proactively',
      description: 'DPIIT recognition isn\'t the same as Section 80-IAC approval. The Inter-Ministerial Board (IMB) must separately evaluate and approve your 80-IAC application. Apply during the first profitable year to maximise the 3-year deduction window. The IMB application is through DIPP and is more detailed than the DPIIT recognition application.',
    },
    {
      title: 'Maintain all MCA, GST, and income tax filings meticulously',
      description: 'A company that is struck off or flagged as defaulting by MCA is at immediate risk of DPIIT recognition revocation. A GST registration that\'s suspended or cancelled also signals non-compliance. Keep all regulatory filings current - the cost of a CA managing these is tiny relative to the value of 80-IAC and angel tax benefits.',
    },
    {
      title: 'Disclose DPIIT recognition number in all investment term sheets and agreements',
      description: 'The angel tax exemption under Section 56(2)(viib) requires the startup to be DPIIT-recognised at the time of receiving the investment. Include your DPIIT recognition number in every investment round\'s term sheet and ensure investors verify active status on the Startup India portal before funds are transferred.',
    },
    {
      title: 'Monitor the Rs. 100 crore turnover threshold and age limit each year',
      description: 'DPIIT recognition ceases to apply from the year turnover crosses Rs. 100 crore or when the startup completes 10 years. There\'s no automatic notification - you must self-monitor. Once either limit is crossed, stop claiming Section 80-IAC for that year and inform your tax consultant immediately.',
    },
  ],
  additionalFaqs: [
    {
      question: 'Does DPIIT recognition automatically grant the Section 80-IAC tax holiday?',
      answer: 'No. DPIIT recognition is a prerequisite but not sufficient for claiming Section 80-IAC. You must separately apply to and obtain approval from the Inter-Ministerial Board (IMB) constituted under DPIIT. IMB evaluates whether your startup genuinely meets the innovation and scalability criteria. Without IMB approval, the 80-IAC deduction cannot be claimed even with valid DPIIT recognition.',
    },
    {
      question: 'Can the angel tax exemption be lost if DPIIT recognition is revoked?',
      answer: 'If DPIIT recognition is revoked retroactively (e.g., for misrepresentation in the application), investments received during the recognition period may be reassessed for angel tax under Section 56(2)(viib). You\'d then owe 30% tax on the excess of investment amount over FMV, plus interest and penalties. This is why maintaining genuine compliance with all DPIIT eligibility conditions is critical.',
    },
    {
      question: 'What is the interest on retrospective tax demand if DPIIT recognition is revoked?',
      answer: 'If DPIIT recognition is revoked and income tax authorities reassess previously exempt years, interest under Section 234B applies at 1% per month from the end of each relevant assessment year to the date of actual payment. For a startup that claimed Rs. 1 crore in 80-IAC deductions over 3 years and had recognition revoked 2 years later, the interest alone can amount to Rs. 24-36 lakhs at 25.17% effective tax rate.',
    },
    {
      question: 'How do I apply for DPIIT startup recognition?',
      answer: 'Visit startupindia.gov.in and log in or register. Go to Recognition and start the application. You\'ll need to provide incorporation documents, a description of your business innovation, and certify that your entity meets the eligibility criteria (age, turnover, entity type). Recognition is typically granted within 2-5 working days. There\'s no government fee. After recognition, download your certificate and DPIIT number, and separately file for IMB approval for Section 80-IAC if you wish to claim the tax holiday.',
    },
    {
      question: 'How do I check my DPIIT recognition status?',
      answer: 'Log in to startupindia.gov.in with your registered email. Go to Dashboard > My Recognitions. This shows your recognition certificate, DPIIT number, and validity. You can also download your certificate from here.',
    },
    {
      question: 'What compliance is needed to maintain DPIIT recognition?',
      answer: 'Keep your MCA filings current (AOC-4, MGT-7), file ITR on time, maintain turnover below Rs. 100 crore, ensure the entity remains less than 10 years old, and do not restructure into a non-eligible entity type. Any material misrepresentation in the original application can also trigger revocation.',
    },
    {
      question: 'Can a company lose DPIIT recognition after crossing 10 years?',
      answer: 'Yes. Once your company is more than 10 years old from incorporation, it ceases to be a "startup" under DPIIT definition. Recognition expires automatically. However, tax benefits already claimed in eligible years are not reversed merely due to aging out.',
    },
    {
      question: 'What happens to Section 80-IAC benefits if turnover crosses Rs. 100 crore?',
      answer: 'Once annual turnover exceeds Rs. 100 crore, the startup loses DPIIT eligibility from that year onwards. Any remaining Section 80-IAC benefit years are forfeited. Benefits already claimed in years when turnover was under Rs. 100 crore are not reversed.',
    },
    {
      question: 'Can LLPs get DPIIT recognition and Section 80-IAC benefits?',
      answer: 'LLPs are eligible for DPIIT recognition. However, Section 80-IAC tax holiday is only available to Private Limited Companies and LLPs. The angel tax exemption under Section 56(2)(viib) does not apply to LLPs as they do not issue shares.',
    },
    {
      question: 'How long does IMB approval take for Section 80-IAC?',
      answer: 'IMB review typically takes 30-60 days after application. The board meets periodically to review applications. Approval is not automatic - many applications are rejected for insufficient innovation evidence. Having DPIIT recognition significantly strengthens your IMB application.',
    },
  ],
  relatedPenalties: [
    { title: 'MCA Annual Filing Penalty', slug: 'mca-annual-filing', description: 'Rs. 100/day ROC additional fee for delayed AOC-4 and MGT-7 - critical to maintain for DPIIT recognition.' },
    { title: 'Director KYC Penalty', slug: 'director-kyc', description: 'Rs. 5,000 penalty for late DIR-3 KYC - DIN deactivation blocks MCA filings needed for DPIIT compliance.' },
    { title: 'ITR Late Filing Penalty', slug: 'itr-late-filing', description: 'Section 234F fee for companies missing income tax return deadlines - a filing default that can affect DPIIT recognition.' },
  ],
}

// ─────────────────────────────────────────────
// EXPORT MAP AND HELPER FUNCTION
// ─────────────────────────────────────────────
export const penaltyContent: Record<string, PenaltyPageContent> = {
  'gst-late-filing': gstLateFilingContent,
  'itr-late-filing': itrLateFilingContent,
  'tds-late-filing': tdsLateFilingContent,
  'mca-annual-filing': mcaAnnualFilingContent,
  'pf-esic-penalty': pfEsicPenaltyContent,
  'director-kyc': directorKycContent,
  'gst-demand-notice': gstDemandNoticeContent,
  'professional-tax-penalty': professionalTaxPenaltyContent,
  'shops-establishment-penalty': shopsEstablishmentPenaltyContent,
  'startup-dpiit-compliance': startupDpiitComplianceContent,
}

export function getPenaltyContent(slug: string): PenaltyPageContent | null {
  return penaltyContent[slug] || null
}
