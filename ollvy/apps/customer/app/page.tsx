import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ServiceGrid } from '@/components/landing/ServiceGrid'
import { TrustLayer } from '@/components/landing/TrustLayer'
import { Reviews } from '@/components/landing/Reviews'
import { ReferFounder } from '@/components/landing/ReferFounder'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import { HomeFAQ } from '@/components/landing/HomeFAQ'
import { MobileBottomCTA } from '@/components/landing/MobileBottomCTA'
import { getActiveServices } from '@/lib/data/services'
import Script from 'next/script'

/**
 * Homepage - Discovery layer
 *
 * Per spec §23 - Backend Bridge:
 * ISR - revalidate: 3600 (rebuilds hourly)
 *
 * Per spec architecture decision (§18):
 * - Homepage is for discovery: "What is Ollvy? What services exist? Can I trust this?"
 * - Service pages handle conversion: pricing details, process steps, testimonials, FAQs
 *
 * Sections moved to /tools:
 * - §8 PenaltyCalculator → /tools/penalty-calculator/*
 * - §12A DocumentChecklist → /tools/documents/*
 */

// Per §23: ISR - revalidate: 3600 (rebuilds hourly)
export const revalidate = 3600

// JSON-LD Structured Data per SEO Mandate Section 3.3
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ollvy',
  url: 'https://www.ollvy.com',
  logo: 'https://www.ollvy.com/logo.png',
  description: "India's compliance platform - company registration, GST, trademark, FSSAI and more with vetted CAs.",
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressLocality: 'New Delhi',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://twitter.com/ollvy',
    'https://linkedin.com/company/ollvy',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between an LLP and a Private Limited Company in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both LLP and Private Limited Company offer limited liability. LLP has lower compliance burden - no mandatory board meetings, simpler annual filings. Pvt Ltd is required if you plan to raise funding or issue ESOPs. LLP suits services businesses with 2-5 partners. Pvt Ltd suits product companies and fundable startups.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does company registration take in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LLP registration takes 10-12 working days. Private Limited Company takes 12-15 working days. GST registration takes 5-7 working days. Trademark filing takes 1-2 days, with full registration in 12-18 months. Timelines start from the date all documents are approved by our CA.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are required for LLP registration in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For each partner: PAN Card, Aadhaar Card (both sides), passport-size photograph (white background), and address proof (bank statement or utility bill under 2 months). For the registered office: rent agreement, NOC from property owner, and a utility bill. DSC for all partners is arranged by our CA as part of the service.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does company registration cost in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LLP Incorporation costs Rs 7,999 (Ollvy fee) plus Rs 500-800 government fees plus 18% GST. Private Limited Company costs Rs 9,999 plus Rs 3,000-6,000 government fees plus 18% GST. GST Registration costs Rs 2,999 with no government fees. All Ollvy prices are fixed - no hidden add-ons.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I register a company using my home address in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Using a residential address as the registered office is completely legal in India. You need an NOC from the property owner (Ollvy provides a template) and a utility bill for the address not older than 2 months. You can change the registered office address later when you move to a commercial space.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is GST registration and does my business need it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GST registration is mandatory if your annual turnover exceeds Rs 40 lakhs (goods) or Rs 20 lakhs (services), if you sell across state lines, or if you sell on e-commerce platforms. Even if below the threshold, voluntary registration is advisable if your clients are GST-registered businesses. Penalty for non-registration when mandatory is 10% of tax due (minimum Rs 10,000).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Director KYC and what happens if I miss the deadline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Director KYC (Form DIR-3 KYC) is a mandatory annual filing for all DIN holders, due by 30 September each year. Missing the deadline deactivates your DIN - you cannot sign company documents or file MCA forms. The penalty for late filing is Rs 5,000 per director, paid to MCA. Ollvy sends reminders 30, 7, and 1 day before the deadline.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does trademark registration work in India, and how long does it take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Trademark registration involves a conflict search (1-2 days), TM-A filing (1 day), government examination (3-6 months), journal publication (4 months), and certificate issuance. Total time is 12-18 months. You can use the TM symbol from the date of filing. Government fees are Rs 4,500 per class for individuals and startups, Rs 9,000 for companies.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between an FSSAI registration and an FSSAI licence?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FSSAI Basic Registration is for food businesses with turnover below Rs 12 lakhs. State Licence is for restaurants, bakeries, and mid-size manufacturers with turnover between Rs 12 lakhs and Rs 20 crores. Central Licence is for large manufacturers, importers/exporters, and chains with 21 or more outlets or multi-state operations. Operating without a valid FSSAI licence attracts penalties of Rs 1-10 lakhs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why should I use Ollvy instead of hiring a CA directly or using IndiaFilings or Vakilsearch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ollvy gives you the same quality of CA as hiring directly - with fixed transparent pricing, in-app document upload (not WhatsApp), real-time stage tracking, and a structured document vault. Compared to IndiaFilings and Vakilsearch, Ollvy has a product-grade experience: no hidden add-ons, no email-only updates, and a compliance calendar that proactively surfaces upcoming deadlines.',
      },
    },
  ],
}

export default async function LandingPage() {
  // Fetch data from Supabase (per §23 Connection Point 1)
  const services = await getActiveServices()
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* JSON-LD Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      {/* Main content with padding for fixed navbar */}
      <main className="pt-16">
        {/* §2 - Hero */}
        <Hero />

        {/* §5 - Service Grid (per §23: data from Supabase) */}
        <ServiceGrid services={services} />

        {/* §4 - How It Works */}
        <HowItWorks />

        {/* §6 - Trust Layer (4 cards + authority logos) */}
        <TrustLayer />

        {/* §13 - Reviews */}
        <Reviews />

        {/* Homepage FAQ - per SEO mandate Section 2 */}
        <HomeFAQ />

        {/* §14B - Refer Founder (feature flagged) */}
        <ReferFounder />

        {/* §15 - Final CTA */}
        <FinalCTA />
      </main>

      {/* §16 - Footer */}
      <Footer />

      {/* Mobile sticky CTA */}
      <MobileBottomCTA />
    </div>
  )
}
