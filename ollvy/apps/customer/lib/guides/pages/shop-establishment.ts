// lib/guides/pages/shop-establishment.ts
import { LearnPageConfig } from '../pages';

export const shopEstablishment: LearnPageConfig = {
  slug: 'do-i-need-shop-establishment-registration',
  title: 'Do I Need Shop and Establishment Registration?',
  seoTitle: 'Shop & Establishment Registration in India 2025 | Ollvy',
  seoDescription: 'Find out if your business needs Shop and Establishment registration in India. Covers shops, offices, restaurants, and home-based businesses - state-wise rules 2025.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-shop-establishment-registration',
  lastReviewed: 'March 2025',
  category: 'Registration',
  ctaServiceSlug: 'gst-registration',
  relatedServiceSlugs: ['gst-registration'],
  relatedLearnSlugs: ['do-i-need-professional-tax-registration', 'when-does-pf-registration-become-mandatory', 'do-i-need-fssai-license'],
  // No closely related penalty calculators or document checklists for Shop & Establishment

  tool: {
    type: 'eligibility',
    title: 'Do You Need Shop & Establishment Registration?',
    questions: [
      {
        text: 'Where does your business actually operate from?',
        options: [
          { value: 'commercial_office', label: 'A commercial office, shop, or retail outlet' },
          { value: 'home_office', label: 'My home - I work from home' },
          { value: 'factory', label: 'A factory or manufacturing unit' },
          { value: 'no_premises', label: 'No fixed premises - I am field-based or entirely online' },
        ],
        earlyExit: (answer) => {
          if (answer === 'commercial_office') {
            return {
              type: 'mandatory',
              headline: 'Shop & Establishment registration is required.',
              body: 'Most state Acts require registration of any commercial establishment within 30 days of starting business.',
              ctaLabel: 'Get S&E Registration',
            };
          }
          if (answer === 'factory') {
            return {
              type: 'not_required',
              headline: 'Factories are governed separately.',
              body: 'Factories are governed by the Factories Act 1948, not the Shop & Establishment Act. You need a separate compliance review for factory registration.',
            };
          }
          return null;
        },
      },
      {
        text: 'Do you have employees?',
        options: [
          { value: 'yes_employees', label: 'Yes, one or more employees work with me' },
          { value: 'no_employees', label: 'No, I am the only person' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'yes_employees') {
            return {
              type: 'mandatory',
              headline: 'Registration is required.',
              body: 'Practically all state S&E Acts require registration when you have employees. The certificate is also required for bank accounts, GST, and licence applications.',
              ctaLabel: 'Get S&E Registration',
            };
          }
          if (answer === 'no_employees' && allAnswers[0] === 'home_office') {
            return {
              type: 'optional',
              headline: 'May not be required - but useful to have.',
              body: 'For solo home-based businesses, registration requirements vary by state. However, having the certificate makes opening bank accounts and getting other licences easier.',
            };
          }
          return null;
        },
      },
      {
        text: 'Do you need to open a business bank account or apply for a licence soon?',
        options: [
          { value: 'yes', label: 'Yes - setting up a current account or applying for licences' },
          { value: 'no', label: 'No, I already have what I need' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes') {
            return {
              type: 'recommended',
              headline: 'You will need the S&E certificate.',
              body: 'Banks routinely ask for the S&E certificate as proof of business address when opening current accounts for sole proprietorships. It is also needed for FSSAI, GST, and most other business licences.',
              ctaLabel: 'Get S&E Registration',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'You probably need it - register to be safe',
      body: 'Shop and Establishment registration is one of the most foundational compliance steps for any commercial business. Most state Acts require it within 30 days of starting. The certificate also serves as your proof of business address for banks, FSSAI, GST, and other government offices.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT SHOP & ESTABLISHMENT REGISTRATION ACTUALLY IS',
      body: "Shop and Establishment (S&E) registration is a state-level compliance under each state's own Shops and Establishments Act. The Act regulates working hours, leaves, holidays, and employment conditions in non-factory workplaces. Registration is essentially your licence to run a commercial operation.\n\nEvery state has its own version of the law with its own rules and timelines. But the core requirement is the same across most states: if you run a commercial establishment, you register.",
      note: 'Source: State-specific Shops and Establishments Acts',
    },
    {
      number: '02',
      heading: 'WHO NEEDS TO REGISTER',
      body: 'The definition of "establishment" is broad. Here is who it covers:',
      bullets: [
        'Retail shops, trading businesses, and commercial offices',
        'Restaurants, cafes, and food establishments',
        'Hotels, boarding houses, and lodges',
        'Theatres, cinemas, and entertainment venues',
        'Warehouses',
        'IT companies, call centres, and BPOs - these are specifically called out in many state Acts',
        'Educational institutions, coaching centres, and tutorials',
        'Home-based businesses where employees come to work (state-specific)',
      ],
      note: 'Factories under the Factories Act 1948 are excluded - they have a separate compliance regime. Government establishments are also typically excluded.',
    },
    {
      number: '03',
      heading: 'WHY IT MATTERS BEYOND JUST COMPLIANCE',
      body: 'The S&E certificate does a lot of practical work for your business.',
      bullets: [
        'Opening a bank current account: Banks almost always ask for this as proof of business address for sole proprietorships and partnership firms',
        'GST registration: Accepted as proof of your principal place of business',
        'FSSAI food licence: Required in most states as a supporting document',
        'Other state licences: Liquor licence, trade licence, fire NOC - many of these ask for your S&E certificate',
        'Labour inspections: The certificate must be displayed visibly in your workplace',
      ],
    },
    {
      number: '04',
      heading: 'WHEN YOU MIGHT NOT NEED IT',
      body: '',
      bullets: [
        'Factories governed by the Factories Act have a separate, more detailed compliance regime',
        'Purely home-based freelancers with no employees and no commercial activities in states with a narrow S&E definition',
        'Agricultural businesses',
        'Government and public sector offices',
      ],
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS WITHOUT REGISTRATION',
      body: '',
      bullets: [
        'Fine: Rs. 1,000 to Rs. 10,000 depending on the state and how long you have been operating without it',
        'Repeated violations can lead to prosecution under the state Act',
        'Practically: You cannot easily open a bank current account, and many licence applications will stall without it',
        'If you have employees and are found unregistered during a labour inspection, the penalties are compounded',
      ],
    },
    {
      number: '06',
      heading: 'THE STRAIGHTFORWARD DECISION TREE',
      body: '',
      bullets: [
        'Commercial premises + any employees = Register within 30 days of starting business',
        'Commercial premises + no employees = Register anyway - most states require it regardless of staff count',
        'Home address + employees = Register in most states',
        'Home address + no employees + no commercial activity from home = Check your specific state; you may be exempt',
        'Factory = Factories Act governs you, not S&E - get a separate compliance review',
      ],
    },
  ],

  faqs: [
    {
      q: 'How long is the certificate valid? Do I need to renew it?',
      a: 'It depends on your state. Maharashtra made its certificate permanent (lifetime) after a 2017 amendment, so no renewal needed there. Delhi and Karnataka require annual renewal. Most other states require annual or once every three years.',
    },
    {
      q: 'Can I use the S&E certificate as my business address proof?',
      a: 'Yes - it is a widely accepted proof of business address. Banks, the GST portal, and most licencing authorities accept it.',
    },
    {
      q: 'I run an online business from home with no physical store. Do I still need this?',
      a: 'If you have employees working with you from that location, almost certainly yes. If you are a solo operator with no employees, it depends on your state. Either way, having the certificate makes your life easier when you need to open bank accounts or apply for other licences.',
    },
    {
      q: 'Is there a minimum number of employees before registration is required?',
      a: 'No. Most state Acts require registration of any establishment regardless of headcount - even a single-person proprietorship running from a commercial space needs to register.',
    },
  ],
};
