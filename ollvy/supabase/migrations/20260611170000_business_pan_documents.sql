-- business-pan had a full questionnaire but ZERO document templates, so nothing
-- was actually collected to file the entity PAN. Add the core documents.
-- (tips is a text[] column.)

DELETE FROM service_document_templates sdt
USING service_packages sp
WHERE sdt.service_package_id = sp.id
  AND sp.slug = 'business-pan'
  AND sdt.document_key IN ('entity_registration_proof','office_address_proof','signatory_id_proof');

INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url, condition)
SELECT sp.id, d.document_key, d.document_label, d.description, 'doc_collection', d.is_required, d.display_order, d.tips::text[], NULL, NULL
FROM service_packages sp,
(VALUES
  ('entity_registration_proof','Entity registration proof','Certificate of Incorporation (company), Partnership Deed, LLP Agreement, Trust Deed, or Society registration - whichever applies to your entity.',true,1,'{"Must show the entity name exactly as it will appear on the PAN","Scan all pages, legible"}'),
  ('office_address_proof','Registered office address proof','A recent utility bill (electricity / water / telephone) or the rent / lease agreement for the registered office.',true,2,'{"Utility bills should not be older than 3 months","Address must match the application"}'),
  ('signatory_id_proof','Authorised signatory PAN & Aadhaar','PAN and Aadhaar of the person authorised to sign on behalf of the entity.',true,3,'{"Name should match the signatory details entered in the form"}')
) AS d(document_key, document_label, description, is_required, display_order, tips)
WHERE sp.slug = 'business-pan';
