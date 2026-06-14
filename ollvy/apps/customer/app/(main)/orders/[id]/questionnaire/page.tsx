import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createServerSupabase, getUserFast } from '@/lib/supabase-server'
import { withTimeout, DB_TIMEOUT_MS } from '@/lib/with-timeout'
import { QuestionnairePageClient } from './QuestionnairePageClient'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ edit?: string }>
}

export default async function QuestionnairePage({ params, searchParams }: PageProps) {
  const __tStart = performance.now()
  const { id: orderId } = await params
  const { edit } = await searchParams
  const forceEdit = edit === 'true'

  // Check if user is logged in
  const user = await getUserFast()
  const __tAuth = performance.now() - __tStart
  if (!user) {
    redirect('/login')
  }

  // Fetch order data server-side with retry for webhook race condition.
  // After payment, the customer may land here before the Razorpay webhook
  // has finished updating the order, so we retry with exponential backoff.
  const supabase = await createServerSupabase()
  const delays = [1000, 2000, 4000, 8000, 16000]
  let orderData: any = null
  let error: any = null
  let __attemptCount = 0
  let __waitTotal = 0
  const __rpcStart = performance.now()

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    __attemptCount = attempt + 1
    try {
      const res = await withTimeout(
        supabase.rpc('get_user_order', { p_order_id: orderId }),
        DB_TIMEOUT_MS,
        'questionnaire.get_user_order',
      )
      orderData = res.data
      error = res.error
    } catch (err) {
      // A hung RPC counts as a failed attempt — retry rather than stall the
      // post-payment page on a single stalled call.
      error = err
    }
    if (orderData) break
    if (attempt < delays.length) {
      __waitTotal += delays[attempt]
      await new Promise(r => setTimeout(r, delays[attempt]))
    }
  }
  const __tRpc = performance.now() - __rpcStart

  if (error || !orderData) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Link href="/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    )
  }

  const order = {
    id: orderData.id,
    order_number: orderData.order_number,
    questionnaire_completed_at: orderData.questionnaire_completed_at,
    setup_locked_at: orderData.setup_locked_at as string | null,
    service_package: orderData.service_package as { id: string; name: string; slug: string },
  }

  const __perfTimings = {
    auth: Math.round(__tAuth),
    rpc: Math.round(__tRpc),
    rpcAttempts: __attemptCount,
    rpcBackoffWait: __waitTotal,
    total: Math.round(performance.now() - __tStart),
  }

  return <QuestionnairePageClient order={order} forceEdit={forceEdit} __perfTimings={__perfTimings} />
}
