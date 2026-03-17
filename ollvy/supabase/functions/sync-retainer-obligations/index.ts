// sync-retainer-obligations
// Full implementation per §6 and §22
//
// Spec:
// - On retainer start: set covered_by_retainer=true for relevant compliance obligations
// - On retainer cancel: revert to upcoming/due_soon/overdue based on due_date

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface SyncObligationsInput {
  retainer_subscription_id: string;
  action: 'start' | 'cancel';
}

export async function syncRetainerObligations(input: SyncObligationsInput): Promise<{ ok: boolean; error?: string; updated_count?: number }> {
  const supabase = getSupabaseAdmin();

  try {
    const { retainer_subscription_id, action } = input;

    if (!retainer_subscription_id || !action) {
      return { ok: false, error: 'retainer_subscription_id and action are required' };
    }

    // Fetch retainer
    const { data: retainer, error: retainerError } = await supabase
      .from('retainer_subscriptions')
      .select(`
        id, user_id, service_package_id,
        service_packages!inner (id, name, compliance_obligation_types)
      `)
      .eq('id', retainer_subscription_id)
      .single();

    if (retainerError || !retainer) {
      return { ok: false, error: 'Retainer subscription not found' };
    }

    // Get obligation types covered by this service
    const obligationTypes = retainer.service_packages.compliance_obligation_types || [];

    if (obligationTypes.length === 0) {
      console.log(`No obligation types configured for service ${retainer.service_package_id}`);
      return { ok: true, updated_count: 0 };
    }

    let updatedCount = 0;

    if (action === 'start') {
      // On retainer start: mark obligations as covered
      const { data, error } = await supabase
        .from('compliance_obligations')
        .update({
          covered_by_retainer: true,
          retainer_subscription_id: retainer_subscription_id,
        })
        .eq('user_id', retainer.user_id)
        .in('obligation_type', obligationTypes)
        .neq('status', 'completed')
        .select();

      if (error) {
        console.error('Failed to update obligations:', error);
        return { ok: false, error: 'Failed to update obligations' };
      }

      updatedCount = data?.length || 0;
      console.log(`Marked ${updatedCount} obligations as covered by retainer ${retainer_subscription_id}`);
    } else if (action === 'cancel') {
      // On retainer cancel: revert covered_by_retainer and recalculate status
      const { data: obligations, error: fetchError } = await supabase
        .from('compliance_obligations')
        .select('id, due_date')
        .eq('retainer_subscription_id', retainer_subscription_id)
        .eq('covered_by_retainer', true);

      if (fetchError) {
        console.error('Failed to fetch obligations:', fetchError);
        return { ok: false, error: 'Failed to fetch obligations' };
      }

      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      for (const obligation of obligations || []) {
        const dueDate = new Date(obligation.due_date);
        let newStatus: string;

        if (dueDate < now) {
          newStatus = 'overdue';
        } else if (dueDate <= sevenDaysFromNow) {
          newStatus = 'due_soon';
        } else {
          newStatus = 'upcoming';
        }

        await supabase
          .from('compliance_obligations')
          .update({
            covered_by_retainer: false,
            retainer_subscription_id: null,
            status: newStatus,
          })
          .eq('id', obligation.id);

        updatedCount++;
      }

      console.log(`Reverted ${updatedCount} obligations from retainer ${retainer_subscription_id}`);
    }

    return { ok: true, updated_count: updatedCount };
  } catch (error) {
    console.error('Sync retainer obligations error:', error);
    return { ok: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Internal function - requires service role key
  const authResult = verifyCron(req);
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal function - requires service role key' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  const body = await req.json();
  const result = await syncRetainerObligations(body);

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: result.ok ? 200 : 500 }
  );
});
