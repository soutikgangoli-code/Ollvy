// get-engagement-letter-url
// Full implementation per §22
//
// Spec:
// - Input: order_id
// - RLS check: order.user_id must match JWT user_id
// - Returns 60-minute signed URL for the PDF stored at /engagement-letters/{order_id}.pdf
// - Returns 404 if no engagement letter exists

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

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

    // Parse order_id from query params or body
    let orderId: string | null = null;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      orderId = url.searchParams.get('order_id');
    } else if (req.method === 'POST') {
      const body = await req.json();
      orderId = body.order_id;
    }

    if (!orderId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'order_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Fetch order and verify ownership
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id')
      .eq('id', orderId)
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

    // RLS check: user must own the order
    if (order.user_id !== userId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Access denied' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    // Fetch engagement letter
    const { data: letter, error: letterError } = await supabase
      .from('engagement_letters')
      .select('id, pdf_url, service_name, generated_at')
      .eq('order_id', orderId)
      .single();

    if (letterError || !letter) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Engagement letter not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // If PDF exists, generate signed URL
    if (letter.pdf_url) {
      const { data: signedUrl, error: signError } = await supabase
        .storage
        .from('engagement-letters')
        .createSignedUrl(letter.pdf_url, 3600); // 60 minutes

      if (signError) {
        console.error('Failed to create signed URL:', signError);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to generate download URL' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({
          ok: true,
          url: signedUrl.signedUrl,
          service_name: letter.service_name,
          expires_in: 3600,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // PDF not yet generated - return engagement letter data for client-side display
    // or indicate that PDF generation is pending
    return new Response(
      JSON.stringify({
        ok: true,
        pdf_pending: true,
        message: 'Engagement letter PDF is being generated. Please try again in a few moments.',
        engagement_letter_id: letter.id,
        service_name: letter.service_name,
        generated_at: letter.generated_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Get engagement letter URL error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
