// razorpay-payout
// Full implementation per §22
//
// HTTP POST (admin)
// Weekly batch payout to professionals
// Gate: requires razorpay_fund_account_id
// Admin banner if missing

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface PayoutRequest {
  professional_id?: string; // Optional: specific professional, otherwise all eligible
  dry_run?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await verifyAdmin(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const body: PayoutRequest = await req.json().catch(() => ({}));
    const supabase = getSupabaseAdmin();
    const now = new Date();
    const results: Array<{ professional_id: string; name: string; amount_paisa: number; status: string; error?: string }> = [];

    // Get professionals with pending payouts
    let query = supabase
      .from('professionals')
      .select('id, name, razorpay_fund_account_id, razorpay_contact_id')
      .eq('status', 'active');

    if (body.professional_id) {
      query = query.eq('id', body.professional_id);
    }

    const { data: professionals, error: fetchError } = await query;

    if (fetchError) {
      throw new Error(`Failed to fetch professionals: ${fetchError.message}`);
    }

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    for (const pro of professionals || []) {
      // Check if fund account exists
      if (!pro.razorpay_fund_account_id) {
        // Create admin notification
        await supabase.from('admin_notifications').insert({
          type: 'missing_bank_details',
          title: `${pro.name} has no bank details`,
          message: `Payout held for ${pro.name} - bank details missing.`,
          data: { professional_id: pro.id },
          read: false,
        });

        results.push({
          professional_id: pro.id,
          name: pro.name,
          amount_paisa: 0,
          status: 'skipped',
          error: 'Missing razorpay_fund_account_id'
        });
        continue;
      }

      // Calculate pending payout amount
      const { data: pendingPayouts, error: payoutError } = await supabase
        .from('professional_payouts')
        .select('id, amount_paisa, order_id')
        .eq('professional_id', pro.id)
        .eq('status', 'pending');

      if (payoutError || !pendingPayouts || pendingPayouts.length === 0) {
        results.push({
          professional_id: pro.id,
          name: pro.name,
          amount_paisa: 0,
          status: 'no_pending',
        });
        continue;
      }

      const totalAmountPaisa = pendingPayouts.reduce((sum, p) => sum + p.amount_paisa, 0);

      // Skip if below minimum threshold (Rs 500 = 50000 paisa)
      if (totalAmountPaisa < 50000) {
        results.push({
          professional_id: pro.id,
          name: pro.name,
          amount_paisa: totalAmountPaisa,
          status: 'below_threshold',
          error: 'Below Rs 500 minimum'
        });
        continue;
      }

      if (body.dry_run) {
        results.push({
          professional_id: pro.id,
          name: pro.name,
          amount_paisa: totalAmountPaisa,
          status: 'dry_run',
        });
        continue;
      }

      // Create Razorpay Payout
      if (razorpayKeyId && razorpayKeySecret) {
        try {
          const authHeader = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

          const rzpResponse = await fetch('https://api.razorpay.com/v1/payouts', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authHeader}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              account_number: Deno.env.get('RAZORPAY_ACCOUNT_NUMBER'),
              fund_account_id: pro.razorpay_fund_account_id,
              amount: totalAmountPaisa,
              currency: 'INR',
              mode: 'NEFT',
              purpose: 'payout',
              queue_if_low_balance: true,
              reference_id: `payout_${pro.id}_${now.getTime()}`,
              narration: 'Ollvy Professional Payout',
            }),
          });

          const rzpData = await rzpResponse.json();

          if (rzpResponse.ok && rzpData.id) {
            // Update payout records
            const payoutIds = pendingPayouts.map(p => p.id);
            await supabase
              .from('professional_payouts')
              .update({
                status: 'processing',
                razorpay_payout_id: rzpData.id,
                processed_at: now.toISOString()
              })
              .in('id', payoutIds);

            results.push({
              professional_id: pro.id,
              name: pro.name,
              amount_paisa: totalAmountPaisa,
              status: 'processing',
            });
          } else {
            results.push({
              professional_id: pro.id,
              name: pro.name,
              amount_paisa: totalAmountPaisa,
              status: 'failed',
              error: rzpData.error?.description || 'Razorpay error'
            });

            // Admin notification for failed payout
            await supabase.from('admin_notifications').insert({
              type: 'payout_failed',
              title: `Payout failed for ${pro.name}`,
              message: `Failed to process ₹${totalAmountPaisa / 100} payout: ${rzpData.error?.description || 'Unknown error'}`,
              data: { professional_id: pro.id, amount_paisa: totalAmountPaisa },
              read: false,
            });
          }
        } catch (e) {
          results.push({
            professional_id: pro.id,
            name: pro.name,
            amount_paisa: totalAmountPaisa,
            status: 'error',
            error: e.message
          });
        }
      } else {
        results.push({
          professional_id: pro.id,
          name: pro.name,
          amount_paisa: totalAmountPaisa,
          status: 'skipped',
          error: 'Razorpay credentials not configured'
        });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        results,
        processed_at: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('razorpay-payout error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
