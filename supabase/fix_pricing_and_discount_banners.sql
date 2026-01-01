-- ============================================
-- Fix Pricing Plans and Discount Banners
-- ============================================

-- 1. Add published column to pricing_plans table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'pricing_plans' 
        AND column_name = 'published'
    ) THEN
        ALTER TABLE pricing_plans 
        ADD COLUMN published BOOLEAN DEFAULT true;
        
        -- Update all existing active plans to be published by default
        UPDATE pricing_plans 
        SET published = true 
        WHERE active = true;
        
        -- Also set published = true for any plans that don't have it set (safety check)
        UPDATE pricing_plans 
        SET published = true 
        WHERE published IS NULL;
    END IF;
END $$;

-- 2. Ensure feature_flags table exists with correct structure
DO $$ 
BEGIN
    -- Check if table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'feature_flags'
    ) THEN
        -- Table exists, check if 'key' column exists and 'name' doesn't
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'feature_flags' 
            AND column_name = 'key'
        ) AND NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'feature_flags' 
            AND column_name = 'name'
        ) THEN
            -- Rename 'key' column to 'name'
            ALTER TABLE feature_flags RENAME COLUMN "key" TO "name";
        END IF;
    ELSE
        -- Table doesn't exist, create it
        CREATE TABLE feature_flags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            enabled BOOLEAN DEFAULT false,
            config JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    
    -- Ensure all required columns exist (add missing ones)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feature_flags' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE feature_flags ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feature_flags' 
        AND column_name = 'enabled'
    ) THEN
        ALTER TABLE feature_flags ADD COLUMN enabled BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feature_flags' 
        AND column_name = 'config'
    ) THEN
        ALTER TABLE feature_flags ADD COLUMN config JSONB;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feature_flags' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE feature_flags ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feature_flags' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE feature_flags ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON feature_flags(name);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

-- Enable RLS (Row Level Security)
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to enabled feature flags" ON feature_flags;
DROP POLICY IF EXISTS "Allow authenticated users to read all feature flags" ON feature_flags;
DROP POLICY IF EXISTS "Allow admins to manage feature flags" ON feature_flags;

-- Create policy to allow public read access (for discount banners on public pages)
CREATE POLICY "Allow public read access to enabled feature flags"
ON feature_flags
FOR SELECT
TO public
USING (enabled = true);

-- Create policy to allow authenticated users to read all feature flags
CREATE POLICY "Allow authenticated users to read all feature flags"
ON feature_flags
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow admins to manage feature flags
CREATE POLICY "Allow admins to manage feature flags"
ON feature_flags
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role = 'admin'
    )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feature_flags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_feature_flags_updated_at ON feature_flags;
CREATE TRIGGER update_feature_flags_updated_at
    BEFORE UPDATE ON feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_feature_flags_updated_at();

