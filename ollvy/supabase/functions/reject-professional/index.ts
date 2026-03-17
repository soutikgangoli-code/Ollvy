// reject-professional
// Full implementation per spec §22
//
// Set status=rejected with reason. Push to professional.
// Reason codes: insufficient_certs | incomplete_profile | location_not_served | duplicate_account | other
// Sets reapply_after_date = now() + 30 days
// Body: { professional_id: string, reason_code: string, reason_notes?: string }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface RejectInput {
  professional_id: string;
  reason_code: 'insufficient_certs' | 'incomplete_profile' | 'location_not_served' | 'duplicate_account' | 'other';
  reason_notes?: string;
}

const REASON_MESSAGES: Record<string, string> = {
  insufficient_certs: 'Your certifications could not be verified. Please ensure all documents are valid and clearly visible.',
  incomplete_profile: 'Your profile information is incomplete. Please fill in all required fields.',
  location_not_served: 'We are not currently serving your location. We will notify you when we expand to your area.',
  duplicate_account: 'An account already exists with your credentials. Please contact support if you need assistance.',
  other: 'Your application could not be approved at this time.',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT and confirm user is an admin
    const authResult = await verifyAdmin(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 403,
        }
      );
    }

    // Only ops_admin and super_admin can reject
    if (!['ops_admin', 'super_admin'].includes(authResult.role!)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Insufficient permissions' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    const adminId = authResult.adminId!;
    const body: RejectInput = await req.json();
    const { professional_id, reason_code, reason_notes } = body;

    if (!professional_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'professional_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!reason_code) {
      return new Response(
        JSON.stringify({ ok: false, error: 'reason_code is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const validReasonCodes = ['insufficient_certs', 'incomplete_profile', 'location_not_served', 'duplicate_account', 'other'];
    if (!validReasonCodes.includes(reason_code)) {
      return new Response(
        JSON.stringify({ ok: false, error: `Invalid reason_code. Must be one of: ${validReasonCodes.join(', ')}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Get the professional
    const { data: professional, error: fetchError } = await supabase
      .from('professionals')
      .select('id, name, display_name, phone, email, status, reapplication_count')
      .eq('id', professional_id)
      .single();

    if (fetchError || !professional) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Professional not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check current status
    if (professional.status === 'rejected') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Professional is already rejected' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!['pending_review'].includes(professional.status)) {
      return new Response(
        JSON.stringify({ ok: false, error: `Cannot reject professional with status: ${professional.status}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Calculate reapply date (30 days from now)
    const reapplyDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Build rejection reason
    const rejectionReason = reason_notes
      ? `${reason_code}: ${reason_notes}`
      : reason_code;

    // Update professional status
    const { error: updateError } = await supabase
      .from('professionals')
      .update({
        status: 'rejected',
        is_available: false,
        rejection_reason: rejectionReason,
        reapply_after_date: reapplyDate.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', professional_id);

    if (updateError) {
      console.error('Failed to update professional:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to reject professional' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Create notification for the professional
    const notificationMessage = REASON_MESSAGES[reason_code] + (reason_notes ? ` ${reason_notes}` : '');

    await supabase.from('notifications').insert({
      professional_id: professional_id,
      type: 'application_rejected',
      title: 'Application Update',
      body: notificationMessage + ` You may reapply after ${reapplyDate.toLocaleDateString('en-IN')}.`,
      data: {
        reason_code,
        reapply_after: reapplyDate.toISOString(),
      },
    });

    // Send SMS notification
    const msg91AuthKey = Deno.env.get('MSG91_AUTH_KEY');
    const msg91SenderId = Deno.env.get('MSG91_SENDER_ID');
    const msg91TemplateId = Deno.env.get('MSG91_PROFESSIONAL_REJECTED_TEMPLATE_ID');

    if (msg91AuthKey && msg91SenderId && msg91TemplateId && professional.phone) {
      try {
        await fetch('https://api.msg91.com/api/v5/flow/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authkey': msg91AuthKey,
          },
          body: JSON.stringify({
            template_id: msg91TemplateId,
            sender: msg91SenderId,
            mobiles: `91${professional.phone}`,
            VAR1: professional.display_name || professional.name || 'Professional',
            VAR2: reapplyDate.toLocaleDateString('en-IN'),
          }),
        });
      } catch (smsError) {
        console.error('Failed to send rejection SMS:', smsError);
      }
    }

    // Write to admin audit log
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminId,
      action: 'reject_professional',
      target_type: 'professional',
      target_id: professional_id,
      notes: `Rejected professional: ${professional.display_name || professional.name}. Reason: ${rejectionReason}`,
      payload: {
        reason_code,
        reason_notes,
        reapply_after_date: reapplyDate.toISOString(),
      },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        professional_id,
        status: 'rejected',
        reason_code,
        reapply_after_date: reapplyDate.toISOString(),
        message: `Professional ${professional.display_name || professional.name} has been rejected`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('reject-professional error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
