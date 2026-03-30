import { Shield, Clock, FileText, MessageSquare, Calendar } from 'lucide-react'

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
        {/* Side by side grid - works on mobile too */}
        <div className="grid grid-cols-2 gap-4 md:gap-12 lg:gap-24">
          {/* The Fear Side */}
          <div>
            <div className="inline-flex items-center gap-1.5 md:gap-2 mb-4 md:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">Without Ollvy</span>
            </div>

            <h2 className="text-xl md:text-3xl lg:text-[2.75rem] font-bold text-foreground mb-6 md:mb-10 tracking-tight leading-[1.1]">
              Compliance nightmares<br className="hidden md:block" />
              <span className="md:hidden"> </span>are expensive.
            </h2>

            <div className="space-y-2 md:space-y-3">
              {PENALTIES.map((item, i) => (
                <div
                  key={i}
                  className="p-3 md:p-5 rounded-xl md:rounded-2xl border border-red-200/60 dark:border-red-900/40 min-h-[60px] md:min-h-[76px] flex flex-col justify-center"
                >
                  <span className="font-mono text-base md:text-xl font-bold text-red-600 dark:text-red-400 tracking-tight">
                    {item.penalty}
                  </span>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The Relief Side */}
          <div>
            <div className="inline-flex items-center gap-1.5 md:gap-2 mb-4 md:mb-6">
              <Shield className="h-3 w-3 md:h-3.5 md:w-3.5 text-emerald-500" />
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">With Ollvy</span>
            </div>

            <h2 className="text-xl md:text-3xl lg:text-[2.75rem] font-bold text-foreground mb-6 md:mb-10 tracking-tight leading-[1.1]">
              Zero penalties.<br className="hidden md:block" />
              <span className="md:hidden"> </span>Zero surprises.
            </h2>

            <div className="space-y-2 md:space-y-3">
              {BENEFITS.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 md:gap-4 p-3 md:p-5 rounded-xl md:rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 min-h-[60px] md:min-h-[76px]"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-border flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm md:text-base text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
