// redeem-referral-credit
// Full implementation per §22 and §32A
//
// Called internally from create-razorpay-order
// Applies up to min(balance, order_total) as discount
// Combined referral + promo cannot reduce order below govt_fees + GST floor

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

export interface RedeemReferralCreditInput {
  user_id: string;
  order_id: string;
  order_base_paisa: number;       // Base price before any discounts
  promo_discount_paisa: number;   // Already applied promo discount
  govt_fees_paisa: number;        // Government fees (cannot be discounted)
  gst_paisa: number;              // GST amount
}

export interface RedeemReferralCreditOutput {
  ok: boolean;
  credit_applied_paisa: number;
  error?: string;
}

/**
 * redeem-referral-credit
 *
 * Called from create-razorpay-order. Applies credit as discount.
 * Cannot reduce order below govt_fees + GST floor.
 */
export async function redeemReferralCredit(
  input: RedeemReferralCreditInput
): Promise<RedeemReferralCreditOutput> {
  const supabase = getSupabaseAdmin();
  const {
    user_id,
    order_id,
    order_base_paisa,
    promo_discount_paisa,
    govt_fees_paisa,
    gst_paisa,
  } = input;

  try {
    // Get user's available referral credit balance
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('referral_credit_balance_paisa')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return { ok: true, credit_applied_paisa: 0 };
    }

    const availableCredit = user.referral_credit_balance_paisa || 0;

    if (availableCredit <= 0) {
      return { ok: true, credit_applied_paisa: 0 };
    }

    // Calculate how much can be applied
    // Base price after promo discount
    const priceAfterPromo = order_base_paisa - promo_discount_paisa;

    // Floor: cannot discount below govt fees + GST
    const floorAmount = govt_fees_paisa + gst_paisa;

    // Maximum credit that can be applied (cannot go below floor)
    const maxCreditApplicable = Math.max(0, priceAfterPromo - floorAmount);

    // Apply up to min(available, applicable)
    const creditToApply = Math.min(availableCredit, maxCreditApplicable);

    if (creditToApply <= 0) {
      return { ok: true, credit_applied_paisa: 0 };
    }

    // Find available credit records to mark as redeemed (FIFO)
    const { data: credits, error: creditsError } = await supabase
      .from('referral_credits')
      .select('id, credit_paisa')
      .or(`referee_user_id.eq.${user_id},referrer_user_id.eq.${user_id}`)
      .eq('status', 'available')
      .order('created_at', { ascending: true });

    if (creditsError || !credits) {
      return { ok: true, credit_applied_paisa: 0 };
    }

    // Mark credits as redeemed until we reach the amount
    let remaining = creditToApply;
    const creditsToUpdate: string[] = [];

    for (const credit of credits) {
      if (remaining <= 0) break;

      if (credit.credit_paisa <= remaining) {
        // Use full credit
        creditsToUpdate.push(credit.id);
        remaining -= credit.credit_paisa;
      } else {
        // Partial credit - split the record
        // For simplicity, we'll just mark the whole record and
        // create a new record with the remainder
        creditsToUpdate.push(credit.id);

        // Create new credit record with remainder
        await supabase.from('referral_credits').insert({
          referrer_user_id: user_id,
          referee_user_id: null,
          credit_paisa: credit.credit_paisa - remaining,
          type: 'earned',
          status: 'available',
          available_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        });

        remaining = 0;
      }
    }

    // Update credits as redeemed
    if (creditsToUpdate.length > 0) {
      await supabase
        .from('referral_credits')
        .update({
          status: 'redeemed',
          redeemed_at: new Date().toISOString(),
        })
        .in('id', creditsToUpdate);
    }

    // Insert redemption record
    await supabase.from('referral_credits').insert({
      referrer_user_id: null,
      referee_user_id: user_id,
      credit_paisa: -creditToApply, // Negative for redemption
      type: 'redemption',
      status: 'redeemed',
      redeemed_at: new Date().toISOString(),
    });

    // Update user's credit balance
    const newBalance = availableCredit - creditToApply;
    await supabase
      .from('users')
      .update({ referral_credit_balance_paisa: newBalance })
      .eq('id', user_id);

    // Update order with credit snapshot
    await supabase
      .from('orders')
      .update({ referral_credit_paisa_snapshot: creditToApply })
      .eq('id', order_id);

    return {
      ok: true,
      credit_applied_paisa: creditToApply,
    };
  } catch (error) {
    console.error('redeem-referral-credit error:', error);
    return { ok: false, credit_applied_paisa: 0, error: error.message };
  }
}

// HTTP endpoint for internal invocation
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
    const result = await redeemReferralCredit(body);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.ok ? 200 : 500,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, credit_applied_paisa: 0, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
