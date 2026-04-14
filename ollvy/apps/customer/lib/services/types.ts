// lib/services/types.ts

export type ServiceCategory =
  | 'Incorporation'
  | 'GST'
  | 'Tax'
  | 'Compliance'
  | 'Trademark'
  | 'Registration'
  | 'Payroll'
  | 'Licensing'
  | 'Legal'

export interface ServiceTable {
  caption: string
  headers: string[]
  rows: string[][]
}

export interface WorkflowStep {
  step: number
  title: string
  timeframe: string           // e.g. "Day 0-2"
  description: string
  milestone: string           // what gets delivered at this step
}

export interface IncludedItem {
  title: string
  description: string
  without?: string            // what you face without Ollvy
  withOllvy?: string          // what Ollvy delivers instead
}

export interface ServiceRisk {
  title: string
  description: string
}

export interface ServicePersona {
  title: string
  description: string
}

export interface ServiceFaq {
  category: string            // "General" | "Process" | "Documents" | "After Completion" | "Pricing"
  q: string
  a: string
}

export interface ServicePageConfig {
  slug: string
  title: string               // H1
  tagline: string             // one line under H1
  seoTitle: string            // <title> tag - keyword + year + brand
  seoDescription: string      // meta description - 150-160 chars, answer-first
  canonicalUrl: string
  lastReviewed: string
  category: ServiceCategory

  explainer: {
    whatItIs: string
    whyYouNeedIt: string
    whatHappensWithout: string
  }

  workflow: WorkflowStep[]
  included: IncludedItem[]
  risks: ServiceRisk[]
  personas: ServicePersona[]  // "Who this is for"
  faqs: ServiceFaq[]

  // SEO tables - rendered as structured HTML tables on the page
  govtFees: ServiceTable      // government fees only - Ollvy fee from backend
  documents: ServiceTable     // documents required

  // Internal linking
  relatedServiceSlugs?: string[]
  relatedLearnSlugs?: string[]
}
