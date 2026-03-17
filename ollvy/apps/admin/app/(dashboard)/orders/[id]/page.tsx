import { createAdminSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import OrderDetailClient from './OrderDetailClient'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createAdminSupabase()

  // Fetch order with all related data
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      service_packages!inner (id, name, slug, sla_working_days, workflow_stages),
      users!inner (id, city, business_type, phone),
      professionals (id, display_name, city)
    `)
    .eq('id', params.id)
    .single()

  if (error || !order) {
    notFound()
  }

  // Fetch stage history
  const { data: stageHistory } = await supabase
    .from('order_stage_history')
    .select('*')
    .eq('order_id', params.id)
    .order('created_at', { ascending: true })

  // Fetch documents
  const { data: documents } = await supabase
    .from('order_documents')
    .select('*')
    .eq('order_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch chat messages
  const { data: chatConversation } = await supabase
    .from('chat_conversations')
    .select('id')
    .eq('order_id', params.id)
    .single()

  let chatMessages: any[] = []
  if (chatConversation) {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', chatConversation.id)
      .order('created_at', { ascending: true })
    chatMessages = data || []
  }

  // Fetch dispute if exists
  const { data: dispute } = await supabase
    .from('disputes')
    .select('*')
    .eq('order_id', params.id)
    .single()

  // Fetch audit log
  const { data: auditLog } = await supabase
    .from('admin_audit_log')
    .select('*')
    .eq('target_type', 'order')
    .eq('target_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/orders" className="text-muted-text hover:text-body-text">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-body-text">Order Details</h1>
            <span className={`badge badge-${order.status}`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-muted-text mt-1">
            {order.service_packages.name} • Created {new Date(order.created_at).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>

      <OrderDetailClient
        order={order}
        stageHistory={stageHistory || []}
        documents={documents || []}
        chatMessages={chatMessages}
        dispute={dispute}
        auditLog={auditLog || []}
      />
    </div>
  )
}
