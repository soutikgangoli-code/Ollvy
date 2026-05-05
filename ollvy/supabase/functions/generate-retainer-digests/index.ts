// generate-retainer-digests
// Full implementation per §22
//
// Cron: 26th of month at 10:15am IST
// Builds PDF proof-of-work digest for each active retainer using @react-pdf/renderer
// Stores PDF at /documents/{retainer_subscription_id}/digests/{YYYY-MM}.pdf
// Upserts retainer_digests row

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

// Import React PDF renderer from esm.sh CDN
import React from 'https://esm.sh/react@18.2.0';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from 'https://esm.sh/@react-pdf/renderer@3.1.14';

interface DigestData {
  retainer_id: string;
  business_name: string;
  service_name: string;
  billing_period: string;
  tasks_completed: number;
  documents_uploaded: number;
  compliance_status: 'on_track' | 'at_risk' | 'overdue';
  key_numbers: Record<string, any>;
  professional_name?: string;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 8,
    color: '#6B7280',
  },
  section: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 11,
    color: '#4B5563',
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  onTrack: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  atRisk: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  overdue: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 20,
  },
});

// PDF Document Component
const DigestDocument = ({ data }: { data: DigestData }) => {
  const statusStyles = {
    on_track: styles.onTrack,
    at_risk: styles.atRisk,
    overdue: styles.overdue,
  };

  const statusLabels = {
    on_track: 'ON TRACK',
    at_risk: 'AT RISK',
    overdue: 'OVERDUE',
  };

  return React.createElement(Document, {},
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.logo }, 'Ollvy'),
        React.createElement(Text, { style: styles.title }, 'Monthly Compliance Digest'),
        React.createElement(Text, { style: styles.subtitle }, data.billing_period)
      ),

      // Business Info Section
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Business Information'),
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Business Name'),
          React.createElement(Text, { style: styles.value }, data.business_name)
        ),
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Service'),
          React.createElement(Text, { style: styles.value }, data.service_name)
        ),
        data.professional_name && React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Assigned Professional'),
          React.createElement(Text, { style: styles.value }, data.professional_name)
        ),
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Compliance Status'),
          React.createElement(Text, { style: { ...styles.statusBadge, ...statusStyles[data.compliance_status] } },
            statusLabels[data.compliance_status]
          )
        )
      ),

      // Monthly Activity Section
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Monthly Activity'),
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Tasks Completed'),
          React.createElement(Text, { style: styles.value }, String(data.tasks_completed))
        ),
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Documents Uploaded'),
          React.createElement(Text, { style: styles.value }, String(data.documents_uploaded))
        )
      ),

      // Key Numbers Section (if any)
      Object.keys(data.key_numbers).length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Key Numbers'),
        ...Object.entries(data.key_numbers).map(([key, value]) =>
          React.createElement(View, { key, style: styles.row },
            React.createElement(Text, { style: styles.label }, key.replace(/_/g, ' ').replace(/paisa$/i, '').trim()),
            React.createElement(Text, { style: styles.value },
              typeof value === 'number' && key.includes('paisa')
                ? `₹${(value / 100).toLocaleString('en-IN')}`
                : String(value)
            )
          )
        )
      ),

      // Footer
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, {}, 'This digest was automatically generated by Ollvy.'),
        React.createElement(Text, { style: { marginTop: 4 } }, 'Questions? Contact support@ollvy.com'),
        React.createElement(Text, { style: { marginTop: 8 } },
          `© ${new Date().getFullYear()} Ollvy Collective Private Limited. All rights reserved.`
        )
      )
    )
  );
};

async function generatePDF(data: DigestData): Promise<Uint8Array> {
  try {
    const doc = React.createElement(DigestDocument, { data });
    const buffer = await renderToBuffer(doc);
    return new Uint8Array(buffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = verifyCron(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: authResult.error }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: authResult.status || 401,
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date();
    const billingPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get all active retainer subscriptions
    const { data: retainers, error: retainersError } = await supabase
      .from('retainer_subscriptions')
      .select(`
        id,
        user_id,
        service_package_id,
        assigned_professional_id,
        users!inner(id, business_name),
        service_packages!inner(id, name),
        professionals(id, name)
      `)
      .eq('status', 'active');

    if (retainersError) {
      throw new Error(`Failed to fetch retainers: ${retainersError.message}`);
    }

    if (!retainers || retainers.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: 'No active retainers to process', generated: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    let generated = 0;
    let failed = 0;

    for (const retainer of retainers) {
      try {
        const user = retainer.users as any;
        const service = retainer.service_packages as any;
        const professional = retainer.professionals as any;

        // Check if digest already exists
        const { data: existingDigest } = await supabase
          .from('retainer_digests')
          .select('id')
          .eq('retainer_subscription_id', retainer.id)
          .eq('billing_period', billingPeriod)
          .single();

        if (existingDigest) continue;

        // Get tasks completed this month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const { count: tasksCompleted } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('retainer_subscription_id', retainer.id)
          .eq('status', 'completed')
          .gte('completed_at', startOfMonth.toISOString())
          .lte('completed_at', endOfMonth.toISOString());

        // Get documents uploaded
        const { count: documentsUploaded } = await supabase
          .from('order_documents')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', retainer.user_id)
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());

        // Check compliance status
        const { count: pendingObligations } = await supabase
          .from('compliance_obligations')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', retainer.user_id)
          .eq('status', 'pending')
          .lte('due_date', now.toISOString());

        let complianceStatus: 'on_track' | 'at_risk' | 'overdue' = 'on_track';
        if (pendingObligations && pendingObligations > 0) {
          complianceStatus = pendingObligations > 2 ? 'overdue' : 'at_risk';
        }

        // Get existing key numbers from digest if professional has updated them
        const { data: existingKeyNumbers } = await supabase
          .from('retainer_digests')
          .select('key_numbers')
          .eq('retainer_subscription_id', retainer.id)
          .eq('billing_period', billingPeriod)
          .single();

        const keyNumbers = existingKeyNumbers?.key_numbers || {
          compliance_score: Math.max(0, 100 - (pendingObligations || 0) * 10),
        };

        // Generate PDF
        const digestData: DigestData = {
          retainer_id: retainer.id,
          business_name: user.business_name || 'Business',
          service_name: service.name,
          billing_period: billingPeriod,
          tasks_completed: tasksCompleted || 0,
          documents_uploaded: documentsUploaded || 0,
          compliance_status: complianceStatus,
          key_numbers: keyNumbers,
          professional_name: professional?.name,
        };

        const pdfBytes = await generatePDF(digestData);
        const pdfPath = `${retainer.id}/digests/${billingPeriod}.pdf`;

        // Upload PDF to storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(pdfPath, pdfBytes, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          console.error(`Failed to upload digest for ${retainer.id}:`, uploadError);
          failed++;
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(pdfPath);

        // Upsert retainer_digests row
        await supabase
          .from('retainer_digests')
          .upsert({
            retainer_subscription_id: retainer.id,
            billing_period: billingPeriod,
            pdf_url: publicUrl,
            pdf_path: pdfPath,
            key_numbers: keyNumbers,
            compliance_status: complianceStatus,
            tasks_completed: tasksCompleted || 0,
            documents_uploaded: documentsUploaded || 0,
            generated_at: now.toISOString(),
          }, {
            onConflict: 'retainer_subscription_id,billing_period',
          });

        // Notify user
        await supabase.from('notifications').insert({
          user_id: retainer.user_id,
          type: 'digest_ready',
          title: 'Monthly digest ready',
          body: `Your ${billingPeriod} compliance digest for ${service.name} is now available.`,
          data: { retainer_id: retainer.id, billing_period: billingPeriod },
          read: false,
        });

        // Send push notification
        const { data: userWithToken } = await supabase
          .from('users')
          .select('fcm_token')
          .eq('id', retainer.user_id)
          .single();

        if (userWithToken?.fcm_token) {
          const fcmKey = Deno.env.get('FCM_SERVER_KEY');
          if (fcmKey) {
            try {
              await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                  'Authorization': `key=${fcmKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to: userWithToken.fcm_token,
                  notification: {
                    title: 'Monthly digest ready',
                    body: `Your ${billingPeriod} compliance digest is ready to view.`,
                  },
                  data: { type: 'digest_ready', retainer_id: retainer.id },
                }),
              });
            } catch (e) {
              console.error('FCM send error:', e);
            }
          }
        }

        generated++;
      } catch (error) {
        console.error(`Error generating digest for retainer ${retainer.id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        generated,
        failed,
        total: retainers.length,
        billing_period: billingPeriod,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('generate-retainer-digests error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
