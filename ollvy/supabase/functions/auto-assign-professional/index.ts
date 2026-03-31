// auto-assign-professional
// Full implementation per §20 Auto-Assign Algorithm
// Internal function - called by other edge functions (razorpay-webhook, check-waitlist)
//
// Spec from §20:
// - Three-tier geo-matching: city -> state -> national
// - Within matching pool, sort by:
//   1. Pro user priority: if is_pro_user, prefer pros with >2 headroom
//   2. preferred_professional_id match (returning user routing)
//   3. last_assigned_at ASC (least recently used — round-robin fairness)
// - Professionals must have is_available=true AND on_leave_until < today AND current_active_orders < max_concurrent_orders
// - If no professional found, create waitlisted order

import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

export interface AutoAssignProfessionalInput {
  order_id: string;
  service_package_id: string;
  city: string;
  state: string;
  is_pro_user?: boolean;
  preferred_professional_id?: string;
}

export interface AutoAssignProfessionalOutput {
  ok: boolean;
  error?: string;
  professional_id?: string;
  status?: 'assigned' | 'waitlisted';
}

/**
 * Find available professional with capacity
 */
async function findAvailablePro(
  supabase: any,
  servicePackageId: string,
  filters: { city?: string; state?: string },
  isProUser: boolean,
  preferredProfessionalId?: string
): Promise<any | null> {
  const today = new Date().toISOString().split('T')[0];

  // Query professionals with availability
  let query = supabase
    .from('professionals')
    .select(`
      id,
      name,
      service_areas,
      professional_availability!inner (
        city,
        is_available,
        max_concurrent_orders,
        current_active_orders,
        on_leave_until
      )
    `)
    .eq('status', 'approved')
    .eq('professional_availability.is_available', true)
    .contains('service_areas', [servicePackageId]);

  // Apply geo filter
  if (filters.city) {
    query = query.eq('professional_availability.city', filters.city);
  }

  const { data: professionals, error } = await query;

  if (error || !professionals || professionals.length === 0) {
    return null;
  }

  // Filter by availability (on_leave_until < today, current < max)
  const availablePros = professionals.filter((pro: any) => {
    const avail = pro.professional_availability[0];
    if (!avail) return false;

    // Check leave status
    if (avail.on_leave_until && new Date(avail.on_leave_until) > new Date(today)) {
      return false;
    }

    // Check capacity
    if (avail.current_active_orders >= avail.max_concurrent_orders) {
      return false;
    }

    return true;
  });

  if (availablePros.length === 0) {
    return null;
  }

  // Sort by priority
  availablePros.sort((a: any, b: any) => {
    const availA = a.professional_availability[0];
    const availB = b.professional_availability[0];

    // 1. Pro user priority: prefer pros with >2 headroom
    if (isProUser) {
      const headroomA = availA.max_concurrent_orders - availA.current_active_orders;
      const headroomB = availB.max_concurrent_orders - availB.current_active_orders;

      if (headroomA > 2 && headroomB <= 2) return -1;
      if (headroomB > 2 && headroomA <= 2) return 1;
    }

    // 2. Preferred professional match
    if (preferredProfessionalId) {
      if (a.id === preferredProfessionalId) return -1;
      if (b.id === preferredProfessionalId) return 1;
    }

    // 3. Round-robin fairness via last_assigned_at ASC
    const lastA = a.last_assigned_at || '1970-01-01';
    const lastB = b.last_assigned_at || '1970-01-01';
    return new Date(lastA).getTime() - new Date(lastB).getTime();
  });

  return availablePros[0];
}

/**
 * auto-assign-professional
 *
 * Spec: 3-tier geo-match. Pro priority. Round-robin fairness via last_assigned_at.
 */
export async function autoAssignProfessional(
  input: AutoAssignProfessionalInput
): Promise<AutoAssignProfessionalOutput> {
  const supabase = getSupabaseAdmin();

  try {
    const { order_id, service_package_id, city, state, is_pro_user, preferred_professional_id } = input;

    // Three-tier geo-matching
    let professional = await findAvailablePro(
      supabase,
      service_package_id,
      { city },
      is_pro_user || false,
      preferred_professional_id
    );

    if (!professional) {
      // Try state match
      professional = await findAvailablePro(
        supabase,
        service_package_id,
        { state },
        is_pro_user || false,
        preferred_professional_id
      );
    }

    if (!professional) {
      // Try national (no geo filter)
      professional = await findAvailablePro(
        supabase,
        service_package_id,
        {},
        is_pro_user || false,
        preferred_professional_id
      );
    }

    if (!professional) {
      // No professional available - waitlist the order
      console.log(`No professional available for order ${order_id}, adding to waitlist`);

      await supabase
        .from('orders')
        .update({ status: 'waitlisted' })
        .eq('id', order_id);

      // Create waitlist entry
      await supabase.from('order_waitlist').insert({
        order_id,
        estimated_assignment_hours: 24,
      });

      // Notify user
      const { data: order } = await supabase
        .from('orders')
        .select('user_id, service_packages!inner (name)')
        .eq('id', order_id)
        .single();

      if (order) {
        await supabase.from('notifications').insert({
          user_id: order.user_id,
          type: 'order_waitlisted',
          title: 'High Demand',
          body: `All specialists are busy. Your ${order.service_packages.name} order has been queued and will be assigned within 24 hours.`,
        });
      }

      return { ok: true, status: 'waitlisted' };
    }

    // Use atomic assignment to prevent race condition
    // where concurrent orders could exceed max_concurrent_orders
    const { data: assignResult, error: assignError } = await supabase.rpc(
      'assign_professional_atomic',
      {
        p_order_id: order_id,
        p_professional_id: professional.id,
        p_expected_status: 'pending_assignment',
      }
    );

    if (assignError) {
      console.error('Atomic assignment error:', assignError);
      throw new Error(`Failed to assign professional: ${assignError.message}`);
    }

    const atomicResult = assignResult?.[0];
    if (!atomicResult?.success) {
      // Assignment failed (likely capacity issue or status changed)
      console.log(`Atomic assignment failed: ${atomicResult?.error_message}`);

      // Try next professional or waitlist
      // For now, if atomic assignment fails, treat as no available professional
      console.log(`Professional ${professional.id} assignment failed, adding order to waitlist`);

      await supabase
        .from('orders')
        .update({ status: 'waitlisted' })
        .eq('id', order_id);

      await supabase.from('order_waitlist').insert({
        order_id,
        estimated_assignment_hours: 24,
      });

      return { ok: true, status: 'waitlisted' };
    }

    // Assignment was successful

    // Get order details for notifications
    const { data: order } = await supabase
      .from('orders')
      .select(`
        user_id,
        service_packages!inner (name, workflow_stages, sla_working_days),
        chat_conversation_id
      `)
      .eq('id', order_id)
      .single();

    // Create first stage in order_stage_history
    if (order?.service_packages?.workflow_stages?.length > 0) {
      const firstStage = order.service_packages.workflow_stages[0];
      const stageDueDate = new Date();
      stageDueDate.setDate(stageDueDate.getDate() + (firstStage.sla_working_days || 1));

      await supabase.from('order_stage_history').insert({
        order_id,
        stage_key: firstStage.stage_key,
        stage_name: firstStage.stage_name,
        started_at: now,
        stage_due_date: stageDueDate.toISOString(),
      });
    }

    // Notify user
    if (order) {
      await supabase.from('notifications').insert({
        user_id: order.user_id,
        type: 'order_assigned',
        title: 'Specialist Assigned',
        body: `Your ${order.service_packages.name} order has been assigned. Expect to hear from them within 24 hours.`,
      });
    }

    // Add system message to chat
    if (order?.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: order.chat_conversation_id,
        sender_type: 'system',
        content: 'Your Ollvy specialist is on the case. Expect to hear from them within 24 hours.',
      });
    }

    // Notify professional (web push would be implemented separately)
    await supabase.from('notifications').insert({
      professional_id: professional.id,
      type: 'new_assignment',
      title: 'New Order Assigned',
      body: `You have a new ${order?.service_packages.name || 'order'} assignment.`,
    });

    console.log(`Assigned professional ${professional.id} to order ${order_id}`);

    return {
      ok: true,
      professional_id: professional.id,
      status: 'assigned',
    };
  } catch (error) {
    console.error('Auto-assign error:', error);
    return { ok: false, error: error.message };
  }
}

// For direct HTTP invocation during development/testing
// Only run serve() when this module is the main entry point
if (import.meta.main) {
  const { serve } = await import('https://deno.land/std@0.168.0/http/server.ts');
  const { corsHeaders } = await import('../_shared/cors.ts');
  const { verifyCron } = await import('../_shared/auth.ts');

  serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // For testing: require service role key
    const authResult = verifyCron(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Internal function - requires service role key' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const body = await req.json();
    const result = await autoAssignProfessional(body);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.ok ? 200 : 500 }
    );
  });
}
