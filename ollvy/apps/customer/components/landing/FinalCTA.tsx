'use client'

import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="bg-background pt-12 pb-24">
      <div className="container">
        <div className="text-center">
          {/* Heading */}
          <h2 className="font-display text-[28px] md:text-5xl font-bold text-foreground leading-tight">
            Start in 3 minutes.
            <br />
            No documents needed upfront.
          </h2>

          {/* Body */}
          <p className="text-base text-muted-foreground mt-4 max-w-xs md:max-w-none mx-auto md:whitespace-nowrap">
            Browse services, see fixed prices, and book - all before creating an account.
          </p>
        </div>
      </div>
    </section>
  )
}
