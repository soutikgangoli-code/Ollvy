-- Add default icons to services based on their category/type

-- CA Services - Calculator icon
UPDATE service_packages SET icon_name = 'Calculator' WHERE slug LIKE '%gst%' OR slug LIKE '%itr%' OR slug LIKE '%tax%' OR slug LIKE '%audit%';

-- Company/Incorporation - Building2 icon
UPDATE service_packages SET icon_name = 'Building2' WHERE slug LIKE '%incorporation%' OR slug LIKE '%pvt-ltd%' OR slug LIKE '%llp%' OR slug LIKE '%opc%' OR slug LIKE '%partnership%';

-- Legal - Scale icon
UPDATE service_packages SET icon_name = 'Scale' WHERE slug LIKE '%agreement%' OR slug LIKE '%contract%' OR slug LIKE '%legal%' OR slug LIKE '%notice%' OR slug LIKE '%dispute%';

-- Compliance/ROC - FileCheck icon
UPDATE service_packages SET icon_name = 'FileCheck' WHERE slug LIKE '%roc%' OR slug LIKE '%annual%' OR slug LIKE '%compliance%' OR slug LIKE '%filing%';

-- Licensing - Shield icon
UPDATE service_packages SET icon_name = 'Shield' WHERE slug LIKE '%fssai%' OR slug LIKE '%iec%' OR slug LIKE '%license%' OR slug LIKE '%registration%';

-- Payroll/HR - Users icon
UPDATE service_packages SET icon_name = 'Users' WHERE slug LIKE '%payroll%' OR slug LIKE '%pf%' OR slug LIKE '%esi%' OR slug LIKE '%employee%';

-- Government - Landmark icon
UPDATE service_packages SET icon_name = 'Landmark' WHERE slug LIKE '%govt%' OR slug LIKE '%government%' OR slug LIKE '%msme%';

-- Default to FileText for any remaining
UPDATE service_packages SET icon_name = 'FileText' WHERE icon_name IS NULL;
