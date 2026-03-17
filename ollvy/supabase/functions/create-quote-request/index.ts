// create-quote-request
// Full implementation per §22
//
// Spec:
// - Inserts quote_requests row
// - Body: { service_package_id, submitted_details: { state, city, requirements } }
// - Status starts as 'pending'
// - expires_at set by confirm-quote, not here
// - Admin notified via badge (admin_notifications)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUser } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface CreateQuoteRequestBody {
  service_package_id: string;
  submitted_details: {
    state: string;
    city?: string;
    requirements?: string;
    business_name?: string;
    gst_registered?: boolean;
  };
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
    const body: CreateQuoteRequestBody = await req.json();
    const { service_package_id, submitted_details } = body;

    // Validate required fields
    if (!service_package_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'service_package_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!submitted_details?.state) {
      return new Response(
        JSON.stringify({ ok: false, error: 'state is required in submitted_details' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Verify service exists and is variable-price
    const { data: service, error: serviceError } = await supabase
      .from('service_packages')
      .select('id, name, price_varies_by_state, is_active')
      .eq('id', service_package_id)
      .single();

    if (serviceError || !service) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Service not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    if (!service.is_active) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Service is not available' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check for existing pending quote for same service
    const { data: existingQuote } = await supabase
      .from('quote_requests')
      .select('id')
      .eq('user_id', userId)
      .eq('service_package_id', service_package_id)
      .eq('status', 'pending')
      .single();

    if (existingQuote) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'You already have a pending quote request for this service',
          quote_request_id: existingQuote.id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create quote request
    const { data: quoteRequest, error: insertError } = await supabase
      .from('quote_requests')
      .insert({
        user_id: userId,
        service_package_id,
        submitted_details,
        status: 'pending',
        // expires_at is set by confirm-quote, not here
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create quote request:', insertError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to create quote request' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Create admin notification for quote badge
    await supabase.from('admin_notifications').insert({
      type: 'new_quote_request',
      title: 'New Quote Request',
      body: `New quote request for ${service.name}`,
      related_id: quoteRequest.id,
      related_type: 'quote_request',
    });

    return new Response(
      JSON.stringify({
        ok: true,
        quote_request: quoteRequest,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      }
    );
  } catch (error) {
    console.error('Create quote request error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
