BEGIN;

-- Fix "Your CA" -> "Ollvy CA" in GST Registration FAQ
UPDATE service_packages
SET faqs = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'a' LIKE '%Your CA%'
      THEN jsonb_set(elem, '{a}', to_jsonb(replace(elem->>'a', 'Your CA', 'Ollvy CA')))
      ELSE elem
    END
  )
  FROM jsonb_array_elements(faqs) AS elem
),
updated_at = now()
WHERE slug = 'gst-registration';

COMMIT;
