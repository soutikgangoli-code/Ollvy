'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="bg-background py-24">
      <div className="container">
        <div className="text-center">
          {/* Heading */}
          <h2 className="font-display text-[32px] md:text-5xl font-bold text-foreground max-w-[480px] mx-auto leading-tight">
            Start in 3 minutes.
            <br />
            No documents needed upfront.
          </h2>

          {/* Body */}
          <p className="text-base text-muted-foreground mt-4 max-w-[400px] mx-auto">
            Browse services, see fixed prices, and book — all before creating an account.
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <a
              href="https://apps.apple.com/app/ollvy?utm_source=homepage&utm_medium=landing&utm_content=final_cta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.ollvy&utm_source=homepage&utm_medium=landing&utm_content=final_cta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              Play Store
            </a>
            <Button variant="ghost" asChild>
              <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=final_cta">Open on Web →</Link>
            </Button>
          </div>

          {/* Trust Lines */}
          <div className="flex flex-col items-center gap-2 mt-10">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Check size={14} className="text-ollvy-green" />
              No account needed to browse services and prices
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Check size={14} className="text-ollvy-green" />
              Every order includes a GST-compliant tax invoice
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Check size={14} className="text-ollvy-green" />
              Monthly retainers have no minimum term - cancel any cycle
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
