import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAdmin } from '../_shared/auth.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authResult = await verifyAdmin(req)
    if (!authResult.success) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { order_id, notes } = await req.json()
    if (!order_id) {
      return new Response(JSON.stringify({ error: 'order_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch order - MUST include chat_conversation_id for system message
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, professional_id, payment_paused, chat_conversation_id')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (order.payment_paused) {
      return new Response(JSON.stringify({ error: 'Order payment is paused' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (order.status !== 'in_progress') {
      return new Response(
        JSON.stringify({ error: `Order must be in_progress to complete. Current status: ${order.status}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', order_id)

    if (updateError) throw updateError

    // Create stage history record
    // Confirmed columns: id, order_id, stage_key, stage_name, started_at,
    // stage_due_date, completed_at, notes, created_at, sla_breached, due_at
    await supabase.from('order_stage_history').insert({
      order_id,
      stage_key: 'completed',
      stage_name: 'Order Completed',
      completed_at: new Date().toISOString(),
      notes: notes || 'Completed by admin',
    })

    // Create payout if professional is assigned
    // NOTE: The original advance-stage has no rollback - if payout insert fails,
    // order is already completed but no payout exists. We add a rollback here.
    if (order.professional_id) {
      const { data: orderWithPrice } = await supabase
        .from('orders')
        .select('total_paisa_snapshot')
        .eq('id', order_id)
        .single()

      if (orderWithPrice) {
        // Platform fee confirmed at 20% (verified in advance-stage/index.ts:202)
        const platformFeePercent = 20
        const platformFee = Math.round(orderWithPrice.total_paisa_snapshot * (platformFeePercent / 100))
        const payoutAmount = orderWithPrice.total_paisa_snapshot - platformFee

        const { error: payoutError } = await supabase.from('payouts').insert({
          order_id,
          professional_id: order.professional_id,
          amount_paisa: payoutAmount,
          platform_fee_paisa: platformFee,
          status: 'pending',
        })

        if (payoutError) {
          // Rollback: revert order status to in_progress
          await supabase
            .from('orders')
            .update({ status: 'in_progress', completed_at: null })
            .eq('id', order_id)
          return new Response(
            JSON.stringify({ error: 'Payout creation failed. Order status has been reverted.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Use orders.chat_conversation_id directly (always set for paid orders)
    if (order.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: order.chat_conversation_id,
        sender_type: 'system',
        content: 'This order has been marked as completed.',
        message_type: 'system',
        sent_at: new Date().toISOString(),
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('admin-advance-stage error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
