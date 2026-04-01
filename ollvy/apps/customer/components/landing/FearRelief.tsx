import { Shield, Clock, FileText, MessageSquare, Calendar, XCircle, Check } from 'lucide-react'

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
    <section className="py-12 md:py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-12">
          {/* The Fear Side */}
          <div className="rounded-2xl md:rounded-3xl border border-border bg-card shadow-xl shadow-foreground/5 p-4 md:p-8 lg:p-10 flex flex-col">
            <div className="inline-flex items-center gap-1.5 md:gap-2 mb-3 md:mb-6">
              <div className="flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-100 dark:bg-red-500/20">
                <XCircle className="h-2.5 w-2.5 md:h-3 md:w-3 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                Without Ollvy
              </span>
            </div>

            <h2 className="text-sm md:text-2xl lg:text-3xl font-bold text-foreground mb-4 md:mb-8 tracking-tight leading-[1.15]">
              Compliance nightmares are expensive.
            </h2>

            <div className="space-y-2 md:space-y-3 flex-1">
              {PENALTIES.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg md:rounded-2xl p-2.5 md:p-4 bg-background border border-border"
                >
                  <p className="text-xs md:text-base text-foreground">
                    <span className="font-bold text-red-600 dark:text-red-400">{item.penalty}</span>
                    <span className="text-muted-foreground"> - {item.desc}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* The Relief Side */}
          <div className="rounded-2xl md:rounded-3xl border border-border bg-card shadow-xl shadow-foreground/5 p-4 md:p-8 lg:p-10 flex flex-col">
            <div className="inline-flex items-center gap-1.5 md:gap-2 mb-3 md:mb-6">
              <div className="flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                <Shield className="h-2.5 w-2.5 md:h-3 md:w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                With Ollvy
              </span>
            </div>

            <h2 className="text-sm md:text-2xl lg:text-3xl font-bold text-foreground mb-4 md:mb-8 tracking-tight leading-[1.15]">
              Zero penalties. Zero surprises.
            </h2>

            <div className="space-y-2 md:space-y-3 flex-1">
              {BENEFITS.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg md:rounded-2xl p-2.5 md:p-4 bg-background border border-border"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-5 h-5 md:w-8 md:h-8 rounded-md md:rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <item.icon className="h-3 w-3 md:h-4 md:w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xs md:text-base text-foreground">{item.title}</p>
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
