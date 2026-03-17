import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { order_id, reason } = await request.json()

  if (!order_id) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
  }

  if (!reason || reason.length < 20) {
    return NextResponse.json({ error: 'Reason must be at least 20 characters' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  // Get order
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('id, status, razorpay_payment_id, total_paisa_snapshot')
    .eq('id', order_id)
    .single()

  if (fetchError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (['completed', 'cancelled'].includes(order.status)) {
    return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 })
  }

  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
    })
    .eq('id', order_id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 })
  }

  // If payment was captured, queue refund
  if (order.razorpay_payment_id) {
    await supabase.from('refund_queue').insert({
      order_id,
      payment_id: order.razorpay_payment_id,
      amount_paisa: order.total_paisa_snapshot,
      reason: `Admin cancelled: ${reason}`,
      status: 'pending',
    })
  }

  // Create audit log entry
  await supabase.from('admin_audit_log').insert({
    admin_id: session.adminId,
    action: 'cancel_order',
    target_type: 'order',
    target_id: order_id,
    notes: `Cancelled order: ${reason}`,
  })

  return NextResponse.json({ success: true, refundQueued: !!order.razorpay_payment_id })
}
