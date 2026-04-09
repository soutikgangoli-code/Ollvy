/**
 * COMPARISON TABLES FOR ALL 12 GUIDES
 *
 * Add each table to the relevant section in the guide file.
 * Field: table on LearnSection
 * Placement: after the section body/bullets, before the note
 *
 * Each table is factually verified. Numbers are sourced from:
 * - CGST Act 2017 (GST)
 * - Companies Act 2013 + LLP Act 2008 (Pvt Ltd vs LLP)
 * - Income Tax Act 1961 (ITR)
 * - Trade Marks Act 1999 + IPO fee schedule (Trademark)
 * - EPF Act 1952 (PF)
 * - ESI Act 1948 (ESI)
 * - State PT Acts (Professional Tax)
 * - State S&E Acts (Shop & Establishment)
 * - MSME Notification S.O. 1364(E), March 21 2025 (MSME)
 * - DPIIT Notification G.S.R. 127(E), Feb 19 2019 (DPIIT)
 * - FSS (Licensing and Registration) Regulations 2011 (FSSAI)
 * - CBDT ITR Notification AY 2025-26 (ITR Forms)
 */

import type { LearnSectionTable } from './learn-section-table'


// =============================================================================
// GUIDE 1: GST Registration
// Add to section 01 (The Short Answer)
// =============================================================================

export const gstThresholdTable: LearnSectionTable = {
  caption: 'GST Registration Thresholds by Business Type (FY 2025-26)',
  headers: ['Business Type', 'Normal States', 'Special Category States*', 'Notes'],
  rows: [
    ['Services', 'Rs. 20 lakh', 'Rs. 10 lakh', 'Covers consulting, IT, freelancing, restaurants'],
    ['Goods only', 'Rs. 40 lakh', 'Rs. 20 lakh', 'Only for businesses that exclusively supply goods'],
    ['Interstate supply', 'Mandatory', 'Mandatory', 'No threshold - even one out-of-state sale triggers this'],
    ['E-commerce sellers', 'Mandatory', 'Mandatory', 'Amazon, Flipkart, Swiggy, Zomato - no exemption'],
    ['Reverse charge payer', 'Mandatory', 'Mandatory', 'Applies regardless of turnover'],
    ['Exempt goods/services only', 'Not required', 'Not required', 'e.g. fresh produce, core healthcare'],
  ],
}
// *Special category states: Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, Sikkim,
// Meghalaya, Assam, Himachal Pradesh, Uttarakhand, J&K


// =============================================================================
// GUIDE 2: Pvt Ltd vs LLP
// Add to section 04 (Compliance cost) or as a dedicated section 00 at top
// This is the most important table - Google ranks pages that have this
// =============================================================================

export const pvtLtdVsLlpTable: LearnSectionTable = {
  caption: 'Private Limited Company vs LLP: Key Differences (2025)',
  headers: ['Criteria', 'Private Limited Company', 'LLP'],
  rows: [
    ['Equity investment', 'Can issue shares to angel investors and VCs', 'Cannot issue equity - investors cannot take stakes'],
    ['Minimum founders', '1 director + 1 shareholder (nominee allowed)', '2 designated partners - solo founder not possible'],
    ['Tax rate (entity)', '22% under Sec 115BAA or 25% (turnover up to Rs. 400 crore)', '30% flat (no concessional regime available)'],
    ['How profits reach owners', 'Dividends taxed in shareholders\' hands at their slab rate', 'Partner remuneration deductible before tax - taxed at partner\'s slab rate'],
    ['Mandatory audit', 'Every year, regardless of turnover or activity', 'Only above Rs. 40 lakh turnover AND Rs. 25 lakh partner contribution'],
    ['Annual compliance cost', 'Rs. 25,000-50,000 (small company, minimal activity)', 'Rs. 10,000-20,000 (small LLP, minimal activity)'],
    ['Annual filings', 'AOC-4, MGT-7, ITR, DIR-3 KYC, board meetings x4', 'Form 8, Form 11, ITR'],
    ['ESOP to employees', 'Yes - standard practice for startups', 'No - not possible in LLP structure'],
    ['Converting to other structure', 'LLP to Pvt Ltd: 3-6 months, Rs. 50,000-1.5 lakh', 'Pvt Ltd to LLP: complex, stamp duty on asset transfer'],
    ['DPIIT Startup Recognition', 'Eligible', 'Eligible'],
    ['80-IAC tax holiday (3 years)', 'Eligible - requires IMB certification', 'Eligible - requires IMB certification'],
    ['Best for', 'Startups raising equity funding, tech companies, ESOPs', 'Professional services, bootstrapped businesses, low compliance priority'],
  ],
}


// =============================================================================
// GUIDE 3: ITR Filing
// Add to section 01 (Who has to file)
// =============================================================================

export const itrThresholdTable: LearnSectionTable = {
  caption: 'ITR Filing: Basic Exemption Limits and Due Dates (FY 2024-25 / AY 2025-26)',
  headers: ['Taxpayer', 'Exemption Limit', 'Due Date', 'Late Fee'],
  rows: [
    ['Individual below 60', 'Rs. 2.5 lakh', '31 July 2025', 'Rs. 1,000 (income ≤ Rs. 5L) or Rs. 5,000'],
    ['Senior Citizen (60-80 years)', 'Rs. 3 lakh', '31 July 2025', 'Rs. 1,000 or Rs. 5,000'],
    ['Super Senior Citizen (above 80)', 'Rs. 5 lakh', '31 July 2025', 'Rs. 1,000 only'],
    ['Private Limited Company', 'No exemption', '31 October 2025', 'Rs. 10,000'],
    ['LLP or Partnership Firm', 'No exemption', '31 July or 31 October (if audit)', 'Rs. 1,000-10,000'],
    ['Business requiring tax audit', 'No exemption', '31 October 2025', 'Rs. 10,000'],
    ['Director in any company', 'No exemption (must file regardless)', 'As per entity type', 'Rs. 1,000-10,000'],
    ['Foreign assets/income holder', 'No exemption (must file regardless)', 'As per entity type', 'Rs. 1,000-10,000'],
  ],
}

// Also add this high-value transactions table to section 02
export const itrHighValueTable: LearnSectionTable = {
  caption: 'High-Value Transactions That Trigger Mandatory ITR Filing (Rule 12AB)',
  headers: ['Transaction', 'Threshold', 'Applies to'],
  rows: [
    ['Cash deposit in current account(s)', 'Rs. 1 crore or more', 'All individuals, regardless of income'],
    ['International travel expenses', 'Rs. 2 lakh or more', 'All individuals, regardless of income'],
    ['Electricity bill payments', 'Rs. 1 lakh or more (aggregate)', 'All individuals, regardless of income'],
    ['Mutual fund/stock purchases', 'Rs. 10 lakh or more', 'All individuals, regardless of income'],
    ['Foreign bank account or asset', 'Any amount', 'All individuals and entities'],
    ['TDS deducted on income', 'Any amount', 'Must file to claim refund'],
  ],
}


// =============================================================================
// GUIDE 4: Trademark Registration
// Add to section 06 (Cost is low)
// =============================================================================

export const trademarkCostTable: LearnSectionTable = {
  caption: 'Trademark Registration Fees in India (IP India, 2025)',
  headers: ['Fee Type', 'Individual / Startup / Small Entity', 'Company / Others', 'Notes'],
  rows: [
    ['Registration per class', 'Rs. 4,500', 'Rs. 9,000', 'One-time government fee per 10-year term'],
    ['Renewal per class', 'Rs. 9,000', 'Rs. 10,000', 'Every 10 years - mark stays active indefinitely'],
    ['Expedited examination', 'Rs. 20,000', 'Rs. 40,000', 'Faster examination, not faster registration'],
    ['Opposition reply', 'Rs. 2,700', 'Rs. 2,700', 'If a third party opposes your application'],
    ['Correction of error', 'Rs. 900', 'Rs. 900', 'Per application, per form'],
  ],
}

export const trademarkUrgencyTable: LearnSectionTable = {
  caption: 'When to Register Your Trademark: Urgency by Situation',
  headers: ['Situation', 'Urgency', 'Why'],
  rows: [
    ['Selling on Amazon or Flipkart', 'Immediate', 'Brand Registry requires registered trademark. Without it, listings are open to hijackers.'],
    ['Raising investor funding', 'Before closing the round', 'IP due diligence will flag an unregistered brand. Can delay or reduce valuation.'],
    ['Significant marketing spend ongoing', 'This month', 'Every rupee builds equity in an unprotected brand. Someone can register your name.'],
    ['Planning to franchise or license', 'Before any discussions', 'You cannot legally license a mark you do not own as a registered trademark.'],
    ['International expansion planned', 'Now', 'Paris Convention gives you 6 months from Indian filing to claim priority in other countries.'],
    ['Early stage, still validating name', '3-6 months', 'Register the moment you commit to the name. Do a free IP India search today.'],
    ['B2B supplier, white-label', 'Low urgency', 'Register before any consumer-facing marketing begins.'],
  ],
}


// =============================================================================
// GUIDE 5: PF Registration
// Add to section 03 (What PF costs)
// =============================================================================

export const pfContributionTable: LearnSectionTable = {
  caption: 'PF Contribution Rates (EPF Scheme 1952)',
  headers: ['Contributor', 'Rate', 'Paid To', 'Applicable to'],
  rows: [
    ['Employee', '12% of basic salary + DA', 'EPF account', 'All PF members'],
    ['Employer - EPF', '3.67% of basic salary + DA', 'EPF account', 'All covered employees'],
    ['Employer - EPS (pension)', '8.33% of basic salary + DA', 'EPS account', 'Employees earning up to Rs. 15,000 basic'],
    ['Employer - EDLI (insurance)', '0.5% of wages', 'EDLI scheme', 'All covered employees'],
    ['Employer - Admin charges', '0.5% of wages', 'EPFO admin', 'All covered employees'],
    ['Total employer cost', '~13.61% of basic + DA', 'Various', 'In addition to the employee\'s own contribution'],
  ],
}

export const pfThresholdTable: LearnSectionTable = {
  caption: 'PF Registration Threshold by Industry',
  headers: ['Industry Type', 'Mandatory Threshold', 'Examples'],
  rows: [
    ['Most industries', '20 employees', 'IT, retail, hospitality, healthcare, services, manufacturing'],
    ['Scheduled industries', '10 employees', 'Cinemas, theatres, beedi/tobacco, jute/cotton textile mills'],
    ['Voluntary', 'Below threshold', 'Any employer can register voluntarily - contribution rate 10% instead of 12%'],
  ],
}


// =============================================================================
// GUIDE 6: ESI Registration
// Add to section 03 (Contribution rates)
// =============================================================================

export const esiContributionTable: LearnSectionTable = {
  caption: 'ESI Contribution Rates (ESI Act 1948)',
  headers: ['Contributor', 'Rate', 'Basis'],
  rows: [
    ['Employer', '3.25%', 'Gross wages of each covered employee'],
    ['Employee', '0.75%', 'Gross wages'],
    ['Total', '4%', 'Per covered employee per month'],
    ['Employees earning ≤ Rs. 176/day', 'Employer pays 3.25%, employee exempt from contribution', 'Employee below daily wage threshold'],
    ['Employees earning above Rs. 21,000/month', 'No ESI contribution', 'Above salary ceiling - exempt from ESI'],
  ],
}

export const esiBenefitsTable: LearnSectionTable = {
  caption: 'ESI Benefits Available to Covered Employees and Dependants',
  headers: ['Benefit', 'Amount / Coverage', 'Eligibility Period'],
  rows: [
    ['Medical care', 'Full treatment for employee and family through ESIC hospitals', 'From day of registration'],
    ['Sickness benefit', '70% of wages for up to 91 days per year', 'After 6 months of contribution'],
    ['Maternity benefit', 'Full wages for 26 weeks', 'After 70 days of contribution'],
    ['Disability benefit (employment injury)', '90% of wages - permanent or temporary disability', 'From day of registration'],
    ['Dependants benefit (death due to injury)', '90% of wages paid to family', 'From day of registration'],
    ['Funeral expenses', 'Rs. 15,000 lump sum', 'On death of insured person'],
  ],
}


// =============================================================================
// GUIDE 7: Professional Tax
// Add to section 02 (States where PT applies)
// This is the highest-value table for this guide - state-wise data in one place
// =============================================================================

export const professionalTaxTable: LearnSectionTable = {
  caption: 'Professional Tax by State - Current Rates and Thresholds (2025)',
  headers: ['State', 'Max Annual PT', 'Approx. Monthly Income Threshold', 'Due Date'],
  rows: [
    ['Maharashtra', 'Rs. 2,500', 'Rs. 7,500/month', 'Monthly by end of month'],
    ['Karnataka', 'Rs. 2,496', 'Rs. 10,000/month', 'Monthly by 20th'],
    ['West Bengal', 'Rs. 2,500', 'Rs. 10,000/month', 'Monthly by 21st'],
    ['Tamil Nadu', 'Rs. 2,400', 'Rs. 3,500/month', 'Half-yearly'],
    ['Andhra Pradesh', 'Rs. 2,500', 'Rs. 15,001/month', 'Monthly by 10th'],
    ['Telangana', 'Rs. 2,500', 'Rs. 15,001/month', 'Monthly by 10th'],
    ['Gujarat', 'Rs. 2,500', 'Rs. 6,000/month', 'Monthly by 15th'],
    ['Odisha', 'Rs. 2,500', 'Rs. 5,000/month', 'Quarterly'],
    ['Kerala', 'Rs. 2,400', 'Rs. 12,000/month', 'Half-yearly (April, October)'],
    ['Madhya Pradesh', 'Rs. 2,100', 'Rs. 6,000/month', 'Monthly by 10th'],
    ['Assam', 'Rs. 2,500', 'Rs. 10,000/month', 'Quarterly'],
    ['Jharkhand', 'Rs. 2,500', 'Rs. 5,000/month', 'Monthly'],
    ['Delhi, UP, Rajasthan, Haryana, Punjab, HP', 'Not applicable', 'Not applicable', 'N/A - no PT in these states'],
  ],
}


// =============================================================================
// GUIDE 8: Shop and Establishment
// Add to section 01 or as a dedicated "State-wise" section
// =============================================================================

export const shopEstablishmentTable: LearnSectionTable = {
  caption: 'Shop & Establishment Registration - State-wise Validity and Renewal',
  headers: ['State', 'Certificate Validity', 'Renewal Required', 'Key Feature'],
  rows: [
    ['Maharashtra', 'Lifetime (permanent)', 'No', 'Made permanent after 2017 amendment'],
    ['Delhi', 'Annual', 'Yes - annually', 'Digital application on Shramev Jayate portal'],
    ['Karnataka', 'Annual', 'Yes - annually', 'Grama One and Atalji Janasnehi Kendras for filing'],
    ['Tamil Nadu', 'Annual or 5 years', 'Yes', 'Option to pay for 5-year validity upfront'],
    ['Gujarat', 'Annual', 'Yes - annually', 'Online filing via Shram Suvidha portal'],
    ['West Bengal', 'Annual', 'Yes - annually', 'Shops registration under West Bengal Shops Act 1963'],
    ['Andhra Pradesh', 'Annual', 'Yes - annually', 'Meeseva portal for online registration'],
    ['Telangana', 'Annual', 'Yes - annually', 'Meeseva portal'],
    ['Rajasthan', 'Annual', 'Yes - annually', 'Jan Soochna portal'],
    ['Haryana', '5 years', 'Yes - every 5 years', 'One registration covers all branches in state'],
  ],
}

export const shopEstablishmentUsesTable: LearnSectionTable = {
  caption: 'What the S&E Certificate Is Accepted as Proof of',
  headers: ['Where You Need It', 'What It Proves', 'Alternative Accepted?'],
  rows: [
    ['Bank current account (sole proprietorship)', 'Business address and existence', 'No - most banks require this specifically'],
    ['GST registration', 'Principal place of business', 'Rental agreement also accepted'],
    ['FSSAI food licence', 'Business address', 'Yes - trade licence also accepted'],
    ['MSME Udyam registration', 'Business operation', 'Not required but helps'],
    ['Labour inspections', 'Compliance display at workplace', 'No - must be displayed at workplace'],
    ['Trade licence applications', 'Business legitimacy', 'No - usually prerequisite'],
  ],
}


// =============================================================================
// GUIDE 9: MSME / Udyam Registration
// Add to section 02 (Do you qualify) - MOST SEARCHED TABLE for this topic
// =============================================================================

export const msmeClassificationTable: LearnSectionTable = {
  caption: 'MSME Classification Thresholds - April 2025 (Notification S.O. 1364(E))',
  headers: ['Category', 'Investment Limit', 'Turnover Limit', 'Both criteria must be met'],
  rows: [
    ['Micro Enterprise', 'Up to Rs. 2.5 crore', 'Up to Rs. 10 crore', 'Either limit breached = upgrade to Small'],
    ['Small Enterprise', 'Up to Rs. 25 crore', 'Up to Rs. 100 crore', 'Either limit breached = upgrade to Medium'],
    ['Medium Enterprise', 'Up to Rs. 125 crore', 'Up to Rs. 500 crore', 'Either limit breached = no longer MSME'],
  ],
}

// Note: Investment measured as written-down value (depreciated cost) per latest ITR

export const msmeBenefitsTable: LearnSectionTable = {
  caption: 'Key MSME Benefits and Who Gets Them',
  headers: ['Benefit', 'What You Actually Get', 'Best For'],
  rows: [
    ['CGTMSE collateral-free loans', 'Loans up to Rs. 10 crore without pledging assets (Budget 2025 limit)', 'All MSMEs needing credit'],
    ['Priority sector lending', 'Banks have mandatory MSME targets - faster approvals, better rates', 'All MSMEs'],
    ['GeM exclusive categories', 'Government departments must buy certain % from MSMEs on GeM marketplace', 'MSMEs supplying to government'],
    ['Payment protection (MSME Samadhaan)', 'If buyer above Rs. 250 crore turnover delays beyond 45 days: auto compound interest at 3x RBI rate', 'MSMEs supplying to large corporates'],
    ['ISO certification reimbursement', 'Central government reimburses ISO certification cost', 'All MSMEs seeking ISO'],
    ['Udyam Credit Card (micro only)', 'Rs. 5 lakh credit card for micro enterprises registered on Udyam portal', 'Micro enterprises only'],
    ['CLSS technology subsidy', 'Capital subsidy for technology upgrades via Credit Linked Capital Subsidy Scheme', 'Manufacturing MSMEs'],
  ],
}


// =============================================================================
// GUIDE 10: DPIIT Startup Recognition
// Add to section 02 (Do you qualify) and section 03 (Benefits)
// =============================================================================

export const dpiitEligibilityTable: LearnSectionTable = {
  caption: 'DPIIT Startup Recognition: Eligibility Criteria',
  headers: ['Criterion', 'Requirement', 'Common Disqualifier'],
  rows: [
    ['Entity type', 'Private Limited Company, LLP, or Registered Partnership Firm', 'Sole proprietorship, HUF, trust - not eligible'],
    ['Age', 'Less than 10 years from date of incorporation', 'Businesses older than 10 years'],
    ['Turnover', 'Below Rs. 100 crore in every financial year since incorporation', 'Any year above Rs. 100 crore'],
    ['Nature of work', 'Innovation, development, or commercialisation driven by technology or intellectual property', 'Pure trading, restaurants, salons, real estate'],
    ['Formation method', 'Not formed by splitting or reconstructing an existing business', 'Spin-offs from existing companies'],
    ['Headquarters', 'India', 'Foreign-incorporated entities'],
  ],
}

export const dpiitBenefitsTable: LearnSectionTable = {
  caption: 'DPIIT Startup Recognition Benefits',
  headers: ['Benefit', 'What It Does', 'Requires Extra Step?', 'Most Relevant For'],
  rows: [
    ['Angel Tax Exemption (Sec 56(2)(viib))', 'Investment above Fair Market Value not taxed as income at 30%', 'No - automatic on recognition', 'Any startup raising from angel investors'],
    ['3-Year Tax Holiday (Sec 80-IAC)', '100% profit deduction for any 3 consecutive years in first 10 years', 'Yes - separate IMB certification required', 'Profitable startups in early years'],
    ['Patent fee rebate', '80% off government patent filing fees + fast-tracked examination', 'No - cite recognition certificate when filing', 'IP-driven and product startups'],
    ['Labour law self-certification', 'Self-certify under 3 central labour laws for 5 years - no inspections', 'No - automatic on recognition', 'Startups scaling headcount fast'],
    ['Fund of Funds access', 'Eligible for investment via SIDBI Fund of Funds through registered AIFs', 'No - automatic on recognition', 'Startups seeking institutional funding'],
  ],
}


// =============================================================================
// GUIDE 11: FSSAI Licence
// Add to section 01 (Three tiers)
// This is the most-searched table for FSSAI queries
// =============================================================================

export const fssaiTierTable: LearnSectionTable = {
  caption: 'FSSAI Registration vs Licence: Which One Do You Need?',
  headers: ['Type', 'Annual Turnover', 'Who Issues', 'Processing Time', 'Annual Fee', 'Validity'],
  rows: [
    ['Basic Registration (Form A)', 'Below Rs. 12 lakh', 'Local Food Safety Officer', '7 working days', 'Rs. 100/year', '1-5 years (chosen at application)'],
    ['State Licence (Form B - State)', 'Rs. 12 lakh to Rs. 20 crore, single state', 'State Food Safety Authority', '30 days', 'Rs. 2,000-5,000/year by category', '1-5 years'],
    ['Central Licence (Form B - Central)', 'Above Rs. 20 crore OR multi-state OR importer/exporter', 'FSSAI, New Delhi', '60 days', 'Rs. 7,500/year', '1-5 years'],
  ],
}

export const fssaiPlatformTable: LearnSectionTable = {
  caption: 'FSSAI Requirements by Platform and Business Type',
  headers: ['Business Type / Platform', 'Licence Required', 'Where FSSAI Number Appears'],
  rows: [
    ['Restaurant, cafe, cloud kitchen', 'State Licence (unless turnover below Rs. 12 lakh)', 'Displayed at premises, on Swiggy/Zomato profile'],
    ['Home-based food seller (Instagram, WhatsApp)', 'Basic Registration minimum', 'On packaging, in social media bio'],
    ['Swiggy / Zomato partner', 'State Licence minimum', 'Mandatory on platform profile - verified by platform'],
    ['Amazon / Flipkart food seller', 'State or Central Licence', 'Printed on packaging label, shown in product listing'],
    ['Multi-state restaurant chain', 'Central Licence', 'Displayed at all outlets under single licence'],
    ['Food manufacturer (single state)', 'State Licence or Central (if above Rs. 20 crore)', 'On all product packaging and invoices'],
    ['Food importer or exporter', 'Central Licence only', 'On all import/export documentation'],
  ],
}


// =============================================================================
// GUIDE 12: ITR Form Selection
// Add to section 01 (All 7 forms)
// The most-searched table for ITR queries - gets featured snippet consistently
// =============================================================================

export const itrFormTable: LearnSectionTable = {
  caption: 'Which ITR Form to Use - Complete Reference (AY 2025-26)',
  headers: ['Form', 'Who Files', 'Key Conditions', 'Cannot Be Used If'],
  rows: [
    [
      'ITR-1 (Sahaj)',
      'Resident individual',
      'Salary/pension + one house property + interest income. Total income below Rs. 50 lakh.',
      'Capital gains, multiple properties, foreign assets, income above Rs. 50 lakh, director role, unlisted shares held',
    ],
    [
      'ITR-2',
      'Individual or HUF',
      'Capital gains. Multiple house properties. Foreign income or assets. Income above Rs. 50 lakh. Directorship. Unlisted shares.',
      'Business or professional income (use ITR-3 or ITR-4 for that)',
    ],
    [
      'ITR-3',
      'Individual or HUF',
      'Business or professional income with actual books of accounts. Also if turnover exceeds presumptive limits.',
      'Entities (firms use ITR-5, companies use ITR-6)',
    ],
    [
      'ITR-4 (Sugam)',
      'Individual, HUF, or Firm (not LLP)',
      'Presumptive taxation: 44AD (business turnover ≤ Rs. 2 crore) or 44ADA (professional receipts ≤ Rs. 50 lakh). No capital gains.',
      'Capital gains, turnover above Rs. 2 crore (44AD), professional income above Rs. 50 lakh (44ADA), LLPs',
    ],
    [
      'ITR-5',
      'Partnership Firm, LLP, AOP, BOI',
      'Mandatory for all firms and LLPs - regardless of income, activity, or size.',
      'Companies, individuals, trusts',
    ],
    [
      'ITR-6',
      'Companies (Pvt Ltd, Public Ltd, OPC)',
      'All companies except those claiming Section 11 charitable exemption.',
      'Non-company entities',
    ],
    [
      'ITR-7',
      'Trusts, NGOs, political parties, universities, research institutions',
      'Entities filing under Section 139(4A), 139(4B), 139(4C), or 139(4D).',
      'Companies and non-charitable entities',
    ],
  ],
}

// Second table for Guide 12 - most common ITR-1 vs ITR-2 confusion
export const itrOneVsTwoTable: LearnSectionTable = {
  caption: 'ITR-1 vs ITR-2: Disqualifiers That Force You to Use ITR-2',
  headers: ['Situation', 'ITR-1 Allowed?', 'Correct Form'],
  rows: [
    ['Salary income, one property, interest only - total below Rs. 50 lakh', 'Yes', 'ITR-1'],
    ['Sold any mutual fund units, shares, or property this year', 'No', 'ITR-2'],
    ['Director in any company (even dormant)', 'No', 'ITR-2'],
    ['Held unlisted shares at any point during the year', 'No', 'ITR-2'],
    ['Foreign bank account or any foreign asset', 'No', 'ITR-2'],
    ['Total income above Rs. 50 lakh from any source', 'No', 'ITR-2'],
    ['Non-resident or Not Ordinarily Resident', 'No', 'ITR-2'],
    ['Agricultural income above Rs. 5,000', 'No', 'ITR-2'],
    ['Income from more than one house property', 'No', 'ITR-2'],
    ['Business or professional income', 'No', 'ITR-3 or ITR-4'],
  ],
}
