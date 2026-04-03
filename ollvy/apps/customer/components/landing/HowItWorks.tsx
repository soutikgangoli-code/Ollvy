'use client'

const steps = [
  {
    number: '01',
    title: 'Tell us what you run',
    body: "Answer 3 questions: business type, GST status, headcount. We show you the exact services that apply to your situation - with prices. Not ranges. Actual prices.",
  },
  {
    number: '02',
    title: 'A professional is assigned',
    body: "A verified CA, lawyer, or company secretary gets matched to your order automatically. Matched by city and service type. You don't pick them. You don't message them on WhatsApp. They show up in the app.",
  },
  {
    number: '03',
    title: 'Watch it get done',
    body: "Every stage updates in real time. Documents go in through the app. When it's done, you get a GST-compliant invoice and a completion confirmation. No chasing. No guessing.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-12 md:py-16 lg:py-20">
      <div className="container">
        {/* Section Heading - per SEO mandate Section 3.5 */}
        <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider text-foreground text-center">
          How Ollvy works
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 relative">
          {/* Desktop connector line */}
          <div className="absolute top-6 left-[16.66%] right-[16.66%] h-px border-t border-dashed border-border hidden md:block" />

          {steps.map((step) => (
            <div key={step.number} className="flex flex-col relative">
              <span className="font-mono text-5xl font-bold text-muted-foreground/20">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold mt-4 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="border-t border-border mt-16 pt-10 text-center">
          <p className="text-sm text-muted-foreground">
            From GST registration to company incorporation to monthly filings - one place, one app, one team.
          </p>
        </div>
      </div>
    </section>
  )
}
