// Server Component - H1 is server-rendered for SEO
import { PenaltyCalculatorSelector } from './PenaltyCalculatorSelector'

interface PenaltyCalculatorHeaderProps {
  label: string
  href: string
}

export function PenaltyCalculatorHeader({ label, href }: PenaltyCalculatorHeaderProps) {
  return (
    <div className="mb-16 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
        Penalty Calculator
      </p>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 tracking-tight">
        {label}
      </h1>

      {/* Calculator Selector - Client Component */}
      <div className="flex justify-center mb-6">
        <PenaltyCalculatorSelector currentHref={href} currentLabel={label} />
      </div>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Calculate exact penalties based on Indian compliance law
      </p>
    </div>
  )
}
