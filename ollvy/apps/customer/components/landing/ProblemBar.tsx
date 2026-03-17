'use client'

const problems = [
  {
    title: 'Missed deadlines',
    arrow: '→ and you only hear about it from a notice',
    lines: [
      'GSTR-3B was due on the 20th.',
      'Your CA missed it. ₹50/day started accruing.',
      'You found out two months later.',
    ],
  },
  {
    title: 'No fixed price',
    arrow: '→ the invoice arrives after the work',
    lines: [
      'You asked for a quote. You got a vague range.',
      'The final number was higher. Always.',
      'No scope document. No recourse.',
    ],
  },
  {
    title: 'Zero visibility',
    arrow: "→ filed or not filed, you genuinely don't know",
    lines: [
      'You sent the documents over WhatsApp.',
      "CA said it's done. You have no proof.",
      'No invoice. No acknowledgement. Nothing.',
    ],
  },
]

export function ProblemBar() {
  return (
    <section className="bg-card py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {problems.map((problem) => (
            <div key={problem.title} className="px-8 py-8 md:py-0 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0">
              <p className="text-base font-semibold text-foreground">{problem.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{problem.arrow}</p>
              <div className="mt-4 space-y-1">
                {problem.lines.map((line, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground italic max-w-[560px] mx-auto">
            Every service on Ollvy has a price before you pay, a professional assigned
            automatically, and a status you can check right now. That's the entire product.
          </p>
        </div>
      </div>
    </section>
  )
}
