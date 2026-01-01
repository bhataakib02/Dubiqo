-- Add published column to pricing_plans table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'pricing_plans' 
        AND column_name = 'published'
    ) THEN
        ALTER TABLE pricing_plans 
        ADD COLUMN published BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update existing plans to be published by default if they are active
UPDATE pricing_plans 
SET published = true 
WHERE active = true AND published IS NULL;

