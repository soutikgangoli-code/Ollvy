// Startup compliance stack — ordered by dependency.
// `prerequisite` is a slug that must be marked done (or also added to cart) before
// this service can be added. `isRetainer` services are excluded from the bundle
// cart and shown with a "book separately" link instead.

export interface StartupStackService {
  slug: string
  note: string
  prerequisite: string | null
  prereqNote?: string
  isRetainer?: boolean
}

export interface StartupStackStage {
  stage: number
  label: string
  tagline: string
  services: StartupStackService[]
}

export const STARTUP_STACK: StartupStackStage[] = [
  {
    stage: 1,
    label: 'Start here',
    tagline: 'Days 0-15',
    services: [
      {
        slug: 'pvt-ltd-incorporation',
        note: 'Required before anything else can be registered.',
        prerequisite: null,
      },
      {
        slug: 'startup-india',
        note: 'Apply 5 days after CIN is issued.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires CIN from incorporation',
      },
      {
        slug: 'msme-registration',
        note: 'Apply same week as DPIIT. Different registration, different benefits.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires CIN',
      },
    ],
  },
  {
    stage: 2,
    label: 'First 60 days',
    tagline: 'Days 15-60',
    services: [
      {
        slug: 'gst-registration',
        note: 'Mandatory above ₹40L turnover. Get it now if you plan to invoice B2B clients.',
        prerequisite: null,
      },
      {
        slug: 'trademark-registration',
        note: 'Your brand protection. File before you go public.',
        prerequisite: null,
      },
      {
        slug: 'director-kyc',
        note: "Annual - due Sep 30. Set it up now so it's not forgotten.",
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires active DIN from incorporation',
      },
    ],
  },
  {
    stage: 3,
    label: 'Monthly compliance',
    tagline: 'Month 2 onwards',
    services: [
      {
        slug: 'gst-monthly',
        note: 'GSTR-1 and GSTR-3B. Due 11th and 20th every month. One CA handles both.',
        prerequisite: 'gst-registration',
        prereqNote: 'Requires active GSTIN',
        isRetainer: true,
      },
      {
        slug: 'tds-monthly-compliance',
        note: 'Required once you start making vendor payments above ₹30,000 in a quarter.',
        prerequisite: null,
        isRetainer: true,
      },
    ],
  },
  {
    stage: 4,
    label: 'Annual',
    tagline: 'Year-end obligations',
    services: [
      {
        slug: 'mca-annual-filing',
        note: 'AOC-4 and MGT-7. Due Sep 30. Mandatory for all Pvt Ltd companies.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires active CIN',
      },
      {
        slug: 'business-itr',
        note: 'ITR-6 for Pvt Ltd. Due Oct 31. Required even if the company made no profit.',
        prerequisite: 'pvt-ltd-incorporation',
        prereqNote: 'Requires active CIN',
      },
    ],
  },
]

export const STARTUP_STACK_SLUGS: string[] = STARTUP_STACK.flatMap((s) =>
  s.services.map((svc) => svc.slug)
)
