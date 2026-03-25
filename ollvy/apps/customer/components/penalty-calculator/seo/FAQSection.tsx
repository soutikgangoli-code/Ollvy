// components/penalty-calculator/seo/FAQSection.tsx

interface FAQSectionProps {
  data: { question: string; answer: string }[]
}

export function FAQSection({ data }: FAQSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {data.map((faq, index) => (
          <div key={index} className="border-b border-border pb-6 last:border-0">
            <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
