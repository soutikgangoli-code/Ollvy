'use client'

import { DBServiceRisk } from '@/lib/data/services'
import { Clock, AlertTriangle, FileText, Building, AlertCircle } from 'lucide-react'

const RISK_ICONS = {
  clock: Clock,
  mismatch: AlertTriangle,
  document: FileText,
  building: Building,
  alert: AlertCircle,
}

export function ServiceRisks({
  risks,
  serviceShortName,
}: {
  risks: DBServiceRisk[]
  serviceShortName: string
}) {
  if (risks.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6">
        What could go wrong with {serviceShortName}
      </h2>

      <div className="space-y-2 sm:space-y-4">
        {risks.map((risk, i) => {
          const Icon = RISK_ICONS[risk.icon]
          return (
            <div
              key={i}
              className="flex items-start gap-2.5 sm:gap-4 border border-border rounded-xl p-3 sm:p-5 bg-card"
            >
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[hsl(var(--ollvy-amber))]/10 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] text-[hsl(var(--ollvy-amber))]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {risk.title}
                </h3>
                {(() => {
                  const lines = risk.body.includes('\n')
                    ? risk.body.split('\n').filter(Boolean)
                    : risk.body.split(/(?<=\.)\s+/).filter(Boolean)
                  return (
                    <ul className="text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed space-y-0.5">
                      {lines.map((line, j) => (
                        <li key={j} className="flex gap-1.5">
                          <span aria-hidden="true" className="shrink-0">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )
                })()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
