// get-digest-url
// Full implementation per §22
//
// HTTP GET (auth)
// Returns signed URL for retainer digest PDF
// User can only access their own digests

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
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

    const userId = authResult.userId;
    const url = new URL(req.url);
    const digestId = url.searchParams.get('digest_id');
    const retainerId = url.searchParams.get('retainer_id');
    const billingPeriod = url.searchParams.get('billing_period');

    if (!digestId && (!retainerId || !billingPeriod)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Provide digest_id or retainer_id + billing_period' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    // Find the digest
    let query = supabase
      .from('retainer_digests')
      .select('id, pdf_url, billing_period, retainer_subscription_id, retainer_subscriptions(user_id)');

    if (digestId) {
      query = query.eq('id', digestId);
    } else {
      query = query.eq('retainer_subscription_id', retainerId).eq('billing_period', billingPeriod);
    }

    const { data: digest, error: digestError } = await query.single();

    if (digestError || !digest) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Digest not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Verify user owns this retainer
    const retainerUserId = (digest.retainer_subscriptions as any)?.user_id;
    if (retainerUserId !== userId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Access denied' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    if (!digest.pdf_url) {
      return new Response(
        JSON.stringify({ ok: false, error: 'PDF not yet generated' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Extract path from URL and generate signed URL
    const pdfPath = digest.pdf_url.includes('/documents/')
      ? digest.pdf_url.split('/documents/')[1]
      : digest.pdf_url;

    const { data: signedUrl, error: signError } = await supabase.storage
      .from('documents')
      .createSignedUrl(pdfPath, 3600); // 1 hour expiry

    if (signError) {
      console.error('Sign error:', signError);
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
        expires_in: 3600,
        billing_period: digest.billing_period
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('get-digest-url error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
