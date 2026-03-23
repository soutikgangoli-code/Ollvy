import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Find all rounds that are awaiting_user and whose deadline has passed
  const { data: overdueRounds, error: fetchError } = await supabase
    .from('order_rounds')
    .select('id, order_id, user_response_deadline, deadline_extended_count')
    .eq('status', 'awaiting_user')
    .eq('deadline_manually_overridden', false)
    .lt('user_response_deadline', new Date().toISOString())

  if (fetchError) {
    console.error('Error fetching overdue rounds:', fetchError)
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 })
  }

  if (!overdueRounds?.length) {
    return new Response(JSON.stringify({ extended: 0 }))
  }

  let extendedCount = 0

  for (const round of overdueRounds) {
    const newDeadline = new Date(
      new Date(round.user_response_deadline).getTime() + 24 * 60 * 60 * 1000
    ).toISOString()

    // Extend round deadline by 24 hours
    const { error: updateRoundError } = await supabase
      .from('order_rounds')
      .update({
        user_response_deadline: newDeadline,
        deadline_extended_count: round.deadline_extended_count + 1,
      })
      .eq('id', round.id)

    if (updateRoundError) {
      console.error('Error updating round:', updateRoundError)
      continue
    }

    // Extend order completion date by 1 day
    const { data: order } = await supabase
      .from('orders')
      .select('expected_completion_date')
      .eq('id', round.order_id)
      .single()

    if (order?.expected_completion_date) {
      const newCompletion = new Date(
        new Date(order.expected_completion_date).getTime() + 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0]

      await supabase
        .from('orders')
        .update({ expected_completion_date: newCompletion })
        .eq('id', round.order_id)
    }

    // Log it
    await supabase.from('order_activity_log').insert({
      order_id: round.order_id,
      action_type: 'sla_auto_extended',
      actor_type: 'system',
      actor_name: 'System',
      description: `SLA deadline automatically extended by 24 hours (user has not responded). Extension #${round.deadline_extended_count + 1}.`,
      metadata: { round_id: round.id, new_deadline: newDeadline },
      created_at: new Date().toISOString(),
    })

    extendedCount++
  }

  return new Response(JSON.stringify({ extended: extendedCount }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
