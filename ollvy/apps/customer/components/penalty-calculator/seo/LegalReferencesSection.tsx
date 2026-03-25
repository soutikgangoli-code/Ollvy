// components/penalty-calculator/seo/LegalReferencesSection.tsx

interface LegalReferencesSectionProps {
  data: {
    sections: {
      section: string
      description: string
    }[]
    notifications?: {
      number: string
      summary: string
    }[]
  }
}

export function LegalReferencesSection({ data }: LegalReferencesSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Legal References</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Statutory Sections</h3>
        <ul className="space-y-3">
          {data.sections.map((item, index) => (
            <li key={index} className="flex flex-col sm:flex-row sm:gap-4">
              <span className="font-medium text-foreground shrink-0 sm:w-64">
                {item.section}
              </span>
              <span className="text-muted-foreground">{item.description}</span>
            </li>
          ))}
        </ul>
      </div>

      {data.notifications && data.notifications.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-lg font-medium text-foreground">Relevant Notifications</h3>
          <ul className="space-y-3">
            {data.notifications.map((item, index) => (
              <li key={index} className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-medium text-foreground shrink-0 sm:w-64 text-sm">
                  {item.number}
                </span>
                <span className="text-muted-foreground text-sm">{item.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
