// activate-service
// Full implementation per spec §22
//
// Body: { service_package_id, is_active: bool }
// Sets service_packages.is_active
// If deactivating: checks for active orders on this service
// If activating: sets is_active = true immediately
// Admin audit log entry written on every call

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface ActivateServiceInput {
  service_package_id: string;
  is_active: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and confirm user is an admin
    const authResult = await verifyAdmin(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 403,
        }
      );
    }

    // Only ops_admin and super_admin can activate/deactivate services
    if (!['ops_admin', 'super_admin'].includes(authResult.role!)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Insufficient permissions' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    const adminId = authResult.adminId!;
    const body: ActivateServiceInput = await req.json();
    const { service_package_id, is_active } = body;

    if (!service_package_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'service_package_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (typeof is_active !== 'boolean') {
      return new Response(
        JSON.stringify({ ok: false, error: 'is_active (boolean) is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Get the service package
    const { data: service, error: fetchError } = await supabase
      .from('service_packages')
      .select('id, name, slug, is_active')
      .eq('id', service_package_id)
      .single();

    if (fetchError || !service) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Service package not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check if state is already the target state
    if (service.is_active === is_active) {
      return new Response(
        JSON.stringify({
          ok: true,
          service_package_id,
          is_active,
          message: `Service is already ${is_active ? 'active' : 'inactive'}`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // If deactivating, check for active orders
    if (!is_active) {
      const { count: activeOrdersCount, error: countError } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('service_package_id', service_package_id)
        .in('status', ['paid', 'assigned', 'waitlisted', 'in_progress']);

      if (countError) {
        console.error('Failed to count active orders:', countError);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to check active orders' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      if (activeOrdersCount && activeOrdersCount > 0) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'ACTIVE_ORDERS_EXIST',
            active_orders_count: activeOrdersCount,
            message: `Cannot deactivate service: ${activeOrdersCount} active order(s) exist`,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      // Also check active retainers
      const { count: activeRetainersCount } = await supabase
        .from('retainer_subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('service_package_id', service_package_id)
        .eq('status', 'active');

      if (activeRetainersCount && activeRetainersCount > 0) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'ACTIVE_RETAINERS_EXIST',
            active_retainers_count: activeRetainersCount,
            message: `Cannot deactivate service: ${activeRetainersCount} active retainer(s) exist`,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    }

    // Update service status
    const { error: updateError } = await supabase
      .from('service_packages')
      .update({
        is_active,
        updated_at: now.toISOString(),
      })
      .eq('id', service_package_id);

    if (updateError) {
      console.error('Failed to update service:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to update service status' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Write to admin audit log
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminId,
      action: is_active ? 'activate_service' : 'deactivate_service',
      target_type: 'service_package',
      target_id: service_package_id,
      notes: `${is_active ? 'Activated' : 'Deactivated'} service: ${service.name}`,
      payload: {
        service_name: service.name,
        service_slug: service.slug,
        is_active,
      },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        service_package_id,
        is_active,
        message: `Service "${service.name}" has been ${is_active ? 'activated' : 'deactivated'}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('activate-service error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
