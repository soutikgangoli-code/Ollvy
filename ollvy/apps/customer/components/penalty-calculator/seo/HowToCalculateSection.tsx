// components/penalty-calculator/seo/HowToCalculateSection.tsx

interface HowToCalculateSectionProps {
  data: {
    title: string
    steps: {
      step: number
      title: string
      description: string
      formula?: string
    }[]
    example: {
      scenario: string
      calculation: string
      result: string
    }
  }
}

export function HowToCalculateSection({ data }: HowToCalculateSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">{data.title}</h2>
      <ol className="space-y-4">
        {data.steps.map(step => (
          <li key={step.step} className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
              {step.step}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-muted-foreground">{step.description}</p>
              {step.formula && (
                <code className="mt-2 block text-sm bg-muted px-3 py-2 border border-border font-mono">
                  {step.formula}
                </code>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 p-6 bg-muted/50 border border-border">
        <h3 className="font-semibold text-foreground mb-3">Example Calculation</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Scenario: </span>
            <span className="text-foreground">{data.example.scenario}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Calculation: </span>
            <span className="text-foreground">{data.example.calculation}</span>
          </div>
          <div className="pt-2 border-t border-border">
            <span className="text-muted-foreground">Result: </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {data.example.result}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
