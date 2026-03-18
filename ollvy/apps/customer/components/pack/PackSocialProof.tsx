import { Star, CheckCircle } from 'lucide-react'
import type { PackReview, PackPersona } from '@/lib/data/packs/cloud-kitchen'

export function PackSocialProof({
  stats,
  keywordChips,
  reviews,
  personas,
}: {
  stats: Array<{ value: string; label: string }>
  keywordChips: string[]
  reviews: PackReview[]
  personas: PackPersona[]
}) {
  return (
    <div className="space-y-12">
      {/* Stats */}
      <div>
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
          OUR TRACK RECORD
        </p>
        <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground mb-6">
          NUMBERS THAT MATTER
        </h2>

        <div className="grid grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="border border-border rounded-2xl p-6 text-center"
            >
              <p className="font-mono text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword chips */}
      <div className="flex flex-wrap gap-2">
        {keywordChips.map((chip) => (
          <span
            key={chip}
            className="border border-border rounded-full px-4 py-2 text-xs text-muted-foreground"
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Reviews */}
      <div>
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-6">
          CUSTOMER REVIEWS
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="border border-border rounded-2xl p-6"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, starI) => (
                  <Star
                    key={starI}
                    size={12}
                    className={
                      starI < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-2">
                  {review.date}
                </span>
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground leading-relaxed">
                "{review.quote}"
              </p>

              {/* Reviewer */}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {review.city} - {review.businessType}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500">
                  <CheckCircle size={10} />
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personas */}
      <div>
        <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
          SITUATIONS WE HANDLE
        </p>
        <h3 className="font-mono uppercase tracking-wider text-xl text-foreground mb-6">
          MESSY SITUATIONS. RESOLVED.
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          {personas.map((persona, i) => (
            <div
              key={i}
              className="border border-border rounded-2xl p-6 flex items-start gap-4"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="font-mono text-sm font-medium text-foreground">
                  {i + 1}
                </span>
              </div>

              {/* Content */}
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  {persona.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {persona.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
