export function SingleTestimonial() {
  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/20 pointer-events-none" />

      <div className="container max-w-4xl relative">
        <div className="text-center">
          {/* Large decorative quotation mark */}
          <div className="flex justify-center mb-8">
            <span className="text-8xl md:text-9xl font-serif text-muted-foreground/20 select-none leading-none" aria-hidden="true">
              "
            </span>
          </div>

          {/* Big quote */}
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-relaxed tracking-tight">
            I was paying ₹30,000 a year to a CA who missed 3 deadlines.
            Switched to Ollvy - <span className="text-emerald-600 dark:text-emerald-400">zero missed deadlines</span> in the last 1 month,
            and at fixed prices.
            <br /><br />
            The tracking dashboard alone is worth it - I always know where every filing stands.
          </blockquote>

          {/* Attribution */}
          <div className="mt-12 flex flex-col items-center">
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-muted/80 border-2 border-border flex items-center justify-center mb-4 shadow-sm">
              <span className="text-xl font-bold text-muted-foreground">ST</span>
            </div>
            <p className="font-bold text-lg text-foreground">Sushant Tiwari</p>
            <p className="text-muted-foreground mt-0.5">Founder, TechStartup</p>
            <p className="text-sm text-muted-foreground mt-1.5 px-3 py-1 rounded-full bg-muted/50">Pvt Ltd - 12 employees - Bangalore</p>
          </div>
        </div>
      </div>
    </section>
  )
}
