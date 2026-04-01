import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createServerSupabase, getUser } from '@/lib/supabase-server'
import { DocumentsPageClient } from './DocumentsPageClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DocumentsUploadPage({ params }: PageProps) {
  const { id: orderId } = await params

  // Check if user is logged in
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  const supabase = await createServerSupabase()

  // Fetch order and documents in parallel
  const [orderResult, docsResult] = await Promise.all([
    supabase.rpc('get_user_order', { p_order_id: orderId }),
    supabase.rpc('initialize_order_documents', { p_order_id: orderId }),
  ])

  if (orderResult.error || !orderResult.data) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/orders">
          <Button className="mt-4">View All Orders</Button>
        </Link>
      </div>
    )
  }

  const orderData = orderResult.data
  const servicePackage = orderData.service_package as { id: string; name: string; slug: string }

  // Check if questionnaire needs to be completed first
  if (!orderData.questionnaire_completed_at) {
    // Check if service has questionnaire questions (include in parallel query would be better)
    const { count: questionCount } = await supabase
      .from('service_questionnaires')
      .select('id', { count: 'exact', head: true })
      .eq('service_package_id', servicePackage.id)
      .eq('is_active', true)

    if (questionCount && questionCount > 0) {
      redirect(`/orders/${orderId}/questionnaire`)
    }
  }

  const order = {
    id: orderData.id,
    order_number: orderData.order_number,
    questionnaire_completed_at: orderData.questionnaire_completed_at,
    service_package: servicePackage,
  }

  return (
    <DocumentsPageClient
      order={order}
      initialDocuments={docsResult.data || []}
    />
  )
}
