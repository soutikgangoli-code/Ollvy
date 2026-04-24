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
import { getPopularServices, getFAQServicePrices, getAggregateRating, FAQServicePrices } from '@/lib/data/services'

const getCachedPopularServices = unstable_cache(getPopularServices, ['popular-services'], { tags: ['service-packages'] })
const getCachedFAQServicePrices = unstable_cache(getFAQServicePrices, ['faq-service-prices'], { tags: ['service-packages'] })
const getCachedAggregateRating = unstable_cache(getAggregateRating, ['aggregate-rating'], { tags: ['service-packages'] })
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
  description: 'Register your Pvt Ltd, LLP, get GST, trademark, FSSAI in India with verified CAs. 98% on-time delivery. Track everything in one dashboard.',
  alternates: {
    canonical: 'https://www.ollvy.com',
  },
  openGraph: {
    title: 'Company Registration, GST & Compliance Services | Ollvy',
    description: 'Register your business in India with verified CAs. 98% on-time delivery.',
    url: 'https://www.ollvy.com',
    images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Registration & Compliance Services | Ollvy',
    description: 'Register your business in India with verified CAs. 98% on-time delivery.',
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
      answer: `Both LLP (Limited Liability Partnership) and Private Limited Company are popular legal structures for Indian businesses, but they serve different needs. Both structures offer limited liability - your personal assets are protected. An LLP has far lower annual compliance requirements - no mandatory board meetings, no statutory registers, and simpler annual filings (just Form 11 and Form 8 with MCA). A Private Limited Company must hold at minimum 4 board meetings per year, maintain statutory registers, and get accounts audited regardless of turnover. If you plan to raise funding from angel investors or venture capital, Private Limited is the only viable option - LLPs cannot issue equity shares. Both are taxed at 30% flat on profits plus surcharges. Choose LLP for a services business with no funding plans. Choose Pvt Ltd if you are building a product, plan to raise funding, or want to issue ESOPs.`,
    },
    {
      question: 'How long does company registration take in India?',
      answer: `Company registration timelines in India have improved significantly since MCA21 Version 3.0 launched in 2022. Private Limited Company: Typical timeline is 12-15 working days. LLP (Limited Liability Partnership): Typical timeline is 10-12 working days. OPC (One Person Company): Typical timeline is 10-12 working days. GST Registration: Typical timeline is 5-7 working days. Trademark Registration: Filing takes 1-2 days, but the complete registration certificate takes 12-18 months. FSSAI License (State): Typical timeline is 30-45 working days. The working days timeline starts from the date all documents are approved by our CA, not from the date of payment.`,
    },
    {
      question: 'What documents are required for LLP registration in India?',
      answer: `LLP registration requires documents from two categories: each designated partner, and the registered office. For each designated partner: PAN Card (name must exactly match Aadhaar), Aadhaar Card (both front and back), passport-size photograph, and address proof such as bank statement or utility bill. For the registered office: rent agreement (if rented), No Objection Certificate (NOC) from the property owner, and utility bill not older than 2 months. A residential address is completely valid as a registered office address for an LLP. Digital Signature Certificates (DSC) for all partners are arranged by our CA as part of the service.`,
    },
    {
      question: 'How much does company registration cost in India?',
      answer: `The total cost of company registration in India has two components: professional fees and government fees (paid directly to MCA). LLP Incorporation: ${prices.llpTotal} all-in (Ollvy fee ${prices.llp} + government fees approximately Rs 500-800). Private Limited Company: ${prices.pvtLtdTotal} all-in (Ollvy fee ${prices.pvtLtd} + government fees approximately Rs 3,000-6,000). OPC Incorporation: ${prices.opcTotal} all-in (Ollvy fee ${prices.opc} + government fees approximately Rs 1,500-3,000). GST Registration: ${prices.gstTotal} all-in (Ollvy fee ${prices.gst}, government fees Rs 0). Trademark Registration: ${prices.trademarkTotal} all-in (Ollvy fee ${prices.trademark} + government fees approximately Rs 4,500-9,000). GST at 18% on professional fees is additional. Government fees are GST-exempt.`,
    },
    {
      question: 'Can I register a company using my home address in India?',
      answer: `Yes. Using a residential address as the registered office of a company or LLP is completely legal in India, and is one of the most common approaches taken by early-stage founders. There is no requirement to have a commercial office to register a company. You need an NOC from the property owner and a utility bill not older than 2 months. Once your business grows and you move to a commercial space, you can update the registered office address. Ollvy handles registered office changes as a separate service.`,
    },
    {
      question: 'What is GST registration and does my business need it?',
      answer: `GST (Goods and Services Tax) registration gives your business a GSTIN - a 15-digit unique identification number - and allows you to collect GST from customers, claim input tax credit on purchases, and trade across state lines without restrictions. GST registration is mandatory when your annual turnover exceeds Rs 40 lakhs (for goods) or Rs 20 lakhs (for services), when you sell goods or services across state lines, or when you sell on e-commerce platforms. Registration typically takes 5-7 working days. Penalty for not registering when mandatory: 10% of the tax due (minimum Rs 10,000).`,
    },
    {
      question: 'What is Director KYC and what happens if I miss the deadline?',
      answer: `Director KYC is a mandatory compliance requirement for all individuals who hold a Director Identification Number (DIN) in India - regardless of whether the company is active or not. MCA changed this from annual to triennial (every 3 years) effective March 31, 2026. It is now filed using DIR-3 KYC Web on the MCA portal. Directors who filed KYC by September 30, 2025 are covered until June 30, 2028. If you miss the deadline, your DIN is deactivated and a penalty of Rs 5,000 per director applies (flat fee, not per day). Changes to mobile, email, or address still require filing within 30 days. Ollvy files DIR-3 KYC Web within 2 working days at ${prices.directorKyc} per director.`,
    },
    {
      question: 'How does trademark registration work in India, and how long does it take?',
      answer: `Trademark registration in India gives you the exclusive legal right to use your brand name, logo, or tagline in connection with the goods or services you register it for. The process: trademark search (1-2 days), class selection, TM-A filing (1 day), examination (3-6 months), journal publication (4 months), then registration certificate. Total timeline is 12-18 months from filing to certificate. Government fees are Rs 4,500 per class for individuals, startups, and small enterprises, or Rs 9,000 per class for companies and LLPs. Ollvy's professional fee is ${prices.trademark} and covers one class, the conflict search, TM-A filing, and examination response if needed.`,
    },
    {
      question: 'What is the difference between an FSSAI registration and an FSSAI licence?',
      answer: `FSSAI compliance comes in three tiers depending on the size and nature of your food business. Basic Registration: for petty food businesses, home bakers, and small dhabas with annual turnover below Rs 12 lakhs, Ollvy fee is ${prices.fssaiBasic}. State Licence: for restaurants, bakeries, and mid-size food manufacturers with turnover between Rs 12 lakhs and Rs 20 crores, Ollvy fee is ${prices.fssaiState}. Central Licence: for large manufacturers, food importers and exporters, or businesses with turnover above Rs 20 crores, Ollvy fee is ${prices.fssaiCentral}. Penalties for operating without FSSAI range from Rs 1 lakh to Rs 10 lakhs. Zomato, Swiggy, and other food aggregators require a valid FSSAI number to list your restaurant.`,
    },
    {
      question: 'Why should I use Ollvy instead of hiring a CA directly or using IndiaFilings or Vakilsearch?',
      answer: `Ollvy gives you the same quality of CA (we vet all professionals on the platform) with fixed, transparent pricing, clear timelines, documented deliverables, and in-app tracking of every stage of your order. Ollvy has a structured in-app upload flow with per-document status, CA review, and rejection handling - all in one place. Status updates use real-time stage tracking in the app. Pricing has no hidden add-ons. Ollvy proactively surfaces upcoming compliance deadlines as a core feature. Every order is handled by a vetted, experienced CA.`,
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
  // Fetch popular services, FAQ prices, and aggregate rating from database in parallel
  const [popularServices, faqPrices, aggregateRating] = await Promise.all([
    getCachedPopularServices(),
    getCachedFAQServicePrices(),
    getCachedAggregateRating(),
  ])

  // Generate FAQ schema with live prices
  const faqJsonLd = generateFAQSchema(faqPrices)

  // AggregateRating for Ollvy as a whole (real data from DB, not hardcoded)
  const aggregateRatingJsonLd = aggregateRating ? {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ollvy',
    url: 'https://www.ollvy.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue.toString(),
      reviewCount: aggregateRating.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  } : null

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            faqJsonLd,
            ...(servicesItemListJsonLd ? [servicesItemListJsonLd] : []),
            ...(aggregateRatingJsonLd ? [aggregateRatingJsonLd] : []),
          ].map(({ '@context': _, ...rest }) => rest),
        }) }}
      />
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
        <HomeFAQ prices={faqPrices} />

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
