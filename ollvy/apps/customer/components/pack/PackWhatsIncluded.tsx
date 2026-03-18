import { Check } from 'lucide-react'

type InclusionGroup = {
  serviceShortName: string
  inclusions: Array<{ title: string; detail?: string }>
}

export function PackWhatsIncluded({ groups }: { groups: InclusionGroup[] }) {
  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        WHAT YOU GET
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        EVERYTHING. NO HIDDEN WORK.
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Your Ollvy professional handles all of this. Nothing extra to do on your end except provide documents.
      </p>

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {groups.map((group) => (
          <div
            key={group.serviceShortName}
            className="border border-border rounded-2xl p-6"
          >
            <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-4">
              {group.serviceShortName}
            </p>

            <div className="space-y-3">
              {group.inclusions.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={14} className="text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">{item.title}</p>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
