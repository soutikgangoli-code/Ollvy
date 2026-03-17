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
      <h2 className="text-xl font-semibold text-foreground mb-2">
        What could go wrong with {serviceShortName}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        These are the risks. We handle most of them, but you should know what
        they are.
      </p>

      <div className="space-y-4">
        {risks.map((risk, i) => {
          const Icon = RISK_ICONS[risk.icon]
          return (
            <div
              key={i}
              className="flex items-start gap-4 border border-border rounded-xl p-5 bg-card"
            >
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--ollvy-amber))]/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-[hsl(var(--ollvy-amber))]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {risk.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {risk.body}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
