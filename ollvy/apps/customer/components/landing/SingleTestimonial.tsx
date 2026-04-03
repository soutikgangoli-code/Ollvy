export function SingleTestimonial() {
  return (
    <section className="py-16 md:py-28 bg-background relative overflow-hidden">

      <div className="container max-w-4xl relative px-4 md:px-6">
        <div className="text-center">
          {/* Large decorative quotation mark */}
          <div className="flex justify-center mb-4 md:mb-8">
            <span className="text-6xl md:text-8xl lg:text-9xl font-serif text-muted-foreground/20 select-none leading-none" aria-hidden="true">
              "
            </span>
          </div>

          {/* Big quote - smaller on mobile */}
          <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-foreground leading-relaxed tracking-tight">
            I was paying ₹30,000 a year to a CA who missed 3 deadlines.
            Switched to Ollvy - <span className="text-foreground font-semibold">zero missed deadlines</span> in the last 1 month,
            and at fixed prices.
            <br /><br />
            The tracking dashboard alone is worth it - I always know where every filing stands.
          </blockquote>

          {/* Attribution */}
          <div className="mt-8 md:mt-12 flex flex-col items-center">
            <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-muted/80 border-2 border-border flex items-center justify-center mb-3 md:mb-4 shadow-sm">
              <span className="text-base md:text-xl font-bold text-muted-foreground">ST</span>
            </div>
            <p className="font-bold text-base md:text-lg text-foreground">Sushant Tiwari</p>
            <p className="text-sm md:text-base text-muted-foreground mt-0.5">Founder</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1.5 px-3 py-1 rounded-full bg-muted/50">Pvt Ltd - 12 employees - Bangalore</p>
          </div>
        </div>
      </div>
    </section>
  )
}
