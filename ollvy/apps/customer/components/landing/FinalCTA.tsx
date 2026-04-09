import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden">

      <div className="container max-w-3xl text-center relative">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
          Start in 2 minutes.<br />
          No documents needed upfront.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-xl mx-auto">
          Browse services, see fixed prices, and book - all before creating an account.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button size="lg" className="px-12 h-14 text-base font-semibold rounded-2xl shadow-lg shadow-primary/25" asChild>
            <Link href="/services" prefetch={true}>
              Browse services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Questions? <a href="mailto:care@ollvy.com" className="text-foreground font-medium underline underline-offset-4">care@ollvy.com</a>
        </p>
      </div>
    </section>
  )
}
