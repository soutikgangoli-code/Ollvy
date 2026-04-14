-- Trim whats_included body to ONE sentence for ALL active services:
--   • Items WITH comparisonWithout/comparisonWithOllvy → remove body (already done, re-enforce)
--   • Items WITHOUT comparison cards → keep only the first sentence

CREATE OR REPLACE FUNCTION _trim_included_sentences() RETURNS void AS $$
DECLARE
  svc RECORD;
  item jsonb;
  new_arr jsonb;
  body_text text;
  first_sentence text;
  dot_pos int;
BEGIN
  FOR svc IN SELECT id, whats_included FROM service_packages WHERE is_active = true AND whats_included IS NOT NULL LOOP
    new_arr := '[]'::jsonb;
    FOR item IN SELECT * FROM jsonb_array_elements(svc.whats_included) LOOP
      IF item ? 'comparisonWithout' OR item ? 'comparisonWithOllvy' THEN
        -- Has comparison cards → ensure body is removed
        item := item - 'body';
      ELSE
        body_text := item->>'body';
        IF body_text IS NOT NULL AND length(body_text) > 0 THEN
          -- Keep only the first sentence: find the first ". " or ".\n"
          -- But preserve the period
          dot_pos := position('. ' in body_text);
          IF dot_pos > 0 THEN
            first_sentence := left(body_text, dot_pos); -- includes the period
            item := jsonb_set(item, '{body}', to_jsonb(first_sentence));
          ELSE
            -- No ". " found — check if it ends with a period and has content after \n
            dot_pos := position(E'.\n' in body_text);
            IF dot_pos > 0 THEN
              first_sentence := left(body_text, dot_pos);
              item := jsonb_set(item, '{body}', to_jsonb(first_sentence));
            END IF;
            -- Otherwise it's already a single sentence, keep as-is
          END IF;
        END IF;
      END IF;
      new_arr := new_arr || jsonb_build_array(item);
    END LOOP;
    UPDATE service_packages SET whats_included = new_arr WHERE id = svc.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT _trim_included_sentences();
DROP FUNCTION _trim_included_sentences();
