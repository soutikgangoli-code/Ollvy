// check-application-sla
// Full implementation per §22
//
// Cron: 10:30am IST daily
// Finds professional_applications WHERE status = submitted AND submitted_at < now() - 72 hours
// Creates admin_notification (deduplication: one per breach, not daily)
// Does NOT auto-reject

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
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
    const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);

    // Find applications past 72h SLA
    const { data: overdueApps, error: fetchError } = await supabase
      .from('professional_applications')
      .select('id, name, submitted_at, sla_breach_notified')
      .eq('status', 'submitted')
      .lt('submitted_at', seventyTwoHoursAgo.toISOString())
      .or('sla_breach_notified.is.null,sla_breach_notified.eq.false');

    if (fetchError) {
      throw new Error(`Failed to fetch applications: ${fetchError.message}`);
    }

    if (!overdueApps || overdueApps.length === 0) {
      return new Response(
        JSON.stringify({
          ok: true,
          message: 'No overdue applications found',
          overdue_count: 0,
          processed_at: now.toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Create admin notification
    await supabase.from('admin_notifications').insert({
      type: 'application_sla_breach',
      title: `${overdueApps.length} professional applications past 72h SLA`,
      message: `The following applications have been pending over 72 hours: ${overdueApps.map(a => a.name).join(', ')}`,
      data: {
        count: overdueApps.length,
        application_ids: overdueApps.map(a => a.id),
        names: overdueApps.map(a => a.name)
      },
      read: false,
    });

    // Mark applications as notified to prevent duplicate notifications
    const appIds = overdueApps.map(a => a.id);
    await supabase
      .from('professional_applications')
      .update({ sla_breach_notified: true })
      .in('id', appIds);

    return new Response(
      JSON.stringify({
        ok: true,
        overdue_count: overdueApps.length,
        applications_flagged: appIds,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-application-sla error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
