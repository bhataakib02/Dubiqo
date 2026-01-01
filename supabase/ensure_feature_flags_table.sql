-- Ensure feature_flags table exists with correct structure
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON feature_flags(name);

-- Create index on enabled for filtering
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

-- Enable RLS (Row Level Security)
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for discount banners on public pages)
CREATE POLICY IF NOT EXISTS "Allow public read access to enabled feature flags"
ON feature_flags
FOR SELECT
TO public
USING (enabled = true);

-- Create policy to allow authenticated users to read all feature flags
CREATE POLICY IF NOT EXISTS "Allow authenticated users to read all feature flags"
ON feature_flags
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow admins to manage feature flags
CREATE POLICY IF NOT EXISTS "Allow admins to manage feature flags"
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

