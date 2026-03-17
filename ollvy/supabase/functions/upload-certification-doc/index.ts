// upload-certification-doc
// Full implementation per spec §22
//
// Upload to /certifications bucket. Creates professional_certifications row.
// Admin must verify.
// Body: { cert_type, cert_number?, document_url, issuing_body? }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyProfessional } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface UploadCertRequest {
  cert_type: string;
  cert_number?: string;
  document_url: string;
  issuing_body?: string;
  issued_date?: string;
  expiry_date?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and confirm user is a professional
    const authResult = await verifyProfessional(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 403,
        }
      );
    }

    const professionalId = authResult.professionalId;
    const supabase = getSupabaseAdmin();

    // Parse request body
    const body: UploadCertRequest = await req.json();
    const { cert_type, cert_number, document_url, issuing_body, issued_date, expiry_date } = body;

    // Validate required fields
    if (!cert_type) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Certification type is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!document_url) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Document URL is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate cert_type
    const validCertTypes = [
      'icai_membership',
      'ca_certificate',
      'bar_council',
      'icsi_certificate',
      'ibbi_certificate',
      'business_license',
      'experience_letter',
      'qualification_cert',
      'other',
    ];

    if (!validCertTypes.includes(cert_type)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid certification type' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check if certification of this type already exists
    const { data: existingCert } = await supabase
      .from('professional_certifications')
      .select('id')
      .eq('professional_id', professionalId)
      .eq('cert_type', cert_type)
      .single();

    if (existingCert) {
      // Update existing certification
      const { data: updatedCert, error: updateError } = await supabase
        .from('professional_certifications')
        .update({
          cert_number: cert_number || null,
          document_url,
          issuing_body: issuing_body || null,
          issued_date: issued_date || null,
          expiry_date: expiry_date || null,
          status: 'pending', // Reset to pending for re-verification
          rejection_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCert.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating certification:', updateError);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to update certification' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({
          ok: true,
          certification: updatedCert,
          action: 'updated',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      // Create new certification
      const { data: newCert, error: insertError } = await supabase
        .from('professional_certifications')
        .insert({
          professional_id: professionalId,
          cert_type,
          cert_number: cert_number || null,
          document_url,
          issuing_body: issuing_body || null,
          issued_date: issued_date || null,
          expiry_date: expiry_date || null,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating certification:', insertError);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to create certification' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      // Create admin notification about new certification
      await supabase
        .from('admin_notifications')
        .insert({
          type: 'new_certification',
          title: 'New certification uploaded',
          body: `Professional ${professionalId} uploaded a ${cert_type} certification for review.`,
          related_id: professionalId,
          related_type: 'professional',
        });

      return new Response(
        JSON.stringify({
          ok: true,
          certification: newCert,
          action: 'created',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error('upload-certification-doc error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
