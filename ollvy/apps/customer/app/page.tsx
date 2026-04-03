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
import { getPopularServices } from '@/lib/data/services'
// Direct imports for SEO crawlability - dynamic imports hide content from Google
import { ProductShowcase } from '@/components/landing/ProductShowcase'
import { HomeFAQ } from '@/components/landing/HomeFAQ'

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

export default async function LandingPage() {
  // Fetch popular services from database
  const popularServices = await getPopularServices()

  // BreadcrumbList schema for homepage
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.ollvy.com',
      },
    ],
  }

  // Organization schema
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ollvy Technologies Private Limited',
    url: 'https://www.ollvy.com',
    logo: 'https://www.ollvy.com/logo.png',
    description: 'Company Registration, GST & Compliance Services in India',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [],
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
