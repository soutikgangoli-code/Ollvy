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
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* The Fear Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent dark:from-red-500/10 rounded-3xl" />
            <div className="relative p-6 md:p-10 rounded-3xl border border-red-200/50 dark:border-red-500/20 bg-card/50">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20">
                  <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Without Ollvy
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 tracking-tight leading-[1.15]">
                Compliance nightmares are expensive.
              </h2>

              <div className="space-y-3">
                {PENALTIES.map((item, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl p-4 md:p-5 bg-background border border-border hover:border-red-200 dark:hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-lg md:text-xl font-bold text-red-600 dark:text-red-400 tracking-tight block">
                          {item.penalty}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The Relief Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent dark:from-emerald-500/10 rounded-3xl" />
            <div className="relative p-6 md:p-10 rounded-3xl border border-emerald-200/50 dark:border-emerald-500/20 bg-card/50">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                  <Shield className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  With Ollvy
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 tracking-tight leading-[1.15]">
                Zero penalties. Zero surprises.
              </h2>

              <div className="space-y-3">
                {BENEFITS.map((item, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl p-4 md:p-5 bg-background border border-border hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="font-medium text-base text-foreground">{item.title}</p>
                      <div className="ml-auto w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
