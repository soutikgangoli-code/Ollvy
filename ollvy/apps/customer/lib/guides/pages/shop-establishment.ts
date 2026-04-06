import { LearnPageConfig } from '../pages'

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
          if (answer === 'yes' && allAnswers?.[0] === 'home') {
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
      table: {
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
      },
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
      table: {
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
      },
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
