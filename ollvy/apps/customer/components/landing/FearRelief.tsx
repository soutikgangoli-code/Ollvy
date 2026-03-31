import { Shield, Clock, FileText, MessageSquare, Calendar, AlertTriangle, XCircle } from 'lucide-react'

const PENALTIES = [
  { penalty: '₹10,000+', desc: 'Late GST filing' },
  { penalty: '₹100/day', desc: 'Missed Director KYC' },
  { penalty: '₹1,00,000', desc: 'Delayed ROC filing' },
  { penalty: '₹10,000', desc: 'Late TDS return' },
]

const BENEFITS = [
  { icon: Clock, title: 'Automated reminders' },
  { icon: FileText, title: 'Proof of filing' },
  { icon: MessageSquare, title: 'Direct CA access' },
  { icon: Calendar, title: 'Compliance calendar' },
]

export function FearRelief() {
  return (
    <section className="py-16 md:py-28 bg-background">
      <div className="container">
        <div className="grid grid-cols-2 gap-3 md:gap-8 lg:gap-16">
          {/* The Fear Side */}
          <div className="rounded-2xl md:rounded-3xl bg-red-50/50 dark:bg-red-950/20 p-4 md:p-8">
            <div className="inline-flex items-center gap-1.5 md:gap-2 mb-3 md:mb-5">
              <XCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-500" />
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                Without Ollvy
              </span>
            </div>

            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground mb-4 md:mb-6 tracking-tight leading-tight">
              Compliance nightmares are expensive.
            </h2>

            <div className="space-y-2 md:space-y-3">
              {PENALTIES.map((item, i) => (
                <div
                  key={i}
                  className="bg-background rounded-xl md:rounded-2xl p-3 md:p-4 border border-red-200/80 dark:border-red-900/50"
                >
                  <span className="font-mono text-sm md:text-lg font-bold text-red-600 dark:text-red-400 tracking-tight block">
                    {item.penalty}
                  </span>
                  <p className="text-[11px] md:text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The Relief Side */}
          <div className="rounded-2xl md:rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 p-4 md:p-8">
            <div className="inline-flex items-center gap-1.5 md:gap-2 mb-3 md:mb-5">
              <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" />
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                With Ollvy
              </span>
            </div>

            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground mb-4 md:mb-6 tracking-tight leading-tight">
              Zero penalties. Zero surprises.
            </h2>

            <div className="space-y-2 md:space-y-3">
              {BENEFITS.map((item, i) => (
                <div
                  key={i}
                  className="bg-background rounded-xl md:rounded-2xl p-3 md:p-4 border border-emerald-200/80 dark:border-emerald-900/50"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                      <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="font-medium text-xs md:text-sm text-foreground">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
