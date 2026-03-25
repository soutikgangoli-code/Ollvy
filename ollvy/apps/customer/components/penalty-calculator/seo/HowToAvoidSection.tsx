// components/penalty-calculator/seo/HowToAvoidSection.tsx

interface HowToAvoidSectionProps {
  data: { title: string; description: string }[]
}

export function HowToAvoidSection({ data }: HowToAvoidSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">
        How to Avoid These Penalties
      </h2>
      <div className="space-y-6">
        {data.map((tip, index) => (
          <div key={index}>
            <h3 className="text-lg font-medium text-foreground mb-2">{tip.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{tip.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
