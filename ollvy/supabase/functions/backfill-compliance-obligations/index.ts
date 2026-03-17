// backfill-compliance-obligations
// Full implementation per spec §22
//
// Run after rules changes to update existing users
// For each user with profile_completeness_score >= 60:
//   - Check existing obligations
//   - Add new obligations from rules that didn't exist before
//   - Never remove existing obligations (FREEZE RULE from spec)
// Body: { dry_run?: boolean }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAdmin } from '../_shared/auth.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

interface BackfillInput {
  dry_run?: boolean;
}

interface ComplianceRule {
  id: string;
  label: string;
  applies_to_business_types: string[] | null;
  applies_to_states: string[] | null;
  requires_gst_registered: boolean | null;
  requires_has_employees: boolean | null;
  linked_service_package_id: string | null;
  recurrence: string;
  due_date_formula: string;
  advance_reminder_days: number[];
  is_active: boolean;
}

interface User {
  id: string;
  state: string | null;
  business_type: string | null;
  gst_registered: boolean | null;
  has_employees: boolean | null;
  profile_completeness_score: number;
}

function calculateDueDate(formula: string, user: User): Date | null {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Parse common formula patterns
  if (formula.includes('20th of following month')) {
    const nextMonth = new Date(currentYear, currentMonth + 1, 20);
    return nextMonth;
  }
  if (formula.includes('11th of following month')) {
    const nextMonth = new Date(currentYear, currentMonth + 1, 11);
    return nextMonth;
  }
  if (formula.includes('31 December')) {
    return new Date(currentYear, 11, 31);
  }
  if (formula.includes('31 July')) {
    const july31 = new Date(currentYear, 6, 31);
    return july31 < now ? new Date(currentYear + 1, 6, 31) : july31;
  }
  if (formula.includes('31 October')) {
    const oct31 = new Date(currentYear, 9, 31);
    return oct31 < now ? new Date(currentYear + 1, 9, 31) : oct31;
  }
  if (formula.includes('30 September')) {
    const sep30 = new Date(currentYear, 8, 30);
    return sep30 < now ? new Date(currentYear + 1, 8, 30) : sep30;
  }
  if (formula.includes('quarter-end')) {
    // Next quarter end + 13 days
    const quarterEnds = [
      new Date(currentYear, 3, 13), // Apr
      new Date(currentYear, 6, 13), // Jul
      new Date(currentYear, 9, 13), // Oct
      new Date(currentYear + 1, 0, 13), // Jan next year
    ];
    return quarterEnds.find(d => d > now) || quarterEnds[0];
  }

  // Default: 30 days from now
  return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
}

function ruleAppliesTo(rule: ComplianceRule, user: User): boolean {
  // Check business type
  if (rule.applies_to_business_types && rule.applies_to_business_types.length > 0) {
    if (!user.business_type || !rule.applies_to_business_types.includes(user.business_type)) {
      return false;
    }
  }

  // Check state
  if (rule.applies_to_states && rule.applies_to_states.length > 0) {
    if (!user.state || !rule.applies_to_states.includes(user.state)) {
      return false;
    }
  }

  // Check GST registered
  if (rule.requires_gst_registered !== null) {
    if (user.gst_registered !== rule.requires_gst_registered) {
      return false;
    }
  }

  // Check has employees
  if (rule.requires_has_employees !== null) {
    if (user.has_employees !== rule.requires_has_employees) {
      return false;
    }
  }

  return true;
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

    // Only super_admin can run backfill
    if (authResult.role !== 'super_admin') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Only super_admin can run backfill' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    const adminId = authResult.adminId!;
    const body: BackfillInput = await req.json().catch(() => ({}));
    const dryRun = body.dry_run === true;

    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Get all active compliance rules
    const { data: rules, error: rulesError } = await supabase
      .from('compliance_obligation_rules')
      .select('*')
      .eq('is_active', true);

    if (rulesError) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to fetch compliance rules' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    if (!rules || rules.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: 'No active compliance rules found', users_processed: 0, obligations_added: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Get all users with profile_completeness_score >= 60
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, state, business_type, gst_registered, has_employees, profile_completeness_score')
      .gte('profile_completeness_score', 60);

    if (usersError) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to fetch users' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: 'No eligible users found', users_processed: 0, obligations_added: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    let usersProcessed = 0;
    let obligationsAdded = 0;
    const addedObligations: Array<{ user_id: string; rule_label: string }> = [];

    for (const user of users) {
      // Get existing obligations for this user
      const { data: existingObligations } = await supabase
        .from('compliance_obligations')
        .select('rule_id')
        .eq('user_id', user.id);

      const existingRuleIds = new Set(existingObligations?.map(o => o.rule_id) || []);

      // Find rules that apply to this user but aren't seeded yet
      const newObligations: Array<{
        user_id: string;
        rule_id: string;
        label: string;
        linked_service_package_id: string | null;
        due_date: string;
        status: string;
        recurrence: string;
      }> = [];

      for (const rule of rules as ComplianceRule[]) {
        // Skip if already exists
        if (existingRuleIds.has(rule.id)) {
          continue;
        }

        // Check if rule applies to this user
        if (!ruleAppliesTo(rule, user)) {
          continue;
        }

        // Calculate due date
        const dueDate = calculateDueDate(rule.due_date_formula, user);
        if (!dueDate) continue;

        // Determine status based on due date
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let status = 'upcoming';
        if (daysUntilDue <= 0) {
          status = 'overdue';
        } else if (daysUntilDue <= 7) {
          status = 'due_soon';
        }

        newObligations.push({
          user_id: user.id,
          rule_id: rule.id,
          label: rule.label,
          linked_service_package_id: rule.linked_service_package_id,
          due_date: dueDate.toISOString(),
          status,
          recurrence: rule.recurrence,
        });

        addedObligations.push({
          user_id: user.id,
          rule_label: rule.label,
        });
      }

      if (newObligations.length > 0) {
        if (!dryRun) {
          const { error: insertError } = await supabase
            .from('compliance_obligations')
            .insert(newObligations);

          if (insertError) {
            console.error(`Failed to insert obligations for user ${user.id}:`, insertError);
          } else {
            obligationsAdded += newObligations.length;
          }
        } else {
          obligationsAdded += newObligations.length;
        }
      }

      usersProcessed++;
    }

    // Write to admin audit log
    if (!dryRun) {
      await supabase.from('admin_audit_log').insert({
        admin_user_id: adminId,
        action: 'backfill_compliance',
        target_type: 'system',
        target_id: 'compliance_obligations',
        notes: `Backfilled ${obligationsAdded} compliance obligations for ${usersProcessed} users`,
        payload: {
          users_processed: usersProcessed,
          obligations_added: obligationsAdded,
          rules_count: rules.length,
        },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        dry_run: dryRun,
        users_processed: usersProcessed,
        obligations_added: obligationsAdded,
        rules_checked: rules.length,
        details: dryRun ? addedObligations.slice(0, 100) : undefined, // Show first 100 in dry run
        message: dryRun
          ? `Dry run complete. Would add ${obligationsAdded} obligations for ${usersProcessed} users.`
          : `Backfill complete. Added ${obligationsAdded} obligations for ${usersProcessed} users.`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('backfill-compliance-obligations error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
