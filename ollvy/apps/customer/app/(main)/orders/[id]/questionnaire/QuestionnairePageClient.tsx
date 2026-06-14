'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuestionnaireWizard } from '@/components/questionnaire'
import { ArrowLeft, ClipboardList, HelpCircle, MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/constants'

interface OrderData {
  id: string
  order_number: string
  questionnaire_completed_at: string | null
  setup_locked_at?: string | null
  service_package: {
    id: string
    name: string
    slug: string
  }
}

interface QuestionnairePageClientProps {
  order: OrderData
  forceEdit: boolean
  __perfTimings?: {
    auth: number
    rpc: number
    rpcAttempts: number
    rpcBackoffWait: number
    total: number
  }
}

export function QuestionnairePageClient({ order, forceEdit, __perfTimings }: QuestionnairePageClientProps) {
  // Stable reference so the wizard's load effect (which has prefetchedOrder in
  // its deps) fires exactly once and never re-loads/resets in-progress answers.
  const prefetchedOrder = useMemo(() => ({
    id: order.id,
    questionnaire_completed_at: order.questionnaire_completed_at,
    service_package: order.service_package,
  }), [order.id, order.questionnaire_completed_at, order.service_package])
  // Perf instrumentation — see [questionnaire-perf] lines in console.
  // Especially watch rpcAttempts: if >1, the user hit the webhook race
  // condition and waited for backoff (1s, 2s, 4s, 8s, 16s).
  useEffect(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const sinceNav = nav ? Math.round(performance.now() - nav.startTime) : Math.round(performance.now())
    const ttfb = nav ? Math.round(nav.responseStart - nav.startTime) : null
    if (__perfTimings) {
      const retryNote = __perfTimings.rpcAttempts > 1
        ? ` ⚠ ${__perfTimings.rpcAttempts} attempts, ${__perfTimings.rpcBackoffWait}ms backoff wait`
        : ''
      console.log(
        `[questionnaire-perf] server: total=${__perfTimings.total}ms (auth=${__perfTimings.auth}ms, rpc=${__perfTimings.rpc}ms${retryNote}) | TTFB=${ttfb}ms | client mount @ ${sinceNav}ms`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="container py-12 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/orders/${order.id}`}>
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground -ml-4 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Order
          </Button>
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Complete Setup
            </h1>
            <p className="text-muted-foreground">
              Order #{order.order_number} - {order.service_package?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Questionnaire Wizard — hand it the order we already fetched server-side
          so it skips the duplicate client-side get_user_order RPC. */}
      <QuestionnaireWizard
        orderId={order.id}
        forceEdit={forceEdit && !order.setup_locked_at}
        locked={!!order.setup_locked_at}
        prefetchedOrder={prefetchedOrder}
      />

      {/* Help Section */}
      <div className="mt-8 p-5 bg-muted/30 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">
              Need help?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you're unsure about any question, our team is here to help.
            </p>
            <a
              href={getWhatsAppLink(`Hi, I need help with setup for order ${order.order_number}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
