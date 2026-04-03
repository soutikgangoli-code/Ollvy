'use client'

import { Check, AlertCircle, FileText } from 'lucide-react'

export function FearRelief() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background overflow-hidden">
      <div className="container max-w-6xl">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Why Ollvy?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-5">
            Ollvy files your returns before you even think to ask. No chasing.
          </p>
        </div>

        {/* Two-column comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">

          {/* Left: THE USUAL WAY */}
          <div className="flex flex-col">
            {/* Header with red dot */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="text-[12px] font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
                THE USUAL WAY
              </span>
            </div>

            {/* WhatsApp chat card */}
            <div className="rounded-2xl overflow-hidden border border-border/50 bg-card shadow-md flex-1 flex flex-col">
              {/* WhatsApp header */}
              <div className="px-3 py-2 flex items-center gap-2 border-b border-border">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium text-[10px]">
                  CS
                </div>
                <div>
                  <p className="font-medium text-foreground text-[11px]">CA Sharma</p>
                  <p className="text-[9px] text-muted-foreground">Last seen today at 8:37 AM</p>
                </div>
              </div>

              {/* Chat area - WhatsApp style background */}
              <div className="p-2 space-y-1.5 flex-1 bg-cover bg-center" style={{ backgroundImage: `url('/images/whatsapp-bg.jpg')` }}>

                {/* Date: Tuesday, 18 Oct */}
                <div className="flex justify-center">
                  <span className="text-[9px] bg-card/80 backdrop-blur-sm text-muted-foreground px-1.5 py-0.5 rounded shadow-sm">
                    Tuesday, 18 Oct
                  </span>
                </div>

                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-emerald-100 dark:bg-emerald-900/70 rounded-lg px-2 py-1.5 max-w-[85%] shadow-sm">
                    <p className="text-[11px] text-foreground leading-tight">Hi Sharma ji, Q2 GST return file hua? Deadline is the 20th</p>
                    <p className="text-[8px] text-muted-foreground text-right">10:23 AM ✓✓</p>
                  </div>
                </div>

                {/* Date: Wednesday, 19 Oct */}
                <div className="flex justify-center">
                  <span className="text-[9px] bg-card/80 backdrop-blur-sm text-muted-foreground px-1.5 py-0.5 rounded shadow-sm">
                    Wednesday, 19 Oct
                  </span>
                </div>

                {/* User message - question mark */}
                <div className="flex justify-end">
                  <div className="bg-emerald-100 dark:bg-emerald-900/70 rounded-lg px-2 py-1.5 shadow-sm">
                    <p className="text-[11px] text-foreground">?</p>
                    <p className="text-[8px] text-muted-foreground text-right">11:02 AM ✓✓ Read</p>
                  </div>
                </div>

                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-emerald-100 dark:bg-emerald-900/70 rounded-lg px-2 py-1.5 max-w-[85%] shadow-sm">
                    <p className="text-[11px] text-foreground leading-tight">Please confirm, deadline is tomorrow</p>
                    <p className="text-[8px] text-muted-foreground text-right">2:47 PM ✓✓ Read</p>
                  </div>
                </div>

                {/* CA response */}
                <div className="flex justify-start">
                  <div className="bg-card rounded-lg px-2 py-1.5 shadow-sm">
                    <p className="text-[11px] text-foreground leading-tight">Kal tak ho jayega <span role="img" aria-label="thumbs up">👍</span></p>
                    <p className="text-[8px] text-muted-foreground">6:12 PM</p>
                  </div>
                </div>

                {/* Date: Thursday, 20 Oct - Deadline missed */}
                <div className="flex justify-center">
                  <span className="text-[9px] bg-card/80 backdrop-blur-sm text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded shadow-sm font-medium">
                    Thursday, 20 Oct - Deadline missed
                  </span>
                </div>

                {/* PDF attachment with penalty - sent by USER (right side) */}
                <div className="flex justify-end">
                  <div className="bg-red-100 dark:bg-red-900/50 rounded-lg overflow-hidden shadow-sm max-w-[90%] border-l-2 border-red-500">
                    {/* PDF header */}
                    <div className="flex items-center gap-2 p-2">
                      <div className="w-7 h-7 rounded-lg bg-card/60 dark:bg-red-900/30 flex items-center justify-center">
                        <FileText className="h-3.5 w-3.5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-foreground leading-tight">Late_Filing_Notice_GSTR3B.pdf</p>
                        <p className="text-[8px] text-muted-foreground">PDF - 84 KB - GST Portal</p>
                      </div>
                    </div>
                    {/* Penalty box - white fill */}
                    <div className="mx-2 mb-1.5 px-2 py-1.5 bg-card rounded-md">
                      <p className="text-[10px] text-red-500 dark:text-red-400">Penalty levied under Section 47</p>
                      <p className="text-[11px] font-bold text-foreground">Amount due: ₹10,000</p>
                    </div>
                    <p className="text-[8px] text-muted-foreground text-right px-2 pb-1.5">9:14 AM ✓✓ Read</p>
                  </div>
                </div>

                {/* User final message */}
                <div className="flex justify-end">
                  <div className="bg-emerald-100 dark:bg-emerald-900/70 rounded-lg px-2 py-1.5 max-w-[85%] shadow-sm">
                    <p className="text-[11px] text-foreground leading-tight">Sharma ji ye dekho. Please call karo abhi.</p>
                    <p className="text-[8px] text-muted-foreground text-right">9:16 AM ✓✓ Read</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right: WITH OLLVY */}
          <div className="flex flex-col">
            {/* Header with green dot */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
                WITH OLLVY
              </span>
            </div>

            {/* Status panel card - permanently lifted */}
            <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg flex-1 flex flex-col">
              {/* Header */}
              <div className="px-3 py-2 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-[11px]">Compliance status</p>
                    <p className="text-[9px] text-muted-foreground">Your Private Limited</p>
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-medium bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    All current
                  </span>
                </div>
              </div>

              {/* Status items */}
              <div className="p-2 space-y-1.5">
                {/* GSTR-3B filed */}
                <div className="flex items-center justify-between p-3 rounded-lg transition-colors duration-150 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground leading-tight">GSTR-3B filed</p>
                      <p className="text-[11px] text-muted-foreground">5 days before deadline</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground">Oct 15</span>
                </div>

                {/* TDS return filed */}
                <div className="flex items-center justify-between p-3 rounded-lg transition-colors duration-150 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground leading-tight">TDS return filed</p>
                      <p className="text-[11px] text-muted-foreground">3 days before deadline</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground">Oct 7</span>
                </div>

                {/* Director KYC updated */}
                <div className="flex items-center justify-between p-3 rounded-lg transition-colors duration-150 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground leading-tight">Director KYC updated</p>
                      <p className="text-[11px] text-muted-foreground">2 months before due date</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground">Sep 12</span>
                </div>

                {/* ROC filing - In progress */}
                <div className="flex items-center justify-between p-3 rounded-lg transition-colors duration-150 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                      <AlertCircle className="h-2.5 w-2.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground leading-tight">ROC filing - In progress</p>
                      <p className="text-[11px] text-muted-foreground">CA assigned - Due in 18 days</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground">Nov 18</span>
                </div>
              </div>

              {/* Bottom section - centered in remaining space */}
              <div className="flex-1 flex flex-col justify-center px-1.5 pb-1.5">
                {/* DPIIT upsell card - grey translucent, compact */}
                <div className="p-3 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border/50 backdrop-blur-sm">
                  <div className="flex gap-2.5 items-center">
                    {/* Compliance ring */}
                    <div className="shrink-0">
                      <div className="relative w-12 h-12 rounded-full bg-background shadow-sm">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            className="stroke-muted/50"
                            strokeWidth="2.5"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            className="stroke-emerald-500"
                            strokeWidth="2.5"
                            strokeDasharray="80, 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                          <span className="text-xs font-semibold text-foreground leading-none tracking-tight">80%</span>
                          <span className="text-[8px] text-muted-foreground leading-none">done</span>
                        </div>
                      </div>
                    </div>
                    {/* Text - compact */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-muted-foreground">You're close.</p>
                      <p className="text-[11px] font-semibold text-foreground leading-tight">
                        Get Startup India (DPIIT) recognition done. Save ₹5L+ in income tax over 3 years.
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        Most eligible companies never claim this. One registration gets you to 100%.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-[11px] text-muted-foreground italic text-center mt-2">
                  You didn't have to ask once.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
