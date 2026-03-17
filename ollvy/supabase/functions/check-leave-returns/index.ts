// check-leave-returns
// Full implementation per §22
//
// Cron: 6am daily IST
// Checks professionals whose leave_end_date is today
// Auto-returns them to active status

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
    const today = now.toISOString().split('T')[0];
    let professionalsReturned = 0;

    // Find professionals whose leave ends today or has passed
    const { data: onLeave, error: fetchError } = await supabase
      .from('professionals')
      .select('id, name, leave_end_date')
      .eq('is_on_leave', true)
      .lte('leave_end_date', today);

    if (fetchError) {
      throw new Error(`Failed to fetch professionals on leave: ${fetchError.message}`);
    }

    for (const pro of onLeave || []) {
      // Return professional from leave
      const { error: updateError } = await supabase
        .from('professionals')
        .update({
          is_on_leave: false,
          leave_start_date: null,
          leave_end_date: null,
          leave_returned_at: now.toISOString()
        })
        .eq('id', pro.id);

      if (!updateError) {
        professionalsReturned++;

        // Notify admin
        await supabase.from('admin_notifications').insert({
          type: 'professional_leave_returned',
          title: `${pro.name} returned from leave`,
          message: `${pro.name} has automatically returned from leave and is now available for assignments.`,
          data: { professional_id: pro.id },
          read: false,
        });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        professionals_returned: professionalsReturned,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-leave-returns error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
