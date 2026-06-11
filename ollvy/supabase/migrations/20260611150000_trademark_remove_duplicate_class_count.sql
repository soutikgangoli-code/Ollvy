-- Trademark reconciliation: the number of classes is now captured in the
-- pre-questionnaire (trademark_class_count, which drives the price), so the
-- duplicate post-payment "class_count" question is removed. Goods/services are
-- captured per-class in the post-payment step (injected at load time) for >1
-- class, and via the general goods_services_description for a single class.
DELETE FROM service_questionnaires sq
USING service_packages sp
WHERE sq.service_package_id = sp.id
  AND sp.slug = 'trademark-registration'
  AND sq.is_pre_payment = false
  AND sq.question_key = 'class_count';
