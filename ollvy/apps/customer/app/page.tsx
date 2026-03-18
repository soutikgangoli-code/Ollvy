import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ServiceGrid } from '@/components/landing/ServiceGrid'
import { TrustLayer } from '@/components/landing/TrustLayer'
import { Reviews } from '@/components/landing/Reviews'
import { ReferFounder } from '@/components/landing/ReferFounder'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import { getActiveServices } from '@/lib/data/services'

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

export default async function LandingPage() {
  // Fetch data from Supabase (per §23 Connection Point 1)
  const services = await getActiveServices()
  return (
    <div className="min-h-screen bg-background">
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

        {/* §14B - Refer Founder (feature flagged) */}
        <ReferFounder />

        {/* §15 - Final CTA */}
        <FinalCTA />
      </main>

      {/* §16 - Footer */}
      <Footer />
    </div>
  )
}
