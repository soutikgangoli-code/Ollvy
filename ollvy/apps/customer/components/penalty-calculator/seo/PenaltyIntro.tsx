// components/penalty-calculator/seo/PenaltyIntro.tsx

interface PenaltyIntroProps {
  data: {
    title: string
    description: string
    keyInfo: { label: string; value: string }[]
  }
}

export function PenaltyIntro({ data }: PenaltyIntroProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">{data.title}</h2>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {data.description}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.keyInfo.map((info, index) => (
          <div
            key={index}
            className="p-4 bg-muted/50 border border-border"
          >
            <dt className="text-sm text-muted-foreground">{info.label}</dt>
            <dd className="mt-1 font-medium text-foreground">{info.value}</dd>
          </div>
        ))}
      </div>
    </section>
  )
}
