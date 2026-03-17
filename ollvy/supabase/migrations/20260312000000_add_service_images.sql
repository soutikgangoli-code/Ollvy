-- Add image support to service_packages
-- This allows each service to have an optional cover image

ALTER TABLE service_packages
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS icon_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN service_packages.image_url IS 'URL to the service cover image (stored in Supabase Storage)';
COMMENT ON COLUMN service_packages.icon_name IS 'Lucide icon name for the service (e.g., FileText, Shield, Scale)';
