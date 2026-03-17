// apply-referral-credit
// Full implementation per §22 and §32A
//
// Called internally from razorpay-webhook on first order payment.captured
// Self-referral block: abort if same phone or same FCM token
// Inserts referral_credits row status=pending
// Credit becomes available when referee order completes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const REFERRAL_CREDIT_PAISA = 50000; // Rs 500

export interface ApplyReferralCreditInput {
  user_id: string;       // The user who just paid (referee)
  order_id: string;      // The order that was paid
}

export interface ApplyReferralCreditOutput {
  ok: boolean;
  credited: boolean;
  error?: string;
  message?: string;
}

/**
 * apply-referral-credit
 *
 * Called on payment.captured for first order.
 * Self-referral block: abort if same phone or same FCM token.
 * Inserts referral_credits rows for both referrer and referee.
 */
export async function applyReferralCredit(
  input: ApplyReferralCreditInput
): Promise<ApplyReferralCreditOutput> {
  const supabase = getSupabaseAdmin();
  const { user_id, order_id } = input;

  try {
    // Get the user (referee) with their referral info
    const { data: referee, error: refereeError } = await supabase
      .from('users')
      .select('id, phone, fcm_token, referral_code_used')
      .eq('id', user_id)
      .single();

    if (refereeError || !referee) {
      return { ok: true, credited: false, message: 'User not found' };
    }

    // Check if user used a referral code
    if (!referee.referral_code_used) {
      return { ok: true, credited: false, message: 'No referral code used' };
    }

    // Check if this is the user's first paid order
    const { count: orderCount } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('status', 'paid')
      .neq('id', order_id);

    // If they have other paid orders, this isn't their first
    if (orderCount !== null && orderCount > 0) {
      return { ok: true, credited: false, message: 'Not first order' };
    }

    // Check if already credited for this referral
    const { data: existingCredit } = await supabase
      .from('referral_credits')
      .select('id')
      .eq('referee_user_id', user_id)
      .eq('type', 'earned')
      .single();

    if (existingCredit) {
      return { ok: true, credited: false, message: 'Already credited' };
    }

    // Find the referrer by their referral code
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id, phone, fcm_token')
      .eq('referral_code', referee.referral_code_used)
      .single();

    if (referrerError || !referrer) {
      return { ok: true, credited: false, message: 'Referrer not found' };
    }

    // Self-referral block: same phone
    if (referee.phone && referrer.phone && referee.phone === referrer.phone) {
      // Log fraud attempt
      await supabase.from('fraud_review_queue').insert({
        user_id: user_id,
        type: 'self_referral',
        detail: {
          reason: 'Same phone number',
          referee_phone: referee.phone,
          referrer_id: referrer.id,
          order_id: order_id,
        },
        status: 'pending',
      });

      return { ok: true, credited: false, message: 'Self-referral detected (same phone)' };
    }

    // Self-referral block: same FCM token
    if (
      referee.fcm_token &&
      referrer.fcm_token &&
      referee.fcm_token === referrer.fcm_token
    ) {
      // Log fraud attempt
      await supabase.from('fraud_review_queue').insert({
        user_id: user_id,
        type: 'self_referral',
        detail: {
          reason: 'Same FCM token',
          referrer_id: referrer.id,
          order_id: order_id,
        },
        status: 'pending',
      });

      return { ok: true, credited: false, message: 'Self-referral detected (same device)' };
    }

    // Calculate expiry date (90 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    // Insert referral credit for referrer (status=pending until referee order completes)
    await supabase.from('referral_credits').insert({
      referrer_user_id: referrer.id,
      referee_user_id: user_id,
      credit_paisa: REFERRAL_CREDIT_PAISA,
      type: 'earned',
      status: 'pending', // Becomes 'available' when referee order completes
      expires_at: expiresAt.toISOString(),
    });

    // Insert referral credit for referee (immediately available)
    await supabase.from('referral_credits').insert({
      referrer_user_id: referrer.id,
      referee_user_id: user_id,
      credit_paisa: REFERRAL_CREDIT_PAISA,
      type: 'earned',
      status: 'available', // Immediately available for referee
      available_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    // Update referral record status
    await supabase
      .from('referrals')
      .update({
        status: 'credited',
        credited_at: new Date().toISOString(),
      })
      .eq('referrer_user_id', referrer.id)
      .eq('referee_user_id', user_id)
      .eq('status', 'pending');

    // Update referee's credit balance
    await supabase.rpc('increment_referral_balance', {
      p_user_id: user_id,
      p_amount: REFERRAL_CREDIT_PAISA,
    }).catch(() => {
      // Fallback: direct update if RPC doesn't exist
      return supabase
        .from('users')
        .update({
          referral_credit_balance_paisa: referee.referral_credit_balance_paisa ?
            referee.referral_credit_balance_paisa + REFERRAL_CREDIT_PAISA :
            REFERRAL_CREDIT_PAISA,
        })
        .eq('id', user_id);
    });

    // Send push notifications
    // Note: Would call send-notification here

    return {
      ok: true,
      credited: true,
      message: `Referral credit of Rs ${REFERRAL_CREDIT_PAISA / 100} applied`,
    };
  } catch (error) {
    console.error('apply-referral-credit error:', error);
    return { ok: false, credited: false, error: error.message };
  }
}

// HTTP endpoint for direct/internal invocation
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Require service role key for internal calls
  const authResult = verifyCron(req);
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal function - requires service role key' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  try {
    const body = await req.json();
    const result = await applyReferralCredit(body);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.ok ? 200 : 500,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
