import type { ServicePageConfig } from '../types'

export const esopStructuring: Partial<ServicePageConfig> = {
  slug: 'esop-structuring',
  title: 'ESOP Structuring',
  tagline: 'Give equity to the people building your company. ESOP scheme, board approval, grant letters - 7 working days.',
  seoTitle: 'ESOP Structuring for Startups India | ₹9,999 | Ollvy',
  seoDescription: 'Set up a legally compliant ESOP scheme for your Pvt Ltd in 7 working days. Includes scheme document, board and shareholder resolutions, grant letter templates, vesting schedule, and FMV valuation note. Rs 9,999 all-in.',
  canonicalUrl: 'https://www.ollvy.com/services/esop-structuring',
  lastReviewed: 'April 2026',
  category: 'Legal',

  govtFees: {
    caption: 'Government Fees - ESOP Structuring',
    headers: ['Item', 'Fee', 'Notes'],
    rows: [
      ['ESOP scheme setup', 'Nil', 'No government fee for creating the ESOP scheme itself'],
      ['Board resolution filing', 'Nil', 'Board resolution is internal - no MCA filing required at scheme stage'],
      ['Shareholder special resolution', 'Nil', 'Filed as part of annual return (MGT-7) - no separate fee at this stage'],
      ['PAS-3 on share allotment (at exercise)', 'Rs. 200-500', 'Filed when employees actually exercise options - not at scheme setup stage'],
      ['Stamp duty on share certificates', 'State-specific', 'Applies only when shares are actually allotted on exercise'],
    ],
  },

  documents: {
    caption: 'Documents Required - ESOP Structuring',
    headers: ['Document', 'Required From', 'Notes'],
    rows: [
      ['Certificate of Incorporation', 'Company', 'Confirms the company is a Pvt Ltd - ESOPs are not available for LLPs'],
      ['Articles of Association (AOA)', 'Company', 'Checked for any restrictions on share transfer or issuance'],
      ['Current shareholding pattern', 'Company', 'Form MGT-7 extract or share register - needed to calculate pool size'],
      ['Cap table (if available)', 'Founders', 'Shows existing equity split. If not available, Ollvy builds one from incorporation docs'],
      ['List of ESOP recipients', 'Founders', 'Names, roles, proposed option counts, and start dates'],
      ['Latest valuation report (if available)', 'Company', 'Used for FMV baseline. If not available, Ollvy prepares an FMV note'],
    ],
  },
}
