'use client'

import { DBProfilePersona } from '@/lib/data/services'

export function ProfilePersonas({
  personas,
  serviceName,
}: {
  personas: DBProfilePersona[]
  serviceName: string
}) {
  if (personas.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6">
        We handle the messy situations too.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {personas.map((persona, i) => (
          <div
            key={i}
            className="flex items-start gap-3 border border-border rounded-xl p-4 bg-card"
          >
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 font-mono text-xs font-bold text-muted-foreground">
              {persona.label[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {persona.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed hidden sm:block">
                {persona.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
