// get-invoice-url
// Full implementation per §22
//
// Spec:
// - Input: invoice_id
// - RLS check: user must own the invoice (invoice.user_id = JWT user_id)
// - Returns 60-minute signed URL for the PDF stored at /invoices/{invoice_id}.pdf

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

    // Parse invoice_id from query params or body
    let invoiceId: string | null = null;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      invoiceId = url.searchParams.get('invoice_id');
    } else if (req.method === 'POST') {
      const body = await req.json();
      invoiceId = body.invoice_id;
    }

    if (!invoiceId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'invoice_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Fetch invoice and verify ownership
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, user_id, pdf_url, invoice_number')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invoice not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // RLS check: user must own the invoice
    if (invoice.user_id !== userId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Access denied' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    // If PDF exists, generate signed URL
    if (invoice.pdf_url) {
      const { data: signedUrl, error: signError } = await supabase
        .storage
        .from('invoices')
        .createSignedUrl(invoice.pdf_url, 3600); // 60 minutes

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
          invoice_number: invoice.invoice_number,
          expires_in: 3600,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // PDF not yet generated - return invoice data for client-side generation
    // or a placeholder message
    return new Response(
      JSON.stringify({
        ok: true,
        pdf_pending: true,
        message: 'Invoice PDF is being generated. Please try again in a few moments.',
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Get invoice URL error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
