// ─── GUIDE 7: PROFESSIONAL TAX ────────────────────────────────────────────────
import { LearnPageConfig } from '../pages'

export const professionalTax: LearnPageConfig = {
  slug: 'do-i-need-professional-tax-registration',
  title: 'Do I Need Professional Tax Registration?',
  seoTitle: 'Professional Tax Registration in India 2025: Do You Need It? | Ollvy',
  seoDescription:
    'Find out if Professional Tax applies to your business or profession in India. State-wise thresholds, who must register, and employer vs self-employed obligations.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-professional-tax-registration',
  lastReviewed: 'April 2026',
  category: 'Tax',
  ctaServiceSlug: 'payroll-management',
  relatedServiceSlugs: ['payroll-management'],

  tool: {
    type: 'eligibility',
    title: 'Does Professional Tax Apply to You?',
    questions: [
      {
        text: 'Which state is your business based in?',
        options: [
          { value: 'pt_state', label: 'Maharashtra, Karnataka, West Bengal, Tamil Nadu, Andhra Pradesh, Telangana, MP, Odisha, Kerala, or Gujarat' },
          { value: 'non_pt_state', label: 'Delhi, UP, Rajasthan, Haryana, Himachal Pradesh, or Punjab' },
          { value: 'northeast', label: 'Assam, Meghalaya, Manipur, or Tripura' },
          { value: 'other', label: 'Another state or not sure' },
        ],
        earlyExit: (answer) => {
          if (answer === 'non_pt_state') {
            return {
              type: 'not_required',
              headline: 'Professional Tax does not apply to you.',
              body: 'Delhi, UP, Rajasthan, Haryana, Himachal Pradesh, and Punjab do not levy Professional Tax. You have no PT obligation.',
            }
          }
          return null
        },
      },
      {
        text: 'What is the gross monthly income or salary we are talking about?',
        options: [
          { value: 'below_7500', label: 'Below Rs. 7,500 per month' },
          { value: 'above_7500', label: 'Above Rs. 7,500 per month' },
        ],
        earlyExit: (answer, allAnswers) => {
          if (answer === 'below_7500' && allAnswers[0] !== 'non_pt_state') {
            return {
              type: 'not_required',
              headline: 'Below the taxable threshold.',
              body: 'Most PT states set the minimum taxable income at Rs. 7,500 to Rs. 10,000 per month. Below this, no PT is due. Check your specific state\'s slab schedule to confirm.',
            }
          }
          return null
        },
      },
      {
        text: 'What is your role in this business?',
        options: [
          { value: 'employer', label: 'I am an employer with salaried staff' },
          { value: 'self_employed', label: 'I am self-employed, a freelancer, or a professional' },
          { value: 'both', label: 'Both - I own the business and also draw a salary' },
        ],
        evaluator: (answer, allAnswers) => {
          if (allAnswers[0] === 'pt_state' || allAnswers[0] === 'northeast' || allAnswers[0] === 'other') {
            if (answer === 'employer') {
              return {
                type: 'mandatory',
                headline: 'You need both PTRC and PTEC.',
                body: 'As an employer in a PT state, you need PTEC (for yourself) and PTRC (to deduct PT from employees and remit it to the state). These are two separate registrations.',
              }
            }
            if (answer === 'self_employed') {
              return {
                type: 'mandatory',
                headline: 'You need PTEC.',
                body: 'Self-employed professionals and business owners in PT states need PTEC (Professional Tax Enrollment Certificate) to pay PT on themselves.',
              }
            }
            if (answer === 'both') {
              return {
                type: 'mandatory',
                headline: 'You need both PTRC and PTEC.',
                body: 'PTEC for yourself and PTRC to handle employee deductions. Both apply when you are both a business owner and an employer.',
              }
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'not_required',
      headline: 'Professional Tax likely does not apply to you.',
      body: 'Professional Tax is a state-level tax that only exists in specific states. If you operate in Delhi, UP, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have no PT obligation.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'FIRST: DOES YOUR STATE EVEN HAVE PROFESSIONAL TAX?',
      body: 'Professional Tax is a state-level tax - the central government does not collect it. About half the states in India levy it; the other half do not. If your business is in Delhi, Uttar Pradesh, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have zero Professional Tax obligations.',
      note: 'Source: Article 276, Constitution of India. The maximum any state can charge is Rs. 2,500 per year per person.',
    },
    {
      number: '02',
      heading: 'STATES WHERE PROFESSIONAL TAX APPLIES',
      body: '',
      bullets: [
        'Maharashtra: Up to Rs. 2,500 per year',
        'Karnataka: Up to Rs. 2,496 per year',
        'West Bengal: Up to Rs. 2,500 per year',
        'Tamil Nadu: Up to Rs. 2,400 per year',
        'Andhra Pradesh and Telangana: Up to Rs. 2,500 per year',
        'Madhya Pradesh: Up to Rs. 2,100 per year',
        'Odisha: Up to Rs. 2,500 per year',
        'Kerala: Up to Rs. 2,400 per year',
        'Gujarat: Up to Rs. 2,500 per year',
        'Assam, Meghalaya, Manipur, Tripura, Jharkhand, Sikkim: PT applies with varying slabs',
      ],
      note: 'Exact slabs within each state vary by income bracket. Check your state\'s current PT schedule for the precise amounts.',
    },
    {
      number: '03',
      heading: 'IF YOU HAVE EMPLOYEES: TWO REGISTRATIONS, NOT ONE',
      body: 'In a PT state with salaried staff, you typically need two separate registrations.',
      bullets: [
        'PTEC (Professional Tax Enrollment Certificate): For you - the business owner, proprietor, partner, or director. You pay PT on yourself.',
        'PTRC (Professional Tax Registration Certificate): Authorises you to deduct PT from your employees\' salaries and deposit it with the state government. Without this, you are not authorised to make those deductions or remittances.',
        'Filing frequency (monthly, quarterly, or annual) and due dates vary by state.',
      ],
    },
    {
      number: '04',
      heading: 'WHO DOES NOT HAVE TO PAY',
      body: '',
      bullets: [
        'Individuals earning below the state minimum (typically Rs. 7,500 to Rs. 10,000 per month, depending on state)',
        'Women earning below Rs. 10,000 per month in Maharashtra',
        'Parents or guardians of children with physical or mental disabilities in some states',
        'Members of the armed forces',
        'Persons above 65 years of age in certain states',
        'Everyone in states where PT is not levied (Delhi, UP, Haryana, Rajasthan, Punjab, HP)',
      ],
    },
    {
      number: '05',
      heading: 'WHAT NON-COMPLIANCE LOOKS LIKE',
      body: '',
      bullets: [
        'Late registration penalty: Typically Rs. 5 per day in most states',
        'Interest on late payment: 1.25% per month in Maharashtra; similar in other states',
        'Penalty for not deducting or remitting: Up to 10% of unpaid amount plus arrears',
        'Assessment and prosecution by the state PT authority',
      ],
    },
    {
      number: '06',
      heading: 'THE SHORT ANSWER BASED ON YOUR SITUATION',
      body: '',
      bullets: [
        'In a PT state + have salaried employees = Get both PTRC and PTEC',
        'In a PT state + self-employed or proprietor = Get PTEC only',
        'In Delhi, UP, Haryana, Rajasthan, Punjab, or HP = Not applicable',
        'Operating in multiple states = Register separately in each PT state where you have employees or a business presence',
      ],
    },
  ],

  faqs: [
    {
      q: 'Is the Professional Tax I pay deductible anywhere?',
      a: 'Yes. Professional Tax paid on salary income is deductible under Section 16(iii) of the Income Tax Act. For self-employed individuals, it is deductible as a business expense.',
    },
    {
      q: 'I work remotely for a Bangalore company but live in Delhi. Does PT apply to me?',
      a: 'Professional Tax typically follows the employer\'s registered place of business. If your employer is in Karnataka, Karnataka\'s PT rules apply - they should be deducting PT from your salary regardless of where you live.',
    },
    {
      q: 'Does PT apply to a Pvt Ltd company?',
      a: 'Yes. The company must get PTEC and pay PT for each director who draws a salary. It must also get PTRC and deduct PT from all salaried employees. Both obligations apply separately.',
    },
  ],
}


// ─── GUIDE 8: SHOP AND ESTABLISHMENT ─────────────────────────────────────────

export const shopEstablishment: LearnPageConfig = {
  slug: 'do-i-need-shop-establishment-registration',
  title: 'Do I Need Shop and Establishment Registration?',
  seoTitle: 'Shop & Establishment Registration in India 2025 | Ollvy',
  seoDescription:
    'Find out if your business needs Shop and Establishment registration in India. Covers shops, offices, restaurants, and home-based businesses - state-wise rules 2025.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-shop-establishment-registration',
  lastReviewed: 'April 2026',
  category: 'Registration',
  ctaServiceSlug: 'gst-registration',
  relatedServiceSlugs: ['gst-registration'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  tool: {
    type: 'eligibility',
    title: 'Do You Need Shop & Establishment Registration?',
    questions: [
      {
        text: 'Where does your business actually operate from?',
        options: [
          { value: 'commercial', label: 'A commercial office, shop, or retail outlet' },
          { value: 'home', label: 'My home - I work from home' },
          { value: 'factory', label: 'A factory or manufacturing unit' },
          { value: 'none', label: 'No fixed premises - field-based or entirely online' },
        ],
        earlyExit: (answer) => {
          if (answer === 'commercial') {
            return {
              type: 'mandatory',
              headline: 'You need Shop & Establishment registration.',
              body: 'Any commercial premises requires S&E registration within 30 days of starting business in most states.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            }
          }
          if (answer === 'factory') {
            return {
              type: 'conditional',
              headline: 'Factories are governed by a different law.',
              body: 'Factories fall under the Factories Act, 1948 - not the Shops and Establishments Act. You need a separate compliance review for factory registration.',
            }
          }
          return null
        },
      },
      {
        text: 'Do you have employees?',
        options: [
          { value: 'yes', label: 'Yes, one or more employees work with me' },
          { value: 'no', label: 'No, I am the only person' },
        ],
        earlyExit: (answer, allAnswers) => {
          if (answer === 'yes' && allAnswers[0] === 'home') {
            return {
              type: 'mandatory',
              headline: 'You likely need registration.',
              body: 'Most states require S&E registration for home-based businesses with employees. Check your specific state\'s rules.',
            }
          }
          return null
        },
      },
      {
        text: 'Do you need to open a business bank account or apply for a licence soon?',
        options: [
          { value: 'yes', label: 'Yes - setting up a current account or applying for licences' },
          { value: 'no', label: 'No, I already have what I need' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'yes') {
            return {
              type: 'recommended',
              headline: 'Register - you will need the certificate.',
              body: 'The S&E certificate is widely accepted as proof of business address for bank current accounts, GST registration, FSSAI, and other licences.',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'You probably need it - register to be safe.',
      body: 'S&E registration is one of the most foundational compliance steps for any commercial business. Most state Acts require it within 30 days of starting. The certificate also serves as proof of business address for banks, FSSAI, GST, and other government offices.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT SHOP & ESTABLISHMENT REGISTRATION IS',
      body: 'Shop and Establishment (S&E) registration is a state-level compliance under each state\'s own Shops and Establishments Act. The Act regulates working hours, leaves, holidays, and employment conditions in non-factory workplaces. Registration is essentially your licence to run a commercial operation. Every state has its own version of the law, but the core requirement is the same: if you run a commercial establishment, you register.',
      note: 'Source: State-specific Shops and Establishments Acts',
    },
    {
      number: '02',
      heading: 'WHO NEEDS TO REGISTER',
      body: 'The definition of "establishment" is broad.',
      bullets: [
        'Retail shops, trading businesses, and commercial offices',
        'Restaurants, cafes, and food establishments',
        'Hotels, boarding houses, and lodges',
        'Theatres, cinemas, and entertainment venues',
        'Warehouses',
        'IT companies, call centres, and BPOs - specifically called out in many state Acts',
        'Educational institutions and coaching centres',
        'Home-based businesses where employees come to work (state-specific)',
      ],
      note: 'Factories under the Factories Act 1948 are excluded - they have a separate compliance regime. Government establishments are also typically excluded.',
    },
    {
      number: '03',
      heading: 'WHY IT MATTERS BEYOND COMPLIANCE',
      body: 'The S&E certificate does a lot of practical work.',
      bullets: [
        'Opening a bank current account: Banks almost always ask for this as proof of business address for sole proprietorships and partnership firms',
        'GST registration: Accepted as proof of your principal place of business',
        'FSSAI food licence: Required in most states as a supporting document',
        'Other licences: Liquor licence, trade licence, fire NOC - many ask for your S&E certificate',
        'Labour inspections: The certificate must be displayed visibly in your workplace',
      ],
    },
    {
      number: '04',
      heading: 'WHEN YOU MIGHT NOT NEED IT',
      body: '',
      bullets: [
        'Factories governed by the Factories Act have a separate, more detailed compliance regime',
        'Purely home-based freelancers with no employees in states with a narrow S&E definition',
        'Agricultural businesses',
        'Government and public sector offices',
      ],
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS WITHOUT REGISTRATION',
      body: '',
      bullets: [
        'Fine: Rs. 1,000 to Rs. 10,000 depending on state and how long you operated without it',
        'Repeated violations can lead to prosecution under the state Act',
        'Practically: you cannot easily open a bank current account, and many licence applications will stall',
        'If you have employees and are found unregistered during a labour inspection, penalties are compounded',
      ],
    },
    {
      number: '06',
      heading: 'THE DECISION TREE',
      body: '',
      bullets: [
        'Commercial premises + any employees = Register within 30 days of starting',
        'Commercial premises + no employees = Register anyway - most states require it regardless of staff count',
        'Home address + employees = Register in most states',
        'Home address + no employees + no commercial activity from home = Check your specific state; you may be exempt',
        'Factory = Factories Act governs you, not S&E',
      ],
    },
  ],

  faqs: [
    {
      q: 'How long is the certificate valid? Do I need to renew it?',
      a: 'It depends on your state. Maharashtra made the certificate lifetime (permanent) after a 2017 amendment - no renewal needed. Delhi and Karnataka require annual renewal. Most other states require annual or every three years.',
    },
    {
      q: 'Can I use the S&E certificate as my business address proof?',
      a: 'Yes. It is widely accepted as proof of business address. Banks, the GST portal, and most licencing authorities accept it.',
    },
    {
      q: 'I run an online business from home with no physical store. Do I still need this?',
      a: 'If you have employees working with you from that location, almost certainly yes. If you are a solo operator with no employees, it depends on your state. Having the certificate makes life easier when you need to open bank accounts or apply for other licences.',
    },
    {
      q: 'Is there a minimum number of employees before registration is required?',
      a: 'No. Most state Acts require registration of any establishment regardless of headcount - even a single-person proprietorship running from a commercial space needs to register.',
    },
  ],
}


// ─── GUIDE 9: MSME / UDYAM REGISTRATION ──────────────────────────────────────
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
        text: 'What is your business\'s annual turnover?',
        options: [
          { value: 'below_10cr', label: 'Below Rs. 10 crore' },
          { value: '10cr_500cr', label: 'Rs. 10 crore to Rs. 500 crore' },
          { value: 'above_500cr', label: 'Above Rs. 500 crore' },
        ],
        earlyExit: (answer) => {
          if (answer === 'above_500cr') {
            return {
              type: 'not_required',
              headline: 'You are above the MSME ceiling.',
              body: 'The maximum turnover for Medium Enterprise classification is Rs. 500 crore. Your business is above this and does not qualify for Udyam registration.',
            }
          }
          if (answer === 'below_10cr') {
            return {
              type: 'recommended',
              headline: 'Yes - register. It is free and takes 15 minutes.',
              body: 'At this scale, the benefits are most tangible: collateral-free loans up to Rs. 10 crore under CGTMSE, government tender preference, and payment protection from large buyers. No cost, no downside.',
              ctaLabel: 'Register MSME',
              ctaHref: '/checkout/msme-registration',
            }
          }
          return null
        },
      },
      {
        text: 'What is the main reason you are looking at Udyam registration?',
        options: [
          { value: 'credit', label: 'Getting a business loan or better credit terms' },
          { value: 'tenders', label: 'Participating in government tenders or GeM' },
          { value: 'subsidies', label: 'Accessing subsidies or government schemes' },
          { value: 'not_sure', label: 'Not sure - just want to understand if it helps' },
        ],
        evaluator: (answer) => {
          if (answer === 'credit') {
            return {
              type: 'recommended',
              headline: 'Register - the credit benefits are real.',
              body: 'CGTMSE provides collateral-free loan guarantees for registered MSMEs up to Rs. 10 crore (increased in Budget 2025). Banks have mandatory MSME lending targets. Your loan application moves faster.',
              ctaLabel: 'Register MSME',
              ctaHref: '/checkout/msme-registration',
            }
          }
          return null
        },
      },
      {
        text: 'Do you supply to large companies, listed firms, or government entities?',
        options: [
          { value: 'yes', label: 'Yes, we sell to corporates, PSUs, or the government' },
          { value: 'no', label: 'No, mostly small businesses or end consumers' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes') {
            return {
              type: 'recommended',
              headline: 'Register - the payment protection alone is worth it.',
              body: 'If a company above Rs. 250 crore turnover has not paid you within 45 days, compound interest accrues automatically at 3x the RBI bank rate. You can file through MSME Samadhaan online. None of this is available without registration.',
              ctaLabel: 'Register MSME',
              ctaHref: '/checkout/msme-registration',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Yes - register. It is free and the benefits are real.',
      body: 'Udyam registration is free, instant, and done entirely online with just your PAN and Aadhaar. No inspection, no paperwork. What you get: better access to credit, exclusive government tender categories, and legal protection if large buyers delay payment. There is no reason not to do this.',
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
