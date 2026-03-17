// update-health-scores
// Full implementation per §22
//
// Cron: 7am daily IST
// Recomputes compliance_health_score for all users
// Score = 100 - (overdue_count * 20) - (due_soon_count * 5)
// Capped at 0 minimum

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
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    let usersUpdated = 0;

    // Get all users with compliance obligations
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .not('business_type', 'is', null);

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    for (const user of users || []) {
      // Count overdue obligations
      const { count: overdueCount } = await supabase
        .from('compliance_obligations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .lt('due_date', now.toISOString());

      // Count due soon (within 7 days)
      const { count: dueSoonCount } = await supabase
        .from('compliance_obligations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .gte('due_date', now.toISOString())
        .lte('due_date', sevenDaysFromNow.toISOString());

      // Calculate health score
      const overdue = overdueCount || 0;
      const dueSoon = dueSoonCount || 0;
      const healthScore = Math.max(0, 100 - (overdue * 20) - (dueSoon * 5));

      // Update user's health score
      const { error: updateError } = await supabase
        .from('users')
        .update({
          compliance_health_score: healthScore,
          health_score_updated_at: now.toISOString()
        })
        .eq('id', user.id);

      if (!updateError) {
        usersUpdated++;
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        users_updated: usersUpdated,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('update-health-scores error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
