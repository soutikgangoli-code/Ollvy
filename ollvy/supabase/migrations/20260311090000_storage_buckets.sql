-- Storage Buckets Migration
-- Creates storage buckets per §16 spec

-- Create storage buckets if they don't exist
-- Note: In Supabase, buckets are typically created via dashboard or API,
-- but we can use SQL for the storage schema

-- Ensure storage schema exists
DO $$
BEGIN
    -- Create avatars bucket (public read)
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'avatars',
        'avatars',
        true,
        5242880, -- 5MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    )
    ON CONFLICT (id) DO UPDATE SET
        public = true,
        file_size_limit = 5242880;

    -- Create documents bucket (private)
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'documents',
        'documents',
        false,
        52428800, -- 50MB
        ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    )
    ON CONFLICT (id) DO UPDATE SET
        public = false,
        file_size_limit = 52428800;

    -- Create certifications bucket (private)
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'certifications',
        'certifications',
        false,
        10485760, -- 10MB
        ARRAY['application/pdf', 'image/jpeg', 'image/png']
    )
    ON CONFLICT (id) DO UPDATE SET
        public = false,
        file_size_limit = 10485760;

    -- Create invoices bucket (private)
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'invoices',
        'invoices',
        false,
        10485760, -- 10MB
        ARRAY['application/pdf']
    )
    ON CONFLICT (id) DO UPDATE SET
        public = false,
        file_size_limit = 10485760;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Buckets may already exist or storage extension not enabled: %', SQLERRM;
END $$;

-- Storage RLS Policies
-- Note: These are created on storage.objects table

-- Avatars: Public read, authenticated write own
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_auth_insert" ON storage.objects;
CREATE POLICY "avatars_auth_insert" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "avatars_auth_update" ON storage.objects;
CREATE POLICY "avatars_auth_update" ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "avatars_auth_delete" ON storage.objects;
CREATE POLICY "avatars_auth_delete" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Documents: Users can read/write their own documents
DROP POLICY IF EXISTS "documents_user_read" ON storage.objects;
CREATE POLICY "documents_user_read" ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'documents'
        AND (
            -- User's own documents
            (storage.foldername(name))[1] = auth.uid()::text
            OR
            -- Professionals can read documents for their assigned orders
            EXISTS (
                SELECT 1 FROM orders o
                JOIN professionals p ON o.professional_id = p.id
                WHERE p.auth_user_id = auth.uid()
                AND o.id::text = (storage.foldername(name))[1]
            )
        )
    );

DROP POLICY IF EXISTS "documents_user_insert" ON storage.objects;
CREATE POLICY "documents_user_insert" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'documents'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR
            EXISTS (
                SELECT 1 FROM orders o
                JOIN professionals p ON o.professional_id = p.id
                WHERE p.auth_user_id = auth.uid()
                AND o.id::text = (storage.foldername(name))[1]
            )
        )
    );

-- Certifications: Professionals can read/write their own, admins can read all
DROP POLICY IF EXISTS "certifications_professional_access" ON storage.objects;
CREATE POLICY "certifications_professional_access" ON storage.objects
    FOR ALL
    TO authenticated
    USING (
        bucket_id = 'certifications'
        AND (
            -- Professional's own certs
            EXISTS (
                SELECT 1 FROM professionals p
                WHERE p.auth_user_id = auth.uid()
                AND p.id::text = (storage.foldername(name))[1]
            )
            OR
            -- Admin access
            EXISTS (
                SELECT 1 FROM admin_users
                WHERE auth_user_id = auth.uid()
                AND is_active = true
            )
        )
    );

-- Invoices: Users can read their own invoices
DROP POLICY IF EXISTS "invoices_user_read" ON storage.objects;
CREATE POLICY "invoices_user_read" ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'invoices'
        AND EXISTS (
            SELECT 1 FROM users u
            WHERE u.auth_user_id = auth.uid()
            AND u.id::text = (storage.foldername(name))[1]
        )
    );

-- Service role can do anything on all buckets
DROP POLICY IF EXISTS "service_role_full_access" ON storage.objects;
CREATE POLICY "service_role_full_access" ON storage.objects
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add missing columns to professional_applications if not exists
DO $$
BEGIN
    -- Check if professional_applications table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'professional_applications') THEN
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professional_applications' AND column_name = 'services_offered') THEN
            ALTER TABLE professional_applications ADD COLUMN services_offered text[] DEFAULT '{}';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professional_applications' AND column_name = 'monthly_capacity') THEN
            ALTER TABLE professional_applications ADD COLUMN monthly_capacity int DEFAULT 5;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professional_applications' AND column_name = 'linkedin_url') THEN
            ALTER TABLE professional_applications ADD COLUMN linkedin_url text;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professional_applications' AND column_name = 'bar_council_number') THEN
            ALTER TABLE professional_applications ADD COLUMN bar_council_number text;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'professional_applications' AND column_name = 'icai_membership') THEN
            ALTER TABLE professional_applications ADD COLUMN icai_membership text;
        END IF;
    END IF;
END $$;

-- Add notifications table if not exists
-- Only create if table doesn't exist already
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public') THEN
        CREATE TABLE notifications (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES users(id) ON DELETE CASCADE,
            type text NOT NULL,
            title text NOT NULL,
            body text NOT NULL,
            data jsonb DEFAULT '{}',
            read boolean DEFAULT false,
            created_at timestamptz DEFAULT now()
        );

        CREATE INDEX idx_notifications_user_id ON notifications(user_id);
        CREATE INDEX idx_notifications_read ON notifications(user_id, read);

        ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "notifications_user_read" ON notifications
            FOR SELECT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM users u
                    WHERE u.auth_user_id = auth.uid()
                    AND u.id = notifications.user_id
                )
            );

        CREATE POLICY "notifications_user_update" ON notifications
            FOR UPDATE
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM users u
                    WHERE u.auth_user_id = auth.uid()
                    AND u.id = notifications.user_id
                )
            );
    END IF;
END $$;
