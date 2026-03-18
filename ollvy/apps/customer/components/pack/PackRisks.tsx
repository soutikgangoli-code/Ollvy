import { AlertTriangle } from 'lucide-react'
import type { PackRisk } from '@/lib/data/packs/cloud-kitchen'

export function PackRisks({ risks }: { risks: PackRisk[] }) {
  if (!risks || risks.length === 0) return null

  return (
    <div>
      <p className="font-mono uppercase tracking-wider text-xs text-muted-foreground mb-2">
        RISKS
      </p>
      <h2 className="font-mono uppercase tracking-wider text-2xl text-foreground">
        WHAT CAN GO WRONG
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Honest disclosure. These are the real reasons FSSAI applications get delayed.
      </p>

      <div className="space-y-4 mt-8">
        {risks.map((risk, i) => (
          <div
            key={i}
            className="border border-border rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-amber-600 dark:text-amber-500" />
              </div>

              <div className="flex-1">
                <h3 className="text-base font-medium text-foreground">
                  {risk.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {risk.what}
                </p>
                <p className="text-sm text-[hsl(var(--ollvy-green))] mt-3 leading-relaxed">
                  <span className="font-medium">Ollvy mitigation:</span> {risk.mitigation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
