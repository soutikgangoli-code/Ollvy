-- =============================================================================
-- Migration: Register drain-customer-notifications-queue cron via pg_cron
-- =============================================================================
-- Mirrors the pattern established by 20260503120000_register_slack_crons.sql.
--
-- This cron was originally meant to be registered via Supabase Dashboard at
-- the time of the email sprint, but never actually was. So debounced
-- "admin update" customer emails have not been sending since that ship.
-- This migration backfills the registration.
--
-- Schedule: every 2 minutes. Edge function uses verifyCron + has been
-- redeployed with --no-verify-jwt (same gateway-vs-env-key situation as
-- the slack drain), so the auth path is: cron pulls 'service_role_key'
-- from vault -> sends as Bearer -> function verifyCron compares against
-- env SUPABASE_SERVICE_ROLE_KEY (auto-injected sb_secret_* by Supabase).
-- =============================================================================
-- PREREQUISITE - already satisfied as of the slack cron sprint:
--   * pg_cron + pg_net extensions enabled (idempotent below).
--   * vault.secrets contains 'service_role_key' with the sb_secret_* value.
-- =============================================================================

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

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
  if exists (select 1 from cron.job where jobname = 'drain_customer_notifications_queue') then
    perform cron.unschedule('drain_customer_notifications_queue');
  end if;

  perform cron.schedule(
    'drain_customer_notifications_queue',
    '*/2 * * * *',
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
      v_project_url || '/functions/v1/drain-customer-notifications-queue',
      v_auth_sql
    )
  );
end $$;
