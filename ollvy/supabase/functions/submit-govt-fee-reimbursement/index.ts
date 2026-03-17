// submit-govt-fee-reimbursement
// Full implementation per §22
//
// HTTP POST (auth, professional)
// Professional submits govt fee receipt for reimbursement
// Creates pending reimbursement record for admin review

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface RequestBody {
  order_id: string;
  amount_paisa: number;
  receipt_url: string;
  description?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await verifyProfessional(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const professionalId = authResult.professionalId;
    const body: RequestBody = await req.json();

    if (!body.order_id || !body.amount_paisa || !body.receipt_url) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing required fields: order_id, amount_paisa, receipt_url' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (body.amount_paisa <= 0) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid amount' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify professional owns this order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, professional_id, user_id, service_packages(name)')
      .eq('id', body.order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Order not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    if (order.professional_id !== professionalId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'You are not assigned to this order' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    // Create reimbursement request
    const { data: reimbursement, error: insertError } = await supabase
      .from('govt_fee_reimbursements')
      .insert({
        order_id: body.order_id,
        professional_id: professionalId,
        amount_paisa: body.amount_paisa,
        receipt_url: body.receipt_url,
        description: body.description || null,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to submit reimbursement' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Create admin notification
    await supabase.from('admin_notifications').insert({
      type: 'reimbursement_request',
      title: 'New govt fee reimbursement request',
      message: `Reimbursement of ₹${body.amount_paisa / 100} submitted for ${(order.service_packages as any)?.name} order.`,
      data: {
        reimbursement_id: reimbursement.id,
        order_id: body.order_id,
        amount_paisa: body.amount_paisa
      },
      read: false,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        reimbursement_id: reimbursement.id,
        status: 'pending'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('submit-govt-fee-reimbursement error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
