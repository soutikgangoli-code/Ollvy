import { Metadata } from 'next'
import { NavbarServer } from '@/components/landing/NavbarServer'
import { Hero } from '@/components/landing/Hero'
import { SocialProofBar } from '@/components/landing/SocialProofBar'
import { FearRelief } from '@/components/landing/FearRelief'
import { SingleTestimonial } from '@/components/landing/SingleTestimonial'
import { ServicesSimplified } from '@/components/landing/ServicesSimplified'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import { MobileBottomCTA } from '@/components/landing/MobileBottomCTA'
import { unstable_cache } from 'next/cache'
import { getPopularServices, getFAQServicePrices, FAQServicePrices } from '@/lib/data/services'

const getCachedPopularServices = unstable_cache(getPopularServices, ['popular-services'], { revalidate: 3600 })
const getCachedFAQServicePrices = unstable_cache(getFAQServicePrices, ['faq-service-prices'], { revalidate: 3600 })
import dynamic from 'next/dynamic'

const ProductShowcase = dynamic(() => import('@/components/landing/ProductShowcase').then(m => ({ default: m.ProductShowcase })))
const HomeFAQ = dynamic(() => import('@/components/landing/HomeFAQ').then(m => ({ default: m.HomeFAQ })))

/**
 * Homepage - Mercury-Inspired Redesign
 *
 * Structure (8 sections):
 * 1. Hero - Bold claim + 98% stat + dashboard screenshot
 * 2. Social Proof Bar - Founder avatars + 4.8 rating
 * 3. Fear -> Relief - Penalty costs vs Ollvy peace
 * 4. Product Showcase - 4 dashboard screenshots
 * 5. Single Testimonial - One founder story with numbers
 * 6. Services - 6 cards + "View all" link
 * 7. FAQ - Top 5 questions + link to full /faq page
 * 8. Final CTA - Strong close
 *
 * Removed: HowItWorks, TrustLayer carousel, Reviews carousel
 */

// Homepage metadata for SEO
export const metadata: Metadata = {
  title: 'Company Registration, GST & Compliance Services India | Ollvy',
  description: 'Register your Pvt Ltd, LLP, get GST, trademark, FSSAI with verified CAs. 98% on-time delivery. Track everything in one dashboard.',
  alternates: {
    canonical: 'https://www.ollvy.com',
  },
  openGraph: {
    title: 'Company Registration, GST & Compliance Services | Ollvy',
    description: 'Register your business with verified CAs. 98% on-time delivery.',
    url: 'https://www.ollvy.com',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Registration & Compliance Services | Ollvy',
    description: 'Register your business with verified CAs. 98% on-time delivery.',
  },
}

// Per §23: ISR - revalidate: 3600 (rebuilds hourly)
export const revalidate = 3600

/**
 * Generate FAQ schema with live prices from database
 * This ensures Google sees current prices in FAQ rich results
 */
function generateFAQSchema(prices: FAQServicePrices) {
  const faqs = [
    {
      question: 'What is the difference between an LLP and a Private Limited Company in India?',
      answer: `An LLP has lower compliance (no board meetings, simpler filings) and costs less annually. A Pvt Ltd lets you raise VC funding, issue ESOPs, and is preferred for product startups. Both offer limited liability and are taxed at 30%. LLP registration: ${prices.llp} plus govt fees, 10-12 working days. Pvt Ltd: ${prices.pvtLtd} plus govt fees, 12-15 working days.`,
    },
    {
      question: 'How long does company registration take in India?',
      answer: `Pvt Ltd: 12-15 working days. LLP: 10-12 working days. OPC: 10-12 working days. GST: 5-7 working days. Trademark filing: 1-2 days (certificate takes 12-18 months). FSSAI State Licence: 30-45 working days. Timelines start after document approval by your assigned CA.`,
    },
    {
      question: 'What documents are required for LLP registration in India?',
      answer: `Per partner: PAN card, Aadhaar card, passport-size photo, and address proof (bank statement or utility bill). For registered office: rent agreement (if rented), NOC from property owner, and utility bill not older than 2 months. A home address is valid as registered office. DSCs are arranged by your CA.`,
    },
    {
      question: 'How much does company registration cost in India?',
      answer: `LLP: ${prices.llp} plus Rs 500-800 govt fees. Pvt Ltd: ${prices.pvtLtd} plus Rs 3,000-6,000 govt fees. OPC: ${prices.opc} plus Rs 1,500-3,000 govt fees. GST: ${prices.gst} (no govt fees). Trademark: ${prices.trademark} plus Rs 4,500-9,000 govt fees. All prices exclude 18% GST on professional fees.`,
    },
    {
      question: 'Can I register a company using my home address in India?',
      answer: `Yes. A residential address is completely legal as the registered office for a company or LLP. You need an NOC from the property owner and a utility bill not older than 2 months. You can change the address later when you move to a commercial space.`,
    },
    {
      question: 'What is GST registration and does my business need it?',
      answer: `GST registration is mandatory if turnover exceeds Rs 40 lakhs (goods) or Rs 20 lakhs (services), or if you sell interstate or on e-commerce platforms. It takes 5-7 working days. Penalty for non-registration: 10% of tax due (minimum Rs 10,000). Ollvy fee: ${prices.gst}.`,
    },
    {
      question: 'What is Director KYC and what happens if I miss the deadline?',
      answer: `Director KYC (DIR-3 KYC) is mandatory annually by 30 September for all DIN holders. Missing the deadline deactivates your DIN with a Rs 5,000 penalty per director. Ollvy sends automated reminders and handles filing at ${prices.directorKyc} per director.`,
    },
    {
      question: 'How does trademark registration work in India, and how long does it take?',
      answer: `Trademark registration takes 12-18 months total: search (1-2 days), TM-A filing (1 day), examination (3-6 months), journal publication (4 months), then certificate. Govt fees: Rs 4,500 per class for startups, Rs 9,000 for companies. Ollvy fee: ${prices.trademark} including search, filing, and examination response.`,
    },
    {
      question: 'What is the difference between an FSSAI registration and an FSSAI licence?',
      answer: `Basic Registration: turnover below Rs 12 lakhs, fee ${prices.fssaiBasic}. State Licence: Rs 12 lakhs to Rs 20 crores, fee ${prices.fssaiState}. Central Licence: above Rs 20 crores or multi-state, fee ${prices.fssaiCentral}. Operating without FSSAI attracts Rs 1-10 lakh penalties and blocks listing on Zomato/Swiggy.`,
    },
    {
      question: 'Why should I use Ollvy instead of hiring a CA directly or using IndiaFilings or Vakilsearch?',
      answer: `Ollvy offers fixed transparent pricing, in-app document upload with CA review, real-time order tracking, and proactive compliance reminders. Unlike IndiaFilings or Vakilsearch, there are no upsells or WhatsApp-based document collection. Every order is handled by a vetted CA with clear timelines and guaranteed deliverables.`,
    },
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export default async function LandingPage() {
  // Fetch popular services and FAQ prices from database in parallel
  const [popularServices, faqPrices] = await Promise.all([
    getCachedPopularServices(),
    getCachedFAQServicePrices(),
  ])

  // Generate FAQ schema with live prices
  const faqJsonLd = generateFAQSchema(faqPrices)

  // ItemList schema for popular services (shows as carousel in Google)
  // Note: Organization, WebSite, and SiteNavigation schemas are in StructuredData (root layout)
  const servicesItemListJsonLd = popularServices.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Popular Compliance Services',
    description: 'Most popular business registration and compliance services on Ollvy',
    itemListElement: popularServices.slice(0, 6).map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: `https://www.ollvy.com/services/${service.slug}`,
        provider: {
          '@type': 'Organization',
          name: 'Ollvy',
        },
        offers: {
          '@type': 'Offer',
          price: service.ollvyFee.toString(),
          priceCurrency: 'INR',
        },
      },
    })),
  } : null

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {servicesItemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesItemListJsonLd) }}
        />
      )}
      <NavbarServer />

      {/* Main content with padding for fixed navbar */}
      <main className="pt-16">
        {/* Section 1 - Hero: Bold claim + product screenshot */}
        <Hero />

        {/* Section 2 - Social Proof Bar: Founder avatars + rating */}
        <SocialProofBar />

        {/* Section 3 - Services: Simplified grid (moved up) */}
        <ServicesSimplified services={popularServices} />

        {/* Section 4 - Fear -> Relief: Penalty costs vs Ollvy peace */}
        <FearRelief />

        {/* Section 5 - Product Showcase: Dashboard screenshots */}
        <ProductShowcase />

        {/* Section 6 - Single Testimonial: One powerful story */}
        <SingleTestimonial />

        {/* Section 7 - FAQ: Key questions */}
        <HomeFAQ />

        {/* Section 8 - Final CTA: Strong close */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile sticky CTA */}
      <MobileBottomCTA />
    </div>
  )
}
