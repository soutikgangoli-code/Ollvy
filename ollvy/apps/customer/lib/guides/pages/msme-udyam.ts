import { LearnPageConfig } from '../pages'

// FACTUAL UPDATE: Thresholds updated to April 2025 revised limits
// Source: Ministry of MSME Notification S.O. 1364(E), March 21, 2025

export const msmeUdyam: LearnPageConfig = {
  slug: 'is-msme-registration-worth-it',
  title: 'Is MSME / Udyam Registration Worth It?',
  seoTitle: 'Is MSME / Udyam Registration Worth It in 2025? | Ollvy',
  seoDescription:
    'Find out if Udyam (MSME) registration makes sense for your business. Covers benefits, eligibility, credit access, government tenders, and what you actually get.',
  canonicalUrl: 'https://www.ollvy.com/guides/is-msme-registration-worth-it',
  lastReviewed: 'April 2026',
  category: 'Registration',
  ctaServiceSlug: 'gst-registration',
  relatedServiceSlugs: ['gst-registration', 'msme-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'should-i-get-dpiit-startup-recognition'],

  tool: {
    type: 'eligibility',
    title: 'Should You Register as an MSME?',
    questions: [
      {
        text: 'What is your annual turnover?',
        options: [
          { value: 'below_10cr', label: 'Below Rs. 10 crore (Micro Enterprise)' },
          { value: '10cr_100cr', label: 'Rs. 10 crore to Rs. 100 crore (Small Enterprise)' },
          { value: '100cr_500cr', label: 'Rs. 100 crore to Rs. 500 crore (Medium Enterprise)' },
          { value: 'above_500cr', label: 'Above Rs. 500 crore' },
        ],
        earlyExit: (answer: string) => {
          if (answer === 'above_500cr') {
            return {
              type: 'ineligible' as const,
              headline: 'Above the MSME ceiling.',
              body: 'Maximum turnover for Medium Enterprise is Rs. 500 crore. Your business does not qualify.',
            }
          }
          return null
        },
      },
      {
        text: 'What is the main reason you are looking at Udyam registration?',
        options: [
          { value: 'credit', label: 'Getting a business loan or better credit terms' },
          { value: 'tenders', label: 'Government tenders or GeM marketplace' },
          { value: 'subsidies', label: 'Accessing subsidies or government schemes' },
          { value: 'payments', label: 'Recovering delayed payments from large buyers' },
          { value: 'not_sure', label: 'Not sure - want to understand what I get' },
        ],
      },
      {
        text: 'Do you supply to large companies, listed firms, or government entities?',
        options: [
          { value: 'yes', label: 'Yes - we sell to corporates, PSUs, or government' },
          { value: 'no', label: 'No - mostly small businesses or end consumers' },
          { value: 'plan_to', label: 'Not yet, but planning to' },
        ],
        evaluator: (answer: string, allAnswers: string[]) => {
          const answers = [...allAnswers, answer]
          const mainReason = answers[1]
          const suppliesLarge = answers[2] === 'yes' || answers[2] === 'plan_to'

          const benefits: { label: string; relevance: 'high' | 'medium' | 'low'; reason: string; description: string }[] = []

          // Credit access
          benefits.push({
            label: 'Collateral-Free Credit (CGTMSE)',
            description: 'Loans up to Rs. 10 crore without pledging assets or a third-party guarantee',
            relevance: mainReason === 'credit' ? 'high' : 'medium',
            reason: mainReason === 'credit'
              ? 'This is your primary goal - CGTMSE is the most direct benefit'
              : 'Useful for future credit needs even if not the primary driver',
          })

          // Payment protection
          benefits.push({
            label: 'Payment Protection (MSME Samadhaan)',
            description: 'Compound interest at 3x RBI rate if large buyers delay beyond 45 days. File online, resolve in 90 days.',
            relevance: suppliesLarge ? 'high' : mainReason === 'payments' ? 'high' : 'low',
            reason: suppliesLarge
              ? 'You supply to large companies - this is your legal leverage for delayed payments'
              : 'Less relevant until you supply to companies above Rs. 250 crore turnover',
          })

          // Tenders
          benefits.push({
            label: 'Government Tender Preference',
            description: 'MSME-exclusive categories on GeM. Government departments must buy a % of procurement from MSMEs.',
            relevance: mainReason === 'tenders' ? 'high' : answers[2] === 'yes' ? 'medium' : 'low',
            reason: mainReason === 'tenders'
              ? 'This is your primary goal - GeM and tender preference directly apply'
              : 'Register and explore GeM listing even if tenders are not your immediate focus',
          })

          // Subsidies and schemes
          benefits.push({
            label: 'Subsidies and Schemes (ISO, CLSS)',
            description: 'ISO certification cost reimbursement, Credit Linked Capital Subsidy for technology upgrades.',
            relevance: mainReason === 'subsidies' ? 'high' : 'medium',
            reason: mainReason === 'subsidies'
              ? 'Several central and state government schemes are exclusively for registered MSMEs'
              : 'Available on registration - worth exploring as you grow',
          })

          // Credit card (micro only)
          if (answers[0] === 'below_10cr') {
            benefits.push({
              label: 'Udyam Credit Card',
              description: 'Rs. 5 lakh credit limit specifically for micro enterprises registered on Udyam portal.',
              relevance: mainReason === 'credit' ? 'high' : 'medium',
              reason: 'As a micro enterprise, you are eligible for the new Udyam credit card launched in Budget 2025',
            })
          }

          return {
            type: 'recommended' as const,
            headline: 'Yes - register. It is free and takes 15 minutes.',
            body: 'Udyam is free, instant, and needs only your PAN and Aadhaar. Here is what matters most for your situation.',
            ctaLabel: 'Register MSME (Free)',
            ctaHref: '/checkout/msme-registration',
            ranking: {
              type: 'benefits' as const,
              benefits,
            },
          }
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Yes - register. It is free and takes 15 minutes.',
      body: 'No cost, no inspection. Udyam registration gives you credit access, tender eligibility, and payment protection from large buyers.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT UDYAM REGISTRATION ACTUALLY IS',
      body: 'Udyam Registration is the government\'s official recognition of your business as a Micro, Small, or Medium Enterprise under the MSME Development Act, 2006. It replaced the older Udyog Aadhar system from July 1, 2020. Registration is on the Udyam portal, linked to your PAN and Aadhaar, and completely free.',
      note: 'Source: MSMED Act 2006; DPIIT Notification, June 26, 2020',
    },
    {
      number: '02',
      heading: 'DO YOU QUALIFY? (APRIL 2025 THRESHOLDS)',
      body: 'Classification uses two criteria: investment in plant/machinery/equipment AND annual turnover. Both must be met.',
      bullets: [
        'Micro Enterprise: Investment below Rs. 2.5 crore AND turnover below Rs. 10 crore',
        'Small Enterprise: Investment below Rs. 25 crore AND turnover below Rs. 100 crore',
        'Medium Enterprise: Investment below Rs. 125 crore AND turnover below Rs. 500 crore',
        'If either number exceeds the limit, you move to the next category',
        'For service businesses, office equipment, computers, and software count as "equipment"',
        'Investment is measured as written-down value (depreciated cost per IT returns) - not original purchase price',
      ],
      table: {
        caption: 'MSME Classification Thresholds - April 2025 (Notification S.O. 1364(E))',
        headers: ['Category', 'Investment Limit', 'Turnover Limit', 'Both criteria must be met'],
        rows: [
          ['Micro Enterprise', 'Up to Rs. 2.5 crore', 'Up to Rs. 10 crore', 'Either limit breached = upgrade to Small'],
          ['Small Enterprise', 'Up to Rs. 25 crore', 'Up to Rs. 100 crore', 'Either limit breached = upgrade to Medium'],
          ['Medium Enterprise', 'Up to Rs. 125 crore', 'Up to Rs. 500 crore', 'Either limit breached = no longer MSME'],
        ],
      },
      note: 'Source: Ministry of MSME Notification S.O. 1364(E), March 21, 2025. Effective April 1, 2025. These are revised limits - 2.5x higher for investment, 2x higher for turnover vs pre-2025 thresholds.',
    },
    {
      number: '03',
      heading: 'THE BENEFITS THAT ACTUALLY MATTER',
      body: '',
      bullets: [
        'Collateral-free loans: Through CGTMSE, you can get loans without putting up any collateral. Budget 2025 raised the guarantee cover to Rs. 10 crore for micro and small enterprises.',
        'Priority sector lending: Banks have MSME-specific quotas. Your loan application moves faster through the system.',
        'Government tender preference: The Government e-Marketplace has MSME-exclusive categories. Government departments are mandated to buy a percentage of procurement from MSMEs.',
        'Payment protection: If a company above Rs. 250 crore turnover has not paid you within 45 days, compound interest at 3x the RBI bank rate accrues automatically. File through MSME Samadhaan online.',
        'ISO certification reimbursement: Government reimburses the cost of ISO certification for registered MSMEs.',
        'Technology upgrade subsidies: Credit Linked Capital Subsidy Scheme (CLSS) provides capital subsidy for technology upgrades.',
      ],
      table: {
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
      },
      note: 'CGTMSE is managed jointly by SIDBI and the Ministry of MSME.',
    },
    {
      number: '04',
      heading: 'WHAT IT DOES NOT DO',
      body: '',
      bullets: [
        'Not mandatory - it is a voluntary registration',
        'Does not automatically give you a loan - it makes you eligible for specific schemes; banks still assess creditworthiness',
        'Not the same as DPIIT Startup Recognition - different programme, different benefits',
        'Does not replace GST, PF, ESI, or any other compliance',
        'No direct income tax exemption just for being an MSME',
      ],
    },
    {
      number: '05',
      heading: 'THE PAYMENT PROTECTION ANGLE IS UNDERUSED',
      body: 'If you supply to large companies and have experienced delayed payments, this might be the single most valuable reason to register.',
      bullets: [
        'Under Section 15 of the MSMED Act, buyers must pay MSME suppliers within 45 days of accepting goods or services. If there is no written agreement, the limit is 15 days.',
        'Delay beyond 45 days means compound interest at 3x RBI bank rate - automatically, without needing a court order',
        'Large companies (above Rs. 250 crore turnover) must disclose MSME payment dues in their MCA filings (MSME Form 1). This creates real corporate governance pressure.',
        'File online through the MSME Samadhaan portal - a formal, fast-resolution mechanism',
        'None of this is available if you are not registered',
      ],
      note: 'Source: Sections 15-23, Micro, Small and Medium Enterprises Development Act, 2006',
    },
    {
      number: '06',
      heading: 'THE SIMPLEST CASE FOR REGISTERING',
      body: '',
      bullets: [
        'Cost: Zero',
        'Time: 10-15 minutes on udyamregistration.gov.in with Aadhaar and PAN',
        'Downside: None - just update if you cross a classification threshold',
        'Upside: Better credit terms, tender access, payment protection, scheme eligibility',
        'Verdict: Any business below Rs. 500 crore turnover should register today',
      ],
    },
  ],

  faqs: [
    {
      q: 'Can a Pvt Ltd company register as an MSME?',
      a: 'Yes. Any business structure - sole proprietorship, partnership, LLP, or Private Limited company - can register under Udyam as long as it meets the investment and turnover criteria.',
    },
    {
      q: 'I have an old Udyog Aadhar registration. Is that still valid?',
      a: 'No. Udyog Aadhar registrations expired on December 31, 2021. Register on the new Udyam Registration portal at udyamregistration.gov.in. Old certificates are no longer accepted for scheme benefits.',
    },
    {
      q: 'Does MSME registration help with my income tax?',
      a: 'Not directly - there is no general income tax exemption for being an MSME. However, registered MSMEs may qualify for specific deductions and state-level concessions. Speak to a CA for what applies to your situation.',
    },
    {
      q: 'What happens if my turnover grows past the MSME limit?',
      a: 'Your Udyam registration is automatically reclassified to the appropriate category as your business grows - the portal syncs with your income tax return data annually. If you cross the medium enterprise ceiling (Rs. 500 crore turnover or Rs. 125 crore investment), the registration lapses.',
    },
  ],
}
