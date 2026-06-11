-- Cloud-kitchen-setup had only a phone-number question despite 12 document
-- templates and a Rs 19,999 price. Add a proper post-payment questionnaire so the
-- team can scope the FSSAI licence tier, food categories, premises and GST.

DELETE FROM service_questionnaires sq
USING service_packages sp
WHERE sq.service_package_id = sp.id
  AND sp.slug = 'cloud-kitchen-setup'
  AND sq.question_key IN (
    'entity_type','business_name','owner_name','owner_pan','owner_aadhaar',
    'kitchen_address','kitchen_state','kitchen_city','kitchen_pincode','food_type',
    'food_categories','annual_turnover','premises_ownership','has_gst','gstin'
  );

INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options, validation, help_text, depends_on, step_number, display_order, is_active, is_pre_payment)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.help_text, q.depends_on::jsonb, q.step_number, q.display_order, true, false
FROM service_packages sp,
(VALUES
  -- Step 1: business / owner
  ('entity_type','Type of entity','select','[{"value":"proprietorship","label":"Proprietorship"},{"value":"partnership","label":"Partnership"},{"value":"llp","label":"LLP"},{"value":"pvt_ltd","label":"Private Limited Company"},{"value":"other","label":"Other"}]','{"required":true}',NULL,NULL,1,2),
  ('business_name','Business / brand name','text',NULL,'{"required":true}',NULL,NULL,1,3),
  ('owner_name','Owner / proprietor name','text',NULL,'{"required":true}',NULL,NULL,1,4),
  ('owner_pan','Owner / entity PAN','text',NULL,'{"required":true}',NULL,NULL,1,5),
  ('owner_aadhaar','Owner Aadhaar number','text',NULL,'{"required":true}','Must be linked to an active mobile - FSSAI sends an OTP.',NULL,1,6),
  -- Step 2: kitchen / FSSAI
  ('kitchen_address','Kitchen address','textarea',NULL,'{"required":true}','The exact premises where food is prepared.',NULL,2,1),
  ('kitchen_state','State','text',NULL,'{"required":true}',NULL,NULL,2,2),
  ('kitchen_city','City','text',NULL,'{"required":true}',NULL,NULL,2,3),
  ('kitchen_pincode','Pincode','text',NULL,'{"required":true}',NULL,NULL,2,4),
  ('food_type','Type of food served','select','[{"value":"veg","label":"Vegetarian only"},{"value":"non_veg","label":"Non-vegetarian"},{"value":"both","label":"Both veg & non-veg"}]','{"required":true}',NULL,NULL,2,5),
  ('food_categories','What do you make / sell?','multiselect','[{"value":"cooked_meals","label":"Cooked meals"},{"value":"bakery","label":"Bakery & confectionery"},{"value":"beverages","label":"Beverages & juices"},{"value":"desserts","label":"Desserts & ice cream"},{"value":"snacks","label":"Snacks & namkeen"},{"value":"packaged","label":"Packaged / pre-packed foods"},{"value":"dairy","label":"Dairy products"}]','{"required":true}','Pick all that apply.',NULL,2,6),
  ('annual_turnover','Expected annual turnover','select','[{"value":"upto_12l","label":"Up to Rs 12 lakh"},{"value":"12l_to_20cr","label":"Rs 12 lakh - Rs 20 crore"},{"value":"above_20cr","label":"Above Rs 20 crore"}]','{"required":true}','This sets your FSSAI licence tier: Basic registration, State licence, or Central licence.',NULL,2,7),
  ('premises_ownership','Premises ownership','select','[{"value":"owned","label":"Owned"},{"value":"rented","label":"Rented / leased"}]','{"required":true}',NULL,NULL,2,8),
  -- Step 3: GST
  ('has_gst','Do you already have GST registration?','radio','[{"value":"yes","label":"Yes"},{"value":"no","label":"No, I need it"}]','{"required":true}',NULL,NULL,3,1),
  ('gstin','GSTIN','text',NULL,'{"required":false}',NULL,'{"question_key":"has_gst","value":"yes"}',3,2)
) AS q(question_key, question_label, question_type, options, validation, help_text, depends_on, step_number, display_order)
WHERE sp.slug = 'cloud-kitchen-setup';
