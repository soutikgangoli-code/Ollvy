// resolve-promo
// Full implementation per §22
//
// All 6 validation checks in exact order:
// 1. code exists and is_active=true
// 2. expires_at IS NULL OR expires_at > now()
// 3. applicable_to = 'all' OR service_package_id IN promo_codes.service_package_ids[]
// 4. min_order_paisa IS NULL OR base_price_paisa >= min_order_paisa
// 5. per_user_limit: count of orders WHERE user_id=user_id AND promo_code_used=code < per_user_limit
// 6. max_total_uses IS NULL OR total uses across all orders < max_total_uses
//
// Returns { valid: true, discount_paisa, description, code } or { valid: false, reason }
// Promo abuse detection: 3+ distinct codes applied in 24h → log to fraud_review_queue + admin email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { verifyUser } from '../_shared/auth.ts';
import { sendEmail } from '../_shared/email.ts';

export interface ResolvePromoInput {
  code: string;
  service_package_id: string;
  user_id: string;
  base_price_paisa: number;
}

export interface ResolvePromoOutput {
  valid: boolean;
  discount_paisa?: number;
  description?: string;
  code?: string;
  reason?: 'NOT_FOUND' | 'EXPIRED' | 'WRONG_SERVICE' | 'MIN_ORDER' | 'USER_LIMIT' | 'TOTAL_EXHAUSTED' | 'INACTIVE';
}

// Track promo code applications per user in last 24h for fraud detection
async function checkPromoAbuse(
  supabase: any,
  userId: string,
  code: string
): Promise<boolean> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Check how many distinct promo codes this user has applied in last 24h
  const { data: recentPromos } = await supabase
    .from('orders')
    .select('promo_code_used')
    .eq('user_id', userId)
    .not('promo_code_used', 'is', null)
    .gte('created_at', twentyFourHoursAgo);

  if (!recentPromos) return false;

  // Get distinct codes including the current one
  const distinctCodes = new Set<string>(
    recentPromos.map((o: any) => o.promo_code_used)
  );
  distinctCodes.add(code);

  // If 3+ distinct codes in 24h, flag for fraud
  return distinctCodes.size >= 3;
}

// Log fraud alert and send admin email
async function logPromoAbuse(
  supabase: any,
  userId: string,
  code: string
): Promise<void> {
  try {
    // Insert into fraud_review_queue
    await supabase
      .from('fraud_review_queue')
      .insert({
        user_id: userId,
        type: 'promo_abuse',
        detail: {
          promo_code: code,
          timestamp: new Date().toISOString(),
          description: '3+ distinct promo codes applied in 24h window',
        },
        status: 'pending',
      });

    // Get admin email recipients
    const { data: settings } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'admin_email_recipients')
      .single();

    if (settings?.value) {
      const recipients = typeof settings.value === 'string'
        ? JSON.parse(settings.value)
        : settings.value;

      const result = await sendEmail({
        to: recipients,
        subject: '[Ops] Promo abuse alert',
        text: `A user (ID: ${userId}) has applied 3+ distinct promo codes in a 24-hour window. Latest code: ${code}. Please review in the admin panel.`,
      });
      if (!result.success) {
        console.error(JSON.stringify({
          event: 'promo_abuse_email_failed',
          userId,
          code,
          error: result.error,
        }));
      }
    }
  } catch (error) {
    console.error('Failed to log promo abuse:', error);
  }
}

/**
 * resolve-promo
 *
 * Validates promo code and returns discount amount
 */
export async function resolvePromo(
  input: ResolvePromoInput
): Promise<ResolvePromoOutput> {
  const supabase = getSupabaseAdmin();
  const { code, service_package_id, user_id, base_price_paisa } = input;

  try {
    // Validation 1: code exists and is_active=true
    const { data: promo, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (promoError || !promo) {
      return { valid: false, reason: 'NOT_FOUND' };
    }

    if (!promo.is_active) {
      return { valid: false, reason: 'INACTIVE' };
    }

    // Validation 2: expires_at IS NULL OR expires_at > now()
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return { valid: false, reason: 'EXPIRED' };
    }

    // Also check valid_from
    if (promo.valid_from && new Date(promo.valid_from) > new Date()) {
      return { valid: false, reason: 'EXPIRED' }; // Not yet valid
    }

    // Validation 3: applicable_to = 'all' OR service_package_id IN service_package_ids[]
    if (promo.applicable_to !== 'all' && promo.service_package_ids) {
      const serviceIds = Array.isArray(promo.service_package_ids)
        ? promo.service_package_ids
        : [];

      if (serviceIds.length > 0 && !serviceIds.includes(service_package_id)) {
        return { valid: false, reason: 'WRONG_SERVICE' };
      }
    }

    // Validation 4: min_order_paisa IS NULL OR base_price_paisa >= min_order_paisa
    if (promo.min_order_paisa && base_price_paisa < promo.min_order_paisa) {
      return { valid: false, reason: 'MIN_ORDER' };
    }

    // Validation 5: per_user_limit check
    if (promo.per_user_limit) {
      const { count: userUsageCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .eq('promo_code_used', code.toUpperCase());

      if (userUsageCount !== null && userUsageCount >= promo.per_user_limit) {
        return { valid: false, reason: 'USER_LIMIT' };
      }
    }

    // Validation 6: max_total_uses check
    if (promo.max_uses) {
      const { count: totalUsageCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('promo_code_used', code.toUpperCase());

      if (totalUsageCount !== null && totalUsageCount >= promo.max_uses) {
        return { valid: false, reason: 'TOTAL_EXHAUSTED' };
      }
    }

    // Check for promo abuse (3+ codes in 24h)
    const isAbuse = await checkPromoAbuse(supabase, user_id, code);
    if (isAbuse) {
      await logPromoAbuse(supabase, user_id, code);
      // Still allow the promo but log the abuse
    }

    // Calculate discount
    let discount_paisa = 0;
    let description = '';

    if (promo.discount_type === 'percent') {
      discount_paisa = Math.round(base_price_paisa * (promo.discount_value / 100));
      description = `${promo.discount_value}% off`;
    } else if (promo.discount_type === 'flat_paisa') {
      discount_paisa = Math.min(promo.discount_value, base_price_paisa);
      description = `Rs ${(promo.discount_value / 100).toFixed(0)} off`;
    }

    // Cap discount at base price (can't go negative)
    discount_paisa = Math.min(discount_paisa, base_price_paisa);

    return {
      valid: true,
      discount_paisa,
      description,
      code: code.toUpperCase(),
    };
  } catch (error) {
    console.error('resolve-promo error:', error);
    return { valid: false, reason: 'NOT_FOUND' };
  }
}

// HTTP endpoint for direct invocation
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and extract user_id — never trust user_id from request body
    const auth = await verifyUser(req);
    if (!auth.success || !auth.userId) {
      return new Response(
        JSON.stringify({ valid: false, reason: 'NOT_FOUND', error: auth.error || 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: auth.status || 401,
        }
      );
    }

    const body = await req.json();

    // Validate required fields (user_id comes from JWT, not body)
    if (!body.code || !body.service_package_id || body.base_price_paisa === undefined) {
      return new Response(
        JSON.stringify({
          valid: false,
          reason: 'NOT_FOUND',
          error: 'Missing required fields: code, service_package_id, base_price_paisa',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const result = await resolvePromo({
      ...body,
      user_id: auth.userId, // Override any user_id from request body
    });

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, reason: 'NOT_FOUND', error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
