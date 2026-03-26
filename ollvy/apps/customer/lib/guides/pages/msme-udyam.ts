// lib/guides/pages/msme-udyam.ts
import { LearnPageConfig } from '../pages';

export const msmeUdyam: LearnPageConfig = {
  slug: 'is-msme-registration-worth-it',
  title: 'Is MSME / Udyam Registration Worth It?',
  seoTitle: 'Is MSME / Udyam Registration Worth It in 2025? | Ollvy',
  seoDescription: 'Find out if Udyam (MSME) registration makes sense for your business. Covers benefits, eligibility, credit access, government tenders, and what you actually get.',
  canonicalUrl: 'https://www.ollvy.com/guides/is-msme-registration-worth-it',
  lastReviewed: 'March 2025',
  category: 'Registration',
  ctaServiceSlug: 'gst-registration',
  relatedServiceSlugs: ['gst-registration'],
  relatedLearnSlugs: ['should-i-get-dpiit-startup-recognition', 'pvt-ltd-vs-llp', 'do-i-need-gst-registration'],
  // No closely related penalty calculators or document checklists for MSME

  tool: {
    type: 'eligibility',
    title: 'Should You Register as an MSME?',
    questions: [
      {
        text: "What is your business' annual turnover?",
        options: [
          { value: 'below_5cr', label: 'Below Rs. 5 crore' },
          { value: '5cr_to_250cr', label: 'Rs. 5 crore to Rs. 250 crore' },
          { value: 'above_250cr', label: 'Above Rs. 250 crore' },
        ],
        earlyExit: (answer) => {
          if (answer === 'above_250cr') {
            return {
              type: 'not_required',
              headline: 'Your business is above the MSME turnover limit.',
              body: 'MSME classification only applies to businesses with turnover up to Rs. 250 crore. Your business is above this limit.',
            };
          }
          return null;
        },
      },
      {
        text: 'What is the main reason you are looking at Udyam registration?',
        options: [
          { value: 'bank_loan', label: 'Getting a business loan or better credit terms' },
          { value: 'government_tender', label: 'Participating in government tenders or GeM' },
          { value: 'subsidy_benefits', label: 'Accessing subsidies or government schemes' },
          { value: 'just_curious', label: 'Not sure - I just want to understand if it helps me' },
        ],
        earlyExit: (answer) => {
          if (answer === 'bank_loan') {
            return {
              type: 'recommended',
              headline: 'Udyam registration will significantly help with credit.',
              body: 'Priority sector lending, CGTMSE collateral-free guarantee, and faster processing make credit significantly more accessible for Udyam-registered MSMEs.',
              ctaLabel: 'Get Udyam Registration',
            };
          }
          if (answer === 'government_tender') {
            return {
              type: 'recommended',
              headline: 'Udyam registration is essential for government tenders.',
              body: 'GeM and PSU tenders have MSME-exclusive categories and price preference. Registration unlocks these opportunities.',
              ctaLabel: 'Get Udyam Registration',
            };
          }
          if (answer === 'subsidy_benefits') {
            return {
              type: 'recommended',
              headline: 'Udyam registration unlocks scheme benefits.',
              body: 'Access to CLSS, ZED certification subsidies, and technology upgrade schemes becomes available with registration.',
              ctaLabel: 'Get Udyam Registration',
            };
          }
          return null;
        },
      },
      {
        text: 'Do you supply to large companies, listed firms, or government entities?',
        options: [
          { value: 'yes_large', label: 'Yes, we sell to corporates, PSUs, or the government' },
          { value: 'no_b2c', label: 'No, mostly small businesses or end consumers' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes_large') {
            return {
              type: 'recommended',
              headline: 'Udyam registration gives you payment protection.',
              body: 'Under the MSMED Act, your buyers must pay you within 45 days. If they do not, compound interest at 3x the RBI bank rate kicks in automatically. This protection only exists for registered MSMEs.',
              ctaLabel: 'Get Udyam Registration',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Yes - register. It is free and the benefits are real.',
      body: 'Udyam registration is free, instant, and done entirely online with just your PAN and Aadhaar. There is no cost and practically no downside. What you get in return: better access to credit, exclusive government tender categories, and legal protection if large buyers delay payment. There is almost no reason not to do this.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT UDYAM REGISTRATION ACTUALLY IS',
      body: "Udyam Registration is the government's official recognition of your business as a Micro, Small, or Medium Enterprise under the MSME Development Act, 2006. It replaced the older Udyog Aadhar system from July 1, 2020. You register on the Udyam portal, it is linked to your PAN and Aadhaar, and it is completely free. No inspection, no verification, no paperwork sent anywhere.",
      note: 'Source: MSMED Act 2006; DPIIT Notification, June 26, 2020',
    },
    {
      number: '02',
      heading: 'DO YOU QUALIFY?',
      body: 'Classification is based on two things: investment in equipment or plant and machinery, and annual turnover. Both criteria must be met.',
      bullets: [
        'Micro Enterprise: Investment below Rs. 1 crore AND turnover below Rs. 5 crore',
        'Small Enterprise: Investment below Rs. 10 crore AND turnover below Rs. 50 crore',
        'Medium Enterprise: Investment below Rs. 50 crore AND turnover below Rs. 250 crore',
        'If either number exceeds the limit, you move into the next category',
        'For service businesses, office equipment, computers, and software count as "equipment"',
      ],
      note: 'Source: Ministry of MSME Notification S.O. 2119(E), June 26, 2020',
    },
    {
      number: '03',
      heading: 'THE BENEFITS THAT ACTUALLY MATTER',
      body: 'Not everything government schemes promise is real. These ones are.',
      bullets: [
        'Loans without collateral: Through CGTMSE (the Credit Guarantee Fund Trust for Micro and Small Enterprises), you can get loans up to Rs. 2 crore without putting up any collateral or a third-party guarantee. For most small business owners, this is transformative.',
        'Priority sector lending: Banks have MSME-specific quotas and targets. Your loan application genuinely moves faster through the system.',
        'Government tender preference: The Government e-Marketplace has MSME-exclusive product and service categories. Government departments are mandated to buy a certain percentage of their procurement from MSMEs.',
        'Payment protection: If a company above Rs. 250 crore turnover has not paid you within 45 days, compound interest at 3x the RBI bank rate accrues automatically. You can file online through MSME Samadhaan and a Facilitation Council must resolve it within 90 days. This only works if you are registered.',
        'ISO certification reimbursement: Government reimburses the cost of ISO certification for registered MSMEs.',
        'Technology upgrade subsidies: Credit Linked Capital Subsidy Scheme (CLSS) provides upfront capital subsidy for technology upgrades.',
      ],
      note: 'CGTMSE is managed jointly by SIDBI and the Ministry of MSME.',
    },
    {
      number: '04',
      heading: 'WHAT IT DOES NOT DO',
      body: 'Let us clear up some common misconceptions.',
      bullets: [
        'It is not mandatory - it is a voluntary registration',
        'It does not automatically give you a loan - it makes you eligible for specific schemes; banks still assess your creditworthiness',
        'It is not the same as DPIIT Startup Recognition - those are different, with different benefits',
        'It does not replace GST, PF, ESI, or any other compliance - those are separate',
        'There is no direct income tax exemption just for being an MSME - any tax benefits require separate qualification',
      ],
    },
    {
      number: '05',
      heading: 'THE PAYMENT PROTECTION ANGLE IS UNDERUSED',
      body: 'If you supply to large companies and have experienced delayed payments, this might be the single most valuable reason to register.',
      bullets: [
        'Under Section 15 of the MSMED Act, buyers must pay MSME suppliers within 45 days of accepting goods or services. If there is no written agreement, the limit is 15 days.',
        'Delay beyond 45 days = compound interest at 3x RBI bank rate, automatically, without needing a court order',
        'Large companies (above Rs. 250 crore turnover) now have to disclose MSME payment dues in their MCA filings (MSME Form 1). This creates real corporate governance pressure.',
        'You can file online through the MSME Samadhaan portal - a formal, quick-resolution mechanism.',
        'None of this is available to you if you are not registered.',
      ],
      note: 'Source: Sections 15-23, Micro, Small and Medium Enterprises Development Act, 2006',
    },
    {
      number: '06',
      heading: 'THE SIMPLEST CASE FOR REGISTERING',
      body: '',
      bullets: [
        'Cost: Zero',
        'Time: 10-15 minutes on udyamregistration.gov.in with your Aadhaar and PAN',
        'Downside: None in practice - you just need to update if you cross a classification threshold',
        'Upside: Better credit terms, tender access, payment protection, scheme eligibility',
        'Verdict: Almost any business below Rs. 250 crore turnover should do this today',
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
      a: 'No. Udyog Aadhar registrations expired on December 31, 2021. You need to re-register on the new Udyam Registration portal at udyamregistration.gov.in. Old certificates are no longer accepted for scheme benefits.',
    },
    {
      q: 'Does MSME registration help with my income tax?',
      a: 'Not directly - there is no general income tax exemption for being an MSME. However, registered MSMEs may qualify for specific deductions and state-level concessions. Speak to a CA for what applies to your situation.',
    },
    {
      q: 'What happens if my turnover grows past the MSME limit?',
      a: 'Your Udyam registration is automatically upgraded to the appropriate category as your business grows. The portal syncs with your income tax return data annually. If you cross the medium enterprise limit altogether, the registration lapses.',
    },
  ],
};
