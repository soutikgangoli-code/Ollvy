// check-sla-alerts
// Cron: runs daily at 9am IST
// Finds all in_progress orders where current stage SLA has been breached
// Creates sla_alerts rows and calls apply-strike on first breach
// Sends push to professional and admin notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCron } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';
import { applyStrike } from '../apply-strike/index.ts';

interface BreachedStage {
  order_id: string;
  stage_key: string;
  stage_name: string;
  stage_due_date: string;
  professional_id: string;
  order_number: string;
  service_name: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify service role key for cron jobs
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
    const today = now.toISOString().split('T')[0];

    // Find all in_progress orders where current stage SLA has been breached
    // Current stage = started_at IS NOT NULL AND completed_at IS NULL
    const { data: breachedStages, error: fetchError } = await supabase
      .from('order_stage_history')
      .select(`
        order_id,
        stage_key,
        stage_name,
        stage_due_date,
        orders!inner (
          id,
          order_number,
          status,
          professional_id,
          service_packages (
            name
          )
        )
      `)
      .is('completed_at', null)
      .not('started_at', 'is', null)
      .lte('stage_due_date', today)
      .eq('orders.status', 'in_progress');

    if (fetchError) {
      throw new Error(`Failed to fetch breached stages: ${fetchError.message}`);
    }

    const results = {
      alertsCreated: 0,
      strikesApplied: 0,
      alertsUpdated: 0,
      errors: [] as string[],
    };

    for (const stage of (breachedStages || [])) {
      const order = stage.orders as any;
      if (!order || !order.professional_id) continue;

      const breachData: BreachedStage = {
        order_id: stage.order_id,
        stage_key: stage.stage_key,
        stage_name: stage.stage_name,
        stage_due_date: stage.stage_due_date,
        professional_id: order.professional_id,
        order_number: order.order_number,
        service_name: order.service_packages?.name || 'Unknown Service',
      };

      try {
        // Check if sla_alert already exists for this order and stage
        const { data: existingAlert } = await supabase
          .from('sla_alerts')
          .select('id, professional_strike_applied, alert_count')
          .eq('order_id', breachData.order_id)
          .eq('stage_key', breachData.stage_key)
          .single();

        if (existingAlert) {
          // Update alert count
          await supabase
            .from('sla_alerts')
            .update({
              alert_count: existingAlert.alert_count + 1,
              alerted_at: now.toISOString(),
            })
            .eq('id', existingAlert.id);

          results.alertsUpdated++;

          // Check if T+48h breach for admin email (alert_count >= 2 means 48h passed)
          if (existingAlert.alert_count >= 1 && !existingAlert.professional_strike_applied) {
            // T+48h: admin notification
            await supabase.from('admin_notifications').insert({
              type: 'sla_breach_48h',
              title: 'SLA Breach - 48h+',
              body: `Order ${breachData.order_number} stage "${breachData.stage_name}" has been overdue for 48+ hours.`,
              related_id: breachData.order_id,
              related_type: 'order',
            });
          }
        } else {
          // Create new sla_alert
          const { data: newAlert, error: insertError } = await supabase
            .from('sla_alerts')
            .insert({
              order_id: breachData.order_id,
              stage_key: breachData.stage_key,
              due_date: breachData.stage_due_date,
              alerted_at: now.toISOString(),
              alert_count: 1,
              professional_strike_applied: false,
            })
            .select()
            .single();

          if (insertError) {
            results.errors.push(`Failed to create alert for order ${breachData.order_id}: ${insertError.message}`);
            continue;
          }

          results.alertsCreated++;

          // FIRST BREACH: Apply strike
          const strikeResult = await applyStrike({
            professional_id: breachData.professional_id,
            order_id: breachData.order_id,
            sla_alert_id: newAlert.id,
            reason: `SLA breach on stage "${breachData.stage_name}" for order ${breachData.order_number}`,
          });

          if (strikeResult.ok) {
            // Mark strike as applied
            await supabase
              .from('sla_alerts')
              .update({ professional_strike_applied: true })
              .eq('id', newAlert.id);

            results.strikesApplied++;
          } else {
            results.errors.push(`Failed to apply strike: ${strikeResult.error}`);
          }

          // Send push notification to professional
          await sendProfessionalNotification(supabase, breachData);

          // Create admin notification
          await supabase.from('admin_notifications').insert({
            type: 'sla_breach',
            title: 'SLA Breach',
            body: `Order ${breachData.order_number} - Stage "${breachData.stage_name}" is overdue. Strike applied to professional.`,
            related_id: breachData.order_id,
            related_type: 'order',
          });
        }
      } catch (err) {
        results.errors.push(`Error processing order ${breachData.order_id}: ${(err as Error).message}`);
      }
    }

    // Also check retainer onboarding SLA (5 working days from started_at)
    const fiveWorkingDaysAgo = new Date();
    fiveWorkingDaysAgo.setDate(fiveWorkingDaysAgo.getDate() - 7); // ~5 working days

    const { data: overdueRetainers } = await supabase
      .from('retainer_subscriptions')
      .select(`
        id,
        user_id,
        assigned_professional_id,
        started_at,
        service_packages (
          name
        )
      `)
      .eq('status', 'onboarding')
      .lte('started_at', fiveWorkingDaysAgo.toISOString())
      .not('assigned_professional_id', 'is', null);

    for (const retainer of (overdueRetainers || [])) {
      if (!retainer.assigned_professional_id) continue;

      try {
        // Check if we already have an SLA alert for this retainer onboarding
        // Using a special stage_key for retainer onboarding
        const { data: existingAlert } = await supabase
          .from('sla_alerts')
          .select('id')
          .eq('stage_key', `retainer_onboarding_${retainer.id}`)
          .single();

        if (!existingAlert) {
          // Create alert for retainer onboarding breach
          const { data: newAlert } = await supabase
            .from('sla_alerts')
            .insert({
              order_id: retainer.id, // Using retainer ID as a reference
              stage_key: `retainer_onboarding_${retainer.id}`,
              due_date: fiveWorkingDaysAgo.toISOString().split('T')[0],
              alerted_at: now.toISOString(),
              alert_count: 1,
              professional_strike_applied: false,
            })
            .select()
            .single();

          if (newAlert) {
            results.alertsCreated++;

            // Apply strike for retainer onboarding breach
            const strikeResult = await applyStrike({
              professional_id: retainer.assigned_professional_id,
              order_id: retainer.id,
              sla_alert_id: newAlert.id,
              reason: `Retainer onboarding SLA breach for ${(retainer.service_packages as any)?.name || 'retainer'}`,
            });

            if (strikeResult.ok) {
              await supabase
                .from('sla_alerts')
                .update({ professional_strike_applied: true })
                .eq('id', newAlert.id);

              results.strikesApplied++;
            }

            // Admin notification
            await supabase.from('admin_notifications').insert({
              type: 'retainer_onboarding_sla_breach',
              title: 'Retainer Onboarding SLA Breach',
              body: `Retainer onboarding for ${(retainer.service_packages as any)?.name || 'service'} is overdue. Strike applied.`,
              related_id: retainer.id,
              related_type: 'retainer_subscription',
            });
          }
        }
      } catch (err) {
        results.errors.push(`Error processing retainer ${retainer.id}: ${(err as Error).message}`);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        ...results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('check-sla-alerts error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function sendProfessionalNotification(
  supabase: any,
  breachData: BreachedStage
) {
  // Get professional's notification details
  const { data: professional } = await supabase
    .from('professionals')
    .select('id, name, fcm_token, web_push_subscription')
    .eq('id', breachData.professional_id)
    .single();

  if (!professional) return;

  // Insert notification record
  await supabase.from('notifications').insert({
    professional_id: professional.id,
    type: 'sla_breach',
    title: 'Stage Overdue',
    body: `Stage "${breachData.stage_name}" is overdue on order ${breachData.order_number}. A strike has been applied. If the delay was caused by the client, you can appeal within 24 hours.`,
    data: {
      order_id: breachData.order_id,
      stage_key: breachData.stage_key,
    },
  });

  // TODO: Actually send push notification via FCM or Web Push
  // For now, just log the notification
  console.log(`Push notification queued for professional ${professional.id}`);
}
