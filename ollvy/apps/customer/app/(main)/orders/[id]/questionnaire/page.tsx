import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createServerSupabase, getUser } from '@/lib/supabase-server'
import { QuestionnairePageClient } from './QuestionnairePageClient'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ edit?: string }>
}

export default async function QuestionnairePage({ params, searchParams }: PageProps) {
  const { id: orderId } = await params
  const { edit } = await searchParams
  const forceEdit = edit === 'true'

  // Check if user is logged in
  const user = await getUser()
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

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    const res = await supabase.rpc('get_user_order', { p_order_id: orderId })
    orderData = res.data
    error = res.error
    if (orderData) break
    if (attempt < delays.length) {
      await new Promise(r => setTimeout(r, delays[attempt]))
    }
  }

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
    service_package: orderData.service_package as { name: string; slug: string },
  }

  return <QuestionnairePageClient order={order} forceEdit={forceEdit} />
}
