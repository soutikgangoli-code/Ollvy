-- Trim whats_included body text for ALL services:
--   • Items WITH comparisonWithout/comparisonWithOllvy cards → remove body entirely
--   • Items WITHOUT comparison cards → keep only the first line

CREATE OR REPLACE FUNCTION _trim_included() RETURNS void AS $$
DECLARE
  svc RECORD;
  arr jsonb;
  item jsonb;
  new_arr jsonb := '[]'::jsonb;
  body_text text;
  first_line text;
BEGIN
  FOR svc IN SELECT id, whats_included FROM service_packages WHERE whats_included IS NOT NULL LOOP
    new_arr := '[]'::jsonb;
    FOR item IN SELECT * FROM jsonb_array_elements(svc.whats_included) LOOP
      IF item ? 'comparisonWithout' OR item ? 'comparisonWithOllvy' THEN
        -- Has comparison cards → remove body
        item := item - 'body';
      ELSE
        -- No comparison cards → keep first line only
        body_text := item->>'body';
        IF body_text IS NOT NULL AND body_text LIKE E'%\n%' THEN
          first_line := split_part(body_text, E'\n', 1);
          item := jsonb_set(item, '{body}', to_jsonb(first_line));
        END IF;
      END IF;
      new_arr := new_arr || jsonb_build_array(item);
    END LOOP;
    UPDATE service_packages SET whats_included = new_arr WHERE id = svc.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT _trim_included();
DROP FUNCTION _trim_included();
