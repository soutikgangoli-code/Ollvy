// set-professional-leave
// Full implementation per spec §22
//
// Sets professional leave dates. On-leave professionals skip auto-assignment.
// Body: { leave_start: string, leave_end: string }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface SetLeaveRequest {
  leave_start: string;
  leave_end: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and confirm user is a professional
    const authResult = await verifyProfessional(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 403,
        }
      );
    }

    const professionalId = authResult.professionalId;
    const supabase = getSupabaseAdmin();

    // Parse request body
    const body: SetLeaveRequest = await req.json();
    const { leave_start, leave_end } = body;

    // Validate dates
    if (!leave_start || !leave_end) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Both leave_start and leave_end are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const startDate = new Date(leave_start);
    const endDate = new Date(leave_end);
    const now = new Date();

    // Validate start date is not in the past
    if (startDate < new Date(now.toISOString().split('T')[0])) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Leave start date cannot be in the past' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate end date is after start date
    if (endDate < startDate) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Leave end date must be after start date' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate leave duration (max 30 days)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Leave duration cannot exceed 30 days' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check if professional has any active orders
    const { count: activeOrdersCount, error: orderError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId)
      .in('status', ['pending_assignment', 'in_progress']);

    if (orderError) {
      console.error('Error checking active orders:', orderError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to check active orders' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Warn if there are active orders (but still allow setting leave)
    const hasActiveOrders = (activeOrdersCount || 0) > 0;

    // Update all professional_availability records
    const { error: updateError } = await supabase
      .from('professional_availability')
      .update({
        on_leave_until: leave_end,
        updated_at: new Date().toISOString(),
      })
      .eq('professional_id', professionalId);

    if (updateError) {
      console.error('Error updating availability:', updateError);

      // If no availability record exists, create one
      if (updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('professional_availability')
          .insert({
            professional_id: professionalId,
            city: 'default', // Will be updated when professional sets cities
            is_available: true,
            on_leave_until: leave_end,
            max_concurrent_orders: 5,
            current_active_orders: 0,
          });

        if (insertError) {
          console.error('Error inserting availability:', insertError);
          return new Response(
            JSON.stringify({ ok: false, error: 'Failed to set leave' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to set leave' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
    }

    // Also set is_available = false on professionals table during leave
    // The check-leave-returns cron will restore this when leave ends
    await supabase
      .from('professionals')
      .update({
        is_available: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', professionalId);

    return new Response(
      JSON.stringify({
        ok: true,
        leave_start,
        leave_end,
        warning: hasActiveOrders
          ? `You have ${activeOrdersCount} active order(s). Please complete them before your leave starts.`
          : null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('set-professional-leave error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
