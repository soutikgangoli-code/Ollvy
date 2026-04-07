import { Star } from 'lucide-react'

export function SocialProofBar() {
  // On mobile (< lg), trust bar is shown inline in Hero component
  // This component only renders on desktop (lg+)
  return (
    <section className="hidden lg:block py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-5 rounded-2xl border border-border/50 bg-muted/40 backdrop-blur-sm">
          <p className="text-base text-muted-foreground">
            Trusted by <span className="text-foreground font-semibold">100+ businesses</span> across India
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500 drop-shadow-sm" />
            ))}
            <span className="ml-2 text-base font-bold text-foreground">4.8</span>
            <span className="text-sm text-muted-foreground ml-1">30+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
