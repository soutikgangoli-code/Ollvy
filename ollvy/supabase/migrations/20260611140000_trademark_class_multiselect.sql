-- Trademark class questions:
--  1. "How many classes?" becomes a friendly select (1-5) instead of a free number.
--     It still drives the price (govt fee = rate x number of classes).
--  2. A new conditional multi-select "Which classes?" appears only when the user
--     picks more than one class. It captures the specific NICE classes (detail for
--     the lawyer / post-payment), and does NOT change the price (count drives price).

-- 1. Class count -> select 1..5
UPDATE service_questionnaires
SET question_type = 'select',
    options = '[
      {"value":"1","label":"1 class"},
      {"value":"2","label":"2 classes"},
      {"value":"3","label":"3 classes"},
      {"value":"4","label":"4 classes"},
      {"value":"5","label":"5 or more"}
    ]'::jsonb,
    validation = '{"required": true}'::jsonb
WHERE question_key = 'trademark_class_count';

-- 2. New conditional multi-select of NICE classes (shown when count > 1)
DELETE FROM service_questionnaires sq
USING service_packages sp
WHERE sq.service_package_id = sp.id
  AND sp.slug = 'trademark-registration'
  AND sq.question_key = 'trademark_classes';

INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options, validation,
   help_text, depends_on, step_number, display_order, is_active, is_pre_payment)
SELECT
  sp.id,
  'trademark_classes',
  'Which classes do you need?',
  'multiselect',
  '[
    {"value":"1","label":"Class 1 - Chemicals & industrial"},
    {"value":"2","label":"Class 2 - Paints & coatings"},
    {"value":"3","label":"Class 3 - Cosmetics & cleaning"},
    {"value":"4","label":"Class 4 - Oils, lubricants & fuels"},
    {"value":"5","label":"Class 5 - Pharmaceuticals & healthcare"},
    {"value":"6","label":"Class 6 - Metals & hardware"},
    {"value":"7","label":"Class 7 - Machinery"},
    {"value":"8","label":"Class 8 - Hand tools"},
    {"value":"9","label":"Class 9 - Software, electronics & apps"},
    {"value":"10","label":"Class 10 - Medical devices"},
    {"value":"11","label":"Class 11 - Appliances (lighting, heating)"},
    {"value":"12","label":"Class 12 - Vehicles"},
    {"value":"13","label":"Class 13 - Firearms"},
    {"value":"14","label":"Class 14 - Jewellery & watches"},
    {"value":"15","label":"Class 15 - Musical instruments"},
    {"value":"16","label":"Class 16 - Paper, books & stationery"},
    {"value":"17","label":"Class 17 - Rubber & plastics"},
    {"value":"18","label":"Class 18 - Leather goods & bags"},
    {"value":"19","label":"Class 19 - Building materials"},
    {"value":"20","label":"Class 20 - Furniture"},
    {"value":"21","label":"Class 21 - Household & kitchenware"},
    {"value":"22","label":"Class 22 - Ropes, tents & raw textiles"},
    {"value":"23","label":"Class 23 - Yarns & threads"},
    {"value":"24","label":"Class 24 - Textiles & fabrics"},
    {"value":"25","label":"Class 25 - Clothing, footwear & headgear"},
    {"value":"26","label":"Class 26 - Lace, ribbons & embroidery"},
    {"value":"27","label":"Class 27 - Carpets & flooring"},
    {"value":"28","label":"Class 28 - Toys, games & sporting goods"},
    {"value":"29","label":"Class 29 - Meat, dairy & processed foods"},
    {"value":"30","label":"Class 30 - Coffee, tea, bakery & staples"},
    {"value":"31","label":"Class 31 - Agriculture & fresh produce"},
    {"value":"32","label":"Class 32 - Beverages (non-alcoholic) & beer"},
    {"value":"33","label":"Class 33 - Alcoholic beverages"},
    {"value":"34","label":"Class 34 - Tobacco & smokers articles"},
    {"value":"35","label":"Class 35 - Advertising, retail & business"},
    {"value":"36","label":"Class 36 - Finance & insurance"},
    {"value":"37","label":"Class 37 - Construction & repair"},
    {"value":"38","label":"Class 38 - Telecommunications"},
    {"value":"39","label":"Class 39 - Transport & logistics"},
    {"value":"40","label":"Class 40 - Manufacturing & material treatment"},
    {"value":"41","label":"Class 41 - Education & entertainment"},
    {"value":"42","label":"Class 42 - IT, science & technology services"},
    {"value":"43","label":"Class 43 - Food & drink services (restaurants)"},
    {"value":"44","label":"Class 44 - Medical & beauty services"},
    {"value":"45","label":"Class 45 - Legal & security services"}
  ]'::jsonb,
  '{"required": false}'::jsonb,
  'Search and pick the categories your brand sells in. Pick all that apply.',
  '{"question_key": "trademark_class_count", "values": ["2","3","4","5"]}'::jsonb,
  3,
  2,
  true,
  true
FROM service_packages sp
WHERE sp.slug = 'trademark-registration';
