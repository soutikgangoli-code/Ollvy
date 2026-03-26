// lib/guides/pages/gst-registration.ts
import { LearnPageConfig } from '../pages';

export const gstRegistration: LearnPageConfig = {
  slug: 'do-i-need-gst-registration',
  title: 'Do I Need GST Registration?',
  seoTitle: 'Do I Need GST Registration in 2025? | Ollvy',
  seoDescription: 'Find out if GST registration is mandatory or optional for your business in India. Check turnover thresholds, business type, and exemptions - updated 2025.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-gst-registration',
  lastReviewed: 'March 2025',
  category: 'Tax',
  ctaServiceSlug: 'gst-registration',
  relatedServiceSlugs: ['gst-registration', 'gst-monthly-filing'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'do-i-need-to-file-itr', 'is-msme-registration-worth-it'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing', 'gst-demand-notice'],
    documentChecklists: ['gst-registration'],
  },

  tool: {
    type: 'eligibility',
    title: 'Is GST Registration Mandatory for You?',
    questions: [
      {
        text: 'What is your annual turnover - or what do you expect it to be in your first year?',
        options: [
          { value: 'below_20l', label: 'Below Rs. 20 lakh' },
          { value: '20l_to_40l', label: 'Rs. 20 lakh - Rs. 40 lakh' },
          { value: 'above_40l', label: 'Above Rs. 40 lakh' },
          { value: 'not_sure', label: 'Not sure yet' },
        ],
        earlyExit: (answer) => {
          if (answer === 'above_40l') {
            return {
              type: 'mandatory',
              headline: 'GST registration is mandatory for you.',
              body: 'Your turnover is above the Rs. 40 lakh threshold for most businesses. You must register for GST within 30 days of crossing this limit.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            };
          }
          return null;
        },
      },
      {
        text: 'What does your business actually do?',
        options: [
          { value: 'goods_only', label: 'I sell goods' },
          { value: 'services_only', label: 'I provide services' },
          { value: 'both', label: 'Both goods and services' },
          { value: 'ecommerce', label: 'I sell on Amazon, Flipkart, my own website, or any other online marketplace' },
        ],
        earlyExit: (answer) => {
          if (answer === 'ecommerce') {
            return {
              type: 'mandatory',
              headline: 'GST registration is mandatory for you.',
              body: 'If you sell through any e-commerce platform, GST registration is required from day one, regardless of how much you are making. That is the law (Section 24, CGST Act).',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            };
          }
          return null;
        },
        evaluator: (answer, allAnswers) => {
          if (answer === 'goods_only' && allAnswers[0] === '20l_to_40l') {
            // Per Section 22, CGST Act 2017: Goods threshold is Rs. 40 lakh in most states
            // Rs. 20-40 lakh for goods means NOT mandatory in regular states
            return {
              type: 'not_required',
              headline: 'GST registration is not mandatory yet.',
              body: 'For goods sellers, the threshold is Rs. 40 lakh in most states - you are below this limit. However, if you are in a special category state (Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Himachal Pradesh, Uttarakhand, or J&K), the threshold is Rs. 20 lakh and registration would be mandatory.',
            };
          }
          if (answer === 'services_only' && allAnswers[0] === '20l_to_40l') {
            return {
              type: 'mandatory',
              headline: 'GST registration is mandatory for you.',
              body: 'For services, the threshold is Rs. 20 lakh in most states. Your turnover is above this limit.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            };
          }
          if (answer === 'both' && allAnswers[0] === '20l_to_40l') {
            return {
              type: 'mandatory',
              headline: 'GST registration is likely mandatory for you.',
              body: 'For services, the threshold is Rs. 20 lakh. Since you provide both goods and services, and your turnover is above Rs. 20 lakh, registration is required.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            };
          }
          return null;
        },
      },
      {
        text: 'Do you sell to customers outside your home state?',
        options: [
          { value: 'yes_interstate', label: 'Yes, I sell across states' },
          { value: 'no_local', label: 'No, only within my state' },
          { value: 'exports', label: 'I export outside India' },
        ],
        earlyExit: (answer) => {
          if (answer === 'yes_interstate') {
            return {
              type: 'mandatory',
              headline: 'GST registration is mandatory for you.',
              body: 'The moment you sell across state lines, GST registration is required. No exceptions, no turnover threshold.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            };
          }
          if (answer === 'exports') {
            return {
              type: 'recommended',
              headline: 'You should register for GST.',
              body: 'If you export, you should register so you can claim back the GST you pay on your inputs. This is a significant financial benefit.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            };
          }
          return null;
        },
      },
      {
        text: 'Were you registered under the old tax system - VAT, Service Tax, or Excise?',
        options: [
          { value: 'yes_old', label: 'Yes, I had a VAT or Service Tax registration' },
          { value: 'no_new', label: 'No, I am starting fresh' },
          { value: 'casual_taxable', label: 'I supply occasionally - exhibitions, seasonal stalls, pop-ups' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes_old') {
            return {
              type: 'mandatory',
              headline: 'You should have migrated to GST already.',
              body: 'If you were registered under VAT or Service Tax, you were supposed to migrate to GST. If that has not happened, you need to act now.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            };
          }
          if (answer === 'casual_taxable') {
            return {
              type: 'mandatory',
              headline: 'You need to register as a casual taxable person.',
              body: 'If you supply at exhibitions or pop-ups, you need to register at least 5 days before the event.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'You do not have to register right now - but it might still make sense',
      body: 'Based on what you have told us, GST registration is not legally required yet. But here is something worth thinking about: if your clients are other businesses, being GST-registered means they can claim back the tax on what they pay you. Without that, you are making yourself less attractive than a competitor who is registered. It is also worth doing before your turnover crosses the threshold - you do not want to be scrambling mid-year.',
    },
  },

  sections: [
    {
      number: '01',
      heading: "LET'S START WITH THE BASICS",
      body: 'GST (Goods and Services Tax) registration is governed by the Central Goods and Services Tax Act, 2017. The law puts businesses into two buckets: those who must register (no choice) and those who can register voluntarily. Understanding which bucket you are in matters because running without registration when it is required can cost you up to 100% of your tax amount as a penalty - plus the possibility of prosecution.',
      note: 'Source: Central Goods and Services Tax Act, 2017',
    },
    {
      number: '02',
      heading: 'SITUATIONS WHERE YOU MUST REGISTER',
      body: 'If any of these apply to you, registration is not optional.',
      bullets: [
        'Your annual turnover crosses Rs. 40 lakh if you sell goods, or Rs. 20 lakh if you provide services - in most states',
        'You are in a special category state (J&K, Himachal Pradesh, Uttarakhand, the North-Eastern states, or Sikkim) - the threshold drops to Rs. 20 lakh for goods and Rs. 10 lakh for services',
        'You sell anything across state borders - even one order to a customer in another state means you must register',
        'You sell on Amazon, Flipkart, Meesho, your own website, or any online marketplace - register before your first sale',
        'You supply at exhibitions, seasonal stalls, or pop-ups anywhere outside your home state',
        'You are a non-resident making taxable supplies in India',
        'You are required to deduct TDS under GST (this mainly applies to government entities and PSUs)',
      ],
      note: 'Source: Sections 22 and 24, Central Goods and Services Tax Act, 2017. Once your turnover crosses the limit, you have 30 days to register.',
    },
    {
      number: '03',
      heading: 'SITUATIONS WHERE REGISTERING IS A SMART MOVE EVEN IF NOT REQUIRED',
      body: 'Even if the law does not force you to register, there are situations where doing it voluntarily just makes business sense.',
      bullets: [
        'Your clients are other GST-registered businesses - they can only claim Input Tax Credit from registered suppliers. If you are unregistered, every invoice you raise costs your client extra. That makes you harder to work with.',
        'You spend a lot on purchases - if your input costs are high (raw materials, equipment, professional services), being registered means you can claim back the GST on those purchases',
        'You export goods or services - registered exporters can get a refund on the GST they paid on inputs',
        'You want to look credible - a GSTIN on your invoices signals that you are a serious business',
        'You expect to cross the threshold within the year - better to register now than panic later',
      ],
      note: 'One catch: if you register voluntarily, you cannot cancel that registration for at least one year.',
    },
    {
      number: '04',
      heading: 'SITUATIONS WHERE YOU GENUINELY DO NOT NEED TO REGISTER',
      body: 'Some businesses are truly exempt - and that is perfectly fine.',
      bullets: [
        'Farmers selling their own produce directly - completely exempt',
        'Businesses that only deal in exempted goods or services (think: fresh milk, eggs, unprocessed food, most healthcare services, core educational services)',
        'Service providers below Rs. 20 lakh turnover who operate only within one state',
        'If all your sales are zero-rated or exempt, and you have no inter-state transactions, you likely do not need to register',
      ],
      note: 'A quick note: having a bank account, a Udyam certificate, or a shop licence does not automatically mean you need GST registration. These are separate things.',
    },
    {
      number: '05',
      heading: 'WHAT ACTUALLY HAPPENS IF YOU DO NOT REGISTER WHEN YOU SHOULD',
      body: 'Let us be direct about this - the consequences are real.',
      bullets: [
        'Penalty: Rs. 10,000 or the tax amount you should have collected - whichever is higher',
        'For evasion above Rs. 2 crore, GSTIN officers can arrest without a warrant',
        'You cannot claim Input Tax Credit on anything you bought while unregistered - that money is gone',
        'Government tenders often require a valid GSTIN - without one, you cannot bid',
        'Banks and NBFCs increasingly ask for GST returns when you apply for a working capital loan',
        'Amazon and Flipkart can suspend your seller account if your GSTIN lapses or is missing',
      ],
      note: 'For exact penalty calculations based on your situation, use our penalty calculator: /tools/penalty-calculator/gst-late-filing',
    },
    {
      number: '06',
      heading: 'A SIMPLE WAY TO DECIDE',
      body: 'Go through this list. Stop at the first YES - that is your answer.',
      bullets: [
        'Do you sell on any online marketplace? YES - register before your next sale',
        'Do you make any sales to customers in another state? YES - register before that happens',
        'Is your turnover above Rs. 40 lakh (goods) or Rs. 20 lakh (services)? YES - you have 30 days from when you crossed the limit',
        'Are you in a special category state and above Rs. 10 lakh? YES - same 30-day window',
        'Are your business clients asking for your GSTIN? YES - consider voluntary registration',
        'None of the above? You are likely exempt - just revisit this every year as you grow',
      ],
    },
  ],

  faqs: [
    {
      q: 'I am a freelancer earning Rs. 18 lakh from foreign clients. Do I need GST?',
      a: 'Services you export are treated as zero-rated under GST, which is good. But you still need to register once your total turnover crosses Rs. 20 lakh - even if all of it comes from foreign clients. The benefit is that you can then claim refunds on the GST you paid on your own expenses.',
    },
    {
      q: 'Can I use my home address for GST registration?',
      a: 'Yes, you can. Your principal place of business can be your home. You will need to upload a self-declaration, and either proof of ownership or a rent agreement along with a no-objection letter from the property owner.',
    },
    {
      q: 'I run multiple businesses. Do I need a separate GSTIN for each?',
      a: 'If your businesses are in the same state and under the same PAN, one GSTIN usually works. If they operate in different states, you need a separate GSTIN for each state. And if they are entirely separate legal entities, each one needs its own registration.',
    },
    {
      q: 'How long does GST registration actually take?',
      a: 'If you complete Aadhaar authentication during the process, approval typically comes through within 3 working days. Without Aadhaar authentication, the department may trigger a physical verification, which can stretch to 30 days.',
    },
    {
      q: 'What is the composition scheme? Should I go for it?',
      a: 'The composition scheme lets small businesses - below Rs. 1.5 crore for goods, Rs. 50 lakh for services - pay a flat tax rate (1-6%) and file quarterly instead of monthly. The tradeoff is that you cannot charge GST on your invoices, which means your B2B clients cannot claim any Input Tax Credit from you. It works well if most of your customers are end consumers, not other businesses.',
    },
    {
      q: 'Can I cancel my GST registration once I have it?',
      a: 'Voluntary registrations cannot be cancelled for at least one year. After that, you can apply if your turnover has dropped below the threshold. If you registered because you were legally required to, you can cancel once you no longer meet those conditions.',
    },
  ],
};
