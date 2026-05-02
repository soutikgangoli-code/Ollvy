// process-payouts
// Full implementation per §22
//
// Cron: every Monday 9:00am IST
// Payout split: total × (1 - platform_fee_percent/100)
// Rs 500 minimum threshold — skip professionals below this, send admin email
// Missing fund_account_id: skip + send admin email
// Govt fee reimbursements transferred at full amount, no platform fee deducted
// Failed payouts: set status=failed, send admin email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { sendEmail } from '../_shared/email.ts';

const MIN_PAYOUT_PAISA = 50000; // Rs 500 minimum

interface PayoutSummary {
  professional_id: string;
  professional_name: string;
  total_order_paisa: number;
  total_govt_fee_paisa: number;
  platform_fee_paisa: number;
  net_payout_paisa: number;
  payout_ids: string[];
}

// Send admin email helper. Wraps the shared sendEmail with the admin-recipients
// lookup so existing call sites in this file don't need to change.
async function sendAdminEmail(
  supabase: any,
  subject: string,
  body: string
): Promise<void> {
  const { data: settings } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'admin_email_recipients')
    .single();

  if (!settings?.value) {
    console.error(JSON.stringify({
      event: 'admin_email_skipped',
      reason: 'no_admin_recipients_configured',
      subject,
    }));
    return;
  }

  const recipients = typeof settings.value === 'string'
    ? JSON.parse(settings.value)
    : settings.value;

  const result = await sendEmail({
    to: recipients,
    subject,
    text: body,
  });
  if (!result.success) {
    console.error(JSON.stringify({
      event: 'admin_email_failed',
      subject,
      error: result.error,
    }));
  }
}

// Call Razorpay Transfer API
async function createRazorpayTransfer(
  fundAccountId: string,
  amountPaisa: number,
  referenceId: string
): Promise<{ success: boolean; payout_id?: string; error?: string }> {
  const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
  const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  if (!razorpayKeyId || !razorpayKeySecret) {
    return { success: false, error: 'Razorpay credentials not configured' };
  }

  try {
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    const response = await fetch('https://api.razorpay.com/v1/payouts', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_number: Deno.env.get('RAZORPAY_ACCOUNT_NUMBER') || '',
        fund_account_id: fundAccountId,
        amount: amountPaisa,
        currency: 'INR',
        mode: 'NEFT',
        purpose: 'payout',
        queue_if_low_balance: true,
        reference_id: referenceId,
        narration: 'Ollvy Professional Payout',
      }),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      return { success: true, payout_id: data.id };
    } else {
      return { success: false, error: data.error?.description || 'Transfer failed' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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

    // Get platform fee percentage from app_settings
    const { data: feeSettings } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'platform_fee_percent')
      .single();

    const platformFeePercent = feeSettings?.value
      ? parseFloat(feeSettings.value)
      : 20; // Default 20%

    // Get all pending payouts grouped by professional
    const { data: pendingPayouts, error: payoutsError } = await supabase
      .from('payouts')
      .select(`
        id,
        professional_id,
        amount_paisa,
        type,
        professionals!inner(
          id,
          name,
          professional_bank_accounts(
            razorpay_fund_account_id,
            is_verified
          )
        )
      `)
      .eq('status', 'pending');

    if (payoutsError) {
      throw new Error(`Failed to fetch pending payouts: ${payoutsError.message}`);
    }

    if (!pendingPayouts || pendingPayouts.length === 0) {
      return new Response(
        JSON.stringify({
          ok: true,
          message: 'No pending payouts to process',
          processed: 0,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Group payouts by professional
    const professionalPayouts = new Map<string, PayoutSummary>();

    for (const payout of pendingPayouts) {
      const profId = payout.professional_id;
      const prof = payout.professionals as any;

      if (!professionalPayouts.has(profId)) {
        professionalPayouts.set(profId, {
          professional_id: profId,
          professional_name: prof.name,
          total_order_paisa: 0,
          total_govt_fee_paisa: 0,
          platform_fee_paisa: 0,
          net_payout_paisa: 0,
          payout_ids: [],
        });
      }

      const summary = professionalPayouts.get(profId)!;
      summary.payout_ids.push(payout.id);

      if (payout.type === 'govt_fee_reimbursement') {
        // Govt fee reimbursements: full amount, no platform fee
        summary.total_govt_fee_paisa += payout.amount_paisa;
      } else {
        // Regular payouts: apply platform fee
        summary.total_order_paisa += payout.amount_paisa;
      }
    }

    // Calculate net payouts
    for (const summary of professionalPayouts.values()) {
      // Platform fee only on order payouts, not on govt fee reimbursements
      summary.platform_fee_paisa = Math.round(
        summary.total_order_paisa * (platformFeePercent / 100)
      );
      summary.net_payout_paisa =
        (summary.total_order_paisa - summary.platform_fee_paisa) +
        summary.total_govt_fee_paisa;
    }

    const results = {
      processed: 0,
      skipped_below_minimum: 0,
      skipped_no_bank: 0,
      failed: 0,
      success: 0,
      total_paid_paisa: 0,
    };

    const adminAlerts: string[] = [];

    // Process each professional's payout
    for (const [profId, summary] of professionalPayouts) {
      // Check minimum threshold
      if (summary.net_payout_paisa < MIN_PAYOUT_PAISA) {
        results.skipped_below_minimum++;
        adminAlerts.push(
          `${summary.professional_name}: Skipped - below Rs 500 minimum (Rs ${(summary.net_payout_paisa / 100).toFixed(2)})`
        );
        continue;
      }

      // Get bank account details
      const { data: bankAccount } = await supabase
        .from('professional_bank_accounts')
        .select('razorpay_fund_account_id, is_verified')
        .eq('professional_id', profId)
        .single();

      if (!bankAccount?.razorpay_fund_account_id) {
        results.skipped_no_bank++;
        adminAlerts.push(
          `${summary.professional_name}: Skipped - missing bank account/fund_account_id`
        );

        // Update payouts as requiring bank details
        await supabase
          .from('payouts')
          .update({ status: 'pending' }) // Keep pending, will retry next week
          .in('id', summary.payout_ids);

        continue;
      }

      // Create Razorpay transfer
      const referenceId = `ollvy_payout_${profId}_${Date.now()}`;
      const transferResult = await createRazorpayTransfer(
        bankAccount.razorpay_fund_account_id,
        summary.net_payout_paisa,
        referenceId
      );

      if (transferResult.success) {
        // Update all payouts as paid
        await supabase
          .from('payouts')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            razorpay_payout_id: transferResult.payout_id,
            platform_fee_paisa: Math.round(
              summary.platform_fee_paisa / summary.payout_ids.length
            ),
          })
          .in('id', summary.payout_ids);

        results.success++;
        results.total_paid_paisa += summary.net_payout_paisa;

        // Send push notification to professional
        // (Would call send-notification here)
      } else {
        // Mark payouts as failed
        await supabase
          .from('payouts')
          .update({
            status: 'failed',
            error_message: transferResult.error,
          })
          .in('id', summary.payout_ids);

        results.failed++;
        adminAlerts.push(
          `${summary.professional_name}: FAILED - ${transferResult.error}`
        );
      }

      results.processed++;
    }

    // Send admin email summary if there are alerts
    if (adminAlerts.length > 0) {
      const emailBody = `
Weekly Payout Processing Summary
================================

Date: ${new Date().toISOString().split('T')[0]}

Summary:
- Processed: ${results.processed}
- Successful: ${results.success}
- Failed: ${results.failed}
- Skipped (below Rs 500): ${results.skipped_below_minimum}
- Skipped (no bank account): ${results.skipped_no_bank}
- Total Paid: Rs ${(results.total_paid_paisa / 100).toFixed(2)}

Alerts:
${adminAlerts.map(a => `- ${a}`).join('\n')}
      `.trim();

      await sendAdminEmail(
        supabase,
        `[Ops] Weekly payouts - ${results.success} paid, ${results.failed + results.skipped_no_bank} need attention`,
        emailBody
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        results,
        alerts: adminAlerts.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('process-payouts error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
