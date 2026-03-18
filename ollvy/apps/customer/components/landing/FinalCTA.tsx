'use client'

import Link from 'next/link'

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
            Browse services, see fixed prices, and book - all before creating an account.
          </p>
        </div>
      </div>
    </section>
  )
}
