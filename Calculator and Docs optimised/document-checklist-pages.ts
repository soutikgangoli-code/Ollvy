import type { ToolPageConfig } from './types'

// ─── 1. Pvt Ltd Documents Checklist ──────────────────────────────────────────

export const pvtLtdChecklistPage: ToolPageConfig = {
  slug: 'private-limited-company',
  title: 'Documents Required for Private Limited Company Registration',
  seoTitle: 'Documents Required for Pvt Ltd Registration India 2025 | Complete List | Ollvy',
  seoDescription: 'Complete document checklist for Private Limited Company registration in India. PAN, Aadhaar, address proof, DSC, MOA/AOA. Download and verify before filing.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/private-limited-company',
  lastReviewed: 'April 2026',
  category: 'Incorporation',
  relatedServiceSlug: 'pvt-ltd-incorporation',
  relatedServiceLabel: 'Register Your Pvt Ltd Company',
  relatedCalculatorSlugs: ['mca-annual-filing', 'director-kyc'],
  relatedLearnSlug: 'pvt-ltd-vs-llp',

  intro: `Registering a Private Limited Company requires documents from all directors and shareholders, plus proof of the registered office address. Missing or mismatched documents are the most common cause of delays and MCA rejections - getting everything right before filing saves weeks.

The key documents are PAN and Aadhaar for all directors (the names must match exactly across both), address proof not older than 2 months, a registered office address with a utility bill, and an NOC from the property owner if the premises is rented. For the company itself, you need to decide on the proposed name (3 options recommended) and the business activities - these determine how the MOA is drafted.

DSC (Digital Signature Certificate) is required for all directors and is arranged as part of the incorporation process. It requires video verification and takes 2-3 working days. DIN (Director Identification Number) is included in the SPICe+ filing - no separate application needed.

Use this checklist to verify every document before submission. A single mismatch between the name on PAN and the name on Aadhaar will cause MCA to raise a query, adding 5-7 days to the timeline.`,

  howToUse: `**Name consistency is critical.** The name on your PAN must match the name on your Aadhaar exactly. If there is even a minor variation (middle name, initials), it will cause a query. Resolve this before starting the process.

**Address proof must be recent.** Bank statements and utility bills must not be older than 2 months from the date of filing. Check the date on the document, not when you downloaded it.

**Registered office:** A residential address is fully legal as a registered office. You need either the electricity bill in the director's name, or the property owner's electricity bill plus a NOC from them.

**Check each document:** Use the checklist below to verify every item is ready before uploading. Documents cannot be partially uploaded and completed later.`,

  faqs: [
    {
      q: 'Can I use my home address as the registered office for a Pvt Ltd company?',
      a: 'Yes. A residential address is fully legal as a registered office under the Companies Act. You need an electricity bill for that address and, if you are a tenant, a No Objection Certificate (NOC) from the property owner.',
    },
    {
      q: 'What if the name on PAN and Aadhaar are different?',
      a: 'MCA will raise a query and the application will stall until the mismatch is resolved. You need to update either your PAN (through the income tax portal) or your Aadhaar (at an enrolment centre) to make them match before filing.',
    },
    {
      q: 'Do I need a separate DIN application before filing for incorporation?',
      a: 'No. Director Identification Number is included in the SPICe+ incorporation form and is applied for simultaneously. You do not need a separate DIR-3 application. Only directors who already have a DIN from a previous directorship need to provide their existing DIN.',
    },
    {
      q: 'What documents does a foreign national director need?',
      a: 'Passport (notarised and apostilled if from a foreign country), overseas address proof notarised by a notary public, and a photograph. The foreign director must also complete DSC video verification. At least one director must be an Indian resident.',
    },
    {
      q: 'How recent must the address proof be?',
      a: 'Bank statements and utility bills must not be older than 2 months from the date of filing. This is a strict requirement. If you are filing in April, documents dated before February will be rejected.',
    },
  ],
}


// ─── 2. LLP Documents Checklist ───────────────────────────────────────────────

export const llpChecklistPage: ToolPageConfig = {
  slug: 'llp',
  title: 'Documents Required for LLP Registration',
  seoTitle: 'Documents Required for LLP Registration India 2025 | Complete List | Ollvy',
  seoDescription: 'Complete document checklist for LLP registration in India. DPIN, DSC, LLP Agreement, PAN for all designated partners. Download and verify before filing.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/llp',
  lastReviewed: 'April 2026',
  category: 'Incorporation',
  relatedServiceSlug: 'llp-incorporation',
  relatedServiceLabel: 'Register Your LLP',
  relatedCalculatorSlugs: ['mca-annual-filing'],
  relatedLearnSlug: 'pvt-ltd-vs-llp',

  intro: `LLP registration through the FiLLiP form requires PAN, Aadhaar, and address proof from all designated partners, plus the registered office address proof. The process is similar to Pvt Ltd incorporation but uses different forms and has some key differences.

The most important document unique to LLP is the LLP Agreement itself. Unlike a Pvt Ltd where MOA and AOA have standard formats, the LLP Agreement must reflect the actual arrangement between partners - profit-sharing ratios, roles, capital contribution, and exit terms. A generic 50-50 agreement for partners with unequal contributions or different responsibilities is a common source of later disputes.

DPIN (Designated Partner Identification Number) is the LLP equivalent of DIN. It is applied for as part of FiLLiP and does not require a separate application. DSC (Digital Signature Certificate) is required for all designated partners and takes 2-3 working days with video verification.

The stamp duty on the LLP Agreement varies by state - higher capital contributions attract higher stamp duty. The agreement must be stamped before it can be used as a valid document in MCA filings.`,

  howToUse: `**LLP Agreement is custom:** Do not use a generic template. The agreement must specify exact capital contribution amounts, profit-sharing percentages, decision-making rights, and exit terms for each partner. Vague terms lead to disputes.

**Minimum 2 designated partners:** At least 2 designated partners are required and both must be individuals. At least one must be a resident Indian (present in India for 182+ days in the previous financial year).

**Stamp duty:** The LLP Agreement must be printed on stamp paper. The stamp duty amount depends on your state and the total capital contribution. Check your state's stamp duty schedule before printing.

**Capital contribution:** Decide the exact amount each partner is contributing and in what form (cash, assets). This goes into the LLP Agreement and the FiLLiP form.`,

  faqs: [
    {
      q: 'How many designated partners are required for an LLP?',
      a: 'Minimum 2 designated partners, both of whom must be individuals (not companies). At least one must be a resident Indian. There is no maximum number of partners in an LLP.',
    },
    {
      q: 'What is DPIN and is it different from DIN?',
      a: 'DPIN (Designated Partner Identification Number) is the LLP equivalent of DIN (Director Identification Number) for companies. They serve the same purpose but are separate numbers. A person who already has a DIN from a company directorship can use it as their DPIN in an LLP.',
    },
    {
      q: 'Does an LLP need stamp duty on the LLP Agreement?',
      a: 'Yes. The LLP Agreement must be printed on stamp paper and stamped according to your state\'s stamp duty schedule. Stamp duty varies by state and is typically based on the total capital contribution amount. An unstamped agreement cannot be used as evidence in court.',
    },
    {
      q: 'What is the minimum capital required for an LLP?',
      a: 'There is no legal minimum capital requirement for an LLP. Partners can contribute as little or as much as they decide. The capital contribution amount affects the FiLLiP filing fee (based on contribution slabs).',
    },
    {
      q: 'Can a company be a partner in an LLP?',
      a: 'Yes. A body corporate (including a Pvt Ltd company) can be a partner in an LLP, though not a designated partner. Designated partners must be individuals.',
    },
  ],
}


// ─── 3. GST Registration Documents Checklist ─────────────────────────────────

export const gstChecklistPage: ToolPageConfig = {
  slug: 'gst-registration',
  title: 'Documents Required for GST Registration',
  seoTitle: 'Documents Required for GST Registration India 2025 | Complete Checklist | Ollvy',
  seoDescription: 'Complete GST registration document checklist by business type - sole proprietor, Pvt Ltd, LLP, partnership. PAN, Aadhaar, address proof, bank details.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/gst-registration',
  lastReviewed: 'April 2026',
  category: 'GST',
  relatedServiceSlug: 'gst-registration',
  relatedServiceLabel: 'Get GST Registration',
  relatedCalculatorSlugs: ['gst-late-filing'],
  relatedLearnSlug: 'do-i-need-gst-registration',

  intro: `GST registration through GST REG-01 requires different documents depending on your business structure. The most common reason for delay or rejection is an address mismatch - the address on your electricity bill must match your application exactly, including floor, area, and PIN code.

For sole proprietors, you need personal PAN, Aadhaar (with active mobile for OTP), a business address proof, and a cancelled cheque or bank statement. For Pvt Ltd companies and LLPs, you additionally need the Certificate of Incorporation, all director PANs, and a board resolution authorising the filing.

Aadhaar-based authentication is mandatory for most applicants. The OTP is sent to the mobile number linked to Aadhaar at the time of filing. If that mobile is old, inactive, or changed, the OTP cannot be received and the application cannot proceed. Verify your Aadhaar-linked mobile before starting.

The address proof must be a recent electricity bill (not older than 2 months). If the property is rented, you additionally need a No Objection Certificate (NOC) from the property owner. If the property is owned, the electricity bill or property tax receipt suffices.`,

  howToUse: `**Select your business type** from the checklist to see the exact documents required. Sole proprietor requirements differ significantly from company requirements.

**Address consistency:** The business address on your electricity bill, your application, and any other documents must be identical - building name, floor, area, city, and PIN. Even minor variations cause queries.

**Format requirements:** All documents must be uploaded in JPG or PDF format. Size limits apply: photos must be under 100KB, other documents under 1MB. Use a scanner or scan app - phone photos are often too large.

**Aadhaar OTP:** The OTP is sent to the Aadhaar-linked mobile during the filing process. This cannot be pre-arranged - your phone must be available during the actual filing session.`,

  faqs: [
    {
      q: 'What is the most common reason for GST registration rejection?',
      a: 'Address mismatch. The address on the electricity bill must match the application exactly. Other common reasons: Aadhaar mobile OTP failure (inactive linked mobile), blurry or low-quality scans, and file size exceeding the portal limit.',
    },
    {
      q: 'Can I use a rented address for GST registration?',
      a: 'Yes. For rented premises, you need the electricity bill (which can be in the landlord\'s name) plus a No Objection Certificate (NOC) from the property owner stating they consent to the premises being used as your business address.',
    },
    {
      q: 'What bank account proof is accepted for GST registration?',
      a: 'A cancelled cheque or the first and last page of your bank passbook, or a bank statement showing your account number, IFSC, and branch details. The account must be in the business name (or proprietor\'s name for sole proprietors).',
    },
    {
      q: 'Does GST registration require a digital signature?',
      a: 'For companies and LLPs: yes, a DSC is required to sign the application. For sole proprietors and partnership firms: no DSC required - Aadhaar-based OTP authentication is used instead.',
    },
    {
      q: 'How long does the GST registration process take?',
      a: '7 working days from document submission if all documents are correct and no officer query is raised. Officers raise queries in approximately 20% of cases, typically for address verification or Aadhaar authentication issues, adding 3-5 days.',
    },
  ],
}


// ─── 4. Trademark Documents Checklist ────────────────────────────────────────

export const trademarkChecklistPage: ToolPageConfig = {
  slug: 'trademark',
  title: 'Documents Required for Trademark Registration',
  seoTitle: 'Documents Required for Trademark Registration India 2025 | IP India | Ollvy',
  seoDescription: 'Complete document checklist for trademark registration in India. Logo file specifications, applicant documents, MSME certificate for reduced fees.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/trademark',
  lastReviewed: 'April 2026',
  category: 'Trademark',
  relatedServiceSlug: 'trademark-registration',
  relatedServiceLabel: 'Register Your Trademark',
  relatedCalculatorSlugs: [],
  relatedLearnSlug: 'do-i-need-trademark-registration',

  intro: `Trademark registration with the IP India Trademark Registry requires fewer documents than most government filings - primarily proof of identity for the applicant and the mark itself. The most technically specific requirement is the logo file format if you are registering a device mark (logo).

Logo files must be in JPG format, minimum 8cm x 8cm at 300 DPI, with the mark in black on a white background. Colour marks can be registered but a black-and-white representation is still required for the application. The logo quality matters - a pixelated or low-resolution image will cause the Registry to raise an objection.

For small entities and individuals, an MSME (Udyam) certificate or DPIIT Startup Recognition certificate entitles you to the reduced government fee of Rs. 4,500 per class instead of Rs. 9,000. This certificate must be in your name or your company's name - a CA's certificate or generic business registration does not qualify.

If you want to claim prior use (that you have been using the mark before the filing date), an affidavit stating the date of first use in commerce in India is required. This is optional but strengthens your application, particularly if someone else has been using a similar mark.`,

  howToUse: `**Class selection:** Decide which trademark classes to file in before starting. The government fee is per class - filing in the wrong class leaves you unprotected in your actual business category. Most businesses need 1-3 classes. Check the Nice Classification list or ask an attorney.

**Logo specifications:** If filing a device mark (logo), prepare the file in advance: JPG format, minimum 8cm x 8cm, 300 DPI, black mark on white background. Do not use a transparent background.

**Small entity fee:** If you qualify as an individual, startup (DPIIT recognised), or MSME (Udyam registered), the government fee is Rs. 4,500 per class instead of Rs. 9,000. Have your Udyam or DPIIT certificate ready.

**Power of Attorney:** If a trademark attorney is filing on your behalf (which is the standard practice), a Power of Attorney (TM-48) authorising them is required. This is typically arranged by the attorney.`,

  faqs: [
    {
      q: 'What logo file format is required for trademark registration?',
      a: 'JPG format, minimum 8cm x 8cm at 300 DPI resolution, mark in black on a white background. The Trademark Registry will object to low-resolution images, transparent backgrounds, or formats other than JPG.',
    },
    {
      q: 'What documents does a company need for trademark registration?',
      a: 'Certificate of Incorporation (or LLP Agreement for LLPs), board resolution or Power of Attorney authorising the filing, and PAN or Aadhaar of the authorised signatory. For reduced fees, the Udyam certificate or DPIIT recognition certificate.',
    },
    {
      q: 'Can I get the Rs. 4,500 government fee as a Pvt Ltd company?',
      a: 'Yes, if your company has a valid Udyam Registration (MSME) certificate or DPIIT Startup Recognition certificate. The company must be the applicant - the reduced fee applies to the entity, not the individual filing it.',
    },
    {
      q: 'Is a user affidavit required for trademark registration?',
      a: 'Only if you want to claim a prior use date earlier than the filing date. It is optional. If you have been using the mark in commerce before filing, an affidavit stating the date of first use strengthens your application but is not mandatory for filing.',
    },
    {
      q: 'What is a Power of Attorney in trademark filing?',
      a: 'TM-48 is a Power of Attorney authorising your trademark attorney or agent to file and prosecute the application on your behalf. It is standard practice to use an attorney for trademark filings. The POA must be signed by the applicant (individual) or an authorised signatory (company).',
    },
  ],
}


// ─── 5. Individual ITR Documents Checklist ────────────────────────────────────

export const individualItrChecklistPage: ToolPageConfig = {
  slug: 'individual-itr',
  title: 'Documents Required for Individual ITR Filing',
  seoTitle: 'Documents Required for ITR Filing India 2025 | Salaried & Freelancer | Ollvy',
  seoDescription: 'Complete document checklist for individual income tax return filing. Form 16, Form 26AS, AIS, bank statements, investment proofs. FY 2024-25.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/individual-itr',
  lastReviewed: 'April 2026',
  category: 'Tax',
  relatedServiceSlug: 'business-itr',
  relatedServiceLabel: 'File Your ITR',
  relatedCalculatorSlugs: ['itr-late-filing'],
  relatedLearnSlug: 'do-i-need-to-file-itr',

  intro: `Filing an individual income tax return for FY 2024-25 requires gathering documents from multiple sources - your employer, your bank, and various investment platforms. Missing even one document (like a Form 26AS showing TDS that was not declared) can lead to a notice asking you to explain the discrepancy.

The two most important documents are Form 16 (from your employer, if salaried) and Form 26AS / AIS (Annual Information Statement, available on the income tax portal). Form 26AS shows all TDS deducted against your PAN - every employer, bank, and party who deducted tax from your payments. AIS goes further, showing all financial transactions linked to your PAN including securities sales, property purchases, and foreign remittances.

Always reconcile Form 26AS and AIS against your own records before filing. If a figure appears in Form 26AS that you did not declare, the system will flag it automatically and a notice may follow. It is far easier to address discrepancies at the filing stage than after.

For freelancers and self-employed individuals, invoices and bank statements showing business income are also required, along with any advance tax challan receipts.`,

  howToUse: `**Start with AIS:** Download your Annual Information Statement from the income tax portal (incometax.gov.in > AIS/TIS). Review every entry. If something is wrong, you can provide feedback on the portal.

**Form 16 by June 15:** Employers must issue Form 16 by June 15. If you have not received it by then, follow up with your HR or payroll team.

**Multiple employers:** If you changed jobs during the year, you need Form 16 from each employer. Combine the income from both in your ITR.

**Check HRA carefully:** If you claimed HRA exemption, ensure your rent receipts match the amount claimed and the landlord's PAN is provided (mandatory if annual rent exceeds Rs. 1 lakh).`,

  faqs: [
    {
      q: 'What is Form 26AS and why is it important?',
      a: 'Form 26AS is the consolidated tax credit statement showing all TDS deducted against your PAN by employers, banks, and other payers. The income tax department compares what you declare in your ITR against Form 26AS. Any discrepancy can trigger an automated notice.',
    },
    {
      q: 'What is AIS (Annual Information Statement)?',
      a: 'AIS is a comprehensive statement of all financial transactions linked to your PAN - salary, interest, dividends, securities sales, property transactions, GST turnover, and more. It is more detailed than Form 26AS. Available on the income tax portal under the AIS/TIS section.',
    },
    {
      q: 'Do I need Form 16 to file ITR?',
      a: 'Form 16 is the primary document for salaried taxpayers - it contains your salary details, allowances, deductions, and TDS summary. While you can technically file without it using your payslips and Form 26AS, Form 16 makes the process significantly easier and reduces the chance of errors.',
    },
    {
      q: 'What investment proof documents do I need?',
      a: 'For Section 80C: LIC premium receipts, PPF passbook, ELSS mutual fund statements, home loan principal repayment certificate. For Section 80D: health insurance premium receipts. For HRA: rent receipts and landlord PAN (if annual rent exceeds Rs. 1 lakh). For home loan interest: certificate from the bank showing principal and interest split.',
    },
    {
      q: 'What documents are needed for capital gains?',
      a: 'For equity shares and mutual funds: contract notes or transaction statements from your broker showing purchase date, cost, sale date, and proceeds. For property: sale deed, purchase deed, and any improvement cost receipts. Stamp duty paid on purchase is part of the cost of acquisition.',
    },
  ],
}


// ─── 6. Business ITR Documents Checklist ─────────────────────────────────────

export const businessItrChecklistPage: ToolPageConfig = {
  slug: 'business-itr',
  title: 'Documents Required for Business ITR Filing (Company & LLP)',
  seoTitle: 'Documents Required for Business ITR Filing India 2025 | Company & LLP | Ollvy',
  seoDescription: 'Complete document checklist for company (ITR-6) and LLP (ITR-5) income tax return filing. Audited financials, Form 26AS, depreciation schedule, director remuneration.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/business-itr',
  lastReviewed: 'April 2026',
  category: 'Tax',
  relatedServiceSlug: 'business-itr',
  relatedServiceLabel: 'File Business ITR',
  relatedCalculatorSlugs: ['itr-late-filing', 'tds-late-filing'],
  relatedLearnSlug: 'which-itr-form-should-i-use',

  intro: `Filing Business ITR for a Private Limited company (ITR-6) or LLP (ITR-5) requires audited financial statements plus several supporting documents that your CA will use to prepare the tax computation.

The most critical documents are the audited Balance Sheet and P&L. For Pvt Ltd companies, statutory audit is mandatory every year regardless of turnover - you cannot file without it. For LLPs, audit is mandatory only above Rs. 40 lakh turnover or Rs. 25 lakh partner contribution.

Form 26AS is particularly important for companies and LLPs - it shows all TDS deducted from payments received (rent received, professional fees, etc.) that can be claimed as credit against your tax liability. Unclaimed TDS credit is money left on the table.

The depreciation schedule must be verified against the Companies Act rates for the statutory audit and the Income Tax Act rates for the ITR computation. These are different - the IT Act has its own depreciation rates under Section 32. Your CA will reconcile both.

Director or partner remuneration has specific treatment: for companies, salary paid to working directors is deductible but must comply with Companies Act limits. For LLPs, partner remuneration is deductible under Section 40(b) subject to statutory limits on the amount.`,

  howToUse: `**Audit timeline:** For companies, the statutory audit must be complete before ITR filing. The audit report (Form 3CA/3CB and 3CD) must be filed by September 30 for tax audit cases - the ITR follows by October 31.

**Form 26AS reconciliation:** Download Form 26AS and reconcile every TDS entry against your records. Every rupee of TDS you have not claimed is a refund owed to you.

**Advance tax:** If your tax liability for the year (before TDS) exceeds Rs. 10,000, advance tax must be paid quarterly. If it was not, or if shortfall occurred, Section 234B and 234C interest applies - factor this in.

**Previous year ITR:** Have the previous year's ITR and computation ready for reference. It shows opening depreciation balances, carry-forward losses, and the tax computation basis.`,

  faqs: [
    {
      q: 'Is statutory audit mandatory for all Pvt Ltd companies?',
      a: 'Yes. Under the Companies Act 2013, every Pvt Ltd company must get its accounts audited by a practicing Chartered Accountant, every year, regardless of turnover or whether the company was active. There is no exemption based on size.',
    },
    {
      q: 'What is the difference between Form 3CA and Form 3CB?',
      a: 'Form 3CA is used when accounts are audited under another law (like the Companies Act) - i.e., most Pvt Ltd companies. Form 3CB is used when accounts are audited only under the Income Tax Act (i.e., businesses that require tax audit but not statutory audit). Both are accompanied by Form 3CD, the detailed audit statement.',
    },
    {
      q: 'What is the depreciation schedule and why is it needed?',
      a: 'The depreciation schedule lists all fixed assets - buildings, machinery, computers, vehicles - with their original cost, accumulated depreciation, and written-down value. The Income Tax Act has its own block-based depreciation rates (Section 32) that differ from Companies Act rates. The CA uses both to reconcile the tax computation.',
    },
    {
      q: 'What is the Section 40(b) limit for LLP partner remuneration?',
      a: 'For an LLP with book profit up to Rs. 3 lakh: remuneration deductible is higher of Rs. 1.5 lakh or 90% of book profit. Above Rs. 3 lakh: 60% of book profit above Rs. 3 lakh plus Rs. 1.5 lakh. Remuneration above this limit is disallowed and added back to taxable income.',
    },
    {
      q: 'Can carry-forward losses reduce current year tax?',
      a: 'Yes. Business losses from previous years (carried forward in prior ITRs) can be set off against current year business income. Capital losses can offset capital gains. The carry-forward period is 8 years for most losses. The prior year ITR showing the carried-forward loss is the supporting document.',
    },
  ],
}


// ─── 7. Sole Proprietor Documents Checklist ───────────────────────────────────

export const soleProprietorChecklistPage: ToolPageConfig = {
  slug: 'sole-proprietor',
  title: 'Documents Required for Sole Proprietor Business Setup',
  seoTitle: 'Sole Proprietor Business Documents India 2025 | GST, Bank Account, S&E | Ollvy',
  seoDescription: 'Documents needed for sole proprietorship setup in India - GST registration, bank current account, Shop & Establishment registration. PAN, Aadhaar, address proof.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/sole-proprietor',
  lastReviewed: 'April 2026',
  category: 'Registration',
  relatedServiceSlug: 'gst-registration',
  relatedServiceLabel: 'Get GST Registration',
  relatedCalculatorSlugs: ['gst-late-filing'],
  relatedLearnSlug: 'do-i-need-gst-registration',

  intro: `A sole proprietorship has no formal registration process with MCA - there is no certificate from any authority that says "you are now a proprietorship." Instead, a sole proprietor establishes business identity through a combination of registrations that together prove the existence of the business.

The most important of these is GST registration (mandatory above the threshold, but obtainable voluntarily below it). A GSTIN in the business name is the primary proof of business identity accepted by banks, clients, and government authorities. Without it, a sole proprietor has almost no formal business documentation.

For opening a bank current account, banks typically require at least two of: GSTIN, Shop & Establishment certificate, trade licence, or any other government registration in the business name. PAN is personal (the proprietor's individual PAN serves as the business PAN for a proprietorship), and Aadhaar is used for identity verification.

The Shop & Establishment registration is required in most states for any commercial activity and serves as primary proof of business address - banks accept it universally for current account opening. It is state-level, low cost, and straightforward.`,

  howToUse: `**No single registration covers everything.** A sole proprietor needs a combination. At minimum: GST registration (or a convincing reason why it is not needed) + either Shop & Establishment certificate or a trade licence.

**PAN serves as business PAN.** For a sole proprietorship, there is no separate entity PAN. The proprietor's individual PAN is used for all business purposes including GST registration, bank accounts, and ITR (filed as an individual, typically using ITR-3 or ITR-4).

**Bank account:** Most banks require GST certificate or S&E certificate + PAN for current account opening in a proprietorship. Some also ask for an Udyam (MSME) certificate. Have all three ready.

**ITR for sole proprietors:** Filed as an individual ITR. If business turnover is below Rs. 2 crore, ITR-4 (presumptive taxation) is available. Above Rs. 2 crore or with actual books, ITR-3.`,

  faqs: [
    {
      q: 'How does a sole proprietor prove their business exists?',
      a: 'Through registered documents issued by government authorities: GSTIN (primary), Shop & Establishment certificate, trade licence, or Udyam registration. Banks and clients accept one or more of these as proof of business identity.',
    },
    {
      q: 'Can a sole proprietor open a current account without GST registration?',
      a: 'Yes, but it requires other documents instead. Banks typically accept a Shop & Establishment certificate, trade licence, or Udyam registration combined with PAN. The exact documents vary by bank - confirm with your specific bank before starting the account opening process.',
    },
    {
      q: 'Does a sole proprietor need a separate PAN for the business?',
      a: 'No. A sole proprietorship is not a separate legal entity. The proprietor\'s individual PAN serves as the business PAN for all purposes including GST registration, tax filing (ITR), and banking.',
    },
    {
      q: 'What ITR form does a sole proprietor file?',
      a: 'ITR-4 (Sugam) if using presumptive taxation under Section 44AD (business turnover up to Rs. 2 crore) or 44ADA (professional receipts up to Rs. 50 lakh). ITR-3 if maintaining actual books of accounts or if turnover exceeds presumptive limits.',
    },
    {
      q: 'Is Udyam (MSME) registration useful for a sole proprietor?',
      a: 'Yes. Udyam registration is free, takes 15 minutes, and provides MSME certificate which banks accept for current account. It also unlocks collateral-free CGTMSE loans and payment protection if you supply to large companies. There is no downside to registering.',
    },
  ],
}


// ─── 8. Cloud Kitchen / FSSAI Documents Checklist ────────────────────────────

export const fssaiChecklistPage: ToolPageConfig = {
  slug: 'fssai',
  title: 'Documents Required for FSSAI Licence (Cloud Kitchen & Food Business)',
  seoTitle: 'FSSAI Licence Documents India 2025 | Cloud Kitchen Checklist | Ollvy',
  seoDescription: 'Complete FSSAI licence document checklist for cloud kitchens and food businesses. Basic registration vs State Licence vs Central Licence. Inspection requirements.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/fssai',
  lastReviewed: 'April 2026',
  category: 'Licensing',
  relatedServiceSlug: 'cloud-kitchen-setup',
  relatedServiceLabel: 'Get FSSAI Licence',
  relatedCalculatorSlugs: [],
  relatedLearnSlug: 'do-i-need-fssai-license',

  intro: `FSSAI licence requirements vary significantly depending on which tier applies to your food business - Basic Registration, State Licence, or Central Licence. Using the wrong tier is itself a violation, and the document requirements differ substantially between them.

Basic Registration (Form A) for food businesses below Rs. 12 lakh annual turnover requires minimal documentation - primarily identity proof, address proof, and a food safety declaration. No inspection is required.

State Licence (Form B - State) for Rs. 12 lakh to Rs. 20 crore turnover requires a kitchen layout plan, food safety plan, equipment list, pest control certificate, water test report, and a physical inspection by a State Food Safety Officer. This is where most cloud kitchens fall.

Central Licence (Form B - Central) for above Rs. 20 crore, multi-state operations, or food importers/exporters requires the most documentation and a more detailed inspection.

The documents that cause the most trouble during State and Central licence inspections: pest control certificate (must be current - inspectors verify the date), water test report from a NABL-accredited laboratory (not just any lab), and equipment hygiene labels (manufacturing date, use-by date visible on equipment).`,

  howToUse: `**Determine your tier first.** The tier is based on your annual turnover from food activities:
- Below Rs. 12 lakh: Basic Registration
- Rs. 12 lakh to Rs. 20 crore, single state: State Licence
- Above Rs. 20 crore, multi-state, or importer/exporter: Central Licence

**Swiggy and Zomato require State Licence minimum.** A Basic Registration is typically not accepted by food delivery platforms for full onboarding.

**Pre-inspection preparation:** For State and Central licences, prepare the inspection checklist before the officer visits. The most common inspection failure reasons: expired pest control certificate, water test report from a non-NABL lab, no food safety plan, and equipment without hygiene labels.

**Validity:** FSSAI licences are valid for 1-5 years (you choose at application). Choose 5 years upfront - renewing annually costs more in fees and time.`,

  faqs: [
    {
      q: 'What is the difference between FSSAI Basic Registration and State Licence?',
      a: 'Basic Registration (Form A): for food businesses below Rs. 12 lakh turnover, issued by the local Food Safety Officer, no inspection required, Rs. 100/year. State Licence (Form B): for Rs. 12 lakh to Rs. 20 crore, requires physical inspection by a State Food Safety Officer, Rs. 2,000-7,500/year depending on category.',
    },
    {
      q: 'Does a home-based food business need FSSAI?',
      a: 'Yes. If you are selling food - through Instagram, WhatsApp, a website, or any other channel - and receiving payment, you are a food business operator and need at minimum a Basic Registration. "I sell from home" is not an exemption under the Food Safety and Standards Act.',
    },
    {
      q: 'What is a pest control certificate and why is it required?',
      a: 'A pest control certificate is issued by a licensed pest control company after they treat your premises for pests. FSSAI requires this for State and Central licences as evidence that your kitchen meets basic food safety standards. The certificate must be current - inspectors check the issue and validity date.',
    },
    {
      q: 'What water test report is acceptable for FSSAI?',
      a: 'The water quality test report must be from a NABL (National Accreditation Board for Testing and Calibration Laboratories) accredited laboratory. Reports from non-accredited labs are not accepted. The test should check for potability parameters including coliform bacteria, pH, and dissolved solids.',
    },
    {
      q: 'Can I start operations while the FSSAI application is pending?',
      a: 'For State and Central licences: you can display the application acknowledgement number and begin operations in most states while the licence is being processed. However, check your state\'s specific rules - some states require the actual licence before operations begin.',
    },
  ],
}
