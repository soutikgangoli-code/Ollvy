// approve-professional
// Full implementation per spec §22
//
// Set status=approved. Push + welcome email to professional.
// Body: { professional_id: string }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { sendEmail } from '../_shared/email.ts';

interface ApproveInput {
  professional_id: string;
}

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

    // Only ops_admin and super_admin can approve
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
    const body: ApproveInput = await req.json();
    const { professional_id } = body;

    if (!professional_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'professional_id is required' }),
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
      .select('id, name, display_name, phone, email, status, web_push_subscription')
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
    if (professional.status === 'approved') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Professional is already approved' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Note: enum values are 'pending', 'approved', 'rejected', 'suspended'
    if (!['pending', 'pending_review', 'rejected'].includes(professional.status)) {
      return new Response(
        JSON.stringify({ ok: false, error: `Cannot approve professional with status: ${professional.status}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Update professional status
    const { error: updateError } = await supabase
      .from('professionals')
      .update({
        status: 'approved',
        rejection_reason: null,
        reapply_after_date: null,
        updated_at: now.toISOString(),
      })
      .eq('id', professional_id);

    if (updateError) {
      console.error('Failed to update professional:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to approve professional' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Create notification for the professional
    await supabase.from('notifications').insert({
      professional_id: professional_id,
      type: 'application_approved',
      title: 'Welcome to Ollvy!',
      body: 'Your application has been approved. You can now start receiving orders from clients.',
      data: {
        action: 'go_to_dashboard',
      },
    });

    // Send welcome SMS (if MSG91 configured)
    const msg91AuthKey = Deno.env.get('MSG91_AUTH_KEY');
    const msg91SenderId = Deno.env.get('MSG91_SENDER_ID');
    const msg91TemplateId = Deno.env.get('MSG91_PROFESSIONAL_WELCOME_TEMPLATE_ID');

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
          }),
        });
      } catch (smsError) {
        console.error('Failed to send welcome SMS:', smsError);
        // Don't fail the approval if SMS fails
      }
    }

    // Send welcome email
    if (professional.email) {
      const result = await sendEmail({
        to: professional.email,
        subject: 'Welcome to Ollvy - Your Application is Approved!',
        html: `
              <h1>Welcome to Ollvy, ${professional.display_name || professional.name}!</h1>
              <p>Great news! Your application has been reviewed and approved.</p>
              <p>You can now:</p>
              <ul>
                <li>Log in to your dashboard at <a href="https://pro.ollvy.com">pro.ollvy.com</a></li>
                <li>Set your availability and service areas</li>
                <li>Start receiving order assignments</li>
              </ul>
              <p>If you have any questions, our support team is here to help.</p>
              <p>Best regards,<br>The Ollvy Team</p>
            `,
      });
      if (!result.success) {
        console.error(JSON.stringify({
          event: 'professional_welcome_email_failed',
          professional_id,
          error: result.error,
        }));
      }
    }

    // Write to admin audit log
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminId,
      action: 'approve_professional',
      target_type: 'professional',
      target_id: professional_id,
      notes: `Approved professional: ${professional.display_name || professional.name}`,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        professional_id,
        status: 'approved',
        message: `Professional ${professional.display_name || professional.name} has been approved`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('approve-professional error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
