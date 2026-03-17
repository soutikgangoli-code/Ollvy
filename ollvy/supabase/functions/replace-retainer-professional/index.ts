// replace-retainer-professional
// Internal function per §6 and §22
//
// Spec:
// - Fired on professional suspension
// - Find next best professional using same algorithm as auto-assign
// - If no professional available: auto-pause (no pause count deducted)
// - Admin alerted
// - User notified generically: 'Your Ollvy specialist has been reassigned.'

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron, verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface ReplaceProBody {
  retainer_subscription_id: string;
  reason?: string;
}

export async function replaceRetainerProfessional(input: ReplaceProBody): Promise<{ ok: boolean; error?: string; new_professional_id?: string }> {
  const supabase = getSupabaseAdmin();

  try {
    const { retainer_subscription_id, reason } = input;

    if (!retainer_subscription_id) {
      return { ok: false, error: 'retainer_subscription_id is required' };
    }

    // Fetch retainer
    const { data: retainer, error: retainerError } = await supabase
      .from('retainer_subscriptions')
      .select(`
        *,
        service_packages!inner (id, name),
        users!inner (id, state, city, subscription_tier)
      `)
      .eq('id', retainer_subscription_id)
      .single();

    if (retainerError || !retainer) {
      return { ok: false, error: 'Retainer subscription not found' };
    }

    if (!['active', 'onboarding'].includes(retainer.status)) {
      return { ok: false, error: `Cannot replace professional for retainer with status: ${retainer.status}` };
    }

    const oldProfessionalId = retainer.assigned_professional_id;

    // Find new professional using auto-assign algorithm
    // 3-tier geo-matching: city -> state -> national
    const isPro = retainer.users.subscription_tier === 'pro';

    const findProfessional = async (geoFilter: { city?: string; state?: string }) => {
      let query = supabase
        .from('professionals')
        .select(`
          id, display_name,
          professional_availability!inner (current_active_orders, max_concurrent_orders)
        `)
        .eq('status', 'approved')
        .not('id', 'eq', oldProfessionalId) // Exclude current professional
        .contains('service_areas', [retainer.service_package_id]);

      // Add geo filter
      if (geoFilter.city) {
        query = query.eq('city', geoFilter.city);
      } else if (geoFilter.state) {
        query = query.eq('state', geoFilter.state);
      }

      // Check capacity
      const { data } = await query;
      if (!data || data.length === 0) return null;

      // Filter by available capacity and bank details
      const available = data.filter((p: any) => {
        const avail = p.professional_availability;
        return avail && avail.current_active_orders < avail.max_concurrent_orders;
      });

      if (available.length === 0) return null;

      // Sort by last_assigned_at for round-robin fairness
      // For now, just pick first available
      return available[0];
    };

    // Try city -> state -> national
    let newProfessional = await findProfessional({ city: retainer.users.city });
    if (!newProfessional) {
      newProfessional = await findProfessional({ state: retainer.users.state });
    }
    if (!newProfessional) {
      newProfessional = await findProfessional({});
    }

    if (!newProfessional) {
      // No professional available - auto-pause (does NOT count against pause limit)
      await supabase
        .from('retainer_subscriptions')
        .update({
          status: 'paused',
          pause_start_date: new Date().toISOString(),
          // Note: pause_count NOT incremented for system pauses
        })
        .eq('id', retainer_subscription_id);

      // Create admin notification
      await supabase.from('admin_notifications').insert({
        type: 'no_professional_available',
        title: 'Retainer Auto-Paused',
        message: `Retainer ${retainer_subscription_id} auto-paused - no replacement professional available. Reason: ${reason || 'Professional suspension'}`,
        severity: 'warning',
      });

      // Notify user
      await supabase.from('notifications').insert({
        user_id: retainer.user_id,
        type: 'retainer_paused_no_pro',
        title: 'Service Temporarily Paused',
        body: `Your ${retainer.service_packages.name} service has been temporarily paused. We're working to assign a new specialist.`,
      });

      return { ok: true, error: 'No replacement professional available - retainer auto-paused' };
    }

    // Update retainer with new professional
    await supabase
      .from('retainer_subscriptions')
      .update({ assigned_professional_id: newProfessional.id })
      .eq('id', retainer_subscription_id);

    // Update any active child orders
    await supabase
      .from('orders')
      .update({ professional_id: newProfessional.id })
      .eq('retainer_subscription_id', retainer_subscription_id)
      .in('status', ['assigned', 'in_progress']);

    // Notify user (generic message - no professional name)
    await supabase.from('notifications').insert({
      user_id: retainer.user_id,
      type: 'retainer_professional_replaced',
      title: 'Specialist Reassigned',
      body: 'Your Ollvy specialist has been reassigned to ensure continuity of service.',
    });

    // Add system message to chat
    if (retainer.chat_conversation_id) {
      await supabase.from('chat_messages').insert({
        conversation_id: retainer.chat_conversation_id,
        sender_type: 'system',
        content: 'Your Ollvy specialist has been reassigned to ensure continuity.',
      });
    }

    // Create admin notification
    await supabase.from('admin_notifications').insert({
      type: 'professional_replaced',
      title: 'Professional Replaced',
      message: `Professional replaced for retainer ${retainer_subscription_id}. New: ${newProfessional.id}. Reason: ${reason || 'Not specified'}`,
      severity: 'info',
    });

    console.log(`Replaced professional for retainer ${retainer_subscription_id}: ${oldProfessionalId} -> ${newProfessional.id}`);

    return { ok: true, new_professional_id: newProfessional.id };
  } catch (error) {
    console.error('Replace retainer professional error:', error);
    return { ok: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Internal function - requires service role key or admin auth
  const cronAuth = verifyCron(req);
  const adminAuth = await verifyAdmin(req);

  if (!cronAuth.success && !adminAuth.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Unauthorized - requires service role key or admin auth' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  const body = await req.json();
  const result = await replaceRetainerProfessional(body);

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.ok ? 200 : 500 }
  );
});
