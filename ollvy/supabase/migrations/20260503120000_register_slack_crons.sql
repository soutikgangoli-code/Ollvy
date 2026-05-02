-- =============================================================================
-- Migration: Register Slack notification crons via pg_cron + pg_net
-- =============================================================================
-- Registers 3 scheduled jobs:
--   * drain_slack_queue       - * * * * *      drain-slack-notifications-queue
--   * daily_summary_midday    - 30 6 * * *     daily-summary-pulse?type=midday
--   * daily_summary_eod       - 30 17 * * *    daily-summary-pulse?type=eod
--
-- All times in UTC. 06:30 UTC = 12:00 PM IST. 17:30 UTC = 11:00 PM IST.
--
-- The existing customer drain cron (drain-customer-notifications-queue, every
-- 2 minutes) was registered manually via the Supabase Dashboard and is NOT
-- touched by this migration.
--
-- =============================================================================
-- PREREQUISITE - run this ONCE in Supabase SQL Editor before applying:
--
--   select vault.create_secret(
--     '<paste service role key here>',
--     'service_role_key',
--     'Used by pg_cron jobs to authenticate edge function invocations'
--   );
--
-- The crons below read this secret via vault.decrypted_secrets. If the secret
-- is missing when the cron fires, the Authorization header will be "Bearer "
-- and the edge function returns 401 (visible in function logs). No data loss,
-- just a noisy failure until the secret is added.
-- =============================================================================

-- Extensions. Idempotent.
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Idempotent register: if a job with the same name exists, drop it first.
-- Wrapped in a single DO block so all three swaps are atomic from the
-- migration's perspective.
do $$
declare
  v_project_url constant text := 'https://wsuleaypyjazcmmntcru.supabase.co';
  v_auth_sql constant text := $auth$
    'Bearer ' || (
      select decrypted_secret
      from vault.decrypted_secrets
      where name = 'service_role_key'
    )
  $auth$;
begin
  -- 1. drain_slack_queue (every minute)
  if exists (select 1 from cron.job where jobname = 'drain_slack_queue') then
    perform cron.unschedule('drain_slack_queue');
  end if;

  perform cron.schedule(
    'drain_slack_queue',
    '* * * * *',
    format(
      $cmd$
      select net.http_post(
        url := %L,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', %s
        ),
        body := '{}'::jsonb
      ) as request_id;
      $cmd$,
      v_project_url || '/functions/v1/drain-slack-notifications-queue',
      v_auth_sql
    )
  );

  -- 2. daily_summary_midday (06:30 UTC = 12:00 PM IST)
  if exists (select 1 from cron.job where jobname = 'daily_summary_midday') then
    perform cron.unschedule('daily_summary_midday');
  end if;

  perform cron.schedule(
    'daily_summary_midday',
    '30 6 * * *',
    format(
      $cmd$
      select net.http_post(
        url := %L,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', %s
        ),
        body := '{}'::jsonb
      ) as request_id;
      $cmd$,
      v_project_url || '/functions/v1/daily-summary-pulse?type=midday',
      v_auth_sql
    )
  );

  -- 3. daily_summary_eod (17:30 UTC = 11:00 PM IST)
  if exists (select 1 from cron.job where jobname = 'daily_summary_eod') then
    perform cron.unschedule('daily_summary_eod');
  end if;

  perform cron.schedule(
    'daily_summary_eod',
    '30 17 * * *',
    format(
      $cmd$
      select net.http_post(
        url := %L,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', %s
        ),
        body := '{}'::jsonb
      ) as request_id;
      $cmd$,
      v_project_url || '/functions/v1/daily-summary-pulse?type=eod',
      v_auth_sql
    )
  );
end $$;
