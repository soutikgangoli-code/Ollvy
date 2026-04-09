// create-razorpay-order
// Full implementation per §3 Pricing Rules and §22
// Last updated: 2026-03-19 - Fixed NOT NULL constraints
//
// Spec:
// - Accepts servicePackageId OR quoteRequestId
// - Price snapshot: copy current service prices into order at creation time
// - GST: CGST 9% + SGST 9% if user.state matches OLLVY_GST_STATE, else IGST 18%
// - Apply Pro discount if user.subscription_tier='pro' (5% off base price for one-time orders)
// - Validate promo code via resolve-promo if promo_code provided
// - Combined referral + promo cannot reduce order below govt_fees + GST floor
// - Create Razorpay order via Razorpay Orders API
// - Insert orders row with status=pending_payment
// - Return { razorpay_order_id, amount }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { getEnvironment, getRequiredEnv } from '../_shared/env.ts';

interface CreateOrderBody {
  service_package_id?: string;
  quote_request_id?: string;
  promo_code?: string;
  use_referral_credit?: boolean;
  // Variant and addon selection
  variant_id?: string;
  addon_ids?: string[];
  engagement_agreed?: boolean;
  // UTM attribution
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referral_code?: string;
  landing_page?: string;
}

interface ServicePackage {
  id: string;
  name: string;
  price_base_paisa: number;
  price_govt_fees_paisa: number;
  price_gst_rate: number;
  order_type: string;
  sla_working_days: number;
  workflow_stages: any[];
  addons?: any[];
  variants?: any[];
}

interface User {
  id: string;
  state: string;
  city: string;
  subscription_tier: string;
  referral_credit_balance_paisa: number;
}

interface QuoteRequest {
  id: string;
  service_package_id: string;
  confirmed_price_paisa: number;
  confirmed_govt_fees_paisa: number;
  status: string;
  expires_at: string;
}

// Calculate GST based on user state
function calculateGST(basePaisa: number, userState: string, gstRate: number): {
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  isSameState: boolean;
} {
  const ollvyState = Deno.env.get('OLLVY_GST_STATE') || 'DL';
  const isSameState = userState?.toLowerCase() === ollvyState.toLowerCase();
  const gstAmount = Math.round(basePaisa * (gstRate / 100));

  if (isSameState) {
    const halfGst = Math.round(basePaisa * (gstRate / 200));
    return {
      cgst: halfGst,
      sgst: halfGst,
      igst: 0,
      total: halfGst * 2,
      isSameState: true,
    };
  } else {
    return {
      cgst: 0,
      sgst: 0,
      igst: gstAmount,
      total: gstAmount,
      isSameState: false,
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and extract user_id
    const authResult = await verifyUser(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const userId = authResult.userId!;
    const supabase = getSupabaseAdmin();

    // Parse request body
    const body: CreateOrderBody = await req.json();
    const {
      service_package_id,
      quote_request_id,
      promo_code,
      use_referral_credit,
      variant_id,
      addon_ids,
      engagement_agreed,
    } = body;

    // Validate: must have either service_package_id or quote_request_id
    if (!service_package_id && !quote_request_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Either service_package_id or quote_request_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    let user: User;
    let servicePackage: ServicePackage;
    let basePricePaisa: number;
    let govtFeesPaisa: number;
    let priceSource = 'base';
    let quoteId: string | null = null;

    // Handle quote flow - parallelize user and quote fetch (both only need userId)
    if (quote_request_id) {
      const [userResult, quoteResult] = await Promise.all([
        supabase
          .from('users')
          .select('id, state, city, subscription_tier, referral_credit_balance_paisa')
          .eq('id', userId)
          .single(),
        supabase
          .from('quote_requests')
          .select('id, service_package_id, confirmed_price_paisa, confirmed_govt_fees_paisa, status, expires_at')
          .eq('id', quote_request_id)
          .eq('user_id', userId)
          .single(),
      ]);

      if (userResult.error || !userResult.data) {
        return new Response(
          JSON.stringify({ ok: false, error: 'User not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }
      user = userResult.data;

      const quote = quoteResult.data;
      if (quoteResult.error || !quote) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Quote not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }

      // Check quote status
      if (quote.status !== 'quoted') {
        return new Response(
          JSON.stringify({ ok: false, error: `Quote is ${quote.status}, not ready for payment` }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      // Check expiry
      if (new Date(quote.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Quote has expired' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      // Fetch service package
      const { data: pkg, error: pkgError } = await supabase
        .from('service_packages')
        .select('*')
        .eq('id', quote.service_package_id)
        .single();

      if (pkgError || !pkg) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Service not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }

      servicePackage = pkg;
      basePricePaisa = quote.confirmed_price_paisa;
      govtFeesPaisa = quote.confirmed_govt_fees_paisa || 0;
      priceSource = 'quote';
      quoteId = quote.id;

    } else {
      // Direct service purchase - parallelize user and service queries
      const [userResult, serviceResult] = await Promise.all([
        supabase
          .from('users')
          .select('id, state, city, subscription_tier, referral_credit_balance_paisa')
          .eq('id', userId)
          .single(),
        supabase
          .from('service_packages')
          .select('*')
          .eq('id', service_package_id)
          .single(),
      ]);

      if (userResult.error || !userResult.data) {
        return new Response(
          JSON.stringify({ ok: false, error: 'User not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }
      user = userResult.data;

      if (serviceResult.error || !serviceResult.data) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Service not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }

      const pkg = serviceResult.data;

      if (!pkg.is_active) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Service is not available' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      // Check if service requires quote
      if (pkg.price_varies_by_state) {
        return new Response(
          JSON.stringify({ ok: false, error: 'This service requires a quote. Please request a quote first.' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      servicePackage = pkg;
      basePricePaisa = pkg.price_base_paisa;
      govtFeesPaisa = pkg.price_govt_fees_paisa || 0;

      // Apply variant price adjustments if a variant is selected
      if (variant_id && pkg.variants && Array.isArray(pkg.variants)) {
        const selectedVariant = pkg.variants.find((v: any) => v.id === variant_id);
        if (selectedVariant) {
          basePricePaisa += selectedVariant.priceAdjustment || 0;
          govtFeesPaisa += selectedVariant.govtFeeAdjustment || 0;
        }
      }

      // Add addon prices to the base price (addons are part of the service bundle)
      if (addon_ids && addon_ids.length > 0 && pkg.addons && Array.isArray(pkg.addons)) {
        for (const addonId of addon_ids) {
          const addon = pkg.addons.find((a: any) => a.id === addonId);
          if (addon) {
            basePricePaisa += addon.pricePaisa || 0;
            govtFeesPaisa += addon.govtFeePaisa || 0;
          }
        }
      }
    }

    // Apply Pro discount (5% off base price for one-time orders only)
    let proDiscountPaisa = 0;
    if (user.subscription_tier === 'pro' && servicePackage.order_type === 'one_time') {
      proDiscountPaisa = Math.round(basePricePaisa * 0.05);
    }

    // Calculate adjusted base price after Pro discount
    const adjustedBasePaisa = basePricePaisa - proDiscountPaisa;

    // Calculate GST (on base price after Pro discount)
    // Default to same-state GST when user has no state set
    const ollvyGstState = Deno.env.get('OLLVY_GST_STATE') || 'DL';
    const gst = calculateGST(adjustedBasePaisa, user.state || ollvyGstState, servicePackage.price_gst_rate);

    // Promo discount (applied after Pro discount)
    let promoDiscountPaisa = 0;
    let promoCodeUsed: string | null = null;

    if (promo_code) {
      // Call resolve-promo (internal function - for now, we'll implement inline)
      // In production, this would be a separate edge function call
      const { data: promo, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promo_code.toUpperCase())
        .single();

      if (!promoError && promo && promo.is_active) {
        // Check expiry
        if (promo.valid_until && new Date(promo.valid_until) < new Date()) {
          return new Response(
            JSON.stringify({ ok: false, error: 'PROMO_EXPIRED', message: 'This promo code has expired' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        // Check min order
        if (promo.min_order_paisa && adjustedBasePaisa < promo.min_order_paisa) {
          return new Response(
            JSON.stringify({ ok: false, error: 'PROMO_MIN_ORDER', message: `Minimum order of ${promo.min_order_paisa / 100} required` }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        // Calculate discount
        if (promo.discount_type === 'percent') {
          promoDiscountPaisa = Math.round(adjustedBasePaisa * (promo.discount_value / 100));
        } else {
          promoDiscountPaisa = promo.discount_value;
        }

        promoCodeUsed = promo.code;
      }
    }

    // Referral credit (applied last)
    let referralCreditUsed = 0;
    if (use_referral_credit && user.referral_credit_balance_paisa > 0) {
      // Maximum referral credit = order subtotal - govt_fees - GST (floor)
      const maxReferralCredit = Math.max(0, adjustedBasePaisa - promoDiscountPaisa);
      referralCreditUsed = Math.min(user.referral_credit_balance_paisa, maxReferralCredit);
    }

    // Calculate total
    // Floor: order cannot go below govt_fees + GST
    // SECURITY FIX: Include GST in floor calculation to prevent free services
    const floor = govtFeesPaisa + gst.total;

    // Cap total discounts to ensure base price covers at least the floor
    const maxDiscount = Math.max(0, adjustedBasePaisa);
    const totalDiscounts = promoDiscountPaisa + referralCreditUsed;
    const cappedDiscounts = Math.min(totalDiscounts, maxDiscount);

    // Recalculate if discounts were capped
    let actualPromoDiscount = promoDiscountPaisa;
    let actualReferralCredit = referralCreditUsed;
    if (cappedDiscounts < totalDiscounts) {
      // Promo takes priority, then referral credit
      actualPromoDiscount = Math.min(promoDiscountPaisa, maxDiscount);
      actualReferralCredit = Math.min(referralCreditUsed, maxDiscount - actualPromoDiscount);
    }

    const subtotal = Math.max(adjustedBasePaisa - actualPromoDiscount - actualReferralCredit, 0);
    const totalPaisa = subtotal + govtFeesPaisa + gst.total;

    // Razorpay requires amount in paise (which we already have)
    const razorpayAmountPaise = totalPaisa;

    // Create Razorpay order
    const environment = getEnvironment();
    const isDevelopment = environment === 'development';
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const isTestMode = isDevelopment && (!razorpayKeyId || !razorpayKeySecret);

    let razorpayOrder: { id: string };

    if (isTestMode) {
      // Test mode: generate mock Razorpay order ID
      console.log('Running in test mode - generating mock Razorpay order');
      razorpayOrder = {
        id: `order_test_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };
    } else {
      // Production/staging must always have valid Razorpay credentials.
      const liveKeyId = getRequiredEnv('RAZORPAY_KEY_ID');
      const liveKeySecret = getRequiredEnv('RAZORPAY_KEY_SECRET');
      // Production: Create Razorpay order via API
      const razorpayAuth = btoa(`${liveKeyId}:${liveKeySecret}`);
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${razorpayAuth}`,
        },
        body: JSON.stringify({
          amount: razorpayAmountPaise,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            user_id: userId,
            service_package_id: servicePackage.id,
            quote_request_id: quoteId || '',
          },
        }),
      });

      if (!razorpayResponse.ok) {
        const razorpayError = await razorpayResponse.text();
        console.error('Razorpay error:', razorpayError);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to create payment order' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      razorpayOrder = await razorpayResponse.json();
    }

    // Create order in database with snapshots
    // Order starts as pending_payment until webhook confirms payment.captured
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        service_package_id: servicePackage.id,
        order_type: servicePackage.order_type,
        status: 'pending_payment',
        city: user.city || null,
        price_base_paisa_snapshot: basePricePaisa,
        price_govt_fees_paisa_snapshot: govtFeesPaisa,
        price_gst_paisa_snapshot: gst.total,
        pro_discount_paisa_snapshot: proDiscountPaisa,
        promo_discount_paisa_snapshot: actualPromoDiscount,
        total_paisa_snapshot: totalPaisa,
        promo_code_used: promoCodeUsed,
        price_source: priceSource,
        razorpay_order_id: razorpayOrder.id,
        referral_credit_used_paisa: actualReferralCredit,
        // variant_id and engagement_agreed_at require migration 20260320000000
        variant_id: variant_id || null,
        engagement_agreed_at: engagement_agreed ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Failed to create order:', orderError);
      return new Response(
        JSON.stringify({ ok: false, error: `Failed to create order: ${orderError.message}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Fire-and-forget: referral credit deduction, addon inserts, and quote
    // status update run after response is returned so they don't add latency
    // before the Razorpay modal opens.
    const postInsertWork = async () => {
      try {
        // Deduct referral credit atomically
        if (actualReferralCredit > 0) {
          const { data: deductResult, error: deductError } = await supabase.rpc(
            'deduct_referral_credit_atomic',
            {
              p_user_id: userId,
              p_requested_amount: actualReferralCredit,
              p_max_applicable: actualReferralCredit,
            }
          );

          if (deductError) {
            console.error('Failed to deduct referral credit:', deductError);
          } else if (deductResult && deductResult[0]) {
            const result = deductResult[0];
            if (!result.success) {
              console.error('Referral credit deduction failed:', result.error_message);
            } else if (result.amount_deducted !== actualReferralCredit) {
              console.warn(
                `Race condition: Expected to deduct ${actualReferralCredit}, actual: ${result.amount_deducted}`
              );
              await supabase
                .from('orders')
                .update({ referral_credit_used_paisa: result.amount_deducted })
                .eq('id', order.id);
            }
          }
        }

        // Insert order addons
        if (addon_ids && addon_ids.length > 0 && servicePackage.addons) {
          const addonsToInsert = addon_ids
            .map((addonId: string) => {
              const addon = (servicePackage.addons as any[])?.find((a: any) => a.id === addonId);
              if (!addon) return null;
              return {
                order_id: order.id,
                addon_id: addonId,
                addon_name: addon.name,
                price_paisa_snapshot: addon.pricePaisa || 0,
                govt_fee_paisa_snapshot: addon.govtFeePaisa || 0,
              };
            })
            .filter(Boolean);

          if (addonsToInsert.length > 0) {
            const { error: addonsError } = await supabase
              .from('order_addons')
              .insert(addonsToInsert);
            if (addonsError) {
              console.error('Failed to insert order addons:', addonsError);
            }
          }
        }

        // Update quote status
        if (quoteId) {
          await supabase
            .from('quote_requests')
            .update({ status: 'accepted', accepted_at: new Date().toISOString() })
            .eq('id', quoteId);
        }
      } catch (err) {
        console.error('Post-insert background work failed:', err);
      }
    };

    // Start background work without awaiting — runs after response is sent
    postInsertWork();

    // Return response immediately
    return new Response(
      JSON.stringify({
        ok: true,
        order_id: order.id,
        order_number: order.order_number, // Include order_number for success modal
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayAmountPaise,
        currency: 'INR',
        key: razorpayKeyId,
        price_breakdown: {
          base: basePricePaisa,
          pro_discount: proDiscountPaisa,
          promo_discount: actualPromoDiscount,
          referral_credit: actualReferralCredit,
          govt_fees: govtFeesPaisa,
          gst: gst.total,
          cgst: gst.cgst,
          sgst: gst.sgst,
          igst: gst.igst,
          total: totalPaisa,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: `Server error: ${error.message}` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
