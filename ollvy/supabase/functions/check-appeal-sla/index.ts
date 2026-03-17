// check-appeal-sla
// Cron: runs daily at 11:15am IST
// Auto-accepts any strike appeal pending more than 48h
// Calls apply-strike void logic (decrement strike_count)
// Sends push to professional with outcome

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify service role key for cron jobs
    const authResult = verifyCron(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Find all pending appeals submitted more than 48h ago
    const { data: overdueAppeals, error: fetchError } = await supabase
      .from('strike_appeals')
      .select(`
        id,
        professional_id,
        order_id,
        sla_alert_id,
        reason,
        submitted_at,
        professionals (
          id,
          name,
          strike_count
        ),
        orders (
          order_number
        )
      `)
      .eq('status', 'pending')
      .lte('submitted_at', fortyEightHoursAgo.toISOString());

    if (fetchError) {
      throw new Error(`Failed to fetch overdue appeals: ${fetchError.message}`);
    }

    const results = {
      appealsAutoAccepted: 0,
      strikesVoided: 0,
      errors: [] as string[],
    };

    for (const appeal of (overdueAppeals || [])) {
      try {
        const professional = appeal.professionals as any;
        const order = appeal.orders as any;

        // Auto-accept the appeal (status = voided)
        const { error: updateError } = await supabase
          .from('strike_appeals')
          .update({
            status: 'voided',
            reviewed_at: now.toISOString(),
            // reviewed_by is null for auto-accept
          })
          .eq('id', appeal.id);

        if (updateError) {
          results.errors.push(`Failed to update appeal ${appeal.id}: ${updateError.message}`);
          continue;
        }

        results.appealsAutoAccepted++;

        // Decrement the professional's strike count
        const currentStrikeCount = professional?.strike_count || 0;
        const newStrikeCount = Math.max(0, currentStrikeCount - 1);

        const { error: strikeUpdateError } = await supabase
          .from('professionals')
          .update({ strike_count: newStrikeCount })
          .eq('id', appeal.professional_id);

        if (strikeUpdateError) {
          results.errors.push(`Failed to decrement strike for professional ${appeal.professional_id}: ${strikeUpdateError.message}`);
        } else {
          results.strikesVoided++;
        }

        // Send push notification to professional
        await supabase.from('notifications').insert({
          professional_id: appeal.professional_id,
          type: 'appeal_auto_accepted',
          title: 'Appeal Accepted',
          body: `Your appeal for order ${order?.order_number || 'N/A'} was automatically accepted due to admin inactivity. Strike has been removed.`,
          data: {
            appeal_id: appeal.id,
            order_id: appeal.order_id,
            new_strike_count: newStrikeCount,
          },
        });

        // Write to audit log
        await supabase.from('admin_audit_log').insert({
          admin_user_id: null, // System action
          action: 'auto_accept_appeal',
          target_type: 'strike_appeal',
          target_id: appeal.id,
          notes: 'Appeal auto-accepted due to 48h SLA breach',
          payload: {
            professional_id: appeal.professional_id,
            old_strike_count: currentStrikeCount,
            new_strike_count: newStrikeCount,
          },
        });
      } catch (err) {
        results.errors.push(`Error processing appeal ${appeal.id}: ${(err as Error).message}`);
      }
    }

    // Create admin notification if any appeals were auto-resolved
    if (results.appealsAutoAccepted > 0) {
      await supabase.from('admin_notifications').insert({
        type: 'appeals_auto_resolved',
        title: 'Strike Appeals Auto-Resolved',
        body: `${results.appealsAutoAccepted} strike appeal(s) were auto-accepted due to SLA breach (48h review period exceeded).`,
        related_id: null,
        related_type: 'strike_appeal',
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        ...results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-appeal-sla error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
