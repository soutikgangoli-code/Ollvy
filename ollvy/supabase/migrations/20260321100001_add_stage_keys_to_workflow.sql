-- =============================================================================
-- Migration: Step 1d - Add stage_key to workflow_stages JSONB
-- Maps each workflow step to its corresponding stage_key for document filtering
-- =============================================================================

-- =============================================================================
-- Pvt Ltd Incorporation
-- step 1,2 = null (questionnaire/docs), step 3 = dsc_applied, step 4 = name_approval,
-- step 5 = spice_filed, step 6 = incorporation_certificate
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "dsc_applied"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "name_approval"}'::jsonb
      WHEN (elem->>'step')::int = 5 THEN elem || '{"stage_key": "spice_filed"}'::jsonb
      WHEN (elem->>'step')::int = 6 THEN elem || '{"stage_key": "incorporation_certificate"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'pvt-ltd-incorporation';


-- =============================================================================
-- LLP Incorporation
-- step 1,2 = null, step 3 = dpin_applied, step 4 = name_approval,
-- step 5 = fillip_filed, step 6 = incorporation_certificate
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "dpin_applied"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "name_approval"}'::jsonb
      WHEN (elem->>'step')::int = 5 THEN elem || '{"stage_key": "fillip_filed"}'::jsonb
      WHEN (elem->>'step')::int = 6 THEN elem || '{"stage_key": "incorporation_certificate"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'llp-incorporation';


-- =============================================================================
-- OPC Incorporation
-- step 1,2 = null, step 3 = dsc_applied, step 4 = name_approval,
-- step 5 = spice_filed, step 6 = incorporation_certificate
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "dsc_applied"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "name_approval"}'::jsonb
      WHEN (elem->>'step')::int = 5 THEN elem || '{"stage_key": "spice_filed"}'::jsonb
      WHEN (elem->>'step')::int = 6 THEN elem || '{"stage_key": "incorporation_certificate"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'opc-incorporation';


-- =============================================================================
-- GST Registration
-- step 1,2 = null, step 3 = application_filed, step 4 = officer_query_handled,
-- step 5 = gstin_issued
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "officer_query_handled"}'::jsonb
      WHEN (elem->>'step')::int = 5 THEN elem || '{"stage_key": "gstin_issued"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'gst-registration';


-- =============================================================================
-- Trademark Registration
-- step 1 = null, step 2 = tm_application_filed, step 3 = examination_report,
-- step 4 = tm_published, step 5 = tm_registered
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": "tm_application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "examination_report"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "tm_published"}'::jsonb
      WHEN (elem->>'step')::int = 5 THEN elem || '{"stage_key": "tm_registered"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'trademark-registration';


-- =============================================================================
-- Partnership Registration
-- step 1 = null, step 2 = deed_drafting, step 3 = deed_drafting (review),
-- step 4 = deed_registration, step 5 = registration_complete
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": "deed_drafting"}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "deed_drafting"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "deed_registration"}'::jsonb
      WHEN (elem->>'step')::int = 5 THEN elem || '{"stage_key": "registration_complete"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'partnership-registration';


-- =============================================================================
-- Shop & Establishment
-- step 1 = null, step 2 = application_filed, step 3 = application_filed,
-- step 4 = certificate_issued
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": "application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "certificate_issued"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'shop-establishment';


-- =============================================================================
-- MSME Registration
-- step 1,2 = null, step 3 = certificate_issued
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "certificate_issued"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'msme-registration';


-- =============================================================================
-- IEC Code
-- step 1,2 = null, step 3 = application_filed, step 4 = iec_issued
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "iec_issued"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'iec-code';


-- =============================================================================
-- Professional Tax
-- step 1 = null, step 2 = application_filed, step 3 = certificate_issued
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": "application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "certificate_issued"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'professional-tax';


-- =============================================================================
-- ESI Registration
-- step 1 = null, step 2,3 = application_filed, step 4 = registration_certificate
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": "application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "registration_certificate"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'esi-registration';


-- =============================================================================
-- PF Registration
-- step 1,2 = null, step 3 = application_filed, step 4 = registration_certificate
-- =============================================================================

UPDATE service_packages
SET workflow_stages = (
  SELECT jsonb_agg(
    CASE
      WHEN (elem->>'step')::int = 1 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 2 THEN elem || '{"stage_key": null}'::jsonb
      WHEN (elem->>'step')::int = 3 THEN elem || '{"stage_key": "application_filed"}'::jsonb
      WHEN (elem->>'step')::int = 4 THEN elem || '{"stage_key": "registration_certificate"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(workflow_stages) AS elem
)
WHERE slug = 'pf-registration';
