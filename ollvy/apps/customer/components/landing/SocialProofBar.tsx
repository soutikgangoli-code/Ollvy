import { Star } from 'lucide-react'

export function SocialProofBar() {
  return (
    <section className="py-14 border-y border-border bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
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
