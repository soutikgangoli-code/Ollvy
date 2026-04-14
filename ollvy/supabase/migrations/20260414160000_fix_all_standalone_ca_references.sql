-- Replace ALL standalone "CA" with "Ollvy CA" across every service.
-- Strategy: cast JSONB to text, protect existing "Ollvy CA" with a placeholder,
-- replace standalone patterns, then restore placeholder and cast back.
-- Also fix plain text columns (seo_description, short_description).

-- Helper: takes a text blob, replaces standalone CA patterns, returns fixed text.
CREATE OR REPLACE FUNCTION _fix_ca(t text) RETURNS text AS $$
DECLARE r text := t;
BEGIN
  -- 1. Protect existing correct references
  r := replace(r, 'Ollvy CA', '{{OLLVY_CA}}');
  r := replace(r, 'ollvy CA', '{{OLLVY_CA}}');

  -- 2. Replace all standalone CA patterns
  r := replace(r, 'Your CA',       '{{OLLVY_CA}}');
  r := replace(r, 'your CA',       '{{OLLVY_CA}}');
  r := replace(r, 'Dedicated CA',  'Dedicated {{OLLVY_CA}}');
  r := replace(r, 'by CA',         'by {{OLLVY_CA}}');
  r := replace(r, 'a CA.',          'an {{OLLVY_CA}}.');
  r := replace(r, 'a CA,',          'an {{OLLVY_CA}},');
  r := replace(r, 'by a CA',        'by an {{OLLVY_CA}}');
  r := replace(r, 'handled by a CA','handled by an {{OLLVY_CA}}');
  r := replace(r, 'from a CA',      'from an {{OLLVY_CA}}');
  -- "CA " at start of a value or after newline
  r := replace(r, E'\nCA ',        E'\nOllvy CA ');
  -- Remaining standalone "CA " patterns (sentence-start after period, after dash, etc.)
  r := replace(r, '. CA ',         '. Ollvy CA ');
  r := replace(r, '— CA ',        '— Ollvy CA ');
  r := replace(r, '- CA ',         '- Ollvy CA ');
  -- Common verb patterns
  r := replace(r, 'CA assigned',   '{{OLLVY_CA}} assigned');
  r := replace(r, 'CA reviews',    '{{OLLVY_CA}} reviews');
  r := replace(r, 'CA reviewed',   '{{OLLVY_CA}} reviewed');
  r := replace(r, 'CA files',      '{{OLLVY_CA}} files');
  r := replace(r, 'CA prepares',   '{{OLLVY_CA}} prepares');
  r := replace(r, 'CA prepared',   '{{OLLVY_CA}} prepared');
  r := replace(r, 'CA responds',   '{{OLLVY_CA}} responds');
  r := replace(r, 'CA calculates', '{{OLLVY_CA}} calculates');
  r := replace(r, 'CA checks',     '{{OLLVY_CA}} checks');
  r := replace(r, 'CA handles',    '{{OLLVY_CA}} handles');
  r := replace(r, 'CA will',       '{{OLLVY_CA}} will');
  r := replace(r, 'CA sends',      '{{OLLVY_CA}} sends');
  r := replace(r, 'CA drafts',     '{{OLLVY_CA}} drafts');
  r := replace(r, 'CA completes',  '{{OLLVY_CA}} completes');
  r := replace(r, 'CA fills',      '{{OLLVY_CA}} fills');
  r := replace(r, 'CA is assigned','{{OLLVY_CA}} is assigned');
  r := replace(r, 'CA submits',    '{{OLLVY_CA}} submits');
  r := replace(r, 'CA matches',    '{{OLLVY_CA}} matches');
  r := replace(r, 'CA verifies',   '{{OLLVY_CA}} verifies');

  -- 3. Restore placeholder
  r := replace(r, '{{OLLVY_CA}}', 'Ollvy CA');

  RETURN r;
END;
$$ LANGUAGE plpgsql;

-- Fix JSONB columns
UPDATE services SET
  process_steps  = _fix_ca(process_steps::text)::jsonb,
  whats_included = _fix_ca(whats_included::text)::jsonb,
  service_risks  = _fix_ca(service_risks::text)::jsonb,
  faqs           = _fix_ca(faqs::text)::jsonb;

-- Fix plain text columns
UPDATE services SET
  seo_description   = _fix_ca(seo_description),
  short_description = _fix_ca(short_description);

-- Clean up
DROP FUNCTION _fix_ca(text);
