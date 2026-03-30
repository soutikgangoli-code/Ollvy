'use client'

import { Check, FileText, Calendar, MessageSquare, Clock, AlertTriangle, Circle } from 'lucide-react'

// Mockup 1: Order Tracking - matches /orders/[id] page
function OrderTrackingMockup() {
  const stages = [
    { name: 'Questionnaire', status: 'done' },
    { name: 'Documents', status: 'done' },
    { name: 'CA Review', status: 'current' },
    { name: 'Filing', status: 'pending' },
  ]

  return (
    <div className="h-full p-4 md:p-6 flex flex-col bg-card">
      {/* Header with service name */}
      <div className="mb-3 md:mb-5">
        <p className="text-sm md:text-base font-semibold text-foreground">GST Registration</p>
        <p className="text-xs md:text-sm text-muted-foreground">Order #ORD-2024-1847</p>
      </div>

      {/* Progress bar segments - matches real UI */}
      <div className="flex gap-1 md:gap-1.5 mb-2 md:mb-3">
        {stages.map((stage, i) => (
          <div
            key={i}
            className={`h-1.5 md:h-2 flex-1 rounded-full ${
              stage.status === 'done'
                ? 'bg-emerald-500'
                : stage.status === 'current'
                  ? 'bg-emerald-500/50'
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Stage info row */}
      <div className="flex items-center justify-between mb-3 md:mb-5">
        <p className="text-xs md:text-sm text-muted-foreground">Stage 3 of 4</p>
        <span className="text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-400">In Progress</span>
      </div>

      {/* Vertical timeline - matches actual OrderTimeline component */}
      <div className="flex-1 space-y-0">
        {stages.map((stage, i) => (
          <div key={i} className="flex gap-2.5 md:gap-4">
            {/* Icon column */}
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${
                stage.status === 'done'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : stage.status === 'current'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {stage.status === 'done' ? (
                  <Check className="h-3 w-3 md:h-4 md:w-4" />
                ) : stage.status === 'current' ? (
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
                ) : (
                  <Circle className="h-3 w-3 md:h-4 md:w-4" />
                )}
              </div>
              {i < stages.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[16px] md:min-h-[20px] ${
                  stage.status === 'done' ? 'bg-emerald-500/30' : 'bg-border'
                }`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-2.5 md:pb-4">
              <p className={`text-xs md:text-sm font-medium ${
                stage.status === 'done' || stage.status === 'current'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}>
                {stage.name}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                {stage.status === 'done' ? 'Completed' : stage.status === 'current' ? 'In progress' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Mockup 2: Documents
function DocumentsMockup() {
  const documents = [
    { name: 'PAN Card', status: 'verified' },
    { name: 'Aadhaar Card', status: 'verified' },
    { name: 'Bank Statement', status: 'pending' },
    { name: 'GST Certificate', status: 'verified' },
  ]

  return (
    <div className="h-full p-4 md:p-5 flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div>
          <p className="text-xs md:text-sm font-semibold text-foreground">Documents</p>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">4 of 5 uploaded</p>
        </div>
        <span className="px-2 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          80% complete
        </span>
      </div>

      {/* Document list */}
      <div className="flex-1 space-y-1.5 md:space-y-2">
        {documents.map((doc, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-lg bg-muted/50 border border-border/50">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            </div>
            <span className="text-xs md:text-sm text-foreground flex-1">{doc.name}</span>
            {doc.status === 'verified' ? (
              <div className="flex items-center gap-1 md:gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span className="text-[10px] md:text-xs font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 md:gap-1.5 text-amber-600 dark:text-amber-400">
                <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span className="text-[10px] md:text-xs font-medium">Pending</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Mockup 3: Compliance Calendar
function ComplianceCalendarMockup() {
  const deadlines = [
    { date: '11', month: 'Apr', name: 'GSTR-1 Due', days: 3, urgent: true },
    { date: '20', month: 'Apr', name: 'GSTR-3B Due', days: 12, urgent: false },
    { date: '30', month: 'Apr', name: 'TDS Return', days: 22, urgent: false },
  ]

  return (
    <div className="h-full p-4 md:p-5 flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div>
          <p className="text-xs md:text-sm font-semibold text-foreground">Compliance Calendar</p>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">April 2024</p>
        </div>
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary" />
        </div>
      </div>

      {/* Deadline list */}
      <div className="flex-1 space-y-2 md:space-y-2.5">
        {deadlines.map((item, i) => (
          <div key={i} className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl border ${
            item.urgent
              ? 'bg-red-500/5 border-red-500/20'
              : 'bg-muted/50 border-border/50'
          }`}>
            {/* Date badge */}
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-md md:rounded-lg flex flex-col items-center justify-center shrink-0 ${
              item.urgent
                ? 'bg-red-500/10'
                : 'bg-background border border-border'
            }`}>
              <span className={`text-sm md:text-lg font-bold leading-none ${
                item.urgent ? 'text-red-600 dark:text-red-400' : 'text-foreground'
              }`}>{item.date}</span>
              <span className={`text-[10px] md:text-xs mt-0.5 ${
                item.urgent ? 'text-red-600/70 dark:text-red-400/70' : 'text-muted-foreground'
              }`}>{item.month}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-xs md:text-sm font-medium ${
                item.urgent ? 'text-red-600 dark:text-red-400' : 'text-foreground'
              }`}>{item.name}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                {item.days} days left
              </p>
            </div>

            {item.urgent && (
              <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-500 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Mockup 4: Chat
function ChatMockup() {
  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-b border-border">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs md:text-sm">
          PS
        </div>
        <div>
          <p className="text-xs md:text-sm font-semibold text-foreground">CA Priya Sharma</p>
          <div className="flex items-center gap-1 md:gap-1.5">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] md:text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-3 md:p-4 space-y-2 md:space-y-3 overflow-hidden">
        {/* Professional message */}
        <div className="flex gap-1.5 md:gap-2">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-[10px] md:text-xs shrink-0">
            P
          </div>
          <div className="bg-muted/70 rounded-xl md:rounded-2xl rounded-tl-md px-2.5 md:px-3.5 py-1.5 md:py-2 max-w-[85%]">
            <p className="text-xs md:text-sm text-foreground">Your GST has been filed</p>
            <div className="flex items-center gap-1 mt-0.5 md:mt-1">
              <Check className="h-2.5 w-2.5 md:h-3 md:w-3 text-emerald-500" />
              <span className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400">Filed</span>
            </div>
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground rounded-xl md:rounded-2xl rounded-tr-md px-2.5 md:px-3.5 py-1.5 md:py-2 max-w-[85%]">
            <p className="text-xs md:text-sm">Can I get the ARN?</p>
          </div>
        </div>

        {/* Professional reply */}
        <div className="flex gap-1.5 md:gap-2">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-[10px] md:text-xs shrink-0">
            P
          </div>
          <div className="bg-muted/70 rounded-xl md:rounded-2xl rounded-tl-md px-2.5 md:px-3.5 py-1.5 md:py-2 max-w-[85%]">
            <p className="text-xs md:text-sm text-foreground">ARN: AA1234567890</p>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-3 md:p-4 border-t border-border">
        <div className="flex items-center gap-2 md:gap-3 bg-muted/50 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 border border-border">
          <span className="text-xs md:text-sm text-muted-foreground flex-1">Type a message...</span>
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    title: 'Track every filing in real-time',
    desc: 'See exactly where your GST, incorporation, or trademark stands.',
    Mockup: OrderTrackingMockup,
  },
  {
    title: 'All documents in one place',
    desc: 'Certificates, returns, acknowledgments - organized and downloadable.',
    Mockup: DocumentsMockup,
  },
  {
    title: 'Never miss a deadline',
    desc: 'Compliance calendar shows all upcoming due dates.',
    Mockup: ComplianceCalendarMockup,
  },
  {
    title: 'Chat with your professional',
    desc: 'Direct access to your assigned CA or lawyer.',
    Mockup: ChatMockup,
  },
]

export function ProductShowcase() {
  return (
    <section id="product-showcase" className="py-28 bg-muted/30 border-y border-border">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Everything in one dashboard
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-5">
            No more scattered emails, WhatsApp messages, or phone calls. Track every filing in real-time.
          </p>
        </div>

        {/* Product screenshots grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {FEATURES.map((item, i) => (
            <div key={i}>
              {/* Mockup card - auto height on mobile, fixed aspect on desktop */}
              <div className="min-h-[280px] md:aspect-[4/3] md:min-h-0 rounded-2xl border border-border bg-card overflow-hidden mb-4 md:mb-5 shadow-sm">
                <item.Mockup />
              </div>
              <h3 className="font-semibold text-base md:text-lg text-foreground">{item.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
